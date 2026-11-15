import { describe, expect, it } from "vitest";
import { findSupportKey, KEY_PREFIX, labelProblem, makeSupportKey, parseSupportKeys, sortKeys, toView } from "./support-keys";

const by = { id: "u1", email: "admin@example.com" };

describe("support keys", () => {
  it("stores a hash and the last four characters, never the key", () => {
    const { plain, record } = makeSupportKey("Kavya, laptop", by);
    expect(plain.startsWith(KEY_PREFIX)).toBe(true);
    expect(plain.length).toBeGreaterThan(30);
    expect(JSON.stringify(record)).not.toContain(plain);
    expect(record.last4).toBe(plain.slice(-4));
    expect(record.createdByEmail).toBe("admin@example.com");
  });

  it("matches only a live key, and only the right one", () => {
    const a = makeSupportKey("A", by);
    const b = makeSupportKey("B", by);
    const keys = [a.record, b.record];
    expect(findSupportKey(b.plain, keys)?.label).toBe("B");
    expect(findSupportKey(b.plain + "x", keys)).toBeNull();
    expect(findSupportKey("not-a-key", keys)).toBeNull();
    expect(findSupportKey(a.plain, [{ ...a.record, revokedAt: new Date().toISOString() }])).toBeNull();
    expect(findSupportKey(a.plain, null)).toBeNull();
  });

  it("the screen view carries no salt or hash; live keys come first", () => {
    const a = makeSupportKey("A", by, new Date("2026-11-01"));
    const b = makeSupportKey("B", by, new Date("2026-11-10"));
    const views = sortKeys([toView({ ...b.record, revokedAt: "2026-11-12T00:00:00Z" }), toView(a.record)]);
    expect(views.map((v) => v.label)).toEqual(["A", "B"]);
    expect(JSON.stringify(views)).not.toMatch(/salt|hash/);
  });

  it("names are required and short; odd stored values are ignored", () => {
    expect(labelProblem("  ")).not.toBeNull();
    expect(labelProblem("x".repeat(61))).not.toBeNull();
    expect(labelProblem("Front desk")).toBeNull();
    expect(parseSupportKeys(null)).toEqual([]);
    expect(parseSupportKeys({ keys: [{ nope: 1 }] })).toEqual([]);
  });
});
