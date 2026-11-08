import "server-only";
import { admin, isMissing, namesFor } from "../server";
import { awardXp, XP_SOURCES } from "@/lib/leagues/xp";
import { BOT_AFTER_MS, WIN_XP, canAnswer, matchState, pickItems, scoreAnswer, type AnswerRec, type MatchRec, type MatchState } from "./engine";
import { DUEL_ITEMS, duelItem, type DuelItem } from "./items";
import { loadHistory, record } from "@/lib/history/server";
import { mergeHistory, type HistoryRow } from "@/lib/history/order";
import { canPair, decayed, START_RATING, START_RD, tierFor, update, type Rating } from "./rating";
import { buildDuelView, type DuelView } from "./view";

/**
 * Duel server: matchmaking, live polling, answers and settlement. The client
 * only ever sends "I'm here", "join", "this is my answer" and "I quit"; every
 * time, score, winner and rating is computed here from server timestamps.
 */

type Db = ReturnType<typeof admin>;

type MatchRow = {
  id: string;
  p1: string;
  p2: string | null;
  bot: boolean;
  ranked: boolean;
  status: MatchRec["status"];
  items: string[];
  seed: number;
  p1_rating: number | null;
  p2_rating: number | null;
  p1_seen: string | null;
  p2_seen: string | null;
  created_at: string;
  started_at: string | null;
  ended_at: string | null;
  result: "p1" | "p2" | "draw" | null;
  forfeit_by: string | null;
  p1_score: number | null;
  p2_score: number | null;
  p1_delta: number | null;
  p2_delta: number | null;
};

type RatingRow = { user_id: string; rating: number; rd: number; games: number; wins: number; losses: number; draws: number; forfeits: number; peak: number; last_played: string | null };

const ms = (t: string | null) => (t ? Date.parse(t) : null);
const iso = (n: number) => new Date(n).toISOString();
const COLS = "id, p1, p2, bot, ranked, status, items, seed, p1_rating, p2_rating, p1_seen, p2_seen, created_at, started_at, ended_at, result, forfeit_by, p1_score, p2_score, p1_delta, p2_delta";
/** A queued player who hasn't polled for this long is not really there. */
const QUEUE_STALE_MS = 6000;

export class DuelUnavailable extends Error {}

function toRec(r: MatchRow): MatchRec {
  return { id: r.id, p1: r.p1, p2: r.p2, bot: r.bot, ranked: r.ranked, status: r.status, items: r.items ?? [], seed: r.seed, startedAt: ms(r.started_at), p1Seen: ms(r.p1_seen), p2Seen: ms(r.p2_seen), forfeitBy: r.forfeit_by };
}

function check<T>(res: { data: T; error: { code?: string; message?: string } | null }): T {
  if (res.error) {
    if (isMissing(res.error)) throw new DuelUnavailable(res.error.message);
    throw new Error(res.error.message);
  }
  return res.data;
}

export async function ratingOf(db: Db, userId: string): Promise<RatingRow> {
  const row = check(await db.from("ratings").select("user_id, rating, rd, games, wins, losses, draws, forfeits, peak, last_played").eq("user_id", userId).maybeSingle()) as RatingRow | null;
  return row ?? { user_id: userId, rating: START_RATING, rd: START_RD, games: 0, wins: 0, losses: 0, draws: 0, forfeits: 0, peak: START_RATING, last_played: null };
}

function asRating(r: RatingRow): Rating {
  return { rating: r.rating, rd: r.rd, lastPlayed: ms(r.last_played) };
}

/** Rating to show now (with idle decay applied). */
export function shownRating(r: RatingRow, now: number): number {
  return Math.round(decayed(asRating(r), now));
}

/** One player's (or both players') duel history; empty when the table is missing. */
async function duelHistory(...users: (string | null | undefined)[]) {
  const books = await Promise.all(users.filter((u): u is string => !!u).map((u) => loadHistory(u, "duel")));
  return books.reduce((a, b) => mergeHistory(a, b.map), new Map<string, HistoryRow>());
}

function newSeed() {
  return Math.floor(Math.random() * 2 ** 31);
}

