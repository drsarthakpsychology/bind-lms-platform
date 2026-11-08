// @vitest-environment jsdom
import * as React from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * The finish sticker in the Practice tools: the result screen of each one
 * asks for a happy sticker after a good result and a sad one after a poor
 * one. The store is mocked so the test reads the mood asked for.
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
vi.mock("@/lib/history/client", () => ({
  pickRoundFor: <T,>(_t: string, pool: readonly T[], _id: unknown, n: number) => pool.slice(0, n),
  orderFor: <T,>(_t: string, pool: readonly T[]) => [...pool],
  noteAnswer: vi.fn(),
  useHistoryPrefetch: () => {},
}));
vi.mock("@/lib/practice/competency-client", async (orig) => ({ ...(await orig<object>()), recordCompetencyEvent: vi.fn(async () => {}) }));

import { TwoMinuteClinic } from "./two-minute-clinic/clinic";
import { OsceStationView } from "./osce/osce-station";
import { FormulationForge, type ForgeSeed } from "./formulation/forge";
import { WeakSpotsDrill } from "./weak-spots/weak-spots-drill";
import { QuizCheck } from "@/components/practice/quiz-check";
import { CLINICS } from "@/lib/practice/clinic";
import type { DrillItem } from "@/lib/practice/weak-spots";
import { resetHowTo } from "@/components/help/how-to";

beforeEach(() => {
  localStorage.clear();
  resetHowTo();
  showEndReaction.mockClear();
  vi.stubGlobal("fetch", vi.fn(async () => new Response("{}")));
});
afterEach(() => {
  cleanup();
  resetHowTo();
  vi.unstubAllGlobals();
});

describe("finish sticker in the Practice tools", () => {
  it("Two-minute clinic: naming the expert's first diagnosis is happy, a blank one is sad", () => {
    const item = CLINICS[0];
    render(<TwoMinuteClinic order={[item.id]} />);
    fireEvent.click(screen.getByRole("button", { name: "Start the clock" }));
    fireEvent.change(screen.getByLabelText(/Your differential/), { target: { value: item.expertDifferential[0] } });
    fireEvent.click(screen.getByRole("button", { name: "Compare with the expert" }));
    expect(screen.getByText("Expert comparison")).toBeTruthy();
    expect(showEndReaction).toHaveBeenCalledWith("streak");

    showEndReaction.mockClear();
    fireEvent.click(screen.getByRole("button", { name: "Next one-liner" }));
    fireEvent.click(screen.getByRole("button", { name: "Start the clock" }));
    fireEvent.click(screen.getByRole("button", { name: "Compare with the expert" }));
    expect(showEndReaction).toHaveBeenCalledWith("wrong");
  });

  it("OSCE: a full checklist is happy, an empty one is sad", async () => {
    render(<OsceStationView />);
    fireEvent.click(screen.getAllByRole("button", { name: /Station/ })[0]);
    fireEvent.click(screen.getByRole("button", { name: /self-assess/ }));
    for (const box of screen.getAllByRole("checkbox")) fireEvent.click(box);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Save & pick another/ }));
    });
    expect(showEndReaction).toHaveBeenCalledWith("streak");

    showEndReaction.mockClear();
    fireEvent.click(screen.getAllByRole("button", { name: /Station/ })[0]);
    fireEvent.click(screen.getByRole("button", { name: /self-assess/ }));
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Save & pick another/ }));
    });
    expect(showEndReaction).toHaveBeenCalledWith("wrong");
  });

  it("Formulation: a right sort is happy, a wrong one is sad", () => {
    const seed: ForgeSeed = {
      id: "t-forge",
      title: "Test case",
      prompt: "Sort these.",
      modelNarrative: "A model formulation.",
      factors: [
        { id: "a", text: "Low mood for two months", bucket: "presenting" },
        { id: "b", text: "Lost a job last week", bucket: "precipitating" },
      ],
    };
    const play = (a: string, b: string) => {
      render(<FormulationForge seed={seed} />);
      fireEvent.click(screen.getByRole("button", { name: /^Low mood/ }));
      fireEvent.click(screen.getByRole("button", { name: new RegExp(`^${a}`, "i") }));
      fireEvent.click(screen.getByRole("button", { name: /^Lost a job/ }));
      fireEvent.click(screen.getByRole("button", { name: new RegExp(`^${b}`, "i") }));
      fireEvent.click(screen.getByRole("button", { name: /Write the narrative/ }));
      fireEvent.change(screen.getByRole("textbox"), { target: { value: "Ravi has low mood after losing his job, and it has lasted two months now." } });
      fireEvent.click(screen.getByRole("button", { name: /Compare with the answer/ }));
      expect(screen.getByText("Your formulation vs the model")).toBeTruthy();
    };
    play("presenting", "precipitating");
    expect(showEndReaction).toHaveBeenCalledWith("streak");
    cleanup();
    localStorage.clear();
    showEndReaction.mockClear();
    play("protective", "perpetuating");
    expect(showEndReaction).toHaveBeenCalledWith("wrong");
  });

  it("Weak-spots drill: picking the stronger line every time is happy, the weak one sad", () => {
    const items: DrillItem[] = [1, 2].map((n) => ({ id: `w${n}`, skill: "Open questions", scenario: `Moment ${n}`, weakLine: `Weak ${n}`, strongLine: `Strong ${n}`, why: "Because." }));
    const play = (which: "Weak" | "Strong") => {
      render(<WeakSpotsDrill items={items} />);
      for (const n of [1, 2]) {
        fireEvent.click(screen.getByRole("button", { name: new RegExp(`${which} ${n}`) }));
        fireEvent.click(screen.getByTestId("drill-next"));
      }
      expect(screen.getByText(/Drill complete/)).toBeTruthy();
    };
    play("Strong");
    expect(showEndReaction).toHaveBeenCalledWith("streak");
    cleanup();
    showEndReaction.mockClear();
    play("Weak");
    expect(showEndReaction).toHaveBeenCalledWith("wrong");
  });
});
