import { describe, expect, it } from "vitest";
import { fetchWithTimeout } from "./timeout-fetch";

describe("fetchWithTimeout", () => {
  it("aborts a call that never answers", async () => {
    const hang: typeof fetch = (_i, init) =>
      new Promise((_r, reject) => init?.signal?.addEventListener("abort", () => reject(new Error("aborted"))));
    await expect(fetchWithTimeout(20, hang)("https://x.test")).rejects.toThrow("aborted");
  });

  it("passes a quick answer through", async () => {
    const quick: typeof fetch = async () => new Response("ok");
    const r = await fetchWithTimeout(1000, quick)("https://x.test");
    expect(await r.text()).toBe("ok");
  });

  it("still honours the caller's own signal", async () => {
    const ctrl = new AbortController();
    const hang: typeof fetch = (_i, init) =>
      new Promise((_r, reject) => init?.signal?.addEventListener("abort", () => reject(new Error("caller"))));
    const p = fetchWithTimeout(10_000, hang)("https://x.test", { signal: ctrl.signal });
    ctrl.abort();
    await expect(p).rejects.toThrow("caller");
  });
});
