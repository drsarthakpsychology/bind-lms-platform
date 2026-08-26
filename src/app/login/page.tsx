import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { BRAND } from "@/lib/brand";
import { VibhaWordmark } from "@/components/brand/vibha-logo";
import { Reveal } from "@/components/motion/reveal";
import { ThemeToggle } from "@/components/theme-toggle";
import { SiteFooter } from "@/components/site/site-footer";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const session = await getSession();

  if (session.status === "ok") {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-svh flex-col bg-background px-5 py-8">
      <div className="flex items-center justify-between">
        <VibhaWordmark size={30} />
        <ThemeToggle />
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-sm space-y-6">
          <Reveal>
            <div className="space-y-2">
              <h1 className="text-h1">Sign in</h1>
              <p className="text-small text-muted-foreground">
                {BRAND.tagline}. Invite-only — use the credentials your administrator sent you.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-lg border-2 border-foreground bg-card p-6 hard-shadow-md sm:p-7">
              <LoginForm />
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="flex items-center justify-center gap-1.5 text-caption text-muted-foreground">
              <Sparkles className="size-3.5" aria-hidden />
              {BRAND.name} is a private learning platform
            </p>
          </Reveal>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
