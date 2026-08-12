/**
 * Child & Adolescent + Ethics modules cases.
 */

import { buildCase, type CaseAuthoring } from "../case-builder";

const kavita: CaseAuthoring = {
  id: "ado-kavita",
  title: "Kavita, 15 — the daughter the mother speaks for",
  difficulty: "guarded",
  traps: ["informant_conflict", "under_diagnosis", "diagnostic_overshadowing"],
  moduleId: "mod-adolescent",
  name: "Kavita",
  age: 15,
  gender: "female",
  occupation: "school student, class 10",
  city: "Patna",
  family: "lives with parents; mother dominates; one younger brother",
  register: "Quiet Hindi-English, looks at mother before answering",
  presentation: "Mother speaks for her ('she's become useless, on her phone'). Kavita is withdrawn, failing, has stopped eating lunch at school. The mother is the informant and the problem.",
  chiefComplaint: "(looks at mother, then) I'm fine. It's just… school is hard now.",
  timeline: "Six months of withdrawal after a classmate's rumour spread. Grades collapsed. She cries in the bathroom at school.",
  treatmentHistory: "None. Mother took her to a 'mind specialist' who gave a tonic.",
  helpSeekingDelay: "6 months",
  priorContacts: ["tonic from a generalist"],
  coreBelief: "If I say what happened, everyone will blame me.",
  intermediateBeliefs: ["The rumour was my fault", "My mother won't believe me"],
  coping: ["avoid school", "hide in her room", "delete her social media"],
  openingIdiom: "tension hai",
  redFlags: [{ content: "has thought about 'going to sleep forever'", gate: "asked_about_self_harm_clearly" }],
  variation: {
    mood_today: ["flat", "numb", "anxious", "resigned"],
    recent_event: ["the rumour started", "a teacher scolded her", "her brother got a phone", "her mother found her diary"],
    most_defended_topic: ["the rumour", "school", "why she cries"],
    opening_posture: ["dragged here by mother", "came because her mother threatened"],
    somatic_focus: ["stomach", "head", "whole body"],
    trust_start: [2, 2, 3],
    language_mix: ["Hindi-dominant", "Hinglish"],
  },
};

const arjunMinor: CaseAuthoring = {
  id: "ado-arjun",
  title: "Arjun, 16 — the minor who wants privacy from his father",
  difficulty: "cooperative",
  traps: ["secondary_gain", "informant_conflict", "diagnostic_overshadowing"],
  moduleId: "mod-adolescent",
  name: "Arjun",
  age: 16,
  gender: "male",
  occupation: "school student, class 11",
  city: "Chandigarh",
  family: "lives with father (divorced); mother in another city",
  register: "Direct English, guarded about the father",
  presentation: "Came alone, explicitly asked that his father not be involved. Mature-minor capacity assessment is the gate. Anxious about a 'friend's' suicidal talk — which is his own.",
  chiefComplaint: "A friend is talking about ending things. I need to know what to do. And please, don't tell my dad. He'll make it about him.",
  timeline: "Weeks of carrying a friend's (his own) suicidal thoughts. Attending school but disconnecting. Father is controlling.",
  treatmentHistory: "None.",
  helpSeekingDelay: "Came because the thoughts got loud",
  priorContacts: [],
  coreBelief: "Asking for help is a trap — adults will use it.",
  intermediateBeliefs: ["My father will blame the phone, not listen", "If I'm honest, they'll hospitalise me"],
  coping: ["tell half-truths", "frame it as a 'friend'", "stay online late"],
  openingIdiom: "something is happening to me",
  redFlags: [{ content: "the 'friend' is himself; passive plan (bridge near school)", gate: "asked_about_self_harm_clearly" }],
  variation: {
    mood_today: ["anxious", "brittle-cheerful", "flat", "agitated"],
    recent_event: ["his father searched his room", "he saw the bridge again", "a school counsellor was mentioned", "his mother called from another city"],
    most_defended_topic: ["his father", "the 'friend'", "why he can't tell adults"],
    opening_posture: ["came alone, secretly", "came after school, told no one"],
    somatic_focus: ["head", "chest", "stomach"],
    trust_start: [3, 3, 4],
    language_mix: ["mostly English", "English with Punjabi words"],
  },
};

export const ADOLESCENT_CASES = [kavita, arjunMinor].map(buildCase);
