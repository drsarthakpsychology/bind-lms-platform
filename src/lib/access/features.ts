import { PRACTICE_TOOLS } from "@/lib/practice/tools";

/**
 * Sections the admin can switch off for one student (or many at once).
 * A switched-off section disappears from their menu and its pages send them
 * home. Lectures are not here: lecture access is set by cohort.
 */
export type Feature = { key: string; label: string; paths: string[]; except?: string[]; group: "Sections" | "Practice tools" };

const SECTIONS: Feature[] = [
  { key: "notes", label: "Notes", paths: ["/study"], group: "Sections" },
  { key: "games", label: "Games", paths: ["/games"], group: "Sections" },
  { key: "practice", label: "Practice (every tool)", paths: ["/practice"], except: ["/practice/medicines", "/practice/leaderboard"], group: "Sections" },
  { key: "medicines", label: "Medicines", paths: ["/practice/medicines", "/tools/psychopharm"], group: "Sections" },
  { key: "rankings", label: "Overall leaderboard", paths: ["/leaderboard", "/practice/leaderboard"], group: "Sections" },
  { key: "doubts", label: "Doubts", paths: ["/doubts"], group: "Sections" },
  { key: "journey", label: "My journey", paths: ["/journey"], group: "Sections" },
  { key: "wall", label: "Wall", paths: ["/wall"], group: "Sections" },
  { key: "journal", label: "Journal", paths: ["/reflect"], group: "Sections" },
];

export const FEATURES: Feature[] = [
  ...SECTIONS,
  ...PRACTICE_TOOLS.map((t) => ({ key: `tool:${t.flag}`, label: t.title, paths: [t.href], group: "Practice tools" as const })),
];

export const FEATURE_LABEL: Record<string, string> = Object.fromEntries(FEATURES.map((f) => [f.key, f.label]));
export const isFeatureKey = (k: string) => FEATURES.some((f) => f.key === k);

const under = (path: string, p: string) => path === p || path.startsWith(`${p}/`);

/** The switched-off feature that covers this path, if any. */
export function blockedBy(path: string, blocks: Iterable<string>): string | null {
  const off = new Set(blocks);
  if (!off.size) return null;
  for (const f of FEATURES) {
    if (!off.has(f.key)) continue;
    if (f.paths.some((p) => under(path, p)) && !(f.except ?? []).some((p) => under(path, p))) return f.key;
  }
  return null;
}

/** What can be reset for a student, and which table rows that clears. */
export const RESETS = [
  { key: "learn", label: "Notes and Games progress (XP, levels, checkpoints)", table: "learn_progress" },
  { key: "lectures", label: "Lecture progress (watched and finished)", table: "progress" },
  { key: "judgment", label: "Judgment answers", table: "sct_attempts" },
  { key: "mse", label: "MSE trainer answers", table: "mse_attempts" },
  { key: "osce", label: "OSCE station attempts", table: "osce_attempts" },
  { key: "formulation", label: "Formulation attempts", table: "formulation_attempts" },
] as const;
export type ResetKey = (typeof RESETS)[number]["key"];
