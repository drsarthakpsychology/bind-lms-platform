import type { LongQA } from "@/lib/prep/long-types";
import { anchored, brain, chain, compare, cycle, tree } from "./visual";

export const PSYCHOPATHOLOGY_L06: LongQA[] = anchored([
  {
    id: "psyp-l06-001",
    subject: "psychopathology",
    topic: "ocd-phenomenology",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Describe the phenomenology and clinical features of obsessive compulsive disorder.",
    plan: ["Define obsessions and compulsions with their classical features", "Common symptom dimensions with examples", "DSM-5-TR criteria and specifiers", "Epidemiology, course and comorbidity", "Assessment with Y-BOCS; differential diagnosis", "Conclusion"],
    answer: `## Obsessions
Obsessions are recurrent, persistent thoughts, urges or images that are experienced as intrusive and unwanted, and cause marked anxiety or distress. Classical features (from Lewis and Schneider):
- Recognised as the product of one's own mind (unlike thought insertion).
- Experienced as senseless, excessive or repugnant (ego dystonic).
- Resisted, at least initially, though resistance may fade in chronic illness.
They may be thoughts (doubts), images (violent scenes), impulses (to shout in a temple), ruminations or fears.

## Compulsions
Repetitive behaviours (washing, checking, ordering) or mental acts (counting, praying, repeating words) that the person feels driven to perform in response to an obsession or according to rigid rules. They aim to reduce distress or prevent a feared event, but are not realistically connected to it or are clearly excessive. Relief is short lived, so the behaviour is reinforced.

## Symptom dimensions
| Dimension | Obsession | Compulsion |
| Contamination | Germs, dirt, bodily fluids, "impurity" | Washing, bathing, avoiding |
| Harm and responsibility | "Did I leave the gas on?", fear of harming a child | Checking, reassurance seeking |
| Unacceptable thoughts | Sexual, religious (blasphemy), violent images | Mental rituals, prayer, neutralising |
| Symmetry and order | Need for "just right" feeling | Arranging, counting, repeating |
| Hoarding | Now a separate disorder | Saving, not discarding |
In India, religious and contamination themes are common, often tied to ideas of ritual purity, and sexual obsessions are frequently hidden because of shame.

## DSM-5-TR criteria
- Obsessions, compulsions or both.
- Time consuming (more than one hour a day) or causing clinically significant distress or impairment.
- Not due to substances or medical conditions, and not better explained by another disorder.
- Specifiers: insight (good or fair, poor, absent insight or delusional beliefs) and tic related.
OCD now heads a separate chapter of obsessive compulsive and related disorders (body dysmorphic, hoarding, trichotillomania, excoriation).

## Epidemiology and course
Lifetime prevalence is about 2 to 3 percent; the Indian National Mental Health Survey found about 0.8 percent lifetime. Onset is bimodal: childhood (more boys, tic related) and early adulthood. The course is usually chronic and waxing and waning; average delay to treatment is often more than ten years. Comorbidity: depression (in up to two thirds), other anxiety disorders, tics and obsessive compulsive personality traits.

## Assessment
The Yale Brown Obsessive Compulsive Scale (Y-BOCS) has a symptom checklist and ten items scored 0 to 4 (total 0 to 40); 16 or more indicates clinically significant OCD. Ask about avoidance, family accommodation and insight.

## Differential diagnosis
Generalised anxiety disorder (worries are realistic and less ego dystonic), depressive rumination, obsessive compulsive personality disorder (traits are ego syntonic), psychosis (thought insertion, no resistance), tics (no preceding obsession), and autism (restricted interests are enjoyed).

## Conclusion
OCD is defined by ego dystonic obsessions and neutralising compulsions. Recognising its symptom dimensions and insight level guides treatment with exposure and response prevention and SSRIs.`,
    keyPoints: ["Definition of obsessions with ownership, senselessness and resistance", "Definition of compulsions including mental acts", "Four main symptom dimensions with examples", "DSM-5-TR one hour rule and insight specifier", "Prevalence including India", "Y-BOCS scoring", "Differential from OCPD, psychosis and GAD"],
    visuals: [cycle("How a compulsion is reinforced", [["Obsession", "I may be contaminated"], ["Anxiety", "Rises sharply"], ["Compulsion", "Wash hands again"], ["Brief relief", "Anxiety falls"], ["Belief strengthened", "Washing kept me safe"]], "Exposure and response prevention breaks the loop at the compulsion.")],
    module: "ocd",
    ref: "DSM-5-TR OCD; Goodman 1989 Y-BOCS; NMHS 2016; Fish obsessions",
  },
  {
    id: "psyp-l06-002",
    subject: "psychopathology",
    topic: "ocd-aetiology",
    marks: 15,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Discuss the aetiology of obsessive compulsive disorder, with reference to biological, behavioural and cognitive models.",
    plan: ["Introduce OCD as multifactorial", "Genetic and immunological factors", "Neurochemistry and the cortico-striato-thalamo-cortical circuit", "Behavioural model", "Cognitive models: Salkovskis, Rachman, OCCWG beliefs, metacognitive", "Integration and treatment implications"],
    answer: `## Introduction
OCD is a heterogeneous disorder with biological and psychological contributions. The best supported view links a vulnerable brain circuit to learned and cognitive processes that maintain symptoms.

## Genetic factors
- First degree relatives have about four times the risk, more if onset is in childhood.
- Twin heritability is about 40 to 50 percent.
- Genetic overlap exists with tic disorders, anxiety and anorexia nervosa. Candidate genes for glutamate signalling (SLC1A1) have been studied, but no gene of large effect is known.

## Immunological factors
PANDAS (paediatric autoimmune neuropsychiatric disorders associated with streptococcal infections) and the broader PANS describe sudden onset of OCD or tics in children after infection, thought to involve antibodies against basal ganglia. Sydenham chorea after rheumatic fever is often accompanied by OCD. The concept remains debated.

## Neurochemistry
- Serotonin: SSRIs and clomipramine, which block serotonin reuptake, work in OCD whereas noradrenergic antidepressants do not. Higher doses and longer trials are needed than in depression.
- Dopamine: antipsychotic augmentation helps some patients, especially with tics; stimulants can worsen symptoms.
- Glutamate: raised glutamate in cerebrospinal fluid in some studies; trials of memantine and N acetylcysteine show modest effects.

## Brain circuits
The cortico-striato-thalamo-cortical (CSTC) loop links the orbitofrontal cortex and anterior cingulate with the caudate nucleus and thalamus.
- In the model, a direct pathway that excites the thalamus is over active relative to the indirect inhibitory pathway, so worry signals ("something is wrong") cannot be switched off.
- Imaging shows increased activity in the orbitofrontal cortex, caudate and anterior cingulate at rest and on provocation, which falls after successful treatment with either SSRIs or behaviour therapy.
- Neurosurgical procedures (anterior capsulotomy, cingulotomy) and deep brain stimulation targeting this loop help some treatment resistant patients.
- Neuropsychology shows impaired cognitive flexibility, response inhibition and an over active error monitoring signal.

## Behavioural model
Based on Mowrer's two factor theory:
- Obsessions become anxiety provoking through conditioning.
- Compulsions and avoidance reduce anxiety and are negatively reinforced, which strengthens them and prevents learning that the feared outcome would not happen.
Rachman and Hodgson's work showed that anxiety falls naturally if the compulsion is delayed, which led to exposure and response prevention (Victor Meyer's work in the 1960s).

## Cognitive models
- Salkovskis: intrusive thoughts are almost universal (about 90 percent of people have them). OCD develops when a person appraises them as meaning he or she is responsible for harm. Inflated responsibility drives neutralising, which maintains the problem.
- Rachman: thought action fusion: the belief that thinking about an event makes it more likely (likelihood fusion) or that having a bad thought is morally equal to the act (moral fusion). Rachman also explained obsessions as catastrophic misinterpretations of the significance of intrusive thoughts.
- The Obsessive Compulsive Cognitions Working Group listed six belief domains: inflated responsibility, over importance of thoughts, need to control thoughts, overestimation of threat, intolerance of uncertainty, and perfectionism.
- Thought suppression: trying not to think a thought makes it return (Wegner's white bear studies).
- Metacognitive model (Wells): beliefs about the power of thoughts and the need for rituals.
- Inference based approach: obsessional doubt arises from distrust of one's senses in favour of possibilities.

| Model | Key mechanism | Treatment |
| Biological | CSTC loop over activity, serotonin | SSRIs, clomipramine, neuromodulation |
| Behavioural | Negative reinforcement of rituals | Exposure and response prevention |
| Cognitive | Appraisal of intrusions, responsibility | Cognitive therapy, behavioural experiments |

## Psychodynamic view
Freud linked obsessional neurosis to anal stage conflicts and to defences of isolation, undoing and reaction formation. It is of historical interest; there is little evidence for psychodynamic treatment of OCD.

## Integration
A genetically and neurodevelopmentally vulnerable CSTC circuit produces a strong, hard to switch off sense of danger or incompleteness. Normal intrusive thoughts are then appraised as meaningful and dangerous, and rituals bring relief and become habitual. Family accommodation (relatives joining rituals or giving reassurance, very common in Indian joint families) adds further reinforcement.

## Conclusion
OCD is best understood as an interaction between a dysfunctional fronto striatal circuit and learned and cognitive maintaining processes. This explains why SSRIs and exposure and response prevention both work, and why they work best together in severe cases.`,
    keyPoints: ["Family and twin figures", "PANDAS and Sydenham chorea", "Serotonin evidence from SSRIs and clomipramine", "CSTC loop and imaging changes after treatment", "Two factor behavioural model and ERP origin", "Salkovskis inflated responsibility", "Thought action fusion and OCCWG belief domains", "Integration with family accommodation"],
    pitfalls: ["Describing only biology", "Missing the near universality of intrusive thoughts", "Saying psychodynamic therapy is first line"],
    visuals: [
      brain("The OCD loop", { prefrontal: "Orbitofrontal cortex signals 'something is wrong'", "basal-ganglia": "Caudate fails to filter the worry signal", thalamus: "Relays the signal back to cortex, closing the loop", frontal: "Anterior cingulate adds the sense of error" }, "Activity in this loop falls after SSRIs or ERP."),
      chain("Salkovskis' cognitive model", [["Intrusive thought", "Almost everyone has them"], ["Appraisal", "If I think it, I am responsible"], ["Distress", "Anxiety and guilt"], ["Neutralising", "Rituals, reassurance, suppression"], ["Maintenance", "The appraisal is never tested"]]),
    ],
    module: "ocd",
    ref: "Kaplan OCD chapter; Stahl ch 9; Salkovskis 1985; Rachman 1997; OCCWG 1997; Saxena and Rauch 2000 CSTC; Meyer 1966",
  },
  {
    id: "psyp-l06-003",
    subject: "psychopathology",
    topic: "bdd",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Write short notes on body dysmorphic disorder.",
    plan: ["Definition and criteria", "Features and specifiers", "Epidemiology and risk", "Treatment"],
    answer: `## Definition
Body dysmorphic disorder (BDD) is preoccupation with one or more perceived defects or flaws in physical appearance that are not observable or appear slight to others. It was earlier called dysmorphophobia (Morselli).

## DSM-5-TR criteria
- Preoccupation with perceived flaws.
- At some point, repetitive behaviours (mirror checking, grooming, skin picking, reassurance seeking) or mental acts (comparing one's appearance with others) in response.
- Clinically significant distress or impairment.
- Not better explained by concerns about weight in an eating disorder.
Specifiers: with muscle dysmorphia (belief that one's body is too small or not muscular enough), and insight (good or fair, poor, absent or delusional).

## Features
Common concerns are skin, hair, nose and teeth. Patients spend hours a day thinking about the "defect", avoid social situations, use camouflage (makeup, caps), and seek dermatology and cosmetic surgery, which rarely helps and may worsen the preoccupation. Ideas of reference ("people are staring at my nose") are common. Suicidal ideation is high, and BDD is among the disorders with the highest suicide rates.

## Epidemiology
Point prevalence is about 2 percent, higher in dermatology and cosmetic surgery clinics (about 10 percent). Onset is usually in adolescence.

## Treatment
CBT with exposure and response prevention (reducing mirror checking and camouflage, exposure to social situations), perceptual retraining and cognitive restructuring. SSRIs at high doses are effective, even when insight is absent. Antipsychotic augmentation has limited evidence. Cosmetic procedures should generally be avoided.

## Conclusion
BDD is a hidden, distressing and high risk condition that clinicians in skin and surgery clinics should screen for.`,
    keyPoints: ["Definition with not observable or slight flaws", "Repetitive behaviours or mental acts", "Muscle dysmorphia and insight specifiers", "High suicide risk", "Cosmetic surgery unhelpful", "CBT with ERP and high dose SSRIs"],
    module: "ocd",
    ref: "DSM-5-TR BDD; Phillips on BDD suicidality",
  },
  {
    id: "psyp-l06-004",
    subject: "psychopathology",
    topic: "hoarding",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Write short notes on hoarding disorder.",
    plan: ["Definition and why it is separate from OCD", "Criteria", "Features and course", "Treatment"],
    answer: `## Definition
Hoarding disorder is persistent difficulty discarding or parting with possessions, regardless of their actual value, leading to clutter that congests living areas. It was a symptom of OCD and obsessive compulsive personality disorder until DSM-5 made it a separate disorder, because hoarding usually lacks intrusive obsessions, is ego syntonic, responds poorly to standard OCD treatment and has distinct brain findings.

## DSM-5-TR criteria
- Persistent difficulty discarding possessions.
- Due to a perceived need to save items and distress on discarding them.
- Accumulation that clutters active living areas and substantially compromises their use (unless others clear it).
- Clinically significant distress or impairment, including in maintaining a safe environment.
- Not due to a medical condition (brain injury, Prader-Willi syndrome) or another disorder.
Specifiers: with excessive acquisition, and insight level.

## Features and course
Prevalence is about 2 to 6 percent. It starts in adolescence and worsens with age, so most people seeking help are older. Items saved include papers, clothes, containers and sometimes animals (animal hoarding). Problems include fire risk, falls, poor hygiene, family conflict and eviction. Insight is often poor. Related information processing difficulties include indecision, categorisation problems and emotional attachment to objects.

## Treatment
Specialised CBT (Frost and Steketee) with motivational work, skills for sorting and decision making, exposure to discarding and resisting acquisition, often with home visits. SSRIs have limited benefit. Forced clean outs without consent cause distress and quick re-accumulation.

## Conclusion
Hoarding disorder is a distinct, chronic, often hidden condition, best helped with specialised CBT and collaborative work.`,
    keyPoints: ["Definition", "Reasons for separation from OCD", "Criteria including cluttered living areas", "Excessive acquisition specifier", "Course worsening with age and risks", "Specialised CBT; forced clean outs fail"],
    module: "ocd",
    ref: "DSM-5-TR hoarding disorder; Frost and Steketee",
  },
  {
    id: "psyp-l06-005",
    subject: "psychopathology",
    topic: "trichotillomania",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Write short notes on trichotillomania and other body-focused repetitive behaviours.",
    plan: ["Definitions of trichotillomania and excoriation disorder", "Clinical features and complications", "Mechanism", "Treatment with habit reversal"],
    answer: `## Definitions
Body focused repetitive behaviours (BFRBs) are repeated actions directed at one's own body that damage it. DSM-5-TR includes two in the obsessive compulsive and related disorders chapter:
- Trichotillomania (hair pulling disorder): recurrent pulling out of one's hair resulting in hair loss, with repeated attempts to stop, causing distress or impairment.
- Excoriation (skin picking) disorder: recurrent skin picking resulting in lesions, with the same criteria.
Nail biting and cheek biting are other examples.

## Clinical features
Hair is pulled from the scalp, eyebrows or eyelashes. Pulling may be focused (to relieve tension or an urge) or automatic (while reading or watching TV). There may be rituals with the hair, and some people eat it (trichophagia), which can cause a trichobezoar (hair ball) in the stomach. Prevalence is about 1 to 2 percent, more in women, with onset around puberty. Shame and camouflage (scarves, caps) are common, and patients often see dermatologists first.

## Mechanism
BFRBs are thought to regulate emotion and arousal (relieving tension or boredom), reinforced by relief and sometimes pleasure. They differ from OCD in that they are not driven by obsessions.

## Treatment
- Habit reversal training (Azrin and Nunn): awareness training, a competing response (making a fist for a minute), stimulus control (gloves, keeping hands busy) and social support.
- Comprehensive behavioural treatment and acceptance based approaches.
- Medicines: N acetylcysteine has some evidence; SSRIs have mixed results; clomipramine and olanzapine have small trials.

## Conclusion
Trichotillomania and skin picking are common, shameful and treatable; habit reversal is the treatment of choice.`,
    keyPoints: ["Definitions of both disorders", "Focused and automatic pulling", "Trichophagia and trichobezoar", "Emotion regulation mechanism", "Habit reversal components", "N acetylcysteine evidence"],
    module: "ocd",
    ref: "DSM-5-TR trichotillomania and excoriation; Azrin and Nunn 1973; Grant 2009 NAC trial",
  },
  {
    id: "psyp-l06-006",
    subject: "psychopathology",
    topic: "ptsd",
    marks: 20,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Discuss post-traumatic stress disorder: clinical features, diagnostic criteria, psychological and biological models, and management.",
    plan: ["Definition and history", "DSM-5-TR criteria and ICD-11 differences", "Epidemiology and risk factors including India", "Psychological models: conditioning, Ehlers and Clark, Brewin, emotional processing", "Biological findings", "Management with evidence and conclusion"],
    answer: `## Introduction
Post-traumatic stress disorder (PTSD) is a disorder that may follow exposure to an extremely threatening or horrific event. It was recognised after studies of war veterans ("shell shock", "combat fatigue") and was introduced in DSM-III in 1980.

## DSM-5-TR criteria
- A: exposure to actual or threatened death, serious injury or sexual violence, by direct experience, witnessing, learning that it happened to a close family member or friend (violent or accidental), or repeated exposure to aversive details (police, first responders).
- B: intrusion symptoms (one or more): intrusive memories, nightmares, flashbacks, distress at reminders, and bodily reactions to reminders.
- C: avoidance (one or more) of memories, thoughts and feelings, or of external reminders.
- D: negative changes in thinking and mood (two or more): amnesia for parts of the event, negative beliefs about self or world, distorted blame, persistent negative emotions (fear, horror, guilt, shame), loss of interest, detachment, and inability to feel positive emotions.
- E: changes in arousal and reactivity (two or more): irritability and anger, reckless or self destructive behaviour, hypervigilance, exaggerated startle, poor concentration, and sleep disturbance.
- F: duration more than one month; G: distress or impairment; H: not due to substances or illness.
Specifiers: with dissociative symptoms (depersonalisation or derealisation) and with delayed expression (full criteria not met until six months after the event). There are separate criteria for children aged six and under.

ICD-11 uses a narrower definition with three core elements: re-experiencing the event in the present (vivid intrusive memories, flashbacks or nightmares with strong emotion), avoidance, and a persistent sense of current threat (hypervigilance, startle). It adds complex PTSD for prolonged or repeated trauma.

## Epidemiology and risk factors
Most people are exposed to at least one traumatic event in life, but only a minority develop PTSD; lifetime prevalence is about 4 to 8 percent in Western surveys. Risk is highest after rape, torture and combat. Risk factors:
- Before the event: female sex, previous trauma, childhood adversity, prior mental illness, low intelligence, family history.
- During the event: severity, perceived threat to life, peritraumatic dissociation, physical injury.
- After the event: lack of social support, further stress, and negative appraisals (the strongest predictors).
In India, PTSD has been studied after the 2001 Gujarat earthquake, the 2004 tsunami, floods, terror attacks, communal violence, road traffic accidents and in survivors of sexual violence and acid attacks. Services include NIMHANS led psychosocial support in disasters and the National Disaster Management Authority's guidelines on psychosocial care.

## Psychological models
- Conditioning (Mowrer's two factor theory): cues present during the trauma become conditioned fear stimuli; avoidance prevents extinction.
- Emotional processing theory (Foa and Kozak): the trauma creates a pathological fear structure. Recovery needs activation of this structure and new, incompatible information, which is the basis of prolonged exposure.
- Dual representation theory (Brewin): trauma memories are stored as sensory, image based representations that are easily triggered and experienced as happening now, poorly linked with contextual, verbal memories that place the event in time and place.
- Ehlers and Clark cognitive model: PTSD persists when the person processes the trauma in a way that produces a sense of serious current threat. Two processes do this:
- Negative appraisals of the trauma and its aftermath ("I am in danger everywhere", "I am permanently damaged", "it was my fault", "my flashbacks mean I am going mad").
- A poorly elaborated trauma memory, with strong associative and perceptual priming, which explains triggering by matching cues and the "here and now" quality of intrusions.
- Maintaining strategies: thought suppression, rumination, avoidance, safety behaviours, substance use.

## Biological findings
- Fear circuitry: an over active amygdala and under active ventromedial prefrontal cortex, so fear is not regulated; reduced hippocampal volume, which twin studies suggest may partly be a pre existing risk.
- HPA axis: low or normal baseline cortisol with enhanced negative feedback, unlike the high cortisol of depression.
- Noradrenaline overactivity explains hyperarousal and is targeted by prazosin and propranolol studies.
- Impaired fear extinction learning is a core finding.
- Heritability is about 30 to 40 percent.

## Management
Early after trauma:
- Psychological first aid, practical support and watchful waiting.
- Single session psychological debriefing is not recommended; it may increase PTSD.
- Trauma focused CBT for people with acute stress disorder or early PTSD.
Established PTSD:
- First line: trauma focused psychological therapies: prolonged exposure (Foa), cognitive processing therapy (Resick), cognitive therapy for PTSD (Ehlers and Clark), and eye movement desensitisation and reprocessing (EMDR, Shapiro). These lead to remission in about half to two thirds.
- Medicines: SSRIs (sertraline, paroxetine) and venlafaxine, especially when therapy is unavailable or declined. Prazosin may help nightmares, with mixed trial evidence. Benzodiazepines should be avoided as they do not help and may hinder recovery. In 2024 the US regulator declined to approve MDMA assisted therapy.
- Treat comorbid depression, substance use and suicide risk; address safety if the trauma is ongoing (domestic violence).
- In low resource settings, task shared interventions such as Problem Management Plus (WHO) are useful.

| Approach | Core idea |
| Prolonged exposure | Imaginal and in vivo exposure to process the fear structure |
| Cognitive processing therapy | Challenge stuck points such as self blame |
| Cognitive therapy for PTSD | Change appraisals, elaborate the memory, drop safety behaviours |
| EMDR | Recall with bilateral eye movements |

## Conclusion
PTSD is a common and disabling consequence of trauma, defined by intrusion, avoidance, negative mood and thinking changes, and hyperarousal. Cognitive models explain why it persists, biological studies show a failure to regulate fear, and trauma focused psychological therapy is the treatment of choice.`,
    keyPoints: ["Criterion A types of exposure", "Four symptom clusters with required numbers", "Duration more than one month and two specifiers", "ICD-11 three core elements and complex PTSD", "Risk factors before, during and after", "Indian disaster and violence context", "Ehlers and Clark model with appraisals and memory", "Debriefing not recommended; trauma focused therapies and SSRIs first line"],
    pitfalls: ["Recommending debriefing or benzodiazepines", "Forgetting that most trauma survivors recover", "Mixing up the cortisol pattern with depression"],
    visuals: [
      tree("PTSD in DSM-5-TR", [["PTSD", "Duration over one month", -1], ["Intrusion", "One or more of five", 0], ["Avoidance", "One or more of two", 0], ["Negative thinking and mood", "Two or more of seven", 0], ["Arousal and reactivity", "Two or more of six", 0]]),
      chain("Ehlers and Clark: why PTSD persists", [["Trauma", ""], ["Negative appraisals", "I am never safe"], ["Poorly elaborated memory", "Triggered easily, feels like now"], ["Sense of current threat", "Intrusions and arousal"], ["Avoidance, suppression, rumination", "Prevent change"]]),
      brain("PTSD fear circuit", { amygdala: "Over active: fires at trauma reminders", prefrontal: "Ventromedial PFC under active: cannot calm the amygdala", hippocampus: "Smaller: weak context, so memories feel present" }),
    ],
    module: "trauma",
    ref: "DSM-5-TR PTSD; ICD-11 6B40 and 6B41; Ehlers and Clark 2000; Brewin 1996; Foa and Kozak 1986; Gilbertson 2002 twin hippocampus; NICE NG116; FDA 2024 MDMA decision",
  },
  {
    id: "psyp-l06-007",
    subject: "psychopathology",
    topic: "complex-ptsd",
    marks: 5,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Write short notes on complex PTSD.",
    plan: ["Origin and ICD-11 definition", "Disturbances in self organisation", "Difference from PTSD and borderline personality disorder", "Assessment and treatment"],
    answer: `## Origin and definition
Judith Herman proposed "complex PTSD" in 1992 for survivors of prolonged, repeated trauma from which escape is difficult, such as childhood abuse, torture, captivity and domestic violence. ICD-11 is the first classification to include it. DSM-5-TR does not have it as a separate diagnosis.

## ICD-11 requirements
- All three core PTSD elements: re-experiencing in the present, avoidance, and a sense of current threat.
- Plus disturbances in self organisation (DSO):
- Affect dysregulation: strong emotional reactions, outbursts, or emotional numbing and dissociation under stress.
- Negative self concept: persistent beliefs of being diminished, defeated or worthless, with shame or guilt about the trauma.
- Disturbances in relationships: difficulty sustaining relationships and feeling close to others.
- Significant impairment.
The trauma is typically prolonged or repetitive, but the diagnosis rests on symptoms, not the type of event.

## Differences
| Feature | PTSD | Complex PTSD | Borderline personality disorder |
| Core trauma symptoms | Present | Present | Not required |
| Self concept | Usually stable | Stable negative self | Unstable, shifting self |
| Relationships | Variable | Avoidant, distant | Intense, unstable, fear of abandonment |
| Self harm | Less common | Possible | Frequent, impulsive |

## Assessment and treatment
The International Trauma Questionnaire measures PTSD and DSO symptoms. Trauma focused therapies remain effective; many clinicians use a phased approach (stabilisation and skills, such as STAIR training, then trauma processing, then reintegration), though whether the stabilisation phase is always needed is debated. Comorbid depression, substance use and self harm need attention.

## Conclusion
Complex PTSD captures the wider effects of prolonged trauma on emotion, identity and relationships; it is distinct from both PTSD and borderline personality disorder.`,
    keyPoints: ["Herman 1992", "ICD-11 only", "Three PTSD elements plus three DSO features", "Diagnosis rests on symptoms", "Table distinguishing from PTSD and BPD", "ITQ and phased treatment debate"],
    module: "trauma",
    ref: "ICD-11 6B41; Herman 1992; Cloitre ITQ; Karatzias 2019 meta-analysis",
  },
  {
    id: "psyp-l06-008",
    subject: "psychopathology",
    topic: "adjustment",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "mcp-entrance", "md-psychiatry"],
    question: "Write short notes on adjustment disorder.",
    plan: ["Definition", "DSM-5-TR and ICD-11 criteria", "Subtypes and clinical points", "Management"],
    answer: `## Definition
Adjustment disorder is a maladaptive emotional or behavioural reaction to an identifiable stressor, more intense than expected or causing significant impairment, that does not meet criteria for another mental disorder.

## Criteria
DSM-5-TR:
- Emotional or behavioural symptoms within three months of the onset of a stressor.
- Marked distress out of proportion to the stressor, taking culture into account, or significant impairment.
- Not meeting criteria for another disorder and not an exacerbation of a pre existing one.
- Not normal bereavement or prolonged grief disorder.
- Symptoms do not persist for more than six months after the stressor or its consequences end.
- Subtypes: with depressed mood, with anxiety, with mixed anxiety and depressed mood, with disturbance of conduct, with mixed disturbance of emotions and conduct, and unspecified. Acute (under six months) or persistent.
ICD-11 defines it more positively: preoccupation with the stressor (excessive worry, recurrent distressing thoughts, rumination) and failure to adapt, starting within a month and usually resolving within six months.

## Clinical points
Common stressors include breakups, exam failure, job loss, migration, divorce and physical illness. It is common in general hospital and college counselling settings. Adolescents often show conduct changes. Suicidal behaviour can occur and must be assessed, especially in young people.

## Management
- Brief supportive psychotherapy, problem solving and crisis intervention.
- Help with the stressor itself (practical, social, legal).
- CBT for worry and coping; relaxation and sleep hygiene.
- Medicines only for specific symptoms, for a short time.

## Conclusion
Adjustment disorder is a time limited stress response; it usually resolves with support, but suicide risk must not be overlooked.`,
    keyPoints: ["Definition", "Three months onset and six months resolution in DSM-5-TR", "ICD-11 preoccupation and failure to adapt", "Six subtypes", "Suicide risk", "Brief psychological management"],
    module: "trauma",
    ref: "DSM-5-TR adjustment disorders; ICD-11 6B43",
  },
  {
    id: "psyp-l06-009",
    subject: "psychopathology",
    topic: "dissociative",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Describe the classification of dissociative disorders and critically discuss dissociative identity disorder.",
    plan: ["Define dissociation", "Classification in DSM-5-TR and ICD-11", "DID criteria and features", "Trauma and sociocognitive models", "Treatment and conclusion"],
    answer: `## Dissociation
Dissociation is a disruption of the normal integration of consciousness, memory, identity, emotion, perception, body representation, motor control and behaviour. Pierre Janet described it as a splitting off of mental functions under stress.

## Classification
| DSM-5-TR | ICD-11 |
| Dissociative identity disorder | Dissociative identity disorder |
| Dissociative amnesia (with or without fugue) | Dissociative amnesia (with or without fugue) |
| Depersonalisation derealisation disorder | Depersonalisation derealisation disorder |
| Other specified (including dissociative trance) | Trance disorder; possession trance disorder; partial dissociative identity disorder |
| Conversion disorder placed in somatic symptom chapter | Dissociative neurological symptom disorder (conversion) kept in this group |

## Dissociative identity disorder (DID)
DSM-5-TR criteria:
- Disruption of identity with two or more distinct personality states, which may be described in some cultures as possession. It involves a marked discontinuity in sense of self and agency, with changes in affect, behaviour, memory, perception and thinking, observed by others or reported.
- Recurrent gaps in recall of everyday events, personal information or trauma beyond ordinary forgetting.
- Distress or impairment.
- Not part of a broadly accepted cultural or religious practice, and in children not imaginary playmates.
- Not due to substances or medical conditions (such as complex partial seizures).
Features: switching between identities (alters) that may differ in age, gender and voice; amnesia; depersonalisation; voices; self harm; and high comorbidity with PTSD, depression and borderline personality disorder. Most patients report severe childhood abuse.

## Controversy: two models
- Trauma model (posttraumatic model): severe, repeated childhood trauma before identity is consolidated leads to failure of integration; dissociation is a defence. Theory of structural dissociation (van der Hart) describes "apparently normal parts" and "emotional parts". Supported by high rates of reported abuse and some imaging differences.
- Sociocognitive model (Spanos; Lilienfeld): DID is a socially learned role, shaped by therapists' suggestion, hypnosis, media (books and films such as "Sybil") and cultural expectations. Supported by the sharp rise in diagnoses in North America in the 1980s, clusters among particular therapists, and rarity in many countries.
- Critics of the sociocognitive model point out that dissociative symptoms occur before treatment and in cultures without the media script. An integrative view accepts trauma related vulnerability, fantasy proneness and sleep disturbance, with social shaping of how symptoms are expressed.

## Treatment
Phase oriented therapy: safety and stabilisation, processing of trauma memories, and integration or cooperation of identity states. Treat comorbid depression and PTSD. Avoid suggestive techniques. Evidence is mostly from observational studies.

## Conclusion
Dissociative disorders are classified differently in the two systems, especially conversion and possession. DID remains a controversial diagnosis, and the trauma and sociocognitive models are best seen as complementary.`,
    keyPoints: ["Definition of dissociation and Janet", "Classification table with ICD-11 trance and possession", "Conversion placement difference", "DID criteria with cultural exclusion", "Trauma model and structural dissociation", "Sociocognitive model with evidence", "Phase oriented treatment"],
    visuals: [compare("Two views of DID", ["Trauma model", ["Severe early abuse", "Failure to integrate identity", "Dissociation as defence", "Symptoms predate therapy"], "Caused by trauma"], ["Sociocognitive model", ["Suggestion by therapists", "Media scripts", "Diagnosis clusters in some places", "Role enactment"], "Shaped by social learning"], "Most experts now combine both.")],
    module: "trauma",
    ref: "DSM-5-TR dissociative disorders; ICD-11 6B6; Spanos 1994; Lilienfeld 1999; Dalenberg 2012 trauma model review",
  },
  {
    id: "psyp-l06-010",
    subject: "psychopathology",
    topic: "possession",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Write short notes on possession trance disorder in the Indian context.",
    plan: ["Definition from ICD-11", "Features and who is affected in India", "Differential diagnosis and cultural norms", "Management with families and healers"],
    answer: `## Definition
ICD-11 possession trance disorder is a trance state in which the person's usual sense of identity is replaced by an external "possessing" identity, such as a spirit, deity, ancestor or power, with behaviour and movements attributed to that agent. It is involuntary, recurrent or prolonged, not part of an accepted collective cultural or religious practice, and causes distress or impairment. DSM-5-TR places such presentations under dissociative identity disorder (possession form) or other specified dissociative disorder.

## Features in India
Episodes may include a change of voice, swaying, head rolling, speaking as a goddess or a dead relative, demands, and later partial amnesia. They are more common in young women, in rural and low income settings, and often occur in the context of conflict (in laws, marriage, dowry), restricted voice, bereavement or trauma. The possessing identity can express wishes that the person cannot voice directly, and the episode may bring care or relief from duties. Families usually consult temples, dargahs and traditional healers first; well known healing sites include Mehandipur Balaji in Rajasthan.

## Differential diagnosis
- Normal culturally sanctioned possession during festivals or rituals, which is voluntary and expected: not a disorder.
- Psychosis (schizophrenia, mania), epilepsy (especially temporal lobe seizures), delirium and substance intoxication.
- Other dissociative disorders and depression.

## Management
- Rule out organic causes and psychosis.
- Explore stressors and family dynamics in a non blaming way; understand the family's explanatory model.
- Psychoeducation, problem solving, family therapy and CBT for underlying anxiety or depression; reduce reinforcement of episodes.
- Respectful collaboration with healers where safe, while preventing harmful practices.

## Conclusion
Possession trance disorder is a culturally shaped dissociative response to distress; careful assessment separates it from normal ritual and from psychosis, and family based help is the mainstay.`,
    keyPoints: ["ICD-11 definition with involuntary and non sanctioned features", "DSM-5-TR placement", "Typical features and who is affected in India", "Psychosocial meaning of the episode", "Differential with ritual possession, psychosis and epilepsy", "Family based management and work with healers"],
    module: "trauma",
    ref: "ICD-11 6B63; Chandrashekar et al NIMHANS on possession; Halliburton 2005",
  },
]);
