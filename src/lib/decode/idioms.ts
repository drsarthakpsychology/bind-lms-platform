/**
 * The Idiom Bank (v5 Part 1) — real phrases an Indian patient says, with
 * everything each might mean. Nichter's "idioms of distress" concept, applied.
 *
 * Every entry: the phrase, its register, possible meanings (each with a
 * likelihood + the clue that would distinguish it), the disambiguating
 * questions that resolve it, the trap (the default misread), and sources.
 *
 * The clinical teaching spine is Kirmayer & Young's seven readings of a
 * somatic complaint: disease · symbolic expression of intrapsychic conflict ·
 * specific psychopathology · culturally salient idiom · metaphor · social
 * positioning · protest. Students are taught one; this teaches all.
 */

export interface IdiomMeaning {
  reading: string;
  likelihood: "high" | "medium" | "low";
  clue?: string;
  /** true when this is a physical/medical reading — missing these scores harder */
  physical?: boolean;
}

export interface IdiomEntry {
  id: string;
  phrase: string;
  register: string[];
  /** Kirmayer & Young readings that plausibly apply. */
  readings: Array<"disease" | "intrapsychic" | "psychopathology" | "cultural_idiom" | "metaphor" | "social_positioning" | "protest">;
  possible_meanings: IdiomMeaning[];
  disambiguating_questions: string[];
  trap: string;
  sources: string[];
}

