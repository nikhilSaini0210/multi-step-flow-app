import { FlowAnswers } from "@/types";

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  statusCode?: number;
}

export interface ProgressData {
  sessionId: string;
  currentStepIndex: number;
  totalSteps: number;
  answers: FlowAnswers;
  completed: boolean;
  completedAt: string | null;
  updatedAt: string;
  createdAt: string;
}
