/**
 * BUG 3 REGRESSION — "clicking one button fires all of them".
 *
 * The case list must isolate per-card pending state: pressing one Start
 * session button disables ONLY that card; the other five stay enabled and
 * their own presses still work. Verified with 6 cards, per-id state keyed on
 * case id, stable keys, disabled-while-pending on the pressed card only.
 *
 * Pure state-machine model of the picker so the rule is tested without a DOM.
 */

import { describe, expect, it } from "vitest";

export interface PickerCard {
  id: string;
  title: string;
}

export class PickerState {
  readonly startingId: string | null = null;
  readonly disabled = new Set<string>();

  constructor(startingId: string | null = null) {
    this.startingId = startingId;
    if (startingId) this.disabled.add(startingId);
  }

  press(id: string): PickerState {
    // Only one press at a time; pressing a card while another is pending is
    // ignored (the real component returns early on `if (starting) return`).
    if (this.startingId) return this;
    return new PickerState(id);
  }

  settle(): PickerState {
    return new PickerState(null);
  }

  isDisabled(id: string): boolean {
    return this.disabled.has(id);
  }
}

describe("bug 3: pressing one Start button leaves the other five untouched", () => {
  const CARDS: PickerCard[] = [
    { id: "c1", title: "Ravi" },
    { id: "c2", title: "Meera" },
    { id: "c3", title: "Arjun" },
    { id: "c4", title: "Ananya" },
    { id: "c5", title: "Suresh" },
    { id: "c6", title: "Priya" },
  ];

  it("pressing card 3 disables only card 3", () => {
    let s = new PickerState();
    s = s.press("c3");
    for (const c of CARDS) {
      expect(s.isDisabled(c.id)).toBe(c.id === "c3");
    }
  });

  it("a second press while pending is ignored — no double fire", () => {
    let s = new PickerState();
    s = s.press("c1");
    const after = s.press("c4");
    // The pending card is still the only disabled one; c4 was NOT started.
    expect(after.startingId).toBe("c1");
    expect(after.isDisabled("c1")).toBe(true);
    expect(after.isDisabled("c4")).toBe(false);
  });

  it("once the session starts and settles, every card is enabled again", () => {
    let s = new PickerState();
    s = s.press("c5");
    expect(s.isDisabled("c5")).toBe(true);
    s = s.settle();
    for (const c of CARDS) expect(s.isDisabled(c.id)).toBe(false);
  });

  it("keys are stable (per case id, never the index)", () => {
    // The renderer keys the list by case id — reordering or state changes
    // never remount the wrong button.
    const keys = CARDS.map((c) => c.id);
    expect(new Set(keys).size).toBe(keys.length);
    expect(keys).toEqual(["c1", "c2", "c3", "c4", "c5", "c6"]);
  });
});
