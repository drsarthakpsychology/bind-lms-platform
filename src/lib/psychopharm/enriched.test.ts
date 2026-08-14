import { describe, expect, it } from "vitest";
import { ENRICHED_ANTIDEPRESSANTS } from "./enriched-antidepressants";
import { ENRICHED_ANTIPSYCHOTICS } from "./enriched-antipsychotics";
import { ENRICHED_OTHERS } from "./enriched-others";

const ALL = [...ENRICHED_ANTIDEPRESSANTS, ...ENRICHED_ANTIPSYCHOTICS, ...ENRICHED_OTHERS];

describe("psychopharm — enriched content invariants", () => {
  it("has no duplicate generic names", () => {
    const names = ALL.map((e) => e.generic_name.toLowerCase());
    expect(new Set(names).size).toBe(names.length);
  });

  it("every entry has a real plain-language summary and mechanism", () => {
    for (const e of ALL) {
      expect(e.plain_language.trim().length, e.generic_name).toBeGreaterThan(20);
      expect(e.mechanism.trim().length, e.generic_name).toBeGreaterThan(10);
      expect(e.drug_class.trim().length, e.generic_name).toBeGreaterThan(1);
    }
  });

  it("every entry has non-empty clinical bullets", () => {
    for (const e of ALL) {
      expect(e.common_uses.length, e.generic_name).toBeGreaterThan(0);
      expect(e.side_effects.length, e.generic_name).toBeGreaterThan(0);
      expect(e.monitoring.length, e.generic_name).toBeGreaterThan(0);
    }
  });

  it("covers a meaningful breadth of the dataset", () => {
    expect(ALL.length).toBeGreaterThan(100);
    const classes = new Set(ALL.map((e) => e.drug_class));
    expect(classes.size).toBeGreaterThan(15); // a real taxonomy, not a flat list
  });
});
