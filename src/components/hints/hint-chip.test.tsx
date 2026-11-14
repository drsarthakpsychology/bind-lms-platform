// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const seen = new Set<string>();
vi.mock("@/lib/tips/store", () => ({
  useTip: (id: string) => ({ seen: seen.has(id), dismiss: () => {} }),
  dismissTip: (id: string) => void seen.add(id),
}));
const buyHintsAction = vi.fn();
vi.mock("@/lib/hints/actions", () => ({ askHint: vi.fn(), getHintStatus: vi.fn(async () => null), buyHintsAction: (...a: unknown[]) => buyHintsAction(...a) }));

import { HintBar, HintButton, HINT_COST_LINE } from "./hint-chip";
import type { HintStatus } from "@/lib/hints/engine";

const status = (o: Partial<HintStatus> = {}): HintStatus => ({ day: "2026-11-14", free: 3, bought: 0, spare: 2, left: 5, boughtToday: false, canBuy: false, mode: "full", ...o });

afterEach(() => {
  cleanup();
  seen.clear();
  buyHintsAction.mockReset();
});

const flush = () =>
  act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });

describe("HintButton", () => {
  it("is one button that says how many hints are left", () => {
    render(<HintButton status={status()} onUse={vi.fn()} />);
    const b = screen.getByRole("button", { name: /hint/i });
    expect(b).toHaveTextContent("Hint");
    expect(b).toHaveTextContent("5 left");
    expect(b).toBeEnabled();
  });

  it("one tap uses one hint, and a fast second tap does not spend another", async () => {
    let done: (v: { ok: boolean }) => void = () => {};
    const onUse = vi.fn(() => new Promise<{ ok: boolean }>((r) => (done = r)));
    render(<HintButton status={status()} onUse={onUse} />);
    const b = screen.getByRole("button", { name: /hint/i });
    fireEvent.click(b);
    fireEvent.click(b);
    expect(onUse).toHaveBeenCalledTimes(1);
    await act(async () => done({ ok: true }));
  });

  it("shows the hint right under the button and the new count", async () => {
    const onStatus = vi.fn();
    const { rerender } = render(<HintButton status={status()} onStatus={onStatus} onUse={async () => ({ ok: true, status: status({ free: 2, left: 4 }) })} />);
    fireEvent.click(screen.getByRole("button", { name: /hint/i }));
    await flush();
    expect(onStatus).toHaveBeenCalledWith(expect.objectContaining({ left: 4 }));
    rerender(<HintButton status={status({ free: 2, left: 4 })} onUse={vi.fn()} shown="Chapter: Anxiety disorders." used />);
    expect(screen.getByRole("status")).toHaveTextContent("Chapter: Anxiety disorders.");
    expect(screen.getByRole("button", { name: /hint/i })).toHaveTextContent("Hint used");
    expect(screen.getByRole("button", { name: /hint/i })).toBeDisabled();
  });

  it("explains the cost the first time only", () => {
    const first = render(<HintButton status={status()} onUse={vi.fn()} />);
    expect(screen.getByText(HINT_COST_LINE)).toBeInTheDocument();
    act(() => first.unmount());
    render(<HintButton status={status()} onUse={vi.fn()} />);
    expect(screen.queryByText(HINT_COST_LINE)).toBeNull();
  });

  it("says why it failed, in place", async () => {
    render(<HintButton status={status()} onUse={async () => ({ ok: false, error: "That's all the hints for this one." })} />);
    fireEvent.click(screen.getByRole("button", { name: /hint/i }));
    await flush();
    expect(screen.getByRole("status")).toHaveTextContent("That's all the hints for this one.");
  });

  it("when none are left, the way to get more is on screen (no menu)", async () => {
    buyHintsAction.mockResolvedValue({ ok: true, error: null, status: status({ free: 0, spare: 0, bought: 3, left: 3, boughtToday: true }) });
    const onStatus = vi.fn();
    render(<HintButton status={status({ free: 0, spare: 0, left: 0, canBuy: true })} onStatus={onStatus} onUse={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Get 3 hints for 30 XP" }));
    await flush();
    expect(buyHintsAction).toHaveBeenCalledTimes(1);
    expect(onStatus).toHaveBeenCalledWith(expect.objectContaining({ left: 3 }));
  });

  it("when none are left and none can be bought, it says when they come back", () => {
    render(<HintButton status={status({ free: 0, spare: 0, left: 0, boughtToday: true })} onUse={vi.fn()} />);
    expect(screen.getByRole("button", { name: /no hints left/i })).toBeDisabled();
    expect(screen.getByText(/come back at midnight/)).toBeInTheDocument();
  });

  it("is a big enough target for a thumb and full width on phones", () => {
    render(<HintButton status={status()} onUse={vi.fn()} />);
    const cls = screen.getByRole("button", { name: /hint/i }).className;
    expect(cls).toContain("min-h-11");
    expect(cls).toContain("w-full");
  });
});

describe("HintBar", () => {
  it("rules out options and shows the hint's own line", async () => {
    const onGive = vi.fn();
    const give = { remove: ["a", "b"], pick: null, text: "Two wrong answers are gone." };
    const ask = vi.fn(async () => ({ ok: true as const, give, status: status({ free: 2, left: 4 }) }));
    const { rerender } = render(<HintBar status={status()} onStatus={vi.fn()} ask={ask} onGive={onGive} used={false} />);
    fireEvent.click(screen.getByRole("button", { name: /hint/i }));
    await flush();
    expect(onGive).toHaveBeenCalledWith(give);
    rerender(<HintBar status={status({ free: 2, left: 4 })} onStatus={vi.fn()} ask={ask} onGive={onGive} used />);
    expect(screen.getByRole("status")).toHaveTextContent("Two wrong answers are gone.");
  });
});
