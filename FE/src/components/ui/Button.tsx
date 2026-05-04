import { COLORS, RADIUS, SPACING } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import React, { FC, ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  colors?: [string, string, ...string[]];
  icon?: ReactNode;
}

export const PrimaryButton: FC<PrimaryButtonProps> = ({
  label,
  onPress,
  loading = false,
  disabled = false,
  colors = [COLORS.gradientStart, COLORS.gradientMid],
  icon,
}) => {
  const isOff = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isOff}
      style={({ pressed }) => [pressed && !isOff && styles.pressed]}
    >
      <LinearGradient
        colors={isOff ? [COLORS.bgHighlight, COLORS.bgHighlight] : colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.btn, isOff && styles.btnDisabled]}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.textSecondary} size="small" />
        ) : (
          <View style={styles.inner}>
            <Text style={[styles.label, isOff && styles.labelDisabled]}>
              {label}
            </Text>
            {icon}
          </View>
        )}
      </LinearGradient>
    </Pressable>
  );
};

interface GhostButtonProps {
  label: string;
  onPress: () => void;
  icon?: ReactNode;
  color?: string;
}

export const GhostButton: FC<GhostButtonProps> = ({
  label,
  onPress,
  icon,
  color = COLORS.textSecondary,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.ghost, pressed && styles.pressed]}
    >
      {icon}
      <Text style={[styles.ghostLabel, { color }]}>{label}</Text>
    </Pressable>
  );
};

interface IconButtonProps {
  icon: ReactNode;
  onPress: () => void;
  accessibilityLabel: string;
}

export const IconButton: FC<IconButtonProps> = ({
  icon,
  onPress,
  accessibilityLabel,
}) => {
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
    >
      {icon}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btn: {
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.md + 2,
    paddingHorizontal: SPACING.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  btnDisabled: {
    opacity: 0.6,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  label: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  labelDisabled: {
    color: COLORS.textMuted,
  },
  pressed: {
    opacity: 0.75,
  },
  ghost: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    gap: SPACING.xs,
  },
  ghostLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
});
