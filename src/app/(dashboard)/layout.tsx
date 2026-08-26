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
import { ViewModeToggle } from "./view-mode-toggle";
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
  if (session.status === "ok" && session.profile.scope === "lectures_only") {
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

  return (
    <AppShell
      role={shellRole}
      mode={mode}
      scope={session.profile.scope}
      viewModeSwitch={
        role === "admin" ? (
          <ViewModeToggle currentMode={viewingAsStudent ? "student" : "admin"} />
        ) : undefined
      }
    >
      {children}
    </AppShell>
  );
}
