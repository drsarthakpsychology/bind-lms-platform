/**
 * Comorbid rules (pure and seeded, so the server can replay a whole game from
 * the seed and the human moves, bot moves included).
 *
 * 1. Build your diagnosis: play symptom cards that belong to it, with at least one core card.
 * 2. Block your rival: play a rule-out that could explain their picture; a normal test clears it.
 * 3. A card that doesn't fit bounces and you lose the turn. First complete, unblocked diagnosis wins.
 */
import type { Attempt } from "@/lib/learn/model/student";
import { hashString, makeRng, shuffle, type Rng } from "../common";
import { CLEAR, DIAGNOSES, RULEOUTS, SYMPTOMS, dxById, type Diagnosis } from "./cards";

export const RULES = [
  "Build your diagnosis: play symptom cards that belong to it, with at least one core card.",
  "Block your rival: play a rule-out that could explain their picture. A normal test clears it.",
  "A card that doesn't fit bounces and you lose the turn. First complete, unblocked diagnosis wins.",
];

export type CardKind = "sym" | "rule" | "clear";
export type Card = { uid: string; kind: CardKind; id: string };
export type Level = 1 | 2 | 3;
export type Seat = { name: string; dx: string; hand: Card[]; built: string[]; blocked: string | null; bot: Level | null };
export type Event = { seat: 0 | 1; card: Card; action: "play" | "swap"; ok: boolean; reason: string };
export type Game = { seed: string; seats: [Seat, Seat]; deck: Card[]; turn: 0 | 1; moves: number; log: Event[]; winner: 0 | 1 | "draw" | null };
export type Move = { uid: string; action: "play" | "swap" };
/** `prefer`: Player 1's diagnosis, picked from the answer history (one not played yet). */
export type Setup = { seed: string; mode: "bot" | "pass"; level: Level; names: [string, string]; prefer?: string };

export const HAND = 5;
export const MAX_MOVES = 60;

const rngFor = (seed: string, tag: string) => makeRng(hashString(`${seed}:${tag}`));

/** Deal a game: two different diagnoses, a deck rich in both, decoys from others, rule-outs and clears. */
export function newGame(s: Setup): Game {
  const rng = rngFor(s.seed, "deal");
  // Pair diagnoses that need a similar number of cards, so neither side starts far ahead.
  const dealt = shuffle(DIAGNOSES, rng);
  const wanted = s.prefer ? dealt.findIndex((d) => d.id === s.prefer) : -1;
  if (wanted > 0) dealt.unshift(...dealt.splice(wanted, 1));
  const [a, ...rest] = dealt;
  const b = rest.find((d) => Math.abs(d.need - a.need) <= 1) ?? rest[0];
  let n = 0;
  const card = (kind: CardKind, id: string): Card => ({ uid: `c${n++}`, kind, id });
  const cards: Card[] = [];
  for (const dx of [a, b]) {
    for (const sym of dx.symptoms) cards.push(card("sym", sym));
    for (const c of dx.core) cards.push(card("sym", c));
    for (const m of dx.must ?? []) cards.push(card("sym", m));
    const rules = RULEOUTS.filter((r) => r.against.includes(dx.id));
    for (const r of shuffle(rules, rng).slice(0, 2)) cards.push(card("rule", r.id));
  }
  const mine = new Set([...a.symptoms, ...b.symptoms]);
  for (const sym of shuffle(
    SYMPTOMS.filter((x) => !mine.has(x.id)),
    rng,
  ).slice(0, 8))
    cards.push(card("sym", sym.id));
  for (const r of shuffle(
    RULEOUTS.filter((x) => !x.against.includes(a.id) && !x.against.includes(b.id)),
    rng,
  ).slice(0, 2))
    cards.push(card("rule", r.id));
  for (let i = 0; i < 3; i++) cards.push(card("clear", CLEAR.id));
  const deck = shuffle(cards, rng);
  const seat = (i: 0 | 1, dx: Diagnosis): Seat => ({ name: s.names[i], dx: dx.id, hand: deck.splice(0, HAND), built: [], blocked: null, bot: i === 1 && s.mode === "bot" ? s.level : null });
  const seats: [Seat, Seat] = [seat(0, a), seat(1, b)];
  return { seed: s.seed, seats, deck, turn: 0, moves: 0, log: [], winner: null };
}

