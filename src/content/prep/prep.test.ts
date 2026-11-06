import { describe, expect, it } from "vitest";
import { ALL_INTERVIEWS, ALL_QUESTIONS } from "./index";
import { SUBJECTS } from "@/lib/prep/types";

describe("prep question bank", () => {
  it("has unique ids", () => {
    const ids = [...ALL_QUESTIONS.map((q) => q.id), ...ALL_INTERVIEWS.map((q) => q.id)];
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("every question is well formed", () => {
    for (const q of ALL_QUESTIONS) {
      expect(SUBJECTS).toContain(q.subject);
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size, q.id).toBe(4);
      expect([0, 1, 2, 3]).toContain(q.answer);
      expect(q.stem.trim().length, q.id).toBeGreaterThan(10);
      expect(q.explanation.trim().length, q.id).toBeGreaterThan(40);
      expect(q.exams.length, q.id).toBeGreaterThan(0);
      if (q.type === "assertion-reason") expect(q.statements?.length, q.id).toBe(2);
      if (q.type === "match") expect(q.lists?.left.length, q.id).toBeGreaterThan(1);
      if (q.type === "passage") expect(q.passage?.length ?? 0, q.id).toBeGreaterThan(40);
    }
  });
  it("every interview item is complete", () => {
    for (const q of ALL_INTERVIEWS) {
      expect(q.modelAnswer.split(/\s+/).length, q.id).toBeGreaterThan(60);
      expect(q.mustCover.length, q.id).toBeGreaterThan(1);
    }
  });
});
