import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MessageCircleQuestion, ShieldAlert } from "lucide-react";
import { requireAdmin } from "@/lib/auth/guards";
import { getSession } from "@/lib/auth/session";
import { doubtsReady, loadDoubts } from "@/lib/doubts/data";
import { createAdminClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/design-system/page-header";
import { agoLabel } from "@/lib/analytics/timeline";
import { cn } from "@/lib/utils";
import { FilterBar } from "@/components/admin/filter-bar";

export const metadata: Metadata = { title: "Doubts & concerns" };
export const dynamic = "force-dynamic";

const VIEWS = [
  { id: "concerns", label: "Private concerns" },
  { id: "open", label: "Unanswered doubts" },
  { id: "all", label: "All doubts" },
] as const;

/**
 * Review → Doubts & concerns (2026-11 redesign). The admin's job here is to
 * reply, not to ask: private concerns first, then doubts nobody has answered,
 * filterable by cohort. Each opens the thread to reply or mark solved.
 */
export default async function AdminDoubtsPage({ searchParams }: { searchParams: Promise<{ view?: string; cohort?: string; q?: string; status?: string }> }) {
  if (!(await requireAdmin())) redirect("/dashboard");
  const session = await getSession();
  if (session.status !== "ok") redirect("/dashboard");
  const sp = await searchParams;
  const view = (VIEWS.map((v) => v.id) as string[]).includes(sp.view ?? "") ? sp.view! : "concerns";
  if (!(await doubtsReady())) {
    return <p className="rounded-2xl border-2 border-foreground bg-card p-4 text-sm">The doubts board isn&apos;t switched on yet (database step 2026_11_access_doubts.sql).</p>;
  }
  const [items, { data: cohorts }] = await Promise.all([
    loadDoubts({ userId: session.profile.id, isAdmin: true, cohortIds: [], cohortFilter: sp.cohort ?? null }),
    createAdminClient().from("cohorts").select("id, name").order("created_at"),
  ]);
  const cohortName = new Map((cohorts ?? []).map((c) => [c.id as string, c.name as string]));
  const concerns = items.filter((d) => d.kind === "complaint" && d.status !== "hidden");
  const open = items.filter((d) => d.kind === "doubt" && d.status === "open" && d.replies === 0);
  const viewList = view === "concerns" ? concerns : view === "open" ? open : items.filter((d) => d.kind === "doubt");
  const needle = (sp.q ?? "").trim().toLowerCase().slice(0, 100);
  const status = ["open", "solved", "hidden"].includes(sp.status ?? "") ? sp.status : null;
  const list = viewList.filter((d) => (!status || d.status === status) && (!needle || `${d.title} ${d.author} ${d.topic ?? ""}`.toLowerCase().includes(needle)));
  const q = (v: string, c?: string) => `/admin/doubts?view=${v}${c ? `&cohort=${c}` : ""}`;

  return (
    <div className="space-y-6">
      <PageHeader title="Doubts & concerns" description="Reply to students. Private concerns are seen only by the student and the VIBHA team." />
      <nav aria-label="Views" className="flex flex-wrap gap-1 rounded-2xl border-2 border-foreground bg-card p-1">
        {VIEWS.map((v) => {
          const n = v.id === "concerns" ? concerns.length : v.id === "open" ? open.length : null;
          return (
            <Link key={v.id} href={q(v.id, sp.cohort)} aria-current={view === v.id ? "page" : undefined} className={cn("flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-bold", view === v.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent")}>
              {v.label}
              {n ? <span className="rounded-full bg-destructive px-1.5 text-[0.7rem] text-white">{n}</span> : null}
            </Link>
          );
        })}
      </nav>
      <FilterBar
        search={{ label: "Search doubts", placeholder: "Search by title, student or topic" }}
        selects={[
          { param: "cohort", label: "Cohort", allLabel: "All cohorts", options: (cohorts ?? []).map((c) => ({ value: c.id as string, label: String(c.name) })) },
          { param: "status", label: "Status", allLabel: "Any status", options: [{ value: "open", label: "Open" }, { value: "solved", label: "Solved" }, { value: "hidden", label: "Hidden" }] },
        ]}
      />
      {list.length ? (
        <ul className="divide-y-2 divide-foreground/10 overflow-hidden rounded-2xl border-2 border-foreground bg-card">
          {list.map((d) => (
            <li key={d.id}>
              <Link href={`/doubts/${d.id}`} className="flex items-start gap-3 px-4 py-3 hover:bg-accent">
                {d.kind === "complaint" ? <ShieldAlert className="mt-0.5 size-5 shrink-0 text-status-alert-fg" aria-hidden /> : <MessageCircleQuestion className="mt-0.5 size-5 shrink-0 text-link" aria-hidden />}
                <span className="min-w-0 flex-1">
                  <span className="block font-bold break-words">{d.title}</span>
                  <span className="block text-caption text-muted-foreground">
                    {d.author} · {d.cohortId ? cohortName.get(d.cohortId) ?? "Cohort" : "No cohort"} · {agoLabel(d.createdAt)} · {d.replies} repl{d.replies === 1 ? "y" : "ies"}
                  </span>
                </span>
                <span className={cn("shrink-0 rounded-full border-2 px-2 py-0.5 text-[0.7rem] font-bold", d.status === "solved" ? "border-foreground bg-status-success-bg" : "border-foreground/30")}>{d.status === "solved" ? "Solved" : "Open"}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border-2 border-dashed border-foreground/30 p-6 text-center text-sm text-muted-foreground">{needle || status ? "Nothing matches these filters." : view === "concerns" ? "No private concerns. Good." : "Nothing here."}</p>
      )}
    </div>
  );
}
