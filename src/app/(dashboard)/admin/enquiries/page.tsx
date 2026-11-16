import { redirect } from "next/navigation";
import { isSuperAdmin, requireAdmin } from "@/lib/auth/guards";
import { Inbox } from "lucide-react";
import Link from "next/link";
import { loadPipeline, nowMs, personKey } from "@/lib/crm/people";
import { emailAllowance } from "@/lib/email/personal";
import { AdminPage } from "../_v2/kit";
import { PipelineV2, type PipelineInitial } from "../people/pipeline-v2";
import { createAdminClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/design-system/page-header";
import { EmptyState } from "@/components/design-system/empty-state";
import { readFlags } from "@/lib/flags";
import { uiV2For } from "@/lib/ui/v2";

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
 * /admin/enquiries: public-site leads from the /waitlist form. Admin-guarded
 * by the admin layout. Reads via the service-role client (RLS is admin-select
 * only, which this is).
 */
export default async function AdminEnquiriesPage({ searchParams }: { searchParams: Promise<Partial<PipelineInitial>> }) {
  // Defence in depth: layouts don't re-render on every navigation, so the page
  // re-checks admin itself before reading data.
  const me = await requireAdmin();
  if (!me) redirect("/dashboard");
  const admin = createAdminClient();
  if (uiV2For(await readFlags(), me.role)) {
    const sp = await searchParams;
    const [pipe, allowance, waitingRes] = await Promise.all([
      loadPipeline(admin),
      emailAllowance(admin),
      admin.from("email_sends").select("id", { count: "exact", head: true }).eq("status", "pending").eq("template_id", "pipeline"),
    ]);
    const enq = pipe.people.filter((p) => p.isEnquiry);
    const today = new Date(nowMs() + 5.5 * 3600000).toISOString().slice(0, 10);
    const todayCount = enq.filter((p) => p.enquiredAt && new Date(new Date(p.enquiredAt).getTime() + 5.5 * 3600000).toISOString().slice(0, 10) === today).length;
    return (
      <AdminPage title="Enquiries" lead={`${enq.length} from the public form · ${todayCount} today · ${enq.filter((p) => !p.isStudent).length} not yet students`}>
        <PipelineV2 scope="enquiries" people={pipe.people} cohorts={pipe.cohorts} initial={{ view: "not_converted", ...sp }} canWrite={isSuperAdmin(me)} paymentReady={pipe.paymentReady} allowance={allowance} waiting={waitingRes.error ? 0 : (waitingRes.count ?? 0)} />
      </AdminPage>
    );
  }
  const { data } = await admin
    .from("enquiries")
    .select("id, name, email, phone, status, message, source, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  const rows = (data ?? []) as unknown as EnquiryRow[];
  const today = new Date().toISOString().slice(0, 10);
  const todayCount = rows.filter((r) => r.created_at?.slice(0, 10) === today).length;

  const { data: students } = await admin.from("profiles").select("email").eq("role", "student").in("email", rows.map((r) => r.email.toLowerCase()).slice(0, 500));
  const joined = new Set((students ?? []).map((p) => String(p.email).toLowerCase()));
  const digits = (p: string | null) => (p ?? "").replace(/\D/g, "").replace(/^0+/, "");
  const wa = (p: string | null) => {
    const d = digits(p);
    return d.length === 10 ? `91${d}` : d.length >= 11 ? d : null;
  };
  const fresh = rows.filter((r) => !joined.has(r.email.toLowerCase()));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enquiry forms"
        description={`People who filled the form on the public site. ${rows.length} total · ${todayCount} today · ${fresh.length} not yet students.`}
      />

      {rows.length === 0 ? (
        <EmptyState icon={<Inbox className="size-6" aria-hidden />} title="No enquiries yet" description="They'll land here the moment someone submits the form." />
      ) : (
        <ul className="grid gap-3 lg:grid-cols-2">
          {rows.map((row) => {
            const w = wa(row.phone);
            const isStudent = joined.has(row.email.toLowerCase());
            return (
              <li key={row.id} className="flex flex-col gap-3 rounded-2xl border-2 border-foreground bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-bold">{row.name}</p>
                    <p className="truncate text-caption text-muted-foreground">{row.email}{row.phone ? ` · ${row.phone}` : ""}</p>
                  </div>
                  <span className="flex shrink-0 flex-col items-end gap-1">
                    <span className="rounded-full border-2 border-foreground/20 px-2 py-0.5 text-caption font-semibold">{row.status ? (STATUS_LABEL[row.status] ?? row.status) : "No status"}</span>
                    {isStudent ? <span className="rounded-full bg-status-success-bg px-2 py-0.5 text-[0.7rem] font-bold text-status-success-fg">Now a student</span> : null}
                  </span>
                </div>
                {row.message ? <p className="rounded-xl bg-background p-3 text-sm whitespace-pre-wrap break-words">{row.message}</p> : <p className="text-caption text-muted-foreground">No message.</p>}
                <div className="mt-auto flex flex-wrap items-center gap-2">
                  {w ? <a href={`https://wa.me/${w}`} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 items-center rounded-md border-2 border-foreground px-3 text-sm font-bold">WhatsApp</a> : null}
                  {row.phone ? <a href={`tel:${digits(row.phone)}`} className="inline-flex h-9 items-center rounded-md border-2 border-foreground px-3 text-sm font-bold">Call</a> : null}
                  <Link href={`/admin/emails?folder=compose&to=${encodeURIComponent(row.email)}`} className="inline-flex h-9 items-center rounded-md border-2 border-foreground px-3 text-sm font-bold">Email</Link>
                  <Link href={`/admin/people/${personKey(row.email)}`} className="inline-flex h-9 items-center rounded-md border-2 border-foreground px-3 text-sm font-bold">Pipeline record</Link>
                  {!isStudent ? <Link href={`/admin/students/add?email=${encodeURIComponent(row.email)}`} className="inline-flex h-9 items-center rounded-md border-2 border-foreground bg-primary px-3 text-sm font-bold text-primary-foreground">Make a student</Link> : null}
                  <span className="ml-auto text-caption text-muted-foreground">{new Date(row.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {row.source ?? "website"}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
