"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Loader2, Users } from "lucide-react";
import { setCohortLessons } from "../../cohorts/actions";
import { shareLabel, type CourseCohortLite } from "@/lib/cohorts/rules";
import { cn } from "@/lib/utils";

/** The chip(s) saying which cohorts can watch a lecture. */
export function LessonCohortChips({ sharedWith, cohorts }: { sharedWith: string[]; cohorts: CourseCohortLite[] }) {
  const label = shareLabel(sharedWith, cohorts);
  if (label.kind === "none") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border-2 border-dashed border-status-alert-fg bg-status-alert-bg px-2.5 py-0.5 text-xs font-bold text-status-alert-fg">
        Not shared, no cohort can see it
      </span>
    );
  }
  const names = label.kind === "all" ? ["All cohorts"] : label.names;
  return (
    <>
      {names.map((n) => (
        <span key={n} className="inline-flex items-center gap-1 rounded-full border-2 border-foreground bg-brand px-2.5 py-0.5 text-xs font-bold text-brand-foreground">
          <Users className="size-3" aria-hidden />
          {n}
        </span>
      ))}
    </>
  );
}

/**
 * Change who can watch one lecture: one tick per cohort of this course.
 * Each tick saves straight away.
 */
export function LessonCohortEditor({ lessonId, lessonTitle, sharedWith, cohorts }: { lessonId: string; lessonTitle: string; sharedWith: string[]; cohorts: CourseCohortLite[] }) {
  const router = useRouter();
  const [busy, setBusy] = React.useState<string | null>(null);
  const [err, setErr] = React.useState<string | null>(null);
  const shared = new Set(sharedWith);
  if (!cohorts.length) return null;

  const toggle = async (cohortId: string, on: boolean) => {
    setBusy(cohortId);
    setErr(null);
    const res = await setCohortLessons(cohortId, [lessonId], on);
    setBusy(null);
    if (res.error) setErr("Couldn't save. Try again.");
    else router.refresh();
  };

  return (
    <details className="group/share relative">
      <summary
        className="inline-flex h-8 cursor-pointer list-none items-center gap-1 rounded-md border-2 border-foreground bg-card px-3 text-xs font-bold [&::-webkit-details-marker]:hidden"
        aria-label={`Change who can watch ${lessonTitle}`}
      >
        Change
        <ChevronDown className="size-3.5 transition-transform duration-fast ease-snappy group-open/share:rotate-180" aria-hidden />
      </summary>
      <fieldset className="mt-2 w-full min-w-56 space-y-1 rounded-md border-2 border-foreground bg-background p-2.5 hard-shadow-sm sm:absolute sm:left-0 sm:z-20 sm:w-64">
        <legend className="sr-only">Who can watch {lessonTitle}</legend>
        <p className="px-1 pb-1 text-caption font-semibold text-muted-foreground">Who can watch it</p>
        {cohorts.map((c) => (
          <label key={c.id} className="flex min-h-10 cursor-pointer items-center gap-2 rounded-md px-1.5 text-sm font-semibold hover:bg-muted">
            <input
              type="checkbox"
              checked={shared.has(c.id)}
              disabled={busy !== null}
              onChange={(e) => toggle(c.id, e.target.checked)}
              className="size-4 accent-[#1d44d8]"
            />
            <span className="min-w-0 flex-1 break-words">
              {c.name}
              {c.status === "ended" ? <span className="font-normal text-muted-foreground"> · ended</span> : null}
            </span>
            {busy === c.id ? <Loader2 className="size-3.5 animate-spin" aria-hidden /> : null}
          </label>
        ))}
        {err ? (
          <p role="alert" className={cn("px-1 text-caption font-semibold text-status-alert-fg")}>
            {err}
          </p>
        ) : null}
      </fieldset>
    </details>
  );
}
