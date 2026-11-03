// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { emptyState } from "./engine";

const save = async () => ({ ok: true });
const withXp = (xp: number) => ({ ...emptyState(), xp, history: { "2026-11-03": xp } });

async function freshStore() {
  vi.resetModules();
  return import("./store");
}

beforeEach(() => window.localStorage.clear());

describe("learn store keys the browser copy per student", () => {
  it("never merges the old shared key into a known student", async () => {
    window.localStorage.setItem("vibha-learn-v1", JSON.stringify(withXp(900)));
    const s = await freshStore();
    s.initLearnStore({ ...withXp(10), owner: "u1" } as never, save);
    expect(s.getLearnState()?.xp).toBe(10);
    expect(window.localStorage.getItem("vibha-learn-v1")).toBeNull();
  });

  it("reads and writes vibha-learn-v1:<owner>", async () => {
    window.localStorage.setItem("vibha-learn-v1:u1", JSON.stringify(withXp(50)));
    window.localStorage.setItem("vibha-learn-v1:u2", JSON.stringify(withXp(700)));
    const s = await freshStore();
    s.initLearnStore(withXp(20), save, "u1");
    expect(s.getLearnState()?.xp).toBe(50);
    s.setLearnState(withXp(60));
    expect(JSON.parse(window.localStorage.getItem("vibha-learn-v1:u1") ?? "{}").xp).toBe(60);
    expect(JSON.parse(window.localStorage.getItem("vibha-learn-v1:u2") ?? "{}").xp).toBe(700);
  });

  it("starts again when a different student uses the same tab", async () => {
    const s = await freshStore();
    s.initLearnStore(withXp(300), save, "u1");
    s.initLearnStore(withXp(5), save, "u2");
    expect(s.getLearnState()?.xp).toBe(5);
  });

  it("falls back to the old key only when the owner is unknown", async () => {
    window.localStorage.setItem("vibha-learn-v1", JSON.stringify(withXp(40)));
    const s = await freshStore();
    s.initLearnStore(null, save);
    expect(s.getLearnState()?.xp).toBe(40);
  });

  it("drops the local copy when the server clamps a save", async () => {
    vi.useFakeTimers();
    const s = await freshStore();
    s.initLearnStore(withXp(1), async () => ({ ok: true, clamped: true }), "u1");
    s.setLearnState(withXp(99999));
    expect(window.localStorage.getItem("vibha-learn-v1:u1")).not.toBeNull();
    await vi.advanceTimersByTimeAsync(700);
    expect(window.localStorage.getItem("vibha-learn-v1:u1")).toBeNull();
    vi.useRealTimers();
  });
});
