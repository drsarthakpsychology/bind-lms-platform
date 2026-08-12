import { describe, expect, it } from "vitest";
import { ALL_SEED_SCT_ITEMS, panelDistribution, scoreSctResponse, type SctResponse } from "./sct";

describe("SCT Arena — panel scoring methodology", () => {
  it("has 60+ seed items", () => {
    expect(ALL_SEED_SCT_ITEMS.length).toBeGreaterThanOrEqual(190);
  });

  it("modal answer scores exactly 1.0", () => {
    const panel: SctResponse[] = [1, 1, 1, 0, 2, -1];
    expect(scoreSctResponse(1, panel)).toBe(1);
  });

  it("partial credit for reasonable disagreement", () => {
    const panel: SctResponse[] = [1, 1, 1, 0, 2, -1];
    // count(0)=1, count(modal=1)=3 → 1/3
    expect(scoreSctResponse(0, panel)).toBeCloseTo(1 / 3);
  });

  it("an option no expert chose scores 0 (not negative)", () => {
    const panel: SctResponse[] = [1, 1, 1];
    expect(scoreSctResponse(-2, panel)).toBe(0);
  });

  it("panel distribution spans all 5 options", () => {
    const panel: SctResponse[] = [-2, -1, 0, 1, 2];
    const dist = panelDistribution(panel);
    expect(dist).toHaveLength(5);
    for (const d of dist) expect(d.count).toBe(1);
  });

  it("empty panel scores 0", () => {
    expect(scoreSctResponse(1, [])).toBe(0);
  });

  it("every seed item has all required fields", () => {
    for (const it of ALL_SEED_SCT_ITEMS) {
      expect(it.vignette.length).toBeGreaterThan(10);
      expect(it.hypothesis.length).toBeGreaterThan(3);
      expect(it.new_information.length).toBeGreaterThan(10);
      expect(["5", "7"]).toContain(it.response_scale ?? "5");
    }
  });
});
