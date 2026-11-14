import type { Metadata } from "next";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader, SiteHeaderLink } from "@/components/site/site-header";
import { COHORT, CONTACT, JOIN_STEPS } from "@/components/home/content";
import { WaitlistForm } from "./waitlist-form";

export const metadata: Metadata = {
  title: "Request an invitation",
  robots: { index: true, follow: true },
};

/**
 * /waitlist: where every "Request an invitation" button lands. Invite-only,
 * so this captures the request and feeds the WhatsApp/Brevo enrolment flow.
 *
 * Layout: laptops get the short pitch (sticky) beside the form; phones get
 * the title, one line of facts, then the form straight away, with the three
 * joining steps after it. Every fact comes from the homepage content file
 * (cohort, dates, steps, phone), so this page can never disagree with it.
 */
export default function WaitlistPage() {
  const starts = COHORT.starts.charAt(0).toLowerCase() + COHORT.starts.slice(1);
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader>
        <SiteHeaderLink href="/login">Sign in</SiteHeaderLink>
      </SiteHeader>

      <main className="rail w-full flex-1 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
          <div className="lg:sticky lg:top-10 lg:self-start">
            <p className="flex items-center gap-2 text-eyebrow text-link">
              <span aria-hidden className="size-2 rounded-full border border-foreground bg-primary" />
              {COHORT.label} · by invitation
            </p>
            <h1 className="mt-3 text-display text-foreground">Request an invitation</h1>
            <p className="mt-3 max-w-[46ch] text-body text-muted-foreground">
              {COHORT.length} of supervised clinical training. Starts in the {starts}, {COHORT.where}.
            </p>

            {/* The joining steps: under the form on phones, beside it on laptops. */}
            <ol className="mt-8 hidden space-y-0 border-y-2 border-foreground lg:block" aria-label="How joining works">
              <Steps />
            </ol>
          </div>

          <div>
            <div className="rounded-xl border-2 border-foreground bg-card p-5 hard-shadow-md sm:p-8">
              <WaitlistForm />
            </div>
            <ol className="mt-8 border-y-2 border-foreground lg:hidden" aria-label="How joining works">
              <Steps />
            </ol>
            <p className="mt-6 text-small text-muted-foreground">
              Rather talk now? Call or WhatsApp{" "}
              <a href={CONTACT.whatsappHref} className="font-semibold text-link underline underline-offset-4 hover:text-foreground">
                {CONTACT.phone}
              </a>
              .
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Steps() {
  return (
    <>
      {JOIN_STEPS.map((s, i) => (
        <li key={s.title} className="flex gap-4 border-b-2 border-foreground/15 py-4 last:border-b-0">
          <span aria-hidden className="pt-0.5 font-mono text-sm font-bold text-link">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span>
            <span className="block font-semibold text-foreground">{s.title}</span>
            <span className="mt-0.5 block text-small text-muted-foreground">{s.text}</span>
          </span>
        </li>
      ))}
    </>
  );
}
