// @vitest-environment jsdom
import * as React from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * The finish sticker in the MSE trainer: each level and the small-things
 * drill ask for a happy sticker after a good result and a sad one after a
 * poor one. The store is mocked so the test reads the mood asked for.
 */

const showEndReaction = vi.fn();
vi.mock("@/components/reactions/store", () => ({
  showEndReaction: (m: string) => showEndReaction(m),
  showReaction: vi.fn(),
  lastShownAt: () => 0,
  dismissReaction: vi.fn(),
  subscribeShown: () => () => {},
  getShown: () => null,
  getShownServer: () => null,
}));
vi.mock("@/lib/tips/actions", () => ({ loadTips: vi.fn(async () => ({ owner: "u1", ids: [] })), saveTips: vi.fn(async () => true) }));
vi.mock("@/lib/history/client", () => ({
  historyFor: () => new Map(),
  orderFor: <T,>(_t: string, pool: readonly T[]) => [...pool],
  noteAnswer: vi.fn(),
  useHistoryPrefetch: () => {},
}));

import { ObserveLevel } from "./level-observe";
import { DomainLevel } from "./level-domain";
import { FullMseLevel } from "./level-full-mse";
import { SmallThingsDrill } from "./small-things-drill";
import { SMALL_THINGS } from "@/lib/mse/small-things";
import { MSE_DOMAIN_ORDER } from "@/lib/mse/ladder";

beforeEach(() => {
  localStorage.clear();
  showEndReaction.mockClear();
  vi.stubGlobal("fetch", vi.fn(async () => new Response("{}")));
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const words = (n: number, w: string) => Array.from({ length: n }, () => w).join(" ");

describe("finish sticker in the MSE trainer", () => {
  it("Level 1: a full description with no labels is happy, a labelled one is sad", () => {
    const stimuli = [{ id: "obs-t", content: "A woman sits by the door." }];
    render(<ObserveLevel stimuli={stimuli} />);
    fireEvent.change(screen.getByLabelText("Your observation description"), { target: { value: words(90, "sits slumped, voice soft") } });
    fireEvent.click(screen.getByRole("button", { name: "Score my description" }));
    expect(showEndReaction).toHaveBeenCalledWith("streak");

    showEndReaction.mockClear();
    fireEvent.click(screen.getByRole("button", { name: "Next stimulus" }));
    fireEvent.change(screen.getByLabelText("Your observation description"), { target: { value: words(30, "she looks depressed") } });
    fireEvent.click(screen.getByRole("button", { name: "Score my description" }));
    expect(showEndReaction).toHaveBeenCalledWith("wrong");
  });

  it("Level 2: tagging every domain is a win", () => {
    render(<DomainLevel />);
    let guard = 0;
    while (!screen.queryByText(/All 11 domains tagged/) && guard++ < MSE_DOMAIN_ORDER.length * 5) {
      fireEvent.click(screen.getAllByRole("button", { pressed: false })[0]);
      fireEvent.click(screen.getByRole("button", { name: "Check" }));
      fireEvent.click(screen.getByRole("button", { name: /^Next in/ }));
    }
    expect(screen.getByText(/All 11 domains tagged/)).toBeTruthy();
    expect(showEndReaction).toHaveBeenCalledWith("streak");
  });
});
