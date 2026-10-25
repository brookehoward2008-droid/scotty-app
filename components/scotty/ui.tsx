import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  ActivityIndicator,
  type ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Path, Circle } from "react-native-svg";
export const C = {
  bg: "#0d1010",
  panel: "#171b1a",
  elevated: "#1e2321",
  border: "#2a302d",
  mint: "#c4f1c8",
  green: "#88ba95",
  text: "#f2f4ee",
  muted: "#AFBBB3",
  faint: "#91A198",
  amber: "#e7bb7d",
};
export const F = {
  heading: "Outfit",
  body: "DMSans",
  mono: Platform.OS === "ios" ? "Menlo" : "monospace",
};
export type IconName = React.ComponentProps<typeof Ionicons>["name"];
export function Icon({
  name,
  size = 20,
  color = C.muted,
}: {
  name: IconName;
  size?: number;
  color?: string;
}) {
  return <Ionicons name={name} size={size} color={color} />;
}
export function Mark({
  size = 34,
  color = C.mint,
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Path
        d="M20 3 L24.6 15.4 L37 20 L24.6 24.6 L20 37 L15.4 24.6 L3 20 L15.4 15.4 Z"
        fill={color}
      />
      <Path
        d="M7 31 C-1 16 26 -3 34 7 M6 32 C17 39 41 17 35 8"
        stroke={color}
        strokeWidth="1.6"
        fill="none"
      />
      <Circle cx="34" cy="8" r="2.8" fill={C.bg} />
    </Svg>
  );
}
export function Label({
  children,
  color = C.muted,
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <Text
      style={{
        fontFamily: F.mono,
        fontSize: 14,
        letterSpacing: 1.5,
        color,
        textTransform: "uppercase",
      }}
    >
      {children}
    </Text>
  );
}
export function Body({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: any;
}) {
  return (
    <Text selectable style={[s.body, style]}>
      {children}
    </Text>
  );
}
export function Title({
  children,
  size = 28,
}: {
  children: React.ReactNode;
  size?: number;
}) {
  return (
    <Text
      style={{
        fontFamily: F.heading,
        fontSize: size,
        lineHeight: size * 1.15,
        color: C.text,
        fontWeight: "500",
        letterSpacing: -0.6,
      }}
    >
      {children}
    </Text>
  );
}
export function Button({
  label,
  onPress,
  icon,
  secondary = false,
  disabled = false,
  loading = false,
  style,
}: {
  label: string;
  onPress: () => void;
  icon?: IconName;
  secondary?: boolean;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        secondary && s.secondary,
        { opacity: disabled ? 0.4 : pressed ? 0.75 : 1 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={secondary ? C.mint : C.bg} />
      ) : (
        <>
          <Text
            style={[
              { flexShrink: 1, textAlign: "center" },
              s.buttonText,
              { color: secondary ? C.text : C.bg },
            ]}
          >
            {label}
          </Text>
          {icon && (
            <Icon name={icon} color={secondary ? C.text : C.bg} size={18} />
          )}
        </>
      )}
    </Pressable>
  );
}
export function IconButton({
  name,
  onPress,
  label,
  size = 48,
  disabled = false,
}: {
  name: IconName;
  onPress: () => void;
  label: string;
  size?: number;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        width: Math.max(size, 48),
        opacity: disabled ? 0.4 : 1,
        height: Math.max(size, 48),
        borderRadius: size / 2,
        borderWidth: 1,
        borderColor: C.border,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: pressed ? C.elevated : "transparent",
      })}
    >
      <Icon name={name} size={18} color={C.text} />
    </Pressable>
  );
}
export function Badge({
  text,
  type = "green",
}: {
  text: string;
  type?: "green" | "amber" | "muted";
}) {
  const color =
    type === "green" ? C.mint : type === "amber" ? C.amber : C.muted;
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor:
          type === "green"
            ? "#203027"
            : type === "amber"
              ? "#312b22"
              : C.elevated,
        paddingHorizontal: 9,
        paddingVertical: 5,
        borderRadius: 20,
        alignSelf: "flex-start",
      }}
    >
      <View
        style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: color }}
      />
      <Text style={{ fontFamily: F.body, fontSize: 14, color }}>{text}</Text>
    </View>
  );
}
export function SectionHeading({
  title,
  subtitle,
  action,
  onPress,
}: {
  title: string;
  subtitle?: string;
  action?: string;
  onPress?: () => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 18,
        gap: 12,
      }}
    >
      <View style={{ flex: 1 }}>
        <Title size={23}>{title}</Title>
        {subtitle && (
          <Body style={{ fontSize: 14, marginTop: 6 }}>{subtitle}</Body>
        )}
      </View>
      {action && (
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            paddingVertical: 8,
          }}
        >
          <Body style={{ fontSize: 14, color: C.mint }}>{action}</Body>
          <Icon name="arrow-forward" color={C.mint} size={15} />
        </Pressable>
      )}
    </View>
  );
}
export function Empty({
  title,
  subtitle,
  onPress,
  action,
}: {
  title: string;
  subtitle: string;
  onPress?: () => void;
  action?: string;
}) {
  return (
    <View
      style={{
        padding: 36,
        alignItems: "center",
        gap: 14,
        borderWidth: 1,
        borderColor: C.border,
        borderRadius: 20,
        backgroundColor: C.panel,
      }}
    >
      <Mark size={42} />
      <Title size={23}>{title}</Title>
      <Body style={{ textAlign: "center", maxWidth: 390 }}>{subtitle}</Body>
      {action && onPress && (
        <Button
          label={action}
          onPress={onPress}
          icon="arrow-forward"
          style={{ marginTop: 8 }}
        />
      )}
    </View>
  );
}
const s = StyleSheet.create({
  body: { fontFamily: F.body, fontSize: 16, lineHeight: 24, color: C.muted },
  button: {
    minHeight: 49,
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: C.mint,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  secondary: {
    backgroundColor: C.elevated,
    borderWidth: 1,
    borderColor: C.border,
  },
  buttonText: { fontFamily: F.body, fontWeight: "600", fontSize: 14 },
});
