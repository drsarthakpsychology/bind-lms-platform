"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, RotateCcw } from "lucide-react";
import { emptyState, istToday, recordLabCheck, recordLabRun, type LearnState } from "@/lib/learn/engine";
import { getLearnState, initLearnStore, setLearnState, useLearnState } from "@/lib/learn/store";
import { FORMAT_LABEL, type CaseActivity } from "@/lib/casebook/types";
import { nextTier, TIER_LABEL, type Tier } from "@/lib/casebook/rounds";
import { caseKey } from "@/content/casebook";
import { Bars, LabButton, Panel } from "@/components/lab/lab-ui";
import { CasePlayer } from "./case-player";
import { backLinkClass } from "@/components/design-system/back-link";

const EMPTY = emptyState();

type Props = { activity: CaseActivity; moduleTitle: string; serverState: LearnState | null; save: (s: LearnState) => Promise<unknown>; isAdmin: boolean };

/** /games/lab/cases/[id]: intro, play, score. Scores feed the same spaced re-check as the Lab. */
export function CaseView({ activity: a, moduleTitle, serverState, save, isAdmin }: Props) {
  initLearnStore(serverState, save);
  const st = useLearnState(serverState ?? EMPTY);
  const rec = st.lab[caseKey(a.id)];
  const tier = nextTier(rec ? (rec.result as { right: number; total: number; tier?: number }) : null);
  const [round, setRound] = React.useState(0);
  const [score, setScore] = React.useState<{ right: number; total: number; next: Tier } | null>(null);

  function done(right: number, total: number) {
    const cur = getLearnState() ?? st;
    const key = caseKey(a.id);
    const ran = recordLabRun(cur, key, { right, total, tier }, istToday());
    setLearnState(recordLabCheck(ran, key, right, total, istToday()));
    setScore({ right, total, next: nextTier({ right, total, tier }) });
  }

  return (
    <div className="mx-auto w-full min-w-0 max-w-3xl space-y-6">
      <Link href="/games/lab" className={backLinkClass}>
        <ArrowLeft className="size-4" aria-hidden /> Lab
      </Link>
      <header className="space-y-2">
        <p className="text-eyebrow text-link">
          Casebook · {FORMAT_LABEL[a.format]} · {a.level}
        </p>
        <h1 className="text-h1">{a.title}</h1>
        <p className="text-lg">{a.objective}</p>
        {rec && (
          <p className="text-sm text-muted-foreground">
            Last score {rec.result.right} of {rec.result.total} · played {rec.runs} time{rec.runs === 1 ? "" : "s"}
          </p>
        )}
      </header>

      {/* Sourcing and review notes are for admins only; students see the teaching. */}
      {isAdmin && (
        <aside className="rounded-2xl border-2 border-dashed border-foreground p-4 text-sm">
          <p className="font-bold">Admins only</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {a.reviewFlags.map((r) => (
              <li key={r}>{r}</li>
            ))}
            <li>
              Built from: {a.bookRef.book}, {a.bookRef.chapter}, pp. {a.bookRef.pages}. Cases are fictional; wording is original.
            </li>
          </ul>
        </aside>
      )}

      {score ? (
        <Panel className="space-y-4">
          <h2 className="text-h2">
            {score.right} of {score.total}
          </h2>
          <Bars ariaLabel="Your score" items={[{ label: "Right", value: score.right, highlight: true }, { label: "Total", value: score.total }]} />
          {a.debrief && <p className="rounded-xl border-2 border-foreground bg-background p-3">{a.debrief}</p>}
          <p>{score.right * 3 >= score.total * 2 ? "Solid. It comes back in a few days." : "Worth another go. It comes back sooner."}</p>
          <p className="text-sm font-semibold">Next round: {TIER_LABEL[score.next]}</p>
          <div className="flex flex-wrap gap-2">
            <LabButton
              tone="plain"
              onClick={() => {
                setScore(null);
                setRound((r) => r + 1);
              }}
            >
              <RotateCcw className="size-4" aria-hidden /> Play again
            </LabButton>
            <Link href={`/study/${a.module}`} className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-foreground bg-card px-5 py-2 text-sm font-bold">
              <BookOpen className="size-4" aria-hidden /> Read: {moduleTitle}
            </Link>
          </div>
        </Panel>
      ) : (
        <CasePlayer key={round} activity={a} tier={tier} onDone={done} />
      )}

      <p className="text-xs text-muted-foreground">Cases are fictional.</p>
    </div>
  );
}
