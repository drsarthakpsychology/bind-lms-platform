import type { LongQA } from "@/lib/prep/long-types";
import { anchored, chain, compare, cycle, timeline, tree } from "./visual";

export const CLINICAL_THERAPIES_L03: LongQA[] = anchored([
  {
    id: "ther-l03-001",
    subject: "clinical-therapies",
    topic: "mi-principles",
    marks: 15,
    difficulty: 2,
    exams: ["mcp-entrance", "ma-semester", "md-psychiatry"],
    question: "Describe motivational interviewing: its spirit, processes, core skills and evidence.",
    plan: ["Definition and origins", "Ambivalence and the righting reflex", "The spirit of MI", "Four processes", "Core skills and change talk with examples", "Evidence, uses in India and conclusion"],
    answer: `## Definition and origins
Motivational interviewing (MI) is a collaborative, person centred conversation style for strengthening a person's own motivation and commitment to change. William Miller described it in 1983 from work with problem drinkers and developed it further with Stephen Rollnick. It grew from Rogers' client centred therapy but is more directional: it purposely guides towards change.

## Ambivalence and the righting reflex
- Ambivalence, wanting and not wanting to change at the same time, is normal, not denial or resistance. ("I know drinking is hurting my liver, but it is the only way I can relax.")
- The "righting reflex" is the helper's urge to fix the problem by arguing for change; this usually makes the person defend the other side of their ambivalence, strengthening the status quo. MI avoids it.
- People are more persuaded by what they hear themselves say than by what others tell them.

## The spirit of MI
- Partnership: working with, not on, the person.
- Acceptance: absolute worth, accurate empathy, autonomy support and affirmation.
- Compassion: actively promoting the person's welfare.
- Evocation: drawing out the person's own reasons and resources rather than installing them.

## Four processes
- Engaging: building a helpful working relationship.
- Focusing: agreeing on a direction or target behaviour.
- Evoking: eliciting the person's own motivations for change (change talk).
- Planning: developing commitment and a specific change plan when the person is ready.

## Core skills (OARS)
- Open questions: "What worries you about your drinking?"
- Affirmations: "You have shown real determination by coming today."
- Reflections: simple ("You're tired of the arguments at home") and complex, including double sided reflections ("On one hand drinking helps you relax, and on the other hand you are worried about your health and your children").
- Summaries: collecting and linking what the person has said, especially change talk.
Plus informing and advising with permission ("Would it be all right if I shared some information about alcohol and the liver?") using elicit, provide, elicit.

## Change talk and sustain talk
- Change talk is the person's own speech in favour of change. Preparatory change talk is remembered as DARN: desire ("I want to cut down"), ability ("I could stop on weekdays"), reasons ("My son is scared when I drink"), need ("I have to do something"). Mobilising change talk is CAT: commitment ("I will"), activation ("I'm ready"), taking steps ("I didn't drink yesterday").
- Sustain talk argues for the status quo. Discord is tension in the relationship. Both are responded to with reflection, emphasising autonomy, reframing and shifting focus, rather than arguing ("rolling with resistance" in the earlier language).
- Tools: importance and confidence rulers ("On a scale of 0 to 10, how important is it for you to cut down? Why a 5 and not a 2?"), decisional balance, looking back and looking forward, exploring values.

## Evidence
- Meta analyses show small to moderate effects for alcohol and drug use, smoking, health behaviours (diet, exercise, medication adherence) and engagement in treatment. Effects are larger when MI is added to other treatments and in brief opportunistic settings.
- Project MATCH found motivational enhancement therapy (four sessions) as effective as longer CBT and twelve step facilitation for alcohol problems.
- The quality of MI matters; therapist empathy and proportion of change talk predict outcome.

## Uses in India
MI is used in de addiction centres, tobacco cessation clinics, HIV and diabetes care, and the Counselling for Alcohol Problems programme delivered by lay counsellors in Goa. Family members, who often bring patients, can be helped to use MI style communication instead of confrontation.

## Conclusion
MI resolves ambivalence by evoking the person's own reasons for change within a respectful partnership. Its spirit and skills are simple to describe but need practice, and it has good evidence across addiction and health behaviours.`,
    keyPoints: ["Definition and Miller and Rollnick", "Ambivalence as normal and the righting reflex", "Four elements of the spirit", "Four processes", "OARS with examples", "DARN and CAT change talk", "Responding to sustain talk and discord", "Evidence including Project MATCH"],
    pitfalls: ["Calling MI a technique for persuading", "Confrontation and labelling as denial", "Confusing MI with the stages of change model"],
    visuals: [timeline("Four processes", [["Engaging", "Build the relationship"], ["Focusing", "Agree on a direction"], ["Evoking", "Draw out change talk"], ["Planning", "Commit to a plan"]])],
    module: "therapies",
    ref: "Miller and Rollnick 2013 Motivational Interviewing 3rd edition; Project MATCH 1997; Lundahl 2010 meta-analysis; Nadkarni 2017 CAP",
  },
  {
    id: "ther-l03-002",
    subject: "clinical-therapies",
    topic: "mi-stages",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "mcp-entrance", "ugc-net"],
    question: "Write short notes on the transtheoretical (stages of change) model.",
    plan: ["Origin", "The stages", "Processes and clinical use", "Critique"],
    answer: `## Origin
James Prochaska and Carlo DiClemente developed the transtheoretical model in the late 1970s and 1980s from studies of smokers who quit with and without treatment. It describes change as a process through stages rather than a single event.

## The stages
- Precontemplation: not considering change in the next six months ("I don't have a problem").
- Contemplation: thinking about change, ambivalent ("I should cut down, but...").
- Preparation: intending to act soon, making small steps (planning a quit date).
- Action: actively changing behaviour (under six months).
- Maintenance: sustaining change beyond six months, preventing relapse.
- Relapse (and recycling) is common and seen as part of the process; termination is sometimes added.

## Processes and clinical use
Different interventions suit different stages: consciousness raising and MI style conversation in precontemplation and contemplation; planning and commitment in preparation; behavioural strategies (stimulus control, reinforcement, helping relationships) in action and maintenance. Decisional balance (pros and cons) and self efficacy change across stages.

## Critique
- Stages are arbitrary time based categories; people move back and forth quickly.
- Stage matched interventions have not consistently outperformed non matched ones.
- It is not the same as motivational interviewing, though the two are often taught together.

## Conclusion
The stages of change model is a useful way to think about readiness and to tailor conversations, but it should be applied flexibly.`,
    keyPoints: ["Prochaska and DiClemente", "Five or six stages with time frames", "Relapse as part of the cycle", "Stage matched interventions", "Decisional balance and self efficacy", "Critique and difference from MI"],
    visuals: [cycle("The stages", [["Precontemplation", "Not thinking of change"], ["Contemplation", "Ambivalent"], ["Preparation", "Planning"], ["Action", "Changing"], ["Maintenance", "Sustaining"], ["Relapse", "Recycle and learn"]])],
    module: "therapies",
    ref: "Prochaska and DiClemente 1983; West 2005 critique Addiction",
  },
  {
    id: "ther-l03-003",
    subject: "clinical-therapies",
    topic: "brief-intervention",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "mcp-entrance", "md-psychiatry"],
    question: "Write short notes on brief interventions for hazardous drinking.",
    plan: ["Definition and setting", "Screening", "FRAMES elements", "Evidence"],
    answer: `## Definition and setting
A brief intervention is a short, structured conversation (5 to 30 minutes, sometimes repeated) by a health worker to help a person reduce risky alcohol use. It is aimed at hazardous and harmful drinkers who are not dependent, in primary care, emergency departments, hospital wards and workplaces. It forms part of SBIRT: screening, brief intervention and referral to treatment.

## Screening
The AUDIT (ten items; scores of 8 to 15 hazardous, 16 to 19 harmful, 20 or more possible dependence) or the short AUDIT C (three items). In India, the AUDIT has been validated in several languages.

## FRAMES elements
- Feedback: personal information on risk (for example, liver tests, AUDIT score, injuries).
- Responsibility: the decision to change is the person's.
- Advice: clear advice to cut down or stop.
- Menu: a range of options and strategies (alcohol free days, smaller measures, avoiding certain situations).
- Empathy: warm, non judgemental style.
- Self efficacy: encouraging confidence that change is possible.
Brief interventions often use motivational interviewing skills.

## Evidence
Trials in primary care show that brief interventions reduce alcohol consumption by a few drinks a week and reduce heavy drinking for up to a year; evidence is weaker in emergency settings and for dependent drinkers, who need referral. In India, WHO's ASSIST linked brief intervention and the Counselling for Alcohol Problems programme have been tested.

## Conclusion
Brief interventions are low cost, evidence based steps for reducing hazardous drinking when combined with routine screening.`,
    keyPoints: ["Definition and SBIRT", "Target group of non dependent drinkers", "AUDIT cut offs", "FRAMES elements", "Evidence in primary care", "Referral for dependence"],
    module: "substance",
    ref: "Babor AUDIT 2001; Kaner 2018 Cochrane brief interventions; Miller and Sanchez FRAMES",
  },
  {
    id: "ther-l03-004",
    subject: "clinical-therapies",
    topic: "ipt",
    marks: 10,
    difficulty: 2,
    exams: ["mcp-entrance", "ma-semester", "md-psychiatry"],
    question: "Describe interpersonal psychotherapy: theory, problem areas, phases and evidence.",
    plan: ["Origins and theoretical basis", "The four problem areas", "Phases of treatment", "Techniques", "Evidence and adaptations including global use", "Conclusion"],
    answer: `## Origins and theory
Gerald Klerman and Myrna Weissman developed interpersonal psychotherapy (IPT) in the 1970s for depression. It draws on the interpersonal school (Adolf Meyer, Harry Stack Sullivan) and attachment theory (Bowlby). IPT holds that depression, whatever its causes, occurs in an interpersonal context: problems in relationships can trigger depression, and depression damages relationships. Improving current relationships and social support relieves depression. It does not interpret unconscious conflicts or focus on childhood.

## The four problem areas
- Grief: complicated bereavement after the death of a loved one.
- Interpersonal role disputes: conflicts with a spouse, family member, employer or friend, where expectations do not match.
- Role transitions: difficult life changes such as marriage, becoming a parent, retirement, migration, diagnosis of illness, or job loss.
- Interpersonal deficits (sensitivity): long standing social isolation or lack of relationships; the least researched area.

## Phases
- Initial phase (sessions 1 to 3): diagnosis and psychoeducation, giving the "sick role" (depression is an illness that is not the patient's fault, temporarily excusing some duties while expecting active work in therapy); the interpersonal inventory (a review of important relationships); choice of one or two problem areas; an interpersonal formulation and treatment contract.
- Middle phase (sessions 4 to 12 or so): work on the problem area:
- Grief: facilitating mourning, reconstructing the relationship, finding new activities and relationships.
- Disputes: identifying the stage (renegotiation, impasse, dissolution), clarifying expectations, improving communication.
- Transitions: mourning the old role, evaluating the new role, developing skills and support.
- Deficits: reducing isolation and building relationships.
- Termination phase (last two to four sessions): reviewing progress, recognising feelings about ending, relapse prevention.
Treatment usually lasts 12 to 16 weekly sessions.

## Techniques
Exploratory questioning, encouragement of affect, clarification, communication analysis (examining specific conversations), role play, decision analysis, and linking mood changes to interpersonal events.

## Evidence and adaptations
- Effective for acute depression in many trials (including the NIMH Treatment of Depression Collaborative Research Program), comparable to CBT and antidepressants for mild to moderate depression, and useful in maintenance (monthly IPT reduced recurrence).
- Adapted for adolescents (IPT-A), perinatal depression, bipolar disorder (interpersonal and social rhythm therapy), eating disorders (especially bulimia and binge eating) and PTSD.
- Group IPT delivered by lay workers in rural Uganda reduced depression, and WHO published a group IPT manual for low resource settings. Its focus on relationships and family fits Indian contexts, where disputes with in laws, marital conflict and migration are common.

## Conclusion
IPT is a time limited, structured therapy that treats depression by improving interpersonal functioning in one of four problem areas. It has strong evidence and is well suited to cultural adaptation and task sharing.`,
    keyPoints: ["Klerman and Weissman", "Interpersonal and attachment basis", "Four problem areas with examples", "Initial phase with sick role and interpersonal inventory", "Middle phase work for each area", "Termination phase", "Techniques including communication analysis", "Evidence and adaptations including group IPT"],
    visuals: [tree("The four problem areas", [["IPT focus", "", -1], ["Grief", "Complicated bereavement", 0], ["Role disputes", "Conflicts with others", 0], ["Role transitions", "Life changes", 0], ["Interpersonal deficits", "Isolation", 0]])],
    module: "therapies",
    ref: "Klerman, Weissman et al 1984; Elkin 1989 NIMH TDCRP; Bolton 2003 JAMA Uganda group IPT; WHO 2016 Group IPT",
  },
  {
    id: "ther-l03-005",
    subject: "clinical-therapies",
    topic: "ipsrt",
    marks: 5,
    difficulty: 3,
    exams: ["mcp-entrance", "md-psychiatry"],
    question: "Write short notes on interpersonal and social rhythm therapy.",
    plan: ["Rationale", "Components", "Evidence", "Practical points"],
    answer: `## Rationale
Ellen Frank developed interpersonal and social rhythm therapy (IPSRT) for bipolar disorder. It combines IPT with the social zeitgeber theory: life events and interpersonal stress disrupt daily routines (social rhythms such as getting up, meals, work and sleep times), which destabilise biological circadian rhythms and trigger mood episodes in vulnerable people.

## Components
- Psychoeducation about bipolar disorder, medicines and the role of rhythms.
- Social rhythm monitoring with the Social Rhythm Metric: recording daily times of getting out of bed, first contact with another person, starting work, meals and going to bed.
- Regularising routines: setting target times, keeping sleep and wake times stable, and limiting overstimulation (late night social events, travel across time zones).
- Interpersonal work using IPT problem areas, with an added area of "grief for the lost healthy self".
- Planning for disruptions (exams, festivals, shift work, childbirth).
- Usually given alongside mood stabilisers.

## Evidence
In trials, IPSRT used during the acute phase lengthened time to recurrence, and greater regularity of social rhythms predicted better outcomes. In the STEP-BD study, intensive psychotherapies (IPSRT, family focused therapy, CBT) improved recovery from bipolar depression compared with brief psychoeducation.

## Practical points
In India, festivals, family events, night shifts and exam schedules often disrupt routines; patients and families can plan for these. Simple sleep and routine diaries can be used even without formal therapy.

## Conclusion
IPSRT stabilises daily rhythms and relationships to prevent mood episodes in bipolar disorder, as an addition to medicines.`,
    keyPoints: ["Ellen Frank", "Social zeitgeber theory", "Social Rhythm Metric", "Regularising routines", "Grief for the lost healthy self", "Evidence including STEP-BD"],
    module: "bipolar",
    ref: "Frank 2005 Arch Gen Psychiatry IPSRT; Miklowitz 2007 STEP-BD psychotherapy",
  },
  {
    id: "ther-l03-006",
    subject: "clinical-therapies",
    topic: "family-therapy-schools",
    marks: 15,
    difficulty: 3,
    exams: ["mcp-entrance", "ma-semester"],
    question: "Compare and contrast the major schools of family therapy: structural, strategic, Milan systemic and Bowenian.",
    plan: ["Systems theory as the common basis", "Each school: key figures, concepts, techniques", "Comparison table", "Later developments", "Evidence, Indian relevance and conclusion"],
    answer: `## Common basis: systems theory
Family therapy grew in the 1950s from general systems theory and cybernetics. The family is seen as a system in which each member's behaviour affects the others; problems are maintained by patterns of interaction rather than residing in one "identified patient". Key ideas include circular (rather than linear) causality, homeostasis (families resist change), feedback loops, subsystems and boundaries. Early influences included Gregory Bateson's double bind hypothesis of schizophrenia, which is now discredited as a cause but was important historically.

## Structural family therapy
- Salvador Minuchin, working with poor families in New York and later at the Philadelphia Child Guidance Clinic.
- Concepts: family structure, subsystems (parental, spousal, sibling), hierarchy, and boundaries that may be clear, rigid (disengaged families) or diffuse (enmeshed families); alliances and coalitions (for example, a parent and child against the other parent).
- Techniques: joining the family, mapping its structure, enactments (asking the family to act out a problem in the session), unbalancing, restructuring boundaries and strengthening the parental subsystem.
- Applied notably to anorexia nervosa ("psychosomatic families").

## Strategic family therapy
- Jay Haley, Cloe Madanes and the Mental Research Institute (MRI) in Palo Alto (Watzlawick, Weakland, Fisch).
- Concepts: problems are maintained by the family's attempted solutions; focus on the presenting problem and on changing interaction sequences, with little interest in insight.
- Techniques: directives (instructions to do something differently), paradoxical interventions (prescribing the symptom), reframing, ordeal therapy, and brief, problem focused work (the MRI brief therapy model).

## Milan systemic therapy
- Mara Selvini Palazzoli, Luigi Boscolo, Gianfranco Cecchin and Giuliana Prata in Milan in the 1970s.
- Concepts: families as systems of meanings and beliefs; the symptom serves a function in the system.
- Techniques: a team behind a one way mirror; hypothesising, circularity and neutrality; circular questioning ("Who is most upset when your brother does not eat? And who is next?"); positive connotation (describing the symptom as serving a good purpose for the family); end of session interventions and rituals.
- Later "post Milan" work (Boscolo and Cecchin) moved towards curiosity and collaborative conversations.

## Bowenian family systems therapy
- Murray Bowen.
- Concepts: differentiation of self (the ability to separate thinking from feeling and to keep a sense of self in close relationships); triangles (a third person is drawn in to reduce tension between two); the family emotional system; multigenerational transmission of anxiety and patterns; emotional cut off; sibling position; nuclear family emotional process.
- Techniques: genograms over three generations, calm "coaching" of individuals, detriangulation, and encouraging contact with the family of origin. The therapist stays calm and non reactive.

## Comparison
| Feature | Structural | Strategic | Milan | Bowenian |
| Key figure | Minuchin | Haley, MRI | Selvini Palazzoli | Bowen |
| Focus | Structure, boundaries, hierarchy | Problem maintaining sequences | Beliefs, meanings, function of symptom | Differentiation, multigenerational patterns |
| Therapist role | Active director, joins and restructures | Directive strategist | Neutral, curious team | Calm coach |
| Key techniques | Enactment, unbalancing | Directives, paradox, reframing | Circular questions, positive connotation | Genogram, detriangulation |
| Time frame | Present | Present, brief | Present, spaced sessions | Past and present across generations |
| Insight needed | Little | Little | Some | Yes, intellectual understanding |

## Later developments
- Narrative therapy (Michael White and David Epston): externalising the problem and re-authoring stories.
- Solution focused brief therapy (de Shazer and Berg).
- Psychoeducational and behavioural family therapy for schizophrenia and bipolar disorder.
- Family based treatment for adolescent anorexia, multisystemic therapy and functional family therapy for conduct problems, and attachment based family therapy.

## Evidence and Indian relevance
The classical schools have limited trial evidence, though structural ideas underpin effective treatments for adolescent anorexia and conduct problems. Behavioural and psychoeducational family interventions have strong evidence in schizophrenia. In India, the joint family, strong family involvement in care, arranged marriages and intergenerational hierarchies make systemic thinking very relevant; therapists must respect hierarchy, work with elders and adapt to cultural norms about expressing conflict. NIMHANS and other centres train family therapists.

## Conclusion
The major schools share systems thinking but differ in focus, technique and therapist role: structural on boundaries, strategic on problem maintaining solutions, Milan on meanings and circular questioning, and Bowenian on differentiation across generations. Modern practice integrates their ideas with evidence based family interventions.`,
    keyPoints: ["Systems theory concepts", "Structural: Minuchin, boundaries, enactment", "Strategic: Haley, MRI, directives, paradox", "Milan: circular questioning, positive connotation, neutrality", "Bowen: differentiation, triangles, genogram", "Comparison table", "Later developments", "Evidence and Indian relevance"],
    visuals: [compare("Enmeshed and disengaged families", ["Enmeshed (diffuse boundaries)", ["Over involvement", "Little privacy or autonomy", "Members react to each other's feelings"], "Too close"], ["Disengaged (rigid boundaries)", ["Little emotional contact", "Support not offered", "Members isolated"], "Too distant"], "Structural family therapy")],
    module: "therapies",
    ref: "Minuchin 1974 Families and Family Therapy; Haley 1976; Selvini Palazzoli 1978 Paradox and Counterparadox; Bowen 1978; Carr 2019 evidence review",
  },
  {
    id: "ther-l03-007",
    subject: "clinical-therapies",
    topic: "family-psychoeducation",
    marks: 10,
    difficulty: 2,
    exams: ["mcp-entrance", "md-psychiatry"],
    question: "Discuss family interventions in schizophrenia.",
    plan: ["Rationale: expressed emotion and burden", "Components", "Models", "Evidence", "Indian context and conclusion"],
    answer: `## Rationale
- Expressed emotion (critical comments, hostility, emotional over involvement) in relatives predicts relapse in schizophrenia.
- Families carry a heavy burden of care, stress and stigma, especially in India where most people with schizophrenia live with relatives.
- Families are partners in recovery, not causes of the illness; older theories blaming families (the "schizophrenogenic mother") have been rejected.

## Components
- Engagement and a non blaming stance.
- Psychoeducation: nature of schizophrenia, causes (stress vulnerability), symptoms, treatment, side effects and early warning signs.
- Communication training: expressing positive feelings, making requests, active listening, expressing negative feelings calmly.
- Problem solving: defining problems, generating solutions, choosing and planning, reviewing.
- Crisis planning and relapse prevention.
- Support for carers' own wellbeing and expectations.
- Usually at least ten sessions over three months to a year, ideally including the patient.

## Models
- Behavioural family therapy (Falloon), focusing on communication and problem solving.
- Leff and Kuipers' approach combining education, relatives' groups and family sessions.
- Multiple family groups (McFarlane), bringing several families together.
- Family to family peer programmes.

## Evidence
Meta analyses show family interventions reduce relapse and readmission by about half in the first year or two, improve adherence and reduce family burden, with effects lasting when sessions are adequate in number. Guidelines recommend offering family intervention to all families of people with schizophrenia who live with or are in close contact with them.

## Indian context
- Indian families are typically highly involved, and expressed emotion levels are often lower than in the West, but burden is high.
- Studies from NIMHANS, Chandigarh and Chennai have shown benefits of family psychoeducation, often adapted into shorter formats and delivered in groups or at home by social workers and nurses.
- Adaptations: involving several relatives, respecting family hierarchy, addressing beliefs about causes (karma, black magic), marriage related concerns and stigma, and linking families with support groups.

## Conclusion
Family interventions are among the most effective psychosocial treatments in schizophrenia, halving relapse and supporting carers. They are particularly suited to India's family centred care.`,
    keyPoints: ["Expressed emotion and burden rationale", "Non blaming stance", "Psychoeducation, communication training, problem solving", "Duration of at least ten sessions", "Falloon, Leff and McFarlane models", "Relapse reduced by about half", "Indian studies and adaptations"],
    visuals: [chain("Components", [["Engage without blame", ""], ["Psychoeducation", "Illness, treatment, warning signs"], ["Communication training", "Calm, specific, positive"], ["Problem solving", "Step by step"], ["Relapse plan", "What to do early"]])],
    module: "psychosis",
    ref: "Pharoah 2010 Cochrane family intervention; Falloon 1985; Leff 1982; NICE CG178; Thara and Kurian family burden studies",
  },
  {
    id: "ther-l03-008",
    subject: "clinical-therapies",
    topic: "fbt",
    marks: 5,
    difficulty: 3,
    exams: ["mcp-entrance", "md-psychiatry"],
    question: "Write short notes on family based treatment for adolescent anorexia nervosa.",
    plan: ["Origins and principles", "Three phases", "Evidence", "Limits and adaptations"],
    answer: `## Origins and principles
Family based treatment (FBT) was developed in London by Christopher Dare and Ivan Eisler and later manualised by James Lock and Daniel le Grange. Principles:
- An agnostic view of cause: parents are not blamed.
- Parents are the main resource and take charge of refeeding at home.
- The illness is separated (externalised) from the adolescent.
- The therapist is a consultant and expert who empowers parents.
- Early focus on weight restoration rather than on underlying issues.

## Three phases
- Phase 1 (weight restoration): parents take full control of meals and eating; a family meal session in the first weeks lets the therapist coach parents to help the young person eat one more mouthful than she intended; siblings support the adolescent.
- Phase 2 (returning control): once weight is mostly restored and eating is less fraught, control over eating is gradually handed back to the adolescent.
- Phase 3 (adolescent issues): once weight is stable, the focus shifts to normal adolescent development, independence and relationships, and termination.
Usually about 20 sessions over 6 to 12 months.

## Evidence
FBT is the best supported treatment for adolescents with anorexia of short duration. Trials show higher rates of full remission at follow up than individual adolescent focused therapy, and fewer hospital admissions. Early weight gain (in the first four weeks) predicts good outcome.

## Limits and adaptations
Less suitable for families with high criticism (separated sessions with parents and adolescent help), severe medical risk, or older adolescents; parents may be exhausted. Indian adaptations require attention to extended family roles and to food beliefs and practices.

## Conclusion
FBT puts parents in charge of refeeding in a structured, non blaming way and is the first line treatment for adolescent anorexia nervosa.`,
    keyPoints: ["Originators and manualisation", "Agnostic, non blaming stance and externalisation", "Three phases", "Family meal session", "Evidence and early weight gain predictor", "Limits and separated FBT"],
    module: "more-disorders",
    ref: "Lock and le Grange 2001 manual; Lock 2010 Arch Gen Psychiatry; Eisler 2000 separated family therapy",
  },
  {
    id: "ther-l03-009",
    subject: "clinical-therapies",
    topic: "couples-therapy",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "mcp-entrance"],
    question: "Write short notes on couples therapy.",
    plan: ["Indications", "Behavioural and integrative approaches", "Emotionally focused therapy", "Evidence and Indian context"],
    answer: `## Indications
Relationship distress, communication problems, infidelity, sexual difficulties, and as a treatment when one partner has depression, alcohol use disorder or anxiety linked with relationship problems. It is not suitable when there is ongoing serious domestic violence, where safety must come first.

## Behavioural and integrative approaches
- Behavioural couple therapy (Jacobson and Margolin, Stuart): increasing positive exchanges ("caring days"), communication training (speaker and listener skills), and problem solving.
- Integrative behavioural couple therapy (Jacobson and Christensen): adds acceptance of differences that cannot change, through empathic joining and unified detachment, alongside change strategies.
- Behavioural couples therapy for alcohol use disorder (O'Farrell): a daily "sobriety contract" and joint activities; it improves abstinence and relationship satisfaction.

## Emotionally focused therapy
Developed by Sue Johnson and Les Greenberg, based on attachment theory. Distress is seen as a cycle of negative interaction (for example, one partner pursues and criticises, the other withdraws) driven by unmet attachment needs. Steps: de-escalating the cycle, restructuring interactions by helping partners express underlying vulnerable emotions (fear of rejection, loneliness) and respond to each other's needs, and consolidation.

## Evidence and Indian context
Behavioural couple therapy and EFT have good evidence for relationship distress, with about two thirds of couples improving. Couple therapy also helps depression in a distressed partner. In India, extended family involvement, arranged marriages, dowry related conflict and stigma about seeking help are common issues; therapists may need to include in laws or work within family hierarchy, while protecting individual safety and confidentiality.

## Conclusion
Couples therapy, especially behavioural and emotionally focused approaches, is effective for relationship distress and for mental illness linked to relationship problems.`,
    keyPoints: ["Indications and violence caution", "Behavioural couple therapy techniques", "Integrative acceptance approach", "Behavioural couples therapy for alcohol", "EFT attachment cycle and steps", "Evidence and Indian issues"],
    module: "therapies",
    ref: "Johnson 2004 EFT; Christensen 2004 IBCT trial; O'Farrell BCT; Lebow 2012 review",
  },
  {
    id: "ther-l03-010",
    subject: "clinical-therapies",
    topic: "solution-focused",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "mcp-entrance", "ugc-net"],
    question: "Write short notes on solution focused brief therapy.",
    plan: ["Origins and assumptions", "Key techniques", "Uses and evidence", "Limits"],
    answer: `## Origins and assumptions
Solution focused brief therapy (SFBT) was developed by Steve de Shazer and Insoo Kim Berg at the Brief Family Therapy Center in Milwaukee in the 1980s. It assumes that:
- Clients have strengths and resources; change is constant and inevitable.
- It is more useful to build solutions than to analyse problems.
- There are always exceptions, times when the problem is absent or smaller.
- Small changes lead to bigger changes.
- The client defines the goals.

## Key techniques
- The miracle question: "Suppose tonight, while you sleep, a miracle happens and the problem is solved. When you wake up, what will be the first thing you notice that is different?"
- Exception questions: "When was the problem a little less? What were you doing differently?"
- Scaling questions: "On a scale of 0 to 10, where are you now? What would one point higher look like?"
- Coping questions: "How have you managed to keep going despite this?"
- Compliments and identifying strengths.
- Pre session change questions and tasks: "Do more of what works."
Therapy is usually brief, from one to about six sessions.

## Uses and evidence
Used in schools, counselling, child and family services, substance use and workplace settings. Meta analyses show small to moderate benefits for a range of problems, particularly internalising problems in young people, though trial quality is mixed.

## Limits
Less suitable as the sole treatment for severe mental illness, trauma needing processing, or high risk situations; may seem dismissive if clients feel their problems are not heard.

## Conclusion
SFBT is a brief, strengths based approach that helps clients build on exceptions and envisage their preferred future through questions such as the miracle and scaling questions.`,
    keyPoints: ["De Shazer and Berg", "Core assumptions", "Miracle question", "Exception, scaling and coping questions", "Brief duration and uses", "Evidence and limits"],
    module: "therapies",
    ref: "de Shazer 1985 Keys to Solution in Brief Therapy; Gingerich and Peterson 2013 review; Kim 2008 meta-analysis",
  },
]);
