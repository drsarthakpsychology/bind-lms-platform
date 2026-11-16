import { describe, expect, it, vi } from "vitest";

const session = vi.hoisted(() => ({ value: { status: "none" } as { status: string; profile?: { role: string } } }));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/auth/session", () => ({ getSession: async () => session.value }));

import { GET } from "./route";

async function go(s: typeof session.value) {
  session.value = s;
  const res = await GET(new Request("https://vibha.test/go/home") as never);
  return new URL(res.headers.get("location") ?? "").pathname;
}

describe("/go/home", () => {
  it("sends each person to their own home", async () => {
    expect(await go({ status: "none" })).toBe("/");
    expect(await go({ status: "ok", profile: { role: "student" } })).toBe("/dashboard");
    expect(await go({ status: "ok", profile: { role: "admin" } })).toBe("/admin");
    expect(await go({ status: "ok", profile: { role: "view_admin" } })).toBe("/admin");
  });
});
