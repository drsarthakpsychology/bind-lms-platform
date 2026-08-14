import { describe, expect, it, vi, beforeEach } from "vitest";

const supabase = {
  auth: { getUser: vi.fn() },
};

const adminClient = {
  from: vi.fn(),
};

vi.mock("@/lib/supabase/server", () => ({
  createClient: () => supabase,
  createAdminClient: () => adminClient,
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

import { GET } from "./route";

function stubSelect(rows: unknown[]) {
  adminClient.from.mockImplementation(() => {
    const result = { data: rows, error: null };
    const thenable = {
      select: () => thenable,
      order: () => thenable,
      limit: () => thenable,
      eq: () => thenable,
      ilike: () => thenable,
      then: (resolve: (v: typeof result) => unknown) => Promise.resolve(resolve(result)),
    };
    return thenable;
  });
}

describe("GET /api/knowledge/concepts", () => {
  beforeEach(() => {
    adminClient.from.mockReset();
    supabase.auth.getUser.mockReset();
    supabase.auth.getUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
  });

  it("rejects unauthenticated requests", async () => {
    supabase.auth.getUser.mockResolvedValue({ data: { user: null } });
    const res = await GET(new Request("http://test/api/knowledge/concepts"));
    expect(res.status).toBe(401);
  });

  it("returns concepts with chunk counts", async () => {
    stubSelect([
      { id: "c1", name: "Clozapine", concept_type: "drug", aliases: ["Clozaril"], corpus_chunk_links: { count: 882 } },
      { id: "c2", name: "Schizophrenia", concept_type: "disorder", aliases: [], corpus_chunk_links: { count: 2613 } },
    ]);
    const res = await GET(new Request("http://test/api/knowledge/concepts?type=drug&limit=10"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.count).toBe(2);
    expect(body.concepts[0].name).toBe("Clozapine");
    expect(body.concepts[0].chunkCount).toBe(882);
  });

  it("returns empty concepts for no matches", async () => {
    stubSelect([]);
    const res = await GET(new Request("http://test/api/knowledge/concepts?q=zzzz"));
    const body = await res.json();
    expect(body.count).toBe(0);
  });
});
