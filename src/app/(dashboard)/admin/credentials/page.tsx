import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Award } from "lucide-react";
import { requireAdmin, isSuperAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { loadRoster } from "@/lib/people/roster-data";
import { PageHeader } from "@/components/design-system/page-header";
import { Badge } from "@/components/ui/badge";
import { CredentialActions, IssueCertificateForm } from "./credential-ui";
import { FilterBar } from "@/components/admin/filter-bar";

export const metadata: Metadata = { title: "Credentials" };
export const dynamic = "force-dynamic";

const date = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—");

/**
 * Credentials (2026-11 redesign): type a roll number, name or email, open the
 * student, see everything they've earned (badges and certificates, with PDF,
 * verify page and revoke), and design + issue a certificate just for them.
 */
export default async function CredentialsPage({ searchParams }: { searchParams: Promise<{ q?: string; student?: string; type?: string; status?: string }> }) {
  const me = await requireAdmin();
  if (!me) redirect("/dashboard");
  const canWrite = isSuperAdmin(me);
  const sp = await searchParams;
  const q = (sp.q ?? "").trim().toLowerCase();
  const { rows } = await loadRoster();
  const exact = q ? rows.find((r) => (r.roll ?? "").toLowerCase() === q || r.id === q || r.email.toLowerCase() === q) : undefined;
  const studentId = sp.student ?? exact?.id ?? null;
  const matches = q && !exact ? rows.filter((r) => `${r.name} ${r.email} ${r.roll ?? ""} ${r.mobile ?? ""}`.toLowerCase().includes(q)).slice(0, 30) : [];
  const student = studentId ? rows.find((r) => r.id === studentId) : undefined;
  const type = sp.type === "badge" || sp.type === "certificate" ? sp.type : null;
  const status = sp.status === "issued" || sp.status === "revoked" || sp.status === "pending" ? sp.status : null;
  const filtering = Boolean(type || status);
  const keep = (c: { type?: unknown; status?: unknown; revoked_at?: unknown }) =>
    (!type || c.type === type) && (!status || (status === "revoked" ? Boolean(c.revoked_at) || c.status === "revoked" : !c.revoked_at && (status === "issued" ? c.status === "issued" : c.status !== "issued")));

  const admin = createAdminClient();
  const [creds, sigs, recent] = await Promise.all([
    student ? admin.from("credentials").select("id, credential_id, type, status, issued_at, revoked_at, revoke_reason, reason, student_name, pdf_storage_path, achievements(title)").eq("user_id", student.id).order("created_at", { ascending: false }) : Promise.resolve({ data: [], error: null }),
    admin.from("achievements").select("id, title, signature_label, signature_asset_path").eq("type", "certificate").not("signature_asset_path", "is", null),
    student
      ? Promise.resolve({ data: [] })
      : admin.from("credentials").select("credential_id, student_name, type, status, issued_at, revoked_at, user_id, achievements(title)").order("created_at", { ascending: false }).limit(filtering ? 500 : 15),
  ]);
  const one = <T,>(x: T | T[] | null | undefined): T | null => (Array.isArray(x) ? (x[0] ?? null) : (x ?? null));
  const signatures = (sigs.error ? [] : (sigs.data ?? [])).map((s) => ({ id: s.id as string, label: (s.signature_label as string | null) || `Signature from "${s.title}"` }));

  return (
    <div className="space-y-6">
      <PageHeader title="Find & issue" description="Search a student by roll number, name or email to see and manage everything they've earned, or design a certificate for them." />
      <FilterBar
        search={{ label: "Roll number, name or email", placeholder: "e.g. VIBHA-000042, Aanya, or aanya@gmail.com" }}
        searchReset={["student"]}
        selects={[
          { param: "type", label: "Type", allLabel: "Badges and certificates", options: [{ value: "certificate", label: "Certificates" }, { value: "badge", label: "Badges" }] },
          { param: "status", label: "Status", allLabel: "Any status", options: [{ value: "issued", label: "Issued" }, { value: "pending", label: "Not issued yet" }, { value: "revoked", label: "Revoked" }] },
        ]}
      />

      {matches.length ? (
        <ul className="divide-y-2 divide-foreground/10 overflow-hidden rounded-2xl border-2 border-foreground bg-card">
          {matches.map((r) => (
            <li key={r.id}>
              <Link href={`/admin/credentials?q=${encodeURIComponent(sp.q ?? "")}&student=${r.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-accent">
                <span className="min-w-0 flex-1"><span className="block truncate font-bold">{r.name}</span><span className="block truncate text-caption text-muted-foreground">{r.roll ?? "No roll no."} · {r.email}</span></span>
              </Link>
            </li>
          ))}
        </ul>
      ) : q && !student ? (
        <p className="rounded-2xl border-2 border-dashed border-foreground/30 p-5 text-sm text-muted-foreground">No student matches “{sp.q}”.</p>
      ) : null}

      {student ? (
        <>
          <section className="space-y-3 rounded-2xl border-2 border-foreground bg-card p-4">
            <header className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-h3 font-bold">{student.name}</h2>
                <p className="text-sm text-muted-foreground"><span className="font-mono font-bold text-foreground">{student.roll ?? "No roll no."}</span> · {student.email}</p>
              </div>
              <Link href={`/admin/students/${student.id}`} className="inline-flex h-9 items-center rounded-md border-2 border-foreground px-3 text-sm font-bold">Open profile</Link>
            </header>
            {creds.error ? (
              <p className="text-sm text-muted-foreground">Credentials aren&apos;t set up in the database yet.</p>
            ) : (creds.data ?? []).filter(keep).length ? (
              <ul className="divide-y-2 divide-foreground/10">
                {(creds.data ?? []).filter(keep).map((c) => (
                  <li key={c.id as string} className="flex flex-wrap items-center gap-3 py-3">
                    <Award className="size-5 shrink-0 text-link" aria-hidden />
                    <span className="min-w-0 flex-1 basis-56">
                      <span className="block font-bold">{one(c.achievements as { title?: string } | { title?: string }[] | null)?.title ?? "Credential"}</span>
                      <span className="block text-caption text-muted-foreground">{c.type === "certificate" ? "Certificate" : "Badge"} · {String(c.credential_id)} · {c.issued_at ? `issued ${date(c.issued_at as string)}` : String(c.status)}{c.revoked_at ? ` · revoked: ${String(c.revoke_reason ?? "")}` : ""}</span>
                    </span>
                    {c.revoked_at ? <Badge variant="destructive">Revoked</Badge> : <Badge variant={c.status === "issued" ? "published" : "pending"}>{c.status === "issued" ? "Issued" : String(c.status)}</Badge>}
                    <Link href={`/verify/${c.credential_id}`} target="_blank" className="text-sm font-bold text-link underline">Verify page</Link>
                    <CredentialActions credentialId={String(c.credential_id)} revoked={Boolean(c.revoked_at)} hasPdf={Boolean(c.pdf_storage_path)} canWrite={canWrite} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">{filtering ? "Nothing matches these filters." : "Nothing earned yet."}</p>
            )}
          </section>
          {canWrite ? (
            <section className="rounded-2xl border-2 border-foreground bg-card p-4 sm:p-6">
              <h2 className="mb-1 text-h3 font-bold">Design a certificate for {student.name}</h2>
              <p className="mb-4 text-small text-muted-foreground">Fill in the details, press Preview, then Issue. It gets a credential ID, a public verify page and a PDF, and shows on their Achievements page.</p>
              <IssueCertificateForm userId={student.id} defaultName={student.name} signatures={signatures} />
            </section>
          ) : null}
        </>
      ) : !q ? (
        <section className="rounded-2xl border-2 border-foreground bg-card p-4">
          <h2 className="font-bold">{filtering ? "Matching credentials" : "Recently issued"}</h2>
          {(recent.data ?? []).filter(keep).length ? (
            <ul className="mt-2 divide-y divide-foreground/10 text-sm">
              {(recent.data ?? []).filter(keep).slice(0, 100).map((c) => (
                <li key={String(c.credential_id)} className="flex flex-wrap items-center justify-between gap-2 py-2">
                  <Link href={`/admin/credentials?student=${c.user_id}`} className="font-semibold hover:underline">{String(c.student_name)} · {one(c.achievements as { title?: string } | { title?: string }[] | null)?.title ?? ""}</Link>
                  <span className="text-caption text-muted-foreground">{c.type === "certificate" ? "Certificate" : "Badge"} · {date(c.issued_at as string | null)}</span>
                </li>
              ))}
            </ul>
          ) : <p className="mt-2 text-sm text-muted-foreground">{filtering ? "Nothing matches these filters." : "Nothing issued yet."}</p>}
        </section>
      ) : null}
    </div>
  );
}
