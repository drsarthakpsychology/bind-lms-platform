import "server-only";
import { redirect } from "next/navigation";
import type { SessionResult } from "./session";

/**
 * Where a page sends someone whose session is no longer good. The dashboard
 * layout does this on a full page load, but a layout is not drawn again when
 * the student moves between pages inside the app: there the page itself must
 * send them on, or they get an empty screen (signed in elsewhere, access
 * ended, or paused while the app was open).
 */
export function leaveWithoutSession(session: Exclude<SessionResult, { status: "ok" }>): never {
  if (session.status === "expired") redirect("/expired");
  if (session.status === "blocked") redirect("/paused");
  if (session.status === "session_replaced") redirect("/login?why=elsewhere");
  redirect("/login");
}
