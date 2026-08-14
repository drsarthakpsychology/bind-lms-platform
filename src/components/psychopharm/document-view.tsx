"use client";

import * as React from "react";
import { Pencil, Trash2, BookMarked } from "lucide-react";
import type { MedicationDocument, MedBlock, BlockType } from "@/lib/psychopharm/document";

/** Human labels for block types — the editor speaks content, not database fields. */
export const BLOCK_TYPE_LABEL: Record<BlockType, string> = {
  mechanism: "Mechanism",
  common_uses: "What it's used for",
  dose_band: "Dose",
  onset: "Onset",
  half_life: "Half-life",
  side_effect_list: "Side effects",
  observation_prompt_list: "Session observations",
  therapist_question_list: "Questions to ask",
  clinical_pearl_list: "Clinical pearls",
  red_flag_list: "Red flags",
  plain_language: "In plain words",
  reference: "Reference",
  timeline: "Timeline",
  note: "Note",
};

/**
 * Renders a medication document as a real page.
 *
 * In READ mode (students): clean, minimal, exactly what a student sees.
 * In EDIT mode (KMS): the SAME page, but every text element is inline-editable
 * and every block shows controls (type, source, hide, remove). This is the
 * "edit a document, not a spreadsheet" model — the page IS the form.
 */
export function DocumentView({
  document,
  register = "student",
  editable = false,
  onEdit,
  onAddBlock,
  onRemoveBlock,
  onSource,
}: {
  document: MedicationDocument;
  register?: "student" | "clinician";
  editable?: boolean;
  onEdit?: (block: MedBlock, value: string) => void;
  onAddBlock?: (sectionId: string) => void;
  onRemoveBlock?: (blockId: string) => void;
  onSource?: (block: MedBlock) => void;
}) {
  return (
    <div className="space-y-6">
      {document.sections.map((section) => (
        <EditableSection
          key={section.id}
          sectionId={section.id}
          title={section.title}
          blocks={section.blocks.filter((b) => !b.hidden)}
          register={register}
          editable={editable}
          onEdit={onEdit}
          onAddBlock={onAddBlock}
          onRemoveBlock={onRemoveBlock}
          onSource={onSource}
        />
      ))}

      {editable && (
        <div className="text-caption text-muted-foreground">
          Click any text to edit it. Hover a block for edit and remove controls.
        </div>
      )}
    </div>
  );
}

function EditableSection({
  sectionId,
  title,
  blocks,
  register,
  editable,
  onEdit,
  onAddBlock,
  onRemoveBlock,
  onSource,
}: {
  sectionId: string;
  title: string;
  blocks: MedBlock[];
  register: "student" | "clinician";
  editable?: boolean;
  onEdit?: (block: MedBlock, value: string) => void;
  onAddBlock?: (sectionId: string) => void;
  onRemoveBlock?: (blockId: string) => void;
  onSource?: (block: MedBlock) => void;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-h2">{title}</h2>
        {editable && onAddBlock ? (
          <button
            type="button"
            onClick={() => onAddBlock(sectionId)}
            className="rounded-md border-2 border-border px-2 py-0.5 text-xs text-muted-foreground hover:bg-accent"
          >
            + Add
          </button>
        ) : null}
      </div>
      <div className="space-y-2">
        {blocks.map((block) => (
          <BlockEditor
            key={block.id}
            block={block}
            register={register}
            editable={editable}
            onEdit={onEdit}
            onRemove={onRemoveBlock}
            onSource={onSource}
          />
        ))}
      </div>
    </section>
  );
}

