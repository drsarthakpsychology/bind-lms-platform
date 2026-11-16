import "server-only";
import type { NextResponse } from "next/server";
import type { z } from "zod";
import { isAdminLike, isSuperAdmin } from "@/lib/auth/guards";
import { rateLimitResult, rateLimitWrite } from "@/lib/rate-limit";
import { rateLimitFast } from "@/lib/rate-limit-fast";
import { runInAppContext } from "./context";
import { assertVersion, requireAppUser, type ApiGate, type AppUser } from "./guard";
import { ApiFail, fail, ok } from "./respond";

/**
 * The wrapper every /api/app/v1 route is written with. It gives each route
 * the same error shape, the minimum-version check, the bearer guard, and it
 * runs the handler inside the app request scope so the website's existing
 * server functions act as the signed-in app user.
 *
 *   export const GET = appRoute({ auth: "student", gates: { path: "/courses" } }, async ({ user, params }) => {
 *     return await loadSomething(user.profile, params.courseId);   // answered as { ok: true, data }
 *   });
 */

type Auth = "public" | "bearer" | "admin" | "superAdmin";

export type RouteHelpers<P> = {
  req: Request;
  params: P;
  /** The URL's query. */
  query: URLSearchParams;
  /** The caller's network address (for rate limits). */
  ip: string;
  /** Parse and check the JSON body. Answers 400 with the bad fields. */
  body: <S extends z.ZodType>(schema: S, maxBytes?: number) => Promise<z.infer<S>>;
  /** A rate limit that never drops a student's work when the counter is down (rateLimitWrite). */
  limitWrite: (key: string, perMinute: number, windowMs?: number) => Promise<void>;
  /** A strict rate limit for sign-in and public forms: falls back to this server's own counter when the shared one is down. */
  limitStrict: (key: string, perMinute: number) => Promise<void>;
  /** A cheap per-server limit for hot paths. */
  limitFast: (key: string, perMinute: number) => void;
};

type PublicHandler<P> = (h: RouteHelpers<P> & { user: null }) => Promise<unknown>;
type UserHandler<P> = (h: RouteHelpers<P> & { user: AppUser }) => Promise<unknown>;

const MAX_BODY = 256 * 1024;

function helpers<P>(req: Request, params: P): RouteHelpers<P> {
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0]?.trim() || "unknown";
  return {
    req,
    params,
    query: new URL(req.url).searchParams,
    ip,
    async body(schema, maxBytes = MAX_BODY) {
      const text = await req.text().catch(() => "");
      if (text.length > maxBytes) throw new ApiFail("too_large");
      let json: unknown;
      try {
        json = text ? JSON.parse(text) : {};
      } catch {
        throw new ApiFail("bad_request", "The request body isn't valid JSON.");
      }
      const parsed = schema.safeParse(json);
      if (!parsed.success) {
        const fields = [...new Set(parsed.error.issues.map((i) => i.path.join(".")).filter(Boolean))];
        throw new ApiFail("bad_request", undefined, fields.length ? { fields } : undefined);
      }
      return parsed.data;
    },
    async limitWrite(key, perMinute, windowMs) {
      if (!(await rateLimitWrite(key, perMinute, windowMs))) throw new ApiFail("rate_limited");
    },
    async limitStrict(key, perMinute) {
      const r = await rateLimitResult(key, perMinute);
      if (r === "limited" || (r === "unavailable" && !rateLimitFast(`fallback:${key}`, perMinute))) throw new ApiFail("rate_limited");
    },
    limitFast(key, perMinute) {
      if (!rateLimitFast(key, perMinute)) throw new ApiFail("rate_limited");
    },
  };
}

type Ctx<P> = { params: Promise<P> };

function finish(result: unknown): Response {
  return result instanceof Response ? result : ok(result);
}

function onError(e: unknown, where: string): NextResponse {
  if (e instanceof ApiFail) return e.response();
  console.error(`app api ${where} failed:`, e instanceof Error ? e.stack ?? e.message : e);
  return fail("server_error");
}

export function appRoute<P = Record<string, never>>(opts: { auth: "public" }, handler: PublicHandler<P>): (req: Request, ctx: Ctx<P>) => Promise<Response>;
export function appRoute<P = Record<string, never>>(
  opts: { auth: Exclude<Auth, "public">; gates?: ApiGate | readonly ApiGate[] },
  handler: UserHandler<P>,
): (req: Request, ctx: Ctx<P>) => Promise<Response>;
export function appRoute<P>(
  opts: { auth: Auth; gates?: ApiGate | readonly ApiGate[] },
  handler: PublicHandler<P> | UserHandler<P>,
): (req: Request, ctx: Ctx<P>) => Promise<Response> {
  return async (req, ctx) => {
    const where = `${req.method} ${new URL(req.url).pathname}`;
    try {
      const params = ((await ctx?.params) ?? {}) as P;
      const h = helpers(req, params);
      if (opts.auth === "public") {
        assertVersion(req);
        return finish(await (handler as PublicHandler<P>)({ ...h, user: null }));
      }
      const user = await requireAppUser(req, opts.gates ?? []);
      if (opts.auth === "admin" && !isAdminLike(user.profile)) throw new ApiFail("forbidden");
      if (opts.auth === "superAdmin" && !isSuperAdmin(user.profile)) throw new ApiFail("forbidden");
      return await runInAppContext(user.context, async () => finish(await (handler as UserHandler<P>)({ ...h, user })));
    } catch (e) {
      return onError(e, where);
    }
  };
}

/** The usual gates. `path` is the website page the route stands for (scope and switched-off sections key on it). */
export const GATES = {
  lectures: { path: "/courses" },
  study: { path: "/study", flag: "learn" },
  doubts: { path: "/doubts" },
  notifications: { path: "/notifications" },
  achievements: { path: "/achievements" },
  journey: { path: "/journey" },
  /** The website's /study/map: requireFeature("learn") plus its own path for blocks and scope. */
  studyMap: { path: "/study/map", flag: "learn" },
  wall: { path: "/wall" },
} as const satisfies Record<string, ApiGate>;
