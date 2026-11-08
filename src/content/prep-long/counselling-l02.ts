import type { LongQA } from "@/lib/prep/long-types";
import { anchored, chain, compare, cycle, layers, timeline, tree, vis } from "./visual";

const S = "counselling" as const;

export const COUNSELLING_L02: LongQA[] = anchored([
  {
    id: "couns-l02-001",
    subject: S,
    topic: "egan",
    marks: 20,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Describe Gerard Egan's skilled helper model of counselling. Explain each stage and its tasks with a running case example, and evaluate the model.",
    plan: ["What the model is and its aim", "Stage I: the current picture", "Stage II: the preferred picture", "Stage III: the way forward and the action arrow", "Running case example", "Evaluation"],
    answer: `## The model
Gerard Egan's skilled helper model is a problem management and opportunity development approach to counselling. Egan's aim was a practical map that any helper, from a counsellor to a manager or nurse, could follow. It is integrative: it uses Rogers' core conditions for the relationship and adds a structured, goal directed process drawn from problem solving and behavioural ideas. Clients are helped to manage problems more effectively and to use unused opportunities, and to become better at helping themselves.

The model has three stages, each with three tasks, and an action arrow that runs through all of them. The stages are not rigid steps; the counsellor moves back and forth as needed.

## Stage I: the current picture
The question is: what is going on?
- Task 1A: help clients tell their story. Using attending, listening, empathy and probing, the counsellor helps the client describe problems and unused opportunities clearly and concretely.
- Task 1B: help clients become aware of blind spots and develop new perspectives. This is challenging: noticing self defeating thinking, discrepancies and missed strengths.
- Task 1C: help clients choose the right problems to work on. This is leverage: working first on issues that matter, that the client is ready to tackle, and that will make a difference.

## Stage II: the preferred picture
The question is: what do I really want and need?
- Task 2A: possibilities. The client imagines a better future through brainstorming: "If things were better, what would be happening?"
- Task 2B: goals. Possibilities are turned into a change agenda: goals that are specific, outcome focused, prudent, realistic, sustainable, flexible, consistent with values and set within a time frame.
- Task 2C: commitment. The counsellor helps the client find what it will cost and what makes the agenda worth pursuing.

## Stage III: the way forward
The question is: how do I get what I need or want?
- Task 3A: possible strategies. The client brainstorms many ways to reach the goals.
- Task 3B: best fit strategies. The client chooses the strategies that best fit their resources, style and environment.
- Task 3C: plans. Strategies are organised into a step by step plan with dates.

## The action arrow
Egan stressed that counselling is useless without action. The action arrow means that clients are encouraged to act on what they learn at every stage, not only at the end, and the counsellor helps them deal with setbacks, which Egan called the shadow side: avoidance, procrastination and the reluctance to change.

## Running case example
Neha, 28, a bank employee in Ahmedabad, comes because she feels trapped and tearful since her promotion.
1. 1A: She tells the story of long hours, a critical manager and her parents pressing her to marry. The counsellor reflects her exhaustion and fear of disappointing everyone.
2. 1B: The counsellor gently challenges her belief that she must say yes to every request, and points out her skill in handling customers, which she ignores.
3. 1C: Of many issues, she chooses work overload first, because it affects her sleep and she feels ready.
4. 2A and 2B: She imagines leaving by 7 pm three days a week and having one free weekend day. The goal is made specific and time bound.
5. 2C: She weighs the risk of her manager's displeasure against her health and decides it is worth it.
6. 3A to 3C: Strategies include asking for clearer priorities, declining one extra task a week and planning a weekly walk with a friend. She makes a plan for the next two weeks and reviews it in the following session.

## Evaluation
Strengths:
- A clear, teachable structure that suits brief counselling and many settings.
- It combines relationship and action, and integrates ideas from different schools.
- Its emphasis on client strengths and opportunities fits modern positive and solution focused ideas.
- The language is practical and has been widely used in nursing, social work and management training.
Criticisms:
- It can become mechanical if helpers rush through stages.
- It assumes a rational, verbal client who can set goals; clients in acute crisis or with severe disorders may need other approaches first.
- There is little controlled outcome research on the model as a whole; its support comes mainly from research on its parts, such as empathy and goal setting.
- In collectivist settings goals may need to be negotiated with families, which the individual focus can neglect.

## Conclusion
The skilled helper model gives counsellors a flexible map: understand the current picture, imagine a better one and plan the way forward, with action throughout. It is one of the most widely taught frameworks because it joins the warmth of person-centred work to the structure of problem management.`,
    keyPoints: ["Problem management and opportunity development aim", "Three stages with their questions", "Nine tasks named correctly", "Leverage in task 1C", "Goal qualities in task 2B", "Action arrow and the shadow side", "Running case example across stages", "Strengths and criticisms"],
    pitfalls: ["Listing three stages without the tasks", "Missing the action arrow", "A case example that does not follow the stages"],
    module: "therapies/1-2",
    visuals: [
      tree("The model", [["Skilled helper", "Problem management and opportunity development", -1], ["Stage I: current picture", "Story, blind spots, leverage", 0], ["Stage II: preferred picture", "Possibilities, goals, commitment", 0], ["Stage III: way forward", "Strategies, best fit, plan", 0], ["Action arrow", "Act on learning at every stage", 0]]),
      vis("worked", { title: "Running case example", steps: [{ q: "Neha describes overwork, a critical manager and marriage pressure. Which task?", a: "1A: helping her tell the story with empathy." }, { q: "She chooses to work on overload first. Which task?", a: "1C: leverage, choosing the problem that matters and that she is ready for." }, { q: "Leave by 7 pm three days a week within a month. Which task?", a: "2B: a specific, realistic, time bound goal." }, { q: "Decline one extra task a week and plan a weekly walk. Which task?", a: "3B and 3C: choosing best fit strategies and making a plan." }] }),
    ],
    ref: "Egan The Skilled Helper, 10th and later editions; therapies module 1.2",
  },
  {
    id: "couns-l02-002",
    subject: S,
    topic: "counselling-process",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg", "ugc-net"],
    question: "Describe the stages of the counselling process from the first contact to termination and follow up.",
    plan: ["Counselling as a process", "Rapport and intake", "Assessment and goal setting", "Intervention", "Termination and follow up"],
    answer: `## Counselling as a process
Counselling is not a single conversation but a process with recognisable stages. Different writers name them differently, but most describe a similar sequence. The stages overlap and the counsellor may return to earlier ones.

## Stage 1: initial contact and rapport
- The first contact, often a phone call or referral, sets expectations.
- In the first session the counsellor introduces themselves, explains confidentiality and its limits, the number and length of sessions and any fees, and obtains informed consent.
- Rapport is built through attending, empathy and respect. In India, rapport may also involve greeting accompanying family members respectfully and explaining that the client will be seen alone for part of the time.

## Stage 2: assessment
- The counsellor gathers the presenting problem, its history, current functioning, relationships, strengths, risk and any medical or psychiatric issues.
- Tools may include an intake form, a genogram and brief scales.
- The counsellor forms a working understanding, or case conceptualisation, of why the problem arose and what keeps it going.
- If the problem needs a psychiatrist, clinical psychologist or other service, referral is made here.

## Stage 3: goal setting
- Goals are agreed jointly, stated in specific and achievable terms, and linked to what the client values.
- Example: "Attend college four days a week" rather than "feel better".

## Stage 4: intervention
- The counsellor uses methods suited to the goals and the client: person-centred exploration, cognitive restructuring, problem solving, skills training, relaxation, family sessions or career guidance.
- Progress is reviewed regularly, and goals or methods are adjusted.
- The alliance is monitored and ruptures repaired.

## Stage 5: termination
- Termination is planned from the start and discussed some sessions before the end.
- The counsellor and client review progress, consolidate what was learned, anticipate future difficulties and plan how to cope.
- Feelings about ending, such as loss or anxiety, are explored.
- Premature termination by the client is common and should be understood rather than ignored.

## Stage 6: follow up and evaluation
- A follow up session or call after some weeks checks whether gains are maintained.
- Outcome measures taken at the start and end show whether counselling helped.
- Records are completed and stored securely.

## Conclusion
A clear process gives counselling direction: a safe relationship leads to understanding, understanding to agreed goals, goals to planned change, and change to a well prepared ending.`,
    keyPoints: ["Process view with overlapping stages", "Rapport, informed consent and confidentiality at the start", "Assessment including risk and referral", "Specific jointly agreed goals", "Intervention with review", "Planned termination and relapse prevention", "Follow up and outcome evaluation"],
    pitfalls: ["Leaving out informed consent and confidentiality", "Treating termination as just the last session"],
    module: "therapies/1-2",
    visuals: [chain("Counselling as a process", [["Contact and rapport", "Consent, confidentiality, trust"], ["Assessment", "Story, history, risk, strengths"], ["Goal setting", "Specific and agreed"], ["Intervention", "Methods matched to goals"], ["Termination", "Review and prepare for setbacks"], ["Follow up", "Check that gains last"]])],
    ref: "Cormier and Hackney The Professional Counselor; Gladding Counseling: A Comprehensive Profession",
  },
  {
    id: "couns-l02-003",
    subject: S,
    topic: "bordin",
    marks: 10,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "What is the working alliance? Explain Bordin's three components, how alliance ruptures occur and are repaired, and what research shows about the alliance and outcome.",
    plan: ["Definition and Bordin's pan theoretical idea", "Goals, tasks and bond", "Ruptures: withdrawal and confrontation", "Repair", "Research evidence"],
    answer: `## Definition
The working alliance, or therapeutic alliance, is the collaborative relationship between counsellor and client. Edward Bordin argued in 1979 that it is a pan theoretical idea: every form of counselling depends on it, whatever the techniques.

## Bordin's three components
- Agreement on goals: counsellor and client agree on what counselling is trying to change.
- Agreement on tasks: they agree on what will be done in and between sessions, such as talking about the past, keeping a thought diary or doing exposure.
- The bond: mutual trust, liking and respect.
A client may like the counsellor but not see the point of homework; that is a strong bond with weak task agreement. Measures such as the Working Alliance Inventory rate all three.

## Ruptures
A rupture is a strain or breakdown in the alliance. Jeremy Safran and Christopher Muran described two types:
- Withdrawal ruptures: the client moves away, through silence, vague talk, excessive agreement, changing the topic or missing sessions.
- Confrontation ruptures: the client moves against the counsellor, through complaints, criticism or challenging the counsellor's competence.
Ruptures often arise from a mismatch of goals or tasks, a counsellor mistake, or the client's usual relationship pattern being repeated in the room.

## Repair
1. Notice the rupture, including subtle signs.
2. Invite discussion with immediacy: "I noticed you went quiet when I suggested involving your mother. Did that feel wrong?"
3. Accept responsibility for the counsellor's part without defensiveness.
4. Explore the client's experience and the underlying need, for example for respect or autonomy.
5. Renegotiate goals or tasks.
A well repaired rupture can strengthen the alliance and give the client a new experience of relationships, such as disagreeing without being rejected.

## Research evidence
- Meta-analyses of nearly 300 studies with over 30,000 clients find a moderate correlation between alliance and outcome of about 0.28, across therapies, formats and countries.
- The client's rating of the alliance, especially early in counselling, predicts outcome better than the counsellor's rating.
- Rupture repair episodes are linked with better outcomes, and training in rupture resolution can help.
- The direction of cause is debated: early improvement may strengthen the alliance as well as the reverse.

## Conclusion
The alliance is the joint agreement on goals and tasks within a trusting bond. It is one of the strongest predictors of outcome, and attending to ruptures is a core counselling skill.`,
    keyPoints: ["Alliance defined as collaborative and pan theoretical", "Goals, tasks and bond", "Working Alliance Inventory", "Withdrawal and confrontation ruptures", "Steps of repair with immediacy", "Alliance and outcome correlation about 0.28", "Client rating predicts better; direction of cause debated"],
    pitfalls: ["Defining the alliance only as rapport", "Missing rupture types"],
    module: "therapies/1-1",
    visuals: [
      vis("decide", { scene: "In session five a client who was keen on homework says, flatly, \"Whatever you think is best\", and has not filled in her diary.", ask: "What is the best next step?", choices: [{ label: "Remind her firmly that homework is essential.", verdict: "harm", outcome: "She agrees politely and misses the next session.", why: "Pushing the task deepens a withdrawal rupture." }, { label: "Say: I notice something has changed today. Did something about the diary not feel right?", verdict: "best", outcome: "She says the diary made her feel like a failing student.", why: "Immediacy opens repair and allows the task to be renegotiated." }, { label: "Drop homework without comment.", verdict: "ok", outcome: "The session is calmer but the strain stays unspoken.", why: "Avoids conflict but misses the chance to repair." }] }, "Repair"),
    ],
    ref: "Bordin 1979; Safran and Muran 2000; Flückiger, Del Re, Wampold and Horvath 2018 alliance r .278; Eubanks, Muran and Safran 2018 rupture repair",
  },
  {
    id: "couns-l02-004",
    subject: S,
    topic: "solution-focused",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Describe solution focused brief therapy. Explain its assumptions and main techniques with examples, and evaluate its use in counselling.",
    plan: ["Origin and central shift", "Assumptions", "Techniques with examples", "Structure of a session", "Evidence and criticism"],
    answer: `## Origin and central shift
Solution focused brief therapy was developed in the late 1970s and 1980s by Steve de Shazer, Insoo Kim Berg and colleagues at the Brief Family Therapy Center in Milwaukee. It made a radical shift: instead of analysing problems and their causes, the counsellor helps the client build solutions by describing a preferred future and noticing what already works.

## Assumptions
- Change is constant and inevitable; small changes lead to bigger ones.
- The client is the expert on their own life and already has resources and strengths.
- There are always exceptions, times when the problem is absent or less severe.
- It is not necessary to know the cause of a problem to solve it.
- If something works, do more of it; if it does not work, do something different.
- Counselling should be brief, often fewer than six sessions.

## Techniques
- Pre session change: "Many people notice things getting a little better between booking and the first session. What have you noticed?"
- The miracle question: "Suppose tonight while you sleep a miracle happens and the problem is solved. When you wake up, what will be the first thing you notice that tells you things are different?" This produces a detailed picture of the preferred future in behaviour terms.
- Exception questions: "When was the last time you and your son talked without fighting? What was different then?"
- Scaling questions: "On a scale from 0 to 10, where 10 is the morning after the miracle, where are you today?" followed by "What puts you at 3 and not 0?" and "What would one point higher look like?"
- Coping questions, for clients who feel hopeless: "Given how hard this has been, how have you managed to keep going?"
- Compliments: genuine feedback on strengths and efforts.
- Tasks: such as noticing what the client wants to continue, or doing more of what works.

## Structure of a session
1. Problem free talk to build rapport and notice strengths.
2. Establish goals, often through the miracle question.
3. Explore exceptions and scale progress.
4. Take a short break to think, then give compliments and a suggested task.
Later sessions begin with "What is better?" de Shazer described clients as visitors, who do not see a problem, complainants, who see a problem but in others, and customers, who are ready to act; questions are matched to the type.

## Example
A Class 11 student who has stopped attending school rates herself at 2. She says she went on Tuesday because a friend waited for her at the gate. The counsellor compliments her and explores how to arrange that support more often.

## Evaluation
Strengths:
- Brief, respectful and strengths based, it suits schools, primary care, workplaces and settings with long waiting lists, including many Indian services.
- It avoids blame and works well with families and with clients who resist problem talk.
- Reviews of controlled studies find benefits for many problems, especially internalising problems in children and adults, though effects are often small to moderate.
Criticisms:
- Many studies are small and of modest quality.
- It may minimise serious problems, trauma or risk; risk assessment must not be skipped.
- The miracle question can confuse clients who find hypothetical questions strange, and translation into Indian languages needs care.
- Some clients need to feel their problem is understood before they can look at solutions.

## Conclusion
Solution focused therapy turns attention from what is wrong to what works and what the client wants, using a few powerful questions. It is a useful brief approach when combined with careful listening and attention to risk.`,
    keyPoints: ["De Shazer and Berg, Milwaukee", "Shift from problems to solutions", "Key assumptions including exceptions and client expertise", "Miracle, exception, scaling and coping questions with examples", "Session structure with break and compliments", "Visitor, complainant and customer", "Evidence modest; caution about risk"],
    pitfalls: ["Giving the miracle question without its follow up", "Ignoring risk assessment"],
    module: "therapies/1-4",
    visuals: [
      vis("worked", { title: "Techniques", steps: [{ q: "Scaling: where are you today, 0 to 10?", a: "Client: about 2." }, { q: "What puts you at 2 and not at 0?", a: "Client: I went to school on Tuesday because my friend waited for me." }, { q: "What would 3 look like?", a: "Client: going twice a week, maybe if she waits again. The counsellor builds the next step from the exception." }] }),
      chain("Structure of a session", [["Problem free talk", "Rapport and strengths"], ["Goals", "Miracle question"], ["Exceptions and scales", "What already works"], ["Break", "Counsellor reflects"], ["Compliments and task", "Do more of what works"]]),
    ],
    ref: "de Shazer 1985, 1988; Berg; Kim 2008 meta-analysis; Gingerich and Peterson 2013 review",
  },
  {
    id: "couns-l02-005",
    subject: S,
    topic: "guidance-counselling",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "cuet-pg"],
    question: "Distinguish between guidance, counselling and psychotherapy.",
    plan: ["Define each", "Compare on key features in a table", "Note the overlap"],
    answer: `## Definitions
- Guidance is the process of helping people make informed choices, especially about education and careers, mainly by giving information and advice. It is often given to groups, such as a career talk for Class 10 students.
- Counselling is a professional relationship that helps people with developmental, emotional and situational problems, such as adjustment, relationships, study stress or grief, so that they can understand themselves and make their own decisions.
- Psychotherapy is a longer and deeper treatment of psychological disorders and long standing personality patterns, using systematic methods such as CBT or psychodynamic therapy.

## Comparison
| Feature | Guidance | Counselling | Psychotherapy |
| Main aim | Informed choice | Coping and personal growth | Treating disorder, deep change |
| Clients | Mostly well people needing information | Normal people facing problems | People with disorders |
| Method | Information, advice, tests | Relationship, listening, problem solving | Structured therapeutic techniques |
| Focus | Educational and career | Present and near future | Present and past, conscious and unconscious |
| Duration | One or a few contacts | Short to medium | Medium to long |
| Practitioner in India | Teacher, career guide, counsellor | Trained counsellor | Clinical psychologist or psychiatrist |
| Setting | Schools, colleges | Schools, colleges, NGOs, workplaces | Clinics and hospitals |

## Overlap
The boundaries are not sharp. A career guidance session may uncover anxiety that needs counselling, and a counsellor may meet a student with depression who needs psychotherapy and psychiatric care. Knowing when to refer is part of competence.`,
    keyPoints: ["Guidance as information and choice", "Counselling as helping relationship for everyday problems", "Psychotherapy as deeper treatment of disorder", "Comparison on aim, clients, method, duration", "Practitioners and settings in India", "Overlap and referral"],
    pitfalls: ["Saying they are completely separate", "No comparison points"],
    module: "therapies/2-6",
    visuals: [layers("Overlap", "rings", [["Guidance", "Information and advice for choices"], ["Counselling", "Helping relationship for life problems"], ["Psychotherapy", "Systematic treatment of disorder"]])],
    ref: "Gladding; Rao Counselling and Guidance; therapies module 2.6",
  },
  {
    id: "couns-l02-006",
    subject: S,
    topic: "counselling-outcome",
    marks: 20,
    difficulty: 4,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Does counselling work, and what makes it work? Critically discuss outcome research, the common factors debate and the use of routine outcome monitoring.",
    plan: ["Eysenck's challenge", "Meta-analysis and overall effect", "The dodo bird verdict and common factors", "Specific factors and the counter argument", "Routine outcome monitoring and feedback", "Conclusion for practice in India"],
    answer: `## Eysenck's challenge
In 1952 Hans Eysenck reviewed studies of psychotherapy with neurotic patients and claimed that about two thirds improved within two years whether or not they had therapy. The claim was methodologically weak, using poor comparison groups, but it forced the field to produce better evidence.

## Does it work?
In 1977 Mary Lee Smith and Gene Glass used the then new technique of meta-analysis to combine 375 controlled studies. The average treated client was better off than about 75 percent of untreated clients, an effect size of about 0.68. A larger analysis in 1980 found an effect of about 0.85. Since then, hundreds of meta-analyses have confirmed that counselling and psychotherapy produce moderate to large benefits for depression, anxiety and many other problems, comparable to or larger than many medical treatments. Important qualifications:
- About 5 to 10 percent of clients get worse during therapy.
- Many clients drop out early, often after one or two sessions.
- Benefits in routine services are often smaller than in trials.

## The dodo bird verdict
Saul Rosenzweig suggested in 1936 that different therapies may share common factors, and quoted the dodo bird in Alice in Wonderland: "Everybody has won, and all must have prizes." In 1975 Lester Luborsky and colleagues found that bona fide therapies compared head to head usually produced similar outcomes. Bruce Wampold's later meta-analyses support this for many conditions, finding small differences between bona fide treatments.

## The common factors
Factors shared by all therapies include:
- The working alliance, correlated with outcome at about 0.28.
- Empathy, about 0.28, and positive regard and genuineness.
- Expectations and hope: the client's belief that counselling will help.
- A credible rationale and a ritual that both parties believe in.
- Cultural adaptation: therapies adapted to the client's culture work better than unadapted ones.
- Counsellor effects: some counsellors consistently get better outcomes than others, accounting for around 5 percent of the variance in outcome.
Jerome Frank's contextual model argued that all healing, from therapy to traditional healers, works through a confiding relationship, a healing setting, a rationale and a ritual. Michael Lambert's often quoted pie chart, which credits 40 percent of change to client factors, 30 percent to the relationship and 15 percent each to hope and technique, was an estimate rather than a calculation and should not be quoted as data.

## The specific factors argument
Supporters of specific techniques argue that:
- Some treatments clearly outperform others for some disorders, such as exposure for OCD, phobias and PTSD, and family based treatment for adolescent anorexia.
- Dismantling studies show that some components matter more than others.
- Equal outcomes in averaged meta-analyses can hide differences for particular problems.
Most researchers now accept both: common factors explain much of the change, while specific methods add important benefit for particular disorders.

## Routine outcome monitoring
Routine outcome monitoring means measuring progress at every session and feeding the results back to the counsellor, and often the client. Examples include the Outcome Questionnaire 45 developed by Michael Lambert and the brief Outcome Rating Scale and Session Rating Scale developed by Scott Miller and Barry Duncan.
- Counsellors are poor at spotting clients who are deteriorating; feedback systems warn them.
- Meta-analyses find that feedback improves outcomes modestly overall and more clearly for clients who are not on track, and reduces deterioration and drop out.
- Feedback works best when counsellors actually discuss it with clients and adjust their approach.

## Implications for India
- With few trained professionals, task sharing models train lay counsellors to deliver brief structured therapies. The Healthy Activity Program, a behavioural activation treatment delivered by lay counsellors in Goa, improved depression outcomes in a randomised trial.
- Common factors such as hope and a culturally fitting rationale may matter even more where clients come with spiritual or somatic explanations.
- Brief outcome scales in local languages can help small services check that counselling is helping.

## Conclusion
Counselling works, with moderate to large effects on average. Much of its power lies in factors common to all good therapy, especially the alliance, empathy and hope, while specific techniques add value for particular problems. Measuring progress routinely is one of the simplest ways to make counselling work better.`,
    keyPoints: ["Eysenck's 1952 challenge", "Smith and Glass meta-analysis, effect about 0.68 to 0.85", "Deterioration and drop out", "Dodo bird verdict from Rosenzweig and Luborsky", "Common factors with figures for alliance and empathy", "Specific factors such as exposure for OCD", "Routine outcome monitoring and feedback benefits", "Indian task sharing example"],
    pitfalls: ["Quoting Lambert's percentages as research findings", "Presenting the dodo bird verdict as settled for all disorders", "No Indian application"],
    module: "therapies/1-1",
    visuals: [
      timeline("Put the outcome debate in order", [["Rosenzweig suggests common factors", "1936"], ["Eysenck claims therapy adds nothing", "1952"], ["Luborsky: everyone has won", "1975"], ["Smith and Glass first meta-analysis", "1977"], ["Routine outcome monitoring spreads", "2000s"]], "Each answer to Eysenck added a new kind of evidence."),
      compare("The specific factors argument", ["Common factors view", ["Bona fide therapies give similar outcomes", "Alliance, empathy and hope predict change", "Counsellor effects are real"], "The relationship and context do most of the work"], ["Specific factors view", ["Exposure beats other methods for OCD and phobias", "Dismantling studies find active parts", "Averages hide disorder differences"], "Techniques matter for particular problems"]),
    ],
    ref: "Eysenck 1952; Smith and Glass 1977; Smith, Glass and Miller 1980; Rosenzweig 1936; Luborsky, Singer and Luborsky 1975; Wampold and Imel The Great Psychotherapy Debate; Lambert 1992; Miller and Duncan ORS SRS; de Jong et al 2021 feedback meta-analysis; Patel et al 2017 HAP trial Goa",
  },
  {
    id: "couns-l02-007",
    subject: S,
    topic: "holland",
    marks: 15,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg", "mcp-entrance"],
    question: "Explain Holland's theory of vocational personalities and work environments. Describe the six types, the hexagon and the key concepts, and evaluate the theory's use in career counselling.",
    plan: ["Basic propositions", "The six RIASEC types", "The hexagon and concepts of congruence, consistency, differentiation and identity", "Use in counselling with an Indian example", "Evaluation"],
    answer: `## Basic propositions
John Holland proposed that career choice is an expression of personality. His theory rests on four ideas:
1. Most people can be described by their resemblance to six personality types.
2. Work environments can be described by the same six types, according to the people who work in them.
3. People search for environments that let them use their skills, express their values and take on agreeable roles.
4. Behaviour is determined by the interaction of personality and environment.

## The six types
| Type | Likes | Example occupations |
| Realistic | Working with tools, machines, plants, animals; practical | Mechanic, farmer, civil engineer |
| Investigative | Analysing, observing, solving problems | Scientist, doctor, research psychologist |
| Artistic | Creating, expressing, unstructured tasks | Musician, designer, writer |
| Social | Helping, teaching, caring | Teacher, counsellor, nurse |
| Enterprising | Persuading, leading, selling | Manager, lawyer, entrepreneur |
| Conventional | Organising data, following clear procedures | Accountant, bank clerk, data analyst |
A person is described by a three letter code of their strongest types, such as SIA for a counselling psychologist.

## The hexagon and key concepts
The types are arranged in a hexagon in the order R, I, A, S, E, C. Adjacent types are most similar and opposite types least similar.
- Congruence: the degree of fit between a person's type and the environment. A Social person in a Social job is congruent; a Social person doing data entry is not. Congruence is expected to predict satisfaction and stability.
- Consistency: how close the first two letters of a person's code are on the hexagon. RI is consistent; RS is not.
- Differentiation: how clearly one profile stands out. A flat profile suggests the person has not yet developed clear interests.
- Vocational identity: how clear and stable a person's goals, interests and talents are.

## Use in career counselling
- Interest inventories such as the Self Directed Search give the person's code, which is matched to occupations with similar codes.
- The counsellor uses the code as a starting point for exploration, not as a prescription.
- Consistency and differentiation guide how confident the counsellor can be: a consistent, well differentiated code points to a clear direction, while a flat or inconsistent profile suggests that the client needs more experience before choosing.
- The hexagon also helps when a client is unhappy at work, because the distance between their type and the job's type shows how much has to change.
- Example: a Class 12 student in Surat has been told to take engineering, but her code is ASE. The counsellor explores design, architecture, media and education careers, and discusses with her parents how her interests and family hopes can be balanced.

## Evaluation
Strengths:
- Simple, intuitive and easy to explain to students and parents.
- The hexagonal structure has been supported in many countries, though the shape is often more like an irregular circle.
- Generated the most widely used interest inventories in the world.
Criticisms:
- Congruence predicts job satisfaction only modestly, with correlations usually around 0.2 or less.
- It is a static matching model and says little about how interests develop or change over the life span.
- Gender differences in codes partly reflect socialisation; inventories can reinforce stereotypes if used carelessly.
- In India, choices are often shaped by family expectations, income, entrance examinations and seat availability more than by interests alone, so interest matching is only part of career counselling.
- Indian norms and occupational lists for imported inventories are limited.

## Conclusion
Holland's theory gives career counselling a clear language for describing people and jobs, and the hexagon remains its most useful tool. It works best as one part of a broader process that also considers abilities, values, development and context.`,
    keyPoints: ["Four basic propositions", "Six RIASEC types with examples", "Three letter code", "Hexagon with adjacent and opposite types", "Congruence, consistency, differentiation, identity defined", "Use with the Self Directed Search and an Indian example", "Modest congruence findings and contextual critique"],
    pitfalls: ["Getting the hexagon order wrong", "Treating the code as a prescription"],
    module: "therapies/2-6",
    visuals: [cycle("The hexagon and key concepts", [["Realistic", "Tools, machines, outdoors"], ["Investigative", "Analysing and solving"], ["Artistic", "Creating and expressing"], ["Social", "Helping and teaching"], ["Enterprising", "Leading and persuading"], ["Conventional", "Organising and procedures"]])],
    ref: "Holland 1959, 1997 Making Vocational Choices; Tranberg, Slane and Ekeberg 1993 congruence meta-analysis; Tracey and Rounds 1993",
  },
  {
    id: "couns-l02-008",
    subject: S,
    topic: "super",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Describe Donald Super's life span, life space theory of career development, including the life stages, the life career rainbow and the role of self concept. Evaluate its relevance to India.",
    plan: ["Career as development and the self concept", "The five life stages with tasks", "Mini cycles and recycling", "The life career rainbow: roles and theatres", "Career maturity and adaptability", "Evaluation in the Indian context"],
    answer: `## Career as development
Donald Super moved career theory from a one time match between person and job to a lifelong process. His central idea was that in choosing an occupation, a person implements a self concept. As the self concept develops with experience, career choices also change. Career development is therefore the process of developing and implementing a self concept in work roles.

## The life stages
| Stage | Approximate ages | Main tasks |
| Growth | Birth to 14 | Developing a self concept, curiosity, attitudes to work, fantasy and interests |
| Exploration | 15 to 24 | Crystallising, specifying and implementing a choice; trying out roles through study and first jobs |
| Establishment | 25 to 44 | Stabilising, consolidating and advancing in a chosen field |
| Maintenance | 45 to 64 | Holding on, keeping up to date, innovating |
| Disengagement | 65 and above | Decelerating, planning retirement, retirement living |
The ages are rough guides. Each stage has developmental tasks, and success at one prepares for the next.

## Mini cycles and recycling
Super added that people recycle through stages at transitions. A 40 year old who loses a job in a factory closure goes through a mini cycle of exploration and establishment again. This is increasingly common as careers become less stable.

## The life career rainbow
In 1980 Super drew the life career rainbow to show that work is only one of many life roles. The roles include child, student, leisurite, citizen, worker, spouse or partner, homemaker, parent and pensioner. They are played in four main theatres: the home, the community, the school and the workplace. The width of each band shows how much time and emotional involvement a role takes at a given age. Role salience, the importance of a role to the person, matters as much as the role itself. Later he described an archway model, with personal factors on one pillar, society on the other and the self at the keystone.

## Career maturity and adaptability
Career maturity is a person's readiness to cope with the developmental tasks of their stage, including planning, exploration, decision making and knowledge of the world of work. Because adult careers do not follow neat stages, Super and later Mark Savickas preferred the term career adaptability: concern for the future, control, curiosity and confidence.

## Use in counselling
- Counsellors assess the client's stage and readiness, rather than rushing to test and match.
- Students in exploration are helped to gather experience through internships and job shadowing.
- Mid career clients are helped to recycle and balance roles.

## Evaluation and India
Strengths:
- Broad and developmental, recognising that careers unfold over life.
- The rainbow helps clients see work in balance with family and community.
- It led to measures of career maturity and to Savickas' career construction theory.
Criticisms:
- Stages were based on middle class American men in stable jobs; women's careers, with breaks for childcare, and today's insecure jobs fit less neatly.
- The self concept idea is vague and hard to measure.
- In India the exploration stage is often compressed: stream choice at 15 and entrance examination coaching leave little room for trying out roles, and the decision is frequently a family one.
- Yet the rainbow fits Indian life well, because roles as son or daughter, spouse and parent are highly salient and often shape work choices, such as a woman returning to work after a career break.

## Conclusion
Super showed that career choice is a lifelong expression of the self within many life roles. His stages need adapting to modern and Indian realities, but his developmental view and the rainbow remain central to career counselling.`,
    keyPoints: ["Career as implementing a self concept", "Five stages with ages and tasks", "Mini cycles and recycling", "Life career rainbow with roles and theatres", "Role salience and the archway model", "Career maturity and adaptability", "Critique for women, modern work and India"],
    pitfalls: ["Giving stages without tasks", "Forgetting the rainbow", "No evaluation for Indian conditions"],
    module: "therapies/2-6",
    visuals: [
      timeline("Put Super's life stages in order", [["Growth", "birth to 14"], ["Exploration", "15 to 24"], ["Establishment", "25 to 44"], ["Maintenance", "45 to 64"], ["Disengagement", "65 and above"]], "People can recycle through stages at transitions."),
      layers("The life career rainbow", "rings", [["Self", "The self concept at the centre"], ["Child and student", "Early bands, home and school theatres"], ["Worker and citizen", "Workplace and community theatres"], ["Spouse, homemaker and parent", "Home theatre in adult years"], ["Leisurite and pensioner", "Bands that widen later in life"]]),
    ],
    ref: "Super 1953, 1957, 1980 life career rainbow, 1990 archway; Savickas career adaptability 1997, 2005",
  },
  {
    id: "couns-l02-009",
    subject: S,
    topic: "scct",
    marks: 10,
    difficulty: 4,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Explain social cognitive career theory. How do self efficacy, outcome expectations and contextual factors shape career interests and choices? Illustrate with an Indian example.",
    plan: ["Origin in Bandura's theory", "The three person variables", "The interest, choice and performance models", "Contextual supports and barriers", "Indian example and counselling uses"],
    answer: `## Origin
Social cognitive career theory was developed in 1994 by Robert Lent, Steven Brown and Gail Hackett. It applies Albert Bandura's social cognitive theory, especially self efficacy and triadic reciprocal causation, to career development. Earlier, Hackett and Nancy Betz had shown that women's lower self efficacy in mathematics helped explain their under representation in science and engineering.

## Three person variables
- Self efficacy: beliefs about one's ability to perform particular tasks, such as "I can learn to code". It develops from four sources: performance accomplishments, vicarious learning, social persuasion, and physiological and emotional states.
- Outcome expectations: beliefs about what will happen if one performs, such as "If I study computer science I will get a good job and respect".
- Personal goals: the intention to engage in an activity or reach an outcome, such as applying to a particular course.

## The models
1. Interest model: people become interested in activities in which they feel efficacious and expect good outcomes.
2. Choice model: interests lead to choice goals, then actions, then performance experiences, which feed back into self efficacy. Choices are also directly affected by context, so people sometimes choose fields that are not their first interest.
3. Performance model: ability, self efficacy and outcome expectations influence goals and the level of performance and persistence.
Later additions were a satisfaction model, linking self efficacy and goal progress to work satisfaction, and a career self management model, dealing with processes such as job search and handling transitions.

## Contextual supports and barriers
- Distal factors, such as gender norms, social class, caste, family income and quality of schooling, shape the learning experiences that build self efficacy.
- Proximal factors, close to the time of choice, such as family support, finances, availability of seats, coaching and discrimination, affect whether interests turn into choices.

## Indian example
A girl from a small town in Rajasthan enjoys science but has no female engineers in her family, and relatives say engineering is unsuitable for girls. Her self efficacy is low because she has few models and receives discouraging persuasion. A school programme that brings women engineers to speak, gives her coding projects she succeeds at, and helps her parents see job outcomes and scholarships strengthens all three person variables and adds proximal supports.

## Counselling uses
- Identify options the client has ruled out because of low self efficacy or inaccurate outcome expectations.
- Build self efficacy through graded success experiences, role models and encouragement.
- Problem solve barriers and strengthen supports.

## Evaluation
The theory is well supported: meta-analyses show self efficacy and outcome expectations predict interests and choice goals. It explains group differences without blaming individuals. It is weaker on emotion, chance events and the role of family decision making in collectivist settings.`,
    keyPoints: ["Lent, Brown and Hackett 1994 based on Bandura", "Self efficacy with its four sources", "Outcome expectations and goals", "Interest, choice and performance models", "Distal and proximal contextual factors", "Indian example with gender", "Counselling uses and evaluation"],
    pitfalls: ["Confusing self efficacy with self esteem", "Leaving out contextual barriers"],
    module: "therapies/2-6",
    visuals: [chain("The models", [["Learning experiences", "Shaped by gender, class and schooling"], ["Self efficacy and outcome expectations", "Can I? What will happen?"], ["Interests", "Liking what I feel good at"], ["Choice goals", "Filtered by supports and barriers"], ["Actions and performance", "Feed back into self efficacy"]])],
    ref: "Lent, Brown and Hackett 1994; Hackett and Betz 1981; Lent and Brown 2013 self management model; Sheu et al 2010 meta-analysis",
  },
  {
    id: "couns-l02-010",
    subject: S,
    topic: "gottfredson",
    marks: 10,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Describe Gottfredson's theory of circumscription and compromise. How does it explain gender and social class differences in career aspirations?",
    plan: ["Aim of the theory", "The cognitive map of occupations", "Four stages of circumscription", "Compromise", "Applications and evaluation"],
    answer: `## Aim
Linda Gottfredson asked in 1981 why children from different social classes and genders end up aspiring to such different occupations, often long before they know their own interests. Her answer was that children progressively rule out options, a process called circumscription, and later trade off what they want against what seems possible, called compromise.

## The cognitive map
Children build a cognitive map of occupations along two main dimensions: the sex type of a job (seen as masculine or feminine) and its prestige level. Each child then defines a zone of acceptable alternatives on this map, bounded by a tolerable sex type boundary, a tolerable level boundary (the lowest prestige acceptable to the family) and a tolerable effort boundary (the highest level that seems achievable).

## Four stages of circumscription
| Stage | Age | Orientation | What happens |
| 1 | 3 to 5 | Size and power | Child sees adult work as something big people do |
| 2 | 6 to 8 | Sex roles | Rules out jobs seen as wrong for one's gender |
| 3 | 9 to 13 | Social valuation | Rules out jobs below the family's class standard or seen as too hard |
| 4 | 14 and above | Internal, unique self | Explores interests and values within the remaining zone |
Gottfredson's key point is that options removed early are rarely reconsidered, because they are no longer seen as possibilities.

## Compromise
When accessible jobs do not match aspirations, people compromise. Gottfredson first proposed that they give up interests first, then prestige, and protect sex type most. In her later revision she said the order depends on how severe the compromise is: in minor compromises interests are protected, while in major ones sex type and prestige are protected.

## Explaining gender and class differences
- A boy may never consider nursing or early childhood teaching because they were ruled out as feminine at age seven.
- A girl may not consider mechanical engineering or driving a truck.
- A child from a family of daily wage workers may set a low effort boundary and never think of medicine; a child from a family of doctors may rule out all jobs below a certain status.
- In India, caste linked notions of suitable occupations and the prestige of government jobs add to these boundaries.

## Applications
Counsellors can help clients revisit options ruled out early, challenge stereotypes from primary school onwards and provide models who cross gender and class boundaries. Government campaigns encouraging girls in science fit this approach.

## Evaluation
The theory explains why stereotypes appear so early and why aspirations differ by background. Research supports early gender typing of occupations, but evidence for the exact order of compromise is mixed and the stages are not always clear cut.`,
    keyPoints: ["Circumscription and compromise defined", "Cognitive map of sex type and prestige", "Zone of acceptable alternatives with three boundaries", "Four stages with ages", "Order of compromise and its revision", "Gender, class and caste examples", "Counselling applications and evaluation"],
    pitfalls: ["Mixing up the order of stages", "Ignoring the revised view of compromise"],
    module: "therapies/2-6",
    visuals: [timeline("Put Gottfredson's stages of circumscription in order", [["Orientation to size and power", "3 to 5"], ["Orientation to sex roles", "6 to 8"], ["Orientation to social valuation", "9 to 13"], ["Orientation to the internal unique self", "14 and above"]], "Options ruled out early are rarely reconsidered.")],
    ref: "Gottfredson 1981 J Couns Psychol; Gottfredson 1996, 2005 revisions",
  },
]);
