"use client";

import { Flame, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { MIN_TAGS, type AccuracyRow } from "../boards";
import { Panel } from "./kit";

export type AccuracyBoardData = { ranked: AccuracyRow[]; mine: AccuracyRow | null; live: boolean };

/** Cohort accuracy board (this week). Shows the top 10 and always your own row. */
export function AccuracyBoard({ data, unit = "tags" }: { data: AccuracyBoardData; unit?: string }) {
  if (!data.live) return <p className="text-small text-muted-foreground">The cohort board isn&apos;t switched on yet. Your scores still count towards your progress.</p>;
  const top = data.ranked.slice(0, 10);
  const mine = data.mine;
  const showMine = mine && !top.some((r) => r.me);
  return (
    <Panel className="p-0">
      <div className="flex items-center gap-2 border-b-2 border-foreground px-4 py-2.5">
        <Trophy className="size-4" aria-hidden />
        <h2 className="text-body-strong">Cohort accuracy, this week</h2>
      </div>
      {top.length === 0 ? (
        <p className="px-4 py-3 text-small text-muted-foreground">No one is ranked yet. Answer {MIN_TAGS} {unit} this week to get on the board.</p>
      ) : (
        <ol className="divide-y-2 divide-foreground/10">
          {top.map((r) => (
            <Row key={r.userId} r={r} />
          ))}
        </ol>
      )}
      {showMine ? (
        <div className="border-t-2 border-foreground">
          {mine.rank ? (
            <ol>
              <Row r={mine} />
            </ol>
          ) : (
            <p className="px-4 py-2.5 text-small">
              You: {mine.accuracy}% over {mine.tags} {unit}. {Math.max(0, MIN_TAGS - mine.tags)} more to be ranked.
            </p>
          )}
        </div>
      ) : null}
    </Panel>
  );
}

function Row({ r }: { r: AccuracyRow }) {
  return (
    <li className={cn("flex items-center gap-3 px-4 py-2", r.me && "bg-status-success-bg")}>
      <span className="w-6 font-pix tabular-nums">{r.rank || "–"}</span>
      <span className="min-w-0 flex-1 truncate font-semibold">
        {r.name}
        {r.me ? <span className="ml-1 text-caption">(you)</span> : null}
      </span>
      <span className="flex items-center gap-1 text-caption" title="Best streak">
        <Flame className="size-3.5" aria-hidden />
        <span className="sr-only">Best streak</span>
        {r.bestStreak}
      </span>
      <span className="w-12 text-right font-pix tabular-nums">{r.accuracy}%</span>
    </li>
  );
}
