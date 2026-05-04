import { COLORS, SPACING } from "@/constants/theme";
import { useFlowStore } from "@/store/flowStore";
import {
  FREQ_OPTIONS,
  NOTIFICATION_T,
  NOTIFICATION_THEME_IDX,
} from "@/utils/rawData";
import React, { FC, useCallback, useRef } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import OptionCard from "../ui/OptionCard";
import StepHeader from "../ui/StepHeader";
import TextInputField from "../ui/TextInputField";

const NotificationsStep: FC = () => {
  const name = useFlowStore((s) => s.answers.name);
  const notificationFrequency = useFlowStore(
    (s) => s.answers.notificationFrequency,
  );
  const setAnswer = useFlowStore((s) => s.setAnswer);

  const inputRef = useRef<TextInput>(null);

  const nameVal = name ?? "";

  const handleNameChange = useCallback(
    (text: string) => {
      setAnswer("name", text.replace(/^\s+/, ""));
    },
    [setAnswer],
  );

  const renderOption = useCallback(
    (o: (typeof FREQ_OPTIONS)[number]) => (
      <OptionCard
        key={o.value}
        label={o.label}
        description={o.description}
        emoji={o.emoji}
        selected={notificationFrequency === o.value}
        onPress={() => setAnswer("notificationFrequency", o.value)}
        primaryColor={NOTIFICATION_T.primary}
        secondaryColor={NOTIFICATION_T.secondary}
        softColor={NOTIFICATION_T.soft}
      />
    ),
    [notificationFrequency, setAnswer],
  );

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <StepHeader
          title="Almost there!"
          subtitle="Just two more things to personalise your experience."
          themeIndex={NOTIFICATION_THEME_IDX}
        />

        <Text style={styles.label}>What should we call you?</Text>
        <TextInputField
          ref={inputRef}
          value={nameVal}
          onChangeText={handleNameChange}
          placeholder="Enter your name..."
          accentColor={NOTIFICATION_T.primary}
          maxLength={40}
          autoCapitalize="words"
          autoCorrect={false}
          accessibilityLabel="Your name"
          wrapperStyle={styles.inputWrapper}
        />

        <Text style={[styles.label, styles.sectionSpacing]}>
          How often should we remind you?
        </Text>
        {FREQ_OPTIONS.map(renderOption)}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default NotificationsStep;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    paddingBottom: 120,
  },
  label: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: SPACING.sm,
  },
  sectionSpacing: {
    marginTop: SPACING.lg,
  },
  inputWrapper: {
    marginBottom: SPACING.sm,
  },
  charCount: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: "600",
  },
  charWarning: {
    color: COLORS.warning,
  },
});
