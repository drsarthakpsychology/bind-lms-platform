import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isSuperAdmin, requireAdmin } from "@/lib/auth/guards";
import { readFlags } from "@/lib/flags";
import { uiV2For } from "@/lib/ui/v2";
import { AdminPage } from "../_v2/kit";
import { PageHeader } from "@/components/design-system/page-header";
import { StatusPill } from "@/components/mobile/status-pill";
import { listForReview } from "@/lib/ai-cases";
import { AI_CASE_NOTE } from "@/lib/ai-cases/types";
import { AiCasesList } from "./ai-cases-list";

export const metadata: Metadata = { title: "AI cases" };
export const dynamic = "force-dynamic";

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

  const body = <AiCasesList rows={rows} missing={missing} canEdit={canEdit} />;
  if (uiV2For(await readFlags(), me.role)) {
    return (
      <AdminPage width="default" title="AI cases" lead={`Practice cases made by AI. Students see: "${AI_CASE_NOTE}". Reported cases leave practice until you check them.${reported > 0 ? ` ${reported} reported.` : ""}`}>
        <AiCasesList v2 rows={rows} missing={missing} canEdit={canEdit} />
      </AdminPage>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <PageHeader
        eyebrow="Content"
        title="AI cases"
        description={`Practice cases made by AI. Students see: "${AI_CASE_NOTE}". Reported cases leave practice until you check them.`}
        badge={reported > 0 ? <StatusPill tone="warning" label={`${reported} reported`} /> : undefined}
      />

      {body}
    </div>
  );
}
