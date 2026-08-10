/**
 * Bipolar & Substance module cases.
 */

import { buildCase, type CaseAuthoring } from "../case-builder";

const neha: CaseAuthoring = {
  id: "bip-neha",
  title: "Neha, 26 — the 'best three months ever' that ended badly",
  difficulty: "cooperative",
  traps: ["iatrogenic", "under_diagnosis", "treatment_mismatch"],
  moduleId: "mod-bipolar",
  name: "Neha",
  age: 26,
  gender: "female",
  occupation: "designer",
  city: "Hyderabad",
  family: "lives alone; parents in Vizag",
  register: "Creative English, rapid, vivid",
  presentation: "Started on an SSRI for 'low mood' three months ago. She felt 'amazing, unstoppable, sleeping 3 hours'. Now crashed, ashamed, and the family is terrified.",
  chiefComplaint: "Three months ago I was a genius. Now I can't get out of bed. The tablet made me fly and then it dropped me.",
  timeline: "Depression last year → SSRI started → 3 months of hypomania (sold her bike, maxed cards, 'invented' things) → sudden crash into severe depression.",
  treatmentHistory: "SSRI (escitalopram) for depression. No mood stabiliser ever. No one asked about the high phase.",
  helpSeekingDelay: "The hypomania was never reported as a problem — it was 'a good phase'",
  priorContacts: ["GP for depression", "a friend who is a psychology student"],
  coreBelief: "I'm either brilliant or worthless — nothing between.",
  intermediateBeliefs: ["The tablet fixed me, now I broke again", "If I tell them about the bike and the cards they'll lock me up"],
  coping: ["swing between grand plans and hiding", "spend when high", "shut the world out when low"],
  openingIdiom: "mind kharab hai",
  redFlags: [{ content: "during the crash, wishes the 'high' had never ended — no plan", gate: "asked_about_self_harm_clearly" }],
  variation: {
    mood_today: ["flat", "numb", "ashamed", "agitated"],
    recent_event: ["the credit card statement arrived", "a client praised old work", "her mother called asking about the bike", "she found a half-finished 'invention'"],
    most_defended_topic: ["the hypomanic phase", "money", "why she stopped the tablet"],
    opening_posture: ["came because family insisted", "came to 'fix the tablet'"],
    somatic_focus: ["head", "whole body", "chest"],
    trust_start: [3, 4, 4],
    language_mix: ["mostly English", "English with Telugu words"],
  },
};

export const BIPOLAR_CASES = [neha].map(buildCase);
