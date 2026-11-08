/**
 * Ward Week engine (pure). A campaign follows one patient across chapters
 * (sessions). Each decision moves five dials (risk, trust, insight, family,
 * adherence) and can set flags; later scenes and decisions depend on them.
 * The outcome score blends where the dials end up with how sound each
 * decision was.
 */
import type { ItemTags } from "../item-tags";

export type Vars = { risk: number; trust: number; insight: number; family: number; adherence: number };
export type VarKey = keyof Vars;
export type Cond = { flag?: string; notFlag?: string; v?: VarKey; gte?: number; lte?: number };
export type Quality = "best" | "ok" | "poor" | "harm";
export type DecisionKind = "assessment" | "risk" | "referral" | "psychoeducation" | "family" | "medicines";

export type WardOption = { id: string; text: string; q: Quality; fx?: Partial<Vars>; set?: string[]; why: string };
export type Decision = { id: string; kind: DecisionKind; prompt: string; when?: Cond; skill: string; options: WardOption[] };
export type Beat = { text: string; when?: Cond };
export type Chapter = { id: string; title: string; beats: Beat[]; decisions: Decision[] };
export type Ending = { min: number; title: string; text: string };
export type Campaign = {
  /** Library tags (topic, level, objective, exams, Study module). */
  tags?: ItemTags;
  id: string;
  title: string;
  patient: string;
  place: string;
  blurb: string;
  start: Vars;
  chapters: Chapter[];
  endings: Ending[];
  note?: string;
};

export type LogEntry = { chapter: number; decision: string; option: string; q: Quality; voters?: number };
export type WardState = { campaign: string; chapter: number; queue: string[]; vars: Vars; flags: string[]; log: LogEntry[]; done: boolean };

export const KIND_LABEL: Record<DecisionKind, string> = {
  assessment: "Assessment",
  risk: "Risk",
  referral: "Referral",
  psychoeducation: "Explaining it",
  family: "Family meeting",
  medicines: "Medicines, with the psychiatrist",
};

export const VAR_LABEL: Record<VarKey, string> = { risk: "Risk", trust: "Trust", insight: "Insight", family: "Family support", adherence: "Sticking with care" };

/** Grade for the student model. */
export const QUALITY_OUTCOME: Record<Quality, number> = { best: 1, ok: 0.6, poor: 0.25, harm: 0 };
export const QUALITY_LABEL: Record<Quality, string> = { best: "Strong choice", ok: "Reasonable", poor: "Weak choice", harm: "Harmful choice" };

const clamp = (x: number) => Math.max(0, Math.min(100, Math.round(x)));

export function holds(c: Cond | undefined, st: Pick<WardState, "vars" | "flags">): boolean {
  if (!c) return true;
  if (c.flag && !st.flags.includes(c.flag)) return false;
  if (c.notFlag && st.flags.includes(c.notFlag)) return false;
  if (c.v) {
    const x = st.vars[c.v];
    if (c.gte !== undefined && x < c.gte) return false;
    if (c.lte !== undefined && x > c.lte) return false;
  }
  return true;
}

/**
 * The decisions still to come in a chapter. Conditions are checked when a
 * decision comes up, not when the chapter opens, so a choice made earlier in
 * the same session can open (or close) the next decision.
 */
function dropBlocked(c: Campaign, chapter: number, ids: string[], st: Pick<WardState, "vars" | "flags">): string[] {
  const ch = c.chapters[chapter];
  if (!ch) return [];
  let i = 0;
  while (i < ids.length && !holds(ch.decisions.find((d) => d.id === ids[i])?.when, st)) i++;
  return ids.slice(i);
}

function queueFor(c: Campaign, chapter: number, st: Pick<WardState, "vars" | "flags">): string[] {
  const ch = c.chapters[chapter];
  return ch ? dropBlocked(c, chapter, ch.decisions.map((d) => d.id), st) : [];
}

export function startState(c: Campaign): WardState {
  const base = { vars: { ...c.start }, flags: [] as string[] };
  return { campaign: c.id, chapter: 0, queue: queueFor(c, 0, base), ...base, log: [], done: false };
}

