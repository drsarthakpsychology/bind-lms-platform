import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { isSuperAdmin, requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { countSubmissions, loadForm, usedAnswerKeys } from "@/lib/forms/load";
import { PageHeader } from "@/components/design-system/page-header";
import { FormBuilder } from "../../form-builder";

export const dynamic = "force-dynamic";

/** /admin/forms/[id]/edit: Super Admin only. View Admins are sent to the answers. */
export default async function EditFormPage({ params }: { params: Promise<{ id: string }> }) {
  const me = await requireAdmin();
  if (!me) redirect("/dashboard");
  const { id } = await params;
  if (!isSuperAdmin(me)) redirect(`/admin/forms/${id}`);
  const admin = createAdminClient();
  const form = await loadForm(admin, id);
  if (!form) notFound();
  const [reservedKeys, responses] = await Promise.all([usedAnswerKeys(admin, id), countSubmissions(admin, id)]);

  return (
    <div className="space-y-6">
      <Link href={`/admin/forms/${id}`} className="inline-flex min-h-11 items-center gap-1.5 rounded-md border-2 border-foreground bg-card px-4 text-sm font-bold">
        <ChevronLeft className="size-4" aria-hidden /> Answers
      </Link>
      <PageHeader title="Edit form" className="pb-0" />
      <FormBuilder
        formId={id}
        initial={{ title: form.title, description: form.description ?? "", isActive: form.isActive, fields: form.fields }}
        reservedKeys={reservedKeys}
        responses={responses}
      />
    </div>
  );
}
