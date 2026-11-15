import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireAdmin, isSuperAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { emailConfigured } from "@/lib/certificates/server";
import { loadIssued } from "@/lib/certificates/issued-load";
import { AdminPage, LoadError } from "../../_v2/kit";
import { IssuedList } from "./issued-ui";

export const metadata: Metadata = { title: "Issued" };
export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * Certificates, Issued: everything given, certificates and badges, in one
 * list. Filters by type, status, cohort and person; download, verify page,
 * send again, correct and reissue, issue a draft, revoke with a reason.
 * Nothing here deletes anything.
 */
export default async function IssuedPage({ searchParams }: { searchParams: Promise<{ q?: string; type?: string; kind?: string; status?: string; cohort?: string; student?: string }> }) {
  const me = await requireAdmin();
  if (!me) redirect("/dashboard");
  const canWrite = isSuperAdmin(me);
  const sp = await searchParams;
  const admin = createAdminClient();

  const { error, rows, cohorts, people, waiting } = await loadIssued(admin);
  const person = sp.student ? people.get(sp.student) : undefined;

  return (
    <AdminPage title="Issued">
      {error ? (
        <LoadError what="what was issued" href="/admin/credentials/issued" />
      ) : (
        <IssuedList
          rows={rows}
          cohorts={cohorts}
          canWrite={canWrite}
          waiting={waiting}
          emailOn={emailConfigured()}
          initial={{ q: sp.q ?? "", type: sp.type ?? sp.kind ?? "", status: sp.status ?? "", cohortId: sp.cohort ?? "", userId: person ? person.id : "" }}
          person={person ? { id: person.id, name: person.name } : null}
        />
      )}
    </AdminPage>
  );
}
