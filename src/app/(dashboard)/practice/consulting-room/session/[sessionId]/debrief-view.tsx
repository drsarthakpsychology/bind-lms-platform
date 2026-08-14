"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  CircleCheck,
  AlertTriangle,
  RotateCcw,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { MobileHeader } from "@/components/mobile/mobile-header";
import { MobileSection } from "@/components/mobile/mobile-section";
import { MobileStickyAction } from "@/components/mobile/mobile-sticky-action";
import { MobileContinueAction } from "@/components/mobile/mobile-continue-action";
import { MobileCompletionState } from "@/components/mobile/mobile-completion-state";
import { StatusPill } from "@/components/mobile/status-pill";
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
 * The debrief — the actual product of the Consulting Room — rebuilt as a
 * progressive flow (T34): one section at a time with a single primary action
 * and "Section X of Y" context. Score → headline insight → quotes
 * (one-at-a-time, each with "Try this again") → missed-disclosures reveal →
 * optional voice Delivery → one next action. Nothing is lost; it is revealed
 * one cognitive unit at a time.
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
  const [step, setStep] = React.useState(0);
  const [done, setDone] = React.useState(false);
  const [revealMissed, setRevealMissed] = React.useState(false);
  const [quoteIdx, setQuoteIdx] = React.useState(0);
  const [retrying, setRetrying] = React.useState(false);
  const [retryError, setRetryError] = React.useState<string | null>(null);
  // Create/update the patient chain once the debrief shows — the session is
  // complete, so /today (and this debrief) can offer the next surface.
  const [chainNext, setChainNext] = React.useState<{ surface: string; label: string; href: string; patient: string } | null>(null);
  const chainPostedRef = React.useRef(false);
  React.useEffect(() => {
    if (!sessionId || chainPostedRef.current) return;
    chainPostedRef.current = true;
    void (async () => {
      try {
        const res = await fetch("/api/practice/chain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId }),
        });
        const j = (await res.json()) as { next?: { surface: string; label: string; href: string; patient: string } };
        if (j.next) setChainNext(j.next);
      } catch {
        /* silent; a check, not a test */
      }
    })();
  }, [sessionId]);
  const score = data.score ?? {};
  const quotes = data.quotes ?? score.quotes ?? [];
  const missed = data.missed_disclosures ?? score.missed_disclosures ?? [];
  const overall = score.score ?? 0;

  const premature = score.premature_reassurance ?? 0;
  const askedWhyToday = score.asked_why_today ?? false;

  const steps = React.useMemo(() => {
    const s: Array<{ key: string; label: string }> = [
      { key: "score", label: "Your score" },
      { key: "insight", label: "What happened" },
      { key: "quotes", label: "Three moments" },
      { key: "missed", label: "What you missed" },
    ];
    if (voice) s.push({ key: "delivery", label: "Delivery" });
    return s;
  }, [voice]);

  const stepKey = steps[step].key;

  const nextStep = React.useCallback(() => {
    haptic("tap");
    if (step >= steps.length - 1) setDone(true);
    else setStep((s) => s + 1);
  }, [step, steps.length]);

  const handleBack = React.useCallback(() => {
    if (done) {
      setDone(false);
      setStep(steps.length - 1);
    } else if (step > 0) {
      setStep((s) => s - 1);
    } else {
      onExit();
    }
  }, [done, step, steps.length, onExit]);

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

  const primary = ((): { label: string; onPress: () => void } => {
    switch (stepKey) {
      case "score":
        return { label: "What happened next", onPress: nextStep };
      case "insight":
        return { label: "See the moments", onPress: nextStep };
      case "quotes":
        return { label: "What I missed", onPress: nextStep };
      case "missed":
        return revealMissed
          ? { label: "Continue", onPress: nextStep }
          : { label: "Reveal the missed disclosures", onPress: () => setRevealMissed(true) };
      case "delivery":
        return { label: "Finish", onPress: () => setDone(true) };
      default:
        return { label: "Continue", onPress: nextStep };
    }
  })();

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <MobileHeader
        title="Debrief"
        subtitle={`Section ${done ? steps.length : step + 1} of ${steps.length}`}
        onBack={handleBack}
      />

      <div className="flex-1 overflow-y-auto px-4 py-6 pb-40">
        {done ? (
          <MobileCompletionState
            title="Debrief complete"
            description={`You scored ${overall.toFixed(1)} / 5.0 with the ${difficulty} patient. The moments above are yours to return to.`}
            icon={<span className="text-numeric text-h3 font-bold">{overall.toFixed(1)}</span>}
            action={
              chainNext ? (
                <Link
                  href={chainNext.href}
                  className={cn(buttonVariants({ variant: "default", size: "lg" }), "w-full")}
                >
                  Continue with {chainNext.patient} · {chainNext.label}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={onExit}
                  className={cn(buttonVariants({ variant: "default", size: "lg" }), "w-full")}
                >
                  Back to cases
                </button>
              )
            }
            secondary={
              chainNext ? (
                <button
                  type="button"
                  onClick={onExit}
                  className="text-caption text-muted-foreground underline underline-offset-2"
                >
                  Back to cases
                </button>
              ) : undefined
            }
          />
        ) : stepKey === "score" ? (
          <ScoreStep
            overall={overall}
            score={score}
            difficulty={difficulty}
            provisionalDims={provisionalDims}
          />
        ) : stepKey === "insight" ? (
          <InsightStep
            premature={premature}
            askedWhyToday={askedWhyToday}
            hintUsed={hintUsed}
            branchInfo={branchInfo}
            overall={overall}
          />
        ) : stepKey === "quotes" ? (
          <QuotesStep
            quotes={quotes}
            quoteIdx={quoteIdx}
            setQuoteIdx={setQuoteIdx}
            retrying={retrying}
            retryError={retryError}
            onRetry={retryAt}
            canRetry={Boolean(sessionId && totalTurns)}
            totalTurns={totalTurns ?? 0}
          />
        ) : stepKey === "missed" ? (
          <MissedStep revealMissed={revealMissed} missed={missed} />
        ) : (
          <DeliveryStep voice={voice} />
        )}
      </div>

      {!done ? (
        <MobileStickyAction>
          <MobileContinueAction label={primary.label} onClick={primary.onPress} />
        </MobileStickyAction>
      ) : null}
    </div>
  );
}

