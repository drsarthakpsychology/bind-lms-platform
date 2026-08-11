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
 * A3 — the agreement dashboard. Shows per-dimension calibration status:
 * which dimensions hide their number from students (provisional) and how many
 * paired scores / what kappa each has accumulated. The gate: >= 10 pairs with
 * kappa >= 0.6 flips a dimension to validated (its number then appears in
 * student debriefs).
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
          <h2 className="text-base font-semibold">Dimension agreement</h2>
          <p className="mt-1 text-small text-muted-foreground">
            Provisional dimensions hide their <span className="font-semibold">number</span> from students —
            they see qualitative feedback only until you validate them.
          </p>
        </div>
        <div className="shrink-0 rounded-md border-2 border-border bg-background px-3 py-2 text-center">
          <p className="text-caption text-muted-foreground">Overall kappa</p>
          <p className="text-numeric text-lg font-semibold">
            {overallKappa != null ? overallKappa.toFixed(2) : "—"}
          </p>
          <p className="text-caption text-muted-foreground">{pairedCount} paired score(s)</p>
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
                  passing ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700",
                )}
              >
                {passing ? <ShieldCheck className="size-4" aria-hidden /> : <ShieldAlert className="size-4" aria-hidden />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-small font-medium">{d.label}</p>
                <p className="text-caption text-muted-foreground">
                  {provisional
                    ? `Provisional — number hidden from students · ${d.nScored} scored`
                    : `Validated — number visible · ${d.nScored} scored`}
                  {d.agreement != null ? ` · kappa ${d.agreement.toFixed(2)}` : ""}
                </p>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-caption font-medium",
                  pct ? "bg-green-100 text-green-800" : "bg-secondary text-muted-foreground",
                )}
              >
                {passing ? "Validated" : pct ? "Ready to validate" : "Provisional"}
              </span>
            </li>
          );
        })}
      </ul>

      <p className="mt-3 text-caption text-muted-foreground">
        Gate: {MIN_VALIDATION_SCORES}+ paired scores with weighted kappa ≥ {MIN_VALIDATION_KAPPA} flips a
        dimension to validated — its number then appears in student debriefs.
      </p>
      {provisionalKeys.length > 0 ? (
        <p className="mt-1 text-caption text-amber-700">
          {provisionalKeys.length} dimension{provisionalKeys.length === 1 ? "" : "s"} currently hidden
          from students.
        </p>
      ) : null}
    </div>
  );
}
