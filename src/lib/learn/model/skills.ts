/**
 * Skills are "topic:competency" strings, e.g. "depression:criteria".
 * Competencies follow the clinical workflow.
 */
export const COMPETENCIES = ["recognise", "criteria", "differentiate", "apply", "mse", "risk", "pharm"] as const;
export type Competency = (typeof COMPETENCIES)[number];

export function skillKey(topic: string, competency: Competency | string): string {
  return `${topic}:${competency}`;
}

/** /study/depression/2-3 → "depression:apply" (module-level fallback skill). */
export function skillFromPath(path: string): string | null {
  const m = path.match(/^\/study\/([a-z0-9-]+)/);
  return m ? skillKey(m[1], "apply") : null;
}
