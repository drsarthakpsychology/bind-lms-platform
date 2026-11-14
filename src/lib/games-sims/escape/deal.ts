/**
 * Escape Room, dealt on the server. The browser gets a room's cards, then
 * only the current door (no answer), its hint once two misses open it, and
 * each door's explanation and new case-file page once it is open. Pure (the
 * order seed is passed in), so every rule is unit-tested; the server actions
 * live in src/app/(dashboard)/games/escape/actions.ts.
 *
 * A practice run is a signed token holding the run's state (door, wrong
 * tries, start time on the server clock), so the server counts every wrong
 * try and times the run itself.
 */
import { answer, HINT_AFTER, shownOrder, startEscape, type EscState } from "./engine";
import { ROOMS, roomById, type Puzzle, type Room } from "./rooms";
import type { PublicDoor, RoomCard, RoomView } from "./types";

export function roomCard(r: Room): RoomCard {
  return { id: r.id, title: r.title, place: r.place, patient: r.patient, intro: r.intro, doors: r.puzzles.length };
}

export const roomCards = (): RoomCard[] => ROOMS.map(roomCard);

/** The door without its answer, hint or explanation. `seed` (secret) shuffles an order door. */
export function publicDoor(p: Puzzle, seed: string): PublicDoor {
  const base = { id: p.id, stage: p.stage, prompt: p.prompt };
  if (p.kind === "pick" || p.kind === "multi") return { ...base, kind: p.kind, options: [...p.options] };
  if (p.kind === "order") return { ...base, kind: "order", items: shownOrder(p, seed).map((i) => p.items[i]) };
  return { ...base, kind: "number", min: p.min, max: p.max, ...(p.unit ? { unit: p.unit } : {}) };
}

/** The room as the browser may see it at this state. */
export function roomView(r: Room, st: EscState, seed: string): RoomView {
  const open = st.done ? r.puzzles.length : st.stage;
  const cur = st.done ? null : r.puzzles[st.stage];
  return {
    ...roomCard(r),
    stages: r.puzzles.map((p) => p.stage),
    door: cur ? publicDoor(cur, seed) : null,
    hint: cur && (st.tries[st.stage] ?? 0) >= HINT_AFTER ? cur.hint : null,
    opened: r.puzzles.slice(0, open).map((p) => ({ stage: p.stage, why: p.why, unlock: p.unlock, skill: p.skill })),
    outro: st.done ? r.outro : null,
  };
}

/**
 * The browser's answer in the form the checker compares. An order door's
 * answer lists shown positions, so it is turned back into item numbers.
 */
export function canonical(p: Puzzle, raw: string, seed: string): string {
  if (p.kind !== "order") return raw;
  const shown = shownOrder(p, seed);
  return raw
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => (/^\d+$/.test(x) ? shown[Number(x)] : undefined))
    .map((v) => (v === undefined ? "-1" : String(v)))
    .join(",");
}

/* ------------------------------------------------------------ practice */

/** A practice run's signed payload: who, which run and room, the server start time, and the state. */
export type PracticeToken = { u: string; run: string; room: string; t0: number; s: number; w: number; tr: number[]; d: boolean; el?: number };

export function practiceStart(userId: string, run: string, room: Room, now: number): PracticeToken {
  const st = startEscape(room);
  return { u: userId, run, room: room.id, t0: now, s: st.stage, w: st.wrong, tr: st.tries, d: st.done };
}

/** The room and state behind a verified token, for this student only. */
export function practiceState(t: PracticeToken | null, userId: string): { room: Room; st: EscState } | null {
  if (!t || t.u !== userId || typeof t.room !== "string" || !Number.isInteger(t.s) || !Number.isInteger(t.w) || !Array.isArray(t.tr)) return null;
  const room = roomById(t.room);
  if (!room || t.s < 0 || t.s >= room.puzzles.length || t.tr.length !== room.puzzles.length) return null;
  return { room, st: { room: room.id, stage: t.s, wrong: t.w, tries: t.tr.map((x) => (Number.isInteger(x) && x >= 0 ? x : 0)), log: [], done: t.d === true } };
}

/** One practice answer. `first` is true for the first try at that door. */
export function practiceAnswer(t: PracticeToken, room: Room, st: EscState, stage: number, raw: string, seed: string): { next: PracticeToken; state: EscState; ok: boolean; first: boolean; door: Puzzle } | null {
  const door = room.puzzles[stage];
  if (!door) return null;
  const res = answer(room, st, stage, canonical(door, raw, seed), "You", "");
  if (!res.applied) return null;
  const s = res.state;
  return { next: { ...t, s: s.stage, w: s.wrong, tr: s.tries, d: s.done }, state: s, ok: res.ok, first: (st.tries[stage] ?? 0) === 0, door };
}

/**
 * Carry on a run left half-way: the clock picks up from the last answer
 * (time away from the room does not count).
 */
export function practiceResume(t: PracticeToken, now: number): PracticeToken {
  const el = Math.max(0, Math.min(864e5, Number.isFinite(t.el) ? (t.el as number) : 0));
  return { ...t, t0: now - el, el };
}
