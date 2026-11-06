import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Server secret for game seeds and run tokens. Seeds derived from it can't be
 * worked out in the browser, so a shuffled board or a blitz run can't be
 * reverse-engineered from the page.
 */
function secret(): string {
  return process.env.GAMES_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "vibha-games-dev-secret";
}

export function secretSeed(...parts: (string | number)[]): number {
  return createHmac("sha256", secret()).update(parts.join("|")).digest().readUInt32BE(0);
}

/** Sign a small JSON payload: base64url(payload).base64url(hmac). */
export function sign(payload: object): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const mac = createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${mac}`;
}

export function verify<T>(token: string): T | null {
  if (typeof token !== "string" || token.length > 2000) return null;
  const [body, mac] = token.split(".");
  if (!body || !mac) return null;
  const want = createHmac("sha256", secret()).update(body).digest();
  let got: Buffer;
  try {
    got = Buffer.from(mac, "base64url");
  } catch {
    return null;
  }
  if (got.length !== want.length || !timingSafeEqual(got, want)) return null;
  try {
    return JSON.parse(Buffer.from(body, "base64url").toString()) as T;
  } catch {
    return null;
  }
}
