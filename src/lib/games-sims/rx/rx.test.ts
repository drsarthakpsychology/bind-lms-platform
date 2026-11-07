import { describe, expect, it } from "vitest";
import { makeRng } from "../common";
import { TOPICS } from "@/lib/learn/model/topics";
import { MEDS } from "@/lib/meds";
import { MECHANISMS } from "@/lib/meds/mechanisms";
import { DRUGS, EFFECTS, FAMILY, MYSTERIES, OUTCOMES, OVERLAP, PUZZLES } from "./content";
import { EMPHASIS, PROFILE, conceptsOf } from "./drugs";
import { attemptsFor, buildRun, canDistract, chainOptions, grade, LIVES, rxXp, runSummary, STEPS, type Answer } from "./game";

/** Indian brands checked by hand for the first 21 Rx Detective medicines: all must still be offered. */
const VERIFIED_BRANDS: Record<string, string[]> = {
  sertraline: ["Serta", "Daxid"],
  escitalopram: ["Nexito", "Rexipra"],
  fluoxetine: ["Fludac", "Prodep"],
  paroxetine: ["Pexep", "Paxidep"],
  venlafaxine: ["Venlor", "Veniz"],
  mirtazapine: ["Mirtaz"],
  amitriptyline: ["Tryptomer"],
  haloperidol: ["Serenace", "Senorm"],
  olanzapine: ["Oleanz", "Oliza"],
  risperidone: ["Sizodon", "Risdone"],
  aripiprazole: ["Arip MT", "Asprito"],
  quetiapine: ["Qutipin"],
  clozapine: ["Sizopin", "Lozapin"],
  lithium: ["Licab", "Lithosun"],
  valproate: ["Valparin", "Encorate"],
  carbamazepine: ["Tegretol", "Mazetol"],
  lamotrigine: ["Lamitor", "Lametec"],
  lorazepam: ["Ativan", "Larpose"],
  methylphenidate: ["Inspiral", "Addwize"],
  donepezil: ["Donecept", "Aricep"],
  disulfiram: ["Esperal"],
};

describe("Rx Detective content", () => {
  it("has enough of each kind, every drug has a family, Indian brands and a learning dose", () => {
    expect(DRUGS.length).toBe(MEDS.length);
    expect(MYSTERIES.length).toBeGreaterThanOrEqual(10);
    expect(PUZZLES.length).toBeGreaterThanOrEqual(12);
    const topics = new Set(TOPICS.map((t) => t.id));
    for (const d of DRUGS) {
      expect(FAMILY[d.id], d.id).toBeTruthy();
      expect(d.brands.length).toBeGreaterThan(0);
      expect(d.dose).toMatch(/\d/);
      expect(topics.has(d.topic)).toBe(true);
    }
  });
  it("covers serotonin syndrome, QT and liver-enzyme puzzles", () => {
    const answers = new Set(PUZZLES.map((p) => p.answer));
    for (const k of ["ss", "qt", "up", "down", "kidney"]) expect(answers.has(k)).toBe(true);
    expect(PUZZLES.filter((p) => p.answer === "up" || p.answer === "down").every((p) => p.journey)).toBe(true);
  });
  it("mysteries list their answer among four known effects", () => {
    const ids = new Set(EFFECTS.map((e) => e.id));
    for (const m of MYSTERIES) {
      expect(m.options).toContain(m.answer);
      expect(m.options.length).toBe(4);
      expect(m.options.every((o) => ids.has(o))).toBe(true);
      expect(DRUGS.some((d) => d.id === m.drug)).toBe(true);
    }
    expect(PUZZLES.every((p) => OUTCOMES.some((o) => o.id === p.answer))).toBe(true);
  });
  it("never uses week numbers in its own cases, or dashes anywhere", () => {
    expect(/\bweeks?\b/i.test(JSON.stringify([MYSTERIES, PUZZLES]))).toBe(false);
    expect(/[–—]/.test(JSON.stringify([DRUGS, MYSTERIES, PUZZLES]))).toBe(false);
  });
});

