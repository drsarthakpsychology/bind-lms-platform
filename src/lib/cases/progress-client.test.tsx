// @vitest-environment jsdom
import * as React from "react";
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clearCaseProgress, resetProgressClient, saveCaseProgress, setProgressTransport, useCaseProgress } from "./progress-client";
import { noteAnswer, useToolHistory } from "@/lib/history/client";
import type { ProgressSnapshot } from "./progress";

const sent: { tool: string; item: string; state: unknown }[] = [];
const store = new Map<string, string>();

beforeEach(() => {
  vi.useFakeTimers();
  store.clear();
  sent.length = 0;
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v), removeItem: (k: string) => void store.delete(k) },
  });
  resetProgressClient();
  setProgressTransport({ save: async (tool, item, state) => void sent.push({ tool, item, state }) });
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  setProgressTransport();
});

function Probe({ server, item = "pune" }: { server?: ProgressSnapshot; item?: string }) {
  const p = useCaseProgress("ward", server);
  const s = p.get<{ choices: string[] }>(item);
  return <p data-testid="out">{s ? s.choices.join(",") : "none"}|{[...p.started].sort().join(",")}</p>;
}

describe("saved progress in the browser", () => {
  it("a saved step shows at once and reaches the server shortly after (last step wins)", async () => {
    render(<Probe />);
    expect(screen.getByTestId("out").textContent).toBe("none|");
    act(() => {
      saveCaseProgress("ward", "pune", { choices: ["a"] });
      saveCaseProgress("ward", "pune", { choices: ["a", "b"] });
    });
    expect(screen.getByTestId("out").textContent).toBe("a,b|pune");
    expect(sent).toHaveLength(0);
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    expect(sent).toEqual([{ tool: "ward", item: "pune", state: { choices: ["a", "b"] } }]);
  });

  it("the server copy restores the step on another device; a newer local step wins", () => {
    const server: ProgressSnapshot = { owner: "me", rows: [{ item: "pune", state: { choices: ["x", "y"] }, at: Date.now() - 5000 }] };
    const { rerender } = render(<Probe server={server} />);
    expect(screen.getByTestId("out").textContent).toBe("x,y|pune");
    act(() => saveCaseProgress("ward", "pune", { choices: ["x", "y", "z"] }));
    rerender(<Probe server={server} />);
    expect(screen.getByTestId("out").textContent).toBe("x,y,z|pune");
  });

  it("finishing clears the step here and on the server at once, and an older server copy can't bring it back", async () => {
    const server: ProgressSnapshot = { owner: "me", rows: [{ item: "pune", state: { choices: ["x"] }, at: Date.now() - 5000 }] };
    render(<Probe server={server} />);
    act(() => clearCaseProgress("ward", "pune"));
    expect(screen.getByTestId("out").textContent).toBe("none|");
    await act(async () => {
      await Promise.resolve();
    });
    expect(sent).toEqual([{ tool: "ward", item: "pune", state: null }]);
  });

  it("another student's copy in a shared browser is dropped", () => {
    store.set("vibha-progress-v1:ward", JSON.stringify({ o: "someone-else", r: { pune: [{ choices: ["q"] }, Date.now()] } }));
    render(<Probe server={{ owner: "me", rows: [] }} />);
    expect(screen.getByTestId("out").textContent).toBe("none|");
  });

  it("blocked storage: nothing breaks, the server copy still counts", () => {
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: {
        getItem: () => {
          throw new Error("blocked");
        },
        setItem: () => {
          throw new Error("blocked");
        },
      },
    });
    render(<Probe server={{ owner: "me", rows: [{ item: "pune", state: { choices: ["s"] }, at: 1 }] }} />);
    act(() => saveCaseProgress("ward", "pune", { choices: ["s", "t"] }));
    expect(screen.getByTestId("out").textContent).toBe("s|pune");
  });
});

function DoneProbe() {
  const h = useToolHistory("ward", [{ item: "chennai", seen: 1, ok: true, at: 1, due: null }]);
  return <p data-testid="done">{[...h.keys()].sort().join(",")}</p>;
}

describe("pick screens see a case finished a moment ago", () => {
  it("useToolHistory re-renders after noteAnswer", () => {
    render(<DoneProbe />);
    expect(screen.getByTestId("done").textContent).toBe("chennai");
    act(() => noteAnswer("ward", "pune", true, { server: false }));
    expect(screen.getByTestId("done").textContent).toBe("chennai,pune");
  });
});
