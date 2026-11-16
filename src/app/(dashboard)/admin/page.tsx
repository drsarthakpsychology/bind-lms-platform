import type * as React from "react";
import { redirect } from "next/navigation";
import { isSuperAdmin, requireAdmin } from "@/lib/auth/guards";
import { ArrowRight, Bell, BookOpen, Database, GraduationCap, Inbox, KeyRound, Mail, MailWarning, PhoneCall, Plus, ShieldAlert, ToggleLeft, UserPlus, Users } from "lucide-react";
import Link from "next/link";
import { loadAdminOverview, type AdminTodoIcon } from "@/lib/admin/overview";

import { AddPeopleButton } from "@/components/admin/add-people-panel";
import { PageHeader } from "@/components/design-system/page-header";
import { StatCard } from "@/components/design-system/stat-card";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { readFlags } from "@/lib/flags";
import { uiV2For } from "@/lib/ui/v2";
import { AdminHomeV2 } from "./_v2/home";
import { btn } from "./_v2/kit";

const TODO_ICON: Record<AdminTodoIcon, React.ReactNode> = {
  shieldAlert: <ShieldAlert className="size-4" />,
  mail: <Mail className="size-4" />,
  phoneCall: <PhoneCall className="size-4" />,
  mailWarning: <MailWarning className="size-4" />,
  inbox: <Inbox className="size-4" />,
  graduationCap: <GraduationCap className="size-4" />,
  users: <Users className="size-4" />,
  bookOpen: <BookOpen className="size-4" />,
  keyRound: <KeyRound className="size-4" />,
};

