"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { haptic } from "@/lib/haptics";

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

const STATE_STYLE: Record<NonNullable<CaseCard["state"]>, string> = {
  not_started: "bg-secondary text-muted-foreground",
  in_progress: "bg-primary text-primary-foreground",
  completed: "bg-green-100 text-green-800",
};

/**
 * Case picker — grouped by difficulty with headers, each card led by the
 * patient's OWN words (the hook) with the clinical line secondary. The
 * diagnosis never appears on the card; it lives behind Preview (faculty
 * review). Per-card session state chips replace the meaningless "Reviewed"
 * chip. One tap target per card: the whole card starts the session; the
 * Preview link is explicitly labelled.
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

  const grouped = DIFFICULTY_ORDER
    .map((d) => ({
      difficulty: d,
      label: DIFFICULTY_LABEL[d],
      items: cases.filter((c) => c.difficulty === d),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="space-y-8">
      {error ? (
        <div className="rounded-md border-2 border-red-400 bg-red-50 p-3 text-small text-red-700" role="alert">
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

      {grouped.map((g) => (
        <section key={g.difficulty} aria-label={`${g.label} patients`}>
          <div className="mb-3 flex items-center gap-3">
            <h2 className="text-eyebrow text-muted-foreground">{g.label}</h2>
            <span className="h-px flex-1 bg-border" aria-hidden />
            <span className="text-caption text-muted-foreground">{g.items.length} patient{g.items.length === 1 ? "" : "s"}</span>
          </div>
          <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {g.items.map((c) => {
              const st = c.state ?? "not_started";
              const busy = starting === c.id;
              return (
                <li key={c.id || c.title} className="flex flex-col rounded-md border-2 border-border bg-card p-4 hard-shadow-sm transition-[transform,box-shadow] hover:-translate-y-0.5 hover:hard-shadow-md active:translate-y-px">
                  {/* state chip — real meaning, replaces the dead "Reviewed" chip */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-caption font-medium ${STATE_STYLE[st]}`}>
                      {STATE_LABEL[st]}
                      {st === "completed" && typeof c.score === "number"
                        ? ` · ${Math.round(c.score * 10)}/10`
                        : ""}
                    </span>
                    {c.source !== "hand_built" ? (
                      <span className="rounded-full border border-amber-400 px-2 py-0.5 text-caption text-amber-700">
                        Awaiting review
                      </span>
                    ) : null}
                  </div>
                  {/* the hook — the patient's own words */}
                  <blockquote className="mt-3 border-l-2 border-primary pl-3">
                    <p className="text-small font-medium">&ldquo;{c.hook ?? c.summary}&rdquo;</p>
                  </blockquote>
                  {/* the clinical line, kept secondary and non-diagnostic */}
                  <p className="mt-2 line-clamp-2 text-caption text-muted-foreground">{c.summary}</p>
                  <div className="mt-auto flex gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => start(c)}
                      disabled={busy || starting !== null}
                      className="flex-1 rounded-md border-2 border-border bg-primary px-3 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none disabled:opacity-60"
                    >
                      {busy ? "Starting…" : st === "in_progress" ? "Resume session" : "Start session"}
                    </button>
                    {c.id ? (
                      <Link
                        href={`/practice/consulting-room/session/${c.id}`}
                        aria-label={`Preview ${c.title} (faculty review)`}
                        className="rounded-md border-2 border-border px-3 py-2 text-small font-medium text-muted-foreground transition-transform active:translate-y-px"
                      >
                        Preview
                      </Link>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}