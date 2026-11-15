import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TestDb } from "@/lib/app-api/test-db";
import { ADMIN_ID, ADMIN_TOKEN, DEVICE, OTHER_DEVICE, STUDENT_ID, STUDENT_TOKEN, appReq, noParams, profileRow, read, seedDb, token } from "@/lib/app-api/test-kit";

const h = vi.hoisted(() => ({
  db: null as unknown as TestDb,
  users: {} as Record<string, { id: string; email: string }>,
  flags: {} as Record<string, string>,
  blocks: [] as string[],
  signIn: vi.fn(),
  refresh: vi.fn(),
  revoke: vi.fn(async () => ({ error: null })),
  setPassword: vi.fn(async () => ({ error: null })),
  limited: new Set<string>(),
}));

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: () => undefined }));
vi.mock("@/lib/supabase/server", () => ({
  createAdminClient: () => ({ from: (t: string) => h.db.from(t), auth: { admin: { signOut: h.revoke, updateUserById: h.setPassword } } }),
  createClient: async () => ({ from: (t: string) => h.db.from(t) }),
}));
vi.mock("@/lib/app-api/supabase", () => ({
  createStatelessAuthClient: () => ({
    auth: {
      getUser: async (t: string) => (h.users[t] ? { data: { user: h.users[t] }, error: null } : { data: { user: null }, error: { message: "invalid JWT" } }),
      signInWithPassword: h.signIn,
      refreshSession: h.refresh,
    },
  }),
}));
vi.mock("@/lib/flags", () => ({ readFlags: async () => h.flags }));
vi.mock("@/lib/access/blocks", () => ({ loadMyBlocks: async () => h.blocks }));
vi.mock("@/lib/cohorts/access", () => ({ loadMyCohorts: async () => [{ id: "c1", name: "Cohort 2" }] }));
vi.mock("@/lib/rate-limit", () => ({
  rateLimitResult: async (key: string) => (h.limited.has(key) ? "limited" : "allowed"),
  rateLimitWrite: async (key: string) => !h.limited.has(key),
  rateLimit: async (key: string) => !h.limited.has(key),
}));

import { clearDeviceCache } from "@/lib/app-api/devices";
import { hashSetupToken } from "@/lib/auth/roster";
import { POST as signIn } from "./sign-in/route";
import { POST as refresh } from "./refresh/route";
import { POST as signOut } from "./sign-out/route";
import { POST as setupCheck } from "./setup/check/route";
import { POST as setupComplete } from "./setup/complete/route";
import { GET as me, PATCH as patchMe } from "../me/route";
import { GET as config } from "../config/route";
import { GET as devices } from "../devices/route";
import { PUT as putDevice } from "../devices/current/route";
import { POST as allowChange } from "../admin/devices/allow-change/route";

const session = { access_token: STUDENT_TOKEN, refresh_token: "refresh-1234567890", expires_in: 3600, expires_at: 1_800_000_000 };
const phone = (id = DEVICE) => ({ id, name: "Pixel 8", platform: "android" });
const creds = (device = phone()) => ({ email: "Asha@Example.com", password: "mango river lamp", device });

beforeEach(() => {
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test";
  h.db = seedDb();
  h.users = { [STUDENT_TOKEN]: { id: STUDENT_ID, email: "asha@example.com" }, [ADMIN_TOKEN]: { id: ADMIN_ID, email: "owner@example.com" } };
  h.flags = { learn: "unlocked" };
  h.blocks = [];
  h.limited.clear();
  h.revoke.mockClear();
  h.signIn.mockReset().mockResolvedValue({ data: { user: { id: STUDENT_ID }, session }, error: null });
  h.refresh.mockReset().mockResolvedValue({ data: { user: { id: STUDENT_ID }, session: { ...session, access_token: token("student-2") } }, error: null });
  clearDeviceCache();
});

