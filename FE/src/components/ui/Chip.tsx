import { COLORS, RADIUS, SPACING } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import React, { FC, useMemo } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

interface ChipProps {
  label: string;
  emoji?: string;
  selected: boolean;
  onPress: () => void;
  primaryColor?: string;
  secondaryColor?: string;
}

const Chip: FC<ChipProps> = ({
  label,
  emoji,
  selected,
  onPress,
  primaryColor = COLORS.accent,
  secondaryColor = COLORS.purple,
}) => {
  const content = useMemo(
    () => `${emoji ? `${emoji} ` : ""}${label}`,
    [emoji, label],
  );

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [pressed && { opacity: 0.7 }]}
    >
      {selected ? (
        <LinearGradient
          colors={[primaryColor, secondaryColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.chip}
        >
          <Text style={styles.labelSelected}>{content}</Text>
        </LinearGradient>
      ) : (
        <Pressable
          onPress={onPress}
          style={({ pressed }) => [
            styles.chip,
            styles.chipOff,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.labelOff}>{content}</Text>
        </Pressable>
      )}
    </Pressable>
  );
};

export default Chip;

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: RADIUS.full,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm - 1,
    borderRadius: RADIUS.full,
    alignItems: "center",
    justifyContent: "center",
  },
  chipOff: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderMed,
  },
  pressed: {
    opacity: 0.7,
  },
  labelSelected: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  labelOff: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
});
