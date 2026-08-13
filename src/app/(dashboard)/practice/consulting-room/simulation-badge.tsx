/**
 * Persistent SIMULATION badge — visible in the consulting room (and in voice
 * mode) so the student is never confused about what is real and what is not.
 */
export function SimulationBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-border bg-secondary px-3 py-1 text-caption font-semibold uppercase tracking-wide">
      <span className="relative flex size-2" aria-hidden>
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
        <span className="relative inline-flex size-2 rounded-full bg-primary" />
      </span>
      Simulation
    </span>
  );
}