async function myActive(db: Db, me: string): Promise<MatchRow | null> {
  const rows = check(await db.from("matches").select(COLS).eq("status", "active").or(`p1.eq.${me},p2.eq.${me}`).order("created_at", { ascending: false }).limit(3)) as MatchRow[];
  return rows[0] ?? null;
}

async function loadMatch(db: Db, id: string, me: string): Promise<MatchRow | null> {
  const row = check(await db.from("matches").select(COLS).eq("id", id).maybeSingle()) as MatchRow | null;
  if (!row || (row.p1 !== me && row.p2 !== me)) return null;
  return row;
}

async function loadAnswers(db: Db, id: string): Promise<AnswerRec[]> {
  const rows = check(await db.from("match_answers").select("user_id, round, dx, feature, answered_at").eq("match_id", id)) as { user_id: string; round: number; dx: number; feature: number; answered_at: string }[];
  return rows.map((r) => ({ userId: r.user_id, round: r.round, dx: r.dx, feature: r.feature, at: Date.parse(r.answered_at) }));
}

export type QueueState = { kind: "queued"; matchId: string; waitedMs: number; botReady: boolean; rating: number } | { kind: "match"; view: DuelView };

/** Join the queue, or rejoin a live match. Pairs with a similar rating; the window widens with waiting. */
export async function join(me: string): Promise<QueueState> {
  const db = admin();
  const now = Date.now();
  const live = await myActive(db, me);
  if (live) return { kind: "match", view: await viewFor(db, live, me, now) };
  const mine = await ratingOf(db, me);
  const myRating = shownRating(mine, now);
  // Leave any old queue entry.
  check(await db.from("matches").update({ status: "cancelled" }).eq("p1", me).eq("status", "waiting"));
  const claimed = await claimOpponent(db, me, myRating, now, null);
  if (claimed) return { kind: "match", view: await viewFor(db, claimed, me, now) };
  const seed = newSeed();
  const row = check(
    await db
      .from("matches")
      .insert({ p1: me, status: "waiting", ranked: true, bot: false, items: pickItems(DUEL_ITEMS, seed, undefined, await duelHistory(me), now), seed, p1_rating: myRating, p1_seen: iso(now) })
      .select("id")
      .single(),
  ) as { id: string };
  return { kind: "queued", matchId: row.id, waitedMs: 0, botReady: false, rating: myRating };
}

/**
 * Find a waiting player within the rating window and claim their match.
 * `olderThan`: only claim matches created before this one (so two waiting
 * players never claim each other at the same time).
 */
async function claimOpponent(db: Db, me: string, myRating: number, now: number, olderThan: string | null): Promise<MatchRow | null> {
  let q = db
    .from("matches")
    .select(COLS)
    .eq("status", "waiting")
    .neq("p1", me)
    .gte("p1_seen", iso(now - QUEUE_STALE_MS))
    .order("created_at", { ascending: true })
    .limit(20);
  if (olderThan) q = q.lt("created_at", olderThan);
  const rows = check(await q) as MatchRow[];
  for (const r of rows) {
    const waited = now - Date.parse(r.created_at);
    if (!canPair(r.p1_rating ?? START_RATING, myRating, waited)) continue;
    // Re-pick the rounds for both players: items neither has seen come first.
    const both = await duelHistory(me, r.p1);
    const items = both.size ? pickItems(DUEL_ITEMS, r.seed, undefined, both, now) : r.items;
    const got = check(
      await db
        .from("matches")
        .update({ p2: me, status: "active", started_at: iso(now), p2_rating: myRating, p2_seen: iso(now), p1_seen: iso(now), items })
        .eq("id", r.id)
        .eq("status", "waiting")
        .is("p2", null)
        .select(COLS),
    ) as MatchRow[];
    if (got[0]) return got[0];
  }
  return null;
}

