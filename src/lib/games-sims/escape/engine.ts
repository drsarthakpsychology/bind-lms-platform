/**
 * Escape Room rules (pure). The shared team state lives in games2_teams.state;
 * the server applies answers here, so every member sees the same doors.
 */
import { shuffle, hashString, makeRng } from "../common";
import type { Puzzle, Room } from "./rooms";

export type EscLog = { stage: number; name: string; ok: boolean; at: string };
export type EscState = { room: string; stage: number; wrong: number; tries: number[]; log: EscLog[]; done: boolean };

/** Seconds added to the team's time for each wrong answer. */
export const PENALTY_S = 20;
/** Wrong tries on a door before its hint opens. */
export const HINT_AFTER = 2;

export function startEscape(room: Room): EscState {
  return { room: room.id, stage: 0, wrong: 0, tries: room.puzzles.map(() => 0), log: [], done: false };
}

/** Normalise an answer to the canonical form the checker compares. */
export function normalise(p: Puzzle, raw: string): string {
  const nums = raw
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
    .map(Number)
    .filter((n) => Number.isInteger(n));
  if (p.kind === "multi") return [...new Set(nums)].sort((a, b) => a - b).join(",");
  if (p.kind === "order") return nums.join(",");
  return nums.length ? String(nums[0]) : "";
}

export function isRight(p: Puzzle, raw: string): boolean {
  const a = normalise(p, raw);
  if (p.kind === "pick") return a === String(p.answer);
  if (p.kind === "multi") return a === [...p.answer].sort((x, y) => x - y).join(",");
  if (p.kind === "order") return a === p.items.map((_, i) => i).join(",");
  return a !== "" && p.answer.includes(Number(a));
}

/** Apply one answer from `name`. Answers for a door that is no longer current are ignored. */
export function answer(room: Room, st: EscState, stage: number, raw: string, name: string, at: string): { state: EscState; ok: boolean; applied: boolean } {
  if (st.done || stage !== st.stage) return { state: st, ok: false, applied: false };
  const p = room.puzzles[stage];
  if (!p) return { state: st, ok: false, applied: false };
  const ok = isRight(p, raw);
  const tries = [...st.tries];
  tries[stage] = (tries[stage] ?? 0) + 1;
  const log = [...st.log, { stage, name: name.slice(0, 40), ok, at }].slice(-30);
  if (!ok) return { state: { ...st, tries, wrong: st.wrong + 1, log }, ok, applied: true };
  const next = stage + 1;
  return { state: { ...st, tries, log, stage: Math.min(next, room.puzzles.length - 1), done: next >= room.puzzles.length }, ok, applied: true };
}

export const hintOpen = (st: EscState, stage: number) => (st.tries[stage] ?? 0) >= HINT_AFTER;

/** Team time in ms: the clock plus penalties. */
export function teamTime(startedAt: string | null, endAt: string | number | null, wrong: number): number {
  if (!startedAt) return 0;
  const a = Date.parse(startedAt);
  const b = typeof endAt === "number" ? endAt : endAt ? Date.parse(endAt) : a;
  return Math.max(0, b - a) + wrong * PENALTY_S * 1000;
}

/** XP for escaping: 15 for getting out, up to 20 for speed, minus 1 per wrong answer (at least 5). */
export function escapeXp(ms: number, wrong: number): number {
  const minutes = ms / 60000;
  return Math.max(5, Math.round(15 + Math.max(0, 20 - minutes) - Math.min(10, wrong)));
}

/** The order the items of an order puzzle are shown in (stable for a team, never already solved). */
export function shownOrder(p: Puzzle, seed: string): number[] {
  if (p.kind !== "order") return [];
  const idx = p.items.map((_, i) => i);
  for (let k = 0; k < 6; k++) {
    const s = shuffle(idx, makeRng(hashString(`${seed}:${p.id}:${k}`)));
    if (s.some((v, i) => v !== i)) return s;
  }
  return [...idx].reverse();
}

export type RaceRow = { id: string; name: string; stage: number; done: boolean; ms: number; me: boolean };

/** Finished teams by time, then teams still inside by doors opened. */
export function raceBoard(rows: RaceRow[]): RaceRow[] {
  return [...rows].sort((a, b) => Number(b.done) - Number(a.done) || (a.done ? a.ms - b.ms : b.stage - a.stage || a.ms - b.ms) || a.name.localeCompare(b.name));
}
