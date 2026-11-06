import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Bell, Eye, PlayCircle, TrendingDown, Users } from "lucide-react";
import { requireAdmin } from "@/lib/auth/guards";
import { loadRoster, type RosterRow } from "@/lib/people/roster-data";
import { loadLive, istDayStart } from "@/lib/analytics/live";
import { isBehind } from "@/lib/people/attention";
import { createAdminClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/design-system/page-header";
import { AutoRefresh } from "@/components/admin/auto-refresh";
import { EveryoneView } from "./everyone-view";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Activity" };
export const dynamic = "force-dynamic";

const VIEWS = [
  { id: "live", label: "Live now" },
  { id: "cohorts", label: "Cohorts" },
  { id: "behind", label: "Falling behind" },
  { id: "everyone", label: "Everyone (30 days)" },
] as const;
type View = (typeof VIEWS)[number]["id"];

const hm = (min: number) => (min >= 60 ? `${Math.floor(min / 60)}h ${min % 60}m` : `${min}m`);
const time = (iso: string) => new Date(iso).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" });

/**
 * Activity — what STUDENTS are doing (2026-11 redesign). Live now (who is on,
 * who is watching which lecture — from the real heartbeat and player
 * pings, refreshed every 30 s), cohort comparison, who is falling behind,
 * and the 30-day picture for everyone. Each student opens their timeline.
 */
export default async function ActivityPage({ searchParams }: { searchParams: Promise<{ view?: string; sort?: string; cohort?: string }> }) {
  if (!(await requireAdmin())) redirect("/dashboard");
  const sp = await searchParams;
  const view: View = (VIEWS.map((v) => v.id) as string[]).includes(sp.view ?? "") ? (sp.view as View) : "live";
  const { rows, cohorts } = await loadRoster();
  const byId = new Map(rows.map((r) => [r.id, r]));

  const tabs = (
    <nav aria-label="Activity views" className="flex gap-1 overflow-x-auto rounded-2xl border-2 border-foreground bg-card p-1 [scrollbar-width:none]">
      {VIEWS.map((v) => (
        <Link
          key={v.id}
          href={`/admin/activity?view=${v.id}`}
          aria-current={view === v.id ? "page" : undefined}
          className={cn("flex h-10 shrink-0 items-center rounded-xl px-4 text-sm font-bold", view === v.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground")}
        >
          {v.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="min-w-0 space-y-6">
      <PageHeader eyebrow="Activity" title="Student activity" description="What students are doing on VIBHA. Only real signals: the page heartbeat and the lecture player." />
      {tabs}
      {view === "live" ? <LiveView rows={rows} byId={byId} /> : null}
      {view === "cohorts" ? <CohortsView rows={rows} cohorts={cohorts} /> : null}
      {view === "behind" ? <BehindView rows={rows} cohorts={cohorts} cohort={sp.cohort ?? ""} /> : null}
      {view === "everyone" ? <EveryoneView sort={sp.sort} /> : null}
    </div>
  );
}

function Num({ v, l, href }: { v: React.ReactNode; l: string; href?: string }) {
  const body = (
    <>
      <p className="text-3xl font-black tabular-nums">{v}</p>
      <p className="text-caption text-muted-foreground">{l}</p>
    </>
  );
  return href ? (
    <Link href={href} className="rounded-2xl border-2 border-foreground bg-card p-4 transition-transform hover:-translate-y-0.5">{body}</Link>
  ) : (
    <div className="rounded-2xl border-2 border-foreground bg-card p-4">{body}</div>
  );
}

async function LiveView({ rows, byId }: { rows: RosterRow[]; byId: Map<string, RosterRow> }) {
  const live = (await loadLive()).filter((l) => byId.has(l.userId));
  const watching = live.filter((l) => l.watching);
  const dayStart = istDayStart();
  const today = rows.filter((r) => r.lastSeen && r.lastSeen >= dayStart).length;
  const { data: doneToday } = await createAdminClient().from("progress").select("user_id").eq("is_completed", true).gte("updated_at", dayStart).limit(5000);
  const quiet = rows.filter((r) => r.account === "active" && (r.presence === "quiet" || r.presence === "never")).length;
  const neverIn = rows.filter((r) => r.account !== "active" && r.account !== "locked").length;

  return (
    <div className="space-y-6">
      <div className="flex justify-end"><AutoRefresh seconds={30} /></div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Num v={live.length} l="on VIBHA right now" />
        <Num v={watching.length} l="watching a lecture now" />
        <Num v={today} l="came in today" />
        <Num v={(doneToday ?? []).filter((d) => byId.has(d.user_id as string)).length} l="lectures finished today" />
        <Num v={quiet} l="quiet 7+ days" href="/admin/students?filter=attention" />
      </div>
      {neverIn ? (
        <p className="rounded-2xl border-2 border-foreground/15 bg-card p-3 text-sm">
          <b>{neverIn}</b> student{neverIn === 1 ? " has" : "s have"} never signed in. <Link href="/admin/students/logins" className="font-bold text-link underline">Send login links</Link>
        </p>
      ) : null}
      <section className="rounded-2xl border-2 border-foreground bg-card">
        <h2 className="flex items-center gap-2 border-b-2 border-foreground/10 px-4 py-3 font-bold"><Eye className="size-4" aria-hidden /> On VIBHA right now</h2>
        {live.length ? (
          <ul className="divide-y-2 divide-foreground/10">
            {live.map((l) => {
              const r = byId.get(l.userId)!;
              return (
                <li key={l.userId} className="flex items-center gap-3 px-4 py-3">
                  <span className={cn("size-2.5 shrink-0 rounded-full", l.watching ? "bg-status-success-fg" : "bg-link")} aria-hidden />
                  <span className="min-w-0 flex-1">
                    <Link href={`/admin/students/${r.id}?tab=activity`} className="block truncate text-sm font-bold hover:underline">{r.name}</Link>
                    <span className="block truncate text-caption text-muted-foreground">{r.roll ?? r.email}{r.cohorts.length ? ` · ${r.cohorts.map((c) => c.name).join(", ")}` : ""}</span>
                  </span>
                  <span className="min-w-0 max-w-[45%] text-right text-sm">
                    <span className={cn("flex items-center justify-end gap-1 truncate font-semibold", l.watching && "text-status-success-fg")}>
                      {l.watching ? <PlayCircle className="size-4 shrink-0" aria-hidden /> : null}
                      <span className="truncate">{l.where || "On VIBHA"}</span>
                    </span>
                    <span className="block text-caption text-muted-foreground">since {time(l.since)}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="p-5 text-sm text-muted-foreground">Nobody is on right now.</p>
        )}
      </section>
    </div>
  );
}

function CohortsView({ rows, cohorts }: { rows: RosterRow[]; cohorts: { id: string; name: string; status: string | null }[] }) {
  const groups = [...cohorts.map((c) => ({ id: c.id, name: c.name, status: c.status, members: rows.filter((r) => r.cohorts.some((x) => x.id === c.id)) })), { id: "none", name: "Not in a cohort", status: null, members: rows.filter((r) => !r.cohorts.length) }].filter((g) => g.members.length);
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {groups.map((g) => {
        const n = g.members.length;
        const week = g.members.filter((r) => r.presence === "now" || r.presence === "today" || r.presence === "week").length;
        const never = g.members.filter((r) => r.presence === "never").length;
        const done = g.members.reduce((a, r) => a + r.lecturesDone, 0);
        const avail = g.members.reduce((a, r) => a + r.lecturesAvailable, 0);
        const behind = g.members.filter((r) => r.account === "active" && isBehind(r.lecturesDone, r.lecturesAvailable)).length;
        const min7 = g.members.reduce((a, r) => a + r.min7, 0);
        const pct = avail ? Math.round((done / avail) * 100) : 0;
        return (
          <section key={g.id} className="space-y-3 rounded-2xl border-2 border-foreground bg-card p-4">
            <header className="flex items-start justify-between gap-2">
              <h2 className="flex items-center gap-2 font-bold"><Users className="size-4" aria-hidden /> {g.name}</h2>
              <span className="text-caption text-muted-foreground">{n} student{n === 1 ? "" : "s"}</span>
            </header>
            <div>
              <div className="flex justify-between text-caption"><span>Lectures finished</span><span className="font-bold">{pct}%</span></div>
              <span className="mt-1 block h-2.5 overflow-hidden rounded-full bg-muted" aria-hidden><span className="block h-full bg-link" style={{ width: `${pct}%` }} /></span>
            </div>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-xl bg-background p-2"><dt className="text-caption text-muted-foreground">Active this week</dt><dd className="text-lg font-black">{week}/{n}</dd></div>
              <div className="rounded-xl bg-background p-2"><dt className="text-caption text-muted-foreground">Study time this week</dt><dd className="text-lg font-black">{hm(min7)}</dd></div>
              <div className="rounded-xl bg-background p-2"><dt className="text-caption text-muted-foreground">Falling behind</dt><dd className="text-lg font-black">{behind}</dd></div>
              <div className="rounded-xl bg-background p-2"><dt className="text-caption text-muted-foreground">Never came in</dt><dd className="text-lg font-black">{never}</dd></div>
            </dl>
            <div className="flex flex-wrap gap-2">
              {g.id !== "none" ? <Link href={`/admin/cohorts/${g.id}`} className="inline-flex h-9 items-center rounded-full border-2 border-foreground px-3 text-sm font-bold">Open cohort</Link> : null}
              <Link href={`/admin/activity?view=behind${g.id !== "none" ? `&cohort=${g.id}` : ""}`} className="inline-flex h-9 items-center rounded-full border-2 border-foreground px-3 text-sm font-bold">Who&apos;s behind</Link>
            </div>
          </section>
        );
      })}
    </div>
  );
}

function BehindView({ rows, cohorts, cohort }: { rows: RosterRow[]; cohorts: { id: string; name: string }[]; cohort: string }) {
  const list = rows
    .filter((r) => r.account === "active" && (!cohort || r.cohorts.some((c) => c.id === cohort)))
    .filter((r) => isBehind(r.lecturesDone, r.lecturesAvailable) || r.presence === "quiet")
    .sort((a, b) => b.lecturesAvailable - b.lecturesDone - (a.lecturesAvailable - a.lecturesDone));
  const emails = list.map((r) => r.email).join(",");
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <nav aria-label="Cohort" className="flex flex-wrap gap-1">
          <Link href="/admin/activity?view=behind" className={cn("inline-flex h-9 items-center rounded-full border-2 border-foreground px-3 text-sm font-bold", !cohort && "bg-foreground text-background")}>All</Link>
          {cohorts.map((c) => (
            <Link key={c.id} href={`/admin/activity?view=behind&cohort=${c.id}`} className={cn("inline-flex h-9 items-center rounded-full border-2 border-foreground px-3 text-sm font-bold", cohort === c.id && "bg-foreground text-background")}>{c.name}</Link>
          ))}
        </nav>
        {list.length ? (
          <Link href={`/admin/emails?folder=notify&to=${encodeURIComponent(emails)}`} className="ml-auto inline-flex h-10 items-center gap-1.5 rounded-full border-2 border-foreground bg-primary px-4 text-sm font-bold text-primary-foreground">
            <Bell className="size-4" aria-hidden /> Nudge all {list.length}
          </Link>
        ) : null}
      </div>
      <p className="text-caption text-muted-foreground">Behind = finished under half of the lectures they can watch, or quiet for 7+ days.</p>
      {list.length ? (
        <ul className="divide-y-2 divide-foreground/10 overflow-hidden rounded-2xl border-2 border-foreground bg-card">
          {list.map((r) => {
            const pct = r.lecturesAvailable ? Math.round((r.lecturesDone / r.lecturesAvailable) * 100) : 0;
            return (
              <li key={r.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <TrendingDown className="size-4 shrink-0 text-status-pending-fg" aria-hidden />
                <span className="min-w-0 flex-1 basis-48">
                  <Link href={`/admin/students/${r.id}?tab=activity`} className="block truncate text-sm font-bold hover:underline">{r.name}</Link>
                  <span className="block truncate text-caption text-muted-foreground">{r.roll ?? r.email} · {r.presence === "quiet" ? "quiet 7+ days" : `${hm(r.min7)} this week`}</span>
                </span>
                <span className="w-32">
                  <span className="flex justify-between text-caption"><span>{r.lecturesDone}/{r.lecturesAvailable}</span><span>{pct}%</span></span>
                  <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden><span className="block h-full bg-status-pending-fg" style={{ width: `${pct}%` }} /></span>
                </span>
                <Link href={`/admin/emails?folder=notify&to=${encodeURIComponent(r.email)}`} className="inline-flex h-9 items-center rounded-full border-2 border-foreground px-3 text-sm font-bold">Nudge</Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="rounded-2xl border-2 border-dashed border-foreground/30 p-6 text-center text-sm text-muted-foreground">Nobody is behind.</p>
      )}
    </div>
  );
}
