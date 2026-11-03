/**
 * Learning insights — how the cohort is doing with self-study, for the
 * educator. Pure functions (no I/O): the page and the CSV route load rows,
 * this module turns them into plain numbers. Every student's state goes
 * through `normalise`, so a malformed or old JSON row never breaks the page.
 */

import { daysBetween, dueItems, labRechecksDue, liveStreak, normalise, type LearnState } from "@/lib/learn/engine";

export type InsightRow = { user_id: string; name: string; state: unknown; updated_at?: string | null };

/** What the aggregation needs to know about the course, so this stays pure. */
export type InsightCatalog = {
  modules: { id: string; num: number; title: string; sections: string[] }[];
  experiments: { id: string; num: number; title: string }[];
  /** Concept id → plain label. Unknown ids fall back to the id. */
  conceptLabel?: (id: string) => string | undefined;
};

export type InsightOptions = {
  /** Days without activity before a student counts as quiet. */
  inactiveDays?: number;
  /** Due reviews at or above this count as "many". */
  manyDue?: number;
  /** A module needs at least this many test takers to be called a struggle. */
  minTakers?: number;
  /** How many items to keep in the top lists. */
  top?: number;
};

export type ModuleInsight = {
  id: string;
  num: number;
  title: string;
  sections: number;
  started: number;
  completed: number;
  testTakers: number;
  /** Mean of each taker's best test %, rounded; null when nobody took it. */
  avgTestPct: number | null;
};

export type ConfusionInsight = { a: string; b: string; aLabel: string; bLabel: string; times: number; students: number };

export type ResultStat = { key: string; label: string; unit: string; mean: number; median: number; n: number };

export type LabInsight = {
  id: string;
  num: number;
  title: string;
  runs: number;
  students: number;
  checked: number;
  avgCheckPct: number | null;
  reflected: number;
  /** Share of students who ran it and wrote a reflection, 0–100. */
  reflectPct: number | null;
  /** Cohort averages of the headline numbers, in display order. */
  headline: ResultStat[];
};

export type StudentSummary = {
  userId: string;
  name: string;
  started: boolean;
  lastActive: string | null;
  daysInactive: number | null;
  xp: number;
  streak: number;
  sectionsDone: number;
  modulesCompleted: number;
  testsTaken: number;
  avgTestPct: number | null;
  labsDone: number;
  reflections: number;
  dueReviews: number;
};

export type LearningInsights = {
  today: string;
  students: number;
  started: number;
  modules: ModuleInsight[];
  struggles: ModuleInsight[];
  confusions: ConfusionInsight[];
  lab: LabInsight[];
  inactive: StudentSummary[];
  manyDue: StudentSummary[];
  perStudent: StudentSummary[];
};

/**
 * Headline numbers per Lab experiment: which result keys to average and how
 * to name them. Keys come from the runners in src/components/lab/runners.
 */
export const LAB_HEADLINES: Record<string, { key: string; label: string; unit: string }[]> = {
  "digit-span": [
    { key: "forward", label: "Forward span", unit: "digits" },
    { key: "backward", label: "Backward span", unit: "digits" },
  ],
  "serial-position": [
    { key: "primacy", label: "Start of list", unit: "%" },
    { key: "middle", label: "Middle", unit: "%" },
    { key: "recency", label: "End of list", unit: "%" },
  ],
  stroop: [
    { key: "effect", label: "Stroop effect", unit: "ms" },
    { key: "congruent", label: "Match", unit: "ms" },
    { key: "incongruent", label: "Clash", unit: "ms" },
  ],
  "change-detection": [{ key: "k", label: "Squares held (K)", unit: "" }],
  "muller-lyer": [
    { key: "finsOut", label: "Fins out", unit: "%" },
    { key: "finsIn", label: "Fins in", unit: "%" },
  ],
  schedules: [
    { key: "crfExtinction", label: "Presses after reward stopped (every time)", unit: "" },
    { key: "mostStubborn", label: "Presses after reward stopped (most stubborn)", unit: "" },
  ],
  "bias-spotter": [
    { key: "biasRight", label: "Traps named", unit: "" },
    { key: "fixRight", label: "Fixes chosen", unit: "" },
  ],
};

const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;
const num = (v: unknown): number => (typeof v === "number" && Number.isFinite(v) ? v : 0);
const round1 = (n: number) => Math.round(n * 10) / 10;

function mean(xs: number[]): number | null {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;
}
function median(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}
function pct(right: number, total: number): number | null {
  if (!(total > 0)) return null;
  return Math.max(0, Math.min(100, (right / total) * 100));
}

