import { IDIOMS, type IdiomEntry, type IdiomMeaning } from "@/lib/decode/idioms";
import { createClient } from "@/lib/supabase/server";
import { DecodeArena } from "./decode-arena";
import { FunnelDrill } from "./funnel-drill";
import { SevenReadings } from "./seven-readings";
import { CfiDrill } from "./cfi-drill";
import { QuizCheck } from "@/components/practice/quiz-check";
import type { QuizItem } from "@/lib/quiz/quiz";

export const dynamic = "force-dynamic";

/** Map an approved idioms row to the IdiomEntry the drills consume. */
function rowToIdiom(row: {
  phrase: string;
  register: unknown;
  possible_meanings: unknown;
  disambiguators: unknown;
  trap: string;
  sources: unknown;
}): IdiomEntry | null {
  const phrase = row.phrase;
  if (!phrase) return null;
  const meanings = (Array.isArray(row.possible_meanings) ? row.possible_meanings : []) as IdiomMeaning[];
  const readings = [...new Set(meanings.map((m) => m.reading).filter(Boolean))] as IdiomEntry["readings"];
  return {
    id: phrase,
    phrase,
    register: (Array.isArray(row.register) ? row.register : []) as string[],
    readings,
    possible_meanings: meanings,
    disambiguating_questions: (Array.isArray(row.disambiguators) ? row.disambiguators : []) as string[],
    trap: row.trap ?? "",
    sources: (Array.isArray(row.sources) ? row.sources : []) as string[],
  };
}

/** Quiz-after-decode (v5 §4.1) — checks, not tests. Every item sourced. */
const DECODE_QUIZ: QuizItem[] = [
  {
    id: "dq-1",
    type: "best_response",
    prompt: "A patient says 'I'm not feeling fresh.' What is the single highest-yield next question?",
    options: [
      "Walk me through yesterday morning — from waking up to leaving the house.",
      "Are you feeling sad or stressed?",
      "Have you been diagnosed with depression before?",
      "Let me tell you what this usually means.",
    ],
    correct: 0,
    rationale: "Instantiate, don't guess: 'not feeling fresh' carries constipation, non-restorative sleep, anaemia, and low mood — the description disambiguates.",
    source: "Nichter, Idioms of Distress (1981); DSM-5 CFI",
  },
  {
    id: "dq-2",
    type: "spot_the_error",
    prompt: "Which line is the error in this exchange?",
    excerpt: "Patient: 'Doctor, I have ghabrahat since Diwali.'\nStudent: 'That's anxiety. When did you first notice it?'\nPatient: 'My heart pounds and I can't sit still.'",
    options: [
      "Asking when it started",
      "Labeling it 'anxiety' before exploring the physical picture",
      "Noting the onset event",
      "Listening to the symptom description",
    ],
    correct: 1,
    rationale: "Ghabrahat can be panic, thyroid, or withdrawal — labelling it anxiety closes the differential the idiom was opening.",
    source: "Kirmayer & Young (1998), Culture and Psychiatry",
  },
  {
    id: "dq-3",
    type: "standard_vs_common",
    prompt: "A 19-year-old man reports 'kamzori' and, on gentle questioning, distress about nocturnal emission. Which is the standard-of-care approach?",
    options: [
      "Reassure that semen loss is harmless and address the distress directly (standard)",
      "Order tests to prove semen is being lost (common but wrong)",
      "Tell him it's a sign of serious disease to motivate treatment",
      "Dismiss the concern as purely psychological",
    ],
    correct: 0,
    isStandardCare: true,
    rationale: "Dhat distress is treated by psychoeducation about normal physiology plus the psychological work — not collusion with the fear, not dismissal.",
    source: "Sumathipala et al. (2004), Dhat syndrome; DSM-5 cultural concepts",
  },
];

/**
 * /practice/decode — the Presenting Complaint Decoder (v5 Part 1).
 * The flagship: "I'm not feeling fresh" could be six things, and the student
 * has to find out which. Idioms of distress, Kirmayer's seven readings.
 * Modes: 1 Decode, 2 Funnel (5 questions), 3 Seven Readings, 4 CFI Practice.
 */
export default async function DecodePage() {
  const day = new Date().getDate();
  // Content wiring: merge faculty-approved idioms from the DB with the static
  // baseline. New approvals appear; content is never reduced. Fallback to the
  // static set when the DB is empty or the fetch fails.
  const supabase = await createClient();
  const { data: dbRows } = await supabase
    .from("idioms")
    .select("phrase, register, possible_meanings, disambiguators, trap, sources")
    .eq("approved", true);
  const dbIdioms = (dbRows ?? []).map(rowToIdiom).filter((x): x is IdiomEntry => Boolean(x));
  const byPhrase = new Map<string, IdiomEntry>(IDIOMS.map((i) => [i.phrase, i]));
  for (const db of dbIdioms) byPhrase.set(db.phrase, db); // DB wins for existing phrases, adds new ones
  const allIdioms = [...byPhrase.values()];

  const set = Array.from({ length: 8 }, (_, i) => allIdioms[(day + i) % allIdioms.length]);

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

      <div className="mt-10">
        <h2 className="text-base font-semibold">Seven Readings — Kirmayer &amp; Young applied</h2>
        <p className="mt-1 text-small text-muted-foreground">
          A somatic complaint can mean a disease, an intrapsychic conflict, psychopathology,
          a cultural idiom, a metaphor, social positioning, or protest. Assign them all.
        </p>
        <div className="mt-3">
          <SevenReadings entry={set[2]} />
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-base font-semibold">CFI Practice — the Cultural Formulation Interview</h2>
        <p className="mt-1 text-small text-muted-foreground">
          Elicit the patient&apos;s explanatory model without dismissing it. The failure mode is
          correcting the belief instead of understanding it.
        </p>
        <div className="mt-3">
          <CfiDrill />
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-base font-semibold">Check what stuck</h2>
        <p className="mt-1 text-small text-muted-foreground">
          A quick check, not a test. Each item carries its source.
        </p>
        <div className="mt-3">
          <QuizCheck items={DECODE_QUIZ} />
        </div>
      </div>
    </div>
  );
}
