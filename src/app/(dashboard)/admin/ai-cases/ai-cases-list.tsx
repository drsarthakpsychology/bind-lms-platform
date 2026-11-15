import { Flag } from "lucide-react";
import { StatusPill } from "@/components/mobile/status-pill";
import { DX_NAMES } from "@/lib/ai-cases/criteria";
import type { AiCaseStatus } from "@/lib/ai-cases/types";
import type { ReviewRow } from "@/lib/ai-cases/store";
import { CaseActions } from "./case-actions";
import { Empty, Notice, Status, type Tone } from "../_v2/kit";

const PILL: Record<AiCaseStatus, { tone: "ai" | "warning" | "neutral"; label: string }> = {
  flagged: { tone: "warning", label: "Reported" },
  live: { tone: "ai", label: "Live" },
  removed: { tone: "neutral", label: "Removed" },
};

const KIND: Record<string, string> = { mse: "Mental state", collateral: "Collateral", scale: "Rating scale", lab: "Test" };

function when(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });
}

/** The AI cases list (no hooks, so the server page renders it). */
export function AiCasesList({ rows, missing, canEdit, v2 = false }: { rows: ReviewRow[]; missing: boolean; canEdit: boolean; v2?: boolean }) {
  if (v2) return <AiCasesV2 rows={rows} missing={missing} canEdit={canEdit} />;
  return (
    <>
      {missing ? (
        <p className="rounded-md border-2 border-dashed border-foreground bg-card p-4 text-small">
          The AI cases table isn&apos;t set up yet (supabase/migrations_pending/2026_11_ai_cases.sql). Students can still play AI cases; they just aren&apos;t listed here.
        </p>
      ) : rows.length === 0 ? (
        <p className="rounded-md border-2 border-dashed border-foreground bg-card p-4 text-small">No AI cases yet. They are made when students open the AI case tab in Daily case.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => {
            const c = r.case;
            const pill = PILL[r.status];
            return (
              <li key={r.id} className="rounded-lg border-2 border-foreground bg-card hard-shadow-xs">
                <details open={r.status === "flagged"}>
                  <summary className="flex min-h-14 cursor-pointer flex-wrap items-center gap-x-3 gap-y-1 p-4">
                    <span className="min-w-0 flex-1">
                      <span className="block font-bold">{DX_NAMES[c.answer] ?? c.answer}</span>
                      <span className="block text-caption text-muted-foreground">
                        {c.place} · Level {c.difficulty} · {c.setting === "indian" ? "India" : "Other countries"} · {when(r.createdAt)}
                      </span>
                    </span>
                    {r.flags > 0 && (
                      <span className="inline-flex items-center gap-1 text-caption font-semibold">
                        <Flag className="size-3.5" aria-hidden /> {r.flags} report{r.flags === 1 ? "" : "s"}
                      </span>
                    )}
                    <StatusPill tone={pill.tone} label={pill.label} />
                  </summary>
                  <div className="space-y-4 border-t-2 border-foreground p-4 text-small">
                    {r.reasons.length > 0 && (
                      <div className="rounded-md border-2 border-foreground bg-status-pending-bg p-3 text-status-pending-fg">
                        <p className="font-bold">What students said</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          {r.reasons.map((x, i) => (
                            <li key={i}>{x}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div>
                      <p className="font-bold">Clues</p>
                      <ol className="mt-1 list-decimal space-y-1 pl-5">
                        {c.clues.map((x, i) => (
                          <li key={i}>{x}</li>
                        ))}
                      </ol>
                    </div>
                    <div>
                      <p className="font-bold">Tests</p>
                      <ul className="mt-1 space-y-1">
                        {c.investigations.map((x, i) => (
                          <li key={i}>
                            <span className="font-semibold">
                              {KIND[x.kind] ?? x.kind}: {x.label}.
                            </span>{" "}
                            {x.result}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-bold">Look-alikes</p>
                      <ul className="mt-1 space-y-1">
                        {c.differentials.map((x) => (
                          <li key={x.dx}>
                            <span className="font-semibold">{DX_NAMES[x.dx] ?? x.dx}:</span> {x.whyNot}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-bold">Hint</p>
                      <p className="mt-1">{c.pointer}</p>
                    </div>
                    <div>
                      <p className="font-bold">Overview</p>
                      <p className="mt-1">{c.overview}</p>
                    </div>
                    <p className="text-caption text-muted-foreground">
                      Checked by {c.checkedBy}: {c.evidence.length} criteria matched in the text. Id {r.id}.
                    </p>
                    <CaseActions id={r.id} status={r.status} canEdit={canEdit} />
                  </div>
                </details>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

const TONE: Record<AiCaseStatus, { tone: Tone; label: string }> = {
  flagged: { tone: "warn", label: "Reported, out of practice" },
  live: { tone: "ok", label: "Live" },
  removed: { tone: "quiet", label: "Removed" },
};

/** v2: one hairline row per case; open a row to read the case and decide. */
function AiCasesV2({ rows, missing, canEdit }: { rows: ReviewRow[]; missing: boolean; canEdit: boolean }) {
  if (missing) return <Notice>The AI cases list is not switched on yet. Students can still play AI cases; they are just not listed here.</Notice>;
  if (rows.length === 0) return <Empty>No AI cases yet. They are made when students open the AI case tab in Daily case.</Empty>;
  const h = "type-small font-semibold";
  return (
    <ul className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
      {rows.map((r) => {
        const c = r.case;
        const st = TONE[r.status];
        return (
          <li key={r.id} className="min-w-0">
            <details open={r.status === "flagged"} className="group/case">
              <summary className="flex min-h-14 min-w-0 cursor-pointer list-none flex-col gap-1 py-3 outline-none transition-colors hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
                <span className="type-body font-semibold [overflow-wrap:anywhere]">{DX_NAMES[c.answer] ?? c.answer}</span>
                <span className="type-small text-muted-foreground [overflow-wrap:anywhere]">
                  {c.place} · Level {c.difficulty} · {c.setting === "indian" ? "India" : "Other countries"} · {when(r.createdAt)}
                </span>
                <span className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
                  <Status tone={st.tone}>{st.label}</Status>
                  {r.flags > 0 ? (
                    <span className="inline-flex items-center gap-1 type-small text-muted-foreground">
                      <Flag className="size-3.5" aria-hidden /> {r.flags} {r.flags === 1 ? "report" : "reports"}
                    </span>
                  ) : null}
                </span>
              </summary>
              <div className="flex min-w-0 max-w-[65ch] flex-col gap-4 pb-5 pt-1 type-small">
                {r.reasons.length > 0 ? (
                  <div className="rounded-md bg-status-pending-bg px-3 py-2.5 text-status-pending-fg">
                    <p className="font-semibold">What students said</p>
                    <ul className="mt-1 list-disc space-y-1 pl-5 [overflow-wrap:anywhere]">
                      {r.reasons.map((x, i) => (
                        <li key={i}>{x}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                <section>
                  <h3 className={h}>Clues</h3>
                  <ol className="mt-1 list-decimal space-y-1 pl-5 [overflow-wrap:anywhere]">
                    {c.clues.map((x, i) => (
                      <li key={i}>{x}</li>
                    ))}
                  </ol>
                </section>
                <section>
                  <h3 className={h}>Tests</h3>
                  <ul className="mt-1 space-y-1 [overflow-wrap:anywhere]">
                    {c.investigations.map((x, i) => (
                      <li key={i}>
                        <span className="font-semibold">{KIND[x.kind] ?? x.kind}: {x.label}.</span> {x.result}
                      </li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3 className={h}>Look-alikes</h3>
                  <ul className="mt-1 space-y-1 [overflow-wrap:anywhere]">
                    {c.differentials.map((x) => (
                      <li key={x.dx}>
                        <span className="font-semibold">{DX_NAMES[x.dx] ?? x.dx}:</span> {x.whyNot}
                      </li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3 className={h}>Hint</h3>
                  <p className="mt-1 [overflow-wrap:anywhere]">{c.pointer}</p>
                </section>
                <section>
                  <h3 className={h}>Overview</h3>
                  <p className="mt-1 [overflow-wrap:anywhere]">{c.overview}</p>
                </section>
                <p className="type-caption text-muted-foreground">Checked by {c.checkedBy}: {c.evidence.length} criteria matched in the text.</p>
                <CaseActions v2 id={r.id} status={r.status} canEdit={canEdit} />
              </div>
            </details>
          </li>
        );
      })}
    </ul>
  );
}