/** Is this play correct? (No state change.) */
export function check(g: Game, seat: 0 | 1, c: Card): { ok: boolean; reason: string } {
  const me = g.seats[seat];
  const rival = g.seats[seat === 0 ? 1 : 0];
  const dx = dxById(me.dx)!;
  if (c.kind === "sym") {
    const s = SYMPTOMS.find((x) => x.id === c.id)!;
    if (!dx.symptoms.includes(c.id)) return { ok: false, reason: `${s.label} isn't one of the ${dx.short} cards.` };
    if (me.built.includes(c.id)) return { ok: false, reason: `${s.label} is already on your ${dx.short}.` };
    return { ok: true, reason: `${s.label} counts towards ${dx.short}.` };
  }
  if (c.kind === "rule") {
    const r = RULEOUTS.find((x) => x.id === c.id)!;
    const rdx = dxById(rival.dx)!;
    if (rival.blocked) return { ok: false, reason: `Their ${rdx.short} is already blocked.` };
    if (!r.against.includes(rdx.id)) return { ok: false, reason: `${r.label} doesn't explain ${rdx.short}.` };
    return { ok: true, reason: `${r.label} could explain their ${rdx.short}. ${r.line}` };
  }
  if (!me.blocked) return { ok: false, reason: "Nothing to clear: you aren't blocked." };
  return { ok: true, reason: "Tests are normal. The rule-out is cleared." };
}

export function progress(seat: Seat): { have: number; need: number; core: boolean; must: boolean; complete: boolean } {
  const dx = dxById(seat.dx)!;
  const core = dx.core.some((c) => seat.built.includes(c));
  const must = (dx.must ?? []).every((c) => seat.built.includes(c));
  const have = seat.built.length;
  return { have, need: dx.need, core, must, complete: have >= dx.need && core && must };
}

const wins = (s: Seat) => progress(s).complete && !s.blocked;

/** Apply a move for whoever's turn it is. Bad moves (unknown card, game over) return the game unchanged. */
export function apply(g: Game, mv: Move): Game {
  if (g.winner !== null) return g;
  const t = g.turn;
  const me = g.seats[t];
  const c = me.hand.find((x) => x.uid === mv.uid);
  if (!c) return g;
  const seats = g.seats.map((s) => ({ ...s, hand: [...s.hand], built: [...s.built] })) as [Seat, Seat];
  const deck = [...g.deck];
  const hand = seats[t].hand.filter((x) => x.uid !== c.uid);
  let ev: Event;
  if (mv.action === "swap") {
    ev = { seat: t, card: c, action: "swap", ok: true, reason: "Swapped for a new card." };
  } else {
    const r = check(g, t, c);
    ev = { seat: t, card: c, action: "play", ...r };
    if (r.ok) {
      if (c.kind === "sym") seats[t].built.push(c.id);
      else if (c.kind === "rule") seats[t === 0 ? 1 : 0].blocked = c.id;
      else seats[t].blocked = null;
    }
  }
  // A bounced card is lost without a replacement: mistakes shrink your hand.
  if (deck.length && ev.ok) hand.push(deck.shift()!);
  seats[t].hand = hand;
  const moves = g.moves + 1;
  let winner: Game["winner"] = wins(seats[t]) ? t : wins(seats[t === 0 ? 1 : 0]) ? (t === 0 ? 1 : 0) : null;
  if (winner === null && (moves >= MAX_MOVES || (!deck.length && !seats[0].hand.length && !seats[1].hand.length))) {
    const p0 = progress(seats[0]).have / progress(seats[0]).need;
    const p1 = progress(seats[1]).have / progress(seats[1]).need;
    winner = p0 === p1 ? "draw" : p0 > p1 ? 0 : 1;
  }
  // Next turn: an empty hand draws one card; with nothing left to draw, that player is skipped.
  let turn: 0 | 1 = t === 0 ? 1 : 0;
  if (!seats[turn].hand.length) {
    if (deck.length) seats[turn].hand = [deck.shift()!];
    else if (seats[t].hand.length) turn = t;
  }
  return { ...g, seats, deck, turn, moves, log: [...g.log, ev].slice(-40), winner };
}

