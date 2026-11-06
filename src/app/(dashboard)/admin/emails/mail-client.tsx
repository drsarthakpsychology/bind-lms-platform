"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Archive, CheckCheck, Inbox, Loader2, Send } from "lucide-react";
import { clearFailed, markRead, replyToInbound, setArchived } from "./mail-actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

/**
 * Gmail keyboard shortcuts for Mail: C compose · J/K next/previous email ·
 * E archive (inbox) · U back to the list. Ignored while typing.
 */
export function MailKeys({ folder }: { folder: string }) {
  const router = useRouter();
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
      const rows = Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-mail-row]"));
      const cur = rows.findIndex((r) => r.getAttribute("aria-current") === "true");
      if (e.key === "c") router.push("/admin/emails?folder=compose");
      else if ((e.key === "j" || e.key === "k") && rows.length) {
        const next = e.key === "j" ? Math.min(rows.length - 1, cur + 1) : Math.max(0, cur - 1);
        rows[next]?.click();
      } else if (e.key === "u") router.push(`/admin/emails?folder=${folder}`);
      else if (e.key === "e") document.getElementById("mail-archive")?.click();
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, folder]);
  return null;
}

/** Reading-pane controls for an inbound email: reply box + archive. */
export function InboundControls({ id, archived, unread }: { id: string; archived: boolean; unread: boolean }) {
  const router = useRouter();
  const [text, setText] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (unread) void markRead(id).then(() => router.refresh());
  }, [id, unread, router]);

  return (
    <div className="space-y-3">
      <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={5} placeholder="Write a reply…" aria-label="Reply" />
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          disabled={busy || !text.trim()}
          onClick={async () => {
            setBusy(true);
            const r = await replyToInbound(id, text);
            setBusy(false);
            setMsg(r.error ?? "Reply sent.");
            if (!r.error) {
              setText("");
              router.refresh();
            }
          }}
        >
          {busy ? <Loader2 className="animate-spin" aria-hidden /> : <Send aria-hidden />} Send reply
        </Button>
        <Button
          id="mail-archive"
          type="button"
          variant="outline"
          onClick={async () => {
            await setArchived(id, !archived);
            router.push("/admin/emails?folder=inbox");
            router.refresh();
          }}
        >
          {archived ? <Inbox aria-hidden /> : <Archive aria-hidden />} {archived ? "Move to inbox" : "Archive"}
          <kbd className="ml-1 hidden rounded border border-current px-1 font-mono text-[0.65rem] lg:inline">E</kbd>
        </Button>
        {msg ? <span className="text-caption font-semibold" role="status">{msg}</span> : null}
      </div>
    </div>
  );
}

/** Mail → Failed: clear every failed send at once (two taps, nothing deleted). */
export function ClearFailedButton({ count }: { count: number }) {
  const router = useRouter();
  const [sure, setSure] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);
  const go = async () => {
    if (!sure) {
      setSure(true);
      return;
    }
    setBusy(true);
    const res = await clearFailed();
    setBusy(false);
    setSure(false);
    if (res.error) setMsg(res.error);
    else {
      setMsg(`Cleared ${res.cleared}.`);
      router.refresh();
    }
  };
  return (
    <span className="flex shrink-0 flex-col items-end gap-1">
      <button
        type="button"
        onClick={go}
        disabled={busy}
        className="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-md border-2 border-foreground bg-foreground px-3.5 text-sm font-bold text-background disabled:opacity-60"
      >
        {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <CheckCheck className="size-4" aria-hidden />}
        {sure ? `Yes, clear ${count}` : "Clear failed"}
      </button>
      {msg ? <span role="status" className="text-caption font-semibold">{msg}</span> : null}
    </span>
  );
}
