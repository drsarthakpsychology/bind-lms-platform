"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Check, CircleHelp, LoaderCircle, Minus, Send, ShieldAlert, X } from "lucide-react";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { useDraft } from "@/lib/hooks/use-draft";
import { btnPrimary, btnSecondary, card, chip } from "@/lib/games/ui/styles";
import { MSE_DOMAINS, RISK_LEVELS, type CheckItem, type InterviewGrade, type MseDomain, type RiskLevel, type Submission, type Verdict } from "@/lib/interview-grade/types";

const EMPTY: Submission = {
  mse: Object.fromEntries(MSE_DOMAINS.map((d) => [d.id, ""])) as Record<MseDomain, string>,
  risk: { findings: "", level: "unsure" },
  formulation: "",
};

const LEVEL_LABEL: Record<RiskLevel, string> = { low: "Low", moderate: "Moderate", high: "High", unsure: "Not sure" };

function parseDraft(raw: string): Submission {
  try {
    const j = JSON.parse(raw) as Partial<Submission>;
    return {
      mse: { ...EMPTY.mse, ...(j.mse ?? {}) },
      risk: { findings: j.risk?.findings ?? "", level: RISK_LEVELS.includes(j.risk?.level as RiskLevel) ? (j.risk!.level as RiskLevel) : "unsure" },
      formulation: j.formulation ?? "",
    };
  } catch {
    return EMPTY;
  }
}

const input = "w-full rounded-md border-2 border-foreground bg-background p-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring";

function Eyebrow({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-eyebrow text-link">
      <span className="font-mono">{n}</span>
      <span aria-hidden className="size-1.5 rounded-full bg-primary" />
      {children}
    </p>
  );
}

/**
 * Graded interview hand-in: the MSE as observed, a risk assessment and a
 * short formulation. Saved as a draft on this device until it's sent.
 */
