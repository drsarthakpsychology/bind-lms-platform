import { createAdminClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/design-system/page-header";

export const dynamic = "force-dynamic";

interface EnquiryRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: string | null;
  message: string | null;
  source: string | null;
  created_at: string;
}

const STATUS_LABEL: Record<string, string> = {
  student: "Student",
  early_career: "Early-career",
  practitioner: "Practitioner",
  other: "Other",
};

/**
 * /admin/enquiries — public-site leads from the /enquire form. Admin-guarded
 * by the admin layout. Reads via the service-role client (RLS is admin-select
 * only, which this is).
 */
export default async function AdminEnquiriesPage() {
  const admin = createAdminClient();
  const { data } = await admin
    .from("enquiries")
    .select("id, name, email, phone, status, message, source, created_at")
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as unknown as EnquiryRow[];
  const today = new Date().toISOString().slice(0, 10);
  const todayCount = rows.filter((r) => r.created_at?.slice(0, 10) === today).length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <PageHeader
        title="Enquiries"
        description={`Leads from the public site. ${rows.length} total · ${todayCount} today.`}
      />

      {rows.length === 0 ? (
        <div className="mt-6 rounded-md border-2 border-dashed border-border bg-card p-8 text-center text-small text-muted-foreground">
          No enquiries yet. They&apos;ll land here the moment someone submits the form.
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {rows.map((row) => (
            <div key={row.id} className="rounded-md border-2 border-border bg-card p-4 hard-shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="text-small font-semibold text-foreground">{row.name}</p>
                <span className="rounded-full border border-border bg-secondary px-2 py-0.5 text-caption font-medium text-muted-foreground">
                  {row.status ? (STATUS_LABEL[row.status] ?? row.status) : "—"}
                </span>
              </div>
              <p className="mt-1 text-caption text-muted-foreground">
                <a href={`mailto:${row.email}`} className="underline underline-offset-2">{row.email}</a>
                {row.phone ? ` · ${row.phone}` : ""}
              </p>
              {row.message ? (
                <p className="mt-2 whitespace-pre-wrap rounded-md border border-border bg-background p-2.5 text-small text-muted-foreground">
                  {row.message}
                </p>
              ) : null}
              <p className="mt-2 text-caption text-muted-foreground">
                {new Date(row.created_at).toLocaleString()} · {row.source ?? "landing"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
