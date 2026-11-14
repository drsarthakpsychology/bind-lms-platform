// @vitest-environment jsdom
import * as React from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { practiceAnswer, practiceStart, practiceState, roomCards, roomView, type PracticeToken } from "@/lib/games-sims/escape/deal";
import { escapeXp, shownOrder, teamTime } from "@/lib/games-sims/escape/engine";
import { ROOMS, type Puzzle } from "@/lib/games-sims/escape/rooms";
import type { PracticeResult } from "./actions";
import { EscapeRoom } from "./escape-room";

/**
 * Escape Room practice, played through the screen against a fake server that
 * runs the same pure rules (deal.ts). The page only ever holds what the
 * server sent: no answers, and each explanation only once its door is open.
 */

vi.mock("@/components/reactions/store", () => ({
  showEndReaction: vi.fn(),
  showReaction: vi.fn(),
  lastShownAt: () => 0,
  dismissReaction: vi.fn(),
  subscribeShown: () => () => {},
  getShown: () => null,
  getShownServer: () => null,
}));
vi.mock("@/lib/tips/actions", () => ({ loadTips: vi.fn(async () => ({ owner: "u1", ids: [] })), saveTips: vi.fn(async () => true) }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn(), push: vi.fn(), back: vi.fn() }), usePathname: () => "/", useSearchParams: () => new URLSearchParams() }));
vi.mock("@/lib/learn/credit-play", () => ({ creditServerPlay: vi.fn() }));
vi.mock("@/lib/cases/progress-actions", () => ({ saveMyProgress: vi.fn(async () => ({ ok: true })), loadMyProgress: vi.fn(async () => ({ owner: null, rows: [] })) }));

const cases = { student: "s", history: [], progress: { owner: null, rows: [] }, now: 0 };

const SEED = "s";
const room = ROOMS[0];

function fakeServer() {
  const enc = (t: PracticeToken) => JSON.stringify(t);
  const calls: string[] = [];
  return {
    calls,
    startEscapePractice: async (id: string): Promise<PracticeResult> => {
      const r = ROOMS.find((x) => x.id === id)!;
      const t = practiceStart("u", "run", r, 0);
      const st = practiceState(t, "u")!.st;
      return { ok: true, token: enc(t), view: roomView(r, st, SEED), state: st, now: 0 };
    },
    resumeEscapePractice: async (token: string): Promise<PracticeResult> => {
      const t = JSON.parse(token) as PracticeToken;
      const cur = practiceState(t, "u")!;
      return { ok: true, token, view: roomView(cur.room, cur.st, SEED), state: cur.st, now: 0, elapsed: 60000 };
    },
    answerEscapePractice: async ({ token, stage, answer }: { token: string; stage: number; answer: string }): Promise<PracticeResult> => {
      calls.push(answer);
      const t = JSON.parse(token) as PracticeToken;
      const cur = practiceState(t, "u")!;
      const res = practiceAnswer(t, cur.room, cur.st, stage, answer, SEED);
      if (!res) return { ok: true, token, view: roomView(cur.room, cur.st, SEED), state: cur.st, now: 0 };
      const ms = teamTime(new Date(0).toISOString(), 300000, res.state.wrong);
      const done = res.state.done ? { ms, xp: escapeXp(ms, res.state.wrong) } : {};
      return { ok: true, token: enc(res.next), view: roomView(cur.room, res.state, SEED), state: res.state, now: 0, right: res.ok, ...done };
    },
    createEscapeTeam: vi.fn(),
    joinEscapeTeam: vi.fn(),
    escapeView: vi.fn(async () => null),
    startEscapeTeam: vi.fn(),
    answerEscape: vi.fn(),
  };
}

const click = async (el: HTMLElement) => act(async () => void fireEvent.click(el));

