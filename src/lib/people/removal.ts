import "server-only";
import { randomBytes } from "node:crypto";
import { audit } from "@/lib/auth/audit";
import { isHiddenAccount } from "./hidden";
import {
  BAN_FOREVER,
  checkRemoval,
  confirmWord,
  DELETED_MARK,
  DELETED_NAME,
  removalNote,
  removalOf,
  removedReason,
  tombstoneEmail,
  type Actor,
  type DeletionRequestState,
  type Removal,
  type Target,
} from "./removal-rules";

/**
 * Removing people from VIBHA (rules: ./removal-rules.ts). Every function
 * takes the service-role client and the signed-in actor, checks the rules on
 * the server, writes, and logs in admin_audit_log. The website actions
 * (src/app/(dashboard)/admin/remove/actions.ts) and the app routes
 * (/api/app/v1/admin/removal/...) both call these, so the rules are one.
 */

type Err = { code?: string; message?: string } | null;
type Res<T = unknown> = { data: T; error: Err };
/** The small part of the Supabase client used here (so tests pass an in-memory one). */
export type RemovalDb = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  from: (table: string) => any;
  auth: { admin: { updateUserById: (id: string, attrs: Record<string, unknown>) => Promise<{ error: Err }> } };
};

export type Outcome = { error: string | null };

const PROFILE_COLS = "id, email, name, role, status, block_reason, roll_number, is_test, created_at";
const NEW_COLS = ", removed_at, deleted_at";

/** A column the pending SQL adds is not there yet. */
function columnMissing(e: Err): boolean {
  if (!e) return false;
  return e.code === "42703" || e.code === "PGRST204" || /column .* does not exist|Could not find the '.*' column/i.test(e.message ?? "");
}
function tableMissing(e: Err): boolean {
  if (!e) return false;
  return e.code === "42P01" || e.code === "PGRST205" || /does not exist|schema cache/i.test(e.message ?? "");
}

/** profiles update that writes the new columns when the database has them, and works without. */
async function updateProfile(db: RemovalDb, id: string, base: Record<string, unknown>, extra: Record<string, unknown>): Promise<Err> {
  const first: Res = await db.from("profiles").update({ ...base, ...extra }).eq("id", id);
  if (!first.error) return null;
  if (!columnMissing(first.error)) return first.error;
  const again: Res = await db.from("profiles").update(base).eq("id", id);
  return again.error;
}

async function loadTarget(db: RemovalDb, id: string): Promise<Target | null> {
  let r: Res<Target | null> = await db.from("profiles").select(PROFILE_COLS + NEW_COLS).eq("id", id).maybeSingle();
  if (r.error && columnMissing(r.error)) r = await db.from("profiles").select(PROFILE_COLS).eq("id", id).maybeSingle();
  if (r.error) throw new Error(r.error.message ?? "profile read failed");
  return r.data ?? null;
}

/** Super Admins who still have access. */
async function activeSupers(db: RemovalDb): Promise<number> {
  const r: Res<{ id: string; status: string | null }[] | null> = await db.from("profiles").select("id, status").eq("role", "admin");
  return (r.data ?? []).filter((p) => p.status !== "blocked").length;
}

/** Every phone of theirs is signed out (the app asks for sign-in on its next call). */
async function signOutPhones(db: RemovalDb, id: string, at: string): Promise<void> {
  const r: Res = await db.from("app_devices").update({ active: false, signed_out_at: at, push_token: null }).eq("user_id", id);
  if (r.error && !tableMissing(r.error)) console.error("removal: phones not signed out:", r.error.code, r.error.message);
}

const who = (actor: Actor & { email?: string | null }) => ({ id: actor.id, email: actor.email ?? null });

/**
 * Remove access (reversible). Blocks every request at once (the session
 * guard reads status on each one), bans the sign-in so no new session or
 * refresh works, clears the browser session and signs out every phone.
 */
