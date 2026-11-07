// @vitest-environment jsdom
/**
 * Every chart figure renders through the Widget component, in normal and quiz
 * mode, with unique label ids, every label (dot and name) inside the viewBox,
 * no two labels overlapping, and plain student text (no dashes, no citations).
 */
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { Widget } from "../../widgets";
import { CHARTS } from "./index";

beforeAll(() => {
  window.matchMedia = window.matchMedia || ((q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }) as unknown as MediaQueryList);
});
afterEach(cleanup);

/** Rough width of a label name at 11px. */
const nameW = (s: string) => s.length * 6;
const box = (l: { x: number; y: number; name: string }) => ({ x0: l.x - 9, x1: l.x + 12 + nameW(l.name), y0: l.y - 9, y1: l.y + 9 });

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
      const boxes = f.labels.map(box);
      f.labels.forEach((l, i) => {
        const b = boxes[i];
        if (b.x0 < vx || b.y0 < vy || b.x1 > vx + vw || b.y1 > vy + vh) bad.push(`${l.id} outside viewBox`);
        for (let j = 0; j < i; j++) {
          const o = boxes[j];
          if (b.x0 < o.x1 && o.x0 < b.x1 && b.y0 < o.y1 && o.y0 < b.y1) bad.push(`${l.id} overlaps ${f.labels[j].id}`);
        }
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
