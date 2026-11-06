import { describe, expect, it } from "vitest";
import { attemptsFromEvents } from "./events";

describe("attemptsFromEvents", () => {
  it("keeps graded events with a skill and drops the rest", () => {
    const a = attemptsFromEvents(
      [
        { kind: "decide", score: 1, skill: "depression:apply", item: null },
        { kind: "worked", score: 1, skill: "depression:apply", item: null },
        { kind: "term", score: null, skill: "depression:apply", item: null },
        { kind: "sort", score: 0.5, skill: null, item: null },
        { kind: "mcq", score: 0, skill: "bipolar:criteria", item: "md9" },
      ],
      [{}, {}, {}, {}, { chosen: "7 days", correct: "4 days" }],
    );
    expect(a).toEqual([
      { skill: "depression:apply", item: null, outcome: 1, chosen: null, correct: null },
      { skill: "bipolar:criteria", item: "md9", outcome: 0, chosen: "7 days", correct: "4 days" },
    ]);
  });
});