export function currentDecision(c: Campaign, st: WardState): Decision | null {
  if (st.done) return null;
  const id = st.queue[0];
  return c.chapters[st.chapter]?.decisions.find((d) => d.id === id) ?? null;
}

export function visibleBeats(c: Campaign, st: WardState, chapter = st.chapter): string[] {
  return (c.chapters[chapter]?.beats ?? []).filter((b) => holds(b.when, st)).map((b) => b.text);
}

/** Apply a choice. Unknown ids leave the state unchanged. */
export function choose(c: Campaign, st: WardState, optionId: string, voters?: number): WardState {
  const d = currentDecision(c, st);
  const o = d?.options.find((x) => x.id === optionId);
  if (!d || !o) return st;
  const vars = { ...st.vars };
  for (const [k, v] of Object.entries(o.fx ?? {}) as [VarKey, number][]) vars[k] = clamp(vars[k] + v);
  const flags = [...new Set([...st.flags, ...(o.set ?? [])])];
  const log = [...st.log, { chapter: st.chapter, decision: d.id, option: o.id, q: o.q, ...(voters ? { voters } : {}) }];
  let chapter = st.chapter;
  let queue = dropBlocked(c, chapter, st.queue.slice(1), { vars, flags });
  let done = false;
  while (!queue.length && !done) {
    chapter += 1;
    if (chapter >= c.chapters.length) {
      done = true;
      chapter = c.chapters.length - 1;
      break;
    }
    queue = queueFor(c, chapter, { vars, flags });
  }
  return { ...st, chapter, queue, vars, flags, log, done };
}

/** 0 to 100. 60 % from the final dials (risk counts inverted), 40 % from decision quality. */
export function outcomeScore(st: WardState): number {
  const v = st.vars;
  const dials = (100 - v.risk) * 0.3 + v.trust * 0.2 + v.insight * 0.15 + v.family * 0.15 + v.adherence * 0.2;
  const q = st.log.length ? st.log.reduce((a, l) => a + QUALITY_OUTCOME[l.q], 0) / st.log.length : 0;
  return Math.round(dials * 0.6 + q * 100 * 0.4);
}

export function endingFor(c: Campaign, st: WardState): Ending {
  const s = outcomeScore(st);
  return [...c.endings].sort((a, b) => b.min - a.min).find((e) => s >= e.min) ?? c.endings[c.endings.length - 1];
}

/** Steps taken so far (team votes are keyed by this). */
export const stepOf = (st: WardState) => st.log.length;

export function totalDecisions(c: Campaign, st: WardState): number {
  // Decisions already made + the ones queued + (unknown) later ones: estimate with the chapter maximum.
  const later = c.chapters.slice(st.chapter + 1).reduce((a, ch) => a + ch.decisions.filter((d) => !d.when).length, 0);
  return st.log.length + st.queue.length + later;
}

/** XP for a finished campaign: 10 for finishing, up to 20 more for the outcome. */
export const wardXp = (score: number) => 10 + Math.round(clamp(score) / 5);

/** Dials where a lower number is the better one. */
export const LOWER_IS_BETTER: ReadonlySet<VarKey> = new Set<VarKey>(["risk"]);

/** Did this change help? (+1 better, -1 worse, 0 no change.) */
export function deltaSign(k: VarKey, delta: number): -1 | 0 | 1 {
  if (!delta) return 0;
  const up = delta > 0 ? 1 : -1;
  return (LOWER_IS_BETTER.has(k) ? -up : up) as -1 | 1;
}

export function findDecision(c: Campaign, id: string): { chapter: number; decision: Decision } | null {
  for (let i = 0; i < c.chapters.length; i++) {
    const d = c.chapters[i].decisions.find((x) => x.id === id);
    if (d) return { chapter: i, decision: d };
  }
  return null;
}

export function bestOption(d: Decision): WardOption {
  return d.options.find((o) => o.q === "best") ?? d.options[0];
}

/** Replay a list of choices from the start (used to rebuild a log entry's "before" dials). */
export function replay(c: Campaign, choices: string[]): WardState {
  let st = startState(c);
  for (const ch of choices) st = choose(c, st, ch);
  return st;
}
