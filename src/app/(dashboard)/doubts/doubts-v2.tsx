"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronRight, Loader2, Lock, Plus, Send, ThumbsUp } from "lucide-react";
import { askDoubt, markSolved, reclassifyMine, replyToDoubt, voteReply } from "./actions";
import { COMPLAINT_NOTICE, looksLikeComplaint } from "@/lib/doubts/classify";
import type { DoubtListItem, DoubtThread } from "@/lib/doubts/data";
import { cn } from "@/lib/utils";
import { PageFrame, Section, Tint } from "@/components/ds";
import { ThumbBar } from "@/components/mobile/thumb-bar";
import { OnceHint } from "@/components/help/once-hint";
import { BackLink, chipClass, chipRow, EmptyLine, fieldClass, labelClass, primaryButton, quietButton, StatusWord, textButton } from "@/components/v2me/parts";
import { ago, EMPTY } from "./doubts-ui";

type Filter = "all" | "open" | "mine" | "complaint";
const FILTERS: [Filter, string][] = [
  ["all", "All doubts"],
  ["open", "Unanswered"],
  ["mine", "Mine"],
  ["complaint", "My concerns"],
];

/**
 * Doubts (new design). One purpose: read and ask. The list is plain rows;
 * the filters wrap instead of running off the screen; Ask is pinned where
 * the thumb is on phones and sits beside the title on wide screens.
 */
