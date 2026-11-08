import type { LongQA } from "@/lib/prep/long-types";
import { anchored, cycle, tree } from "./visual";

export const CLINICAL_THERAPIES_L08: LongQA[] = anchored([
  {
    id: "ther-l08-001",
    subject: "clinical-therapies",
    topic: "supervision",
    marks: 5,
    difficulty: 2,
    exams: ["mcp-entrance", "ma-semester"],
    question: "Write short notes on clinical supervision in psychotherapy training.",
    plan: ["Definition and functions", "Models", "Methods", "Indian training context"],
    answer: `## Definition and functions
Clinical supervision is a formal relationship in which an experienced practitioner oversees the work of a trainee or colleague to develop competence, protect clients and support the supervisee. Functions are often described as:
- Formative (educational): building knowledge and skills.
- Normative (managerial and ethical): ensuring safe, ethical, competent practice.
- Restorative (supportive): helping the supervisee manage emotional demands and prevent burnout.

## Models
- Developmental models (Stoltenberg's integrated developmental model): supervisees move from dependence and anxiety, through fluctuating confidence, to autonomy; supervision adapts to each level.
- Discrimination model (Bernard): the supervisor shifts between teacher, counsellor and consultant roles, focusing on intervention, conceptualisation and personalisation skills.
- Therapy specific models: CBT supervision with case formulation and competency ratings (such as the Cognitive Therapy Scale); psychodynamic supervision attending to countertransference and parallel process (when the supervisee unconsciously repeats in supervision what happens with the client).

## Methods
Case discussion, review of audio or video recordings (more accurate than self report), live supervision with a one way mirror, role play, group supervision and peer supervision. Supervision should have a contract, regular schedule, documentation and feedback in both directions.

## Indian training context
The Rehabilitation Council of India regulates training of clinical psychologists (MPhil and professional doctorate programmes), which requires supervised clinical work. Supervisor shortages are common; group, peer and tele supervision help, especially for task shared programmes, where structured supervision maintains quality.

## Conclusion
Supervision develops competent, ethical and resilient therapists and protects clients; it is a core part of training and ongoing practice.`,
    keyPoints: ["Definition", "Formative, normative, restorative functions", "Developmental and discrimination models", "Parallel process", "Use of recordings and live supervision", "RCI training and Indian challenges"],
    module: "therapies",
    ref: "Proctor 1986 functions; Stoltenberg IDM; Bernard discrimination model; RCI guidelines",
  },
  {
    id: "ther-l08-002",
    subject: "clinical-therapies",
    topic: "ruptures",
    marks: 5,
    difficulty: 3,
    exams: ["mcp-entrance", "ma-semester"],
    question: "Write short notes on ruptures in the therapeutic alliance and their repair.",
    plan: ["Definition and types", "Why they matter", "Repair strategies", "Examples"],
    answer: `## Definition and types
A rupture is a strain or breakdown in the collaborative relationship between client and therapist. Jeremy Safran and Christopher Muran described two types:
- Withdrawal ruptures: the client moves away from the therapist or from their own experience: silence, vague answers, changing topic, deferring too much, superficial agreement.
- Confrontation ruptures: the client moves against the therapist: complaints, criticism of the therapist or therapy, anger, pushing for control.
Ruptures can be small (a moment of disagreement) or major (threatening dropout).

## Why they matter
Ruptures are common in all therapies. Studies show that ruptures that are repaired are linked to better outcomes than therapies without ruptures, and that therapists trained to recognise and repair them improve results. Unrepaired ruptures predict dropout.

## Repair strategies
Direct strategies:
- Notice the rupture and raise it openly ("I sense that what I said just now didn't fit for you").
- Explore the client's experience non defensively and acknowledge the therapist's own contribution.
- Clarify misunderstandings and renegotiate goals or tasks.
Indirect strategies:
- Change the task or approach, reframe the rationale, or join the client's resistance.
Meta communication (talking about what is happening between client and therapist in the here and now) is central.

## Examples
A client who has stopped doing CBT homework may feel the tasks are irrelevant or feel criticised; exploring this openly and adapting the task repairs the alliance. In Indian settings, clients may not voice disagreement directly out of respect for the therapist, so withdrawal ruptures (missed sessions, silence) need careful attention.

## Conclusion
Ruptures are inevitable; noticing and repairing them openly strengthens the alliance and improves outcome.`,
    keyPoints: ["Definition", "Withdrawal and confrontation types", "Repaired ruptures linked to better outcome", "Direct and indirect repair", "Meta communication", "Cultural note on indirect disagreement"],
    module: "therapies",
    ref: "Safran and Muran 2000 Negotiating the Therapeutic Alliance; Eubanks 2018 meta-analysis",
  },
  {
    id: "ther-l08-003",
    subject: "clinical-therapies",
    topic: "therapy-termination",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "mcp-entrance"],
    question: "Write short notes on termination of psychotherapy.",
    plan: ["Types of termination", "Tasks of termination", "Common reactions", "Good practice"],
    answer: `## Types
- Planned termination, when goals are reached or a time limit ends.
- Premature termination (dropout), often due to poor alliance, practical barriers or early improvement.
- Forced termination, when the therapist leaves, the client moves, or services change.

## Tasks of termination
- Review progress against goals, and what helped.
- Consolidate learning: summarise skills and insights in a written plan or "blueprint".
- Plan for the future: relapse prevention, early warning signs, where to get help.
- Process feelings about ending.
- Arrange follow up or booster sessions if needed, and inform referrers.

## Common reactions
Clients may feel sadness, anxiety, abandonment, anger or relief; symptoms can briefly return as the end approaches. In psychodynamic therapy, ending is a central theme that may echo earlier losses, and in Mann's time limited therapy it is the focus from the start. Therapists may also have feelings (wanting to continue, guilt) that need reflection in supervision.

## Good practice
- Discuss ending from the beginning and remind the client as it approaches.
- Taper sessions where appropriate (fortnightly, then monthly).
- Avoid ending abruptly; if forced, give notice and arrange transfer.
- Follow up clients who drop out, if appropriate.
- Ethical codes require that therapists do not abandon clients and end when therapy is no longer helpful.

## Conclusion
Termination is an active phase of therapy that consolidates gains and prepares the client for the future.`,
    keyPoints: ["Planned, premature and forced", "Review, consolidate, plan, process feelings", "Reactions of client and therapist", "Psychodynamic and Mann's view", "Tapering and preparation", "Ethics of non abandonment"],
    module: "therapies",
    ref: "Gelso and Woodhouse termination; APA Ethics Code 10.10",
  },
  {
    id: "ther-l08-004",
    subject: "clinical-therapies",
    topic: "psychoeducation",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "mcp-entrance", "md-psychiatry"],
    question: "Write short notes on psychoeducation.",
    plan: ["Definition and aims", "Content", "Formats", "Evidence"],
    answer: `## Definition and aims
Psychoeducation is the structured provision of information about a mental illness and its treatment to patients and families, combined with support and skill building. Aims: understanding the illness, reducing stigma and blame, improving adherence, recognising early warning signs, coping better and preventing relapse.

## Content
- Nature of the illness, symptoms and course, explained simply.
- Causes, often using the stress vulnerability model, avoiding blame.
- Treatment: medicines (benefits, side effects, duration), psychological treatments.
- Early warning signs and a relapse action plan.
- Lifestyle: sleep, substance avoidance, stress management, physical health.
- Rights and services: MHCA 2017 rights, disability benefits, helplines.
- For families: communication, problem solving, and caring for themselves.

## Formats
Individual sessions, family sessions, groups for patients or families, multi family groups, leaflets, videos, apps, and community talks. It should be interactive, repeated, adapted to literacy and language, and respectful of explanatory models.

## Evidence
- Bipolar disorder: group psychoeducation (the Barcelona programme) reduced relapse and admissions over five years.
- Schizophrenia: family psychoeducation reduces relapse and readmission.
- Depression, anxiety and eating disorders: improves knowledge, adherence and outcome as part of treatment.
Information alone, without support and skills, has smaller effects.

## Conclusion
Psychoeducation is a simple, essential part of every treatment plan, with strong evidence in bipolar disorder and schizophrenia.`,
    keyPoints: ["Definition and aims", "Content including early warning signs", "Family elements", "Formats and adaptation", "Barcelona bipolar evidence", "Family psychoeducation in schizophrenia"],
    module: "therapies",
    ref: "Colom 2003 and 2009 Barcelona; Pharoah 2010 Cochrane; Xia 2011 Cochrane psychoeducation schizophrenia",
  },
  {
    id: "ther-l08-005",
    subject: "clinical-therapies",
    topic: "problem-solving-therapy",
    marks: 10,
    difficulty: 2,
    exams: ["mcp-entrance", "ma-semester"],
    question: "Describe problem solving therapy: its theory, steps and evidence.",
    plan: ["Theory: social problem solving", "Problem orientation and problem solving style", "The steps", "Uses and evidence including low resource settings", "Conclusion"],
    answer: `## Theory
Problem solving therapy (PST) is a brief, structured, cognitive behavioural intervention based on Thomas D'Zurilla and Arthur Nezu's model of social problem solving. It holds that stressful life problems and poor problem solving skills contribute to depression, anxiety and suicidal behaviour, and that learning a systematic approach to solving problems improves mood and coping. It sees problems as practical life difficulties (debt, conflict, unemployment, caring for a sick relative).

## Problem orientation and style
- Positive problem orientation: seeing problems as challenges that can be solved, with confidence in one's ability.
- Negative problem orientation: seeing problems as threats, doubting one's ability, and feeling frustrated.
- Problem solving styles: rational problem solving (adaptive), impulsive or careless style, and avoidant style (procrastination, passivity), measured by the Social Problem Solving Inventory.
PST strengthens positive orientation and rational problem solving.

## The steps
- Problem definition and formulation: choose a problem, describe it in clear, specific terms, separate facts from assumptions, set a realistic goal.
- Generation of alternative solutions: brainstorm many options without judging them (quantity breeds quality).
- Decision making: weigh pros and cons of each option for the person and others, short and long term; choose the best one or a combination.
- Solution implementation: plan specific steps, carry them out.
- Verification: review whether it worked; if not, return to an earlier step.
Sessions also address emotional regulation (stop and slow down) and planning for obstacles. Typically four to twelve sessions.

## Uses and evidence
- Depression in primary care and older adults: effective, sometimes comparable to antidepressants.
- Suicidal behaviour and self harm: reduces hopelessness and repetition in some trials.
- Carers, chronic illness, cancer and stress management.
- Low resource settings: WHO's Problem Management Plus uses problem solving with stress management and behavioural activation; the Friendship Bench in Zimbabwe uses problem solving delivered by lay health workers; in India, problem solving is part of the Healthy Activity Programme and suicide prevention work.

## Conclusion
Problem solving therapy teaches a practical, step by step method for tackling life problems and building confidence, with good evidence in depression and wide use in low resource and task shared settings.`,
    keyPoints: ["D'Zurilla and Nezu", "Positive and negative problem orientation", "Rational, impulsive and avoidant styles", "Five steps", "Brainstorming principle", "Evidence in depression and older adults", "PM+ and Friendship Bench", "Indian use"],
    visuals: [cycle("The steps", [["Define the problem", "Clear and specific"], ["Brainstorm solutions", "Many options"], ["Decide", "Pros and cons"], ["Act", "Specific steps"], ["Review", "Worked? If not, go round again"]])],
    module: "therapies",
    ref: "D'Zurilla and Nezu 2007 Problem-Solving Therapy; Cuijpers 2018 meta-analysis; WHO PM+ 2016; Chibanda 2016",
  },
  {
    id: "ther-l08-006",
    subject: "clinical-therapies",
    topic: "behaviour-parent-training",
    marks: 10,
    difficulty: 2,
    exams: ["mcp-entrance", "ma-semester"],
    question: "Describe parent management training for children with disruptive behaviour.",
    plan: ["Theory: social learning and coercion", "Core components", "Named programmes", "Evidence and Indian adaptation", "Conclusion"],
    answer: `## Theory
Parent management training (PMT) is based on social learning theory and Gerald Patterson's coercion theory. In coercive cycles, a child's difficult behaviour (whining, tantrums) escalates until the parent gives in, which reinforces the child's behaviour; the parent's giving in is negatively reinforced by the end of the tantrum. Harsh punishment alternates with giving in. PMT teaches parents to change these patterns, so that positive behaviour is rewarded and negative behaviour is not.

## Core components
- Building a positive relationship: daily "special time" or child led play, attending to and describing the child's play.
- Praise and rewards: labelled praise for specific behaviours ("Thank you for putting your shoes away"), star charts and token systems.
- Effective instructions: clear, brief, one at a time, at close range, with time to comply.
- Planned ignoring of minor misbehaviour.
- Consistent, non violent consequences for serious misbehaviour: time out (a few minutes in a boring place), loss of privileges.
- Monitoring and supervision for older children.
- Problem solving and managing parents' own stress.
Parents practise skills in sessions with role play, coaching (sometimes live, as in parent child interaction therapy) and homework.

## Named programmes
- The Incredible Years (Webster-Stratton): group programme using video vignettes.
- Triple P Positive Parenting Program (Sanders): multi level from brief information to intensive support.
- Parent Child Interaction Therapy (Eyberg): live coaching through an earpiece, in child directed and parent directed phases.
- Parent Management Training Oregon model (Patterson, Forgatch).
- Defiant Children (Barkley).

## Evidence
PMT is the best supported intervention for oppositional defiant and conduct problems in children aged about 3 to 12, with moderate to large effects that last, and it also helps children with ADHD. Effects are smaller in adolescents, where family therapy and multisystemic therapy are used. Barriers include parental depression, marital conflict, poverty and dropout.

## Indian adaptation
Indian studies have adapted parent training for ADHD and behaviour problems in Hindi and other languages, using group formats and involving grandparents in joint families. Corporal punishment is common and is addressed sensitively; the Right of Children to Free and Compulsory Education Act 2009 prohibits physical punishment in schools.

## Conclusion
Parent management training breaks coercive cycles by teaching positive attention, clear instructions and consistent consequences, and it is the first line treatment for disruptive behaviour in young children.`,
    keyPoints: ["Social learning and coercion theory", "Positive relationship and special time", "Labelled praise and rewards", "Effective instructions and planned ignoring", "Time out and consequences", "Named programmes", "Strong evidence in ages 3 to 12", "Indian adaptation and punishment issues"],
    visuals: [cycle("Theory: the coercion cycle", [["Parent gives an instruction", ""], ["Child protests and escalates", ""], ["Parent gives in", "Child's protest is rewarded"], ["Tension ends", "Parent's giving in is rewarded"], ["Next instruction", "Protest comes sooner"]])],
    module: "child",
    ref: "Patterson 1982 Coercive Family Process; Webster-Stratton Incredible Years; Sanders Triple P; Eyberg PCIT; Kaminski 2008 meta-analysis",
  },
  {
    id: "ther-l08-007",
    subject: "clinical-therapies",
    topic: "eft-individual",
    marks: 5,
    difficulty: 3,
    exams: ["mcp-entrance", "ma-semester"],
    question: "Write short notes on emotion focused therapy for individuals.",
    plan: ["Origins and theory", "Types of emotion", "Techniques", "Evidence"],
    answer: `## Origins and theory
Leslie Greenberg, with Laura Rice and Robert Elliott, developed emotion focused therapy (EFT), also called process experiential therapy, combining person centred and Gestalt approaches with emotion theory. It holds that emotions are adaptive guides to needs and action, and that psychological problems arise when emotions are avoided, unprocessed or maladaptive. Change comes through becoming aware of, accepting, expressing, regulating and transforming emotion, especially "changing emotion with emotion".

## Types of emotion
- Primary adaptive emotions: immediate, fitting responses (sadness at loss, anger at violation).
- Primary maladaptive emotions: old, learned responses that no longer fit (core shame, fear of abandonment from past trauma).
- Secondary emotions: reactions to primary emotions (anger covering hurt, hopelessness covering fear).
- Instrumental emotions: expressed to influence others.
Therapy aims to reach primary emotions, use adaptive ones, and transform maladaptive ones by activating opposite adaptive emotions (for example, accessing self compassion or assertive anger to transform shame).

## Techniques
- Empathic attunement and validation within a warm relationship.
- Marker guided tasks:
- Two chair work for self criticism (critic and experiencing self).
- Empty chair work for unfinished business with significant others.
- Focusing on unclear felt senses.
- Systematic evocative unfolding for puzzling reactions.
- Compassionate self soothing.

## Evidence
Trials show EFT is effective for depression, comparable to CBT, and helpful for trauma (emotion focused therapy for trauma), social anxiety and eating disorders. Emotionally focused couple therapy (Johnson and Greenberg) is the related couples model.

## Conclusion
Emotion focused therapy helps people access and transform core emotions through empathic relationship and experiential tasks such as chair work.`,
    keyPoints: ["Greenberg and colleagues", "Emotions as adaptive guides", "Primary adaptive, maladaptive, secondary, instrumental", "Changing emotion with emotion", "Two chair and empty chair tasks", "Evidence in depression"],
    module: "therapies",
    ref: "Greenberg 2015 Emotion-Focused Therapy; Goldman 2006 depression trial; Elliott 2004",
  },
  {
    id: "ther-l08-008",
    subject: "clinical-therapies",
    topic: "personal-construct",
    marks: 5,
    difficulty: 3,
    exams: ["ma-semester", "mcp-entrance"],
    question: "Write short notes on personal construct theory and therapy.",
    plan: ["Kelly's theory", "Constructs and corollaries", "Repertory grid", "Therapy and uses"],
    answer: `## Kelly's theory
George Kelly, in "The Psychology of Personal Constructs" in 1955, proposed that people are like scientists who try to predict and control events by forming theories (constructs) about the world. His fundamental postulate: a person's processes are psychologically channelled by the ways in which they anticipate events. This view is called constructive alternativism: there are always alternative ways to construe events.

## Constructs and corollaries
- Constructs are bipolar dimensions (friendly versus hostile, successful versus failure) used to interpret people and events.
- Kelly described eleven corollaries, including individuality (people differ in their constructions), organisation (constructs are arranged in systems), choice (people choose the pole that extends their system), range, experience (constructs change with experience), and sociality (understanding another person's constructs allows a role relationship with them).
- Anxiety arises when events fall outside one's construct system; threat is awareness of imminent change in core constructs; guilt is acting against one's core role.
- Don Bannister used this theory to explain thought disorder in schizophrenia as a loosening of construct relationships.

## Repertory grid
The repertory grid technique elicits a person's constructs by comparing "elements" (important people such as mother, father, self, ideal self, a friend): "In what way are two of these alike and different from the third?" Ratings are analysed to show the structure of the person's construct system and the distance between self and ideal self. It is used in clinical, organisational and market research.

## Therapy and uses
Personal construct therapy helps people revise constructs that no longer work. Fixed role therapy asks the client to act for a few weeks as a new character, described in a sketch written with the therapist, to experiment with new ways of construing. Used in stuttering (Fransella), depression and personality problems; evidence from controlled trials is limited, but the repertory grid remains a valuable research tool.

## Conclusion
Personal construct theory sees people as active interpreters of their worlds; its repertory grid and fixed role therapy are lasting contributions.`,
    keyPoints: ["Kelly 1955 and person as scientist", "Fundamental postulate and constructive alternativism", "Bipolar constructs and key corollaries", "Kelly's definitions of anxiety, threat and guilt", "Repertory grid method", "Fixed role therapy and Bannister's work"],
    module: "personality-theories",
    ref: "Kelly 1955; Bannister and Fransella Inquiring Man; Fransella stuttering",
  },
  {
    id: "ther-l08-009",
    subject: "clinical-therapies",
    topic: "therapy-comparison",
    marks: 20,
    difficulty: 3,
    exams: ["mcp-entrance", "ma-semester"],
    question: "Compare and contrast cognitive behavioural, psychodynamic and humanistic approaches to psychotherapy, with reference to their view of the person, theory of psychopathology, therapeutic relationship, techniques and evidence. How would you integrate them in practice?",
    plan: ["Introduction to the three traditions", "View of the person and psychopathology", "Therapeutic relationship and stance", "Techniques and goals", "Evidence and critique", "Integration and conclusion"],
    answer: `## Introduction
The three main traditions in psychotherapy grew from different intellectual roots: psychodynamic therapy from Freud's psychoanalysis (late nineteenth century), cognitive behavioural therapy from learning theory and the cognitive revolution (behaviour therapy in the 1950s, cognitive therapy in the 1960s and 1970s), and humanistic therapies from the "third force" in psychology (Rogers, Maslow, Perls) in the 1950s and 1960s. Each offers a distinct view of what people are, why they suffer and how they change.

## View of the person
- Psychodynamic: humans are driven by unconscious wishes, conflicts and early relationships; much of mental life is outside awareness; behaviour is determined by internal forces shaped in childhood.
- Cognitive behavioural: humans are learners and information processors; behaviour and emotion are shaped by conditioning and by the way events are interpreted; the focus is on observable behaviour and accessible thoughts.
- Humanistic: humans are basically good, free, responsible and motivated towards growth and self actualisation; subjective experience is central.

## Theory of psychopathology
- Psychodynamic: symptoms arise from unresolved conflicts, defences and repeated relationship patterns, often rooted in early attachment and development.
- Cognitive behavioural: problems are maintained by learned associations, reinforcement of avoidance and safety behaviours, and biased thinking (automatic thoughts, assumptions, schemas). The emphasis is on what maintains the problem now, rather than its origins.
- Humanistic: distress arises from incongruence between self concept and experience, created by conditions of worth (Rogers), from blocked awareness and unfinished business (Gestalt), or from avoidance of existential realities.

## Therapeutic relationship and stance
| Feature | Psychodynamic | Cognitive behavioural | Humanistic |
| Therapist role | Interpreter, relatively neutral, attentive to transference | Active collaborator, coach, teacher | Genuine, empathic companion |
| Relationship | Vehicle of change through transference and countertransference | Necessary base for technique; collaborative empiricism | The main agent of change (core conditions) |
| Directiveness | Low to moderate | High, structured | Low (person centred) to moderate (Gestalt) |
| Time focus | Past and present links | Present and future | Present, here and now |

## Techniques and goals
- Psychodynamic: free association, exploration, clarification, confrontation and interpretation of defences and transference, working through; goals are insight, structural personality change and better relationships.
- Cognitive behavioural: assessment and formulation, psychoeducation, self monitoring, cognitive restructuring, behavioural experiments, exposure, activity scheduling, skills training and homework; goals are symptom reduction, skills and relapse prevention.
- Humanistic: empathic reflection, unconditional positive regard and congruence (person centred), awareness experiments and chair work (Gestalt), exploration of meaning (existential); goals are self acceptance, authenticity, growth and fuller functioning.

## Evidence
- CBT has the largest evidence base, with disorder specific protocols effective for depression, anxiety disorders, OCD, PTSD, eating disorders, insomnia and psychosis related distress; it is easier to manualise and test.
- Short term psychodynamic therapy has growing evidence, with effects similar to CBT for depression and some anxiety disorders, and specific models (MBT, TFP) for borderline personality disorder; long term therapy has less evidence.
- Humanistic therapies (person centred, emotion focused) show effects comparable to other therapies for depression and general distress; emotion focused therapy has trial evidence; the core conditions are supported as common factors.
- The Dodo bird verdict suggests many bona fide therapies perform similarly overall, but specific treatments (exposure for anxiety disorders, ERP for OCD) do better for some conditions.

## Critique
- Psychodynamic: long, costly, hard to test, concepts difficult to measure; risk of over interpretation.
- CBT: can be mechanical, may neglect the relationship, emotion and the past; high relapse in some conditions; less attention to meaning and culture.
- Humanistic: optimistic view may underplay severe mental illness, biology and the need for structure; less evidence for specific disorders.

## Integration in practice
Most clinicians today work integratively:
- Common factors integration: building the alliance, empathy and hope as the base of all work.
- Theoretical integration: combining models into new theories, as in cognitive analytic therapy (Ryle), schema therapy (Young) and the transtheoretical model.
- Technical eclecticism: selecting techniques by evidence and need (Lazarus' multimodal therapy).
- Assimilative integration: working from one main model while borrowing techniques from others.
A practical approach: use a person centred stance to engage, a CBT formulation and techniques for current symptoms, psychodynamic understanding of relationship patterns and transference when progress stalls, and existential or humanistic attention to meaning, especially in grief, illness and life transitions. In India, an integrative, flexible, family inclusive approach, sometimes more directive (as in Neki's guru chela model), often suits clients best.

## Conclusion
The three traditions differ in their views of the person, causes of suffering, therapist role and techniques, but share a belief in the healing power of the relationship. CBT has the strongest disorder specific evidence, psychodynamic therapy adds depth on relationships and the past, and humanistic therapy centres empathy and growth. Thoughtful integration, guided by evidence and the client's needs, is the norm in modern practice.`,
    keyPoints: ["Historical roots of the three traditions", "View of the person in each", "Theory of psychopathology in each", "Relationship and stance comparison table", "Techniques and goals", "Evidence base for each", "Critique of each", "Forms of integration with practical example and Indian context"],
    pitfalls: ["Only describing one approach", "No comparison table", "Claiming one approach is best for everything"],
    visuals: [tree("Integration in practice", [["Psychotherapy integration", "", -1], ["Common factors", "Alliance, empathy, hope", 0], ["Theoretical integration", "CAT, schema therapy", 0], ["Technical eclecticism", "Lazarus multimodal", 0], ["Assimilative integration", "One base model plus borrowed techniques", 0]])],
    module: "therapies",
    ref: "Norcross and Goldfried Handbook of Psychotherapy Integration; Wampold 2015; Leichsenring 2015; Elliott 2013 humanistic meta-analysis; Ryle CAT",
  },
  {
    id: "ther-l08-010",
    subject: "clinical-therapies",
    topic: "therapy-vs-counselling",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "mcp-entrance", "ugc-net"],
    question: "Viva: What is the difference between guidance, counselling and psychotherapy?",
    plan: ["Define each", "Compare on key features", "Overlap", "Indian context"],
    answer: `## Definitions
- Guidance: helping people make choices and plans through information and advice, often about education, careers or life decisions; usually for people without mental disorders.
- Counselling: a professional relationship that helps people with personal, social, educational or vocational concerns to understand themselves, solve problems and cope, usually over a shorter period and with relatively well functioning clients.
- Psychotherapy: the treatment of mental disorders and long standing emotional or personality problems using psychological methods based on theory, often longer and deeper, by trained clinicians.

## Comparison
| Feature | Guidance | Counselling | Psychotherapy |
| Focus | Information and decisions | Current problems, adjustment, coping | Mental disorders, deep or long standing patterns |
| Clients | Students, general public | Mostly well functioning people in difficulty | People with diagnosable conditions |
| Depth | Surface | Moderate | Deeper, including personality and past |
| Duration | Brief | Short to medium | Medium to long |
| Practitioner | Teachers, guidance officers | Counsellors | Clinical psychologists, psychiatrists, trained psychotherapists |
| Setting | Schools, colleges, career centres | Schools, workplaces, community, health | Clinics and hospitals |

## Overlap
The boundaries are blurred: counselling and psychotherapy share theories and techniques (person centred, CBT), and many professionals use the terms interchangeably. The difference is more of degree than of kind.

## Indian context
In India, school and college counsellors provide guidance and counselling, while the Rehabilitation Council of India regulates clinical psychologists who provide psychotherapy for mental disorders. Under the MHCA 2017, a clinical psychologist is a recognised mental health professional.

## Conclusion
Guidance informs, counselling supports adjustment and problem solving, and psychotherapy treats mental disorders in depth, though they overlap.`,
    keyPoints: ["Definitions of all three", "Comparison table", "Overlap of degree", "Practitioners and settings", "RCI and MHCA in India"],
    module: "therapies",
    ref: "Nelson-Jones; Gladding Counseling; MHCA 2017 s2 definitions; RCI Act 1992",
  },
]);
