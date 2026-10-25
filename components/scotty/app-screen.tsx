import { useRouter, useIsFocused, type Href } from "expo-router";
import { useMobileStateContext } from "./mobile-state";
import { useShipClock } from "@/hooks/use-ship-clock";
import { DEMO_MODE } from "@/lib/scotty-demo";
import { trpc } from "@/lib/trpc";
import { shipTimestamp, shipTime } from "@/lib/scotty-trip";
import React, { useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  Platform,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Ellipse, Path } from "react-native-svg";
import { useScotty } from "@/hooks/use-scotty";
import {
  C,
  F,
  Mark,
  Icon,
  IconButton,
  Body,
  Title,
  Label,
  Badge,
  SectionHeading,
  Empty,
  Button,
  type IconName,
} from "@/components/scotty/ui";
import {
  SearchPanel,
  RideCard,
  dateISO,
  formatDate,
  stationName,
} from "@/components/scotty/rides";
import { GalaxyMap } from "@/components/scotty/galaxy-map";
import { Dialogs } from "@/components/scotty/dialogs";
import {
  TripsScreen,
  WalletScreen,
  SettingsScreen,
} from "@/components/scotty/account-screens";
import {
  RIDES,
  STATIONS,
  searchRides,
  fareBreakdown,
  type Ride,
} from "@/shared/scotty";
import { stationInfo } from "@/lib/scotty-i18n";
import { getApiBaseUrl } from "@/constants/oauth";
export type Page =
  | "home"
  | "find"
  | "trips"
  | "explore"
  | "wallet"
  | "settings";
