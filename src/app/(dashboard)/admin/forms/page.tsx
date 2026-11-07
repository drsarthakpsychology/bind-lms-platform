import Link from "next/link";
import { redirect } from "next/navigation";
import { ClipboardCheck, Plus } from "lucide-react";
import { isSuperAdmin, requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { loadForms } from "@/lib/forms/load";
import { PageHeader } from "@/components/design-system/page-header";
import { EmptyState } from "@/components/design-system/empty-state";
import { CopyLink } from "./copy-link";
import { FormRowActions } from "./form-row-actions";
import { StatusTag } from "./status-tag";
import { dayIst, formUrl } from "./format";

export const dynamic = "force-dynamic";

/** /admin/forms: every link form, its status, how many answers, and its public link. */
export default async function FormsPage() {
  const me = await requireAdmin();
  if (!me) redirect("/dashboard");
  const canEdit = isSuperAdmin(me);

  // A failed read throws to the admin error screen (with its retry button).
  const forms = await loadForms(createAdminClient());
  const total = forms.reduce((n, f) => n + f.responses, 0);
  const open = forms.filter((f) => f.isActive).length;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Communicate"
        title="Forms"
        description={`${forms.length} form${forms.length === 1 ? "" : "s"} · ${open} open · ${total} answer${total === 1 ? "" : "s"}`}
        actions={
          canEdit ? (
            <Link href="/admin/forms/new" className="inline-flex min-h-11 items-center gap-2 rounded-md border-2 border-foreground bg-primary px-4 text-sm font-bold text-primary-foreground hard-shadow-xs hover:-translate-y-0.5 hover:hard-shadow-sm">
              <Plus className="size-4" aria-hidden /> New form
            </Link>
          ) : null
        }
      />

      {forms.length === 0 ? (
        <EmptyState icon={<ClipboardCheck className="size-6" aria-hidden />} title="No forms yet" description={canEdit ? "Make one and share its link." : "A Super Admin can make one."} />
      ) : (
        <ul className="grid gap-4 lg:grid-cols-2">
          {forms.map((f) => (
            <li key={f.id} className="flex min-w-0 flex-col gap-4 rounded-[10px] border-2 border-foreground bg-card p-4 hard-shadow-sm sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <Link href={`/admin/forms/${f.id}`} className="min-w-0 text-lg leading-snug font-bold break-words hover:underline">
                  {f.title}
                </Link>
                <StatusTag active={f.isActive} />
              </div>
              <dl className="grid grid-cols-2 gap-3">
                <div className="rounded-md border-2 border-foreground/15 bg-background p-3">
                  <dt className="text-caption text-muted-foreground">Answers</dt>
                  <dd className="text-2xl font-bold tabular-nums">{f.responses}</dd>
                </div>
                <div className="rounded-md border-2 border-foreground/15 bg-background p-3">
                  <dt className="text-caption text-muted-foreground">Last answer</dt>
                  <dd className="pt-1 font-semibold">{f.lastResponseAt ? dayIst(f.lastResponseAt) : "None yet"}</dd>
                </div>
              </dl>
              <CopyLink url={formUrl(f.slug)} />
              <div className="mt-auto flex flex-wrap items-center gap-2">
                <Link href={`/admin/forms/${f.id}`} className="inline-flex min-h-11 items-center rounded-md border-2 border-foreground bg-primary px-4 text-sm font-bold text-primary-foreground">
                  See answers
                </Link>
                {canEdit ? <FormRowActions id={f.id} title={f.title} active={f.isActive} responses={f.responses} /> : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
