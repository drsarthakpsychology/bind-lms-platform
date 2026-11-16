/**
 * The bearer guard starts the token check, the profile, the phone and the
 * switched-off sections at once (keyed by the token's own `sub`). These tests
 * pin the rules that make that safe: the same answers as the one-by-one path,
 * and nothing written for a token or account that does not pass.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { G, resetGuard } from "./test-guard";
import { DEVICE, OTHER_DEVICE, STUDENT_ID, appReq, profileRow, token } from "./test-kit";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/server", async () => (await import("./test-guard")).supabaseMock());
vi.mock("@/lib/app-api/supabase", async () => (await import("./test-guard")).statelessMock());
vi.mock("@/lib/flags", async () => (await import("./test-guard")).flagsMock());
vi.mock("@/lib/access/blocks", async () => (await import("./test-guard")).blocksMock());

import { clearDeviceCache } from "./devices";
import { requireAppUser } from "./guard";
import { ApiFail } from "./respond";

const WITH_SUB = token("student-sub", false, STUDENT_ID);
const FORGED = token("forged", false, "33333333-3333-4333-8333-333333333333");

async function code(p: Promise<unknown>): Promise<string> {
  try {
    await p;
    return "ok";
  } catch (e) {
    return e instanceof ApiFail ? e.code : String(e);
  }
}

beforeEach(() => {
  resetGuard();
  G.users[WITH_SUB] = { id: STUDENT_ID, email: "asha@example.com" };
  clearDeviceCache();
});

describe("parallel bearer guard", () => {
  it("lets a good token in with the same profile as before", async () => {
    const u = await requireAppUser(appReq("/home", { token: WITH_SUB }), { path: "/courses" });
    expect(u.profile.id).toBe(STUDENT_ID);
    expect(u.name).toBe("Asha Rao");
    expect(u.context.blocks).toBeDefined();
  });

  it("refuses a token Supabase does not accept, and writes nothing", async () => {
    G.db.tables.app_devices = [];
    expect(await code(requireAppUser(appReq("/home", { token: FORGED })))).toBe("unauthenticated");
    // No phone was adopted for the id the bad token named.
    expect(G.db.log.filter((l) => l.table === "app_devices" || l.table === "app_device_changes")).toEqual([]);
  });

  it("uses the verified user when the token's own id disagrees", async () => {
    // A token whose payload names someone else but which Supabase answers for the student.
    G.users[FORGED] = { id: STUDENT_ID, email: "asha@example.com" };
    const u = await requireAppUser(appReq("/home", { token: FORGED }));
    expect(u.profile.id).toBe(STUDENT_ID);
  });

  it("a paused account is refused before any phone write", async () => {
    G.db.tables.profiles = [profileRow({ status: "blocked" })];
    G.db.tables.app_devices = [];
    expect(await code(requireAppUser(appReq("/home", { token: WITH_SUB })))).toBe("account_blocked");
    expect(G.db.log.filter((l) => l.table === "app_devices")).toEqual([]);
  });

  it("still signs out a replaced phone", async () => {
    expect(await code(requireAppUser(appReq("/home", { token: WITH_SUB, device: OTHER_DEVICE })))).toBe("device_replaced");
  });

  it("an ended account is refused", async () => {
    G.db.tables.profiles = [profileRow({ expires_at: "2020-01-01T00:00:00.000Z" })];
    expect(await code(requireAppUser(appReq("/home", { token: WITH_SUB, device: DEVICE })))).toBe("account_expired");
  });

  it("a switched-off section is refused with the prefetched blocks", async () => {
    G.blocks = ["notes"];
    expect(await code(requireAppUser(appReq("/study/modules", { token: WITH_SUB }), { path: "/study", flag: "learn" }))).toBe("access_block");
  });
});
