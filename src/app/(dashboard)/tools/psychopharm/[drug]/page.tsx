import { notFound } from "next/navigation";
import Link from "next/link";
import { drugFromSlug, drugDetail } from "@/lib/psychopharm/store";
import { DOSE_CAVEAT, STANDING_NOTICE } from "@/lib/psychopharm/forbidden-phrases";
import { DoseLadder } from "@/components/psychopharm/dose-ladder";
import { Badge } from "@/components/ui/badge";

/** Drug + band page. Bands are first-class; the ladder ties them together. */
export default async function DrugPage({ params }: { params: { drug: string } }) {
  const generic = drugFromSlug(params.drug);
  if (!generic) notFound();
  const detail = drugDetail(generic);
  if (!detail) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6 py-6">
      <Link href="/tools/psychopharm" className="text-caption text-muted-foreground hover:underline">
        ← Search
      </Link>

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

      {/* Sections ordered by the question being asked (D4). */}
      <section className="space-y-4 pb-4">
        <h2 className="text-h2">What it does in the brain</h2>
        {detail.mechanism ? (
          <p className="text-small">{detail.mechanism}</p>
        ) : (
          <p className="text-small text-muted-foreground">Not covered in our sources.</p>
        )}
      </section>

      <section className="space-y-4 pb-4">
        <h2 className="text-h2">Commonly used in</h2>
        {detail.common_uses ? (
          <p className="text-small">{detail.common_uses}</p>
        ) : (
          <p className="text-small text-muted-foreground">Not covered in our sources.</p>
        )}
      </section>

      <section className="space-y-4 pb-4">
        <h2 className="text-h2">Typical ranges described in our sources</h2>
        {detail.dose_range ? (
          <>
            <p className="text-small">{detail.dose_range}</p>
            <DoseCaveat />
          </>
        ) : (
          <p className="text-small text-muted-foreground">Not covered in our sources.</p>
        )}
      </section>

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