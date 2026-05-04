import { COLORS, RADIUS, SPACING } from "@/constants/theme";
import React, { forwardRef, useCallback } from "react";
import {
    Keyboard,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    View,
    ViewStyle,
} from "react-native";

interface TextInputFieldProps extends Omit<TextInputProps, "style"> {
  accentColor?: string;
  maxLength?: number;
  warnAt?: number;
  wrapperStyle?: ViewStyle;
  dismissKeyboardOnOutsideTap?: boolean;
}

const TextInputField = forwardRef<TextInput, TextInputFieldProps>(
  (
    {
      accentColor = COLORS.accent,
      maxLength,
      warnAt,
      wrapperStyle,
      dismissKeyboardOnOutsideTap = true,
      value = "",
      onSubmitEditing,
      returnKeyType = "done",
      submitBehavior = "blurAndSubmit",
      ...rest
    },
    ref,
  ) => {
    const hasValue = value.length > 0;
    const showCounter = !!maxLength && hasValue;
    const threshold = warnAt ?? (maxLength ? maxLength - 5 : Infinity);
    const counterWarning = !!maxLength && value.length > threshold;

    const handleSubmit = useCallback(
      (e: Parameters<NonNullable<TextInputProps["onSubmitEditing"]>>[0]) => {
        if (ref && "current" in ref) ref.current?.blur();
        onSubmitEditing?.(e);
      },
      [ref, onSubmitEditing],
    );

    const field = (
      <View
        style={[
          styles.wrapper,
          hasValue && { borderColor: accentColor },
          wrapperStyle,
        ]}
      >
        <TextInput
          ref={ref}
          style={styles.input}
          value={value}
          maxLength={maxLength}
          returnKeyType={returnKeyType}
          submitBehavior={submitBehavior}
          onSubmitEditing={handleSubmit}
          placeholderTextColor={COLORS.textMuted}
          {...rest}
        />
        {showCounter && (
          <Text
            style={[styles.counter, counterWarning && styles.counterWarning]}
            accessibilityLabel={`${value.length} of ${maxLength} characters`}
          >
            {value.length}/{maxLength}
          </Text>
        )}
      </View>
    );

    if (!dismissKeyboardOnOutsideTap) return field;

    return (
      <Pressable onPress={Keyboard.dismiss} accessible={false}>
        {field}
      </Pressable>
    );
  },
);

TextInputField.displayName = "TextInputField";
export default TextInputField;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bgCard,
    paddingHorizontal: SPACING.md,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 16,
    paddingVertical: SPACING.md,
    fontWeight: "500",
  },
  counter: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: "600",
  },
  counterWarning: {
    color: COLORS.warning,
  },
});
