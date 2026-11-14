import { describe, expect, it } from "vitest";
import { decide, newRun, THROTTLE_MS, type AnswerCtx, type Env, type Run } from "./trigger";

/** Never random-fires unless a test says so; no throttle unless given. */
const env = (over: Partial<Env> = {}): Env => ({ now: 1_000_000, lastShownAt: 0, rand: () => 0.99, enabled: true, ...over });

/** Feed answers in order; each reaction that fires sets the throttle clock 20 s apart. */
function play(answers: boolean[], ctx: AnswerCtx = {}, e: Partial<Env> = {}) {
  let run: Run = newRun();
  let now = 1_000_000;
  const moods: (string | null)[] = [];
  for (const a of answers) {
    now += 20_000;
    const d = decide(run, a, ctx, env({ now, ...e }));
    run = d.run;
    moods.push(d.mood);
  }
  return { run, moods };
}

describe("reaction trigger", () => {
  it("fires on the first right answer of a session only", () => {
    const { moods } = play([true, false, true]);
    expect(moods).toEqual(["right", null, null]);
  });

  it("fires on streaks of 3, 5 and 10", () => {
    const { moods } = play(Array(10).fill(true));
    expect(moods.map((m, i) => (m ? `${i + 1}:${m}` : null)).filter(Boolean)).toEqual(["1:right", "3:streak", "5:streak", "10:streak"]);
  });

  it("fires on 2 wrong in a row, not on 1 or 3", () => {
    const { moods } = play([false, false, false]);
    expect(moods).toEqual([null, "wrong", null]);
  });

  it("fires a surprise on a right answer after 2 or more wrong", () => {
    expect(play([true, false, false, true]).moods[3]).toBe("surprise");
    expect(play([true, false, false, false, true]).moods[4]).toBe("surprise");
    expect(play([true, false, true]).moods[2]).toBe(null);
  });

  it("fires about 1 answer in 4 otherwise", () => {
    let run: Run = { ...newRun(), hadRight: true, streak: 1 };
    let fired = 0;
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < 4000; i++) {
      // Alternate right and wrong so no rule but chance applies.
      const correct = i % 2 === 0;
      run = { ...run, streak: 0, wrongRun: 0 };
      const d = decide(run, correct, {}, env({ now: 1_000_000 + i * 20_000, rand }));
      if (d.mood) fired++;
    }
    expect(fired / 4000).toBeGreaterThan(0.2);
    expect(fired / 4000).toBeLessThan(0.3);
  });

  it("shows at most one every 15 seconds", () => {
    const run = newRun();
    const held = decide(run, true, {}, env({ now: 100_000, lastShownAt: 100_000 - (THROTTLE_MS - 1) }));
    expect(held.mood).toBe(null);
    const free = decide(run, true, {}, env({ now: 100_000, lastShownAt: 100_000 - THROTTLE_MS }));
    expect(free.mood).toBe("right");
  });

  it("never fires while a clock runs, but the run keeps counting", () => {
    const { moods, run } = play([true, true, true, false, false], { timed: true });
    expect(moods).toEqual([null, null, null, null, null]);
    expect(run).toEqual({ streak: 0, wrongRun: 2, hadRight: true, answered: 5 });
  });

  it("never fires with the switch off", () => {
    expect(play([true, true, true, false, false, true], {}, { enabled: false }).moods.every((m) => m === null)).toBe(true);
    expect(play([true], {}, { rand: () => 0 , enabled: false }).moods).toEqual([null]);
  });

  it("uses the near-miss mood for partly right answers", () => {
    expect(play([true], { partial: true }).moods).toEqual(["near"]);
    expect(play([false, false], { partial: true }).moods).toEqual([null, "near"]);
  });

  it("does not let a throttled streak skip its count", () => {
    let run = newRun();
    for (let i = 0; i < 2; i++) run = decide(run, true, {}, env()).run;
    const third = decide(run, true, {}, env({ now: 5000, lastShownAt: 1 }));
    expect(third.mood).toBe(null);
    expect(third.run.streak).toBe(3);
  });
});
