import type { LongQA } from "@/lib/prep/long-types";
import type { PrepVisual } from "@/lib/prep/types";
import type { FigureData } from "@/lib/study/types";
import { anchored, chain, compare, layers, timeline, tree, vis } from "./visual";

const S = "ethics-law" as const;
const fig = (id: string, caption: string): PrepVisual => ({ kind: "figure", data: { id } satisfies FigureData, caption });

export const ETHICS_LAW_L01: LongQA[] = anchored([
  {
    id: "eth-l01-001",
    subject: S,
    topic: "mhca-history",
    marks: 20,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance", "ugc-net", "ma-semester"],
    question: "Trace the development of mental health law in India. Compare the Mental Healthcare Act 2017 with the Mental Health Act 1987, describe its main features, and critically evaluate it.",
    plan: ["Colonial and 1987 laws", "Why a new law was needed: the CRPD", "Main features of the MHCA 2017", "Comparison table", "Strengths and criticisms, including implementation"],
    answer: `## From colonial law to 1987
India's first mental health laws were colonial. The Indian Lunacy Act 1912 dealt mainly with confining "lunatics" in asylums, with admission by reception orders from magistrates. After independence the Indian Psychiatric Society pressed for reform, and the Mental Health Act 1987 came into force in 1993. It replaced the term lunatic with mentally ill person, regulated psychiatric hospitals and nursing homes through licences, and set out procedures for voluntary admission and for admission under reception orders. However, it remained largely custodial: it was about who could be detained and how, and said little about the rights of patients or about care in the community.

## Why a new law was needed
In 2007 India ratified the United Nations Convention on the Rights of Persons with Disabilities. The Convention treats persons with psychosocial disabilities as rights holders, requires equal recognition before the law, legal capacity and supported decision making, and forbids discrimination. The 1987 Act did not meet these obligations. Repeated reports of chaining, poor conditions in mental hospitals and the Erwadi fire of 2001, in which 28 chained people died at a shrine, also showed the need for change. The Mental Healthcare Act was passed in 2017 and came into force on 29 May 2018.

## Main features of the MHCA 2017
1. Rights based: sections 18 to 28 give rights to access mental healthcare, community living, protection from cruel treatment, equality including in insurance, information, confidentiality, access to records, personal contacts, legal aid and complaints.
2. Definition and determination: mental illness is defined in section 2(1)(s), excluding intellectual disability, and section 3 forbids diagnosis based on social, political, cultural or religious non conformity.
3. Capacity: section 4 presumes capacity and defines it as the ability to understand information, appreciate consequences and communicate a decision; an unwise decision does not by itself show incapacity.
4. Advance directives and nominated representatives, sections 5 to 17, allow people to state in advance how they wish to be treated and who should support them.
5. Admission: independent admission is preferred; supported admission under sections 89 and 90 replaces involuntary admission, with time limits and Board review; minors have special safeguards; emergency treatment is limited to 72 hours.
6. Prohibited and regulated treatments: unmodified ECT, sterilisation as treatment and chaining are banned; seclusion is prohibited and restraint strictly regulated; psychosurgery needs consent and Board approval.
7. Institutions: Central and State Mental Health Authorities register establishments and professionals, and Mental Health Review Boards, chaired by a judicial officer, review admissions, directives and complaints.
8. Suicide: section 115 presumes that a person who attempts suicide has severe stress and shall not be tried or punished, and requires government to provide care.
9. Duties of government: to plan and provide services, promote mental health, reduce stigma and integrate care into general health services.

## Comparison
| Feature | Mental Health Act 1987 | MHCA 2017 |
| Basic approach | Custodial, procedural | Rights based |
| Patient rights | Few | Detailed rights in sections 18 to 28 |
| Capacity | Not defined | Defined and presumed |
| Advance directives | None | Allowed and binding |
| Involuntary care | Reception orders by magistrates | Supported admission with Board review |
| Review body | Courts and visitors | Mental Health Review Boards |
| Prohibited treatments | Not specified | Unmodified ECT, chaining, sterilisation banned |
| Suicide attempt | Punishable under IPC section 309 | Presumed severe stress, not punished |
| Insurance | Not covered | Parity required |

## Strengths
- Aligns Indian law with international human rights standards.
- Puts the person's own will and preferences at the centre.
- Creates enforceable rights, including free care for the poor and homeless.
- Bans abusive practices and gives independent review.
- Decriminalises suicide attempts, encouraging help seeking.

## Criticisms and problems
- Implementation has been slow and uneven: several states set up Authorities and Boards late, and many establishments remain unregistered.
- Resources: the right to access care requires funding and workforce that do not yet exist in many districts.
- Psychiatrists argued that the procedures are bureaucratic, that families, who provide most care in India, were sidelined, and that advance directives may delay urgent treatment.
- Rights advocates argued the opposite: that supported admission still allows substituted decisions and falls short of full legal capacity under the Convention.
- Low awareness: few patients make advance directives, and many clinicians and police are unaware of their duties.
- The exclusion of intellectual disability leaves people with intellectual disability to the RPwD Act and the National Trust Act.

## Conclusion
Indian mental health law has moved from confinement in 1912, through regulation in 1987, to rights in 2017. The MHCA is a progressive law that matches international standards on paper; its success now depends on funding, training and the functioning of Authorities and Review Boards across states.`,
    keyPoints: ["Indian Lunacy Act 1912 and Mental Health Act 1987", "CRPD ratified 2007 as the driver", "MHCA passed 2017, in force 29 May 2018", "Rights in sections 18 to 28", "Capacity, advance directives and nominated representatives", "Supported admission, Review Boards and prohibited treatments", "Section 115 on suicide", "Balanced critique including implementation"],
    pitfalls: ["Writing 2017 as the year it came into force", "Listing features with no critique", "Missing the CRPD"],
    module: "ethics-law/2-1",
    visuals: [
      timeline("Put Indian mental health law in order", [["Indian Lunacy Act", "1912"], ["Mental Health Act passed", "1987"], ["Erwadi fire kills 28 chained people", "2001"], ["India ratifies the CRPD", "2007"], ["MHCA comes into force", "2018"]], "From confinement to regulation to rights."),
      compare("Comparison", ["Mental Health Act 1987", ["Licensing and detention", "Reception orders by magistrates", "Family consent central", "Suicide attempt punishable"], "A custodial law"], ["MHCA 2017", ["Rights of persons with mental illness", "Capacity and advance directives", "Supported admission with Board review", "Suicide attempt not punished"], "A rights based law"]),
    ],
    ref: "Indian Lunacy Act 1912; MHA 1987; UNCRPD ratified 1 October 2007; MHCA 2017 in force 29 May 2018; ss 2(1)(s), 3, 4, 5-17, 18-28, 85-103, 95-97, 115; ethics-law module 2.1",
  },
  {
    id: "eth-l01-002",
    subject: S,
    topic: "mhca-capacity",
    marks: 15,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Explain the concept of capacity under the Mental Healthcare Act 2017. How is capacity assessed, how does it relate to informed consent, and what is supported decision making? Illustrate with a clinical example.",
    plan: ["Why capacity matters under a rights based law", "Section 4: the three abilities and presumption", "Decision specific and time specific assessment", "Informed consent and supported decision making", "Clinical example and pitfalls"],
    answer: `## Why capacity matters
Under the Mental Healthcare Act 2017, the starting point is that a person with mental illness has the same right as anyone else to make decisions about their own treatment. Capacity is the key that decides whether a person's own consent or refusal governs treatment, whether an advance directive comes into effect, and whether a nominated representative must support a decision.

## Section 4: the test
Every person, including a person with mental illness, is presumed to have capacity to make mental healthcare and treatment decisions if they can:
1. Understand the information relevant to the decision.
2. Appreciate any reasonably foreseeable consequence of a decision, or of the lack of a decision.
3. Communicate the decision by speech, writing, signs or any other means.
The Act adds two important points:
- Information must be given in simple language the person understands, or with sign language, visual aids or other help.
- A decision that others think is inappropriate or wrong does not, by itself, mean the person lacks capacity.

## Decision specific and time specific
- Capacity is assessed for a particular decision at a particular time. A man with schizophrenia may lack capacity to decide about admission during an acute episode but have capacity to decide about a dental procedure, or to manage money.
- Capacity can fluctuate, as in delirium or mania, so it must be reassessed. During supported admission the Act requires review of capacity at least every seven days.
- The presence of a diagnosis, involuntary status or past treatment does not prove incapacity.

## Informed consent
The Act defines informed consent as consent given without force, undue influence, fraud, threat, mistake or misrepresentation, after the person has received sufficient information, including risks, benefits and alternatives, in a language and manner they understand. Capacity is a precondition for valid informed consent. A person with capacity may refuse treatment even when the doctor disagrees.

## Supported decision making
The Act reflects the UN Convention's idea that people should be supported to decide rather than have others decide for them. Support can include:
- More time, simpler explanations, written or visual material.
- Discussion with a trusted person or the nominated representative.
- Treating co occurring problems, such as dehydration in delirium, that impair capacity.
Only when a person needs very high support even with these aids does the nominated representative take a larger role, for example giving temporary consent during supported admission, and the person's past and present wishes must still be considered.

## Clinical example
Mrs Kaur, 62, with severe depression and psychotic features, refuses ECT, saying she deserves to suffer because she is a sinner.
- Understanding: she can repeat what ECT involves.
- Appreciation: she cannot appreciate the consequence of refusal, because the delusion that she deserves to suffer distorts her reasoning about her own welfare.
- Communication: she can state her choice.
She lacks capacity for this decision because one ability is impaired by illness. The team checks for an advance directive, involves her nominated representative and follows the supported admission procedure. By contrast, if a healthy minded man with bipolar disorder in remission refuses lithium because he dislikes the tremor, after understanding the risk of relapse, he has capacity, and his refusal must be respected while alternatives are discussed.

## Common pitfalls
- Equating disagreement with incapacity.
- Assessing once and never again.
- Not documenting which ability was impaired and why.
- Not giving information in the person's language.

## Conclusion
Capacity under section 4 is presumed, functional, decision specific and time specific. It underpins informed consent, and the Act requires that people be supported to decide wherever possible, with substitute decisions as a last resort.`,
    keyPoints: ["Presumption of capacity for all", "Three abilities: understand, appreciate, communicate", "Information in simple language and suitable means", "Unwise decision is not incapacity", "Decision and time specific; review every seven days in supported admission", "Informed consent definition", "Supported decision making and the nominated representative", "Worked example showing which ability is impaired"],
    pitfalls: ["Assuming diagnosis means incapacity", "Not naming the specific ability impaired"],
    module: "ethics-law/2-1",
    visuals: [
      vis("build", { vignette: "Mrs Kaur, 62, with psychotic depression, refuses ECT because she believes she deserves to suffer. She can repeat what ECT involves and states her refusal clearly.", rule: "Capacity requires all three abilities; one impaired by illness means she lacks capacity for this decision.", symptoms: [{ label: "Understands the information", present: true }, { label: "Appreciates the consequences for herself", present: false, core: true, why: "The delusion of deserving to suffer distorts this." }, { label: "Communicates a choice", present: true }], need: 3, needCore: true, verdict: "She lacks capacity for this decision: check for an advance directive, involve the nominated representative and review capacity often." }, "Clinical example"),
      chain("Section 4: the test", [["Understand", "The relevant information"], ["Appreciate", "Foreseeable consequences of deciding or not"], ["Communicate", "By any means"], ["Capacity present", "Unless one ability is impaired"]]),
    ],
    ref: "MHCA 2017 ss 2(1)(i) informed consent, 4, 14, 89(7) capacity review; UNCRPD Art 12; ethics-law module 1.2 and 2.1",
  },
  {
    id: "eth-l01-003",
    subject: S,
    topic: "mhca-rights",
    marks: 15,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance", "ugc-net", "ma-semester"],
    question: "Describe the rights of persons with mental illness under Chapter V of the Mental Healthcare Act 2017. Give an example of how each right applies in practice.",
    plan: ["Rights based approach", "Rights in order, sections 18 to 28, with examples", "How rights are enforced", "Gaps in practice"],
    answer: `## A rights based law
The Mental Healthcare Act 2017 sets out the rights of persons with mental illness in Chapter V, sections 18 to 28. These rights apply to everyone with mental illness, whether in hospital or in the community, and create duties for government and every mental health establishment.

## The rights
1. Section 18, right to access mental healthcare: affordable, good quality care from services run or funded by government, close to home, without discrimination. Persons below the poverty line, whether or not they hold a card, and homeless persons are entitled to free treatment. Example: a homeless woman found wandering in Mumbai receives free admission and medicines at a government hospital.
2. Section 19, right to community living: a person shall not continue to remain in an establishment merely because they have no family or home. Government must provide halfway homes and community care. Example: a recovered man who has lived in a mental hospital for 15 years because his family moved away is helped into supported housing.
3. Section 20, right to protection from cruel, inhuman and degrading treatment: safe and hygienic conditions, privacy, adequate food, clothing and sanitation, no forced work, and no shaving of the head without consent. Example: a ward stops the practice of shaving all patients' heads on admission.
4. Section 21, right to equality and non discrimination: treatment equal to that for physical illness, including emergency care, ambulances and living conditions; section 21(4) requires insurers to cover mental illness on the same basis as physical illness. Example: an insurer cannot refuse a claim for psychiatric admission while paying for a heart admission.
5. Section 22, right to information about the provision under which one is admitted, the right to apply to the Board, the nature of the illness and the treatment plan, in a language one understands.
6. Section 23, right to confidentiality of information about one's mental health, care and physical health, with limited exceptions such as protecting another person from harm.
7. Section 24, restriction on release of information to the media: photographs or information cannot be released without consent. Example: a news channel cannot film inside a ward without patients' consent.
8. Section 25, right to access medical records: a person may obtain copies of their records, though professionals may withhold specific information if disclosure would cause serious harm.
9. Section 26, right to personal contacts and communication: to receive visitors and make calls, subject to reasonable limits, and to refuse unwanted contact.
10. Section 27, right to legal aid: free legal services to exercise rights under the Act; magistrates and police must inform the person of this right.
11. Section 28, right to make complaints about deficiencies in care, first to the medical officer, then to the Board.

## Enforcement
- Complaints go to the establishment, then to the Mental Health Review Board, which can order corrective action.
- Authorities register and inspect establishments.
- Violations of the Act can be penalised under sections 107 and 108.

## Gaps in practice
- Free care depends on supply of medicines and staff in district hospitals, which varies.
- Community living requires halfway homes and supported housing that many states have not built.
- Insurance parity has been contested; courts and the insurance regulator have had to direct insurers to comply.
- Awareness of rights among patients and families is low.

## Conclusion
Chapter V turns the person with mental illness into a rights holder, with rights to care, dignity, equality, information, privacy, contact, legal aid and complaint. Making these rights real is the main task of implementation.`,
    keyPoints: ["Rights in sections 18 to 28 in order", "Free care for BPL and homeless persons", "Community living, not institutional residence for lack of home", "Protection from cruel treatment with concrete examples", "Insurance parity in section 21(4)", "Confidentiality, media restriction and records access", "Legal aid and complaints with Board enforcement", "Gaps in implementation"],
    pitfalls: ["Mixing up section numbers", "Listing rights without examples"],
    module: "ethics-law/2-1",
    visuals: [vis("sort", { prompt: "Match each situation to the right it protects", buckets: ["Access to care (18)", "Community living (19)", "Protection from cruelty (20)", "Equality and insurance (21)", "Media restriction (24)"], items: [{ text: "Free medicines for a homeless man", bucket: 0 }, { text: "Discharge to a halfway home instead of staying for lack of family", bucket: 1 }, { text: "Not shaving a patient's head without consent", bucket: 2 }, { text: "Insurer must pay for a psychiatric admission", bucket: 3 }, { text: "No photographs for a news story without consent", bucket: 4 }] }, "The rights")],
    ref: "MHCA 2017 Chapter V ss 18-28, 107-108; ethics-law module 2.1",
  },
  {
    id: "eth-l01-004",
    subject: S,
    topic: "mhca-s115",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance", "ugc-net", "ma-semester"],
    question: "Discuss the legal position of attempted suicide in India, with reference to section 309 of the Indian Penal Code, section 115 of the Mental Healthcare Act 2017 and the Bharatiya Nyaya Sanhita 2023. What are the implications for clinicians?",
    plan: ["IPC section 309 and the debate", "Court judgments", "Section 115 of the MHCA", "The BNS position", "Implications for clinicians"],
    answer: `## Section 309 and the debate
Section 309 of the Indian Penal Code 1860 made attempting suicide punishable with simple imprisonment of up to one year, a fine or both. For decades psychiatrists, the Law Commission and rights groups argued that punishing a person in distress was cruel and deterred help seeking, and that families hid attempts to avoid police cases.

## Court judgments
- In 1994, in P. Rathinam versus Union of India, a two judge bench of the Supreme Court held section 309 unconstitutional.
- In 1996, in Gian Kaur versus State of Punjab, a five judge constitution bench overruled this, holding that the right to life does not include the right to die, so section 309 was valid.
- The Law Commission, in its 210th report in 2008, recommended repealing section 309.

## Section 115 of the MHCA
The Mental Healthcare Act 2017 resolved the conflict in practice:
1. Notwithstanding section 309, any person who attempts suicide shall be presumed, unless proved otherwise, to have severe stress, and shall not be tried and punished.
2. The appropriate government has a duty to provide care, treatment and rehabilitation to a person who has severe stress and has attempted suicide, to reduce the risk of recurrence.

## The BNS position
The Bharatiya Nyaya Sanhita 2023, which replaced the IPC from 1 July 2024, did not carry forward a general offence of attempting suicide. Section 226 of the BNS punishes only an attempt to commit suicide made with the intent to compel or restrain a public servant from discharging official duty, aimed at protest fasts and self immolation threats. Abetment of suicide remains an offence, now under section 108 of the BNS.

## Implications for clinicians
- Treat every attempt as a health emergency and a marker of high future risk, not a crime.
- Medico legal case registration for poisoning and injury continues in emergency departments for documentation, but the survivor should not be prosecuted; clinicians can explain this to frightened families.
- Provide or refer for psychiatric assessment, safety planning, means restriction and follow up, which section 115 makes a government duty.
- Do not refuse treatment or delay care because of police formalities.
- Record that the person was assessed for severe stress and mental illness.
- Advocate against stigma in hospitals and media, and follow responsible reporting guidelines.

## Conclusion
India has moved from punishing suicide attempts to presuming severe stress and requiring care. Clinicians should ensure that survivors are treated as patients and offered follow up, not as offenders.`,
    keyPoints: ["IPC 309 penalty and the debate", "Rathinam 1994 and Gian Kaur 1996", "Law Commission 210th report", "Section 115: presumption of severe stress and government duty of care", "BNS from 1 July 2024 dropped the general offence", "BNS 226 for attempts to compel a public servant; abetment under BNS 108", "Clinical implications: care, medico legal records, follow up"],
    pitfalls: ["Saying suicide was legal after Rathinam permanently", "Missing the government duty in section 115(2)"],
    module: "ethics-law/2-4",
    visuals: [timeline("Put the legal history of attempted suicide in order", [["IPC section 309 enacted", "1860"], ["Rathinam strikes it down", "1994"], ["Gian Kaur restores it", "1996"], ["Law Commission recommends repeal", "2008"], ["MHCA section 115 in force", "2018"], ["BNS replaces the IPC without a general offence", "2024"]], "Each step moved India from punishment towards care.")],
    ref: "IPC s 309; P Rathinam v UoI (1994) 3 SCC 394; Gian Kaur v State of Punjab (1996) 2 SCC 648; Law Commission Report 210 (2008); MHCA s 115; BNS 2023 ss 108, 226, in force 1 July 2024",
  },
  {
    id: "eth-l01-005",
    subject: S,
    topic: "mhca-authorities",
    marks: 10,
    difficulty: 4,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Describe the composition and functions of the Central and State Mental Health Authorities and the Mental Health Review Boards under the Mental Healthcare Act 2017. What time limits apply to Board decisions?",
    plan: ["Why the Act created these bodies", "Central and State Authorities and registration", "Review Boards: composition", "Board functions", "Time limits and procedure"],
    answer: `## Why these bodies exist
A rights based law needs institutions to regulate services and to give people a quick, independent route to challenge decisions. The Mental Healthcare Act 2017 created three: the Central Mental Health Authority, State Mental Health Authorities and Mental Health Review Boards.

## Central and State Mental Health Authorities
- Section 33 requires the Central Government to establish the Central Mental Health Authority, and section 45 requires each State Government to establish a State Mental Health Authority.
- The Authorities register mental health establishments, maintain registers of establishments and mental health professionals, develop quality and service standards, train officials such as police and magistrates, and advise government.
- Under section 65, no one may establish or run a mental health establishment without registration with the relevant Authority. This includes private hospitals, nursing homes and de addiction centres.
- Section 107 penalises running an unregistered establishment, with fines rising for repeated offences.

## Mental Health Review Boards: composition
The State Authority constitutes Boards for districts or groups of districts. Under section 74 each Board has:
- A chairperson who is a district judge, or a qualified or retired judicial officer.
- A representative of the District Collector, District Magistrate or Deputy Commissioner.
- Two medical members: a psychiatrist and a medical practitioner.
- Two members from among persons with mental illness, care givers, or representatives of organisations working for them.
Members serve five years or until the age of seventy.

## Functions of the Boards
1. Registering, reviewing, altering, modifying or cancelling advance directives.
2. Appointing nominated representatives where needed.
3. Receiving and deciding applications against supported admission or the admission of minors.
4. Approving supported admission beyond 30 days under section 90.
5. Hearing complaints about deficiencies in care and violations of rights.
6. Approving psychosurgery and ECT for minors.
7. Visiting and inspecting establishments and prisons, and advising courts when a finding of mental illness is challenged.

## Time limits and procedure
- The Board should try to decide ordinary applications within 90 days.
- Applications about nominated representatives, minors' admissions and challenges to supported admission under section 89 must be decided within seven days.
- Challenges to supported admission beyond 30 days under section 90 must be decided within 21 days.
- Proceedings are held in camera, adjournments are not ordinarily granted, and hearings involving admitted persons are held at the establishment.
- The person may be represented by a lawyer or other representative, and appeals lie to the High Court.

## Problems
States were slow to constitute Authorities and Boards, and many Boards meet rarely or cover huge areas, which makes the short time limits hard to meet.

## Conclusion
The Authorities regulate and register services, while the Boards act as quasi judicial guardians of individual rights, with tight time limits that reflect the seriousness of deprivation of liberty.`,
    keyPoints: ["Sections 33 and 45 Authorities", "Registration of establishments under section 65", "Board composition with judicial chair, medical and user members", "Board functions: directives, representatives, admissions, complaints", "90 days, seven days and 21 days time limits", "In camera proceedings at the establishment", "Implementation delays"],
    pitfalls: ["Saying the Board is chaired by a psychiatrist", "Mixing up the seven day and 21 day limits"],
    module: "ethics-law/2-1",
    visuals: [tree("Mental Health Review Boards: composition", [["Review Board", "Quasi judicial body set up by the State Authority", -1], ["Chairperson", "District judge or qualified judicial officer", 0], ["Administration", "Representative of the District Collector or Magistrate", 0], ["Psychiatrist", "Medical member", 0], ["Medical practitioner", "Medical member", 0], ["Users and carers", "Two persons with mental illness, care givers or NGO representatives", 0]])],
    ref: "MHCA 2017 ss 33, 45, 65, 73-75, 80-82, 107; PRS India text of the Act",
  },
  {
    id: "eth-l01-006",
    subject: S,
    topic: "mhca-advance-directive",
    marks: 15,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "What is an advance directive under the Mental Healthcare Act 2017? Describe who can make one, what it can contain, how it operates, when it can be overridden, and the clinical and ethical issues it raises.",
    plan: ["Definition and purpose", "Who can make one and what it can contain", "How it operates and the duty to follow it", "Review by the Board and exceptions", "Issues and evidence in India"],
    answer: `## Definition and purpose
An advance directive is a written statement in which a person, while they have capacity, says how they wish and do not wish to be cared for and treated for mental illness in the future, and whom they want as their nominated representative. Its purpose is to let the person's own considered wishes guide treatment during periods when illness removes their capacity, honouring autonomy across time.

## Who can make one and what it can contain
- Any person who is not a minor can make an advance directive, irrespective of any past mental illness or treatment (section 5).
- It can state the way the person wishes to be cared for and treated, the way they do not wish to be treated, and the individuals, in order of precedence, they want as nominated representatives.
- It must be made in the manner set by regulations and registered with the Mental Health Review Board.
- It can be revoked, amended or cancelled by the person at any time while they have capacity.
- A directive that asks for something contrary to law is void.

## How it operates
- It comes into effect only when the person lacks capacity to make the relevant decision; while they have capacity, their current decision governs.
- The psychiatrist and the establishment have a duty to follow a valid directive. For example, if a woman with bipolar disorder has refused olanzapine because of earlier severe weight gain, the team must choose another treatment.
- It does not apply to emergency treatment under section 94, which allows urgent treatment for up to 72 hours to prevent death, serious harm or serious damage.
- A professional who acts in good faith on a valid directive is protected from liability (section 13).

## Review by the Board
Under section 11, a psychiatrist, mental health professional, relative or care giver who does not wish to follow a directive must apply to the Board, which may uphold, modify or cancel it. The Board considers whether:
- The directive was made voluntarily, without force or undue influence.
- The person had capacity and was well informed when making it.
- It was meant to apply to the present circumstances, which may not have been foreseen.
- It is contrary to law.
Clinicians or families cannot simply override a directive themselves.

## Clinical and ethical issues
- Autonomy across time: a directive made when well may conflict with what the person says when ill. The Act prefers the earlier capable wish, the so called Ulysses idea, but also allows Board review.
- Refusal of all treatment: a directive refusing all medication for a disorder with high risk of harm creates conflict between autonomy and beneficence.
- Information: people may not foresee new treatments; directives should be reviewed periodically.
- Family role: in India families may object to a directive or the choice of nominated representative.
- Uptake: very few Indian patients have made directives, though studies suggest many find the idea acceptable when it is explained and supported.
- Psychiatrists raised concerns that directives could delay treatment; in practice emergency provisions and Board review address urgent situations.

## Good practice
Discuss directives during recovery, help the person write clear, specific preferences with reasons, encourage review every few years, record the directive in notes and inform the nominated representative.

## Conclusion
The advance directive is the MHCA's main tool for extending a person's autonomy into periods of incapacity. It must be followed unless the Board decides otherwise, except in emergencies.`,
    keyPoints: ["Definition and purpose", "Any adult, irrespective of past illness", "Contents: wishes, refusals, nominated representatives", "Registered with the Board; revocable while capable", "Applies only when capacity is lacking; not in section 94 emergencies", "Section 11 Board review grounds", "Section 13 protection for good faith action", "Ethical tensions and low uptake in India"],
    pitfalls: ["Saying the family can override a directive", "Forgetting the emergency exception"],
    module: "ethics-law/2-2",
    visuals: [
      chain("How it operates", [["Made while capable", "Any adult, registered with the Board"], ["Person later lacks capacity", "Directive comes into effect"], ["Team follows it", "Chooses care it does not refuse"], ["Disagreement", "Apply to the Board under section 11"], ["Board decides", "Uphold, modify or cancel"]]),
      vis("decide", { scene: "A man with schizophrenia registered a directive refusing depot injections and naming his sister as nominated representative. He is now acutely ill, lacks capacity and refuses oral tablets. His mother wants him to have a depot.", ask: "What should the team do?", choices: [{ label: "Give the depot because the mother consents.", verdict: "harm", outcome: "Unlawful; the sister complains to the Board.", why: "Neither the team nor the family can override a valid directive." }, { label: "Offer care the directive allows, such as oral or liquid medication with support, involve the sister, and apply to the Board if the team believes the directive should not apply.", verdict: "best", outcome: "He accepts liquid medication after several days of support.", why: "Follows the directive and uses the Board for disagreement." }, { label: "Treat him as an emergency under section 94 for weeks.", verdict: "harm", outcome: "Misuse of emergency powers beyond 72 hours.", why: "Emergency treatment is short and only for immediate danger." }] }, "Review by the Board"),
    ],
    ref: "MHCA 2017 ss 5-13, 94; ethics-law module 2.2; Indian studies on acceptability of psychiatric advance directives",
  },
  {
    id: "eth-l01-007",
    subject: S,
    topic: "mhca-nominated-representative",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Who is a nominated representative under the Mental Healthcare Act 2017? Explain how one is appointed, the default order when none is appointed, and their duties.",
    plan: ["Purpose of the role", "Appointment by the person", "Default order", "Minors", "Duties and limits"],
    answer: `## Purpose
The nominated representative is a person chosen to support a person with mental illness in making treatment decisions and in exercising their rights. The role replaces the older assumption that the family automatically decides, and reflects supported decision making: the representative supports rather than replaces the person.

## Appointment by the person
- Any adult can appoint a nominated representative in writing, on plain paper, with the person's signature or thumb impression (section 14).
- The representative must be an adult, competent to do the duties and willing to act.
- The appointment can be revoked or changed by the person at any time.
- A person can also name representatives in an advance directive.

## Default order
If no one has been appointed, the following, in order of precedence, become the nominated representative:
1. The person named in an advance directive.
2. A relative, or if not available or not willing, a care giver.
3. A suitable person appointed by the Mental Health Review Board.
4. If none of these is available, the Board can appoint the Director of Social Welfare or a representative of a registered organisation working for persons with mental illness, temporarily.
The Board can revoke or change a representative on application, for example if the representative is not acting in the person's interests.

## Minors
For a minor, the legal guardian is the nominated representative unless the Board orders otherwise, for example where the guardian is not acting in the child's best interests.

## Duties
- Consider the current and past wishes, life history, values, cultural background and best interests of the person.
- Give particular credence to the person's views to the extent they understand the situation.
- Be involved in discharge planning and be informed of admission, restraint and changes in treatment.
- Have access to the information needed to perform these duties.
- Apply to the Board on the person's behalf, for example against an admission.
- During supported admission, if the person needs nearly total support, give temporary consent to the treatment plan; this ends when the person regains capacity.

## Limits
The representative cannot override a valid advance directive, cannot consent to prohibited treatments, and must not act against the person's interests. Disputes go to the Board.

## Conclusion
The nominated representative gives the person a chosen supporter, with a clear default order and Board oversight, so that decisions respect the person's wishes rather than simply the family's.`,
    keyPoints: ["Supporter, not substitute", "Written appointment by any adult, revocable", "Default order: advance directive, relative or care giver, Board appointee, social welfare or NGO", "Guardian for minors unless the Board decides otherwise", "Duty to consider past and present wishes and values", "Temporary consent during supported admission", "Cannot override an advance directive"],
    pitfalls: ["Saying the eldest relative automatically decides", "Ignoring the Board's power to change the representative"],
    module: "ethics-law/2-2",
    visuals: [layers("Default order", "stack", [["Person named in an advance directive", "First in line"], ["Relative or care giver", "If none is named"], ["Suitable person appointed by the Board", "If no relative or care giver is available"], ["Director of Social Welfare or NGO representative", "Temporary, as a last resort"]])],
    ref: "MHCA 2017 ss 14-17, 89(7); ethics-law module 2.2",
  },
  {
    id: "eth-l01-008",
    subject: S,
    topic: "advance-directive-limits",
    marks: 5,
    difficulty: 4,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Write a short note on the Ulysses contract and the ethical tensions in psychiatric advance directives.",
    plan: ["The Ulysses image", "Two kinds of directive", "Ethical tensions", "How the MHCA handles them"],
    answer: `## The Ulysses image
In Homer's Odyssey, Ulysses asks his crew to tie him to the mast and ignore his pleas as they sail past the Sirens, whose song lures sailors to their death. A Ulysses contract in psychiatry is an advance directive in which a person, while well, asks to be treated during a future episode even if they then refuse, because they know their illness, such as mania, will make them reject help they would want.

## Two kinds of directive
- Refusal directives: "Do not give me ECT" or "Do not give me olanzapine." These protect autonomy against unwanted treatment.
- Request or Ulysses directives: "If I become manic, admit and treat me even if I object." These use autonomy to authorise future treatment.

## Ethical tensions
- Which self has authority: the earlier well self or the present ill self? Critics argue that the present person always has a claim to be heard.
- Unforeseen circumstances: a person may not have imagined the situation or new treatments.
- Beneficence versus autonomy when a directive refuses all effective treatment despite serious risk.
- Pressure: directives may be written under family or clinician pressure, so voluntariness must be checked.

## How the MHCA handles them
The Act lets any adult state wishes and refusals, applies the directive only when capacity is lacking, excludes emergencies under section 94, and sends disagreements to the Mental Health Review Board, which checks voluntariness, capacity, information and whether the present situation was foreseen. This balances respect for the earlier wish with protection against harm.`,
    keyPoints: ["Ulysses and the Sirens explained", "Ulysses directive as request for future treatment", "Refusal versus request directives", "Which self has authority", "Unforeseen circumstances and voluntariness", "MHCA safeguards: capacity trigger, emergency exception, Board review"],
    pitfalls: ["Confusing a Ulysses directive with a refusal", "Not linking to the MHCA"],
    module: "ethics-law/2-2",
    visuals: [compare("Two kinds of directive", ["Refusal directive", ["Do not give me a named drug", "Protects against unwanted care", "Must be followed when capacity is lost"], "Autonomy as protection"], ["Ulysses directive", ["Treat me even if I refuse when ill", "Authorises future care", "Raises the question of which self decides"], "Autonomy as pre commitment"])],
    ref: "Dresser 1982 Ulysses contracts; MHCA 2017 ss 5, 11, 94",
  },
  {
    id: "eth-l01-009",
    subject: S,
    topic: "mhca-admission",
    marks: 20,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Describe the types of admission to a mental health establishment under the Mental Healthcare Act 2017, with their criteria, procedures, time limits and safeguards. Illustrate with case examples.",
    plan: ["Principles: least restrictive care and independent admission first", "Independent admission and discharge", "Admission of minors", "Supported admission up to 30 days and beyond", "Emergency treatment and other routes", "Safeguards and case examples"],
    answer: `## Principles
The Act prefers care in the community and, when admission is needed, independent admission with the person's own consent. Supported admission, which replaced involuntary admission, is a last resort and must be the least restrictive option. Every admission comes with information about rights and the possibility of review by the Mental Health Review Board.

## Independent admission (sections 85 to 88)
- Who: an adult with capacity, or needing only minimal support, who requests admission.
- Conditions: the illness is severe enough to need admission, the person is likely to benefit, and the request is made freely and with understanding.
- Treatment only with the person's informed consent.
- Discharge: the person can leave on request. Under section 88 a psychiatrist or mental health professional may prevent discharge for up to 24 hours for assessment if the person is believed to meet supported admission criteria; within that time they must be admitted under section 89 or allowed to leave.
- Example: a 30 year old software engineer with severe depression asks to be admitted for a week; he can leave whenever he chooses.

## Admission of a minor (section 87)
- Applied for by the nominated representative, usually the guardian.
- Two psychiatrists, or a psychiatrist and a mental health professional or medical practitioner, independently examine the minor within seven days before admission and agree that the minor has a mental illness of a severity needing admission, that admission is in the minor's best interests, and that community care is not suitable.
- The minor is kept separately from adults, in a child friendly environment.
- The nominated representative or an attendant stays with the minor throughout; if the minor is a girl and the representative is male, a female attendant is required.
- The Board is informed within 72 hours and reviews when admission reaches 30 days, and every 30 days after that.

## Supported admission up to 30 days (section 89)
- Who: a person with mental illness of a severity that, in the recent past, has led to threatened or attempted self harm, violence or threats of violence towards others, or inability to care for self to a degree that risks harm; and who is unable to make treatment decisions independently even with support.
- Procedure: independent examination by a psychiatrist and a mental health professional or medical practitioner, both agreeing that admission is the least restrictive option, taking into account any advance directive. The nominated representative applies.
- Duration: up to 30 days.
- Treatment: with the person's consent where possible; if they need nearly total support, the nominated representative may give temporary consent to a treatment plan, subject to any advance directive.
- Capacity is reviewed at least every seven days.
- The Board is informed within three days for women and minors and within seven days for others, and must review on request within seven days.
- Readmission under section 89 within seven days of discharge is not allowed; section 90 applies instead.

## Supported admission beyond 30 days (section 90)
- Requires examination by two psychiatrists within the previous seven days, and Board approval, with the Board deciding within 21 days.
- Initial period up to 90 days, then up to 120 days, then up to 180 days at a time.
- The Board weighs the need for institutional care against community alternatives.

## Emergency treatment (section 94)
Any registered medical practitioner may give emergency treatment, including transport to an establishment, to prevent death or irreversible harm, serious harm to the person or others, or serious damage to property, for up to 72 hours or until assessed at an establishment. ECT is not allowed as emergency treatment. Advance directives do not apply.

## Other routes
- Section 100: police must take a person found wandering or at risk, who appears to have mental illness, to the nearest public health establishment within 24 hours, never to a lock up.
- Section 102: a magistrate may order a person to be conveyed for assessment, or admitted for up to ten days.
- Section 103: prisoners with mental illness are transferred under criminal procedure orders.

## Safeguards
- Information about rights in a language the person understands (section 22).
- Nominated representative informed and involved.
- Board review with short time limits.
- Discharge planning involving the person, representative and community psychiatrist (section 98).
- Prohibited treatments, restraint rules and the ban on seclusion apply throughout.

## Case example
A 40 year old man with schizophrenia has not eaten for four days because he believes his food is poisoned and has threatened a neighbour. He refuses admission and cannot appreciate the risks. A psychiatrist and a medical officer examine him independently and agree; his brother, the nominated representative, applies for supported admission under section 89. He is told his rights, the Board is informed within seven days, and his capacity is reviewed weekly. After three weeks he regains capacity and chooses to stay as an independent patient.

## Conclusion
The MHCA offers graded routes from independent admission to supported admission, each with criteria, time limits and Board oversight, so that loss of liberty is limited, justified and reviewed.`,
    keyPoints: ["Least restrictive care and preference for independent admission", "Independent admission and the 24 hour hold under section 88", "Minors: two examiners, separate facilities, attendant, Board in 72 hours", "Section 89 criteria, two examiners, 30 days, weekly capacity review", "Board notification three or seven days; seven day review", "Section 90 with two psychiatrists, 21 day decision, 90, 120 and 180 day periods", "Section 94 emergency: 72 hours, no ECT", "Police and magistrate routes and safeguards"],
    pitfalls: ["Calling supported admission involuntary admission without explanation", "Wrong durations", "Saying relatives can request independent admission"],
    module: "ethics-law/2-3",
    visuals: [
      fig("mhca-time-limits", "Supported admission up to 30 days: the time limits of the Act drawn to scale"),
      tree("Principles", [["Person may need admission", "Choose the least restrictive route", -1], ["Adult with capacity who asks", "Independent admission, sections 85 and 86", 0], ["A minor", "Section 87 with two examiners and an attendant", 0], ["Very high support needed, with risk", "Supported admission, section 89, then section 90", 0], ["Emergency anywhere", "Section 94, up to 72 hours, no ECT", 0]]),
    ],
    ref: "MHCA 2017 ss 85-90, 94, 98, 100, 102, 103; PRS text of the Act; ethics-law module 2.3",
  },
  {
    id: "eth-l01-010",
    subject: S,
    topic: "mhca-emergency",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Write a short note on emergency treatment under section 94 of the Mental Healthcare Act 2017.",
    plan: ["Who may give it and when", "Duration and exclusions", "Safeguards", "Example"],
    answer: `## Who and when
Section 94 allows any registered medical practitioner, not only a psychiatrist, to provide emergency treatment to a person with mental illness, in a health establishment or in the community, with the informed consent of the nominated representative where available. Emergency treatment means treatment immediately necessary to prevent:
- Death or irreversible harm to the person's health.
- The person inflicting serious harm on self or others.
- The person causing serious damage to property belonging to self or others, where this behaviour arises from the mental illness.
Transporting the person to the nearest mental health establishment for assessment also counts as emergency treatment.

## Duration and exclusions
- It lasts up to 72 hours, or until the person has been assessed at a mental health establishment, whichever is earlier. During a notified disaster or emergency the period can be extended up to seven days.
- ECT is not permitted as emergency treatment.
- Advance directives do not apply to emergency treatment.

## Safeguards
- Treatment must be directly related to the emergency, not a full course of treatment.
- The practitioner should record the criterion met, the treatment given and the reasons.
- After assessment, further care must follow the Act's admission routes, such as independent or supported admission.

## Example
A man with mania climbs onto a roof in a small town and threatens to jump. The local doctor sedates him with the brother's consent and arranges an ambulance to the district hospital. This is lawful emergency treatment; at the hospital he is assessed and admitted under section 89.`,
    keyPoints: ["Any registered medical practitioner", "Three emergency criteria", "Conveying for assessment counts", "72 hours or until assessed; seven days in notified disasters", "No ECT; advance directives do not apply", "Record and move to proper admission route"],
    pitfalls: ["Saying only a psychiatrist can give it", "Allowing ECT"],
    module: "ethics-law/2-3",
    visuals: [vis("guess", { prompt: "For how many hours, at most, can emergency treatment under section 94 continue outside a notified disaster?", min: 0, max: 168, unit: "hours", answer: [72, 72], reveal: "72 hours, or until assessment at a mental health establishment, whichever is earlier. ECT is never emergency treatment." }, "Duration and exclusions")],
    ref: "MHCA 2017 s 94; ethics-law module 2.3",
  },
]);
