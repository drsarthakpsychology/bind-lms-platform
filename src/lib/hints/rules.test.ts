import { describe, expect, it } from "vitest";
import { istToday } from "@/lib/practice/streaks";
import {
  BUY_COST,
  cappedOutcome,
  clueOpens,
  earnDelta,
  earningsFor,
  FREE_PER_DAY,
  hintedPoints,
  hintsAllowedIn,
  itemKey,
  nextPool,
  ruleOut,
  slotFor,
  SPARE_CAP,
  SPARE_START,
  spareOf,
  stepsByItem,
  walletOf,
  type HintRow,
} from "./rules";
import { allDone, isGameSource, POINTS_QUEST, questProgress, questsFor } from "./quests";

const free = (day: string, item = "rx:a:b", step = 1): HintRow => ({ pool: "free", delta: 0, day, item, step });
const spare = (day: string): HintRow => ({ pool: "spare", delta: -1, day, item: "rx:a:c", step: 1 });
const earn = (day: string, n: number): HintRow => ({ pool: "earn", delta: n, day, item: null, step: null });
const full = { boughtToday: false, full: true, xp: 100 };

describe("daily free hints", () => {
  it("gives 3 free a day", () => {
    const w = walletOf([], "2026-11-07", full);
    expect(w.free).toBe(FREE_PER_DAY);
    expect(w.spare).toBe(SPARE_START);
    expect(w.left).toBe(FREE_PER_DAY + SPARE_START);
  });

  it("refills across IST midnight, not UTC midnight", () => {
    // 23:59 IST on 7 Nov is 18:29 UTC; 00:01 IST on 8 Nov is 18:31 UTC the same UTC day.
    const before = istToday(new Date("2026-11-07T18:29:00Z"));
    const after = istToday(new Date("2026-11-07T18:31:00Z"));
    expect(before).toBe("2026-11-07");
    expect(after).toBe("2026-11-08");
    const rows = [free(before), free(before), free(before)];
    expect(walletOf(rows, before, full).free).toBe(0);
    expect(walletOf(rows, after, full).free).toBe(3);
  });

  it("does not carry unused free hints over", () => {
    expect(walletOf([free("2026-11-06")], "2026-11-07", full).free).toBe(3);
    expect(walletOf([], "2026-11-07", full).free).toBe(3);
  });
});

describe("spare hints", () => {
  it("start at 5 and never go above the cap of 10", () => {
    expect(spareOf([])).toBe(SPARE_START);
    expect(spareOf([earn("d", 3), earn("d", 9)])).toBe(SPARE_CAP);
    expect(earnDelta(9, 2)).toBe(1);
    expect(earnDelta(10, 2)).toBe(0);
    expect(earnDelta(5, 2)).toBe(2);
  });

  it("are spent only after the free ones", () => {
    const today = "2026-11-07";
    let w = walletOf([], today, full);
    expect(nextPool(w)).toBe("free");
    w = walletOf([free(today), free(today), free(today)], today, full);
    expect(nextPool(w)).toBe("spare");
    w = walletOf([free(today), free(today), free(today), ...Array.from({ length: 5 }, () => spare(today))], today, full);
    expect(w.spare).toBe(0);
    expect(nextPool(w)).toBeNull();
  });

  it("bought hints are used before spares and expire at midnight", () => {
    const today = "2026-11-07";
    const rows = [free(today), free(today), free(today)];
    const w = walletOf(rows, today, { ...full, boughtToday: true });
    expect(w.bought).toBe(3);
    expect(nextPool(w)).toBe("bought");
    expect(walletOf(rows, "2026-11-08", { ...full, boughtToday: false }).bought).toBe(0);
  });

  it("are earned from the streak, the daily goal and finishing all quests, once a day each", () => {
    const e = earningsFor({ today: "2026-11-07", streak: 4, streakKeptToday: true, goalHit: true, questsDone: true });
    expect(e.map((x) => x.why)).toEqual(["streak", "goal", "quests"]);
    expect(e.map((x) => x.slot)).toEqual(["earn:streak:2026-11-07", "earn:goal:2026-11-07", "earn:quests:2026-11-07"]);
    expect(earningsFor({ today: "2026-11-07", streak: 1, streakKeptToday: true, goalHit: false, questsDone: false })).toEqual([]);
  });
});

describe("buying hints", () => {
  it("is allowed once a day and only if the XP balance allows", () => {
    const today = "2026-11-07";
    expect(walletOf([], today, { ...full, xp: BUY_COST }).canBuy).toBe(true);
    expect(walletOf([], today, { ...full, xp: BUY_COST - 1 }).canBuy).toBe(false);
    expect(walletOf([], today, { ...full, boughtToday: true }).canBuy).toBe(false);
    expect(walletOf([], today, { ...full, xp: null }).canBuy).toBe(false);
  });
});

