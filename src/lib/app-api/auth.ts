import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import type { AuthTokens, DeviceInfo, RefreshResult, SignInResult } from "./contract";
import { registerDevice, signOutDevice } from "./devices";
import { assertAccountAndDevice, loadProfileRow } from "./guard";
import { accountProblem, authFailureCode } from "./guard-rules";
import { buildMe } from "./me";
import { ApiFail } from "./respond";
import { createStatelessAuthClient } from "./supabase";
import type { Profile } from "@/lib/auth/session";
import { testStudentSession } from "@/lib/test-mode/server";

/**
 * Sign-in, refresh and sign-out for the mobile app. The same Supabase
 * accounts and the same account rules as the website's login action
 * (src/lib/auth/actions.ts), but tokens are handed to the app instead of
 * cookies being set, and the website's one-browser token is left alone: the
 * app and one browser may be signed in together. The app's own one-phone rule
 * lives in devices.ts.
 *
 * Not offered here: the admin master password (website only).
 */

type SessionLike = { access_token: string; refresh_token: string; expires_in?: number; expires_at?: number };

function tokensOf(s: SessionLike, now = Date.now()): AuthTokens {
  const expiresIn = typeof s.expires_in === "number" ? s.expires_in : 3600;
  const at = typeof s.expires_at === "number" ? s.expires_at * 1000 : now + expiresIn * 1000;
  return { accessToken: s.access_token, refreshToken: s.refresh_token, expiresIn, expiresAt: new Date(at).toISOString() };
}

/** End one Supabase session (the one this access token belongs to). Never throws. */
async function revoke(accessToken: string): Promise<void> {
  try {
    await createAdminClient().auth.admin.signOut(accessToken, "local");
  } catch (e) {
    console.warn("app sign-out: could not revoke the session:", e instanceof Error ? e.message : e);
  }
}

export async function appSignIn(input: { email: string; password: string; device: DeviceInfo }): Promise<SignInResult> {
  const { data, error } = await createStatelessAuthClient().auth.signInWithPassword({ email: input.email, password: input.password });
  if (error || !data.user || !data.session) throw new ApiFail("invalid_credentials");
  const session = data.session as SessionLike;

  const loaded = await loadProfileRow(data.user.id);
  if (!loaded) {
    await revoke(session.access_token);
    throw new ApiFail("unauthenticated");
  }
  const { profile, name } = loaded;
  // Paused or ended: no tokens are handed out.
  const problem = accountProblem(profile, Date.now());
  if (problem) {
    await revoke(session.access_token);
    throw new ApiFail(problem);
  }

  const registered = await registerDevice({ userId: profile.id, role: profile.role, email: profile.email, device: input.device });
  if (!registered.ok) {
    await revoke(session.access_token);
    throw new ApiFail("device_limit", undefined, { nextChangeAt: registered.nextChangeAt });
  }
  return { tokens: tokensOf(session), me: await buildMe(profile, name), device: registered.state };
}

export async function appRefresh(input: { refreshToken: string; deviceId: string; platform: "android" | "ios" }): Promise<RefreshResult> {
  const { data, error } = await createStatelessAuthClient().auth.refreshSession({ refresh_token: input.refreshToken });
  if (error || !data.user || !data.session) {
    // Auth down or busy: the app keeps its sign-in and tries again. Only a refused token signs out.
    const code = error ? authFailureCode(error) : "unauthenticated";
    throw code === "unauthenticated" || code === "token_expired" ? new ApiFail("unauthenticated", "Please sign in again.") : new ApiFail(code);
  }
  const session = data.session as SessionLike;
  const loaded = await loadProfileRow(data.user.id);
  try {
    if (!loaded) throw new ApiFail("unauthenticated");
    // Read fresh (not from the short cache): a refresh is the moment to notice a replaced phone.
    await assertAccountAndDevice(loaded.profile, input.deviceId, input.platform, { fresh: true });
  } catch (e) {
    // A paused account keeps its session (it lifts by itself), and so does a database blip
    // (the app asks again in a moment and gets this same session back); anything else ends it.
    if (!(e instanceof ApiFail && (e.code === "account_blocked" || e.code === "server_error"))) await revoke(session.access_token);
    throw e;
  }
  return { tokens: tokensOf(session) };
}

export async function appSignOut(input: { userId: string; accessToken: string; deviceId: string }): Promise<void> {
  await signOutDevice(input.userId, input.deviceId);
  await revoke(input.accessToken);
}

/**
 * Test mode: sign this phone in as the admin's hidden test student. No
 * password: the server makes and uses a one-time sign-in link. The admin's own
 * tokens stay on the phone (the app keeps them to come back). The phone is
 * registered without the one-phone limit (it is the admin's phone).
 */
export async function appTestStudentSignIn(admin: Profile, device: DeviceInfo): Promise<SignInResult> {
  const r = await testStudentSession(admin);
  if (!r.ok) throw new ApiFail("forbidden", r.error);
  const loaded = await loadProfileRow(r.testUserId);
  if (!loaded) {
    await revoke(r.session.access_token);
    throw new ApiFail("unauthenticated");
  }
  const registered = await registerDevice({ userId: r.testUserId, role: "admin", email: loaded.profile.email, device });
  return { tokens: tokensOf(r.session), me: await buildMe(loaded.profile, loaded.name), device: registered.ok ? registered.state : { enforced: false, current: null, changesUsed: 0, limit: null, nextChangeAt: null } };
}
