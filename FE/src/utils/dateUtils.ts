export const formatSaved = (iso: string) => {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "recently";
  }
};

export const capitalize = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, " ");
};

export const formatList = (arr: string[]) => {
  if (!arr || arr.length === 0) return "—";
  return arr.map(capitalize).join(", ");
};
