import "server-only";
/**
 * The student model's database side. Every write uses the service role
 * (students can only read their own rows). Every call is wrapped: if the
 * tables don't exist yet (migration 2026_11_learning_engine.sql pending) or a
 * query fails, reads come back empty and writes are dropped quietly.
 *
 * Writes are read-modify-write in the app. Two answers from the same student
 * landing at the same millisecond could lose one update; that is acceptable
 * for a learning signal (the next answer corrects it).
 */
import { createAdminClient } from "@/lib/supabase/server";
import { topConfusions, type ConfusionPair, type ConfusionRow } from "./confusions";
import { isCalibrated } from "./elo";
import { MASTERY_STATES, type Mastery } from "./mastery";
import { makeRng, type Picked } from "./picker";
import { scorePlacement, type PlacementAnswer, type PlacementResult } from "./placement";
import {
  applyAttempts,
  buildMap,
  buildPractice,
  confusionKey,
  dueCount,
  itemsOfSkills,
  seedRows,
  weakSpots,
  type Attempt,
  type CardRow,
  type ItemRow,
  type ModelRows,
  type SkillRow,
  type StudentMapData,
  type WeakSpot,
} from "./student";

type Admin = ReturnType<typeof createAdminClient>;
type Json = Record<string, unknown>;

function admin(): Admin | null {
  try {
    return createAdminClient();
  } catch {
    return null;
  }
}

const num = (v: unknown, d = 0) => (typeof v === "number" && Number.isFinite(v) ? v : typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v)) ? Number(v) : d);
const str = (v: unknown) => (typeof v === "string" ? v : null);
const mastery = (v: unknown): Mastery => ((MASTERY_STATES as readonly string[]).includes(v as string) ? (v as Mastery) : "new");

function toSkill(r: Json): SkillRow {
  return {
    skill: String(r.skill),
    theta: num(r.theta),
    n: num(r.n),
    lastAt: str(r.last_at),
    mastery: mastery(r.mastery),
    correctDays: Array.isArray(r.correct_days) ? r.correct_days.filter((d): d is string => typeof d === "string").map((d) => d.slice(0, 10)) : [],
  };
}
function toItem(r: Json): ItemRow {
  return { item: String(r.item), b: num(r.b), n: num(r.n) };
}
function toCard(r: Json): CardRow {
  return { item: String(r.item), stability: num(r.stability, 1), difficulty: num(r.difficulty, 5), dueAt: str(r.due_at) ?? new Date(0).toISOString(), lastAt: str(r.last_at), reps: num(r.reps), lapses: num(r.lapses) };
}
function toConfusion(r: Json): ConfusionRow {
  return { chosen: String(r.chosen), correct: String(r.correct), n: num(r.n), lastAt: str(r.last_at) ?? new Date(0).toISOString(), skill: str(r.skill) };
}

async function rowsOf<T>(q: PromiseLike<{ data: unknown; error: unknown }>, map: (r: Json) => T): Promise<T[]> {
  try {
    const { data, error } = await q;
    if (error || !Array.isArray(data)) return [];
    return (data as Json[]).map(map);
  } catch {
    return [];
  }
}

/** All of one student's model rows. `items` limits item_stats/review_cards to those ids. */
async function loadRows(db: Admin, userId: string, items?: string[]): Promise<ModelRows> {
  const itemIds = items ? [...new Set(items.filter(Boolean))] : undefined;
  const statsQ = itemIds ? (itemIds.length ? db.from("item_stats").select("item, b, n").in("item", itemIds) : null) : db.from("item_stats").select("item, b, n").limit(5000);
  const cardsQ = itemIds
    ? itemIds.length
      ? db.from("review_cards").select("item, stability, difficulty, due_at, last_at, reps, lapses").eq("user_id", userId).in("item", itemIds)
      : null
    : db.from("review_cards").select("item, stability, difficulty, due_at, last_at, reps, lapses").eq("user_id", userId).limit(5000);
  const [skills, stats, cards, confusions] = await Promise.all([
    rowsOf(db.from("skill_state").select("skill, theta, n, last_at, mastery, correct_days").eq("user_id", userId).limit(2000), toSkill),
    statsQ ? rowsOf(statsQ, toItem) : Promise.resolve([]),
    cardsQ ? rowsOf(cardsQ, toCard) : Promise.resolve([]),
    rowsOf(db.from("confusions").select("chosen, correct, n, last_at, skill").eq("user_id", userId).order("last_at", { ascending: false }).limit(500), toConfusion),
  ]);
  return {
    skills: new Map(skills.map((r) => [r.skill, r])),
    items: new Map(stats.map((r) => [r.item, r])),
    cards: new Map(cards.map((r) => [r.item, r])),
    confusions: new Map(confusions.map((r) => [confusionKey(r.chosen, r.correct), r])),
  };
}

