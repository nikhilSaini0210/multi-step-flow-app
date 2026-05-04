import { COLORS, CORNER, CORNER_THICKNESS, SHADOWS } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import React, { FC, useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SplashScreenProps {
  onFinish: () => void;
  duration?: number;
}

const SplashScreen: FC<SplashScreenProps> = ({ onFinish, duration = 2600 }) => {
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;

    const timer = setTimeout(() => {
      if (!calledRef.current) {
        calledRef.current = true;
        onFinish();
      }
    }, duration);

    return () => {
      clearTimeout(timer);
      calledRef.current = true;
    };
  }, [onFinish, duration]);

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[COLORS.bg, COLORS.bgCard, COLORS.bg]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <LinearGradient
        colors={[COLORS.accentSoft, "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.glowTopLeft}
      />

      <LinearGradient
        colors={[COLORS.purpleSoft, "transparent"]}
        start={{ x: 1, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={styles.glowBottomRight}
      />

      <SafeAreaView style={styles.safe}>
        <View style={styles.topRow}>
          <View style={styles.rule} />
          <Text style={styles.tagline}>PERSONALISED JOURNEY</Text>
          <View style={styles.rule} />
        </View>

        <View style={styles.centre}>
          <LinearGradient
            colors={[
              COLORS.gradientStart,
              COLORS.gradientMid,
              COLORS.gradientEnd,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.badge, SHADOWS.glow]}
          >
            <View style={styles.badgeRing} />
            <Text style={styles.badgeGlyph}>✦</Text>
          </LinearGradient>

          <Text style={styles.wordMarkTop}>MULTI</Text>
          <View style={styles.wordMarkRow}>
            <View style={styles.wordMarkAccentBar} />
            <Text style={styles.wordMarkBottom}>STEP</Text>
            <View style={styles.wordMarkAccentBar} />
          </View>
          <Text style={styles.wordMarkSub}>FLOW</Text>

          <Text style={styles.descriptor}>
            Your answers.{"\n"}Your experience.
          </Text>
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.dotRow}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={[styles.dot, i === 1 && styles.dotActive]} />
            ))}
          </View>
          <Text style={styles.versionText}>v1.0</Text>
        </View>
      </SafeAreaView>

      <View style={[styles.corner, styles.cornerTL]} />
      <View style={[styles.corner, styles.cornerTR]} />
      <View style={[styles.corner, styles.cornerBL]} />
      <View style={[styles.corner, styles.cornerBR]} />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  safe: {
    flex: 1,
    paddingHorizontal: 32,
    paddingVertical: 24,
    justifyContent: "space-between",
  },

  glowTopLeft: {
    ...StyleSheet.absoluteFill,
    width: "70%",
    height: "50%",
    top: 0,
    left: 0,
  },
  glowBottomRight: {
    ...StyleSheet.absoluteFill,
    width: "60%",
    height: "45%",
    bottom: 0,
    right: 0,
    top: undefined,
    left: undefined,
  },

  corner: {
    position: "absolute",
    width: CORNER,
    height: CORNER,
    borderColor: COLORS.accentCorner,
  },
  cornerTL: {
    top: 16,
    left: 16,
    borderTopWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
  },
  cornerTR: {
    top: 16,
    right: 16,
    borderTopWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
  },
  cornerBL: {
    bottom: 16,
    left: 16,
    borderBottomWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
  },
  cornerBR: {
    bottom: 16,
    right: 16,
    borderBottomWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  rule: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  tagline: {
    color: COLORS.textSecondary,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 3,
  },

  centre: {
    alignItems: "center",
    gap: 6,
  },
  badge: {
    width: 88,
    height: 88,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  badgeRing: {
    position: "absolute",
    width: 72,
    height: 72,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.borderMed,
  },
  badgeGlyph: {
    fontSize: 36,
    color: COLORS.white,
  },

  wordMarkTop: {
    fontSize: 13,
    fontWeight: "300",
    color: COLORS.textMuted,
    letterSpacing: 10,
    marginBottom: -4,
  },
  wordMarkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  wordMarkAccentBar: {
    width: 18,
    height: 2,
    borderRadius: 1,
    backgroundColor: COLORS.accent,
  },
  wordMarkBottom: {
    fontSize: 52,
    fontWeight: "900",
    color: COLORS.white,
    letterSpacing: -1,
    lineHeight: 58,
  },
  wordMarkSub: {
    fontSize: 13,
    fontWeight: "300",
    color: COLORS.textMuted,
    letterSpacing: 10,
    marginTop: -4,
  },

  descriptor: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    letterSpacing: 0.3,
    marginTop: 20,
  },

  bottomRow: {
    alignItems: "center",
    gap: 12,
  },
  dotRow: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.borderMed,
  },
  dotActive: {
    width: 18,
    backgroundColor: COLORS.accent,
    borderRadius: 3,
  },
  versionText: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 2,
  },
});
