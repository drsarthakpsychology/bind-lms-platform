import "server-only";
import { specById } from "@/content/prep/specs";
import { resultView } from "@/lib/prep/results";
import { loadAttempt, standingFor } from "@/lib/prep/server";
import type { PrepMockResult } from "./contract-practise-admin";

/**
 * One saved timed mock for the app, exactly as the website's result page
 * (/prep/mock/result/:id) builds it: the student's own attempt only, the
 * rank worked out again on each visit. `result` is null when the paper was
 * never handed in.
 */
export async function prepMockResult(userId: string, id: string): Promise<PrepMockResult | null> {
  const attempt = await loadAttempt(userId, id);
  const spec = attempt ? specById(attempt.specId) : undefined;
  if (!attempt || !spec) return null;
  const standing = attempt.result ? await standingFor(userId, spec.id, attempt.result.score) : null;
  return {
    v: 1,
    id: attempt.id,
    specId: spec.id,
    title: spec.short,
    result: attempt.result ? (resultView(spec, attempt.result, standing ?? attempt.standing, { saved: true, late: attempt.late, marked: attempt.marked }) as unknown as Record<string, unknown>) : null,
  };
}
