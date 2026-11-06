/**
 * Ask the Syllabus (⌘K) — command palette over the ACTUAL content in this
 * install: practice tools, courses/lessons, case-library docs, competencies,
 * and admin surfaces. Search is lexical (no embeddings needed), honest about
 * what it covers, and works fully offline.
 */

import { BOARDS } from "@/lib/standing/boards";

export interface PaletteEntry {
  id: string;
  label: string;
  /** Short description shown under the label. */
  hint?: string;
  href: string;
  /** Group the result clusters under. */
  group: "Tools" | "Reference" | "Courses" | "Cases" | "Competencies" | "Admin" | "Nav";
  /** Keywords beyond the label, searched too (e.g. "patient", "MSE"). */
  keywords?: string[];
  shortcut?: string;
}

const TOOLS: PaletteEntry[] = [
  { id: "cr", label: "Consulting Room", hint: "Interview a simulated patient", href: "/practice/consulting-room", group: "Tools", keywords: ["sim", "patient", "voice"] },
  { id: "judgment", label: "Judgment", hint: "90 seconds, one screen", href: "/practice/judgment", group: "Tools", keywords: ["sct", "script concordance"] },
  { id: "clinic", label: "Clinic", hint: "120s micro-drill", href: "/practice/two-minute-clinic", group: "Tools", keywords: ["drill", "micro"] },
  { id: "formulation", label: "Formulation", hint: "5P formulation", href: "/practice/formulation", group: "Tools", keywords: ["5p", "narrative"] },
  { id: "mse", label: "MSE", hint: "Mental status exam", href: "/practice/mse", group: "Tools", keywords: ["mental status"] },
  { id: "osce", label: "OSCE Stations", hint: "Timed stations", href: "/practice/osce", group: "Tools", keywords: ["exam", "station"] },
  { id: "study", label: "Notes", hint: "Your course: 22 modules, tests and activities", href: "/study", group: "Tools", keywords: ["course", "chapter", "module", "read", "learn"] },
  { id: "learn", label: "Games", hint: "Coach, quizzes, Detective, review", href: "/games", group: "Tools", keywords: ["cards", "review", "quiz", "game", "streak", "xp"] },
  { id: "ethics", label: "Ethics & Law", hint: "MHA 2017, POCSO, RCI scope", href: "/practice/ethics", group: "Tools", keywords: ["law", "dilemma", "consent"] },
  { id: "library", label: "Case Library", hint: "Browse the open-access corpus", href: "/practice/library", group: "Tools", keywords: ["corpus", "pmc", "cases"] },
  { id: "reference", label: "Quick Reference A–Z", hint: "Disorders, medicines and words in one minute each", href: "/study/reference", group: "Tools", keywords: ["glossary", "dictionary", "a-z", "lookup", "criteria", "drug", "medicine", "meaning"] },
  { id: "notes", label: "Notes", hint: "One-page revision notes", href: "/study/notes", group: "Tools", keywords: ["notes", "study", "summary", "revision", "mse", "schizophrenia", "bipolar", "depression"] },
  { id: "record", label: "Your record", hint: "Supervision hours + weekly check-in", href: "/record", group: "Tools", keywords: ["hours", "signoff", "workload", "energy"] },
  { id: "passport", label: "Skills Passport", hint: "Competencies, evidenced", href: "/passport", group: "Tools", keywords: ["competency", "evidence"] },
  { id: "reflect", label: "Journal", href: "/reflect", group: "Nav", keywords: ["reflection", "diary"] },
  { id: "wall", label: "Cohort Wall", href: "/wall", group: "Nav", keywords: ["discussion", "posts"] },
  { id: "board-quiz", label: BOARDS.quiz.label, hint: `${BOARDS.quiz.explainer} This week.`, href: BOARDS.quiz.href, group: "Nav", keywords: ["leaderboard", "ranking", "rank", "quiz", "games", "xp", "weekly"] },
  { id: "board-overall", label: BOARDS.overall.label, hint: `${BOARDS.overall.explainer} All time.`, href: BOARDS.overall.href, group: "Nav", keywords: ["leaderboard", "rankings", "rank", "level", "points", "overall"] },
];