export async function removeAccess(db: RemovalDb, actor: Actor & { email?: string | null }, targetId: string, note?: string | null, now = new Date()): Promise<Outcome> {
  const target = await loadTarget(db, targetId);
  const refused = checkRemoval("remove", actor, target, await activeSupers(db));
  if (refused) return { error: refused };
  const at = now.toISOString();
  const err = await updateProfile(db, targetId, { status: "blocked", block_reason: removedReason(note), active_session_token: null }, { removed_at: at, removed_by: actor.id });
  if (err) return { error: "Could not remove their access. Nothing was changed." };
  const ban = await db.auth.admin.updateUserById(targetId, { ban_duration: BAN_FOREVER });
  if (ban.error) console.error("removal: sign-in ban failed (the block still stops them):", ban.error.message);
  await signOutPhones(db, targetId, at);
  await audit(db as never, { action: "person.access_removed", targetType: "profile", targetId, details: { email: target!.email ?? null, role: target!.role, note: removalNote(removedReason(note)) }, actor: who(actor) });
  return { error: null };
}

/** Restore access after a removal. A deleted account can never be restored. */
export async function restoreAccess(db: RemovalDb, actor: Actor & { email?: string | null }, targetId: string): Promise<Outcome> {
  const target = await loadTarget(db, targetId);
  const refused = checkRemoval("restore", actor, target, await activeSupers(db));
  if (refused) return { error: refused };
  const err = await updateProfile(db, targetId, { status: "active", block_reason: null }, { removed_at: null, removed_by: null });
  if (err) return { error: "Could not restore their access." };
  const ban = await db.auth.admin.updateUserById(targetId, { ban_duration: "none" });
  if (ban.error) {
    // Their sign-in is still refused: put the block back so the screen and the truth agree.
    await updateProfile(db, targetId, { status: "blocked", block_reason: target!.block_reason ?? removedReason() }, {});
    return { error: "Could not turn their sign-in back on. Try again in a minute." };
  }
  await audit(db as never, { action: "person.access_restored", targetType: "profile", targetId, details: { email: target!.email ?? null, role: target!.role }, actor: who(actor) });
  return { error: null };
}

/** Rows that are only personal (no one else's record needs them): removed on delete. */
const PERSONAL_BY_USER: { table: string; col: string }[] = [
  { table: "student_details", col: "user_id" },
  { table: "journal_entries", col: "user_id" },
  { table: "journal_shares", col: "shared_by" },
  { table: "library_notes", col: "user_id" },
  { table: "notifications", col: "user_id" },
  { table: "app_devices", col: "user_id" },
];

async function quiet(p: PromiseLike<Res>, what: string): Promise<void> {
  const r = await p;
  if (r.error && !tableMissing(r.error) && !columnMissing(r.error)) console.error(`account delete: ${what} not cleared:`, r.error.code, r.error.message);
}

/**
 * Delete an account (permanent). The person's auth user is kept as an empty
 * shell, never deleted: deleting it would cascade and erase the issued
 * certificates the public check needs. Instead the sign-in address is
 * replaced, the password scrambled, the sign-in banned for good, and every
 * personal detail cleared. Learning and attendance rows stay, pointing at a
 * nameless "Deleted account".
 */
