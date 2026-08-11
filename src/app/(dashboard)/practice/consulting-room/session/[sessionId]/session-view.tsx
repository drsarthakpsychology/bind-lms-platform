"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Mic } from "lucide-react";
import { haptic } from "@/lib/haptics";
import { VoiceInput } from "@/components/practice/voice-input";
import { useVoiceMetrics } from "@/lib/voice/use-voice-metrics";
import { affectToVoice, type Affect } from "@/lib/voice/affect-to-voice";
import { DebriefView } from "./debrief-view";

interface Turn {
  role: "student" | "patient";
  content: string;
}

interface DebriefData {
  score?: {
    score?: number;
    open_closed_ratio?: number;
    premature_reassurance?: number;
    reflective_statements?: number;
    risk_timing?: string;
    quotes?: Array<{ quote: string; better: string }>;
    missed_disclosures?: string[];
  };
  quotes?: Array<{ quote: string; better: string }>;
  missed_disclosures?: string[];
}

const DIFFICULTY_HINT: Record<string, string> = {
  cooperative: "This patient is willing to talk. Open questions go far.",
  guarded: "This patient is wary. Validation matters more than questions.",
  resistant: "This patient does not want to be here. Roll with the resistance.",
  crisis: "This patient is in crisis. Risk assessment comes first.",
};

/**
 * The live simulated-patient chat. Student types, patient responds via the
 * AI route (or fixture when AI_ENABLED=false). Includes the SIMULATION badge,
 * a timer, the difficulty hint, and a "finish & debrief" action.
 */
