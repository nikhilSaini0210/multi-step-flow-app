import SummaryRow from "@/components/summary/SummaryRow";
import { GhostButton, PrimaryButton } from "@/components/ui/Button";
import { Routes } from "@/constants/routes";
import { COLORS, RADIUS, SPACING, STEP_THEMES } from "@/constants/theme";
import { useNavigateSafe } from "@/hooks/useNavigateSafe";
import { sel, useFlowStore } from "@/store/flowStore";
import { StepId } from "@/types";
import { capitalize, formatList } from "@/utils/dateUtils";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { FC, useCallback, useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SummaryScreen: FC = () => {
  const { navigateSafe, goToBack } = useNavigateSafe();

  const ageRange = useFlowStore(sel.ageRange);
  const goal = useFlowStore(sel.goal);
  const activityLevel = useFlowStore(sel.activityLevel);
  const dietPreference = useFlowStore(sel.dietPreference);
  const interests = useFlowStore(sel.interests);
  const notificationFreq = useFlowStore(sel.notificationFrequency);
  const name = useFlowStore(sel.name);
  const stepIds = useFlowStore((s) => s.stepIds);
  const goToStep = useFlowStore((s) => s.goToStep);
  const resetFlow = useFlowStore((s) => s.resetFlow);

  const [finishing, setFinishing] = useState(false);

  const hasAnyAnswer = !!(ageRange || goal || dietPreference);

  if (!hasAnyAnswer) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            No answers found. Please complete the questionnaire first.
          </Text>
          <GhostButton
            label="Go to Start"
            onPress={() => navigateSafe(Routes.HOME, "replace")}
            color={COLORS.textSecondary}
          />
        </View>
      </SafeAreaView>
    );
  }

  const displayName = name?.trim() || "there";
  const hasActivityStep = stepIds.includes("activity-level" as StepId);

  const rows = useMemo(() => {
    const base: Array<{
      label: string;
      value: string;
      stepId: StepId;
      themeIdx: number;
      missing: boolean;
    }> = [
      {
        label: "Age Range",
        value: ageRange ?? "—",
        stepId: "age-range",
        themeIdx: 0,
        missing: !ageRange,
      },
      {
        label: "Primary Goal",
        value: goal ? capitalize(goal) : "—",
        stepId: "goal",
        themeIdx: 1,
        missing: !goal,
      },
      ...(hasActivityStep
        ? [
            {
              label: "Activity Level",
              value: activityLevel ? capitalize(activityLevel) : "—",
              stepId: "activity-level" as StepId,
              themeIdx: 2,
              missing: !activityLevel,
            },
          ]
        : []),
      {
        label: "Diet Preference",
        value: dietPreference ? capitalize(dietPreference) : "—",
        stepId: "preferences",
        themeIdx: 3,
        missing: !dietPreference,
      },
      {
        label: "Interests",
        value: formatList(interests ?? []),
        stepId: "preferences",
        themeIdx: 3,
        missing: !interests?.length,
      },
      {
        label: "Notifications",
        value: notificationFreq ? capitalize(notificationFreq) : "—",
        stepId: "notifications",
        themeIdx: 4,
        missing: !notificationFreq,
      },
    ];

    return base;
  }, [
    ageRange,
    goal,
    activityLevel,
    dietPreference,
    interests,
    notificationFreq,
    hasActivityStep,
  ]);

  const anyMissing = useMemo(() => rows.some((r) => r.missing), [rows]);

  const editStep = useCallback(
    (stepId: StepId) => {
      const idx = stepIds.indexOf(stepId);
      if (idx < 0) return;
      goToStep(idx);
      navigateSafe(Routes.FLOW);
    },
    [stepIds, goToStep, navigateSafe],
  );

  const handleFinish = useCallback(async () => {
    if (finishing || anyMissing) return;
    setFinishing(true);
    try {
      await resetFlow();
      navigateSafe(Routes.HOME, "replace");
    } catch (err) {
      if (__DEV__) {
        console.warn("[SummaryScreen] handleFinish error:", err);
      }
      setFinishing(false);
    }
  }, [finishing, anyMissing, resetFlow, navigateSafe]);

  const handleStartOver = useCallback(() => {
    Alert.alert(
      "Start Over?",
      "This will clear all your answers and take you back to the beginning.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Start Over",
          style: "destructive",
          onPress: async () => {
            try {
              await resetFlow();
              navigateSafe(Routes.HOME, "replace");
            } catch (err) {
              if (__DEV__)
                console.warn("[SummaryScreen] resetFlow error:", err);
            }
          },
        },
      ],
    );
  }, [resetFlow, navigateSafe]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={goToBack}
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
          accessibilityLabel="Go back"
        >
          <Ionicons
            name="chevron-back"
            size={20}
            color={COLORS.textSecondary}
          />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <LinearGradient
          colors={[
            COLORS.gradientStart,
            COLORS.gradientMid,
            COLORS.gradientEnd,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.checkBadge}
        >
          <Ionicons name="checkmark-done" size={30} color={COLORS.white} />
        </LinearGradient>

        <Text style={styles.greeting}>Hey {displayName}! 🎉</Text>
        <Text style={styles.subheading}>
          Here's a summary of your profile. Tap the pencil to edit any answer
          before finishing.
        </Text>

        {anyMissing ? (
          <View style={styles.warnCard}>
            <Ionicons
              name="alert-circle-outline"
              size={16}
              color={COLORS.warning}
            />
            <Text style={styles.warnText}>
              Some answers are missing. Edit them before completing.
            </Text>
          </View>
        ) : null}

        <View style={styles.card}>
          {rows.map((row, idx) => (
            <React.Fragment key={`${row.stepId}-${row.label}`}>
              <SummaryRow
                label={row.label}
                value={row.value}
                accentColor={STEP_THEMES[row.themeIdx].primary}
                onEdit={() => editStep(row.stepId)}
                missing={row.missing}
              />
              {idx < rows.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>

        <PrimaryButton
          label={finishing ? "Finishing…" : "Complete Setup"}
          onPress={handleFinish}
          loading={finishing}
          disabled={anyMissing || finishing}
          colors={[
            COLORS.gradientStart,
            COLORS.gradientMid,
            COLORS.gradientEnd,
          ]}
          icon={
            !finishing ? (
              <Ionicons name="sparkles" size={18} color={COLORS.white} />
            ) : undefined
          }
        />

        {anyMissing ? (
          <Text style={styles.missingNote}>
            Please fill in all missing fields before completing.
          </Text>
        ) : null}

        <GhostButton
          label="Start Over"
          onPress={handleStartOver}
          color={COLORS.textMuted}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SummaryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scroll: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxxl,
    gap: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
  },
  pressed: {
    opacity: 0.6,
  },
  backText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    fontWeight: "600",
  },
  checkBadge: {
    width: 68,
    height: 68,
    borderRadius: RADIUS.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  greeting: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  subheading: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 21,
  },
  warnCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.warningSoft,
    borderWidth: 1,
    borderColor: COLORS.warningBorder,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  warnText: {
    color: COLORS.warning,
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.md,
  },
  missingNote: {
    color: COLORS.textMuted,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
    marginTop: -SPACING.sm,
  },
});
