"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Reply, Send, Sparkles } from "lucide-react";
import { draftDoubtAnswer, replyEmailFromInbox, replyFromInbox } from "@/app/(dashboard)/admin/inbox/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

/**
 * Inline reply box used by the Inbox and the student profile. Closed it is one
 * "Reply" button; open it is a text box + Send. Nothing is sent until the
 * admin presses Send. Doubts also get "Draft with AI": it only fills the box
 * (marked as an AI draft) for the admin to check and edit; AI never sends.
 */
export function InlineReply({
  target,
  id,
  label,
  canWrite,
}: {
  target: "doubt" | "email";
  id: string;
  /** Who it goes to, for the screen-reader label ("Reply to Priya"). */
  label: string;
  canWrite: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState("");
  const [pending, start] = React.useTransition();
  const [drafting, startDraft] = React.useTransition();
  const [fromAi, setFromAi] = React.useState(false);
  const boxId = `reply-${target}-${id}`;

  if (!canWrite) return null;
  if (!open) {
    return (
      <Button type="button" variant="outline" size="sm" className="pointer-coarse:min-h-11" onClick={() => setOpen(true)} aria-controls={boxId}>
        <Reply aria-hidden /> Reply
      </Button>
    );
  }

  return (
    <form
      id={boxId}
      className="space-y-2"
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => {
          const r = target === "doubt" ? await replyFromInbox(id, text) : await replyEmailFromInbox(id, text);
          if (r.error) return void toast.error(r.error);
          toast.success("Reply sent");
          setText("");
          setFromAi(false);
          setOpen(false);
          router.refresh();
        });
      }}
    >
      <label htmlFor={`${boxId}-text`} className="sr-only">
        {label}
      </label>
      <Textarea
        id={`${boxId}-text`}
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your reply"
        autoFocus
        aria-describedby={fromAi ? `${boxId}-ai` : undefined}
        className="min-h-28 text-base"
      />
      {fromAi ? (
        <p id={`${boxId}-ai`} className="flex items-center gap-1.5 text-caption text-muted-foreground" role="status">
          <Sparkles className="size-3.5 shrink-0" aria-hidden /> AI draft. Check the facts and edit it before you send.
        </p>
      ) : null}
      <div className="flex flex-wrap items-center gap-2">
        <Button type="submit" size="sm" className="pointer-coarse:min-h-11" disabled={pending || drafting || !text.trim()}>
          {pending ? <Loader2 className="animate-spin" aria-hidden /> : <Send aria-hidden />} {pending ? "Sending…" : "Send reply"}
        </Button>
        {target === "doubt" ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="pointer-coarse:min-h-11"
            disabled={pending || drafting}
            onClick={() => {
              if (text.trim() && !window.confirm("Replace what you've written with an AI draft?")) return;
              startDraft(async () => {
                const r = await draftDoubtAnswer(id);
                if (r.error || !r.text) return void toast.error(r.error ?? "No draft.");
                setText(r.text);
                setFromAi(true);
              });
            }}
          >
            {drafting ? <Loader2 className="animate-spin" aria-hidden /> : <Sparkles aria-hidden />} {drafting ? "Drafting…" : "Draft with AI"}
          </Button>
        ) : null}
        <Button type="button" variant="ghost" size="sm" className="pointer-coarse:min-h-11" disabled={pending} onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
