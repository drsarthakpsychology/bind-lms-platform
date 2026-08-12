import { buildCase, type CaseAuthoring } from "../case-builder";

const samir: CaseAuthoring = {
  id: "sub-samir",
  title: "Samir, 32 — the cannabis that stopped being fun",
  difficulty: "resistant",
  traps: ["substance_induced", "misattributed_diagnosis", "diagnostic_overshadowing"],
  moduleId: "mod-substance",
  name: "Samir",
  age: 32,
  gender: "male",
  occupation: "café owner",
  city: "Goa",
  family: "unmarried; runs a café; parents in Delhi",
  register: "Laid-back English, deflects with humour",
  presentation: "Daily cannabis for years, escalating to strong strains. Now paranoid that customers 'are talking about him'. A friend says he's becoming 'schizophrenic'.",
  chiefComplaint: "The café is doing fine. It's these customers, man, they whisper. My friend says I'm going mad. I just need something to calm me down.",
  timeline: "Six years of cannabis. Last year moved to high-THC strains. Three months of paranoia, hearing his name in noise, poor sleep, avoiding the café floor.",
  treatmentHistory: "None for mental health. Uses benzos 'borrowed' from a friend to sleep.",
  helpSeekingDelay: "3 months after paranoia started",
  priorContacts: ["friend's 'diagnosis'", "chemist", "borrowed benzos"],
  coreBelief: "People can see I'm not right.",
  intermediateBeliefs: ["The weed is the only thing that stops the noise", "If I stop, it gets worse"],
  coping: ["smoke more", "stay in the back of the café", "avoid eye contact"],
  openingIdiom: "tension hai",
  redFlags: [{ content: "has thought about 'sorting out' a customer he thinks is laughing at him", gate: "asked_about_self_harm_clearly" }],
  variation: {
    mood_today: ["suspicious", "agitated", "flat", "brittle-cheerful"],
    recent_event: ["a customer looked at him twice", "he ran out of weed", "a friend confronted him", "the café got a bad review"],
    most_defended_topic: ["the weed", "the café", "why he avoids the floor"],
    opening_posture: ["came because a friend pushed him", "came to 'prove he's fine'"],
    somatic_focus: ["chest", "head", "stomach"],
    trust_start: [2, 2, 3],
    language_mix: ["mostly English", "English with Hindi"],
  },
};

export const SUBSTANCE_CASES = [samir].map(buildCase);
