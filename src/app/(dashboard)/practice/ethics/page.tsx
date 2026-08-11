import { ETHICS_DILEMMAS, todaysDilemmas } from "@/lib/practice/ethics";
import { DilemmaFlow } from "./dilemmas";
import { QuizCheck } from "@/components/practice/quiz-check";
import type { QuizItem } from "@/lib/quiz/quiz";

/** Quiz-after-ethics (v5 §4.1) — checks, not tests. Every item sourced. */
const ETHICS_QUIZ: QuizItem[] = [
  {
    id: "eq-1",
    type: "would_you_report",
    prompt: "A 14-year-old tells you a relative has been touching her. Would you report?",
    options: [
      "Yes — POCSO mandates reporting to police/Childline, no discretion",
      "Only if the family agrees",
      "Only if she confirms it a second time",
      "No — confidentiality protects it",
    ],
    correct: 0,
    rationale: "POCSO Section 19 imposes a mandatory reporting duty; failure is itself an offence.",
    source: "POCSO 2012, Section 19",
  },
  {
    id: "eq-2",
    type: "standard_vs_common",
    prompt: "A client's advance directive refuses ECT. The family demands it. Which is standard of care?",
    options: [
      "Honour the directive and use the MHA's review mechanism if overriding is considered (standard)",
      "Follow the family's wishes as the 'real' decision-makers (common but wrong)",
      "Ignore the directive as paperwork",
      "Transfer without documenting the conflict",
    ],
    correct: 0,
    isStandardCare: true,
    rationale: "MHA 2017 Section 5 makes advance directives binding; exceptions are narrow and must be invoked.",
    source: "Mental Healthcare Act 2017, Section 5",
  },
  {
    id: "eq-3",
    type: "order_steps",
    prompt: "Order the correct steps when a client discloses imminent risk of harm to another person.",
    options: [
      "Explore the plan → involve authorities/support → document the confidentiality break",
      "Document first → then explore the plan",
      "Tell the family first → then decide",
      "Wait for the session to end naturally",
    ],
    correct: 0,
    rationale: "Assess the immediacy and plan, act on the identified risk, then document the proportionate confidentiality break.",
    source: "RCI code of ethics — limits of confidentiality",
  },
];

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

      <div className="mt-10">
        <h2 className="text-base font-semibold">Check what stuck</h2>
        <p className="mt-1 text-small text-muted-foreground">
          A quick check, not a test. Each item carries its source.
        </p>
        <div className="mt-3">
          <QuizCheck items={ETHICS_QUIZ} />
        </div>
      </div>
    </div>
  );
}