export async function deleteAccount(db: RemovalDb, actor: Actor & { email?: string | null }, targetId: string, typedName: string, opts: { requestId?: string | null; now?: Date } = {}): Promise<Outcome> {
  const target = await loadTarget(db, targetId);
  const refused = checkRemoval("delete", actor, target, await activeSupers(db), typedName);
  if (refused) return { error: refused };
  const at = (opts.now ?? new Date()).toISOString();
  const oldEmail = (target!.email ?? "").trim().toLowerCase();

  // 1. Profile first: from this moment every request of theirs is refused.
  const err = await updateProfile(
    db,
    targetId,
    { status: "blocked", block_reason: DELETED_MARK, role: "student", email: null, name: DELETED_NAME, mobile_number: null, alias: null, title: null, look: null, active_session_token: null, expires_at: at },
    { deleted_at: at, removed_at: target!.removed_at ?? at, removed_by: actor.id },
  );
  if (err) {
    // Some older databases lack alias/title/look: try the core fields alone.
    const core = await updateProfile(db, targetId, { status: "blocked", block_reason: DELETED_MARK, role: "student", email: null, name: DELETED_NAME, mobile_number: null, active_session_token: null, expires_at: at }, { deleted_at: at });
    if (core) return { error: "Could not delete the account. Nothing was changed." };
  }

  // 2. The sign-in: a new address nobody owns, a random password, banned for good.
  const auth = await db.auth.admin.updateUserById(targetId, {
    email: tombstoneEmail(targetId),
    email_confirm: true,
    password: randomBytes(32).toString("base64url"),
    user_metadata: {},
    ban_duration: BAN_FOREVER,
  });
  if (auth.error) console.error("account delete: sign-in not cleared (the block still stops them):", auth.error.message);

  // 3. Personal rows.
  for (const p of PERSONAL_BY_USER) await quiet(db.from(p.table).delete().eq(p.col, targetId), p.table);
  await quiet(db.from("credential_invites").delete().eq("user_id", targetId), "credential_invites");
  if (oldEmail) {
    await quiet(db.from("credential_invites").delete().eq("email", oldEmail), "credential_invites by email");
    // An enquiry record with a payment stays for the accounts, without a name or phone.
    const crm: Res<{ email: string; paid_at: string | null } | null> = await db.from("crm_contacts").select("email, paid_at").eq("email", oldEmail).maybeSingle();
    if (crm.data && crm.data.paid_at) await quiet(db.from("crm_contacts").update({ name: null, phone: null, college: null }).eq("email", oldEmail), "crm_contacts");
    else if (crm.data) await quiet(db.from("crm_contacts").delete().eq("email", oldEmail), "crm_contacts");
  }
  // Certificates stay checkable by their number; the contact details on them go.
  await quiet(db.from("credentials").update({ recipient_email: null, recipient_phone: null }).eq("user_id", targetId), "credentials");
  // Their own deletion requests are answered, and the stored address goes with the rest.
  await quiet(db.from("app_deletion_requests").update({ status: "done", handled_at: at, handled_by: actor.id, email: null }).eq("user_id", targetId), "app_deletion_requests");

  // Logged without the email or name: the log must not keep what was deleted.
  await audit(db as never, { action: "person.account_deleted", targetType: "profile", targetId, details: { role: target!.role, rollNumber: target!.roll_number ?? null, fromRequest: opts.requestId ?? null }, actor: who(actor) });
  return { error: null };
}

/** Say no to an app deletion request (the account stays as it is). */
export async function declineDeletionRequest(db: RemovalDb, actor: Actor & { email?: string | null }, requestId: string, now = new Date()): Promise<Outcome> {
  if (actor.role !== "admin") return { error: "Only a Super Admin can do this." };
  const r: Res<{ id: string; user_id: string; status: string } | null> = await db.from("app_deletion_requests").select("id, user_id, status").eq("id", requestId).maybeSingle();
  if (r.error && tableMissing(r.error)) return { error: "Deletion requests are not set up yet." };
  if (!r.data) return { error: "That request could not be found." };
  if (r.data.status !== "open") return { error: "That request was already handled." };
  const u: Res = await db.from("app_deletion_requests").update({ status: "declined", handled_at: now.toISOString(), handled_by: actor.id }).eq("id", requestId);
  if (u.error) return { error: "Could not update the request." };
  await audit(db as never, { action: "person.deletion_declined", targetType: "app_deletion_request", targetId: requestId, details: { userId: r.data.user_id }, actor: who(actor) });
  return { error: null };
}

// ---------------------------------------------------------------- reading

export type RemovalPerson = {
  id: string;
  name: string;
  email: string | null;
  role: "admin" | "view_admin" | "student" | "alumni";
  rollNumber: string | null;
  /** "active" (has access), "locked" (a plain pause), "removed" (can be restored). Deleted accounts are not listed. */
  state: "active" | "locked" | "removed";
  note: string | null;
  removedAt: string | null;
  /** The word to type to delete. */
  confirmWord: string;
  isYou: boolean;
};

