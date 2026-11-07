import type { InterviewQuestion } from "@/lib/prep/types";
import { ivkit } from "../qb5-kit";

/** Mock interview bank · current affairs in Indian mental health. Facts dated "as of Nov 2026". Ordered foundation to advanced. */
const iv = ivkit("current-affairs", ["mcp-entrance"]);

const ITEMS: InterviewQuestion[] = [
  iv("iv-ca-001", 1,
    "What is Tele-MANAS? How does it work? (As of November 2026.)",
    [
      "What are the two tiers of the service?",
      "Which institution is the nodal centre?",
      "How could a clinical psychologist contribute to it?",
    ],
    "Tele-MANAS, which stands for Tele Mental Health Assistance and Networking Across States, is India's national tele-mental health programme. It was announced in the Union Budget of 2022 and launched on World Mental Health Day, 10 October 2022. Anyone can call the toll-free number 14416, or 1-800-891-4416, free of charge, at any time, in several Indian languages. It works in two tiers. In tier one, trained counsellors in state Tele-MANAS cells take the calls, give psychological first aid and basic counselling, and assess risk. In tier two, callers who need more help are connected to mental health specialists, such as psychologists and psychiatrists, for consultation, including video consultation through e-Sanjeevani, or referred for in-person care at district mental health programme services or medical colleges. NIMHANS, Bengaluru, is the nodal centre, with technical support from IIIT Bangalore, and a mobile app has also been launched. As of October 2026, the Health Ministry reported about 47.75 lakh calls since launch, through 53 cells covering all 36 states and union territories. Common concerns include emotional distress, exam, work and relationship stress, anxiety and sleep problems. Clinical psychologists can contribute as tier-two specialists, as trainers and supervisors of counsellors, and through research on outcomes.",
    [
      "Full form, launch date and helpline numbers",
      "Two-tier structure with referral pathways",
      "NIMHANS as nodal centre and technical partner",
      "Dated usage figures",
      "Role for clinical psychologists",
    ],
    [
      "Confusing Tele-MANAS with MANAS (1933), the NCB drug helpline",
      "Undated or invented figures",
    ]),

  iv("iv-ca-002", 3,
    "Critically evaluate Tele-MANAS. What are its strengths and its limits?",
    [
      "How would you measure whether it works?",
      "What are the risks of telephone-only crisis support?",
      "How does it connect with face-to-face services?",
    ],
    "Its strengths are reach, cost and access. A free, round-the-clock, multilingual number lowers barriers such as distance, cost and stigma, especially for people in rural areas and young people who may not visit a clinic. By October 2026 it had handled nearly 48 lakh calls through cells in all states and union territories, which shows demand. It uses a stepped model, offering simple help for many callers and specialist referral for some, and it links with e-Sanjeevani and district services, which fits a public health approach. Its limits are also real. A helpline cannot replace continuous care, so the key question is whether callers actually reach and stay in treatment after referral, and the district services they are referred to are often understaffed. The quality and supervision of tier-one counsellors, and how well they manage high-risk calls, need monitoring. Language coverage, digital literacy, phone access for women, and awareness of the number remain uneven. Data privacy needs strong protection under the DPDP Act. And there is limited published evaluation of outcomes such as distress reduction, suicide prevention or linkage to care. I would evaluate it using routine data on call outcomes and referrals, follow-up surveys of callers with consent, and comparisons across districts over time.",
    [
      "Strengths: reach, cost, stigma reduction and stepped care",
      "Dated scale of use",
      "Limits: continuity, district capacity, counsellor quality, equity",
      "Data privacy",
      "Evaluation approach",
    ],
    [
      "Only praise or only criticism",
      "No evidence or numbers",
    ]),

  iv("iv-ca-003", 2,
    "Trace the history of the National Mental Health Programme and the District Mental Health Programme.",
    [
      "What was the Bellary model?",
      "What did the National Mental Health Policy of 2014 add?",
      "How many districts does the DMHP cover now?",
    ],
    "The National Mental Health Programme was launched in 1982, with the aims of ensuring minimum mental health care for all, especially the most vulnerable, encouraging the application of mental health knowledge in general health care and social development, and promoting community participation. A key idea was integrating mental health into primary care. Its district-level approach grew from the Bellary model in Karnataka in the mid-1980s, where NIMHANS showed that trained primary care staff could identify and manage common and severe mental disorders in a district. This led to the District Mental Health Programme, launched in 1996, which provides outpatient and inpatient services, community outreach, training of general health staff, awareness, and supply of essential medicines in each district. Later phases added suicide prevention, school and college mental health, workplace stress management and counselling services. The National Mental Health Policy of 2014 set out a rights-based, recovery-oriented vision and emphasised reducing the treatment gap, which then shaped the MHCA 2017. As of 2026, the DMHP is sanctioned in about 767 districts under the National Health Mission, and mental health screening is being integrated into more than 1.8 lakh Ayushman Arogya Mandirs, along with Tele-MANAS for remote support. The main problems remain staffing shortages and uneven implementation across states.",
    [
      "NMHP 1982 and its aims",
      "Bellary model",
      "DMHP 1996 and its components",
      "2014 policy",
      "Current coverage and challenges, dated",
    ],
    [
      "Wrong launch years",
      "No mention of integration with primary care",
    ]),

  iv("iv-ca-004", 3,
    "How well has the Mental Healthcare Act 2017 been implemented? What are the main gaps?",
    [
      "Have all states set up Mental Health Review Boards?",
      "What problems do patients face in accessing their rights?",
      "What can clinical psychologists do to support implementation?",
    ],
    "The MHCA 2017, in force since 29 May 2018, is a progressive, rights-based law aligned with the UN Convention on the Rights of Persons with Disabilities. It gives every person a right to access mental health care, introduces advance directives and nominated representatives, sets strict rules for admission and restraint, and decriminalised attempted suicide in practice through Section 115. However, implementation has been uneven. Many states were slow to set up State Mental Health Authorities and Mental Health Review Boards, and the courts, including the Supreme Court, have had to push governments to constitute and fund them. Where Boards exist, they often cover large areas with limited staff, so reviews of admissions may be delayed. Few people know about or use advance directives. Registration of mental health establishments, including private rehabilitation and de-addiction centres, is incomplete, and illegal practices such as chaining and forced admission still occur in some places. The right to affordable care under Section 18 is limited by the shortage of professionals and services, especially outside cities. Clinical psychologists can support implementation by registering with their State Authority, following the Act's consent and capacity rules, informing clients and families of their rights, helping patients make advance directives, reporting violations, and taking part in Boards and policy research.",
    [
      "Key provisions and date in force",
      "Gaps in Authorities and Review Boards",
      "Low uptake of advance directives",
      "Unregistered establishments and rights violations",
      "Service shortage and the psychologist's role",
    ],
    [
      "Claiming full implementation",
      "Not knowing key provisions",
    ]),

  iv("iv-ca-005", 2,
    "What is the National Suicide Prevention Strategy? What are its targets?",
    [
      "What is the suicide rate in India according to recent NCRB data?",
      "Why is pesticide regulation part of suicide prevention?",
      "What is responsible media reporting?",
    ],
    "India announced its first National Suicide Prevention Strategy in November 2022. Its main target is to reduce suicide mortality by 10% by 2030, compared with 2020 levels, in line with the Sustainable Development Goals. It sets out a timeline: establishing effective surveillance of suicides within three years, setting up psychiatric outpatient services that provide suicide prevention services through the district mental health programme in all districts within five years, and integrating a mental well-being curriculum in all educational institutions within eight years. It also calls for responsible media reporting guidelines and for restricting access to means of suicide, especially highly hazardous pesticides, which are a common method of suicide in rural India. Means restriction works because suicidal crises are often brief, and when lethal means are not at hand, many people survive the crisis. NCRB data for 2022 recorded about 1.71 lakh suicides, a rate of about 12.4 per lakh population, with family problems and illness as leading reported causes, and over 13,000 student suicides. The strategy takes a multisectoral approach, involving health, education, agriculture, media and community groups. As clinical psychologists, we can contribute through risk assessment, evidence-based treatment, gatekeeper training for teachers and health workers, and research.",
    [
      "Year of the strategy and the 10% by 2030 target",
      "Timelines for surveillance, services and school curricula",
      "Means restriction including pesticides",
      "Responsible media reporting",
      "Dated NCRB data and psychologist's role",
    ],
    [
      "Wrong year or target",
      "No mention of means restriction",
    ]),

  iv("iv-ca-006", 3,
    "What did the Supreme Court say about student mental health in 2025, and what has the National Task Force reported?",
    [
      "What are the Sukdeb Saha guidelines?",
      "What did the task force's survey find?",
      "How would you set up a college counselling service in line with these?",
    ],
    "In March 2025, the Supreme Court constituted a National Task Force on student mental health and suicides in higher education institutions, chaired by former Supreme Court judge Justice S. Ravindra Bhat, after a series of student suicides. Then in July 2025, in Sukdeb Saha versus the State of Andhra Pradesh, the Court issued fifteen interim guidelines binding on all educational institutions, including coaching centres, until a law is made. These require a mental health policy, at least one qualified counsellor, psychologist or social worker where there are 100 or more students, display of helplines such as Tele-MANAS, staff training twice a year, confidential reporting of ragging, harassment and discrimination, and a ban on segregating students by performance or publicly shaming them. The Court also linked mental health to the right to life under Article 21. As of mid-2026, the task force had surveyed about 2.43 lakh students and over 2,100 institutions. It reported that about 65% of institutions give students no access to mental health services, 73% lack a full-time mental health professional, and fewer than 4% have suicide-risk protocols, while about 9% of students reported frequent suicidal thoughts. Its final report was due by October 2026. A good college service would combine trained counsellors, clear crisis protocols, referral links, peer support, and work on academic pressure and discrimination.",
    [
      "Task force: date, chair and purpose",
      "Sukdeb Saha guidelines with key provisions",
      "Article 21 link",
      "Dated task force findings",
      "Practical service design",
    ],
    [
      "Confusing the task force with the guidelines",
      "Undated statistics",
    ]),

  iv("iv-ca-007", 2,
    "What did the first National Mental Health Survey find, and what is the second survey doing differently?",
    [
      "What is the treatment gap?",
      "Which disorders were most common?",
      "Why do children and adolescents need to be included?",
    ],
    "The first National Mental Health Survey was carried out in 2015 to 2016 by NIMHANS for the Health Ministry, across 12 states. It estimated that about 10.6% of adults had a current mental disorder and about 13.7% had experienced one during their lifetime, apart from tobacco use. Common mental disorders such as depression and anxiety, and substance use disorders, especially alcohol, were among the most frequent, and prevalence was higher in urban metropolitan areas for several disorders. The most striking finding was the treatment gap: depending on the disorder, roughly 70% to over 90% of people did not receive treatment, for example about 85% for common mental disorders. It also found large disability and economic costs. The second National Mental Health Survey, planned for 2025 to 2026 and led again by NIMHANS, covers all 36 states and union territories rather than 12, using multi-stage stratified random cluster sampling, with five districts per state chosen using socio-economic indicators, including tribal populations. It includes adults, adolescents aged 13 to 17, and children aged 7 to 12 with parental input, because many disorders begin before adulthood and earlier data on children were limited. Its results will be important for planning services and for tracking progress since the MHCA and Tele-MANAS.",
    [
      "NMHS-1 timing, coverage and prevalence figures",
      "Treatment gap",
      "Common disorders",
      "NMHS-2 coverage and design",
      "Inclusion of children and adolescents",
    ],
    [
      "Wrong prevalence figures",
      "Not knowing the treatment gap",
    ]),

  iv("iv-ca-008", 2,
    "What mental health announcements were made in the Union Budget 2026 to 2027?",
    [
      "Why is a second national institute needed?",
      "What does upgrading Ranchi and Tezpur mean?",
      "How would this affect training of clinical psychologists?",
    ],
    "In the Union Budget for 2026 to 2027, presented on 1 February 2026, the Finance Minister announced a second National Institute of Mental Health and Neuro Sciences, often called NIMHANS-2, noting that north India has no national mental health institute. She also announced that the existing national mental health institutes at Ranchi and Tezpur, which are the Central Institute of Psychiatry and the Lokopriya Gopinath Bordoloi Regional Institute of Mental Health, would be upgraded as regional apex centres. The Budget also expanded emergency and trauma care in district hospitals. A second national institute matters because specialist services, training and research are concentrated in a few places, mainly in the south, while the population need is spread across the country. Patients from northern states often travel long distances. For training, more national institutes and upgraded regional centres should increase the number of seats for clinical psychology, psychiatry, psychiatric social work and nursing, which is crucial given the shortage of professionals, and improve research capacity. The details of the location, timeline and funding were still being worked out as of late 2026, so I would follow official notifications. For future clinical psychologists, it could mean more training and job opportunities in north and north-east India.",
    [
      "Budget date and NIMHANS-2 announcement",
      "Ranchi and Tezpur upgrades with the institutes named",
      "Rationale based on regional gaps",
      "Implications for training and workforce",
      "Caveat about details, as of Nov 2026",
    ],
    [
      "Inventing the location or funding",
      "Not knowing which institutes are at Ranchi and Tezpur",
    ]),

  iv("iv-ca-009", 2,
    "What changes have happened to the M.Phil in Clinical Psychology in recent years?",
    [
      "What is the eligibility for the new programme?",
      "What is a bridge course?",
      "Does the title change affect RCI registration?",
    ],
    "The M.Phil was phased out after NEP 2020. The UGC's 2022 regulations stopped awarding M.Phil degrees, and after some uncertainty, the UGC allowed M.Phil Clinical Psychology to continue only until the 2025 to 2026 session. Meanwhile, in August 2024, the RCI announced a two-year M.A. Clinical Psychology in a 'four plus two' model from 2025 to 2026, for students with a four-year undergraduate degree in psychology. Students with a three-year degree could become eligible through a bridge course or by completing the first year of a master's in psychology. Then, through an Office Memorandum dated 3 May 2026, after its General Council meeting, the RCI renamed the M.A. Clinical Psychology as the Master in Clinical Psychology, M.Clin.Psy, and the B.Sc. Clinical Psychology as the Bachelor in Clinical Psychology. The new title applies from when the courses started, so it does not affect the recognition of those already enrolled. The M.Clin.Psy leads to registration as a clinical psychologist on the Central Rehabilitation Register. Some institutes still ran M.Phil cycles in 2025. For applicants, it means checking each institute's current eligibility rules carefully, since they vary in 2026.",
    [
      "M.Phil phase-out timeline",
      "RCI 2024 four-plus-two model and bridge courses",
      "May 2026 renaming to M.Clin.Psy",
      "Registration implications",
      "Advice to check institute rules",
    ],
    [
      "Saying the M.Phil continues indefinitely",
      "Not knowing the new title",
    ]),

  iv("iv-ca-010", 3,
    "What are the opportunities and risks of mental health apps and AI chatbots?",
    [
      "Should a chatbot handle suicidal users?",
      "How would you judge whether an app is evidence-based?",
      "What does the DPDP Act mean for such apps?",
    ],
    "Digital mental health tools can increase access, especially for young people and in areas with few professionals. Apps can deliver psychoeducation, mood tracking, guided CBT exercises, mindfulness and reminders, at low cost and without stigma, and some guided digital CBT programmes have good trial evidence for mild to moderate depression and anxiety. AI chatbots based on large language models can offer immediate, responsive conversation at any time. But there are serious risks. Most apps have little or no evidence behind them, and engagement often drops quickly. Chatbots can give wrong or harmful advice, fail to recognise or respond safely to suicidal statements, reinforce delusions, or create unhealthy dependence, and there have been worrying reports of harm internationally. Privacy is a major concern, since mental health data are highly sensitive. Under India's Digital Personal Data Protection Act 2023 and its rules notified in November 2025, apps must collect data only with clear consent for a specific purpose, keep it secure, and get verifiable parental consent for users under 18. To judge an app, I would ask: is it based on an established therapy, has it been tested in trials, who developed it, how does it handle crises, and what happens to the data? A chatbot should never be the only response to suicide risk, and should direct users to human help such as Tele-MANAS.",
    [
      "Opportunities: access, cost, stigma",
      "Evidence base and engagement problems",
      "Specific chatbot risks including crisis handling",
      "DPDP Act duties including children's data",
      "Criteria for judging tools and human backup",
    ],
    [
      "Uncritical enthusiasm or blanket rejection",
      "Ignoring privacy",
    ]),

  iv("iv-ca-011", 3,
    "How does the Digital Personal Data Protection Act affect clinical psychologists?",
    [
      "What is a data fiduciary?",
      "What should you do if your client records are hacked?",
      "Does the Act replace MHCA confidentiality?",
    ],
    "The Digital Personal Data Protection Act 2023 governs the processing of digital personal data in India, and its rules were notified in November 2025, with phased implementation over about 12 to 18 months. A clinical psychologist or clinic that collects and stores client information digitally, such as electronic records, online forms, teletherapy recordings or apps, acts as a data fiduciary. The main duties are these. Data must be processed only for a lawful, specific purpose with the person's free, informed consent, given through a clear notice, and consent can be withdrawn. Only necessary data should be collected, kept accurate, and deleted when no longer needed. Reasonable security safeguards are required, such as encryption and access controls. Personal data breaches must be reported to the Data Protection Board and to affected people. Processing children's data, meaning anyone under 18, needs verifiable parental consent, and tracking or targeted advertising to children is restricted. Penalties can be up to 250 crore rupees. The Act does not create a separate category of sensitive health data, but it does not replace other laws. The MHCA's confidentiality provisions under Section 23 still apply, as do professional ethics. In practice, I would use secure platforms, clear consent forms, limited access, and a breach response plan.",
    [
      "Act and rules with dates",
      "Psychologist or clinic as data fiduciary",
      "Consent, minimisation, security and deletion",
      "Breach reporting and children's data",
      "Relationship with MHCA confidentiality and practical steps",
    ],
    [
      "Saying the Act does not apply to small clinics",
      "Thinking it replaces the MHCA",
    ]),

  iv("iv-ca-012", 2,
    "How is mental health being integrated into primary care in India?",
    [
      "What is task sharing?",
      "What is the role of ASHAs?",
      "What are Ayushman Arogya Mandirs?",
    ],
    "Because specialists are so few, India's strategy relies on bringing mental health care into primary health care. Under Ayushman Bharat, sub-centres and primary health centres were upgraded into Health and Wellness Centres, renamed Ayushman Arogya Mandirs, which provide a comprehensive package of primary care that includes mental, neurological and substance use disorders. According to the Health Ministry in October 2026, more than 1.83 lakh of these centres integrate mental health screening, support, follow-up and referral. Community health officers, ASHAs and other health workers are trained to screen for conditions such as depression and anxiety, provide basic counselling and psychoeducation, support adherence for people with severe mental illness, and refer to the district mental health programme or Tele-MANAS. This is task sharing: giving specific, well-defined tasks to less specialised workers, with training and supervision from specialists. Indian research has shown that lay counsellors can effectively deliver brief psychological treatments for depression and harmful drinking in primary care. The challenges are training quality, supervision, workload, stigma, and reliable supply of medicines. Clinical psychologists have a key role in designing training, supervising non-specialist workers, developing simple protocols and evaluating outcomes.",
    [
      "Rationale based on workforce shortage",
      "Ayushman Arogya Mandirs with dated figure",
      "Roles of ASHAs and community health officers",
      "Task sharing and Indian evidence",
      "Challenges and psychologists' role",
    ],
    [
      "Not knowing what task sharing means",
      "Thinking only psychiatrists can provide care",
    ]),

  iv("iv-ca-013", 3,
    "What do recent NCRB data tell us about suicide in India, and how should we read them?",
    [
      "Why are official suicide figures likely to be underestimates?",
      "What are the main reported causes?",
      "How should these data shape prevention?",
    ],
    "The NCRB's Accidental Deaths and Suicides in India report for 2022 recorded about 1.71 lakh suicides, the highest number recorded until then, with a rate of about 12.4 per lakh population. Family problems and illness were the most commonly reported causes, followed by causes such as drug and alcohol use, marriage-related issues, unemployment and financial problems. Daily wage earners formed the largest occupational group, and over 13,000 students died by suicide, about 7.6% of the total. These data are useful but must be read carefully. They are likely underestimates, because of stigma, legal fears that existed when attempts were criminalised, misclassification as accidents, and weak death registration in some areas. The reported causes are based on police records and are usually a single cause, while suicide is almost always the result of several interacting factors, including mental disorders, which are under-recorded. Rates vary greatly between states. For prevention, the data highlight vulnerable groups such as daily wage earners, farmers, students and young women, and the importance of addressing social and economic stress along with mental health care, means restriction such as pesticide control, and better surveillance, which is one aim of the National Suicide Prevention Strategy. I would check whether newer NCRB data have been released, since these figures are from 2022.",
    [
      "Dated figures and rate",
      "Reported causes and groups at risk",
      "Reasons for underestimation",
      "Single-cause recording limitation",
      "Implications for prevention, with a currency caveat",
    ],
    [
      "Treating reported causes as the full explanation",
      "No date for the figures",
    ]),

  iv("iv-ca-014", 2,
    "What are the most important recent changes in diagnostic systems that a clinical psychologist should know?",
    [
      "What is new in DSM-5-TR compared with DSM-5?",
      "Which ICD-11 changes affect personality disorder diagnosis?",
      "Why does India need to keep both in mind?",
    ],
    "Two major updates came in 2022. The DSM-5-TR, published by the American Psychiatric Association, was a text revision of DSM-5. It added prolonged grief disorder, with a requirement of at least 12 months since the death for adults, added codes for suicidal behaviour and non-suicidal self-injury, updated text on prevalence, culture and gender, and changed some wording, such as 'intellectual developmental disorder'. It also gave more attention to racism and discrimination in diagnosis. ICD-11, from the WHO, came into effect in January 2022. Its key changes include a dimensional model of personality disorder based on severity, with trait domain qualifiers and an optional borderline pattern; complex PTSD as a separate diagnosis; prolonged grief disorder after six months; gaming disorder; and moving gender incongruence out of the mental disorders chapter. It also has clinical descriptions and diagnostic requirements designed for use in diverse settings. India uses ICD coding for official health statistics and records, while DSM criteria are widely used in teaching and research, so clinicians need to know both and recognise where they differ, for example in the time criteria for prolonged grief and the existence of complex PTSD.",
    [
      "DSM-5-TR 2022 key additions",
      "ICD-11 2022 key changes",
      "Specific differences such as grief timing and complex PTSD",
      "Indian relevance of both",
    ],
    [
      "Saying ICD-11 is not yet in use",
      "Confusing the two systems' timelines for grief",
    ]),

  iv("iv-ca-015", 4,
    "Tell us about a recent development in psychiatric treatment that interests you.",
    [
      "Why is a new mechanism of action important?",
      "What are the limits of early trial evidence?",
      "How does this relate to psychological care?",
    ],
    "One development I find interesting is the approval in September 2024, by the US Food and Drug Administration, of a combination of xanomeline and trospium for schizophrenia. It is important because it is the first antipsychotic in decades that does not work mainly by blocking dopamine D2 receptors. Xanomeline stimulates muscarinic receptors in the brain, particularly M1 and M4, which indirectly reduces dopamine activity in the relevant pathways, while trospium blocks muscarinic receptors outside the brain to reduce side effects like nausea. In trials, it reduced positive and negative symptoms, with fewer of the movement and weight-related side effects of older drugs. A new mechanism matters because many patients do not respond well to existing drugs or stop them because of side effects. But I would be cautious: the trials were relatively short, long-term effectiveness and safety are still being studied, and it was not yet available in India as far as I know. Another area of debate is psychedelic-assisted therapy. In August 2024, the FDA declined to approve MDMA-assisted therapy for PTSD, asking for more evidence because of concerns about trial design and safety. For clinical psychologists, these developments matter because medication works best alongside psychological care and rehabilitation, and because assisted therapies place psychotherapy at the centre.",
    [
      "A specific, dated development",
      "Mechanism explained clearly",
      "Why it matters clinically",
      "Critical caution about evidence and availability",
      "Link to psychological care",
    ],
    [
      "Vague answer with no specifics",
      "Overstating early evidence",
    ]),

  iv("iv-ca-016", 3,
    "What does recent research and policy say about social media and adolescent mental health?",
    [
      "Is the evidence causal?",
      "What did Australia decide in 2025?",
      "What would you advise parents?",
    ],
    "This is an active and contested area. Rates of depression, anxiety and self-harm among adolescents, especially girls, rose in many countries from the early 2010s, around the time smartphones and social media became widespread. Some researchers argue social media is a major cause, through displacing sleep and in-person contact, social comparison, cyberbullying, and exposure to harmful content about self-harm or eating. Others point out that most studies are correlational, that average associations between screen time and wellbeing are small, and that effects depend on how platforms are used, by whom, and what content is involved. Some experimental and natural-experiment studies suggest that reducing use can improve mood, but the evidence is still developing. Policy has moved faster than research. Australia passed a law setting a minimum age of 16 for holding accounts on major social media platforms, which took effect in December 2025, and other countries have debated similar steps. India's DPDP rules require verifiable parental consent for processing children's data. For parents, I would advise focusing less on total hours and more on content, sleep and balance: keeping phones out of bedrooms at night, talking openly about online experiences, watching for cyberbullying and harmful content, modelling healthy use, and seeking help if there are signs of distress, rather than relying on bans alone.",
    [
      "Trends and proposed mechanisms",
      "Correlational nature and small average effects",
      "Australia's 2025 minimum age law",
      "Indian DPDP provisions",
      "Balanced, practical advice",
    ],
    [
      "Claiming proven causation",
      "Dismissing concerns entirely",
    ]),

  iv("iv-ca-017", 2,
    "What is the Nasha Mukt Bharat Abhiyaan, and how is India responding to substance use?",
    [
      "What did the 2019 national survey on substance use find?",
      "What is MANAS (1933)?",
      "What is the role of NDPS Section 64A?",
    ],
    "The Nasha Mukt Bharat Abhiyaan, or Drug-Free India Campaign, was launched by the Ministry of Social Justice and Empowerment on 15 August 2020. It started in the districts identified as most vulnerable and was later extended across the country. It focuses on awareness, especially among young people in schools and colleges, community outreach, and increasing access to treatment and rehabilitation through government and NGO facilities, working with health and narcotics control agencies. The national survey on the extent and pattern of substance use, carried out by AIIMS and published in 2019, found that alcohol is the most commonly used substance, with about 16 crore users, followed by cannabis and opioids, and that a large share of people with dependence received no treatment. On the enforcement side, the Narcotics Control Bureau launched MANAS, the Madak Padarth Nishedh Asoochna Kendra helpline 1933, in July 2024, so citizens can report drug trafficking and get information. On the treatment side, Section 64A of the NDPS Act gives immunity from prosecution to people charged with consumption or small-quantity offences who voluntarily seek de-addiction treatment, and opioid agonist treatment is available in government centres. Clinical psychologists contribute through motivational interviewing, relapse prevention, family work and prevention programmes.",
    [
      "Campaign launch date and focus",
      "2019 survey findings",
      "MANAS 1933 helpline with date",
      "NDPS s.64A and treatment services",
      "Psychologist's role",
    ],
    [
      "Confusing MANAS 1933 with Tele-MANAS 14416",
      "Only an enforcement view",
    ]),

  iv("iv-ca-018", 3,
    "How is climate change linked to mental health, and why does it matter for India?",
    [
      "What is eco-anxiety, and is it a disorder?",
      "How do heatwaves affect mental health?",
      "What can mental health services do?",
    ],
    "Climate change affects mental health in several ways. Acute events like floods, cyclones and heatwaves can cause trauma, PTSD, depression and anxiety, especially when people lose homes, livelihoods or family members. Slow changes, like droughts, crop failures and sea level rise, cause chronic stress, poverty, migration and conflict, which are major risk factors for mental illness, and are linked in some research with farmer distress and suicide. Extreme heat is linked with increased emergency visits for mental health problems, higher rates of suicide, aggression and violence, and worsening symptoms in people with existing illness, partly because heat disrupts sleep and some psychiatric medicines, such as lithium and antipsychotics, increase sensitivity to heat. Eco-anxiety, meaning distress about the climate crisis, is common among young people. It is generally seen as an understandable response rather than a disorder, though it can become impairing. India is highly exposed, with frequent heatwaves, floods and cyclones, and a large population dependent on agriculture, so the impact on mental health is likely to be large. Mental health services can respond by including psychosocial support in disaster management plans, training first responders in psychological first aid, preparing heat action plans that protect people with mental illness, and building community resilience.",
    [
      "Acute and chronic pathways",
      "Heat and mental health, including medication effects",
      "Eco-anxiety framed appropriately",
      "India's exposure",
      "Service responses",
    ],
    [
      "Calling eco-anxiety a disorder by default",
      "No Indian relevance",
    ]),

  iv("iv-ca-019", 3,
    "What are the main challenges in disability certification for mental illness under the RPwD Act?",
    [
      "What is the IDEAS scale?",
      "What is the benchmark disability threshold?",
      "What is the UDID card?",
    ],
    "Under the Rights of Persons with Disabilities Act 2016, mental illness is one of 21 specified disabilities, and people with a benchmark disability of at least 40% can access reservations in government jobs and higher education, as well as other benefits. Disability due to mental illness is assessed using the Indian Disability Evaluation and Assessment Scale, IDEAS, which rates self-care, interpersonal activities, communication and understanding, and work, each from 0 to 4, plus a score for the duration of illness, giving a global score that is converted into a percentage band. Certificates are issued by government medical boards and are linked to the national UDID, Unique Disability ID, card system. There are several challenges. Many eligible people and families do not know about certification, or avoid it because of stigma. Assessments can vary between boards, and the episodic nature of illnesses like bipolar disorder makes it hard to rate a fluctuating disability. People with common mental disorders such as severe OCD or depression may be overlooked. The process involves multiple visits, which is hard for people with severe illness. There is also a risk of misuse through false certificates. Clinical psychologists can help by providing careful assessments of functioning, explaining the process to families, and advocating for fair, consistent certification.",
    [
      "RPwD inclusion and benchmark disability",
      "IDEAS domains and scoring",
      "Medical boards and UDID",
      "Practical and fairness challenges",
      "Psychologist's role",
    ],
    [
      "Wrong benchmark threshold",
      "Not knowing IDEAS",
    ]),

  iv("iv-ca-020", 4,
    "If you were advising the Health Ministry, what three changes would most improve mental health care in India in the next five years?",
    [
      "How would you pay for them?",
      "How would you measure success?",
      "What role should the private sector play?",
    ],
    "I would prioritise three changes. First, the workforce and task sharing. India has very few clinical psychologists and psychiatrists for its population, so I would expand training seats, building on the planned second national institute and upgraded regional centres, while training and supervising primary care staff, community health officers and lay counsellors to deliver brief psychological interventions in Ayushman Arogya Mandirs, with clinical psychologists as trainers and supervisors. Second, continuity of care. Tele-MANAS has reached millions of callers, but its value depends on linking callers to sustained care, so I would strengthen district mental health services, follow-up systems and digital records, while protecting privacy under the DPDP Act, and use routine outcome measures to track whether people improve. Third, prevention in schools and colleges, implementing the Supreme Court's 2025 guidelines and the National Suicide Prevention Strategy through trained counsellors, life skills and wellbeing curricula, crisis protocols and anti-discrimination measures, since half of mental disorders begin by mid-adolescence. To fund these, I would argue for a larger mental health share of the health budget, which is currently very small, and for insurance parity, which the MHCA requires. I would measure success through treatment coverage, the second national survey's data, suicide rates and service quality indicators, and involve the private sector through regulated partnerships and insurance coverage.",
    [
      "Workforce expansion with task sharing",
      "Continuity of care and outcome monitoring",
      "School and college prevention",
      "Funding and insurance parity",
      "Measurable indicators and role of private sector",
    ],
    [
      "Vague wish-list without priorities",
      "No funding or measurement",
    ]),

  iv("iv-ca-021", 2,
    "What was the theme of World Mental Health Day in 2026, and how was it marked in India?",
    [
      "Who decides the theme each year?",
      "Why do awareness days matter?",
      "What is the MANN Jaagriti initiative?",
    ],
    "World Mental Health Day is observed every year on 10 October, and the World Federation for Mental Health sets its theme. For 2026, the Health Ministry's announcement described the global theme as 'Lived experiences heard: real voices, real change', which stresses listening to people with lived experience of mental illness and involving them in shaping services. I would check the exact wording on the official website, since it is reported in different ways. In India, the Health Ministry marked the day by highlighting Tele-MANAS, which had received about 47.75 lakh calls since its launch on the same day in 2022, the District Mental Health Programme sanctioned in about 767 districts, and the integration of mental health into more than 1.83 lakh Ayushman Arogya Mandirs. It also promoted MANN Jaagriti, a community awareness and engagement initiative to improve mental health literacy and reduce stigma through schools, colleges, workplaces, health facilities and community platforms. Awareness days matter because stigma and low awareness are major barriers to seeking help in India. They are a chance to share accurate information, publicise helplines, and give voice to people with lived experience, but they must be backed by real, accessible services throughout the year.",
    [
      "Date and organisation that sets the theme",
      "2026 theme with a caveat on wording",
      "Indian announcements with dated figures",
      "MANN Jaagriti",
      "Value and limits of awareness days",
    ],
    [
      "Inventing a theme with no caveat",
      "Confusing the date",
    ]),
];

export const INTERVIEWS: InterviewQuestion[] = ITEMS.sort((a, b) => a.difficulty - b.difficulty);
