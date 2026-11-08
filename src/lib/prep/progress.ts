/**
 * Question bank progress: percent right per topic and set, where to resume,
 * and which question a set opens at. Pure.
 */
import { SET_SIZE, setsOf } from "./topics";

/** A student's record for one question (choice and ok are null when only saved). */
export type AnswerState = { choice: number | null; ok: boolean | null; right: number; wrong: number; saved: boolean; at: string };
export type Answers = ReadonlyMap<string, AnswerState>;

export type Stats = { total: number; answered: number; right: number; pct: number | null };

/** Of the questions answered, how many were right the last time. */
export function statsOf(ids: readonly string[], answers: Answers): Stats {
  let answered = 0;
  let right = 0;
  for (const id of ids) {
    const a = answers.get(id);
    if (!a || a.ok === null) continue;
    answered++;
    if (a.ok) right++;
  }
  return { total: ids.length, answered, right, pct: answered ? Math.round((right / answered) * 100) : null };
}

const answered = (answers: Answers, id: string) => {
  const a = answers.get(id);
  return !!a && a.ok !== null;
};

/**
 * Where a fully answered set goes round again: the first question last
 * answered wrong, else the one answered longest ago (so a second pass never
 * opens on the same question as the first).
 */
function againIndex(ids: readonly string[], answers: Answers): number {
  const w = ids.findIndex((id) => answers.get(id)?.ok === false);
  if (w >= 0) return w;
  let best = 0;
  let t = Infinity;
  ids.forEach((id, i) => {
    const at = Date.parse(answers.get(id)?.at ?? "");
    if (Number.isFinite(at) && at < t) [best, t] = [i, at];
  });
  return best;
}

/** The first unanswered question in a set; when every one is answered, the first wrong one (else the oldest answer). */
export function startIndex(ids: readonly string[], answers: Answers): number {
  const i = ids.findIndex((id) => !answered(answers, id));
  return i < 0 ? againIndex(ids, answers) : i;
}

/** The set to open for a topic: the first one with an unanswered question, else the first with a wrong answer, else the first. */
export function nextSet(ids: readonly string[], answers: Answers): number {
  const sets = setsOf(ids);
  const i = sets.findIndex((s) => s.some((id) => !answered(answers, id)));
  if (i >= 0) return i;
  const w = sets.findIndex((s) => s.some((id) => answers.get(id)?.ok === false));
  return w < 0 ? 0 : w;
}

export type Located = { subject: string; topic: string; ids: readonly string[] };

/**
 * Where to pick up: the topic of the latest answer, at the set holding the
 * first question still unanswered from that point on. Null when there is
 * nothing to resume (no answers, or the student finished that topic).
 * `latest` is the newest answered question id; `locate` finds its topic.
 */
export function resumePoint(latest: string | null, locate: (id: string) => Located | null, answers: Answers): { subject: string; topic: string; set: number; index: number } | null {
  if (!latest) return null;
  const at = locate(latest);
  if (!at) return null;
  const pos = Math.max(0, at.ids.indexOf(latest));
  const sets = setsOf(at.ids);
  const from = Math.floor(pos / SET_SIZE);
  for (let s = from; s < sets.length; s++) {
    const i = sets[s].findIndex((id) => !answered(answers, id));
    if (i >= 0) return { subject: at.subject, topic: at.topic, set: s, index: i };
  }
  for (let s = 0; s < from; s++) {
    const i = sets[s].findIndex((id) => !answered(answers, id));
    if (i >= 0) return { subject: at.subject, topic: at.topic, set: s, index: i };
  }
  return null;
}

/** The newest answered question (answers carry their time). */
export function latestAnswered(answers: Answers): string | null {
  let best: string | null = null;
  let t = -Infinity;
  for (const [id, a] of answers) {
    if (a.ok === null) continue;
    const at = Date.parse(a.at);
    if (at > t) [best, t] = [id, at];
  }
  return best;
}

/** Saved ids, newest first. */
export function savedIds(answers: Answers): string[] {
  return [...answers].filter(([, a]) => a.saved).sort((a, b) => Date.parse(b[1].at) - Date.parse(a[1].at)).map(([id]) => id);
}

/** Questions whose last answer was wrong, newest first. */
export function wrongIds(answers: Answers): string[] {
  return [...answers].filter(([, a]) => a.ok === false).sort((a, b) => Date.parse(b[1].at) - Date.parse(a[1].at)).map(([id]) => id);
}

/** One page of a long list (pages count from 1). */
export function pageOf<T>(list: readonly T[], page: number, size = 10): { items: T[]; page: number; pages: number } {
  const pages = Math.max(1, Math.ceil(list.length / size));
  const p = Math.min(Math.max(1, Math.floor(page) || 1), pages);
  return { items: list.slice((p - 1) * size, p * size), page: p, pages };
}