export type RemovalRequest = {
  id: string;
  userId: string;
  name: string;
  email: string | null;
  reason: string | null;
  status: DeletionRequestState;
  createdAt: string;
  handledAt: string | null;
  /** The account is already gone (deleted another way). */
  accountGone: boolean;
  confirmWord: string;
};

export type RemovalData = {
  people: RemovalPerson[];
  requests: RemovalRequest[];
  /** False until the deletion request table exists. */
  requestsReady: boolean;
  activeSupers: number;
};

type Row = Record<string, unknown>;
const ROLES = ["admin", "view_admin", "student", "alumni"] as const;

/** Everyone who can be removed (students and staff), plus the app's deletion requests. Read with the service role; callers check the admin. */
export async function loadRemovalData(db: RemovalDb, me: { id: string }): Promise<RemovalData> {
  let pr: Res<Row[] | null> = await db.from("profiles").select(PROFILE_COLS + ", removed_at, deleted_at").limit(10000);
  if (pr.error && columnMissing(pr.error)) pr = await db.from("profiles").select(PROFILE_COLS).limit(10000);
  if (pr.error) throw new Error(pr.error.message ?? "profiles read failed");
  const rows = (pr.data ?? []).filter((p) => !isHiddenAccount(p as { email?: string | null; is_test?: boolean | null }));
  const byId = new Map(rows.map((p) => [String(p.id), p]));

  const people: RemovalPerson[] = [];
  let supers = 0;
  for (const p of rows) {
    const state: Removal = removalOf(p as Target);
    if (state === "deleted") continue;
    const role = (ROLES as readonly string[]).includes(String(p.role)) ? (p.role as RemovalPerson["role"]) : "student";
    const locked = p.status === "blocked";
    if (role === "admin" && !locked) supers++;
    people.push({
      id: String(p.id),
      name: String(p.name ?? "").trim() || String(p.email ?? "").split("@")[0] || "No name",
      email: (p.email as string | null) ?? null,
      role,
      rollNumber: (p.roll_number as string | null) ?? null,
      state: state === "removed" ? "removed" : locked ? "locked" : "active",
      note: state === "removed" ? removalNote(p.block_reason as string | null) : null,
      removedAt: state === "removed" ? ((p.removed_at as string | null) ?? null) : null,
      confirmWord: confirmWord(p as Target),
      isYou: String(p.id) === me.id,
    });
  }
  people.sort((a, b) => a.name.localeCompare(b.name));

  const rq: Res<Row[] | null> = await db.from("app_deletion_requests").select("id, user_id, email, reason, status, created_at, handled_at").order("created_at", { ascending: false }).limit(500);
  const requestsReady = !(rq.error && tableMissing(rq.error));
  const requests: RemovalRequest[] = (rq.error ? [] : (rq.data ?? [])).map((r) => {
    const p = byId.get(String(r.user_id));
    const gone = !p || removalOf(p as Target) === "deleted";
    return {
      id: String(r.id),
      userId: String(r.user_id),
      name: gone ? DELETED_NAME : String(p!.name ?? "").trim() || String(p!.email ?? r.email ?? "").split("@")[0] || "No name",
      email: gone ? null : ((p!.email as string | null) ?? (r.email as string | null) ?? null),
      reason: (r.reason as string | null) ?? null,
      status: (["open", "done", "declined"].includes(String(r.status)) ? r.status : "open") as DeletionRequestState,
      createdAt: String(r.created_at ?? ""),
      handledAt: (r.handled_at as string | null) ?? null,
      accountGone: gone,
      confirmWord: gone ? "" : confirmWord(p as Target),
    };
  });
  return { people, requests, requestsReady, activeSupers: supers };
}

/** Ids of removed and deleted accounts, for hiding them from students' lists. */
export async function loadRemovedIdsFrom(db: RemovalDb): Promise<Set<string>> {
  const r: Res<Row[] | null> = await db.from("profiles").select("id, status, block_reason").eq("status", "blocked").limit(10000);
  return new Set((r.data ?? []).filter((p) => removalOf(p as Target) !== null).map((p) => String(p.id)));
}
