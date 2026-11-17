import "server-only";
import type { Profile } from "@/lib/auth/session";
import { loadProfileRow } from "@/lib/app-api/guard";
import { accountProblem } from "@/lib/app-api/guard-rules";
import { phoneStillActive } from "@/lib/app-api/devices";
import { APP_RULES } from "@/lib/app-api/config";
import { deviceHash, type AppStreamTokenPayload } from "./app-stream-token";

/**
 * The app branch of the stream proxy (GET /api/media/stream/...): who is
 * watching with an app stream token. Replaces the website's cookie session
 * check for that one kind of token; everything after it (enrolment verdict,
 * per-viewer AES key, playlist rewrite, chunk encryption) is the website's.
 *
 *  - The token must name this lecture (checked by the caller) and, when it
 *    was minted with `bh`, every request must carry the same phone id in
 *    X-App-Device-Id.
 *  - At most once a minute per (student, phone): the account must not be
 *    paused or ended, and the phone must still be the signed-in one. A
 *    paused student or a replaced phone stops within a minute.
 */
export type AppViewer = { ok: true; profile: Pick<Profile, "id" | "role" | "scope"> } | { ok: false; status: 401 | 403 | 503; error: string };

const cache = new Map<string, { viewer: Pick<Profile, "id" | "role" | "scope">; until: number }>();

/** For tests. */
export function clearAppViewerCache() {
  cache.clear();
}

export async function checkAppStreamViewer(payload: AppStreamTokenPayload, deviceHeader: string | null, now = Date.now()): Promise<AppViewer> {
  const header = (deviceHeader ?? "").trim();
  if (header && deviceHash(header) !== payload.dev) return { ok: false, status: 401, error: "This video address is for another phone." };
  if (payload.bh && !header) return { ok: false, status: 401, error: "Missing device id." };

  const key = `${payload.uid}:${payload.dev}`;
  const hit = cache.get(key);
  if (hit && hit.until > now) return { ok: true, profile: hit.viewer };

  // A database blip refuses this one request (the player asks again), never "not signed in".
  const loaded = await loadProfileRow(payload.uid).catch(() => undefined);
  if (loaded === undefined) return { ok: false, status: 503, error: "Try again in a moment." };
  if (!loaded) return { ok: false, status: 401, error: "Not signed in." };
  const { profile } = loaded;
  const problem = accountProblem(profile, now);
  if (problem) return { ok: false, status: 403, error: problem === "account_blocked" ? "Your account is paused." : "This account's access has ended." };

  const phone = await phoneStillActive(profile.id, profile.role, (id) => deviceHash(id) === payload.dev);
  if (phone === "replaced") return { ok: false, status: 401, error: "Signed out: opened on another device." };

  const viewer = { id: profile.id, role: profile.role, scope: profile.scope };
  cache.set(key, { viewer, until: now + APP_RULES.streamRecheckSeconds * 1000 });
  if (cache.size > 20_000) for (const [k, v] of cache) if (v.until <= now) cache.delete(k);
  return { ok: true, profile: viewer };
}
