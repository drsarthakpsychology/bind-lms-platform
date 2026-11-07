import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft, Download, Inbox } from "lucide-react";
import { isSuperAdmin, requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { loadForm, loadSubmissions } from "@/lib/forms/load";
import { answerColumns, answerText, identityKeys } from "@/lib/forms/fields";
import { istStamp } from "@/lib/forms/csv";
import { PageHeader } from "@/components/design-system/page-header";
import { EmptyState } from "@/components/design-system/empty-state";
import { CopyLink } from "../copy-link";
import { FormRowActions } from "../form-row-actions";
import { StatusTag } from "../status-tag";
import { formUrl } from "../format";
import { ResponsesTable, type ResponseRow } from "./responses-table";

export const dynamic = "force-dynamic";

/** /admin/forms/[id]: every answer to one form, searchable, sortable, exportable. */
export default async function FormResponsesPage({ params }: { params: Promise<{ id: string }> }) {
  const me = await requireAdmin();
  if (!me) redirect("/dashboard");
  const { id } = await params;
  const admin = createAdminClient();
  const form = await loadForm(admin, id);
  if (!form) notFound();
  const subs = await loadSubmissions(admin, id);
  const canEdit = isSuperAdmin(me);

  const columns = answerColumns(form.fields, subs.map((s) => s.responses));
  const hidden = new Set(identityKeys(form.fields));
  const rows: ResponseRow[] = subs.map((s) => ({
    id: s.id,
    at: s.created_at,
    when: istStamp(s.created_at),
    name: s.name ?? "",
    email: s.email ?? "",
    phone: s.phone ?? "",
    contactId: s.contact_id,
    answers: Object.fromEntries(columns.map((c) => [c.key, answerText(s.responses?.[c.key])])),
  }));

  return (
    <div className="space-y-6">
      <Link href="/admin/forms" className="inline-flex min-h-11 items-center gap-1.5 rounded-md border-2 border-foreground bg-card px-4 text-sm font-bold">
        <ChevronLeft className="size-4" aria-hidden /> Forms
      </Link>
      <PageHeader
        title={form.title}
        badge={<StatusTag active={form.isActive} />}
        description={`${subs.length} answer${subs.length === 1 ? "" : "s"}`}
        actions={
          subs.length > 0 ? (
            <a href={`/api/admin/forms/${form.id}/csv`} className="inline-flex min-h-11 items-center gap-2 rounded-md border-2 border-foreground bg-card px-4 text-sm font-bold hover:bg-accent">
              <Download className="size-4" aria-hidden /> Export CSV
            </a>
          ) : null
        }
        className="pb-0"
      />
      <div className="flex flex-col gap-3">
        <CopyLink url={formUrl(form.slug)} className="max-w-2xl" />
        {canEdit ? (
          <div className="flex flex-wrap gap-2">
            <FormRowActions id={form.id} title={form.title} active={form.isActive} responses={subs.length} afterDelete="/admin/forms" />
          </div>
        ) : null}
      </div>

      {rows.length === 0 ? (
        <EmptyState icon={<Inbox className="size-6" aria-hidden />} title="No answers yet" description={form.isActive ? "Share the link above. Answers show up here." : "This form is closed. Open it to take answers."} />
      ) : (
        <ResponsesTable rows={rows} columns={columns.map((c) => ({ ...c, inTable: !hidden.has(c.key) }))} />
      )}
    </div>
  );
}
