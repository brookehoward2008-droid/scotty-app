import { Tabs } from "expo-router";
import { Text, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  MobileStateProvider,
  useMobileStateContext,
} from "@/components/scotty/mobile-state";
import { C, F, Icon, type IconName } from "@/components/scotty/ui";
const screens = [
  ["index", "home", "grid-outline"],
  ["find", "find", "navigate-outline"],
  ["trips", "trips", "ticket-outline"],
  ["explore", "explore", "planet-outline"],
  ["wallet", "wallet", "wallet-outline"],
] as const;
function Navigation() {
  const { state } = useMobileStateContext();
  const { width, fontScale } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: C.mint,
        tabBarInactiveTintColor: C.muted,
        sceneStyle: { backgroundColor: C.bg },
        tabBarHideOnKeyboard: true,
        tabBarLabelPosition: "below-icon",
        tabBarLabelStyle: { fontFamily: F.body, fontSize: 12 },
        tabBarStyle:
          width >= 900
            ? { display: "none" }
            : {
                backgroundColor: C.panel,
                borderTopColor: C.border,
                height: 64 + Math.max(0, fontScale - 1) * 20 + insets.bottom,
                paddingTop: 6,
                paddingBottom: Math.max(insets.bottom, 6),
              },
      }}
    >
      {screens.map(([name, key, icon]) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title: state.t(key),
            tabBarAccessibilityLabel: state.t(key),
            tabBarLabel: ({ color }) => <Text style={{ color, fontFamily: F.body, fontSize: 12, textAlign: "center", paddingHorizontal: 2 }} numberOfLines={2}>{state.t(key)}</Text>,
            tabBarIcon: ({ color, size }) => (
              <Icon
                name={icon as IconName}
                color={color as string}
                size={size}
              />
            ),
          }}
        />
      ))}
      <Tabs.Screen
        name="settings"
        options={{ title: state.t("settings"), href: null }}
      />
    </Tabs>
  );
}
export default function TabLayout() {
  return (
    <MobileStateProvider>
      <Navigation />
    </MobileStateProvider>
  );
}
