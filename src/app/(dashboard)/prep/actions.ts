"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { rateLimit } from "@/lib/rate-limit";
import { aiChat } from "@/lib/ai/client";
import { AiGuardError, guardStudentCall } from "@/lib/ai/guards";
import { AiUnavailableError } from "@/lib/ai/router";
import { makeRng } from "@/lib/learn/model/picker";
import { specById } from "@/content/prep/specs";
import { activeGoal, specVisible } from "@/lib/prep/catalog";
import { BANK, INTERVIEW_KEY, KEY, learnHrefForQuestion } from "@/lib/prep/bank";
import { resultView, type MockResultView } from "@/lib/prep/results";
import { sampleMock, type Paper } from "@/lib/prep/sampling";
import { cleanChoice, scoreMock } from "@/lib/prep/scoring";
import { selfScore } from "@/lib/prep/interview";
import { finishAttempt, loadAttempt, loadProfile, loadSeen, loadSeenRows, recordPrep, saveInterview, standingFor, startAttempt, type InterviewItem } from "@/lib/prep/server";
import { loadAnswers, saveAnswer, saveAnswers, setSaved } from "@/lib/prep/answers";
import { prepHistory } from "@/lib/prep/history";
import { toView, type PrepQView, type PrepReveal } from "@/lib/prep/view";
import type { PrepQuestion } from "@/lib/prep/types";

/** Who is asking. `learner` = a student whose answers count (staff preview saves nothing to the model). */
async function who(): Promise<{ id: string; learner: boolean } | null> {
  const s = await getSession();
  if (s.status !== "ok") return null;
  return { id: s.profile.id, learner: s.profile.role === "student" || s.profile.role === "alumni" };
}

const id = z.string().min(1).max(80);
const choice = z.number().int().min(0).max(3).nullable();

/* -------------------------------------------- practice and review */

const checkSchema = z.object({ id, choice: z.number().int().min(0).max(3), ms: z.number().min(0).max(3_600_000).optional() });

function reveal(q: PrepQuestion): PrepReveal {
  return { id: q.id, answer: q.answer, explanation: q.explanation, learnHref: learnHrefForQuestion(q), ...(q.visual ? { visual: q.visual } : {}) };
}

/**
 * Check one bank answer: the answer and full explanation come back, the
 * answer goes to the student model and to the bank's record (for percent
 * right, Wrong answers and resuming).
 */
export async function checkAnswer(input: { id: string; choice: number; ms?: number }): Promise<PrepReveal & { correct: boolean }> {
  const parsed = checkSchema.safeParse(input);
  const q = parsed.success ? KEY.get(parsed.data.id) : undefined;
  if (!parsed.success || !q) throw new Error("Unknown question");
  const correct = parsed.data.choice === q.answer;
  const me = await who();
  if (me?.learner) await Promise.all([recordPrep(me.id, [{ q, outcome: correct ? 1 : 0, ms: parsed.data.ms }]), saveAnswer(me.id, q.id, parsed.data.choice, correct)]);
  return { ...reveal(q), correct };
}

/** Show the answer without answering (nothing is recorded). */
export async function revealAnswer(qid: string): Promise<PrepReveal> {
  const q = id.safeParse(qid).success ? KEY.get(qid) : undefined;
  if (!q || !(await who())) throw new Error("Unknown question");
  return reveal(q);
}

/** Save (bookmark) or unsave a question. */
export async function toggleSaved(input: { id: string; saved: boolean }): Promise<{ ok: boolean }> {
  const parsed = z.object({ id, saved: z.boolean() }).safeParse(input);
  const me = await who();
  if (!parsed.success || !me?.learner || !KEY.has(parsed.data.id)) return { ok: false };
  return { ok: await setSaved(me.id, parsed.data.id, parsed.data.saved) };
}

/* ------------------------------------------------------------ mocks */

export type MockPaperView = { attemptId: string | null; specId: string; deadline: number; serverNow: number; sections: { title: string; wanted: number; questions: PrepQView[] }[] };

