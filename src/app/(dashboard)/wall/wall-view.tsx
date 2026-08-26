"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";
import { formatRelativeTime } from "@/lib/format";
import { Heart, Lightbulb, HelpCircle, PartyPopper, AlertTriangle, Pin, MoreHorizontal, Plus, MessageSquare } from "lucide-react";
import { MobileBottomSheet } from "@/components/mobile/mobile-bottom-sheet";
import { MobileTextarea } from "@/components/mobile/mobile-input";
import { MobileErrorLine } from "@/components/mobile/mobile-error-line";
import { StatusPill } from "@/components/mobile/status-pill";
import { EmptyState } from "@/components/design-system/empty-state";
import { useDraft } from "@/lib/hooks/use-draft";
import { useOffline } from "@/lib/hooks/use-offline";

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
 *
 * Mobile (T21/T35): feed-first — the composer moves into a bottom sheet behind
 * a "New post" action, and per-post Report/Pin collapse into a single "…"
 * sheet. Composer + reply drafts autosave via useDraft (T46).
 */
export function WallView({ initialPosts, isFacultyViewer = false }: { initialPosts: WallPost[]; isFacultyViewer?: boolean }) {
  const [posts, setPosts] = React.useState<WallPost[]>(initialPosts);
  const contentDraft = useDraft("wall-composer");
  const [anonymous, setAnonymous] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [myReactions, setMyReactions] = React.useState<Record<string, Set<string>>>({});
  const [replyOpen, setReplyOpen] = React.useState<string | null>(null);
  const replyDraft = useDraft("wall-reply");
  const [replyAnon, setReplyAnon] = React.useState(false);
  const [replying, setReplying] = React.useState(false);
  const [replyError, setReplyError] = React.useState<string | null>(null);
  const [composerOpen, setComposerOpen] = React.useState(false);
  const [menuPostId, setMenuPostId] = React.useState<string | null>(null);
  const [sheetMsg, setSheetMsg] = React.useState<{ text: string; tone: "success" | "error" } | null>(null);
  const [feedError, setFeedError] = React.useState<string | null>(null);
  const { offline, justReturned } = useOffline();
  const replyRef = React.useRef<HTMLTextAreaElement>(null);

  // Focus + scroll the revealed reply composer into view (T53) so the fixed
  // bottom tab bar never leaves the reply input obscured by the keyboard.
  React.useEffect(() => {
    if (!replyOpen) return;
    const raf = requestAnimationFrame(() => {
      replyRef.current?.focus();
      replyRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    });
    return () => cancelAnimationFrame(raf);
  }, [replyOpen]);

  const menuPost = menuPostId ? posts.find((p) => p.id === menuPostId) ?? null : null;

  async function post(e: React.FormEvent) {
    e.preventDefault();
    if (busy || !contentDraft.value.trim()) return;
    setBusy(true);
    setError(null);
    haptic("tap");
    try {
      const res = await fetch("/api/practice/wall", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: contentDraft.value.trim(), isAnonymous: anonymous }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(j?.error ?? "Could not post. Please try again.");
        return;
      }
      const j = (await res.json()) as { id: string };
      setPosts((prev) => [
        { id: j.id, content: contentDraft.value.trim(), isAnonymous: anonymous, isFaculty: false, isPinned: false, createdAt: new Date().toISOString(), replies: [], reactions: {} },
        ...prev,
      ]);
      contentDraft.clear();
      setComposerOpen(false);
      haptic("success");
    } catch {
      setError("Network error. Your post is still here — try again.");
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
      if (!res.ok) {
        setFeedError("Couldn't update your reaction.");
        return;
      }
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
      setFeedError("Couldn't update your reaction.");
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
      if (res.ok) {
        haptic("success");
        setSheetMsg({ text: "Reported — thanks for flagging it.", tone: "success" });
      } else {
        setSheetMsg({ text: "Couldn't flag it. Please try again.", tone: "error" });
      }
    } catch {
      setSheetMsg({ text: "Couldn't flag it. Please try again.", tone: "error" });
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
      if (!res.ok) {
        setSheetMsg({ text: "Couldn't update the pin. Please try again.", tone: "error" });
        return;
      }
      setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, isPinned: !currentlyPinned } : p)));
      haptic("success");
      setSheetMsg({ text: currentlyPinned ? "Unpinned." : "Pinned as Case of the Week.", tone: "success" });
    } catch {
      setSheetMsg({ text: "Couldn't update the pin. Please try again.", tone: "error" });
    }
  }

  async function sendReply(postId: string) {
    if (replying || !replyDraft.value.trim()) return;
    setReplying(true);
    setReplyError(null);
    haptic("tap");
    try {
      const res = await fetch("/api/practice/wall/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content: replyDraft.value.trim(), isAnonymous: replyAnon }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null;
        setReplyError(j?.error ?? "Couldn't post your reply. Please try again.");
        return; // reply draft is preserved — nothing cleared on failure
      }
      const j = (await res.json()) as { id: string };
      setPosts((prev) => prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          replies: [
            ...(p.replies ?? []),
            { id: j.id, content: replyDraft.value.trim(), isAnonymous: replyAnon, isFaculty: false, createdAt: new Date().toISOString() },
          ],
        };
      }));
      replyDraft.clear();
      setReplyOpen(null);
      haptic("success");
    } catch {
      setReplyError("Network error — your reply is still here. Try again.");
    } finally {
      setReplying(false);
    }
  }

  const composerFields = (
    <>
      <MobileTextarea
        value={contentDraft.value}
        onChange={(e) => contentDraft.setValue(e.target.value)}
        rows={3}
        enterKeyHint="enter"
        placeholder="Share something with the cohort — a question, a win, a hard moment."
        aria-label="Post to the cohort wall"
        className="resize-none"
      />
      <label className="flex min-h-12 cursor-pointer items-center gap-2.5 rounded-md border border-border bg-background px-3 text-small text-muted-foreground">
        <input
          type="checkbox"
          checked={anonymous}
          onChange={(e) => setAnonymous(e.target.checked)}
          className="size-4"
        />
        Post anonymously
      </label>
      {anonymous ? (
        <p className="text-caption text-muted-foreground">
          Your name won&apos;t be shown to anyone in the cohort.
        </p>
      ) : null}
    </>
  );

  return (
    <div className="space-y-6">
      {offline ? (
        <StatusPill tone="warning" label="Offline — your draft saves locally" />
      ) : justReturned ? (
        <StatusPill tone="neutral" label="Back online" />
      ) : null}

      {/* Mobile: feed-first — composer lives in a bottom sheet */}
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
        New post
      </button>

      {/* Desktop: inline composer (unchanged composition) */}
      <form
        onSubmit={post}
        className="hidden space-y-3 rounded-md border-2 border-border bg-card p-5 hard-shadow-sm lg:block"
      >
        {composerFields}
        <button
          type="submit"
          disabled={busy || !contentDraft.value.trim()}
          className="w-full rounded-md border-2 border-foreground bg-primary px-4 py-2.5 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none disabled:opacity-50"
        >
          {busy ? "Posting…" : "Post"}
        </button>
        {error ? <MobileErrorLine>{error}</MobileErrorLine> : null}
      </form>

      {feedError ? <MobileErrorLine>{feedError}</MobileErrorLine> : null}

      {/* posts */}
      <div>
        {posts.length === 0 ? (
          <EmptyState
            icon={<MessageSquare className="size-5" aria-hidden />}
            title="Nothing here yet"
            description="Be the first to break the ice."
          />
        ) : (
          <ul className="space-y-3">
            {posts.map((p) => (
              <li key={p.id} className={`rounded-md border-2 border-border bg-card p-4 ${p.isPinned ? "border-primary" : ""}`}>
                <div className="flex flex-wrap items-center gap-2 text-caption text-muted-foreground">
                  {p.isPinned ? <span className="inline-flex items-center gap-1 font-semibold text-link"><Pin className="size-3.5" aria-hidden /> Pinned</span> : null}
                  {p.isFaculty ? <span className="rounded-full bg-secondary px-2 py-0.5 font-semibold">Faculty</span> : null}
                  {p.isAnonymous ? <span>Anonymous</span> : <span>Cohort member</span>}
                  <span>· {formatRelativeTime(p.createdAt)}</span>
                </div>
                <p className="mt-2 whitespace-pre-wrap break-words text-small">{p.content}</p>

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
                        className={`inline-flex min-h-8 items-center gap-1 rounded-full border px-2.5 py-0.5 text-caption transition-transform active:translate-y-px ${mine ? "border-primary bg-primary/10 text-link" : "border-border text-muted-foreground hover:bg-secondary"}`}
                      >
                        <Icon className="size-3" aria-hidden />
                        {count}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => { setReplyOpen(replyOpen === p.id ? null : p.id); setReplyError(null); haptic("tap"); }}
                    aria-expanded={replyOpen === p.id}
                    className="rounded-full border-2 border-border px-3 py-2 text-caption font-medium text-foreground transition-transform active:translate-y-px"
                  >
                    Reply
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMenuPostId(p.id); setSheetMsg(null); haptic("tap"); }}
                    aria-haspopup="dialog"
                    aria-label="More actions"
                    className="inline-flex size-11 items-center justify-center rounded-full border border-border text-muted-foreground transition-transform hover:bg-secondary active:translate-y-px"
                  >
                    <MoreHorizontal className="size-4" aria-hidden />
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
                          <span>· {formatRelativeTime(r.createdAt)}</span>
                        </div>
                        <p className="mt-1 whitespace-pre-wrap break-words text-small">{r.content}</p>
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
                                className={`inline-flex min-h-8 items-center gap-1 rounded-full border px-1.5 py-0.5 text-caption transition-transform active:translate-y-px ${mine ? "border-primary bg-primary/10 text-link" : "border-border text-muted-foreground hover:bg-secondary"}`}
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
                    <MobileTextarea
                      ref={replyRef}
                      value={replyDraft.value}
                      onChange={(e) => replyDraft.setValue(e.target.value)}
                      rows={2}
                      enterKeyHint="send"
                      placeholder="Write a reply…"
                      aria-label="Write a reply"
                      className="resize-none"
                    />
                    {replyError ? <MobileErrorLine>{replyError}</MobileErrorLine> : null}
                    <div className="flex items-center gap-3">
                      <label className="flex min-h-11 items-center gap-2 text-caption text-muted-foreground">
                        <input type="checkbox" checked={replyAnon} onChange={(e) => setReplyAnon(e.target.checked)} className="size-4" />
                        Reply anonymously
                      </label>
                      <button
                        type="button"
                        onClick={() => void sendReply(p.id)}
                        disabled={replying || !replyDraft.value.trim()}
                        className="ml-auto rounded-md border-2 border-border bg-primary px-4 py-2.5 text-caption font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px disabled:opacity-50"
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

      {/* Compose sheet (mobile) */}
      <MobileBottomSheet
        open={composerOpen}
        onOpenChange={setComposerOpen}
        title="New post"
        description="Share a question, a win, or a hard moment with the cohort."
        footer={
          <button
            type="submit"
            form="wall-compose-form"
            disabled={busy || !contentDraft.value.trim()}
            className="w-full rounded-md border-2 border-foreground bg-primary px-4 py-2.5 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none disabled:opacity-50"
          >
            {busy ? "Posting…" : "Post"}
          </button>
        }
      >
        <form id="wall-compose-form" onSubmit={post} className="space-y-3">
          {composerFields}
          {error ? <MobileErrorLine>{error}</MobileErrorLine> : null}
        </form>
      </MobileBottomSheet>

      {/* Per-post actions sheet (Report / Pin) */}
      <MobileBottomSheet
        open={menuPostId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setMenuPostId(null);
            setSheetMsg(null);
          }
        }}
        title="Post options"
        description={menuPost ? "Report or (faculty) pin this post." : undefined}
      >
        {menuPost ? (
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => void reportPost(menuPost.id)}
              className="flex min-h-11 w-full items-center justify-between rounded-md border border-border px-3 text-small text-foreground transition-transform active:translate-y-px"
            >
              <span>Report this post</span>
            </button>
            {isFacultyViewer ? (
              <button
                type="button"
                onClick={() => void togglePin(menuPost.id, menuPost.isPinned)}
                className="flex min-h-11 w-full items-center justify-between rounded-md border border-border px-3 text-small text-foreground transition-transform active:translate-y-px"
              >
                <span className="inline-flex items-center gap-2">
                  <Pin className="size-3.5" aria-hidden />
                  {menuPost.isPinned ? "Unpin" : "Pin as Case of the Week"}
                </span>
              </button>
            ) : null}
            {sheetMsg ? (
              sheetMsg.tone === "error" ? (
                <MobileErrorLine>{sheetMsg.text}</MobileErrorLine>
              ) : (
                <p className="text-small text-muted-foreground">{sheetMsg.text}</p>
              )
            ) : null}
          </div>
        ) : null}
      </MobileBottomSheet>
    </div>
  );
}
