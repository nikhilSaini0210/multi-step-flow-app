import StepComponent from "@/components/steps/StepComponent";
import { GhostButton, IconButton, PrimaryButton } from "@/components/ui/Button";
import ErrorBanner from "@/components/ui/ErrorBanner";
import ProgressBar from "@/components/ui/ProgressBar";
import Toast from "@/components/ui/Toast";
import { Routes } from "@/constants/routes";
import { COLORS, SPACING, STEP_THEMES } from "@/constants/theme";
import { useNavigateSafe } from "@/hooks/useNavigateSafe";
import { useFlowStore } from "@/store/flowStore";
import { StepId } from "@/types";
import { validateStep } from "@/utils/validation";
import { Ionicons } from "@expo/vector-icons";
import React, { FC, useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FlowScreen: FC = () => {
  const { navigateSafe, goToBack } = useNavigateSafe();

  const currentStepIndex = useFlowStore((s) => s.currentStepIndex);
  const hydrated = useFlowStore((s) => s.hydrated);
  const apiStatus = useFlowStore((s) => s.apiStatus);
  const apiError = useFlowStore((s) => s.apiError);

  const stepIds = useFlowStore((s) => s.stepIds);

  const goNext = useFlowStore((s) => s.goNext);
  const goBack = useFlowStore((s) => s.goBack);
  const saveProgress = useFlowStore((s) => s.saveProgress);
  const retryApiSave = useFlowStore((s) => s.retryApiSave);
  const dismissApiError = useFlowStore((s) => s.dismissApiError);

  const currentStepId = stepIds[currentStepIndex] as StepId | undefined;
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === stepIds.length - 1;
  const themeIndex = Math.min(currentStepIndex, STEP_THEMES.length - 1);
  const theme = STEP_THEMES[themeIndex];

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleNext = useCallback(async () => {
    if (!currentStepId) return;

    const answers = useFlowStore.getState().answers;
    const { valid, error } = validateStep(currentStepId, answers);

    if (!valid) {
      setValidationError(error);
      return;
    }
    setValidationError(null);

    await saveProgress();

    if (isLast) {
      navigateSafe(Routes.SUMMARY);
    } else {
      goNext();
    }
  }, [currentStepId, isLast, saveProgress, navigateSafe, goNext]);

  const handleBack = useCallback(() => {
    setValidationError(null);
    if (isFirst) {
      goToBack();
    } else {
      goBack();
    }
  }, [isFirst, goBack, goToBack]);

  if (!hydrated) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator color={COLORS.accent} size="large" />
        <Text style={styles.loadingText}>Restoring your progress…</Text>
      </SafeAreaView>
    );
  }

  if (!currentStepId) {
    return (
      <SafeAreaView style={styles.loading}>
        <Text style={styles.loadingText}>
          Something went wrong. Please restart.
        </Text>
        <GhostButton
          label="Go back"
          onPress={() => navigateSafe(Routes.HOME, "replace")}
        />
      </SafeAreaView>
    );
  }
  const continueBtnLabel = isLast ? "View Summary" : "Continue";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon={
            <Ionicons
              name="chevron-back"
              size={20}
              color={COLORS.textSecondary}
            />
          }
          onPress={handleBack}
          accessibilityLabel={
            isFirst ? "Go back to home" : "Go to previous step"
          }
        />
        <View style={styles.progressWrapper}>
          <ProgressBar
            current={currentStepIndex + 1}
            total={stepIds.length}
            themeIndex={themeIndex}
          />
        </View>
      </View>

      <View style={styles.body}>
        <StepComponent stepId={currentStepId} />
      </View>

      <View style={styles.footer}>
        {validationError ? <ErrorBanner message={validationError} /> : null}

        <Toast
          status={apiStatus}
          error={apiError}
          onRetry={retryApiSave}
          onDismiss={dismissApiError}
        />

        <View style={styles.btnRow}>
          <PrimaryButton
            label={continueBtnLabel}
            onPress={handleNext}
            loading={false}
            colors={[theme.primary, theme.secondary]}
            icon={
              isLast ? (
                <Ionicons name="checkmark" size={18} color={COLORS.white} />
              ) : (
                <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
              )
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FlowScreen;

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.md,
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: 15,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
    gap: SPACING.sm,
  },
  progressWrapper: {
    flex: 1,
  },
  body: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  footer: {
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
    gap: SPACING.xs,
  },
  btnRow: {
    paddingHorizontal: SPACING.lg,
  },
});
