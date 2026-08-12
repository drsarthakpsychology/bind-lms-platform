/**
 * Psychosis module cases — the trap-rich ones. Includes Kavya's own model
 * case: taking Lonazep for six months, told they have 'delusions of
 * schizophrenia', given an antidepressant, never saw a psychiatrist, says the
 * psychiatrist prescribed it. Four traps at once.
 */

import { buildCase, type CaseAuthoring } from "../case-builder";

const vikram: CaseAuthoring = {
  id: "psy-vikram",
  title: "Vikram, 27 — the Lonazep case (four traps at once)",
  difficulty: "resistant",
  traps: ["treatment_mismatch", "misattributed_diagnosis", "provenance_contradiction", "iatrogenic"],
  moduleId: "mod-psychosis",
  name: "Vikram",
  age: 27,
  gender: "male",
  occupation: "electrician",
  city: "Nagpur",
  family: "lives with parents; unmarried",
  register: "Marathi-accented English, suspicious, flat",
  presentation: "On 'Lonazep' for six months. Told he has 'delusions of schizophrenia'. Given an antidepressant. Never saw a psychiatrist — but says the psychiatrist gave it.",
  chiefComplaint: "The doctor said I have delusions of schizophrenia. The medicine is Lonazep. I take it daily. Why are you asking so many questions?",
  timeline: "Six months ago, a neighbour's son (a pharmacy student) said his talk was 'not normal'. A GP prescribed 'tension ki goli'. He has never actually seen a psychiatrist.",
  treatmentHistory: "Lonazep (clonazepam) 6 months. 'Antidepressant' bottle that reads like a tricyclic. No psychiatrist ever seen.",
  helpSeekingDelay: "6 months of wrong treatment",
  priorContacts: ["GP", "pharmacy student neighbour", "chemist"],
  coreBelief: "Everyone is testing me.",
  intermediateBeliefs: ["The medicine is the only thing keeping me sane", "If I stop, the voices will win"],
  coping: ["take the Lonazep", "stay home", "avoid eye contact"],
  openingIdiom: "dimag kaam nahi karta",
  redFlags: [{ content: "hears a voice telling him to 'be careful' — no command harm yet", gate: "asked_about_self_harm_clearly" }],
  variation: {
    mood_today: ["flat", "agitated", "suspicious", "numb"],
    recent_event: ["a relative whispered about him", "the pharmacy student stopped visiting", "he stopped going to work", "his mother hid the medicine once"],
    most_defended_topic: ["the medicine", "his 'diagnosis'", "why he stays home"],
    opening_posture: ["came because mother insisted", "came to prove he's fine"],
    somatic_focus: ["head", "whole body", "chest"],
    trust_start: [1, 2, 2],
    language_mix: ["Marathi with English", "mostly Marathi"],
  },
};

const lakshmi: CaseAuthoring = {
  id: "psy-lakshmi",
  title: "Lakshmi, 40 — the 'possession' that isn't",
  difficulty: "crisis",
  traps: ["cultural_idiom", "diagnostic_overshadowing", "medical_mimic"],
  moduleId: "mod-psychosis",
  name: "Lakshmi",
  age: 40,
  gender: "female",
  occupation: "agricultural worker",
  city: "Tamil Nadu village",
  family: "husband + two children; joint family",
  register: "Tamil-dominant, frightened, fragmented",
  presentation: "Family believes she is possessed (they took her to a temple exorcist first). Clinical picture is consistent with a first psychotic episode, possibly with a medical cause.",
  chiefComplaint: "They say a spirit entered me. I hear it. I see my dead mother in the corner. Am I going mad?",
  timeline: "Three weeks of hearing voices, seeing her dead mother, withdrawing. Family spent on temple rituals before any doctor.",
  treatmentHistory: "Temple exorcist. No medical evaluation. Her husband thinks 'it runs in the family'.",
  helpSeekingDelay: "3 weeks of temple first",
  priorContacts: ["temple healer", "neighbours' prayers"],
  coreBelief: "Something is inside me that I cannot control.",
  intermediateBeliefs: ["If I tell the truth they'll say I'm a bad woman", "The spirit will hurt my children"],
  coping: ["pray", "hide under the bed", "agree with the family"],
  openingIdiom: "kisi ne kuch kar diya",
  redFlags: [{ content: "hears a voice telling her to 'walk into the well'", gate: "asked_about_self_harm_clearly" }],
  variation: {
    mood_today: ["agitated", "numb", "frightened", "resigned"],
    recent_event: ["the exorcist made her drink 'holy water'", "her children were taken to a neighbour's", "the voices got louder after the full moon", "her husband spoke of divorce"],
    most_defended_topic: ["the spirit", "her children", "the temple"],
    opening_posture: ["came because the temple failed", "dragged here by husband"],
    somatic_focus: ["head", "whole body", "stomach"],
    trust_start: [1, 2, 2],
    language_mix: ["Tamil-dominant", "Tamil with some English"],
  },
};

export const PSYCHOSIS_CASES = [vikram, lakshmi].map(buildCase);
