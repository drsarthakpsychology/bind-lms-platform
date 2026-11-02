/**
 * Every word on the public homepage, in one place. Edit here, not in the JSX.
 * Source: the approved Cohort Two brochure (Nov 2026) + the live site's faculty.
 * Nothing invented: if a fact changes, change it here.
 */
import type { CastName, IconName } from "./art";

export const COHORT = {
  label: "Cohort Two",
  starts: "First week of December 2026",
  startsShort: "Dec 2026",
  length: "16 weeks",
  where: "Ahmedabad + online",
  hours: "90 to 400+ hours",
} as const;

export const CONTACT = {
  person: "Kavya Bothra",
  role: "Chief Operating Officer",
  roleNote: "Point of contact for authorisation",
  phone: "+91 78770 49920",
  phoneHref: "tel:+917877049920",
  whatsappHref: "https://wa.me/917877049920",
  address: ["M-2, Mahakant Complex,", "Opposite V.S. Hospital,", "Ellisbridge, Paldi,", "Ahmedabad, Gujarat 380006"],
} as const;

export const LINKS = {
  apply: "/waitlist",
  login: "/login",
} as const;

export const NAV = [
  { label: "What you get", href: "#programme" },
  { label: "Patients", href: "#patients" },
  { label: "Faculty", href: "#faculty" },
  { label: "Fees & joining", href: "#fees" },
  { label: "Curriculum", href: "#curriculum" },
  { label: "FAQ", href: "#faq" },
] as const;


export const STATS = [
  { n: "16", t: "weeks, start to finish", tone: "blue" },
  { n: "7", t: "disciplines, from psychiatry to counselling", tone: "white" },
  { n: "18", t: "modules, taught in order", tone: "ink" },
  { n: "8", t: "specialist faculty, led by a psychiatrist", tone: "white" },
  { n: "400+", t: "internship hours available, starting at 90", tone: "lime" },
  { n: "5", t: "students per patient group", tone: "blue" },
  { n: "18", t: "therapies, and how to mix them", tone: "ink" },
  { n: "2", t: "live discussions with psychiatrists, every weekend", tone: "blue" },
  { n: "1", t: "certificate, signed by a psychiatrist", tone: "white" },
] as const;

export const PATIENT_STEPS = [
  { title: "Join a group of five", text: "Every in-person student is placed in a group of 5.", heads: ["long", "curly", "beanie", "scarf", "bun"] },
  { title: "2 of you take the patient", text: "Full history, mental status examination, assessment.", heads: ["long", "curly", "patient"] },
  { title: "3 more join the discussion", text: "All 5 talk it through and agree on a treatment plan.", heads: ["long", "curly", "beanie", "scarf", "bun"] },
  { title: "The psychiatrist corrects it", text: "You present the plan. The psychiatrist shows you what to change, and why.", heads: ["doctor", "long", "curly"] },
  { title: "Swap and repeat", text: "The next 2 take the next patient. Everyone gets equal turns.", heads: ["beanie", "scarf", "patient"] },
] satisfies { title: string; text: string; heads: CastName[] }[];

export const PATIENT_FACTS = [
  { k: "Who", v: "In-person students, Ahmedabad" },
  { k: "When", v: "Weekdays, morning or evening batch" },
  { k: "How many cases", v: "Depends on your hours: 90 to 400+" },
  { k: "Supervised by", v: "Dr. Sarthak Dave and the psychiatrists" },
] as const;

export const SCENARIOS = [
  { when: "A patient says they want to die", icon: "alert", tone: "ink", learn: ["Ask about suicide directly and calmly", "Judge how serious the risk is", "Make a safety plan together", "Bring in the psychiatrist the same day"] },
  { when: "A patient has side effects", icon: "pill", tone: "lime", learn: ["Recognise common side effects", "Tell them apart from the illness", "Reassure, and never advise stopping", "Refer to the psychiatrist"] },
  { when: "A patient gets angry or agitated", icon: "bolt", tone: "lime", learn: ["Keep yourself and others safe", "Calm the situation with words", "Know when to call for help"] },
  { when: "The family speaks for the patient", icon: "family", tone: "ink", learn: ["Hear both sides", "Keep the patient at the centre", "Protect what the patient told you in confidence"] },
  { when: "Therapy isn't working", icon: "loop", tone: "ink", learn: ["Go back to your formulation", "Change or combine approaches", "Discuss it with the team"] },
  { when: "A patient asks you for medicines", icon: "shield", tone: "lime", learn: ["Stay within your role", "Explain why, without losing trust", "Refer to the psychiatrist"] },
] satisfies { when: string; icon: IconName; tone: "ink" | "lime"; learn: string[] }[];



