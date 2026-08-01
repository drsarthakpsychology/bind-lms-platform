import { BookOpen, GraduationCap, Inbox, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

import { PageHeader } from "@/components/design-system/page-header";
import { StatCard } from "@/components/design-system/stat-card";

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
    { label: "Students", value: studentsResult.count ?? 0, href: "/admin/students", icon: <Users className="size-4" />, accent: true },
    { label: "Courses", value: coursesResult.count ?? 0, href: "/admin/courses", icon: <BookOpen className="size-4" /> },
    { label: "Lessons", value: lessonsResult.count ?? 0, href: "/admin/courses", icon: <GraduationCap className="size-4" /> },
    { label: "Pending reviews", value: pendingResult.count ?? 0, href: "/admin/submissions", icon: <Inbox className="size-4" /> },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Overview"
        description="A snapshot of your platform at a glance."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            href={stat.href}
            icon={stat.icon}
            accent={stat.accent}
          />
        ))}
      </div>
    </div>
  );
}
