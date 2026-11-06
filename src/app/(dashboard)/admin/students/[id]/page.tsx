import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Award, Bell, CheckCircle2, ChevronLeft, Circle, Clock, KeyRound, Mail, MessageSquare, PlayCircle, ShieldAlert, Sparkles, Upload } from "lucide-react";
import { requireAdmin, isSuperAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { loadRoster } from "@/lib/people/roster-data";
import { loadStudentDetail } from "@/lib/analytics/activity";
import { buildTimeline, daysAgoIso, type TimelineEvent } from "@/lib/analytics/timeline";
import { loadAllLessons, loadCohortSummaries, loadPersonAccess } from "@/lib/cohorts/admin-data";
import { normalise } from "@/lib/learn/engine";
import { ACCOUNT_LABEL, ACCOUNT_NEXT, ACCOUNT_TONE } from "@/lib/people/account-status";
import { FLAG_LABEL } from "@/lib/people/attention";
import { personKey } from "@/lib/crm/people";
import { PersonAccess } from "@/components/admin/cohorts-ui";
import { LockToggle } from "@/components/admin/lock-toggle";
import { Badge } from "@/components/ui/badge";
import { StudentActions } from "../student-actions";
import { SendLinkButton } from "./send-link-button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Student" };
export const dynamic = "force-dynamic";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "access", label: "Access & login" },
  { id: "activity", label: "Activity" },
  { id: "credentials", label: "Credentials" },
  { id: "messages", label: "Messages" },
] as const;
type Tab = (typeof TABS)[number]["id"];

const when = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "—";
const hm = (min: number) => (min >= 60 ? `${Math.floor(min / 60)}h ${min % 60}m` : `${min}m`);

const DETAIL_LABELS: [string, string][] = [
  ["full_name", "Full name"],
  ["phone", "Mobile"],
  ["city", "City"],
  ["state", "State"],
  ["country", "Country"],
  ["qualification", "Highest qualification"],
  ["institution", "College or workplace"],
  ["occupation", "Currently"],
];

const EVENT_ICON: Record<TimelineEvent["kind"], typeof Clock> = {
  session: Clock,
  "lecture-start": PlayCircle,
  "lecture-progress": PlayCircle,
  "lecture-done": CheckCircle2,
  submission: Upload,
  credential: Award,
  learn: Sparkles,
  "check-ok": CheckCircle2,
  "check-missed": ShieldAlert,
};

/**
 * One student, one page (2026-11 redesign): everything about a person in
 * tabs — overview, access & login, activity timeline, credentials, messages.
 * Replaces the separate "Access" and "Activity" person pages (their old
 * addresses redirect here).
 */
