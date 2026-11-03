import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { GraduationCap, Sparkles } from "lucide-react";

import { getSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { VIEW_MODE_COOKIE } from "../view-mode-constants";

import { PageHeader } from "@/components/design-system/page-header";
import { EmptyState } from "@/components/design-system/empty-state";
import { loadCourseOverview } from "@/components/course/course-overview";
import { visibleCourseIds } from "@/lib/cohorts/access";
import { StudentHome } from "@/components/course/student-home";
import { PracticeToolsSection } from "./practice-tools-section";
import { StudyCard } from "./study-card";
import { StandingCard } from "@/components/standing/standing-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default async function DashboardPage() {
  const session = await getSession();

  if (session.status !== "ok") {
    return null;
  }

  const { profile } = session;

  const cookieStore = await cookies();
  const viewingAsStudent = cookieStore.get(VIEW_MODE_COOKIE)?.value === "student";

  if (profile.role === "admin" && !viewingAsStudent) {
    redirect("/admin");
  }

  // The go-live roster is lectures_only. An admin previewing the student side
  // must see exactly what those students see. A roster student has no
  // enrollment rows, so "their course" is every published course — the single
  // canonical structured view below, never a separate flat lecture list.
  const effectiveScope =
    profile.role === "admin" && viewingAsStudent ? "lectures_only" : profile.scope;

  const supabase = await createClient();

  // Truthful student view: a student sees only published courses they're
  // enrolled in. A lectures_only roster student sees every published course
  // (no enrollment rows, by design). When an admin previews as a student the
  // same rule applies.
  const [{ data: courses }, { data: enrollments }] = await Promise.all([
    supabase
      .from("courses")
      .select("id, title, is_published")
      .eq("is_published", true)
      .order("title", { ascending: true }),
    supabase.from("course_enrollments").select("course_id").eq("user_id", profile.id),
  ]);

  const enrolledIds = new Set((enrollments ?? []).map((e) => e.course_id));
  const legacy =
    effectiveScope === "lectures_only"
      ? (courses ?? [])
      : (courses ?? []).filter((c) => enrolledIds.has(c.id));
  // Cohort members see the courses that hold lectures shared with their cohort.
  const visible = new Set(
    await visibleCourseIds(profile.id, profile.role === "admin", (courses ?? []).map((c) => c.id), legacy.map((c) => c.id)),
  );
  const myCourses = (courses ?? []).filter((c) => visible.has(c.id));

  // Home: the student's "what do I do today?" screen, built around their main
  // course (the one in progress, else the first). Other courses are listed
  // underneath. Practice tools (switched on per programme) follow.
  if (myCourses.length === 0) {
    return (
      <div className="space-y-8">
        <PageHeader eyebrow="Home" title="Welcome to VIBHA." description="Your lectures will appear here as soon as your course opens." />
        <EmptyState
          icon={<GraduationCap className="size-6" aria-hidden />}
          title="No courses yet"
          description="Your course appears here when it's available."
        />
      </div>
    );
  }

  const models = (
    await Promise.all(myCourses.map((c) => loadCourseOverview(c.id, profile)))
  ).filter((m): m is NonNullable<typeof m> => m !== null);
  const main =
    models.find((m) => m.started && m.completedCount < m.totalLessons) ??
    models.find((m) => m.completedCount < m.totalLessons) ??
    models[0];

  return (
    <div className="space-y-8">
      {viewingAsStudent && profile.role === "admin" && (
        <Alert variant="warning" className="border-foreground hard-shadow-sm">
          <Sparkles className="size-4" aria-hidden />
          <AlertTitle>You&apos;re seeing what students see</AlertTitle>
          <AlertDescription>Only published courses are shown. Use “Back to admin” at the top to return.</AlertDescription>
        </Alert>
      )}
      {main ? (
        <StudentHome
          model={main}
          otherCourses={models.filter((m) => m !== main).map((m) => ({ id: m.courseId, title: m.title }))}
          practice={
            <div className="space-y-6">
              <StandingCard userId={profile.id} />
              <StudyCard />
              <PracticeToolsSection />
            </div>
          }
        />
      ) : null}
    </div>
  );
}
