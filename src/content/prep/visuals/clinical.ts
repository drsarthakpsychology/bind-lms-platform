import { R, bm, cmp, concept, cycle, tl, xp, type Concept } from "./kit";

/** Psychopathology, clinical psychiatry, therapies and counselling: the brain in each disorder, real tasks and true sequences. */

const PP = ["psychopathology", "clinical-psychiatry"] as const;
const TH = ["clinical-therapies", "counselling", "psychopathology", "clinical-psychiatry", "health"] as const;

export const CLINICAL: Concept[] = [
  /* ------------------------------------------------ the brain in disorders */
  concept("cl-ocd-brain", R([...PP, "biological", "clinical-therapies"], /(ocd|obsessive.compulsive).{0,100}(circuit|brain|striat|caudate|orbitofrontal|neurobiolog|serotonin|neurosurg|capsulotomy|deep brain|imaging)|cortico.striat|\bcstc\b|pandas|sydenham/i), "brainmap", bm("The OCD circuit", {
    prefrontal: "Orbitofrontal cortex: overactive in OCD on scans, signalling that something is wrong or unfinished; activity falls with successful SSRI treatment or exposure therapy.",
    frontal: "Anterior cingulate cortex: error and conflict detection, also overactive.",
    "basal-ganglia": "Caudate nucleus (striatum): should filter and close the 'worry loop'; in OCD the loop keeps running. PANDAS-type OCD after streptococcal infection is thought to target the basal ganglia.",
    thalamus: "Thalamus: completes the cortex, striatum, thalamus and back to cortex loop. Severe resistant OCD is sometimes treated by neurosurgery or deep brain stimulation on this circuit.",
  })),
  concept("cl-ptsd-brain", R([...PP, "biological", "clinical-therapies"], /(ptsd|post.traumatic|trauma).{0,100}(brain|amygdala|hippocamp|prefrontal|neurobiolog|cortisol|extinction|imaging)|fear extinction|hippocampal volume/i), "brainmap", bm("The brain after trauma", {
    amygdala: "Amygdala: overactive, so reminders trigger alarm and hyperarousal.",
    prefrontal: "Ventromedial prefrontal cortex: underactive, so it fails to calm the amygdala and extinction of fear is weak.",
    hippocampus: "Hippocampus: often smaller in PTSD (partly a pre-existing risk factor, twin studies suggest); it fails to tie the memory to its time and place, so it returns as if happening now.",
  }, "Exposure-based therapies work partly by strengthening prefrontal control over the amygdala.")),
  concept("cl-dementia", R([...PP, "cognitive", "psychometrics-assessment", "psychopharmacology"], /alzheimer|frontotemporal|\bftd\b|bvftd|lewy body|vascular dementia|semantic dementia|primary progressive aphasia|pick'?s disease|creutzfeldt|\bcjd\b|prion|posterior cortical atrophy|mild cognitive impairment|\bmci\b|neurofibrillary|amyloid plaque|\btau\b/i, undefined, /lecanemab|donanemab|aducanumab|\baria\b|anti.amyloid|monoclonal|donepezil|rivastigmine|galantamine|memantine|antipsychotic|risperidone|aggression|agitation/i), "brainmap", bm("Where each dementia starts", {
    hippocampus: "Alzheimer's disease starts in the entorhinal cortex and hippocampus (tau tangles), so new memories fail first; amyloid plaques spread widely.",
    parietal: "Alzheimer's then spreads to the temporal and parietal lobes: word finding, getting lost, apraxia. Posterior cortical atrophy is an Alzheimer's variant that hits vision first.",
    prefrontal: "Behavioural variant frontotemporal dementia: frontal lobes first, so disinhibition, apathy, loss of empathy and food changes come before memory loss, often before 65.",
    temporal: "Semantic dementia (temporal pole, usually left): loss of word meaning and knowledge with fluent speech.",
    broca: "Non-fluent progressive aphasia (left frontal and insula): effortful, ungrammatical speech.",
    occipital: "Dementia with Lewy bodies: visual hallucinations, fluctuating attention, parkinsonism and REM sleep behaviour disorder; severe sensitivity to antipsychotics.",
    "basal-ganglia": "Vascular dementia: small-vessel damage in deep white matter and basal ganglia gives slowing and stepwise decline.",
  }, "Tap each area: the first symptoms tell you where the disease began.")),
  concept("cl-delirium", R(PP, /delirium|acute confusional|sundowning|\bcam\b|\b4at\b|clouding of consciousness|fluctuat.{0,20}(attention|consciousness)/i, undefined, /tremens|alcohol withdrawal/i), "compare", cmp("Delirium or dementia?", [
    "Delirium",
    ["Starts suddenly, over hours to days", "Inattention is the core sign", "Level of consciousness changes and fluctuates through the day, worse at night", "Usually a medical cause (infection, drugs, dehydration, low sodium); often reversible", "EEG: diffuse slowing"],
    "A medical emergency: find the cause.",
  ], [
    "Dementia",
    ["Starts slowly, over months to years", "Memory and other abilities decline; attention is kept until later", "Consciousness is clear and steady", "Usually progressive", "People with dementia are at high risk of delirium on top"],
    "A slow illness: assess and plan.",
  ], "Slide between them. Sudden onset and inattention point to delirium.")),
  concept("cl-schizo-scan", R([...PP, "biological"], /^(?=[\s\S]*schizophren)(?=[\s\S]*(ventric|grey matter|\bmri\b|\bct\b|imaging|brain volume))/i), "brainslicer", { title: "What scans show in schizophrenia", start: "slice", caption: "Scroll the coronal slices and find the lateral ventricles and the hippocampus. On average, people with schizophrenia have larger lateral and third ventricles and slightly less grey matter, especially in the frontal and temporal lobes and hippocampus. These are group differences, present early, and no scan can diagnose an individual." }),
  concept("cl-panic", R([...PP, "clinical-therapies", "health"], /panic (attack|disorder)|palpitation|hyperventilat|catastrophic misinterpretation|interoceptive|clark'?s (cognitive )?model|agoraphobi|carbon dioxide (challenge|sensitivity)|lactate/i), "nervoussystem", { title: "A panic attack in the body", start: "auto", caption: "Switch to fight or flight: heart pounding, faster breathing, dizziness. In Clark's cognitive model these normal body sensations are misread as a catastrophe ('I am having a heart attack'), which raises fear, which raises the sensations further: a vicious circle. Treatment brings on the sensations on purpose (interoceptive exposure) to test the belief." }),
  concept("cl-psychosis-duration", R(PP, /brief psychotic|schizophreniform|duration.{0,40}(schizophreni|psychos)|(six|6) months.{0,60}schizophren|schizophren.{0,60}(six|6) months|acute and transient|\batpd\b|one month.{0,40}(psychos|schizophren)/i), "timeline", tl("Psychosis: which diagnosis fits each duration (DSM-5-TR)?", [
    ["Brief psychotic disorder", "At least 1 day but under 1 month, then full return"],
    ["Schizophreniform disorder", "1 month to under 6 months"],
    ["Schizophrenia", "At least 6 months, including at least 1 month of active symptoms"],
  ], "ICD-11 is different: schizophrenia needs symptoms for at least 1 month, and acute and transient psychotic disorder usually resolves within 3 months.")),
  concept("cl-trauma-duration", R([...PP, "counselling"], /acute stress disorder|adjustment disorder|ptsd.{0,60}(month|duration|criteria|onset)|delayed (expression|onset)|prolonged grief|(within|after) (3|three) months of (the )?stressor/i), "timeline", tl("After a stressor: which diagnosis fits each timing (DSM-5-TR)?", [
    ["Acute stress disorder", "3 days to 1 month after the trauma"],
    ["Posttraumatic stress disorder", "Symptoms last more than 1 month"],
    ["PTSD with delayed expression", "Full criteria first met at least 6 months after the trauma"],
    ["Adjustment disorder", "Starts within 3 months of any stressor; ends within 6 months after the stressor ends"],
    ["Prolonged grief disorder", "At least 12 months after a death in adults (6 months in children; ICD-11 uses 6 months)"],
  ])),
  concept("cl-mood-duration", R(PP, /hypomani.{0,40}(day|duration|four|4)|manic episode.{0,40}(week|duration)|(at least|minimum of) (one|1|two|2) (week|years?)|persistent depressive|dysthymi|cyclothymi|duration (criterion|requirement)|(gad|generali[sz]ed anxiety).{0,40}(6|six) months/i), "timeline", tl("Mood and anxiety disorders: put the minimum durations in order (DSM-5-TR)", [
    ["Hypomanic episode", "At least 4 days"],
    ["Manic episode", "At least 1 week (any length if admitted)"],
    ["Major depressive episode", "At least 2 weeks"],
    ["Generalised anxiety disorder", "At least 6 months"],
    ["Persistent depressive disorder and cyclothymic disorder", "At least 2 years in adults (1 year in children and adolescents)"],
  ])),

  /* ------------------------------------------------ cognitive and behavioural models */
  concept("cl-thoughtrecord", R(TH, /beck|cognitive (triad|distortion|error|model of depression|restructur)|negative automatic|automatic thoughts?|thinking (error|trap)|catastrophi[sz]|overgenerali|mind.reading|all.or.nothing|black.and.white|personali[sz]ation|dysfunctional (assumption|attitude)|core beliefs?|thought record|socratic|downward arrow|cognitive specificity|magnification|selective abstraction|arbitrary inference|fortune.telling|cognitive therapy|\brebt\b|ellis|irrational beliefs?|\babc\b.{0,20}model|disput/i), "thoughtrecord", {
    situation: "My supervisor asked me to come and see her first thing tomorrow.",
    thought: "I have done something wrong and I am going to lose my job.",
    emotion: "anxious",
    traps: [
      { label: "Catastrophising", right: true, why: "You jumped from a meeting to the worst possible outcome, losing the job." },
      { label: "Fortune telling", right: true, why: "You are predicting the future as if it were fact." },
      { label: "Mind reading", why: "Close: you are guessing her reason, but the bigger trap is leaping to disaster." },
      { label: "Personalisation", why: "Not quite: you are not blaming yourself for something outside your control." },
    ],
    forEvidence: ["She sounded brief on the phone.", "I made a small error in last week's report."],
    againstEvidence: ["She meets everyone before the new term starts.", "My last review was good.", "Small errors are usually corrected, not punished."],
    balanced: "The meeting is probably routine or about the small error, which I can fix. Even if there is a problem, I have handled feedback well before.",
  }),
  concept("cl-avoidance", R([...TH, "learning-motivation-emotion"], /avoidance|safety behaviou?rs?|escape (learning|behaviou?r)|maintain(s|ed|ing)? (the )?(anxiety|fear|phobia|disorder)|two.factor|mowrer|exposure|habituat.{0,40}(anxiety|fear)|response prevention|\berp\b|neutrali[sz]|graded (exposure|hierarchy)|inhibitory learning|reassurance seeking|\bsuds\b|fear hierarchy/i, undefined, /systematic desensiti|pavlov|unconditioned/i), "hpaloop", { title: "Avoid it or face it", start: "day", caption: "Play the day once avoiding every problem and once facing them. Avoidance (and safety behaviours, reassurance seeking or compulsions) brings quick relief, which reinforces it, but the next stressor hits harder because the fear is never tested. Facing it brings short discomfort, then the stress load falls: the logic of exposure and response prevention, and Mowrer's two-factor account of how fears are learned and kept." }),
  concept("cl-relax", R([...TH], /relaxation|progressive muscle|biofeedback|applied tension|vasovagal|blood.injury|diaphragmatic|breathing (retraining|exercises?)|autogenic|grounding/i), "nervoussystem", { title: "Turning down the alarm", start: "auto", caption: "Switch from fight or flight to rest and digest. Slow breathing and muscle relaxation shift the body toward the parasympathetic side. Blood-injury phobia is the exception: the heart rate rises and then falls sharply (a vasovagal faint), so patients learn applied tension, tensing muscles to keep blood pressure up, instead of relaxing." }),
  concept("cl-genogram", R(["clinical-therapies", "counselling", "psychopathology", "clinical-psychiatry", "developmental"], /genogram|bowen|family (systems|therapy|tree|psychoeducation|assessment|life cycle)|triangulation|differentiation of self|multigenerational|enmeshed|disengaged|structural family|minuchin|expressed emotion|family.based|maudsley (family|approach|model)|milan|circular question|double bind|satir|strategic family|identified patient/i), "genogram", { title: "Draw the family", condition: "the presenting problem", caption: "Explore the example, then start blank and draw a family you are working with. A genogram over three generations shows patterns that a single interview misses: repeated illness, losses, cut-offs and close or conflicted pairs. Bowen used it to trace multigenerational patterns and triangles; structural therapists look for enmeshed or disengaged boundaries; high expressed emotion at home raises relapse risk in schizophrenia." }),
  concept("cl-lambert", R(["clinical-therapies", "counselling"], /lambert|common factors|extra.?therapeutic|dodo|contextual model|wampold|what (works|accounts for) (in )?(therapy|change)|allegiance|therapist effects/i), "experiment", xp("What makes therapy work? Lambert's estimate", "Lambert estimated what share of client improvement comes from each source. Guess each one.", "%", [
    ["Client and life outside therapy (extratherapeutic factors)", 40],
    ["The therapeutic relationship and other common factors", 30],
    ["Hope and expectancy (placebo)", 15],
    ["The specific technique", 15],
  ], "These are estimates from reviewing outcome studies, not exact measurements, but they explain the 'dodo bird verdict': different bona fide therapies give similar results because they share common factors.")),
  concept("cl-smithglass", R(["clinical-therapies", "counselling", "research-methods", "statistics"], /smith and glass|effect size.{0,40}(psychotherapy|therapy|0\.6|0\.8)|better off than|meta.analysis.{0,40}psychotherapy|eysenck'?s (1952|claim|challenge)|spontaneous remission/i), "curve", { kind: "normal", title: "What an effect size of 0.68 means", caption: "Set z to 0.68. Smith and Glass's meta-analysis found that the average treated client scored 0.68 standard deviations better than the average untreated one, which puts them at about the 75th percentile of the untreated group: better off than about three in four people who had no therapy. It answered Eysenck's 1952 claim that therapy did no better than spontaneous remission." }),
  concept("cl-insomnia", R([...TH], /sleep restriction|stimulus control|cbt.?i\b|insomnia|sleep efficiency|sleep hygiene|time in bed/i), "hypnogram", { title: "A night of sleep, and what CBT for insomnia changes", caption: "Drag through a normal night first. CBT for insomnia rebuilds sleep pressure and the bed-sleep link: sleep restriction limits time in bed to the time actually asleep (sleep efficiency = total sleep time ÷ time in bed × 100, aiming for 85% or more), and stimulus control means getting up when not asleep. It is the first-line treatment, ahead of sleeping tablets." }),
  concept("cl-act", R(["clinical-therapies", "counselling"], /hexaflex|psychological flexibility|cognitive defusion|defusion|self.as.context|experiential avoidance|committed action|acceptance and commitment|\bact\b.{0,30}(process|model|theory)/i), "flow", cycle("ACT's six core processes (the hexaflex)", [
    ["Acceptance", "Making room for painful feelings instead of fighting them."],
    ["Defusion", "Seeing thoughts as thoughts ('I am having the thought that...'), not facts."],
    ["Present moment", "Flexible attention to here and now."],
    ["Self as context", "The observing self that notices experiences without being them."],
    ["Values", "Chosen life directions."],
    ["Committed action", "Steps toward values, even with discomfort."],
  ], "Together they build psychological flexibility; their opposite, experiential avoidance, keeps problems going.")),

  /* ------------------------------------------------ counselling and change */
  concept("cn-holland", R(["counselling", "organisational", "psychometrics-assessment"], /holland|riasec|hexagon|realistic.{0,30}investigative|self.directed search|vocational personalit|congruence.{0,40}(career|environment|work)/i), "flow", cycle("Holland's hexagon", [
    ["Realistic", "Hands-on, tools, machines, outdoors."],
    ["Investigative", "Analysing, science, ideas."],
    ["Artistic", "Creating, expressing, unstructured work."],
    ["Social", "Helping, teaching, caring."],
    ["Enterprising", "Leading, persuading, selling."],
    ["Conventional", "Organising, data, clear rules."],
  ], "Neighbours on the hexagon are most alike (consistency); opposites, such as Realistic and Social, least alike. A good fit between a person's code and the work environment is congruence.")),
  concept("cn-super", R(["counselling", "developmental", "organisational"], /\bsuper'?s?\b.{0,40}(stage|theory|life)|life.span.{0,10}life.space|career (stages|maturity|development stages|adaptability)|growth.{0,20}exploration.{0,20}establishment|life.career rainbow|maintenance stage|disengagement stage/i), "timeline", tl("Put Super's career stages in order", [
    ["Growth: self-concept and interests form", "Birth to 14"],
    ["Exploration: trying out roles, choosing", "15 to 24"],
    ["Establishment: settling and advancing", "25 to 44"],
    ["Maintenance: holding on and updating", "45 to 64"],
    ["Disengagement (decline): slowing down, retirement", "65 onwards"],
  ], "People can recycle through these stages at any age; the life-career rainbow adds the roles (child, student, worker, parent and others) played at once.")),
  concept("cn-egan", R(["counselling", "clinical-therapies"], /egan|skilled helper|current (picture|scenario)|preferred (picture|scenario)|way forward|blind spots?/i), "timeline", tl("Put Egan's skilled helper stages in order", [
    ["Stage I: the current picture. Help the client tell the story, find blind spots and choose what to work on"],
    ["Stage II: the preferred picture. Explore possibilities and commit to goals"],
    ["Stage III: the way forward. Find strategies, make a plan and act"],
  ], "Action runs through all three stages, not only the last.")),
  concept("cn-roberts", R(["counselling", "clinical-psychiatry", "clinical-therapies"], /roberts'? (seven|7).stage|crisis intervention (model|steps)|seven.stage crisis/i), "timeline", tl("Put Roberts's seven-stage crisis intervention model in order", [
    ["Assess safety and lethality"],
    ["Establish rapport"],
    ["Identify the major problems and triggers"],
    ["Deal with feelings and emotions"],
    ["Explore alternatives and coping"],
    ["Develop an action plan"],
    ["Follow up"],
  ])),
  concept("cn-safety", R(["counselling", "clinical-psychiatry", "clinical-therapies", "psychopathology"], /safety plan|stanley.{0,10}brown|means restriction|lethal means|crisis (response )?plan/i), "timeline", tl("Put the steps of a suicide safety plan in order", [
    ["Recognise my warning signs"],
    ["Internal coping strategies I can use alone"],
    ["People and places that can distract me"],
    ["People I can ask for help"],
    ["Professionals and crisis lines (in India, Tele MANAS: 14416)"],
    ["Make my surroundings safe (remove or lock away means)"],
  ], "Written with the person, in their words, and kept where they can reach it. Restricting access to means (pesticides, medicines) is one of the best-proven ways to prevent suicide.")),
  concept("cn-mi", R(["counselling", "clinical-therapies", "clinical-psychiatry", "health"], /motivational interviewing|\bmi\b.{0,30}(process|spirit|skill)|engaging.{0,30}focusing|evoking|change talk|sustain talk|\boars\b|righting reflex|rolling with resistance|developing discrepancy/i), "timeline", tl("Put the four processes of motivational interviewing in order", [
    ["Engaging: build a working relationship"],
    ["Focusing: agree on what to talk about"],
    ["Evoking: draw out the person's own reasons for change (change talk)"],
    ["Planning: build commitment and a concrete plan"],
  ], "OARS (open questions, affirmations, reflections, summaries) are used throughout; resisting the righting reflex keeps the person, not the helper, arguing for change.")),
  concept("cn-ttm", R(["health", "counselling", "clinical-therapies", "clinical-psychiatry", "psychopathology"], /transtheoretical|stages of change|precontemplation|contemplation stage|prochaska|diclemente|readiness to change|preparation stage/i), "timeline", tl("Put Prochaska and DiClemente's stages of change in order", [
    ["Precontemplation: not considering change"],
    ["Contemplation: thinking about it, ambivalent"],
    ["Preparation: planning to act soon"],
    ["Action: changing behaviour (first 6 months)"],
    ["Maintenance: keeping it up beyond 6 months"],
  ], "Relapse is common and is seen as a return to an earlier stage, not failure. The model has been criticised because stage-matched interventions often do no better than unmatched ones.")),
];
