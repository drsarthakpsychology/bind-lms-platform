// @vitest-environment jsdom
import * as React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/tips/actions", () => ({ loadTips: vi.fn(), saveTips: vi.fn() }));

import { FirstTimeTip, TipButton, TipPanel, useFirstTimeTip } from "./first-time-tip";
import { HowToButton, HowToStart, resetHowTo, useHowTo } from "./how-to";
import { createTipStore, type TipStore } from "@/lib/tips/store";

function freshStore(ids: string[] = []) {
  const save = vi.fn(async () => true);
  return { store: createTipStore({ load: vi.fn(async () => ({ owner: "u1", ids })), save }), save };
}

const flush = () =>
  act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });

/** A stand-in game: a how-to at the top, a counter that must survive the sheet, and a Start button. */
function Game({ store, hideWhileRunning = false }: { store: TipStore; hideWhileRunning?: boolean }) {
  const tip = useFirstTimeTip("demo", store);
  const [running, setRunning] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const howTo = useHowTo("demo", { store, hideWhile: hideWhileRunning && running });
  return (
    <div>
      <TipButton tip={tip} label="How to play" steps={["Tap plus to score."]} />
      <TipPanel tip={tip} title="How to play" steps={["Tap plus to score."]} />
      <button
        type="button"
        onClick={() => {
          howTo.start();
          setRunning(true);
        }}
      >
        Start
      </button>
      <button type="button" onClick={() => setScore((s) => s + 1)}>
        Plus
      </button>
      <p>Score {score}</p>
      <p>{howTo.open ? "Paused" : "Running"}</p>
    </div>
  );
}

beforeEach(() => {
  window.localStorage.clear();
  resetHowTo();
});
afterEach(() => resetHowTo());

describe("useHowTo and HowToButton", () => {
  it("pressing Start closes the open how-to and counts it as seen", async () => {
    const { store, save } = freshStore();
    render(<Game store={store} />);
    await flush();
    expect(screen.getByText("Tap plus to score.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Start" }));
    expect(screen.queryByText("Tap plus to score.")).not.toBeInTheDocument();
    expect(save).toHaveBeenCalledWith(["demo"]);
    expect(store.get().seen.has("demo")).toBe(true);
    expect(screen.getByRole("button", { name: "How to play" })).toBeInTheDocument();
  });

  it("the button reopens the same how-to, Escape closes it, focus goes back, and the game is untouched", async () => {
    const { store } = freshStore();
    render(<Game store={store} />);
    await flush();
    fireEvent.click(screen.getByRole("button", { name: "Start" }));
    fireEvent.click(screen.getByRole("button", { name: "Plus" }));
    fireEvent.click(screen.getByRole("button", { name: "Plus" }));
    expect(screen.getByText("Score 2")).toBeInTheDocument();

    const help = screen.getByRole("button", { name: "How to play" });
    help.focus();
    fireEvent.click(help);
    const sheet = screen.getByRole("dialog", { name: "How to play" });
    expect(sheet).toHaveTextContent("Tap plus to score.");
    expect(sheet.contains(document.activeElement)).toBe(true);
    expect(screen.getByText("Paused")).toBeInTheDocument();

    fireEvent.keyDown(sheet, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: "How to play" })));
    expect(screen.getByText("Score 2")).toBeInTheDocument();
    expect(screen.getByText("Running")).toBeInTheDocument();
    // Reopening does not bring the first-time panel back either.
    expect(screen.queryByText("Tap plus to score.")).not.toBeInTheDocument();
  });

  it("Got it closes the sheet", async () => {
    render(<HowToButton id="x" steps={["One."]} />);
    fireEvent.click(screen.getByRole("button", { name: "How to play" }));
    fireEvent.click(screen.getByRole("button", { name: "Got it" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("keeps game keys inside the sheet", async () => {
    const onKey = vi.fn();
    window.addEventListener("keydown", onKey);
    render(<HowToButton id="x" steps={["One."]} />);
    fireEvent.click(screen.getByRole("button", { name: "How to play" }));
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Enter" });
    expect(onKey).not.toHaveBeenCalled();
    window.removeEventListener("keydown", onKey);
  });

  it("hides the button while a clock that cannot pause runs", async () => {
    const { store } = freshStore(["demo"]);
    render(<Game store={store} hideWhileRunning />);
    await flush();
    expect(screen.getByRole("button", { name: "How to play" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Start" }));
    expect(screen.queryByRole("button", { name: "How to play" })).not.toBeInTheDocument();
  });

  it("before Start the panel still closes by hand", async () => {
    const { store } = freshStore();
    render(<FirstTimeTip id="hand" title="How to play" steps={["By hand."]} store={store} />);
    await flush();
    fireEvent.click(screen.getByRole("button", { name: "Got it" }));
    expect(screen.queryByText("By hand.")).not.toBeInTheDocument();
    expect(store.get().seen.has("hand")).toBe(true);
  });

  it("HowToStart: the first tap inside a tool with no Start button counts as Start", async () => {
    const { store } = freshStore();
    render(
      <>
        <FirstTimeTip id="tool" title="How it works" steps={["Sort the tiles."]} store={store} />
        <HowToStart id="tool" store={store}>
          <p>Some words</p>
          <button type="button">Tile</button>
        </HowToStart>
      </>,
    );
    await flush();
    fireEvent.click(screen.getByText("Some words"));
    expect(screen.getByText("Sort the tiles.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Tile" }));
    expect(screen.queryByText("Sort the tiles.")).not.toBeInTheDocument();
  });
});
