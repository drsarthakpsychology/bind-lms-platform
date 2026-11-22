import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { DB_TIMEOUT_MS, fetchWithTimeout } from "@/lib/supabase/timeout-fetch";
import { decideHost } from "@/lib/seo/canonical-host";

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
/**
 * Markdown for agents: when a client requests a public page with
 * `Accept: text/markdown`, serve a clean markdown representation instead of
 * HTML. Content negotiation so agents get structured text; browsers keep the
 * normal page. Narrowly scoped to the landing page (the public front door).
 */
const MARKDOWN_ACCEPTED = /text\/markdown|application\/markdown/;
const LANDING_MARKDOWN = `# VIBHA School of Psychology

A practical clinical psychology training programme and supervised
internship in Ahmedabad and online.

## The school

Students interview real patients in person under a psychiatrist's
supervision, write case sheets and treatment plans, and join live online
discussions on weekends. Tracks run from a few weeks to three months or more.
Anyone can join; no psychology degree is needed. In-person sessions are open
to every student. Fees are not refundable.

This is skills training by a private provider. It is not an RCI-recognised
qualification, a degree, or a licence to practise as a clinical psychologist.

## Programme

- Interviewing
- Mental status exam
- Formulation
- Ethics & the law
- Simulated patients
- Timed assessments
- Debrief after every session

## How to interact

- Read this page as HTML (default) or markdown (Accept: text/markdown header).
- Service health: GET /api/health
- API catalog: GET /.well-known/api-catalog (RFC 9727)
- OpenAPI: GET /openapi.json
- Waitlist (for human applicants): POST to /waitlist

## Links

- Waitlist: /waitlist
- Login: /login
- Auth.md (agent registration): /auth.md
`;

export async function proxy(request: NextRequest) {
  // One public address: other hosts that serve this site (the old Vercel
  // address, www) redirect to https://vibhapsychology.com; previews and the
  // API on those hosts are never indexed.
  const host = decideHost({
    host: request.headers.get("x-forwarded-host") ?? request.headers.get("host"),
    pathname: request.nextUrl.pathname,
    search: request.nextUrl.search,
    method: request.method,
  });
  if (host.action === "redirect") return NextResponse.redirect(host.location, 308);
  const response = await route(request);
  if (host.action !== "none") response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

async function route(request: NextRequest): Promise<NextResponse> {
  const accept = request.headers.get("accept") ?? "";
  const pathname = request.nextUrl.pathname;
  // Expose the pathname to Server Components (via headers()) so the dashboard
  // layout can enforce the lecture-only scope server-side without a DB read in
  // the proxy (which stays thin per its own contract).
  request.headers.set("x-pathname", pathname);
  // Content negotiation for agents — only on the public landing page.
  if (pathname === "/" && MARKDOWN_ACCEPTED.test(accept)) {
    return new NextResponse(LANDING_MARKDOWN, {
      headers: { "Content-Type": "text/markdown; charset=utf-8" },
    });
  }

  // The mobile app's API (bearer token, no cookies): nothing to refresh here,
  // its routes check the token themselves (src/lib/app-api/guard.ts).
  if (pathname.startsWith("/api/app/")) return NextResponse.next({ request });

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
      global: { fetch: fetchWithTimeout(DB_TIMEOUT_MS) },
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