export const MODULES = [
  { n: "01", title: "Foundations and the therapy room", text: "Normal versus abnormal · ethics and the Mental Healthcare Act 2017 · what you can and can't do · seating, body language, listening" },
  { n: "02", title: "Psychiatric interview and MSE", text: "Interview structure · full history · complete MSE · insight and judgement · history from the Indian family" },
  { n: "03", title: "Defence mechanisms in practice", text: "Spotting defences and thinking errors in session · what they tell you · using them in the plan" },
  { n: "04", title: "Psychological assessment", text: "Interview, observation and case study · choosing, giving and scoring a test · writing up the result" },
  { n: "05", title: "Depression, anxiety and suicide risk", text: "From first interview to treatment plan · panic, phobias, social anxiety · asking about suicide · safety planning · crisis help" },
  { n: "06", title: "Bipolar disorder, schizophrenia, OCD", text: "Interviewing mania and psychosis · delusions and hallucinations · catatonia · OCD and exposure therapy" },
  { n: "07", title: "Medicines and side effects", text: "Common names, generic and brand · what each group is for · common side effects · side effect or symptom? · red flags · mid-programme test" },
  { n: "08", title: "Clinical reasoning and diagnosis", text: "Using ICD-11 and DSM-5-TR · telling similar disorders apart · biases that mislead clinicians · from symptoms to formulation" },
  { n: "09", title: "Therapies I: cognitive and behavioural", text: "CBT · REBT · exposure therapy · behavioural techniques · how your therapy is scored · hypnotherapy" },
  { n: "10", title: "Therapies II: mixing them", text: "DBT · ACT · person-centred, existential, Gestalt · narrative, transactional analysis · motivational interviewing · mindfulness · combining therapies" },
  { n: "11", title: "Personality disorders", text: "Borderline, narcissistic, antisocial, histrionic · anger and splitting in session · managing your own reactions to a patient" },
  { n: "12", title: "Couples, families, addiction, crisis", text: "Couple and family therapy in Indian families · grief counselling · addiction and de-addiction · calming an agitated patient" },
  { n: "13", title: "Body, culture, memory and dementia", text: "Physical symptoms with a psychological cause · Indian ways of expressing distress · delirium, dementia or depression · counselling the caregiver" },
  { n: "14", title: "Child and developmental psychology", text: "The parent interview · ADHD and parent training · autism, from early signs to referral · learning disability and school support" },
  { n: "15", title: "Trauma, PTSD and eating disorders", text: "PTSD and complex trauma · grounding · stabilise before processing · eating disorders: medical red flags, family-based treatment" },
  { n: "16", title: "Notes, reports and final portfolio", text: "SOAP, DAP and BIRP notes · formulation with the five Ps · referral letters · final project: one patient followed over time" },
  { n: "17", title: "Across the lifespan (throughout)", text: "Medicines in older adults and children · group behaviour and conflict · matching therapy to the patient" },
  { n: "18", title: "Forensic psychology", text: "Fitness to stand trial · involuntary admission under the Mental Healthcare Act 2017 · risk of violence · forensic reports · POCSO cases" },
] as const;

export const INTERVIEW = [
  { title: "Opening the interview", items: ["Seating, distance, privacy", "Consent and confidentiality, explained simply", "Building rapport in the first five minutes"] },
  { title: "History taking", items: ["The complaint, in the patient's own words", "Onset, duration, course, triggers", "Past illness, medicines, family history", "Substance use"] },
  { title: "Personal history", items: ["Birth and childhood milestones", "School, work, marriage, relationships", "Personality before the illness"] },
  { title: "History from the family", items: ["Interviewing family members", "When their story and the patient's differ"] },
  { title: "Difficult interviews", items: ["Mania, psychosis, the suicidal patient", "The angry or silent patient", "Children with parents; elderly patients"] },
  { title: "Presenting the case", items: ["Writing it up in the standard format", "Presenting to the psychiatrist in minutes"] },
] as const;

export const MSE = [
  { title: "Appearance and behaviour", text: "Grooming, clothing, eye contact, attitude" },
  { title: "Psychomotor activity", text: "Restlessness, slowing, tremors, catatonic signs" },
  { title: "Speech", text: "Rate, volume, tone, pressured or poor speech" },
  { title: "Mood and affect", text: "What they say they feel, what you see" },
  { title: "Thought form", text: "Flight of ideas, loose links, thought block" },
  { title: "Thought content", text: "Delusions, obsessions, suicidal ideas" },
  { title: "Perception", text: "Hallucinations, illusions, how to ask" },
  { title: "Cognition", text: "Orientation, attention, memory, reasoning" },
  { title: "Insight", text: "How well they understand their illness" },
  { title: "Judgement", text: "Personal, social and test judgement" },
] as const;

export const CASE_SHEET = {
  learn: { title: "Depression", items: ["Low mood most days", "Loss of interest", "Poor sleep and appetite", "Hopelessness", "Rule out: bipolar, alcohol, thyroid"] },
  rows: [
    { k: "Chief complaints", v: "Low mood × 3 months · poor sleep × 2 months · lost interest in work × 2 months", mark: "Low mood × 3 months" },
    { k: "Present illness", v: "Gradual onset after losing his job. Worse in the mornings. No past episodes of elated mood." },
    { k: "Personal · family", v: "Father treated for depression. Social drinker; alcohol use asked and noted.", mark: "alcohol use asked and noted" },
    { k: "MSE", v: "Affect: depressed, restricted. Thought: hopelessness, no suicidal plan. Insight present.", mark: "depressed, restricted" },
    { k: "Provisional diagnosis", v: "Depressive episode, moderate (ICD-11)", mark: "Depressive episode, moderate" },
    { k: "Ruled out", v: "Bipolar disorder · alcohol-related low mood · thyroid problem" },
    { k: "Plan", v: "Psychiatrist review for medicines · behavioural activation and CBT · follow-up in one week" },
  ],
} as const;