const nav: { id: Page; icon: IconName }[] = [
  { id: "home", icon: "grid-outline" },
  { id: "find", icon: "navigate-outline" },
  { id: "trips", icon: "ticket-outline" },
  { id: "explore", icon: "planet-outline" },
  { id: "wallet", icon: "wallet-outline" },
];
const images = {
  luna: "/manus-storage/async-images/XsGyrAS4A0WBna9ZSfQpkI/image-1.webp",
  mars: "/manus-storage/async-images/XsGyrAS4A0WBna9ZSfQpkI/image-2.webp",
};
function assetUri(path: string) {
  return Platform.OS === "web" ? path : `${getApiBaseUrl()}${path}`;
}
export default function ScottyApp({ page }: { page: Page }) {
  const router = useRouter();
  const focused = useIsFocused();
  const now = useShipClock();
  const {
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
  } = useMobileStateContext();
  const { t, language } = state;
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const desktop = width >= 900;
  const wide = width >= 1250;
  const scroll = useRef<ScrollView>(null);
  const go = (target: Page) => {
    router.navigate((target === "home" ? "/" : "/" + target) as Href);
    setSearchError("");
    scroll.current?.scrollTo({ y: 0, animated: false });
  };
  const find = () => {
    if (values.origin === values.destination) {
      go("find");
      setSearchError(t("same"));
      return;
    }
    setBoard(false);
    go("find");
  };
  const quick = (destination: string) => {
    setValues({
      origin: destination === "earth" ? "luna" : "earth",
      destination,
      date: dateISO(1),
      passengers: 1,
    });
    setBoard(false);
    go("find");
  };
  const rideClick = (ride: Ride) => setDialog({ kind: "ride", ride });
  const availability = trpc.scotty.availability.useQuery(
    { date: values.date },
    { staleTime: 10000, refetchInterval: 30000, retry: 1 },
  );
  const currentRides: Ride[] = RIDES.map((ride) => ({
    ...ride,
    seats:
      availability.data?.find((item) => item.rideId === ride.id)?.seats ?? 0,
  }));
  const boardRides = currentRides.filter(
    (ride) =>
      ride.status !== "cancelled" &&
      ride.seats > 0 &&
      shipTimestamp(ride, values.date, "departure") > now,
  );
  const available = searchRides({
    ...values,
    origin: values.origin as Ride["origin"],
    destination: values.destination as Ride["destination"],
    service,
  })
    .map((ride) => currentRides.find((item) => item.id === ride.id) ?? ride)
    .filter((ride) => ride.seats >= values.passengers);
  const next = boardRides.filter((r) => r.origin === "earth").slice(0, 3);
  // Derive from the current eligible results so edits never leave a stale trip bookable.
  const selectedRide =
    available.find(
      (ride) => ride.id === selectedRideId && ride.status !== "cancelled",
    ) ?? available.find((ride) => ride.status !== "cancelled");
  const renderSearch = () => (
    <SearchPanel
      values={values}
      language={language}
      onField={(kind) => setDialog({ kind })}
      onSwap={() =>
        setValues({
          ...values,
          origin: values.destination,
          destination: values.origin,
        })
      }
      onSearch={find}
    />
  );
  const sectionNav = (p: Page) => {
    if (p === "find") setBoard(false);
    go(p);
  };
  const viewBoard = () => {
    setBoard(true);
    go("find");
  };
  return (
    <View style={[s.root, { paddingTop: desktop ? 0 : insets.top }]}>
      {desktop && (
        <View aria-hidden={!!dialog} accessibilityElementsHidden={!!dialog} style={s.sidebar}>
          <View style={s.logo}>
            <Mark size={33} />
            <Text style={s.wordmark}>
              scotty<Text style={{ color: C.mint }}>.</Text>
            </Text>
          </View>
          <Text style={s.tagline}>{t("tagline")}</Text>
          <View style={{ marginTop: 54, gap: 8 }}>
            {nav.map((item) => (
              <NavItem
                key={item.id}
                label={t(item.id)}
                icon={item.icon}
                active={page === item.id}
                onPress={() => sectionNav(item.id)}
              />
            ))}
          </View>
          <View style={{ flex: 1 }} />
          <View style={s.sidebarCallout}>
            <View
              style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
            >
              <Mark size={19} />
              <Label color={C.mint}>SCOTTY</Label>
            </View>
            <Text
              style={{
                fontFamily: F.heading,
                fontSize: 21,
                color: C.text,
                marginTop: 12,
                lineHeight: 26,
              }}
            >
              {"Your galaxy.\nOne ride away."}
            </Text>
            <View
              style={{
                height: 1,
                backgroundColor: C.border,
                marginVertical: 16,
              }}
            />
            <Body style={{ fontSize: 14, lineHeight: 16 }}>{t("demo")}</Body>
          </View>
          <NavItem
            label={t("settings")}
            icon="settings-outline"
            active={page === "settings"}
            onPress={() => go("settings")}
          />
          <View style={s.sidebarUser}>
            <View style={s.avatar}>
              <Icon name="person-outline" color={C.mint} size={17} />
            </View>
            <View style={{ flex: 1 }}>
              <Body style={{ fontSize: 14, color: C.text }}>
                Cosmic traveler
              </Body>
              <Body style={{ fontSize: 14 }}>Sol sector · Demo account</Body>
            </View>
            <Icon name="chevron-down" size={12} />
          </View>
        </View>
      )}
      <View aria-hidden={!!dialog} accessibilityElementsHidden={!!dialog} importantForAccessibility={dialog ? "no-hide-descendants" : "auto"} style={{ flex: 1, minWidth: 0 }}>
        <View
          style={[s.topbar, !desktop && { height: 69, paddingHorizontal: 20 }]}
        >
          {desktop ? (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <Label>SCOTTY</Label>
              <Text style={{ color: C.faint, fontSize: 14 }}>/</Text>
              <Body style={{ fontSize: 14, color: C.text }}>{t(page)}</Body>
            </View>
          ) : (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Mark size={25} />
              <Text style={[s.wordmark, { fontSize: 26 }]}>
                scotty<Text style={{ color: C.mint }}>.</Text>
              </Text>
            </View>
          )}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: desktop ? 20 : 10,
            }}
          >
            {desktop && (
              <Body style={{ fontSize: 14 }}>
                {formatDate(dateISO(), language)}
              </Body>
            )}
            <Pressable
              accessibilityRole="button"
              onPress={() => go("settings")}
              accessibilityLabel={t("language")}
              style={{
                flexDirection: "row",
                gap: 6,
                alignItems: "center",
                padding: 8,
              }}
            >
              <Icon name="globe-outline" size={15} />
              <Label>{language.toUpperCase()}</Label>
            </Pressable>
            <IconButton
              name="notifications-outline"
              label={t("notifications")}
              onPress={() => setDialog({ kind: "notifications" })}
              size={35}
            />
            {!desktop && (
              <IconButton
                name="settings-outline"
                label={t("settings")}
                onPress={() => go("settings")}
                size={35}
              />
            )}
          </View>
        </View>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
          ref={scroll}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: desktop ? 36 : 20,
            paddingBottom: 28,
            alignItems: "center",
          }}
        >
          <View style={{ width: "100%", maxWidth: 1280, gap: 28 }}>
            {DEMO_MODE && (
              <Body style={{ fontSize: 14 }}>
                Interactive demo · Bookings and credits are saved only in this
                browser. No real payment.
              </Body>
            )}
            {(page === "home" || page === "find") &&
              (availability.isLoading || availability.error) && (
                <View style={s.error}>
                  <Icon
                    name={
                      availability.error
                        ? "cloud-offline-outline"
                        : "planet-outline"
                    }
                    color={C.mint}
                  />
                  <Body style={{ flex: 1 }}>
                    {availability.error ? t("error") : t("loading")}
                  </Body>
                  {availability.error && (
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => void availability.refetch()}
                    >
                      <Body style={{ color: C.mint }}>{t("retry")}</Body>
                    </Pressable>
                  )}
                </View>
              )}
            {page === "home" && (
              <>
                <View
                  style={{ flexDirection: wide ? "row" : "column", gap: 28 }}
                >
                  <View
                    style={{
                      flex: 1,
                      paddingTop: 8,
                      minHeight: desktop ? 320 : 0,
                      overflow: "hidden",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <View
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: 3,
                          backgroundColor: C.mint,
                        }}
                      />
                      <Label color={C.mint}>{t("greeting")}</Label>
                    </View>
                    <View
                      style={{
                        position: "absolute",
                        right: -8,
                        top: 50,
                        opacity: 0.25,
                      }}
                    >
                      <OrbitArt />
                    </View>
                    <Text
                      style={[
                        s.hero,
                        {
                          fontSize: desktop ? 66 : 48,
                          lineHeight: desktop ? 70 : 53,
                          marginTop: 23,
                        },
                      ]}
                    >
                      {t("hero")}
                    </Text>
                    <Body
                      style={{
                        fontSize: 14,
                        lineHeight: 23,
                        marginTop: 17,
                        maxWidth: 425,
                      }}
                    >
                      {t("subtitle")}
                    </Body>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 15,
                        marginTop: 23,
                      }}
                    >
                      <Badge text={t("system")} />
                      <Text
                        style={{
                          fontFamily: F.mono,
                          fontSize: 14,
                          color: C.faint,
                        }}
                      >
                        SOL NETWORK / 06 WORLDS
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: 8,
                        marginTop: 26,
                      }}
                    >
                      <QuickRoute
                        label={t("lunar")}
                        route="Earth → Luna"
                        icon="moon-outline"
                        onPress={() => quick("luna")}
                      />
                      <QuickRoute
                        label={t("marsTrip")}
                        route="Earth → Mars"
                        icon="planet-outline"
                        onPress={() => quick("mars")}
                      />
                    </View>
                  </View>
                  {wide && (
                    <View style={{ width: "39%" }}>
                      <GalaxyMap
                        language={language}
                        origin={values.origin}
                        destination={values.destination}
                        onSelect={(id) => {
                          setValues({ ...values, destination: id });
                          setBoard(false);
                          go("find");
                        }}
                      />
                    </View>
                  )}
                </View>
                {renderSearch()}
                {!wide && (
                  <GalaxyMap
                    language={language}
                    origin={values.origin}
                    destination={values.destination}
                    onSelect={(id) => {
                      setValues({ ...values, destination: id });
                      setBoard(false);
                      go("find");
                    }}
                  />
                )}
                <View>
                  <SectionHeading
                    title={t("departures")}
                    action={t("viewAll")}
                    onPress={viewBoard}
                  />
                  <View
                    style={{
                      flexDirection: desktop ? "row" : "column",
                      gap: 14,
                    }}
                  >
                    {!next.length && (
                      <Empty
                        title={t("none")}
                        subtitle={t("tomorrowPrompt")}
                        action={t("tomorrow")}
                        onPress={() =>
                          setValues({ ...values, date: dateISO(1) })
                        }
                      />
                    )}
                    {next.map((ride) => (
                      <RideCard
                        key={ride.id}
                        compact={wide}
                        ride={ride}
                        language={language}
                        onPress={() => rideClick(ride)}
                      />
                    ))}
                  </View>
                  <Body style={{ fontSize: 14, marginTop: 12 }}>
                    {t("shipTime")} · {formatDate(values.date, language)} ·{" "}
                    {t("demo")}
                  </Body>
                </View>
                <View>
                  <SectionHeading
                    title={t("popular")}
                    subtitle={t("popularSub")}
                  />
                  <DestinationCards
                    desktop={desktop}
                    state={state}
                    onRoute={quick}
                  />
                </View>
              </>
            )}
            {page === "find" && (
              <>
                <PageIntro
                  title={board ? t("allDepartures") : t("results")}
                  subtitle={board ? t("shipTime") : t("resultsSub")}
                />
                {renderSearch()}
                {searchError && (
                  <View style={s.error}>
                    <Icon name="alert-circle-outline" color={C.amber} />
                    <Body style={{ color: C.amber }}>{searchError}</Body>
                  </View>
                )}
                {board ? (
                  <View style={{ gap: 15 }}>
                    <Body>
                      {formatDate(values.date, language)} · {t("shipTime")}
                    </Body>
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: 15,
                      }}
                    >
                      {!boardRides.length && (
                        <Empty
                          title={t("none")}
                          subtitle={t("tomorrowPrompt")}
                          action={t("tomorrow")}
                          onPress={() =>
                            setValues({ ...values, date: dateISO(1) })
                          }
                        />
                      )}
                      {boardRides.map((ride) => (
                        <View
                          key={ride.id}
                          style={{ width: desktop ? "48.8%" : "100%" }}
                        >
                          <RideCard
                            ride={ride}
                            language={language}
                            onPress={() => rideClick(ride)}
                          />
                        </View>
                      ))}
                    </View>
                  </View>
                ) : (
                  <>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 15,
                      }}
                    >
                      <View style={{ flexDirection: "row", gap: 8 }}>
                        {(["all", "rideshare", "vanpool"] as const).map(
                          (filter) => (
                            <Pressable
                              key={filter}
                              onPress={() => setService(filter)}
                              accessibilityRole="button"
                              accessibilityState={{
                                selected: service === filter,
                              }}
                              style={[
                                s.filter,
                                service === filter && {
                                  backgroundColor: C.mint,
                                  borderColor: C.mint,
                                },
                              ]}
                            >
                              <Text
                                style={{
                                  fontFamily: F.body,
                                  fontSize: 14,
                                  color: service === filter ? C.bg : C.muted,
                                }}
                              >
                                {t(filter)}
                              </Text>
                            </Pressable>
                          ),
                        )}
                      </View>
                      <Body style={{ fontSize: 14 }}>
                        {available.length} {t("found")}
                      </Body>
                    </View>
                    {availability.isLoading || availability.error ? (
                      <Body>
                        {availability.error ? t("error") : t("loading")}
                      </Body>
                    ) : !available.length ? (
                      <Empty
                        title={t("none")}
                        subtitle={
                          values.date === dateISO()
                            ? `${t("noneSub")} ${t("tomorrowPrompt")}`
                            : t("noneSub")
                        }
                        action={t("tomorrow")}
                        onPress={() =>
                          setValues({ ...values, date: dateISO(1) })
                        }
                      />
                    ) : (
                      <View
                        style={{
                          flexDirection: desktop ? "row" : "column",
                          gap: 25,
                        }}
                      >
                        <View style={{ flex: 1, gap: 15 }}>
                          {available.map((ride) => (
                            <RideCard
                              key={ride.id}
                              ride={ride}
                              language={language}
                              selected={selectedRide?.id === ride.id}
                              onPress={() => {
                                setSelectedRideId(ride.id);
                                rideClick(ride);
                              }}
                            />
                          ))}
                        </View>
                        <View
                          style={{ width: desktop ? "42%" : "100%", gap: 16 }}
                        >
                          <GalaxyMap
                            language={language}
                            origin={values.origin}
                            destination={values.destination}
                            onSelect={(id) =>
                              id !== values.origin &&
                              setValues({ ...values, destination: id })
                            }
                            large={desktop}
                          />
                          {selectedRide && (
                            <View
                              style={{
                                padding: 20,
                                gap: 14,
                                borderRadius: 17,
                                borderWidth: 1,
                                borderColor: C.border,
                                backgroundColor: C.panel,
                              }}
                            >
                              <Label>{t("details")}</Label>
                              <Title size={24}>
                                {stationName(selectedRide.origin)} →{" "}
                                {stationName(selectedRide.destination)}
                              </Title>
                              <Body>
                                {formatDate(values.date, language)} ·{" "}
                                {values.passengers}{" "}
                                {t(
                                  values.passengers === 1
                                    ? "traveler"
                                    : "travelers",
                                )}
                              </Body>
                              <Body>
                                {shipTime(selectedRide, "departure")} UTC ·{" "}
                                {selectedRide.duration} {t("min")}
                              </Body>
                              <Body>
                                {t("total")}:{" "}
                                {
                                  fareBreakdown(selectedRide, values.passengers)
                                    .total
                                }{" "}
                                {t("credits")}
                              </Body>
                              <Button
                                label={t("review")}
                                icon="ticket-outline"
                                onPress={() =>
                                  setDialog({
                                    kind: "review",
                                    ride: selectedRide,
                                  })
                                }
                              />
                            </View>
                          )}
                          <Body style={{ fontSize: 14, marginTop: 14 }}>
                            {t("shipTime")} ·{" "}
                            {formatDate(values.date, language)}
                          </Body>
                        </View>
                      </View>
                    )}
                  </>
                )}
              </>
            )}
            {page === "trips" && (
              <TripsScreen
                state={state}
                onFind={() => go("find")}
                onTicket={(booking) => setDialog({ kind: "ticket", booking })}
                onCancel={(booking) => setDialog({ kind: "cancel", booking })}
              />
            )}
            {page === "wallet" && <WalletScreen state={state} />}
            {page === "settings" && (
              <SettingsScreen
                state={state}
                onHelp={() => setDialog({ kind: "help" })}
              />
            )}
            {page === "explore" && (
              <>
                <PageIntro
                  title={t("exploreTitle")}
                  subtitle={t("exploreSubtitle")}
                />
                <DestinationCards
                  desktop={desktop}
                  state={state}
                  onRoute={quick}
                />
                <GalaxyMap language={language} large onSelect={quick} />
                <View>
                  <SectionHeading title={t("stations")} />
                  <View
                    style={{ flexDirection: "row", flexWrap: "wrap", gap: 15 }}
                  >
                    {STATIONS.map((station) => (
                      <Pressable
                        key={station.id}
                        accessibilityRole="button"
                        onPress={() => quick(station.id)}
                        style={[
                          s.stationCard,
                          { width: desktop ? "31.8%" : "47.5%" },
                        ]}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Icon
                            name="planet-outline"
                            color={C.mint}
                            size={28}
                          />
                          <Label>{station.code}</Label>
                        </View>
                        <View style={{ marginTop: 30 }}>
                          <Title size={24}>{station.name}</Title>
                          <Body style={{ fontSize: 14, marginTop: 5 }}>
                            {stationInfo(station.id, language).subtitle}
                          </Body>
                        </View>
                        <View
                          style={{
                            marginTop: 23,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 7,
                          }}
                        >
                          <Body style={{ fontSize: 14, color: C.mint }}>
                            {t("viewRoute")}
                          </Body>
                          <Icon name="arrow-forward" color={C.mint} size={13} />
                        </View>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </>
            )}
            <View style={s.footer}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 7 }}
              >
                <Mark size={15} color={C.faint} />
                <Body style={{ fontSize: 14 }}>{t("version")}</Body>
              </View>
              <Body style={{ fontSize: 14 }}>{t("demo")}</Body>
            </View>
          </View>
        </ScrollView>
      </View>
      <Dialogs
        key={dialog?.kind ?? "closed"}
        dialog={focused ? dialog : null}
        setDialog={setDialog}
        state={state}
        values={values}
        remainingSeats={availability.data}
        setValues={setValues}
        onTrips={() => go("trips")}
      />
    </View>
  );
}
function NavItem({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon: IconName;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [
        s.navItem,
        active && { backgroundColor: "#253029" },
        pressed && { opacity: 0.7 },
      ]}
    >
      <Icon name={icon} size={19} color={active ? C.mint : C.muted} />
      <Text
        style={{
          fontFamily: F.body,
          fontSize: 14,
          color: active ? C.mint : C.muted,
          flex: 1,
        }}
      >
        {label}
      </Text>
      {active && (
        <View
          style={{
            width: 5,
            height: 5,
            borderRadius: 3,
            backgroundColor: C.mint,
          }}
        />
      )}
    </Pressable>
  );
}
function QuickRoute({
  label,
  route,
  icon,
  onPress,
}: {
  label: string;
  route: string;
  icon: IconName;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [s.quick, { opacity: pressed ? 0.7 : 1 }]}
    >
      <Icon name={icon} color={C.muted} size={15} />
      <Text style={{ fontFamily: F.body, fontSize: 14, color: C.muted }}>
        {label}
      </Text>
      <Text style={{ fontFamily: F.body, fontSize: 14, color: C.faint }}>
        {route}
      </Text>
      <Icon name="arrow-up-outline" size={12} color={C.mint} />
    </Pressable>
  );
}
function PageIntro({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View style={{ gap: 12, paddingTop: 10 }}>
      <Label color={C.mint}>SCOTTY / SOL SECTOR</Label>
      <Title size={38}>{title}</Title>
      <Body>{subtitle}</Body>
    </View>
  );
}
function DestinationCards({
  desktop,
  state,
  onRoute,
}: {
  desktop: boolean;
  state: ReturnType<typeof useScotty>;
  onRoute: (id: string) => void;
}) {
  return (
    <View style={{ flexDirection: desktop ? "row" : "column", gap: 17 }}>
      {(["luna", "mars"] as const).map((id) => (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${state.t("viewRoute")}: ${stationName(id)}`}
          key={id}
          onPress={() => onRoute(id)}
          style={({ pressed }) => [
            s.destinationCard,
            { flex: desktop ? 1 : undefined, opacity: pressed ? 0.8 : 1 },
          ]}
        >
          {!DEMO_MODE && (
            <View style={{ height: 174, backgroundColor: "#101812" }}>
              <Image
                source={{ uri: assetUri(images[id]) }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
              <View
                style={{
                  position: "absolute",
                  top: 14,
                  left: 15,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  backgroundColor: "rgba(10,15,12,0.75)",
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: "#536055",
                }}
              >
                <Label color={C.text}>{stationName(id)}</Label>
              </View>
              <View
                style={{
                  position: "absolute",
                  right: 14,
                  bottom: 14,
                  backgroundColor: "rgba(10,15,12,0.8)",
                  borderRadius: 20,
                  padding: 8,
                }}
              >
                <Icon name="arrow-up-outline" size={17} color={C.text} />
              </View>
            </View>
          )}
          <View
            style={{
              padding: 19,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Title size={26}>{stationName(id)}</Title>
              <Body style={{ fontSize: 14, marginTop: 5 }}>
                {state.t(id === "luna" ? "lunaDesc" : "marsDesc")}
              </Body>
            </View>
            <View style={{ alignItems: "flex-end", gap: 5 }}>
              <Label>{state.t("starting")}</Label>
              <Text
                style={{ fontFamily: F.heading, fontSize: 23, color: C.mint }}
              >
                {id === "luna" ? 18 : 48}
                <Text style={{ fontSize: 14, color: C.muted }}>
                  {" "}
                  {state.t("credits")}
                </Text>
              </Text>
            </View>
          </View>
        </Pressable>
      ))}
    </View>
  );
}
function OrbitArt() {
  return (
    <Svg width={210} height={190} viewBox="0 0 210 190">
      <Ellipse
        cx="125"
        cy="92"
        rx="80"
        ry="25"
        stroke="#7f9d87"
        strokeWidth="0.6"
        fill="none"
        transform="rotate(-40 125 92)"
      />
      <Ellipse
        cx="125"
        cy="92"
        rx="103"
        ry="37"
        stroke="#4d6254"
        strokeWidth="0.5"
        fill="none"
        transform="rotate(-40 125 92)"
      />
      <Circle
        cx="125"
        cy="92"
        r="24"
        stroke="#65866e"
        strokeWidth="0.6"
        fill="#18251c"
      />
      <Path
        d="M125 78 L129 88 L139 92 L129 96 L125 106 L121 96 L111 92 L121 88 Z"
        fill="#98b7a0"
      />
      <Circle cx="49" cy="112" r="4" fill="#a2bca7" />
    </Svg>
  );
}
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg, flexDirection: "row" },
  sidebar: {
    width: 214,
    backgroundColor: "#141817",
    borderRightWidth: 1,
    borderRightColor: C.border,
    paddingHorizontal: 19,
    paddingTop: 32,
    paddingBottom: 20,
  },
  logo: { flexDirection: "row", alignItems: "center", gap: 9, paddingLeft: 9 },
  wordmark: {
    fontFamily: F.heading,
    fontSize: 36,
    fontWeight: "600",
    letterSpacing: -1.7,
    color: C.text,
  },
  tagline: {
    fontFamily: F.mono,
    fontSize: 14,
    color: C.faint,
    letterSpacing: 1.3,
    marginTop: 10,
    paddingLeft: 12,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  sidebarCallout: {
    padding: 16,
    backgroundColor: "#1b231e",
    borderWidth: 1,
    borderColor: "#2c3c30",
    borderRadius: 13,
    marginBottom: 29,
  },
  sidebarUser: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginTop: 22,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  avatar: {
    width: 31,
    height: 31,
    borderRadius: 20,
    backgroundColor: "#2d3b30",
    alignItems: "center",
    justifyContent: "center",
  },
  topbar: {
    height: 77,
    paddingHorizontal: 37,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: C.bg,
  },
  hero: {
    fontFamily: F.heading,
    fontWeight: "500",
    letterSpacing: -2.7,
    color: C.text,
  },
  quick: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 8,
    backgroundColor: "#131815",
  },
  filter: {
    paddingHorizontal: 17,
    paddingVertical: 9,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: C.border,
  },
  error: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#514330",
    borderRadius: 12,
    backgroundColor: "#28231c",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  stationCard: {
    padding: 20,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 17,
    backgroundColor: C.panel,
  },
  destinationCard: {
    borderRadius: 17,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.panel,
    overflow: "hidden",
  },
  footer: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: C.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: C.border,
    backgroundColor: "#141917",
    flexDirection: "row",
  },
});
