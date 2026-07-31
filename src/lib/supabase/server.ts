import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase client for Server Components, Server Actions, and Route Handlers.
 * Must be created fresh per request (it closes over the request's cookies),
 * so call this at the top of each Server Component / action — never module-level.
 */
export async function createClient() {
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
    },
  );
}

/**
 * Admin client using the service role key — bypasses RLS entirely.
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
    },
  );
}
