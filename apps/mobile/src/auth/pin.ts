import type { KeyValue } from "@/lib/storage";

/**
 * The 4-digit PIN that opens the app.
 *
 * The PIN never leaves the phone and is never stored as typed: the keystore
 * holds a random salt and a hash of salt + PIN. Wrong tries are counted in
 * the keystore too, so closing the app does not reset them. After
 * `maxTries` wrong tries the caller signs the account out.
 */

export type Hasher = (text: string) => Promise<string>;
export type PinRecord = { salt: string; hash: string; tries: number };

const KEY = "vibha.pin.v1";

export function isValidPin(pin: string, length = 4): boolean {
  return new RegExp(`^\\d{${length}}$`).test(pin);
}

/** PINs that are too easy to guess over a shoulder: 0000, 1111, 1234, 4321... */
export function isWeakPin(pin: string): boolean {
  if (/^(\d)\1+$/.test(pin)) return true;
  const digits = pin.split("").map(Number);
  const up = digits.every((d, i) => i === 0 || d === (digits[i - 1] ?? 0) + 1);
  const down = digits.every((d, i) => i === 0 || d === (digits[i - 1] ?? 0) - 1);
  return up || down;
}

export type VerifyResult = { ok: true } | { ok: false; triesLeft: number; lockedOut: boolean };

export function createPinVault(deps: { store: KeyValue; hash: Hasher; randomSalt: () => string; maxTries: number }) {
  async function read(): Promise<PinRecord | null> {
    const raw = await deps.store.get(KEY);
    if (!raw) return null;
    try {
      const r = JSON.parse(raw) as PinRecord;
      return typeof r.salt === "string" && typeof r.hash === "string" ? { ...r, tries: Number(r.tries) || 0 } : null;
    } catch {
      return null;
    }
  }
  return {
    async has(): Promise<boolean> {
      return (await read()) !== null;
    },
    async set(pin: string): Promise<void> {
      if (!isValidPin(pin)) throw new Error("PIN must be 4 digits");
      const salt = deps.randomSalt();
      await deps.store.set(KEY, JSON.stringify({ salt, hash: await deps.hash(`${salt}:${pin}`), tries: 0 } satisfies PinRecord));
    },
    async verify(pin: string): Promise<VerifyResult> {
      const rec = await read();
      if (!rec) return { ok: false, triesLeft: 0, lockedOut: true };
      if (rec.tries >= deps.maxTries) return { ok: false, triesLeft: 0, lockedOut: true };
      if ((await deps.hash(`${rec.salt}:${pin}`)) === rec.hash) {
        if (rec.tries) await deps.store.set(KEY, JSON.stringify({ ...rec, tries: 0 }));
        return { ok: true };
      }
      const tries = rec.tries + 1;
      await deps.store.set(KEY, JSON.stringify({ ...rec, tries }));
      return { ok: false, triesLeft: Math.max(0, deps.maxTries - tries), lockedOut: tries >= deps.maxTries };
    },
    async triesLeft(): Promise<number> {
      const rec = await read();
      return rec ? Math.max(0, deps.maxTries - rec.tries) : 0;
    },
    async clear(): Promise<void> {
      await deps.store.remove(KEY);
    },
  };
}

export type PinVault = ReturnType<typeof createPinVault>;

/** Should the app lock after coming back from the background? */
export function shouldLock(backgroundedAt: number | null, now: number, lockAfterMs: number): boolean {
  if (backgroundedAt === null) return false;
  return now - backgroundedAt >= lockAfterMs;
}
