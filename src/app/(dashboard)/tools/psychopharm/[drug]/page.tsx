import { notFound } from "next/navigation";
import Link from "next/link";
import { drugFromSlug, drugDetail } from "@/lib/psychopharm/store";
import { DOSE_CAVEAT, STANDING_NOTICE } from "@/lib/psychopharm/forbidden-phrases";
import { DoseLadder } from "@/components/psychopharm/dose-ladder";
import { ObserverNotes } from "@/components/psychopharm/observer-notes";
import { RegisterView } from "@/components/psychopharm/register-view";
import { Badge } from "@/components/ui/badge";

/** Drug + band page. Bands are first-class; the ladder ties them together. */
export default async function DrugPage({ params }: { params: { drug: string } }) {
  const generic = drugFromSlug(params.drug);
  if (!generic) notFound();
  const detail = drugDetail(generic);
  if (!detail) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6 py-6">
      <div className="flex items-center justify-between gap-2">
        <Link href="/tools/psychopharm" className="text-caption text-muted-foreground hover:underline">
          ← Search
        </Link>
        <Link
          href={`/tools/psychopharm/compare?a=${params.drug}&b=`}
          className="text-caption font-medium text-primary hover:underline"
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

      {/* Dose ladder — the signature component (D3). One rung per band. */}
      <DoseLadder drug={detail.generic} bands={detail.bands} />

      {/* Dual register — Student vs Clinician, same verified data. */}
      <RegisterView
        generic={detail.generic}
        plain={detail.plain}
        mechanism={detail.mechanism}
        bands={detail.bands}
        source_id={detail.source_id}
        source_title={detail.source_title}
      />

      <section className="space-y-4 pb-4">
        <h2 className="text-h2">Commonly used in</h2>
        {detail.common_uses ? (
          <p className="text-small">{detail.common_uses}</p>
        ) : (
          <p className="text-small text-muted-foreground">Not covered in our sources.</p>
        )}
      </section>

      {detail.dose_range ? <DoseCaveat /> : null}

      {detail.side_effects_common ? (
        <section className="space-y-4 pb-4">
          <h2 className="text-h2">What to watch for</h2>
          <p className="text-small">{detail.side_effects_common}</p>
          {detail.side_effects_serious ? (
            <p className="text-small">
              <span className="font-semibold">More serious (rare): </span>
              {detail.side_effects_serious}
            </p>
          ) : null}
        </section>
      ) : null}

      {/* Phase 2 observer layer: session observations + therapist questions */}
      <ObserverNotes drugClass={detail.class} />

      <section className="space-y-4 pb-4">
        <h2 className="text-h2">Source</h2>
        <p className="text-small text-muted-foreground">
          <Link href="" className="pointer-events-none">{detail.source_title}</Link>
        </p>
      </section>

      <p className="text-caption text-muted-foreground">{STANDING_NOTICE}</p>
    </div>
  );
}

function DoseCaveat() {
  return <p className="text-caption text-muted-foreground">{DOSE_CAVEAT}</p>;
}