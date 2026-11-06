/**
 * Generate → validate → retry. The AI call is injected so this file stays
 * pure and testable; server.ts wires it to the platform's aiChat.
 *
 * Every rejected draft's problems go back into the next prompt, so a retry
 * fixes the exact gaps (missing criterion, leaked name, wrong place …).
 */
import { CRITERIA, CRITERIA_BY_DX, dxForTopic } from "./criteria";
import { buildGeneratorPrompt } from "./prompt";
import type { AiCase, AiCaseInput, Difficulty, Setting } from "./types";
import { caseKey, validateDraft } from "./validate";

export type ChatFn = (
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  opts: { temperature: number; maxTokens: number },
) => Promise<{ text: string; provider: string; json?: unknown }>;

export type GenerateResult =
  | { ok: true; case: AiCase; tries: number; provider: string }
  | { ok: false; reason: "unavailable" | "rejected"; problems: string[]; tries: number };

/** Lift JSON out of a reply (fenced or with prose around it). */
export function parseJsonLoose(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  let s = fenced ? fenced[1] : text;
  if (!fenced) {
    const a = s.indexOf("{");
    const b = s.lastIndexOf("}");
    if (a >= 0 && b > a) s = s.slice(a, b + 1);
  }
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

export async function generateAiCase(input: AiCaseInput, chat: ChatFn, opts: { attempts?: number; now?: Date } = {}): Promise<GenerateResult> {
  const attempts = Math.min(Math.max(opts.attempts ?? 3, 1), 4);
  let problems: string[] = [];
  for (let i = 1; i <= attempts; i++) {
    const p = buildGeneratorPrompt(input, problems);
    let res: Awaited<ReturnType<ChatFn>>;
    try {
      // Temperature rises a little on retries so a stuck model moves.
      res = await chat(
        [
          { role: "system", content: p.system },
          { role: "user", content: p.user },
        ],
        { temperature: 0.6 + 0.1 * (i - 1), maxTokens: 2200 },
      );
    } catch {
      return { ok: false, reason: "unavailable", problems: ["The AI service is not available."], tries: i };
    }
    // Fixture mode (AI switched off) returns no case: stop, don't loop.
    if (res.provider === "fixture") return { ok: false, reason: "unavailable", problems: ["AI is switched off."], tries: i };
    const raw = res.json ?? parseJsonLoose(res.text);
    const v = validateDraft(raw, input);
    if (v.ok) {
      const now = (opts.now ?? new Date()).toISOString();
      return { ok: true, tries: i, provider: res.provider, case: { ...v.case, id: `ai-${input.dx}-${caseKey(v.case)}`, createdAt: now } };
    }
    problems = v.problems;
  }
  return { ok: false, reason: "rejected", problems, tries: attempts };
}

/**
 * Turn a practice request into a concrete generator input. `rand(n)` returns
 * 0..n-1 (crypto on the server, a fixed function in tests).
 */
export function resolveInput(
  o: { topic?: string | null; dx?: string | null; difficulty?: Difficulty | null; setting?: Setting | null },
  rand: (n: number) => number,
): AiCaseInput {
  const byTopic = o.topic ? dxForTopic(o.topic) : [];
  const pool = o.dx && CRITERIA_BY_DX[o.dx] ? [o.dx] : byTopic.length ? byTopic : CRITERIA.map((c) => c.dx);
  const dx = pool[rand(pool.length)];
  const difficulty: Difficulty = o.difficulty === 1 || o.difficulty === 2 || o.difficulty === 3 ? o.difficulty : 2;
  const setting: Setting = o.setting === "indian" || o.setting === "global" ? o.setting : rand(2) === 0 ? "indian" : "global";
  return { dx, difficulty, setting };
}
