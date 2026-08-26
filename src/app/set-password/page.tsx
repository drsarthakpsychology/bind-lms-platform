import type { Metadata } from "next";
import { VibhaWordmark } from "@/components/brand/vibha-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { SiteFooter } from "@/components/site/site-footer";
import { SetPasswordForm } from "./set-password-form";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function SetPasswordPage() {
  return (
    <div className="flex min-h-svh flex-col bg-background px-5 py-8">
      <div className="flex items-center justify-between">
        <VibhaWordmark size={30} />
        <ThemeToggle />
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-2">
            <h1 className="text-h1">Set your password</h1>
            <p className="text-small text-muted-foreground">
              Choose the password you&apos;ll use to sign in.
            </p>
          </div>
          <div className="rounded-lg border-2 border-foreground bg-card p-6 hard-shadow-md sm:p-7">
            <SetPasswordForm />
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
