import type { InterviewQuestion } from "@/lib/prep/types";
import { ivkit } from "../qb5-kit";

/** Mock interview bank · motivation and fit. Ordered foundation to advanced. */
const iv = ivkit("motivation", ["mcp-entrance"]);

const ITEMS: InterviewQuestion[] = [
  iv("iv-mot-001", 1,
    "Tell us about yourself.",
    [
      "What do you do outside academics?",
      "What is one thing not on your CV that we should know?",
      "Why did you choose psychology at the undergraduate level?",
    ],
    "This is not a request for my life story, so I would give a short, focused answer that links my background to clinical psychology, in about one to two minutes. For example: 'I am a postgraduate in psychology from Gujarat University. I first became interested in clinical work during my BA, when I volunteered at a community mental health camp and saw how families travelled long distances for care. In my MA, I did my dissertation on social support and depressive symptoms in college students, and a two-month internship at a district hospital, where I assisted with history taking, the mental status examination and administering tests such as the Bhatia battery and the PGI Memory Scale under supervision. I have also volunteered with a student helpline, which taught me how to listen to people in distress and when to refer. Outside academics, I play the tabla, which helps me stay balanced. I am applying because I want structured, supervised clinical training that will make me a competent, registered clinical psychologist, and I would especially like to work with young people and in community settings.' This gives the panel a clear picture and openings for follow-up questions.",
    [
      "Concise and structured",
      "Links background to clinical psychology",
      "Concrete clinical and research experience",
      "A personal detail that shows balance",
      "Clear goal",
    ],
    [
      "Reciting the CV or family history at length",
      "Vague answers with no examples",
      "Over-rehearsed tone",
    ]),

  iv("iv-mot-002", 1,
    "Why do you want to become a clinical psychologist?",
    [
      "What exactly does a clinical psychologist do that a counsellor does not?",
      "Was there a turning point?",
      "What part of the work do you think you will find hardest?",
    ],
    "I would give a genuine, specific answer rather than 'I want to help people', which every candidate says. For example: 'During my internship I saw a 19-year-old with OCD who had stopped going to college. Over a few weeks, with exposure and response prevention supervised by the clinical psychologist, he was able to touch door handles without washing and went back to classes. That showed me how much a structured, evidence-based psychological intervention can change someone's life. I am drawn to clinical psychology because it combines careful assessment, scientific thinking and therapy, and because in India the treatment gap is huge. National survey data showed that most people with mental disorders receive no treatment, and trained clinical psychologists are far too few. I also like that the role includes research and working in teams with psychiatrists and social workers. I understand it is a regulated profession needing RCI registration, which matters to me because patients deserve properly trained professionals. I know the work is demanding, emotionally and intellectually, and I want training that prepares me for that.' This shows motivation grounded in real experience and understanding of the profession.",
    [
      "A specific, authentic experience",
      "Understanding of the clinical psychologist's role",
      "Awareness of the Indian treatment gap",
      "Recognition of regulation and teamwork",
      "Realism about the demands",
    ],
    [
      "Only 'I want to help people'",
      "Saying psychology is easier than medicine",
      "Personal problems as the main motivation without reflection",
    ]),

  iv("iv-mot-003", 2,
    "Why have you applied to this institute in particular?",
    [
      "What do you know about our department's work?",
      "Which faculty member's work interests you?",
      "Would you join if you got admission elsewhere as well?",
    ],
    "I would show that I have done my homework, without flattery. For example, for a large national institute: 'I have applied here because the institute offers training across a very wide range of conditions and settings, from child and adolescent services to neuropsychology, addiction and community outreach, so I would see the variety of cases that builds real clinical competence. Its clinical psychology department has a long history of training and research in India, including the development of Indian test batteries and adaptations, and I would value learning to use tools standardised for our population. I am particularly interested in the department's work on child and adolescent mental health and in its community programmes, which match my interest in young people. The structured supervision, case conferences and research culture would help me grow both as a clinician and a researcher.' I would mention specific programmes, units or research areas I genuinely read about on the institute's website or in recent news, and I would be honest about why it fits my goals. If asked about other options, I would say that this is my first choice because of the clinical exposure and supervision, without disrespecting other institutes.",
    [
      "Specific, researched reasons",
      "Links institute strengths to own goals",
      "Mentions clinical range and supervision",
      "Honest and respectful about other options",
    ],
    [
      "Generic praise ('it is the best')",
      "Factual errors about the institute",
      "Choosing it only for the stipend or location",
    ]),

  iv("iv-mot-004", 2,
    "Where do you see yourself five years after completing this programme?",
    [
      "Would you like to do a PhD?",
      "Would you be willing to work in a government hospital or a district?",
      "What specialisation interests you?",
    ],
    "I would give a realistic plan that shows direction but also openness. For example: 'In five years, I see myself working as an RCI-registered clinical psychologist in a hospital or a multidisciplinary mental health service, ideally with children and adolescents, where I would be doing assessments and evidence-based therapies like CBT and family interventions. I would like to gain a few years of solid clinical experience first, because I believe good practice comes before specialisation. During that time I want to keep up continuing education, build skills in an area such as DBT or neuropsychological assessment, and publish at least one study from my clinical work. In the longer term, I am interested in a PhD, so I can contribute to research on interventions that work in Indian settings, such as school-based mental health programmes. I am also open to working in government services or district programmes, because I know that is where the need is greatest.' This shows planning, commitment to the profession and to India's needs, without sounding fixed or unrealistic.",
    [
      "Realistic, specific plan",
      "Clinical practice and registration",
      "Professional development and specialisation",
      "Research or PhD interest",
      "Openness to public sector and community work",
    ],
    [
      "Planning to go abroad immediately",
      "Wanting private practice only for income",
      "No clear plan",
    ]),

  iv("iv-mot-005", 2,
    "Why clinical psychology and not psychiatry or counselling?",
    [
      "How do psychiatrists and clinical psychologists work together?",
      "What can a clinical psychologist do that a counsellor cannot, legally?",
      "Did you consider medicine?",
    ],
    "I would show that I understand the different roles and respect them. For example: 'Psychiatrists are medical doctors who diagnose and treat mental illness, often with medication and physical treatments, and they carry overall medical responsibility. Counsellors usually work with people facing life difficulties and milder problems, and their training varies a lot. Clinical psychologists in India have RCI-recognised training that combines psychological assessment, psychological treatment for a wide range of disorders, including severe ones, and research. Under the Mental Healthcare Act, a registered clinical psychologist is a mental health professional, for example able to examine patients for supported admission alongside a psychiatrist. I am drawn to clinical psychology because I am most interested in understanding how thoughts, emotions, behaviour and relationships interact, and in delivering structured psychological treatments and standardised assessments. I chose psychology after school because I was drawn to the mind and behaviour rather than to medicine and the body. I see psychiatrists as close colleagues. The best care, for example in psychosis or severe depression, usually combines medication with psychological treatment and social support, so I look forward to working in a team.'",
    [
      "Accurate description of each role",
      "Legal and regulatory distinctions",
      "Genuine reason for preferring clinical psychology",
      "Respect for colleagues and teamwork",
    ],
    [
      "Disparaging psychiatrists or counsellors",
      "Saying psychology is a fallback after failing medicine",
    ]),

  iv("iv-mot-006", 2,
    "What are your strengths and weaknesses as a future clinical psychologist?",
    [
      "Give an example of that strength in action.",
      "What are you doing about your weakness?",
      "How would your supervisor describe you?",
    ],
    "I would choose strengths relevant to clinical work and give evidence, and name a real weakness with what I am doing about it. For example: 'One strength is that I am a patient, careful listener. During my internship, a supervisor said that a withdrawn adolescent opened up to me because I didn't rush her, and that helped the team get a clearer history. Another strength is that I am organised with documentation and follow-up, which matters in a busy hospital. A weakness is that I sometimes find it hard to set limits when someone is in distress. I tend to extend sessions or give my personal number, which is not good for me or the client. I have been working on this by learning about boundaries, discussing cases in supervision, and practising clear endings to sessions. Another area for growth is statistics beyond the basics, so I have been taking an online course on regression and using R.' This shows self-awareness, honesty and a commitment to learning, which matter more than having no weaknesses.",
    [
      "Relevant strengths with evidence",
      "A genuine weakness",
      "Concrete steps to improve",
      "Self-awareness and openness to supervision",
    ],
    [
      "A disguised strength as weakness ('I work too hard')",
      "No examples",
      "Defensiveness",
    ]),

  iv("iv-mot-007", 2,
    "Clinical work exposes you to trauma and suicide. How will you look after your own mental health?",
    [
      "What is vicarious trauma?",
      "Have you ever had personal therapy?",
      "What would you do if a client you saw died by suicide?",
    ],
    "I would show that I understand the risks and take self-care seriously as a professional duty. For example: 'I know clinical work can lead to compassion fatigue, burnout and vicarious trauma, where hearing about others' trauma changes your own sense of safety or trust. Self-care is not a luxury; under the ethics codes, psychologists must make sure their own problems do not impair their work. My plan includes regular supervision, where I can discuss difficult cases and my reactions, and peer support with colleagues. I keep boundaries, such as not taking case files home and keeping some time each day free of work. I also look after the basics: sleep, exercise and time with family and friends, and I play music. I am open to personal therapy, which I think helps a therapist understand their own patterns and what it feels like to be a client. If a client died by suicide, I know it would be very painful. I would seek support from my supervisor and team, take part in a review to learn, without blaming myself unfairly, and look after my own wellbeing, because therapists also need support after such losses.'",
    [
      "Understanding of burnout and vicarious trauma",
      "Self-care as an ethical duty",
      "Supervision and peer support",
      "Practical self-care habits and openness to therapy",
      "Realistic response to client suicide",
    ],
    [
      "'I am strong, it won't affect me'",
      "No concrete strategies",
    ]),

  iv("iv-mot-008", 2,
    "Describe a difficult situation you faced during your internship and how you handled it.",
    [
      "What did you learn from it?",
      "What would you do differently now?",
      "How did your supervisor help?",
    ],
    "I would use the STAR structure: situation, task, action and result, and focus on what I learned. For example: 'During my internship at a district hospital, a family brought their 17-year-old son who had stopped eating and talking. The father became angry when I asked about family conflicts and said I was blaming them. My task was to complete the history without losing the family's trust. I paused, acknowledged that they were worried and exhausted, explained why we ask about the whole family, and said we were not looking for someone to blame but trying to understand what might help. The father calmed down and later shared that the boy had been bullied at school and that there were money problems at home. I immediately informed my supervisor, because the boy had stopped eating, and we arranged a medical check and a risk assessment. I learned that how we ask questions matters as much as what we ask, and that families' anger often comes from fear. Now I would explain the purpose of questions at the start and check for urgent medical risk earlier.' This shows calmness, empathy, judgment and willingness to learn from supervision.",
    [
      "Clear structure",
      "Specific, realistic situation",
      "Thoughtful actions showing empathy and judgment",
      "Appropriate use of supervision and attention to risk",
      "Lessons learned",
    ],
    [
      "Inventing heroic stories",
      "Blaming others",
      "No reflection",
    ]),

  iv("iv-mot-009", 3,
    "What will you do if you are not selected this year?",
    [
      "How will you use the year productively?",
      "Will you apply to other programmes?",
      "How do you handle rejection?",
    ],
    "I would answer calmly and show resilience and commitment. For example: 'If I am not selected, I will be disappointed, but I will take it as feedback rather than as a final judgment. I will reflect honestly on where I can improve, whether in my subject knowledge, research skills or interview performance, and ask for feedback if possible. I will apply to other RCI-recognised M.Clin.Psy programmes, because my goal is to become a clinical psychologist, not to get into one institute only. Meanwhile, I will use the year productively, for example by working as a research assistant on a mental health project, volunteering in a hospital or NGO under supervision, strengthening my statistics, and working on publishing my dissertation. That experience would make me a stronger candidate and a better clinician. I have faced setbacks before, such as not clearing an entrance on my first attempt, and I learned that persistence and reflection pay off.' This shows emotional maturity, which is important in a profession where clients and outcomes will not always go to plan.",
    [
      "Emotional maturity",
      "Reflection and seeking feedback",
      "Commitment to the profession beyond one institute",
      "Productive, specific plans",
      "Evidence of past resilience",
    ],
    [
      "Saying they would quit psychology",
      "Pleading with the panel",
      "Blaming the exam",
    ]),

  iv("iv-mot-010", 2,
    "What qualities make a good clinical psychologist?",
    [
      "Which of these do you already have?",
      "Can empathy be taught?",
      "Is scientific thinking important in therapy?",
    ],
    "I would describe a balance of personal qualities, professional skills and ethics. For example: 'A good clinical psychologist needs empathy and warmth, the ability to understand a client's experience without judgment, which is the base of a good therapeutic alliance. They need strong listening and communication skills, including with families, colleagues and in reports. They need scientific thinking: making careful assessments, forming hypotheses, using evidence-based treatments, and measuring outcomes rather than relying on intuition alone. They need ethical integrity: respecting confidentiality, consent and boundaries, and knowing the law, such as the MHCA and RCI requirements. Cultural humility matters a lot in India, where clients differ widely in language, religion, class and beliefs about illness. They need self-awareness and openness to supervision, so their own reactions do not get in the way, and resilience and self-care to handle emotionally heavy work. Finally, they need a commitment to lifelong learning, because the field keeps changing.' I would add that empathy can be developed through training, practice and feedback, and give one example from my experience of each quality I already have.",
    [
      "Empathy and alliance",
      "Scientific, evidence-based practice",
      "Ethics and legal awareness",
      "Cultural humility",
      "Self-awareness, resilience and lifelong learning",
    ],
    [
      "Only personality traits with no professional skills",
      "Overconfidence",
    ]),

  iv("iv-mot-011", 3,
    "Would you be willing to work in a rural or underserved district after training? Why?",
    [
      "What challenges would you expect?",
      "How would you adapt your practice?",
      "What do you know about the district mental health programme?",
    ],
    "I would answer honestly, and ideally with real willingness backed by understanding. For example: 'Yes, I would be willing, at least for part of my career, because that is where the need is greatest. Most of India's population lives outside big cities, while mental health professionals are concentrated in urban centres, so many people in rural areas get no care at all, or reach faith healers first. The District Mental Health Programme, now sanctioned in most districts, and the integration of mental health into primary care through Ayushman Arogya Mandirs, along with Tele-MANAS, create opportunities for clinical psychologists. I would expect challenges such as limited resources, few colleagues, stigma, language differences, long travel for patients and less specialist backup. I would adapt by using brief, structured interventions, working through community health workers and ASHAs, training and supervising them, which is task sharing, using local languages and examples, involving families and community leaders, and using telepsychology for follow-up. I would also need good supervision networks, perhaps online.' If I had personal constraints, I would mention them honestly while showing commitment to contributing in some way.",
    [
      "Honest willingness with reasons",
      "Awareness of rural treatment gap",
      "Knowledge of DMHP, primary care integration and Tele-MANAS",
      "Realistic challenges",
      "Practical adaptations such as task sharing",
    ],
    [
      "Saying yes without understanding",
      "Looking down on rural communities",
    ]),

  iv("iv-mot-012", 2,
    "How do you see the role of a clinical psychologist in a multidisciplinary team?",
    [
      "How would you handle a disagreement with a psychiatrist about a diagnosis?",
      "What does a psychiatric social worker contribute?",
      "What is a case conference?",
    ],
    "In Indian hospitals, mental health care is usually delivered by a team: psychiatrists, clinical psychologists, psychiatric social workers, psychiatric nurses, occupational therapists and sometimes special educators. Each brings different skills. The clinical psychologist contributes detailed psychological assessment, including standardised tests, neuropsychological evaluation and personality assessment, case formulation, psychological therapies such as CBT, behavioural and family interventions, and research and outcome measurement. The psychiatric social worker focuses on family and social circumstances, rehabilitation, community links and welfare benefits, while the psychiatrist carries medical responsibility, diagnosis and medication. In case conferences, the team discusses complex patients and plans together. If I disagreed with a psychiatrist about a diagnosis, I would raise it respectfully, with evidence from my assessment, for example, 'On testing and interview, his attention was preserved and his memory improved with cues, which made me wonder about depression rather than early dementia. Could we consider that?' I would listen to their reasoning, since they may have information I do not, and aim for what is best for the patient. Good teamwork depends on mutual respect, clear communication, shared notes and clarity about roles.",
    [
      "Names team members and their roles",
      "Specific contributions of the clinical psychologist",
      "Case conferences",
      "Respectful, evidence-based handling of disagreement",
      "Patient-centred teamwork",
    ],
    [
      "Seeing psychologists as subordinate assistants only",
      "Dismissing other professionals",
    ]),

  iv("iv-mot-013", 1,
    "What did you learn from your MA internship or fieldwork?",
    [
      "Which case taught you the most?",
      "What skills do you still need to develop?",
      "How did you use supervision?",
    ],
    "I would give concrete learning rather than a list of tasks. For example: 'In my six-week internship at a general hospital psychiatry unit, I learned three important things. First, how to take a full case history and mental status examination in a structured way, and how much information comes from families in India. Second, I learned to administer and score tests such as the PGI Memory Scale, Bhatia battery and Beck Depression Inventory, and I learned the importance of standard instructions and rapport, because one child's score changed a lot once she felt comfortable. Third, I saw how much social factors such as debt, family conflict and stigma affect recovery, which made me appreciate the psychiatric social worker's role. The case that taught me most was a woman with conversion symptoms whose episodes started after her husband migrated for work, because it showed me how distress can be expressed through the body. I also realised that I need much more training in therapy skills before I can work independently, and I used supervision to review my session notes and practise reflective listening. This is why I want structured training in an M.Clin.Psy programme.'",
    [
      "Concrete skills learned",
      "Appreciation of family and social context",
      "A meaningful case example",
      "Awareness of own limits",
      "Use of supervision",
    ],
    [
      "Claiming to have done independent therapy without supervision",
      "Vague or exaggerated experience",
    ]),

  iv("iv-mot-014", 3,
    "Tell us about a mistake you made in clinical or academic work.",
    [
      "How did you realise it was a mistake?",
      "Whom did you inform?",
      "What would you do differently?",
    ],
    "I would choose a genuine but not catastrophic mistake, take responsibility, and show learning. For example: 'During my internship, I administered a memory test to an elderly patient without first checking that he could hear me well. He had a hearing problem that he did not mention, and his scores were very low. When my supervisor reviewed the results, she asked about sensory checks, and I realised my mistake. I told her honestly, and we re-administered the test on another day after making sure he could hear, speaking slowly and facing him. His scores were much better, still below average but not in the impaired range. If I had not corrected it, he could have been wrongly labelled as having dementia. Since then, I always check vision, hearing, language, fatigue and pain before testing, and I note any problems in the report.' This shows that I can admit errors, put the client's welfare first, use supervision, and change my practice, which is more important than never making mistakes. Panels value honesty here because hiding errors is dangerous in clinical work.",
    [
      "A real, appropriately sized mistake",
      "Ownership and honesty with supervisor",
      "Corrective action for the client",
      "Lasting change in practice",
    ],
    [
      "'I have never made a mistake'",
      "Blaming others",
      "A mistake showing serious ethical problems with no reflection",
    ]),

  iv("iv-mot-015", 2,
    "How do you keep yourself updated in psychology?",
    [
      "What is the most interesting recent development you have read about?",
      "How do you judge whether a source is reliable?",
      "Do you follow any professional bodies?",
    ],
    "I would show active, critical learning habits. For example: 'I follow updates in a few ways. I read open-access research articles and review papers on topics I am interested in, such as youth mental health and CBT, especially systematic reviews, since they summarise the evidence. I follow updates from professional and official bodies, such as the RCI for regulations, the Ministry of Health for programmes like Tele-MANAS, and the WHO for global guidelines. I attend webinars and conferences when possible, for example those organised by professional associations of clinical psychologists. I also discuss new findings with classmates and teachers. One recent development I found interesting is the RCI's renaming of the M.A. Clinical Psychology as the Master in Clinical Psychology in 2026, which affects our profession directly, and the second national mental health survey covering all states and union territories. To judge reliability, I check whether a source is peer-reviewed or official, look at the sample size and design, and am cautious about social media claims and predatory journals.' This shows curiosity, critical thinking and engagement with Indian developments.",
    [
      "Multiple, credible sources",
      "Official and professional bodies",
      "Recent, relevant developments",
      "Critical appraisal of sources",
    ],
    [
      "Only social media or YouTube",
      "Cannot name any recent development",
    ]),

  iv("iv-mot-016", 3,
    "You have a gap of two years after your MA. What did you do, and why should we take you now?",
    [
      "What skills did you gain during the gap?",
      "Are you still current with the syllabus?",
      "Why now?",
    ],
    "I would explain the gap honestly and positively, linking it to my readiness. For example: 'After my MA, I worked for two years as a research assistant on a school mental health project run by an NGO, and for part of that time I also cared for my father during his illness. On the project, I helped adapt and administer questionnaires in Gujarati, trained teachers to recognise distress in students, and co-authored a report. Caring for my father taught me what families go through in the health system, which I think will make me more empathetic. These two years confirmed that I want to become a clinical psychologist, and I applied now because I am clear about my goals and have the practical experience to make the most of rigorous training. To stay current, I revised core subjects, practised past entrance questions and followed new developments, such as the DSM-5-TR and ICD-11 changes.' Panels usually do not mind a gap if it is explained honestly and shows growth, so I would not hide it or be defensive.",
    [
      "Honest explanation",
      "Skills and experience gained",
      "Link to motivation and readiness",
      "Evidence of staying current",
    ],
    [
      "Evasiveness",
      "Saying the gap was wasted",
    ]),

  iv("iv-mot-017", 3,
    "Who is your role model in psychology, and why?",
    [
      "What have you read by or about them?",
      "How has their work influenced your practice?",
      "Do you disagree with anything they said?",
    ],
    "I would choose someone whose work I genuinely know and explain specific reasons, possibly including an Indian figure. For example: 'One of my role models is Vikram Patel, an Indian psychiatrist, although not a psychologist, whose work on task-sharing showed that trained lay health workers can deliver psychological treatments for depression and other problems effectively in low-resource settings in India. It influenced me because it shows that psychological care does not have to depend only on scarce specialists, and that good research can change policy. From psychology, I also admire Aaron Beck, because he developed cognitive therapy by testing his own psychoanalytic ideas and changing them when the data did not support them, which is a great example of scientific honesty. I try to apply this in my own work by keeping careful records of outcomes and being willing to change my approach if a client is not improving. I do think that lay counsellor models need strong supervision and that CBT needs cultural adaptation for some Indian clients, which is something I would like to study.' Panels are more interested in the depth of understanding than in whom I choose.",
    [
      "A genuine, well-understood role model",
      "Specific contributions",
      "Influence on own thinking or practice",
      "Critical, balanced view",
    ],
    [
      "Naming a famous figure without knowing their work",
      "Uncritical hero-worship",
    ]),

  iv("iv-mot-018", 2,
    "How do you respond to negative feedback from a supervisor?",
    [
      "Give an example.",
      "What if you disagree with the feedback?",
      "Why is supervision important in clinical training?",
    ],
    "I would show openness, reflection and the ability to act on feedback, with an example. For example: 'Supervision is central in clinical training because it protects clients and helps us develop skills and self-awareness. When I receive negative feedback, I try first to listen without becoming defensive, ask questions to understand exactly what I need to change, and thank the supervisor. Then I reflect and make a plan. During my internship, my supervisor told me that I asked too many closed questions and did most of the talking in a session with an anxious client. At first I felt embarrassed, but when I listened to my recording I saw she was right. I practised using open questions and reflections, and in later sessions the client spoke much more. If I disagreed with feedback, I would say so respectfully, explain my reasoning, and stay open to the possibility that I am missing something. If there were an ethical issue, I would raise it through the proper channels.' This shows I am coachable, which panels value highly in trainees.",
    [
      "Value of supervision",
      "Non-defensive listening",
      "Concrete example with change",
      "Respectful disagreement",
    ],
    [
      "Saying they never get negative feedback",
      "Defensiveness or blaming the supervisor",
    ]),

  iv("iv-mot-019", 2,
    "The M.Clin.Psy programme is very demanding. How will you manage clinical work, coursework and research together?",
    [
      "How do you manage your time now?",
      "What would you do if you fell behind?",
      "How do you handle stress during exams?",
    ],
    "I would show realistic planning and self-management. For example: 'I understand that the programme involves full-time clinical postings, case work-ups, coursework, test practicals and a dissertation, often all at once. I would manage by planning each week, using a calendar to block time for case reports, reading and research, and breaking the dissertation into small monthly goals from the start rather than leaving it until the end. I would keep case notes and reports up to date daily, because they pile up quickly. In my MA I balanced an internship, coursework and my dissertation by working on my literature review in short daily sessions, and I finished on time. If I fell behind, I would tell my supervisor early, re-plan, and ask for help rather than hide it. I would also protect basic routines like sleep, exercise and some time with friends, because exhaustion lowers the quality of clinical work. Studying in groups with batchmates also helps share the load and learning.' This shows organisation, honesty and awareness that wellbeing affects performance.",
    [
      "Realistic understanding of demands",
      "Specific time management strategies",
      "Past evidence of managing workload",
      "Seeking help early",
      "Wellbeing and peer support",
    ],
    [
      "Unrealistic claims of never feeling stressed",
      "No concrete strategies",
    ]),

  iv("iv-mot-020", 3,
    "Why is RCI registration important? Couldn't someone with an MA do therapy just as well?",
    [
      "What does the RCI Act say about unregistered practice?",
      "What is CRE?",
      "How does registration protect the public?",
    ],
    "I would explain the reasons calmly and factually. 'RCI registration matters because clinical psychology involves assessing and treating people with serious mental illnesses, often when they are vulnerable. The RCI-recognised training, now the two-year Master in Clinical Psychology, includes intensive supervised clinical work with a wide range of disorders, structured training in standardised assessment, evidence-based therapies, ethics and law, which a general MA usually does not provide. Under Section 13 of the RCI Act 1992, only people enrolled on the Central Rehabilitation Register can practise as clinical psychologists, hold such posts in government institutions or sign certificates in this area, and unregistered practice is punishable. Registration also brings accountability: the RCI can prescribe a code of ethics and remove people from the register for professional misconduct under Section 21, and renewal requires continuing rehabilitation education, so registered professionals keep their skills current. This protects the public from untrained practice, which can cause harm, such as missing suicide risk or using unproven methods. An MA graduate can do valuable work in counselling or research within their competence and under supervision, but clinical diagnosis and treatment of mental disorders needs the full professional training.'",
    [
      "Nature of clinical work and risk",
      "Content of RCI-recognised training",
      "RCI Act s.13 restrictions",
      "Accountability through s.21 and CRE",
      "Respectful view of MA graduates' role",
    ],
    [
      "Dismissing registration as bureaucracy",
      "Disparaging MA graduates",
    ]),

  iv("iv-mot-021", 2,
    "You will see patients from many religions, castes, classes and languages. How will you make sure you treat everyone fairly?",
    [
      "What is cultural humility?",
      "Have you noticed any of your own biases?",
      "How would you work with a client who speaks a language you do not know?",
    ],
    "I would show awareness that fairness needs active effort, not just good intentions. For example: 'I would start by accepting that I, like everyone, have biases from my own background, and that power differences between a professional and a client can be large, especially with clients from marginalised groups. I would practise cultural humility, which means being curious and open, asking clients how they understand their problems, what matters to them, and how their community sees mental illness, rather than assuming I know. I would use tools like the cultural formulation interview. I would watch for bias in my own reactions, for example if I found myself expecting less from a poorer client or judging a family's religious practices, and I would discuss this in supervision. I would make sure my assessments use appropriate norms and languages, use interpreters who are trained and not family members where possible for clients whose language I do not speak, and keep explanations simple and free of jargon. Equality is also a legal right under Section 21 of the Mental Healthcare Act, which prohibits discrimination on many grounds, including caste, religion, gender and class.'",
    [
      "Acknowledges own biases",
      "Cultural humility and curiosity",
      "Practical tools including cultural formulation and interpreters",
      "Fair assessment practices",
      "Legal basis in MHCA s.21",
    ],
    [
      "Claiming to have no biases",
      "Stereotyping groups",
    ]),

  iv("iv-mot-022", 4,
    "Some people say clinical psychology in India just copies Western models. Do you agree?",
    [
      "Give an example of an Indian adaptation of a Western therapy.",
      "What can Indian traditions contribute?",
      "How would you research this?",
    ],
    "I would give a balanced, thoughtful answer. 'There is some truth in the criticism. Much of our training, theory and many of our tests come from Western countries, and some assume an individualistic self, direct emotional expression or a strict separation of mind and body, which do not always fit Indian clients, who may experience distress through the body, rely heavily on family, and draw on religious explanations. Using Western tools without adaptation can lead to wrong conclusions, as with norms. But it is not simply copying. Indian psychologists have adapted tests, such as MISIC and the Bhatia battery, and developed Indian batteries like the PGI and NIMHANS tools. Therapy has been adapted too, for example by involving families more, using local idioms and metaphors, being more directive where clients expect guidance, as Neki suggested with the guru-chela idea, and incorporating yoga and mindfulness, which have Indian roots. Indian researchers have also tested low-cost, task-shared psychological treatments that are now used around the world. I think the way forward is to keep what has strong evidence, adapt it carefully, and also develop indigenous concepts and test them scientifically. As a researcher I would like to study culturally adapted CBT with proper trials.'",
    [
      "Acknowledges valid criticism",
      "Examples of Indian tests and adaptations",
      "Indian contributions to global practice",
      "Evidence-based integration",
      "Research orientation",
    ],
    [
      "Rejecting all Western psychology",
      "Dismissing culture entirely",
    ]),

  iv("iv-mot-023", 3,
    "A client from a poor background cannot afford sessions or travel. What does this tell you about mental health care in India, and what can a clinical psychologist do?",
    [
      "What is the treatment gap?",
      "What is task sharing?",
      "How can policy help?",
    ],
    "This reflects the large treatment gap in India. National survey data from 2015 to 2016 showed that most people with mental disorders, often 70 to more than 90 percent depending on the disorder, received no treatment. The reasons include a shortage of professionals, concentration of services in cities, cost, stigma and low awareness. Poverty and mental illness also feed each other: poverty increases stress and the risk of illness, and illness reduces earning capacity. A clinical psychologist can act at several levels. In practice, I can offer flexible arrangements, telepsychology to reduce travel costs, brief evidence-based interventions, and link clients to free government services, since under Section 18 of the Mental Healthcare Act, people below the poverty line and destitute or homeless persons are entitled to free treatment at government-run or funded establishments. I can connect them with Tele-MANAS on 14416, district mental health programme services and social welfare benefits, such as disability certificates under the RPwD Act. At a system level, I can support task sharing by training and supervising community health workers and counsellors to deliver simple psychological interventions, as shown in Indian research. And I can contribute to advocacy and research that informs policy, such as the expansion of mental health care through primary care.",
    [
      "Treatment gap and its causes",
      "Poverty and mental health cycle",
      "Practical individual-level responses",
      "MHCA s.18 entitlement and public services",
      "Task sharing and policy contributions",
    ],
    [
      "Saying the client should find money",
      "No awareness of public services",
    ]),

  iv("iv-mot-024", 1,
    "What do you do to relax? How do your hobbies relate to your work?",
    [
      "How much time do you give to your hobbies now?",
      "Would you continue them during the programme?",
      "Can a hobby ever be therapeutic for clients?",
    ],
    "Panels ask this to see whether I have a balanced life, which helps sustain demanding clinical work, so I would answer honestly and briefly. For example: 'I enjoy long walks, cooking and playing the tabla. Walking clears my head after a long day, and I often find that I understand a case better after stepping away from it. Learning the tabla has taught me patience and the value of steady practice, because progress comes slowly, which is similar to therapy, where change often takes time. Cooking for friends keeps me socially connected. I try to keep at least a few hours a week for these, and I would continue them during the programme, perhaps in a smaller way, because I think a clinician who neglects their own wellbeing cannot serve clients well. I also know that activities like music, exercise and creative work can help clients too, for example as part of behavioural activation, but I would always use them in an evidence-based way, not just as advice.' A genuine hobby with some reflection is better than an impressive-sounding one I do not really do.",
    [
      "Genuine, balanced lifestyle",
      "Link to self-care and clinical qualities",
      "Plan to maintain balance",
      "Thoughtful link to client care",
    ],
    [
      "Claiming no time for hobbies",
      "Invented or exaggerated hobbies",
    ]),

  iv("iv-mot-025", 3,
    "If a family member of yours developed a severe mental illness during your training, how would you manage both roles?",
    [
      "Would you treat your relative yourself?",
      "How would it affect your work?",
      "When would you tell your supervisor?",
    ],
    "I would show self-awareness and clear boundaries. 'First, I would not act as my relative's therapist or assess them formally, because that would be a dual relationship that would compromise objectivity and the relative's care, and as a trainee I would also be outside my competence. Instead, I would help them get proper care from a qualified team, and use my knowledge to support the family as a relative, for example by explaining the illness, encouraging treatment and helping with practical matters. Second, I would recognise that it would affect me emotionally. I would inform my supervisor early, without necessarily sharing every detail, so that they could support me and, if necessary, adjust my workload or avoid assigning me cases that are too close to my situation for a while. The ethics codes require that personal problems should not impair our professional work, so I would watch for signs like poor concentration or strong emotional reactions to similar cases, and seek personal support or therapy. Many clinicians have personal experience of mental illness in their families, and with good support, it can deepen empathy, as long as boundaries are kept.'",
    [
      "Refuses dual role of therapist to relative",
      "Supports access to proper care",
      "Informs supervisor and adjusts workload",
      "Monitors impairment and seeks support",
      "Recognises potential for deeper empathy",
    ],
    [
      "Treating the relative personally",
      "Hiding the situation completely",
    ]),

  iv("iv-mot-026", 2,
    "Is there anything you would like to ask the panel?",
    [
      "Why do panels ask this?",
      "What questions should you avoid?",
      "How long should your question be?",
    ],
    "I would have one or two thoughtful questions ready, because it shows genuine interest and helps me judge whether the programme fits me. Good questions are about the learning and the work, for example: 'Could you tell me how supervision is organised in the first year, and how trainees are gradually given more responsibility?' or 'Are there opportunities for trainees to be involved in the department's community or research projects alongside the clinical postings?' or 'What qualities have you seen in trainees who do well here?' I would avoid questions whose answers are easily found on the website, such as seat numbers or the stipend amount, and I would not ask about holidays or how much work there is in a way that suggests I am looking for an easy time. I would keep my question short, listen carefully to the answer, and thank them. If the panel has been running late, a brief, gracious 'Thank you, I think my questions have been answered during our discussion' is also fine. Ending with a calm, interested question leaves a good final impression.",
    [
      "Prepared, relevant questions",
      "Focus on training, supervision and opportunities",
      "Avoids questions answered on the website or that sound lazy",
      "Brief and courteous",
    ],
    [
      "Asking about holidays or easy work",
      "No questions and appearing disinterested, or very long questions",
    ]),
];

export const INTERVIEWS: InterviewQuestion[] = ITEMS.sort((a, b) => a.difficulty - b.difficulty);
