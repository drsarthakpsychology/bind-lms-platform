"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Bookmark, BookmarkCheck, FlaskConical, NotebookPen, X } from "lucide-react";
import { NOTE_MAX, isBookmarked, markKey, markedSections, notePreview, noteText, setBookmark, setNote, toggleBookmark } from "@/lib/study/marks";
import { useHydrated, useMarks } from "@/lib/study/marks-store";
import type { StudyModule } from "@/lib/study/types";
import { cn } from "@/lib/utils";

/* ------------------------------------------------- reader: bookmark + note */

type SaveState = "idle" | "saving" | "saved" | "failed";

/**
 * Bookmark and "My note" for one section. The note opens inline under the
 * title (never over the fixed Back / Next bar) and saves itself as you type.
 */
export function SectionMarks({ owner, moduleId, sectionId, sectionLabel, lead }: { owner: string; moduleId: string; sectionId: string; sectionLabel: string; /** Shown first in the same row (the view toggle). */ lead?: React.ReactNode }) {
  const key = markKey(moduleId, sectionId);
  const [marks, update] = useMarks(owner);
  const hydrated = useHydrated();
  const on = isBookmarked(marks, key);
  const saved = noteText(marks, key);
  const [open, setOpen] = React.useState(false);
  const panelId = React.useId();

  return (
    <div className="mt-3">
      <div className="flex flex-wrap items-center gap-2">
        {lead}
        <button
          type="button"
          onClick={() => update((m) => toggleBookmark(m, key, Date.now()))}
          aria-pressed={on}
          disabled={!hydrated}
          className={cn(
            "inline-flex min-h-11 items-center gap-1.5 rounded-md border-2 border-foreground px-4 text-sm font-semibold transition-colors disabled:opacity-60",
            on ? "bg-foreground text-background" : "bg-card hover:bg-muted",
          )}
        >
          {on ? <BookmarkCheck className="size-4" aria-hidden /> : <Bookmark className="size-4" aria-hidden />}
          {on ? "Bookmarked" : "Bookmark"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls={panelId}
          disabled={!hydrated}
          className={cn(
            "inline-flex min-h-11 items-center gap-1.5 rounded-md border-2 border-foreground px-4 text-sm font-semibold transition-colors disabled:opacity-60",
            open ? "bg-muted" : "bg-card hover:bg-muted",
          )}
        >
          <NotebookPen className="size-4" aria-hidden /> My note
          {saved.trim() && !open ? <span className="size-2 rounded-full bg-brand" aria-label="(has a note)" /> : null}
        </button>
      </div>
      {open ? <NotePanel key={key} id={panelId} initial={saved} label={sectionLabel} onSave={(text) => update((m) => setNote(m, key, text, Date.now()))} onClose={() => setOpen(false)} /> : null}
    </div>
  );
}

function NotePanel({ id, initial, label, onSave, onClose }: { id: string; initial: string; label: string; onSave: (text: string) => boolean; onClose: () => void }) {
  const [text, setText] = React.useState(initial);
  const [state, setState] = React.useState<SaveState>("idle");
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = React.useRef(text);
  const saveRef = React.useRef(onSave);
  const ref = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    saveRef.current = onSave;
  });
  React.useEffect(() => {
    ref.current?.focus({ preventScroll: true });
    // Save anything still waiting when the panel closes or the page changes.
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        saveRef.current(latest.current);
      }
    };
  }, []);

  function flush() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setState(saveRef.current(latest.current) ? "saved" : "failed");
  }

  function change(v: string) {
    setText(v);
    latest.current = v;
    setState("saving");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(flush, 700);
  }

  const status = state === "saving" ? "Saving…" : state === "failed" ? "Could not save. Your browser may be full or in private mode." : state === "saved" ? "Saved" : "";

  return (
    <div id={id} className="mt-3 rounded-2xl border-2 border-foreground bg-card p-3 hard-shadow-sm sm:p-4">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={`${id}-text`} className="text-sm font-bold">
          My note <span className="sr-only">for {label}</span>
        </label>
        <button type="button" onClick={() => { flush(); onClose(); }} aria-label="Close my note" className="-mr-1 grid size-11 place-items-center rounded-full hover:bg-muted">
          <X className="size-5" aria-hidden />
        </button>
      </div>
      <textarea
        ref={ref}
        id={`${id}-text`}
        value={text}
        maxLength={NOTE_MAX}
        onChange={(e) => change(e.target.value)}
        onBlur={() => timer.current && flush()}
        rows={4}
        placeholder="In your own words: what to remember, or what to ask."
        className="mt-1 block w-full resize-y rounded-md border-2 border-foreground bg-background px-3 py-2 text-base leading-relaxed placeholder:text-muted-foreground"
      />
      <p className={cn("mt-1.5 text-xs font-semibold", state === "failed" ? "text-status-alert-fg" : "text-muted-foreground")} role="status" aria-live="polite">
        {state === "saved" ? "✓ " : ""}
        {status}
      </p>
    </div>
  );
}

