import { beforeEach, describe, expect, it, vi } from "vitest";
import { G, resetGuard } from "@/lib/app-api/test-guard";
import { STUDENT_ID, appReq, noParams, profileRow, read } from "@/lib/app-api/test-kit";

const h = vi.hoisted(() => ({ shop: vi.fn() }));

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: () => undefined, unstable_cache: (fn: unknown) => fn }));
vi.mock("@/lib/supabase/server", async () => (await import("@/lib/app-api/test-guard")).supabaseMock());
vi.mock("@/lib/app-api/supabase", async () => (await import("@/lib/app-api/test-guard")).statelessMock());
vi.mock("@/lib/flags", async () => (await import("@/lib/app-api/test-guard")).flagsMock());
vi.mock("@/lib/access/blocks", async () => (await import("@/lib/app-api/test-guard")).blocksMock());
vi.mock("@/lib/rate-limit", async () => (await import("@/lib/app-api/test-guard")).rateMock());
vi.mock("@/lib/rate-limit-fast", async () => (await import("@/lib/app-api/test-guard")).fastRateMock());
vi.mock("@/lib/leagues/shop-data", () => ({ loadShop: h.shop }));

import { clearDeviceCache } from "@/lib/app-api/devices";
import { GET as shop } from "./shop/route";

beforeEach(() => {
  resetGuard();
  clearDeviceCache();
  h.shop.mockReset();
  h.shop.mockResolvedValue({ ready: true, balance: 420, streak: { count: 3, alive: true }, repair: { ok: false, text: "Your streak is still going." }, owned: ["frame-blue"], look: "frame-blue", learn: null });
});

describe("GET /leaderboards/shop", () => {
  it("answers the shop: balance, items with ready flags, looks owned and worn", async () => {
    const r = await read(await shop(appReq("/leaderboards/shop"), noParams));
    expect(r.status).toBe(200);
    expect(h.shop).toHaveBeenCalledWith(STUDENT_ID);
    expect(r.data).toMatchObject({ v: 1, ready: true, balance: 420, streak: { count: 3, alive: true }, repair: { ok: false } });
    expect(r.data.items.map((i: { id: string }) => i.id)).toEqual(["streak_repair", "hints_3", "bonus_case"]);
    expect(r.data.items.find((i: { id: string }) => i.id === "bonus_case").ready).toBe(false);
    const blue = r.data.looks.find((l: { id: string }) => l.id === "frame-blue");
    expect(blue).toMatchObject({ owned: true, worn: true, kind: "frame" });
    expect(r.data.looks.find((l: { id: string }) => l.id === "title-blue")).toMatchObject({ owned: false, worn: false });
    expect(typeof r.data.note).toBe("string");
  });

  it("is closed to lectures-only accounts and when the leaderboard is switched off for the student", async () => {
    G.db.tables.profiles[0] = profileRow({ scope: "lectures_only" });
    clearDeviceCache();
    expect((await read(await shop(appReq("/leaderboards/shop"), noParams))).error?.code).toBe("scope");
    expect(h.shop).not.toHaveBeenCalled();
  });

  it("needs a sign-in", async () => {
    expect((await read(await shop(appReq("/leaderboards/shop", { token: null }), noParams))).error?.code).toBe("unauthenticated");
  });
});
