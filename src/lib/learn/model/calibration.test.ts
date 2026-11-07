import { describe, expect, it } from "vitest";
import { eloUpdate, guessFloor, prob } from "./elo";
import { masteryOf } from "./mastery";
import { applyAttempts, practiceCandidates, skillRefB, type ItemRow, type ModelRows } from "./student";
import { BANK } from "./topics";
import { difficultyOf, MIN_ANSWERS_FOR_B } from "@/lib/leagues/points";

const empty = (): ModelRows => ({ skills: new Map(), items: new Map(), cards: new Map(), confusions: new Map() });
const now = new Date("2026-11-07T10:00:00Z");

describe("guessing floor on multiple choice", () => {
  it("1 over the number of options; none for typed answers", () => {
    expect(guessFloor(4)).toBe(0.25);
    expect(guessFloor(2)).toBe(0.5);
    expect(guessFloor(0)).toBe(0);
    expect(guessFloor(null)).toBe(0);
  });

  it("a weak student still has the guessing chance on a four-option question", () => {
    expect(prob(-10, 0, 0.25)).toBeCloseTo(0.25, 3);
    expect(prob(0, 0, 0.25)).toBeCloseTo(0.625, 3);
    expect(prob(0, 0)).toBeCloseTo(0.5, 3);
  });

  it("a right answer on multiple choice moves the rating less than a typed one", () => {
    const typed = eloUpdate({ theta: 0, n: 0 }, { b: 0, n: 0 }, 1, 0);
    const mcq = eloUpdate({ theta: 0, n: 0 }, { b: 0, n: 0 }, 1, 0.25);
    expect(mcq.student.theta).toBeLessThan(typed.student.theta);
    expect(mcq.p).toBeGreaterThan(typed.p);
  });

  it("bank questions use their own option count in the model and the picker", () => {
    const mcq = BANK.find((b) => b.item.kind === "mcq")!;
    const rows = empty();
    const withFloor = applyAttempts(rows, [{ skill: mcq.skill, item: mcq.item.id, outcome: 1 }], now).skills.get(mcq.skill)!;
    const typed = applyAttempts(rows, [{ skill: mcq.skill, item: null, outcome: 1, options: 0 }], now).skills.get(mcq.skill)!;
    expect(withFloor.theta).toBeLessThan(typed.theta);
    const c = practiceCandidates(rows, now).find((x) => x.id === mcq.item.id)!;
    expect(c.p).toBeGreaterThan(0.5);
  });
});

describe("mastery on the skill's own questions", () => {
  const snap = { theta: 1.9, n: 12, lastAt: now.toISOString(), correctDays: ["2026-11-05", "2026-11-06", "2026-11-07"] };

  it("a strong student on an average skill is mastered, but not on a hard skill", () => {
    expect(masteryOf(snap, now, 0)).toBe("mastered");
    expect(masteryOf(snap, now, 1.2)).not.toBe("mastered");
  });

  it("uses the median difficulty of the skill's answered questions", () => {
    const skill = BANK[0].skill;
    const ids = BANK.filter((b) => b.skill === skill).map((b) => b.item.id);
    const items = new Map<string, ItemRow>();
    expect(skillRefB(skill, items)).toBe(0);
    ids.slice(0, 3).forEach((id, i) => items.set(id, { item: id, b: [0.4, 1.0, 1.6][i] ?? 0, n: 10 }));
    if (ids.length >= 3) expect(skillRefB(skill, items)).toBeCloseTo(1.0, 5);
    // Unanswered questions don't count.
    items.set("other", { item: "other", b: 9, n: 0 });
    if (ids.length >= 3) expect(skillRefB(skill, items)).toBeCloseTo(1.0, 5);
  });
});

describe("league difficulty from item_stats", () => {
  it("reads b (the column that exists), not p_correct or rating", () => {
    expect(difficultyOf({ b: 1.0, n: 20 })).toBe(3);
    expect(difficultyOf({ b: 0.8, n: 20 })).toBe(3);
    expect(difficultyOf({ b: 0, n: 20 })).toBe(2);
    expect(difficultyOf({ b: -0.2, n: 20 })).toBe(2);
    expect(difficultyOf({ b: -0.5, n: 20 })).toBe(1);
  });

  it("trusts b only after enough answers, or when the author seeded it", () => {
    expect(difficultyOf({ b: 1.5, n: MIN_ANSWERS_FOR_B - 1 })).toBe(1);
    expect(difficultyOf({ b: 1.5, n: 0 })).toBe(3);
    expect(difficultyOf({ b: 0, n: 0 })).toBe(1);
  });
});
