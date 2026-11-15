import { beforeEach, describe, expect, it, vi } from "vitest";
import { G, resetGuard } from "@/lib/app-api/test-guard";
import { ADMIN_ID, STUDENT_ID, appReq, noParams, read } from "@/lib/app-api/test-kit";

/** The app agent's requests (docs/app/CONTRACT_REQUESTS.md): cohort line, Home quests, deletion request. */
const h = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: () => undefined }));
vi.mock("@/lib/supabase/server", async () => (await import("@/lib/app-api/test-guard")).supabaseMock());
vi.mock("@/lib/app-api/supabase", async () => (await import("@/lib/app-api/test-guard")).statelessMock());
vi.mock("@/lib/flags", async () => (await import("@/lib/app-api/test-guard")).flagsMock());
vi.mock("@/lib/access/blocks", async () => (await import("@/lib/app-api/test-guard")).blocksMock());
vi.mock("@/lib/rate-limit", async () => (await import("@/lib/app-api/test-guard")).rateMock());
vi.mock("@/lib/rate-limit-fast", async () => (await import("@/lib/app-api/test-guard")).fastRateMock());
vi.mock("@/lib/app-api/push", () => ({ queuePush: h.push }));

import { clearDeviceCache } from "@/lib/app-api/devices";
import { buildConfig, cohortLine } from "@/lib/app-api/config";
import { questsOut } from "@/lib/app-api/views/courses";
import { POST as deletion } from "./me/deletion-request/route";
import { GET as config } from "./config/route";

beforeEach(() => {
  resetGuard({ app_deletion_requests: [] });
  clearDeviceCache();
  h.push.mockReset();
});

describe("GET /config cohort line", () => {
  it("answers the line, an override, or none", async () => {
    expect((await read(await config())).data.cohortLine).toBe("Cohort Two · by invitation · starts December 2026");
    expect(cohortLine({ APP_COHORT_LINE: "Cohort Three · starts March" })).toBe("Cohort Three · starts March");
    expect(buildConfig(new Date(), { APP_COHORT_LINE: "none" }).cohortLine).toBeNull();
  });
});

describe("Home quests", () => {
  it("maps the website's quest card with app targets and the points per quest", () => {
    const q = questsOut({ done: false, paid: false, spareBonus: 2, xpBonus: 10, quests: [{ id: "section", label: "Read one section", href: "/study", done: true, progress: null }, { id: "game", label: "Play a game", href: "/games", done: false, progress: "0 of 1" } as never] });
    expect(q).toEqual({
      done: false,
      xpEach: 5,
      xpBonus: 10,
      spareBonus: 2,
      quests: [
        { id: "section", label: "Read one section", done: true, progress: null, target: { screen: "study", web: "/study" } },
        { id: "game", label: "Play a game", done: false, progress: "0 of 1", target: { screen: "game", game: null, web: "/games" } },
      ],
    });
  });
});

describe("POST /me/deletion-request", () => {
  it("stores the request and tells the super admin (bell and push); nothing is deleted", async () => {
    const r = await read(await deletion(appReq("/me/deletion-request", { body: { reason: "I finished the course" } }), noParams));
    expect(r.data).toMatchObject({ received: true, at: expect.any(String) });
    expect(G.db.tables.app_deletion_requests[0]).toMatchObject({ user_id: STUDENT_ID, reason: "I finished the course" });
    const bell = G.db.tables.notifications.find((n) => n.user_id === ADMIN_ID);
    expect(bell).toMatchObject({ title: "Account deletion request", sent_by: STUDENT_ID });
    expect(h.push).toHaveBeenCalledWith(expect.any(Array), "messages");
    expect(G.db.tables.profiles.find((p) => p.id === STUDENT_ID)).toBeTruthy();
  });

  it("before the database step it still reaches the team", async () => {
    resetGuard({}, ["app_deletion_requests"]);
    const r = await read(await deletion(appReq("/me/deletion-request", { body: {} }), noParams));
    expect(r.status).toBe(200);
    expect(G.db.tables.notifications.some((n) => n.user_id === ADMIN_ID)).toBe(true);
  });

  it("is limited to a few a minute", async () => {
    G.limited.add(`app:deletion:${STUDENT_ID}`);
    expect((await read(await deletion(appReq("/me/deletion-request", { body: {} }), noParams))).status).toBe(429);
  });
});
