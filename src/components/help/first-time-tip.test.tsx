// @vitest-environment jsdom
import * as React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/tips/actions", () => ({ loadTips: vi.fn(), saveTips: vi.fn() }));

import { FirstTimeTip } from "./first-time-tip";
import { createTipStore, type TipRemote } from "@/lib/tips/store";

function remote(ids: string[] | null, owner: string | null = "u1") {
  const saved: string[][] = [];
  const r: TipRemote = {
    load: vi.fn(async () => ({ owner, ids })),
    save: vi.fn(async (x: string[]) => {
      saved.push(x);
      return true;
    }),
  };
  return { r, saved };
}

const flush = () => act(async () => {
  await Promise.resolve();
  await Promise.resolve();
});

beforeEach(() => window.localStorage.clear());

describe("FirstTimeTip", () => {
  it("renders folded on the server, so returning students see no flash", () => {
    const { r } = remote([]);
    const html = renderToStaticMarkup(<FirstTimeTip id="duel" title="How to play" steps={["Pick a diagnosis."]} store={createTipStore(r)} />);
    expect(html).toContain('data-tip-state="folded"');
    expect(html).not.toContain("Pick a diagnosis.");
  });

  it("opens the first time, and Got it folds it for good", async () => {
    const { r, saved } = remote([]);
    const store = createTipStore(r);
    render(<FirstTimeTip id="duel" title="How to play" steps={["Pick a diagnosis."]} store={store} />);
    await flush();
    expect(screen.getByText("Pick a diagnosis.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Got it" }));
    expect(screen.queryByText("Pick a diagnosis.")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "How to play" })).toBeInTheDocument();
    expect(saved).toEqual([["duel"]]);
    expect(JSON.parse(window.localStorage.getItem("vibha-tips-v1:u1")!)).toEqual(["duel"]);
  });

  it("stays folded when the server says it was seen, and the help button reopens it", async () => {
    const { r } = remote(["duel"]);
    render(<FirstTimeTip id="duel" title="How to play" steps={["Pick a diagnosis."]} store={createTipStore(r)} />);
    await flush();
    expect(screen.queryByText("Pick a diagnosis.")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "How to play" }));
    expect(screen.getByText("Pick a diagnosis.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByText("Pick a diagnosis.")).not.toBeInTheDocument();
  });

  it("falls back to this browser when the server table is missing", async () => {
    window.localStorage.setItem("vibha-tips-v1:u1", JSON.stringify(["blitz"]));
    const { r } = remote(null);
    render(<FirstTimeTip id="blitz" title="How to play" steps={["Answer fast."]} store={createTipStore(r)} />);
    await flush();
    expect(screen.queryByText("Answer fast.")).not.toBeInTheDocument();
  });

  it("copies browser-only dismissals up once the server table exists", async () => {
    window.localStorage.setItem("vibha-tips-v1:u1", JSON.stringify(["blitz"]));
    const { r, saved } = remote(["duel"]);
    render(<FirstTimeTip id="ward" steps={["Plan the week."]} store={createTipStore(r)} />);
    await flush();
    expect(saved).toEqual([["blitz"]]);
    expect(screen.getByText("Plan the week.")).toBeInTheDocument();
  });

  it("keeps students on one device apart", async () => {
    window.localStorage.setItem("vibha-tips-v1:u1", JSON.stringify(["duel"]));
    const { r } = remote(null, "u2");
    render(<FirstTimeTip id="duel" steps={["Pick a diagnosis."]} store={createTipStore(r)} />);
    await flush();
    expect(screen.getByText("Pick a diagnosis.")).toBeInTheDocument();
  });

  it("survives broken storage and a failing server", async () => {
    const r: TipRemote = { load: vi.fn(async () => Promise.reject(new Error("down"))), save: vi.fn(async () => Promise.reject(new Error("down"))) };
    const spy = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    render(<FirstTimeTip id="duel" steps={["Pick a diagnosis."]} store={createTipStore(r)} />);
    await flush();
    expect(screen.getByText("Pick a diagnosis.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Got it" }));
    expect(screen.queryByText("Pick a diagnosis.")).not.toBeInTheDocument();
    spy.mockRestore();
  });

  it("shares one list across tips on a page", async () => {
    const { r } = remote([]);
    const store = createTipStore(r);
    render(
      <>
        <FirstTimeTip id="a" steps={["One."]} store={store} />
        <FirstTimeTip id="a" steps={["Two."]} store={store} />
      </>,
    );
    await flush();
    fireEvent.click(screen.getAllByRole("button", { name: "Got it" })[0]);
    expect(screen.queryByText("Two.")).not.toBeInTheDocument();
    expect(r.load).toHaveBeenCalledTimes(1);
  });
});
