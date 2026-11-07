import { describe, expect, it } from "vitest";
import { TOPICS } from "@/lib/learn/model/topics";
import { ROOMS, roomById } from "./rooms";
import { answer, escapeXp, hintOpen, isRight, PENALTY_S, raceBoard, shownOrder, startEscape, teamTime } from "./engine";

const solution = (p: (typeof ROOMS)[number]["puzzles"][number]): string =>
  p.kind === "pick" ? String(p.answer) : p.kind === "multi" ? p.answer.join(",") : p.kind === "order" ? p.items.map((_, i) => i).join(",") : String(p.answer[0]);

describe("Escape Room content", () => {
  it("has 3+ rooms of 6 to 8 linked doors in clinical order", () => {
    expect(ROOMS.length).toBeGreaterThanOrEqual(3);
    const topics = new Set(TOPICS.map((t) => t.id));
    for (const r of ROOMS) {
      expect(r.puzzles.length).toBeGreaterThanOrEqual(6);
      expect(r.puzzles.length).toBeLessThanOrEqual(8);
      const st = r.puzzles.map((p) => p.stage);
      const order = ["mse", "diagnosis", "differential", "risk", "plan", "medicine"];
      const pos = order.map((s) => st.indexOf(s as never));
      expect(pos.every((x) => x >= 0)).toBe(true);
      expect([...pos].sort((a, b) => a - b)).toEqual(pos);
      for (const p of r.puzzles) {
        expect(topics.has(p.skill.split(":")[0]), p.skill).toBe(true);
        if (p.kind === "pick") expect(p.answer).toBeLessThan(p.options.length);
        if (p.kind === "multi") expect(Math.max(...p.answer)).toBeLessThan(p.options.length);
        if (p.kind === "number") expect(p.answer.every((a) => a >= p.min && a <= p.max)).toBe(true);
      }
    }
    expect(new Set(ROOMS.flatMap((r) => r.puzzles.map((p) => p.kind)))).toEqual(new Set(["pick", "multi", "order", "number"]));
  });
  it("has no week numbers or dashes", () => {
    const text = JSON.stringify(ROOMS);
    expect(/\b\d+\s*weeks?\b/i.test(text)).toBe(false);
    expect(/[–—]/.test(text)).toBe(false);
  });
});

describe("Escape Room rules", () => {
  it("checks every kind of answer, order-insensitive for multi", () => {
    const r = roomById("kolkata")!;
    expect(isRight(r.puzzles[0], "2, 0,1")).toBe(true);
    expect(isRight(r.puzzles[0], "0,1")).toBe(false);
    expect(isRight(r.puzzles[4], "0,1,2,3")).toBe(true);
    expect(isRight(r.puzzles[4], "1,0,2,3")).toBe(false);
    expect(isRight(roomById("bengaluru")!.puzzles[6], "3")).toBe(true);
    expect(isRight(roomById("bengaluru")!.puzzles[6], "")).toBe(false);
  });
  it("opens doors one by one, counts wrong answers and opens hints after two misses", () => {
    for (const r of ROOMS) {
      let st = startEscape(r);
      const bad = answer(r, st, 0, "99", "Asha", "t");
      expect(bad.ok).toBe(false);
      st = answer(r, bad.state, 0, "98", "Asha", "t").state;
      expect(st.wrong).toBe(2);
      expect(hintOpen(st, 0)).toBe(true);
      expect(answer(r, st, 3, solution(r.puzzles[3]), "Ben", "t").applied).toBe(false);
      for (let i = 0; i < r.puzzles.length; i++) st = answer(r, st, i, solution(r.puzzles[i]), "Ben", "t").state;
      expect(st.done).toBe(true);
      expect(st.log.filter((l) => l.ok).length).toBe(r.puzzles.length);
    }
  });
  it("times teams with penalties, ranks the race and pays faster teams more", () => {
    expect(teamTime("2026-11-06T10:00:00Z", "2026-11-06T10:10:00Z", 3)).toBe(600000 + 3 * PENALTY_S * 1000);
    expect(teamTime(null, null, 0)).toBe(0);
    expect(escapeXp(5 * 60000, 0)).toBeGreaterThan(escapeXp(25 * 60000, 4));
    expect(escapeXp(99 * 60000, 50)).toBe(5);
    const board = raceBoard([
      { id: "a", name: "A", stage: 6, done: true, ms: 900000, me: false },
      { id: "b", name: "B", stage: 3, done: false, ms: 0, me: true },
      { id: "c", name: "C", stage: 6, done: true, ms: 600000, me: false },
      { id: "d", name: "D", stage: 5, done: false, ms: 0, me: false },
    ]);
    expect(board.map((x) => x.id)).toEqual(["c", "a", "d", "b"]);
  });
  it("never shows an order puzzle already solved", () => {
    for (const r of ROOMS)
      for (const p of r.puzzles)
        if (p.kind === "order")
          for (const seed of ["A", "B", "C", "D"]) {
            const s = shownOrder(p, seed);
            expect(s.some((v, i) => v !== i)).toBe(true);
            expect([...s].sort()).toEqual(p.items.map((_, i) => i));
          }
  });
});
