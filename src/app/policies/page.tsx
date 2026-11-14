import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPolicies, type Policy } from "@/lib/policies";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { LEGAL } from "@/lib/legal-constants";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Policies",
  description:
    "The terms, privacy, refund, grievance and other policies that govern the VIBHA School of Psychology courses and website.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/policies" },
};

/**
 * Grouped by the question a reader arrives with, instead of fourteen
 * identical cards. Any policy not named here still shows, under "Other", so a
 * new policy file can never go missing from the index.
 */
const GROUPS: { title: string; slugs: string[] }[] = [
  { title: "Joining and paying", slugs: ["terms", "refund", "fees", "delivery"] },
  { title: "While you study", slugs: ["attendance", "examination", "certificate", "code-of-conduct", "confidentiality"] },
  { title: "Your data and this website", slugs: ["privacy", "cookies", "terms-of-use", "disclaimer"] },
  { title: "If something goes wrong", slugs: ["grievance"] },
];

function grouped(policies: Policy[]) {
  const bySlug = new Map(policies.map((p) => [p.meta.slug, p]));
  const used = new Set<string>();
  const out = GROUPS.map((g) => ({
    title: g.title,
    items: g.slugs.flatMap((s) => {
      const p = bySlug.get(s);
      if (!p) return [];
      used.add(s);
      return [p];
    }),
  })).filter((g) => g.items.length);
  const rest = policies.filter((p) => !used.has(p.meta.slug));
  if (rest.length) out.push({ title: "Other", items: rest });
  return out;
}

export default function PoliciesIndexPage() {
  const groups = grouped(getPolicies());
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />
      <main className="rail w-full flex-1 py-10 sm:py-16">
        <header className="max-w-2xl">
          <p className="flex items-center gap-2 text-eyebrow text-link">
            <span aria-hidden className="size-2 rounded-full border border-foreground bg-primary" />
            Policies
          </p>
          <h1 className="mt-3 text-display text-foreground">The rules of the school</h1>
          <p className="mt-4 max-w-[60ch] text-body text-muted-foreground">
            For every learner and every visitor to vibhapsychology.com. The version in force on the day you pay is
            the one that governs your enrolment.
          </p>
        </header>

        <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-8">
          {groups.map((g, gi) => (
            <section key={g.title} aria-labelledby={`policy-group-${gi}`} className="self-start">
              <h2 id={`policy-group-${gi}`} className="text-h3 text-foreground">
                {g.title}
              </h2>
              <ul className="mt-3 divide-y-2 divide-foreground/10 overflow-hidden rounded-xl border-2 border-foreground bg-card hard-shadow-sm">
                {g.items.map((p) => (
                  <li key={p.meta.slug}>
                    <Link
                      href={`/policies/${p.meta.slug}`}
                      className="group flex min-h-16 items-center gap-4 px-4 py-3.5 transition-colors duration-150 hover:bg-accent focus-visible:bg-accent sm:px-5"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-foreground group-hover:text-link">{p.meta.title}</span>
                        <span className="mt-0.5 block text-small text-muted-foreground">{p.meta.summary}</span>
                      </span>
                      <ArrowRight
                        aria-hidden
                        className="size-4 shrink-0 text-muted-foreground transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-foreground"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <p className="mt-12 max-w-2xl text-small text-muted-foreground">
          Questions about a policy? Write to{" "}
          <a href={`mailto:${LEGAL.contactEmail}`} className="font-semibold text-link underline underline-offset-4">
            {LEGAL.contactEmail}
          </a>{" "}
          or call{" "}
          <a href={`tel:${LEGAL.phone.replace(/\s+/g, "")}`} className="font-semibold text-link underline underline-offset-4">
            {LEGAL.phone}
          </a>
          . VIBHA School of Psychology, {LEGAL.entityType}.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
