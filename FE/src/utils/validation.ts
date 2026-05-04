import type { FlowAnswers, StepId } from "@/types";

export interface ValidationResult {
  valid: boolean;
  error: string | null;
}

const VALIDATORS: Record<StepId, (a: FlowAnswers) => string | null> = {
  "age-range": (a) =>
    a.ageRange ? null : "Please select your age range to continue.",

  goal: (a) => (a.goal ? null : "Please choose a goal to continue."),

  preferences: (a) => {
    if (!a.dietPreference) {
      return "Please select a diet style.";
    }
    if (!a.interests?.length) {
      return "Please select at least one interest.";
    }
    return null;
  },

  notifications: (a) => {
    if (!a.name?.trim()) {
      return "Please enter your name.";
    }
    if (!a.notificationFrequency) {
      return "Please choose a reminder frequency.";
    }
    return null;
  },

  "activity-level": (a) =>
    a.activityLevel ? null : "Please select your activity level.",
};

export function validateStep(
  stepId: StepId,
  answers: FlowAnswers,
): ValidationResult {
  const validator = VALIDATORS[stepId];

  if (!validator) {
    if (__DEV__)
      console.warn(`[validateStep] No validator for stepId: "${stepId}"`);
    return { valid: true, error: "" };
  }

  const error = validator(answers);
  return error ? { valid: false, error } : { valid: true, error: "" };
}
