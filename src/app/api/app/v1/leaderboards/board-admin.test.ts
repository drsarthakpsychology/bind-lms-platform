import { beforeEach, describe, expect, it, vi } from "vitest";
import { G, resetGuard } from "@/lib/app-api/test-guard";
import { STUDENT_ID, appReq, profileRow, read } from "@/lib/app-api/test-kit";

const h = vi.hoisted(() => ({ admin: vi.fn(), league: vi.fn() }));

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: () => undefined, unstable_cache: (fn: unknown) => fn }));
vi.mock("@/lib/supabase/server", async () => (await import("@/lib/app-api/test-guard")).supabaseMock());
vi.mock("@/lib/app-api/supabase", async () => (await import("@/lib/app-api/test-guard")).statelessMock());
vi.mock("@/lib/flags", async () => (await import("@/lib/app-api/test-guard")).flagsMock());
vi.mock("@/lib/access/blocks", async () => (await import("@/lib/app-api/test-guard")).blocksMock());
vi.mock("@/lib/rate-limit", async () => (await import("@/lib/app-api/test-guard")).rateMock());
vi.mock("@/lib/rate-limit-fast", async () => (await import("@/lib/app-api/test-guard")).fastRateMock());
vi.mock("@/lib/standing/admin-board-data", () => ({ loadAdminBoard: h.admin }));
vi.mock("@/lib/leagues/board", () => ({ loadMyLeague: h.league }));
vi.mock("@/lib/learn/leaderboard", () => ({ loadQuizBoard: vi.fn() }));
vi.mock("@/lib/standing/board", () => ({ loadMyBoard: vi.fn() }));
vi.mock("@/lib/cohorts/access", () => ({ loadMyCohorts: async () => [] }));
vi.mock("@/lib/games-sims/server/results", () => ({ loadAccuracyBoard: vi.fn() }));

import { clearDeviceCache } from "@/lib/app-api/devices";
import { GET } from "./[board]/route";

const params = (board: string) => ({ params: Promise.resolve({ board }) });
const page = {
  rows: [
    { key: "r0", rank: 1, name: "Asha Rao", cohorts: ["Cohort One"], points: 40, extra: { tier: "Neuron" } },
    { key: "r1", rank: 2, name: "Bina Shah", cohorts: [], points: 0, extra: { tier: "Neuron" } },
  ],
  total: 122,
  matched: 122,
  page: 1,
  pages: 3,
  size: 50,
  query: { q: "", cohort: null, sort: "rank", dir: "asc", page: 1, size: 50 },
  cohorts: [{ id: "c1", name: "Cohort One" }],
};

beforeEach(() => {
  resetGuard();
  clearDeviceCache();
  h.admin.mockReset();
  h.admin.mockResolvedValue(page);
  h.league.mockReset();
  h.league.mockResolvedValue({ league: { view: [], myRank: null }, groupSize: 0 });
});

describe("GET /leaderboards/:board for admins", () => {
  it("an admin gets every student, one page, with the query passed through", async () => {
    G.db.tables.profiles[0] = profileRow({ role: "admin" });
    clearDeviceCache();
    const r = await read(await GET(appReq("/leaderboards/league?q=asha&cohort=c1&sort=name&page=2"), params("league")));
    expect(r.status).toBe(200);
    expect(h.league).not.toHaveBeenCalled();
    expect(h.admin).toHaveBeenCalledWith("league", expect.objectContaining({ q: "asha", cohort: "c1", sort: "name", page: 2 }));
    expect(r.data.rows).toEqual([
      { rank: 1, name: "Asha Rao", points: 40, me: false, title: "Cohort One", extra: { tier: "Neuron" } },
      { rank: 2, name: "Bina Shah", points: 0, me: false, title: null, extra: { tier: "Neuron" } },
    ]);
    expect(r.data.admin).toMatchObject({ page: 1, pages: 3, total: 122, cohorts: [{ id: "c1", name: "Cohort One" }] });
    // Cohort ids go out (the filter needs them); student ids and emails never do.
    expect(JSON.stringify(r.data.rows)).not.toMatch(/"(id|userId|email)":/);
  });

  it("a view admin gets the same full board", async () => {
    G.db.tables.profiles[0] = profileRow({ role: "view_admin" });
    clearDeviceCache();
    const r = await read(await GET(appReq("/leaderboards/overall"), params("overall")));
    expect(r.status).toBe(200);
    expect(h.admin).toHaveBeenCalledWith("overall", expect.anything());
  });

  it("a student keeps the student board and never gets the admin one", async () => {
    const r = await read(await GET(appReq("/leaderboards/league?cohort=c2&page=3"), params("league")));
    expect(r.status).toBe(200);
    expect(h.admin).not.toHaveBeenCalled();
    expect(h.league).toHaveBeenCalledWith(STUDENT_ID);
    expect(r.data.admin).toBeUndefined();
  });
});