export const MEDICINES = [
  { group: "Antidepressants", names: "Escitalopram, sertraline, fluoxetine", watch: "Nausea, headache, sleep changes, sexual side effects" },
  { group: "Antipsychotics", names: "Olanzapine, risperidone, quetiapine", watch: "Sleepiness, weight gain, stiffness, restlessness" },
  { group: "Mood stabilisers", names: "Lithium, sodium valproate", watch: "Tremor, thirst, weight gain; lithium needs blood tests" },
  { group: "Anti-anxiety", names: "Clonazepam, alprazolam, lorazepam", watch: "Drowsiness, slow reactions, dependence with long use" },
  { group: "Sleep medicines", names: "Zolpidem", watch: "Next-day drowsiness, dizziness" },
  { group: "ADHD medicines", names: "Methylphenidate, atomoxetine", watch: "Less appetite, poor sleep, faster heartbeat" },
] as const;

export const RULE_OUT = [
  { title: "Alcohol and other substances", text: "Alcohol, cannabis and other drugs can cause, hide or worsen anxiety, low mood and poor sleep. You ask about them first, every time.", icon: "alert", fill: "#cdf24b" },
  { title: "Medicines hiding symptoms", text: "A patient on sleeping pills or anti-anxiety medicines may not show the symptoms they describe. You check what they take, and when.", icon: "pill", fill: "#ffffff" },
  { title: "Physical illness", text: "Thyroid problems and other illnesses can look like depression or anxiety. You learn when to ask for a medical check.", icon: "heart", fill: "#cdf24b" },
] satisfies { title: string; text: string; icon: IconName; fill: string }[];

export const SIDE_OR_SYMPTOM = [
  { q: "Restless after a new medicine", a: "Anxiety, or a side effect?" },
  { q: "Weight gain, low energy", a: "Depression, or the medicine?" },
  { q: "Shaking hands", a: "Nerves, or lithium?" },
] as const;

export const RED_FLAGS = "High fever with stiff muscles · a new skin rash · confusion or fainting · new or worse thoughts of suicide";

export const THERAPIES = [
  { name: "CBT", text: "Change the thoughts and habits that keep a problem going.", tone: "blue" },
  { name: "REBT", text: "Find the rigid belief behind the upset and challenge it.", tone: "white" },
  { name: "DBT", text: "Skills for intense emotions and difficult relationships.", tone: "lime" },
  { name: "ACT", text: "Make room for hard feelings; act on what matters.", tone: "white" },
  { name: "Exposure and ERP", text: "Face the fear step by step, without the ritual.", tone: "lime" },
  { name: "Behavioural activation", text: "Plan small actions to lift low mood.", tone: "blue" },
  { name: "Motivational interviewing", text: "Help the person find their own reason to change.", tone: "white" },
  { name: "Person-centred", text: "Empathy and acceptance, so the client leads.", tone: "blue" },
  { name: "Existential", text: "Meaning, choice and loss.", tone: "white" },
  { name: "Gestalt", text: "Awareness of the here and now, and unfinished business.", tone: "lime" },
  { name: "Narrative", text: "Separate the person from the problem; rewrite the story.", tone: "white" },
  { name: "Transactional analysis", text: "Parent, adult and child patterns in how we talk.", tone: "lime" },
  { name: "Hypnotherapy", text: "Focused attention and suggestion, used within limits.", tone: "blue" },
  { name: "Mindfulness", text: "Attention to the present, without judging it.", tone: "white" },
  { name: "Couple and family", text: "Work on the relationship, not one person.", tone: "blue" },
  { name: "Grief counselling", text: "Support through loss, at the person's pace.", tone: "lime" },
  { name: "Trauma-focused work", text: "Stabilise first, process later.", tone: "white" },
  { name: "Positive psychology", text: "Build on strengths, not only problems.", tone: "lime" },
] as const;

export const MIX_EXAMPLE = {
  patient: "A 24-year-old with low mood and panic attacks. She has stopped going to college.",
  plan: [
    { when: "Sessions 1–2", what: [["Motivational interviewing", "she finds her own reason to get better."]] },
    { when: "Sessions 3–6", what: [["Behavioural activation", "small daily plans to restart her routine."], ["CBT", "catching and testing her panic thoughts."]] },
    { when: "Sessions 7–10", what: [["Exposure", "going back to college, one step at a time."]] },
    { when: "Throughout", what: [["Mindfulness and ACT", "handling anxious feelings without fighting them."]] },
    { when: "With the psychiatrist", what: [["Medicines", "reviewed, side effects checked, plan adjusted."]] },
  ],
} as const;

export const DEFENCES = [
  { title: "Spot it", text: "Notice denial, projection or displacement as it happens in session." },
  { title: "Read it", text: "Work out what it protects and what it tells you." },
  { title: "Use it", text: "Adjust your pace, questions and plan." },
] as const;

export const FACULTY_LEAD = {
  initials: "SD",
  role: "Co-Founder & Lead Faculty",
  name: "Dr. Sarthak Dave, MBBS, MD (Psychiatry)",
  text: "Practising psychiatrist, Ahmedabad. Leads the clinical teaching and supervises patient interaction.",
} as const;

