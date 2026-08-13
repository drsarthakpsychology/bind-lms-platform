"use client";

import * as React from "react";
import { BadgeCheck, Award } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PassportRow {
  key: string;
  name: string;
  description?: string;
  events: Array<{
    id: string;
    source: string;
    evidence: Record<string, unknown>;
    createdAt: string;
  }>;
}

const SOURCE_LABEL: Record<string, string> = {
  sim: "Sim session",
  sct: "Judgment",
  formulation: "Formulation",
  mse: "MSE",
  osce: "OSCE",
  rounds: "Rounds",
  supervision: "Supervision",
  manual: "Manual",
};

/** Hours evidenced, when the event carries them. */
function hoursOf(e: PassportRow["events"][number]): number {
  const h = Number(e.evidence?.hours ?? 0);
  return Number.isFinite(h) ? h : 0;
}

export function Passport({ rows }: { rows: PassportRow[] }) {
  const evid = rows.reduce((a, r) => a + r.events.length, 0);
  const hours = rows.reduce((a, r) => a + r.events.reduce((x, e) => x + hoursOf(e), 0), 0);
  const done = rows.filter((r) => r.events.length > 0).length;

  return (
    <div className="space-y-6">
      {/* summary */}
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Competencies touched" value={`${done}/${rows.length}`} />
        <Stat label="Evidence entries" value={String(evid)} />
        <Stat label="Logged hours" value={`${hours.toFixed(1)}h`} />
      </div>

      {/* competency grid */}
      <ul className="space-y-2">
        {rows.map((r) => {
          const touched = r.events.length > 0;
          return (
            <li key={r.key} className="rounded-md border-2 border-border bg-card p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className={cn("text-small font-semibold", touched && "text-link")}>
                    {r.name}
                  </p>
                  {r.description ? (
                    <p className="text-caption text-muted-foreground">{r.description}</p>
                  ) : null}
                </div>
                {touched ? (
                  <span className="flex shrink-0 items-center gap-1 rounded-full bg-status-success-bg px-2 py-0.5 text-caption font-medium text-status-success-fg">
                    <BadgeCheck className="size-3.5" aria-hidden /> Evidenced
                  </span>
                ) : (
                  <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-caption font-medium text-muted-foreground">
                    Open
                  </span>
                )}
              </div>

              {touched ? (
                <ul className="mt-2 space-y-1 border-t border-border pt-2">
                  {r.events.slice(0, 3).map((e) => (
                    <li key={e.id} className="flex items-center justify-between text-caption text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <span className="rounded-full bg-secondary px-1.5 py-0.5 text-caption font-medium">
                          {SOURCE_LABEL[e.source] ?? e.source}
                        </span>
                        {hoursOf(e) > 0 ? `${hoursOf(e)}h` : null}
                      </span>
                      <time dateTime={e.createdAt}>{new Date(e.createdAt).toLocaleDateString()}</time>
                    </li>
                  ))}
                  {r.events.length > 3 ? (
                    <li className="text-caption text-muted-foreground">
                      +{r.events.length - 3} more
                    </li>
                  ) : null}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>

      <p className="flex items-center gap-1.5 text-caption text-muted-foreground">
        <Award className="size-3.5" aria-hidden />
        Evidence accumulates from sim sessions, SCT, formulation, MSE, OSCE, and supervision. Your
        signed-off hours here underpin the certificate appendix.
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border-2 border-border bg-card p-4">
      <p className="text-caption text-muted-foreground">{label}</p>
      <p className="text-numeric text-base font-semibold">{value}</p>
    </div>
  );
}
