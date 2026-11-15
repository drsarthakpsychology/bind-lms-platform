import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { loadPeople, nowMs } from "@/lib/crm/people";
import { PageHeader } from "@/components/design-system/page-header";
import { PeopleView } from "./people-view";
import { readFlags } from "@/lib/flags";
import { uiV2For } from "@/lib/ui/v2";
import { AdminPage } from "../_v2/kit";
import { PeopleV2 } from "../_v2/people";

export const dynamic = "force-dynamic";

/** People: the CRM: every enquiry and student in one pipeline. */
export default async function PeoplePage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  // Defence in depth: layouts don't re-render on every navigation, so the page
  // re-checks admin itself before reading data.
  const me = await requireAdmin();
  if (!me) redirect("/dashboard");
  const { view } = await searchParams;
  const people = await loadPeople(createAdminClient());
  const due = people.filter((p) => p.followUpAt && new Date(p.followUpAt).getTime() <= nowMs() + 86400000).length;
  if (uiV2For(await readFlags(), me.role)) {
    return (
      <AdminPage title="Pipeline" lead={`${people.length} people · ${people.filter((p) => !p.contacted && !p.isStudent).length} not contacted yet · ${due} follow-up${due === 1 ? "" : "s"} due`}>
        <PeopleV2 people={people} initialView={view} />
      </AdminPage>
    );
  }
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
