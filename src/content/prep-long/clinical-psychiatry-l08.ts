import type { LongQA } from "@/lib/prep/long-types";
import { anchored, compare, layers, timeline, tree, vis } from "./visual";

export const CLINICAL_PSYCHIATRY_L08: LongQA[] = anchored([
  {
    id: "cpsy-l08-001",
    subject: "clinical-psychiatry",
    topic: "nmhp",
    marks: 20,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Critically evaluate the National Mental Health Programme and the District Mental Health Programme of India. What are the remaining gaps and recent developments?",
    plan: ["Background: burden and treatment gap", "NMHP 1982: objectives and strategies", "DMHP: Bellary model, components and expansion", "Later developments: policy, MHCA, Tele MANAS, Ayushman Bharat", "Critical evaluation: achievements and gaps", "Way forward and conclusion"],
    answer: `## Background
The National Mental Health Survey 2015 to 16, led by NIMHANS, found that about one in ten Indian adults had a current mental disorder (excluding tobacco use), with a lifetime prevalence of about 14 percent, and a treatment gap of 70 to 90 percent across disorders. India has fewer than one psychiatrist per lakh population, and mental health receives a very small share of the health budget.

## National Mental Health Programme (NMHP), 1982
Objectives:
- To ensure availability and accessibility of minimum mental health care for all, especially the most vulnerable.
- To encourage the application of mental health knowledge in general health care and social development.
- To promote community participation in mental health services and self help.
Strategies:
- Integration of mental health with general health care through primary health centres.
- Training of general health staff (medical officers, health workers) in the recognition and basic treatment of priority conditions.
- Strengthening of mental hospitals and psychiatric units in medical colleges.
The approach drew on pilot community projects at Raipur Rani (Chandigarh) and Sakalwara (Bengaluru), which showed that primary care staff could identify and treat common conditions.

## District Mental Health Programme (DMHP)
- Based on the Bellary model in Karnataka in 1985, developed by NIMHANS, in which a district team trained primary care staff and supplied medicines.
- Launched in 1996 in four districts and expanded in phases; it now covers almost all districts under the National Health Mission.
- Components:
- A district team (psychiatrist, clinical psychologist, psychiatric social worker, psychiatric nurse, and support staff).
- Outpatient services and a small inpatient unit (about ten beds) in the district hospital.
- Outreach clinics at community health centres and primary health centres.
- Training of medical officers and health workers.
- Information, education and communication activities to reduce stigma.
- Targeted services added later: life skills and school mental health, college counselling, workplace stress management and suicide prevention.
- Supply of essential psychotropic medicines.

## Other parts of the programme
Later plan periods added manpower development (Centres of Excellence and new postgraduate departments in psychiatry, clinical psychology, psychiatric social work and psychiatric nursing), modernisation of government mental hospitals, and upgrading of psychiatric wings in medical colleges.

## Recent developments
- The National Mental Health Policy in 2014, India's first, built on rights, equity and recovery.
- The Mental Healthcare Act 2017: a right to access mental health care (section 18), community living, and protection from cruel treatment; it obliges governments to provide services in every district.
- Ayushman Bharat: mental health was added to the package of comprehensive primary care at health and wellness centres (now Ayushman Arogya Mandirs).
- Tele MANAS (launched in October 2022): a national tele mental health service on 14416 in many languages, linked to district services.
- The National Suicide Prevention Strategy of 2022 and the school based mental health component of Ayushman Bharat's school health programme.
- Rashtriya Kishor Swasthya Karyakram for adolescents, and Kiran (a short lived national helpline during COVID 19).

## Critical evaluation
Achievements:
- Shifted the focus from mental hospitals to community and district care.
- Created a model for task sharing in primary care that influenced global programmes such as WHO mhGAP.
- Expanded training capacity and brought services to districts where there were none.
- Improved conditions in many mental hospitals after Supreme Court and NHRC interventions.
Gaps:
- Chronic underfunding and underuse of allocated funds; many posts remain vacant.
- Integration with primary care has been weak: medical officers have many priorities, and mental health often stays a "vertical" add on.
- Shortage of trained staff, especially clinical psychologists and psychiatric nurses, and uneven distribution favouring cities.
- Irregular medicine supply and limited monitoring and evaluation; outcome data are scarce.
- Little attention to rehabilitation, homelessness and long stay patients.
- Weak links with substance use services, child services and social welfare.
- Stigma and low awareness; many people still reach faith healers first.
- State variation: states such as Kerala, Tamil Nadu and Karnataka have stronger programmes than others.

## Way forward
- Adequate, protected funding and filling sanctioned posts.
- Making mental health a routine part of every Ayushman Arogya Mandir, with trained community health officers and ASHAs using simple protocols.
- Task sharing with lay counsellors, building on Indian trials such as MANAS and PREMIUM.
- Digital tools and Tele MANAS linked to local follow up.
- Strong rehabilitation and community living services as required by the MHCA.
- Better data systems and independent evaluation.
- Partnerships with NGOs, user groups and families.

## Conclusion
The NMHP and DMHP were pioneering in placing mental health in primary and district care. Their promise has been limited by funding, staffing and integration problems. Recent laws and programmes, especially the MHCA 2017, Ayushman Bharat and Tele MANAS, provide a stronger framework, but closing the treatment gap requires sustained investment and real integration with general health care.`,
    keyPoints: ["NMHS prevalence and treatment gap", "NMHP 1982 three objectives", "Integration and training strategies with pilot sites", "Bellary model and DMHP launch in 1996", "DMHP components including targeted services", "National Mental Health Policy 2014, MHCA 2017 section 18, Tele MANAS 2022", "Balanced achievements and gaps", "Way forward with task sharing"],
    pitfalls: ["Listing components without evaluation", "Wrong launch years", "Ignoring recent developments"],
    visuals: [
      timeline("Milestones in Indian mental health services", [["National Mental Health Programme", "1982"], ["Bellary model", "1985"], ["District Mental Health Programme", "1996"], ["National Mental Health Policy", "2014"], ["Mental Healthcare Act", "2017"], ["Tele MANAS", "2022"]]),
      layers("District Mental Health Programme components", "stack", [["District team", "Psychiatrist, psychologist, social worker, nurse"], ["District hospital", "Outpatients and a small inpatient unit"], ["Outreach clinics", "CHCs and PHCs"], ["Training", "Medical officers and health workers"], ["Targeted services", "Schools, colleges, workplaces, suicide prevention"]]),
    ],
    module: "ethics-law",
    ref: "NMHP 1982 document; Gururaj NMHS 2016 report; DMHP guidelines; National Mental Health Policy 2014; MHCA 2017 s18; Tele MANAS launch Oct 2022; van Ginneken 2014 DMHP review",
  },
  {
    id: "cpsy-l08-002",
    subject: "clinical-psychiatry",
    topic: "tele-manas",
    marks: 5,
    difficulty: 1,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Write short notes on Tele MANAS.",
    plan: ["What it is and when it began", "Structure", "Services", "Strengths and limits"],
    answer: `## What it is
Tele MANAS (Tele Mental Health Assistance and Networking Across States) is India's national tele mental health programme, launched on World Mental Health Day, 10 October 2022, by the Ministry of Health and Family Welfare, with NIMHANS as the nodal centre and IIIT Bangalore providing technical support. It was announced in the Union Budget 2022 to 23 in response to the mental health effects of the COVID 19 pandemic.

## Structure
- A toll free number, 14416 (or 1800 891 4416), available round the clock.
- A two tier system:
- Tier 1: state cells staffed by trained counsellors who give first line support.
- Tier 2: mental health specialists (psychiatrists and clinical psychologists) for further assessment, including video consultation, and links to district mental health services, medical colleges and e Sanjeevani.
- Services in many Indian languages; calls are routed to the caller's state.
- A mobile app and links with the Ayushman Bharat digital mission.

## Services
Emotional support and counselling, crisis help for suicidal callers, advice on where to get care, follow up calls, and referral to in person services.

## Strengths
Free, anonymous, available everywhere, multilingual, linked to existing services, and useful in rural areas and for people who fear stigma.

## Limits
Awareness is still limited; connections to local follow up depend on the strength of district services; phone access, privacy at home and language coverage vary; quality monitoring is important.

## Conclusion
Tele MANAS is a major step towards universal access to mental health support in India, but its value depends on strong local services behind it.`,
    keyPoints: ["Launch date and ministry", "NIMHANS nodal centre", "14416 number", "Two tier structure", "Languages and state routing", "Strengths and limits"],
    module: "ethics-law",
    ref: "MoHFW Tele MANAS launch 10 Oct 2022; Union Budget 2022-23; NIMHANS Tele MANAS operational guidelines",
  },
  {
    id: "cpsy-l08-003",
    subject: "clinical-psychiatry",
    topic: "rehabilitation",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Discuss the principles and components of psychiatric rehabilitation, with examples from India.",
    plan: ["Definition and the recovery model", "Assessment of disability", "Components of rehabilitation", "Indian services and legal supports", "Conclusion"],
    answer: `## Definition and the recovery model
Psychiatric rehabilitation helps people with severe mental illness to develop the skills and supports needed to live, learn, work and relate to others in the community of their choice, with as little professional help as possible. Modern rehabilitation is based on personal recovery: living a satisfying, hopeful life even with ongoing symptoms. The CHIME framework describes recovery processes: connectedness, hope, identity, meaning and empowerment.

## Assessment
- Strengths, goals and preferences of the person.
- Disability in self care, communication, social relationships, work and daily living, measured with the Indian Disability Evaluation and Assessment Scale (IDEAS), which is used for disability certification, or the WHO Disability Assessment Schedule.
- Cognitive functioning, symptoms, physical health, family and social resources.

## Components
- Optimal treatment: lowest effective medicine doses, clozapine for resistance, physical health care.
- Psychoeducation for person and family, and family interventions to reduce relapse.
- Social skills training: conversation, assertiveness, problem solving, using role play and feedback.
- Training in activities of daily living: self care, cooking, money management, travel.
- Cognitive remediation to improve attention, memory and executive function, best combined with vocational work.
- Vocational rehabilitation: the strongest evidence is for Individual Placement and Support (IPS), which places people in real jobs quickly and then trains and supports them ("place, then train"), rather than long pre vocational training.
- Housing: supported housing, halfway homes and group homes.
- Case management and assertive community treatment for people with frequent relapses.
- Peer support workers.
- Day care centres and psychosocial clubs.

## Indian services and legal supports
- Day care and rehabilitation services at NIMHANS, the Schizophrenia Research Foundation in Chennai and the Medico Pastoral Association in Bengaluru.
- The Banyan in Chennai provides emergency care and "home again" community living for homeless women and men with mental illness.
- Families provide most care; family psychoeducation and carer support are central.
- The MHCA 2017 gives the right to community living (section 19) and requires governments to create half way homes and community based rehabilitation.
- The Rights of Persons with Disabilities Act 2016 recognises mental illness as a disability; a certificate of benchmark disability (40 percent or more) allows reservation in jobs and education and other benefits.

## Conclusion
Rehabilitation aims at recovery and inclusion. It combines good treatment with skills training, family work, supported employment and housing, and is supported in India by the MHCA and RPwD Act, though services remain scarce outside a few centres.`,
    keyPoints: ["Definition with community focus", "Recovery and CHIME", "IDEAS for disability assessment", "Social skills, ADL training and cognitive remediation", "IPS supported employment: place then train", "Housing and assertive community treatment", "Indian examples such as SCARF and The Banyan", "MHCA section 19 and RPwD benchmark disability"],
    visuals: [compare("Two routes to work", ["Train, then place", ["Long pre vocational training", "Sheltered workshops", "Few reach real jobs"], "Older model"], ["Place, then train (IPS)", ["Quick search for a real job", "Support on the job", "Follows the person's preferences", "More people working"], "Best evidence"])],
    module: "psychosis",
    ref: "Leamy 2011 CHIME; Bond IPS; Thara SCARF; MHCA 2017 s19; RPwD Act 2016; IDEAS guidelines",
  },
  {
    id: "cpsy-l08-004",
    subject: "clinical-psychiatry",
    topic: "stigma",
    marks: 5,
    difficulty: 1,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Write short notes on stigma in mental illness.",
    plan: ["Definition and Goffman", "Types of stigma", "Effects", "Interventions"],
    answer: `## Definition
Stigma is a mark of disgrace that sets a person apart. Erving Goffman described it as an attribute that is deeply discrediting, reducing the person "from a whole and usual person to a tainted, discounted one". Graham Thornicroft describes three parts: problems of knowledge (ignorance), attitudes (prejudice) and behaviour (discrimination).

## Types
- Public stigma: negative beliefs held by the public (people with mental illness are violent, weak or to blame).
- Self stigma: the person accepts these beliefs, leading to shame, low self esteem and the "why try" effect described by Patrick Corrigan.
- Structural stigma: laws, policies and services that disadvantage people, such as poor funding or exclusion from insurance.
- Label avoidance: people avoid diagnosis and treatment to avoid the label.
- Courtesy (associative) stigma: affecting families and even mental health staff.

## Effects
Delay in seeking help, poor adherence, social isolation, unemployment, problems in marriage prospects (a major concern in India), and human rights abuses such as chaining.

## Interventions
- Social contact with people with lived experience is the most effective way to reduce public stigma.
- Education that corrects myths, especially for young people, health workers, police and media.
- Protest against stigmatising media portrayals; responsible reporting guidelines.
- Self stigma programmes and peer support.
- Legal protection: the MHCA 2017 guarantees equality and non discrimination (section 21) and requires parity in insurance.
- Indian campaigns include those by the Live Love Laugh Foundation and community programmes linked to the District Mental Health Programme.

## Conclusion
Stigma operates at personal, public and structural levels and is a major barrier to care; contact based programmes and legal protections are the best remedies.`,
    keyPoints: ["Goffman's definition", "Knowledge, attitudes and behaviour", "Public, self and structural stigma", "Why try effect", "Effects including marriage in India", "Contact based interventions and MHCA section 21"],
    module: "ethics-law",
    ref: "Goffman 1963; Thornicroft 2007; Corrigan why try effect 2009; MHCA 2017 s21",
  },
  {
    id: "cpsy-l08-005",
    subject: "clinical-psychiatry",
    topic: "task-sharing",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Discuss task sharing in mental health care and WHO's mhGAP programme, with evidence from India.",
    plan: ["The workforce problem and the idea of task sharing", "mhGAP: aims and priority conditions", "Indian trials and programmes", "Conditions for success and limits", "Conclusion"],
    answer: `## The problem and the idea
Low and middle income countries, including India, have very few specialists, so most people with mental disorders never see one. Task sharing means training non specialist health workers (doctors in primary care, nurses, community health workers) and lay counsellors to deliver specific, evidence based care, with supervision and referral by specialists. It is different from simply shifting work without support.

## WHO mhGAP
The Mental Health Gap Action Programme was launched by WHO in 2008 to scale up care in low resource settings. The mhGAP Intervention Guide (first in 2010, updated in 2016 and later) gives simple protocols for non specialists for priority conditions:
- Depression.
- Psychoses (including bipolar disorder).
- Epilepsy.
- Child and adolescent mental and behavioural disorders.
- Dementia.
- Disorders due to substance use.
- Self harm and suicide.
- Other significant mental health complaints.
It covers assessment, psychosocial interventions, medicines and when to refer.

## Indian evidence
- MANAS trial in Goa: lay health counsellors in primary care improved recovery from common mental disorders, especially in public health facilities.
- PREMIUM programme (Goa and Madhya Pradesh): two brief therapies delivered by lay counsellors, the Healthy Activity Programme for moderate to severe depression and Counselling for Alcohol Problems for harmful drinking, were both effective in randomised trials.
- COPSI trial: community care by trained health workers improved outcomes for people with schizophrenia compared with facility based care alone.
- Atmiyata in Gujarat: community volunteers identify distress and link people to care and social benefits.
- SMART Mental Health in Andhra Pradesh: ASHAs and primary care doctors supported by an electronic decision support system.
- PASS for autism: parent mediated intervention delivered by non specialists.

## Conditions for success
- Good initial training and ongoing supervision by specialists.
- Simple, structured manuals and decision tools.
- Reliable supply of essential medicines.
- Clear referral pathways and integration with primary care.
- Fair pay and recognition for workers, to avoid burnout and turnover.

## Limits
Quality can drop when programmes scale up; workers already carry heavy workloads; severe and complex cases still need specialists; and community acceptance depends on trust and local fit.

## Conclusion
Task sharing, guided by tools such as mhGAP and supported by strong Indian trials, is the most realistic way to close the treatment gap, provided it comes with training, supervision and integration rather than replacing specialist care.`,
    keyPoints: ["Definition of task sharing with supervision", "mhGAP 2008 and intervention guide", "Eight priority conditions", "MANAS and PREMIUM trials", "COPSI and Atmiyata", "Conditions for success", "Limits at scale"],
    visuals: [layers("Who delivers what in task sharing", "pyramid", [["Specialists", "Supervision, complex and severe cases"], ["Primary care doctors and nurses", "Diagnosis and medicines using mhGAP"], ["Lay counsellors and ASHAs", "Brief psychological therapy, follow up"], ["Community and families", "Recognition, support, linking to care"]])],
    module: "ethics-law",
    ref: "WHO mhGAP 2008, mhGAP-IG 2016; Patel 2010 MANAS Lancet; Patel 2017 HAP; Nadkarni 2017 CAP; Chatterjee 2014 COPSI; Shields-Zeeman Atmiyata",
  },
  {
    id: "cpsy-l08-006",
    subject: "clinical-psychiatry",
    topic: "erwadi",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Write short notes on the Erwadi tragedy and its impact on mental health care in India.",
    plan: ["What happened", "Responses by courts and NHRC", "Impact on law and practice", "Lessons"],
    answer: `## What happened
On 6 August 2001, a fire broke out in a privately run home attached to a dargah (shrine) at Erwadi in Ramanathapuram district, Tamil Nadu. Twenty eight people with mental illness, who were chained to their beds or to poles, could not escape and died. Families had left them there for "faith healing", a common practice at several shrines and temples.

## Responses
- The Supreme Court took up the matter on its own motion, ordered a survey of such institutions, directed that chaining be stopped and that people be moved to proper care, and called for every district to have mental health services.
- The National Human Rights Commission reviewed conditions in mental hospitals and other institutions and issued reports on the rights of people with mental illness.
- State governments closed many unlicensed homes and registered others.

## Impact
- Drew national attention to human rights abuses, including chaining and unregulated custodial care.
- Gave urgency to expanding the District Mental Health Programme and improving mental hospitals.
- Influenced the rights based approach of the Mental Healthcare Act 2017, which prohibits chaining (section 95), protects against cruel and degrading treatment (section 20), regulates mental health establishments, and requires community services.
- Encouraged collaborations, such as the Dava Dua programme at Erwadi itself, where psychiatric care was offered alongside the shrine.

## Lessons
Faith based healing sites are often the first place families go; banning them without alternatives fails, while respectful partnership with healers, accessible services and enforcement of rights protects people.

## Conclusion
Erwadi was a turning point that exposed the human cost of neglect and helped shape India's rights based mental health law.`,
    keyPoints: ["Date and place", "Twenty eight chained people died", "Supreme Court and NHRC responses", "Ban on chaining and MHCA sections 20 and 95", "Dava Dua collaboration", "Lessons about faith healing sites"],
    module: "ethics-law",
    ref: "Supreme Court suo motu 2001 (Erwadi); NHRC Quality Assurance in Mental Health 1999 and 2008; MHCA 2017 s20, s95; Murthy Dava Dua",
  },
  {
    id: "cpsy-l08-007",
    subject: "clinical-psychiatry",
    topic: "rating-scales",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Discuss the use of rating scales in psychiatry, with examples for depression, psychosis and mania.",
    plan: ["Uses and types of scales", "Psychometric properties", "Depression scales", "Psychosis and mania scales; others", "Limits and conclusion"],
    answer: `## Uses and types
Rating scales measure the presence and severity of symptoms in a standard way. They are used for screening, measuring severity, tracking change with treatment, research and audit. Types:
- Clinician rated (observer) scales, which need training.
- Self report scales, which are quick and capture subjective experience.
- Structured diagnostic interviews (SCID-5, MINI), which give diagnoses rather than severity.

## Psychometric properties
Reliability (inter rater and test retest), validity (agreement with clinical diagnosis or other scales), sensitivity to change, cut off scores with sensitivity and specificity, and cultural and language validation (many scales have Hindi and other Indian language versions).

## Depression
| Scale | Type | Key facts |
| Hamilton Depression Rating Scale (HAM-D) | Clinician | 17 item version is standard; 0 to 7 normal, about 24 or more severe; weighted to somatic items |
| Montgomery Asberg Depression Rating Scale (MADRS) | Clinician | 10 items, 0 to 60; less somatic, sensitive to change |
| Beck Depression Inventory II | Self report | 21 items, 0 to 63 |
| PHQ 9 | Self report | 9 DSM symptoms, 0 to 27; 10 or more suggests moderate depression; widely used in Indian primary care |
| Geriatric Depression Scale | Self report | 15 or 30 items, avoids somatic items |
| Edinburgh Postnatal Depression Scale | Self report | 10 items, for perinatal depression |

## Psychosis
- Brief Psychiatric Rating Scale (BPRS): 18 items, each 1 to 7; quick global measure.
- Positive and Negative Syndrome Scale (PANSS): 30 items (7 positive, 7 negative, 16 general psychopathology), each 1 to 7, total 30 to 210; standard in trials.
- Scales for the Assessment of Positive and Negative Symptoms (SAPS and SANS).
- Calgary Depression Scale for Schizophrenia separates depression from negative symptoms.

## Mania
- Young Mania Rating Scale (YMRS): 11 items, total 0 to 60, rated over the past 48 hours.
- Mood Disorder Questionnaire and Hypomania Checklist 32 for screening bipolarity.

## Other common scales
Hamilton Anxiety Rating Scale and GAD 7; Y-BOCS for OCD; AUDIT and CIWA-Ar for alcohol; Bush-Francis for catatonia; MMSE and MoCA for cognition; Clinical Global Impression (severity and improvement); WHODAS 2.0 and IDEAS for disability; AIMS for tardive dyskinesia and the Simpson Angus Scale and Barnes Akathisia Rating Scale for side effects.

## Limits
Scales support but do not replace clinical judgement. Self reports depend on literacy and insight; observer scales depend on training; scores may not capture cultural idioms of distress; and a cut off is not a diagnosis.

## Conclusion
Rating scales bring precision to assessment and monitoring. Knowing the main scales, their structure and limits is essential for clinical practice, research and exams.`,
    keyPoints: ["Uses of rating scales", "Clinician, self report and diagnostic interview types", "Reliability, validity, sensitivity to change", "HAM-D, MADRS, BDI II, PHQ 9 details", "BPRS and PANSS structure", "YMRS details", "Other scales for anxiety, OCD, alcohol, side effects", "Limits"],
    module: "assessment",
    ref: "Hamilton 1960; Montgomery and Asberg 1979; Kay 1987 PANSS; Young 1978 YMRS; Kroenke 2001 PHQ-9",
  },
  {
    id: "cpsy-l08-008",
    subject: "clinical-psychiatry",
    topic: "integrative-screening-data",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "A screening tool for depression has a sensitivity of 88 percent and a specificity of 88 percent. It is used in a primary care clinic where 10 percent of attenders have depression. Out of 1000 attenders, calculate the positive and negative predictive values and interpret them. What happens if the prevalence is 30 percent?",
    plan: ["Draw a two by two table for 1000 people", "Fill in true and false positives and negatives", "Calculate PPV, NPV and likelihood ratio", "Repeat at 30 percent prevalence", "Interpret for practice"],
    answer: `## Definitions
- Sensitivity: the proportion of people with the condition who test positive.
- Specificity: the proportion of people without the condition who test negative.
- Positive predictive value (PPV): the proportion of positive tests that are true positives.
- Negative predictive value (NPV): the proportion of negative tests that are true negatives.
Sensitivity and specificity belong to the test; predictive values depend also on prevalence.

## At 10 percent prevalence
Of 1000 attenders, 100 have depression and 900 do not.
- True positives: 88 percent of 100 = 88.
- False negatives: 100 minus 88 = 12.
- True negatives: 88 percent of 900 = 792.
- False positives: 900 minus 792 = 108.

| | Depressed | Not depressed | Total |
| Test positive | 88 | 108 | 196 |
| Test negative | 12 | 792 | 804 |
| Total | 100 | 900 | 1000 |

- PPV = 88 divided by 196 = about 45 percent.
- NPV = 792 divided by 804 = about 98.5 percent.
- Positive likelihood ratio = sensitivity divided by (1 minus specificity) = 0.88 divided by 0.12 = about 7.3.

## At 30 percent prevalence
Of 1000, 300 have depression and 700 do not.
- True positives 264, false negatives 36, true negatives 616, false positives 84.
- PPV = 264 divided by 348 = about 76 percent.
- NPV = 616 divided by 652 = about 94.5 percent.

## Interpretation
- In a low prevalence setting, more than half of positive screens are false positives, even with a good test. A positive result means "assess further", not "diagnose and prescribe".
- A negative result is very reassuring (high NPV), so the tool is good for ruling out depression.
- As prevalence rises (for example in a medical ward or a clinic for chronic illness), PPV rises and NPV falls.
- The likelihood ratio does not change with prevalence and helps update the probability for an individual.
- Practical use: screen, then confirm with a clinical interview; consider a two step approach (PHQ 2 then PHQ 9) to save time.

## Conclusion
Predictive values depend on prevalence. A screening tool with 88 percent sensitivity and specificity gives a PPV of only about 45 percent at 10 percent prevalence but about 76 percent at 30 percent, so positive screens must always be followed by clinical assessment.`,
    keyPoints: ["Correct definitions", "Correct two by two table at 10 percent", "PPV about 45 percent and NPV about 98.5 percent", "Likelihood ratio about 7.3", "Correct values at 30 percent", "Prevalence dependence explained", "Practical interpretation: screen then confirm"],
    pitfalls: ["Confusing sensitivity with PPV", "Arithmetic errors in the table", "Forgetting that NPV falls as prevalence rises"],
    visuals: [vis("experiment", { title: "Positive predictive value at different prevalence", question: "With sensitivity and specificity both 88 percent, what share of positive screens are true cases?", unit: "%", conditions: [{ label: "Prevalence 10 percent", value: 45 }, { label: "Prevalence 30 percent", value: 76 }], why: "The same test means more when the condition is more common in the people tested." })],
    module: "statistics",
    ref: "Standard diagnostic test calculations; Altman Practical Statistics; Manea 2012 PHQ-9 accuracy",
  },
  {
    id: "cpsy-l08-009",
    subject: "clinical-psychiatry",
    topic: "guru-chela",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Write short notes on Indian contributions to psychotherapy, including the guru chela relationship.",
    plan: ["Why Western therapy needed adaptation", "Neki's guru chela model", "Other Indian contributions", "Critique"],
    answer: `## Why adaptation was needed
Early Indian psychiatrists noticed that many patients expected a more directive, warm and authoritative therapist, preferred family involvement, and used religious and philosophical ideas to understand suffering. Pure Western, individual and non directive approaches did not always fit.

## Neki's guru chela model
J S Neki, working in Delhi and later abroad, proposed in the 1970s that the traditional relationship between a guru (teacher and guide) and a chela (disciple) could be a model for psychotherapy in India. In this model:
- The therapist is an accepting, caring guide who may give advice and direction.
- The patient's dependence is accepted at first, rather than interpreted as a problem, and is gradually turned into growth and independence.
- The relationship is warm, respectful and long term.
Critics noted the risk of exploitation and of the patient never becoming independent.

## Other Indian contributions
- N N Wig's description of the "Hanuman complex", in which the therapist helps the patient discover strengths they did not know they had, like Hanuman being reminded of his powers.
- Use of the Bhagavad Gita in counselling (acting without attachment to results), and of concepts such as karma and dharma to give meaning.
- Yoga, pranayama and meditation, including Vipassana, as therapeutic tools; the NIMHANS integrated yoga programme for depression and schizophrenia.
- Family therapy adaptations and the involvement of relatives as co therapists, given the central role of the family.
- Sudhir Kakar's cultural analysis of the Indian psyche and healing traditions.
- Use of simple directive and supportive methods in brief therapy for busy clinics.

## Critique
These ideas improve cultural fit, but evidence from controlled trials is limited, India is very diverse, and urban younger clients may prefer collaborative, non hierarchical therapy.

## Conclusion
Indian contributions remind therapists to adapt methods to culture, family and belief systems; the guru chela model is the best known example.`,
    keyPoints: ["Need for cultural adaptation", "Neki's guru chela model and its features", "Accepting dependence then fostering growth", "Wig's Hanuman complex", "Gita, yoga and meditation", "Critique and limited evidence"],
    module: "therapies",
    ref: "Neki 1973 Am J Psychother guru-chela; Wig Hanuman complex; Kakar Shamans Mystics and Doctors; Varma 1982",
  },
  {
    id: "cpsy-l08-010",
    subject: "clinical-psychiatry",
    topic: "integrative-case",
    marks: 15,
    difficulty: 4,
    exams: ["md-psychiatry"],
    question: "A 38-year-old farmer from Saurashtra with 15 years of daily drinking is admitted after a fall. On day 3 he is tremulous and confused, and once settled he reports low mood and thoughts of ending his life. His liver enzymes are raised and he has a large debt. Describe your step by step assessment and management.",
    plan: ["Immediate medical and withdrawal management", "Assessing the low mood: induced or independent depression", "Suicide risk and safety", "Choice of medicines in liver disease", "Psychosocial plan including debt and family", "Follow up and prognosis"],
    answer: `## Immediate priorities
- Day 3 tremor and confusion suggest alcohol withdrawal delirium (delirium tremens) or Wernicke encephalopathy; also consider head injury from the fall (subdural haematoma), hepatic encephalopathy, infection, hypoglycaemia and electrolyte imbalance.
- Assess vital signs, Glasgow Coma Scale, eye signs (nystagmus, ophthalmoplegia), gait, asterixis, signs of head injury and infection.
- Investigations: blood count, glucose, electrolytes including magnesium and phosphate, renal and liver function, INR, ammonia if encephalopathy is suspected, blood cultures if febrile, and CT brain because of the fall and confusion.
- Treatment: high dose parenteral thiamine before glucose; benzodiazepines titrated to symptoms, using lorazepam (which is safer than chlordiazepoxide or diazepam when the liver is damaged); fluids and correction of electrolytes; close monitoring in a high dependency area.

## Assessing the low mood
Once the delirium has cleared:
- Depressive symptoms are very common during heavy drinking and early withdrawal and often improve within two to four weeks of abstinence (alcohol induced depressive disorder).
- An independent depressive disorder is more likely if depression began before heavy drinking, persisted during long periods of abstinence, or continues beyond about four weeks of sobriety, or if there is a strong family history.
- Re-rate mood weekly using a scale such as the PHQ 9 or HAM-D, and treat earlier if depression is severe or suicide risk is high.

## Suicide risk
Alcohol dependence, depression, male sex, middle age, debt, farm distress, impulsivity and access to pesticides make risk high.
- Ask directly about thoughts, plans, intent, past attempts and access to means (pesticides at home or in the fields).
- Keep him on close observation while risk is high.
- Before discharge, make a safety plan with him and his family, including locked storage or removal of pesticides, a person to stay with him, and crisis contacts such as Tele MANAS (14416).

## Medicines with the liver in mind
- Withdrawal: lorazepam or oxazepam rather than long acting benzodiazepines.
- Relapse prevention: acamprosate (renally excreted) or baclofen are reasonable in liver disease; naltrexone should be avoided in significant liver impairment; disulfiram should be avoided in liver disease and is risky in unsupervised settings.
- Depression, if independent or severe: an SSRI such as sertraline or escitalopram at modest dose, with liver monitoring; avoid tricyclics and duloxetine.
- Continue oral thiamine and nutritional supplements; refer to a physician for liver disease and vaccinate against hepatitis B where appropriate.

## Psychosocial plan
- Motivational interviewing to build commitment to abstinence, linking drinking to his fall, his liver and his family.
- Relapse prevention skills: high risk situations (village gatherings, after a poor harvest), refusal skills, coping with craving.
- Family sessions with his wife and relatives: education about dependence, support for abstinence, and attention to domestic violence or neglect.
- Debt and social stress: refer to a social worker for help with farm loans, government schemes and crop insurance; problem solving therapy.
- Link to mutual help groups such as Alcoholics Anonymous where available and to de addiction services in the district.

## Follow up
Weekly follow up at first, then monthly; liver tests; review of mood and suicide risk at each visit; involve the primary health centre and ASHA worker for home visits.

## Prognosis
Good factors: a crisis (fall, admission) that may increase motivation, family support, help seeking. Poor factors: long heavy use, liver damage, debt and social pressure. With treatment of withdrawal, careful assessment of depression and a strong psychosocial plan, many patients achieve sustained recovery.

## Conclusion
This case needs urgent management of complicated withdrawal and exclusion of head injury and Wernicke encephalopathy, a careful judgement on whether depression is alcohol induced, active suicide prevention including pesticide safety, liver safe prescribing, and help with debt and family stress.`,
    keyPoints: ["Delirium tremens and Wernicke as first concerns", "CT brain after a fall", "Thiamine before glucose and lorazepam in liver disease", "Induced versus independent depression with timing rule", "High suicide risk factors including pesticides", "Liver safe choices: acamprosate, baclofen; avoid naltrexone and disulfiram", "SSRI choice if depression persists", "Debt, family and district follow up"],
    pitfalls: ["Starting an antidepressant on day 3 without reassessment", "Prescribing naltrexone or disulfiram with liver disease", "Forgetting the head injury", "No pesticide safety plan"],
    visuals: [tree("Low mood in a heavy drinker", [["Low mood with alcohol use", "", -1], ["Alcohol induced", "Improves in 2 to 4 weeks of abstinence", 0], ["Watch and re-rate weekly", "", 1], ["Independent depression", "Started before drinking or persists", 0], ["Treat with SSRI and therapy", "", 3], ["At any time", "High suicide risk", 0], ["Safety plan, pesticides locked away", "", 5]])],
    module: "substance",
    ref: "Maudsley alcohol and liver prescribing; Schuckit independent vs induced depression; NICE CG115; NCRB farmer suicides",
  },
]);
