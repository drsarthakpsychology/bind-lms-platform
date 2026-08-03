import type { MedicationDocument, MedBlock } from "@/lib/psychopharm/document";

/**
 * Shared render of a medication document. Used by BOTH the student page and
 * the editor's live preview — one render tree, two data feeds. This is what
 * keeps the two views identical forever.
 */
export function DocumentView({
  document,
  register = "student",
}: {
  document: MedicationDocument;
  register?: "student" | "clinician";
}) {
  return (
    <div className="space-y-6">
      {document.sections.map((section) => (
        <section key={section.id} className="space-y-3">
          <h2 className="text-h2">{section.title}</h2>
          <div className="space-y-2">
            {section.blocks
              .filter((b) => !b.hidden)
              .sort((a, b) => a.order - b.order)
              .map((block) => (
                <BlockView key={block.id} block={block} register={register} />
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function BlockView({ block, register }: { block: MedBlock; register: "student" | "clinician" }) {
  if (block.type === "dose_band") {
    const low = block.data?.low as number | undefined;
    const high = block.data?.high as number | undefined;
    const unit = (block.data?.unit as string | undefined) ?? "mg";
    const label = block.data?.band_label as string | undefined;
    const primary = block.data?.primary_purpose as string | undefined;
    return (
        <div className="rounded-md border-2 border-border p-3">
          {low != null || high != null ? (
            <p className="text-small font-medium">
              {low != null && high != null ? `${low}–${high} ${unit}` : `${low ?? ""}${high != null ? `–${high}` : ""} ${unit}`}
              {block.data?.frequency ? ` · ${block.data.frequency}` : ""}
            </p>
          ) : null}
          {label ? <p className="text-small">{label}</p> : null}
          {primary ? <p className="text-small text-muted-foreground">{primary}</p> : null}
          {block.value ? <p className="text-small">{block.value}</p> : null}
          {block.sources?.length ? <SourceLine source={block.sources[0]} /> : null}
        </div>
      );
    }

  if (block.type === "side_effect_list") {
    const items = block.data?.items as string[] | undefined;
    return (
      <div>
        {block.value ? <p className="text-small font-medium capitalize">{block.value}</p> : null}
        {items?.length ? (
          <ul className="list-disc pl-5 text-small">
            {items.map((it, i) => (
              <li key={i}>{it}</li>
            ))}
          </ul>
        ) : null}
        {block.sources?.length ? <SourceLine source={block.sources[0]} /> : null}
      </div>
    );
  }

  return (
    <div>
      {block.value ? <p className="text-small">{block.value}</p> : null}
      {block.sources?.length && register === "clinician" ? (
        <SourceLine source={block.sources[0]} />
      ) : null}
    </div>
  );
}

function SourceLine({ source }: { source: { title?: string; edition?: string; page?: string } }) {
  return (
    <p className="mt-1 text-caption text-muted-foreground">
      {source.title} ({source.edition}){source.page ? ` · p${source.page}` : ""}
    </p>
  );
}