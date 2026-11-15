import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/**
 * The old "Find & issue" address. Certificates now has one place to issue
 * (the studio) and one list of everything issued; old links land there.
 *   ?student=ID  -> issue to that student
 *   ?q=roll      -> that student's things in the Issued list
 *   ?mode=anyone -> issue to someone without an account
 */
export default async function CredentialsIndex({ searchParams }: { searchParams: Promise<{ q?: string; student?: string; mode?: string; type?: string; status?: string }> }) {
  const sp = await searchParams;
  if (sp.mode === "anyone") redirect("/admin/credentials/studio?what=anyone");
  if (sp.student) redirect(`/admin/credentials/studio?student=${encodeURIComponent(sp.student)}`);
  if (sp.q || sp.type || sp.status) {
    const p = new URLSearchParams();
    if (sp.q) p.set("q", sp.q);
    if (sp.type === "badge" || sp.type === "certificate") p.set("type", sp.type);
    if (sp.status === "revoked") p.set("status", "revoked");
    if (sp.status === "pending") p.set("status", "draft");
    redirect(`/admin/credentials/issued?${p.toString()}`);
  }
  redirect("/admin/credentials/studio");
}
