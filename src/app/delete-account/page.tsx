import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { LEGAL } from "@/lib/legal-constants";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Delete your account",
  description:
    "How to ask VIBHA School of Psychology to delete your account and data, in the Vibha Psychology app or by email.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/delete-account" },
};

const SUBJECT = "Delete my account";

/**
 * The public account deletion page Google Play asks for (the app's store
 * listing links here). It must work for someone who no longer has the app.
 */
export default function DeleteAccountPage() {
  const mailto = `mailto:${LEGAL.contactEmail}?subject=${encodeURIComponent(SUBJECT)}`;
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />
      <main className="rail w-full flex-1 py-10 sm:py-16">
        <header className="max-w-2xl">
          <p className="flex items-center gap-2 text-eyebrow text-link">
            <span aria-hidden className="size-2 rounded-full border border-foreground bg-primary" />
            Your data
          </p>
          <h1 className="mt-3 text-display text-foreground">Delete your account</h1>
          <p className="mt-4 max-w-[60ch] text-body text-muted-foreground">
            For the Vibha Psychology app and this website: it is one account. Ask in either of these two ways.
          </p>
        </header>

        <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-8">
          <section aria-labelledby="way-app" className="self-start rounded-xl border-2 border-foreground bg-card p-5 hard-shadow-sm sm:p-6">
            <h2 id="way-app" className="text-h3 text-foreground">
              In the app
            </h2>
            <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-body text-foreground">
              <li>Open Vibha Psychology and sign in.</li>
              <li>
                Tap <strong>Me</strong>, then <strong>Settings</strong>.
              </li>
              <li>
                Tap <strong>Ask to delete my account</strong>, then <strong>Send the request</strong>.
              </li>
            </ol>
          </section>

          <section aria-labelledby="way-email" className="self-start rounded-xl border-2 border-foreground bg-card p-5 hard-shadow-sm sm:p-6">
            <h2 id="way-email" className="text-h3 text-foreground">
              By email
            </h2>
            <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-body text-foreground">
              <li>
                Write to{" "}
                <a href={mailto} className="font-semibold text-link underline underline-offset-4">
                  {LEGAL.contactEmail}
                </a>{" "}
                from the email address you sign in with.
              </li>
              <li>
                Subject: <strong>{SUBJECT}</strong>. Add your full name.
              </li>
            </ol>
          </section>
        </div>

        <div className="mt-12 max-w-2xl space-y-8">
          <section aria-labelledby="what-next">
            <h2 id="what-next" className="text-h3 text-foreground">
              What happens next
            </h2>
            <p className="mt-2 text-body text-muted-foreground">
              We reply within 7 days to check the request is really from you. Once it is, we delete your account within
              30 days and write to tell you it is done.
            </p>
          </section>

          <section aria-labelledby="what-goes">
            <h2 id="what-goes" className="text-h3 text-foreground">
              What we delete
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-body text-muted-foreground">
              <li>Your sign-in, name, email, phone number and roll number</li>
              <li>Your progress, answers, test results, highlights and notes</li>
              <li>Doubts and replies you wrote</li>
              <li>Assignment answers, files and voice recordings you handed in</li>
              <li>Your phone records (the app&apos;s phone id and push messages address) and notification settings</li>
              <li>Your certificates: they can no longer be checked online</li>
            </ul>
          </section>

          <section aria-labelledby="what-stays">
            <h2 id="what-stays" className="text-h3 text-foreground">
              What we keep, and for how long
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-body text-muted-foreground">
              <li>Payment and invoice records, for eight years, because Indian tax law requires it.</li>
              <li>
                If you want your certificate to stay checkable, say so in your request: we then keep only the certificate
                record, for eight years after you finish.
              </li>
            </ul>
            <p className="mt-3 text-body text-muted-foreground">
              You can also ask us to delete only part of your data, for example your voice recordings, without closing
              your account. Write to the same address.
            </p>
          </section>

          <p className="text-small text-muted-foreground">
            More in our{" "}
            <Link href="/policies/privacy" className="font-semibold text-link underline underline-offset-4">
              Privacy Policy
            </Link>
            . {LEGAL.operatingName}, {LEGAL.phone}.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
