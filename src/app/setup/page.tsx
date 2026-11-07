import type { Metadata } from "next";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/server";
import { hashSetupToken } from "@/lib/auth/roster";
import { AuthShell } from "@/components/auth/auth-shell";
import { SetupForm } from "./setup-form";
import { nowMs } from "@/lib/crm/people";

export const metadata: Metadata = { robots: { index: false, follow: false }, title: "Set up your account" };
export const dynamic = "force-dynamic";

/**
 * /setup?t=…: the page a one-time setup link opens. Opening it only CHECKS
 * the link (read-only); the password form's submit is what uses it up.
 */
export default async function SetupPage({ searchParams }: { searchParams: Promise<{ t?: string }> }) {
  const { t } = await searchParams;
  const token = typeof t === "string" && t.length < 200 ? t : "";

  let email: string | null = null;
  let problem: string | null = token ? null : "This link is missing its code.";
  if (token) {
    const admin = createAdminClient();
    const { data: row } = await admin
      .from("account_setup_tokens")
      .select("email, expires_at, used_at, revoked_at")
      .eq("token_hash", hashSetupToken(token))
      .maybeSingle();
    if (!row) problem = "We don't recognise this link.";
    else if (row.used_at) problem = "This link has already been used. If that was you, just sign in.";
    else if (row.revoked_at) problem = "A newer link was sent, so this one no longer works. Use the latest one.";
    else if (new Date(row.expires_at as string).getTime() < nowMs()) problem = "This link has expired.";
    else email = row.email as string;
  }

  return (
    <AuthShell
      title={problem ? "Link not working" : "Set your password"}
      subtitle={problem ? "No problem: this is easy to fix." : `For ${email}. You'll use it every time you sign in.`}
    >
      {problem ? (
        <div className="space-y-4">
          <p className="text-sm font-semibold">{problem}</p>
          <p className="text-sm text-muted-foreground">Message us on WhatsApp and we&apos;ll send you a fresh link in a minute.</p>
          <Link href="/login" className="inline-flex h-10 items-center rounded-full border-2 border-foreground bg-primary px-5 text-sm font-bold text-primary-foreground">
            Go to sign in
          </Link>
        </div>
      ) : (
        <SetupForm token={token} email={email ?? ""} />
      )}
    </AuthShell>
  );
}
