import { learnState } from "@/api/mock/fixtures";
import { nextSpot, SPOTS } from "@/lecture/watermark";
import { clock } from "@/lecture/player";
import { splitTag } from "@/study/blocks";
import { parseInline } from "@/study/rich";
import { withSectionDone } from "@/study/state";
import { canDraw, NATIVE_KINDS } from "@/study/widgets";
import { curvePoints, highlight, layoutFlow } from "@/study/widgets/diagrams";
import { shuffle } from "@/study/widgets/frame";

describe("study logic", () => {
  it("reads the three inline marks and nothing else", () => {
    expect(parseInline("A **pattern**, *not* a `term` <b>x</b>")).toEqual([
      { text: "A " },
      { text: "pattern", bold: true },
      { text: ", " },
      { text: "not", italic: true },
      { text: " a " },
      { text: "term", term: true },
      { text: " <b>x</b>" },
    ]);
  });

  it("takes the [core] tag off a heading", () => {
    expect(splitTag("The two core symptoms [core]")).toEqual({ text: "The two core symptoms", tag: "core" });
    expect(splitTag("Plain")).toEqual({ text: "Plain", tag: null });
  });

  it("draws known widget kinds natively and sends newer versions to the website row", () => {
    expect(canDraw({ kind: "guess", v: 1 })).toBe(true);
    expect(canDraw({ kind: "guess", v: 2 })).toBe(false);
    expect(canDraw({ kind: "hologram", v: 1 })).toBe(false);
    expect(NATIVE_KINDS).toEqual(expect.arrayContaining(["guess", "decide", "sort", "build", "flow", "layers", "figure", "curve", "synapse", "timeline", "compare", "experiment", "thoughtrecord", "worked", "reveal", "moodline"]));
  });

  it("lays out a chain top to bottom and a cycle all the way round", () => {
    const nodes = [1, 2, 3, 4].map((n) => ({ id: `n${n}`, label: `Step ${n}` }));
    const chain = layoutFlow({ layout: "chain", nodes });
    expect(chain.edges).toHaveLength(3);
    chain.nodes.slice(1).forEach((n, i) => expect(n.y).toBeGreaterThan(chain.nodes[i]!.y + chain.nodes[i]!.h));
    const cycle = layoutFlow({ layout: "cycle", nodes });
    expect(cycle.edges).toHaveLength(4);
    expect(cycle.edges[3]).toEqual(["n4", "n1"]);
    cycle.nodes.forEach((n) => {
      expect(n.x).toBeGreaterThanOrEqual(0);
      expect(n.x + n.w).toBeLessThanOrEqual(320);
    });
  });

  it("every curve kind stays between 0 and 1", () => {
    for (const k of ["normal", "sdt", "forgetting", "inverted-u", "dose-response", "half-life"] as const) {
      const { a } = curvePoints(k);
      expect(a.length).toBeGreaterThan(10);
      a.forEach(([x, y]) => {
        expect(x).toBeGreaterThanOrEqual(0);
        expect(y).toBeGreaterThanOrEqual(0);
        expect(y).toBeLessThanOrEqual(1.0001);
      });
    }
  });

  it("lights up one figure part by its id and ignores odd characters", () => {
    const svg = '<path data-part="axon" d="M0 0"/><path data-part="soma"/>';
    expect(highlight(svg, "axon", "#00f")).toBe('<path data-part="axon" stroke="#00f" stroke-width="3.5" d="M0 0"/><path data-part="soma"/>');
    expect(highlight(svg, 'a"x', "#00f")).toBe(svg);
  });

  it("finishing a section records the day once and adds the time", () => {
    const a = withSectionDone(learnState, "m02", "s2", "2026-11-15", 300);
    expect(a.study.done["m02/s2"]).toBe("2026-11-15");
    const b = withSectionDone(a, "m02", "s2", "2026-11-16", 60.4);
    expect(b.study.done["m02/s2"]).toBe("2026-11-15");
    expect(b.study.secs["m02/s2"]).toBe(360);
    expect(b.lab).toBe(learnState.lab); // fields the app does not touch go back as they came
  });

  it("shuffles the same way every time for the same seed", () => {
    expect(shuffle([1, 2, 3, 4, 5], 42)).toEqual(shuffle([1, 2, 3, 4, 5], 42));
    expect(shuffle([1, 2, 3, 4, 5], 42).sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it("the watermark never stays in one place", () => {
    for (let cur = 0; cur < SPOTS.length; cur++) for (const r of [0, 0.3, 0.99]) expect(nextSpot(cur, () => r)).not.toBe(cur);
  });

  it("writes lecture times the usual way", () => {
    expect(clock(1104)).toBe("18:24");
    expect(clock(3840)).toBe("1:04:00");
  });
});