/** Poll while waiting in the queue. */
export async function queuePoll(me: string, matchId: string): Promise<QueueState | { kind: "gone" }> {
  const db = admin();
  const now = Date.now();
  const row = await loadMatch(db, matchId, me);
  if (!row || row.status === "cancelled") return { kind: "gone" };
  if (row.status !== "waiting") return { kind: "match", view: await viewFor(db, row, me, now) };
  check(await db.from("matches").update({ p1_seen: iso(now) }).eq("id", row.id).eq("status", "waiting"));
  // Look for someone who has been waiting longer than us.
  const rating = row.p1_rating ?? START_RATING;
  const cancelled = check(await db.from("matches").update({ status: "cancelled" }).eq("id", row.id).eq("status", "waiting").select("id")) as { id: string }[];
  if (!cancelled.length) {
    // Someone claimed ours a moment ago.
    const fresh = await loadMatch(db, matchId, me);
    if (fresh && fresh.status !== "waiting") return { kind: "match", view: await viewFor(db, fresh, me, now) };
    return { kind: "gone" };
  }
  const claimed = await claimOpponent(db, me, rating, now, row.created_at);
  if (claimed) return { kind: "match", view: await viewFor(db, claimed, me, now) };
  // Nobody: back into the queue with our original place.
  check(await db.from("matches").update({ status: "waiting", p1_seen: iso(now) }).eq("id", row.id).eq("status", "cancelled"));
  const waitedMs = now - Date.parse(row.created_at);
  return { kind: "queued", matchId: row.id, waitedMs, botReady: waitedMs >= BOT_AFTER_MS, rating };
}

export async function leaveQueue(me: string, matchId?: string) {
  const db = admin();
  let q = db.from("matches").update({ status: "cancelled" }).eq("p1", me).eq("status", "waiting");
  if (matchId) q = q.eq("id", matchId);
  check(await q);
}

/** No opponent: an unranked practice match against the bot. */
export async function startBot(me: string): Promise<DuelView> {
  const db = admin();
  const now = Date.now();
  const live = await myActive(db, me);
  if (live) return viewFor(db, live, me, now);
  await leaveQueue(me);
  const seed = newSeed();
  const mine = await ratingOf(db, me);
  const row = check(
    await db
      .from("matches")
      .insert({ p1: me, bot: true, ranked: false, status: "active", items: pickItems(DUEL_ITEMS, seed, undefined, await duelHistory(me), now), seed, p1_rating: shownRating(mine, now), started_at: iso(now), p1_seen: iso(now) })
      .select(COLS)
      .single(),
  ) as MatchRow;
  return viewFor(db, row, me, now);
}

/** Live poll: marks you present, settles the match when it's over. */
export async function poll(me: string, matchId: string): Promise<DuelView | null> {
  const db = admin();
  const now = Date.now();
  let row = await loadMatch(db, matchId, me);
  if (!row) return null;
  if (row.status === "active") {
    const col = row.p1 === me ? "p1_seen" : "p2_seen";
    check(await db.from("matches").update({ [col]: iso(now) }).eq("id", row.id).eq("status", "active"));
    row = { ...row, [col]: iso(now) };
  }
  return viewFor(db, row, me, now);
}

export async function answer(me: string, matchId: string, round: number, dx: number, feature: number): Promise<{ ok: boolean; view: DuelView | null; error?: string }> {
  const db = admin();
  const now = Date.now();
  const row = await loadMatch(db, matchId, me);
  if (!row) return { ok: false, view: null, error: "Match not found." };
  if (![dx, feature, round].every((n) => Number.isInteger(n)) || dx < 0 || dx > 3 || feature < 0 || feature > 3) return { ok: false, view: null, error: "Bad answer." };
  const m = toRec(row);
  const answers = await loadAnswers(db, row.id);
  const s = matchState(m, answers, now);
  if (!canAnswer(m, s, me, round)) return { ok: false, view: await viewFor(db, row, me, now), error: "Too late for that round." };
  const rt = s.rounds[round];
  const sc = scoreAnswer(m.seed, round, dx, feature);
  const { error } = await db.from("match_answers").insert({ match_id: row.id, user_id: me, round, dx, feature, correct_dx: sc.dxOk, correct_feature: sc.featureOk, points: sc.points, ms: now - rt.start, answered_at: iso(now) });
  if (error && !/duplicate/i.test(error.message)) return { ok: false, view: null, error: "Couldn't save your answer." };
  const itemId = m.items[round];
  if (!error && itemId) await record(me, "duel", itemId, sc.dxOk);
  const col = row.p1 === me ? "p1_seen" : "p2_seen";
  await db.from("matches").update({ [col]: iso(now) }).eq("id", row.id).eq("status", "active");
  return { ok: true, view: await viewFor(db, { ...row, [col]: iso(now) }, me, now) };
}