export function GradedForm({
  sessionId,
  patientName,
  notes,
  onBack,
  onGraded,
}: {
  sessionId: string;
  patientName: string;
  notes: string;
  /** Null once the session time is up (no going back to the patient). */
  onBack: (() => void) | null;
  onGraded: (g: InterviewGrade) => void;
}) {
  const draft = useDraft(`sim:graded:${sessionId}`);
  const sub = React.useMemo(() => (draft.value ? parseDraft(draft.value) : EMPTY), [draft.value]);
  const set = (next: Submission) => draft.setValue(JSON.stringify(next));
  const [sending, setSending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const filled = MSE_DOMAINS.filter((d) => sub.mse[d.id].trim()).length;

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/practice/sim/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, submission: sub }),
      });
      const j = (await res.json().catch(() => null)) as { grade?: InterviewGrade; error?: string } | null;
      if (!res.ok || !j?.grade) {
        setError(res.status === 429 ? "Too many tries. Wait a minute, then send again." : (j?.error ?? "Couldn't mark it. Try again."));
        return;
      }
      haptic("success");
      draft.clear();
      onGraded(j.grade);
    } catch {
      setError("Network error. Your answers are saved on this device; send again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="h-dvh overflow-y-auto bg-background">
      <form onSubmit={send} className="mx-auto w-full max-w-2xl space-y-5 px-4 py-5 pb-28 sm:px-6">
        <div className="flex items-center gap-3">
          {onBack && (
            <button type="button" onClick={onBack} className={cn(btnSecondary, "min-h-11 px-3")} aria-label="Back to the conversation">
              <ArrowLeft className="size-4" aria-hidden /> Back
            </button>
          )}
          <span className={cn(chip, "bg-card")}>Graded interview</span>
        </div>
        <div>
          <h1 className="text-h2">Hand in your findings</h1>
          <p className="mt-1 text-small text-muted-foreground">Write what you saw and heard with {patientName}. Short notes are fine.</p>
        </div>

        {notes.trim() && (
          <details className={cn(card, "p-3")}>
            <summary className="cursor-pointer font-bold">Your notes from the session</summary>
            <p className="mt-2 whitespace-pre-wrap text-small">{notes}</p>
          </details>
        )}

        <section className={cn(card, "space-y-4 p-4")} aria-labelledby="g-mse">
          <div>
            <Eyebrow n="01">Mental state</Eyebrow>
            <h2 id="g-mse" className="mt-1 text-h3">
              MSE <span className="text-small font-normal text-muted-foreground">({filled} of {MSE_DOMAINS.length} filled)</span>
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {MSE_DOMAINS.map((d) => (
              <label key={d.id} className="block">
                <span className="font-bold">{d.label}</span>
                <span className="block text-caption text-muted-foreground">{d.hint}</span>
                <textarea rows={2} maxLength={400} value={sub.mse[d.id]} onChange={(e) => set({ ...sub, mse: { ...sub.mse, [d.id]: e.target.value } })} className={cn(input, "mt-1")} />
              </label>
            ))}
          </div>
        </section>

        <section className={cn(card, "space-y-4 p-4")} aria-labelledby="g-risk">
          <div>
            <Eyebrow n="02">Risk</Eyebrow>
            <h2 id="g-risk" className="mt-1 text-h3">
              Risk assessment
            </h2>
            <p className="mt-1 text-small text-muted-foreground">Asking plainly about suicide does not put the idea in someone&apos;s head. Note thoughts, plan, intent, means, past attempts, what keeps them going, and any risk to others.</p>
          </div>
          <label className="block">
            <span className="font-bold">What you found</span>
            <textarea rows={4} maxLength={800} value={sub.risk.findings} onChange={(e) => set({ ...sub, risk: { ...sub.risk, findings: e.target.value } })} className={cn(input, "mt-1")} />
          </label>
          <fieldset>
            <legend className="font-bold">Your risk level</legend>
            <div className="mt-1 flex flex-wrap gap-2">
              {RISK_LEVELS.map((l) => (
                <label
                  key={l}
                  className={cn(
                    "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md border-2 border-foreground px-3 text-sm font-bold has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
                    sub.risk.level === l ? "bg-foreground text-background" : "bg-card hover:bg-accent",
                  )}
                >
                  <input type="radio" name="risk-level" value={l} checked={sub.risk.level === l} onChange={() => set({ ...sub, risk: { ...sub.risk, level: l } })} className="sr-only" />
                  {sub.risk.level === l && <Check className="size-4" aria-hidden />}
                  {LEVEL_LABEL[l]}
                </label>
              ))}
            </div>
          </fieldset>
          <p className="text-caption text-muted-foreground">This is practice with a made-up patient. If these questions bring something up for you, talk to your faculty.</p>
        </section>

        <section className={cn(card, "space-y-3 p-4")} aria-labelledby="g-form">
          <div>
            <Eyebrow n="03">Formulation</Eyebrow>
            <h2 id="g-form" className="mt-1 text-h3">
              Short formulation
            </h2>
            <p className="mt-1 text-small text-muted-foreground">In 3 to 5 sentences: what made them vulnerable, what set this off, what keeps it going, and what protects them.</p>
          </div>
          <textarea rows={5} maxLength={1500} value={sub.formulation} onChange={(e) => set({ ...sub, formulation: e.target.value })} className={input} aria-label="Formulation" />
        </section>

        {error && (
          <p role="alert" className="rounded-md border-2 border-foreground bg-status-alert-bg px-3 py-2 text-sm font-semibold text-status-alert-fg">
            {error}
          </p>
        )}

        <div className="fixed inset-x-0 bottom-0 border-t-2 border-foreground bg-card px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="mx-auto flex max-w-2xl items-center gap-3">
            <p className="hidden flex-1 text-small text-muted-foreground sm:block">You can hand in once for this session.</p>
            <button type="submit" className={cn(btnPrimary, "w-full sm:w-auto")} disabled={sending}>
              {sending ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <Send className="size-4" aria-hidden />}
              {sending ? "Marking…" : "Hand in and get my grade"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

const VERDICT: Record<Verdict, { label: string; Icon: typeof Check; cls: string }> = {
  accurate: { label: "Accurate", Icon: Check, cls: "bg-status-success-bg text-status-success-fg" },
  partly: { label: "Partly", Icon: Minus, cls: "bg-status-pending-bg text-status-pending-fg" },
  inaccurate: { label: "Not accurate", Icon: X, cls: "bg-status-alert-bg text-status-alert-fg" },
  missing: { label: "Left blank", Icon: X, cls: "bg-status-alert-bg text-status-alert-fg" },
  not_checked: { label: "Not checked", Icon: CircleHelp, cls: "bg-card text-muted-foreground" },
};

function Items({ asked, missed }: { asked: CheckItem[]; missed: CheckItem[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <p className="font-bold">You asked ({asked.length})</p>
        <ul className="mt-1 space-y-2">
          {asked.map((x) => (
            <li key={x.id} className="flex gap-2 text-small">
              <Check className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>
                <span className="font-semibold">{x.label}</span>
                {x.quote && <span className="block text-muted-foreground">&ldquo;{x.quote}&rdquo;</span>}
              </span>
            </li>
          ))}
          {!asked.length && <li className="text-small text-muted-foreground">None of these.</li>}
        </ul>
      </div>
      <div>
        <p className="font-bold">You missed ({missed.length})</p>
        <ul className="mt-1 space-y-2">
          {missed.map((x) => (
            <li key={x.id} className="flex gap-2 text-small">
              <X className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>
                <span className="font-semibold">{x.label}</span>
                <span className="block text-muted-foreground">{x.why}</span>
              </span>
            </li>
          ))}
          {!missed.length && <li className="text-small text-muted-foreground">Nothing. Well done.</li>}
        </ul>
      </div>
    </div>
  );
}

function Part({ n, title, score, children }: { n: string; title: string; score: string; children: React.ReactNode }) {
  return (
    <section className={cn(card, "space-y-3 p-4")} aria-label={title}>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <Eyebrow n={n}>{title}</Eyebrow>
        </div>
        <span className="font-pix text-xl tabular-nums">{score}</span>
      </div>
      {children}
    </section>
  );
}

const pct = (x: number | null) => (x === null ? "Not checked" : `${Math.round(x * 100)}%`);

/** The rubric with specific feedback: questions asked and missed, rapport, risk, MSE and formulation. */
export function GradedResult({ grade, onExit }: { grade: InterviewGrade; onExit?: () => void }) {
  const p = grade.parts;
  return (
    <div className="h-dvh overflow-y-auto bg-background">
      <div className="mx-auto w-full max-w-2xl space-y-4 px-4 py-5 sm:px-6">
        <section className={cn(card, "p-5 text-center hard-shadow-md")} aria-label="Your grade">
          <span className={cn(chip, "bg-card")}>Graded interview</span>
          <p className="mt-3 font-pix text-5xl tabular-nums">
            {grade.overall}
            <span className="text-xl">/100</span>
          </p>
          <p className="mx-auto mt-3 max-w-prose leading-relaxed">{grade.summary}</p>
          {!grade.aiChecked && <p className="mt-2 text-small text-muted-foreground">The AI marker wasn&apos;t available, so the MSE and formulation weren&apos;t checked. The rest is marked by rules.</p>}
        </section>

        <Part n="01" title="History: key questions" score={pct(p.history.score)}>
          <p className="text-small">{p.history.feedback}</p>
          <Items asked={p.history.asked} missed={p.history.missed} />
        </Part>

        <Part n="02" title="Rapport" score={`${p.rapport.score}/4`}>
          <p className="text-small">{p.rapport.feedback}</p>
          <p className="text-caption text-muted-foreground">
            {p.rapport.reflections} reflections · {p.rapport.openQuestions} open of {p.rapport.questions} questions
          </p>
          {p.rapport.reassurance.length > 0 && (
            <div className="rounded-md border-2 border-foreground bg-status-pending-bg p-3 text-small text-status-pending-fg">
              <p className="font-bold">Early reassurance</p>
              <ul className="mt-1 space-y-1">
                {p.rapport.reassurance.map((q, i) => (
                  <li key={i}>&ldquo;{q}&rdquo;</li>
                ))}
              </ul>
            </div>
          )}
        </Part>

        <Part n="03" title="Risk questions" score={pct(p.risk.score)}>
          <div className="flex flex-wrap gap-2 text-small">
            <span className={cn(chip, "bg-card")}>You said: {LEVEL_LABEL[p.risk.yourLevel]}</span>
            {p.risk.expectedLevel && (
              <span className={cn(chip, p.risk.levelOk ? "bg-status-success-bg text-status-success-fg" : "bg-status-pending-bg text-status-pending-fg")}>
                {p.risk.levelOk ? <Check className="size-4" aria-hidden /> : <ShieldAlert className="size-4" aria-hidden />} Case level: {LEVEL_LABEL[p.risk.expectedLevel]}
              </span>
            )}
          </div>
          <p className="text-small">{p.risk.feedback}</p>
          <Items asked={p.risk.asked} missed={p.risk.missed} />
        </Part>

        <Part n="04" title="MSE accuracy" score={pct(p.mse.score)}>
          <ul className="space-y-2">
            {p.mse.domains.map((d) => {
              const v = VERDICT[d.verdict];
              return (
                <li key={d.domain} className="flex flex-col gap-1 rounded-md border-2 border-foreground p-3 sm:flex-row sm:items-start sm:gap-3">
                  <span className={cn(chip, "shrink-0 self-start", v.cls)}>
                    <v.Icon className="size-4" aria-hidden /> {v.label}
                  </span>
                  <span className="text-small">
                    <span className="font-bold">{d.label}:</span> {d.feedback}
                  </span>
                </li>
              );
            })}
          </ul>
        </Part>

        <Part n="05" title="Formulation" score={p.formulation.score === null ? "Not checked" : `${Number((p.formulation.score * 4).toFixed(1))}/4`}>
          <p className="text-small">{p.formulation.feedback}</p>
        </Part>

        {grade.betterQuestions.length > 0 && (
          <section className={cn(card, "p-4")} aria-label="Try asking">
            <h2 className="text-h3">Try asking next time</h2>
            <ul className="mt-2 space-y-2">
              {grade.betterQuestions.map((q, i) => (
                <li key={i} className="border-l-2 border-primary pl-3 text-small">
                  {q}
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="grid gap-2 pb-6 sm:grid-cols-2">
          {onExit ? (
            <button type="button" className={btnPrimary} onClick={onExit}>
              Back to patients
            </button>
          ) : (
            <Link href="/practice/consulting-room" className={btnPrimary}>
              Back to patients
            </Link>
          )}
          <Link href="/study/interview-mse" className={btnSecondary}>
            Study interview and MSE
          </Link>
        </div>
      </div>
    </div>
  );
}
