// @vitest-environment jsdom
import * as React from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CAMPAIGNS } from "@/lib/games-sims/ward/campaigns";
import { bestOption, currentDecision } from "@/lib/games-sims/ward/engine";
import { campaignCards, endOf, revealOf, sceneOf, soloState, type WardToken } from "@/lib/games-sims/ward/deal";
import type { WardSolo } from "./actions";
import { WardWeek } from "./ward-week";

/** Ward Week solo against a fake server that runs the same pure rules (deal.ts). */

vi.mock("@/components/reactions/store", () => ({ showEndReaction: vi.fn(), showReaction: vi.fn(), lastShownAt: () => 0, dismissReaction: vi.fn(), subscribeShown: () => () => {}, getShown: () => null, getShownServer: () => null }));
vi.mock("@/lib/tips/actions", () => ({ loadTips: vi.fn(async () => ({ owner: "u1", ids: [] })), saveTips: vi.fn(async () => true) }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn(), push: vi.fn(), back: vi.fn() }), usePathname: () => "/", useSearchParams: () => new URLSearchParams() }));
vi.mock("@/lib/hints/actions", () => ({ askHint: vi.fn(async () => ({ ok: false })), getHintStatus: vi.fn(async () => null), buyHintsAction: vi.fn() }));
vi.mock("@/lib/learn/credit-play", () => ({ creditServerPlay: vi.fn() }));

const c = CAMPAIGNS[0];
const enc = (t: WardToken) => JSON.stringify(t);
function server() {
  return {
    startWardSolo: async (id: string): Promise<WardSolo> => {
      const t: WardToken = { u: "u", run: "r", c: id, ch: [] };
      return { ok: true, token: enc(t), scene: sceneOf(c, soloState(t, "u")!.st) };
    },
    resumeWardSolo: async ({ token }: { token?: string }): Promise<WardSolo> => {
      const t = JSON.parse(token!) as WardToken;
      return { ok: true, token: token!, scene: sceneOf(c, soloState(t, "u")!.st) };
    },
    pickWardSolo: async ({ token, option }: { token: string; option: string }): Promise<WardSolo> => {
      const t = JSON.parse(token) as WardToken;
      const r = revealOf(c, soloState(t, "u")!.st, option)!;
      const next = { ...t, ch: [...t.ch, option] };
      return { ok: true, token: enc(next), scene: sceneOf(c, r.after), reveal: r.reveal, ...(r.after.done ? { end: endOf(c, r.after), xp: 25, saved: true } : {}) };
    },
    createWardTeam: vi.fn(),
    joinWardTeam: vi.fn(),
    wardTeamView: vi.fn(async () => null),
    castWardVote: vi.fn(),
  };
}
const click = async (el: HTMLElement) => act(async () => void fireEvent.click(el));
beforeEach(() => window.localStorage.clear());
afterEach(cleanup);

describe("Ward Week solo, served from the server", () => {
  it("plays a campaign: each explanation shows only after the choice, saves the game, ends with the ending", async () => {
    render(<WardWeek campaigns={campaignCards()} teamsOn={false} openTeam={null} teams={[]} actions={server()} />);
    await click(screen.getAllByRole("button", { name: /Play solo/ })[0]);
    let t: WardToken = { u: "u", run: "r", c: c.id, ch: [] };
    for (;;) {
      const st = soloState(t, "u")!.st;
      if (st.done) break;
      const d = currentDecision(c, st)!;
      for (const o of d.options) expect(document.body.textContent).not.toContain(o.why);
      const best = bestOption(d);
      await click(screen.getByRole("button", { name: new RegExp(best.text.slice(0, 30).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) }));
      expect(screen.getByText(best.why)).toBeTruthy();
      t = { ...t, ch: [...t.ch, best.id] };
      if (!soloState(t, "u")!.st.done) expect(JSON.parse(window.localStorage.getItem("vibha-ward-solo")!).token).toBe(enc(t));
      await click(screen.getByRole("button", { name: /Next call|Next session|See the ending/ }));
    }
    expect(screen.getByText(/Your calls, looking back/)).toBeTruthy();
    expect(screen.getByText("+25")).toBeTruthy();
    expect(window.localStorage.getItem("vibha-ward-solo")).toBe("null");
  });

  it("carries on a game saved half-way", async () => {
    const t: WardToken = { u: "u", run: "r", c: c.id, ch: [bestOption(currentDecision(c, soloState({ u: "u", run: "r", c: c.id, ch: [] }, "u")!.st)!).id] };
    window.localStorage.setItem("vibha-ward-solo", JSON.stringify({ token: enc(t), campaign: c.id, title: c.title }));
    render(<WardWeek campaigns={campaignCards()} teamsOn={false} openTeam={null} teams={[]} actions={server()} />);
    await click(screen.getByRole("button", { name: /Carry on/ }));
    expect(screen.getByText(currentDecision(c, soloState(t, "u")!.st)!.prompt)).toBeTruthy();
  });
});