/** Solve the current door through the screen. */
async function solve(p: Puzzle) {
  if (p.kind === "pick") return click(screen.getByRole("button", { name: new RegExp(escapeRe(p.options[p.answer])) }));
  if (p.kind === "multi") {
    for (const i of p.answer) await click(screen.getByRole("button", { name: new RegExp(escapeRe(p.options[i])) }));
    return click(screen.getByRole("button", { name: /Unlock with/ }));
  }
  if (p.kind === "order") {
    // Bubble the items into the right order with the up buttons.
    const shown = shownOrder(p, SEED).map((i) => p.items[i]);
    for (let want = 0; want < p.items.length; want++) {
      let at = shown.indexOf(p.items[want]);
      while (at > want) {
        await click(screen.getByRole("button", { name: `Move up: ${p.items[want]}` }));
        [shown[at - 1], shown[at]] = [shown[at], shown[at - 1]];
        at--;
      }
    }
    return click(screen.getByRole("button", { name: /Unlock in this order/ }));
  }
  const input = screen.getByRole("slider");
  await act(async () => void fireEvent.change(input, { target: { value: String(p.answer[0]) } }));
  return click(screen.getByRole("button", { name: /Unlock with/ }));
}
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

afterEach(cleanup);
beforeEach(() => window.localStorage.clear());

describe("Escape Room practice, dealt on the server", () => {
  it("plays a whole room: explanations show only once a door opens, the hint after two misses", async () => {
    const server = fakeServer();
    render(<EscapeRoom rooms={roomCards()} cases={cases} teamsOn={false} openTeam={null} teams={[]} actions={server} />);
    await click(screen.getAllByRole("button", { name: /Practice alone/ })[0]);
    const first = room.puzzles[0];
    expect(screen.getByText(first.prompt)).toBeTruthy();
    for (const p of room.puzzles) expect(document.body.textContent).not.toContain(p.why);

    // Two misses on the first door (a multi door: one wrong tick each time).
    expect(first.kind).toBe("multi");
    if (first.kind !== "multi") return;
    const wrong = first.options.findIndex((_, i) => !first.answer.includes(i));
    for (let k = 0; k < 2; k++) {
      await click(screen.getByRole("button", { name: new RegExp(escapeRe(first.options[wrong])) }));
      await click(screen.getByRole("button", { name: /Unlock with/ }));
      expect(screen.getByText(/Not that\. \+20 seconds/)).toBeTruthy();
      if (k === 0) expect(document.body.textContent).not.toContain(first.hint);
      // Untick for the next try.
      await click(screen.getByRole("button", { name: new RegExp(escapeRe(first.options[wrong])) }));
    }
    expect(screen.getByText(first.hint)).toBeTruthy();

    for (const [i, p] of room.puzzles.entries()) {
      await solve(p);
      expect(screen.getByText(p.why)).toBeTruthy();
      if (i + 1 < room.puzzles.length) expect(document.body.textContent).not.toContain(room.puzzles[i + 1].why);
      await click(screen.getByRole("button", { name: /Next door|Out!/ }));
    }
    expect(screen.getByText("The doors open.")).toBeTruthy();
    expect(screen.getByText(room.outro)).toBeTruthy();
    expect(screen.getByText("+" + escapeXp(340000, 2))).toBeTruthy();
    // Every answer went to the server.
    expect(server.calls.length).toBe(room.puzzles.length + 2);
  });

  it("saves the run after each door and carries on from the saved door", async () => {
    const server = fakeServer();
    const view = render(<EscapeRoom rooms={roomCards()} cases={cases} teamsOn={false} openTeam={null} teams={[]} actions={server} />);
    await click(screen.getAllByRole("button", { name: /Practice alone/ })[0]);
    await solve(room.puzzles[0]);
    view.unmount();
    render(<EscapeRoom rooms={roomCards()} cases={cases} teamsOn={false} openTeam={null} teams={[]} actions={server} />);
    expect(screen.getByText(/at a locked door/)).toBeTruthy();
    await click(screen.getByRole("button", { name: /^Carry on$/ }));
    expect(screen.getByText(room.puzzles[1].prompt)).toBeTruthy();
    expect(screen.getByText(room.puzzles[0].unlock)).toBeTruthy();
  });

  it("a lost connection is not a wrong answer", async () => {
    const server = fakeServer();
    server.answerEscapePractice = async () => {
      throw new Error("offline");
    };
    render(<EscapeRoom rooms={roomCards()} cases={cases} teamsOn={false} openTeam={null} teams={[]} actions={server} />);
    await click(screen.getAllByRole("button", { name: /Practice alone/ })[0]);
    await solve(room.puzzles[0]);
    expect(screen.getByText(/Your answer was not sent/)).toBeTruthy();
    expect(document.body.textContent).not.toContain("+20 seconds");
  });
});
