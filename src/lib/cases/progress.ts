/**
 * Saved progress for half-finished cases (pure part, shared by the server,
 * the browser and the tests). One saved step per student, tool and case.
 * The server keeps it in answer_history (tool "p:<tool>", column `state`,
 * see supabase/migrations_pending/2026_11_case_progress.sql); the browser
 * keeps a copy in localStorage. Per case, the newer copy wins; a finished
 * case leaves a "cleared" mark so an older copy can't bring it back.
 */

/** Tools that save a half-finished case. */
export const PROGRESS_TOOLS = ["ward", "escape", "osce", "formulation", "detective", "wwyd", "two-minute", "landmark", "mse-small"] as const;
export type ProgressTool = (typeof PROGRESS_TOOLS)[number];

export function isProgressTool(x: unknown): x is ProgressTool {
  return typeof x === "string" && (PROGRESS_TOOLS as readonly string[]).includes(x);
}

/** The answer_history tool id that holds a tool's saved steps. */
export const progressKey = (tool: ProgressTool) => `p:${tool}`;

/** A saved step is small: anything bigger is not stored. */
export const MAX_STATE_BYTES = 16_000;

/** One case's saved step. `state: null` means finished (cleared) at `at`. */
export type ProgressRow = { item: string; state: unknown; at: number };
export type ProgressSnapshot = { owner: string | null; rows: ProgressRow[] };
export const NO_PROGRESS: ProgressSnapshot = { owner: null, rows: [] };

export function cleanState(x: unknown): unknown | undefined {
  if (x === null || x === undefined) return undefined;
  try {
    const s = JSON.stringify(x);
    if (!s || s.length > MAX_STATE_BYTES) return undefined;
    return JSON.parse(s);
  } catch {
    return undefined;
  }
}

/** Two copies (server and browser): per case the newer one wins. */
export function mergeProgress(a: readonly ProgressRow[], b: readonly ProgressRow[]): Map<string, ProgressRow> {
  const out = new Map<string, ProgressRow>();
  for (const r of [...a, ...b]) {
    const had = out.get(r.item);
    if (!had || r.at >= had.at) out.set(r.item, r);
  }
  return out;
}

/** Cases with a live saved step (not cleared). */
export function startedIds(rows: ReadonlyMap<string, ProgressRow>): Set<string> {
  return new Set([...rows.values()].filter((r) => r.state !== null && r.state !== undefined).map((r) => r.item));
}

/** A short tag for whose copy this is, so a shared browser keeps one per student. */
export function ownerTag(id: string): string {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  return (h >>> 0).toString(36);
}
