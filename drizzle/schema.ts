import {
  index,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Scotty is a private guest-token demo. Only a SHA-256 hash of each bearer token
 * is persisted; no guest names, contact details, payment credentials, or other PII
 * are stored in these tables.
 */
export const scottySessions = mysqlTable("scotty_sessions", {
  tokenHash: varchar("tokenHash", { length: 64 }).primaryKey(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/** Demo-only credit balance, initialized to 500 credits at guest session creation. */
export const scottyWallets = mysqlTable("scotty_wallets", {
  sessionHash: varchar("sessionHash", { length: 64 }).primaryKey(),
  balance: int("balance").notNull().default(500),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const scottyBookings = mysqlTable(
  "scotty_bookings",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    sessionHash: varchar("sessionHash", { length: 64 }).notNull(),
    rideId: varchar("rideId", { length: 64 }).notNull(),
    date: varchar("date", { length: 10 }).notNull(),
    passengers: int("passengers").notNull(),
    total: int("total").notNull(),
    status: mysqlEnum("status", ["confirmed", "cancelled"]).notNull(),
    reference: varchar("reference", { length: 40 }).notNull().unique(),
    requestId: varchar("requestId", { length: 96 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [
    index("scotty_bookings_session_created_idx").on(table.sessionHash, table.createdAt),
    index("scotty_bookings_schedule_status_idx").on(
      table.rideId,
      table.date,
      table.status,
    ),
    uniqueIndex("scotty_bookings_session_request_unique").on(
      table.sessionHash,
      table.requestId,
    ),
  ],
);

/** Immutable demo-credit ledger. Amounts are signed credits, never money. */
export const scottyWalletTransactions = mysqlTable(
  "scotty_wallet_transactions",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    sessionHash: varchar("sessionHash", { length: 64 }).notNull(),
    bookingId: varchar("bookingId", { length: 36 }),
    label: varchar("label", { length: 160 }).notNull(),
    amount: int("amount").notNull(),
    reference: varchar("reference", { length: 80 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [
    index("scotty_wallet_transactions_session_created_idx").on(
      table.sessionHash,
      table.createdAt,
    ),
    uniqueIndex("scotty_wallet_transactions_session_reference_unique").on(
      table.sessionHash,
      table.reference,
    ),
  ],
);

/** One row per ride/date serializes capacity checks before a booking is written. */
export const scottyScheduleLocks = mysqlTable("scotty_schedule_locks", {
  id: varchar("id", { length: 96 }).primaryKey(),
  rideId: varchar("rideId", { length: 64 }).notNull(),
  date: varchar("date", { length: 10 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ScottySession = typeof scottySessions.$inferSelect;
export type ScottyWallet = typeof scottyWallets.$inferSelect;
export type ScottyBooking = typeof scottyBookings.$inferSelect;
export type ScottyWalletTransaction = typeof scottyWalletTransactions.$inferSelect;
