import { describe, expect, it } from "vitest";
import { formatBand, formatDoseAndFrequency } from "./format";
import { hasForbiddenPhrase } from "./forbidden-phrases";
import { ONSET_PATCHES } from "./draft-onset";
import { mechanismIndex, normaliseReceptorTag, drugDetail } from "./store";

describe("psychopharm — formatBand", () => {
  it("renders both bounds as a range", () => {
    expect(formatBand({ low: 20, high: 50, unit: "mg" })).toBe("20–50 mg");
  });
  it("renders equal bounds as a single value (no 7.5–7.5)", () => {
    expect(formatBand({ low: 7.5, high: 7.5, unit: "mg" })).toBe("7.5 mg");
  });
  it("renders low-only as 'and above'", () => {
    expect(formatBand({ low: 20, high: null, unit: "mg" })).toBe("20 mg and above");
  });
  it("renders high-only as 'up to'", () => {
    expect(formatBand({ low: null, high: 50, unit: "mg" })).toBe("up to 50 mg");
  });
  it("renders neither bound as 'not specified'", () => {
    expect(formatBand({ low: null, high: null, unit: "mg" })).toBe("not specified");
  });
  it("renders dose plus frequency", () => {
    expect(formatDoseAndFrequency({ low: 7.5, high: 7.5, unit: "mg", frequency: "at bedtime" })).toBe(
      "7.5 mg · at bedtime",
    );
  });
});

describe("psychopharm — onset_time safety + provenance", () => {
  it("every curated onset_time value passes hasForbiddenPhrase", () => {
    for (const p of ONSET_PATCHES) {
      const v = p.onset_time?.value ?? "";
      if (!v) continue; // drugs with no usable source are left undefined
      expect(hasForbiddenPhrase(v), `${p.generic_name} onset_time tripped the lint`).toBeNull();
    }
  });

  it("every curated onset_time carries source_id, page_ref, snippet", () => {
    for (const p of ONSET_PATCHES) {
      const o = p.onset_time;
      if (!o) continue;
      expect(o.source_id, `${p.generic_name} source_id`).toBeTruthy();
      expect(o.page_ref, `${p.generic_name} page_ref`).toBeTruthy();
      expect(o.snippet, `${p.generic_name} snippet`).toBeTruthy();
    }
  });

  it("onset_time exists for the 64 exact-match curated drugs (not the 3 handled by hand)", () => {
    // Clonazepam is in draft-seed, not the patches file — it already had onset_time.
    const patched = new Set(ONSET_PATCHES.map((p) => p.generic_name));
    expect(patched.has("Clonazepam")).toBe(false);
    expect(patched.size).toBe(63);
  });
});

describe("psychopharm — mechanism index", () => {
  it("normaliseReceptorTag strips parenthetical qualifiers and action words", () => {
    expect(normaliseReceptorTag("GABAA benzodiazepine site (positive allosteric modulator)")).toMatchObject({
      tag: "GABAA benzodiazepine site",
      qualifier: "positive allosteric modulator",
    });
    expect(normaliseReceptorTag("D2 antagonist")).toMatchObject({ tag: "D2", qualifier: "antagonist" });
    expect(normaliseReceptorTag("D2/D3 partial agonist")).toMatchObject({ tag: "D2", qualifier: "partial agonist" });
    expect(normaliseReceptorTag("SERT inhibition")).toMatchObject({ tag: "SERT", qualifier: "inhibition" });
  });

  it("mechanismIndex produces no two groups with equal normalised tags", () => {
    const groups = mechanismIndex();
    const tags = new Set(groups.map((g) => g.tag));
    expect(tags.size).toBe(groups.length);
  });

  it("D2 drugs group together", () => {
    const groups = mechanismIndex();
    const d2 = groups.find((g) => g.tag === "D2");
    expect(d2).toBeTruthy();
    expect(d2!.drugs.length).toBeGreaterThanOrEqual(15);
  });
});

describe("psychopharm — distinct onset strings for the four sample drugs", () => {
  it("paroxetine, clonazepam, lithium, risperidone each have a distinct onset", () => {
    const onsetFor = (d: string) => drugDetail(d)?.onset_time?.value ?? "";
    const values = [onsetFor("Paroxetine"), onsetFor("Clonazepam"), onsetFor("Lithium"), onsetFor("Risperidone")];
    for (const v of values) expect(v.length).toBeGreaterThan(10);
    // All four must be distinct from each other.
    expect(new Set(values).size).toBe(4);
  });
});