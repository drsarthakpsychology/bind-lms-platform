import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getPolicies, getPolicy } from "@/lib/policies";
import { PolicyLayout } from "@/components/policies/policy-layout";
import { policyMdxComponents } from "@/components/policies/policy-mdx";
import { SiteFooter } from "@/components/site/site-footer";
import { LEGAL } from "@/lib/legal-constants";

export const revalidate = 3600;

/** One route per policy — all 14 pre-rendered at build (editable content). */
export function generateStaticParams() {
  return getPolicies().map((p) => ({ slug: p.meta.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const policy = getPolicy(slug);
  if (!policy) {
    return { title: "Policy not found", robots: { index: false, follow: false } };
  }
  return {
    title: policy.meta.title,
    description: policy.meta.summary,
    robots: { index: true, follow: true },
    alternates: { canonical: `/policies/${policy.meta.slug}` },
  };
}

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const policies = getPolicies();
  const policy = getPolicy(slug);
  if (!policy) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${policy.meta.title} — ${LEGAL.operatingName}`,
    description: policy.meta.summary,
    url: `/policies/${policy.meta.slug}`,
    dateModified: policy.meta.lastUpdated,
    isPartOf: { "@type": "WebSite", name: LEGAL.operatingName, url: "/" },
  };

  return (
    <div className="flex min-h-dvh flex-col bg-surface-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PolicyLayout policies={policies} current={policy} headings={policy.headings}>
        <MDXRemote
          source={policy.body}
          components={policyMdxComponents}
          options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
        />
      </PolicyLayout>
      <SiteFooter />
    </div>
  );
}
