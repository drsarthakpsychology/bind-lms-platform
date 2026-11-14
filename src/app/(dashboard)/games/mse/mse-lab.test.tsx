// @vitest-environment jsdom
import * as React from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { makeRng } from "@/lib/games-sims/common";
import { currentExcerpt, dealMse, nextExcerpt, tagMse, type MseToken } from "@/lib/games-sims/mse/deal";
import { DOMAINS, TERMS, type Domain } from "@/lib/games-sims/mse/terms";
import type { MseTag } from "./actions";
import { MseLab } from "./mse-lab";

/** MSE Lab against a fake server that runs the same pure rules (deal.ts). */

vi.mock("@/components/reactions/store", () => ({ showEndReaction: vi.fn(), showReaction: vi.fn(), lastShownAt: () => 0, dismissReaction: vi.fn(), subscribeShown: () => () => {}, getShown: () => null, getShownServer: () => null }));
vi.mock("@/lib/tips/actions", () => ({ loadTips: vi.fn(async () => ({ owner: "u1", ids: [] })), saveTips: vi.fn(async () => true) }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn(), push: vi.fn(), back: vi.fn() }), usePathname: () => "/", useSearchParams: () => new URLSearchParams() }));
vi.mock("@/lib/hints/actions", () => ({ askHint: vi.fn(async () => ({ ok: false })), getHintStatus: vi.fn(async () => null), buyHintsAction: vi.fn() }));

const mask = () => 0;
const board = { ranked: [], mine: null, live: false };
afterEach(cleanup);

function server() {
  let last: MseToken | null = null;
  return {
    deal: async () => {
      const d = dealMse("u", "run1", 1, makeRng(2), new Map(), 0, mask)!;
      last = d.payload;
      return { ok: true as const, token: JSON.stringify(d.payload), run: "run1", excerpt: d.excerpt };
    },
    tag: async ({ token, domain, term }: { token: string; domain: string; term: string }): Promise<MseTag> => {
      const t = JSON.parse(token) as MseToken;
      const res = tagMse(t, currentExcerpt(t, "u", mask)!, { domain: domain as Domain, term })!;
      if (!res.excerptDone) return { ok: true, token: JSON.stringify(res.next), reveal: res.reveal };
      const n = nextExcerpt(res.next, makeRng(3), new Map(), 0, mask);
      last = n ? n.payload : res.next;
      return { ok: true, token: JSON.stringify(last), reveal: res.reveal, excerptScore: res.excerptDone.score, next: n ? n.excerpt : null };
    },
    current: () => currentExcerpt(last, "u", mask)!,
  };
}

const click = async (el: HTMLElement) => act(async () => void fireEvent.click(el));

describe("MSE Lab, dealt on the server", () => {
  it("shows a finding's explanation only after the tag comes back, then deals the next excerpt", async () => {
    const s = server();
    render(<MseLab serverState={null} save={async () => true} board={board} actions={s} />);
    await click(screen.getByRole("button", { name: /Starting/ }));
    const e = s.current();
    for (const f of e.findings) expect(document.body.textContent).not.toContain(f.why);
    for (const [i, f] of e.findings.entries()) {
      const d = DOMAINS.find((x) => x.id === TERMS[f.a].domain)!;
      await click(screen.getByRole("button", { name: new RegExp(d.label.replace(/[()&]/g, ".")) }));
      await click(screen.getByRole("button", { name: new RegExp(TERMS[f.a].label.replace(/[()]/g, ".")) }));
      expect(screen.getByText(f.why)).toBeTruthy();
      if (i + 1 < e.findings.length) expect(document.body.textContent).not.toContain(e.findings[i + 1].why);
      await click(screen.getByRole("button", { name: /Next finding|Next excerpt/ }));
    }
    const e2 = s.current();
    expect(e2.id).not.toBe(e.id);
    expect(screen.getByText(/Excerpt 2/)).toBeTruthy();
  });

  it("a lost connection is not a wrong answer", async () => {
    const s = server();
    s.tag = async () => {
      throw new Error("offline");
    };
    render(<MseLab serverState={null} save={async () => true} board={board} actions={s} />);
    await click(screen.getByRole("button", { name: /Starting/ }));
    const f = s.current().findings[0];
    await click(screen.getByRole("button", { name: new RegExp(DOMAINS.find((x) => x.id === TERMS[f.a].domain)!.label.replace(/[()&]/g, ".")) }));
    await click(screen.getByRole("button", { name: new RegExp(TERMS[f.a].label.replace(/[()]/g, ".")) }));
    expect(screen.getByText(/Your answer was not sent/)).toBeTruthy();
    expect(document.body.textContent).not.toContain(f.why);
  });
});
