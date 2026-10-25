import { useState, useEffect, useRef, useCallback } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { trpc } from "@/lib/trpc";
import { type Language, copy, type CopyKey } from "@/lib/scotty-i18n";
import { DEMO_MODE } from "@/lib/scotty-demo";
const SESSION_KEY = DEMO_MODE ? "scotty_demo_guest_v1" : "scotty_guest_v1";
const readToken = () =>
  Platform.OS === "web"
    ? AsyncStorage.getItem(SESSION_KEY)
    : SecureStore.getItemAsync(SESSION_KEY);
const saveToken = (token: string) =>
  Platform.OS === "web"
    ? AsyncStorage.setItem(SESSION_KEY, token)
    : SecureStore.setItemAsync(SESSION_KEY, token);
export function useScotty() {
  const [language, setLang] = useState<Language>("en");
  const [reminders, setReminders] = useState(true);
  const [token, setToken] = useState<string>();
  const [sessionError, setSessionError] = useState("");
  const [connecting, setConnecting] = useState(true);
  const didInit = useRef(false);
  const utils = trpc.useUtils();
  const create = trpc.scotty.createSession.useMutation();
  const connect = useCallback(async () => {
    setConnecting(true);
    setSessionError("");
    try {
      let stored = DEMO_MODE ? undefined : await readToken();
      if (!stored) {
        const session = await create.mutateAsync();
        stored = session.token;
        await saveToken(stored);
      }
      setToken(stored);
    } catch (e) {
      setSessionError(
        e instanceof Error ? e.message : "Connection unavailable",
      );
    } finally {
      setConnecting(false);
    }
  }, [create.mutateAsync]);
  useEffect(() => {
    if (!didInit.current) {
      didInit.current = true;
      void connect();
    }
    void AsyncStorage.multiGet(["scotty_language", "scotty_reminders"])
      .then((values) => {
        const lang = values[0][1];
        if (lang === "en" || lang === "es" || lang === "fr") setLang(lang);
        if (values[1][1] === "false") setReminders(false);
      })
      .catch(() => {});
  }, [connect]);
  const wallet = trpc.scotty.wallet.useQuery(
    { token: token ?? "" },
    { enabled: !!token, retry: 1 },
  );
  const bookings = trpc.scotty.bookings.useQuery(
    { token: token ?? "" },
    { enabled: !!token, retry: 1 },
  );
  const bookMutation = trpc.scotty.book.useMutation();
  const cancelMutation = trpc.scotty.cancel.useMutation();
  const refresh = async () => {
    if (!token) return connect();
    await Promise.all([
      wallet.refetch(),
      bookings.refetch(),
      utils.scotty.availability.invalidate(),
    ]);
  };
  const setLanguage = (value: Language) => {
    setLang(value);
    void AsyncStorage.setItem("scotty_language", value);
  };
  const toggleReminders = () => {
    setReminders((v) => {
      void AsyncStorage.setItem("scotty_reminders", String(!v));
      return !v;
    });
  };
  const book = async (input: {
    rideId: string;
    date: string;
    passengers: number;
    requestId: string;
  }) => {
    if (!token) throw new Error(copy(language, "error"));
    const result = await bookMutation.mutateAsync({ ...input, token });
    await refresh();
    return result;
  };
  const cancel = async (bookingId: string) => {
    if (!token) throw new Error(copy(language, "error"));
    await cancelMutation.mutateAsync({ token, bookingId });
    await refresh();
  };
  return {
    language,
    setLanguage,
    t: (key: CopyKey) => copy(language, key),
    reminders,
    toggleReminders,
    wallet: wallet.data,
    bookings: bookings.data ?? [],
    connecting,
    sessionError,
    apiError: wallet.error?.message || bookings.error?.message || "",
    loading: connecting || wallet.isLoading || bookings.isLoading,
    refresh,
    book,
    cancel,
    paying: bookMutation.isPending,
    cancelling: cancelMutation.isPending,
    token,
  };
}
export type ScottyState = ReturnType<typeof useScotty>;
