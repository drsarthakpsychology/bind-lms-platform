/**
 * Test-only: the shared stand-ins every app route test needs for the bearer
 * guard (token check, profile row, phone row, flags, blocks, rate limits).
 * vi.mock calls stay in each test file and point here:
 *
 *   vi.mock("@/lib/supabase/server", async () => (await import("@/lib/app-api/test-guard")).supabaseMock());
 *
 * `G` is the shared state; call resetGuard() in beforeEach.
 */
import { ADMIN_ID, ADMIN_TOKEN, STUDENT_ID, STUDENT_TOKEN, seedDb } from "./test-kit";
import type { TestDb } from "./test-db";

export const G = {
  db: null as unknown as TestDb,
  users: {} as Record<string, { id: string; email: string }>,
  flags: {} as Record<string, string>,
  blocks: [] as string[],
  limited: new Set<string>(),
  /** Supabase Auth cannot be reached (its fetch fails). */
  authDown: false,
  /** Every rate-limit key asked for. */
  limits: [] as string[],
  storage: {
    signedUrl: "https://storage.example/signed",
  },
};

export function resetGuard(over: Record<string, Record<string, unknown>[]> = {}, missing: string[] = []) {
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test";
  G.db = seedDb(over, missing);
  G.users = { [STUDENT_TOKEN]: { id: STUDENT_ID, email: "asha@example.com" }, [ADMIN_TOKEN]: { id: ADMIN_ID, email: "owner@example.com" } };
  G.flags = { learn: "unlocked" };
  G.blocks = [];
  G.authDown = false;
  G.limited.clear();
  G.limits = [];
}

const client = () => ({
  from: (t: string) => G.db.from(t),
  storage: { from: () => ({ createSignedUrl: async () => ({ data: { signedUrl: G.storage.signedUrl }, error: null }) }) },
  auth: { admin: { signOut: async () => ({ error: null }) } },
});

export function supabaseMock() {
  return { createAdminClient: client, createClient: async () => client() };
}

export function statelessMock() {
  return {
    createStatelessAuthClient: () => ({
      auth: {
        getUser: async (t: string) => (G.authDown ? { data: { user: null }, error: { name: "AuthRetryableFetchError", status: 0, message: "fetch failed" } } : G.users[t] ? { data: { user: G.users[t] }, error: null } : { data: { user: null }, error: { message: "invalid JWT" } }),
      },
    }),
  };
}

export const flagsMock = () => ({ readFlags: async () => G.flags });
export const blocksMock = () => ({ loadMyBlocks: async () => G.blocks });
export const rateMock = () => ({
  rateLimitResult: async (key: string) => (G.limits.push(key), G.limited.has(key) ? "limited" : "allowed"),
  rateLimitWrite: async (key: string) => (G.limits.push(key), !G.limited.has(key)),
  rateLimit: async (key: string) => (G.limits.push(key), !G.limited.has(key)),
});
export const fastRateMock = () => ({ rateLimitFast: (key: string) => (G.limits.push(key), !G.limited.has(key)) });
