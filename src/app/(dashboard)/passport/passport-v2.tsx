"use client";

import * as React from "react";
import { BadgeCheck, ChevronRight, Download } from "lucide-react";
import { MobileBottomSheet } from "@/components/mobile/mobile-bottom-sheet";
import { formatDateIST } from "@/lib/format";
import { PageFrame, Section } from "@/components/ds";
import { EmptyLine, quietButton, StatItem, StatRow, StatusWord } from "@/components/v2me/parts";
import type { PassportRow } from "./passport";

const SOURCE_LABEL: Record<string, string> = {
  sim: "Patient interview",
  sct: "Judgment",
  formulation: "Formulation",
  mse: "MSE",
  osce: "OSCE",
  rounds: "Rounds",
  supervision: "Supervision",
  manual: "Added by faculty",
};

function hoursOf(e: PassportRow["events"][number]): number {
  const h = Number(e.evidence?.hours ?? 0);
  return Number.isFinite(h) ? h : 0;
}

/**
 * Skills passport (new design). One purpose: which skills you have shown.
 * Numbers in one row, then each skill as a row; a skill with evidence opens
 * a sheet listing it. With no skills set up yet the page says so instead of
 * showing "0/0".
 */
export function PassportV2({ rows }: { rows: PassportRow[] }) {
  const evid = rows.reduce((a, r) => a + r.events.length, 0);
  const hours = rows.reduce((a, r) => a + r.events.reduce((x, e) => x + hoursOf(e), 0), 0);
  const done = rows.filter((r) => r.events.length > 0).length;
  const [open, setOpen] = React.useState<PassportRow | null>(null);

  return (
    <PageFrame
      title="Skills passport"
      actions={
        evid > 0 ? (
          <a href="/api/practice/passport/pdf" className={quietButton}>
            <Download aria-hidden /> <span className="sr-only sm:not-sr-only">Download </span>PDF
          </a>
        ) : undefined
      }
    >
      {rows.length === 0 ? (
        <EmptyLine title="Your passport is not set up yet">The skills list is added by your faculty. Once it is here, every practice session and supervision hour you finish counts towards it.</EmptyLine>
      ) : (
        <>
          <StatRow label="Your passport so far">
            <StatItem value={done} sub={`of ${rows.length}`} label="Skills shown" />
            <StatItem value={hours % 1 === 0 ? hours : hours.toFixed(1)} sub="h" label="Supervision logged" />
            <StatItem value={evid} label="Pieces of evidence" />
          </StatRow>

          <Section id="skills" title="Skills">
            {evid === 0 ? (
              <p className="max-w-[60ch] type-small text-muted-foreground">Nothing logged yet. Finish a practice session or log a supervision hour and it shows against the skill it used.</p>
            ) : null}
            <ul className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
              {rows.map((r) => {
                const touched = r.events.length > 0;
                const body = (
                  <>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="type-body font-semibold [overflow-wrap:anywhere]">{r.name}</span>
                      {r.description ? <span className="type-small text-muted-foreground [overflow-wrap:anywhere]">{r.description}</span> : null}
                    </span>
                    {touched ? (
                      <StatusWord tone="good" icon={<BadgeCheck aria-hidden />}>
                        <span className="type-num">{r.events.length}</span>
                        <span className="sr-only"> pieces of evidence</span>
                      </StatusWord>
                    ) : (
                      <StatusWord>Open</StatusWord>
                    )}
                  </>
                );
                return (
                  <li key={r.key} className="min-w-0">
                    {touched ? (
                      <button
                        type="button"
                        aria-haspopup="dialog"
                        onClick={() => setOpen(r)}
                        className="group/row -mx-2 flex min-h-14 w-[calc(100%+1rem)] min-w-0 cursor-pointer items-center gap-4 rounded-lg px-2 py-2 text-left outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring active:bg-[var(--ds-tint)]"
                      >
                        {body}
                        <ChevronRight aria-hidden className="size-5 shrink-0 text-muted-foreground" />
                      </button>
                    ) : (
                      <div className="flex min-h-14 min-w-0 items-center gap-4 py-2">{body}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </Section>
        </>
      )}

      <MobileBottomSheet
        open={open != null}
        onOpenChange={(o) => {
          if (!o) setOpen(null);
        }}
        title={open?.name}
        description="Newest first."
        className="mx-auto max-w-xl"
      >
        {open ? (
          <ul className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)]">
            {open.events.map((e) => (
              <li key={e.id} className="flex min-h-12 min-w-0 items-center justify-between gap-4 py-2">
                <span className="min-w-0 type-body font-semibold [overflow-wrap:anywhere]">
                  {SOURCE_LABEL[e.source] ?? e.source}
                  {hoursOf(e) > 0 ? <span className="type-small font-medium text-muted-foreground type-num"> · {hoursOf(e)} h</span> : null}
                </span>
                <time dateTime={e.createdAt} className="shrink-0 type-small text-muted-foreground type-num">
                  {formatDateIST(e.createdAt)}
                </time>
              </li>
            ))}
          </ul>
        ) : null}
      </MobileBottomSheet>
    </PageFrame>
  );
}