describe("Rx Detective medicines come from the shared Medicines reference", () => {
  it("covers every medicine in the reference", () => {
    expect(DRUGS.map((d) => d.id).sort()).toEqual(MEDS.map((m) => m.id).sort());
  });
  it("takes every fact from the reference, so both stay in step", () => {
    for (const d of DRUGS) {
      const m = MEDS.find((x) => x.id === d.id)!;
      expect(d.name).toBe(m.name);
      expect(d.brands).toEqual(m.brands);
      expect(d.cls).toBe(m.cls);
      expect(d.mech).toBe(MECHANISMS[d.id].plain);
      expect([...m.common, ...m.serious], `${d.id} ae`).toContain(d.ae);
      expect(m.checks, `${d.id} mon`).toContain(d.mon);
      expect(d.target.receptor).toBe(MECHANISMS[d.id].receptor.name);
      for (const dose of m.doses) expect(d.dose).toContain(dose.amount);
    }
  });
  it("keeps the hand-checked Indian brand names", () => {
    for (const [id, brands] of Object.entries(VERIFIED_BRANDS)) {
      const d = DRUGS.find((x) => x.id === id)!;
      for (const b of brands) expect(d.brands.some((x) => x.startsWith(b)), `${id} ${b}`).toBe(true);
    }
  });
  it("every emphasis phrase picks a real line from the reference, never an empty one", () => {
    for (const [id, e] of Object.entries(EMPHASIS)) {
      const m = MEDS.find((x) => x.id === id)!;
      const d = DRUGS.find((x) => x.id === id)!;
      if (e.ae) expect(d.ae.toLowerCase(), `${id} ae`).toContain(e.ae.toLowerCase());
      if (e.mon) expect(d.mon.toLowerCase(), `${id} mon`).toContain(e.mon.toLowerCase());
      expect(m).toBeTruthy();
    }
    for (const d of DRUGS) expect(/^(few|none)\b/i.test(d.ae), d.id).toBe(false);
  });
  it("mysteries and puzzles still name medicines the game knows", () => {
    for (const m of MYSTERIES) expect(DRUGS.some((d) => d.id === m.drug), m.id).toBe(true);
  });
});

describe("Rx Detective rules", () => {
  it("chain distractors are never also true: other family, other topic, no shared idea with the asked medicine", () => {
    const rng = makeRng(7);
    for (const d of DRUGS)
      for (const s of STEPS) {
        const opts = chainOptions(d, s.key, rng);
        expect(opts).toContain(d[s.key]);
        expect(new Set(opts).size).toBe(opts.length);
        expect(opts.length, `${d.id} ${s.key}`).toBe(4);
        const own = s.key === "cls" || s.key === "mech" ? PROFILE[d.id].pharm : PROFILE[d.id].clinical;
        for (const o of opts) {
          if (o === d[s.key]) continue;
          const from = DRUGS.filter((x) => x[s.key] === o && canDistract(d, x, s.key));
          expect(from.length, `${d.id} ${s.key}: ${o}`).toBeGreaterThan(0);
          for (const x of from) {
            expect(FAMILY[x.id]).not.toBe(FAMILY[d.id]);
            if (s.key !== "cls") {
              expect(x.topic).not.toBe(d.topic);
              expect(OVERLAP.some((g) => g.includes(d.id) && g.includes(x.id))).toBe(false);
            }
          }
          for (const c of conceptsOf(o)) expect(own.has(c), `${d.id} ${s.key}: "${o}" shares ${c}`).toBe(false);
        }
      }
  });
  it("never offers clozapine's blood count as a wrong check for another medicine that needs blood counts", () => {
    const carbamazepine = DRUGS.find((x) => x.id === "carbamazepine")!;
    const clozapine = DRUGS.find((x) => x.id === "clozapine")!;
    expect(canDistract(carbamazepine, clozapine, "mon")).toBe(false);
  });
  it("builds an interleaved run of 12 and grades with partial credit", () => {
    const run = buildRun("mixed", makeRng(3));
    expect(run.length).toBe(12);
    expect(run.slice(0, 3).map((q) => q.kind)).toEqual(["chain", "mystery", "puzzle"]);
    const d = DRUGS[0];
    const g = grade({ kind: "chain", id: d.id, picks: [d.cls, d.mech, "nope", "nope"] })!;
    expect(g.score).toBe(0.5);
    expect(grade({ kind: "puzzle", id: "ser-tram", picks: ["ss"] })!.score).toBe(1);
    expect(grade({ kind: "mystery", id: "olz-weight", picks: ["a1"] })!.score).toBe(0);
    expect(grade({ kind: "mystery", id: "nope", picks: [] })).toBeNull();
  });
  it("makes one graded attempt per chain step on the drug's topic", () => {
    const d = DRUGS.find((x) => x.id === "lithium")!;
    const a = attemptsFor({ kind: "chain", id: d.id, picks: [d.cls, "x", d.ae, d.mon] });
    expect(a.map((x) => x.outcome)).toEqual([1, 0, 1, 1]);
    expect(a[0].skill).toBe("stabilisers:pharm");
    expect(attemptsFor({ kind: "puzzle", id: "li-ibu", picks: ["kidney"] })[0].item).toBe("rx:int:li-ibu");
  });
  it("stops counting after three lost lives and caps XP", () => {
    const wrong: Answer = { kind: "puzzle", id: "ser-tram", picks: ["qt"] };
    const right: Answer = { kind: "puzzle", id: "ser-tram", picks: ["ss"] };
    const s = runSummary([right, right, wrong, wrong, wrong, right]);
    expect(s.lives).toBe(0);
    expect(s.scores.length).toBe(5);
    expect(s.best).toBe(2);
    expect(LIVES).toBe(3);
    expect(rxXp(new Array(30).fill(1))).toBe(40);
    expect(rxXp([])).toBe(5);
  });
});
