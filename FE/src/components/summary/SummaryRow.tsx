import { COLORS, RADIUS, SPACING } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { FC } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface RowProps {
  label: string;
  value: string;
  accentColor: string;
  onEdit: () => void;
  missing?: boolean;
}

const SummaryRow: FC<RowProps> = ({
  label,
  value,
  accentColor,
  onEdit,
  missing,
}) => {
  return (
    <View style={styles.row}>
      <View style={[styles.rowAccent, { backgroundColor: accentColor }]} />
      <View style={styles.rowBody}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text
          style={[
            styles.rowValue,
            missing && { color: COLORS.textMuted, fontStyle: "italic" },
          ]}
          numberOfLines={3}
        >
          {value}
        </Text>
      </View>
      <Pressable
        onPress={onEdit}
        hitSlop={8}
        style={({ pressed }) => [
          styles.editBtn,
          { borderColor: accentColor },
          pressed && { opacity: 0.6 },
        ]}
        accessibilityLabel={`Edit ${label}`}
        accessibilityRole="button"
      >
        <Ionicons name="pencil" size={13} color={accentColor} />
      </Pressable>
    </View>
  );
};

export default SummaryRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    gap: SPACING.md,
  },
  rowAccent: { width: 3, height: 36, borderRadius: 2, flexShrink: 0 },
  rowBody: { flex: 1, gap: 3 },
  rowLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  rowValue: { color: COLORS.textPrimary, fontSize: 15, fontWeight: "600" },
  editBtn: {
    width: 30,
    height: 30,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.bgHighlight,
    flexShrink: 0,
  },
});
