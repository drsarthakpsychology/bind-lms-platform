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
}

const DIFFICULTY_LABEL: Record<string, string> = {
  cooperative: "Cooperative",
  guarded: "Guarded",
  resistant: "Resistant",
  crisis: "Crisis",
};

/**
 * Case picker — list of cases with difficulty, summary, and a "start session"
 * action. Starts the session via the API, then navigates to /session/[id].
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

  return (
    <div className="space-y-4">
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
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {cases.map((c) => (
          <li key={c.title} className="flex flex-col rounded-md border-2 border-border bg-card p-4 hard-shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="text-eyebrow text-muted-foreground">
                {DIFFICULTY_LABEL[c.difficulty] ?? c.difficulty}
              </span>
              {c.source === "hand_built" ? (
                <span className="rounded-full border border-border px-2 py-0.5 text-caption text-muted-foreground">
                  Reviewed
                </span>
              ) : (
                <span className="rounded-full border border-amber-400 px-2 py-0.5 text-caption text-amber-700">
                  Awaiting review
                </span>
              )}
            </div>
            <h2 className="mt-2 text-base font-semibold">{c.title}</h2>
            <p className="mt-1 line-clamp-3 text-small text-muted-foreground">{c.summary}</p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => start(c)}
                disabled={starting === c.id}
                className="flex-1 rounded-md border-2 border-border bg-primary px-3 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none disabled:opacity-60"
              >
                {starting === c.id ? "Starting…" : "Start session"}
              </button>
              <Link
                href={`/practice/consulting-room/session/${c.id}`}
                className="rounded-md border-2 border-border px-3 py-2 text-small font-medium text-muted-foreground transition-transform active:translate-y-px"
              >
                Preview
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
