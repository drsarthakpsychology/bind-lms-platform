/**
 * Consulting Room library contract: count, unique ids, tags, the teaching
 * layer (expected MSE, diagnosis, differentials, rubric) and the safety rules.
 */
import { describe, expect, it } from "vitest";
import { SIM_LIBRARY, SIM_LIBRARY_AUTHORED } from "./index";
import { MSE_DOMAINS } from "./types";
import { CHARACTER_SKELETONS } from "@/lib/sim/characters";
import { REGIONAL_CAST } from "@/lib/sim/regional-cast";
import { RARE_CASES } from "@/lib/sim/rare-cases";
import { rubricToCompetencyKeys } from "@/lib/practice/competency-map";

/** Cases already live in sim_cases before the library (approved count). */
const EXISTING_LIVE = 71;
/** Raise as batches land; the section target is 500 including the existing cases. */
const MIN_LIBRARY = 132;

const DASH = /[–—]/;
const LABEL = /\b(schizophreni\w*|depressi\w*|bipolar|psychos[ie]s|psychotic|ocd|disorder|ptsd|delusion\w*|hallucinat\w*|diagnos\w*|mania|manic|dementia|autis\w*|adhd)\b/i;
const RISK_WORDS = /\b(suicid\w*|kill myself|end my life|overdose|hang myself|poison)\b/i;
const EXAMS = new Set(["cuet-pg", "ugc-net", "mcp-entrance", "md-psychiatry", "ma-semester"]);
const CITATION = /\b(et al\.|DSM-5-TR p\.|Kaplan|Stahl|Maudsley|Fish's|Ahuja|doi:|ISBN)\b/;

describe("consulting room library", () => {
  it("has enough cases and unique ids and slugs", () => {
    expect(SIM_LIBRARY.length).toBeGreaterThanOrEqual(MIN_LIBRARY);
    expect(new Set(SIM_LIBRARY.map((c) => c.case_id)).size).toBe(SIM_LIBRARY.length);
    expect(new Set(SIM_LIBRARY.map((c) => c.slug)).size).toBe(SIM_LIBRARY.length);
    expect(SIM_LIBRARY.length + EXISTING_LIVE).toBeGreaterThanOrEqual(MIN_LIBRARY + EXISTING_LIVE);
  });

  it("titles never collide with the earlier banks", () => {
    const old = new Set([...CHARACTER_SKELETONS, ...REGIONAL_CAST, ...RARE_CASES].map((c) => c.title));
    for (const c of SIM_LIBRARY) expect(old.has(c.title), c.case_id).toBe(false);
    expect(new Set(SIM_LIBRARY.map((c) => c.title)).size).toBe(SIM_LIBRARY.length);
  });

  it("every case carries tags and the teaching layer", () => {
    for (const c of SIM_LIBRARY) {
      const L = c.library;
      expect(L.level, c.case_id).toBeGreaterThanOrEqual(1);
      expect(L.level, c.case_id).toBeLessThanOrEqual(5);
      expect(L.topic.length, c.case_id).toBeGreaterThan(2);
      expect(L.module.length, c.case_id).toBeGreaterThan(2);
      expect(L.objective.length, c.case_id).toBeGreaterThan(15);
      expect(L.exams.length, c.case_id).toBeGreaterThan(0);
      for (const e of L.exams) expect(EXAMS.has(e), `${c.case_id} ${e}`).toBe(true);
      for (const d of MSE_DOMAINS) expect(L.expected_mse[d].length, `${c.case_id} mse ${d}`).toBeGreaterThan(1);
      expect(L.diagnosis.length, c.case_id).toBeGreaterThan(5);
      expect(L.differentials.length, c.case_id).toBeGreaterThanOrEqual(2);
      for (const x of L.differentials) expect(x.why_not.length, `${c.case_id} ${x.dx}`).toBeGreaterThan(30);
      expect(L.debrief_rubric.length, c.case_id).toBeGreaterThanOrEqual(4);
      expect(rubricToCompetencyKeys(c.rubric_targets).length, `${c.case_id} rubric maps to no competency`).toBeGreaterThan(0);
    }
  });

  it("every level of the ladder is used", () => {
    const levels = new Set(SIM_LIBRARY.map((c) => c.library.level));
    expect(levels).toEqual(new Set([1, 2, 3, 4, 5]));
  });

  it("safety: every case has a gated risk item, and risk never sits in the spoken lines", () => {
    for (const a of SIM_LIBRARY_AUTHORED) {
      expect(a.risk.length, a.id).toBeGreaterThan(20);
      const c = SIM_LIBRARY.find((x) => x.case_id === a.id)!;
      expect(c.red_flags[0].gate).toBe("asked_about_self_harm_clearly");
      for (const line of [a.cc, ...a.lines]) expect(line, a.id).not.toMatch(RISK_WORDS);
    }
  });

  it("the patient's own words carry no diagnostic label", () => {
    for (const a of SIM_LIBRARY_AUTHORED) {
      for (const line of [a.cc, ...a.lines]) expect(line, a.id).not.toMatch(LABEL);
      expect(a.lines.length, a.id).toBeGreaterThanOrEqual(4);
    }
  });

  it("no dashes and no citation text anywhere", () => {
    for (const a of SIM_LIBRARY_AUTHORED) {
      const s = JSON.stringify(a);
      expect(DASH.test(s), a.id).toBe(false);
      expect(CITATION.test(s), a.id).toBe(false);
    }
  });
});