describe("POST /auth/sign-in", () => {
  it("answers tokens, the account, its access and this phone", async () => {
    const r = await read(await signIn(appReq("/auth/sign-in", { token: null, body: creds() }), noParams));
    expect(r.status).toBe(200);
    expect(r.data.tokens).toEqual({ accessToken: STUDENT_TOKEN, refreshToken: "refresh-1234567890", expiresIn: 3600, expiresAt: new Date(1_800_000_000_000).toISOString() });
    expect(r.data.me).toMatchObject({ id: STUDENT_ID, name: "Asha Rao", role: "student", scope: "full", rollNumber: "VIBHA-000042", cohorts: [{ id: "c1", name: "Cohort 2" }] });
    expect(r.data.me.access.tabs).toEqual(["home", "learn", "practise", "library", "me"]);
    expect(r.data.me.watermark.text).toBe("Asha Rao · VIBHA-000042");
    expect(r.data.device).toMatchObject({ enforced: true, current: { id: DEVICE }, limit: 2 });
    // The website's one-browser token is untouched: app and browser stay signed in together.
    expect(h.db.tables.profiles[0].active_session_token).toBe("web-token");
  });

  it("refuses a wrong password with the same words for a wrong email", async () => {
    h.signIn.mockResolvedValue({ data: { user: null, session: null }, error: { message: "Invalid login credentials" } });
    const r = await read(await signIn(appReq("/auth/sign-in", { token: null, body: creds() }), noParams));
    expect(r).toMatchObject({ status: 401, error: { code: "invalid_credentials", message: "Incorrect email or password." } });
  });

  it("hands no tokens to a paused or ended account and ends the session it just made", async () => {
    h.db.tables.profiles[0].status = "blocked";
    let r = await read(await signIn(appReq("/auth/sign-in", { token: null, body: creds() }), noParams));
    expect(r).toMatchObject({ status: 403, error: { code: "account_blocked" } });
    expect(r.data).toBeUndefined();
    h.db.tables.profiles[0] = profileRow({ expires_at: "2020-01-01T00:00:00Z" });
    r = await read(await signIn(appReq("/auth/sign-in", { token: null, body: creds() }), noParams));
    expect(r).toMatchObject({ status: 403, error: { code: "account_expired" } });
    expect(h.revoke).toHaveBeenCalledTimes(2);
    expect(h.revoke).toHaveBeenCalledWith(STUDENT_TOKEN, "local");
  });

  it("limits tries per email (lower-cased, the website's own counter)", async () => {
    h.limited.add("login:asha@example.com");
    const r = await read(await signIn(appReq("/auth/sign-in", { token: null, body: creds() }), noParams));
    expect(r).toMatchObject({ status: 429, error: { code: "rate_limited" } });
    expect(h.signIn).not.toHaveBeenCalled();
  });

  it("refuses a third phone in a month and keeps the phone in use signed in", async () => {
    const now = new Date().toISOString();
    h.db.tables.app_device_changes.push({ user_id: STUDENT_ID, kind: "switch", created_at: now }, { user_id: STUDENT_ID, kind: "switch", created_at: now });
    const r = await read(await signIn(appReq("/auth/sign-in", { token: null, body: creds(phone(OTHER_DEVICE)) }), noParams));
    expect(r).toMatchObject({ status: 403, error: { code: "device_limit" } });
    expect(r.error?.details.nextChangeAt).toBeTruthy();
    expect(h.revoke).toHaveBeenCalled();
    expect(h.db.tables.app_devices.find((d) => d.device_id === DEVICE && d.user_id === STUDENT_ID)?.active).toBe(true);
  });

  it("rejects a malformed body with the fields named", async () => {
    const r = await read(await signIn(appReq("/auth/sign-in", { token: null, body: { email: "a@b.co", password: "x", device: { id: "short", name: "", platform: "windows" } } }), noParams));
    expect(r.status).toBe(400);
    expect(r.error?.code).toBe("bad_request");
    expect(r.error?.details.fields).toEqual(expect.arrayContaining(["device.id", "device.platform"]));
  });

  it("works before the app_devices database step, with the rule not enforced", async () => {
    h.db = seedDb({}, ["app_devices", "app_device_changes"]);
    const r = await read(await signIn(appReq("/auth/sign-in", { token: null, body: creds(phone(OTHER_DEVICE)) }), noParams));
    expect(r.status).toBe(200);
    expect(r.data.device.enforced).toBe(false);
  });
});

