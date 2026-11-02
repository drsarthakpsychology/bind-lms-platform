/**
 * Learn engine — the rules behind XP, levels, streaks, badges, chests and
 * spaced review. Pure functions (no I/O), so every rule is unit-tested and the
 * same maths runs on the phone and the server.
 *
 * Design logic (docs/GAMIFICATION.md):
 * - Retrieval practice + spacing: every lesson is questions, not reading; a
 *   missed question goes into a Leitner review queue that comes back after
 *   1, 3, 7, 14, 30 days.
 * - Immediate feedback + combo: each correct answer pays out at once; a run of
 *   correct answers pays more (momentum).
 * - Variable reward: finishing a lesson opens a chest with a random bonus, so
 *   the end of every lesson carries a little suspense.
 * - Goal gradient: a small daily goal ring that is easy to close, and levels
 *   that get gradually further apart.
 * - Loss aversion, kindly: a daily streak protected by earned freezes, so one
 *   missed day doesn't wipe weeks of effort.
 */

import { istToday } from "@/lib/practice/streaks";
import type { CoachData } from "./adaptive";

export type LessonStats = { stars: 0 | 1 | 2 | 3; best: number; plays: number };
export type SrsCard = { box: number; due: string };

export type LearnState = {
  v: 1;
  xp: number;
  streak: { count: number; best: number; lastDay: string | null; freezes: number };
  daily: { day: string | null; xp: number; goalHit: boolean };
  dailyGoal: number;
  lessons: Record<string, LessonStats>;
  srs: Record<string, SrsCard>;
  badges: string[];
  bestCombo: number;
  answered: number;
  correct: number;
  chests: number;
  blitzBest: number;
  /** Coach: per-concept mastery and remembered confusions. */
  coach: CoachData;
  /** XP earned per day (last 90 days), for the progress chart. */
  history: Record<string, number>;
  /** Detective game best score. */
  detectiveBest: number;
  /** Notes opened: note id → day first read (YYYY-MM-DD, IST). */
  notesRead: Record<string, string>;
  /** The course (Study). */
  study: StudyProgress;
};

export type StudyProgress = {
  /** "module/section" → day the section was finished. */
  done: Record<string, string>;
  /** module → seconds of focused study time. */
  secs: Record<string, number>;
  /** module → best test score. */
  tests: Record<string, { best: number; total: number; day: string; tries: number }>;
  /** module → day the written practice (pass 3) was ticked. */
  written: Record<string, string>;
  /** module → activity id → day first done. */
  acts: Record<string, Record<string, string>>;
  /** Where the student last was, for "Continue". */
  last: { module: string; section: string } | null;
};

export function emptyStudy(): StudyProgress {
  return { done: {}, secs: {}, tests: {}, written: {}, acts: {}, last: null };
}

export const DAILY_GOALS = [20, 40, 60] as const;
export const INTERVALS = [0, 1, 3, 7, 14, 30]; // days, indexed by Leitner box (1–5)
export const MAX_FREEZES = 2;

export function emptyState(): LearnState {
  return {
    v: 1,
    xp: 0,
    streak: { count: 0, best: 0, lastDay: null, freezes: 0 },
    daily: { day: null, xp: 0, goalHit: false },
    dailyGoal: 40,
    lessons: {},
    srs: {},
    badges: [],
    bestCombo: 0,
    answered: 0,
    correct: 0,
    chests: 0,
    blitzBest: 0,
    coach: { concepts: {}, confusions: {} },
    history: {},
    detectiveBest: 0,
    notesRead: {},
    study: emptyStudy(),
  };
}

/** Accept anything (old/partial JSON from storage) and return a valid state. */
export function normalise(raw: unknown): LearnState {
  const base = emptyState();
  if (!raw || typeof raw !== "object") return base;
  const r = raw as Partial<LearnState>;
  return {
    ...base,
    ...r,
    v: 1,
    streak: { ...base.streak, ...(r.streak ?? {}) },
    daily: { ...base.daily, ...(r.daily ?? {}) },
    lessons: { ...(r.lessons ?? {}) },
    srs: { ...(r.srs ?? {}) },
    badges: Array.isArray(r.badges) ? r.badges.filter((b) => typeof b === "string") : [],
    coach: {
      concepts: { ...(r.coach?.concepts ?? {}) },
      confusions: { ...(r.coach?.confusions ?? {}) },
    },
    history: { ...(r.history ?? {}) },
    study: normaliseStudy(r.study),
    notesRead: Object.fromEntries(Object.entries(r.notesRead && typeof r.notesRead === "object" ? r.notesRead : {}).filter(([k, v]) => typeof k === "string" && typeof v === "string")),
  };
}

