// @vitest-environment jsdom
/**
 * Every chart figure renders through the Widget component, in normal and quiz
 * mode, with unique label ids, every label pointing at a spot inside the
 * viewBox (no two at the same spot), and plain student text (no dashes, no citations).
 */
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { MODULES } from "@/lib/study";
import type { Block } from "@/lib/study/types";
import { Widget } from "../../widgets";
import { FIGURES } from "../registry";
import { CHARTS } from "./index";

beforeAll(() => {
  window.matchMedia = window.matchMedia || ((q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }) as unknown as MediaQueryList);
});
afterEach(cleanup);

function figureIds(blocks: Block[], out: string[] = []): string[] {
  for (const b of blocks) {
    if (b.t === "widget" && b.kind === "figure") out.push((b.data as { id: string }).id);
    else if ("blocks" in b && Array.isArray(b.blocks)) figureIds(b.blocks, out);
  }
  return out;
}

describe("chart placements in the study modules", () => {
  const ids = new Set(CHARTS.map((f) => f.id));
  const placed = MODULES.flatMap((m) => m.sections.flatMap((s) => figureIds(s.blocks)).map((id) => ({ m: m.id, id })));
  it("every placed figure exists", () => {
    expect(placed.filter((p) => !FIGURES[p.id]).map((p) => `${p.m}: ${p.id}`)).toEqual([]);
  });
  it("places chart figures at least 120 times, and every chart at least once", () => {
    const charts = placed.filter((p) => ids.has(p.id));
    expect(charts.length).toBeGreaterThanOrEqual(120);
    const used = new Set(charts.map((p) => p.id));
    expect(CHARTS.filter((f) => !used.has(f.id)).map((f) => f.id)).toEqual([]);
  });
});

describe("chart figures", () => {
  it("has at least 40 figures with unique ids", () => {
    expect(CHARTS.length).toBeGreaterThanOrEqual(40);
    expect(new Set(CHARTS.map((f) => f.id)).size).toBe(CHARTS.length);
  });

  for (const f of CHARTS) {
    it(f.id, () => {
      const [vx, vy, vw, vh] = f.viewBox.split(/\s+/).map(Number);
      expect(new Set(f.labels.map((l) => l.id)).size).toBe(f.labels.length);
      expect(f.labels.length).toBeGreaterThanOrEqual(3);
      const bad: string[] = [];
      f.labels.forEach((l, i) => {
        // x and y are the point on the part that the leader line ends on.
        if (l.x < vx || l.y < vy || l.x > vx + vw || l.y > vy + vh) bad.push(`${l.id} points outside the viewBox`);
        for (let j = 0; j < i; j++) if (Math.hypot(l.x - f.labels[j].x, l.y - f.labels[j].y) < 2) bad.push(`${l.id} points at the same spot as ${f.labels[j].id}`);
        if (!l.about || l.about.length < 20) bad.push(`${l.id} needs an about`);
      });
      const text = JSON.stringify({ t: f.title, s: f.summary, l: f.labels });
      if (/[–—]/.test(text)) bad.push("has an em or en dash");
      if (/\bet al\b|https?:|\bdoi\b|Kaplan|Sadock|Stahl|Maudsley|Ahuja|Hilgard|edition/i.test(text)) bad.push("has a citation");
      expect(bad).toEqual([]);
      for (const quiz of [false, true]) {
        const { container, unmount } = render(<Widget kind="figure" data={{ id: f.id, quiz }} />);
        expect(container.querySelector("svg")).not.toBeNull();
        expect(container.querySelectorAll("li").length).toBe(f.labels.length);
        unmount();
      }
    });
  }
});
