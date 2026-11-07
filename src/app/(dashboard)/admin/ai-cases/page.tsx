import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Flag } from "lucide-react";
import { isSuperAdmin, requireAdmin } from "@/lib/auth/guards";
import { PageHeader } from "@/components/design-system/page-header";
import { StatusPill } from "@/components/mobile/status-pill";
import { listForReview } from "@/lib/ai-cases";
import { DX_NAMES } from "@/lib/ai-cases/criteria";
import { AI_CASE_NOTE, type AiCaseStatus } from "@/lib/ai-cases/types";
import { CaseActions } from "./case-actions";

export const metadata: Metadata = { title: "AI cases" };
export const dynamic = "force-dynamic";

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

/**
 * /admin/ai-cases: every AI-made practice case, reported ones first. Any admin
 * can read; only the Super Admin can keep, remove or restore a case.
 */
export default async function AiCasesPage() {
  const me = await requireAdmin();
  if (!me) redirect("/dashboard");
  const canEdit = isSuperAdmin(me);
  const { rows, missing } = await listForReview(120);
  const reported = rows.filter((r) => r.status === "flagged").length;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <PageHeader
        eyebrow="Content"
        title="AI cases"
        description={`Practice cases made by AI. Students see: "${AI_CASE_NOTE}". Reported cases leave practice until you check them.`}
        badge={reported > 0 ? <StatusPill tone="warning" label={`${reported} reported`} /> : undefined}
      />

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
    </div>
  );
}
