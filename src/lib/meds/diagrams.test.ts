/**
 * The receptor explainer never says something a medicine does not do:
 * it always starts on the medicine's main target; a receptor picture names the
 * medicine only when the medicine itself binds that receptor; otherwise the body's
 * own messenger is shown on its own; aripiprazole is a partial agonist everywhere.
 */
import { describe, expect, it } from "vitest";
import { MEDS } from "@/lib/meds";
import { MECHANISMS, mechanismOf } from "@/lib/meds/mechanisms";
import { medVisuals } from "@/lib/meds/visuals";
import { medicineDiagrams, type MedDiagram } from "@/lib/meds/diagrams";
import { DRUGS } from "@/lib/games-sims/rx/drugs";

const plan = (id: string): MedDiagram[] => {
  const med = MEDS.find((m) => m.id === id)!;
  return medicineDiagrams(med, mechanismOf(id), medVisuals(id));
};

/** Medicines whose main action is on a pump, an enzyme, a channel or a second site: they must never get a lock picture with their own name. */
const INDIRECT = ["sertraline", "escitalopram", "fluoxetine", "paroxetine", "fluvoxamine", "clomipramine", "venlafaxine", "desvenlafaxine", "duloxetine", "bupropion", "methylphenidate", "atomoxetine", "donepezil", "valproate", "lamotrigine", "lorazepam", "clonazepam", "alprazolam", "diazepam", "chlordiazepoxide", "zolpidem"];
/** No receptor picture at all (the medicine works inside the cell, on a channel or an enzyme). */
const NONE = ["lithium", "carbamazepine", "oxcarbazepine", "pregabalin", "disulfiram", "acamprosate"];

describe("medicine receptor explainer", () => {
  it("opens on what the medicine itself does at its main target", () => {
    for (const med of MEDS) {
      const mech = mechanismOf(med.id);
      if (!mech) continue;
      const first = plan(med.id)[0];
      expect(first.kind, med.id).toBe("target");
      if (first.kind === "target") {
        expect(first.target).toBe(mech.targets[0].target);
        expect(first.action).toBe(mech.targets[0].action);
        expect(first.medName).toBe(med.name);
      }
    }
  });

  it("shows the body's own messenger, not the medicine, where the medicine binds no receptor", () => {
    for (const id of INDIRECT) {
      const p = plan(id);
      expect(p.some((d) => d.kind === "receptor"), id).toBe(false);
      const m = p.find((d) => d.kind === "messenger");
      expect(m, id).toBeTruthy();
      if (m?.kind === "messenger") {
        const name = MEDS.find((x) => x.id === id)!.name;
        expect(m.messenger.toLowerCase()).not.toContain(name.toLowerCase());
        expect(JSON.stringify(m)).not.toContain(`(${name.toLowerCase()})`);
      }
    }
  });

  it("draws no receptor at all for medicines that act inside the cell, on a channel or on an enzyme", () => {
    for (const id of NONE) {
      const p = plan(id);
      expect(p.some((d) => d.kind === "receptor" || d.kind === "messenger"), id).toBe(false);
      expect(p.some((d) => d.kind === "note"), id).toBe(true);
    }
  });

  it("names a medicine on a receptor only with an action that medicine really has there", () => {
    for (const med of MEDS) {
      const mech = MECHANISMS[med.id];
      if (!mech) continue;
      for (const d of plan(med.id)) {
        if (d.kind !== "receptor") continue;
        expect(mech.receptor.messenger, med.id).toBeUndefined();
        // The pick must match one of the medicine's own target rows.
        const word = d.pick === "Full agonist" ? /agonist/i : d.pick === "Partial agonist" ? /partial agonist/i : /antagonist|block/i;
        expect(mech.targets.some((t) => word.test(t.action)), `${med.id} ${d.pick}`).toBe(true);
      }
    }
  });

  it("shows aripiprazole as a D2 partial agonist in every picture, never as a blocker", () => {
    const p = plan("aripiprazole");
    const r = p.find((d) => d.kind === "receptor");
    expect(r?.kind === "receptor" && r.pick).toBe("Partial agonist");
    const path = p.find((d) => d.kind === "pathways");
    expect(path?.kind === "pathways" && path.partial).toBe(true);
    expect(path?.kind === "pathways" && path.atypical).toBe(false);
    for (const id of ["haloperidol", "risperidone", "olanzapine"]) {
      const q = plan(id).find((d) => d.kind === "pathways");
      expect(q?.kind === "pathways" && q.partial, id).toBe(false);
    }
  });

  it("the prescription game never pairs a medicine's name with an action it does not have", () => {
    for (const d of DRUGS) {
      const mech = MECHANISMS[d.id];
      expect(d.target.line).not.toMatch(/\bPress\b/);
      if (mech.receptor.messenger) expect(d.target.line.startsWith(`${d.name} does not bind`), d.id).toBe(true);
    }
  });
});
