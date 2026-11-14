"use server";

import { record, recordHistory } from "@/lib/history/server";
import { saveProgress } from "@/lib/cases/progress-server";
import { z } from "zod";
import { answer, escapeXp, raceBoard, startEscape, teamTime, type EscState, type RaceRow } from "@/lib/games-sims/escape/engine";
import { canonical, practiceAnswer, practiceResume, practiceStart, practiceState, roomView, type PracticeToken } from "@/lib/games-sims/escape/deal";
import { roomById } from "@/lib/games-sims/escape/rooms";
import type { RoomView } from "@/lib/games-sims/escape/types";
import { secretSeed, sign, verify } from "@/lib/games/token";
import { currentUser, gradeAnswers, payXp, saveResult } from "@/lib/games-sims/server/results";
import { oncePerStep } from "@/lib/games-sims/server/run-steps";
import { createTeam, joinTeam, loadMyTeam, myName, rivalTeams, updateTeam, type TeamRow } from "@/lib/games-sims/server/teams";
import { normaliseCode, TEAM_LIMITS } from "@/lib/games-sims/teams";

const id = z.string().min(1).max(40);
const raw = z.string().max(60);

/** The secret seed that shuffles an order door for one team or run (the browser can't work it out). */
const orderSeed = (key: string) => String(secretSeed("escape-order", key));

export type EscapeView = {
  teamId: string;
  code: string;
  name: string;
  room: string;
  /** What the team may see now: the current door without its answer, opened doors, the hint once open. */
  view: RoomView;
  status: TeamRow["status"];
  state: EscState;
  members: { name: string; me: boolean }[];
  startedAt: string | null;
  finishedAt: string | null;
  /** Server clock, so every phone shows the same timer. */
  now: number;
  race: RaceRow[];
  xp: number;
};

async function race(t: TeamRow, now: number): Promise<RaceRow[]> {
  const since = new Date(now - 7 * 864e5).toISOString();
  const rows = await rivalTeams("escape", t.scenario, since, 40);
  if (!rows.some((r) => r.id === t.id) && t.status !== "lobby") rows.push(t);
  return raceBoard(
    rows.map((r) => {
      const s = r.state as unknown as EscState;
      return { id: r.id, name: r.name, stage: s.done ? (roomById(r.scenario)?.puzzles.length ?? 0) : (s.stage ?? 0), done: !!s.done, ms: teamTime(r.started_at, s.done ? r.finished_at : now, s.wrong ?? 0), me: r.id === t.id };
    }),
  ).slice(0, 12);
}

export async function escapeView(teamId: string): Promise<EscapeView | null> {
  const user = await currentUser();
  if (!user || !id.safeParse(teamId).success) return null;
  const t = await loadMyTeam(teamId, user.id);
  if (!t) return null;
  const now = Date.now();
  const st = t.team.state as unknown as EscState;
  const r = roomById(t.team.scenario);
  if (!r) return null;
  return {
    teamId,
    code: t.team.code,
    name: t.team.name,
    room: t.team.scenario,
    view: roomView(r, st, orderSeed(t.team.id)),
    status: t.team.status,
    state: st,
    members: t.members.map((m) => ({ name: m.name, me: m.user_id === user.id })),
    startedAt: t.team.started_at,
    finishedAt: t.team.finished_at,
    now,
    race: await race(t.team, now),
    xp: st.done ? escapeXp(teamTime(t.team.started_at, t.team.finished_at, st.wrong), st.wrong) : 0,
  };
}

export async function createEscapeTeam(room: string): Promise<{ ok: true; teamId: string } | { ok: false; reason: string }> {
  const user = await currentUser();
  const r = roomById(room);
  if (!user || !r) return { ok: false, reason: "Sign in again, then try." };
  const t = await createTeam("escape", r.id, user.id, startEscape(r) as unknown as Record<string, unknown>);
  return t ? { ok: true, teamId: t.id } : { ok: false, reason: "Team play isn't switched on yet. Try the practice run." };
}

