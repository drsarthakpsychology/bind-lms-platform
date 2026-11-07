import { match, mcq, order, sort, tf, type Unit } from "../types";

export const DEFENCES: Unit = {
  id: "defences",
  title: "Defences & personality",
  tagline: "How minds protect themselves, and patterns that persist",
  icon: "puzzle",
  tone: "lime",
  lessons: [
    {
      id: "df-1",
      title: "Defence mechanisms",
      goal: "Name the defence from one sentence",
      items: [
        mcq("df1", "\"I don't have a drinking problem.\" Said by someone who drinks daily and lost their job over it:", ["Projection", "Denial", "Sublimation", "Displacement"], 1,
          "Refusing to accept a painful reality: denial.",
          "Denial: refusal to acknowledge external reality; common in substance use and early in serious illness."),
        match("df2", "Match the defence", [
          ["Projection", "Blames others for feelings they themselves have"],
          ["Displacement", "Shouted at by boss, yells at their child"],
          ["Rationalisation", "Gives good-sounding reasons for a bad choice"],
          ["Reaction formation", "Acts very kind to someone they resent"],
        ], "Each defence handles an uncomfortable feeling in its own way.",
          "Neurotic/immature defences per Vaillant's hierarchy; noticing them helps formulation and the therapeutic relationship."),
        sort("df3", "Mature or immature defence?", ["Mature", "Immature"], [
          ["Humour", 0], ["Splitting", 1], ["Sublimation", 0], ["Acting out", 1], ["Suppression", 0], ["Projection", 1],
        ], "Mature defences help you cope without hurting yourself or others.",
          "Mature: sublimation, suppression, humour, altruism, anticipation. Immature: projection, splitting, acting out, passive aggression; splitting is prominent in borderline personality organisation."),
        tf("df4", "Suppression is conscious; repression is unconscious.", true,
          "Suppression = choosing to put it aside. Repression = it's pushed out without awareness.",
          "Suppression is a mature, conscious postponement of attention; repression is an unconscious exclusion of unacceptable impulses or memories."),
        mcq("df5", "A patient sees their therapist as perfect one week and useless the next:", ["Splitting", "Sublimation", "Intellectualisation", "Undoing"], 0,
          "All good or all bad, nothing in between.",
          "Splitting: inability to integrate positive and negative aspects of self/others; common in borderline personality disorder and a frequent driver of therapy ruptures."),
      ],
    },
    {
      id: "df-2",
      title: "Personality disorders",
      goal: "Clusters and key features",
      items: [
        sort("pd1", "Cluster A (odd) or Cluster B (dramatic)?", ["Cluster A", "Cluster B"], [
          ["Paranoid", 0], ["Borderline", 1], ["Schizoid", 0], ["Antisocial", 1], ["Schizotypal", 0], ["Narcissistic", 1],
        ], "A = odd/eccentric. B = dramatic/emotional. C = anxious/fearful.",
          "Cluster C: avoidant, dependent, obsessive-compulsive personality disorder. ICD-11 instead rates severity plus trait domains."),
        mcq("pd2", "Intense unstable relationships, fear of abandonment, self-harm and emptiness suggest:", ["Avoidant PD", "Borderline PD", "Schizoid PD", "OCPD"], 1,
          "Borderline: unstable emotions, relationships and sense of self.",
          "BPD: pervasive instability of relationships, self-image and affect with marked impulsivity (at least 5 of 9 criteria). DBT and mentalisation-based therapy have the best evidence."),
        tf("pd3", "Antisocial personality disorder can only be diagnosed at 18 or older, with signs of conduct disorder before 15.", true,
          "Adults only, with a history going back to the teens.",
          "ASPD requires age at least 18 and evidence of conduct disorder with onset before age 15."),
        mcq("pd4", "OCPD vs OCD: which is true of OCPD?", ["Unwanted intrusive thoughts", "Perfectionism the person sees as right and reasonable", "Always has compulsions", "Always needs medication"], 1,
          "In OCPD the rigid style feels 'right' to the person.",
          "OCPD traits are ego-syntonic (preoccupation with order, perfectionism, control) without true obsessions/compulsions; OCD symptoms are ego-dystonic."),
      ],
    },
  ],
};

