import { LINES } from "./lines";
import { stickersFor, type Mood, type Sticker } from "./stickers";

/**
 * Pick a sticker and a line for a mood, steering away from the last few shown
 * on this device so the same pair rarely repeats. The memory lives in
 * localStorage (wrapped: without storage, picks are simply random).
 */

export const RECENT_KEY = "vibha:reactions-recent";
const KEEP_STICKERS = 4;
const KEEP_LINES = 24;

export type Recent = { s: string[]; l: string[] };
export type Reaction = { mood: Mood; sticker: Sticker; line: string };

export function readRecent(): Recent {
  try {
    const v = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "null") as Partial<Recent> | null;
    const ok = (x: unknown): x is string[] => Array.isArray(x) && x.every((y) => typeof y === "string");
    return { s: ok(v?.s) ? v.s : [], l: ok(v?.l) ? v.l : [] };
  } catch {
    return { s: [], l: [] };
  }
}

function writeRecent(r: Recent): void {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(r));
  } catch {
    /* blocked storage: repeats are just a little more likely */
  }
}

/** Least recently used first: anything not in `recent`, else the oldest seen. */
function choose<T>(list: readonly T[], key: (x: T) => string, recent: readonly string[], rand: () => number): T {
  const fresh = list.filter((x) => !recent.includes(key(x)));
  if (fresh.length) return fresh[Math.floor(rand() * fresh.length) % fresh.length];
  const oldest = [...list].sort((a, b) => recent.indexOf(key(a)) - recent.indexOf(key(b)));
  return oldest[0];
}

/** Pure: pick from the given memory and return the new memory. */
export function pickFrom(mood: Mood, recent: Recent, rand: () => number): { reaction: Reaction; recent: Recent } {
  const sticker = choose(stickersFor(mood), (s) => s.id, recent.s, rand);
  const lines = LINES[mood];
  const idx = choose(
    lines.map((_, i) => i),
    (i) => `${mood}:${i}`,
    recent.l,
    rand,
  );
  return {
    reaction: { mood, sticker, line: lines[idx] },
    recent: {
      s: [...recent.s.filter((x) => x !== sticker.id), sticker.id].slice(-KEEP_STICKERS),
      l: [...recent.l.filter((x) => x !== `${mood}:${idx}`), `${mood}:${idx}`].slice(-KEEP_LINES),
    },
  };
}

/** Browser: pick and remember. Call from event handlers or effects, never during render. */
export function pickReaction(mood: Mood, rand: () => number = Math.random): Reaction {
  const { reaction, recent } = pickFrom(mood, readRecent(), rand);
  writeRecent(recent);
  return reaction;
}
