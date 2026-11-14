import { describe, expect, it, vi, beforeEach } from "vitest";

const { supabase, admin, upsertMock } = vi.hoisted(() => {
  const upsertMock = vi.fn().mockResolvedValue({ error: null });
  const supabase = {
    auth: { getUser: vi.fn() },
    from: vi.fn(() => ({ upsert: upsertMock })),
  };
  const admin = {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({ maybeSingle: vi.fn().mockResolvedValue({ data: { id: "item-uuid" } }) })),
        single: vi.fn().mockResolvedValue({ data: { id: "item-uuid" } }),
      })),
      insert: vi.fn(() => ({ select: vi.fn(() => ({ single: vi.fn().mockResolvedValue({ data: { id: "item-uuid" } }) })) })),
      upsert: upsertMock,
    })),
  };
  return { supabase, admin, upsertMock };
});

vi.mock("@/lib/supabase/server", () => ({
  createClient: () => supabase,
  createAdminClient: () => admin,
}));

vi.mock("@/lib/auth/api-guard", () => ({
  requireStudentApi: vi.fn(async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return { ok: false, response: Response.json({ error: "unauthorized" }, { status: 401 }) };
    return { ok: true, profile: { id: data.user.id, email: null, role: "student", scope: "full", status: "active", active_session_token: null, expires_at: null } };
  }),
}));

vi.mock("@/lib/rate-limit", () => ({
  rateLimit: vi.fn().mockResolvedValue(true),
}));

import { POST } from "./route";
import { scoreSctResponse, simulatedPanel } from "@/lib/practice/sct";

const VALID_BODY = {
  item_id: "sct-1",
  response: 1,
  scored: 0.75,
  seconds_spent: 42,
  vignette: "A vignette",
  hypothesis: "A hypothesis",
  new_information: "New information",
};

describe("POST /api/practice/sct/attempt", () => {
  beforeEach(() => {
    upsertMock.mockClear();
    supabase.auth.getUser.mockReset();
    supabase.auth.getUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
  });

  it("rejects unauthenticated requests", async () => {
    supabase.auth.getUser.mockResolvedValue({ data: { user: null } });
    const res = await POST(new Request("http://test/api/practice/sct/attempt", {
      method: "POST",
      body: JSON.stringify(VALID_BODY),
    }));
    expect(res.status).toBe(401);
  });

  it("rejects a response outside the -2..2 scale", async () => {
    const res = await POST(new Request("http://test/api/practice/sct/attempt", {
      method: "POST",
      body: JSON.stringify({ ...VALID_BODY, response: 5 }),
    }));
    expect(res.status).toBe(400);
  });

  it("upserts a judgment call by (item, user)", async () => {
    const res = await POST(new Request("http://test/api/practice/sct/attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(VALID_BODY),
    }));
    expect(res.status).toBe(200);
    expect(upsertMock).toHaveBeenCalledTimes(1);
    const [row, opts] = upsertMock.mock.calls[0];
    expect(row.user_id).toBe("user-1");
    expect(row.item_id).toBe("item-uuid");
    expect(row.response).toBe(1);
    // Scored on the server from the panel, never the browser's 0.75.
    expect(row.scored).toBe(scoreSctResponse(1, simulatedPanel("sct-1")));
    expect(row.scored).not.toBe(0.75);
    expect(row.seconds_spent).toBe(42);
    expect(opts).toEqual({ onConflict: "item_id,user_id" });
  });

  it("refuses an item that is not one of the arena's seed items (no student-made items)", async () => {
    const res = await POST(new Request("http://test/api/practice/sct/attempt", {
      method: "POST",
      body: JSON.stringify({ ...VALID_BODY, item_id: "sct-made-up", vignette: "Fake clinical advice" }),
    }));
    expect(res.status).toBe(404);
    expect(upsertMock).not.toHaveBeenCalled();
  });

  it("writes with the server client, not the student's own", async () => {
    await POST(new Request("http://test/api/practice/sct/attempt", { method: "POST", body: JSON.stringify(VALID_BODY) }));
    expect(supabase.from).not.toHaveBeenCalled();
  });
});
