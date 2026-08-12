/**
 * Level 4 stimulus bank — full MSE vignettes scored against expert coding.
 * Each is a short but complete case: the presenting picture across all 11
 * domains. The student writes the full MSE; scoreMseCode() marks green/amber/red.
 *
 * The vignettes are COMPLETE enough to code every domain (unlike the sim
 * transcript Level 5, where a student codes what they elicited). Amber
 * alternatives per domain live alongside so a defensible alternative scores
 * amber, not red.
 */
import type { MseCode } from "./ladder";
import { scoreMseCode } from "./ladder";

export interface FullMseStimulus {
  id: string;
  title: string;
  context: string; // the presenting picture
  expert: MseCode;
  amber: Record<string, string[]>; // per-domain defensible alternatives
}

/** A student's Level 4/5 attempt: the 11 domain fields, plus optional
 *  free-text per domain and the small-things they noticed. */
export interface MseAttemptFields {
  [domain: string]: string[] | undefined;
}

export const FULL_MSE_STIMULI: FullMseStimulus[] = [
  {
    id: "mse4-sandeep",
    title: "Sandeep, 35 — the man who can't sit in a meeting",
    context:
      "A 35-year-old accountant, brought by his wife. Six weeks ago a colleague teased him about 'losing focus'. Since then he has been pacing the office, snapping at people, and taking 'walks' that last an hour. Tonight he sat rigidly until the clinic door closed, then began shaking and said: 'I can't sit still. It's like my legs decide, not me.' He is on an antipsychotic started by a GP for 'tension'.",
    expert: {
      caseKey: "mse4-sandeep",
      appearance: ["professionally dressed", "trembling", "rigid posture"],
      behavior: ["paced before settling", "agitated", "cooperative once seated"],
      speech: ["rapid", "pressured", "apologetic"],
      mood: ["irritable", "frustrated", "anxious"],
      affect: ["anxious", "congruent", "tense"],
      thought_process: ["linear", "slightly pressured"],
      thought_content: ["preoccupation with the meeting", "fear of being judged", "insight into restlessness but not cause"],
      perception: [],
      cognition: ["oriented x3", "impaired concentration from restlessness"],
      insight: ["partial", "describes the restlessness as 'my legs decide' — externalised"],
      judgment: ["fair", "poor when describing the snapping at colleagues"],
      small_things: [
        "rigid until the door closed, then shaking — the controlled exterior dropped at privacy",
        "said his legs decide, not him — externalised agency",
        "apologised repeatedly for 'wasting your time'",
      ],
    },
    amber: {
      behavior: ["restless"],
      speech: ["pressured"],
      affect: ["labile"],
      mood: ["dysphoric"],
      insight: ["poor"],
      judgment: ["good"],
    },
  },
  {
    id: "mse4-lakshmi",
    title: "Lakshmi, 40 — the 'possession' that isn't",
    context:
      "A 40-year-old woman, brought by her sister. The family says she is 'possessed' because twice a week she goes silent, stares, then speaks in a different voice about a deceased relative. Between episodes she is a capable mother who runs the household. The sister is frightened. Lakshmi looks tired and says: 'I'm fine except when it comes. Afterwards I don't remember.'",
    expert: {
      caseKey: "mse4-lakshmi",
      appearance: ["neat sari", "looks tired", "composed"],
      behavior: ["cooperative", "guarded about the episodes", "tearful at the memory lapses"],
      speech: ["soft", "careful", "attenuated"],
      mood: ["euthymic between episodes", "sad about the episodes", "fatigued"],
      affect: ["restricted", "tearful when speaking of the lapses"],
      thought_process: ["linear", "slowed around the episodes"],
      thought_content: ["preoccupation with the episodes", "fear of 'losing days'", "no fixed delusions"],
      perception: ["trance-like states (dissociative)", "amnesia for episode content"],
      cognition: ["oriented x3", "intact"],
      insight: ["good into the memory loss", "poor into the cause", "accepts the family's possession frame partially"],
      judgment: ["good"],
      small_things: [
        "always looked at her sister before answering about the episodes",
        "used the past tense for the episodes — 'when I WAS possessed'",
        "relieved when asked what happens between episodes — nobody had asked",
      ],
    },
    amber: {
      behavior: ["withdrawn"],
      affect: ["flat"],
      perception: ["dissociative"],
      insight: ["partial"],
      judgment: ["fair"],
    },
  },
  {
    id: "mse4-farooq",
    title: "Farooq, 41 — the two 'new businesses' and the crash",
    context:
      "A 41-year-old driver, brought by his brother. For two months he was 'unstoppable' — bought a second auto, started two 'businesses', slept 3 hours, told his wife she was holding him back. In the last week he has crashed: won't leave the room, cries, says 'I ruined everything'. He is not on any medication. The brother is told he is 'just bipolar from too much caffeine.'",
    expert: {
      caseKey: "mse4-farooq",
      appearance: ["unwashed", "same clothes several days", "withdrawn posture"],
      behavior: ["refuses to engage initially", "tearful", "cooperative slowly"],
      speech: ["slow", "quiet", "flat"],
      mood: ["severely depressed", "shame", "hopeless"],
      affect: ["flat", "blunted", "incongruent flashes of grandiosity when recalling the 'businesses'"],
      thought_process: ["blocking", "linear when flat"],
      thought_content: ["guilt about the money", "grandiose recall of the 'businesses'", "worthlessness", "passive death wish"],
      perception: [],
      cognition: ["impaired concentration", "oriented x3"],
      insight: ["poor into the pattern", "sees only the crash as the problem"],
      judgment: ["impaired during the high phase", "fair now"],
      small_things: [
        "voice changed entirely when recalling the high — pressured, vivid",
        "apologised to his brother without being asked — rehearsed shame",
        "said 'I WAS a man then' — past tense identity",
      ],
    },
    amber: {
      behavior: ["withdrawn"],
      speech: ["monotone"],
      affect: ["restricted"],
      mood: ["dysphoric"],
      cognition: ["impaired memory"],
      insight: ["partial"],
    },
  },
  {
    id: "mse4-nisha",
    title: "Nisha, 17 — the 'healthy eating' that became dangerous",
    context:
      "A 17-year-old student, brought by her mother. 'She only eats salad and will not touch rice. She weighs herself three times a day.' Nisha sits on the edge of her chair, arms crossed, and says precisely: 'My mother is exaggerating. I eat fine. I am just careful.' She has lost visible weight. Menstruation stopped three months ago.",
    expert: {
      caseKey: "mse4-nisha",
      appearance: ["thin", "layered clothes", "sitting edge of chair", "careful posture"],
      behavior: ["guarded", "defensive", "precise and controlled"],
      speech: ["articulate", "clipped", "rehearsed"],
      mood: ["denies low mood", "irritable under questioning"],
      affect: ["restricted", "controlled", "same expression throughout"],
      thought_process: ["linear", "defensive"],
      thought_content: ["preoccupation with food and weight", "denial of any problem", "no body-image delusion, but fixed overvaluation of thinness"],
      perception: [],
      cognition: ["oriented x3", "intact, sharp"],
      insight: ["poor", "full into the food rules, none into the danger"],
      judgment: ["fair", "impaired around eating rules"],
      small_things: [
        "used precise biomedical language — rehearsed register",
        "cracked a smile only when defending her eating rules",
        "watched her mother's face while answering about weight",
      ],
    },
    amber: {
      behavior: ["withdrawn"],
      affect: ["flat"],
      mood: ["anxious"],
      thought_content: ["obsessions"],
      insight: ["partial"],
    },
  },
  {
    id: "mse4-mahesh",
    title: "Mahesh, 21 — the possession that left him intact",
    context:
      "A 21-year-old final-year student, self-referred. During a festival he 'went into the god' for an hour — the family is proud, it is customary. He returns to explain: 'I remember the room, but not my voice. The family says it was a blessing.' He is functioning well, social, studying. His only question is whether it is 'normal'.",
    expert: {
      caseKey: "mse4-mahesh",
      appearance: ["well-groomed", "student casual", "relaxed"],
      behavior: ["cooperative", "engaging", "confident"],
      speech: ["normal rate", "fluent", "articulate"],
      mood: ["euthymic", "curious"],
      affect: ["full range", "congruent"],
      thought_process: ["linear", "organised"],
      thought_content: ["curiosity about the experience", "no delusions", "appropriate concern"],
      perception: ["trance state during the festival", "amnesia for the episode content — dissociative"],
      cognition: ["oriented x3", "intact"],
      insight: ["good", "asks directly whether it is normal"],
      judgment: ["good"],
      small_things: [
        "the only patient who asked questions about the clinician's role — genuine engagement",
        "no hesitation, no avoidance — a full interview in 20 minutes",
        "referred to the experience as 'a blessing' with a shrug, not conviction",
      ],
    },
    amber: {
      behavior: ["appropriate"],
      affect: ["euthymic"],
      judgment: ["good"],
      perception: ["depersonalisation"],
    },
  },
  {
    id: "mse4-anita",
    title: "Anita, 29 — the flatness after the baby",
    context:
      "A 29-year-old woman, 7 months postpartum, brought by her mother-in-law who says she 'sits all day'. She looks at her hands while speaking, answers in a flat monotone, and says the baby 'is fine, the baby doesn't need me'. She has not bathed in three days. Her speech is slow, sparse, and she stops mid-sentence twice, then says 'I'm sorry, I forgot what I was saying'.",
    expert: {
      caseKey: "mse4-anita",
      appearance: ["dishevelled", "poor self-care", "avoids eye contact", "slumped posture"],
      behavior: ["withdrawn", "psychomotor retardation", "minimal spontaneous movement"],
      speech: ["slow", "sparse", "monotone", "pauses mid-sentence", "soft volume"],
      mood: ["empty", "numb", "reports feeling nothing"],
      affect: ["flat", "congruent", "constricted range"],
      thought_process: ["linear but slow", "occasional thought-blocking"],
      thought_content: ["worthlessness", "passive death wishes — 'the baby would be better off'"],
      perception: [],
      cognition: ["oriented x3", "impaired concentration", "forgot mid-sentence (blocking)"],
      insight: ["partial", "knows she is 'not myself' but attributes it to tiredness"],
      judgment: ["fair", "adequate self-preservation but poor self-care"],
      small_things: [
        "looked at her hands, not the interviewer, throughout",
        "flat monotone despite saying 'I'm sorry' twice — the apology and the affect disconnected",
        "stopped mid-sentence twice — thought blocking, not fatigue alone",
      ],
    },
    amber: {
      behavior: ["retarded", "slowed"],
      affect: ["blunted"],
      speech: ["slow"],
      mood: ["depressed", "sad"],
      judgment: ["poor"],
    },
  },
  {
    id: "mse4-rohit",
    title: "Rohit, 21 — the flight that never lands",
    context:
      "A 21-year-old college student, no sleep for two nights, brought by friends who say he 'hasn't stopped talking for a day'. He speaks rapidly, jumping from cricket to his startup to the prime minister to his exam, each with a loose pun connection. He laughs at his own words, interrupts, and says he feels 'fantastic, better than ever'. He believes he will 'be on television by Diwali'.",
    expert: {
      caseKey: "mse4-rohit",
      appearance: ["dishevelled", "bright-eyed", "hyperactive", "grooming neglected"],
      behavior: ["psychomotor agitation", "pressured", "disinhibited", "intrusive"],
      speech: ["pressured", "rapid", "loud", "flight of ideas", "clang associations"],
      mood: ["elated", "irritable when interrupted"],
      affect: ["euphoric", "labile", "congruent with mood"],
      thought_process: ["flight of ideas", "loosening at times", "tangential"],
      thought_content: ["grandiose beliefs — television by Diwali", "overvalued plans", "no insight into the sleep loss"],
      perception: [],
      cognition: ["oriented x3", "impaired attention", "distractible"],
      insight: ["absent", "denies anything is wrong — 'I'm just finally awake'"],
      judgment: ["poor", "planned a motorcycle purchase with no funds"],
      small_things: [
        "laughed at his own words — euphoric affect feeding the flight",
        "interrupted before questions finished — pressured, not rude",
        "called the sleep loss 'finally awake' — the denial dressed as insight",
      ],
    },
    amber: {
      behavior: ["agitated"],
      affect: ["euphoric"],
      speech: ["rapid"],
      thought_process: ["flight"],
      insight: ["poor"],
    },
  },
  {
    id: "mse4-meera",
    title: "Meera, 34 — the whispering neighbours",
    context:
      "A 34-year-old woman, brought by her brother after she boarded up her windows 'so they can't watch'. She speaks softly, checks the door twice, and says 'the neighbours installed listening devices, they know everything'. When the brother objects, she whispers 'he's one of them now'. She has stopped eating with the family and sleeps under the bed. She answers questions literally and becomes suspicious of the interviewer's note-taking.",
    expert: {
      caseKey: "mse4-meera",
      appearance: ["guarded", "checks the room repeatedly", "whispered speech"],
      behavior: ["suspicious", "hypervigilant", "withdrawn into whispering"],
      speech: ["soft", "circumstantial", "secretive", "occasional sudden loudness when contradicted"],
      mood: ["fearful", "suspicious", "anxious"],
      affect: ["anxious", "tense", "congruent with the fear"],
      thought_process: ["circumstantial", "some tangentiality", "over-inclusive"],
      thought_content: ["persecutory delusions — listening devices", "delusion of reference — 'they know everything'", "suspicion of family"],
      perception: ["auditory hallucinations — 'they whisper about me'"],
      cognition: ["oriented x3", "attention impaired by hypervigilance"],
      insight: ["absent", "fully convinced of the devices"],
      judgment: ["poor", "boarding windows and sleeping under the bed"],
      small_things: [
        "checked the door twice while answering — the delusion acted out in the room",
        "whispered 'he's one of them now' about her own brother — the delusion claimed family",
        "became suspicious of the interviewer's pen — persecutory frame extended to the session",
      ],
    },
    amber: {
      behavior: ["suspicious"],
      speech: ["soft", "whispered"],
      affect: ["flat"],
      thought_content: ["paranoid", "persecutory"],
      insight: ["poor"],
    },
  },
  {
    id: "mse4-raj",
    title: "Raj, 58 — the grief that speaks in objects",
    context:
      "A 58-year-old widower, 10 months after his wife's death. He talks to her chair, sorts her clothes one drawer a week, and sleeps in the guest room. His daughter brought him 'before he gets worse'. He is neatly dressed, makes eye contact, smiles when describing his wife's jokes, and laughs with the interviewer. His speech is normal, unhurried, and he says 'I know she's gone. The chair is how I keep her close.'",
    expert: {
      caseKey: "mse4-raj",
      appearance: ["well-groomed", "neat", "appropriate eye contact"],
      behavior: ["cooperative", "engaged", "appropriate affect throughout"],
      speech: ["normal rate", "normal volume", "spontaneous"],
      mood: ["sad but warm", "reports grief in waves"],
      affect: ["euthymic to mildly sad", "congruent", "laughs appropriately at memories"],
      thought_process: ["linear", "goal-directed"],
      thought_content: ["grief-related preoccupations", "no pathological beliefs", "intact reality testing"],
      perception: [],
      cognition: ["oriented x3", "intact attention and memory"],
      insight: ["full", "recognises the chair ritual as coping, not delusion"],
      judgment: ["good", "adequate self-care, planning, and follow-through"],
      small_things: [
        "smiled genuinely when describing her jokes — affect matched content, not flat",
        "laughed with the interviewer — the grief has waves, not a constant",
        "framed the chair himself — 'I know she's gone' — intact insight, not delusion",
      ],
    },
    amber: {
      mood: ["depressed", "low"],
      affect: ["sad"],
      behavior: ["withdrawn"],
      judgment: ["fair"],
    },
  },
  {
    id: "mse4-sunita",
    title: "Sunita, 24 — the tired week that isn't a disorder",
    context:
      "A 24-year-old developer, two weeks after a product launch and her sister's wedding. She is brisk, makes eye contact, and laughs easily. She says she is 'tired but fine' — sleeping 6 hours, working, exercising when she can. No anhedonia, no panic, no dread. She came because her mother told her 'stress becomes depression'. She asks sensible questions about what therapy would even be for.",
    expert: {
      caseKey: "mse4-sunita",
      appearance: ["well-groomed", "alert", "appropriate eye contact"],
      behavior: ["cooperative", "appropriate", "no psychomotor change"],
      speech: ["normal rate and volume", "spontaneous", "humorous"],
      mood: ["tired but euthymic", "reports 'a busy fortnight', not low mood"],
      affect: ["euthymic", "congruent", "laughs appropriately"],
      thought_process: ["linear", "goal-directed", "insightful about the visit"],
      thought_content: ["no preoccupations beyond the wedding chaos", "intact reality testing"],
      perception: [],
      cognition: ["oriented x3", "intact"],
      insight: ["full", "understands the difference between tired and depressed"],
      judgment: ["good", "came for reassurance with sensible questions"],
      small_things: [
        "laughed easily and appropriately — affect congruent with content",
        "asked what therapy would even be for — the visit's purpose was her own",
        "described the fortnight, not herself, as 'too much' — the stressor was external",
      ],
    },
    amber: {
      mood: ["low"],
      affect: ["mildly anxious"],
      behavior: ["restless"],
    },
  },
];

/** A 10-minute Level 4 attempt: which domains the student addressed. */
export function scoreFullMse(stimulus: FullMseStimulus, fields: MseAttemptFields): Record<string, "green" | "amber" | "red"> {
  return scoreMseCode(stimulus.expert, fields, stimulus.amber);
}