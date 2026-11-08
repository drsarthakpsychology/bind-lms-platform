/**
 * Search (the top bar box, ⌘K or "/"): the places in the menu, the tools
 * inside them, every Study module, every medicine, the Quick Reference and,
 * for admins, admin screens and students. Lexical, honest about what it
 * covers, and it works offline. Labels match the menu and the hub cards.
 */

import { BOARDS } from "@/lib/standing/boards";

export interface PaletteEntry {
  id: string;
  label: string;
  /** Short description shown under the label. */
  hint?: string;
  href: string;
  /** Group the result clusters under. */
  group: "Nav" | "Study" | "Medicines" | "Tools" | "Reference" | "Admin";
  /** Keywords beyond the label, searched too (e.g. "patient", "MSE"). */
  keywords?: string[];
  shortcut?: string;
  /** Feature switch(es): shown only when one of them is on ("unlocked"). */
  flag?: string | string[];
}

/**
 * Student places, in the order of the approved menu (plan section 8), then the
 * tools inside Practice, Games and Exam Prep. Labels match the menu exactly.
 */
const TOOLS: PaletteEntry[] = [
  { id: "home", label: "Home", hint: "Your next step and today's goal", href: "/dashboard", group: "Nav", keywords: ["dashboard", "start", "continue"] },
  { id: "study", label: "Study", hint: "Every module, topic by topic", href: "/study", group: "Nav", keywords: ["course", "chapter", "module", "read", "learn", "notes"], flag: "learn" },
  { id: "lectures", label: "Lectures", hint: "Your recorded classes", href: "/courses", group: "Nav", keywords: ["video", "class", "watch", "recording", "course"] },
  { id: "medicines", label: "Medicines", hint: "Look up any medicine", href: "/practice/medicines", group: "Nav", keywords: ["drug", "dose", "psychopharmacology", "side effects", "pharmacology"] },
  { id: "prep", label: "Exam Prep", hint: "Question bank, mock tests and interviews", href: "/prep", group: "Nav", keywords: ["exam", "cuet", "net", "ugc", "entrance", "mcq", "question bank", "mock"], flag: "learn" },
  { id: "smart", label: "Smart practice", hint: "Questions picked for you", href: "/prep/smart", group: "Tools", keywords: ["coach", "quiz", "quiz path", "today", "review", "revise", "due"], flag: "learn" },
  { id: "practice", label: "Practice", hint: "Clinical skills on real cases", href: "/practice", group: "Nav", keywords: ["clinical", "skills", "cases"] },
  { id: "games", label: "Games", hint: "Duel, Blitz, Ward Week and more", href: "/games", group: "Nav", keywords: ["game", "play", "duel", "blitz", "streak", "xp"], flag: "learn" },
  { id: "progress", label: "Progress", hint: "Strong topics, weak spots, certificate", href: "/progress", group: "Nav", keywords: ["strengths", "weak", "certificate", "mastery", "report"], flag: "learn" },
  { id: "doubts", label: "Doubts", hint: "Ask your faculty", href: "/doubts", group: "Nav", keywords: ["question", "ask", "help"] },
  { id: "achievements", label: "Achievements", hint: "Badges and certificates", href: "/achievements", group: "Nav", keywords: ["badge", "certificate"] },
  { id: "leaderboard", label: "Leaderboard", hint: "This week's league", href: "/leaderboard", group: "Nav", keywords: ["league", "weekly"] },
  { id: "reflect", label: "Journal", href: "/reflect", group: "Nav", keywords: ["reflection", "diary"], flag: "journal" },
  { id: "wall", label: "Wall", hint: "Posts from your batch", href: "/wall", group: "Nav", keywords: ["discussion", "posts", "cohort wall"] },
  { id: "journey", label: "My journey", hint: "Hours, lectures and level", href: "/journey", group: "Nav", keywords: ["timeline", "history"] },

  // Where saved things are found again.
  { id: "marks", label: "Bookmarks and notes", hint: "Sections you saved in Study", href: "/study#marks", group: "Nav", keywords: ["bookmark", "my notes", "saved", "highlight"], flag: "learn" },
  { id: "saved-q", label: "Saved questions", hint: "Exam Prep questions you saved", href: "/prep/saved", group: "Nav", keywords: ["saved", "bookmark", "starred", "wrong answers"], flag: "learn" },
  { id: "mocks", label: "Mock tests", hint: "Timed papers with marking", href: "/prep/mock", group: "Tools", keywords: ["mock", "paper", "timed", "test"], flag: "learn" },
  { id: "long", label: "Long answers", hint: "Written answers", href: "/prep/long", group: "Tools", keywords: ["essay", "written", "long answer", "short notes"], flag: "learn" },

  { id: "daily", label: "Daily case", hint: "One new patient a day", href: "/practice/daily", group: "Tools", keywords: ["case", "diagnose", "daily"], flag: "learn" },
  { id: "cr", label: "AI patient interview", hint: "Talk to an AI patient", href: "/practice/consulting-room", group: "Tools", keywords: ["sim", "patient", "voice", "interview", "ai patient", "consulting room"], flag: "consulting_room" },
  { id: "mse", label: "Mental state exam", hint: "Describe what you see before you label it", href: "/practice/mse", group: "Tools", keywords: ["mse", "mental status"], flag: "mse" },
  { id: "formulation", label: "Formulation", hint: "5P formulation", href: "/practice/formulation", group: "Tools", keywords: ["5p", "narrative"], flag: "formulation" },
  { id: "detective", label: "Clinic detective", hint: "Name it from the clues", href: "/practice/detective", group: "Tools", keywords: ["clues", "detective"], flag: "learn" },
  { id: "scenarios", label: "What would you do", hint: "Tricky moments with a patient", href: "/practice/scenarios", group: "Tools", keywords: ["scenario", "dilemma", "choice"], flag: "learn" },
  { id: "terms", label: "Say it clinically", hint: "Everyday words into case-sheet words", href: "/practice/terms", group: "Tools", keywords: ["terms", "words", "vocabulary", "language"], flag: "learn" },
  { id: "judgment", label: "Judgment calls", hint: "New facts change the odds", href: "/practice/judgment", group: "Tools", keywords: ["sct", "script concordance"], flag: "judgment" },
  { id: "clinic", label: "Two-minute clinic", hint: "One-liner, differential, next question", href: "/practice/detective?mode=clinic", group: "Tools", keywords: ["drill", "micro", "clinic"], flag: "two_minute_clinic" },
  { id: "osce", label: "OSCE stations", hint: "One task, out loud", href: "/practice/osce", group: "Tools", keywords: ["exam", "station"], flag: "osce" },
  { id: "landmark", label: "Landmark cases", hint: "Famous cases: what was believed, and what held up", href: "/practice/landmark", group: "Tools", keywords: ["cases", "history", "gage", "rosenhan", "milgram"], flag: "landmark" },
  { id: "ethics", label: "Ethics, law & referral", hint: "What to do, then the law behind it", href: "/practice/ethics", group: "Tools", keywords: ["law", "dilemma", "consent", "mha", "pocso", "rci", "referral"], flag: "ethics" },
  { id: "reference", label: "Quick Reference A to Z", hint: "Disorders, medicines and words", href: "/study/reference", group: "Tools", keywords: ["glossary", "dictionary", "a-z", "lookup", "criteria", "drug", "medicine", "meaning"], flag: "learn" },
  { id: "notes", label: "One-page summaries", hint: "A page per topic, for revision", href: "/study/notes", group: "Tools", keywords: ["notes", "summary", "revision", "mse", "schizophrenia", "bipolar", "depression"], flag: "learn" },
  { id: "record", label: "Your record", hint: "Supervision hours + weekly check-in", href: "/record", group: "Tools", keywords: ["hours", "signoff", "workload", "energy"], flag: ["supervision", "checkin"] },
  { id: "passport", label: "Skills Passport", hint: "Competencies, evidenced", href: "/passport", group: "Tools", keywords: ["competency", "evidence"], flag: "skills_passport" },
  { id: "board-quiz", label: BOARDS.quiz.label, hint: `${BOARDS.quiz.explainer} This week.`, href: BOARDS.quiz.href, group: "Nav", keywords: ["leaderboard", "ranking", "rank", "quiz", "games", "xp", "weekly"], flag: "learn" },
  { id: "board-overall", label: BOARDS.overall.label, hint: `${BOARDS.overall.explainer} All time.`, href: BOARDS.overall.href, group: "Nav", keywords: ["leaderboard", "rankings", "rank", "level", "points", "overall"] },
];

