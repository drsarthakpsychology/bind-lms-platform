import "server-only";
/**
 * Replay guard for games dealt on the server. A run's state travels in a
 * signed token, so an old token could be sent again to try a step a second
 * time. Each step's first result is stored (games2_run_steps,
 * supabase/migrations_pending/2026_11_games2_run_steps.sql) and a repeat
 * gets that same result back: a retry after a lost connection works, a
 * second try does not. Fails open: if the table is missing or a query fails,
 * the step simply runs.
 */
import { adminDb } from "./results";

const TABLE = "games2_run_steps";

/**
 * Run `make` once per (student, game, run, step). Returns the first stored
 * result when there is one (`fresh: false`), else the new result
 * (`fresh: true`, so the caller grades and records it once).
 */
export async function oncePerStep<T>(userId: string, game: string, run: string, step: string, make: () => T | Promise<T>): Promise<{ result: T; fresh: boolean }> {
  const db = adminDb();
  const key = { user_id: userId, game, run: run.slice(0, 80), step: step.slice(0, 80) };
  if (db) {
    const prior = await read<T>(db, key);
    if (prior !== undefined) return { result: prior, fresh: false };
  }
  const result = await make();
  if (!db) return { result, fresh: true };
  try {
    const { error } = await db.from(TABLE).insert({ ...key, result: result as unknown as Record<string, unknown> });
    if (error && error.code === "23505") {
      // Sent twice at the same moment: the first one stored wins.
      const won = await read<T>(db, key);
      if (won !== undefined) return { result: won, fresh: false };
    }
  } catch {
    /* table missing: no replay guard */
  }
  return { result, fresh: true };
}

async function read<T>(db: NonNullable<ReturnType<typeof adminDb>>, key: { user_id: string; game: string; run: string; step: string }): Promise<T | undefined> {
  try {
    const { data, error } = await db.from(TABLE).select("result").eq("user_id", key.user_id).eq("game", key.game).eq("run", key.run).eq("step", key.step).maybeSingle();
    if (error || !data) return undefined;
    return (data as { result: T }).result;
  } catch {
    return undefined;
  }
}
