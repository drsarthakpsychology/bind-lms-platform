/**
 * CFI Practice (v5 Part 1, Mode 4) — the DSM-5 Cultural Formulation Interview,
 * a real 16-question instrument for eliciting a patient's explanatory model.
 *
 * Students practise it against a patient with a strong cultural attribution
 * (nazar, possession, semen loss, karma). Scored on whether they elicit the
 * explanatory model WITHOUT dismissing it. The failure mode to catch:
 * correcting the patient's belief instead of understanding it.
 */

export interface CfiScenario {
  id: string;
  idiom: string;
  patientBelief: string;
  setting: string;
}

export const CFI_SCENARIOS: CfiScenario[] = [
  {
    id: "cfi-nazar",
    idiom: "nazar lag gayi",
    patientBelief: "Someone who envied her child's success put the evil eye on him.",
    setting: "A mother brings her 7-year-old who has been withdrawn and not sleeping since a school achievement.",
  },
  {
    id: "cfi-possession",
    idiom: "kisi ne kuch kar diya",
    patientBelief: "A spirit entered her after a family quarrel; only the temple can remove it.",
    setting: "A woman in a restrictive household, episodes of dissociation after conflict.",
  },
  {
    id: "cfi-dhat",
    idiom: "dhat rog",
    patientBelief: "He is losing essential fluid and it is destroying his body and mind.",
    setting: "A 21-year-old student with weakness, memory complaints, and marriage anxiety.",
  },
  {
    id: "cfi-karma",
    idiom: "karma / graha dosh",
    patientBelief: "This illness is his karma or a planetary affliction; treatment must include astrology.",
    setting: "A 55-year-old with depression whose family consults astrologers.",
  },
];

/** The six CFI domains the student must elicit (and NOT dismiss). */
export const CFI_DOMAINS = [
  "perceived cause",
  "meaning of the condition",
  "expected course",
  "expected treatment",
  "what they fear most",
  "who in their world understands it",
];

export interface CfiResponse {
  question: string;
  domain: string | null;
  dismissive: boolean;
}

/** Detect a dismissive/correcting response (the failure mode). */
export function isDismissive(q: string): boolean {
  const t = q.toLowerCase();
  return /(that|it|this)['']?s not (true|real|a thing|possession|that)|no (it|that)['']?s not|there['']?s no such thing|that['']?s (just|only)|you['']?re wrong|it['']?s all in your head|superstiti|don['']?t believe in|stop (seeing|going)|you should (stop|not)/i.test(t);
}

/** Detect an eliciting response (asks about the belief, doesn't correct it). */
export function isEliciting(q: string): boolean {
  const t = q.toLowerCase();
  return /what do you (think|believe)|how (do|does|has|did)|tell me (more|about)|what has (helped|worked)|in your (family|community|village)|what do you fear|what would (help|helpful)|why do you think|what does it mean|what do they (say|believe)/i.test(t);
}

/** Score a CFI practice question: eliciting earns, dismissive loses. */
export function scoreCfiQuestion(q: string): { eliciting: boolean; dismissive: boolean } {
  return { eliciting: isEliciting(q), dismissive: isDismissive(q) };
}