export const FACULTY = [
  { initials: "RS", name: "Dr. Ravi Soni", role: "Psychiatrist", tone: "lime" },
  { initials: "MD", name: "Dr. Minoli Doshi", role: "Psychiatrist", tone: "lime" },
  { initials: "TP", name: "Dr. Tejas Patel", role: "Psychiatrist", tone: "lime" },
  { initials: "SS", name: "Dr. Sarandha Srivastava", role: "Psychiatrist", tone: "lime" },
  { initials: "AJ", name: "Dr. Aakriti Jha", role: "Child Psychiatrist", tone: "ink" },
  { initials: "IP", name: "Dr. Ishan Pandya", role: "Psychodermatologist & Hypnotherapist", tone: "ink" },
  { initials: "SS", name: "Shrujal Shah", role: "Mindfulness", tone: "white" },
] as const;

export const LEADERSHIP = [
  { name: "Dr. Vishwa V. Dave", role: "Co-Founder, CEO & CFO" },
  { name: "Kavya Bothra", role: "Chief Operating Officer · point of contact for authorisation" },
] as const;

export const DAY = {
  weekday: {
    tag: "Weekday · in person",
    title: "Patient batch",
    sub: "Morning or evening",
    steps: ["Arrive at the clinic", "See a patient with your group", "Plan the treatment together", "Get the psychiatrist's corrections", "Write the case sheet", "Add it to your case log"],
  },
  weekend: {
    tag: "Weekend · everyone",
    title: "Live discussion",
    sub: "Online or in person, from 8 am",
    steps: ["Join the psychiatrist, live", "One patient, or one disorder, in depth", "“What would you do?”", "The psychiatrist's answer, from years of practice", "Ask as many questions as you want", "Your assignment for the week"],
  },
} as const;

export const WEEK = [
  { d: "Mon", kind: "patient" },
  { d: "Tue", kind: "patient" },
  { d: "Wed", kind: "patient" },
  { d: "Thu", kind: "patient" },
  { d: "Fri", kind: "patient" },
  { d: "Sat", kind: "live", time: "8–10 am" },
  { d: "Sun", kind: "live", time: "8–11 am, some Sundays till 2 pm" },
] as const;


export const CERTIFICATE =
  "Issued and signed by Dr. Sarthak Dave, MBBS, MD (Psychiatry). It lists the clinical skills you showed: interviewing, MSE, assessment, documentation and therapy techniques.";

export const PSYCHOMETRIC = [
  { group: "Screening and risk", tests: ["PHQ-9", "GAD-7", "Y-BOCS", "AUDIT", "CAGE", "SCOFF", "C-SSRS", "PCL-5"] },
  { group: "Memory and thinking", tests: ["MMSE", "MoCA"] },
  { group: "Children", tests: ["Conners", "Vanderbilt", "M-CHAT"] },
  { group: "Personality and intelligence", tests: ["TAT", "Rorschach", "MMPI", "16PF", "NEO", "Wechsler scales"] },
] as const;

export const PSYCHOMETRIC_NOTE = "Which tests are taught, and in how much depth, is decided by a poll in your cohort.";

export const COLLEGES = {
  gets: [
    "Direct patient interaction, supervised",
    "Weekend live discussions with psychiatrists",
    "Psychiatric interview and MSE, in depth",
    "Case sheets corrected by a psychiatrist",
    "Certificate and internship letter",
  ],
  partnering: [
    "Fee set per college, by number of students",
    "Group discounts",
    "Instalments, or EMI if the bank supports it",
    "Internship with the cohort, or on its own",
    "In person in Ahmedabad, or online",
  ],
} as const;

export const FAQ = [
  { q: "How big is the cohort?", a: "Small. We run one cohort at a time, by invitation." },
  { q: "Can I take leave from patient batches?", a: "Up to 2 mental health leaves a month, asked for on WhatsApp the same day. Medical leave by email, with a recent medical certificate." },
  { q: "Can college students do only the internship?", a: "Yes. Clinical internships run with the cohort or on their own." },
  { q: "Why learn medicines if I won't prescribe?", a: "A prescription tells you the likely diagnosis and what to watch for, and lets you work with psychiatrists as part of the team." },
  { q: "Is there a refund policy?", a: "Yes. Read it on the Refund policy page." },
] as const;

/* ======================================================================
   v2 additions: the scroll story, games and interactive sections.
   ====================================================================== */


export const MANIFESTO =
  "Every disorder you learn here ends the same way: with a real treatment plan, a therapy plan, counselling, and a psychiatrist checking your work.";

/** "In most college courses" vs "At VIBHA". Practical, not insulting. */
export const COLLEGE_VS = [
  { college: "Read about depression.", vibha: "Interview a patient with depression." },
  { college: "Memorise the diagnostic criteria.", vibha: "Write the case sheet, the diagnosis and the plan." },
  { college: "Learn the names of therapies.", vibha: "Plan therapy session by session, and mix approaches." },
  { college: "Study side effects in a table.", vibha: "Spot them in a real patient, and know when to call the psychiatrist." },
  { college: "Watch from the back of the room.", vibha: "Take the patient yourself, under supervision." },
  { college: "Get marks for an exam answer.", vibha: "Get a psychiatrist's corrections on your own plan." },
] as const;

export const TICKER = [
  "Treatment plans",
  "Therapy planning",
  "Counselling",
  "Case sheets",
  "Real patients",
  "MSE",
  "Rule-outs",
  "Side effects",
  "Crisis handling",
  "Psychiatric interview",
] as const;

