"use client";

import * as React from "react";
import { CheckCircle2, AlertTriangle, RefreshCw, Mic2 } from "lucide-react";
import { haptic } from "@/lib/haptics";
import type { VoiceMetrics } from "@/lib/voice/use-voice-metrics";

interface DebriefData {
  score?: {
    score?: number;
    open_closed_ratio?: number;
    premature_reassurance?: number;
    reflective_statements?: number;
    risk_timing?: string;
    domain_coverage?: number;
    disclosure_unlock_rate?: number;
    quotes?: Array<{ quote: string; better: string }>;
    missed_disclosures?: string[];
  };
  quotes?: Array<{ quote: string; better: string }>;
  missed_disclosures?: string[];
}

/**
 * The debrief — the actual product of the Consulting Room.
 * Shows the score, then quotes with better alternatives, then the
 * missed-disclosures reveal ("the patient would have told you…").
 */
export function DebriefView({
  data,
  difficulty,
  onExit,
  voice,
}: {
  data: DebriefData;
  difficulty: string;
  onExit: () => void;
  voice?: VoiceMetrics;
}) {
  const [revealMissed, setRevealMissed] = React.useState(false);
  const score = data.score ?? {};
  const quotes = data.quotes ?? score.quotes ?? [];
  const missed = data.missed_disclosures ?? score.missed_disclosures ?? [];
  const overall = score.score ?? 0;

  const premature = score.premature_reassurance ?? 0;

  return (
    <div className="space-y-6">
      {/* Score header */}
      <div className="rounded-md border-2 border-border bg-card p-6 hard-shadow-sm">
        <p className="text-eyebrow text-muted-foreground">Debrief · {difficulty} patient</p>
        <div className="mt-2 flex items-center gap-4">
          <span className="text-h1 text-numeric">{overall.toFixed(1)}</span>
          <span className="text-small text-muted-foreground">/ 5.0 overall</span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Open:closed" value={String(score.open_closed_ratio ?? "—")} />
          <Stat label="Reflective" value={String(score.reflective_statements ?? "—")} />
          <Stat label="Premature reassurance" value={String(premature)} warn={premature > 0} />
          <Stat label="Risk timing" value={score.risk_timing ?? "—"} />
        </div>
        {premature > 0 ? (
          <p className="mt-3 flex items-center gap-2 text-small text-amber-700">
            <AlertTriangle className="size-4" aria-hidden />
            You reassured the patient {premature} time{premature > 1 ? "s" : ""} before fully exploring
            the problem. That&apos;s the most common novice move — sitting with their distress is
            the skill.
          </p>
        ) : null}
      </div>

      {/* Voice delivery panel */}
      {voice ? (
        <div className="rounded-md border-2 border-border bg-card p-6 hard-shadow-sm">
          <h2 className="flex items-center gap-2 text-base font-semibold">
            <Mic2 className="size-4" aria-hidden />
            Delivery
          </h2>
          <p className="mt-1 text-small text-muted-foreground">
            Compared against your own past sessions, not other students.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Stat
              label="Silence tolerance"
              value={`${voice.mean_silence_tolerance_s}s`}
              hint={voice.mean_silence_tolerance_s < 3 ? "Try sitting with silence longer." : "Good — you let them speak."}
            />
            <Stat
              label="Interruptions"
              value={String(voice.interruption_count)}
              warn={voice.interruption_count > 0}
              hint={voice.interruption_count > 0 ? "Let the patient finish their sentence." : "No interruptions."}
            />
            <Stat
              label="Questions / min"
              value={String(voice.questions_per_minute)}
              hint={voice.questions_per_minute > 8 ? "You're machine-gunning. Slow down." : undefined}
            />
            <Stat
              label="Filler words"
              value={String(voice.filler_word_rate)}
              hint={voice.filler_word_rate > 0.2 ? "Fewer 'um's and 'like's sharpen your question." : undefined}
            />
            <Stat
              label="Longest patient stretch"
              value={`${voice.longest_patient_stretch_s}s`}
              hint={voice.longest_patient_stretch_s < 5 ? "You're cutting the patient off." : "You let them talk."}
            />
            <Stat label="Session length" value={`${voice.session_duration_s}s`} />
          </div>
        </div>
      ) : null}

      {/* Quotes */}
      <div className="rounded-md border-2 border-border bg-card p-6 hard-shadow-sm">
        <h2 className="text-base font-semibold">Three moments, done better</h2>
        <p className="mt-1 text-small text-muted-foreground">
          Each is a verbatim line from your transcript with a better alternative.
        </p>
        <ul className="mt-4 space-y-4">
          {quotes.map((q, i) => (
            <li key={i} className="rounded-md border border-border bg-background p-3">
              <p className="text-small">
                <span className="font-semibold text-muted-foreground">You said: </span>
                <span className="italic">{q.quote}</span>
              </p>
              <p className="mt-1 text-small">
                <span className="font-semibold text-primary">Better: </span>
                {q.better}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Missed disclosures reveal */}
      <div className="rounded-md border-2 border-border bg-card p-6 hard-shadow-sm">
        <h2 className="flex items-center gap-2 text-base font-semibold">
          <AlertTriangle className="size-4 text-amber-600" aria-hidden />
          What you didn&apos;t unlock
        </h2>
        {!revealMissed ? (
          <>
            <p className="mt-2 text-small text-muted-foreground">
              The patient was carrying things they would only have shared if you&apos;d asked
              differently. Ready to see them?
            </p>
            <button
              type="button"
              onClick={() => {
                setRevealMissed(true);
                haptic("tap");
              }}
              className="mt-3 rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none"
            >
              Reveal the missed disclosures
            </button>
          </>
        ) : (
          <ul className="mt-3 space-y-2">
            {missed.length === 0 ? (
              <li className="text-small text-muted-foreground">
                Nothing missed — you unlocked everything this patient was ready to share.
              </li>
            ) : (
              missed.map((m, i) => (
                <li key={i} className="flex gap-2 rounded-md border border-border bg-background p-3 text-small">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                  <span className="italic">{m}</span>
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onExit}
          className="inline-flex items-center gap-2 rounded-md border-2 border-border bg-card px-4 py-2 text-small font-medium text-muted-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none"
        >
          <RefreshCw className="size-4" aria-hidden />
          Back to cases
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value, warn, hint }: { label: string; value: string; warn?: boolean; hint?: string }) {
  return (
    <div className={`rounded-md border-2 border-border p-3 ${warn ? "bg-amber-50" : "bg-background"}`}>
      <p className="text-caption text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-base font-semibold text-numeric">{value}</p>
      {hint ? <p className="mt-1 text-caption text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