export async function joinEscapeTeam(code: string) {
  const user = await currentUser();
  if (!user) return { ok: false as const, reason: "Sign in again, then try." };
  return joinTeam("escape", normaliseCode(code), user.id);
}

/** Start the clock (any member, once at least two have joined). */
export async function startEscapeTeam(teamId: string): Promise<EscapeView | null> {
  const user = await currentUser();
  if (!user || !id.safeParse(teamId).success) return null;
  const t = await loadMyTeam(teamId, user.id);
  if (t && t.team.status === "lobby" && t.members.length >= TEAM_LIMITS.escape.min) {
    await updateTeam(t.team.id, t.team.version, { status: "playing", started_at: new Date().toISOString() });
  }
  return escapeView(teamId);
}

/**
 * Anyone on the team answers the current door. The answer is checked here,
 * graded for the person who gave it, and written with compare-and-set
 * (retried once if a teammate wrote at the same moment).
 */
export async function answerEscape(input: { teamId: string; stage: number; answer: string }): Promise<{ view: EscapeView | null; ok: boolean }> {
  const parsed = z.object({ teamId: id, stage: z.number().int().min(0).max(10), answer: raw }).safeParse(input);
  const user = await currentUser();
  if (!parsed.success || !user) return { view: null, ok: false };
  const name = await myName(user.id);
  for (let attempt = 0; attempt < 3; attempt++) {
    const t = await loadMyTeam(parsed.data.teamId, user.id);
    const r = t ? roomById(t.team.scenario) : undefined;
    if (!t || !r || t.team.status !== "playing") return { view: await escapeView(parsed.data.teamId), ok: false };
    const st = t.team.state as unknown as EscState;
    const door = r.puzzles[parsed.data.stage];
    const res = door ? answer(r, st, parsed.data.stage, canonical(door, parsed.data.answer, orderSeed(t.team.id)), name, new Date().toISOString()) : { applied: false as const, ok: false, state: st };
    if (!res.applied) return { view: await escapeView(parsed.data.teamId), ok: false };
    const finished = res.state.done ? new Date().toISOString() : null;
    const saved = await updateTeam(t.team.id, t.team.version, { state: res.state as unknown as Record<string, unknown>, ...(finished ? { status: "done" as const, finished_at: finished } : {}) });
    if (!saved) continue;
    const p = r.puzzles[parsed.data.stage];
    await gradeAnswers(user, [{ skill: p.skill, item: `escape:${r.id}:${p.id}`, outcome: res.ok ? 1 : 0, first: (st.tries[parsed.data.stage] ?? 0) === 0 }]);
    if (finished) {
      const ms = teamTime(saved.started_at, finished, res.state.wrong);
      const n = r.puzzles.length;
      await Promise.all(
        t.members.flatMap((m) => [
          saveResult(m.user_id, { game: "escape", item: r.id, score: n / (n + res.state.wrong), right: n, total: n + res.state.wrong, meta: { mode: "team", team: t.team.id, ms } }),
          payXp(m.user_id, "escape", escapeXp(ms, res.state.wrong), `team:${t.team.id}`),
          // The room counts as done for every member (answer history).
          recordHistory(m.user_id, "escape", [{ item: r.id, correct: n / (n + res.state.wrong) >= 0.6 }]),
        ]),
      );
    }
    return { view: await escapeView(parsed.data.teamId), ok: res.ok };
  }
  return { view: await escapeView(parsed.data.teamId), ok: false };
}

export type PracticeResult =
  | { ok: true; token: string; view: RoomView; state: EscState; now: number; right?: boolean; ms?: number; xp?: number; elapsed?: number }
  | { ok: false; error: string };

const FAIL = "That didn't load. Try again.";

