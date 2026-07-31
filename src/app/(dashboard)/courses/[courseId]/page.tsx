import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export default async function CourseIndexPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const session = await getSession();
  if (session.status !== "ok") return null;

  const supabase = await createClient();

  const [{ data: lessons }, { data: progress }] = await Promise.all([
    supabase
      .from("lessons")
      .select("id, order_index, video_storage_path")
      .eq("course_id", courseId)
      .order("order_index", { ascending: true }),
    supabase
      .from("progress")
      .select("lesson_id, is_completed")
      .eq("user_id", session.profile.id),
  ]);

  const playable = (lessons ?? []).filter((l) => l.video_storage_path);
  if (playable.length === 0) {
    // No playable content yet — nothing to redirect into.
    notFound();
  }

  const completedIds = new Set(
    (progress ?? []).filter((p) => p.is_completed).map((p) => p.lesson_id),
  );

  // Land on the first not-yet-completed lesson (resume point), or the
  // first lesson if the course hasn't been started at all.
  const target = playable.find((l) => !completedIds.has(l.id)) ?? playable[0];

  redirect(`/courses/${courseId}/lessons/${target.id}`);
}
