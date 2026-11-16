import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeTestDb, type TestDb } from "./test-db";

const h = vi.hoisted(() => ({ db: null as unknown }));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/server", () => ({ createAdminClient: () => h.db }));

import { activePushTargets, allowDeviceChange, checkDevice, clearDeviceCache, deviceState, registerDevice, signOutDevice, updateDevice } from "./devices";

const U = "user-1";
const A = "phone-aaaaaaaaaaaaaaaa";
const B = "phone-bbbbbbbbbbbbbbbb";
const C = "phone-cccccccccccccccc";
const D = "phone-dddddddddddddddd";
const phone = (id: string, name = "Pixel") => ({ id, name, platform: "android" as const });
const T0 = Date.parse("2026-11-01T00:00:00Z");
const DAY = 86_400_000;
let db: TestDb;

beforeEach(() => {
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test";
  db = makeTestDb({ app_devices: [], app_device_changes: [] });
  h.db = db;
  clearDeviceCache();
});

describe("one phone at a time", () => {
  it("the first phone is free and becomes the active one", async () => {
    const r = await registerDevice({ userId: U, role: "student", device: phone(A), now: T0 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.state).toMatchObject({ enforced: true, changesUsed: 0, limit: 2, current: { id: A } });
    expect(await checkDevice({ userId: U, role: "student", deviceId: A, now: T0 })).toBe("ok");
  });

  it("a new phone signs the old one out", async () => {
    await registerDevice({ userId: U, role: "student", device: phone(A), now: T0 });
    await updateDevice({ userId: U, role: "student", deviceId: A, pushToken: "ExponentPushToken[aaaaaaaaaaaa]" });
    const r = await registerDevice({ userId: U, role: "student", device: phone(B), now: T0 + DAY });
    expect(r.ok && r.state.changesUsed).toBe(1);
    expect(await checkDevice({ userId: U, role: "student", deviceId: A, now: T0 + DAY })).toBe("replaced");
    expect(await checkDevice({ userId: U, role: "student", deviceId: B, now: T0 + DAY })).toBe("ok");
    // The old phone no longer gets push.
    expect(db.tables.app_devices.find((d) => d.device_id === A)?.push_token).toBeNull();
  });

  it("signing in again on the same phone is not a change", async () => {
    await registerDevice({ userId: U, role: "student", device: phone(A), now: T0 });
    await signOutDevice(U, A);
    expect(await checkDevice({ userId: U, role: "student", deviceId: A, now: T0 + 1 })).toBe("replaced");
    const r = await registerDevice({ userId: U, role: "student", device: phone(A), now: T0 + 2 });
    expect(r.ok && r.state.changesUsed).toBe(0);
    expect(db.tables.app_device_changes).toHaveLength(0);
  });

  it("allows 2 changes in 30 days, refuses the third, and frees up later", async () => {
    await registerDevice({ userId: U, role: "student", device: phone(A), now: T0 });
    expect((await registerDevice({ userId: U, role: "student", device: phone(B), now: T0 + DAY })).ok).toBe(true);
    expect((await registerDevice({ userId: U, role: "student", device: phone(C), now: T0 + 2 * DAY })).ok).toBe(true);
    // The change rows carry real times so the window can be tested.
    db.tables.app_device_changes[0].created_at = new Date(T0 + DAY).toISOString();
    db.tables.app_device_changes[1].created_at = new Date(T0 + 2 * DAY).toISOString();
    const third = await registerDevice({ userId: U, role: "student", device: phone(D), now: T0 + 3 * DAY });
    expect(third).toEqual({ ok: false, code: "device_limit", nextChangeAt: new Date(T0 + 31 * DAY).toISOString() });
    // Refused: the phone in use stays signed in.
    expect(await checkDevice({ userId: U, role: "student", deviceId: C, now: T0 + 3 * DAY, fresh: true })).toBe("ok");
    // 30 days after the first change one slot is free again.
    expect((await registerDevice({ userId: U, role: "student", device: phone(D), now: T0 + 31 * DAY + 1000 })).ok).toBe(true);
  });

  it("an admin can allow another change at once", async () => {
    await registerDevice({ userId: U, role: "student", device: phone(A), now: T0 });
    await registerDevice({ userId: U, role: "student", device: phone(B), now: T0 + 1000 });
    await registerDevice({ userId: U, role: "student", device: phone(C), now: T0 + 2000 });
    db.tables.app_device_changes.forEach((c, i) => (c.created_at = new Date(T0 + (i + 1) * 1000).toISOString()));
    expect((await registerDevice({ userId: U, role: "student", device: phone(D), now: T0 + 3000 })).ok).toBe(false);
    expect(await allowDeviceChange(U, "admin-1")).toEqual({ ok: true, ready: true });
    db.tables.app_device_changes[2].created_at = new Date(T0 + 4000).toISOString();
    expect((await registerDevice({ userId: U, role: "student", device: phone(D), now: T0 + 5000 })).ok).toBe(true);
  });

  it("admins may use several phones and never hit the limit", async () => {
    for (const [i, id] of [A, B, C, D].entries()) {
      expect((await registerDevice({ userId: "adm", role: "admin", device: phone(id), now: T0 + i })).ok).toBe(true);
    }
    expect(await checkDevice({ userId: "adm", role: "admin", deviceId: A, now: T0 + 10 })).toBe("ok");
    expect(await checkDevice({ userId: "adm", role: "admin", deviceId: D, now: T0 + 10 })).toBe("ok");
    expect((await deviceState({ userId: "adm", role: "admin", deviceId: A })).limit).toBeNull();
  });

  it("the store reviewer's account (APP_REVIEW_EMAILS) has no change limit, but still one phone at a time", async () => {
    process.env.APP_REVIEW_EMAILS = " other@x.com , Reviewer@Vibha.test ";
    try {
      const email = "reviewer@vibha.test";
      for (const [i, id] of [A, B, C, D].entries()) {
        expect((await registerDevice({ userId: "rev", role: "student", email, device: phone(id), now: T0 + i })).ok).toBe(true);
      }
      expect(await checkDevice({ userId: "rev", role: "student", deviceId: A, now: T0 + 10 })).toBe("replaced");
      expect(await checkDevice({ userId: "rev", role: "student", deviceId: D, now: T0 + 10 })).toBe("ok");
      expect((await deviceState({ userId: "rev", role: "student", email, deviceId: D })).limit).toBeNull();
      // Anyone else keeps the limit.
      await registerDevice({ userId: U, role: "student", email: "student@x.com", device: phone(A), now: T0 });
      await registerDevice({ userId: U, role: "student", email: "student@x.com", device: phone(B), now: T0 + 1 });
      await registerDevice({ userId: U, role: "student", email: "student@x.com", device: phone(C), now: T0 + 2 });
      db.tables.app_device_changes.filter((c) => c.user_id === U).forEach((c, i) => (c.created_at = new Date(T0 + i + 1).toISOString()));
      expect((await registerDevice({ userId: U, role: "student", email: "student@x.com", device: phone(D), now: T0 + 3 })).ok).toBe(false);
    } finally {
      delete process.env.APP_REVIEW_EMAILS;
    }
  });

  it("without APP_REVIEW_EMAILS nobody is exempt", async () => {
    delete process.env.APP_REVIEW_EMAILS;
    const { isReviewAccount } = await import("./device-rules");
    expect(isReviewAccount("reviewer@vibha.test")).toBe(false);
    expect(isReviewAccount("a@b.c", "")).toBe(false);
    expect(isReviewAccount("", "a@b.c")).toBe(false);
    expect(isReviewAccount("A@B.C", "x@y.z,a@b.c")).toBe(true);
  });

  it("a phone the server has never seen is refused once the student has another", async () => {
    await registerDevice({ userId: U, role: "student", device: phone(A), now: T0 });
    expect(await checkDevice({ userId: U, role: "student", deviceId: B, now: T0 })).toBe("replaced");
  });

  it("adopts the phone already in use when the tables arrive later", async () => {
    expect(await checkDevice({ userId: U, role: "student", deviceId: A, platform: "ios", now: T0 })).toBe("ok");
    expect(db.tables.app_devices).toHaveLength(1);
    expect(db.tables.app_devices[0]).toMatchObject({ device_id: A, active: true, platform: "ios" });
  });
});

describe("before the database step is run", () => {
  beforeEach(() => {
    h.db = makeTestDb({}, ["app_devices", "app_device_changes"]);
  });
  it("sign-in works and nothing is enforced", async () => {
    const r = await registerDevice({ userId: U, role: "student", device: phone(A) });
    expect(r).toEqual({ ok: true, state: { enforced: false, current: null, changesUsed: 0, limit: null, nextChangeAt: null } });
    expect(await checkDevice({ userId: U, role: "student", deviceId: B })).toBe("unenforced");
    expect((await deviceState({ userId: U, role: "student", deviceId: A })).enforced).toBe(false);
    expect(await activePushTargets([U])).toEqual([]);
    expect(await allowDeviceChange(U, "admin")).toEqual({ ok: false, ready: false });
    await expect(signOutDevice(U, A)).resolves.toBeUndefined();
  });
});

describe("push tokens", () => {
  it("are stored on the phone row and listed only for active phones", async () => {
    await registerDevice({ userId: U, role: "student", device: phone(A), now: T0 });
    const s = await updateDevice({ userId: U, role: "student", deviceId: A, pushToken: "ExponentPushToken[aaaaaaaaaaaa]", name: "My phone" });
    expect(s.current).toMatchObject({ name: "My phone", pushEnabled: true });
    expect(await activePushTargets([U, "someone-else"])).toEqual([{ userId: U, token: "ExponentPushToken[aaaaaaaaaaaa]" }]);
    await updateDevice({ userId: U, role: "student", deviceId: A, pushToken: null });
    expect(await activePushTargets([U])).toEqual([]);
  });
  it("a token moves with the phone to the newest account", async () => {
    await registerDevice({ userId: "u1", role: "student", device: phone(A), now: T0 });
    await registerDevice({ userId: "u2", role: "student", device: phone(A), now: T0 });
    await updateDevice({ userId: "u1", role: "student", deviceId: A, pushToken: "ExponentPushToken[aaaaaaaaaaaa]" });
    await updateDevice({ userId: "u2", role: "student", deviceId: A, pushToken: "ExponentPushToken[aaaaaaaaaaaa]" });
    expect(await activePushTargets(["u1", "u2"])).toEqual([{ userId: "u2", token: "ExponentPushToken[aaaaaaaaaaaa]" }]);
  });
});
