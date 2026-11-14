import { describe, expect, it } from "vitest";
import type { HistoryRow } from "@/lib/history/order";
import { arrangeCases, freshRound, nextCase, weeklyDrip, type ArrangeOpts } from "./fresh";
import { CAMPAIGNS, campaignById } from "@/lib/games-sims/ward/campaigns";
import { bestOption, currentDecision, replay } from "@/lib/games-sims/ward/engine";
import { ROOMS } from "@/lib/games-sims/escape/rooms";
import { answer as escapeAnswer, startEscape, type EscState } from "@/lib/games-sims/escape/engine";
import { SEED_OSCE_STATIONS } from "@/lib/practice/osce";
import { FORMULATION_CASES } from "@/lib/practice/formulation-cases";
import { LANDMARK_CASES } from "@/lib/landmark/cases";
import { CLINICS } from "@/lib/practice/clinic";
import { SCENARIOS } from "@/lib/learn/scenarios";
import { CASES as DETECTIVE } from "@/lib/learn/detective";
import { deal } from "@/lib/learn/detective-deal";
import { SMALL_THINGS, smallItem } from "@/lib/mse/small-things";
import { OBSERVE_STIMULI } from "@/lib/practice/mse-observe-stimuli";
import { FULL_MSE_STIMULI } from "@/lib/mse/mse4-stimuli";
import { EXCERPTS } from "@/lib/games-sims/mse/excerpts";
import { pickExcerpt } from "@/lib/games-sims/mse/grade";
import { makeRng } from "@/lib/games-sims/common";
import { CASES as DAILY } from "@/lib/games/daily/cases";
import { pickPractice, type PracticeRecord } from "@/lib/games/daily/engine";
import { seededRng } from "@/lib/history/order";

const NOW = Date.parse("2026-11-18T06:30:00Z");
const DAY = 86_400_000;
const done = (item: string, ok = true, at = NOW - DAY): HistoryRow => ({ item, seen: 1, ok, at, due: null });
const H = (ids: readonly string[], ok = true) => new Map(ids.map((id, i) => [id, done(id, ok, NOW - DAY - i)]));
const opts = <T,>(history: Map<string, HistoryRow>, extra: Partial<ArrangeOpts<T>> = {}): ArrangeOpts<T> => ({ history, now: NOW, student: "s1", ...extra });

/** Every library, as the tool lists it. */
const LIBRARIES: { name: string; ids: string[] }[] = [
  { name: "Ward Week", ids: CAMPAIGNS.map((c) => c.id) },
  { name: "Escape Room", ids: ROOMS.map((r) => r.id) },
  { name: "OSCE", ids: SEED_OSCE_STATIONS.map((s) => s.id) },
  { name: "Formulation", ids: FORMULATION_CASES.map((c) => c.id) },
  { name: "Landmark", ids: LANDMARK_CASES.map((c) => c.id) },
  { name: "Two-minute clinic", ids: CLINICS.map((c) => c.id) },
  { name: "What would you do", ids: SCENARIOS.map((x) => x.id) },
  { name: "Clinic detective", ids: DETECTIVE.map((c) => c.answer) },
  { name: "MSE trainer (observe)", ids: OBSERVE_STIMULI.map((x) => x.id) },
  { name: "MSE trainer (full)", ids: FULL_MSE_STIMULI.map((x) => x.id) },
  { name: "MSE small things", ids: SMALL_THINGS.map((x) => smallItem(x.id)) },
  { name: "MSE Lab", ids: EXCERPTS.map((x) => x.id) },
  { name: "Daily case practice", ids: DAILY.map((c) => c.id) },
];

describe("every case library: the next case is never a done one while any is left", () => {
  for (const lib of LIBRARIES) {
    it(lib.name, () => {
      expect(new Set(lib.ids).size).toBe(lib.ids.length);
      // All done but the last one: that one comes next, every time.
      const left = lib.ids[lib.ids.length - 1];
      const h = H(lib.ids.slice(0, -1));
      for (let k = 0; k < 3; k++) {
        const n = nextCase(lib.ids, (x) => x, opts(h, { rng: seededRng(k) }));
        expect(n).toEqual({ item: left, recycled: false });
      }
      // Done cases sit below every new one on the pick list.
      const half = H(lib.ids.filter((_, i) => i % 2 === 0));
      const a = arrangeCases(lib.ids, (x) => x, opts(half));
      const firstDone = a.list.findIndex((x) => x.mark === "done");
      expect(a.list.slice(firstDone).every((x) => x.mark === "done")).toBe(true);
      expect(a.list).toHaveLength(lib.ids.length);
      // Recycling only once every case is done.
      expect(a.recycled).toBe(false);
      expect(arrangeCases(lib.ids, (x) => x, opts(H(lib.ids))).recycled).toBe(true);
    });
  }
});

describe("the weekly new set is deterministic per student and week", () => {
  for (const lib of LIBRARIES) {
    it(lib.name, () => {
      const a = [...weeklyDrip(lib.ids, "s1", new Map(), NOW)].sort();
      expect([...weeklyDrip([...lib.ids].reverse(), "s1", new Map(), NOW + 2 * DAY)].sort()).toEqual(a);
      const shown = arrangeCases(lib.ids, (x) => x, opts(new Map())).list.filter((x) => x.mark === "week").map((x) => x.id).sort();
      expect(shown).toEqual(a);
    });
  }
});

