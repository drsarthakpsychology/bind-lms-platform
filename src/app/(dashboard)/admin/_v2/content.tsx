import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { AdminPage, Block, Empty, Figures, Notice, RowItem, RowLink, Rows, Status, link, nameLink, table, type Tone } from "./kit";

/* ---------------------------------------------------------------- */
/* What's live                                                       */
/* ---------------------------------------------------------------- */

/**
 * What's live (v2). One purpose: choose what students see. Three numbers in a
 * line, then each group as plain rows: name and one line on the left, the
 * three-way switch on the right (under the text on phones).
 */
export function FlagsV2({ counts, canWrite, groups }: { counts: Record<string, number>; canWrite: boolean; groups: { title: string; items: React.ReactNode[] }[] }) {
  return (
    <AdminPage title="What's live" lead="Hidden is not shown. Live is shown but locked. Unlock is open to students.">
      <Figures
        items={[
          { value: counts.unlocked ?? 0, label: "open to students" },
          { value: counts.live ?? 0, label: "shown as coming soon" },
          { value: counts.off ?? 0, label: "hidden" },
        ]}
      />
      {!canWrite ? <Notice>View Admins can see these switches but not change them.</Notice> : null}
      {groups.map((g) =>
        g.items.length ? (
          <Block key={g.title} title={g.title}>
            <Rows>{g.items}</Rows>
          </Block>
        ) : null,
      )}
      <p className="type-small text-muted-foreground">
        Rounds (flash cards) is retired. Its card review queue is still at{" "}
        <Link href="/admin/cards" className={link}>
          Rounds cards
        </Link>
        .
      </p>
    </AdminPage>
  );
}

/* ---------------------------------------------------------------- */
/* Medicines                                                         */
/* ---------------------------------------------------------------- */

export type MedicineRowV2 = { id: string; name: string; drugClass: string | null; summary: string | null; status: { label: string; tone: Tone }; href: string };

/** Medicines (v2). One purpose: open a medicine page to edit and publish it. */
export function MedicinesV2({ total, rows, filter, filtering }: { total: number; rows: MedicineRowV2[]; filter: React.ReactNode; filtering: boolean }) {
  return (
    <AdminPage title="Medicines" lead={`${filtering ? `${rows.length} of ${total} shown` : `${total} medicines`}. Changes stay drafts until you publish them.`}>
      {filter}
      {rows.length ? (
        <>
          <table className={cn(table.root, "hidden md:table")}>
            <thead>
              <tr>
                <th scope="col" className={cn(table.th, "w-[22%]")}>Medicine</th>
                <th scope="col" className={cn(table.th, "w-[20%]")}>Class</th>
                <th scope="col" className={table.th}>Student summary</th>
                <th scope="col" className={table.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((d) => (
                <tr key={d.id} className={table.tr}>
                  <td className={table.td}><Link href={d.href} prefetch={false} className={nameLink}>{d.name}</Link></td>
                  <td className={cn(table.td, "text-muted-foreground [overflow-wrap:anywhere]")}>{d.drugClass ?? "Not set"}</td>
                  <td className={cn(table.td, "[overflow-wrap:anywhere]", !d.summary && "text-muted-foreground")}>{d.summary ?? "No student summary yet"}</td>
                  <td className={cn(table.td, "whitespace-nowrap")}><Status tone={d.status.tone}>{d.status.label}</Status></td>
                </tr>
              ))}
            </tbody>
          </table>
          <Rows className="md:hidden">
            {rows.map((d) => (
              <RowLink key={d.id} href={d.href} title={d.name} meta={d.drugClass ?? "Class not set"} end={<Status tone={d.status.tone}>{d.status.label}</Status>} />
            ))}
          </Rows>
        </>
      ) : (
        <Empty>No medicines match these filters.</Empty>
      )}
    </AdminPage>
  );
}

/** One review queue of the medicine database (fields, dose bands, dose ranges). */
export function MedicineQueueV2({ title, rows }: { title: string; rows: { id: string; value: string; meta: string; actions: React.ReactNode }[] }) {
  return (
    <AdminPage title={title} lead={`${rows.length} rows in the queue. Each action is written to the audit log.`} back={{ href: "/admin/psychopharm-review", label: "Medicines" }}>
      {rows.length ? (
        <Rows>
          {rows.map((r) => (
            <RowItem key={r.id}>
              <p className="type-body font-semibold [overflow-wrap:anywhere]">{r.value}</p>
              <p className="type-small text-muted-foreground">{r.meta}</p>
              {r.actions}
            </RowItem>
          ))}
        </Rows>
      ) : (
        <Empty>The queue is empty.</Empty>
      )}
    </AdminPage>
  );
}