/** Break prose into short scannable lines (sentence / newline boundaries). */
function shortLines(text: string): string[] {
  return text
    .split(/(?<=[.;!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Clinician-register prose: never a wall of text — short lines, listed. */
function ClinicProse({ text }: { text: string }) {
  const lines = shortLines(text);
  if (lines.length <= 1) return <p className="text-small">{text}</p>;
  return (
    <ul className="list-disc pl-5 text-small">
      {lines.map((l, i) => (
        <li key={i}>{l}</li>
      ))}
    </ul>
  );
}

function BlockEditor({
  block,
  register,
  editable,
  onEdit,
  onRemove,
  onSource,
}: {
  block: MedBlock;
  register: "student" | "clinician";
  editable?: boolean;
  onEdit?: (block: MedBlock, value: string) => void;
  onRemove?: (blockId: string) => void;
  onSource?: (block: MedBlock) => void;
}) {
  // Sources are clinical provenance — surfaced in the clinician register only.
  const source =
    block.sources?.length && register === "clinician" ? (
      <SourceLine source={block.sources[0]} register={register} />
    ) : null;

  // plain_language — the student-facing summary. Prominent in the student
  // register; a quiet footnote in the clinician register.
  if (block.type === "plain_language") {
    return (
      <EditableBlock block={block} editable={editable} onEdit={onEdit} onRemove={onRemove} onSource={onSource}>
        {register === "student" ? (
          <div className="rounded-md bg-secondary p-3">
            <p className="text-eyebrow text-link">In plain words</p>
            {block.value ? <p className="mt-1 text-body">{block.value}</p> : null}
          </div>
        ) : (
          <p className="text-small">{block.value}</p>
        )}
        {source}
      </EditableBlock>
    );
  }

  if (block.type === "dose_band") {
    const low = block.data?.low as number | undefined;
    const high = block.data?.high as number | undefined;
    const unit = (block.data?.unit as string | undefined) ?? "mg";
    const freq = block.data?.frequency as string | undefined;
    const label = block.data?.band_label as string | undefined;
    const primary = block.data?.primary_purpose as string | undefined;
    return (
      <EditableBlock block={block} editable={editable} onEdit={onEdit} onRemove={onRemove} onSource={onSource}>
        <p className="text-small font-medium">
          {low != null || high != null
            ? `${low != null && high != null ? `${low}–${high}` : `${low ?? ""}${high != null ? `–${high}` : ""}`} ${unit}${freq ? ` · ${freq}` : ""}`
            : "dose range"}
        </p>
        {label ? <p className="text-small">{label}</p> : null}
        {primary ? <p className="text-small text-muted-foreground">{primary}</p> : null}
        {block.value ? <p className="text-small">{block.value}</p> : null}
        {source}
      </EditableBlock>
    );
  }

  if (block.type === "side_effect_list") {
    const items = block.data?.items as string[] | undefined;
    return (
      <EditableBlock block={block} editable={editable} onEdit={onEdit} onRemove={onRemove} onSource={onSource}>
        {block.value ? <p className="text-small font-medium capitalize">{block.value}</p> : null}
        {items?.length ? (
          <ul className="list-disc pl-5 text-small">
            {items.map((it, i) => <li key={i}>{it}</li>)}
          </ul>
        ) : null}
        {source}
      </EditableBlock>
    );
  }

  // Structured list blocks (prompts, questions, pearls, red flags) — render
  // their items as a scannable list rather than one long paragraph.
  const items = block.data?.items as string[] | undefined;
  if (items?.length) {
    return (
      <EditableBlock block={block} editable={editable} onEdit={onEdit} onRemove={onRemove} onSource={onSource}>
        {block.value ? <p className="text-small font-medium capitalize">{block.value}</p> : null}
        <ul className="list-disc pl-5 text-small">
          {items.map((it, i) => <li key={i}>{it}</li>)}
        </ul>
        {source}
      </EditableBlock>
    );
  }

  // Prose blocks: plain paragraph for students; broken into short lines for
  // the clinician register so nothing reads as a wall of text.
  return (
    <EditableBlock block={block} editable={editable} onEdit={onEdit} onRemove={onRemove} onSource={onSource}>
      {block.value ? (
        register === "clinician" ? (
          <ClinicProse text={block.value} />
        ) : (
          <p className="text-small">{block.value}</p>
        )
      ) : null}
      {source}
    </EditableBlock>
  );
}

/** Wraps a block's rendered content; in edit mode shows an inline textarea + controls. */
function EditableBlock({
  block,
  editable,
  onEdit,
  onRemove,
  onSource,
  children,
}: {
  block: MedBlock;
  editable?: boolean;
  onEdit?: (block: MedBlock, value: string) => void;
  onRemove?: (blockId: string) => void;
  onSource?: (block: MedBlock) => void;
  children: React.ReactNode;
}) {
  const [editing, setEditing] = React.useState(false);
  const [v, setV] = React.useState(block.value);

  // Keep the local edit buffer in sync with an externally-changed block value
  // (undo/redo, rollback) without a setState-in-effect: adjust state during
  // render, per the React docs.
  const [prevValue, setPrevValue] = React.useState(block.value);
  if (prevValue !== block.value) {
    setPrevValue(block.value);
    setV(block.value);
  }

  if (!editable) return <div className="rounded-md border-2 border-border p-3">{children}</div>;

  if (editing) {
    return (
      <div className="rounded-md border-2 border-primary p-3">
        <textarea
          value={v}
          onChange={(e) => setV(e.target.value)}
          rows={2}
          autoFocus
          className="w-full rounded border-2 border-border p-1 text-sm"
        />
        <button type="button" className="mt-1 rounded border-2 border-foreground bg-primary px-2 py-0.5 text-xs" onClick={() => { onEdit?.(block, v); setEditing(false); }}>
          Save
        </button>
        <button type="button" className="ml-1 mt-1 rounded border-2 border-border px-2 py-0.5 text-xs" onClick={() => { setV(block.value); setEditing(false); }}>
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="group relative rounded-md border-2 border-border p-3 hover:border-primary/40">
      {children}
      <div className="absolute right-2 top-2 hidden gap-1 group-hover:flex">
        <button
          type="button"
          onClick={() => setEditing(true)}
          aria-label="Edit"
          className="flex items-center gap-1 rounded border-2 border-border bg-background px-1.5 py-0.5 text-[10px] hover:bg-accent"
        >
          <Pencil className="h-3 w-3" /> Edit
        </button>
        <button
          type="button"
          onClick={() => onSource?.(block)}
          aria-label="Sources"
          className="flex items-center gap-1 rounded border-2 border-border bg-background px-1.5 py-0.5 text-[10px] hover:bg-accent"
        >
          <BookMarked className="h-3 w-3" /> Sources
        </button>
        <button
          type="button"
          onClick={() => onRemove?.(block.id)}
          aria-label="Remove"
          className="flex items-center gap-1 rounded border-2 border-border bg-background px-1.5 py-0.5 text-[10px] text-destructive hover:bg-accent"
        >
          <Trash2 className="h-3 w-3" /> Remove
        </button>
      </div>
    </div>
  );
}

function SourceLine({ source, register }: { source: { title?: string; edition?: string; page?: string }; register: string }) {
  return (
    <p className="mt-1 text-caption text-muted-foreground">
      {register === "clinician" ? `${source.title} (${source.edition ?? ""})${source.page ? ` · p${source.page}` : ""}` : `${source.title ?? ""}${source.page ? ` · p${source.page}` : ""}`}
    </p>
  );
}