function strMap(x: unknown): Record<string, string> {
  if (!x || typeof x !== "object") return {};
  return Object.fromEntries(Object.entries(x).filter(([, v]) => typeof v === "string")) as Record<string, string>;
}

function normaliseStudy(raw: unknown): StudyProgress {
  const base = emptyStudy();
  if (!raw || typeof raw !== "object") return base;
  const r = raw as Partial<StudyProgress>;
  const secs = Object.fromEntries(Object.entries(r.secs ?? {}).filter(([, v]) => typeof v === "number" && v >= 0)) as Record<string, number>;
  const tests = Object.fromEntries(
    Object.entries(r.tests ?? {}).filter(([, v]) => v && typeof v === "object" && typeof v.best === "number" && typeof v.total === "number"),
  ) as StudyProgress["tests"];
  const acts = Object.fromEntries(Object.entries(r.acts ?? {}).map(([k, v]) => [k, strMap(v)]));
  const last = r.last && typeof r.last.module === "string" && typeof r.last.section === "string" ? { module: r.last.module, section: r.last.section } : null;
  return { done: strMap(r.done), secs, tests, written: strMap(r.written), acts, last };
}

/** Award XP outside a quiz (finishing a section, a test, a written task): daily goal, streak, history. */
export function gainXp(s: LearnState, amount: number, today: string): LearnState {
  if (amount <= 0) return s;
  const daily = s.daily.day === today ? { ...s.daily } : { day: today, xp: 0, goalHit: false };
  daily.xp += amount;
  let bonus = 0;
  if (!daily.goalHit && daily.xp >= s.dailyGoal) {
    daily.goalHit = true;
    bonus = XP.goal;
  }
  const total = amount + bonus;
  return {
    ...s,
    xp: s.xp + total,
    daily,
    streak: touchStreak(s.streak, today).streak,
    history: trimHistory({ ...s.history, [today]: (s.history[today] ?? 0) + total }, today),
  };
}

export const STUDY_XP = { section: 10, written: 20, testPerRight: 5, activity: 5 } as const;

export function studyKey(module: string, section: string): string {
  return `${module}/${section}`;
}

/** Finish a section (first time only earns XP). */
export function finishSection(s: LearnState, module: string, section: string, today: string): LearnState {
  const k = studyKey(module, section);
  const study = { ...s.study, last: { module, section } };
  if (s.study.done[k]) return { ...s, study };
  const next = { ...s, study: { ...study, done: { ...s.study.done, [k]: today } } };
  return gainXp(next, STUDY_XP.section, today);
}

/** Remember where the student is (for "Continue"). */
export function visitSection(s: LearnState, module: string, section: string): LearnState {
  const l = s.study.last;
  if (l && l.module === module && l.section === section) return s;
  return { ...s, study: { ...s.study, last: { module, section } } };
}

/** Add focused study seconds to a module (capped per call so a forgotten tab can't inflate it). */
export function addStudySeconds(s: LearnState, module: string, seconds: number): LearnState {
  const add = Math.max(0, Math.min(seconds, 120));
  if (!add) return s;
  return { ...s, study: { ...s.study, secs: { ...s.study.secs, [module]: (s.study.secs[module] ?? 0) + add } } };
}

/** Record a module test. XP is paid only for improvement on the best score. */
export function recordTest(s: LearnState, module: string, right: number, total: number, today: string): LearnState {
  const prev = s.study.tests[module];
  const best = Math.max(right, prev?.best ?? 0);
  const gained = Math.max(0, right - (prev?.best ?? 0)) * STUDY_XP.testPerRight;
  const next = { ...s, study: { ...s.study, tests: { ...s.study.tests, [module]: { best, total, day: today, tries: (prev?.tries ?? 0) + 1 } } } };
  return gainXp(next, gained, today);
}

/** Tick the on-paper practice for a module. */
export function markWritten(s: LearnState, module: string, today: string): LearnState {
  if (s.study.written[module]) return s;
  return gainXp({ ...s, study: { ...s.study, written: { ...s.study.written, [module]: today } } }, STUDY_XP.written, today);
}

