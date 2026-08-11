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
];

/** A 10-minute Level 4 attempt: which domains the student addressed. */
export function scoreFullMse(stimulus: FullMseStimulus, fields: MseAttemptFields): Record<string, "green" | "amber" | "red"> {
  return scoreMseCode(stimulus.expert, fields, stimulus.amber);
}