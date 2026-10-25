import React, { useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Body, C, F, Icon, Label, Mark } from "@/components/scotty/ui";

const COLORS = [
  { token: "space.950", hex: "#0B1110", role: "Canvas" },
  { token: "space.900", hex: "#101816", role: "Navigation" },
  { token: "surface.800", hex: "#151E1B", role: "Cards" },
  { token: "surface.700", hex: "#1C2823", role: "Sheets" },
  { token: "line.subtle", hex: "#283832", role: "Borders" },
  { token: "text.primary", hex: "#F2F5F1", role: "Headlines" },
  { token: "text.secondary", hex: "#AFBBB3", role: "Supporting text" },
  { token: "text.quiet", hex: "#82918A", role: "Hints" },
  { token: "scotty.mint", hex: "#55E0AA", role: "Signature / action" },
  { token: "scotty.mint.deep", hex: "#173C30", role: "Mint surface" },
  { token: "status.good", hex: "#69D8A2", role: "Confirmed / on time" },
  { token: "status.caution", hex: "#F1BD70", role: "Delay / attention" },
  { token: "status.error", hex: "#FF827A", role: "Blocking error" },
  { token: "status.neutral", hex: "#9AA9A1", role: "Past / cancelled" },
  { token: "focus.ring", hex: "#B9FFE0", role: "Keyboard focus" },
] as const;
const PLANETS = ["Earth", "Luna", "Mars", "Titan"];
const MOTIONS = [
  { label: "Tap", time: "90–120 ms", use: "Button feedback" },
  { label: "State", time: "160–220 ms", use: "Filters & status" },
  { label: "Sheet", time: "240–300 ms", use: "Pickers & fare review" },
  { label: "Route", time: "450–650 ms", use: "Find → results" },
];

