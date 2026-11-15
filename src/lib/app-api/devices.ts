import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import { APP_RULES } from "./config";
import type { DeviceInfo, DeviceState } from "./contract";
import { countRecentChanges, DEVICE_ID_RE, isExempt, nextChangeAt, type ChangeRow } from "./device-rules";

/**
 * The app's phones (table app_devices) and the one-phone rule.
 *
 * Read and written with the service role only: students can read their own
 * rows (row level security) but never write them.
 *
 * Before the owner runs supabase/migrations_pending/2026_11_15_app_devices.sql
 * the tables do not exist. Every function here then answers "not enforced":
 * sign-in works, nothing is recorded, and no phone is ever signed out.
 */

type Admin = ReturnType<typeof createAdminClient>;

export type DeviceRow = {
  id: string;
  user_id: string;
  device_id: string;
  name: string | null;
  platform: string | null;
  push_token: string | null;
  active: boolean;
  activated_at: string | null;
  last_seen_at: string | null;
};

const COLS = "id, user_id, device_id, name, platform, push_token, active, activated_at, last_seen_at";

/** Postgres "no such table" or PostgREST "not in the schema cache". */
export function tableMissing(error: { code?: string; message?: string } | null | undefined): boolean {
  if (!error) return false;
  const msg = error.message ?? "";
  return error.code === "42P01" || error.code === "PGRST205" || (/app_device|app_notification_prefs/.test(msg) && /does not exist|schema cache/i.test(msg));
}

function admin(): Admin | null {
  try {
    return process.env.SUPABASE_SERVICE_ROLE_KEY ? createAdminClient() : null;
  } catch {
    return null;
  }
}

const UNENFORCED: DeviceState = { enforced: false, current: null, changesUsed: 0, limit: null, nextChangeAt: null };

async function loadRows(db: Admin, userId: string): Promise<{ rows: DeviceRow[]; ready: boolean }> {
  const { data, error } = await db.from("app_devices").select(COLS).eq("user_id", userId).order("activated_at", { ascending: false }).limit(50);
  if (error) {
    if (!tableMissing(error)) console.error("app_devices read failed:", error.code, error.message);
    return { rows: [], ready: false };
  }
  return { rows: (data ?? []) as DeviceRow[], ready: true };
}

async function loadChanges(db: Admin, userId: string, now: number): Promise<ChangeRow[]> {
  const since = new Date(now - APP_RULES.deviceWindowDays * 86_400_000).toISOString();
  const { data, error } = await db.from("app_device_changes").select("kind, created_at").eq("user_id", userId).gte("created_at", since).order("created_at", { ascending: true }).limit(200);
  if (error) return [];
  return (data ?? []) as ChangeRow[];
}

function stateFrom(rows: DeviceRow[], deviceId: string | null, role: string, changes: ChangeRow[], now: number): DeviceState {
  const exempt = isExempt(role);
  const mine = rows.find((r) => r.device_id === deviceId && r.active) ?? null;
  const used = countRecentChanges(changes, now);
  return {
    enforced: true,
    current: mine
      ? { id: mine.device_id, name: mine.name ?? "This phone", platform: mine.platform === "ios" ? "ios" : "android", lastSeenAt: mine.last_seen_at, pushEnabled: Boolean(mine.push_token) }
      : null,
    changesUsed: used,
    limit: exempt ? null : APP_RULES.deviceChangesPerMonth,
    nextChangeAt: exempt ? null : nextChangeAt(changes, now),
  };
}

export type RegisterResult = { ok: true; state: DeviceState } | { ok: false; code: "device_limit"; nextChangeAt: string | null };

/**
 * Make this phone the student's active phone (called at sign-in).
 * The same phone again: free. The first phone ever: free. Another phone: one
 * of the allowed changes; over the allowance it is refused. Admins: any number
 * of phones, none signed out.
 */
