import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { SetPasswordForm } from "./set-password-form";

export const metadata: Metadata = {
  title: "Set your password",
  robots: { index: false, follow: false },
};

// Client-side Supabase auth page: force-dynamic so it's never statically
// prerendered at build time. Prerendering this server-renders SetPasswordForm,
// whose browser Supabase client throws when env vars are absent (preview
// deployments without the Supabase envs failed the whole build here).
export const dynamic = "force-dynamic";

/** Same sign-in layout as /login and /setup, so the three feel like one flow. */
export default function SetPasswordPage() {
  return (
    <AuthShell title="Set your password" subtitle="You'll use it every time you sign in.">
      <SetPasswordForm />
    </AuthShell>
  );
}
