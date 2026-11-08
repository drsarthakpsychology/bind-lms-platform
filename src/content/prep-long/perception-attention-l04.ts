import type { LongQA } from "@/lib/prep/long-types";

const S = "perception-attention" as const;

export const PERCEPTION_ATTENTION_L04: LongQA[] = [
  {
    id: "pa-l04-031",
    subject: S,
    topic: "attention-networks",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "md-psychiatry", "mcp-entrance"],
    question: "Describe Posner's model of attention networks: alerting, orienting and executive control. How are they measured, what are their neural and neurochemical bases, and how do they relate to clinical disorders?",
    plan: ["Attention as several networks", "Alerting network", "Orienting network", "Executive control network", "The Attention Network Test", "Development, clinical links and conclusion"],
    answer: `## Attention as a system of networks
Michael Posner and Steven Petersen proposed in 1990 that attention is not a single process but consists of separate networks, each with its own anatomy, chemistry and function. They identified three: alerting, orienting and executive control. The networks interact but can be measured and impaired separately.

## Alerting
Alerting is achieving and maintaining a state of readiness to respond to incoming stimuli.
- Tonic alertness is the general level of arousal over minutes to hours (vigilance); phasic alertness is a brief increase after a warning signal.
- Anatomy: the locus coeruleus in the brainstem, with projections to the right frontal and parietal cortex, and the thalamus.
- Chemistry: noradrenaline. Drugs that reduce noradrenaline (such as clonidine) reduce the benefit of warning signals.
- Example: a warning tone before a target speeds reaction time.

## Orienting
Orienting is selecting information from sensory input by directing attention to a location or object, covertly or overtly.
- It involves disengaging from the current focus, moving and engaging at the new location.
- Anatomy: the dorsal attention network (superior parietal lobe, intraparietal sulcus, frontal eye fields) for voluntary orienting, and the ventral network (temporo-parietal junction, ventral frontal cortex, mainly right-sided) for reorienting to unexpected events. The superior colliculus and pulvinar of the thalamus are also involved.
- Chemistry: acetylcholine. Cholinergic drugs alter orienting.
- Measured with Posner's cueing task.

## Executive control
Executive attention monitors and resolves conflict among thoughts, feelings and responses, and controls goal-directed behaviour.
- Anatomy: the anterior cingulate cortex, which detects conflict, and the lateral prefrontal cortex, which implements control, with the basal ganglia.
- Chemistry: dopamine, with genetic studies linking dopamine-related genes (such as DRD4 and COMT) to executive attention.
- Measured with conflict tasks such as the Stroop, Simon and flanker tasks.
- It is closely related to effortful control in temperament and self-regulation.

## The Attention Network Test
Jin Fan, Posner and colleagues developed the Attention Network Test (ANT) in 2002. Participants indicate the direction of a central arrow flanked by congruent or incongruent arrows (a flanker task), preceded by different kinds of cues.
| Network | Calculation |
| Alerting | Reaction time with no cue minus reaction time with a double (warning) cue |
| Orienting | Reaction time with a centre cue minus reaction time with a spatial cue showing where the target will appear |
| Executive control | Reaction time on incongruent minus congruent flanker trials |
Typical adult effects are about 40 to 50 milliseconds for alerting and orienting and about 80 to 100 milliseconds for conflict. The three scores are largely uncorrelated, supporting separate networks, although later work found some interactions.

## Development
Orienting develops early in infancy; executive attention develops strongly between about 3 and 7 years and continues through adolescence. Mary Rothbart and Posner found that effortful control predicts later social and academic adjustment. Attention training with computer exercises in young children produced some gains in executive attention and related brain activity.

## Clinical links
- ADHD: deficits in executive control and alerting, linked to frontostriatal dopamine and noradrenaline systems; stimulants act on both.
- Hemispatial neglect after right parietal damage: an orienting deficit, especially disengaging attention from the right side.
- Schizophrenia: executive control deficits and abnormal anterior cingulate activity; some studies report orienting abnormalities.
- Anxiety: hypervigilance (alerting) and attentional bias to threat (orienting), with reduced executive control over threat.
- Borderline personality disorder: reduced effortful control.
- Ageing: alerting declines more than orienting.
- Alzheimer's disease: executive deficits and cholinergic loss affecting orienting.

## Evaluation
The model unified behavioural tasks, anatomy, neurotransmitters, development and genetics, and is widely used. However, the networks interact, the ANT's reliability for individual scores, especially alerting, is modest, and other components of attention, such as sustained attention and attention in working memory, are not fully covered.

## Conclusion
Posner's model divides attention into alerting, orienting and executive control, each linked to distinct brain networks and neurotransmitters. Measuring them separately has helped explain the specific attention problems in ADHD, neglect, schizophrenia and anxiety.`,
    keyPoints: ["Attention as several networks", "Alerting with locus coeruleus and noradrenaline", "Orienting with parietal networks and acetylcholine", "Executive control with anterior cingulate and dopamine", "ANT calculations", "Developmental course", "Clinical links for at least three disorders", "Evaluation"],
    module: "sensation-perception/3-3",
    visuals: [
      { kind: "flow", caption: "Executive control", data: { title: "Three attention networks", layout: "tree", nodes: [{ id: "a", label: "Attention" }, { id: "al", label: "Alerting", parent: "a", detail: "Readiness; locus coeruleus; noradrenaline." }, { id: "or", label: "Orienting", parent: "a", detail: "Selecting a location; parietal and frontal eye fields; acetylcholine." }, { id: "ex", label: "Executive control", parent: "a", detail: "Resolving conflict; anterior cingulate and prefrontal cortex; dopamine." }] } },
      { kind: "brainmap", caption: "Clinical links", data: { title: "Where the networks live", focus: ["brainstem", "parietal", "prefrontal", "thalamus"], notes: { brainstem: "Locus coeruleus: alerting.", parietal: "Orienting to locations.", prefrontal: "Executive control with the anterior cingulate.", thalamus: "Pulvinar helps orienting." } } },
    ],
    ref: "Posner and Petersen 1990; Petersen and Posner 2012; Fan et al 2002 ANT; Rothbart and Posner 2005; Rueda et al 2005 attention training",
  },
  {
    id: "pa-l04-032",
    subject: S,
    topic: "attention-networks",
    marks: 10,
    difficulty: 3,
    exams: ["ma-semester", "md-psychiatry", "mcp-entrance"],
    question: "Describe hemispatial neglect and Balint's syndrome. What do they reveal about attention and the parietal lobe?",
    plan: ["Define neglect and its causes", "Clinical features and tests", "Representational neglect and implicit processing", "Balint's syndrome features", "What they reveal and rehabilitation"],
    answer: `## Hemispatial neglect
Hemispatial (unilateral) neglect is a failure to attend to, respond to or orient towards stimuli on the side of space opposite a brain lesion, not explained by blindness or weakness. It most often follows damage to the right parietal lobe, especially the inferior parietal lobule and temporo-parietal junction, so patients neglect the left side. Left-sided damage causes neglect less often and less severely, because the right hemisphere attends to both sides of space while the left attends mainly to the right.

## Clinical features
- Patients may eat food only from the right side of the plate, shave or apply make-up only to the right side of the face, bump into objects on the left, and read only the right half of words or lines.
- Line bisection: asked to mark the middle of a horizontal line, they mark well to the right.
- Cancellation tests: asked to cross out all targets on a page, they miss those on the left.
- Copying and drawing: they copy only the right half of a flower or clock, or crowd all the numbers on the right side of a clock face.
- Extinction: when two stimuli are presented at once, one on each side, the left one is not noticed, though it is detected when presented alone.
- Anosognosia: many patients are unaware of their deficit.

## Representational neglect and implicit processing
- Edoardo Bisiach and Claudio Luzzatti asked patients from Milan to imagine the Piazza del Duomo from one end and describe it. They described buildings on the right; when asked to imagine standing at the opposite end, they described buildings previously omitted, now on their right. Neglect affects mental images, not just perception.
- John Marshall and Peter Halligan showed a patient two drawings of a house, identical except that one had flames coming from its left side. She said they were the same, yet when asked which she would prefer to live in, she chose the house without flames, showing that the neglected information was processed implicitly.

## Balint's syndrome
Balint's syndrome, described by Rezso Balint in 1909, follows bilateral damage to the parieto-occipital regions. It has three main features:
- Simultanagnosia: inability to perceive more than one object at a time. A patient may see a fork or a spoon but not both together, or see a single tree but not the forest.
- Optic ataxia: inability to reach accurately for objects under visual guidance.
- Ocular apraxia: difficulty voluntarily shifting gaze to a new target.
Patients with Balint's syndrome also make many illusory conjunctions of colour and shape, as Lynn Robertson and Anne Treisman showed, supporting the idea that the parietal lobe binds features using spatial attention.

## What they reveal
- Attention depends on a network centred on the parietal lobe, with the right hemisphere dominant for spatial attention.
- Attention operates on internal representations as well as on perception.
- Unattended information can be processed without awareness.
- Spatial attention is needed to bind features into objects.
- Posner showed that neglect patients have particular difficulty disengaging attention from the right to move it left.

## Rehabilitation
Visual scanning training, prism adaptation (wearing prisms that shift vision to the right, which produces a lasting leftward shift in attention), limb activation of the left arm, and cueing techniques such as a coloured margin on the left of the page.

## Conclusion
Neglect and Balint's syndrome show that attention is a spatially organised function of the parietal lobe that is necessary for awareness of space and for binding objects, and that it can be lost for parts of space while vision itself is intact.`,
    keyPoints: ["Definition and right parietal lesion", "Clinical signs and tests including line bisection", "Extinction", "Representational neglect with Bisiach", "Implicit processing with Marshall and Halligan", "Balint's triad", "Lessons about parietal attention", "Rehabilitation such as prism adaptation"],
    module: "sensation-perception/3-3",
    visuals: [
      { kind: "brainexplorer", caption: "Hemispatial neglect", data: { title: "Parietal damage and attention", focus: ["parietal", "occipital", "frontal"], caption: "Switch on damage for the right parietal lobe. What happens to the left side of the world?" } },
    ],
    ref: "Bisiach and Luzzatti 1978; Marshall and Halligan 1988 Nature; Friedman-Hill, Robertson and Treisman 1995; Posner et al 1984; Rossetti et al 1998 prism adaptation; Bear, Connors and Paradiso ch 21",
  },
  {
    id: "pa-l04-033",
    subject: S,
    topic: "awareness",
    marks: 10,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester", "md-psychiatry"],
    question: "What is blindsight? Describe the evidence and discuss what it reveals about visual processing and consciousness.",
    plan: ["Define blindsight", "Patient D.B. and the original studies", "Types and other evidence", "Explanations and pathways", "Criticisms", "Implications for consciousness"],
    answer: `## Meaning
Blindsight is the ability of some people with damage to the primary visual cortex (V1) to respond accurately to visual stimuli in the part of the visual field where they report being blind. They deny seeing anything, yet perform above chance when forced to guess. Lawrence Weiskrantz named the phenomenon in the 1970s.

## Patient D.B.
D.B. had part of his right V1 removed to treat a malformation, leaving him blind in much of his left visual field. When Weiskrantz and Elizabeth Warrington presented stimuli in the blind field and asked him to guess:
- he pointed to the location of lights with good accuracy,
- discriminated horizontal from vertical lines and X from O well above chance,
- detected movement,
yet insisted he was guessing and saw nothing. When shown his results, he was surprised.

## Types and further evidence
- Type 1 blindsight: accurate discrimination with no awareness at all.
- Type 2 blindsight: some vague feeling that something happened, without seeing it, especially for fast-moving stimuli.
- Patient G.Y. has been studied extensively; his ability to detect motion in the blind field is linked to activity in area V5 (MT) without V1.
- Affective blindsight: patients can discriminate emotional facial expressions presented to the blind field, linked to the amygdala via a subcortical route through the superior colliculus and pulvinar.
- Beatrice de Gelder described patient T.N., cortically blind in both fields after two strokes, who navigated a corridor full of obstacles without bumping into them.
- Monkeys with V1 lesions show similar abilities.

## Explanations
- About 10 percent of fibres from the retina go to the superior colliculus rather than the lateral geniculate nucleus. From there, information reaches the pulvinar and extrastriate areas such as V5, bypassing V1.
- Some fibres from the lateral geniculate nucleus project directly to extrastriate cortex.
- Islands of spared V1 tissue may explain some cases, though imaging has ruled this out in several patients.
- The dorsal stream for action may operate without the ventral stream's contribution to conscious recognition, consistent with Milner and Goodale's view.

## Criticisms
- Some argue that patients are merely conservative in reporting awareness (a criterion effect in signal detection terms), and that their experience is degraded rather than absent. Researchers have used confidence ratings and wagering to address this.
- Light scatter from the blind field to the intact field could explain some early results, but careful controls have excluded it.

## Implications
- Visual processing can occur without visual awareness; the brain processes far more than we consciously experience.
- V1, or its interaction with higher areas, seems necessary for conscious visual experience but not for all visual processing.
- Blindsight is used in research on the neural correlates of consciousness.
- Rehabilitation: training patients to use residual vision in their blind field has shown some benefit.

## Conclusion
Blindsight shows a striking dissociation between seeing and knowing that one sees. It reveals alternative visual pathways that bypass V1 and supports theories that consciousness depends on specific cortical circuits rather than on visual processing as such.`,
    keyPoints: ["Definition with V1 damage", "Weiskrantz and patient D.B. findings", "Type 1 and Type 2", "Affective blindsight and T.N. navigation", "Subcortical pathway explanation", "Criterion and light scatter criticisms", "Implications for consciousness"],
    module: "sensation-perception/3-3",
    visuals: [
      { kind: "compare", caption: "Types and further evidence", data: { title: "What a blindsight patient can and cannot do", a: { label: "Can do, when forced to guess", points: ["Point to a light", "Tell an X from an O", "Detect motion and emotional faces", "Walk around obstacles"], summary: "Processing without seeing." }, b: { label: "Cannot do", points: ["Report seeing the stimulus", "Describe it", "Use it deliberately in daily life"], summary: "No visual awareness." } } },
    ],
    ref: "Weiskrantz et al 1974; Weiskrantz 1986 Blindsight; de Gelder et al 2008 Current Biology; Morris et al 2001 affective blindsight; Cowey 2010",
  },
  {
    id: "pa-l04-034",
    subject: S,
    topic: "attention-capacity",
    marks: 5,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester"],
    question: "Write a short note on the attentional blink.",
    plan: ["Define and describe RSVP procedure", "Findings including lag 1 sparing", "Explanations", "Significance"],
    answer: `## Meaning
The attentional blink is a brief period, roughly 200 to 500 milliseconds, after detecting one target in a rapid stream of stimuli, during which a second target is often missed. Jane Raymond, Kimron Shapiro and Karen Arnell described it in 1992.

## Procedure
In rapid serial visual presentation (RSVP), items such as letters appear one after another at the same location, about 10 per second. Participants must identify a first target (T1, for example a white letter among black ones) and then detect a second target (T2, for example an X) that follows after a varying number of items (the lag).

## Findings
- When T2 appears about 2 to 5 items (200 to 500 milliseconds) after T1, it is often missed.
- At longer lags, T2 is detected normally.
- Lag 1 sparing: if T2 immediately follows T1 (about 100 milliseconds), it is often detected, as if both enter attention together.
- If participants are told to ignore T1, there is no blink, showing that the effect depends on attending to T1.
- Emotional and personally significant words (such as one's own name) are less affected.

## Explanations
- Bottleneck accounts: consolidating T1 into working memory takes time and limited capacity, so T2 decays or is overwritten before it can be consolidated.
- Attentional control accounts: processing T1 temporarily disrupts the attentional set used to detect targets.
ERP studies show that missed T2s still produce an N400 to their meaning, so they are processed semantically without reaching awareness.

## Significance
The attentional blink reveals the temporal limits of attention and the stage at which information becomes conscious. It is relevant to rapidly changing displays, such as dashboards and air traffic control screens.`,
    keyPoints: ["Definition and time window", "RSVP procedure with T1 and T2", "Lag 1 sparing", "Dependence on attending to T1", "Consolidation bottleneck explanation", "Semantic processing of missed items"],
    module: "sensation-perception/2-6",
    visuals: [
      { kind: "experiment", caption: "Findings", data: { title: "The attentional blink", question: "How often is the second target detected at each lag (illustrative)?", unit: "%", conditions: [{ label: "Lag 1 (100 ms)", value: 80 }, { label: "Lag 3 (300 ms)", value: 45 }, { label: "Lag 7 (700 ms)", value: 85 }], why: "Detection dips for a few hundred milliseconds after the first target." } },
    ],
    ref: "Raymond, Shapiro and Arnell 1992; Chun and Potter 1995; Vogel, Luck and Shapiro 1998 N400",
  },
  {
    id: "pa-l04-035",
    subject: S,
    topic: "divided-attention",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "\"Hands-free phones make it safe to talk while driving.\" Evaluate this claim using research on divided attention.",
    plan: ["State the issue", "Theories of divided attention that apply", "Evidence from simulator and field studies", "Why hands-free does not solve it", "Comparison with passengers and other factors", "Policy and conclusion"],
    answer: `## The issue
Many laws ban holding a phone while driving but allow hands-free use. The assumption is that the danger comes from the hand and eyes leaving the wheel and road. Research on divided attention suggests the main problem is cognitive: the conversation draws on limited central attention.

## Relevant theory
- Capacity theories (Kahneman): attention is a limited pool. Driving in traffic and a demanding conversation together can exceed it.
- Multiple resources (Wickens): talking (auditory and verbal) and driving (visual and spatial) use partly separate resources, which might predict little interference. But both draw on central resources for decisions and response selection.
- The psychological refractory period and central bottleneck (Pashler): deciding what to say and deciding when to brake both need response selection, which can handle one task at a time.
- Inattentional blindness: attention engaged in conversation reduces awareness of unexpected events in the road.

## Evidence
- David Strayer and William Johnston found in a driving simulator that people talking on either a hand-held or a hands-free phone missed twice as many red lights and were slower to react to them than when not talking. Listening to the radio or books on tape did not have this effect.
- Strayer and colleagues found that drivers on phones were slower to brake and more likely to collide with a car that braked in front, and that their impairment was comparable in some measures to driving at the legal alcohol limit.
- Drivers on phones showed reduced recognition memory for billboards they had looked at directly, a form of "looking but not seeing".
- Large studies of real crashes, such as those using phone records by Donald Redelmeier and Robert Tibshirani in Canada, found that phone use was associated with about four times the risk of a crash, with no clear safety advantage for hands-free phones.
- Naturalistic driving studies, in which cars are fitted with cameras, show that texting and dialling, which take the eyes off the road, carry the highest risk, while conversation increases risk to a smaller but real degree.

## Why hands-free does not solve it
- It removes the manual and some visual demands but not the cognitive demand of conversation.
- Voice-to-text and voice assistants still require attention and can be frustrating.
- Emotional or complex conversations increase load further.

## Comparison with passengers
Conversations with adult passengers are less dangerous. Strayer and Frank Drews found that passengers adjust their conversation to traffic, pause when driving is demanding and even point out hazards, whereas a remote caller cannot see the road.

## Individual and situational factors
Novice and older drivers, high traffic, poor weather and complex junctions increase the cost. A small number of people ("supertaskers") appear to multitask without loss, but they are rare, about 2 to 3 percent in one study.

## Policy and conclusion
The claim is not supported. Hands-free phones reduce some risks but not the central attentional cost of conversation. In India, Section 184 of the Motor Vehicles Act penalises dangerous driving, including using a hand-held phone; the evidence suggests public education should also discourage long or emotional hands-free calls while driving, and voice systems should be designed to minimise cognitive load.`,
    keyPoints: ["Identifies cognitive rather than manual demand", "Applies capacity, multiple resource and bottleneck theories", "Strayer and Johnston findings", "Comparable to alcohol impairment", "Crash risk evidence", "Passenger versus phone difference", "Supertaskers are rare", "Clear evaluative conclusion"],
    module: "sensation-perception/2-6",
    visuals: [
      { kind: "experiment", caption: "Evidence", data: { title: "Missed red lights in a simulator", question: "How often did drivers miss red lights (illustrative from Strayer and Johnston)?", unit: "%", conditions: [{ label: "No phone", value: 3 }, { label: "Listening to the radio", value: 3 }, { label: "Hands-free phone conversation", value: 7 }, { label: "Hand-held phone conversation", value: 7 }], why: "The conversation, not the hand, doubled the misses." } },
    ],
    ref: "Strayer and Johnston 2001 Psychological Science; Strayer, Drews and Crouch 2006; Drews, Pasupathi and Strayer 2008; Redelmeier and Tibshirani 1997 NEJM; Watson and Strayer 2010 supertaskers; Motor Vehicles Act 1988 s.184 as amended 2019",
  },
  {
    id: "pa-l04-036",
    subject: S,
    topic: "attention-networks",
    marks: 15,
    difficulty: 3,
    exams: ["mcp-entrance", "md-psychiatry", "ugc-net"],
    question: "Discuss the role of attention in psychological disorders, with reference to ADHD, anxiety disorders, depression and schizophrenia. How are attentional processes assessed and treated?",
    plan: ["Why attention matters in psychopathology", "ADHD", "Anxiety disorders and threat bias", "Depression and rumination", "Schizophrenia and filtering", "Assessment, treatment and conclusion"],
    answer: `## Why attention matters
Attention determines what information is processed and remembered. Disorders can involve deficits in attention (too little control) or biases in attention (systematically favouring certain information, such as threat). Both can cause symptoms and maintain them.

## ADHD
- Attention deficit hyperactivity disorder involves persistent inattention and or hyperactivity-impulsivity from childhood, affecting about 5 percent of children worldwide; Indian school studies report broadly similar rates.
- Deficits: sustained attention (more omission errors on continuous performance tests, with variability that increases over time), executive control and response inhibition (stop signal task, go/no-go), working memory, and alerting.
- Reaction time variability is one of the most consistent findings.
- Neural basis: frontostriatal and frontoparietal networks, with dopamine and noradrenaline dysregulation; default mode network intrusions during tasks.
- Theories: Russell Barkley's model of deficient behavioural inhibition; Edmund Sonuga-Barke's dual pathway model (executive deficits and delay aversion).

## Anxiety disorders
- Attentional bias towards threat: anxious people orient more quickly to threatening words or faces and find it harder to disengage from them.
- Evidence: in the dot probe task, anxious participants respond faster to probes that replace threat stimuli. In the emotional Stroop, they are slower to name the colour of threat words related to their worries. Yair Bar-Haim's meta-analysis confirmed a reliable threat bias in anxious but not non-anxious people.
- Hypervigilance and scanning for danger in generalised anxiety, panic disorder (bodily sensations) and PTSD (trauma cues).
- Attentional control theory (Michael Eysenck): anxiety reduces the efficiency of inhibition and shifting, explaining poor concentration.
- Self-focused attention in social anxiety: attention turned inward to monitor one's own performance, as in David Clark and Adrian Wells's model, prevents disconfirming feared outcomes.

## Depression
- Depression shows less bias in initial orienting but difficulty disengaging from negative information, such as sad faces, once attended.
- Rumination, a repetitive focus on symptoms and their causes, consumes executive resources and reduces concentration.
- Concentration and decision-making difficulties are diagnostic symptoms.
- Reduced attention to positive information.

## Schizophrenia
- Sensory gating deficits: the P50 response to a second click is not suppressed as normally, suggesting poor filtering of repeated stimuli.
- Reduced prepulse inhibition of the startle response.
- Impaired sustained attention on continuous performance tests, present even in unaffected relatives, suggesting a vulnerability marker.
- Aberrant salience: Shitij Kapur proposed that dysregulated dopamine causes irrelevant stimuli to seem significant, attracting attention and leading to delusional explanations.
- Executive and working memory deficits predict functional outcome.

## Other conditions
- OCD: attention captured by threat related to obsessions.
- Substance use disorders: attentional bias to drug cues predicts craving and relapse.
- Eating disorders: bias to body and food cues.
- Dementia and delirium: inattention is a core feature of delirium.

## Assessment
- Neuropsychological tests: continuous performance tests, digit span, Trail Making Test, Stroop, cancellation tests, the Attention Network Test.
- Rating scales: Conners scales and the Vanderbilt scales for ADHD, completed by parents and teachers.
- Experimental bias tasks (dot probe, emotional Stroop) mainly in research, as their reliability for individuals is limited.
- In India, the NIMHANS neuropsychological battery includes tests of attention normed for Indian populations.

## Treatment
- ADHD: stimulants (methylphenidate) and non-stimulants (atomoxetine), parent training, behavioural classroom strategies, organisation skills training.
- Anxiety and depression: CBT targets attentional processes, such as dropping safety behaviours and shifting attention outward in social anxiety. Wells's attention training technique and metacognitive therapy aim to increase flexible control of attention. Attention bias modification, training attention away from threat, showed early promise, but larger trials found small and inconsistent effects.
- Mindfulness-based interventions train sustained, non-judgemental attention and reduce relapse in recurrent depression.
- Schizophrenia: cognitive remediation therapy improves attention and executive functions modestly, especially combined with rehabilitation.

## Conclusion
Attention problems are central to many disorders, but they differ: ADHD involves control and sustained attention deficits, anxiety a bias towards threat, depression difficulty disengaging from negative material and rumination, and schizophrenia filtering and salience problems. Understanding these patterns guides assessment and targeted treatment.`,
    keyPoints: ["Distinction between deficits and biases", "ADHD deficits with neural basis and theories", "Threat bias in anxiety with dot probe and Stroop evidence", "Attentional control theory or self-focus in social anxiety", "Depression: disengagement and rumination", "Schizophrenia: gating, salience, CPT", "Assessment tools including Indian norms", "Treatments including limits of attention bias modification"],
    module: "sensation-perception/3-3",
    visuals: [
      { kind: "sort", caption: "Treatment", data: { prompt: "Which attention problem is most typical of each disorder?", buckets: ["ADHD", "Anxiety", "Depression", "Schizophrenia"], items: [{ text: "Faster to notice a threatening face", bucket: 1 }, { text: "Variable reaction times and lapses on long tasks", bucket: 0 }, { text: "Stuck on sad material, ruminating", bucket: 2 }, { text: "Irrelevant events feel meaningful; poor sensory gating", bucket: 3 }] } },
    ],
    ref: "Barkley 1997; Sonuga-Barke 2003; Bar-Haim et al 2007 Psychological Bulletin; Eysenck et al 2007; Clark and Wells 1995; Kapur 2003 aberrant salience; Freedman et al 1987 P50 gating; Wells 2009; Cristea et al 2015 ABM meta-analysis",
  },
  {
    id: "pa-l04-037",
    subject: S,
    topic: "perceptual-recognition",
    marks: 10,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "md-psychiatry"],
    question: "How do we recognise faces? Discuss holistic processing, the fusiform face area, prosopagnosia and the debate about whether faces are special.",
    plan: ["Why faces are a special case", "Holistic and configural processing evidence", "Fusiform face area and face-selective cells", "Prosopagnosia: acquired and developmental", "Expertise hypothesis versus face-specific view", "Models of face recognition and conclusion"],
    answer: `## Why faces?
Faces convey identity, emotion, age, gender, attention and intention. Humans recognise thousands of faces quickly and accurately, although all faces share the same basic arrangement of eyes, nose and mouth. The question is whether face recognition uses special mechanisms.

## Holistic and configural processing
- Composite face effect: when the top half of one person's face is aligned with the bottom half of another's, people find it hard to recognise the top half, because the halves fuse into a new face. Misaligning them removes the difficulty.
- Part-whole effect: James Tanaka and Martha Farah found that a feature, such as a nose, is recognised better within the whole face than alone, but this advantage does not occur for houses.
- Face inversion effect: Robert Yin found that turning faces upside down impairs their recognition more than it does for other objects. The Thatcher illusion, in which inverted eyes and mouth in an upside-down face look normal but grotesque when the face is turned upright, shows that configural information is lost with inversion.

## Neural basis
- Nancy Kanwisher identified the fusiform face area (FFA) in the right fusiform gyrus, which responds much more strongly to faces than to other objects.
- The occipital face area and the superior temporal sulcus (for changeable aspects such as gaze and expression) form a face network with the amygdala.
- In monkeys, Charles Gross and later Doris Tsao found face-selective cells and patches in the temporal lobe.
- The N170 ERP component, about 170 milliseconds after a face appears, is larger for faces than other objects.
- Newborns orient preferentially to face-like patterns, suggesting an early bias.

## Prosopagnosia
Prosopagnosia (face blindness) is the inability to recognise familiar faces despite normal vision and intelligence.
- Acquired prosopagnosia follows damage to the fusiform and occipitotemporal regions, usually bilateral or right-sided. Patients may recognise people by voice, gait or clothes but not by face, even their own reflection.
- Developmental (congenital) prosopagnosia occurs without brain injury and may affect about 2 percent of people; it often runs in families.
- Some patients show covert recognition: greater skin conductance to familiar faces they cannot name, as Daniel Tranel and Antonio Damasio found.
- The reverse dissociation, intact face recognition with impaired object recognition, was shown in patient C.K., studied by Morris Moscovitch, who could recognise faces but not objects, supporting separate mechanisms.

## Are faces special?
- Domain-specific view (Kanwisher): the FFA is a module specialised for faces.
- Expertise hypothesis (Isabel Gauthier): the FFA supports expert recognition of any category whose members share a configuration. Car and bird experts show FFA activation and inversion effects for cars or birds; training people to recognise novel objects called "Greebles" increased FFA activity.
- The debate continues; many researchers accept that faces are processed by specialised areas that may develop through extensive early experience.

## Models of face recognition
Vicki Bruce and Andy Young's model proposes stages: structural encoding, face recognition units (familiarity), person identity nodes (who it is) and name generation. Separate routes handle expression and lip reading. It explains everyday errors such as recognising a face as familiar but being unable to place it, and why names are hardest to retrieve.

## Conclusion
Faces are recognised holistically by a specialised network centred on the fusiform face area. Prosopagnosia and covert recognition show that face identity can be selectively lost or processed without awareness. Whether this specialisation is innate or produced by expertise remains debated.`,
    keyPoints: ["Importance of faces", "Composite and part-whole effects", "Inversion and Thatcher illusion", "Fusiform face area and N170", "Acquired and developmental prosopagnosia", "Covert recognition and patient C.K.", "Kanwisher versus Gauthier debate", "Bruce and Young model"],
    module: "sensation-perception/2-8",
    visuals: [
      { kind: "compare", data: { title: "Are faces special?", a: { label: "Face-specific (Kanwisher)", points: ["FFA responds most to faces", "Prosopagnosia can spare objects", "Newborns prefer face patterns"], summary: "A face module." }, b: { label: "Expertise (Gauthier)", points: ["Bird and car experts activate the FFA", "Training with Greebles increases FFA activity", "Inversion effects for expert categories"], summary: "Expert recognition area." } } },
      { kind: "brainmap", caption: "Neural basis", data: { title: "The face network", focus: ["temporal", "occipital", "amygdala"], notes: { temporal: "Fusiform face area (underside of the temporal lobe) and superior temporal sulcus.", occipital: "Occipital face area.", amygdala: "Emotional expressions." } } },
    ],
    ref: "Yin 1969; Tanaka and Farah 1993; Kanwisher, McDermott and Chun 1997; Gauthier and Tarr 1997; Bruce and Young 1986; Tranel and Damasio 1985; Moscovitch, Winocur and Behrmann 1997",
  },
  {
    id: "pa-l04-038",
    subject: S,
    topic: "perceptual-recognition",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net"],
    question: "Write a short note on template matching and feature analysis theories of pattern recognition.",
    plan: ["The pattern recognition problem", "Template matching and its problems", "Feature analysis and Pandemonium", "Evidence and limits"],
    answer: `## The problem
Pattern recognition means identifying a stimulus as a member of a category, such as reading a handwritten letter A, despite variations in size, orientation, style and position.

## Template matching
Template theories propose that the brain stores templates, miniature copies of patterns, and recognises input by finding the template that matches it best. Machines reading barcodes and bank cheque numbers use this approach.
Problems:
- An enormous number of templates would be needed to cover every size, slant, handwriting style and font.
- It cannot easily handle rotated, distorted or partly hidden patterns.
- It does not explain how new patterns are recognised.
Normalisation (adjusting size and orientation first) helps, but the theory remains implausible for human vision.

## Feature analysis
Feature theories propose that patterns are analysed into basic features, such as horizontal, vertical and diagonal lines, curves and angles, and recognised by their combination. The letter A has two diagonals and a horizontal.
- Oliver Selfridge's Pandemonium model: image demons record the input, feature demons detect features, cognitive demons for each letter "shout" in proportion to the features they find, and a decision demon picks the loudest.
- Evidence: Eleanor Gibson found that letters sharing many features (such as P and R) are confused more often. Ulric Neisser found that searching for a letter among letters with similar features (Z among angular letters) was slower than among dissimilar ones (Z among rounded letters). Hubel and Wiesel's feature detectors provide a physiological basis.

## Limits
Feature theories ignore the relations between features (the same lines make both T and an L-shape), and context effects show that recognition also depends on top-down knowledge. Structural theories such as Irving Biederman's recognition by components address the relations.`,
    keyPoints: ["Pattern recognition problem", "Template matching and its problems", "Feature analysis with letter example", "Pandemonium model", "Supporting evidence such as Neisser's search", "Limits including relations and context"],
    module: "sensation-perception/2-8",
    visuals: [
      { kind: "flow", caption: "Feature analysis", data: { title: "Selfridge's Pandemonium", layout: "chain", nodes: [{ id: "i", label: "Image demons", detail: "Record the input." }, { id: "f", label: "Feature demons", detail: "Detect lines, curves and angles." }, { id: "c", label: "Cognitive demons", detail: "Each letter shouts louder the more of its features it finds." }, { id: "d", label: "Decision demon", detail: "Picks the loudest: 'It is an R'." }] } },
    ],
    ref: "Selfridge 1959; Neisser 1964; Gibson 1969; Atkinson and Hilgard ch 5",
  },
  {
    id: "pa-l04-039",
    subject: S,
    topic: "perceptual-recognition",
    marks: 20,
    difficulty: 4,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Critically evaluate the major theories of object recognition, including Marr's computational theory, Biederman's recognition by components and view-based theories. What does evidence from visual agnosia contribute?",
    plan: ["The problem of object constancy", "Marr's computational approach and stages", "Biederman's geons and evidence", "View-based theories and evidence", "Context, top-down effects and deep networks", "Agnosia evidence, synthesis and conclusion"],
    answer: `## The problem
Object recognition is the process of identifying what an object is from the pattern of light it reflects. The challenge is object constancy: the same object produces very different retinal images from different viewpoints, distances and lighting, and different objects can produce similar images. Theories differ on whether the brain builds a viewpoint-independent model of the object or stores many views.

## Marr's computational theory
David Marr, in his 1982 book "Vision", argued that vision must be understood at three levels: the computational goal, the algorithm and representations, and the neural implementation. He proposed a series of representations:
- The primal sketch: a two-dimensional description of intensity changes, edges, bars, blobs and their groupings. The raw primal sketch detects local changes; the full primal sketch groups them.
- The two-and-a-half-dimensional sketch: a viewer-centred description of visible surfaces, their depth and orientation, using cues such as shading, texture, motion and stereo.
- The three-dimensional model representation: an object-centred description, independent of viewpoint, built of hierarchically organised cylinder-like components along major axes (Marr and Keith Nishihara). A human figure is a large cylinder (torso) with smaller cylinders for limbs, each subdivided.
Strengths: a rigorous framework linking computation and biology; influenced computer vision and cognitive neuroscience; recognition from a viewpoint-independent model explains constancy.
Weaknesses: limited evidence that the brain builds full 3D models; the theory deals mainly with bottom-up processing, neglecting knowledge and context; recognising objects without clear axes (crumpled paper, clouds) is difficult to explain.

## Biederman's recognition by components
Irving Biederman in 1987 proposed that objects are recognised by their components, a set of about 36 basic three-dimensional shapes called geons (geometrical ions), such as cylinders, cones, blocks and wedges. A mug is a curved cylinder attached to the side of a larger cylinder; a bucket is the same components with the handle on top.
- Geons are defined by non-accidental properties that remain stable across most viewpoints: straight versus curved edges, parallel lines, symmetry, co-termination of edges.
- Edges at concavities (where parts join) are critical for identifying geons.
- Like letters forming words, a small set of geons and their spatial relations can describe a vast number of objects.
Evidence:
- Biederman deleted parts of line drawings. When deletions removed the concavities and junctions that define geons, objects became unrecognisable; when equal amounts of contour were deleted from the middle of segments, recognition remained good.
- Objects can be recognised from simplified drawings with two or three geons.
- Recognition is often fairly constant across viewpoints, provided the same geons remain visible.
Weaknesses:
- It explains basic-level recognition (a dog) better than within-category discrimination (which breed, or which person's face), where geons are identical.
- Many natural objects (trees, animals, faces) are not easily described in geons.
- Viewpoint does affect recognition more than the theory predicts.
- It neglects colour, texture and context, which help recognition.

## View-based theories
Michael Tarr, Heinrich Bulthoff and others proposed that the brain stores multiple two-dimensional views of objects, and recognises a new view by comparing it with stored views, by interpolation or normalisation (mental rotation).
Evidence:
- Recognition time and accuracy depend on how far the test view differs from studied views, especially for novel objects and within-category discriminations. Tarr found that with practice, recognition became fast for practised views but stayed slow for novel views.
- Canonical views: Stephen Palmer, Eleanor Rosch and Paul Chase found that objects are recognised fastest from a typical three-quarter view (a car seen from the front and side).
- Neurons in monkey inferotemporal cortex often respond best to particular views of objects, with some responding across views.
Weaknesses: storing many views for every object could be uneconomical, and some recognition is viewpoint invariant.

## Reconciliation
Many researchers now believe that both types of representation exist. Viewpoint-invariant, part-based recognition may suffice for easy basic-level discrimination, while view-based processing is needed for fine discriminations among similar objects. Hierarchical models such as Maximilian Riesenhuber and Tomaso Poggio's HMAX, and modern deep convolutional neural networks, build increasingly complex and invariant features through many layers, much like the ventral stream from V1 to inferotemporal cortex; their internal representations predict primate neural responses surprisingly well, though they can be fooled in ways humans are not.

## Context and top-down effects
Recognition is faster and more accurate in a consistent scene (a loaf of bread in a kitchen) than in an inconsistent one (Stephen Palmer). Moshe Bar showed that rapid, coarse information reaches the orbitofrontal cortex and generates predictions that guide recognition in the temporal lobe. Bottom-up theories alone underestimate the role of knowledge.

## Evidence from visual agnosia
Visual agnosia is the inability to recognise objects visually despite adequate vision, intelligence and language; objects may be recognised by touch or sound.
- Apperceptive agnosia: failure to form a coherent percept. Patients cannot copy drawings or match shapes, as with patient D.F., who after carbon monoxide poisoning could not recognise objects or report orientation, yet could post a card through a slot accurately, supporting separate ventral and dorsal streams.
- Associative agnosia: patients perceive and copy objects well but cannot attach meaning to them. Patient H.J.A., studied by Glyn Humphreys and Jane Riddoch, could make a detailed copy of an etching of St Paul's Cathedral but could not identify it, and described a carrot as perhaps "a brush", showing that perception and recognition are separable stages.
- Integrative agnosia: H.J.A. could see parts but not integrate them into a whole.
- Category-specific deficits: some patients lose recognition of living things but not artefacts, or the reverse, suggesting knowledge is organised by category or by sensory versus functional features.
- Prosopagnosia selectively affects faces.
These dissociations support stage models like Marr's (early perceptual stages versus later recognition), show the importance of part integration emphasised by Biederman, and reveal category organisation that neither theory predicts.

## Conclusion
Marr provided the framework of stages from edges to 3D models; Biederman showed how a small set of components can support basic-level recognition; view-based theories explain viewpoint effects and fine discriminations. Agnosia shows that perception, integration and meaning are separable stages. The current consensus combines part-based and view-based representations in a hierarchical ventral stream, guided by context and prediction.`,
    keyPoints: ["Problem of object constancy", "Marr's three representations and levels of analysis", "Strengths and weaknesses of Marr", "Biederman's geons and non-accidental properties", "Deletion experiment evidence", "View-based theory evidence: Tarr, canonical views", "Reconciliation including hierarchical or deep network models", "Agnosia types with D.F. and H.J.A."],
    pitfalls: ["Describing theories without evaluating them", "Confusing apperceptive and associative agnosia"],
    module: "sensation-perception/2-8",
    visuals: [
      { kind: "flow", caption: "Marr's computational theory", data: { title: "Marr's stages of vision", layout: "chain", nodes: [{ id: "i", label: "Image", detail: "Light intensities on the retina." }, { id: "p", label: "Primal sketch", detail: "Edges, bars, blobs." }, { id: "s", label: "Two-and-a-half-D sketch", detail: "Visible surfaces and depth, from the viewer's position." }, { id: "m", label: "3D model", detail: "Object-centred cylinders along axes." }] } },
      { kind: "compare", caption: "Evidence from visual agnosia", data: { title: "Two kinds of agnosia", a: { label: "Apperceptive", points: ["Cannot form a coherent shape", "Cannot copy or match drawings", "Patient D.F."], summary: "Perception fails." }, b: { label: "Associative", points: ["Can copy a drawing well", "Cannot say what it is", "Patient H.J.A. copying St Paul's"], summary: "Meaning fails." } } },
    ],
    ref: "Marr 1982; Marr and Nishihara 1978; Biederman 1987 Psychological Review; Tarr 1995; Palmer, Rosch and Chase 1981; Riesenhuber and Poggio 1999; Bar 2004; Humphreys and Riddoch 1987; Milner and Goodale 1995; Yamins et al 2014",
  },
  {
    id: "pa-l04-040",
    subject: S,
    topic: "theories-of-perception",
    marks: 10,
    difficulty: 3,
    exams: ["mcp-entrance", "md-psychiatry"],
    question: "Interview question: \"Perception is a controlled hallucination.\" What does this mean, and how does it help us understand hallucinations in psychosis?",
    plan: ["Explain the phrase and predictive processing", "Evidence from normal perception", "Hallucinations as strong priors", "Experimental evidence in hallucination-prone people", "Clinical implications and a balanced closing"],
    answer: `## What the phrase means
The phrase, used by the neuroscientist Anil Seth and drawing on Chris Frith and Andy Clark, expresses the predictive processing view of perception. The brain does not passively receive the world; it constantly generates predictions (priors) about what is causing its sensory input, and compares them with the actual input. The difference, the prediction error, is used to update the predictions. What we experience is the brain's best guess. Normal perception is a hallucination "controlled" by sensory input; a hallucination is perception insufficiently constrained by input.

## Evidence from normal perception
- Illusions and ambiguous figures show that expectation shapes perception, as in the hollow face illusion, where the prior that faces are convex overrides depth cues.
- Phonemic restoration: listeners hear speech sounds that have been replaced by noise.
- Sine-wave speech: a degraded recording sounds like whistles until people hear the original sentence, after which they hear words clearly in the same degraded recording, because their predictions have changed.
- Expectation changes neural responses in visual cortex before the stimulus arrives.
- The placebo effect on pain shows predictions altering experience.

## Hallucinations as strong priors
In psychosis, auditory hallucinations may arise when prior expectations are given too much weight relative to sensory evidence, so the brain "hears" predicted voices in ambiguous noise. Alternatively, disordered weighting of prediction errors may cause irrelevant events to seem significant, as in Shitij Kapur's aberrant salience theory linked to excess dopamine, leading to delusional explanations.
A related account explains passivity experiences and voices as a failure of self-monitoring: Frith proposed that the brain normally predicts the sensory consequences of its own actions and inner speech (via an efference copy) and dampens them. That is why we cannot tickle ourselves. If this prediction fails, inner speech may be experienced as an external voice. Sarah-Jayne Blakemore found that people with hallucinations or passivity experiences rated self-produced touch as more ticklish than controls did.

## Experimental evidence
- Albert Powers and colleagues used Pavlovian conditioning: participants learned to associate a light with a tone, and later "heard" the tone when only the light appeared. People who hear voices, whether patients or non-clinical voice hearers such as psychics, showed more conditioned hallucinations and were more confident in them, and modelling indicated stronger reliance on priors.
- Hallucination-prone people more often report hearing words in white noise or detect expected speech, consistent with a liberal criterion in signal detection terms.
- Studies with two-tone images show that early psychosis and psychosis-prone people make greater use of prior knowledge to see the hidden image.

## Clinical implications
- Hallucinations are an extreme of normal perceptual processes, not an entirely alien phenomenon, which helps reduce stigma and supports normalising explanations in CBT for psychosis.
- Hallucinations occur on a continuum in the general population, during bereavement, sleep deprivation and sensory deprivation (Charles Bonnet syndrome in visual loss).
- Therapies can target beliefs about voices, and approaches such as avatar therapy help patients change their relationship with voices.
- Antipsychotics, by blocking dopamine D2 receptors, may reduce aberrant salience and the precision given to faulty predictions.

## Closing
"So the phrase means that all perception is the brain's active construction, normally anchored by the senses. In psychosis, the balance tips towards expectation, or self-generated signals are not recognised as one's own. It is a useful framework, though still a theory, and the experience of each patient also needs to be understood in their personal and cultural context, including how voices are interpreted in their community."`,
    keyPoints: ["Explains predictive processing and prediction error", "Normal perception as controlled hallucination", "Evidence such as sine-wave speech or hollow face", "Strong priors account of hallucinations", "Self-monitoring and tickling evidence", "Powers' conditioned hallucination study", "Continuum and clinical implications", "Balanced closing with cultural context"],
    module: "sensation-perception/3-1",
    visuals: [
      { kind: "flow", caption: "What the phrase means", data: { title: "Predictive perception", layout: "cycle", nodes: [{ id: "p", label: "Prediction", detail: "The brain's best guess about the world." }, { id: "s", label: "Sensory input", detail: "Signals from eyes and ears." }, { id: "e", label: "Prediction error", detail: "Difference between guess and input." }, { id: "u", label: "Update", detail: "Revise the guess; in psychosis the guess may win too easily." }] } },
    ],
    ref: "Seth 2021 Being You; Frith 1992 and 2007; Clark 2013; Blakemore et al 2000; Powers, Mathys and Corlett 2017 Science; Kapur 2003; Teufel et al 2015 PNAS two-tone images",
  },
];
