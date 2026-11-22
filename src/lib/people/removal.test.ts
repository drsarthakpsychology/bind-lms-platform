import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { makeTestDb, type TestDb } from "@/lib/app-api/test-db";
import { declineDeletionRequest, deleteAccount, loadRemovalData, loadRemovedIdsFrom, removeAccess, restoreAccess, type RemovalDb } from "./removal";
import { DELETED_NAME, REFUSE } from "./removal-rules";

const ME = { id: "me", role: "admin", email: "owner@x.org" };
const NOW = new Date("2026-11-22T06:00:00Z");

let db: TestDb;
let authCalls: { id: string; attrs: Record<string, unknown> }[];
let authFails: boolean;
let client: RemovalDb;

const profile = (over: Record<string, unknown>) => ({ status: "active", block_reason: null, role: "student", is_test: false, roll_number: null, active_session_token: "tok", mobile_number: "9876543210", ...over });

beforeEach(() => {
  db = makeTestDb({
    profiles: [
      profile({ id: "me", email: "owner@x.org", name: "Owner", role: "admin" }),
      profile({ id: "s1", email: "asha@x.org", name: "Asha Rao", roll_number: "VIBHA-000001" }),
      profile({ id: "v1", email: "view@x.org", name: "Vik", role: "view_admin" }),
      profile({ id: "t1", email: "bot@x.test", name: "Test", is_test: true }),
    ],
    app_devices: [{ id: "d1", user_id: "s1", device_id: "p", active: true, push_token: "ExponentPushToken[x]" }],
    student_details: [{ user_id: "s1", full_name: "Asha Rao", phone: "9876543210" }],
    journal_entries: [{ id: "j1", user_id: "s1", body: "private" }],
    library_notes: [],
    notifications: [{ id: "n1", user_id: "s1" }],
    credential_invites: [{ id: "c1", email: "asha@x.org", name: "Asha", user_id: null }],
    crm_contacts: [{ email: "asha@x.org", name: "Asha", phone: "98", paid_at: "2026-10-01T00:00:00Z" }],
    credentials: [{ id: "cr1", credential_id: "VIBHA-C-1", user_id: "s1", student_name: "Asha Rao", recipient_email: "asha@x.org", recipient_phone: "98" }],
    certificates: [{ id: "old1", user_id: "s1", student_name: "Asha Rao" }],
    progress: [{ id: "p1", user_id: "s1", lesson_id: "l1" }],
    checkins: [{ id: "a1", user_id: "s1", status: "present" }],
    app_deletion_requests: [{ id: "r1", user_id: "s1", email: "asha@x.org", reason: "leaving", status: "open", created_at: "2026-11-20T00:00:00Z", handled_at: null }],
    admin_audit_log: [],
  });
  authCalls = [];
  authFails = false;
  client = { from: (t) => db.from(t), auth: { admin: { updateUserById: async (id, attrs) => (authCalls.push({ id, attrs }), { error: authFails ? { message: "down" } : null }) } } };
});

const row = (id: string) => db.tables.profiles.find((p) => p.id === id)!;
const audits = () => db.tables.admin_audit_log.map((a) => a.action);

describe("removeAccess", () => {
  it("blocks, marks, bans the sign-in, signs out phones and logs", async () => {
    expect(await removeAccess(client, ME, "s1", "left the course", NOW)).toEqual({ error: null });
    expect(row("s1")).toMatchObject({ status: "blocked", block_reason: "[removed] left the course", active_session_token: null, removed_at: NOW.toISOString(), removed_by: "me" });
    expect(authCalls).toEqual([{ id: "s1", attrs: { ban_duration: "876000h" } }]);
    expect(db.tables.app_devices[0]).toMatchObject({ active: false, push_token: null });
    expect(audits()).toEqual(["person.access_removed"]);
  });
  it("keeps every record and certificate", async () => {
    await removeAccess(client, ME, "s1", null, NOW);
    expect(db.tables.progress).toHaveLength(1);
    expect(db.tables.certificates).toHaveLength(1);
    expect(db.tables.credentials[0].recipient_email).toBe("asha@x.org");
    expect(row("s1").name).toBe("Asha Rao");
  });
  it("still blocks when Supabase Auth is down (the block is what stops them)", async () => {
    authFails = true;
    expect(await removeAccess(client, ME, "s1", null, NOW)).toEqual({ error: null });
    expect(row("s1").status).toBe("blocked");
  });
  it("works for staff", async () => {
    expect((await removeAccess(client, ME, "v1", null, NOW)).error).toBeNull();
    expect(row("v1").status).toBe("blocked");
  });
  it("refuses a view admin, yourself and the last Super Admin, writing nothing", async () => {
    expect((await removeAccess(client, { id: "v1", role: "view_admin" }, "s1")).error).toBe(REFUSE.notAllowed);
    expect((await removeAccess(client, ME, "me")).error).toBe(REFUSE.self);
    expect(db.log.filter((l) => l.op !== "select")).toEqual([]);
    expect(authCalls).toEqual([]);
  });
  it("refuses a missing person", async () => {
    expect((await removeAccess(client, ME, "nope")).error).toBe(REFUSE.notFound);
  });
});