export function DoubtsV2({
  items,
  canAskCohort,
  canAsk = true,
  title = "Doubts",
  group,
  adminNote,
  showWall = false,
}: {
  items: DoubtListItem[];
  canAskCohort: string | null;
  canAsk?: boolean;
  title?: string;
  /** Who sees a post ("Batch 2", "your batch"). */
  group?: string;
  adminNote?: React.ReactNode;
  showWall?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [heading, setHeading] = React.useState("");
  const [body, setBody] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<Filter>("all");
  const titleRef = React.useRef<HTMLInputElement>(null);

  const complaintish = looksLikeComplaint(heading, body);
  const shown = items.filter((d) => {
    // "Unanswered" means what it says: nobody has replied yet.
    if (filter === "open") return d.status === "open" && d.kind === "doubt" && d.replies === 0;
    if (filter === "mine") return d.mine;
    if (filter === "complaint") return d.kind === "complaint" && d.mine;
    return d.kind === "doubt" || d.mine;
  });

  const post = async (markAs?: "doubt" | "complaint") => {
    setBusy(true);
    setErr(null);
    let res: Awaited<ReturnType<typeof askDoubt>>;
    try {
      res = await askDoubt({ title: heading, body, cohortId: canAskCohort, markAs });
    } catch {
      res = { error: "Your doubt was not sent. Check your connection and try again." };
    }
    setBusy(false);
    if (res.error) setErr(res.error);
    else {
      setHeading("");
      setBody("");
      setOpen(false);
      if (res.id) router.push(`/doubts/${res.id}`);
      else router.refresh();
    }
  };

  const startAsk = () => {
    setOpen(true);
    // The form mounts on this click: focus its first field once it is there.
    requestAnimationFrame(() => {
      titleRef.current?.scrollIntoView({ block: "center" });
      titleRef.current?.focus();
    });
  };

  return (
    <PageFrame
      title={title}
      width="default"
      actions={
        canAsk && !open ? (
          <button type="button" onClick={startAsk} className={cn(primaryButton, "hidden min-h-11 py-2 md:inline-flex")}>
            <Plus aria-hidden /> Ask a doubt
          </button>
        ) : undefined
      }
    >
      {group ? (
        <OnceHint id="doubts" className="-mt-6 max-w-[60ch] type-small text-muted-foreground md:-mt-10">
          {group[0].toUpperCase()}
          {group.slice(1)} sees what you post, and anyone can answer. A concern about the course or your account goes privately to the VIBHA team.
        </OnceHint>
      ) : null}
      {adminNote ? <p className="max-w-[60ch] type-small text-muted-foreground">{adminNote}</p> : null}

      {open ? (
        <Section id="ask" title="Ask a doubt" className="max-w-2xl">
          <form
            className="flex min-w-0 flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!busy && heading.trim().length >= 3 && !(complaintish && heading)) void post();
            }}
          >
            <div className="flex min-w-0 flex-col gap-1.5">
              <label htmlFor="doubt-title" className={labelClass}>
                Your doubt
              </label>
              <input ref={titleRef} id="doubt-title" value={heading} onChange={(e) => setHeading(e.target.value)} placeholder="In one line: mood and affect, what is the difference?" className={fieldClass} />
            </div>
            <div className="flex min-w-0 flex-col gap-1.5">
              <label htmlFor="doubt-body" className={labelClass}>
                More detail <span className="font-medium text-muted-foreground">(optional)</span>
              </label>
              <textarea id="doubt-body" value={body} onChange={(e) => setBody(e.target.value)} rows={3} placeholder="What have you tried, or where did you get stuck?" className={fieldClass} />
            </div>
            {complaintish && heading ? (
              <Tint className="flex flex-col gap-3">
                <p className="type-body font-semibold">This reads like a concern, not a study doubt</p>
                <p className="max-w-[60ch] type-small text-muted-foreground">{COMPLAINT_NOTICE}</p>
                <div className="flex min-w-0 flex-wrap gap-2">
                  <button type="button" onClick={() => post("complaint")} disabled={busy} className={cn(quietButton, "border-foreground bg-foreground text-background hover:bg-foreground")}>
                    Send privately to VIBHA
                  </button>
                  <button type="button" onClick={() => post("doubt")} disabled={busy} className={quietButton}>
                    No, it&apos;s a study doubt: post it
                  </button>
                </div>
              </Tint>
            ) : null}
            {err ? (
              <p role="alert" className="type-small font-semibold text-status-alert-fg">
                {err}
              </p>
            ) : null}
            <div className="flex min-w-0 flex-wrap gap-3">
              {!complaintish || !heading ? (
                <button type="submit" disabled={busy || heading.trim().length < 3} className={cn(primaryButton, "flex-1 md:flex-none")}>
                  {busy ? <Loader2 className="animate-spin" aria-hidden /> : <Send aria-hidden />} Post doubt
                </button>
              ) : null}
              <button type="button" onClick={() => setOpen(false)} className={cn(quietButton, "min-h-[3.25rem]")}>
                Cancel
              </button>
            </div>
          </form>
        </Section>
      ) : null}

      <div className="flex min-w-0 flex-col gap-4">
        <nav className={chipRow} aria-label="Filter">
          {FILTERS.map(([k, l]) => (
            <button key={k} type="button" aria-pressed={filter === k} onClick={() => setFilter(k)} className={chipClass(filter === k)}>
              {l}
            </button>
          ))}
        </nav>

        {shown.length === 0 ? (
          <EmptyLine title={EMPTY[filter]} />
        ) : (
          <ul className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
            {shown.map((d) => (
              <li key={d.id} className="min-w-0">
                <Link
                  href={`/doubts/${d.id}`}
                  className="group/row -mx-2 flex min-h-16 min-w-0 items-center gap-4 rounded-lg px-2 py-3 outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring active:bg-[var(--ds-tint)]"
                >
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="type-body font-semibold [overflow-wrap:anywhere]">{d.title}</span>
                    <span className="type-small text-muted-foreground [overflow-wrap:anywhere]">
                      {d.kind === "complaint" ? "Private concern · " : ""}
                      {d.author} · {ago(d.createdAt)}
                    </span>
                  </span>
                  {d.status === "solved" ? (
                    <StatusWord tone="good" icon={<CheckCircle2 aria-hidden />}>
                      Solved
                    </StatusWord>
                  ) : (
                    <span className={cn("shrink-0 type-small type-num", d.replies === 0 ? "text-muted-foreground" : "font-semibold text-foreground")}>
                      {d.replies === 0 ? "No answers" : `${d.replies} ${d.replies === 1 ? "answer" : "answers"}`}
                    </span>
                  )}
                  <ChevronRight aria-hidden className="size-5 shrink-0 text-muted-foreground transition-transform duration-[var(--ds-state)] group-hover/row:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* The batch Wall is not a menu place of its own: it opens from here. */}
      {showWall ? (
        <Link href="/wall" className={cn(textButton, "w-fit")}>
          Wall: posts from your batch <ChevronRight aria-hidden />
        </Link>
      ) : null}

      {canAsk && !open ? (
        <ThumbBar label="Ask" className="md:hidden" inlineClassName="md:hidden">
          <button type="button" onClick={startAsk} className={cn(primaryButton, "w-full")}>
            <Plus aria-hidden /> Ask a doubt
          </button>
        </ThumbBar>
      ) : null}
    </PageFrame>
  );
}

/** One thread (new design): the question as the page title, answers as plain text with hairlines, the answer box last. */
export function DoubtThreadV2({ thread, cohortId }: { thread: DoubtThread; cohortId: string | null }) {
  const router = useRouter();
  const [body, setBody] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  const [acting, startAct] = React.useTransition();
  // The writer of a private concern can answer the VIBHA team back in the same thread.
  const canReply = thread.kind === "doubt" || thread.mine;

  const send = async () => {
    setBusy(true);
    setErr(null);
    try {
      const res = await replyToDoubt(thread.id, body);
      if (res.error) setErr(res.error);
      else {
        setBody("");
        router.refresh();
      }
    } catch {
      setErr("Your answer was not sent. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };
  const act = (fn: () => Promise<{ error: string | null }>) => {
    if (acting) return;
    setErr(null);
    startAct(async () => {
      try {
        const res = await fn();
        if (res.error) setErr(res.error);
        else router.refresh();
      } catch {
        setErr("That did not go through. Check your connection and try again.");
      }
    });
  };

  return (
    <PageFrame width="reading" className="gap-6 md:gap-8">
      <BackLink href="/doubts">Doubts</BackLink>

      <article className="flex min-w-0 flex-col gap-3">
        {thread.kind === "complaint" || thread.status === "solved" ? (
          <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1">
            {thread.kind === "complaint" ? <StatusWord icon={<Lock aria-hidden />}>Private: only you and VIBHA</StatusWord> : null}
            {thread.status === "solved" ? (
              <StatusWord tone="good" icon={<CheckCircle2 aria-hidden />}>
                Solved
              </StatusWord>
            ) : null}
          </div>
        ) : null}
        <h1 className="type-h1 [overflow-wrap:anywhere]">{thread.title}</h1>
        {thread.body ? <p className="type-reading whitespace-pre-line [overflow-wrap:anywhere]">{thread.body}</p> : null}
        <p className="type-small text-muted-foreground">
          Asked by {thread.author} · {ago(thread.createdAt)}
        </p>
        {thread.mine && thread.kind === "doubt" ? (
          <button type="button" disabled={acting} onClick={() => act(() => reclassifyMine(thread.id, "complaint", cohortId))} className={cn(textButton, "w-fit text-left")}>
            This is a concern for VIBHA, not a study doubt
          </button>
        ) : null}
      </article>

      <Section id="answers" title={`${thread.replies.length} ${thread.replies.length === 1 ? "answer" : "answers"}`}>
        {thread.replies.length ? (
          <ul className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
            {thread.replies.map((r) => (
              <li key={r.id} className="flex min-w-0 flex-col gap-2 py-4">
                {r.isSolution ? (
                  <StatusWord tone="good" icon={<CheckCircle2 aria-hidden />}>
                    Marked as the solution
                  </StatusWord>
                ) : null}
                <p className="type-reading whitespace-pre-line [overflow-wrap:anywhere]">{r.body}</p>
                <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="min-w-0 flex-1 type-small text-muted-foreground [overflow-wrap:anywhere]">
                    {r.author} · {ago(r.createdAt)}
                  </span>
                  <button
                    type="button"
                    aria-pressed={r.youVoted}
                    disabled={acting}
                    onClick={() => act(() => voteReply(thread.id, r.id, !r.youVoted))}
                    className={cn(quietButton, "type-num", r.youVoted && "border-foreground bg-primary text-primary-foreground hover:bg-primary")}
                  >
                    <ThumbsUp aria-hidden /> {r.votes} helped
                  </button>
                  {thread.mine && thread.kind === "doubt" ? (
                    <button type="button" disabled={acting} onClick={() => act(() => markSolved(thread.id, r.isSolution ? null : r.id))} className={textButton}>
                      {r.isSolution ? "Unmark" : "Mark as solved"}
                    </button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        ) : thread.kind === "doubt" ? (
          <p className="type-small text-muted-foreground">Nobody has answered yet.</p>
        ) : null}
      </Section>

      {thread.kind !== "doubt" ? <p className="max-w-[60ch] type-small text-muted-foreground">The VIBHA team can see this and will get back to you. Other students cannot see it.</p> : null}

      {canReply ? (
        <section aria-label="Your answer" className="flex min-w-0 flex-col gap-3">
          <h2 id="doubt-answer" className="type-h3">
            {thread.kind === "doubt" ? "Help out: add your answer" : "Add to your message"}
          </h2>
          <textarea
            aria-labelledby="doubt-answer"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            placeholder={thread.kind === "doubt" ? "Explain it in your own words, or share how you remember it." : "Anything more for the VIBHA team."}
            className={fieldClass}
          />
          <button type="button" onClick={send} disabled={busy || body.trim().length < 1} className={cn(primaryButton, "w-full md:w-fit md:min-w-48")}>
            {busy ? <Loader2 className="animate-spin" aria-hidden /> : <Send aria-hidden />} {thread.kind === "doubt" ? "Post answer" : "Send"}
          </button>
        </section>
      ) : null}
      {/* Errors from any button on the thread show here, also on a private concern. */}
      {err ? (
        <p role="alert" className="type-small font-semibold text-status-alert-fg">
          {err}
        </p>
      ) : null}
    </PageFrame>
  );
}
