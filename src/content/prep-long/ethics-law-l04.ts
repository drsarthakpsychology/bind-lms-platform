import type { LongQA } from "@/lib/prep/long-types";
import { anchored, chain, compare, layers, timeline, tree, vis } from "./visual";

const S = "ethics-law" as const;

export const ETHICS_LAW_L04: LongQA[] = anchored([
  {
    id: "eth-l04-001",
    subject: S,
    topic: "pocso",
    marks: 20,
    difficulty: 3,
    exams: ["mcp-entrance", "ugc-net", "ma-semester", "md-psychiatry"],
    question: "Describe the Protection of Children from Sexual Offences Act 2012. Discuss its offences, mandatory reporting, child friendly procedures and the role of the psychologist, and evaluate the Act.",
    plan: ["Why a special law was needed", "Definitions and offences", "Mandatory reporting", "Child friendly procedures and courts", "Role of the psychologist", "Evaluation"],
    answer: `## Why a special law
Before 2012, Indian law on sexual offences against children relied on general provisions of the Indian Penal Code, which did not recognise many forms of abuse, did not protect boys from rape and had no child friendly procedures. A government study in 2007 reported that more than half of the children surveyed had faced some form of sexual abuse. The Protection of Children from Sexual Offences Act was passed in 2012 and amended in 2019 to increase punishments.

## Definitions
- A child is any person below 18 years, whether boy, girl or of any gender. The Act is gender neutral for victims.
- Consent of the child is irrelevant; any sexual act with a child is an offence.
- Sexual intent is central for assault offences; touching for genuine medical care or hygiene is not an offence.

## Offences
| Offence | Sections | Examples |
| Penetrative sexual assault | 3 and 4 | Penetration of any kind; minimum 10 years, 20 years if the child is under 16 |
| Aggravated penetrative sexual assault | 5 and 6 | By police, staff, relatives, gang, or causing serious harm; minimum 20 years, up to life or death |
| Sexual assault | 7 and 8 | Touching with sexual intent without penetration |
| Aggravated sexual assault | 9 and 10 | The same by a person in authority or trust |
| Sexual harassment | 11 and 12 | Sexual remarks, gestures, showing pornography, stalking |
| Using a child for pornography | 13 to 15 | Including storing such material |
Abetment and attempt are also punishable. In 2021 the Supreme Court rejected a High Court ruling that sexual assault needed skin to skin contact, holding that sexual intent is what matters.

## Mandatory reporting
- Section 19: any person who has knowledge, or apprehends, that an offence has been or is likely to be committed must report it to the Special Juvenile Police Unit or the local police.
- Section 21: failure to report is punishable with imprisonment up to six months, a fine or both. A person in charge of an institution who fails to report an offence by a subordinate faces up to one year and a fine. Children themselves are not punished for not reporting.
- There is no exception for doctors, counsellors or psychologists, or for disclosures made in therapy.
- Section 22 punishes false complaints made to humiliate or extort, but not complaints made in good faith.

## Child friendly procedures
- The child's statement is recorded at the child's home or a place of their choice, by a woman police officer where possible, not in uniform.
- The child is not detained at a police station at night.
- The child's identity must not be disclosed in the media, section 23.
- Statements may be recorded with the help of an interpreter, special educator or expert, especially for children with disabilities.
- Special Courts hear cases in camera, in a child friendly atmosphere, with breaks; the child need not see the accused, and aggressive questioning is not allowed.
- Evidence should be recorded within 30 days of the court taking cognisance and the trial completed within one year where possible.
- The Child Welfare Committee may be informed when the child needs care and protection, and a support person can be appointed to help the child through the process.
- Compensation can be ordered for the child's medical and rehabilitation needs.

## Role of the psychologist
1. Recognise signs: sudden fear of a person or place, regression, sexualised behaviour beyond age, self harm, school refusal, unexplained injuries.
2. When a child discloses: listen calmly, believe, reassure that it is not their fault, avoid leading questions, do not promise secrecy, and record the disclosure in the child's words.
3. Report under section 19 and inform the head of the institution as per policy.
4. Support the child during investigation and trial, and help courts understand the child's needs, for example as an expert assisting a child with intellectual disability to communicate.
5. Provide or refer for trauma focused therapy, such as trauma focused CBT, and support the non offending family.
6. Prevention: body safety education in schools, training teachers and parents.

## Evaluation
Strengths:
- Gender neutral, covers a wide range of acts, including online abuse.
- Strong child friendly procedures on paper.
- Mandatory reporting increases detection.
Problems:
- Conviction rates remain low and trials are delayed beyond one year in many states.
- Mandatory reporting criminalises consensual relationships between adolescents and young adults, and may deter adolescents from seeking health care. Several High Courts have urged Parliament to consider this.
- Many families do not report abuse by relatives because of shame and dependence, and some child victims turn hostile in court.
- Special Courts and support persons are not available everywhere, and many police and doctors are not trained in child friendly practice.
- Children with disabilities face extra barriers.

## Conclusion
POCSO is a comprehensive, child centred law with tough punishments and mandatory reporting. Its success depends on trained professionals, functioning Special Courts and sensitive support for children, and its handling of adolescent relationships remains debated.`,
    keyPoints: ["Child under 18, gender neutral, consent irrelevant", "Offences in sections 3 to 15 with penalties", "Sexual intent, not skin contact, is decisive", "Section 19 mandatory reporting for all, including therapists", "Section 21 penalties for not reporting", "Child friendly recording, media ban, Special Courts, timelines", "Psychologist's role: recognise, respond, report, support, prevent", "Evaluation: low convictions, delays, adolescent relationships"],
    pitfalls: ["Saying therapists are exempt from reporting", "Missing the gender neutral and consent points", "No evaluation"],
    module: "ethics-law/3-1",
    visuals: [
      chain("Role of the psychologist", [["Listen and believe", "Calm, no blame"], ["Do not promise secrecy", "Explain what happens next"], ["Record her words", "No leading questions"], ["Report", "Police or Special Juvenile Police Unit"], ["Support and treat", "Trauma focused care, family support"]]),
      tree("Offences", [["Sexual offences against children", "POCSO 2012", -1], ["Penetrative sexual assault", "Sections 3 and 4", 0], ["Aggravated penetrative", "Sections 5 and 6", 1], ["Sexual assault", "Sections 7 and 8", 0], ["Aggravated sexual assault", "Sections 9 and 10", 3], ["Sexual harassment", "Sections 11 and 12", 0], ["Child pornography", "Sections 13 to 15", 0]]),
    ],
    ref: "POCSO Act 2012 ss 2(1)(d), 3 to 15, 19 to 24, 26, 28, 33, 35, 39; POCSO Amendment 2019; Attorney General v Satish (2021) SC on skin-to-skin; MWCD Study on Child Abuse 2007; ethics-law module 3.1",
  },
  {
    id: "eth-l04-002",
    subject: S,
    topic: "jj-act",
    marks: 10,
    difficulty: 3,
    exams: ["mcp-entrance", "ma-semester", "md-psychiatry"],
    question: "Describe the Juvenile Justice (Care and Protection of Children) Act 2015, with special reference to the preliminary assessment of children aged 16 to 18 and the role of psychologists.",
    plan: ["Two groups of children", "Bodies set up by the Act", "Classes of offences", "Section 15 preliminary assessment", "Role of psychologists and criticism"],
    answer: `## Two groups of children
The Juvenile Justice (Care and Protection of Children) Act 2015 replaced the Act of 2000. It deals with two groups of children under 18:
- Children in conflict with law: those alleged or found to have committed an offence.
- Children in need of care and protection: such as abandoned, orphaned, abused, trafficked or working children, or those whose parents cannot care for them.
Its guiding principles include presumption of innocence, best interest of the child, dignity, family responsibility, and institutionalisation as a last resort.

## Bodies under the Act
- Juvenile Justice Board: a Metropolitan or Judicial Magistrate with two social workers, at least one a woman, for children in conflict with law.
- Child Welfare Committee: for children in need of care and protection.
- Special Juvenile Police Units and child welfare police officers in every police station.
- Observation homes, special homes, places of safety, and children's homes.

## Classes of offences
| Class | Meaning |
| Petty | Maximum punishment up to 3 years |
| Serious | Maximum punishment between 3 and 7 years |
| Heinous | Minimum punishment of 7 years or more |
An amendment in 2021 clarified the category of offences with maximum punishment above seven years but no minimum, or a minimum below seven years, as serious offences.

## Section 15: preliminary assessment
The 2015 Act's most debated change followed public anger after the Delhi gang rape of December 2012, in which one accused was a juvenile.
- For a child aged 16 to 18 alleged to have committed a heinous offence, the Board conducts a preliminary assessment of the child's mental and physical capacity to commit the offence, ability to understand its consequences, and the circumstances in which it was allegedly committed.
- The Board may take the help of experienced psychologists, psychosocial workers or other experts.
- The assessment must be completed within three months of the child first appearing before the Board.
- The assessment is not a trial of guilt.
- If the Board finds the child should be tried as an adult, the case goes to the Children's Court, which may try the child as an adult or deal with the child as a juvenile. A child tried as an adult is kept in a place of safety until 21 and cannot receive the death penalty or life imprisonment without the possibility of release.
- Otherwise, the Board deals with the child, with a maximum stay of three years in a special home.

## Role of psychologists
- Conduct developmental, cognitive and personality assessments, and assess maturity, impulsivity, peer influence and mental illness.
- Prepare social investigation and individual care plans with probation officers.
- Provide counselling and rehabilitation in homes.
- Assess children in need of care and protection, such as abuse victims.

## Criticism
- No validated tool can measure "mental capacity to commit an offence"; the concept mixes legal and psychological ideas.
- Adolescent brain development, especially of the prefrontal cortex, continues into the twenties, so maturity varies widely.
- Critics argue that trying children as adults conflicts with the UN Convention on the Rights of the Child.

## Conclusion
The JJ Act aims at reform and rehabilitation, but section 15 introduces adult trial for older adolescents, giving psychologists a difficult and contested role.`,
    keyPoints: ["Children in conflict with law and children in need of care and protection", "JJ Board and Child Welfare Committee", "Petty, serious and heinous offences", "Section 15 preliminary assessment for 16 to 18 in heinous offences", "Capacity, understanding of consequences, circumstances", "Within three months; experts may help", "Children's Court; place of safety till 21; no death or life without release", "Critique on validity and adolescent development"],
    pitfalls: ["Saying all 16 year olds are tried as adults", "Calling the assessment a test of guilt"],
    module: "ethics-law/3-1",
    visuals: [chain("Section 15: preliminary assessment", [["Child 16 to 18, heinous offence", "Brought before the Board"], ["Preliminary assessment", "Capacity, understanding, circumstances"], ["Experts help", "Psychologists and psychosocial workers"], ["Decision within three months", "Board"], ["Children's Court or the Board", "Adult trial or juvenile process"]])],
    ref: "JJ (Care and Protection of Children) Act 2015 ss 2(12), 2(13), 2(14), 2(33), 2(45), 2(54), 4, 15, 18, 19, 27; JJ Amendment Act 2021; ethics-law module 3.1",
  },
  {
    id: "eth-l04-003",
    subject: S,
    topic: "rpwd-act",
    marks: 20,
    difficulty: 3,
    exams: ["mcp-entrance", "ugc-net", "ma-semester", "md-psychiatry"],
    question: "Critically discuss the Rights of Persons with Disabilities Act 2016. How does it differ from the Persons with Disabilities Act 1995, and what are its implications for persons with mental illness and intellectual disability?",
    plan: ["From the 1995 Act to the 2016 Act", "Definitions and the 21 disabilities", "Rights and entitlements", "Guardianship and legal capacity", "Implementation and offences", "Critique and implications"],
    answer: `## From 1995 to 2016
The Persons with Disabilities (Equal Opportunities, Protection of Rights and Full Participation) Act 1995 recognised seven disabilities and followed a largely welfare and medical approach. After India ratified the UN Convention on the Rights of Persons with Disabilities in 2007, a new law was needed. The Rights of Persons with Disabilities Act 2016 came into force on 19 April 2017.

## Definitions
- A person with disability is a person with long term physical, mental, intellectual or sensory impairment which, in interaction with barriers, hinders full and effective participation in society equally with others. This reflects the social model: disability arises from the interaction of impairment and barriers.
- A person with benchmark disability has not less than 40 per cent of a specified disability, as certified.
- A person with disability having high support needs requires intensive support.
- The Act lists 21 specified disabilities, grouped as physical, intellectual, mental behaviour, chronic neurological conditions, blood disorders and multiple disabilities.

## Disabilities relevant to psychology
- Intellectual disability, including specific learning disabilities such as dyslexia, dysgraphia and dyscalculia, and autism spectrum disorder.
- Mental illness, defined as in mental health law, excluding intellectual disability.
- Chronic neurological conditions such as multiple sclerosis and Parkinson's disease.
- Multiple disabilities, including deaf blindness.

## Comparison with the 1995 Act
| Feature | 1995 Act | 2016 Act |
| Number of disabilities | 7 | 21 |
| Model | Medical and welfare | Social and rights based |
| Learning disability and autism | Not included | Included |
| Reservation in government jobs | 3 per cent | At least 4 per cent |
| Reservation in higher education | 3 per cent | At least 5 per cent |
| Legal capacity | Not addressed | Equal recognition, limited guardianship |
| Offences | Few | Offences and special courts |

## Rights and entitlements
1. Equality and non discrimination, section 3, including reasonable accommodation: appropriate changes, such as extra time or a scribe in examinations, that do not impose a disproportionate burden.
2. Protection from abuse, violence and exploitation, section 7, with duties on police and magistrates.
3. Free education for children with benchmark disabilities aged 6 to 18 in a neighbourhood or special school, section 31, and inclusive education duties.
4. At least 5 per cent reserved seats in government and government aided higher education institutions, section 32.
5. At least 4 per cent reservation of posts in government establishments for persons with benchmark disabilities, section 34, with one per cent shared among intellectual disability, autism, specific learning disability, mental illness and multiple disabilities.
6. Accessibility of buildings, transport and information.
7. Social security, health care and rehabilitation.

## Guardianship and legal capacity
- Section 13 recognises that persons with disabilities enjoy legal capacity on an equal basis with others.
- Section 14 provides for limited guardianship: where a person cannot take legally binding decisions even with support, a District Court or designated authority may appoint a limited guardian who takes joint decisions with the person, consulting them, for a limited period and for specific decisions. This replaces total guardianship as the default.

## Implementation
- Certification by notified medical authorities using notified guidelines, with a national Unique Disability ID card.
- Chief Commissioner for Persons with Disabilities at the national level and State Commissioners to monitor rights and hear complaints.
- Special Courts in each district for offences, and special public prosecutors.
- Offences under section 92, such as insulting or assaulting a person with disability, denying food or water, or sexually exploiting a woman or child with disability, carry imprisonment from six months to five years and a fine.

## Implications for mental illness and intellectual disability
- People with severe mental illness can now get certificates, using the Indian Disability Evaluation and Assessment Scale, and access reservations and social security.
- Children with dyslexia and autism get legal rights to accommodations in schools and examinations.
- Psychologists play a key role in assessment for certification, using IQ tests, adaptive behaviour scales, autism scales and learning disability batteries.
- The guardianship provisions require psychologists to support decision making rather than assume incapacity.

## Critique
- Certification still depends on percentage scores, a medical idea that sits uneasily with the social model.
- Fluctuating conditions such as bipolar disorder are hard to fit into fixed percentages.
- Reservation of one per cent shared among five groups leaves people with mental illness competing with other groups.
- Limited guardianship still allows substitute decisions, short of the Convention's full supported decision making.
- Implementation is uneven: many states delayed rules, Special Courts are few, and awareness among employers and schools is low.
- The overlap with the Mental Healthcare Act and the National Trust Act 1999 is not fully harmonised.

## Conclusion
The RPwD Act moves Indian disability law from charity to rights and brings mental illness, autism and learning disability within its protection. Its success depends on fair certification, real accommodation and funding.`,
    keyPoints: ["1995 Act with 7 disabilities to 2016 Act with 21, in force 19 April 2017", "Social model definition and benchmark of 40 per cent", "Mental illness, intellectual disability, SLD and autism included", "Reasonable accommodation and non discrimination", "5 per cent higher education and 4 per cent jobs reservation", "Legal capacity and limited guardianship, sections 13 and 14", "Commissioners, Special Courts and section 92 offences", "Critique: percentages, fluctuating illness, shared quota, implementation"],
    pitfalls: ["Old figures of 3 per cent", "Leaving out legal capacity", "Not linking to psychological practice"],
    module: "ethics-law/3-2",
    visuals: [
      compare("Comparison with the 1995 Act", ["Persons with Disabilities Act 1995", ["Seven disabilities", "Medical and welfare model", "3 per cent reservation", "No legal capacity provision"], "Charity based"], ["RPwD Act 2016", ["21 disabilities", "Social and rights model", "4 per cent jobs, 5 per cent higher education", "Limited guardianship"], "Rights based"]),
      tree("Disabilities relevant to psychology", [["Specified disabilities", "21 in all", -1], ["Intellectual disability", "Includes learning disability and autism", 0], ["Specific learning disability", "Dyslexia, dysgraphia, dyscalculia", 1], ["Autism spectrum disorder", "Assessed with ISAA", 1], ["Mental illness", "Assessed with IDEAS", 0], ["Chronic neurological conditions", "Multiple sclerosis, Parkinson's disease", 0]]),
    ],
    ref: "RPwD Act 2016 (49 of 2016) ss 2(s), 2(r), 2(t), 3, 7, 13, 14, 31, 32, 34, 74, 79, 84, 92, Schedule; in force 19 April 2017; PwD Act 1995; ethics-law module 3.2",
  },
  {
    id: "eth-l04-004",
    subject: S,
    topic: "ideas",
    marks: 10,
    difficulty: 4,
    exams: ["mcp-entrance", "md-psychiatry", "ma-semester"],
    question: "How is disability due to mental illness assessed and certified in India? Describe the Indian Disability Evaluation and Assessment Scale and discuss its strengths and limits.",
    plan: ["Why certification matters", "Who certifies", "IDEAS: domains and scoring", "Practical steps", "Strengths and limits"],
    answer: `## Why it matters
A disability certificate opens reservations in jobs and education, pensions, travel concessions and other benefits under the Rights of Persons with Disabilities Act 2016. Mental illness was included as a disability, but because it is invisible and often fluctuating, a fair method of measuring its impact was needed.

## Who certifies
Certification is done by medical authorities notified by the state government, usually a board at a government hospital that includes a psychiatrist. A national Unique Disability ID card is then issued. Guidelines notified by the Ministry of Social Justice and Empowerment specify the tools to be used.

## The Indian Disability Evaluation and Assessment Scale
IDEAS was developed by the Indian Psychiatric Society for this purpose and adopted in the government guidelines for certifying mental illness disability.
- It rates disability in four areas:
1. Self care: hygiene, grooming, eating.
2. Interpersonal activities: social relationships.
3. Communication and understanding.
4. Work: employment, housework or studies.
- Each area is rated from 0, meaning no disability, to 4, meaning profound disability, based on interview with the person and family and on records.
- The duration of illness is scored separately.
- The area scores and the duration score are added to give a global score, which is converted to a percentage of disability using the table in the notified guidelines. A global score of 7 or more corresponds to 40 per cent or more, the benchmark for most benefits.

## Practical steps
1. Confirm the diagnosis using accepted classification.
2. Check the illness has been treated adequately, so that disability reflects the stable state, not an untreated phase.
3. Interview the person and a reliable informant, and review records.
4. Rate each area and duration, add, and convert.
5. Record the percentage and date for review, since mental illness can improve.

## Strengths
- Simple, quick and usable in district hospitals.
- Focuses on functioning, not just diagnosis.
- Developed in India, with items suited to Indian life, such as housework as work.
- Has shown acceptable reliability in Indian studies.

## Limits
- Ratings depend on informants and the rater's judgement.
- Fluctuating illnesses, such as bipolar disorder, are hard to capture in one assessment.
- The use of a percentage sits uneasily with the social model of disability.
- Stigma prevents many eligible people from applying.
- Cognitive impairments that affect work are not rated in detail.

## Conclusion
IDEAS turns the functional impact of mental illness into a certifiable percentage. It has made benefits accessible, but it needs careful use, review and awareness.`,
    keyPoints: ["Certificate opens RPwD benefits", "Notified medical authority with a psychiatrist; UDID card", "IDEAS by the Indian Psychiatric Society", "Four areas: self care, interpersonal, communication, work", "Each rated 0 to 4, duration scored separately", "Global score to percentage; 7 or more means 40 per cent or more", "Assess after adequate treatment and review later", "Limits: informants, fluctuation, stigma"],
    pitfalls: ["Using IQ tests for mental illness disability", "Rating during an untreated episode"],
    module: "ethics-law/3-2",
    visuals: [layers("The Indian Disability Evaluation and Assessment Scale", "stack", [["Self care", "Hygiene, grooming, eating"], ["Interpersonal activities", "Social relationships"], ["Communication and understanding", "Talking, following instructions"], ["Work", "Job, housework or study"], ["Duration of illness", "Scored separately and added"]])],
    ref: "IDEAS, Indian Psychiatric Society; MSJE guidelines for evaluation of mental illness disability, Gazette 2002 and RPwD notified guidelines; PMC7750839 (IDEAS scoring, global score 7 equals 40 percent) checked Nov 2026",
  },
  {
    id: "eth-l04-005",
    subject: S,
    topic: "insanity",
    marks: 15,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Discuss the insanity defence in Indian law with reference to section 22 of the Bharatiya Nyaya Sanhita and the M'Naghten rules. Distinguish it from fitness to stand trial and describe the role of the mental health expert.",
    plan: ["Origin: the M'Naghten case", "Section 22 and its elements", "Legal versus medical insanity", "Fitness to stand trial", "The expert's role", "Critique"],
    answer: `## The M'Naghten rules
In 1843, Daniel M'Naghten, who believed he was persecuted by the British government, shot and killed Edward Drummond, the private secretary of Prime Minister Robert Peel. He was acquitted on the ground of insanity. After public outcry, the House of Lords put questions to judges, whose answers became the M'Naghten rules: a person is not responsible if, at the time of the act, he was labouring under such a defect of reason, from disease of the mind, as not to know the nature and quality of the act, or, if he did know it, that he did not know what he was doing was wrong.

## Section 22 of the Bharatiya Nyaya Sanhita
The Indian Penal Code of 1860 adopted these rules in section 84. On 1 July 2024 the Bharatiya Nyaya Sanhita replaced the Code, and section 22 now provides: nothing is an offence which is done by a person who, at the time of doing it, by reason of unsoundness of mind, is incapable of knowing the nature of the act, or that he is doing what is either wrong or contrary to law. The wording is unchanged from section 84.
Elements:
1. Unsoundness of mind at the time of the act.
2. As a result, incapacity to know either the nature of the act, or that it was wrong or contrary to law.
3. The burden of proving the exception lies on the accused, on a balance of probabilities, under the evidence law.
Intoxication is dealt with separately: involuntary intoxication can be a defence, while voluntary intoxication is not.

## Legal and medical insanity
Indian courts distinguish medical insanity, the presence of a psychiatric diagnosis, from legal insanity, the incapacity the section requires. A person with schizophrenia who planned an attack, hid the weapon and fled may be medically ill but legally sane, because his actions show he knew the act was wrong. Courts look at conduct before, during and after the act, motive, history of illness and treatment, and medical evidence. The Supreme Court has repeatedly said that every person with mental illness is not legally exempt.

## Fitness to stand trial
| Insanity defence | Fitness to stand trial |
| Mental state at the time of the act | Mental state at the time of trial |
| Decides criminal responsibility | Decides whether trial can proceed now |
| BNS section 22 | BNSS sections 367 to 378 |
| Leads to acquittal, often with detention for treatment | Leads to postponement and treatment, then resumption |
Under the Bharatiya Nagarik Suraksha Sanhita, if the accused appears to be of unsound mind and incapable of making a defence, the magistrate or court inquires, with medical examination, and may postpone proceedings, release the accused on security or order treatment, and resume trial when the person becomes fit. A person acquitted on the ground of unsoundness of mind is detained in safe custody or handed to relatives with safeguards. The Mental Healthcare Act requires that such persons receive treatment in a mental health establishment.

## The expert's role
- Under section 39 of the Bharatiya Sakshya Adhiniyam, the opinion of experts, including psychiatrists and psychologists, is relevant evidence.
- The expert examines the accused, reviews records and informant accounts, and reconstructs the mental state at the time of the act.
- Psychological testing can add information on intellectual ability, malingering and personality.
- The expert gives an opinion on diagnosis and its effect on capacity, but leaves the legal question of responsibility to the court.
- The expert must be impartial, stay within competence, explain in plain language and resist pressure from either side.

## Example
A farmer in Bihar kills his neighbour with an axe, believing the neighbour is a demon sent to kill his children. He makes no attempt to hide and tells police God commanded him. Records show schizophrenia with poor treatment. The expert's report describes how the delusion meant he did not know the act was wrong, supporting the section 22 plea.

## Critique
- The M'Naghten test focuses only on knowledge and ignores volition: a person may know an act is wrong but be unable to control it, which other tests such as the irresistible impulse test recognise.
- Courts sometimes rely on lay evidence of conduct over expert opinion.
- Many accused have no access to proper psychiatric evaluation, and some are detained for years after acquittal.

## Conclusion
India's insanity defence, now in section 22 of the BNS, keeps the narrow cognitive M'Naghten test. Experts must distinguish diagnosis from legal incapacity and keep the defence of responsibility separate from fitness to stand trial.`,
    keyPoints: ["M'Naghten case of 1843 and the rules", "IPC 84 replaced by BNS 22 on 1 July 2024 with the same wording", "Elements: unsoundness at the time, incapacity to know nature or wrongness", "Burden on the accused, balance of probabilities", "Legal versus medical insanity, conduct as evidence", "Fitness to stand trial under BNSS 367 to 378", "Expert evidence under BSA 39 and the expert's duties", "Critique: cognitive test only"],
    pitfalls: ["Confusing insanity with fitness to stand trial", "Still citing only IPC 84 without the BNS", "Saying a diagnosis alone proves insanity"],
    module: "ethics-law/3-3",
    visuals: [
      compare("Fitness to stand trial", ["Insanity defence", ["State at the time of the act", "BNS section 22", "Decides responsibility", "Acquittal and treatment"], "Looks back"], ["Fitness to stand trial", ["State at the time of trial", "BNSS sections 367 to 378", "Decides if trial can go on", "Postpone, treat, resume"], "Looks at now"]),
      vis("build", { vignette: "A farmer kills his neighbour with an axe, believing the neighbour is a demon. He does not hide and says God commanded him. He has poorly treated schizophrenia.", rule: "Section 22 needs unsoundness of mind at the time causing incapacity to know the nature of the act or that it was wrong.", symptoms: [{ label: "Unsoundness of mind at the time", present: true, core: true }, { label: "Did not know the act was wrong", present: true, core: true, why: "He believed he was killing a demon on God's command." }, { label: "Tried to hide or escape", present: false, why: "Concealment would suggest knowledge of wrongness." }], need: 2, needCore: true, verdict: "The facts support a section 22 plea; the court decides." }, "Example"),
    ],
    ref: "M'Naghten's Case (1843) 10 Cl & F 200; IPC s 84; BNS 2023 ss 22 to 24; BNSS 2023 ss 367 to 378; BSA 2023 s 39; in force 1 July 2024; ethics-law module 3.3",
  },
  {
    id: "eth-l04-006",
    subject: S,
    topic: "ndps",
    marks: 5,
    difficulty: 3,
    exams: ["md-psychiatry", "ma-semester"],
    question: "Write a short note on the Narcotic Drugs and Psychotropic Substances Act 1985 and section 64A, with reference to treatment of substance use disorders.",
    plan: ["What the Act does", "Consumption and small quantity", "Section 64A", "Clinical relevance"],
    answer: `## The Act
The Narcotic Drugs and Psychotropic Substances Act 1985 controls the production, sale, possession and use of narcotic drugs, such as opium, heroin, morphine and cannabis, and psychotropic substances, such as some benzodiazepines and amphetamines. Punishment depends on whether the quantity is small, intermediate or commercial, as notified for each substance.

## Consumption
Section 27 punishes consumption of drugs. People who use drugs, rather than trade in them, can therefore be prosecuted, which pushes them away from treatment.

## Section 64A
Section 64A gives immunity from prosecution to an addict who is charged with consumption, or with possessing a small quantity for personal use, if the person volunteers to seek treatment for de addiction from a hospital or institution maintained or recognised by government or a local authority, and undergoes it. The immunity can be withdrawn if the person does not complete treatment.

## Clinical relevance
- Clinicians should tell patients and families about section 64A, as it allows treatment instead of punishment.
- The Act also regulates medicines, including the use of opioids for opioid substitution therapy, such as buprenorphine and methadone, which need licensed centres.
- Morphine for pain was hard to obtain for years; a 2014 amendment eased access to essential narcotic medicines for palliative care.
- The Mental Healthcare Act includes substance related conditions as mental illness, so people with substance use disorders have rights to care.

## Conclusion
Section 64A is a bridge between criminal law and treatment, but low awareness limits its use.`,
    keyPoints: ["Controls narcotic drugs and psychotropic substances", "Small, intermediate and commercial quantities", "Section 27 punishes consumption", "Section 64A immunity for volunteering for treatment", "Applies to consumption and small quantity for personal use", "Treatment at government recognised centres", "2014 amendment on essential narcotic medicines"],
    pitfalls: ["Saying 64A covers trafficking", "Forgetting the need to complete treatment"],
    module: "ethics-law/3-3",
    visuals: [chain("Section 64A", [["Charged with consumption or small quantity", "Personal use only"], ["Volunteers for treatment", "Government recognised centre"], ["Completes de addiction", "Immunity from prosecution"], ["Does not complete", "Immunity can be withdrawn"]])],
    ref: "NDPS Act 1985 ss 2, 27, 64A; NDPS Amendment Act 2014 (essential narcotic drugs); ethics-law module 3.3",
  },
  {
    id: "eth-l04-007",
    subject: S,
    topic: "case-law",
    marks: 15,
    difficulty: 4,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Discuss landmark Indian court judgments that have shaped mental health practice, with reference to privacy, sexuality, end of life decisions, conversion therapy, mental illness in criminal justice and student mental health.",
    plan: ["Courts as drivers of reform", "Privacy: Puttaswamy", "Sexuality: Navtej Singh Johar and Sushma", "End of life: Common Cause", "Criminal justice: Accused X and Erwadi orders", "Student mental health and lessons"],
    answer: `## Courts as drivers of reform
In India, courts have often moved faster than legislatures on mental health. Public interest litigation has exposed conditions in asylums, and constitutional judgments have defined rights that the Mental Healthcare Act 2017 then wrote into law.

## Privacy: Justice K S Puttaswamy v Union of India in 2017
A nine judge bench held that privacy is a fundamental right under Article 21, including bodily integrity, personal information and decisional autonomy. For mental health, it grounds confidentiality of records, the right to make treatment decisions, and the need for a data protection law, which came as the Digital Personal Data Protection Act 2023. Any intrusion must pass tests of legality, necessity and proportionality.

## Sexuality: Navtej Singh Johar v Union of India in 2018
A five judge bench read down section 377 of the Indian Penal Code, decriminalising consensual sexual acts between adults of the same sex. The court relied on the Indian Psychiatric Society's statement that homosexuality is not a mental illness, and on the Mental Healthcare Act's ban on discrimination by sexual orientation. Professionals must therefore treat sexual orientation as a normal variation, not a disorder to be cured.

## Conversion therapy: S Sushma v Commissioner of Police in 2021
A lesbian couple in Tamil Nadu sought protection from their families. The Madras High Court issued guidelines for police and others, and directed action against professionals who attempt to "cure" sexual orientation. Following this, the National Medical Commission in 2022 declared conversion therapy professional misconduct.

## End of life: Common Cause v Union of India in 2018
The Supreme Court recognised the right to die with dignity as part of Article 21, allowed passive euthanasia and gave legal force to living wills, with procedures that were simplified in 2023. This parallels advance directives under the Mental Healthcare Act and shows the courts' respect for autonomy in health decisions.

## Criminal justice
- Accused X v State of Maharashtra in 2019: the Supreme Court held that severe mental illness developing after conviction is a mitigating factor that bars execution, commuting a death sentence, and asked for proper mental health evaluation of prisoners.
- In the Erwadi case, after the 2001 fire in which 28 chained people died at a shrine, the Supreme Court took up the matter and ordered surveys of mental health facilities, an end to chaining and inspections across states.
- Courts have repeatedly directed release and treatment of people held in jails for years only because of mental illness or unfitness to stand trial.

## Student mental health: Sukdeb Saha v State of Andhra Pradesh in 2025
Hearing a case of the death of a 17 year old student preparing for a competitive examination, the Supreme Court declared mental health part of the right to life under Article 21 and, noting a legislative vacuum, issued binding interim guidelines for all schools, colleges, universities and coaching centres. These include a uniform mental health policy, qualified counsellors in institutions with more than 100 students, twice yearly staff training, avoiding public shaming and batch segregation by marks, and safety measures in hostels.

## Summary table
| Case | Year | Principle |
| Puttaswamy | 2017 | Privacy is a fundamental right |
| Navtej Singh Johar | 2018 | Homosexuality not a crime or illness |
| Common Cause | 2018 | Living wills and dignity in dying |
| Accused X | 2019 | Post conviction mental illness bars execution |
| S Sushma | 2021 | Conversion therapy prohibited |
| Sukdeb Saha | 2025 | Student mental health duties of institutions |

## Lessons for professionals
- Rights in the Constitution shape day to day practice: confidentiality, consent, non discrimination.
- Professional bodies' scientific statements influence judgments, so psychologists have a role in advocacy.
- Court orders are only as good as their implementation, which needs professionals to act.

## Conclusion
Indian courts have made mental health a matter of fundamental rights, from privacy and sexuality to the care of prisoners and students.`,
    keyPoints: ["Puttaswamy 2017 privacy and its tests", "Navtej Singh Johar 2018 and reliance on the IPS statement", "S Sushma 2021 and NMC 2022 on conversion therapy", "Common Cause 2018 living wills", "Accused X 2019 on post conviction mental illness", "Erwadi orders after 2001", "Sukdeb Saha 2025 student mental health guidelines", "Implications for practice and advocacy"],
    pitfalls: ["Listing cases without the principle", "Wrong years", "No link to practice"],
    module: "ethics-law/3-3",
    visuals: [timeline("Put the judgments in order", [["Erwadi fire leads to Supreme Court orders", "2001"], ["Puttaswamy: privacy", "2017"], ["Navtej Singh Johar and Common Cause", "2018"], ["Accused X: no execution after severe mental illness", "2019"], ["S Sushma: conversion therapy", "2021"], ["Sukdeb Saha: student mental health guidelines", "2025"]], "Courts turned mental health into a question of fundamental rights.")],
    ref: "Puttaswamy (2017) 10 SCC 1; Navtej Singh Johar (2018) 10 SCC 1; Common Cause (2018) 5 SCC 1, modified 2023; Accused X v State of Maharashtra (2019) 7 SCC 1; S Sushma v Commissioner of Police, Madras HC 2021; NMC 2022; Sukdeb Saha v State of AP 2025 INSC 893 (25 July 2025, guidelines checked on scroll.in Nov 2026)",
  },
  {
    id: "eth-l04-008",
    subject: S,
    topic: "research-ethics",
    marks: 15,
    difficulty: 3,
    exams: ["mcp-entrance", "ugc-net", "ma-semester"],
    question: "Trace the history of research ethics and describe the main principles of ethical research with human participants, with reference to the ICMR National Ethical Guidelines 2017.",
    plan: ["Abuses that shaped research ethics", "International codes", "ICMR 2017 and its principles", "Consent, vulnerability, deception and privacy", "Ethics committees and registration", "Example"],
    answer: `## Abuses that shaped research ethics
- Nazi doctors conducted brutal experiments on prisoners in concentration camps. At the Nuremberg trials of 1947, the judges set out the Nuremberg Code, starting with the rule that voluntary consent is absolutely essential.
- In the Tuskegee study in the United States, from 1932 to 1972, poor Black men with syphilis were left untreated, even after penicillin became available, to observe the disease.
- In psychology, Stanley Milgram's obedience studies of the 1960s caused severe stress through deception, raising questions about debriefing and the right to withdraw.

## International codes
- The Declaration of Helsinki by the World Medical Association in 1964, revised many times, set rules for medical research, including independent ethics review.
- The Belmont Report of 1979 named three principles: respect for persons, which requires consent and protection of those with reduced autonomy; beneficence, meaning maximise benefits and minimise harms; and justice, meaning fair selection of participants and fair sharing of benefits and burdens.

## The ICMR National Ethical Guidelines 2017
The Indian Council of Medical Research issued its national ethical guidelines for biomedical and health research involving human participants in 2017, replacing those of 2006. They include sections on social and behavioural research, which apply to psychology. General principles include:
1. Essentiality: research must be necessary.
2. Voluntariness: free, informed consent, with the right to withdraw.
3. Non exploitation: fair selection and benefit sharing.
4. Social responsibility.
5. Privacy and confidentiality.
6. Risk minimisation.
7. Professional competence.
8. Maximisation of benefit.
9. Institutional arrangements, including ethics committees.
10. Transparency and accountability.
11. Totality of responsibility.
12. Environmental protection.

## Key issues
- Informed consent: in the participant's language, with audio visual recording required by regulators for some drug trials, and special procedures for illiterate participants, such as an impartial witness.
- Vulnerable groups: children, pregnant women, prisoners, people with mental illness or cognitive impairment, and economically or socially disadvantaged people need added protection. For people with mental illness who cannot consent, section 99 of the Mental Healthcare Act adds State Authority permission and nominated representative consent.
- Children: parental consent and the child's assent, with assent from about seven years.
- Deception: allowed only when essential, with low risk and full debriefing.
- Privacy: data anonymised, stored securely, used only for the stated purpose, as also required by the Digital Personal Data Protection Act.
- Compensation for research related injury.

## Ethics committees and registration
- Every institution conducting research must have an ethics committee with members from different backgrounds, including a lay person and a legal expert, which reviews protocols, consent forms and progress.
- Clinical trials must be registered on the Clinical Trials Registry of India before enrolling the first participant, and drug trials are governed by the New Drugs and Clinical Trials Rules 2019.

## Special issues in psychological research
- Online surveys must still give a consent page, protect IP addresses and allow withdrawal.
- Research with students by their own teachers risks pressure to take part; recruitment should be done by someone else.
- Sensitive topics such as suicide, abuse or sexuality need a distress protocol and referral details for every participant.
- Incentives should compensate time, not be so large that they become undue inducement for poor participants.

## Example
A psychology student in Varanasi plans to survey widows about grief. The ethics committee asks for consent forms in Hindi, oral consent with a witness for those who cannot read, a referral plan for participants who become distressed, and anonymous data storage.

## Conclusion
Research ethics grew from abuses into a system of codes and committees. In India, the ICMR guidelines, ethics committees, trial registration and the Mental Healthcare Act together protect participants while allowing research that benefits society.`,
    keyPoints: ["Nazi experiments and the Nuremberg Code 1947", "Tuskegee 1932 to 1972 and Milgram", "Helsinki 1964 and Belmont 1979 principles", "ICMR 2017 guidelines and their general principles", "Consent, vulnerability, deception and privacy", "MHCA section 99 for people unable to consent", "Ethics committees and CTRI registration", "Worked example"],
    pitfalls: ["Leaving out Indian guidelines", "Listing principles without examples"],
    module: "ethics-law/3-4",
    visuals: [
      timeline("Put research ethics in order", [["Tuskegee study begins", "1932"], ["Nuremberg Code", "1947"], ["Declaration of Helsinki", "1964"], ["Belmont Report", "1979"], ["ICMR national ethical guidelines", "2017"], ["New Drugs and Clinical Trials Rules", "2019"]], "Each code followed a scandal."),
      layers("Ethics committees and registration", "stack", [["Researcher", "Writes protocol and consent forms"], ["Ethics committee", "Mixed members, including a lay person, review and approve"], ["Trial registration", "CTRI before the first participant"], ["Monitoring", "Progress reports and adverse events"]]),
    ],
    ref: "Nuremberg Code 1947; Declaration of Helsinki 1964; Belmont Report 1979; ICMR National Ethical Guidelines for Biomedical and Health Research Involving Human Participants 2017; NDCT Rules 2019; CTRI mandatory since 2009; MHCA s 99; ethics-law module 3.4",
  },
  {
    id: "eth-l04-009",
    subject: S,
    topic: "conversion-therapy",
    marks: 5,
    difficulty: 3,
    exams: ["mcp-entrance", "ma-semester", "md-psychiatry"],
    question: "Write a short note on the legal and ethical position of conversion therapy in India.",
    plan: ["What conversion therapy is", "Scientific position", "Legal position in India", "Professional response"],
    answer: `## What it is
Conversion therapy refers to any attempt to change a person's sexual orientation or gender identity, through talk, aversive conditioning, prayer, medication or coercion. In India it has included electric shocks, forced marriage, confinement and "corrective" rituals, often at the insistence of families.

## Scientific position
- Homosexuality was removed from the American classification in 1973 and from the WHO classification in 1990.
- The Indian Psychiatric Society stated in 2018 that homosexuality is not a mental illness.
- There is no evidence that conversion efforts work, and strong evidence that they cause depression, anxiety, shame and suicide attempts.

## Legal position
- In 2018 the Supreme Court in Navtej Singh Johar decriminalised consensual same sex relations.
- The Mental Healthcare Act 2017 forbids discrimination on the basis of sexual orientation and requires that diagnosis not be based on non conformity with social or moral values.
- In 2021, in S Sushma v Commissioner of Police, the Madras High Court directed action against professionals involved in conversion therapy.
- In 2022 the National Medical Commission declared conversion therapy professional misconduct for doctors.
- The Transgender Persons (Protection of Rights) Act 2019 protects gender identity.

## Professional response
- Never offer or refer for conversion therapy, even under family pressure.
- Offer affirmative support, help the person with stigma and family conflict, and work with families towards acceptance.
- Treat any distress, depression or anxiety on its own terms.

## Conclusion
Conversion therapy is unscientific, harmful and now professional misconduct in India.`,
    keyPoints: ["Definition and forms in India", "Removal from classifications 1973 and 1990", "IPS 2018 statement", "No evidence of benefit; evidence of harm", "Navtej 2018, MHCA non discrimination", "Sushma 2021 and NMC 2022", "Affirmative practice instead"],
    pitfalls: ["Saying it is allowed with consent", "Missing the NMC ruling"],
    module: "ethics-law/1-4",
    visuals: [timeline("Put the milestones in order", [["Removed from the American classification", "1973"], ["Removed from the WHO classification", "1990"], ["Navtej Singh Johar and the IPS statement", "2018"], ["Madras High Court in S Sushma", "2021"], ["NMC calls it misconduct", "2022"]])],
    ref: "APA DSM-II revision 1973; ICD-10 1990; IPS position statement 2018; Navtej Singh Johar 2018; S Sushma v Commissioner of Police, Madras HC 2021; NMC 2022; Transgender Persons Act 2019; ethics-law module 1.4",
  },
  {
    id: "eth-l04-010",
    subject: S,
    topic: "student-mental-health",
    marks: 10,
    difficulty: 3,
    exams: ["mcp-entrance", "ugc-net", "ma-semester"],
    question: "Discuss the legal and ethical responsibilities of educational institutions towards student mental health in India, with reference to the Supreme Court guidelines of 2025.",
    plan: ["The problem of student suicides", "The 2025 judgment", "The main guidelines", "Role of counsellors and psychologists", "Ethical issues and gaps"],
    answer: `## The problem
Student suicides have risen in India, with National Crime Records Bureau data showing more than 13,000 student suicides in 2022. Coaching hubs such as Kota have drawn attention to pressure, isolation and lack of support. Until 2025 there was no binding national framework for institutions.

## The 2025 judgment
In Sukdeb Saha v State of Andhra Pradesh, decided on 25 July 2025, the Supreme Court heard the case of a 17 year old student who died in a hostel in Visakhapatnam. Besides transferring the investigation, the court held that mental health is part of the right to life under Article 21, noted a legislative and regulatory vacuum, and issued guidelines binding on all schools, colleges, universities, coaching centres and hostels until a law or regulation is made.

## The main guidelines
1. Every institution must adopt a uniform mental health policy, based on the UMMEED draft guidelines, the Manodarpan initiative and the National Suicide Prevention Strategy, reviewed every year and published.
2. Institutions with more than 100 students must appoint at least one qualified counsellor, psychologist or social worker trained in child and adolescent mental health. Smaller ones must have formal referral links.
3. All teaching and non teaching staff must receive mental health training at least twice a year from qualified professionals, including recognising warning signs and responding to self harm.
4. Avoid harmful practices: public shaming, unrealistic targets and segregating students into batches by marks.
5. Residential institutions must install tamper proof ceiling fans or similar devices and restrict access to rooftops and other high risk areas.
6. Coaching hubs in cities such as Kota, Jaipur, Sikar, Chennai, Hyderabad, Delhi and Mumbai must apply stronger protections.

## Role of counsellors
- Screening and early identification, with consent.
- Brief interventions and crisis response, including suicide risk assessment and safety planning.
- Referral to psychiatric services when needed.
- Confidential records and respect for privacy, with disclosure only for serious risk or legal duties such as POCSO.
- Training teachers as gatekeepers.

## Ethical issues and gaps
- Counsellors employed by institutions may face pressure to report students to management; they must protect confidentiality.
- Means restriction must not become surveillance that ignores causes like academic pressure.
- There are too few trained professionals, especially in small towns.
- Without monitoring, policies may exist only on paper.

## Conclusion
The 2025 guidelines make institutions legally responsible for student wellbeing. Psychologists are central to making them work, while protecting students' privacy and dignity.`,
    keyPoints: ["Scale of student suicides from NCRB data", "Sukdeb Saha 25 July 2025: mental health within Article 21", "Binding interim guidelines for all institutions", "Uniform policy based on UMMEED, Manodarpan and the suicide prevention strategy", "Counsellor where more than 100 students; staff training twice a year", "No shaming or batch segregation; safety measures in hostels", "Counsellor duties and confidentiality tensions"],
    pitfalls: ["Inventing a counsellor to student ratio", "No ethical analysis"],
    module: "ethics-law/3-1",
    visuals: [layers("The main guidelines", "stack", [["Mental health policy", "Uniform, reviewed every year, published"], ["Counsellors", "Where more than 100 students; referral links for smaller places"], ["Training", "All staff twice a year"], ["Safe culture", "No shaming or batch segregation by marks"], ["Safe spaces", "Tamper proof fans, restricted rooftops"]])],
    ref: "Sukdeb Saha v State of Andhra Pradesh 2025 INSC 893, 25 July 2025 (Vikram Nath and Sandeep Mehta JJ), guidelines per scroll.in 27 July 2025 checked Nov 2026; NCRB ADSI 2022 (13,044 student suicides); UMMEED draft 2023; NSPS 2022",
  },
]);
