import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PlayCircle } from "lucide-react";

import { getSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { VIEW_MODE_COOKIE } from "../view-mode-constants";
import { PageHeader } from "@/components/design-system/page-header";
import { EmptyState } from "@/components/design-system/empty-state";

/**
 * /courses — "Lectures" in the navigation. With one course (the usual case)
 * it opens that course's library straight away; with several it lists them.
 * Same visibility rules as Home: roster (lectures-only) students see every
 * published course, others see the courses they're enrolled in.
 */
export default async function LecturesIndexPage() {
  const session = await getSession();
  if (session.status !== "ok") return null;
  const { profile } = session;

  const viewingAsStudent = (await cookies()).get(VIEW_MODE_COOKIE)?.value === "student";
  if (profile.role === "admin" && !viewingAsStudent) redirect("/admin/courses");
  const scope = profile.role === "admin" ? "lectures_only" : profile.scope;

  const supabase = await createClient();
  const [{ data: courses }, { data: enrollments }] = await Promise.all([
    supabase.from("courses").select("id, title").eq("is_published", true).order("title", { ascending: true }),
    supabase.from("course_enrollments").select("course_id").eq("user_id", profile.id),
  ]);
  const enrolled = new Set((enrollments ?? []).map((e) => e.course_id));
  const mine = scope === "lectures_only" ? (courses ?? []) : (courses ?? []).filter((c) => enrolled.has(c.id));

  if (mine.length === 1) redirect(`/courses/${mine[0].id}`);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Lectures" title="Your courses" description="Pick a course to see its lectures." />
      {mine.length === 0 ? (
        <EmptyState
          icon={<PlayCircle className="size-6" aria-hidden />}
          title="No courses yet"
          description="Your course appears here when it's available."
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {mine.map((c) => (
            <li key={c.id}>
              <Link
                href={`/courses/${c.id}`}
                className="group flex h-full items-center gap-4 rounded-2xl border-2 border-foreground bg-card p-4 transition-[transform,box-shadow] duration-fast ease-snappy hover:-translate-x-0.5 hover:-translate-y-0.5 hover:hard-shadow-md active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                <span className="flex aspect-video w-24 shrink-0 items-center justify-center rounded-xl border-2 border-foreground bg-brand text-primary">
                  <PlayCircle className="size-8" aria-hidden />
                </span>
                <span className="text-h3 break-words">{c.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
