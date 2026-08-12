/**
 * No-disorder cases (A8 principle) — volume 8. The brief requires NINE
 * cases with NO diagnosable disorder across the set. The existing batch
 * covers: normal grief (dep-grief-raj), normal adolescent withdrawal,
 * exam anxiety in range, culturally normative possession (psy-mahesh),
 * one-off panic after a medical scare (Kavya), low mood fully explained by
 * a medical cause (soma-b12-pramod). This volume completes the set with
 * the three missing presentations: situational stress with intact
 * function, a worried parent with a developmentally typical child, and
 * someone sent by family with no complaint of their own.
 *
 * The debrief explicitly PRAISES correct restraint on these cases — no
 * red flags, no disclosure gates, no pathology to unlock. The student who
 * does not diagnose is right, and the scoring prompt says so.
 */

import { buildCase, type CaseAuthoring } from "../case-builder";

const sunita: CaseAuthoring = {
  id: "no-disorder-sunita",
  title: "Sunita, 24 — the busy week that is 'too much'",
  difficulty: "cooperative",
  traps: ["over_diagnosis"],
  moduleId: "mod-anxiety",
  name: "Sunita",
  age: 24,
  gender: "female",
  occupation: "junior software developer",
  city: "Bengaluru",
  family: "lives with two flatmates; family in Mysuru",
  register: "Workplace English, brisk",
  presentation: "A packed fortnight — a product launch, her sister's wedding across two cities, and a flatmate emergency. She says she's 'at my limit' but is functioning: sleeping 6 hours, working, exercising when she can. No anhedonia, no panic, no dread. She wants a 'check' because her mother told her stress becomes depression.",
  chiefComplaint: "This week has been too much. Two weddings, a deadline, and my flatmate's crisis. I'm tired, but I'm fine — my mother says stress becomes depression, so I thought I should check.",
  timeline: "Two weeks of high load, clearly situational. Function intact throughout. Prior history: none.",
  treatmentHistory: "None.",
  helpSeekingDelay: "Presented early — 'prevention' visit, driven by family anxiety, not symptoms.",
  priorContacts: ["mother's friend who is a counsellor"],
  coreBelief: "I can cope; I just want permission to be tired.",
  intermediateBeliefs: ["Maybe I'm not coping as well as I think", "Everyone else seems to manage better"],
  coping: ["delegating", "walking at lunch", "saying no to extra work"],
  openingIdiom: "tension hai",
  redFlags: [],
  variation: {
    mood_today: ["tired but cheerful", "brisk", "resigned-about-the-week", "caffeinated"],
    recent_event: ["the flatmate crisis got worse", "the launch slipped a day", "an aunt asked when she'll marry", "got a good code review"],
    most_defended_topic: ["the wedding chaos", "her brother's opinion", "work"],
    opening_posture: ["came willingly", "came 'before it becomes a thing'"],
    somatic_focus: ["head", "shoulders", "none, really"],
    trust_start: [5, 6, 5],
    language_mix: ["mostly English", "Hinglish"],
  },
};

const rohit: CaseAuthoring = {
  id: "no-disorder-rohit-parent",
  title: "Rohit & Arjun, 40/9 — the worried father, the typical boy",
  difficulty: "cooperative",
  traps: ["over_diagnosis", "informant_conflict"],
  moduleId: "mod-adolescent",
  name: "Rohit",
  age: 40,
  gender: "male",
  occupation: "bank manager",
  city: "Nagpur",
  family: "wife, 9-year-old son Arjun, grandfather in the same house",
  register: "Concerned-father Hindi-English",
  presentation: "The father is convinced his son is 'hyperactive' — the teacher said so. The boy, in the room, is attentive, sits reasonably well, reads while the adults talk. School marks are good; he plays cricket; he has friends. The father's worry is the presenting problem, not the child.",
  chiefComplaint: "The teacher wrote that Arjun can't sit still and should be 'checked for ADHD'. My wife says he's just a boy. I want to know what's wrong with my son.",
  timeline: "One teacher's note triggered weeks of family conflict. The child is developmentally typical; the father's anxiety has become the family's organising problem.",
  treatmentHistory: "None.",
  helpSeekingDelay: "The father came alone first, then brought the child.",
  priorContacts: ["school teacher", "a cousin 'diagnosed' with ADHD"],
  coreBelief: "If my son has something wrong, it's my failure as a father.",
  intermediateBeliefs: ["A teacher's word carries weight I can't ignore", "Boys who can't sit still end up failing"],
  coping: ["reading up obsessively", "checking Arjun's homework nightly", "arguing with his wife"],
  openingIdiom: "kuch toh problem hai",
  redFlags: [],
  variation: {
    mood_today: ["wired", "defensive", "exhausted", "hopeful"],
    recent_event: ["the school called again", "his wife refused to discuss it", "Arjun won a drawing prize", "his father said 'just beat him lightly'"],
    most_defended_topic: ["the teacher's note", "his wife's dismissal", "his fathering"],
    opening_posture: ["came with the child", "came alone first"],
    somatic_focus: ["none", "head"],
    trust_start: [3, 4, 3],
    language_mix: ["Hindi-dominant", "Hinglish"],
  },
};

const neelam: CaseAuthoring = {
  id: "no-disorder-neelam-sent",
  title: "Neelam, 31 — brought by her sisters, nothing wrong",
  difficulty: "cooperative",
  traps: ["over_diagnosis", "informant_conflict"],
  moduleId: "mod-ethics",
  name: "Neelam",
  age: 31,
  gender: "female",
  occupation: "schoolteacher",
  city: "Lucknow",
  family: "three sisters, parents; she lives with them",
  register: "Reserved Hindustani-English",
  presentation: "Her sisters 'made' her come after a cousin's suicide attempt scared the family. Neelam herself has no complaint: sleep, appetite, work, mood all fine. She is quiet because she is annoyed at being sent, not depressed. The correct clinical response is to hear her out, confirm no pathology, and address the family's fear — not to manufacture a disorder.",
  chiefComplaint: "My sisters thought I should talk to someone. There's nothing to talk about. But here I am, so you can ask.",
  timeline: "One cousin's suicide attempt two weeks ago. The family is scanning everyone for 'signs'. Neelam is asymptomatic and mildly offended.",
  treatmentHistory: "None.",
  helpSeekingDelay: "Sent by family; no personal complaint.",
  priorContacts: ["a cousin's therapist (through the cousin)"],
  coreBelief: "I am fine, and I don't like being examined.",
  intermediateBeliefs: ["They treat me like glass", "If I say more, they'll never drop it"],
  coping: ["going along to end the nagging", "spending more time at school"],
  openingIdiom: "I'm fine, just tired",
  redFlags: [],
  variation: {
    mood_today: ["dry", "polite", "wry", "flat"],
    recent_event: ["a sister checked her phone at night", "the cousin's family visited", "a colleague asked about her 'appointment'", "the principal was kind about it"],
    most_defended_topic: ["her sisters' worry", "the cousin's situation", "why she's here"],
    opening_posture: ["came with a sister outside", "came alone, rolling her eyes"],
    somatic_focus: ["none"],
    trust_start: [2, 3, 3],
    language_mix: ["Hindustani-English", "Hindi-dominant"],
  },
};

export const VOLUME_8_CASES = [sunita, rohit, neelam].map(buildCase);