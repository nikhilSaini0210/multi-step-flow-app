import { COLORS, SPACING } from "@/constants/theme";
import { useFlowStore } from "@/store/flowStore";
import { DIETS, INTERESTS, PRE_T, PRE_THEME_IDX } from "@/utils/rawData";
import React, { FC, useCallback, useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Chip from "../ui/Chip";
import OptionCard from "../ui/OptionCard";
import StepHeader from "../ui/StepHeader";

const PreferencesStep: FC = () => {
  const dietPreference = useFlowStore((s) => s.answers.dietPreference);
  const interests = useFlowStore((s) => s.answers.interests);
  const setAnswer = useFlowStore((s) => s.setAnswer);

  const selectedInterests = interests ?? [];

  const selectedSet = useMemo(
    () => new Set(selectedInterests),
    [selectedInterests],
  );

  const toggleInterest = useCallback(
    (value: string) => {
      const next = selectedSet.has(value)
        ? selectedInterests.filter((i) => i !== value)
        : [...selectedInterests, value];

      setAnswer("interests", next);
    },
    [selectedInterests, selectedSet, setAnswer],
  );

  const renderDiet = useCallback(
    (d: (typeof DIETS)[number]) => (
      <OptionCard
        key={d.value}
        label={d.label}
        description={d.description}
        emoji={d.emoji}
        selected={dietPreference === d.value}
        onPress={() => setAnswer("dietPreference", d.value)}
        primaryColor={PRE_T.primary}
        secondaryColor={PRE_T.secondary}
        softColor={PRE_T.soft}
      />
    ),
    [dietPreference, setAnswer],
  );

  const renderInterest = useCallback(
    (i: (typeof INTERESTS)[number]) => (
      <Chip
        key={i.value}
        label={i.label}
        emoji={i.emoji}
        selected={selectedSet.has(i.value)}
        onPress={() => toggleInterest(i.value)}
        primaryColor={PRE_T.primary}
        secondaryColor={PRE_T.secondary}
      />
    ),
    [selectedSet, toggleInterest],
  );

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <StepHeader
        title="Your preferences"
        subtitle="Tell us about your diet and the things you enjoy."
        themeIndex={PRE_THEME_IDX}
      />

      <Text style={styles.sectionLabel}>Diet style</Text>
      {DIETS.map(renderDiet)}

      <Text style={[styles.sectionLabel, styles.sectionSpacing]}>
        Interests <Text style={styles.hint}>(select at least one)</Text>
      </Text>

      <View style={styles.chips}>{INTERESTS.map(renderInterest)}</View>
    </ScrollView>
  );
};

export default PreferencesStep;

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: SPACING.xxxl,
  },
  sectionLabel: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: SPACING.sm,
    letterSpacing: 0.1,
  },
  sectionSpacing: {
    marginTop: SPACING.lg,
  },
  hint: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: "400",
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },
});
