import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { deriveSessionKey } from "./crypto";
import { mintStreamToken, verifyStreamToken } from "./stream-token";

const prev = process.env.SESSION_SECRET;
beforeAll(() => {
  process.env.SESSION_SECRET = "test-secret-for-session-keys";
});
afterAll(() => {
  process.env.SESSION_SECRET = prev;
});

describe("video session key", () => {
  it("stays the same when the 5-minute stream token rotates mid-lecture", () => {
    // The player fetches the key once; later segments arrive under a fresh token.
    const first = mintStreamToken({ userId: "u1", lessonId: "l1", courseId: "c1", now: 1_000 });
    const later = mintStreamToken({ userId: "u1", lessonId: "l1", courseId: "c1", now: 1_000 + 4.5 * 60_000 });
    expect(first).not.toBe(later);
    const a = verifyStreamToken(first, 1_000);
    const b = verifyStreamToken(later, 1_000 + 4.5 * 60_000);
    expect(a && b).toBeTruthy();
    expect(deriveSessionKey(a!.uid, "l1").equals(deriveSessionKey(b!.uid, "l1"))).toBe(true);
  });

  it("differs for another student or another lecture", () => {
    const k = deriveSessionKey("u1", "l1");
    expect(k.equals(deriveSessionKey("u2", "l1"))).toBe(false);
    expect(k.equals(deriveSessionKey("u1", "l2"))).toBe(false);
    expect(k).toHaveLength(16);
  });
});
