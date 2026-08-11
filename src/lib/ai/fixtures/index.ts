/**
 * Deterministic AI fixtures — used when AI_ENABLED=false OR when no provider
 * is available. Every AI feature has a fixture path so the whole app works
 * with zero network calls and zero keys (Part 0.4: build the fixture path
 * first, always).
 *
 * These are NOT training data and contain no student data. They are canned,
 * safe, in-character responses for the simulated-patient and scoring flows so
 * the UI and logic can be tested offline.
 */

import type { Workload } from "../guards";

export interface FixtureTurn {
  patient: string;
  is_terminal?: boolean;
}

/** In-character patient replies by case archetype. */
const PATIENT_REPLIES: Record<string, FixtureTurn[]> = {
  cooperative: [
    { patient: "I don't know. It just… everything feels heavy lately. Even getting up feels like a lot." },
    { patient: "It's been about two, maybe three months. I thought it was the heat, or that I wasn't sleeping well." },
    { patient: "No, I haven't talked to anyone about it. My wife keeps asking, but I tell her it's nothing." },
    { patient: "Sometimes I think it would be easier to just… not be here. But I wouldn't do anything, I promise." },
    { patient: "The doctor at the clinic gave me some tonic. It didn't really help. I stopped going." },
  ],
  guarded: [
    { patient: "I'm fine. Everyone keeps asking, so I'm telling you the same thing." },
    { patient: "I don't see what this has to do with anything. I just came because my family made me." },
    { patient: "…I don't want to talk about that." },
    { patient: "If I tell you, will you tell them? Because I can't have them knowing." },
    { patient: "Fine. But this stays between us." },
  ],
  resistant: [
    { patient: "You people are all the same. You listen, you nod, and nothing changes." },
    { patient: "I already told you. Why are you asking again?" },
    { patient: "I'm done talking." },
    { patient: "…" },
    { patient: "Leave me alone. This was a waste of my time." },
  ],
  crisis: [
    { patient: "I have a plan. I've had it for a while. I just haven't done it yet." },
    { patient: "I know exactly how I'd do it. The details are all worked out." },
    { patient: "I feel like a burden to everyone. They'd be better off." },
    { patient: "I've been giving my things away. I don't know why I'm telling you this." },
  ],
};

/** A deterministic reply for a workload with no provider. */
export function fixtureReply(workload: Workload, archetype = "cooperative", turn = 0): FixtureTurn {
  if (workload === "debrief_scoring") {
    return { patient: "scoring disabled in fixture mode" };
  }
  if (workload === "journal_support") {
    return { patient: "That sounds like it matters. What do you make of it?" };
  }
  const bank = PATIENT_REPLIES[archetype] ?? PATIENT_REPLIES.cooperative;
  return bank[turn % bank.length];
}

/** Deterministic rubric for the debrief in fixture mode. */
export const FIXTURE_DEBRIEF = {
  score: 2.5,
  open_closed_ratio: 0.6,
  leading_questions: 1,
  double_barrelled: 0,
  reflective_statements: 2,
  premature_reassurance: 1,
  domain_coverage: 0.7,
  risk_timing: "late",
  disclosure_unlock_rate: 0.5,
  idiom_decoding: true,
  quotes: [
    { quote: "patient: I'm fine.", better: "I hear you're fine. What's it been like since the last time we spoke?" },
    { quote: "student: You're not going to hurt yourself, right?", better: "Have you had thoughts of ending your life?" },
  ],
  missed_disclosures: ["the patient would have told you about the debt if you'd asked openly about home"],
};
