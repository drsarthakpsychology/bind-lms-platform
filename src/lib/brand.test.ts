import { describe, expect, it } from "vitest";
import { COHORT, BRAND, hasCohortStarted, cohortDeadlineText } from "./brand";

describe("cohort deadline copy", () => {
  it("names the date before the cohort start date", () => {
    const before = new Date("2026-08-19T12:00:00");
    expect(hasCohortStarted(before)).toBe(false);
    expect(cohortDeadlineText(before)).toBe(`Cohort One begins ${BRAND.cohortStart}`);
  });

  it("drops the stale date at end of day on the start date", () => {
    const onDay = new Date("2026-08-20T23:59:59");
    expect(hasCohortStarted(onDay)).toBe(true);
    expect(cohortDeadlineText(onDay)).toBe("Cohort One is by invitation");
  });

  it("keeps the invitation framing after the cohort has started", () => {
    const after = new Date("2026-09-01T12:00:00");
    expect(hasCohortStarted(after)).toBe(true);
    expect(cohortDeadlineText(after)).toBe("Cohort One is by invitation");
  });

  it("COHORT.startDate is a real ISO date", () => {
    expect(COHORT.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(Number.isNaN(new Date(COHORT.startDate).getTime())).toBe(false);
  });
});
