"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";
import { Share2, Ban, NotebookPen } from "lucide-react";
import { EmptyState } from "@/components/design-system/empty-state";

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
 */
export function JournalView({ initialEntries }: { initialEntries: JournalEntry[] }) {
  const [entries, setEntries] = React.useState<JournalEntry[]>(initialEntries);
  const [content, setContent] = React.useState("");
  const [mood, setMood] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [helping, setHelping] = React.useState<string | null>(null);
  const [helpReply, setHelpReply] = React.useState<string | null>(null);
  const [sharing, setSharing] = React.useState<string | null>(null); // in-flight
  const [shareEntryId, setShareEntryId] = React.useState<string | null>(null); // row open
  const [shareEmail, setShareEmail] = React.useState("");
  const [shareMsg, setShareMsg] = React.useState<Record<string, string>>({});
  const [shareIds, setShareIds] = React.useState<Record<string, string>>({});

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (busy || !content.trim()) return;
    setBusy(true);
    setError(null);
    haptic("tap");
    try {
      const res = await fetch("/api/practice/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim(), moodTag: mood || undefined }),
      });
      if (!res.ok) {
        setError("Could not save. Please try again.");
        return;
      }
      const j = (await res.json()) as { id: string };
      setEntries((prev) => [
        { id: j.id, content: content.trim(), moodTag: mood || undefined, createdAt: new Date().toISOString() },
        ...prev,
      ]);
      setContent("");
      setMood("");
      haptic("success");
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
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
            ? "This needs a no-train AI provider (a paid key). Add one in settings, or talk to your faculty — this is the honest answer, not a silent downgrade."
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

  return (
    <div className="space-y-6">
      {/* write form */}
      <form onSubmit={save} className="space-y-3 rounded-md border-2 border-border bg-card p-5 hard-shadow-sm">
        <label className="text-small font-medium" htmlFor="journal-entry">
          Today&apos;s prompt: what&apos;s been on your mind this week?
        </label>
        <textarea
          id="journal-entry"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          placeholder="Write freely. This stays yours."
          className="w-full resize-none rounded-md border-2 border-border bg-background px-3 py-2 text-small focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <div className="flex items-center gap-2">
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            aria-label="Mood tag (optional)"
            className="rounded-md border-2 border-border bg-background px-3 py-2 text-small focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Mood (optional)</option>
            <option value="calm">Calm</option>
            <option value="low">Low</option>
            <option value="anxious">Anxious</option>
            <option value="tired">Tired</option>
            <option value="hopeful">Hopeful</option>
          </select>
          <button
            type="submit"
            disabled={busy || !content.trim()}
            className="ml-auto rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none disabled:opacity-50"
          >
            {busy ? "Saving…" : "Save entry"}
          </button>
        </div>
        {error ? <p className="text-small text-status-alert-fg" role="alert">{error}</p> : null}
      </form>

      {/* history */}
      <div>
        <h2 className="text-base font-semibold">Your entries</h2>
        {entries.length === 0 ? (
          <EmptyState
            row
            icon={<NotebookPen className="size-4" aria-hidden />}
            title="Nothing here yet"
            description="The first entry is the hardest and the most useful."
          />
        ) : (
          <ul className="mt-3 space-y-3">
            {entries.map((e) => (
              <li key={e.id} className="rounded-md border-2 border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <span className="text-caption text-muted-foreground">
                    {new Date(e.createdAt).toLocaleDateString()}
                    {e.moodTag ? ` · ${e.moodTag}` : ""}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => void helpMeThink(e)}
                      disabled={helping === e.id}
                      className="rounded-md border border-border px-2 py-1 text-caption text-muted-foreground transition-transform active:translate-y-px disabled:opacity-50"
                    >
                      {helping === e.id ? "Thinking…" : "Help me think about this"}
                    </button>
                    {shareIds[e.id] ? (
                      <button
                        type="button"
                        onClick={() => void revokeShare(e)}
                        disabled={sharing === e.id}
                        className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-caption text-muted-foreground transition-transform active:translate-y-px disabled:opacity-50"
                      >
                        <Ban className="size-3" aria-hidden />
                        Revoke
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => void shareEntry(e, true)}
                          disabled={sharing === e.id}
                          className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-caption text-muted-foreground transition-transform active:translate-y-px disabled:opacity-50"
                        >
                          <Share2 className="size-3" aria-hidden />
                          Share with faculty
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShareEntryId(shareEntryId === e.id ? null : e.id);
                            setShareMsg((m) => ({ ...m, [e.id]: "" }));
                            haptic("tap");
                          }}
                          className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-caption text-muted-foreground transition-transform active:translate-y-px"
                        >
                          <Share2 className="size-3" aria-hidden />
                          Share
                        </button>
                      </>
                    )}
                  </span>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-small">{e.content}</p>

                {/* share row */}
                {!shareIds[e.id] && shareEntryId === e.id ? (
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="email"
                      value={shareEmail}
                      onChange={(ev) => setShareEmail(ev.target.value)}
                      placeholder="share with (email)"
                      aria-label="Email to share this entry with"
                      className="w-full rounded-md border-2 border-border bg-background px-2 py-1 text-small focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <button
                      type="button"
                      onClick={() => void shareEntry(e)}
                      disabled={sharing === e.id || !shareEmail.trim()}
                      className="shrink-0 rounded-md border-2 border-border bg-primary px-3 py-1 text-caption font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px disabled:opacity-50"
                    >
                      {sharing === e.id ? "Sharing…" : "Share entry"}
                    </button>
                  </div>
                ) : null}
                {shareMsg[e.id] ? (
                  <p className="mt-2 text-caption text-muted-foreground">{shareMsg[e.id]}</p>
                ) : null}
                {helpReply && helping === null ? (
                  <div className="mt-3 rounded-md border border-border bg-secondary/60 p-3 text-small">
                    <span className="font-semibold text-muted-foreground">Reflective prompt: </span>
                    {helpReply}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