/** Quit: an immediate loss. */
export async function quit(me: string, matchId: string): Promise<DuelView | null> {
  const db = admin();
  const now = Date.now();
  const row = await loadMatch(db, matchId, me);
  if (!row) return null;
  if (row.status === "active") {
    check(await db.from("matches").update({ forfeit_by: me }).eq("id", row.id).eq("status", "active").is("forfeit_by", null));
    const fresh = await loadMatch(db, matchId, me);
    if (fresh) return viewFor(db, fresh, me, now);
  }
  return viewFor(db, row, me, now);
}

/** Settle once: only the request that flips active → done applies ratings. */
async function settle(db: Db, row: MatchRow, s: MatchState, now: number): Promise<MatchRow> {
  const o = s.outcome!;
  const result: MatchRow["result"] = o.winner ?? "draw";
  const forfeitBy = o.forfeitSide ? (o.forfeitSide === "p1" ? row.p1 : row.p2) : null;
  let d1: number | null = null;
  let d2: number | null = null;
  let r1: RatingRow | null = null;
  let r2: RatingRow | null = null;
  let n1: { rating: number; rd: number } | null = null;
  let n2: { rating: number; rd: number } | null = null;
  if (row.ranked && !row.bot && row.p2) {
    [r1, r2] = await Promise.all([ratingOf(db, row.p1), ratingOf(db, row.p2)]);
    const s1 = result === "draw" ? 0.5 : result === "p1" ? 1 : 0;
    n1 = update(asRating(r1), asRating(r2), s1, now);
    n2 = update(asRating(r2), asRating(r1), (1 - s1) as 0 | 0.5 | 1, now);
    d1 = Math.round((n1.rating - shownRating(r1, now)) * 10) / 10;
    d2 = Math.round((n2.rating - shownRating(r2, now)) * 10) / 10;
  }
  const done = check(
    await db
      .from("matches")
      .update({ status: "done", ended_at: iso(now), result, forfeit_by: forfeitBy ?? row.forfeit_by, p1_score: s.totals.p1.points, p2_score: s.totals.p2.points, p1_delta: d1, p2_delta: d2 })
      .eq("id", row.id)
      .eq("status", "active")
      .select(COLS),
  ) as MatchRow[];
  if (!done[0]) return ((await db.from("matches").select(COLS).eq("id", row.id).maybeSingle()).data as MatchRow | null) ?? row;
  if (r1 && r2 && n1 && n2) {
    const rows = [
      { r: r1, n: n1, side: "p1" as const },
      { r: r2, n: n2, side: "p2" as const },
    ].map(({ r, n, side }) => ({
      user_id: r.user_id,
      rating: n.rating,
      rd: n.rd,
      games: r.games + 1,
      wins: r.wins + (result === side ? 1 : 0),
      losses: r.losses + (result !== side && result !== "draw" ? 1 : 0),
      draws: r.draws + (result === "draw" ? 1 : 0),
      forfeits: r.forfeits + (forfeitBy === r.user_id ? 1 : 0),
      peak: Math.max(r.peak, n.rating),
      last_played: iso(now),
      updated_at: iso(now),
    }));
    const { error } = await db.from("ratings").upsert(rows, { onConflict: "user_id" });
    if (error) console.warn("duel settle: ratings write failed:", error.message);
  }
  // Only ranked wins against a person count for XP and the "duels won" milestones.
  if (row.ranked && !row.bot && row.p2 && (result === "p1" || result === "p2")) {
    const award = await awardXp(result === "p1" ? row.p1 : row.p2, XP_SOURCES.duelWin, WIN_XP, row.id);
    if (!award.ok) console.warn("duel settle: XP award failed:", award.error);
  }
  return done[0];
}

