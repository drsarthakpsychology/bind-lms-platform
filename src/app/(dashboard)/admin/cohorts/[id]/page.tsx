import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireAdmin, isSuperAdmin } from "@/lib/auth/guards";
import { Bell, ChevronLeft, Mail, MessageCircleQuestion, PlayCircle } from "lucide-react";
import { loadAllLessons, loadCohort, loadCohortSummaries } from "@/lib/cohorts/admin-data";
import { loadRoster } from "@/lib/people/roster-data";
import { ACCOUNT_LABEL, ACCOUNT_TONE } from "@/lib/people/account-status";
import { isBehind } from "@/lib/people/attention";
import { agoLabel } from "@/lib/analytics/timeline";
import { AddPeopleButton } from "@/components/admin/add-people-panel";
import { AddPeopleForm, CohortSettings, LessonSharing, MemberActions } from "@/components/admin/cohorts-ui";
import { CohortCalendarForm } from "../../tools/cohort-calendar-form";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "members", label: "Members" },
  { id: "lectures", label: "Lectures" },
  { id: "progress", label: "Progress" },
  { id: "messages", label: "Messages" },
  { id: "settings", label: "Settings" },
] as const;
type Tab = (typeof TABS)[number]["id"];

const hm = (min: number) => (min >= 60 ? `${Math.floor(min / 60)}h ${min % 60}m` : `${min}m`);
/**
 * One cohort as a workspace (2026-11 redesign): Overview, Members, Lectures,
 * Progress, Messages and Settings in tabs instead of one long screen. Adding
 * people and sharing lectures work exactly as before.
 */
