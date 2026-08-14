"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Lightbulb, NotebookPen, Flag } from "lucide-react";
import { haptic } from "@/lib/haptics";
import { VoiceInput } from "@/components/practice/voice-input";
import { useVoiceMetrics } from "@/lib/voice/use-voice-metrics";
import { affectToVoice, type Affect } from "@/lib/voice/affect-to-voice";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SimulationHeader } from "@/components/sim/simulation-header";
import { ChatComposer } from "@/components/sim/chat-composer";
import { ChatList } from "@/components/sim/chat-list";
import { NotesSheet } from "@/components/sim/notes-sheet";
import { HintSheet } from "@/components/sim/hint-sheet";
import { DebriefView } from "./debrief-view";

interface Turn {
  id: string;
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
    asked_why_today?: boolean;
    quotes?: Array<{ quote: string; better: string }>;
    missed_disclosures?: string[];
  };
  quotes?: Array<{ quote: string; better: string }>;
  missed_disclosures?: string[];
  hintUsed?: boolean;
}

const DIFFICULTY_HINT: Record<string, string> = {
  cooperative: "This patient is willing to talk. Open questions go far.",
  guarded: "This patient is wary. Validation matters more than questions.",
  resistant: "This patient does not want to be here. Roll with the resistance.",
  crisis: "This patient is in crisis. Risk assessment comes first.",
};

/**
 * The live simulated-patient chat — rebuilt as a full-screen conversation
 * (not a 70vh card). Header (back + name + status pill + timer + more) →
 * transcript (bubbles, no name labels) → composer (voice toggle + input +
 * send). Notes and hint live in bottom sheets; "finish & debrief" is in the
 * "more" menu. The old giant amber fixture banner is a quiet status pill.
 */
