"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, CircleCheck, AlertTriangle, RefreshCw, Mic2, RotateCcw } from "lucide-react";
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
    idiom_decoding?: boolean;
    asked_why_today?: boolean;
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
 *
 * A1 Retry: every flagged moment gets a "Try this again" — rewinds to that
 * turn (same case, same seed, same state) so the student can watch the
 * patient respond differently.
 */
interface BranchInfo {
  parentSessionId: string;
  branchedFromTurn: number;
  parentTurns: Array<{ role: "student" | "patient"; content: string }>;
  parentScore?: { overall: number; quotes: Array<{ quote: string; better: string }> };
}

export function DebriefView({
  data,
  difficulty,
  onExit,
  voice,
  sessionId,
  totalTurns,
  branchInfo,
  provisionalDims,
  hintUsed,
}: {
  data: DebriefData;
  difficulty: string;
  onExit: () => void;
  voice?: VoiceMetrics;
  sessionId?: string;
  totalTurns?: number;
  /** A1 retry: the comparison strip data when this session is a rewind branch. */
  branchInfo?: BranchInfo;
  /** A3: rubric dimensions still provisional — hide their numeric score. */
  provisionalDims?: string[];
  /** Bug 4: whether the student opened the hint — surfaced honestly. */
  hintUsed?: boolean;
}) {
  const router = useRouter();
  const [revealMissed, setRevealMissed] = React.useState(false);
  const [retrying, setRetrying] = React.useState(false);
  const [retryError, setRetryError] = React.useState<string | null>(null);
  // Create/update the patient chain once the debrief shows — the session is
  // complete, so /today can offer the next surface for this patient.
  const chainPostedRef = React.useRef(false);
  React.useEffect(() => {
    if (!sessionId || chainPostedRef.current) return;
    chainPostedRef.current = true;
    void fetch("/api/practice/chain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId }),
    }).catch(() => {}); // silent; a check, not a test
  }, [sessionId]);
  const score = data.score ?? {};
  const quotes = data.quotes ?? score.quotes ?? [];
  const missed = data.missed_disclosures ?? score.missed_disclosures ?? [];
  const overall = score.score ?? 0;

  const premature = score.premature_reassurance ?? 0;
  const askedWhyToday = score.asked_why_today ?? false;

  async function retryAt(turnNumber: number) {
    if (!sessionId || retrying) return;
    setRetrying(true);
    setRetryError(null);
    haptic("tap");
    try {
      const res = await fetch("/api/practice/sim/rewind", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, turnNumber }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null;
        setRetryError(j?.error ?? "Could not rewind.");
        return;
      }
      const j = (await res.json()) as { sessionId: string };
      haptic("success");
      router.push(`/practice/consulting-room/session/${j.sessionId}`);
    } catch {
      setRetryError("Network error.");
    } finally {
      setRetrying(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Score header */}
      <div className="rounded-md border-2 border-border bg-card p-6 hard-shadow-sm">
        <p className="text-eyebrow text-muted-foreground">Debrief · {difficulty} patient</p>
        <div className="mt-2 flex items-center gap-4 flex-wrap">
          <span className="text-h1 text-numeric">{overall.toFixed(1)}</span>
          <span className="text-small text-muted-foreground">/ 5.0 overall</span>
          <span className="ml-auto rounded-full border border-border bg-secondary px-2 py-0.5 text-caption font-medium text-muted-foreground">
            AI-generated — not yet faculty reviewed
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
          <ProvisionalAwareStat
            dim="open_closed_ratio"
            provisional={provisionalDims}
            label="Open:closed"
            value={String(score.open_closed_ratio ?? "—")}
            hint="Your questions leaned open this session — keep that up."
          />
          <ProvisionalAwareStat
            dim="reflective_statements"
            provisional={provisionalDims}
            label="Reflective"
            value={String(score.reflective_statements ?? "—")}
            hint="Reflections heard: the debrief quotes below show what worked."
          />
          <ProvisionalAwareStat
            dim="premature_reassurance"
            provisional={provisionalDims}
            label="Premature reassurance"
            value={String(premature)}
            warn={premature > 0}
            hint={premature > 0 ? "You reassured before exploring — the quotes below name it." : "No premature reassurance detected."}
          />
          <ProvisionalAwareStat
            dim="risk_timing"
            provisional={provisionalDims}
            label="Risk timing"
            value={score.risk_timing ?? "—"}
            hint="When you asked about risk matters as much as whether you did."
          />
          <Stat
            label="Idiom decoded"
            value={score.idiom_decoding ? "Yes" : "No"}
            warn={!score.idiom_decoding}
            hint={score.idiom_decoding ? "You asked what it meant." : "The opening phrase was doing work you missed."}
          />
        </div>
        {premature > 0 ? (
          <p className="mt-3 flex items-center gap-2 text-small text-amber-700">
            <AlertTriangle className="size-4" aria-hidden />
            You reassured the patient {premature} time{premature > 1 ? "s" : ""} before fully exploring
            the problem. That&apos;s the most common novice move — sitting with their distress is
            the skill.
          </p>
        ) : null}

        {/* Phase 1 §4.2 — the most under-used question in clinical teaching */}
        <p className={`mt-2 flex items-center gap-2 text-small ${askedWhyToday ? "text-green-700" : "text-amber-700"}`}>
          {askedWhyToday ? (
            <><CircleCheck className="size-4" aria-hidden /> You asked why the patient came in TODAY — that question opens the whole frame.</>
          ) : (
            <><AlertTriangle className="size-4" aria-hidden /> You never asked why the patient came in today specifically. Patients arrive for a reason — a fight, a scare, a deadline. Asking &quot;why now?&quot; opens the door.</>
          )}
        </p>

        {/* Bug 4 — hints are surfaced honestly in the debrief */}
        {hintUsed ? (
          <p className="mt-2 flex items-center gap-2 text-caption text-muted-foreground">
            You opened the difficulty hint during this session. That&apos;s fine — but the debrief is
            honest about it: the hint did part of the thinking for you.
          </p>
        ) : null}
      </div>

      {/* A1 retry — comparison strip: attempt 1 vs attempt 2, same patient, same moment */}
      {branchInfo ? (
        <ComparisonStrip branch={branchInfo} currentOverall={overall} />
      ) : null}

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
              {sessionId && totalTurns ? (
                <button
                  type="button"
                  onClick={() => void retryAt(Math.max(1, totalTurns - quotes.length + i + 1))}
                  disabled={retrying}
                  className="mt-2 inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-caption font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-50"
                >
                  <RotateCcw className="size-3" aria-hidden />
                  {retrying ? "Rewinding…" : "Try this again"}
                </button>
              ) : null}
            </li>
          ))}
        </ul>
        {retryError ? <p className="mt-2 text-small text-red-600" role="alert">{retryError}</p> : null}
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

