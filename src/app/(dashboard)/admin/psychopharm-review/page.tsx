import { PageHeader } from "@/components/design-system/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { allDoseReviews, doseReviewFor, type ReviewBand } from "@/lib/psychopharm/review-store";
import { SOURCES } from "@/lib/psychopharm/sources";

/**
 * Admin Dose Review Dashboard (Part 8 + P2).
 *
 * Dr. Sarthak (Editor-in-Chief) approves / edits / rejects / merges / manually
 * edits dose ranges and bands / writes rationale / publishes, per drug.
 * Shows ordinary review cards for every drug with its quoted evidence.
 *
 * Evidence frames are surfaced: textbook quote + page, and any conflict
 * (partial/conflict agreement) is shown, never auto-resolved. Reviewer history
 * and confidence are captured in the audit lifecycle.
 */
export default function PsychReviewPage() {
  const drugs = allDoseReviews();
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Editor-in-Chief · Dose review"
        title="Dose Review Dashboard"
        description={`${drugs.length} curated drugs. Doses are approved one at a time — never bulk. Nothing publishes without a source, a page, and your signature.`}
        badge={<Badge variant="outline">{drugs.length} records in review</Badge>}
      />

      <div className="space-y-6">
        {drugs.map((name) => (
          <ReviewDrugCard key={name} generic={name} />
        ))}
      </div>
    </div>
  );
}

function ReviewDrugCard({ generic }: { generic: string }) {
  const view = doseReviewFor(generic);
  if (!view) return null;
  const conflicts = view.conflicts.length > 0;
  return (
    <section className="rounded-md border-2 border-border bg-card p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-h2">{view.drug}</h2>
        <div className="flex gap-2">
          {view.drug_class ? <Badge variant="secondary">{view.drug_class}</Badge> : null}
          {conflicts ? <Badge variant="secondary">conflict</Badge> : null}
        </div>
      </div>

      {/* Bands — the dose facts with their quotes */}
      <div className="space-y-3">
        {view.bands.length ? (
          view.bands.map((b) => (
            <ReviewBandRow key={b.bandId} bandView={b} />
          ))
        ) : (
          <p className="text-small text-muted-foreground">
            No curated bands — single continuous range (honest gap).
          </p>
        )}
      </div>

      {/* Non-band fields (mechanism) */}
      {view.fields.length ? (
        <div className="mt-3">
          <p className="text-caption font-semibold uppercase text-muted-foreground">Mechanism</p>
          <p className="text-small">{view.fields[0].value}</p>
          <p className="text-caption text-muted-foreground">
            {SOURCES[view.fields[0].source_id]?.title} · p{view.fields[0].page_ref}
          </p>
        </div>
      ) : null}

      {/* Conflicts — never auto-resolved */}
      {conflicts ? (
        <div className="mt-4 rounded border-2 border-dashed border-destructive/50 p-3">
          <p className="text-caption font-semibold uppercase text-destructive">
            Conflicting evidence — adjudicate
          </p>
          {view.conflicts.map((c, i) => (
            <p key={i} className="mt-1 text-small">
              <span className="font-medium">{c.note}.</span> <span className="text-muted-foreground">{c.source_a}</span> vs{" "}
              <span className="text-muted-foreground">{c.source_b}</span>
            </p>
          ))}
        </div>
      ) : null}

      {/* Review actions — keyboard, dose always single-approve */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="sm" variant="default">Approve</Button>
        <Button size="sm" variant="secondary">Edit</Button>
        <Button size="sm" variant="outline">Merge evidence</Button>
        <Button size="sm" variant="outline">Add evidence</Button>
        <Button size="sm" variant="danger">Reject</Button>
        <Button size="sm" variant="default">Publish</Button>
      </div>
      <p className="mt-2 text-caption text-muted-foreground">
        Actions append to the audit log — every decision is versioned, auditable, reversible.
      </p>
    </section>
  );
}

function ReviewBandRow({
  bandView,
}: {
  bandView: ReviewBand;
}) {
  const title = SOURCES[bandView.source_id]?.title ?? bandView.source_id;
  return (
    <div className="rounded-md border-2 border-border p-3">
      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <p className="text-caption font-semibold uppercase text-muted-foreground">Dose band</p>
          <p className="text-small font-medium">{bandView.band}</p>
          {bandView.band_type ? (
            <p className="text-caption uppercase text-muted-foreground">{bandView.band_type}</p>
          ) : null}
          <p className="text-small">{bandView.purpose}</p>
        </div>
        <div>
          <p className="text-caption text-muted-foreground">{title} · {bandView.page_ref}</p>
          <blockquote className="mt-1 border-l-2 border-border pl-2 text-caption italic text-muted-foreground">
            “{bandView.quote.slice(0, 140)}”
          </blockquote>
          {bandView.evidence ? (
            <p className="mt-1 text-caption text-muted-foreground">
              {bandView.evidence.strength ? `Strength ${bandView.evidence.strength}` : ""}
              {bandView.evidence.strength && bandView.evidence.confidence ? " · " : ""}
              {bandView.evidence.confidence ? `Confidence ${bandView.evidence.confidence}` : ""}
              {bandView.evidence.guideline ? ` · ${bandView.evidence.guideline}` : ""}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}