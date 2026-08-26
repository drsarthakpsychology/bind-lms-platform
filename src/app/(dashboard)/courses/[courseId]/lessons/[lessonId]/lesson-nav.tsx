"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Persistent Previous / Next lesson controls, with left/right arrow-key
 * navigation (ignored while the video element has focus so the player's own
 * seek/volume keys keep working). Previous is disabled — never hidden — on the
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
        <Link href={nextHref}>
          {nextLabel}
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </Button>
    </div>
  );
}
