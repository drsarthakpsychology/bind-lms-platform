import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { lectureOnlyAllowed } from "@/lib/auth/guards";

// The LMS — student coursework, journals, simulated-patient content — must
// never be indexed. The public site (/, /waitlist) is indexable from the root.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};
import { AppShell } from "@/components/app-shell";
import { readFlags } from "@/lib/flags";
import { ViewModeToggle } from "./view-mode-toggle";
import { DetailsGate } from "@/components/profile/details-gate";
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

  // Blocked is an unconditional override — the account is cut off on every
  // request regardless of credential/session validity. Redirect to a plain,
  // non-alarming "paused" screen (no specific reason shown to the student).
  if (session.status === "blocked") {
    redirect("/paused");
  }

  // Lecture-only scope: the account may reach only the lecture list + player.
  // Enforced here, server-side, for every route under (dashboard) — a direct
  // URL hit to /practice, /reflect, /wall, /tools, etc. redirects to the
  // lecture list rather than rendering (or merely hiding a nav link).
  //
  // ADMINS BYPASS THIS ENTIRELY. `scope` is a STUDENT access axis; an admin
  // whose profile accidentally carries scope=lectures_only (e.g. a test-email
  // account) must still reach /admin. Without this carve-out such an account
  // hits an infinite redirect loop: /dashboard bounces admins → /admin, and
  // this guard bounces /admin → /dashboard — the "continuously refreshing
  // dashboard" bug.
  if (
    session.status === "ok" &&
    session.profile.role !== "admin" &&
    session.profile.scope === "lectures_only"
  ) {
    const pathname = (await headers()).get("x-pathname") ?? "";
    if (!lectureOnlyAllowed(pathname)) {
      redirect("/dashboard");
    }
  }

  const cookieStore = await cookies();
  const viewingAsStudent = cookieStore.get(VIEW_MODE_COOKIE)?.value === "student";

  const role = session.profile.role;
  // Admin viewing the student side is in "student" mode; everyone else is in
  // their natural mode. `mode` only controls navigation layout, not access.
  // Alumni (A10) render the student shell with read-only access to their record.
  const mode = role === "admin" && !viewingAsStudent ? "admin" : "student";
  const shellRole = role === "alumni" ? "student" : role;

  // The go-live roster is lectures_only, so an admin previewing the student
  // side gets the same lectures-only nav the roster sees — not the full-student
  // nav their own `full` scope would otherwise produce.
  const effectiveScope =
    role === "admin" && viewingAsStudent ? "lectures_only" : session.profile.scope;

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

  return (
    <AppShell
      role={shellRole}
      mode={mode}
      scope={effectiveScope}
      email={session.profile.email}
      showStudy={(await readFlags()).learn === "unlocked"}
      viewModeSwitch={
        role === "admin" ? (
          <ViewModeToggle currentMode={viewingAsStudent ? "student" : "admin"} />
        ) : undefined
      }
    >
      {gate}
      {children}
    </AppShell>
  );
}
