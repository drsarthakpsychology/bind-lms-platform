"use server";

import { z } from "zod";
import { majority } from "@/lib/games-sims/common";
import { campaignById } from "@/lib/games-sims/ward/campaigns";
import { choose, currentDecision, outcomeScore, QUALITY_OUTCOME, startState, stepOf, wardXp, type WardState } from "@/lib/games-sims/ward/engine";
import { adminDb, currentUser, gradeAnswers, payXp, saveResult } from "@/lib/games-sims/server/results";
import { createTeam, joinTeam, loadMyTeam, updateTeam } from "@/lib/games-sims/server/teams";
import { normaliseCode, TEAM_LIMITS } from "@/lib/games-sims/teams";

const id = z.string().min(1).max(40);

/**
 * Solo campaign finished: the server replays the choices through the engine
 * (so the score can't be invented), grades every decision for the student
 * model and stores the outcome.
 */
export async function finishWardSolo(input: { campaign: string; choices: string[]; run: string }): Promise<{ ok: boolean; score: number; xp: number }> {
  const parsed = z.object({ campaign: id, choices: z.array(z.string().max(4)).max(40), run: z.string().min(4).max(40) }).safeParse(input);
  const user = await currentUser();
  const c = parsed.success ? campaignById(parsed.data.campaign) : undefined;
  if (!parsed.success || !user || !c) return { ok: false, score: 0, xp: 0 };
  let st = startState(c);
  const attempts = [];
  for (const choice of parsed.data.choices) {
    const d = currentDecision(c, st);
    const opt = d?.options.find((o) => o.id === choice);
    if (!d || !opt) break;
    attempts.push({ skill: d.skill, item: `ward:${c.id}:${d.id}`, outcome: QUALITY_OUTCOME[opt.q] });
    st = choose(c, st, choice);
  }
  if (!st.done) return { ok: false, score: 0, xp: 0 };
  await gradeAnswers(user, attempts);
  const score = outcomeScore(st);
  const [, xp] = await Promise.all([
    saveResult(user.id, { game: "ward", item: c.id, score: score / 100, right: attempts.filter((a) => a.outcome === 1).length, total: attempts.length, meta: { mode: "solo" } }),
    payXp(user.id, "ward", wardXp(score), `${c.id}:${parsed.data.run}`),
  ]);
  return { ok: true, score, xp };
}

export type WardTeamView = {
  teamId: string;
  code: string;
  name: string;
  campaign: string;
  state: WardState;
  members: { name: string; me: boolean; voted: boolean }[];
  myVote: string | null;
  votes: number;
  version: number;
  /** XP each member was paid when the team finished. */
  xp: number;
};

async function votesFor(teamId: string, step: number) {
  const db = adminDb();
  if (!db) return [];
  try {
    const { data } = await db.from("games2_votes").select("user_id, choice, created_at").eq("team_id", teamId).eq("step", step);
    return (data ?? []) as { user_id: string; choice: string; created_at: string }[];
  } catch {
    return [];
  }
}

type LoadedTeam = NonNullable<Awaited<ReturnType<typeof loadMyTeam>>>;

/**
 * Move the story on if this step's votes have a winner. Called after every
 * vote and on every poll, so two votes landing at the same moment can't leave
 * the team stuck. The compare-and-set write means only one caller wins.
 */
