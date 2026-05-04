import { COLORS, RADIUS, SPACING } from "@/constants/theme";
import { ApiStatus } from "@/types";
import { getConfig } from "@/utils/rawData";
import { Ionicons } from "@expo/vector-icons";
import React, { FC, useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface ToastProps {
  status: ApiStatus;
  error: string | null;
  onRetry: () => void;
  onDismiss: () => void;
}

const Toast: FC<ToastProps> = ({ status, error, onRetry, onDismiss }) => {
  if (status === "idle") return null;

  const config = useMemo(() => getConfig(status, error), [status, error]);

  return (
    <View
      style={[
        styles.toast,
        { backgroundColor: config.bg, borderColor: config.border },
      ]}
    >
      <Ionicons name={config.icon} size={16} color={config.color} />
      <Text style={[styles.text, { color: config.color }]} numberOfLines={2}>
        {config.text}
      </Text>
      {status === "error" && (
        <Pressable onPress={onRetry} style={styles.retryBtn}>
          <Text style={[styles.retryText, { color: config.color }]}>Retry</Text>
        </Pressable>
      )}
      {(status === "error" || status === "success") && (
        <Pressable onPress={onDismiss} hitSlop={8}>
          <Ionicons name="close" size={14} color={config.color} />
        </Pressable>
      )}
    </View>
  );
};

export default Toast;

const styles = StyleSheet.create({
  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  text: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
  },
  retryBtn: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.errorBorder,
  },
  retryText: {
    fontSize: 12,
    fontWeight: "700",
  },
});
