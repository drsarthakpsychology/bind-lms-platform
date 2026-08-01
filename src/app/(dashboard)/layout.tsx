import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
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
  const mode = role === "admin" && !viewingAsStudent ? "admin" : "student";

  return (
    <AppShell
      role={role}
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
