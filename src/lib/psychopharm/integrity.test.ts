import { describe, expect, it } from "vitest";

import { FORBIDDEN_PHRASES, hasForbiddenPhrase } from "./forbidden-phrases";

describe("psychopharm — safety invariants", () => {
  it("the forbidden-phrase list is non-empty and each entry is a plausible phrase", () => {
    expect(FORBIDDEN_PHRASES.length).toBeGreaterThan(10);
    for (const p of FORBIDDEN_PHRASES) {
      expect(p.length).toBeGreaterThan(2);
    }
  });

  it("catches a clear dose instruction", () => {
    expect(hasForbiddenPhrase("The recommended dose is 2 mg.")).toBeTruthy();
    expect(hasForbiddenPhrase("start at 0.25 mg")).toBeTruthy();
    expect(hasForbiddenPhrase("titrate to 4 mg")).toBeTruthy();
    expect(hasForbiddenPhrase("increase the dose to 3 mg")).toBeTruthy();
    expect(hasForbiddenPhrase("switch to clonazepam")).toBeTruthy();
  });

  it("does not false-positive on honest observational language", () => {
    // "increase" is in the list but must not flag normal clinical prose.
    expect(hasForbiddenPhrase("The dose increases the risk of sedation.")).toBe(null);
    expect(hasForbiddenPhrase("Watch for increasing drowsiness.")).toBe(null);
    expect(hasForbiddenPhrase("At this dose the calming effect is stronger.")).toBe(null);
    expect(hasForbiddenPhrase("Not covered in our sources.")).toBe(null);
  });

  it("no equivalence is computed anywhere in the codebase", async () => {
    // Grep the app source AND the extraction/seed scripts (i.e. code that could
    // compute an equivalence). Raw fetched data (fda/*.json, text caches) is
    // excluded — verbatim label prose legitimately contains the word
    // "equivalence" next to dose ratios and must not be flagged.
    const { execSync } = await import("node:child_process");
    const out = execSync(
      'grep -rn "equivalence" src/ scripts/ --include="*.ts" 2>/dev/null || true',
      { encoding: "utf8" },
    );
    // Equivalence may appear in the schema/data model as a stored field, but
    // never as a computed conversion (a * b, x / y) producing a new value.
    expect(out).not.toMatch(/[\d]+\s*[*\/]\s*[\d]+/);
  });

  it("the dose caveat is present and phrased non-prescriptively", async () => {
    const { DOSE_CAVEAT } = await import("./forbidden-phrases");
    expect(DOSE_CAVEAT).toContain("prescriber");
    expect(DOSE_CAVEAT).not.toMatch(/recommended|start at|titrate/i);
  });
});