/** The bot's move. Intern (1) often plays at random, Registrar (2) sometimes, Consultant (3) never. */
export function botMove(g: Game): Move | null {
  const t = g.turn;
  const me = g.seats[t];
  const bot = me.bot ?? 3;
  if (!me.hand.length) return null;
  const rng: Rng = rngFor(g.seed, `bot:${g.moves}`);
  const slip = bot === 1 ? 0.5 : bot === 2 ? 0.2 : 0;
  if (rng() < slip) {
    const c = me.hand[Math.floor(rng() * me.hand.length)];
    return { uid: c.uid, action: "play" };
  }
  const valid = me.hand.filter((c) => check(g, t, c).ok);
  const rival = g.seats[t === 0 ? 1 : 0];
  const rp = progress(rival);
  const mp = progress(me);
  const dx = dxById(me.dx)!;
  const pick = (f: (c: Card) => boolean) => valid.find(f);
  const order: (Card | undefined)[] = [];
  // 1. Clear a block if I'm otherwise done; 2. block a rival who is close; 3. core first; 4. any symptom; 5. clear; 6. block.
  if (mp.complete) order.push(pick((c) => c.kind === "clear"));
  if (rp.have >= rp.need - (bot === 3 ? 2 : 1)) order.push(pick((c) => c.kind === "rule"));
  if (!mp.core) order.push(pick((c) => c.kind === "sym" && dx.core.includes(c.id)));
  order.push(pick((c) => c.kind === "sym" && (dx.must ?? []).includes(c.id)));
  order.push(pick((c) => c.kind === "sym"));
  order.push(pick((c) => c.kind === "clear"));
  order.push(pick((c) => c.kind === "rule"));
  const best = order.find(Boolean);
  if (best) return { uid: best.uid, action: "play" };
  // Nothing fits: swap the card least likely to ever help.
  const junk = me.hand.find((c) => (c.kind === "sym" && !dx.symptoms.includes(c.id)) || (c.kind === "rule" && !RULEOUTS.find((r) => r.id === c.id)!.against.includes(rival.dx))) ?? me.hand[0];
  return { uid: junk.uid, action: "swap" };
}

/** Let bots move until it's a human's turn or the game ends. */
export function runBots(g: Game): Game {
  let cur = g;
  for (let i = 0; i < MAX_MOVES && cur.winner === null && cur.seats[cur.turn].bot; i++) {
    const mv = botMove(cur);
    if (!mv) break;
    cur = apply(cur, mv);
  }
  return cur;
}

/**
 * Replay a game from its setup and the human moves (in order). Returns the
 * final game and every graded human play (with the seat that made it).
 */
export function replay(s: Setup, human: Move[]): { game: Game; plays: { seat: 0 | 1; ev: Event; dx: string; rivalDx: string }[] } {
  let g = runBots(newGame(s));
  const plays: { seat: 0 | 1; ev: Event; dx: string; rivalDx: string }[] = [];
  for (const mv of human) {
    if (g.winner !== null) break;
    const t = g.turn;
    const next = apply(g, mv);
    if (next === g) break;
    const ev = next.log[next.log.length - 1];
    if (ev.action === "play") plays.push({ seat: t, ev, dx: g.seats[t].dx, rivalDx: g.seats[t === 0 ? 1 : 0].dx });
    g = runBots(next);
  }
  return { game: g, plays };
}

/** One graded attempt per card played: symptom plays test criteria, rule-outs test the differential. */
export function attemptFor(p: { ev: Event; dx: string; rivalDx: string }): Attempt | null {
  const { card, ok } = p.ev;
  const mine = dxById(p.dx);
  const theirs = dxById(p.rivalDx);
  if (!mine || !theirs) return null;
  if (card.kind === "sym") return { skill: `${mine.topic}:criteria`, item: `comorbid:sym:${mine.id}:${card.id}`, outcome: ok ? 1 : 0 };
  if (card.kind === "rule") return { skill: `${theirs.topic}:differentiate`, item: `comorbid:rule:${theirs.id}:${card.id}`, outcome: ok ? 1 : 0 };
  return null;
}

export function comorbidXp(won: boolean, level: Level, mode: Setup["mode"], rightPlays: number): number {
  const base = mode === "pass" ? 5 : won ? 10 + level * 5 : 5;
  return Math.min(40, base + rightPlays);
}

export { CLEAR };
