/**
 * Course / week status — one source of truth so a page can never say both
 * "Not started" and "In progress" at the same time.
 *
 * The invariant (tested): a course that has not been *started* (nothing
 * completed, nothing watched) can never produce a week labelled "in progress".
 * "In progress" is reserved for a course that has begun and whose current week
 * still has an incomplete lesson.
 */

export type CourseStatus = "not-started" | "in-progress" | "completed";

/**
 * The single course-level status. `started` is true when the student has
 * completed at least one lesson OR watched any part of one — never inferred
 * from the week the next lesson happens to live in.
 */
export function deriveCourseStatus(
  completedCount: number,
  totalLessons: number,
  started: boolean,
): CourseStatus {
  if (totalLessons > 0 && completedCount === totalLessons) return "completed";
  if (started) return "in-progress";
  return "not-started";
}

export type WeekStatus = "complete" | "in-progress" | "not-started" | "upcoming";

/**
 * A week's status, derived from the same `courseStarted` flag as the course
 * status. A week is "in progress" only when the course has started AND this is
 * the week that holds the next incomplete lesson. Before the course has
 * started, every week is "not-started" — never "in progress".
 */
export function deriveWeekStatus(args: {
  weekComplete: boolean;
  isNextWeek: boolean;
  courseStarted: boolean;
  isFutureWeek: boolean;
}): WeekStatus {
  if (args.weekComplete) return "complete";
  if (args.isFutureWeek) return "upcoming";
  if (args.isNextWeek && args.courseStarted) return "in-progress";
  return "not-started";
}