/** One disorder, start to finish — the core promise, as a 9-step journey. */
export const JOURNEY = {
  disorder: "Depression",
  patient: "A 32-year-old man. Low mood for three months, since losing his job.",
  steps: [
    { k: "Interview", title: "Take the history", text: "In his own words. Onset, triggers, sleep, work, family, alcohol.", icon: "chat" },
    { k: "MSE", title: "Examine the mind", text: "Affect depressed and restricted. Hopelessness. No suicidal plan. Insight present.", icon: "eye" },
    { k: "Rule out", title: "Check what else it could be", text: "Bipolar episodes? Alcohol? Thyroid? Medicines hiding symptoms?", icon: "alert" },
    { k: "Diagnosis", title: "Name it, provisionally", text: "Depressive episode, moderate (ICD-11). Written, not guessed.", icon: "clipboard" },
    { k: "Case sheet", title: "Write it up properly", text: "Every finding in its place, in the format psychiatrists read.", icon: "book" },
    { k: "Treatment plan", title: "Plan with the psychiatrist", text: "Medicines reviewed by the psychiatrist. Your role, their role, clearly split.", icon: "pill" },
    { k: "Therapy plan", title: "Plan the sessions", text: "Sessions 1–2 motivational interviewing · 3–6 behavioural activation + CBT · then relapse prevention.", icon: "puzzle" },
    { k: "Counselling", title: "Talk to him, and his family", text: "Explain the illness simply. Involve family without breaking confidence.", icon: "family" },
    { k: "Follow-up", title: "Review and adjust", text: "Side effects checked. Progress measured. Plan changed when it isn't working.", icon: "loop" },
  ],
} satisfies { disorder: string; patient: string; steps: { k: string; title: string; text: string; icon: IconName }[] };

export const JOURNEY_FOOT = "Every disorder in the syllabus is taught this way.";

/**
 * The disorder picker. Each disorder shows what is specific to it: how it
 * walks into the clinic, what you'll practise asking, what the MSE shows,
 * what to rule out, the medicines you'll recognise, the therapy plan and the
 * red flag that means "call the psychiatrist now". Plain words, no doses.
 */