/* ------------------------------------------------------- /study: the list */

/** Bookmarked sections and sections with a note, newest first. */
const noSubscribe = () => () => {};

export function MarksList({ owner, modules }: { owner: string; modules: StudyModule[] }) {
  const [marks, update] = useMarks(owner);
  const hydrated = useHydrated();
  // Opened from search ("Bookmarks and notes", /study#marks): open the list and bring it into view.
  const wanted = React.useSyncExternalStore(noSubscribe, () => window.location.hash === "#marks", () => false);
  React.useEffect(() => {
    if (hydrated && wanted) document.getElementById("marks")?.scrollIntoView({ block: "start" });
  }, [hydrated, wanted]);
  if (!hydrated) return null;

  const byId = new Map(modules.map((m) => [m.id, m]));
  const items = markedSections(marks).flatMap((it) => {
    const m = byId.get(it.moduleId);
    const s = m?.sections.find((x) => x.id === it.sectionId);
    return m && s ? [{ ...it, m, s }] : [];
  });

  // Nothing saved yet: say nothing. The Bookmark and My note buttons are on every section.
  if (!items.length) return null;
  return (
    <details id="marks" open={wanted} className="group scroll-mt-24 rounded-2xl border-2 border-foreground bg-card">
      <summary className="flex min-h-12 cursor-pointer items-center px-4 font-bold">Bookmarks and notes ({items.length})</summary>
      <div className="px-3 pb-3">
          <ul className="mt-1 grid grid-cols-[minmax(0,1fr)] gap-2.5 md:grid-cols-2">
            {items.map(({ key, m, s, bookmarked, note }) => (
              <li key={key} className="flex items-stretch gap-1 rounded-2xl border-2 border-foreground bg-card">
                <Link href={`/study/${m.id}/${s.id}`} className="flex min-h-14 min-w-0 flex-1 items-start gap-3 rounded-l-2xl p-3 hover:bg-muted">
                  <span className="mt-0.5 shrink-0">
                    {bookmarked ? <BookmarkCheck className="size-5" aria-hidden /> : <NotebookPen className="size-5" aria-hidden />}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold text-muted-foreground">Module {m.num} · {m.title}</span>
                    <span className="block font-bold leading-tight">
                      <span className="tabular-nums">{s.isTest ? "Test" : s.num}</span> {s.title}
                    </span>
                    {note ? (
                      <span className="mt-1 block text-sm break-words text-muted-foreground">
                        <span className="font-semibold text-foreground">My note:</span> {notePreview(note)}
                      </span>
                    ) : null}
                  </span>
                </Link>
                {bookmarked ? (
                  <button
                    type="button"
                    onClick={() => update((x) => setBookmark(x, key, false, Date.now()))}
                    aria-label={`Remove bookmark: ${s.num} ${s.title}`}
                    className="grid w-11 shrink-0 place-items-center rounded-r-2xl border-l-2 border-foreground/15 hover:bg-muted"
                  >
                    <X className="size-4" aria-hidden />
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
      </div>
    </details>
  );
}

/** Small mark for the module's section list. Shows nothing until the browser copy is read. */
export function useSectionMarks(owner: string, moduleId: string): (sectionId: string) => { bookmarked: boolean; note: boolean } {
  const [marks] = useMarks(owner);
  return (sectionId) => {
    const key = markKey(moduleId, sectionId);
    return { bookmarked: isBookmarked(marks, key), note: Boolean(noteText(marks, key).trim()) };
  };
}

/* -------------------------------------------------- module: Lab experiments */

export type LabLink = { id: string; title: string; hook: string; minutes: number };

/** Psychology Lab experiments that touch this module. Hidden when the Lab is not open. */
export function RelatedLab({ open, items }: { open: boolean; items: LabLink[] }) {
  if (!open || !items.length) return null;
  return (
    <section aria-labelledby="related-lab">
      <h2 id="related-lab" className="flex items-center gap-2 text-lg font-bold">
        <FlaskConical className="size-5" aria-hidden /> Try it in the Lab
      </h2>
      <ul className="mt-3 grid grid-cols-[minmax(0,1fr)] gap-2.5 sm:grid-cols-2">
        {items.map((x) => (
          <li key={x.id}>
            <Link href={`/games/lab/${x.id}`} className="flex h-full min-h-14 items-start gap-3 rounded-2xl border-2 border-foreground bg-background p-3 transition-transform hover:-translate-y-0.5">
              <span className="min-w-0 flex-1">
                <span className="block font-bold leading-tight">{x.title}</span>
                <span className="text-sm text-muted-foreground">{x.hook}</span>
              </span>
              <ArrowRight className="mt-0.5 size-4 shrink-0" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
