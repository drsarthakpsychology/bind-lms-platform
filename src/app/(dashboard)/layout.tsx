import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { logout } from "@/lib/auth/actions";
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

  return (
    <div className="min-h-screen bg-secondary">
      <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 sm:px-6">
        <span className="text-sm font-medium text-muted-foreground">PLMS</span>
        <div className="flex items-center gap-3">
          {session.profile.role === "admin" && (
            <ViewModeToggle currentMode={viewingAsStudent ? "student" : "admin"} />
          )}
          <form action={logout}>
            <button
              type="submit"
              className="rounded-lg border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-secondary"
            >
              Log out
            </button>
          </form>
        </div>
      </header>
      <main className="px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}
