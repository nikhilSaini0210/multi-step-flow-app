import { COLORS, RADIUS, SPACING, STEP_THEMES } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import React, { FC, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

interface StepHeaderProps {
  title: string;
  subtitle: string;
  themeIndex: number;
}

const StepHeader: FC<StepHeaderProps> = ({ title, subtitle, themeIndex }) => {
  const theme = useMemo(() => {
    if (!STEP_THEMES.length) return null;
    return STEP_THEMES[Math.min(themeIndex, STEP_THEMES.length - 1)];
  }, [themeIndex]);

  if (!theme) return null;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.primary, theme.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.badge}
      >
        <Text style={styles.badgeEmoji}>{theme.emoji}</Text>
      </LinearGradient>

      <View
        style={[
          styles.labelPill,
          { backgroundColor: theme.soft, borderColor: theme.border },
        ]}
      >
        <Text style={[styles.labelText, { color: theme.primary }]}>
          {theme.label}
        </Text>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

export default StepHeader;

const styles = StyleSheet.create({
  container: {
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  badge: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  badgeEmoji: { fontSize: 24 },
  labelPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  labelText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.4,
    lineHeight: 32,
    marginTop: SPACING.xs,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 21,
  },
});
