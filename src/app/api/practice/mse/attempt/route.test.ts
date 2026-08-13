import { describe, expect, it, vi, beforeEach } from "vitest";

// Mock the server auth/rate-limit modules before importing the route.
const { supabase, admin, insertMock } = vi.hoisted(() => {
  const insertMock = vi.fn().mockResolvedValue({ error: null });
  const supabase = {
    auth: { getUser: vi.fn() },
    from: vi.fn(() => ({ insert: insertMock })),
  };
  const admin = {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({ maybeSingle: vi.fn().mockResolvedValue({ data: { id: "stim-uuid" } }) })),
        or: vi.fn(() => ({ maybeSingle: vi.fn().mockResolvedValue({ data: { id: "stim-uuid" } }) })),
      })),
    })),
  };
  return { supabase, admin, insertMock };
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
  stimulus_id: "mse-1",
  level: "2",
  domain: "perception",
  started_at: "2026-08-13T10:00:00.000Z",
  completed_at: "2026-08-13T10:05:00.000Z",
  score: 1,
  picked: ["hallucinations"],
  expert: ["hallucinations"],
  amber: ["auditory hallucination"],
};

describe("POST /api/practice/mse/attempt", () => {
  beforeEach(() => {
    insertMock.mockClear();
    supabase.auth.getUser.mockReset();
    supabase.auth.getUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
  });

  it("rejects unauthenticated requests", async () => {
    supabase.auth.getUser.mockResolvedValue({ data: { user: null } });
    const res = await POST(new Request("http://test/api/practice/mse/attempt", {
      method: "POST",
      body: JSON.stringify(VALID_BODY),
    }));
    expect(res.status).toBe(401);
  });

  it("rejects an invalid body", async () => {
    const res = await POST(new Request("http://test/api/practice/mse/attempt", {
      method: "POST",
      body: JSON.stringify({ ...VALID_BODY, level: "9" }),
    }));
    expect(res.status).toBe(400);
  });

  it("resolves the seed slug and persists the full attempt", async () => {
    const res = await POST(new Request("http://test/api/practice/mse/attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(VALID_BODY),
    }));
    expect(res.status).toBe(200);
    expect(insertMock).toHaveBeenCalledTimes(1);
    const row = insertMock.mock.calls[0][0];
    expect(row.user_id).toBe("user-1");
    expect(row.stimulus_id).toBe("stim-uuid");
    expect(row.level).toBe("2");
    expect(row.domain).toBe("perception");
    expect(row.started_at).toBe(VALID_BODY.started_at);
    expect(row.completed_at).toBe(VALID_BODY.completed_at);
    expect(row.score).toBe(1);
    expect(row.tags).toMatchObject({ picked: ["hallucinations"], expert: ["hallucinations"], amber: ["auditory hallucination"] });
  });

  it("treats a Level 5 session attempt as stimulus-free", async () => {
    const body = {
      stimulus_id: null,
      level: "5",
      started_at: "2026-08-13T10:00:00.000Z",
      completed_at: "2026-08-13T10:05:00.000Z",
      score: 0.5,
      source_session_id: "11111111-2222-3333-8888-555555555555",
    };
    const res = await POST(new Request("http://test/api/practice/mse/attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }));
    expect(res.status).toBe(200);
    expect(insertMock).toHaveBeenCalledTimes(1);
    const row = insertMock.mock.calls[0][0];
    expect(row.stimulus_id).toBeNull();
    expect(row.source_session_id).toBe("11111111-2222-3333-8888-555555555555");
  });

  it("still returns ok when the stimulus FK is missing (a check, not a test)", async () => {
    insertMock.mockResolvedValueOnce({ error: { code: "23503", message: "fk" } });
    const res = await POST(new Request("http://test/api/practice/mse/attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(VALID_BODY),
    }));
    expect(res.status).toBe(200);
    expect((await res.json()).ok).toBe(true);
  });
});
