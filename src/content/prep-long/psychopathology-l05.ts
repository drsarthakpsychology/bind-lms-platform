import type { LongQA } from "@/lib/prep/long-types";
import { anchored, chain, cycle, vis } from "./visual";

export const PSYCHOPATHOLOGY_L05: LongQA[] = anchored([
  {
    id: "psyp-l05-001",
    subject: "psychopathology",
    topic: "bipolar-spectrum",
    marks: 15,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Describe the clinical features of mania. Compare and contrast bipolar I disorder, bipolar II disorder and cyclothymic disorder.",
    plan: ["Introduce bipolar disorders and their burden", "Clinical features of mania by domain", "DSM-5-TR criteria for manic and hypomanic episodes", "Compare the three disorders in a table", "Course, comorbidity and differential diagnosis", "Conclude"],
    answer: `## Introduction
Bipolar disorders are recurrent mood disorders marked by episodes of mania or hypomania, usually with episodes of depression. Bipolar I disorder affects about 1 percent of people and bipolar II about 0.5 percent; in India the National Mental Health Survey found a lifetime prevalence of about 0.5 percent for bipolar disorder. Onset is usually in the late teens to twenties.

## Clinical features of mania
- Mood: elevated, expansive or irritable; infectious cheerfulness that can turn to anger when thwarted; lability.
- Energy and activity: increased drive, many projects, overactivity, reduced need for sleep without tiredness.
- Speech and thought: pressured speech, flight of ideas, distractibility, punning and rhyming.
- Self esteem: grandiosity, from inflated confidence to delusions of special powers, wealth or divine identity.
- Behaviour: spending sprees, risky sexual behaviour, reckless driving, disinhibition, making phone calls at night, giving away money.
- Psychotic features: grandiose or persecutory delusions, sometimes hallucinations; mood congruent or incongruent.
- Insight is usually poor.
- Severe forms: delirious mania with confusion, and manic stupor.
Carlson and Goodwin described three stages of increasing severity: hypomania, acute mania, and delirious mania.

## DSM-5-TR episode criteria
Manic episode:
- A distinct period of abnormally and persistently elevated, expansive or irritable mood and abnormally and persistently increased activity or energy, lasting at least one week, most of the day nearly every day (any duration if hospitalised).
- Three or more of seven symptoms (four if mood is only irritable): grandiosity, decreased need for sleep, talkativeness or pressure of speech, flight of ideas or racing thoughts, distractibility, increased goal directed activity or agitation, and risky activities.
- Marked impairment, hospitalisation or psychotic features.
- A full manic episode that emerges during antidepressant treatment and persists beyond the drug's effect counts as mania.

Hypomanic episode:
- The same symptoms for at least four consecutive days.
- A clear change in functioning observable by others, but not severe enough for marked impairment or hospitalisation, and no psychosis.

## Comparison
| Feature | Bipolar I | Bipolar II | Cyclothymic disorder |
| Defining episode | At least one manic episode | At least one hypomanic and one major depressive episode | Numerous hypomanic and depressive symptoms not meeting full episode criteria |
| Depression | Common but not required | Required | Subthreshold only |
| Duration rule | Mania one week | Hypomania four days, depression two weeks | Two years (one in youth), symptoms at least half the time, never free for more than two months |
| Psychosis | May occur | Not in hypomania (may occur in depression) | Absent |
| Impairment | Often severe | Mainly from depression | Mild to moderate, unstable life pattern |
| Course | Recurrent; hospital admissions | Chronic, more depressive time, more rapid cycling | 15 to 50 percent later develop bipolar I or II |
| Sex ratio | About equal | More women | About equal |

Bipolar II is not a milder bipolar I: patients spend much more time depressed, and suicide risk is similar.

## Course and comorbidity
Episodes recur in over 90 percent after a first mania. Depression dominates the time spent ill. Comorbidity with anxiety, substance use, ADHD and personality disorders is high. Suicide risk is 20 to 30 times that of the general population.

## Differential diagnosis
- Substance induced mania (steroids, amphetamines, cannabis, antidepressants).
- Mania due to medical conditions (hyperthyroidism, frontal lesions, HIV, multiple sclerosis).
- Schizophrenia and schizoaffective disorder.
- ADHD and borderline personality disorder, which have chronic rather than episodic instability.
- Unipolar depression, especially in bipolar II where hypomania is often missed; screening with the Mood Disorder Questionnaire or the Hypomania Checklist 32 helps.

## Conclusion
Mania is defined by a distinct period of raised mood and energy with typical symptoms. Bipolar I, bipolar II and cyclothymia lie on a spectrum that differs in the severity of highs and the burden of lows; accurate history from relatives is the key to diagnosis.`,
    keyPoints: ["Mania features across domains", "Manic episode: one week, three or four of seven, marked impairment", "Hypomania: four days, no marked impairment or psychosis", "Antidepressant emergent mania rule", "Table comparing three disorders", "Cyclothymia two year rule", "Bipolar II not milder", "Differential diagnosis and screening tools"],
    pitfalls: ["Writing hypomania duration as one week", "Saying bipolar II is a mild disorder", "Forgetting the irritable mood four symptom rule"],
    visuals: [
      vis("moodline", {
        prompt: "Which disorder does this mood line show?",
        series: [0, 2, 1, -2, -3, -2, 0, 2, 0, -3, -3, -1, 0],
        options: ["Bipolar I disorder", "Bipolar II disorder", "Cyclothymic disorder", "Recurrent depression"],
        answer: 1,
        why: "Highs reach only hypomania while lows are full depressive episodes: bipolar II.",
      }),
    ],
    module: "bipolar",
    ref: "DSM-5-TR bipolar and related disorders; Carlson and Goodwin 1973 stages of mania; NMHS 2016; Judd 2002 symptom burden in BP II",
  },
  {
    id: "psyp-l05-002",
    subject: "psychopathology",
    topic: "aetiology-bipolar",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Discuss the aetiology of bipolar disorder.",
    plan: ["Introduce bipolar as highly heritable but multifactorial", "Genetics", "Neurochemical and intracellular theories", "Circadian and sleep theories", "Psychological and social triggers", "Integration and conclusion"],
    answer: `## Introduction
Bipolar disorder is one of the most heritable psychiatric disorders, yet environmental and psychological factors strongly influence onset and relapse.

## Genetics
- First degree relatives have about a 5 to 10 times higher risk of bipolar disorder, and also more unipolar depression and schizophrenia.
- Twin heritability is estimated at 60 to 85 percent; identical twin concordance is about 40 to 70 percent.
- Genome wide studies have identified dozens of loci, including CACNA1C (a calcium channel) and ANK3, with substantial genetic overlap with schizophrenia.

## Neurochemical theories
- Monoamines: mania may involve excess dopamine and noradrenaline. Amphetamine and levodopa can trigger mania; antipsychotics treat it.
- Cholinergic and aminergic balance (Janowsky): relative cholinergic excess in depression and aminergic excess in mania.
- Glutamate and GABA imbalance, supported by the anticonvulsant action of mood stabilisers.

## Intracellular and cellular theories
- Lithium inhibits inositol monophosphatase (the inositol depletion hypothesis) and glycogen synthase kinase 3, and raises neuroprotective proteins such as BCL 2 and BDNF.
- Mitochondrial dysfunction and oxidative stress.
- Inflammation markers rise during episodes.
- Imaging: amygdala overactivity with reduced prefrontal control; more white matter hyperintensities; progressive grey matter loss with repeated episodes, partly prevented by lithium.

## Circadian and sleep theories
Sleep loss is a well known trigger for mania (for example after night travel, exams or childbirth). Clock gene variations, abnormal melatonin rhythms and seasonal patterns support a circadian model. The social zeitgeber theory (Ehlers, Frank and Kupfer) holds that life events disrupt daily routines, which disturb biological rhythms and trigger episodes; interpersonal and social rhythm therapy is based on this.

## Psychological and social factors
- Life events precede episodes, especially early ones; Robert Post's kindling idea proposes that later episodes need less stress.
- Goal attainment events trigger mania in people with a hypersensitive behavioural approach system (Johnson; Alloy).
- High expressed emotion in families predicts relapse.
- Postpartum period is a high risk time for bipolar women.
- Substance use and antidepressants without mood stabilisers can trigger switching.

## Integration
| Level | Contribution |
| Genes | High heritability, many loci shared with schizophrenia |
| Brain | Amygdala and prefrontal imbalance, intracellular signalling |
| Rhythms | Sleep and circadian disruption |
| Psychology | Reward sensitivity, kindling |
| Social | Life events, expressed emotion, postpartum |

## Conclusion
Bipolar disorder arises from strong genetic vulnerability expressed through disturbed neural signalling and circadian systems, with sleep loss, life events and drugs as triggers. This explains why lithium, regular routines and family work all help.`,
    keyPoints: ["Family and twin figures", "Named genes and overlap with schizophrenia", "Dopamine and cholinergic theories", "Lithium targets: inositol, GSK 3", "Sleep loss and social zeitgeber theory", "Kindling and reward hypersensitivity", "Integration table"],
    visuals: [chain("Social zeitgeber theory", [["Life event", "Job change, travel, childbirth"], ["Routines disrupted", "Sleep, meals, activity times shift"], ["Biological rhythms destabilise", "Clock genes, melatonin"], ["Mood episode", "In a vulnerable person"]], "Interpersonal and social rhythm therapy works on the second step.")],
    module: "bipolar",
    ref: "Kaplan bipolar chapter; Stahl mood stabilisers; Ehlers Frank Kupfer 1988; Post 1992 kindling; Mullins 2021 PGC bipolar GWAS",
  },
  {
    id: "psyp-l05-003",
    subject: "psychopathology",
    topic: "rapid-cycling",
    marks: 5,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Write short notes on rapid cycling bipolar disorder.",
    plan: ["Definition", "Epidemiology and risk factors", "Assessment", "Management"],
    answer: `## Definition
Rapid cycling is a course specifier in DSM-5-TR for bipolar I or II disorder: at least four mood episodes (manic, hypomanic or major depressive) in the previous twelve months. Episodes are separated by partial or full remission for at least two months or by a switch to the opposite pole. The term was introduced by Dunner and Fieve, who found these patients responded poorly to lithium. Ultra rapid (days) and ultradian (within a day) cycling are also described.

## Epidemiology and risk factors
About 10 to 20 percent of patients with bipolar disorder have rapid cycling in a given year. Risk factors include:
- Female sex.
- Bipolar II disorder.
- Hypothyroidism, including subclinical, and lithium induced hypothyroidism.
- Antidepressant use, especially tricyclics.
- Substance and alcohol use.
- Earlier onset and longer illness.
It is often a phase rather than a permanent course.

## Assessment
Mood charting (life charts or mood apps) over months, thyroid function tests, review of antidepressants and substances, and screening for comorbid anxiety and personality difficulties.

## Management
- Stop or taper antidepressants where possible.
- Correct thyroid function; high dose levothyroxine has been used as augmentation.
- Mood stabilisers: lithium remains useful, and valproate, lamotrigine (especially for depressive cycling, as in bipolar II) and quetiapine have evidence; combinations are often needed.
- Treat substance use and stabilise sleep and routines.
- Psychoeducation and social rhythm work.

## Conclusion
Rapid cycling signals a harder course. The keys are to remove triggers (antidepressants, thyroid problems, substances) and to use combined mood stabilisation.`,
    keyPoints: ["Four episodes in twelve months", "Dunner and Fieve", "Prevalence", "Risk factors including hypothyroidism and antidepressants", "Mood charting", "Management steps"],
    module: "bipolar",
    ref: "DSM-5-TR rapid cycling specifier; Dunner and Fieve 1974; Maudsley rapid cycling guidance",
  },
  {
    id: "psyp-l05-004",
    subject: "psychopathology",
    topic: "mixed-features",
    marks: 5,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Write short notes on the mixed features specifier.",
    plan: ["History from mixed states", "DSM-5-TR criteria for each pole", "Clinical importance", "Treatment"],
    answer: `## Background
Kraepelin and Weygandt described mixed states, in which manic and depressive symptoms occur together. DSM-IV required full criteria for both mania and depression at once (a "mixed episode"), which was rarely met. DSM-5 replaced this with a mixed features specifier that can be added to manic, hypomanic or depressive episodes.

## Criteria
- Mania or hypomania with mixed features: full criteria for the episode plus at least three depressive symptoms nearly every day: dysphoria or depressed mood, loss of interest or pleasure, psychomotor retardation, fatigue, worthlessness or guilt, and thoughts of death or suicide.
- Depressive episode with mixed features: full criteria for a major depressive episode plus at least three manic or hypomanic symptoms: elevated mood, grandiosity, pressured speech, flight of ideas, increased energy or activity, risky behaviour, and decreased need for sleep.
- Overlapping symptoms such as irritability, distractibility and psychomotor agitation are not counted, to avoid double counting.
- If full criteria for both mania and depression are met at the same time, the episode is diagnosed as manic with mixed features, because of the severity of mania.

## Clinical importance
- Mixed states carry high suicide risk, agitation, anxiety and substance use.
- Depression with mixed features predicts later bipolar disorder and poor response to antidepressants alone.
- ICD-11 keeps a "mixed episode" category with rapid alternation or co-occurrence of symptoms over at least two weeks.

## Treatment
Avoid antidepressant monotherapy. Use antipsychotics with evidence (for example lurasidone for depression with mixed features, or olanzapine, quetiapine, asenapine), valproate, or ECT in severe cases. Lithium may be less effective in mixed states.

## Conclusion
The specifier makes mixed states easier to recognise; recognition matters because of suicide risk and different treatment.`,
    keyPoints: ["History and DSM-IV mixed episode", "Three opposite pole symptoms", "Overlapping symptoms excluded", "Full criteria for both: mania with mixed features", "Suicide risk and antidepressant caution", "ICD-11 mixed episode"],
    module: "bipolar",
    ref: "DSM-5-TR mixed features specifier; ICD-11 mixed episode; Suppes 2016 lurasidone",
  },
  {
    id: "psyp-l05-005",
    subject: "psychopathology",
    topic: "gad",
    marks: 10,
    difficulty: 3,
    exams: ["mcp-entrance", "ma-semester", "md-psychiatry"],
    question: "Describe generalised anxiety disorder and discuss the psychological models that explain worry.",
    plan: ["Definition and DSM-5-TR criteria", "Epidemiology and course", "Three or four psychological models", "Brief treatment link", "Conclusion"],
    answer: `## Definition and criteria
Generalised anxiety disorder (GAD) is chronic, excessive and hard to control worry about many everyday matters (health, money, family, work), with physical tension. DSM-5-TR requires:
- Excessive anxiety and worry on more days than not for at least six months, about several events or activities.
- Difficulty controlling the worry.
- Three or more of six symptoms (one in children): restlessness or feeling on edge, being easily fatigued, difficulty concentrating or mind going blank, irritability, muscle tension, and sleep disturbance.
- Distress or impairment; not due to substances or medical conditions; not better explained by another disorder.
ICD-11 requires symptoms for "at least several months" and allows either general apprehension or excessive worry.

## Epidemiology and course
Lifetime prevalence is about 4 to 6 percent, more in women, with a chronic waxing and waning course. Comorbid depression is very common. In India, GAD often presents with bodily complaints such as headache, palpitations and "tension".

## Psychological models of worry
- Avoidance theory (Thomas Borkovec): worry is mainly verbal thought, which suppresses vivid imagery and bodily arousal. This brings short term relief and so is negatively reinforced, but it prevents emotional processing of fears. Also, most feared events do not happen, which is falsely credited to the worry.
- Metacognitive model (Adrian Wells): people hold positive beliefs about worry ("worry helps me prepare"), which drive type 1 worry about daily matters. Later they develop negative beliefs ("worry is uncontrollable and dangerous"), producing type 2 worry, worry about worry, which is the core of GAD.
- Intolerance of uncertainty model (Michel Dugas): people with GAD find uncertainty unbearable. Together with positive beliefs about worry, negative problem orientation and cognitive avoidance, this maintains worry.
- Emotion dysregulation model (Mennin): heightened emotional intensity, poor understanding of emotions and poor regulation lead people to use worry to control emotion.
- Cognitive models stress attentional bias to threat and interpretation bias for ambiguous information.

| Model | Core process | Therapy target |
| Avoidance | Worry blocks arousal and imagery | Exposure to feared images |
| Metacognitive | Beliefs about worry | Challenge uncontrollability and danger beliefs |
| Intolerance of uncertainty | Uncertainty felt as threat | Behavioural experiments with uncertainty |
| Emotion dysregulation | Poor regulation skills | Emotion regulation therapy |

## Treatment link
CBT, metacognitive therapy and applied relaxation are effective. Medicines include SSRIs (escitalopram, sertraline), SNRIs (venlafaxine, duloxetine), pregabalin and buspirone; benzodiazepines only short term.

## Conclusion
GAD is defined by chronic, uncontrollable worry. Psychological models explain why worry persists despite its cost and guide specific therapies.`,
    keyPoints: ["Six months and three of six symptoms", "ICD-11 difference", "Prevalence and comorbidity", "Borkovec avoidance theory", "Wells type 1 and type 2 worry", "Dugas intolerance of uncertainty", "Treatment options"],
    visuals: [chain("Wells' metacognitive model of GAD", [["Trigger", "A worrying thought"], ["Positive beliefs", "Worry helps me cope"], ["Type 1 worry", "About daily matters"], ["Negative beliefs", "Worry is uncontrollable and dangerous"], ["Type 2 worry", "Worry about worry"], ["Anxiety and avoidance", "Which confirm the beliefs"]])],
    module: "anxiety",
    ref: "DSM-5-TR GAD; Borkovec 1994; Wells 1995; Dugas 1998; Mennin 2005",
  },
  {
    id: "psyp-l05-006",
    subject: "psychopathology",
    topic: "panic",
    marks: 15,
    difficulty: 3,
    exams: ["mcp-entrance", "ma-semester", "md-psychiatry"],
    question: "Discuss the clinical features of panic disorder and critically evaluate Clark's cognitive model. How does it guide treatment?",
    plan: ["Panic attack and panic disorder definitions", "Epidemiology and differential diagnosis", "Biological models briefly", "Clark's cognitive model step by step with maintaining factors", "Evidence and critique", "CBT for panic and medicines; conclusion"],
    answer: `## Panic attacks and panic disorder
A panic attack is an abrupt surge of intense fear or discomfort that peaks within minutes, with at least four of thirteen symptoms: palpitations, sweating, trembling, shortness of breath, choking, chest pain, nausea, dizziness, chills or heat, numbness or tingling, derealisation or depersonalisation, fear of losing control or going crazy, and fear of dying. Panic attacks can occur in any anxiety disorder and are used as a specifier.

Panic disorder in DSM-5-TR requires:
- Recurrent unexpected panic attacks.
- At least one attack followed by a month or more of persistent worry about further attacks or their consequences, or a significant change in behaviour (avoidance of exercise or unfamiliar places).
- Not due to substances (caffeine, stimulants, withdrawal) or medical conditions (hyperthyroidism, arrhythmia, phaeochromocytoma), and not better explained by another disorder.
Agoraphobia is now a separate diagnosis, though the two often co-occur.

## Epidemiology and presentation
Lifetime prevalence is about 2 to 4 percent, about twice as common in women, with onset in early adulthood. Many patients first attend emergency or cardiology services; in India they often present to physicians with "heart attack" fears or "gas". Comorbid depression, agoraphobia and alcohol misuse are common.

## Biological models in brief
Panic can be provoked by sodium lactate, carbon dioxide inhalation and yohimbine in susceptible people. Donald Klein proposed a false suffocation alarm. A "fear network" involving the amygdala, hippocampus, periaqueductal grey and locus coeruleus is implicated. Heritability is about 40 percent.

## Clark's cognitive model
David Clark proposed in 1986 that panic attacks result from the catastrophic misinterpretation of normal bodily sensations. The cycle runs:
- A trigger, external (a crowded place) or internal (a thought, a sensation such as a skipped beat).
- Perceived threat leads to apprehension.
- Apprehension produces bodily sensations (faster heart, breathlessness, dizziness).
- These sensations are interpreted catastrophically ("I am having a heart attack", "I will faint", "I am going mad").
- The interpretation raises fear further, which intensifies the sensations, and the loop spirals into panic within seconds.

Maintaining factors:
- Hypervigilance: constant body scanning makes sensations more noticeable.
- Safety behaviours: sitting down, holding on, slow breathing, carrying water or medicines, keeping a companion. These prevent disconfirmation: the person believes "I didn't faint because I sat down".
- Avoidance of situations and activities that bring on sensations.
- Anticipatory anxiety between attacks.

## Evidence for the model
- Patients with panic disorder rate catastrophic interpretations of sensations more often than controls.
- Lactate and carbon dioxide induced panic can be blocked by explanation that reduces catastrophic interpretation.
- Change in catastrophic beliefs during therapy predicts outcome.
- Cognitive therapy based on the model leaves about 75 to 90 percent of patients panic free, and gains are maintained at follow up.

## Critique
- Some patients report panic without conscious catastrophic thoughts, including nocturnal panic attacks from sleep. Clark replies that interpretations can be fast and automatic.
- The model is partly circular if misinterpretation is inferred from panic itself.
- It underplays biological vulnerability and the role of anxiety sensitivity (Reiss), which may be the underlying trait.
- Interoceptive exposure without cognitive restructuring also works, suggesting learning (fear conditioning to internal cues, as in Barlow's model) is part of the mechanism.

## Treatment guided by the model
- Psychoeducation with a personal version of the vicious circle.
- Cognitive restructuring of catastrophic beliefs, using evidence ("how many attacks, how many heart attacks?").
- Behavioural experiments: inducing sensations by over breathing, spinning or running on the spot to show they are harmless.
- Dropping safety behaviours and stopping body scanning.
- Graded exposure to avoided situations.
- Medicines: SSRIs (sertraline, escitalopram, paroxetine) and venlafaxine are first line, started at low dose because early jitteriness can feel like panic; clonazepam (widely used in India) only short term, as dependence and reduced benefit of CBT are risks.

## Conclusion
Panic disorder is common and treatable. Clark's model is one of the best supported cognitive models in psychiatry and directly shaped an effective therapy, though biological vulnerability and learning processes complete the picture.`,
    keyPoints: ["Panic attack definition with peak within minutes and four of thirteen symptoms", "Panic disorder criteria with one month of worry or behaviour change", "Medical and substance exclusions", "Clark's vicious circle in steps", "Safety behaviours and hypervigilance", "Evidence including outcome rates", "Critique: nocturnal panic, anxiety sensitivity, learning", "CBT components and medicines"],
    pitfalls: ["Calling every panic attack panic disorder", "Not mentioning safety behaviours", "Recommending long term benzodiazepines"],
    visuals: [
      cycle("Clark's vicious circle of panic", [["Trigger", "Crowd, thought or sensation"], ["Perceived threat", ""], ["Apprehension", ""], ["Body sensations", "Racing heart, dizziness"], ["Catastrophic misinterpretation", "I am dying"]], "Safety behaviours and avoidance keep the circle from being disproved."),
      vis("nervoussystem", { title: "Fight or flight in a panic attack", start: "auto", caption: "Switch to fight or flight: these are the sensations a person with panic misreads as danger." }),
    ],
    module: "anxiety",
    ref: "Clark 1986 Behav Res Ther; DSM-5-TR panic disorder; Klein 1993 suffocation alarm; Barlow; Clark 1994 trial outcomes",
  },
  {
    id: "psyp-l05-007",
    subject: "psychopathology",
    topic: "agoraphobia",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "mcp-entrance"],
    question: "Write short notes on agoraphobia.",
    plan: ["Definition and DSM-5-TR criteria", "Relation to panic", "Epidemiology and course", "Treatment"],
    answer: `## Definition
Agoraphobia is fear or anxiety about situations from which escape might be difficult or help unavailable if panic like or embarrassing symptoms occur. The word means "fear of the marketplace".

## DSM-5-TR criteria
- Marked fear about two or more of five situations: using public transport, being in open spaces (parking lots, bridges, markets), being in enclosed places (shops, cinemas), standing in line or being in a crowd, and being outside the home alone.
- The fear is about escape or help being unavailable if panic or embarrassing symptoms (falling, incontinence) occur.
- Situations are avoided, need a companion, or are endured with intense fear.
- Out of proportion to the actual danger, for six months or more, with distress or impairment.

## Relation to panic disorder
In DSM-IV agoraphobia was usually diagnosed with or without panic disorder. DSM-5 made it a separate disorder, because many people have agoraphobia without full panic attacks. Both can be diagnosed together. ICD-11 also lists it separately.

## Epidemiology and course
About 1 to 2 percent a year, more in women, onset usually before 35. It tends to be chronic and can lead to being housebound, depression and alcohol misuse. In Indian homes, the patient may be accompanied everywhere by a relative, which hides the severity.

## Treatment
- CBT with graded in vivo exposure, building a hierarchy from easiest to hardest situations, and dropping safety behaviours such as always taking a companion.
- Treatment of comorbid panic with cognitive techniques and SSRIs.
- Involving family to support exposure rather than accommodation.

## Conclusion
Agoraphobia is a disabling fear of situations, now diagnosed in its own right, and responds well to exposure based therapy.`,
    keyPoints: ["Five situations and two or more needed", "Fear of escape or help being unavailable", "Six months", "Separate from panic disorder since DSM-5", "Course and family accommodation", "Graded exposure"],
    module: "anxiety",
    ref: "DSM-5-TR agoraphobia",
  },
  {
    id: "psyp-l05-008",
    subject: "psychopathology",
    topic: "social-anxiety",
    marks: 10,
    difficulty: 3,
    exams: ["mcp-entrance", "ma-semester"],
    question: "Describe social anxiety disorder and explain the Clark and Wells cognitive model.",
    plan: ["Definition, criteria and specifier", "Epidemiology and cultural variants", "Clark and Wells model components", "Treatment derived from the model", "Conclusion"],
    answer: `## Definition and criteria
Social anxiety disorder (social phobia) is marked fear of social situations in which a person may be scrutinised by others, such as conversations, meeting strangers, eating in public or giving a talk. DSM-5-TR requires:
- Fear of acting in a way, or showing anxiety symptoms, that will be negatively evaluated (humiliating, embarrassing or offensive).
- Social situations almost always provoke fear and are avoided or endured with intense distress.
- Fear out of proportion to the actual threat, lasting six months or more, with impairment.
- In children, anxiety must occur with peers, not only adults.
The "performance only" specifier applies when the fear is limited to speaking or performing in public.

## Epidemiology and culture
Lifetime prevalence is about 7 to 12 percent in Western samples, lower in many Asian surveys. Onset is usually in early adolescence, and the course is chronic. Comorbid depression and alcohol use are common. In Japan and Korea, taijin kyofusho is a related fear of offending or embarrassing others (for example by one's gaze or body odour). In India, students commonly present with fear of speaking in class or interviews, often after years of avoidance.

## The Clark and Wells model
David Clark and Adrian Wells proposed in 1995 that social anxiety is maintained by four processes:
- Activation of assumptions: in a social situation, beliefs such as "I must always sound intelligent" or "If I blush, people will think I am weird" produce a sense of social danger.
- Processing of the self as a social object: attention shifts inward to monitor oneself. The person uses internal information (feeling hot, a distorted image of oneself seen from outside, the "observer perspective") to infer how others see them. This leads to a negative impression that is mistaken for reality.
- Safety behaviours: avoiding eye contact, rehearsing sentences, holding a glass tightly, speaking little. These prevent disconfirmation, increase self focus and can make the person seem unfriendly, provoking cooler responses.
- Somatic and cognitive symptoms: blushing, trembling and mind going blank are taken as signs of failure.
Before the event, anticipatory processing recalls past failures; afterwards, the post event "post mortem" reviews the situation in a biased, negative way, keeping the fear going.

## Treatment derived from the model
Cognitive therapy for social anxiety includes:
- Building the personal model with the patient.
- Self focused attention and safety behaviour experiments: having a conversation once with and once without safety behaviours, and comparing.
- Video feedback to correct the distorted self image.
- Training external attention to the other person.
- Behavioural experiments to test predictions.
- Dropping anticipatory and post event processing.
Trials show this therapy outperforms medicines and other CBT formats. SSRIs and venlafaxine are also effective; beta blockers help only performance anxiety.

## Conclusion
Social anxiety disorder is common, early onset and disabling. The Clark and Wells model explains why fear does not extinguish despite repeated social exposure, and guides one of the most effective psychological treatments.`,
    keyPoints: ["Criteria with negative evaluation and six months", "Performance only specifier", "Prevalence and taijin kyofusho", "Self as social object and observer perspective", "Safety behaviours and their effect", "Anticipatory and post event processing", "Video feedback and attention training"],
    visuals: [cycle("Clark and Wells model of social anxiety", [["Social situation", "Activates assumptions"], ["Perceived social danger", ""], ["Self focused attention", "Observer perspective image"], ["Safety behaviours", "Avoid eye contact, rehearse"], ["Symptoms seen as failure", "Blushing, blank mind"]])],
    module: "anxiety",
    ref: "Clark and Wells 1995; DSM-5-TR social anxiety; Mayo-Wilson 2014 network meta-analysis",
  },
  {
    id: "psyp-l05-009",
    subject: "psychopathology",
    topic: "specific-phobia",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "mcp-entrance", "ugc-net"],
    question: "Discuss the aetiology of specific phobias. How do learning theories explain their acquisition and maintenance?",
    plan: ["Definition and subtypes", "Classical conditioning and Little Albert", "Mowrer's two factor theory", "Preparedness, Rachman's three pathways, non-associative theory", "Biological factors; blood injection injury type", "Treatment and conclusion"],
    answer: `## Definition and subtypes
A specific phobia is marked, persistent fear of a particular object or situation, out of proportion to the danger, causing avoidance or endured distress, for six months or more. DSM-5-TR subtypes: animal, natural environment (heights, water, storms), blood injection injury, situational (lifts, flying) and other (choking, vomiting). Lifetime prevalence is about 7 to 9 percent, highest in women, with onset in childhood.

## Classical conditioning
John Watson and Rosalie Rayner conditioned an infant, "Little Albert", to fear a white rat by pairing it with a loud noise; the fear generalised to other furry objects. This showed that fears can be learned when a neutral stimulus is paired with an aversive one.

## Mowrer's two factor theory
- Factor 1: classical conditioning creates the fear.
- Factor 2: operant conditioning maintains it. Avoidance reduces anxiety, so avoidance is negatively reinforced, and the person never learns the object is safe, so extinction cannot occur.
This explains why phobias persist for years and why exposure works.

## Problems with simple conditioning
- Many phobic people recall no conditioning event.
- Many people with traumatic events (for example dog bites) do not develop phobias.
- Phobias cluster around certain objects (snakes, spiders, heights) and not around common dangers (electric sockets, cars).

## Later theories
- Preparedness (Martin Seligman): evolution has prepared humans to learn fears of stimuli that threatened ancestors. Such fears are acquired quickly, sometimes in one trial, and resist extinction. Ohman's experiments showed faster conditioning to snake and spider pictures than to flowers.
- Rachman's three pathways: direct conditioning, vicarious learning (seeing others' fear, as in Mineka's monkeys who learned snake fear by watching other monkeys) and informational transmission (being told something is dangerous).
- Non associative theory (Poulton and Menzies): some fears, such as of heights and water, are innate and simply fail to habituate in some children.
- Cognitive factors: overestimation of danger and attentional bias towards threat.
- Disgust sensitivity plays a role in animal and blood phobias.

## Biological factors
Heritability is moderate (about 30 percent), and temperament with behavioural inhibition raises risk. The amygdala is central to fear learning. The blood injection injury type is special: there is a brief rise then a sharp fall in heart rate and blood pressure (a vasovagal response), so people may faint. It runs strongly in families.

## Treatment
- Exposure therapy, in vivo or virtual reality, with graded hierarchy; Lars Ost's one session treatment can be effective in about three hours.
- Systematic desensitisation (Wolpe) pairs relaxation with graded exposure.
- Applied tension for blood injection injury phobia, tensing muscles to raise blood pressure.
- Medicines play little role.

## Conclusion
Learning theories, especially Mowrer's two factor theory with preparedness and Rachman's pathways, explain much of how phobias are acquired and maintained, and they directly gave us exposure therapy, one of the most effective treatments in psychology.`,
    keyPoints: ["Definition and five subtypes", "Little Albert", "Two factor theory with negative reinforcement of avoidance", "Criticisms of simple conditioning", "Preparedness and Ohman's work", "Rachman's three pathways", "Blood injection injury vasovagal response and applied tension", "Exposure based treatment"],
    visuals: [
      chain("Mowrer's two factor theory", [["Pairing", "Dog plus bite: classical conditioning"], ["Fear of dogs", "Conditioned response"], ["Avoidance", "Cross the road"], ["Relief", "Negative reinforcement"], ["Fear never tested", "No extinction"]]),
      vis("conditioning", { kind: "classical", caption: "Pair the stimulus, then present it alone: this is how exposure brings extinction." }),
    ],
    module: "anxiety",
    ref: "Watson and Rayner 1920; Mowrer 1947; Seligman 1971 preparedness; Rachman 1977; Poulton and Menzies 2002; Ost 1989",
  },
  {
    id: "psyp-l05-010",
    subject: "psychopathology",
    topic: "separation-anxiety",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "mcp-entrance"],
    question: "Write short notes on separation anxiety disorder.",
    plan: ["Definition and criteria", "Change in DSM-5", "Features and causes", "Treatment"],
    answer: `## Definition
Separation anxiety disorder is developmentally inappropriate and excessive fear or anxiety about separation from attachment figures. Some separation distress is normal between about eight months and two to three years.

## DSM-5-TR criteria
Three or more of the following:
- Excessive distress when separation from home or attachment figures occurs or is expected.
- Persistent worry about losing attachment figures or harm coming to them.
- Worry that an event (getting lost, kidnapping) will cause separation.
- Reluctance or refusal to go out, to school or work.
- Fear of being alone.
- Reluctance to sleep away from home or without the attachment figure nearby.
- Repeated nightmares about separation.
- Physical complaints (headache, stomach ache) when separation is expected.
Duration: at least four weeks in children and adolescents, and typically six months or more in adults.

## Change in DSM-5
It moved from the childhood disorders chapter to the anxiety disorders chapter, and can now be diagnosed in adults, where the attachment figure may be a partner or child.

## Features and causes
It is the most common anxiety disorder in children under 12 (about 4 percent). It often follows a stress such as a move, a new school, illness or a death in the family. Contributing factors include behaviourally inhibited temperament, anxious or overprotective parenting, insecure attachment and family history of anxiety. It may present as school refusal with abdominal pain on school mornings, which in India is often first taken to a paediatrician.

## Treatment
CBT for the child with graded separation, parent training to reduce accommodation and reward brave behaviour, and early return to school with the school's support. SSRIs are used in severe cases.

## Conclusion
Separation anxiety disorder is common and treatable; early help prevents school refusal and later anxiety disorders.`,
    keyPoints: ["Developmentally inappropriate fear", "Three of eight symptoms", "Four weeks children, six months adults", "Moved to anxiety chapter and allowed in adults", "School refusal presentation", "CBT with parent work"],
    module: "child",
    ref: "DSM-5-TR separation anxiety disorder",
  },
]);
