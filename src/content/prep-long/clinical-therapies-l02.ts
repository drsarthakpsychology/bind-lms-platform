import type { LongQA } from "@/lib/prep/long-types";
import { anchored, chain, cycle, layers, vis } from "./visual";

export const CLINICAL_THERAPIES_L02: LongQA[] = anchored([
  {
    id: "ther-l02-001",
    subject: "clinical-therapies",
    topic: "cbt-depression",
    marks: 15,
    difficulty: 2,
    exams: ["mcp-entrance", "ma-semester", "md-psychiatry"],
    question: "Describe cognitive behaviour therapy for depression: its theoretical basis, structure, techniques and evidence.",
    plan: ["Theoretical basis in Beck's model", "Principles and session structure", "Behavioural techniques", "Cognitive techniques at three levels", "Relapse prevention, evidence and adaptations for India", "Conclusion"],
    answer: `## Theoretical basis
Aaron Beck's cognitive model holds that depression is maintained by negative automatic thoughts, the cognitive triad (negative views of self, world and future) and systematic thinking errors, which arise from dysfunctional assumptions and core beliefs formed in early life and activated by matching stress. Thoughts, emotions, behaviour and bodily state interact in vicious cycles; changing thinking and behaviour changes mood.

## Principles
- Collaborative empiricism: therapist and patient work as a team, treating thoughts as hypotheses to test.
- Structured, time limited (usually 12 to 20 weekly sessions), problem focused and present oriented.
- Guided discovery through Socratic questioning rather than lecturing.
- Homework between sessions.
- Measurement of mood and progress (for example, with the Beck Depression Inventory or PHQ 9).

## Session structure
Mood check, bridge from the last session, agenda setting, review of homework, work on agenda items, new homework, summary and feedback.

## Behavioural techniques
Used first, especially in more severe depression:
- Activity monitoring: recording activities hour by hour with ratings of mastery and pleasure.
- Activity scheduling: planning valued and pleasant activities.
- Graded task assignment: breaking tasks into small steps.
- Behavioural experiments to test predictions ("If I go out, I will feel worse").
- Problem solving.

## Cognitive techniques
Automatic thoughts:
- Identifying them in situations of mood change ("hot thoughts").
- Thought records: situation, emotion with rating, automatic thought, evidence for and against, alternative balanced thought, re-rating of emotion.
- Recognising thinking errors (all or nothing thinking, overgeneralisation, mind reading, catastrophising, personalisation).
Assumptions and rules:
- Identifying "if, then" rules ("If I am not perfect, I am a failure") and testing them with behavioural experiments and cost benefit analysis.
Core beliefs:
- The downward arrow technique to uncover core beliefs ("I am worthless"), positive data logs, historical review and continua to build new beliefs.

## Common difficulties
- Patients who say "I know it in my head but don't feel it": use behavioural experiments, which change belief more than discussion.
- Hopelessness and low energy: start with small behavioural steps and reinforce every effort.
- Homework not done: explore barriers kindly and simplify tasks.
- Suicidal ideas: assess risk at every session and build a safety plan.

## Relapse prevention
Summary of learning (a "blueprint"), identifying early warning signs and high risk situations, booster sessions. Mindfulness based cognitive therapy (MBCT) is effective in preventing relapse in people with three or more previous episodes.

## Evidence
- CBT is effective for mild to moderate depression and, in skilled hands, comparable to antidepressants in moderate to severe outpatient depression (as in the trial by DeRubeis and Hollon).
- It reduces relapse after treatment ends, more than stopping medicines.
- Combined CBT and medicines is better than either alone for more severe and chronic depression.
- A component analysis (Jacobson) found behavioural activation alone was as effective as full CBT, which led to renewed interest in BA.
- Group, guided self help, internet and lay counsellor delivered CBT formats are effective.

## Adaptations for India
- Use of local idioms and somatic complaints as entry points.
- Involving family members, who often attend sessions.
- Brief formats suited to busy clinics; task shared versions such as the Healthy Activity Programme delivered by lay counsellors in Goa.
- Attention to literacy (using pictures and verbal rather than written homework) and cultural values such as duty and family harmony.

## Conclusion
CBT for depression is a structured, collaborative therapy that targets negative thinking and inactivity. It has strong evidence for acute treatment and relapse prevention and can be adapted for Indian settings.`,
    keyPoints: ["Beck's cognitive model and triad", "Collaborative empiricism and Socratic questioning", "Session structure", "Behavioural techniques: monitoring, scheduling, graded tasks", "Thought records and thinking errors", "Assumptions and downward arrow for core beliefs", "Evidence including relapse prevention and Jacobson", "Indian adaptations"],
    visuals: [
      layers("Cognitive techniques", "iceberg", [["Automatic thoughts", "Quick, situation specific, easy to catch"], ["Assumptions and rules", "If I fail, people will reject me"], ["Core beliefs", "I am worthless"]], "Work starts above the water and moves deeper."),
      vis("thoughtrecord", { situation: "I got a lower mark than my friends in the test.", thought: "I am stupid and will never succeed.", emotion: "sad", traps: [{ label: "Overgeneralisation", right: true, why: "One test is taken as proof about your whole future." }, { label: "Labelling", right: true, why: "Calling yourself stupid instead of describing one result." }, { label: "Mind reading", why: "The thought is about you, not about what others think." }], forEvidence: ["My mark was lower this time."], againstEvidence: ["I passed the last three tests well.", "I studied less because I was unwell."], balanced: "This test went badly for a reason I can fix. One mark does not decide my future." }),
    ],
    module: "therapies",
    ref: "Beck 1979 Cognitive Therapy of Depression; DeRubeis 2005; Jacobson 1996; Cuijpers 2013 meta-analyses; Patel 2017 HAP Lancet",
  },
  {
    id: "ther-l02-002",
    subject: "clinical-therapies",
    topic: "rebt",
    marks: 10,
    difficulty: 2,
    exams: ["mcp-entrance", "ma-semester", "ugc-net"],
    question: "Describe rational emotive behaviour therapy. How does it differ from Beck's cognitive therapy?",
    plan: ["Ellis and the basic idea", "ABCDE model", "Irrational beliefs", "Techniques", "Comparison with CBT", "Evidence and conclusion"],
    answer: `## Basic idea
Albert Ellis developed rational emotive therapy in 1955, later renamed rational emotive behaviour therapy (REBT). He argued that people are disturbed not by events but by their rigid, irrational beliefs about events, echoing the Stoic philosopher Epictetus.

## The ABCDE model
- A: activating event (failing an interview).
- B: belief about the event ("I must succeed, and it is awful that I failed; I am a failure").
- C: emotional and behavioural consequence (depression, avoidance).
- D: disputing the irrational belief.
- E: effective new belief and healthier emotion ("I strongly prefer to succeed, but I do not have to; failing is bad but not awful; I am a fallible human, not a failure"), leading to disappointment rather than depression.

## Irrational beliefs
Ellis saw "musts" (demandingness) as the core, with three main forms:
- Demands about self: "I must perform well and win approval, or I am worthless."
- Demands about others: "Others must treat me fairly, or they are bad."
- Demands about life: "Life must be easy and comfortable."
Derivatives: awfulising, low frustration tolerance ("I can't stand it"), and global rating of self or others (self downing). REBT distinguishes healthy negative emotions (concern, sadness, remorse, disappointment) from unhealthy ones (anxiety, depression, guilt, shame), which come from irrational beliefs.

## Techniques
- Cognitive disputing: empirical ("Where is the evidence that you must?"), logical ("Does it follow that because you want it, you must have it?") and pragmatic ("Where will this belief get you?").
- Rational coping statements and reading (bibliotherapy).
- Emotive methods: rational emotive imagery, shame attacking exercises (deliberately doing harmless "embarrassing" things in public to learn that disapproval is bearable), forceful self statements, humour.
- Behavioural methods: homework, exposure, skills training, "stay in there" exercises.
- Unconditional self acceptance, other acceptance and life acceptance as goals.

## Comparison with Beck's cognitive therapy
| Feature | REBT | Beck's cognitive therapy |
| Core cognitive target | Absolute "musts" and their derivatives | Automatic thoughts, assumptions, core beliefs, thinking errors |
| Style | Active, directive, persuasive, sometimes confrontational | Collaborative empiricism, guided discovery |
| Method | Philosophical disputing early | Testing thoughts as hypotheses with evidence and experiments |
| Emotions | Healthy versus unhealthy negative emotions | Reduce intensity of distressing emotion |
| Self esteem | Rejects self rating; unconditional self acceptance | Builds a more balanced self view |
| Research base | Smaller | Larger, disorder specific protocols |

## Evidence
REBT has moderate evidence in meta analyses for anxiety, depression and general distress, and is widely used in counselling, schools and workplaces. Beck's CBT has a larger research base with disorder specific protocols.

## Conclusion
REBT targets rigid demands and promotes self acceptance through vigorous disputing and emotive exercises. It shares with Beck's therapy the idea that thinking shapes emotion, but differs in its focus on "musts", its directive style and its philosophy of acceptance.`,
    keyPoints: ["Ellis 1955 and Epictetus", "ABCDE with an example", "Demandingness and its three forms", "Awfulising, low frustration tolerance, self downing", "Healthy versus unhealthy negative emotions", "Empirical, logical, pragmatic disputing and shame attacking", "Comparison table with Beck", "Evidence"],
    visuals: [chain("The ABCDE model", [["A: Activating event", "Failed an interview"], ["B: Belief", "I must succeed; I am a failure"], ["C: Consequence", "Depression, avoidance"], ["D: Dispute", "Where is the evidence that I must?"], ["E: Effective new belief", "I prefer to succeed but I do not have to"]])],
    module: "therapies",
    ref: "Ellis 1962 Reason and Emotion in Psychotherapy; David 2018 REBT meta-analysis; Dryden REBT",
  },
  {
    id: "ther-l02-003",
    subject: "clinical-therapies",
    topic: "socratic-questioning",
    marks: 5,
    difficulty: 2,
    exams: ["mcp-entrance", "ma-semester"],
    question: "Write short notes on Socratic questioning in cognitive therapy.",
    plan: ["Definition and purpose", "Padesky's four stages", "Example questions", "Pitfalls"],
    answer: `## Definition and purpose
Socratic questioning, named after the Greek philosopher Socrates, is a style of guided discovery in which the therapist asks open questions that help the patient examine their own thoughts, notice information they had overlooked and reach their own conclusions. It is preferred to telling the patient they are wrong, because conclusions people reach themselves are more convincing and lasting.

## Padesky's four stages
Christine Padesky described guided discovery as:
- Asking informational questions that bring relevant facts into awareness.
- Listening carefully and reflecting.
- Summarising the new information.
- Asking synthesising or analytical questions that help the person apply the new information to the original belief.

## Example questions
- "What makes you think that? What is the evidence for and against it?"
- "Is there another way of looking at this situation?"
- "What would you say to a friend who had this thought?"
- "What is the worst that could happen? The best? The most likely?"
- "If this thought were true, what would it mean about you?" (leading towards core beliefs)
- "How has thinking this way affected you?"
- "What could you do to test this idea this week?"

## Pitfalls
- Using questions to trap or argue ("Don't you think you're overreacting?").
- Asking closed or leading questions with only one correct answer.
- Too many questions without summaries.
- Using it when the person is in acute crisis and needs support or problem solving.
- Cultural misfit if patients expect advice; explain the method and combine it with information where needed.

## Conclusion
Socratic questioning is the core interviewing skill of cognitive therapy, helping patients discover alternative views for themselves through curious, collaborative questions.`,
    keyPoints: ["Definition and guided discovery", "Why self discovered conclusions last", "Padesky's four stages", "Example questions", "Pitfalls including leading questions", "Cultural adaptation"],
    module: "therapies",
    ref: "Padesky 1993 Socratic questioning: changing minds or guiding discovery; Beck J. Cognitive Behavior Therapy Basics and Beyond",
  },
  {
    id: "ther-l02-004",
    subject: "clinical-therapies",
    topic: "behavioural-activation",
    marks: 10,
    difficulty: 2,
    exams: ["mcp-entrance", "ma-semester", "md-psychiatry"],
    question: "Discuss behavioural activation for depression: theory, techniques and evidence.",
    plan: ["Theoretical background", "Contemporary BA model", "Techniques", "Evidence including Indian task sharing", "Strengths, limits and conclusion"],
    answer: `## Theoretical background
- Charles Ferster and Peter Lewinsohn proposed that depression results from a low rate of response contingent positive reinforcement: when rewarding experiences fall (after loss, unemployment, illness), people withdraw, which further reduces reinforcement.
- Jacobson's component analysis in 1996 found that the behavioural activation part of CBT alone was as effective as full cognitive therapy, which led to modern BA.

## Contemporary model
In the BA model developed by Martell, Addis and Jacobson, life events reduce rewards and increase stress; people respond with avoidance and withdrawal (secondary coping), such as staying in bed, ruminating or avoiding friends. These give short term relief but keep depression going. BA targets this avoidance by helping people re-engage with activities that bring pleasure, mastery and meaning, guided by their values.

## Techniques
- Psychoeducation using the model: "act from the outside in" rather than waiting to feel motivated.
- Activity monitoring: recording what one does and how it affects mood.
- Values assessment: identifying what matters (family, health, faith, work, friendships).
- Activity scheduling: planning specific, achievable activities linked to values.
- Graded task assignment: breaking tasks into small steps.
- Functional analysis of avoidance using TRAP (trigger, response, avoidance pattern) and replacing it with TRAC (trigger, response, alternative coping).
- Targeting rumination: noticing it, considering its function, shifting attention to direct experience or action.
- Problem solving and troubleshooting barriers.
- Involving family and friends.

## Evidence
- Randomised trials (such as Dimidjian's 2006 trial) found BA as effective as antidepressants and better than cognitive therapy in more severe depression in one study.
- The large COBRA trial in the UK showed BA delivered by junior mental health workers was as effective as CBT delivered by professionals, and cheaper.
- In India, the Healthy Activity Programme, a BA based therapy delivered by lay counsellors in primary care in Goa, was effective and cost effective for moderate to severe depression in the PREMIUM trial.

## Strengths and limits
Strengths: simple, easy to train, less dependent on literacy and abstract thinking, adaptable across cultures and delivered by non specialists. Limits: less direct work on deep beliefs; may be harder in severe anhedonia or psychotic depression; needs adaptation for people with physical disability or poverty that restricts activity.

## Conclusion
Behavioural activation is a parsimonious, evidence based therapy that breaks the cycle of avoidance and low reward in depression and is ideally suited to task sharing in low resource settings like India.`,
    keyPoints: ["Ferster and Lewinsohn reinforcement theory", "Jacobson component analysis", "Avoidance as secondary coping", "Activity monitoring, values, scheduling, graded tasks", "TRAP and TRAC", "Rumination work", "Dimidjian and COBRA trials", "Healthy Activity Programme in India"],
    visuals: [cycle("Contemporary model: the depression cycle", [["Low mood", ""], ["Avoidance", "Stay in bed, skip friends"], ["Fewer rewards", "Less pleasure and mastery"], ["More problems", "Work and relationships suffer"], ["Lower mood", ""]], "Activity scheduling breaks the loop at avoidance.")],
    module: "therapies",
    ref: "Lewinsohn 1974; Martell 2001; Dimidjian 2006; Richards 2016 Lancet COBRA; Patel 2017 HAP",
  },
  {
    id: "ther-l02-005",
    subject: "clinical-therapies",
    topic: "cbtp",
    marks: 10,
    difficulty: 3,
    exams: ["mcp-entrance", "md-psychiatry"],
    question: "Describe cognitive behaviour therapy for psychosis.",
    plan: ["Rationale and cognitive models of psychosis", "Aims", "Components", "Evidence", "Adaptations and conclusion"],
    answer: `## Rationale and models
Medicines do not fully relieve psychosis for many people, and distress often depends on how experiences are interpreted. Cognitive models (Garety, Kuipers, Freeman, Morrison) propose that psychotic experiences arise from anomalous experiences (caused by biological vulnerability, stress or drugs) that are appraised as external, threatening or significant. Reasoning biases (jumping to conclusions, belief inflexibility), emotional states (anxiety, depression), negative schemas about self and others, and safety behaviours maintain them. Beliefs about voices (their power and intent) predict distress and compliance more than voice content.

## Aims
CBT for psychosis (CBTp) aims to reduce distress and disability, not necessarily to eliminate symptoms. It helps people make sense of their experiences, reduce the conviction and impact of distressing beliefs, cope with voices, prevent relapse and pursue recovery goals.

## Components
- Engagement and a collaborative, non confrontational relationship; starting from the person's goals.
- Normalising: explaining that unusual experiences are common under stress and sleep loss.
- Developing a shared formulation linking life events, beliefs, emotions and experiences.
- Work on delusions: examining evidence, generating alternative explanations, behavioural experiments, and reducing safety behaviours (for example, in persecutory delusions, Freeman's work on worry, sleep and self esteem).
- Work on voices: monitoring, coping strategies (humming, distraction, talking back), and testing beliefs about voice power; newer approaches such as AVATAR therapy, in which the person speaks to a computer representation of the voice.
- Treating comorbid anxiety, depression, trauma and low self esteem.
- Relapse prevention: early warning signs and action plans.
- Family involvement where possible.

## Evidence
Meta analyses show small to moderate effects on positive symptoms and distress, with larger effects in some trials and smaller effects in well controlled ones. CBTp is recommended by guidelines (for example NICE) for all people with psychosis, alongside medicines. Targeted interventions (on worry or sleep in persecutory delusions) show promise. CBT also helps people who decline medicines, though evidence here is limited.

## Adaptations
In India, adaptations include working with family explanatory models (spirit possession, black magic) respectfully, briefer sessions, involving relatives, using simple language and visual aids, and training non specialist therapists.

## Conclusion
CBT for psychosis helps people understand and cope with psychotic experiences, reducing distress and disability. It is an evidence based complement to medicines, with modest effects that are larger when targeted at specific mechanisms.`,
    keyPoints: ["Rationale for CBT beyond medicines", "Cognitive models with appraisal and reasoning biases", "Beliefs about voices", "Aims focused on distress", "Normalising and formulation", "Techniques for delusions and voices including AVATAR", "Evidence of small to moderate effects", "Indian adaptations"],
    visuals: [chain("Rationale and models", [["Vulnerability and stress", "Genes, trauma, cannabis, sleep loss"], ["Anomalous experience", "A voice, a strange feeling"], ["Threatening appraisal", "Someone is trying to harm me"], ["Distress and safety behaviours", "Stay inside, avoid people"], ["Belief maintained", "Never tested"]])],
    module: "psychosis",
    ref: "Garety 2001 cognitive model; Wykes 2008 meta-analysis; Freeman 2015 WIT trial; Craig 2018 AVATAR; NICE CG178",
  },
  {
    id: "ther-l02-006",
    subject: "clinical-therapies",
    topic: "metacognitive-therapy",
    marks: 5,
    difficulty: 3,
    exams: ["mcp-entrance", "md-psychiatry"],
    question: "Write short notes on metacognitive therapy.",
    plan: ["Definition and Wells", "The cognitive attentional syndrome", "Techniques", "Evidence"],
    answer: `## Definition
Metacognitive therapy (MCT), developed by Adrian Wells, focuses on metacognition: thinking about thinking. It proposes that psychological disorders are maintained not by the content of negative thoughts but by how people respond to them, which is guided by metacognitive beliefs.

## The cognitive attentional syndrome
The core maintaining process is the cognitive attentional syndrome (CAS):
- Perseverative thinking: worry and rumination.
- Threat monitoring: attention locked on danger.
- Unhelpful coping: thought suppression, reassurance seeking, avoidance, substance use.
The CAS is driven by:
- Positive metacognitive beliefs ("Worrying helps me prepare", "Ruminating will help me understand why I feel bad").
- Negative metacognitive beliefs ("My worry is uncontrollable", "Thinking this way could make me go mad").

## Techniques
- Case formulation showing how the CAS maintains the problem.
- Detached mindfulness: noticing thoughts without engaging with or acting on them (different from meditation).
- Worry or rumination postponement: noticing triggers and postponing worry to a set time, which challenges beliefs about uncontrollability.
- Attention training technique: practising shifting attention among sounds, to increase flexible control of attention.
- Situational attentional refocusing.
- Challenging positive and negative metacognitive beliefs through questioning and experiments.
It usually takes 8 to 12 sessions.

## Evidence
Trials show strong effects in generalised anxiety disorder, depression, PTSD and OCD, sometimes larger than standard CBT, but many come from the developer's group and need independent replication.

## Conclusion
Metacognitive therapy targets how people relate to their thoughts, especially worry and rumination, and has promising evidence across disorders.`,
    keyPoints: ["Wells and metacognition", "Process over content", "Cognitive attentional syndrome components", "Positive and negative metacognitive beliefs", "Detached mindfulness, postponement, attention training", "Evidence and need for replication"],
    module: "therapies",
    ref: "Wells 2009 Metacognitive Therapy for Anxiety and Depression; Normann 2014 meta-analysis",
  },
  {
    id: "ther-l02-007",
    subject: "clinical-therapies",
    topic: "thought-record",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "mcp-entrance", "ugc-net"],
    question: "Write short notes on cognitive distortions and the use of thought records.",
    plan: ["Definition", "Common distortions with examples", "The thought record columns", "Tips for use"],
    answer: `## Definition
Cognitive distortions (thinking errors) are habitual, biased ways of processing information that make negative automatic thoughts seem true. Beck described them, and David Burns popularised a list for patients.

## Common distortions
| Distortion | Example |
| All or nothing thinking | "If I don't score first, I have failed" |
| Overgeneralisation | "I always mess things up" |
| Mental filter | Focusing on one criticism and ignoring praise |
| Discounting the positive | "They only said that to be kind" |
| Mind reading | "She thinks I'm boring" |
| Fortune telling | "I will fail the interview" |
| Catastrophising | "If I make a mistake, I will lose my job and my family will suffer" |
| Emotional reasoning | "I feel useless, so I must be useless" |
| Should statements | "I should never feel sad" |
| Labelling | "I am a loser" |
| Personalisation | "My son failed because I am a bad mother" |

## The thought record
A typical seven column thought record:
- Situation: where, when, with whom.
- Emotion with intensity (0 to 100).
- Automatic thought, with belief rating, and the "hot thought" identified.
- Evidence supporting the thought.
- Evidence against the thought.
- Alternative or balanced thought, with belief rating.
- Outcome: re-rating of the emotion and belief.

## Tips
Start with simpler three column records (situation, thought, feeling); fill them in soon after mood changes; look for facts, not feelings, in the evidence columns; aim for balanced rather than artificially positive thoughts; use pictures or verbal versions for people with low literacy.

## Conclusion
Recognising cognitive distortions and using thought records helps patients step back from automatic thoughts and develop more balanced thinking, a core skill in CBT.`,
    keyPoints: ["Definition", "At least eight distortions with examples", "Seven columns of the thought record", "Hot thought", "Balanced not positive thoughts", "Adaptation for literacy"],
    visuals: [vis("thoughtrecord", { situation: "My colleague did not reply to my message.", thought: "He is ignoring me because I made a mistake.", emotion: "anxious", traps: [{ label: "Mind reading", right: true, why: "You are guessing why he did not reply." }, { label: "Personalisation", right: true, why: "You assume his silence is about you." }, { label: "All or nothing thinking", why: "The thought is not about extremes." }], forEvidence: ["He usually replies quickly."], againstEvidence: ["He is on leave today.", "He thanked me for my work yesterday."], balanced: "He is probably busy or away. I can check with him tomorrow." }, "The thought record")],
    module: "therapies",
    ref: "Beck 1979; Burns 1980 Feeling Good; Greenberger and Padesky Mind Over Mood",
  },
  {
    id: "ther-l02-008",
    subject: "clinical-therapies",
    topic: "unified-protocol",
    marks: 5,
    difficulty: 3,
    exams: ["mcp-entrance", "md-psychiatry"],
    question: "Write short notes on transdiagnostic CBT and the Unified Protocol.",
    plan: ["Why transdiagnostic approaches", "The Unified Protocol", "Other transdiagnostic approaches", "Evidence and value"],
    answer: `## Why transdiagnostic
Anxiety and depressive disorders often occur together and share underlying processes: strong negative emotion (neuroticism), negative appraisal of emotion, and avoidance. Learning separate protocols for each disorder is hard for therapists and does not fit patients with several problems. Transdiagnostic treatments target the shared processes.

## The Unified Protocol
David Barlow and colleagues developed the Unified Protocol for Transdiagnostic Treatment of Emotional Disorders. Its modules (usually 12 to 18 sessions) are:
- Setting goals and maintaining motivation.
- Understanding emotions: their function and the cycle of emotional experiences.
- Mindful emotion awareness: present focused, non judgemental awareness.
- Cognitive flexibility: identifying and reappraising automatic appraisals and thinking traps.
- Countering emotional behaviours: reducing avoidance and emotion driven behaviours.
- Understanding and confronting physical sensations (interoceptive exposure).
- Emotion exposures: facing situations that trigger strong emotion.
- Recognising accomplishments and planning for the future.

## Other transdiagnostic approaches
Fairburn's CBT-E for all eating disorders, Harvey's work on transdiagnostic sleep and circadian intervention, and the Common Elements Treatment Approach (CETA) for low resource settings.

## Evidence and value
Trials show the Unified Protocol is as effective as disorder specific CBT protocols for anxiety disorders, with lower dropout, and helps comorbid depression. It is efficient for training and for services, including in group and online formats, and suits task shared delivery.

## Conclusion
Transdiagnostic CBT, especially the Unified Protocol, treats the common core of emotional disorders and offers an efficient alternative to multiple disorder specific protocols.`,
    keyPoints: ["Rationale: comorbidity and shared processes", "Barlow and the Unified Protocol", "Core modules", "Other transdiagnostic approaches", "Equivalence to specific protocols", "Training and service efficiency"],
    module: "therapies",
    ref: "Barlow 2017 JAMA Psychiatry UP equivalence trial; Fairburn 2003 transdiagnostic eating disorders",
  },
  {
    id: "ther-l02-009",
    subject: "clinical-therapies",
    topic: "stress-inoculation",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "mcp-entrance"],
    question: "Write short notes on Meichenbaum's self instructional training and stress inoculation training.",
    plan: ["Meichenbaum's cognitive behaviour modification", "Self instructional training", "Stress inoculation training phases", "Uses"],
    answer: `## Background
Donald Meichenbaum developed "cognitive behaviour modification" in the 1970s, combining behaviour therapy with attention to what people say to themselves (self talk). He argued that inner speech guides behaviour and can be changed.

## Self instructional training
Originally developed for impulsive children, it teaches people to guide their behaviour with self statements. Steps:
- Cognitive modelling: the therapist performs a task while talking aloud ("What do I have to do? Go slowly. Check my work. Good job.").
- Overt external guidance: the child performs the task while the therapist gives instructions aloud.
- Overt self guidance: the child does the task while saying the instructions aloud.
- Faded overt self guidance: whispering the instructions.
- Covert self instruction: using inner speech.
It draws on Vygotsky's and Luria's ideas about internalised speech.

## Stress inoculation training
A preventive and therapeutic approach that, like a vaccine, exposes people to manageable stress to build coping. Three phases:
- Conceptualisation: education about stress and how appraisals and self talk shape it; collaborative assessment.
- Skills acquisition and rehearsal: relaxation, breathing, cognitive restructuring, problem solving, coping self statements for each stage (preparing, confronting, coping with feeling overwhelmed, reinforcing oneself afterwards).
- Application and follow through: practising skills in imagery, role play and graded real exposures; relapse prevention.

## Uses
Anger management, test and performance anxiety, pain, medical procedures, occupational stress (police, military, health workers), PTSD and impulsive behaviour in children. Trials show reductions in anxiety and improved performance under stress.

## Conclusion
Meichenbaum's methods use guided self talk and graded stress exposure to build coping, and they influenced the wider development of CBT.`,
    keyPoints: ["Cognitive behaviour modification and self talk", "Five steps of self instructional training", "Vygotsky and Luria inner speech", "Three phases of stress inoculation", "Coping statements by stage", "Uses including anger and test anxiety"],
    module: "therapies",
    ref: "Meichenbaum and Goodman 1971; Meichenbaum 1985 Stress Inoculation Training; Saunders 1996 meta-analysis",
  },
  {
    id: "ther-l02-010",
    subject: "clinical-therapies",
    topic: "low-intensity-cbt",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "mcp-entrance"],
    question: "Write short notes on low intensity and digital CBT.",
    plan: ["Definition and rationale", "Formats", "Evidence", "Indian relevance and limits"],
    answer: `## Definition and rationale
Low intensity CBT delivers CBT principles in brief, simplified forms with less therapist time, often supported by trained practitioners rather than therapists. It addresses the shortage of trained therapists and allows stepped care: low intensity first, high intensity CBT for those who need more. England's Improving Access to Psychological Therapies programme (now NHS Talking Therapies) built a national service on this model.

## Formats
- Guided self help with books or workbooks, supported by short phone or face to face sessions.
- Computerised and internet CBT (iCBT) and smartphone apps, with or without guidance.
- Psychoeducational groups and large group workshops.
- Brief structured interventions such as behavioural activation and problem solving delivered by lay counsellors.

## Evidence
Guided self help and guided iCBT are effective for mild to moderate depression and anxiety, with effects close to face to face CBT in some studies; unguided programmes have lower engagement and smaller effects. Human support improves adherence.

## Indian relevance and limits
India has very few psychologists per population, so low intensity and digital approaches are attractive: task shared programmes (Healthy Activity Programme), digital tools in Indian languages, and links with Tele MANAS. Limits include digital access and literacy, privacy at home, language and cultural fit, high dropout from apps, and unsuitability for severe illness or high suicide risk, which need specialist care.

## Conclusion
Low intensity and digital CBT widen access to effective psychological help, especially when supported by a person and embedded in stepped care.`,
    keyPoints: ["Definition and stepped care", "IAPT or NHS Talking Therapies", "Guided self help and iCBT formats", "Guided better than unguided", "Indian task shared and digital relevance", "Limits including severe illness and access"],
    module: "therapies",
    ref: "Bower and Gilbody 2005 stepped care; Clark 2018 IAPT; Karyotaki 2021 iCBT IPD meta-analysis",
  },
]);
