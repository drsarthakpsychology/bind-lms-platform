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
    })),
  };
  return { supabase, admin, upsertMock };
});

vi.mock("@/lib/supabase/server", () => ({
  createClient: () => supabase,
  createAdminClient: () => admin,
}));

vi.mock("@/lib/rate-limit", () => ({
  rateLimit: vi.fn().mockResolvedValue(true),
}));

import { POST } from "./route";

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
    expect(row.scored).toBe(0.75);
    expect(row.seconds_spent).toBe(42);
    expect(opts).toEqual({ onConflict: "item_id,user_id" });
  });
});
