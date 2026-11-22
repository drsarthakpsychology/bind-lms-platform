import { describe, expect, it } from "vitest";
import { SEED_OSCE_STATIONS } from "./osce";
import { scoreStation, toCards } from "./osce-cards";

describe("OSCE on the server", () => {
  it("the station list carries no checklist, model points or role brief", () => {
    const cards = toCards(SEED_OSCE_STATIONS);
    expect(cards).toHaveLength(SEED_OSCE_STATIONS.length);
    const text = JSON.stringify(cards);
    expect(text).not.toMatch(/"(checklist|model_points|role_brief|weight|global_rating)"/);
    expect(cards[0].number).toBe(1);
  });

  it("scores with the station's weights, whatever the browser says", () => {
    const st = SEED_OSCE_STATIONS[0];
    const all = scoreStation(st, st.checklist.map((c) => c.item), st.global_rating.max);
    expect(all.checklist_fraction).toBe(1);
    expect(all.composite).toBe(1);
    const none = scoreStation(st, ["Not an item"], 99);
    expect(none.checklist_fraction).toBe(0);
    expect(none.rating).toBe(st.global_rating.max);
    const heavy = st.checklist.find((c) => c.weight === 2)!;
    const total = st.checklist.reduce((a, c) => a + c.weight, 0);
    expect(scoreStation(st, [heavy.item], 0).checklist_fraction).toBeCloseTo(2 / total);
  });
});
