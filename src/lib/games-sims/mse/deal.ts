/**
 * MSE Lab, dealt on the server. The browser gets an excerpt's interview, the
 * quotes to tag and each quote's word options; every tag is checked here,
 * and a finding's answer and explanation come back only once it is tagged.
 * The next excerpt (level moves, answer history order) is picked here too.
 * Pure (the secret mask is passed in), so every rule is unit-tested; the
 * server actions live in src/app/(dashboard)/games/mse/actions.ts.
 *
 * A round is a signed token holding the excerpts seen (their numbers
 * shifted by a secret mask), the finding in play, the scores so far, the
 * word options dealt for the current excerpt, the level and the streak.
 */
import type { History } from "@/lib/history/order";
import type { Rng } from "../common";
import { EXCERPTS, type Excerpt } from "./excerpts";
import { gradeTag, optionsFor, pickExcerpt, whyNot } from "./grade";
import { nextLevel, nextStreak, ROUND_SIZE, type FindingReveal, type Level, type PublicExcerpt, type Tag } from "./rules";
import { TERMS, type Domain } from "./terms";

export type MseToken = { u: string; run: string; lv: Level; k: number[]; f: number; rs: number[]; ch: (string | null)[]; sc: number[]; o: string[][]; st: number; b: number };
export type Mask = (run: string, round: number) => number;

const N = EXCERPTS.length;
const mod = (a: number, n: number) => ((a % n) + n) % n;
const INDEX = new Map(EXCERPTS.map((e, i) => [e.id, i]));

/** `again`: done before (every excerpt is done, so they come round again). */
export function publicExcerpt(e: Excerpt, options: string[][], again = false): PublicExcerpt {
  return { level: e.level, again, who: e.who, place: e.place, lines: e.lines.map(([w, t]) => [w, t] as ["D" | "P" | "R", string]), note: e.note, quotes: e.findings.map((f) => f.q), options };
}

function withExcerpt(t: MseToken, e: Excerpt, rng: Rng, mask: Mask): MseToken {
  const r = t.k.length;
  return { ...t, k: [...t.k, mod(INDEX.get(e.id)! + mask(t.run, r), N)], f: 0, rs: [], ch: [], o: e.findings.map((f) => optionsFor(f, rng)) };
}

/** Start a round at a level. */
export function dealMse(userId: string, run: string, level: Level, rng: Rng, history: History, now: number, mask: Mask): { payload: MseToken; excerpt: PublicExcerpt } | null {
  const lv: Level = level === 2 || level === 3 ? level : 1;
  const e = pickExcerpt(lv, new Set(), rng, history, now);
  if (!e) return null;
  const payload = withExcerpt({ u: userId, run, lv, k: [], f: 0, rs: [], ch: [], sc: [], o: [], st: 0, b: 0 }, e, rng, mask);
  return { payload, excerpt: publicExcerpt(e, payload.o, history.has(e.id)) };
}

/** The excerpt in play, for this student only. */
export function currentExcerpt(t: MseToken | null, userId: string, mask: Mask): Excerpt | null {
  if (!t || t.u !== userId || typeof t.run !== "string" || !Array.isArray(t.k) || !t.k.length || !Array.isArray(t.rs) || !Array.isArray(t.ch) || !Array.isArray(t.sc) || !Array.isArray(t.o)) return null;
  const r = t.k.length - 1;
  if (t.sc.length > r) return null;
  const e = EXCERPTS[mod(t.k[r] - mask(t.run, r), N)];
  return e && Number.isInteger(t.f) && t.f >= 0 && t.f < e.findings.length ? e : null;
}

/** The ids of the excerpts seen in a verified token. */
export function seenIds(t: MseToken, mask: Mask): string[] {
  return t.k.map((k, r) => EXCERPTS[mod(k - mask(t.run, r), N)]?.id).filter((x): x is string => !!x);
}

export type TagOutcome = {
  next: MseToken;
  reveal: FindingReveal;
  /** Set when this tag finished the excerpt: its score, and the server's streak for the board. */
  excerptDone: { excerpt: Excerpt; scores: number[]; score: number; chosen: (string | null)[] } | null;
};

/** One tag on the finding in play. */
export function tagMse(t: MseToken, e: Excerpt, tag: Tag): TagOutcome | null {
  const f = e.findings[t.f];
  if (!f) return null;
  const dealt = t.o[t.f] ?? [];
  if (tag.term && !dealt.includes(tag.term)) return null;
  const r = gradeTag(f, tag);
  const st = nextStreak(t.st, r);
  const rs = [...t.rs, r.score];
  const ch = [...t.ch, tag.term];
  const reveal: FindingReveal = { ...r, answer: f.a, answerDomain: TERMS[f.a].domain as Domain, why: f.why, whyNot: !r.termOk && tag.term ? whyNot(tag.term, f) || null : null };
  const last = t.f === e.findings.length - 1;
  const next: MseToken = { ...t, f: t.f + 1, rs, ch, st, b: Math.max(t.b, st) };
  if (!last) return { next, reveal, excerptDone: null };
  const score = rs.reduce((a, x) => a + x, 0) / e.findings.length;
  return { next: { ...next, sc: [...t.sc, score] }, reveal, excerptDone: { excerpt: e, scores: rs, score, chosen: ch } };
}

/**
 * After an excerpt: the next one (level moved by the last two scores), or
 * null when the round is over.
 */
export function nextExcerpt(t: MseToken, rng: Rng, history: History, now: number, mask: Mask): { payload: MseToken; excerpt: PublicExcerpt } | null {
  if (t.sc.length < t.k.length || t.k.length >= ROUND_SIZE) return null;
  const lv = nextLevel(t.lv, t.sc);
  const e = pickExcerpt(lv, new Set(seenIds(t, mask)), rng, history, now);
  if (!e) return null;
  const payload = withExcerpt({ ...t, lv }, e, rng, mask);
  return { payload, excerpt: publicExcerpt(e, payload.o, history.has(e.id)) };
}
