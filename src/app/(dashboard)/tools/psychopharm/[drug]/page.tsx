import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { drugFromSlug, drugDetail } from "@/lib/psychopharm/store";
import { STANDING_NOTICE } from "@/lib/psychopharm/forbidden-phrases";
import { createClient } from "@/lib/supabase/server";
import type { MedicationDocument } from "@/lib/psychopharm/document";
import { DocumentView } from "@/components/psychopharm/document-view";
import { DoseLadder } from "@/components/psychopharm/dose-ladder";
import { DrugBandView } from "@/components/psychopharm/drug-band-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MobileHeader } from "@/components/mobile/mobile-header";
import { MobileStickyAction } from "@/components/mobile/mobile-sticky-action";

/**
 * Drug + band detail: KMS published document if present, else the curated view.
 *
 * Mobile (T32/T25/T68): a real back target + title via MobileHeader, one
 * dominant "Compare this drug" action pinned above the tab bar, and
 * content-shaped skeletons instead of a bare "Loading…" line.
 */
export default async function DrugPage({ params }: { params: Promise<{ drug: string }> }) {
  const { drug } = await params;
  const generic = drugFromSlug(drug);
  if (!generic) notFound();
  const detail = drugDetail(generic);
  if (!detail) notFound();

  // Prefer a published KMS document when one exists (RLS: students see published only).
  const supabase = await createClient();
  const { data: drugRow } = await supabase.from("psych_drugs").select("id").eq("generic_name", generic).maybeSingle();
  let publishedDoc: MedicationDocument | null = null;
  if (drugRow) {
    const { data } = await supabase
      .from("medication_documents")
      .select("document")
      .eq("drug_id", drugRow.id)
      .eq("status", "published")
      .maybeSingle();
    publishedDoc = (data as { document: (typeof publishedDoc) } | null)?.document ?? null;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 py-6 pb-44 lg:pb-6">
      {/* Mobile header — 40px back target + title context. The shell top bar is
          present on this route, so its own safe-area inset is off. */}
      <MobileHeader
        className="lg:hidden"
        inset={false}
        backHref="/tools/psychopharm"
        title={detail.generic}
        subtitle={detail.class}
        actions={
          <Link
            href="/tools/psychopharm"
            aria-label="Search another drug"
            className="flex size-10 items-center justify-center rounded-md border border-border bg-background text-foreground transition-transform active:translate-y-px"
          >
            <Search className="size-5" aria-hidden />
          </Link>
        }
      />

      {/* Desktop back + compare row. */}
      <div className="hidden items-center justify-between gap-2 lg:flex">
        <Link href="/tools/psychopharm" className="text-caption text-muted-foreground hover:underline">
          ← Search
        </Link>
        <Link
          href={`/tools/psychopharm/compare?a=${drug}&b=`}
          className="text-caption font-medium text-link hover:underline"
        >
          Compare →
        </Link>
      </div>

      <header className="space-y-1">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="hidden text-h1 lg:block">{detail.generic}</h1>
          {detail.class ? <Badge variant="secondary">{detail.class}</Badge> : null}
          {!detail.verified ? (
            <Badge variant="outline">in our sources, awaiting review</Badge>
          ) : null}
        </div>
        {detail.plain ? (
          <p className="max-w-2xl text-small text-foreground">{detail.plain}</p>
        ) : null}
      </header>

      {publishedDoc ? (
        <>
          <DocumentView document={publishedDoc} />
          <section className="space-y-4 pb-4">
            <h2 className="text-h2">Source</h2>
            <p className="text-small text-muted-foreground">
              <cite className="not-italic">{detail.source_title}</cite>
            </p>
          </section>
          <p className="text-caption text-muted-foreground">{STANDING_NOTICE}</p>
        </>
      ) : (
        <>
          {/* Dose ladder — the signature component (D3). One rung per band. */}
          <Suspense
            fallback={
              <div className="space-y-3" aria-label="Loading dose bands">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            }
          >
            <DoseLadder drug={detail.generic} bands={detail.bands} />
          </Suspense>

          {/* Band-aware body: tapping a dose-ladder rung switches this content. */}
          <Suspense
            fallback={
              <div className="space-y-6" aria-label="Loading drug details">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            }
          >
            <DrugBandView
              class={detail.class}
              plain={detail.plain}
              mechanism={detail.mechanism}
              common_uses={detail.common_uses}
              dose_range={detail.dose_range}
              side_effects_common={detail.side_effects_common}
              side_effects_serious={detail.side_effects_serious}
              bands={detail.bands}
              onsetTime={detail.onset_time}
              onsetKb={detail.onset_kb}
              onsetKbPage={detail.onset_kb_page}
              halfLife={detail.half_life}
              halfLifePage={detail.half_life_page}
              sourceTitle={detail.source_title}
              contraindications={detail.contraindications}
              interactions={detail.interactions}
              monitoring={detail.monitoring}
              overdose={detail.overdose}
              special_populations={detail.special_populations}
              patient_counseling={detail.patient_counseling}
            />
          </Suspense>
        </>
      )}

      {!publishedDoc ? (
        <>
          <section className="space-y-4 pb-4">
            <h2 className="text-h2">Source</h2>
            <p className="text-small text-muted-foreground">
              <cite className="not-italic">{detail.source_title}</cite>
            </p>
          </section>
          <p className="text-caption text-muted-foreground">{STANDING_NOTICE}</p>
        </>
      ) : null}

      {/* ONE dominant action — pinned above the tab bar on mobile (T32). */}
      <div className="lg:hidden">
        <MobileStickyAction
          offsetForNav
          meta={detail.class ? `${detail.generic} · ${detail.class}` : detail.generic}
        >
          <Button asChild variant="default" size="lg" className="h-12 w-full">
            <Link href={`/tools/psychopharm/compare?a=${drug}&b=`}>Compare this drug</Link>
          </Button>
        </MobileStickyAction>
      </div>
    </div>
  );
}
