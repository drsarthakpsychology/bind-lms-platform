import { describe, expect, it } from "vitest";
import { isHiddenAccount, isRobotEmail } from "./hidden";
import { latest, presenceOf, visitEnd } from "./presence";

describe("hidden accounts", () => {
  it("hides test and robot accounts", () => {
    for (const e of ["calibration@lumen.internal", "test@lumen.test", "peer@vibha.test", "simhealth-eb5b0cf0@vibha.test", "nightverify@bindcat.com", "invite-e2e-test@bindcat.com"]) {
      expect(isRobotEmail(e), e).toBe(true);
    }
    expect(isHiddenAccount({ email: "a@gmail.com", is_test: true })).toBe(true);
  });
  it("keeps real students", () => {
    for (const e of ["khushi@gmail.com", "someone@college.edu.in", "x@testbook.com", "lumen@gmail.com"]) {
      expect(isRobotEmail(e), e).toBe(false);
    }
    expect(isHiddenAccount({ email: "a@gmail.com", is_test: false })).toBe(false);
  });
});

describe("presence", () => {
  const now = new Date("2026-11-03T10:00:00Z").getTime();
  it("shows active now within 5 minutes", () => {
    expect(presenceOf("2026-11-03T09:57:00Z", now)).toBe("now");
    expect(presenceOf("2026-11-03T09:50:00Z", now)).toBe("today");
    expect(presenceOf("2026-10-30T09:50:00Z", now)).toBe("week");
    expect(presenceOf("2026-10-01T09:50:00Z", now)).toBe("quiet");
    expect(presenceOf(null, now)).toBe("never");
  });
  it("uses the end of a visit", () => {
    expect(visitEnd({ entered_at: "2026-11-03T09:50:00Z", duration_seconds: 420 })).toBe("2026-11-03T09:57:00.000Z");
    expect(latest(null, "2026-11-01T00:00:00Z", "2026-11-02T00:00:00Z")).toBe("2026-11-02T00:00:00Z");
  });
});
