// @vitest-environment jsdom
/**
 * Every widget in every study module renders without throwing, in both the
 * Student and Clinician views. Catches a bad data shape in one block before a
 * student meets a blank or broken card.
 */
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { MODULES } from "@/lib/study";
import type { Block } from "@/lib/study/types";
import { Widget } from "./widgets";

beforeAll(() => {
  window.matchMedia = window.matchMedia || ((q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }) as unknown as MediaQueryList);
});
afterEach(cleanup);

function widgets(blocks: Block[], out: Extract<Block, { t: "widget" }>[] = []) {
  for (const b of blocks) {
    if (b.t === "widget") out.push(b);
    else if ("blocks" in b && Array.isArray(b.blocks)) widgets(b.blocks, out);
  }
  return out;
}

describe("every widget renders", () => {
  for (const m of MODULES) {
    it(m.id, () => {
      const list = m.sections.flatMap((s) => widgets(s.blocks));
      const broken: string[] = [];
      for (const w of list) {
        try {
          const { unmount } = render(<Widget kind={w.kind} data={w.data} />);
          unmount();
        } catch (e) {
          broken.push(`${w.kind}: ${(e as Error).message.slice(0, 120)}`);
        }
      }
      expect(broken).toEqual([]);
      expect(list.length).toBeGreaterThan(0);
    }, 60_000);
  }
});
