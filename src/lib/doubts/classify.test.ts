import { describe, expect, it } from "vitest";
import { kindFor, looksLikeComplaint } from "./classify";

describe("doubt vs complaint", () => {
  it("treats study questions as doubts", () => {
    for (const [t, b] of [["What is the difference between delusion and overvalued idea?", ""], ["Mood vs affect", "I keep mixing these two up, can someone explain?"], ["Dose of sertraline", "What is the usual starting dose?"]]) {
      expect(looksLikeComplaint(t, b), t).toBe(false);
      expect(kindFor(t, b)).toBe("doubt");
    }
  });
  it("routes grievances to the admin", () => {
    for (const [t, b] of [["I want a refund", "this course is a waste of money"], ["Password not working", "I cannot log in since yesterday"], ["WORST COURSE EVER", "no response from anyone"]]) {
      expect(looksLikeComplaint(t, b), t).toBe(true);
      expect(kindFor(t, b)).toBe("complaint");
    }
  });
  it("honours an explicit override", () => {
    expect(kindFor("I want a refund", "", "doubt")).toBe("doubt");
  });
});
