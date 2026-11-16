import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * The changing attendance code. Each session has its own secret, made on the
 * server when the admin taps Show code. For each 30-second window:
 *
 *   token = HMAC-SHA256(secret, "<sessionId>:<window>")  (22 characters, base64url)
 *   code  = 6 characters from HMAC-SHA256(secret, "code:<sessionId>:<window>")
 *
 * The QR carries "vibha-att:1:<sessionId>:<window>:<token>". The server
 * accepts the current window and the one before it, so a photo of the QR
 * stops working within 60 seconds, and only for that session.
 */
export const WINDOW_MS = 30_000;
export const QR_PREFIX = "vibha-att:1:";
/** No 0/O, 1/I: easy to read off a screen and type. */
export const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const CODE_RE = /^[A-HJ-NP-Z2-9]{6}$/;

export function newSecret(): string {
  return randomBytes(32).toString("hex");
}

export function windowOf(now: number): number {
  return Math.floor(now / WINDOW_MS);
}

function mac(secret: string, text: string): Buffer {
  return createHmac("sha256", secret).update(text).digest();
}

export function tokenFor(secret: string, sessionId: string, window: number): string {
  return mac(secret, `${sessionId}:${window}`).toString("base64url").slice(0, 22);
}

export function codeFor(secret: string, sessionId: string, window: number): string {
  const b = mac(secret, `code:${sessionId}:${window}`);
  let out = "";
  for (let i = 0; i < 6; i++) out += CODE_ALPHABET[b[i]! & 31];
  return out;
}

export function qrText(sessionId: string, window: number, token: string): string {
  return `${QR_PREFIX}${sessionId}:${window}:${token}`;
}

/** What the admin's screen shows now. */
export function showCode(secret: string, sessionId: string, now: number): { qr: string; code: string; window: number; validUntil: string; refreshInMs: number } {
  const w = windowOf(now);
  const next = (w + 1) * WINDOW_MS;
  return { qr: qrText(sessionId, w, tokenFor(secret, sessionId, w)), code: codeFor(secret, sessionId, w), window: w, validUntil: new Date(next).toISOString(), refreshInMs: next - now };
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** The QR text split up, or null when it is not one of ours. Also takes the bare "<sessionId>:<window>:<token>". */
export function parseQr(text: string): { sessionId: string; window: number; token: string } | null {
  const t = text.trim();
  const body = t.startsWith(QR_PREFIX) ? t.slice(QR_PREFIX.length) : t;
  const parts = body.split(":");
  if (parts.length !== 3) return null;
  const [sessionId, w, token] = parts as [string, string, string];
  if (!UUID_RE.test(sessionId) || !/^\d{1,12}$/.test(w) || !/^[A-Za-z0-9_-]{22}$/.test(token)) return null;
  return { sessionId: sessionId.toLowerCase(), window: Number(w), token };
}

function same(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/** The window the token belongs to when it is the current or the previous one; null otherwise. */
export function verifyToken(secret: string, sessionId: string, token: string, now: number): number | null {
  const w = windowOf(now);
  for (const cand of [w, w - 1]) if (same(tokenFor(secret, sessionId, cand), token)) return cand;
  return null;
}

export function normalizeCode(code: string): string {
  return code.trim().toUpperCase().replace(/[\s-]/g, "");
}

export function verifyCode(secret: string, sessionId: string, code: string, now: number): number | null {
  const c = normalizeCode(code);
  if (!CODE_RE.test(c)) return null;
  const w = windowOf(now);
  for (const cand of [w, w - 1]) if (same(codeFor(secret, sessionId, cand), c)) return cand;
  return null;
}
