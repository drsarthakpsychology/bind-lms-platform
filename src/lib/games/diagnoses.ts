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
  | "personality"
  | "elimination"
  | "sexual"
  | "gender"
  | "paraphilic"
  | "medication"
  | "other";

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
  elimination: { name: "Elimination disorders", module: "child", topic: "child" },
  sexual: { name: "Sexual dysfunctions", module: "more-disorders", topic: "sexual" },
  gender: { name: "Gender dysphoria", module: "more-disorders", topic: "gender" },
  paraphilic: { name: "Paraphilic disorders", module: "more-disorders", topic: "paraphilic" },
  medication: { name: "Medication-induced movement disorders and other adverse effects of medication", module: "antipsychotics", topic: "medication" },
  other: { name: "Other conditions that may be a focus of clinical attention", module: "suicide", topic: "clinical-attention" },
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
  // Added for the 500-case bank: more DSM-5-TR groups, ICD-11-only entries and conditions seen in liaison and emergency work.
  // Neurodevelopmental
  d("language", "Language disorder", "neurodevelopmental", "lasting trouble learning and using spoken or written language (small vocabulary, simple sentences, poor discourse), well below age, from early development, not explained by hearing loss.", ["expressive language delay", "receptive language disorder", "SLI"]),
  d("speech-sound", "Speech sound disorder", "neurodevelopmental", "lasting difficulty producing speech sounds that makes speech hard to understand, from early development, not due to a structural or hearing cause.", ["articulation disorder", "phonological disorder"]),
  d("stuttering", "Childhood-onset fluency disorder (stuttering)", "neurodevelopmental", "repeated sound or syllable repetitions, prolongations, blocks or broken words that disturb normal fluency, starting in early development.", ["stammering", "stuttering", "fluency disorder"]),
  d("scd", "Social (pragmatic) communication disorder", "neurodevelopmental", "lasting trouble with the social use of language and nonverbal communication, without the restricted, repetitive behaviour of autism.", ["pragmatic language disorder", "SPCD"]),
  d("dcd", "Developmental coordination disorder", "neurodevelopmental", "motor skills well below age (clumsiness, slow or inaccurate movement) that hurt daily life, starting early and not explained by another neurological condition.", ["dyspraxia", "clumsy child", "DCD"]),
  d("stereotypic", "Stereotypic movement disorder", "neurodevelopmental", "repetitive, seemingly driven, purposeless movements (rocking, hand flapping, head banging) starting in early development and causing harm or interference.", ["head banging", "body rocking"]),
  d("persistent-tic", "Persistent (chronic) motor or vocal tic disorder", "neurodevelopmental", "motor tics or vocal tics, but not both, for more than 1 year, starting before age 18.", ["chronic tic disorder"]),
  d("provisional-tic", "Provisional tic disorder", "neurodevelopmental", "single or multiple motor and/or vocal tics present for less than 1 year, starting before age 18.", ["transient tic disorder"]),
  // Psychotic
  d("catatonia", "Catatonia associated with another mental disorder", "psychotic", "3+ of 12 catatonic signs (stupor, mutism, posturing, waxy flexibility, negativism, echolalia, echopraxia and others) in the setting of a mental disorder.", ["catatonia", "catatonic stupor"]),
  d("catatonia-medical", "Catatonic disorder due to another medical condition", "psychotic", "3+ catatonic signs shown by history, examination or labs to be the direct effect of a medical illness, such as encephalitis.", ["organic catatonia"]),
  d("psychosis-medical", "Psychotic disorder due to another medical condition", "psychotic", "prominent hallucinations or delusions shown to be the direct effect of a medical illness, without delirium.", ["organic psychosis", "secondary psychosis", "epileptic psychosis"]),
  // Bipolar
  d("bipolar-medical", "Bipolar and related disorder due to another medical condition", "bipolar", "a distinct period of raised or irritable mood and energy that is the direct effect of a medical illness, such as hyperthyroidism or a brain lesion.", ["secondary mania", "organic mania"]),
  d("substance-bipolar", "Substance/medication-induced bipolar and related disorder", "bipolar", "raised or irritable mood and energy that starts during or soon after a substance or medicine able to cause it, such as steroids.", ["steroid-induced mania", "drug-induced mania"]),
  // Anxiety
  d("anxiety-medical", "Anxiety disorder due to another medical condition", "anxiety", "panic or anxiety shown by history, examination or labs to be the direct effect of a medical illness.", ["organic anxiety", "thyrotoxic anxiety"]),
  d("substance-anxiety", "Substance/medication-induced anxiety disorder", "anxiety", "panic or anxiety that starts during or soon after intoxication, withdrawal or a medicine able to cause it.", ["drug-induced anxiety", "caffeine-induced anxiety"]),
  // OCD and related
  d("olfactory-reference", "Olfactory reference disorder", "ocd", "lasting preoccupation with the belief that one gives off a foul body odour others don't notice, with repeated checking, showering or avoidance (an ICD-11 diagnosis).", ["olfactory reference syndrome", "body odour preoccupation", "jikoshu-kyofu"]),
  // Trauma
  d("dsed", "Disinhibited social engagement disorder", "trauma", "a child who approaches and goes off with unfamiliar adults with little hesitation, after extremes of insufficient care.", ["DSED", "indiscriminate friendliness"]),
  d("cptsd", "Complex post-traumatic stress disorder", "trauma", "full PTSD after prolonged or repeated trauma plus lasting problems with emotion control, a sense of self as worthless and difficulty in relationships (an ICD-11 diagnosis).", ["complex PTSD", "CPTSD", "C-PTSD"]),
  // Dissociative
  d("possession-trance", "Possession trance disorder", "dissociative", "trance episodes in which identity is replaced by an outside 'possessing' identity, unwanted and outside accepted cultural or religious practice (an ICD-11 diagnosis).", ["possession", "trance disorder", "dissociative trance"]),
  // Somatic
  d("psych-factors", "Psychological factors affecting other medical conditions", "somatic", "a medical illness is present and psychological or behavioural factors clearly worsen its course, treatment or risk.", ["psychosomatic"]),
  d("factitious-other", "Factitious disorder imposed on another", "somatic", "faking or inducing illness in another person (often a child) with identified deception, even with no obvious outside reward.", ["Munchausen by proxy", "fabricated or induced illness", "FII"]),
  d("dhat", "Dhat syndrome", "somatic", "a South Asian cultural concept of distress: anxiety, fatigue and body complaints blamed on loss of semen in urine or at night.", ["dhat", "semen loss anxiety"]),
  // Eating
  d("rumination", "Rumination disorder", "eating", "repeated bringing up of swallowed food (re-chewed, re-swallowed or spat out) for at least 1 month, not due to a medical cause.", ["regurgitation"]),
  // Elimination
  d("enuresis", "Enuresis", "elimination", "repeated passing of urine into bed or clothes, at least twice a week for 3 months (or with marked distress), at age 5 or older, not from a substance or medical cause.", ["bedwetting", "nocturnal enuresis"]),
  d("encopresis", "Encopresis", "elimination", "repeated passing of stool in inappropriate places at least once a month for 3 months, at age 4 or older.", ["soiling", "faecal incontinence in children"]),
  // Sleep
  d("hypersomnolence", "Hypersomnolence disorder", "sleep", "excessive sleepiness despite a main sleep of 7+ hours, with daytime lapses, unrefreshing long sleep or trouble waking, 3+ times a week for 3 months.", ["idiopathic hypersomnia", "hypersomnia"]),
  d("delayed-sleep-phase", "Circadian rhythm sleep-wake disorder, delayed sleep phase type", "sleep", "a body clock set late: can't fall asleep or wake at the usual times, but sleeps normally when allowed to keep the late schedule.", ["delayed sleep phase", "DSPD", "night owl"]),
  d("shift-work", "Circadian rhythm sleep-wake disorder, shift work type", "sleep", "insomnia during the main sleep period and sleepiness at work, linked to a regular schedule of night or rotating shifts.", ["shift work sleep disorder"]),
  d("nightmare", "Nightmare disorder", "sleep", "repeated long, vivid, frightening dreams remembered on waking, with rapid full alertness, causing distress.", ["nightmares", "dream anxiety"]),
  d("central-apnea", "Central sleep apnea", "sleep", "5+ central apneas per hour on a sleep study, where breathing effort stops, often with heart failure or opioid use.", ["central sleep apnoea", "Cheyne-Stokes breathing"]),
  // Sexual
  d("erectile", "Erectile disorder", "sexual", "trouble getting or keeping an erection, or reduced rigidity, on almost all occasions (75 to 100%) for about 6 months.", ["erectile dysfunction", "impotence", "ED"]),
  d("early-ejaculation", "Premature (early) ejaculation", "sexual", "ejaculation within about 1 minute of penetration and before wished, on almost all occasions for about 6 months.", ["premature ejaculation", "PE"]),
  d("delayed-ejaculation", "Delayed ejaculation", "sexual", "marked delay in, or absence of, ejaculation on almost all occasions of partnered sex for about 6 months, without wanting the delay.", ["retarded ejaculation", "anejaculation"]),
  d("fsiad", "Female sexual interest/arousal disorder", "sexual", "absent or reduced sexual interest or arousal, 3+ of 6 signs, for about 6 months, causing distress.", ["low libido in women", "FSIAD", "frigidity"]),
  d("gppd", "Genito-pelvic pain/penetration disorder", "sexual", "lasting difficulty with vaginal penetration, pain during it, fear of that pain, or pelvic floor tightening, for about 6 months.", ["vaginismus", "dyspareunia", "GPPPD"]),
  d("male-hsdd", "Male hypoactive sexual desire disorder", "sexual", "lasting lack of sexual thoughts, fantasies and desire for about 6 months, causing distress.", ["low libido in men"]),
  d("substance-sexual", "Substance/medication-induced sexual dysfunction", "sexual", "a sexual problem that starts with, or soon after a dose increase of, a substance or medicine able to cause it, such as an SSRI.", ["SSRI sexual dysfunction", "drug-induced sexual dysfunction"]),
  // Gender
  d("gender-dysphoria", "Gender dysphoria", "gender", "a marked mismatch between experienced and assigned gender for at least 6 months, with distress or impairment.", ["gender identity disorder", "gender incongruence"]),
  // Disruptive
  d("kleptomania", "Kleptomania", "disruptive", "repeated failure to resist urges to steal things not needed, with tension before and relief after, not out of anger, delusion, conduct problems or mania.", ["compulsive stealing"]),
  d("pyromania", "Pyromania", "disruptive", "deliberate fire setting more than once, with tension before, fascination with fire and relief after, not for gain, revenge or from another disorder.", ["fire setting", "arson"]),
  // Paraphilic
  d("exhibitionistic", "Exhibitionistic disorder", "paraphilic", "for 6+ months, recurrent intense sexual arousal from exposing one's genitals to an unsuspecting stranger, acted on or causing distress.", ["exhibitionism", "flashing"]),
  d("frotteuristic", "Frotteuristic disorder", "paraphilic", "for 6+ months, recurrent intense sexual arousal from touching or rubbing against a non-consenting person, acted on or causing distress.", ["frotteurism"]),
  d("fetishistic", "Fetishistic disorder", "paraphilic", "for 6+ months, recurrent intense sexual arousal from non-living objects or non-genital body parts, causing distress or impairment.", ["fetishism"]),
  // Substance
  d("alcohol-intox", "Alcohol intoxication", "substance", "recent drinking, behaviour change, and 1+ of slurred speech, poor coordination, unsteady gait, nystagmus, poor attention or memory, stupor or coma.", ["drunkenness", "acute alcohol intoxication"]),
  d("sedative-use", "Sedative, hypnotic, or anxiolytic use disorder", "substance", "2+ of 11 problems with benzodiazepines, z-drugs or similar medicines within 12 months.", ["benzodiazepine dependence", "alprazolam addiction", "sleeping pill addiction"]),
  d("sedative-withdrawal", "Sedative, hypnotic, or anxiolytic withdrawal", "substance", "2+ of autonomic overactivity, tremor, insomnia, nausea, hallucinations, agitation, anxiety or seizures after cutting down long use of a sedative.", ["benzodiazepine withdrawal"]),
  d("stimulant-intox", "Stimulant intoxication", "substance", "recent amphetamine or cocaine use with behaviour change and 2+ of fast or slow pulse, big pupils, raised or low blood pressure, sweats or chills, nausea, weight loss, agitation, weakness, chest pain or confusion.", ["cocaine intoxication", "meth high"]),
  d("opioid-intox", "Opioid intoxication", "substance", "recent opioid use with pinpoint pupils plus 1+ of drowsiness or coma, slurred speech, or poor attention or memory.", ["opioid overdose", "heroin overdose"]),
  d("cannabis-intox", "Cannabis intoxication", "substance", "recent cannabis use with behaviour change and 2+ of red eyes, more appetite, dry mouth or fast pulse within 2 hours.", ["bhang intoxication", "stoned"]),
  d("caffeine-intox", "Caffeine intoxication", "substance", "recent high caffeine intake (usually well over 250 mg) with 5+ signs such as restlessness, nervousness, insomnia, flushing, frequent urination, gut upset, twitching or fast pulse.", ["caffeinism", "energy drink overdose"]),
  d("inhalant-use", "Inhalant use disorder", "substance", "2+ of 11 problems with sniffing glue, whitener, petrol or similar volatile substances within 12 months.", ["solvent abuse", "whitener sniffing", "glue sniffing"]),
  d("hppd", "Hallucinogen persisting perception disorder", "substance", "after stopping a hallucinogen, re-experiencing its perceptual effects (trails, flashes, halos) with insight that they are not real.", ["HPPD", "flashbacks"]),
  d("gaming", "Gaming disorder", "substance", "for usually 12 months, poor control over gaming, gaming taking priority over other life, and carrying on despite harm (an ICD-11 diagnosis; a DSM-5-TR condition for further study).", ["internet gaming disorder", "video game addiction", "PUBG addiction"]),
  // Neurocognitive
  d("tbi-ncd", "Neurocognitive disorder due to traumatic brain injury", "neurocognitive", "cognitive decline starting right after a head injury with loss of consciousness, amnesia, disorientation or neurological signs, persisting past the acute period.", ["post-concussional", "TBI", "head injury dementia"]),
  d("parkinson-ncd", "Neurocognitive disorder due to Parkinson's disease", "neurocognitive", "insidious cognitive decline in someone with established Parkinson's disease, where the movement disorder came clearly first.", ["Parkinson's disease dementia", "Parkinson dementia"]),
  d("huntington-ncd", "Neurocognitive disorder due to Huntington's disease", "neurocognitive", "insidious cognitive and behavioural decline with chorea, in someone with Huntington's disease or a family history or gene test showing it.", ["Huntington's chorea", "Huntington disease"]),
  d("hiv-ncd", "Neurocognitive disorder due to HIV infection", "neurocognitive", "cognitive decline in documented HIV infection, often slowed thinking and poor executive function, not better explained by another brain illness.", ["HIV dementia", "HAND"]),
  d("prion-ncd", "Neurocognitive disorder due to prion disease", "neurocognitive", "insidious but rapidly progressive decline with myoclonus or ataxia, from prion disease such as Creutzfeldt-Jakob disease.", ["CJD", "Creutzfeldt-Jakob"]),
  d("ncd-medical", "Neurocognitive disorder due to another medical condition", "neurocognitive", "cognitive decline shown by history, examination or labs to be the effect of another medical illness, such as B12 deficiency, hypothyroidism or normal-pressure hydrocephalus.", ["reversible dementia", "NPH", "B12 deficiency dementia"]),
  d("personality-change", "Personality change due to another medical condition", "personality", "a lasting change from the person's previous personality shown to be the direct effect of a medical illness, such as a frontal brain injury.", ["organic personality disorder", "frontal lobe syndrome"]),
  // Medication-induced
  d("nms", "Neuroleptic malignant syndrome", "medication", "fever, severe rigidity, confusion and unstable pulse and blood pressure, with raised creatine kinase, after a dopamine blocker was started or raised.", ["NMS"]),
  d("serotonin-syndrome", "Serotonin syndrome", "medication", "agitation, fever, sweating, tremor, clonus and brisk reflexes within hours of adding or raising serotonergic medicines (classed as another adverse effect of medication).", ["serotonin toxicity"]),
  d("acute-dystonia", "Medication-induced acute dystonia", "medication", "sustained abnormal muscle spasms or postures (neck, jaw, eyes, tongue) within days of starting or raising a dopamine blocker.", ["acute dystonic reaction", "oculogyric crisis", "torticollis"]),
  d("akathisia", "Medication-induced acute akathisia", "medication", "inner restlessness with fidgeting, rocking or pacing, usually within 4 weeks of starting or raising a medicine that can cause it.", ["akathisia"]),
  d("med-parkinsonism", "Medication-induced parkinsonism", "medication", "tremor, rigidity, slowness or a shuffling walk within a few weeks of starting or raising a dopamine blocker.", ["drug-induced parkinsonism", "EPS"]),
  d("tardive-dyskinesia", "Tardive dyskinesia", "medication", "involuntary chewing, tongue, face or limb movements for at least 4 weeks after at least 3 months of a dopamine blocker (1 month if 60 or older).", ["TD", "orofacial dyskinesia"]),
  d("ad-discontinuation", "Antidepressant discontinuation syndrome", "medication", "dizziness, 'electric shock' sensations, flu-like aches, poor sleep and irritability within days of stopping or cutting an antidepressant taken for at least a month.", ["SSRI discontinuation", "antidepressant withdrawal", "brain zaps"]),
  d("lithium-toxicity", "Lithium toxicity", "medication", "coarse tremor, vomiting, diarrhoea, unsteadiness, slurred speech and confusion from a raised lithium level (classed as another adverse effect of medication).", ["lithium poisoning"]),
  // Other conditions that may be a focus of clinical attention
  d("nssi", "Nonsuicidal self-injury", "other", "deliberate self-harm such as cutting or burning without intent to die, on 5 or more days in the past year, to relieve distress or solve a problem.", ["self-harm", "cutting", "NSSI"]),
  d("malingering", "Malingering", "other", "intentionally faking or exaggerating symptoms for an outside reward, such as money, leave or avoiding a court case.", ["faking", "feigning"]),
  d("bereavement", "Uncomplicated bereavement", "other", "a normal grief reaction to a death: sadness in waves tied to the loss, self-esteem kept, and coping slowly returning.", ["normal grief", "mourning"]),
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
