import { notFound, redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guards";
import Link from "next/link";
import { LessonThumb } from "@/components/course/lesson-thumb";
import { ChevronDown, ChevronLeft, FileVideo2, ListPlus, Paperclip } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { LessonForm } from "./lesson-form";
import { VideoUpload } from "./video-upload";
import { DeleteLessonButton } from "./delete-lesson-button";
import { LessonStatusToggle, type LessonStatus } from "./lesson-status-toggle";
import { EditLesson, type EditLessonInitial } from "./edit-lesson";
import { MoveLessonButton } from "./move-lesson-button";
import { AssignmentToggle } from "./assignment-toggle";
import { CourseActions } from "../course-actions";
import { CoursePeoplePanel } from "./course-people";
import { loadCoursePeople } from "./people-actions";
import { MaterialUploader } from "./material-uploader";
import { RenameCourse } from "./rename-course";
import { LessonCohortChips, LessonCohortEditor } from "./lesson-cohorts";
import { loadCourseCohorts } from "@/lib/cohorts/admin-data";
import { defaultRecordingChoice, filterByCohort, liveCohorts, type CourseCohortLite } from "@/lib/cohorts/rules";
import { cn } from "@/lib/utils";

import { PageHeader } from "@/components/design-system/page-header";
import { EmptyState } from "@/components/design-system/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const STATUS_BADGES: Record<LessonStatus, { label: string; variant: "published" | "pending" | "draft" }> = {
  hidden: { label: "Hidden", variant: "draft" },
  live: { label: "Yet to be live", variant: "pending" },
  unlocked: { label: "Unlocked", variant: "published" },
};

/**
 * Map a raw lesson.status to a plain-word badge. Missing/null values mean the
 * lesson predates the three-state model: students see those as playable
 * (unlocked), so the builder says the same thing instead of "Yet to be live".
 */
function statusBadge(status: unknown): { label: string; variant: "published" | "pending" | "draft" } {
  if (status === "live") return STATUS_BADGES.live;
  if (status === "hidden") return STATUS_BADGES.hidden;
  return STATUS_BADGES.unlocked;
}

type LessonRow = {
  id: string;
  title: string;
  order_index: number;
  week: number | null;
  requires_assignment: boolean;
  video_storage_path: string | null;
  video_status: string | null;
  description: string | null;
  status: string | null;
};

