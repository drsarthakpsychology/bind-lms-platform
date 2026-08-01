import Link from "next/link";
import { Inbox } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SubmissionRow } from "./submission-row";

import { PageHeader } from "@/components/design-system/page-header";
import { EmptyState } from "@/components/design-system/empty-state";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  const pendingCount = (submissions ?? []).filter((s) => s.status !== "approved").length;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Submissions"
        description="Assignments students have submitted, across every course."
      />

      <Tabs value={showApproved ? "approved" : "pending"} defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending" asChild>
            <Link href="/admin/submissions">Pending</Link>
          </TabsTrigger>
          <TabsTrigger value="approved" asChild>
            <Link href="/admin/submissions?filter=approved">Approved</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {enriched.length === 0 ? (
        <EmptyState
          icon={<Inbox className="size-6" aria-hidden />}
          title={showApproved ? "Nothing approved yet" : "No pending submissions"}
          description={
            showApproved
              ? "Approved assignments will appear here."
              : pendingCount === 0
                ? "You're all caught up."
                : "Check back when students submit work."
          }
        />
      ) : (
        <div className="space-y-3">
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
      )}
    </div>
  );
}
