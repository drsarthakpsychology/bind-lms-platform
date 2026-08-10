"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";

interface JournalEntry {
  id: string;
  content: string;
  moodTag?: string;
  createdAt: string;
}

/**
 * Journal — owner-only. Write, see history, optional "help me think" via a
 * no-train provider (journal_support workload; honest message if none).
 */
export function JournalView({ initialEntries }: { initialEntries: JournalEntry[] }) {
  const [entries, setEntries] = React.useState<JournalEntry[]>(initialEntries);
  const [content, setContent] = React.useState("");
  const [mood, setMood] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [helping, setHelping] = React.useState<string | null>(null);
  const [helpReply, setHelpReply] = React.useState<string | null>(null);

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
        {error ? <p className="text-small text-red-600" role="alert">{error}</p> : null}
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
                <div className="flex items-center justify-between">
                  <span className="text-caption text-muted-foreground">
                    {new Date(e.createdAt).toLocaleDateString()}
                    {e.moodTag ? ` · ${e.moodTag}` : ""}
                  </span>
                  <button
                    type="button"
                    onClick={() => void helpMeThink(e)}
                    disabled={helping === e.id}
                    className="rounded-md border border-border px-2 py-1 text-caption text-muted-foreground transition-transform active:translate-y-px disabled:opacity-50"
                  >
                    {helping === e.id ? "Thinking…" : "Help me think about this"}
                  </button>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-small">{e.content}</p>
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
