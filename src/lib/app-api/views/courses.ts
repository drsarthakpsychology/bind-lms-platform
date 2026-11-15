import type { OverviewModel } from "@/components/course/course-overview-view";
import type { StrengthsWeaknesses, TopicScore as WebTopicScore } from "@/lib/progress/strengths-core";
import type { ContinueStep as WebStep, UpNextRow as WebUpNext } from "@/app/(dashboard)/dashboard/next-step";
import type { LectureView } from "@/lib/course/lecture";
import type { AssignmentView, SubmissionView } from "@/lib/course/assignment";
import type { QuestCard as WebQuestCard } from "@/lib/hints/server";
import { QUEST_XP } from "@/lib/hints/quests";
import { APP_API_BASE, type QuestCard, type Assignment, type ContinueStep, type CourseDetail, type CourseSummary, type LectureDetail, type Material, type Strengths, type Submission, type TopicScore, type UpNextRow } from "../contract";
import { toAppTarget } from "../target";

/**
 * Website models -> app contract shapes. Pure (tested in views.test.ts): the
 * numbers and rules all come from the website's own loaders; this only
 * renames fields and turns website paths into app targets.
 */

export function courseSummary(m: OverviewModel): CourseSummary {
  return {
    id: m.courseId,
    title: m.title,
    completedCount: m.completedCount,
    totalLessons: m.totalLessons,
    started: m.started,
    next: m.next
      ? { title: m.next.title, week: m.next.week, kind: m.next.kind, number: m.next.number, midway: Boolean(m.next.midway), target: toAppTarget(m.next.href) }
      : null,
  };
}

export function courseDetail(m: OverviewModel): CourseDetail {
  return {
    ...courseSummary(m),
    empty: m.empty,
    myCohorts: m.myCohorts ?? [],
    weeks: m.weeks.map((w) => ({
      num: w.num,
      status: w.status,
      isCurrent: w.isCurrent,
      isFuture: w.isFuture,
      done: w.done,
      total: w.total,
      lessons: w.lessons.map((l) => ({
        id: l.id,
        title: l.title,
        number: l.number,
        state: l.state,
        openable: l.href !== null,
        hasVideo: l.hasVideo,
        ...(l.cohorts ? { cohorts: l.cohorts } : {}),
      })),
      materials: w.materials.map((x) => ({ id: x.id, title: x.title, meta: x.meta, openable: x.href !== null })),
      assignments: w.assignments.map((a) => {
        const t = a.href ? toAppTarget(a.href) : null;
        return {
          id: a.id,
          lessonId: t && t.screen === "lecture" ? t.lessonId : null,
          title: a.title,
          lessonTitle: a.lessonTitle,
          status: a.status,
          isNext: a.isNext,
          openable: a.href !== null,
        };
      }),
    })),
  };
}

export const materialFilePath = (id: string) => `${APP_API_BASE}/materials/${id}/file`;
export const submissionFilePath = (id: string) => `${APP_API_BASE}/submissions/files/${id}`;

export function materialView(m: { id: string; title: string | null; kind: string; format: string | null; size_bytes: number | null; url: string | null; storage_path: string | null; lesson_id: string | null; week?: number | null }): Material {
  const isLink = m.kind === "link" || !m.storage_path;
  return {
    id: m.id,
    title: m.title ?? "Material",
    kind: m.kind,
    format: m.format ?? null,
    sizeBytes: m.size_bytes ?? null,
    lessonId: m.lesson_id ?? null,
    week: m.week ?? null,
    url: m.kind === "link" ? (m.url ?? null) : null,
    filePath: isLink ? null : materialFilePath(m.id),
  };
}

export function submissionOut(s: SubmissionView): Submission {
  return { ...s, files: s.files.map((f) => ({ ...f, filePath: submissionFilePath(f.id) })) };
}

export function assignmentOut(a: AssignmentView): Assignment {
  return { ...a, submission: a.submission ? submissionOut(a.submission) : null };
}

export function lectureOut(l: LectureView): LectureDetail {
  return {
    id: l.id,
    courseId: l.courseId,
    courseTitle: l.courseTitle,
    title: l.title,
    description: l.description,
    week: l.week,
    number: l.number,
    hasVideo: l.hasVideo,
    durationSeconds: l.durationSeconds,
    progress: { watchedSeconds: l.watchedSeconds, completed: l.completed },
    requiresAssignment: l.requiresAssignment,
    assignment:
      l.assignment && l.assignment.published
        ? {
            id: l.assignment.id,
            lessonId: l.id,
            courseId: l.courseId,
            title: l.assignment.title,
            instructions: l.assignment.instructions,
            submissionType: l.assignment.submissionType,
            dueAt: l.assignment.dueAt,
            allowLate: l.assignment.allowLate,
            maxFiles: l.assignment.maxFiles,
            maxFileMb: l.assignment.maxFileMb,
            acceptedFormats: [],
            submission: l.assignment.submission ? submissionOut(l.assignment.submission) : null,
          }
        : null,
    materials: l.materials.map(materialView),
    prev: l.prev,
    next: l.next,
  };
}

export function topicOut(t: WebTopicScore): TopicScore {
  return { id: t.id, title: t.title, kind: t.kind, p: t.p, n: t.n, studyTarget: t.studyHref ? toAppTarget(t.studyHref) : null, practiceTarget: toAppTarget(t.practiceHref) };
}

export function strengthsOut(s: StrengthsWeaknesses): Strengths {
  return { strongest: s.strongest.map(topicOut), weakest: s.weakest.map(topicOut), all: s.all.map(topicOut), hasData: s.hasData };
}

export function stepOut(s: WebStep): ContinueStep {
  return { kind: s.kind, eyebrow: s.eyebrow, title: s.title, meta: s.meta, cta: s.cta, target: toAppTarget(s.href) };
}

export function upNextOut(r: WebUpNext): UpNextRow {
  return { kind: r.kind, title: r.title, meta: r.meta, target: toAppTarget(r.href) };
}

export function questsOut(q: WebQuestCard): QuestCard {
  return {
    done: q.done,
    xpEach: QUEST_XP,
    xpBonus: q.xpBonus,
    spareBonus: q.spareBonus,
    quests: q.quests.map((x) => ({ id: x.id, label: x.label, done: x.done, progress: x.progress, target: toAppTarget(x.href) })),
  };
}
