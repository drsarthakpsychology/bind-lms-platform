/**
 * A fetch with a time limit, for every Supabase client on the server.
 *
 * Without it a database call that never answers keeps the request open until
 * the platform kills it at 300 seconds (the live "Task timed out" on
 * /dashboard and /api/visit). With it the call fails after `ms` and the page
 * shows its normal error or empty state.
 *
 * A signal the caller already passed (supabase-js `abortSignal`) still works:
 * whichever fires first wins.
 */

/** Signed-in and anon clients: a page should never wait longer than this. */
export const DB_TIMEOUT_MS = 8_000;
/** The service client also runs long admin jobs (certificates, bulk email). */
export const DB_ADMIN_TIMEOUT_MS = 15_000;
/** The video store (R2): connect and per-request idle limits. */
export const R2_CONNECT_TIMEOUT_MS = 5_000;
export const R2_REQUEST_TIMEOUT_MS = 15_000;

export function fetchWithTimeout(ms: number, base: typeof fetch = (...a) => fetch(...a)): typeof fetch {
  return (input, init) => {
    const limit = AbortSignal.timeout(ms);
    const signal = init?.signal ? anySignal([init.signal, limit]) : limit;
    return base(input, { ...init, signal });
  };
}

function anySignal(signals: AbortSignal[]): AbortSignal {
  const any = (AbortSignal as unknown as { any?: (s: AbortSignal[]) => AbortSignal }).any;
  if (any) return any(signals);
  const ctrl = new AbortController();
  for (const s of signals) {
    if (s.aborted) {
      ctrl.abort(s.reason);
      break;
    }
    s.addEventListener("abort", () => ctrl.abort(s.reason), { once: true });
  }
  return ctrl.signal;
}
