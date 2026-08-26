"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Info, Lock } from "lucide-react";
import { haptic } from "@/lib/haptics";
import { StatusPill } from "@/components/mobile/status-pill";
import { MobileBottomSheet } from "@/components/mobile/mobile-bottom-sheet";

export interface CaseCard {
  id: string;
  title: string;
  difficulty: string;
  summary: string;
  source: "hand_built" | "corpus";
  /** The patient's own words — the hook. Never the diagnosis. */
  hook?: string;
  /** Session state per card: not attempted / in progress / completed. */
  state?: "not_started" | "in_progress" | "completed";
  /** Best score for completed sessions (shown only when complete). */
  score?: number | null;
  /** Stars earned (0-3) from the best debrief score. */
  stars?: number;
  /** Unlock progression: is this case available yet? */
  unlocked?: boolean;
  /** How many completed cases unlock the next tier. */
  unlockAt?: number;
}

const DIFFICULTY_LABEL: Record<string, string> = {
  cooperative: "Cooperative",
  guarded: "Guarded",
  resistant: "Resistant",
  crisis: "Crisis",
};

const DIFFICULTY_ORDER = ["cooperative", "guarded", "resistant", "crisis"] as const;

const STATE_LABEL: Record<NonNullable<CaseCard["state"]>, string> = {
  not_started: "Not attempted",
  in_progress: "In progress",
  completed: "Completed",
};

const STATE_TONE: Record<NonNullable<CaseCard["state"]>, "neutral" | "ai"> = {
  not_started: "neutral",
  in_progress: "ai",
  completed: "neutral",
};

/**
 * Case picker — grouped by difficulty, each card led by the patient's OWN words
 * (the hook) with the clinical line secondary. The diagnosis never appears on
 * the card; it stays with the faculty debrief. One dominant tap target per
 * card: the whole card starts/resumes the session. "In progress" cases are
 * surfaced first so the Resume task is immediate (T33).
 */