export default async function CourseDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ cohort?: string | string[] }>;
}) {
  // Defence in depth: layouts don't re-render on every navigation, so the page
  // re-checks admin itself before reading data.
  if (!(await requireAdmin())) redirect("/dashboard");
  const { courseId } = await params;
  const sp = await searchParams;
  const cohortParam = typeof sp.cohort === "string" ? sp.cohort : null;
  const supabase = await createClient();

  const [{ data: course }, { data: lessons }, { data: courseMaterials }, { data: assignments }] =
    await Promise.all([
      supabase.from("courses").select("id, title, is_published, weeks").eq("id", courseId).single(),
      supabase
        .from("lessons")
        .select("id, title, order_index, week, requires_assignment, video_storage_path, video_status, description, status")
        .eq("course_id", courseId)
        .order("order_index", { ascending: true })
        .order("id", { ascending: true }),
      supabase
        .from("materials")
        .select("id, title, kind, format, size_bytes, url, storage_path")
        .eq("course_id", courseId)
        .is("lesson_id", null)
        .order("sort_order", { ascending: true }),
      supabase
        .from("assignments")
        .select("id, lesson_id, is_published, instructions, prompt_text, lessons!inner(course_id)")
        .eq("lessons.course_id", courseId),
    ]);

  if (!course) {
    notFound();
  }

  const rows = (lessons ?? []) as LessonRow[];
  const nextOrderIndex = rows.length ? Math.max(...rows.map((l) => l.order_index)) + 1 : 1;
  const defaultWeek = rows.length ? Math.max(1, ...rows.map((l) => l.week ?? 1)) : 1;
  const [people, courseCohorts] = await Promise.all([loadCoursePeople(courseId), loadCourseCohorts(courseId)]);
  const cohorts = courseCohorts.ready ? courseCohorts.cohorts : [];
  // ?cohort=<id> (or "none") filters the list and pre-picks the upload form.
  const cohortFilter = cohortParam && (cohortParam === "none" || cohorts.some((c) => c.id === cohortParam)) ? cohortParam : null;
  const shown = courseCohorts.ready ? filterByCohort(rows, courseCohorts.links, cohortFilter) : rows;
  const unshared = courseCohorts.ready ? filterByCohort(rows, courseCohorts.links, "none").length : 0;
  const filterName = cohortFilter === "none" ? "not shared" : cohorts.find((c) => c.id === cohortFilter)?.name;

  // Week-aware listing: mirror the student's Week N groups so the admin
  // reasons in the same units the cohort does. Lessons with a null week
  // (pre-week model) land in week 1, matching the student page.
  const weeks = new Map<number, LessonRow[]>();
  for (const l of shown) {
    const w = l.week ?? 1;
    const list = weeks.get(w) ?? [];
    list.push(l);
    weeks.set(w, list);
  }
  const orderedWeeks = Array.from(weeks.entries()).sort((a, b) => a[0] - b[0]);

  const assignmentByLesson = new Map<string, { id: string; is_published: boolean; instructions: string | null; prompt_text: string | null }>();
  for (const a of assignments ?? []) {
    assignmentByLesson.set(a.lesson_id, a);
  }

  return (
    <div className="space-y-8">
      <Link
        href="/admin/courses"
        className="inline-flex items-center gap-1.5 text-small font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="size-4" aria-hidden />
        Courses
      </Link>

      <PageHeader
        eyebrow="Course builder"
        title={<RenameCourse courseId={course.id} title={course.title} />}
        badge={
          course.is_published ? (
            <Badge variant="published">Published</Badge>
          ) : (
            <Badge variant="draft">Draft</Badge>
          )
        }
        description={
          course.is_published
            ? "Students can see this course. Changes show up right away."
            : "Students can't see this course until you publish it."
        }
        actions={<CourseActions courseId={course.id} isPublished={course.is_published} showOpenBuilder={false} />}
      />

      {/* Who is in this course, its cohorts, and the next cohort. */}
      <CoursePeoplePanel courseId={courseId} lectureCount={rows.length} data={people} />

      {/* De-densified admin surface (T44): each management task is an accordion
          section, open-by-default for the primary create action and collapsed
          for the secondary sections, so mobile isn't one long scroll of
          competing forms. */}
      <details open={rows.length === 0 || Boolean(cohortFilter && cohortFilter !== "none")} className="group rounded-2xl border-2 border-foreground bg-primary/30 hard-shadow-sm open:bg-card">
        <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-body-strong [&::-webkit-details-marker]:hidden">
          <ListPlus className="size-4 text-link" aria-hidden />
          Add a lesson
          <ChevronDown
            className="ml-auto size-4 text-muted-foreground transition-transform duration-fast ease-snappy group-open:rotate-180"
            aria-hidden
          />
        </summary>
        <div className="border-t-2 border-border px-4 py-4">
          <LessonForm
            courseId={courseId}
            nextOrderIndex={nextOrderIndex}
            defaultWeek={defaultWeek}
            cohorts={liveCohorts(cohorts).map((c) => ({ id: c.id, name: c.name }))}
            initialCohort={defaultRecordingChoice(cohorts, cohortFilter)}
          />
        </div>
      </details>

      <section aria-labelledby="lessons-heading" className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 id="lessons-heading" className="text-h2">
            Lessons
          </h2>
          <Badge variant="secondary">{cohortFilter ? `${shown.length} of ${rows.length}` : rows.length}</Badge>
        </div>

        {cohorts.length ? <CohortFilter courseId={courseId} cohorts={cohorts} active={cohortFilter} unshared={unshared} /> : null}

        {rows.length === 0 ? (
          <EmptyState
            icon={<FileVideo2 className="size-6" aria-hidden />}
            title="No lessons yet"
            description="Add your first lesson above. It starts with a video."
          />
        ) : shown.length === 0 ? (
          <EmptyState
            icon={<FileVideo2 className="size-6" aria-hidden />}
            title={cohortFilter === "none" ? "Every lesson is shared" : `No lessons for ${filterName ?? "this cohort"} yet`}
            description={cohortFilter === "none" ? "Each lesson is shared with at least one cohort." : "Add one above, or use Change on a lesson to share it."}
          />
        ) : (
          orderedWeeks.map(([weekNum, weekLessons]) => (
            <div key={weekNum} className="space-y-2">
              <h3 className="flex items-center gap-2 px-1 text-h2">
                <span className="flex size-9 items-center justify-center rounded-lg border-2 border-foreground bg-brand font-pix text-xs text-brand-foreground">
                  {String(weekNum).padStart(2, "0")}
                </span>
                Week {weekNum}
                <span className="text-caption font-semibold text-muted-foreground">{weekLessons.length} lectures</span>
              </h3>
              <div className="space-y-3">
                {weekLessons.map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    courseId={courseId}
                    assignment={assignmentByLesson.get(lesson.id)}
                    cohorts={courseCohorts.ready ? cohorts : null}
                    sharedWith={courseCohorts.links.get(lesson.id) ?? []}
                    isFirstInCourse={lesson.order_index === rows[0]?.order_index}
                    isLastInCourse={lesson.order_index === rows[rows.length - 1]?.order_index}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </section>

      <details className="group rounded-2xl border-2 border-foreground bg-card hard-shadow-sm">
        <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-body-strong [&::-webkit-details-marker]:hidden">
          <Paperclip className="size-4 text-link" aria-hidden />
          Course materials
          <Badge variant="secondary" className="ml-1">
            {(courseMaterials ?? []).length}
          </Badge>
          <ChevronDown
            className="ml-auto size-4 text-muted-foreground transition-transform duration-fast ease-snappy group-open:rotate-180"
            aria-hidden
          />
        </summary>
        <div className="border-t-2 border-border px-4 py-4">
          <MaterialUploader
            courseId={courseId}
            lessonId={null}
            materials={(courseMaterials ?? []).map((m) => ({
              id: m.id,
              title: m.title,
              kind: m.kind,
              format: m.format,
              sizeBytes: m.size_bytes,
              url: m.url,
              storagePath: m.storage_path,
            }))}
          />
        </div>
      </details>

    </div>
  );
}

function LessonCard({
  lesson,
  courseId,
  assignment,
  cohorts,
  sharedWith,
  isFirstInCourse,
  isLastInCourse,
}: {
  lesson: LessonRow;
  courseId: string;
  assignment: { id: string; is_published: boolean; instructions: string | null; prompt_text: string | null } | undefined;
  /** This course's cohorts; null when the cohort tables aren't there. */
  cohorts: CourseCohortLite[] | null;
  sharedWith: string[];
  isFirstInCourse: boolean;
  isLastInCourse: boolean;
}) {
  const badge = statusBadge(lesson.status);

  // Video state: no path → none; path + failed → upload didn't land; path +
  // pending → uploaded but not yet verified; path + ready → playable.
  const videoBadge = !lesson.video_storage_path
    ? { label: "No video", variant: "outline" as const }
    : lesson.video_status === "failed"
      ? { label: "Video upload failed", variant: "destructive" as const }
      : lesson.video_status === "ready" || lesson.video_status === null
        ? { label: "Video attached", variant: "published" as const }
        : { label: "Processing video…", variant: "pending" as const };

  const editInitial: EditLessonInitial = {
    title: lesson.title,
    description: lesson.description ?? "",
    week: lesson.week ?? 1,
    requiresAssignment: lesson.requires_assignment,
    assignmentPrompt: assignment?.instructions ?? assignment?.prompt_text ?? "",
  };

  return (
    <div className="grid gap-4 rounded-2xl border-2 border-foreground bg-card p-3 transition-shadow duration-fast hover:hard-shadow-sm sm:grid-cols-[9rem_minmax(0,1fr)] sm:p-4 xl:grid-cols-[10rem_minmax(0,1fr)_auto]">
      {/* Studio-style row: thumbnail · title + status · actions */}
      <div className="hidden sm:block">
        <LessonThumb
          number={lesson.order_index}
          state={lesson.status === "hidden" ? "later" : lesson.status === "live" ? "live" : "open"}
        />
      </div>
      <div className="min-w-0 self-center">
        <p className="text-h3 break-words">
          <span className="mr-2 font-pix text-sm text-link sm:hidden">{String(lesson.order_index).padStart(2, "0")}</span>
          {lesson.title}
        </p>
        {cohorts && cohorts.length ? (
          <div className="mt-2 flex flex-wrap items-center gap-2" aria-label="Who can watch it">
            <LessonCohortChips sharedWith={sharedWith} cohorts={cohorts} />
            <LessonCohortEditor lessonId={lesson.id} lessonTitle={lesson.title} sharedWith={sharedWith} cohorts={cohorts} />
          </div>
        ) : null}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge variant={badge.variant}>{badge.label}</Badge>
          <Badge variant={videoBadge.variant}>{videoBadge.label}</Badge>
          {assignment ? (
            <AssignmentToggle lessonId={lesson.id} courseId={courseId} published={assignment.is_published} />
          ) : lesson.requires_assignment ? (
            <Badge variant="draft">Assignment needs setup</Badge>
          ) : null}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 border-t-2 border-foreground/10 pt-3 sm:col-span-2 xl:col-span-1 xl:border-t-0 xl:pt-0 xl:justify-end">
        <VideoUpload lessonId={lesson.id} courseId={courseId} hasVideo={Boolean(lesson.video_storage_path)} />
        {lesson.video_storage_path && (
          <Button asChild variant="outline" size="sm">
            <Link href={`/courses/${courseId}/lessons/${lesson.id}`}>Watch</Link>
          </Button>
        )}
        <LessonStatusToggle lessonId={lesson.id} courseId={courseId} status={(lesson.status ?? "unlocked") as LessonStatus} />
        <EditLesson lessonId={lesson.id} courseId={courseId} initial={editInitial} />
        <span className="flex items-center gap-1">
          <MoveLessonButton lessonId={lesson.id} courseId={courseId} direction="up" disabled={isFirstInCourse} label="Move lesson up" />
          <MoveLessonButton lessonId={lesson.id} courseId={courseId} direction="down" disabled={isLastInCourse} label="Move lesson down" />
        </span>
        <DeleteLessonButton lessonId={lesson.id} courseId={courseId} />
      </div>
    </div>
  );
}

/** All / one cohort / not shared: a link per choice, kept in ?cohort=. */
function CohortFilter({ courseId, cohorts, active, unshared }: { courseId: string; cohorts: CourseCohortLite[]; active: string | null; unshared: number }) {
  const base = `/admin/courses/${courseId}`;
  const items: { key: string; label: string; href: string; on: boolean }[] = [
    { key: "all", label: "All", href: base, on: !active },
    ...cohorts.map((c) => ({ key: c.id, label: c.status === "ended" ? `${c.name} · ended` : c.name, href: `${base}?cohort=${c.id}`, on: active === c.id })),
    ...(unshared || active === "none" ? [{ key: "none", label: `Not shared (${unshared})`, href: `${base}?cohort=none`, on: active === "none" }] : []),
  ];
  return (
    <nav aria-label="Show lessons for" className="flex flex-wrap gap-2">
      {items.map((i) => (
        <Link
          key={i.key}
          href={i.href}
          scroll={false}
          aria-current={i.on ? "page" : undefined}
          className={cn(
            "inline-flex h-9 items-center rounded-full border-2 border-foreground px-3.5 text-sm font-bold transition-[transform,box-shadow] duration-fast ease-snappy hover:-translate-y-px hover:hard-shadow-xs active:translate-y-px active:shadow-none",
            i.on ? "bg-foreground text-background" : "bg-card",
          )}
        >
          {i.label}
        </Link>
      ))}
    </nav>
  );
}
