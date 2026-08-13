import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { drugFromSlug, drugDetail } from "@/lib/psychopharm/store";
import { STANDING_NOTICE } from "@/lib/psychopharm/forbidden-phrases";
import { createClient } from "@/lib/supabase/server";
import type { MedicationDocument } from "@/lib/psychopharm/document";
import { DocumentView } from "@/components/psychopharm/document-view";
import { DoseLadder } from "@/components/psychopharm/dose-ladder";
import { DrugBandView } from "@/components/psychopharm/drug-band-view";
import { Badge } from "@/components/ui/badge";

/**
 * Drug + band detail: KMS published document if present, else the curated view.
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
    <div className="mx-auto max-w-3xl space-y-6 py-6">
      <div className="flex items-center justify-between gap-2">
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
          <h1 className="text-h1">{detail.generic}</h1>
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
          <Suspense fallback={<p className="text-small text-muted-foreground">Loading dose bands…</p>}>
            <DoseLadder drug={detail.generic} bands={detail.bands} />
          </Suspense>

          {/* Band-aware body: tapping a dose-ladder rung switches this content. */}
          <Suspense fallback={<p className="text-small text-muted-foreground">Loading…</p>}>
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
    </div>
  );
}
