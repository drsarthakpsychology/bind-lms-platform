"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, ChevronRight } from "lucide-react";

/**
 * Triage view — the ≤10 item queue + the auto-released count as a number,
 * not a backlog. Clicking an item opens the sim-review for that session.
 */
export function TriageView({
  needs,
  autoReleased,
  weakQuizItems = [],
}: {
  needs: Array<{ id: string; sessionId: string; overall: number; priority: number; premature: number }>;
  autoReleased: number;
  /** quiz items answered correctly by < 50% of attempts (low-confidence areas). */
  weakQuizItems?: Array<{ itemId: string; prompt?: string; correctPct: number; attempts: number }>;
}) {
  return (
    <div className="space-y-4">
      {/* low-confidence quiz areas — the curriculum signal */}
      {weakQuizItems.length > 0 ? (
        <div className="rounded-md border-2 border-status-pending-fg/40 bg-status-pending-bg p-3">
          <p className="flex items-center gap-1.5 text-small font-semibold text-status-pending-fg">
            <AlertTriangle className="size-4" aria-hidden />
            {weakQuizItems.length} quiz items answered correctly less than half the time
          </p>
          <ul className="mt-2 space-y-1">
            {weakQuizItems.map((q) => (
              <li key={q.itemId} className="flex items-start justify-between gap-2 text-caption text-status-pending-fg">
                <span className="font-medium line-clamp-2">{q.prompt ?? q.itemId}</span>
                <span className="shrink-0 text-muted-foreground">{q.correctPct}% correct · {q.attempts} attempts</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="flex items-center gap-2 rounded-md border-2 border-border bg-card p-3 text-small">
        <span className="flex items-center gap-1 font-medium">
          <AlertTriangle className="size-4 text-status-pending-fg" aria-hidden />
          {needs.length} need your eyes
        </span>
        <span className="ml-auto flex items-center gap-1 text-caption text-muted-foreground">
          <CheckCircle2 className="size-3.5" aria-hidden />
          {autoReleased} auto-released this week
        </span>
      </div>

      {needs.length === 0 ? (
        <div className="rounded-md border-2 border-border bg-card p-6 text-center">
          <p className="text-base font-medium">Queue is clear</p>
          <p className="mt-1 text-small text-muted-foreground">
            Nothing needs a human eye right now. New flagged items land here.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {needs.map((n) => (
            <Link
              key={n.id}
              href={`/admin/sim-review`}
              className="flex items-center justify-between gap-3 rounded-md border-2 border-border bg-card px-4 py-3 transition-transform hover:-translate-y-px active:translate-y-px"
            >
              <div>
                <p className="text-small font-medium">
                  Session {n.sessionId.slice(0, 8)} · AI {n.overall.toFixed(1)}/5
                </p>
                <p className="text-caption text-muted-foreground">
                  priority {n.priority}{n.premature > 2 ? " · premature reassurance flagged" : ""}
                </p>
              </div>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
