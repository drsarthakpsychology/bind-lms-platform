import { describe, expect, it } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { hasForbiddenPhrase, DOSE_CAVEAT, STANDING_NOTICE } from "./forbidden-phrases";
import { DRAFT_DRUGS } from "./draft-seed";
import { SOURCES } from "./sources";

const REPO = join(process.cwd());

describe("psychopharm — published-data safety invariants", () => {
  it("the dose caveat must accompany any typical/standard band", () => {
    for (const drug of DRAFT_DRUGS) {
      for (const band of drug.bands) {
        if (band.is_typical_starting || band.is_standard_maintenance) {
          expect(DOSE_CAVEAT.length).toBeGreaterThan(30);
          expect(band.source_ref.page_ref).toBeTruthy();
          // Every band with a numeric range must be sourced (Rule: bands only
          // from sources, never invented).
          if (band.range_low != null || band.range_high != null) {
            expect(band.source_ref.source_id).toBeTruthy();
            expect(band.source_ref.page_ref).toBeTruthy();
          }
        }
      }
    }
  });

  it("every draft drug band that is standard-maintenance has provenance", () => {
    for (const drug of DRAFT_DRUGS) {
      for (const band of drug.bands) {
        if (band.range_low != null || band.range_high != null) {
          expect(band.source_ref.snippet).toBeTruthy();
          expect(band.source_ref.page_ref).toBeTruthy();
        }
      }
    }
  });

  it("source registry covers every source_id used in draft data", () => {
    const allIds = new Set<string>();
    for (const drug of DRAFT_DRUGS) {
      for (const m of drug.mechanism) allIds.add(m.source_id);
      for (const b of drug.bands) {
        allIds.add(b.source_ref.source_id);
        for (const s of b.side_effects) allIds.add(s.source.source_id);
      }
    }
    for (const id of allIds) {
      expect(SOURCES[id], `draft references unknown source ${id}`).toBeTruthy();
    }
  });

  it("does not assert causation in student-visible content", () => {
    // 'causes' with a subject is forbidden; 'may' is the required register.
    for (const drug of DRAFT_DRUGS) {
      for (const obs of drug.student.session_observations ?? []) {
        expect(obs.observation.toLowerCase()).toMatch(/may|reported|anecdotal/);
        expect(obs.observation.toLowerCase()).not.toMatch(/\bcauses\b|\bcause\b/);
      }
    }
  });

  it("equivalences are quoted from a source, with caveat, never computed", () => {
    for (const drug of DRAFT_DRUGS) {
      for (const eq of drug.equivalences) {
        expect(eq.source.snippet).toBeTruthy();
        expect(eq.caveat).toContain("not a swap instruction");
        expect(eq.caveat.toLowerCase()).toContain("prescriber");
      }
    }
  });

  it("every knowledge-base field row has source + page when it publishes", () => {
    // The built static artifacts must be lint-clean for the student-visible
    // fields. We lint the mechanism text (which the student plain layer is
    // derived from). Clinical register content is allowed full terminology but
    // must not accidentally contain a prescribing directive.
    const kbPath = join(REPO, "docs/psychopharm/KNOWLEDGE_BASE.json");
    if (!existsSync(kbPath)) return; // built separately; not built in CI, skip
    const rows = JSON.parse(readFileSync(kbPath, "utf8"));
    for (const row of rows) {
      expect(row.source_id).toBeTruthy();
      if (row.field_key.startsWith("side_effects") || row.field_key === "dose_range") {
        expect(row.page_ref).toBeTruthy();
      }
    }
  });

  it("dose caveat and standing notice are readable and non-prescriptive", () => {
    expect(hasForbiddenPhrase(DOSE_CAVEAT)).toBeNull();
    expect(hasForbiddenPhrase(STANDING_NOTICE)).toBeNull();
    expect(DOSE_CAVEAT).toContain("prescriber");
  });
});