export async function registerDevice(input: { userId: string; role: string; device: DeviceInfo; now?: number }): Promise<RegisterResult> {
  const db = admin();
  if (!db) return { ok: true, state: UNENFORCED };
  const now = input.now ?? Date.now();
  const { rows, ready } = await loadRows(db, input.userId);
  if (!ready) return { ok: true, state: UNENFORCED };

  const exempt = isExempt(input.role);
  const iso = new Date(now).toISOString();
  const d = input.device;
  // The phone they used last (active, or signed out of): coming back to it is not a change.
  const last = rows[0] ?? null;
  const isChange = !exempt && last !== null && last.device_id !== d.id;
  let changes = await loadChanges(db, input.userId, now);

  if (isChange) {
    if (countRecentChanges(changes, now) >= APP_RULES.deviceChangesPerMonth) {
      return { ok: false, code: "device_limit", nextChangeAt: nextChangeAt(changes, now) };
    }
    const { error } = await db.from("app_device_changes").insert({ user_id: input.userId, kind: "switch", from_device_id: last.device_id, to_device_id: d.id });
    if (error) console.error("app_device_changes insert failed:", error.code, error.message);
    changes = [...changes, { kind: "switch", created_at: iso }];
  }
  if (!exempt && APP_RULES.onePhoneAtATime) {
    const others = rows.filter((r) => r.active && r.device_id !== d.id).map((r) => r.id);
    if (others.length) await db.from("app_devices").update({ active: false, replaced_at: iso, push_token: null }).in("id", others);
  }
  const { data, error } = await db
    .from("app_devices")
    .upsert(
      {
        user_id: input.userId,
        device_id: d.id,
        name: d.name.slice(0, 80),
        platform: d.platform,
        app_version: d.appVersion?.slice(0, 20) ?? null,
        os_version: d.osVersion?.slice(0, 40) ?? null,
        active: true,
        activated_at: iso,
        last_seen_at: iso,
        replaced_at: null,
        signed_out_at: null,
      },
      { onConflict: "user_id,device_id" },
    )
    .select(COLS)
    .maybeSingle();
  if (error || !data) {
    console.error("app_devices upsert failed:", error?.code, error?.message);
    return { ok: true, state: UNENFORCED };
  }
  forget(input.userId);
  const merged = [data as DeviceRow, ...rows.filter((r) => r.device_id !== d.id).map((r) => (exempt ? r : { ...r, active: false }))];
  return { ok: true, state: stateFrom(merged, d.id, input.role, changes, now) };
}

// Positive checks are remembered for a short while per server, so a busy
// screen does not read app_devices on every request. A replaced phone is
// noticed within this window.
const CHECK_TTL_MS = 20_000;
const SEEN_EVERY_MS = 10 * 60_000;
const okCache = new Map<string, number>();
const seenAt = new Map<string, number>();

function forget(userId: string) {
  for (const k of okCache.keys()) if (k.startsWith(`${userId}:`)) okCache.delete(k);
}

/** For tests. */
export function clearDeviceCache() {
  okCache.clear();
  seenAt.clear();
}

export type DeviceCheck = "ok" | "replaced" | "unenforced";

/**
 * The one-phone rule on a student's phone rows: the row this phone matches
 * when it is still the signed-in one, else null. Two phones marked active
 * (two sign-ins at the same moment): the later one wins. Admins are exempt.
 */
export function activePhone(rows: DeviceRow[], isThis: (r: DeviceRow) => boolean, role: string): DeviceRow | null {
  const mine = rows.find(isThis) ?? null;
  if (!mine || !mine.active) return null;
  if (!isExempt(role) && APP_RULES.onePhoneAtATime) {
    const newest = rows.filter((r) => r.active).sort((a, b) => String(b.activated_at ?? "").localeCompare(String(a.activated_at ?? "")))[0];
    if (newest && !isThis(newest)) return null;
  }
  return mine;
}

/**
 * For the video proxy: is the phone whose id hashes to `devHash` still this
 * student's signed-in phone? Same rule as checkDevice. "unenforced" before
 * the app_devices database step.
 */
export async function phoneStillActive(userId: string, role: string, matches: (deviceId: string) => boolean): Promise<DeviceCheck> {
  const db = admin();
  if (!db) return "unenforced";
  const { rows, ready } = await loadRows(db, userId);
  if (!ready || !rows.length) return "unenforced";
  return activePhone(rows, (r) => matches(r.device_id), role) ? "ok" : "replaced";
}

/**
 * Is this phone still the one signed in? Run on every signed-in app request.
 * "replaced" means another phone took over (or this one signed out).
 */
