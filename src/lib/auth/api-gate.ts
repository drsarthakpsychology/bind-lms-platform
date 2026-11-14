/**
 * The pure decision behind `requireStudentApi` (api-guard.ts): may this caller
 * use a student-facing API route? Kept free of `server-only`, the session and
 * the database so it stays unit-testable.
 *
 * Route handlers are independently invokable endpoints. The (dashboard) layout
 * applies scope, access blocks and feature flags to PAGES only, so without this
 * a lectures-only or blocked student, or anyone calling a tool the admin
 * switched off, could still hit the paid-AI endpoints directly.
 */
import type { FeatureKey, FlagStatus } from "@/lib/flags";
import { blockedBy } from "@/lib/access/features";
import { isBlocked, isLecturesOnly, lectureOnlyAllowed } from "./scope";

/**
 * One way a route may be used: the student page that serves it (`path`, used
 * for the lectures-only allow-list and the per-student access blocks) and,
 * optionally, the feature flag that must be "unlocked".
 */
export type ApiGate = { path: string; flag?: FeatureKey };

export type SessionStatus = "ok" | "blocked" | "unauthenticated" | "expired" | "session_replaced";

export type GateProfile = {
  role: "admin" | "view_admin" | "student" | "alumni";
  scope: "full" | "lectures_only";
  status: "active" | "blocked";
};

export type DenyReason = "unauthenticated" | "account_blocked" | "scope" | "access_block" | "feature_locked" | "feature_off";

export type ApiDecision = { ok: true } | { ok: false; status: 401 | 403; reason: DenyReason };

/** Why a single gate fails for this (non-admin) profile, or null if it passes. */
export function gateFailure(
  profile: GateProfile,
  gate: ApiGate,
  blocks: readonly string[],
  flags: Readonly<Record<string, FlagStatus | undefined>>,
): Exclude<DenyReason, "unauthenticated" | "account_blocked"> | null {
  if (isLecturesOnly(profile) && !lectureOnlyAllowed(gate.path)) return "scope";
  if (blockedBy(gate.path, blocks)) return "access_block";
  if (gate.flag) {
    const s = flags[gate.flag];
    if (s === "live") return "feature_locked";
    if (s !== "unlocked") return "feature_off"; // "off" or missing, as requireFeature treats it
  }
  return null;
}

/**
 * The decision. With several gates the route is allowed when ANY gate passes
 * (a shared endpoint such as speech-to-text serves more than one tool); the
 * reported reason is the first gate's.
 *
 * Admins bypass scope, blocks and flags, as the dashboard layout does for
 * scope and blocks: they preview, author and review across every tool.
 */
export function decideApiAccess(input: {
  session: SessionStatus;
  profile: GateProfile | null;
  gates: readonly ApiGate[];
  blocks: readonly string[];
  flags: Readonly<Record<string, FlagStatus | undefined>>;
}): ApiDecision {
  const { session, profile, gates, blocks, flags } = input;
  if (session === "blocked" || (profile && isBlocked(profile))) {
    return { ok: false, status: 403, reason: "account_blocked" };
  }
  if (session !== "ok" || !profile) return { ok: false, status: 401, reason: "unauthenticated" };
  if (profile.role === "admin" || gates.length === 0) return { ok: true };

  let first: DenyReason | null = null;
  for (const gate of gates) {
    const why = gateFailure(profile, gate, blocks, flags);
    if (!why) return { ok: true };
    first ??= why;
  }
  return { ok: false, status: 403, reason: first ?? "feature_off" };
}

/** Whether evaluating these gates needs the flag table at all. */
export const gatesNeedFlags = (gates: readonly ApiGate[]) => gates.some((g) => g.flag);

/**
 * Cross-site request guard for route handlers (defence in depth on top of
 * SameSite=Lax cookies). Browsers send Sec-Fetch-Site on every request; a
 * request another site's page made is "cross-site" and is refused. Same
 * origin, same site, a typed URL ("none") and non-browser clients (no header,
 * and no victim cookies either) pass.
 */
export function isCrossSiteRequest(secFetchSite: string | null | undefined): boolean {
  return (secFetchSite ?? "").trim().toLowerCase() === "cross-site";
}
