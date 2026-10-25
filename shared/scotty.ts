export type Station = {
  id: "earth" | "luna" | "mars" | "titan" | "europa" | "vulcan";
  name: string;
  code: string;
  subtitle: string;
  pickup: string;
  guidance: string;
  x: number;
  y: number;
};

export type Ride = {
  id: string;
  origin: Station["id"];
  destination: Station["id"];
  departure: string;
  arrival: string;
  duration: number;
  fare: number;
  seats: number;
  service: "rideshare" | "vanpool";
  operator: string;
  driver: string;
  rating: number;
  status: "on-time" | "delayed" | "cancelled";
  gate: string;
  vehicle: string;
};

export type Booking = {
  id: string;
  rideId: string;
  date: string;
  passengers: number;
  total: number;
  status: "confirmed" | "cancelled";
  createdAt: string;
  reference: string;
};

/** Internal ledger shape. The API intentionally omits `reference` from wallet history. */
export type WalletTransaction = {
  id: string;
  label: string;
  amount: number;
  reference: string;
  createdAt: string;
};

/** All positions are a stable 0..100 schematic, not real-world coordinates. */
export const STATIONS = [
  {
    id: "earth",
    name: "Earth",
    code: "EAR",
    subtitle: "Terra departure ring",
    pickup: "Orbital Gate 1",
    guidance: "Arrive 15 minutes before ship time for manifest scan.",
    x: 12,
    y: 54,
  },
  {
    id: "luna",
    name: "Luna",
    code: "LUN",
    subtitle: "Moon transfer terminal",
    pickup: "Mare Tranquillitatis Pad",
    guidance: "Follow silver beacon signs to the shared shuttle dock.",
    x: 27,
    y: 38,
  },
  {
    id: "mars",
    name: "Mars",
    code: "MRS",
    subtitle: "Ares cityport",
    pickup: "Olympus Transit Hall",
    guidance: "Check in at the red concourse before boarding.",
    x: 51,
    y: 68,
  },
  {
    id: "titan",
    name: "Titan",
    code: "TTN",
    subtitle: "Saturn moon arrival dock",
    pickup: "Kraken Mare Pier",
    guidance: "Thermal hood pickup is beside gate T-4.",
    x: 74,
    y: 24,
  },
  {
    id: "europa",
    name: "Europa",
    code: "EUR",
    subtitle: "Jovian iceport",
    pickup: "Galileo Ice Terminal",
    guidance: "Use the heated skybridge for the passenger lounge.",
    x: 70,
    y: 75,
  },
  {
    id: "vulcan",
    name: "Vulcan",
    code: "VLC",
    subtitle: "Sunward research outpost",
    pickup: "T'Khasi Landing Apron",
    guidance: "Radiation clearance is required before gate entry.",
    x: 90,
    y: 49,
  },
] as const satisfies readonly Station[];

