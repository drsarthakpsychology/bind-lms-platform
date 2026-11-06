"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Reply, Send } from "lucide-react";
import { replyEmailFromInbox, replyFromInbox } from "@/app/(dashboard)/admin/inbox/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

/**
 * Inline reply box used by the Inbox and the student profile. Closed it is one
 * "Reply" button; open it is a text box + Send. Nothing is sent until the
 * admin presses Send.
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
        className="min-h-28 text-base"
      />
      <div className="flex flex-wrap items-center gap-2">
        <Button type="submit" size="sm" className="pointer-coarse:min-h-11" disabled={pending || !text.trim()}>
          {pending ? <Loader2 className="animate-spin" aria-hidden /> : <Send aria-hidden />} {pending ? "Sending…" : "Send reply"}
        </Button>
        <Button type="button" variant="ghost" size="sm" className="pointer-coarse:min-h-11" disabled={pending} onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
