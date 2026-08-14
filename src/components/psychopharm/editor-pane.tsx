"use client";

import * as React from "react";
import { DocumentView } from "./document-view";
import { SourcePanel } from "./source-panel";
import { SegmentedControl } from "@/components/ui/segmented-control";
import type { MedicationDocument, MedBlock } from "@/lib/psychopharm/document";

/**
 * The medication editor — the page IS the form.
 *
 * Renders the exact student document, but editable inline. Every text element
 * can be clicked to edit, each item has controls (edit / source / remove), and
 * each section has an "+ Add" button. Autosaves drafts; a single clearly
 * separated Publish button makes the change student-visible.
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
  const [status, setStatus] = React.useState(initialStatus);
  const [busy, setBusy] = React.useState<string | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [reason, setReason] = React.useState("");
  const [activeBlock, setActiveBlock] = React.useState<MedBlock | null>(null);
  const [savedAt, setSavedAt] = React.useState<number | null>(null);
  const [register, setRegister] = React.useState<"student" | "clinician">("student");

  const setDoc = React.useCallback((fn: (d: MedicationDocument) => MedicationDocument) => {
    setDocument(fn);
  }, []);

  function editBlock(block: MedBlock, value: string) {
    setDoc((d) => ({
      ...d,
      sections: d.sections.map((s) => ({
        ...s,
        blocks: s.blocks.map((b) => (b.id === block.id ? { ...b, value } : b)),
      })),
    }));
  }

  function addBlock(sectionId: string) {
    setDoc((d) => ({
      ...d,
      sections: d.sections.map((s) =>
        s.id === sectionId
          ? { ...s, blocks: [...s.blocks, { id: crypto.randomUUID(), type: "note", value: "", order: s.blocks.length + 1, sources: [] }] }
          : s,
      ),
    }));
  }

  function removeBlock(blockId: string) {
    setDoc((d) => ({
      ...d,
      sections: d.sections.map((s) => ({ ...s, blocks: s.blocks.filter((b) => b.id !== blockId) })),
    }));
  }

  function addSection() {
    setDoc((d) => ({
      ...d,
      sections: [...d.sections, { id: crypto.randomUUID(), title: "New section", blocks: [] }],
    }));
  }

  // Autosave: every document change writes a draft (no separate "save" step).
  const saveDraft = React.useCallback(async () => {
    setBusy("save");
    setNotice(null);
    try {
      const res = await fetch("/api/psychopharm/document", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drug, document, reason: reason || "autosave" }),
      });
      const data = await res.json();
      if (!res.ok) { setNotice(`Save failed: ${data.error ?? "error"}`); return; }
      setStatus(data.status);
      setSavedAt(Date.now());
    } finally { setBusy(null); }
  }, [drug, document, reason]);

  const firstRender = React.useRef(true);
  React.useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    const t = setTimeout(() => saveDraft(), 800);
    return () => clearTimeout(t);
  }, [document, saveDraft]);

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
      setStatus("published");
      setNotice("Published — students can now see this page.");
    } finally { setBusy(null); }
  }

  const published = status === "published";

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* The document itself — the edit surface. */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 rounded-md border-2 border-border p-3">
            <p className="text-caption font-semibold uppercase text-muted-foreground">Preview</p>
            <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
              <p className="text-caption text-muted-foreground">
                {register === "student"
                  ? "Student view — plain language, what students read."
                  : "Clinical view — technical detail with source citations."}
              </p>
              <SegmentedControl
                value={register}
                onValueChange={(v) => setRegister(v)}
                label="Preview audience"
                options={[
                  { value: "student", label: "Student view" },
                  { value: "clinician", label: "Clinical view" },
                ]}
              />
            </div>
          </div>
          <DocumentView
            document={document}
            register={register}
            editable
            onEdit={editBlock}
            onAddBlock={addBlock}
            onRemoveBlock={removeBlock}
          />
          <button
            type="button"
            onClick={addSection}
            className="mt-6 w-full rounded-md border-2 border-dashed border-border px-3 py-3 text-sm text-muted-foreground hover:bg-accent"
          >
            + Add section
          </button>
        </div>
      </div>

      {/* Right rail: status, publish, selected source. */}
      <div className="w-80 shrink-0 overflow-y-auto border-l-2 border-border p-4">
        <div className="rounded-md border-2 border-border p-3">
          <div className="flex items-center justify-between">
            <span className="text-caption font-semibold uppercase text-muted-foreground">Status</span>
            <span className={`text-caption font-semibold ${published ? "text-emerald-700" : "text-amber-700"}`}>
              {published ? "Published" : "Draft"}
            </span>
          </div>
          <p className="mt-1 text-caption text-muted-foreground">
            {published
              ? "Visible to students."
              : "Not yet visible to students. Click Publish when ready."}
          </p>
          {savedAt ? (
            <p className="mt-1 text-caption text-muted-foreground">Auto-saved {new Date(savedAt).toLocaleTimeString()}.</p>
          ) : null}
        </div>

        <div className="mt-3 rounded-md border-2 border-border p-3">
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Change note (optional)…"
            className="mb-2 w-full rounded-md border-2 border-border px-2 py-1 text-sm"
          />
          <button
            type="button"
            onClick={publish}
            disabled={busy !== null}
            className="w-full rounded-md border-2 border-foreground bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
          >
            {busy === "publish" ? "Publishing…" : published ? "Republish changes" : "Publish to students"}
          </button>
          {notice ? <p className="mt-2 text-caption">{notice}</p> : null}
          {errors.length ? (
            <ul className="mt-2 list-disc pl-5 text-caption text-destructive">
              {errors.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          ) : null}
        </div>

        {/* Selected block source panel */}
        {activeBlock ? (
          <div className="mt-3">
            <SourcePanel
              block={activeBlock}
              onChange={(sources) => {
                setDoc((d) => ({
                  ...d,
                  sections: d.sections.map((s) => ({
                    ...s,
                    blocks: s.blocks.map((b) => (b.id === activeBlock.id ? { ...b, sources } : b)),
                  })),
                }));
                setActiveBlock((b) => (b ? { ...b, sources } : b));
              }}
            />
          </div>
        ) : null}

        <p className="mt-4 text-caption text-muted-foreground">
          Click any text to edit it. Changes save automatically as a draft.
          Publish when the page is ready for students.
        </p>
      </div>
    </div>
  );
}