const skillDb = (userId: string, r: SkillRow) => ({ user_id: userId, skill: r.skill, theta: r.theta, n: r.n, last_at: r.lastAt, mastery: r.mastery, correct_days: r.correctDays });

async function safe(p: PromiseLike<unknown>) {
  try {
    await p;
  } catch {
    /* table missing or write failed: drop */
  }
}

/**
 * Record graded answers: updates skill_state (ability + mastery), item_stats
 * (question difficulty), review_cards (spaced review) and confusions (mix-ups).
 */
export async function recordAttempts(userId: string, attempts: Attempt[], now = new Date()): Promise<boolean> {
  const list = attempts.filter((a) => a.skill && Number.isFinite(a.outcome)).slice(0, 100);
  if (!userId || !list.length) return false;
  const db = admin();
  if (!db) return false;
  try {
    // Also the difficulty of each skill's own questions, so mastery is judged on them.
    const rows = await loadRows(db, userId, [...list.map((a) => a.item ?? "").filter(Boolean), ...itemsOfSkills(new Set(list.map((a) => a.skill)))].slice(0, 300));
    const next = applyAttempts(rows, list, now);
    const skillRows = [...next.changed.skills].map((k) => skillDb(userId, next.skills.get(k)!));
    const itemRows = [...next.changed.items].map((k) => {
      const r = next.items.get(k)!;
      return { item: r.item, b: r.b, n: r.n, updated_at: now.toISOString() };
    });
    const cardRows = [...next.changed.cards].map((k) => {
      const c = next.cards.get(k)!;
      return { user_id: userId, item: c.item, stability: c.stability, difficulty: c.difficulty, due_at: c.dueAt, last_at: c.lastAt, reps: c.reps, lapses: c.lapses };
    });
    const confRows = [...next.changed.confusions].map((k) => {
      const c = next.confusions.get(k)!;
      return { user_id: userId, chosen: c.chosen, correct: c.correct, n: c.n, last_at: c.lastAt, skill: c.skill ?? null };
    });
    await Promise.all([
      skillRows.length ? safe(db.from("skill_state").upsert(skillRows, { onConflict: "user_id,skill" })) : null,
      itemRows.length ? safe(db.from("item_stats").upsert(itemRows, { onConflict: "item" })) : null,
      cardRows.length ? safe(db.from("review_cards").upsert(cardRows, { onConflict: "user_id,item" })) : null,
      confRows.length ? safe(db.from("confusions").upsert(confRows, { onConflict: "user_id,chosen,correct" })) : null,
    ]);
    return true;
  } catch {
    return false;
  }
}

/** One graded answer (see recordAttempts). */
export async function recordAttempt(
  userId: string,
  a: { skill: string; item?: string | null; outcome: number; chosen?: string | null; correct?: string | null; first?: boolean },
): Promise<boolean> {
  return recordAttempts(userId, [a]);
}

/** Keep a history row in learn_events (same columns as the events API). */
export async function logEvents(
  userId: string,
  events: { type: string; kind: string; ok: boolean | null; score: number | null; skill: string | null; item: string | null; prompt: string | null; path: string; ms?: number | null }[],
  now = new Date(),
) {
  const db = admin();
  if (!db || !events.length) return;
  await safe(db.from("learn_events").insert(events.map((e) => ({ user_id: userId, ms: null, ...e, prompt: e.prompt?.slice(0, 200) ?? null, created_at: now.toISOString() }))));
}

/* ------------------------------------------------------------ reads */

export type StudentMap = StudentMapData & {
  confusions: ConfusionPair[];
  weak: WeakSpot[];
  due: number;
  placement: PlacementResult | null;
};

const EMPTY_PLACEMENT = null;

export async function loadPlacement(userId: string): Promise<{ doneAt: string; result: PlacementResult } | null> {
  const db = admin();
  if (!db) return null;
  try {
    const { data, error } = await db.from("placement").select("done_at, result").eq("user_id", userId).maybeSingle();
    if (error || !data) return null;
    const result = data.result as PlacementResult | null;
    if (!result || !Array.isArray(result.topics)) return null;
    return { doneAt: String(data.done_at), result };
  } catch {
    return null;
  }
}

