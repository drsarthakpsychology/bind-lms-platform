import type { LongQA } from "@/lib/prep/long-types";
import { anchored, chain, compare, layers, timeline, tree, vis } from "./visual";

const S = "counselling" as const;

export const COUNSELLING_L04: LongQA[] = anchored([
  {
    id: "couns-l04-001",
    subject: S,
    topic: "worden",
    marks: 15,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Describe Worden's tasks of mourning. Compare them with Kübler-Ross's stages and the dual process model, and explain how grief counselling is offered, including in the Indian cultural context.",
    plan: ["Grief as active work", "Worden's four tasks", "Kübler-Ross stages and their limits", "Dual process model and continuing bonds", "Grief counselling and when to refer", "Indian rituals and practice"],
    answer: `## Grief as work
Grief is the natural response to loss. Older models saw grief as something that happens to a person in passive stages. William Worden instead described mourning as a set of tasks the bereaved person actively works through, which gives both the person and the counsellor something to do.

## Worden's four tasks
1. To accept the reality of the loss: intellectually and emotionally accepting that the person is dead and will not return. Seeing the body, rituals and talking about the death help.
2. To process the pain of grief: allowing sadness, anger, guilt, anxiety and yearning rather than avoiding them through busyness, alcohol or denial.
3. To adjust to a world without the deceased: external adjustments, such as managing money or household roles; internal adjustments to one's sense of self, such as from wife to widow; and spiritual adjustments to beliefs about the world and God.
4. To find an enduring connection with the deceased while embarking on a new life: keeping a place for the person in memory without being stopped from living.
The tasks are not fixed in order and can be revisited. Worden also described mediators that shape how grief unfolds: who the person was, the nature of the attachment, how they died, past losses, the mourner's personality, social support and other stresses at the same time.

## Kübler-Ross's stages
Elisabeth Kübler-Ross, from interviews with dying patients, described five stages in 1969: denial, anger, bargaining, depression and acceptance. The model humanised care of the dying and is widely known. But:
- It was developed for dying patients, not the bereaved.
- Research does not support a fixed sequence; many people do not pass through all stages, and acceptance is often present early.
- In one study of bereaved people, yearning, not depression or anger, was the most common negative feeling, and acceptance was the strongest response throughout.
- Used rigidly, it can make people feel they are grieving wrongly.

## The dual process model and continuing bonds
Margaret Stroebe and Henk Schut described two kinds of coping:
- Loss oriented: crying, remembering, looking at photographs, yearning.
- Restoration oriented: dealing with new roles, finances, new relationships, taking time off from grief.
Healthy grief involves oscillation between the two. A widower who visits the grave in the morning and learns to cook in the evening is coping well. The continuing bonds view, described by Dennis Klass and colleagues, argues that keeping an inner relationship with the dead is normal and often healthy, not a failure to let go.

## Grief counselling
- Most bereaved people cope with family and community support and do not need counselling. Offering counselling routinely to everyone has little benefit.
- Counselling helps more for those at risk: sudden or violent deaths, suicide, the death of a child, poor support, or previous mental illness.
- Methods include telling the story of the death, expressing feelings, empty chair or letter writing, problem solving practical changes and finding ways to remember.
- Prolonged grief disorder, now in ICD 11 and DSM 5 TR, involves intense yearning or preoccupation persisting at least six months in ICD 11 and twelve months in DSM 5 TR, with severe impairment. It needs referral for specialised grief therapy.

## The Indian context
- Rituals such as the thirteen days of mourning, annual shraddh, offerings and prayers give structure to the first two tasks and express continuing bonds.
- Grief is often shared in the extended family, which can support or, at times, silence the bereaved, especially widows.
- Some deaths, such as suicide or deaths during the pandemic without proper rites, carry extra stigma or guilt.
- The counsellor should ask what the death means within the family's religion and respect rituals, while noticing those whose grief remains disabling.

## Conclusion
Worden's tasks, the dual process model and continuing bonds give a more flexible picture than fixed stages. Grief counselling is most useful for those at risk, and in India it works best when it respects ritual and family.`,
    keyPoints: ["Mourning as active tasks", "Four tasks named correctly with examples", "Mediators of mourning", "Kübler-Ross stages and the evidence against a fixed sequence", "Dual process oscillation between loss and restoration", "Continuing bonds", "Counselling for at risk groups; prolonged grief disorder durations", "Indian rituals and family"],
    pitfalls: ["Presenting Kübler-Ross stages as the stages of grief everyone must pass", "Recommending counselling for all bereaved people"],
    module: "suicide",
    visuals: [
      layers("Worden's four tasks", "stack", [["Accept the reality", "The person has died and will not return"], ["Process the pain", "Allow sadness, anger, guilt, yearning"], ["Adjust to the world without them", "External, internal and spiritual changes"], ["Enduring connection", "Remember while living on"]]),
      compare("The dual process model and continuing bonds", ["Loss oriented", ["Crying and yearning", "Looking at photographs", "Visiting the grave or ghat", "Talking about the death"], "Facing the loss"], ["Restoration oriented", ["New roles and finances", "Learning new skills", "New relationships", "Time off from grief"], "Rebuilding life; healthy grief moves between both"]),
    ],
    ref: "Worden Grief Counseling and Grief Therapy 5th ed; Kübler-Ross 1969; Maciejewski et al 2007; Stroebe and Schut 1999; Klass, Silverman and Nickman 1996; ICD-11 6B42; DSM-5-TR prolonged grief disorder",
  },
  {
    id: "couns-l04-002",
    subject: S,
    topic: "disaster-psychosocial",
    marks: 10,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "What is psychological first aid? Describe its principles and actions after a disaster, and explain why single session debriefing is not recommended.",
    plan: ["Reactions after disasters", "What psychological first aid is", "Look, listen and link with actions", "Five essential elements", "Why not debriefing", "Indian disaster context"],
    answer: `## Reactions after disasters
After floods, earthquakes, cyclones, building collapses or epidemics, most survivors show distress such as fear, poor sleep, grief and irritability. These are normal reactions to abnormal events, and most people recover with time and support. A minority develop PTSD, depression, prolonged grief or substance problems, and some, such as children, older adults, people with disabilities and those with previous mental illness, need extra care.

## Psychological first aid
Psychological first aid is humane, supportive and practical help for people who have recently suffered a serious crisis event. It is not professional counselling or therapy, and it can be given by trained volunteers, teachers, health workers and police, not only by psychologists. The World Health Organization's field guide organises it around three action principles.

## Look, listen and link
- Look: check for safety, check for people with obvious urgent basic needs, and check for people with serious distress reactions.
- Listen: approach people who may need support, ask about their needs and concerns, listen without pressing them to talk about the event, and help them feel calm.
- Link: help people meet basic needs such as food, water, shelter and medical care; help them cope with problems; give accurate information; and connect them with loved ones and services.
Throughout, respect safety, dignity and rights, and act according to the person's culture.

## Five essential elements
Stevan Hobfoll and colleagues identified five elements that research links with recovery: promoting a sense of safety, calming, a sense of self and community efficacy, connectedness, and hope. Psychological first aid is built around them.

## Why not single session debriefing
Critical incident stress debriefing asks survivors, soon after the event and usually in one group session, to describe the event in detail and their thoughts and feelings. Systematic reviews of randomised trials found that it does not prevent PTSD and in some studies people who were debriefed did worse. Possible reasons are that forced recounting re exposes people before they are ready and interferes with natural recovery, and that it may give the message that they will be traumatised. Current guidance is to offer practical support and watchful waiting, and to provide trauma focused therapy later only for those with persisting symptoms.

## The Indian context
India's National Disaster Management Authority has guidelines on psychosocial support and mental health services in disasters, which stress community based care, training of local workers and integration with relief. Counsellors should work with panchayats, schools and religious leaders, use the local language, attend to children and women's safety in relief camps, and follow up after the media attention fades.

## Conclusion
Psychological first aid, built on look, listen and link and the five elements, offers early practical comfort without forcing people to relive the event. Single session debriefing has been abandoned because it does not help and may harm.`,
    keyPoints: ["Most reactions are normal and recover", "Definition: humane, practical, not therapy", "Look, listen, link with actions", "Hobfoll's five elements", "Debriefing does not prevent PTSD and may harm", "Watchful waiting and later trauma focused therapy", "NDMA guidelines and community based work"],
    pitfalls: ["Describing psychological first aid as a counselling session about the trauma", "Recommending debriefing"],
    module: "trauma",
    visuals: [chain("Look, listen and link", [["Look", "Safety, urgent needs, severe distress"], ["Listen", "Approach, ask, calm, do not press"], ["Link", "Basic needs, information, loved ones, services"]])],
    ref: "WHO, War Trauma Foundation and World Vision 2011 Psychological First Aid: Guide for Field Workers; Hobfoll et al 2007; Rose et al Cochrane review debriefing; NDMA Guidelines on Psychosocial Support and Mental Health Services in Disasters 2009",
  },
  {
    id: "couns-l04-003",
    subject: S,
    topic: "multicultural-competence",
    marks: 20,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "What is multicultural counselling? Discuss the multicultural counselling competencies, cultural humility, microaggressions and the evidence on culturally adapted interventions, with Indian examples.",
    plan: ["Why culture matters in counselling", "Key concepts: etic and emic, ADDRESSING", "The competencies of awareness, knowledge and skills, and the 2015 revision", "Cultural humility and microaggressions", "Evidence on cultural adaptation", "India: diversity within one country"],
    answer: `## Why culture matters
Every counselling relationship is a meeting of cultures: the culture of the client, the culture of the counsellor and the culture of counselling itself, which developed mainly among white, middle class Western people and values individualism, verbal expression of feelings and insight. When these clash, clients may feel misunderstood and drop out. Multicultural counselling is counselling in which the counsellor understands and works with the cultural identities and contexts of both parties.

## Key concepts
- Etic and emic: an etic approach assumes that counselling principles are universal; an emic approach holds that problems and remedies must be understood within each culture. Most counsellors now combine both.
- Culture is broad: it includes not only ethnicity and religion but also gender, class, caste, sexual orientation, disability, age and region. Pamela Hays' ADDRESSING framework reminds counsellors of: Age, Developmental disability, Disability acquired later, Religion, Ethnicity, Socioeconomic status, Sexual orientation, Indigenous heritage, National origin and Gender.
- Intersectionality: identities combine, so a poor Dalit woman faces discrimination that is more than the sum of caste, gender and class alone.
- Worldview: values such as individualism or collectivism, time orientation and beliefs about causes of illness.

## The competencies
In 1992 Derald Wing Sue, Patricia Arredondo and Roderick McDavis proposed three areas of multicultural competence, each with beliefs and attitudes, knowledge and skills:
1. Counsellor awareness of one's own cultural values, assumptions and biases: for example, an urban upper caste counsellor recognising assumptions about rural or Dalit clients.
2. Understanding the worldview of the culturally different client: knowledge of the client's culture, history of oppression and how these affect help seeking.
3. Developing culturally appropriate intervention strategies: flexible methods, use of interpreters, involving families or healers where helpful, and advocacy.
In 2015 these were revised as the Multicultural and Social Justice Counseling Competencies, adding the counselling relationship itself and advocacy at individual, community and policy levels, and recognising the privilege and marginalisation of both counsellor and client.

## Cultural humility
Knowledge of cultures can lead to stereotyping. Cultural humility is an attitude of openness: the counsellor accepts that the client is the expert on their own culture, is curious rather than assuming, and continually reflects on power and bias. Research by Joshua Hook and colleagues found that clients who saw their counsellor as culturally humble reported a stronger alliance and better progress.

## Microaggressions
Sue described microaggressions as brief, everyday slights that communicate hostile or negative messages to people of marginalised groups, often unintentionally:
- Microassaults: deliberate slurs.
- Microinsults: rude or insensitive remarks, such as "You speak English so well for someone from a village."
- Microinvalidations: denying the experience of discrimination, such as "Caste does not matter any more."
In counselling, microaggressions damage the alliance, and repairing them requires acknowledging rather than defending.

## Evidence on cultural adaptation
- Meta-analyses find that culturally adapted interventions, which change language, examples, metaphors, goals and methods to fit the culture, produce better outcomes than unadapted ones, with moderate effects compared with no treatment and smaller but real advantages over unadapted active treatments.
- Matching client and counsellor ethnicity has only a small effect on outcome, though clients often prefer it.
- The DSM 5 Cultural Formulation Interview gives a structured way to explore the cultural definition of the problem, cultural factors, coping and help seeking.

## India: diversity within one country
India contains hundreds of languages, many religions, caste and tribe, sharp rural and urban and class divides, and different gender norms. Examples of competent practice:
- Counselling in the client's language, or with trained interpreters, rather than assuming English or Hindi.
- Asking about caste and religion respectfully when relevant rather than being caste blind.
- Understanding somatic idioms of distress, such as weakness or burning, and beliefs in spirits, karma or the evil eye.
- Including family when the client wishes, since many Indians make decisions jointly.
- Adapting methods: the Healthy Activity Program in Goa adapted behavioural activation with local activities and lay counsellors.

## Conclusion
Multicultural counselling asks counsellors to know themselves, understand their clients' worlds and adapt their methods, with humility and attention to power. Evidence shows that such adaptation improves outcomes, and in a country as diverse as India it is a core competence, not an optional extra.`,
    keyPoints: ["Counselling as a meeting of cultures", "Etic and emic; ADDRESSING; intersectionality", "Sue, Arredondo and McDavis: awareness, knowledge, skills", "2015 social justice revision with advocacy", "Cultural humility and its link with outcome", "Three types of microaggression with examples", "Culturally adapted interventions outperform unadapted", "Indian examples: language, caste, idioms, family"],
    pitfalls: ["Reducing culture to ethnicity", "Listing competencies without examples", "No evidence"],
    module: "therapies/3-5",
    visuals: [
      tree("The competencies", [["Multicultural competence", "Sue, Arredondo and McDavis", -1], ["Awareness", "Own values, assumptions and biases", 0], ["Knowledge", "Client's worldview and history", 0], ["Skills", "Culturally appropriate interventions", 0], ["Advocacy", "Added in 2015: community and policy", 0]]),
      vis("sort", { prompt: "Which type of microaggression is each remark?", buckets: ["Microassault", "Microinsult", "Microinvalidation"], items: [{ text: "A caste slur used on purpose", bucket: 0 }, { text: "You are very confident for a girl from a small town.", bucket: 1 }, { text: "Caste does not matter any more, so it cannot be why you were excluded.", bucket: 2 }, { text: "Your English is surprisingly good.", bucket: 1 }] }, "Microaggressions"),
    ],
    ref: "Sue, Arredondo and McDavis 1992; Ratts et al 2015 MSJCC; Hays ADDRESSING 2008; Sue et al 2007 microaggressions; Hook et al 2013 cultural humility; Griner and Smith 2006; Benish, Quintana and Wampold 2011; DSM-5 CFI; Patel et al 2017 HAP",
  },
  {
    id: "couns-l04-004",
    subject: S,
    topic: "caste-and-counselling",
    marks: 10,
    difficulty: 4,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Discuss the relevance of caste to counselling in India. How does caste affect mental health and help seeking, and how should a counsellor address it in practice?",
    plan: ["Caste as a social determinant", "Mental health effects", "Effects on help seeking and the counselling room", "Practice guidelines", "Institutional responsibilities"],
    answer: `## Caste as a social determinant
Caste is a hereditary system of social hierarchy that, despite constitutional abolition of untouchability under Article 17 and the prohibition of discrimination under Article 15, still shapes access to education, land, jobs, marriage, housing and dignity. Discrimination ranges from violence, which the Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Act 1989 addresses, to subtle exclusion in hostels, classrooms and workplaces. Counselling that ignores caste ignores one of the main sources of stress for many Indian clients.

## Mental health effects
- Chronic stress from discrimination, humiliation and the threat of violence, explained by minority stress ideas: external events of prejudice, expectation of rejection, concealment and internalised stigma.
- Higher exposure to poverty, poor housing, hazardous work and debt, which are risk factors for depression and anxiety.
- Internalised casteism: shame about one's background, which may appear as low self worth.
- Students from marginalised castes in elite institutions may face isolation, comments on reservations and pressure to prove merit; several widely reported student suicides have raised these concerns.
- Privileged caste clients may also present caste related issues, such as family conflict over inter caste marriage.

## Effects on help seeking
- Mistrust of institutions and of counsellors who are mostly from privileged castes and urban backgrounds.
- Fear that disclosure will lead to more stigma.
- Greater reliance on community and religious healers.
- In the counselling room, caste may be present through names, food, language and assumptions, even when no one mentions it.

## Practice guidelines
1. Self awareness: the counsellor reflects on their own caste position, privilege and biases, preferably in supervision.
2. Do not be caste blind: saying "I do not see caste" can invalidate the client's experience.
3. Ask respectfully when relevant: "Some students tell me that their background affects how they are treated here. Has that been part of your experience?"
4. Validate experiences of discrimination as real, rather than reinterpreting them only as individual sensitivity.
5. Separate the client's internal distress from external injustice, and work on both: coping and self worth, and practical steps such as reporting.
6. Avoid microaggressions, such as remarks on surnames or quota admissions.
7. Know referral and legal routes, such as institutional equal opportunity or anti discrimination cells and the Atrocities Act.

## Institutional responsibilities
Counselling centres should have diverse staff, publicise confidential grievance systems and train faculty. The Supreme Court's 2025 guidelines on student mental health require institutions to have confidential grievance mechanisms for harassment and discrimination.

## Conclusion
Caste is a social determinant of mental health in India. Competent counsellors examine their own position, acknowledge caste without stereotyping, validate discrimination and combine emotional support with advocacy.`,
    keyPoints: ["Constitutional Articles 15 and 17 and the Atrocities Act", "Minority stress and internalised casteism", "Poverty and exposure as pathways", "Campus experiences of marginalised students", "Effects on help seeking and mistrust", "Counsellor self awareness and avoiding caste blindness", "Validation, advocacy and institutional duties"],
    pitfalls: ["Treating caste as irrelevant to modern urban clients", "Stereotyping clients by caste"],
    module: "therapies/3-5",
    visuals: [vis("decide", { scene: "A first year student from a Dalit family says classmates keep asking his rank and joke that he got in on quota. He feels he does not belong and has stopped attending labs.", ask: "What is the most helpful response?", choices: [{ label: "Everyone gets teased in first year; try not to take it personally.", verdict: "harm", outcome: "He feels his experience was dismissed and does not return.", why: "A microinvalidation of caste discrimination." }, { label: "That sounds humiliating, and it makes sense you feel you do not belong. Can we look both at how this is affecting you and at what support or reporting options you would want?", verdict: "best", outcome: "He talks about shame and his family's pride, and decides to meet the equal opportunity cell.", why: "Validates, works on inner distress and outer injustice." }, { label: "Tell me your rank so I can see if they have a point.", verdict: "harm", outcome: "He feels interrogated about merit by the counsellor too.", why: "Repeats the microaggression." }] }, "Practice guidelines")],
    ref: "Constitution of India Arts 15, 17; SC/ST (Prevention of Atrocities) Act 1989; Meyer 2003 minority stress; Sukdeb Saha v State of AP 2025 grievance mechanisms",
  },
  {
    id: "couns-l04-005",
    subject: S,
    topic: "lgbtq-affirmative",
    marks: 10,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Describe affirmative counselling with LGBTQ+ clients. Summarise the Indian legal and professional position, including on conversion therapy, and the common issues clients bring.",
    plan: ["Affirmative stance and minority stress", "Indian legal timeline", "Professional position on conversion therapy", "Common issues in counselling", "Affirmative practice guidelines"],
    answer: `## The affirmative stance
Affirmative counselling treats lesbian, gay, bisexual, transgender, queer and other gender and sexually diverse identities as normal variations of human experience, not disorders, and addresses the stress that comes from stigma. Ilan Meyer's minority stress model explains the higher rates of depression, anxiety, substance use and suicidal thoughts in these groups: not identity itself, but external prejudice and violence, expectation of rejection, concealment and internalised stigma.

## The Indian legal position
- In NALSA versus Union of India in 2014, the Supreme Court recognised transgender persons' right to self identify their gender, including as a third gender.
- In Navtej Singh Johar versus Union of India in 2018, the Court read down section 377 of the Indian Penal Code, decriminalising consensual same sex relations between adults.
- The Transgender Persons (Protection of Rights) Act 2019 prohibits discrimination against transgender persons and provides for certificates of identity.
- In 2021 the Madras High Court, in S. Sushma versus Commissioner of Police, issued guidelines for protecting LGBTQ+ persons, including against attempts to cure sexual orientation.
- In 2023 the Supreme Court declined to legalise same sex marriage, leaving it to Parliament.
- The Mental Healthcare Act 2017 prohibits discrimination in mental health care on grounds including sexual orientation.

## Conversion therapy
Attempts to change sexual orientation or gender identity have no evidence of success and are linked to depression, shame and suicidal behaviour. In 2018 the Indian Psychiatric Society stated that homosexuality is not a mental illness. Following the Madras High Court's direction, the National Medical Commission in 2022 declared conversion therapy professional misconduct for doctors. Counsellors and psychologists should never offer it, and should refuse family requests to change a client's orientation.

## Common issues
- Coming out to oneself and to family, and family pressure to marry.
- Family rejection, forced marriage or being thrown out of home.
- Bullying in school and college, harassment and violence.
- Gender dysphoria and access to gender affirming care, documents and employment for transgender clients.
- Relationship issues, as for any couple, often without social recognition.
- Internalised shame and religious conflict.

## Affirmative practice
1. Examine one's own beliefs and biases; seek training and supervision.
2. Use the client's chosen name and pronouns; do not assume heterosexuality on intake forms.
3. Do not make identity the problem unless the client wishes to explore it.
4. Support safe decisions about coming out; disclosure is the client's choice and timing.
5. Work with families where safe, using psychoeducation.
6. Know community organisations, helplines, legal aid and gender affirming services.
7. Keep strict confidentiality, since being outed can be dangerous.

## Conclusion
Affirmative counselling recognises diverse identities as healthy, addresses minority stress and supports clients in a legal setting that has changed rapidly since 2014. Conversion practices are unethical and, for doctors, professional misconduct.`,
    keyPoints: ["Affirmative stance defined", "Minority stress model", "NALSA 2014, Navtej Johar 2018, Transgender Persons Act 2019", "Madras High Court 2021 and NMC 2022 on conversion therapy", "Indian Psychiatric Society 2018 position", "Common issues including family pressure to marry", "Practice guidelines including pronouns and confidentiality"],
    pitfalls: ["Getting the court case years wrong", "Treating identity itself as the problem"],
    module: "therapies/3-5",
    visuals: [timeline("Put the Indian legal milestones in order", [["NALSA judgment on gender identity", "2014"], ["Navtej Singh Johar reads down section 377", "2018"], ["Transgender Persons Act", "2019"], ["Madras High Court guidelines in S. Sushma", "2021"], ["NMC calls conversion therapy misconduct", "2022"]], "Rights expanded quickly after 2014, though marriage equality was not granted in 2023.")],
    ref: "NALSA v UoI (2014) 5 SCC 438; Navtej Singh Johar v UoI (2018) 10 SCC 1; Transgender Persons (Protection of Rights) Act 2019; S. Sushma v Commissioner of Police, Madras HC 2021; NMC letter 2022; IPS statement 2018; Supriyo Chakraborty v UoI 2023; MHCA s 18(2); Meyer 2003",
  },
  {
    id: "couns-l04-006",
    subject: S,
    topic: "indian-counselling",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Critically discuss the practice of counselling in India. How do Indian cultural values, family structure and help seeking patterns affect counselling, and what indigenous adaptations have been proposed?",
    plan: ["Western counselling assumptions", "Indian cultural features that matter", "Help seeking and pathways to care", "Indigenous models and adaptations", "Current status and challenges"],
    answer: `## Western assumptions
Counselling as it is usually taught grew in Europe and North America. It tends to assume an autonomous individual self, the value of verbal expression of feelings, insight as a goal, a time limited professional relationship and a counsellor who does not give advice. Indian psychiatrists and psychologists have long questioned how well these assumptions fit. Venugopal Varma, writing about psychotherapy in a third world country, noted that Indian patients are often more dependent, less psychologically minded in Western terms, and expect active guidance, and that confidentiality and individual decision making mean something different in families.

## Indian cultural features that matter
- The family self: many Indians see the self as embedded in family and community. Decisions about study, marriage and treatment are often family decisions, and family members commonly accompany the client.
- Hierarchy and respect: age and role shape communication; a client may defer to an older counsellor and find it hard to disagree.
- Somatic expression: distress is often described through the body, such as weakness, headache or burning, rather than as sadness.
- Spiritual and religious frameworks: karma, fate, dharma, planetary influences and spirit possession are common explanations, alongside medical ones.
- Duty over personal desire: the Bhagavad Gita's ideas of duty and action without attachment shape how many people think about suffering.
- Stigma and marriage: fear that a family member's mental illness will spoil marriage prospects strongly discourages help seeking.

## Help seeking and pathways to care
Studies of pathways to care in India show that many people first visit traditional or religious healers, general physicians or temples and dargahs before reaching mental health services. The tragedy at Erwadi in 2001, where people chained in a shrine died in a fire, showed the dangers of unregulated care and led to reforms. Counsellors need to respect people's beliefs while ensuring access to effective care.

## Indigenous models and adaptations
- The guru chela relationship: Jasbir Singh Neki proposed that a guru disciple model, in which the counsellor is an active, caring guide and some dependence is accepted, fits Indian clients better than a strictly neutral stance.
- Sudhir Kakar's work showed how Indian healing traditions, family dynamics and psychoanalytic ideas meet.
- Yoga, meditation and Gita based counselling draw on Indian traditions, and some have research support for stress and anxiety.
- Family involvement: Indian psychiatry, notably at NIMHANS, has long involved families in treatment and residence, and family psychoeducation is standard.
- Cultural adaptation of evidence based therapies: CBT and behavioural activation adapted with local examples, idioms and lay counsellors, as in the Healthy Activity Program in Goa.
- Integration with traditional healers, as in projects where healers were trained to recognise and refer mental illness.

## Current status and challenges
- Very few trained counsellors and psychologists for a population of over 1.4 billion, concentrated in cities.
- No single law regulating who can call themselves a counsellor; the Rehabilitation Council of India regulates clinical and rehabilitation psychologists, but many counsellors are outside regulation.
- Growth of telecounselling, including the national Tele MANAS service, and of private online platforms of variable quality.
- Rising demand in schools, colleges and workplaces, and new court and board guidelines requiring counsellors in educational institutions.

## Conclusion
Counselling in India works best when it keeps the core of good counselling, a warm, respectful and confidential relationship, while adapting to the family self, somatic and spiritual meanings and the expectation of guidance. Indigenous ideas such as the guru chela model and culturally adapted therapies point the way, but regulation and training must catch up with demand.`,
    keyPoints: ["Western assumptions of counselling", "Varma's critique", "Family self, hierarchy, somatic and spiritual expression, stigma", "Pathways to care through healers; Erwadi", "Neki's guru chela model", "Family involvement and adapted therapies such as HAP", "Workforce shortage and lack of regulation of counsellors"],
    pitfalls: ["Describing Indian clients as a single homogeneous group", "Only criticism with no adaptations"],
    module: "therapies/3-5",
    visuals: [compare("Western assumptions", ["Typical Western model", ["Autonomous individual self", "Feelings put into words", "Non directive counsellor", "Insight as the goal"], "Built on individualist values"], ["Common Indian expectations", ["Family self and joint decisions", "Distress in the body and spirit", "Active guidance welcomed", "Relief and duty fulfilled as goals"], "Adapt the method, keep the relationship"])],
    ref: "Varma 1982 Psychotherapy in a third world country; Neki 1973 Guru-chela relationship; Kakar Shamans, Mystics and Doctors; Erwadi 2001; Patel et al 2017 HAP; Tele MANAS",
  },
  {
    id: "couns-l04-007",
    subject: S,
    topic: "explanatory-models",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "mcp-entrance"],
    question: "Write a short note on Kleinman's explanatory model of illness and its use in counselling.",
    plan: ["Disease and illness", "The explanatory model questions", "Use in counselling with an example"],
    answer: `## Disease and illness
Arthur Kleinman, a psychiatrist and anthropologist, distinguished disease, the biological malfunction described by professionals, from illness, the person's lived experience of being unwell, shaped by culture. Patients and practitioners each hold an explanatory model: a set of beliefs about what the problem is, what caused it, how it works and what should be done. When the models differ and this is not discussed, clients are less satisfied and less likely to follow advice.

## The questions
Kleinman suggested asking, in the client's language:
1. What do you call the problem? What name does it have?
2. What do you think has caused it?
3. Why do you think it started when it did?
4. What does the problem do to you? How does it work?
5. How severe is it? Will it last a short or long time?
6. What kind of treatment do you think you should receive, and what results do you hope for?
7. What are the main problems it has caused you?
8. What do you fear most about it?

## Use in counselling
A mother brings her 16 year old son who has stopped eating and talking since his grandfather died. She calls it "nazar", the evil eye, and has taken him to a healer. Instead of dismissing this, the counsellor explores her model, explains grief and depression in words that fit with it, and negotiates a plan that includes counselling and medical review alongside family prayers. Eliciting the explanatory model builds trust, reveals fears and allows a shared plan. The DSM 5 Cultural Formulation Interview builds on these questions.`,
    keyPoints: ["Disease versus illness", "Explanatory models of client and practitioner", "The eight questions", "Mismatch reduces satisfaction and adherence", "Negotiating a shared plan", "Link to the Cultural Formulation Interview"],
    pitfalls: ["Dismissing the client's model", "Listing only two or three questions"],
    module: "therapies/3-5",
    visuals: [vis("worked", { title: "Use in counselling", steps: [{ q: "What do you call the problem?", a: "Mother: nazar, someone's evil eye after the funeral." }, { q: "What do you fear most about it?", a: "That he will never be normal and people will talk." }, { q: "What treatment do you hope for?", a: "Prayers, and something to make him eat. The counsellor builds a plan that includes both prayers and a medical and counselling review." }] })],
    ref: "Kleinman, Eisenberg and Good 1978 Ann Intern Med; Kleinman 1980; DSM-5 Cultural Formulation Interview",
  },
  {
    id: "couns-l04-008",
    subject: S,
    topic: "counselling-ethics",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Discuss the major ethical principles and issues in counselling: informed consent, confidentiality and its limits, competence, dual relationships and record keeping. Describe a model for ethical decision making.",
    plan: ["Ethical principles", "Informed consent", "Confidentiality and its limits", "Competence, dual relationships and records", "A decision making model", "The Indian regulatory context"],
    answer: `## Ethical principles
Karen Kitchener drew on bioethics to describe the principles behind counselling ethics:
- Autonomy: respecting the client's right to make their own choices.
- Beneficence: acting for the client's good.
- Non maleficence: above all, doing no harm.
- Justice: fairness and equal access, without discrimination.
- Fidelity: keeping promises and being trustworthy.
Veracity, truthfulness, is often added. Codes of ethics turn these principles into rules, but real dilemmas often involve a clash between principles.

## Informed consent
Before counselling begins, the client should understand and agree to:
- What counselling involves, its likely benefits and risks, and alternatives.
- The counsellor's qualifications and approach.
- Fees, number and length of sessions, and cancellation rules.
- The limits of confidentiality.
- The right to refuse or stop at any time.
Consent is a continuing process, revisited when methods change. With children, the parent consents and the child should assent. Clients whose capacity is impaired need special care, and in India the Mental Healthcare Act 2017 sets out how capacity and consent are assessed for treatment.

## Confidentiality and its limits
Confidentiality is the duty not to disclose what the client shares. Privileged communication, a legal protection from disclosure in court, is narrower and limited in India. Exceptions include:
- Risk of serious harm to the client, such as imminent suicide.
- Risk of serious harm to identifiable others, the duty to protect developed after the Tarasoff case in California.
- Child abuse, which must be reported under the POCSO Act.
- Court orders.
- Consent of the client to share, for example with family or another professional.
The Mental Healthcare Act 2017 gives persons with mental illness a right to confidentiality of their information. Counsellors should share only what is necessary and inform the client where possible.

## Competence, dual relationships and records
- Competence: practise only within the limits of one's training and experience, seek supervision and refer when needed. A counsellor without training in trauma or eating disorders should refer.
- Dual relationships: having a second relationship with a client, such as friend, business partner, employer or relative, risks exploitation and loss of objectivity. Sexual relationships with clients are always unethical. In small communities some overlap is unavoidable and must be managed openly.
- Records: keep accurate, dated, secure records of sessions, consent and risk decisions; store them safely, whether on paper or electronically, and follow data protection law, including the Digital Personal Data Protection Act 2023.

## A decision making model
1. Identify the problem and whether it is ethical, legal, clinical or a mix.
2. Identify the relevant principles, codes and laws.
3. Consult supervisors or colleagues.
4. Generate possible actions.
5. Consider the consequences of each for the client and others.
6. Choose, act and document the reasoning.
7. Evaluate the outcome.
A helpful test is whether the counsellor would be comfortable if the decision were reported publicly, applied to all similar cases and reviewed by peers.

## The Indian regulatory context
The Rehabilitation Council of India regulates clinical psychologists, rehabilitation psychologists and other rehabilitation professionals, who must register and follow its code of conduct. Many counsellors, however, are not covered by any statutory regulator, so professional associations' codes and the general law, including the Mental Healthcare Act, the POCSO Act and data protection law, are their main guides.

## Conclusion
Ethical counselling rests on autonomy, beneficence, non maleficence, justice and fidelity. Informed consent, careful confidentiality, competence, clear boundaries and good records protect clients, and a structured decision making model helps when principles conflict.`,
    keyPoints: ["Kitchener's five principles plus veracity", "Elements of informed consent and assent for minors", "Confidentiality versus privileged communication", "Exceptions including Tarasoff and POCSO", "MHCA right to confidentiality", "Competence, dual relationships, records and DPDP", "A step by step decision model", "RCI regulates some but not all counsellors"],
    pitfalls: ["Saying confidentiality is absolute", "No decision making model", "Ignoring Indian law"],
    module: "ethics-law/1-4",
    visuals: [
      tree("Ethical principles", [["Counselling ethics", "Kitchener's principles", -1], ["Autonomy", "The client's right to choose", 0], ["Beneficence", "Act for the client's good", 0], ["Non maleficence", "Do no harm", 0], ["Justice", "Fairness and equal access", 0], ["Fidelity", "Keep promises, be trustworthy", 0]]),
      chain("A decision making model", [["Identify the problem", "Ethical, legal or clinical"], ["Principles and laws", "Codes, MHCA, POCSO"], ["Consult", "Supervisor or peer"], ["Options and consequences", "For client and others"], ["Act and record", "Write the reasoning"], ["Evaluate", "What happened?"]]),
    ],
    ref: "Kitchener 1984; Tarasoff v Regents 1976; MHCA 2017 ss 4, 23; POCSO 2012 s 19; DPDP Act 2023; RCI Act 1992",
  },
  {
    id: "couns-l04-009",
    subject: S,
    topic: "boundaries-and-dual-roles",
    marks: 10,
    difficulty: 3,
    exams: ["ma-semester", "mcp-entrance", "ugc-net"],
    question: "Distinguish boundary crossings from boundary violations in counselling. Discuss dual relationships, gifts, touch and social media, with examples from Indian settings.",
    plan: ["What boundaries are for", "Crossings versus violations and the slippery slope", "Dual relationships including in small communities", "Gifts, touch, social media", "How to manage boundary questions"],
    answer: `## What boundaries are for
Boundaries are the limits that define the counselling relationship: time, place, money, physical contact, self disclosure, communication and roles. They protect the client from exploitation, keep the focus on the client and make the relationship safe and predictable.

## Crossings versus violations
Thomas Gutheil and Glen Gabbard made an influential distinction:
- A boundary crossing is a departure from usual practice that is harmless and may even help, such as attending a client's graduation, accepting a small sweet box at Diwali or extending a session when a client is in crisis.
- A boundary violation is a departure that harms the client or exploits them for the counsellor's benefit, such as borrowing money, sexual contact or using the client for business.
The slippery slope concern is that small crossings, unexamined, can gradually lead to violations: extended sessions become social chats, then meetings outside, then a personal relationship. Arnold Lazarus argued the opposite risk too: rigid boundaries can make counselling cold and unhelpful.

## Dual relationships
A dual relationship exists when the counsellor has a second role with the client, such as teacher, employer, relative, landlord or friend. They are risky because of power imbalance and conflicts of interest. Sexual relationships with current clients are always unethical, and most codes prohibit them with former clients for long periods or permanently.
In India dual relationships are sometimes unavoidable: a school counsellor may also teach the student; a counsellor in a small town may meet clients at weddings, temples or the market; a client may be referred by a relative. The counsellor should discuss the overlap openly, agree how to handle chance meetings, keep the counselling role separate and refer when the conflict is too great.

## Gifts, touch and social media
- Gifts: small culturally appropriate tokens, such as sweets at festivals, are usually acceptable crossings; expensive gifts, money or ongoing gifts should be declined gently and the meaning explored.
- Touch: a handshake or a hand on the shoulder in grief may be acceptable with consent, but touch can be misunderstood, especially across gender and with trauma survivors. When in doubt, do not touch.
- Social media: accepting a client's friend request blurs roles and exposes both to each other's private lives. Many counsellors have a written policy that they do not connect with clients on personal accounts, and use professional channels only for appointments.
- Messaging: WhatsApp contact between sessions should be limited to scheduling, with an agreed crisis plan.

## Managing boundary questions
1. Ask whose needs the action serves.
2. Consider power, culture and the client's history.
3. Discuss in supervision.
4. Document the decision and the reasons.
5. Explore the meaning with the client.

## Conclusion
Boundaries make counselling safe. Crossings can be harmless or helpful when thought through, but violations exploit and harm. In Indian settings, where roles often overlap, open discussion, supervision and careful documentation are the safeguards.`,
    keyPoints: ["Purpose of boundaries", "Gutheil and Gabbard: crossing versus violation", "Slippery slope and Lazarus' counterpoint", "Dual relationships; sexual contact always unethical", "Unavoidable overlaps in Indian small communities", "Gifts, touch, social media and messaging", "Whose needs, supervision and documentation"],
    pitfalls: ["Treating every crossing as a violation", "Ignoring cultural norms such as festival sweets"],
    module: "ethics-law/1-4",
    visuals: [vis("sort", { prompt: "Crossing or violation?", buckets: ["Boundary crossing", "Boundary violation"], items: [{ text: "Accepting a small box of sweets at Diwali", bucket: 0 }, { text: "Borrowing money from a client", bucket: 1 }, { text: "Attending a client's graduation after discussing it", bucket: 0 }, { text: "Hiring a client to work in the counsellor's family business", bucket: 1 }, { text: "Romantic messages to a client", bucket: 1 }] }, "Crossings versus violations")],
    ref: "Gutheil and Gabbard 1993; Lazarus 1994; Zur on dual relationships in small communities",
  },
  {
    id: "couns-l04-010",
    subject: S,
    topic: "online-counselling",
    marks: 10,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Discuss the benefits, risks and ethical requirements of online counselling in India. What does the evidence say about its effectiveness?",
    plan: ["Forms of online counselling", "Benefits", "Risks and ethical issues", "Practical requirements", "Evidence and Indian services"],
    answer: `## Forms
Online counselling includes video sessions, phone counselling, chat and email, and guided self help programmes on apps or websites. It grew rapidly during the COVID 19 pandemic and is now part of routine practice in India, from private platforms to the government's Tele MANAS service.

## Benefits
- Access for people in rural areas, small towns and places with no counsellors.
- Less travel, time and cost.
- Privacy for those who fear being seen at a clinic.
- Continuity when clients move for study or work.
- Comfort for some clients, such as adolescents, who find it easier to talk from home or by text.

## Risks and ethical issues
- Confidentiality: others at home may overhear; data may be stored insecurely on apps and devices.
- Identity and age: the counsellor may not be sure who the client is or whether a minor is involved without consent.
- Emergencies: the counsellor may be far away when a client becomes suicidal.
- Loss of non verbal cues, especially in chat and audio sessions, making risk assessment harder.
- Technology failures in the middle of difficult conversations.
- Boundaries: easy messaging can lead to round the clock contact.
- Competence and jurisdiction: counselling clients in other states or countries, and platforms employing staff without proper training.
- Digital divide: poorer, older and rural clients may lack devices, data or privacy.

## Practical requirements
1. Informed consent that covers the online format, its risks and limits of confidentiality.
2. Verifying the client's identity and age, and obtaining parental consent for minors where required.
3. Recording the client's location and an emergency contact at each session, and having a crisis plan with local services and Tele MANAS, 14416.
4. Using secure, encrypted platforms and protecting records; the Digital Personal Data Protection Act 2023 requires consent and reasonable security safeguards for personal data, with special protection for children's data.
5. Agreeing rules for messaging and response times.
6. Assessing suitability: clients at high risk or with severe illness may need in person care.
Note that the Telemedicine Practice Guidelines of 2020 apply to registered medical practitioners, such as psychiatrists, rather than to counsellors, but their principles of consent, identification and documentation are useful.

## Evidence
- Meta-analyses comparing internet delivered or video CBT with face to face CBT for depression and anxiety find broadly equivalent outcomes.
- Guided internet programmes with some therapist support work better than unguided ones, which have high drop out.
- The alliance in video counselling is generally rated similar to face to face.
- Tele MANAS, launched in October 2022, has received several lakh calls, showing large unmet need.

## Conclusion
Online counselling can be as effective as face to face for many problems and greatly widens access, but it requires specific attention to consent, privacy, identity, emergencies and data protection.`,
    keyPoints: ["Forms: video, phone, chat, guided programmes", "Access and privacy benefits", "Risks: confidentiality, identity, emergencies, cues, boundaries", "Consent, location, emergency plan", "DPDP Act 2023 safeguards and children's data", "Telemedicine guidelines apply to doctors", "Evidence of equivalence with face to face; guided better than unguided"],
    pitfalls: ["Assuming online counselling is always inferior", "Forgetting emergency planning"],
    module: "ethics-law/2-5",
    visuals: [vis("decide", { scene: "During a video session a 19 year old client says she has taken extra tablets and then her connection drops.", ask: "What should the counsellor do first?", choices: [{ label: "Wait for her to reconnect next week.", verdict: "harm", outcome: "A medical emergency is missed.", why: "Possible overdose needs immediate action." }, { label: "Call her back, and if not reached, call the emergency contact and local services using the location recorded at the start of the session.", verdict: "best", outcome: "Her roommate finds her and takes her to hospital.", why: "The emergency plan made at the start makes action possible." }, { label: "Send a chat message asking her to call when free.", verdict: "ok", outcome: "She reads it hours later.", why: "Too slow for a possible overdose." }] }, "Practical requirements")],
    ref: "Andersson et al 2014 World Psychiatry ICBT vs face to face; Telemedicine Practice Guidelines 2020 (Board of Governors, MCI); DPDP Act 2023 ss 8, 9; Tele MANAS launched 10 October 2022",
  },
]);
