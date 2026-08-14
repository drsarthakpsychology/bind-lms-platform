import type { Metadata } from "next";
import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { Reveal } from "@/components/motion/reveal";
import { LandingNav } from "@/components/landing/landing-nav";
import { EnquireForm } from "./enquire-form";

export const metadata: Metadata = {
  title: "Enquire",
  robots: { index: true, follow: true },
};

/**
 * /enquire — the one honest public CTA. No signup exists (invite-only), so this
 * captures the lead and feeds the existing WhatsApp/Brevo enrolment workflow.
 * Two-column at lg: the invite pitch (sticky) beside the enquiry sheet. All
 * copy is existing words; nothing new is claimed.
 */

const STEPS = [
  { num: "01", text: "Tell us who you are." },
  { num: "02", text: "We reply personally." },
  { num: "03", text: "A conversation, not a form." },
] as const;

export default function EnquirePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingNav />
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-14 sm:px-6">
        <Reveal>
          <Link
            href="/"
            className="inline-flex text-caption font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Back
          </Link>
        </Reveal>

        <div className="mt-3 grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          {/* The invite pitch — sticky on lg so it stays beside the sheet. */}
          <div className="lg:sticky lg:top-24">
            <Reveal delay={0.06}>
              <p className="text-eyebrow text-muted-foreground">Cohort One · Invite-only</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-foreground sm:text-5xl">
                Enquire
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-4 text-base text-muted-foreground">
                Tell us who you are. {BRAND.name} is invite-only and admission to Cohort One
                is a conversation, not a form.
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <ol className="mt-8 divide-y-2 divide-foreground border-y-2 border-foreground">
                {STEPS.map((s) => (
                  <li key={s.num} className="flex items-baseline gap-3 py-3">
                    <span aria-hidden className="font-mono text-sm font-black tracking-normal text-link">
                      {s.num}
                    </span>
                    <span className="font-semibold text-foreground">{s.text}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>

          {/* The enquiry sheet. */}
          <Reveal delay={0.2}>
            <div className="rounded-md border-2 border-foreground bg-card p-6 hard-shadow-md sm:p-8">
              <EnquireForm />
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.24}>
          <p className="mt-8 text-caption text-muted-foreground">
            We&apos;ll reply personally. Your details go only to the admissions team.
          </p>
        </Reveal>
      </main>
    </div>
  );
}
