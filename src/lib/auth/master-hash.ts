import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

/** The stored form of the master password: never the password itself. */
export type MasterSetting = { algo: "scrypt"; salt: string; hash: string; enabled: boolean; updatedAt: string };

export const MASTER_MIN_LENGTH = 12;

export function masterProblem(pw: string): string | null {
  if (pw.length < MASTER_MIN_LENGTH) return `Use at least ${MASTER_MIN_LENGTH} characters.`;
  if (!/[a-zA-Z]/.test(pw) || !/[0-9]/.test(pw)) return "Mix letters and numbers.";
  if (/^(.)\1+$/.test(pw)) return "Too easy to guess.";
  return null;
}

export function hashMaster(pw: string): MasterSetting {
  const salt = randomBytes(16).toString("base64url");
  const hash = scryptSync(pw, salt, 64).toString("base64url");
  return { algo: "scrypt", salt, hash, enabled: true, updatedAt: new Date().toISOString() };
}

export function checkMaster(pw: string, s: MasterSetting | null | undefined): boolean {
  if (!s || !s.enabled || s.algo !== "scrypt" || !pw) return false;
  const want = Buffer.from(s.hash, "base64url");
  const got = scryptSync(pw, s.salt, want.length);
  return want.length === got.length && timingSafeEqual(want, got);
}
