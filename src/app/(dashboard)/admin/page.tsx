import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const [studentsResult, coursesResult, lessonsResult, pendingResult] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("role", "student"),
      supabase.from("courses").select("id", { count: "exact", head: true }),
      supabase.from("lessons").select("id", { count: "exact", head: true }),
      supabase
        .from("submissions")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending_review"),
    ]);

  const stats = [
    { label: "Students", value: studentsResult.count ?? 0, href: "/admin/students" },
    { label: "Courses", value: coursesResult.count ?? 0, href: "/admin/courses" },
    { label: "Lessons", value: lessonsResult.count ?? 0, href: "/admin/courses" },
    { label: "Pending reviews", value: pendingResult.count ?? 0, href: "/admin/submissions" },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        Overview
      </h1>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-xl border border-border bg-card p-4 transition-colors hover:bg-secondary"
          >
            <p className="text-2xl font-semibold text-foreground">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
