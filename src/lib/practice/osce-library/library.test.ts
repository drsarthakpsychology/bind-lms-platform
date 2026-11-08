/** OSCE library contract: count, unique ids, tags, briefs, checklists, model points, no dashes or citations. */
import { describe, expect, it } from "vitest";
import { SEED_OSCE_STATIONS } from "@/lib/practice/osce";

/** Raise as batches land; the section target is 500. */
const MIN_STATIONS = 112;
const DASH = /[–—]/;
const CITATION = /\b(et al\.|Kaplan|Stahl|Maudsley|Fish's|Ahuja|doi:|ISBN)\b/;
const EXAMS = new Set(["cuet-pg", "ugc-net", "mcp-entrance", "md-psychiatry", "ma-semester"]);

describe("OSCE library", () => {
  it("has enough stations with stable, unique ids and titles", () => {
    expect(SEED_OSCE_STATIONS.length).toBeGreaterThanOrEqual(MIN_STATIONS);
    const ids = SEED_OSCE_STATIONS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    ids.forEach((id, i) => expect(id).toBe(`osce-${i + 1}`));
    expect(new Set(SEED_OSCE_STATIONS.map((s) => s.title)).size).toBe(ids.length);
  });

  it("every station has a brief, a weighted checklist, model points and tags", () => {
    for (const s of SEED_OSCE_STATIONS) {
      expect(s.role, s.id).toBeTruthy();
      expect(s.role_brief!.length, s.id).toBeGreaterThan(80);
      expect(s.checklist.length, s.id).toBeGreaterThanOrEqual(5);
      for (const c of s.checklist) {
        expect(c.weight, s.id).toBeGreaterThanOrEqual(1);
        expect(c.weight, s.id).toBeLessThanOrEqual(3);
      }
      expect(s.model_points!.length, s.id).toBeGreaterThanOrEqual(4);
      const t = s.tags!;
      expect(t.difficulty).toBeGreaterThanOrEqual(1);
      expect(t.difficulty).toBeLessThanOrEqual(5);
      expect(t.objective.length, s.id).toBeGreaterThan(10);
      expect(t.module.length, s.id).toBeGreaterThan(2);
      for (const e of t.exams) expect(EXAMS.has(e), `${s.id} ${e}`).toBe(true);
    }
    expect(new Set(SEED_OSCE_STATIONS.map((s) => s.tags!.difficulty))).toEqual(new Set([1, 2, 3, 4, 5]));
  });

  it("no dashes and no citation text in the role briefs, model points or new stations", () => {
    for (const s of SEED_OSCE_STATIONS) {
      const added = JSON.stringify([s.role_brief, s.model_points, s.tags]);
      expect(DASH.test(added), s.id).toBe(false);
      expect(CITATION.test(added), s.id).toBe(false);
    }
    for (const s of SEED_OSCE_STATIONS.slice(12)) expect(DASH.test(JSON.stringify(s)), s.id).toBe(false);
  });
});