function ScoreStep({
  overall,
  score,
  difficulty,
  provisionalDims,
}: {
  overall: number;
  score: DebriefData["score"];
  difficulty: string;
  provisionalDims?: string[];
}) {
  return (
    <MobileSection
      title="Your score"
      description={`Debrief · ${difficulty} patient`}
    >
      <div className="rounded-md border-2 border-border bg-card p-6 text-center hard-shadow-sm">
        <p className="text-h1 text-numeric">{overall.toFixed(1)}</p>
        <p className="mt-0.5 text-small text-muted-foreground">/ 5.0 overall</p>
        <StatusPill tone="neutral" label="AI-generated — not yet faculty reviewed" className="mt-3" />
      </div>

      <details className="group rounded-md border-2 border-border bg-card">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4">
          <span className="text-small font-semibold text-foreground">Score breakdown</span>
          <ChevronDown className="size-5 text-muted-foreground transition-transform duration-fast ease-snappy group-open:rotate-180" aria-hidden />
        </summary>
        <div className="grid grid-cols-2 gap-3 border-t-2 border-border p-4 sm:grid-cols-3">
          <ProvisionalAwareStat
            dim="open_closed_ratio"
            provisional={provisionalDims}
            label="Open:closed"
            value={String(score?.open_closed_ratio ?? "—")}
            hint="Your questions leaned open this session — keep that up."
          />
          <ProvisionalAwareStat
            dim="reflective_statements"
            provisional={provisionalDims}
            label="Reflective"
            value={String(score?.reflective_statements ?? "—")}
            hint="Reflections heard: the moments below show what worked."
          />
          <ProvisionalAwareStat
            dim="premature_reassurance"
            provisional={provisionalDims}
            label="Premature reassurance"
            value={String(score?.premature_reassurance ?? 0)}
            warn={(score?.premature_reassurance ?? 0) > 0}
            hint={(score?.premature_reassurance ?? 0) > 0 ? "You reassured before exploring — the moments below name it." : "No premature reassurance detected."}
          />
          <ProvisionalAwareStat
            dim="risk_timing"
            provisional={provisionalDims}
            label="Risk timing"
            value={score?.risk_timing ?? "—"}
            hint="When you asked about risk matters as much as whether you did."
          />
          <Stat
            label="Idiom decoded"
            value={score?.idiom_decoding ? "Yes" : "No"}
            warn={!score?.idiom_decoding}
            hint={score?.idiom_decoding ? "You asked what it meant." : "The opening phrase was doing work you missed."}
          />
        </div>
      </details>
    </MobileSection>
  );
}

