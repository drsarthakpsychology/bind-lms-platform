/**
 * MSE Lab scoring (pure).
 * - Each finding is worth 1: half for the right domain, half for the right word.
 * - A near-miss word ("close") earns half of the word's half.
 * - A round is a set of excerpts at the player's level; the level moves up
 *   after two strong excerpts and down after two weak ones.
 */
import { shuffle, type Rng } from "../common";
import { orderByHistory, type History } from "@/lib/history/order";
import { EXCERPTS, type Excerpt, type Finding } from "./excerpts";
import { TERMS, termById, type Domain } from "./terms";

export type Tag = { domain: Domain | null; term: string | null };
export type TagResult = { score: number; domainOk: boolean; termOk: boolean; close: boolean };

export function acceptedDomains(f: Finding): Domain[] {
  return [TERMS[f.a].domain, ...(f.also ?? [])];
}

export function gradeTag(f: Finding, tag: Tag): TagResult {
  const domainOk = !!tag.domain && acceptedDomains(f).includes(tag.domain);
  const termOk = tag.term === f.a;
  const close = !termOk && !!tag.term && (f.close ?? []).includes(tag.term as never);
  const score = (domainOk ? 0.5 : 0) + (termOk ? 0.5 : close ? 0.25 : 0);
  return { score, domainOk, termOk, close };
}

export function gradeExcerpt(e: Excerpt, tags: Tag[]): { score: number; results: TagResult[] } {
  const results = e.findings.map((f, i) => gradeTag(f, tags[i] ?? { domain: null, term: null }));
  const score = results.reduce((a, r) => a + r.score, 0) / Math.max(1, e.findings.length);
  return { score, results };
}

/** Word options for a finding, in a stable shuffled order. */
export function optionsFor(f: Finding, rng: Rng): string[] {
  return shuffle([f.a, ...f.o.filter((o) => o !== f.a)], rng);
}

/** Points: 10 per full finding, ×(1 + streak bonus) where the streak is fully right findings in a row (capped). */
export function pointsFor(score: number, streak: number): number {
  const mult = 1 + Math.min(streak, 10) * 0.1;
  return Math.round(score * 10 * mult);
}

/** Accuracy streak after one finding: only fully right findings keep it going. */
export function nextStreak(streak: number, r: TagResult): number {
  return r.score >= 1 ? streak + 1 : 0;
}

export type Level = 1 | 2 | 3;

export function nextLevel(level: Level, recent: number[]): Level {
  const last = recent.slice(-2);
  if (last.length < 2) return level;
  if (last.every((s) => s >= 0.8) && level < 3) return (level + 1) as Level;
  if (last.every((s) => s < 0.5) && level > 1) return (level - 1) as Level;
  return level;
}

/** An excerpt counts as right in the answer history at this score or above. */
export const EXCERPT_RIGHT = 0.75;

/**
 * Pick the next excerpt at this level that hasn't been seen this round (falls
 * back to neighbouring levels). With an answer history (src/lib/history): one
 * never seen first, then one missed, then the one right longest ago.
 */
export function pickExcerpt(level: Level, seen: Set<string>, rng: Rng, history?: History, now?: number): Excerpt | null {
  for (const l of [level, (level + 1) as Level, (level - 1) as Level]) {
    const pool = EXCERPTS.filter((e) => e.level === l && !seen.has(e.id));
    if (pool.length) return history ? orderByHistory(pool, (e) => e.id, history, now ?? Date.now(), rng)[0] : pool[Math.floor(rng() * pool.length)];
  }
  return null;
}

export const ROUND_SIZE = 5;

/** The "why not" line for a wrong word pick. */
export function whyNot(chosen: string, f: Finding): string {
  const t = termById(chosen);
  const a = TERMS[f.a];
  if (!t) return "";
  return `${t.label}: ${t.def} Here the better word is ${a.label}.`;
}

/** Split text into plain runs and finding quotes (index into `quotes`), first match wins, no overlaps. */
export function segments(text: string, quotes: string[]): { text: string; idx: number | null }[] {
  const hits: { start: number; end: number; idx: number }[] = [];
  quotes.forEach((q, idx) => {
    const start = text.indexOf(q);
    if (start < 0 || !q) return;
    const end = start + q.length;
    if (hits.some((h) => start < h.end && end > h.start)) return;
    hits.push({ start, end, idx });
  });
  hits.sort((a, b) => a.start - b.start);
  const out: { text: string; idx: number | null }[] = [];
  let at = 0;
  for (const h of hits) {
    if (h.start > at) out.push({ text: text.slice(at, h.start), idx: null });
    out.push({ text: text.slice(h.start, h.end), idx: h.idx });
    at = h.end;
  }
  if (at < text.length) out.push({ text: text.slice(at), idx: null });
  return out;
}
