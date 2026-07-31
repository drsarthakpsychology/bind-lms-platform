import { createClient } from "@/lib/supabase/server";
import { SubmissionRow } from "./submission-row";

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const showApproved = filter === "approved";

  const supabase = await createClient();

  const [
    { data: submissions },
    { data: assignments },
    { data: lessons },
    { data: courses },
    { data: profiles },
  ] = await Promise.all([
    supabase
      .from("submissions")
      .select("id, assignment_id, user_id, text_content, audio_storage_path, status"),
    supabase.from("assignments").select("id, lesson_id, prompt_text"),
    supabase.from("lessons").select("id, title, course_id"),
    supabase.from("courses").select("id, title"),
    supabase.from("profiles").select("id, email"),
  ]);

  const assignmentsById = new Map((assignments ?? []).map((a) => [a.id, a]));
  const lessonsById = new Map((lessons ?? []).map((l) => [l.id, l]));
  const coursesById = new Map((courses ?? []).map((c) => [c.id, c]));
  const emailsById = new Map((profiles ?? []).map((p) => [p.id, p.email]));

  const enriched = (submissions ?? [])
    .map((submission) => {
      const assignment = assignmentsById.get(submission.assignment_id);
      const lesson = assignment ? lessonsById.get(assignment.lesson_id) : undefined;
      const course = lesson ? coursesById.get(lesson.course_id) : undefined;
      return {
        ...submission,
        promptText: assignment?.prompt_text ?? null,
        lessonTitle: lesson?.title ?? "Unknown lesson",
        courseTitle: course?.title ?? "Unknown course",
        studentEmail: emailsById.get(submission.user_id) ?? submission.user_id,
      };
    })
    .filter((s) => (showApproved ? s.status === "approved" : s.status !== "approved"));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Submissions
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Assignments students have submitted, across every course.
        </p>
      </div>

      <div className="flex gap-1 border-b border-border">
        <a
          href="/admin/submissions"
          className={
            !showApproved
              ? "border-b-2 border-primary px-3 py-2 text-sm font-medium text-foreground"
              : "px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
          }
        >
          Pending
        </a>
        <a
          href="/admin/submissions?filter=approved"
          className={
            showApproved
              ? "border-b-2 border-primary px-3 py-2 text-sm font-medium text-foreground"
              : "px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
          }
        >
          Approved
        </a>
      </div>

      <div className="space-y-3">
        {enriched.length === 0 && (
          <p className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
            {showApproved ? "Nothing approved yet." : "No pending submissions."}
          </p>
        )}
        {enriched.map((submission) => (
          <SubmissionRow
            key={submission.id}
            submissionId={submission.id}
            studentEmail={submission.studentEmail}
            courseTitle={submission.courseTitle}
            lessonTitle={submission.lessonTitle}
            promptText={submission.promptText}
            textContent={submission.text_content}
            audioStoragePath={submission.audio_storage_path}
            status={submission.status === "approved" ? "approved" : "pending_review"}
          />
        ))}
      </div>
    </div>
  );
}
