import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { BRAND } from "@/lib/brand";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; setup?: string; why?: string }>;
}) {
  const session = await getSession();

  if (session.status === "ok") {
    redirect("/dashboard");
  }

  const { email, setup, why } = await searchParams;
  const defaultEmail = typeof email === "string" && email.length < 200 ? email : undefined;

  return (
    <AuthShell
      title="Sign in"
      subtitle={`${BRAND.tagline} Invite-only: use the email your programme added.`}
    >
      {setup === "done" ? (
        <p className="mb-4 flex items-center gap-2 rounded-xl border-2 border-foreground bg-primary px-3 py-2 text-sm font-bold text-primary-foreground">
          <CheckCircle2 className="size-4 shrink-0" aria-hidden />
          Password set. Sign in to start.
        </p>
      ) : why === "elsewhere" ? (
        <p role="status" className="mb-4 rounded-xl border-2 border-foreground bg-card px-3 py-2 text-sm font-semibold">
          You were signed out here because your account was opened on another device. Sign in again to carry on.
        </p>
      ) : null}
      <LoginForm defaultEmail={defaultEmail} />
      <p className="mt-4 text-caption text-muted-foreground">
        Forgot your password? Message us on WhatsApp and we&apos;ll send you a new setup link.
      </p>
    </AuthShell>
  );
}
