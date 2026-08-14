"use client";

import * as React from "react";
import { Send, BookOpen, Loader2, Sparkles, Volume2, VolumeX } from "lucide-react";
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
  const voiceAskedRef = React.useRef(false);

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
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "request failed");

      let content: string;
      if (body.answer) {
        content = body.answer;
      } else if (body.sources?.length) {
        content =
          "Here's what the authorised books say — the sources below are the material itself (an AI synthesis needs a no-train provider key, which isn't set yet). Ask me another way and I'll retrieve again.";
      } else {
        content = "I couldn't find source material for that in the authorised corpus. Try a different phrasing or one of the suggested questions.";
      }
      setMessages((m) => [
        ...m,
        { role: "assistant", content, sources: body.sources ?? [], aiUsed: body.aiUsed ?? false },
      ]);
      // In voice mode, read the answer back — a natural back-and-forth.
      if (voiceAskedRef.current) {
        voiceAskedRef.current = false;
        speakAnswer(content);
      }
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Something went wrong on the knowledge layer. Please try again.", error: true },
      ]);
      voiceAskedRef.current = false;
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  return (
    <div className="flex h-full min-h-[60vh] flex-col overflow-hidden rounded-lg border-2 border-border bg-card">
      {/* Header */}
      <div className="flex items-center gap-2 border-b-2 border-border px-4 py-3">
        <BookOpen className="size-4 shrink-0 text-link" aria-hidden />
        <p className="min-w-0 truncate text-body-strong">Psychology Tutor</p>
        <span className="ml-auto hidden shrink-0 rounded-md border-2 border-border bg-muted px-2 py-0.5 text-caption text-muted-foreground sm:inline-flex">
          answers grounded in the authorised books
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4" aria-live="polite">
        {messages.length === 0 && (
          <div className="py-6">
            <p className="text-body-strong">Ask anything about psychology and psychiatry.</p>
            <p className="mt-1 text-muted-foreground">
              Answers are grounded in the ten-book corpus (Kaplan &amp; Sadock, DSM-5-TR, Stahl, Maudsley,
              Fish, Ahuja, ICD-11, …) with source citations.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => ask(s)}
                  disabled={loading}
                  className="rounded-md border-2 border-border px-3 py-1.5 text-left text-sm hover:border-link hover:text-link disabled:opacity-50"
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
              {m.role === "assistant" && (
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
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.text}</p>
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
          className="min-w-0 flex-1 rounded-md border-2 border-border bg-background px-3 py-2 text-sm outline-none focus:border-link"
        />
        <VoiceAskButton
          onTranscribed={(text) => {
            setInput(text);
            ask(text, true);
          }}
          disabled={loading}
        />
        <Button type="submit" size="sm" disabled={loading || !input.trim()} aria-label="Ask">
          <Send className="size-4" aria-hidden />
        </Button>
      </form>
      {speakError && <p className="px-4 pb-2 text-caption text-destructive">{speakError}</p>}
    </div>
  );
}
