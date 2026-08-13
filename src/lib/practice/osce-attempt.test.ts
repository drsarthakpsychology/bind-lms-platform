import { describe, expect, it } from "vitest";
import { SEED_OSCE_STATIONS } from "./osce";
import { buildOsceAttemptPayload } from "./osce-attempt";

describe("buildOsceAttemptPayload", () => {
  it("carries the station slug, mode, and timestamps", () => {
    const station = SEED_OSCE_STATIONS[0];
    const started = new Date("2026-08-13T10:00:00Z");
    const completed = new Date("2026-08-13T10:05:00Z");
    const payload = buildOsceAttemptPayload(
      station,
      Object.fromEntries(station.checklist.map((c) => [c.item, true])),
      station.global_rating.max,
      started,
      completed,
    );
    expect(payload.slug).toBe(station.id);
    expect(payload.mode).toBe("text");
    expect(payload.started_at).toBe(started.toISOString());
    expect(payload.completed_at).toBe(completed.toISOString());
  });

  it("attaches the done state to each checklist item and computes fraction", () => {
    const station = SEED_OSCE_STATIONS[0];
    const half = Object.fromEntries(
      station.checklist.map((c, i) => [c.item, i < Math.floor(station.checklist.length / 2)]),
    );
    const payload = buildOsceAttemptPayload(station, half, 3, new Date(), new Date());
    expect(payload.checklist).toHaveLength(station.checklist.length);
    const doneItems = payload.checklist.filter((c) => c.done);
    expect(doneItems.length).toBe(Math.floor(station.checklist.length / 2));
    // Weighted: higher-weight checklist items count more than weight-1 items.
    const totalWeight = payload.checklist.reduce((a, c) => a + (c.weight ?? 1), 0);
    const doneWeight = payload.checklist.filter((c) => c.done).reduce((a, c) => a + (c.weight ?? 1), 0);
    expect(payload.scores.checklist_fraction).toBeCloseTo(doneWeight / totalWeight);
  });

  it("composite score weights checklist 60% + global rating 40%", () => {
    const station = SEED_OSCE_STATIONS[0];
    const allChecked = Object.fromEntries(station.checklist.map((c) => [c.item, true]));
    const payload = buildOsceAttemptPayload(station, allChecked, 5, new Date(), new Date());
    // checklist=1.0 * 0.6 + global=1.0 * 0.4 = 1.00
    expect(payload.scores.composite).toBe(1);
    expect(payload.scores.global_rating).toBe(1);

    const noneChecked = Object.fromEntries(station.checklist.map((c) => [c.item, false]));
    const zero = buildOsceAttemptPayload(station, noneChecked, 0, new Date(), new Date());
    expect(zero.scores.composite).toBe(0);
  });

  it("preserves the original weight on every checklist item", () => {
    const station = SEED_OSCE_STATIONS[0];
    const checked: Record<string, boolean> = {};
    const payload = buildOsceAttemptPayload(station, checked, 2, new Date(), new Date());
    for (let i = 0; i < station.checklist.length; i++) {
      expect(payload.checklist[i].weight).toBe(station.checklist[i].weight);
      expect(payload.checklist[i].item).toBe(station.checklist[i].item);
    }
  });
});
