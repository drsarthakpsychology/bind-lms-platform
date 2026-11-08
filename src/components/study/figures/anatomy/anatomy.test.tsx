// @vitest-environment jsdom
/**
 * Every anatomy figure renders through the study Widget (plain and quiz mode),
 * has unique label ids, keeps every label point inside its drawing, and uses
 * plain student text: no dashes, no book names or citations. The margin
 * layout never lets two labels overlap.
 */
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { Widget } from "../../widgets";
import { FIGURES } from "../registry";
import { layoutLabels, parseViewBox } from "../layout";
import { ANATOMY } from "./index";

beforeAll(() => {
  window.matchMedia = window.matchMedia || ((q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }) as unknown as MediaQueryList);
});
afterEach(cleanup);

const BANNED = /[\u2013\u2014]|\bet al\b|Kaplan|Sadock|Stahl|OpenStax|Bear, Connors|Paradiso|Gray's|Atkinson|Hilgard|Kenhub|Radiopaedia|Wikipedia|https?:/;

describe("anatomy figures", () => {
  it("has at least 40 figures with unique ids, all in the registry", () => {
    expect(ANATOMY.length).toBeGreaterThanOrEqual(40);
    const ids = ANATOMY.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(FIGURES[id]).toBeDefined();
  });

  for (const f of ANATOMY) {
    it(f.id, () => {
      const ids = f.labels.map((l) => l.id);
      expect(new Set(ids).size).toBe(ids.length);
      expect(f.labels.length).toBeGreaterThanOrEqual(4);
      const [x, y, w, h] = parseViewBox(f.viewBox);
      for (const l of f.labels) {
        expect(l.x, `${l.id} x`).toBeGreaterThanOrEqual(x);
        expect(l.x, `${l.id} x`).toBeLessThanOrEqual(x + w);
        expect(l.y, `${l.id} y`).toBeGreaterThanOrEqual(y);
        expect(l.y, `${l.id} y`).toBeLessThanOrEqual(y + h);
        expect(l.about.length, l.id).toBeGreaterThan(20);
        const sentences = l.about.split(/(?<=[.!?])\s+(?=[A-Z0-9])/).length;
        expect(sentences, `${l.id} is one or two sentences`).toBeLessThanOrEqual(2);
      }
      const text = [f.title, f.summary, ...f.labels.flatMap((l) => [l.name, l.about])].join("\n");
      expect(text).not.toMatch(BANNED);

      for (const quiz of [false, true]) {
        const { container, unmount } = render(<Widget kind="figure" data={{ id: f.id, quiz, focus: [f.labels[0].id] }} />);
        expect(container.querySelector("svg")).not.toBeNull();
        expect(container.querySelectorAll("[data-label]").length).toBe(f.labels.length);
        unmount();
      }
    });
  }

  it("never lets two margin labels overlap, at phone and desktop widths", () => {
    for (const f of ANATOMY) {
      for (const px of [300, 360, 700, 1200]) {
        const L = layoutLabels(f.viewBox, f.labels, px);
        for (const side of ["left", "right"] as const) {
          const ys = L.placed.filter((p) => p.side === side).map((p) => p.y).sort((a, b) => a - b);
          for (let i = 1; i < ys.length; i++) expect(ys[i] - ys[i - 1], `${f.id} at ${px}px`).toBeGreaterThanOrEqual(L.row - 0.01);
        }
        const [, vy, , vh] = L.viewBox;
        for (const p of L.placed) {
          expect(p.y - L.row / 2).toBeGreaterThanOrEqual(vy - 0.01);
          expect(p.y + L.row / 2).toBeLessThanOrEqual(vy + vh + 0.01);
        }
      }
    }
  });
});
