"use client";

import * as React from "react";
import { DocumentView } from "./document-view";
import type { MedicationDocument, MedBlock, BlockType, SourceRef } from "@/lib/psychopharm/document";

type BlockPatch = Partial<Pick<MedBlock, "value" | "hidden" | "sources" | "data" | "type">>;

const BLOCK_TYPES: BlockType[] = [
  "mechanism", "common_uses", "dose_band", "onset", "half_life",
  "side_effect_list", "observation_prompt_list", "therapist_question_list",
  "clinical_pearl_list", "red_flag_list", "plain_language", "reference",
  "timeline", "note",
];

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
  // Undo/redo stack.
  const [past, setPast] = React.useState<MedicationDocument[]>([]);
  const [future, setFuture] = React.useState<MedicationDocument[]>([]);
  const [busy, setBusy] = React.useState<string | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [activeBlock, setActiveBlock] = React.useState<string | null>(null);
  const [reason, setReason] = React.useState("");
  const [showHistory, setShowHistory] = React.useState(false);

  /** Mutate document, recording the previous state for undo. */
  const setDoc = React.useCallback((fn: (d: MedicationDocument) => MedicationDocument) => {
    setDocument((d) => {
      setPast((p) => [...p.slice(-49), d]);
      setFuture([]);
      return fn(d);
    });
  }, []);

  const undo = React.useCallback(() => {
    setPast((p) => {
      if (!p.length) return p;
      const prev = p[p.length - 1];
      setDocument((d) => {
        setFuture((f) => [...f, d]);
        return prev;
      });
      return p.slice(0, -1);
    });
  }, []);

  const redo = React.useCallback(() => {
    setFuture((f) => {
      if (!f.length) return f;
      const next = f[f.length - 1];
      setDocument((d) => {
        setPast((p) => [...p, d]);
        return next;
      });
      return f.slice(0, -1);
    });
  }, []);

  // Keyboard shortcuts: Ctrl/Cmd+S save, Ctrl/Cmd+Z undo, Shift+Cmd/Ctrl+Z redo.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "s") { e.preventDefault(); saveRef.current(); }
      else if (mod && e.key.toLowerCase() === "z" && e.shiftKey) { e.preventDefault(); redo(); }
      else if (mod && e.key.toLowerCase() === "z") { e.preventDefault(); undo(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  const saveRef = React.useRef<() => void>(() => {});
  const saveCallback = React.useCallback(async () => {
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
    } finally { setBusy(null); }
  }, [drug, document, reason]);
  saveRef.current = saveCallback; // keep ref fresh

  const [versions, setVersions] = React.useState<
    Array<{ version: number; reason?: string | null; created_at: string; changed_fields: string[] }>
  >([]);

  async function loadHistory() {
    const res = await fetch(`/api/psychopharm/document/history?drug=${encodeURIComponent(drug)}`);
    const data = await res.json();
    setVersions(Array.isArray(data) ? data : []);
    setShowHistory((v) => !v);
  }

  async function rollback(version: number) {
    setBusy("rollback");
    setNotice(null);
    try {
      const res = await fetch("/api/psychopharm/document/history/rollback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drug_id: drugId, version }),
      });
      const data = await res.json();
      if (!res.ok) { setNotice(data.error ?? "rollback failed"); return; }
      setDocument(data.document.document);
      setNotice(`Rolled back to v${version}.`);
    } finally {
      setBusy(null);
    }
  }

  function addBlock(sectionIdx: number) {
    setDoc((d) => {
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
    setDoc((d) => ({
      ...d,
      sections: [...d.sections, { id: crypto.randomUUID(), title: "New section", blocks: [] }],
    }));
  }

  function updateBlock(sectionIdx: number, blockId: string, patch: BlockPatch) {
    setDoc((d) => ({
      ...d,
      sections: d.sections.map((s, si) =>
        si === sectionIdx
          ? { ...s, blocks: s.blocks.map((b) => (b.id === blockId ? { ...b, ...patch } : b)) }
          : s,
      ),
    }));
  }

  function updateSectionTitle(sectionIdx: number, title: string) {
    setDoc((d) => ({
      ...d,
      sections: d.sections.map((s, si) => (si === sectionIdx ? { ...s, title } : s)),
    }));
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
              onClick={saveCallback}
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

          <button type="button" onClick={loadHistory} className="mt-2 text-caption text-muted-foreground hover:text-foreground">
            {showHistory ? "Hide history" : "Version history"}
          </button>
          {showHistory ? (
            <ul className="mt-2 space-y-1">
              {versions.length === 0 ? <li className="text-caption text-muted-foreground">No versions yet.</li> : null}
              {versions.map((v) => (
                <li key={v.version} className="flex items-center justify-between gap-2 rounded border-2 border-border px-2 py-1 text-caption">
                  <span>
                    <span className="font-semibold">v{v.version}</span>
                    {v.reason ? ` · ${v.reason}` : ""} · {new Date(v.created_at).toLocaleString()}
                  </span>
                  <button
                    type="button"
                    onClick={() => rollback(v.version)}
                    disabled={busy !== null}
                    className="text-caption text-muted-foreground hover:text-foreground"
                  >
                    rollback
                  </button>
                </li>
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
      <div className="flex items-center justify-between gap-2">
        <select
          value={block.type}
          onChange={(e) => onChange({ type: e.target.value as MedBlock["type"] })}
          className="rounded border-2 border-border bg-transparent px-1 py-0.5 text-caption text-muted-foreground"
          aria-label="Block type"
        >
          {BLOCK_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
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