import { type Ride } from "@/shared/scotty";
export function delayMinutes(ride: Ride) {
  return ride.status === "delayed" ? 10 : 0;
}
export function shipTime(ride: Ride, point: "departure" | "arrival") {
  const [hours, minutes] = ride[point].split(":").map(Number);
  const total = hours * 60 + minutes + delayMinutes(ride);
  return `${String(Math.floor(total / 60) % 24).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}
export function shipTimestamp(
  ride: Ride,
  date: string,
  point: "departure" | "arrival",
) {
  return (
    new Date(`${date}T${ride[point]}:00Z`).getTime() +
    delayMinutes(ride) * 60000
  );
}
export function paymentError(error: unknown, language: "en" | "es" | "fr") {
  const message = error instanceof Error ? error.message : "";
  const translations = {
    unavailable: {
      en: "This departure is no longer available. Try another date or ride.",
      es: "Esta salida ya no está disponible. Prueba otra fecha o viaje.",
      fr: "Ce départ n’est plus disponible. Essayez une autre date ou un trajet.",
    },
    seats: {
      en: "These seats have just been booked. Refresh and choose another ride.",
      es: "Estas plazas se acaban de reservar. Actualiza y elige otro viaje.",
      fr: "Ces places viennent d’être réservées. Actualisez et choisissez un autre trajet.",
    },
    balance: {
      en: "Not enough demo credits. Choose fewer travelers or a lower fare.",
      es: "Créditos demo insuficientes. Elige menos viajeros o una tarifa menor.",
      fr: "Crédits démo insuffisants. Choisissez moins de voyageurs ou un tarif réduit.",
    },
    departed: {
      en: "This ride has departed and can no longer be cancelled.",
      es: "Este viaje ya partió y no se puede cancelar.",
      fr: "Ce trajet est parti et ne peut plus être annulé.",
    },
    connection: {
      en: "We couldn’t connect to mission control. Please try again.",
      es: "No pudimos conectar con control de misión. Inténtalo de nuevo.",
      fr: "Connexion au contrôle de mission impossible. Réessayez.",
    },
  };
  const key = /seats/i.test(message)
    ? "seats"
    : /credits/i.test(message)
      ? "balance"
      : /departed|cancellation/i.test(message)
        ? "departed"
        : /cancelled|unavailable for|Ride not found/i.test(message)
          ? "unavailable"
          : "connection";
  return translations[key][language];
}
