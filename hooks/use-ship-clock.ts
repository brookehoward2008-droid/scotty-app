import { useEffect, useState } from "react";
/** Keep departure cutoffs current while a traveler leaves a screen open. */
export function useShipClock() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);
  return now;
}
