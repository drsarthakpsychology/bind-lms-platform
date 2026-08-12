import { describe, expect, it } from "vitest";
import { bestResponse, scoreQuiz, spotTheError, type QuizItem } from "./quiz";

describe("quiz engine", () => {
  it("bestResponse factory builds a sourced item", () => {
    const q = bestResponse(
      "q1",
      "A patient says 'not feeling fresh' and looks tired.",
      "Walk me through yesterday morning.",
      ["Are you depressed?", "It's just stress, right?", "Have you tried sleeping more?"],
      "Instantiate is the highest-yield disambiguation question.",
      "Nichter idioms of distress",
    );
    expect(q.type).toBe("best_response");
    expect(q.correct).toBe(0);
    expect(q.source).toBeTruthy();
  });

  it("spotTheError flags the single bad move", () => {
    const q = spotTheError(
      "q2",
      "Clinician: 'Cheer up! It's not that bad.' Patient: (withdraws)",
      0,
      ["'Cheer up' — invalidating premature reassurance", "'It's not that bad' — minimising", "The pause"],
      "Premature reassurance is the #1 novice error.",
      "mhGAP",
    );
    expect(q.type).toBe("spot_the_error");
  });

  it("scoreQuiz counts correct answers", () => {
    const items: QuizItem[] = [
      bestResponse("a", "scenario", "good", ["bad1", "bad2", "bad3"], "r", "s"),
      bestResponse("b", "scenario", "good", ["bad1", "bad2", "bad3"], "r", "s"),
    ];
    expect(scoreQuiz(items, { a: 0, b: 1 }).correct).toBe(1);
    expect(scoreQuiz(items, { a: 0, b: 0 }).correct).toBe(2);
  });

  it("every item carries a source (no item ships without one)", () => {
    const q = bestResponse("c", "scenario", "good", ["a", "b", "c"], "rationale", "ICD-11 §6A70");
    expect(q.source).toBeTruthy();
  });
});
