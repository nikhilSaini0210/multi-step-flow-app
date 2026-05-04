import type { ApiStatus, FlowAnswers, StepId } from "@/types";

export interface FlowState {
  currentStepIndex: number;
  stepIds: StepId[];

  answers: FlowAnswers;
  sessionId: string;

  apiStatus: ApiStatus;
  apiError: string | null;
  lastSavedAt: string | null;

  hydrated: boolean;
  hydrateError: string | null;

  hydrate: () => Promise<void>;
  goNext: () => void;
  goBack: () => void;
  goToStep: (index: number) => void;
  setAnswer: <K extends keyof FlowAnswers>(
    key: K,
    value: FlowAnswers[K],
  ) => void;
  saveProgress: () => Promise<void>;
  resetFlow: () => Promise<void>;
  retryApiSave: () => Promise<void>;
  dismissApiError: () => void;
}