export default async function AdminOverviewPage() {
  // Defence in depth: layouts don't re-render on every navigation, so the page
  // re-checks admin itself before reading data.
  const me = await requireAdmin();
  if (!me) redirect("/dashboard");
  const v2 = uiV2For(await readFlags(), me.role);
  const { students, activeThisWeek, neverIn, onNow, dbPct, todo, totalToDo, cohortCards, live } = await loadAdminOverview();
  const shortcuts = [
    { label: "Students", href: "/admin/students", icon: <Users className="size-4" /> },
    { label: "Messages", href: "/admin/emails", icon: <Mail className="size-4" /> },
    { label: "Courses", href: "/admin/courses", icon: <BookOpen className="size-4" /> },
    { label: "What's live", href: "/admin/flags", icon: <ToggleLeft className="size-4" /> },
    { label: "Pipeline", href: "/admin/people", icon: <PhoneCall className="size-4" /> },
    { label: `Usage · ${dbPct}%`, href: "/admin/infra", icon: <Database className="size-4" /> },
  ];

  if (v2) {
    return (
      <AdminHomeV2
        todo={todo.map((a) => ({ label: a.label, count: a.count, detail: a.detail, href: a.href }))}
        live={live}
        cohorts={cohortCards}
        students={students}
        activeThisWeek={activeThisWeek}
        neverIn={neverIn}
        dbPct={dbPct}
        actions={
          // Messaging, adding people and new courses are Super Admin only.
          isSuperAdmin(me) ? <>
            <Link href="/admin/emails?folder=notify" className={btn.quiet}>
              <Bell aria-hidden /> Message
            </Link>
            <AddPeopleButton variant="outline" label="Add people" />
            <Link href="/admin/courses" className={btn.quiet}>
              <Plus aria-hidden /> New course
            </Link>
          </> : null
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      <Reveal delay={0.05}>
        <PageHeader
          eyebrow="Admin"
          title="Overview"
          description={
            totalToDo > 0
              ? `${totalToDo} thing${totalToDo === 1 ? "" : "s"} need${totalToDo === 1 ? "s" : ""} you today.`
              : "All clear. Nothing needs you right now."
          }
          actions={
            <>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/emails?folder=notify">
                  <Bell aria-hidden /> Message
                </Link>
              </Button>
              <AddPeopleButton variant="outline" label="Add people" />
              <Button asChild size="sm">
                <Link href="/admin/courses">
                  <Plus aria-hidden /> New course
                </Link>
              </Button>
            </>
          }
        />
      </Reveal>

      {dbPct >= 70 ? (
        <Reveal delay={0.1}>
          <Link
            href="/admin/infra"
            className="flex items-center gap-3 rounded-xl border-2 border-destructive bg-status-alert-bg p-3 font-semibold text-status-alert-fg"
          >
            <Database className="size-5 shrink-0" aria-hidden />
            <span className="text-small">Storage at {dbPct}% of the free limit. Check Usage &amp; limits.</span>
          </Link>
        </Reveal>
      ) : null}

      {/* Numbers first: the four people ask about. */}
      <Reveal delay={0.1}>
        <section aria-label="Programme snapshot" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCard label="Students" value={students} href="/admin/students" icon={<Users className="size-5" />} accent />
          <StatCard label="On VIBHA now" value={onNow} href="/admin/activity" icon={<GraduationCap className="size-5" />} />
          <StatCard label="Active this week" value={activeThisWeek} href="/admin/activity?view=cohorts" icon={<BookOpen className="size-5" />} />
          <StatCard label="Never signed in" value={neverIn} href="/admin/students/logins" icon={<UserPlus className="size-5" />} />
        </section>
      </Reveal>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        {/* The to-do queue: count first, one tap away (an inbox, not a wall). */}
        <Reveal delay={0.15}>
          <section aria-label="Needs attention" className="overflow-hidden rounded-2xl border-2 border-foreground bg-card hard-shadow-sm">
            <h2 className="flex items-center justify-between gap-3 border-b-2 border-foreground px-4 py-3 text-h2">
              Needs you
              <span className="rounded-full border-2 border-foreground bg-primary px-2.5 py-0.5 font-pix text-xs text-primary-foreground">
                {totalToDo}
              </span>
            </h2>
            {!todo.length ? <p className="px-4 py-6 text-sm font-semibold text-muted-foreground">All clear. Nothing needs you right now.</p> : null}
            <ul className="divide-y-2 divide-foreground/10">
              {todo.map((a) => (
                <li key={a.label}>
                  <Link
                    href={a.href}
                    className="group flex min-h-16 items-center gap-3 px-4 py-3 transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
                  >
                    <span
                      className={`flex size-11 shrink-0 items-center justify-center rounded-xl border-2 font-pix text-sm ${
                        a.count > 0
                          ? "border-foreground bg-primary text-primary-foreground"
                          : "border-foreground/20 bg-muted text-muted-foreground"
                      }`}
                    >
                      {a.count > 0 ? a.count : TODO_ICON[a.icon]}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold">{a.label}</span>
                      <span className="block truncate text-caption text-muted-foreground">
                        {a.count > 0 ? a.detail : "Nothing waiting."}
                      </span>
                    </span>
                    <ArrowRight
                      className="size-5 shrink-0 text-muted-foreground transition-transform duration-fast group-hover:translate-x-1 group-hover:text-foreground"
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        {/* Cohorts at a glance + the most-used places. */}
        <Reveal delay={0.2}>
          <section aria-label="Cohorts" className="space-y-3">
            <h2 className="flex items-center justify-between gap-2 text-h2">
              Cohorts
              <Link href="/admin/activity?view=cohorts" className="text-sm font-bold text-link underline-offset-4 hover:underline">Compare</Link>
            </h2>
            {cohortCards.length ? (
              <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {cohortCards.map((c) => (
                  <li key={c.id}>
                    <Link href={`/admin/cohorts/${c.id}`} className="block rounded-2xl border-2 border-foreground bg-card p-4 transition-transform hover:-translate-y-0.5">
                      <span className="flex items-baseline justify-between gap-2">
                        <span className="truncate font-bold">{c.name}</span>
                        <span className="shrink-0 text-caption text-muted-foreground">{c.members} students</span>
                      </span>
                      <span className="mt-2 block h-2 overflow-hidden rounded-full bg-muted" aria-hidden><span className="block h-full bg-link" style={{ width: `${c.pct}%` }} /></span>
                      <span className="mt-2 flex flex-wrap gap-x-3 text-caption text-muted-foreground">
                        <span><b className="text-foreground">{c.pct}%</b> lectures finished</span>
                        <span><b className="text-foreground">{c.week}</b> active this week</span>
                        {c.behind ? <span><b className="text-status-pending-fg">{c.behind}</b> behind</span> : null}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-2xl border-2 border-dashed border-foreground/30 p-4 text-sm text-muted-foreground">No running cohorts. <Link href="/admin/cohorts" className="font-bold underline">Make one</Link>.</p>
            )}
            <ul className="grid grid-cols-2 gap-2 pt-2">
              {shortcuts.map((sc) => (
                <li key={sc.href}>
                  <Link href={sc.href} className="flex h-full items-center gap-2 rounded-xl border-2 border-foreground/20 bg-card p-2.5 text-sm font-bold hover:border-foreground">
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand text-brand-foreground">{sc.icon}</span>
                    <span className="min-w-0 truncate">{sc.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>
      </div>
    </div>
  );
}
