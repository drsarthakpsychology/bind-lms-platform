"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, MessageCircleQuestion, Plus, Send, ShieldAlert, ThumbsUp } from "lucide-react";
import { askDoubt, markSolved, reclassifyMine, replyToDoubt, voteReply } from "./actions";
import { COMPLAINT_NOTICE, looksLikeComplaint } from "@/lib/doubts/classify";
import type { DoubtListItem, DoubtThread } from "@/lib/doubts/data";
import { cn } from "@/lib/utils";

const ago = (iso: string) => {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} h ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

/** Ask box + list. The student writes a doubt; if it reads like a complaint we say so. */
export function DoubtsBoard({ items, canAskCohort, canAsk = true }: { items: DoubtListItem[]; canAskCohort: string | null; /** Admins reply; they don't ask (owner, 2026-11-06). */ canAsk?: boolean }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<"all" | "open" | "mine" | "complaint">("all");

  const complaintish = looksLikeComplaint(title, body);
  const shown = items.filter((d) => {
    if (filter === "open") return d.status === "open" && d.kind === "doubt";
    if (filter === "mine") return d.mine;
    if (filter === "complaint") return d.kind === "complaint" && d.mine;
    return d.kind === "doubt" || d.mine;
  });

  const post = async (markAs?: "doubt" | "complaint") => {
    setBusy(true);
    setErr(null);
    const res = await askDoubt({ title, body, cohortId: canAskCohort, markAs });
    setBusy(false);
    if (res.error) setErr(res.error);
    else {
      setTitle("");
      setBody("");
      setOpen(false);
      if (res.id) router.push(`/doubts/${res.id}`);
      else router.refresh();
    }
  };

  return (
    <div className="space-y-4">
      {open ? (
        <div className="space-y-3 rounded-2xl border-2 border-foreground bg-card p-4 hard-shadow-sm">
          <label htmlFor="doubt-title" className="block text-sm font-bold">Your doubt</label>
          <input
            id="doubt-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="In one line, e.g. Difference between mood and affect?"
            className="-mt-1 h-11 w-full rounded-xl border-2 border-foreground bg-background px-3 text-base font-semibold outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
          />
          <label htmlFor="doubt-body" className="block text-sm font-bold">More detail <span className="font-normal text-muted-foreground">(optional)</span></label>
          <textarea
            id="doubt-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            placeholder="Add any detail. What have you tried or where did you get stuck?"
            className="-mt-1 w-full rounded-xl border-2 border-foreground bg-background px-3 py-2 text-base outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
          />
          {complaintish && title ? (
            <div className="rounded-xl border-2 border-foreground bg-muted p-3 text-sm">
              <p className="flex items-center gap-1.5 font-semibold">
                <ShieldAlert className="size-4 text-link" aria-hidden /> This looks like a concern, not a study doubt
              </p>
              <p className="mt-1 text-muted-foreground">{COMPLAINT_NOTICE}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button type="button" onClick={() => post("complaint")} disabled={busy} className="min-h-10 rounded-md border-2 border-foreground bg-foreground px-3.5 text-sm font-bold text-background disabled:opacity-50 pointer-coarse:min-h-11">
                  Send privately to VIBHA
                </button>
                <button type="button" onClick={() => post("doubt")} disabled={busy} className="min-h-10 rounded-md border-2 border-foreground bg-card px-3.5 text-sm font-bold disabled:opacity-50 pointer-coarse:min-h-11">
                  No, it&apos;s a study doubt — post it
                </button>
              </div>
            </div>
          ) : null}
          {err ? <p className="text-sm font-semibold text-status-alert-fg">{err}</p> : null}
          <div className="flex gap-2">
            {!complaintish || !title ? (
              <button type="button" onClick={() => post()} disabled={busy || title.trim().length < 3} className="inline-flex h-10 items-center gap-1.5 rounded-md border-2 border-foreground bg-primary px-4 text-sm font-bold pointer-coarse:h-11 text-primary-foreground disabled:opacity-50">
                {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Send className="size-4" aria-hidden />} Post doubt
              </button>
            ) : null}
            <button type="button" onClick={() => setOpen(false)} className="h-10 rounded-md border-2 border-foreground px-4 text-sm font-semibold pointer-coarse:h-11">
              Cancel
            </button>
          </div>
        </div>
      ) : canAsk ? (
        <button type="button" onClick={() => setOpen(true)} className="inline-flex h-11 items-center gap-2 rounded-md border-2 border-foreground bg-primary px-5 text-sm font-bold text-primary-foreground hard-shadow-sm">
          <Plus className="size-5" aria-hidden /> Ask a doubt
        </button>
      ) : null}

      <nav className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]" aria-label="Filter">
        {(
          [
            ["all", "All doubts"],
            ["open", "Unanswered"],
            ["mine", "Mine"],
            ["complaint", "My concerns"],
          ] as const
        ).map(([k, l]) => (
          <button key={k} type="button" aria-pressed={filter === k} onClick={() => setFilter(k)} className={cn("h-9 shrink-0 rounded-full border-2 border-foreground px-3.5 pointer-coarse:h-11 text-sm font-semibold", filter === k ? "bg-foreground text-background" : "bg-card")}>
            {l}
          </button>
        ))}
      </nav>

      {shown.length === 0 ? (
        <p className="rounded-2xl border-2 border-dashed border-foreground/30 p-6 text-center text-sm text-muted-foreground">No doubts here yet. Be the first to ask — someone in your batch will help.</p>
      ) : (
        <ul className="space-y-2">
          {shown.map((d) => (
            <li key={d.id}>
              <Link href={`/doubts/${d.id}`} className="flex items-center gap-3 rounded-2xl border-2 border-foreground bg-card p-4 transition-transform hover:-translate-y-0.5">
                <span aria-hidden className={cn("grid size-10 shrink-0 place-items-center rounded-xl border-2 border-foreground", d.status === "solved" ? "bg-status-success-bg text-status-success-fg" : d.kind === "complaint" ? "bg-muted" : "bg-primary text-primary-foreground")}>
                  {d.status === "solved" ? <CheckCircle2 className="size-5" /> : d.kind === "complaint" ? <ShieldAlert className="size-5" /> : <MessageCircleQuestion className="size-5" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 block font-bold break-words">{d.title}</span>
                  <span className="block text-caption text-muted-foreground">
                    {d.kind === "complaint" ? "Private concern · " : ""}
                    {d.author} · {ago(d.createdAt)}
                    {d.status === "solved" ? " · Solved" : ""}
                  </span>
                </span>
                <span className="shrink-0 text-right text-caption text-muted-foreground">
                  {d.replies} {d.replies === 1 ? "reply" : "replies"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** One thread: the question, the answers, and a box to answer. */
export function DoubtThreadView({ thread, cohortId }: { thread: DoubtThread; cohortId: string | null }) {
  const router = useRouter();
  const [body, setBody] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  const send = async () => {
    setBusy(true);
    setErr(null);
    const res = await replyToDoubt(thread.id, body);
    setBusy(false);
    if (res.error) setErr(res.error);
    else {
      setBody("");
      router.refresh();
    }
  };
  const act = async (fn: () => Promise<{ error: string | null }>) => {
    const res = await fn();
    if (res.error) setErr(res.error);
    else router.refresh();
  };

  return (
    <div className="space-y-5">
      <article className="rounded-2xl border-2 border-foreground bg-card p-5">
        <div className="flex flex-wrap items-center gap-2">
          {thread.kind === "complaint" ? <span className="rounded-full border-2 border-foreground bg-muted px-2.5 py-0.5 text-xs font-bold">Private concern · only you and VIBHA</span> : null}
          {thread.status === "solved" ? <span className="rounded-full border-2 border-foreground bg-status-success-bg px-2.5 py-0.5 text-xs font-bold text-status-success-fg">Solved</span> : null}
        </div>
        <h1 className="mt-2 text-h2 break-words">{thread.title}</h1>
        {thread.body ? <p className="mt-2 whitespace-pre-line break-words text-[1.0625rem] leading-relaxed">{thread.body}</p> : null}
        <p className="mt-2 text-caption text-muted-foreground">Asked by {thread.author} · {ago(thread.createdAt)}</p>
        {thread.mine && thread.kind === "doubt" ? (
          <button type="button" onClick={() => act(() => reclassifyMine(thread.id, "complaint", cohortId))} className="mt-1 inline-flex min-h-11 items-center text-caption font-semibold text-link underline">
            This is actually a concern for VIBHA, not a study doubt
          </button>
        ) : null}
      </article>

      <section aria-label="Answers" className="space-y-3">
        <h2 className="text-h3 font-bold">{thread.replies.length} {thread.replies.length === 1 ? "answer" : "answers"}</h2>
        {thread.replies.map((r) => (
          <article key={r.id} className={cn("rounded-2xl border-2 p-4", r.isSolution ? "border-status-success-fg bg-status-success-bg" : "border-foreground bg-card")}>
            {r.isSolution ? (
              <p className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-status-success-fg">
                <CheckCircle2 className="size-4" aria-hidden /> Marked as the solution
              </p>
            ) : null}
            <p className="whitespace-pre-line break-words text-[1.0625rem] leading-relaxed">{r.body}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-caption">
              <span className="text-muted-foreground">{r.author} · {ago(r.createdAt)}</span>
              <button type="button" aria-pressed={r.youVoted} onClick={() => act(() => voteReply(thread.id, r.id, !r.youVoted))} className={cn("inline-flex min-h-9 items-center gap-1 rounded-md border-2 border-foreground px-2.5 py-0.5 font-bold pointer-coarse:min-h-11", r.youVoted ? "bg-primary text-primary-foreground" : "bg-card")}>
                <ThumbsUp className="size-3.5" aria-hidden /> {r.votes} helped
              </button>
              {thread.mine && thread.kind === "doubt" ? (
                <button type="button" onClick={() => act(() => markSolved(thread.id, r.isSolution ? null : r.id))} className="inline-flex min-h-9 items-center font-bold text-link underline pointer-coarse:min-h-11">
                  {r.isSolution ? "Unmark" : "Mark as solved"}
                </button>
              ) : null}
            </div>
          </article>
        ))}
      </section>

      {thread.kind === "doubt" ? (
        <section aria-label="Your answer" className="space-y-2 rounded-2xl border-2 border-foreground bg-card p-4">
          <h2 id="doubt-answer" className="text-sm font-bold">Help out — add your answer</h2>
          <textarea aria-labelledby="doubt-answer" value={body} onChange={(e) => setBody(e.target.value)} rows={3} placeholder="Explain it in your own words, or share how you remember it." className="w-full rounded-xl border-2 border-foreground bg-background px-3 py-2 text-base outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60" />
          {err ? <p className="text-sm font-semibold text-status-alert-fg">{err}</p> : null}
          <button type="button" onClick={send} disabled={busy || body.trim().length < 1} className="inline-flex h-10 items-center gap-1.5 rounded-md border-2 border-foreground bg-primary px-4 text-sm font-bold text-primary-foreground pointer-coarse:h-11 disabled:opacity-50">
            {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Send className="size-4" aria-hidden />} Post answer
          </button>
        </section>
      ) : (
        <p className="rounded-2xl border-2 border-foreground bg-muted p-4 text-sm">The VIBHA team can see this and will get back to you. Other students can&apos;t see it.</p>
      )}
    </div>
  );
}
