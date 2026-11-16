import type { QueryClient } from "@tanstack/react-query";

import type { CourseDetail, CourseList } from "@/api/contract";
import { keys } from "@/api/queries";

/**
 * A lecture was just marked as watched: count it in the course page and the
 * Lectures list straight away, so their progress lines fill as the student
 * goes back (the server's answer replaces this when it arrives).
 */
export function countWatched(qc: QueryClient, courseId: string, lessonId: string): void {
  if (!courseId) return;
  // Called only for a lecture that was not watched before (the button is not shown otherwise);
  // when the course page is in memory and already has it done, nothing is counted twice.
  let counted = true;
  qc.setQueryData<CourseDetail>(keys.course(courseId), (d) => {
    if (!d || !Array.isArray(d.weeks)) return d;
    if (d.weeks.some((w) => w.lessons.some((l) => l.id === lessonId && l.state === "done"))) {
      counted = false;
      return d;
    }
    return {
      ...d,
      completedCount: Math.min(d.totalLessons, d.completedCount + 1),
      weeks: d.weeks.map((w) => ({ ...w, lessons: w.lessons.map((l) => (l.id === lessonId ? { ...l, state: "done" as const } : l)) })),
    };
  });
  if (!counted) return;
  qc.setQueryData<CourseList>(keys.courses, (d) =>
    d && Array.isArray(d.courses) ? { ...d, courses: d.courses.map((c) => (c.id === courseId ? { ...c, completedCount: Math.min(c.totalLessons, c.completedCount + 1), started: true } : c)) } : d,
  );
}
