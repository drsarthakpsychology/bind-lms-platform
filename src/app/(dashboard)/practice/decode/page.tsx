import { IDIOMS } from "@/lib/decode/idioms";
import { DecodeArena } from "./decode-arena";
import { FunnelDrill } from "./funnel-drill";

export const dynamic = "force-dynamic";

/**
 * /practice/decode — the Presenting Complaint Decoder (v5 Part 1).
 * The flagship: "I'm not feeling fresh" could be six things, and the student
 * has to find out which. Idioms of distress, Kirmayer's seven readings.
 * Modes: 1 Decode, 2 Funnel (5 questions), 3 Seven Readings, 4 CFI Practice.
 */
export default function DecodePage() {
  const day = new Date().getDate();
  const set = Array.from({ length: 8 }, (_, i) => IDIOMS[(day + i) % IDIOMS.length]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-eyebrow text-muted-foreground">DECODE</p>
      <h1 className="mt-1 text-h1">What did they actually say?</h1>
      <p className="mt-1 text-small text-muted-foreground">
        A patient says &quot;I&apos;m not feeling fresh.&quot; Six things could be true.
        The word is doing work you can&apos;t see — find out which.
      </p>

      <div className="mt-6">
        <DecodeArena entries={set} />
      </div>

      <div className="mt-10">
        <h2 className="text-base font-semibold">The Funnel — five questions to find the truth</h2>
        <p className="mt-1 text-small text-muted-foreground">
          The core drill. Open → specify → instantiate → quantify → contextualise → attribute.
        </p>
        <div className="mt-3">
          <FunnelDrill entry={set[1]} />
        </div>
      </div>
    </div>
  );
}
