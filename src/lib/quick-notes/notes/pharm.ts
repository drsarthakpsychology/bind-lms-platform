import type { PharmPoint, Source } from "../types";

/**
 * Medicine reference points (notes 24 to 29). Numbers match the medicine
 * pages (src/lib/meds): lithium 0.6 to 0.8 usual, 0.8 to 1.0 for some;
 * clozapine weekly counts for at least the first 18 weeks. Where sources
 * differ, the note says the safe thing and points to the local scheme.
 */
const SRC: Source = { basis: ["NICE", "Maudsley", "Stahl"], checkedBy: "Quick Notes builder, against named sources", checkedOn: "2026-11-22", clinician: "pending" };

export const PHARM: PharmPoint[] = [
  {
    id: "pharm-antipsychotic-movement",
    type: "pharm",
    title: "Antipsychotic movement side effects, NMS and serotonin syndrome",
    aka: ["Extrapyramidal side effects", "EPS", "Acute dystonia", "Akathisia", "Parkinsonism", "Tardive dyskinesia", "Neuroleptic malignant syndrome", "NMS", "Serotonin syndrome"],
    topic: "medicines",
    oneLine: "Dystonia in hours to days, akathisia and parkinsonism in days to weeks, tardive dyskinesia after months. NMS is an emergency.",
    tables: [
      {
        title: "Movement side effects in the order they appear",
        table: {
          head: ["Effect", "When", "Looks like", "First step"],
          rows: [
            ["Acute dystonia", "Hours to a few days", "Neck twisting, eyes rolling up, jaw spasm", "Anticholinergic medicine, by injection if severe"],
            ["Akathisia", "Days to weeks", "Cannot sit still, inner restlessness", "Lower the dose or switch; propranolol can help"],
            ["Parkinsonism", "Days to weeks", "Stiffness, tremor, slow, shuffling", "Lower the dose or switch; anticholinergic if needed"],
            ["Tardive dyskinesia", "Months to years", "Lip smacking, tongue and face movements", "Review the antipsychotic; stop anticholinergics; specialist advice"],
          ],
        },
      },
      {
        title: "NMS or serotonin syndrome",
        table: {
          head: ["Feature", "NMS", "Serotonin syndrome"],
          rows: [
            ["Cause", "Antipsychotics (dopamine block)", "Two or more serotonin drugs, or an overdose"],
            ["Onset", "Days to weeks, builds slowly", "Within hours, fast"],
            ["Muscles", "Lead-pipe rigidity, slow reflexes", "Clonus, brisk reflexes, tremor"],
            ["Other signs", "High fever, sweating, unstable pulse and BP, confusion", "Agitation, sweating, diarrhoea, wide pupils, fever if severe"],
            ["Blood test", "Very high CK, raised white cells", "Often normal CK"],
            ["First step", "Stop the antipsychotic; cool, fluids, urgent medical care", "Stop serotonin drugs; supportive care; benzodiazepine"],
          ],
        },
      },
    ],
    emergencies: [
      { name: "Akathisia", signs: "Restless, pacing, distressed", firstStep: "Take seriously: it raises the risk of suicide and of stopping treatment" },
      { name: "Laryngeal dystonia", signs: "Noisy breathing, cannot speak", firstStep: "Emergency: anticholinergic by injection now" },
    ],
    points: [{ title: "Who is at risk", points: ["High-potency first-generation drugs (haloperidol) carry the highest movement risk", "Young men: acute dystonia; older women: tardive dyskinesia", "Clozapine and quetiapine carry the lowest movement risk"] }],
    links: { moduleId: "antipsychotics", summaryId: "antipsychotics", related: ["pharm-clozapine", "criteria-schizophrenia"], medicines: ["haloperidol", "risperidone", "olanzapine", "trihexyphenidyl", "propranolol"], practice: ["medicines"] },
    source: SRC,
    keywords: ["EPS", "stiffness", "tremor", "restless", "rigidity", "fever", "CK", "clonus", "trihexyphenidyl"],
  },
  {
    id: "pharm-lithium",
    type: "pharm",
    title: "Lithium: levels, toxicity and monitoring",
    aka: ["Lithium level", "Lithium toxicity", "Serum lithium"],
    topic: "medicines",
    oneLine: "A narrow safe window: check the level 12 hours after the last dose, and know what pushes it up.",
    facts: [
      { label: "Usual target", value: "0.6 to 0.8 mmol/L" },
      { label: "Some people", value: "0.8 to 1.0 mmol/L (mania, or relapse at lower levels)" },
      { label: "Older adults", value: "Often lower targets" },
      { label: "When to take blood", value: "12 hours after the last dose" },
      { label: "Toxicity likely", value: "From about 1.5 mmol/L, can happen lower" },
    ],
    tables: [
      {
        title: "What raises the level",
        table: {
          head: ["Cause", "Why"],
          rows: [
            ["Dehydration, vomiting, diarrhoea, heat", "Less water and salt, kidneys keep more lithium"],
            ["Low-salt diet, fasting", "Kidneys hold on to lithium with sodium"],
            ["Painkillers such as ibuprofen (NSAIDs)", "Less lithium cleared by the kidneys"],
            ["BP medicines: ACE inhibitors, ARBs, thiazide diuretics", "Less lithium cleared"],
            ["Kidney disease, older age", "Slower clearance"],
          ],
        },
      },
      {
        title: "Toxicity signs",
        table: {
          head: ["Stage", "Signs"],
          rows: [
            ["Early", "Coarse tremor, vomiting, diarrhoea, unsteady"],
            ["Worse", "Slurred speech, confusion, muscle jerks"],
            ["Severe", "Fits, drowsiness to coma, kidney failure"],
          ],
        },
      },
    ],
    monitoring: ["Before starting: kidney function, thyroid, calcium, weight; ECG if heart risk; pregnancy test if relevant", "Level weekly after starting and after each dose change, until stable", "Then every 3 months in the first year, then usually every 6 months", "Kidney function and thyroid every 6 months; calcium and weight regularly", "Stop gradually, over at least 4 weeks, to lower the risk of relapse"],
    interactions: ["Ask before any new painkiller or BP tablet", "Teach: drink enough water in summer, and if vomiting or diarrhoea, call the clinic"],
    emergencies: [{ name: "Lithium toxicity", signs: "Coarse tremor, vomiting, unsteady, confused", firstStep: "Stop lithium, urgent level and kidney tests, medical care" }],
    points: [{ title: "Common side effects", points: ["Thirst and passing a lot of urine", "Fine tremor, weight gain", "Underactive thyroid; raised calcium", "Lowers suicide risk in mood disorders"] }],
    links: { moduleId: "stabilisers", summaryId: "stabilisers", related: ["pharm-mood-stabilisers", "criteria-bipolar"], medicines: ["lithium"], practice: ["medicines"] },
    source: SRC,
    keywords: ["mmol", "level", "tremor", "kidney", "thyroid", "NSAID", "dehydration", "mood stabiliser"],
  },
  {
    id: "pharm-antidepressants",
    type: "pharm",
    title: "Antidepressants: classes, timeline and stopping",
    aka: ["SSRI", "SNRI", "TCA", "Antidepressant classes", "Discontinuation symptoms"],
    topic: "medicines",
    oneLine: "SSRIs first for most; side effects come before benefit; keep going 6 months after feeling well; taper to stop.",
    tables: [
      {
        title: "The classes",
        table: {
          head: ["Class", "Examples", "Watch for", "Often chosen when"],
          rows: [
            ["SSRI", "Sertraline, escitalopram, fluoxetine", "Nausea, early anxiety, sexual side effects, low sodium in older adults", "First choice for most depression and anxiety"],
            ["SNRI", "Venlafaxine, duloxetine", "BP rise (venlafaxine), stopping symptoms", "SSRI not enough; pain with depression (duloxetine)"],
            ["Mirtazapine", "Mirtazapine", "Sleepiness, weight gain", "Poor sleep and appetite; few sexual side effects"],
            ["Tricyclic (TCA)", "Amitriptyline, imipramine, clomipramine", "Dry mouth, dizziness, heart rhythm; dangerous in overdose", "Specialist use; clomipramine for OCD"],
            ["Bupropion", "Bupropion", "Fits at high doses; avoid in eating disorders", "Sexual side effects or weight gain are a problem"],
          ],
        },
      },
      {
        title: "Week by week",
        table: {
          head: ["When", "What to expect"],
          rows: [
            ["Week 1 to 2", "Side effects first; sleep and energy may start to improve"],
            ["Week 2 to 4", "Review: some benefit should be starting"],
            ["Week 4 to 6", "Fuller effect; if little change at a good dose, think of a change"],
            ["After feeling well", "Continue at least 6 months; longer if episodes keep coming back"],
          ],
        },
      },
    ],
    monitoring: ["Under 25 or at risk: review within 1 week of starting", "Older adults on an SSRI: check sodium", "Ask about bleeding if on aspirin or NSAIDs"],
    emergencies: [{ name: "Switch into mania", signs: "Little sleep, high or irritable, fast speech", firstStep: "Stop the antidepressant and review the diagnosis" }],
    points: [{ title: "Stopping", points: ["Taper over weeks, not days", "Stopping symptoms: dizziness, 'electric shocks', irritability, flu-like feeling", "Worst with paroxetine and venlafaxine; least with fluoxetine (long-acting)"] }],
    links: { moduleId: "antidepressants", summaryId: "antidepressants", related: ["criteria-mdd", "pharm-antipsychotic-movement"], medicines: ["sertraline", "escitalopram", "fluoxetine", "venlafaxine", "mirtazapine", "amitriptyline", "bupropion"], practice: ["medicines"] },
    source: SRC,
    keywords: ["SSRI", "SNRI", "TCA", "weeks", "discontinuation", "stopping", "side effects"],
  },
  {
    id: "pharm-clozapine",
    type: "pharm",
    title: "Clozapine: when, blood tests and serious side effects",
    aka: ["Clozapine monitoring", "Agranulocytosis", "Treatment-resistant schizophrenia", "TRS"],
    topic: "medicines",
    oneLine: "The medicine for schizophrenia that has not responded to two others, with regular blood counts and a few serious risks to watch.",
    facts: [
      { label: "Used when", value: "2 adequate trials of other antipsychotics did not work" },
      { label: "Blood counts", value: "Weekly for at least the first 18 weeks, then less often" },
      { label: "Heart checks", value: "Troponin and CRP weekly for the first 4 weeks" },
      { label: "Missed 48 hours or more", value: "Start again from a low dose" },
    ],
    tables: [
      {
        title: "Serious side effects",
        table: {
          head: ["Risk", "When", "Watch for"],
          rows: [
            ["Low white cells (agranulocytosis)", "Mostly first 18 weeks", "Sore throat, fever, mouth ulcers"],
            ["Heart inflammation (myocarditis)", "Mostly first 8 weeks", "Chest pain, fast pulse, fever, breathless"],
            ["Constipation to bowel blockage", "Any time", "No stool for days, belly pain: can be fatal"],
            ["Fits", "Higher doses", "Jerks or seizures"],
            ["Metabolic", "Months", "Weight, sugar, lipids"],
          ],
        },
      },
    ],
    monitoring: ["The exact blood test schedule follows the country's rules and the clinic's monitoring service", "Ask about bowels at every visit", "Weight, sugar and lipids regularly"],
    interactions: ["Smoking lowers the level: stopping smoking can raise it sharply", "Avoid other drugs that lower white cells (carbamazepine)"],
    points: [{ title: "Also common", points: ["Drooling at night, sleepiness, dizziness on standing", "Fast pulse and mild fever in the first weeks", "Lowers suicide risk in schizophrenia"] }],
    links: { moduleId: "antipsychotics", summaryId: "antipsychotics", related: ["criteria-schizophrenia", "pharm-antipsychotic-movement"], medicines: ["clozapine"], practice: ["medicines"] },
    source: SRC,
    keywords: ["ANC", "white cells", "neutropenia", "myocarditis", "constipation", "resistant", "smoking"],
  },
  {
    id: "pharm-mood-stabilisers",
    type: "pharm",
    title: "Mood stabilisers: pregnancy, rash, sodium and liver",
    aka: ["Valproate", "Lamotrigine", "Carbamazepine", "Mood stabilisers in pregnancy", "Stevens-Johnson syndrome"],
    topic: "medicines",
    oneLine: "Valproate is the riskiest in pregnancy; lamotrigine needs a slow start for the rash; carbamazepine lowers sodium and speeds up other drugs.",
    tables: [
      {
        title: "Side by side",
        table: {
          head: ["Point", "Valproate", "Lamotrigine", "Carbamazepine"],
          rows: [
            ["Pregnancy", "Highest risk: birth defects and learning problems; avoid in girls and women who could become pregnant", "Among the safer choices; levels fall in pregnancy", "Birth defect risk; lowers the pill's effect"],
            ["Skin", "Rare", "Serious rash risk, highest in the first 8 weeks", "Serious rash; gene test (HLA-B*1502) advised for people of Asian ancestry"],
            ["Blood and salts", "Low platelets, raised ammonia", "Few", "Low sodium; low white cells (rare)"],
            ["Liver and gut", "Liver injury, pancreatitis", "Few", "Liver enzymes rise"],
            ["Other", "Weight gain, hair loss, tremor, period problems", "Dose halved if taken with valproate", "Speeds up the breakdown of many drugs"],
          ],
        },
      },
    ],
    monitoring: ["Valproate: liver tests and blood count before and in the first months; pregnancy prevention plan", "Lamotrigine: follow the slow dose schedule; restart slowly after a gap of 5 half-lives or more (about 5 days)", "Carbamazepine: sodium, blood count and liver tests"],
    interactions: ["The combined pill lowers lamotrigine levels", "Carbamazepine lowers levels of the pill, antipsychotics and many others"],
    emergencies: [{ name: "Serious rash", signs: "Rash with fever, mouth or eye sores, peeling skin", firstStep: "Stop the drug and seek urgent care" }],
    points: [{ title: "Lithium in pregnancy", points: ["A small heart defect risk; needs specialist planning", "Levels change through pregnancy and after birth: check more often"] }],
    links: { moduleId: "stabilisers", summaryId: "stabilisers", related: ["pharm-lithium", "criteria-bipolar"], medicines: ["valproate", "lamotrigine", "carbamazepine", "lithium"], practice: ["medicines"] },
    source: SRC,
    keywords: ["pregnancy", "teratogen", "rash", "SJS", "sodium", "hyponatraemia", "liver", "HLA"],
  },
  {
    id: "pharm-alcohol-withdrawal",
    type: "pharm",
    title: "Alcohol withdrawal and Wernicke's",
    aka: ["Delirium tremens", "Wernicke's encephalopathy", "Korsakoff syndrome", "Withdrawal seizures", "Thiamine"],
    topic: "substance",
    oneLine: "Shakes within a day, fits in the first two days, delirium tremens from day two or three; give thiamine before glucose.",
    replaces: ["wernicke-korsakoff"],
    tables: [
      {
        title: "Timeline after the last drink",
        table: {
          head: ["When", "What", "Watch for"],
          rows: [
            ["6 to 24 hours", "Simple withdrawal", "Tremor, sweating, anxiety, nausea, fast pulse, poor sleep"],
            ["12 to 48 hours", "Hallucinosis", "Voices or visions with a clear mind"],
            ["6 to 48 hours", "Withdrawal fits", "Usually one or a few generalised fits"],
            ["48 to 72 hours on", "Delirium tremens", "Confusion, visual hallucinations, fever, unstable pulse: an emergency"],
          ],
        },
      },
      {
        title: "Wernicke and Korsakoff",
        table: {
          head: ["", "Wernicke's encephalopathy", "Korsakoff syndrome"],
          rows: [
            ["Signs", "Confusion, unsteady walk, eye movement problems", "Severe memory loss for new events, made-up stories (confabulation)"],
            ["Note", "All three signs together in only a few: treat on suspicion", "Often follows untreated Wernicke's"],
            ["Treatment", "High-dose thiamine by injection, now", "Thiamine; support; often lasting"],
          ],
        },
      },
    ],
    monitoring: ["Use a withdrawal scale (CIWA-Ar) to guide doses", "A benzodiazepine, usually chlordiazepoxide; lorazepam or oxazepam if the liver is badly affected or in older adults", "Thiamine for everyone in planned withdrawal; by injection if at risk of Wernicke's", "Give thiamine before glucose"],
    emergencies: [{ name: "Delirium tremens", signs: "Confused, shaking, seeing things, fever", firstStep: "Medical emergency: admit, benzodiazepine, fluids, thiamine" }],
    points: [{ title: "Who should withdraw in hospital", points: ["Past fits or delirium tremens", "Heavy daily drinking with medical illness", "Older adults, pregnancy, no one at home"] }],
    links: { moduleId: "substance", summaryId: "substance", related: ["criteria-aud", "criteria-delirium", "assess-scales"], medicines: ["chlordiazepoxide", "lorazepam", "diazepam"], practice: ["medicines"] },
    source: SRC,
    keywords: ["DT", "tremor", "seizure", "thiamine", "B1", "CIWA", "benzodiazepine", "confabulation"],
  },
];
