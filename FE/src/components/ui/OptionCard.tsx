import { COLORS, RADIUS, SPACING } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import React, { FC } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface OptionCardProps {
  label: string;
  description?: string;
  emoji?: string;
  selected: boolean;
  onPress: () => void;
  primaryColor?: string;
  secondaryColor?: string;
  softColor?: string;
}

const OptionCard: FC<OptionCardProps> = ({
  label,
  description,
  emoji,
  selected,
  onPress,
  primaryColor = COLORS.accent,
  secondaryColor = COLORS.purple,
  softColor = COLORS.accentSoft,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        selected
          ? [styles.cardSelected, { borderColor: primaryColor }]
          : styles.cardDefault,
        pressed && styles.cardPressed,
      ]}
    >
      {selected && (
        <View
          style={[
            StyleSheet.absoluteFill,
            styles.tint,
            { backgroundColor: softColor },
          ]}
        />
      )}

      <View style={styles.row}>
        {emoji ? (
          <View
            style={[
              styles.iconBox,
              {
                backgroundColor: selected
                  ? `${primaryColor}22`
                  : COLORS.bgHighlight,
              },
            ]}
          >
            <Text style={styles.emoji}>{emoji}</Text>
          </View>
        ) : null}

        <View style={styles.textGroup}>
          <Text
            style={[
              styles.label,
              { color: selected ? COLORS.textPrimary : COLORS.textSecondary },
            ]}
          >
            {label}
          </Text>
          {description ? (
            <Text style={styles.description} numberOfLines={2}>
              {description}
            </Text>
          ) : null}
        </View>

        <View style={[styles.radio, selected && { borderColor: primaryColor }]}>
          {selected ? (
            <LinearGradient
              colors={[primaryColor, secondaryColor]}
              style={styles.radioDot}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          ) : null}
        </View>
      </View>
    </Pressable>
  );
};

export default OptionCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    marginBottom: SPACING.sm,
    overflow: "hidden",
  },
  cardDefault: {
    backgroundColor: COLORS.bgCard,
    borderColor: COLORS.border,
  },
  cardSelected: {
    borderWidth: 1.5,
  },
  cardPressed: {
    opacity: 0.75,
  },
  tint: {
    borderRadius: RADIUS.lg,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  emoji: { fontSize: 20 },
  textGroup: { flex: 1, gap: 2 },
  label: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.1,
  },
  description: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 17,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.textMuted,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
