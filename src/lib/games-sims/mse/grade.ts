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
import type { Level, Tag, TagResult } from "./rules";

export { EXCERPT_RIGHT, nextLevel, nextStreak, pointsFor, ROUND_SIZE, segments, type Level, type Tag, type TagResult } from "./rules";

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

/** The "why not" line for a wrong word pick. */
export function whyNot(chosen: string, f: Finding): string {
  const t = termById(chosen);
  const a = TERMS[f.a];
  if (!t) return "";
  return `${t.label}: ${t.def} Here the better word is ${a.label}.`;
}
