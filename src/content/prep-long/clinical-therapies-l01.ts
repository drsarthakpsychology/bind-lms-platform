import type { LongQA } from "@/lib/prep/long-types";
import { anchored, chain, compare, layers, vis } from "./visual";

export const CLINICAL_THERAPIES_L01: LongQA[] = anchored([
  {
    id: "ther-l01-001",
    subject: "clinical-therapies",
    topic: "common-factors",
    marks: 15,
    difficulty: 3,
    exams: ["mcp-entrance", "ma-semester", "md-psychiatry"],
    question: "Critically evaluate the common factors approach to psychotherapy, with reference to the therapeutic alliance and the Dodo bird verdict.",
    plan: ["Origins: Rosenzweig and Frank", "What the common factors are", "The therapeutic alliance: definition, measurement, evidence", "The Dodo bird verdict and its critics", "The contextual model versus the medical model", "Implications and conclusion"],
    answer: `## Origins
In 1936 Saul Rosenzweig suggested that different psychotherapies work for similar reasons, quoting the Dodo bird in Alice in Wonderland: "Everybody has won, and all must have prizes." Jerome Frank, in "Persuasion and Healing", argued that all healing practices, from shamanism to psychoanalysis, share features: an emotionally charged, confiding relationship with a helper; a healing setting; a rationale or myth that explains the problem; and a ritual or procedure that both believe will help.

## The common factors
- Client factors: motivation, resources, social support and expectations; often thought to account for the largest share of change.
- Therapist factors: warmth, empathy, genuineness, skill, and the ability to repair ruptures; outcome varies more between therapists than between therapies.
- The therapeutic relationship and alliance.
- Expectancy and hope (remoralisation).
- A plausible explanation and structured tasks.
Lambert's widely cited estimate attributed about 40 percent of change to extratherapeutic (client) factors, 30 percent to the relationship, 15 percent to expectancy and 15 percent to specific techniques; these figures were based on informal reasoning and should not be quoted as precise.

## The therapeutic alliance
- Edward Bordin defined it as having three parts: agreement on goals, agreement on tasks, and an emotional bond.
- Measured by the Working Alliance Inventory, the Helping Alliance Questionnaire and others, rated by client, therapist or observer.
- Meta analyses involving thousands of patients show a consistent, moderate association between alliance and outcome (correlation about 0.28) across therapies and disorders. The early alliance (by the third to fifth session) predicts outcome.
- Ruptures (tension or breakdown in the alliance) are common; repairing them through acknowledgement and discussion is linked to better outcomes (Safran and Muran).
- Critique: alliance may partly reflect early improvement rather than cause it; the direction of causality is debated.

## The Dodo bird verdict
- Luborsky and colleagues in 1975 and later meta analyses (Wampold) found small or no differences between bona fide psychotherapies intended to be therapeutic, for many conditions.
- Explanations include allegiance effects: researchers' preferred therapy tends to do better.
Critics argue:
- Specific therapies do differ for some conditions: exposure based treatments for phobias, OCD and PTSD; CBT for panic; family based treatment for adolescent anorexia; DBT for repeated self harm.
- Many comparisons are underpowered to detect differences.
- "Equivalence on average" does not mean equivalence for every patient or every problem.
- Combining all disorders hides specific effects.

## Contextual model versus medical model
Bruce Wampold contrasted:
- The medical model: specific ingredients cause specific effects on specific disorders, like drugs.
- The contextual model: therapy works through a real relationship, the creation of expectations through a plausible explanation, and the enactment of health promoting actions.
Most evidence suggests both matter: common factors provide the base, and specific techniques add value in particular conditions.

## Implications
- Training should build relational skills, not only techniques.
- Measure alliance and outcomes routinely and respond to warning signs (feedback informed treatment, Lambert's systems).
- Choose evidence based techniques where they make a difference (exposure in anxiety disorders).
- In India, cultural fit, family involvement and respect for the therapist's role strengthen the alliance.

## Conclusion
The common factors approach shows that relationship, expectations and the person of the therapist are powerful agents of change, and that many therapies perform similarly. It does not prove that technique is irrelevant: specific methods matter for some disorders. A balanced view integrates common and specific factors.`,
    keyPoints: ["Rosenzweig 1936 and the Dodo bird", "Frank's four shared features", "List of common factors and therapist effects", "Lambert's percentages with caution", "Bordin's goals, tasks and bond", "Alliance outcome correlation and ruptures", "Dodo verdict evidence and critiques with specific exceptions", "Wampold's contextual versus medical model"],
    pitfalls: ["Presenting Lambert's figures as research findings", "Claiming technique never matters", "Not defining the alliance"],
    visuals: [layers("The common factors", "stack", [["Specific techniques", "Exposure, cognitive restructuring"], ["Expectancy and hope", "A believable explanation"], ["Relationship and alliance", "Goals, tasks, bond"], ["Client factors", "Motivation, support, resources"]], "The base layers support everything above.")],
    module: "therapies",
    ref: "Rosenzweig 1936; Frank 1961; Bordin 1979; Horvath 2011 and Fluckiger 2018 alliance meta-analyses; Wampold 2015 Great Psychotherapy Debate; Luborsky 1975; Lambert 1992",
  },
  {
    id: "ther-l01-002",
    subject: "clinical-therapies",
    topic: "systematic-desensitisation",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "mcp-entrance", "ugc-net"],
    question: "Describe systematic desensitisation: its theoretical basis, procedure and evidence.",
    plan: ["Origin and theory: reciprocal inhibition", "Procedure in three steps", "Variants", "Evidence and mechanism debate", "Uses and conclusion"],
    answer: `## Origin and theory
Joseph Wolpe, a South African psychiatrist, developed systematic desensitisation in the 1950s. He based it on reciprocal inhibition: if a response incompatible with anxiety (such as deep muscle relaxation) is made to occur in the presence of an anxiety provoking stimulus, the bond between the stimulus and anxiety weakens. This is a form of counterconditioning, building on earlier work by Mary Cover Jones, who reduced a child's fear of rabbits by pairing the rabbit with food.

## Procedure
- Relaxation training: progressive muscle relaxation (Jacobson), in which the person tenses and relaxes muscle groups, practised until relaxation can be achieved quickly.
- Construction of an anxiety hierarchy: the person lists feared situations, rating each on the subjective units of distress scale (SUDS, 0 to 100), and orders them from least to most frightening. For example, for a fear of dogs: a picture of a puppy (10), a dog across the street (30), a dog on a leash nearby (60), touching a dog (90).
- Graded pairing: while deeply relaxed, the person imagines the lowest item; if anxiety rises, they stop and relax again; when an item can be imagined without anxiety, they move up the hierarchy. Sessions continue until the top item causes little anxiety.

## Variants
- In vivo desensitisation: real exposure to the feared situations in graded steps.
- Contact desensitisation: with therapist modelling.
- Automated or self administered versions, and virtual reality exposure.

## Evidence and mechanism
- Systematic desensitisation was one of the first psychological treatments shown to be effective in controlled trials, especially for specific phobias, test anxiety and public speaking anxiety.
- Later research showed that relaxation is not essential: exposure itself is the active ingredient, and in vivo exposure is generally more effective than imagined exposure.
- Current explanations emphasise habituation, extinction and inhibitory learning (new safety learning competes with old fear learning) rather than reciprocal inhibition.

## Uses
Specific phobias, test and performance anxiety, fears in children, and as a gentler entry to exposure for people who cannot tolerate rapid methods. It is less used today than direct graded exposure.

## Conclusion
Systematic desensitisation was a landmark in evidence based psychotherapy. Its procedure of relaxation, hierarchy and graded exposure remains useful, though exposure rather than relaxation is now considered the key ingredient.`,
    keyPoints: ["Wolpe and reciprocal inhibition", "Mary Cover Jones", "Progressive muscle relaxation", "Hierarchy with SUDS ratings and an example", "Graded pairing procedure", "Variants including in vivo and VR", "Evidence and exposure as active ingredient", "Inhibitory learning explanation"],
    visuals: [chain("Procedure", [["Learn relaxation", "Progressive muscle relaxation"], ["Build hierarchy", "SUDS 0 to 100"], ["Imagine the lowest item relaxed", ""], ["Move up when calm", ""], ["Top item causes little fear", ""]])],
    module: "therapies",
    ref: "Wolpe 1958 Psychotherapy by Reciprocal Inhibition; Jones 1924; Marks 1978 exposure; Craske 2014 inhibitory learning",
  },
  {
    id: "ther-l01-003",
    subject: "clinical-therapies",
    topic: "token-economy",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "mcp-entrance", "ugc-net"],
    question: "Write short notes on the token economy.",
    plan: ["Definition and origins", "Components", "Uses and evidence", "Problems and ethics"],
    answer: `## Definition and origins
A token economy is a behaviour modification system based on operant conditioning, in which desired behaviours are reinforced with tokens (points, stars, chips) that can later be exchanged for rewards (backup reinforcers). Teodoro Ayllon and Nathan Azrin introduced it in a psychiatric hospital ward in the 1960s to increase self care and activity in chronic patients.

## Components
- Clear definition of target behaviours (making the bed, attending groups, completing homework).
- Tokens given immediately after the behaviour, as secondary (conditioned) reinforcers.
- A menu of backup reinforcers with set "prices" (snacks, outings, privileges).
- Rules for earning and, sometimes, losing tokens (response cost).
- Consistent use by all staff, and record keeping.
- A plan for fading tokens and replacing them with natural reinforcers such as praise.

## Uses and evidence
Chronic schizophrenia in institutions (improving self care and social behaviour), children with ADHD and conduct problems at home and in classrooms, intellectual disability, autism, and substance use (as contingency management). Studies show behaviour improves while the system runs.

## Problems and ethics
- Gains often fail to generalise outside the programme or to last after it ends.
- It needs consistent staff and can be time consuming.
- Ethical concerns: restricting basic rights (food, privacy) to use them as rewards is unacceptable; programmes must respect dignity and consent, which the MHCA 2017 protects.
- It may reduce intrinsic motivation if overused.

## Conclusion
The token economy shows how systematic reinforcement can change behaviour, but it must be ethical, consistent and planned for generalisation.`,
    keyPoints: ["Operant basis and secondary reinforcers", "Ayllon and Azrin", "Components including backup reinforcers and fading", "Uses in schizophrenia, ADHD and contingency management", "Generalisation problems", "Ethical limits on basic rights"],
    visuals: [vis("conditioning", { kind: "operant" }, "Definition and origins: try reinforcement, then stop it and watch extinction.")],
    module: "therapies",
    ref: "Ayllon and Azrin 1968 The Token Economy; Kazdin 1982 review",
  },
  {
    id: "ther-l01-004",
    subject: "clinical-therapies",
    topic: "exposure-therapy",
    marks: 10,
    difficulty: 3,
    exams: ["mcp-entrance", "ma-semester", "md-psychiatry"],
    question: "Discuss exposure based therapies. Compare habituation and inhibitory learning explanations of how exposure works.",
    plan: ["Definition and forms", "Procedure and principles", "Disorders where it is used", "Habituation model", "Inhibitory learning model and its clinical implications", "Conclusion"],
    answer: `## Definition and forms
Exposure therapy is the planned, repeated confrontation with feared stimuli, situations, memories or bodily sensations, without escape or safety behaviours, until fear reduces or new learning occurs. Forms:
- Graded exposure: step by step through a hierarchy.
- Flooding: prolonged exposure to a highly feared situation from the start.
- Implosive therapy (Stampfl): imagined, exaggerated feared scenes.
- In vivo (real life), imaginal (in imagination), interoceptive (bodily sensations, as in panic), and virtual reality exposure.
- Exposure and response prevention (ERP) for OCD, and prolonged exposure for PTSD.

## Principles
- Collaborative rationale and hierarchy.
- Exposure long enough and often enough; daily homework.
- Dropping safety behaviours and avoidance.
- Rating fear (SUDS) before, during and after.

## Uses
Specific phobias (one session treatment), social anxiety, panic and agoraphobia, OCD, PTSD, health anxiety, and some eating disorder fears. It is among the most effective psychological treatments known.

## Habituation model
- Fear reduces within a session (within session habituation) and across sessions (between session habituation) through repeated exposure.
- Emotional processing theory (Foa and Kozak) proposed that exposure activates the fear structure and provides corrective information.
- Clinical rule: stay until fear falls by about half.
- Problems: fear reduction within sessions does not reliably predict outcome; fear often returns (spontaneous recovery, renewal in a new context, reinstatement after stress), which shows the old fear memory is not erased.

## Inhibitory learning model
- Michelle Craske and colleagues proposed that exposure creates a new safety memory that competes with, but does not erase, the original fear memory. Outcome depends on how well the new learning is retrieved later.
- Clinical strategies:
- Expectancy violation: design exposures to test and disconfirm specific feared predictions ("I will faint"), maximising surprise.
- Deepened extinction: combining several feared cues.
- Variability: varying stimuli, settings and order, rather than a strict hierarchy.
- Removing safety signals and behaviours.
- Occasional reinforced extinction and retrieval cues.
- Affect labelling (naming feelings).
- Tolerating fear rather than requiring it to fall.

| Feature | Habituation | Inhibitory learning |
| Goal | Fear falls in session | Learn the feared outcome does not happen |
| Fear memory | Weakened | Remains, inhibited by new memory |
| Hierarchy | Strictly graded | Varied, less ordered |
| Measure of success | SUDS reduction | Change in expectancy and later retrieval |

## Conclusion
Exposure is a powerful, evidence based treatment for anxiety, OCD and trauma. The inhibitory learning model explains relapse and suggests ways to make gains last, such as testing predictions and varying exposures.`,
    keyPoints: ["Definition and forms including flooding and interoceptive", "Principles and safety behaviours", "Disorders treated", "Habituation and emotional processing theory", "Return of fear phenomena", "Inhibitory learning and expectancy violation", "Clinical strategies of variability and deepened extinction", "Comparison table"],
    visuals: [compare("Habituation model and inhibitory learning model", ["Habituation", ["Stay until fear falls", "Strict hierarchy", "Old fear weakened"], "Fear goes down"], ["Inhibitory learning", ["Test the feared prediction", "Vary the exposures", "New safety memory competes with old fear"], "Expectancy is violated"])],
    module: "therapies",
    ref: "Foa and Kozak 1986; Craske 2008 and 2014 inhibitory learning; Bouton return of fear; Ost 1989 one session",
  },
  {
    id: "ther-l01-005",
    subject: "clinical-therapies",
    topic: "aversion-therapy",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "mcp-entrance"],
    question: "Write short notes on aversion therapy and its ethical problems.",
    plan: ["Definition and principle", "Methods", "Evidence", "Ethics and current status"],
    answer: `## Definition and principle
Aversion therapy pairs an unwanted behaviour or stimulus with an unpleasant experience so that the behaviour becomes associated with discomfort and is reduced. It uses classical conditioning (pairing) and punishment (operant).

## Methods
- Chemical aversion: emetics such as apomorphine or emetine given with alcohol to produce nausea; disulfiram works on a related principle.
- Electrical aversion: mild electric shocks paired with the behaviour.
- Covert sensitisation (Cautela): the person imagines the unwanted behaviour followed by vivid imagined unpleasant consequences (nausea, shame), without real aversive stimuli.
- Other uses: bitter nail paint for nail biting; rapid smoking for smoking cessation.

## Evidence
Effects are usually short lived; the aversion fades without continued pairing, and people learn that the aversive stimulus is absent outside therapy. Evidence for alcohol aversion is mixed. Covert sensitisation has limited evidence in paraphilias and addictions.

## Ethics and current status
- Aversion therapy was used in the past to try to change homosexuality, which caused great harm, and is now regarded as unethical and abusive. Homosexuality is not a mental disorder, and in India the National Medical Commission has declared conversion therapy professional misconduct.
- Using pain or distress raises questions of consent, dignity and coercion, particularly in institutions; the MHCA 2017 protects against cruel and degrading treatment.
- Today, aversive methods are rarely used; positive reinforcement and other evidence based approaches are preferred. Covert sensitisation may occasionally be used with consent.

## Conclusion
Aversion therapy illustrates conditioning principles but has weak lasting effects and a troubling history; it has largely been abandoned.`,
    keyPoints: ["Definition and conditioning basis", "Chemical, electrical and covert methods", "Short lived effects", "Misuse for sexual orientation", "NMC on conversion therapy and MHCA", "Preference for positive methods"],
    module: "therapies",
    ref: "Cautela 1967 covert sensitisation; Rachman and Teasdale 1969; NMC 2022 conversion therapy",
  },
  {
    id: "ther-l01-006",
    subject: "clinical-therapies",
    topic: "functional-analysis",
    marks: 10,
    difficulty: 2,
    exams: ["mcp-entrance", "ma-semester"],
    question: "Describe behavioural assessment and functional analysis. Illustrate with the ABC and SORC models.",
    plan: ["Behavioural assessment versus traditional assessment", "The ABC model", "The SORC model", "Methods of behavioural assessment", "Worked example and use in planning", "Conclusion"],
    answer: `## Behavioural assessment
Behavioural assessment focuses on observable behaviour and its current causes in the environment, rather than on hidden traits or past conflicts. It is idiographic (about this person), situational and closely linked to treatment. Functional analysis identifies what triggers a behaviour and what keeps it going, so that the "function" of the behaviour can be changed.

## The ABC model
- Antecedents: events or situations that come before the behaviour (time, place, people, thoughts, feelings).
- Behaviour: what the person does, described in observable terms with frequency, intensity and duration.
- Consequences: what happens after the behaviour, especially what reinforces it (positive reinforcement, such as attention; negative reinforcement, such as escape from a demand) or punishes it.

## The SORC model
Kanfer and Saslow expanded this to include the person:
- Stimulus: antecedent events.
- Organism: the person's biological and psychological state: physical illness, fatigue, medications, beliefs, skills, mood.
- Response: the behaviour, including motor, cognitive, emotional and physiological responses.
- Consequence: reinforcing or punishing outcomes, short and long term.

## Methods of behavioural assessment
- Behavioural interviews with the person and carers.
- Direct observation, with frequency counts, interval recording and time sampling.
- Self monitoring diaries (for example, a diary of panic attacks, binges or urges).
- Rating scales and checklists.
- Analogue or role play tasks (social skills).
- Physiological measures (heart rate, skin conductance).
- Experimental functional analysis (Iwata): systematically varying conditions (attention, demand, alone, play) to see which maintains self injury in children with developmental disabilities.

## Worked example
A 9 year old boy has tantrums at bedtime.
| A | B | C |
| Told to switch off the television at 9 pm | Screams, throws toys for 20 minutes | Mother allows 30 more minutes of television |
Organism: tired, possible ADHD, poor sleep routine. The tantrum is negatively and positively reinforced (escape from bedtime and more television). Plan: a predictable routine with warnings, praise and a sticker for calm compliance, no extra television after tantrums (extinction, expecting an extinction burst), and treatment of any ADHD.

## Use in treatment planning
Functional analysis guides interventions: changing antecedents (stimulus control), teaching alternative behaviours that serve the same function (functional communication training), and changing consequences (reinforcing alternatives, extinction). It is repeated to measure change.

## Conclusion
Behavioural assessment and functional analysis, using ABC and SORC frameworks, explain why a behaviour occurs here and now and lead directly to targeted treatment.`,
    keyPoints: ["Behavioural versus traditional assessment", "ABC components", "SORC with organism variables", "Kanfer and Saslow", "Methods including self monitoring and observation", "Iwata experimental functional analysis", "Worked example with reinforcement identified", "Link to intervention"],
    visuals: [chain("The ABC model", [["Antecedent", "Told to switch off the TV"], ["Behaviour", "Tantrum"], ["Consequence", "Extra TV time"], ["Behaviour strengthened", "More tantrums next night"]])],
    module: "therapies",
    ref: "Kanfer and Saslow 1965; Iwata 1982 functional analysis; Haynes behavioural assessment",
  },
  {
    id: "ther-l01-007",
    subject: "clinical-therapies",
    topic: "social-skills",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "mcp-entrance"],
    question: "Write short notes on social skills training.",
    plan: ["Definition and rationale", "Components", "Uses and evidence", "Limits"],
    answer: `## Definition and rationale
Social skills training (SST) teaches the verbal and non verbal behaviours needed for effective social interaction, such as starting conversations, maintaining eye contact, expressing feelings, assertiveness and problem solving. It is based on social learning theory (Bandura): skills are learned by observation, practice and feedback. People with schizophrenia, autism, social anxiety and intellectual disability often have social skill deficits that limit relationships and work.

## Components
- Assessment of specific deficits through role play and observation.
- Instruction and rationale for each skill.
- Modelling by the therapist or on video.
- Behavioural rehearsal through role play.
- Feedback and positive reinforcement (shaping).
- Homework to practise in real life, with review.
- Generalisation through practice in varied settings.
Training is usually in groups, with skills broken into small steps (for example, making a request: look at the person, say exactly what you want, say how it would make you feel).

## Uses and evidence
- Schizophrenia: improves social skills and functioning, with some reduction in relapse when combined with medicines (Liberman's modules).
- Autism: group programmes improve social knowledge and interaction.
- Social anxiety and depression, as part of CBT.
- Conduct problems and intellectual disability.

## Limits
Skills learned in the clinic may not transfer to everyday life; effects on symptoms are small; cognitive impairment limits learning; and the approach must respect cultural norms of interaction (for example, eye contact with elders in India).

## Conclusion
Social skills training uses modelling, rehearsal and feedback to build interpersonal skills and is a useful part of rehabilitation, especially in schizophrenia and autism.`,
    keyPoints: ["Definition and social learning basis", "Instruction, modelling, rehearsal, feedback, homework", "Group format and stepwise skills", "Evidence in schizophrenia with Liberman", "Uses in autism and anxiety", "Generalisation and cultural limits"],
    module: "therapies",
    ref: "Liberman social skills modules; Kurtz and Mueser 2008 meta-analysis; Bandura 1977",
  },
  {
    id: "ther-l01-008",
    subject: "clinical-therapies",
    topic: "relaxation-biofeedback",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "mcp-entrance", "ugc-net"],
    question: "Write short notes on relaxation techniques and biofeedback.",
    plan: ["Rationale", "Relaxation methods", "Biofeedback", "Uses and evidence"],
    answer: `## Rationale
Many problems involve excessive physiological arousal: muscle tension, rapid breathing, raised heart rate. Relaxation methods reduce sympathetic activity and increase parasympathetic activity, giving the person a sense of control.

## Relaxation methods
- Progressive muscle relaxation (Edmund Jacobson): tensing and then releasing muscle groups in sequence, noticing the difference; later shortened to relaxation without tensing and to cue controlled relaxation.
- Applied relaxation (Lars Ost): progressive steps from full relaxation to rapid relaxation in about 30 seconds, then use in real anxiety provoking situations; evidence based for GAD and panic.
- Autogenic training (Schultz): self suggestions of warmth and heaviness in the limbs.
- Diaphragmatic and slow breathing; yogic breathing (pranayama).
- Guided imagery and meditation.

## Biofeedback
Biofeedback uses instruments to measure a physiological process (muscle tension by EMG, skin temperature, skin conductance, heart rate variability, brain waves by EEG in neurofeedback) and feeds it back to the person through sounds or visual displays, so that they can learn to control it. It relies on operant learning: changes in the desired direction are rewarded by the signal.

## Uses and evidence
- Relaxation: GAD (applied relaxation), insomnia, tension headache, hypertension, chronic pain, as part of stress management and anxiety treatment.
- Biofeedback: tension and migraine headache (EMG and thermal feedback), Raynaud phenomenon, urinary and faecal incontinence, chronic pain; heart rate variability biofeedback for anxiety; neurofeedback for ADHD has mixed evidence.
- Relaxation alone is less effective than CBT for panic and social anxiety, and some people experience relaxation induced anxiety.

## Conclusion
Relaxation and biofeedback are simple, low risk ways to reduce arousal and increase self control, useful alone for some conditions and as parts of broader treatment.`,
    keyPoints: ["Arousal reduction rationale", "Jacobson progressive muscle relaxation", "Ost applied relaxation for GAD", "Autogenic training and breathing", "Biofeedback definition and operant basis", "Uses and evidence including headache"],
    module: "therapies",
    ref: "Jacobson 1938; Ost 1987 applied relaxation; Nestoriuc 2008 biofeedback headache meta-analysis",
  },
  {
    id: "ther-l01-009",
    subject: "clinical-therapies",
    topic: "contingency-management",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "mcp-entrance", "md-psychiatry"],
    question: "Write short notes on contingency management.",
    plan: ["Definition and basis", "How it works", "Evidence", "Limits and ethics"],
    answer: `## Definition and basis
Contingency management (CM) is a behavioural treatment in which people receive tangible rewards for objectively verified target behaviours, most often abstinence from drugs shown by negative urine tests. It applies operant conditioning: reinforcing the desired behaviour makes it more likely, and competing with the reinforcing effects of drugs.

## How it works
- Clear target behaviour (a drug free urine sample, attendance, medication adherence).
- Frequent, objective monitoring (for example, urine tests two or three times a week).
- Immediate reinforcement after each success.
- Escalating rewards for consecutive successes, and a reset to the starting value after a failure.
- Types: vouchers exchangeable for goods (Higgins), prize draws ("fishbowl" method of Petry) where each success earns a draw with a chance of winning prizes of different sizes, and privileges such as take home methadone doses.

## Evidence
CM is one of the most effective psychosocial treatments for stimulant use disorders (cocaine and methamphetamine), for which there are no effective medicines. It also helps with tobacco (including in pregnancy), alcohol, opioid use during substitution treatment, and adherence. Effects are strongest while rewards continue and partly persist after.

## Limits and ethics
- Cost and organisation, though prize systems lower costs.
- Concerns that paying people for abstinence is unfair or that the money may buy drugs; studies do not show increased drug use.
- Rewards must not be coercive, and basic care must never depend on test results.
- Less used in India, though family based reward systems can adapt the principle.

## Conclusion
Contingency management is a simple, well supported behavioural treatment, particularly valuable for stimulant use where medicines are lacking.`,
    keyPoints: ["Definition with verified behaviour", "Operant basis", "Escalating rewards and reset", "Voucher and prize methods", "Strong evidence in stimulant use", "Cost and ethical concerns"],
    module: "substance",
    ref: "Higgins 1994 vouchers; Petry 2000 prize CM; Prendergast 2006 meta-analysis; Brown 2023 stimulant CM",
  },
  {
    id: "ther-l01-010",
    subject: "clinical-therapies",
    topic: "supportive-psychotherapy",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "mcp-entrance", "md-psychiatry"],
    question: "Write short notes on supportive psychotherapy.",
    plan: ["Definition and aims", "Techniques", "Indications", "Evidence and limits"],
    answer: `## Definition and aims
Supportive psychotherapy is a form of therapy that aims to reduce symptoms, maintain or improve self esteem, adaptive functioning and coping, using a warm, active and accepting relationship rather than deep exploration of unconscious conflict. It is the most widely practised psychotherapy in general psychiatry, including in Indian clinics.

## Techniques
- A therapeutic alliance with warmth, empathy and respect.
- Reassurance (honest and specific, not false), encouragement and praise for efforts.
- Advice and guidance on practical matters; problem solving.
- Psychoeducation about the illness and treatment.
- Ventilation: allowing the person to express feelings.
- Strengthening defences that work (such as suppression, humour, sublimation) rather than challenging them.
- Anticipatory guidance: rehearsing how to cope with upcoming stress.
- Environmental manipulation: involving family, work or social services.
- Expanding awareness only as much as is helpful.

## Indications
- Acute crises and adjustment problems.
- Severe or chronic mental illness (schizophrenia, recurrent depression) alongside medicines.
- Patients with physical illness, older adults, people with limited psychological mindedness or ego strength.
- When structured therapies are not available or not suitable.

## Evidence and limits
Studies show supportive therapy is often as effective as more specific therapies for some conditions (for example, in some trials for depression and personality disorders), supporting the common factors view, and it is often used as a control condition in trials. Limits include risk of dependence, lack of structure, and less effect than specific treatments for anxiety disorders and OCD.

## Conclusion
Supportive psychotherapy is a flexible, practical approach that strengthens coping and functioning; it is an essential skill for every clinician.`,
    keyPoints: ["Definition and aims", "Techniques including reassurance, advice, ventilation", "Strengthening adaptive defences", "Indications", "Evidence and use as control", "Limits"],
    module: "therapies",
    ref: "Winston, Rosenthal and Pinsker Introduction to Supportive Psychotherapy; Markowitz 2008",
  },
]);
