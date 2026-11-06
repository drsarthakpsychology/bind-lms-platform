/* Module · Ethics and Indian mental health law, Parts III and IV (Advanced level and exam zone). Original text written for VIBHA School of Psychology. Legal content is educational, verified as of Nov 2026, and is not legal advice. */
export const part2 = String.raw`
# Part III · Advanced: children, disability, courts, research, dilemmas and programmes

## 3.1 Children: POCSO, juvenile justice and consent [core][advanced]
### POCSO Act 2012
The **Protection of Children from Sexual Offences Act** protects every person **under 18** from sexual assault, sexual harassment and use in pornography. It is gender-neutral and child-friendly in procedure.

**Mandatory reporting**
- **Section 19**: **any person** (including a doctor, psychologist, counsellor or teacher) who knows, or has reason to fear, that a sexual offence against a child has been or is likely to be committed **must report** it to the Special Juvenile Police Unit or the local police.
- **Section 21**: failure to report is an offence, punishable with imprisonment up to six months, a fine, or both; a person in charge of an institution who fails to report an offence by a subordinate faces up to one year and a fine. A child is not punished for not reporting.
- The duty applies even if the child or family begs you not to report, and even if the disclosure was in therapy.

**Child-friendly procedure**: the child's statement is recorded where the child is comfortable, by a woman officer where possible, without uniform; the child's identity must never be disclosed in the media (section 23); a support person can be assigned; special courts hear cases; and an expert such as a psychologist can assist the child in communicating (section 39 guidelines).

:::widget decide
{
  "scene": "In a school counselling session in Indore, Ananya, 13, tells you that her uncle, who lives with the family, touches her in ways she does not like when her parents are out. She begs you not to tell anyone: 'Mummy will be so upset, and he will hurt me.'",
  "ask": "What must the counsellor do?",
  "choices": [
    { "label": "Promise secrecy and keep working on her feelings", "verdict": "harm", "outcome": "The abuse continues for months; the counsellor later faces prosecution for not reporting.", "why": "POCSO section 19 makes reporting mandatory for anyone with knowledge. Secrecy leaves the child in danger and is itself an offence under section 21." },
    { "label": "Listen calmly, believe and reassure her it is not her fault, avoid leading questions, explain honestly that you must tell people whose job is to keep her safe, report to the police or Special Juvenile Police Unit (and inform the school head under the school's policy), and arrange support and safety", "verdict": "best", "outcome": "Police and child welfare act; the uncle is removed from the home; Ananya receives trauma-focused support.", "why": "This meets the legal duty and does it in a child-centred way: belief, safety, honesty, minimal questioning (to avoid contaminating evidence), and support." },
    { "label": "Call the uncle to ask for his side", "verdict": "harm", "outcome": "The uncle threatens Ananya, she retracts, and evidence is lost.", "why": "Never confront an alleged abuser. It endangers the child and the case." }
  ]
}
:::


:::widget flow
{
 "title": "When a child discloses sexual abuse",
 "layout": "chain",
 "nodes": [
  {
   "id": "l",
   "label": "Listen and believe",
   "detail": "Stay calm. 'Thank you for telling me. It is not your fault.'"
  },
  {
   "id": "n",
   "label": "No leading questions",
   "detail": "Let the child tell in their words; do not interview in detail."
  },
  {
   "id": "h",
   "label": "Be honest about next steps",
   "detail": "Explain that you must tell people whose job is to keep them safe."
  },
  {
   "id": "r",
   "label": "Record verbatim",
   "detail": "Date, time, words used, who was present."
  },
  {
   "id": "p",
   "label": "Report",
   "detail": "To the Special Juvenile Police Unit or local police (POCSO section 19); follow institutional procedure."
  },
  {
   "id": "s",
   "label": "Safety and support",
   "detail": "Child Welfare Committee if care is needed; trauma-informed support."
  }
 ],
 "caption": "Never confront the alleged abuser. Failure to report is an offence under section 21."
}
:::

### The hard case: adolescents in consensual relationships
POCSO treats **any** sexual activity with a person under 18 as an offence, regardless of consent. When a 17-year-old tells you she is in a consensual sexual relationship with a 19-year-old, the law still requires reporting. Clinicians and courts have debated this. The Law Commission (Report No. 283, 2023) recommended **against** lowering the age of consent, while suggesting judicial discretion in sentencing for genuine adolescent relationships. In 2022, the Supreme Court held that when a minor seeks a medical termination of pregnancy, the doctor need **not** disclose the minor's identity and personal details in the POCSO report, to protect her access to safe care.

### Juvenile Justice (Care and Protection of Children) Act 2015
- Covers **children in conflict with law** and **children in need of care and protection** (including abandoned, abused and trafficked children), and adoption.
- For a child of **16 to 18** alleged to have committed a **heinous offence**, the Juvenile Justice Board conducts a **preliminary assessment** of the child's **mental and physical capacity** to commit the offence, ability to understand its consequences, and the circumstances (section 15), with help from experienced psychologists or psycho-social workers. The child may then be tried as an adult by a Children's Court.

### Consent and confidentiality with minors
- Under Indian law, for treatment the **guardian's consent** is generally required for those under 18, with the child's **assent** sought according to age and maturity.
- Adolescents should be offered **some private time** in sessions. Agree the limits at the start: safety, abuse and serious risk will be shared.

:::clinician
Practical POCSO points for clinicians: record the disclosure verbatim, with date, time and who was present; do not conduct an investigative interview (leave it to trained professionals); inform the Child Welfare Committee where the child needs care and protection (JJ Act); and remember that delays in reporting are a frequent reason for prosecution of professionals. The 2019 amendment increased punishments, including the death penalty for aggravated penetrative sexual assault. The 2022 Supreme Court judgment in X v. Principal Secretary, Health and Family Welfare Department, Govt of NCT of Delhi read the MTP Act to protect minors' identity in POCSO reporting. Clinicians working with adolescents in sexual health should know the tension between mandatory reporting and access to care; studies from India document deterrence of adolescents from seeking services. Under section 15 JJ Act assessments, guidelines (Ministry of Women and Child Development, and later court directions) stress that the psychologist assesses capacity and understanding, not guilt, and should use structured, developmentally appropriate methods.
:::

:::recall
1. Which POCSO sections set the reporting duty and the penalty for not reporting? || Section 19 (duty to report) and section 21 (penalty for failure).
2. Who must report under POCSO? || Any person who knows or has reason to fear an offence, including clinicians and teachers.
3. What did the Supreme Court decide in 2022 about POCSO reports for minors seeking termination of pregnancy? || The doctor need not disclose the minor's identity and personal details in the report.
4. What does section 15 of the JJ Act involve for psychologists? || A preliminary assessment of a 16 to 18-year-old's mental and physical capacity and understanding in heinous offences.
:::

:::mcq
Q: Under POCSO, a psychologist who learns in therapy that a 15-year-old is being sexually abused should:
- Keep it confidential as requested
- *Report it to the police or Special Juvenile Police Unit
- Wait for the parents to decide
- Investigate by questioning the alleged abuser
> Reporting is mandatory.

Q: When a child discloses abuse, the clinician should avoid:
- Listening calmly
- Reassuring that it is not the child's fault
- *Asking detailed leading questions about what happened
- Recording the disclosure verbatim
> Leading questions can contaminate evidence.
:::

## 3.2 Disability law: the RPwD Act 2016 [core][advanced]
### What the Act does
The **Rights of Persons with Disabilities Act 2016** gives effect to the UN Convention on the Rights of Persons with Disabilities. It recognises **21 specified disabilities**, including:
- **Intellectual disability**, including **specific learning disabilities** (such as dyslexia) and **autism spectrum disorder**.
- **Mental illness**.
- Chronic neurological conditions (multiple sclerosis, Parkinson's disease), and many physical and sensory disabilities.

### Key ideas
- **Benchmark disability**: a disability of at least 40 per cent, as certified. It opens reservations and certain benefits.
- **Reasonable accommodation**: necessary and appropriate changes (extra exam time, a scribe, flexible hours) that do not impose a disproportionate burden.
- **Equality and non-discrimination** (section 3).
- **Education**: free education for children with benchmark disabilities from 6 to 18 (section 31); **5 per cent** reservation of seats in government and government-aided higher education institutions (section 32).
- **Employment**: at least **4 per cent** reservation of posts in government establishments for persons with benchmark disabilities (section 34).
- **Limited guardianship** (section 14): where a person with disability cannot take legally binding decisions even with support, a court or designated authority can appoint a limited guardian who makes **joint decisions** with the person, respecting their wishes. Plenary (total) guardianship is not the default.
- **Offences** (section 92): insulting, assaulting, or denying food or fluids to a person with disability, among others, are punishable.
- **Certification** (sections 57 and 58): by notified medical authorities using notified guidelines; a **Unique Disability ID (UDID) card** is issued nationally.


:::widget flow
{
 "title": "From impairment to rights under the RPwD Act",
 "layout": "chain",
 "nodes": [
  {
   "id": "i",
   "label": "Impairment",
   "detail": "For example dyslexia, autism, intellectual disability or chronic mental illness."
  },
  {
   "id": "a",
   "label": "Assessment",
   "detail": "Notified tools: IQ and VSMS, ISAA, the SLD battery, IDEAS."
  },
  {
   "id": "c",
   "label": "Certificate and UDID card",
   "detail": "Issued by the notified medical authority or board."
  },
  {
   "id": "b",
   "label": "Benchmark 40 per cent or more",
   "detail": "Opens reservations in education (5 per cent) and government jobs (4 per cent) and other benefits."
  },
  {
   "id": "r",
   "label": "Reasonable accommodation",
   "detail": "Extra time, a scribe, flexible work; a right whatever the percentage."
  }
 ],
 "caption": "The Act follows the social model: disability arises from impairment meeting barriers."
}
:::

### Certification tools you will meet
| Disability | Common tools under the guidelines |
|---|---|
| Intellectual disability | Standardised IQ test (for example Binet-Kamat, MISIC) plus adaptive functioning (for example VSMS) |
| Autism | Indian Scale for Assessment of Autism (ISAA) |
| Specific learning disability | Screening at school, IQ test, then specific tests such as the NIMHANS SLD battery |
| Mental illness | Indian Disability Evaluation and Assessment Scale (IDEAS) |

:::widget decide
{
  "scene": "Raghav, 19, a first-year BCom student in Chennai with dyslexia certified at 45 per cent, asks the college for a scribe and extra time. The principal refuses: 'If we help him, others will ask too. He should cope like everyone else.'",
  "ask": "What is the legal and ethical position?",
  "choices": [
    { "label": "The principal is right; equal treatment means the same conditions for all", "verdict": "harm", "outcome": "Raghav fails exams that test his reading speed, not his knowledge of commerce.", "why": "Equality under the RPwD Act includes reasonable accommodation. Identical conditions for unequal starting points are discrimination." },
    { "label": "He has a benchmark disability and a right to reasonable accommodation (scribe, extra time) under the RPwD Act and the exam guidelines; the college should provide it, and Raghav can approach the grievance officer or Chief Commissioner for Persons with Disabilities if refused", "verdict": "best", "outcome": "The college provides accommodations; Raghav passes with good marks.", "why": "Reasonable accommodation is a legal duty, and there are clear grievance routes." },
    { "label": "Tell Raghav to get a fake certificate of more severe disability", "verdict": "harm", "outcome": "Fraud.", "why": "Never falsify certification." }
  ]
}
:::

:::clinician
The RPwD Act's definition of persons with disability is broad (long-term physical, mental, intellectual or sensory impairment which, in interaction with barriers, hinders full and effective participation), reflecting the social model. The National Trust Act 1999 remains relevant for guardianship of persons with autism, cerebral palsy, intellectual disability and multiple disabilities, through Local Level Committees; there is ongoing debate about aligning it with the RPwD Act's limited guardianship and supported decision-making. Disability certification for mental illness uses IDEAS (self-care, interpersonal activities, communication and understanding, work, and duration of illness), with the guidelines notified in 2018 and amended in 2020. Under the RPwD Act, a certificate can be challenged before the appellate authority. For persons with mental illness, the interplay between the MHCA (treatment, capacity) and the RPwD Act (rights, benefits, guardianship) is a frequent examination topic: the MHCA governs mental healthcare decisions; the RPwD Act governs disability rights and legal capacity for other decisions.
:::

:::recall
1. How many disabilities does the RPwD Act recognise, and name three relevant to psychology. || 21; intellectual disability (including SLD and autism), mental illness, and chronic neurological conditions.
2. What is a benchmark disability? || A certified disability of at least 40 per cent.
3. What are the reservations in higher education and government jobs? || At least 5 per cent of higher education seats; at least 4 per cent of government posts.
4. What is limited guardianship? || A guardian who takes joint decisions with the person, respecting their wishes, when they cannot decide even with support (section 14).
:::

:::mcq
Q: Extra exam time for a student with dyslexia is an example of:
- Positive discrimination that is illegal
- *Reasonable accommodation
- Limited guardianship
- Benchmark certification
> A necessary adjustment.

Q: Under the RPwD Act, autism is assessed for certification mainly using:
- MMPI-2
- *ISAA
- PANSS
- IDEAS
> Indian Scale for Assessment of Autism.
:::

## 3.3 Criminal law, the courtroom and negligence [core][advanced]
### Unsoundness of mind as a defence (BNS section 22)
"Nothing is an offence which is done by a person who, at the time of doing it, by reason of **unsoundness of mind**, is **incapable of knowing the nature of the act**, or that he is doing what is either **wrong or contrary to law**." This is the same as the old IPC section 84 and is based on the English **M'Naghten Rules** (1843).

Key points:
- It is **legal** insanity, not medical diagnosis. A person may have schizophrenia and still know their act was wrong.
- The relevant time is **the time of the act**.
- The **burden of proof** lies on the accused, on the balance of probabilities.
- Courts look at behaviour before, during and after the act (planning, hiding evidence, fleeing suggest knowledge of wrongfulness).

### Intoxication (BNS sections 23 and 24)
- **Involuntary** intoxication (given without knowledge or against will) that makes a person incapable of knowing the nature or wrongness of the act is a defence.
- **Voluntary** intoxication is **not** a defence; the law treats the person as having the knowledge they would have had if sober.


:::widget flow
{
 "title": "Two different legal questions",
 "layout": "tree",
 "nodes": [
  {
   "id": "q",
   "label": "A mentally ill accused"
  },
  {
   "id": "r",
   "label": "Responsibility at the time of the act (BNS 22)",
   "parent": "q",
   "detail": "Could they know the nature of the act, or that it was wrong or contrary to law? Looks back to the offence."
  },
  {
   "id": "f",
   "label": "Fitness to stand trial now (BNSS 367 to 378)",
   "parent": "q",
   "detail": "Can they understand the proceedings and make a defence? Looks at the present."
  },
  {
   "id": "r1",
   "label": "If not responsible: acquittal, with care",
   "parent": "r"
  },
  {
   "id": "f1",
   "label": "If unfit: trial postponed, treatment, resume when fit",
   "parent": "f"
  }
 ],
 "caption": "Exams often mix these up. One looks back, the other looks at today."
}
:::

### Fitness to stand trial (BNSS sections 367 to 378)
When an accused person appears to be of **unsound mind or to have an intellectual disability** and so **cannot understand the proceedings or make a defence**:
- The court has the person examined (by a civil surgeon or medical officer, and a psychiatrist or clinical psychologist).
- If found unfit, the trial is **postponed**, the person may be released on bail with arrangements for treatment or kept in care under the MHCA, and the trial resumes when they become fit.
- The BNSS replaced older terms with "mental illness" and "intellectual disability" and allows discharge where a fair trial is not possible.

### Drugs and the law: the NDPS Act 1985
- Consumption of a narcotic drug or psychotropic substance is an offence (section 27).
- **Section 64A**: a person charged with consumption, or with possessing a **small quantity** for personal use, who **volunteers for de-addiction treatment** at a recognised centre, is **immune from prosecution** if they complete treatment.
- The government may set up treatment and rehabilitation centres (section 71).

### The expert witness
Under the **Bharatiya Sakshya Adhiniyam 2023, section 39** (formerly Evidence Act section 45), courts may rely on the **opinions of experts**, including psychiatrists and psychologists. As an expert:
- Be clear whether you are a **treating clinician** or an **independent assessor**; avoid being both where possible.
- Stay within your expertise and evidence.
- Separate **facts** (what you observed), **opinion** (what you conclude) and **limitations**.
- Be impartial: your duty is to the court, not the side that called you.

:::widget decide
{
  "scene": "You are asked to assess Mr Q, 30, accused of killing his neighbour in a village near Nashik. He has schizophrenia. Witnesses say he hid the weapon, washed his clothes and fled to a relative's house. He says voices told him the neighbour was a demon, but also that he 'knew the police would come'.",
  "ask": "What is the most accurate way to frame your opinion for the court?",
  "choices": [
    { "label": "State that because he has schizophrenia, he is legally insane under BNS section 22", "verdict": "harm", "outcome": "The opinion is discredited on cross-examination for confusing diagnosis with the legal test.", "why": "A diagnosis does not automatically meet the legal test. The question is his capacity, at the time, to know the nature of the act or that it was wrong or contrary to law." },
    { "label": "Describe his illness and mental state around the time of the act, the evidence bearing on knowledge of nature and wrongfulness (both the delusional belief and the hiding and fleeing), and state your opinion with its limitations, leaving the legal decision to the court", "verdict": "best", "outcome": "The court weighs a balanced, transparent report.", "why": "This separates clinical facts from legal conclusions and is honest about conflicting evidence." },
    { "label": "Refuse to give any opinion", "verdict": "ok", "outcome": "The court lacks the expert help it needs.", "why": "If competent and independent, you should assist the court within your expertise." }
  ]
}
:::

### Medical negligence
- Negligence means a **duty of care**, a **breach** of the expected standard, and **harm** caused by that breach.
- The **Bolam test**: a professional is not negligent if they acted in accordance with a practice accepted as proper by a responsible body of professionals in that field.
- **Jacob Mathew v. State of Punjab (2005)**: the Supreme Court held that **criminal** liability for medical negligence requires **gross** negligence or recklessness, not mere error of judgement.
- **Consumer Protection Act 2019**: patients can bring claims for deficiency in medical services (medical services were brought within consumer law in **Indian Medical Association v. V. P. Shantha**, 1995).
- Common mental health negligence claims: suicide of an inpatient without adequate observation, failure to warn about serious side effects (for example tardive dyskinesia, lithium toxicity), inadequate monitoring (clozapine blood counts), and breaches of confidentiality.

### Landmark judgments to know
| Case | Year | Why it matters |
|---|---|---|
| **Justice K. S. Puttaswamy v. Union of India** | 2017 | Privacy is a fundamental right, including health information |
| **Common Cause v. Union of India** | 2018 | Recognised living wills and passive euthanasia; procedures simplified in 2023 |
| **Navtej Singh Johar v. Union of India** | 2018 | Decriminalised consensual same-sex relations; mental health bodies affirmed homosexuality is not an illness |
| **Shatrughan Chauhan v. Union of India** | 2014 | Mental illness after sentence is a ground for commuting a death sentence |
| **Accused X v. State of Maharashtra** | 2019 | Severe mental illness after conviction is a mitigating factor against execution |

:::clinician
Indian courts apply BNS 22 (IPC 84) narrowly: medical insanity is not enough; the test is cognitive (knowledge of nature or wrongfulness or illegality), with no volitional (irresistible impulse) limb. Key IPC-era cases remain authoritative: Dahyabhai Chhaganbhai Thakkar v. State of Gujarat (1964) on the burden of proof (the accused must establish the exception on a balance of probabilities, though a reasonable doubt raised by the evidence can still benefit the accused), and Surendra Mishra v. State of Jharkhand (2011) emphasising that not every mental illness exempts from responsibility. Fitness assessment should address understanding of charges, of court procedure, ability to instruct counsel, follow proceedings and give evidence (the Pritchard criteria from English law are often used as a framework). Write court reports with numbered paragraphs, sources of information, the questions asked, your opinion on each, and a declaration of impartiality. On negligence, Bolam has been qualified in the UK by Bolitho (1997, practice must withstand logical analysis) and Montgomery (2015, informed consent judged by what a reasonable patient would want to know); Indian courts have cited Montgomery in consent cases.
:::

:::recall
1. State the legal test in BNS section 22. || At the time of the act, by reason of unsoundness of mind, incapable of knowing the nature of the act, or that it was wrong or contrary to law.
2. Is voluntary intoxication a defence? || No; the person is treated as having the knowledge they would have had if sober.
3. Which BNSS sections cover accused persons of unsound mind? || Sections 367 to 378.
4. What does NDPS section 64A provide? || Immunity from prosecution for users charged with consumption or small quantities who volunteer for and complete de-addiction treatment.
5. What did Jacob Mathew (2005) hold? || Criminal liability for medical negligence requires gross negligence or recklessness.
:::

:::mcq
Q: The Indian test for criminal insanity is based on:
- The Durham rule
- The irresistible impulse test
- *The M'Naghten Rules
- The ALI test
> Cognitive test of knowledge.

Q: Expert opinion in Indian courts is now governed by:
- BNS section 22
- *BSA section 39
- BNSS section 367
- MHCA section 23
> Formerly Evidence Act section 45.

Q: Under the Bolam test, a practitioner is not negligent if:
- The patient is happy
- *They acted according to a practice accepted as proper by a responsible body of professionals
- They charged a low fee
- No harm occurred, whatever they did
> The professional standard of care.
:::

## 3.4 Research ethics [core][advanced]
### Why research ethics exists
Research ethics grew out of terrible abuses:
- **Nazi experiments** on prisoners led to the **Nuremberg Code** (1947): voluntary consent is absolutely essential.
- The **Tuskegee syphilis study** (USA, 1932 to 1972): Black men with syphilis were observed without treatment, even after penicillin became available. It led to the **Belmont Report** (1979).
- In psychology, **Milgram's obedience studies** (1960s), the **Stanford Prison Experiment** (1971) and **Little Albert** (1920) raised questions about deception, distress and the right to withdraw.


:::widget flow
{
 "title": "How research ethics grew",
 "layout": "chain",
 "nodes": [
  {
   "id": "n",
   "label": "1947: Nuremberg Code",
   "detail": "After Nazi experiments: voluntary consent is essential."
  },
  {
   "id": "h",
   "label": "1964: Declaration of Helsinki",
   "detail": "Ethics committees, vulnerable groups; revised many times, most recently in 2024."
  },
  {
   "id": "t",
   "label": "1972: Tuskegee exposed",
   "detail": "Untreated syphilis study revealed in the USA."
  },
  {
   "id": "b",
   "label": "1979: Belmont Report",
   "detail": "Respect for persons, beneficence, justice."
  },
  {
   "id": "i",
   "label": "2017: ICMR guidelines; MHCA section 99",
   "detail": "India's national guidance, and special consent rules for people with mental illness."
  },
  {
   "id": "d",
   "label": "2019 and 2023: drug trial rules and data protection",
   "detail": "New Drugs and Clinical Trials Rules; the Digital Personal Data Protection Act."
  }
 ],
 "caption": "Each rule was written in response to a harm. Press Play and say which harm each one answers."
}
:::

### The key documents
| Document | Main contribution |
|---|---|
| **Nuremberg Code** (1947) | Voluntary consent; favourable risk-benefit; right to withdraw |
| **Declaration of Helsinki** (World Medical Association, 1964; most recently revised in 2024) | Ethics of medical research; independent ethics committees; protection of vulnerable groups; placebo rules |
| **Belmont Report** (1979) | Three principles: **respect for persons** (consent, protecting those with reduced autonomy), **beneficence** (maximise benefits, minimise harms), **justice** (fair selection and sharing of burdens and benefits) |
| **ICMR National Ethical Guidelines for Biomedical and Health Research Involving Human Participants** (2017) | India's main guidance, including social, behavioural and mental health research, vulnerable groups, and ethics committees |
| **New Drugs and Clinical Trials Rules** (2019) | Legal rules for clinical trials of drugs in India, including compensation for injury |
| **MHCA 2017, section 99** | Special consent rules for research with persons with mental illness |

### Core requirements in practice
1. **Ethics committee approval** before starting (Institutional Ethics Committee, registered as required).
2. **Informed consent**: purpose, procedures, risks, benefits, alternatives, confidentiality, voluntariness, right to withdraw without penalty, contacts. In India, often in the participant's language, read aloud for those with low literacy; audio-video recording of consent is required for certain drug trials.
3. **Special protection for vulnerable groups**: children (guardian consent plus child's assent), prisoners, persons with mental illness or intellectual disability, pregnant women, people in poverty or dependent relationships (students, employees).
4. **Minimising risk**: including psychological distress (have a referral plan if questionnaires reveal suicidal thoughts).
5. **Confidentiality and data protection**: anonymise, store securely, limit access, follow the DPDP Act 2023.
6. **Deception** only when essential, when no harmless alternative exists, when it would not affect willingness to take part, and with **debriefing** afterwards.
7. **Registration** of clinical trials in the Clinical Trials Registry of India (CTRI) before enrolling the first participant.
8. **Honest reporting**: no fabrication, falsification or plagiarism; declare conflicts of interest; credit authors fairly.

:::widget decide
{
  "scene": "An MA student in Hyderabad plans an online survey on suicidal thoughts among college students, using the PHQ-9 and a suicide ideation scale. She plans to keep it fully anonymous and has not planned what to do if someone reports active suicidal intent.",
  "ask": "What must she add before the ethics committee approves it?",
  "choices": [
    { "label": "Nothing; anonymity solves everything", "verdict": "harm", "outcome": "Several respondents report active suicidal plans and nobody can respond.", "why": "Research that may reveal serious risk needs a plan to provide help, even when anonymous." },
    { "label": "A clear distress protocol: information about how to get help shown to all participants (and immediately to those who score high), a choice to leave contact details for follow-up, a named supervisor, and consent that explains these steps and the limits of confidentiality", "verdict": "best", "outcome": "The committee approves; two participants who left contact details are connected to the college counselling service.", "why": "Beneficence and respect for persons require planning for foreseeable distress and risk." },
    { "label": "Remove all questions about suicide to avoid problems", "verdict": "ok", "outcome": "Safer to run, but the important research question cannot be answered.", "why": "Asking about suicide does not increase risk, and the research has value; the solution is a safety protocol, not avoidance." }
  ]
}
:::

:::widget sort
{
  "prompt": "Which Belmont principle is most directly at stake?",
  "buckets": ["Respect for persons", "Beneficence", "Justice"],
  "items": [
    { "text": "Testing a new drug only on poor patients in government hospitals while the rich get the benefits", "bucket": 2 },
    { "text": "Enrolling people with dementia without their or their representatives' informed consent", "bucket": 0 },
    { "text": "A study that causes severe distress with little scientific benefit", "bucket": 1 },
    { "text": "Students feeling they must join their professor's study to pass", "bucket": 0, "why": "Coercion undermines voluntariness, part of respect for persons." },
    { "text": "Excluding women from trials so results do not apply to them", "bucket": 2 }
  ]
}
:::

:::clinician
The ICMR 2017 guidelines set out twelve general principles (including essentiality, voluntariness, non-exploitation, social responsibility, privacy, risk minimisation, professional competence, maximisation of benefit, institutional arrangements, transparency, totality of responsibility and environmental protection) and specific sections on social and behavioural research, vulnerable populations, research with children (with separate ICMR paediatric guidelines, 2017) and public health emergencies (added in 2020). Ethics committees for biomedical and health research must register with the Department of Health Research (through the NECRBHR process), and those reviewing drug trials must also register with CDSCO under the NDCT Rules 2019. The 2024 Helsinki revision emphasised community engagement, research in emergencies, and the use of data and biological material. ICMR also issued ethical guidelines for the application of artificial intelligence in biomedical research and healthcare (2023). MHCA section 99 adds: research on persons unable to consent requires State Mental Health Authority permission plus NR consent under strict conditions; case-note studies are not restricted if anonymity is protected; and consent can be withdrawn at any time. Common examination question: compare the Belmont principles with principlism (Belmont lacks a separate non-maleficence principle; it is folded into beneficence).
:::

:::recall
1. What did the Nuremberg Code establish? || That voluntary consent is absolutely essential, with favourable risk-benefit and the right to withdraw.
2. Name the three Belmont principles. || Respect for persons, beneficence, justice.
3. What is India's main research ethics guidance for human participants? || The ICMR National Ethical Guidelines (2017).
4. When is deception in research acceptable? || Only when essential, with no harmless alternative, not affecting willingness to participate, and followed by debriefing.
5. Where must clinical trials in India be registered before enrolment? || The Clinical Trials Registry of India (CTRI).
:::

:::mcq
Q: The Tuskegee study led most directly to the:
- Nuremberg Code
- *Belmont Report
- MHCA 2017
- RPwD Act
> US response to the abuse.

Q: Under MHCA section 99, research with a person with mental illness who cannot consent requires:
- Only the researcher's judgement
- *Permission of the State Mental Health Authority and consent of the nominated representative, under strict conditions
- Police permission
- Nothing if it is low-cost
> Special protection for those unable to consent.
:::

## 3.5 Working through ethical dilemmas [core][advanced]
### An eight-step model
1. **Identify** the problem: what exactly is the ethical question? Whose interests are involved?
2. **Gather facts**: clinical, legal, cultural.
3. **Check the rules**: law (MHCA, POCSO, RCI), codes (RCI, APA, IACP), institutional policy.
4. **Name the principles** in tension (for example autonomy versus beneficence).
5. **List the options**, including creative middle paths.
6. **Weigh the consequences** of each for everyone affected.
7. **Consult**: supervisor, senior, ethics committee, legal adviser.
8. **Decide, act, document and review** the outcome.


:::widget flow
{
 "title": "The eight-step dilemma model",
 "layout": "chain",
 "nodes": [
  {
   "id": "1",
   "label": "Identify the problem"
  },
  {
   "id": "2",
   "label": "Gather facts"
  },
  {
   "id": "3",
   "label": "Check law and codes"
  },
  {
   "id": "4",
   "label": "Name the principles in tension"
  },
  {
   "id": "5",
   "label": "List options",
   "detail": "Include creative middle paths."
  },
  {
   "id": "6",
   "label": "Weigh consequences"
  },
  {
   "id": "7",
   "label": "Consult"
  },
  {
   "id": "8",
   "label": "Decide, act, document, review"
  }
 ],
 "caption": "Use it on each dilemma below before you choose an answer."
}
:::

:::mnemonic "I Give Clear Names, Listing Weighted Choices, Documented"
**I**dentify, **G**ather facts, **C**heck the rules, **N**ame principles, **L**ist options, **W**eigh consequences, **C**onsult, **D**ecide and document.
:::

### Dilemmas to practise

:::widget decide
{
  "scene": "A 55-year-old businessman in Ahmedabad, whom you see for anxiety, gives you an expensive gold watch at the end of therapy, saying, 'In our family we always honour our guru.' Refusing would offend him deeply.",
  "ask": "What is the best course?",
  "choices": [
    { "label": "Accept it; refusing is culturally insensitive", "verdict": "harm", "outcome": "He later asks you to give his son a favourable report for a court case, reminding you of the watch.", "why": "Valuable gifts create obligation and blur boundaries, whatever the cultural framing." },
    { "label": "Thank him warmly, acknowledge the meaning of the gesture, explain gently that professional rules do not allow you to accept valuable gifts, and suggest that a card or a small token (or a donation to a charity he values) would mean as much; document and discuss in supervision", "verdict": "best", "outcome": "He is briefly disappointed, then writes a heartfelt letter that you keep.", "why": "Cultural respect and clear boundaries can coexist. The meaning of the gift is honoured without the obligation." },
    { "label": "Accept it secretly and tell no one", "verdict": "harm", "outcome": "Secrecy is itself a warning sign of a boundary violation.", "why": "Hidden gifts erode professional integrity." }
  ]
}
:::

:::widget decide
{
  "scene": "The family of Mr Sinha, 40, who has schizophrenia and is currently well with capacity, asks you to secretly crush his medicine into his food because he 'sometimes forgets'. He has said he wants to reduce his dose.",
  "ask": "What is the ethical and legal response?",
  "choices": [
    { "label": "Agree; it is for his good", "verdict": "harm", "outcome": "He discovers it, stops eating at home, and refuses all care.", "why": "Covert medication of an adult with capacity violates autonomy, consent and the MHCA, and destroys trust." },
    { "label": "Decline covert medication; meet Mr Sinha and his family together to discuss his wish to reduce the dose, agree a supervised plan with early warning signs, and consider adherence supports he accepts (reminders, pill boxes, a long-acting injection if he chooses)", "verdict": "best", "outcome": "A small, monitored dose reduction is agreed; the family feels heard and Mr Sinha stays engaged.", "why": "Shared decision-making respects autonomy while addressing the family's legitimate worry." },
    { "label": "Tell the family it is their decision", "verdict": "harm", "outcome": "The family proceeds; trust and the therapeutic relationship break down.", "why": "The clinician cannot delegate an unethical act." }
  ]
}
:::

:::widget decide
{
  "scene": "A former client, now discharged for eight months, sends you a friend request on Instagram and a message: 'You changed my life. Can we meet for coffee as friends?'",
  "ask": "What is the most appropriate response?",
  "choices": [
    { "label": "Accept and meet; therapy has ended", "verdict": "harm", "outcome": "The power imbalance continues; she cannot return to you for help when she relapses.", "why": "Post-therapy friendships risk exploitation and close the door to future care. Most codes advise against them." },
    { "label": "Do not accept; reply briefly through a professional channel, thanking her, explaining that you keep professional boundaries so that you can always be available as a professional if she needs help again", "verdict": "best", "outcome": "She understands; a year later she returns for a few sessions during a hard time.", "why": "Warm, clear and protective of her future access to care." },
    { "label": "Ignore the message", "verdict": "ok", "outcome": "She feels rejected and confused.", "why": "Silence avoids the boundary problem but misses a chance to explain kindly." }
  ]
}
:::

:::widget decide
{
  "scene": "A psychologist in Delhi is asked to do weekly video therapy with a client who has moved to Dubai. Separately, her clinic wants to use an AI tool that listens to sessions and writes notes automatically.",
  "ask": "Which considerations are most important?",
  "choices": [
    { "label": "Neither raises any issue; technology is neutral", "verdict": "harm", "outcome": "A crisis in Dubai cannot be managed, and session audio is stored on a foreign server without consent.", "why": "Cross-border practice and AI recording raise legal, safety and privacy issues." },
    { "label": "For teletherapy: check whether practice across borders is permitted, competence for remote work, a local crisis plan and emergency contacts, and a private, secure platform. For the AI tool: explicit informed consent, data protection under the DPDP Act, where data are stored, accuracy checks, and clinician responsibility for every note", "verdict": "best", "outcome": "She continues with a written telepractice agreement and a local crisis contact; the clinic adopts the AI tool only with opt-in consent and secure data handling.", "why": "New technology does not change the core duties of consent, competence, confidentiality and safety." },
    { "label": "Refuse all technology", "verdict": "ok", "outcome": "The client loses continuity of care.", "why": "Caution is reasonable, but well-managed telepractice can be safe and helpful." }
  ]
}
:::

:::clinician
Published decision-making models (Koocher and Keith-Spiegel's nine steps; the Canadian Code of Ethics for Psychologists' ten-step process; Kitchener's model distinguishing intuitive and critical-evaluative levels) share the structure above. Documentation of reasoning and consultation is the strongest protection in later review. Covert medication is sometimes considered for adults who lack capacity and refuse life-saving treatment, but under the MHCA this must fit the person's legal status, advance directive and nominated representative's role, be in the treatment plan, and be reviewed; covert administration to an adult with capacity is never justified. Telepsychiatry operational guidelines (2020, from NIMHANS and the Indian Psychiatric Society with the Telemedicine Practice Guidelines of the Board of Governors of the then Medical Council of India) govern doctors; psychologists should follow RCI and professional guidance and the law of the place where the client is located. On AI scribes, ensure that the vendor does not use session data for model training without explicit consent, and keep an audit trail of edits.
:::

:::recall
1. List the eight steps of ethical decision-making. || Identify, gather facts, check rules, name principles, list options, weigh consequences, consult, decide-act-document-review.
2. Why should valuable gifts usually be declined? || They create obligation and blur boundaries, risking exploitation.
3. When might covert medication be considered, and when never? || Only rarely, for an adult lacking capacity within legal safeguards; never for an adult with capacity.
4. Name four issues in telepractice. || Legal permission across jurisdictions, competence, a local crisis plan, secure private platforms (plus consent and records).
:::

:::mcq
Q: The first step in ethical decision-making is to:
- Act quickly
- *Identify the problem and whose interests are involved
- Consult a lawyer only
- Document the outcome
> Clarity first.

Q: Using an AI tool to transcribe therapy sessions requires above all:
- Nothing, if the tool is popular
- *Informed consent and secure, lawful data handling, with the clinician responsible for the notes
- Only the clinic owner's approval
- Deleting the notes after a day
> Consent and data protection.
:::

## 3.6 Mental health programmes, policy and the system [core][advanced]
### How big is the need?
The **National Mental Health Survey of India** (2015 to 2016, led by NIMHANS) found that about **1 in 10** adults had a current mental disorder, and the **treatment gap** (people who needed care but did not get it) was very large, between about 70 and over 90 per cent depending on the disorder.


:::widget flow
{
 "title": "India's mental health programmes over time",
 "layout": "chain",
 "nodes": [
  {
   "id": "a",
   "label": "1982 NMHP",
   "detail": "Mental health into general health care."
  },
  {
   "id": "b",
   "label": "1996 DMHP",
   "detail": "District teams, based on the Bellary model."
  },
  {
   "id": "c",
   "label": "2014 Mental Health Policy",
   "detail": "Rights, access, community care."
  },
  {
   "id": "d",
   "label": "2017 MHCA",
   "detail": "Rights-based law, in force from 2018."
  },
  {
   "id": "e",
   "label": "2018 onwards Ayushman Bharat",
   "detail": "Mental health in primary care centres and insurance packages."
  },
  {
   "id": "f",
   "label": "2020 Manodarpan",
   "detail": "Support for students, teachers and families."
  },
  {
   "id": "g",
   "label": "2022 Tele-MANAS and the National Suicide Prevention Strategy",
   "detail": "A national tele-mental health service; a target of 10 per cent fewer suicide deaths by 2030."
  }
 ],
 "caption": "Press Play to walk the timeline. Exam questions often ask for years and one aim of each."
}
:::

### Programmes and policies in order
| Year | Programme or policy | What it did |
|---|---|---|
| **1982** | **National Mental Health Programme (NMHP)** | Integrated mental health into general health care; trained primary care staff; reduced reliance on large asylums |
| **1996** | **District Mental Health Programme (DMHP)** | Took mental health care to the district level, based on the earlier Bellary model in Karnataka: district teams, community clinics, training, awareness |
| **2014** | **National Mental Health Policy** ("New Pathways, New Hope") | India's first mental health policy: rights, access, community care, reducing treatment gap |
| **2017** | **Mental Healthcare Act** | Rights-based law (Part II) |
| **2018 onwards** | **Ayushman Bharat**: health and wellness centres (now Ayushman Arogya Mandirs) and PM-JAY insurance | Mental health added to primary care service packages; some psychiatric packages in insurance |
| **2020** | **Manodarpan** (Ministry of Education) | Psychosocial support for students, teachers and families |
| **2022 (October)** | **Tele-MANAS** | National tele-mental health service, a 24-hour toll-free line with state cells and referral to in-person care |
| **2022 (November)** | **National Suicide Prevention Strategy** | India's first: aims to reduce suicide deaths by 10 per cent by 2030 through surveillance, crisis services, school programmes, means restriction (such as pesticides) and responsible media reporting |

Other relevant programmes include the **Rashtriya Kishor Swasthya Karyakram** (adolescent health, including mental health), the **Rashtriya Bal Swasthya Karyakram** (child screening, including developmental delays), and the **Nasha Mukt Bharat Abhiyaan** (drug awareness campaign).

:::widget guess
{
  "prompt": "The National Mental Health Survey of India found a very large treatment gap. For common mental disorders such as depression and anxiety, roughly what share of people who needed treatment were not getting it?",
  "min": 0,
  "max": 100,
  "unit": "per cent",
  "answer": [80, 90],
  "reveal": "About 85 per cent were not receiving care for common mental disorders. The gap was somewhat smaller for severe mental illness (around three-quarters) and largest for alcohol use disorders (well over 80 per cent). Programmes like DMHP and Tele-MANAS are attempts to close this gap.",
  "clinician": "NMHS 2015-16: weighted current prevalence of mental morbidity about 10.6 per cent and lifetime about 13.7 per cent in adults; treatment gaps of roughly 70 to 92 per cent across disorders (for example about 85 per cent for common mental disorders, about 73.6 per cent for severe mental disorders, and about 86 per cent for alcohol use disorder). A second national survey (NMHS-2) has been under way; check for published results before citing newer figures."
}
:::

:::widget decide
{
  "scene": "You are a clinical psychologist newly posted to a District Mental Health Programme team in a rural district of Jharkhand. Most patients first go to faith healers, and the district hospital has one psychiatrist visiting twice a month.",
  "ask": "What is the most effective first priority?",
  "choices": [
    { "label": "See as many patients individually as possible in the district hospital", "verdict": "ok", "outcome": "You help dozens, but the waiting list grows and most of the district is untouched.", "why": "Direct care matters but cannot reach the scale of need alone." },
    { "label": "Combine some direct care with training primary care doctors, ASHAs and community health officers to identify and support common conditions, build links with faith healers for referral, and set up regular outreach clinics", "verdict": "best", "outcome": "Within a year, referrals from primary care and healers rise, follow-up improves, and more people are treated close to home.", "why": "Task-sharing and community partnerships are the core logic of DMHP and the strongest evidence-based way to reduce the treatment gap." },
    { "label": "Campaign to close down faith-healing sites", "verdict": "harm", "outcome": "The community turns against the team, and patients stop coming.", "why": "Confrontation alienates communities. Collaboration, with action against clear abuses like chaining, works better." }
  ]
}
:::

:::clinician
Indian evidence on task-sharing is internationally influential: the MANAS trial in Goa showed lay health counsellors improved recovery from common mental disorders in primary care; the PREMIUM trials showed the Healthy Activity Program for depression and Counselling for Alcohol Problems delivered by lay counsellors were effective; and the Dava and Dua project in Gujarat linked faith healing at a dargah with psychiatric care. Means restriction for pesticides, with bans on the most toxic agents, is among the most effective population suicide-prevention measures (Sri Lanka's experience; India banned several highly hazardous pesticides in recent years). Responsible media reporting follows the Press Council of India guidelines (2019) aligned with WHO advice. Tele-MANAS handled several million calls in its first years; its effectiveness and quality of linkage to in-person care are being studied as of Nov 2026. DMHP coverage was extended to most districts under the National Health Mission, but staffing and supply of medicines remain uneven.
:::

:::recall
1. When was the NMHP launched and what was its aim? || 1982; to integrate mental health into general health care and train primary care staff.
2. What model was DMHP based on? || The Bellary model in Karnataka.
3. When was India's first National Mental Health Policy? || 2014.
4. What is Tele-MANAS? || A national 24-hour tele-mental health service launched in October 2022.
5. What is the target of the National Suicide Prevention Strategy 2022? || Reduce suicide deaths by 10 per cent by 2030.
:::

:::mcq
Q: The District Mental Health Programme began in:
- 1982
- *1996
- 2014
- 2022
> DMHP launched in 1996.

Q: India's National Suicide Prevention Strategy was released in:
- 2014
- 2017
- *2022
- 2025
> November 2022.
:::

# Part IV · Exam zone

## 4.1 Long answers and short notes [core]
### Long answer skeletons
**1. Discuss the salient features of the Mental Healthcare Act 2017 (15 marks).**
Background (MHA 1987, UNCRPD) → definitions (mental illness, MHP, capacity) → determination of mental illness (section 3) → capacity (section 4) → advance directive (5 to 13) → nominated representative (14 to 17) → rights (18 to 28) → authorities and Boards → admissions (85 to 90, 94) → prohibited and regulated procedures (95 to 97) → research (99) → police duties (100) → suicide (115) → critique and implementation challenges.

**2. Informed consent and capacity in mental health practice (10 to 15 marks).**
Elements of consent → capacity under MHCA section 4 → presumption, decision- and time-specificity, supported decision-making → capacity in psychosis, depression, dementia, intellectual disability → consent for therapy, testing, research → minors → documentation.

**3. Confidentiality and its limits (10 marks).**
Basis (ethical, MHCA section 23, Puttaswamy) → exceptions → Tarasoff and duty to protect → POCSO → families, couples, minors → records and digital data (DPDP) → practical steps.

**4. Research ethics in psychology (10 marks).**
History (Nuremberg, Tuskegee, Milgram) → Helsinki and Belmont → ICMR 2017 → consent, vulnerable groups, deception and debriefing → ethics committees and CTRI → MHCA section 99 → data protection → integrity.

**5. Legal aspects of psychiatry in India: criminal responsibility and fitness to stand trial (10 marks).**
BNS 22 (M'Naghten basis) → intoxication (BNS 23, 24) → BNSS 367 to 378 → role of the expert (BSA 39) → landmark cases → report writing.

### Short notes (5 marks each)
- The four principles of biomedical ethics
- Capacity under the MHCA
- Advance directive
- Nominated representative
- Supported admission
- Prohibited procedures under the MHCA
- Section 115 and the decriminalisation of suicide attempts
- Tarasoff and the duty to protect
- POCSO reporting duties
- RPwD Act 2016
- RCI Act and the training route
- APA Ethics Code structure
- Boundary crossings and violations
- Belmont Report
- National Mental Health Programme and DMHP
- Tele-MANAS and the National Suicide Prevention Strategy

:::student
In law answers, write the **section number with the idea** ("section 89, supported admission, up to 30 days"). Examiners award marks for precision, but an idea without the number still scores; a number without the idea does not.
:::

:::clinician
Postgraduate and NET answers gain from critique: the MHCA's resource demands (Boards, establishment registration) versus implementation; debates over whether supported admission complies with the CRPD; the tension between POCSO mandatory reporting and adolescent health care; RCI and NCAHP jurisdiction for psychologists; and the gap between the RPwD Act's limited guardianship and the National Trust Act. Cite one Indian judgment and one programme evaluation where relevant.
:::

:::recall
1. What sequence should a long answer on the MHCA follow? || Background, definitions, determination and capacity, advance directive, NR, rights, authorities, admissions, prohibited procedures, research, police, suicide, critique.
2. What critical points strengthen a postgraduate answer? || Implementation gaps, CRPD compliance of supported admission, POCSO and adolescent care, RCI and NCAHP jurisdiction, guardianship law tension.
:::

## 4.2 Viva rapid-fire [core]
:::viva
Four principles of biomedical ethics? :: Autonomy, beneficence, non-maleficence, justice.
Four elements of valid consent? :: Information, capacity, voluntariness, decision.
MHCA section on capacity? :: Section 4.
MHCA section on determining mental illness? :: Section 3.
Advance directive sections? :: Sections 5 to 13.
Nominated representative sections? :: Sections 14 to 17.
Right to access mental healthcare? :: Section 18.
Insurance parity? :: Section 21(4).
Confidentiality? :: Section 23.
Access to records? :: Section 25.
Independent admission? :: Section 86.
Admission of minors? :: Section 87.
Supported admission up to 30 days? :: Section 89.
Supported admission beyond 30 days? :: Section 90.
Emergency treatment? :: Section 94, up to 72 hours, no ECT.
Prohibited procedures? :: Section 95: unmodified ECT, ECT for minors without safeguards, sterilisation as treatment, chaining.
Psychosurgery? :: Section 96: informed consent plus Board approval.
Restraint and seclusion? :: Section 97: seclusion prohibited; restraint only as a last resort, NR told within 24 hours.
Research? :: Section 99.
Police duties? :: Section 100.
Attempted suicide? :: Section 115: presumed severe stress, not punished.
POCSO reporting and penalty? :: Sections 19 and 21.
Benchmark disability? :: 40 per cent or more.
Reservations under RPwD? :: 4 per cent in government posts, 5 per cent in higher education.
Insanity defence now? :: BNS section 22.
Unsound accused procedure now? :: BNSS sections 367 to 378.
Expert opinion now? :: BSA section 39.
NDPS immunity for treatment? :: Section 64A.
RCI Act section restricting practice? :: Section 13.
RCI renaming of 3 May 2026? :: MA Clinical Psychology to Master in Clinical Psychology (M.Clin.Psy).
Belmont principles? :: Respect for persons, beneficence, justice.
Tarasoff? :: 1976, duty to protect an identifiable victim.
NMHP and DMHP years? :: 1982 and 1996.
Tele-MANAS launch? :: October 2022.
:::

## 4.3 Module test [core]
Score 80% or more to complete the module.

:::mcq
Q: A patient with capacity chooses a less effective treatment because of side effects. Respecting this reflects:
- Beneficence
- *Autonomy
- Justice
- Non-maleficence
> Self-determination.

Q: Which is NOT an element of capacity under MHCA section 4?
- Understanding information
- Appreciating consequences
- Communicating a decision
- *Agreeing with the doctor's advice
> Disagreement is not incapacity.

Q: Capacity should be assessed:
- Once for life
- *For each decision, at the time it must be made
- Only by a court
- By IQ testing
> Decision- and time-specific.

Q: Information that a patient plans to kill an identified person can be shared under:
- MHCA section 21
- *MHCA section 23 exceptions, to protect another person from harm
- RPwD section 32
- BNS section 22
> Protective disclosure.

Q: A dual relationship is best avoided because it:
- Is always illegal
- *Creates conflicts of interest and risks exploitation
- Reduces fees
- Improves therapy
> Conflicting roles.

Q: Under section 3, which can be a basis for diagnosing mental illness?
- Refusing an arranged marriage
- Changing religion
- Political protest
- *Accepted medical standards such as ICD criteria
> Only medical standards.

Q: An adult with capacity writes an advance directive. It takes effect:
- Immediately
- *When they later lack capacity for the relevant decision
- Only in emergencies
- When the family agrees
> It applies in incapacity, not section 94 emergencies.

Q: The nominated representative must:
- Override the patient's wishes
- *Consider the patient's current and past wishes and support decisions
- Be a lawyer
- Always be the spouse
> Supported decision-making.

Q: A woman in mania who lacks capacity and is at risk is admitted after two professionals agree. This is:
- Independent admission
- *Supported admission under section 89
- Emergency treatment under section 94
- A magistrate's order
> Up to 30 days.

Q: Emergency treatment under the MHCA lasts at most:
- 24 hours
- *72 hours (or until assessed at an establishment)
- 30 days
- 90 days
> Section 94.

Q: ECT for a minor under the MHCA requires:
- Nothing special
- *The psychiatrist's judgement of necessity, the guardian's informed consent and the Board's prior permission
- Only the child's consent
- A court order
> Section 95(2).

Q: Physical restraint under section 97 must be:
- Used to manage staff shortages
- *A last resort to prevent imminent harm, recorded, supervised, and reported to the NR within 24 hours
- Used as punishment for refusing medicine
- Unrecorded
> Strict safeguards.

Q: Under the BNS, attempting suicide is:
- Always punishable as under IPC 309
- *Not a general offence; only attempting suicide to compel or restrain a public servant is punishable (section 226)
- Punishable with a fine
- Reportable under POCSO
> The general offence was not carried forward.

Q: A counsellor fails to report a known sexual assault on a 12-year-old. Under POCSO this is:
- Acceptable if the family objects
- *An offence under section 21
- Only a professional matter
- Required by confidentiality
> Failure to report is punishable.

Q: Under the JJ Act, a preliminary assessment of a 17-year-old accused of a heinous offence assesses:
- Guilt
- *Mental and physical capacity to commit the offence and understanding of its consequences
- IQ only
- Family income
> Section 15.

Q: Benchmark disability under the RPwD Act means:
- Any disability
- *A certified disability of at least 40 per cent
- Only physical disability
- Disability above 80 per cent
> Threshold for reservations and benefits.

Q: Mental illness disability certification in India commonly uses:
- ISAA
- *IDEAS
- MISIC
- VSMS
> Indian Disability Evaluation and Assessment Scale.

Q: The legal test for unsoundness of mind in BNS section 22 focuses on:
- The diagnosis alone
- *Incapacity, at the time of the act, to know its nature or that it was wrong or contrary to law
- The person's IQ
- The severity of symptoms at trial
> Cognitive test at the time of the act.

Q: A person found unfit to stand trial under the BNSS:
- Is acquitted
- *Has the trial postponed while they receive treatment, and it resumes when fit
- Is sent to prison
- Is fined
> Fitness procedures.

Q: Under the NDPS Act, a user caught with a small quantity who volunteers for treatment may get immunity under:
- Section 27
- *Section 64A
- Section 71
- Section 20
> Treatment instead of prosecution.

Q: Jacob Mathew v. State of Punjab (2005) is about:
- Living wills
- *The threshold for criminal medical negligence
- Privacy
- Homosexuality
> Gross negligence for criminal liability.

Q: The Belmont principle that requires fair selection of research participants is:
- Respect for persons
- Beneficence
- *Justice
- Fidelity
> Fair distribution of burdens and benefits.

Q: Deception in psychological research is acceptable only if:
- The researcher wants it
- *It is essential, no harmless alternative exists, it would not affect willingness to take part, and participants are debriefed
- Participants are students
- It saves money
> Strict conditions.

Q: Which body's guidelines govern research with human participants in India?
- RCI
- *ICMR (National Ethical Guidelines 2017)
- NCERT
- IRDAI
> ICMR guidelines.

Q: Under the RCI Act, a person practising as a clinical psychologist without registration:
- Is acting legally
- *Commits an offence under section 13
- Needs only a state licence
- Is covered by the MHCA
> Registration is mandatory.

Q: The APA Ethics Code has how many general principles and how many standards?
- 4 and 8
- *5 and 10
- 6 and 12
- 3 and 9
> Five principles, ten standards.

Q: The District Mental Health Programme was modelled on a pilot in:
- Goa
- *Bellary, Karnataka
- Chandigarh
- Ranchi
> The Bellary model.

Q: Tele-MANAS is:
- A private app
- *A national tele-mental health service launched in 2022
- A law
- A research guideline
> Government tele-mental health.

Q: The best response to a valuable gift from a grateful client is usually to:
- Accept secretly
- *Decline warmly, honour its meaning, document and discuss in supervision
- Sell it
- Report the client to the police
> Boundaries with respect.
:::
`;
