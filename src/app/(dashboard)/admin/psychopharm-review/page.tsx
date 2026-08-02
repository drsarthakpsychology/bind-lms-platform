import { PageHeader } from "@/components/design-system/page-header";
import { Badge } from "@/components/ui/badge";
import { DRAFT_DRUGS } from "@/lib/psychopharm/draft-seed";
import { SOURCES } from "@/lib/psychopharm/sources";

/**
 * Reviewer queue (Part 8). Sorted by prescribing frequency (catalog order).
 * For each drug, the extracted fields are shown with their source snippet +
 * page so Dr. Sarthak approves against the source, not memory. Bulk approve is
 * disabled for dose fields (doses approved one at a time, always).
 *
 * This is an admin-only route, behind the (dashboard)/admin guard.
 */
export default function PsychReviewPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Reviewer"
        title="Psychopharm review queue"
        description={`${DRAFT_DRUGS.length} curated drugs. Doses are approved one at a time — never bulk.`}
        badge={
          <Badge variant="outline">
            {DRAFT_DRUGS.length} draft / in-review records
          </Badge>
        }
      />

      <div className="space-y-6">
        {DRAFT_DRUGS.map((drug) => (
          <ReviewDrugCard key={drug.generic_name} generic={drug.generic_name} />
        ))}
      </div>
    </div>
  );
}

function ReviewDrugCard({ generic }: { generic: string }) {
  const drug = DRAFT_DRUGS.find((d) => d.generic_name === generic);
  if (!drug) return null;
  const srcId = drug.bands[0]?.source_ref.source_id ?? "stahl_pg_7th";
  const src = SOURCES[srcId];
  return (
    <section className="rounded-md border-2 border-border bg-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-h2">{drug.generic_name}</h2>
        <Badge variant="secondary">{drug.drug_class}</Badge>
      </div>

      <div className="space-y-3">
        <ReviewRow
          label="Mechanism"
          value={drug.mechanism[0]?.value ?? "—"}
          snippet={drug.mechanism[0]?.snippet ?? ""}
          page={drug.mechanism[0]?.page_ref ?? ""}
          sourceRef={src ? `${src.title} (${src.edition})` : srcId}
        />
        {drug.bands.map((band, i) => (
          <ReviewRow
            key={i}
            label={`Band ${band.band_order} — ${band.range_low ?? "?"}–${band.range_high ?? "?"} ${band.unit}`}
            value={band.primary_purpose ?? "—"}
            snippet={band.source_ref?.snippet ?? ""}
            page={band.source_ref?.page_ref ?? ""}
            sourceRef={SOURCES[band.source_ref?.source_id ?? "stahl_pg_7th"]?.title ?? ""}
            isDose
          />
        ))}
      </div>

      <p className="mt-4 text-caption text-muted-foreground">
        Review status: awaiting DB wiring. Once the psychopharm migrations are
        applied, approve / edit / reject actions here will write to the audit
        log per field (keyboard-driven, doses always single-approve).
      </p>
    </section>
  );
}

function ReviewRow({
  label,
  value,
  snippet,
  page,
  sourceRef,
  isDose,
}: {
  label: string;
  value: string;
  snippet: string;
  page: string;
  sourceRef: string;
  isDose?: boolean;
}) {
  return (
    <div className={`grid gap-2 sm:grid-cols-2 ${isDose ? "rounded border-2 border-dashed border-primary/40 p-3" : ""}`}>
      <div>
        <p className="text-caption font-semibold uppercase text-muted-foreground">{label}</p>
        <p className="text-small">{value}</p>
      </div>
      <div>
        <p className="text-caption text-muted-foreground">
          {sourceRef} · p{page}
        </p>
        <blockquote className="mt-1 border-l-2 border-border pl-3 text-caption text-muted-foreground italic">
          “{snippet.slice(0, 160)}”
        </blockquote>
      </div>
    </div>
  );
}

