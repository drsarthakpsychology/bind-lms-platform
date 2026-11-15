"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { ManualAwardReport } from "@/lib/achievements/manual-award";
import { btn, Empty, More, Notice } from "../../_v2/kit";
import { awardAllBadges } from "../../achievements/actions";
import { awardBadge } from "../actions";
import { RemoveButton, ResultList, Step, StudentFinder, type PickCohort, type PickStudent } from "../_ui/parts";

export type BadgeOption = { id: string; title: string; icon: string | null; description: string | null; enabled: boolean; issued: number };

/**
 * Give a badge by hand: pick the badge, pick the people, give it. The rules
 * keep awarding badges on their own; "Check everyone" runs them now.
 */
export function BadgeIssue({ canWrite, badges, students, cohorts, initialBadge, initialPicked = [] }: { canWrite: boolean; badges: BadgeOption[]; students: PickStudent[]; cohorts: PickCohort[]; initialBadge?: string | null; initialPicked?: PickStudent[] }) {
  const [badgeId, setBadgeId] = React.useState<string | null>(badges.some((b) => b.id === initialBadge) ? (initialBadge as string) : null);
  const [picked, setPicked] = React.useState<PickStudent[]>(initialPicked);
  const [confirm, setConfirm] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [report, setReport] = React.useState<ManualAwardReport | null>(null);
  const [checking, setChecking] = React.useState(false);
  const [checkNote, setCheckNote] = React.useState<string | null>(null);
  const pickedIds = React.useMemo(() => new Set(picked.map((p) => p.id)), [picked]);
  const badge = badges.find((b) => b.id === badgeId) ?? null;
  const n = picked.length;

  async function give() {
    if (!badge) return;
    setBusy(true);
    const r = await awardBadge(badge.id, picked.map((p) => p.id)).catch(() => ({ error: "Couldn't reach the server. Look in Issued before trying again.", awarded: [], skipped: [] }) as ManualAwardReport);
    setBusy(false);
    setConfirm(false);
    setReport(r);
    if (!r.error) setPicked([]);
  }

  if (report && !report.error) {
    return (
      <div className="flex max-w-2xl min-w-0 flex-col gap-6" role="status">
        <div>
          <h2 className="type-h2">
            {report.awarded.length} badge{report.awarded.length === 1 ? "" : "s"} given
          </h2>
          <p className="mt-2 type-small text-muted-foreground">Each one has a notification in the app.</p>
        </div>
        <ResultList rows={[...(report.awarded.length ? [{ label: "Given", names: report.awarded.map((a) => a.name) }] : []), ...(report.skipped.length ? [{ label: "Skipped", names: report.skipped.map((s) => `${s.name} (${s.reason})`) }] : [])]} />
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/credentials/issued?type=badge" className={btn.primary}>See badges given</Link>
          <button type="button" className={btn.quiet} onClick={() => setReport(null)}>Give another</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-[var(--ds-7)]">
      {report?.error ? <Notice tone="alert">{report.error}</Notice> : null}
      <div className="grid min-w-0 gap-[var(--ds-7)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
        <section aria-labelledby="bd-which" className="min-w-0">
          <Step n={1} id="bd-which">Badge</Step>
          {badges.length ? (
            <div role="radiogroup" aria-labelledby="bd-which" className="flex max-h-[28rem] flex-col divide-y divide-[var(--ds-hairline)] overflow-y-auto overscroll-contain border-y border-[var(--ds-hairline)]">
              {badges.map((b) => {
                const on = b.id === badgeId;
                return (
                  <button
                    key={b.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setBadgeId(b.id)}
                    className="-mx-2 flex min-h-14 w-[calc(100%+1rem)] items-center gap-3 rounded-md px-2 py-2.5 text-left outline-none transition-colors duration-[var(--ds-state)] hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className={cn("grid size-5 shrink-0 place-items-center rounded-full border-[1.5px] border-foreground", on && "border-link bg-link")} aria-hidden>
                      {on ? <span className="size-2 rounded-full bg-background" /> : null}
                    </span>
                    <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-md bg-[var(--ds-tint)] type-body">{b.icon || "★"}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block type-small font-semibold [overflow-wrap:anywhere]">{b.title}</span>
                      <span className="block type-caption text-muted-foreground [overflow-wrap:anywhere]">
                        {b.issued} given{b.enabled ? "" : " · rule off"}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <Empty>
              No badges yet. Make one in <Link href="/admin/credentials/types" className="font-semibold text-link underline underline-offset-4">Types</Link>.
            </Empty>
          )}
        </section>

        <section aria-labelledby="bd-people" className="min-w-0">
          <Step n={2} id="bd-people" hint={n ? `${n} picked` : undefined}>People</Step>
          <StudentFinder
            idPrefix="bd"
            students={students}
            cohorts={cohorts}
            pickedIds={pickedIds}
            onAdd={(s) => setPicked((p) => (p.some((x) => x.id === s.id) ? p : [...p, s]))}
            onAddCohort={(_id, members) => setPicked((p) => [...p, ...members.filter((m) => !p.some((x) => x.id === m.id))])}
          />
          {n ? (
            <ul className="mt-4 flex max-h-[18rem] flex-col divide-y divide-[var(--ds-hairline)] overflow-y-auto overscroll-contain border-y border-[var(--ds-hairline)]">
              {picked.map((p) => (
                <li key={p.id} className="flex min-w-0 items-center gap-2 py-1.5">
                  <span className="min-w-0 flex-1">
                    <span className="block type-small font-semibold [overflow-wrap:anywhere]">{p.name}</span>
                    <span className="block type-caption text-muted-foreground [overflow-wrap:anywhere]">{p.roll ?? "No roll number"}</span>
                  </span>
                  <RemoveButton name={p.name} onClick={() => setPicked((l) => l.filter((x) => x.id !== p.id))} />
                </li>
              ))}
            </ul>
          ) : null}

          {canWrite ? (
            <button type="button" className={cn(btn.primary, "mt-6 w-full lg:h-11")} disabled={!badge || !n || busy} onClick={() => setConfirm(true)}>
              {badge && n ? `Give "${badge.title}" to ${n}` : "Give the badge"}
            </button>
          ) : (
            <p className="mt-6 type-small text-muted-foreground">Only the Super Admin can give badges.</p>
          )}
        </section>
      </div>

      {canWrite ? (
        <More summary="Check everyone for badges they have earned">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <button
              type="button"
              className={btn.quiet}
              disabled={checking}
              onClick={async () => {
                setChecking(true);
                const r = await awardAllBadges().catch(() => ({ error: "Couldn't reach the server.", awarded: 0, skipped: 0 }));
                setChecking(false);
                setCheckNote(r.error ? r.error : `${r.awarded} new badge${r.awarded === 1 ? "" : "s"} given.`);
              }}
            >
              {checking ? <Loader2 className="animate-spin" aria-hidden /> : null} Check now
            </button>
            {checkNote ? <span className="type-small text-muted-foreground" role="status">{checkNote}</span> : null}
          </div>
        </More>
      ) : null}

      <Dialog open={confirm} onOpenChange={(o) => !busy && setConfirm(o)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Give this badge to {n}?</DialogTitle>
            <DialogDescription>{badge?.title}. Each one gets a notification in the app. Anyone who already has it is skipped.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button type="button" className={btn.quiet} disabled={busy} onClick={() => setConfirm(false)}>Not yet</button>
            <button type="button" className={btn.primary} disabled={busy} onClick={() => void give()}>
              {busy ? <Loader2 className="animate-spin" aria-hidden /> : null} Give
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