export default function BrandGuideScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [activeColor, setActiveColor] = useState("scotty.mint");
  const [destination, setDestination] = useState("Luna");
  const [delayed, setDelayed] = useState(false);
  const [feedbackPlayed, setFeedbackPlayed] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const signal = useRef(new Animated.Value(0)).current;
  const wide = width >= 760;
  const activeToken =
    COLORS.find((item) => item.token === activeColor) ?? COLORS[8];
  const specimenAccent = [
    "space.950",
    "space.900",
    "surface.800",
    "surface.700",
    "line.subtle",
  ].includes(activeColor)
    ? "#55E0AA"
    : activeToken.hex;
  const exit = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  };

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => {
        if (mounted) setReduceMotion(value);
      })
      .catch(() => {});
    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduceMotion,
    );
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  const playConfirmation = () => {
    setFeedbackPlayed((current) => !current);
    signal.stopAnimation();
    signal.setValue(0);
    if (!reduceMotion) {
      Animated.timing(signal, {
        toValue: 1,
        duration: 460,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <ScrollView
      style={s.screen}
      contentContainerStyle={[
        s.content,
        {
          paddingTop: Math.max(insets.top, 18) + 8,
          paddingBottom: Math.max(insets.bottom, 18) + 40,
        },
        wide && s.contentWide,
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={s.topbar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to Scotty"
          onPress={exit}
          style={s.back}
        >
          <Icon name="arrow-back" color={C.text} size={19} />
          <Text style={s.backText}>Back to Scotty</Text>
        </Pressable>
        <View style={s.topMark}>
          <Mark size={23} />
          <Text style={s.wordmark}>
            scotty<Text style={{ color: "#55E0AA" }}>.</Text>
          </Text>
        </View>
      </View>

      <View style={[s.hero, wide && s.heroWide]}>
        <View style={[s.heroCopy, wide && { flex: 1.2 }]}>
          <View style={s.kicker}>
            <View style={s.liveDot} />
            <Label color="#55E0AA">BRAND & MOTION · 01</Label>
          </View>
          <Text style={s.heroTitle}>
            Your galaxy.{"\n"}
            <Text style={{ color: "#55E0AA" }}>One ride away.</Text>
          </Text>
          <Text style={s.heroBody}>
            Optimistic spaceflight, made useful. A dependable transit guide with
            just enough wonder.
          </Text>
          <View style={s.traits}>
            {[
              ["01", "Capable"],
              ["02", "Curious"],
              ["03", "Warm"],
            ].map(([n, label]) => (
              <View key={n} style={s.trait}>
                <Text style={s.traitNumber}>{n}</Text>
                <Text style={s.traitText}>{label}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={[s.identityCard, wide && { flex: 0.8 }]}>
          <View style={s.identityHalo}>
            <View style={s.orbit} />
            <Mark size={78} color="#55E0AA" />
            <View style={s.orbitDot} />
          </View>
          <Text style={s.identityWordmark}>
            scotty<Text style={{ color: "#55E0AA" }}>.</Text>
          </Text>
          <Text style={s.identityCaption}>THE WAYFINDER MARK</Text>
          <Text style={s.identitySub}>
            An interrupted orbit, a bright waypoint, and a route with room to
            explore.
          </Text>
        </View>
      </View>

      <View style={s.disclosure}>
        <Icon name="information-circle-outline" color="#55E0AA" size={18} />
        <Text style={s.disclosureText}>
          Inspired by optimistic interstellar exploration—not a replica of any
          franchise. Fictional travel · Demo credits only.
        </Text>
      </View>

      <SectionHeader
        number="01"
        title="Color, with a purpose"
        subtitle="Tap a swatch to inspect the token and watch the live specimen update."
      />
      <View style={s.paletteWrap}>
        {COLORS.map((color) => {
          const selected = activeColor === color.token;
          return (
            <Pressable
              key={color.token}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={`${color.token}, ${color.hex}, ${color.role}`}
              onPress={() => setActiveColor(color.token)}
              style={[
                s.swatch,
                selected && s.swatchSelected,
                wide && { width: 196 },
              ]}
            >
              <View
                style={[
                  s.swatchColor,
                  { backgroundColor: color.hex },
                  color.token.startsWith("text.") && {
                    borderWidth: 1,
                    borderColor: "#3A4942",
                  },
                ]}
              />
              <View style={s.swatchMeta}>
                <Text style={s.swatchName}>{color.token}</Text>
                <Text style={s.swatchRole}>
                  {color.hex} · {color.role}
                </Text>
              </View>
              {selected && (
                <Icon name="checkmark-circle" color="#55E0AA" size={18} />
              )}
            </Pressable>
          );
        })}
      </View>
      <View style={s.specimen}>
        <View style={s.specimenHeader}>
          <View>
            <Label color="#82918A">LIVE COLOR SPECIMEN</Label>
            <Text style={s.specimenTitle}>A little closer to anywhere.</Text>
          </View>
          <View style={[s.hexTag, { borderColor: activeToken.hex }]}>
            <View style={[s.miniDot, { backgroundColor: activeToken.hex }]} />
            <Text style={s.hexText}>{activeToken.hex}</Text>
          </View>
        </View>
        <Text style={s.specimenBody}>
          UI preview only — no booking is made.{" "}
          <Text style={{ color: "#F2F5F1" }}>Gate E-01</Text> is sample copy.
        </Text>
        <View style={s.specimenActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Play the Scotty confirmation motion preview. No booking will be created."
            onPress={playConfirmation}
            style={[s.primaryButton, { backgroundColor: specimenAccent }]}
          >
            <Icon
              name={feedbackPlayed ? "checkmark-circle" : "navigate-outline"}
              color="#0B1110"
              size={18}
            />
            <Text style={s.primaryLabel}>
              {feedbackPlayed ? "Preview played" : "Preview confirmation"}
            </Text>
          </Pressable>
          <View style={s.darkChip}>
            <Text style={s.darkChipText}>Secondary action</Text>
          </View>
        </View>
        <View style={s.rail}>
          <View style={s.railLine} />
          <Animated.View
            style={[
              s.railPulse,
              {
                opacity: signal,
                transform: [
                  {
                    translateX: signal.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-12, 100],
                    }),
                  },
                ],
              },
            ]}
          />
          <View style={s.railStart} />
          <View style={s.railEnd} />
        </View>
        <Text style={s.railCaption}>
          {feedbackPlayed
            ? "Motion preview played locally · No booking created"
            : "Waypoint arc · Illustrative, not live tracking"}
        </Text>
      </View>

      <SectionHeader
        number="02"
        title="Signal, don’t shout"
        subtitle="Status is always named in text. Color reinforces the message; it never carries the message alone."
      />
      <View style={[s.demoRow, wide && s.demoRowWide]}>
        <View style={[s.statusCard, wide && { flex: 1 }]}>
          <Label color="#82918A">INTERACTION · SERVICE STATUS</Label>
          <View style={s.segmented}>
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{ selected: !delayed }}
              onPress={() => setDelayed(false)}
              style={[s.segment, !delayed && s.segmentActive]}
            >
              <Text style={[s.segmentText, !delayed && s.segmentTextActive]}>
                On time
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{ selected: delayed }}
              onPress={() => setDelayed(true)}
              style={[s.segment, delayed && s.segmentDelay]}
            >
              <Text style={[s.segmentText, delayed && { color: "#F1BD70" }]}>
                +10 min
              </Text>
            </Pressable>
          </View>
          <View style={s.statusRow}>
            <View
              style={[
                s.statusDot,
                { backgroundColor: delayed ? "#F1BD70" : "#69D8A2" },
              ]}
            />
            <Text style={[s.statusLabel, delayed && { color: "#F1BD70" }]}>
              {delayed ? "Delayed · +10 min" : "On time"}
            </Text>
            <Text style={s.statusDate}>WED · 21 OCT</Text>
          </View>
          <View style={s.timeRow}>
            <View>
              <Text style={s.timeText}>{delayed ? "10:10" : "08:30"}</Text>
              <Text style={s.timeHint}>EARTH · UTC</Text>
            </View>
            <View style={s.timeTrack}>
              <View
                style={[
                  s.trackDot,
                  { backgroundColor: delayed ? "#F1BD70" : "#55E0AA" },
                ]}
              />
              <View style={s.trackLine} />
              <Icon name="arrow-forward" color="#82918A" size={15} />
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={s.timeText}>{delayed ? "10:50" : "09:05"}</Text>
              <Text style={s.timeHint}>LUNA · UTC</Text>
            </View>
          </View>
          {delayed && (
            <Text style={s.scheduled}>Scheduled: 10:00–10:40 UTC</Text>
          )}
        </View>
        <View style={[s.mapCard, wide && { flex: 0.82 }]}>
          <Label color="#82918A">INTERACTION · WAYPOINT SELECTION</Label>
          <Text style={s.mapTitle}>
            {destination === "Luna" ? "Sol network" : `Route to ${destination}`}
          </Text>
          <View style={s.planetRow}>
            {PLANETS.map((planet) => (
              <Pressable
                key={planet}
                accessibilityRole="button"
                accessibilityLabel={`Select destination ${planet}`}
                accessibilityState={{ selected: destination === planet }}
                onPress={() => setDestination(planet)}
                style={s.planetButton}
              >
                <View
                  style={[s.planet, destination === planet && s.planetSelected]}
                >
                  <View
                    style={[
                      s.planetCore,
                      destination === planet && { backgroundColor: "#55E0AA" },
                    ]}
                  />
                </View>
                <Text
                  style={[
                    s.planetLabel,
                    destination === planet && { color: "#F2F5F1" },
                  ]}
                >
                  {planet}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text style={s.mapFoot}>
            Pickup ● · Destination ◉ · Illustrative positions
          </Text>
        </View>
      </View>

      <SectionHeader
        number="03"
        title="Motion with a mission"
        subtitle="Fast confirmations. Quiet transitions. Nothing decorative blocks the timetable."
      />
      <View style={s.motionGrid}>
        {MOTIONS.map((item) => (
          <View
            key={item.label}
            style={[s.motionCard, wide && { width: "23.5%" }]}
          >
            <View style={s.motionTop}>
              <Text style={s.motionLabel}>{item.label}</Text>
              <Text style={s.motionTime}>{item.time}</Text>
            </View>
            <Text style={s.motionUse}>{item.use}</Text>
            <View style={s.motionBar}>
              <View
                style={[
                  s.motionFill,
                  {
                    width:
                      item.label === "Tap"
                        ? "24%"
                        : item.label === "State"
                          ? "39%"
                          : item.label === "Sheet"
                            ? "55%"
                            : "82%",
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
      <Pressable
        accessibilityRole="switch"
        accessibilityState={{ checked: reduceMotion }}
        onPress={() => setReduceMotion((value) => !value)}
        style={s.reduceRow}
      >
        <View style={{ flex: 1 }}>
          <Text style={s.reduceTitle}>Reduced-motion preview</Text>
          <Text style={s.reduceSubtitle}>
            Simplify route travel and animated feedback
          </Text>
        </View>
        <View style={[s.switchTrack, reduceMotion && s.switchOn]}>
          <View style={[s.switchThumb, reduceMotion && s.thumbOn]} />
        </View>
      </Pressable>

      <SectionHeader
        number="04"
        title="A helpful travel crew"
        subtitle="Lead with precise facts; let the personality arrive in the supporting copy."
      />
      <View style={[s.voiceRow, wide && s.demoRowWide]}>
        <View style={[s.voiceCard, wide && { flex: 1 }]}>
          <Label color="#55E0AA">DO · CALM & SPECIFIC</Label>
          <Text style={s.voiceExample}>
            “Your gate is set. Arrive 15 minutes before ship time.”
          </Text>
        </View>
        <View style={[s.voiceCard, s.avoidCard, wide && { flex: 1 }]}>
          <Label color="#F1BD70">AVOID · JARGON & FALSE PROMISES</Label>
          <Text style={s.voiceExample}>
            “Warp speed! Teleport to your gate instantly.”
          </Text>
        </View>
      </View>
      <View style={s.footer}>
        <View style={s.footerBrand}>
          <Mark size={22} />
          <Text style={s.footerWord}>Scotty · brand field guide 01</Text>
        </View>
        <Text style={s.footerNote}>
          Original wayfinder identity · WCAG-aware palette · Reduced-motion
          considerate
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={exit}
          style={s.returnButton}
        >
          <Text style={s.returnText}>Return to the live app</Text>
          <Icon name="arrow-forward" color="#55E0AA" size={16} />
        </Pressable>
      </View>
    </ScrollView>
  );
}

function SectionHeader({
  number,
  title,
  subtitle,
}: {
  number: string;
  title: string;
  subtitle: string;
}) {
  return (
    <View style={s.sectionHead}>
      <Text style={s.sectionNumber}>{number}</Text>
      <View style={{ flex: 1 }}>
        <Text style={s.sectionTitle}>{title}</Text>
        <Text style={s.sectionSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0B1110" },
  content: {
    paddingHorizontal: 20,
    gap: 20,
    maxWidth: 780,
    width: "100%",
    alignSelf: "center",
  },
  contentWide: { maxWidth: 1120, paddingHorizontal: 34 },
  topbar: {
    minHeight: 42,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  back: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    paddingRight: 12,
  },
  backText: {
    color: "#AFBBB3",
    fontFamily: F.body,
    fontSize: 12,
    fontWeight: "600",
  },
  topMark: { flexDirection: "row", alignItems: "center", gap: 8 },
  wordmark: {
    color: "#F2F5F1",
    fontFamily: F.heading,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  hero: { gap: 16, paddingTop: 6 },
  heroWide: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 26,
    paddingTop: 18,
  },
  heroCopy: { justifyContent: "center", paddingVertical: 16 },
  kicker: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: 17,
  },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#55E0AA" },
  heroTitle: {
    color: "#F2F5F1",
    fontFamily: F.heading,
    fontWeight: "600",
    fontSize: 38,
    lineHeight: 43,
    letterSpacing: -1.2,
  },
  heroBody: {
    color: "#AFBBB3",
    fontFamily: F.body,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 11,
    maxWidth: 490,
  },
  traits: { flexDirection: "row", gap: 17, marginTop: 21 },
  trait: { flexDirection: "row", alignItems: "center", gap: 7 },
  traitNumber: { color: "#55E0AA", fontFamily: F.mono, fontSize: 9 },
  traitText: {
    color: "#F2F5F1",
    fontFamily: F.body,
    fontSize: 11,
    fontWeight: "600",
  },
  identityCard: {
    minHeight: 230,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#283832",
    backgroundColor: "#101816",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  identityHalo: {
    width: 118,
    height: 108,
    alignItems: "center",
    justifyContent: "center",
  },
  orbit: {
    position: "absolute",
    width: 108,
    height: 62,
    borderColor: "rgba(85,224,170,.35)",
    borderWidth: 1,
    borderRadius: 60,
    transform: [{ rotate: "-28deg" }],
  },
  orbitDot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    right: 8,
    top: 21,
    backgroundColor: "#B9FFE0",
  },
  identityWordmark: {
    color: "#F2F5F1",
    fontFamily: F.heading,
    fontSize: 25,
    fontWeight: "700",
    letterSpacing: -1,
    marginTop: 3,
  },
  identityCaption: {
    color: "#82918A",
    fontFamily: F.mono,
    fontSize: 8,
    letterSpacing: 1.7,
    marginTop: 9,
  },
  identitySub: {
    color: "#AFBBB3",
    fontFamily: F.body,
    fontSize: 11,
    lineHeight: 17,
    textAlign: "center",
    maxWidth: 275,
    marginTop: 7,
  },
  disclosure: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    borderWidth: 1,
    borderColor: "#283832",
    backgroundColor: "#101816",
    borderRadius: 12,
    padding: 13,
  },
  disclosureText: {
    color: "#AFBBB3",
    fontFamily: F.body,
    fontSize: 11,
    lineHeight: 17,
    flex: 1,
  },
  sectionHead: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginTop: 19,
  },
  sectionNumber: {
    color: "#55E0AA",
    fontFamily: F.mono,
    fontSize: 10,
    marginTop: 5,
  },
  sectionTitle: {
    color: "#F2F5F1",
    fontFamily: F.heading,
    fontWeight: "600",
    fontSize: 23,
    letterSpacing: -0.4,
  },
  sectionSubtitle: {
    color: "#82918A",
    fontFamily: F.body,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },
  paletteWrap: { flexDirection: "row", flexWrap: "wrap", gap: 9 },
  swatch: {
    width: "48%",
    minHeight: 61,
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    borderWidth: 1,
    borderColor: "#283832",
    borderRadius: 12,
    padding: 8,
    backgroundColor: "#101816",
  },
  swatchSelected: { borderColor: "#55E0AA", backgroundColor: "#151E1B" },
  swatchColor: { width: 34, height: 40, borderRadius: 8 },
  swatchMeta: { flex: 1, minWidth: 0, gap: 4 },
  swatchName: { color: "#F2F5F1", fontFamily: F.mono, fontSize: 9 },
  swatchRole: {
    color: "#82918A",
    fontFamily: F.body,
    fontSize: 9,
    lineHeight: 13,
  },
  specimen: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#283832",
    backgroundColor: "#151E1B",
    padding: 17,
    overflow: "hidden",
  },
  specimenHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  specimenTitle: {
    fontFamily: F.heading,
    color: "#F2F5F1",
    fontSize: 21,
    fontWeight: "600",
    marginTop: 9,
  },
  hexTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 9,
  },
  miniDot: { width: 7, height: 7, borderRadius: 4 },
  hexText: { color: "#F2F5F1", fontFamily: F.mono, fontSize: 9 },
  specimenBody: {
    color: "#AFBBB3",
    fontFamily: F.body,
    fontSize: 12,
    marginTop: 8,
  },
  specimenActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 9,
    marginTop: 16,
  },
  primaryButton: {
    minHeight: 43,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    borderRadius: 11,
    paddingHorizontal: 15,
  },
  primaryLabel: {
    color: "#0B1110",
    fontFamily: F.body,
    fontWeight: "700",
    fontSize: 11,
  },
  darkChip: {
    minHeight: 40,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#283832",
    borderRadius: 11,
    paddingHorizontal: 13,
  },
  darkChipText: { color: "#AFBBB3", fontFamily: F.body, fontSize: 10 },
  rail: {
    height: 28,
    marginTop: 14,
    marginHorizontal: 5,
    justifyContent: "center",
  },
  railLine: {
    height: 1,
    backgroundColor: "#283832",
    position: "absolute",
    left: 3,
    right: 3,
  },
  railPulse: {
    width: 22,
    height: 4,
    borderRadius: 3,
    backgroundColor: "#55E0AA",
    position: "absolute",
    left: "45%",
  },
  railStart: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#55E0AA",
  },
  railEnd: {
    position: "absolute",
    right: 0,
    width: 11,
    height: 11,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#55E0AA",
  },
  railCaption: {
    color: "#82918A",
    fontFamily: F.body,
    fontSize: 9,
    marginTop: 1,
  },
  demoRow: { gap: 12 },
  demoRowWide: { flexDirection: "row", alignItems: "stretch" },
  statusCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#283832",
    backgroundColor: "#101816",
    padding: 14,
    gap: 15,
  },
  segmented: {
    flexDirection: "row",
    alignSelf: "flex-start",
    padding: 3,
    borderRadius: 10,
    backgroundColor: "#0B1110",
    gap: 3,
  },
  segment: {
    borderRadius: 8,
    minHeight: 32,
    paddingHorizontal: 11,
    justifyContent: "center",
  },
  segmentActive: { backgroundColor: "#173C30" },
  segmentDelay: { backgroundColor: "#282219" },
  segmentText: { color: "#82918A", fontFamily: F.body, fontSize: 10 },
  segmentTextActive: { color: "#69D8A2", fontWeight: "700" },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 7 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusLabel: {
    color: "#69D8A2",
    fontFamily: F.body,
    fontSize: 11,
    fontWeight: "600",
    flex: 1,
  },
  statusDate: { color: "#82918A", fontFamily: F.mono, fontSize: 8 },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  timeText: { color: "#F2F5F1", fontFamily: F.mono, fontSize: 21 },
  timeHint: { color: "#82918A", fontFamily: F.mono, fontSize: 7, marginTop: 4 },
  timeTrack: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  trackDot: { width: 7, height: 7, borderRadius: 4 },
  trackLine: { flex: 1, height: 1, backgroundColor: "#283832" },
  scheduled: { color: "#F1BD70", fontFamily: F.body, fontSize: 9 },
  mapCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#283832",
    backgroundColor: "#101816",
    padding: 14,
    gap: 16,
  },
  mapTitle: {
    color: "#F2F5F1",
    fontFamily: F.heading,
    fontSize: 18,
    marginTop: -8,
  },
  planetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  planetButton: { alignItems: "center", gap: 6, padding: 3, minWidth: 46 },
  planet: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: "#1C2823",
    borderWidth: 1,
    borderColor: "#283832",
  },
  planetSelected: { borderColor: "#55E0AA", backgroundColor: "#173C30" },
  planetCore: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#82918A",
  },
  planetLabel: { color: "#82918A", fontFamily: F.body, fontSize: 9 },
  mapFoot: {
    color: "#82918A",
    fontFamily: F.body,
    fontSize: 9,
    lineHeight: 14,
  },
  motionGrid: { flexDirection: "row", flexWrap: "wrap", gap: 9 },
  motionCard: {
    width: "48%",
    flexGrow: 1,
    minHeight: 83,
    padding: 12,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#283832",
    backgroundColor: "#101816",
  },
  motionTop: { flexDirection: "row", justifyContent: "space-between", gap: 6 },
  motionLabel: {
    color: "#F2F5F1",
    fontFamily: F.body,
    fontWeight: "700",
    fontSize: 11,
  },
  motionTime: { color: "#55E0AA", fontFamily: F.mono, fontSize: 8 },
  motionUse: {
    color: "#82918A",
    fontFamily: F.body,
    fontSize: 9,
    marginTop: 6,
  },
  motionBar: {
    height: 3,
    backgroundColor: "#1C2823",
    borderRadius: 2,
    marginTop: 10,
  },
  motionFill: { height: 3, backgroundColor: "#55E0AA", borderRadius: 2 },
  reduceRow: {
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#283832",
    backgroundColor: "#101816",
    padding: 13,
  },
  reduceTitle: {
    color: "#F2F5F1",
    fontFamily: F.body,
    fontSize: 11,
    fontWeight: "600",
  },
  reduceSubtitle: {
    color: "#82918A",
    fontFamily: F.body,
    fontSize: 9,
    marginTop: 4,
  },
  switchTrack: {
    width: 43,
    height: 25,
    borderRadius: 14,
    padding: 3,
    justifyContent: "center",
    backgroundColor: "#283832",
  },
  switchOn: { backgroundColor: "#55E0AA" },
  switchThumb: {
    width: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: "#F2F5F1",
  },
  thumbOn: { alignSelf: "flex-end", backgroundColor: "#0B1110" },
  voiceRow: { gap: 10 },
  voiceCard: {
    flex: 1,
    minHeight: 113,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#283832",
    backgroundColor: "#101816",
    padding: 14,
    gap: 13,
  },
  avoidCard: { borderColor: "#493925", backgroundColor: "#151512" },
  voiceExample: {
    color: "#F2F5F1",
    fontFamily: F.heading,
    fontSize: 16,
    lineHeight: 23,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#283832",
    paddingTop: 19,
    marginTop: 14,
    gap: 9,
  },
  footerBrand: { flexDirection: "row", alignItems: "center", gap: 8 },
  footerWord: {
    color: "#F2F5F1",
    fontFamily: F.body,
    fontSize: 11,
    fontWeight: "600",
  },
  footerNote: {
    color: "#82918A",
    fontFamily: F.body,
    fontSize: 9,
    lineHeight: 14,
  },
  returnButton: {
    minHeight: 42,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  returnText: {
    color: "#55E0AA",
    fontFamily: F.body,
    fontSize: 11,
    fontWeight: "700",
  },
});
