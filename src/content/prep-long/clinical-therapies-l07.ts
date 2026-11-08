import type { LongQA } from "@/lib/prep/long-types";
import { anchored, chain, compare, cycle, timeline } from "./visual";

export const CLINICAL_THERAPIES_L07: LongQA[] = anchored([
  {
    id: "ther-l07-001",
    subject: "clinical-therapies",
    topic: "cpt",
    marks: 5,
    difficulty: 3,
    exams: ["mcp-entrance", "ma-semester"],
    question: "Write short notes on cognitive processing therapy for PTSD.",
    plan: ["Origins and theory", "Stuck points", "Structure and techniques", "Evidence"],
    answer: `## Origins and theory
Patricia Resick developed cognitive processing therapy (CPT) in the late 1980s for survivors of sexual assault; it is now used for PTSD after many kinds of trauma. It is based on social cognitive theory: PTSD persists because the trauma conflicts with prior beliefs, and people resolve the conflict in unhelpful ways:
- Assimilation: changing memory of the event to fit old beliefs ("It was my fault; I should have prevented it").
- Over accommodation: changing beliefs too far ("No one can ever be trusted"; "The world is completely dangerous").
The goal is balanced accommodation: adjusting beliefs realistically.

## Stuck points
Stuck points are specific beliefs that keep the person stuck in PTSD, often about self blame, hindsight bias and the five themes of safety, trust, power and control, esteem, and intimacy.

## Structure and techniques
- Usually 12 weekly sessions.
- Psychoeducation about PTSD and natural recovery.
- An impact statement: the patient writes about why the trauma happened and how it changed beliefs.
- Optional written trauma account, read aloud in session (CPT with written account), though CPT without the account is equally effective.
- Socratic questioning and worksheets (ABC worksheets, challenging questions, patterns of problematic thinking) to examine stuck points.
- Work through the five themes, ending with a rewritten impact statement.

## Evidence
Many randomised trials show large reductions in PTSD and depression in civilians, veterans and refugees, with effects maintained over years. CPT is a first line trauma focused therapy in guidelines and has been delivered in group formats and in low resource settings (for example, with survivors of sexual violence in the Democratic Republic of Congo).

## Conclusion
CPT treats PTSD by identifying and challenging trauma related stuck points, especially self blame, through structured cognitive work.`,
    keyPoints: ["Resick and social cognitive theory", "Assimilation and over accommodation", "Stuck points and five themes", "Impact statement and worksheets", "Optional written account", "Evidence and first line status"],
    module: "trauma",
    ref: "Resick and Schnicke 1992; Resick 2017 CPT manual; Bass 2013 NEJM DRC group CPT",
  },
  {
    id: "ther-l07-002",
    subject: "clinical-therapies",
    topic: "exposure-prolonged",
    marks: 5,
    difficulty: 3,
    exams: ["mcp-entrance", "ma-semester"],
    question: "Write short notes on prolonged exposure therapy for PTSD.",
    plan: ["Theory", "Components", "Evidence", "Concerns and adaptations"],
    answer: `## Theory
Edna Foa developed prolonged exposure (PE) based on emotional processing theory: PTSD involves a pathological fear structure with exaggerated associations between trauma reminders and danger, and avoidance prevents correction. Repeated, prolonged engagement with the trauma memory and reminders, without avoidance, allows emotional processing: fear decreases, the memory becomes organised, and beliefs that the world is completely dangerous and that one is incompetent are corrected.

## Components
- Usually 8 to 15 weekly sessions of 90 minutes.
- Psychoeducation about common trauma reactions and the rationale for exposure.
- Breathing retraining.
- Imaginal exposure: recounting the trauma memory aloud in the present tense, with eyes closed, for 30 to 45 minutes, repeated across sessions; sessions are audio recorded for daily listening at home. Later sessions focus on "hot spots", the most distressing moments.
- Processing: discussing thoughts and feelings that emerged after each imaginal exposure.
- In vivo exposure: a graded hierarchy of avoided but safe situations and reminders (crowded markets, driving, certain smells), practised as homework.

## Evidence
PE is one of the most studied PTSD treatments, with large effects in civilians, veterans, sexual assault survivors and adolescents (PE-A). It is recommended as first line by major guidelines.

## Concerns and adaptations
Therapists sometimes fear that exposure will worsen symptoms; studies show that temporary increases occur in some patients but do not predict worse outcomes, and dropout is similar to other therapies. Massed (daily) and briefer formats have been developed. It requires adequate safety (no ongoing trauma) and attention to suicide risk.

## Conclusion
Prolonged exposure treats PTSD through repeated imaginal and real life exposure with processing, and it has strong evidence as a first line therapy.`,
    keyPoints: ["Foa and emotional processing theory", "Imaginal exposure in present tense with recordings", "Hot spots and processing", "In vivo hierarchy", "Evidence including PE-A", "Concerns about worsening and safety requirements"],
    module: "trauma",
    ref: "Foa, Hembree and Rothbaum 2007 PE manual; Powers 2010 meta-analysis; Foa 2013 JAMA PE-A",
  },
  {
    id: "ther-l07-003",
    subject: "clinical-therapies",
    topic: "narrative-therapy",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "mcp-entrance"],
    question: "Write short notes on narrative therapy.",
    plan: ["Origins and assumptions", "Key techniques", "Uses", "Evaluation"],
    answer: `## Origins and assumptions
Michael White in Australia and David Epston in New Zealand developed narrative therapy in the 1980s, influenced by social constructionism and Michel Foucault's ideas about power and dominant discourses. It assumes:
- People make sense of their lives through stories.
- Problems arise when people are captured by "problem saturated" dominant stories ("I am a failure", "I am an anorexic") often shaped by cultural discourses (about gender, success, body shape).
- The person is not the problem; the problem is the problem.
- People have skills and alternative stories that can be developed.

## Key techniques
- Externalising conversations: naming the problem as separate from the person ("How does the Anger trick you into shouting?"; "When does Anorexia whisper to you?").
- Mapping the influence of the problem on the person and of the person on the problem.
- Unique outcomes: finding exceptions, times when the person resisted the problem.
- Re-authoring: building a preferred, richer story from these exceptions, connecting them to values and history.
- Deconstructing dominant cultural discourses.
- Outsider witness practices and definitional ceremonies, where others witness and respond to the new story.
- Therapeutic documents: letters and certificates that record progress.

## Uses
Children and families (encopresis was a classic example, "Sneaky Poo"), eating disorders, trauma, grief, community work and work with marginalised groups.

## Evaluation
It is respectful, non blaming and strengths based, and fits collectivist cultures where stories and community matter. Limits include limited controlled research and less structure for severe mental illness.

## Conclusion
Narrative therapy separates people from their problems and helps them re-author their lives around preferred stories.`,
    keyPoints: ["White and Epston", "Social constructionism and Foucault", "The person is not the problem", "Externalising conversations", "Unique outcomes and re-authoring", "Outsider witnesses and documents", "Uses and limited evidence"],
    module: "therapies",
    ref: "White and Epston 1990 Narrative Means to Therapeutic Ends; Etchison and Kleist 2000 review",
  },
  {
    id: "ther-l07-004",
    subject: "clinical-therapies",
    topic: "yoga-therapy",
    marks: 10,
    difficulty: 2,
    exams: ["mcp-entrance", "ma-semester", "md-psychiatry"],
    question: "Discuss the role of yoga and meditation as therapies in psychiatry, with reference to Indian research.",
    plan: ["Components of yoga", "Proposed mechanisms", "Evidence by condition including NIMHANS work", "Meditation and mindfulness", "Safety, limits and conclusion"],
    answer: `## Components
Yoga, described in Patanjali's Yoga Sutras as an eight limbed path (ashtanga), includes ethical principles (yama and niyama), postures (asanas), breath regulation (pranayama), sense withdrawal, concentration, meditation and absorption. Therapeutic yoga in psychiatry usually combines asanas, pranayama, relaxation and meditation in structured modules of about an hour.

## Proposed mechanisms
- Autonomic regulation: increased parasympathetic activity and heart rate variability; reduced sympathetic arousal.
- HPA axis: reduced cortisol in some studies.
- Neurochemical: increased GABA levels (shown with magnetic resonance spectroscopy after yoga sessions), possible changes in BDNF and oxytocin.
- Psychological: improved attention, body awareness, emotional regulation, self efficacy and social support in groups.
- Physical activity benefits.

## Evidence by condition
- Depression: meta analyses show moderate benefits as an adjunct to usual care and in mild to moderate depression; trials at NIMHANS found yoga added to antidepressants improved outcomes, and Sudarshan Kriya Yoga (rhythmic breathing) showed antidepressant effects in early Indian studies.
- Schizophrenia: NIMHANS trials found yoga added to antipsychotics improved negative symptoms, social cognition and functioning, and possibly raised oxytocin; meta analyses support modest benefits.
- Anxiety and stress: benefits for anxiety symptoms, PTSD (trauma sensitive yoga) and stress in students and workers.
- Substance use and insomnia: early evidence.
- Cognitive ageing and mild cognitive impairment: some positive studies.
NIMHANS has an Advanced Centre for Yoga and an integrated yoga and psychiatry service, and the government's AYUSH ministry promotes yoga, including International Yoga Day.

## Meditation and mindfulness
Meditation traditions (Vipassana, transcendental meditation, mindfulness from Buddhist practice) inform MBSR and MBCT, which have good evidence for stress and relapse prevention in depression. Vipassana courses in Indian prisons (Tihar) reported reduced aggression in observational studies.

## Safety and limits
Generally safe, but some postures are risky for people with musculoskeletal problems, glaucoma or uncontrolled hypertension; intense breathing or long silent retreats can occasionally worsen anxiety, mania or psychosis in vulnerable people. Trials often have small samples, lack blinding and use varied protocols, so evidence quality is moderate. Yoga should be an adjunct, not a replacement for effective treatment in severe illness.

## Conclusion
Yoga and meditation are culturally familiar, low cost, safe adjuncts with moderate evidence for depression, anxiety and negative symptoms of schizophrenia, with important Indian research contributions.`,
    keyPoints: ["Patanjali's eight limbs", "Typical therapeutic modules", "Autonomic, GABA and HPA mechanisms", "Depression evidence including Sudarshan Kriya", "NIMHANS schizophrenia trials and negative symptoms", "Anxiety and other uses", "Meditation, MBCT and Vipassana", "Safety and evidence limits"],
    visuals: [chain("Proposed mechanisms", [["Postures, breathing, meditation", ""], ["Parasympathetic activity rises", "Higher heart rate variability"], ["Calmer stress response", "Lower cortisol, more GABA"], ["Better mood and attention", ""]])],
    module: "therapies",
    ref: "Cramer 2013 depression meta-analysis; Varambally and Gangadhar NIMHANS yoga schizophrenia trials; Streeter 2010 GABA; Janakiramaiah 2000 SKY",
  },
  {
    id: "ther-l07-005",
    subject: "clinical-therapies",
    topic: "psychological-first-aid",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "mcp-entrance", "ugc-net"],
    question: "Write short notes on psychological first aid.",
    plan: ["Definition", "Principles", "Actions: look, listen, link", "What it is not"],
    answer: `## Definition
Psychological first aid (PFA) is humane, supportive and practical help for people suffering serious crisis events, such as disasters, accidents, violence or sudden loss. It can be given by trained non specialists (health workers, teachers, volunteers, police) in the hours and days after the event. WHO published a field guide in 2011.

## Principles
Hobfoll's five essential elements of early intervention:
- Promoting a sense of safety.
- Calming.
- Promoting a sense of self and community efficacy.
- Connectedness to loved ones and social supports.
- Hope.

## Actions: look, listen, link
- Look: check for safety, people with obvious urgent basic needs, and people with serious distress reactions.
- Listen: approach people who may need support, ask about their needs and concerns, listen without pressure, help them to feel calm.
- Link: help people meet basic needs (food, water, shelter, medical care), access services and information, connect with loved ones, and cope with problems.
Prepare beforehand by learning about the event, available services and safety concerns. Respect dignity, culture, confidentiality and the person's choices. Give special attention to children, older people, people with disabilities and those at risk of violence.

## What it is not
PFA is not professional counselling or debriefing, does not require people to discuss what happened, does not diagnose, and is not only for professionals. Pushing people to recount the trauma (psychological debriefing) is not recommended.

## Conclusion
Psychological first aid is simple, practical support that promotes safety, calm and connection after crises, and links people to further help when needed.`,
    keyPoints: ["Definition and WHO 2011 guide", "Can be given by non specialists", "Hobfoll's five elements", "Look, listen, link", "Vulnerable groups", "Not debriefing or counselling"],
    visuals: [chain("Actions: look, listen, link", [["Look", "Safety, urgent needs, severe distress"], ["Listen", "Approach, ask, calm"], ["Link", "Basic needs, services, loved ones"]])],
    module: "trauma",
    ref: "WHO, War Trauma Foundation and World Vision 2011 PFA guide; Hobfoll 2007",
  },
  {
    id: "ther-l07-006",
    subject: "clinical-therapies",
    topic: "relapse-prevention",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "mcp-entrance"],
    question: "Write short notes on relapse prevention in psychological treatment.",
    plan: ["Definition and origin", "Key concepts", "Techniques", "Use across disorders"],
    answer: `## Definition and origin
Relapse prevention is a set of cognitive behavioural strategies that help people maintain change after treatment. Alan Marlatt and Judith Gordon developed the model for addictive behaviours, and it has been adapted for depression, anxiety, psychosis, eating disorders and other conditions.

## Key concepts
- High risk situations: negative emotional states, interpersonal conflict and social pressure are the commonest triggers.
- Lapse versus relapse: a lapse is a single slip; a relapse is a return to the previous pattern. Lapses are expected and can be learning opportunities.
- Abstinence violation effect: after a lapse, guilt and the belief "I have failed completely" lead to full relapse.
- Self efficacy: confidence in coping protects against relapse.
- Seemingly irrelevant decisions: small choices that lead towards high risk situations (taking the route past the liquor shop).
- Lifestyle imbalance: too many "shoulds" and too few "wants" increases cravings.

## Techniques
- Identifying personal high risk situations and early warning signs.
- Coping skills training: refusal skills, stress management, problem solving.
- Cognitive restructuring of positive expectations of drug use and of the abstinence violation effect.
- "Urge surfing": riding out cravings mindfully.
- Lapse management plans: what to do if a slip happens.
- Lifestyle balance and healthy activities.
- A written relapse prevention plan, often shared with family, and booster sessions.
- Mindfulness based relapse prevention combines these with meditation.

## Use across disorders
In depression and bipolar disorder: recognising early warning signs (sleep changes, withdrawal) and a crisis plan; in psychosis: relapse signatures and early intervention; in anxiety: continuing exposure practice.

## Conclusion
Relapse prevention prepares people for setbacks, turning lapses into learning and protecting the gains of treatment.`,
    keyPoints: ["Marlatt and Gordon", "High risk situations", "Lapse versus relapse", "Abstinence violation effect", "Seemingly irrelevant decisions and lifestyle balance", "Techniques including urge surfing", "Use across disorders"],
    visuals: [compare("Lapse and relapse", ["Lapse", ["A single slip", "Expected and normal", "Can be learned from"], "Get back on track"], ["Relapse", ["Return to old pattern", "Often follows the abstinence violation effect", "Needs more help"], "Prevent with a plan"], "Key concepts")],
    module: "substance",
    ref: "Marlatt and Gordon 1985; Witkiewitz and Marlatt 2004; Bowen 2014 MBRP",
  },
  {
    id: "ther-l07-007",
    subject: "clinical-therapies",
    topic: "cbt-panic-case",
    marks: 15,
    difficulty: 3,
    exams: ["mcp-entrance", "ma-semester"],
    question: "A 28-year-old software engineer from Pune has had sudden attacks of palpitations, breathlessness and fear of dying for six months. She has visited cardiology twice with normal results, now avoids travelling alone by metro and carries an alprazolam tablet everywhere. Formulate the case and describe a plan of psychological treatment.",
    plan: ["Diagnosis and differentials", "Assessment", "Cognitive behavioural formulation", "Treatment plan session by session", "Medication, benzodiazepine use and relapse prevention", "Conclusion"],
    answer: `## Diagnosis
Recurrent unexpected panic attacks with persistent fear of further attacks and avoidance suggest panic disorder with agoraphobia (DSM-5-TR diagnoses both). Differentials: cardiac arrhythmia (already investigated), hyperthyroidism, caffeine or stimulant use, asthma, hypoglycaemia, phaeochromocytoma (rare), and other anxiety disorders (social anxiety, GAD), depression and substance use.

## Assessment
- Detailed account of a recent attack: trigger, first sensation noticed, thoughts ("I am having a heart attack"), behaviours (sitting down, calling her husband, taking alprazolam).
- Frequency, situations avoided, safety behaviours, impact on work and life.
- Caffeine (many coffees at work), sleep, alcohol, thyroid tests.
- Mood, suicide risk, history of anxiety, stressors (deadlines, relationship).
- Measures: Panic Disorder Severity Scale, Mobility Inventory for Agoraphobia, Anxiety Sensitivity Index, and a panic diary.

## Formulation
Using Clark's cognitive model:
- Triggers: internal (a skipped heartbeat after coffee, feeling hot in a crowded metro) or external (crowds).
- Perceived threat leads to anxiety, which produces palpitations, breathlessness and dizziness.
- These are catastrophically misinterpreted ("I will have a heart attack and die"), escalating into panic.
- Maintaining factors:
- Hypervigilance to her heartbeat.
- Safety behaviours: carrying and taking alprazolam, holding on to poles, sitting near exits, travelling only with her husband; these prevent her learning that the feared outcome does not happen.
- Avoidance of the metro and travelling alone.
- Repeated medical reassurance seeking.
- Predisposing factors: high anxiety sensitivity, perhaps a family history of anxiety or a relative's heart disease.
- Precipitating factor: a period of work stress and sleep loss.
- Protective factors: education, insight, supportive husband, motivation.

## Treatment plan
Cognitive behaviour therapy for panic, about 10 to 12 weekly sessions:
- Sessions 1 and 2: engagement, psychoeducation about anxiety and the fight or flight response, building her personal vicious circle together, explaining that panic is frightening but not dangerous; starting a panic diary.
- Session 3: verbal reattribution: examining evidence for "I will have a heart attack" (number of attacks versus heart attacks, normal ECGs, her age, what happens when she cannot sit down); generating alternative explanations ("my heart races because I am anxious").
- Sessions 3 to 5: behavioural experiments with interoceptive exposure: voluntary hyperventilation, running on the spot, spinning in a chair, breathing through a straw, to bring on the feared sensations and show they pass without harm.
- Sessions 4 to 6: identifying and dropping safety behaviours one by one, including leaving the alprazolam at home during experiments.
- Sessions 5 to 10: graded in vivo exposure to the metro: travelling one station with her husband, then alone for one station, then longer journeys at peak time, testing predictions each time.
- Reduce hypervigilance: practising external focus of attention.
- Reduce caffeine and improve sleep.
- Sessions 11 and 12: relapse prevention: summary of learning, plan for setbacks, continuing practice, booster sessions.
Brief, intensive and internet based versions are also effective.

## Medicines and benzodiazepines
- If CBT is unavailable or symptoms are severe, an SSRI such as sertraline or escitalopram, started at a low dose, is first line.
- Alprazolam taken on demand is a safety behaviour that maintains panic and risks dependence; plan a gradual taper (switching to a longer acting drug if she uses it regularly) alongside CBT.

## Expected outcome
CBT for panic disorder leads about three quarters of patients to become panic free, with gains maintained at follow up.

## Conclusion
This is panic disorder with agoraphobia maintained by catastrophic misinterpretation, safety behaviours and avoidance. Cognitive therapy with interoceptive and in vivo exposure, dropping safety behaviours, and a planned benzodiazepine taper offer a high chance of recovery.`,
    keyPoints: ["Diagnosis of panic disorder with agoraphobia", "Medical and substance differentials", "Detailed assessment with measures and diary", "Clark model formulation", "Safety behaviours including alprazolam", "Verbal reattribution and interoceptive exposure", "Graded metro exposure and dropping safety behaviours", "Benzodiazepine taper, SSRI option and relapse prevention"],
    pitfalls: ["Endorsing PRN alprazolam", "Only relaxation without exposure", "No formulation of safety behaviours"],
    visuals: [cycle("Formulation", [["Trigger", "Skipped beat in the metro"], ["Anxiety", ""], ["Palpitations, breathlessness", ""], ["Catastrophic thought", "Heart attack"], ["Panic", "Takes alprazolam, avoids metro"]], "Safety behaviours stop her learning that nothing terrible happens.")],
    module: "anxiety",
    ref: "Clark 1986; Clark 1994 trial; Barlow panic control treatment; NICE CG113",
  },
  {
    id: "ther-l07-008",
    subject: "clinical-therapies",
    topic: "erp-case",
    marks: 10,
    difficulty: 3,
    exams: ["mcp-entrance", "ma-semester"],
    question: "A 15-year-old boy washes his hands for two hours a day because of fear of germs, and his mother washes his clothes separately at his request. Plan exposure and response prevention for him.",
    plan: ["Assessment and engagement", "Psychoeducation and externalising", "Building the hierarchy", "Conducting ERP", "Family accommodation and school", "Medicines and relapse prevention"],
    answer: `## Assessment and engagement
- Confirm OCD: contamination obsessions with washing compulsions, time spent, distress and impairment; rule out other disorders (tics, autism, depression, eating disorders, PANDAS if sudden onset after infection).
- Rate severity with the Children's Yale Brown Obsessive Compulsive Scale (CY-BOCS) and use a daily ritual diary.
- Assess insight, motivation, family accommodation (his mother's separate laundry, buying extra soap, reassurance), school impact and suicide risk.
- Build rapport using his interests and set goals that matter to him (playing cricket without worry).

## Psychoeducation and externalising
Explain OCD as a "brain hiccup" or "bully" that sends false alarm messages; give it a name chosen by him ("the germ bully"). Explain the cycle: obsession, anxiety, washing, brief relief, stronger urges. Explain that ERP means facing fears without washing, so the brain learns that anxiety falls by itself and the feared outcome does not happen.

## Building the hierarchy
With him, list feared situations and rate them on a fear thermometer (0 to 10), for example:
| Situation | Fear |
| Touching the school desk and waiting 5 minutes before washing | 3 |
| Touching the door handle at home and not washing | 4 |
| Eating a snack after touching a cricket bat without washing | 6 |
| Sitting on the sofa in school clothes | 7 |
| Touching the bathroom floor and then his face | 9 |

## Conducting ERP
- Start with moderate items he agrees to; the therapist models the exposure first.
- During exposure, prevent the washing ritual and other neutralising (wiping, mental reassurance); stay with the anxiety, rating it every few minutes, until it drops or for a set time.
- Use the inhibitory learning approach: ask what he predicts will happen and test it ("Will I get sick?"), vary the exposures and settings.
- Daily homework exposures at home, recorded in a diary.
- Gradually move up the hierarchy over 12 to 16 weekly sessions.
- Reduce washing time with agreed limits (for example, a 30 second hand wash only before meals and after the toilet).
- Praise effort; rewards for completing homework.

## Family accommodation and school
- Involve parents in sessions: explain how accommodation feeds OCD and plan to reduce it step by step (his mother stops separate washing gradually, limits reassurance kindly: "That sounds like the germ bully; what would you do to boss it back?").
- Help parents stay calm and supportive and avoid criticism.
- Liaise with the school if rituals affect classes.

## Medicines and relapse prevention
- If OCD is severe or ERP alone is not enough, add an SSRI such as sertraline or fluoxetine, with monitoring for side effects and suicidal thoughts.
- Relapse prevention: summary of skills, continuing practice, recognising early signs, booster sessions.
CBT with ERP leads to significant improvement in most young people, and combining with an SSRI helps in severe cases, as in the Pediatric OCD Treatment Study.

## Conclusion
ERP for this adolescent combines psychoeducation and externalising, a collaborative hierarchy, systematic exposure without washing, and active work with his family to reduce accommodation.`,
    keyPoints: ["Assessment with CY-BOCS and accommodation", "Psychoeducation and externalising OCD", "Fear hierarchy with ratings", "Exposure with response prevention including mental rituals", "Inhibitory learning and daily homework", "Reducing family accommodation", "SSRI addition and POTS evidence", "Relapse prevention"],
    visuals: [timeline("Conducting ERP: climbing the hierarchy", [["Touch desk, wait before washing", "Fear 3"], ["Touch door handle, no washing", "Fear 4"], ["Eat after touching cricket bat", "Fear 6"], ["Sit on sofa in school clothes", "Fear 7"], ["Touch bathroom floor and face", "Fear 9"]])],
    module: "ocd",
    ref: "March and Mulle 1998 OCD in children manual; POTS 2004 JAMA; Lebowitz family accommodation",
  },
  {
    id: "ther-l07-009",
    subject: "clinical-therapies",
    topic: "imagery-rescripting",
    marks: 5,
    difficulty: 3,
    exams: ["mcp-entrance", "ma-semester"],
    question: "Write short notes on imagery rescripting.",
    plan: ["Definition and rationale", "Procedure", "Uses and evidence", "Precautions"],
    answer: `## Definition and rationale
Imagery rescripting (ImRs) is an experiential technique in which a person recalls a distressing memory or image and then changes its course in imagination to meet unmet needs and change its meaning. Mental images carry strong emotion and meaning, often more than verbal thoughts, and many disorders involve intrusive images linked to early experiences (being humiliated at school in social anxiety, abuse in PTSD). Changing the image can change the core belief linked to it.

## Procedure
- Identify the distressing image or memory and its meaning ("I am weak and helpless").
- Recall it vividly in the present tense, with eyes closed, until emotion is activated.
- Rescript: at the "hot spot", the scene is changed. Variants:
- The therapist enters the image to protect the child and confront the perpetrator.
- The adult self enters to help the younger self.
- The person imagines a different, empowering outcome.
- The younger self receives comfort and what he or she needed.
- Discuss the new meaning and how it fits with current beliefs.
- Repeat over sessions as needed.
Arntz and Weertman described a three phase version for childhood memories.

## Uses and evidence
Used in PTSD (including childhood abuse), social anxiety disorder (rescripting early humiliating memories), nightmares (imagery rehearsal therapy), depression with intrusive memories, eating disorders, body dysmorphic disorder and personality disorders within schema therapy. Trials show reductions in distress, PTSD symptoms and belief ratings, sometimes after only one or two sessions.

## Precautions
Requires a good alliance and stabilisation in people with complex trauma, careful pacing, and attention to dissociation. It is not about recovering memories; it works with how existing memories are experienced.

## Conclusion
Imagery rescripting changes the meaning of distressing memories by transforming them in imagination, with growing evidence across disorders.`,
    keyPoints: ["Definition", "Images carry meaning and emotion", "Procedure with hot spot", "Variants including adult self", "Uses including social anxiety and nightmares", "Evidence and precautions"],
    module: "therapies",
    ref: "Arntz and Weertman 1999; Arntz 2012 review; Morina 2017 meta-analysis; Wild 2008 social anxiety",
  },
  {
    id: "ther-l07-010",
    subject: "clinical-therapies",
    topic: "habit-reversal",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "mcp-entrance"],
    question: "Write short notes on habit reversal training.",
    plan: ["Origin", "Components", "Uses", "Evidence"],
    answer: `## Origin
Nathan Azrin and Gregory Nunn developed habit reversal training (HRT) in 1973 to treat nervous habits and tics. It is based on the idea that habits continue because they occur without awareness and are reinforced by relief of tension or urges.

## Components
- Awareness training: describing the habit in detail, detecting early warning signs (urges, sensations, situations), and noticing each occurrence, sometimes with help from a family member or a mirror.
- Competing response training: practising a physically incompatible, inconspicuous action for about one minute when the urge occurs or the habit starts (for hair pulling, clenching fists or holding an object; for vocal tics, slow rhythmic breathing).
- Social support: a family member praises correct use of the competing response and gently prompts when the habit occurs.
- Additional elements: motivation and inconvenience review, relaxation, generalisation training, and stimulus control (wearing gloves, keeping hands busy).

## Uses
Tic disorders and Tourette's disorder (as part of the Comprehensive Behavioural Intervention for Tics, CBIT), trichotillomania, skin picking, nail biting, thumb sucking and stuttering.

## Evidence
Randomised trials show CBIT reduces tic severity in children and adults with effects similar to medicines, and HRT is first line for trichotillomania and skin picking. Effects are maintained when practice continues.

## Conclusion
Habit reversal training uses awareness, a competing response and social support to reduce tics and body focused repetitive behaviours, with good evidence.`,
    keyPoints: ["Azrin and Nunn 1973", "Awareness training", "Competing response for one minute", "Social support", "Stimulus control", "Uses and CBIT evidence"],
    module: "therapies",
    ref: "Azrin and Nunn 1973 Behav Res Ther; Piacentini 2010 JAMA CBIT; Bate 2011 review",
  },
]);