/** A practice run (no team), dealt on the server: the browser gets the first door, no answers. */
export async function startEscapePractice(room: string): Promise<PracticeResult> {
  const user = await currentUser();
  const r = id.safeParse(room).success ? roomById(room) : undefined;
  if (!user) return { ok: false, error: "Please sign in again." };
  if (!r) return { ok: false, error: FAIL };
  const now = Date.now();
  const run = `${now.toString(36)}${Math.floor(Math.random() * 1e9).toString(36)}`;
  const t = practiceStart(user.id, run, r, now);
  const st = practiceState(t, user.id)!.st;
  return { ok: true, token: sign(t), view: roomView(r, st, orderSeed(run)), state: st, now };
}

/** Carry on a practice run saved half-way (its signed token): back at the door it was left on. */
export async function resumeEscapePractice(token: string): Promise<PracticeResult> {
  const user = await currentUser();
  if (!user) return { ok: false, error: "Please sign in again." };
  const t = typeof token === "string" ? verify<PracticeToken>(token) : null;
  const cur = practiceState(t, user.id);
  if (!t || !cur || cur.st.done) return { ok: false, error: FAIL };
  const now = Date.now();
  const next = practiceResume(t, now);
  return { ok: true, token: sign(next), view: roomView(cur.room, cur.st, orderSeed(t.run)), state: cur.st, now, elapsed: next.el };
}

/**
 * A practice answer, checked here. Wrong tries and time are counted on the
 * server; the last door saves the result and pays XP once per run.
 */
export async function answerEscapePractice(input: { token: string; stage: number; answer: string }): Promise<PracticeResult> {
  const parsed = z.object({ token: z.string().min(10).max(2000), stage: z.number().int().min(0).max(10), answer: raw }).safeParse(input);
  const user = await currentUser();
  if (!user) return { ok: false, error: "Please sign in again." };
  if (!parsed.success) return { ok: false, error: FAIL };
  const t = verify<PracticeToken>(parsed.data.token);
  const cur = practiceState(t, user.id);
  if (!t || !cur) return { ok: false, error: FAIL };
  const seed = orderSeed(t.run);
  const res = practiceAnswer(t, cur.room, cur.st, parsed.data.stage, parsed.data.answer, seed);
  // Not the current door (already open, or the run is over): send the run as it stands.
  if (!res) return { ok: true, token: parsed.data.token, view: roomView(cur.room, cur.st, seed), state: cur.st, now: Date.now() };
  const r = cur.room;
  const p = res.door;
  const now = Date.now();
  const state = { ...res.state, log: [] };
  const n = r.puzzles.length;
  const wrong = state.wrong;
  const ms = state.done ? teamTime(new Date(t.t0).toISOString(), now, wrong) : undefined;
  // An old token sent again gets its first result back, not a second try.
  const { result: out, fresh } = await oncePerStep(user.id, "escape", t.run, String(t.tr.reduce((a, x) => a + x, 0)), () => ({ ok: true as const, token: sign({ ...res.next, el: now - t.t0 }), view: roomView(r, state, seed), state, now, right: res.ok, ...(ms !== undefined ? { ms } : {}) }));
  if (!fresh) return out;
  await Promise.all([
    gradeAnswers(user, [{ skill: p.skill, item: `escape:${r.id}:${p.id}`, outcome: res.ok ? 1 : 0, first: res.first }]),
    // Answer history: the first try at each lock counts.
    res.first ? record(user.id, "escape", `${r.id}:${p.id}`, res.ok) : null,
  ]);
  if (ms === undefined) return out;
  const [, xp] = await Promise.all([
    saveResult(user.id, { game: "escape", item: r.id, score: n / (n + wrong), right: n, total: n + wrong, meta: { mode: "practice", ms } }),
    payXp(user.id, "escape", escapeXp(ms, wrong), `practice:${r.id}:${t.run}`),
    // The room is done (answer history), and its saved door goes.
    recordHistory(user.id, "escape", [{ item: r.id, correct: n / (n + wrong) >= 0.6 }]),
    saveProgress(user.id, "escape", r.id, null),
  ]);
  return { ...out, xp };
}
