"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { Heart, Lightbulb, HelpCircle, PartyPopper, AlertTriangle, Pin } from "lucide-react";

interface WallReply {
  id: string;
  content: string;
  isAnonymous: boolean;
  isFaculty: boolean;
  createdAt: string;
  reactions?: Record<string, number>;
}

interface WallPost {
  id: string;
  content: string;
  isAnonymous: boolean;
  isFaculty: boolean;
  isPinned: boolean;
  createdAt: string;
  replies?: WallReply[];
  reactions?: Record<string, number>;
}

const REACTIONS: Array<{ key: string; label: string; icon: typeof Heart }> = [
  { key: "heart", label: "Heart", icon: Heart },
  { key: "insight", label: "Insight", icon: Lightbulb },
  { key: "question", label: "Question", icon: HelpCircle },
  { key: "applause", label: "Applause", icon: PartyPopper },
  { key: "worry", label: "Worry", icon: AlertTriangle },
];

/**
 * The Cohort Wall — threaded, anonymous-post toggle, reactions-not-upvotes.
 * Reactions signal without ranking (popularity selects for confidence, not
 * correctness). Anonymous author_id never leaves the server.
 */
export function WallView({ initialPosts, isFacultyViewer = false }: { initialPosts: WallPost[]; isFacultyViewer?: boolean }) {
  const [posts, setPosts] = React.useState<WallPost[]>(initialPosts);
  const [content, setContent] = React.useState("");
  const [anonymous, setAnonymous] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [myReactions, setMyReactions] = React.useState<Record<string, Set<string>>>({});
  const [replyOpen, setReplyOpen] = React.useState<string | null>(null);
  const [replyText, setReplyText] = React.useState("");
  const [replyAnon, setReplyAnon] = React.useState(false);
  const [replying, setReplying] = React.useState(false);

  async function post(e: React.FormEvent) {
    e.preventDefault();
    if (busy || !content.trim()) return;
    setBusy(true);
    setError(null);
    haptic("tap");
    try {
      const res = await fetch("/api/practice/wall", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim(), isAnonymous: anonymous }),
      });
      if (!res.ok) {
        setError("Could not post. Please try again.");
        return;
      }
      const j = (await res.json()) as { id: string };
      setPosts((prev) => [
        { id: j.id, content: content.trim(), isAnonymous: anonymous, isFaculty: false, isPinned: false, createdAt: new Date().toISOString(), replies: [], reactions: {} },
        ...prev,
      ]);
      setContent("");
      haptic("success");
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  }

  async function toggleReaction(target: { postId?: string; replyId?: string }, reaction: string) {
    haptic("tap");
    const key = target.replyId ?? target.postId ?? "";
    const mine = myReactions[key] ?? new Set();
    const had = mine.has(reaction);
    try {
      const res = await fetch("/api/practice/wall/reaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: target.postId, replyId: target.replyId, reaction }),
      });
      if (!res.ok) return;
      // Optimistic update.
      setPosts((prev) => prev.map((p) => {
        if (target.postId && p.id !== target.postId) return p;
        if (target.replyId) {
          return {
            ...p,
            replies: (p.replies ?? []).map((r) => {
              if (r.id !== target.replyId) return r;
              const counts = { ...(r.reactions ?? {}) };
              counts[reaction] = Math.max(0, (counts[reaction] ?? 0) + (had ? -1 : 1));
              if (counts[reaction] === 0) delete counts[reaction];
              return { ...r, reactions: counts };
            }),
          };
        }
        const counts = { ...(p.reactions ?? {}) };
        counts[reaction] = Math.max(0, (counts[reaction] ?? 0) + (had ? -1 : 1));
        if (counts[reaction] === 0) delete counts[reaction];
        return { ...p, reactions: counts };
      }));
      const next = new Set(mine);
      if (had) next.delete(reaction);
      else next.add(reaction);
      setMyReactions((m) => ({ ...m, [key]: next }));
    } catch {
      /* optimistic rollback is acceptable — refresh next load */
    }
  }

  /** Faculty pin/unpin — the Case of the Week. Admin-only route enforces it. */
  async function reportPost(postId: string) {
    haptic("tap");
    try {
      const res = await fetch("/api/practice/wall/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, reason: "flagged by a cohort member" }),
      });
      if (res.ok) haptic("success");
    } catch {
      /* ignore */
    }
  }

  async function togglePin(postId: string, currentlyPinned: boolean) {
    haptic("tap");
    try {
      const res = await fetch("/api/practice/wall/pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, pinned: !currentlyPinned }),
      });
      if (!res.ok) return;
      setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, isPinned: !currentlyPinned } : p)));
      haptic("success");
    } catch {
      /* ignore */
    }
  }

  async function sendReply(postId: string) {
    if (replying || !replyText.trim()) return;
    setReplying(true);
    haptic("tap");
    try {
      const res = await fetch("/api/practice/wall/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content: replyText.trim(), isAnonymous: replyAnon }),
      });
      if (!res.ok) return;
      const j = (await res.json()) as { id: string };
      setPosts((prev) => prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          replies: [
            ...(p.replies ?? []),
            { id: j.id, content: replyText.trim(), isAnonymous: replyAnon, isFaculty: false, createdAt: new Date().toISOString() },
          ],
        };
      }));
      setReplyText("");
      setReplyOpen(null);
      haptic("success");
    } catch {
      /* ignore */
    } finally {
      setReplying(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* composer */}
      <form onSubmit={post} className="space-y-3 rounded-md border-2 border-border bg-card p-5 hard-shadow-sm">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          placeholder="Share something with the cohort — a question, a win, a hard moment."
          className="w-full resize-none rounded-md border-2 border-border bg-background px-3 py-2 text-small focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Post to the cohort wall"
        />
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-small text-muted-foreground">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              className="size-4"
            />
            Post anonymously
          </label>
          <button
            type="submit"
            disabled={busy || !content.trim()}
            className="ml-auto rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none disabled:opacity-50"
          >
            {busy ? "Posting…" : "Post"}
          </button>
        </div>
        {error ? <p className="text-small text-status-alert-fg" role="alert">{error}</p> : null}
      </form>

      {/* posts */}
      <div>
        {posts.length === 0 ? (
          <p className="text-small text-muted-foreground">
            Nothing here yet. Be the first to break the ice.
          </p>
        ) : (
          <ul className="space-y-3">
            {posts.map((p) => (
              <li key={p.id} className={`rounded-md border-2 border-border bg-card p-4 ${p.isPinned ? "border-primary" : ""}`}>
                <div className="flex items-center gap-2 text-caption text-muted-foreground">
                  {p.isPinned ? <span className="inline-flex items-center gap-1 font-semibold text-link"><Pin className="size-3.5" aria-hidden /> Pinned</span> : null}
                  {p.isFaculty ? <span className="rounded-full bg-secondary px-2 py-0.5 font-semibold">Faculty</span> : null}
                  {p.isAnonymous ? <span>Anonymous</span> : <span>Cohort member</span>}
                  <span>· {new Date(p.createdAt).toLocaleDateString()}</span>
                  {isFacultyViewer ? (
                    <button
                      type="button"
                      onClick={() => void togglePin(p.id, p.isPinned)}
                      className={cn(
                        "ml-auto rounded-full border px-2 py-0.5 transition-transform active:translate-y-px",
                        p.isPinned ? "border-primary bg-primary/10 text-link" : "border-border hover:bg-secondary",
                      )}
                      title={p.isPinned ? "Unpin (remove from top)" : "Pin as the Case of the Week"}
                    >
                      <span className="inline-flex items-center gap-1"><Pin className="size-3" aria-hidden /> {p.isPinned ? "Unpin" : "Pin"}</span>
                    </button>
                  ) : null}
                </div>
                <p className="mt-2 whitespace-pre-wrap text-small">{p.content}</p>

                {/* reactions — not upvotes */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  {REACTIONS.map((r) => {
                    const Icon = r.icon;
                    const count = p.reactions?.[r.key] ?? 0;
                    const mine = myReactions[p.id]?.has(r.key) ?? false;
                    if (count === 0 && !mine) return null;
                    return (
                      <button
                        key={r.key}
                        type="button"
                        onClick={() => void toggleReaction({ postId: p.id }, r.key)}
                        aria-pressed={mine}
                        aria-label={`${r.label} reaction, ${count}`}
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-caption transition-transform active:translate-y-px ${mine ? "border-primary bg-primary/10 text-link" : "border-border text-muted-foreground hover:bg-secondary"}`}
                      >
                        <Icon className="size-3" aria-hidden />
                        {count}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => { setReplyOpen(replyOpen === p.id ? null : p.id); haptic("tap"); }}
                    className="rounded-full border border-border px-2 py-0.5 text-caption text-muted-foreground hover:bg-secondary"
                  >
                    Reply
                  </button>
                  <button
                    type="button"
                    onClick={() => void reportPost(p.id)}
                    title="Report this post to faculty"
                    aria-label="Report this post to faculty"
                    className="rounded-full border border-border px-2 py-0.5 text-caption text-muted-foreground hover:bg-secondary"
                  >
                    Report
                  </button>
                </div>

                {/* replies */}
                {(p.replies?.length ?? 0) > 0 ? (
                  <ul className="mt-3 space-y-2 border-l-2 border-border pl-3">
                    {(p.replies ?? []).map((r) => (
                      <li key={r.id} className="rounded-md border border-border bg-background p-2">
                        <div className="flex items-center gap-2 text-caption text-muted-foreground">
                          {r.isFaculty ? <span className="rounded-full bg-secondary px-1.5 py-0.5 font-semibold">Faculty</span> : null}
                          <span>{r.isAnonymous ? "Anonymous" : "Cohort member"}</span>
                          <span>· {new Date(r.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="mt-1 whitespace-pre-wrap text-small">{r.content}</p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-1">
                          {REACTIONS.map((rr) => {
                            const Icon = rr.icon;
                            const count = r.reactions?.[rr.key] ?? 0;
                            const mine = myReactions[r.id]?.has(rr.key) ?? false;
                            if (count === 0 && !mine) return null;
                            return (
                              <button
                                key={rr.key}
                                type="button"
                                onClick={() => void toggleReaction({ replyId: r.id }, rr.key)}
                                aria-pressed={mine}
                                aria-label={`${rr.label} reaction, ${count}`}
                                className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-caption transition-transform active:translate-y-px ${mine ? "border-primary bg-primary/10 text-link" : "border-border text-muted-foreground hover:bg-secondary"}`}
                              >
                                <Icon className="size-3" aria-hidden />
                                {count}
                              </button>
                            );
                          })}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {/* reply composer */}
                {replyOpen === p.id ? (
                  <div className="mt-2 space-y-2">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={2}
                      placeholder="Write a reply…"
                      aria-label="Write a reply"
                      className="w-full resize-none rounded-md border-2 border-border bg-background px-3 py-2 text-small focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 text-caption text-muted-foreground">
                        <input type="checkbox" checked={replyAnon} onChange={(e) => setReplyAnon(e.target.checked)} className="size-4" />
                        Reply anonymously
                      </label>
                      <button
                        type="button"
                        onClick={() => void sendReply(p.id)}
                        disabled={replying || !replyText.trim()}
                        className="ml-auto rounded-md border-2 border-border bg-primary px-3 py-1.5 text-caption font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px disabled:opacity-50"
                      >
                        {replying ? "Sending…" : "Reply"}
                      </button>
                    </div>
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
