"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/format";
import { Share2, Ban, MoreHorizontal, Plus } from "lucide-react";
import { MobileBottomSheet } from "@/components/mobile/mobile-bottom-sheet";
import { MobileInput, MobileTextarea } from "@/components/mobile/mobile-input";
import { MobileErrorLine } from "@/components/mobile/mobile-error-line";
import { StatusPill } from "@/components/mobile/status-pill";
import { useOffline } from "@/lib/hooks/use-offline";

const DRAFT_KEY = "journal:draft";
const MOODS = ["calm", "low", "anxious", "tired", "hopeful"] as const;

interface JournalEntry {
  id: string;
  content: string;
  moodTag?: string;
  createdAt: string;
}

/**
 * Journal — owner-only. Write, see history, optional "help me think" via a
 * no-train provider (journal_support workload; honest message if none).
 * Per-entry sharing: share a specific entry with a named person by email,
 * revocable at any time (journal_shares, owner-only RLS).
 *
 * Mobile (T35/T21): history-first — the compose surface lives in a bottom
 * sheet behind a "New entry" action, and each entry's secondary actions
 * collapse into a single "…" sheet. Desktop keeps the inline composer.
 */
export function JournalView({ initialEntries }: { initialEntries: JournalEntry[] }) {
  const [entries, setEntries] = React.useState<JournalEntry[]>(initialEntries);
  const [content, setContent] = React.useState("");
  const [mood, setMood] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [composerOpen, setComposerOpen] = React.useState(false);
  const [menuEntry, setMenuEntry] = React.useState<JournalEntry | null>(null);
  const [emailOpen, setEmailOpen] = React.useState(false);
  const [helping, setHelping] = React.useState<string | null>(null);
  const [helpReply, setHelpReply] = React.useState<string | null>(null);
  const [sharing, setSharing] = React.useState<string | null>(null); // in-flight
  const [shareEmail, setShareEmail] = React.useState("");
  const [shareMsg, setShareMsg] = React.useState<Record<string, string>>({});
  const [shareIds, setShareIds] = React.useState<Record<string, string>>({});
  const [draftSaved, setDraftSaved] = React.useState(false);
  const { offline, justReturned } = useOffline();

  // Restore an unsaved draft after first paint (deferred so it neither races
  // hydration nor sets state synchronously inside the effect body). The draft
  // now carries {content, mood} so a mood choice survives a refresh (T46).
  React.useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        const raw = window.localStorage.getItem(DRAFT_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw) as { content?: string; mood?: string };
        if (parsed && typeof parsed === "object") {
          if (parsed.content) setContent(parsed.content);
          if (parsed.mood) setMood(parsed.mood);
        } else {
          setContent(String(raw));
        }
      } catch {
        // legacy plain-string draft
        try {
          const raw = window.localStorage.getItem(DRAFT_KEY);
          if (raw) setContent(String(raw));
        } catch {
          /* ignore */
        }
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  // Debounced autosave — a reflection is exactly the thing you don't want to lose.
  React.useEffect(() => {
    const t = setTimeout(() => {
      try {
        if (content.trim()) {
          window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ content, mood }));
          setDraftSaved(true);
        } else {
          window.localStorage.removeItem(DRAFT_KEY);
          setDraftSaved(false);
        }
      } catch {
        /* ignore */
      }
    }, 800);
    return () => clearTimeout(t);
  }, [content, mood]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (busy || !content.trim()) return;
    setBusy(true);
    setError(null);
    haptic("tap");
    const text = content.trim();
    const moodTag = mood || undefined;
    const tempId = crypto.randomUUID();

    // Optimistic: show the entry immediately, reconcile with the server.
    setEntries((prev) => [
      { id: tempId, content: text, moodTag, createdAt: new Date().toISOString() },
      ...prev,
    ]);
    setContent("");
    setMood("");
    setComposerOpen(false);

    let ok = false;
    try {
      const res = await fetch("/api/practice/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text, moodTag }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(j?.error ?? "Could not save. Please try again.");
      } else {
        const j = (await res.json()) as { id: string };
        // Entry is already visible — just swap the temp id for the real one.
        setEntries((prev) => prev.map((entry) => (entry.id === tempId ? { ...entry, id: j.id } : entry)));
        haptic("success");
        ok = true;
      }
    } catch {
      setError("Network error. Your entry is still here — try again.");
    }

    if (!ok) {
      // Roll back the optimistic entry and restore the draft so nothing is lost.
      setEntries((prev) => prev.filter((entry) => entry.id !== tempId));
      setContent(text);
      setMood(moodTag ?? "");
      setComposerOpen(true);
    } else {
      try {
        window.localStorage.removeItem(DRAFT_KEY);
      } catch {
        /* ignore */
      }
      setDraftSaved(false);
    }
    setBusy(false);
  }

  async function shareEntry(entry: JournalEntry, toFaculty = false) {
    const email = toFaculty ? "" : shareEmail.trim().toLowerCase();
    if (!toFaculty && !email) return;
    if (sharing) return;
    setSharing(entry.id);
    haptic("tap");
    try {
      const res = await fetch("/api/practice/journal/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          toFaculty
            ? { entryId: entry.id, sharedToRole: "faculty" }
            : { entryId: entry.id, sharedToEmail: email },
        ),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null;
        setShareMsg((m) => ({ ...m, [entry.id]: j?.error ?? "Could not share." }));
        return;
      }
      const j = (await res.json()) as { shareId: string };
      setShareIds((s) => ({ ...s, [entry.id]: j.shareId }));
      setShareMsg((m) => ({ ...m, [entry.id]: toFaculty ? "Shared with your faculty." : `Shared with ${email}.` }));
      setShareEmail("");
      setEmailOpen(false);
      haptic("success");
    } catch {
      setShareMsg((m) => ({ ...m, [entry.id]: "Network error." }));
    } finally {
      setSharing(null);
    }
  }

  async function revokeShare(entry: JournalEntry) {
    const shareId = shareIds[entry.id];
    if (!shareId || sharing) return;
    setSharing(entry.id);
    haptic("tap");
    try {
      const res = await fetch("/api/practice/journal/share", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shareId }),
      });
      if (!res.ok) {
        setShareMsg((m) => ({ ...m, [entry.id]: "Could not revoke." }));
        return;
      }
      setShareIds((s) => {
        const next = { ...s };
        delete next[entry.id];
        return next;
      });
      setShareMsg((m) => ({ ...m, [entry.id]: "Share revoked." }));
      haptic("warning");
    } catch {
      setShareMsg((m) => ({ ...m, [entry.id]: "Network error." }));
    } finally {
      setSharing(null);
    }
  }

  async function helpMeThink(entry: JournalEntry) {
    if (helping) return;
    setHelping(entry.id);
    setHelpReply(null);
    try {
      const res = await fetch("/api/practice/journal/help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entryId: entry.id, content: entry.content }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        setHelpReply(
          j?.error?.includes("no no-train") || res.status === 503
            ? "This isn't available yet — it needs a service your faculty hasn't switched on. Your note is saved as normal."
            : "Could not get a response.",
        );
        return;
      }
      const j = (await res.json()) as { reply: string };
      setHelpReply(j.reply);
    } catch {
      setHelpReply("Network error.");
    } finally {
      setHelping(null);
    }
  }

  function openEntryMenu(entry: JournalEntry) {
    setMenuEntry(entry);
    setEmailOpen(false);
    setHelpReply(null);
    haptic("tap");
  }

  const composeFields = (
    <>
      <label className="block text-small font-medium">
        Today&apos;s prompt: what&apos;s been on your mind this week?
        <MobileTextarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          enterKeyHint="enter"
          placeholder="Write freely. This stays yours."
          aria-label="Journal entry"
          className="mt-2 resize-none"
        />
      </label>

      <div className="space-y-1.5">
        <p className="text-caption text-muted-foreground">How are you feeling? (optional)</p>
        <div className="flex flex-wrap gap-1.5">
          {MOODS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMood(mood === m ? "" : m);
                haptic("tap");
              }}
              aria-pressed={mood === m}
              className={cn(
                "min-h-11 rounded-full border-2 px-4 py-1 text-caption font-medium capitalize transition-transform active:translate-y-px",
                mood === m
                  ? "border-foreground bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground",
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="space-y-6">
      {offline ? (
        <StatusPill tone="warning" label="Offline — your entry saves locally" />
      ) : justReturned ? (
        <StatusPill tone="neutral" label="Back online" />
      ) : null}

      {/* Mobile: history-first — compose lives in a bottom sheet */}
      <button
        type="button"
        onClick={() => {
          setComposerOpen(true);
          setError(null);
          haptic("tap");
        }}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md border-2 border-foreground bg-primary px-4 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none lg:hidden"
      >
        <Plus className="size-5" aria-hidden />
        New entry
      </button>

      {/* Desktop: inline composer (unchanged composition) */}
      <form
        onSubmit={save}
        className="hidden space-y-3 rounded-md border-2 border-border bg-card p-5 hard-shadow-sm lg:block"
      >
        {composeFields}
        <button
          type="submit"
          disabled={busy || !content.trim()}
          className="w-full rounded-md border-2 border-foreground bg-primary px-4 py-2.5 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save entry"}
        </button>
        <p className="text-caption text-muted-foreground" aria-live="polite">
          {draftSaved ? "Draft saved." : ""}
        </p>
        {error ? <MobileErrorLine>{error}</MobileErrorLine> : null}
      </form>

      {/* history */}
      <div>
        <h2 className="text-base font-semibold">Your entries</h2>
        {entries.length === 0 ? (
          <p className="mt-2 text-small text-muted-foreground">
            Nothing here yet. The first entry is the hardest and the most useful.
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {entries.map((e) => (
              <li key={e.id} className="rounded-md border-2 border-border bg-card p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-caption text-muted-foreground">
                    {formatRelativeTime(e.createdAt)}
                    {e.moodTag ? ` · ${e.moodTag}` : ""}
                    {shareIds[e.id] ? " · shared" : ""}
                  </span>
                  <button
                    type="button"
                    onClick={() => openEntryMenu(e)}
                    aria-haspopup="dialog"
                    aria-label={`More options for entry from ${formatRelativeTime(e.createdAt)}`}
                    className="flex size-11 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-transform hover:bg-secondary active:translate-y-px"
                  >
                    <MoreHorizontal className="size-5" aria-hidden />
                  </button>
                </div>
                <p className="mt-2 whitespace-pre-wrap break-words text-small">{e.content}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Compose sheet (mobile) */}
      <MobileBottomSheet
        open={composerOpen}
        onOpenChange={setComposerOpen}
        title="New entry"
        description="Write freely — it stays private to you."
        footer={
          <button
            type="submit"
            form="journal-compose-form"
            disabled={busy || !content.trim()}
            className="w-full rounded-md border-2 border-foreground bg-primary px-4 py-2.5 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none disabled:opacity-50"
          >
            {busy ? "Saving…" : "Save entry"}
          </button>
        }
      >
        <form id="journal-compose-form" onSubmit={save} className="space-y-3">
          {composeFields}
          <p className="text-caption text-muted-foreground" aria-live="polite">
            {draftSaved ? "Draft saved." : ""}
          </p>
          {error ? <MobileErrorLine>{error}</MobileErrorLine> : null}
        </form>
      </MobileBottomSheet>

      {/* Per-entry actions sheet */}
      <MobileBottomSheet
        open={menuEntry !== null}
        onOpenChange={(open) => {
          if (!open) {
            setMenuEntry(null);
            setEmailOpen(false);
          }
        }}
        title="Entry options"
        description={
          menuEntry
            ? `${formatRelativeTime(menuEntry.createdAt)}${menuEntry.moodTag ? ` · ${menuEntry.moodTag}` : ""}`
            : undefined
        }
      >
        {menuEntry ? (
          <div className="space-y-2">
            <p className="whitespace-pre-wrap break-words rounded-md border border-border bg-background p-3 text-small text-muted-foreground line-clamp-4">
              {menuEntry.content}
            </p>

            <button
              type="button"
              onClick={() => void helpMeThink(menuEntry)}
              disabled={helping === menuEntry.id}
              className="flex min-h-11 w-full items-center justify-between rounded-md border border-border px-3 text-small text-foreground transition-transform active:translate-y-px disabled:opacity-50"
            >
              <span>{helping === menuEntry.id ? "Thinking…" : "Help me think about this"}</span>
            </button>
            {helpReply && helping === null ? (
              <div className="rounded-md border border-border bg-secondary/60 p-3 text-small">
                <span className="font-semibold text-muted-foreground">Reflective prompt: </span>
                {helpReply}
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => void shareEntry(menuEntry, true)}
              disabled={sharing === menuEntry.id}
              className="flex min-h-11 w-full items-center justify-between rounded-md border border-border px-3 text-small text-foreground transition-transform active:translate-y-px disabled:opacity-50"
            >
              <span className="inline-flex items-center gap-2">
                <Share2 className="size-4" aria-hidden />
                Share with faculty
              </span>
            </button>

            {shareIds[menuEntry.id] ? (
              <button
                type="button"
                onClick={() => void revokeShare(menuEntry)}
                disabled={sharing === menuEntry.id}
                className="flex min-h-11 w-full items-center justify-between rounded-md border border-border px-3 text-small text-foreground transition-transform active:translate-y-px disabled:opacity-50"
              >
                <span className="inline-flex items-center gap-2">
                  <Ban className="size-4" aria-hidden />
                  Revoke share
                </span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setEmailOpen((v) => !v)}
                  aria-expanded={emailOpen}
                  className="flex min-h-11 w-full items-center justify-between rounded-md border border-border px-3 text-small text-foreground transition-transform active:translate-y-px"
                >
                  <span className="inline-flex items-center gap-2">
                    <Share2 className="size-4" aria-hidden />
                    Share by email…
                  </span>
                </button>
                {emailOpen ? (
                  <div className="flex items-center gap-2">
                    <MobileInput
                      type="email"
                      inputMode="email"
                      enterKeyHint="done"
                      autoFocus
                      value={shareEmail}
                      onChange={(ev) => setShareEmail(ev.target.value)}
                      placeholder="share with (email)"
                      aria-label="Email to share this entry with"
                      className="flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => void shareEntry(menuEntry)}
                      disabled={sharing === menuEntry.id || !shareEmail.trim()}
                      className="shrink-0 rounded-md border-2 border-border bg-primary px-4 py-2.5 text-caption font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px disabled:opacity-50"
                    >
                      {sharing === menuEntry.id ? "Sharing…" : "Share"}
                    </button>
                  </div>
                ) : null}
              </>
            )}

            {shareMsg[menuEntry.id] ? (
              <p className="text-caption text-muted-foreground">{shareMsg[menuEntry.id]}</p>
            ) : null}
          </div>
        ) : null}
      </MobileBottomSheet>
    </div>
  );
}
