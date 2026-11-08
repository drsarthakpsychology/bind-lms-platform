import { describe, expect, it } from "vitest";
import { TOPICS } from "@/lib/learn/model/topics";
import { DIAGNOSES, RULEOUTS, SYMPTOMS } from "./cards";
import { apply, attemptFor, botMove, check, comorbidXp, newGame, progress, replay, RULES, runBots, type Game, type Move, type Setup } from "./game";

const setup = (seed: string, level: 1 | 2 | 3 = 3, mode: Setup["mode"] = "bot"): Setup => ({ seed, mode, level, names: ["You", "Bot"] });

/** A careful human: the same choices as the Consultant bot. */
function careful(g: Game): Move {
  const seats = g.seats.map((s, i) => ({ ...s, bot: i === g.turn ? (3 as const) : s.bot })) as Game["seats"];
  return botMove({ ...g, seats })!;
}

describe("Comorbid cards", () => {
  it("every diagnosis, rule-out and symptom fits together", () => {
    const sym = new Set(SYMPTOMS.map((s) => s.id));
    const topics = new Set(TOPICS.map((t) => t.id));
    for (const d of DIAGNOSES) {
      expect(d.symptoms.every((x) => sym.has(x)), d.id).toBe(true);
      expect(d.core.every((x) => d.symptoms.includes(x))).toBe(true);
      expect(d.need).toBeLessThanOrEqual(d.symptoms.length);
      expect(topics.has(d.topic)).toBe(true);
      expect(RULEOUTS.filter((r) => r.against.includes(d.id)).length).toBeGreaterThanOrEqual(1);
    }
    expect(RULES.length).toBe(3);
    expect(/[–—]/.test(JSON.stringify([SYMPTOMS, DIAGNOSES, RULEOUTS, RULES]))).toBe(false);
    expect(/\bweeks?\b/i.test(JSON.stringify([SYMPTOMS, DIAGNOSES, RULEOUTS]))).toBe(false);
  });
  it("has enough diagnoses for many different match-ups", () => {
    expect(DIAGNOSES.length).toBeGreaterThanOrEqual(14);
    expect(new Set(DIAGNOSES.map((d) => d.id)).size).toBe(DIAGNOSES.length);
    expect(new Set(SYMPTOMS.map((d) => d.id)).size).toBe(SYMPTOMS.length);
    expect(new Set(RULEOUTS.map((d) => d.id)).size).toBe(RULEOUTS.length);
    // Rounds pair two diagnoses that need a similar number of cards.
    const pairs = DIAGNOSES.flatMap((a, i) => DIAGNOSES.slice(i + 1).filter((b) => Math.abs(a.need - b.need) <= 1));
    expect(pairs.length).toBeGreaterThanOrEqual(30);
  });
  it("shares symptoms across diagnoses (the comorbidity point)", () => {
    const count = new Map<string, number>();
    for (const d of DIAGNOSES) for (const s of d.symptoms) count.set(s, (count.get(s) ?? 0) + 1);
    expect([...count.values()].filter((n) => n > 1).length).toBeGreaterThanOrEqual(4);
  });
});

describe("Comorbid rules", () => {
  it("deals two different diagnoses and full hands, deterministically", () => {
    const a = newGame(setup("x1"));
    const b = newGame(setup("x1"));
    expect(a).toEqual(b);
    expect(a.seats[0].dx).not.toBe(a.seats[1].dx);
    expect(a.seats[0].hand.length).toBe(5);
    expect(a.seats[1].bot).toBe(3);
  });
  it("bounces cards that don't fit and blocks with a valid rule-out", () => {
    let g = newGame(setup("x2"));
    const dx = DIAGNOSES.find((d) => d.id === g.seats[0].dx)!;
    const wrong = SYMPTOMS.find((s) => !dx.symptoms.includes(s.id))!;
    g = { ...g, seats: [{ ...g.seats[0], hand: [{ uid: "w", kind: "sym", id: wrong.id }, ...g.seats[0].hand] }, g.seats[1]] };
    const after = apply(g, { uid: "w", action: "play" });
    expect(after.log[after.log.length - 1].ok).toBe(false);
    expect(after.seats[0].built).toEqual([]);
    expect(after.turn).toBe(1);
    const rule = RULEOUTS.find((r) => r.against.includes(g.seats[1].dx))!;
    const g2 = { ...g, seats: [{ ...g.seats[0], hand: [{ uid: "r", kind: "rule" as const, id: rule.id }] }, g.seats[1]] as Game["seats"] };
    expect(check(g2, 0, g2.seats[0].hand[0]).ok).toBe(true);
    expect(apply(g2, { uid: "r", action: "play" }).seats[1].blocked).toBe(rule.id);
    expect(apply(g, { uid: "nope", action: "play" })).toBe(g);
  });
  it("games always end, and a careful player beats the Intern far more often than not", () => {
    let wins = 0;
    for (let i = 0; i < 60; i++) {
      let g = runBots(newGame(setup(`s${i}`, 1)));
      for (let k = 0; k < 80 && g.winner === null; k++) g = runBots(apply(g, careful(g)));
      expect(g.winner).not.toBeNull();
      if (g.winner === 0) wins++;
    }
    expect(wins).toBeGreaterThan(36);
  });
  it("a winner has a complete, unblocked diagnosis (or the move cap decided it)", () => {
    for (let i = 0; i < 30; i++) {
      let g = runBots(newGame(setup(`w${i}`, 3)));
      for (let k = 0; k < 80 && g.winner === null; k++) g = runBots(apply(g, careful(g)));
      if (g.winner === 0 || g.winner === 1) {
        const s = g.seats[g.winner];
        if (g.moves < 60 && (g.deck.length || s.hand.length)) {
          expect(progress(s).complete).toBe(true);
          expect(s.blocked).toBeNull();
        }
      }
    }
  });
  it("the server's replay matches the browser's game exactly", () => {
    const s = setup("r1", 2);
    let g = runBots(newGame(s));
    const moves: Move[] = [];
    for (let k = 0; k < 80 && g.winner === null; k++) {
      const mv = careful(g);
      moves.push(mv);
      g = runBots(apply(g, mv));
    }
    const r = replay(s, moves);
    expect(r.game).toEqual(g);
    expect(r.plays.every((p) => p.seat === 0)).toBe(true);
    const a = r.plays.map(attemptFor).filter(Boolean);
    expect(a.length).toBeGreaterThan(0);
    expect(a.every((x) => /:(criteria|differentiate)$/.test(x!.skill))).toBe(true);
  });
  it("pass-and-play has no bots and pays less XP", () => {
    const g = newGame(setup("p1", 3, "pass"));
    expect(g.seats.every((x) => x.bot === null)).toBe(true);
    expect(comorbidXp(true, 3, "pass", 0)).toBeLessThan(comorbidXp(true, 3, "bot", 0));
    expect(comorbidXp(true, 3, "bot", 99)).toBe(40);
  });
});
