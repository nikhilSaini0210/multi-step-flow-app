import { COLORS, STEP_THEMES } from "@/constants/theme";
import {
  ActivityLevel,
  AgeRange,
  ApiStatus,
  DietPreference,
  Goal,
  NotificationFrequency,
} from "@/types";

type ConfigType = {
  bg: string;
  border: string;
  icon: keyof typeof import("@expo/vector-icons").Ionicons.glyphMap;
  color: string;
  text: string;
};

export const getConfig = (
  status: ApiStatus,
  error?: string | null,
): ConfigType => {
  switch (status) {
    case "loading":
      return {
        bg: COLORS.accentSoft,
        border: COLORS.accentBorder,
        icon: "cloud-upload-outline",
        color: COLORS.accent,
        text: "Saving your progress…",
      };

    case "success":
      return {
        bg: COLORS.successSoft,
        border: COLORS.successBorder,
        icon: "checkmark-circle",
        color: COLORS.success,
        text: "Progress saved!",
      };

    case "error":
      return {
        bg: COLORS.errorSoft,
        border: COLORS.errorBorder,
        icon: "alert-circle",
        color: COLORS.error,
        text: error ?? "Failed to save.",
      };

    default:
      return {
        bg: "transparent",
        border: "transparent",
        icon: "alert-circle",
        color: COLORS.black,
        text: "",
      };
  }
};

export const DIETS: {
  value: DietPreference;
  label: string;
  emoji: string;
  description: string;
}[] = [
  {
    value: "omnivore",
    label: "Everything",
    emoji: "🍖",
    description: "No dietary restrictions",
  },
  {
    value: "vegetarian",
    label: "Vegetarian",
    emoji: "🥦",
    description: "No meat, dairy & eggs OK",
  },
  {
    value: "vegan",
    label: "Vegan",
    emoji: "🌱",
    description: "Fully plant-based",
  },
  {
    value: "keto",
    label: "Keto / Low-carb",
    emoji: "🥑",
    description: "High fat, very low carbs",
  },
  {
    value: "paleo",
    label: "Paleo",
    emoji: "🍗",
    description: "Whole foods, no grains",
  },
];

export const INTERESTS = [
  { value: "yoga", label: "Yoga", emoji: "🧘" },
  { value: "running", label: "Running", emoji: "🏃" },
  { value: "cooking", label: "Cooking", emoji: "👨‍🍳" },
  { value: "meditation", label: "Meditation", emoji: "🕯️" },
  { value: "cycling", label: "Cycling", emoji: "🚴" },
  { value: "swimming", label: "Swimming", emoji: "🏊" },
  { value: "reading", label: "Reading", emoji: "📖" },
  { value: "hiking", label: "Hiking", emoji: "🏔️" },
  { value: "travel", label: "Travel", emoji: "✈️" },
  { value: "photography", label: "Photography", emoji: "📷" },
  { value: "music", label: "Music", emoji: "🎵" },
  { value: "art", label: "Art", emoji: "🎨" },
];

export const PRE_THEME_IDX = 3;

export const PRE_T = STEP_THEMES[PRE_THEME_IDX];

export const FREQ_OPTIONS: {
  value: NotificationFrequency;
  label: string;
  emoji: string;
  description: string;
}[] = [
  {
    value: "daily",
    label: "Daily",
    emoji: "📅",
    description: "Gentle daily nudges to keep you on track",
  },
  {
    value: "weekly",
    label: "Weekly",
    emoji: "📆",
    description: "A weekly digest to keep you informed",
  },
  {
    value: "never",
    label: "Never",
    emoji: "🔕",
    description: "I'll check in at my own pace",
  },
];

export const NOTIFICATION_THEME_IDX = 4;

export const NOTIFICATION_T = STEP_THEMES[NOTIFICATION_THEME_IDX];

export const GOALS: {
  value: Goal;
  label: string;
  emoji: string;
  description: string;
}[] = [
  {
    value: "fitness",
    label: "Fitness & Exercise",
    emoji: "💪",
    description: "Build strength, endurance, and physical health",
  },
  {
    value: "nutrition",
    label: "Better Nutrition",
    emoji: "🥗",
    description: "Improve your diet and eating habits",
  },
  {
    value: "mindfulness",
    label: "Mindfulness & Stress",
    emoji: "🧘",
    description: "Reduce stress and cultivate mental clarity",
  },
  {
    value: "productivity",
    label: "Productivity",
    emoji: "🚀",
    description: "Optimise your workflow and achieve more",
  },
  {
    value: "learning",
    label: "Continuous Learning",
    emoji: "📚",
    description: "Expand your knowledge and skills",
  },
];

export const GOAL_THEME_IDX = 1;

export const GOAL_T = STEP_THEMES[GOAL_THEME_IDX];

export const AGE_OPTIONS: {
  value: AgeRange;
  label: string;
  emoji: string;
  description: string;
}[] = [
  {
    value: "18-24",
    label: "18 – 24",
    emoji: "🌱",
    description: "Starting your journey",
  },
  {
    value: "25-34",
    label: "25 – 34",
    emoji: "⚡",
    description: "Building momentum",
  },
  {
    value: "35-44",
    label: "35 – 44",
    emoji: "🎯",
    description: "Peak performance",
  },
  {
    value: "45-54",
    label: "45 – 54",
    emoji: "🌿",
    description: "Wisdom & balance",
  },
  {
    value: "55+",
    label: "55+",
    emoji: "🏆",
    description: "Experience & vitality",
  },
];

export const AGE_THEME_IDX = 0;

export const AGE_T = STEP_THEMES[AGE_THEME_IDX];

export const ACTIVITIES_OPTIONS: {
  value: ActivityLevel;
  label: string;
  emoji: string;
  description: string;
}[] = [
  {
    value: "sedentary",
    label: "Sedentary",
    emoji: "🛋️",
    description: "Little or no exercise, mostly desk work",
  },
  {
    value: "light",
    label: "Lightly Active",
    emoji: "🚶",
    description: "Light exercise 1–3 days per week",
  },
  {
    value: "moderate",
    label: "Moderately Active",
    emoji: "🏃",
    description: "Moderate exercise 3–5 days per week",
  },
  {
    value: "active",
    label: "Very Active",
    emoji: "🏋️",
    description: "Hard exercise or sport 6–7 days per week",
  },
  {
    value: "very_active",
    label: "Athlete Level",
    emoji: "⚡",
    description: "Intense training or physical job daily",
  },
];

export const ACT_THEME_IDX = 2;

export const ACT_T = STEP_THEMES[ACT_THEME_IDX];

export const FEATURES = [
  { icon: "time-outline", text: "Takes about 3 minutes" },
  { icon: "shield-checkmark-outline", text: "Your data stays private" },
  { icon: "refresh-outline", text: "Resume anytime if you close the app" },
  { icon: "pencil-outline", text: "Edit any answer before finishing" },
] as const;
