"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireSession, isAdminLike } from "@/lib/auth/guards";
import { SESSION_COOKIE } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { rateLimitWrite } from "@/lib/rate-limit";
import { currentTestScope, resetTestData, setTestMode, testStudentBrowserToken, testStudentTokenHash } from "@/lib/test-mode/server";
import { VIEW_MODE_COOKIE } from "./view-mode-constants";
import { RETURN_COOKIE } from "./test-mode-constants";

/**
 * Test mode on the website. The admin's own sign-in is kept in a private
 * cookie while they use the test student, so "Back to admin" needs no
 * password and the server never makes an admin sign-in: it only hands back
 * the one this browser already had.
 */

type R = { error: string | null };

const cookieOpts = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge: 60 * 60 * 8 };

type Ticket = { a: string; r: string; s: string | null; t: string };

function readTicket(raw: string | undefined): Ticket | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(Buffer.from(raw, "base64url").toString("utf8")) as Partial<Ticket>;
    return typeof v.a === "string" && typeof v.r === "string" && typeof v.t === "string" ? { a: v.a, r: v.r, s: typeof v.s === "string" ? v.s : null, t: v.t } : null;
  } catch {
    return null;
  }
}

async function admin() {
  const me = await requireSession();
  return me && isAdminLike(me) ? me : null;
}

/** Switch test mode on or off (any admin; it changes only their own sandbox). */
export async function setTestModeAction(on: boolean): Promise<R> {
  const me = await admin();
  if (!me) return { error: "Only admins can use test mode." };
  if (!(await rateLimitWrite(`web:test-mode:${me.id}`, 20))) return { error: "Slow down a moment and try again." };
  const r = await setTestMode(me, on);
  revalidatePath("/", "layout");
  return { error: r.ok || !on ? null : r.error };
}

/** Reset test data: the test student's progress and every row made in test mode. */
export async function resetTestDataAction(): Promise<R & { cleared?: number }> {
  const me = await admin();
  if (!me) return { error: "Only admins can use test mode." };
  if (!(await rateLimitWrite(`web:test-mode-reset:${me.id}`, 6))) return { error: "Slow down a moment and try again." };
  const r = await resetTestData(me);
  revalidatePath("/", "layout");
  return r.ok ? { error: null, cleared: r.cleared } : { error: r.error };
}

/** Open the student side as this admin's test student (test mode must be on). */
export async function openAsTestStudent(): Promise<R> {
  const me = await admin();
  if (!me) return { error: "Only admins can use test mode." };
  if (!(await rateLimitWrite(`web:test-mode-open:${me.id}`, 20))) return { error: "Slow down a moment and try again." };
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.refresh_token) return { error: "Please sign in again." };
  const t = await testStudentTokenHash(me);
  if (!t.ok) return { error: t.error };
  const store = await cookies();
  const ticket: Ticket = { a: me.id, r: session.refresh_token, s: store.get(SESSION_COOKIE)?.value ?? null, t: t.testUserId };
  const { data, error } = await supabase.auth.verifyOtp({ type: "magiclink", token_hash: t.tokenHash });
  if (error || data.user?.id !== t.testUserId) return { error: "Could not open the test student. Try again." };
  store.set(RETURN_COOKIE, Buffer.from(JSON.stringify(ticket), "utf8").toString("base64url"), cookieOpts);
  store.set(SESSION_COOKIE, await testStudentBrowserToken(t.testUserId), cookieOpts);
  store.delete(VIEW_MODE_COOKIE);
  redirect("/dashboard");
}

/**
 * Back to the admin account kept in the return cookie. `turnOff` also
 * switches test mode off. With no usable return cookie the browser is signed
 * out (the admin signs in again).
 */
export async function backToAdmin(turnOff = false): Promise<void> {
  const store = await cookies();
  const ticket = readTicket(store.get(RETURN_COOKIE)?.value);
  const scope = await currentTestScope();
  const supabase = await createClient();
  // Only from the test student this ticket was made for.
  const valid = ticket && scope?.as === "student" && scope.testUserId === ticket.t && scope.adminId === ticket.a;
  await supabase.auth.signOut({ scope: "local" }).catch(() => undefined);
  store.delete(RETURN_COOKIE);
  if (!valid || !ticket) {
    store.delete(SESSION_COOKIE);
    redirect("/login");
  }
  const { data, error } = await supabase.auth.refreshSession({ refresh_token: ticket.r });
  if (error || data.user?.id !== ticket.a) {
    await supabase.auth.signOut({ scope: "local" }).catch(() => undefined);
    store.delete(SESSION_COOKIE);
    redirect("/login");
  }
  if (ticket.s) store.set(SESSION_COOKIE, ticket.s, cookieOpts);
  if (turnOff) await setTestMode({ id: ticket.a, role: "admin" }, false).catch(() => undefined);
  redirect("/admin");
}
