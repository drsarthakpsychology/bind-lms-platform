import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { AdminPage, Block, Empty, Figures, Meter, More, Notice, RowItem, RowLink, Rows, Status, Tag, ViewTabs, btn, nameLink, table, type Tone } from "./kit";

const STATUS: Record<string, { label: string; tone: Tone }> = {
  upcoming: { label: "Upcoming", tone: "info" },
  active: { label: "Running", tone: "ok" },
  ended: { label: "Finished", tone: "quiet" },
};
export const cohortStatus = (s: string | null | undefined) => STATUS[s ?? ""] ?? STATUS.upcoming;

export type CohortRowV2 = { id: string; name: string; status: string; course: string | null; members: number; lectures: number; detailsPct: number; starts: string | null };

/**
 * Cohorts (v2). One purpose: pick a cohort. A table on desktop, rows on
 * phones; "New cohort" sits under the list, closed until it is needed.
 */
export function CohortsListV2({
  cohorts,
  unassigned,
  tablesMissing,
  newForm,
  canAdd = true,
}: {
  cohorts: CohortRowV2[];
  unassigned: number;
  tablesMissing?: boolean;
  newForm?: React.ReactNode;
  canAdd?: boolean;
}) {
  return (
    <AdminPage
      title="Cohorts"
      lead="Batches of students, and which lectures each batch can watch."
      actions={
        !tablesMissing && canAdd ? (
          <Link href="/admin/students/add" className={btn.primary}>
            Add people
          </Link>
        ) : undefined
      }
    >
      {tablesMissing ? (
        <Notice>
          <span>
            The cohort tables are not in the database yet. Run <code className="font-mono">2026_11_cohorts.sql</code> on Supabase, then reload this page.
          </span>
        </Notice>
      ) : (
        <>
          {unassigned ? (
            <Notice>
              <span>
                {unassigned} {unassigned === 1 ? "student is" : "students are"} not in any cohort yet. They keep the old access until you add them to one.
              </span>
            </Notice>
          ) : null}
          {cohorts.length ? (
            <>
              <table className={cn(table.root, "hidden md:table")}>
                <thead>
                  <tr>
                    <th scope="col" className={table.th}>Cohort</th>
                    <th scope="col" className={table.th}>Status</th>
                    <th scope="col" className={table.th}>Course</th>
                    <th scope="col" className={cn(table.th, "text-right")}>People</th>
                    <th scope="col" className={cn(table.th, "text-right")}>Lectures</th>
                    <th scope="col" className={cn(table.th, "w-[16%]")}>Details in</th>
                    <th scope="col" className={table.th}>Starts</th>
                  </tr>
                </thead>
                <tbody>
                  {cohorts.map((c) => (
                    <tr key={c.id} className={table.tr}>
                      <td className={table.td}>
                        <Link href={`/admin/cohorts/${c.id}`} className={nameLink}>{c.name}</Link>
                      </td>
                      <td className={table.td}><Status tone={cohortStatus(c.status).tone}>{cohortStatus(c.status).label}</Status></td>
                      <td className={cn(table.td, "text-muted-foreground [overflow-wrap:anywhere]")}>{c.course ?? "None"}</td>
                      <td className={cn(table.td, table.num)}>{c.members}</td>
                      <td className={cn(table.td, table.num)}>{c.lectures}</td>
                      <td className={table.td}><Meter pct={c.detailsPct} label={`${c.detailsPct}%`} /></td>
                      <td className={cn(table.td, "whitespace-nowrap text-muted-foreground")}>{c.starts ?? "No date"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Rows className="md:hidden">
                {cohorts.map((c) => (
                  <RowLink
                    key={c.id}
                    href={`/admin/cohorts/${c.id}`}
                    title={c.name}
                    meta={`${c.members} ${c.members === 1 ? "person" : "people"} · ${c.lectures} lectures${c.starts ? ` · starts ${c.starts}` : ""}`}
                    end={<Status tone={cohortStatus(c.status).tone}>{cohortStatus(c.status).label}</Status>}
                  />
                ))}
              </Rows>
            </>
          ) : (
            <Empty>No cohorts yet. Create the first one below.</Empty>
          )}
          {newForm ? (
            <More summary="New cohort" className="max-w-xl">
              {newForm}
            </More>
          ) : null}
        </>
      )}
    </AdminPage>
  );
}

/* ---------------------------------------------------------------- */
/* One cohort                                                        */
/* ---------------------------------------------------------------- */

export type CohortMemberV2 = {
  id: string;
  name: string;
  email: string;
  roll: string | null;
  account: { label: string; tone: Tone } | null;
  scope: string;
  detailsPending: boolean;
  actions?: React.ReactNode;
};
export type CohortProgressV2 = { id: string; name: string; meta: string; done: number; available: number; pct: number };

export function CohortDetailV2({
  id,
  name,
  status,
  lead,
  tabs,
  tab,
  actions,
  children,
}: {
  id: string;
  name: string;
  status: string | null;
  lead: string;
  tabs: { id: string; label: string; count?: number }[];
  tab: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <AdminPage
      title={name}
      back={{ href: "/admin/cohorts", label: "Cohorts" }}
      lead={
        <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
          <Status tone={cohortStatus(status).tone}>{cohortStatus(status).label}</Status>
          <span>· {lead}</span>
        </span>
      }
      actions={actions}
    >
      <ViewTabs label="Cohort sections" current={tab} tabs={tabs.map((t) => ({ id: t.id, label: t.label, href: `/admin/cohorts/${id}?tab=${t.id}`, count: t.count }))} />
      {children}
    </AdminPage>
  );
}

export function CohortOverviewV2({ figures, links }: { figures: { value: React.ReactNode; label: string; href?: string }[]; links: { href: string; label: string; primary?: boolean }[] }) {
  return (
    <>
      <Figures items={figures} />
      <Block title="Next">
        <Rows>
          {links.map((l) => (
            <RowLink key={l.href + l.label} href={l.href} title={l.label} />
          ))}
        </Rows>
      </Block>
    </>
  );
}

export function CohortMembersV2({ members, addForm, addLabel }: { members: CohortMemberV2[]; addForm?: React.ReactNode; addLabel?: string }) {
  return (
    <>
      {members.length ? (
        <>
          <table className={cn(table.root, "hidden md:table")}>
            <thead>
              <tr>
                <th scope="col" className={table.th}>Name</th>
                <th scope="col" className={table.th}>Roll no.</th>
                <th scope="col" className={table.th}>Account</th>
                <th scope="col" className={table.th}>Access</th>
                <th scope="col" className={table.th}><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className={table.tr}>
                  <td className={table.td}>
                    <Link href={`/admin/students/${m.id}`} className={nameLink}>{m.name}</Link>
                    <span className="block text-muted-foreground [overflow-wrap:anywhere]">{m.email}</span>
                  </td>
                  <td className={cn(table.td, "whitespace-nowrap type-num")}>{m.roll ?? <span className="text-muted-foreground">None</span>}</td>
                  <td className={table.td}>{m.account ? <Status tone={m.account.tone}>{m.account.label}</Status> : null}</td>
                  <td className={table.td}>
                    <span className="flex flex-wrap gap-1">
                      <Tag>{m.scope}</Tag>
                      {m.detailsPending ? <Tag tone="warn">Details pending</Tag> : null}
                    </span>
                  </td>
                  <td className={cn(table.td, "text-right")}>{m.actions}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Rows className="md:hidden">
            {members.map((m) => (
              <RowItem key={m.id}>
                <Link href={`/admin/students/${m.id}`} className={`${nameLink} flex min-h-11 flex-col justify-center type-body`}>
                  {m.name}
                  <span className="type-small font-normal text-muted-foreground">{m.roll ? `${m.roll} · ` : ""}{m.email}</span>
                </Link>
                <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  {m.account ? <Status tone={m.account.tone}>{m.account.label}</Status> : null}
                  <Tag>{m.scope}</Tag>
                  {m.detailsPending ? <Tag tone="warn">Details pending</Tag> : null}
                </span>
                {m.actions}
              </RowItem>
            ))}
          </Rows>
        </>
      ) : (
        <Empty>Nobody here yet.</Empty>
      )}
      {addForm ? <More summary={addLabel ?? "Add people"}>{addForm}</More> : null}
    </>
  );
}

export function CohortProgressListV2({ people }: { people: CohortProgressV2[] }) {
  if (!people.length) return <Empty>Nobody here yet.</Empty>;
  return (
    <>
      <table className={cn(table.root, "hidden md:table")}>
        <thead>
          <tr>
            <th scope="col" className={table.th}>Name</th>
            <th scope="col" className={table.th}>This week</th>
            <th scope="col" className={cn(table.th, "text-right")}>Lectures</th>
            <th scope="col" className={cn(table.th, "w-[28%]")}>Finished</th>
          </tr>
        </thead>
        <tbody>
          {people.map((p) => (
            <tr key={p.id} className={table.tr}>
              <td className={table.td}><Link href={`/admin/students/${p.id}?tab=activity`} className={nameLink}>{p.name}</Link></td>
              <td className={cn(table.td, "text-muted-foreground")}>{p.meta}</td>
              <td className={cn(table.td, table.num)}>{p.done}/{p.available}</td>
              <td className={table.td}><Meter pct={p.pct} label={`${p.pct}%`} tone={p.pct < 34 ? "warn" : "info"} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <Rows className="md:hidden">
        {people.map((p) => (
          <li key={p.id} className="min-w-0">
            <Link href={`/admin/students/${p.id}?tab=activity`} className="-mx-2 flex min-h-14 min-w-0 flex-col gap-1 rounded-lg px-2 py-3 outline-none hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring">
              <span className="type-body font-semibold [overflow-wrap:anywhere]">{p.name}</span>
              <Meter pct={p.pct} label={`${p.done}/${p.available}`} tone={p.pct < 34 ? "warn" : "info"} />
              <span className="type-small text-muted-foreground">{p.meta}</span>
            </Link>
          </li>
        ))}
      </Rows>
    </>
  );
}

export function CohortMessagesV2({ items }: { items: { href: string; title: string; meta: string }[] }) {
  return (
    <Rows>
      {items.map((i) => (
        <RowLink key={i.href} href={i.href} title={i.title} meta={i.meta} />
      ))}
    </Rows>
  );
}

export function CohortSettingsV2({ settings, calendar }: { settings: React.ReactNode; calendar: React.ReactNode }) {
  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] items-start gap-[var(--ds-6)] lg:grid-cols-2 lg:gap-[var(--ds-7)]">
      <Block title="Name, status and dates">{settings}</Block>
      <Block title="Session calendar">
        <p className="type-small text-muted-foreground">Make the whole session schedule from a start date and weekly pattern.</p>
        {calendar}
      </Block>
    </div>
  );
}


