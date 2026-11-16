import "server-only";
import { loadMyLeague } from "@/lib/leagues/board";
import { loadQuizBoard } from "@/lib/learn/leaderboard";
import { loadMyBoard } from "@/lib/standing/board";
import { loadMyCohorts } from "@/lib/cohorts/access";
import { BOARDS, scopeLine } from "@/lib/standing/boards";
import { loadAccuracyBoard } from "@/lib/games-sims/server/results";
import type { ApiGate } from "@/lib/auth/api-guard";
import type { Leaderboard } from "./contract-practise-admin";

/**
 * Leaderboards for the app, from the website's own board loaders: the weekly
 * league (loadMyLeague), the quiz board (loadQuizBoard), the overall board
 * (loadMyBoard) and each game's accuracy board (loadAccuracyBoard). Every
 * board shows the student's own cohort only, as on the website. Other
 * students' account ids are never sent.
 */
export const BOARD_GATES: Record<"league" | "quiz" | "overall", ApiGate> = {
  league: { path: "/leaderboard" },
  quiz: { path: "/games/leaderboard", flag: "learn" },
  overall: { path: "/leaderboard/overall" },
};

/** The games that keep an accuracy board this week. */
export const GAME_BOARDS = ["rx", "mse", "comorbid"] as const;
export type GameBoard = (typeof GAME_BOARDS)[number];

async function scope(userId: string): Promise<string> {
  return scopeLine((await loadMyCohorts(userId).catch(() => [])).map((c) => c.name));
}

export async function leaderboard(board: "league" | "quiz" | "overall", userId: string): Promise<Leaderboard> {
  const b = BOARDS[board];
  const head = { v: 1 as const, board, label: b.label, period: b.period, explainer: b.explainer };
  if (board === "league") {
    const data = await loadMyLeague(userId);
    const rows = data.league.view.flatMap((x) => (x.entry ? [{ rank: x.entry.rank, name: x.entry.name, points: x.entry.points, me: x.entry.me, title: x.entry.title, extra: { look: x.entry.look } }] : []));
    return { ...head, scope: null, rows, me: { rank: data.league.myRank, total: data.groupSize }, raw: data as unknown as Record<string, unknown> };
  }
  if (board === "quiz") {
    const [{ rows, myRank, total }, line] = await Promise.all([loadQuizBoard(userId), scope(userId)]);
    return { ...head, scope: line, rows: rows.map((r) => ({ rank: r.rank, name: r.name, points: r.weekXp, me: r.me, title: null, extra: { xp: r.xp, streak: r.streak } })), me: { rank: myRank, total }, raw: {} };
  }
  const [{ rows, me }, line] = await Promise.all([loadMyBoard(userId), scope(userId)]);
  return {
    ...head,
    scope: line,
    rows: rows.map((r) => ({ rank: r.rank, name: r.name, points: r.points, me: r.userId === userId, title: r.title, extra: { level: r.level, hours: r.hours, lessonsDone: r.lessonsDone } })),
    me: { rank: me?.rank ?? null, total: rows.length },
    raw: me ? { me: { ...me, userId: undefined } } : {},
  };
}

export async function gameBoard(game: GameBoard, userId: string): Promise<Leaderboard> {
  const { ranked, mine, live } = await loadAccuracyBoard(game, userId);
  return {
    v: 1,
    board: `game:${game}`,
    label: "This week's accuracy",
    period: "This week",
    explainer: "Ranked on accuracy, with enough answers this week.",
    scope: await scope(userId),
    rows: ranked.map((r) => ({ rank: r.rank, name: r.name, points: r.accuracy, me: r.me, title: null, extra: { tags: r.tags, bestStreak: r.bestStreak, rounds: r.rounds } })),
    me: { rank: mine?.rank ?? null, total: ranked.length },
    raw: { live },
  };
}
