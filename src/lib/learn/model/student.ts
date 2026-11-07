/**
 * The student model, as pure functions over plain rows. server.ts loads the
 * rows from Supabase, calls these, and writes the result back; tests call them
 * directly.
 */
import { PRIOR_THETA, decayedTheta, eloUpdate, guessFloor, isCalibrated, prob } from "./elo";
import { review, gradeFor, isDue, type Card } from "./fsrs";
import { addCorrectDay, masteryOf, MASTERY_RANK, type Mastery } from "./mastery";
import { bumpConfusion, isConfusion, cleanAnswer, type ConfusionRow } from "./confusions";
import { interleave, pickSession, type Candidate, type Picked } from "./picker";
import { BANK, COMPETENCY_LABEL, SKILLS_WITH_ITEMS, TOPICS, bankItem, splitSkill, skillLabel, topicById, topicSkills, type GradedItem } from "./topics";
import type { PlacementResult } from "./placement";
import { COMPETENCIES, skillKey, type Competency } from "./skills";
import { istToday } from "@/lib/practice/streaks";

export type SkillRow = { skill: string; theta: number; n: number; lastAt: string | null; mastery: Mastery; correctDays: string[] };
export type ItemRow = { item: string; b: number; n: number };
export type CardRow = Card & { item: string };

export type Attempt = {
  skill: string;
  item?: string | null;
  /** 0 = wrong … 1 = right; partial credit allowed. */
  outcome: number;
  /** What the student picked, and the right answer (multiple choice only). */
  chosen?: string | null;
  correct?: string | null;
  /** First try at this question in this sitting (default true). */
  first?: boolean;
  fast?: boolean;
  /** Number of options shown (multiple choice), for the guessing floor. Bank questions know their own. */
  options?: number | null;
};

/** Options on a bank question: 2 for true or false, the option count for multiple choice. */
export function optionCount(item: GradedItem): number {
  return item.kind === "tf" ? 2 : item.options.length;
}

/** Bank question ids per skill, for judging mastery on the skill's own questions. */
const SKILL_ITEMS: Map<string, string[]> = (() => {
  const m = new Map<string, string[]>();
  for (const b of BANK) m.set(b.skill, [...(m.get(b.skill) ?? []), b.item.id]);
  return m;
})();

/** Bank question ids for these skills (to load their difficulty). */
export function itemsOfSkills(skills: Iterable<string>): string[] {
  const out: string[] = [];
  for (const s of skills) out.push(...(SKILL_ITEMS.get(s) ?? []));
  return out;
}

/**
 * The difficulty mastery is judged at: the median b of the skill's own
 * questions that are in use (answered at least once). 0 when none are known,
 * so a skill without data is judged as before.
 */
export function skillRefB(skill: string, items: ReadonlyMap<string, ItemRow>): number {
  const bs = (SKILL_ITEMS.get(skill) ?? [])
    .map((id) => items.get(id))
    .filter((r): r is ItemRow => !!r && r.n > 0 && Number.isFinite(r.b))
    .map((r) => r.b)
    .sort((a, b) => a - b);
  if (!bs.length) return 0;
  const mid = Math.floor(bs.length / 2);
  return bs.length % 2 ? bs[mid] : (bs[mid - 1] + bs[mid]) / 2;
}

export type ModelRows = {
  skills: Map<string, SkillRow>;
  items: Map<string, ItemRow>;
  cards: Map<string, CardRow>;
  confusions: Map<string, ConfusionRow>;
};

/** Prep (postgraduate exam) skills and items live in the same tables but show on /prep, not on the module map. */
export const isPrepKey = (k: string) => k.startsWith("prep-") || k.startsWith("prep:");

export const confusionKey = (chosen: string, correct: string) => `${cleanAnswer(chosen)}\u0000${cleanAnswer(correct)}`;

/** Starting ability for a skill never practised: the average of its topic's other skills (e.g. from placement), else 0. */
export function priorFor(skill: string, skills: Map<string, SkillRow> | SkillRow[], now: Date): number {
  const { topic } = splitSkill(skill);
  const list = Array.isArray(skills) ? skills : [...skills.values()];
  const same = list.filter((r) => r.skill !== skill && splitSkill(r.skill).topic === topic);
  if (!same.length) return PRIOR_THETA;
  return same.reduce((a, r) => a + decayedTheta(r.theta, r.lastAt, now), 0) / same.length;
}

