import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";

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

  if (session.profile.role !== "admin") {
    redirect("/dashboard");
  }

  // Navigation lives in the app sidebar (admin nav items); this layout only
  // owns the server-side role guard and a consistent content container.
  return <div className="w-full">{children}</div>;
}
