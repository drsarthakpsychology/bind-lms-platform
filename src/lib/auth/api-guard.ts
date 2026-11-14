import "server-only";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getSession, type Profile } from "./session";
import { readFlags } from "@/lib/flags";
import { loadMyBlocks } from "@/lib/access/blocks";
import { decideApiAccess, gatesNeedFlags, isCrossSiteRequest, type ApiDecision, type ApiGate } from "./api-gate";

export type { ApiGate } from "./api-gate";

export type ApiGuardResult = { ok: true; profile: Profile } | { ok: false; response: NextResponse };

const MESSAGE: Record<Exclude<ApiDecision, { ok: true }>["reason"], string> = {
  unauthenticated: "unauthorized",
  account_blocked: "Your account is paused.",
  scope: "This isn't part of your access.",
  access_block: "This section is switched off for your account.",
  feature_locked: "This isn't live yet.",
  feature_off: "This isn't available.",
};

function deny(d: Exclude<ApiDecision, { ok: true }>): NextResponse {
  // 401 keeps the body every route already returned for a missing session.
  if (d.status === 401) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ error: MESSAGE[d.reason], reason: d.reason }, { status: 403 });
}

async function evaluate(profile: Profile, gates: readonly ApiGate[]): Promise<ApiDecision> {
  const needsDetail = profile.role !== "admin" && gates.length > 0;
  const [blocks, flags] = await Promise.all([
    // Blocks are per-student (People → Access), loaded the same way the
    // dashboard layout loads them: students only.
    needsDetail && profile.role === "student" ? loadMyBlocks(profile.id) : Promise.resolve([] as string[]),
    needsDetail && gatesNeedFlags(gates) ? readFlags() : Promise.resolve({}),
  ]);
  return decideApiAccess({ session: "ok", profile, gates, blocks, flags });
}

/**
 * Gate for student-facing API routes. Returns the caller's profile, or a
 * ready NextResponse: 401 when not signed in (or expired / signed in
 * elsewhere), 403 when the account is blocked, when a lectures-only account
 * calls a non-lecture feature, when the admin switched the section off for
 * this student, or when the feature flag isn't "unlocked".
 *
 * Pass one gate, or several when one endpoint serves more than one tool
 * (allowed if any passes). Pass none to check only sign-in and block status.
 *
 *   const gate = await requireStudentApi({ flag: "mse", path: "/practice/mse" });
 *   if (!gate.ok) return gate.response;
 *   const profile = gate.profile;
 */
export async function requireStudentApi(gates: ApiGate | readonly ApiGate[] = []): Promise<ApiGuardResult> {
  const list = Array.isArray(gates) ? (gates as readonly ApiGate[]) : [gates as ApiGate];
  try {
    if (isCrossSiteRequest((await headers()).get("sec-fetch-site"))) {
      return { ok: false, response: NextResponse.json({ error: "Forbidden origin." }, { status: 403 }) };
    }
  } catch {
    // No request scope (tests, scripts): nothing to check.
  }
  const session = await getSession();
  if (session.status !== "ok") {
    const d = decideApiAccess({
      session: session.status,
      profile: session.status === "blocked" ? session.profile : null,
      gates: list,
      blocks: [],
      flags: {},
    });
    return { ok: false, response: deny(d.ok ? { ok: false, status: 401, reason: "unauthenticated" } : d) };
  }
  const d = await evaluate(session.profile, list);
  return d.ok ? { ok: true, profile: session.profile } : { ok: false, response: deny(d) };
}

/**
 * A second, narrower check for a profile already admitted by
 * `requireStudentApi`, for routes whose feature is only known after parsing
 * the body. Returns a 403 response, or null when allowed.
 */
export async function denyUnlessGate(profile: Profile, gates: ApiGate | readonly ApiGate[]): Promise<NextResponse | null> {
  const list = Array.isArray(gates) ? (gates as readonly ApiGate[]) : [gates as ApiGate];
  const d = await evaluate(profile, list);
  return d.ok ? null : deny(d);
}
