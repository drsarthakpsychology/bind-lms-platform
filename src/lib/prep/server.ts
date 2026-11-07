import "server-only";
/**
 * Prep's database side. Writes use the service role; students only read their
 * own rows. Every call is wrapped: if the prep tables (2026_11_prep.sql) or the
 * learning-engine tables don't exist yet, reads come back empty and writes are
 * dropped quietly, so /prep still works (nothing is remembered).
 */
import { createAdminClient } from "@/lib/supabase/server";
import { recordAttempts } from "@/lib/learn/model/server";
import { specById } from "@/content/prep/specs";
import { PRIOR_B, fromPrepItem, isGoal, prepItem, prepSkill, subjectOfSkill } from "./catalog";
import type { SkillSnap } from "./plan";
import type { Paper } from "./sampling";
import { bestPerUser, standing, type DiagnosticResult, type MockScore, type Standing } from "./scoring";
import type { PrepExam, PrepQuestion, Subject } from "./types";

type Admin = ReturnType<typeof createAdminClient>;
type Row = Record<string, unknown>;

function admin(): Admin | null {
  try {
    return createAdminClient();
  } catch {
    return null;
  }
}

async function rows(q: PromiseLike<{ data: unknown; error: unknown }>): Promise<Row[]> {
  try {
    const { data, error } = await q;
    return error || !Array.isArray(data) ? [] : (data as Row[]);
  } catch {
    return [];
  }
}

async function one(q: PromiseLike<{ data: unknown; error: unknown }>): Promise<Row | null> {
  try {
    const { data, error } = await q;
    return error || !data || typeof data !== "object" ? null : (data as Row);
  } catch {
    return null;
  }
}

async function safe(p: PromiseLike<{ error: unknown }>): Promise<boolean> {
  try {
    const { error } = await p;
    return !error;
  } catch {
    return false;
  }
}

const num = (v: unknown, d = 0) => (typeof v === "number" && Number.isFinite(v) ? v : typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v)) ? Number(v) : d);
const str = (v: unknown) => (typeof v === "string" ? v : null);

/* --------------------------------------------------------- profile */

export type PrepProfile = { goal: PrepExam | null; diagnostic: DiagnosticResult | null; diagnosticAt: string | null };
const NO_PROFILE: PrepProfile = { goal: null, diagnostic: null, diagnosticAt: null };

export async function loadProfile(userId: string): Promise<PrepProfile> {
  const db = admin();
  if (!db || !userId) return NO_PROFILE;
  const r = await one(db.from("prep_profile").select("goal, diagnostic, diagnostic_at").eq("user_id", userId).maybeSingle());
  if (!r) return NO_PROFILE;
  const d = r.diagnostic as DiagnosticResult | null;
  return { goal: isGoal(r.goal) ? r.goal : null, diagnostic: d && Array.isArray(d.topics) ? d : null, diagnosticAt: str(r.diagnostic_at) };
}

export async function saveGoal(userId: string, goal: PrepExam, now = new Date()): Promise<boolean> {
  const db = admin();
  if (!db) return false;
  return safe(db.from("prep_profile").upsert({ user_id: userId, goal, updated_at: now.toISOString() }, { onConflict: "user_id" }));
}

/** Store the starting check. With no goal (exam tracks off) a stored goal is left as it was, for when tracks return. */
export async function saveDiagnostic(userId: string, goal: PrepExam | null, result: DiagnosticResult, now = new Date()): Promise<boolean> {
  const db = admin();
  if (!db) return false;
  return safe(db.from("prep_profile").upsert({ user_id: userId, ...(goal ? { goal } : {}), diagnostic: result, diagnostic_at: now.toISOString(), updated_at: now.toISOString() }, { onConflict: "user_id" }));
}

/* ----------------------------------------------------- the model */

/** This student's prep abilities, per subject. */
export async function loadSkills(userId: string): Promise<Map<Subject, SkillSnap>> {
  const out = new Map<Subject, SkillSnap>();
  const db = admin();
  if (!db || !userId) return out;
  for (const r of await rows(db.from("skill_state").select("skill, theta, n, last_at").eq("user_id", userId).like("skill", "prep-%").limit(200))) {
    const s = subjectOfSkill(String(r.skill));
    if (s) out.set(s, { theta: num(r.theta), n: num(r.n), lastAt: str(r.last_at) });
  }
  return out;
}

