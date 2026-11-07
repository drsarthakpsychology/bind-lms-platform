import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Strengths and weak spots. Until the shared strengths helper lands, this
 * points to the map, which has the full picture.
 */
export function StrengthsPanel() {
  return (
    <section aria-labelledby="sw" className="space-y-3">
      <h2 id="sw" className="text-h2">
        Strengths and weak spots
      </h2>
      <Link href="/study/map" className="inline-flex min-h-11 items-center gap-1.5 rounded-[10px] border-2 border-foreground bg-card px-4 text-sm font-bold transition-transform hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
        See your map <ArrowRight className="size-4" aria-hidden />
      </Link>
    </section>
  );
}