const ALL_SOMATIC: IdiomEntry[] = [
  {
    id: "idiom-fresh",
    phrase: "fresh nahi lag raha / not feeling fresh",
    register: ["Hindi-English", "all ages", "very common"],
    readings: ["disease", "psychopathology", "metaphor"],
    possible_meanings: [
      { reading: "Incomplete bowel evacuation / constipation", likelihood: "high", clue: "mentions morning, stomach, 'motion'", physical: true },
      { reading: "Non-restorative sleep", likelihood: "high", clue: "wakes unrefreshed, snoring, daytime sleepiness", physical: true },
      { reading: "Anhedonia / depressive fatigue", likelihood: "medium", clue: "pervasive, worse in morning, loss of interest" },
      { reading: "Anxiety with somatic tension", likelihood: "medium" },
      { reading: "Medication sedation", likelihood: "medium", clue: "on a benzodiazepine or sedating antihistamine", physical: true },
      { reading: "Anaemia / hypothyroid / B12", likelihood: "medium", clue: "pallor, hair fall, cold intolerance, heavy periods", physical: true },
    ],
    disambiguating_questions: [
      "Tell me about yesterday morning — from waking up to leaving the house.",
      "When you say fresh — what would feeling fresh look like?",
      "Is it there the whole day or does it change?",
      "What do you think is causing it?",
    ],
    trap: "Assuming emotional meaning without asking. The word is doing work you can't see.",
    sources: ["Nichter idioms of distress", "DSM-5 CFI"],
  },
  {
    id: "idiom-ghabrahat",
    phrase: "ghabrahat",
    register: ["Hindi", "all ages", "very common"],
    readings: ["psychopathology", "disease", "cultural_idiom"],
    possible_meanings: [
      { reading: "Panic / anxiety attacks", likelihood: "high", clue: "palpitations, breathlessness, fear of dying" },
      { reading: "Agitation in depression", likelihood: "medium", clue: "low mood alongside the restlessness" },
      { reading: "Hypoglycaemia", likelihood: "medium", clue: "improves with food, tremor, sweating", physical: true },
      { reading: "Thyroid overactivity", likelihood: "medium", clue: "weight loss, heat intolerance, tremor", physical: true },
      { reading: "Withdrawal (alcohol/benzos)", likelihood: "medium", clue: "timing after last drink/dose", physical: true },
    ],
    disambiguating_questions: [
      "When the ghabrahat comes, what exactly happens in your body?",
      "How long does it last, and what stops it?",
      "Do you feel it when you're hungry?",
      "How have you been sleeping and eating lately?",
    ],
    trap: "Hearing 'anxiety' and stopping — ghabrahat is how a panic attack, a thyroid problem, or a withdrawal all present.",
    sources: ["Nichter idioms of distress", "mhGAP anxiety module"],
  },
  {
    id: "idiom-kamzori",
    phrase: "kamzori / weakness",
    register: ["Hindi", "all ages", "very common"],
    readings: ["disease", "psychopathology", "cultural_idiom"],
    possible_meanings: [
      { reading: "Anaemia / nutritional deficiency", likelihood: "high", clue: "pallor, fatigue, dietary history", physical: true },
      { reading: "Depressive anergia", likelihood: "medium", clue: "loss of interest, low mood alongside" },
      { reading: "Chronic disease (TB, diabetes, thyroid)", likelihood: "medium", clue: "weight loss, fever, thirst", physical: true },
      { reading: "Dhat-associated weakness (young men)", likelihood: "medium", clue: "perceived semen loss", physical: true },
    ],
    disambiguating_questions: [
      "When did the weakness start, and is it worse at any time?",
      "Any fever, weight loss, cough, thirst?",
      "Are you eating properly? Any blood loss?",
      "What do you think is causing the weakness?",
    ],
    trap: "Writing 'fatigue' and moving on — kamzori is the universal carrier for anaemia, TB, depression, and dhat distress.",
    sources: ["Nichter idioms of distress", "mhGAP depression module"],
  },
  {
    id: "idiom-gas",
    phrase: "gas / gas ho gaya",
    register: ["Hindi-English", "all ages"],
    readings: ["disease", "cultural_idiom", "metaphor"],
    possible_meanings: [
      { reading: "Functional dyspepsia / IBS", likelihood: "high", clue: "bloating, pain relieved by passing gas", physical: true },
      { reading: "Chest pain from anxiety", likelihood: "medium", clue: "accompanies palpitations, breathlessness" },
      { reading: "Somatic expression of low mood / stress", likelihood: "medium", clue: "worsens with stressors, other mood symptoms" },
    ],
    disambiguating_questions: [
      "Where exactly is the gas — chest or stomach?",
      "Does it come with your heart racing or breathlessness?",
      "When does it get worse — after food, or after something upsetting?",
    ],
    trap: "'Gas' is the single most common somatic mask for anxiety and depression in Indian primary care.",
    sources: ["Nichter idioms of distress"],
  },
  {
    id: "idiom-sar-bhari",
    phrase: "sar bhari / heavy head",
    register: ["Hindi", "all ages"],
    readings: ["disease", "psychopathology", "cultural_idiom"],
    possible_meanings: [
      { reading: "Tension headache / hypertension", likelihood: "high", clue: "band-like pressure, worse end of day", physical: true },
      { reading: "Depressive heaviness", likelihood: "medium", clue: "accompanies low mood, morning worsening" },
      { reading: "Sinus congestion", likelihood: "medium", clue: "facial pressure, discharge", physical: true },
      { reading: "Sleep deprivation", likelihood: "medium", physical: true },
    ],
    disambiguating_questions: [
      "Is it a tight band, a pressure, or a pain?",
      "When does it start and what relieves it?",
      "How is your sleep?",
    ],
    trap: "'Heavy head' is often the first sentence of a depressed patient, not a neurological one.",
    sources: ["Nichter idioms of distress"],
  },
  {
    id: "idiom-body-pain",
    phrase: "poora sharir dukhta hai / my whole body hurts",
    register: ["Hindi", "middle-aged +", "common"],
    readings: ["disease", "psychopathology", "cultural_idiom"],
    possible_meanings: [
      { reading: "Depression with somatic syndrome", likelihood: "high", clue: "diffuse, migratory pain, mood symptoms, morning worsening" },
      { reading: "Fibromyalgia / chronic pain syndrome", likelihood: "medium", clue: "widespread, tender points, fatigue", physical: true },
      { reading: "Vitamin D / anaemia", likelihood: "medium", clue: "bone pain, fatigue", physical: true },
      { reading: "Inflammatory condition", likelihood: "low", clue: "joint swelling, stiffness, fever", physical: true },
    ],
    disambiguating_questions: [
      "Where does it hurt most, and is it the same place every day?",
      "Does the pain come with low mood or worry?",
      "What makes it better and worse?",
    ],
    trap: "Diffuse 'whole body' pain in a mid-life patient is depression until proven otherwise.",
    sources: ["Nichter idioms of distress", "ICD-11 somatic distress"],
  },
  {
    id: "idiom-dil-ghabrata",
    phrase: "dil ghabrata hai / heart flutters",
    register: ["Hindi", "all ages"],
    readings: ["disease", "psychopathology", "cultural_idiom"],
    possible_meanings: [
      { reading: "Panic attack", likelihood: "high", clue: "sudden, palpitations, fear of dying" },
      { reading: "Arrhythmia", likelihood: "medium", clue: "irregular, faints, exertional", physical: true },
      { reading: "Anaemia", likelihood: "medium", clue: "pallor, easy fatigue", physical: true },
      { reading: "Emotional distress naming the heart", likelihood: "medium", clue: "'dil' is the Indian seat of feeling" },
    ],
    disambiguating_questions: [
      "Is it fast, irregular, or a sinking feeling?",
      "Does it happen at rest or on effort?",
      "When you feel it, what's going through your mind?",
    ],
    trap: "The heart is the Indian seat of emotion — 'dil ghabrata hai' is as likely grief as arrhythmia.",
    sources: ["Nichter idioms of distress"],
  },
  {
    id: "idiom-garmi",
    phrase: "garmi lagti hai / heat in the body",
    register: ["Hindi", "middle-aged +"],
    readings: ["disease", "cultural_idiom", "psychopathology"],
    possible_meanings: [
      { reading: "Menopausal hot flushes", likelihood: "high", clue: "age, night sweats, irregular periods", physical: true },
      { reading: "Hyperthyroidism", likelihood: "medium", clue: "weight loss, tremor, heat intolerance", physical: true },
      { reading: "Anxiety / agitation", likelihood: "medium", clue: "accompanies restlessness, irritability" },
      { reading: "Cultural idiom for anger / 'heat'", likelihood: "medium", clue: "'heat' in the body maps to inner turmoil" },
    ],
    disambiguating_questions: [
      "Is the heat constant or in waves?",
      "Any sweating at night, weight change, tremor?",
      "Does the heat come when you're upset?",
    ],
    trap: "'Heat in the body' is both a menopausal symptom and a cultural idiom for emotional turmoil — ask.",
    sources: ["Nichter idioms of distress", "culture-bound syndromes literature"],
  },
];