/** Current ability for a skill (time away applied). */
export function abilityOf(skill: string, rows: ModelRows["skills"], now: Date): number {
  const r = rows.get(skill);
  if (!r) return priorFor(skill, rows, now);
  return decayedTheta(r.theta, r.lastAt, now);
}

/**
 * Apply attempts in order. Returns new copies of the maps plus the keys that
 * changed, so the caller writes only those rows.
 */
export function applyAttempts(rows: ModelRows, attempts: Attempt[], now: Date) {
  const skills = new Map(rows.skills);
  const items = new Map(rows.items);
  const cards = new Map(rows.cards);
  const confusions = new Map(rows.confusions);
  const changed = { skills: new Set<string>(), items: new Set<string>(), cards: new Set<string>(), confusions: new Set<string>() };
  const today = istToday(now);

  for (const a of attempts) {
    if (!a.skill || !Number.isFinite(a.outcome)) continue;
    const outcome = Math.max(0, Math.min(1, a.outcome));
    const prev = skills.get(a.skill);
    const theta = prev ? decayedTheta(prev.theta, prev.lastAt, now) : priorFor(a.skill, skills, now);
    const itemRow = a.item ? (items.get(a.item) ?? { item: a.item, b: 0, n: 0 }) : { item: "", b: 0, n: 0 };
    const bank = a.item ? bankItem(a.item) : undefined;
    const c = guessFloor(a.options ?? (bank ? optionCount(bank.item) : null));
    const res = eloUpdate({ theta, n: prev?.n ?? 0 }, itemRow, outcome, c);
    const correctDays = a.first !== false && outcome >= 0.8 ? addCorrectDay(prev?.correctDays ?? [], today) : (prev?.correctDays ?? []);
    const next: SkillRow = { skill: a.skill, theta: res.student.theta, n: res.student.n, lastAt: now.toISOString(), correctDays, mastery: "new" };
    if (a.item) items.set(a.item, { item: a.item, b: res.item.b, n: res.item.n });
    next.mastery = masteryOf(next, now, skillRefB(a.skill, items));
    skills.set(a.skill, next);
    changed.skills.add(a.skill);

    if (a.item) {
      changed.items.add(a.item);
      const card = review(cards.get(a.item), gradeFor(outcome, a.fast), now);
      cards.set(a.item, { ...card, item: a.item });
      changed.cards.add(a.item);
    }

    if (outcome < 0.5 && isConfusion(a.chosen, a.correct)) {
      const key = confusionKey(a.chosen!, a.correct!);
      confusions.set(key, bumpConfusion(confusions.get(key), a.chosen!, a.correct!, now, a.skill));
      changed.confusions.add(key);
    }
  }
  return { skills, items, cards, confusions, changed };
}

/* ------------------------------------------------------------ the map */

export type MapCell = { skill: string; competency: Competency; label: string; hasItems: boolean; state: Mastery; n: number; p: number | null };
export type MapTopic = { id: string; title: string; href: string; cells: MapCell[]; practised: number };
export type StudentMapData = { topics: MapTopic[]; graded: number; calibrated: boolean };

export function buildMap(list: SkillRow[], now: Date, titles: Record<string, string> = {}, items: ReadonlyMap<string, ItemRow> = new Map()): StudentMapData {
  const rows = new Map(list.map((r) => [r.skill, r]));
  const graded = list.reduce((a, r) => a + r.n, 0);
  const calibrated = isCalibrated(graded);
  const ids = TOPICS.map((t) => t.id);
  for (const r of list) {
    const t = splitSkill(r.skill).topic;
    if (r.n > 0 && !ids.includes(t) && !isPrepKey(t)) ids.push(t);
  }
  const topics = ids.map((id) => {
    const cells = COMPETENCIES.map((c): MapCell => {
      const skill = skillKey(id, c);
      const r = rows.get(skill);
      const refB = skillRefB(skill, items);
      const state = r ? masteryOf(r, now, refB) : "new";
      return {
        skill,
        competency: c,
        label: COMPETENCY_LABEL[c],
        hasItems: SKILLS_WITH_ITEMS.has(skill) || (r?.n ?? 0) > 0,
        state,
        n: r?.n ?? 0,
        p: calibrated && r && r.n > 0 ? prob(decayedTheta(r.theta, r.lastAt, now), refB) : null,
      };
    });
    return { id, title: topicById(id)?.title ?? titles[id] ?? id, href: `/study/${id}`, cells, practised: cells.reduce((a, c) => a + c.n, 0) };
  });
  return { topics, graded, calibrated };
}

