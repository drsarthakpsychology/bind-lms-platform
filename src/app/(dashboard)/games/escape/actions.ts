"use server";

import { record } from "@/lib/history/server";
import { z } from "zod";
import { answer, escapeXp, isRight, raceBoard, startEscape, teamTime, type EscState, type RaceRow } from "@/lib/games-sims/escape/engine";
import { roomById } from "@/lib/games-sims/escape/rooms";
import { currentUser, gradeAnswers, payXp, saveResult } from "@/lib/games-sims/server/results";
import { createTeam, joinTeam, loadMyTeam, myName, rivalTeams, updateTeam, type TeamRow } from "@/lib/games-sims/server/teams";
import { normaliseCode, TEAM_LIMITS } from "@/lib/games-sims/teams";

const id = z.string().min(1).max(40);
const raw = z.string().max(60);

export type EscapeView = {
  teamId: string;
  code: string;
  name: string;
  room: string;
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
  return {
    teamId,
    code: t.team.code,
    name: t.team.name,
    room: t.team.scenario,
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
    const res = answer(r, st, parsed.data.stage, parsed.data.answer, name, new Date().toISOString());
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
        ]),
      );
    }
    return { view: await escapeView(parsed.data.teamId), ok: res.ok };
  }
  return { view: await escapeView(parsed.data.teamId), ok: false };
}

/** Practice run (no team): each answer graded for the student model. */
export async function gradeEscapePractice(input: { room: string; stage: number; answer: string; first: boolean }): Promise<{ ok: boolean }> {
  const parsed = z.object({ room: id, stage: z.number().int().min(0).max(10), answer: raw, first: z.boolean() }).safeParse(input);
  const user = await currentUser();
  const r = parsed.success ? roomById(parsed.data.room) : undefined;
  const p = r && parsed.success ? r.puzzles[parsed.data.stage] : undefined;
  if (!parsed.success || !user || !r || !p) return { ok: false };
  const ok = isRight(p, parsed.data.answer);
  await Promise.all([
    gradeAnswers(user, [{ skill: p.skill, item: `escape:${r.id}:${p.id}`, outcome: ok ? 1 : 0, first: parsed.data.first }]),
    // Answer history: the first try at each lock counts.
    parsed.data.first ? record(user.id, "escape", `${r.id}:${p.id}`, ok) : null,
  ]);
  return { ok };
}

/** Practice run finished: every final answer is checked again before XP is paid. */
export async function finishEscapePractice(input: { room: string; run: string; answers: string[]; wrong: number; ms: number }): Promise<{ ok: boolean; xp: number }> {
  const parsed = z.object({ room: id, run: z.string().min(4).max(40), answers: z.array(raw).max(10), wrong: z.number().int().min(0).max(500), ms: z.number().int().min(0).max(864e5) }).safeParse(input);
  const user = await currentUser();
  const r = parsed.success ? roomById(parsed.data.room) : undefined;
  if (!parsed.success || !user || !r) return { ok: false, xp: 0 };
  if (parsed.data.answers.length !== r.puzzles.length || !r.puzzles.every((p, i) => isRight(p, parsed.data.answers[i]))) return { ok: false, xp: 0 };
  const n = r.puzzles.length;
  // The browser's clock can't be checked, so practice never counts as faster than three minutes.
  const ms = Math.max(180000, parsed.data.ms) + parsed.data.wrong * 20000;
  const [, xp] = await Promise.all([
    saveResult(user.id, { game: "escape", item: r.id, score: n / (n + parsed.data.wrong), right: n, total: n + parsed.data.wrong, meta: { mode: "practice", ms } }),
    payXp(user.id, "escape", escapeXp(ms, parsed.data.wrong), `practice:${r.id}:${parsed.data.run}`),
  ]);
  return { ok: true, xp };
}
