import { SPACING } from "@/constants/theme";
import { useFlowStore } from "@/store/flowStore";
import { ActivityLevel } from "@/types";
import { ACT_T, ACT_THEME_IDX, ACTIVITIES_OPTIONS } from "@/utils/rawData";
import React, { FC, useCallback } from "react";
import { ScrollView, StyleSheet } from "react-native";
import OptionCard from "../ui/OptionCard";
import StepHeader from "../ui/StepHeader";

const ActivityLevelStep: FC = () => {
  const activityLevel = useFlowStore((s) => s.answers.activityLevel);
  const setAnswer = useFlowStore((s) => s.setAnswer);

  const handleSelect = useCallback(
    (value: ActivityLevel) => {
      setAnswer("activityLevel", value);
    },
    [setAnswer],
  );

  const renderOption = useCallback(
    (o: (typeof ACTIVITIES_OPTIONS)[number]) => (
      <OptionCard
        key={o.value}
        label={o.label}
        description={o.description}
        emoji={o.emoji}
        selected={activityLevel === o.value}
        onPress={() => handleSelect(o.value)}
        primaryColor={ACT_T.primary}
        secondaryColor={ACT_T.secondary}
        softColor={ACT_T.soft}
      />
    ),
    [activityLevel, handleSelect],
  );

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <StepHeader
        title="Your activity level"
        subtitle="Be honest — we'll build from where you are today."
        themeIndex={ACT_THEME_IDX}
      />

      {ACTIVITIES_OPTIONS.map(renderOption)}
    </ScrollView>
  );
};

export default ActivityLevelStep;

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: SPACING.xxxl,
  },
});
