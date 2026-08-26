import Link from "next/link";
import { Inbox } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
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
  const { course: courseFilter, assignment: assignmentFilter, status: statusFilter } = await searchParams;

  const supabase = await createClient();

  const [{ data: submissions }, { data: assignments }, { data: lessons }, { data: courses }, { data: profiles }, { data: files }] =
    await Promise.all([
      supabase
        .from("submissions")
        .select("id, assignment_id, user_id, text_content, audio_storage_path, status, note, submitted_at, is_late, score, feedback")
        .order("submitted_at", { ascending: false })
        .limit(200),
      supabase.from("assignments").select("id, lesson_id, title, prompt_text"),
      supabase.from("lessons").select("id, title, course_id"),
      supabase.from("courses").select("id, title"),
      supabase.from("profiles").select("id, email").eq("role", "student"),
      supabase.from("submission_files").select("id, submission_id, original_name, storage_path, format").limit(1000),
    ]);

  const assignmentsById = new Map((assignments ?? []).map((a) => [a.id, a]));
  const lessonsById = new Map((lessons ?? []).map((l) => [l.id, l]));
  const coursesById = new Map((courses ?? []).map((c) => [c.id, c]));
  const emailsById = new Map((profiles ?? []).map((p) => [p.id, p.email]));
  const filesBySubmission = new Map<string, typeof files>();
  for (const f of files ?? []) {
    const list = filesBySubmission.get(f.submission_id) ?? [];
    list.push(f);
    filesBySubmission.set(f.submission_id, list);
  }

  const enriched = (submissions ?? [])
    .map((s) => {
      const assignment = assignmentsById.get(s.assignment_id);
      const lesson = assignment ? lessonsById.get(assignment.lesson_id) : undefined;
      const course = lesson ? coursesById.get(lesson.course_id) : undefined;
      return {
        ...s,
        assignmentTitle: assignment?.title ?? assignment?.prompt_text ?? "Untitled assignment",
        assignmentId: s.assignment_id,
        lessonTitle: lesson?.title ?? "Unknown lesson",
        courseId: course?.id ?? "",
        courseTitle: course?.title ?? "Unknown course",
        studentEmail: emailsById.get(s.user_id) ?? s.user_id,
        files: filesBySubmission.get(s.id) ?? [],
      };
    })
    .filter((s) => {
      if (courseFilter && s.courseId !== courseFilter) return false;
      if (assignmentFilter && s.assignmentId !== assignmentFilter) return false;
      if (statusFilter === "pending" && s.status !== "pending_review") return false;
      if (statusFilter === "graded" && !["returned", "approved"].includes(s.status)) return false;
      return true;
    });

  const pendingCount = (submissions ?? []).filter((s) => s.status === "pending_review").length;

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
