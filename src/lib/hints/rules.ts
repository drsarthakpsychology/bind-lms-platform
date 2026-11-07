/**
 * The hint economy (plan section 9, owner decisions 7 Nov 2026). Pure, so
 * every rule is unit-tested; src/lib/hints/server.ts does the reading and
 * writing.
 *
 * - 3 free hints a day (India time), refilled at midnight, no carry over.
 * - Spare hints: start at 5, cap 10, earned from good habits. Spent after
 *   the free ones (and after any hints bought today, which expire tonight).
 * - Once a day a student may buy 3 hints for 30 XP (from the one XP wallet).
 * - Help after a wrong answer is always free and never counts as a hint.
 * - A hint lowers that item's reward, never the XP balance.
 * - From the 4th clue in a case, a guess must come before the next clue.
 * - No hints in Differential duel or Blitz.
 */

export const FREE_PER_DAY = 3;
export const SPARE_START = 5;
export const SPARE_CAP = 10;
export const BUY_COUNT = 3;
export const BUY_COST = 30;
/** The clue from which a guess is needed before it opens. */
export const GUESS_FROM_CLUE = 4;

/** Games that offer hints, and how many each item allows. */
export const MAX_PER_ITEM = { daily: 2, detective: 1, rx: 1, mse: 1, ward: 1, comorbid: 1 } as const;
export type HintGame = keyof typeof MAX_PER_ITEM;
/** Ranked and timed play: never any hints. */
export const NO_HINT_GAMES = ["duel", "blitz"] as const;

export function hintsAllowedIn(game: string): game is HintGame {
  if ((NO_HINT_GAMES as readonly string[]).includes(game)) return false;
  return Object.prototype.hasOwnProperty.call(MAX_PER_ITEM, game);
}

/** Item keys always start with the game ("rx:run:item"). */
export function itemKey(game: HintGame, ...parts: (string | number)[]): string {
  return [game, ...parts.map((p) => String(p).replace(/[^A-Za-z0-9_.-]/g, "").slice(0, 60))].join(":").slice(0, 200);
}

export type Pool = "free" | "bought" | "spare";

/** One stored use or earning of hints. */
export type HintRow = {
  pool: Pool | "earn";
  /** Change to the spare bank (spare spend -1, earnings +n, free and bought 0). */
  delta: number;
  /** IST day (YYYY-MM-DD). */
  day: string;
  item: string | null;
  step: number | null;
};

export type Wallet = {
  day: string;
  free: number;
  bought: number;
  spare: number;
  /** Hints a student can use right now. */
  left: number;
  boughtToday: boolean;
  canBuy: boolean;
};

export type WalletOpts = {
  boughtToday: boolean;
  /** False while the hint table is missing: only the 3 free hints work. */
  full: boolean;
  /** XP the student can spend (null when unknown, which blocks buying). */
  xp: number | null;
};

export function spareOf(rows: readonly HintRow[]): number {
  const sum = rows.reduce((a, r) => (r.pool === "spare" || r.pool === "earn" ? a + (Number.isFinite(r.delta) ? r.delta : 0) : a), 0);
  return Math.max(0, Math.min(SPARE_CAP, SPARE_START + sum));
}

export function walletOf(rows: readonly HintRow[], today: string, o: WalletOpts): Wallet {
  const usedFree = rows.filter((r) => r.pool === "free" && r.day === today).length;
  const usedBought = rows.filter((r) => r.pool === "bought" && r.day === today).length;
  const free = Math.max(0, FREE_PER_DAY - usedFree);
  const bought = o.full && o.boughtToday ? Math.max(0, BUY_COUNT - usedBought) : 0;
  const spare = o.full ? spareOf(rows) : 0;
  const canBuy = o.full && !o.boughtToday && o.xp !== null && o.xp >= BUY_COST;
  return { day: today, free, bought, spare, left: free + bought + spare, boughtToday: o.boughtToday, canBuy };
}

/** Which pool the next hint comes from: free, then today's bought ones (they expire), then spare. */
export function nextPool(w: Pick<Wallet, "free" | "bought" | "spare">): Pool | null {
  if (w.free > 0) return "free";
  if (w.bought > 0) return "bought";
  if (w.spare > 0) return "spare";
  return null;
}

