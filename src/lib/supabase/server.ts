import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { appContext, type AppRequestContext } from "@/lib/app-api/context";
import { DB_ADMIN_TIMEOUT_MS, DB_TIMEOUT_MS, fetchWithTimeout } from "./timeout-fetch";

/**
 * Supabase client for Server Components, Server Actions, and Route Handlers.
 * Must be created fresh per request (it closes over the request's cookies),
 * so call this at the top of each Server Component / action, never module-level.
 */
export async function createClient() {
  // A request from the mobile app (bearer token, no cookies): act as that
  // user. Everything below is the website's cookie session, unchanged.
  const app = appContext();
  if (app) return appUserClient(app);

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component that can't write cookies directly.
            // Safe to ignore as long as proxy.ts is refreshing the session
            // on every request (see src/proxy.ts).
          }
        },
      },
      global: { fetch: fetchWithTimeout(DB_TIMEOUT_MS) },
    },
  );
}

/**
 * The Supabase client for one mobile-app request: the anon key plus the
 * caller's own access token, so row level security applies exactly as it does
 * for the same student on the website. It never reads or writes cookies.
 * `auth.getUser()` answers the user the app guard already verified (there is
 * no cookie session to read), and `auth.signOut()` does nothing here: the app
 * signs out through its own route.
 */
function appUserClient(app: AppRequestContext) {
  if (app.client) return app.client as ReturnType<typeof makeAppUserClient>;
  const client = makeAppUserClient(app);
  app.client = client;
  return client;
}

function makeAppUserClient(app: AppRequestContext) {
  const client = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {
        // No cookies for app requests.
      },
    },
    global: { headers: { Authorization: `Bearer ${app.accessToken}` }, fetch: fetchWithTimeout(DB_TIMEOUT_MS) },
  });
  const auth = client.auth as unknown as { getUser: (jwt?: string) => Promise<unknown>; signOut: () => Promise<unknown> };
  const realGetUser = auth.getUser.bind(client.auth);
  auth.getUser = async (jwt?: string) => (jwt ? realGetUser(jwt) : { data: { user: app.user }, error: null });
  auth.signOut = async () => ({ error: null });
  return client;
}

/**
 * Admin client using the service role key: bypasses RLS entirely.
 * Server-only. Never import this from a Client Component, and never
 * bundle the service role key into anything that reaches the browser.
 * This is what Phase 3's "Add Student" flow will use (Supabase Admin API
 * to create auth users directly, without a public sign-up form).
 */
export function createAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {
          // No-op: the admin client never reads or writes session cookies.
        },
      },
      global: { fetch: fetchWithTimeout(DB_ADMIN_TIMEOUT_MS) },
    },
  );
}
