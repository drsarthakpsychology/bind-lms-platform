import { describe, expect, it } from "vitest";
import { deriveCourseStatus, deriveWeekStatus } from "./status";

describe("course status consistency", () => {
  it("never reports a week 'in progress' before the course has started", () => {
    // The exact contradiction the live page showed: 0% progress ("Not started")
    // while the current week said "In progress". With courseStarted=false the
    // week must resolve to "not-started", never "in-progress".
    const week = deriveWeekStatus({
      weekComplete: false,
      isNextWeek: true,
      courseStarted: false,
      isFutureWeek: false,
    });
    expect(week).toBe("not-started");
  });

  it("course 'not-started' and week 'in-progress' are mutually exclusive", () => {
    const course = deriveCourseStatus(0, 5, false);
    expect(course).toBe("not-started");

    const week = deriveWeekStatus({
      weekComplete: false,
      isNextWeek: true,
      courseStarted: false,
      isFutureWeek: false,
    });
    expect(week).not.toBe("in-progress");
  });

  it("a started course puts its current week 'in progress'", () => {
    expect(deriveCourseStatus(1, 5, true)).toBe("in-progress");
    const week = deriveWeekStatus({
      weekComplete: false,
      isNextWeek: true,
      courseStarted: true,
      isFutureWeek: false,
    });
    expect(week).toBe("in-progress");
  });

  it("completes when every lesson is complete", () => {
    expect(deriveCourseStatus(5, 5, true)).toBe("completed");
    expect(
      deriveWeekStatus({ weekComplete: true, isNextWeek: false, courseStarted: true, isFutureWeek: false }),
    ).toBe("complete");
  });
});
