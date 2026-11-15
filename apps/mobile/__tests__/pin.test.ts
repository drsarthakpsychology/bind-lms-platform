import { createPinVault, isValidPin, isWeakPin, shouldLock } from "@/auth/pin";
import { memoryStore } from "@/lib/storage";

const hash = async (t: string) => `h(${t})`;

describe("PIN", () => {
  it("accepts four digits only", () => {
    expect(isValidPin("2580")).toBe(true);
    expect(isValidPin("258")).toBe(false);
    expect(isValidPin("25a0")).toBe(false);
  });

  it("turns down PINs that are easy to guess", () => {
    for (const p of ["0000", "1111", "1234", "4321", "6789"]) expect(isWeakPin(p)).toBe(true);
    for (const p of ["2580", "1397", "9024"]) expect(isWeakPin(p)).toBe(false);
  });

  it("never stores the PIN as typed and counts wrong tries across restarts", async () => {
    const store = memoryStore();
    const vault = createPinVault({ store, hash, randomSalt: () => "salt", maxTries: 5 });
    await vault.set("2580");
    expect(JSON.stringify(store.dump())).not.toContain('"2580"');
    expect(await vault.verify("1111")).toEqual({ ok: false, triesLeft: 4, lockedOut: false });
    // A new vault on the same store (the app restarted) remembers the try.
    const again = createPinVault({ store, hash, randomSalt: () => "salt", maxTries: 5 });
    expect(await again.triesLeft()).toBe(4);
    expect(await again.verify("2580")).toEqual({ ok: true });
    expect(await again.triesLeft()).toBe(5);
  });

  it("locks out on the fifth wrong try", async () => {
    const vault = createPinVault({ store: memoryStore(), hash, randomSalt: () => "s", maxTries: 5 });
    await vault.set("2580");
    let last;
    for (let i = 0; i < 5; i++) last = await vault.verify("0000");
    expect(last).toEqual({ ok: false, triesLeft: 0, lockedOut: true });
    expect(await vault.verify("2580")).toMatchObject({ ok: false, lockedOut: true });
  });

  it("locks after five minutes in the background, not before", () => {
    const five = 5 * 60 * 1000;
    expect(shouldLock(null, 1000, five)).toBe(false);
    expect(shouldLock(0, five - 1, five)).toBe(false);
    expect(shouldLock(0, five, five)).toBe(true);
  });
});