async function settle(t: LoadedTeam): Promise<LoadedTeam["team"] | null> {
  const c = campaignById(t.team.scenario);
  const st = t.team.state as unknown as WardState;
  if (!c || st.done) return null;
  const votes = await votesFor(t.team.id, stepOf(st));
  const size = Math.max(TEAM_LIMITS.ward.min, t.members.length);
  const win = majority(
    votes.map((v) => ({ choice: v.choice, at: v.created_at })),
    size,
  );
  if (!win) return null;
  const next = choose(c, st, win, votes.length);
  if (next === st) return null;
  const saved = await updateTeam(t.team.id, t.team.version, { state: next as unknown as Record<string, unknown>, ...(next.done ? { status: "done" as const, finished_at: new Date().toISOString() } : {}) });
  if (saved && next.done) {
    const score = outcomeScore(next);
    await Promise.all(
      t.members.flatMap((m) => [
        saveResult(m.user_id, { game: "ward", item: c.id, score: score / 100, right: next.log.filter((l) => l.q === "best").length, total: next.log.length, meta: { mode: "team", team: t.team.id } }),
        payXp(m.user_id, "ward", wardXp(score), `team:${t.team.id}`),
      ]),
    );
  }
  return saved;
}

export async function wardTeamView(teamId: string): Promise<WardTeamView | null> {
  const user = await currentUser();
  if (!user || !id.safeParse(teamId).success) return null;
  const t = await loadMyTeam(teamId, user.id);
  if (!t) return null;
  const moved = await settle(t);
  if (moved) t.team = moved;
  const st = t.team.state as unknown as WardState;
  const votes = await votesFor(teamId, stepOf(st));
  return {
    teamId,
    code: t.team.code,
    name: t.team.name,
    campaign: t.team.scenario,
    state: st,
    members: t.members.map((m) => ({ name: m.name, me: m.user_id === user.id, voted: votes.some((v) => v.user_id === m.user_id) })),
    myVote: votes.find((v) => v.user_id === user.id)?.choice ?? null,
    votes: votes.length,
    version: t.team.version,
    xp: st.done ? wardXp(outcomeScore(st)) : 0,
  };
}

export async function createWardTeam(campaign: string): Promise<{ ok: true; teamId: string } | { ok: false; reason: string }> {
  const user = await currentUser();
  const c = campaignById(campaign);
  if (!user || !c) return { ok: false, reason: "Sign in again, then try." };
  const t = await createTeam("ward", c.id, user.id, startState(c) as unknown as Record<string, unknown>);
  return t ? { ok: true, teamId: t.id } : { ok: false, reason: "Team play isn't switched on yet. Play solo for now." };
}

export async function joinWardTeam(code: string) {
  const user = await currentUser();
  if (!user) return { ok: false as const, reason: "Sign in again, then try." };
  return joinTeam("ward", normaliseCode(code), user.id);
}

/**
 * Vote on the team's current decision. Your own vote is graded for you (so
 * each classmate learns from their own call). When a majority is reached
 * (or everyone has voted), the team's story moves on.
 */
export async function castWardVote(input: { teamId: string; step: number; choice: string }): Promise<WardTeamView | null> {
  const parsed = z.object({ teamId: id, step: z.number().int().min(0).max(60), choice: z.string().max(4) }).safeParse(input);
  const user = await currentUser();
  if (!parsed.success || !user) return null;
  const t = await loadMyTeam(parsed.data.teamId, user.id);
  const db = adminDb();
  if (!t || !db) return null;
  const c = campaignById(t.team.scenario);
  const st = t.team.state as unknown as WardState;
  if (!c || st.done || stepOf(st) !== parsed.data.step) return wardTeamView(parsed.data.teamId);
  const d = currentDecision(c, st);
  const opt = d?.options.find((o) => o.id === parsed.data.choice);
  if (!d || !opt) return wardTeamView(parsed.data.teamId);

  const already = (await votesFor(t.team.id, parsed.data.step)).some((v) => v.user_id === user.id);
  if (!already) {
    let saved = false;
    try {
      const { error } = await db.from("games2_votes").insert({ team_id: t.team.id, step: parsed.data.step, user_id: user.id, choice: opt.id });
      saved = !error;
    } catch {
      /* duplicate or table missing */
    }
    if (saved) await gradeAnswers(user, [{ skill: d.skill, item: `ward:${c.id}:${d.id}`, outcome: QUALITY_OUTCOME[opt.q] }]);
  }

  return wardTeamView(parsed.data.teamId);
}
