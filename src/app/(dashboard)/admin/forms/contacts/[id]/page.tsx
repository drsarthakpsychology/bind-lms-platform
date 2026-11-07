import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft, Mail, MessageCircle, Phone } from "lucide-react";
import { requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { personKey } from "@/lib/crm/people";
import { answerColumns, answerText, normalizeFields } from "@/lib/forms/fields";
import { istStamp } from "@/lib/forms/csv";
import { dayIst } from "../../format";

export const dynamic = "force-dynamic";

type Contact = { id: string; email: string; name: string | null; phone: string | null; tags: string[] | null; created_at: string };
type Sub = { id: string; form_id: string; created_at: string; responses: Record<string, unknown> | null };

const btn = "inline-flex min-h-11 items-center gap-1.5 rounded-md border-2 border-foreground bg-card px-4 text-sm font-bold hover:bg-accent";

/** A contact made by a form: their details and every form answer they sent. */
export default async function FormContactPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) redirect("/dashboard");
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const admin = createAdminClient();
  const { data: c } = await admin.from("contacts").select("id, email, name, phone, tags, created_at").eq("id", id).maybeSingle();
  if (!c) notFound();
  const contact = c as Contact;

  const [{ data: subsRaw }, { data: enq }, { data: prof }, { data: crm }] = await Promise.all([
    admin.from("link_form_submissions").select("id, form_id, created_at, responses").eq("contact_id", id).order("created_at", { ascending: false }).limit(200),
    admin.from("enquiries").select("id").eq("email", contact.email).limit(1),
    admin.from("profiles").select("id").eq("role", "student").eq("email", contact.email).limit(1),
    admin.from("crm_contacts").select("email").eq("email", contact.email).limit(1),
  ]);
  const subs = (subsRaw ?? []) as Sub[];
  const formIds = [...new Set(subs.map((s) => s.form_id))];
  const { data: formsRaw } = formIds.length ? await admin.from("link_forms").select("id, title, fields").in("id", formIds) : { data: [] };
  const forms = new Map((formsRaw ?? []).map((f) => [f.id as string, { title: f.title as string, fields: normalizeFields(f.fields) }]));
  const inPipeline = Boolean(enq?.length || prof?.length || crm?.length);
  const wa = contact.phone ? contact.phone.replace(/\D/g, "").replace(/^0+/, "").replace(/^(\d{10})$/, "91$1") : null;

  return (
    <div className="space-y-6">
      <Link href="/admin/forms" className={btn}>
        <ChevronLeft className="size-4" aria-hidden /> Forms
      </Link>

      <section className="rounded-[10px] border-2 border-foreground bg-card p-5 hard-shadow-sm">
        <h1 className="text-h2 break-words">{contact.name || contact.email}</h1>
        <p className="mt-1 text-sm break-all">{contact.email}</p>
        {contact.phone ? <p className="text-sm">{contact.phone}</p> : null}
        <p className="mt-2 text-caption text-muted-foreground">Contact since {dayIst(contact.created_at)}</p>
        {contact.tags?.length ? (
          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Tags">
            {contact.tags.map((t) => (
              <li key={t} className="rounded-full border-2 border-foreground/20 px-2.5 py-0.5 font-mono text-xs">{t}</li>
            ))}
          </ul>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={`/admin/emails?folder=compose&to=${encodeURIComponent(contact.email)}`} className={btn}>
            <Mail className="size-4" aria-hidden /> Email
          </Link>
          {wa && wa.length >= 11 ? (
            <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className={btn}>
              <MessageCircle className="size-4" aria-hidden /> WhatsApp
            </a>
          ) : null}
          {contact.phone ? (
            <a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`} className={btn}>
              <Phone className="size-4" aria-hidden /> Call
            </a>
          ) : null}
          {inPipeline ? (
            <Link href={`/admin/people/${personKey(contact.email)}`} className={btn}>
              Pipeline record
            </Link>
          ) : null}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Form answers ({subs.length})</h2>
        {subs.length === 0 ? <p className="text-sm text-muted-foreground">No form answers linked to this contact.</p> : null}
        {subs.map((s) => {
          const f = forms.get(s.form_id);
          const cols = answerColumns(f?.fields ?? [], [s.responses]);
          return (
            <article key={s.id} className="rounded-[10px] border-2 border-foreground bg-card p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <Link href={`/admin/forms/${s.form_id}`} className="font-bold break-words hover:underline">{f?.title ?? "Form"}</Link>
                <span className="text-caption text-muted-foreground">{istStamp(s.created_at)}</span>
              </div>
              <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                {cols.map((col) => (
                  <div key={col.key} className="min-w-0">
                    <dt className="text-caption font-semibold text-muted-foreground">{col.label}{col.removed ? " (removed question)" : ""}</dt>
                    <dd className="whitespace-pre-wrap break-words">{answerText(s.responses?.[col.key]) || "No answer"}</dd>
                  </div>
                ))}
              </dl>
            </article>
          );
        })}
      </section>
    </div>
  );
}