async function viewFor(db: Db, row: MatchRow, me: string, now: number): Promise<DuelView> {
  let r = row;
  const m = toRec(r);
  const answers = r.status === "waiting" ? [] : await loadAnswers(db, r.id);
  const s = matchState(m, answers, now);
  if (r.status === "active" && s.outcome) r = await settle(db, r, s, now);
  const oppId = r.p1 === me ? r.p2 : r.p1;
  const names = await namesFor([me, ...(oppId ? [oppId] : [])]);
  const side = r.p1 === me ? "p1" : "p2";
  const delta = r.status === "done" ? (side === "p1" ? r.p1_delta : r.p2_delta) : null;
  const before = side === "p1" ? r.p1_rating : r.p2_rating;
  return buildDuelView({ ...m, status: r.status, forfeitBy: r.forfeit_by }, answers, r.status === "done" && r.ended_at ? Math.max(now, Date.parse(r.ended_at)) : now, me, duelItem, {
    names: { you: names.get(me) ?? "You", opp: r.bot ? "Practice bot" : oppId ? (names.get(oppId) ?? "Opponent") : "…" },
    ratings: { you: before ?? null, opp: r.bot ? null : ((side === "p1" ? r.p2_rating : r.p1_rating) ?? null) },
    delta,
    newRating: delta !== null && before !== null ? Math.round(before + delta) : null,
  });
}

export type DuelProfile = {
  available: boolean;
  rating: number;
  rd: number;
  tier: string;
  games: number;
  wins: number;
  losses: number;
  draws: number;
  forfeits: number;
  peak: number;
  /** Share of ranked players you're above (private). */
  percentile: number | null;
  history: { id: string; when: string; opp: string; outcome: "win" | "loss" | "draw"; score: string; delta: number | null; ranked: boolean; forfeit: "you" | "them" | null }[];
  liveMatchId: string | null;
};

export async function profile(me: string): Promise<DuelProfile> {
  const now = Date.now();
  try {
    const db = admin();
    const r = await ratingOf(db, me);
    const rating = shownRating(r, now);
    const [{ count: total }, { count: below }, rows, live] = await Promise.all([
      db.from("ratings").select("user_id", { count: "exact", head: true }).gt("games", 0),
      db.from("ratings").select("user_id", { count: "exact", head: true }).gt("games", 0).lt("rating", rating),
      db.from("matches").select(COLS).eq("status", "done").or(`p1.eq.${me},p2.eq.${me}`).order("ended_at", { ascending: false }).limit(10),
      myActive(db, me),
    ]);
    const list = check(rows) as MatchRow[];
    const opps = await namesFor([...new Set(list.map((m) => (m.p1 === me ? m.p2 : m.p1)).filter((x): x is string => !!x))]);
    return {
      available: true,
      rating,
      rd: Math.round(r.rd),
      tier: tierFor(rating),
      games: r.games,
      wins: r.wins,
      losses: r.losses,
      draws: r.draws,
      forfeits: r.forfeits,
      peak: Math.round(r.peak),
      percentile: r.games > 0 && total ? Math.round(((below ?? 0) / total) * 100) : null,
      history: list.map((m) => {
        const side = m.p1 === me ? "p1" : "p2";
        const opp = m.p1 === me ? m.p2 : m.p1;
        const mine = side === "p1" ? m.p1_score : m.p2_score;
        const theirs = side === "p1" ? m.p2_score : m.p1_score;
        return {
          id: m.id,
          when: m.ended_at ?? m.created_at,
          opp: m.bot ? "Practice bot" : opp ? (opps.get(opp) ?? "Opponent") : "Opponent",
          outcome: m.result === "draw" ? "draw" : m.result === side ? "win" : "loss",
          score: `${mine ?? 0} to ${theirs ?? 0}`,
          delta: side === "p1" ? m.p1_delta : m.p2_delta,
          ranked: m.ranked,
          forfeit: m.forfeit_by ? (m.forfeit_by === me ? "you" : "them") : null,
        };
      }),
      liveMatchId: live?.id ?? null,
    };
  } catch (e) {
    if (!(e instanceof DuelUnavailable)) console.warn("duel profile failed:", e instanceof Error ? e.message : e);
    return { available: false, rating: START_RATING, rd: START_RD, tier: tierFor(START_RATING), games: 0, wins: 0, losses: 0, draws: 0, forfeits: 0, peak: START_RATING, percentile: null, history: [], liveMatchId: null };
  }
}

/** Five rounds for a browser-only practice match (only used when the duel tables are missing). */
export function offlineRounds(): DuelItem[] {
  return pickItems(DUEL_ITEMS, newSeed()).map((id) => duelItem(id)!);
}
