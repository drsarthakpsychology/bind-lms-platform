import { AsyncLocalStorage } from "node:async_hooks";
import type { Profile, SessionResult } from "@/lib/auth/session";

/**
 * The app's request scope.
 *
 * The mobile app signs in with a bearer token, not the website's cookies. So
 * that every existing server function (pingProgress, saveLearnState, askDoubt,
 * loadCourseOverview and the rest) runs unchanged for an app request, the app
 * route wrapper (route.ts) puts the verified caller here, and the two
 * functions everything else is built on look here first:
 *
 *   createClient()  (src/lib/supabase/server.ts)  answers a client that acts
 *                   as this user (row level security applies as on the web);
 *   getSession()    (src/lib/auth/session.ts)     answers this session.
 *
 * Outside an app request the store is empty and both behave exactly as before.
 */
export type AppRequestContext = {
  accessToken: string;
  /** The verified Supabase auth user (what supabase.auth.getUser() answers). */
  user: { id: string; email?: string | null } & Record<string, unknown>;
  session: Extract<SessionResult, { status: "ok" }>;
  profile: Profile;
  deviceId: string | null;
  /** The user-bound Supabase client, made once per request. */
  client?: unknown;
  /** This student's switched-off sections, read once per request (loadMyBlocks). */
  blocks?: Promise<string[]>;
  /** Shared reads made once per request (requestMemo). */
  memo?: Map<string, Promise<unknown>>;
};

const store = new AsyncLocalStorage<AppRequestContext>();

export function appContext(): AppRequestContext | null {
  return store.getStore() ?? null;
}

export function runInAppContext<T>(ctx: AppRequestContext, fn: () => T): T {
  return store.run(ctx, fn);
}

/**
 * One answer per app request for a shared read (the roster, the activity
 * tables, the hidden accounts), the way React's cache() dedupes them while a
 * website page renders. Route handlers have no React cache scope, so without
 * this a screen that asks twice reads twice. Outside an app request: no memo.
 */
export function requestMemo<T>(key: string, load: () => Promise<T>): Promise<T> {
  const app = store.getStore();
  if (!app) return load();
  app.memo ??= new Map();
  let hit = app.memo.get(key) as Promise<T> | undefined;
  if (!hit) {
    hit = load();
    app.memo.set(key, hit);
    // A failed read is not kept: the next caller in the request tries again.
    hit.catch(() => app.memo?.delete(key));
  }
  return hit;
}