export const DISORDERS = [
  {
    name: "Depression",
    module: "05",
    says: "I feel tired all the time. Nothing feels interesting any more.",
    looks: "Low mood, no interest, poor sleep and appetite. Often first described as body aches or weakness.",
    ask: "“Have you ever felt that life is not worth living?” Asked directly and calmly.",
    mse: "Low, restricted affect · slow speech · hopeless and guilty thoughts",
    ruleOut: "Thyroid problems, anaemia, bipolar disorder, alcohol use",
    meds: "SSRIs such as escitalopram, sertraline, fluoxetine",
    therapy: "Behavioural activation first, then CBT for negative thinking",
    redFlag: "A suicide plan, or sudden calm after a long low",
  },
  {
    name: "Anxiety & panic",
    module: "05",
    says: "My heart races and I can't breathe. I thought I was dying.",
    looks: "Constant worry, racing heart, breathlessness. Many come straight from a normal ECG.",
    ask: "“What were you doing when the first attack came? What did you think was happening?”",
    mse: "Anxious affect · restlessness · catastrophic thoughts",
    ruleOut: "Thyroid, heart rhythm problems, too much caffeine, withdrawal",
    meds: "SSRIs; short-term clonazepam, and why it is kept short",
    therapy: "Explaining the body's alarm, breathing retraining, exposure, CBT",
    redFlag: "Using alcohol or sleeping pills to cope",
  },
  {
    name: "Bipolar disorder",
    module: "06",
    says: "I don't need sleep. I'm starting three businesses this week.",
    looks: "Spells of huge energy, little sleep, big spending, between spells of depression.",
    ask: "“Was there a time you needed very little sleep but felt full of energy?”",
    mse: "High or irritable mood · pressured speech · flight of ideas · grandiosity",
    ruleOut: "A switch caused by antidepressants, steroids, substance use, thyroid",
    meds: "Mood stabilisers: lithium, valproate; atypical antipsychotics",
    therapy: "Mood charting, early warning signs, family psychoeducation",
    redFlag: "No sleep for days, risky behaviour, or a low with suicidal thoughts",
  },
  {
    name: "Schizophrenia",
    module: "06",
    says: "The neighbours are talking about me through the walls.",
    looks: "Voices, fixed false beliefs, withdrawal. Families often try faith healers first.",
    ask: "“Do you hear voices when no one is around? What do they say?”",
    mse: "Delusions · hallucinations · muddled thinking · flat affect · poor insight",
    ruleOut: "Drug-induced psychosis, delirium, epilepsy, mood disorder with psychosis",
    meds: "Antipsychotics: risperidone, olanzapine, aripiprazole; long-acting injections",
    therapy: "Family psychoeducation, sticking with treatment, social skills, CBT for psychosis",
    redFlag: "Voices ordering harm, or stopping medicines suddenly",
  },
  {
    name: "OCD",
    module: "06",
    says: "I know it's silly, but I have to wash until it feels right.",
    looks: "Washing, checking or counting to quieten unwanted thoughts. Often hidden for years.",
    ask: "“Do some thoughts keep coming back that you don't want? What do you do to stop them?”",
    mse: "Obsessions they know are their own · rituals · anxiety · usually good insight",
    ruleOut: "Psychosis, obsessive personality, tics, depression",
    meds: "SSRIs, often at higher doses (fluoxetine, fluvoxamine); clomipramine",
    therapy: "Exposure and response prevention (ERP)",
    redFlag: "Rituals taking hours a day, or depression with suicidal thoughts",
  },
  {
    name: "Personality disorders",
    module: "11",
    says: "Everyone leaves me in the end. So I leave first.",
    looks: "Lifelong patterns: stormy relationships, anger, self-harm. Not one bad episode.",
    ask: "“How do your relationships usually go? What happens when someone lets you down?”",
    mse: "Mood can shift fast in the session. Judge the pattern from the history, not one visit",
    ruleOut: "Bipolar disorder, substance use, trauma, ADHD",
    meds: "No medicine treats the disorder itself. Medicines target symptoms and other illness",
    therapy: "DBT skills, clear boundaries, managing your own reactions to the patient",
    redFlag: "Self-harm, threats, or the team being split against each other",
  },
  {
    name: "Addiction",
    module: "12",
    says: "I can stop whenever I want. I only drink at night.",
    looks: "Alcohol, tobacco, cannabis or pills. Usually brought in by family after a crisis.",
    ask: "“When was your last drink? How much? What happens when you stop?”",
    mse: "Signs of intoxication or withdrawal · denial · playing it down",
    ruleOut: "Withdrawal delirium, head injury, liver disease, depression underneath",
    meds: "Detox: chlordiazepoxide or lorazepam with thiamine. Later: naltrexone, acamprosate, disulfiram",
    therapy: "Motivational interviewing, relapse prevention, involving the family",
    redFlag: "Shaking, confusion or fits during withdrawal",
  },
  {
    name: "ADHD & autism",
    module: "14",
    says: "(Parent) The school calls every week. He just can't sit still.",
    looks: "A restless child sent by school, or a child who avoids eye contact and talks late.",
    ask: "To the parent: “When did you first notice? Is it the same at home and at school?”",
    mse: "Watch play, attention, eye contact, language and how the child relates to you",
    ruleOut: "Hearing or vision problems, learning disability, anxiety, stress at home",
    meds: "ADHD: methylphenidate, atomoxetine. Autism: none for the core signs; some for irritability",
    therapy: "Parent training, behaviour plans, school support, early-intervention referral",
    redFlag: "A child losing skills they already had",
  },
  {
    name: "PTSD & trauma",
    module: "15",
    says: "I see the accident again every night. I don't take that road any more.",
    looks: "Nightmares, flashbacks, jumpiness and avoidance after an accident, assault or loss.",
    ask: "Safety first. Don't push for details in the first session.",
    mse: "On guard · easily startled · numb · intrusive memories",
    ruleOut: "Head injury, depression, substance use, acute stress (under a month)",
    meds: "SSRIs such as sertraline; prazosin for nightmares in some cases",
    therapy: "Stabilise and ground first, then trauma-focused CBT",
    redFlag: "Ongoing danger or abuse. A child's abuse must be reported under POCSO",
  },
  {
    name: "Eating disorders",
    module: "15",
    says: "I'm not thin. I just need to lose a little more.",
    looks: "Weight loss, fear of gaining weight, or binge-and-purge cycles. Parents often notice first.",
    ask: "“How do you feel about your body? What do you eat on a usual day?”",
    mse: "Preoccupied with weight and shape · low mood · denies how serious it is",
    ruleOut: "Thyroid, diabetes, gut problems, depression",
    meds: "No medicine fixes it. Fluoxetine helps bulimia and depression alongside",
    therapy: "Family-based treatment, CBT for eating disorders, meal plans with a dietician",
    redFlag: "Fainting, very low weight or an irregular heartbeat. Medical care comes first",
  },
  {
    name: "Dementia & delirium",
    module: "13",
    says: "(Daughter) Papa was fine last week. Now he doesn't know where he is.",
    looks: "Slow forgetting over months (dementia), or sudden confusion over days (delirium).",
    ask: "To the family: “Did it start suddenly or slowly? Is it worse at night?”",
    mse: "Disoriented · poor attention · memory loss · screened with MMSE or MoCA",
    ruleOut: "Infection, low sodium, medicines, depression, B12 or thyroid problems",
    meds: "Dementia: donepezil, memantine. Delirium: treat the cause first",
    therapy: "Caregiver counselling, routine, memory aids, a safe home",
    redFlag: "Sudden confusion is delirium until proven otherwise. It's a medical emergency",
  },
] as const;

export const DISORDER_FIELDS = [
  { key: "looks", label: "In clinic" },
  { key: "ask", label: "You'll ask" },
  { key: "mse", label: "MSE shows" },
  { key: "ruleOut", label: "Rule out first" },
  { key: "meds", label: "Medicines you'll know" },
  { key: "therapy", label: "Therapy plan" },
] as const;

export const DISORDER_FOOT = "Plus, for every one: the case sheet, the treatment plan, and counselling the family.";

/** Mini game 3 — memory match. A sign you'll write in the MSE, and what it
 *  looks like in the room. Six pairs are dealt at random each game. */
