import { describe, expect, it } from "vitest";
import { clampProgress, MAX_LECTURE_SECONDS, MAX_PLAYBACK_RATE, SEEK_SLACK_SECONDS } from "./progress-clamp";

const now = Date.parse("2026-11-03T10:00:00Z");

describe("clampProgress", () => {
  it("uses the server duration for completion, not the client's", () => {
    // Client claims a 100 s lecture; the real one is 3600 s.
    expect(clampProgress({ watchedSeconds: 95, clientDuration: 100, serverDuration: 3600, prev: null, now })).toEqual({ watchedSeconds: 95, isCompleted: false });
    expect(clampProgress({ watchedSeconds: 3300, clientDuration: 100, serverDuration: 3600, prev: null, now }).isCompleted).toBe(true);
  });

  it("clamps the position to the lecture length", () => {
    expect(clampProgress({ watchedSeconds: 1e9, clientDuration: 1e9, serverDuration: 600, prev: null, now }).watchedSeconds).toBe(600);
    expect(clampProgress({ watchedSeconds: 1e9, clientDuration: 1e9, serverDuration: null, prev: null, now }).watchedSeconds).toBe(MAX_LECTURE_SECONDS);
    expect(clampProgress({ watchedSeconds: Number.NaN, clientDuration: -1, serverDuration: null, prev: null, now }).watchedSeconds).toBe(0);
  });

  it("bounds the forward jump by wall time when updated_at is known", () => {
    const prev = { watchedSeconds: 100, isCompleted: false, updatedAt: new Date(now - 10_000).toISOString() };
    const r = clampProgress({ watchedSeconds: 3000, clientDuration: 3600, serverDuration: 3600, prev, now });
    expect(r.watchedSeconds).toBe(100 + 10 * MAX_PLAYBACK_RATE + SEEK_SLACK_SECONDS);
    expect(r.isCompleted).toBe(false);
  });

  it("allows seeking back and skips the wall-time bound without updated_at", () => {
    expect(clampProgress({ watchedSeconds: 50, clientDuration: 3600, serverDuration: 3600, prev: { watchedSeconds: 900, isCompleted: false, updatedAt: new Date(now).toISOString() }, now }).watchedSeconds).toBe(50);
    expect(clampProgress({ watchedSeconds: 3000, clientDuration: 3600, serverDuration: 3600, prev: { watchedSeconds: 10, isCompleted: false, updatedAt: null }, now }).watchedSeconds).toBe(3000);
  });

  it("never un-completes a lecture", () => {
    expect(clampProgress({ watchedSeconds: 5, clientDuration: 3600, serverDuration: 3600, prev: { watchedSeconds: 3500, isCompleted: true, updatedAt: null }, now }).isCompleted).toBe(true);
  });
});