/** Culture-bound presentations (documented, teachable as clinical insight). */
const CULTURE_BOUND: IdiomEntry[] = [
  {
    id: "idiom-dhat",
    phrase: "dhat rog / semen loss distress",
    register: ["Hindi", "young men", "South Asia"],
    readings: ["cultural_idiom", "psychopathology", "intrapsychic"],
    possible_meanings: [
      { reading: "Anxiety / depression focused on perceived semen loss", likelihood: "high", clue: "weakness, memory complaints, avoidance of marriage" },
      { reading: "No medical disorder (the 'loss' is physiological)", likelihood: "high", physical: true },
      { reading: "Guilt about sexuality / masturbation", likelihood: "medium", clue: "religious or moral framing" },
    ],
    disambiguating_questions: [
      "What exactly are you losing, and how do you know?",
      "What did the previous 'specialists' tell you?",
      "Has anyone examined you for this?",
      "What do you think the loss is doing to your body?",
    ],
    trap: "Treating dhat as either 'all in the head' (dismissive) or a real physical disease (colludes with the fear). The distress is real; the mechanism is not semen loss.",
    sources: ["DSM-5 cultural concepts of distress", "Chaturvedi et al."],
  },
  {
    id: "idiom-koro",
    phrase: "koro / genital retraction fear",
    register: ["South Asian + Southeast Asian", "episodic"],
    readings: ["cultural_idiom", "psychopathology"],
    possible_meanings: [
      { reading: "Culture-bound panic (koro) — fear genitals will retract", likelihood: "high", clue: "episodic, community-triggered, fixed belief" },
      { reading: "Underlying anxiety disorder", likelihood: "medium", clue: "generalised anxiety outside episodes" },
    ],
    disambiguating_questions: [
      "When did you first notice this fear?",
      "Are others in the community saying the same thing?",
      "What happens if you try not to think about it?",
    ],
    trap: "Treating a culturally-shared panic as individual delusion.",
    sources: ["DSM-5 cultural concepts", "classic culture-bound literature"],
  },
  {
    id: "idiom-sinking-heart",
    phrase: "dil baith jana / sinking heart",
    register: ["Punjabi", "Krause 1989"],
    readings: ["cultural_idiom", "psychopathology", "disease"],
    possible_meanings: [
      { reading: "Grief / loss reaction", likelihood: "high", clue: "preceded by a loss or disappointment" },
      { reading: "Depression", likelihood: "medium", clue: "persistent low mood, anhedonia" },
      { reading: "Cardiac / chest sensation", likelihood: "medium", clue: "exertional, radiating, risk factors", physical: true },
    ],
    disambiguating_questions: [
      "When the heart sinks, what is it reacting to?",
      "How long does it last?",
      "Any chest pain, breathlessness on effort?",
    ],
    trap: "Reading a culturally-specific idiom for grief as a cardiac symptom — or vice versa.",
    sources: ["Krause 1989", "Punjabi idioms of distress"],
  },
  {
    id: "idiom-possession",
    phrase: "possession / kisi ne kuch kar diya",
    register: ["Hindi", "community settings"],
    readings: ["cultural_idiom", "psychopathology", "social_positioning", "protest"],
    possible_meanings: [
      { reading: "Culturally sanctioned distress expression (esp. women in restrictive settings)", likelihood: "high", clue: "role release, community-recognised pattern, no functional decline outside episodes" },
      { reading: "First-episode psychosis", likelihood: "medium", clue: "fixed, disorganised, deteriorating function, command hallucinations" },
      { reading: "Dissociative episode", likelihood: "medium", clue: "amnesia, trance, triggered by stress" },
      { reading: "Conversion / somatoform", likelihood: "medium" },
    ],
    disambiguating_questions: [
      "What happened before the first episode?",
      "Is she the same person between episodes?",
      "How does the family understand it?",
      "Is there any time she is fully herself?",
    ],
    trap: "Dismissing genuine psychosis as 'just possession' — OR pathologising a culturally-sanctioned distress expression. The literature is explicit: possession states are often culturally allowed outlets, especially for women, permitting temporary role release.",
    sources: ["DSM-5 cultural concepts", "possession trance literature", "mhGAP"],
  },
  {
    id: "idiom-white-discharge",
    phrase: "leukorrhea / white discharge as bodily idiom",
    register: ["Hindi", "women", "north India"],
    readings: ["cultural_idiom", "disease", "psychopathology"],
    possible_meanings: [
      { reading: "Physiological discharge (normal)", likelihood: "high", physical: true },
      { reading: "Infection (candidal, bacterial)", likelihood: "medium", clue: "itching, odour, dyspareunia", physical: true },
      { reading: "Distress idiom for marital / sexual problems", likelihood: "medium", clue: "discharge as the 'safe' way to speak of sexual or marital distress" },
    ],
    disambiguating_questions: [
      "How did you notice it, and what does it stop you doing?",
      "Any itching, smell, pain?",
      "How are things at home / in the marriage?",
    ],
    trap: "White discharge is documented (Chaturvedi et al.; Garhwal work) as a bodily idiom through which women speak about marital and sexual distress — treat the discharge only and you miss the conversation.",
    sources: ["Chaturvedi et al.", "Garhwal idioms study"],
  },
];

