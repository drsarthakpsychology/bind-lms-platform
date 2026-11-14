// @vitest-environment jsdom
import * as React from "react";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
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
vi.mock("@/lib/cases/progress-actions", () => ({ saveMyProgress: vi.fn(async () => ({ ok: true })), loadMyProgress: vi.fn(async () => ({ owner: null, rows: [] })) }));

const cases = { student: "s", history: [], progress: { owner: null, rows: [] }, now: 0 };

const c = CAMPAIGNS[0];
const enc = (t: WardToken) => JSON.stringify(t);
function server() {
  return {
    startWardSolo: async (id: string): Promise<WardSolo> => {
      const t: WardToken = { u: "u", run: "r", c: id, ch: [] };
      return { ok: true, token: enc(t), scene: sceneOf(c, soloState(t, "u")!.st) };
    },
    resumeWardSolo: async ({ token, choices }: { token?: string; choices?: string[] }): Promise<WardSolo> => {
      const t = token ? (JSON.parse(token) as WardToken) : { u: "u", run: "r2", c: c.id, ch: choices! };
      return { ok: true, token: enc(t), scene: sceneOf(c, soloState(t, "u")!.st) };
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
    render(<WardWeek campaigns={campaignCards()} cases={cases} teamsOn={false} openTeam={null} teams={[]} actions={server()} />);
    await click(within(screen.getByRole("heading", { name: c.title }).closest("li")!).getByRole("button", { name: /Play solo/ }));
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
      await click(screen.getByRole("button", { name: /Next call|Next session|See the ending/ }));
    }
    expect(screen.getByText(/Your calls, looking back/)).toBeTruthy();
    expect(screen.getByText("+25")).toBeTruthy();
  });

  it("saves the game after each call and carries on from it", async () => {
    const view = render(<WardWeek campaigns={campaignCards()} cases={cases} teamsOn={false} openTeam={null} teams={[]} actions={server()} />);
    await click(within(screen.getByRole("heading", { name: c.title }).closest("li")!).getByRole("button", { name: /Play solo/ }));
    const t0: WardToken = { u: "u", run: "r", c: c.id, ch: [] };
    const best = bestOption(currentDecision(c, soloState(t0, "u")!.st)!);
    await click(screen.getByRole("button", { name: new RegExp(best.text.slice(0, 30).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) }));
    view.unmount();
    render(<WardWeek campaigns={campaignCards()} cases={cases} teamsOn={false} openTeam={null} teams={[]} actions={server()} />);
    await click(screen.getAllByRole("button", { name: /Carry on/ })[0]);
    expect(screen.getByText(currentDecision(c, soloState({ ...t0, ch: [best.id] }, "u")!.st)!.prompt)).toBeTruthy();
  });

  it("carries on a game saved half-way before saves moved to the server (old browser slot)", async () => {
    const t: WardToken = { u: "u", run: "r", c: c.id, ch: [bestOption(currentDecision(c, soloState({ u: "u", run: "r", c: c.id, ch: [] }, "u")!.st)!).id] };
    window.localStorage.setItem("vibha-ward-solo", JSON.stringify({ campaign: c.id, choices: t.ch, run: "old" }));
    render(<WardWeek campaigns={campaignCards()} cases={cases} teamsOn={false} openTeam={null} teams={[]} actions={server()} />);
    await click(screen.getAllByRole("button", { name: /Carry on/ })[0]);
    expect(screen.getByText(currentDecision(c, soloState(t, "u")!.st)!.prompt)).toBeTruthy();
  });
});
