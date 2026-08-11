"use client";

/**
 * Client-side helper to credit competencies from a practice tool completion.
 * Calls the server /api/practice/competency route (owner-scoped via auth cookie).
 * Returns the number of competencies credited, or throws on failure.
 */
export async function recordCompetencyEvent(
  tool: "mse" | "osce" | "judgment" | "rounds" | "formulation",
  keys: string[],
  score: number,
  detail?: string,
): Promise<number> {
  const res = await fetch("/api/practice/competency", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tool, keys, score, detail }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "unknown" }));
    throw new Error(err?.error ?? "failed to credit competency");
  }
  const j = await res.json();
  return j.credited ?? 0;
}

/** Convenience: the mapping from MSE level to competency keys. */
export const MSE_COMPETENCY_KEYS: Record<string, string[]> = {
  "1": ["clinical_interviewing"],
  "2": ["clinical_interviewing", "differential"],
  "3": ["clinical_interviewing", "differential"],
  "4": ["clinical_interviewing", "differential", "risk_assessment"],
  "5": ["clinical_interviewing", "differential", "risk_assessment", "cultural_attunement"],
};

/** OSCE stations → competency keys. */
export const OSCE_COMPETENCY_KEYS: Record<string, string[]> = {
  "osce-1": ["risk_assessment", "clinical_interviewing"],
  "osce-2": ["psychoeducation", "clinical_interviewing"],
  "osce-3": ["cultural_attunement", "clinical_interviewing"],
  "osce-4": ["clinical_interviewing", "differential"],
  "osce-5": ["psychoeducation", "clinical_interviewing"],
  "osce-6": ["clinical_interviewing", "cultural_attunement"],
  "osce-7": ["risk_assessment", "clinical_interviewing"],
  "osce-8": ["clinical_interviewing", "cultural_attunement"],
  "osce-9": ["risk_assessment", "clinical_interviewing", "crisis_management"],
  "osce-10": ["cultural_attunement", "clinical_interviewing"],
  "osce-11": ["risk_assessment", "clinical_interviewing", "ethics"],
  "osce-12": ["clinical_interviewing", "cultural_attunement", "ethics"],
};

/** Judgment (SCT) rounds → keys. */
export const JUDGMENT_COMPETENCY_KEYS: string[] = ["clinical_interviewing", "differential", "risk_assessment"];

/** Formulation stage 4 → keys. */
export const FORMULATION_COMPETENCY_KEYS: string[] = ["clinical_interviewing", "differential", "risk_assessment", "psychoeducation"];

/** Rounds session (per session, not per card). */
export const ROUNDS_COMPETENCY_KEYS: string[] = ["clinical_interviewing", "risk_assessment", "psychoeducation", "cultural_attunement"];

export function toolScore(tool: string, rawScore: number): number {
  // Normalise to 0..5 for the evidence weight (the backend expects 0..5).
  return Math.max(0, Math.min(5, rawScore));
}