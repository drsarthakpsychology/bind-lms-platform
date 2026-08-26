import { ChevronDown, Inbox } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/design-system/page-header";
import { EmptyState } from "@/components/design-system/empty-state";

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
 * /admin/enquiries — public-site leads from the /waitlist form. Admin-guarded
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
        <div className="mt-6">
          <EmptyState
            icon={<Inbox className="size-6" aria-hidden />}
            title="No enquiries yet"
            description="They'll land here the moment someone submits the form."
          />
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
                <details className="group mt-2 rounded-md border border-border bg-background">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-2.5 py-2">
                    <span className="text-caption font-medium text-muted-foreground">
                      {row.message.length > 80 ? `${row.message.slice(0, 80)}…` : "Message"}
                    </span>
                    <ChevronDown
                      className="size-4 shrink-0 text-muted-foreground transition-transform duration-fast ease-snappy group-open:rotate-180"
                      aria-hidden
                    />
                  </summary>
                  <p className="border-t border-border px-2.5 py-2 whitespace-pre-wrap text-small text-muted-foreground">
                    {row.message}
                  </p>
                </details>
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