describe("restoreAccess", () => {
  it("undoes a removal and lifts the ban", async () => {
    await removeAccess(client, ME, "s1", null, NOW);
    authCalls = [];
    expect(await restoreAccess(client, ME, "s1")).toEqual({ error: null });
    expect(row("s1")).toMatchObject({ status: "active", block_reason: null, removed_at: null });
    expect(authCalls).toEqual([{ id: "s1", attrs: { ban_duration: "none" } }]);
    expect(audits()).toEqual(["person.access_removed", "person.access_restored"]);
  });
  it("puts the block back when the sign-in cannot be turned on", async () => {
    await removeAccess(client, ME, "s1", "x", NOW);
    authFails = true;
    expect((await restoreAccess(client, ME, "s1")).error).toMatch(/Try again/);
    expect(row("s1").status).toBe("blocked");
  });
  it("does not restore a plain lock or a deleted account", async () => {
    row("s1").status = "blocked";
    row("s1").block_reason = "fee";
    expect((await restoreAccess(client, ME, "s1")).error).toBe(REFUSE.notRemoved);
    row("s1").block_reason = "[deleted]";
    expect((await restoreAccess(client, ME, "s1")).error).toBe(REFUSE.deletedForGood);
  });
});

describe("deleteAccount", () => {
  it("needs the typed name", async () => {
    expect((await deleteAccount(client, ME, "s1", "Asha")).error).toBe(REFUSE.nameMismatch);
    expect(row("s1").email).toBe("asha@x.org");
  });
  it("clears the sign-in and personal details, keeps certificates and records without the name", async () => {
    expect(await deleteAccount(client, ME, "s1", "asha rao", { now: NOW, requestId: "r1" })).toEqual({ error: null });
    expect(row("s1")).toMatchObject({ status: "blocked", block_reason: "[deleted]", email: null, name: DELETED_NAME, mobile_number: null, active_session_token: null, deleted_at: NOW.toISOString() });
    // Roll number stays: it is the institution's record, not a contact detail.
    expect(row("s1").roll_number).toBe("VIBHA-000001");
    const a = authCalls[0];
    expect(a.id).toBe("s1");
    expect(a.attrs).toMatchObject({ email: "deleted-s1@removed.vibhapsychology.com", ban_duration: "876000h", user_metadata: {} });
    expect(String(a.attrs.password).length).toBeGreaterThan(30);
    expect(db.tables.student_details).toEqual([]);
    expect(db.tables.journal_entries).toEqual([]);
    expect(db.tables.notifications).toEqual([]);
    expect(db.tables.app_devices).toEqual([]);
    expect(db.tables.credential_invites).toEqual([]);
    // Kept: certificates (checkable), learning and attendance rows.
    expect(db.tables.certificates).toHaveLength(1);
    expect(db.tables.credentials[0]).toMatchObject({ credential_id: "VIBHA-C-1", student_name: "Asha Rao", recipient_email: null, recipient_phone: null });
    expect(db.tables.progress).toHaveLength(1);
    expect(db.tables.checkins).toHaveLength(1);
    // A paid enquiry stays for the accounts without name or phone.
    expect(db.tables.crm_contacts[0]).toMatchObject({ name: null, phone: null, paid_at: "2026-10-01T00:00:00Z" });
    expect(db.tables.app_deletion_requests[0]).toMatchObject({ status: "done", handled_by: "me", email: null });
  });
  it("an unpaid enquiry record goes", async () => {
    db.tables.crm_contacts[0].paid_at = null;
    await deleteAccount(client, ME, "s1", "Asha Rao", { now: NOW });
    expect(db.tables.crm_contacts).toEqual([]);
  });
  it("logs without the email or name", async () => {
    await deleteAccount(client, ME, "s1", "Asha Rao", { now: NOW });
    const log = db.tables.admin_audit_log[0];
    expect(log.action).toBe("person.account_deleted");
    expect(JSON.stringify(log.details)).not.toMatch(/asha/i);
  });
  it("never yourself, never a Super Admin, never twice", async () => {
    expect((await deleteAccount(client, ME, "me", "Owner")).error).toBe(REFUSE.self);
    await deleteAccount(client, ME, "s1", "Asha Rao", { now: NOW });
    expect((await deleteAccount(client, ME, "s1", DELETED_NAME)).error).toBe(REFUSE.alreadyDeleted);
  });
  it("works for a View Admin and makes them a student shell", async () => {
    expect((await deleteAccount(client, ME, "v1", "vik", { now: NOW })).error).toBeNull();
    expect(row("v1").role).toBe("student");
  });
  it("works on a database without the new columns", async () => {
    const plain = makeTestDb({ profiles: [profile({ id: "me", email: "o@x.org", name: "Owner", role: "admin" }), profile({ id: "s1", email: "a@x.org", name: "Asha Rao" })], admin_audit_log: [] });
    // Imitate the column check: any update or select naming the new columns fails.
    // A query that answers "column missing" however it is chained.
    const failing = (error: { code: string; message: string }) => {
      const f: Record<string, unknown> = {};
      for (const k of ["eq", "limit", "maybeSingle", "order", "in"]) f[k] = () => f;
      f.then = (ok: (v: unknown) => unknown) => Promise.resolve({ data: null, error }).then(ok);
      return f;
    };
    const strict: RemovalDb = {
      from: (t) => {
        const q = plain.from(t) as unknown as Record<string, (...a: unknown[]) => unknown>;
        const sel = q.select.bind(q);
        const upd = q.update.bind(q);
        q.select = (cols?: unknown, ...rest: unknown[]) => (typeof cols === "string" && /removed_at|deleted_at/.test(cols) ? failing({ code: "42703", message: "column profiles.removed_at does not exist" }) : sel(cols, ...rest));
        q.update = (payload: unknown) => (payload && typeof payload === "object" && ("removed_at" in payload || "deleted_at" in payload) ? failing({ code: "PGRST204", message: "Could not find the 'removed_at' column" }) : upd(payload));
        return q;
      },
      auth: client.auth,
    };
    expect((await removeAccess(strict, ME, "s1", "x", NOW)).error).toBeNull();
    expect(plain.tables.profiles[1]).toMatchObject({ status: "blocked", block_reason: "[removed] x" });
    expect((await restoreAccess(strict, ME, "s1")).error).toBeNull();
    expect((await deleteAccount(strict, ME, "s1", "Asha Rao", { now: NOW })).error).toBeNull();
    expect(plain.tables.profiles[1]).toMatchObject({ block_reason: "[deleted]", email: null });
  });
});

