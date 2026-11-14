"use server";

import { recordHistory } from "@/lib/history/server";
import { z } from "zod";
import { majority } from "@/lib/games-sims/common";
import { campaignById } from "@/lib/games-sims/ward/campaigns";
import { choose, currentDecision, outcomeScore, QUALITY_OUTCOME, startState, stepOf, wardXp, type Campaign, type WardState } from "@/lib/games-sims/ward/engine";
import { endOf, replayChoices, revealOf, revealsOf, sceneOf, soloState, type WardToken } from "@/lib/games-sims/ward/deal";
import type { Scene, WardEnd, WardReveal } from "@/lib/games-sims/ward/rules";
import { sign, verify } from "@/lib/games/token";
import { oncePerStep } from "@/lib/games-sims/server/run-steps";
import { adminDb, currentUser, gradeAnswers, payXp, saveResult } from "@/lib/games-sims/server/results";
import { createTeam, joinTeam, loadMyTeam, updateTeam } from "@/lib/games-sims/server/teams";
import { normaliseCode, TEAM_LIMITS } from "@/lib/games-sims/teams";
import { hintedItems } from "@/lib/hints/server";
import { cappedOutcome, itemKey, POINTS_KEPT } from "@/lib/hints/rules";

const id = z.string().min(1).max(40);

const FAIL = "That didn't load. Try again.";

export type WardSolo = { ok: true; token: string; scene: Scene; reveal?: WardReveal; end?: WardEnd | null; xp?: number; saved?: boolean } | { ok: false; error: string };

const newRun = () => `${Date.now().toString(36)}${Math.floor(Math.random() * 1e9).toString(36)}`;

function soloOut(t: WardToken, c: Campaign, st: WardState): Extract<WardSolo, { ok: true }> {
  return { ok: true, token: sign(t), scene: sceneOf(c, st) };
}

/** A new solo game: the first session and decision, no qualities or effects. */
export async function startWardSolo(campaign: string): Promise<WardSolo> {
  const user = await currentUser();
  const c = id.safeParse(campaign).success ? campaignById(campaign) : undefined;
  if (!user) return { ok: false, error: "Please sign in again." };
  if (!c) return { ok: false, error: FAIL };
  return soloOut({ u: user.id, run: newRun(), c: c.id, ch: [] }, c, startState(c));
}

/**
 * Carry on a saved solo game. A saved game is its signed token; a game
 * saved before the token existed (campaign and choices) is replayed and
 * given a fresh run.
 */
export async function resumeWardSolo(input: { token?: string; campaign?: string; choices?: string[] }): Promise<WardSolo> {
  const user = await currentUser();
  if (!user) return { ok: false, error: "Please sign in again." };
  if (typeof input?.token === "string") {
    const t = verify<WardToken>(input.token);
    const s = soloState(t, user.id);
    return t && s && !s.st.done ? soloOut(t, s.c, s.st) : { ok: false, error: FAIL };
  }
  const parsed = z.object({ campaign: id, choices: z.array(z.string().max(4)).min(1).max(40) }).safeParse(input);
  const c = parsed.success ? campaignById(parsed.data.campaign) : undefined;
  const s = c && parsed.success ? replayChoices(c, parsed.data.choices) : null;
  if (!parsed.success || !s || s.st.done) return { ok: false, error: FAIL };
  return soloOut({ u: user.id, run: newRun(), c: s.c.id, ch: parsed.data.choices }, s.c, s.st);
}

/**
 * One solo decision, checked here: its quality, effect and explanation come
 * back with the next scene. The last decision grades the whole game for
 * the student model (a decision made with a hint counts for less and pays
 * half its share of the XP), stores the outcome and pays XP once per run.
 */
export async function pickWardSolo(input: { token: string; option: string }): Promise<WardSolo> {
  const parsed = z.object({ token: z.string().min(10).max(3000), option: z.string().min(1).max(4) }).safeParse(input);
  const user = await currentUser();
  if (!user) return { ok: false, error: "Please sign in again." };
  const t = parsed.success ? verify<WardToken>(parsed.data.token) : null;
  const s = soloState(t, user.id);
  if (!parsed.success || !t || !s || s.st.done) return { ok: false, error: FAIL };
  const r = revealOf(s.c, s.st, parsed.data.option);
  if (!r) return { ok: false, error: FAIL };
  const next: WardToken = { ...t, ch: [...t.ch, parsed.data.option] };
  const { result } = await oncePerStep(user.id, "ward", t.run, String(t.ch.length), async (): Promise<WardSolo> => {
    const out = { ...soloOut(next, s.c, r.after), reveal: r.reveal };
    if (!r.after.done) return out;
    const paid = await finishSolo(user, s.c, next.ch, t.run);
    return { ...out, end: endOf(s.c, r.after), xp: paid.xp, saved: paid.ok };
  });
  return result;
}

async function finishSolo(user: { id: string; role: string }, c: Campaign, choices: string[], run: string): Promise<{ ok: boolean; xp: number }> {
  const hinted = await hintedItems(user.id, itemKey("ward", run, c.id, "")).catch(() => new Map<string, number>());
  let st = startState(c);
  const attempts = [];
  let hintedCount = 0;
  for (const choice of choices) {
    const d = currentDecision(c, st);
    const opt = d?.options.find((o) => o.id === choice);
    if (!d || !opt) break;
    const used = hinted.has(itemKey("ward", run, c.id, d.id)) ? 1 : 0;
    hintedCount += used;
    attempts.push({ skill: d.skill, item: `ward:${c.id}:${d.id}`, outcome: cappedOutcome(QUALITY_OUTCOME[opt.q], used) });
    st = choose(c, st, choice);
  }
  if (!st.done) return { ok: false, xp: 0 };
  // Answer history: each decision, right when the best option was taken.
  await Promise.all([gradeAnswers(user, attempts), recordHistory(user.id, "ward", attempts.map((a) => ({ item: a.item, correct: a.outcome >= 1 })))]);
  const score = outcomeScore(st);
  const [, xp] = await Promise.all([
    saveResult(user.id, { game: "ward", item: c.id, score: score / 100, right: attempts.filter((a) => a.outcome === 1).length, total: attempts.length, meta: { mode: "solo" } }),
    payXp(user.id, "ward", wardXp(score) * (1 - (1 - POINTS_KEPT[1]) * (attempts.length ? hintedCount / attempts.length : 0)), `${c.id}:${run}`),
  ]);
  return { ok: true, xp };
}

export type WardTeamView = {
  teamId: string;
  code: string;
  name: string;
  campaign: string;
  /** What the team may see now: the session and decision in play, no qualities or effects. */
  scene: Scene;
  /** Every decision already made, with its quality, effect and why. */
  reveals: WardReveal[];
  end: WardEnd | null;
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
  const c = campaignById(t.team.scenario);
  if (!c) return null;
  const votes = await votesFor(teamId, stepOf(st));
  return {
    teamId,
    code: t.team.code,
    name: t.team.name,
    campaign: t.team.scenario,
    scene: sceneOf(c, st),
    reveals: revealsOf(c, st),
    end: endOf(c, st),
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
