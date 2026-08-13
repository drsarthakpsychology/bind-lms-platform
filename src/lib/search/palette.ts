/**
 * Ask the Syllabus (⌘K) — command palette over the ACTUAL content in this
 * install: practice tools, courses/lessons, case-library docs, competencies,
 * and admin surfaces. Search is lexical (no embeddings needed), honest about
 * what it covers, and works fully offline.
 */

export interface PaletteEntry {
  id: string;
  label: string;
  /** Short description shown under the label. */
  hint?: string;
  href: string;
  /** Group the result clusters under. */
  group: "Tools" | "Courses" | "Cases" | "Competencies" | "Admin" | "Nav";
  /** Keywords beyond the label, searched too (e.g. "patient", "MSE"). */
  keywords?: string[];
  shortcut?: string;
}

const TOOLS: PaletteEntry[] = [
  { id: "cr", label: "Consulting Room", hint: "Interview a simulated patient", href: "/practice/consulting-room", group: "Tools", keywords: ["sim", "patient", "voice"] },
  { id: "judgment", label: "5 Judgment Calls", hint: "90 seconds, one screen", href: "/practice/judgment", group: "Tools", keywords: ["sct", "script concordance"] },
  { id: "clinic", label: "Two-Minute Clinic", hint: "120s micro-drill", href: "/practice/two-minute-clinic", group: "Tools", keywords: ["drill", "micro"] },
  { id: "formulation", label: "Formulation Forge", hint: "5P formulation", href: "/practice/formulation", group: "Tools", keywords: ["5p", "narrative"] },
  { id: "mse", label: "MSE Trainer", hint: "Mental status exam", href: "/practice/mse", group: "Tools", keywords: ["mental status"] },
  { id: "osce", label: "OSCE Stations", hint: "Timed stations", href: "/practice/osce", group: "Tools", keywords: ["exam", "station"] },
  { id: "rounds", label: "Rounds", hint: "Spaced-repetition cards", href: "/practice/rounds", group: "Tools", keywords: ["cards", "review", "fsrs"] },
  { id: "ethics", label: "Ethics & Law", hint: "MHA 2017, POCSO, RCI scope", href: "/practice/ethics", group: "Tools", keywords: ["law", "dilemma", "consent"] },
  { id: "library", label: "Case Library", hint: "Browse the open-access corpus", href: "/practice/library", group: "Tools", keywords: ["corpus", "pmc", "cases"] },
  { id: "record", label: "Your record", hint: "Supervision hours + weekly check-in", href: "/record", group: "Tools", keywords: ["hours", "signoff", "workload", "energy"] },
  { id: "passport", label: "Skills Passport", hint: "Competencies, evidenced", href: "/passport", group: "Tools", keywords: ["competency", "evidence"] },
  { id: "reflect", label: "Journal", href: "/reflect", group: "Nav", keywords: ["reflection", "diary"] },
  { id: "wall", label: "Cohort Wall", href: "/wall", group: "Nav", keywords: ["discussion", "posts"] },
];

const COURSES: PaletteEntry[] = [
  { id: "course1", label: "Pyschology Cohort 1", hint: "MSE lesson · 1 material", href: "/courses/b2bbbd69-a554-458c-9c27-611baaaf4ea9", group: "Courses", keywords: ["cohort", "mse lesson"] },
];

const ADMIN: PaletteEntry[] = [
  { id: "ad-overview", label: "Admin overview", href: "/admin", group: "Admin" },
  { id: "ad-students", label: "Students", href: "/admin/students", group: "Admin" },
  { id: "ad-courses", label: "Courses", href: "/admin/courses", group: "Admin" },
  { id: "ad-sim", label: "Sim session review", href: "/admin/sim-review", group: "Admin" },
  { id: "ad-checkins", label: "Cohort check-ins", href: "/admin/checkins", group: "Admin", keywords: ["aggregate"] },
  { id: "ad-infra", label: "Infrastructure", href: "/admin/infra", group: "Admin" },
];

export const STATIC_ENTRIES: PaletteEntry[] = [...TOOLS, ...COURSES, ...ADMIN];

/** Score a query against an entry: exact label hit > keyword hit > hint hit. */
export function scoreEntry(entry: PaletteEntry, query: string): number {
  const q = query.trim().toLowerCase();
  if (!q) return 0;
  const label = entry.label.toLowerCase();
  const hint = (entry.hint ?? "").toLowerCase();
  const kws = (entry.keywords ?? []).map((k) => k.toLowerCase());
  if (label === q) return 100;
  if (label.startsWith(q)) return 80;
  if (label.includes(q)) return 60;
  if (kws.some((k) => k.includes(q) || q.includes(k))) return 40;
  if (hint.includes(q)) return 20;
  return 0;
}

/** Search the static palette (case docs are added server-side). */
export function searchPalette(entries: PaletteEntry[], query: string): PaletteEntry[] {
  return entries
    .map((e) => ({ e, score: scoreEntry(e, query) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.e.label.localeCompare(b.e.label))
    .map((x) => x.e)
    .slice(0, 12);
}