/* ------------------------------------------------------- weak spots */

export type WeakSpot = { skill: string; topic: string; label: string; state: Mastery; p: number; n: number; lastAt: string | null; href: string; practiceHref: string };

/** Skills that need work most: shaky first, then fading, then still learning; weakest first within each. */
export function weakSpots(list: SkillRow[], now: Date, k = 5, items: ReadonlyMap<string, ItemRow> = new Map()): WeakSpot[] {
  return list
    .filter((r) => r.n > 0 && !isPrepKey(r.skill))
    .map((r) => {
      const { topic } = splitSkill(r.skill);
      return {
        skill: r.skill,
        topic,
        label: skillLabel(r.skill),
        state: masteryOf(r, now, skillRefB(r.skill, items)),
        p: prob(decayedTheta(r.theta, r.lastAt, now), skillRefB(r.skill, items)),
        n: r.n,
        lastAt: r.lastAt,
        href: `/study/${topic}`,
        practiceHref: `/study/map/practice?topic=${encodeURIComponent(topic)}`,
      };
    })
    .filter((w) => w.state !== "mastered")
    .sort((a, b) => MASTERY_RANK[a.state] - MASTERY_RANK[b.state] || a.p - b.p)
    .slice(0, k);
}

/* --------------------------------------------------- practice pool */

/** Every bankable question with its predicted chance and due flag. `topic` narrows to that topic and its look-alikes. */
export function practiceCandidates(rows: Pick<ModelRows, "skills" | "items" | "cards">, now: Date, topic?: string | null): Candidate[] {
  const family = topic ? topicById(topic)?.family : undefined;
  return BANK.filter((b) => !topic || b.topic === topic || (family !== undefined && b.family === family)).map((b) => {
    const card = rows.cards.get(b.item.id);
    return {
      id: b.item.id,
      topic: b.topic,
      family: b.family,
      p: prob(abilityOf(b.skill, rows.skills, now), rows.items.get(b.item.id)?.b ?? 0, guessFloor(optionCount(b.item))),
      due: card ? isDue(card, now) : false,
    };
  });
}

/**
 * A practice session. Without a topic: the Goldilocks mix over everything.
 * With a topic ("Fix it"): about 70 % from that topic, the rest from its
 * look-alikes, interleaved.
 */
export function buildPractice(rows: Pick<ModelRows, "skills" | "items" | "cards">, now: Date, rng: () => number, size = 10, topic?: string | null): Picked[] {
  if (!topic || !topicById(topic)) return pickSession(practiceCandidates(rows, now), size, rng);
  const all = practiceCandidates(rows, now, topic);
  const own = all.filter((c) => c.topic === topic);
  const near = all.filter((c) => c.topic !== topic);
  const mine = pickSession(own, Math.min(own.length, Math.max(size - near.length, Math.round(size * 0.7))), rng);
  const rest = pickSession(near, size - mine.length, rng);
  const ordered = interleave([...mine, ...rest]);
  const warm = ordered.findIndex((x) => x.bucket === "confidence");
  if (warm > 0) ordered.unshift(...ordered.splice(warm, 1));
  return ordered;
}

/**
 * Placement → starting abilities. Each placed topic's theta goes to every
 * skill of that topic that has questions, but only where the student has not
 * practised yet (n = 0), so a retake never wipes real progress. n stays 0:
 * a placement guess is a starting point, not evidence of mastery.
 */
export function seedRows(result: PlacementResult, existing: Map<string, SkillRow>): SkillRow[] {
  const out: SkillRow[] = [];
  for (const t of result.topics) {
    for (const skill of topicSkills(t.topic)) {
      const prev = existing.get(skill);
      if (prev && prev.n > 0) continue;
      out.push({ skill, theta: t.theta, n: 0, lastAt: prev?.lastAt ?? null, mastery: "new", correctDays: prev?.correctDays ?? [] });
    }
  }
  return out;
}

export function dueCount(cards: Iterable<CardRow>, now: Date): number {
  let n = 0;
  for (const c of cards) if (!isPrepKey(c.item) && isDue(c, now)) n++;
  return n;
}