export const MEMORY_PAIRS = [
  { term: "Flight of ideas", meaning: "Leaps from topic to topic. The links just about hold." },
  { term: "Pressured speech", meaning: "Fast, loud and very hard to interrupt." },
  { term: "Delusion", meaning: "A fixed false belief that no evidence can shake." },
  { term: "Hallucination", meaning: "Hears or sees something no one else does." },
  { term: "Blunted affect", meaning: "Face and voice barely change, whatever the topic." },
  { term: "Thought block", meaning: "Stops mid-sentence. The thought just vanishes." },
  { term: "Psychomotor slowing", meaning: "Moves, speaks and answers very slowly." },
  { term: "Poor insight", meaning: "Doesn't believe anything is wrong." },
  { term: "Obsession", meaning: "An unwanted thought that keeps coming back." },
  { term: "Compulsion", meaning: "A ritual repeated to make the anxiety go away." },
  { term: "Disorientation", meaning: "Unsure of the date, the place or who people are." },
  { term: "Catatonia", meaning: "Frozen in one posture, barely responds." },
] as const;

/** Mini game 1 — clinical judgement. Answers grounded in the brochure. */
export const CLINIC_CALL = [
  {
    q: "New patient. Low mood, poor sleep. Says he drinks “only a little” every night.",
    options: ["Start CBT for depression", "Ask about the alcohol in detail first", "Diagnose depression"],
    a: 1,
    why: "Alcohol can cause or worsen low mood and poor sleep. You rule it out before you conclude.",
  },
  {
    q: "A patient on lithium says her hands have started shaking.",
    options: ["It's just anxiety", "Tell her to stop the medicine", "It may be lithium. Tell the psychiatrist."],
    a: 2,
    why: "Tremor is a common lithium side effect. You never advise stopping. You refer to the psychiatrist.",
  },
  {
    q: "Mid-session, a patient quietly says: “I don't want to live.”",
    options: ["Change the topic gently", "Ask about suicide directly and calmly", "Wait for the next session"],
    a: 1,
    why: "Asking directly does not put the idea in their head. You judge the risk, make a safety plan, and bring in the psychiatrist the same day.",
  },
  {
    q: "A 74-year-old has been suddenly confused for three days.",
    options: ["It's dementia", "Ask for a medical check: it may be delirium", "Start memory exercises"],
    a: 1,
    why: "Sudden confusion can be delirium, often from an infection. It is a medical emergency until ruled out.",
  },
  {
    q: "A patient asks you for “something to help me sleep”.",
    options: ["Suggest a common sleeping pill", "Stay in your role and refer to the psychiatrist", "Say no and move on"],
    a: 1,
    why: "You don't prescribe. You explain why, without losing trust, and refer.",
  },
  {
    q: "Two weeks on a new medicine, a patient feels very restless and can't sit still.",
    options: ["Anxiety is getting worse", "It could be a side effect. Report it.", "Increase therapy sessions"],
    a: 1,
    why: "Restlessness can be a side effect of some medicines. Side effect or symptom? You learn to ask, and to report it.",
  },
] as const;

/** Mini game 2 — spot the defence mechanism. */
export const DEFENCE_GAME = [
  { quote: "I don't have a drinking problem. I can stop whenever I want.", options: ["Denial", "Projection", "Displacement", "Rationalisation"], a: 0 },
  { quote: "I'm not angry. You're the one who's always angry with me.", options: ["Denial", "Projection", "Displacement", "Rationalisation"], a: 1 },
  { quote: "My boss shouted at me, so I came home and yelled at my kids.", options: ["Denial", "Projection", "Displacement", "Rationalisation"], a: 2 },
  { quote: "I didn't get the job, but I never really wanted it anyway.", options: ["Denial", "Projection", "Displacement", "Rationalisation"], a: 3 },
] as const;

/** Therapy mixer — pick a patient, see a session-by-session plan (examples). */
export const MIXER = [
  {
    who: "Low mood + panic, stopped college",
    age: "24, student",
    plan: [
      { when: "Sessions 1–2", what: "Motivational interviewing", tone: "lime" },
      { when: "Sessions 3–6", what: "Behavioural activation + CBT", tone: "blue" },
      { when: "Sessions 7–10", what: "Exposure: back to college, step by step", tone: "ink" },
      { when: "Throughout", what: "Mindfulness + ACT", tone: "white" },
    ],
  },
  {
    who: "Checking rituals for hours every day",
    age: "29, engineer",
    plan: [
      { when: "Sessions 1–2", what: "Psychoeducation: the OCD cycle", tone: "white" },
      { when: "Sessions 3–10", what: "Exposure and response prevention", tone: "blue" },
      { when: "Alongside", what: "ACT: making room for the anxious thoughts", tone: "lime" },
      { when: "With family", what: "Stop joining in the rituals", tone: "ink" },
    ],
  },
  {
    who: "Intense emotions, unstable relationships",
    age: "21, college student",
    plan: [
      { when: "First", what: "Safety and a crisis plan", tone: "ink" },
      { when: "Weekly", what: "DBT skills: distress tolerance, emotion regulation", tone: "blue" },
      { when: "Alongside", what: "Person-centred work: a steady relationship", tone: "white" },
      { when: "Later", what: "Narrative work: a new story about herself", tone: "lime" },
    ],
  },
] as const;

export const MIXER_NOTE = "Examples only. In the programme you build plans like these for real patients, and a psychiatrist checks them.";

