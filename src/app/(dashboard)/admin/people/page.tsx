import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { loadPeople, nowMs } from "@/lib/crm/people";
import { PageHeader } from "@/components/design-system/page-header";
import { PeopleView } from "./people-view";

export const dynamic = "force-dynamic";

/** People — the CRM: every enquiry and student in one pipeline. */
export default async function PeoplePage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  // Defence in depth: layouts don't re-render on every navigation, so the page
  // re-checks admin itself before reading data.
  if (!(await requireAdmin())) redirect("/dashboard");
  const { view } = await searchParams;
  const people = await loadPeople(createAdminClient());
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
