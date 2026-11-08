import type { LongQA } from "@/lib/prep/long-types";
import { anchored, compare, cycle, timeline, tree, vis } from "./visual";

export const PSYCHOPATHOLOGY_L04: LongQA[] = anchored([
  {
    id: "psyp-l04-001",
    subject: "psychopathology",
    topic: "aetiology-depression",
    marks: 20,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Discuss the aetiology of depressive disorders, integrating biological, psychological and social theories.",
    plan: ["Prevalence and the need for a multifactorial view", "Genetic and neurobiological theories with evidence and limits", "Psychological theories: psychodynamic, cognitive, behavioural, helplessness, rumination", "Social theories: Brown and Harris, adversity, Indian factors", "Integrate in a stress diathesis frame", "Conclude"],
    answer: `## Introduction
Depression is one of the leading causes of disability worldwide. In India the National Mental Health Survey 2015 to 16 found a current prevalence of about 2.7 percent and a lifetime prevalence of about 5.3 percent, higher in urban metros and in middle aged adults. It is about twice as common in women from adolescence onwards. No single cause explains it; biological, psychological and social factors interact.

## Genetic factors
- First degree relatives have about two to three times the general risk.
- Twin studies suggest heritability of about 35 to 40 percent, lower than for bipolar disorder or schizophrenia.
- Genome wide studies have found around a hundred common variants, each of tiny effect.
- Gene by environment interaction: the early finding that the short allele of the serotonin transporter gene increased depression risk only after stressful life events did not replicate in large studies; current evidence supports many small genetic effects interacting with adversity.

## Neurochemical theories
- Monoamine hypothesis: depression results from a deficiency of serotonin and noradrenaline (Schildkraut). Support: reserpine depletes monoamines and can cause depression; antidepressants raise synaptic monoamines; tryptophan depletion causes brief relapse in recovered patients. Limits: antidepressants raise monoamines within hours but mood improves over weeks; depletion does not cause depression in healthy people; a simple "chemical imbalance" is not supported.
- Receptor and neuroplasticity theories: the delay in response reflects downstream changes, such as receptor down regulation and increased brain derived neurotrophic factor (BDNF). The neurotrophic hypothesis holds that stress and cortisol reduce BDNF and cause loss of dendritic spines in the hippocampus and prefrontal cortex; antidepressants and ECT reverse this. Ketamine's rapid effect through glutamate and synapse formation supports this view.
- GABA and neurosteroids: reduced GABA function; brexanolone and zuranolone, which act on GABA A receptors, are approved for postpartum depression in the USA.

## Neuroendocrine and immune factors
- HPA axis hyperactivity: raised cortisol, enlarged adrenal glands, and failure to suppress cortisol on the dexamethasone suppression test in about half of patients with severe melancholic depression. Early life stress programmes a more reactive axis.
- Thyroid: hypothyroidism causes depressive symptoms; T3 augments antidepressants.
- Inflammation: raised IL 6, TNF alpha and C reactive protein in a subgroup; interferon alpha treatment causes depression; anti inflammatory treatments help some patients with high inflammation.

## Brain circuits and sleep
- Imaging shows overactive amygdala and subgenual anterior cingulate (the target of deep brain stimulation studies), and underactive dorsolateral prefrontal cortex, the target of rTMS.
- Hippocampal volume is reduced with long, recurrent illness.
- Sleep changes: shortened REM latency, increased REM density, reduced slow wave sleep, early morning waking. Sleep deprivation briefly lifts mood.

## Psychological theories
- Psychodynamic: Freud's "Mourning and Melancholia" saw depression as anger at a lost love object turned inward; Bowlby linked depression to early separation and insecure attachment.
- Cognitive (Aaron Beck): negative schemas formed in childhood are activated by matching stress and produce the cognitive triad (negative views of self, world and future) through errors such as overgeneralisation and personalisation.
- Learned helplessness and hopelessness (Seligman; Abramson): uncontrollable events and an internal, stable, global attributional style lead to passivity and hopelessness.
- Behavioural (Lewinsohn): loss of response contingent positive reinforcement leads to withdrawal, which further reduces reinforcement.
- Response styles (Susan Nolen-Hoeksema): rumination prolongs and deepens depression and may explain part of the gender gap.
- Interpersonal: role transitions, disputes, grief and isolation, the focus of interpersonal therapy.

## Social theories
- Brown and Harris, in their study of women in Camberwell, London, described provoking agents (severe life events, especially loss and humiliation) and vulnerability factors: loss of mother before age 11, three or more children under 14 at home, lack of a confiding relationship, and no employment outside the home.
- Poverty, unemployment, debt, migration, discrimination and intimate partner violence all raise risk.
- In India, risk factors include domestic violence, dowry related conflict, farmer distress, academic pressure and the burden of chronic physical illness; protective factors include family cohesion and religious practice.
- Childhood maltreatment roughly doubles the risk and predicts chronic course and poor treatment response.

## Integration
| Level | Vulnerability | Trigger | Maintaining factor |
| Biological | Genes, early stress programming of HPA axis | Illness, postpartum hormonal change, drugs | Inflammation, poor sleep |
| Psychological | Negative schemas, insecure attachment | Loss, humiliation | Rumination, avoidance |
| Social | Childhood adversity, poverty | Severe life events | Isolation, violence |

The diathesis stress model ties these together. Kendler's work showed that the first episodes are usually triggered by stress, while later episodes need less stress (kindling), suggesting that the illness changes the brain's sensitivity.

## Conclusion
Depression is a final common pathway of many routes. Biological theories explain the bodily symptoms and treatment effects; psychological theories explain content, maintenance and therapy targets; social theories explain who becomes ill and when. Good assessment and treatment address all three levels.`,
    keyPoints: ["Indian prevalence from NMHS", "Heritability and gene environment findings with replication caveat", "Monoamine hypothesis with evidence and limits", "Neurotrophic hypothesis and ketamine", "HPA axis and dexamethasone suppression", "Beck, helplessness, Lewinsohn, rumination", "Brown and Harris four vulnerability factors", "Kindling and integration"],
    pitfalls: ["Presenting depression as a chemical imbalance only", "Omitting social causes", "Listing theories without evidence"],
    visuals: [
      vis("stress", { caption: "Chronic stress keeps the HPA axis switched on; high cortisol damages hippocampal feedback." }),
      vis("hypnogram", { caption: "" }),
      cycle("Lewinsohn's behavioural loop", [["Low mood", ""], ["Withdrawal", "Stops activities"], ["Fewer rewards", "Less positive reinforcement"], ["Lower mood", "Confirms the pattern"]]),
    ],
    module: "depression",
    ref: "Kaplan mood disorders chapter; Stahl ch 6 mood disorders; Brown and Harris 1978; Sullivan 2000 heritability; NMHS 2016; Border 2019 5-HTTLPR",
  },
  {
    id: "psyp-l04-002",
    subject: "psychopathology",
    topic: "cognitive-models",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "mcp-entrance", "ugc-net"],
    question: "Describe and critically evaluate Beck's cognitive model of depression.",
    plan: ["Introduce Beck and the three levels of cognition", "Cognitive triad and schemas", "Cognitive errors with examples", "Evidence for", "Critique", "Conclusion with treatment link"],
    answer: `## Introduction
Aaron Beck, while studying the dreams of depressed patients in the 1960s, found that their thinking was full of negative themes rather than hidden anger. He proposed that depression is caused and maintained by biased thinking, and developed cognitive therapy on this basis.

## Levels of cognition
- Schemas and core beliefs: deep, stable structures formed in childhood ("I am unlovable", "I am a failure").
- Dysfunctional assumptions or rules: conditional beliefs ("If I am not perfect, people will reject me").
- Negative automatic thoughts: quick, plausible, involuntary thoughts in situations ("They think I am stupid").

## Cognitive triad
Negative views of the self (worthless, inadequate), the world (unfair, demanding) and the future (hopeless). Hopelessness about the future is the strongest predictor of suicide.

## Cognitive errors
| Error | Example |
| Arbitrary inference | "She didn't smile, so she dislikes me" |
| Selective abstraction | Focusing on one critical remark among many compliments |
| Overgeneralisation | "I failed one test; I fail at everything" |
| Magnification and minimisation | Exaggerating mistakes, discounting successes |
| Personalisation | "The team lost because of me" |
| Dichotomous thinking | "If I am not first, I am useless" |

## Diathesis stress logic
Schemas lie dormant until activated by a matching event (for example, a rejection for someone whose schema is about being unlovable). Once activated they bias attention, interpretation and memory, producing a downward spiral.

## Evidence for
- Depressed patients show more negative automatic thoughts and attributional biases on questionnaires such as the Dysfunctional Attitudes Scale.
- Experimental studies show attention and memory biases for negative material.
- Cognitive therapy is as effective as antidepressants for mild to moderate depression and reduces relapse after it ends.
- Some prospective studies show negative cognitive style predicts later depression after stress.

## Critique
- Many negative cognitions disappear on recovery, suggesting they may be symptoms rather than causes ("state" rather than "trait").
- Depressive realism: mildly depressed people sometimes judge control more accurately than non depressed people.
- The model underplays biology, social adversity and emotion; schemas are hard to measure directly.
- Mediation studies suggest change in thinking is not the only route to improvement: behavioural activation alone works as well as full cognitive therapy.
- Cultural fit: some Indian patients express distress through the body and family relationships rather than thought content, so the model needs adaptation.

## Conclusion
Beck's model is one of the most influential and testable theories of depression. It explains how negative thinking maintains depression and gives clear targets for therapy, though its causal claims are partly supported and need integration with biological and social factors.`,
    keyPoints: ["Three levels of cognition", "Cognitive triad", "At least five cognitive errors with examples", "Schema activation by matching stress", "Evidence including therapy outcomes", "State versus trait critique and depressive realism", "Cultural adaptation"],
    visuals: [
      vis("thoughtrecord", {
        situation: "My manager did not greet me this morning.",
        thought: "She thinks I am useless and will fire me.",
        emotion: "low and anxious",
        traps: [
          { label: "Mind reading", right: true, why: "You are guessing her thoughts without evidence." },
          { label: "Catastrophising", right: true, why: "Jumping from no greeting to losing the job." },
          { label: "Emotional reasoning", why: "Close, but the thought is about her mind, not your feelings as proof." },
        ],
        forEvidence: ["She did not look at me."],
        againstEvidence: ["She was on a phone call.", "She praised my report last week."],
        balanced: "She was busy. One missed greeting says little about my job.",
      }),
    ],
    module: "depression",
    ref: "Beck 1967, 1979 Cognitive Therapy of Depression; Alloy and Abramson depressive realism; Jacobson 1996 component analysis",
  },
  {
    id: "psyp-l04-003",
    subject: "psychopathology",
    topic: "learning-models",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "mcp-entrance", "ugc-net"],
    question: "Write short notes on the learned helplessness and hopelessness theories of depression.",
    plan: ["Original experiments", "Attributional reformulation", "Hopelessness theory", "Evaluation"],
    answer: `## Original theory
Martin Seligman and Steven Maier found that dogs given inescapable shocks later failed to escape shocks they could avoid, while dogs that could control the shocks learned to escape. Seligman proposed that people who learn that outcomes are independent of their actions become passive, sad and slow to learn, resembling depression.

## Attributional reformulation
Abramson, Seligman and Teasdale added that what matters is how a person explains bad events. A depressive attributional style explains failures as:
- Internal ("it's my fault") rather than external.
- Stable ("it will always be like this") rather than temporary.
- Global ("it affects everything") rather than specific.
The Attributional Style Questionnaire measures this.

## Hopelessness theory
Abramson, Metalsky and Alloy proposed a subtype, hopelessness depression, caused by the expectation that bad outcomes will occur, good ones will not, and nothing can change. Stable and global attributions for negative events, plus inferences about consequences and the self, lead to hopelessness. Hopelessness is a strong predictor of suicide.

## Evaluation
- Supported by experiments and by prospective studies showing that negative attributional style predicts depression after stress.
- Helplessness in animals is closer to stress reactions than to the full human syndrome.
- Later neuroscience work by Maier and Seligman reversed the original idea: passivity is the default response to prolonged stress, and what is learned is control, through the medial prefrontal cortex inhibiting the dorsal raphe nucleus.
- The theories inform cognitive therapy and resilience training.

## Conclusion
Helplessness and hopelessness theories explain why perceived lack of control and pessimistic explanations deepen depression, and why hopelessness must be assessed for suicide risk.`,
    keyPoints: ["Seligman and Maier experiment", "Internal, stable, global attributions", "Hopelessness theory", "Link to suicide", "Later reversal: control is learned", "Treatment relevance"],
    module: "depression",
    ref: "Seligman and Maier 1967; Abramson, Seligman, Teasdale 1978; Abramson, Metalsky, Alloy 1989; Maier and Seligman 2016",
  },
  {
    id: "psyp-l04-004",
    subject: "psychopathology",
    topic: "persistent-depressive",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "mcp-entrance", "md-psychiatry"],
    question: "Write short notes on persistent depressive disorder (dysthymia).",
    plan: ["Definition and DSM-5-TR criteria", "Specifiers and double depression", "Epidemiology and course", "Treatment"],
    answer: `## Definition
Persistent depressive disorder is a chronic depression lasting at least two years in adults (one year in children and adolescents, in whom mood may be irritable). DSM-5 merged the older categories of dysthymic disorder and chronic major depressive disorder into this one diagnosis.

## DSM-5-TR criteria
- Depressed mood for most of the day, on more days than not, for at least two years.
- Two or more of: poor appetite or overeating, insomnia or hypersomnia, low energy or fatigue, low self esteem, poor concentration or difficulty making decisions, feelings of hopelessness.
- During the two years, the person has never been without the symptoms for more than two months at a time.
- Criteria for major depression may be continuously present.
- No mania or hypomania; not better explained by psychosis, substances or medical illness.

## Specifiers
With pure dysthymic syndrome, with persistent major depressive episode, with intermittent major depressive episodes; early onset (before 21) or late onset; with anxious distress or atypical features. "Double depression" refers to a major depressive episode superimposed on dysthymia.

## Epidemiology and course
Twelve month prevalence is about 0.5 percent for the dysthymic form and 1.5 percent for chronic major depression. It often begins early and insidiously, and patients may say "I have always been like this", so it can be mistaken for personality. It carries high comorbidity with anxiety, substance use and personality disorders and a poorer outcome than episodic depression.

## Treatment
Combined antidepressant and psychotherapy is more effective than either alone. The Cognitive Behavioral Analysis System of Psychotherapy (CBASP), developed by McCullough specifically for chronic depression, focuses on interpersonal consequences of behaviour. Longer treatment is needed.

## Conclusion
Persistent depressive disorder is common, disabling and under recognised; it should be treated actively rather than accepted as temperament.`,
    keyPoints: ["Two years adults, one year youth", "Two of six symptoms", "Never symptom free for more than two months", "Merger of dysthymia and chronic MDD", "Double depression", "Combined treatment and CBASP"],
    module: "depression",
    ref: "DSM-5-TR persistent depressive disorder; Keller 2000 CBASP trial",
  },
  {
    id: "psyp-l04-005",
    subject: "psychopathology",
    topic: "peripartum",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Write short notes on peripartum (postpartum) depression.",
    plan: ["Definition and timing", "Epidemiology including India and contrast with blues and psychosis", "Risk factors and screening", "Treatment"],
    answer: `## Definition
DSM-5-TR uses the specifier "with peripartum onset" when a major depressive episode begins during pregnancy or within four weeks after delivery; in practice clinicians consider onset in the first year. About half of "postpartum" episodes start during pregnancy.

## Epidemiology
Postpartum depression affects about 10 to 15 percent of mothers worldwide, and Indian meta analyses report about one in five, with wide variation by region.

| Condition | Frequency | Onset | Features |
| Baby blues | 50 to 80 percent | Days 3 to 5 | Tearful, labile; settles in two weeks |
| Postpartum depression | 10 to 20 percent | Weeks to months | Full depressive episode, guilt about mothering |
| Postpartum psychosis | 1 to 2 per 1000 | First two weeks | Confusion, mood and psychotic symptoms; emergency |

## Risk factors
Past depression or bipolar disorder, depression in pregnancy, poor marital support, domestic violence, unplanned pregnancy, preterm or sick infant, and in India, the birth of a girl child when a son was wanted and conflict with in laws. The Edinburgh Postnatal Depression Scale (ten items, cut off around 10 to 13) is a widely used screen, available in many Indian languages.

## Treatment
- Mild to moderate: psychological therapy, including the Thinking Healthy Programme, a CBT based approach delivered by community health workers in South Asia.
- Moderate to severe: antidepressants; sertraline is commonly preferred in breastfeeding because of low milk levels.
- In the USA, brexanolone (intravenous) and oral zuranolone, both acting on GABA A receptors, are approved for postpartum depression.
- Assess suicide and infanticide risk, mother infant bonding and infant care; involve the family.

## Conclusion
Postpartum depression is common, harmful to mother and child, and treatable. Routine screening in antenatal and postnatal care is essential.`,
    keyPoints: ["DSM-5-TR four week specifier", "Prevalence globally and in India", "Comparison with blues and psychosis", "Risk factors including Indian ones", "EPDS screening", "Treatment including sertraline and zuranolone"],
    module: "depression",
    ref: "DSM-5-TR peripartum specifier; Upadhyay 2017 Indian meta-analysis; Rahman 2008 Thinking Healthy; FDA zuranolone 2023",
  },
  {
    id: "psyp-l04-006",
    subject: "psychopathology",
    topic: "bereavement",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Compare and contrast normal grief, major depression and prolonged grief disorder.",
    plan: ["Define normal grief and its course", "Explain the removal of the bereavement exclusion", "Key differences between grief and depression", "Prolonged grief disorder criteria in both systems", "Assessment and treatment", "Conclusion"],
    answer: `## Normal grief
Grief is the natural response to the death of someone close. It includes waves of yearning, sadness, crying, sleep and appetite change, preoccupation with the dead person and, at times, brief hearing or seeing of the deceased. Intensity usually lessens over months, though anniversaries bring it back. Cultural rituals, such as the Hindu thirteen day mourning period, help structure it.

## The bereavement exclusion
DSM-IV did not diagnose major depression in the first two months after a death unless certain severe features were present. DSM-5 removed this exclusion because depression after a death resembles depression after other losses, responds to treatment, and carries risk. Clinicians must now judge whether a full depressive episode is present on top of grief.

## Differences between grief and depression
| Feature | Grief | Major depression |
| Main feeling | Emptiness and loss | Persistent low mood and loss of pleasure |
| Pattern | Comes in waves (pangs), triggered by reminders | Pervasive, not tied to reminders |
| Humour and pleasure | Still possible | Usually absent |
| Self esteem | Preserved | Worthlessness and self loathing |
| Guilt | About the deceased (things not said) | General guilt and failure |
| Thoughts of death | Wishing to join the deceased | Feeling undeserving of life, hopelessness |
| Function | Gradually returns | Persistent impairment |

## Prolonged grief disorder
- ICD-11: persistent and pervasive grief with longing for or preoccupation with the deceased, plus intense emotional pain (sadness, guilt, anger, denial, difficulty accepting the death, feeling one has lost part of oneself, inability to feel positive mood, emotional numbness, difficulty engaging), lasting at least six months and clearly beyond cultural norms, with significant impairment.
- DSM-5-TR: at least twelve months since the death (six months in children), with intense yearning or preoccupation nearly every day for the last month, plus at least three of eight symptoms: identity disruption, marked disbelief, avoidance of reminders, intense emotional pain, difficulty reintegrating into life, emotional numbness, feeling life is meaningless, and intense loneliness.
Prevalence is about 7 to 10 percent of bereaved adults, higher after sudden or violent deaths (suicide, accidents, COVID 19 deaths without rituals).

## Assessment
Ask about the relationship, circumstances of death, rituals, support, suicidal ideas, substance use and previous loss. The Inventory of Complicated Grief and the PG 13 are useful tools.

## Treatment
- Normal grief: support and information; no medicines.
- Major depression after bereavement: standard treatment with antidepressants and psychotherapy.
- Prolonged grief disorder: grief focused therapy such as Katherine Shear's complicated grief treatment, which combines loss focused and restoration focused work (based on Stroebe and Schut's dual process model); antidepressants alone are less effective on grief symptoms.

## Conclusion
Grief is not an illness, but it can coexist with depression or become prolonged and disabling. Careful phenomenology separates the three and guides treatment.`,
    keyPoints: ["Normal grief features and cultural rituals", "Removal of bereavement exclusion and reason", "At least five differences in a table", "ICD-11 six months criteria", "DSM-5-TR twelve months and eight symptoms", "Risk after sudden or violent death", "Complicated grief treatment and dual process model"],
    visuals: [compare("Grief or depression?", ["Grief", ["Pangs triggered by reminders", "Humour still possible", "Self esteem intact", "Wish to join the deceased"], "Painful but healthy"], ["Major depression", ["Pervasive low mood", "No pleasure", "Worthlessness", "Hopelessness and suicidal ideas"], "Needs treatment"])],
    module: "depression",
    ref: "DSM-5-TR MDD bereavement note and prolonged grief disorder; ICD-11 6B42; Shear 2014 CGT trial; Stroebe and Schut 1999",
  },
  {
    id: "psyp-l04-007",
    subject: "psychopathology",
    topic: "pseudodementia",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Write short notes on depressive pseudodementia.",
    plan: ["Definition and history", "Comparison with dementia", "Assessment", "Outcome and management"],
    answer: `## Definition
Depressive pseudodementia, a term popularised by Kiloh in 1961, describes cognitive impairment in an older person that is caused by depression and improves when the depression is treated. Many now prefer "depression related cognitive impairment", because the deficits are real.

## Comparison with dementia
| Feature | Depressive pseudodementia | Dementia (for example Alzheimer) |
| Onset | Relatively sudden, can be dated | Insidious |
| Course | Short history, rapid progression | Slow progression |
| Past history | Previous depression common | Usually none |
| Complaints | Emphasises and complains about memory loss | Often unaware, minimises |
| Test answers | "I don't know", poor effort | Near misses, confabulation, tries hard |
| Mood | Depressed mood precedes cognitive loss | Mood changes later or shallow |
| Pattern | Variable, patchy | Consistent recent memory loss |
| Night worsening | Uncommon | Common |

## Assessment
History from family, mood rating (Geriatric Depression Scale), cognitive testing (MMSE, MoCA) repeated after treatment, and tests for thyroid, B12, and imaging to rule out vascular or other causes.

## Outcome and management
Treat depression with an antidepressant well tolerated in older adults (sertraline, escitalopram or mirtazapine), or ECT if severe. Cognition often improves, but follow up is needed: a substantial proportion later develop dementia, so depression in late life may be an early sign of neurodegeneration.

## Conclusion
Depression can mimic dementia. Recognising it gives a treatable target, but long term monitoring is necessary.`,
    keyPoints: ["Definition and Kiloh", "Table of at least five differences", "Don't know answers versus near misses", "Work up for reversible causes", "Treatment and later dementia risk"],
    module: "neurocognitive",
    ref: "Kiloh 1961; Wells 1979 differentiating features; Kaplan geriatric psychiatry",
  },
  {
    id: "psyp-l04-008",
    subject: "psychopathology",
    topic: "mdd-criteria",
    marks: 10,
    difficulty: 1,
    exams: ["ma-semester", "mcp-entrance", "md-psychiatry"],
    question: "Describe the clinical features of a major depressive episode and the DSM-5-TR criteria for major depressive disorder, with its specifiers.",
    plan: ["Introduce MDD and its burden", "Clinical features across four domains", "DSM-5-TR criteria A to E", "Specifiers grouped", "ICD-11 differences and conclusion"],
    answer: `## Introduction
Major depressive disorder (MDD) is defined by one or more major depressive episodes without a history of mania or hypomania. It is a leading cause of disability and a major risk factor for suicide.

## Clinical features
- Emotional: persistent sadness, emptiness, irritability (common in adolescents), loss of interest and pleasure, anxiety.
- Cognitive: worthlessness, guilt, hopelessness, poor concentration and indecision, thoughts of death and suicide; in severe cases delusions of guilt, poverty or nihilism.
- Biological (somatic): reduced or increased sleep, early morning waking, reduced or increased appetite and weight, fatigue, loss of libido, diurnal variation of mood.
- Behavioural: psychomotor retardation or agitation, social withdrawal, neglect of self care.
In India, patients often present with bodily complaints (aches, weakness, "gas", burning) and may not use the word depression.

## DSM-5-TR criteria
- A: five or more of the following nine symptoms in the same two week period, representing a change, with at least one being depressed mood or loss of interest or pleasure:
- Depressed mood most of the day, nearly every day.
- Markedly diminished interest or pleasure.
- Significant weight loss or gain (about 5 percent in a month) or appetite change.
- Insomnia or hypersomnia.
- Psychomotor agitation or retardation observable by others.
- Fatigue or loss of energy.
- Feelings of worthlessness or excessive guilt.
- Diminished ability to think, concentrate or decide.
- Recurrent thoughts of death, suicidal ideas, a plan or an attempt.
- B: clinically significant distress or impairment.
- C: not due to a substance or another medical condition.
- D: not better explained by schizoaffective disorder or other psychotic disorders.
- E: there has never been a manic or hypomanic episode.
A note advises careful judgement when the episode follows a significant loss such as bereavement.

## Specifiers
| Group | Specifiers |
| Course | Single episode or recurrent; in partial or full remission |
| Severity | Mild, moderate, severe |
| Features | With anxious distress, mixed features, melancholic features, atypical features, psychotic features (mood congruent or incongruent), catatonia |
| Timing | With peripartum onset, with seasonal pattern |

## ICD-11 differences
ICD-11 describes single episode and recurrent depressive disorder, uses a cluster approach (affective, cognitive behavioural and neurovegetative) requiring at least five of ten symptoms with one from mood or interest, rates severity by the number and intensity of symptoms, and includes "hopelessness" as a symptom.

## Conclusion
Major depression is defined by a clear pattern of emotional, cognitive and somatic symptoms for at least two weeks, with impairment and no history of mania. Specifiers guide treatment, such as antipsychotic augmentation for psychotic features or ECT for catatonia.`,
    keyPoints: ["Four domains of clinical features", "Five of nine for two weeks with mood or interest", "All nine symptoms correctly listed", "Exclusion of mania and hypomania", "Bereavement note", "Specifiers grouped", "ICD-11 differences", "Somatic presentation in India"],
    visuals: [tree("Depressive episode specifiers", [["Major depressive episode", "", -1], ["Features", "", 0], ["Melancholic", "", 1], ["Atypical", "", 1], ["Psychotic", "", 1], ["Anxious distress, mixed, catatonia", "", 1], ["Timing", "", 0], ["Peripartum onset", "", 6], ["Seasonal pattern", "", 6]])],
    module: "depression",
    ref: "DSM-5-TR MDD criteria and specifiers; ICD-11 6A70",
  },
  {
    id: "psyp-l04-009",
    subject: "psychopathology",
    topic: "mdd-case",
    marks: 15,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "A 45-year-old schoolteacher from Surat has had low mood, early morning waking, loss of weight and guilt for two months. She says she has been a burden on her family and would be better off dead. She has hypothyroidism and her husband works abroad. Formulate the case and plan the management.",
    plan: ["Summary and diagnosis with differentials", "Assessment including risk and thyroid", "Formulation", "Management by phase including suicide safety", "Follow up, relapse prevention and prognosis"],
    answer: `## Summary and diagnosis
A middle aged woman with two months of depressed mood, early morning waking, weight loss and guilt, with passive death wishes, in the context of hypothyroidism and separation from her husband. Provisional diagnosis: major depressive disorder, single episode, at least moderate, possibly with melancholic features.

Differential diagnosis:
- Depressive disorder due to hypothyroidism, or under treated hypothyroidism.
- Bipolar depression (ask about past hypomania and family history).
- Adjustment disorder (less likely, since full criteria are met).
- Perimenopausal mood change and alcohol or medication effects.
- Early dementia or psychotic depression (look for delusions of guilt).

## Assessment
- History: onset, stressors, past episodes, mania screen, family history, substance use, physical illness and medicines (thyroxine dose, adherence).
- Suicide risk: thoughts, plans, preparations, past attempts, access to means (stored medicines, pesticides), hopelessness, protective factors (children, faith). Ask directly; asking does not increase risk.
- Mental status examination: psychomotor change, delusions, insight.
- Investigations: TSH and free T4, blood count, glucose, B12, vitamin D, electrolytes; ECG if a tricyclic is considered.
- Ratings: PHQ 9 or the Hamilton Depression Rating Scale; Beck Scale for Suicide Ideation.

## Formulation
- Predisposing: female, middle age, possible family history, perfectionistic teacher role, chronic thyroid illness.
- Precipitating: husband's move abroad leaving her as sole caregiver; possible thyroid imbalance.
- Perpetuating: loneliness, sleep loss, guilt and rumination, stigma about seeking help.
- Protective: children, stable job, help seeking, possibly religious faith.

## Management
Immediate safety:
- If there is a plan, intent or poor support, consider admission (independent admission under section 85 of the MHCA 2017 if she agrees).
- Otherwise outpatient care with a safety plan: remove means, a family member to stay with her, emergency contacts including Tele MANAS (14416), and review within a week.

Biological:
- Correct thyroid function with the physician.
- Start an SSRI, for example sertraline 50 mg, increasing to 100 mg; or escitalopram 10 mg. Dispense limited quantities.
- Warn of early side effects and of possible early agitation; review in one to two weeks.
- Judge response at four to six weeks; if partial, optimise dose, then switch or augment (lithium, aripiprazole, or T3).
- ECT if she stops eating, becomes psychotic or suicide risk is high.

Psychological:
- Psychoeducation on depression as an illness.
- CBT or behavioural activation; interpersonal therapy focusing on role transition (husband abroad) is a good fit.
- Sleep hygiene and gradual activity scheduling.

Social:
- Involve the husband by video, and the wider family.
- Medical leave from school if needed; plan a graded return.

## What to tell the family
- Depression is an illness of mood, sleep and thinking, not a weakness or a lack of faith.
- Antidepressants are not addictive, take two to four weeks to work, and must not be stopped suddenly.
- Her wish to die is a symptom; they should not leave her alone in a crisis, should keep medicines locked, and should call for help early.
- Small daily routines, meals together and calls from her husband help recovery.

## Continuation and maintenance
Continue the antidepressant for at least six to twelve months after remission for a first episode; longer if recurrent. Plan relapse warning signs. Monitor thyroid every few months.

## Prognosis
Good factors: acute onset, good premorbid functioning, help seeking. Risk factors: suicidal ideas, chronic medical illness, isolation.

## Conclusion
This is a moderate to severe depressive episode with suicidal ideas and a medical contributor. Safety first, correction of thyroid function, an SSRI with psychotherapy, and family support form the plan.`,
    keyPoints: ["Diagnosis with severity and possible melancholic features", "Thyroid and bipolar differentials", "Detailed suicide risk assessment", "Investigations including TSH", "5 Ps formulation", "Safety plan and MHCA admission option", "SSRI with dose, review and next steps", "Psychotherapy matched to role transition and maintenance duration"],
    pitfalls: ["Not asking directly about suicide", "Ignoring the thyroid", "Starting an antidepressant without a mania screen", "No duration of continuation treatment"],
    visuals: [timeline("Treatment timeline for a first depressive episode", [["Assess risk and start SSRI", "Week 0"], ["Early review for side effects and risk", "Weeks 1 to 2"], ["Judge response, adjust", "Weeks 4 to 6"], ["Remission", "Weeks 8 to 12"], ["Continue treatment", "6 to 12 months after remission"]])],
    module: "depression",
    ref: "NICE NG222 depression; Maudsley antidepressant choice; MHCA 2017 s85; Tele MANAS",
  },
  {
    id: "psyp-l04-010",
    subject: "psychopathology",
    topic: "mood-specifiers",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Write short notes on melancholic and atypical features of depression.",
    plan: ["Define each specifier", "Criteria", "Comparison table", "Treatment implications"],
    answer: `## Melancholic features
The DSM-5-TR specifier requires, during the most severe period, loss of pleasure in all or almost all activities, or lack of reactivity to usually pleasurable events, plus three or more of:
- A distinct quality of depressed mood (profound despair, emptiness).
- Depression regularly worse in the morning.
- Early morning waking, at least two hours before usual.
- Marked psychomotor retardation or agitation.
- Significant anorexia or weight loss.
- Excessive or inappropriate guilt.
It corresponds to the older "endogenous" depression.

## Atypical features
Requires mood reactivity (mood brightens in response to positive events) plus two or more of:
- Significant weight gain or increased appetite.
- Hypersomnia.
- Leaden paralysis (heavy feeling in arms and legs).
- A long standing pattern of sensitivity to interpersonal rejection.
Criteria for melancholic or catatonic features must not be met.

## Comparison
| Feature | Melancholic | Atypical |
| Mood reactivity | Absent | Present |
| Sleep | Early waking | Excess sleep |
| Appetite | Loss | Gain |
| Diurnal variation | Worse in morning | Often worse in evening |
| Associations | Older age, HPA hyperactivity, severe | Younger, female, bipolar II, rejection sensitivity |

## Treatment implications
Melancholic depression responds well to biological treatments, including tricyclics, SNRIs and ECT, and less well to placebo. Atypical depression responded better to MAOIs than tricyclics in older trials; today SSRIs are used, and bipolarity should be checked.

## Conclusion
Both specifiers describe meaningful subtypes with different biology and treatment response.`,
    keyPoints: ["Melancholic core and three of six", "Atypical core of mood reactivity and two of four", "Leaden paralysis and rejection sensitivity", "Comparison table", "Treatment implications including ECT and MAOIs"],
    module: "depression",
    ref: "DSM-5-TR melancholic and atypical specifiers; Quitkin MAOI trials",
  },
]);
