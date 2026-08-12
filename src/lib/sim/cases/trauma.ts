import { buildCase, type CaseAuthoring } from "../case-builder";

const priya: CaseAuthoring = {
  id: "trm-priya",
  title: "Priya, 30 — the accident she doesn't remember",
  difficulty: "cooperative",
  traps: ["diagnostic_overshadowing", "late_risk_reveal", "somatic_mask"],
  moduleId: "mod-trauma",
  name: "Priya",
  age: 30,
  gender: "female",
  occupation: "teacher",
  city: "Indore",
  family: "lives with husband; one child",
  register: "Calm English, dissociates mid-sentence",
  presentation: "A car accident 8 months ago (she was a passenger; the driver died). She 'remembers nothing' of it. Since then: nightmares she can't explain, avoidance of cars, numbness.",
  chiefComplaint: "I'm fine now. The body healed. Everyone says I should be over it. But I wake up screaming and don't know why.",
  timeline: "Post-accident: dissociative amnesia for the event, nightmares, hypervigilance, irritability at home, avoiding the accident road.",
  treatmentHistory: "Physiotherapy for a broken wrist. No mental health contact.",
  helpSeekingDelay: "8 months (the body healed first)",
  priorContacts: ["orthopaedic surgeon", "physiotherapist"],
  coreBelief: "If I remember the crash, I'll fall apart.",
  intermediateBeliefs: ["Being traumatised means I'm weak", "My husband is tired of my 'moods'"],
  coping: ["not think about it", "drive only on side roads", "sleep with the light on"],
  openingIdiom: "dimag kaam nahi karta",
  redFlags: [{ content: "recurrent thought of 'joining' the driver — no plan", gate: "asked_about_self_harm_clearly" }],
  variation: {
    mood_today: ["numb", "flat", "anxious", "brittle-cheerful"],
    recent_event: ["a car honked loudly", "her son asked about the accident", "the accident road was reopened", "her husband said 'enough now'"],
    most_defended_topic: ["the accident", "the driver who died", "why she can't sleep"],
    opening_posture: ["came after husband insisted", "came to 'prove she's fine'"],
    somatic_focus: ["head", "chest", "whole body"],
    trust_start: [3, 4, 4],
    language_mix: ["mostly English", "English with Hindi"],
  },
};

export const TRAUMA_CASES = [priya].map(buildCase);
