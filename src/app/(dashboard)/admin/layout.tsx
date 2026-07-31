import { redirect } from "next/navigation";
import Link from "next/link";
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

  return (
    <div className="mx-auto max-w-4xl">
      <nav className="mb-6 flex gap-1 border-b border-border">
        <Link
          href="/admin"
          className="rounded-t-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          Overview
        </Link>
        <Link
          href="/admin/students"
          className="rounded-t-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          Students
        </Link>
        <Link
          href="/admin/courses"
          className="rounded-t-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          Courses
        </Link>
        <Link
          href="/admin/submissions"
          className="rounded-t-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          Submissions
        </Link>
      </nav>
      {children}
    </div>
  );
}
