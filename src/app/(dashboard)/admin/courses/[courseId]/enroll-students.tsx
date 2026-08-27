"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search, UserPlus, UserRoundCheck } from "lucide-react";
import { enrollStudents, unenrollStudent } from "./actions";

import { Button } from "@/components/ui/button";

type Student = { id: string; email: string | null };

/**
 * Course enrollment — bulk by default (Kavya: "select multiple people and
 * enroll them in one course"). Search narrows the not-enrolled list, tick the
 * people you want (or Select all), then "Enroll selected". Enrolled students
 * stay listed with a per-row Remove.
 */
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
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const enrolledSet = useMemo(() => new Set(enrolledIds), [enrolledIds]);
  const notEnrolled = useMemo(() => students.filter((s) => !enrolledSet.has(s.id)), [students, enrolledSet]);
  const q = query.trim().toLowerCase();
  const filtered = q ? notEnrolled.filter((s) => (s.email ?? "").toLowerCase().includes(q)) : notEnrolled;
  const allSelected = filtered.length > 0 && filtered.every((s) => selected.has(s.id));

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) filtered.forEach((s) => next.delete(s.id));
      else filtered.forEach((s) => next.add(s.id));
      return next;
    });
  }

  function handleBulkEnroll() {
    const ids = Array.from(selected);
    if (!ids.length || isPending) return;
    setError(null);
    startTransition(async () => {
      try {
        const result = await enrollStudents(courseId, ids);
        if (result.error) setError(result.error);
        else {
          setSelected(new Set());
          router.refresh();
        }
      } catch {
        setError("Could not enroll the selected students.");
      }
    });
  }

  function handleRemove(studentId: string) {
    setError(null);
    startTransition(async () => {
      try {
        const result = await unenrollStudent(courseId, studentId);
        if (result.error) setError(result.error);
        else router.refresh();
      } catch {
        setError("Could not remove the student.");
      }
    });
  }

  const inputCls =
    "h-9 w-full rounded-md border-2 border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/60";

  return (
    <div className="space-y-3">
      {/* Search */}
      <label className="sr-only" htmlFor="enroll-search">
        Search students
      </label>
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input
          id="enroll-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${notEnrolled.length} students…`}
          className={`${inputCls} pl-8`}
        />
      </div>

      {/* Bulk select + enroll */}
      {notEnrolled.length === 0 ? (
        <p className="text-caption text-muted-foreground">Every student is already enrolled.</p>
      ) : (
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="flex cursor-pointer items-center gap-1.5 text-small text-foreground">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                disabled={filtered.length === 0 || isPending}
                aria-label="Select all students"
                className="size-4 accent-primary"
              />
              Select all ({filtered.length})
            </label>
            <Button
              type="button"
              size="sm"
              onClick={handleBulkEnroll}
              disabled={selected.size === 0 || isPending}
            >
              {isPending ? <Loader2 className="size-3.5 animate-spin" aria-hidden /> : <UserPlus className="size-3.5" aria-hidden />}
              Enroll selected ({selected.size})
            </Button>
          </div>
          {filtered.length === 0 ? (
            <p className="text-caption text-muted-foreground">No students match “{query}”.</p>
          ) : (
            <ul className="max-h-56 space-y-1 overflow-y-auto rounded-md border-2 border-border bg-background p-2">
              {filtered.map((s) => (
                <li key={s.id} className="flex items-center gap-2 text-small text-foreground">
                  <input
                    type="checkbox"
                    checked={selected.has(s.id)}
                    onChange={() => toggle(s.id)}
                    disabled={isPending}
                    aria-label={`Select ${s.email ?? s.id}`}
                    className="size-4 shrink-0 accent-primary"
                  />
                  <span className="truncate">{s.email ?? s.id}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {error && (
        <p role="alert" className="text-caption font-medium text-status-alert-fg">
          {error}
        </p>
      )}

      {/* Enrolled */}
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
                  <UserRoundCheck className="size-4 shrink-0 text-link" aria-hidden />
                  <span className="truncate">{s.email ?? s.id}</span>
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={() => handleRemove(s.id)}
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
