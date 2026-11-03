import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { SiteFooter } from "@/components/site/site-footer";
import { ShieldCheck, ShieldX, HelpCircle } from "lucide-react";

// Public verification — never indexed, no auth required.
export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * Public credential verification. Reads the authoritative record server-side
 * (service role) by opaque credential_id and returns ONLY approved public
 * fields: display name, credential title, institution, issue date, credential
 * id and status. Revoked credentials keep their URL and show "Revoked".
 */
export default async function VerifyCertificatePage({ params }: { params: Promise<{ certificateId: string }> }) {
  const { certificateId } = await params;
  const admin = createAdminClient();

  const { data: cred } = await admin
    .from("credentials")
    .select("credential_id, student_name, status, issued_at, revoked_at, achievements(title)")
    .eq("credential_id", certificateId)
    .maybeSingle();

  if (!cred) {
    return (
      <div className="flex min-h-screen flex-col bg-background px-5">
        <main className="flex flex-1 items-center justify-center">
          <Card className="w-full max-w-md hard-shadow-md">
            <CardContent className="p-6 text-center">
              <HelpCircle className="mx-auto size-10 text-muted-foreground" aria-hidden />
              <p className="mt-3 text-h2">Invalid credential</p>
              <p className="mt-2 text-small text-muted-foreground">This credential could not be verified. Check the link or contact the issuing institution.</p>
            </CardContent>
          </Card>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const a = Array.isArray(cred.achievements) ? cred.achievements[0] : cred.achievements;
  const title = (a?.title as string) ?? "VIBHA School of Psychology";
  const verified = cred.status === "issued";
  const revoked = cred.status === "revoked";

  return (
    <div className="flex min-h-screen flex-col bg-background px-5">
      <main className="flex flex-1 items-center justify-center py-10">
        <Card className="w-full max-w-md hard-shadow-md">
          <CardContent className="space-y-4 p-6 text-center">
            <p className="text-eyebrow text-link">VIBHA School of Psychology</p>
            <div className="flex flex-col items-center gap-2">
              {verified ? (
                <span className="inline-flex items-center gap-2 rounded-full border-2 border-foreground bg-primary px-3 py-1 text-sm font-bold text-primary-foreground">
                  <ShieldCheck className="size-4" aria-hidden /> Verified
                </span>
              ) : revoked ? (
                <span className="inline-flex items-center gap-2 rounded-full border-2 border-foreground bg-card px-3 py-1 text-sm font-bold text-red-600">
                  <ShieldX className="size-4" aria-hidden /> Revoked
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full border-2 border-foreground bg-card px-3 py-1 text-sm font-bold">
                  <HelpCircle className="size-4" aria-hidden /> Not issued
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">This certifies that</p>
            <p className="text-h2">{cred.student_name}</p>
            <p className="text-sm text-muted-foreground">earned</p>
            <p className="text-h3">{title}</p>
            {verified && cred.issued_at ? <p className="text-caption text-muted-foreground">Issued {new Date(cred.issued_at).toLocaleDateString()}</p> : null}
            {revoked && cred.revoked_at ? <p className="text-caption text-red-600">Revoked {new Date(cred.revoked_at).toLocaleDateString()}</p> : null}
            <p className="break-all font-mono text-[0.65rem] text-muted-foreground">Credential ID {cred.credential_id}</p>
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}
