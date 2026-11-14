/**
 * Server-side retry for database writes. A write that fails for a passing
 * reason (connection dropped, timeout, lock conflict, gateway 5xx) is tried
 * again a couple of times before giving up. A write the database refuses for a
 * lasting reason (constraint, missing column, permission) is not retried:
 * trying again would only fail the same way.
 *
 * Pure (no server-only import) so it is unit-tested directly.
 */

export type DbError = { code?: string | null; message?: string | null; status?: number | null } | null | undefined;

/** Postgres / PostgREST codes that mean "try again". */
const TRANSIENT_CODES = new Set(["40001", "40P01", "55P03", "57014", "57P01", "57P02", "57P03", "53300", "53400", "PGRST000", "PGRST001", "PGRST002", "PGRST003"]);

export function isTransient(error: DbError): boolean {
  if (!error) return false;
  const code = String(error.code ?? "");
  if (TRANSIENT_CODES.has(code) || code.startsWith("08")) return true;
  if (typeof error.status === "number" && error.status >= 500) return true;
  // supabase-js reports a network failure with no code and the fetch error text.
  if (!code) return /fetch failed|network|ECONNRESET|ETIMEDOUT|ENOTFOUND|EAI_AGAIN|socket|timeout|aborted|502|503|504/i.test(String(error.message ?? ""));
  return false;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Run a Supabase write and retry it on a passing failure. `fn` must build a
 * fresh query each time (a query builder runs once). A thrown error counts as
 * a network failure. Returns the last result; never throws.
 */
export async function withRetry<T extends { error: DbError }>(fn: () => PromiseLike<T>, delaysMs: readonly number[] = [200, 800]): Promise<T> {
  let last: T | null = null;
  for (let i = 0; i <= delaysMs.length; i++) {
    try {
      last = await fn();
      if (!last.error || !isTransient(last.error)) return last;
    } catch (e) {
      last = { error: { message: e instanceof Error ? e.message : String(e) } } as T;
    }
    if (i < delaysMs.length) await sleep(delaysMs[i]);
  }
  return last as T;
}
