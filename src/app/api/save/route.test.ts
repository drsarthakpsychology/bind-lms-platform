import { beforeEach, describe, expect, it, vi } from "vitest";

const h = vi.hoisted(() => ({
  session: { status: "ok", profile: { id: "user-1", role: "student" } } as { status: string; profile?: { id: string; role: string } },
  ping: vi.fn(async () => ({ ok: true })),
  complete: vi.fn(async () => ({ ok: true })),
  learn: vi.fn(async () => ({ ok: true, clamped: false })),
  history: vi.fn(async () => ({ ok: true })),
  events: vi.fn(async () => "ok" as const),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/auth/session", () => ({ getSession: async () => h.session }));
vi.mock("@/app/(dashboard)/courses/[courseId]/lessons/[lessonId]/actions", () => ({ pingProgress: h.ping, markLessonComplete: h.complete }));
vi.mock("@/app/(dashboard)/study/actions", () => ({ saveLearnState: h.learn }));
vi.mock("@/lib/history/actions", () => ({ recordMyAnswers: h.history }));
vi.mock("@/lib/learn/events-store", async () => {
  const { z } = await import("zod");
  return { learnEventsSchema: z.object({ events: z.array(z.unknown()).max(50), path: z.string() }), storeLearnEvents: h.events };
});

import { POST } from "./route";
import { ownerTag } from "@/lib/save/owner";

const L = "11111111-2222-4333-8444-555555555555";
const req = (body: unknown) => new Request("http://x/api/save", { method: "POST", body: JSON.stringify(body) });
const me = () => ownerTag("user-1");

beforeEach(() => {
  h.session = { status: "ok", profile: { id: "user-1", role: "student" } };
  for (const f of [h.ping, h.complete, h.learn, h.history, h.events]) f.mockClear();
});

describe("POST /api/save", () => {
  it("stores each save and answers per save", async () => {
    const res = await POST(
      req({
        owner: me(),
        items: [
          { id: "a", kind: "progress", payload: { lessonId: L, watched: 30, duration: 600 } },
          { id: "b", kind: "complete", payload: { lessonId: L } },
          { id: "c", kind: "history", payload: { tool: "osce", answers: [{ item: "s1", correct: true }] } },
        ],
      }),
    );
    expect(res.status).toBe(200);
    const j = await res.json();
    expect(j.results.map((r: { status: string }) => r.status)).toEqual(["ok", "ok", "ok"]);
    expect(h.ping).toHaveBeenCalledWith(L, 30, 600);
    expect(h.complete).toHaveBeenCalledWith(L);
  });

  it("asks the browser to keep a save the database did not take", async () => {
    h.ping.mockResolvedValueOnce({ ok: false, retry: true } as never);
    h.learn.mockResolvedValueOnce({ ok: false, retry: false } as never);
    const j = await (
      await POST(
        req({
          owner: me(),
          items: [
            { id: "a", kind: "progress", payload: { lessonId: L, watched: 1, duration: 9 } },
            { id: "b", kind: "learn", payload: { state: { xp: 1 } } },
          ],
        }),
      )
    ).json();
    expect(j.results).toEqual([
      { id: "a", status: "retry" },
      { id: "b", status: "drop" },
    ]);
  });

  it("passes a clamped learn save back to the browser", async () => {
    h.learn.mockResolvedValueOnce({ ok: true, clamped: true });
    const j = await (await POST(req({ owner: me(), items: [{ id: "a", kind: "learn", payload: { state: {} } }] }))).json();
    expect(j.results[0]).toEqual({ id: "a", status: "ok", data: { clamped: true } });
  });

  it("drops saves it can't read, and unknown history tools", async () => {
    const j = await (
      await POST(
        req({
          owner: me(),
          items: [
            { id: "a", kind: "progress", payload: { lessonId: "not-a-uuid", watched: 1, duration: 9 } },
            { id: "b", kind: "history", payload: { tool: "no-such-tool", answers: [{ item: "x", correct: true }] } },
          ],
        }),
      )
    ).json();
    expect(j.results.map((r: { status: string }) => r.status)).toEqual(["drop", "drop"]);
    expect(h.ping).not.toHaveBeenCalled();
    expect(h.history).not.toHaveBeenCalled();
  });

  it("answers 401 when signed out, so the browser keeps everything", async () => {
    h.session = { status: "session_replaced" };
    expect((await POST(req({ owner: me(), items: [] }))).status).toBe(401);
  });

  it("answers 403 for a paused account", async () => {
    h.session = { status: "blocked", profile: { id: "user-1", role: "student" } };
    expect((await POST(req({ owner: me(), items: [] }))).status).toBe(403);
  });

  it("refuses saves made by another account on this browser", async () => {
    const res = await POST(req({ owner: ownerTag("someone-else"), items: [{ id: "a", kind: "complete", payload: { lessonId: L } }] }));
    expect(res.status).toBe(409);
    expect(h.complete).not.toHaveBeenCalled();
  });

  it("answers 400 for a body it can't read", async () => {
    expect((await POST(new Request("http://x/api/save", { method: "POST", body: "{nope" }))).status).toBe(400);
  });

  it("a staff preview's learning events are accepted but not stored", async () => {
    h.session = { status: "ok", profile: { id: "user-1", role: "admin" } };
    const j = await (await POST(req({ owner: me(), items: [{ id: "a", kind: "events", payload: { path: "/study", events: [] } }] }))).json();
    expect(j.results[0].status).toBe("ok");
    expect(h.events).not.toHaveBeenCalled();
  });
});
