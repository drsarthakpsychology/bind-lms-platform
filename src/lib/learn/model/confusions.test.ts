import { describe, expect, it } from "vitest";
import { bumpConfusion, cleanAnswer, isConfusion, topConfusions } from "./confusions";

const NOW = new Date("2026-11-06T10:00:00Z");
const daysAgo = (d: number) => new Date(NOW.getTime() - d * 86_400_000).toISOString();

describe("isConfusion", () => {
  it("needs two different answers", () => {
    expect(isConfusion("Mania", "Hypomania")).toBe(true);
    expect(isConfusion("Mania", " mania ")).toBe(false);
    expect(isConfusion(null, "x")).toBe(false);
    expect(isConfusion("", "x")).toBe(false);
  });
});

describe("bumpConfusion", () => {
  it("counts up and keeps the skill", () => {
    const one = bumpConfusion(undefined, "Mania", "Hypomania", NOW, "bipolar:criteria");
    const two = bumpConfusion(one, "Mania", "Hypomania", NOW);
    expect(two.n).toBe(2);
    expect(two.skill).toBe("bipolar:criteria");
  });
  it("trims long text", () => {
    expect(cleanAnswer("a  b\n c")).toBe("a b c");
    expect(cleanAnswer("x".repeat(300))).toHaveLength(120);
  });
});

describe("topConfusions", () => {
  it("merges both directions and ranks by recent weight", () => {
    const top = topConfusions(
      [
        { chosen: "Mania", correct: "Hypomania", n: 2, lastAt: daysAgo(1), skill: "bipolar:criteria" },
        { chosen: "Hypomania", correct: "Mania", n: 1, lastAt: daysAgo(0), skill: "bipolar:differentiate" },
        { chosen: "Illusion", correct: "Hallucination", n: 6, lastAt: daysAgo(90) },
        { chosen: "SSRI", correct: "SNRI", n: 1, lastAt: daysAgo(0) },
        { chosen: "A", correct: "B", n: 1, lastAt: daysAgo(5) },
      ],
      NOW,
    );
    expect(top).toHaveLength(3);
    expect(top[0]).toMatchObject({ a: "Hypomania", b: "Mania", n: 3, skill: "bipolar:differentiate" });
    expect(top.map((t) => t.a)).not.toContain("Hallucination");
  });
  it("is empty with no rows", () => {
    expect(topConfusions([], NOW)).toEqual([]);
  });
});
