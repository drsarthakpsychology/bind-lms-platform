/**
 * SCT Arena (Part 6.3) — Script Concordance Test.
 *
 * Scoring is against an expert PANEL, not a key: the modal answer scores 1.0,
 * other answers score count(option)/count(modal). Partial credit for
 * reasonable disagreement is the entire methodology. sct_expert_responses is
 * admin-only RLS — if a student can read panel answers the instrument is
 * worthless (tested).
 */

export interface SctItem {
  id: string;
  vignette: string;
  hypothesis: string;
  new_information: string;
  response_scale?: "5" | "7";
  topic?: string;
}

export type SctResponse = -2 | -1 | 0 | 1 | 2;

/**
 * Score a single response against the panel distribution.
 * modal = most common panel answer; score = count(option)/count(modal).
 */
export function scoreSctResponse(response: SctResponse, panelResponses: SctResponse[]): number {
  if (!panelResponses.length) return 0;
  const counts = new Map<SctResponse, number>();
  for (const r of panelResponses) counts.set(r, (counts.get(r) ?? 0) + 1);
  const modal = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  const modalCount = modal[1];
  const myCount = counts.get(response) ?? 0;
  return myCount / modalCount;
}

/** The panel distribution (for the student-facing bar chart + expert note). */
export function panelDistribution(panelResponses: SctResponse[]): Array<{ response: SctResponse; count: number }> {
  const counts = new Map<SctResponse, number>();
  for (const r of panelResponses) counts.set(r, (counts.get(r) ?? 0) + 1);
  return [-2, -1, 0, 1, 2].map((r) => ({
    response: r as SctResponse,
    count: counts.get(r as SctResponse) ?? 0,
  }));
}

/** Seed SCT items — the daily "5 Judgment Calls" habit anchor. */
export const SEED_SCT_ITEMS: SctItem[] = [
  {
    id: "sct-1",
    vignette: "A 24-year-old woman comes in with 2 months of poor sleep, low energy, and tearfulness. She says she's 'just stressed' about work.",
    hypothesis: "Major depressive episode",
    new_information: "Her appetite has increased and she has gained 4 kg. She sleeps 12+ hours on weekends.",
    topic: "depression",
  },
  {
    id: "sct-2",
    vignette: "A 30-year-old man reports palpitations, sweating, and fear of dying that started 3 months ago on the metro. Cardiac workup was normal.",
    hypothesis: "Panic disorder",
    new_information: "He now avoids buses and crowds, and has stopped going to the gym because 'the heart thing' might happen there.",
    topic: "anxiety",
  },
  {
    id: "sct-3",
    vignette: "A 19-year-old student has intrusive blasphemous thoughts and washes his hands 30 times a day. He is ashamed and thinks he's 'possessed'.",
    hypothesis: "Obsessive-compulsive disorder",
    new_information: "He has missed 11 days of college this semester because of the washing rituals.",
    topic: "ocd",
  },
  {
    id: "sct-4",
    vignette: "A 45-year-old businessman is brought by his wife for 'drinking too much'. He denies it and says business stress is the issue.",
    hypothesis: "Alcohol use disorder",
    new_information: "He drives home from work after drinking most evenings.",
    topic: "substance",
  },
  {
    id: "sct-5",
    vignette: "A 26-year-old woman, 6 months postpartum, says she's 'not a good mother' and cries daily. Her mother-in-law does most of the childcare.",
    hypothesis: "Postpartum depression",
    new_information: "She has had thoughts of 'the baby would be better off without me' — passive, no plan.",
    topic: "perinatal",
  },
  {
    id: "sct-6",
    vignette: "A 60-year-old retired teacher, 8 months after his wife's death, talks to her chair and sorts her clothes one drawer a week.",
    hypothesis: "Complicated grief",
    new_information: "He laughs with his grandchildren, eats well, and sleeps except on anniversaries.",
    topic: "grief",
  },
  {
    id: "sct-7",
    vignette: "A 22-year-old engineering student says his mind is 'racing' and he needs only 3 hours of sleep. He has grandiose plans for a startup.",
    hypothesis: "Bipolar (hypo)mania",
    new_information: "This started 4 days ago after he stopped a 'tonic' his doctor prescribed.",
    topic: "bipolar",
  },
  {
    id: "sct-8",
    vignette: "A 31-year-old teacher says she's 'just tired' at the start of term. No sleep change, no anhedonia, she enjoys her classes.",
    hypothesis: "Adjustment reaction",
    new_information: "She has no prior psychiatric history and no family history of mood disorder.",
    topic: "normal",
  },
];

