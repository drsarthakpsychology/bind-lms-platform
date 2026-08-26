"use client";

import * as React from "react";
import { Send, BookOpen, Loader2, RotateCcw, Sparkles, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { VoiceAskButton } from "./voice-ask-button";

/** One retrieved source passage behind an answer. */
interface TutorSource {
  id: string;
  text: string;
  citation: string;
  sourceTitle: string;
  chapter: string;
  pageStart: number | null;
  pageEnd: number | null;
}

interface TutorMessage {
  role: "user" | "assistant";
  content: string;
  sources?: TutorSource[];
  aiUsed?: boolean;
  error?: boolean;
}

const SUGGESTIONS = [
  "What is the difference between schizophrenia and bipolar disorder?",
  "How do SSRIs treat depression?",
  "What are the extrapyramidal side effects of antipsychotics?",
  "How is alcohol withdrawal syndrome managed?",
];

/** A retrieved passage, line-clamped with a "show more" expand for long quotes. */
function SourcePassage({ text }: { text: string }) {
  const [expanded, setExpanded] = React.useState(false);
  const long = text.length > 200;
  return (
    <>
      <p
        className={cn(
          "mt-1 text-xs leading-relaxed text-muted-foreground",
          long && !expanded && "line-clamp-4",
        )}
      >
        {text}
      </p>
      {long && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="mt-1 text-caption font-medium text-link hover:underline"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </>
  );
}

/**
 * Psychology Tutor — asks the grounded knowledge layer (/api/knowledge/ask).
 * Answers are retrieval-first: real book passages with source citations always
 * come back; an AI synthesis is added only when a no-train provider is on.
 */
export function TutorChat() {
  const [messages, setMessages] = React.useState<TutorMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [speaking, setSpeaking] = React.useState(false);
  const [speakError, setSpeakError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const voiceAskedRef = React.useRef(false);
  // Streaming accumulators (refs so the React immutability rule is happy while
  // the SSE reader loop mutates them across setMessages closures).
  const streamSourcesRef = React.useRef<TutorSource[]>([]);
  const streamAiUsedRef = React.useRef(false);
  const streamContentRef = React.useRef("");

  // Keep the newest message in view as the conversation grows (and while the
  // assistant is "typing") so the latest answer isn't scrolled out of frame.
  React.useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  /** Read the latest assistant answer aloud (browser speechSynthesis — $0). */
  function speakAnswer(text: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSpeakError("Text-to-speech isn't supported in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/\[[^\]]*\]/g, "").slice(0, 1200));
    u.lang = "en-IN";
    u.rate = 1;
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    u.onerror = () => { setSpeaking(false); setSpeakError("Couldn't read the answer aloud."); };
    setSpeakError(null);
    window.speechSynthesis.speak(u);
  }

  function stopSpeaking() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  }

  async function ask(question: string, fromVoice = false) {
    const q = question.trim();
    if (!q || loading) return;
    if (fromVoice) voiceAskedRef.current = true;
    setMessages((m) => [...m, { role: "user", content: q }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/knowledge/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q, limit: 6 }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(j?.error ?? "request failed");
      }
      const contentType = res.headers.get("content-type") ?? "";

      if (contentType.includes("text/event-stream")) {
        // Streaming (Part 6): sources arrive in a meta event, then answer
        // tokens stream into the last assistant message as they arrive.
        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        streamSourcesRef.current = [];
        streamAiUsedRef.current = false;
        streamContentRef.current = "";
        setMessages((m) => [...m, { role: "assistant", content: "", sources: [], aiUsed: false }]);
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const events = buffer.split("\n\n");
          buffer = events.pop() ?? "";
          for (const ev of events) {
            const line = ev.trim();
            if (!line.startsWith("data:")) continue;
            let j: { type?: string; sources?: TutorSource[]; aiUsed?: boolean; text?: string; answer?: string | null; provider?: string | null };
            try {
              j = JSON.parse(line.slice(5).trim());
            } catch {
              continue;
            }
            if (j.type === "meta") {
              streamSourcesRef.current = j.sources ?? [];
              streamAiUsedRef.current = j.aiUsed ?? false;
            } else if (j.type === "delta") {
              const text = j.text ?? "";
              streamContentRef.current += text;
              setMessages((m) => {
                const last = m[m.length - 1];
                if (last?.role !== "assistant") return m;
                return [...m.slice(0, -1), { ...last, content: last.content + text }];
              });
            } else if (j.type === "done") {
              // Finalize sources/aiUsed (answer may be null on provider failure).
              setMessages((m) => {
                const last = m[m.length - 1];
                if (last?.role !== "assistant") return m;
                const content =
                  j.answer ||
                  streamContentRef.current ||
                  (streamSourcesRef.current.length
                    ? "Here's what the authorised books say — the sources below are the material itself. Ask me another way and I'll retrieve again."
                    : "I couldn't find that in the authorised books. Try a different phrasing or one of the suggested questions.");
                return [...m.slice(0, -1), { ...last, content, sources: streamSourcesRef.current, aiUsed: streamAiUsedRef.current && j.provider != null }];
              });
            }
          }
        }
        if (voiceAskedRef.current) {
          voiceAskedRef.current = false;
          speakAnswer(streamContentRef.current);
        }
      } else {
        // Fast path (cached / retrieval-only) — plain JSON.
        const body = (await res.json()) as {
          answer?: string | null;
          sources?: TutorSource[];
          aiUsed?: boolean;
        };
        let content: string;
        if (body.answer) {
          content = body.answer;
        } else if (body.sources?.length) {
          content =
            "Here's what the authorised books say — the sources below are the material itself. Ask me another way and I'll retrieve again.";
        } else {
          content = "I couldn't find that in the authorised books. Try a different phrasing or one of the suggested questions.";
        }
        setMessages((m) => [
          ...m,
          { role: "assistant", content, sources: body.sources ?? [], aiUsed: body.aiUsed ?? false },
        ]);
        if (voiceAskedRef.current) {
          voiceAskedRef.current = false;
          speakAnswer(content);
        }
      }
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Something went wrong. Please try again.", error: true },
      ]);
      voiceAskedRef.current = false;
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  return (
    <div className="flex h-full min-h-[60vh] max-h-[75dvh] flex-col overflow-hidden rounded-lg border-2 border-border bg-card">
      {/* Header */}
      <div className="flex items-center gap-2 border-b-2 border-border px-4 py-3">
        <BookOpen className="size-4 shrink-0 text-link" aria-hidden />
        <p className="shrink-0 text-body-strong">Psychology Tutor</p>
        <span className="ml-auto max-w-[55%] truncate rounded-md border-2 border-border bg-muted px-2 py-0.5 text-caption text-muted-foreground">
          answers grounded in the authorised books
        </span>
      </div>

      {/* Messages */}
      <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4" aria-live="polite">
        {messages.length === 0 && (
          <div className="py-6">
            <p className="text-body-strong">Ask anything about psychology and psychiatry.</p>
            <p className="mt-1 text-muted-foreground">
              Answers are grounded in the ten authorised books (Kaplan &amp; Sadock, DSM-5-TR, Stahl, Maudsley,
              Fish, Ahuja, ICD-11, …) with source citations.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => ask(s)}
                  disabled={loading}
                  className="min-h-11 rounded-md border-2 border-border px-3 py-1.5 text-left text-sm hover:border-link hover:text-link disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[85%] rounded-lg border-2 px-3 py-2 text-sm",
                m.role === "user" ? "border-border bg-muted" : "border-border bg-background",
                m.error && "border-destructive",
              )}
            >
              {m.role === "assistant" && m.aiUsed && (
                <p className="mb-1 flex items-center gap-1 text-caption text-link">
                  <Sparkles className="size-3" aria-hidden /> grounded answer
                </p>
              )}
              <p className="whitespace-pre-wrap">{m.content}</p>
              {m.error && (
                <button
                  type="button"
                  onClick={() => {
                    const prevUser = [...messages].slice(0, i).reverse().find((x) => x.role === "user");
                    if (prevUser) ask(prevUser.content);
                  }}
                  disabled={loading}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-md border-2 border-border px-3 py-1.5 text-caption font-medium transition-colors hover:bg-accent disabled:opacity-50"
                >
                  <RotateCcw className="size-3.5" aria-hidden />
                  Try again
                </button>
              )}
              {m.role === "assistant" && !m.error && (
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => (speaking ? stopSpeaking() : speakAnswer(m.content))}
                    className="inline-flex items-center gap-1 text-caption text-link hover:underline"
                    aria-label={speaking ? "Stop reading" : "Read this answer aloud"}
                  >
                    {speaking ? <VolumeX className="size-3" aria-hidden /> : <Volume2 className="size-3" aria-hidden />}
                    {speaking ? "Stop" : "Read aloud"}
                  </button>
                </div>
              )}

              {m.sources && m.sources.length > 0 && (
                <div className="mt-3 space-y-2 border-t border-border pt-2">
                  <p className="text-caption font-semibold uppercase text-muted-foreground">Sources</p>
                  {m.sources.slice(0, 4).map((s) => (
                    <details key={s.id} className="rounded-md border-2 border-border bg-muted px-2 py-1.5">
                      <summary className="cursor-pointer text-caption font-medium text-link">{s.citation}</summary>
                      <SourcePassage text={s.text} />
                    </details>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Retrieving from the books…
          </div>
        )}
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="flex items-center gap-2 border-t-2 border-border px-4 py-3"
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about any psychology topic… (or press the mic)"
          aria-label="Ask the Psychology Tutor"
          enterKeyHint="send"
          className="min-h-11 min-w-0 flex-1 rounded-md border-2 border-border bg-background px-3 py-2 text-base outline-none focus:border-link"
        />
        <VoiceAskButton
          onTranscribed={(text) => {
            setInput(text);
            ask(text, true);
          }}
          disabled={loading}
        />
        <Button
          type="submit"
          size="lg"
          disabled={loading || !input.trim()}
          aria-label="Ask"
          className="min-h-11"
        >
          <Send className="size-4" aria-hidden />
        </Button>
      </form>
      {speakError && <p className="px-4 pb-2 text-caption text-destructive">{speakError}</p>}
    </div>
  );
}
