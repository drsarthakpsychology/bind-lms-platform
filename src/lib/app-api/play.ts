import "server-only";
import type { ApiGate } from "@/lib/auth/api-guard";
import * as blitz from "@/app/(dashboard)/games/blitz/actions";
import * as sort from "@/app/(dashboard)/games/sort/actions";
import * as rx from "@/app/(dashboard)/games/rx/actions";
import * as mse from "@/app/(dashboard)/games/mse/actions";
import * as ward from "@/app/(dashboard)/games/ward/actions";
import * as escape from "@/app/(dashboard)/games/escape/actions";
import * as detective from "@/app/(dashboard)/practice/detective/actions";
import * as daily from "@/app/(dashboard)/practice/daily/actions";
import * as prep from "@/app/(dashboard)/prep/actions";
import * as cases from "@/lib/cases/progress-actions";
import * as comorbid from "@/app/(dashboard)/games/comorbid/actions";
import * as league from "@/app/(dashboard)/leaderboard/actions";
import { z } from "zod";
import { replay, type Setup } from "@/lib/games-sims/comorbid/game";

/**
 * Practise for the app: the website's own server-dealt games and practice
 * tools, called with the same arguments the website's pages send. Every
 * action deals, checks and scores on the server (signed run tokens, server
 * answer keys, XP caps), so the app is exactly as trusted as a browser:
 * it never grades and never sends a score. The answers are the same data
 * objects the website's game screens draw, never HTML.
 *
 * POST /api/app/v1/play/:game/:action  { args: [...] }  ->  PlayResult { kind: "<game>.<action>", v: 1, data }
 *
 * Each game's gate is the website page it stands for (lectures-only scope,
 * sections switched off for the student, feature flags), checked before the
 * action runs; the action then runs its own checks as on the website.
 */
type Action = (...args: never[]) => Promise<unknown>;
export type PlayGame = { gate: ApiGate; actions: Record<string, { run: Action; args: number; write: boolean }> };

const a = (run: Action, args: number, write = true) => ({ run, args, write });

export const PLAY: Record<string, PlayGame> = {
  blitz: { gate: { path: "/games/blitz", flag: "learn" }, actions: { start: a(blitz.startBlitz, 0), answer: a(blitz.answerBlitz, 3), finish: a(blitz.finishBlitz, 1) } },
  sort: { gate: { path: "/games/sort", flag: "learn" }, actions: { load: a(sort.loadSort, 1, false), check: a(sort.checkSort, 1) } },
  rx: { gate: { path: "/games/rx", flag: "learn" }, actions: { deal: a(rx.dealRxRun, 1), pick: a(rx.pickRxAnswer, 1), finish: a(rx.finishRxRun, 1) } },
  mse: { gate: { path: "/games/mse", flag: "learn" }, actions: { deal: a(mse.dealMseRound, 1), tag: a(mse.tagMseFinding, 1) } },
  ward: {
    gate: { path: "/games/ward", flag: "learn" },
    actions: {
      start: a(ward.startWardSolo, 1),
      resume: a(ward.resumeWardSolo, 1),
      pick: a(ward.pickWardSolo, 1),
      createTeam: a(ward.createWardTeam, 1),
      joinTeam: a(ward.joinWardTeam, 1),
      teamView: a(ward.wardTeamView, 1, false),
      vote: a(ward.castWardVote, 1),
    },
  },
  escape: {
    gate: { path: "/games/escape", flag: "learn" },
    actions: {
      start: a(escape.startEscapePractice, 1),
      resume: a(escape.resumeEscapePractice, 1),
      answer: a(escape.answerEscapePractice, 1),
      createTeam: a(escape.createEscapeTeam, 1),
      joinTeam: a(escape.joinEscapeTeam, 1),
      view: a(escape.escapeView, 1, false),
      startTeam: a(escape.startEscapeTeam, 1),
      answerTeam: a(escape.answerEscape, 1),
    },
  },
  detective: {
    gate: { path: "/practice/detective", flag: "learn" },
    actions: { deal: a(detective.dealDetective, 2), clue: a(detective.detectiveClue, 3, false), clues: a(detective.detectiveAllClues, 2, false), guess: a(detective.detectiveGuess, 4) },
  },
  daily: {
    gate: { path: "/practice/daily", flag: "learn" },
    actions: { rest: a(daily.dailyRest, 1, false), move: a(daily.dailyMove, 1), next: a(daily.nextPractice, 2, false) },
  },
  prep: {
    gate: { path: "/prep", flag: "learn" },
    actions: { check: a(prep.checkAnswer, 1), reveal: a(prep.revealAnswer, 1, false), save: a(prep.toggleSaved, 1), mockStart: a(prep.startMock, 1), mockSubmit: a(prep.submitMock, 1), interviewReveal: a(prep.revealInterview, 1, false), interviewFeedback: a(prep.interviewFeedback, 1), interviewSave: a(prep.saveInterviewSession, 1) },
  },
  cases: { gate: { path: "/practice", flag: "learn" }, actions: { progress: a(cases.loadMyProgress, 1, false), mark: a(cases.saveMyProgress, 3) } },
  comorbid: { gate: { path: "/games/comorbid", flag: "learn" }, actions: { state: a(comorbidState, 1, false), finish: a(comorbid.finishComorbid, 1) } },
  league: { gate: { path: "/leaderboard" }, actions: { alias: a(league.saveAlias, 1), buy: a(league.buyItem, 1), wear: a(league.wearLook, 2) } },
};

const comorbidSchema = z.object({
  seed: z.string().min(4).max(40),
  mode: z.enum(["bot", "pass"]),
  level: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  prefer: z.string().max(40).optional(),
  moves: z.array(z.object({ uid: z.string().max(8), action: z.enum(["play", "swap"]) })).max(80),
});

/**
 * Comorbid is dealt from a seed by the shared game rules: the website's
 * browser runs them, and the app asks the server for the state after its
 * moves instead (the same replay finishComorbid grades). Writes nothing.
 */
export async function comorbidState(input: unknown): Promise<{ ok: true; game: ReturnType<typeof replay>["game"] } | { ok: false; error: string }> {
  const p = comorbidSchema.safeParse(input);
  if (!p.success) return { ok: false, error: "That game can't be read." };
  const setup: Setup = { seed: p.data.seed, mode: p.data.mode, level: p.data.level, names: ["Player 1", "Player 2"], ...(p.data.prefer ? { prefer: p.data.prefer } : {}) };
  return { ok: true, game: replay(setup, p.data.moves).game };
}

/** The website actions answer `{ ok: false, error }` or `{ error }` in plain words. Pure. */
export function playFailure(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const d = data as { ok?: unknown; error?: unknown; reason?: unknown };
  if (d.ok === false) return typeof d.error === "string" ? d.error : typeof d.reason === "string" ? d.reason : "That didn't work. Try again.";
  if (typeof d.error === "string" && d.error && !("ok" in d)) return d.error;
  return null;
}
