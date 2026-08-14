import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";

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
