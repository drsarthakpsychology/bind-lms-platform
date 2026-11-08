// @vitest-environment jsdom
import * as React from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * The finish sticker in the Learn games (What would you do, Say it
 * clinically, Clinic detective): a good round pops a happy one, a poor round
 * a sad one. The store is mocked so the test reads the mood asked for.
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
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn(), push: vi.fn(), back: vi.fn() }), usePathname: () => "/", useSearchParams: () => new URLSearchParams() }));
vi.mock("@/lib/hints/actions", () => ({ askHint: vi.fn(async () => ({ ok: false })), getHintStatus: vi.fn(async () => null), buyHintsAction: vi.fn() }));
// The round is the first items of the pool, so the test knows the answers.
vi.mock("@/lib/history/client", () => ({
  pickRoundFor: <T,>(_t: string, pool: readonly T[], _id: unknown, n: number) => pool.slice(0, n),
  noteAnswer: vi.fn(),
  useHistoryPrefetch: () => {},
}));

import { ScenarioGame } from "./clinic-games";
import { Detective } from "./detective";
import { SCENARIOS } from "@/lib/learn/scenarios";
import { CASES } from "@/lib/learn/detective";
import { conceptById } from "@/lib/learn/concepts";
import { resetHowTo } from "@/components/help/how-to";

const save = vi.fn(async () => null);

beforeEach(() => {
  localStorage.clear();
  resetHowTo();
  showEndReaction.mockClear();
});
afterEach(() => {
  cleanup();
  resetHowTo();
});

function playScenarios(outcome: "best" | "harm") {
  render(<ScenarioGame serverState={null} save={save} />);
  fireEvent.click(screen.getByRole("button", { name: "Start" }));
  for (const sc of SCENARIOS.slice(0, 5)) {
    for (const beat of sc.beats) {
      const c = beat.choices.find((x) => x.outcome === outcome) ?? beat.choices.find((x) => x.outcome !== "best")!;
      fireEvent.click(screen.getByRole("button", { name: c.text }));
      fireEvent.click(screen.getByRole("button", { name: /What happens next|Next patient|Finish/ }));
    }
  }
}

describe("finish sticker in the Learn games", () => {
  it("What would you do: every best response pops a happy sticker", () => {
    playScenarios("best");
    expect(screen.getByText(/What would you do\? complete/)).toBeTruthy();
    expect(showEndReaction).toHaveBeenCalledTimes(1);
    expect(showEndReaction).toHaveBeenCalledWith("streak");
  });

  it("What would you do: risky choices pop a sad sticker", () => {
    playScenarios("harm");
    expect(showEndReaction).toHaveBeenCalledWith("wrong");
  });

  it("Clinic detective: solving every case on the first clue pops a happy sticker", async () => {
    render(<Detective serverState={null} save={save} />);
    fireEvent.click(screen.getByRole("button", { name: "Mixed" }));
    for (const c of CASES.slice(0, 8)) {
      fireEvent.click(screen.getByRole("button", { name: conceptById(c.answer)!.term }));
      fireEvent.click(screen.getByRole("button", { name: /Next case|See results/ }));
    }
    await act(async () => {});
    expect(screen.getByText(/Detective · 320 points complete/)).toBeTruthy();
    expect(showEndReaction).toHaveBeenCalledWith("streak");
  });
});
