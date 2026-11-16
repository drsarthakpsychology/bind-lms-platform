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
};

const store = new AsyncLocalStorage<AppRequestContext>();

export function appContext(): AppRequestContext | null {
  return store.getStore() ?? null;
}

export function runInAppContext<T>(ctx: AppRequestContext, fn: () => T): T {
  return store.run(ctx, fn);
}
