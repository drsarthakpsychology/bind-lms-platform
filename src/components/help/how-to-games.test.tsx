// @vitest-environment jsdom
import * as React from "react";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * The how-to in real games: Start closes the open instructions, the How to
 * play button reopens them, Escape closes them, and the game is where it was.
 * Each test uses a different game, so the shared "seen" list never overlaps.
 */

vi.mock("@/lib/tips/actions", () => ({ loadTips: vi.fn(async () => ({ owner: "u1", ids: [] })), saveTips: vi.fn(async () => true) }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn(), push: vi.fn(), back: vi.fn() }), usePathname: () => "/", useSearchParams: () => new URLSearchParams() }));
// Clinic detective is dealt on the server: this fake runs the same pure rules in memory.
vi.mock("@/app/(dashboard)/practice/detective/actions", async () => {
  const m = await import("@/lib/learn/detective-deal");
  const mask = () => 0;
  let tok: import("@/lib/learn/detective-deal").DealToken | null = null;
  const at = (r: number) => m.caseAt(tok, "u", r, mask)!;
  return {
    dealDetective: async (f: "mixed" | "drug" | "disorder") => {
      const d = m.deal("u", "run1", m.poolFor(f).map((c) => c.answer), mask, () => 0.5);
      tok = d.payload;
      return { ok: true, token: "t", run: "run1", rounds: d.rounds };
    },
    detectiveClue: async (_t: string, r: number, n: number) => ({ ok: true, clue: m.clueOf(at(r), n) }),
    detectiveAllClues: async (_t: string, r: number) => ({ ok: true, clues: [...at(r).clues] }),
    detectiveGuess: async (_t: string, r: number, g: string, f: boolean) => ({ ok: true, ...m.judge(at(r), g, f) }),
  };
});
vi.mock("@/lib/hints/actions", () => ({ askHint: vi.fn(async () => ({ ok: false })), getHintStatus: vi.fn(async () => null), buyHintsAction: vi.fn() }));
const startBlitz = vi.fn();
vi.mock("@/app/(dashboard)/games/blitz/actions", () => ({ startBlitz: (...a: unknown[]) => startBlitz(...a), answerBlitz: vi.fn(), finishBlitz: vi.fn() }));

import { ActivityTip } from "./activity-tip";
import { resetHowTo } from "./how-to";
import { TwoMinuteClinic } from "@/app/(dashboard)/practice/two-minute-clinic/clinic";
import { BlitzGame } from "@/app/(dashboard)/games/blitz/blitz-game";
import { ScenarioGame, TermsGame } from "@/components/learn/clinic-games";
import { Detective } from "@/components/learn/detective";
import { TestRunner } from "@/components/study/interactive";

const flush = () =>
  act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });

const save = vi.fn(async () => null);

beforeEach(() => resetHowTo());
afterEach(() => {
  vi.useRealTimers();
  resetHowTo();
});

/** Opens the how-to sheet with the small button and returns it. */
function openSheet(label = "How it works") {
  fireEvent.click(screen.getByRole("button", { name: label }));
  return screen.getByRole("dialog");
}

