import { describe, expect, it, vi, beforeEach } from "vitest";

const { supabase, upsertMock } = vi.hoisted(() => {
  const upsertMock = vi.fn().mockResolvedValue({ error: null });
  const supabase = {
    auth: { getUser: vi.fn() },
    from: vi.fn(() => ({ upsert: upsertMock })),
  };
  return { supabase, upsertMock };
});

vi.mock("@/lib/supabase/server", () => ({
  createClient: () => supabase,
}));

vi.mock("@/lib/auth/guards", () => ({
  requireSession: vi.fn(async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return null;
    return { id: data.user.id, email: null, role: "student", active_session_token: null, expires_at: null };
  }),
}));

vi.mock("@/lib/rate-limit", () => ({
  rateLimit: vi.fn().mockResolvedValue(true),
}));

import { POST } from "./route";

const VALID_BODY = {
  card_id: "11111111-2222-3333-8888-555555555555",
  rating: 3,
  current: { stability: 2.1, difficulty: 5.0, due_at: "2026-08-13T10:00:00.000Z" },
};

describe("POST /api/practice/rounds/review", () => {
  beforeEach(() => {
    upsertMock.mockClear();
    supabase.auth.getUser.mockReset();
    supabase.auth.getUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
  });

  it("rejects unauthenticated requests", async () => {
    supabase.auth.getUser.mockResolvedValue({ data: { user: null } });
    const res = await POST(new Request("http://test/api/practice/rounds/review", {
      method: "POST",
      body: JSON.stringify(VALID_BODY),
    }));
    expect(res.status).toBe(401);
  });

  it("rejects an out-of-range rating", async () => {
    const res = await POST(new Request("http://test/api/practice/rounds/review", {
      method: "POST",
      body: JSON.stringify({ ...VALID_BODY, rating: 7 }),
    }));
    expect(res.status).toBe(400);
  });

  it("upserts the review by (card, user) with a server-computed next state", async () => {
    const res = await POST(new Request("http://test/api/practice/rounds/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(VALID_BODY),
    }));
    expect(res.status).toBe(200);
    expect(upsertMock).toHaveBeenCalledTimes(1);
    const [row, opts] = upsertMock.mock.calls[0];
    expect(row.card_id).toBe(VALID_BODY.card_id);
    expect(row.user_id).toBe("user-1");
    expect(row.rating).toBe(3);
    expect(String(row.due_at) > VALID_BODY.current.due_at).toBe(true); // Good pushes it out
    expect(row.stability).toBeGreaterThan(0);
    expect(opts).toEqual({ onConflict: "card_id,user_id" });
  });
});