export async function checkDevice(input: { userId: string; role: string; deviceId: string; platform?: "android" | "ios"; now?: number; fresh?: boolean }): Promise<DeviceCheck> {
  const now = input.now ?? Date.now();
  const key = `${input.userId}:${input.deviceId}`;
  if (!input.fresh && (okCache.get(key) ?? 0) > now) return "ok";
  const db = admin();
  if (!db) return "unenforced";
  const { rows, ready } = await loadRows(db, input.userId);
  if (!ready) return "unenforced";

  if (!rows.length) {
    // The tables were added while this phone was already signed in: adopt it.
    await registerDevice({ userId: input.userId, role: input.role, device: { id: input.deviceId, name: "This phone", platform: input.platform ?? "android" }, now });
    return "ok";
  }
  const mine = activePhone(rows, (r) => r.device_id === input.deviceId, input.role);
  if (!mine) return "replaced";
  okCache.set(key, now + CHECK_TTL_MS);
  if (okCache.size > 20_000) for (const [k, until] of okCache) if (until <= now) okCache.delete(k);
  if ((seenAt.get(key) ?? 0) + SEEN_EVERY_MS < now) {
    seenAt.set(key, now);
    void db.from("app_devices").update({ last_seen_at: new Date(now).toISOString() }).eq("id", mine.id).then(() => undefined, () => undefined);
  }
  return "ok";
}

export async function deviceState(input: { userId: string; role: string; deviceId: string | null; now?: number }): Promise<DeviceState> {
  const db = admin();
  if (!db) return UNENFORCED;
  const now = input.now ?? Date.now();
  const { rows, ready } = await loadRows(db, input.userId);
  if (!ready) return UNENFORCED;
  return stateFrom(rows, input.deviceId, input.role, await loadChanges(db, input.userId, now), now);
}

/** Rename the phone, set or clear its push token. */
export async function updateDevice(input: { userId: string; role: string; deviceId: string; name?: string; pushToken?: string | null; appVersion?: string; osVersion?: string }): Promise<DeviceState> {
  const db = admin();
  if (!db) return UNENFORCED;
  const patch: Record<string, unknown> = { last_seen_at: new Date().toISOString() };
  if (input.name !== undefined) patch.name = input.name.slice(0, 80);
  if (input.appVersion !== undefined) patch.app_version = input.appVersion.slice(0, 20);
  if (input.osVersion !== undefined) patch.os_version = input.osVersion.slice(0, 40);
  if (input.pushToken !== undefined) {
    patch.push_token = input.pushToken;
    patch.push_token_at = new Date().toISOString();
    // One phone per push token: a token that moved accounts stops reaching the old one.
    if (input.pushToken) await db.from("app_devices").update({ push_token: null }).eq("push_token", input.pushToken).neq("user_id", input.userId);
  }
  const { error } = await db.from("app_devices").update(patch).eq("user_id", input.userId).eq("device_id", input.deviceId);
  if (error && !tableMissing(error)) console.error("app_devices update failed:", error.code, error.message);
  return deviceState({ userId: input.userId, role: input.role, deviceId: input.deviceId });
}

/** Sign-out on this phone: it stops being active and stops getting push. Not a phone change. */
export async function signOutDevice(userId: string, deviceId: string): Promise<void> {
  const db = admin();
  if (!db) return;
  forget(userId);
  const { error } = await db.from("app_devices").update({ active: false, signed_out_at: new Date().toISOString(), push_token: null }).eq("user_id", userId).eq("device_id", deviceId);
  if (error && !tableMissing(error)) console.error("app_devices sign-out failed:", error.code, error.message);
}

/** Admin override: the student may change phone again now (their used changes are cleared). */
export async function allowDeviceChange(userId: string, adminId: string): Promise<{ ok: boolean; ready: boolean }> {
  const db = admin();
  if (!db) return { ok: false, ready: false };
  const { error } = await db.from("app_device_changes").insert({ user_id: userId, kind: "admin_reset", by_user_id: adminId });
  if (error) return { ok: false, ready: !tableMissing(error) };
  return { ok: true, ready: true };
}

export type PushTarget = { userId: string; token: string };

/** The Expo push tokens of these students' active phones. Empty before the database step. */
export async function activePushTargets(userIds: string[]): Promise<PushTarget[]> {
  const db = admin();
  if (!db || !userIds.length) return [];
  const out: PushTarget[] = [];
  for (let i = 0; i < userIds.length; i += 500) {
    const { data, error } = await db.from("app_devices").select("user_id, push_token").in("user_id", userIds.slice(i, i + 500)).eq("active", true).not("push_token", "is", null).limit(5000);
    if (error) return out;
    for (const r of data ?? []) if (r.push_token) out.push({ userId: r.user_id as string, token: r.push_token as string });
  }
  return out;
}

/** A push token the Expo service says is dead: stop using it. */
export async function dropPushTokens(tokens: string[]): Promise<void> {
  const db = admin();
  if (!db || !tokens.length) return;
  await db.from("app_devices").update({ push_token: null }).in("push_token", tokens.slice(0, 500)).then(() => undefined, () => undefined);
}

export { DEVICE_ID_RE };
