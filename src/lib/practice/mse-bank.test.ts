import { describe, expect, it } from "vitest";
import { domainRound, MSE_DOMAINS, MSE_VOCAB, SEED_MSE_STIMULI } from "./mse";
import { OBSERVE_STIMULI } from "./mse-observe-stimuli";

const ALL = [...SEED_MSE_STIMULI, ...OBSERVE_STIMULI];
const EXAMS = ["cuet-pg", "ugc-net", "mcp-entrance", "md-psychiatry", "ma-semester"];
/** The first stimuli predate the controlled list and keep their free-text amber words. */
const LEGACY = new Set(["mse-1", "mse-2", "mse-4", "mse-5", "mse-6", "mse-7", "mse-8", "mse-12"]);

describe("MSE Trainer library", () => {
  it("has at least 500 observation and tagging items with unique ids", () => {
    expect(ALL.length).toBeGreaterThanOrEqual(500);
    expect(new Set(ALL.map((s) => s.id)).size).toBe(ALL.length);
  });
  it("tags every item: topic, difficulty, objective, exams, study module", () => {
    for (const s of ALL) {
      expect(s.topic?.length, s.id).toBeGreaterThan(2);
      expect([1, 2, 3, 4, 5], s.id).toContain(s.difficulty);
      expect(s.objective?.length, s.id).toBeGreaterThan(8);
      for (const x of s.exams ?? []) expect(EXAMS).toContain(x);
      expect(s.exams?.length, s.id).toBeGreaterThan(0);
      expect(s.module, s.id).toMatch(/^mse-deep\/\d+-\d+$/);
    }
  });
  it("spreads items across the five rungs and every domain", () => {
    for (const d of [1, 2, 3, 4, 5]) expect(ALL.filter((s) => s.difficulty === d).length, `rung ${d}`).toBeGreaterThanOrEqual(ALL.length * 0.1);
    for (const d of MSE_DOMAINS) expect(SEED_MSE_STIMULI.filter((s) => s.domain === d).length, d).toBeGreaterThanOrEqual(30);
  });
  it("uses only the controlled words for its domain, and explains every bank item", () => {
    for (const s of SEED_MSE_STIMULI) {
      expect(s.expertTags.length, s.id).toBeGreaterThan(0);
      if (LEGACY.has(s.id)) continue;
      for (const t of [...s.expertTags, ...(s.amberTags ?? [])]) expect(MSE_VOCAB[s.domain], `${s.id} ${t}`).toContain(t);
      for (const t of s.amberTags ?? []) expect(s.expertTags).not.toContain(t);
      if (!/^mse-\d+$/.test(s.id)) expect(s.why?.length ?? 0, s.id).toBeGreaterThan(30);
    }
    for (const s of OBSERVE_STIMULI) if (s.id.startsWith("obs-b")) expect(s.why?.length ?? 0, s.id).toBeGreaterThan(40);
  });
  it("has no dashes and no citations in student text", () => {
    for (const s of ALL) {
      const t = JSON.stringify([s.content, s.why, s.objective, s.topic]);
      expect(/[–—]/.test(t), s.id).toBe(false);
      expect(/et al\.|\(\d{4}\)|Kaplan|Sadock|Stahl|Maudsley|Fish's/.test(t), s.id).toBe(false);
    }
  });
  it("draws a short, stable round per domain", () => {
    const a = domainRound(SEED_MSE_STIMULI, "speech", 3, 42);
    expect(a).toHaveLength(3);
    expect(a.every((s) => s.domain === "speech")).toBe(true);
    expect(domainRound(SEED_MSE_STIMULI, "speech", 3, 42).map((s) => s.id)).toEqual(a.map((s) => s.id));
  });
});
