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

export interface SaveProgressBody {
  sessionId: string;
  currentStepIndex: number;
  totalSteps: number;
  answers: FlowAnswers;
  completed?: boolean;
}

export interface ProgressResponse {
  sessionId: string;
  currentStepIndex: number;
  totalSteps: number;
  answers: FlowAnswers;
  completed: boolean;
  completedAt: string | null;
  updatedAt: string;
  createdAt: string;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
