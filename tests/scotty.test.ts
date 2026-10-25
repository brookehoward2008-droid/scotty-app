import { describe, expect, it, vi } from "vitest";
import { fareBreakdown, RIDES, searchRides } from "../shared/scotty";

const FUTURE_DATE = "2099-07-01";

describe("Scotty shared schedule", () => {
  it("calculates demo-credit fares with a three-credit fee per passenger", () => {
    const lunarVanpool = RIDES.find((ride) => ride.id === "earth-luna-0830");
    expect(lunarVanpool).toBeDefined();
    expect(fareBreakdown(lunarVanpool!, 2)).toEqual({
      base: 48,
      fee: 6,
      total: 54,
    });
  });

  it("filters a route by service and never returns same-station trips", () => {
    const vanpools = searchRides({
      origin: "earth",
      destination: "luna",
      date: FUTURE_DATE,
      passengers: 2,
      service: "vanpool",
    });
    expect(vanpools.map((ride) => ride.id)).toEqual([
      "earth-luna-0830",
      "earth-luna-1000",
    ]);
    expect(
      searchRides({
        origin: "earth",
        destination: "luna",
        date: FUTURE_DATE,
        passengers: 2,
        service: "rideshare",
      }),
    ).toEqual([]);
    expect(
      searchRides({
        origin: "earth",
        destination: "earth",
        date: FUTURE_DATE,
        passengers: 1,
      }),
    ).toEqual([]);
  });

  it("excludes fixtures whose static seat count cannot support all passengers", () => {
    expect(
      searchRides({
        origin: "earth",
        destination: "mars",
        date: FUTURE_DATE,
        passengers: 4,
      }),
    ).toEqual([]);
    expect(
      searchRides({
        origin: "earth",
        destination: "mars",
        date: FUTURE_DATE,
        passengers: 3,
      }).map((ride) => ride.id),
    ).toEqual(["earth-mars-0915"]);
  });

  it("retains scheduled operational status for the client while excluding past dates", () => {
    expect(
      searchRides({
        origin: "earth",
        destination: "luna",
        date: FUTURE_DATE,
        passengers: 1,
      }).map((ride) => ride.status),
    ).toEqual(["on-time", "delayed"]);
    expect(
      searchRides({
        origin: "earth",
        destination: "vulcan",
        date: FUTURE_DATE,
        passengers: 1,
      }).map((ride) => ride.status),
    ).toEqual(["cancelled"]);
    expect(
      searchRides({
        origin: "earth",
        destination: "luna",
        date: "2000-01-01",
        passengers: 1,
      }),
    ).toEqual([]);
  });

  it("uses the delayed ride's effective departure time when filtering today's schedule", () => {
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date(`${FUTURE_DATE}T10:05:00.000Z`));
      expect(
        searchRides({
          origin: "earth",
          destination: "luna",
          date: FUTURE_DATE,
          passengers: 1,
        }).map((ride) => ride.id),
      ).toEqual(["earth-luna-1000"]);
    } finally {
      vi.useRealTimers();
    }
  });
});
