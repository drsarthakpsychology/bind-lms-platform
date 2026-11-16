/* The website's src/lib/reactions/pick.ts, kept the same so the app steers
 * away from repeats the same way. The memory lives in this session only
 * (the app has no localStorage); __tests__/reactions.test.ts checks pickFrom
 * against the website's copy. */
import { LINES } from "./lines";
import { stickersFor, type Mood, type Sticker } from "./stickers";

const KEEP_STICKERS = 4;
const KEEP_LINES = 24;

export type Recent = { s: string[]; l: string[] };
export type Reaction = { mood: Mood; sticker: Sticker; line: string };

/** Least recently used first: anything not in `recent`, else the oldest seen. */
function choose<T>(list: readonly T[], key: (x: T) => string, recent: readonly string[], rand: () => number): T {
  const fresh = list.filter((x) => !recent.includes(key(x)));
  if (fresh.length) return fresh[Math.floor(rand() * fresh.length) % fresh.length]!;
  const oldest = [...list].sort((a, b) => recent.indexOf(key(a)) - recent.indexOf(key(b)));
  return oldest[0]!;
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
    reaction: { mood, sticker, line: lines[idx]! },
    recent: {
      s: [...recent.s.filter((x) => x !== sticker.id), sticker.id].slice(-KEEP_STICKERS),
      l: [...recent.l.filter((x) => x !== `${mood}:${idx}`), `${mood}:${idx}`].slice(-KEEP_LINES),
    },
  };
}

let memory: Recent = { s: [], l: [] };

/** Pick and remember (this session). Call from handlers or effects, never during render. */
export function pickReaction(mood: Mood, rand: () => number = Math.random): Reaction {
  const { reaction, recent } = pickFrom(mood, memory, rand);
  memory = recent;
  return reaction;
}
