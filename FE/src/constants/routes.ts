export const Routes = {
  FLOW: "/flow",
  SUMMARY: "/summary",
  HOME: "/",
} as const;

export type AppRoute = (typeof Routes)[keyof typeof Routes];

export type NavMethod = "push" | "replace";