function InsightStep({
  premature,
  askedWhyToday,
  hintUsed,
  branchInfo,
  overall,
}: {
  premature: number;
  askedWhyToday: boolean;
  hintUsed?: boolean;
  branchInfo?: BranchInfo;
  overall?: number;
}) {
  return (
    <MobileSection
      title="What happened"
      description="The headline insight from your session."
    >
      {premature > 0 ? (
        <div className="rounded-md border-2 border-border bg-card p-4">
          <p className="flex items-center gap-2 text-small text-amber-700">
            <AlertTriangle className="size-4" aria-hidden />
            You reassured the patient {premature} time{premature > 1 ? "s" : ""} before fully exploring
            the problem. That&apos;s the most common novice move — sitting with their distress is
            the skill.
          </p>
        </div>
      ) : null}

      <div className="rounded-md border-2 border-border bg-card p-4">
        <p className={`flex items-center gap-2 text-small ${askedWhyToday ? "text-green-700" : "text-amber-700"}`}>
          {askedWhyToday ? (
            <><CircleCheck className="size-4" aria-hidden /> You asked why the patient came in TODAY — that question opens the whole frame.</>
          ) : (
            <><AlertTriangle className="size-4" aria-hidden /> You never asked why the patient came in today specifically. Patients arrive for a reason — a fight, a scare, a deadline. Asking &quot;why now?&quot; opens the door.</>
          )}
        </p>
      </div>

      {hintUsed ? (
        <p className="flex items-center gap-2 text-caption text-muted-foreground">
          You opened the difficulty hint during this session. That&apos;s fine — but the debrief is
          honest about it: the hint did part of the thinking for you.
        </p>
      ) : null}

      {branchInfo ? <ComparisonStrip branch={branchInfo} currentOverall={overall} /> : null}
    </MobileSection>
  );
}

