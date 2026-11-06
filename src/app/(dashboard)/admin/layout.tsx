import { redirect } from "next/navigation";
import { after } from "next/server";
import { opportunisticDoubtFollowups } from "@/app/api/cron/doubt-followup/followup";
import { getSession } from "@/lib/auth/session";
import { AdminSectionTabs } from "@/components/navigation/admin-section-tabs";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The (dashboard) layout above this already handled unauthenticated /
  // expired / session_replaced cases, so by the time we're here session
  // is either "ok" or the redirect already happened. Still re-check status
  // defensively rather than assuming.
  const session = await getSession();

  if (session.status !== "ok") {
    redirect("/login");
  }

  if (session.profile.role !== "admin" && session.profile.role !== "view_admin") {
    redirect("/dashboard");
  }

  // Doubt answered → notice / 48 h email: a cheap catch-up after the page is
  // sent (throttled to once per 15 min per server; the daily cron does the rest).
  after(opportunisticDoubtFollowups);

  // Navigation lives in the app sidebar (admin nav items); this layout only
  // owns the server-side role guard and a consistent content container.
  return (
    <div className="w-full">
      <AdminSectionTabs />
      {children}
    </div>
  );
}