describe("rounds and deals hold new cases only", () => {
  it("What would you do: a round of 5 new patients, recycled only when all are played", () => {
    const h = H(SCENARIOS.slice(0, -2).map((x) => x.id));
    const r = freshRound(SCENARIOS, (x) => x.id, 5, opts(h, { rng: seededRng(3) }));
    expect(r.recycled).toBe(false);
    expect(r.round.map((x) => x.id).sort()).toEqual(SCENARIOS.slice(-2).map((x) => x.id).sort());
    const all = freshRound(SCENARIOS, (x) => x.id, 5, opts(H(SCENARIOS.map((x) => x.id)), { rng: seededRng(3) }));
    expect(all).toMatchObject({ recycled: true });
    expect(all.round).toHaveLength(5);
  });

  it("Clinic detective: the deal holds only cases never done", () => {
    const ids = DETECTIVE.map((c) => c.answer);
    const h = H(ids.slice(3));
    const picked = freshRound(ids, (x) => x, 8, opts(h, { rng: seededRng(1) }));
    expect(picked.round.sort()).toEqual(ids.slice(0, 3).sort());
    const { rounds } = deal("u1", "run1", picked.round, () => 7, seededRng(2));
    expect(rounds).toHaveLength(3);
    const firstClues = new Set(DETECTIVE.slice(0, 3).map((c) => c.clues[0]));
    expect(rounds.every((r) => firstClues.has(r.clue))).toBe(true);
  });

  it("MSE Lab: never a done excerpt while any excerpt is new", () => {
    const leftOver = EXCERPTS[EXCERPTS.length - 1];
    const h = H(EXCERPTS.slice(0, -1).map((e) => e.id));
    for (let seed = 1; seed < 5; seed++) expect(pickExcerpt(EXCERPTS[0].level, new Set(), makeRng(seed), h, NOW)?.id).toBe(leftOver.id);
  });

  it("Daily case practice: a case never played first, this week's new ones leading", () => {
    const played: PracticeRecord[] = DAILY.slice(0, -4).map((c) => ({ id: c.id, score: 80, difficulty: c.difficulty, solved: true }));
    const left = new Set(DAILY.slice(-4).map((c) => c.id));
    for (const roll of [0, 0.3, 0.7, 0.99]) expect(left.has(pickPractice(DAILY, played, "none", roll)!)).toBe(true);
    const prefer = new Set([DAILY[DAILY.length - 1].id]);
    const same = DAILY.filter((c) => left.has(c.id) && c.difficulty === DAILY[DAILY.length - 1].difficulty);
    if (same.length > 1) expect(pickPractice(DAILY, played, "none", 0, prefer)).toBe(DAILY[DAILY.length - 1].id);
  });
});

describe("a resume restores the step", () => {
  it("Ward Week: the saved choices replay to the same session and decision", () => {
    const c = campaignById(CAMPAIGNS[0].id)!;
    let st = replay(c, []);
    const choices: string[] = [];
    for (let i = 0; i < 3 && !st.done; i++) {
      const d = currentDecision(c, st)!;
      choices.push(bestOption(d).id);
      st = replay(c, choices);
    }
    // What is saved travels as JSON (browser copy and the server's jsonb).
    const saved = JSON.parse(JSON.stringify({ choices, run: "r1" })) as { choices: string[] };
    const back = replay(c, saved.choices);
    expect(back.chapter).toBe(st.chapter);
    expect(currentDecision(c, back)?.id).toBe(currentDecision(c, st)?.id);
    expect(back.vars).toEqual(st.vars);
  });

  it("Escape Room: the saved state reopens at the same door with the same misses", () => {
    const room = ROOMS[0];
    let st: EscState = startEscape(room);
    st = escapeAnswer(room, st, 0, "999", "You", "t").state; // a miss
    const p0 = room.puzzles[0];
    const right = p0.kind === "pick" ? String(p0.answer) : p0.kind === "multi" ? p0.answer.join(",") : p0.kind === "order" ? p0.items.map((_, i) => i).join(",") : String(p0.answer[0]);
    st = escapeAnswer(room, st, 0, right, "You", "t").state;
    const saved = JSON.parse(JSON.stringify({ st, answers: [right], run: "r", elapsed: 42_000 })) as { st: EscState; elapsed: number };
    expect(saved.st.stage).toBe(1);
    expect(saved.st.wrong).toBe(1);
    expect(saved.st.tries).toEqual(st.tries);
    expect(saved.elapsed).toBe(42_000);
  });

  it("a half-done case is the one offered first, in every library", () => {
    for (const lib of LIBRARIES) {
      const mid = lib.ids[Math.floor(lib.ids.length / 2)];
      expect(nextCase(lib.ids, (x) => x, opts(new Map(), { started: new Set([mid]) }))?.item).toBe(mid);
    }
  });
});
