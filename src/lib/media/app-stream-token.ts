import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";

/**
 * Stream tokens for the mobile app's video player.
 *
 * The website's token (stream-token.ts) lives 5 minutes and the web player
 * swaps it during playback. A native HLS player cannot swap the token inside
 * the addresses it already holds, so the app's token lasts for the lecture
 * (see streamTtlSeconds) and is bound to more:
 *
 *   uid  the student,  lid  the lecture,  cid  its course,
 *   dev  a hash of the phone's id (X-App-Device-Id),
 *   bh   whether every request must carry that header,
 *   exp  expiry (epoch ms).
 *
 * Signed with its own key context ("plms-stream-app-v1"), so a web token is
 * never accepted as an app token and an app token is never accepted by the
 * website's verifyStreamToken. Same SESSION_SECRET, fails closed without it.
 * The stream proxy re-checks the account and the phone at most once a minute
 * while the token is in use (src/lib/media/app-viewer.ts).
 */

function secret(): Buffer {
  const key = process.env.SESSION_SECRET;
  if (!key) throw new Error("No stream-token secret configured. Set SESSION_SECRET.");
  return createHmac("sha256", "plms-stream-app-v1").update(key).digest();
}

export type AppStreamTokenPayload = {
  v: 1;
  k: "app";
  uid: string;
  lid: string;
  cid: string;
  dev: string;
  bh: boolean;
  exp: number;
};

/** The phone id is never put in the token as is. */
export function deviceHash(deviceId: string): string {
  return createHash("sha256").update(`plms-app-device:${deviceId}`).digest("base64url").slice(0, 22);
}

/** Lecture length x factor + margin, between the floor and the ceiling. Unknown length: the floor plus an hour. */
export function streamTtlSeconds(durationSeconds: number | null, rule: { factor: number; marginSeconds: number; minSeconds: number; maxSeconds: number }): number {
  const base = durationSeconds && durationSeconds > 0 ? durationSeconds * rule.factor + rule.marginSeconds : rule.minSeconds + 3600;
  return Math.round(Math.min(rule.maxSeconds, Math.max(rule.minSeconds, base)));
}

export function mintAppStreamToken(opts: { userId: string; lessonId: string; courseId: string; deviceId: string; bindHeader: boolean; ttlSeconds: number; now?: number }): { token: string; exp: number } {
  const now = opts.now ?? Date.now();
  const payload: AppStreamTokenPayload = {
    v: 1,
    k: "app",
    uid: opts.userId,
    lid: opts.lessonId,
    cid: opts.courseId,
    dev: deviceHash(opts.deviceId),
    bh: opts.bindHeader,
    exp: now + opts.ttlSeconds * 1000,
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", secret()).update(body).digest("base64url");
  return { token: `a.${body}.${sig}`, exp: payload.exp };
}

/** Cheap shape test so the proxy knows which verifier to use. */
export function looksLikeAppToken(token: string): boolean {
  return token.startsWith("a.");
}

export function verifyAppStreamToken(token: string, now?: number): AppStreamTokenPayload | null {
  if (!looksLikeAppToken(token)) return null;
  const rest = token.slice(2);
  const dot = rest.lastIndexOf(".");
  if (dot <= 0) return null;
  const body = rest.slice(0, dot);
  const sig = rest.slice(dot + 1);
  let expected: string;
  try {
    expected = createHmac("sha256", secret()).update(body).digest("base64url");
  } catch {
    return null;
  }
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const p = JSON.parse(Buffer.from(body, "base64url").toString()) as AppStreamTokenPayload;
    if (p.v !== 1 || p.k !== "app" || !p.uid || !p.lid || !p.cid || !p.dev) return null;
    if (typeof p.exp !== "number" || p.exp <= (now ?? Date.now())) return null;
    return p;
  } catch {
    return null;
  }
}