/** Calibrated difficulty for prep questions (by bank id). */
export async function loadItemB(ids: string[]): Promise<Map<string, number>> {
  const out = new Map<string, number>();
  const db = admin();
  if (!db || !ids.length) return out;
  for (let i = 0; i < ids.length; i += 300) {
    for (const r of await rows(db.from("item_stats").select("item, b").in("item", ids.slice(i, i + 300).map(prepItem)))) {
      const id = fromPrepItem(String(r.item));
      if (id) out.set(id, num(r.b));
    }
  }
  return out;
}

export type PrepCard = { id: string; dueAt: string; lapses: number };

/** Spaced-review cards for prep questions. */
export async function loadCards(userId: string): Promise<PrepCard[]> {
  const db = admin();
  if (!db || !userId) return [];
  return (await rows(db.from("review_cards").select("item, due_at, lapses").eq("user_id", userId).like("item", "prep:%").limit(5000))).flatMap((r) => {
    const id = fromPrepItem(String(r.item));
    return id ? [{ id, dueAt: str(r.due_at) ?? new Date(0).toISOString(), lapses: num(r.lapses) }] : [];
  });
}

/** How often each question has been seen. */
export async function loadSeen(userId: string): Promise<Map<string, number>> {
  const out = new Map<string, number>();
  const db = admin();
  if (!db || !userId) return out;
  for (const r of await rows(db.from("prep_seen").select("item, n").eq("user_id", userId).limit(10000))) out.set(String(r.item), num(r.n, 1));
  return out;
}

/** The question this student saw last (any mode), for resuming before prep_answers exists. */
export async function loadLastSeen(userId: string): Promise<string | null> {
  const db = admin();
  if (!db || !userId) return null;
  const r = (await rows(db.from("prep_seen").select("item").eq("user_id", userId).order("last_at", { ascending: false }).limit(1)))[0];
  return r ? String(r.item) : null;
}

async function markSeen(db: Admin, userId: string, ids: string[], now: Date) {
  const list = [...new Set(ids)].slice(0, 300);
  if (!list.length) return;
  const have = new Map((await rows(db.from("prep_seen").select("item, n").eq("user_id", userId).in("item", list))).map((r) => [String(r.item), num(r.n, 1)]));
  await safe(db.from("prep_seen").upsert(list.map((item) => ({ user_id: userId, item, n: (have.get(item) ?? 0) + 1, last_at: now.toISOString() })), { onConflict: "user_id,item" }));
}

export type PrepAnswer = { q: PrepQuestion; outcome: number; ms?: number | null };

/**
 * Record graded prep answers in the shared student model (skill
 * "prep-<subject>:apply", item "prep:<id>") and mark them seen. A question new
 * to the model starts at its author difficulty, so the first answers already
 * count for more (or less) on hard (or easy) questions.
 */
export async function recordPrep(userId: string, answers: PrepAnswer[], now = new Date()): Promise<void> {
  const db = admin();
  if (!db || !userId || !answers.length) return;
  const list = answers.slice(0, 200);
  await safe(
    db.from("item_stats").upsert(
      [...new Map(list.map((a) => [a.q.id, a.q])).values()].map((q) => ({ item: prepItem(q.id), b: PRIOR_B[q.difficulty], n: 0, updated_at: now.toISOString() })),
      { onConflict: "item", ignoreDuplicates: true },
    ),
  );
  for (let i = 0; i < list.length; i += 100) {
    await recordAttempts(
      userId,
      list.slice(i, i + 100).map((a) => ({ skill: prepSkill(a.q.subject), item: prepItem(a.q.id), outcome: a.outcome, fast: typeof a.ms === "number" && a.ms > 0 && a.ms < 30_000 && a.outcome >= 1 })),
      now,
    );
  }
  await markSeen(db, userId, list.map((a) => a.q.id), now);
}

/** Graded prep answers so far (sum of n over prep skills). */
export function answeredCount(skills: Map<Subject, SkillSnap>): number {
  let n = 0;
  for (const s of skills.values()) n += s.n;
  return n;
}

/* ------------------------------------------------------------ mocks */

export type MockMeta = { id: string; specId: string; startedAt: string; submittedAt: string | null; score: number | null; max: number | null };

/** Start a mock: store the paper and the deadline. Returns the attempt id, or null when not stored. */
export async function startAttempt(userId: string, paper: Paper, minutes: number, now = new Date()): Promise<{ id: string; deadline: string } | null> {
  const db = admin();
  const deadline = new Date(now.getTime() + minutes * 60_000).toISOString();
  if (!db || !userId) return null;
  const r = await one(db.from("prep_mock_attempts").insert({ user_id: userId, spec_id: paper.specId, started_at: now.toISOString(), deadline_at: deadline, paper }).select("id").single());
  return r?.id ? { id: String(r.id), deadline } : null;
}

