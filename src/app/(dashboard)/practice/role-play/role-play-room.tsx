"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Send, Users } from "lucide-react";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

/**
 * The peer role-play chat room. Polls the thread every 2s (the person on the
 * other side types independently). No AI — the peer is the patient/clinician.
 */
export function RolePlayRoom({ sessionId, myRole, myId }: { sessionId: string; myRole: string; myId: string }) {
  const router = useRouter();
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [draft, setDraft] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const endRef = React.useRef<HTMLDivElement>(null);

  const load = React.useCallback(async () => {
    try {
      const res = await fetch(`/api/practice/roleplay/messages?sessionId=${sessionId}`);
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (!res.ok) return;
      const j = (await res.json()) as { messages: Message[] };
      setMessages(j.messages);
    } catch {
      /* transient — next poll retries */
    }
  }, [sessionId, router]);

  // Poll the thread every 2s (the first tick loads the initial messages).
  React.useEffect(() => {
    const id = setInterval(load, 2000);
    return () => clearInterval(id);
  }, [load]);

  // Auto-scroll to newest.
  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (sending || !draft.trim()) return;
    setSending(true);
    setError(null);
    haptic("tap");
    try {
      const res = await fetch("/api/practice/roleplay/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, content: draft.trim() }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(j?.error ?? "Could not send.");
        return;
      }
      setDraft("");
      haptic("success");
      await load(); // immediate refresh
    } catch {
      setError("Network error.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link href="/practice/role-play" className="text-caption font-medium text-link hover:underline">
          ← Back to sessions
        </Link>
        <span className="flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-caption font-medium text-muted-foreground">
          <Users className="size-3.5" aria-hidden />
          You play the <span className="font-semibold">{myRole}</span>
        </span>
      </div>

      {/* thread */}
      <div className="max-h-[50vh] min-h-[40vh] space-y-2 overflow-y-auto rounded-md border-2 border-border bg-card p-4">
        {messages.length === 0 ? (
          <p className="py-10 text-center text-small text-muted-foreground">
            The room is empty. Send the first line — pick up the role you&apos;re playing.
          </p>
        ) : (
          messages.map((m) => {
            const mine = m.sender_id === myId;
            return (
              <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[80%] rounded-md border-2 border-border px-3 py-2",
                    mine ? "bg-primary text-primary-foreground" : "bg-background",
                  )}
                >
                  <p className="text-small">{m.content}</p>
                  <p className={cn("mt-1 text-caption", mine ? "text-primary-foreground/70" : "text-muted-foreground")}>
                    {new Date(m.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>

      {/* composer */}
      <form onSubmit={send} className="flex items-center gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="In character, in role…"
          maxLength={2000}
          className="flex-1 rounded-md border-2 border-border bg-background px-3 py-2 text-small focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="submit"
          disabled={sending || !draft.trim()}
          className="flex items-center gap-1 rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px disabled:opacity-50"
        >
          <Send className="size-3.5" aria-hidden />
          Send
        </button>
      </form>
      {error ? <p className="text-small text-red-600" role="alert">{error}</p> : null}
    </div>
  );
}
