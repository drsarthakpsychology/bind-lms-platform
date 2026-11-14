// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";

const refresh = vi.fn();
vi.mock("next/navigation", async (orig) => ({ ...(await orig<typeof import("next/navigation")>()), useRouter: () => ({ refresh }) }));

import { RefreshOnSave } from "./refresh-on-save";
import { __saveForTests, flushSaves, queueSave, setSaveOwner } from "@/lib/save/client";
import { createOutbox } from "@/lib/save/outbox";

let answerData: Record<string, unknown> | undefined;
beforeEach(() => {
  vi.useFakeTimers();
  refresh.mockClear();
  answerData = undefined;
  const m = new Map<string, string>();
  __saveForTests.reset({
    outbox: createOutbox({ storage: () => ({ getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) }) }),
    transport: async (body) => {
      const b = JSON.parse(body) as { items: { id: string }[] };
      return new Response(JSON.stringify({ results: b.items.map((i) => ({ id: i.id, status: "ok", data: answerData })) }), { status: 200 });
    },
  });
  setSaveOwner("me");
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("RefreshOnSave", () => {
  it("refreshes the page when a mark it shows has landed", async () => {
    render(<RefreshOnSave kinds={["learn", "complete"]} />);
    queueSave("learn", "k", { state: {} });
    await flushSaves();
    await vi.advanceTimersByTimeAsync(300);
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it("ignores lecture position saves unless they complete the lecture", async () => {
    render(<RefreshOnSave kinds={["progress"]} />);
    queueSave("progress", "L1", { lessonId: "L1", watched: 10, duration: 100 });
    await flushSaves();
    await vi.advanceTimersByTimeAsync(300);
    expect(refresh).not.toHaveBeenCalled();
    answerData = { completed: true };
    queueSave("progress", "L1", { lessonId: "L1", watched: 95, duration: 100 });
    await flushSaves();
    await vi.advanceTimersByTimeAsync(300);
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it("does not refresh for saves it does not show", async () => {
    render(<RefreshOnSave kinds={["complete"]} />);
    queueSave("history", "t", { tool: "t", answers: [] });
    await flushSaves();
    await vi.advanceTimersByTimeAsync(300);
    expect(refresh).not.toHaveBeenCalled();
  });
});
