import type { LongQA } from "@/lib/prep/long-types";
import { anchored, compare, layers, tree } from "./visual";

export const CLINICAL_THERAPIES_L04: LongQA[] = anchored([
  {
    id: "ther-l04-001",
    subject: "clinical-therapies",
    topic: "dbt",
    marks: 15,
    difficulty: 3,
    exams: ["mcp-entrance", "ma-semester", "md-psychiatry"],
    question: "Describe dialectical behaviour therapy: its theory, structure, skills modules and evidence.",
    plan: ["Origins and the biosocial theory", "The dialectic of acceptance and change", "Treatment modes and stages", "Skills modules", "Core strategies and the target hierarchy", "Evidence, adaptations and conclusion"],
    answer: `## Origins
Marsha Linehan developed dialectical behaviour therapy (DBT) in the late 1980s for chronically suicidal women with borderline personality disorder, after finding that standard CBT's focus on change felt invalidating to them and led to dropout. She later disclosed her own history of severe self harm.

## Biosocial theory
Borderline personality disorder is seen as a disorder of emotion regulation arising from the transaction between:
- Biological emotional vulnerability: high sensitivity, high reactivity and slow return to baseline.
- An invalidating environment: one that dismisses, punishes or trivialises emotional experiences, or only responds to extreme displays.
The child does not learn to label, trust or regulate emotions, and self harm becomes a way of escaping unbearable emotion.

## Dialectics
The central dialectic is acceptance versus change: the therapist accepts the patient as she is, while pushing for change. Dialectical thinking holds that opposites can both be true ("You are doing the best you can, and you need to do better"). DBT combines behavioural science with acceptance practices from Zen.

## Treatment modes
Standard outpatient DBT has four modes, usually for a year:
- Weekly individual therapy.
- Weekly group skills training (about two and a half hours).
- Phone coaching between sessions to help apply skills in crises.
- A weekly consultation team for therapists, to maintain motivation and fidelity and prevent burnout.

## Target hierarchy in individual therapy
- Life threatening behaviours (suicide attempts, self harm, suicidal ideation).
- Therapy interfering behaviours (missing sessions, not doing homework, and also therapist behaviours).
- Quality of life interfering behaviours (substance use, eating problems, homelessness).
- Increasing behavioural skills.
A diary card tracks urges, behaviours and skill use; chain analysis examines in detail the sequence of events, thoughts, emotions and actions leading to a problem behaviour, followed by solution analysis.

## Skills modules
| Module | Purpose | Examples |
| Mindfulness | Core skills; awareness without judgement | "What" skills (observe, describe, participate) and "how" skills (non judgementally, one mindfully, effectively); wise mind as balance of emotion mind and reasonable mind |
| Distress tolerance | Surviving crises without making things worse | TIPP (temperature, intense exercise, paced breathing, paired muscle relaxation), distraction, self soothing, radical acceptance |
| Emotion regulation | Understanding and changing emotions | Naming emotions, checking the facts, opposite action, reducing vulnerability (PLEASE: treat physical illness, balanced eating, avoid mood altering drugs, balanced sleep, exercise), building positive experiences |
| Interpersonal effectiveness | Getting needs met while keeping relationships and self respect | DEAR MAN (describe, express, assert, reinforce, stay mindful, appear confident, negotiate), GIVE, FAST |

## Core strategies
Validation (at several levels, from attentive listening to radical genuineness), problem solving, contingency management, exposure, cognitive modification, and stylistic strategies (reciprocal warmth and irreverent confrontation).

## Evidence
- Randomised trials show DBT reduces suicide attempts, self harm, emergency visits and hospital days, and improves treatment retention in BPD, compared with treatment as usual and with treatment by community experts.
- DBT for adolescents (DBT-A) reduces repeated self harm.
- It has been adapted for substance use, eating disorders, PTSD (DBT-PTSD), and in prison and inpatient settings.
- Skills only groups help some patients.
Comparisons with other specialist therapies (mentalisation based treatment, good psychiatric management) show similar outcomes, suggesting structure, consistency and validation are important common ingredients.

## Indian context
DBT programmes are emerging in Indian cities and training centres; adaptations include family involvement in skills learning, shorter programmes and translated materials. The full model with phone coaching and consultation teams is resource intensive.

## Conclusion
DBT is a comprehensive, structured therapy that balances acceptance and change to treat emotion dysregulation, with strong evidence for reducing self harm in borderline personality disorder and growing use across conditions.`,
    keyPoints: ["Linehan and the original patient group", "Biosocial theory", "Acceptance versus change dialectic", "Four treatment modes", "Target hierarchy and chain analysis", "Four skills modules with examples", "Validation and stylistic strategies", "Evidence including DBT-A"],
    pitfalls: ["Describing only the skills group", "Missing the consultation team", "No target hierarchy"],
    visuals: [tree("Skills modules", [["DBT skills", "", -1], ["Mindfulness", "Wise mind, what and how skills", 0], ["Distress tolerance", "TIPP, radical acceptance", 0], ["Emotion regulation", "Opposite action, PLEASE", 0], ["Interpersonal effectiveness", "DEAR MAN, GIVE, FAST", 0]])],
    module: "therapies",
    ref: "Linehan 1993 CBT of BPD and Skills Training Manual 2015; Linehan 2006 Arch Gen Psychiatry; McCauley 2018 DBT-A; Storebo 2020 Cochrane",
  },
  {
    id: "ther-l04-002",
    subject: "clinical-therapies",
    topic: "act-hexaflex",
    marks: 10,
    difficulty: 3,
    exams: ["mcp-entrance", "ma-semester"],
    question: "Describe acceptance and commitment therapy. Explain the psychological flexibility model.",
    plan: ["Origins and relational frame theory", "Psychological inflexibility and experiential avoidance", "The six processes of the hexaflex", "Techniques and metaphors", "Evidence and conclusion"],
    answer: `## Origins
Acceptance and commitment therapy (ACT, said as the word "act") was developed by Steven Hayes, Kirk Strosahl and Kelly Wilson. It is a "third wave" behavioural therapy based on functional contextualism and relational frame theory (RFT), a behavioural account of language and cognition. RFT explains how humans learn to relate events through language, so that words and thoughts can bring pain into situations that are not painful in themselves, and how people come to fuse with their thoughts.

## Psychological inflexibility
ACT sees much suffering as arising from:
- Experiential avoidance: trying to avoid, control or get rid of unwanted thoughts, feelings and sensations, which often makes them stronger and narrows life.
- Cognitive fusion: treating thoughts as literal truths and rules ("I am a failure" taken as fact).
- Loss of contact with the present, attachment to a conceptualised self, lack of clarity about values, and inaction or impulsive action.
The aim is not symptom reduction directly, but psychological flexibility: being in contact with the present moment as a conscious human being and changing or persisting in behaviour in the service of chosen values.

## The six core processes (the hexaflex)
- Acceptance: willingness to have unwanted inner experiences without struggle.
- Cognitive defusion: stepping back from thoughts and seeing them as words and images ("I am having the thought that I am a failure").
- Contact with the present moment: flexible attention to here and now.
- Self as context: an observing self that is distinct from the content of thoughts and feelings.
- Values: freely chosen directions that give life meaning (family, learning, faith, health).
- Committed action: concrete steps guided by values, even with discomfort.

## Techniques and metaphors
- Creative hopelessness: reviewing how attempts to control feelings have worked, to open up willingness for a new approach.
- Metaphors: the tug of war with a monster (drop the rope), passengers on the bus (thoughts as noisy passengers while you drive towards your values), quicksand (struggling sinks you).
- Defusion exercises: repeating a word until it loses meaning, singing the thought, "leaves on a stream".
- Mindfulness exercises and values clarification.
- Goal setting and exposure in the service of values.

## Evidence
Meta analyses show ACT is effective for chronic pain (where it is well established), depression, anxiety disorders, psychosis related distress, substance use and workplace stress, with effects similar to CBT. Mediation studies support psychological flexibility as a mechanism. Group and brief formats are common.

## Conclusion
ACT helps people accept difficult inner experiences, defuse from thoughts and act on their values. Its psychological flexibility model offers a transdiagnostic account of suffering and change, with evidence comparable to traditional CBT.`,
    keyPoints: ["Hayes and colleagues", "Relational frame theory", "Experiential avoidance and fusion", "Psychological flexibility definition", "All six hexaflex processes", "Creative hopelessness and metaphors", "Defusion techniques", "Evidence including chronic pain"],
    visuals: [layers("The six core processes", "stack", [["Values and committed action", "What matters and steps towards it"], ["Present moment and self as context", "Here and now, the observing self"], ["Acceptance and defusion", "Open up and step back from thoughts"]], "Together they build psychological flexibility.")],
    module: "therapies",
    ref: "Hayes, Strosahl and Wilson 1999 and 2012; A-Tjak 2015 meta-analysis; Hayes 2006 Behav Res Ther model",
  },
  {
    id: "ther-l04-003",
    subject: "clinical-therapies",
    topic: "mbct",
    marks: 5,
    difficulty: 2,
    exams: ["mcp-entrance", "ma-semester"],
    question: "Write short notes on mindfulness based cognitive therapy.",
    plan: ["Origins and rationale", "Programme", "Evidence", "Limits"],
    answer: `## Origins and rationale
Zindel Segal, Mark Williams and John Teasdale developed mindfulness based cognitive therapy (MBCT) in the 1990s, combining Jon Kabat-Zinn's mindfulness based stress reduction with cognitive therapy. Their aim was to prevent relapse in recurrent depression. Teasdale's work suggested that in people with past depression, a small drop in mood reactivates negative thinking patterns and rumination (the "differential activation" hypothesis). MBCT teaches people to notice these patterns early and relate to thoughts differently, through decentering ("thoughts are not facts"), rather than changing their content.

## Programme
- Eight weekly group sessions of about two hours, with daily home practice of about 45 minutes, and a day of practice.
- Practices: the body scan, sitting meditation with attention to breath, mindful movement (yoga), the three minute breathing space, and mindful everyday activities (the raisin exercise is a classic first exercise).
- Cognitive elements: education about depression, recognising automatic thoughts and early warning signs, and an action plan for relapse.
- Shift from "doing mode" (problem solving rumination) to "being mode".

## Evidence
Meta analyses show MBCT reduces relapse risk by about a third over a year compared with usual care, and is as effective as continuing maintenance antidepressants, especially in people with three or more previous episodes. It is recommended for relapse prevention in recurrent depression. Evidence is weaker during acute severe depression.

## Limits
It needs trained teachers with their own practice; some people find meditation difficult or distressing, especially with trauma; and it is less effective for people with only one or two past episodes.

## Conclusion
MBCT is an evidence based group programme that prevents depressive relapse by teaching people to step back from ruminative thinking.`,
    keyPoints: ["Segal, Williams and Teasdale", "MBSR roots", "Differential activation and decentering", "Eight week format and practices", "Doing versus being mode", "Relapse reduced, similar to maintenance antidepressants"],
    module: "therapies",
    ref: "Segal, Williams, Teasdale 2002; Kuyken 2016 JAMA Psychiatry IPD meta-analysis; Kuyken 2015 PREVENT trial",
  },
  {
    id: "ther-l04-004",
    subject: "clinical-therapies",
    topic: "self-compassion-cft",
    marks: 5,
    difficulty: 2,
    exams: ["mcp-entrance", "ma-semester"],
    question: "Write short notes on compassion focused therapy.",
    plan: ["Origins and rationale", "Three emotion regulation systems", "Techniques", "Evidence"],
    answer: `## Origins and rationale
Paul Gilbert developed compassion focused therapy (CFT) for people with high shame and self criticism, who often understand cognitive challenges ("logically I know it's not my fault") but do not feel reassured. CFT draws on evolutionary psychology, attachment theory, neuroscience and Buddhist ideas. Its aim is to develop compassion for oneself and others, defined as sensitivity to suffering with a commitment to relieve and prevent it.

## Three emotion regulation systems
- Threat and protection system: detects danger and produces anxiety, anger and disgust; driven by amygdala and stress responses.
- Drive and resource seeking system: motivates achievement and reward; linked to dopamine.
- Soothing and affiliation system: produces contentment, safeness and connection; linked to oxytocin and endorphins, and developed through warm early relationships.
In people with high self criticism, the threat system is overactive and the soothing system underdeveloped, so they attack themselves rather than comfort themselves.

## Techniques
- Psychoeducation about the "tricky brain" shaped by evolution, which reduces blame ("it's not your fault, but it is your responsibility").
- Compassionate mind training: soothing rhythm breathing, compassionate imagery (an ideal compassionate other, a safe place), and developing a compassionate self.
- Compassionate letter writing and work with the inner critic, often using chair work.
- Addressing fears of compassion (some people feel threatened by kindness).

## Evidence
Studies show reductions in self criticism, shame, depression and anxiety in a range of groups, including people with psychosis, eating disorders and personality disorders, though many trials are small. Related self compassion programmes (Kristin Neff) also show benefit.

## Conclusion
CFT addresses shame and self criticism by strengthening the soothing system through compassion training, filling a gap left by purely cognitive methods.`,
    keyPoints: ["Gilbert and shame and self criticism", "Definition of compassion", "Three systems model", "Compassionate mind training techniques", "Fears of compassion", "Emerging evidence"],
    module: "therapies",
    ref: "Gilbert 2009 Advances in Psychiatric Treatment; Leaviss and Uttley 2015 review; Kirby 2017 meta-analysis",
  },
  {
    id: "ther-l04-005",
    subject: "clinical-therapies",
    topic: "psychodynamic-principles",
    marks: 15,
    difficulty: 3,
    exams: ["mcp-entrance", "ma-semester", "md-psychiatry"],
    question: "Discuss the principles of psychodynamic psychotherapy, with reference to transference, countertransference, resistance and interpretation. Comment on the evidence.",
    plan: ["Theoretical assumptions", "Therapeutic frame and stance", "Transference and countertransference", "Resistance and defences", "Interpretation and working through", "Forms, evidence, Indian context and conclusion"],
    answer: `## Theoretical assumptions
Psychodynamic psychotherapy derives from Freud's psychoanalysis and later schools (ego psychology, object relations, self psychology, relational approaches). Its assumptions:
- Much mental life is unconscious, and unconscious wishes, fears and conflicts influence feelings and behaviour.
- Early relationships shape internal models of self and others that are repeated in adult relationships.
- Symptoms can be compromise formations between wishes and defences.
- Insight into these patterns within a relationship, together with emotional experience, leads to change.

## Frame and stance
- A consistent setting: regular times, duration (often 50 minutes), fees and boundaries.
- The therapist's stance: empathic, curious, relatively neutral (not taking sides in the patient's conflicts), abstinent (not gratifying the patient's wishes), and attentive to the relationship.
- The patient is encouraged to speak freely (free association in classical analysis).

## Transference
- Transference is the unconscious redirection onto the therapist of feelings, wishes and expectations from important past relationships. For example, a patient whose father was critical expects the therapist to be disapproving and becomes defensive.
- Positive transference (idealisation, affection) and negative transference (anger, mistrust); erotic transference.
- In therapy, transference is explored as it happens ("here and now"), which makes old patterns alive and changeable.

## Countertransference
- Originally the therapist's unconscious reactions to the patient arising from the therapist's own conflicts, seen as an obstacle.
- In the modern "totalist" view (Paula Heimann), it includes all the therapist's emotional responses, which can be used as information about the patient's inner world and how others react to them (for example, feeling bored, protective or angry).
- Supervision and personal therapy help therapists use countertransference without acting on it.
- Projective identification: the patient unconsciously induces in the therapist feelings that the patient cannot bear.

## Resistance and defences
- Resistance is anything in the patient that opposes the progress of therapy: missing sessions, silence, forgetting, intellectualising, coming late. It is understood, not overcome by force, because it expresses the fears that therapy touches.
- Defences (repression, denial, projection, displacement, intellectualisation, splitting) protect against anxiety and are explored for their function.

## Interpretation and working through
- Techniques range on an expressive to supportive continuum: confrontation (pointing out something the patient is avoiding), clarification (making something clearer), interpretation (offering a hypothesis about unconscious meaning, often linking present relationships, the transference and the past), and on the supportive side, encouragement, advice and empathic validation.
- Malan's triangle of conflict (defence, anxiety, hidden feeling) and triangle of person (therapist, current others, past others) guide interpretations.
- Working through is the repeated exploration of the same conflicts in different contexts until insight translates into change.
- Termination is a significant phase, often reviving feelings about loss.

## Forms
Psychoanalysis (three to five sessions a week, years), long term psychodynamic psychotherapy, brief dynamic therapies (Malan, Davanloo, Sifneos, Mann, Strupp's time limited dynamic therapy), and specific models such as mentalisation based treatment and transference focused psychotherapy for personality disorders, and supportive expressive therapy (Luborsky).

## Evidence
- Meta analyses show short term psychodynamic therapy is effective for depression, anxiety and somatic symptoms, with effects similar to CBT in several comparisons, and effects may grow after treatment ends.
- Long term psychodynamic therapy has some evidence for complex and chronic conditions and personality disorders.
- MBT and TFP have trial evidence in borderline personality disorder.
- Criticisms: fewer high quality trials, difficulty in standardising treatment, long duration and cost, and limited evidence for some disorders (OCD, psychosis).

## Indian context
Psychoanalysis came to India early (Girindrasekhar Bose founded the Indian Psychoanalytical Society in 1922 and corresponded with Freud). Sudhir Kakar has explored the Indian psyche from a psychoanalytic perspective. Adaptations include more active and supportive stances, family involvement, and attention to joint family dynamics and dependency.

## Conclusion
Psychodynamic therapy uses the therapeutic relationship to bring unconscious patterns into awareness through exploration of transference, countertransference, resistance and defences, using interpretation and working through. Its evidence base is growing, especially for brief forms and personality disorders.`,
    keyPoints: ["Core assumptions", "Frame and therapist stance", "Transference definition with example", "Classical and totalist countertransference and projective identification", "Resistance and defences", "Expressive supportive continuum and interpretation", "Malan's triangles and working through", "Evidence and Indian history with Bose"],
    pitfalls: ["Confusing transference and countertransference", "Saying psychodynamic therapy has no evidence", "Listing defences without explaining their function"],
    visuals: [compare("Transference and countertransference", ["Transference", ["From patient to therapist", "Old relationship patterns repeated", "Explored in the here and now"], "Patient's past alive in the room"], ["Countertransference", ["From therapist to patient", "Therapist's feelings as information", "Needs supervision"], "Therapist's reaction as a clue"])],
    module: "psychodynamics",
    ref: "Gabbard Long-Term Psychodynamic Psychotherapy; Heimann 1950; Malan 1979; Leichsenring 2015 meta-analysis; Shedler 2010 Am Psychol; Bose and Indian Psychoanalytical Society 1922",
  },
  {
    id: "ther-l04-006",
    subject: "clinical-therapies",
    topic: "defence-hierarchy",
    marks: 10,
    difficulty: 2,
    exams: ["mcp-entrance", "ma-semester", "md-psychiatry"],
    question: "Describe defence mechanisms and Vaillant's hierarchy of defences. What is their clinical significance?",
    plan: ["Definition and history", "Vaillant's four levels with examples", "DSM defensive functioning scale", "Clinical significance", "Conclusion"],
    answer: `## Definition and history
Defence mechanisms are automatic, largely unconscious psychological processes that protect a person from anxiety and from awareness of internal or external stressors. Sigmund Freud introduced the concept, and Anna Freud described them systematically in "The Ego and the Mechanisms of Defence" in 1936. George Vaillant, through the long term Grant Study of Harvard men, arranged defences in a hierarchy from immature to mature and showed that mature defences predicted better health and life adjustment.

## Vaillant's hierarchy
| Level | Defences | Examples |
| Psychotic (pathological) | Delusional projection, psychotic denial, distortion | Believing that neighbours are plotting, denying an obvious reality |
| Immature | Projection, passive aggression, acting out, hypochondriasis, fantasy, splitting | Blaming others for one's own anger; repeatedly arriving late instead of expressing resentment; self harm to discharge feelings |
| Neurotic (intermediate) | Repression, displacement, reaction formation, intellectualisation, isolation of affect, dissociation, undoing | Shouting at a child after being scolded by the boss; excessive kindness to a disliked person; discussing a cancer diagnosis only in technical terms |
| Mature | Sublimation, altruism, humour, suppression, anticipation | Channelling aggression into sport; helping others with the same illness; consciously postponing worry until after an exam |

Key terms:
- Repression: keeping unacceptable thoughts out of consciousness.
- Projection: attributing one's own unacceptable feelings to others.
- Reaction formation: turning a feeling into its opposite.
- Splitting: seeing self or others as all good or all bad, typical of borderline personality organisation.
- Sublimation: converting impulses into socially valued activity.
- Suppression: a conscious decision to delay attention to a feeling, unlike repression.

## DSM defensive functioning scale
DSM-IV included a Defensive Functioning Scale in its appendix, with seven levels from high adaptive to defensive dysregulation, reflecting Vaillant's work.

## Clinical significance
- Diagnosis and formulation: patterns of defence help describe personality and level of personality organisation (Kernberg).
- Prognosis: mature defences are associated with resilience, better mental and physical health and better relationships.
- Psychotherapy: understanding defences helps the therapist respect their protective function, avoid stripping them too quickly, and help the patient move towards more adaptive ways of coping. Supportive therapy strengthens adaptive defences; expressive therapy explores maladaptive ones.
- Specific disorders: denial in substance use, projection in paranoid states, splitting in borderline personality disorder, isolation and undoing in obsessional disorders, dissociation after trauma.
- Defences change with age and can mature through life.

## Conclusion
Defence mechanisms are unconscious ways of managing anxiety that range from psychotic to mature. Vaillant's hierarchy gives them clinical and prognostic meaning and guides psychotherapy.`,
    keyPoints: ["Definition and Freuds", "Vaillant and the Grant Study", "Four levels with defences", "Examples for each level", "Key definitions including suppression versus repression", "DSM defensive functioning scale", "Clinical uses in formulation, prognosis and therapy", "Disorder specific defences"],
    visuals: [layers("Vaillant's hierarchy", "pyramid", [["Mature", "Sublimation, altruism, humour, suppression, anticipation"], ["Neurotic", "Repression, displacement, reaction formation, intellectualisation"], ["Immature", "Projection, acting out, passive aggression, splitting"], ["Psychotic", "Delusional projection, psychotic denial, distortion"]])],
    module: "defences",
    ref: "A. Freud 1936; Vaillant 1977 Adaptation to Life and 1992; DSM-IV Defensive Functioning Scale",
  },
  {
    id: "ther-l04-007",
    subject: "clinical-therapies",
    topic: "malan-brief-dynamic",
    marks: 10,
    difficulty: 3,
    exams: ["mcp-entrance", "md-psychiatry"],
    question: "Discuss brief psychodynamic psychotherapies, with reference to Malan, Sifneos, Davanloo and Mann.",
    plan: ["Why brief dynamic therapy developed", "Common features and selection", "Each model's key ideas", "Comparison and evidence", "Conclusion"],
    answer: `## Why brief therapy developed
Classical psychoanalysis is long and costly. From the 1960s, therapists at the Tavistock Clinic in London and in the USA showed that focused, time limited dynamic therapy could produce lasting change in selected patients. Franz Alexander's earlier idea of the "corrective emotional experience" also influenced this work.

## Common features
- A clear focus, usually a central conflict or relationship pattern, agreed early.
- Time limit (often 12 to 40 sessions) or a set end date.
- An active therapist who makes early, focused interpretations, especially linking transference to current and past relationships.
- Careful selection: motivation for insight, psychological mindedness, ability to form a rapid alliance, a circumscribed problem, good ego strength, and response to trial interpretations at assessment.
- Attention to termination as a theme.
Exclusions often include psychosis, severe substance use, serious suicide risk and severe personality disorder.

## David Malan (brief focal psychotherapy)
- Worked at the Tavistock with Michael Balint.
- Two triangles: the triangle of conflict (defence, anxiety and hidden feeling or impulse) and the triangle of person (therapist or transference, current others, and past or parents).
- Interpretations link the corners, especially transference to parent links, which he found correlated with good outcome.
- Planned termination date.

## Peter Sifneos (short term anxiety provoking psychotherapy)
- For highly selected patients with oedipal (triangular) conflicts.
- Active, confrontational, anxiety provoking questions to keep the focus; around 12 to 20 sessions.
- Selection criteria included circumscribed complaint, at least one meaningful relationship in childhood, flexibility in the interview, psychological mindedness and motivation for change.

## Habib Davanloo (intensive short term dynamic psychotherapy)
- Very active challenge to defences and confrontation of resistance in the transference to produce an "unlocking of the unconscious", with intense emotional experience.
- Often video recorded; suitable for a wider range of patients, including those with more rigid defences.
- Criticised as being overly confrontational for some patients.

## James Mann (time limited psychotherapy)
- Exactly 12 sessions, with the end date fixed from the start.
- Focus on a "central issue" of the patient's chronic pain about the self, linked to separation and individuation.
- The finite time itself evokes themes of loss and dependence, which are worked through at termination.

## Comparison and evidence
| Model | Style | Key feature |
| Malan | Interpretive, focal | Two triangles, transference to parent link |
| Sifneos | Anxiety provoking | Highly selected oedipal conflicts |
| Davanloo | Highly confrontational | Pressure on defences, emotional breakthrough |
| Mann | Time focused | Twelve sessions, central issue, separation |
Later models include Strupp's time limited dynamic psychotherapy, Luborsky's supportive expressive therapy (core conflictual relationship theme) and dynamic interpersonal therapy. Meta analyses show short term psychodynamic therapy is effective for depression, anxiety and somatic symptoms, with effects comparable to other active therapies and sometimes increasing at follow up.

## Conclusion
Brief dynamic therapies keep the psychodynamic focus on unconscious conflict and transference but use an active therapist, a clear focus and a time limit. Malan, Sifneos, Davanloo and Mann each offered different balances of interpretation, confrontation and time.`,
    keyPoints: ["Background and corrective emotional experience", "Common features and selection criteria", "Malan's two triangles", "Sifneos' anxiety provoking approach", "Davanloo's ISTDP pressure on defences", "Mann's twelve sessions and central issue", "Comparison table", "Evidence"],
    visuals: [compare("Malan's two triangles", ["Triangle of conflict", ["Defence", "Anxiety", "Hidden feeling"], "What is going on inside"], ["Triangle of person", ["Therapist (transference)", "Current others", "Past figures"], "With whom it happens"])],
    module: "psychodynamics",
    ref: "Malan 1979 Individual Psychotherapy and the Science of Psychodynamics; Sifneos 1979; Davanloo 1980; Mann 1973; Abbass 2014 Cochrane STPP",
  },
  {
    id: "ther-l04-008",
    subject: "clinical-therapies",
    topic: "mbt",
    marks: 5,
    difficulty: 3,
    exams: ["mcp-entrance", "md-psychiatry"],
    question: "Write short notes on mentalisation based treatment.",
    plan: ["Mentalising defined", "Theory of borderline personality disorder", "Treatment and techniques", "Evidence"],
    answer: `## Mentalising
Mentalising is the capacity to understand one's own and others' behaviour in terms of mental states: thoughts, feelings, wishes and intentions. It develops in secure attachment relationships when caregivers respond to the infant's states with "marked mirroring" (showing that they understand but are not overwhelmed).

## Theory of borderline personality disorder
Anthony Bateman and Peter Fonagy proposed that in borderline personality disorder, mentalising is fragile and collapses under emotional arousal, especially in attachment contexts. When mentalising fails, people revert to pre mentalising modes:
- Psychic equivalence: thoughts feel like reality ("I feel you hate me, so you do").
- Pretend mode: talk about feelings without real connection to experience.
- Teleological mode: only physical actions count as proof of intentions ("If you cared, you would come now").
These modes explain impulsive self harm, unstable relationships and intense emotion.

## Treatment and techniques
- Usually 12 to 18 months of combined individual and group therapy (outpatient or day hospital).
- The therapist takes a "not knowing", curious stance and focuses on the patient's current mental states and the therapeutic relationship.
- Techniques: empathic validation, clarifying and elaborating mental states, "stop, rewind and explore" when mentalising breaks down, challenging non mentalising, and mentalising the relationship with the therapist.
- Avoids complex interpretations when arousal is high.

## Evidence
Randomised trials show reductions in suicide attempts, self harm, hospital admissions and depression, with benefits maintained at eight year follow up. Adapted for adolescents (MBT-A), families and other conditions.

## Conclusion
MBT treats borderline personality disorder by strengthening the capacity to understand minds under stress, using a curious, relationship focused stance.`,
    keyPoints: ["Definition of mentalising", "Attachment and marked mirroring", "Bateman and Fonagy", "Three pre mentalising modes", "Not knowing stance and stop, rewind, explore", "Trial evidence with long follow up"],
    module: "personality",
    ref: "Bateman and Fonagy 1999 Am J Psychiatry, 2008 eight year follow up; Fonagy 2002 Affect Regulation, Mentalization",
  },
  {
    id: "ther-l04-009",
    subject: "clinical-therapies",
    topic: "schema-therapy",
    marks: 5,
    difficulty: 3,
    exams: ["mcp-entrance", "md-psychiatry"],
    question: "Write short notes on schema therapy.",
    plan: ["Origins", "Early maladaptive schemas and domains", "Coping styles and modes", "Techniques and evidence"],
    answer: `## Origins
Jeffrey Young developed schema therapy in the 1990s for patients with chronic and characterological problems who did not benefit fully from standard CBT. It integrates CBT, attachment theory, Gestalt and psychodynamic ideas.

## Early maladaptive schemas
These are broad, pervasive themes about oneself and relationships, developed in childhood when core emotional needs (secure attachment, autonomy, freedom to express needs, spontaneity and play, and realistic limits) were not met. Young described 18 schemas in five domains:
- Disconnection and rejection (abandonment, mistrust and abuse, emotional deprivation, defectiveness and shame, social isolation).
- Impaired autonomy and performance (dependence, vulnerability to harm, enmeshment, failure).
- Impaired limits (entitlement, insufficient self control).
- Other directedness (subjugation, self sacrifice, approval seeking).
- Overvigilance and inhibition (negativity, emotional inhibition, unrelenting standards, punitiveness).
The Young Schema Questionnaire measures them.

## Coping styles and modes
- Coping styles: surrender (giving in to the schema), avoidance and overcompensation (acting as if the opposite were true).
- Schema modes are moment to moment states: child modes (vulnerable, angry, impulsive), dysfunctional parent modes (punitive, demanding), coping modes (detached protector, surrender, overcompensator) and the healthy adult mode. Mode work is central in borderline personality disorder.

## Techniques and evidence
- Limited reparenting: the therapist partly meets the patient's unmet childhood needs within professional limits.
- Experiential techniques: imagery rescripting and chair work.
- Cognitive techniques (evidence for and against schemas) and behavioural pattern breaking.
- Trials in borderline personality disorder show schema therapy is more effective than transference focused psychotherapy in one large trial, with high retention; group formats are effective. Evidence is growing for other personality disorders and chronic depression.

## Conclusion
Schema therapy targets deep, childhood based patterns through limited reparenting, experiential work and mode work, with good evidence in borderline personality disorder.`,
    keyPoints: ["Young and integrative roots", "Unmet core needs", "Eighteen schemas in five domains", "Coping styles", "Schema modes", "Limited reparenting, imagery rescripting, chair work", "Evidence versus TFP"],
    module: "personality",
    ref: "Young, Klosko and Weishaar 2003 Schema Therapy; Giesen-Bloo 2006 Arch Gen Psychiatry; Arntz 2022 group ST trial",
  },
  {
    id: "ther-l04-010",
    subject: "clinical-therapies",
    topic: "object-relations",
    marks: 5,
    difficulty: 3,
    exams: ["mcp-entrance", "ma-semester"],
    question: "Write short notes on object relations theory and self psychology in psychotherapy.",
    plan: ["Object relations: Klein and Winnicott", "Kernberg", "Kohut's self psychology", "Therapeutic implications"],
    answer: `## Object relations theory
"Objects" are important others, especially early caregivers, and their internal mental representations. Object relations theories place relationships, not drives, at the centre of development.
- Melanie Klein: infants relate to "part objects" (the good and bad breast) and use splitting and projective identification. She described the paranoid schizoid position (splitting, persecutory anxiety) and the depressive position (integrating good and bad, with guilt and concern).
- Donald Winnicott: the "good enough mother", the holding environment, transitional objects (a blanket or soft toy that bridges inner and outer worlds), and the true versus false self.
- Ronald Fairbairn: the infant seeks relationships, not pleasure.

## Otto Kernberg
Integrated object relations with ego psychology, describing borderline personality organisation: identity diffusion, primitive defences (splitting, projective identification, idealisation and devaluation) and generally intact reality testing. Transference focused psychotherapy (TFP) helps patients integrate split representations by interpreting them as they appear in the transference.

## Kohut's self psychology
Heinz Kohut focused on the development of a cohesive self. Children need "selfobjects" who provide mirroring (admiring responses), idealisation (someone to look up to) and twinship (feeling alike). Failures of empathy leave a fragile self, seen in narcissistic personality disorder, with vulnerability to shame and rage. In therapy, the therapist's empathic attunement and the working through of inevitable empathic failures help build self structure ("transmuting internalisation").

## Therapeutic implications
These theories shift attention from insight into drives to the quality of relationships, the therapist's holding and empathic stance, and the integration of fragmented self and other images. They underpin modern treatments for personality disorders (TFP, MBT) and relational psychotherapy.

## Conclusion
Object relations and self psychology explain personality through internalised relationships and self development, guiding empathic and relationship focused psychotherapy.`,
    keyPoints: ["Definition of objects", "Klein's positions and splitting", "Winnicott's good enough mother and transitional object", "Kernberg's borderline organisation and TFP", "Kohut's selfobjects: mirroring, idealising, twinship", "Implications for therapy"],
    module: "psychodynamics",
    ref: "Klein 1946; Winnicott 1953 and 1960; Kernberg 1975; Kohut 1971 The Analysis of the Self; Clarkin 2007 TFP trial",
  },
]);
