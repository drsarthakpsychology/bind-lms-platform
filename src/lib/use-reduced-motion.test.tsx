// @vitest-environment jsdom
import * as React from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { act } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useReducedMotion } from "./use-reduced-motion";

function Probe() {
  const reduce = useReducedMotion();
  return <span className={reduce === false ? "anim" : undefined}>{String(reduce)}</span>;
}

function setReduce(reduce: boolean) {
  vi.stubGlobal("matchMedia", (q: string) => ({ matches: reduce && q.includes("reduce"), media: q, addEventListener() {}, removeEventListener() {} }));
  window.matchMedia = globalThis.matchMedia as typeof window.matchMedia;
}

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
afterEach(() => vi.unstubAllGlobals());

describe("useReducedMotion (hydration-safe)", () => {
  it("hydrates the server HTML without a mismatch, then gives the real answer", async () => {
    setReduce(false);
    const html = renderToString(<Probe />);
    expect(html).toContain("null");
    expect(html).not.toContain("anim");
    const el = document.createElement("div");
    el.innerHTML = html;
    document.body.appendChild(el);
    const errors: unknown[] = [];
    const spy = vi.spyOn(console, "error").mockImplementation((...a) => errors.push(a));
    await act(async () => {
      hydrateRoot(el, <Probe />, { onRecoverableError: (e) => errors.push(e) });
    });
    spy.mockRestore();
    expect(errors).toEqual([]);
    expect(el.textContent).toBe("false");
    expect(el.querySelector("span")?.className).toBe("anim");
  });

  it("is true when the person asks for less motion", async () => {
    setReduce(true);
    const el = document.createElement("div");
    el.innerHTML = renderToString(<Probe />);
    await act(async () => {
      hydrateRoot(el, <Probe />);
    });
    expect(el.textContent).toBe("true");
    expect(el.querySelector("span")?.className).toBe("");
  });
});
