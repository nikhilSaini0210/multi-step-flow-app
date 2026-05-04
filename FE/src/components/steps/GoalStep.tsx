import { SPACING } from "@/constants/theme";
import { useFlowStore } from "@/store/flowStore";
import { Goal } from "@/types";
import { GOAL_T, GOAL_THEME_IDX, GOALS } from "@/utils/rawData";
import React, { FC, useCallback } from "react";
import { ScrollView, StyleSheet } from "react-native";
import OptionCard from "../ui/OptionCard";
import StepHeader from "../ui/StepHeader";

const GoalStep: FC = () => {
  const goal = useFlowStore((s) => s.answers.goal);
  const setAnswer = useFlowStore((s) => s.setAnswer);
  const handleSelect = useCallback(
    (value: Goal) => {
      setAnswer("goal", value);
    },
    [setAnswer],
  );

  const renderGoal = useCallback(
    (o: (typeof GOALS)[number]) => (
      <OptionCard
        key={o.value}
        label={o.label}
        description={o.description}
        emoji={o.emoji}
        selected={goal === o.value}
        onPress={() => handleSelect(o.value)}
        primaryColor={GOAL_T.primary}
        secondaryColor={GOAL_T.secondary}
        softColor={GOAL_T.soft}
      />
    ),
    [goal, handleSelect],
  );

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <StepHeader
        title="What's your main goal?"
        subtitle="Choose the area you'd most like to improve. You can change this any time."
        themeIndex={GOAL_THEME_IDX}
      />
      {GOALS.map(renderGoal)}
    </ScrollView>
  );
};

export default GoalStep;

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: SPACING.xxxl,
  },
});
