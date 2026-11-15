import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

/**
 * Support keys: keys the Super Admin creates on System, Support key, to sign
 * in to a STUDENT account and help them (see master-login.ts). Several can
 * live at once (one per helper, or one per device), each with a name.
 *
 * Only a scrypt hash and the last four characters are stored. The full key is
 * shown once, when it is made, and never again. A key is never edited:
 * rotating revokes it and makes a new one with the same name.
 */
export type SupportKey = {
  id: string;
  label: string;
  algo: "scrypt";
  salt: string;
  hash: string;
  /** Last four characters, so a key can be recognised without showing it. */
  last4: string;
  createdAt: string;
  createdBy: string | null;
  createdByEmail: string | null;
  revokedAt: string | null;
  revokedByEmail?: string | null;
  lastUsedAt: string | null;
};

/** What the screen may see: no salt, no hash. */
export type SupportKeyView = Pick<SupportKey, "id" | "label" | "last4" | "createdAt" | "createdByEmail" | "revokedAt" | "revokedByEmail" | "lastUsedAt">;

export const KEY_PREFIX = "vibha_sk_";
export const LABEL_MAX = 60;

export function labelProblem(label: string): string | null {
  const l = label.trim();
  if (!l) return "Give the key a name, for example who uses it.";
  if (l.length > LABEL_MAX) return `Keep the name under ${LABEL_MAX} characters.`;
  return null;
}

/** A new random key (shown once) and the record that is stored. */
export function makeSupportKey(label: string, by: { id: string | null; email: string | null }, now = new Date()): { plain: string; record: SupportKey } {
  const plain = KEY_PREFIX + randomBytes(18).toString("base64url");
  const salt = randomBytes(16).toString("base64url");
  const hash = scryptSync(plain, salt, 64).toString("base64url");
  return {
    plain,
    record: {
      id: randomBytes(8).toString("hex"),
      label: label.trim().slice(0, LABEL_MAX),
      algo: "scrypt",
      salt,
      hash,
      last4: plain.slice(-4),
      createdAt: now.toISOString(),
      createdBy: by.id,
      createdByEmail: by.email,
      revokedAt: null,
      lastUsedAt: null,
    },
  };
}

function matches(pw: string, k: SupportKey): boolean {
  if (k.revokedAt || k.algo !== "scrypt" || !pw) return false;
  const want = Buffer.from(k.hash, "base64url");
  const got = scryptSync(pw, k.salt, want.length);
  return want.length === got.length && timingSafeEqual(want, got);
}

/** The live key this password matches, or null. Only keys that look like ours are hashed (cheap refusal otherwise). */
export function findSupportKey(pw: string, keys: SupportKey[] | null | undefined): SupportKey | null {
  if (!pw || !pw.startsWith(KEY_PREFIX) || !keys?.length) return null;
  return keys.find((k) => matches(pw, k)) ?? null;
}

/** Stored list from the settings row (tolerates a missing or odd value). */
export function parseSupportKeys(value: unknown): SupportKey[] {
  const list = (value as { keys?: unknown } | null)?.keys;
  return Array.isArray(list) ? (list.filter((k) => k && typeof k === "object" && typeof (k as SupportKey).hash === "string") as SupportKey[]) : [];
}

export function toView(k: SupportKey): SupportKeyView {
  return { id: k.id, label: k.label, last4: k.last4, createdAt: k.createdAt, createdByEmail: k.createdByEmail, revokedAt: k.revokedAt, revokedByEmail: k.revokedByEmail ?? null, lastUsedAt: k.lastUsedAt };
}

/** Live keys first (newest first), then revoked ones. */
export function sortKeys(keys: SupportKeyView[]): SupportKeyView[] {
  return [...keys].sort((a, b) => Number(Boolean(a.revokedAt)) - Number(Boolean(b.revokedAt)) || b.createdAt.localeCompare(a.createdAt));
}