export function CasePicker({ cases }: { cases: CaseCard[] }) {
  const router = useRouter();
  const [starting, setStarting] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function start(c: CaseCard) {
    if (starting) return;
    setStarting(c.id);
    setError(null);
    haptic("tap");
    try {
      const res = await fetch("/api/practice/sim/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          c.id ? { caseId: c.id } : { caseTitle: c.title },
        ),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        setError(j?.error ?? "Could not start the session. Please try again.");
        return;
      }
      const j = (await res.json()) as { sessionId: string };
      haptic("success");
      router.push(`/practice/consulting-room/session/${j.sessionId}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setStarting(null);
    }
  }

  const inProgress = cases.filter((c) => c.state === "in_progress");
  const rest = cases.filter((c) => c.state !== "in_progress");
  const grouped = DIFFICULTY_ORDER
    .map((d) => ({
      difficulty: d,
      label: DIFFICULTY_LABEL[d],
      items: rest.filter((c) => c.difficulty === d),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="space-y-8">
      {error ? (
        <div
          className="rounded-md border border-status-alert-fg/40 bg-status-alert-bg p-3 text-small text-status-alert-fg"
          role="alert"
        >
          {error}
        </div>
      ) : null}
      {cases.length === 0 ? (
        <div className="rounded-md border-2 border-dashed border-border bg-card p-8 text-center">
          <p className="text-base font-medium">No patients are ready yet</p>
          <p className="mt-1 text-small text-muted-foreground">
            Your faculty is finalising the case list. Check back soon — the first
            patient will be waiting here.
          </p>
        </div>
      ) : null}

      {inProgress.length > 0 ? (
        <section aria-label="Continue your session">
          <div className="mb-3 flex items-center gap-3">
            <h2 className="text-eyebrow text-link">In progress</h2>
            <span className="h-px flex-1 bg-border" aria-hidden />
            <span className="text-caption text-muted-foreground">Continue where you left off</span>
          </div>
          <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {inProgress.map((c) => (
              <CaseCardItem key={c.id || c.title} c={c} busy={starting === c.id} onStart={start} />
            ))}
          </ul>
        </section>
      ) : null}

      {grouped.map((g) => (
        <section key={g.difficulty} aria-label={`${g.label} patients`}>
          <div className="mb-3 flex items-center gap-3">
            <h2 className="text-eyebrow text-muted-foreground">{g.label}</h2>
            <span className="h-px flex-1 bg-border" aria-hidden />
            <span className="text-caption text-muted-foreground">{g.items.length} patient{g.items.length === 1 ? "" : "s"}</span>
          </div>
          <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {g.items.map((c) => (
              <CaseCardItem key={c.id || c.title} c={c} busy={starting === c.id} onStart={start} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

/**
 * A single case card: one dominant Start/Resume tap target (the whole card)
 * and a trailing StatusPill for state. Locked cases keep a single top banner
 * instead of a competing chip row.
 */
function CaseCardItem({
  c,
  busy,
  onStart,
}: {
  c: CaseCard;
  busy: boolean;
  onStart: (c: CaseCard) => void;
}) {
  const st = c.state ?? "not_started";
  const locked = c.unlocked === false;
  const stateLabel =
    st === "completed" && typeof c.score === "number"
      ? `${STATE_LABEL[st]} · ${Math.round(c.score * 10)}/10`
      : STATE_LABEL[st];

  if (locked) {
    return (
      <li className="rounded-md border-2 border-border bg-card p-4 opacity-70">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-eyebrow text-muted-foreground">{DIFFICULTY_LABEL[c.difficulty] ?? c.difficulty}</p>
            <h3 className="mt-0.5 text-body-strong text-foreground">{c.title}</h3>
          </div>
          <Lock className="size-5 shrink-0 text-muted-foreground" aria-hidden />
        </div>
        <blockquote className="mt-3 border-l-2 border-primary pl-3">
          <p className="text-small font-medium">&ldquo;{c.hook ?? c.summary}&rdquo;</p>
        </blockquote>
        <p className="mt-2 line-clamp-2 text-caption text-muted-foreground">{c.summary}</p>
        <p className="mt-3 inline-flex items-center gap-1.5 text-caption text-muted-foreground">
          <Lock className="size-3.5 shrink-0" aria-hidden />
          Unlocks after {c.unlockAt ?? 3} completed cases
        </p>
      </li>
    );
  }

  return (
    <li className="overflow-hidden rounded-md border-2 border-border bg-card hard-shadow-sm transition-[transform,box-shadow] hover:-translate-y-0.5 hover:hard-shadow-md active:translate-y-px">
      <button
        type="button"
        onClick={() => onStart(c)}
        disabled={busy}
        className="w-full p-4 text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-eyebrow text-link">{DIFFICULTY_LABEL[c.difficulty] ?? c.difficulty}</p>
            <h3 className="mt-0.5 text-body-strong text-foreground">{c.title}</h3>
          </div>
          <StatusPill tone={STATE_TONE[st]} label={stateLabel} className="shrink-0" />
        </div>
        <blockquote className="mt-3 border-l-2 border-primary pl-3">
          <p className="text-small font-medium">&ldquo;{c.hook ?? c.summary}&rdquo;</p>
        </blockquote>
        <p className="mt-2 line-clamp-2 text-caption text-muted-foreground">{c.summary}</p>
        <p className="mt-3 text-small font-semibold text-link">
          {busy ? "Starting…" : st === "in_progress" ? "Resume session" : "Start session"}
        </p>
      </button>
      <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-2">
        <span className="flex min-w-0 items-center gap-1.5 text-caption text-muted-foreground">
          {st === "completed" && typeof c.stars === "number" ? (
            <span className="shrink-0 text-amber-500" aria-label={`${c.stars} of 3 stars earned`}>
              {"★".repeat(c.stars)}
              <span className="opacity-25">{"★".repeat(Math.max(0, 3 - c.stars))}</span>
            </span>
          ) : null}
          <span className="truncate">
            {c.source !== "hand_built" ? "Awaiting faculty review" : "Faculty-reviewed case"}
          </span>
        </span>
      </div>
    </li>
  );
}

/**
 * The "Safety first" disclosure — moved out of the list into a header action
 * that opens a bottom sheet (T33), so the case list stays clean and the first
 * patient is reachable immediately.
 */
export function SafetyFirstSheet() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-caption font-medium text-muted-foreground transition-colors hover:text-foreground active:translate-y-px"
      >
        <Info className="size-3.5" aria-hidden />
        Safety first
      </button>
      <MobileBottomSheet open={open} onOpenChange={setOpen} title="Safety first">
        <ul className="space-y-2 text-small text-muted-foreground">
          <li>Everything here is a <strong className="text-foreground">simulation</strong>. The patient is not real.</li>
          <li>If you&apos;re struggling yourself, this is not the place — reach out to your faculty or a helpline.</li>
          <li>Your sessions are private to you and your faculty, and are used only for your debrief.</li>
        </ul>
      </MobileBottomSheet>
    </>
  );
}
