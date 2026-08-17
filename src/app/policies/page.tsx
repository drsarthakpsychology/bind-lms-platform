import type { Metadata } from "next";
import Link from "next/link";
import { getPolicies } from "@/lib/policies";
import { SectionEyebrow, Rule } from "@/components/landing/landing-primitives";
import { SiteFooter } from "@/components/site/site-footer";
import { LEGAL } from "@/lib/legal-constants";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Policies",
  description:
    "The terms, privacy, refund, grievance and other policies that govern the VIBHA School of Psychology courses and website.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/policies" },
};

export default function PoliciesIndexPage() {
  const policies = getPolicies();
  return (
    <div className="flex min-h-dvh flex-col bg-surface-1">
      <main className="rail flex-1 py-10 sm:py-16">
        <header className="mb-10 max-w-2xl space-y-3">
          <SectionEyebrow index="01">Policies</SectionEyebrow>
          <h1 className="text-display text-foreground">
            The rules that govern the school
          </h1>
          <p className="max-w-[62ch] text-body text-muted-foreground">
            These policies apply to every learner and every visitor to
            vibhapsychology.com. The version in force on the day you pay is the
            one that governs your enrolment.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          {policies.map((p, i) => (
            <Link
              key={p.meta.slug}
              href={`/policies/${p.meta.slug}`}
              className="group flex min-h-44 flex-col justify-between rounded-lg border-2 border-foreground bg-card p-5 transition-[transform,box-shadow] duration-base ease-snappy hover:-translate-y-0.5 hover:hard-shadow-md active:translate-y-px"
            >
              <div className="space-y-2">
                <p
                  aria-hidden
                  className="font-mono text-sm font-black tracking-normal text-link"
                >
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h2 className="text-h2 text-foreground group-hover:text-link">
                  {p.meta.title}
                </h2>
                <p className="text-small leading-relaxed text-muted-foreground">
                  {p.meta.summary}
                </p>
              </div>
              <Rule className="pt-3" />
            </Link>
          ))}
        </div>

        <p className="mt-10 max-w-2xl text-caption text-muted-foreground">
          VIBHA School of Psychology · {LEGAL.entityType} ·{" "}
          {LEGAL.contactEmail} · {LEGAL.phone}
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
