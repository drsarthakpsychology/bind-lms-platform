"use client";

import * as React from "react";
import { Search, StickyNote } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { haptic } from "@/lib/haptics";
import { MobileListItem } from "@/components/mobile/mobile-list-item";
import { MobileBottomSheet } from "@/components/mobile/mobile-bottom-sheet";
import { MobileTextarea } from "@/components/mobile/mobile-input";
import { useDraft } from "@/lib/hooks/use-draft";

interface NoteState {
  own: string;
  peers: Array<{ id: string; note: string; createdAt: string }>;
  unlocked: boolean;
  loaded: boolean;
}

interface Doc {
  id: string;
  title: string;
  sourceUrl: string;
  licence: string;
  abstract: string;
  fetchedAt: string;
}

export function LibraryList({
  docs,
  totalCount,
  query,
  shown,
}: {
  docs: Doc[];
  totalCount: number;
  query: string;
  shown: number;
}) {
  const router = useRouter();
  const sp = useSearchParams();
  const [q, setQ] = React.useState(query);
  const [readDoc, setReadDoc] = React.useState<Doc | null>(null);
  const [noteDocId, setNoteDocId] = React.useState<string | null>(null);
  const [notes, setNotes] = React.useState<Record<string, NoteState>>({});
  const [savingNote, setSavingNote] = React.useState<string | null>(null);
  const [noteError, setNoteError] = React.useState<string | null>(null);

  // Draft buffer keyed by documentId so closing the sheet never loses an
  // unsaved note (T35).
  const { value: noteDraftValue, setValue: setNoteDraftValue, clear: clearNoteDraft } = useDraft(
    noteDocId ? `lib-note:${noteDocId}` : "lib-note:",
  );
  const displayNote = noteDocId ? noteDraftValue || notes[noteDocId]?.own || "" : "";

  async function loadNotes(docId: string) {
    if (notes[docId]?.loaded) return;
    try {
      const res = await fetch(`/api/practice/library/note?documentId=${docId}`);
      if (!res.ok) return;
      const j = (await res.json()) as {
        own: { id: string; note: string; createdAt: string } | null;
        peers: Array<{ id: string; note: string; createdAt: string }>;
        unlocked: boolean;
      };
      setNotes((n) => ({
        ...n,
        [docId]: {
          own: j.own?.note ?? "",
          peers: j.peers ?? [],
          unlocked: j.unlocked,
          loaded: true,
        },
      }));
    } catch {
      /* ignore */
    }
  }

  async function saveNote(docId: string, text: string) {
    if (savingNote || !text.trim()) return;
    setSavingNote(docId);
    setNoteError(null);
    haptic("tap");
    try {
      const res = await fetch("/api/practice/library/note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: docId, note: text }),
      });
      if (!res.ok) {
        setNoteError("Couldn't save your note. Check your connection and try again.");
        return;
      }
      haptic("success");
      setNotes((n) => ({ ...n, [docId]: { ...(n[docId] ?? { peers: [], unlocked: false, loaded: true }), own: text, unlocked: true } }));
      // Reload so peers' notes unlock.
      setNotes((n) => { const next = { ...n }; delete next[docId]; return next; });
      void loadNotes(docId);
      clearNoteDraft();
    } finally {
      setSavingNote(null);
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    haptic("tap");
    const params = new URLSearchParams(sp.toString());
    if (q.trim()) params.set("q", q.trim());
    else params.delete("q");
    router.push(`/practice/library?${params.toString()}`);
  }

  const currentDoc = noteDocId ? docs.find((d) => d.id === noteDocId) ?? null : null;

  return (
    <div className="space-y-4">
      <form onSubmit={submit} className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          enterKeyHint="search"
          placeholder={`Search ${totalCount} case reports…`}
          className="w-full rounded-md border-2 border-border bg-background py-2 pl-9 pr-3 text-small focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </form>

      {docs.length === 0 ? (
        <div className="rounded-md border-2 border-border bg-card p-6 text-center">
          <p className="text-base font-medium">No matches</p>
          <p className="mt-1 text-small text-muted-foreground">
            Try a condition, a symptom, or a drug name.
          </p>
        </div>
      ) : (
        <>
          <p className="text-caption text-muted-foreground">
            Showing {shown} of {totalCount} reports
          </p>
          <ul className="space-y-1">
            {docs.map((d) => {
              const hasOwnNote = Boolean(notes[d.id]?.own);
              return (
                <li key={d.id}>
                  <MobileListItem
                    onClick={() => {
                      setReadDoc(d);
                      haptic("tap");
                    }}
                    title={d.title}
                    subtitle={d.abstract.slice(0, 90) + (d.abstract.length > 90 ? "…" : "")}
                    trailing={
                      <StickyNote
                        className={hasOwnNote ? "size-4 text-primary" : "size-4 text-muted-foreground"}
                        aria-hidden
                      />
                    }
                  />
                </li>
              );
            })}
          </ul>
        </>
      )}

      {/* Read sheet — full abstract + PMC link + the note affordance. */}
      <MobileBottomSheet
        open={readDoc !== null}
        onOpenChange={(o) => !o && setReadDoc(null)}
        title={readDoc?.title}
        footer={
          <div className="space-y-2">
            {readDoc ? (
              <a
                href={readDoc.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-caption font-medium text-link hover:underline"
              >
                Open the original →
              </a>
            ) : null}
            <button
              type="button"
              onClick={() => {
                const id = readDoc?.id ?? null;
                setReadDoc(null);
                setNoteDocId(id);
                if (id) void loadNotes(id);
                haptic("tap");
              }}
              className="w-full rounded-md border-2 border-foreground bg-primary px-4 py-2.5 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px"
            >
              Add your note
            </button>
          </div>
        }
      >
        {readDoc ? (
          <p className="text-small leading-relaxed text-muted-foreground">{readDoc.abstract}</p>
        ) : null}
      </MobileBottomSheet>

      {/* Note sheet — your note first, save persists, then peers unlock. */}
      <MobileBottomSheet
        open={noteDocId !== null}
        onOpenChange={(o) => !o && setNoteDocId(null)}
        title="Your note"
        description={currentDoc?.title}
        footer={
          <div className="space-y-2">
            {noteError ? (
              <p className="text-caption text-status-alert-fg" role="alert">
                {noteError}
              </p>
            ) : null}
            <button
              type="button"
              onClick={() => noteDocId && void saveNote(noteDocId, displayNote)}
              disabled={savingNote === noteDocId || !displayNote.trim()}
              className="w-full rounded-md border-2 border-foreground bg-primary px-4 py-2.5 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px disabled:opacity-50"
            >
              {savingNote === noteDocId ? "Saving…" : notes[noteDocId ?? ""]?.own ? "Update note" : "Save note"}
            </button>
          </div>
        }
      >
        <div className="space-y-3">
          <MobileTextarea
            rows={4}
            placeholder="Highlight the teaching point for yourself…"
            value={displayNote}
            onChange={(e) => setNoteDraftValue(e.target.value)}
          />
          {notes[noteDocId ?? ""]?.unlocked ? (
            <>
              <p className="text-caption text-muted-foreground">
                Your note unlocked the cohort&apos;s notes on this case.
              </p>
              {notes[noteDocId ?? ""]?.peers.length ? (
                <ul className="space-y-1.5 border-t border-border pt-2">
                  {notes[noteDocId ?? ""].peers.map((p) => (
                    <li key={p.id} className="text-caption text-muted-foreground">
                      <span className="font-semibold text-foreground">Peer: </span>
                      {p.note}
                    </li>
                  ))}
                </ul>
              ) : null}
            </>
          ) : (
            <p className="text-caption text-muted-foreground">
              Write your own note to unlock peers&apos; notes on this case.
            </p>
          )}
        </div>
      </MobileBottomSheet>
    </div>
  );
}