/** Start a timed mock: sample a fresh paper on the server and start the clock. */
export async function startMock(specId: string): Promise<MockPaperView | { error: string }> {
  const spec = specById(specId);
  if (!spec || !specVisible(spec)) return { error: "That mock doesn't exist." };
  const me = await who();
  if (!me) return { error: "Please sign in again." };
  const now = new Date();
  const [seen, seenRows, book] = me.learner ? await Promise.all([loadSeen(me.id), loadSeenRows(me.id), loadAnswers(me.id)]) : [new Map<string, number>(), new Map(), null];
  // Answer history order: never seen first, then wrong, right ones last (oldest first).
  const history = book ? prepHistory(book.map, seenRows) : undefined;
  const paper = sampleMock(BANK, spec, makeRng((now.getTime() ^ hash(me.id)) >>> 0), seen, { history, now: now.getTime() });
  if (!paper.sections.some((s) => s.ids.length)) return { error: "Questions for this mock are still being added." };
  const stored = me.learner ? await startAttempt(me.id, paper, spec.minutes, now) : null;
  return {
    attemptId: stored?.id ?? null,
    specId: spec.id,
    deadline: stored ? Date.parse(stored.deadline) : now.getTime() + spec.minutes * 60_000,
    serverNow: now.getTime(),
    sections: paper.sections.map((s) => ({ title: s.title, wanted: s.wanted, questions: s.ids.map((x) => toView(KEY.get(x)!)) })),
  };
}

const submitSchema = z.object({
  specId: z.string().max(60),
  attemptId: z.string().max(40).nullable(),
  sections: z.array(z.object({ title: z.string().max(80), ids: z.array(id).max(200) })).max(12),
  answers: z.record(z.string(), choice),
  marked: z.array(id).max(400),
  times: z.record(z.string(), z.number().min(0).max(36_000_000)),
});

/** Grace after the deadline for a slow connection before an attempt counts as late. */
const GRACE_MS = 90_000;

/** Submit a mock (also called by the timer at time-up). Scored on the server against the stored paper. */
export async function submitMock(input: z.input<typeof submitSchema>): Promise<MockResultView | { error: string }> {
  const parsed = submitSchema.safeParse(input);
  if (!parsed.success) return { error: "Couldn't read your answers. Try again." };
  const d = parsed.data;
  const spec = specById(d.specId);
  if (!spec) return { error: "That mock doesn't exist." };
  const me = await who();
  if (!me) return { error: "Please sign in again." };
  const now = new Date();

  const stored = d.attemptId && me.learner ? await loadAttempt(me.id, d.attemptId) : null;
  if (stored?.submittedAt && stored.result) return resultView(spec, stored.result, stored.standing, { saved: true, late: stored.late, marked: stored.marked });
  // The stored paper wins. Without one (tables not set up, or a staff preview),
  // only real questions from this pattern's subjects are scored.
  const paper: Paper = stored?.paper ?? {
    specId: spec.id,
    sections: spec.sections.map((sec, i) => {
      const ids = [...new Set(d.sections[i]?.ids ?? [])].filter((x) => sec.subjects.includes(KEY.get(x)?.subject as never)).slice(0, sec.count);
      return { title: sec.title, ids, wanted: sec.count };
    }),
  };
  const allIds = new Set(paper.sections.flatMap((s) => s.ids));
  const answers = Object.fromEntries(Object.entries(d.answers).filter(([k]) => allIds.has(k)).map(([k, v]) => [k, cleanChoice(v)]));
  const times = Object.fromEntries(Object.entries(d.times).filter(([k]) => allIds.has(k)));
  const marked = d.marked.filter((x) => allIds.has(x));
  const score = scoreMock(spec, paper, answers, KEY, times);
  const late = !!stored && now.getTime() > Date.parse(stored.deadline) + GRACE_MS;

  if (!stored) return resultView(spec, score, null, { saved: false, late: false, marked });
  const standing = await standingFor(me.id, spec.id, score.score);
  const saved = await finishAttempt(me.id, stored.id, { answers, marked, times, score, standing, late }, now);
  if (saved === "already") {
    // Counted once: show the result that was stored first, record nothing again.
    const first = await loadAttempt(me.id, stored.id);
    if (first?.result) return resultView(spec, first.result, first.standing, { saved: true, late: first.late, marked: first.marked });
    return resultView(spec, score, standing, { saved: true, late, marked });
  }
  // Answered questions feed the model and the bank's record (blanks are not evidence either way).
  const answeredItems = score.items.filter((i) => i.chosen !== null);
  await Promise.all([
    recordPrep(
      me.id,
      answeredItems.map((i) => ({ q: KEY.get(i.id)!, outcome: i.correct ? 1 : 0, ms: i.ms })),
      now,
    ),
    saveAnswers(me.id, answeredItems.map((i) => ({ item: i.id, choice: i.chosen as number, ok: i.correct })), now),
  ]);
  revalidatePath("/prep");
  return resultView(spec, score, standing, { saved, late, marked });
}