/** Borrowed-biomedical + attributional + English vague complaints. */
const BORROWED: IdiomEntry[] = [
  {
    id: "idiom-depression-ho-gaya",
    phrase: "depression ho gaya",
    register: ["Hindi-English", "all ages"],
    readings: ["cultural_idiom", "metaphor", "psychopathology"],
    possible_meanings: [
      { reading: "Colloquial sadness (not the disorder)", likelihood: "high", clue: "contextual, transient, reactive" },
      { reading: "Major depression (the disorder)", likelihood: "medium", clue: "pervasive, functional decline, biological symptoms" },
    ],
    disambiguating_questions: [
      "When you say depression, what does a bad day look like?",
      "How long have you felt this way, and is anything helping?",
      "Is it every day, most of the day?",
    ],
    trap: "Hearing the word 'depression' and assuming the disorder — the word is now a borrowed idiom for any unhappiness.",
    sources: ["Nichter idioms of distress"],
  },
  {
    id: "idiom-bp-high",
    phrase: "BP high ho gaya",
    register: ["Hindi-English", "middle-aged +"],
    readings: ["cultural_idiom", "disease", "metaphor"],
    possible_meanings: [
      { reading: "Anger / emotional upset (idiom)", likelihood: "high", clue: "no measured BP, situational" },
      { reading: "Actual hypertension", likelihood: "medium", clue: "measured high, headaches, risk factors", physical: true },
      { reading: "Anxiety spike", likelihood: "medium" },
    ],
    disambiguating_questions: [
      "When you say BP high — have you measured it?",
      "What was happening when it 'went high'?",
      "Any headache, chest pain, blurring?",
    ],
    trap: "'BP high ho gaya' is how a generation says 'I got very upset' — the idiom and the disease are different things.",
    sources: ["Nichter idioms of distress"],
  },
  {
    id: "idiom-tension",
    phrase: "tension hai",
    register: ["Hindi-English", "all ages", "means everything"],
    readings: ["cultural_idiom", "psychopathology", "metaphor", "social_positioning"],
    possible_meanings: [
      { reading: "Stress / worry (normal)", likelihood: "high" },
      { reading: "Generalised anxiety disorder", likelihood: "medium", clue: "pervasive worry, physical tension, sleep disturbance" },
      { reading: "Depression", likelihood: "medium", clue: "low mood underneath the 'tension'" },
      { reading: "Family / financial strain (social)", likelihood: "medium" },
    ],
    disambiguating_questions: [
      "What is the tension about?",
      "Is it there every day, even on good days?",
      "What does it do to your sleep, appetite, energy?",
    ],
    trap: "'Tension' is the emptiest and most loaded word in Indian clinical Hindi — it means everything, so it means nothing until you specify it.",
    sources: ["Nichter idioms of distress"],
  },
  {
    id: "idiom-nazar",
    phrase: "nazar lag gayi / evil eye",
    register: ["Hindi", "community settings"],
    readings: ["cultural_idiom", "social_positioning"],
    possible_meanings: [
      { reading: "Attribution of misfortune to the evil eye", likelihood: "high", clue: "preceded by envy, a compliment, a milestone" },
      { reading: "Underlying depression / anxiety the family is framing as nazar", likelihood: "medium", clue: "the symptoms persist regardless of the framing" },
    ],
    disambiguating_questions: [
      "When did people start saying it's nazar?",
      "Separate from that — how has the child/relative actually been?",
      "What would be different if the nazar were removed?",
    ],
    trap: "Mocking the attribution OR accepting it uncritically. The attribution is the family's language; the symptoms are still yours to assess.",
    sources: ["DSM-5 CFI", "cultural attribution literature"],
  },
  {
    id: "idiom-low",
    phrase: "feeling low",
    register: ["English", "younger"],
    readings: ["psychopathology", "metaphor", "cultural_idiom"],
    possible_meanings: [
      { reading: "Depression", likelihood: "medium", clue: "pervasive, functional, biological symptoms" },
      { reading: "Situational low mood", likelihood: "high", clue: "reactive, transient" },
      { reading: "Boredom / restlessness", likelihood: "medium" },
    ],
    disambiguating_questions: [
      "Low compared to what?",
      "How many days in the last two weeks?",
      "What do you lose because of it?",
    ],
    trap: "'Feeling low' is the English-language 'tension hai' — the word tells you nothing until you quantify it.",
    sources: ["Nichter idioms of distress"],
  },
  {
    id: "idiom-focus",
    phrase: "not able to focus",
    register: ["English", "students + professionals"],
    readings: ["psychopathology", "disease", "metaphor"],
    possible_meanings: [
      { reading: "Depression (concentration is a core symptom)", likelihood: "medium", clue: "low mood, anergia alongside" },
      { reading: "Anxiety (mind racing)", likelihood: "medium", clue: "worry driving the distraction" },
      { reading: "ADHD", likelihood: "medium", clue: "lifelong pattern, since childhood" },
      { reading: "Sleep deprivation / burnout", likelihood: "medium", clue: "chronic under-sleep, work overload", physical: true },
    ],
    disambiguating_questions: [
      "When you can't focus, what is your mind actually doing?",
      "Has this been true since childhood or is it new?",
      "How are you sleeping?",
    ],
    trap: "The 'focus' complaint is a lazy student, ADHD, depression, anxiety, or exhaustion — and the first three need very different responses.",
    sources: ["ICD-11", "mhGAP"],
  },
];