/**
 * A3 — a stat that hides its NUMBER while the dimension is still provisional.
 * The student still gets the qualitative hint (the quotes in the debrief),
 * just not a number we haven't calibrated yet. Once Dr. Sarthak's scores
 * validate the dimension, the admin flips status → validated and the number
 * appears.
 */
function ProvisionalAwareStat({
  dim,
  provisional,
  label,
  value,
  warn,
  hint,
}: {
  dim: string;
  provisional?: string[];
  label: string;
  value: string;
  warn?: boolean;
  hint: string;
}) {
  if (provisional?.includes(dim)) {
    return (
      <div className="rounded-md border-2 border-dashed border-border bg-background p-3">
        <p className="text-caption text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-base font-semibold">Being calibrated</p>
        <p className="mt-1 text-caption text-muted-foreground">{hint}</p>
      </div>
    );
  }
  return <Stat label={label} value={value} warn={warn} hint={hint} />;
}

/**
 * A1 — the comparison strip. Same patient, same moment, two futures.
 * Attempt 1: the flagged student turn + how the patient responded (from the
 * parent session). Attempt 2: the student's re-attempt + the branch session's
 * patient response. The score delta makes the lesson land.
 */
function ComparisonStrip({ branch, currentOverall }: { branch: BranchInfo; currentOverall?: number }) {
  const { parentTurns, branchedFromTurn, parentScore } = branch;
  // The parent's turns around the flagged moment: [.., studentTurn, patientReply].
  // branchedFromTurn is the 1-indexed flagged student turn; the student turn at
  // that index is the flagged one, followed by the patient's reply.
  const attempt1Student = parentTurns[branchedFromTurn * 2 - 2] ?? null;
  const attempt1Patient = parentTurns[branchedFromTurn * 2 - 1] ?? null;

  const delta =
    parentScore && currentOverall != null
      ? Number((currentOverall - parentScore.overall).toFixed(1))
      : null;

  return (
    <div className="rounded-md border-2 border-primary bg-card p-6 hard-shadow-sm">
      <h2 className="text-base font-semibold">Same patient, same moment, two futures</h2>
      <p className="mt-1 text-small text-muted-foreground">
        You rewound to turn {branchedFromTurn} and tried again. Here&apos;s how the first
        attempt went, and how this re-attempt ended.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {/* attempt 1 */}
        <div className="rounded-md border-2 border-border bg-background p-4">
          <p className="text-caption font-semibold text-muted-foreground">Attempt 1 · turn {branchedFromTurn}</p>
          {attempt1Student ? (
            <p className="mt-2 text-small italic">
              <span className="font-semibold not-italic text-muted-foreground">You said: </span>
              &quot;{attempt1Student.content}&quot;
            </p>
          ) : null}
          {attempt1Patient ? (
            <p className="mt-2 text-small italic">
              <span className="font-semibold not-italic text-muted-foreground">Patient: </span>
              &quot;{attempt1Patient.content}&quot;
            </p>
          ) : null}
          <p className="mt-3 text-caption text-amber-700">
            {parentScore ? `Debrief score: ${parentScore.overall.toFixed(1)} / 5` : "The flagged moment"}
          </p>
        </div>

        {/* attempt 2 */}
        <div className="rounded-md border-2 border-primary bg-primary/5 p-4">
          <p className="text-caption font-semibold text-primary">Attempt 2 · your rewind</p>
          <p className="mt-2 text-small text-muted-foreground">
            This session is your re-attempt from the same point. The patient you just
            interviewed is the same person, in the same state — the difference in how
            they responded is entirely down to how you asked.
          </p>
          <p className="mt-3 text-caption font-medium text-green-700">
            {currentOverall != null ? `This attempt: ${currentOverall.toFixed(1)} / 5` : null}
            {delta != null ? (
              <span className={delta >= 0 ? "ml-2 text-green-700" : "ml-2 text-red-600"}>
                {delta >= 0 ? "▲" : "▼"} {Math.abs(delta).toFixed(1)} vs attempt 1
              </span>
            ) : null}
          </p>
        </div>
      </div>

      <p className="mt-4 text-small text-muted-foreground">
        Same patient. Same moment. Two futures — that comparison is the whole lesson.
      </p>
    </div>
  );
}
