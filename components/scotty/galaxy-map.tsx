import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Svg, {
  Defs,
  RadialGradient,
  Stop,
  Circle,
  Ellipse,
  Path,
  Line,
} from "react-native-svg";
import { STATIONS } from "@/shared/scotty";
import { C, F, Icon, IconButton, Label, Body } from "./ui";
import { copy, stationInfo, type Language } from "@/lib/scotty-i18n";
export function GalaxyMap({
  language,
  origin = "earth",
  destination = "luna",
  onSelect,
  large = false,
}: {
  language: Language;
  origin?: string;
  destination?: string;
  onSelect?: (id: string) => void;
  large?: boolean;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const t = (key: Parameters<typeof copy>[1]) => copy(language, key);
  const start = STATIONS.find((s) => s.id === origin) ?? STATIONS[0];
  const end = STATIONS.find((s) => s.id === destination) ?? STATIONS[1];
  const colors: Record<string, string> = {
    earth: "#6bafa0",
    luna: "#a9b3a6",
    mars: "#b07752",
    titan: "#c6a26c",
    europa: "#92b8ba",
    vulcan: "#bc8d67",
  };
  return (
    <View
      accessibilityLabel={t("mapLabel")}
      style={[s.container, { height: large ? 450 : 390 }]}
    >
      <View style={s.top}>
        <View>
          <Label color={C.mint}>{t("nearby")}</Label>
          <Body style={{ fontSize: 14, marginTop: 5 }}>{t("mapSubtitle")}</Body>
        </View>
        <Icon name="planet-outline" size={21} />
      </View>
      <View style={[s.universe, { transform: [{ scale: zoom }] }]}>
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <Defs>
            {Object.entries(colors).map(([id, color]) => (
              <RadialGradient key={id} id={id} cx="30%" cy="25%" r="75%">
                <Stop offset="0" stopColor={color} />
                <Stop offset="0.6" stopColor={color} stopOpacity="0.7" />
                <Stop offset="1" stopColor="#0d1410" />
              </RadialGradient>
            ))}
          </Defs>
          {[17, 28, 40, 52].map((r) => (
            <Ellipse
              key={r}
              cx="25"
              cy="58"
              rx={r * 1.3}
              ry={r}
              stroke="#27352d"
              strokeWidth="0.2"
              fill="none"
              transform="rotate(-22 25 58)"
            />
          ))}
          {Array.from({ length: 45 }, (_, i) => (
            <Circle
              key={i}
              cx={(i * 37 + 11) % 100}
              cy={(i * 19 + 7) % 100}
              r={i % 5 === 0 ? 0.2 : 0.1}
              fill="#667b6b"
              opacity={i % 3 === 0 ? 0.7 : 0.35}
            />
          ))}
          <Line
            x1="0"
            y1="50"
            x2="100"
            y2="50"
            stroke="#223026"
            strokeWidth="0.1"
          />
          <Line
            x1="50"
            y1="0"
            x2="50"
            y2="100"
            stroke="#223026"
            strokeWidth="0.1"
          />
          <Path
            d={`M ${start.x} ${start.y} Q ${(start.x + end.x) / 2} ${Math.min(start.y, end.y) - 15} ${end.x} ${end.y}`}
            fill="none"
            stroke={C.mint}
            strokeWidth="0.4"
            strokeDasharray="1 1.5"
          />
          <Circle
            cx={start.x}
            cy={start.y}
            r="9"
            fill={C.mint}
            opacity="0.035"
          />
          <Circle
            cx={start.x}
            cy={start.y}
            r="7"
            stroke={C.mint}
            opacity="0.35"
            strokeWidth="0.2"
            fill="none"
          />
          <Circle
            cx={end.x}
            cy={end.y}
            r="7"
            stroke={C.mint}
            opacity="0.3"
            strokeWidth="0.2"
            fill="none"
          />
        </Svg>
        {STATIONS.map((station) => (
          <Pressable
            key={station.id}
            onPress={() =>
              setSelected(selected === station.id ? null : station.id)
            }
            accessibilityRole="button"
            accessibilityLabel={`${station.name}, ${stationInfo(station.id, language).subtitle}`}
            style={[s.station, { left: `${station.x}%`, top: `${station.y}%` }]}
          >
            <Svg
              width={station.id === "earth" ? 35 : 24}
              height={station.id === "earth" ? 35 : 24}
              viewBox="0 0 30 30"
            >
              <Circle cx="15" cy="15" r="13" fill={`url(#${station.id})`} />
              <Defs>
                <RadialGradient id={station.id} cx="25%" cy="20%" r="85%">
                  <Stop offset="0" stopColor={colors[station.id]} />
                  <Stop
                    offset="0.5"
                    stopColor={colors[station.id]}
                    stopOpacity="0.85"
                  />
                  <Stop offset="1" stopColor="#0b1612" />
                </RadialGradient>
              </Defs>
              {station.id === "earth" && (
                <Path
                  d="M8 5 L16 4 L19 8 L15 12 L19 16 L12 21 L10 15 L6 13 Z"
                  fill="#829f77"
                  opacity="0.65"
                />
              )}
              {station.id === "luna" && (
                <>
                  <Circle cx="11" cy="10" r="3" fill="#596358" opacity="0.5" />
                  <Circle cx="20" cy="18" r="4" fill="#626a60" opacity="0.5" />
                </>
              )}
            </Svg>
            <Text
              style={[
                s.stationName,
                {
                  color:
                    origin === station.id || destination === station.id
                      ? C.text
                      : C.muted,
                },
              ]}
            >
              {station.name}
            </Text>
          </Pressable>
        ))}
        <View
          style={{
            position: "absolute",
            left: `${(start.x + end.x) / 2}%`,
            top: `${(start.y + end.y) / 2 - 8}%`,
            backgroundColor: C.mint,
            borderRadius: 18,
            padding: 5,
            transform: [{ rotate: "-35deg" }],
          }}
        >
          <Icon name="rocket" color={C.bg} size={12} />
        </View>
      </View>
      {selected && (
        <View style={s.popup}>
          <View style={{ flex: 1 }}>
            <Text
              style={{ fontFamily: F.heading, color: C.text, fontSize: 16 }}
            >
              {STATIONS.find((s) => s.id === selected)?.name}
            </Text>
            <Body style={{ fontSize: 14 }}>
              {stationInfo(selected, language).subtitle}
            </Body>
          </View>
          {onSelect && (
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                onSelect(selected);
                setSelected(null);
              }}
              style={{ padding: 10 }}
            >
              <Icon name="arrow-forward" color={C.mint} />
            </Pressable>
          )}
          <Pressable
            onPress={() => setSelected(null)}
            accessibilityLabel={t("close")}
            style={{ padding: 8 }}
          >
            <Icon name="close" size={17} />
          </Pressable>
        </View>
      )}
      <View style={s.bottom}>
        <View style={{ gap: 6 }}>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <Legend color={C.mint} text={t("pickup")} />
            <Legend color={C.muted} text={t("dropoff")} />
          </View>
          <Text style={{ fontFamily: F.body, fontSize: 14, color: C.faint }}>
            {t("mapDemo")}
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 6, alignSelf: "flex-end" }}>
          <IconButton
            name="remove"
            label="Zoom out"
            size={29}
            onPress={() => setZoom((v) => Math.max(0.85, v - 0.15))}
          />
          <IconButton
            name="add"
            label="Zoom in"
            size={29}
            onPress={() => setZoom((v) => Math.min(1.6, v + 0.15))}
          />
          <IconButton
            name="locate-outline"
            label="Reset map"
            size={29}
            onPress={() => {
              setZoom(1);
              setSelected(null);
            }}
          />
        </View>
      </View>
    </View>
  );
}
function Legend({ color, text }: { color: string; text: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
      <View
        style={{ width: 5, height: 5, borderRadius: 5, backgroundColor: color }}
      />
      <Text style={{ fontFamily: F.body, fontSize: 14, color: C.muted }}>
        {text}
      </Text>
    </View>
  );
}
const s = StyleSheet.create({
  container: {
    backgroundColor: "#121815",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#29372c",
    overflow: "hidden",
  },
  top: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    zIndex: 2,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  universe: { position: "absolute", top: 78, bottom: 125, left: 0, right: 0 },
  station: {
    position: "absolute",
    width: 64,
    height: 55,
    marginLeft: -32,
    marginTop: -19,
    alignItems: "center",
    justifyContent: "center",
  },
  stationName: { fontFamily: F.body, fontSize: 14, marginTop: 4 },
  bottom: {
    position: "absolute",
    bottom: 14,
    left: 18,
    right: 14,
    flexDirection: "column",
    alignItems: "stretch",
    gap: 10,
  },
  popup: {
    position: "absolute",
    bottom: 130,
    left: 18,
    right: 18,
    padding: 12,
    backgroundColor: "#26362b",
    borderWidth: 1,
    borderColor: "#415647",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 5,
  },
});
