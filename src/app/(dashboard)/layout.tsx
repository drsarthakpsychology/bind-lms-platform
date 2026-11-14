import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { lectureOnlyAllowed } from "@/lib/auth/guards";

// The LMS (student coursework, journals, simulated-patient content) must
// never be indexed. The public site (/, /waitlist) is indexable from the root.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};
import { AppShell } from "@/components/app-shell";
import { readFlags } from "@/lib/flags";
import { ViewModeToggle } from "./view-mode-toggle";
import { DetailsGate } from "@/components/profile/details-gate";
import { VisitTracker } from "@/components/analytics/visit-tracker";
import { SaveStatus } from "@/components/save/save-status";
import { ownerTag } from "@/lib/save/owner";
import { loadMyBlocks } from "@/lib/access/blocks";
import { blockedBy } from "@/lib/access/features";
import { createClient } from "@/lib/supabase/server";
import { VIEW_MODE_COOKIE } from "./view-mode-constants";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (session.status === "expired") {
    redirect("/expired");
  }

  if (session.status === "unauthenticated" || session.status === "session_replaced") {
    redirect("/login");
  }

  // Blocked is an unconditional override: the account is cut off on every
  // request regardless of credential/session validity. Redirect to a plain,
  // non-alarming "paused" screen (no specific reason shown to the student).
  if (session.status === "blocked") {
    redirect("/paused");
  }

  // Lecture-only scope: the account may reach only the lecture list + player.
  // Enforced here, server-side, for every route under (dashboard): a direct
  // URL hit to /practice, /reflect, /wall, /tools, etc. redirects to the
  // lecture list rather than rendering (or merely hiding a nav link).
  //
  // ADMINS BYPASS THIS ENTIRELY. `scope` is a STUDENT access axis; an admin
  // whose profile accidentally carries scope=lectures_only (e.g. a test-email
  // account) must still reach /admin. Without this carve-out such an account
  // hits an infinite redirect loop: /dashboard bounces admins → /admin, and
  // this guard bounces /admin → /dashboard: the "continuously refreshing
  // dashboard" bug.
  if (
    session.status === "ok" &&
    session.profile.role !== "admin" &&
    session.profile.role !== "view_admin" &&
    session.profile.scope === "lectures_only"
  ) {
    const pathname = (await headers()).get("x-pathname") ?? "";
    if (!lectureOnlyAllowed(pathname)) {
      redirect("/dashboard");
    }
  }

  // Sections the admin switched off for this student (People → Access):
  // hidden from the menu, and their pages send the student home.
  const blocked = session.status === "ok" && session.profile.role === "student" ? await loadMyBlocks(session.profile.id) : [];
  if (blocked.length) {
    const pathname = (await headers()).get("x-pathname") ?? "";
    if (blockedBy(pathname, blocked)) redirect("/dashboard?off=1");
  }

  const cookieStore = await cookies();
  const viewingAsStudent = cookieStore.get(VIEW_MODE_COOKIE)?.value === "student";

  const role = session.profile.role;
  // Admin viewing the student side is in "student" mode; everyone else is in
  // their natural mode. `mode` only controls navigation layout, not access.
  // Alumni (A10) render the student shell with read-only access to their record.
  const mode = (role === "admin" || role === "view_admin") && !viewingAsStudent ? "admin" : "student";
  const shellRole = role === "alumni" ? "student" : role === "view_admin" ? "admin" : role;

  // The roster is now `full` (2026_11_all_full_access set every student to
  // full), so an admin previewing the student side sees the full-student nav
  //, matching what the students actually see, not a lectures-only nav.
  const effectiveScope =
    role === "admin" && viewingAsStudent ? "full" : session.profile.scope;

  // First-login details: a student who hasn't filled, checked and submitted
  // their details sees the form over every page until they do (once only).
  // If the table isn't there yet (database file not run), nobody is asked.
  let gate: React.ReactNode = null;
  if (role === "student") {
    const supabase = await createClient();
    const { data: details, error } = await supabase
      .from("student_details")
      .select("full_name, phone, city, state, country, qualification, institution, occupation, confirmed_at")
      .eq("user_id", session.profile.id)
      .maybeSingle();
    // "No row yet" is not an error; a missing table is (then nobody is asked).
    const tableMissing = Boolean(error) && error?.code !== "PGRST116";
    if (!tableMissing && !details?.confirmed_at) {
      const { data: me } = await supabase.from("profiles").select("name").eq("id", session.profile.id).maybeSingle();
      gate = (
        <DetailsGate
          initial={{
            full_name: details?.full_name ?? (me?.name as string | null) ?? "",
            phone: details?.phone ?? session.profile.mobile_number ?? "",
            city: details?.city ?? "",
            state: details?.state ?? "",
            country: details?.country ?? "India",
            qualification: details?.qualification ?? "",
            institution: details?.institution ?? "",
            occupation: details?.occupation ?? "",
          }}
        />
      );
    }
  }

  // Bell count: unread notifications (messages, nudges, achievements).
  let unread = 0;
  if (role === "student" || role === "alumni") {
    const supabase = await createClient();
    const { count } = await supabase.from("notifications").select("id", { count: "exact", head: true }).eq("user_id", session.profile.id).is("read_at", null);
    unread = count ?? 0;
  }

  const flags = await readFlags();
  return (
    <AppShell
      unread={unread}
      flags={flags}
      role={shellRole}
      mode={mode}
      scope={effectiveScope}
      email={session.profile.email}
      showStudy={flags.learn === "unlocked"}
      blocked={blocked}
      viewModeSwitch={
        role === "admin" || role === "view_admin" ? (
          <ViewModeToggle currentMode={viewingAsStudent ? "student" : "admin"} />
        ) : undefined
      }
    >
      {gate}
      {role === "student" ? <VisitTracker /> : null}
      {/* Sends queued work to the server and says so when a save keeps failing. */}
      <SaveStatus owner={ownerTag(session.profile.id)} />
      {children}
    </AppShell>
  );
}
