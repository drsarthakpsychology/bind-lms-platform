import { describe, expect, it } from "vitest";
import { diagnosisById } from "../diagnoses";
import { citationOrDash, EXAMS, STUDY_MODULES } from "../tags";
import { DUEL_ITEMS } from "./items";

const fresh = DUEL_ITEMS.filter((i) => /^du-\d{3}$/.test(i.id));
const MIN = Number(process.env.DUEL_MIN ?? 500);

/** True when the right feature (index 0) is strictly the longest. */
const rightLongest = (f: string[]) => f.every((x, i) => i === 0 || x.length < f[0].length);

describe("duel library", () => {
  it(`has at least ${MIN} rounds with unique ids`, () => {
    expect(DUEL_ITEMS.length).toBeGreaterThanOrEqual(MIN);
    expect(new Set(DUEL_ITEMS.map((i) => i.id)).size).toBe(DUEL_ITEMS.length);
  });

  it("every round is well formed and tagged", () => {
    for (const it of DUEL_ITEMS) {
      expect(new Set(it.options).size, it.id).toBe(4);
      for (const o of it.options) expect(diagnosisById(o), `${it.id} ${o}`).toBeTruthy();
      expect(new Set(it.features).size, it.id).toBe(4);
      expect(it.vignette.toLowerCase().includes(diagnosisById(it.options[0])!.name.toLowerCase()), it.id).toBe(false);
      expect([1, 2, 3, 4, 5], it.id).toContain(it.level);
      expect(it.objective && it.objective.length > 10, it.id).toBe(true);
      expect(it.exams && it.exams.length > 0 && it.exams.every((e) => EXAMS.includes(e)), it.id).toBe(true);
      expect(STUDY_MODULES as readonly string[], it.id).toContain(it.module);
      expect(citationOrDash([it.vignette, ...it.features, it.why, it.objective ?? ""].join(" ")), it.id).toBe(false);
    }
  });

  it("newer rounds explain every option and keep the right feature from being the longest", () => {
    for (const it of fresh) expect(it.why.length, it.id).toBeGreaterThan(120);
    expect(fresh.filter((i) => rightLongest(i.features)).length / Math.max(1, fresh.length)).toBeLessThanOrEqual(0.34);
  });

  it("spreads levels and topics", () => {
    for (const lv of [1, 2, 3, 4, 5]) expect(DUEL_ITEMS.filter((i) => i.level === lv).length / DUEL_ITEMS.length, `level ${lv}`).toBeGreaterThan(0.08);
    expect(new Set(DUEL_ITEMS.map((i) => i.topic)).size).toBeGreaterThanOrEqual(12);
  });
});
