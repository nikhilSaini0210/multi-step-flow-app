import type { FlowAnswers } from "@/types";
import { api, apiRequest } from "./axiosInstance";
import { ApiResponse, ProgressData } from "./types";

export const saveProgressToAPI = async (
  sessionId: string,
  currentStepIndex: number,
  answers: FlowAnswers,
  totalSteps: number,
  completed = false,
): Promise<ApiResponse<ProgressData>> =>
  apiRequest<ProgressData>(() =>
    api.post("/progress", {
      sessionId,
      currentStepIndex,
      totalSteps,
      answers,
      completed,
    }),
  );

export const getProgressFromAPI = async (
  sessionId: string,
): Promise<ApiResponse<ProgressData>> =>
  apiRequest<ProgressData>(() =>
    api.get("/progress", { params: { sessionId } }),
  );

export const deleteProgressFromAPI = async (
  sessionId: string,
): Promise<ApiResponse<{ sessionId: string }>> =>
  apiRequest<{ sessionId: string }>(() =>
    api.delete("/progress", { params: { sessionId } }),
  );

export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const result = await apiRequest<{ status: string }>(() =>
      api.get("/health"),
    );
    return result.data?.status === "ok";
  } catch {
    return false;
  }
};
