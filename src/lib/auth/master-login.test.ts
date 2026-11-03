import { beforeEach, describe, expect, it, vi } from "vitest";

const calls = vi.hoisted(() => ({ ilike: [] as string[], keys: [] as string[], allow: true, rows: [] as Record<string, unknown>[], checked: 0 }));

vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ cookies: async () => ({ set: () => {} }) }));
vi.mock("@/lib/auth/session", () => ({ SESSION_COOKIE: "s" }));
vi.mock("@/lib/rate-limit-fast", () => ({ rateLimitFast: () => true }));
vi.mock("@/lib/rate-limit", () => ({
  rateLimit: async (key: string) => {
    calls.keys.push(key);
    return calls.allow;
  },
}));
vi.mock("./master", () => ({ loadMaster: async () => ({ setting: {}, ready: true }) }));
vi.mock("./master-hash", () => ({
  checkMaster: () => {
    calls.checked++;
    return true;
  },
}));
vi.mock("@/lib/supabase/server", () => {
  const profiles = {
    select: () => profiles,
    ilike: (_c: string, v: string) => {
      calls.ilike.push(v);
      return profiles;
    },
    limit: async () => ({ data: calls.rows }),
  };
  return {
    createAdminClient: () => ({
      from: () => profiles,
      auth: { admin: { generateLink: async () => ({ data: null, error: new Error("stop here") }) } },
    }),
    createClient: async () => ({}),
  };
});

import { escapeLike, tryMasterLogin } from "./master-login";

beforeEach(() => {
  calls.ilike = [];
  calls.keys = [];
  calls.allow = true;
  calls.rows = [];
  calls.checked = 0;
});

describe("master login hardening", () => {
  it("escapes LIKE wildcards", () => {
    expect(escapeLike("a_b%c\\d")).toBe("a\\_b\\%c\\\\d");
  });

  it("refuses wildcard-bearing emails before touching the database", async () => {
    expect(await tryMasterLogin("%@x.com", "pw", "1.2.3.4")).toBe(false);
    expect(await tryMasterLogin("*", "pw", "1.2.3.4")).toBe(false);
    expect(calls.keys).toEqual([]);
  });

  it("uses durable per-email, per-IP and global limits before checking the password", async () => {
    calls.allow = false;
    expect(await tryMasterLogin("A_B@x.com", "pw", "1.2.3.4")).toBe(false);
    expect(calls.keys.sort()).toEqual(["master:all", "master:email:a_b@x.com", "master:ip:1.2.3.4"]);
    expect(calls.checked).toBe(0);
  });

  it("matches the email literally and exactly", async () => {
    calls.rows = [{ id: "u2", email: "aXb@x.com", role: "student" }];
    expect(await tryMasterLogin("a_b@x.com", "pw", "1.2.3.4")).toBe(false);
    expect(calls.ilike).toEqual(["a\\_b@x.com"]);
  });
});
