/**
 * How fast the practice screens' reads are: the question bank (Exam Prep),
 * its sets, Smart practice, mock papers, Practise tools, study checkpoints
 * and the other heavy tabs. Same stand-in Supabase server as perf.test.ts
 * (every request answers after DELAY ms).
 *
 * For each route: "load" is the time to load the route's code on a fresh
 * server instance (the cold start a student waits for), "first" the first
 * request after that, "warm" the next one. Bytes are the JSON sent (before
 * gzip). Set PERF_OUT=<file> to write the table there.
 */
import { writeFileSync } from "node:fs";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({
  headers: async () => new Headers(),
  cookies: async () => ({ getAll: () => [], get: () => undefined, set: () => undefined }),
}));
vi.mock("next/cache", () => ({ unstable_cache: (fn: unknown) => fn, revalidatePath: () => undefined, revalidateTag: () => undefined, updateTag: () => undefined }));

import { installFakeSupabase, type Harness } from "@/lib/app-api/perf-harness";
import { ADMIN_ID, DEVICE, STUDENT_ID, profileRow, token } from "@/lib/app-api/test-kit";

const URL_ = "http://sb.perf.test";
const DELAY = 15;
const STUDENT = token("perf-student", false, STUDENT_ID);
const ADMIN = token("perf-admin", false, ADMIN_ID);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Mod = { GET: (req: Request, ctx: any) => Promise<Response> };
type Case = { name: string; path: string; mod: () => Promise<Mod>; params?: Record<string, string>; admin?: boolean; /** Most JSON bytes allowed (before gzip). */ maxBytes?: number; /** Most round trips one after another (warm). */ maxDepth?: number };

const CASES: Case[] = [
  { name: "prep", path: "/prep", mod: () => import("./prep/route"), maxDepth: 2, maxBytes: 8_000 },
  { name: "prep/subjects/statistics", path: "/prep/subjects/statistics", mod: () => import("./prep/subjects/[subject]/route"), params: { subject: "statistics" }, maxDepth: 2, maxBytes: 8_000 },
  { name: "prep/subjects/statistics/topics/t-test", path: "/prep/subjects/statistics/topics/t-test", mod: () => import("./prep/subjects/[subject]/topics/[topic]/route"), params: { subject: "statistics", topic: "t-test" }, maxDepth: 2, maxBytes: 40_000 },
  { name: "prep/smart", path: "/prep/smart", mod: () => import("./prep/smart/route"), maxDepth: 2, maxBytes: 60_000 },
  { name: "prep/lists/wrong", path: "/prep/lists/wrong", mod: () => import("./prep/lists/[list]/route"), params: { list: "wrong" }, maxDepth: 3 },
  { name: "prep/mock", path: "/prep/mock", mod: () => import("./prep/mock/route"), maxDepth: 2, maxBytes: 30_000 },
  { name: "practise", path: "/practise", mod: () => import("./practise/route"), maxDepth: 2 },
  { name: "practise/tools/wwyd", path: "/practise/tools/wwyd", mod: () => import("./practise/tools/[tool]/route"), params: { tool: "wwyd" }, maxDepth: 3 },
  { name: "practise/tools/blitz", path: "/practise/tools/blitz", mod: () => import("./practise/tools/[tool]/route"), params: { tool: "blitz" }, maxDepth: 4 },
  { name: "study/modules", path: "/study/modules", mod: () => import("./study/modules/route"), maxDepth: 2 },
  { name: "study/map/practice", path: "/study/map/practice", mod: () => import("./study/map/practice/route"), maxDepth: 3 },
  { name: "study/modules/:id/checkpoints/1", path: "/study/modules/m/checkpoints/1", mod: () => import("./study/modules/[moduleId]/checkpoints/[n]/route"), params: { moduleId: "", n: "1" }, maxDepth: 3, maxBytes: 40_000 },
  { name: "library/medicines", path: "/library/medicines", mod: () => import("./library/medicines/route"), maxDepth: 2 },
  { name: "study/notes", path: "/study/notes", mod: () => import("./study/notes/route"), maxDepth: 3 },
  { name: "study/map", path: "/study/map", mod: () => import("./study/map/route"), maxDepth: 3 },
  { name: "home", path: "/home", mod: () => import("./home/route"), maxDepth: 4 },
  { name: "admin/home", path: "/admin/home", mod: () => import("./admin/home/route"), admin: true, maxDepth: 3 },
  { name: "admin/people", path: "/admin/people", mod: () => import("./admin/people/route"), admin: true, maxDepth: 3 },
];

