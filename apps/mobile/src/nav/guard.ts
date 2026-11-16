import type { Me } from "@/api/contract";
import type { Notice, Phase } from "@/auth/session";
import { groupFor, homeHref } from "./targets";

/** Screens a visitor may see without signing in. */
export const PUBLIC = new Set(["(visitor)", "setup", "verify", "forgot-password"]);
/** Screens only admins open. */
export const ADMIN_ONLY = new Set(["(admin)", "student", "compose"]);

/**
 * Where the root guard sends this account from the screen it is on (the
 * first part of the address), or null to stay. Keeps visitors out of the app
 * and every account inside its own tabs.
 */
export function guardTarget(s: { phase: Phase; top: string | undefined; me: Me | null; notice: Notice; viewingAsStudent: boolean }): string | null {
  const { phase, top, me, notice } = s;
  if (top === undefined || phase === "loading") return null;
  if (phase === "visitor") {
    if (PUBLIC.has(top)) return null;
    // Signed out for a reason (forgot PIN, five wrong PINs, account ended): straight to Sign in,
    // where that reason is written. ("Opened on another device" has its own screen.)
    return notice && notice !== "device_replaced" ? "/sign-in" : "/welcome";
  }
  if (top === "(visitor)") return phase === "ready" ? homeHref(me) : null;
  const group = groupFor(me);
  const viewing = s.viewingAsStudent && group === "(admin)";
  const tabGroup = top === "(student)" || top === "(lecture)" || top === "(admin)";
  if (tabGroup && top !== group && !(viewing && top === "(student)")) return homeHref(me);
  if (ADMIN_ONLY.has(top) && group !== "(admin)") return homeHref(me);
  return null;
}