/** Fixed daily fictional ship-time schedule. Departure and arrival are UTC on the chosen date. */
export const RIDES = [
  {
    id: "earth-luna-0830",
    origin: "earth",
    destination: "luna",
    departure: "08:30",
    arrival: "09:05",
    duration: 35,
    fare: 24,
    seats: 6,
    service: "vanpool",
    operator: "Lunar Link",
    driver: "Mira Quill",
    rating: 4.8,
    status: "on-time",
    gate: "E-01",
    vehicle: "Comet Van 7",
  },
  {
    id: "earth-mars-0915",
    origin: "earth",
    destination: "mars",
    departure: "09:15",
    arrival: "10:10",
    duration: 55,
    fare: 48,
    seats: 3,
    service: "rideshare",
    operator: "Ares Hop",
    driver: "Niko Voss",
    rating: 4.9,
    status: "on-time",
    gate: "E-03",
    vehicle: "Redline Skiff",
  },
  {
    id: "earth-luna-1000",
    origin: "earth",
    destination: "luna",
    departure: "10:00",
    arrival: "10:40",
    duration: 40,
    fare: 18,
    seats: 8,
    service: "vanpool",
    operator: "Lunar Link",
    driver: "Asha Bell",
    rating: 4.7,
    status: "delayed",
    gate: "E-02",
    vehicle: "Moonbeam Van 2",
  },
  {
    id: "earth-titan-1130",
    origin: "earth",
    destination: "titan",
    departure: "11:30",
    arrival: "13:10",
    duration: 100,
    fare: 74,
    seats: 4,
    service: "rideshare",
    operator: "Ring Route",
    driver: "Pax Rho",
    rating: 4.9,
    status: "on-time",
    gate: "E-06",
    vehicle: "Saturn Skimmer",
  },
  {
    id: "earth-europa-1200",
    origin: "earth",
    destination: "europa",
    departure: "12:00",
    arrival: "13:20",
    duration: 80,
    fare: 61,
    seats: 5,
    service: "vanpool",
    operator: "Jovian Pool",
    driver: "Tala Orin",
    rating: 4.6,
    status: "on-time",
    gate: "E-05",
    vehicle: "Ice Runner",
  },
  {
    id: "luna-mars-0900",
    origin: "luna",
    destination: "mars",
    departure: "09:00",
    arrival: "10:20",
    duration: 80,
    fare: 42,
    seats: 4,
    service: "rideshare",
    operator: "Ares Hop",
    driver: "Juno Rei",
    rating: 4.8,
    status: "on-time",
    gate: "L-03",
    vehicle: "Dustwing",
  },
  {
    id: "mars-earth-1515",
    origin: "mars",
    destination: "earth",
    departure: "15:15",
    arrival: "16:10",
    duration: 55,
    fare: 46,
    seats: 3,
    service: "rideshare",
    operator: "Ares Hop",
    driver: "Kellan Pryce",
    rating: 4.8,
    status: "on-time",
    gate: "M-02",
    vehicle: "Redline Skiff",
  },
  {
    id: "luna-earth-1630",
    origin: "luna",
    destination: "earth",
    departure: "16:30",
    arrival: "17:05",
    duration: 35,
    fare: 21,
    seats: 6,
    service: "vanpool",
    operator: "Lunar Link",
    driver: "Sera Venn",
    rating: 4.7,
    status: "on-time",
    gate: "L-01",
    vehicle: "Comet Van 4",
  },
  {
    id: "earth-vulcan-1400",
    origin: "earth",
    destination: "vulcan",
    departure: "14:00",
    arrival: "16:15",
    duration: 135,
    fare: 75,
    seats: 5,
    service: "vanpool",
    operator: "Sunward Transit",
    driver: "Soval Trin",
    rating: 4.5,
    status: "cancelled",
    gate: "E-09",
    vehicle: "Helios Carrier",
  },
] as const satisfies readonly Ride[];

export type SearchRidesInput = {
  origin: Station["id"];
  destination: Station["id"];
  date: string;
  passengers: number;
  service?: "all" | Ride["service"];
};

function isValidUtcDate(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsed = new Date(`${date}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(date);
}

function isFutureDeparture(date: string, ride: Ride, now: Date): boolean {
  const departureAt = new Date(`${date}T${ride.departure}:00.000Z`);
  if (ride.status === "delayed") {
    departureAt.setUTCMinutes(departureAt.getUTCMinutes() + 10);
  }
  return departureAt.getTime() > now.getTime();
}

/**
 * Searches the daily fixture schedule. Cancelled rides remain visible so the client can
 * communicate their operational status; booking validation rejects them. Today's already
 * departed rides, invalid dates, past dates, same-station trips, and insufficient fixtures
 * are excluded.
 */
export function searchRides({
  origin,
  destination,
  date,
  passengers,
  service = "all",
}: SearchRidesInput): Ride[] {
  if (
    origin === destination ||
    !isValidUtcDate(date) ||
    !Number.isInteger(passengers) ||
    passengers < 1
  ) {
    return [];
  }

  const now = new Date();
  return RIDES.filter(
    (ride) =>
      ride.origin === origin &&
      ride.destination === destination &&
      ride.seats >= passengers &&
      (service === "all" || ride.service === service) &&
      isFutureDeparture(date, ride, now),
  ).map((ride) => ({ ...ride }));
}

/** The demo service fee is three credits per passenger; no real currency is involved. */
export function fareBreakdown(
  ride: Ride,
  passengers: number,
): { base: number; fee: number; total: number } {
  if (!Number.isInteger(passengers) || passengers < 1) {
    throw new RangeError("passengers must be a positive integer");
  }

  const base = ride.fare * passengers;
  const fee = 3 * passengers;
  return { base, fee, total: base + fee };
}
