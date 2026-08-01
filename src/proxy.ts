import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Next.js 16 renamed `middleware.ts` to `proxy.ts` and narrowed its job to a
 * "thin proxy": cheap, optimistic checks only — no heavy DB-backed
 * authorization here. That's a real change from how the blueprint's Part
 * 3.2/3.3 describes this layer ("middleware checks expires_at and
 * active_session_token on every request").
 *
 * So the split going into Phase 2 is:
 *   - HERE (proxy.ts): refresh the Supabase auth session on every request,
 *     and bounce anyone with no session at all away from protected routes.
 *   - Phase 2, in a shared server-side check called from the protected
 *     route groups' layout.tsx (e.g. src/app/(admin)/layout.tsx and
 *     src/app/(student)/layout.tsx): the actual expires_at comparison and
 *     active_session_token match against `profiles`, since those need a
 *     real database read and should be authoritative, not "optimistic."
 *
 * Doing the DB-backed checks here instead would reintroduce exactly the
 * "logout loop" class of bug the Next.js 16.1 proxy model was designed to
 * avoid (stale cookies never getting the refreshed Set-Cookie header).
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase isn't configured yet, pass the request through untouched
  // rather than throwing. Without this, a deploy that's missing its
  // environment variables 500s on every single route, including the
  // pages that don't need auth at all.
  if (!supabaseUrl || !supabaseKey) {
    return response;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refreshes the auth token if it's expired. Required — Server Components
  // can't write cookies themselves, so this is the only place a stale
  // session gets renewed before it reaches a page.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtectedPath =
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/admin") ||
    request.nextUrl.pathname.startsWith("/courses");

  if (!user && isProtectedPath) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Run on everything except static assets and image optimization files,
     * so we're not paying the session-refresh cost on every font/image request.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
