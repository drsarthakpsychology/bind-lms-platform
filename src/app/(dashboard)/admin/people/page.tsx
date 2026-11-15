import { redirect } from "next/navigation";
import { isSuperAdmin, requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { loadPeople, loadPipeline, nowMs } from "@/lib/crm/people";
import { emailAllowance } from "@/lib/email/personal";
import { PageHeader } from "@/components/design-system/page-header";
import { PeopleView } from "./people-view";
import { readFlags } from "@/lib/flags";
import { uiV2For } from "@/lib/ui/v2";
import { AdminPage } from "../_v2/kit";
import { PipelineV2, type PipelineInitial } from "./pipeline-v2";

export const dynamic = "force-dynamic";

/** People: the CRM: every enquiry and student in one pipeline. */
export default async function PeoplePage({ searchParams }: { searchParams: Promise<Partial<PipelineInitial>> }) {
  // Defence in depth: layouts don't re-render on every navigation, so the page
  // re-checks admin itself before reading data.
  const me = await requireAdmin();
  if (!me) redirect("/dashboard");
  const sp = await searchParams;
  const { view } = sp;
  const admin = createAdminClient();
  if (uiV2For(await readFlags(), me.role)) {
    const [pipe, allowance, waitingRes] = await Promise.all([
      loadPipeline(admin),
      emailAllowance(admin),
      admin.from("email_sends").select("id", { count: "exact", head: true }).eq("status", "pending").eq("template_id", "pipeline"),
    ]);
    const due = pipe.people.filter((p) => p.followUpAt && new Date(p.followUpAt).getTime() <= nowMs() + 86400000).length;
    return (
      <AdminPage title="Pipeline" lead={`${pipe.people.length} people · ${due} follow-up${due === 1 ? "" : "s"} due`}>
        <PipelineV2 people={pipe.people} cohorts={pipe.cohorts} initial={sp} canWrite={isSuperAdmin(me)} paymentReady={pipe.paymentReady} allowance={allowance} waiting={waitingRes.error ? 0 : (waitingRes.count ?? 0)} />
      </AdminPage>
    );
  }
  const people = await loadPeople(admin);
  const due = people.filter((p) => p.followUpAt && new Date(p.followUpAt).getTime() <= nowMs() + 86400000).length;
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="People"
        title="Pipeline"
        description={`${people.length} people · ${people.filter((p) => !p.contacted && !p.isStudent).length} not contacted yet · ${due} follow-up${due === 1 ? "" : "s"} due`}
      />
      <PeopleView people={people} initialView={view} />
    </div>
  );
}