/* -------------------------------------------------------- interview */

export type InterviewReveal = { modelAnswer: string; mustCover: string[]; redFlags: string[] };

/** After the student answers: the rubric and the model answer. */
export async function revealInterview(qid: string): Promise<InterviewReveal | { error: string }> {
  const q = INTERVIEW_KEY.get(qid);
  if (!q || !(await who())) return { error: "That question is gone." };
  return { modelAnswer: q.modelAnswer, mustCover: q.mustCover, redFlags: q.redFlags };
}

const FEEDBACK_PROMPT =
  "You are a senior psychologist on an admission interview panel in India: a clinical psychology master's (M.Clin.Psy), an MA/MSc Psychology or a research programme. " +
  "A candidate has answered a practice interview question. Give short, kind, specific feedback in plain English (90-160 words): " +
  "1) what they did well, 2) which must-cover points they missed or got wrong, 3) one concrete way to make the answer stronger. " +
  "Point out any red flag from the list if their answer shows it. Never invent facts, citations or statistics. " +
  "If the answer hints at the candidate's own distress, respond with care and suggest talking to someone they trust. Write only the feedback.";

/** Optional AI feedback on one answer. Uses the no-training workload (knowledge_tutor), like doubt drafts. */
export async function interviewFeedback(input: { id: string; answer: string }): Promise<{ text: string } | { error: string }> {
  const q = INTERVIEW_KEY.get(String(input?.id ?? ""));
  const answer = String(input?.answer ?? "").trim().slice(0, 4000);
  const me = await who();
  if (!q || !me) return { error: "That question is gone." };
  if (answer.split(/\s+/).length < 8) return { error: "Write or say a little more first, then ask for feedback." };
  if (!(await rateLimit(`prepfeedback:${me.id}`, 12))) return { error: "That's a lot of feedback in a minute. Wait a moment and try again." };
  try {
    guardStudentCall("knowledge_tutor", { enabled: process.env.AI_ENABLED !== "false" });
    const res = await aiChat(
      [
        { role: "system", content: FEEDBACK_PROMPT },
        {
          role: "user",
          content: [`Question: ${q.question}`, `Must cover:\n- ${q.mustCover.join("\n- ")}`, `Red flags:\n- ${q.redFlags.join("\n- ")}`, `Candidate's answer:\n${answer}`].join("\n\n"),
        },
      ],
      { workload: "knowledge_tutor", taskTier: "normal", maxTokens: 450, temperature: 0.3 },
    );
    const text = res.text.trim();
    if (res.provider === "fixture" || !text) return { error: "AI feedback isn't available right now. Use the checklist above." };
    return { text };
  } catch (e) {
    if (e instanceof AiGuardError || e instanceof AiUnavailableError) return { error: "AI feedback isn't available right now. Use the checklist above." };
    console.error("[prep-interview-feedback]", e);
    return { error: "Couldn't get feedback. Try again in a moment." };
  }
}

const sessionSchema = z.object({
  items: z
    .array(z.object({ id, answer: z.string().max(6000), covered: z.array(z.string().max(400)).max(20), flags: z.array(z.string().max(400)).max(20), feedback: z.string().max(3000).nullable().optional() }))
    .min(1)
    .max(12),
});

/** Store a finished interview session (self-scores are recomputed on the server). */
export async function saveInterviewSession(input: z.input<typeof sessionSchema>): Promise<{ saved: boolean; score: number }> {
  const parsed = sessionSchema.safeParse(input);
  const me = await who();
  if (!parsed.success || !me) return { saved: false, score: 0 };
  const items: InterviewItem[] = parsed.data.items.flatMap((it) => {
    const q = INTERVIEW_KEY.get(it.id);
    if (!q) return [];
    const covered = it.covered.filter((c) => q.mustCover.includes(c));
    const flags = it.flags.filter((f) => q.redFlags.includes(f));
    return [{ id: q.id, answer: it.answer, covered, flags, pct: selfScore(q.mustCover.length, covered.length, flags.length).pct, feedback: it.feedback ?? null }];
  });
  const score = items.length ? Math.round(items.reduce((a, i) => a + i.pct, 0) / items.length) : 0;
  const goal = activeGoal((await loadProfile(me.id)).goal);
  const saved = me.learner ? await saveInterview(me.id, goal, items, score) : false;
  revalidatePath("/prep");
  return { saved, score };
}

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}
