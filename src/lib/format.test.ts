import { describe, it, expect } from "vitest";
import { formatRelativeTime } from "./format";

// Fixed "now" so relative buckets are deterministic.
const NOW = new Date("2026-08-14T12:00:00Z").getTime();

describe("formatRelativeTime", () => {
  it("shows 'just now' under a minute", () => {
    expect(formatRelativeTime("2026-08-14T11:59:40Z", NOW)).toBe("just now");
  });

  it("shows minutes ago under an hour", () => {
    expect(formatRelativeTime("2026-08-14T11:48:00Z", NOW)).toBe("12 minutes ago");
  });

  it("shows hours ago under a day", () => {
    expect(formatRelativeTime("2026-08-14T09:00:00Z", NOW)).toBe("3 hours ago");
  });

  it("shows days ago under a week", () => {
    expect(formatRelativeTime("2026-08-12T12:00:00Z", NOW)).toBe("2 days ago");
  });

  it("shows '12 Aug' for same-year dates older than a week", () => {
    expect(formatRelativeTime("2026-08-01T12:00:00Z", NOW)).toBe("1 Aug");
  });

  it("shows '12 Aug 2025' for prior-year dates", () => {
    expect(formatRelativeTime("2025-08-01T12:00:00Z", NOW)).toBe("1 Aug 2025");
  });

  it("returns empty string for invalid dates", () => {
    expect(formatRelativeTime("not-a-date", NOW)).toBe("");
  });
});
