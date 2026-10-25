import { z } from "zod";
import { RIDES, fareBreakdown, type Booking } from "../shared/scotty";
import { shipTimestamp } from "./scotty-trip";

export const DEMO_MODE = process.env.EXPO_PUBLIC_SCOTTY_DEMO === "1";
export const DEMO_KEY = "scotty_shareable_demo_v1";
type Transaction = {
  id: string;
  label: string;
  amount: number;
  createdAt: string;
};
type DemoBooking = Booking & { requestId: string };
type Ledger = {
  version: 1;
  token: string;
  balance: number;
  bookings: DemoBooking[];
  transactions: Transaction[];
};
type Storage = Pick<globalThis.Storage, "getItem" | "setItem">;
const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => {
    const d = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(d.getTime()) && d.toISOString().startsWith(value);
  });
const inputSchema = z.object({
  token: z.string().regex(/^[a-f0-9]{64}$/),
  rideId: z.string(),
  date: dateSchema,
  passengers: z.number().int().min(1).max(8),
  requestId: z
    .string()
    .min(8)
    .max(96)
    .regex(/^[A-Za-z0-9_-]+$/),
});

/** Explicit browser-demo adapter. Never used as a fallback for a failed live API. */
export function runDemoOperation(
  storage: Storage,
  operation: string,
  raw: unknown,
): unknown {
  const text = storage.getItem(DEMO_KEY);
  let ledger: Ledger | undefined;
  if (text) {
    ledger = JSON.parse(text);
    if (
      ledger?.version !== 1 ||
      !Array.isArray(ledger.bookings) ||
      !Number.isFinite(ledger.balance)
    ) {
      throw new Error(
        "Saved demo data could not be read. Browser storage must remain available.",
      );
    }
  }
  const persist = () => storage.setItem(DEMO_KEY, JSON.stringify(ledger));
  if (operation === "createSession") {
    if (!ledger) {
      const token = Array.from(
        crypto.getRandomValues(new Uint8Array(32)),
        (n) => n.toString(16).padStart(2, "0"),
      ).join("");
      ledger = {
        version: 1,
        token,
        balance: 500,
        bookings: [],
        transactions: [
          {
            id: crypto.randomUUID(),
            label: "Welcome demo credits",
            amount: 500,
            createdAt: new Date().toISOString(),
          },
        ],
      };
      persist();
    }
    return { token: ledger.token };
  }
  const input = z.record(z.string(), z.unknown()).parse(raw);
  const availability = (date: string) =>
    RIDES.map((ride) => ({
      rideId: ride.id,
      seats: Math.max(
        0,
        ride.seats -
          (ledger?.bookings ?? [])
            .filter(
              (b) =>
                b.rideId === ride.id &&
                b.date === date &&
                b.status === "confirmed",
            )
            .reduce((sum, b) => sum + b.passengers, 0),
      ),
    }));
  if (operation === "availability")
    return availability(dateSchema.parse(input.date));
  if (!ledger || input.token !== ledger.token)
    throw new Error("Invalid demo session. Reload Scotty.");
  if (operation === "wallet")
    return { balance: ledger.balance, transactions: ledger.transactions };
  if (operation === "bookings")
    return ledger.bookings.map(
      ({ requestId: _requestId, ...booking }) => booking,
    );
  if (operation === "book") {
    const booking = inputSchema.parse(raw);
    const prior = ledger.bookings.find(
      (b) => b.requestId === booking.requestId,
    );
    if (prior) {
      if (
        prior.rideId !== booking.rideId ||
        prior.date !== booking.date ||
        prior.passengers !== booking.passengers
      )
        throw new Error("Booking request already used for another trip.");
      return prior;
    }
    const ride = RIDES.find((r) => r.id === booking.rideId);
    if (
      !ride ||
      ride.status === "cancelled" ||
      shipTimestamp(ride, booking.date, "departure") <= Date.now()
    )
      throw new Error("Ride unavailable for this date.");
    const seats = availability(booking.date).find(
      (a) => a.rideId === ride.id,
    )!.seats;
    if (seats < booking.passengers)
      throw new Error("Not enough seats available.");
    const { total } = fareBreakdown(ride, booking.passengers);
    if (ledger.balance < total) throw new Error("Not enough demo credits.");
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const result: DemoBooking = {
      id,
      rideId: ride.id,
      date: booking.date,
      passengers: booking.passengers,
      total,
      status: "confirmed",
      createdAt,
      reference: `SCT-${id.slice(0, 8).toUpperCase()}`,
      requestId: booking.requestId,
    };
    ledger.balance -= total;
    ledger.bookings.unshift(result);
    ledger.transactions.unshift({
      id: crypto.randomUUID(),
      label: `${ride.origin} → ${ride.destination}`,
      amount: -total,
      createdAt,
    });
    persist();
    return result;
  }
  if (operation === "cancel") {
    const id = z.string().uuid().parse(input.bookingId);
    const booking = ledger.bookings.find((b) => b.id === id);
    if (!booking) throw new Error("Booking not found.");
    if (booking.status === "cancelled") return { ok: true };
    const ride = RIDES.find((r) => r.id === booking.rideId)!;
    if (shipTimestamp(ride, booking.date, "departure") <= Date.now())
      throw new Error("This ride has departed.");
    booking.status = "cancelled";
    ledger.balance += booking.total;
    ledger.transactions.unshift({
      id: crypto.randomUUID(),
      label: "Demo booking refund",
      amount: booking.total,
      createdAt: new Date().toISOString(),
    });
    persist();
    return { ok: true };
  }
  throw new Error("Unsupported demo operation.");
}

let queue = Promise.resolve<unknown>(undefined);
export function browserDemoOperation(operation: string, input: unknown) {
  const run = () => runDemoOperation(window.localStorage, operation, input);
  // One atomic ledger write per transaction; Web Locks coordinate multiple tabs.
  if (navigator.locks) return navigator.locks.request(DEMO_KEY, run);
  const result = queue.then(run);
  queue = result.catch(() => undefined);
  return result;
}
