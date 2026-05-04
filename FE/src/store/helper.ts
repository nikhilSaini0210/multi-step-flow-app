import type { FlowAnswers, StepId } from "@/types";

export const computeStepIds = (answers: FlowAnswers): StepId[] => {
  const steps: StepId[] = ["age-range", "goal"];
  if (answers.goal === "fitness") {
    steps.push("activity-level");
  }
  steps.push("preferences", "notifications");
  return steps;
};