export type StoredAttempt = { id: string; specId: string; paper: Paper; deadline: string; submittedAt: string | null; result: MockScore | null; standing: Standing | null; answers: Record<string, unknown>; marked: string[]; late: boolean };

export async function loadAttempt(userId: string, id: string): Promise<StoredAttempt | null> {
  const db = admin();
  if (!db || !userId || !/^[0-9a-f-]{36}$/i.test(id)) return null;
  const r = await one(db.from("prep_mock_attempts").select("id, spec_id, paper, deadline_at, submitted_at, result, answers, marked, late").eq("id", id).eq("user_id", userId).maybeSingle());
  if (!r) return null;
  const paper = r.paper as Paper | null;
  if (!paper || !Array.isArray(paper.sections)) return null;
  const result = (r.result as { score?: MockScore; standing?: Standing } | null) ?? null;
  return {
    id: String(r.id),
    specId: String(r.spec_id),
    paper,
    deadline: str(r.deadline_at) ?? new Date(0).toISOString(),
    submittedAt: str(r.submitted_at),
    result: result?.score ?? null,
    standing: result?.standing ?? null,
    answers: (r.answers as Record<string, unknown>) ?? {},
    late: r.late === true,
    marked: Array.isArray(r.marked) ? (r.marked as unknown[]).filter((x): x is string => typeof x === "string") : [],
  };
}

/** Where this score sits among other students' best scores on the same mock. */
export async function standingFor(userId: string, specId: string, score: number): Promise<Standing> {
  const db = admin();
  if (!db) return standing(score, []);
  const list = await rows(db.from("prep_mock_attempts").select("user_id, score").eq("spec_id", specId).not("submitted_at", "is", null).not("score", "is", null).limit(10000));
  return standing(score, bestPerUser(list.map((r) => ({ user: String(r.user_id), score: num(r.score) })), userId));
}

export async function finishAttempt(
  userId: string,
  id: string,
  data: { answers: Record<string, number | null>; marked: string[]; times: Record<string, number>; score: MockScore; standing: Standing; late: boolean },
  now = new Date(),
): Promise<boolean> {
  const db = admin();
  if (!db || !userId) return false;
  return safe(
    db
      .from("prep_mock_attempts")
      .update({ submitted_at: now.toISOString(), answers: data.answers, marked: data.marked, times: data.times, score: data.score.score, max_score: data.score.max, result: { score: data.score, standing: data.standing }, late: data.late })
      .eq("id", id)
      .eq("user_id", userId)
      .is("submitted_at", null),
  );
}

export async function loadMockHistory(userId: string, limit = 20): Promise<MockMeta[]> {
  const db = admin();
  if (!db || !userId) return [];
  return (await rows(db.from("prep_mock_attempts").select("id, spec_id, started_at, submitted_at, score, max_score").eq("user_id", userId).order("started_at", { ascending: false }).limit(limit)))
    .filter((r) => specById(String(r.spec_id)))
    .map((r) => ({ id: String(r.id), specId: String(r.spec_id), startedAt: String(r.started_at), submittedAt: str(r.submitted_at), score: r.score === null ? null : num(r.score), max: r.max_score === null ? null : num(r.max_score) }));
}

/* -------------------------------------------------------- interviews */

export type InterviewItem = { id: string; answer: string; covered: string[]; flags: string[]; pct: number; feedback?: string | null };

export async function saveInterview(userId: string, goal: PrepExam | null, items: InterviewItem[], score: number, now = new Date()): Promise<boolean> {
  const db = admin();
  if (!db || !userId || !items.length) return false;
  return safe(db.from("prep_interview_sessions").insert({ user_id: userId, goal, created_at: now.toISOString(), items, score }));
}

/** Interview ids this student has already answered, and how many sessions. */
export async function loadInterviewHistory(userId: string): Promise<{ sessions: number; seen: Set<string> }> {
  const db = admin();
  if (!db || !userId) return { sessions: 0, seen: new Set() };
  const list = await rows(db.from("prep_interview_sessions").select("items").eq("user_id", userId).order("created_at", { ascending: false }).limit(50));
  const seen = new Set<string>();
  for (const r of list) for (const it of Array.isArray(r.items) ? (r.items as Row[]) : []) if (typeof it.id === "string") seen.add(it.id);
  return { sessions: list.length, seen };
}
