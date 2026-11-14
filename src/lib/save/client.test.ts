// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { __saveForTests, flushOnExit, flushSaves, getSaveStatus, markStale, onSaved, queueSave, saveReady, setSaveOwner, trySave } from "./client";
import { createOutbox, type StorageLike } from "./outbox";

type Sent = { owner: string; items: { id: string; kind: string; payload: unknown }[] };
let sent: Sent[] = [];
let answer: (b: Sent) => Response | Promise<Response>;

function memStorage(): StorageLike {
  const m = new Map<string, string>();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
}

const okAll = (b: Sent) => new Response(JSON.stringify({ results: b.items.map((i) => ({ id: i.id, status: "ok" })) }), { status: 200 });

beforeEach(() => {
  vi.useFakeTimers();
  sent = [];
  answer = okAll;
  __saveForTests.reset({
    outbox: createOutbox({ storage: memStorage }),
    transport: async (body) => {
      const b = JSON.parse(body) as Sent;
      sent.push(b);
      return answer(b);
    },
  });
});
afterEach(() => {
  vi.useRealTimers();
});

const box = () => __saveForTests.outbox();

describe("save client", () => {
  it("does nothing until the dashboard says who is signed in", () => {
    expect(saveReady()).toBe(false);
    expect(queueSave("progress", "L1", { lessonId: "L1", watched: 1, duration: 9 })).toBe(false);
    setSaveOwner("me");
    expect(saveReady()).toBe(true);
    expect(queueSave("progress", "L1", { lessonId: "L1", watched: 1, duration: 9 })).toBe(true);
  });

  it("sends a queued save and forgets it once stored", async () => {
    setSaveOwner("me");
    queueSave("learn", "k", { state: { xp: 5 } });
    await flushSaves();
    expect(sent).toHaveLength(1);
    expect(sent[0].owner).toBe("me");
    expect(sent[0].items[0]).toMatchObject({ kind: "learn", payload: { state: { xp: 5 } } });
    expect(box().list("me")).toHaveLength(0);
    expect(getSaveStatus()).toBe("idle");
  });

  it("keeps a save when the network fails, says so, and sends it again later", async () => {
    setSaveOwner("me");
    answer = () => {
      throw new TypeError("Failed to fetch");
    };
    queueSave("progress", "L1", { lessonId: "L1", watched: 30, duration: 90 });
    await flushSaves();
    expect(box().list("me")).toHaveLength(1);
    expect(getSaveStatus()).toBe("retrying");
    answer = okAll;
    await vi.advanceTimersByTimeAsync(2_100);
    expect(sent.length).toBeGreaterThanOrEqual(2);
    expect(box().list("me")).toHaveLength(0);
    expect(getSaveStatus()).toBe("idle");
  });

  it("retries only the saves the server could not store", async () => {
    setSaveOwner("me");
    queueSave("progress", "L1", { lessonId: "L1", watched: 1, duration: 9 });
    queueSave("progress", "L2", { lessonId: "L2", watched: 1, duration: 9 });
    queueSave("progress", "L3", { lessonId: "L3", watched: 1, duration: 9 });
    answer = (b) => new Response(JSON.stringify({ results: b.items.map((i, n) => ({ id: i.id, status: ["ok", "retry", "drop"][n] })) }), { status: 200 });
    await flushSaves();
    const left = box().list("me");
    expect(left).toHaveLength(1);
    expect(left[0].key).toBe("L2");
    expect(left[0].tries).toBe(1);
  });

  it("keeps everything when signed out, and says so", async () => {
    setSaveOwner("me");
    answer = () => new Response("{}", { status: 401 });
    queueSave("learn", "k", { state: {} });
    await flushSaves();
    expect(box().list("me")).toHaveLength(1);
    expect(getSaveStatus()).toBe("signed-out");
  });

  it("drops saves for a paused account", async () => {
    setSaveOwner("me");
    answer = () => new Response("{}", { status: 403 });
    queueSave("learn", "k", { state: {} });
    await flushSaves();
    expect(box().list("me")).toHaveLength(0);
  });

  it("hands the server's answer to the kind's handler (clamped learn saves)", async () => {
    setSaveOwner("me");
    const seen: unknown[] = [];
    onSaved("learn", (data) => seen.push(data));
    answer = (b) => new Response(JSON.stringify({ results: [{ id: b.items[0].id, status: "ok", data: { clamped: true } }] }), { status: 200 });
    queueSave("learn", "k", { state: {} });
    await flushSaves();
    expect(seen).toEqual([{ clamped: true }]);
  });

  it("sends what was left from the last visit as soon as the student is known", async () => {
    box().add({ kind: "progress", key: "L1", owner: "me", payload: { lessonId: "L1", watched: 5, duration: 9 } });
    box().add({ kind: "progress", key: "L9", owner: "someone-else", payload: { lessonId: "L9", watched: 5, duration: 9 } });
    setSaveOwner("me");
    await vi.runOnlyPendingTimersAsync();
    expect(sent).toHaveLength(1);
    expect(sent[0].items.map((i) => (i.payload as { lessonId: string }).lessonId)).toEqual(["L1"]);
    expect(box().list("someone-else")).toHaveLength(1);
  });

  it("on leaving the page keeps saves that are safe to send twice until confirmed", () => {
    setSaveOwner("me");
    const beacon = vi.fn(() => true);
    Object.defineProperty(navigator, "sendBeacon", { configurable: true, value: beacon });
    box().add({ kind: "progress", key: "L1", owner: "me", payload: { lessonId: "L1", watched: 5, duration: 9 } });
    box().add({ kind: "history", key: "t", owner: "me", payload: { tool: "t", answers: [] } });
    flushOnExit();
    expect(beacon).toHaveBeenCalledTimes(1);
    expect(box().list("me").map((x) => x.kind)).toEqual(["progress"]);
  });

  it("shows the reload note after a new deployment", () => {
    markStale();
    expect(getSaveStatus()).toBe("stale");
  });
});

describe("trySave", () => {
  it("tries a failed direct save again and shows the note meanwhile", async () => {
    const fn = vi.fn().mockRejectedValueOnce(new TypeError("Failed to fetch")).mockResolvedValueOnce({ ok: true });
    const p = trySave(fn, "test", [1000]);
    await vi.advanceTimersByTimeAsync(10);
    expect(getSaveStatus()).toBe("retrying");
    await vi.advanceTimersByTimeAsync(1000);
    await expect(p).resolves.toEqual({ ok: true });
    expect(fn).toHaveBeenCalledTimes(2);
    expect(getSaveStatus()).toBe("idle");
  });

  it("retries a server error answer but not a refusal", async () => {
    const server = vi.fn().mockResolvedValueOnce(new Response("", { status: 503 })).mockResolvedValueOnce(new Response("", { status: 200 }));
    const p = trySave(server, "test", [10]);
    await vi.advanceTimersByTimeAsync(20);
    expect((await p)?.status).toBe(200);
    const refused = vi.fn().mockResolvedValue(new Response("", { status: 400 }));
    expect((await trySave(refused, "test", [10]))?.status).toBe(400);
    expect(refused).toHaveBeenCalledTimes(1);
  });

  it("never throws, even when every try fails", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const p = trySave(() => Promise.reject(new Error("down")), "test", [5, 5]);
    await vi.advanceTimersByTimeAsync(20);
    await expect(p).resolves.toBeUndefined();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