const COURSES: PaletteEntry[] = [
  { id: "course1", label: "Pyschology Cohort 1", hint: "MSE lesson · 1 material", href: "/courses/b2bbbd69-a554-458c-9c27-611baaaf4ea9", group: "Courses", keywords: ["cohort", "mse lesson"] },
];

const ADMIN: PaletteEntry[] = [
  { id: "ad-overview", label: "Admin overview", href: "/admin", group: "Admin" },
  { id: "ad-students", label: "Students", href: "/admin/students", group: "Admin" },
  { id: "ad-courses", label: "Courses", href: "/admin/courses", group: "Admin" },
  { id: "ad-add", label: "Add students", href: "/admin/students/add", group: "Admin", keywords: ["new student", "invite", "import", "csv", "enrol", "bulk"] },
  { id: "ad-emails", label: "Messages", href: "/admin/emails", group: "Admin", keywords: ["mail", "email", "inbox", "sent", "replies", "campaign", "send"] },
  { id: "ad-notify", label: "Send a notification", href: "/admin/emails?folder=notify", group: "Admin", keywords: ["bell", "announce", "message students", "nudge"] },
  { id: "ad-failed", label: "Failed emails (retry)", href: "/admin/emails?folder=failed", group: "Admin", keywords: ["retry", "bounced", "error"] },
  { id: "ad-credentials", label: "Credentials & certificates", href: "/admin/credentials", group: "Admin", keywords: ["certificate", "badge", "achievement", "roll number", "revoke"] },
  { id: "ad-doubts", label: "Doubts & concerns", href: "/admin/doubts", group: "Admin", keywords: ["questions", "complaints", "reply"] },
  { id: "ad-cohorts", label: "Cohorts", href: "/admin/cohorts", group: "Admin", keywords: ["batch", "cohort 1", "cohort 2"] },
  { id: "ad-compose", label: "Compose email", href: "/admin/emails?folder=compose", group: "Admin", keywords: ["new email", "write", "send"] },
  { id: "ad-logins", label: "Logins (setup links)", href: "/admin/students/logins", group: "Admin", keywords: ["password", "credentials", "setup", "invite", "login"] },
  { id: "ad-activity", label: "Student activity", href: "/admin/activity", group: "Admin", keywords: ["hours", "time", "watched", "engagement", "ranking", "analytics", "tracker"] },
  { id: "ad-people", label: "People pipeline", href: "/admin/people", group: "Admin", keywords: ["crm", "leads", "follow up", "enquiry", "contacted", "pipeline"] },
  { id: "ad-flags", label: "What's live", href: "/admin/flags", group: "Admin", keywords: ["flags", "features", "tools"] },
  { id: "ad-sim", label: "Sim session review", href: "/admin/sim-review", group: "Admin" },
  { id: "ad-checkins", label: "Wellbeing check-ins (anonymous)", href: "/admin/checkins", group: "Admin", keywords: ["aggregate", "check-in"] },
  { id: "ad-infra", label: "Infrastructure", href: "/admin/infra", group: "Admin" },
];

export const STATIC_ENTRIES: PaletteEntry[] = [...TOOLS, ...COURSES, ...ADMIN];

/** Quick Reference entries (the index is built server-side in src/lib/reference/data.ts). */
export function referencePaletteEntries(items: { slug: string; label: string; kind: string; aliases: string[] }[]): PaletteEntry[] {
  const kind: Record<string, string> = { disorder: "Disorder", medicine: "Medicine", term: "Word" };
  return items.map((i) => ({ id: `ref-${i.slug}`, label: i.label, hint: `Quick Reference · ${kind[i.kind] ?? ""}`, href: `/study/reference/${i.slug}`, group: "Reference", keywords: i.aliases.map((a) => a.toLowerCase()) }));
}

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