export function SimSessionView({
  sessionId,
  patientName,
  patientAge,
  difficulty,
  fixtureMode = false,
  initialTurns,
  voicePrefs,
  branchInfo,
  provisionalDims,
}: {
  sessionId: string;
  patientName: string;
  patientAge?: number;
  patientContext?: string;
  difficulty: string;
  fixtureMode?: boolean;
  initialTurns: Turn[];
  voicePrefs?: { rate: number; pitch: number; lang?: string; gender?: "male" | "female" };
  branchInfo?: {
    parentSessionId: string;
    branchedFromTurn: number;
    parentTurns: Turn[];
    parentScore?: { overall: number; quotes: Array<{ quote: string; better: string }> };
  };
  provisionalDims?: string[];
}) {
  const router = useRouter();
  const [turns, setTurns] = React.useState<Turn[]>(initialTurns.map((t, i) => ({ ...t, id: `init-${i}-${Date.now()}` })));
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [seconds, setSeconds] = React.useState(0);
  const [debrief, setDebrief] = React.useState<DebriefData | null>(null);
  const [ending, setEnding] = React.useState(false);
  const [voiceMode, setVoiceMode] = React.useState(false);
  const [patientAffect, setPatientAffect] = React.useState<Affect | null>(null);
  const [patientFatigue, setPatientFatigue] = React.useState(0);
  const [mseNotes, setMseNotes] = React.useState("");
  const [hypotheses, setHypotheses] = React.useState("");
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [notesOpen, setNotesOpen] = React.useState(false);
  const [hintOpen, setHintOpen] = React.useState(false);
  const hintUsedRef = React.useRef(false);
  const [typing, setTyping] = React.useState(false);
  const pendingReply = React.useRef<string | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const voiceMetrics = useVoiceMetrics();

  const SESSION_LIMIT_S = 12 * 60;
  const typingTimer = React.useRef<ReturnType<typeof setInterval> | null>(null);

  React.useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  React.useEffect(() => {
    const el = scrollRef.current;
    el?.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [turns.length, debrief, typing]);

  React.useEffect(() => () => { if (typingTimer.current) clearInterval(typingTimer.current); }, []);

  const didAutoFinish = React.useRef(false);
  React.useEffect(() => {
    if (seconds >= SESSION_LIMIT_S && !didAutoFinish.current && !debrief) {
      didAutoFinish.current = true;
      void finishAndDebrief();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds]);

  async function send(textParam?: string) {
    const text = (textParam ?? input).trim();
    if (!text || busy || pendingReply.current) return;
    const studentTurnId = crypto.randomUUID();
    setInput("");
    setTurns((t) => [...t, { id: studentTurnId, role: "student", content: text }]);
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
        setTurns((t) => t.filter((x) => x.id !== studentTurnId));
        setInput(text);
        return;
      }
      const j = (await res.json()) as {
        reply: string;
        delivery?: Array<{ kind: string; position: number; seconds: number }>;
        affect?: Affect;
        fatigue?: number;
        mood?: string;
      };
      if (j.affect) {
        setPatientAffect(j.affect);
        setPatientFatigue(Number(j.fatigue ?? 0));
      }
      setTyping(true);
      const full = j.reply;
      const patientTurnId = crypto.randomUUID();
      setTurns((t) => [...t, { id: patientTurnId, role: "patient", content: "" }]);
      pendingReply.current = patientTurnId;
      const charsPerTick = 4;
      const schedule: Array<{ until: number; holdMs: number }> = [];
      let cursor = 0;
      const cues = (j.delivery ?? []).slice().sort((a, b) => a.position - b.position);
      for (const cue of cues) {
        if (cue.position > cursor) schedule.push({ until: cue.position, holdMs: 40 });
        schedule.push({ until: cue.position, holdMs: Math.round(cue.seconds * 1000) });
        cursor = cue.position;
      }
      if (cursor < full.length) schedule.push({ until: full.length, holdMs: 40 });
      let seg = 0;
      let shown = 0;
      let holdUntil = 0;
      typingTimer.current = setInterval(() => {
        if (seg >= schedule.length) {
          if (typingTimer.current) clearInterval(typingTimer.current);
          typingTimer.current = null;
          pendingReply.current = null;
          setTyping(false);
          return;
        }
        const spec = schedule[seg];
        if (spec.holdMs > 40) {
          if (holdUntil === 0) holdUntil = Date.now() + spec.holdMs;
          if (Date.now() < holdUntil) return;
          shown = spec.until;
          holdUntil = 0;
          seg += 1;
        } else {
          shown = Math.min(spec.until, shown + charsPerTick);
          if (shown >= spec.until) seg += 1;
        }
        setTurns((t) =>
          t.map((x) => (x.id === patientTurnId ? { ...x, content: full.slice(0, shown) } : x)),
        );
      }, 40);
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
    setMenuOpen(false);
    haptic("warning");
    try {
      const res = await fetch("/api/practice/sim/debrief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, hintUsed: hintUsedRef.current }),
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
        hintUsed={debrief.hintUsed ?? false}
      />
    );
  }

  return (
    <div className="flex h-dvh flex-col bg-background">
      <SimulationHeader
        patientName={patientName}
        patientAge={patientAge}
        difficulty={difficulty}
        fixtureMode={fixtureMode}
        seconds={seconds}
        onMore={() => setMenuOpen(true)}
      />

      {/* Transcript — owns the viewport. */}
      <ChatList turns={turns} patientName={patientName} typing={typing} scrollRef={scrollRef} />

      {/* Error — a single quiet line, not a panel. */}
      {error ? (
        <p className="border-t border-border bg-card px-4 py-2 text-small text-status-alert-fg" role="alert">
          {error}
        </p>
      ) : null}

      {/* Composer or voice. */}
      {voiceMode ? (
        <div className="border-t border-border bg-card px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2.5">
          <VoiceInput
            onSend={(t) => {
              voiceMetrics.recordStudentSpeech(t);
              void send(t);
            }}
            onPatientSpeak={() => {
              const lastPatient = [...turns].reverse().find((t) => t.role === "patient");
              return lastPatient?.content ?? "";
            }}
            patientVoicePrefs={
              patientAffect
                ? {
                    rate: affectToVoice(patientAffect, { fatigue: patientFatigue, baseRate: voicePrefs?.rate ?? 1, basePitch: voicePrefs?.pitch ?? 1 }).rate,
                    pitch: affectToVoice(patientAffect, { fatigue: patientFatigue, baseRate: voicePrefs?.rate ?? 1, basePitch: voicePrefs?.pitch ?? 1 }).pitch,
                    lang: voicePrefs?.lang ?? "en-IN",
                    gender: voicePrefs?.gender,
                  }
                : (voicePrefs ?? { rate: 1, pitch: 1, lang: "en-IN" })
            }
            disabled={busy}
          />
        </div>
      ) : (
        <ChatComposer
          value={input}
          onChange={setInput}
          onSend={() => void send()}
          voiceMode={voiceMode}
          onToggleVoice={() => setVoiceMode((v) => !v)}
          busy={busy}
          voiceAvailable
          patientName={patientName}
        />
      )}

      {/* "More" menu — hint reveal, notes, finish. Secondary actions live here. */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="bottom" className="pb-[max(1rem,env(safe-area-inset-bottom))]">
          <SheetHeader>
            <SheetTitle>Session</SheetTitle>
          </SheetHeader>

          <div className="space-y-2">
            {/* Hint — opt-in, flagged for the debrief. */}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setHintOpen(true);
                hintUsedRef.current = true;
                haptic("tap");
              }}
              className="flex w-full items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-left text-small font-medium text-foreground active:translate-y-px"
            >
              <Lightbulb className="size-5 shrink-0 text-link" aria-hidden />
              <span className="flex-1">Need a hint?</span>
            </button>

            {/* Notes — opens the MSE/hypotheses sheet. */}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setNotesOpen(true);
                haptic("tap");
              }}
              className="flex w-full items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-left text-small font-medium text-foreground active:translate-y-px"
            >
              <NotebookPen className="size-5 shrink-0 text-link" aria-hidden />
              <span className="flex-1">Notes</span>
            </button>

            {/* Finish & debrief. */}
            <button
              type="button"
              onClick={() => void finishAndDebrief()}
              disabled={ending || turns.length < 2}
              className="flex w-full items-center gap-3 rounded-lg border-2 border-border bg-primary px-4 py-3 text-left text-small font-semibold text-primary-foreground active:translate-y-px disabled:opacity-40"
            >
              <Flag className="size-5 shrink-0" aria-hidden />
              <span className="flex-1">{ending ? "Scoring…" : "Finish & debrief"}</span>
            </button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Notes sheet — MSE scratchpad + hypotheses (a bottom sheet, not a sidebar). */}
      <NotesSheet
        open={notesOpen}
        onOpenChange={setNotesOpen}
        mseNotes={mseNotes}
        onMseNotesChange={setMseNotes}
        hypotheses={hypotheses}
        onHypothesesChange={setHypotheses}
      />

      {/* Hint — opt-in, flagged for the debrief. */}
      <HintSheet
        open={hintOpen}
        onOpenChange={setHintOpen}
        hint={DIFFICULTY_HINT[difficulty] ?? "Interview the patient."}
      />
    </div>
  );
}
