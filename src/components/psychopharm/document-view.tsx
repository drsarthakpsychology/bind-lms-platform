"use client";

import * as React from "react";
import { Pencil, Plus, Trash2, BookMarked } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MedicationDocument, MedBlock, BlockType } from "@/lib/psychopharm/document";

/** Human labels for block types: the editor speaks content, not database fields. */
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

/** New-design editor chrome (admin v2): hairlines, quiet text buttons, 44px on touch. */
const V2_BTN =
  "inline-flex h-11 min-w-0 shrink-0 items-center justify-center gap-1.5 rounded-md px-2.5 type-small font-semibold whitespace-nowrap outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring lg:h-8 [&_svg]:size-3.5 [&_svg]:shrink-0";
const V2_FIELD =
  "w-full min-w-0 rounded-md border border-[var(--ds-card-line)] bg-background px-3 py-2 type-body text-foreground outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] hover:border-foreground/50 focus-visible:border-foreground focus-visible:ring-2 focus-visible:ring-ring";

/**
 * Renders a medication document as a real page.
 *
 * In READ mode (students): clean, minimal, exactly what a student sees.
 * In EDIT mode (KMS): the SAME page, but every text element is inline-editable
 * and every block shows controls (type, source, hide, remove). This is the
 * "edit a document, not a spreadsheet" model: the page IS the form.
 */
export function DocumentView({
  document,
  register = "student",
  editable = false,
  onEdit,
  onAddBlock,
  onRemoveBlock,
  onSource,
  look,
}: {
  document: MedicationDocument;
  register?: "student" | "clinician";
  editable?: boolean;
  /** "v2": the new admin design's edit chrome. Read mode looks the same either way. */
  look?: "v2";
  onEdit?: (block: MedBlock, value: string) => void;
  onAddBlock?: (sectionId: string) => void;
  onRemoveBlock?: (blockId: string) => void;
  onSource?: (block: MedBlock) => void;
}) {
  return (
    <div className={look === "v2" ? "flex min-w-0 flex-col gap-[var(--ds-6)]" : "space-y-6"}>
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
          v2={look === "v2"}
        />
      ))}

      {editable && look !== "v2" && (
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
  v2,
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
  v2?: boolean;
}) {
  if (v2) {
    return (
      <section className="flex min-w-0 flex-col gap-2">
        <div className="flex min-h-11 min-w-0 items-center justify-between gap-4 lg:min-h-0">
          <h2 className="min-w-0 type-h3 [overflow-wrap:anywhere]">{title}</h2>
          {editable && onAddBlock ? (
            <button type="button" onClick={() => onAddBlock(sectionId)} className={cn(V2_BTN, "text-muted-foreground hover:text-foreground")}>
              <Plus aria-hidden /> Add
            </button>
          ) : null}
        </div>
        <div className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
          {blocks.map((block) => (
            <BlockEditor key={block.id} block={block} register={register} editable={editable} onEdit={onEdit} onRemove={onRemoveBlock} onSource={onSource} v2 />
          ))}
        </div>
      </section>
    );
  }
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

/** Clinician-register prose: never a wall of text, short lines, listed. */
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
  v2,
}: {
  block: MedBlock;
  register: "student" | "clinician";
  editable?: boolean;
  onEdit?: (block: MedBlock, value: string) => void;
  onRemove?: (blockId: string) => void;
  onSource?: (block: MedBlock) => void;
  v2?: boolean;
}) {
  // Sources are shown to admins in the editor only, never to students.
  const source =
    block.sources?.length && editable ? (
      <SourceLine source={block.sources[0]} register={register} />
    ) : null;

  // plain_language: the student-facing summary. Prominent in the student
  // register; a quiet footnote in the clinician register.
  if (block.type === "plain_language") {
    return (
      <EditableBlock block={block} editable={editable} onEdit={onEdit} onRemove={onRemove} onSource={onSource} v2={v2}>
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
      <EditableBlock block={block} editable={editable} onEdit={onEdit} onRemove={onRemove} onSource={onSource} v2={v2}>
        <p className="text-small font-medium">
          {low != null || high != null
            ? `${low != null && high != null ? `${low} to ${high}` : `${low ?? ""}${high != null ? `up to ${high}` : ""}`} ${unit}${freq ? ` · ${freq}` : ""}`
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
      <EditableBlock block={block} editable={editable} onEdit={onEdit} onRemove={onRemove} onSource={onSource} v2={v2}>
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

  // Structured list blocks (prompts, questions, pearls, red flags): render
  // their items as a scannable list rather than one long paragraph.
  const items = block.data?.items as string[] | undefined;
  if (items?.length) {
    return (
      <EditableBlock block={block} editable={editable} onEdit={onEdit} onRemove={onRemove} onSource={onSource} v2={v2}>
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
    <EditableBlock block={block} editable={editable} onEdit={onEdit} onRemove={onRemove} onSource={onSource} v2={v2}>
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
  v2,
  children,
}: {
  block: MedBlock;
  editable?: boolean;
  onEdit?: (block: MedBlock, value: string) => void;
  onRemove?: (blockId: string) => void;
  onSource?: (block: MedBlock) => void;
  v2?: boolean;
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

  if (v2) {
    const label = BLOCK_TYPE_LABEL[block.type] ?? "Note";
    if (editing) {
      return (
        <div className="flex min-w-0 flex-col gap-2 py-3">
          <textarea
            value={v}
            onChange={(e) => setV(e.target.value)}
            rows={4}
            autoFocus
            aria-label={`Edit ${label}`}
            className={cn(V2_FIELD, "min-h-24 resize-y")}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={cn(V2_BTN, "border border-foreground bg-foreground px-3 text-background hover:bg-foreground hover:opacity-90")}
              onClick={() => { onEdit?.(block, v); setEditing(false); }}
            >
              Save
            </button>
            <button type="button" className={cn(V2_BTN, "border border-[var(--ds-card-line)] px-3")} onClick={() => { setV(block.value); setEditing(false); }}>
              Cancel
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="flex min-w-0 flex-col gap-1 py-3">
        {block.type !== "plain_language" ? <p className="type-caption text-muted-foreground">{label}</p> : null}
        <div className="min-w-0 [overflow-wrap:anywhere]">{children}</div>
        <div className="-ml-2.5 flex flex-wrap items-center gap-x-1 text-muted-foreground">
          <button type="button" onClick={() => setEditing(true)} aria-label={`Edit ${label}`} className={cn(V2_BTN, "hover:text-foreground")}>
            <Pencil aria-hidden /> Edit
          </button>
          <button type="button" onClick={() => onSource?.(block)} aria-label={`Sources for ${label}`} className={cn(V2_BTN, "hover:text-foreground")}>
            <BookMarked aria-hidden /> Sources
          </button>
          <button type="button" onClick={() => onRemove?.(block.id)} aria-label={`Remove ${label}`} className={cn(V2_BTN, "text-status-alert-fg")}>
            <Trash2 aria-hidden /> Remove
          </button>
        </div>
      </div>
    );
  }

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
      <div className="absolute right-2 top-2 hidden gap-1 group-hover:flex group-focus-within:flex pointer-coarse:flex">
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