/** The most recent day this student did anything we can see in their state. */
export function lastActiveDay(s: LearnState, updatedAt?: string | null): string | null {
  const days: string[] = [];
  const add = (d: unknown) => {
    if (typeof d === "string" && DAY_RE.test(d)) days.push(d);
  };
  add(s.daily.day);
  add(s.streak.lastDay);
  for (const [d, xp] of Object.entries(s.history)) if (num(xp) > 0) add(d);
  Object.values(s.study.done).forEach(add);
  Object.values(s.study.tests).forEach((t) => add(t?.day));
  Object.values(s.study.written).forEach(add);
  Object.values(s.notesRead).forEach(add);
  Object.values(s.lab).forEach((r) => add(r.last));
  if (days.length) return days.sort().at(-1)!;
  // Nothing dated in the state: fall back to when the row was last written.
  if (typeof updatedAt === "string" && !Number.isNaN(Date.parse(updatedAt))) return new Date(updatedAt).toISOString().slice(0, 10);
  return null;
}

/** A state with nothing in it at all: the student opened Learn once, or never. */
function hasActivity(s: LearnState): boolean {
  return (
    num(s.xp) > 0 ||
    num(s.answered) > 0 ||
    Object.keys(s.study.done).length > 0 ||
    Object.keys(s.study.tests).length > 0 ||
    Object.keys(s.lab).length > 0 ||
    Object.keys(s.lessons).length > 0
  );
}

function safe<T>(fn: () => T, fallback: T): T {
  try {
    return fn();
  } catch {
    return fallback;
  }
}

