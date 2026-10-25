import { shipTime, shipTimestamp } from "@/lib/scotty-trip";
import React, { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { Host, Switch } from "@expo/ui";
import { useShipClock } from "@/hooks/use-ship-clock";
import { ShareApp } from "./share-app";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { type Booking, RIDES } from "@/shared/scotty";
import { type ScottyState } from "@/hooks/use-scotty";
import { LANGUAGES } from "@/lib/scotty-i18n";
import { formatDate, stationName } from "./rides";
import { Badge, Body, Button, C, F, Icon, Label, Title } from "./ui";

type TripsProps = {
  state: ScottyState;
  onFind: () => void;
  onTicket: (booking: Booking) => void;
  onCancel: (booking: Booking) => void;
};

export function TripsScreen({ state, onFind, onTicket, onCancel }: TripsProps) {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const { width } = useWindowDimensions();
  const trips = useMemo(() => splitBookings(state.bookings), [state.bookings]);
  const bookings = tab === "upcoming" ? trips.upcoming : trips.past;
  const t = state.t;
  if (state.loading || state.sessionError || state.apiError)
    return <ConnectionState state={state} />;

  return (
    <View style={[s.page, width > 900 && s.pageWide]}>
      <Title>{t("tripsTitle")}</Title>
      <View style={s.tabs} accessibilityRole="tablist">
        <Tab
          active={tab === "upcoming"}
          label={t("upcoming")}
          onPress={() => setTab("upcoming")}
        />
        <Tab
          active={tab === "past"}
          label={t("past")}
          onPress={() => setTab("past")}
        />
      </View>
      {bookings.length === 0 ? (
        <EmptyTrips state={state} onFind={onFind} />
      ) : (
        <View style={s.list}>
          {bookings.map((booking) => (
            <TripCard
              key={booking.id}
              booking={booking}
              state={state}
              onTicket={onTicket}
              onCancel={onCancel}
            />
          ))}
        </View>
      )}
    </View>
  );
}

export function WalletScreen({ state }: { state: ScottyState }) {
  const { width } = useWindowDimensions();
  const t = state.t;
  if (state.loading || state.sessionError || state.apiError)
    return <ConnectionState state={state} />;
  const wallet = state.wallet;
  if (!wallet) return <ConnectionState state={state} />;

  return (
    <View style={[s.page, width > 900 && s.pageWide]}>
      <Title>{t("walletTitle")}</Title>
      <Body style={s.intro}>{t("walletSub")}</Body>
      <View style={s.balanceCard}>
        <Label color={C.mint}>{t("demoWallet")}</Label>
        <Text style={s.balance}>
          {wallet.balance} <Text style={s.creditUnit}>{t("credits")}</Text>
        </Text>
        <Body style={s.walletNote}>{t("walletNote")}</Body>
      </View>
      <View style={s.sectionHeader}>
        <Title size={21}>{t("activity")}</Title>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("refresh")}
          onPress={() => void state.refresh()}
        >
          <Icon name="refresh-outline" color={C.mint} />
        </Pressable>
      </View>
      {wallet.transactions.length ? (
        <View style={s.list}>
          {wallet.transactions.map((transaction) => (
            <View key={transaction.id} style={s.transaction}>
              <View style={s.transactionIcon}>
                <Icon
                  name={transaction.amount >= 0 ? "add" : "remove"}
                  color={transaction.amount >= 0 ? C.mint : C.amber}
                  size={18}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Body style={{ color: C.text }}>
                  {transaction.label.startsWith("Welcome")
                    ? t("demoWallet")
                    : transaction.amount < 0
                      ? t("paid")
                      : t("cancelConfirm")}
                </Body>
                <Body style={s.transactionDate}>
                  {new Date(transaction.createdAt).toLocaleDateString(
                    { en: "en-US", es: "es-ES", fr: "fr-FR" }[state.language],
                  )}
                </Body>
              </View>
              <Text
                style={[
                  s.amount,
                  { color: transaction.amount >= 0 ? C.mint : C.text },
                ]}
              >
                {transaction.amount >= 0 ? "+" : ""}
                {transaction.amount}{" "}
                <Text style={s.amountUnit}>{t("credits")}</Text>
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <View style={s.emptyActivity}>
          <Icon name="wallet-outline" color={C.faint} size={28} />
          <Body>{t("emptyActivity")}</Body>
        </View>
      )}
    </View>
  );
}

export function SettingsScreen({
  state,
  onHelp,
}: {
  state: ScottyState;
  onHelp: () => void;
}) {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const t = state.t;
  return (
    <View style={[s.page, width > 900 && s.pageWide]}>
      <Title>{t("settingsTitle")}</Title>
      <View style={s.settingGroup}>
        <Label>{t("language")}</Label>
        <Body style={s.groupSub}>{t("languageSub")}</Body>
        <View style={s.languages}>
          {LANGUAGES.map((language) => (
            <Pressable
              key={language.id}
              accessibilityRole="radio"
              accessibilityState={{ selected: state.language === language.id }}
              accessibilityLabel={language.name}
              onPress={() => state.setLanguage(language.id)}
              style={[
                s.language,
                state.language === language.id && s.languageSelected,
              ]}
            >
              <Text
                style={[
                  s.languageName,
                  state.language === language.id && { color: C.mint },
                ]}
              >
                {language.name}
              </Text>
              <Text style={s.languageDetail}>{language.detail}</Text>
              {state.language === language.id && (
                <Icon name="checkmark-circle" color={C.mint} size={17} />
              )}
            </Pressable>
          ))}
        </View>
      </View>
      <View style={s.settingGroup}>
        <View style={{ gap: 12 }}>
          <View>
            <Body style={s.groupSub}>{t("notificationsSub")}</Body>
          </View>
          <Host
            colorScheme="dark"
            seedColor={C.mint}
            matchContents={{ vertical: true }}
            style={{ width: "100%" }}
          >
            <Switch
              label={t("notifications")}
              value={state.reminders}
              onValueChange={(value) => {
                if (value !== state.reminders) state.toggleReminders();
              }}
            />
          </Host>
        </View>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t("help")}
        onPress={onHelp}
        style={s.settingGroup}
      >
        <View style={s.settingRow}>
          <View style={{ flex: 1 }}>
            <Body style={{ color: C.text }}>{t("help")}</Body>
            <Body style={s.groupSub}>{t("helpSub")}</Body>
          </View>
          <Icon name="chevron-forward" color={C.mint} />
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t("about")}
        onPress={onHelp}
        style={s.about}
      >
        <Label>{t("about")}</Label>
        <Body style={[s.groupSub, { marginTop: 11 }]}>{t("aboutText")}</Body>
        <Body style={s.version}>{t("version")}</Body>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Brand and interaction guide"
        onPress={() => router.push("/brand-guide" as never)}
        style={s.settingGroup}
      >
        <View style={s.settingRow}>
          <View style={{ flex: 1 }}>
            <Body style={{ color: C.text }}>Brand & interaction guide</Body>
            <Body style={s.groupSub}>
              Explore Scotty’s identity, colors and motion.
            </Body>
          </View>
          <Icon name="color-palette-outline" color={C.mint} />
        </View>
      </Pressable>
      <ShareApp />
    </View>
  );
}

function TripCard({
  booking,
  state,
  onTicket,
  onCancel,
}: {
  booking: Booking;
  state: ScottyState;
  onTicket: (booking: Booking) => void;
  onCancel: (booking: Booking) => void;
}) {
  const ride = RIDES.find((item) => item.id === booking.rideId);
  const now = useShipClock();
  const t = state.t;
  if (!ride) return null;
  const cancelled = booking.status === "cancelled";
  const departed = shipTimestamp(ride, booking.date, "departure") <= now;
  const completed = shipTimestamp(ride, booking.date, "arrival") <= now;
  return (
    <View style={s.tripCard}>
      <View style={s.cardTop}>
        <Badge
          text={t(
            cancelled ? "cancelled" : completed ? "completed" : "confirmed",
          )}
          type={cancelled ? "muted" : "green"}
        />
        <Text style={s.date}>
          {formatDate(booking.date, state.language, true)}
        </Text>
      </View>
      <View style={s.route}>
        <View>
          <Text style={s.station}>{stationName(ride.origin)}</Text>
          <Text style={s.time}>{shipTime(ride, "departure")} UTC</Text>
        </View>
        <View style={s.routeMid}>
          <Icon name="arrow-forward" color={C.mint} size={20} />
          <Body style={s.duration}>
            {ride.duration} {t("min")}
          </Body>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={s.station}>{stationName(ride.destination)}</Text>
          <Text style={s.time}>{shipTime(ride, "arrival")} UTC</Text>
        </View>
      </View>
      <View style={s.boarding}>
        <Icon name="location-outline" color={C.mint} size={16} />
        <Body style={{ flex: 1 }}>
          {t("gate")} {ride.gate} · {ride.vehicle}
        </Body>
        <Body style={{ fontSize: 14 }}>
          {booking.passengers} {t("travelers")}
        </Body>
      </View>
      {!cancelled && (
        <View style={s.cardActions}>
          <Button
            secondary
            label={t("ticket")}
            icon="ticket-outline"
            onPress={() => onTicket(booking)}
            style={{ flex: 1 }}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("cancelTrip")}
            disabled={departed}
            onPress={() => onCancel(booking)}
            style={[s.cancel, departed && { display: "none" }]}
          >
            <Text style={s.cancelText}>{t("cancelTrip")}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

function ConnectionState({ state }: { state: ScottyState }) {
  const t = state.t;
  const failed = Boolean(state.sessionError || state.apiError);
  return (
    <View style={[s.page, s.connection]}>
      <Icon
        name={failed ? "cloud-offline-outline" : "planet-outline"}
        color={failed ? C.amber : C.mint}
        size={34}
      />
      <Title size={23}>{failed ? t("error") : t("loading")}</Title>
      {failed && (
        <Button
          label={t("retry")}
          secondary
          onPress={() => void state.refresh()}
          icon="refresh-outline"
        />
      )}
    </View>
  );
}

function EmptyTrips({
  state,
  onFind,
}: {
  state: ScottyState;
  onFind: () => void;
}) {
  const t = state.t;
  return (
    <View style={s.emptyTrips}>
      <Icon name="rocket-outline" color={C.mint} size={36} />
      <Title size={23}>{t("noTrips")}</Title>
      <Body style={{ textAlign: "center" }}>{t("noTripsSub")}</Body>
      <Button label={t("find")} onPress={onFind} icon="arrow-forward" />
    </View>
  );
}

function Tab({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[s.tab, active && s.tabActive]}
    >
      <Text style={[s.tabText, active && s.tabTextActive]}>{label}</Text>
    </Pressable>
  );
}

function splitBookings(bookings: Booking[]) {
  const now = Date.now();
  const arrival = (booking: Booking) => {
    const ride = RIDES.find((item) => item.id === booking.rideId);
    return ride ? shipTimestamp(ride, booking.date, "arrival") : 0;
  };
  const upcoming = bookings
    .filter(
      (booking) => booking.status === "confirmed" && arrival(booking) > now,
    )
    .sort((a, b) => arrival(a) - arrival(b));
  const past = bookings
    .filter(
      (booking) => booking.status === "cancelled" || arrival(booking) <= now,
    )
    .sort((a, b) => arrival(b) - arrival(a));
  return { upcoming, past };
}

const s = StyleSheet.create({
  page: { width: "100%", maxWidth: 720, alignSelf: "center", gap: 20 },
  pageWide: { maxWidth: 820 },
  intro: { marginTop: -12 },
  list: { gap: 12 },
  tabs: {
    flexDirection: "row",
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: { borderBottomColor: C.mint },
  tabText: { fontFamily: F.body, color: C.muted, fontWeight: "600" },
  tabTextActive: { color: C.mint },
  tripCard: {
    gap: 17,
    padding: 18,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.panel,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  date: { fontFamily: F.mono, fontSize: 14, color: C.muted },
  route: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  station: { fontFamily: F.heading, color: C.text, fontSize: 23 },
  time: { fontFamily: F.mono, color: C.muted, fontSize: 14, marginTop: 5 },
  routeMid: { alignItems: "center", gap: 4 },
  duration: { fontSize: 14 },
  boarding: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 14,
  },
  cardActions: { flexDirection: "row", alignItems: "center", gap: 10 },
  cancel: { paddingHorizontal: 7, paddingVertical: 11 },
  cancelText: {
    fontFamily: F.body,
    fontSize: 14,
    fontWeight: "600",
    color: C.amber,
  },
  emptyTrips: {
    alignItems: "center",
    gap: 14,
    padding: 34,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.panel,
  },
  connection: {
    minHeight: 210,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  balanceCard: {
    gap: 10,
    padding: 22,
    borderRadius: 18,
    backgroundColor: "#203027",
    borderWidth: 1,
    borderColor: "#365440",
  },
  balance: {
    fontFamily: F.heading,
    fontSize: 43,
    color: C.mint,
    letterSpacing: -1,
  },
  creditUnit: { fontFamily: F.body, fontSize: 14, color: C.mint },
  walletNote: { fontSize: 14, lineHeight: 18, color: C.muted },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  transaction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 14,
    backgroundColor: C.panel,
  },
  transactionIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.elevated,
  },
  transactionDate: { fontSize: 14, marginTop: 3 },
  amount: { fontFamily: F.heading, fontSize: 17 },
  amountUnit: { fontFamily: F.body, fontSize: 14, color: C.muted },
  emptyActivity: {
    alignItems: "center",
    gap: 10,
    padding: 27,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
  },
  settingGroup: {
    padding: 18,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    backgroundColor: C.panel,
  },
  groupSub: { fontSize: 14, marginTop: 5 },
  languages: { marginTop: 15, gap: 8 },
  language: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 11,
    borderRadius: 10,
    backgroundColor: C.elevated,
  },
  languageSelected: {
    backgroundColor: "#26352a",
    borderWidth: 1,
    borderColor: "#426b4d",
  },
  languageName: {
    flex: 1,
    fontFamily: F.body,
    fontSize: 14,
    fontWeight: "600",
    color: C.text,
  },
  languageDetail: { fontFamily: F.body, fontSize: 14, color: C.muted },
  settingRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  switch: {
    width: 46,
    height: 27,
    borderRadius: 20,
    padding: 3,
    backgroundColor: C.border,
  },
  switchOn: { backgroundColor: C.green },
  knob: { width: 21, height: 21, borderRadius: 12, backgroundColor: C.text },
  knobOn: { alignSelf: "flex-end", backgroundColor: C.bg },
  about: { paddingHorizontal: 4, paddingTop: 4 },
  version: { fontSize: 14, marginTop: 18, color: C.faint },
});