export default async function StudentProfilePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ tab?: string }> }) {
  const me = await requireAdmin();
  if (!me) redirect("/dashboard");
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const tab: Tab = (TABS.map((t) => t.id) as string[]).includes((await searchParams).tab ?? "") ? ((await searchParams).tab as Tab) : "overview";
  const canWrite = isSuperAdmin(me);
  const admin = createAdminClient();

  const [{ rows }, person] = await Promise.all([loadRoster(), loadPersonAccess(id)]);
  if (!person) notFound();
  const r = rows.find((x) => x.id === id);
  const p = person.profile;
  const email = String(p.email ?? "");
  const name = (person.details?.full_name as string) || r?.name || (p.name as string) || email;
  const { data: extra } = await admin.from("profiles").select("roll_number, is_test, status, expires_at").eq("id", id).maybeSingle();

  return (
    <div className="space-y-6">
      <Link href="/admin/students" className="inline-flex min-h-10 items-center gap-1.5 rounded-full border-2 border-foreground bg-card px-4 text-sm font-bold">
        <ChevronLeft className="size-4" aria-hidden /> Students
      </Link>

      <header className="flex flex-wrap items-start gap-4">
        <span aria-hidden className="grid size-14 shrink-0 place-items-center rounded-full border-2 border-foreground bg-primary font-pix text-lg text-primary-foreground">
          {name.slice(0, 1).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-h1 break-words">{name}</h1>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
            <span className="font-mono font-bold text-foreground">{(extra?.roll_number as string | null) ?? "No roll number"}</span>
            <span>· {email}</span>
            {p.mobile_number ? (
              <a className="font-semibold text-link underline" href={`https://wa.me/91${p.mobile_number}`} target="_blank" rel="noopener noreferrer">· WhatsApp +91 {String(p.mobile_number)}</a>
            ) : <span>· No mobile</span>}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {r ? <Badge variant={ACCOUNT_TONE[r.account]}>{ACCOUNT_LABEL[r.account]}</Badge> : null}
            <span className="rounded-full border-2 border-foreground/20 px-2 py-0.5 text-caption font-semibold">{p.scope === "lectures_only" ? "Lectures only" : "Full platform"}</span>
            {(r?.cohorts ?? []).map((c) => (
              <Link key={c.id} href={`/admin/cohorts/${c.id}`} className="rounded-full border-2 border-foreground px-2 py-0.5 text-caption font-bold hover:bg-accent">{c.name}</Link>
            ))}
            {extra?.is_test ? <Badge variant="pending">Test account</Badge> : null}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/admin/emails?folder=notify&to=${encodeURIComponent(email)}`} className="inline-flex h-10 items-center gap-1.5 rounded-full border-2 border-foreground bg-card px-3.5 text-sm font-bold hover:bg-accent"><Bell className="size-4" aria-hidden /> Notify</Link>
          <Link href={`/admin/emails?folder=compose&to=${encodeURIComponent(email)}`} className="inline-flex h-10 items-center gap-1.5 rounded-full border-2 border-foreground bg-card px-3.5 text-sm font-bold hover:bg-accent"><Mail className="size-4" aria-hidden /> Email</Link>
        </div>
      </header>

      <nav aria-label="Student sections" className="-mx-4 border-b-2 border-foreground/10 px-4 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        <ul className="-mb-0.5 flex gap-1 overflow-x-auto [scrollbar-width:none]">
          {TABS.map((t) => (
            <li key={t.id} className="shrink-0">
              <Link
                href={`/admin/students/${id}?tab=${t.id}`}
                aria-current={tab === t.id ? "page" : undefined}
                className={cn(
                  "relative inline-flex h-12 items-center px-3 text-sm font-bold whitespace-nowrap after:absolute after:inset-x-2 after:bottom-0 after:h-1 after:rounded-full",
                  tab === t.id ? "text-foreground after:bg-link" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {tab === "overview" ? <Overview id={id} r={r} details={person.details} /> : null}
      {tab === "access" ? <AccessTab id={id} email={email} canWrite={canWrite} person={person} r={r} isTest={Boolean(extra?.is_test)} /> : null}
      {tab === "activity" ? <ActivityTab id={id} /> : null}
      {tab === "credentials" ? <CredentialsTab id={id} roll={(extra?.roll_number as string | null) ?? null} /> : null}
      {tab === "messages" ? <MessagesTab id={id} email={email} /> : null}
    </div>
  );
}

type Row = Awaited<ReturnType<typeof loadRoster>>["rows"][number] | undefined;

function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="rounded-2xl border-2 border-foreground bg-card p-4">
      <p className="text-2xl font-black tabular-nums">{value}</p>
      <p className="text-caption text-muted-foreground">{label}</p>
    </div>
  );
}

function Overview({ id, r, details }: { id: string; r: Row; details: Record<string, string | null> | null }) {
  const next = r ? ACCOUNT_NEXT[r.account] : null;
  return (
    <div className="space-y-6">
      {next ? (
        <p className="flex items-start gap-2 rounded-2xl border-2 border-foreground bg-status-pending-bg p-4 text-sm font-semibold text-status-pending-fg">
          <KeyRound className="mt-0.5 size-4 shrink-0" aria-hidden /> {next}{" "}
          <Link href={`/admin/students/${id}?tab=access`} className="underline">Open Access & login</Link>
        </p>
      ) : null}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat value={r?.presence === "now" ? "On now" : r?.lastSeen ? when(r.lastSeen) : "Never"} label="Last on VIBHA" />
        <Stat value={hm(r?.min7 ?? 0)} label={`this week · ${hm(r?.min30 ?? 0)} in 30 days`} />
        <Stat value={`${r?.lecturesDone ?? 0}/${r?.lecturesAvailable ?? 0}`} label="lectures finished" />
        <Stat value={`${r?.xp ?? 0} XP`} label="Notes & Games" />
      </div>
      {r?.flags.length ? (
        <section className="rounded-2xl border-2 border-foreground bg-card p-4">
          <h2 className="text-base font-bold">Needs attention</h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {r.flags.map((f) => <li key={f} className="rounded-full bg-status-pending-bg px-3 py-1 text-sm font-bold text-status-pending-fg">{FLAG_LABEL[f]}</li>)}
          </ul>
        </section>
      ) : null}
      <section className="rounded-2xl border-2 border-foreground bg-card p-4">
        <h2 className="text-base font-bold">Their details</h2>
        {details ? (
          <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
            {DETAIL_LABELS.map(([k, l]) => (
              <div key={k} className="flex justify-between gap-3 border-b border-foreground/10 pb-2">
                <dt className="text-muted-foreground">{l}</dt>
                <dd className="min-w-0 break-words text-right font-semibold">{details[k] || "—"}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">Not filled yet. They&apos;ll be asked the next time they open VIBHA.</p>
        )}
      </section>
    </div>
  );
}

async function AccessTab({ id, email, canWrite, person, r, isTest }: { id: string; email: string; canWrite: boolean; person: NonNullable<Awaited<ReturnType<typeof loadPersonAccess>>>; r: Row; isTest: boolean }) {
  const [lessons, { cohorts }] = await Promise.all([loadAllLessons(), loadCohortSummaries()]);
  const admin = createAdminClient();
  const { data: links } = person.cohortIds.size ? await admin.from("lesson_cohorts").select("lesson_id").in("cohort_id", [...person.cohortIds]) : { data: [] };
  const status = person.profile.status === "blocked" ? "blocked" : "active";
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="min-w-0">
        {canWrite ? (
          <PersonAccess
            userId={id}
            cohorts={cohorts.map((c) => ({ id: c.id, name: c.name }))}
            cohortIds={[...person.cohortIds]}
            scope={String(person.profile.scope ?? "full")}
            lessons={lessons}
            grantIds={[...person.grantIds]}
            cohortLessonIds={(links ?? []).map((l) => l.lesson_id as string)}
            detailsConfirmed={Boolean(person.details?.confirmed_at)}
          />
        ) : (
          <p className="rounded-2xl border-2 border-foreground/20 bg-card p-4 text-sm">View Admins can see access but not change it.</p>
        )}
      </div>
      <aside className="space-y-4 lg:sticky lg:top-20">
        <section className="space-y-3 rounded-2xl border-2 border-foreground bg-card p-4">
          <h2 className="text-base font-bold">Login</h2>
          {r ? (
            <p className="text-sm">
              <Badge variant={ACCOUNT_TONE[r.account]}>{ACCOUNT_LABEL[r.account]}</Badge>
              {ACCOUNT_NEXT[r.account] ? <span className="mt-2 block text-muted-foreground">{ACCOUNT_NEXT[r.account]}</span> : null}
            </p>
          ) : null}
          {canWrite ? (
            <div className="flex flex-wrap items-center gap-2">
              <SendLinkButton email={email} />
              <LockToggle userId={id} status={status} />
              <StudentActions userId={id} isTest={isTest} status={status} />
            </div>
          ) : null}
          <p className="text-caption text-muted-foreground">Lock = can&apos;t sign in until unlocked. A new login link replaces older ones.</p>
        </section>
        <section className="rounded-2xl border-2 border-foreground bg-card p-4 text-sm">
          <h2 className="text-base font-bold">Switch sections off</h2>
          <p className="mt-1 text-muted-foreground">Hide Notes, Games, a practice tool and so on for this student, or reset their progress.</p>
          <Link href={`/admin/access?q=${encodeURIComponent(email)}`} className="mt-2 inline-flex font-bold text-link underline">Open section switches</Link>
        </section>
      </aside>
    </div>
  );
}

async function ActivityTab({ id }: { id: string }) {
  const admin = createAdminClient();
  const d = await loadStudentDetail(id);
  if (!d) return null;
  const since = daysAgoIso(30);
  const [visits, progress, subs, creds, learn, checks] = await Promise.all([
    admin.from("page_visits").select("path, entered_at, duration_seconds").eq("user_id", id).gte("entered_at", since).order("entered_at", { ascending: false }).limit(3000),
    admin.from("progress").select("lesson_id, watched_seconds, is_completed, updated_at").eq("user_id", id),
    admin.from("submissions").select("submitted_at, status, assignments(title)").eq("user_id", id).order("submitted_at", { ascending: false }).limit(50),
    admin.from("credentials").select("issued_at, status, achievements(title)").eq("user_id", id).limit(50),
    admin.from("learn_progress").select("state").eq("user_id", id).maybeSingle(),
    admin.from("attention_checks").select("asked_at, answered_at, missed, lesson_id").eq("user_id", id).order("asked_at", { ascending: false }).limit(200),
  ]);
  const titles = new Map(d.lectures.map((l) => [l.id, l.title]));
  const one = <T,>(x: T | T[] | null | undefined): T | null => (Array.isArray(x) ? (x[0] ?? null) : (x ?? null));
  const events = buildTimeline({
    visits: (visits.data ?? []) as { path: string; entered_at: string; duration_seconds: number | null }[],
    progress: (progress.data ?? []) as { lesson_id: string; watched_seconds: number | null; is_completed: boolean | null; updated_at: string | null }[],
    lessonTitle: (lid) => titles.get(lid) ?? "a lecture",
    submissions: (subs.error ? [] : (subs.data ?? [])).map((s) => ({ submitted_at: s.submitted_at as string | null, status: s.status as string | null, title: one(s.assignments as { title?: string } | { title?: string }[] | null)?.title ?? "an assignment" })),
    credentials: (creds.error ? [] : (creds.data ?? [])).map((c) => ({ issued_at: c.issued_at as string | null, status: String(c.status), title: one(c.achievements as { title?: string } | { title?: string }[] | null)?.title ?? "a credential" })),
    learnHistory: learn.data ? normalise(learn.data.state).history : {},
    checks: checks.error ? [] : ((checks.data ?? []) as { asked_at: string; answered_at: string | null; missed: boolean; lesson_id: string | null }[]),
  });
  const checkRows = checks.error ? [] : (checks.data ?? []);
  const answered = checkRows.filter((c) => c.answered_at).length;
  const maxDay = Math.max(10, ...d.daily.map((x) => x.min));
  const done = d.lectures.filter((l) => l.done).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat value={hm(d.totals.min30)} label="on VIBHA (30 days)" />
        <Stat value={d.totals.activeDays} label="active days (30)" />
        <Stat value={`${done}/${d.lectures.length}`} label="lectures finished" />
        <Stat value={checkRows.length ? `${answered}/${checkRows.length}` : "—"} label={`"Still watching?" answered`} />
      </div>

      <section className="rounded-2xl border-2 border-foreground bg-card p-4">
        <h2 className="font-bold">Minutes per day, last 30 days</h2>
        <div className="mt-3 flex h-32 items-end gap-1" role="img" aria-label="Minutes per day">
          {d.daily.map((x) => (
            <div key={x.day} className="flex h-full flex-1 flex-col justify-end" title={`${x.day}: ${x.min} min`}>
              <div className="w-full rounded-t-sm bg-brand" style={{ height: `${Math.max(x.min ? 4 : 1, (x.min / maxDay) * 100)}%`, opacity: x.min ? 1 : 0.2 }} />
            </div>
          ))}
        </div>
        <div className="mt-1 flex justify-between text-[0.65rem] text-muted-foreground"><span>{d.daily[0].day.slice(5)}</span><span>Today</span></div>
      </section>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border-2 border-foreground bg-card p-4">
          <h2 className="font-bold">Timeline</h2>
          <p className="text-caption text-muted-foreground">Last 30 days, newest first. &ldquo;Came in&rdquo; is worked out from page visits.</p>
          {events.length ? (
            <ol className="mt-3 max-h-[32rem] space-y-2 overflow-y-auto pr-1">
              {events.map((e, k) => {
                const Icon = EVENT_ICON[e.kind];
                return (
                  <li key={k} className="flex gap-3 text-sm">
                    <Icon className={cn("mt-0.5 size-4 shrink-0", e.kind === "check-missed" ? "text-status-alert-fg" : "text-link")} aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold break-words">{e.text}</span>
                      <span className="block text-caption text-muted-foreground">{e.kind === "learn" ? new Date(e.at).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short" }) : when(e.at)}{e.detail ? ` · ${e.detail}` : ""}</span>
                    </span>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">Nothing in the last 30 days.</p>
          )}
        </section>
        <section className="rounded-2xl border-2 border-foreground bg-card p-4">
          <h2 className="font-bold">Lectures</h2>
          <ul className="mt-3 max-h-[32rem] space-y-1.5 overflow-y-auto pr-1">
            {d.lectures.map((l) => (
              <li key={l.id} className="flex items-center gap-2 rounded-xl border border-foreground/15 px-3 py-2 text-sm">
                {l.done ? <CheckCircle2 className="size-4 shrink-0 text-link" aria-label="Finished" /> : <Circle className="size-4 shrink-0 text-muted-foreground" aria-label="Not finished" />}
                <span className="min-w-0 flex-1 truncate">{l.week ? `W${l.week} · ` : ""}{l.title}</span>
                <span className={cn("shrink-0 font-pix text-[0.65rem]", !l.watchedMin && "text-muted-foreground")}>{l.watchedMin ? hm(l.watchedMin) : "not opened"}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {d.learn ? (
        <section className="rounded-2xl border-2 border-foreground bg-card p-4 text-sm">
          <h2 className="font-bold">Notes & Games</h2>
          <p className="mt-1">Level {d.learn.level.level} · {d.learn.level.title} · {d.learn.xp} XP · streak {d.learn.streak} (best {d.learn.best}) · accuracy {d.learn.accuracy === null ? "—" : `${d.learn.accuracy}%`} over {d.learn.answered} answers · mastery {d.learn.mastery}%</p>
          {d.learn.confusions.length ? <p className="mt-1 text-muted-foreground">Mixes up: {d.learn.confusions.join(", ")}</p> : null}
        </section>
      ) : null}
    </div>
  );
}

async function CredentialsTab({ id, roll }: { id: string; roll: string | null }) {
  const { data, error } = await createAdminClient().from("credentials").select("id, credential_id, type, status, issued_at, revoked_at, revoke_reason, achievements(title)").eq("user_id", id).order("created_at", { ascending: false });
  const one = <T,>(x: T | T[] | null | undefined): T | null => (Array.isArray(x) ? (x[0] ?? null) : (x ?? null));
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Link href={`/admin/credentials?q=${encodeURIComponent(roll ?? id)}`} className="inline-flex h-10 items-center rounded-full border-2 border-foreground bg-primary px-4 text-sm font-bold text-primary-foreground">Manage or issue a certificate</Link>
      </div>
      {error ? (
        <p className="text-sm text-muted-foreground">Credentials aren&apos;t set up in the database yet.</p>
      ) : (data ?? []).length ? (
        <ul className="divide-y-2 divide-foreground/10 overflow-hidden rounded-2xl border-2 border-foreground bg-card">
          {(data ?? []).map((c) => (
            <li key={c.id as string} className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
              <Award className="size-5 shrink-0 text-link" aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="block font-bold">{one(c.achievements as { title?: string } | { title?: string }[] | null)?.title ?? "Credential"}</span>
                <span className="block text-caption text-muted-foreground">{c.type === "certificate" ? "Certificate" : "Badge"} · {String(c.credential_id)} · {c.issued_at ? `issued ${when(c.issued_at as string)}` : String(c.status)}</span>
              </span>
              {c.revoked_at ? <Badge variant="destructive">Revoked</Badge> : <Badge variant="published">{String(c.status) === "issued" ? "Issued" : String(c.status)}</Badge>}
              <Link href={`/verify/${c.credential_id}`} target="_blank" className="font-bold text-link underline">Verify page</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border-2 border-dashed border-foreground/30 p-5 text-sm text-muted-foreground">No credentials yet.</p>
      )}
    </div>
  );
}

async function MessagesTab({ id, email }: { id: string; email: string }) {
  const admin = createAdminClient();
  const [mails, notes, inbound] = await Promise.all([
    admin.from("email_sends").select("id, subject, status, template_id, created_at, opened_at").ilike("recipient", email).order("created_at", { ascending: false }).limit(50),
    admin.from("notifications").select("id, title, type, created_at, read_at").eq("user_id", id).order("created_at", { ascending: false }).limit(50),
    admin.from("email_inbound").select("id, subject, received_at").ilike("from_email", email).order("received_at", { ascending: false }).limit(20),
  ]);
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border-2 border-foreground bg-card p-4">
        <h2 className="flex items-center gap-2 font-bold"><Mail className="size-4" aria-hidden /> Emails to them</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {(mails.data ?? []).length ? (mails.data ?? []).map((m) => (
            <li key={m.id as string} className="flex items-center justify-between gap-3 border-b border-foreground/10 pb-2">
              <Link href={`/admin/emails?folder=${m.status === "failed" ? "failed" : "sent"}&id=${m.id}`} className="min-w-0 truncate font-semibold hover:underline">{String(m.subject)}</Link>
              <span className={cn("shrink-0 text-caption", m.status === "failed" ? "font-bold text-status-alert-fg" : "text-muted-foreground")}>{m.status === "failed" ? "Failed" : m.opened_at ? "Opened" : "Sent"} · {when(m.created_at as string)}</span>
            </li>
          )) : <li className="text-muted-foreground">None.</li>}
        </ul>
        {(inbound.data ?? []).length ? (
          <>
            <h3 className="mt-4 text-small font-bold">Their replies</h3>
            <ul className="mt-2 space-y-1 text-sm">
              {(inbound.data ?? []).map((m) => (
                <li key={m.id as string}><Link href={`/admin/emails?folder=inbox&id=${m.id}`} className="font-semibold hover:underline">{String(m.subject ?? "(no subject)")}</Link> <span className="text-caption text-muted-foreground">· {when(m.received_at as string)}</span></li>
              ))}
            </ul>
          </>
        ) : null}
        <Link href={`/admin/people/${personKey(email)}`} className="mt-3 inline-flex font-bold text-link underline">Pipeline record (calls, WhatsApp, notes)</Link>
      </section>
      <section className="rounded-2xl border-2 border-foreground bg-card p-4">
        <h2 className="flex items-center gap-2 font-bold"><MessageSquare className="size-4" aria-hidden /> Notifications</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {(notes.data ?? []).length ? (notes.data ?? []).map((n) => (
            <li key={n.id as string} className="flex items-center justify-between gap-3 border-b border-foreground/10 pb-2">
              <span className="min-w-0 truncate font-semibold">{String(n.title)}</span>
              <span className="shrink-0 text-caption text-muted-foreground">{n.read_at ? "Opened" : "Not opened"} · {when(n.created_at as string)}</span>
            </li>
          )) : <li className="text-muted-foreground">None.</li>}
        </ul>
      </section>
    </div>
  );
}
