// @vitest-environment jsdom
/**
 * The hand-drawn Study diagrams: every widget of a converted kind, in every
 * module, Exam Prep explanation and long answer, is drawn with the sketch kit,
 * and in every state (each pressed button, each slider at both ends) no two
 * labels overlap and none runs off its drawing. Labels are measured with the
 * Kalam font's own widths (src/components/sketch/check.ts); the screenshot
 * script measures the same in a real browser at 390 and 1280 px.
 */
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { MODULES } from "@/lib/study";
import { ALL_QUESTIONS } from "@/content/prep";
import { CONCEPTS } from "@/content/prep/visuals";
import { LONG_QA } from "@/content/prep-long";
import type { Block, WidgetKind } from "@/lib/study/types";
import { labelProblems } from "@/components/sketch/check";
import { Widget } from "./widgets";
import { SKETCHED } from "./sketched";

beforeAll(() => {
  window.matchMedia = window.matchMedia || ((q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }) as unknown as MediaQueryList);
});
afterEach(cleanup);

type W = { kind: WidgetKind; data: unknown; where: string };

function widgets(blocks: Block[], where: string, out: W[] = []) {
  for (const b of blocks) {
    if (b.t === "widget") out.push({ kind: b.kind, data: b.data, where });
    else if ("blocks" in b && Array.isArray(b.blocks)) widgets(b.blocks, where, out);
  }
  return out;
}

/** Each distinct diagram once: Study modules, Exam Prep explanations (and the shared concept library) and long answers. */
const ALL: W[] = (() => {
  const out = MODULES.flatMap((m) => m.sections.flatMap((s) => widgets(s.blocks, m.id)));
  const seen = new Set<unknown>(out.map((w) => w.data));
  const add = (kind: WidgetKind, data: unknown, where: string) => {
    if (seen.has(data)) return;
    seen.add(data);
    out.push({ kind, data, where });
  };
  for (const q of ALL_QUESTIONS) if (q.visual) add(q.visual.kind, q.visual.data, `prep ${q.id}`);
  for (const c of CONCEPTS) add(c.v.kind, c.v.data, "prep concept");
  for (const q of LONG_QA) for (const v of q.visuals ?? []) add(v.kind, v.data, `long ${q.id}`);
  return out;
})();

/** Every state a student can reach with one control: each pressed button, each slider at its ends. */
function states(root: HTMLElement, check: () => void) {
  check();
  for (const b of [...root.querySelectorAll<HTMLButtonElement>("button")]) {
    if (b.disabled || !b.isConnected) continue;
    fireEvent.click(b);
    check();
  }
  for (const r of [...root.querySelectorAll<HTMLInputElement>("input[type=range]")]) {
    if (!r.isConnected) continue;
    for (const v of [r.min, r.max]) {
      fireEvent.change(r, { target: { value: v } });
      check();
    }
  }
}

function problemsOf(list: W[]) {
  const problems = new Set<string>();
  for (const w of list) {
    const { container, unmount } = render(<Widget kind={w.kind} data={w.data as never} />);
    states(container, () => {
      for (const svg of container.querySelectorAll<SVGSVGElement>("svg[data-sketch]")) for (const p of labelProblems(svg)) problems.add(`${w.where} ${w.kind} ${p}`);
    });
    unmount();
  }
  return [...problems];
}

describe("hand-drawn Study diagrams", () => {
  it("every converted kind draws with the sketch kit", () => {
    const missing: string[] = [];
    for (const kind of SKETCHED) {
      const w = ALL.find((x) => x.kind === kind);
      if (!w) continue;
      const { container, unmount } = render(<Widget kind={w.kind} data={w.data as never} />);
      if (!container.querySelector("svg[data-sketch], .sketch")) missing.push(kind);
      unmount();
    }
    expect(missing).toEqual([]);
  });

  for (const kind of SKETCHED) {
    it(`${kind}: no label overlaps another or runs off the drawing, in any state`, () => {
      const list = ALL.filter((w) => w.kind === kind);
      expect(problemsOf(list)).toEqual([]);
    }, 240_000);
  }
});