export function computeLearningInsights(rows: InsightRow[], catalog: InsightCatalog, today: string, opts: InsightOptions = {}): LearningInsights {
  const inactiveDays = opts.inactiveDays ?? 7;
  const manyDueAt = opts.manyDue ?? 15;
  const minTakers = opts.minTakers ?? 2;
  const top = opts.top ?? 10;

  const sectionSets = new Map(catalog.modules.map((m) => [m.id, new Set(m.sections)]));

  const mod = new Map(catalog.modules.map((m) => [m.id, { started: 0, completed: 0, pcts: [] as number[] }]));
  const conf = new Map<string, { times: number; students: number }>();
  const lab = new Map(
    catalog.experiments.map((e) => [e.id, { runs: 0, students: 0, checks: [] as number[], reflected: 0, results: new Map<string, number[]>() }]),
  );
  const perStudent: StudentSummary[] = [];

  // One row per student; if a student appears twice, keep the first.
  const seen = new Set<string>();
  for (const row of rows) {
    if (!row || typeof row.user_id !== "string" || seen.has(row.user_id)) continue;
    seen.add(row.user_id);
    const s = safe(() => normalise(row.state), normalise(null));
    const started = row.state != null && hasActivity(s);

    // Study: sections per module, completion, best test %.
    const doneBy = new Map<string, number>();
    for (const key of Object.keys(s.study.done)) {
      const slash = key.indexOf("/");
      if (slash <= 0) continue;
      const m = key.slice(0, slash);
      if (sectionSets.get(m)?.has(key.slice(slash + 1))) doneBy.set(m, (doneBy.get(m) ?? 0) + 1);
    }
    let modulesCompleted = 0;
    for (const [m, n] of doneBy) {
      const agg = mod.get(m);
      if (!agg) continue;
      agg.started++;
      if (n >= (sectionSets.get(m)?.size ?? Infinity)) {
        agg.completed++;
        modulesCompleted++;
      }
    }
    const myPcts: number[] = [];
    for (const [m, t] of Object.entries(s.study.tests)) {
      const p = pct(num(t?.best), num(t?.total));
      if (p === null) continue;
      myPcts.push(p);
      mod.get(m)?.pcts.push(p);
    }

    // Coach: confused pairs.
    for (const [k, v] of Object.entries(s.coach.confusions)) {
      const times = num(v);
      if (times <= 0 || !k.includes("|")) continue;
      const c = conf.get(k) ?? { times: 0, students: 0 };
      c.times += times;
      c.students++;
      conf.set(k, c);
    }

    // Lab.
    let reflections = 0;
    for (const [id, r] of Object.entries(s.lab)) {
      if (r.reflected) reflections++;
      const agg = lab.get(id);
      if (!agg) continue;
      agg.runs += r.runs;
      agg.students++;
      if (r.reflected) agg.reflected++;
      const cp = r.check ? pct(r.check.right, r.check.total) : null;
      if (cp !== null) agg.checks.push(cp);
      for (const [k, v] of Object.entries(r.result)) {
        const list = agg.results.get(k) ?? [];
        list.push(v);
        agg.results.set(k, list);
      }
    }

    const last = lastActiveDay(s, row.updated_at);
    const due = safe(() => dueItems(s, today).length + labRechecksDue(s, today).length, 0);
    const avg = mean(myPcts);
    perStudent.push({
      userId: row.user_id,
      name: typeof row.name === "string" && row.name.trim() ? row.name.trim() : "Unnamed student",
      started,
      lastActive: started ? last : null,
      daysInactive: started && last ? Math.max(0, daysBetween(last, today)) : null,
      xp: Math.max(0, Math.round(num(s.xp))),
      streak: safe(() => liveStreak(s.streak, today), 0),
      sectionsDone: [...doneBy.values()].reduce((a, b) => a + b, 0),
      modulesCompleted,
      testsTaken: myPcts.length,
      avgTestPct: avg === null ? null : Math.round(avg),
      labsDone: Object.keys(s.lab).length,
      reflections,
      dueReviews: due,
    });
  }

  const modules: ModuleInsight[] = catalog.modules.map((m) => {
    const a = mod.get(m.id)!;
    const avg = mean(a.pcts);
    return {
      id: m.id,
      num: m.num,
      title: m.title,
      sections: m.sections.length,
      started: a.started,
      completed: a.completed,
      testTakers: a.pcts.length,
      avgTestPct: avg === null ? null : Math.round(avg),
    };
  });

  const struggles = modules
    .filter((m) => m.avgTestPct !== null && m.testTakers >= minTakers)
    .sort((a, b) => a.avgTestPct! - b.avgTestPct! || b.testTakers - a.testTakers)
    .slice(0, 5);

  const label = (id: string) => safe(() => catalog.conceptLabel?.(id), undefined) ?? id;
  const confusions: ConfusionInsight[] = [...conf.entries()]
    .sort((x, y) => y[1].times - x[1].times || y[1].students - x[1].students)
    .slice(0, top)
    .map(([k, v]) => {
      const [a, b] = k.split("|");
      return { a, b, aLabel: label(a), bLabel: label(b), times: v.times, students: v.students };
    });

  const labOut: LabInsight[] = catalog.experiments.map((e) => {
    const a = lab.get(e.id)!;
    const avgCheck = mean(a.checks);
    const headline = (LAB_HEADLINES[e.id] ?? []).flatMap((h) => {
      const xs = a.results.get(h.key) ?? [];
      return xs.length ? [{ key: h.key, label: h.label, unit: h.unit, mean: round1(mean(xs)!), median: round1(median(xs)), n: xs.length }] : [];
    });
    return {
      id: e.id,
      num: e.num,
      title: e.title,
      runs: a.runs,
      students: a.students,
      checked: a.checks.length,
      avgCheckPct: avgCheck === null ? null : Math.round(avgCheck),
      reflected: a.reflected,
      reflectPct: a.students ? Math.round((a.reflected / a.students) * 100) : null,
      headline,
    };
  });

  const inactive = perStudent
    .filter((p) => p.started && p.daysInactive !== null && p.daysInactive > inactiveDays)
    .sort((a, b) => b.daysInactive! - a.daysInactive!);
  const manyDue = perStudent.filter((p) => p.dueReviews >= manyDueAt).sort((a, b) => b.dueReviews - a.dueReviews);

  return {
    today,
    students: perStudent.length,
    started: perStudent.filter((p) => p.started).length,
    modules,
    struggles,
    confusions,
    lab: labOut,
    inactive,
    manyDue,
    perStudent: [...perStudent].sort((a, b) => a.name.localeCompare(b.name)),
  };
}

/* -------------------------------------------------------------------- csv */

/** One CSV cell: neutralise spreadsheet formulas, then quote if needed. */
export function csvCell(v: unknown): string {
  let s = v === null || v === undefined ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\r\n]/.test(s) || s !== s.trim() ? `"${s.replace(/"/g, '""')}"` : s;
}

export const STUDENT_CSV_HEADER = [
  "Name",
  "User id",
  "Started",
  "Last active",
  "Days inactive",
  "XP",
  "Streak",
  "Sections done",
  "Modules completed",
  "Tests taken",
  "Average best test %",
  "Lab experiments done",
  "Lab reflections",
  "Reviews due",
] as const;

export function studentsCsv(rows: StudentSummary[]): string {
  const lines = [STUDENT_CSV_HEADER.map(csvCell).join(",")];
  for (const r of rows) {
    lines.push(
      [
        r.name,
        r.userId,
        r.started ? "yes" : "no",
        r.lastActive ?? "",
        r.daysInactive ?? "",
        r.xp,
        r.streak,
        r.sectionsDone,
        r.modulesCompleted,
        r.testsTaken,
        r.avgTestPct ?? "",
        r.labsDone,
        r.reflections,
        r.dueReviews,
      ]
        .map(csvCell)
        .join(","),
    );
  }
  return lines.join("\r\n") + "\r\n";
}
