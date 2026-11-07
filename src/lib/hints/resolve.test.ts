import { describe, expect, it } from "vitest";
import { CASES as DETECTIVE } from "@/lib/learn/detective";
import { buildRun, STEPS } from "@/lib/games-sims/rx/game";
import { drugById, MYSTERIES, PUZZLES } from "@/lib/games-sims/rx/content";
import { hashString, makeRng } from "@/lib/games-sims/common";
import { EXCERPTS } from "@/lib/games-sims/mse/excerpts";
import { optionsFor } from "@/lib/games-sims/mse/grade";
import { CAMPAIGNS } from "@/lib/games-sims/ward/campaigns";
import { check, newGame, runBots } from "@/lib/games-sims/comorbid/game";
import { resolveHint, type HintAsk } from "./resolve";

describe("what a hint shows (worked out on the server)", () => {
  it("Clinic detective: two wrong options go, the answer stays", () => {
    const c = DETECTIVE[0];
    const options = [c.answer, ...DETECTIVE.filter((x) => x.family === c.family && x.answer !== c.answer).slice(0, 3).map((x) => x.answer)];
    const r = resolveHint({ game: "detective", run: "run1", round: 2, answer: c.answer, options })!;
    expect(r.item).toBe("detective:run1:2");
    expect(r.give.remove).toHaveLength(2);
    expect(r.give.remove).not.toContain(c.answer);
    expect(resolveHint({ game: "detective", run: "run1", round: 2, answer: "nope", options })).toBeNull();
  });

  it("Rx Detective: never removes the right answer in any step or kind", () => {
    const qs = buildRun("mixed", makeRng(hashString("seed")));
    for (const q of qs) {
      if (q.kind === "chain") {
        q.steps.forEach((opts, step) => {
          const r = resolveHint({ game: "rx", run: "run1", kind: "chain", id: q.id, step, options: opts })!;
          expect(r.give.remove).not.toContain(drugById(q.id)![STEPS[step].key]);
          expect(r.give.remove.length).toBeGreaterThan(0);
        });
      } else {
        const right = q.kind === "mystery" ? MYSTERIES.find((m) => m.id === q.id)!.answer : PUZZLES.find((p) => p.id === q.id)!.answer;
        const r = resolveHint({ game: "rx", run: "run1", kind: q.kind, id: q.id, step: 0, options: q.options })!;
        expect(r.give.remove).not.toContain(right);
      }
    }
  });

  it("MSE Lab: keeps the word and its near misses", () => {
    for (const e of EXCERPTS.slice(0, 10)) {
      e.findings.forEach((f, idx) => {
        const r = resolveHint({ game: "mse", run: "run1", excerpt: e.id, idx, options: optionsFor(f, makeRng(1)) });
        expect(r).not.toBeNull();
        for (const x of r!.give.remove) {
          expect(x).not.toBe(f.a);
          expect(f.close ?? []).not.toContain(x);
        }
      });
    }
  });

  it("Ward Week: only weak or harmful choices go", () => {
    for (const c of CAMPAIGNS) {
      for (const d of c.chapters.flatMap((ch) => ch.decisions)) {
        const r = resolveHint({ game: "ward", run: "run1", campaign: c.id, decision: d.id, options: d.options.map((o) => o.id) })!;
        for (const id of r.give.remove) expect(["poor", "harm"]).toContain(d.options.find((o) => o.id === id)!.q);
        expect(d.options.length - r.give.remove.length).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it("Comorbid: the card it points to really fits", () => {
    const seed = "seed1234";
    const r = resolveHint({ game: "comorbid", run: seed, level: 2, moves: [] })!;
    const g = runBots(newGame({ seed, mode: "bot", level: 2, names: ["Player 1", "Player 2"] }));
    if (r.give.pick) expect(check(g, 0, g.seats[0].hand.find((c) => c.uid === r.give.pick)!).ok).toBe(true);
    expect(r.item).toBe(`comorbid:${seed}:${g.moves}`);
  });

  it("no hint exists for Differential duel or Blitz", () => {
    expect(resolveHint({ game: "duel", run: "run1" } as unknown as HintAsk)).toBeNull();
    expect(resolveHint({ game: "blitz", run: "run1" } as unknown as HintAsk)).toBeNull();
  });
});
