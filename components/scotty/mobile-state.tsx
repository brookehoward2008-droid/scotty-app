import React, { createContext, use, useState } from "react";
import { useScotty } from "@/hooks/use-scotty";
import { dateISO, type SearchValues } from "./rides";
import type { Dialog } from "./dialogs";
function useMobileState() {
  const state = useScotty();
  const [values, setValues] = useState<SearchValues>({
    origin: "earth",
    destination: "luna",
    date: dateISO(),
    passengers: 1,
  });
  const [dialog, setDialog] = useState<Dialog>(null);
  const [service, setService] = useState<"all" | "rideshare" | "vanpool">(
    "all",
  );
  const [searchError, setSearchError] = useState("");
  const [board, setBoard] = useState(false);
  const [selectedRideId, setSelectedRideId] = useState<string | null>(null);

  return {
    state,
    values,
    setValues,
    dialog,
    setDialog,
    service,
    setService,
    searchError,
    setSearchError,
    board,
    setBoard,
    selectedRideId,
    setSelectedRideId,
  };
}
const MobileContext = createContext<ReturnType<typeof useMobileState> | null>(
  null,
);
export function MobileStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const value = useMobileState();
  return <MobileContext value={value}>{children}</MobileContext>;
}
export function useMobileStateContext() {
  const value = use(MobileContext);
  if (!value) throw new Error("Scotty screens require MobileStateProvider");
  return value;
}