export function SimSessionView({
  sessionId,
  patientName,
  difficulty,
  initialTurns,
  voicePrefs,
  branchInfo,
  provisionalDims,
}: {
  sessionId: string;
  patientName: string;
  difficulty: string;
  initialTurns: Turn[];
  voicePrefs?: { rate: number; pitch: number; lang?: string; gender?: "male" | "female" };
  /** A1 retry: this session is a branch — parent turns + score for the
   *  attempt-1 vs attempt-2 comparison strip in the debrief. */
  branchInfo?: {
    parentSessionId: string;
    branchedFromTurn: number;
    parentTurns: Turn[];
    parentScore?: { overall: number; quotes: Array<{ quote: string; better: string }> };
  };
  /** A3: rubric dimensions still provisional — their numeric scores are hidden
   *  from students (qualitative feedback only). */
  provisionalDims?: string[];
}) {
  const router = useRouter();
  const [turns, setTurns] = React.useState<Turn[]>(initialTurns);
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [seconds, setSeconds] = React.useState(0);
  const [debrief, setDebrief] = React.useState<DebriefData | null>(null);
  const [ending, setEnding] = React.useState(false);
  const [voiceMode, setVoiceMode] = React.useState(false);
  // v5 §6 — the Director's affect + fatigue drive delivery line by line.
  const [patientAffect, setPatientAffect] = React.useState<Affect | null>(null);
  const [patientFatigue, setPatientFatigue] = React.useState(0);
  // Side rail — blank MSE scratchpad + hypotheses (never autofilled: what the
  // student wrote is half the assessment).
  const [mseNotes, setMseNotes] = React.useState("");
  const [hypotheses, setHypotheses] = React.useState("");
  const [sideRailOpen, setSideRailOpen] = React.useState(false);
  const [typing, setTyping] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const voiceMetrics = useVoiceMetrics();

  const SESSION_LIMIT_S = 12 * 60; // 12-minute timer (v3 Part 6.1)
  const typingTimer = React.useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer; auto-finish at 12 minutes.
  React.useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Autoscroll to bottom on new turns.
  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [turns.length, debrief]);

  // Clear the typing interval on unmount.
  React.useEffect(() => () => { if (typingTimer.current) clearInterval(typingTimer.current); }, []);

  // Auto-finish at the 12-minute mark.
  const didAutoFinish = React.useRef(false);
  React.useEffect(() => {
    if (seconds >= SESSION_LIMIT_S && !didAutoFinish.current && !debrief) {
      didAutoFinish.current = true;
      void finishAndDebrief();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const overTime = seconds >= SESSION_LIMIT_S;

  async function send(textParam?: string) {
    const text = (textParam ?? input).trim();
    if (!text || busy) return;
    setInput("");
    setTurns((t) => [...t, { role: "student", content: text }]);
    setBusy(true);
    setError(null);
    haptic("tap");
    try {
      const res = await fetch("/api/practice/sim/turn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: text }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        if (res.status === 429) {
          setError("You're moving fast — give the patient a moment to respond.");
        } else {
          setError(j?.error ?? "The patient didn't respond. Please try again.");
        }
        // revert the student turn so it isn't double-sent
        setTurns((t) => t.slice(0, -1));
        setInput(text);
        return;
      }
      const j = (await res.json()) as { reply: string; affect?: Affect; fatigue?: number; mood?: string };
      // v5 §6 — the Director's affect drives this line's delivery.
      if (j.affect) {
        setPatientAffect(j.affect);
        setPatientFatigue(Number(j.fatigue ?? 0));
      }
      // Human-realistic typing delay: reveal the reply progressively so it
      // doesn't appear instantly and shatter the illusion (v3 Part 6.1).
      setTyping(true);
      const full = j.reply;
      const charsPerTick = 4;
      const ticks = Math.max(6, Math.ceil(full.length / charsPerTick));
      let shown = 0;
      typingTimer.current = setInterval(() => {
        shown += charsPerTick;
        const slice = full.slice(0, shown);
        // Keep the patient turn at index len-1 but reveal progressively by
        // replacing the last turn.
        setTurns((t) => {
          const next = t.slice();
          if (next[next.length - 1]?.role === "patient") {
            next[next.length - 1] = { role: "patient", content: slice };
          } else {
            next.push({ role: "patient", content: slice });
          }
          return next;
        });
        if (shown >= full.length) {
          if (typingTimer.current) clearInterval(typingTimer.current);
          setTyping(false);
        }
      }, Math.max(40, Math.min(90, Math.round(1200 / ticks))));
      haptic("tap");
    } catch {
      setError("Network error. Your message may not have reached the patient.");
    } finally {
      setBusy(false);
      textareaRef.current?.focus();
    }
  }

  const [voiceReport, setVoiceReport] = React.useState<ReturnType<typeof voiceMetrics.report> | null>(null);

  async function finishAndDebrief() {
    if (ending) return;
    setEnding(true);
    setError(null);
    haptic("warning");
    try {
      const res = await fetch("/api/practice/sim/debrief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        if (res.status === 503) {
          setError("Debrief needs a no-train AI provider. Add a key in the morning, or ask faculty to run it.");
        } else {
          setError(j?.error ?? "Could not run the debrief.");
        }
        setEnding(false);
        return;
      }
      const j = (await res.json()) as DebriefData;
      setDebrief(j);
      setVoiceReport(voiceMetrics.report());
      haptic("success");
    } catch {
      setError("Network error during debrief.");
      setEnding(false);
    }
  }

  // If debrief is ready, show it.
  if (debrief) {
    return (
      <DebriefView
        data={debrief}
        difficulty={difficulty}
        voice={voiceReport ?? undefined}
        onExit={() => router.push("/practice/consulting-room")}
        sessionId={sessionId}
        totalTurns={turns.length}
        branchInfo={branchInfo}
        provisionalDims={provisionalDims}
      />
    );
  }

  return (
    <div className="flex h-[70vh] flex-col rounded-md border-2 border-border bg-card hard-shadow-sm">
      {/* header */}
      <div className="flex items-center justify-between border-b-2 border-border px-4 py-2">
        <span className="text-small font-medium text-muted-foreground">
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} patient
        </span>
        <div className="flex items-center gap-3">
          {/* timer */}
          <span
            className={`text-numeric text-small ${overTime ? "font-bold text-red-600" : seconds >= SESSION_LIMIT_S - 60 ? "text-amber-600" : ""}`}
            aria-live="polite"
          >
            {mm}:{ss}
          </span>
          {/* side-rail toggle */}
          <button
            type="button"
            onClick={() => { setSideRailOpen((o) => !o); haptic("tap"); }}
            aria-pressed={sideRailOpen}
            className="rounded-md border-2 border-border px-2 py-1 text-caption font-medium text-muted-foreground transition-transform active:translate-y-px"
          >
            {sideRailOpen ? "Hide notes" : "Notes"}
          </button>
        </div>
      </div>

      {/* hint */}
      <div className="border-b border-border bg-secondary/50 px-4 py-2 text-caption text-muted-foreground">
        {overTime ? (
          <span className="font-semibold text-red-600">Time&apos;s up — finishing your debrief.</span>
        ) : seconds >= SESSION_LIMIT_S - 60 ? (
          <span className="text-amber-600">One minute left.</span>
        ) : (
          DIFFICULTY_HINT[difficulty] ?? "Interview the patient."
        )}
      </div>

      <div className="flex min-h-0 flex-1">
        {/* transcript column */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {turns.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-base font-medium">
              {patientName} is waiting.
            </p>
            <p className="mt-1 text-small text-muted-foreground">
              Introduce yourself and ask how they&apos;re doing. Silence is okay — they&apos;ll wait.
            </p>
          </div>
        ) : null}
        {turns.map((t, i) => (
          <div
            key={i}
            className={`flex ${t.role === "student" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-md border-2 border-border px-3 py-2 text-small ${
                t.role === "student"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground"
              }`}
            >
              {t.content}
            </div>
          </div>
        ))}
        {busy ? (
          <div className="flex justify-start">
            <div className="rounded-md border-2 border-border bg-secondary px-3 py-2 text-small text-muted-foreground">
              {patientName} is thinking…
            </div>
          </div>
        ) : null}
        {typing ? (
          <div className="flex justify-start">
            <div className="rounded-md border-2 border-border bg-secondary px-3 py-2 text-small italic text-muted-foreground">
              {patientName} is answering…
            </div>
          </div>
        ) : null}
          </div>
        </div>

        {/* side rail — blank MSE scratchpad + hypotheses (never autofilled) */}
        {sideRailOpen ? (
          <aside className="w-72 shrink-0 space-y-3 overflow-y-auto border-l-2 border-border bg-background/60 p-3">
            <div>
              <p className="text-eyebrow text-muted-foreground">MSE scratchpad</p>
              <textarea
                value={mseNotes}
                onChange={(e) => setMseNotes(e.target.value)}
                rows={7}
                placeholder="Appearance, speech, mood, affect, thought…"
                aria-label="MSE scratchpad"
                className="mt-1 w-full resize-none rounded-md border-2 border-border bg-card px-2 py-2 text-caption focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <p className="text-eyebrow text-muted-foreground">Hypotheses</p>
              <textarea
                value={hypotheses}
                onChange={(e) => setHypotheses(e.target.value)}
                rows={5}
                placeholder="What do you think is going on?"
                aria-label="Hypotheses"
                className="mt-1 w-full resize-none rounded-md border-2 border-border bg-card px-2 py-2 text-caption focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <p className="text-caption text-muted-foreground">
              This is your working record — the debrief doesn&apos;t read it. What you wrote is half the assessment.
            </p>
          </aside>
        ) : null}
      </div>

      {/* error */}
      {error ? (
        <div className="border-t border-border bg-red-50 px-4 py-2 text-small text-red-700" role="alert">
          {error}
        </div>
      ) : null}

      {/* input */}
      <div className="border-t-2 border-border p-3">
        {/* voice/text toggle */}
        <div className="mb-2 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setVoiceMode((v) => !v)}
            aria-pressed={voiceMode}
            className={`inline-flex items-center gap-1.5 rounded-md border-2 border-border px-3 py-1.5 text-caption font-medium transition-transform active:translate-y-px ${
              voiceMode ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground"
            }`}
          >
            <Mic className="size-3.5" aria-hidden />
            {voiceMode ? "Voice on" : "Voice"}
          </button>
          <span className="text-caption text-muted-foreground">
            {voiceMode
              ? "Hold the mic to talk, release to send. Edit the transcript before sending."
              : "Type your question. Enter to send."}
          </span>
        </div>

        {voiceMode && voicePrefs ? (
          <VoiceInput
            onSend={(t) => {
              voiceMetrics.recordStudentSpeech(t);
              void send(t);
            }}
            onPatientSpeak={() => {
              // The last patient line, spoken via the case's affect-driven prefs.
              // The actual TTS lives inside VoiceInput's hook; this callback
              // lets the parent supply the text to speak.
              const lastPatient = [...turns].reverse().find((t) => t.role === "patient");
              return lastPatient?.content ?? "";
            }}
            patientVoicePrefs={
              patientAffect
                ? {
                    rate: affectToVoice(patientAffect, {
                      fatigue: patientFatigue,
                      baseRate: voicePrefs?.rate ?? 1,
                      basePitch: voicePrefs?.pitch ?? 1,
                    }).rate,
                    pitch: affectToVoice(patientAffect, {
                      fatigue: patientFatigue,
                      baseRate: voicePrefs?.rate ?? 1,
                      basePitch: voicePrefs?.pitch ?? 1,
                    }).pitch,
                    lang: voicePrefs?.lang ?? "en-IN",
                    gender: voicePrefs?.gender,
                  }
                : voicePrefs
            }
            disabled={busy}
          />
        ) : (
          <div className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
              placeholder={`Say something to ${patientName}…`}
              rows={2}
              className="flex-1 resize-none rounded-md border-2 border-border bg-background px-3 py-2 text-small focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Your message to the patient"
            />
            <button
              type="button"
              onClick={() => void send()}
              disabled={busy || !input.trim()}
              className="rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none disabled:opacity-50"
            >
              Send
            </button>
          </div>
        )}

        <div className="mt-2 flex items-center justify-between">
          <p className="text-caption text-muted-foreground">
            {voiceMode ? "Voice sends as text — the patient hears via your browser." : "Enter to send · Shift+Enter for a new line"}
          </p>
          <button
            type="button"
            onClick={() => void finishAndDebrief()}
            disabled={ending || turns.length < 2}
            className="rounded-md border-2 border-border px-3 py-1.5 text-caption font-medium text-muted-foreground transition-transform active:translate-y-px disabled:opacity-40"
          >
            {ending ? "Scoring…" : "Finish & debrief"}
          </button>
        </div>
      </div>
    </div>
  );
}
