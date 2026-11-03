/**
 * Revise — one short list of what to revisit today.
 *
 * It does not invent new schedules. It reads the ones that already exist and
 * puts them in one place:
 *   - Quiz review queue (Leitner boxes, `dueItems` in learn/engine.ts)
 *   - Module re-tests after 3, 7 and 21 days (`RETEST_GAPS` in study/plan.ts)
 *   - Coach concepts the student got wrong (`state.coach`, learn/adaptive.ts)
 *   - Psychology Lab re-checks (`labRechecksDue` in learn/engine.ts)
 *   - Module test scores and how long ago a finished module was last touched
 *
 * Priority rules (higher goes first):
 *   100      Quiz review due. Missed answers are slipping right now, and the
 *            round is short (the player takes at most 12).
 *   90+      Module re-test due. +5 if the best score is under 70%, +1 per day
 *            overdue (max +7).
 *   80+      Coach concepts missed and due to relearn, one item per topic
 *            area. +1 per concept (max +5).
 *   70+      Lab re-check due. +1 per day overdue (max +7). Only when the Lab
 *            is open to this student.
 *   60+      Weak module test (best under 70%) with no re-test due today:
 *            go over the module's notes. +1 per 5 points under 70%.
 *   45+      Coach concepts due for an ordinary review (no misses), at least
 *            3 in one area. +1 per concept (max +5).
 *   30+      Refresh a finished module not touched for 14+ days. +1 per extra
 *            week (max +10).
 * A module gives at most one item (re-test beats weak score beats refresh).
 *
 * Building "today":
 *   - Sort by priority, then interleave: the next item is the best one whose
 *     topic differs from the one before it. Same topic twice in a row only
 *     when nothing else is left; never three in a row; at most 2 per topic.
 *   - Stop at 6 items or about 20 minutes (the first item always goes in).
 *   - Anything due that doesn't fit goes to "later" as "If you have time".
 * "Later this week" also lists re-tests, lab re-checks and quiz reviews that
 * fall due in the next 7 days.
 *
 * "Last touched" for a module is the latest day any part of it was finished
 * (section, test, written task, activity) or its note was first opened.
 * Re-reading is not tracked separately, so a refresh is suggested from that.
 *
 * Pure: no I/O, no clock. Pass `today` (IST YYYY-MM-DD).
 */

import { addDays, daysBetween, dueItems, labRechecksDue, studyKey, type LearnState } from "@/lib/learn/engine";
import { topConfusions } from "@/lib/learn/adaptive";
import { DOMAINS, conceptById, type Domain } from "@/lib/learn/concepts";
import { labEntry } from "@/lib/lab/entries";
import { RETEST_GAPS } from "@/lib/study/plan";
import type { StudyModule } from "@/lib/study/types";

/** The little a revision plan needs to know about a module. */
export type ReviseModule = {
  id: string;
  title: string;
  noteId?: string;
  /** Reading section ids (not the test). */
  reading: string[];
  /** Id of the test section, if the module has one. */
  test: string | null;
};

export function toReviseModule(m: StudyModule): ReviseModule {
  return {
    id: m.id,
    title: m.title,
    ...(m.noteId ? { noteId: m.noteId } : {}),
    reading: m.sections.filter((s) => !s.isTest).map((s) => s.id),
    test: m.sections.find((s) => s.isTest)?.id ?? null,
  };
}

export type ReviseKind = "review" | "retest" | "coach" | "lab" | "weak-test" | "refresh";

export type ReviseItem = {
  id: string;
  kind: ReviseKind;
  /** Used for interleaving: module id, coach area, "quiz" or "lab". */
  topic: string;
  title: string;
  /** One plain line. */
  why: string;
  href: string;
  minutes: number;
  priority: number;
};

export type LaterItem = ReviseItem & { when: string; due: string };

export type RevisionPlan = {
  /** new = nothing studied yet; clear = nothing due today; ready = there is a list. */
  status: "new" | "clear" | "ready";
  today: ReviseItem[];
  minutes: number;
  later: LaterItem[];
  week: {
    /** Last 7 days, oldest first; true when the student earned XP that day. */
    days: { day: string; active: boolean }[];
    /** Modules with any study activity in the last 7 days. */
    modules: number;
  };
};