function QuotesStep({
  quotes,
  quoteIdx,
  setQuoteIdx,
  retrying,
  retryError,
  onRetry,
  canRetry,
  totalTurns,
}: {
  quotes: Array<{ quote: string; better: string }>;
  quoteIdx: number;
  setQuoteIdx: (i: number) => void;
  retrying: boolean;
  retryError: string | null;
  onRetry: (turnNumber: number) => void;
  canRetry: boolean;
  totalTurns: number;
}) {
  if (quotes.length === 0) {
    return (
      <MobileSection title="Three moments, done better" description="No flagged moments this session.">
        <div className="rounded-md border-2 border-border bg-card p-5 text-small text-muted-foreground">
          Every line landed. Nothing to rework here.
        </div>
      </MobileSection>
    );
  }

  const q = quotes[quoteIdx];
  return (
    <MobileSection
      title={`Moment ${quoteIdx + 1} of ${quotes.length}`}
      description="A verbatim line from your transcript with a better alternative."
    >
      <div className="rounded-md border-2 border-border bg-card p-4 hard-shadow-sm">
        <p className="text-small">
          <span className="font-semibold text-muted-foreground">You said: </span>
          <span className="italic">&ldquo;{q.quote}&rdquo;</span>
        </p>
        <p className="mt-2 text-small">
          <span className="font-semibold text-link">Better: </span>
          {q.better}
        </p>
        {canRetry ? (
          <button
            type="button"
            onClick={() => onRetry(Math.max(1, totalTurns - quotes.length + quoteIdx + 1))}
            disabled={retrying}
            className="mt-3 inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-caption font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-50"
          >
            <RotateCcw className="size-3" aria-hidden />
            {retrying ? "Rewinding…" : "Try this again"}
          </button>
        ) : null}
        {retryError ? <p className="mt-2 text-small text-status-alert-fg" role="alert">{retryError}</p> : null}
      </div>

      {quotes.length > 1 ? (
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setQuoteIdx(Math.max(0, quoteIdx - 1))}
            disabled={quoteIdx === 0}
            className="inline-flex min-h-11 items-center gap-1 rounded-md border-2 border-border bg-card px-3 text-small font-medium text-muted-foreground disabled:opacity-40"
          >
            <ChevronLeft className="size-4" aria-hidden /> Previous
          </button>
          <button
            type="button"
            onClick={() => setQuoteIdx(Math.min(quotes.length - 1, quoteIdx + 1))}
            disabled={quoteIdx === quotes.length - 1}
            className="inline-flex min-h-11 items-center gap-1 rounded-md border-2 border-border bg-card px-3 text-small font-medium text-muted-foreground disabled:opacity-40"
          >
            Next <ChevronRight className="size-4" aria-hidden />
          </button>
        </div>
      ) : null}
    </MobileSection>
  );
}

function MissedStep({
  revealMissed,
  missed,
}: {
  revealMissed: boolean;
  missed: string[];
}) {
  return (
    <MobileSection
      title="What you didn't unlock"
      description={
        revealMissed
          ? "The things this patient would have shared if you'd asked differently."
          : "The patient was carrying things they would only have shared if you'd asked differently."
      }
    >
      {!revealMissed ? (
        <div className="rounded-md border-2 border-border bg-card p-5 text-small text-muted-foreground">
          Ready to see them?
        </div>
      ) : (
        <ul className="space-y-2">
          {missed.length === 0 ? (
            <li className="rounded-md border-2 border-border bg-card p-4 text-small text-muted-foreground">
              Nothing missed — you unlocked everything this patient was ready to share.
            </li>
          ) : (
            missed.map((m, i) => (
              <li key={i} className="flex gap-2 rounded-md border border-border bg-card p-3 text-small">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                <span className="italic">{m}</span>
              </li>
            ))
          )}
        </ul>
      )}
    </MobileSection>
  );
}

function DeliveryStep({ voice }: { voice?: VoiceMetrics }) {
  if (!voice) return null;
  return (
    <MobileSection title="Delivery" description="Compared against your own past sessions, not other students.">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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
    </MobileSection>
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
  const attempt1Student = parentTurns[branchedFromTurn * 2 - 2] ?? null;
  const attempt1Patient = parentTurns[branchedFromTurn * 2 - 1] ?? null;

  const delta =
    parentScore && currentOverall != null
      ? Number((currentOverall - parentScore.overall).toFixed(1))
      : null;

  return (
    <div className="rounded-md border-2 border-primary bg-card p-4 hard-shadow-sm">
      <h2 className="text-base font-semibold">Same patient, same moment, two futures</h2>
      <p className="mt-1 text-small text-muted-foreground">
        You rewound to turn {branchedFromTurn} and tried again. Here&apos;s how the first
        attempt went, and how this re-attempt ended.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
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

        <div className="rounded-md border-2 border-primary bg-primary/5 p-4">
          <p className="text-caption font-semibold text-link">Attempt 2 · your rewind</p>
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
