import { describe, expect, it } from "vitest";
import { isLecturesOnly, lectureOnlyAllowed, isBlocked } from "./scope";

const profile = (scope: "full" | "lectures_only") => ({
  id: "u1",
  email: "s@x.com",
  role: "student" as const,
  scope,
  active_session_token: null,
  expires_at: null,
});

describe("lecture-only scope guards", () => {
  it("isLecturesOnly is true only for scope=lectures_only", () => {
    expect(isLecturesOnly(profile("lectures_only"))).toBe(true);
    expect(isLecturesOnly(profile("full"))).toBe(false);
    expect(isLecturesOnly(null)).toBe(false);
  });

  it("lectureOnlyAllowed permits the lecture list + every live/unlocked student surface", () => {
    // Allowed — the lecture list, the player, and every student surface the
    // programme may make live/unlocked (each is itself server-gated by its
    // feature flag).
    expect(lectureOnlyAllowed("/dashboard")).toBe(true);
    expect(lectureOnlyAllowed("/courses/abc")).toBe(true);
    expect(lectureOnlyAllowed("/courses/abc/lessons/def")).toBe(true);
    // /today was retired as the front door — no longer a permitted surface.
    expect(lectureOnlyAllowed("/today")).toBe(false);
    expect(lectureOnlyAllowed("/practice")).toBe(true);
    expect(lectureOnlyAllowed("/practice/consulting-room")).toBe(true);
    expect(lectureOnlyAllowed("/reflect")).toBe(true);
    expect(lectureOnlyAllowed("/wall")).toBe(true);
    expect(lectureOnlyAllowed("/tools/psychopharm")).toBe(true);
    expect(lectureOnlyAllowed("/passport")).toBe(true);
    expect(lectureOnlyAllowed("/record")).toBe(true);
    expect(lectureOnlyAllowed("/notifications")).toBe(true);

    // Blocked — the admin + account surfaces, never for a student.
    expect(lectureOnlyAllowed("/settings")).toBe(false);
    expect(lectureOnlyAllowed("/admin")).toBe(false);
    expect(lectureOnlyAllowed("/admin/flags")).toBe(false);
  });

  it("isBlocked is true only for status=blocked, independent of credentials", () => {
    expect(isBlocked({ status: "blocked" })).toBe(true);
    expect(isBlocked({ status: "active" })).toBe(false);
    expect(isBlocked(null)).toBe(false);
    // The override is on status alone — a valid session/password is irrelevant.
    expect(isBlocked({ status: "blocked" } as { status: "active" | "blocked" })).toBe(true);
  });
});