/** Tick an activity inside a module (opening it counts; the activity pays its own XP). */
export function markActivity(s: LearnState, module: string, activity: string, today: string): LearnState {
  if (s.study.acts[module]?.[activity]) return s;
  return { ...s, study: { ...s.study, acts: { ...s.study.acts, [module]: { ...(s.study.acts[module] ?? {}), [activity]: today } } } };
}

/** Mark a note as read (keeps the first day it was read). Returns the same object if nothing changed. */
export function markNoteRead(s: LearnState, id: string, today: string): LearnState {
  if (s.notesRead[id]) return s;
  return { ...s, notesRead: { ...s.notesRead, [id]: today } };
}

/* ------------------------------------------------------------------ dates */
export function addDays(day: string, n: number): string {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
export function daysBetween(a: string, b: string): number {
  return Math.round((new Date(`${b}T00:00:00Z`).getTime() - new Date(`${a}T00:00:00Z`).getTime()) / 86400000);
}
export { istToday };

/* ----------------------------------------------------------------- levels */
export const LEVELS = [
  { at: 0, title: "Curious Mind" },
  { at: 100, title: "Observer" },
  { at: 250, title: "Note-taker" },
  { at: 450, title: "Intern" },
  { at: 700, title: "Trainee" },
  { at: 1000, title: "Case Builder" },
  { at: 1400, title: "Formulator" },
  { at: 1900, title: "Junior Clinician" },
  { at: 2500, title: "Clinician" },
  { at: 3200, title: "Senior Clinician" },
  { at: 4000, title: "Supervisor" },
  { at: 5000, title: "Consultant" },
] as const;

export function levelFor(xp: number) {
  let i = 0;
  while (i + 1 < LEVELS.length && xp >= LEVELS[i + 1].at) i++;
  const cur = LEVELS[i];
  const next = LEVELS[i + 1];
  const span = next ? next.at - cur.at : 1;
  return {
    level: i + 1,
    title: cur.title,
    nextTitle: next?.title ?? null,
    intoLevel: xp - cur.at,
    toNext: next ? next.at - xp : 0,
    pct: next ? Math.min(100, Math.round(((xp - cur.at) / span) * 100)) : 100,
  };
}

/* ----------------------------------------------------------------- streak */
/** Today's streak after showing up. Freezes cover missed days (earned every 7). */
export function touchStreak(s: LearnState["streak"], today: string) {
  const out = { ...s };
  let extended = false;
  let usedFreeze = 0;
  if (s.lastDay === today) return { streak: out, extended, usedFreeze };
  const gap = s.lastDay ? daysBetween(s.lastDay, today) : Infinity;
  if (gap === 1) out.count = s.count + 1;
  else if (gap > 1 && gap - 1 <= s.freezes) {
    usedFreeze = gap - 1;
    out.freezes = s.freezes - usedFreeze;
    out.count = s.count + 1;
  } else out.count = 1;
  extended = true;
  out.lastDay = today;
  if (out.count > 0 && out.count % 7 === 0) out.freezes = Math.min(MAX_FREEZES, out.freezes + 1);
  out.best = Math.max(out.best, out.count);
  return { streak: out, extended, usedFreeze };
}

/** Streak as the user sees it today (0 if it has already lapsed). */
export function liveStreak(s: LearnState["streak"], today: string): number {
  if (!s.lastDay) return 0;
  const gap = daysBetween(s.lastDay, today);
  return gap <= 1 + s.freezes ? s.count : 0;
}

/* -------------------------------------------------------------------- srs */
export function dueItems(state: LearnState, today: string): string[] {
  return Object.entries(state.srs)
    .filter(([, c]) => c.due <= today)
    .sort((a, b) => a[1].box - b[1].box || a[1].due.localeCompare(b[1].due))
    .map(([id]) => id);
}

export function reviewCard(card: SrsCard | undefined, correct: boolean, today: string): SrsCard | null {
  if (!correct) return { box: 1, due: addDays(today, INTERVALS[1]) };
  if (!card) return null; // first-time correct answers don't need review
  const box = card.box + 1;
  if (box > 5) return null; // graduated
  return { box, due: addDays(today, INTERVALS[box]) };
}

/* -------------------------------------------------------------------- xp */
export const XP = { correct: 10, comboStep: 1, comboCap: 5, perfect: 15, firstClear: 10, goal: 10 } as const;

/** XP for one correct answer at a given combo (1 = first in a row). */
export function answerXp(combo: number): number {
  return XP.correct + Math.min(XP.comboCap, Math.max(0, combo - 2) * XP.comboStep);
}

export function starsFor(correct: number, total: number): 0 | 1 | 2 | 3 {
  if (total === 0) return 0;
  const pct = correct / total;
  return pct >= 1 ? 3 : pct >= 0.8 ? 2 : pct >= 0.5 ? 1 : 0;
}

/** Chest bonus: 5–25 XP, with an occasional jackpot. `roll` is 0..1. */
export function chestBonus(roll: number): { xp: number; jackpot: boolean } {
  if (roll > 0.92) return { xp: 50, jackpot: true };
  return { xp: 5 + Math.round(roll * 20), jackpot: false };
}

/* ----------------------------------------------------------------- badges */
export const BADGES: Record<string, { title: string; text: string; icon: string }> = {
  first_lesson: { title: "First steps", text: "Finished your first lesson", icon: "🐾" },
  perfect: { title: "Flawless", text: "A lesson with no mistakes", icon: "✦" },
  combo_8: { title: "On fire", text: "8 right in a row", icon: "🔥" },
  combo_15: { title: "Unstoppable", text: "15 right in a row", icon: "⚡" },
  streak_3: { title: "Habit forming", text: "3-day streak", icon: "③" },
  streak_7: { title: "One full week", text: "7-day streak", icon: "⑦" },
  streak_30: { title: "Clinician's discipline", text: "30-day streak", icon: "★" },
  goal_5: { title: "Goal getter", text: "Hit your daily goal 5 times", icon: "◎" },
  review_25: { title: "Memory builder", text: "25 review answers right", icon: "↻" },
  blitz_15: { title: "Quick thinker", text: "15+ in a 60-second blitz", icon: "⏱" },
  xp_1000: { title: "Four figures", text: "1,000 XP earned", icon: "Ⅿ" },
  unit_master: { title: "Unit master", text: "3 stars on every lesson in a unit", icon: "♛" },
};

function addBadge(list: string[], id: string, fresh: string[]) {
  if (!list.includes(id)) {
    list.push(id);
    fresh.push(id);
  }
}

function trimHistory(h: Record<string, number>, today: string): Record<string, number> {
  const cutoff = addDays(today, -90);
  return Object.fromEntries(Object.entries(h).filter(([d]) => d >= cutoff));
}

/* ---------------------------------------------------------- finish lesson */
export type LessonResult = {
  lessonId: string;
  kind: "lesson" | "review" | "blitz" | "coach" | "detective";
  /** Bonus XP already earned inside the game (detective clue points). */
  bonusXp?: number;
  answers: { id: string; correct: boolean }[];
  maxCombo: number;
  /** Lesson ids of the unit this lesson belongs to (for unit_master). */
  unitLessons?: string[];
  reviewRight?: number;
};

export type Payout = {
  xp: number;
  lines: { label: string; xp: number }[];
  stars: 0 | 1 | 2 | 3;
  chest: { xp: number; jackpot: boolean } | null;
  newBadges: string[];
  levelUp: { from: number; to: number; title: string } | null;
  streak: { count: number; extended: boolean; usedFreeze: number };
  goalHit: boolean;
};

export function finishLesson(prev: LearnState, r: LessonResult, today: string, roll: number): { state: LearnState; payout: Payout } {
  const s = normalise(prev);
  const lines: Payout["lines"] = [];
  const fresh: string[] = [];
  const badges = [...s.badges];
  const right = r.answers.filter((a) => a.correct).length;
  const total = r.answers.length;

  // Answer XP (combo already reflected per answer by the player).
  let combo = 0;
  let answerSum = 0;
  for (const a of r.answers) {
    combo = a.correct ? combo + 1 : 0;
    if (a.correct) answerSum += answerXp(combo);
  }
  if (answerSum) lines.push({ label: `${right} correct`, xp: answerSum });
  if (r.bonusXp) lines.push({ label: "Detective points", xp: r.bonusXp });

  const stars = r.kind === "lesson" ? starsFor(right, total) : 0;
  const prevStats = s.lessons[r.lessonId];
  if (r.kind === "lesson" && total > 0 && right === total) lines.push({ label: "Perfect lesson", xp: XP.perfect });
  if (r.kind === "lesson" && !prevStats && stars > 0) lines.push({ label: "First clear", xp: XP.firstClear });

  const chest = (r.kind === "lesson" && stars > 0) || (r.kind === "coach" && right > 0) ? chestBonus(roll) : null;
  if (chest) lines.push({ label: chest.jackpot ? "Jackpot chest!" : "Chest", xp: chest.xp });

  // Daily goal (paid once per day).
  const daily = s.daily.day === today ? { ...s.daily } : { day: today, xp: 0, goalHit: false };
  const beforeGoal = lines.reduce((a, l) => a + l.xp, 0);
  daily.xp += beforeGoal;
  let goalHit = false;
  if (!daily.goalHit && daily.xp >= s.dailyGoal) {
    daily.goalHit = true;
    goalHit = true;
    lines.push({ label: "Daily goal", xp: XP.goal });
  }

  const gained = lines.reduce((a, l) => a + l.xp, 0);
  const before = levelFor(s.xp);
  const xp = s.xp + gained;
  const after = levelFor(xp);

  const st = total > 0 ? touchStreak(s.streak, today) : { streak: s.streak, extended: false, usedFreeze: 0 };

  // Spaced review.
  const srs = { ...s.srs };
  for (const a of r.answers) {
    const next = reviewCard(srs[a.id], a.correct, today);
    if (next) srs[a.id] = next;
    else delete srs[a.id];
  }

  const lessons = { ...s.lessons };
  if (r.kind === "lesson") {
    lessons[r.lessonId] = {
      stars: Math.max(stars, prevStats?.stars ?? 0) as 0 | 1 | 2 | 3,
      best: Math.max(right, prevStats?.best ?? 0),
      plays: (prevStats?.plays ?? 0) + 1,
    };
  }

  const next: LearnState = {
    ...s,
    xp,
    streak: st.streak,
    daily,
    lessons,
    srs,
    bestCombo: Math.max(s.bestCombo, r.maxCombo),
    answered: s.answered + total,
    correct: s.correct + right,
    chests: s.chests + (chest ? 1 : 0),
    blitzBest: r.kind === "blitz" ? Math.max(s.blitzBest, right) : s.blitzBest,
    detectiveBest: r.kind === "detective" ? Math.max(s.detectiveBest, r.bonusXp ?? 0) : s.detectiveBest,
    badges,
    history: trimHistory({ ...s.history, [today]: (s.history[today] ?? 0) + gained }, today),
  };

  // Badges.
  if (r.kind === "lesson" && stars > 0) addBadge(badges, "first_lesson", fresh);
  if (r.kind === "lesson" && total > 0 && right === total) addBadge(badges, "perfect", fresh);
  if (next.bestCombo >= 8) addBadge(badges, "combo_8", fresh);
  if (next.bestCombo >= 15) addBadge(badges, "combo_15", fresh);
  if (next.streak.count >= 3) addBadge(badges, "streak_3", fresh);
  if (next.streak.count >= 7) addBadge(badges, "streak_7", fresh);
  if (next.streak.count >= 30) addBadge(badges, "streak_30", fresh);
  if (r.kind === "blitz" && right >= 15) addBadge(badges, "blitz_15", fresh);
  if (next.xp >= 1000) addBadge(badges, "xp_1000", fresh);
  if (r.kind === "review" && (r.reviewRight ?? right) >= 25) addBadge(badges, "review_25", fresh);
  if (r.unitLessons?.length && r.unitLessons.every((id) => lessons[id]?.stars === 3)) addBadge(badges, "unit_master", fresh);
  const goalDays = (s.badges.filter((b) => b === "goal_tick").length || 0) + (goalHit ? 1 : 0);
  if (goalDays >= 5) addBadge(badges, "goal_5", fresh);
  if (goalHit) badges.push("goal_tick"); // hidden counter, not shown as a badge

  return {
    state: next,
    payout: {
      xp: gained,
      lines,
      stars,
      chest,
      newBadges: fresh,
      levelUp: after.level > before.level ? { from: before.level, to: after.level, title: after.title } : null,
      streak: { count: st.streak.count, extended: st.extended, usedFreeze: st.usedFreeze },
      goalHit,
    },
  };
}
