// @vitest-environment jsdom
/**
 * Step widgets show every step and its words at once (no Back, Next or Play),
 * nothing moves on its own, and a played signal journey holds each leg for
 * its reading time (about 250 ms a word, at least 3 s).
 */
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { MODULES } from "@/lib/study";
import type { Block } from "@/lib/study/types";
import { Widget } from "./widgets";
import * as React from "react";
import { MIN_STEP_MS, StepPicker, WORD_MS, readingMs, wordCount } from "./pacing";

function Picker() {
  const [i, setI] = React.useState(0);
  return <StepPicker steps={[{ id: "a", name: "First", text: "One." }, { id: "b", name: "Second", text: "Two." }, { id: "c", name: "Third", text: "Three." }]} i={i} onPick={setI} />;
}

vi.mock("@/lib/learn/track", () => ({ trackLearn: () => {} }));

beforeAll(() => {
  window.matchMedia = window.matchMedia || ((q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }) as unknown as MediaQueryList);
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const pass = (ms: number) => {
  for (let t = 0; t < ms; t += 250) act(() => void vi.advanceTimersByTime(250));
};

function widgets(blocks: Block[], out: Extract<Block, { t: "widget" }>[] = []) {
  for (const b of blocks) {
    if (b.t === "widget") out.push(b);
    else if ("blocks" in b && Array.isArray(b.blocks)) widgets(b.blocks, out);
  }
  return out;
}

describe("reading pace", () => {
  it("is about 250 ms a word, never under 3 s a step", () => {
    expect(WORD_MS).toBe(250);
    expect(MIN_STEP_MS).toBe(3000);
    expect(wordCount("The **bell** rings, then `food`.")).toBe(5);
    expect(readingMs("Short step.")).toBe(3000);
    const forty = Array.from({ length: 40 }, (_, k) => `word${k}`).join(" ");
    expect(readingMs(forty)).toBe(10_000);
    expect(readingMs("", 4200)).toBe(4200); // a longer animation raises the floor
  });

  it("a step list shows every step and its words at once, with no Back, Next or Play", () => {
    render(<Picker />);
    for (const t of ["First", "One.", "Second", "Two.", "Third", "Three."]) expect(screen.getByText(t)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^(Back|Next|Play)/ })).toBeNull();
    expect(screen.getByRole("status")).toHaveTextContent("Showing 1: First");
    fireEvent.click(screen.getByRole("button", { name: /Third/ }));
    expect(screen.getByRole("button", { name: /Third/ })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("status")).toHaveTextContent("Showing 3: Third");
  });
});

describe("no widget moves on its own", () => {
  // one example of each widget kind used in the course
  const seen = new Map<Extract<Block, { t: "widget" }>["kind"], Extract<Block, { t: "widget" }>["data"]>();
  for (const m of MODULES) for (const s of m.sections) for (const w of widgets(s.blocks)) if (!seen.has(w.kind)) seen.set(w.kind, w.data);

  it("after a minute with no press, every widget shows exactly what it showed at first", () => {
    vi.useFakeTimers();
    const moved: string[] = [];
    for (const [kind, data] of seen) {
      const { container, unmount } = render(<Widget kind={kind} data={data} />);
      pass(500); // let first-frame layout settle
      const before = container.textContent;
      pass(60_000);
      if (container.textContent !== before) moved.push(kind);
      unmount();
    }
    expect(seen.size).toBeGreaterThan(20);
    expect(moved).toEqual([]);
  }, 120_000);
});