describe("fail closed", () => {
  it("without the hint table only the 3 free hints work: no spares, no buying", () => {
    const w = walletOf([], "2026-11-07", { boughtToday: true, full: false, xp: 1000 });
    expect(w.free).toBe(3);
    expect(w.spare).toBe(0);
    expect(w.bought).toBe(0);
    expect(w.canBuy).toBe(false);
    expect(w.left).toBe(3);
  });

  it("slots are unique per day so a double tap can't take two of the same", () => {
    const today = "2026-11-07";
    expect(slotFor("free", [], today)).toBe("free:2026-11-07:1");
    expect(slotFor("free", [free(today)], today)).toBe("free:2026-11-07:2");
    expect(slotFor("free", [free("2026-11-06")], today)).toBe("free:2026-11-07:1");
    expect(slotFor("spare", [spare(today), spare("2026-11-01")], today)).toBe("spare:3");
  });
});

describe("where hints are allowed", () => {
  it("never in Differential duel or Blitz", () => {
    expect(hintsAllowedIn("duel")).toBe(false);
    expect(hintsAllowedIn("blitz")).toBe(false);
    expect(hintsAllowedIn("nonsense")).toBe(false);
    for (const g of ["daily", "detective", "rx", "mse", "ward", "comorbid"]) expect(hintsAllowedIn(g)).toBe(true);
  });

  it("item keys start with the game and drop odd characters", () => {
    expect(itemKey("rx", "run 1", "chain:x")).toBe("rx:run1:chainx");
  });

  it("remembers the highest step granted per item", () => {
    const m = stepsByItem([free("d", "daily:x", 1), free("d", "daily:x", 2), free("d", "rx:y", 1)]);
    expect(m.get("daily:x")).toBe(2);
    expect(m.get("rx:y")).toBe(1);
  });
});

describe("reward cuts", () => {
  it("a hint lowers the item's reward, never below zero", () => {
    expect(cappedOutcome(1, 0)).toBe(1);
    expect(cappedOutcome(1, 1)).toBe(0.6);
    expect(cappedOutcome(1, 2)).toBe(0.3);
    expect(cappedOutcome(0, 2)).toBe(0);
    expect(hintedPoints(100, 0)).toBe(100);
    expect(hintedPoints(100, 1)).toBe(50);
    expect(hintedPoints(100, 5)).toBe(25);
  });
});

describe("guess before clue 4", () => {
  it("clues 2 and 3 open freely; from clue 4 a guess must come first", () => {
    expect(clueOpens(2, false)).toBe(true);
    expect(clueOpens(3, false)).toBe(true);
    expect(clueOpens(4, false)).toBe(false);
    expect(clueOpens(4, true)).toBe(true);
    expect(clueOpens(6, false)).toBe(false);
  });
});

describe("rule out two", () => {
  it("never removes the answer and leaves at least two options", () => {
    const opts = ["a", "b", "c", "d"];
    for (let seed = 1; seed < 50; seed++) {
      const out = ruleOut(opts, ["b"], seed);
      expect(out).toHaveLength(2);
      expect(out).not.toContain("b");
    }
    expect(ruleOut(["a", "b", "c"], ["a"], 3)).toHaveLength(1);
    expect(ruleOut(["a", "b"], ["a"], 3)).toHaveLength(0);
    expect(ruleOut(opts, ["b"], 7)).toEqual(ruleOut(opts, ["b"], 7));
  });
});

describe("daily quests", () => {
  it("three varied quests, the same all day", () => {
    const q = questsFor("u1", "2026-11-07");
    expect(q).toHaveLength(3);
    expect(new Set(q).size).toBe(3);
    expect(["section", "note"]).toContain(q[0]);
    expect(["case", "game"]).toContain(q[1]);
    expect(q[2]).toBe("points");
    expect(questsFor("u1", "2026-11-07")).toEqual(q);
  });

  it("shows quiet progress and knows when all are done", () => {
    const s = { sectionToday: true, noteToday: false, caseToday: true, gameToday: false, pointsToday: 12 };
    const v = questProgress(["section", "case", "points"], s);
    expect(v.map((x) => x.done)).toEqual([true, true, false]);
    expect(v[2].progress).toBe(`12/${POINTS_QUEST}`);
    expect(allDone(v)).toBe(false);
    expect(allDone(questProgress(["section", "case", "points"], { ...s, pointsToday: POINTS_QUEST }))).toBe(true);
  });

  it("counts server-paid games", () => {
    expect(isGameSource("games2:rx")).toBe(true);
    expect(isGameSource("daily_case:solved")).toBe(true);
    expect(isGameSource("shop:hints_3")).toBe(false);
    expect(isGameSource("quest:done")).toBe(false);
  });
});
