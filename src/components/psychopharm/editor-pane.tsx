"use client";

import * as React from "react";
import { DocumentView } from "./document-view";
import type { MedicationDocument, MedBlock, MedSection, SourceRef } from "@/lib/psychopharm/document";

type BlockPatch = Partial<Pick<MedBlock, "value" | "hidden" | "sources" | "data">>;

/**
 * The two-pane medication editor. Left: live student preview. Right: editable
 * section tree (typed blocks), each with a source panel. Save → POST document;
 * Publish → POST document/publish (validated).
 */
export function EditorPane({
  drug,
  drugId,
  initialDocument,
  initialStatus,
}: {
  drug: string;
  drugId: string;
  initialDocument: MedicationDocument;
  initialStatus: string;
}) {
  const [document, setDocument] = React.useState<MedicationDocument>(initialDocument);
  const [busy, setBusy] = React.useState<string | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [activeBlock, setActiveBlock] = React.useState<string | null>(null);
  const [reason, setReason] = React.useState("");

  function addBlock(sectionIdx: number) {
    setDocument((d) => {
      const sections = [...d.sections];
      const section = { ...sections[sectionIdx] };
      section.blocks = [
        ...section.blocks,
        { id: crypto.randomUUID(), type: "note", value: "", order: section.blocks.length + 1, sources: [] },
      ];
      sections[sectionIdx] = section;
      return { ...d, sections };
    });
  }

  function addSection() {
    setDocument((d) => ({
      ...d,
      sections: [...d.sections, { id: crypto.randomUUID(), title: "New section", blocks: [] }],
    }));
  }

  function updateBlock(sectionIdx: number, blockId: string, patch: BlockPatch) {
    setDocument((d) => ({
      ...d,
      sections: d.sections.map((s, si) =>
        si === sectionIdx
          ? { ...s, blocks: s.blocks.map((b) => (b.id === blockId ? { ...b, ...patch } : b)) }
          : s,
      ),
    }));
  }

  function updateSectionTitle(sectionIdx: number, title: string) {
    setDocument((d) => ({
      ...d,
      sections: d.sections.map((s, si) => (si === sectionIdx ? { ...s, title } : s)),
    }));
  }

  async function save() {
    setBusy("save");
    setNotice(null);
    try {
      const res = await fetch("/api/psychopharm/document", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drug, document, reason }),
      });
      const data = await res.json();
      if (!res.ok) { setNotice(`Save failed: ${data.error ?? "error"}`); return; }
      setReason("");
      setNotice(`Saved as v${data.version} (${data.status}).`);
    } finally {
      setBusy(null);
    }
  }

  async function publish() {
    setBusy("publish");
    setNotice(null);
    setErrors([]);
    try {
      const res = await fetch("/api/psychopharm/document/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drug_id: drugId, reason }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.errors?.length) setErrors(data.errors);
        else setNotice(data.error ?? "publish failed");
        return;
      }
      setNotice("Published.");
    } finally {
      setBusy(null);
    }
  }

  const active = activeBlock
    ? (() => {
        for (let si = 0; si < document.sections.length; si++) {
          const b = document.sections[si].blocks.find((x) => x.id === activeBlock);
          if (b) return { sectionIdx: si, block: b };
        }
        return null;
      })()
    : null;

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left: live student preview */}
      <div className="flex-1 overflow-y-auto border-r-2 border-border p-6">
        <p className="mb-3 text-caption text-muted-foreground">Student preview — live</p>
        <DocumentView document={document} />
      </div>

      {/* Right: editor */}
      <div className="flex w-[46%] flex-col overflow-y-auto p-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-caption font-semibold uppercase text-muted-foreground">Editor</span>
          <span className="ml-auto text-caption text-muted-foreground">{document.sections.length} sections</span>
        </div>

        <div className="space-y-4">
          {document.sections.map((section, si) => (
            <div key={section.id} className="rounded-md border-2 border-border p-3">
              <SectionTitleEditor title={section.title} onCommit={(v) => updateSectionTitle(si, v)} />
              <div className="mt-2 space-y-2">
                {section.blocks.map((b) => (
                  <BlockRow
                    key={b.id}
                    block={b}
                    active={activeBlock === b.id}
                    onChange={(patch) => updateBlock(si, b.id, patch)}
                    onSelect={() => setActiveBlock(b.id)}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => addBlock(si)}
                className="mt-2 text-caption text-muted-foreground hover:text-foreground"
              >
                + Add block
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addSection}
            className="w-full rounded-md border-2 border-dashed border-border px-3 py-2 text-sm text-muted-foreground hover:bg-accent"
          >
            + Add section
          </button>
        </div>

        {/* Source panel */}
        {active ? (
          <SourcePanel block={active.block} onChange={(sources) => updateBlock(active.sectionIdx, active.block.id, { sources })} />
        ) : null}

        {/* Save / publish bar */}
        <div className="mt-4 rounded-md border-2 border-border p-3">
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Edit reason (for the version log)…"
            className="mb-2 w-full rounded-md border-2 border-border px-2 py-1 text-sm"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={save}
              disabled={busy !== null}
              className="rounded-md border-2 border-foreground bg-primary px-3 py-1.5 text-sm text-primary-foreground"
            >
              {busy === "save" ? "…" : "Save draft"}
            </button>
            <button
              type="button"
              onClick={publish}
              disabled={busy !== null}
              className="rounded-md border-2 border-foreground px-3 py-1.5 text-sm"
            >
              {busy === "publish" ? "…" : "Publish"}
            </button>
          </div>
          {notice ? <p className="mt-2 text-caption">{notice}</p> : null}
          {errors.length ? (
            <ul className="mt-2 list-disc pl-5 text-caption text-destructive">
              {errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function SectionTitleEditor({ title, onCommit }: { title: string; onCommit: (v: string) => void }) {
  const [v, setV] = React.useState(title);
  return (
    <input
      value={v}
      onChange={(e) => setV(e.target.value)}
      onBlur={() => onCommit(v)}
      className="w-full rounded-md border-2 border-border bg-transparent px-2 py-1 text-sm font-semibold"
    />
  );
}

function BlockRow({
  block,
  active,
  onChange,
  onSelect,
}: {
  block: MedBlock;
  active: boolean;
  onChange: (patch: BlockPatch) => void;
  onSelect: () => void;
}) {
  const [v, setV] = React.useState(block.value);
  return (
    <div className={`rounded-md border-2 p-2 ${active ? "border-primary" : "border-border"}`}>
      <div className="flex items-center justify-between">
        <span className="text-caption uppercase text-muted-foreground">{block.type}</span>
        <button type="button" onClick={onSelect} className="text-caption text-muted-foreground hover:text-foreground">
          source {block.sources?.length ? `(${block.sources.length})` : ""}
        </button>
      </div>
      <textarea
        value={v}
        onChange={(e) => setV(e.target.value)}
        onBlur={() => onChange({ value: v })}
        rows={2}
        className="w-full rounded-md border-2 border-border px-2 py-1 text-sm"
      />
    </div>
  );
}

function SourcePanel({
  block,
  onChange,
}: {
  block: MedBlock;
  onChange: (sources: SourceRef[]) => void;
}) {
  const [quote, setQuote] = React.useState(block.sources[0]?.quote ?? "");
  const [page, setPage] = React.useState(block.sources[0]?.page ?? "");
  const [title, setTitle] = React.useState(block.sources[0]?.title ?? "");

  function commit() {
    const src: SourceRef = {
      title: title || block.sources[0]?.title,
      edition: block.sources[0]?.edition,
      page: page || block.sources[0]?.page,
      quote: quote || block.sources[0]?.quote,
    };
    onChange([src]);
  }

  return (
    <div className="mt-4 rounded-md border-2 border-dashed border-border p-3">
      <p className="text-caption font-semibold uppercase text-muted-foreground">Source panel</p>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Book / guideline title"
        className="mb-1 w-full rounded-md border-2 border-border px-2 py-1 text-sm" />
      <input value={page} onChange={(e) => setPage(e.target.value)} placeholder="Page"
        className="mb-1 w-full rounded-md border-2 border-border px-2 py-1 text-sm" />
      <textarea value={quote} onChange={(e) => setQuote(e.target.value)} placeholder="Verbatim quote"
        rows={2} className="w-full rounded-md border-2 border-border px-2 py-1 text-sm" />
      <button type="button" onClick={commit}
        className="mt-1 rounded-md border-2 border-border px-2 py-1 text-sm hover:bg-accent">
        Save source
      </button>
    </div>
  );
}