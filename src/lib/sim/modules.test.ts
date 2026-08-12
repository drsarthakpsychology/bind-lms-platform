import { describe, expect, it } from "vitest";
import { MODULES, moduleById } from "./modules";

describe("module organisation — cases grouped by condition, distinct voices", () => {
  it("every module has an id, title, focus and order", () => {
    for (const m of MODULES) {
      expect(m.id).toBeTruthy();
      expect(m.title).toBeTruthy();
      expect(m.focus).toBeTruthy();
      expect(m.order_index).toBeGreaterThan(0);
    }
  });

  it("module ids are unique", () => {
    const ids = MODULES.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("the depression module has multiple cases, each a DIFFERENT person", () => {
    const dep = moduleById("mod-depression");
    expect(dep).toBeDefined();
    expect(dep!.cases.length).toBeGreaterThanOrEqual(5);
    // Distinct names
    const names = new Set(dep!.cases.map((c) => c.identity.name));
    expect(names.size).toBe(dep!.cases.length);
    // Distinct ages / occupations / cities — the "different way of talking"
    const cities = new Set(dep!.cases.map((c) => c.identity.city));
    expect(cities.size).toBeGreaterThan(1);
    const occupations = new Set(dep!.cases.map((c) => c.identity.occupation));
    expect(occupations.size).toBeGreaterThan(1);
  });

  it("every case in a module belongs to that module", () => {
    for (const m of MODULES) {
      for (const c of m.cases) {
        expect(c.module_id).toBe(m.id);
        // each case carries its own voice (register) — never blank
        expect(c.identity.language_register.trim().length).toBeGreaterThan(3);
      }
    }
  });

  it("every case has a variation schema (so each patient plays differently each run)", () => {
    for (const m of MODULES) {
      for (const c of m.cases) {
        expect(c.variation.mood_today.length).toBeGreaterThan(0);
        expect(c.variation.language_mix.length).toBeGreaterThan(0);
      }
    }
  });

  it("cases across the whole catalogue are unique by id", () => {
    const ids = MODULES.flatMap((m) => m.cases.map((c) => c.case_id));
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("A8 — no-disorder principle (9 cases, restraint praised)", () => {
  it("the nine no-disorder presentations all exist (A8 list)", () => {
    const all = MODULES.flatMap((m) => m.cases);
    const ids = new Set(all.map((c) => c.case_id));
    const required = [
      "dep-grief-raj",          // 1. normal grief within weeks of a death
      "ado-normal-teen",        // 2. normal adolescent withdrawal
      "anx-exam",               // 3. exam anxiety within range
      "no-disorder-sunita",     // 4. situational stress with intact function
      "no-disorder-rohit-parent", // 5. a worried parent with a typical child
      "no-disorder-neelam-sent",  // 6. sent by a family member, no complaint
      "psy-mahesh",             // 7. culturally normative possession, no impairment
      "anx-kavya",              // 8. one-off panic after a medical scare, non-recurrent
      "soma-b12-pramod",        // 9. low mood fully explained by a treatable medical cause
    ];
    for (const id of required) {
      expect(ids.has(id), `missing no-disorder case ${id}`).toBe(true);
    }
    // Each teaches restraint: tagged with a trap that rewards NOT diagnosing
    // (over-diagnosis, or medical-mimic where the 'depression' is a disease).
    for (const id of required) {
      const c = all.find((x) => x.case_id === id)!;
      expect(c.traps.length).toBeGreaterThan(0);
    }
  });
});
