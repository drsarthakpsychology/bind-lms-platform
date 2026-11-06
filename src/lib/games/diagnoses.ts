/**
 * The diagnosis list players guess from (Daily Case, Duel). Names follow
 * DSM-5-TR. `needs` is the one criterion-level line shown when a guess is
 * wrong and the case has no hand-written reason for it ("Not X: it needs …").
 * Thresholds checked against DSM-5-TR (see the refs on each case).
 */

export type Chapter =
  | "neurodevelopmental"
  | "psychotic"
  | "bipolar"
  | "depressive"
  | "anxiety"
  | "ocd"
  | "trauma"
  | "dissociative"
  | "somatic"
  | "eating"
  | "sleep"
  | "disruptive"
  | "substance"
  | "neurocognitive"
  | "personality";

export const CHAPTERS: Record<Chapter, { name: string; module: string; topic: string }> = {
  neurodevelopmental: { name: "Neurodevelopmental disorders", module: "child", topic: "child" },
  psychotic: { name: "Schizophrenia spectrum and other psychotic disorders", module: "psychosis", topic: "psychosis" },
  bipolar: { name: "Bipolar and related disorders", module: "bipolar", topic: "bipolar" },
  depressive: { name: "Depressive disorders", module: "depression", topic: "depression" },
  anxiety: { name: "Anxiety disorders", module: "anxiety", topic: "anxiety" },
  ocd: { name: "Obsessive-compulsive and related disorders", module: "ocd", topic: "ocd" },
  trauma: { name: "Trauma- and stressor-related disorders", module: "trauma", topic: "trauma" },
  dissociative: { name: "Dissociative disorders", module: "more-disorders", topic: "dissociative" },
  somatic: { name: "Somatic symptom and related disorders", module: "more-disorders", topic: "somatic" },
  eating: { name: "Feeding and eating disorders", module: "more-disorders", topic: "eating" },
  sleep: { name: "Sleep-wake disorders", module: "more-disorders", topic: "sleep" },
  disruptive: { name: "Disruptive, impulse-control and conduct disorders", module: "child", topic: "child" },
  substance: { name: "Substance-related and addictive disorders", module: "substance", topic: "substance" },
  neurocognitive: { name: "Neurocognitive disorders", module: "neurocognitive", topic: "neurocognitive" },
  personality: { name: "Personality disorders", module: "personality", topic: "personality" },
};

export type Diagnosis = {
  id: string;
  name: string;
  chapter: Chapter;
  /** Other names a player might type (searched, and accepted as the same answer). */
  aka: string[];
  /** The core criterion, in plain words. */
  needs: string;
};

const d = (id: string, name: string, chapter: Chapter, needs: string, aka: string[] = []): Diagnosis => ({ id, name, chapter, needs, aka });

