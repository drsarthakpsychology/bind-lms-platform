"use client";

import * as React from "react";
import { Search, StickyNote } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { haptic } from "@/lib/haptics";

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
  snippet: string;
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
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [notes, setNotes] = React.useState<Record<string, NoteState>>({});
  const [noteDraft, setNoteDraft] = React.useState<Record<string, string>>({});
  const [savingNote, setSavingNote] = React.useState<string | null>(null);

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

  async function saveNote(docId: string) {
    if (savingNote) return;
    setSavingNote(docId);
    haptic("tap");
    try {
      const res = await fetch("/api/practice/library/note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: docId, note: noteDraft[docId] ?? "" }),
      });
      if (!res.ok) return;
      haptic("success");
      setNotes((n) => ({ ...n, [docId]: { ...(n[docId] ?? { peers: [], unlocked: false, loaded: true }), own: noteDraft[docId] ?? "", unlocked: true } }));
      // Reload so peers' notes unlock.
      setNotes((n) => { const next = { ...n }; delete next[docId]; return next; });
      void loadNotes(docId);
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

  return (
    <div className="space-y-4">
      <form onSubmit={submit} className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
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
          <ul className="space-y-2">
            {docs.map((d) => {
              const open = openId === d.id;
              return (
                <li key={d.id} className="overflow-hidden rounded-md border-2 border-border bg-card">
                  <button
                    type="button"
                    onClick={() => {
                      setOpenId(open ? null : d.id);
                      haptic("tap");
                      if (!open) void loadNotes(d.id);
                    }}
                    className="w-full px-4 py-3 text-left transition-colors duration-fast ease-snappy hover:bg-accent/40"
                  >
                    <span className="block text-small font-medium">{d.title}</span>
                    <span className="mt-0.5 block text-caption text-muted-foreground">
                      {d.licence.toUpperCase()} · {d.fetchedAt}
                    </span>
                  </button>
                  {open ? (
                    <div className="space-y-2 border-t border-border px-4 py-3">
                      <p className="text-small text-muted-foreground">{d.snippet}…</p>
                      <a
                        href={d.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-caption font-medium text-link hover:underline"
                      >
                        Open on PMC →
                      </a>

                      {/* annotation — your note unlocks peers' */}
                      <div className="mt-3 rounded-md border border-border bg-background p-3">
                        <p className="flex items-center gap-1.5 text-caption font-semibold text-muted-foreground">
                          <StickyNote className="size-3.5" aria-hidden /> Your note
                        </p>
                        <textarea
                          value={noteDraft[d.id] ?? notes[d.id]?.own ?? ""}
                          onChange={(e) => setNoteDraft((m) => ({ ...m, [d.id]: e.target.value }))}
                          rows={3}
                          placeholder="Highlight the teaching point for yourself…"
                          className="mt-1 w-full resize-none rounded-md border-2 border-border bg-background px-2 py-1.5 text-small focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                        <button
                          type="button"
                          onClick={() => void saveNote(d.id)}
                          disabled={savingNote === d.id || !(noteDraft[d.id] ?? "").trim()}
                          className="mt-1 rounded-md border-2 border-border bg-primary px-3 py-1 text-caption font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px disabled:opacity-50"
                        >
                          {savingNote === d.id ? "Saving…" : notes[d.id]?.own ? "Update note" : "Save note"}
                        </button>
                        <p className="mt-1 text-caption text-muted-foreground">
                          {notes[d.id]?.unlocked
                            ? "Your note unlocked the cohort's notes on this case."
                            : "Write your own note to unlock peers' notes on this case."}
                        </p>
                        {notes[d.id]?.peers.length ? (
                          <ul className="mt-2 space-y-1.5 border-t border-border pt-2">
                            {notes[d.id].peers.map((p) => (
                              <li key={p.id} className="text-caption text-muted-foreground">
                                <span className="font-semibold text-foreground">Peer: </span>
                                {p.note}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