export const LIFESPAN: Unit = {
  id: "lifespan",
  title: "Children, ageing & substances",
  tagline: "ADHD, autism, dementia, delirium and alcohol",
  icon: "family",
  tone: "ink",
  lessons: [
    {
      id: "ls-1",
      title: "Childhood",
      goal: "ADHD and autism basics",
      items: [
        mcq("ls1", "For an ADHD diagnosis, several symptoms must have been present before age:", ["5", "12", "16", "18"], 1,
          "Before 12, and in more than one setting (home and school).",
          "ADHD: at least 6 symptoms (at least 5 if aged 17+) of inattention and/or hyperactivity-impulsivity for at least 6 months, several present before 12, in at least 2 settings, with functional impairment."),
        tf("ls2", "Autism involves both social communication difficulties and restricted, repetitive behaviours or interests.", true,
          "Both groups are needed.",
          "ASD: persistent deficits in social communication/interaction plus restricted, repetitive patterns (including sensory sensitivities), present from the early developmental period."),
        mcq("ls3", "A child's attention problems happen only at school after a parental separation. What should you consider first?", ["ADHD, definitely", "Stress, anxiety or adjustment reaction", "Autism", "Nothing"], 1,
          "Look at what changed. Stress can look like ADHD.",
          "Differential for inattention: anxiety, depression, trauma, learning disorders, sleep problems, hearing/vision deficits, and situation-specific stressors."),
      ],
    },
    {
      id: "ls-2",
      title: "Delirium & dementia",
      goal: "Tell them apart at the bedside",
      items: [
        sort("ls4", "Delirium or dementia?", ["Delirium", "Dementia"], [
          ["Starts over hours to days", 0], ["Slow decline over years", 1], ["Attention fluctuates through the day", 0], ["Alert, with memory loss", 1], ["Often caused by infection or medicines", 0],
        ], "Delirium: sudden and fluctuating. Dementia: slow and steady.",
          "Delirium is acute, fluctuating, with inattention and altered awareness, and usually has a medical cause; dementia patients are at higher risk of delirium."),
        mcq("ls5", "First step when an elderly patient becomes suddenly confused:", ["Start an antipsychotic", "Look for the medical cause (infection, drugs, low sodium)", "Diagnose dementia", "Send them home"], 1,
          "Find and treat the cause.",
          "Delirium management: identify and treat precipitants (infection, metabolic, drugs, retention, pain), reorientation, sleep, family presence; antipsychotics only for severe distress or risk."),
        match("ls6", "Match the dementia to its clue", [
          ["Alzheimer's disease", "Gradual memory loss first"],
          ["Vascular dementia", "Step-wise decline after strokes"],
          ["Lewy body dementia", "Visual hallucinations and parkinsonism"],
          ["Frontotemporal dementia", "Early personality and behaviour change"],
        ], "Each type has a typical starting picture.",
          "Lewy body dementia: fluctuating cognition, visual hallucinations, parkinsonism, REM sleep behaviour disorder and severe antipsychotic sensitivity."),
      ],
    },
    {
      id: "ls-3",
      title: "Alcohol & substances",
      goal: "Withdrawal timelines and emergencies",
      items: [
        order("ls7", "Alcohol withdrawal: order by when they typically start", ["Tremor, sweating, anxiety (6 to 24 h)", "Withdrawal seizures (12 to 48 h)", "Delirium tremens (48 to 96 h)"],
          "Shakes first, then possible fits, then DTs.",
          "Uncomplicated withdrawal begins within 6 to 24 h; seizures peak 12 to 48 h; delirium tremens 48 to 96 h with high mortality if untreated. Benzodiazepines are first-line."),
        mcq("ls8", "Confusion, unsteady walking and abnormal eye movements in a heavy drinker:", ["Wernicke's encephalopathy", "Normal intoxication", "Panic attack", "Schizophrenia"], 0,
          "Wernicke's. Needs thiamine urgently.",
          "Wernicke's: confusion, ataxia, ophthalmoplegia/nystagmus (full triad often absent). Give parenteral thiamine before glucose; untreated may progress to Korsakoff syndrome."),
        mcq("ls9", "Pinpoint pupils, very slow breathing and drowsiness suggest overdose of:", ["Stimulants", "Opioids", "Cannabis", "SSRIs"], 1,
          "Opioids. Naloxone can reverse it.",
          "Opioid toxidrome: miosis, respiratory depression, reduced consciousness; give naloxone and support airway/breathing."),
        tf("ls10", "The CAGE questions (Cut down, Annoyed, Guilty, Eye-opener) are a quick screen for alcohol problems.", true,
          "Two or more 'yes' answers suggest a problem worth exploring.",
          "CAGE at least 2 is clinically significant; AUDIT/AUDIT-C give a more graded assessment of hazardous drinking."),
      ],
    },
  ],
};