export const DIAGNOSES: Diagnosis[] = [
  // Neurodevelopmental
  d("adhd", "Attention-deficit/hyperactivity disorder", "neurodevelopmental", "6+ inattentive and/or hyperactive symptoms for 6 months, several present before age 12, in two or more settings.", ["ADHD", "ADD", "hyperkinetic"]),
  d("autism", "Autism spectrum disorder", "neurodevelopmental", "lasting social-communication deficits across settings plus restricted, repetitive behaviour or interests, from early childhood.", ["ASD", "autism", "Asperger"]),
  d("idd", "Intellectual developmental disorder", "neurodevelopmental", "deficits in both intellectual and adaptive functioning, starting in the developmental period.", ["intellectual disability", "mental retardation", "IDD"]),
  d("sld", "Specific learning disorder", "neurodevelopmental", "difficulty in reading, writing or maths for at least 6 months despite help, well below what is expected for age.", ["dyslexia", "dyscalculia", "learning disability"]),
  d("tourette", "Tourette's disorder", "neurodevelopmental", "multiple motor tics and at least one vocal tic, for more than 1 year, starting before age 18.", ["Tourette syndrome", "tic disorder"]),
  // Psychotic
  d("schizophrenia", "Schizophrenia", "psychotic", "2+ psychotic symptoms with continuous signs for at least 6 months, including 1 month of active symptoms.", ["schizophrenic"]),
  d("schizophreniform", "Schizophreniform disorder", "psychotic", "schizophrenia-type symptoms lasting at least 1 month but less than 6 months."),
  d("brief-psychotic", "Brief psychotic disorder", "psychotic", "psychotic symptoms lasting at least 1 day but less than 1 month, with full return to baseline.", ["acute psychosis", "brief reactive psychosis", "ATPD"]),
  d("schizoaffective", "Schizoaffective disorder", "psychotic", "delusions or hallucinations for 2+ weeks with no mood episode, and mood episodes for most of the illness.", ["schizo-affective"]),
  d("delusional", "Delusional disorder", "psychotic", "one or more delusions for 1 month or longer, never meeting schizophrenia Criterion A; functioning otherwise intact.", ["paranoia", "delusional jealousy", "erotomania"]),
  d("substance-psychosis", "Substance/medication-induced psychotic disorder", "psychotic", "delusions or hallucinations that start during or soon after intoxication or withdrawal from a substance able to cause them.", ["drug-induced psychosis", "cannabis psychosis", "amphetamine psychosis"]),
  // Bipolar
  d("bipolar-1", "Bipolar I disorder", "bipolar", "at least one manic episode: 1 week (or any length if admitted) of raised or irritable mood and energy with 3+ symptoms.", ["bipolar 1", "manic depression", "mania", "BPAD"]),
  d("bipolar-2", "Bipolar II disorder", "bipolar", "at least one hypomanic episode (4+ days) and at least one major depressive episode, and never a full manic episode.", ["bipolar 2"]),
  d("cyclothymic", "Cyclothymic disorder", "bipolar", "2 years (1 in young people) of many hypomanic and depressive symptom periods that never meet full episode criteria.", ["cyclothymia"]),
  // Depressive
  d("mdd", "Major depressive disorder", "depressive", "5+ symptoms, including low mood or loss of interest, for at least 2 weeks.", ["depression", "MDD", "clinical depression", "unipolar depression"]),
  d("pdd", "Persistent depressive disorder", "depressive", "low mood on more days than not for at least 2 years (1 year in children).", ["dysthymia", "dysthymic disorder", "chronic depression"]),
  d("pmdd", "Premenstrual dysphoric disorder", "depressive", "5+ symptoms in the week before menses in most cycles, improving within days after menses starts.", ["PMDD", "premenstrual"]),
  d("dmdd", "Disruptive mood dysregulation disorder", "depressive", "severe temper outbursts 3+ times a week with irritable mood between, for 12+ months, onset before age 10.", ["DMDD"]),
  d("depression-medical", "Depressive disorder due to another medical condition", "depressive", "low mood shown by history, examination or labs to be the direct effect of a medical illness.", ["organic depression", "hypothyroid depression"]),
  d("substance-depression", "Substance/medication-induced depressive disorder", "depressive", "low mood that starts during or soon after a substance or medicine able to cause it.", ["drug-induced depression"]),
  // Anxiety
  d("gad", "Generalized anxiety disorder", "anxiety", "hard-to-control worry about many things, more days than not for 6 months, with 3+ body symptoms.", ["GAD", "generalised anxiety"]),
  d("panic", "Panic disorder", "anxiety", "recurrent unexpected panic attacks, with at least 1 month of worry about more attacks or a change in behaviour.", ["panic attacks"]),
  d("agoraphobia", "Agoraphobia", "anxiety", "fear of 2+ of five situations (transport, open spaces, enclosed places, crowds, outside alone) for fear escape is hard, usually 6+ months.", []),
  d("social-anxiety", "Social anxiety disorder", "anxiety", "fear of being judged in social situations, avoided or endured with dread, typically for 6+ months.", ["social phobia", "SAD"]),
  d("specific-phobia", "Specific phobia", "anxiety", "marked fear of one object or situation, almost always triggered and avoided, typically for 6+ months.", ["phobia"]),
  d("separation-anxiety", "Separation anxiety disorder", "anxiety", "excessive fear about separation from attachment figures, 4+ weeks in children (usually 6+ months in adults).", []),
  d("selective-mutism", "Selective mutism", "anxiety", "consistent failure to speak in specific social settings despite speaking elsewhere, for at least 1 month (not only the first month of school).", []),
  // OCD and related
  d("ocd", "Obsessive-compulsive disorder", "ocd", "obsessions and/or compulsions that take over 1 hour a day or cause distress or impairment.", ["OCD"]),
  d("bdd", "Body dysmorphic disorder", "ocd", "preoccupation with a defect in looks others can't see or think slight, plus repeated checking or comparing.", ["BDD", "dysmorphophobia"]),
  d("hoarding", "Hoarding disorder", "ocd", "lasting difficulty discarding things, from a felt need to save them, so living areas clog up.", []),
  d("trichotillomania", "Trichotillomania (hair-pulling disorder)", "ocd", "recurrent hair pulling causing hair loss, with repeated attempts to stop.", ["hair pulling"]),
  d("excoriation", "Excoriation (skin-picking) disorder", "ocd", "recurrent skin picking causing lesions, with repeated attempts to stop.", ["skin picking", "dermatillomania"]),
  // Trauma
  d("ptsd", "Posttraumatic stress disorder", "trauma", "trauma exposure, then intrusions, avoidance, negative mood/thinking and arousal for more than 1 month.", ["PTSD", "post-traumatic stress"]),
  d("acute-stress", "Acute stress disorder", "trauma", "trauma-related symptoms lasting 3 days to 1 month after the event.", ["acute stress reaction", "ASD"]),
  d("adjustment", "Adjustment disorder", "trauma", "distress out of proportion to a stressor, starting within 3 months, settling within 6 months after the stressor ends.", ["adjustment reaction"]),
  d("prolonged-grief", "Prolonged grief disorder", "trauma", "a death at least 12 months ago (6 in children), then intense yearning or preoccupation nearly every day for at least the last month.", ["complicated grief", "PGD"]),
  d("rad", "Reactive attachment disorder", "trauma", "a child who rarely seeks or responds to comfort, after extremes of insufficient care, evident before age 5.", ["RAD"]),
  // Dissociative
  d("did", "Dissociative identity disorder", "dissociative", "two or more distinct personality states (or possession) with gaps in recall of everyday events.", ["multiple personality", "DID"]),
  d("dissociative-amnesia", "Dissociative amnesia", "dissociative", "inability to recall important personal information, usually traumatic, beyond ordinary forgetting.", ["psychogenic amnesia", "dissociative fugue"]),
  d("dpdr", "Depersonalization/derealization disorder", "dissociative", "persistent experiences of unreality of self or surroundings with reality testing intact.", ["depersonalisation", "derealisation", "DPDR"]),
  // Somatic
  d("somatic-symptom", "Somatic symptom disorder", "somatic", "distressing body symptoms with excessive thoughts, worry or time spent on them, persistent (typically 6+ months).", ["somatisation", "somatization"]),
  d("illness-anxiety", "Illness anxiety disorder", "somatic", "preoccupation with having a serious illness with few or no symptoms, for at least 6 months.", ["hypochondriasis", "health anxiety"]),
  d("fnd", "Functional neurological symptom disorder", "somatic", "a motor or sensory symptom with findings incompatible with known neurological disease.", ["conversion disorder", "dissociative convulsions", "PNES", "functional seizures"]),
  d("factitious", "Factitious disorder", "somatic", "faking or inducing illness with identified deception, even with no obvious outside reward.", ["Munchausen"]),
  // Eating
  d("anorexia", "Anorexia nervosa", "eating", "restricted intake leading to significantly low weight, with fear of weight gain and disturbed body image.", ["anorexia", "AN"]),
  d("bulimia", "Bulimia nervosa", "eating", "binges plus compensation (vomiting, laxatives, fasting, exercise) at least weekly for 3 months, without low weight.", ["bulimia", "BN"]),
  d("binge-eating", "Binge-eating disorder", "eating", "binges with loss of control at least weekly for 3 months, with marked distress and no regular compensation.", ["BED", "binge eating"]),
  d("arfid", "Avoidant/restrictive food intake disorder", "eating", "eating restricted by sensory dislike, low interest or fear of consequences, with weight or nutrition harm and no body-image concern.", ["ARFID", "picky eating"]),
  d("pica", "Pica", "eating", "eating non-food things for at least 1 month, inappropriate for developmental level.", []),
  // Sleep
  d("insomnia", "Insomnia disorder", "sleep", "trouble starting or staying asleep at least 3 nights a week for at least 3 months, despite the chance to sleep.", ["insomnia"]),
  d("narcolepsy", "Narcolepsy", "sleep", "irresistible sleep attacks 3+ times a week for 3 months, plus cataplexy, low hypocretin or short REM latency.", []),
  d("osa", "Obstructive sleep apnea hypopnea", "sleep", "5+ obstructive apneas or hypopneas per hour on a sleep study, with snoring or daytime sleepiness (or 15+ alone).", ["sleep apnoea", "sleep apnea", "OSA"]),
  d("rbd", "Rapid eye movement sleep behavior disorder", "sleep", "repeated vocalising or acting out dreams during REM sleep, usually more than 90 minutes after sleep onset.", ["REM behaviour disorder", "RBD"]),
  d("rls", "Restless legs syndrome", "sleep", "an urge to move the legs at rest, worse in the evening, relieved by movement, 3+ times a week for 3 months.", ["RLS", "Willis-Ekbom"]),
  d("nrem-arousal", "Non-rapid eye movement sleep arousal disorder", "sleep", "episodes of sleepwalking or sleep terrors from deep sleep, early in the night, with little or no memory.", ["sleepwalking", "sleep terrors", "somnambulism"]),
  // Disruptive
  d("odd", "Oppositional defiant disorder", "disruptive", "angry or irritable mood, arguing or spite, 4+ symptoms for at least 6 months.", ["ODD"]),
  d("conduct", "Conduct disorder", "disruptive", "3+ of 15 rule-breaking behaviours (aggression, destruction, theft, serious rule violation) in 12 months.", ["CD", "conduct problems"]),
  d("ied", "Intermittent explosive disorder", "disruptive", "recurrent outbursts out of proportion, e.g. verbal or non-damaging aggression twice weekly for 3 months.", ["IED", "anger outbursts"]),
  // Substance
  d("alcohol-use", "Alcohol use disorder", "substance", "2+ of 11 problems with alcohol (control, harm, craving, tolerance, withdrawal) within 12 months.", ["alcoholism", "alcohol dependence", "AUD"]),
  d("alcohol-withdrawal", "Alcohol withdrawal", "substance", "2+ signs (tremor, sweating, fast pulse, insomnia, nausea, hallucinations, agitation, anxiety, seizures) hours to days after heavy use stops.", ["delirium tremens", "DTs"]),
  d("korsakoff", "Alcohol-induced major neurocognitive disorder, amnestic-confabulatory type", "substance", "lasting severe memory loss with confabulation after long heavy drinking and thiamine deficiency, attention otherwise intact.", ["Korsakoff", "Wernicke-Korsakoff", "Korsakoff syndrome"]),
  d("opioid-use", "Opioid use disorder", "substance", "2+ of 11 problems with opioids within 12 months.", ["opioid dependence", "heroin addiction"]),
  d("opioid-withdrawal", "Opioid withdrawal", "substance", "3+ of: low mood, nausea, aches, tears/runny nose, big pupils/goosebumps/sweats, diarrhoea, yawning, fever, insomnia after stopping opioids.", ["opiate withdrawal", "cold turkey"]),
  d("cannabis-use", "Cannabis use disorder", "substance", "2+ of 11 problems with cannabis within 12 months.", ["cannabis dependence", "ganja", "bhang"]),
  d("cannabis-withdrawal", "Cannabis withdrawal", "substance", "3+ of irritability, anxiety, poor sleep, low appetite, restlessness, low mood or body symptoms within a week of stopping heavy use.", []),
  d("stimulant-use", "Stimulant use disorder", "substance", "2+ of 11 problems with amphetamine-type substances or cocaine within 12 months.", ["amphetamine", "cocaine", "methamphetamine"]),
  d("tobacco-use", "Tobacco use disorder", "substance", "2+ of 11 problems with tobacco within 12 months.", ["nicotine dependence", "gutka", "smoking"]),
  d("gambling", "Gambling disorder", "substance", "4+ of 9 problem-gambling signs within 12 months, not better explained by a manic episode.", ["pathological gambling", "betting addiction"]),
  // Neurocognitive
  d("delirium", "Delirium", "neurocognitive", "a disturbance of attention and awareness that develops over hours to days and fluctuates, with another cognitive change, from a physical cause.", ["acute confusional state"]),
  d("alzheimers", "Major neurocognitive disorder due to Alzheimer's disease", "neurocognitive", "insidious, steadily progressive decline in memory and learning plus another domain.", ["Alzheimer's", "dementia", "Alzheimer dementia"]),
  d("vascular-ncd", "Major vascular neurocognitive disorder", "neurocognitive", "decline tied in time to strokes, or prominent in attention and executive function, with evidence of cerebrovascular disease.", ["vascular dementia", "multi-infarct"]),
  d("lewy-ncd", "Major neurocognitive disorder with Lewy bodies", "neurocognitive", "decline with fluctuating attention, well-formed visual hallucinations and parkinsonism after the cognitive decline.", ["Lewy body dementia", "DLB"]),
  d("ftd", "Major frontotemporal neurocognitive disorder", "neurocognitive", "insidious change in behaviour (disinhibition, apathy, loss of empathy, compulsions, hyperorality) or language, with memory relatively spared.", ["frontotemporal dementia", "Pick's disease", "FTD"]),
  d("mild-ncd", "Mild neurocognitive disorder", "neurocognitive", "modest decline in one or more domains that does not stop independence in everyday activities.", ["mild cognitive impairment", "MCI"]),
  // Personality
  d("paranoid-pd", "Paranoid personality disorder", "personality", "pervasive distrust and suspicion of others' motives since early adulthood, without psychosis.", []),
  d("schizoid-pd", "Schizoid personality disorder", "personality", "pervasive detachment from relationships and restricted emotion; does not want closeness.", []),
  d("schizotypal-pd", "Schizotypal personality disorder", "personality", "acute discomfort with closeness, plus odd beliefs, perceptual oddities and eccentric behaviour since early adulthood.", ["schizotypy"]),
  d("antisocial-pd", "Antisocial personality disorder", "personality", "disregard for others' rights since 15, age at least 18, with conduct disorder before 15.", ["ASPD", "psychopathy", "sociopathy"]),
  d("borderline-pd", "Borderline personality disorder", "personality", "pervasive instability of relationships, self-image and mood, and marked impulsivity, 5+ of 9 features.", ["BPD", "emotionally unstable personality", "EUPD"]),
  d("histrionic-pd", "Histrionic personality disorder", "personality", "pervasive excessive emotionality and attention seeking since early adulthood.", []),
  d("narcissistic-pd", "Narcissistic personality disorder", "personality", "pervasive grandiosity, need for admiration and lack of empathy since early adulthood.", ["NPD"]),
  d("avoidant-pd", "Avoidant personality disorder", "personality", "pervasive social inhibition, feeling inadequate and hypersensitive to criticism, yet wanting relationships.", ["anxious personality"]),
  d("dependent-pd", "Dependent personality disorder", "personality", "pervasive need to be taken care of, with clinging and fear of separation.", []),
  d("ocpd", "Obsessive-compulsive personality disorder", "personality", "pervasive perfectionism, orderliness and control at the cost of flexibility, felt as right (not unwanted).", ["anankastic personality", "OCPD"]),
];

const BY_ID = new Map(DIAGNOSES.map((x) => [x.id, x]));

export function diagnosisById(id: string): Diagnosis | undefined {
  return BY_ID.get(id);
}

/** Lower-case, strip punctuation and the DSM's "disorder" filler so typing is forgiving. */
export function normaliseName(s: string): string {
  return s
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\b(disorder|the|of|a)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Search the list by name or alias (prefix-of-word matches first). Pure. */
export function searchDiagnoses(query: string, limit = 8): Diagnosis[] {
  const q = normaliseName(query);
  if (!q) return [];
  const scored: { dx: Diagnosis; s: number }[] = [];
  for (const dx of DIAGNOSES) {
    const names = [dx.name, ...dx.aka].map(normaliseName);
    let s = 0;
    for (const n of names) {
      if (n === q) s = Math.max(s, 100);
      else if (n.startsWith(q)) s = Math.max(s, 80);
      else if (n.split(" ").some((w) => w.startsWith(q))) s = Math.max(s, 60);
      else if (n.includes(q)) s = Math.max(s, 40);
    }
    if (s) scored.push({ dx, s });
  }
  return scored.sort((a, b) => b.s - a.s || a.dx.name.length - b.dx.name.length).slice(0, limit).map((x) => x.dx);
}
