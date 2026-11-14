import { describe, expect, it } from "vitest";
import { CAMPAIGNS } from "./campaigns";
import { bestOption, choose, currentDecision, startState } from "./engine";
import { campaignCards, endOf, replayChoices, revealOf, revealsOf, sceneOf, soloState } from "./deal";

const secretsOf = (c: (typeof CAMPAIGNS)[number]) => [...c.endings.map((e) => e.text), ...c.chapters.flatMap((ch) => ch.decisions.flatMap((d) => d.options.map((o) => o.why)))];

describe("Ward Week deal", () => {
  it("cards and scenes never carry qualities, effects, explanations or endings", () => {
    const cards = JSON.stringify(campaignCards());
    for (const c of CAMPAIGNS) {
      let st = startState(c);
      while (!st.done) {
        const text = JSON.stringify(sceneOf(c, st));
        expect(text).not.toMatch(/"(q|fx|set|why|when|skill)"/);
        for (const s of secretsOf(c)) {
          expect(text.includes(s)).toBe(false);
          expect(cards.includes(s)).toBe(false);
        }
        st = choose(c, st, bestOption(currentDecision(c, st)!).id);
      }
      expect(sceneOf(c, st).decision).toBeNull();
    }
  });

  it("reveals a decision only once made, with the strongest call when it was not chosen", () => {
    for (const c of CAMPAIGNS) {
      const st = startState(c);
      const d = currentDecision(c, st)!;
      const weak = d.options.find((o) => o.q !== "best")!;
      const r = revealOf(c, st, weak.id)!;
      expect(r.reveal.q).toBe(weak.q);
      expect(r.reveal.why).toBe(weak.why);
      expect(r.reveal.best?.text).toBe(bestOption(d).text);
      expect(revealOf(c, st, bestOption(d).id)!.reveal.best).toBeNull();
      expect(revealOf(c, st, "zz")).toBeNull();
    }
  });

  it("replays a solo game from its own choices, and a team's log as reveals", () => {
    for (const c of CAMPAIGNS) {
      const choices: string[] = [];
      let st = startState(c);
      while (!st.done) {
        const o = currentDecision(c, st)!.options[choices.length % 2].id;
        choices.push(o);
        st = choose(c, st, o);
      }
      expect(soloState({ u: "u", run: "r", c: c.id, ch: choices }, "u")!.st).toEqual(st);
      expect(soloState({ u: "u", run: "r", c: c.id, ch: choices }, "v")).toBeNull();
      expect(replayChoices(c, ["zz"])).toBeNull();
      expect(revealsOf(c, st).length).toBe(st.log.length);
      const end = endOf(c, st)!;
      expect(end.log.length).toBe(st.log.length);
      expect(c.endings.map((e) => e.text)).toContain(end.text);
      expect(endOf(c, startState(c))).toBeNull();
    }
  });
});