const ADMIN: PaletteEntry[] = [
  { id: "ad-overview", label: "Admin overview", href: "/admin", group: "Admin" },
  { id: "ad-students", label: "Students", href: "/admin/students", group: "Admin" },
  { id: "ad-courses", label: "Courses", href: "/admin/courses", group: "Admin" },
  { id: "ad-add-panel", label: "Add people…", hint: "Paste names or emails, pick a cohort, send login email", href: "?add=people", group: "Admin", keywords: ["add students", "add to cohort", "new student", "invite", "enrol", "bulk"] },
  { id: "ad-add", label: "Add students (upload a file)", href: "/admin/students/add?way=file", group: "Admin", keywords: ["import", "csv", "spreadsheet", "bulk"] },
  { id: "ad-emails", label: "Messages", href: "/admin/emails", group: "Admin", keywords: ["mail", "email", "inbox", "sent", "replies", "campaign", "send"] },
  { id: "ad-notify", label: "Send a notification", href: "/admin/emails?folder=notify", group: "Admin", keywords: ["bell", "announce", "message students", "nudge"] },
  { id: "ad-failed", label: "Failed emails (retry)", href: "/admin/emails?folder=failed", group: "Admin", keywords: ["retry", "bounced", "error"] },
  { id: "ad-credentials", label: "Credentials & certificates", href: "/admin/credentials", group: "Admin", keywords: ["certificate", "badge", "achievement", "roll number", "revoke"] },
  { id: "ad-inbox", label: "Reply to doubts", hint: "Inbox: doubts and replies waiting on you", href: "/admin/inbox", group: "Admin", keywords: ["inbox", "doubts", "answer", "reply", "concerns", "unanswered", "questions"] },
  { id: "ad-message", label: "Message…", hint: "Send a message to students (in-app, email optional)", href: "/admin/emails?folder=notify", group: "Admin", keywords: ["message", "notify", "tell", "announce", "send", "text students", "nudge"] },
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

export const STATIC_ENTRIES: PaletteEntry[] = [...TOOLS, ...ADMIN];

/**
 * What this person may be offered: no tool whose switch is off (it would open
 * "Not unlocked yet"), no section switched off for them, and admin screens
 * only for admins.
 */
export function visibleEntries(entries: PaletteEntry[], { flags = {}, blocked = () => false, isAdmin = false }: { flags?: Record<string, string>; blocked?: (href: string) => boolean; isAdmin?: boolean }): PaletteEntry[] {
  return entries.filter((e) => {
    if (e.group === "Admin" && !isAdmin) return false;
    if (e.flag && ![e.flag].flat().some((f) => flags[f] === "unlocked")) return false;
    return !(e.href.startsWith("/") && blocked(e.href.split(/[?#]/)[0]));
  });
}

/** Quick Reference entries (the index is built server-side in src/lib/reference/data.ts). */
export function referencePaletteEntries(items: { slug: string; label: string; kind: string; aliases: string[] }[]): PaletteEntry[] {
  const kind: Record<string, string> = { disorder: "Disorder", medicine: "Medicine", term: "Word" };
  return items.map((i) => ({ id: `ref-${i.slug}`, label: i.label, hint: `Quick Reference · ${kind[i.kind] ?? ""}`, href: `/study/reference/${i.slug}`, group: "Reference", keywords: i.aliases.map((a) => a.toLowerCase()) }));
}

/** Every Study module, found by its name or any of its section titles. */
export function modulePaletteEntries(mods: { id: string; num: number; title: string; sections: { title: string }[] }[]): PaletteEntry[] {
  return mods.map((m) => ({
    id: `mod-${m.id}`,
    label: m.title,
    hint: `Study · Module ${m.num}`,
    href: `/study/${m.id}`,
    group: "Study" as const,
    keywords: m.sections.map((s) => s.title.toLowerCase()).filter((t) => t.length > 3 && !/^(level check|check yourself|module test|q&a bank)/.test(t)),
    flag: "learn",
  }));
}

/** Every medicine, found by its name, brand names or class. */
export function medicinePaletteEntries(meds: { id: string; name: string; cls: string; brands: string[] }[]): PaletteEntry[] {
  return meds.map((m) => ({ id: `med-${m.id}`, label: m.name, hint: `Medicines · ${m.cls}`, href: `/practice/medicines/${m.id}`, group: "Medicines" as const, keywords: [...m.brands, m.cls].map((k) => k.toLowerCase()) }));
}

/** The few places offered before anything is typed: the menu, in order. */
export function startEntries(entries: PaletteEntry[]): PaletteEntry[] {
  return entries.filter((e) => e.group === "Nav").slice(0, 9);
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
