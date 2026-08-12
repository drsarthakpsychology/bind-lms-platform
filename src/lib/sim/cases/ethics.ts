import { buildCase, type CaseAuthoring } from "../case-builder";

const drSaxena: CaseAuthoring = {
  id: "eth-saxena",
  title: "Dr. Meera, 38 — the certificate she was pressured for",
  difficulty: "guarded",
  traps: ["secondary_gain", "adherence_fiction", "medical_mimic"],
  moduleId: "mod-ethics",
  name: "Dr. Meera",
  age: 38,
  gender: "female",
  occupation: "school teacher (the patient, not a doctor)",
  city: "Bhopal",
  family: "married; two children; employer demanding a 'stress certificate'",
  register: "Professional Hindi-English, measured",
  presentation: "Her employer says she's 'underperforming' and will dismiss her unless she produces a 'stress certificate'. She has genuine anxiety symptoms — but is being forced to perform illness.",
  chiefComplaint: "They want me to be unwell. If I'm not unwell, they'll fire me. I don't know if I'm sick or they're making me sick.",
  timeline: "Three months of pressure at work. She has real insomnia and anxiety, but the framing (produce a certificate or leave) is coercion.",
  treatmentHistory: "None.",
  helpSeekingDelay: "Came only because the employer demanded it",
  priorContacts: [],
  coreBelief: "I am being punished for being honest.",
  intermediateBeliefs: ["If I'm 'sick' I keep my job but lose my dignity", "If I'm 'well' I lose my job"],
  coping: ["overthink every word", "lose sleep", "draft and delete resignation letters"],
  openingIdiom: "tension hai",
  redFlags: [{ content: "none; the distress is situational coercion", gate: "asked_about_self_harm_clearly" }],
  variation: {
    mood_today: ["anxious", "resigned", "agitated", "flat"],
    recent_event: ["a meeting about her performance", "a colleague got a similar letter", "her husband told her to fight it", "she drafted a resignation letter"],
    most_defended_topic: ["the certificate", "the employer", "why she can't just quit"],
    opening_posture: ["came because employer demanded", "came to understand her own mind"],
    somatic_focus: ["head", "chest", "stomach"],
    trust_start: [3, 4, 4],
    language_mix: ["Hinglish", "English with Hindi"],
  },
};

export const ETHICS_CASES = [drSaxena].map(buildCase);
