/**
 * Home's one Continue card: the single most useful next step. Pure, so the
 * order is easy to read and test.
 *
 * Order: resume exactly where the student left off, else the next new thing.
 *  1. A Study re-test that is due (it fades if skipped).
 *  2. A lecture they stopped part-way through.
 *  3. Study, where they stopped (the section, and in the browser the part).
 *  4. The next lecture or assignment in the live course.
 *  5. Study's first section, for someone who has not started it.
 *  6. Their weakest topic, to practise.
 *  7. Today's Daily case.
 *  8. Lectures (nothing else is open yet).
 */

export type ContinueKind = "retest" | "lecture" | "assignment" | "study" | "weak" | "daily" | "lectures";

export type ContinueStep = {
  kind: ContinueKind;
  /** Small label above the title. */
  eyebrow: string;
  title: string;
  /** One short line under the title, or null. */
  meta: string | null;
  href: string;
  /** Button text. */
  cta: string;
};

export type ContinueInput = {
  /** `started`: the course has begun; `midway`: this very lecture was stopped part-way. */
  lecture: { title: string; href: string; week: number; number: number | null; kind: "lesson" | "assignment"; started: boolean; midway?: boolean } | null;
  /** Study's own next step (null when Study is locked). */
  study: { kind: string; label: string; href: string; module: string | null; resumed: boolean } | null;
  weakest: { title: string; href: string } | null;
  dailyCase: boolean;
};

export function pickContinue(i: ContinueInput): ContinueStep {
  if (i.study?.kind === "retest") {
    return { kind: "retest", eyebrow: "Due today", title: i.study.label, meta: "A short test so it sticks.", href: i.study.href, cta: "Start test" };
  }
  const l = i.lecture;
  const lectureStep = (): ContinueStep | null => {
    if (!l) return null;
    if (l.kind === "assignment") {
      return { kind: "assignment", eyebrow: "To do", title: l.title, meta: `Week ${l.week} assignment`, href: l.href, cta: "Open" };
    }
    return {
      kind: "lecture",
      eyebrow: l.midway ? "Continue watching" : l.started ? "Up next" : "Start here",
      title: l.title,
      meta: `Week ${l.week}${l.number ? ` · Lecture ${l.number}` : ""}`,
      href: l.href,
      cta: l.midway ? "Resume" : "Watch",
    };
  };
  const studyOpen = i.study && i.study.kind !== "done" ? i.study : null;
  const studyStep = (s: NonNullable<typeof studyOpen>): ContinueStep => ({
    kind: "study",
    eyebrow: s.resumed ? "Continue studying" : "Start studying",
    title: s.label,
    meta: s.module,
    href: s.href,
    cta: s.resumed ? "Continue" : "Start",
  });

  if (l?.midway && l.kind === "lesson") return lectureStep()!;
  if (studyOpen?.resumed) return studyStep(studyOpen);
  if (l) return lectureStep()!;
  if (studyOpen) return studyStep(studyOpen);
  if (i.weakest) {
    return { kind: "weak", eyebrow: "Needs work", title: i.weakest.title, meta: "Your weakest topic.", href: i.weakest.href, cta: "Practise" };
  }
  if (i.dailyCase) {
    return { kind: "daily", eyebrow: "Today", title: "Daily case", meta: "One new patient today.", href: "/practice/daily?from=/dashboard", cta: "Play" };
  }
  return { kind: "lectures", eyebrow: "Lectures", title: "Your lectures", meta: "New ones appear here first.", href: "/courses", cta: "Open" };
}
