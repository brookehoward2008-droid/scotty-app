import { and, desc, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { z } from "zod";
import {
  scottyBookings,
  scottyScheduleLocks,
  scottySessions,
  scottyWallets,
  scottyWalletTransactions,
} from "../drizzle/schema";
import {
  fareBreakdown,
  RIDES,
  searchRides,
  type Booking,
} from "../shared/scotty";
import { getDb } from "./db";
import { publicProcedure, router } from "./_core/trpc";

const INITIAL_DEMO_CREDITS = 500;
const TOKEN_PATTERN = /^[a-f0-9]{64}$/i;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const tokenSchema = z
  .string()
  .regex(TOKEN_PATTERN, "Invalid Scotty guest token.");

const dateSchema = z
  .string()
  .regex(DATE_PATTERN, "date must be YYYY-MM-DD.")
  .refine(isValidCalendarDate, "date must be a real UTC calendar date.");

const bookingInputSchema = z.object({
  token: tokenSchema,
  rideId: z.string().min(1).max(64),
  date: dateSchema,
  passengers: z.number().int().min(1).max(8),
  requestId: z
    .string()
    .trim()
    .min(8)
    .max(96)
    .regex(/^[A-Za-z0-9_-]+$/, "requestId may only contain letters, numbers, _ and -."),
});

const cancelInputSchema = z.object({
  token: tokenSchema,
  bookingId: z.string().uuid(),
});

type ScottyDatabase = NonNullable<Awaited<ReturnType<typeof getDb>>>;

type PublicWalletTransaction = {
  id: string;
  label: string;
  amount: number;
  createdAt: string;
};

function isValidCalendarDate(date: string): boolean {
  const parsed = new Date(`${date}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(date);
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function unavailableError(): TRPCError {
  return new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Scotty service is temporarily unavailable. Please try again.",
  });
}

/**
 * Database access is mandatory for all Scotty state. Unlike local-only demos, this
 * deliberately never falls back to in-memory credit or booking data.
 */
async function withScottyDatabase<T>(
  operation: (db: ScottyDatabase) => Promise<T>,
): Promise<T> {
  let db: ScottyDatabase | null;
  try {
    db = await getDb();
  } catch (error) {
    console.error("[Scotty] database initialization failed", error);
    throw unavailableError();
  }

  if (!db) throw unavailableError();

  try {
    return await operation(db);
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    console.error("[Scotty] database operation failed", error);
    throw unavailableError();
  }
}

async function requireGuestSession(db: ScottyDatabase, token: string): Promise<string> {
  const tokenHash = hashToken(token);
  const [session] = await db
    .select({ tokenHash: scottySessions.tokenHash })
    .from(scottySessions)
    .where(eq(scottySessions.tokenHash, tokenHash))
    .limit(1);

  if (!session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid or expired Scotty guest session.",
    });
  }

  return tokenHash;
}

function toBooking(row: typeof scottyBookings.$inferSelect): Booking {
  return {
    id: row.id,
    rideId: row.rideId,
    date: row.date,
    passengers: row.passengers,
    total: row.total,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    reference: row.reference,
  };
}

function hasSameBookingRequest(
  booking: typeof scottyBookings.$inferSelect,
  input: z.infer<typeof bookingInputSchema>,
): boolean {
  return (
    booking.rideId === input.rideId &&
    booking.date === input.date &&
    booking.passengers === input.passengers
  );
}

/** Delayed fixtures remain cancellable through their scheduled departure plus ten UTC minutes. */
function hasEffectivelyDeparted(
  ride: (typeof RIDES)[number],
  date: string,
  now = new Date(),
): boolean {
  const departureAt = new Date(`${date}T${ride.departure}:00.000Z`);
  if (ride.status === "delayed") {
    departureAt.setUTCMinutes(departureAt.getUTCMinutes() + 10);
  }
  return departureAt.getTime() <= now.getTime();
}

export const scottyRouter = router({
  /** Creates a private, anonymous guest session. The plaintext bearer token is returned once. */
  createSession: publicProcedure.mutation(async () =>
    withScottyDatabase(async (db) =>
      db.transaction(async (tx) => {
        const token = randomBytes(32).toString("hex");
        const tokenHash = hashToken(token);
        const now = new Date();
        const openingTransactionId = randomUUID();

        await tx.insert(scottySessions).values({ tokenHash, createdAt: now });
        await tx.insert(scottyWallets).values({
          sessionHash: tokenHash,
          balance: INITIAL_DEMO_CREDITS,
          createdAt: now,
          updatedAt: now,
        });
        await tx.insert(scottyWalletTransactions).values({
          id: openingTransactionId,
          sessionHash: tokenHash,
          label: "Welcome demo credits",
          amount: INITIAL_DEMO_CREDITS,
          reference: `opening:${openingTransactionId}`,
          createdAt: now,
        });

        return { token };
      }),
    ),
  ),

  wallet: publicProcedure
    .input(z.object({ token: tokenSchema }))
    .query(async ({ input }) =>
      withScottyDatabase(async (db) => {
        const sessionHash = await requireGuestSession(db, input.token);
        const [wallet] = await db
          .select({ balance: scottyWallets.balance })
          .from(scottyWallets)
          .where(eq(scottyWallets.sessionHash, sessionHash))
          .limit(1);

        if (!wallet) throw unavailableError();

        const rows = await db
          .select({
            id: scottyWalletTransactions.id,
            label: scottyWalletTransactions.label,
            amount: scottyWalletTransactions.amount,
            createdAt: scottyWalletTransactions.createdAt,
          })
          .from(scottyWalletTransactions)
          .where(eq(scottyWalletTransactions.sessionHash, sessionHash))
          .orderBy(desc(scottyWalletTransactions.createdAt));

        const transactions: PublicWalletTransaction[] = rows.map((row) => ({
          id: row.id,
          label: row.label,
          amount: row.amount,
          createdAt: row.createdAt.toISOString(),
        }));

        return { balance: wallet.balance, transactions };
      }),
    ),

  bookings: publicProcedure
    .input(z.object({ token: tokenSchema }))
    .query(async ({ input }) =>
      withScottyDatabase(async (db) => {
        const sessionHash = await requireGuestSession(db, input.token);
        const rows = await db
          .select()
          .from(scottyBookings)
          .where(eq(scottyBookings.sessionHash, sessionHash))
          .orderBy(desc(scottyBookings.createdAt));

        return rows.map(toBooking);
      }),
    ),

  /** Public fixture availability; it contains no guest/session data or PII. */
  availability: publicProcedure
    .input(z.object({ date: dateSchema }))
    .query(async ({ input }) =>
      withScottyDatabase(async (db) => {
        const confirmed = await db
          .select({
            rideId: scottyBookings.rideId,
            passengers: scottyBookings.passengers,
          })
          .from(scottyBookings)
          .where(
            and(
              eq(scottyBookings.date, input.date),
              eq(scottyBookings.status, "confirmed"),
            ),
          );
        const bookedSeats = new Map<string, number>();
        for (const booking of confirmed) {
          bookedSeats.set(
            booking.rideId,
            (bookedSeats.get(booking.rideId) ?? 0) + booking.passengers,
          );
        }

        return RIDES.map((ride) => ({
          rideId: ride.id,
          seats: Math.max(0, ride.seats - (bookedSeats.get(ride.id) ?? 0)),
        }));
      }),
    ),

  book: publicProcedure
    .input(bookingInputSchema)
    .mutation(async ({ input }) =>
      withScottyDatabase(async (db) =>
        db.transaction(async (tx) => {
          const sessionHash = hashToken(input.token);
          // Lock the guest session first: this serializes a guest's idempotency keys,
          // wallet balance, and booking/cancellation changes.
          const [session] = await tx
            .select({ tokenHash: scottySessions.tokenHash })
            .from(scottySessions)
            .where(eq(scottySessions.tokenHash, sessionHash))
            .for("update");
          if (!session) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "Invalid or expired Scotty guest session.",
            });
          }

          const [existing] = await tx
            .select()
            .from(scottyBookings)
            .where(
              and(
                eq(scottyBookings.sessionHash, sessionHash),
                eq(scottyBookings.requestId, input.requestId),
              ),
            )
            .limit(1);
          if (existing) {
            if (!hasSameBookingRequest(existing, input)) {
              throw new TRPCError({
                code: "CONFLICT",
                message: "requestId was already used for a different booking.",
              });
            }
            return toBooking(existing);
          }

          const ride = RIDES.find((candidate) => candidate.id === input.rideId);
          if (!ride) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Ride not found." });
          }
          if (ride.status === "cancelled") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "This ride is cancelled and cannot be booked.",
            });
          }

          const remainsOnSchedule = searchRides({
            origin: ride.origin,
            destination: ride.destination,
            date: input.date,
            passengers: input.passengers,
            service: "all",
          }).some((candidate) => candidate.id === ride.id);
          if (!remainsOnSchedule) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "This departure is unavailable for the selected date or passenger count.",
            });
          }

          // A deterministic lock row keeps capacity checks and the corresponding insert atomic
          // across guests, rather than relying on a stale application-level seat count.
          const scheduleLockId = `${ride.id}:${input.date}`;
          await tx
            .insert(scottyScheduleLocks)
            .values({ id: scheduleLockId, rideId: ride.id, date: input.date })
            .onDuplicateKeyUpdate({ set: { id: scheduleLockId } });
          await tx
            .select({ id: scottyScheduleLocks.id })
            .from(scottyScheduleLocks)
            .where(eq(scottyScheduleLocks.id, scheduleLockId))
            .for("update");

          const activeBookings = await tx
            .select({ passengers: scottyBookings.passengers })
            .from(scottyBookings)
            .where(
              and(
                eq(scottyBookings.rideId, ride.id),
                eq(scottyBookings.date, input.date),
                eq(scottyBookings.status, "confirmed"),
              ),
            );
          const bookedSeats = activeBookings.reduce(
            (sum, booking) => sum + booking.passengers,
            0,
          );
          if (bookedSeats + input.passengers > ride.seats) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Not enough seats remain on this ride.",
            });
          }

          const [wallet] = await tx
            .select({ balance: scottyWallets.balance })
            .from(scottyWallets)
            .where(eq(scottyWallets.sessionHash, sessionHash))
            .for("update");
          if (!wallet) throw unavailableError();

          const { total } = fareBreakdown(ride, input.passengers);
          if (wallet.balance < total) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Insufficient demo credits for this booking.",
            });
          }

          const now = new Date();
          const id = randomUUID();
          const reference = `SC-${randomBytes(5).toString("hex").toUpperCase()}`;
          await tx.insert(scottyBookings).values({
            id,
            sessionHash,
            rideId: ride.id,
            date: input.date,
            passengers: input.passengers,
            total,
            status: "confirmed",
            reference,
            requestId: input.requestId,
            createdAt: now,
          });
          await tx
            .update(scottyWallets)
            .set({ balance: wallet.balance - total, updatedAt: now })
            .where(eq(scottyWallets.sessionHash, sessionHash));
          await tx.insert(scottyWalletTransactions).values({
            id: randomUUID(),
            sessionHash,
            bookingId: id,
            label: `Ride booking ${reference}`,
            amount: -total,
            reference: `${reference}:payment`,
            createdAt: now,
          });

          return {
            id,
            rideId: ride.id,
            date: input.date,
            passengers: input.passengers,
            total,
            status: "confirmed" as const,
            createdAt: now.toISOString(),
            reference,
          };
        }),
      ),
    ),

  cancel: publicProcedure
    .input(cancelInputSchema)
    .mutation(async ({ input }) =>
      withScottyDatabase(async (db) =>
        db.transaction(async (tx) => {
          const sessionHash = hashToken(input.token);
          const [session] = await tx
            .select({ tokenHash: scottySessions.tokenHash })
            .from(scottySessions)
            .where(eq(scottySessions.tokenHash, sessionHash))
            .for("update");
          if (!session) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "Invalid or expired Scotty guest session.",
            });
          }

          // The token predicate prevents guessing an ID from exposing or altering another
          // guest's booking. Locking also makes repeated cancellation idempotent.
          const [booking] = await tx
            .select()
            .from(scottyBookings)
            .where(
              and(
                eq(scottyBookings.id, input.bookingId),
                eq(scottyBookings.sessionHash, sessionHash),
              ),
          )
            .for("update");
          if (!booking) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Booking not found." });
          }
          if (booking.status === "cancelled") return { success: true as const };

          const ride = RIDES.find((candidate) => candidate.id === booking.rideId);
          if (!ride || hasEffectivelyDeparted(ride, booking.date)) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "A confirmed booking cannot be cancelled after departure.",
            });
          }

          const [wallet] = await tx
            .select({ balance: scottyWallets.balance })
            .from(scottyWallets)
            .where(eq(scottyWallets.sessionHash, sessionHash))
            .for("update");
          if (!wallet) throw unavailableError();

          const now = new Date();
          await tx
            .update(scottyBookings)
            .set({ status: "cancelled" })
            .where(eq(scottyBookings.id, booking.id));
          await tx
            .update(scottyWallets)
            .set({ balance: wallet.balance + booking.total, updatedAt: now })
            .where(eq(scottyWallets.sessionHash, sessionHash));
          await tx.insert(scottyWalletTransactions).values({
            id: randomUUID(),
            sessionHash,
            bookingId: booking.id,
            label: `Ride refund ${booking.reference}`,
            amount: booking.total,
            reference: `${booking.reference}:refund`,
            createdAt: now,
          });

          return { success: true as const };
        }),
      ),
    ),
});
