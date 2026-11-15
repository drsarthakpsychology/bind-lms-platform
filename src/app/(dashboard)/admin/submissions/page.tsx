import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guards";
import Link from "next/link";
import { loadSubmissionReview } from "@/lib/admin/submissions-review";
import { Inbox } from "lucide-react";
import { SubmissionReviewRow } from "./submission-review-row";

import { PageHeader } from "@/components/design-system/page-header";
import { EmptyState } from "@/components/design-system/empty-state";
import { Badge } from "@/components/ui/badge";

function formatSubmitted(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string; assignment?: string; status?: string }>;
}) {
  // Defence in depth: layouts don't re-render on every navigation, so the page
  // re-checks admin itself before reading data.
  if (!(await requireAdmin())) redirect("/dashboard");
  const { course: courseFilter, assignment: assignmentFilter, status: statusFilter } = await searchParams;

  const { enriched, pendingCount, courses, assignments } = await loadSubmissionReview({ courseFilter, assignmentFilter, statusFilter });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Submissions"
        description="Work students have submitted, across every course."
        badge={
          <Badge variant={pendingCount > 0 ? "pending" : "draft"}>
            {pendingCount} pending review
          </Badge>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/admin/submissions"
          className="rounded-md border-2 border-foreground bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
        >
          All
        </Link>
        <Link
          href="/admin/submissions?status=pending"
          className="rounded-md border-2 border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent"
        >
          Pending
        </Link>
        <Link
          href="/admin/submissions?status=graded"
          className="rounded-md border-2 border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent"
        >
          Graded
        </Link>
      </div>

      {/* Course + assignment filters */}
      <div className="flex flex-wrap gap-2">
        <form action="/admin/submissions" method="get" className="flex flex-wrap items-center gap-2">
          <select
            name="course"
            defaultValue={courseFilter ?? ""}
            className="h-9 rounded-md border-2 border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/60"
          >
            <option value="">All courses</option>
            {(courses ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
          <select
            name="assignment"
            defaultValue={assignmentFilter ?? ""}
            className="h-9 rounded-md border-2 border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/60"
          >
            <option value="">All assignments</option>
            {(assignments ?? []).map((a) => (
              <option key={a.id} value={a.id}>
                {a.title ?? a.prompt_text?.slice(0, 40) ?? "Assignment"}
              </option>
            ))}
          </select>
          <button type="submit" className="rounded-md border-2 border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-accent">
            Filter
          </button>
        </form>
      </div>

      {enriched.length === 0 ? (
        <EmptyState
          icon={<Inbox className="size-6" aria-hidden />}
          title="No submissions match"
          description={pendingCount === 0 ? "You're all caught up." : "Try a different filter."}
        />
      ) : (
        <div className="space-y-3">
          {enriched.map((s) => (
            <SubmissionReviewRow
              key={s.id}
              submissionId={s.id}
              studentEmail={s.studentEmail}
              courseTitle={s.courseTitle}
              lessonTitle={s.lessonTitle}
              assignmentTitle={s.assignmentTitle}
              submittedAt={formatSubmitted(s.submitted_at)}
              isLate={s.is_late}
              status={s.status}
              textContent={s.text_content}
              audioStoragePath={s.audio_storage_path}
              note={s.note}
              score={s.score}
              feedback={s.feedback}
              files={s.files.map((f) => ({
                id: f.id,
                originalName: f.original_name,
                storagePath: f.storage_path,
                format: f.format,
              }))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