export default async function CohortPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ tab?: string }> }) {
  const me = await requireAdmin();
  if (!me) redirect("/dashboard");
  const canWrite = isSuperAdmin(me);
  const { id } = await params;
  const raw = (await searchParams).tab ?? "";
  // Old "?tab=people" links open Members.
  const tab: Tab = raw === "people" ? "members" : (TABS.map((t) => t.id) as string[]).includes(raw) ? (raw as Tab) : "overview";
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const [data, lessons, { cohorts }, roster] = await Promise.all([loadCohort(id), loadAllLessons(), loadCohortSummaries(), loadRoster()]);
  if (!data) notFound();
  const { cohort, members, lessonIds } = data;
  const rosterById = new Map(roster.rows.map((r) => [r.id, r]));
  const people = members.map((m) => ({ m, r: rosterById.get(m.userId) }));
  const courseIds = new Set<string>([...(cohort.course_id ? [cohort.course_id] : []), ...lessons.filter((l) => lessonIds.has(l.id)).map((l) => l.course_id)]);
  const courses = [...courseIds].map((cid) => ({ id: cid, title: lessons.find((l) => l.course_id === cid)?.course_title ?? "Course" }));
  const emails = members.map((m) => m.email).filter(Boolean).join(",");

  const n = people.length;
  const week = people.filter(({ r }) => r && (r.presence === "now" || r.presence === "today" || r.presence === "week")).length;
  const never = people.filter(({ r }) => r && r.account !== "active" && r.account !== "locked").length;
  const behind = people.filter(({ r }) => r && r.account === "active" && isBehind(r.lecturesDone, r.lecturesAvailable)).length;
  const done = people.reduce((a, { r }) => a + (r?.lecturesDone ?? 0), 0);
  const avail = people.reduce((a, { r }) => a + (r?.lecturesAvailable ?? 0), 0);
  const pct = avail ? Math.round((done / avail) * 100) : 0;

  const pill = "inline-flex h-10 items-center gap-1.5 rounded-md border-2 border-foreground px-4 text-sm font-bold";

  return (
    <div className="space-y-6">
      <Link href="/admin/cohorts" className="inline-flex min-h-10 items-center gap-1.5 rounded-md border-2 border-foreground bg-card px-4 text-sm font-bold">
        <ChevronLeft className="size-4" aria-hidden /> All cohorts
      </Link>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-eyebrow text-link">Cohort{cohort.status ? ` · ${cohort.status}` : ""}</p>
          <h1 className="text-h1">{cohort.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {n} {n === 1 ? "person" : "people"} · {lessonIds.size} lectures shared
            {cohort.starts_on ? ` · starts ${new Date(cohort.starts_on).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}` : ""}
          </p>
        </div>
        {canWrite ? (
          <div className="flex flex-wrap gap-2">
            <AddPeopleButton cohortId={id} size="default" />
            <Link href={`/admin/emails?folder=notify&to=${encodeURIComponent(emails)}`} className={cn(pill, "bg-card")}><Bell className="size-4" aria-hidden /> Message cohort</Link>
          </div>
        ) : null}
      </header>

      <nav aria-label="Cohort sections" className="-mx-4 border-b-2 border-foreground/10 px-4 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        <ul className="-mb-0.5 flex gap-1 overflow-x-auto [scrollbar-width:none]">
          {TABS.map((t) => (
            <li key={t.id} className="shrink-0">
              <Link
                href={`/admin/cohorts/${id}?tab=${t.id}`}
                aria-current={tab === t.id ? "page" : undefined}
                className={cn("relative inline-flex h-12 items-center px-3 text-sm font-bold whitespace-nowrap after:absolute after:inset-x-2 after:bottom-0 after:h-1 after:rounded-full", tab === t.id ? "text-foreground after:bg-link" : "text-muted-foreground hover:text-foreground")}
              >
                {t.label}
                {t.id === "members" ? ` (${n})` : t.id === "lectures" ? ` (${lessonIds.size})` : ""}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {tab === "overview" ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              [`${week}/${n}`, "active this week"],
              [`${pct}%`, "of their lectures finished"],
              [behind, "falling behind"],
              [never, "haven't signed in yet"],
            ].map(([v, l]) => (
              <div key={String(l)} className="rounded-2xl border-2 border-foreground bg-card p-4">
                <p className="text-3xl font-black tabular-nums">{v}</p>
                <p className="text-caption text-muted-foreground">{l}</p>
              </div>
            ))}
          </div>
          <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
              <Link key={c.id} href={`/admin/courses/${c.id}?cohort=${id}`} className="flex items-center gap-3 rounded-2xl border-2 border-foreground bg-brand p-4 font-bold text-brand-foreground">
                <PlayCircle className="size-5 shrink-0" aria-hidden /> {cohort.status === "ended" ? `Course: ${c.title}` : `Upload lectures for ${cohort.name} in ${c.title}`}
              </Link>
            ))}
            <Link href={`/admin/cohorts/${id}?tab=progress`} className="flex items-center gap-3 rounded-2xl border-2 border-foreground bg-card p-4 font-bold">See who is behind</Link>
            <Link href={`/doubts?cohort=${id}`} className="flex items-center gap-3 rounded-2xl border-2 border-foreground bg-card p-4 font-bold"><MessageCircleQuestion className="size-5" aria-hidden /> Their doubts</Link>
            <Link href={`/admin/access?cohort=${id}`} className="flex items-center gap-3 rounded-2xl border-2 border-foreground bg-card p-4 font-bold">Switch sections on/off for this cohort</Link>
          </section>
        </div>
      ) : null}

      {tab === "members" ? (
        <div className="space-y-4">
          {canWrite ? (
            <details className="rounded-2xl border-2 border-foreground bg-card">
              <summary className="cursor-pointer px-4 py-3 text-sm font-bold">Add people to {cohort.name}</summary>
              <div className="border-t-2 border-foreground/10 p-4">
                <AddPeopleForm cohorts={cohorts.map((c) => ({ id: c.id, name: c.name }))} defaultCohortId={id} />
              </div>
            </details>
          ) : null}
          {n ? (
            <ul className="divide-y-2 divide-foreground/10 rounded-2xl border-2 border-foreground bg-card">
              {people.map(({ m, r }) => (
                <li key={m.userId} className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3">
                  <span className="min-w-0 flex-1 basis-60">
                    <Link href={`/admin/students/${m.userId}`} className="block truncate text-sm font-bold hover:underline">{r?.name || m.name || m.email}</Link>
                    <span className="block truncate text-caption text-muted-foreground">{r?.roll ? <span className="font-mono font-semibold text-foreground">{r.roll} · </span> : null}{m.email}</span>
                    <span className="mt-1 flex flex-wrap gap-1">
                      {r ? <Badge variant={ACCOUNT_TONE[r.account]}>{ACCOUNT_LABEL[r.account]}</Badge> : null}
                      <span className="rounded-full border-2 border-foreground/20 px-2 text-[0.7rem] font-semibold">{m.scope === "full" ? "Full platform" : "Lectures only"}</span>
                      {!m.detailsDone ? <span className="rounded-full border-2 border-foreground/20 px-2 text-[0.7rem] font-semibold text-muted-foreground">Details pending</span> : null}
                    </span>
                  </span>
                  {canWrite ? <MemberActions cohortId={id} userId={m.userId} email={m.email} setUp={m.setUp} /> : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-2xl border-2 border-dashed border-foreground p-5 text-sm text-muted-foreground">Nobody here yet.</p>
          )}
        </div>
      ) : null}

      {tab === "lectures" ? (canWrite ? <LessonSharing cohortId={id} cohortName={cohort.name} lessons={lessons} sharedIds={[...lessonIds]} /> : <p className="text-sm">{lessonIds.size} lectures are shared with this cohort.</p>) : null}

      {tab === "progress" ? (
        <ul className="divide-y-2 divide-foreground/10 overflow-hidden rounded-2xl border-2 border-foreground bg-card">
          {[...people]
            .sort((a, b) => (a.r ? a.r.lecturesDone / Math.max(1, a.r.lecturesAvailable) : 0) - (b.r ? b.r.lecturesDone / Math.max(1, b.r.lecturesAvailable) : 0))
            .map(({ m, r }) => {
              const p = r && r.lecturesAvailable ? Math.round((r.lecturesDone / r.lecturesAvailable) * 100) : 0;
              return (
                <li key={m.userId} className="flex flex-wrap items-center gap-3 px-4 py-3">
                  <span className="min-w-0 flex-1 basis-48">
                    <Link href={`/admin/students/${m.userId}?tab=activity`} className="block truncate text-sm font-bold hover:underline">{r?.name || m.email}</Link>
                    <span className="block text-caption text-muted-foreground">{r ? `${hm(r.min7)} this week · last seen ${agoLabel(r.lastSeen)}` : "—"}</span>
                  </span>
                  <span className="w-40">
                    <span className="flex justify-between text-caption"><span>{r?.lecturesDone ?? 0}/{r?.lecturesAvailable ?? 0} lectures</span><span className="font-bold">{p}%</span></span>
                    <span className="mt-1 block h-2 overflow-hidden rounded-full bg-muted" aria-hidden><span className="block h-full bg-link" style={{ width: `${p}%` }} /></span>
                  </span>
                </li>
              );
            })}
        </ul>
      ) : null}

      {tab === "messages" ? (
        <div className="grid gap-3 sm:grid-cols-3">
          <Link href={`/admin/emails?folder=notify&to=${encodeURIComponent(emails)}`} className="space-y-1 rounded-2xl border-2 border-foreground bg-card p-4 hover:bg-accent">
            <Bell className="size-5 text-link" aria-hidden /><p className="font-bold">Notification to this cohort</p><p className="text-caption text-muted-foreground">On their bell inside VIBHA. Nobody in another cohort gets it.</p>
          </Link>
          <Link href={`/admin/emails?folder=compose&to=${encodeURIComponent(emails)}`} className="space-y-1 rounded-2xl border-2 border-foreground bg-card p-4 hover:bg-accent">
            <Mail className="size-5 text-link" aria-hidden /><p className="font-bold">Email this cohort</p><p className="text-caption text-muted-foreground">Formatted, plain text or HTML.</p>
          </Link>
          <Link href={`/doubts?cohort=${id}`} className="space-y-1 rounded-2xl border-2 border-foreground bg-card p-4 hover:bg-accent">
            <MessageCircleQuestion className="size-5 text-link" aria-hidden /><p className="font-bold">Their doubts board</p><p className="text-caption text-muted-foreground">Answer questions from this cohort.</p>
          </Link>
        </div>
      ) : null}

      {tab === "settings" ? (
        canWrite ? (
          <div className="grid items-start gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border-2 border-foreground bg-card p-4">
              <h2 className="mb-3 text-base font-bold">Name, status and dates</h2>
              <CohortSettings cohort={cohort} />
            </section>
            <section className="rounded-2xl border-2 border-foreground bg-card p-4">
              <h2 className="mb-1 text-base font-bold">Session calendar</h2>
              <p className="mb-3 text-small text-muted-foreground">Make the whole session schedule from a start date and weekly pattern.</p>
              <CohortCalendarForm />
            </section>
          </div>
        ) : (
          <p className="text-sm">Only the Super Admin can change cohort settings.</p>
        )
      ) : null}
    </div>
  );
}
