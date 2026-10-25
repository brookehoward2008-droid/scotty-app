import { shipTime } from "@/lib/scotty-trip";
import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { C, F, Icon, Label, Badge, Button } from "./ui";
import { type Ride, STATIONS } from "@/shared/scotty";
import { copy, stationInfo, locale, type Language } from "@/lib/scotty-i18n";
export const stationName = (id: string) =>
  STATIONS.find((s) => s.id === id)?.name ?? id;
export function RideCard({
  ride,
  language,
  onPress,
  compact = false,
  selected = false,
}: {
  ride: Ride;
  language: Language;
  onPress: () => void;
  compact?: boolean;
  selected?: boolean;
}) {
  const t = (key: Parameters<typeof copy>[1]) => copy(language, key);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      aria-pressed={selected}
      accessibilityLabel={`${stationName(ride.origin)} to ${stationName(ride.destination)}, ${shipTime(ride, "departure")}, ${ride.fare} ${t("credits")}`}
      onPress={onPress}
      style={({ pressed }) => [
        s.card,
        selected && { borderColor: C.mint, backgroundColor: "#1b2b22" },
        { opacity: pressed ? 0.75 : 1 },
        compact && { flex: 1, minWidth: 240 },
      ]}
    >
      <View style={s.row}>
        <View style={s.service}>
          <Icon
            name={ride.service === "vanpool" ? "bus-outline" : "rocket-outline"}
            size={14}
          />
          <Text style={s.small}>{t(ride.service)}</Text>
        </View>
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
      </View>
      <View style={[s.row, { marginTop: 22, alignItems: "flex-start" }]}>
        <View>
          <Text style={s.route}>{stationName(ride.origin)}</Text>
          <Text style={s.station}>
            {stationInfo(ride.origin, language).subtitle}
          </Text>
        </View>
        <Icon name="arrow-forward" size={18} color={C.faint} />
        <View style={{ alignItems: "flex-end", maxWidth: "45%" }}>
          <Text style={s.route}>{stationName(ride.destination)}</Text>
          <Text style={[s.station, { textAlign: "right" }]}>
            {stationInfo(ride.destination, language).subtitle}
          </Text>
        </View>
      </View>
      <View style={[s.row, { marginTop: 19 }]}>
        <Text style={s.time}>{shipTime(ride, "departure")}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View style={s.line} />
          <Text style={[s.small, { fontSize: 14 }]}>
            {ride.duration} {t("min")}
          </Text>
          <View style={s.line} />
        </View>
        <Text style={s.time}>{shipTime(ride, "arrival")}</Text>
      </View>
      {ride.status === "delayed" && (
        <Text style={[s.small, { fontSize: 14, marginTop: 8 }]}>
          {{ en: "Scheduled", es: "Programado", fr: "Prévu" }[language]}:{" "}
          {ride.departure}–{ride.arrival} UTC
        </Text>
      )}
      <View style={[s.row, s.footer]}>
        <View>
          <Text style={s.price}>
            {ride.fare}{" "}
            <Text style={{ fontFamily: F.body, fontSize: 14, color: C.muted }}>
              {t("credits")}
            </Text>
          </Text>
          <Text style={[s.small, { fontSize: 14 }]}>{t("perPerson")}</Text>
        </View>
        <View style={{ alignItems: "flex-end", gap: 7 }}>
          <Text style={[s.small, { fontSize: 14 }]}>
            {ride.seats} {t("seats")}
          </Text>
          <Icon name="arrow-forward-circle-outline" color={C.mint} size={23} />
        </View>
      </View>
    </Pressable>
  );
}
export type SearchValues = {
  origin: string;
  destination: string;
  date: string;
  passengers: number;
};
export function dateISO(offset = 0) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + offset);
  return d.toISOString().slice(0, 10);
}
export function formatDate(date: string, language: Language, short = false) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString(locale(language), {
    month: short ? "short" : "long",
    day: "numeric",
    ...(short ? {} : { weekday: "short" }),
    timeZone: "UTC",
  });
}
export function SearchPanel({
  values,
  language,
  onField,
  onSwap,
  onSearch,
}: {
  values: SearchValues;
  language: Language;
  onField: (field: "origin" | "destination" | "date" | "passengers") => void;
  onSwap: () => void;
  onSearch: () => void;
}) {
  const t = (key: Parameters<typeof copy>[1]) => copy(language, key);
  const { width } = useWindowDimensions();
  const wide = width > 1000;
  const narrow = width < 380;
  return (
    <View style={s.searchPanel}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View
          style={{ backgroundColor: "#26352a", padding: 8, borderRadius: 10 }}
        >
          <Icon name="navigate-outline" color={C.mint} size={17} />
        </View>
        <Text style={{ fontFamily: F.heading, color: C.text, fontSize: 18 }}>
          {t("find")}
        </Text>
        <View style={{ flex: 1 }} />
        <Icon name="sparkles-outline" color={C.faint} size={17} />
      </View>
      <View
        style={{
          marginTop: 20,
          flexDirection: wide ? "row" : "column",
          gap: 12,
        }}
      >
        <View
          style={{
            flex: wide ? 2 : undefined,
            flexDirection: wide ? "row" : "column",
            gap: 8,
            alignItems: wide ? "center" : "stretch",
          }}
        >
          <Field
            icon="radio-button-on-outline"
            title={t("from")}
            text={stationName(values.origin)}
            subtitle={stationInfo(values.origin, language).subtitle}
            onPress={() => onField("origin")}
          />
          <Pressable
            onPress={onSwap}
            accessibilityRole="button"
            accessibilityLabel={t("swap")}
            style={{
              minWidth: 48,
              minHeight: 48,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="swap-horizontal" size={17} color={C.mint} />
          </Pressable>
          <Field
            icon="location-outline"
            title={t("to")}
            text={stationName(values.destination)}
            subtitle={stationInfo(values.destination, language).subtitle}
            onPress={() => onField("destination")}
          />
        </View>
        <View
          style={{
            flexDirection: narrow ? "column" : "row",
            gap: 10,
            flex: wide ? 1.3 : undefined,
          }}
        >
          <Field
            icon="calendar-outline"
            title={t("date")}
            text={
              values.date === dateISO()
                ? t("today")
                : values.date === dateISO(1)
                  ? t("tomorrow")
                  : formatDate(values.date, language, true)
            }
            onPress={() => onField("date")}
          />
          <Field
            icon="people-outline"
            title={t("passengers")}
            text={`${values.passengers} ${t(values.passengers === 1 ? "traveler" : "travelers")}`}
            onPress={() => onField("passengers")}
          />
        </View>
        <Button
          label={t("search")}
          icon="arrow-forward"
          onPress={onSearch}
          style={{
            alignSelf: wide ? "stretch" : "auto",
            paddingHorizontal: 18,
          }}
        />
      </View>
    </View>
  );
}
function Field({
  icon,
  title,
  text,
  subtitle,
  onPress,
}: {
  icon: React.ComponentProps<typeof Icon>["name"];
  title: string;
  text: string;
  subtitle?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}: ${text}`}
      style={({ pressed }) => [
        s.field,
        { backgroundColor: pressed ? C.elevated : "#111513" },
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <Icon name={icon} size={12} />
        <Label>{title}</Label>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 9,
          gap: 7,
        }}
      >
        <Text
          style={{
            fontFamily: F.body,
            fontSize: 14,
            fontWeight: "500",
            color: C.text,
            flex: 1,
          }}
          numberOfLines={2}
        >
          {text}
        </Text>
        <Icon name="chevron-down" size={11} />
      </View>
      {subtitle && (
        <Text
          style={{
            fontFamily: F.body,
            fontSize: 14,
            color: C.faint,
            marginTop: 2,
          }}
          numberOfLines={2}
        >
          {subtitle}
        </Text>
      )}
    </Pressable>
  );
}
const s = StyleSheet.create({
  card: {
    padding: 19,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.panel,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  service: { flexDirection: "row", alignItems: "center", gap: 6 },
  small: { fontFamily: F.body, fontSize: 14, color: C.muted },
  route: { fontFamily: F.heading, fontSize: 23, color: C.text },
  station: { fontFamily: F.body, fontSize: 14, color: C.muted, marginTop: 3 },
  time: { fontFamily: F.mono, fontSize: 16, color: C.text },
  line: { width: 12, height: 1, backgroundColor: C.border },
  footer: {
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 15,
    marginTop: 20,
  },
  price: { fontFamily: F.heading, fontSize: 25, color: C.mint },
  searchPanel: {
    padding: 20,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 18,
    backgroundColor: C.panel,
  },
  field: {
    flex: 1,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    padding: 12,
    minHeight: 72,
  },
});
