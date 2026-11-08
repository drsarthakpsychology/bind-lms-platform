// @vitest-environment jsdom
/**
 * Pacing rules for every player: nothing advances until the student presses
 * something, and Play holds each step for its reading time (about 250 ms a
 * word, at least 3 s), pauses when the tab is hidden, and never skips text.
 */
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { MODULES } from "@/lib/study";
import type { Block, FlowData } from "@/lib/study/types";
import { Widget } from "./widgets";
import { MIN_STEP_MS, PlayBar, WORD_MS, readingMs, useStepPlayer, wordCount } from "./pacing";

/** A minimal stepped player, built the way every step-by-step widget uses the shared player. */
function Flow({ d }: { d: FlowData }) {
  const st = useStepPlayer(d.nodes.length, (k) => `${d.nodes[k]?.label ?? ""} ${d.nodes[k]?.detail ?? ""}`, { start: -1 });
  const active = st.i >= 0 ? d.nodes[st.i] : null;
  return (
    <div>
      <PlayBar st={st} kind="flow" first="Play step by step" hint="or tap any box" />
      <p role="status">{active ? `${active.label}: ${active.detail ?? ""}` : "Press Next to go one step at a time."}</p>
    </div>
  );
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

  it("Play holds each step for its words, shows Pause, stops at the end with the caption still up, and pauses when the tab is hidden", () => {
    vi.useFakeTimers();
    const long = Array.from({ length: 39 }, (_, k) => `w${k}`).join(" ");
    const d: FlowData = { layout: "chain", nodes: [{ id: "a", label: "First", detail: long }, { id: "b", label: "Second", detail: "Two words." }, { id: "c", label: "Third", detail: "Last one here." }] };
    render(<Flow d={d} />);
    const status = () => screen.getByRole("status");
    expect(status()).toHaveTextContent(/Press Next/);
    fireEvent.click(screen.getByRole("button", { name: /^Play step by step/ }));
    expect(status()).toHaveTextContent(/^First/);
    expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
    // "First" plus 39 words = 40 words = 10 s
    pass(9750);
    expect(status()).toHaveTextContent(/^First/);
    pass(500);
    expect(status()).toHaveTextContent(/^Second/);
    // the tab is hidden: Play stops and the step stays
    Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
    act(() => void document.dispatchEvent(new Event("visibilitychange")));
    Object.defineProperty(document, "hidden", { configurable: true, get: () => false });
    pass(20_000);
    expect(status()).toHaveTextContent(/^Second/);
    expect(screen.queryByRole("button", { name: "Pause" })).toBeNull();
    // play on to the end: it stops on the last step and keeps its caption
    fireEvent.click(screen.getByRole("button", { name: /^Play step by step/ }));
    pass(3000);
    expect(status()).toHaveTextContent(/^Third/);
    pass(30_000);
    expect(status()).toHaveTextContent(/^Third: Last one here\./);
    expect(screen.queryByRole("button", { name: "Pause" })).toBeNull();
    // Back and Next move one step at a time
    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(status()).toHaveTextContent(/^Second/);
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(status()).toHaveTextContent(/^Third/);
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
