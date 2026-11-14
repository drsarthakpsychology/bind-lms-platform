// @vitest-environment jsdom
import * as React from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { makeRng } from "@/lib/games-sims/common";
import { current, dealRx, pickRx, type RxToken } from "@/lib/games-sims/rx/deal";
import { MYSTERIES } from "@/lib/games-sims/rx/content";
import type { RxPick } from "./actions";
import { RxDetective } from "./rx-detective";

/** Rx Detective against a fake server that runs the same pure rules (deal.ts). */

vi.mock("@/components/reactions/store", () => ({ showEndReaction: vi.fn(), showReaction: vi.fn(), lastShownAt: () => 0, dismissReaction: vi.fn(), subscribeShown: () => () => {}, getShown: () => null, getShownServer: () => null }));
vi.mock("@/lib/tips/actions", () => ({ loadTips: vi.fn(async () => ({ owner: "u1", ids: [] })), saveTips: vi.fn(async () => true) }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn(), push: vi.fn(), back: vi.fn() }), usePathname: () => "/", useSearchParams: () => new URLSearchParams() }));
vi.mock("@/lib/learn/credit-play", () => ({ creditServerPlay: vi.fn() }));
vi.mock("@/lib/hints/actions", () => ({ askHint: vi.fn(async () => ({ ok: false })), getHintStatus: vi.fn(async () => null), buyHintsAction: vi.fn() }));

const mask = () => 0;
const board = { ranked: [], mine: null, live: false };
afterEach(cleanup);

function server() {
  let last: RxToken | null = null;
  return {
    deal: async () => {
      const d = dealRx("u", "run1", "mystery", makeRng(1), new Map(), 0, mask);
      return { ok: true as const, token: JSON.stringify(d.payload), run: "run1", cases: d.cases };
    },
    pick: async ({ token, value }: { token: string; value: string }): Promise<RxPick> => {
      const t = JSON.parse(token) as RxToken;
      last = t;
      const res = pickRx(t, current(t, "u", mask)!, value)!;
      return res.type === "step" ? { ok: true, token: JSON.stringify(res.next), step: { right: res.right, correct: res.correct } } : { ok: true, token: JSON.stringify(res.next), answered: res.answered };
    },
    finish: vi.fn(async () => ({ ok: true, xp: 12 })),
    now: () => current(last, "u", mask),
  };
}

describe("Rx Detective, dealt on the server", () => {
  it("shows the explanation only after the answer comes back", async () => {
    const s = server();
    render(<RxDetective board={board} actions={s} />);
    await act(async () => void fireEvent.click(screen.getByRole("button", { name: /Side-effect mysteries/ })));
    const d = dealRx("u", "run1", "mystery", makeRng(1), new Map(), 0, mask);
    const ref = current(d.payload, "u", mask)!;
    const mys = MYSTERIES.find((m) => m.id === ref.id)!;
    expect(screen.getByText(mys.story)).toBeTruthy();
    expect(document.body.textContent).not.toContain(mys.why);
    const first = d.cases[0];
    if (first.kind !== "mystery") throw new Error("mystery expected");
    const right = first.options.find((o) => o.id === mys.answer)!;
    await act(async () => void fireEvent.click(screen.getByRole("button", { name: new RegExp(right.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) })));
    expect(screen.getByText(mys.why)).toBeTruthy();
    expect(screen.getAllByText("Right").length).toBeGreaterThan(0);
  });

  it("a lost connection is not a wrong answer", async () => {
    const s = server();
    s.pick = async () => {
      throw new Error("offline");
    };
    render(<RxDetective board={board} actions={s} />);
    await act(async () => void fireEvent.click(screen.getByRole("button", { name: /Side-effect mysteries/ })));
    const btn = screen.getAllByRole("button").find((b) => /^[a-d]/i.test(b.textContent ?? "") && !/Hint/.test(b.textContent ?? ""))!;
    await act(async () => void fireEvent.click(btn));
    expect(screen.getByText(/Your answer was not sent/)).toBeTruthy();
    expect(document.body.textContent).not.toContain("Life lost");
  });
});
