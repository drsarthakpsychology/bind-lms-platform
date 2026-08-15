"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MoreHorizontal } from "lucide-react";
import { StatusPill } from "@/components/mobile/status-pill";
import { useOffline } from "@/lib/hooks/use-offline";

/**
 * The compact patient header. One back affordance, the patient's name +
 * difficulty, a quiet timer, and a "more" affordance for the secondary
 * actions (notes / hint / finish). The conversation below gets the rest of
 * the screen. The student never sees which engine is driving the patient —
 * only the genuine Offline signal when the connection drops.
 */
export function SimulationHeader({
  patientName,
  patientAge,
  difficulty,
  seconds,
  onMore,
  notesIndicator = false,
  aiFallback = false,
}: {
  patientName: string;
  patientAge?: number;
  difficulty: string;
  seconds: number;
  onMore: () => void;
  /** Peach dot on the "more" button when notes are non-empty. */
  notesIndicator?: boolean;
  /** Dev-only: the scripted fallback fired on the last turn (amber pill). */
  aiFallback?: boolean;
}) {
  const router = useRouter();
  const { offline } = useOffline();
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const nearEnd = seconds >= 11 * 60;

  return (
    <header
      className="sticky top-0 z-20 flex items-center gap-2 border-b border-border bg-card px-2 py-2"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <button
        type="button"
        onClick={() => router.push("/practice/consulting-room")}
        aria-label="Back to cases"
        className="flex size-10 shrink-0 items-center justify-center rounded-md text-foreground transition-transform duration-fast ease-snappy active:translate-y-px"
      >
        <ArrowLeft className="size-5" aria-hidden />
      </button>

      {/* Patient identity */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-small font-semibold text-foreground">
            {patientName}
            {patientAge ? `, ${patientAge}` : ""}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="truncate text-caption capitalize text-muted-foreground">{difficulty}</span>
          {offline ? <StatusPill tone="warning" label="Offline" /> : null}
          {/* Dev-only observability: never show the AI-fallback reason to
              students in production (Phase 1). */}
          {process.env.NODE_ENV !== "production" && aiFallback ? (
            <StatusPill tone="scripted" label="AI fallback" />
          ) : null}
        </div>
      </div>

      {/* Timer — quiet, secondary; turns amber near the end */}
      <span
        className={`shrink-0 font-mono text-caption tabular-nums ${nearEnd ? "text-status-alert-fg" : "text-muted-foreground"}`}
        aria-live="polite"
      >
        {mm}:{ss}
      </span>

      <button
        type="button"
        onClick={onMore}
        aria-label="More options"
        className="relative flex size-10 shrink-0 items-center justify-center rounded-md text-foreground transition-transform duration-fast ease-snappy active:translate-y-px"
      >
        <MoreHorizontal className="size-5" aria-hidden />
        {notesIndicator ? (
          <span
            aria-hidden
            className="absolute right-1 top-1 size-2 rounded-full bg-primary ring-2 ring-card"
          />
        ) : null}
      </button>
    </header>
  );
}
