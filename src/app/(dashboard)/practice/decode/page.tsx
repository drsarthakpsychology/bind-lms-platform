import { IDIOMS } from "@/lib/decode/idioms";
import { DecodeArena } from "./decode-arena";

export const dynamic = "force-dynamic";

/**
 * /practice/decode — the Presenting Complaint Decoder (v5 Part 1).
 * The flagship: "I'm not feeling fresh" could be six things, and the student
 * has to find out which. Idioms of distress, Kirmayer's seven readings.
 */
export default function DecodePage() {
  // Daily deterministic set: 8 idioms per day from the bank.
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
    </div>
  );
}