describe("how-to in real games", () => {
  it("Two-minute clinic: Start closes the how-to; the sheet pauses the clock and keeps what was typed", async () => {
    render(
      <>
        <ActivityTip id="two-minute-clinic" label="How it works" steps={["Read the line, then start the clock."]} />
        <TwoMinuteClinic start={0} />
      </>,
    );
    await flush();
    expect(screen.getByText("Read the line, then start the clock.")).toBeInTheDocument();

    vi.useFakeTimers();
    fireEvent.click(screen.getByRole("button", { name: "Start the clock" }));
    expect(screen.queryByText("Read the line, then start the clock.")).not.toBeInTheDocument();
    const box = screen.getAllByRole("textbox")[0];
    fireEvent.change(box, { target: { value: "Major depression" } });
    act(() => vi.advanceTimersByTime(2000));
    expect(screen.getByText("118s")).toBeInTheDocument();

    const sheet = openSheet();
    expect(sheet).toHaveTextContent("Read the line, then start the clock.");
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.getByText("118s")).toBeInTheDocument();

    fireEvent.keyDown(sheet, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getAllByRole("textbox")[0]).toHaveValue("Major depression");
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByText("117s")).toBeInTheDocument();
  });

  it("Blitz: Start the clock closes the how-to, and the button stays away while the clock runs", async () => {
    startBlitz.mockResolvedValue({ ok: true, token: "t", msLeft: 60_000, question: { n: 0, kind: "mcq", prompt: "Which is an SSRI?", options: ["Sertraline", "Haloperidol", "Lithium", "Diazepam"] } });
    render(
      <>
        <ActivityTip id="blitz" intro="Fast facts against the clock." steps={["Answer as many as you can."]} />
        <BlitzGame bests={{ mine: 0, cohort: null, stored: true }} serverState={null} save={save} />
      </>,
    );
    await flush();
    expect(screen.getByText("Answer as many as you can.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Start the clock/ }));
    expect(screen.queryByText("Answer as many as you can.")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "How to play" })).not.toBeInTheDocument();
  });

  it("What would you do: Start closes the how-to; reopening it keeps the scenario and the pick", async () => {
    render(
      <>
        <ActivityTip id="what-would-you-do" label="How it works" steps={["Read what the patient says, then pick your response."]} />
        <ScenarioGame serverState={null} save={save} />
      </>,
    );
    await flush();
    expect(screen.getByText("Read what the patient says, then pick your response.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Start" }));
    expect(screen.queryByText("Read what the patient says, then pick your response.")).not.toBeInTheDocument();

    const before = document.body.textContent;
    const sheet = openSheet();
    expect(within(sheet).getByText("Read what the patient says, then pick your response.")).toBeInTheDocument();
    fireEvent.keyDown(sheet, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.body.textContent).toBe(before);
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: "How it works" })));
  });

  it("Say it clinically: Start closes the how-to", async () => {
    render(
      <>
        <ActivityTip id="say-it-clinically" label="How it works" steps={["Pick the clinical term for the everyday phrase."]} />
        <TermsGame serverState={null} save={save} />
      </>,
    );
    await flush();
    expect(screen.getByText("Pick the clinical term for the everyday phrase.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Start" }));
    expect(screen.queryByText("Pick the clinical term for the everyday phrase.")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "How it works" })).toBeInTheDocument();
  });

  it("Clinic detective: picking a deck closes the how-to; reopening keeps the clues shown", async () => {
    render(
      <>
        <ActivityTip id="clinic-detective" label="How it works" steps={["Guess, or open another clue."]} />
        <Detective serverState={null} save={save} />
      </>,
    );
    await flush();
    expect(screen.getByText("Guess, or open another clue.")).toBeInTheDocument();
    await act(async () => void fireEvent.click(screen.getByRole("button", { name: "Mixed" })));
    await flush();
    expect(screen.queryByText("Guess, or open another clue.")).not.toBeInTheDocument();
    const before = document.body.textContent;
    const sheet = openSheet();
    fireEvent.keyDown(sheet, { key: "Escape" });
    expect(document.body.textContent).toBe(before);
  });

  it("Study module test: the how-to button during the test keeps the answer and the place", async () => {
    const items = [
      { q: "First question?", options: ["A", "B", "C"], answer: 0 },
      { q: "Second question?", options: ["A", "B", "C"], answer: 1 },
    ];
    render(<TestRunner items={items} moduleId="m1" />);
    fireEvent.click(screen.getByRole("button", { name: /Start/ }));
    fireEvent.click(screen.getAllByRole("radio")[1]);
    expect(screen.getByText("1 of 2")).toBeInTheDocument();

    const sheet = openSheet();
    expect(sheet).toHaveTextContent("Pass mark: 80%.");
    fireEvent.keyDown(sheet, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByText("1 of 2")).toBeInTheDocument();
    expect(screen.getAllByRole("radio")[1]).toHaveAttribute("aria-checked", "true");
  });
});
