import { GhostButton, PrimaryButton } from "@/components/ui/Button";
import { Routes } from "@/constants/routes";
import { StorageKeys } from "@/constants/storage";
import { COLORS, RADIUS, SPACING } from "@/constants/theme";
import { useNavigateSafe } from "@/hooks/useNavigateSafe";
import { useFlowStore } from "@/store/flowStore";
import { safeParse } from "@/store/storage";
import { ProgressSnapshot } from "@/types";
import { formatSaved } from "@/utils/dateUtils";
import { FEATURES } from "@/utils/rawData";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import React, { FC, useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const IndexScreen: FC = () => {
  const { navigateSafe, mountedRef } = useNavigateSafe();

  const hydrate = useFlowStore((s) => s.hydrate);
  const resetFlow = useFlowStore((s) => s.resetFlow);
  const hydrateError = useFlowStore((s) => s.hydrateError);

  const [snapshot, setSnapshot] = useState<ProgressSnapshot | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        await hydrate();

        const raw = await AsyncStorage.getItem(StorageKeys.PROGRESS);

        if (!mountedRef.current) return;

        const parsed = safeParse(raw);

        if (!parsed && raw) {
          await AsyncStorage.removeItem(StorageKeys.PROGRESS);
        }

        setSnapshot(parsed);
      } catch (err) {
        if (__DEV__) {
          console.warn("[IndexScreen] init error:", err);
        }
      } finally {
        if (mountedRef.current) {
          setChecking(false);
        }
      }
    };

    init();
  }, [hydrate, mountedRef]);

  const handleStart = useCallback(async () => {
    try {
      await resetFlow();
      navigateSafe(Routes.FLOW);
    } catch (err) {
      if (__DEV__) {
        console.warn("[IndexScreen] resetFlow error:", err);
      }
    }
  }, [resetFlow, navigateSafe]);

  const handleResume = useCallback(() => {
    navigateSafe(Routes.FLOW);
  }, [navigateSafe]);

  if (checking) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator color={COLORS.accent} size={"large"} />
      </SafeAreaView>
    );
  }

  const canResume = !!snapshot && !hydrateError;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <LinearGradient
          colors={[
            COLORS.gradientStart,
            COLORS.gradientMid,
            COLORS.gradientEnd,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.logo}
        >
          <Text style={styles.logoEmoji}>✦</Text>
        </LinearGradient>

        <Text style={styles.appName}>Multi Step Flow</Text>
        <View style={styles.tagRow}>
          <LinearGradient
            colors={[
              COLORS.gradientStart,
              COLORS.gradientMid,
              COLORS.gradientEnd,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.tagPill}
          >
            <Text style={styles.tagText}>Your personalised journey</Text>
          </LinearGradient>
        </View>

        <Text style={styles.subtitle}>
          Answer a few quick questions and we'll craft an experience tailored
          just for you.
        </Text>

        <View style={styles.features}>
          {FEATURES.map((f) => (
            <View key={f.text} style={styles.featureRow}>
              <View style={styles.featureIconBox}>
                <Ionicons
                  name={f.icon as any}
                  size={14}
                  color={COLORS.accent}
                />
              </View>
              <Text style={styles.featureText}>{f.text}</Text>
            </View>
          ))}
        </View>

        {hydrateError ? (
          <View style={styles.warnBanner}>
            <Ionicons
              name="information-circle-outline"
              size={15}
              color={COLORS.warning}
            />
            <Text style={styles.warnText}>{hydrateError}</Text>
          </View>
        ) : null}

        {canResume && (
          <View style={styles.resumeCard}>
            <View style={styles.resumeLeft}>
              <Ionicons name="bookmark" size={18} color={COLORS.accent} />
              <View>
                <Text style={styles.resumeTitle}>
                  Continue where you left off
                </Text>
                <Text style={styles.resumeSub}>
                  Step {snapshot.currentStepIndex + 1} · Saved{" "}
                  {formatSaved(snapshot.savedAt)}
                </Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={COLORS.textMuted}
            />
          </View>
        )}

        <View style={styles.buttons}>
          {canResume ? (
            <>
              <PrimaryButton
                label="Resume Progress"
                onPress={handleResume}
                colors={[
                  COLORS.gradientStart,
                  COLORS.gradientMid,
                  COLORS.gradientEnd,
                ]}
                icon={
                  <Ionicons
                    name="arrow-forward"
                    size={18}
                    color={COLORS.white}
                  />
                }
              />
              <GhostButton
                label="Start Over"
                onPress={handleStart}
                color={COLORS.textSecondary}
              />
            </>
          ) : (
            <PrimaryButton
              label="Get Started"
              onPress={handleStart}
              colors={[
                COLORS.gradientStart,
                COLORS.gradientMid,
                COLORS.gradientEnd,
              ]}
              icon={
                <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
              }
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default IndexScreen;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scroll: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xxxl,
    gap: SPACING.lg,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  logoEmoji: {
    fontSize: 34,
    color: COLORS.white,
  },
  appName: {
    fontSize: 38,
    fontWeight: "900",
    color: COLORS.textPrimary,
    letterSpacing: -1.2,
    marginTop: SPACING.xs,
  },
  tagRow: {
    flexDirection: "row",
  },
  tagPill: {
    alignSelf: "flex-start",
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.white,
    letterSpacing: 0.4,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 23,
  },
  features: {
    gap: SPACING.sm,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  featureIconBox: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    flex: 1,
  },
  warnBanner: {
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
  resumeCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.accentBorder,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  resumeLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    flex: 1,
  },
  resumeTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "700",
  },
  resumeSub: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  buttons: {
    gap: SPACING.xs,
    marginTop: SPACING.sm,
  },
});