export const REVISE = {
  maxItems: 6,
  capMinutes: 20,
  maxPerTopic: 2,
  weakPct: 0.7,
  staleDays: 14,
  reviewMax: 12,
  laterMax: 5,
} as const;

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function plural(n: number, one: string, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`;
}

function whenLabel(today: string, due: string): string {
  const d = daysBetween(today, due);
  if (d <= 0) return "If you have time";
  if (d === 1) return "Tomorrow";
  return WEEKDAYS[new Date(`${due}T00:00:00Z`).getUTCDay()];
}

function reviewMinutes(n: number) {
  return Math.max(2, Math.ceil(Math.min(n, REVISE.reviewMax) / 2));
}

function noteHref(m: ReviseModule) {
  return m.noteId ? `/study/notes/${m.noteId}` : `/study/${m.id}`;
}

/** Latest day any part of a module was finished, or null if never. */
export function lastTouched(state: LearnState, m: ReviseModule): string | null {
  const p = state.study;
  const days: string[] = [];
  for (const s of m.reading) {
    const d = p.done[studyKey(m.id, s)];
    if (d) days.push(d);
  }
  if (m.test && p.done[studyKey(m.id, m.test)]) days.push(p.done[studyKey(m.id, m.test)]);
  if (p.tests[m.id]?.day) days.push(p.tests[m.id].day);
  if (p.written[m.id]) days.push(p.written[m.id]);
  days.push(...Object.values(p.acts[m.id] ?? {}));
  if (m.noteId && state.notesRead[m.noteId]) days.push(state.notesRead[m.noteId]);
  return days.length ? days.sort().at(-1)! : null;
}

/** Day the next module re-test falls due, or null. Same rule as study/plan.ts `retestDue`. */
export function nextRetest(state: LearnState, m: ReviseModule): string | null {
  const t = state.study.tests[m.id];
  if (!t || !m.test) return null;
  const gap = RETEST_GAPS[t.tries - 1];
  return gap ? addDays(t.day, gap) : null;
}

function isNew(state: LearnState): boolean {
  return (
    Object.keys(state.study.done).length === 0 &&
    Object.keys(state.study.tests).length === 0 &&
    Object.keys(state.lessons).length === 0 &&
    Object.keys(state.srs).length === 0 &&
    Object.keys(state.coach.concepts).length === 0 &&
    Object.keys(state.lab).length === 0
  );
}

/* ------------------------------------------------------------ candidates */

function moduleItems(state: LearnState, today: string, modules: ReviseModule[]): { now: ReviseItem[]; soon: LaterItem[] } {
  const now: ReviseItem[] = [];
  const soon: LaterItem[] = [];
  const weekEnd = addDays(today, 7);
  for (const m of modules) {
    const t = state.study.tests[m.id];
    const pct = t && t.total > 0 ? t.best / t.total : null;
    const weak = pct !== null && pct < REVISE.weakPct;
    const due = nextRetest(state, m);
    const gap = t ? RETEST_GAPS[t.tries - 1] : undefined;

    if (due && m.test && due <= today) {
      const overdue = Math.min(7, Math.max(0, daysBetween(due, today)));
      now.push({
        id: `retest:${m.id}`,
        kind: "retest",
        topic: m.id,
        title: `Re-test: ${m.title}`,
        why: weak ? `Your best so far is ${t!.best}/${t!.total}. Try again now it has settled.` : `Your ${gap}-day re-test. Testing again is what makes it stick.`,
        href: `/study/${m.id}/${m.test}`,
        minutes: 10,
        priority: 90 + (weak ? 5 : 0) + overdue,
      });
      continue;
    }
    if (due && m.test && due <= weekEnd) {
      soon.push({
        id: `retest:${m.id}`,
        kind: "retest",
        topic: m.id,
        title: `Re-test: ${m.title}`,
        why: `Your ${gap}-day re-test.`,
        href: `/study/${m.id}/${m.test}`,
        minutes: 10,
        priority: 90,
        due,
        when: whenLabel(today, due),
      });
    }
    if (weak) {
      now.push({
        id: `weak:${m.id}`,
        kind: "weak-test",
        topic: m.id,
        title: `Go over ${m.title}`,
        why: due && due <= weekEnd ? `Your best test score is ${t!.best}/${t!.total}. Go over it before the re-test.` : `Your best test score is ${t!.best}/${t!.total}. A quick look will lift it.`,
        href: noteHref(m),
        minutes: 8,
        priority: 60 + Math.floor(Math.round((REVISE.weakPct - pct!) * 100) / 5),
      });
      continue;
    }
    const finished = m.reading.length > 0 && m.reading.every((s) => state.study.done[studyKey(m.id, s)]);
    const last = finished ? lastTouched(state, m) : null;
    if (last) {
      const age = daysBetween(last, today);
      if (age >= REVISE.staleDays) {
        now.push({
          id: `refresh:${m.id}`,
          kind: "refresh",
          topic: m.id,
          title: `Refresh: ${m.title}`,
          why: `Last opened ${age} days ago. A short look keeps it fresh.`,
          href: noteHref(m),
          minutes: 6,
          priority: 30 + Math.min(10, Math.floor((age - REVISE.staleDays) / 7)),
        });
      }
    }
  }
  return { now, soon };
}

function coachItems(state: LearnState, today: string): ReviseItem[] {
  const byDomain = new Map<Domain, { relearn: string[]; due: string[] }>();
  for (const [id, s] of Object.entries(state.coach.concepts)) {
    const c = conceptById(id);
    if (!c || s.due > today) continue;
    const g = byDomain.get(c.domain) ?? { relearn: [], due: [] };
    if (s.teach && s.wrong > 0) g.relearn.push(id);
    else if (!s.teach && s.lvl < 5) g.due.push(id);
    byDomain.set(c.domain, g);
  }
  const pairs = topConfusions(state.coach, 50);
  const out: ReviseItem[] = [];
  for (const [domain, g] of byDomain) {
    const area = DOMAINS.find((d) => d.id === domain)?.title ?? domain;
    const href = `/games/coach?domain=${domain}`;
    if (g.relearn.length) {
      const pair = pairs.find((p) => p.a.domain === domain && p.b.domain === domain && (g.relearn.includes(p.a.id) || g.relearn.includes(p.b.id)));
      out.push({
        id: `coach:${domain}`,
        kind: "coach",
        topic: `coach:${domain}`,
        title: pair ? `${pair.a.term} vs ${pair.b.term}` : `Coach: ${area}`,
        why: pair ? `You mixed these up ${plural(pair.times, "time")}. Coach will sort them out.` : `${plural(g.relearn.length, "concept")} you missed. Coach brings them back.`,
        href,
        minutes: 5,
        priority: 80 + Math.min(5, g.relearn.length),
      });
    } else if (g.due.length >= 3) {
      out.push({
        id: `coach:${domain}`,
        kind: "coach",
        topic: `coach:${domain}`,
        title: `Coach: ${area}`,
        why: `${plural(g.due.length, "concept")} due for a quick check.`,
        href,
        minutes: 5,
        priority: 45 + Math.min(5, g.due.length),
      });
    }
  }
  return out;
}

function labItems(state: LearnState, today: string): { now: ReviseItem[]; soon: LaterItem[] } {
  const now: ReviseItem[] = labRechecksDue(state, today).map((id) => {
    const r = state.lab[id];
    const entry = labEntry(id);
    const title = entry?.title ?? id;
    return {
      id: `lab:${id}`,
      kind: "lab" as const,
      topic: "lab",
      title: `Re-check: ${title}`,
      why: r.check ? `Last time you got ${r.check.right}/${r.check.total}. See what stuck.` : "See what stuck.",
      href: entry?.recheckHref ?? `/games/lab`,
      minutes: 3,
      priority: 70 + Math.min(7, Math.max(0, daysBetween(r.recheck.due, today))),
    };
  });
  const weekEnd = addDays(today, 7);
  const soon: LaterItem[] = Object.entries(state.lab)
    .filter(([, r]) => r.check !== null && r.recheck.due > today && r.recheck.due <= weekEnd)
    .map(([id, r]) => ({
      id: `lab:${id}`,
      kind: "lab" as const,
      topic: "lab",
      title: `Re-check: ${labEntry(id)?.title ?? id}`,
      why: "Lab check questions come back.",
      href: labEntry(id)?.href ?? `/games/lab`,
      minutes: 3,
      priority: 70,
      due: r.recheck.due,
      when: whenLabel(today, r.recheck.due),
    }));
  return { now, soon };
}

function reviewItems(state: LearnState, today: string): { now: ReviseItem[]; soon: LaterItem[] } {
  const n = dueItems(state, today).length;
  const now: ReviseItem[] = n
    ? [
        {
          id: "review",
          kind: "review",
          topic: "quiz",
          title: `Review ${plural(Math.min(n, REVISE.reviewMax), "quiz question")}`,
          why: "Ones you missed before. Today is the day they come back.",
          href: "/games/play?mode=review",
          minutes: reviewMinutes(n),
          priority: 100,
        },
      ]
    : [];
  const weekEnd = addDays(today, 7);
  const upcoming = Object.values(state.srs).filter((c) => c.due > today && c.due <= weekEnd);
  if (!upcoming.length) return { now, soon: [] };
  const first = upcoming.map((c) => c.due).sort()[0];
  return {
    now,
    soon: [
      {
        id: "review-soon",
        kind: "review",
        topic: "quiz",
        title: `${plural(upcoming.length, "quiz question")} ${upcoming.length === 1 ? "comes" : "come"} back`,
        why: "Missed answers, spaced out.",
        href: "/games/play?mode=review",
        minutes: reviewMinutes(upcoming.length),
        priority: 100,
        due: first,
        when: whenLabel(today, first),
      },
    ],
  };
}

/* ------------------------------------------------------------ ordering */

/** Interleave by topic and fill up to the item and minute caps. Returns [today, leftover]. */
export function pickToday(candidates: ReviseItem[]): [ReviseItem[], ReviseItem[]] {
  const pool = [...candidates].sort((a, b) => b.priority - a.priority || a.id.localeCompare(b.id));
  const picked: ReviseItem[] = [];
  let used = 0;
  const count = (topic: string) => picked.filter((p) => p.topic === topic).length;
  while (picked.length < REVISE.maxItems && pool.length) {
    const n = picked.length;
    const prev = picked[n - 1]?.topic;
    const prev2 = picked[n - 2]?.topic;
    const ok = (c: ReviseItem) => (n === 0 || used + c.minutes <= REVISE.capMinutes) && count(c.topic) < REVISE.maxPerTopic;
    const choice = pool.find((c) => ok(c) && c.topic !== prev) ?? pool.find((c) => ok(c) && !(c.topic === prev && c.topic === prev2));
    if (!choice) break;
    picked.push(choice);
    used += choice.minutes;
    pool.splice(pool.indexOf(choice), 1);
  }
  return [picked, pool];
}

function weekOf(state: LearnState, today: string, modules: ReviseModule[]): RevisionPlan["week"] {
  const from = addDays(today, -6);
  const days = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(from, i);
    return { day, active: (state.history[day] ?? 0) > 0 };
  });
  const inWeek = (d: string | undefined | null) => Boolean(d && d >= from && d <= today);
  const p = state.study;
  const touched = modules.filter(
    (m) =>
      Object.entries(p.done).some(([k, d]) => k.startsWith(`${m.id}/`) && inWeek(d)) ||
      inWeek(p.tests[m.id]?.day) ||
      inWeek(p.written[m.id]) ||
      Object.values(p.acts[m.id] ?? {}).some(inWeek),
  ).length;
  return { days, modules: touched };
}

export type RevisionOptions = {
  /** Include Psychology Lab re-checks (only when the Lab is open). Default true. */
  lab?: boolean;
};

export function buildRevisionPlan(state: LearnState, today: string, modules: ReviseModule[], opts: RevisionOptions = {}): RevisionPlan {
  const week = weekOf(state, today, modules);
  if (isNew(state)) return { status: "new", today: [], minutes: 0, later: [], week };

  const mods = moduleItems(state, today, modules);
  const lab = opts.lab === false ? { now: [], soon: [] } : labItems(state, today);
  const review = reviewItems(state, today);
  const candidates = [...review.now, ...mods.now, ...coachItems(state, today), ...lab.now];

  const [picked, leftover] = pickToday(candidates);
  const overflow: LaterItem[] = leftover.map((c) => ({ ...c, due: today, when: whenLabel(today, today) }));
  const soon = [...review.soon, ...mods.soon, ...lab.soon].sort((a, b) => a.due.localeCompare(b.due) || b.priority - a.priority || a.id.localeCompare(b.id));
  const later = [...overflow, ...soon].slice(0, REVISE.laterMax);

  return {
    status: picked.length ? "ready" : "clear",
    today: picked,
    minutes: picked.reduce((a, c) => a + c.minutes, 0),
    later,
    week,
  };
}
