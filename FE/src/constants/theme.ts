export const COLORS = {
  bg: "#0A0A0F",
  bgCard: "#13131E",
  bgElevated: "#1C1C2E",
  bgHighlight: "#242438",
  bgPressed: "#2A2A42",

  gradientStart: "#7C6FF7",
  gradientMid: "#A855F7",
  gradientEnd: "#EC4899",

  accent: "#7C6FF7",
  accentDark: "#5A54CC",
  accentSoft: "rgba(124, 111, 247, 0.12)",
  accentBorder: "rgba(124, 111, 247, 0.35)",
  accentCorner: "rgba(124,111,247,0.45)",

  purple: "#A855F7",
  purpleSoft: "rgba(168, 85, 247, 0.12)",

  pink: "#EC4899",
  pinkSoft: "rgba(236, 72, 153, 0.10)",

  teal: "#2DD4BF",
  tealSoft: "rgba(45, 212, 191, 0.10)",

  amber: "#F59E0B",
  amberSoft: "rgba(245, 158, 11, 0.10)",

  success: "#22C55E",
  successSoft: "rgba(34, 197, 94, 0.10)",
  successBorder: "rgba(34, 197, 94, 0.3)",

  warning: "#F59E0B",
  warningSoft: "rgba(245, 158, 11, 0.10)",
  warningBorder: "rgba(245,158,11,0.3)",

  error: "#EF4444",
  errorSoft: "rgba(239, 68, 68, 0.10)",
  errorBorder: "rgba(239, 68, 68, 0.3)",

  textPrimary: "#EEEEFF",
  textSecondary: "#9090B8",
  textMuted: "#55557A",
  textDisabled: "#3A3A58",

  border: "rgba(255,255,255,0.06)",
  borderMed: "rgba(255,255,255,0.10)",
  borderActive: "rgba(124, 111, 247, 0.5)",

  white: "#FFFFFF",
  black: "#000000",

  overlay: "rgba(0,0,0,0.6)",
};

export const FONTS = {
  display: "System", // Will use system font, styled boldly
  body: "System",
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const RADIUS = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 32,
  full: 9999,
};

export const FONT_SIZE = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 26,
  xxxl: 34,
};

export const SHADOWS = {
  glow: {
    shadowColor: "#6C63FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const STEP_THEMES: Array<{
  primary: string;
  secondary: string;
  soft: string;
  border: string;
  emoji: string;
  label: string;
}> = [
  {
    primary: "#7C6FF7",
    secondary: "#A855F7",
    soft: "rgba(124,111,247,0.12)",
    border: "rgba(124,111,247,0.35)",
    emoji: "👤",
    label: "About You",
  },
  {
    primary: "#A855F7",
    secondary: "#EC4899",
    soft: "rgba(168,85,247,0.12)",
    border: "rgba(168,85,247,0.35)",
    emoji: "🎯",
    label: "Your Goal",
  },
  {
    primary: "#EC4899",
    secondary: "#F97316",
    soft: "rgba(236,72,153,0.10)",
    border: "rgba(236,72,153,0.30)",
    emoji: "⚡",
    label: "Activity",
  },
  {
    primary: "#2DD4BF",
    secondary: "#7C6FF7",
    soft: "rgba(45,212,191,0.10)",
    border: "rgba(45,212,191,0.30)",
    emoji: "✨",
    label: "Preferences",
  },
  {
    primary: "#F59E0B",
    secondary: "#EC4899",
    soft: "rgba(245,158,11,0.10)",
    border: "rgba(245,158,11,0.30)",
    emoji: "🔔",
    label: "Reminders",
  },
];

export const CORNER = 24;
export const CORNER_THICKNESS = 1.5;