export const RISK_LAW: Unit = {
  id: "risk",
  title: "Risk, ethics & the law",
  tagline: "Suicide risk and India's Mental Healthcare Act",
  icon: "alert",
  tone: "blue",
  lessons: [
    {
      id: "rk-1",
      title: "Suicide risk",
      goal: "Ask, assess, plan",
      items: [
        sort("rk1", "Raises risk or protects?", ["Raises risk", "Protective"], [
          ["Previous suicide attempt", 0], ["Strong family support", 1], ["Access to pesticides or pills", 0], ["Reasons for living, plans for the future", 1], ["Recent loss and hopelessness", 0], ["Engaged in treatment", 1],
        ], "Past attempts, hopelessness and means raise risk. Connection and hope protect.",
          "Past attempt is the strongest predictor. In India, means restriction (pesticides) matters. Risk scales alone predict poorly; use a formulation-based approach with a safety plan."),
        order("rk2", "Safety plan steps, in order", ["Recognise my warning signs", "Things I can do to calm myself", "People and places that distract me", "People I can ask for help", "Professionals and helplines (Tele-MANAS 14416)", "Making my surroundings safe"],
          "From what I can do alone, to who I can call.",
          "Stanley-Brown Safety Planning Intervention: warning signs, internal coping, social distraction, help from others, professional contacts, means restriction."),
        tf("rk3", "If a patient discloses a plan to kill themselves soon, confidentiality can be broken to keep them safe.", true,
          "Safety comes before confidentiality.",
          "Confidentiality has limits where there is serious risk to the patient or others; share the minimum necessary, ideally with the patient's knowledge."),
      ],
    },
    {
      id: "rk-2",
      title: "Mental Healthcare Act 2017",
      goal: "The rights every clinician in India must know",
      items: [
        mcq("rk4", "Under the MHCA 2017, a person who attempts suicide is:", ["Automatically sent to prison", "Presumed to have severe stress and must get care, not punishment", "Fined", "Ignored"], 1,
          "The law now treats it as distress needing care.",
          "Section 115: a person attempting suicide is presumed (unless proved otherwise) to have severe stress and shall not be tried and punished; the government must provide care and rehabilitation."),
        match("rk5", "Match the MHCA right to its meaning", [
          ["Advance directive", "Saying in advance how I want to be treated"],
          ["Nominated representative", "Someone I choose to support my decisions"],
          ["Right to confidentiality", "My health information is protected"],
          ["Right to access care", "Affordable services from the government"],
        ], "The Act puts the person's choices at the centre.",
          "MHCA 2017 is rights-based: access to mental healthcare, community living, protection from cruel treatment, confidentiality, advance directives and nominated representatives; aligned with UNCRPD."),
        tf("rk6", "The MHCA 2017 bans ECT without anaesthesia and muscle relaxants.", true,
          "'Unmodified' ECT is not allowed.",
          "Section 95 prohibits ECT without muscle relaxants and anaesthesia, sterilisation as a treatment for mental illness, and chaining."),
        mcq("rk7", "An adult who can make decisions and wants admission for treatment is admitted as a:", ["Supported admission", "Independent admission", "Police admission", "Emergency only"], 1,
          "They choose it themselves: independent admission.",
          "Independent admission (Section 86) for persons with capacity; supported admission (Section 89, up to 30 days; Section 90 beyond) when criteria for high support needs are met."),
      ],
    },
  ],
};
