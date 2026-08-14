/**
 * Enriched student + clinical summaries for ANXIOLYTICS / HYPNOTICS / SEDATIVES
 * and the remaining psychopharm classes (benzodiazepines, Z-drugs, azapirone,
 * antihistamines, orexin/melatonin hypnotics, stimulants, non-stimulant ADHD,
 * wakefulness agents, cholinesterase inhibitors, NMDA antagonists,
 * substance-use agents, and miscellaneous "other" agents).
 *
 * Source material: Stahl Essential Psychopharmacology (7th ed.) monograph
 * extraction + KNOWLEDGE_BASE.json (FDA-label-backed field rows). No medical
 * facts are invented; uncertain points are flagged inline.
 *
 * Shape matches the task spec:
 *   { generic_name, drug_class, plain_language, mechanism,
 *     common_uses: string[], side_effects: string[], monitoring: string[] }
 */

export type EnrichedDrug = {
  generic_name: string;
  drug_class: string;
  plain_language: string;
  mechanism: string;
  common_uses: string[];
  side_effects: string[];
  monitoring: string[];
};

export const ENRICHED_OTHERS: EnrichedDrug[] = [
  // ===========================================================================
  // BENZODIAZEPINES — anxiolytics / hypnotics
  // ===========================================================================
  {
    generic_name: "Alprazolam",
    drug_class: "Benzodiazepine",
    plain_language:
      "Alprazolam turns up the brain's brake pedal (GABA) to calm racing thoughts and panic, fast. It is quick and strong, but the body gets used to it, so it is usually a short-term tool and stopping suddenly is dangerous — tapering is the prescriber's job, never the client's.",
    mechanism:
      "Binds benzodiazepine receptors on the GABA-A chloride channel complex, enhancing GABA-mediated inhibition; metabolized by CYP3A4 (so strong 3A4 inhibitors raise levels).",
    common_uses: [
      "Generalized anxiety disorder (GAD)",
      "Panic disorder (IR and XR)",
      "Other anxiety disorders / anxiety with depression",
      "Premenstrual dysphoric disorder",
      "Acute mania or psychosis (adjunctive)",
    ],
    side_effects: [
      "Sedation, fatigue, depression",
      "Dizziness, ataxia, slurred speech",
      "Forgetfulness, confusion",
      "Hyperexcitability, nervousness",
      "Rare hypotension, dry mouth",
      "Risk of dependence and withdrawal",
    ],
    monitoring: [
      "Watch for sedation and falls, especially at start / dose changes",
      "Monitor for misuse, tolerance, and dependence",
      "CYP3A4 inhibitors (grapefruit, fluvoxamine) raise levels — lower dose",
      "Do not combine with opioids (fatal respiratory depression risk)",
    ],
  },
  {
    generic_name: "Chlordiazepoxide",
    drug_class: "Benzodiazepine",
    plain_language:
      "An older, long-acting benzo used mostly for anxiety and to safely cover alcohol withdrawal (it smooths the shaking and agitation). It calms by turning up GABA, and it builds up in the body, so effects last a long time.",
    mechanism:
      "Binds benzodiazepine receptors at the GABA-A complex, enhancing inhibitory GABA signaling; long half-life (24–48 h) with active metabolites.",
    common_uses: [
      "Anxiety disorders / short-term anxiety relief",
      "Acute alcohol withdrawal",
      "Preoperative apprehension and anxiety",
    ],
    side_effects: [
      "Drowsiness, ataxia, confusion (especially elderly)",
      "Sedation, fatigue",
      "Dizziness, weakness",
      "Dependence and withdrawal on long use",
    ],
    monitoring: [
      "Watch sedation / falls in older or debilitated patients",
      "Monitor alcohol-withdrawal symptoms during detox",
      "Avoid with opioids (respiratory depression risk)",
      "Assess for tolerance with long-term use",
    ],
  },
  {
    generic_name: "Clonazepam",
    drug_class: "Benzodiazepine",
    plain_language:
      "A longer-acting benzo used for panic and several seizure types. It is a strong brake (GABA), so it also slows thinking and reactions; the body adapts, so stopping must be tapered by the prescriber.",
    mechanism:
      "Enhances GABA-A inhibitory signaling; long half-life (~30–40 h), CYP3A4 substrate.",
    common_uses: [
      "Panic disorder (with or without agoraphobia)",
      "Lennox-Gastaut and absence/akinetic/myoclonic seizures",
      "Other anxiety disorders",
      "Acute mania / psychosis (adjunctive)",
    ],
    side_effects: [
      "Sedation, fatigue, depression",
      "Dizziness, ataxia, slurred speech",
      "Forgetfulness, confusion",
      "Rare grand mal seizures",
      "Dependence and withdrawal risk",
    ],
    monitoring: [
      "Monitor sedation and psychomotor slowing",
      "Watch for tolerance and dependence",
      "Caution in significant liver disease (contraindicated)",
      "Avoid opioids (boxed warning on combined CNS depression)",
    ],
  },
  {
    generic_name: "Clorazepate",
    drug_class: "Benzodiazepine",
    plain_language:
      "A long-acting benzo (a prodrug that becomes nordiazepam) used for anxiety, alcohol withdrawal, and as a seizure add-on. It calms through GABA and lingers for about two days in the body.",
    mechanism:
      "Prodrug converted to nordiazepam; enhances GABA-A inhibition; serum half-life ~2 days.",
    common_uses: [
      "Anxiety disorders / short-term anxiety relief",
      "Acute alcohol withdrawal",
      "Partial seizures (adjunct)",
    ],
    side_effects: [
      "Sedation, fatigue",
      "Dizziness, ataxia, slurred speech",
      "Forgetfulness, confusion",
      "Dependence and withdrawal",
    ],
    monitoring: [
      "Watch sedation / falls, especially elderly",
      "Monitor alcohol-withdrawal control",
      "Avoid opioids (respiratory depression)",
      "Assess for tolerance and dependence",
    ],
  },
  {
    generic_name: "Diazepam",
    drug_class: "Benzodiazepine",
    plain_language:
      "A long-acting benzo used for anxiety, muscle spasm, alcohol withdrawal, and seizures. It is a fast-acting brake (GABA) but accumulates in the body over days; it can make people foggy and dependent, so long-term anxiety is usually better treated with an SSRI/SNRI.",
    mechanism:
      "Binds benzodiazepine receptors at the GABA-A chloride channel complex, enhancing GABA inhibition; half-life 20–50 h with active metabolites (CYP2C19/3A4).",
    common_uses: [
      "Anxiety disorders / short-term anxiety relief",
      "Alcohol withdrawal (delirium tremens, agitation, tremor)",
      "Muscle spasm and spasticity",
      "Seizures / status epilepticus (injection, adjunct)",
      "Preoperative sedation (IV)",
    ],
    side_effects: [
      "Sedation, fatigue, depression",
      "Dizziness, ataxia, slurred speech",
      "Forgetfulness, confusion",
      "Rare hypotension, dry mouth",
      "Dependence and withdrawal",
    ],
    monitoring: [
      "Watch sedation, ataxia, and falls",
      "Monitor for tolerance and dependence",
      "Avoid opioids and other CNS depressants",
      "Consider periodic liver tests / blood counts in long-term use with seizures",
    ],
  },
  {
    generic_name: "Estazolam",
    drug_class: "Benzodiazepine",
    plain_language:
      "An intermediate-acting benzo sleeping pill for insomnia (trouble falling and staying asleep). It is a short-term tool; longer use leads to tolerance, rebound insomnia, and dependence.",
    mechanism:
      "Enhances GABA-A inhibition in sleep centers; half-life 10–24 h; CYP3A4 substrate.",
    common_uses: [
      "Insomnia (sleep onset and maintenance)",
      "Short-term management only",
    ],
    side_effects: [
      "Sedation, fatigue",
      "Dizziness, ataxia",
      "Forgetfulness, confusion",
      "Rebound insomnia on withdrawal",
      "Dependence risk",
    ],
    monitoring: [
      "Keep use short-term (7–10 days)",
      "Watch next-day sedation / falls",
      "Avoid opioids (CNS depression)",
      "Assess for tolerance and rebound insomnia",
    ],
  },
  {
    generic_name: "Flunitrazepam",
    drug_class: "Benzodiazepine",
    plain_language:
      "A potent benzo hypnotic used for severe, disabling insomnia (and not marketed in the US). It is very sedating, amnestic, and carries high misuse potential, so it is tightly controlled where available.",
    mechanism:
      "Enhances GABA-A inhibition; half-life 16–35 h with an active metabolite (23–33 h).",
    common_uses: [
      "Severe, disabling insomnia (short-term)",
      "Catatonia (off-label adjunct)",
    ],
    side_effects: [
      "Sedation, fatigue",
      "Dizziness, ataxia, amnesia",
      "Forgetfulness, confusion",
      "Rebound insomnia on withdrawal",
      "High abuse / dependence potential",
    ],
    monitoring: [
      "Reserve for severe, disabling insomnia",
      "Watch amnesia and next-day impairment",
      "Monitor for misuse and dependence",
      "Avoid alcohol and CNS depressants",
    ],
  },
  {
    generic_name: "Flurazepam",
    drug_class: "Benzodiazepine",
    plain_language:
      "An old, long-acting benzo sleeping pill. Because it has a very long half-life (and active metabolites), it can cause next-day grogginess and 'hangover' — generally a short-term option for insomnia.",
    mechanism:
      "Enhances GABA-A inhibition in sleep centers; half-life ~24–100 h with active metabolites.",
    common_uses: [
      "Insomnia (sleep onset and maintenance)",
      "Recurring insomnia / poor sleep habits (short-term)",
    ],
    side_effects: [
      "Daytime sedation / hangover",
      "Dizziness, ataxia",
      "Forgetfulness, confusion",
      "Rebound insomnia on withdrawal",
      "Dependence risk",
    ],
    monitoring: [
      "Keep use short-term",
      "Watch next-day impairment and falls",
      "Lower dose in women / elderly (slower clearance)",
      "Avoid opioids (respiratory depression)",
    ],
  },
  {
    generic_name: "Loflazepate",
    drug_class: "Benzodiazepine",
    plain_language:
      "An ultra-long-acting benzo (used mainly outside the US) for anxiety, tension, depression, or sleep tied to neurosis/psychosomatic illness. Its extremely long half-life means it lingers for many days, which softens withdrawal but can cause accumulation.",
    mechanism:
      "Enhances GABA-A inhibition; ultra-long elimination half-life (~122 h) with active metabolite.",
    common_uses: [
      "Anxiety / tension in neurosis or psychosomatic disease",
      "Associated depression or sleep disorder",
    ],
    side_effects: [
      "Sedation, fatigue",
      "Dizziness, ataxia",
      "Forgetfulness, confusion",
      "Dependence and withdrawal (slower due to long half-life)",
    ],
    monitoring: [
      "Watch accumulation and daytime sedation",
      "Monitor for dependence",
      "Avoid abrupt discontinuation (convulsions reported with certain TCA combos)",
      "Avoid other CNS depressants",
    ],
  },
  {
    generic_name: "Lorazepam",
    drug_class: "Benzodiazepine",
    plain_language:
      "A short-to-intermediate benzo that calms quickly and is cleared without active metabolites, so it is commonly used for acute anxiety, agitation, and catatonia. It still causes dependence and sedation with regular use.",
    mechanism:
      "Enhances GABA-A inhibition; half-life 10–20 h, no active metabolites (glucuronidated, not CYP-dependent).",
    common_uses: [
      "Anxiety disorders / anxiety with depressive symptoms",
      "Status epilepticus (injection)",
      "Preanesthetic sedation (injection)",
      "Insomnia, muscle spasm, alcohol withdrawal",
      "Acute agitation / catatonia",
    ],
    side_effects: [
      "Sedation, fatigue",
      "Dizziness, ataxia, slurred speech",
      "Forgetfulness, confusion",
      "Rare hypotension",
      "Dependence and withdrawal",
    ],
    monitoring: [
      "Watch sedation, ataxia, and falls",
      "Monitor for tolerance and dependence",
      "Caution with valproate / probenecid (raise levels)",
      "Avoid opioids (respiratory depression)",
    ],
  },
  {
    generic_name: "Midazolam",
    drug_class: "Benzodiazepine",
    plain_language:
      "A very fast, short-acting benzo given by IV or injection for sedation before procedures and for drug-induced amnesia. It is not a routine anxiety medication — it is a hospital/procedure drug because it can suppress breathing.",
    mechanism:
      "Enhances GABA-A inhibition; rapid onset (3–5 min IV), half-life 1.8–6.4 h with an active metabolite.",
    common_uses: [
      "Procedural sedation (adjunct to anesthesia)",
      "Preoperative anxiolysis",
      "Drug-induced amnesia",
      "Pediatric sedation",
    ],
    side_effects: [
      "Oversedation, impaired recall",
      "Respiratory depression, apnea",
      "Hypotension",
      "Nausea, vomiting, hiccups",
      "Agitation, involuntary movements",
    ],
    monitoring: [
      "Continuous respiratory and cardiovascular monitoring",
      "Reduce dose in elderly / with other CNS depressants",
      "Watch for CYP3A4 inhibitors (raise levels)",
      "Hospital/procedure setting only",
    ],
  },
  {
    generic_name: "Oxazepam",
    drug_class: "Benzodiazepine",
    plain_language:
      "A short-to-intermediate benzo with no active metabolites, often chosen for older adults or people with liver issues because it is metabolized simply (glucuronidated). It is used for anxiety and alcohol withdrawal.",
    mechanism:
      "Enhances GABA-A inhibition; half-life 3–21 h, no active metabolites (glucuronidated).",
    common_uses: [
      "Anxiety",
      "Anxiety associated with depression",
      "Alcohol withdrawal",
    ],
    side_effects: [
      "Transient drowsiness (first few days)",
      "Sedation, fatigue",
      "Dizziness, ataxia",
      "Rare paradoxical excitement",
      "Dependence and withdrawal",
    ],
    monitoring: [
      "Watch initial drowsiness and falls",
      "Preferred in hepatic impairment / elderly",
      "Monitor for dependence",
      "Avoid opioids (respiratory depression)",
    ],
  },
  {
    generic_name: "Quazepam",
    drug_class: "Benzodiazepine",
    plain_language:
      "A long-acting benzo sleeping pill. It works for both falling and staying asleep but can carry next-day grogginess due to its long half-life and active metabolite.",
    mechanism:
      "Enhances GABA-A inhibition in sleep centers; half-life 25–41 h with active metabolite; partly CYP3A4.",
    common_uses: [
      "Insomnia (sleep onset and maintenance)",
      "Short-term treatment",
    ],
    side_effects: [
      "Sedation, fatigue",
      "Dizziness, ataxia",
      "Forgetfulness, confusion",
      "Rebound insomnia on withdrawal",
      "Dependence risk",
    ],
    monitoring: [
      "Keep use short-term",
      "Watch next-day impairment / falls",
      "CYP3A4 inhibitors raise levels",
      "Avoid opioids (respiratory depression)",
    ],
  },
  {
    generic_name: "Temazepam",
    drug_class: "Benzodiazepine",
    plain_language:
      "An intermediate-acting benzo sleeping pill for short-term insomnia. It helps people fall asleep and stay asleep, but tolerance and rebound insomnia develop with continued use.",
    mechanism:
      "Enhances GABA-A inhibition in sleep centers; half-life ~8–15 h, no active metabolites.",
    common_uses: [
      "Short-term insomnia (7–10 days)",
      "Sleep-onset difficulty",
    ],
    side_effects: [
      "Sedation, fatigue",
      "Dizziness, ataxia",
      "Forgetfulness, confusion",
      "Rebound insomnia on withdrawal",
      "Dependence risk",
    ],
    monitoring: [
      "Keep use short-term",
      "Start low in elderly (7.5 mg)",
      "Watch next-day sedation",
      "Avoid opioids and alcohol",
    ],
  },
  {
    generic_name: "Triazolam",
    drug_class: "Benzodiazepine",
    plain_language:
      "An ultra-short-acting benzo for falling asleep. It kicks in fast and leaves the body quickly, but it is more likely to cause anterograde amnesia and rebound insomnia than longer agents.",
    mechanism:
      "Enhances GABA-A inhibition in sleep centers; half-life 1.5–5.5 h; CYP3A4 substrate (strong 3A4 inhibitors are contraindicated).",
    common_uses: [
      "Short-term insomnia (7–10 days)",
      "Sleep-onset difficulty",
    ],
    side_effects: [
      "Sedation",
      "Dizziness, ataxia",
      "Anterograde amnesia",
      "Rebound insomnia on withdrawal",
      "Dependence risk",
    ],
    monitoring: [
      "Keep use short-term",
      "Watch amnesia and next-day impairment",
      "Strong CYP3A4 inhibitors contraindicated",
      "Avoid opioids (respiratory depression)",
    ],
  },

  // ===========================================================================
  // Z-DRUGS (non-benzodiazepine hypnotics)
  // ===========================================================================
  {
    generic_name: "Zolpidem",
    drug_class: "Z-drug (non-benzodiazepine hypnotic)",
    plain_language:
      "A short-acting sleep aid that targets a narrow part of the same GABA system as benzos, which makes it more selective for sleep. It works quickly for falling asleep; rare but serious 'complex sleep behaviors' (sleep-walking, sleep-driving) mean it must be taken right at bedtime.",
    mechanism:
      "Positive modulator selective for the alpha-1 subtype of the GABA-A benzodiazepine site; half-life ~2.5 h.",
    common_uses: [
      "Short-term insomnia (sleep initiation)",
      "Middle-of-night awakening (Intermezzo, with 4+ h remaining in bed)",
      "Controlled-release for sleep maintenance",
    ],
    side_effects: [
      "Sedation",
      "Dizziness, ataxia",
      "Dose-dependent amnesia",
      "Headache, nausea",
      "Complex sleep behaviors (rare but serious)",
    ],
    monitoring: [
      "Take immediately before bed with 7–8 h available",
      "Lower dose in women / elderly",
      "Stop if complex sleep behaviors occur",
      "Avoid alcohol and CNS depressants",
    ],
  },
  {
    generic_name: "Zopiclone",
    drug_class: "Z-drug (non-benzodiazepine hypnotic)",
    plain_language:
      "A short-acting sleep aid (similar to zolpidem) used for insomnia; commonly noted for a bitter/metallic taste. It targets the same GABA sleep pathway selectively.",
    mechanism:
      "Binds selectively to the alpha-1 subtype of the GABA-A benzodiazepine site; half-life ~3.5–6.5 h; CYP3A4 substrate.",
    common_uses: [
      "Short-term insomnia",
    ],
    side_effects: [
      "Sedation",
      "Dizziness, ataxia",
      "Dose-dependent amnesia",
      "Bitter taste, dry mouth",
      "Dependence risk",
    ],
    monitoring: [
      "Keep use short-term",
      "Watch next-day sedation",
      "Avoid in severe respiratory impairment / myasthenia gravis",
      "Monitor for dependence and tolerance",
    ],
  },
  {
    generic_name: "Eszopiclone",
    drug_class: "Z-drug (non-benzodiazepine hypnotic)",
    plain_language:
      "The active isomer of zopiclone, used for both falling and staying asleep (studied up to 6 months). It can leave a metallic taste and, rarely, cause complex sleep behaviors.",
    mechanism:
      "Interacts with GABA-receptor complexes near benzodiazepine binding domains; half-life ~6 h; CYP3A4/2E1.",
    common_uses: [
      "Insomnia (sleep onset and maintenance)",
      "Primary, chronic, and transient insomnia",
      "Residual insomnia after antidepressant treatment",
    ],
    side_effects: [
      "Sedation",
      "Dizziness",
      "Dose-dependent amnesia",
      "Dry mouth, unpleasant taste",
      "Complex sleep behaviors (rare)",
    ],
    monitoring: [
      "Start 1 mg; use lowest effective dose",
      "Take immediately before bed with 7–8 h available",
      "Watch next-day driving impairment at 2–3 mg",
      "Avoid alcohol and CNS depressants",
    ],
  },
  {
    generic_name: "Zaleplon",
    drug_class: "Z-drug (non-benzodiazepine hypnotic)",
    plain_language:
      "An ultra-short sleep aid for falling asleep quickly. Because it clears in about an hour, it is sometimes used for middle-of-night waking, but it does not reliably keep people asleep.",
    mechanism:
      "Selective alpha-1 GABA-A benzodiazepine-site modulator; terminal half-life ~1 h.",
    common_uses: [
      "Short-term insomnia (sleep onset)",
      "Middle-of-night awakening",
    ],
    side_effects: [
      "Sedation",
      "Dizziness",
      "Dose-dependent amnesia",
      "Headache",
      "Complex sleep behaviors (rare)",
    ],
    monitoring: [
      "Keep use short-term",
      "Not shown to increase total sleep time",
      "Lower dose (5 mg) in elderly / hepatic impairment",
      "Avoid alcohol and CNS depressants",
    ],
  },

  // ===========================================================================
  // AZAPIRONE
  // ===========================================================================
  {
    generic_name: "Buspirone",
    drug_class: "Azapirone (5-HT1A partial agonist)",
    plain_language:
      "A non-addictive anxiety medicine that works on serotonin rather than GABA. Unlike benzos it is not sedating and has no abuse potential, but it takes weeks to build effect, so it is not for 'as-needed' panic relief.",
    mechanism:
      "Partial agonist at serotonin 5-HT1A receptors (postsynaptic and presynaptic autoreceptors), modulating serotonergic tone.",
    common_uses: [
      "Anxiety disorders / short-term anxiety relief",
      "Mixed anxiety and depression",
      "Treatment-resistant depression (adjunct)",
    ],
    side_effects: [
      "Dizziness, lightheadedness",
      "Headache",
      "Nausea",
      "Nervousness, excitement",
      "Sedation (less than benzos)",
    ],
    monitoring: [
      "Allow 2–4 weeks for effect",
      "Take consistently with regard to food",
      "Caution with MAOIs and CYP3A4 inhibitors",
      "No abuse potential — useful alternative to benzos",
    ],
  },

  // ===========================================================================
  // ANTIHISTAMINES (sedating)
  // ===========================================================================
  {
    generic_name: "Diphenhydramine",
    drug_class: "Antihistamine (H1 antagonist)",
    plain_language:
      "A common over-the-counter antihistamine that also causes drowsiness, so it is widely used for occasional sleeplessness and for drug-induced movement side effects (parkinsonism). It dries the mouth and can cause confusion in older adults.",
    mechanism:
      "Blocks histamine H1 receptors (sedating) and reduces excess acetylcholine activity that appears when dopamine is blocked (antiparkinsonian action).",
    common_uses: [
      "Allergy symptoms",
      "Motion sickness",
      "Occasional sleeplessness",
      "Drug-induced parkinsonism / parkinsonism",
    ],
    side_effects: [
      "Sedation, dizziness",
      "Dry mouth, blurred vision",
      "Constipation, nausea",
      "Urinary retention",
      "Confusion (especially elderly)",
    ],
    monitoring: [
      "Caution in older adults (anticholinergic / confusion risk)",
      "Watch for urinary retention and constipation",
      "Avoid with other anticholinergics or CNS depressants",
      "Short-term for sleep only",
    ],
  },
  {
    generic_name: "Hydroxyzine",
    drug_class: "Antihistamine (H1 antagonist)",
    plain_language:
      "A prescription antihistamine used off-label for anxiety and for itching, and as a pre-procedure sedative. It is calming but non-addictive, though it can be sedating and drying.",
    mechanism:
      "Blocks histamine H1 receptors; suppresses activity in certain subcortical CNS regions (anxiolytic/sedative).",
    common_uses: [
      "Anxiety and tension (psychoneurosis)",
      "Pruritus (itching) from allergic conditions",
      "Premedication sedation",
      "Alcohol withdrawal / delirium tremens (adjunct, injection)",
    ],
    side_effects: [
      "Dry mouth",
      "Sedation (often transient)",
      "Tremor",
      "Rare seizures at high doses",
      "Rare QT prolongation concerns at high dose",
    ],
    monitoring: [
      "Watch sedation, especially at start",
      "Reduce other CNS depressants when combined",
      "Contraindicated in early pregnancy",
      "Caution in elderly (anticholinergic effects)",
    ],
  },

  // ===========================================================================
  // OREXIN RECEPTOR ANTAGONISTS (DORA)
  // ===========================================================================
  {
    generic_name: "Lemborexant",
    drug_class: "Orexin receptor antagonist (DORA)",
    plain_language:
      "A newer sleep medicine that works differently from benzos — it dials down the brain's 'stay awake' signal (orexin) rather than turning up the brake. It is not a controlled substance with the same abuse profile, but it can still cause daytime grogginess and rare sleep paralysis.",
    mechanism:
      "Antagonizes orexin OX1R and OX2R receptors, suppressing the wake-promoting orexin neuropeptide system.",
    common_uses: [
      "Insomnia (sleep onset and/or maintenance)",
    ],
    side_effects: [
      "Somnolence / daytime impairment",
      "Headache",
      "Abnormal dreams",
      "Rare sleep paralysis, hypnagogic hallucinations",
      "Cataplexy-like symptoms (rare)",
    ],
    monitoring: [
      "Take at bedtime with 7+ h available",
      "Contraindicated in narcolepsy",
      "Avoid strong/moderate CYP3A4 inhibitors",
      "Watch next-day somnolence (may persist days)",
    ],
  },
  {
    generic_name: "Suvorexant",
    drug_class: "Orexin receptor antagonist (DORA)",
    plain_language:
      "The first orexin-blocking sleep medicine. It turns down the brain's wake signal to allow sleep, rather than sedating via GABA like benzos. Lower abuse potential, but daytime grogginess and rare sleep paralysis can occur.",
    mechanism:
      "Antagonizes orexin OX1R and OX2R receptors, reducing wake drive.",
    common_uses: [
      "Insomnia (sleep onset and/or maintenance)",
    ],
    side_effects: [
      "Somnolence / daytime impairment",
      "Headache, dizziness",
      "Abnormal dreams",
      "Rare sleep paralysis / hypnagogic hallucinations",
      "Worsening depression / suicidal ideation (monitor)",
    ],
    monitoring: [
      "Take within 30 min of bed with 7+ h available",
      "Contraindicated in narcolepsy",
      "CYP3A4 inhibitors require lower dose",
      "Watch next-day impairment",
    ],
  },

  // ===========================================================================
  // MELATONIN RECEPTOR AGONISTS
  // ===========================================================================
  {
    generic_name: "Ramelteon",
    drug_class: "Melatonin receptor agonist",
    plain_language:
      "A prescription 'melatonin-like' sleep aid that works on the body clock's melatonin receptors to help with falling asleep. It is not habit-forming and not a controlled substance, which makes it a lower-risk option for sleep onset.",
    mechanism:
      "Selective agonist at melatonin MT1 and MT2 receptors (full agonist), promoting sleep onset.",
    common_uses: [
      "Insomnia (sleep-onset difficulty)",
      "Circadian rhythm / shift-work / jet-lag-related insomnia",
    ],
    side_effects: [
      "Fatigue",
      "Headache",
      "Drowsiness after dosing",
      "Rare angioedema",
    ],
    monitoring: [
      "Take within 30 min of bedtime; avoid high-fat meals",
      "Avoid with fluvoxamine (CYP1A2 inhibitor)",
      "Not recommended in severe hepatic impairment",
      "Not habit-forming (no abuse potential)",
    ],
  },
  {
    generic_name: "Tasimelteon",
    drug_class: "Melatonin receptor agonist",
    plain_language:
      "A melatonin-receptor agonist used specifically for Non-24-Hour Sleep-Wake Disorder (common in totally blind people), helping re-set the body clock. It can take weeks to months to shift circadian rhythm.",
    mechanism:
      "Agonist at melatonin MT1 and MT2 receptors with greater MT2 affinity, targeting circadian rhythm control.",
    common_uses: [
      "Non-24-Hour Sleep-Wake Disorder (Non-24)",
      "Circadian rhythm / shift-work / jet-lag disturbances",
    ],
    side_effects: [
      "Headache",
      "Nightmares / unusual dreams",
      "Elevated liver enzymes (ALT)",
      "Upper respiratory / urinary infection",
    ],
    monitoring: [
      "Take 1 h before bedtime at the same time nightly",
      "May take weeks–months for circadian effect",
      "Avoid strong CYP1A2 inhibitors (fluvoxamine)",
      "Limit activity after dosing (somnolence)",
    ],
  },

  // ===========================================================================
  // STIMULANTS (ADHD / narcolepsy)
  // ===========================================================================
  {
    generic_name: "Methylphenidate (D)",
    drug_class: "CNS stimulant (dopamine/norepinephrine reuptake inhibitor)",
    plain_language:
      "The more active 'right-handed' form of methylphenidate (Focalin), used for ADHD and narcolepsy. It boosts dopamine and norepinephrine to sharpen attention and control hyperactivity; it is a controlled substance with abuse potential.",
    mechanism:
      "Blocks dopamine and norepinephrine reuptake (especially dopamine); d-enantiomer of racemic methylphenidate, half-life ~2.2 h.",
    common_uses: [
      "ADHD (children 6–17 and adults)",
      "Narcolepsy",
      "Treatment-resistant depression (off-label adjunct)",
    ],
    side_effects: [
      "Insomnia, nervousness, irritability",
      "Headache, tremor, dizziness",
      "Decreased appetite, nausea, weight loss",
      "Possible temporary slowing of growth in children",
      "Tachycardia, hypertension",
    ],
    monitoring: [
      "Monitor growth (height/weight) in children",
      "Check heart rate and blood pressure",
      "Screen for cardiac history and tics before starting",
      "Watch for misuse / diversion (Schedule II)",
      "Avoid MAOIs",
    ],
  },
  {
    generic_name: "Methylphenidate (D,L)",
    drug_class: "CNS stimulant (dopamine/norepinephrine reuptake inhibitor)",
    plain_language:
      "The standard racemic methylphenidate (Ritalin, Concerta, and others), first-line for ADHD and also for narcolepsy. It improves attention and reduces hyperactivity; it is a controlled substance and can temporarily slow growth in children.",
    mechanism:
      "Blocks dopamine and norepinephrine reuptake; racemic mixture; half-life ~3.5 h (adults) / 2.5 h (children).",
    common_uses: [
      "ADHD (children and adults; formulation-dependent)",
      "Narcolepsy",
      "Treatment-resistant depression (off-label adjunct)",
    ],
    side_effects: [
      "Insomnia, nervousness, irritability",
      "Headache, tremor, dizziness",
      "Decreased appetite, nausea, weight loss",
      "Possible temporary growth slowing in children",
      "Tachycardia, hypertension",
    ],
    monitoring: [
      "Monitor growth and appetite in children",
      "Check heart rate and blood pressure",
      "Screen cardiac history / tics before starting",
      "Watch for misuse (Schedule II)",
      "Avoid MAOIs",
    ],
  },
  {
    generic_name: "Amphetamine (D)",
    drug_class: "CNS stimulant (monoamine releaser/reuptake inhibitor)",
    plain_language:
      "The right-handed amphetamine form (Dexedrine, and part of Adderall), used for ADHD and narcolepsy. It raises dopamine and norepinephrine to improve focus; it is potent and has high abuse potential.",
    mechanism:
      "Blocks reuptake of and facilitates release of dopamine and norepinephrine; half-life ~10–12 h.",
    common_uses: [
      "ADHD (age 3–6+ depending on formulation)",
      "Narcolepsy",
      "Treatment-resistant depression (off-label adjunct)",
    ],
    side_effects: [
      "Insomnia, nervousness, irritability",
      "Headache, tremor, dizziness",
      "Anorexia, dry mouth, weight loss",
      "Possible temporary growth slowing in children",
      "Tachycardia, hypertension, palpitations",
    ],
    monitoring: [
      "Check heart rate and blood pressure",
      "Monitor growth and appetite in children",
      "Screen cardiac history / tics before starting",
      "Watch for misuse (Schedule II)",
      "Avoid MAOIs (hypertensive crisis)",
    ],
  },
  {
    generic_name: "Amphetamine (D,L)",
    drug_class: "CNS stimulant (monoamine releaser/reuptake inhibitor)",
    plain_language:
      "The mixed d/l-amphetamine salts (Adderall, Adderall XR, and others) used for ADHD, narcolepsy, and sometimes obesity. It boosts dopamine and norepinephrine; highly effective but a controlled substance with significant misuse potential.",
    mechanism:
      "Blocks reuptake and increases release of dopamine and norepinephrine; 3:1 d/l mixture; half-life ~10 h (d) / 13 h (l).",
    common_uses: [
      "ADHD (age 3+ depending on formulation)",
      "Narcolepsy",
      "Exogenous obesity (off-label)",
      "Treatment-resistant depression (off-label adjunct)",
    ],
    side_effects: [
      "Insomnia, nervousness, irritability",
      "Headache, tremor, dizziness",
      "Anorexia, dry mouth, weight loss",
      "Possible temporary growth slowing in children",
      "Tachycardia, hypertension",
    ],
    monitoring: [
      "Check heart rate and blood pressure",
      "Monitor growth and appetite in children",
      "Screen cardiac history / tics before starting",
      "Watch for misuse (Schedule II)",
      "Avoid MAOIs",
    ],
  },
  {
    generic_name: "Lisdexamfetamine",
    drug_class: "CNS stimulant (prodrug of dextroamphetamine)",
    plain_language:
      "A long-acting 'prodrug' that becomes dextroamphetamine only after being absorbed and broken down, so it has a smoother, slower onset and lower abuse potential than immediate-release stimulants. Used for ADHD and binge-eating disorder.",
    mechanism:
      "Inactive prodrug converted to dextroamphetamine after absorption; then blocks reuptake and increases release of dopamine/norepinephrine. Duration ~10–12 h.",
    common_uses: [
      "ADHD (age 6+)",
      "Moderate-to-severe binge-eating disorder",
      "Treatment-resistant depression (off-label adjunct)",
    ],
    side_effects: [
      "Insomnia, irritability",
      "Headache, dizziness",
      "Anorexia, dry mouth, weight loss",
      "Possible temporary growth slowing in children",
      "Tachycardia, hypertension",
    ],
    monitoring: [
      "Check heart rate and blood pressure",
      "Monitor growth and appetite in children",
      "Screen cardiac history / tics before starting",
      "Watch for misuse (Schedule II)",
      "Avoid MAOIs",
    ],
  },

  // ===========================================================================
  // NON-STIMULANT ADHD
  // ===========================================================================
  {
    generic_name: "Atomoxetine",
    drug_class: "Non-stimulant ADHD (selective norepinephrine reuptake inhibitor)",
    plain_language:
      "A non-stimulant ADHD medicine that raises norepinephrine. It is not a controlled substance and has no abuse potential, but it takes weeks to work and carries a rare risk of serious liver injury and a warning about suicidal thoughts in young people.",
    mechanism:
      "Selectively inhibits the presynaptic norepinephrine transporter, increasing norepinephrine (and prefrontal dopamine) — half-life ~5 h, CYP2D6 substrate.",
    common_uses: [
      "ADHD (children 6+ and adults)",
      "Treatment-resistant depression (off-label adjunct)",
    ],
    side_effects: [
      "Sedation, fatigue (especially children)",
      "Decreased appetite",
      "Nausea, dry mouth, constipation",
      "Increased heart rate and blood pressure",
      "Rare severe liver injury",
      "Possible suicidal ideation (monitor)",
    ],
    monitoring: [
      "Monitor mood for suicidal thinking in youth",
      "Check heart rate and blood pressure",
      "Watch for liver injury (jaundice, dark urine)",
      "Lower dose with strong CYP2D6 inhibitors",
      "Avoid MAOIs",
    ],
  },
  {
    generic_name: "Guanfacine",
    drug_class: "Non-stimulant ADHD (alpha-2A adrenergic agonist)",
    plain_language:
      "A blood-pressure medicine repurposed for ADHD, especially to calm impulsivity, hyperactivity, and emotional reactivity — often added to a stimulant. It lowers blood pressure and heart rate and can make people drowsy.",
    mechanism:
      "Selective central alpha-2A adrenergic agonist acting on prefrontal cortex receptors (attention/impulse control); also reduces sympathetic outflow.",
    common_uses: [
      "ADHD (children 6–17; monotherapy or adjunct to stimulants)",
      "Hypertension",
      "Oppositional defiant / conduct disorder (off-label)",
      "Tourette's / tics (off-label)",
    ],
    side_effects: [
      "Sedation, somnolence",
      "Dry mouth, constipation",
      "Fatigue, dizziness",
      "Hypotension, bradycardia",
      "Rebound hypertension on abrupt stop",
    ],
    monitoring: [
      "Measure heart rate and blood pressure before and during therapy",
      "Watch sedation, especially at start",
      "Taper to avoid rebound hypertension",
      "CYP3A4 inhibitors raise levels significantly",
    ],
  },
  {
    generic_name: "Clonidine",
    drug_class: "Non-stimulant ADHD (alpha-2 adrenergic agonist)",
    plain_language:
      "An alpha-2 agonist used for ADHD (especially extended-release at bedtime), hypertension, Tourette's, and opioid/alcohol withdrawal. It is calming and lowers blood pressure; stopping suddenly can cause a dangerous rebound blood-pressure spike.",
    mechanism:
      "Stimulates central alpha-2 adrenergic receptors in the brain stem and prefrontal cortex, reducing sympathetic outflow (and helping attention/impulse control).",
    common_uses: [
      "ADHD (age 6–17, extended-release; mono/adjunct)",
      "Hypertension",
      "Tourette's syndrome",
      "Opioid and alcohol withdrawal",
      "PTSD / anxiety (off-label)",
    ],
    side_effects: [
      "Dry mouth",
      "Sedation, fatigue",
      "Dizziness, constipation",
      "Hypotension, bradycardia",
      "Rebound hypertension on abrupt stop",
    ],
    monitoring: [
      "Measure heart rate and blood pressure before and during therapy",
      "Watch sedation and orthostasis",
      "Taper gradually to avoid rebound hypertension",
      "Caution with beta-blockers (worse discontinuation reactions)",
    ],
  },

  // ===========================================================================
  // WAKEFULNESS-PROMOTING AGENTS
  // ===========================================================================
  {
    generic_name: "Modafinil",
    drug_class: "Wakefulness-promoting agent",
    plain_language:
      "A wake-promoting medicine for narcolepsy, sleep apnea, and shift-work sleepiness. It is less 'stimulant-like' than amphetamine and has lower abuse potential, but it can cause insomnia and, rarely, serious skin reactions.",
    mechanism:
      "Mechanism incompletely understood; inhibits the dopamine transporter and requires alpha-adrenergic signaling; selectively activates hypothalamic wakefulness centers.",
    common_uses: [
      "Excessive sleepiness in narcolepsy",
      "Obstructive sleep apnea (adjunct to CPAP)",
      "Shift-work sleep disorder",
      "ADHD / fatigue (off-label)",
    ],
    side_effects: [
      "Headache (dose-dependent)",
      "Anxiety, nervousness, insomnia",
      "Nausea, dry mouth, decreased appetite",
      "Hypertension, palpitations",
      "Rare Stevens-Johnson syndrome / serious rash",
    ],
    monitoring: [
      "Take in the morning; watch insomnia",
      "Stop if rash develops (SJS risk)",
      "Check blood pressure",
      "Reduces hormonal contraceptive effectiveness",
    ],
  },
  {
    generic_name: "Armodafinil",
    drug_class: "Wakefulness-promoting agent",
    plain_language:
      "The longer-acting 'R' form of modafinil, used for the same sleepiness conditions. It provides wakefulness for longer with once-daily morning dosing; same rare rash risk and contraceptive interaction.",
    mechanism:
      "R-enantiomer of modafinil; inhibits dopamine transporter and requires alpha-adrenergic signaling; half-life ~15 h.",
    common_uses: [
      "Excessive sleepiness in narcolepsy",
      "Obstructive sleep apnea (adjunct to CPAP)",
      "Shift-work sleep disorder",
      "ADHD / fatigue (off-label)",
    ],
    side_effects: [
      "Anxiety, insomnia",
      "Dizziness",
      "Nausea, dry mouth",
      "Rare Stevens-Johnson syndrome / DRESS",
    ],
    monitoring: [
      "Take in the morning",
      "Stop if rash develops",
      "Reduces hormonal contraceptive effectiveness",
      "Not studied in children",
    ],
  },
  {
    generic_name: "Solriamfetol",
    drug_class: "Wakefulness-promoting agent (dopamine/norepinephrine reuptake inhibitor)",
    plain_language:
      "A newer wake-promoting medicine for narcolepsy and sleep-apnea sleepiness. It works like a mild stimulant on dopamine and norepinephrine and reliably raises blood pressure, so blood pressure must be controlled before starting.",
    mechanism:
      "Dopamine and norepinephrine reuptake inhibitor (DNRI); half-life ~7 h; primarily renally cleared.",
    common_uses: [
      "Excessive daytime sleepiness in narcolepsy",
      "Excessive daytime sleepiness in obstructive sleep apnea",
    ],
    side_effects: [
      "Headache, insomnia",
      "Anxiety",
      "Nausea, decreased appetite",
      "Dose-dependent blood pressure and heart rate increase",
    ],
    monitoring: [
      "Ensure blood pressure is controlled before starting",
      "Monitor blood pressure and heart rate",
      "Take on waking; avoid within 9 h of bedtime",
      "Contraindicated with MAOIs",
      "Adjust dose in renal impairment",
    ],
  },
  {
    generic_name: "Pitolisant",
    drug_class: "Wakefulness-promoting agent (H3 antagonist/inverse agonist)",
    plain_language:
      "A wake-promoting medicine that boosts the brain's own histamine (a natural 'wake' chemical) rather than acting as a direct stimulant. Used for narcolepsy sleepiness and cataplexy; it can prolong the heart's QT interval.",
    mechanism:
      "Antagonist/inverse agonist at histamine H3 autoreceptors, disinhibiting histamine release and boosting wakefulness; half-life ~20 h, CYP2D6 substrate.",
    common_uses: [
      "Excessive daytime sleepiness in narcolepsy",
      "Cataplexy in narcolepsy",
    ],
    side_effects: [
      "Insomnia, anxiety",
      "Nausea, decreased appetite",
      "Tachycardia",
      "Rare visual / hypnagogic hallucinations",
      "QT prolongation",
    ],
    monitoring: [
      "Avoid with other QT-prolonging drugs / cardiac arrhythmia",
      "Consider CYP2D6 genotyping for max dose",
      "Lower dose with strong CYP2D6 inhibitors",
      "May take up to 8 weeks for full response",
    ],
  },

  // ===========================================================================
  // CHOLINESTERASE INHIBITORS (Alzheimer's)
  // ===========================================================================
  {
    generic_name: "Donepezil",
    drug_class: "Cholinesterase inhibitor",
    plain_language:
      "A memory medicine for Alzheimer's that raises the brain chemical acetylcholine, which helps memory and thinking. It does not stop the disease but may slow decline; nausea, diarrhea, and vivid dreams are common early on.",
    mechanism:
      "Reversibly inhibits central acetylcholinesterase (AChE), increasing acetylcholine; long half-life ~70 h; CYP2D6/3A4.",
    common_uses: [
      "Alzheimer's disease (mild, moderate, severe)",
      "Memory disorders in other conditions (off-label)",
      "Mild cognitive impairment (off-label)",
    ],
    side_effects: [
      "Nausea, diarrhea, vomiting",
      "Appetite loss, weight loss",
      "Insomnia, abnormal dreams",
      "Dizziness, muscle cramps",
      "Rare bradycardia, syncope",
    ],
    monitoring: [
      "Titrate 5 mg → 10 mg after 4–6 weeks",
      "Watch GI upset and weight loss",
      "Caution with bradycardia / heart block",
      "Discontinue before surgery (anesthesia interaction)",
    ],
  },
  {
    generic_name: "Rivastigmine",
    drug_class: "Cholinesterase inhibitor",
    plain_language:
      "An Alzheimer's and Parkinson's-dementia medicine that raises acetylcholine. It is available as a patch, which reduces stomach upset; a bitter 'uncommon' monitoring note is making sure old patches are removed to avoid overdose.",
    mechanism:
      "Pseudo-irreversibly inhibits acetylcholinesterase and butyrylcholinesterase, increasing acetylcholine; short half-life (1–2 h), not CYP-metabolized.",
    common_uses: [
      "Alzheimer's disease (mild to moderate; patch also severe)",
      "Parkinson's disease dementia (mild to moderate)",
      "Memory disorders in other conditions (off-label)",
    ],
    side_effects: [
      "Nausea, diarrhea, vomiting",
      "Appetite loss, weight loss",
      "Headache, dizziness",
      "Sweating, fatigue",
      "Patch: skin reactions at application site",
    ],
    monitoring: [
      "Titrate slowly (every 4 weeks)",
      "Remove old patch before applying new (overdose risk)",
      "Watch GI upset and weight loss",
      "Discontinue before surgery",
    ],
  },
  {
    generic_name: "Galantamine",
    drug_class: "Cholinesterase inhibitor",
    plain_language:
      "An Alzheimer's medicine that raises acetylcholine and also tunes nicotinic receptors. Like the others it is symptom-relieving, not curative; stomach upset is the main early side effect, and it can rarely cause serious skin reactions.",
    mechanism:
      "Reversibly inhibits acetylcholinesterase and positively modulates nicotinic receptors; half-life ~7 h; CYP2D6/3A4.",
    common_uses: [
      "Alzheimer's disease (mild to moderate)",
      "Memory disturbances in other dementias (off-label)",
      "Mild cognitive impairment (off-label)",
    ],
    side_effects: [
      "Nausea, diarrhea, vomiting",
      "Appetite loss, weight loss",
      "Headache, dizziness",
      "Fatigue, depression",
      "Rare Stevens-Johnson syndrome",
    ],
    monitoring: [
      "Titrate 8 → 16 → 24 mg/day over weeks",
      "Take with food; ensure fluid intake",
      "Watch GI upset and weight loss",
      "Discontinue at first skin rash",
    ],
  },

  // ===========================================================================
  // NMDA RECEPTOR ANTAGONISTS
  // ===========================================================================
  {
    generic_name: "Memantine",
    drug_class: "NMDA receptor antagonist",
    plain_language:
      "A medicine for moderate-to-severe Alzheimer's that calms overactive glutamate signaling rather than boosting acetylcholine. It is generally well tolerated (dizziness, constipation) and is often combined with donepezil.",
    mechanism:
      "Low-to-moderate affinity noncompetitive (open-channel) NMDA receptor antagonist, reducing glutamate-mediated excitotoxicity; half-life ~60–80 h, mostly renally cleared.",
    common_uses: [
      "Alzheimer's disease (moderate to severe)",
      "Memory disorders in other conditions (off-label)",
      "Mild cognitive impairment (off-label)",
    ],
    side_effects: [
      "Dizziness",
      "Headache",
      "Constipation",
      "Rare seizures",
    ],
    monitoring: [
      "Titrate 5 mg weekly to 20 mg/day",
      "Reduce dose in renal impairment",
      "Urine alkalinizers raise levels",
      "Often combined with donepezil",
    ],
  },
  {
    generic_name: "Esketamine",
    drug_class: "NMDA receptor antagonist (intranasal)",
    plain_language:
      "A fast-acting nasal-spray form of ketamine for treatment-resistant depression (and acute suicidal ideation), given in a supervised clinic. It can cause dissociation, sedation, and a temporary blood-pressure rise, so patients are observed for about two hours after each dose.",
    mechanism:
      "Nonselective, noncompetitive open-channel NMDA receptor antagonist (phencyclidine site), leading to downstream glutamate/AMPA activation and increased BDNF.",
    common_uses: [
      "Treatment-resistant depression (adjunct to an oral antidepressant)",
      "Depressive symptoms with acute suicidal ideation (adjunct)",
    ],
    side_effects: [
      "Dissociation",
      "Sedation, dizziness",
      "Anxiety, feeling drunk",
      "Nausea, vomiting",
      "Transient blood-pressure increase",
      "Short-term cognitive impairment",
    ],
    monitoring: [
      "Administered in certified clinic with 2-hour observation",
      "Monitor blood pressure after each dose",
      "Watch for dissociation and sedation",
      "Must be used with an oral antidepressant",
    ],
  },
  {
    generic_name: "Dextromethorphan",
    drug_class: "NMDA antagonist / sigma-1 agonist (with quinidine)",
    plain_language:
      "Best known as a cough suppressant, but combined with quinidine it is used for pseudobulbar affect (uncontrollable laughing/crying) and, off-label, treatment-resistant depression. Quinidine is added only to keep dextromethorphan levels stable.",
    mechanism:
      "Blocks NMDA receptors and agonizes sigma-1 receptors; also binds the serotonin transporter. Quinidine inhibits CYP2D6 to raise dextromethorphan levels.",
    common_uses: [
      "Pseudobulbar affect (PBA)",
      "Diabetic peripheral neuropathic pain (off-label)",
      "Treatment-resistant depression (off-label, third-line)",
    ],
    side_effects: [
      "Dizziness, asthenia",
      "Diarrhea, vomiting",
      "Cough, peripheral edema",
      "Euphoria",
      "Rare QT prolongation, hepatotoxicity",
    ],
    monitoring: [
      "Watch for serotonin syndrome risk with serotonergic drugs",
      "Check QT interval (risk of prolongation)",
      "Monitor for CYP2D6 drug interactions",
      "Avoid with other NMDA antagonists / MAOIs",
    ],
  },

  // ===========================================================================
  // SUBSTANCE-USE DISORDER AGENTS
  // ===========================================================================
  {
    generic_name: "Acamprosate",
    drug_class: "Substance-use treatment (glutamate/GABA modulator)",
    plain_language:
      "A medicine that helps people stay abstinent from alcohol after they have already stopped drinking, by calming the brain's over-excited glutamate system (acting a bit like 'artificial alcohol'). It does not stop withdrawal and is used alongside counseling.",
    mechanism:
      "Theoretically reduces excitatory glutamate and increases inhibitory GABA signaling; blocks metabotropic glutamate receptors.",
    common_uses: [
      "Maintenance of alcohol abstinence (after detox)",
    ],
    side_effects: [
      "Diarrhea",
      "Nausea",
      "Anxiety, depression",
      "Rare suicidal ideation (monitor)",
    ],
    monitoring: [
      "Use only after the patient is abstinent",
      "Adjust dose for weight and renal function",
      "Contraindicated in severe renal impairment",
      "Pair with psychosocial support",
    ],
  },
  {
    generic_name: "Naltrexone",
    drug_class: "Substance-use treatment (opioid antagonist)",
    plain_language:
      "A medicine that blocks opioid receptors, so it reduces cravings and the 'reward' from drinking alcohol or using opioids. It also comes as a monthly injection. It does not cause a high and is not addictive, but it blocks opioid painkillers too.",
    mechanism:
      "Blocks mu opioid receptors (and modulates kappa), reducing the reinforcing effects of alcohol and blocking exogenous opioids.",
    common_uses: [
      "Alcohol dependence",
      "Blockade of exogenous opioids (oral)",
      "Relapse prevention in opioid dependence (injection)",
    ],
    side_effects: [
      "Nausea, vomiting",
      "Decreased appetite",
      "Dizziness, dysphoria, anxiety",
      "Injection-site reactions",
      "Rare hepatocellular injury (high doses)",
    ],
    monitoring: [
      "Check liver function tests",
      "Must be opioid-free before starting (precipitated withdrawal)",
      "Blocks opioid analgesics — advise patients",
      "Monthly injection improves adherence",
    ],
  },
  {
    generic_name: "Disulfiram",
    drug_class: "Substance-use treatment (aldehyde dehydrogenase inhibitor)",
    plain_language:
      "A deterrent medicine for alcohol dependence: if the person drinks even a little, it causes an unpleasant reaction (flushing, nausea, racing heart, headache). It is a safety lever, not a cure, and needs the person's full commitment.",
    mechanism:
      "Irreversibly inhibits aldehyde dehydrogenase, causing toxic acetaldehyde buildup when alcohol is consumed (aversive reaction).",
    common_uses: [
      "Maintenance of alcohol abstinence (deterrent)",
    ],
    side_effects: [
      "Metallic taste",
      "Sedation, headache",
      "Dermatitis",
      "If alcohol consumed: flushing, tachycardia, nausea, vomiting",
      "Rare hepatotoxicity, peripheral neuropathy",
    ],
    monitoring: [
      "Begin only after 12+ hours of abstinence",
      "Monitor liver function tests",
      "Warn about all alcohol sources (cough syrups, sauces)",
      "Check phenytoin / anticoagulant levels (interactions)",
    ],
  },
  {
    generic_name: "Buprenorphine",
    drug_class: "Substance-use treatment (partial mu-opioid agonist)",
    plain_language:
      "A partial opioid used to treat opioid use disorder — it relieves withdrawal and craving with a 'ceiling' effect that lowers overdose risk compared with full opioids. It can precipitate withdrawal if started too soon after a full opioid.",
    mechanism:
      "Partial agonist at mu opioid receptors and antagonist at kappa receptors; prevents exogenous opioids from binding while providing partial stimulation.",
    common_uses: [
      "Opioid use disorder (maintenance / induction)",
      "Moderate-to-severe opioid use disorder (injection/implant)",
    ],
    side_effects: [
      "Headache, constipation",
      "Nausea",
      "Oral hypoesthesia (sublingual)",
      "Orthostatic hypotension",
      "Respiratory depression (especially with benzos)",
    ],
    monitoring: [
      "Prescribe as part of MAT with counseling",
      "Avoid benzodiazepines / CNS depressants (respiratory depression)",
      "Monitor for diversion and misuse",
      "Watch precipitated withdrawal if started too early",
    ],
  },
  {
    generic_name: "Varenicline",
    drug_class: "Substance-use treatment (nicotinic partial agonist)",
    plain_language:
      "A smoking-cessation medicine that partly activates nicotine receptors, cutting craving and making cigarettes less rewarding. It is very effective; nausea and vivid dreams are common, and mood changes should be monitored.",
    mechanism:
      "Partial agonist at alpha-4-beta-2 nicotinic acetylcholine receptors, providing modest dopamine release while blocking nicotine binding.",
    common_uses: [
      "Smoking cessation (nicotine dependence)",
    ],
    side_effects: [
      "Dose-dependent nausea",
      "Insomnia, headache",
      "Abnormal dreams",
      "Constipation, flatulence",
      "Rare mood changes / suicidal ideation (monitor)",
    ],
    monitoring: [
      "Begin dosing 1 week before quit date",
      "Monitor mood for neuropsychiatric changes",
      "Watch for nausea (take with food)",
      "Caution with alcohol (altered tolerance)",
    ],
  },
  {
    generic_name: "Nalmefene",
    drug_class: "Substance-use treatment (opioid antagonist)",
    plain_language:
      "An opioid-blocking medicine (used mainly in Europe) taken as-needed to reduce heavy drinking. It blunts the rewarding effects of alcohol, so people drink less; nausea and dizziness are common.",
    mechanism:
      "Blocks mu opioid receptors and modulates kappa receptors, reducing the reinforcing effects of alcohol.",
    common_uses: [
      "Reduction of alcohol consumption (high drinking risk)",
    ],
    side_effects: [
      "Nausea, vomiting",
      "Dizziness, headache",
      "Insomnia",
      "Rare confusion, hallucinations",
    ],
    monitoring: [
      "Taken as needed on drinking days",
      "Watch for dizziness and nausea",
      "Caution with opioid analgesics (blocked)",
      "Monitor liver function",
    ],
  },
  {
    generic_name: "Lofexidine",
    drug_class: "Substance-use treatment (alpha-2 adrenergic agonist)",
    plain_language:
      "A medicine that eases opioid withdrawal symptoms (sweats, shakes, anxiety) by calming the overactive 'fight-or-flight' system, without being an opioid itself. It lowers blood pressure and heart rate, so vitals are watched.",
    mechanism:
      "Central alpha-2 adrenergic agonist that reduces norepinephrine release and sympathetic tone, easing withdrawal.",
    common_uses: [
      "Mitigation of opioid withdrawal symptoms (abrupt opioid discontinuation)",
    ],
    side_effects: [
      "Orthostatic hypotension, hypotension",
      "Dizziness, sedation",
      "Dry mouth",
      "Bradycardia",
      "QT prolongation",
    ],
    monitoring: [
      "Monitor blood pressure, pulse, and orthostasis",
      "Check ECG (QT prolongation, esp. with methadone)",
      "Use short-term during peak withdrawal (5–7 days)",
      "Caution with CNS depressants",
    ],
  },

  // ===========================================================================
  // OTHER / MISCELLANEOUS AGENTS
  // ===========================================================================
  {
    generic_name: "Prazosin",
    drug_class: "Alpha-1 adrenergic antagonist",
    plain_language:
      "A blood-pressure medicine used off-label to reduce PTSD nightmares by blocking the adrenaline surge that can replay traumatic memories during sleep. The main caution is 'first-dose' fainting from a blood-pressure drop.",
    mechanism:
      "Blocks alpha-1 adrenergic receptors, reducing noradrenergic hyperactivation (which may trigger traumatic nightmares during sleep).",
    common_uses: [
      "Nightmares associated with PTSD (off-label)",
      "Hypertension",
      "Benign prostatic hyperplasia (urinary symptoms)",
    ],
    side_effects: [
      "Dizziness, lightheadedness",
      "Headache, fatigue",
      "Blurred vision",
      "Nausea",
      "Syncope (first-dose orthostatic hypotension)",
    ],
    monitoring: [
      "Start low (1 mg at bedtime) and titrate slowly",
      "Watch for orthostatic hypotension / syncope",
      "Take first dose at bedtime",
      "Additive hypotension with PDE-5 inhibitors / beta-blockers",
    ],
  },
  {
    generic_name: "Propranolol",
    drug_class: "Non-selective beta blocker",
    plain_language:
      "A beta blocker used off-label for performance anxiety, PTSD, and tremor (and on-label for migraine, blood pressure, heart conditions). It blocks the physical symptoms of anxiety — racing heart, shaking — rather than the thoughts themselves.",
    mechanism:
      "Non-selective beta-adrenergic antagonist; blocks beta-1 (heart) and beta-2 (lungs/vessels) receptors.",
    common_uses: [
      "Performance/social anxiety (off-label)",
      "PTSD (off-label, prophylactic)",
      "Essential tremor",
      "Migraine prophylaxis",
      "Hypertension, angina, arrhythmias",
      "Akathisia (antipsychotic-induced, off-label)",
    ],
    side_effects: [
      "Bradycardia, hypotension",
      "Fatigue, dizziness",
      "Depression, sleep disturbance",
      "Sexual dysfunction",
      "Bronchospasm (avoid in asthma/COPD)",
    ],
    monitoring: [
      "Contraindicated in asthma / severe COPD",
      "Check heart rate and blood pressure",
      "Can mask hypoglycemia and hyperthyroidism",
      "Taper to avoid rebound angina/tachycardia",
    ],
  },
  {
    generic_name: "Sodium oxybate",
    drug_class: "CNS depressant (GHB / GABA-B agonist)",
    plain_language:
      "A powerful night-time medicine (the sodium salt of GHB) for narcolepsy that improves deep sleep, which reduces daytime sleepiness and cataplexy. It is heavily restricted (REM sleep program) because of sedation and abuse potential, and is taken in two nightly doses.",
    mechanism:
      "GHB acts at GHB receptors and as a partial GABA-B agonist; improves slow-wave sleep, leaving patients more rested and alert by day.",
    common_uses: [
      "Cataplexy in narcolepsy (age 7+)",
      "Excessive daytime sleepiness in narcolepsy",
      "Fibromyalgia (off-label)",
    ],
    side_effects: [
      "Headache, dizziness",
      "Sedation",
      "Nausea, vomiting",
      "Enuresis",
      "Rare psychosis, depression, confusion",
      "Respiratory depression (especially overdose)",
    ],
    monitoring: [
      "Distributed only via REMS (risk management) program",
      "Two nightly doses 2.5–4 h apart; take in bed",
      "Contraindicated with alcohol / sedative hypnotics",
      "Watch respiratory depression and psychiatric symptoms",
    ],
  },
  {
    generic_name: "Flumazenil",
    drug_class: "Benzodiazepine receptor antagonist (antidote)",
    plain_language:
      "A reversal (antidote) medicine for benzodiazepine overdose or to wake someone from benzo sedation after a procedure. It is not a treatment for anxiety — and in a person dependent on benzos it can trigger seizures.",
    mechanism:
      "Competitively blocks benzodiazepine receptors at the GABA-A complex, reversing benzo effects.",
    common_uses: [
      "Reversal of benzodiazepine sedation (procedures)",
      "Management of benzodiazepine overdose",
      "Reversal of conscious sedation (pediatric)",
    ],
    side_effects: [
      "Precipitated withdrawal in benzo-dependent patients",
      "Seizures",
      "Dizziness, headache",
      "Nausea",
      "Resedation as it wears off",
    ],
    monitoring: [
      "Onset 1–2 min; monitor for resedation",
      "Can precipitate seizures in dependence or mixed overdose",
      "Avoid in benzo-dependent patients",
      "Not for routine anxiety use",
    ],
  },
  {
    generic_name: "Benztropine",
    drug_class: "Anticholinergic (antiparkinsonian)",
    plain_language:
      "A medicine for the movement side effects of antipsychotics (stiffness, tremor, muscle spasms called EPS). It works by rebalancing acetylcholine vs dopamine, but it is very drying and can cause confusion, especially in older adults.",
    mechanism:
      "Reduces excess acetylcholine activity that results from dopamine blockade; may also prolong dopamine action.",
    common_uses: [
      "Drug-induced parkinsonism / EPS",
      "Parkinsonism",
      "Acute dystonic reactions",
    ],
    side_effects: [
      "Dry mouth, blurred vision",
      "Constipation, urinary retention",
      "Confusion, hallucinations",
      "Tachycardia",
      "Can worsen tardive dyskinesia",
    ],
    monitoring: [
      "Caution in elderly (confusion, heat stroke risk)",
      "Watch for urinary retention and constipation",
      "May exacerbate tardive dyskinesia",
      "Monitor for angle-closure glaucoma",
    ],
  },
  {
    generic_name: "Trihexyphenidyl",
    drug_class: "Anticholinergic (antiparkinsonian)",
    plain_language:
      "Another anticholinergic for antipsychotic movement side effects and parkinsonism. Same idea as benztropine: rebalances brain chemicals to reduce stiffness and tremor, with dry mouth, blurred vision, and confusion as common trade-offs.",
    mechanism:
      "Reduces excess acetylcholine activity from dopamine blockade; may prolong dopamine action.",
    common_uses: [
      "Drug-induced parkinsonism / EPS",
      "Parkinsonism",
      "Dystonias",
    ],
    side_effects: [
      "Dry mouth, blurred vision",
      "Constipation, urinary retention",
      "Confusion, hallucinations",
      "Tachycardia",
      "Can worsen tardive dyskinesia",
    ],
    monitoring: [
      "Caution in elderly",
      "Watch for urinary retention and constipation",
      "May exacerbate tardive dyskinesia",
      "Monitor for angle-closure glaucoma",
    ],
  },
  {
    generic_name: "Pimavanserin",
    drug_class: "Atypical antipsychotic (5-HT2A inverse agonist)",
    plain_language:
      "A specialized antipsychotic for hallucinations and delusions in Parkinson's disease — chosen because it does not block dopamine, so it is less likely to worsen Parkinson's movement symptoms. It can prolong the heart's QT interval.",
    mechanism:
      "Inverse agonist/antagonist at 5-HT2A receptors (with low 5-HT2C activity); little-to-no dopamine blockade.",
    common_uses: [
      "Hallucinations and delusions in Parkinson's disease psychosis",
      "Dementia-related psychosis (off-label; boxed warning)",
    ],
    side_effects: [
      "Peripheral edema",
      "Confusional state",
      "Nausea",
      "QT prolongation",
    ],
    monitoring: [
      "Check ECG (QT prolongation)",
      "Avoid other QT-prolonging drugs",
      "Increased mortality risk in dementia-related psychosis",
      "Does not worsen parkinsonian motor symptoms",
    ],
  },
  {
    generic_name: "Deutetrabenazine",
    drug_class: "VMAT2 inhibitor (monoamine depleter)",
    plain_language:
      "A medicine for tardive dyskinesia and Huntington's chorea that reduces involuntary movements by draining excess dopamine from nerve terminals. It can cause sedation and depression, so mood is monitored.",
    mechanism:
      "Selective, reversible inhibitor of vesicular monoamine transporter 2 (VMAT2), reducing dopamine packaging into synaptic vesicles.",
    common_uses: [
      "Tardive dyskinesia",
      "Chorea associated with Huntington's disease",
    ],
    side_effects: [
      "Sedation, fatigue",
      "Dizziness, insomnia",
      "Diarrhea, dry mouth",
      "Depression / suicidal thoughts (especially Huntington's)",
    ],
    monitoring: [
      "Monitor mood for depression and suicidality",
      "Assess involuntary movements before and during therapy",
      "Caution with QT-prolonging drugs",
      "Avoid MAOIs / reserpine",
    ],
  },
  {
    generic_name: "Valbenazine",
    drug_class: "VMAT2 inhibitor (monoamine depleter)",
    plain_language:
      "A once-daily medicine for tardive dyskinesia that reduces abnormal involuntary movements by lowering excess dopamine. Sedation is the main side effect; it carries a warning about depression in some patients.",
    mechanism:
      "Selective, reversible VMAT2 inhibitor, reducing dopamine storage and release.",
    common_uses: [
      "Tardive dyskinesia",
    ],
    side_effects: [
      "Sedation",
      "Fatigue",
      "Dry mouth",
      "Constipation",
      "QT prolongation (not clinically significant at usual doses)",
    ],
    monitoring: [
      "Assess abnormal movements (AIMS) before and during therapy",
      "Monitor mood for depression",
      "Caution with QT-prolonging drugs",
      "Avoid MAOIs",
    ],
  },
  {
    generic_name: "Brexanolone",
    drug_class: "Neuroactive steroid (GABA-A positive allosteric modulator)",
    plain_language:
      "The first medicine approved specifically for postpartum depression, given as a 60-hour IV infusion in a supervised clinic. It works quickly by enhancing the brain's calming GABA system, but heavy sedation means it requires close monitoring.",
    mechanism:
      "Positive allosteric modulator at neuroactive steroid sites on GABA-A receptors (both benzodiazepine-sensitive and -insensitive subtypes).",
    common_uses: [
      "Postpartum depression",
    ],
    side_effects: [
      "Sedation, dizziness",
      "Dry mouth",
      "Flushing / hot flush",
      "Excessive sedation or sudden loss of consciousness",
      "Syncope / presyncope",
    ],
    monitoring: [
      "Given as 60-hour IV infusion with continuous monitoring",
      "Watch for excessive sedation / loss of consciousness",
      "Monitor for suicidal ideation",
      "REMS program (certified facilities only)",
    ],
  },
  {
    generic_name: "Sildenafil",
    drug_class: "PDE5 inhibitor",
    plain_language:
      "Best known for erectile dysfunction, but relevant in psychiatry for treating sexual dysfunction caused by antidepressants (SSRIs). It increases blood flow; the key warning is priapism (a painful erection lasting over 4 hours).",
    mechanism:
      "Inhibits phosphodiesterase-5, increasing cGMP and relaxing smooth muscle in the corpus cavernosum (and pulmonary vessels).",
    common_uses: [
      "Erectile dysfunction",
      "Antidepressant-induced sexual dysfunction (off-label)",
      "Pulmonary arterial hypertension (Revatio)",
    ],
    side_effects: [
      "Headache",
      "Flushing",
      "Dyspepsia",
      "Rare priapism (erection > 4 h)",
      "Rare sudden vision/hearing loss",
    ],
    monitoring: [
      "Contraindicated with nitrates (severe hypotension)",
      "Caution with other alpha-blockers (additive hypotension)",
      "Warn about priapism",
      "Assess cause of sexual dysfunction",
    ],
  },
  {
    generic_name: "Flibanserin",
    drug_class: "5-HT1A agonist / 5-HT2A antagonist (HSDD agent)",
    plain_language:
      "A daily medicine for low sexual desire in premenopausal women (HSDD). It rebalances brain chemicals to reduce 'braking' signals and boost desire; it causes drowsiness and must not be mixed with alcohol.",
    mechanism:
      "Increases dopamine/norepinephrine and reduces serotonin in key circuits via 5-HT1A agonism and 5-HT2A antagonism.",
    common_uses: [
      "Acquired, generalized hypoactive sexual desire disorder (HSDD) in premenopausal women",
    ],
    side_effects: [
      "Somnolence",
      "Nausea",
      "Fatigue, insomnia",
      "Dry mouth",
      "Syncope with alcohol (contraindicated)",
    ],
    monitoring: [
      "Take at bedtime",
      "Contraindicated with alcohol (hypotension/syncope)",
      "Assess for efficacy after 8 weeks",
      "CYP3A4 inhibitors raise levels",
    ],
  },
  {
    generic_name: "Bremelanotide",
    drug_class: "Melanocortin (MC4) receptor agonist (HSDD agent)",
    plain_language:
      "An injectable, as-needed medicine for low sexual desire in premenopausal women. It is used before anticipated sexual activity; nausea is common and it can temporarily raise blood pressure.",
    mechanism:
      "Nonselective melanocortin receptor agonist (MC1 and MC4), acting in hypothalamic circuits involved in sexual behavior.",
    common_uses: [
      "Acquired, generalized hypoactive sexual desire disorder (HSDD) in premenopausal women",
    ],
    side_effects: [
      "Nausea",
      "Flushing",
      "Injection-site reactions",
      "Headache, vomiting",
      "Transient blood-pressure increase",
    ],
    monitoring: [
      "Use as needed 45 min before activity",
      "Avoid in uncontrolled hypertension / cardiovascular disease",
      "Watch for nausea and injection reactions",
      "Limit to one dose per 24 h",
    ],
  },
  {
    generic_name: "Naltrexone/Bupropion",
    drug_class: "Weight-management combination (opioid antagonist + DNRI)",
    plain_language:
      "A combination weight-loss medicine (Contrave) that acts on brain appetite circuits. It is used with diet and exercise for obesity; nausea is common early on, and it can raise blood pressure and (rarely) cause seizures.",
    mechanism:
      "Bupropion boosts dopamine/norepinephrine to activate POMC (appetite-suppressing) neurons; naltrexone blocks the opioid-mediated negative feedback that would otherwise dampen that effect.",
    common_uses: [
      "Chronic weight management (obesity / overweight with comorbidity)",
    ],
    side_effects: [
      "Nausea, constipation",
      "Headache, dizziness",
      "Insomnia",
      "Increased blood pressure / heart rate",
      "Rare seizures",
    ],
    monitoring: [
      "Titrate dose gradually",
      "Check blood pressure and heart rate",
      "Contraindicated in seizure disorder / bulimia",
      "Monitor for suicidality (bupropion component)",
    ],
  },
  {
    generic_name: "Phentermine/Topiramate",
    drug_class: "Weight-management combination (sympathomimetic + anticonvulsant)",
    plain_language:
      "A combination weight-loss medicine (Qsymia) pairing a mild stimulant (phentermine) with an anticonvulsant (topiramate) to reduce appetite. It can cause tingling, dry mouth, and thinking/memory fogginess; it must be tapered off.",
    mechanism:
      "Phentermine raises dopamine/norepinephrine to suppress appetite; topiramate (mechanism uncertain) augments appetite suppression and may increase energy expenditure.",
    common_uses: [
      "Chronic weight management (obesity / overweight with comorbidity)",
    ],
    side_effects: [
      "Constipation, dry mouth",
      "Paresthesia (tingling)",
      "Dizziness, insomnia",
      "Cognitive impairment",
      "Increased heart rate",
    ],
    monitoring: [
      "Titrate slowly and taper to stop",
      "Avoid in pregnancy (teratogenic risk)",
      "Monitor heart rate and metabolic acidosis",
      "Check for kidney stones and mood changes",
    ],
  },
  {
    generic_name: "Caprylidene",
    drug_class: "Medical food (medium-chain triglycerides)",
    plain_language:
      "A 'medical food' (a drink of medium-chain fats) that gives the Alzheimer's brain an alternative fuel source — ketones — when it cannot use glucose well. It is not a drug and has only mild stomach side effects.",
    mechanism:
      "Induces hyperketonemia; medium-chain fatty acids are converted to ketone bodies, providing an alternative energy substrate for neurons.",
    common_uses: [
      "Dietary management of Alzheimer's disease (mild to moderate)",
      "Mild cognitive impairment",
    ],
    side_effects: [
      "Diarrhea",
      "Flatulence, dyspepsia",
      "Nausea, headache",
    ],
    monitoring: [
      "Not a prescription drug — medical food",
      "Watch GI tolerance",
      "Effect is modest and supportive only",
    ],
  },
];
