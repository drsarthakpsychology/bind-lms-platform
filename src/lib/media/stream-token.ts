import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Stream session tokens — the short-lived, viewer-bound grant the player uses
 * to fetch segments through the stream proxy.
 *
 * Unlike a raw storage signed URL, this token:
 *   - is bound to (user_id, lesson_id, course_id, expiry);
 *   - is HMAC-signed so it can't be forged;
 *   - expires in minutes (refreshed by the player), so sharing it is useless;
 *   - carries no storage key — the proxy resolves the object server-side.
 *
 * The secret is derived from SUPABASE_SERVICE_ROLE_KEY (or SESSION_SECRET if
 * set) so tokens are unreadable to anyone without server secrets.
 */

const TTL_MS = 5 * 60 * 1000; // 5 minutes

function secret(): Buffer {
  // NEVER fall back to a public value: the anon key ships in every client
  // bundle, so signing with it would make stream tokens forgeable by anyone.
  // SESSION_SECRET (strong, independent) wins; otherwise the service-role key.
  const key = process.env.SESSION_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error(
      "No stream-token secret configured. Set SESSION_SECRET or SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  return createHmac("sha256", "plms-stream-v1").update(key).digest();
}

export type StreamTokenPayload = {
  v: 1;
  uid: string;
  lid: string; // lesson id
  cid: string; // course id
  exp: number; // epoch ms
};

export function mintStreamToken(opts: {
  userId: string;
  lessonId: string;
  courseId: string;
  now?: number;
}): string {
  const now = opts.now ?? Date.now();
  const payload: StreamTokenPayload = {
    v: 1,
    uid: opts.userId,
    lid: opts.lessonId,
    cid: opts.courseId,
    exp: now + TTL_MS,
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifyStreamToken(
  token: string,
  now?: number,
): StreamTokenPayload | null {
  const t = now ?? Date.now();
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = createHmac("sha256", secret()).update(body).digest("base64url");
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as StreamTokenPayload;
    if (payload.v !== 1 || !payload.uid || !payload.lid || !payload.cid) return null;
    if (typeof payload.exp !== "number" || payload.exp <= t) return null;
    return payload;
  } catch {
    return null;
  }
}

export { TTL_MS };
