import { describe, expect, it, vi, beforeEach } from "vitest";

const supabase = {
  auth: { getUser: vi.fn() },
};

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

const searchMock = vi.fn();
vi.mock("@/lib/knowledge/retrieve", () => ({
  searchKnowledge: (...args: unknown[]) => searchMock(...args),
  cite: (h: { sourceTitle?: string; chapter?: string; section?: string; pageStart?: number; pageEnd?: number }) =>
    [h.sourceTitle, h.chapter, h.section, h.pageStart ? `p. ${h.pageStart}` : undefined].filter(Boolean).join(", "),
}));

import { GET } from "./route";

function makeHit(over: Record<string, unknown> = {}) {
  return {
    id: "chunk-1",
    text: "Major depressive disorder involves persistent low mood.",
    chapter: "Chapter 6: Mood Disorders",
    section: "Depression",
    pageStart: 3,
    pageEnd: 4,
    sourceId: "src-1",
    sourceName: "ahuja_psychiatry",
    sourceTitle: "A Short Textbook of Psychiatry",
    score: 0.82,
    lane: "vector",
    ...over,
  };
}

describe("GET /api/knowledge/search", () => {
  beforeEach(() => {
    searchMock.mockReset();
    supabase.auth.getUser.mockReset();
    supabase.auth.getUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
  });

  it("rejects unauthenticated requests", async () => {
    supabase.auth.getUser.mockResolvedValue({ data: { user: null } });
    const res = await GET(new Request("http://test/api/knowledge/search?q=depression"));
    expect(res.status).toBe(401);
  });

  it("rejects a blank / too-short query", async () => {
    const res = await GET(new Request("http://test/api/knowledge/search?q=a"));
    expect(res.status).toBe(400);
  });

  it("returns hits with source traceability", async () => {
    searchMock.mockResolvedValue([makeHit()]);
    const res = await GET(new Request("http://test/api/knowledge/search?q=what%20is%20major%20depressive%20disorder"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.count).toBe(1);
    expect(body.hits[0].sourceTitle).toBe("A Short Textbook of Psychiatry");
    expect(body.hits[0].citation).toContain("Chapter 6: Mood Disorders");
    expect(body.hits[0].citation).toContain("p. 3");
  });

  it("passes keywordOnly + source + concept filters through", async () => {
    searchMock.mockResolvedValue([]);
    const res = await GET(
      new Request("http://test/api/knowledge/search?q=clozapine&source=maudsley_2021&concept=Clozapine&keywordOnly=true"),
    );
    expect(res.status).toBe(200);
    expect(searchMock).toHaveBeenCalledWith("clozapine", {
      limit: 8,
      filterSource: "maudsley_2021",
      filterConcept: "Clozapine",
      keywordOnly: true,
    });
  });

  it("returns empty hits when nothing matches", async () => {
    searchMock.mockResolvedValue([]);
    const res = await GET(new Request("http://test/api/knowledge/search?q=zzzzqqq"));
    const body = await res.json();
    expect(body.count).toBe(0);
    expect(body.hits).toEqual([]);
  });
});
