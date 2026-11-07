import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { requireAdmin, isSuperAdmin } from "@/lib/auth/guards";
import { PageHeader } from "@/components/design-system/page-header";
import { FormBuilder } from "../form-builder";

export const dynamic = "force-dynamic";

/** /admin/forms/new: Super Admin only. Starts with name, email and phone. */
export default async function NewFormPage() {
  const me = await requireAdmin();
  if (!me) redirect("/dashboard");
  if (!isSuperAdmin(me)) redirect("/admin/forms");
  return (
    <div className="space-y-6">
      <Link href="/admin/forms" className="inline-flex min-h-11 items-center gap-1.5 rounded-md border-2 border-foreground bg-card px-4 text-sm font-bold">
        <ChevronLeft className="size-4" aria-hidden /> Forms
      </Link>
      <PageHeader title="New form" className="pb-0" />
      <FormBuilder
        initial={{
          title: "",
          description: "",
          isActive: true,
          fields: [
            { key: "full_name", type: "text", label: "Full name", required: true },
            { key: "email_address", type: "email", label: "Email", required: true },
            { key: "mobile_number", type: "phone", label: "Phone", required: false },
          ],
        }}
        reservedKeys={[]}
        responses={0}
      />
    </div>
  );
}