describe("requests and lists", () => {
  it("declines an open request once", async () => {
    expect(await declineDeletionRequest(client, ME, "r1", NOW)).toEqual({ error: null });
    expect(db.tables.app_deletion_requests[0]).toMatchObject({ status: "declined", handled_by: "me" });
    expect((await declineDeletionRequest(client, ME, "r1", NOW)).error).toMatch(/already/);
    expect((await declineDeletionRequest(client, { id: "v1", role: "view_admin" }, "r1")).error).toMatch(/Super Admin/);
  });
  it("lists people (no test accounts, no deleted ones) and requests", async () => {
    await removeAccess(client, ME, "v1", "gone", NOW);
    const d = await loadRemovalData(client, { id: "me" });
    expect(d.people.map((p) => p.id).sort()).toEqual(["me", "s1", "v1"]);
    expect(d.people.find((p) => p.id === "v1")).toMatchObject({ state: "removed", note: "gone" });
    expect(d.people.find((p) => p.id === "me")).toMatchObject({ isYou: true, role: "admin" });
    expect(d.activeSupers).toBe(1);
    expect(d.requests[0]).toMatchObject({ id: "r1", name: "Asha Rao", status: "open", confirmWord: "Asha Rao", accountGone: false });
    await deleteAccount(client, ME, "s1", "Asha Rao", { now: NOW });
    const after = await loadRemovalData(client, { id: "me" });
    expect(after.people.map((p) => p.id)).not.toContain("s1");
    expect(after.requests[0]).toMatchObject({ status: "done", accountGone: true, name: DELETED_NAME, email: null });
  });
  it("says when the request table is not there yet", async () => {
    db.missing.add("app_deletion_requests");
    const d = await loadRemovalData(client, { id: "me" });
    expect(d.requestsReady).toBe(false);
    expect(d.requests).toEqual([]);
  });
  it("removed ids: removed and deleted, not plain locks", async () => {
    row("v1").status = "blocked";
    row("v1").block_reason = "fee";
    await removeAccess(client, ME, "s1", null, NOW);
    expect([...(await loadRemovedIdsFrom(client))]).toEqual(["s1"]);
  });
});
