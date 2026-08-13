import { describe, expect, it, vi, beforeEach } from "vitest";

const { supabase, admin, insertMock } = vi.hoisted(() => {
  const insertMock = vi.fn().mockResolvedValue({ error: null });
  const supabase = {
    auth: { getUser: vi.fn() },
    from: vi.fn(() => ({ insert: insertMock })),
  };
  const admin = {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({ maybeSingle: vi.fn().mockResolvedValue({ data: { id: "case-uuid" } }) })),
        single: vi.fn().mockResolvedValue({ data: { id: "case-uuid" } }),
      })),
      insert: vi.fn(() => ({ select: vi.fn(() => ({ single: vi.fn().mockResolvedValue({ data: { id: "case-uuid" } }) })) })),
    })),
  };
  return { supabase, admin, insertMock };
});

vi.mock("@/lib/supabase/server", () => ({
  createClient: () => supabase,
  createAdminClient: () => admin,
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
  case_id: "form-1",
  case_title: "Ravi",
  sorted_factors: [{ factorId: "f1", bucket: "presenting" }],
  narrative: "Ravi presents with somatic depression.",
  diff: { missing: ["predisposing"], present: ["somatic"] },
  score: 0.9,
  started_at: "2026-08-13T10:00:00.000Z",
  completed_at: "2026-08-13T10:05:00.000Z",
};

describe("POST /api/practice/formulation/attempt", () => {
  beforeEach(() => {
    insertMock.mockClear();
    supabase.auth.getUser.mockReset();
    supabase.auth.getUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
  });

  it("rejects unauthenticated requests", async () => {
    supabase.auth.getUser.mockResolvedValue({ data: { user: null } });
    const res = await POST(new Request("http://test/api/practice/formulation/attempt", {
      method: "POST",
      body: JSON.stringify(VALID_BODY),
    }));
    expect(res.status).toBe(401);
  });

  it("persists a scaffolded pass with the resolved case id", async () => {
    const res = await POST(new Request("http://test/api/practice/formulation/attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(VALID_BODY),
    }));
    expect(res.status).toBe(200);
    expect(insertMock).toHaveBeenCalledTimes(1);
    const row = insertMock.mock.calls[0][0];
    expect(row.user_id).toBe("user-1");
    expect(row.case_id).toBe("case-uuid");
    expect(row.sorted_factors).toEqual(VALID_BODY.sorted_factors);
    expect(row.narrative).toBe(VALID_BODY.narrative);
    expect(row.score).toBe(0.9);
    expect(row.status).toBe("complete");
  });

  it("persists an own-transcript attempt with case_id null + source session", async () => {
    const body = {
      case_id: null,
      source_sim_session_id: "11111111-2222-3333-8888-555555555555",
      sorted_factors: [],
      narrative: "From my own session.",
      diff: { missing: [], present: ["somatic"] },
      started_at: "2026-08-13T10:00:00.000Z",
      completed_at: "2026-08-13T10:05:00.000Z",
    };
    const res = await POST(new Request("http://test/api/practice/formulation/attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }));
    expect(res.status).toBe(200);
    const row = insertMock.mock.calls[0][0];
    expect(row.case_id).toBeNull();
    expect(row.source_sim_session_id).toBe("11111111-2222-3333-8888-555555555555");
  });
});
