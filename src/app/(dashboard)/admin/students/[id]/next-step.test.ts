import { describe, expect, it } from "vitest";
import { progressPct, suggestNextStep, type NextStepInput } from "./next-step";

const base: NextStepInput = { account: "active", waitingDoubts: 0, cohorts: 1, flags: [], lecturesDone: 3, lecturesAvailable: 10, certificates: 0 };

describe("suggestNextStep", () => {
  it("puts a waiting doubt first", () => {
    expect(suggestNextStep({ ...base, waitingDoubts: 2, account: "locked" })).toMatchObject({ action: "reply", label: "Reply to their 2 doubts" });
  });
  it("then access and login problems", () => {
    expect(suggestNextStep({ ...base, account: "locked" }).action).toBe("access");
    expect(suggestNextStep({ ...base, account: "not-invited" }).action).toBe("login-link");
    expect(suggestNextStep({ ...base, account: "email-failed" }).why).toMatch(/didn't go out/);
  });
  it("then no cohort", () => {
    expect(suggestNextStep({ ...base, cohorts: 0 }).action).toBe("add-cohort");
  });
  it("nudges people who never came in, are behind or quiet", () => {
    expect(suggestNextStep({ ...base, account: "set-up" }).action).toBe("message");
    expect(suggestNextStep({ ...base, flags: ["behind"] }).why).toMatch(/behind/);
    expect(suggestNextStep({ ...base, flags: ["quiet"] }).why).toMatch(/quiet/);
  });
  it("suggests a certificate when every lecture is done", () => {
    expect(suggestNextStep({ ...base, lecturesDone: 10 }).action).toBe("certificate");
    expect(suggestNextStep({ ...base, lecturesDone: 10, certificates: 1 }).action).toBe("none");
  });
  it("says nothing is needed when all is well", () => {
    expect(suggestNextStep(base)).toEqual({ label: "Nothing needed", why: "They're on track.", action: "none" });
  });
});

describe("progressPct", () => {
  it("rounds and clamps", () => {
    expect(progressPct(1, 3)).toBe(33);
    expect(progressPct(5, 0)).toBe(0);
    expect(progressPct(12, 10)).toBe(100);
  });
});
