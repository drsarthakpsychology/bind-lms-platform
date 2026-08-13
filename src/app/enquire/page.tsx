import type { Metadata } from "next";
import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { LandingNav } from "@/components/landing/landing-nav";
import { EnquireForm } from "./enquire-form";

export const metadata: Metadata = {
  title: "Enquire",
  robots: { index: true, follow: true },
};

/**
 * /enquire — the one honest public CTA. No signup exists (invite-only), so this
 * captures the lead and feeds the existing WhatsApp/Brevo enrolment workflow.
 */
export default function EnquirePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingNav />
      <main className="mx-auto w-full max-w-xl flex-1 px-5 py-14 sm:px-6">
        <Link href="/" className="inline-flex text-caption font-medium text-muted-foreground transition-colors hover:text-foreground">
          ← Back
        </Link>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-foreground sm:text-5xl">Enquire</h1>
        <p className="mt-3 text-base text-muted-foreground">
          Tell us who you are. {BRAND.name} is invite-only and admission to Cohort One
          is a conversation, not a form.
        </p>
        <div className="mt-8 rounded-md border-2 border-foreground bg-card p-6 hard-shadow-md sm:p-8">
          <EnquireForm />
        </div>
        <p className="mt-5 text-caption text-muted-foreground">
          We&apos;ll reply personally. Your details go only to the admissions team.
        </p>
      </main>
    </div>
  );
}
