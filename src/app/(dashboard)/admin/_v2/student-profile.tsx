import * as React from "react";
import Link from "next/link";
import { CheckCircle2, Circle, ShieldAlert } from "lucide-react";

import { cn } from "@/lib/utils";
import { AdminPage, Block, Empty, Facts, Figures, Meter, Status, Tag, ViewTabs, btn, link, table, type Tone } from "./kit";

/**
 * Student profile (v2). One person, one page: who they are and the one next
 * step at the top, facts in a narrow side column on desktop, and tabs for the
 * deep detail. Presentational only: the page loads the data and passes the
 * same action components (action rail, login, lock, reply) it always used.
 */

export type ProfileHead = {
  id: string;
  name: string;
  roll: string | null;
  email: string;
  mobile: string | null;
  status: { label: string; tone: Tone } | null;
  scopeLabel: string;
  cohorts: { id: string; name: string }[];
  lastSeen: string;
  onNow: boolean;
  lecturesDone: number;
  lecturesAvailable: number;
  progressPct: number;
  flags: string[];
  isTest: boolean;
  next: { label: string; why: string };
  nextAction?: React.ReactNode;
  actions?: React.ReactNode;
};

export function StudentProfileV2({ head, tabs, tab, children }: { head: ProfileHead; tabs: readonly { id: string; label: string }[]; tab: string; children: React.ReactNode }) {
  const p = head;
  return (
    <AdminPage
      back={{ href: "/admin/students", label: "Students" }}
      title={p.name}
      lead={
        <>
          <span className="type-num font-semibold text-foreground">{p.roll ?? "No roll number"}</span>
          {" · "}
          {p.email}
          {" · "}
          {p.mobile ? (
            <a className={link} href={`https://wa.me/91${p.mobile}`} target="_blank" rel="noopener noreferrer">
              WhatsApp +91 {p.mobile}
            </a>
          ) : (
            "No mobile"
          )}
        </>
      }
    >
      <div className="-mt-2 flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2">
        {p.status ? <Status tone={p.status.tone}>{p.status.label}</Status> : null}
        <Status tone={p.onNow ? "ok" : "quiet"}>{p.onNow ? "On VIBHA now" : `Last seen ${p.lastSeen === "Never" ? "never" : p.lastSeen}`}</Status>
        <span className="type-small text-muted-foreground">{p.scopeLabel}</span>
        <span className="flex min-w-0 flex-wrap gap-1">
          {p.cohorts.length ? (
            p.cohorts.map((c) => (
              <Link key={c.id} href={`/admin/cohorts/${c.id}`} className="inline-flex min-h-11 items-center rounded outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring lg:min-h-0">
                <Tag>{c.name}</Tag>
              </Link>
            ))
          ) : (
            <Tag>No cohort</Tag>
          )}
          {p.isTest ? <span className="inline-flex items-center"><Tag tone="warn">Test account</Tag></span> : null}
          {p.flags.map((f) => (
            <span key={f} className="inline-flex items-center"><Tag tone="warn">{f}</Tag></span>
          ))}
        </span>
      </div>

      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex min-w-0 flex-col gap-3 rounded-[var(--ds-radius)] bg-[var(--ds-tint)] p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="min-w-0 type-small [overflow-wrap:anywhere]">
            <span className="font-bold">Next: {p.next.label}.</span> <span className="text-muted-foreground">{p.next.why}</span>
          </p>
          {p.nextAction ? <div className="shrink-0">{p.nextAction}</div> : null}
        </div>
        {p.actions}
      </div>

      <ViewTabs label="Student sections" current={tab} tabs={tabs.map((t) => ({ id: t.id, label: t.label, href: `/admin/students/${p.id}?tab=${t.id}` }))} />
      {children}
    </AdminPage>
  );
}

