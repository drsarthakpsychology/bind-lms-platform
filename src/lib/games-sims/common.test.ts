import { describe, expect, it } from "vitest";
import { accuracyBoard, MIN_TAGS } from "./boards";
import { clock, majority, makeRng, shuffle } from "./common";
import { GAMES2_TILES } from "./tiles";

describe("common helpers", () => {
  it("shuffle keeps every item", () => {
    const a = shuffle([1, 2, 3, 4, 5], makeRng(1));
    expect([...a].sort()).toEqual([1, 2, 3, 4, 5]);
  });
  it("clock formats", () => {
    expect(clock(0)).toBe("0:00");
    expect(clock(75_400)).toBe("1:15");
    expect(clock(-5)).toBe("0:00");
  });
  it("majority vote: strict majority, else everyone voted and earliest of the tied wins", () => {
    expect(majority([], 3)).toBeNull();
    expect(majority([{ choice: "a", at: "1" }], 3)).toBeNull();
    expect(majority([{ choice: "a", at: "1" }, { choice: "a", at: "2" }], 3)).toBe("a");
    expect(majority([{ choice: "a", at: "1" }, { choice: "b", at: "2" }], 3)).toBeNull();
    expect(majority([{ choice: "b", at: "3" }, { choice: "a", at: "1" }, { choice: "c", at: "2" }], 3)).toBe("a");
    expect(majority([{ choice: "b", at: "1" }], 1)).toBe("b");
  });
  it("tiles", () => {
    expect(GAMES2_TILES.map((t) => t.href)).toEqual(["/games/mse", "/games/ward", "/games/rx", "/games/escape", "/games/comorbid"]);
  });
});

describe("accuracy board", () => {
  const row = (u: string, score: number, total: number, streak = 0) => ({ user_id: u, score, right_count: score * total, total, meta: { streak }, created_at: "2026-11-06" });
  it("ranks by accuracy, needs MIN_TAGS, keeps me visible", () => {
    const names = new Map([
      ["a", "Asha"],
      ["b", "Ben"],
      ["c", "Chen"],
    ]);
    const rows = [row("a", 0.8, MIN_TAGS), row("b", 1, MIN_TAGS, 3), row("c", 1, 2), row("x", 1, 40)];
    const { ranked, mine } = accuracyBoard(rows, names, "c");
    expect(ranked.map((r) => r.name)).toEqual(["Ben", "Asha"]);
    expect(ranked[0].rank).toBe(1);
    expect(mine?.name).toBe("Chen");
    expect(mine?.rank).toBe(0);
  });
  it("tie-breaks on best streak", () => {
    const names = new Map([
      ["a", "A"],
      ["b", "B"],
    ]);
    const { ranked } = accuracyBoard([row("a", 1, MIN_TAGS, 2), row("b", 1, MIN_TAGS, 9)], names, null);
    expect(ranked[0].name).toBe("B");
  });
});
