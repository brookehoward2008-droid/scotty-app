import { describe, expect, it } from "vitest";
import { runDemoOperation } from "../lib/scotty-demo";

function fixture() {
  const values = new Map<string, string>();
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
  const call = (name: string, input?: unknown): any =>
    runDemoOperation(storage, name, input);
  const { token } = call("createSession");
  return {
    call,
    storage,
    token,
    input: {
      token,
      rideId: "earth-luna-0830",
      date: "2031-01-02",
      passengers: 2,
      requestId: "test-request-001",
    },
  };
}
describe("explicit shareable browser demo", () => {
  it("persists bookings, balance and capacity and makes booking retries idempotent", () => {
    const { call, storage, token, input } = fixture();
    const booking = call("book", input);
    expect(call("book", input).id).toBe(booking.id);
    expect(runDemoOperation(storage, "wallet", { token })).toMatchObject({
      balance: 446,
    });
    expect(call("bookings", { token })).toHaveLength(1);
    expect(
      call("availability", { date: input.date }).find(
        (r: any) => r.rideId === input.rideId,
      ).seats,
    ).toBe(4);
    expect(call("createSession").token).toBe(token);
  });
  it("refunds a cancellation once, persists it and restores capacity", () => {
    const { call, token, input } = fixture();
    const booking = call("book", input);
    call("cancel", { token, bookingId: booking.id });
    call("cancel", { token, bookingId: booking.id });
    expect(call("wallet", { token }).balance).toBe(500);
    expect(call("wallet", { token }).transactions).toHaveLength(3);
    expect(call("bookings", { token })[0].status).toBe("cancelled");
    expect(
      call("availability", { date: input.date }).find(
        (r: any) => r.rideId === input.rideId,
      ).seats,
    ).toBe(6);
  });
  it("rejects overbooking, invalid travelers, cancelled rides and past dates without charging", () => {
    const { call, token, input } = fixture();
    for (const change of [
      { passengers: 7 },
      { passengers: 0 },
      { rideId: "earth-vulcan-1400" },
      { date: "2020-01-01" },
      { date: "2031-02-31" },
    ]) {
      expect(() => call("book", { ...input, ...change })).toThrow();
    }
    expect(call("wallet", { token }).balance).toBe(500);
    expect(call("bookings", { token })).toHaveLength(0);
  });
  it("rejects insufficient credits and prevents conflicting retries", () => {
    const { call, token, input } = fixture();
    call("book", { ...input, passengers: 6 });
    expect(() => call("book", { ...input, passengers: 1 })).toThrow(
      /already used/,
    );
    call("book", {
      ...input,
      date: "2031-01-03",
      passengers: 6,
      requestId: "test-request-002",
    });
    call("book", {
      ...input,
      date: "2031-01-04",
      passengers: 6,
      requestId: "test-request-003",
    });
    expect(() =>
      call("book", {
        ...input,
        date: "2031-01-05",
        requestId: "test-request-004",
      }),
    ).toThrow(/credits/);
    expect(call("wallet", { token }).balance).toBe(14);
  });
  it("isolates browser ledgers and rejects another session token", () => {
    const a = fixture();
    const b = fixture();
    a.call("book", a.input);
    expect(b.call("bookings", { token: b.token })).toHaveLength(0);
    expect(() => b.call("wallet", { token: a.token })).toThrow(/session/);
  });
  it("surfaces storage failures instead of reporting an unsaved success", () => {
    const { storage, input } = fixture();
    expect(() =>
      runDemoOperation(
        {
          ...storage,
          setItem: () => {
            throw new Error("Storage full");
          },
        },
        "book",
        input,
      ),
    ).toThrow("Storage full");
    expect(
      runDemoOperation(storage, "bookings", { token: input.token }),
    ).toHaveLength(0);
  });
});
