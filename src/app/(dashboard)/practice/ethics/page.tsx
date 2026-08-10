import { ETHICS_DILEMMAS, todaysDilemmas } from "@/lib/practice/ethics";
import { DilemmaFlow } from "./dilemmas";

export const dynamic = "force-dynamic";

/**
 * /practice/ethics — Ethics & Law dilemmas (Part 6.5).
 * Consequence-first: commit to an action, then see what the law (MHA 2017,
 * POCSO, RCI scope) and best practice require. The consequence comes first.
 */
export default function EthicsPage() {
  // Deterministic daily set — the day's three dilemmas are stable for everyone.
  const daySeed = new Date().getTime();
  const dilemmas = todaysDilemmas(daySeed, 3);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-eyebrow text-muted-foreground">Ethics &amp; Law</p>
      <h1 className="mt-1 text-h1">The consequence comes first</h1>
      <p className="mt-1 text-small text-muted-foreground">
        {ETHICS_DILEMMAS.length} dilemmas grounded in MHA 2017, POCSO, and RCI scope.
        Decide before you see the outcome — that&apos;s the skill the clinic never gives you time for.
      </p>

      <div className="mt-6">
        <DilemmaFlow dilemmas={dilemmas} />
      </div>
    </div>
  );
}
