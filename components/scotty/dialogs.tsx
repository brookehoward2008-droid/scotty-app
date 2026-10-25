import { useSafeAreaInsets } from "react-native-safe-area-context";
import { shipTime, paymentError } from "@/lib/scotty-trip";
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import Svg, { Rect } from "react-native-svg";
import {
  C,
  F,
  Mark,
  Icon,
  IconButton,
  Title,
  Body,
  Label,
  Button,
  Badge,
} from "./ui";
import {
  STATIONS,
  RIDES,
  fareBreakdown,
  type Ride,
  type Booking,
} from "@/shared/scotty";
import { stationName, dateISO, formatDate, type SearchValues } from "./rides";
import { stationInfo } from "@/lib/scotty-i18n";
import { type ScottyState } from "@/hooks/use-scotty";
export type Dialog =
  | {
      kind:
        | "origin"
        | "destination"
        | "date"
        | "passengers"
        | "help"
        | "notifications";
    }
  | { kind: "ride" | "review"; ride: Ride }
  | { kind: "confirmation" | "ticket" | "cancel"; booking: Booking }
  | null;
export function Dialogs({
  dialog,
  setDialog,
  state,
  values,
  setValues,
  onTrips,
  remainingSeats,
}: {
  dialog: Dialog;
  setDialog: (d: Dialog) => void;
  state: ScottyState;
  values: SearchValues;
  setValues: (v: SearchValues) => void;
  onTrips: () => void;
  remainingSeats?: { rideId: string; seats: number }[];
}) {
  const { t, language } = state;
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [error, setError] = useState("");
  const request = useRef("");
  useEffect(() => {
    if (dialog?.kind === "review")
      request.current = `sct-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }, [dialog]);
  if (!dialog) return null;
  const kind = dialog.kind;
  const fixtureRide =
    "ride" in dialog
      ? dialog.ride
      : "booking" in dialog
        ? RIDES.find((r) => r.id === dialog.booking.rideId)
        : undefined;
  const ride = fixtureRide && {
    ...fixtureRide,
    seats:
      remainingSeats?.find((item) => item.rideId === fixtureRide.id)?.seats ??
      0,
  };
  const booking = "booking" in dialog ? dialog.booking : undefined;
  const heading =
    kind === "origin" || kind === "destination"
      ? t("selectStation")
      : kind === "date"
        ? t("selectDate")
        : kind === "passengers"
          ? t("selectPassengers")
          : kind === "ride"
            ? t("details")
            : kind === "review"
              ? t("review")
              : kind === "confirmation"
                ? t("receipt")
                : kind === "ticket"
                  ? t("boardingPass")
                  : kind === "cancel"
                    ? t("cancelTitle")
                    : kind === "notifications"
                      ? t("notificationTitle")
                      : t("help");
  const close = () => {
    if (!state.paying && !state.cancelling) setDialog(null);
  };
  const choose = (
    field: "origin" | "destination" | "date" | "passengers",
    value: string | number,
  ) => {
    setValues({ ...values, [field]: value });
    setDialog(null);
  };
  const pay = async () => {
    if (!ride) return;
    setError("");
    try {
      const b = await state.book({
        rideId: ride.id,
        date: values.date,
        passengers: values.passengers,
        requestId: request.current,
      });
      setDialog({ kind: "confirmation", booking: b });
    } catch (e) {
      setError(paymentError(e, language));
    }
  };
  const cancel = async () => {
    if (!booking) return;
    setError("");
    try {
      await state.cancel(booking.id);
      setDialog(null);
    } catch (e) {
      setError(paymentError(e, language));
    }
  };
  return (
    <Modal visible transparent animationType="fade" onRequestClose={close}>
      <View
        style={[
          s.overlay,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 },
        ]}
      >
        <Pressable
          onPress={close}
          accessibilityLabel={t("close")}
          style={StyleSheet.absoluteFill}
        />
        <View
          accessibilityViewIsModal
          style={[
            s.modal,
            {
              width: Math.min(width - 28, 560),
              maxHeight: height - insets.top - insets.bottom - 32,
            },
          ]}
        >
          <View style={s.header}>
            <View
              style={{ flex: 1, flexDirection: "row", gap: 10, alignItems: "center" }}
            >
              <Mark size={22} />
              <Text
                style={{ flexShrink: 1, fontFamily: F.heading, fontSize: 19, color: C.text }}
              >
                {heading}
              </Text>
            </View>
            <IconButton
              name="close"
              onPress={close}
              label={t("close")}
              size={32}
            />
          </View>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ padding: 24, gap: 22 }}
            showsVerticalScrollIndicator={false}
          >
            {(kind === "origin" || kind === "destination") &&
              STATIONS.map((station) => (
                <Pressable
                  key={station.id}
                  accessibilityRole="button"
                  accessibilityState={{
                    selected: values[kind] === station.id,
                    disabled:
                      station.id ===
                      values[kind === "origin" ? "destination" : "origin"],
                  }}
                  disabled={
                    station.id ===
                    values[kind === "origin" ? "destination" : "origin"]
                  }
                  onPress={() => choose(kind, station.id)}
                  style={({ pressed }) => [
                    s.station,
                    {
                      opacity:
                        station.id ===
                        values[kind === "origin" ? "destination" : "origin"]
                          ? 0.4
                          : 1,
                    },
                    { backgroundColor: pressed ? C.elevated : C.panel },
                  ]}
                >
                  <View
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 20,
                      backgroundColor: "#28382c",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon name="planet-outline" color={C.mint} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Title size={19}>{station.name}</Title>
                    <Body style={{ fontSize: 14 }}>
                      {stationInfo(station.id, language).subtitle}
                    </Body>
                  </View>
                  <Label>{station.code}</Label>
                  {values[kind] === station.id && (
                    <Icon name="checkmark-circle" color={C.mint} />
                  )}
                </Pressable>
              ))}
            {kind === "date" && (
              <>
                <Body>{t("shipTime")}</Body>
                {Array.from({ length: 30 }, (_, i) => dateISO(i)).map(
                  (date, i) => (
                    <Pressable
                      key={date}
                      accessibilityRole="button"
                      accessibilityState={{ selected: values.date === date }}
                      onPress={() => choose("date", date)}
                      style={s.date}
                    >
                      <Body style={{ color: C.text }}>
                        {i === 0
                          ? t("today")
                          : i === 1
                            ? t("tomorrow")
                            : formatDate(date, language)}
                      </Body>
                      <Body style={{ fontSize: 14 }}>
                        {formatDate(date, language, true)}
                      </Body>
                      {values.date === date && (
                        <Icon name="checkmark" color={C.mint} />
                      )}
                    </Pressable>
                  ),
                )}
              </>
            )}
            {kind === "passengers" && (
              <>
                <Body>{t("selectPassengers")}</Body>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: 20,
                  }}
                >
                  <IconButton
                    name="remove"
                    disabled={values.passengers <= 1}
                    size={52}
                    label="Remove traveler"
                    onPress={() =>
                      setValues({
                        ...values,
                        passengers: Math.max(1, values.passengers - 1),
                      })
                    }
                  />
                  <View style={{ alignItems: "center", gap: 5 }}>
                    <Title size={56}>{values.passengers}</Title>
                    <Body>
                      {t(values.passengers === 1 ? "traveler" : "travelers")}
                    </Body>
                  </View>
                  <IconButton
                    name="add"
                    disabled={values.passengers >= 8}
                    size={52}
                    label="Add traveler"
                    onPress={() =>
                      setValues({
                        ...values,
                        passengers: Math.min(8, values.passengers + 1),
                      })
                    }
                  />
                </View>
                <Button label={t("done")} onPress={close} />
              </>
            )}
            {(kind === "ride" || kind === "review") && ride && (
              <>
                <View style={s.row}>
                  <Badge
                    text={t(
                      ride.status === "on-time"
                        ? "onTime"
                        : ride.status === "delayed"
                          ? "delayed"
                          : "cancelled",
                    )}
                    type={
                      ride.status === "on-time"
                        ? "green"
                        : ride.status === "delayed"
                          ? "amber"
                          : "muted"
                    }
                  />
                  <Body style={{ fontSize: 14 }}>
                    {t(ride.service)} · {ride.seats} {t("seats")}
                  </Body>
                </View>
                <Route ride={ride} state={state} />
                <Body style={{ fontSize: 14, textAlign: "center" }}>
                  {formatDate(values.date, language)} · {t("shipTime")}
                </Body>
                {kind === "ride" && (
                  <>
                    <View style={s.block}>
                      <Label>{t("operator")}</Label>
                      <View style={[s.row, { marginTop: 12 }]}>
                        <View
                          style={{
                            flexDirection: "row",
                            gap: 12,
                            alignItems: "center",
                          }}
                        >
                          <View style={s.avatar}>
                            <Text
                              style={{
                                fontFamily: F.heading,
                                color: C.mint,
                                fontSize: 19,
                              }}
                            >
                              {ride.driver
                                .split(" ")
                                .map((n) => n[0])
                                .slice(0, 2)
                                .join("")}
                            </Text>
                          </View>
                          <View>
                            <Body style={{ color: C.text }}>{ride.driver}</Body>
                            <Body style={{ fontSize: 14 }}>
                              {ride.operator} · {ride.vehicle}
                            </Body>
                          </View>
                        </View>
                        <View style={{ alignItems: "flex-end" }}>
                          <Body style={{ color: C.amber }}>
                            ★ {ride.rating}
                          </Body>
                          <Body style={{ fontSize: 14 }}>{t("verified")}</Body>
                        </View>
                      </View>
                    </View>
                    <View style={s.block}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 7,
                          marginBottom: 10,
                        }}
                      >
                        <Icon
                          name="location-outline"
                          color={C.mint}
                          size={18}
                        />
                        <Title size={18}>{t("boarding")}</Title>
                      </View>
                      <Body style={{ color: C.text }}>
                        {stationInfo(ride.origin, language).pickup}
                      </Body>
                      <Body style={{ fontSize: 14, marginTop: 5 }}>
                        {stationInfo(ride.origin, language).guidance}
                      </Body>
                      <View
                        style={{ flexDirection: "row", gap: 7, marginTop: 13 }}
                      >
                        <Icon name="time-outline" size={15} color={C.mint} />
                        <Body style={{ fontSize: 14, color: C.mint }}>
                          {t("arriveEarly")} · {t("gate")} {ride.gate}
                        </Body>
                      </View>
                    </View>
                  </>
                )}
                <Fare
                  ride={ride}
                  passengers={values.passengers}
                  state={state}
                />
                {kind === "review" && (
                  <>
                    <View style={s.block}>
                      <Label>{t("payment")}</Label>
                      <View style={[s.row, { marginTop: 13 }]}>
                        <Icon name="wallet-outline" size={25} color={C.mint} />
                        <View style={{ flex: 1 }}>
                          <Body style={{ color: C.text }}>
                            {t("creditWallet")}
                          </Body>
                          <Body style={{ fontSize: 14 }}>
                            {t("balance")}: {state.wallet?.balance ?? "—"}{" "}
                            {t("credits")}
                          </Body>
                        </View>
                        <Icon name="checkmark-circle" color={C.mint} />
                      </View>
                    </View>
                    {state.wallet &&
                      state.wallet.balance <
                        fareBreakdown(ride, values.passengers).total && (
                        <Body style={{ color: C.amber }}>
                          {t("insufficient")}
                        </Body>
                      )}
                    {(state.sessionError || state.apiError) && (
                      <Button
                        secondary
                        label={t("retry")}
                        onPress={() => void state.refresh()}
                      />
                    )}
                  </>
                )}
                {error && <Body style={{ color: C.amber }}>{error}</Body>}
                <Button
                  label={
                    kind === "review"
                      ? state.paying
                        ? t("processing")
                        : t("confirm")
                      : t("review")
                  }
                  icon="arrow-forward"
                  loading={state.paying}
                  disabled={
                    ride.status === "cancelled" ||
                    values.passengers > ride.seats ||
                    (kind === "review" &&
                      (!state.wallet ||
                        state.wallet.balance <
                          fareBreakdown(ride, values.passengers).total))
                  }
                  onPress={
                    kind === "review"
                      ? () => void pay()
                      : () => setDialog({ kind: "review", ride })
                  }
                />
                {ride.status === "cancelled" && (
                  <Body style={{ textAlign: "center" }}>{t("noService")}</Body>
                )}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 7,
                  }}
                >
                  <Icon
                    name="shield-checkmark-outline"
                    color={C.muted}
                    size={13}
                  />
                  <Body style={{ fontSize: 14, textAlign: "center" }}>
                    {t("secure")}
                  </Body>
                </View>
              </>
            )}
            {kind === "confirmation" && booking && ride && (
              <>
                <View
                  style={{ alignItems: "center", gap: 13, paddingVertical: 12 }}
                >
                  <View
                    style={{
                      padding: 15,
                      borderRadius: 50,
                      backgroundColor: "#273e2d",
                    }}
                  >
                    <Icon name="checkmark" size={34} color={C.mint} />
                  </View>
                  <Title size={31}>{t("booked")}</Title>
                  <Body style={{ textAlign: "center" }}>{t("bookedSub")}</Body>
                </View>
                <View style={s.block}>
                  <Label>{t("reference")}</Label>
                  <Text
                    style={{
                      fontFamily: F.mono,
                      fontSize: 25,
                      color: C.mint,
                      marginTop: 9,
                      letterSpacing: 3,
                    }}
                  >
                    {booking.reference}
                  </Text>
                  <View style={{ marginTop: 20 }}>
                    <Route ride={ride} state={state} />
                  </View>
                  <Body style={{ fontSize: 14, marginTop: 12 }}>
                    {formatDate(booking.date, language)} · {booking.passengers}{" "}
                    {t("travelers")}
                  </Body>
                  <View
                    style={[
                      s.row,
                      {
                        marginTop: 15,
                        borderTopWidth: 1,
                        borderTopColor: C.border,
                        paddingTop: 15,
                      },
                    ]}
                  >
                    <Body>{t("paid")}</Body>
                    <Body style={{ color: C.text }}>
                      {booking.total} {t("credits")}
                    </Body>
                  </View>
                </View>
                <Button
                  label={t("viewTrips")}
                  icon="arrow-forward"
                  onPress={() => {
                    setDialog(null);
                    onTrips();
                  }}
                />
              </>
            )}
            {kind === "ticket" && booking && ride && (
              <>
                <View style={s.block}>
                  <Badge
                    text={t(
                      booking.status === "cancelled"
                        ? "cancelled"
                        : "confirmed",
                    )}
                    type={booking.status === "cancelled" ? "muted" : "green"}
                  />
                  <View style={{ marginTop: 22 }}>
                    <Route ride={ride} state={state} />
                  </View>
                  <View
                    style={[
                      s.row,
                      {
                        marginVertical: 22,
                        borderTopWidth: 1,
                        borderTopColor: C.border,
                        paddingTop: 20,
                      },
                    ]}
                  >
                    <TicketValue
                      label={t("dateLabel")}
                      value={formatDate(booking.date, language, true)}
                    />
                    <TicketValue label={t("gate")} value={ride.gate} />
                    <TicketValue
                      label={t("seatCount")}
                      value={String(booking.passengers)}
                    />
                  </View>
                  <Label>{t("reference")}</Label>
                  <Text
                    style={{
                      fontFamily: F.mono,
                      fontSize: 23,
                      color: C.mint,
                      letterSpacing: 3,
                      marginTop: 10,
                    }}
                  >
                    {booking.reference}
                  </Text>
                  <View style={{ marginTop: 19 }}>
                    <Barcode reference={booking.reference} />
                  </View>
                  <Body
                    style={{ fontSize: 14, textAlign: "center", marginTop: 10 }}
                  >
                    {t("notTicket")}
                  </Body>
                </View>
                <View>
                  <Title size={20}>{t("boarding")}</Title>
                  <Body style={{ color: C.text, marginTop: 10 }}>
                    {stationInfo(ride.origin, language).pickup} · {t("gate")}{" "}
                    {ride.gate}
                  </Body>
                  <Body style={{ fontSize: 14, marginTop: 8 }}>
                    {stationInfo(ride.origin, language).guidance}
                  </Body>
                  <Body style={{ fontSize: 14, color: C.mint, marginTop: 10 }}>
                    {t("arriveEarly")}
                  </Body>
                </View>
                <View style={s.block}>
                  <View style={s.row}>
                    <Body>{t("paid")}</Body>
                    <Body style={{ color: C.mint }}>
                      {booking.total} {t("credits")}
                    </Body>
                  </View>
                </View>
              </>
            )}
            {kind === "cancel" && (
              <>
                <Body>{t("cancelSub")}</Body>
                {error && <Body style={{ color: C.amber }}>{error}</Body>}
                <Button
                  label={t("cancelConfirm")}
                  onPress={() => void cancel()}
                  loading={state.cancelling}
                />
                <Button label={t("keep")} secondary onPress={close} />
              </>
            )}
            {kind === "help" && (
              <>
                <Title size={25}>{t("helpSub")}</Title>
                <Body>{t("helpText")}</Body>
                <Button label={t("done")} onPress={close} />
              </>
            )}
            {kind === "notifications" && (
              <>
                <Badge text={t("system")} />
                <Body>{t("notificationText")}</Body>
                {state.reminders &&
                  state.bookings
                    .filter(
                      (b) => b.status === "confirmed" && b.date >= dateISO(),
                    )
                    .slice(0, 3)
                    .map((b) => (
                      <View key={b.id} style={s.block}>
                        <Body style={{ color: C.text }}>
                          {stationName(
                            RIDES.find((r) => r.id === b.rideId)?.destination ??
                              "luna",
                          )}{" "}
                          · {formatDate(b.date, language, true)}
                        </Body>
                        <Body style={{ fontSize: 14 }}>{t("arriveEarly")}</Body>
                      </View>
                    ))}
                <Button label={t("done")} onPress={close} />
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
function Route({ ride, state }: { ride: Ride; state: ScottyState }) {
  return (
    <View style={s.row}>
      <View>
        <Title size={30}>{stationName(ride.origin)}</Title>
        <Text style={s.time}>{shipTime(ride, "departure")} UTC</Text>
      </View>
      <View style={{ alignItems: "center", gap: 7 }}>
        <Icon name="arrow-forward" color={C.mint} size={25} />
        <Body style={{ fontSize: 14 }}>
          {ride.duration} {state.t("min")}
        </Body>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Title size={30}>{stationName(ride.destination)}</Title>
        <Text style={s.time}>{shipTime(ride, "arrival")} UTC</Text>
      </View>
    </View>
  );
}
function Fare({
  ride,
  passengers,
  state,
}: {
  ride: Ride;
  passengers: number;
  state: ScottyState;
}) {
  const price = fareBreakdown(ride, passengers);
  return (
    <View>
      <Title size={19}>{state.t("fare")}</Title>
      <View style={{ gap: 12, marginTop: 15 }}>
        <View style={s.row}>
          <Body style={{ fontSize: 14 }}>
            {state.t("baseFare")} · {passengers} × {ride.fare}
          </Body>
          <Body style={{ color: C.text }}>
            {price.base} {state.t("credits")}
          </Body>
        </View>
        <View style={s.row}>
          <Body style={{ fontSize: 14 }}>
            {state.t("serviceFee")} · {passengers} × 3
          </Body>
          <Body style={{ color: C.text }}>
            {price.fee} {state.t("credits")}
          </Body>
        </View>
        <View
          style={[
            s.row,
            { paddingTop: 15, borderTopWidth: 1, borderTopColor: C.border },
          ]}
        >
          <Title size={19}>{state.t("total")}</Title>
          <Text style={{ fontFamily: F.heading, fontSize: 27, color: C.mint }}>
            {price.total}{" "}
            <Text style={{ fontSize: 14 }}>{state.t("credits")}</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}
function TicketValue({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ gap: 7 }}>
      <Label>{label}</Label>
      <Body style={{ color: C.text, fontSize: 15 }}>{value}</Body>
    </View>
  );
}
function Barcode({ reference }: { reference: string }) {
  return (
    <Svg width="100%" height="44" viewBox="0 0 300 44">
      {Array.from({ length: 75 }, (_, i) => (
        <Rect
          key={i}
          x={i * 4}
          y="0"
          width={1 + (reference.charCodeAt(i % reference.length) % 3)}
          height="44"
          fill={C.text}
        />
      ))}
    </Svg>
  );
}
const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    backgroundColor: C.bg,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: C.border,
    overflow: "hidden",
  },
  header: {
    padding: 19,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  station: {
    padding: 13,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: C.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },
  date: {
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  time: { fontFamily: F.mono, fontSize: 15, color: C.muted, marginTop: 10 },
  block: {
    padding: 18,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 15,
    backgroundColor: C.panel,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 22,
    backgroundColor: "#29392e",
    alignItems: "center",
    justifyContent: "center",
  },
});