describe("the bearer guard (requireAppUser) on GET /me", () => {
  it("lets a signed-in student in", async () => {
    const r = await read(await me(appReq("/me"), noParams));
    expect(r.status).toBe(200);
    expect(r.data.email).toBe("asha@example.com");
  });

  it("401 unauthenticated without a token or with a bad one", async () => {
    expect((await read(await me(appReq("/me", { token: null }), noParams))).error?.code).toBe("unauthenticated");
    expect(await read(await me(appReq("/me", { token: token("stranger") }), noParams))).toMatchObject({ status: 401, error: { code: "unauthenticated" } });
  });

  it("401 token_expired tells the app to refresh", async () => {
    const r = await read(await me(appReq("/me", { token: token("student", true) }), noParams));
    expect(r).toMatchObject({ status: 401, error: { code: "token_expired" } });
  });

  it("401 device_required when the phone id is missing or malformed", async () => {
    expect((await read(await me(appReq("/me", { device: null }), noParams))).error?.code).toBe("device_required");
    expect((await read(await me(appReq("/me", { device: "nope" }), noParams))).error?.code).toBe("device_required");
  });

  it("403 account_blocked for a paused account, lifted on the next request once unpaused", async () => {
    h.db.tables.profiles[0].status = "blocked";
    expect(await read(await me(appReq("/me"), noParams))).toMatchObject({ status: 403, error: { code: "account_blocked" } });
    h.db.tables.profiles[0].status = "active";
    expect((await read(await me(appReq("/me"), noParams))).status).toBe(200);
  });

  it("403 account_expired for an ended student, never for alumni", async () => {
    h.db.tables.profiles[0] = profileRow({ expires_at: "2020-01-01T00:00:00Z" });
    expect(await read(await me(appReq("/me"), noParams))).toMatchObject({ status: 403, error: { code: "account_expired" } });
    h.db.tables.profiles[0] = profileRow({ expires_at: "2020-01-01T00:00:00Z", role: "alumni" });
    const r = await read(await me(appReq("/me"), noParams));
    expect(r.status).toBe(200);
    expect(r.data.expiresAt).toBeNull();
  });

  it("401 device_replaced once another phone has signed in", async () => {
    await signIn(appReq("/auth/sign-in", { token: null, body: creds(phone(OTHER_DEVICE)) }), noParams);
    const r = await read(await me(appReq("/me", { device: DEVICE }), noParams));
    expect(r).toMatchObject({ status: 401, error: { code: "device_replaced", message: "Signed out: opened on another device." } });
    expect((await read(await me(appReq("/me", { device: OTHER_DEVICE }), noParams))).status).toBe(200);
  });

  it("426 upgrade_required below the minimum version", async () => {
    process.env.APP_MIN_VERSION = "2.0.0";
    try {
      const r = await read(await me(appReq("/me", { version: "1.4.0" }), noParams));
      expect(r).toMatchObject({ status: 426, error: { code: "upgrade_required", details: { minVersion: "2.0.0" } } });
      // /config still answers, so an old app can learn that it is old.
      expect((await read(await config())).data.minSupportedVersion).toBe("2.0.0");
    } finally {
      delete process.env.APP_MIN_VERSION;
    }
  });

  it("reports lectures-only access with the smaller tab bar", async () => {
    h.db.tables.profiles[0] = profileRow({ scope: "lectures_only" });
    const r = await read(await me(appReq("/me"), noParams));
    expect(r.data.access).toMatchObject({ lecturesOnly: true, tabs: ["home", "lectures", "doubts", "me"], can: { lectures: true, doubts: true, study: false, games: false, practice: false, notifications: true } });
  });

  it("reports sections switched off for this student and locked features", async () => {
    h.blocks = ["doubts", "games"];
    h.flags = { learn: "live" };
    const r = await read(await me(appReq("/me"), noParams));
    expect(r.data.access.can).toMatchObject({ doubts: false, games: false, study: false, lectures: true });
    expect(r.data.access.blocks).toEqual(["doubts", "games"]);
  });
});

