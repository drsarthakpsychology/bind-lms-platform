// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useOffline } from "./use-offline";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

function Pill() {
  const { offline, justReturned } = useOffline();
  return <p>{offline ? "Offline" : justReturned ? "Back online" : "online"}</p>;
}

afterEach(() => vi.restoreAllMocks());

describe("useOffline", () => {
  it("renders online on the server even where navigator has no onLine (Node)", () => {
    vi.spyOn(navigator, "onLine", "get").mockReturnValue(undefined as unknown as boolean);
    expect(renderToString(<Pill />)).toContain("online");
    expect(renderToString(<Pill />)).not.toContain("Offline");
  });

  it("hydrates without a mismatch, then follows the connection", async () => {
    const el = document.createElement("div");
    el.innerHTML = renderToString(<Pill />);
    const errors: unknown[] = [];
    const spy = vi.spyOn(console, "error").mockImplementation((...a) => errors.push(a));
    await act(async () => {
      hydrateRoot(el, <Pill />, { onRecoverableError: (e) => errors.push(e) });
    });
    expect(errors).toEqual([]);
    spy.mockRestore();
    const line = vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);
    await act(async () => {
      window.dispatchEvent(new Event("offline"));
    });
    expect(el.textContent).toBe("Offline");
    line.mockReturnValue(true);
    await act(async () => {
      window.dispatchEvent(new Event("online"));
    });
    expect(el.textContent).toBe("Back online");
  });
});