/**
 * The unique slot a use takes. Two requests racing for the same slot can't
 * both be stored, so the daily limit holds even under double taps.
 */
export function slotFor(pool: Pool, rows: readonly HintRow[], today: string): string {
  if (pool === "spare") return `spare:${rows.filter((r) => r.pool === "spare").length + 1}`;
  return `${pool}:${today}:${rows.filter((r) => r.pool === pool && r.day === today).length + 1}`;
}

/** Highest hint step already granted for each item. */
export function stepsByItem(rows: readonly HintRow[]): Map<string, number> {
  const out = new Map<string, number>();
  for (const r of rows) if (r.item && r.step) out.set(r.item, Math.max(out.get(r.item) ?? 0, r.step));
  return out;
}

/** An earning never pushes the bank over the cap. */
export function earnDelta(spare: number, want: number): number {
  return Math.max(0, Math.min(Math.round(want), SPARE_CAP - spare));
}

export type EarnInput = { today: string; streak: number; streakKeptToday: boolean; goalHit: boolean; questsDone: boolean };
export type Earning = { slot: string; want: number; why: "streak" | "goal" | "quests" };

/** Spare hints earned today from good habits (each once a day). */
export function earningsFor(e: EarnInput): Earning[] {
  const out: Earning[] = [];
  if (e.streakKeptToday && e.streak >= 2) out.push({ slot: `earn:streak:${e.today}`, want: 1, why: "streak" });
  if (e.goalHit) out.push({ slot: `earn:goal:${e.today}`, want: 1, why: "goal" });
  if (e.questsDone) out.push({ slot: `earn:quests:${e.today}`, want: 2, why: "quests" });
  return out;
}

/* ------------------------------------------------------- reward cuts */

/** Highest student-model outcome after 0, 1 or 2 hints. */
export const OUTCOME_CAP = [1, 0.6, 0.3] as const;
/** Share of an item's points kept after 0, 1 or 2 hints. */
export const POINTS_KEPT = [1, 0.5, 0.25] as const;
/** Daily case score lost per hint. */
export const CASE_SCORE_PER_HINT = 10;

const idx = (hints: number) => Math.max(0, Math.min(2, Math.floor(Number.isFinite(hints) ? hints : 0)));

export function cappedOutcome(outcome: number, hints: number): number {
  return Math.min(outcome, OUTCOME_CAP[idx(hints)]);
}

export function hintedPoints(points: number, hints: number): number {
  return Math.round(points * POINTS_KEPT[idx(hints)]);
}

/** Can clue `next` (1-based) open? From clue 4 on, only after a guess since the last clue opened. */
export function clueOpens(next: number, guessedSinceLastClue: boolean): boolean {
  return next < GUESS_FROM_CLUE || guessedSinceLastClue;
}

/* ----------------------------------------------------- rule out two */

/**
 * The wrong options a "rule out two" hint removes: never one in `keep`, and
 * always leaves at least two options. Stable for the same seed.
 */
export function ruleOut(options: readonly string[], keep: readonly string[], seed: number, n = 2): string[] {
  const keepSet = new Set(keep);
  const wrong = [...new Set(options)].filter((o) => !keepSet.has(o));
  const room = Math.max(0, new Set(options).size - 2);
  let s = seed >>> 0 || 1;
  const rand = () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
  for (let i = wrong.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [wrong[i], wrong[j]] = [wrong[j], wrong[i]];
  }
  return wrong.slice(0, Math.min(n, room));
}

/* ----------------------------------------------------------- copy */

export function statusLine(w: Pick<Wallet, "free" | "bought" | "spare">): string {
  const parts = [`${w.free} free today`];
  if (w.bought) parts.push(`${w.bought} bought today`);
  parts.push(`${w.spare} spare`);
  return parts.join(", ");
}

export const NO_HINTS_HERE = "No hints in this game.";

export function outOfHints(w: Pick<Wallet, "canBuy" | "boughtToday">, full: boolean): string {
  if (!full) return "You've used today's 3 free hints. They come back at midnight.";
  if (w.canBuy) return `No hints left. Get ${BUY_COUNT} for ${BUY_COST} XP, or wait for midnight.`;
  if (w.boughtToday) return "No hints left today. Free hints come back at midnight.";
  return `No hints left. Free hints come back at midnight. You need ${BUY_COST} XP to buy more.`;
}