let h: Harness;
type Row = { name: string; status: number; loadMs: number; firstMs: number; warmMs: number; q: number; d: number; bytes: number; etag304: boolean };
const results: Row[] = [];

beforeAll(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = URL_;
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "service";
  const device = (user_id: string, id: string) => ({ id, user_id, device_id: DEVICE, name: "Pixel", platform: "android", push_token: null, active: true, activated_at: "2026-11-01T00:00:00.000Z", last_seen_at: new Date().toISOString() });
  h = installFakeSupabase({
    url: URL_,
    delayMs: DELAY,
    user: { id: STUDENT_ID, email: "asha@example.com" },
    rows: {
      profiles: [profileRow(), profileRow({ id: ADMIN_ID, email: "owner@example.com", name: "Owner", role: "admin", roll_number: null })],
      app_devices: [device(STUDENT_ID, "d1"), device(ADMIN_ID, "d2")],
      feature_flags: ["learn", "osce", "ethics", "mse", "formulation"].map((key) => ({ key, status: "unlocked" })),
    },
  });
});

afterAll(() => {
  h.restore();
  if (process.env.PERF_OUT) {
    const line = (r: Row) => `| ${r.name} | ${r.status} | ${r.loadMs} | ${r.firstMs} | ${r.warmMs} | ${r.q} | ${r.d} | ${r.bytes} | ${r.etag304 ? "yes" : "no"} |`;
    writeFileSync(process.env.PERF_OUT, ["| route | status | code load ms | first ms | warm ms | queries | serial | bytes | 304 on repeat |", "|---|---|---|---|---|---|---|---|---|", ...results.map(line)].join("\n") + "\n");
  }
});

const headers = (admin: boolean, extra: Record<string, string> = {}) => ({ authorization: `Bearer ${admin ? ADMIN : STUDENT}`, "x-app-device-id": DEVICE, "x-app-platform": "android", ...extra });

async function call(mod: Mod, c: Case, extra: Record<string, string> = {}) {
  const req = new Request(`http://test.local/api/app/v1${c.path}`, { headers: headers(Boolean(c.admin), extra) });
  h.reset();
  const t = performance.now();
  const res = await mod.GET(req, { params: Promise.resolve(c.params ?? {}) });
  const body = await res.text();
  return { ms: Math.round(performance.now() - t), status: res.status, body, etag: res.headers.get("etag"), q: h.hits.length, d: h.serialDepth() };
}

describe("practice screens: server time and size", () => {
  for (const c of CASES) {
    it(c.name, async () => {
      if (c.params && c.params.moduleId === "") {
        // The first module that has a checkpoint.
        const { MODULES } = await import("@/lib/study");
        const { checkpoints } = await import("@/lib/study/checkpoints");
        c.params.moduleId = MODULES.find((m) => checkpoints(m).length)?.id ?? "none";
      }
      h.setUser(c.admin ? { id: ADMIN_ID, email: "owner@example.com" } : { id: STUDENT_ID, email: "asha@example.com" });
      vi.resetModules();
      const t = performance.now();
      const mod = await c.mod();
      const loadMs = Math.round(performance.now() - t);
      const first = await call(mod, c);
      const warm = await call(mod, c);
      const again = warm.etag ? await call(mod, c, { "if-none-match": warm.etag }) : null;
      results.push({ name: c.name, status: warm.status, loadMs, firstMs: first.ms, warmMs: warm.ms, q: warm.q, d: warm.d, bytes: warm.body.length, etag304: again?.status === 304 });
      expect(warm.status, warm.body.slice(0, 300)).toBeLessThan(500);
      if (c.maxDepth) expect(warm.d).toBeLessThanOrEqual(c.maxDepth);
      if (c.maxBytes && warm.status === 200) expect(warm.body.length).toBeLessThanOrEqual(c.maxBytes);
    }, 60_000);
  }
});