export const WHO_FOR = [
  { title: "Psychology students", text: "BA, MA, MSc. Get the clinical practice your syllabus leaves out.", who: "long" },
  { title: "Graduates", text: "Finished your degree but never sat with a patient? Start here.", who: "curly" },
  { title: "Working professionals", text: "From any field. No psychology background needed.", who: "beanie" },
  { title: "Doctors and counsellors", text: "Add therapy planning and counselling to what you already know.", who: "doctor3" },
] satisfies { title: string; text: string; who: CastName }[];

export const BEYOND = [
  { title: "Recordings for 3 months", text: "Every live discussion, on the VIBHA student platform.", icon: "eye" },
  { title: "Discord community", text: "Your cohort and the team: questions, resources, future discussions.", icon: "chat" },
  { title: "Internship letter", text: "Based on your conduct through the programme.", icon: "clipboard" },
  { title: "Starting your practice", text: "Fees, records, referral networks, ethical promotion, avoiding burnout.", icon: "clinic" },
  { title: "Future discussions", text: "Invites to VIBHA discussions after your cohort ends.", icon: "heart" },
  { title: "Hours that count", text: "Weekend live discussions count toward your internship hours.", icon: "shield" },
] satisfies { title: string; text: string; icon: IconName }[];

export const WEEKS_TIMELINE = [
  { w: "Weeks 1–2", t: "Foundations, the therapy room, the psychiatric interview and MSE" },
  { w: "Weeks 3–4", t: "Defence mechanisms in practice, psychological assessment" },
  { w: "Weeks 5–6", t: "Depression, anxiety, suicide risk · bipolar, schizophrenia, OCD" },
  { w: "Weeks 7–8", t: "Medicines and side effects · clinical reasoning and diagnosis" },
  { w: "Weeks 9–10", t: "Therapies I and II: how each works, then mixing them" },
  { w: "Weeks 11–12", t: "Personality disorders · couples, families, addiction, crisis" },
  { w: "Weeks 13–14", t: "Body, culture, memory and dementia · children and development" },
  { w: "Weeks 15–16", t: "Trauma and eating disorders · notes, reports, final portfolio" },
] as const;

/* ======================================================================
   v3 — student-first flow: quick answers, fees & joining.
   ====================================================================== */

/** The five things a student checks first, answered in the hero. */
export const QUICK_ANSWERS = [
  { q: "Real patients?", a: "Yes. In person, you interview them yourself, supervised.", href: "#patients" },
  { q: "Need a psychology degree?", a: "No. Students, graduates and professionals can join.", href: "#fees" },
  { q: "Online or in person?", a: "Both. Patient work is in Ahmedabad.", href: "#week" },
  { q: "Who teaches?", a: "Psychiatrists and specialists, led by Dr. Sarthak Dave.", href: "#faculty" },
  { q: "What does it cost?", a: "Depends on your college and group size. Instalments and EMI available.", href: "#fees" },
] as const;

export const STICKERS = [
  "Real patients",
  "Psychiatric interview",
  "MSE in depth",
  "Treatment plans",
  "Therapy planning",
  "Counselling",
  "Crisis handling",
  "Certificate",
] as const;

export const INCLUDED = [
  "Supervised patient interaction (in person)",
  "Weekend live discussions with psychiatrists",
  "Psychiatric interview and MSE, in depth",
  "Case sheets corrected by a psychiatrist",
  "Treatment and therapy planning for every disorder",
  "Common medicines and their side effects",
] as const;

export const FEES = {
  dependsOn: ["Your university", "Our collaboration with it", "How many students join together"],
  pay: ["Instalments", "EMI, if your bank supports it", "Group discounts"],
  note: "You get your exact fee on the call.",
} as const;

export const JOIN_STEPS = [
  { title: "Reach out", text: "Request an invitation online, or call or WhatsApp +91 78770 49920." },
  { title: "Talk to Kavya", text: "He answers your questions and tells you your exact fee." },
  { title: "Confirm your seat", text: "Choose online or in person and your internship hours, then pay." },
] as const;

export const DISCIPLINES = [
  { name: "Clinical psychology", text: "Disorders · interview · MSE · diagnosis · formulation · treatment plans · forensic work" },
  { name: "Psychotherapies", text: "18 therapies, how each works, and how to mix them for one patient" },
  { name: "Psychopharmacology", text: "Common medicine names · side effects · side effect or symptom? · red flags · when to refer" },
  { name: "Child psychology", text: "Development · assessing children · ADHD, autism, learning difficulties · working with parents" },
  { name: "Neuropsychology", text: "Brain and behaviour · attention and memory · dementia and delirium · reading a report" },
  { name: "Hypnotherapy", text: "Induction · trance states · suggestibility · where it helps, and where it doesn't" },
  { name: "Counselling", text: "Listening · silence · boundaries · risk · closing a session well" },
  { name: "Professional practice", text: "Setting fees · records · referral networks · ethical promotion · avoiding burnout", extra: true },
] as const;

export const ASSESSMENT = [
  { title: "Every week", text: "Assignments · reflective portfolio · case logs from your patient sessions · written feedback" },
  { title: "Timed write-ups", text: "Case formulations against the clock, returned with the faculty's reasoning beside yours" },
  { title: "Final exam", text: "Written exam, the same online and offline, plus your portfolio" },
  { title: "If you fall short", text: "Targeted feedback, extra practice and a re-sit. Nobody is dropped." },
] as const;
