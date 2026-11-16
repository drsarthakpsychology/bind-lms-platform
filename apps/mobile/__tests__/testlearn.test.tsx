// Round 10 test-and-fix (student, lecture-only and visitor screens).
import { missWhy } from "@/practise/games/blitz";

describe("Blitz: what you missed", () => {
  it("drops an explanation that only repeats the prompt", () => {
    const prompt = "Which word fits: No delusions, obsessions or risk thoughts found. A normal finding.";
    expect(missWhy({ prompt, answer: "No abnormal beliefs", why: "No abnormal beliefs: No delusions, obsessions or risk thoughts found. A normal finding." })).toBe("");
  });
  it("keeps an explanation that adds something", () => {
    const m = { prompt: "Hypnagogic hallucination: An unwanted, intrusive thought.", answer: "False", why: "Hypnagogic hallucination: A brief voice or image while falling asleep." };
    expect(missWhy(m)).toBe(m.why);
  });
});
