import { beforeEach, describe, expect, it, vi } from "vitest";
import { G, resetGuard } from "@/lib/app-api/test-guard";
import { STUDENT_ID, appReq, noParams, profileRow, read } from "@/lib/app-api/test-kit";

const h = vi.hoisted(() => ({ board: vi.fn() }));

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: () => undefined }));
vi.mock("@/lib/supabase/server", async () => (await import("@/lib/app-api/test-guard")).supabaseMock());
vi.mock("@/lib/app-api/supabase", async () => (await import("@/lib/app-api/test-guard")).statelessMock());
vi.mock("@/lib/flags", async () => (await import("@/lib/app-api/test-guard")).flagsMock());
vi.mock("@/lib/access/blocks", async () => (await import("@/lib/app-api/test-guard")).blocksMock());
vi.mock("@/lib/rate-limit", async () => (await import("@/lib/app-api/test-guard")).rateMock());
vi.mock("@/lib/rate-limit-fast", async () => (await import("@/lib/app-api/test-guard")).fastRateMock());
vi.mock("@/lib/standing/board", () => ({ loadMyBoard: h.board }));

import { clearDeviceCache } from "@/lib/app-api/devices";
import { GET as journey } from "./journey/route";

beforeEach(() => {
  resetGuard({
    progress: [
      { user_id: STUDENT_ID, watched_seconds: 3600, is_completed: true },
      { user_id: STUDENT_ID, watched_seconds: 600, is_completed: false },
      { user_id: "someone-else", watched_seconds: 9000, is_completed: true },
    ],
  });
  clearDeviceCache();
  h.board.mockReset();
});

describe("GET /journey", () => {
  it("answers the website's journey numbers for the signed-in student", async () => {
    h.board.mockResolvedValue({ rows: [], me: { userId: STUDENT_ID, points: 420, level: 3, title: "Keen Observer", pct: 0.4, rank: 2, hours: 12, lectureHours: 5 } });
    const r = await read(await journey(appReq("/journey"), noParams));
    expect(r.ok).toBe(true);
    expect(r.data).toMatchObject({ level: 3, title: "Keen Observer", levelPct: 0.4, points: 420, rank: 2 });
    const byKey = Object.fromEntries(r.data.stats.map((s: { key: string; value: string }) => [s.key, s.value]));
    expect(byKey).toMatchObject({ online: "12 h", lectures: "5 h", finished: "1" });
    expect(h.board).toHaveBeenCalledWith(STUDENT_ID);
  });

  it("works off the board (points and rank null) and stays open to lectures-only accounts", async () => {
    h.board.mockRejectedValue(new Error("down"));
    G.db.tables.profiles[0] = profileRow({ scope: "lectures_only" });
    const r = await read(await journey(appReq("/journey"), noParams));
    expect(r.ok).toBe(true);
    expect(r.data).toMatchObject({ level: 1, points: null, rank: null, streak: 0 });
    expect(r.data.stats).toHaveLength(6);
  });

  it("is closed when My journey is switched off for the student", async () => {
    G.blocks = ["journey"];
    const r = await read(await journey(appReq("/journey"), noParams));
    expect(r.error?.code).toBe("access_block");
  });

  it("needs a signed-in app user", async () => {
    const r = await read(await journey(appReq("/journey", { token: null }), noParams));
    expect(r.error?.code).toBe("unauthenticated");
  });
});
