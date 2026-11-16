import { api, beforeSignOut, session } from "@/auth";
import { queryClient, retryDelay, shouldRetryWrite } from "./queries";

/**
 * Writes that must arrive even on a weak or missing connection: a finished
 * practise attempt, a half-done case, a bookmark or note, a reaction on the
 * class wall, "mark all read". Each is a React Query mutation with the key
 * ["write"]:
 *  - it goes out at once when the phone is online;
 *  - while the phone is offline it waits (paused) and is sent by itself when
 *    the internet is back;
 *  - a write still waiting is kept on the phone with the cache, so it is sent
 *    after the app was closed too (resumeWrites, once the account is open);
 *  - a failed try is repeated with a growing wait (shouldRetryWrite).
 * Writes with the same `scope` go one after another, in order (a reaction
 * switched on and off again ends the way the student left it).
 *
 * Watch progress, finished lectures, study progress and answer history use
 * the save outbox instead (src/api/outbox.ts): it batches them into one call.
 */
export type QueuedWrite = { method: "POST" | "PUT" | "DELETE"; path: string; body?: unknown; scope?: string };

export const WRITE_KEY = ["write"] as const;

function send(w: QueuedWrite): Promise<unknown> {
  if (w.method === "PUT") return api.put(w.path, w.body);
  if (w.method === "DELETE") return api.del(w.path);
  return api.post(w.path, w.body);
}

queryClient.setMutationDefaults(WRITE_KEY, {
  mutationFn: (w: QueuedWrite) => send(w),
  networkMode: "online",
  retry: shouldRetryWrite,
  retryDelay,
  // A write waiting for the internet stays for a week, like the cache it is saved with.
  gcTime: 7 * 24 * 60 * 60 * 1000,
});

/**
 * Send now, or as soon as the internet allows. The promise settles when the
 * server has answered; it rejects only when the server refused the write (so
 * a screen can undo what it showed). Most callers do not wait for it.
 */
export function queueWrite(w: QueuedWrite): Promise<unknown> {
  const m = queryClient.getMutationCache().build(queryClient, { mutationKey: WRITE_KEY, scope: w.scope ? { id: w.scope } : undefined });
  return m.execute(w);
}

/** How many queued writes are still waiting. */
export function waitingWrites(): number {
  return queryClient
    .getMutationCache()
    .getAll()
    .filter((m) => m.options.mutationKey?.[0] === "write" && (m.state.isPaused || m.state.status === "pending")).length;
}

/** Send the writes kept from before (a restart, or the internet coming back). Only for an open account. */
export function resumeWrites(): Promise<unknown> {
  if (!session.hasTokens()) return Promise.resolve();
  return queryClient.resumePausedMutations().catch(() => undefined);
}

// A chosen sign-out sends what is waiting first, while the sign-in still works (never waits long).
beforeSignOut(() => Promise.race([resumeWrites(), new Promise((r) => setTimeout(r, 3000))]).then(() => undefined));
