import { SEED_FORMULATION, type FormulationFactor } from "./formulation";

export type FormulationCase = {
  id: string;
  title: string;
  prompt: string;
  /** One line for the case picker. */
  hint: string;
  factors: FormulationFactor[];
  modelNarrative: string;
};

const PROMPT = "Sort the factors into the 5P grid. Leave distractors out.";

/**
 * Formulation Forge cases. Each has 10 to 12 factor cards (at least one
 * distractor that belongs nowhere) and a model 5P narrative. Original
 * teaching cases, set in Indian practice.
 */
export const FORMULATION_CASES: FormulationCase[] = [
  { ...SEED_FORMULATION, hint: "Somatic depression in a man who won't talk about feelings" },
  {
    id: "form-2",
    title: "Meera: the exam that never ends (panic disorder)",
    prompt: PROMPT,
    hint: "Panic attacks before NEET, a heart she is sure is failing",
    factors: [
      { id: "m1", text: "Sudden attacks of racing heart, breathlessness and fear of dying, 3 to 4 times a week", bucket: "presenting" },
      { id: "m2", text: "Now avoids the coaching centre and travels only with her mother", bucket: "presenting" },
      { id: "m3", text: "First attack in the exam hall, two months before her second NEET attempt", bucket: "precipitating" },
      { id: "m4", text: "Mother has 'BP and tension' and checks her own pulse often", bucket: "predisposing" },
      { id: "m5", text: "Anxious, perfectionistic temperament since childhood", bucket: "predisposing" },
      { id: "m6", text: "Three ECGs and an echo, all normal; each one calms her for a day only", bucket: "perpetuating" },
      { id: "m7", text: "Carries a water bottle and sits near doors 'just in case' (safety behaviours)", bucket: "perpetuating" },
      { id: "m8", text: "Reads about heart attacks in young women late at night", bucket: "perpetuating" },
      { id: "m9", text: "Close friend who has offered to sit with her in class", bucket: "protective" },
      { id: "m10", text: "Bright, motivated, and asked for help herself", bucket: "protective" },
      { id: "m11", text: "Her blood group is B positive", bucket: "distractor" },
      { id: "m12", text: "The family recently bought a new scooter", bucket: "distractor" },
    ],
    modelNarrative:
      "Meera, 19, presents with panic disorder with growing agoraphobic avoidance: frequent surges of palpitations, breathlessness and fear of dying, and she now avoids the coaching centre. An anxious, perfectionistic temperament and a mother who models health vigilance (predisposing) set the stage; the first attack came in the exam hall during a high-stakes repeat attempt (precipitating). The cycle is kept going by repeated reassurance-seeking through normal cardiac tests, safety behaviours that stop her learning the attacks are harmless, and night-time symptom searching (perpetuating). Her own help-seeking, intelligence and a supportive friend are strengths to build exposure work on (protective).",
  },
  {
    id: "form-3",
    title: "Arjun: the voices after the hostel (first-episode psychosis)",
    prompt: PROMPT,
    hint: "A 21-year-old engineering student who stopped attending",
    factors: [
      { id: "a1", text: "Hears two men discussing him; believes classmates put a chip in his laptop", bucket: "presenting" },
      { id: "a2", text: "Stopped attending college, poor sleep, speaks less, 4 months", bucket: "presenting" },
      { id: "a3", text: "Paternal uncle with schizophrenia", bucket: "predisposing" },
      { id: "a4", text: "Daily cannabis use since second year", bucket: "predisposing" },
      { id: "a5", text: "Moved to a distant hostel and failed two subjects last semester", bucket: "precipitating" },
      { id: "a6", text: "Heavier cannabis use after the exam results", bucket: "precipitating" },
      { id: "a7", text: "Family took him to a faith healer first; 3-month delay before a psychiatrist", bucket: "perpetuating" },
      { id: "a8", text: "Ongoing cannabis use and no fixed sleep routine", bucket: "perpetuating" },
      { id: "a9", text: "Believes medicine is 'for mad people' and skips doses", bucket: "perpetuating" },
      { id: "a10", text: "Parents are worried but involved and come to every visit", bucket: "protective" },
      { id: "a11", text: "Good school record and friends from before college", bucket: "protective" },
      { id: "a12", text: "He prefers Android phones", bucket: "distractor" },
    ],
    modelNarrative:
      "Arjun, 21, presents with a first episode of psychosis: auditory hallucinations in the third person, a persecutory delusion about a chip in his laptop, and four months of withdrawal, poor sleep and dropping out. A family history of schizophrenia and regular adolescent cannabis use (predisposing) raised his vulnerability; moving away from home, academic failure and heavier cannabis use after the results (precipitating) came just before onset. The duration of untreated psychosis was lengthened by the faith-healer route, and continuing cannabis, irregular sleep and his belief that medicine is for 'mad people' (perpetuating) risk relapse. Engaged parents and a good premorbid level of functioning (protective) predict a better outcome and make early family work possible.",
  },
  {
    id: "form-4",
    title: "Sunita: 'I just want to sleep' (postpartum depression)",
    prompt: PROMPT,
    hint: "A new mother, 10 weeks after a caesarean, in a joint family",
    factors: [
      { id: "s1", text: "Low mood, crying, no interest in the baby's care, poor appetite for 6 weeks", bucket: "presenting" },
      { id: "s2", text: "Thoughts that the baby would be better off with her mother-in-law", bucket: "presenting" },
      { id: "s3", text: "Depressive episode in college that settled without treatment", bucket: "predisposing" },
      { id: "s4", text: "Emergency caesarean and a 5-day NICU stay for the baby", bucket: "precipitating" },
      { id: "s5", text: "Criticism from in-laws after the baby was a girl", bucket: "precipitating" },
      { id: "s6", text: "Husband works away; night feeds are hers alone, sleep 3 to 4 hours", bucket: "perpetuating" },
      { id: "s7", text: "Feels guilty and hides her tears so she is 'not a bad mother'", bucket: "perpetuating" },
      { id: "s8", text: "Her own mother calls every day and wants to visit", bucket: "protective" },
      { id: "s9", text: "Breastfeeding well; the baby is gaining weight", bucket: "protective" },
      { id: "s10", text: "The house is being painted", bucket: "distractor" },
      { id: "s11", text: "She studied commerce", bucket: "distractor" },
    ],
    modelNarrative:
      "Sunita, 27, presents ten weeks postpartum with a moderate depressive episode: low mood, tearfulness, poor appetite, loss of interest in caring for her baby and thoughts that the baby would be better off with others, which need a careful risk assessment. A previous untreated depressive episode (predisposing) left her vulnerable; a traumatic emergency caesarean with a NICU stay and criticism over the baby's sex (precipitating) came just before onset. Severe sleep loss with no one to share night feeds and guilt-driven concealment of her distress (perpetuating) keep it going. Her mother's daily support and the fact that feeding and the baby's growth are going well (protective) are footholds for treatment and for practical help at night.",
  },
  {
    id: "form-5",
    title: "Mr Khan: the drink after the shop shut (alcohol dependence)",
    prompt: PROMPT,
    hint: "A 45-year-old shopkeeper brought in after a withdrawal fit",
    factors: [
      { id: "k1", text: "Drinks a quarter bottle of whisky daily, morning tremor relieved by a drink", bucket: "presenting" },
      { id: "k2", text: "First withdrawal seizure last week after 2 days without alcohol", bucket: "presenting" },
      { id: "k3", text: "Father drank heavily and died of liver disease", bucket: "predisposing" },
      { id: "k4", text: "Started drinking with friends at 18; drinking was the way to unwind", bucket: "predisposing" },
      { id: "k5", text: "Shop closed during a long market slump 2 years ago; drinking doubled", bucket: "precipitating" },
      { id: "k6", text: "Evenings at the same friend's place where everyone drinks", bucket: "perpetuating" },
      { id: "k7", text: "Drinks to stop the shaking and sleeplessness of withdrawal", bucket: "perpetuating" },
      { id: "k8", text: "Says 'I can stop when I want' and refused help before", bucket: "perpetuating" },
      { id: "k9", text: "Wife and teenage son want him well; son came to the appointment", bucket: "protective" },
      { id: "k10", text: "Frightened by the seizure and now asking how to stop", bucket: "protective" },
      { id: "k11", text: "His shop sold stationery", bucket: "distractor" },
    ],
    modelNarrative:
      "Mr Khan, 45, presents with alcohol dependence with physiological withdrawal, shown by morning tremor relieved by drinking and a recent withdrawal seizure. A father who drank heavily and an early learned habit of drinking to unwind (predisposing) built the pattern; the loss of his shop two years ago (precipitating) doubled his intake. Drinking to relieve withdrawal, an evening routine centred on a drinking circle, and minimisation of the problem (perpetuating) maintain it. The fright of the seizure has opened a window of motivation, and a wife and son who are involved (protective) give a base for supervised detoxification, relapse-prevention medicine and family work.",
  },
  {
    id: "form-6",
    title: "Riya: washing until her hands bleed (OCD)",
    prompt: PROMPT,
    hint: "A 16-year-old whose rituals now take 4 hours a day",
    factors: [
      { id: "r1", text: "Intrusive thoughts of germs and of harming her family by passing on illness", bucket: "presenting" },
      { id: "r2", text: "Washes hands 40 times a day and showers for an hour; hands cracked and bleeding", bucket: "presenting" },
      { id: "r3", text: "Mother has always been very particular about cleanliness and order", bucket: "predisposing" },
      { id: "r4", text: "Rigid, rule-bound and anxious as a child", bucket: "predisposing" },
      { id: "r5", text: "Grandfather fell seriously ill with an infection a year ago", bucket: "precipitating" },
      { id: "r6", text: "Family washes the vegetables again for her and answers 'Is it clean?' many times a day", bucket: "perpetuating" },
      { id: "r7", text: "Each wash brings relief for a few minutes, so the urge comes back stronger", bucket: "perpetuating" },
      { id: "r8", text: "Avoids school because the toilets feel 'contaminated'", bucket: "perpetuating" },
      { id: "r9", text: "Knows the thoughts are excessive and wants to stop (good insight)", bucket: "protective" },
      { id: "r10", text: "A teacher she trusts has kept in touch", bucket: "protective" },
      { id: "r11", text: "She is learning the sitar", bucket: "distractor" },
    ],
    modelNarrative:
      "Riya, 16, presents with obsessive-compulsive disorder with good insight: contamination obsessions and fears of harming her family, with washing compulsions that take four hours a day and have damaged her skin. An anxious, rule-bound temperament and a household with strong cleanliness rules (predisposing) form the background; her grandfather's serious infection (precipitating) gave the fears their content. The cycle is maintained because each wash brings brief relief that strengthens the urge, the family's reassurance and re-washing accommodate the rituals, and avoiding school prevents her ever testing her fears (perpetuating). Good insight, her wish to stop and a trusted teacher (protective) make her a strong candidate for exposure and response prevention, with the family taught to step back from reassurance.",
  },
];

export function formulationCase(id: string | undefined): FormulationCase {
  return FORMULATION_CASES.find((c) => c.id === id) ?? FORMULATION_CASES[0];
}
