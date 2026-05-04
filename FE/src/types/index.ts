export type AgeRange = "18-24" | "25-34" | "35-44" | "45-54" | "55+";
export type Goal =
  | "fitness"
  | "nutrition"
  | "mindfulness"
  | "productivity"
  | "learning";
export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";
export type DietPreference =
  | "omnivore"
  | "vegetarian"
  | "vegan"
  | "keto"
  | "paleo";
export type NotificationFrequency = "daily" | "weekly" | "never";

export interface FlowAnswers {
  ageRange?: AgeRange;
  goal?: Goal;
  activityLevel?: ActivityLevel;
  dietPreference?: DietPreference;
  interests?: string[];
  notificationFrequency?: NotificationFrequency;
  name?: string;
}

export type StepId =
  | "age-range"
  | "goal"
  | "activity-level"
  | "preferences"
  | "notifications";

export type ApiStatus = "idle" | "loading" | "success" | "error";

export interface ProgressSnapshot {
  currentStepIndex: number;
  answers: FlowAnswers;
  savedAt: string;
}
