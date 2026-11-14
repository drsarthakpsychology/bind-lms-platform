import { describe, expect, it, vi } from "vitest";
import { isTransient, withRetry } from "./retry";

describe("isTransient", () => {
  it("retries connection drops, timeouts and lock conflicts", () => {
    expect(isTransient({ message: "TypeError: fetch failed" })).toBe(true);
    expect(isTransient({ code: "57014", message: "canceling statement due to statement timeout" })).toBe(true);
    expect(isTransient({ code: "40001" })).toBe(true);
    expect(isTransient({ code: "08006" })).toBe(true);
    expect(isTransient({ code: "PGRST000" })).toBe(true);
    expect(isTransient({ status: 503, code: "", message: "" })).toBe(true);
  });
  it("does not retry what will fail the same way again", () => {
    expect(isTransient(null)).toBe(false);
    expect(isTransient({ code: "23505", message: "duplicate key" })).toBe(false);
    expect(isTransient({ code: "23514", message: "violates check constraint" })).toBe(false);
    expect(isTransient({ code: "42501", message: "new row violates row-level security policy" })).toBe(false);
    expect(isTransient({ code: "PGRST204", message: "column not found" })).toBe(false);
  });
});

describe("withRetry", () => {
  it("tries again after a passing failure and returns the success", async () => {
    const fn = vi.fn().mockResolvedValueOnce({ error: { message: "fetch failed" } }).mockResolvedValueOnce({ error: null, data: 1 });
    const r = await withRetry(fn, [1, 1]);
    expect(r).toEqual({ error: null, data: 1 });
    expect(fn).toHaveBeenCalledTimes(2);
  });
  it("stops at once on a lasting error", async () => {
    const fn = vi.fn().mockResolvedValue({ error: { code: "23514", message: "check" } });
    const r = await withRetry(fn, [1, 1]);
    expect(r.error?.code).toBe("23514");
    expect(fn).toHaveBeenCalledTimes(1);
  });
  it("turns a throw into an error result and gives up after the last try", async () => {
    const fn = vi.fn().mockRejectedValue(new Error("ECONNRESET"));
    const r = await withRetry(fn, [1, 1]);
    expect(r.error?.message).toBe("ECONNRESET");
    expect(fn).toHaveBeenCalledTimes(3);
  });
});
