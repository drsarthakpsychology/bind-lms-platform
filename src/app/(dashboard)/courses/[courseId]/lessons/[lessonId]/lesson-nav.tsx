"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useUiV2 } from "@/components/learn-v2/ui-v2";

/**
 * Persistent Previous / Next lesson controls, with left/right arrow-key
 * navigation (ignored while the video element has focus so the player's own
 * seek/volume keys keep working). Previous is disabled, never hidden, on the
 * first lesson. Next always goes somewhere: the next lesson, or "Finish course"
 * back to the course page on the last lesson.
 */
export function LessonNav({
  prevHref,
  nextHref,
  nextLabel,
}: {
  prevHref: string | null;
  nextHref: string;
  nextLabel: string;
}) {
  const router = useRouter();
  const v2 = useUiV2();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      // Ignore when the <video> is focused (its own seek/volume keys win).
      if (e.target instanceof HTMLVideoElement) return;

      if (e.key === "ArrowLeft" && prevHref) {
        e.preventDefault();
        router.push(prevHref);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        router.push(nextHref);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prevHref, nextHref, router]);

  // New design: Next is the one lime button (wide, in thumb reach); Previous is a quiet square beside it.
  if (v2) {
    const prev = "inline-flex size-[3.25rem] shrink-0 items-center justify-center rounded-[var(--ds-radius)] border-[1.5px] border-[var(--ds-card-line)] outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] focus-visible:ring-2 focus-visible:ring-ring lg:w-auto lg:gap-2 lg:px-5";
    return (
      <div className="flex w-full min-w-0 items-stretch gap-3 lg:justify-between">
        {prevHref ? (
          <Link href={prevHref} aria-label="Previous lecture" className={prev + " hover:border-foreground"}>
            <ArrowLeft className="size-5" aria-hidden />
            <span className="hidden type-body font-semibold lg:inline">Previous</span>
          </Link>
        ) : (
          <span aria-hidden className={prev + " text-muted-foreground opacity-50"}>
            <ArrowLeft className="size-5" />
            <span className="hidden type-body font-semibold lg:inline">Previous</span>
          </span>
        )}
        <Link
          href={nextHref}
          prefetch
          className="inline-flex min-h-[3.25rem] min-w-0 flex-1 items-center justify-center gap-2 rounded-[var(--ds-radius)] border-2 border-foreground bg-primary px-5 text-center type-body font-bold text-primary-foreground hard-shadow-sm outline-none transition-[transform,box-shadow] duration-[var(--ds-press)] ease-[var(--ds-ease)] hover:-translate-y-0.5 hover:hard-shadow-md focus-visible:ring-[3px] focus-visible:ring-ring/60 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none motion-reduce:hover:translate-y-0 lg:min-w-60 lg:flex-none"
        >
          <span className="min-w-0 [overflow-wrap:anywhere]">{nextLabel}</span>
          <ArrowRight className="size-5 shrink-0" aria-hidden />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex w-full items-center justify-between gap-3">
      {prevHref ? (
        <Button asChild variant="outline" size="lg">
          <Link href={prevHref}>
            <ArrowLeft className="size-4" aria-hidden />
            Previous
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="lg" disabled aria-disabled="true">
          <ArrowLeft className="size-4" aria-hidden />
          Previous
        </Button>
      )}

      <Button asChild variant="secondary" size="lg">
        <Link href={nextHref} prefetch>
          {nextLabel}
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </Button>
    </div>
  );
}
