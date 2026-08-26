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

  it("lectureOnlyAllowed permits only the lecture list + player", () => {
    // Allowed — the lecture list and the player surface.
    expect(lectureOnlyAllowed("/dashboard")).toBe(true);
    expect(lectureOnlyAllowed("/courses/abc")).toBe(true);
    expect(lectureOnlyAllowed("/courses/abc/lessons/def")).toBe(true);

    // Blocked — every other student surface and admin.
    expect(lectureOnlyAllowed("/today")).toBe(false);
    expect(lectureOnlyAllowed("/practice")).toBe(false);
    expect(lectureOnlyAllowed("/practice/consulting-room")).toBe(false);
    expect(lectureOnlyAllowed("/reflect")).toBe(false);
    expect(lectureOnlyAllowed("/wall")).toBe(false);
    expect(lectureOnlyAllowed("/tools/psychopharm")).toBe(false);
    expect(lectureOnlyAllowed("/passport")).toBe(false);
    expect(lectureOnlyAllowed("/record")).toBe(false);
    expect(lectureOnlyAllowed("/settings")).toBe(false);
    expect(lectureOnlyAllowed("/admin")).toBe(false);
  });

  it("isBlocked is true only for status=blocked, independent of credentials", () => {
    expect(isBlocked({ status: "blocked" })).toBe(true);
    expect(isBlocked({ status: "active" })).toBe(false);
    expect(isBlocked(null)).toBe(false);
    // The override is on status alone — a valid session/password is irrelevant.
    expect(isBlocked({ status: "blocked" } as { status: "active" | "blocked" })).toBe(true);
  });
});
