"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, UserPlus, UserRoundCheck } from "lucide-react";
import { enrollStudent, unenrollStudent } from "./actions";

import { Button } from "@/components/ui/button";

type Student = { id: string; email: string | null };

export function EnrollStudents({
  courseId,
  students,
  enrolledIds,
}: {
  courseId: string;
  students: Student[];
  enrolledIds: string[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string>("");

  const enrolledSet = new Set(enrolledIds);

  function handleToggle(studentId: string, isEnrolled: boolean) {
    setError(null);
    startTransition(async () => {
      const result = isEnrolled
        ? await unenrollStudent(courseId, studentId)
        : await enrollStudent(courseId, studentId);
      if (result.error) setError(result.error);
      else router.refresh();
    });
  }

  function handleAdd() {
    if (!selectedId) return;
    handleToggle(selectedId, false);
    setSelectedId("");
  }

  const notEnrolled = students.filter((s) => !enrolledSet.has(s.id));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor="student-picker" className="sr-only">
          Select a student
        </label>
        <select
          id="student-picker"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="h-9 min-w-0 flex-1 rounded-md border-2 border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/60"
        >
          <option value="">Select a student…</option>
          {notEnrolled.map((s) => (
            <option key={s.id} value={s.id}>
              {s.email ?? s.id}
            </option>
          ))}
        </select>
        <Button type="button" size="sm" onClick={handleAdd} disabled={!selectedId || isPending}>
          {isPending && <Loader2 className="size-3.5 animate-spin" aria-hidden />}
          <UserPlus className="size-3.5" aria-hidden />
          Enroll
        </Button>
      </div>

      {error && (
        <p role="alert" className="text-caption text-status-alert-fg">
          {error}
        </p>
      )}

      {enrolledIds.length === 0 ? (
        <p className="text-caption text-muted-foreground">
          No students enrolled yet. Materials and assignments are only visible to
          enrolled students.
        </p>
      ) : (
        <ul className="space-y-1.5">
          {students
            .filter((s) => enrolledSet.has(s.id))
            .map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between gap-2 rounded-md border-2 border-border bg-muted/40 px-3 py-2 text-small"
              >
                <span className="inline-flex min-w-0 items-center gap-2 truncate text-foreground">
                  <UserRoundCheck className="size-4 shrink-0 text-primary" aria-hidden />
                  <span className="truncate">{s.email ?? s.id}</span>
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={() => handleToggle(s.id, true)}
                  disabled={isPending}
                >
                  Remove
                </Button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