/** Main column plus a narrow facts column on the right (under it on phones). */
function Split({ main, side }: { main: React.ReactNode; side: React.ReactNode }) {
  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-[var(--ds-6)] lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-[var(--ds-7)]">
      <div className="flex min-w-0 flex-col gap-[var(--ds-6)]">{main}</div>
      <aside className="flex min-w-0 flex-col gap-[var(--ds-6)]">{side}</aside>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Overview                                                          */
/* ---------------------------------------------------------------- */

export type DoubtRow = {
  id: string;
  title: string;
  complaint: boolean;
  statusLabel: string;
  statusTone: Tone;
  when: string;
  quote?: string | null;
  quoteIsReply?: boolean;
  /** The inline reply box, when the doubt is waiting for an answer. */
  reply?: React.ReactNode;
};

export function OverviewV2({
  doubts,
  progress,
  week,
  month,
  xp,
  details,
}: {
  doubts: DoubtRow[];
  progress: { done: number; available: number; pct: number };
  week: string;
  month: string;
  xp: number;
  details: { label: string; value: string }[] | null;
}) {
  return (
    <Split
      main={
        <Block id="doubts" title="Their doubts" count={doubts.length || undefined}>
          {doubts.length ? (
            <ul className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
              {doubts.map((d) => (
                <li key={d.id} className="flex min-w-0 flex-col gap-2 py-3">
                  <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
                    {d.complaint ? <ShieldAlert className="size-4 shrink-0 text-status-alert-fg" aria-hidden /> : null}
                    <Link href={`/doubts/${d.id}`} className="inline-flex min-h-11 min-w-0 items-center lg:min-h-0 type-body font-semibold underline-offset-4 outline-none hover:underline focus-visible:underline [overflow-wrap:anywhere]">
                      {d.title}
                    </Link>
                    <Status tone={d.statusTone}>{d.statusLabel}</Status>
                    <span className="type-small text-muted-foreground">
                      {d.complaint ? "Private concern · " : ""}
                      {d.when}
                    </span>
                  </div>
                  {d.quote ? (
                    <p title={d.quote} className={cn("line-clamp-3 type-small whitespace-pre-line [overflow-wrap:anywhere]", d.quoteIsReply ? "border-l-2 border-link pl-3" : "text-muted-foreground")}>{d.quote}</p>
                  ) : null}
                  {d.reply}
                </li>
              ))}
            </ul>
          ) : (
            <Empty>No doubts asked yet.</Empty>
          )}
        </Block>
      }
      side={
        <>
          <Block title="Progress">
            <div className="flex min-w-0 flex-col gap-3">
              {progress.available ? <Meter pct={progress.pct} label={`${progress.done} of ${progress.available} lectures`} /> : <p className="type-small text-muted-foreground">No lectures open yet.</p>}
              <Figures
                items={[
                  { value: week, label: "this week" },
                  { value: month, label: "in 30 days" },
                  { value: xp, label: "XP in Notes & Games" },
                ]}
              />
            </div>
          </Block>
          <Block title="Their details">
            {details ? <Facts items={details} /> : <Empty>Not filled yet. They&apos;ll be asked the next time they open VIBHA.</Empty>}
          </Block>
        </>
      }
    />
  );
}

/* ---------------------------------------------------------------- */
/* Access & login                                                    */
/* ---------------------------------------------------------------- */

export function AccessV2({
  access,
  status,
  statusNext,
  loginControls,
  switchesHref,
}: {
  /** The access editor (cohorts, scope, lectures), or the view-only note. */
  access: React.ReactNode;
  status: { label: string; tone: Tone } | null;
  statusNext?: string | null;
  loginControls?: React.ReactNode;
  switchesHref: string;
}) {
  return (
    <Split
      main={access}
      side={
        <>
          <Block title="Login">
            <div className="flex min-w-0 flex-col gap-3">
              {status ? (
                <p className="type-small">
                  <Status tone={status.tone}>{status.label}</Status>
                  {statusNext ? <span className="mt-1 block text-muted-foreground">{statusNext}</span> : null}
                </p>
              ) : null}
              {loginControls ? <div className="flex min-w-0 flex-wrap items-center gap-2">{loginControls}</div> : null}
              <p className="type-small text-muted-foreground">Lock = can&apos;t sign in until unlocked. A new login link replaces older ones.</p>
            </div>
          </Block>
          <Block title="Switch sections off">
            <p className="type-small text-muted-foreground">Hide Notes, Games, a practice tool and so on for this student, or reset their progress.</p>
            <Link href={switchesHref} className={cn(btn.quiet, "self-start")}>
              Open section switches
            </Link>
          </Block>
        </>
      }
    />
  );
}

/* ---------------------------------------------------------------- */
/* Activity                                                          */
/* ---------------------------------------------------------------- */

export type TimelineRow = { text: string; when: string; detail?: string | null; alert?: boolean };
export type LectureRow = { id: string; title: string; week?: number | null; done: boolean; watched: string | null };

export function ActivityV2({
  figures,
  daily,
  events,
  lectures,
  learn,
}: {
  figures: { value: React.ReactNode; label: string }[];
  daily: { day: string; min: number }[];
  events: TimelineRow[];
  lectures: LectureRow[];
  learn?: { line: string; confusions?: string | null } | null;
}) {
  const maxDay = Math.max(10, ...daily.map((x) => x.min));
  return (
    <div className="flex min-w-0 flex-col gap-[var(--ds-6)]">
      <Figures items={figures} />

      <Block title="Minutes per day" action={<span className="text-muted-foreground">Last 30 days</span>}>
        <div className="flex h-28 min-w-0 items-end gap-[3px] border-b border-[var(--ds-hairline)]" role="img" aria-label={`Minutes per day for the last 30 days. Most in one day: ${Math.max(0, ...daily.map((x) => x.min))} minutes.`}>
          {daily.map((x) => (
            <div key={x.day} className="flex h-full min-w-0 flex-1 flex-col justify-end" title={`${x.day}: ${x.min} min`}>
              <div className={cn("w-full rounded-t-[2px]", x.min ? "bg-link" : "bg-[var(--ds-hairline)]")} style={{ height: `${Math.max(x.min ? 4 : 1, (x.min / maxDay) * 100)}%` }} />
            </div>
          ))}
        </div>
        {daily.length ? (
          <div className="flex justify-between type-caption text-muted-foreground type-num">
            <span>{daily[0].day.slice(5)}</span>
            <span>Today</span>
          </div>
        ) : null}
      </Block>

      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-[var(--ds-6)] lg:grid-cols-2 lg:gap-[var(--ds-7)]">
        <Block title="Timeline" action={<span className="text-muted-foreground">Newest first</span>}>
          {events.length ? (
            <ol className="flex max-h-[34rem] min-w-0 flex-col divide-y divide-[var(--ds-hairline)] overflow-y-auto border-y border-[var(--ds-hairline)]" tabIndex={0} aria-label="Timeline, last 30 days" data-layout-ok="overlap">
              {events.map((e, k) => (
                <li key={k} className="flex min-w-0 flex-col gap-0.5 py-2.5">
                  <span className={cn("type-small font-semibold [overflow-wrap:anywhere]", e.alert && "text-status-alert-fg")}>{e.text}</span>
                  <span className="type-caption font-medium text-muted-foreground [overflow-wrap:anywhere]">
                    {e.when}
                    {e.detail ? ` · ${e.detail}` : ""}
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <Empty>Nothing in the last 30 days.</Empty>
          )}
        </Block>
        <Block title="Lectures">
          {lectures.length ? (
            <ul className="flex max-h-[34rem] min-w-0 flex-col divide-y divide-[var(--ds-hairline)] overflow-y-auto border-y border-[var(--ds-hairline)]" tabIndex={0} aria-label="Lectures" data-layout-ok="overlap">
              {lectures.map((l) => (
                <li key={l.id} className="flex min-w-0 items-start gap-2 py-2.5 type-small">
                  {l.done ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-link" aria-label="Finished" /> : <Circle className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-label="Not finished" />}
                  <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">
                    {l.week ? <span className="text-muted-foreground">Week {l.week} · </span> : null}
                    {l.title}
                  </span>
                  <span className={cn("shrink-0 type-num", !l.watched && "text-muted-foreground")}>{l.watched ?? "Not opened"}</span>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>No lectures open for this student yet.</Empty>
          )}
        </Block>
      </div>

      {learn ? (
        <Block title="Notes & Games">
          <p className="type-small [overflow-wrap:anywhere]">{learn.line}</p>
          {learn.confusions ? <p className="type-small text-muted-foreground [overflow-wrap:anywhere]">Mixes up: {learn.confusions}</p> : null}
        </Block>
      ) : null}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Credentials                                                       */
/* ---------------------------------------------------------------- */

export type CredentialRow = { id: string; title: string; kind: string; code: string; issued: string; revoked: boolean; statusLabel: string };

export function CredentialsV2({ rows, manageHref, notReady }: { rows: CredentialRow[]; manageHref: string; notReady: boolean }) {
  return (
    <Block
      title="Credentials"
      count={rows.length || undefined}
      action={
        <Link href={manageHref} className={link}>
          Manage or issue a certificate
        </Link>
      }
    >
      {notReady ? (
        <Empty>Credentials aren&apos;t set up in the database yet.</Empty>
      ) : rows.length ? (
        <>
          <table className={cn(table.root, "hidden md:table")}>
            <thead>
              <tr>
                <th scope="col" className={table.th}>Credential</th>
                <th scope="col" className={table.th}>Type</th>
                <th scope="col" className={table.th}>Number</th>
                <th scope="col" className={table.th}>Issued</th>
                <th scope="col" className={table.th}>Status</th>
                <th scope="col" className={table.th}><span className="sr-only">Open</span></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} className={table.tr}>
                  <td className={cn(table.td, "font-semibold [overflow-wrap:anywhere]")}>{c.title}</td>
                  <td className={table.td}>{c.kind}</td>
                  <td className={cn(table.td, "type-num [overflow-wrap:anywhere]")}>{c.code}</td>
                  <td className={cn(table.td, "whitespace-nowrap")}>{c.issued}</td>
                  <td className={table.td}><Status tone={c.revoked ? "alert" : "ok"}>{c.statusLabel}</Status></td>
                  <td className={cn(table.td, "text-right")}>
                    <Link href={`/verify/${c.code}`} target="_blank" className={link}>Verify page</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ul className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)] md:hidden">
            {rows.map((c) => (
              <li key={c.id}>
                <Link href={`/verify/${c.code}`} target="_blank" className="-mx-2 flex min-h-14 min-w-0 flex-col justify-center gap-0.5 rounded-lg px-2 py-2 outline-none focus-visible:ring-2 focus-visible:ring-ring active:bg-[var(--ds-tint)]">
                  <span className="type-body font-semibold [overflow-wrap:anywhere]">{c.title}</span>
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-0.5 type-small text-muted-foreground">
                    <Status tone={c.revoked ? "alert" : "ok"}>{c.statusLabel}</Status>
                    <span className="[overflow-wrap:anywhere]">{c.kind} · {c.code} · {c.issued}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <Empty>No credentials yet.</Empty>
      )}
    </Block>
  );
}

/* ---------------------------------------------------------------- */
/* Messages                                                          */
/* ---------------------------------------------------------------- */

export type MailRow = { id: string; subject: string; href?: string; state: string; failed?: boolean; when: string };

function MailList({ rows, empty }: { rows: MailRow[]; empty: string }) {
  if (!rows.length) return <Empty>{empty}</Empty>;
  return (
    <ul className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
      {rows.map((m) => {
        const body = (
          <>
            <span className="min-w-0 flex-1 type-small font-semibold [overflow-wrap:anywhere]">{m.subject}</span>
            <span className={cn("shrink-0 text-right type-caption font-medium type-num", m.failed ? "font-bold text-status-alert-fg" : "text-muted-foreground")}>
              {m.state}
              <span className="block">{m.when}</span>
            </span>
          </>
        );
        return (
          <li key={m.id} className="min-w-0">
            {m.href ? (
              <Link href={m.href} className="-mx-2 flex min-h-12 min-w-0 items-center gap-3 rounded-lg px-2 py-2 outline-none hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring">
                {body}
              </Link>
            ) : (
              <div className="flex min-h-12 min-w-0 items-center gap-3 py-2">{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function MessagesV2({ mails, replies, notes, pipelineHref }: { mails: MailRow[]; replies: MailRow[]; notes: MailRow[]; pipelineHref: string }) {
  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-[var(--ds-6)] lg:grid-cols-2 lg:gap-[var(--ds-7)]">
      <div className="flex min-w-0 flex-col gap-[var(--ds-6)]">
        <Block title="Emails to them" count={mails.length || undefined}>
          <MailList rows={mails} empty="No emails sent to them yet." />
        </Block>
        {replies.length ? (
          <Block title="Their replies" count={replies.length}>
            <MailList rows={replies} empty="" />
          </Block>
        ) : null}
        <Link href={pipelineHref} className={cn(link, "inline-flex min-h-11 items-center type-small lg:min-h-0")}>
          Pipeline record (calls, WhatsApp, notes)
        </Link>
      </div>
      <Block title="Notifications" count={notes.length || undefined}>
        <MailList rows={notes} empty="No notifications sent to them yet." />
      </Block>
    </div>
  );
}
