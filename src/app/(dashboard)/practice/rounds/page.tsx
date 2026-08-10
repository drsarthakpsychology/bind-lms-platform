import { RoundsDeck } from "./rounds-deck";

export const dynamic = "force-dynamic";

/**
 * /practice/rounds — spaced-repetition cards (Part 6.5).
 * Daily queue capped at 25. "You're done" is shown and meant.
 */
export default function RoundsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-eyebrow text-muted-foreground">Rounds</p>
      <h1 className="mt-1 text-h1">Today&apos;s cards</h1>
      <p className="mt-1 text-small text-muted-foreground">
        Capped at 25 a day. A 200-card backlog is how people quit — you&apos;re done when the
        queue is empty.
      </p>

      <div className="mt-6">
        <RoundsDeck />
      </div>
    </div>
  );
}
