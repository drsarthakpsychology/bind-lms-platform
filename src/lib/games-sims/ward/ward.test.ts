import { describe, expect, it } from "vitest";
import { CAMPAIGNS, campaignById } from "./campaigns";
import { choose, currentDecision, endingFor, holds, outcomeScore, startState, visibleBeats, type WardState } from "./engine";
import { TOPICS } from "@/lib/learn/model/topics";

function playAll(id: string, pick: (opts: { id: string; q: string }[]) => string): WardState {
  const c = campaignById(id)!;
  let st = startState(c);
  for (let i = 0; i < 40 && !st.done; i++) {
    const d = currentDecision(c, st)!;
    st = choose(c, st, pick(d.options));
  }
  return st;
}

describe("Ward Week content", () => {
  it("has three campaigns of 4 to 5 chapters with every decision kind", () => {
    expect(CAMPAIGNS.map((c) => c.id)).toEqual(["pune", "chennai", "london"]);
    const kinds = new Set<string>();
    const topics = new Set(TOPICS.map((t) => t.id));
    for (const c of CAMPAIGNS) {
      expect(c.chapters.length).toBeGreaterThanOrEqual(4);
      expect(c.chapters.length).toBeLessThanOrEqual(5);
      for (const ch of c.chapters)
        for (const d of ch.decisions) {
          kinds.add(d.kind);
          expect(topics.has(d.skill.split(":")[0]), d.skill).toBe(true);
          expect(d.options.some((o) => o.q === "best")).toBe(true);
          expect(new Set(d.options.map((o) => o.id)).size).toBe(d.options.length);
        }
    }
    expect([...kinds].sort()).toEqual(["assessment", "family", "medicines", "psychoeducation", "referral", "risk"]);
  });
  it("never states week numbers in teaching text", () => {
    const text = JSON.stringify(CAMPAIGNS);
    expect(/\b\d+\s*weeks?\b/i.test(text)).toBe(false);
    expect(/\b(one|two|three|four|six|eight|twelve)\s+weeks?\b/i.test(text)).toBe(false);
  });
});

describe("Ward Week engine", () => {
  it("best play ends well, harmful play ends badly", () => {
    for (const c of CAMPAIGNS) {
      const best = playAll(c.id, (os) => os.find((o) => o.q === "best")!.id);
      const worst = playAll(c.id, (os) => (os.find((o) => o.q === "harm") ?? os.find((o) => o.q === "poor") ?? os[0]).id);
      expect(best.done && worst.done).toBe(true);
      expect(outcomeScore(best)).toBeGreaterThan(outcomeScore(worst) + 25);
      expect(endingFor(c, best).min).toBe(Math.max(...c.endings.map((e) => e.min)));
      expect(endingFor(c, worst).min).toBe(0);
    }
  });
  it("earlier choices change later scenes and decisions", () => {
    const c = campaignById("pune")!;
    let st = startState(c);
    st = choose(c, st, "a");
    st = choose(c, st, "b"); // skip the risk check
    expect(st.flags).toContain("noRiskCheck");
    st = choose(c, st, "a");
    st = choose(c, st, "a");
    expect(currentDecision(c, st)!.id).toBe("p3x");
    expect(visibleBeats(c, st).some((b) => b.includes("knife"))).toBe(true);

    let safe = startState(c);
    for (const id of ["a", "a", "a", "a"]) safe = choose(c, safe, id);
    expect(currentDecision(c, safe)!.id).toBe("p3a");
  });
  it("ignores unknown options and clamps dials", () => {
    const c = campaignById("london")!;
    const st = startState(c);
    expect(choose(c, st, "zzz")).toBe(st);
    expect(holds({ v: "risk", gte: 50, lte: 60 }, st)).toBe(true);
    expect(holds({ flag: "x" }, st)).toBe(false);
    const after = playAll("london", (os) => os.find((o) => o.q === "harm")?.id ?? os[os.length - 1].id);
    expect(after.vars.risk).toBeLessThanOrEqual(100);
  });
});

describe("Ward Week helpers", () => {
  it("pays more XP for a better outcome and reads risk as lower-is-better", async () => {
    const { wardXp, deltaSign, replay, findDecision, bestOption } = await import("./engine");
    expect(wardXp(100)).toBe(30);
    expect(wardXp(0)).toBe(10);
    expect(deltaSign("risk", -10)).toBe(1);
    expect(deltaSign("trust", -10)).toBe(-1);
    expect(deltaSign("trust", 0)).toBe(0);
    const c = campaignById("chennai")!;
    const st = replay(c, ["a", "a"]);
    expect(st.log.map((l) => l.decision)).toEqual(["c1a", "c1b"]);
    expect(findDecision(c, "c4x")!.chapter).toBe(3);
    expect(bestOption(findDecision(c, "c1a")!.decision).q).toBe("best");
  });
  it("has no em or en dashes in the stories", () => {
    expect(/[–—]/.test(JSON.stringify(CAMPAIGNS))).toBe(false);
  });
});
