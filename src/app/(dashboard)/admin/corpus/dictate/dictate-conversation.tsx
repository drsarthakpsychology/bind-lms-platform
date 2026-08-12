"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";

interface Turn {
  by: "sarthak" | "interviewer";
  text: string;
  at: string;
}

interface DictationResponse {
  sessionId: string;
  followUp: string | null;
  progress: string;
  complete: boolean;
  transcript: Turn[];
}

/**
 * A7 — Dictation as a conversation. Dr. Sarthak talks (or types); the
 * interviewer state machine asks the next clinical question. Works fully on
 * fixtures (AI_ENABLED=false) via deterministic follow-ups.
 */
export function DictateConversation() {
  const [sessionId, setSessionId] = React.useState<string | null>(null);
  const [input, setInput] = React.useState("");
  const [transcript, setTranscript] = React.useState<Turn[]>([]);
  const [progress, setProgress] = React.useState("0 fields");
  const [complete, setComplete] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [title, setTitle] = React.useState("");

  async function send(line: string) {
    if (busy) return;
    setBusy(true);
    setError(null);
    haptic("tap");
    try {
      const res = await fetch("/api/practice/corpus/dictate/turn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionId ?? undefined, rawTranscript: line }),
      });
      const j = (await res.json()) as DictationResponse;
      if (!res.ok) {
        setError(j && "error" in j ? String(j.error) : "Turn failed.");
        return;
      }
      setSessionId(j.sessionId);
      setTranscript(j.transcript);
      setProgress(j.progress);
      setComplete(j.complete);
      if (j.complete) haptic("success");
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  }

  /** Save the built draft case. */
  async function finish() {
    if (!sessionId) return;
    setBusy(true);
    setError(null);
    haptic("tap");
    try {
      const res = await fetch("/api/practice/corpus/dictate/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, title: title.trim() || undefined }),
      });
      const j = (await res.json()) as { error?: string; caseId?: string; missingFields?: string[] };
      if (!res.ok) {
        setError(j.error ?? "Could not save.");
        return;
      }
      haptic("success");
      setComplete(true);
      const missing = (j.missingFields ?? []) as string[];
      setError(
        missing.length
          ? `Saved draft (${j.caseId?.slice(0, 8)}…). Still worth adding: ${missing.join(", ")}.`
          : `Saved as a draft. It lands in the review queue.`,
      );
      setSessionId(null);
      setTranscript([]);
      setInput("");
      setTitle("");
      setProgress("New case");
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="flex items-center justify-between text-caption text-muted-foreground">
        <span>{progress}</span>
        <span>{complete ? "case ready" : "keep going"}</span>
      </div>

      {/* Chat transcript */}
      <div className="space-y-3 rounded-md border-2 border-border bg-card p-4 max-h-[24rem] overflow-y-auto">
        {transcript.length === 0 ? (
          <p className="text-small text-muted-foreground">
            Say or type the first thing about the case — start with who they are.
          </p>
        ) : (
          transcript.map((t, i) => (
            <div key={i} className={t.by === "interviewer" ? "rounded-md border border-border bg-secondary/40 p-3" : "rounded-md border border-border bg-background p-3"}>
              <p className="text-caption font-semibold text-muted-foreground">
                {t.by === "interviewer" ? "Interviewer" : "You"}
              </p>
              <p className="mt-1 text-small">{t.text}</p>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      {!complete ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim()) {
              setTranscript((t) => [...t, { by: "sarthak", text: input.trim(), at: new Date().toISOString() }]);
              void send(input.trim());
              setInput("");
            }
          }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Dictate the next detail… (voice recorder coming)"
            className="flex-1 rounded-md border-2 border-border bg-card px-3 py-2 text-small focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px disabled:opacity-50"
          >
            {busy ? "…" : "Send"}
          </button>
        </form>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="text-small font-medium" htmlFor="dict-title">Draft case title</label>
            <input
              id="dict-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Young man, shopkeeper, chest heaviness and debt"
              className="mt-1 w-full rounded-md border-2 border-border bg-card px-3 py-2 text-small focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button
            type="button"
            onClick={finish}
            disabled={busy}
            className="w-full rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px disabled:opacity-50"
          >
            {busy ? "Saving…" : "Finish & save as draft"}
          </button>
        </div>
      )}

      {error ? <p className="text-small text-muted-foreground" role="status">{error}</p> : null}
    </div>
  );
}