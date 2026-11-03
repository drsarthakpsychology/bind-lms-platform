import { levelFor } from "@/lib/learn/engine";

/**
 * One number for "how far along am I", fair to every kind of effort:
 * - Notes and games XP (reading, self-checks, tests, games), as earned.
 * - 1 point per minute of lecture watched, plus 25 per lecture finished.
 * - 10 points per hour spent on VIBHA (time alone can't carry you).
 * Everyone starts at Level 1 with 0 points.
 */
export const POINTS = { perLectureMinute: 1, perLectureDone: 25, perHour: 10 } as const;

export type Totals = { learnXp: number; platformSeconds: number; watchedSeconds: number; lessonsDone: number };

export function pointsFor(t: Totals): number {
  return Math.max(
    0,
    Math.round(
      t.learnXp +
        Math.floor(t.watchedSeconds / 60) * POINTS.perLectureMinute +
        t.lessonsDone * POINTS.perLectureDone +
        Math.floor(t.platformSeconds / 3600) * POINTS.perHour,
    ),
  );
}

/** Hours with one decimal, for display ("12.5 h"). */
export const hoursOf = (seconds: number) => Math.round((seconds / 3600) * 10) / 10;

export function standingFor(t: Totals) {
  const points = pointsFor(t);
  const lvl = levelFor(points);
  return { points, level: lvl.level, title: lvl.title, nextTitle: lvl.nextTitle, toNext: lvl.toNext, pct: lvl.pct };
}

/** Rank rows by points (ties share a rank: 1, 2, 2, 4). */
export function rankRows<T extends { points: number }>(rows: T[]): (T & { rank: number })[] {
  const sorted = [...rows].sort((a, b) => b.points - a.points);
  let last = Number.NaN;
  let rank = 0;
  return sorted.map((r, i) => {
    if (r.points !== last) rank = i + 1;
    last = r.points;
    return { ...r, rank };
  });
}
