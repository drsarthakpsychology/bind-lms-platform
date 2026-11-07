import { describe, expect, it } from "vitest";
import { cleanDeep, cleanStudentText, findReference, stripAiPhrases, stripDashes } from "./student-text";

describe("stripDashes", () => {
  it("turns number ranges into 'to'", () => {
    expect(stripDashes("for 2–3 weeks")).toBe("for 2 to 3 weeks");
    expect(stripDashes("10 — 12 kg")).toBe("10 to 12 kg");
  });
  it("turns dashes between words into commas", () => {
    expect(stripDashes("She is tired — and low most days.")).toBe("She is tired, and low most days.");
    expect(stripDashes("tired—low")).toBe("tired, low");
    expect(stripDashes("He sleeps badly - and eats little.")).toBe("He sleeps badly, and eats little.");
  });
  it("uses a colon after a short lead-in label", () => {
    expect(stripDashes("Key point — mood is low.")).toBe("Key point: mood is low.");
  });
  it("drops bullet dashes and never leaves a dash behind", () => {
    const out = stripDashes("— first\n– second, — third.");
    expect(out).not.toMatch(/[—–]/);
    expect(out.startsWith("first")).toBe(true);
  });
  it("leaves ordinary hyphens alone", () => {
    expect(stripDashes("a 34-year-old with low-grade fever")).toBe("a 34-year-old with low-grade fever");
  });
});

describe("stripAiPhrases", () => {
  it("removes filler and capitalises the next word", () => {
    expect(stripAiPhrases("It's important to note that sleep matters.")).toBe("Sleep matters.");
    expect(stripAiPhrases("Mood is low. In conclusion, this is depression.")).toBe("Mood is low. This is depression.");
  });
  it("swaps stock words", () => {
    expect(stripAiPhrases("Let us delve into the history.")).toBe("Let us look at the history.");
  });
  it("does not capitalise mid-sentence after removal", () => {
    expect(stripAiPhrases("She says notably, it began in May.")).toBe("She says it began in May.");
  });
});

describe("findReference", () => {
  it("catches books, journals, links and citations", () => {
    expect(findReference("as Kaplan and Sadock describe")).toBeTruthy();
    expect(findReference("Smith et al. found")).toBeTruthy();
    expect(findReference("see https://x.org")).toBeTruthy();
    expect(findReference("(Beck, 1979) or (2019)")).toBeTruthy();
    expect(findReference("Lancet Psychiatry")).toBeTruthy();
  });
  it("allows the diagnostic systems by name", () => {
    expect(findReference("DSM-5-TR needs two weeks; ICD-11 is similar.")).toBeNull();
  });
});

describe("cleanDeep", () => {
  it("cleans every string and keeps the shape", () => {
    const out = cleanDeep({ a: "x — y", b: ["2–3", { c: "fine" }], n: 4, k: null });
    expect(out).toEqual({ a: "x, y", b: ["2 to 3", { c: "fine" }], n: 4, k: null });
  });
  it("is a no-op on clean text", () => {
    expect(cleanStudentText("Low mood for six weeks.")).toBe("Low mood for six weeks.");
  });
});
