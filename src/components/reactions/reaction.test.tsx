// @vitest-environment jsdom
import * as React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { REACTIONS_KEY } from "@/lib/reactions/prefs";
import { ReactionLayer, SHOW_MS } from "./reaction-layer";
import { ReactionsToggle } from "./reactions-toggle";
import { dismissReaction, resetReactionStore } from "./store";
import { useReaction, type ReactionApi } from "./use-reaction";

let api: ReactionApi | null = null;
function Quiz() {
  const r = useReaction();
  React.useEffect(() => {
    api = r;
  }, [r]);
  return <main><button type="button">Next question</button></main>;
}

function setup() {
  render(
    <>
      <Quiz />
      <ReactionLayer />
    </>,
  );
}

const popup = () => document.querySelector("[data-reaction]");

beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(Math, "random").mockReturnValue(0.99); // no chance fires
  localStorage.clear();
  resetReactionStore();
  api = null;
});
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("funny reactions in the browser", () => {
  it("pops a sticker and a line on the first right answer, announced politely, then leaves", async () => {
    setup();
    act(() => api!.onAnswer(true));
    await act(() => vi.advanceTimersByTimeAsync(1000));
    const el = popup();
    expect(el?.getAttribute("data-reaction")).toBe("right");
    const live = document.querySelector('[aria-live="polite"]');
    expect(live?.textContent).toMatch(/\./);
    expect(screen.getByRole("img").getAttribute("alt")).toBeTruthy();
    await act(() => vi.advanceTimersByTimeAsync(SHOW_MS + 500));
    expect(popup()).toBe(null);
  });

  it("is dismissed by a tap", async () => {
    setup();
    act(() => api!.onAnswer(true));
    await act(() => vi.advanceTimersByTimeAsync(1000));
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    await act(() => vi.advanceTimersByTimeAsync(400));
    expect(popup()).toBe(null);
  });

  it("stays quiet while a clock runs", async () => {
    setup();
    act(() => api!.onAnswer(true, { timed: true }));
    await act(() => vi.advanceTimersByTimeAsync(1000));
    expect(popup()).toBe(null);
  });

  it("the mute button turns funny reactions off for good", async () => {
    setup();
    act(() => api!.onAnswer(true));
    await act(() => vi.advanceTimersByTimeAsync(1000));
    fireEvent.click(screen.getByRole("button", { name: "Turn off funny reactions" }));
    await act(() => vi.advanceTimersByTimeAsync(400));
    expect(popup()).toBe(null);
    expect(localStorage.getItem(REACTIONS_KEY)).toBe("off");
    act(() => {
      api!.reset();
      api!.onAnswer(true);
    });
    await act(() => vi.advanceTimersByTimeAsync(20_000));
    expect(popup()).toBe(null);
  });

  it("an end screen taking over cancels a reaction that is still loading", async () => {
    setup();
    act(() => api!.onAnswer(true));
    act(() => dismissReaction());
    await act(() => vi.advanceTimersByTimeAsync(2000));
    expect(popup()).toBe(null);
  });

  it("the Settings switch is on by default and flips the same setting", () => {
    render(<ReactionsToggle />);
    const sw = screen.getByRole("switch", { name: /funny reactions/i }) as HTMLInputElement;
    expect(sw.checked).toBe(true);
    fireEvent.click(sw);
    expect(localStorage.getItem(REACTIONS_KEY)).toBe("off");
    expect(sw.checked).toBe(false);
    fireEvent.click(sw);
    expect(localStorage.getItem(REACTIONS_KEY)).toBe(null);
  });

  it("survives blocked storage (reactions simply stay on)", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    setup();
    act(() => api!.onAnswer(true));
    await act(() => vi.advanceTimersByTimeAsync(1000));
    expect(popup()).not.toBe(null);
  });
});
