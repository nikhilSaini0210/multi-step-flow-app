import { SPACING } from "@/constants/theme";
import { useFlowStore } from "@/store/flowStore";
import { AgeRange } from "@/types";
import { AGE_OPTIONS, AGE_T, AGE_THEME_IDX } from "@/utils/rawData";
import React, { FC, useCallback } from "react";
import { ScrollView, StyleSheet } from "react-native";
import OptionCard from "../ui/OptionCard";
import StepHeader from "../ui/StepHeader";

const AgeRangeStep: FC = () => {
  const ageRange = useFlowStore((s) => s.answers.ageRange);
  const setAnswer = useFlowStore((s) => s.setAnswer);

  const handleSelect = useCallback(
    (value: AgeRange) => {
      setAnswer("ageRange", value);
    },
    [setAnswer],
  );

  const renderOption = useCallback(
    (o: (typeof AGE_OPTIONS)[number]) => (
      <OptionCard
        key={o.value}
        label={o.label}
        description={o.description}
        emoji={o.emoji}
        selected={ageRange === o.value}
        onPress={() => handleSelect(o.value)}
        primaryColor={AGE_T.primary}
        secondaryColor={AGE_T.secondary}
        softColor={AGE_T.soft}
      />
    ),
    [ageRange, handleSelect],
  );

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <StepHeader
        title="How old are you?"
        subtitle="We'll personalise your experience based on your life stage."
        themeIndex={AGE_THEME_IDX}
      />
      {AGE_OPTIONS.map(renderOption)}
    </ScrollView>
  );
};

export default AgeRangeStep;

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: SPACING.xxxl,
  },
});
