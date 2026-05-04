import { COLORS, RADIUS, SPACING, STEP_THEMES } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import React, { FC, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

interface ProgressBarProps {
  current: number;
  total: number;
  themeIndex: number;
}

const ProgressBar: FC<ProgressBarProps> = ({ current, total, themeIndex }) => {
  const safeTotal = Math.max(total, 1);
  const safeCurrent = Math.min(Math.max(current, 1), safeTotal);

  const theme = useMemo(() => {
    if (!STEP_THEMES.length) return null;
    return STEP_THEMES[Math.min(themeIndex, STEP_THEMES.length - 1)];
  }, [themeIndex]);

  const pct = useMemo(
    () => Math.round((safeCurrent / safeTotal) * 100),
    [safeCurrent, safeTotal],
  );

  const dots = useMemo(() => {
    return Array.from({ length: safeTotal }, (_, i) => {
      const done = i < safeCurrent;
      const active = i === safeCurrent - 1;

      return (
        <View
          key={i}
          style={[
            styles.dot,
            done ? { backgroundColor: theme?.primary } : styles.dotInactive,
            active && styles.dotActive,
          ]}
        />
      );
    });
  }, [safeCurrent, safeTotal, theme]);

  if (!theme) return null;

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.stepText}>
          Step{" "}
          <Text style={[styles.stepNum, { color: theme.primary }]}>
            {safeCurrent}
          </Text>{" "}
          of {safeTotal}
        </Text>
        <View
          style={[
            styles.badge,
            { backgroundColor: theme.soft, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.badgeText, { color: theme.primary }]}>
            {pct}%
          </Text>
        </View>
      </View>

      <View style={styles.track}>
        <LinearGradient
          colors={[theme.primary, theme.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.fill, { width: `${pct}%` }]}
        />
      </View>

      <View style={styles.dotsRow}>{dots}</View>
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  container: {
    gap: SPACING.sm,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  stepNum: {
    fontWeight: "800",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  track: {
    height: 6,
    backgroundColor: COLORS.bgHighlight,
    borderRadius: RADIUS.full,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: RADIUS.full,
  },
  dotsRow: {
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    paddingTop: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotInactive: {
    backgroundColor: COLORS.bgHighlight,
  },
  dotActive: {
    width: 14,
  },
});