/** Everything the strengths & weaknesses map needs. */
export async function loadStudentMap(userId: string, titles: Record<string, string> = {}, now = new Date()): Promise<StudentMap> {
  const db = admin();
  const empty: StudentMap = { ...buildMap([], now, titles), confusions: [], weak: [], due: 0, placement: EMPTY_PLACEMENT };
  if (!db || !userId) return empty;
  try {
    const [rows, placed] = await Promise.all([loadRows(db, userId), loadPlacement(userId)]);
    const skills = [...rows.skills.values()];
    return {
      ...buildMap(skills, now, titles, rows.items),
      confusions: topConfusions([...rows.confusions.values()], now, 3),
      weak: weakSpots(skills, now, 3, rows.items),
      due: dueCount(rows.cards.values(), now),
      placement: placed?.result ?? null,
    };
  } catch {
    return empty;
  }
}

export type WeakSpotReport = { weak: WeakSpot[]; confusions: ConfusionPair[]; graded: number; calibrated: boolean; placement: PlacementResult | null };

/**
 * A student's weakest skills and top mix-ups, for the admin student profile.
 * Call it only after checking the viewer is an admin.
 */
export async function loadWeakSpots(userId: string, k = 5, now = new Date()): Promise<WeakSpotReport> {
  const db = admin();
  const empty: WeakSpotReport = { weak: [], confusions: [], graded: 0, calibrated: false, placement: null };
  if (!db || !userId) return empty;
  try {
    const [rows, placed] = await Promise.all([loadRows(db, userId), loadPlacement(userId)]);
    const skills = [...rows.skills.values()];
    const graded = skills.reduce((a, r) => a + r.n, 0);
    return { weak: weakSpots(skills, now, k, rows.items), confusions: topConfusions([...rows.confusions.values()], now, 3), graded, calibrated: isCalibrated(graded), placement: placed?.result ?? null };
  } catch {
    return empty;
  }
}

/**
 * A Goldilocks practice session for this student (question ids, in order).
 * `round` is a fresh id per request, so the page can restart its runner.
 */
export async function loadPracticeSession(userId: string, topic?: string | null, size = 10, now = new Date()): Promise<{ picked: Picked[]; round: string }> {
  const db = admin();
  // Seeded per request (not per render) so each visit gets a fresh mix.
  const seed = (now.getTime() ^ hashOf(userId)) >>> 0;
  const rng = makeRng(seed);
  const round = seed.toString(36);
  const empty: ModelRows = { skills: new Map(), items: new Map(), cards: new Map(), confusions: new Map() };
  if (!db || !userId) return { picked: buildPractice(empty, now, rng, size, topic), round };
  try {
    const rows = await loadRows(db, userId);
    return { picked: buildPractice(rows, now, rng, size, topic), round };
  } catch {
    return { picked: buildPractice(empty, now, rng, size, topic), round };
  }
}

function hashOf(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/**
 * Grade a placement on the server, store it, and seed starting abilities for
 * skills the student hasn't practised yet.
 */
export async function savePlacement(userId: string, answers: PlacementAnswer[], now = new Date()): Promise<PlacementResult> {
  const db = admin();
  if (!db || !userId) return scorePlacement(answers);
  try {
    const stats = await rowsOf(db.from("item_stats").select("item, b, n").in("item", answers.map((a) => a.item).slice(0, 40)), toItem);
    const b = new Map(stats.map((s) => [s.item, s.b]));
    const result = scorePlacement(answers, (id) => b.get(id) ?? 0);
    const skills = await rowsOf(db.from("skill_state").select("skill, theta, n, last_at, mastery, correct_days").eq("user_id", userId).limit(2000), toSkill);
    const seeds = seedRows(result, new Map(skills.map((r) => [r.skill, r])));
    await Promise.all([
      safe(db.from("placement").upsert({ user_id: userId, done_at: now.toISOString(), result }, { onConflict: "user_id" })),
      seeds.length ? safe(db.from("skill_state").upsert(seeds.map((r) => skillDb(userId, r)), { onConflict: "user_id,skill" })) : null,
    ]);
    return result;
  } catch {
    return scorePlacement(answers);
  }
}

/** Short summary for the optional "today" suggestion. */
export async function loadTodaySuggestion(userId: string, now = new Date()): Promise<{ due: number; weak: WeakSpot | null; placed: boolean }> {
  const db = admin();
  if (!db || !userId) return { due: 0, weak: null, placed: false };
  try {
    const [skills, cards, placed] = await Promise.all([
      rowsOf(db.from("skill_state").select("skill, theta, n, last_at, mastery, correct_days").eq("user_id", userId).limit(2000), toSkill),
      rowsOf(db.from("review_cards").select("item, stability, difficulty, due_at, last_at, reps, lapses").eq("user_id", userId).lte("due_at", now.toISOString()).limit(500), toCard),
      loadPlacement(userId),
    ]);
    return { due: dueCount(cards, now), weak: weakSpots(skills, now, 1)[0] ?? null, placed: !!placed };
  } catch {
    return { due: 0, weak: null, placed: false };
  }
}
