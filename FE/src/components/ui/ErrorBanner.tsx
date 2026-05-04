import { COLORS, RADIUS, SPACING } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";

interface ErrorBannerProps {
  message: string;
}

const ErrorBanner: FC<ErrorBannerProps> = ({ message }) => {
  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle" size={15} color={COLORS.error} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

export default ErrorBanner;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.errorSoft,
    borderWidth: 1,
    borderColor: COLORS.errorBorder,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  text: {
    flex: 1,
    color: COLORS.error,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
  },
});
