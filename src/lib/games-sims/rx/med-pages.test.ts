/** Rx Detective links a wrong answer to the medicine's "How it works": every medicine it uses has a page. */
import { describe, expect, it } from "vitest";
import { MEDS } from "@/lib/meds";
import { howItWorksHref } from "@/lib/meds/sections";
import { DRUGS, MYSTERIES, PUZZLES, REVIEWS } from "./content";
import { RX_MED_PAGE, medPageFor, rxItemKeys, rxItemPages } from "./med-pages";

/** Partners in a few cases that are not medicines in the reference, so they get no link. */
const NOT_IN_REFERENCE = ["alcohol", "tramadol", "linezolid", "the contraceptive pill", "stopping smoking"];

/** Dangerous mixes where neither medicine is in the reference (citalopram with methadone, metronidazole with beer). */
const PUZZLES_WITHOUT_PAGE = ["cit-meth", "metro-alc"];

describe("Rx Detective medicine pages", () => {
  it("maps every Rx drug id to a Medicines page", () => {
    const pages = new Set(MEDS.map((m) => m.id));
    expect(Object.keys(RX_MED_PAGE).sort()).toEqual(DRUGS.map((d) => d.id).sort());
    for (const d of DRUGS) {
      expect(RX_MED_PAGE[d.id], d.id).toBeTruthy();
      expect(pages.has(RX_MED_PAGE[d.id]!), d.id).toBe(true);
    }
  });

  it("every case is about at least one medicine with a page, and every review medicine has one", () => {
    for (const d of DRUGS) expect(rxItemPages("chain", d.id).map((p) => p.id), d.id).toEqual([d.id]);
    for (const m of MYSTERIES) expect(rxItemPages("mystery", m.id).length, m.id).toBe(1);
    // Only these mixes name no medicine from the reference (the link is hidden there).
    expect(PUZZLES.filter((p) => rxItemPages("puzzle", p.id).length === 0).map((p) => p.id)).toEqual(PUZZLES_WITHOUT_PAGE);
    for (const r of REVIEWS) for (const k of rxItemKeys("review", r.id)) expect(medPageFor(k), `${r.id}: ${k}`).not.toBeNull();
  });

  it("hides the link for things without a page, and points to How it works", () => {
    for (const k of NOT_IN_REFERENCE) expect(medPageFor(k), k).toBeNull();
    expect(medPageFor("Sodium valproate")?.id).toBe("valproate");
    const tram = PUZZLES.find((p) => p.id === "ser-tram")!;
    expect(rxItemPages("puzzle", tram.id).map((p) => p.id)).toEqual(["sertraline"]);
    expect(howItWorksHref("olanzapine")).toBe("/practice/medicines/olanzapine#how-it-works");
  });
});
