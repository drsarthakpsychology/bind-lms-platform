import { describe, expect, it } from "vitest";
import {
  addDays,
  answerXp,
  chestBonus,
  dueItems,
  emptyState,
  finishLesson,
  recordBlitzRound,
  creditPlay,
  levelFor,
  liveStreak,
  normalise,
  reviewCard,
  starsFor,
  touchStreak,
} from "./engine";

const day = "2026-11-02";

describe("learn engine", () => {
  it("pays more for a combo, capped", () => {
    expect(answerXp(1)).toBe(10);
    expect(answerXp(3)).toBe(11);
    expect(answerXp(50)).toBe(15);
  });

  it("gives stars by accuracy", () => {
    expect(starsFor(8, 8)).toBe(3);
    expect(starsFor(7, 8)).toBe(2);
    expect(starsFor(4, 8)).toBe(1);
    expect(starsFor(3, 8)).toBe(0);
  });

  it("levels up at the thresholds", () => {
    expect(levelFor(0).level).toBe(1);
    expect(levelFor(99).level).toBe(1);
    expect(levelFor(100).title).toBe("Observer");
    expect(levelFor(99999).level).toBe(12);
    expect(levelFor(50).pct).toBe(50);
  });

  it("extends, freezes and resets streaks", () => {
    const s0 = emptyState().streak;
    const a = touchStreak(s0, day).streak;
    expect(a.count).toBe(1);
    const b = touchStreak(a, addDays(day, 1)).streak;
    expect(b.count).toBe(2);
    expect(touchStreak(b, addDays(day, 1)).extended).toBe(false);
    const withFreeze = { ...b, freezes: 1 };
    const c = touchStreak(withFreeze, addDays(day, 3)); // missed day 2 only
    expect(c.streak.count).toBe(3);
    expect(c.usedFreeze).toBe(1);
    expect(touchStreak(b, addDays(day, 5)).streak.count).toBe(1);
    expect(liveStreak(b, addDays(day, 3))).toBe(0);
  });

  it("earns a freeze every 7 days", () => {
    let s = emptyState().streak;
    for (let i = 0; i < 7; i++) s = touchStreak(s, addDays(day, i)).streak;
    expect(s.count).toBe(7);
    expect(s.freezes).toBe(1);
  });

  it("schedules Leitner reviews", () => {
    expect(reviewCard(undefined, false, day)).toEqual({ box: 1, due: addDays(day, 1) });
    expect(reviewCard(undefined, true, day)).toBeNull();
    expect(reviewCard({ box: 1, due: day }, true, day)).toEqual({ box: 2, due: addDays(day, 3) });
    expect(reviewCard({ box: 5, due: day }, true, day)).toBeNull();
    const st = { ...emptyState(), srs: { a: { box: 1, due: day }, b: { box: 2, due: addDays(day, 2) } } };
    expect(dueItems(st, day)).toEqual(["a"]);
  });

  it("rolls chests with an occasional jackpot", () => {
    expect(chestBonus(0).xp).toBe(5);
    expect(chestBonus(0.9).xp).toBe(23);
    expect(chestBonus(0.95)).toEqual({ xp: 50, jackpot: true });
  });

  it("finishes a perfect lesson with XP, stars, badges and review cards", () => {
    const answers = Array.from({ length: 8 }, (_, i) => ({ id: `q${i}`, correct: true }));
    const { state, payout } = finishLesson(emptyState(), { lessonId: "u1-l1", kind: "lesson", answers, maxCombo: 8 }, day, 0);
    expect(payout.stars).toBe(3);
    expect(payout.newBadges).toEqual(expect.arrayContaining(["first_lesson", "perfect", "combo_8"]));
    expect(payout.lines.map((l) => l.label)).toEqual(expect.arrayContaining(["Perfect lesson", "First clear", "Chest", "Daily goal"]));
    expect(state.xp).toBe(payout.xp);
    expect(state.streak.count).toBe(1);
    expect(Object.keys(state.srs)).toHaveLength(0);
    expect(payout.levelUp?.to).toBe(2);
  });

  it("puts wrong answers into review and pays the daily goal only once", () => {
    const answers = [
      { id: "a", correct: false },
      { id: "b", correct: true },
    ];
    const first = finishLesson({ ...emptyState(), dailyGoal: 20 }, { lessonId: "x", kind: "lesson", answers, maxCombo: 1 }, day, 0.5);
    expect(first.state.srs.a).toEqual({ box: 1, due: addDays(day, 1) });
    expect(first.payout.goalHit).toBe(true);
    const second = finishLesson(first.state, { lessonId: "x", kind: "lesson", answers, maxCombo: 1 }, day, 0.5);
    expect(second.payout.goalHit).toBe(false);
    expect(second.state.lessons.x.plays).toBe(2);
  });

  it("repairs junk from storage", () => {
    expect(normalise(null).xp).toBe(0);
    expect(normalise({ xp: 40, badges: [1, "perfect"] }).badges).toEqual(["perfect"]);
  });
});

describe("recordBlitzRound", () => {
  it("keeps the best and awards Quick thinker at 15 right", () => {
    const a = recordBlitzRound(emptyState(), 9);
    expect(a.blitzBest).toBe(9);
    expect(a.badges).not.toContain("blitz_15");
    const b = recordBlitzRound(a, 15);
    expect(b.blitzBest).toBe(15);
    expect(b.badges).toContain("blitz_15");
    expect(recordBlitzRound(b, 4)).toBe(b);
  });
});

describe("creditPlay", () => {
  it("moves the goal and streak without adding the server XP again", () => {
    const s = emptyState();
    const a = creditPlay(s, 5, "2026-11-07");
    expect(a.xp).toBe(s.xp);
    expect(a.daily.xp).toBe(5);
    expect(a.streak.count).toBe(1);
    const b = creditPlay(a, 500, "2026-11-07");
    expect(b.daily.goalHit).toBe(true);
    expect(b.xp).toBeGreaterThan(a.xp);
    expect(b.xp - a.xp).toBeLessThan(500);
  });
});
