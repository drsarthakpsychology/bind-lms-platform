/**
 * Somatic/idioms + Trauma modules cases.
 */

import { buildCase, type CaseAuthoring } from "../case-builder";

const arjun: CaseAuthoring = {
  id: "som-arjun",
  title: "Arjun, 22 — the dhat distress",
  difficulty: "cooperative",
  traps: ["cultural_idiom", "somatic_mask", "misattributed_diagnosis"],
  moduleId: "mod-somatic",
  name: "Arjun",
  age: 22,
  gender: "male",
  occupation: "university student",
  city: "Varanasi",
  family: "joint family; parents + grandparents",
  register: "Hindi-dominant, ashamed, formal",
  presentation: "Believes he is losing semen (dhat) through urine and 'weakness'. Convinced it has destroyed his brain and will ruin his marriage prospects.",
  chiefComplaint: "I have dhat rog. It has made me weak, my memory is gone, I can't study. My body is empty. Please make it stop.",
  timeline: "A year of distress after a 'wet dream' a friend said was damaging. Now weak, exhausted, avoidant, checking his urine obsessively.",
  treatmentHistory: "Several 'sex specialists' who sold him tonics. One told him his 'nerves are finished'.",
  helpSeekingDelay: "1 year of wrong clinics",
  priorContacts: ["sex specialists", "chemist tonics", "a baba"],
  coreBelief: "I have permanently damaged myself and I am a shame to my family.",
  intermediateBeliefs: ["The loss of dhat is making me mentally ill", "No woman will marry me now"],
  coping: ["check urine", "avoid bathing in shared spaces", "study obsessively to 'prove' he's not weak"],
  openingIdiom: "kamzori",
  redFlags: [{ content: "has thought ending it would end the shame", gate: "asked_about_self_harm_clearly" }],
  variation: {
    mood_today: ["flat", "ashamed", "anxious", "resigned"],
    recent_event: ["a friend joked about his weight", "his parents started marriage talk", "a 'specialist' charged him again", "he saw a health video on YouTube"],
    most_defended_topic: ["the dhat", "his future marriage", "his 'weakened brain'"],
    opening_posture: ["came alone, secretly", "came to get 'proper treatment'"],
    somatic_focus: ["whole body", "head", "legs"],
    trust_start: [2, 3, 3],
    language_mix: ["Hindi-dominant", "Hindi with English words"],
  },
};

const dev: CaseAuthoring = {
  id: "som-dev",
  title: "Dev, 45 — 'it's not me, it's the BP'",
  difficulty: "resistant",
  traps: ["somatic_mask", "cultural_idiom", "over_diagnosis"],
  moduleId: "mod-somatic",
  name: "Dev",
  age: 45,
  gender: "male",
  occupation: "government clerk",
  city: "Jaipur",
  family: "wife + two children; elderly father",
  register: "Hindi-English, jocular, deflects with jokes",
  presentation: "'BP high ho gaya' whenever upset. Family says he's been lashing out. He insists it's blood pressure, wants 'a checkup, not counselling'.",
  chiefComplaint: "Arre, it's my BP. When I get angry my BP goes up. Fix my BP and I'll be fine. Why does everyone keep sending me to you?",
  timeline: "Stress at work (transfer threats), a daughter's marriage pressure, rage episodes the family calls 'BP attacks'. Has taken BP readings at home — mostly normal.",
  treatmentHistory: "Chemist BP tablets he self-prescribes. Never saw a doctor regularly.",
  helpSeekingDelay: "Years of self-medication",
  priorContacts: ["chemist", "family doctor once"],
  coreBelief: "If I stop working, the family starves.",
  intermediateBeliefs: ["Men don't get 'stressed' — that's a woman's thing", "Anger is how a man copes"],
  coping: ["yell at the family", "go to the club", "deny everything"],
  openingIdiom: "BP high ho gaya",
  redFlags: [{ content: "no self-harm ideation; rage only", gate: "asked_about_self_harm_clearly" }],
  variation: {
    mood_today: ["irritated", "brittle-cheerful", "agitated", "flat"],
    recent_event: ["a transfer order", "his daughter's engagement talk", "his father's health", "a junior got promoted over him"],
    most_defended_topic: ["his BP", "the work", "why he won't 'sit and talk'"],
    opening_posture: ["dragged here by wife", "came for a 'BP checkup'"],
    somatic_focus: ["head", "chest", "whole body"],
    trust_start: [2, 2, 3],
    language_mix: ["Hinglish", "Rajasthani-accented Hindi"],
  },
};

export const SOMATIC_CASES = [arjun, dev].map(buildCase);
