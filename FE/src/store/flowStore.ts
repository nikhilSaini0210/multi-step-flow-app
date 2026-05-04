import { StorageKeys } from "@/constants/storage";
import {
  deleteProgressFromAPI,
  getProgressFromAPI,
  saveProgressToAPI,
} from "@/service/api";
import type { ProgressSnapshot, StepId } from "@/types";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { FlowState } from "./flow";
import { computeStepIds } from "./helper";
import { getItem, initSessionId, removeItem, setItem } from "./storage";

export const useFlowStore = create<FlowState>()(
  subscribeWithSelector((set, get) => ({
    currentStepIndex: 0,
    stepIds: ["age-range", "goal", "preferences", "notifications"],
    answers: {},
    sessionId: "",
    apiStatus: "idle",
    apiError: null,
    lastSavedAt: null,
    hydrated: false,
    hydrateError: null,

    hydrate: async () => {
      try {
        const sessionId = await initSessionId();
        set({ sessionId });

        const apiResult = await getProgressFromAPI(sessionId).catch(() => null);

        if (apiResult?.data) {
          const { currentStepIndex, answers } = apiResult.data;

          const stepIds = computeStepIds(answers);
          const safeIndex = Math.max(
            0,
            Math.min(currentStepIndex, stepIds.length - 1),
          );

          set({ currentStepIndex: safeIndex, answers, stepIds });

          await setItem<ProgressSnapshot>(StorageKeys.PROGRESS, {
            currentStepIndex: safeIndex,
            answers,
            savedAt: new Date().toISOString(),
          });
        } else {
          const snapshot = await getItem<ProgressSnapshot>(
            StorageKeys.PROGRESS,
          );

          if (
            snapshot &&
            snapshot.answers &&
            typeof snapshot.currentStepIndex === "number"
          ) {
            const stepIds = computeStepIds(snapshot.answers);

            const safeIndex = Math.max(
              0,
              Math.min(snapshot.currentStepIndex, stepIds.length - 1),
            );

            set({
              currentStepIndex: safeIndex,
              answers: snapshot.answers,
              stepIds,
            });
          }
        }

        set({ hydrated: true, hydrateError: null });
      } catch {
        set({
          hydrated: true,
          hydrateError: "Could not restore your progress. Starting fresh.",
        });
      }
    },

    setAnswer: async (key, value) => {
      const { currentStepIndex, answers } = get();
      const newAnswers = { ...answers, [key]: value };
      if (key === "goal" && value !== "fitness") {
        delete newAnswers.activityLevel;
      }

      const newStepIds = computeStepIds(newAnswers);

      const safeIndex = Math.min(currentStepIndex, newStepIds.length - 1);

      set({
        answers: newAnswers,
        stepIds: newStepIds,
        currentStepIndex: safeIndex,
      });

      await setItem<ProgressSnapshot>(StorageKeys.PROGRESS, {
        currentStepIndex: safeIndex,
        answers: newAnswers,
        savedAt: new Date().toISOString(),
      });
    },

    goNext: async () => {
      const { currentStepIndex, stepIds, answers } = get();
      if (currentStepIndex >= stepIds.length - 1) {
        return;
      }

      const nextIndex = currentStepIndex + 1;
      set({ currentStepIndex: nextIndex });
      await setItem<ProgressSnapshot>(StorageKeys.PROGRESS, {
        currentStepIndex: nextIndex,
        answers,
        savedAt: new Date().toISOString(),
      });
    },

    goBack: async () => {
      const { currentStepIndex, answers } = get();
      if (currentStepIndex <= 0) {
        return;
      }

      const prevIndex = currentStepIndex - 1;
      set({ currentStepIndex: prevIndex });
      await setItem<ProgressSnapshot>(StorageKeys.PROGRESS, {
        currentStepIndex: prevIndex,
        answers,
        savedAt: new Date().toISOString(),
      });
    },

    goToStep: async (index: number) => {
      const { stepIds, answers } = get();
      const clamped = Math.max(0, Math.min(index, stepIds.length - 1));
      set({ currentStepIndex: clamped });
      await setItem<ProgressSnapshot>(StorageKeys.PROGRESS, {
        currentStepIndex: clamped,
        answers,
        savedAt: new Date().toISOString(),
      });
    },

    saveProgress: async (completed = false) => {
      const { sessionId, currentStepIndex, stepIds, answers, apiStatus } =
        get();
      if (apiStatus === "loading") return;

      set({ apiStatus: "loading", apiError: null });

      const result = await saveProgressToAPI(
        sessionId,
        currentStepIndex,
        answers,
        stepIds.length,
        completed,
      );

      if (result.error) {
        set({ apiStatus: "error", apiError: result.error });
      } else {
        set({
          apiStatus: "success",
          apiError: null,
          lastSavedAt: new Date().toISOString(),
        });
        setTimeout(() => {
          if (get().apiStatus === "success") {
            set({ apiStatus: "idle" });
          }
        }, 2500);
      }
    },

    retryApiSave: async () => {
      set({ apiStatus: "idle", apiError: null });
      await get().saveProgress();
    },

    dismissApiError: () => {
      set({ apiStatus: "idle", apiError: null });
    },

    resetFlow: async () => {
      const { sessionId } = get();

      await deleteProgressFromAPI(sessionId).catch(() => {});

      await removeItem(StorageKeys.PROGRESS);
      set({
        currentStepIndex: 0,
        answers: {},
        stepIds: ["age-range", "goal", "preferences", "notifications"],
        apiStatus: "idle",
        apiError: null,
        lastSavedAt: null,
        hydrateError: null,
      });
    },
  })),
);

export const sel = {
  currentStepId: (s: FlowState): StepId => s.stepIds[s.currentStepIndex],
  isFirst: (s: FlowState) => s.currentStepIndex === 0,
  isLast: (s: FlowState) => s.currentStepIndex === s.stepIds.length - 1,
  progressFraction: (s: FlowState) =>
    (s.currentStepIndex + 1) / s.stepIds.length,
  currentThemeIndex: (s: FlowState) => Math.min(s.currentStepIndex, 4),
  ageRange: (s: FlowState) => s.answers.ageRange,
  goal: (s: FlowState) => s.answers.goal,
  activityLevel: (s: FlowState) => s.answers.activityLevel,
  dietPreference: (s: FlowState) => s.answers.dietPreference,
  interests: (s: FlowState) => s.answers.interests,
  name: (s: FlowState) => s.answers.name,
  notificationFrequency: (s: FlowState) => s.answers.notificationFrequency,
};
