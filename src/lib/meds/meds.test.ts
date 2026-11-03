import { describe, expect, it } from "vitest";
import { MEDS, medIndex, searchMeds } from "./index";

describe("medicine reference", () => {
  it("every medicine is complete, unique, with real doses and its own words", () => {
    const ids = new Set<string>();
    const texts = new Set<string>();
    for (const m of MEDS) {
      expect(ids.has(m.id), m.id).toBe(false);
      ids.add(m.id);
      expect(m.doses.length, m.id).toBeGreaterThan(0);
      expect(m.doses[m.defaultDose], `${m.id} default dose`).toBeTruthy();
      for (const d of m.doses) {
        expect(d.amount.length).toBeGreaterThan(0);
        expect(d.student.length, `${m.id} ${d.amount}`).toBeGreaterThan(20);
        expect(d.clinician.length, `${m.id} ${d.amount}`).toBeGreaterThan(20);
      }
      expect(m.standout.length, m.id).toBeGreaterThanOrEqual(2);
      // No two medicines share the same summary text.
      expect(texts.has(m.student), `${m.id} repeats another summary`).toBe(false);
      texts.add(m.student);
      expect(/stahl|kaplan|sadock|maudsley|page \d/i.test(JSON.stringify(m)), `${m.id} book name`).toBe(false);
    }
    expect(MEDS.length).toBeGreaterThanOrEqual(40);
  });
  it("finds by name, brand, use and small typos", () => {
    const rows = medIndex();
    expect(searchMeds(rows, "sert")[0].id).toBe("sertraline");
    expect(searchMeds(rows, "oleanz")[0].id).toBe("olanzapine");
    expect(searchMeds(rows, "ocd").map((r) => r.id)).toContain("fluvoxamine");
    expect(searchMeds(rows, "quetapine")[0].id).toBe("quetiapine");
  });
});
