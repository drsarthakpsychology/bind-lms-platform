import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/server", () => ({ createAdminClient: () => ({}) }));
const dropped: string[][] = [];
vi.mock("./devices", () => ({
  dropPushTokens: async (t: string[]) => void dropped.push(t),
  tableMissing: (e: { code?: string } | null) => e?.code === "PGRST205",
}));

import { makeTestDb, type TestDb } from "./test-db";
import { checkReceipts, keepTickets, readReceipts, WAIT_MS } from "./push-receipts";

const NOW = Date.parse("2026-11-22T10:00:00Z");
const old = new Date(NOW - WAIT_MS - 60_000).toISOString();
const fresh = new Date(NOW - 60_000).toISOString();
let db: TestDb;

beforeEach(() => {
  dropped.length = 0;
  db = makeTestDb({
    app_push_tickets: [
      { ticket_id: "t-ok", token: "ExponentPushToken[a]", user_id: "u1", created_at: old },
      { ticket_id: "t-dead", token: "ExponentPushToken[b]", user_id: "u2", created_at: old },
      { ticket_id: "t-later", token: "ExponentPushToken[c]", user_id: "u3", created_at: old },
      { ticket_id: "t-new", token: "ExponentPushToken[d]", user_id: "u4", created_at: fresh },
    ],
  });
});

const fetchWith = (data: Record<string, unknown>) => vi.fn(async () => ({ ok: true, json: async () => ({ data }) })) as unknown as typeof fetch;

describe("push receipts", () => {
  it("reads what each receipt says", () => {
    const r = readReceipts(
      [
        { ticketId: "a", token: "x", userId: "u" },
        { ticketId: "b", token: "y", userId: "u" },
        { ticketId: "c", token: "z", userId: "u" },
      ],
      { a: { status: "ok" }, b: { status: "error", details: { error: "DeviceNotRegistered" } } },
    );
    expect(r).toEqual({ done: ["a", "b"], deadTokens: ["y"], delivered: 1, failed: 1, errors: { DeviceNotRegistered: 1 } });
  });

  it("checks only tickets older than 15 minutes, clears dead phones, keeps unanswered ones", async () => {
    const f = fetchWith({ "t-ok": { status: "ok" }, "t-dead": { status: "error", details: { error: "DeviceNotRegistered" } } });
    const r = await checkReceipts({ db: db as never, fetchImpl: f, now: NOW });
    expect(r).toMatchObject({ ready: true, checked: 2, delivered: 1, dead: 1 });
    expect(dropped).toEqual([["ExponentPushToken[b]"]]);
    const body = JSON.parse(((f as unknown as { mock: { calls: [string, { body: string }][] } }).mock.calls[0]![1]).body);
    expect(body.ids.sort()).toEqual(["t-dead", "t-later", "t-ok"]);
    expect((db.tables.app_push_tickets as { ticket_id: string }[]).map((t) => t.ticket_id).sort()).toEqual(["t-later", "t-new"]);
  });

  it("before the database step it does nothing and never throws", async () => {
    db.missing.add("app_push_tickets");
    await expect(checkReceipts({ db: db as never, fetchImpl: fetchWith({}), now: NOW })).resolves.toMatchObject({ ready: false, checked: 0 });
    await expect(keepTickets([{ ticketId: "t", token: "x", userId: "u" }], db as never, NOW)).resolves.toBeUndefined();
  });

  it("keeps the tickets of a send", async () => {
    await keepTickets([{ ticketId: "t9", token: "ExponentPushToken[z]", userId: "u9" }], db as never, NOW);
    expect(db.tables.app_push_tickets).toContainEqual(expect.objectContaining({ ticket_id: "t9", user_id: "u9" }));
  });
});