describe("POST /auth/refresh", () => {
  it("answers new tokens", async () => {
    const r = await read(await refresh(appReq("/auth/refresh", { token: null, body: { refreshToken: "refresh-1234567890" } }), noParams));
    expect(r.status).toBe(200);
    expect(r.data.tokens.accessToken).toBe(token("student-2"));
    expect(h.refresh).toHaveBeenCalledWith({ refresh_token: "refresh-1234567890" });
  });
  it("401 when the refresh token is no good", async () => {
    h.refresh.mockResolvedValue({ data: { user: null, session: null }, error: { message: "Invalid Refresh Token" } });
    expect(await read(await refresh(appReq("/auth/refresh", { token: null, body: { refreshToken: "refresh-1234567890" } }), noParams))).toMatchObject({ status: 401, error: { code: "unauthenticated" } });
  });
  it("a replaced phone cannot refresh, and the new session is ended", async () => {
    const r = await read(await refresh(appReq("/auth/refresh", { token: null, device: OTHER_DEVICE, body: { refreshToken: "refresh-1234567890" } }), noParams));
    expect(r).toMatchObject({ status: 401, error: { code: "device_replaced" } });
    expect(h.revoke).toHaveBeenCalledWith(token("student-2"), "local");
  });
  it("a paused account is refused but keeps its session", async () => {
    h.db.tables.profiles[0].status = "blocked";
    const r = await read(await refresh(appReq("/auth/refresh", { token: null, body: { refreshToken: "refresh-1234567890" } }), noParams));
    expect(r.error?.code).toBe("account_blocked");
    expect(h.revoke).not.toHaveBeenCalled();
  });
});

describe("POST /auth/sign-out", () => {
  it("ends the session and frees the phone without counting a change", async () => {
    const r = await read(await signOut(appReq("/auth/sign-out", { method: "POST" }), noParams));
    expect(r.data).toEqual({ signedOut: true });
    expect(h.revoke).toHaveBeenCalledWith(STUDENT_TOKEN, "local");
    expect(h.db.tables.app_devices[0]).toMatchObject({ active: false, push_token: null });
    expect((await read(await me(appReq("/me"), noParams))).error?.code).toBe("device_replaced");
    expect(h.db.tables.app_device_changes).toHaveLength(0);
  });
});

