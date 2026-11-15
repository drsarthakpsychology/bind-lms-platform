import "server-only";
import type { Profile } from "@/lib/auth/session";
import { evaluate, type ApiGate } from "@/lib/auth/api-guard";
import { createAdminClient } from "@/lib/supabase/server";
import { tooOld, minSupportedVersion, storeUrls } from "./config";
import { type AppRequestContext } from "./context";
import { checkDevice, DEVICE_ID_RE } from "./devices";
import { ApiFail } from "./respond";
import { createStatelessAuthClient } from "./supabase";
import { accountProblem, bearerToken, jwtExpired } from "./guard-rules";

export type { ApiGate } from "@/lib/auth/api-guard";

export type AppUser = {
  profile: Profile;
  /** Display name (profiles.name), when set. */
  name: string | null;
  accessToken: string;
  deviceId: string;
  platform: "android" | "ios";
  appVersion: string | null;
  context: AppRequestContext;
};

const PROFILE_COLS = "id, email, role, scope, status, block_reason, active_session_token, expires_at, mobile_number, mobile_prompt_skipped_at, roll_number";

type ProfileRow = Record<string, unknown> & { id: string };

/** The profile row for a verified user id, read with the service role (the id comes from the verified token, never from the app). */
export async function loadProfileRow(userId: string): Promise<{ profile: Profile; name: string | null } | null> {
  const db = createAdminClient();
  // `name` is read separately-tolerant: an older database without the column still signs in.
  let res = await db.from("profiles").select(`${PROFILE_COLS}, name`).eq("id", userId).maybeSingle();
  if (res.error) res = (await db.from("profiles").select(PROFILE_COLS).eq("id", userId).maybeSingle()) as typeof res;
  const row = res.data as ProfileRow | null;
  if (!row) return null;
  const profile = {
    ...(row as unknown as Profile),
    scope: row.scope === "lectures_only" ? "lectures_only" : "full",
    status: row.status === "blocked" ? "blocked" : "active",
    block_reason: (row.block_reason as string | null) ?? null,
  } as Profile;
  const name = typeof row.name === "string" && row.name.trim() ? row.name.trim() : null;
  return { profile, name };
}

/** Refuse app versions below the minimum (426). A missing header passes. */
export function assertVersion(req: Request): void {
  if (tooOld(req.headers.get("x-app-version"))) {
    throw new ApiFail("upgrade_required", undefined, { minVersion: minSupportedVersion(), storeUrl: storeUrls() });
  }
}

export function platformOf(req: Request): "android" | "ios" {
  return (req.headers.get("x-app-platform") ?? "").toLowerCase() === "ios" ? "ios" : "android";
}

export function deviceIdOf(req: Request): string {
  const id = (req.headers.get("x-app-device-id") ?? "").trim();
  if (!DEVICE_ID_RE.test(id)) throw new ApiFail("device_required");
  return id;
}

/**
 * The account and phone checks shared by every signed-in route and by
 * /auth/refresh: paused, ended, and "is this still the signed-in phone".
 */
export async function assertAccountAndDevice(profile: Profile, deviceId: string, platform: "android" | "ios", opts: { fresh?: boolean } = {}): Promise<void> {
  const problem = accountProblem(profile, Date.now());
  if (problem) throw new ApiFail(problem);
  const device = await checkDevice({ userId: profile.id, role: profile.role, deviceId, platform, fresh: opts.fresh });
  if (device === "replaced") throw new ApiFail("device_replaced");
}

/**
 * The bearer-token guard for the mobile app: the same rules as the website
 * session (getSession + requireStudentApi), for a request that carries
 * `Authorization: Bearer <access token>` instead of cookies.
 *
 *  1. The token is a real, unexpired Supabase access token (401 otherwise;
 *     `token_expired` tells the app to refresh and repeat).
 *  2. The account is not paused (403 account_blocked) and has not ended
 *     (403 account_expired; alumni never end).
 *  3. This phone is still the signed-in one (401 device_replaced). The
 *     website's one-browser cookie is not involved: app and browser are
 *     separate sessions.
 *  4. The gates: lectures-only scope, sections switched off for this student
 *     and feature flags, decided by the website's own decideApiAccess.
 *
 * Throws ApiFail; the route wrapper turns it into the JSON error.
 */
export async function requireAppUser(req: Request, gates: ApiGate | readonly ApiGate[] = []): Promise<AppUser> {
  assertVersion(req);
  const token = bearerToken(req.headers.get("authorization"));
  if (!token) throw new ApiFail("unauthenticated");
  if (jwtExpired(token, Date.now())) throw new ApiFail("token_expired");
  const deviceId = deviceIdOf(req);

  const { data, error } = await createStatelessAuthClient().auth.getUser(token);
  const user = data?.user;
  if (error || !user) {
    throw new ApiFail(/expired/i.test(error?.message ?? "") ? "token_expired" : "unauthenticated");
  }

  const loaded = await loadProfileRow(user.id);
  // Auth user without a profile row: fail closed, as the website does.
  if (!loaded) throw new ApiFail("unauthenticated");
  const { profile, name } = loaded;
  const platform = platformOf(req);
  await assertAccountAndDevice(profile, deviceId, platform);

  const list = Array.isArray(gates) ? (gates as readonly ApiGate[]) : [gates as ApiGate];
  const decision = await evaluate(profile, list);
  if (!decision.ok) throw new ApiFail(decision.reason === "account_blocked" ? "account_blocked" : decision.reason);

  const context: AppRequestContext = {
    accessToken: token,
    user: user as unknown as AppRequestContext["user"],
    session: { status: "ok", profile },
    profile,
    deviceId,
  };
  return { profile, name, accessToken: token, deviceId, platform, appVersion: req.headers.get("x-app-version"), context };
}
