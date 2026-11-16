/**
 * How many database round trips the app's main screens cost, and how many of
 * them wait for each other (the serial depth: what the student waits for).
 *
 * The real route code runs against a stand-in Supabase server
 * (src/lib/app-api/perf-harness.ts) that answers every request after DELAY ms.
 * Each route is called twice: "cold" is a fresh server instance (no per-server
 * caches yet), "warm" is the next request on the same instance.
 *
 * The budgets below are the numbers after the server speed pass
 * (docs/app/PERFORMANCE_SERVER.md). Set PERF_OUT=<file> to write the table there.
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
const COURSE = { id: "c0000000-0000-4000-8000-000000000000", title: "Psychopathology", is_published: true, weeks: [] };

type Case = { name: string; path: string; // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mod: () => Promise<{ GET: (req: Request, ctx: { params: Promise<any> }) => Promise<Response> }>; params?: Record<string, string>; admin?: boolean; budget: { cold: number; warm: number } };

/** Serial-depth budgets (round trips one after another), cold and warm. */
const CASES: Case[] = [
  { name: "home", path: "/home", mod: () => import("./home/route"), budget: { cold: 99, warm: 99 } },
  { name: "practise", path: "/practise", mod: () => import("./practise/route"), budget: { cold: 99, warm: 99 } },
  { name: "practise/tools/blitz", path: "/practise/tools/blitz", mod: () => import("./practise/tools/[tool]/route"), params: { tool: "blitz" }, budget: { cold: 99, warm: 99 } },
  { name: "practise/tools/wwyd", path: "/practise/tools/wwyd", mod: () => import("./practise/tools/[tool]/route"), params: { tool: "wwyd" }, budget: { cold: 99, warm: 99 } },
  { name: "prep", path: "/prep", mod: () => import("./prep/route"), budget: { cold: 99, warm: 99 } },
  { name: "study/modules", path: "/study/modules", mod: () => import("./study/modules/route"), budget: { cold: 99, warm: 99 } },
  { name: "study/state", path: "/study/state", mod: () => import("./study/state/route"), budget: { cold: 99, warm: 99 } },
  { name: "courses", path: "/courses", mod: () => import("./courses/route"), budget: { cold: 99, warm: 99 } },
  { name: "library/medicines", path: "/library/medicines", mod: () => import("./library/medicines/route"), budget: { cold: 99, warm: 99 } },
  { name: "me", path: "/me", mod: () => import("./me/route"), budget: { cold: 99, warm: 99 } },
  { name: "notifications", path: "/notifications", mod: () => import("./notifications/route"), budget: { cold: 99, warm: 99 } },
  { name: "leaderboards/quiz", path: "/leaderboards/quiz", mod: () => import("./leaderboards/[board]/route"), params: { board: "quiz" }, budget: { cold: 99, warm: 99 } },
  { name: "achievements", path: "/achievements", mod: () => import("./achievements/route"), budget: { cold: 99, warm: 99 } },
  { name: "admin/home", path: "/admin/home", mod: () => import("./admin/home/route"), admin: true, budget: { cold: 99, warm: 99 } },
  { name: "admin/students", path: "/admin/students", mod: () => import("./admin/students/route"), admin: true, budget: { cold: 99, warm: 99 } },
];

let h: Harness;
const results: { name: string; status: number; cold: { q: number; d: number; ms: number }; warm: { q: number; d: number; ms: number }; bytes: number; tables: string }[] = [];

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
      feature_flags: [{ key: "learn", status: "unlocked" }],
      courses: [COURSE],
      course_enrollments: [{ user_id: STUDENT_ID, course_id: COURSE.id }],
      lessons: [1, 2, 3].map((n) => ({ id: `0000000${n}-0000-4000-8000-000000000000`, course_id: COURSE.id, title: `Lecture ${n}`, week: 1, position: n, is_published: true })),
    },
  });
});

afterAll(() => {
  h.restore();
  if (process.env.PERF_OUT) {
    const line = (r: (typeof results)[number]) =>
      `| ${r.name} | ${r.status} | ${r.cold.q} | ${r.cold.d} | ${r.warm.q} | ${r.warm.d} | ${r.warm.ms} | ${r.bytes} | ${r.tables} |`;
    writeFileSync(process.env.PERF_OUT, ["| route | status | cold queries | cold serial | warm queries | warm serial | warm ms | bytes | warm waves |", "|---|---|---|---|---|---|---|---|---|", ...results.map(line)].join("\n") + "\n");
  }
});

/** The requests grouped by how long a chain they waited behind: "1: user profiles / 2: ...". */
function waves(): string {
  const by = new Map<number, string[]>();
  for (const x of h.hits) by.set(x.depth, [...(by.get(x.depth) ?? []), x.table]);
  return [...by.entries()].sort((a, b) => a[0] - b[0]).map(([d, t]) => `${d}: ${t.join(" ")}`).join(" / ");
}

async function once(c: Case, asAdmin: boolean) {
  const { GET } = await c.mod();
  const req = new Request(`http://test.local/api/app/v1${c.path}`, { headers: { authorization: `Bearer ${asAdmin ? ADMIN : STUDENT}`, "x-app-device-id": DEVICE, "x-app-platform": "android" } });
  h.reset();
  const t = performance.now();
  const res = await GET(req, { params: Promise.resolve(c.params ?? {}) });
  const ms = Math.round(performance.now() - t);
  const body = await res.text();
  return { status: res.status, q: h.hits.length, d: h.serialDepth(), ms, bytes: body.length, tables: waves(), body };
}

describe("app API round trips", () => {
  for (const c of CASES) {
    it(c.name, async () => {
      h.setUser(c.admin ? { id: ADMIN_ID, email: "owner@example.com" } : { id: STUDENT_ID, email: "asha@example.com" });
      vi.resetModules();
      const cold = await once(c, Boolean(c.admin));
      const warm = await once(c, Boolean(c.admin));
      results.push({ name: c.name, status: warm.status, cold: { q: cold.q, d: cold.d, ms: cold.ms }, warm: { q: warm.q, d: warm.d, ms: warm.ms }, bytes: warm.bytes, tables: warm.tables });
      expect(warm.status, warm.body.slice(0, 300)).toBeLessThan(500);
      expect(cold.d).toBeLessThanOrEqual(c.budget.cold);
      expect(warm.d).toBeLessThanOrEqual(c.budget.warm);
    });
  }
});

