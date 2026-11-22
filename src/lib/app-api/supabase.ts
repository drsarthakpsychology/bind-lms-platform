import "server-only";
import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";
import { DB_TIMEOUT_MS, fetchWithTimeout } from "@/lib/supabase/timeout-fetch";

/**
 * Supabase Auth for the app's sign-in routes: the anon key, no cookies and
 * nothing kept between requests. Used only to exchange a password or a
 * refresh token for tokens, and to verify an access token.
 */
export function createStatelessAuthClient(): SupabaseClient {
  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: fetchWithTimeout(DB_TIMEOUT_MS) },
  });
}
