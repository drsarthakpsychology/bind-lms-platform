/**
 * The student leaderboards, named once so every screen (nav, search,
 * cards, the boards themselves, docs) uses the same words.
 *
 * - Quiz leaderboard: Learn XP from quizzes, games and notes checks, this week.
 *   Lives with Games. Ranking: lib/learn/leaderboard.ts.
 * - Overall leaderboard: level points (lectures + quizzes + time on VIBHA),
 *   all time. Ranking: lib/standing/score.ts.
 *
 * - Weekly league: tiers Neuron → Mind, promotion and relegation, this week.
 *   Home of /leaderboard. Ranking: lib/leagues/*.
 *
 * Pure, so it is testable.
 */
export const BOARDS = {
  league: {
    key: "league",
    label: "Weekly league",
    short: "League",
    href: "/leaderboard",
    explainer: "Points from everything you do this week. Top 5 move up, bottom 5 move down.",
    period: "This week",
  },
  quiz: {
    key: "quiz",
    label: "Quiz leaderboard",
    short: "Quiz",
    href: "/games/leaderboard",
    explainer: "Points from quizzes and games.",
    period: "This week",
  },
  overall: {
    key: "overall",
    label: "Overall leaderboard",
    short: "Overall",
    href: "/leaderboard/overall",
    explainer: "Points from lectures, quizzes and time on VIBHA.",
    period: "All time",
  },
} as const;

export type BoardKey = keyof typeof BOARDS;

/** The old home of the overall board; it redirects to BOARDS.overall.href. */
export const OLD_OVERALL_HREF = "/practice/leaderboard";

/**
 * Who belongs on my board. A student in a cohort sees people who share at
 * least one cohort with them. A student in no cohort sees only others in no
 * cohort, so nobody ever sees another cohort's names.
 */
export function sameGroup(mine: readonly string[], theirs: readonly string[]): boolean {
  if (!mine.length) return !theirs.length;
  return theirs.some((c) => mine.includes(c));
}

/** The plain scope line under a board's title. */
export function scopeLine(cohortNames: readonly string[]): string {
  const who = cohortNames.length ? cohortNames.join(" & ") : "Students not in a cohort yet";
  return `${who} only. First name and initial.`;
}

/**
 * Which rows of a ranked board to show: the top `top`, plus me and the people
 * either side of me. Returns indexes in board order.
 */
export function boardWindow(length: number, meIndex: number, top = 10): number[] {
  const keep = new Set<number>();
  for (let k = 0; k < Math.min(top, length); k++) keep.add(k);
  if (meIndex >= 0 && meIndex < length) for (const k of [meIndex - 1, meIndex, meIndex + 1]) if (k >= 0 && k < length) keep.add(k);
  return [...keep].sort((a, b) => a - b);
}
