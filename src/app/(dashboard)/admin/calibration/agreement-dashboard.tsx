"use client";

import * as React from "react";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { MIN_VALIDATION_KAPPA, MIN_VALIDATION_SCORES } from "@/lib/practice/rubric";

interface Dim {
  key: string;
  label: string;
  status: "provisional" | "validated";
  agreement: number | null;
  nScored: number;
}

/**
 * A3 — how closely the AI's marking matches your own, per dimension. A
 * dimension you haven't confirmed on enough sessions stays "not final" and
 * its number stays hidden from students (they get the written feedback only).
 * Once it matches your marking on MIN_VALIDATION_SCORES+ sessions, it becomes
 * final and students see the number.
 */
export function AgreementDashboard({
  dimensions,
  provisionalKeys,
  overallKappa,
}: {
  dimensions: Dim[];
  provisionalKeys: string[];
  overallKappa: number | null;
}) {
  const pairedCount = dimensions.reduce((a, d) => a + d.nScored, 0);
  return (
    <div className="rounded-md border-2 border-border bg-card p-6 hard-shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Agreement with your marking</h2>
          <p className="mt-1 text-small text-muted-foreground">
            Scores you haven&apos;t confirmed yet stay hidden from students — they see the written
            feedback only.
          </p>
        </div>
        <div className="shrink-0 rounded-md border-2 border-border bg-background px-3 py-2 text-center">
          <p className="text-caption text-muted-foreground">Overall agreement</p>
          <p className="text-numeric text-lg font-semibold">
            {overallKappa != null ? overallKappa.toFixed(2) : "—"}
          </p>
          <p className="text-caption text-muted-foreground">{pairedCount} marked together with AI</p>
        </div>
      </div>

      <ul className="mt-4 space-y-2">
        {dimensions.map((d) => {
          const provisional = d.status === "provisional";
          const passing = !provisional;
          const pct =
            d.nScored >= MIN_VALIDATION_SCORES && (d.agreement ?? 0) >= MIN_VALIDATION_KAPPA;
          return (
            <li key={d.key} className="flex items-center gap-3 rounded-md border border-border bg-background p-3">
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full",
                  passing ? "bg-status-success-bg text-status-success-fg" : "bg-status-pending-bg text-status-pending-fg",
                )}
              >
                {passing ? <ShieldCheck className="size-4" aria-hidden /> : <ShieldAlert className="size-4" aria-hidden />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-small font-medium">{d.label}</p>
                <p className="text-caption text-muted-foreground">
                  {provisional
                    ? `Not final — students don't see this score yet · ${d.nScored} marked`
                    : `Final — students see this score · ${d.nScored} marked`}
                  {d.agreement != null ? ` · agreement ${d.agreement.toFixed(2)}` : ""}
                </p>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-caption font-medium",
                  pct ? "bg-status-success-bg text-status-success-fg" : "bg-secondary text-muted-foreground",
                )}
              >
                {passing ? "Final" : pct ? "Nearly final" : "Not final yet"}
              </span>
            </li>
          );
        })}
      </ul>

      <p className="mt-3 text-caption text-muted-foreground">
        A dimension becomes final once it matches your marking on {MIN_VALIDATION_SCORES}+ sessions —
        its score then appears in student debriefs.
      </p>
      {provisionalKeys.length > 0 ? (
        <p className="mt-1 text-caption text-status-pending-fg">
          {provisionalKeys.length} dimension{provisionalKeys.length === 1 ? "" : "s"} currently hidden
          from students.
        </p>
      ) : null}
    </div>
  );
}
