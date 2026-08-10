import { describe, expect, it } from "vitest";
import { dailyQueue, newCardState, reviewCard, type CardState } from "./rounds";

describe("Rounds — ts-fsrs scheduler", () => {
  it("a new card is due immediately and appears in the daily queue", () => {
    const c = newCardState();
    expect(new Date(c.due_at).getTime()).toBeLessThanOrEqual(Date.now() + 1000);
    expect(dailyQueue([c], new Date(Date.now() + 5000)).length).toBe(1);
  });

  it("reviewing a card advances its due date", () => {
    const c = newCardState();
    const r = reviewCard(c, 3, new Date("2026-08-10T00:00:00Z")); // Good
    expect(r.stability).toBeGreaterThan(0);
    expect(new Date(r.due_at).getTime()).toBeGreaterThan(new Date("2026-08-10T00:00:00Z").getTime());
  });

  it("an 'again' rating reschedules much sooner than 'good'", () => {
    const base = new Date("2026-08-10T00:00:00Z");
    const again = reviewCard(newCardState(), 1, base); // Again
    const good = reviewCard(newCardState(), 3, base); // Good
    expect(new Date(again.due_at).getTime()).toBeLessThan(new Date(good.due_at).getTime());
  });

  it("the daily queue is capped at 25", () => {
    const cards: CardState[] = Array.from({ length: 40 }, () => newCardState());
    const now = new Date(Date.now() + 5000);
    expect(dailyQueue(cards, now).length).toBe(25);
  });

  it("future-dated cards are not due", () => {
    const future: CardState = { ...newCardState(), due_at: new Date(Date.now() + 86400000).toISOString() };
    expect(dailyQueue([future]).length).toBe(0);
  });
});
