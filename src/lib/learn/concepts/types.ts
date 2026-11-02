/**
 * The concept bank behind Coach. One concept = one idea a student should be
 * able to name from its meaning (e.g. "loss of pleasure" → anhedonia).
 * Questions are generated from concepts, so the bank grows by adding rows.
 */
export type Domain =
  | "psychopathology"
  | "disorders"
  | "neuroscience"
  | "pharmacology"
  | "therapy"
  | "counselling"
  | "assessment"
  | "ethics"
  | "law";

export type Concept = {
  id: string;
  domain: Domain;
  term: string;
  /** Plain words. Also used as the "meaning" in questions. */
  student: string;
  /** Clinical / medical framing. */
  clinician: string;
  /** Shared tags make concepts "similar" (used for suggestions and distractors). */
  tags: string[];
  /** Optional example or memory hook shown on the teach card. */
  hook?: string;
};

export const DOMAINS: { id: Domain; title: string; icon: string }[] = [
  { id: "psychopathology", title: "Signs & symptoms", icon: "👁" },
  { id: "disorders", title: "Clinical disorders", icon: "🩺" },
  { id: "neuroscience", title: "Neuroscience", icon: "🧠" },
  { id: "pharmacology", title: "Psychopharmacology", icon: "💊" },
  { id: "therapy", title: "Therapies", icon: "🛋" },
  { id: "counselling", title: "Counselling skills", icon: "💬" },
  { id: "assessment", title: "Assessment & tests", icon: "📋" },
  { id: "ethics", title: "Ethics & morals", icon: "⚖" },
  { id: "law", title: "Indian mental health law", icon: "🏛" },
];

/** Compact row builder: c(id, domain, term, student, clinician, tags, hook?) */
export const c = (id: string, domain: Domain, term: string, student: string, clinician: string, tags: string[], hook?: string): Concept => ({
  id,
  domain,
  term,
  student,
  clinician,
  tags,
  ...(hook ? { hook } : {}),
});
