import type { LongQA } from "@/lib/prep/long-types";
import type { PrepVisual } from "@/lib/prep/types";
import type { FigureData } from "@/lib/study/types";
import { anchored, chain, compare, layers, tree, vis } from "./visual";

const S = "counselling" as const;
const fig = (id: string, caption: string): PrepVisual => ({ kind: "figure", data: { id } satisfies FigureData, caption });

export const COUNSELLING_L03: LongQA[] = anchored([
  {
    id: "couns-l03-001",
    subject: S,
    topic: "career-counselling-india",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Describe the process of career counselling for a secondary school student in India. What assessments are used, and what special challenges does career counselling face in the Indian context?",
    plan: ["Why career counselling matters at Class 10 and 12", "Steps of the process", "Assessments: interests, aptitudes, personality, values", "Indian challenges", "How counsellors respond to them"],
    answer: `## Why it matters
In India the first major career decision usually comes at 15, when a student chooses a stream after Class 10, and the second after Class 12, when entrance examinations and college admissions decide much of what follows. These choices are often made under pressure, with little information, and largely by families. Career counselling aims to help the student make an informed, realistic choice that fits their abilities, interests and values, and that the family can support.

## Steps of the process
1. Building rapport and clarifying the request: who wants counselling, the student or the parents, and what decision is to be made.
2. Self exploration: interests, school performance, hobbies, values, health and the student's own dreams.
3. Assessment with standardised tools, explained to the student and parents in plain language.
4. Exploring the world of work: courses, colleges, entrance examinations, costs, scholarships, job prospects and new fields such as design, data science and allied health.
5. Decision making: weighing options against the student's profile and family circumstances, often using a simple grid of pros and cons.
6. Action planning: subjects to take, examinations to register for, internships, coaching decisions and a fall back plan.
7. Follow up: reviewing the choice after the first term, since many students wish to change.

## Assessments
- Interest inventories based on Holland's six types, giving a code to match with occupations.
- Aptitude batteries measuring verbal, numerical, abstract, mechanical, spatial and clerical abilities. Several Indian batteries exist with Indian norms.
- Personality measures, used carefully, for traits such as conscientiousness and sociability.
- Values and work preferences, such as security, income, creativity and service.
- School records and teacher observations, which are often as useful as tests.
Tests should be standardised, have Indian norms and be interpreted as information for discussion rather than verdicts.

## Indian challenges
- Family decision making: parents and relatives may decide the stream, often favouring medicine, engineering or government jobs for status and security.
- Gender norms: girls may be steered towards fields thought suitable or near home, and boys away from fields seen as feminine.
- Social class and caste: cost of coaching and colleges, first generation learners and limited networks restrict real choice.
- Rural and urban gaps: rural students have less information and fewer counsellors.
- The entrance examination system: lakhs of students compete for a small number of seats, and coaching culture, as in Kota, adds stress.
- Shortage of trained counsellors: many schools have none, and career advice often comes from coaching institutes with commercial interests.
- Rapid change in the job market, which makes parents' knowledge out of date.

## Responding to the challenges
- Include parents early, respecting their concerns while presenting evidence about the student.
- Widen the list of options with accurate information about less known courses and vocational routes.
- Plan a fall back option to reduce the all or nothing pressure of a single examination.
- Use group guidance sessions and digital resources to reach more students; the government's National Career Service portal lists jobs and courses.
- Policy is changing: NEP 2020 allows more flexible subject combinations, and in 2026 the CBSE amended its affiliation rules to require counselling and wellness teachers in secondary and senior secondary schools.

## Conclusion
Career counselling in India must combine sound assessment and good information with sensitivity to family, gender, class and examination pressures. A good counsellor helps the student and family reach a choice that is realistic, informed and owned by the student.`,
    keyPoints: ["Decision points after Class 10 and 12", "Seven steps from rapport to follow up", "Interest, aptitude, personality and values assessment with Indian norms", "Family, gender, class, rural and examination pressures", "Shortage of counsellors and commercial advice", "Involving parents and fall back plans", "Recent policy: NEP 2020 and CBSE counsellor rule"],
    pitfalls: ["Describing only testing", "No Indian challenges", "Ignoring parents' role"],
    module: "therapies/2-6",
    visuals: [
      chain("Steps of the process", [["Clarify the request", "Whose decision, what choice"], ["Self exploration", "Interests, marks, values, dreams"], ["Assessment", "Interests, aptitudes, personality"], ["World of work", "Courses, exams, costs, prospects"], ["Decide", "Weigh options with family"], ["Plan and follow up", "Steps, fall back, review"]]),
      vis("decide", { scene: "Parents insist their daughter take PCB for medicine. Her marks in biology are average, her aptitude profile is strongest in spatial and verbal reasoning, and her interest code is AES.", ask: "What should the counsellor do?", choices: [{ label: "Tell the parents they are wrong and she must take arts.", verdict: "harm", outcome: "Parents stop the sessions.", why: "Confrontation without respect loses the family." }, { label: "Share the results with student and parents together, explore her wishes and their concerns, and present options such as architecture, design and law alongside medicine, with a fall back plan.", verdict: "best", outcome: "The family agrees to explore two options and visit colleges.", why: "Information plus respect for family decision making." }, { label: "Go along with PCB to keep the parents happy.", verdict: "ok", outcome: "Short term peace, but the student feels unheard.", why: "Avoids conflict but ignores the evidence and her voice." }] }, "Indian challenges"),
    ],
    ref: "NCERT guidance resources; National Career Service portal 2015; NEP 2020; CBSE affiliation bye-law amendment January 2026 (counselling and wellness teacher, about 1 per 500 students, Classes 9 to 12, per Careers360 report)",
  },
  {
    id: "couns-l03-002",
    subject: S,
    topic: "parsons",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "cuet-pg", "ugc-net"],
    question: "Write a short note on Frank Parsons and the trait and factor approach to career guidance.",
    plan: ["Parsons and the Vocation Bureau", "His three factors", "Trait and factor approach after him", "Evaluation"],
    answer: `## Parsons
Frank Parsons, an American social reformer, opened the Vocation Bureau in Boston in 1908 to help young people find suitable work. His book, published in 1909 after his death, is often taken as the start of vocational guidance, and Parsons is called the father of vocational guidance.

## Three factors
Parsons said that a wise choice of vocation requires:
1. A clear understanding of oneself: aptitudes, abilities, interests, ambitions, resources and limitations.
2. Knowledge of the requirements, conditions of success, advantages, disadvantages, pay, opportunities and prospects of different lines of work.
3. True reasoning on the relation between these two groups of facts.

## The trait and factor approach
Later psychologists, especially Edmund Williamson at the University of Minnesota, built on this with psychological tests. Traits of the person, measured by aptitude, interest and personality tests, are matched with factors, the requirements of jobs. The counsellor acts as an expert who analyses data, diagnoses the problem and advises. Holland's theory is a modern descendant of this matching idea.

## Evaluation
- Strengths: simple, practical and still the core of much career guidance; it led to aptitude and interest testing.
- Limitations: it treats choice as a single event rather than a lifelong process; it is counsellor directed; it assumes stable traits and a stable job market; and it pays little attention to emotions, family and social barriers.`,
    keyPoints: ["Vocation Bureau Boston 1908, book 1909", "Father of vocational guidance", "Three factors: self, world of work, true reasoning", "Williamson and test based matching", "Link to Holland", "Limitations: single event, directive, static"],
    pitfalls: ["Missing the third factor of true reasoning", "No evaluation"],
    module: "therapies/2-6",
    visuals: [chain("Three factors", [["Know yourself", "Aptitudes, interests, limits"], ["Know the work", "Requirements and prospects"], ["True reasoning", "Match the two"]])],
    ref: "Parsons 1909 Choosing a Vocation; Williamson 1939 How to Counsel Students",
  },
  {
    id: "couns-l03-003",
    subject: S,
    topic: "school-counselling",
    marks: 15,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg", "mcp-entrance"],
    question: "Discuss the role and functions of a school counsellor in India. Describe a tiered model of school mental health services and the policy framework that supports it.",
    plan: ["Need for school counselling in India", "Functions of the school counsellor", "Tiered support: universal, targeted, intensive", "Policy and guidelines", "Challenges and good practice"],
    answer: `## The need
Children and adolescents make up a large share of India's population, and school is where most of them can be reached. Common concerns include academic stress, examination anxiety, learning disabilities, bullying, family conflict, substance use, online risks, sexual abuse, and depression and self harm in adolescents. Student suicides are a growing worry: national crime records data show more than 13,000 students died by suicide in 2023. Most of these young people never see a mental health professional.

## Functions of the school counsellor
- Individual counselling for emotional, social and academic problems.
- Group counselling and guidance, such as study skills, life skills and peer relations.
- Career guidance and stream selection.
- Screening and early identification, for example of learning disabilities or depression, and referral to psychologists, psychiatrists or paediatricians.
- Crisis response after a suicide, death, accident or abuse disclosure.
- Consultation with teachers about classroom behaviour and with parents about home issues.
- Teacher training in recognising warning signs and in positive discipline.
- Child protection: knowing and following the reporting duties under the POCSO Act.
- Developing school policies on bullying, inclusion and mental health.

## A tiered model
Many systems organise school mental health in three tiers, based on public health ideas:
| Tier | Who | Examples |
| Universal | All students | Life skills lessons, social and emotional learning, anti bullying policy, wellbeing activities, examination preparation talks |
| Targeted | Students at risk | Small groups for anxiety or grief, mentoring, study support, monitoring after a crisis |
| Intensive | Students with significant problems | Individual counselling, family work, referral to specialist services, safety planning |
Universal programmes reach the most children at low cost; targeted and intensive tiers focus scarce counsellor time where it is most needed. Students move between tiers as their needs change: a child who joins a grief group after a parent's death may need individual counselling for a few months and then return to universal support. Screening, teacher referral and self referral are the routes by which students reach the higher tiers, so all three must be easy to use and known to everyone in the school.

## Policy framework in India
- Education commissions as far back as the 1950s and 1960s recommended guidance services in secondary schools.
- The Ministry of Education's Manodarpan initiative, launched in 2020, provides psychosocial support for students, teachers and families.
- The UMMEED guidelines of 2023 give schools a framework for suicide prevention.
- NEP 2020 emphasises socio emotional learning and the use of counsellors and social workers.
- In July 2025 the Supreme Court, in Sukdeb Saha versus State of Andhra Pradesh, issued binding guidelines for educational institutions and coaching centres, including a mental health policy, a trained counsellor where there are more than 100 students, staff training and display of helplines such as Tele MANAS.
- In 2026 the CBSE amended its affiliation rules to require counselling and wellness teachers for secondary classes.

## Challenges and good practice
- Too few counsellors for too many students, and counsellors given teaching or clerical duties.
- Stigma among parents and students, and fear that confidentiality will not be kept.
- Pressure from management to share information or to focus only on marks.
- Good practice includes a clear confidentiality policy explained to students and parents, a referral network, regular teacher training, and evaluating programmes rather than running one off talks.

## Conclusion
The school counsellor is a counsellor, educator, consultant and child protector. A tiered model, backed by the recent policies and court guidelines, lets one counsellor serve a whole school while giving more help to those who need it most.`,
    keyPoints: ["Need with Indian data on student suicides", "Functions: individual, group, career, screening, crisis, consultation, child protection", "Three tier model with examples", "Manodarpan and UMMEED", "Supreme Court 2025 guidelines", "CBSE 2026 counsellor rule", "Challenges and good practice"],
    pitfalls: ["Only listing counselling as a function", "Missing child protection duties", "No policy framework"],
    module: "therapies/2-6",
    visuals: [layers("A tiered model", "pyramid", [["Intensive", "Individual counselling, family work, referral, safety plans"], ["Targeted", "Small groups and monitoring for students at risk"], ["Universal", "Life skills, social and emotional learning, anti bullying for all"]])],
    ref: "NCRB ADSI 2023 student suicides over 13,000; Manodarpan 2020; UMMEED draft guidelines 2023; NEP 2020; Sukdeb Saha v State of AP 2025 INSC 893; CBSE affiliation amendment 2026",
  },
  {
    id: "couns-l03-004",
    subject: S,
    topic: "exam-stress",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg", "ugc-net"],
    question: "How would you counsel a Class 12 student with severe examination stress? Explain the causes of examination stress and the counselling strategies you would use.",
    plan: ["What examination stress is and the arousal curve", "Causes at the student, family and system level", "Assessment including risk", "Counselling strategies", "Working with parents"],
    answer: `## Examination stress
Some anxiety before an examination is normal and helpful. The Yerkes Dodson principle describes an inverted U: performance improves as arousal rises up to a point, and then falls as arousal becomes too high, especially on complex tasks. Severe examination stress pushes the student past the peak, causing poor sleep, blanking out, avoidance of study and physical complaints.

## Causes
- Student factors: perfectionism, low self efficacy, poor study habits, procrastination, catastrophic thinking such as "If I fail, my life is over".
- Family factors: high expectations, comparison with cousins, financial sacrifice for coaching, conflict at home.
- School and system factors: the high stakes of board examinations and entrance tests, ranking, long coaching hours and social media comparison.

## Assessment
1. Listen to the student's story and how stress shows in thoughts, feelings, body and behaviour.
2. Check sleep, appetite, concentration and mood; distinguish exam stress from depression or an anxiety disorder.
3. Ask directly about hopelessness and thoughts of suicide, since exam periods are a known time of risk.
4. Understand family expectations and supports.

## Counselling strategies
- Psychoeducation: explain the stress response and the inverted U, so the student sees that the aim is moderate arousal, not zero anxiety.
- Cognitive work: identify and challenge catastrophic thoughts; replace "I must get 95 percent" with "I will do my best and there are several routes ahead".
- Study skills: a realistic timetable, short study blocks with breaks, active recall and practice papers instead of rereading.
- Relaxation: slow breathing, progressive muscle relaxation and brief mindfulness, practised daily and used before the paper.
- Lifestyle: regular sleep, meals and some physical activity; limiting late night phone use.
- Examination day plan: what to do on blanking out, such as breathing and starting with a known question.
- Problem solving and a plan B, such as other colleges or the next attempt, which lowers the all or nothing feeling.

## Working with parents
Parents are helped to replace comparison and pressure with support, to listen without lecturing and to reassure the child that their love does not depend on marks. The CBSE provides a tele counselling service during board examinations, and the national Tele MANAS helpline, 14416, can be shared.

## Conclusion
Counselling for examination stress combines psychoeducation, cognitive and study skills, relaxation and family support, with careful attention to risk.`,
    keyPoints: ["Yerkes Dodson inverted U", "Student, family and system causes", "Assessment of mood and suicide risk", "Psychoeducation and cognitive restructuring", "Study skills and relaxation", "Plan B to reduce all or nothing pressure", "Working with parents and helplines"],
    pitfalls: ["Aiming to remove all anxiety", "Forgetting risk assessment", "Ignoring parents"],
    module: "therapies/2-6",
    visuals: [fig("yerkes-dodson", "Examination stress: performance rises with arousal up to a point, then falls")],
    ref: "Yerkes and Dodson 1908; CBSE psychosocial counselling during board exams; Tele MANAS 14416",
  },
  {
    id: "couns-l03-005",
    subject: S,
    topic: "bullying",
    marks: 10,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Define bullying and cyberbullying. Discuss their effects on children and the evidence on school based prevention programmes. What can a counsellor do in an Indian school or college?",
    plan: ["Definition with Olweus' three criteria", "Forms including cyberbullying and ragging", "Effects on victims, bullies and bystanders", "Prevention programmes and evidence", "Counsellor's role in India"],
    answer: `## Definition
Dan Olweus, the Norwegian researcher who pioneered the field, defined bullying as aggressive behaviour that is intentional, repeated over time and occurs in a relationship with an imbalance of power. A single fight between equals is not bullying.

## Forms
- Physical: hitting, pushing, damaging belongings.
- Verbal: name calling, insults about caste, skin colour, weight, region or disability.
- Relational: exclusion, spreading rumours.
- Cyberbullying: harassment through messages, social media or gaming, including sharing embarrassing photos. It can follow the child home, be anonymous and reach a large audience.
- Ragging in colleges, which the UGC regulations of 2009 prohibit, with a national anti ragging helpline.

## Effects
- Victims: anxiety, depression, loneliness, school refusal, falling marks, physical complaints and, in some cases, self harm and suicidal thoughts.
- Bullies: higher later risk of antisocial behaviour and substance use.
- Bully victims, who both bully and are bullied, have the worst mental health outcomes.
- Bystanders: distress and a school climate of fear.

## Prevention and evidence
- The Olweus Bullying Prevention Programme, begun in Norway in the 1980s after the suicides of three boys, works at school, class and individual levels: a coordinating committee, clear rules, supervision of hotspots, class meetings and talks with bullies, victims and parents.
- KiVa, developed in Finland, focuses on bystanders and includes online games and lessons.
- A large meta-analysis by Maria Ttofi and David Farrington found that whole school programmes reduce bullying by about 20 percent and victimisation by about 17 to 20 percent on average, with better results for intensive programmes that include parent meetings and playground supervision.
- Simply bringing bully and victim together for mediation is not recommended, because of the power imbalance.

## The counsellor's role in India
1. Help the school adopt a written anti bullying and anti ragging policy, with a reporting system students trust.
2. Train teachers to notice and respond, including to caste based and gender based bullying.
3. Run classroom sessions on empathy, bystander action and safe internet use.
4. Support victims with counselling and safety plans; assess for depression and suicide risk.
5. Work with bullies to understand the behaviour, set consequences and build skills.
6. Involve parents, and know when the law applies: serious online harassment may be a crime under the IT Act and the criminal code, and sexual harassment of children falls under the POCSO Act.

## Conclusion
Bullying is repeated, intentional aggression with a power imbalance. Whole school programmes reduce it by about a fifth, and counsellors can lead such programmes while caring for those affected.`,
    keyPoints: ["Olweus' three criteria", "Physical, verbal, relational and cyber forms; ragging", "Effects on victims, bullies, bully victims and bystanders", "Olweus programme and KiVa", "Ttofi and Farrington: about 20 percent reduction", "Avoid mediation between bully and victim", "Indian counsellor role and legal links"],
    pitfalls: ["Calling any conflict bullying", "No evidence on programmes"],
    module: "therapies/2-6",
    visuals: [layers("Prevention and evidence", "stack", [["School level", "Policy, committee, supervision of hotspots"], ["Class level", "Rules, class meetings, bystander lessons"], ["Individual level", "Talks with bullies, victims and parents"]])],
    ref: "Olweus 1993; Salmivalli KiVa; Ttofi and Farrington 2011 meta-analysis; UGC Regulations on Curbing the Menace of Ragging 2009",
  },
  {
    id: "couns-l03-006",
    subject: S,
    topic: "life-skills",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "cuet-pg"],
    question: "What are life skills? List the core life skills identified by the WHO and explain their use in school counselling.",
    plan: ["Definition", "The ten core skills in pairs", "Use in schools in India"],
    answer: `## Definition
The World Health Organization defines life skills as abilities for adaptive and positive behaviour that enable individuals to deal effectively with the demands and challenges of everyday life. Life skills education teaches them through active methods rather than lectures.

## The ten core life skills
The WHO identified ten, often taught in pairs:
| Pair | Skills |
| Thinking | Decision making and problem solving |
| Thinking | Creative thinking and critical thinking |
| Social | Effective communication and interpersonal relationship skills |
| Personal | Self awareness and empathy |
| Emotional | Coping with emotions and coping with stress |

## Use in school counselling
- Life skills lessons are a universal, preventive tier of school mental health: they reach every student, not only those referred.
- Methods include role plays, group discussion, case stories, games and reflection, adapted to age.
- Topics include resisting peer pressure, handling examination stress, managing anger, safe relationships, online safety and saying no to substances.
- In India, life skills form part of adolescence education programmes and school health and wellness curricula, and teachers are trained to deliver them.
- Evaluations suggest life skills programmes can improve knowledge, attitudes and some behaviours, though effects depend on quality, length and teacher training.`,
    keyPoints: ["WHO definition", "All ten core skills", "Grouping into thinking, social, personal and emotional", "Universal prevention role", "Active teaching methods", "Indian school programmes"],
    pitfalls: ["Listing fewer than ten skills", "Describing life skills as vocational skills"],
    module: "therapies/2-6",
    visuals: [vis("sort", { prompt: "Sort each WHO life skill into its group", buckets: ["Thinking", "Social", "Personal and emotional"], items: [{ text: "Decision making", bucket: 0 }, { text: "Critical thinking", bucket: 0 }, { text: "Interpersonal relationship skills", bucket: 1 }, { text: "Effective communication", bucket: 1 }, { text: "Empathy", bucket: 2 }, { text: "Coping with stress", bucket: 2 }] }, "The ten core life skills")],
    ref: "WHO 1997 Life Skills Education in Schools; School Health Programme under Ayushman Bharat",
  },
  {
    id: "couns-l03-007",
    subject: S,
    topic: "confidentiality-minors",
    marks: 10,
    difficulty: 4,
    exams: ["ma-semester", "mcp-entrance", "ugc-net"],
    question: "A 14 year old student tells the school counsellor she is being sexually abused by a relative and begs the counsellor not to tell anyone. Discuss the ethical and legal issues, and describe what the counsellor should do.",
    plan: ["Confidentiality with minors and its limits", "The POCSO Act reporting duty", "Immediate response to the disclosure", "Steps after the disclosure", "Ongoing support and dilemmas"],
    answer: `## Confidentiality with minors
Confidentiality is central to counselling, but it is never absolute, and with minors it is more limited. Parents usually have a right to some information, and the duty to protect a child from serious harm overrides confidentiality. A good school counsellor explains these limits to every student at the start: "What you tell me stays between us, unless I think you or someone else is in danger."

## The legal duty
The Protection of Children from Sexual Offences Act 2012 defines a child as anyone below 18.
- Section 19 requires any person who knows, or even apprehends, that a sexual offence against a child has been or is likely to be committed, to report it to the Special Juvenile Police Unit or the local police.
- Section 21 makes failure to report punishable with imprisonment of up to six months, or a fine, or both. A person in charge of an institution who fails to report an offence by a subordinate can be imprisoned for up to one year.
- A person who reports in good faith is protected from civil and criminal liability.
- Section 23 forbids disclosing the child's identity in the media.
So the counsellor cannot promise secrecy, and must report.

## Immediate response to the disclosure
1. Stay calm, listen and believe the child. Thank her for telling.
2. Do not promise to keep it secret; explain honestly and gently that you must tell people whose job is to keep her safe, and that you will be with her.
3. Do not interrogate or ask leading questions; the investigation is the job of the police and the court. Let her tell what she wants.
4. Reassure her that it is not her fault.
5. Note down her words exactly, with the date and time, soon afterwards.
6. Assess immediate safety: is the relative in her home, is she going back there today?

## Steps after the disclosure
- Inform the school head as per the school's child protection policy, and make the report to the police or the Special Juvenile Police Unit. The Childline service can help.
- If the alleged abuser is a family member, consider carefully how and when parents are told, so that the child is not put at greater risk or pressured to retract.
- The police inform the Child Welfare Committee, which can arrange care and protection, and the child will be medically examined and her statement recorded in a child friendly way.
- Maintain confidentiality towards everyone else in school.

## Ongoing support and dilemmas
- Provide continued counselling for fear, guilt, shame and possible symptoms of trauma, and refer to a child psychologist or psychiatrist if needed.
- Support her through legal procedures; the Act provides for a support person.
- Dilemmas include losing the child's trust, family pressure to withdraw the complaint and the risk of retaliation. Explaining limits of confidentiality in advance and staying with the child through the process reduce these harms.
- Similar reporting duties apply even in consensual relationships between adolescents, which creates further ethical tension that the counsellor should discuss with supervisors and legal advisers.

## Conclusion
The child's safety and the law override confidentiality. The counsellor listens, believes, does not investigate, reports as POCSO requires and continues to support the child, honestly explaining each step.`,
    keyPoints: ["Limits of confidentiality with minors explained in advance", "POCSO definition of child under 18", "Section 19 duty to report, including apprehension", "Section 21 penalties: six months or fine; one year for person in charge", "Good faith protection", "Do not promise secrecy, do not interrogate, record exact words", "Ongoing counselling and support through the process"],
    pitfalls: ["Promising to keep the secret", "Questioning the child in detail", "Informing an alleged abuser before ensuring safety"],
    module: "ethics-law/3-1",
    visuals: [
      chain("Immediate response to the disclosure", [["Listen and believe", "Thank her, stay calm"], ["No false promise", "Explain who must be told"], ["Do not investigate", "No leading questions"], ["Record exact words", "Date and time"], ["Check safety", "Is she going home to danger?"], ["Report", "Head, then SJPU or police"]]),
      vis("decide", { scene: "Right after the disclosure, the girl cries: please, promise you will not tell anyone.", ask: "What should the counsellor say?", choices: [{ label: "I promise. This stays between us.", verdict: "harm", outcome: "The counsellor must later break the promise, and the child loses trust in adults.", why: "Secrecy cannot be promised and the law requires a report." }, { label: "I am really glad you told me, and it is not your fault. I cannot keep this secret, because I need to keep you safe, but I will tell only the people who can help and I will be with you.", verdict: "best", outcome: "She is frightened but stays and agrees to talk to the head with the counsellor.", why: "Honest, warm and protective." }, { label: "Are you sure? Tell me exactly what he did, step by step.", verdict: "harm", outcome: "She feels disbelieved and her later evidence may be affected.", why: "Investigation is for the police; leading questions can harm the case." }] }, "The legal duty"),
    ],
    ref: "POCSO Act 2012 ss 2(1)(d), 19, 21, 23, 39; ethics-law module 3.1",
  },
  {
    id: "couns-l03-008",
    subject: S,
    topic: "crisis-intervention",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "What is a psychological crisis? Describe Roberts' seven stage model of crisis intervention with an example, and compare crisis intervention with ordinary counselling.",
    plan: ["Crisis defined, with Caplan's theory", "Types of crisis", "Roberts' seven stages", "Worked example", "Crisis intervention versus counselling"],
    answer: `## What a crisis is
Gerald Caplan, a pioneer of community psychiatry, described a crisis as a temporary state of upset and disorganisation that occurs when a person faces an obstacle to important life goals that cannot be overcome with their usual methods of coping. Key features:
- It is triggered by an event, but the crisis lies in the person's perception and failed coping, not in the event itself.
- It is time limited; Caplan thought most crises resolve, for better or worse, within about four to six weeks.
- It is a turning point: a person may return to the previous level of functioning, grow stronger, or be left more vulnerable.
- During a crisis people are more open to help, so brief, timely intervention can have a large effect.

## Types of crisis
- Developmental: expected transitions such as leaving home, marriage, birth of a child or retirement.
- Situational: sudden events such as an accident, assault, job loss, sudden death or a failed examination.
- Existential: inner conflicts about purpose and meaning.
- Ecosystemic or environmental: disasters such as floods, earthquakes or pandemics affecting whole communities.

## Roberts' seven stage model
Albert Roberts proposed a structured model that is widely used in helplines, emergency rooms and community services.
1. Plan and conduct a thorough assessment, including lethality: risk of suicide, harm to others, medical danger and immediate safety needs.
2. Make psychological contact and rapidly establish rapport, through respect, acceptance and a calm, non judgemental approach.
3. Identify the major problems, including the precipitating event: "What happened that made today different?"
4. Deal with feelings and emotions: active listening, validation and allowing the person to express fear, anger or grief.
5. Generate and explore alternatives: past coping that worked, supports and options not yet seen.
6. Implement an action plan: concrete, achievable steps that restore some control.
7. Follow up: a planned call or meeting to check progress and arrange further help.
The stages often overlap; safety comes first throughout.

## Example
A 19 year old engineering student calls a helpline at night after learning he has failed several subjects, saying his father will be ashamed and "there is no point".
1. The counsellor asks directly about suicidal thoughts, plan and means; he has thought of jumping but has no definite plan and is in his hostel room with a roommate nearby.
2. Calm, warm contact; the counsellor uses his name and slows the pace.
3. The precipitant is the result, compounded by fear of his father and debt for fees.
4. He expresses shame and anger; the counsellor validates these.
5. Alternatives: supplementary examinations, talking to a trusted uncle first, the college counsellor.
6. Plan: wake his roommate and stay together tonight, call the uncle in the morning, see the college counsellor tomorrow, and call Tele MANAS if the urges increase.
7. A follow up call is arranged for the next evening.

## Crisis intervention versus counselling
| Feature | Crisis intervention | Ordinary counselling |
| Timing | Immediate, often unscheduled | Planned appointments |
| Duration | Brief, a few contacts | Weeks to months |
| Goal | Safety and restoring previous functioning | Growth, insight, lasting change |
| Counsellor stance | Active and directive when needed | Often more non directive |
| Focus | The here and now, the precipitant | Wider history and patterns |
| Assessment | Lethality first | Broad assessment |

## Conclusion
A crisis is a time limited breakdown of coping that is both dangerous and an opportunity. Roberts' model gives a clear sequence from lethality assessment to follow up, and differs from routine counselling in its urgency, directiveness and narrow focus on safety and stabilisation.`,
    keyPoints: ["Caplan's definition: perception and failed coping", "Time limited, turning point, openness to help", "Developmental, situational, existential and environmental crises", "All seven Roberts stages in order", "Lethality assessment first", "Worked helpline example", "Comparison table with counselling"],
    pitfalls: ["Treating the event itself as the crisis", "Forgetting follow up", "Skipping risk assessment"],
    module: "suicide",
    visuals: [
      chain("Roberts' seven stage model", [["Assess lethality", "Safety and danger first"], ["Make contact", "Rapid rapport"], ["Identify problems", "What happened today?"], ["Deal with feelings", "Listen and validate"], ["Explore alternatives", "Past coping, supports"], ["Action plan", "Concrete steps"], ["Follow up", "Planned check in"]]),
      compare("Crisis intervention versus counselling", ["Crisis intervention", ["Immediate and brief", "Safety and stabilisation", "Active, sometimes directive", "Focus on the precipitant"], "Restore functioning now"], ["Ordinary counselling", ["Planned and longer", "Growth and lasting change", "Often non directive", "Wider history and patterns"], "Understand and change over time"]),
    ],
    ref: "Caplan 1964 Principles of Preventive Psychiatry; Roberts Crisis Intervention Handbook; James and Gilliland Crisis Intervention Strategies",
  },
  {
    id: "couns-l03-009",
    subject: S,
    topic: "lethality",
    marks: 10,
    difficulty: 4,
    exams: ["ma-semester", "mcp-entrance", "md-psychiatry"],
    question: "How should a counsellor assess suicide risk? Discuss risk and protective factors, how to ask about suicide, assessing lethality, and the limits of risk prediction.",
    plan: ["Why every counsellor must assess", "Risk and protective factors with Indian context", "How to ask", "Lethality and intent", "Limits of prediction and what to do instead"],
    answer: `## Why it matters
Suicide is a leading cause of death among young people in India. National crime records data recorded over 1.7 lakh suicides in 2023, a rate of about 12.3 per 100,000, and official figures are thought to undercount. Every counsellor will meet clients at risk and must be able to ask and respond.

## Risk factors
- Previous suicide attempt, the strongest single predictor.
- Mental disorders, especially depression, bipolar disorder, psychosis, substance use and personality disorders.
- Hopelessness.
- Recent losses and humiliations: examination failure, relationship break up, job loss, debt, family conflict.
- Access to lethal means: pesticides in rural India, medicines at home, heights, hanging points.
- Chronic physical illness and pain.
- Social isolation, domestic violence, discrimination.
- Family history of suicide, and exposure to suicide in friends or media.
- Alcohol use, which also increases impulsivity in the moment.

## Protective factors
Strong family and social bonds, responsibility for children, religious and cultural beliefs against suicide, reasons for living, problem solving skills, engagement with care, and restricted access to means.

## How to ask
Asking about suicide does not put the idea into a person's head; reviews show it may reduce distress. Ask directly, calmly and privately, moving from general to specific:
1. "Sometimes when people feel this low, they feel life is not worth living. Have you felt like that?"
2. "Have you had thoughts of ending your life?"
3. "Have you thought about how you would do it?"
4. "Have you done anything to prepare, or tried before?"
5. "What has stopped you so far?"
Use the local words the client uses, and avoid judgement.

## Lethality and intent
The counsellor assesses:
- Plan: how specific and detailed.
- Means: is the method available, and how lethal is it.
- Preparation: buying pesticide, writing notes, giving things away.
- Timing: is there a date.
- Intent: how much the person wants to die, and their expectation of the outcome.
- Rescue: would anyone find them.
- Past attempts and their lethality.
A specific plan with available, lethal means, preparation and strong intent indicates high immediate risk, requiring urgent psychiatric referral, not leaving the person alone and involving family with consent where possible.

## Limits of prediction
Suicide is rare and risk factors are common, so scales and checklists such as SAD PERSONS predict poorly and are not recommended to classify people as low or high risk. Current guidance is to:
- Use the assessment to understand the person and plan care, not to predict.
- Develop a collaborative safety plan, restrict access to means and arrange follow up.
- Avoid no suicide contracts, which do not prevent suicide.
- Document the assessment and plan.

## Conclusion
Suicide risk assessment is a careful, compassionate conversation about risk and protective factors, plan, means and intent, used to build a safety plan rather than to make a prediction.`,
    keyPoints: ["Indian suicide data with year", "Previous attempt as strongest risk factor", "Means such as pesticides", "Protective factors", "Asking directly does not increase risk", "Plan, means, preparation, intent, rescue", "Risk scales predict poorly; plan care, no contracts"],
    pitfalls: ["Avoiding the direct question", "Relying on a risk scale score", "Recommending a no suicide contract"],
    module: "suicide",
    visuals: [vis("build", { vignette: "A 22 year old farmer's son failed his recruitment examination twice, says he is a burden, has a bottle of pesticide in the shed, has thought of drinking it this weekend and has stopped talking to friends.", rule: "Several lethality markers together point to high immediate risk.", symptoms: [{ label: "Specific plan", present: true }, { label: "Lethal means available", present: true }, { label: "Timing chosen", present: true }, { label: "Hopelessness and burden", present: true }, { label: "Previous attempt", present: false }], need: 3, needCore: false, verdict: "High immediate risk: do not leave him alone, remove access to the pesticide with family, and arrange same day psychiatric assessment." }, "Lethality and intent")],
    ref: "NCRB ADSI 2023: 171,418 suicides, rate 12.3; Dazzi et al 2014 asking about suicide; NICE self harm guideline 2022 on risk tools; Stanley and Brown safety planning",
  },
  {
    id: "couns-l03-010",
    subject: S,
    topic: "safety-planning",
    marks: 10,
    difficulty: 3,
    exams: ["ma-semester", "mcp-entrance", "md-psychiatry"],
    question: "Describe the Stanley and Brown safety planning intervention for suicidal clients. Explain each step with examples and summarise the evidence for it.",
    plan: ["What a safety plan is and why it replaced contracts", "The six steps with examples", "How to make it collaborative", "Evidence", "Adaptation in India"],
    answer: `## What a safety plan is
A safety plan is a short, written, personalised list of coping strategies and sources of support that a person can use, in order, when suicidal thoughts rise. Barbara Stanley and Gregory Brown developed it as a brief intervention that can be completed in about 20 to 45 minutes, for example in an emergency department or a first counselling session. It replaced no suicide contracts, which ask the client to promise not to die and have no evidence of benefit.

## The six steps
1. Warning signs: thoughts, moods, situations or behaviours that signal a crisis is starting. Example: "Lying awake after midnight thinking I have ruined everything."
2. Internal coping strategies: things the person can do alone to distract or calm themselves. Example: walking on the terrace, listening to devotional songs, a breathing exercise.
3. People and social settings that provide distraction: not to talk about the crisis, just to be with others. Example: going to the neighbourhood temple, sitting with a cousin, visiting a tea stall with friends.
4. People to ask for help: named family members or friends with phone numbers. Example: elder sister, best friend.
5. Professionals and services to contact in a crisis: counsellor, psychiatrist, nearest hospital emergency, and Tele MANAS on 14416.
6. Making the environment safe: reducing access to lethal means, such as giving pesticide or stored tablets to a family member to lock away.
Many versions add a seventh item: the person's most important reason for living, such as "my daughter".

## Making it collaborative
- Write it in the client's own words and language.
- Rate how likely they are to use each step and solve problems around barriers.
- Give a copy on paper and as a photo on the phone.
- Review and revise it at each session.

## Evidence
In a large study in United States emergency departments, the safety planning intervention combined with follow up phone calls was associated with about 45 percent fewer suicidal behaviours over six months than usual care, and with greater engagement in outpatient treatment. Reviews of safety planning studies also find reduced suicidal behaviour, though the evidence base is still growing and most studies are not randomised.

## Adaptation in India
Families are often closely involved, so a family member may help with steps 4 and 6 if the client agrees. Means restriction is especially important for pesticides and medicines. Helpline numbers and local emergency services should be checked and written correctly.

## Conclusion
The safety plan is a simple, evidence informed tool that gives a suicidal person a step by step guide for getting through a crisis, built together with the counsellor.`,
    keyPoints: ["Brief written personalised plan", "Replaces no suicide contracts", "All six steps in order with examples", "Means restriction as the final step", "Collaborative, client's own words", "Emergency department evidence about 45 percent fewer suicidal behaviours", "Indian adaptations: family and pesticides"],
    pitfalls: ["Confusing a safety plan with a promise not to self harm", "Leaving out means restriction"],
    module: "suicide",
    visuals: [layers("The six steps", "stack", [["Warning signs", "Know when a crisis is starting"], ["Internal coping", "What I can do alone"], ["Distracting people and places", "Be with others"], ["People to ask for help", "Named, with numbers"], ["Professionals and services", "Counsellor, emergency, Tele MANAS 14416"], ["Make the environment safe", "Lock away pesticide and tablets"]])],
    ref: "Stanley and Brown 2012 Cogn Behav Pract; Stanley et al 2018 JAMA Psychiatry SPI plus follow up, 45 percent reduction; Tele MANAS",
  },
]);
