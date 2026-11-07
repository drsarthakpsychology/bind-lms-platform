/**
 * Home's one Continue card: the single most useful next step. Pure, so the
 * order is easy to read and test.
 *
 * Order:
 *  1. A Study re-test that is due (it fades if skipped).
 *  2. The next lecture or assignment in the live course (unless the student
 *     has not started lectures but is already partway through Study).
 *  3. Study: where the student stopped, or the first section.
 *  4. Their weakest topic, to practise.
 *  5. Today's Daily case.
 *  6. Lectures (nothing else is open yet).
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
  lecture: { title: string; href: string; week: number; number: number | null; kind: "lesson" | "assignment"; started: boolean } | null;
  /** Study's own next step (null when Study is locked). */
  study: { kind: string; label: string; href: string; module: string | null; resumed: boolean } | null;
  weakest: { title: string; href: string } | null;
  dailyCase: boolean;
};

export function pickContinue(i: ContinueInput): ContinueStep {
  if (i.study?.kind === "retest") {
    return { kind: "retest", eyebrow: "Due today", title: i.study.label, meta: "A short test so it sticks.", href: i.study.href, cta: "Start test" };
  }
  if (i.lecture && (i.lecture.started || !i.study?.resumed)) {
    const l = i.lecture;
    if (l.kind === "assignment") {
      return { kind: "assignment", eyebrow: "To do", title: l.title, meta: `Week ${l.week} assignment`, href: l.href, cta: "Open" };
    }
    return {
      kind: "lecture",
      eyebrow: l.started ? "Continue watching" : "Start here",
      title: l.title,
      meta: `Week ${l.week}${l.number ? ` · Lecture ${l.number}` : ""}`,
      href: l.href,
      cta: l.started ? "Resume" : "Watch",
    };
  }
  if (i.study && i.study.kind !== "done") {
    return {
      kind: "study",
      eyebrow: i.study.resumed ? "Continue studying" : "Start studying",
      title: i.study.label,
      meta: i.study.module,
      href: i.study.href,
      cta: i.study.resumed ? "Continue" : "Start",
    };
  }
  if (i.weakest) {
    return { kind: "weak", eyebrow: "Needs work", title: i.weakest.title, meta: "Ten questions on your weakest topic.", href: i.weakest.href, cta: "Practise" };
  }
  if (i.dailyCase) {
    return { kind: "daily", eyebrow: "Today", title: "Daily case", meta: "One new patient. Name it in as few clues as you can.", href: "/games/daily", cta: "Play" };
  }
  return { kind: "lectures", eyebrow: "Lectures", title: "Your lectures", meta: "New ones appear here first.", href: "/courses", cta: "Open" };
}
