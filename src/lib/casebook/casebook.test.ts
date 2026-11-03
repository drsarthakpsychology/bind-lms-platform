import { describe, expect, it } from "vitest";
import { CASEBOOK } from "@/content/casebook";
import { MODULES } from "@/lib/study";
import { orderScore, STUDENT_SOURCING, studentStrings, validateActivity } from "./validate";
import type { CaseActivity } from "./types";

const MODS = new Set(MODULES.map((m) => m.id));

describe("casebook content", () => {
  it("every activity is valid", () => {
    const problems = CASEBOOK.flatMap((a) => validateActivity(a, MODS));
    expect(problems).toEqual([]);
  });
  it("ids are unique", () => {
    expect(new Set(CASEBOOK.map((a) => a.id)).size).toBe(CASEBOOK.length);
  });
  it("no book text is pasted in: quotes and vignettes stay short", () => {
    for (const a of CASEBOOK) {
      const texts: string[] =
        a.format === "spotter" ? a.items.map((i) => i.quote) : a.format === "differential" || a.format === "triage" ? a.items.map((i) => i.vignette) : [];
      for (const t of texts) expect(t.split(/\s+/).length, `${a.id}: ${t.slice(0, 40)}`).toBeLessThanOrEqual(160);
    }
  });
});

describe("casebook: students see the teaching, not the sourcing", () => {
  it("no student-visible string names a book, a page or the review", () => {
    const hits = CASEBOOK.flatMap((a) => studentStrings(a).filter((t) => STUDENT_SOURCING.test(t)).map((t) => `${a.id}: ${t}`));
    expect(hits).toEqual([]);
  });
  it("the sourcing is still kept for admins", () => {
    for (const a of CASEBOOK) expect(a.bookRef.book, a.id).toBeTruthy();
  });
  it("the check would catch a citation", () => {
    for (const t of ["(Maudsley p. 337)", "(p.891)", "book p.1457", "The book warns that", "Fish's definition", "per Ahuja", "For educator review"]) expect(STUDENT_SOURCING.test(t), t).toBe(true);
    expect(STUDENT_SOURCING.test("Ask her to book a holiday.")).toBe(false);
  });
});

describe("validator", () => {
  const base = { id: "demo", title: "T", hook: "H", module: "depression", level: "Foundation" as const, objective: "O", bookRef: { book: "B", chapter: "C", pages: "1" }, reviewFlags: [] };
  it("catches a bad answer, unknown module and broken branches", () => {
    const bad: CaseActivity[] = [
      { ...base, format: "differential", items: [{ id: "a", vignette: "v", options: ["x", "y"], answer: 5, explain: "e" }] },
      { ...base, module: "nope", format: "triage", items: [] },
      { ...base, format: "branching", start: "s", nodes: [{ id: "s", text: "t", choices: [{ text: "c", next: "missing", feedback: "f", good: true }] }, { id: "orphan", text: "t", choices: [{ text: "c", next: null, feedback: "f", good: true }] }] },
    ];
    const msgs = bad.flatMap((a) => validateActivity(a, MODS)).join("\n");
    expect(msgs).toMatch(/answer out of range/);
    expect(msgs).toMatch(/unknown module/);
    expect(msgs).toMatch(/missing node/);
    expect(msgs).toMatch(/unreachable/);
  });
  it("accepts a valid spotter", () => {
    const ok: CaseActivity = { ...base, format: "spotter", categories: [{ id: "a", label: "A" }, { id: "b", label: "B" }], items: ["1", "2", "3", "4"].map((id) => ({ id, quote: "q", answer: "a", distractors: ["b"], explain: "e" })) };
    expect(validateActivity(ok, MODS)).toEqual([]);
  });
  it("orderScore counts neighbours in order", () => {
    expect(orderScore(["a", "b", "c", "d"], ["a", "b", "c", "d"])).toBe(3);
    expect(orderScore(["a", "b", "c", "d"], ["d", "c", "b", "a"])).toBe(0);
    expect(orderScore(["a", "b", "c", "d"], ["b", "a", "c", "d"])).toBe(2);
  });
});
