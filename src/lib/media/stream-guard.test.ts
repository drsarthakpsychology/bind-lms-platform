import { describe, expect, it } from "vitest";
import { safeStreamRest, warmChunkAllowed } from "./stream-guard";

describe("safeStreamRest", () => {
  it("allows the master playlist, the key and lecture files", () => {
    for (const ok of ["", "__key__", "master.m3u8", "hls_720/index.m3u8", "hls_720/seg_0004.ts", "subs/en.vtt"]) {
      expect(safeStreamRest(ok)).toBe(true);
    }
  });
  it("refuses paths that leave the lecture folder or are not media", () => {
    for (const bad of ["../other/master.m3u8", "hls_720/../../x.ts", "a\\b.ts", "/abs.ts", "hls_720//seg.ts", ".hidden.ts", "notes.pdf", "a/b/c/d/e.ts", "seg.ts?x", "%2e%2e/seg.ts"]) {
      expect(safeStreamRest(bad)).toBe(false);
    }
  });
});

describe("warmChunkAllowed (token replay across browsers and users)", () => {
  const warm = { ok: true, session: "session-a" };
  it("allows the browser session that passed the full check", () => {
    expect(warmChunkAllowed(warm, "session-a")).toBe(true);
  });
  it("refuses a copied stream URL used without that session cookie", () => {
    expect(warmChunkAllowed(warm, undefined)).toBe(false);
    expect(warmChunkAllowed(warm, "session-b")).toBe(false);
  });
  it("refuses when there is no verdict or no recorded session", () => {
    expect(warmChunkAllowed(null, "session-a")).toBe(false);
    expect(warmChunkAllowed({ ok: true }, "session-a")).toBe(false);
    expect(warmChunkAllowed({ ok: false, session: "session-a" }, "session-a")).toBe(false);
  });
});