/** The remaining compulsory seed set — the rest of the somatic, borrowed,
 *  attributional and English vague-complaint idioms. */
const EXTRA: IdiomEntry[] = [
  {
    id: "idiom-bechaini",
    phrase: "bechaini / restlessness",
    register: ["Hindi", "all ages"],
    readings: ["psychopathology", "disease", "cultural_idiom"],
    possible_meanings: [
      { reading: "Anxiety / agitation", likelihood: "high", clue: "accompanies worry, tension, insomnia" },
      { reading: "Depression with agitation", likelihood: "medium", clue: "low mood + restlessness" },
      { reading: "Akathisia (drug-induced restlessness)", likelihood: "medium", clue: "on antipsychotic, urge to pace, worse than anxiety responds to", physical: true },
      { reading: "Hyperthyroid", likelihood: "low", clue: "weight loss, tremor, heat intolerance", physical: true },
    ],
    disambiguating_questions: [
      "When the bechaini comes, do you feel a need to move or pace?",
      "Are you on any medication at the moment?",
      "Is it constant or does it come in waves?",
    ],
    trap: "Akathisia is restlessness caused by antipsychotics — if you read it as anxiety and raise the dose, you make it worse.",
    sources: ["ICD-11", "psychopharmacology literature"],
  },
  {
    id: "idiom-sar-mein-hawa",
    phrase: "sar mein hawa / wind in the head",
    register: ["Hindi", "older adults"],
    readings: ["cultural_idiom", "disease", "psychopathology"],
    possible_meanings: [
      { reading: "Dizziness / vertigo", likelihood: "high", clue: "spinning, imbalance, worse with movement", physical: true },
      { reading: "Anxiety / depersonalisation", likelihood: "medium", clue: "light-headed, 'not myself', panic context" },
      { reading: "Cervical / BP causes", likelihood: "medium", physical: true },
    ],
    disambiguating_questions: [
      "When the wind is in your head, do you feel the room spin?",
      "Does it happen on standing, moving, or at rest?",
      "Any ringing in the ears?",
    ],
    trap: "'Wind in the head' is the older adult's idiom for vertigo AND for feeling unreal — disambiguate by whether the room spins.",
    sources: ["Nichter idioms of distress"],
  },
  {
    id: "idiom-chakkar",
    phrase: "chakkar / giddiness",
    register: ["Hindi", "all ages"],
    readings: ["disease", "psychopathology", "cultural_idiom"],
    possible_meanings: [
      { reading: "Orthostatic hypotension / anaemia", likelihood: "high", clue: "on standing, pallor, low BP", physical: true },
      { reading: "Vestibular vertigo", likelihood: "medium", clue: "spinning, nystagmus", physical: true },
      { reading: "Anxiety / panic light-headedness", likelihood: "medium", clue: "accompanies palpitations, breathlessness" },
      { reading: "Hypoglycaemia", likelihood: "medium", clue: "before meals, improves with food", physical: true },
    ],
    disambiguating_questions: [
      "Does the world spin, or do you feel faint?",
      "When does it happen — standing, hungry, anxious?",
      "Any palpitations, sweating, tremor?",
    ],
    trap: "'Chakkar' is the shared carrier for anaemia, vertigo, hypoglycaemia and panic — always check the physical first.",
    sources: ["Nichter idioms of distress", "mhGAP"],
  },
  {
    id: "idiom-neend",
    phrase: "neend nahi aati / can't sleep",
    register: ["Hindi", "all ages"],
    readings: ["psychopathology", "disease", "cultural_idiom"],
    possible_meanings: [
      { reading: "Insomnia of depression (early waking)", likelihood: "high", clue: "wakes 3-4am, low mood" },
      { reading: "Insomnia of anxiety (trouble falling)", likelihood: "high", clue: "mind racing at bedtime" },
      { reading: "Substance / stimulant effect", likelihood: "medium", clue: "chai, tobacco, alcohol rebound", physical: true },
      { reading: "Sleep apnoea / poor hygiene", likelihood: "medium", clue: "snoring, daytime sleepiness", physical: true },
    ],
    disambiguating_questions: [
      "Is it falling asleep or staying asleep?",
      "What time do you wake, and how do you feel then?",
      "What have you tried, and what's in the day?",
    ],
    trap: "Sleep disturbance is the earliest and most reliable symptom in both depression and anxiety — the pattern (early waking vs trouble falling) tells you which.",
    sources: ["ICD-11", "mhGAP"],
  },
  {
    id: "idiom-dimag",
    phrase: "dimag kaam nahi karta / mind doesn't work",
    register: ["Hindi", "all ages"],
    readings: ["psychopathology", "cultural_idiom", "disease"],
    possible_meanings: [
      { reading: "Concentration / memory complaints in depression", likelihood: "high", clue: "low mood, anergia, worse under stress" },
      { reading: "Cognitive decline / dementia", likelihood: "medium", clue: "progressive, disorientation, functional loss", physical: true },
      { reading: "Dissociation / feeling unreal", likelihood: "medium", clue: "'my head feels separate from me'" },
      { reading: "B12 / thyroid / medication", likelihood: "medium", clue: "other systemic signs", physical: true },
    ],
    disambiguating_questions: [
      "When did you first notice the mind not working?",
      "Is it worse at certain times or under stress?",
      "Do you forget where you are or just names and plans?",
    ],
    trap: "'Mind doesn't work' is depression's favourite disguise in the middle-aged — check for the mood, then the reversible causes.",
    sources: ["Nichter idioms of distress", "ICD-11"],
  },
  {
    id: "idiom-cold-limbs",
    phrase: "haath-pair thande / cold hands and feet",
    register: ["Hindi", "women + older adults"],
    readings: ["disease", "cultural_idiom", "psychopathology"],
    possible_meanings: [
      { reading: "Anaemia / poor peripheral circulation", likelihood: "high", clue: "pallor, fatigue, haemoglobin", physical: true },
      { reading: "Hypothyroid", likelihood: "medium", clue: "weight gain, hair fall, cold intolerance", physical: true },
      { reading: "Anxiety (sympathetic vasoconstriction)", likelihood: "medium", clue: "accompanies trembling, worry" },
    ],
    disambiguating_questions: [
      "Are the hands cold all day or when you're nervous?",
      "Any anaemia, hair fall, weight change?",
      "Do you feel the cold everywhere or just the limbs?",
    ],
    trap: "Cold limbs is the body's cheap blood-pressure warning — check thyroid and haemoglobin before you read it psychologically.",
    sources: ["Nichter idioms of distress"],
  },
  {
    id: "idiom-acidity",
    phrase: "acidity",
    register: ["Hindi-English", "all ages"],
    readings: ["disease", "cultural_idiom", "psychopathology"],
    possible_meanings: [
      { reading: "GERD / dyspepsia", likelihood: "high", clue: "burning, after food, relieved by antacids", physical: true },
      { reading: "Chest pain of anxiety", likelihood: "medium", clue: "accompanies palpitations, breathlessness" },
      { reading: "Emotional 'burning' idiom", likelihood: "medium", clue: "'she gives me acidity' = she makes me angry/upset" },
    ],
    disambiguating_questions: [
      "Where exactly is the acidity — chest or upper stomach?",
      "Does it come with your heart racing or with anger?",
      "What makes it better?",
    ],
    trap: "'She gives me acidity' is a literal description of what an emotionally draining person does to someone — the phrase is as emotional as it is digestive.",
    sources: ["Nichter idioms of distress"],
  },
  {
    id: "idiom-vaat-pitta",
    phrase: "vaat/pitta imbalance",
    register: ["Hindi / Ayurvedic vocabulary", "older adults"],
    readings: ["cultural_idiom", "disease", "metaphor"],
    possible_meanings: [
      { reading: "Ayurvedic attribution of symptoms", likelihood: "high", clue: "the patient has a humoral explanation already" },
      { reading: "Underlying depression / anxiety being framed in humoral terms", likelihood: "medium", clue: "the symptoms fit a mood disorder regardless of the frame" },
    ],
    disambiguating_questions: [
      "In your understanding, what is out of balance?",
      "Separate from the balance — how have you been sleeping and feeling?",
      "What have you tried for the imbalance?",
    ],
    trap: "The humoral frame is the patient's language, not your diagnosis — honour it, then assess the actual symptoms.",
    sources: ["DSM-5 CFI", "cultural attribution literature"],
  },
  {
    id: "idiom-graha-dosh",
    phrase: "graha dosh / planetary affliction",
    register: ["Hindi", "family settings"],
    readings: ["cultural_idiom", "metaphor", "social_positioning"],
    possible_meanings: [
      { reading: "Astrological attribution of misfortune", likelihood: "high", clue: "family consults an astrologer first" },
      { reading: "Family's frame for mental illness symptoms", likelihood: "medium", clue: "the symptoms are real but being explained as planetary" },
    ],
    disambiguating_questions: [
      "What do the astrologers say is wrong?",
      "Whatever the cause — what has the person actually been doing and feeling?",
      "Has anything like this happened before?",
    ],
    trap: "Astrological attribution delays care — the symptoms are still yours to assess, gently, inside the family's frame.",
    sources: ["DSM-5 CFI", "Nichter"],
  },
  {
    id: "idiom-something-happening",
    phrase: "kisi ne kuch kar diya / something has been done to me",
    register: ["Hindi", "community settings"],
    readings: ["cultural_idiom", "psychopathology", "protest"],
    possible_meanings: [
      { reading: "Belief of being bewitched / cursed", likelihood: "high", clue: "community-suggested, follows a quarrel or envy" },
      { reading: "First-episode psychosis (delusional)", likelihood: "medium", clue: "fixed, bizarre, deteriorating function" },
      { reading: "Severe depression with guilt (paranoid guilt)", likelihood: "medium" },
    ],
    disambiguating_questions: [
      "Who do you think has done this, and why?",
      "Has this been constant or does it come and go?",
      "Are you the same person between these thoughts?",
    ],
    trap: "The boundary between cultural attribution and delusion is function — a belief that leaves the person intact is idiom; one that disorganises them is psychosis.",
    sources: ["DSM-5 cultural concepts", "possession literature"],
  },
  {
    id: "idiom-stressed",
    phrase: "I'm stressed",
    register: ["English", "younger"],
    readings: ["cultural_idiom", "psychopathology", "metaphor"],
    possible_meanings: [
      { reading: "Situational stress (normal)", likelihood: "high", clue: "reactive, time-limited, coping intact" },
      { reading: "Anxiety disorder", likelihood: "medium", clue: "pervasive worry, physical tension, avoidance" },
      { reading: "Depression", likelihood: "medium", clue: "low mood beneath the 'stress'" },
    ],
    disambiguating_questions: [
      "What is the stress about, and how long has it been there?",
      "Is it there even on a quiet day?",
      "What does it do to sleep, appetite, energy, interest?",
    ],
    trap: "'Stressed' is now the universal English-language idiom — it can mean anything from a bad week to a mood disorder.",
    sources: ["Nichter idioms of distress"],
  },
  {
    id: "idiom-weird",
    phrase: "feeling weird",
    register: ["English", "younger"],
    readings: ["psychopathology", "cultural_idiom", "disease"],
    possible_meanings: [
      { reading: "Dissociation / depersonalisation", likelihood: "medium", clue: "'not myself', 'watching myself', trance-like" },
      { reading: "Panic prodrome", likelihood: "medium", clue: "builds into palpitations, dread" },
      { reading: "Medication effect / substance", likelihood: "medium", clue: "timing after dose or intake", physical: true },
      { reading: "Emerging psychosis (rare)", likelihood: "low", clue: "odd beliefs, perceptual changes, function loss" },
    ],
    disambiguating_questions: [
      "Can you describe 'weird' — what exactly feels different?",
      "When did it start, and is anything tied to it?",
      "Any medication, substances, or sleep changes?",
    ],
    trap: "'Feeling weird' is the young adult's first word for dissociation, panic, or a drug reaction — always ask 'different from what?'",
    sources: ["ICD-11", "mhGAP"],
  },
  {
    id: "idiom-something-to-me",
    phrase: "something is happening to me",
    register: ["English", "adolescents + young adults"],
    readings: ["psychopathology", "disease", "cultural_idiom"],
    possible_meanings: [
      { reading: "Dissociative experience", likelihood: "medium", clue: "depersonalisation, derealisation, trance" },
      { reading: "Emerging psychosis (early)", likelihood: "medium", clue: "perceptual changes, ideas of reference, withdrawal" },
      { reading: "Panic / anxiety", likelihood: "medium", clue: "accompanies palpitations, dread" },
    ],
    disambiguating_questions: [
      "When you say something is happening — what exactly do you notice?",
      "Do you feel different from yourself, or is the world different?",
      "Has anyone else noticed a change in you?",
    ],
    trap: "The passive 'happening to me' phrasing is itself a clue — it suggests the person doesn't feel in control of their own experience, which leans dissociation or early psychosis.",
    sources: ["ICD-11", "early intervention literature"],
  },
  {
    id: "idiom-fine-tired",
    phrase: "I'm fine, just tired",
    register: ["English", "all ages", "the most common lie"],
    readings: ["cultural_idiom", "psychopathology", "metaphor", "protest"],
    possible_meanings: [
      { reading: "Genuinely fine", likelihood: "low", clue: "no other symptoms, context normal" },
      { reading: "Depression in disguise", likelihood: "medium", clue: "low mood, anhedonia, withdrawal beneath the 'fine'" },
      { reading: "A refusal to engage (protest)", likelihood: "medium", clue: "says it flat, avoids eye contact, came unwillingly" },
      { reading: "Physical fatigue / anaemia / thyroid", likelihood: "medium", clue: "pallor, weight change, cold intolerance", physical: true },
    ],
    disambiguating_questions: [
      "How many days in the last two weeks have you felt fine?",
      "What would you be doing if you weren't so tired?",
      "Is there anything you've stopped doing lately?",
    ],
    trap: "'I'm fine, just tired' is the sentence that opens most consultations that end in a diagnosis — it is almost never literal.",
    sources: ["Nichter idioms of distress", "clinical folklore"],
  },
];

export const IDIOMS: IdiomEntry[] = [...ALL_SOMATIC, ...CULTURE_BOUND, ...BORROWED, ...EXTRA];

/** Score a multi-select decode attempt: physical readings weigh more. */
export function scoreDecode(entry: IdiomEntry, selected: string[]): { score: number; max: number; missedPhysical: string[] } {
  const correct = new Set(entry.possible_meanings.map((m) => m.reading));
  const missedPhysical = entry.possible_meanings.filter((m) => m.physical && !selected.includes(m.reading)).map((m) => m.reading);
  // +1 per correct reading, +0.5 bonus per physical reading caught.
  let score = 0;
  for (const s of selected) if (correct.has(s)) score += 1 + (entry.possible_meanings.find((m) => m.reading === s)?.physical ? 0.5 : 0);
  // Penalty for selecting a reading that isn't in the bank for this phrase.
  for (const s of selected) if (!correct.has(s)) score -= 0.5;
  const max = entry.possible_meanings.reduce((a, m) => a + 1 + (m.physical ? 0.5 : 0), 0);
  return { score: Math.max(0, score), max, missedPhysical };
}