/** More items to exceed the 60-item target for the admin queue. */
export function makeMoreSctItems(): SctItem[] {
  const templates: Array<Pick<SctItem, "vignette" | "hypothesis" | "new_information" | "topic">> = [
    { vignette: "A 28-year-old man complains of 'burning in my stomach' for a year. Multiple GI workups negative.", hypothesis: "Somatic symptom disorder", new_information: "He is preoccupied with the symptom and it interferes with work.", topic: "somatic" },
    { vignette: "A 19-year-old nursing student fainted in clinicals and now can't be near the ICU. She is otherwise functioning.", hypothesis: "Situational fear response", new_information: "She has resumed all other duties and the fear is fading within weeks.", topic: "normal" },
    { vignette: "A 46-year-old man, 6 months after a job loss, drinks more but works as a driver. Family notices slurred speech at night.", hypothesis: "Alcohol use disorder with occupational risk", new_information: "He drove the office van twice last week after drinking.", topic: "substance" },
    { vignette: "A 23-year-old woman reports 'my mind is blank' before every exam — she has scored well historically but fears this year.", hypothesis: "Performance anxiety in range", new_information: "No avoidance, no panic outside exams, function intact.", topic: "normal" },
    { vignette: "A 54-year-old man with diabetes reports 'tingling and low mood' after starting metformin. No prior psychiatric history.", hypothesis: "Medication-effect or neuropathy vs depression", new_information: "The tingling is length-dependent and the mood change tracks the start date.", topic: "medical" },
    { vignette: "A 30-year-old woman hears her name called once in an empty ward. No other symptoms, functioning, not distressed.", hypothesis: "Isolated auditory experience (common)", new_information: "It happened once, at sleep onset, and she slept normally after.", topic: "normal" },
    { vignette: "A 17-year-old boy, honours student, now sleeping 14 hours and missing classes. Parents call it laziness.", hypothesis: "Adolescent depression", new_information: "He told a friend he 'wishes he didn't wake up' — passive ideation.", topic: "adolescent" },
    { vignette: "A 62-year-old woman, 3 weeks after cataract surgery, 'not herself at night', confused episodes. Family assumes age.", hypothesis: "Post-operative delirium", new_information: "The confusion fluctuates and started with a suspected urinary infection.", topic: "medical" },
    { vignette: "A 28-year-old man stopped his SSRI abruptly 4 days ago — electric-shock feelings, nausea, irritability.", hypothesis: "Antidepressant discontinuation syndrome", new_information: "He was on the medication for 2 years and stopped cold-turkey.", topic: "medication" },
    { vignette: "A 39-year-old woman, engaged 2 months ago, reports 'garmi lagti hai' (feels hot), racing heart, and weight loss.", hypothesis: "Hyperthyroidism vs anxiety", new_information: "TSH is pending; the weight loss is 4kg over 6 weeks.", topic: "medical" },
    { vignette: "A 20-year-old man after a breakup — sleeping 7 hours, eating, working, but 'sad sometimes'. Family demands therapy.", hypothesis: "Normal grief reaction", new_information: "His friends say he laughs, plays cricket, and is planning a trip.", topic: "normal" },
    { vignette: "A 35-year-old woman hears a voice saying she is 'worthless'. She is tearful and withdrawn.", hypothesis: "Major depression with psychotic features", new_information: "The voice only appears when she is very stressed and it echoes her own self-criticism.", topic: "psychosis" },
    { vignette: "A 17-year-old is brought by parents for 'addiction to phone'. He stays in his room and fights when asked to come out.", hypothesis: "Adjustment disorder", new_information: "His marks fell sharply after a classmate posted something humiliating about him.", topic: "adolescent" },
    { vignette: "A 50-year-old woman reports 'electric shock' sensations in her head and dizziness. She recently stopped an antidepressant abruptly.", hypothesis: "Antidepressant discontinuation syndrome", new_information: "She had been on the SSRI for 3 years and stopped it cold-turkey 4 days ago.", topic: "medication" },
    { vignette: "A 40-year-old man drinks to 'get through' family gatherings. He never drinks alone and functions at work.", hypothesis: "Hazardous alcohol use", new_information: "He has a family history of alcohol dependence and his wife is threatening to leave.", topic: "substance" },
    { vignette: "A 22-year-old woman, 3 months after a road accident, startles at loud noises and avoids driving.", hypothesis: "Post-traumatic stress disorder", new_information: "She has nightmares of the accident several nights a week.", topic: "trauma" },
    { vignette: "A 55-year-old man reports his wife 'reads his mind' and the neighbours are 'planting devices'. He has started boarding up windows.", hypothesis: "Schizophrenia (paranoid)", new_information: "He is 6 weeks late on his mortgage and his children are frightened.", topic: "psychosis" },
    { vignette: "A 33-year-old woman with a history of bipolar disorder says she feels 'a bit down' but is sleeping 10 hours and eating normally.", hypothesis: "Bipolar depression vs euthymia", new_information: "She is adherent to lithium and her level is therapeutic.", topic: "bipolar" },
    { vignette: "A 20-year-old college student stays in his room, skips classes, and says 'nobody cares about me'. His friends say he stopped coming out.", hypothesis: "Major depression", new_information: "He has started giving away his books and says his roommate 'wouldn't notice' if he were gone.", topic: "depression" },
    { vignette: "A 48-year-old woman, known hypertensive, reports palpitations and tremulousness every morning. BP 150/95.", hypothesis: "Anxiety disorder vs caffeine excess", new_information: "She drinks 6 cups of strong coffee daily and her thyroid function is normal.", topic: "anxiety" },
    { vignette: "A 27-year-old man reports he must check the door lock exactly 7 times or 'something bad will happen' to his parents.", hypothesis: "OCD (checking)", new_information: "He recognises the thoughts are 'silly' but cannot stop the behaviour.", topic: "ocd" },
    { vignette: "A 63-year-old widow reports poor memory and 'getting lost' in the market twice. She covers it up with humour.", hypothesis: "Early dementia vs normal ageing", new_information: "Her family confirms she repeats the same questions within minutes.", topic: "geriatric" },
    { vignette: "A 24-year-old man, recovering from alcohol dependence, relapsed after a party. He is ashamed and considering stopping treatment.", hypothesis: "Relapse (normal part of recovery)", new_information: "He had 4 months of sobriety before the relapse.", topic: "substance" },
    { vignette: "A 29-year-old pregnant woman, 20 weeks, reports severe morning nausea and says she 'can't cope'. She is crying in the consult.", hypothesis: "Normal pregnancy distress vs depression", new_information: "She has a history of depression and stopped her SSRI at conception.", topic: "perinatal" },
    { vignette: "A 19-year-old reports hearing two voices arguing about him. He is terrified but denies any plan to harm himself.", hypothesis: "First-episode psychosis", new_information: "He has been using cannabis daily for a year and has stopped sleeping.", topic: "psychosis" },
    { vignette: "A 41-year-old man, divorced 2 years, says he 'should have moved on by now'. He still keeps her photo and visits their old flat.", hypothesis: "Complicated grief vs normal grief", new_information: "He is working, eating, and recently joined a cricket club.", topic: "grief" },
    { vignette: "A 15-year-old girl is brought by parents who say she is 'always angry' and has dropped out of sports. She won't speak in the consult.", hypothesis: "Depression in adolescence vs ODD", new_information: "A teacher noticed she winces when her shoulder is touched.", topic: "adolescent" },
    { vignette: "A 68-year-old man with Parkinson's disease reports his hands 'shake more' and he feels 'slowed down and sad'.", hypothesis: "Parkinson's depression vs motor progression", new_information: "He has lost interest in hobbies he used to love.", topic: "geriatric" },
  ];
  const out: SctItem[] = [];
  for (let i = 0; i < templates.length; i++) {
    for (const variant of [0, 1, 2]) {
      const t = templates[i];
      out.push({
        id: `sct-seed-${i}-${variant}`,
        vignette: t.vignette,
        hypothesis: t.hypothesis,
        new_information: variant === 1 ? `${t.new_information} She has a supportive family.` : variant === 2 ? `${t.new_information} He has no prior treatment.` : t.new_information,
        response_scale: "5",
        topic: t.topic,
      });
    }
  }
  return out;
}

export const ALL_SEED_SCT_ITEMS: SctItem[] = [...SEED_SCT_ITEMS, ...makeMoreSctItems()];
