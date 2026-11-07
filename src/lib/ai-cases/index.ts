import "server-only";
/**
 * AI practice cases, server side. `getAiPracticeCase()` is the entry point
 * other features use (the Daily Case game's practice mode can call it and
 * play `daily` like any of its own cases).
 *
 * Cost: a stored live case is always reused before anything is generated.
 * Generation is rate-limited per student and platform-wide, and each new
 * case is also kept in the shared AI cache, so even without the ai_cases
 * table the same request doesn't pay twice.
 */
import { randomInt } from "node:crypto";
import { z } from "zod";
import { aiChat } from "@/lib/ai/client";
import { cacheKeyFor, readCached, writeCached } from "@/lib/ai/cache";
import { rateLimit } from "@/lib/rate-limit";
import { toDailyCase } from "./adapter";
import { generateAiCase, resolveInput, type ChatFn } from "./generate";
import { getAiCase, listLiveCases, saveAiCase } from "./store";
import type { AiCase, AiCaseInput, AiCaseStatus, DailyCaseShape, Difficulty, Setting } from "./types";

export { toDailyCase } from "./adapter";
export { AI_CASE_LABEL, AI_CASE_NOTE } from "./types";
export type { AiCase, DailyCaseShape } from "./types";

/** Per student: new cases per hour. Platform: new cases per day. */
const GEN_PER_USER_HOUR = 4;
const GEN_PER_DAY = 80;

const pick = <T,>(xs: T[]): T => xs[randomInt(xs.length)];

/** The platform's AI layer, on the no-student-data lane. */
const platformChat: ChatFn = async (messages, opts) => {
  const res = await aiChat(messages, {
    workload: "content_generation",
    // Loose schema: gets the JSON lane + parse; the strict check is ours.
    schema: z.record(z.string(), z.unknown()),
    capability: "json",
    temperature: opts.temperature,
    maxTokens: opts.maxTokens,
  });
  return { text: res.text, provider: res.provider, json: res.json };
};

function cacheKey(i: AiCaseInput): string {
  return cacheKeyFor("content_generation", `ai-case|${i.dx}|${i.difficulty}|${i.setting}`, "ai-cases");
}

function idCacheKey(id: string): string {
  return cacheKeyFor("content_generation", `ai-case-id|${id}`, "ai-cases");
}

function looksLikeCase(c: unknown): c is AiCase {
  const x = c as AiCase | null;
  return !!x && typeof x.id === "string" && Array.isArray(x.clues) && x.clues.length === 6 && typeof x.answer === "string";
}

async function fromCache(i: AiCaseInput): Promise<AiCase | null> {
  try {
    const hit = await readCached(cacheKey(i));
    if (hit.hit === "none") return null;
    const c = JSON.parse(hit.text) as unknown;
    return looksLikeCase(c) && c.answer === i.dx ? c : null;
  } catch {
    return null;
  }
}

export type AiPracticeOpts = {
  userId?: string | null;
  /** Learner topic ("depression"); a diagnosis is drawn from it. */
  topic?: string | null;
  /** Exact diagnosis id (for admins/tests). Overrides topic. */
  dx?: string | null;
  difficulty?: Difficulty | null;
  setting?: Setting | null;
  /** Case ids the student has already played. */
  exclude?: string[];
  /** May a new case be generated if none is stored? Default true. */
  allowGenerate?: boolean;
  /** Injected for tests. */
  chat?: ChatFn;
};

export type AiPracticeCase = { case: AiCase; daily: DailyCaseShape; fresh: boolean };

/**
 * One AI case for practice. Reuses a stored live case when there is one the
 * student hasn't played; otherwise generates, checks and stores a new one.
 * Null when nothing is stored and generation isn't possible right now.
 */
export async function getAiPracticeCase(opts: AiPracticeOpts = {}): Promise<AiPracticeCase | null> {
  const input = resolveInput(opts, randomInt);
  const exclude = new Set(opts.exclude ?? []);
  const wrap = (c: AiCase, fresh: boolean): AiPracticeCase => ({ case: c, daily: toDailyCase(c), fresh });

  // 1. A stored live case matching the request.
  const exact = (await listLiveCases({ dx: input.dx, difficulty: input.difficulty, setting: input.setting })).filter((c) => !exclude.has(c.id));
  if (exact.length) return wrap(pick(exact), false);

  // 2. The shared cache (works even before the ai_cases table exists).
  const cached = await fromCache(input);
  if (cached && !exclude.has(cached.id)) {
    const rec = await getAiCase(cached.id);
    if (!rec || rec.status === "live") return wrap(cached, false);
  }

  // 3. Generate, within the limits.
  if (opts.allowGenerate !== false) {
    const okUser = opts.userId ? await rateLimit(`ai-case-gen:${opts.userId}`, GEN_PER_USER_HOUR, 60 * 60 * 1000) : true;
    const okAll = okUser && (await rateLimit("ai-case-gen:all", GEN_PER_DAY, 24 * 60 * 60 * 1000));
    if (okUser && okAll) {
      const res = await generateAiCase(input, opts.chat ?? platformChat);
      if (res.ok) {
        await saveAiCase(res.case, res.provider);
        const json = JSON.stringify(res.case);
        void writeCached(cacheKey(input), "content_generation", res.provider, json);
        void writeCached(idCacheKey(res.case.id), "content_generation", res.provider, json);
        return wrap(res.case, true);
      }
      console.warn(`[ai-cases] ${input.dx} d${input.difficulty} ${input.setting}: ${res.reason} after ${res.tries} tries: ${res.problems.slice(0, 3).join(" | ")}`);
    }
  }

  // 4. Anything live for the same diagnosis, then the same topic.
  const loose = [
    ...(await listLiveCases({ dx: input.dx })),
    ...(opts.topic ? await listLiveCases({ topic: opts.topic }) : []),
  ].filter((c) => !exclude.has(c.id));
  return loose.length ? wrap(pick(loose), false) : null;
}

/**
 * One AI case by id, for playing it (a reload, the next move). The table is
 * the source of truth; the shared cache covers the time before the table
 * exists. Removed cases can't be played; a flagged one can still be finished.
 */
export async function loadAiCase(id: string): Promise<{ case: AiCase; daily: DailyCaseShape; status: AiCaseStatus } | null> {
  if (!/^ai-[a-z0-9-]{2,80}$/.test(id)) return null;
  const rec = await getAiCase(id);
  if (rec) {
    if (rec.status === "removed") return null;
    const { status, flags: _flags, ...c } = rec;
    void _flags;
    return { case: c, daily: toDailyCase(c), status };
  }
  try {
    const hit = await readCached(idCacheKey(id));
    if (hit.hit === "none") return null;
    const c = JSON.parse(hit.text) as unknown;
    return looksLikeCase(c) && c.id === id ? { case: c, daily: toDailyCase(c), status: "live" } : null;
  } catch {
    return null;
  }
}

export { flagAiCase, getAiCase, listForReview, setAiCaseStatus } from "./store";
