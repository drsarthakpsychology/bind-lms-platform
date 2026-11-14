import type { LongQA } from "@/lib/prep/long-types";
import type { PrepVisual } from "@/lib/prep/types";
import type { FigureData } from "@/lib/study/types";
import { anchored, chain, compare, layers, tree, vis } from "./visual";

const S = "ethics-law" as const;
const fig = (id: string, caption: string): PrepVisual => ({ kind: "figure", data: { id } satisfies FigureData, caption });

export const ETHICS_LAW_L02: LongQA[] = anchored([
  {
    id: "eth-l02-001",
    subject: S,
    topic: "mhca-admission-minors",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Describe the procedure and safeguards for the admission of a minor to a mental health establishment under section 87 of the Mental Healthcare Act 2017.",
    plan: ["Who is a minor and why special rules", "Application and the two examinations", "The four conditions for admission", "Accommodation, attendant and consent", "Board reporting and review timelines"],
    answer: `## Why minors need special rules
Under the Mental Healthcare Act 2017 a minor is a person below 18 years. A child cannot be an independent patient: the minor's nominated representative, ordinarily the legal guardian under section 15, acts for the child. Because children are vulnerable to both neglect and over use of hospital care, section 87 lays down that a minor may be admitted only through its own procedure, with stricter checks than for adults.

## Application and examination
1. The nominated representative applies to the medical officer or mental health professional in charge of the establishment.
2. Two professionals must examine the child independently, on the day of admission or in the seven days before it. The pair may be two psychiatrists, a psychiatrist and a mental health professional, or a psychiatrist and a medical practitioner.
3. Both must independently conclude that all four conditions below are met.

## The four conditions
- The minor has a mental illness of a severity that requires admission.
- Admission is in the best interest of the minor's health, wellbeing or safety, taking into account the child's own wishes where they can be found out, and the reasons for them.
- The child's care needs cannot be met unless admitted.
- All community based alternatives have failed or are clearly unsuitable.

## Care during admission
- Separate accommodation from adults, in an environment suited to the child's age and developmental needs, at least as good as that given to children admitted for physical illness.
- The nominated representative, or an attendant appointed by them, stays with the minor for the whole admission. If the minor is a girl and the nominated representative is male, a female attendant must stay with her.
- Treatment is given with the informed consent of the nominated representative.
- If the nominated representative withdraws support or asks for discharge, the minor must be discharged.
- Section 95 adds that ECT may be given to a minor only if the psychiatrist thinks it necessary, with the guardian's informed consent and prior permission of the Board.

## Review by the Board
| Event | Duty |
| Every admission | Report to the Mental Health Review Board within 72 hours |
| Admission continues to 30 days | Inform the Board at once |
| After being told of a 30 day stay | Board reviews within 7 days, then every 30 days |
The Board may visit and interview the minor and examine the records.

## Example
A 15 year old boy from Nagpur with a first episode of mania and repeated fights at home is brought by his father. A psychiatrist and a clinical psychologist examine him separately that day. Outpatient treatment over two weeks has failed. He is admitted to the adolescent unit, his mother stays as attendant, and the Board is informed within 72 hours.

## Conclusion
Section 87 balances the child's need for care with protection against unnecessary confinement through dual examination, least restrictive care, family presence and close Board oversight.`,
    keyPoints: ["Minor is under 18; nominated representative applies", "Two independent examinations, same day or within 7 days", "Severity, best interest with child's wishes, needs unmet otherwise, community options failed", "Separate accommodation from adults", "Attendant throughout; female attendant for a girl if the representative is male", "Consent of the nominated representative; discharge on request", "Board told within 72 hours; 30 day report; review within 7 days then every 30 days", "ECT for minors needs Board permission"],
    pitfalls: ["Calling it supported admission under section 89", "Forgetting the child's own wishes", "Missing the Board timelines"],
    module: "ethics-law/2-3",
    visuals: [
      fig("mhca-time-limits", "Review by the Board: the time limits of the Act drawn to scale"),
      chain("Application and examination", [["Nominated representative applies", "Usually the legal guardian"], ["Two independent examinations", "Same day or within 7 days before"], ["All four conditions met", "Severity, best interest, need, community options failed"], ["Admit to a child setting", "Attendant stays throughout"], ["Board informed", "Within 72 hours"]]),
    ],
    ref: "MHCA 2017 s 87 (1) to (13), s 15, s 95(1)(b); advocatekhoj bare act s 87 checked Nov 2026; ethics-law module 2.3",
  },
  {
    id: "eth-l02-002",
    subject: S,
    topic: "mhca-police",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "What are the duties of police officers towards persons with mental illness under the Mental Healthcare Act 2017? Add a note on the role of the magistrate.",
    plan: ["Why the Act gives police duties", "Section 100: taking into protection and the 24 hour rule", "No lock-up, assessment and what follows", "Homeless and wandering persons", "Sections 101 and 102: neglect and the magistrate"],
    answer: `## Why police have duties
Police are often the first to meet a person in a mental health crisis: a man wandering on a highway, a woman shouting at strangers at a railway station, a son threatening his parents. Under older laws such persons were often kept in lock-ups or jails. The Mental Healthcare Act 2017 treats them as people needing care, not as offenders, and gives police clear duties.

## Section 100: taking into protection
The officer in charge of a police station must take under protection a person within the station limits who:
- is found wandering, whom the officer has reason to believe has mental illness and is unable to take care of himself or herself; or
- the officer has reason to believe is a risk to himself or herself or to others because of mental illness.
The officer must then:
1. Tell the person the grounds for taking them into protection, or tell the nominated representative if the person cannot understand.
2. Take the person to the nearest public health establishment as soon as possible, and not later than 24 hours, for assessment of healthcare needs.
3. Never keep the person in a police lock-up or prison.

## What happens at the hospital
The medical officer in charge arranges the assessment. If admission is needed, the usual provisions of the Act apply, such as supported admission or emergency treatment. If the doctor or mental health professional finds no mental illness needing admission, the police take the person home, or, if homeless, to a government establishment for homeless persons.

## Homeless and wandering persons
For a person who is homeless or found wandering, the police must lodge a First Information Report of a missing person, and the station house officer must try to trace the family and tell them where the person is. This links to section 18, which gives homeless persons and those below the poverty line free treatment, and section 19, which says no one should stay in an institution only because they have no home.

## Sections 101 and 102: neglect and the magistrate
- Section 101: an officer who has reason to believe that a person with mental illness in a private residence is being ill treated or neglected must report it to the magistrate. The magistrate may order the person to be taken to a public health establishment for assessment and treatment.
- Section 102: when a person with mental illness is brought before a magistrate, the magistrate may order assessment at a public health establishment, and may authorise admission for assessment for a limited period, after which the person is dealt with under the other provisions of the Act.

## Example
Railway police in Bhopal find an elderly woman, confused and unable to give her address, sleeping on a platform for three days. They take her to the district hospital within hours, lodge a missing person report, and trace her son through a photo circulated to nearby stations.

## Conclusion
The Act turns the police from gatekeepers of confinement into a route to care, with a firm 24 hour limit and a ban on lock-ups.`,
    keyPoints: ["Section 100 covers wandering persons and those at risk", "Inform the person or nominated representative of the grounds", "Take to the nearest public health establishment within 24 hours", "Never a lock-up or prison", "If no admission needed, take home or to a shelter", "Missing person FIR and tracing the family for homeless persons", "Section 101 neglect reported to magistrate; section 102 magistrate orders assessment"],
    pitfalls: ["Writing that police can admit the person", "Missing the 24 hour limit", "Forgetting the ban on lock-ups"],
    module: "ethics-law/2-3",
    visuals: [
      chain("Section 100: taking into protection", [["Person found wandering or at risk", "Reason to believe mental illness"], ["Tell the grounds", "To the person or nominated representative"], ["Nearest public health establishment", "Within 24 hours, never a lock-up"], ["Assessment", "Admit under the Act, or take home or to a shelter"]]),
      vis("decide", { scene: "At 11 pm, constables in Pune find a young man in torn clothes on a flyover railing, talking to voices and refusing to come down. He is calmed and brought to the station.", ask: "What should the officer in charge do next?", choices: [{ label: "Keep him in the lock-up overnight and call a doctor in the morning", verdict: "harm", outcome: "He tries to hang himself with his shirt in the cell.", why: "Section 100 forbids keeping such a person in a lock-up." }, { label: "Tell him why he is being protected and take him to the nearest public hospital at once for assessment", verdict: "best", outcome: "He is assessed, admitted and treated for acute psychosis.", why: "This meets the duty to take the person to a public health establishment within 24 hours." }, { label: "Let him go once he promises to go home", verdict: "harm", outcome: "He returns to the flyover an hour later.", why: "A person at risk because of mental illness must be taken into protection." }] }, "What happens at the hospital"),
    ],
    ref: "MHCA 2017 ss 100 (1) to (7), 101, 102, 18, 19; advocatekhoj bare act s 100 checked Nov 2026; ethics-law module 2.3",
  },
  {
    id: "eth-l02-003",
    subject: S,
    topic: "mhca-prohibited",
    marks: 15,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance", "ugc-net", "ma-semester"],
    question: "Discuss the prohibited procedures and regulated treatments under the Mental Healthcare Act 2017, including ECT, psychosurgery, restraint and seclusion. What is their ethical basis?",
    plan: ["Context: abuses that led to the rules", "Section 95: the four prohibited procedures", "Section 96: psychosurgery", "Section 97: restraint and seclusion", "Ethical basis and practical problems"],
    answer: `## Background
Indian mental hospitals and faith healing sites have a history of practices that harmed people: unmodified ECT given without anaesthesia, chaining, solitary rooms and even sterilisation of women with mental illness. The Erwadi fire of 2001, in which 28 chained people died at a dargah, made these abuses impossible to ignore. The Mental Healthcare Act 2017 responds by banning some procedures outright and placing others under strict control, in Chapter XIII.

## Section 95: prohibited procedures
No person with mental illness may be subjected to:
1. Electroconvulsive therapy without the use of muscle relaxants and anaesthesia, that is, unmodified or direct ECT.
2. ECT for a minor, unless the treating psychiatrist considers it necessary, the guardian gives informed consent and the Board gives prior permission.
3. Sterilisation of men or women when it is intended as a treatment for mental illness.
4. Chaining in any manner or form.
The Act also allows the government to prohibit further treatments by regulation.

## Modified ECT
Modified ECT remains a legitimate and often life saving treatment for severe depression with suicidal risk, catatonia and some cases of mania or schizophrenia. It needs informed consent from a person with capacity. During supported admission it may be given as part of the treatment plan with the consent of the nominated representative, subject to any valid advance directive.

## Section 96: psychosurgery
Surgery on the brain for mental illness, such as procedures for intractable obsessive compulsive disorder, may be done only with the informed consent of the person and the approval of the Mental Health Review Board. The double check reflects its irreversibility: neither the family nor the nominated representative can consent in the person's place.

## Section 97: restraint and seclusion
- Seclusion and solitary confinement are prohibited.
- Physical restraint may be used only when it is the only means available to prevent imminent and immediate harm to the person or to others, and only when authorised by the psychiatrist in charge of treatment.
- It must not be used as punishment or a deterrent, and never because of staff shortage.
- Restraint lasts no longer than needed, the person is kept in full view of staff, and the method, nature, justification and duration are recorded in the medical notes at once.
- The nominated representative is informed within 24 hours, and all instances are included in the monthly report to the Board.
- Chemical restraint is not separately defined, but sedating medicine must be given as treatment, not as punishment.

## Ethical basis
| Rule | Principle served |
| Ban on unmodified ECT | Non maleficence: avoids fractures, terror and pain |
| Ban on sterilisation | Autonomy and bodily integrity; reproductive rights under the UN Convention |
| Ban on chaining and seclusion | Dignity and protection from cruel and degrading treatment, section 20 |
| Board approval for psychosurgery | Irreversible harm needs independent review |
| Restraint as last resort | Least restrictive alternative |

## Problems in practice
- Many units lack anaesthetists, which once drove the use of unmodified ECT; the law now forces services to arrange anaesthesia.
- Chaining persists at some faith healing sites outside the registered system, so enforcement depends on police, Authorities and courts.
- Restraint registers are often incomplete, and staffing shortages remain the hidden driver of restraint.
- Distinguishing urgent restraint from convenience requires training and audit.

## Conclusion
The Act draws a clear line: some procedures are never acceptable, and others are permitted only with consent, independent review and documentation. This reflects a shift from what is convenient for institutions to what respects the person.`,
    keyPoints: ["Four prohibited procedures in section 95", "Modified ECT allowed with consent or nominated representative within supported admission", "ECT for minors needs guardian consent and Board permission", "Psychosurgery needs informed consent plus Board approval", "Seclusion prohibited; restraint only as the only means to prevent imminent harm", "Restraint recorded, nominated representative told within 24 hours, monthly Board report", "Ethical principles: non maleficence, dignity, least restriction", "Implementation problems"],
    pitfalls: ["Saying all ECT is banned", "Saying seclusion is allowed with documentation", "Leaving out the ethics part of the question"],
    module: "ethics-law/2-4",
    visuals: [
      vis("sort", { prompt: "Sort each practice under the Act.", buckets: ["Allowed with consent", "Allowed only with extra safeguards", "Prohibited"], items: [{ text: "Modified ECT for an adult with severe depression who consents", bucket: 0 }, { text: "ECT for a 16 year old with catatonia", bucket: 1, why: "Needs the psychiatrist's view, guardian consent and Board permission." }, { text: "Psychosurgery for refractory OCD", bucket: 1, why: "Informed consent and Board approval." }, { text: "Locking a patient alone in a room overnight", bucket: 2, why: "Seclusion is prohibited." }, { text: "Chaining at a healing shrine", bucket: 2 }, { text: "ECT without anaesthesia", bucket: 2 }] }, "Section 95: prohibited procedures"),
      chain("Section 97: restraint and seclusion", [["Imminent harm", "Restraint is the only means left"], ["Psychiatrist authorises", "Never punishment or staff shortage"], ["In full view, shortest time", "Recorded at once"], ["Nominated representative told", "Within 24 hours"], ["Monthly report to the Board", "Every instance"]]),
    ],
    ref: "MHCA 2017 ss 95, 96, 97, 20; Erwadi fire 6 August 2001; ethics-law module 2.4",
  },
  {
    id: "eth-l02-004",
    subject: S,
    topic: "mhca-research",
    marks: 5,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Write a short note on research with persons with mental illness under section 99 of the Mental Healthcare Act 2017.",
    plan: ["Consent as the rule", "Persons who cannot consent: State Authority", "Five conditions", "Case notes and withdrawal"],
    answer: `## The general rule
Section 99 requires professionals conducting research to obtain free and informed consent from every person with mental illness who takes part in research involving interviews or psychological, physical, chemical or medicinal interventions. Having a mental illness does not by itself remove the ability to consent; capacity is judged as in section 4.

## When a person cannot consent
If a person cannot give free and informed consent but does not resist taking part, research involving interventions needs permission from the State Mental Health Authority. The Authority may allow the research to proceed on the informed consent of the nominated representative only if it is satisfied that:
1. The study cannot be done with people who are able to consent.
2. It is necessary to promote the mental health of the population the person represents.
3. Its purpose is to gain knowledge about the mental health needs of persons with mental illness.
4. The interests of researchers and sponsors are fully disclosed, with no conflict of interest.
5. It follows national and international guidelines and has approval of the institutional ethics committee.

## Other points
- Studies based only on case notes of a person who cannot consent are not restricted, if anonymity is protected.
- The person or the nominated representative may withdraw consent at any time.
- A person who actively resists cannot be enrolled.

## Example
A trial of a new treatment for catatonia, where patients cannot consent, would need ethics committee approval, State Authority permission and nominated representative consent.`,
    keyPoints: ["Free and informed consent from every participant", "Covers interviews and interventions", "Incapable but not resisting: State Authority permission", "Nominated representative consents", "Five conditions including no conflict of interest and ethics committee approval", "Case note studies allowed with anonymity", "Withdrawal at any time"],
    pitfalls: ["Saying families can always consent for patients", "Forgetting the State Authority"],
    module: "ethics-law/2-4",
    visuals: [layers("When a person cannot consent", "stack", [["Ethics committee approval", "Needed for every study, under national guidelines"], ["State Authority permission", "Only if the person does not resist"], ["Nominated representative consent", "Given after full information"], ["Ongoing right to withdraw", "Person or representative can stop at any time"]])],
    ref: "MHCA 2017 s 99 (1) to (5); advocatekhoj bare act s 99 checked Nov 2026; ICMR National Ethical Guidelines 2017",
  },
  {
    id: "eth-l02-005",
    subject: S,
    topic: "mhca-confidentiality",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance", "ugc-net", "ma-semester"],
    question: "Explain the provisions of the Mental Healthcare Act 2017 on confidentiality, release of information to the media and access to medical records.",
    plan: ["Why confidentiality matters in mental health", "Section 23 and its exceptions", "Section 24: photographs and the media", "Section 25: access to records", "Practical example and limits"],
    answer: `## Why it matters
People with mental illness face stigma in jobs, marriage and family life in India. If they fear disclosure, they avoid help. The Mental Healthcare Act 2017 therefore makes confidentiality a legal right, alongside the constitutional right to privacy recognised by the Supreme Court in the Puttaswamy judgment of 2017.

## Section 23: right to confidentiality
A person with mental illness has the right to confidentiality of all information, including information stored in electronic or digital form, about their mental health, care, treatment and physical health. All health professionals providing care have a duty to keep it confidential. Information may be released only:
1. To the nominated representative, to enable them to carry out their duties.
2. To other mental health and health professionals, for providing care and treatment.
3. If necessary to protect another person from harm or violence.
4. Only as much as is necessary to protect against a clear and present danger to life.
5. At the request of the Mental Health Review Board, the Central or State Authority, or the chairperson of the Board in performing their duties.
6. In the interests of public safety and security.
Even when an exception applies, only the information needed for that purpose should be shared.

## Section 24: photographs and the media
No photograph or any other information relating to a person with mental illness undergoing treatment at a mental health establishment may be released to the media without the consent of that person. This protects patients from the common practice of showing them in news stories about hospitals or shrines.

## Section 25: access to records
A person with mental illness has the right to access their basic medical records as may be prescribed. The professional in charge may withhold specific information if disclosure would cause serious mental harm to the person or would likely cause harm to others. When information is withheld, the person must be told of their right to apply to the Board for release.

## Example
A software engineer in Bengaluru with bipolar disorder is admitted after a manic episode. His employer phones the hospital asking for his diagnosis. Under section 23, the hospital cannot reveal it without his consent; it may give a fitness certificate with his permission that states only what is needed. A television channel filming the hospital cannot show his face without his consent under section 24. After discharge he may ask for his records under section 25.

## Limits and tensions
- The Act does not set out a Tarasoff style duty to warn, but exception 3 permits protective disclosure.
- Duties under other laws, such as mandatory reporting under POCSO, also override confidentiality.
- Digital records raise new risks, now also governed by the Digital Personal Data Protection Act 2023.

## Conclusion
Sections 23 to 25 together protect privacy, dignity and the person's control over their own story, while allowing limited disclosure for care and safety.`,
    keyPoints: ["Section 23 covers all information including digital", "Listed exceptions: nominated representative, other professionals, protection from harm, danger to life, Board or Authority, public safety", "Share only what is needed", "Section 24: no photographs or information to media without consent", "Section 25: right to access basic records", "Withholding for serious harm, with right to apply to the Board", "Puttaswamy privacy right", "Interface with POCSO and data protection law"],
    pitfalls: ["Writing that family members always have a right to information", "Mixing up sections 23, 24 and 25"],
    module: "ethics-law/2-5",
    visuals: [
      tree("Section 23: right to confidentiality", [["Information about a person with mental illness", "Confidential, including digital records", -1], ["Nominated representative", "To carry out their duties", 0], ["Other health professionals", "For care and treatment", 0], ["Protect others", "From harm or violence, or danger to life", 0], ["Board or Authority", "For their duties", 0], ["Public safety and security", "Only what is needed", 0]]),
      compare("Section 24 and section 25", ["Section 24: media", ["No photograph released without consent", "No other information either", "Applies during treatment in an establishment"], "Protects dignity in public"], ["Section 25: records", ["Right to access basic medical records", "May be withheld for serious harm", "Person told of right to apply to the Board"], "Protects the person's control over their own file"]),
    ],
    ref: "MHCA 2017 ss 23, 24, 25; Justice K S Puttaswamy v Union of India (2017) 10 SCC 1; ethics-law module 1.3 and 2.5",
  },
  {
    id: "eth-l02-006",
    subject: S,
    topic: "mhca-registration",
    marks: 10,
    difficulty: 4,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "What is a mental health establishment under the Mental Healthcare Act 2017? Describe the requirements for registration and the penalties for contravention of the Act.",
    plan: ["Definition and exclusions", "Who registers and how", "Duties of a registered establishment", "Penalties under sections 107 to 109", "Why enforcement matters"],
    answer: `## What counts as a mental health establishment
Section 2 defines a mental health establishment as any health establishment, including Ayurveda, Yoga and Naturopathy, Unani, Siddha and Homoeopathy establishments, government or private, where persons with mental illness are admitted, reside, or are kept for care, treatment, convalescence and rehabilitation, temporarily or otherwise. It includes general hospital psychiatric units, private nursing homes, de addiction centres and halfway homes. It excludes a family residential place where a person resides with relatives or friends.

## Registration
- Every mental health establishment must register with the Central Mental Health Authority if it is under the central government, or otherwise with the State Mental Health Authority.
- Registration is first provisional, then permanent once the establishment shows it meets the minimum standards notified for facilities, staffing, records and services.
- The Authority maintains a register, which is public, and can inspect, inquire, and cancel registration if standards are not met or conditions are broken.
- The Act also requires registration of mental health professionals who are not otherwise registered under a professional law, such as some psychiatric social workers and mental health nurses, with the Authority.

## Duties of a registered establishment
- Follow the Act's provisions on admission, consent, restraint, prohibited procedures and rights.
- Display the rights of patients and how to complain.
- Keep records and send reports, such as restraint reports to the Board.
- Allow inspection by the Authority and visits by the Board.

## Penalties
| Section | Contravention | Penalty |
| 107(1) | Running an establishment without registration | First: 5,000 to 50,000 rupees. Second: 50,000 to 2 lakh. Later: 2 lakh to 5 lakh |
| 107(2) | Knowingly serving as a mental health professional in an unregistered establishment | Up to 25,000 rupees |
| 108 | Contravening any provision of the Act, rules or regulations | First: up to 6 months imprisonment, or fine up to 10,000 rupees, or both. Later: up to 2 years, or fine of 50,000 to 5 lakh rupees, or both |
| 109 | Offences by companies | The company and those in charge of its business are liable unless they show due diligence |
Penalties under section 107 are adjudicated by the State Authority and recovered as arrears of land revenue if unpaid.

## Why this matters
Many private de addiction centres in India, especially in Punjab, Haryana and Maharashtra, have been found holding people against their will, beating them or chaining them. Unregistered faith based centres hold people without medical care. Registration brings these places under standards and inspection; penalties make registration more than paperwork. A clinician working in such a centre can be personally fined.

## Problems
- Several states set up Authorities late and registration has been slow.
- Penalties are low compared with the profits of some private centres.
- Many places that keep people with mental illness do not see themselves as health establishments.

## Conclusion
The definition is deliberately wide, registration is the gateway to standards, and sections 107 and 108 give the Act its teeth, though enforcement depends on active Authorities.`,
    keyPoints: ["Wide definition including AYUSH establishments and de addiction centres", "Excludes a family home", "Register with Central or State Authority; provisional then permanent", "Minimum standards, inspection and cancellation", "Section 107 fines for running unregistered establishments", "Section 107(2) personal fine for professionals working there", "Section 108 imprisonment and fines for other contraventions", "Enforcement gaps"],
    pitfalls: ["Giving imprisonment for section 107, which has fines only", "Leaving out the exclusion of the family home"],
    module: "ethics-law/2-1",
    visuals: [chain("Registration", [["Apply to the Authority", "Central or State"], ["Provisional registration", "While standards are checked"], ["Permanent registration", "Minimum standards met"], ["Inspection and Board visits", "Ongoing"], ["Cancellation", "If standards or conditions are broken"]])],
    ref: "MHCA 2017 s 2(1)(p), Chapter X ss 65 to 72, ss 107, 108, 109; advocatekhoj bare acts ss 107 and 108 checked Nov 2026",
  },
  {
    id: "eth-l02-007",
    subject: S,
    topic: "mhca-prisoners",
    marks: 5,
    difficulty: 3,
    exams: ["md-psychiatry", "ma-semester"],
    question: "Write a short note on prisoners with mental illness under section 103 of the Mental Healthcare Act 2017.",
    plan: ["The problem in Indian prisons", "Authority to transfer", "Reports and Board visits", "Prison mental health establishments"],
    answer: `## The problem
Indian prisons hold many people with mental illness, some of whom were never charged with serious crimes, and some undertrials have spent years in jail because they were found unfit to stand trial. Section 103 of the Mental Healthcare Act 2017 aims to bring prisoners within the system of care.

## Transfer for treatment
- An order under the Prisoners Act 1900, the Army, Navy and Air Force Acts or the criminal procedure law directing a prisoner with mental illness to a mental health establishment is sufficient authority for admission.
- Transfer to the psychiatric ward in the medical wing of the prison satisfies the section.
- If there is no such ward, transfer to an outside mental health establishment needs prior permission of the Mental Health Review Board.

## Reports and oversight
- The medical officer of the prison must send a quarterly report to the Board certifying that there are no prisoners with mental illness in the prison who need transfer.
- The Board may visit the prison and ask the medical officer why a prisoner with mental illness has not been transferred.
- The medical officer in charge of the establishment holding the prisoner must report every six months on their mental and physical health to the authority that ordered detention.

## Mental health establishments in prisons
The government must set up a mental health establishment in the medical wing of at least one prison in each state and union territory, registered with the Authority and meeting the prescribed standards.

## Significance
Prisoners keep the rights of the Act, including the right to treatment and protection from cruel treatment. The section, with the procedures for accused persons of unsound mind in the new criminal procedure code, aims to end indefinite detention without treatment.`,
    keyPoints: ["Orders under the Prisoners Act and service Acts are authority to admit", "Prison psychiatric ward counts", "Outside transfer needs Board permission if no ward", "Quarterly certificate to the Board", "Board may visit prisons", "Six monthly report to the ordering authority", "One prison mental health establishment per state"],
    pitfalls: ["Saying prisoners lose rights under the Act", "Missing the quarterly and six monthly reports"],
    module: "ethics-law/2-3",
    visuals: [chain("Transfer for treatment", [["Order under the Prisoners Act or a service Act", "Authority to admit"], ["Prison psychiatric ward", "First choice"], ["Outside establishment", "Board permission if no ward"], ["Six monthly report", "To the authority that ordered detention"]])],
    ref: "MHCA 2017 s 103 (1) to (7); advocatekhoj bare act s 103 checked Nov 2026",
  },
  {
    id: "eth-l02-008",
    subject: S,
    topic: "mhca-duties",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance", "ugc-net", "ma-semester"],
    question: "Describe the duties of the appropriate government under the Mental Healthcare Act 2017. How far have they been met in India?",
    plan: ["Rights need duties", "Duties under Chapter VI", "Link with the right to access care", "Programmes that carry the duties", "Gaps"],
    answer: `## Rights need duties
A right to mental healthcare means little unless someone must provide it. Chapter VI of the Mental Healthcare Act 2017, sections 29 to 32, places duties on the appropriate government, which is the central government for its own establishments and the state government for the rest.

## The duties
1. Promotion of mental health and prevention, section 29: plan, design and implement programmes to promote mental health and prevent mental illness, and in particular programmes to reduce suicide and attempted suicide.
2. Creating awareness and reducing stigma, section 30: public awareness through media, including television, radio and print, about the Act; regular sensitisation of government officials, including police, about the Act; and programmes to reduce stigma.
3. Human resource development and training, section 31: take measures to address the shortfall of mental health professionals, train medical officers in public health establishments and prisons to provide basic and emergency mental healthcare, and train all professionals under the Act within a fixed time.
4. Coordination, section 32: coordinate among the ministries and departments of health, law, home affairs, human resources, social justice, employment, education, women and child development and others, to address mental health issues.

## Link with the right to access care
Section 18 makes the government responsible for affordable, good quality services close to home, including outpatient and inpatient care in every district, half way homes, sheltered accommodation, supported accommodation, child and older adult services, and free essential medicines. The duties in Chapter VI support this right.

## How the duties are carried out
- The National Mental Health Programme of 1982 and the District Mental Health Programme of 1996 provide district level care.
- Ayushman Arogya Mandirs, formerly health and wellness centres, include mental health in primary care.
- Tele MANAS, launched in October 2022, offers a 24 hour helpline and referral.
- The National Suicide Prevention Strategy of 2022 responds to section 29.

## Gaps
- The National Mental Health Survey of 2015 to 2016 found a treatment gap of over 70 per cent for most disorders and around 85 per cent for common mental disorders.
- The number of psychiatrists, clinical psychologists and psychiatric social workers is far below need, especially in rural districts.
- Mental health receives a very small share of the health budget.
- Awareness among police and officials of their duties under the Act is still low.

## Conclusion
The Act gives government clear duties of promotion, awareness, training and coordination. The programmes exist, but funding and workforce, not law, are now the limiting factors.`,
    keyPoints: ["Chapter VI, sections 29 to 32", "Promotion and prevention, including suicide prevention", "Awareness through media and sensitising officials and police", "Training and addressing the workforce shortfall", "Coordination across ministries", "Link with section 18 right to access", "Programmes: NMHP, DMHP, Tele MANAS, suicide prevention strategy", "Treatment gap and budget as limits"],
    pitfalls: ["Listing programmes without the sections of the Act", "No evaluation of how far duties are met"],
    module: "ethics-law/3-6",
    visuals: [layers("The duties", "stack", [["Promotion and prevention", "Section 29, including suicide prevention"], ["Awareness and stigma", "Section 30, media and sensitisation of police and officials"], ["Training and workforce", "Section 31, medical officers in hospitals and prisons"], ["Coordination", "Section 32, many ministries working together"]])],
    ref: "MHCA 2017 ss 18, 29 to 32; NMHS 2015-16 treatment gap; Tele-MANAS October 2022; NSPS November 2022; ethics-law module 3.6",
  },
  {
    id: "eth-l02-009",
    subject: S,
    topic: "mhca-definitions",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance", "ugc-net", "ma-semester"],
    question: "How does the Mental Healthcare Act 2017 define mental illness? Who counts as a mental health professional and a clinical psychologist under the Act?",
    plan: ["Definition of mental illness", "What is excluded", "Mental health professional", "Clinical psychologist"],
    answer: `## Mental illness
Section 2 defines mental illness as a substantial disorder of thinking, mood, perception, orientation or memory that grossly impairs judgement, behaviour, capacity to recognise reality or ability to meet the ordinary demands of life. It includes mental conditions associated with the abuse of alcohol and drugs. It does not include intellectual disability, which the Act describes in older words as a condition of arrested or incomplete development of mind marked by subnormal intelligence.

## Determination
Section 3 says mental illness shall be determined in accordance with nationally or internationally accepted medical standards, including the latest WHO classification. It must never be decided on the basis of political, economic or social status, membership of a cultural, racial or religious group, or non conformity with moral, social, cultural, work or political values or religious beliefs. Past treatment alone is not a ground for present diagnosis.

## Mental health professional
The Act lists:
- A psychiatrist.
- A clinical psychologist.
- A mental health nurse.
- A psychiatric social worker.
- A professional with a postgraduate degree in the relevant psychiatry subject of Ayurveda, Homoeopathy, Unani or Siddha.

## Clinical psychologist
A person registered with the Rehabilitation Council of India who holds a recognised qualification in clinical psychology, historically the MPhil Clinical Psychology or an equivalent professional qualification recognised by the Council. The two year master's degree that replaced the MPhil was renamed by the Council in May 2026 as the Master in Clinical Psychology.

## Why definitions matter
Only listed professionals can carry out duties such as examinations for supported admission. Excluding intellectual disability sends it to the Rights of Persons with Disabilities Act.`,
    keyPoints: ["Substantial disorder of thinking, mood, perception, orientation or memory", "Gross impairment of judgement, behaviour, reality testing or daily functioning", "Includes substance related conditions", "Excludes intellectual disability", "Section 3 bans diagnosis based on non conformity or status", "List of mental health professionals including AYUSH postgraduates", "Clinical psychologist must be RCI registered"],
    pitfalls: ["Including intellectual disability", "Forgetting section 3"],
    module: "ethics-law/2-1",
    visuals: [tree("Mental health professional", [["Mental health professional", "Can examine and certify under the Act", -1], ["Psychiatrist", "Medical postgraduate in psychiatry", 0], ["Clinical psychologist", "RCI registered", 0], ["Mental health nurse", "Postgraduate psychiatric nursing", 0], ["Psychiatric social worker", "Postgraduate psychiatric social work", 0], ["AYUSH psychiatry postgraduate", "Ayurveda, Homoeopathy, Unani or Siddha", 0]])],
    ref: "MHCA 2017 s 2(1)(g), (r), (s), s 3; RCI office memorandum 3 May 2026 renaming; ethics-law module 2.1 and 2.6",
  },
  {
    id: "eth-l02-010",
    subject: S,
    topic: "mhca-penalties",
    marks: 15,
    difficulty: 4,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "A private de-addiction centre in a north Indian town holds men against their will, chains those who resist and has no psychiatrist. Analyse the case under the Mental Healthcare Act 2017 and suggest what a psychologist who learns of it should do.",
    plan: ["Is it a mental health establishment", "Rights violated", "Prohibited and regulated practices", "Admission rules breached", "Penalties and remedies", "Role of the psychologist"],
    answer: `## Is it covered by the Act?
Section 2 includes in the definition of mental health establishment any place, government or private, where persons with mental illness are admitted, reside or are kept for care, treatment or rehabilitation. Mental illness in the Act includes mental conditions associated with alcohol and drug abuse. A residential de addiction centre is therefore a mental health establishment and must be registered with the State Mental Health Authority and meet minimum standards.

## Rights violated
- Section 20, protection from cruel, inhuman and degrading treatment: chaining, beatings, forced labour and unhygienic living are prohibited.
- Section 21, equality: people with substance use disorders must be treated with the same standards as for physical illness.
- Section 22, right to information: residents must be told of their rights, diagnosis and treatment.
- Section 27, right to legal aid, and section 28, right to make complaints about deficiencies in care.
- Section 26, right to personal contacts and communication: confiscating phones and blocking visits without reason breaches this.

## Prohibited and regulated practices
- Section 95 bans chaining in any manner or form.
- Section 97 allows physical restraint only when it is the only way to prevent imminent harm, authorised by a psychiatrist, recorded and reported. Chaining people who want to leave is neither restraint for imminent harm nor authorised, and it is never permitted in any form.

## Admission rules
- Adults who have capacity can only be admitted independently under section 86 and can leave when they wish, subject to a short assessment if they lack capacity.
- Admission against a person's will is possible only as supported admission under section 89, after examination by a psychiatrist and a mental health professional or medical practitioner, with Board reporting. A centre with no psychiatrist cannot lawfully hold anyone against their will.
- Families paying the centre to pick up a son forcibly, a common practice, has no basis in the Act.

## Penalties and remedies
| Breach | Consequence |
| Running without registration | Section 107: fines from 5,000 to 50,000 rupees first time, rising to 5 lakh |
| Professional knowingly working there | Section 107(2): up to 25,000 rupees |
| Chaining, unlawful detention and other breaches | Section 108: up to 6 months imprisonment or 10,000 rupees fine first time; up to 2 years or 5 lakh later |
| Criminal acts | Wrongful confinement and hurt under the Bharatiya Nyaya Sanhita |
Residents or anyone on their behalf can complain to the Mental Health Review Board under section 28 and the Board can order relief; the State Authority can inspect and close the centre.

## What the psychologist should do
1. Ensure immediate safety: if someone is in danger, inform the police, who must take any person with mental illness at risk to a public health establishment under section 100.
2. Report the centre in writing to the State Mental Health Authority and the Board.
3. Keep factual notes of what was seen and heard, without exaggeration.
4. Avoid working with or referring to the centre; under section 107(2) a professional working there is liable.
5. Help families find registered, evidence based services, such as government de addiction centres, the Drug Treatment Clinics and Tele MANAS, and explain that forced confinement does not treat addiction.
6. Respect the confidentiality of individual residents while reporting the practices.

## Conclusion
The centre breaches the Act on registration, rights, admission and prohibited practices. The psychologist's duties flow from both law and ethics: protect, report, document and direct people to lawful care.`,
    keyPoints: ["De addiction centres are mental health establishments", "Substance related conditions count as mental illness", "Rights under sections 20, 21, 22, 26, 27 and 28", "Chaining banned by section 95; restraint rules of section 97", "Unwilling admission only by supported admission with a psychiatrist", "Sections 107 and 108 penalties", "Report to the Authority and Board; police under section 100 for urgent risk", "Do not work with or refer to the centre"],
    pitfalls: ["Treating it as only a criminal matter", "Assuming family consent makes detention lawful", "No practical steps for the psychologist"],
    module: "ethics-law/3-5",
    visuals: [
      vis("decide", { scene: "A client's mother tells you her son was picked up at night by staff of a private 'nasha mukti' centre she paid, and she has heard that residents are chained. She asks if this is normal treatment.", ask: "What is the best response?", choices: [{ label: "Tell her it is strict but effective, and wait", verdict: "harm", outcome: "Her son is beaten and runs away, relapsing at once.", why: "Chaining is banned and forced confinement is not treatment." }, { label: "Explain the law, help her bring her son home, and report the centre to the State Mental Health Authority and Board, involving the police if he is in danger", verdict: "best", outcome: "Her son is shifted to a government de addiction centre and the centre is inspected.", why: "This protects the person and uses the remedies the Act provides." }, { label: "Post about the centre on social media with residents' photographs", verdict: "harm", outcome: "Residents are identified publicly and shamed.", why: "Section 24 forbids releasing photographs of persons in treatment without consent." }] }, "What the psychologist should do"),
      chain("Admission rules", [["Adult with capacity", "Independent admission, free to leave"], ["Lacks capacity, high support needs", "Supported admission under section 89"], ["Needs psychiatrist and second examiner", "Board informed"], ["No psychiatrist at the centre", "No lawful basis to hold anyone"]]),
    ],
    ref: "MHCA 2017 ss 2(1)(p), 2(1)(s), 20 to 28, 86, 89, 95, 97, 100, 107, 108; reports of illegal de-addiction centres in Punjab and Haryana; ethics-law module 3.5",
  },
]);
