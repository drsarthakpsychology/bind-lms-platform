import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { FIGURES } from "@/components/study/figures/registry";
import { figureData, nativeSafe } from "./figure-svg";

/**
 * The phone app draws these SVGs with react-native-svg. On Android two valid
 * SVG values close the whole app (a Java exception): marker
 * orient="auto-start-reverse" and web pointer-events values. Opening the
 * first revision note (Neuroscience) did exactly that.
 */
describe("figure SVG for the app", () => {
  it("rewrites the values that crash react-native-svg on Android", () => {
    expect(nativeSafe('<marker orient="auto-start-reverse"/><path pointer-events="visibleStroke" d="M0 0"/><g pointer-events="none"/>')).toBe('<marker orient="auto"/><path d="M0 0"/><g pointer-events="none"/>');
  });

  it("no figure sends an Android-crashing value", async () => {
    for (const id of Object.keys(FIGURES)) {
      const f = await figureData(id);
      for (const svg of [f!.svg.light, f!.svg.dark]) {
        expect(svg, id).not.toMatch(/orient="(?!auto"|-?\d)/);
        expect(svg, id).not.toMatch(/pointer-events="(?!none"|auto"|box-none"|box-only")/);
        expect(svg, id).not.toMatch(/NaN|Infinity|undefined/);
      }
    }
  }, 60_000);
});
