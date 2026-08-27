"use client";

import { useRef, useState } from "react";
import { ChevronDown, Loader2, UserRoundPlus } from "lucide-react";
import { loadRoster, type RosterForCourse } from "./actions";
import { EnrollStudents } from "./enroll-students";
import { Badge } from "@/components/ui/badge";

/**
 * Enrolled-students accordion that does NOT drag the whole roster into the
 * builder page load. The count badge is a cheap enrollments count from the
 * server; the full roster (every student + who's enrolled) loads only the
 * first time the section is opened.
 */
export function LazyEnrolledStudents({
  courseId,
  enrolledCount,
}: {
  courseId: string;
  enrolledCount: number;
}) {
  const [loaded, setLoaded] = useState<RosterForCourse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requested = useRef(false);

  async function onToggle(e: React.SyntheticEvent<HTMLDetailsElement>) {
    const open = (e.target as HTMLDetailsElement).open;
    if (!open || loaded || requested.current) return;
    requested.current = true;
    setLoading(true);
    setError(null);
    try {
      const data = await loadRoster(courseId);
      setLoaded(data);
    } catch {
      setError("Could not load the roster. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <details onToggle={onToggle} className="group rounded-lg border-2 border-border bg-card hard-shadow-sm">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-body-strong [&::-webkit-details-marker]:hidden">
        <UserRoundPlus className="size-4 text-link" aria-hidden />
        Enrolled students
        <Badge variant="secondary" className="ml-1">
          {loaded ? loaded.enrolledIds.length : enrolledCount}
        </Badge>
        <ChevronDown
          className="ml-auto size-4 text-muted-foreground transition-transform duration-fast ease-snappy group-open:rotate-180"
          aria-hidden
        />
      </summary>
      <div className="border-t-2 border-border px-4 py-4">
        {loading ? (
          <p className="flex items-center gap-2 text-small text-muted-foreground">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Loading students…
          </p>
        ) : error ? (
          <p role="alert" className="text-small text-status-alert-fg">
            {error}
          </p>
        ) : loaded ? (
          <EnrollStudents courseId={courseId} students={loaded.students} enrolledIds={loaded.enrolledIds} />
        ) : (
          <p className="text-small text-muted-foreground">Open to manage enrollment.</p>
        )}
      </div>
    </details>
  );
}
