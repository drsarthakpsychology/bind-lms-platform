import { beforeEach, describe, expect, it, vi } from "vitest";

const insert = vi.fn();
vi.mock("@/lib/supabase/server", () => ({
  createAdminClient: () => ({
    from: (table: string) => ({
      insert: (row: unknown) => {
        insert(table, row);
        return { abortSignal: () => Promise.resolve({ error: null }) };
      },
    }),
  }),
}));

import { POST } from "./route";

function req(body: unknown, headers: Record<string, string> = {}) {
  return new Request("https://vibhapsychology.com/api/funnel", {
    method: "POST",
    body: typeof body === "string" ? body : JSON.stringify(body),
    headers: { "content-type": "application/json", "x-forwarded-for": `10.0.0.${Math.floor(Math.random() * 250)}`, ...headers },
  });
}

describe("POST /api/funnel", () => {
  beforeEach(() => insert.mockReset());

  it("saves a clean step without anything personal", async () => {
    const res = await POST(req({ visit: "abc123def456", event: "cta", path: "/", detail: "home-hero", ref: null }));
    expect(res.status).toBe(204);
    expect(insert).toHaveBeenCalledWith("funnel_events", { visit: "abc123def456", event: "cta", path: "/", detail: "home-hero", ref_host: null });
  });

  it("saves nothing when the visitor asks not to be tracked", async () => {
    const res = await POST(req({ visit: "abc123def456", event: "view", path: "/" }, { dnt: "1" }));
    expect(res.status).toBe(204);
    expect(insert).not.toHaveBeenCalled();
  });

  it("saves nothing for junk, and still answers 204", async () => {
    expect((await POST(req("not json"))).status).toBe(204);
    expect((await POST(req({ visit: "abc123def456", event: "view", path: "/admin" }))).status).toBe(204);
    expect(insert).not.toHaveBeenCalled();
  });

  it("answers 204 even when the table is missing", async () => {
    insert.mockImplementationOnce(() => {
      throw new Error("relation funnel_events does not exist");
    });
    const res = await POST(req({ visit: "abc123def456", event: "view", path: "/" }));
    expect(res.status).toBe(204);
  });
});
