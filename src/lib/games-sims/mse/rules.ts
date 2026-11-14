/**
 * MSE Lab's numbers, scoring rules and the shapes the browser holds, with no
 * excerpt data in this file, so the game screen can import it without
 * carrying the answers. The excerpts are read on the server only
 * (excerpts.ts, grade.ts, deal.ts). The vocabulary (terms.ts) is a glossary
 * and holds no answers.
 */
import type { Domain } from "./terms";

export type Level = 1 | 2 | 3;
export type Tag = { domain: Domain | null; term: string | null };
export type TagResult = { score: number; domainOk: boolean; termOk: boolean; close: boolean };

/** Points: 10 per full finding, ×(1 + streak bonus) where the streak is fully right findings in a row (capped). */
export function pointsFor(score: number, streak: number): number {
  const mult = 1 + Math.min(streak, 10) * 0.1;
  return Math.round(score * 10 * mult);
}

/** Accuracy streak after one finding: only fully right findings keep it going. */
export function nextStreak(streak: number, r: TagResult): number {
  return r.score >= 1 ? streak + 1 : 0;
}

export function nextLevel(level: Level, recent: number[]): Level {
  const last = recent.slice(-2);
  if (last.length < 2) return level;
  if (last.every((s) => s >= 0.8) && level < 3) return (level + 1) as Level;
  if (last.every((s) => s < 0.5) && level > 1) return (level - 1) as Level;
  return level;
}

/** An excerpt counts as right in the answer history at this score or above. */
export const EXCERPT_RIGHT = 0.75;
export const ROUND_SIZE = 5;

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

/** An excerpt as the browser sees it: the interview, the quotes to tag and each one's word options, never the answers. */
export type PublicExcerpt = { level: Level; who: string; place: string; lines: ["D" | "P" | "R", string][]; note: string; quotes: string[]; options: string[][] };

/** What a finding shows once it is tagged. */
export type FindingReveal = TagResult & { answer: string; answerDomain: Domain; why: string; whyNot: string | null };
