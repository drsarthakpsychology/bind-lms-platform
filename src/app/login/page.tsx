import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { CONTACT } from "@/components/home/content";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; setup?: string }>;
}) {
  const session = await getSession();

  if (session.status === "ok") {
    redirect("/dashboard");
  }

  const { email, setup } = await searchParams;
  const defaultEmail = typeof email === "string" && email.length < 200 ? email : undefined;

  return (
    <AuthShell
      title="Sign in"
      subtitle="Use the email you were invited with."
    >
      {setup === "done" ? (
        <p className="mb-4 flex items-center gap-2 rounded-xl border-2 border-foreground bg-primary px-3 py-2 text-sm font-bold text-primary-foreground">
          <CheckCircle2 className="size-4 shrink-0" aria-hidden />
          Password set. Sign in to start.
        </p>
      ) : null}
      <LoginForm defaultEmail={defaultEmail} />
      <p className="mt-5 border-t-2 border-foreground/10 pt-4 text-small text-muted-foreground">
        Forgot your password?{" "}
        <a href={CONTACT.whatsappHref} className="font-semibold text-link underline underline-offset-4 hover:text-foreground">
          Message us on WhatsApp
        </a>{" "}
        for a new setup link.
      </p>
    </AuthShell>
  );
}