describe("setup links (first password for an invited student)", () => {
  const TOKEN = "setup-token-abc";
  const row = (over = {}) => ({ id: "t1", user_id: STUDENT_ID, email: "asha@example.com", token_hash: hashSetupToken(TOKEN), expires_at: new Date(Date.now() + 86_400_000).toISOString(), used_at: null, revoked_at: null, ...over });
  beforeEach(() => {
    h.db.tables.account_setup_tokens = [row()];
    h.db.tables.credential_invites = [{ email: "asha@example.com", setup_completed_at: null }];
    h.setPassword.mockClear();
  });

  it("check says a good link is good and never uses it up", async () => {
    const r = await read(await setupCheck(appReq("/auth/setup/check", { token: null, body: { token: TOKEN } }), noParams));
    expect(r.data).toEqual({ valid: true, email: "asha@example.com", reason: null });
    expect(h.db.tables.account_setup_tokens[0].used_at).toBeNull();
  });
  it("check explains a used, expired or unknown link", async () => {
    h.db.tables.account_setup_tokens = [row({ used_at: "2026-01-01" })];
    expect((await read(await setupCheck(appReq("/auth/setup/check", { token: null, body: { token: TOKEN } }), noParams))).data.reason).toBe("used");
    h.db.tables.account_setup_tokens = [row({ expires_at: "2020-01-01T00:00:00Z" })];
    expect((await read(await setupCheck(appReq("/auth/setup/check", { token: null, body: { token: TOKEN } }), noParams))).data.reason).toBe("expired");
    expect((await read(await setupCheck(appReq("/auth/setup/check", { token: null, body: { token: "other" } }), noParams))).data).toEqual({ valid: false, email: null, reason: "unknown" });
  });
  it("complete sets the password once", async () => {
    const r = await read(await setupComplete(appReq("/auth/setup/complete", { token: null, body: { token: TOKEN, password: "mango river lamp" } }), noParams));
    expect(r.data).toEqual({ email: "asha@example.com" });
    expect(h.setPassword).toHaveBeenCalledWith(STUDENT_ID, { password: "mango river lamp" });
    expect(h.db.tables.credential_invites[0].setup_completed_at).toBeTruthy();
    const again = await read(await setupComplete(appReq("/auth/setup/complete", { token: null, body: { token: TOKEN, password: "mango river lamp" } }), noParams));
    expect(again).toMatchObject({ status: 409, error: { code: "conflict", details: { reason: "used" } } });
    expect(h.setPassword).toHaveBeenCalledTimes(1);
  });
  it("complete refuses a weak password without spending the link", async () => {
    const r = await read(await setupComplete(appReq("/auth/setup/complete", { token: null, body: { token: TOKEN, password: "short" } }), noParams));
    expect(r).toMatchObject({ status: 400, error: { code: "bad_request", details: { reason: "policy" } } });
    expect(h.db.tables.account_setup_tokens[0].used_at).toBeNull();
  });
});

describe("devices", () => {
  it("GET /devices answers this phone and the allowance", async () => {
    const r = await read(await devices(appReq("/devices"), noParams));
    expect(r.data).toMatchObject({ enforced: true, current: { id: DEVICE, name: "Pixel 8", pushEnabled: false }, changesUsed: 0, limit: 2 });
  });
  it("PUT /devices/current stores an Expo push token and refuses anything else", async () => {
    const good = await read(await putDevice(appReq("/devices/current", { method: "PUT", body: { pushToken: "ExponentPushToken[abcDEF123456]", name: "Asha's phone" } }), noParams));
    expect(good.data.current).toMatchObject({ name: "Asha's phone", pushEnabled: true });
    const bad = await read(await putDevice(appReq("/devices/current", { method: "PUT", body: { pushToken: "https://evil.example/hook" } }), noParams));
    expect(bad.status).toBe(400);
  });
  it("only the super admin can allow another phone change", async () => {
    const no = await read(await allowChange(appReq("/admin/devices/allow-change", { body: { userId: STUDENT_ID } }), noParams));
    expect(no).toMatchObject({ status: 403, error: { code: "forbidden" } });
    const yes = await read(await allowChange(appReq("/admin/devices/allow-change", { token: ADMIN_TOKEN, body: { userId: STUDENT_ID } }), noParams));
    expect(yes.data).toEqual({ allowed: true });
    expect(h.db.tables.app_device_changes[0]).toMatchObject({ user_id: STUDENT_ID, kind: "admin_reset", by_user_id: ADMIN_ID });
  });
});

describe("PATCH /me", () => {
  it("saves a valid mobile number and rejects a bad one", async () => {
    const bad = await read(await patchMe(appReq("/me", { method: "PATCH", body: { mobileNumber: "12" } }), noParams));
    expect(bad).toMatchObject({ status: 400, error: { details: { fields: ["mobileNumber"] } } });
    const ok = await read(await patchMe(appReq("/me", { method: "PATCH", body: { mobileNumber: "98765 43210" } }), noParams));
    expect(ok.status).toBe(200);
    expect(ok.data.mobileNumber).toMatch(/9876543210$/);
    expect(ok.data.askMobileNumber).toBe(false);
  });
});
