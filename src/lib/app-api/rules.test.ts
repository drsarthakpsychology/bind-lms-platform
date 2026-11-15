import { describe, expect, it } from "vitest";
import { accountProblem, bearerToken, isExpired, jwtExpired } from "./guard-rules";
import { countRecentChanges, DEVICE_ID_RE, isExempt, nextChangeAt } from "./device-rules";
import { buildConfig, compareVersions, latestVersion, minSupportedVersion, tooOld } from "./config";
import { toAppTarget } from "./target";
import { STATUS, MESSAGE, fail, ok } from "./respond";

const DAY = 86_400_000;
const NOW = Date.parse("2026-11-15T10:00:00Z");
const ago = (days: number) => new Date(NOW - days * DAY).toISOString();
const jwt = (exp: number) => `h.${Buffer.from(JSON.stringify({ exp })).toString("base64url")}.s`;

describe("bearer token", () => {
  it("reads a bearer header and nothing else", () => {
    expect(bearerToken(`Bearer ${"a".repeat(40)}`)).toBe("a".repeat(40));
    expect(bearerToken(`bearer   ${"a".repeat(40)}`)).toBe("a".repeat(40));
    expect(bearerToken("Basic abc")).toBeNull();
    expect(bearerToken("Bearer short")).toBeNull();
    expect(bearerToken(`Bearer ${"a".repeat(30)} extra`)).toBeNull();
    expect(bearerToken(null)).toBeNull();
  });
  it("knows an expired token without asking the network", () => {
    expect(jwtExpired(jwt(NOW / 1000 - 1), NOW)).toBe(true);
    expect(jwtExpired(jwt(NOW / 1000 + 60), NOW)).toBe(false);
    expect(jwtExpired("not-a-jwt", NOW)).toBe(false);
  });
});

describe("account rules (the same as the website session)", () => {
  it("paused wins over ended", () => {
    expect(accountProblem({ status: "blocked", expires_at: ago(1), role: "student" }, NOW)).toBe("account_blocked");
  });
  it("an ended student is refused, an alumnus never ends", () => {
    expect(accountProblem({ status: "active", expires_at: ago(1), role: "student" }, NOW)).toBe("account_expired");
    expect(accountProblem({ status: "active", expires_at: ago(1), role: "alumni" }, NOW)).toBeNull();
    expect(isExpired(null, "student", NOW)).toBe(false);
    expect(isExpired(ago(-1), "student", NOW)).toBe(false);
  });
});

describe("phone-change rule", () => {
  it("counts only switches inside 30 days", () => {
    const rows = [
      { kind: "switch", created_at: ago(40) },
      { kind: "switch", created_at: ago(10) },
      { kind: "switch", created_at: ago(1) },
    ];
    expect(countRecentChanges(rows, NOW)).toBe(2);
    expect(countRecentChanges(rows.slice(0, 2), NOW)).toBe(1);
  });
  it("an admin reset clears the changes before it", () => {
    const rows = [
      { kind: "switch", created_at: ago(10) },
      { kind: "switch", created_at: ago(5) },
      { kind: "admin_reset", created_at: ago(2) },
      { kind: "switch", created_at: ago(1) },
    ];
    expect(countRecentChanges(rows, NOW)).toBe(1);
    expect(nextChangeAt(rows, NOW)).toBeNull();
  });
  it("says when the next change frees up", () => {
    const rows = [
      { kind: "switch", created_at: ago(20) },
      { kind: "switch", created_at: ago(3) },
    ];
    expect(nextChangeAt(rows, NOW)).toBe(new Date(NOW + 10 * DAY).toISOString());
    expect(nextChangeAt([rows[1]], NOW)).toBeNull();
  });
  it("admins are exempt, students are not", () => {
    expect(isExempt("admin")).toBe(true);
    expect(isExempt("view_admin")).toBe(true);
    expect(isExempt("student")).toBe(false);
    expect(isExempt("alumni")).toBe(false);
  });
  it("accepts only sane device ids", () => {
    expect(DEVICE_ID_RE.test("a1b2c3d4-e5f6-4a7b-8c9d-0123456789ab")).toBe(true);
    expect(DEVICE_ID_RE.test("short")).toBe(false);
    expect(DEVICE_ID_RE.test("has space in the device id")).toBe(false);
    expect(DEVICE_ID_RE.test("x".repeat(81))).toBe(false);
  });
});

describe("app versions", () => {
  it("compares number by number", () => {
    expect(compareVersions("1.2.0", "1.10.0")).toBe(-1);
    expect(compareVersions("2.0", "1.9.9")).toBe(1);
    expect(compareVersions("1.0", "1.0.0")).toBe(0);
  });
  it("refuses versions below the minimum, passes a missing header", () => {
    const env = { APP_MIN_VERSION: "1.2.0" };
    expect(tooOld("1.1.9", env)).toBe(true);
    expect(tooOld("1.2.0", env)).toBe(false);
    expect(tooOld(null, env)).toBe(false);
    expect(tooOld("garbage", env)).toBe(false);
  });
  it("ignores unreadable settings and never reports latest below minimum", () => {
    expect(minSupportedVersion({ APP_MIN_VERSION: "nope" })).toBe("1.0.0");
    expect(latestVersion({ APP_MIN_VERSION: "2.0.0", APP_LATEST_VERSION: "1.5.0" })).toBe("2.0.0");
  });
  it("builds the config the contract promises", () => {
    const c = buildConfig(new Date(NOW), { APP_NOTICE: "Back at 6" });
    expect(c.apiVersion).toBe("v1");
    expect(c.notice).toBe("Back at 6");
    expect(c.security.pinLength).toBe(4);
    expect(c.device).toEqual({ onePhoneAtATime: true, changesPerMonth: 2 });
    expect(c.storeUrl.android).toContain("com.vibhapsychology.app");
    expect(c.support.whatsapp).toMatch(/^https:\/\/wa\.me\/\d+$/);
    expect(c.now).toBe(new Date(NOW).toISOString());
  });
});

describe("website paths become app screens", () => {
  it("maps the screens the app has", () => {
    expect(toAppTarget("/dashboard")).toMatchObject({ screen: "home" });
    expect(toAppTarget("/courses/c1/lessons/l1?tab=assignment")).toEqual({ screen: "lecture", courseId: "c1", lessonId: "l1", tab: "assignment", web: "/courses/c1/lessons/l1?tab=assignment" });
    expect(toAppTarget("/courses/c1/materials/m1")).toMatchObject({ screen: "material", courseId: "c1", materialId: "m1" });
    expect(toAppTarget("/courses/c1")).toMatchObject({ screen: "course", courseId: "c1" });
    expect(toAppTarget("/study/brain/2-3")).toMatchObject({ screen: "studySection", moduleId: "brain", sectionId: "2-3" });
    expect(toAppTarget("/study/brain/checkpoint/2")).toMatchObject({ screen: "studyCheckpoint", moduleId: "brain", n: 2 });
    expect(toAppTarget("/study/brain#steps")).toMatchObject({ screen: "studyModule", moduleId: "brain" });
    expect(toAppTarget("/study/notes/mse")).toMatchObject({ screen: "studyNote", noteId: "mse" });
    expect(toAppTarget("/doubts/d1")).toMatchObject({ screen: "doubt", doubtId: "d1" });
    expect(toAppTarget("/notifications/n1")).toMatchObject({ screen: "notification", notificationId: "n1" });
    expect(toAppTarget("/practice/daily?from=/dashboard")).toMatchObject({ screen: "practice", tool: "daily" });
    expect(toAppTarget("/games/blitz")).toMatchObject({ screen: "game", game: "blitz" });
  });
  it("keeps the path for anything else", () => {
    expect(toAppTarget("/wall")).toEqual({ screen: "unknown", web: "/wall" });
    expect(toAppTarget(null)).toMatchObject({ screen: "home" });
  });
});

describe("answer shape", () => {
  it("wraps data and errors the same way everywhere", async () => {
    expect(await ok({ a: 1 }).json()).toEqual({ ok: true, data: { a: 1 } });
    const r = fail("device_replaced");
    expect(r.status).toBe(401);
    expect(await r.json()).toEqual({ ok: false, error: { code: "device_replaced", message: "Signed out: opened on another device." } });
    expect((await fail("bad_request", "No.", { fields: ["x"] }).json()).error.details).toEqual({ fields: ["x"] });
  });
  it("has a status and a message for every code", () => {
    expect(Object.keys(STATUS).sort()).toEqual(Object.keys(MESSAGE).sort());
  });
});
