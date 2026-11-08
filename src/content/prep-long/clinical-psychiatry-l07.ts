import type { LongQA } from "@/lib/prep/long-types";
import { anchored, chain, compare, timeline, tree } from "./visual";

export const CLINICAL_PSYCHIATRY_L07: LongQA[] = anchored([
  {
    id: "cpsy-l07-001",
    subject: "clinical-psychiatry",
    topic: "narcolepsy",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Write short notes on narcolepsy.",
    plan: ["Definition and types", "Clinical features", "Investigations and mechanism", "Treatment and psychiatric relevance"],
    answer: `## Definition and types
Narcolepsy is a chronic disorder of excessive daytime sleepiness with intrusion of REM sleep features into wakefulness. Type 1 has cataplexy and or low cerebrospinal fluid hypocretin (orexin); type 2 has neither. Onset is usually in adolescence or early adulthood.

## Clinical features
- Excessive daytime sleepiness with sudden, irresistible sleep attacks, often refreshing.
- Cataplexy: sudden brief loss of muscle tone triggered by strong emotion (laughter, surprise), with preserved consciousness; ranging from jaw drop or knee buckling to falls.
- Sleep paralysis on waking or falling asleep.
- Hypnagogic and hypnopompic hallucinations, sometimes vivid and frightening.
- Disturbed night sleep.
The first four make the classical tetrad.

## Investigations and mechanism
- Overnight polysomnography followed by the Multiple Sleep Latency Test: mean sleep latency of 8 minutes or less with two or more sleep onset REM periods.
- CSF hypocretin low (110 pg per ml or less) in type 1.
- Strong association with HLA-DQB1*06:02.
- Type 1 is caused by loss of hypocretin producing neurons in the lateral hypothalamus, probably autoimmune.

## Treatment
- Scheduled naps, regular sleep, driving safety advice.
- Wake promoting drugs: modafinil or armodafinil, methylphenidate, pitolisant, solriamfetol.
- Sodium oxybate for cataplexy and sleepiness.
- Antidepressants (venlafaxine, clomipramine, SSRIs) suppress REM and reduce cataplexy.

## Psychiatric relevance
Narcolepsy can be misdiagnosed as psychosis (vivid hallucinations), depression (tiredness, poor concentration), conversion disorder or epilepsy (cataplexy), or laziness at school. Depression and anxiety are common comorbidities.

## Conclusion
Narcolepsy is under recognised; the history of cataplexy and a sleep study make the diagnosis, and treatment is effective.`,
    keyPoints: ["Type 1 and type 2", "Tetrad including cataplexy", "MSLT criteria", "Hypocretin and HLA association", "Modafinil, oxybate and antidepressants", "Psychiatric mimics"],
    module: "more-disorders",
    ref: "DSM-5-TR narcolepsy; ICSD-3; Scammell 2015 NEJM",
  },
  {
    id: "cpsy-l07-002",
    subject: "clinical-psychiatry",
    topic: "osa-psychiatry",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry"],
    question: "Write short notes on obstructive sleep apnoea and its relevance to psychiatry.",
    plan: ["Definition and diagnosis", "Psychiatric links", "Screening tools", "Management and prescribing cautions"],
    answer: `## Definition and diagnosis
Obstructive sleep apnoea (OSA) is repeated collapse of the upper airway during sleep, causing pauses in breathing (apnoeas) or shallow breathing (hypopnoeas), with oxygen drops and arousals. Polysomnography or home sleep testing gives the apnoea hypopnoea index (AHI): 5 to 15 events an hour is mild, 15 to 30 moderate and above 30 severe. Risk factors are obesity, large neck, male sex, older age, alcohol, sedatives and craniofacial features.

## Psychiatric links
- Daytime sleepiness, fatigue and poor concentration mimic depression; depression is also more common in OSA.
- Cognitive impairment (attention, executive function) and possibly faster cognitive decline.
- Irritability, anxiety, morning headaches, reduced libido.
- Antipsychotic related weight gain increases OSA risk in people with schizophrenia and bipolar disorder.
- Sedatives, benzodiazepines, opioids and alcohol worsen apnoeas.

## Screening tools
STOP-BANG questionnaire (snoring, tiredness, observed apnoeas, blood pressure, BMI over 35, age over 50, neck size, male sex) and the Epworth Sleepiness Scale (above 10 suggests excessive sleepiness).

## Management
- CPAP (continuous positive airway pressure) is the main treatment; it improves sleepiness and may improve mood.
- Weight loss, positional therapy, avoiding alcohol and sedatives, oral appliances, and surgery in selected cases.
- In psychiatric patients, choose medicines with less weight gain and sedation, and avoid benzodiazepines.

## Conclusion
OSA is common, treatable and easily mistaken for depression; ask about snoring and sleepiness in every patient with low energy, especially if overweight or on antipsychotics.`,
    keyPoints: ["Definition and AHI severity", "Risk factors", "Mimics depression and impairs cognition", "Antipsychotic weight gain and sedatives worsen it", "STOP-BANG and Epworth", "CPAP and prescribing cautions"],
    module: "more-disorders",
    ref: "ICSD-3 OSA; Chung STOP-BANG 2008; Kaplan sleep chapter",
  },
  {
    id: "cpsy-l07-003",
    subject: "clinical-psychiatry",
    topic: "gender-incongruence",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Discuss gender dysphoria and gender incongruence: classification, assessment and care, with reference to Indian law.",
    plan: ["Terms and classification in DSM-5-TR and ICD-11", "Clinical presentation across ages", "Assessment and the psychiatrist's role", "Care options and current debates", "Indian law and ethics", "Conclusion"],
    answer: `## Terms
- Sex assigned at birth: based on physical characteristics.
- Gender identity: one's inner sense of being male, female, both, neither or another gender.
- Transgender: gender identity differs from sex assigned at birth.
- Gender dysphoria: distress that may accompany this incongruence.
Sexual orientation (who one is attracted to) is separate from gender identity.

## Classification
- DSM-5-TR gender dysphoria: in adolescents and adults, a marked incongruence between experienced gender and assigned gender for at least six months, with at least two of six features (such as a strong desire to be rid of one's sex characteristics, or to be treated as another gender), plus clinically significant distress or impairment. Separate criteria for children.
- ICD-11 gender incongruence of adolescence or adulthood and of childhood: moved out of the mental disorders chapter into the chapter on conditions related to sexual health. This reflects the view that being transgender is not a mental illness, while keeping access to health care.

## Presentation
Children may insist they are another gender, prefer clothes and play of that gender, and dislike their anatomy; many do not continue to feel this way after puberty, while those whose dysphoria persists or increases into adolescence usually continue. Adolescents often present with distress at puberty, and frequently with anxiety, depression, self harm, autism traits and bullying. Adults may present after years of hiding their identity.

## Assessment and the psychiatrist's role
- A respectful, affirming approach using the person's chosen name and pronouns.
- Explore gender identity history, distress, goals, family and social support, safety and discrimination.
- Assess and treat co-occurring conditions (depression, anxiety, self harm, substance use, eating disorders); these do not by themselves rule out gender affirming care.
- Assess capacity and readiness for medical treatments and support informed decisions.
- Support families.
- Conversion or "reparative" therapies that try to change identity or orientation are unethical and harmful.

## Care options
- Social transition (name, clothing, pronouns).
- Psychological support, peer groups.
- Hormone therapy (oestrogen with anti androgens, or testosterone) under endocrinology.
- Gender affirming surgeries for adults.
- Puberty suppression for adolescents remains debated: an independent review in England in 2024 found weak evidence and led to restrictions, while other professional bodies continue to support individualised use. Students should know that this is an area of active debate.

## Indian law and ethics
- In NALSA v Union of India in 2014, the Supreme Court recognised transgender persons' right to self identify their gender, including as a third gender, and directed welfare measures.
- The Transgender Persons (Protection of Rights) Act 2019 prohibits discrimination in education, employment, health care and housing, provides for certificates of identity through the district magistrate, and requires the government to provide health care including gender affirming treatment.
- In Navtej Singh Johar v Union of India in 2018, consensual same sex relations were decriminalised; the Indian Psychiatric Society stated that homosexuality is not a mental illness.
- The National Medical Commission has declared conversion therapy professional misconduct.
- Hijra and kinnar communities are part of India's long history of gender diversity, but face stigma, poverty and violence.

## Conclusion
Gender incongruence is now understood as a health condition rather than a mental disorder. The psychiatrist's role is to provide affirming assessment, treat co-occurring problems, support informed decisions and families, and respect rights under Indian law.`,
    keyPoints: ["Clear terms separating identity and orientation", "DSM-5-TR six months and two of six", "ICD-11 move to sexual health chapter", "Presentation across ages", "Affirming assessment and treating comorbidity", "Conversion therapy harmful", "Puberty suppression debate", "NALSA 2014, Transgender Persons Act 2019, NMC on conversion therapy"],
    visuals: [compare("Gender dysphoria in the two systems", ["DSM-5-TR", ["Called gender dysphoria", "In the mental disorders manual", "Requires distress or impairment", "Six months, two of six features"], "Focus on distress"], ["ICD-11", ["Called gender incongruence", "In the sexual health chapter", "Not a mental disorder", "Keeps access to care"], "Focus on health care need"])],
    module: "more-disorders",
    ref: "DSM-5-TR gender dysphoria; ICD-11 HA60; NALSA 2014; Transgender Persons Act 2019; Navtej Johar 2018; Cass Review 2024; NMC 2022 advisory on conversion therapy; WPATH SOC-8",
  },
  {
    id: "cpsy-l07-004",
    subject: "clinical-psychiatry",
    topic: "premature-ejaculation",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry"],
    question: "Write short notes on the management of premature ejaculation.",
    plan: ["Definition and types", "Assessment", "Behavioural and medical treatment", "Couple and cultural points"],
    answer: `## Definition and types
DSM-5-TR premature (early) ejaculation is a persistent or recurrent pattern of ejaculation within about one minute of vaginal penetration and before the person wishes it, on almost all occasions for at least six months, causing distress. Lifelong premature ejaculation is present from first sexual experiences; acquired premature ejaculation develops later, often with erectile dysfunction, anxiety, prostatitis or thyroid disease. It is one of the most common male sexual complaints in Indian sexual medicine clinics, often alongside Dhat related worries.

## Assessment
History of onset, duration, partners, situations, anxiety, relationship issues, erectile function, substance use and medicines; physical examination; thyroid tests and urine examination if indicated. Ask what the couple expects, since many men with normal latency seek treatment because of myths.

## Treatment
- Education and reassurance about normal sexual function and correction of myths.
- Behavioural methods: the stop start technique (Semans) and the squeeze technique (Masters and Johnson), practised alone and then with the partner, and sensate focus to reduce performance anxiety.
- Medicines:
- Daily SSRIs (paroxetine has the strongest effect; sertraline, fluoxetine) or clomipramine, which delay ejaculation.
- On demand dapoxetine, a short acting SSRI approved in India, taken one to three hours before intercourse.
- Topical anaesthetic creams or sprays (lidocaine with prilocaine).
- Treat erectile dysfunction first if present, using PDE5 inhibitors.
- Couple therapy for relationship conflict and anxiety.

## Conclusion
Premature ejaculation responds well to education, behavioural techniques and SSRIs; addressing anxiety, myths and the relationship improves results.`,
    keyPoints: ["DSM-5-TR one minute and six months", "Lifelong versus acquired", "Assessment including erectile function and myths", "Stop start and squeeze techniques", "Daily SSRIs and on demand dapoxetine", "Treat ED first; couple therapy"],
    module: "more-disorders",
    ref: "DSM-5-TR premature ejaculation; ISSM 2014 definition; Waldinger SSRI meta-analysis",
  },
  {
    id: "cpsy-l07-005",
    subject: "clinical-psychiatry",
    topic: "mhca-capacity",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "How would you assess a patient's capacity to make a treatment decision under the Mental Healthcare Act 2017?",
    plan: ["Principles of capacity", "MHCA section 4 criteria", "Practical steps of assessment with examples", "When capacity is lacking: supports and legal routes", "Documentation and pitfalls", "Conclusion"],
    answer: `## Principles
Capacity is the ability to make a particular decision at a particular time. It is decision specific, time specific, and presumed unless shown otherwise. Having a mental illness, being admitted, or making a decision others disagree with does not by itself mean a person lacks capacity.

## MHCA 2017, section 4
Every person, including a person with mental illness, is deemed to have capacity to make mental healthcare and treatment decisions if able to:
- Understand the information relevant to the decision.
- Appreciate any reasonably foreseeable consequence of a decision or of a lack of decision.
- Communicate the decision by speech, expression, gesture or any other means.
Information must be given in a way the person can understand, using simple language, sign language or visual aids. A decision that others consider inappropriate or wrong does not by itself mean the person lacks capacity.

This is close to the Appelbaum and Grisso model of four abilities (understanding, appreciation, reasoning and expressing a choice); the MHCA does not list reasoning separately, though it is often considered within appreciation.

## Practical steps
- Identify the specific decision (for example, "to take olanzapine" or "to be admitted").
- Optimise conditions: a quiet place, the patient's language, an interpreter if needed, a time when the patient is least affected (not when intoxicated or sedated), and support from a trusted person.
- Give the relevant information: the nature of the illness, the proposed treatment, benefits, risks, alternatives (including no treatment), and likely consequences.
- Test understanding: ask the patient to explain in their own words ("What did I say the medicine is for?").
- Test appreciation: does the patient accept that the information applies to them? A patient who understands that olanzapine treats psychosis but believes "I am not ill; the doctors are part of the plot" may lack appreciation because of a delusion.
- Explore reasoning: can the patient weigh the options and explain why they choose one?
- Check communication of a consistent choice.
- Reassess if capacity may fluctuate.

## When capacity is lacking
- Supported decision making: the nominated representative (section 14) helps and gives consent on the person's behalf, taking into account the person's past and present wishes.
- An advance directive (section 5), if valid, must be followed, except in specified situations reviewed by the Mental Health Review Board.
- Supported admission (section 89, up to 30 days, extendable under section 90 with Board approval) when criteria are met.
- Emergency treatment (section 94) for up to 72 hours to prevent death, irreversible harm or serious harm; it excludes ECT.
- Capacity should be reviewed regularly and treatment adapted as it returns.

## Documentation
Record the decision in question, the information given, the patient's responses in their own words, the conclusion on each criterion, who was present, and the plan to review.

## Pitfalls
- Equating diagnosis or disagreement with incapacity.
- Testing only general orientation rather than the specific decision.
- Failing to support the person's understanding.
- Not revisiting capacity as the patient improves.

## Conclusion
Capacity assessment under the MHCA is a structured, decision specific process based on understanding, appreciation and communication, with supports and legal safeguards when capacity is lacking.`,
    keyPoints: ["Decision specific, time specific and presumed", "Three criteria of section 4", "Disagreement does not mean incapacity", "Appelbaum and Grisso comparison", "Practical step by step with examples of appreciation failure", "Nominated representative and advance directive", "Sections 89, 90 and 94 when capacity is lacking", "Documentation and review"],
    visuals: [chain("Assessing capacity for one decision", [["Name the decision", "For example, taking olanzapine"], ["Support communication", "Language, timing, a trusted person"], ["Understand?", "Explains in own words"], ["Appreciate?", "Accepts it applies to self"], ["Communicate?", "States a consistent choice"], ["Record and review", "Capacity can return"]])],
    module: "ethics-law",
    ref: "MHCA 2017 s4, s5, s14, s89, s90, s94; Appelbaum and Grisso 1988 NEJM; Ethics-law module capacity section",
  },
  {
    id: "cpsy-l07-006",
    subject: "clinical-psychiatry",
    topic: "fitness",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "Discuss fitness to stand trial. How does it differ from criminal responsibility? Describe the procedure under Indian law.",
    plan: ["Concept and purpose", "Abilities assessed (Dusky and Pritchard)", "Indian procedure under the BNSS", "Psychiatric assessment and common causes of unfitness", "Contrast with criminal responsibility", "Conclusion"],
    answer: `## Concept
Fitness to stand trial (competence to stand trial) is the accused's present ability to take part meaningfully in the trial. It protects fairness: a person who cannot understand the charges or instruct a lawyer cannot defend themselves.

## Abilities assessed
Classic legal tests come from R v Pritchard, an English case from 1836, and Dusky v United States, a US case from 1960, which asked whether the accused has sufficient present ability to consult with a lawyer with a reasonable degree of rational understanding, and a rational and factual understanding of the proceedings. Practically, the accused should be able to:
- Understand the charge and its possible consequences.
- Understand the roles of judge, prosecutor, defence lawyer and witnesses.
- Instruct a lawyer and follow the evidence.
- Decide on a plea.
- Behave appropriately in court and give evidence if they choose.

## Indian procedure
The Bharatiya Nagarik Suraksha Sanhita 2023 (BNSS), sections 367 to 378, replaced the old Code of Criminal Procedure sections 328 to 339:
- When a magistrate or court has reason to believe that the accused is of unsound mind or has an intellectual disability and is therefore unable to make a defence, it must inquire into the matter.
- The accused is examined by a civil surgeon or medical officer, and referred to a psychiatrist or clinical psychologist for assessment.
- If found unable to make a defence, the trial is postponed.
- The accused may be released on bail with arrangements for treatment and safety, or kept in a suitable place for care, including a mental health establishment under the MHCA 2017.
- The trial resumes when the person becomes fit, on medical certification.
- The BNSS allows discharge in some situations where a fair trial is not possible.

## Psychiatric assessment
- Full history, mental status examination and review of records.
- Specific questioning on each legal ability; structured tools such as the MacArthur Competence Assessment Tool for criminal adjudication exist but are rarely used in India.
- Common causes of unfitness: acute psychosis with severe thought disorder or delusions involving the court, severe mania, severe depression with stupor, dementia, intellectual disability, and severe communication disorders.
- Consider malingering, which is common in this setting, and look for inconsistencies.
- The report describes the mental state and the abilities, with treatment recommendations; the legal decision belongs to the court.

## Contrast with criminal responsibility
| Feature | Fitness to stand trial | Criminal responsibility |
| Time | The present, during proceedings | At the time of the act |
| Law | BNSS sections 367 to 378 | BNS section 22 (formerly IPC section 84) |
| Question | Can the accused understand and take part in the trial? | Did unsoundness of mind make the accused unable to know the nature of the act or that it was wrong or illegal? |
| Outcome | Trial postponed, treatment, resumed when fit | Acquittal on that ground, with arrangements for care |
| Can change? | Yes, with treatment | Fixed to the time of the act |

## Conclusion
Fitness to stand trial concerns the accused's present capacity to take part in proceedings and is separate from responsibility for the act. In India the BNSS sets out a medical inquiry and postponement until fitness is restored, with treatment under the MHCA.`,
    keyPoints: ["Definition and purpose", "Pritchard and Dusky tests", "Abilities listed", "BNSS sections 367 to 378 replacing CrPC 328 to 339", "Examination, postponement, bail or care, resumption", "Common causes of unfitness and malingering", "Contrast table with criminal responsibility", "Court makes the legal decision"],
    visuals: [timeline("Order the steps when an accused may be unfit", [["Court notices accused may be unable to defend", ""], ["Medical examination and psychiatric referral", ""], ["Found unable to make a defence", ""], ["Trial postponed; bail with treatment or care", ""], ["Fit again: trial resumes", ""]])],
    module: "ethics-law",
    ref: "BNSS 2023 ss367-378; Dusky v US 1960; R v Pritchard 1836; Ethics-law module forensic section",
  },
  {
    id: "cpsy-l07-007",
    subject: "clinical-psychiatry",
    topic: "insanity",
    marks: 20,
    difficulty: 4,
    exams: ["md-psychiatry"],
    question: "Discuss the insanity defence. Critically evaluate the M'Naghten rules and the Indian law on criminal responsibility, with reference to case law and the role of the psychiatrist.",
    plan: ["Concept of criminal responsibility: actus reus and mens rea", "The M'Naghten case and rules", "Other tests: irresistible impulse, Durham, ALI, US reforms", "Indian law: BNS section 22, intoxication, burden of proof, case law", "Psychiatric assessment and report", "Critique, disposal after acquittal and conclusion"],
    answer: `## Criminal responsibility
Criminal liability usually needs both a guilty act (actus reus) and a guilty mind (mens rea). The insanity defence recognises that some people, because of mental disorder, lack the mental element that makes punishment fair. It is a legal concept, not a medical diagnosis.

## The M'Naghten rules
In 1843 Daniel M'Naghten, who had persecutory delusions about the Tory party, shot and killed Edward Drummond, the Prime Minister's secretary, believing him to be the Prime Minister. He was acquitted on grounds of insanity. Public outcry led the House of Lords to frame the M'Naghten rules:
- Every person is presumed sane until the contrary is proved.
- To establish insanity, it must be clearly proved that, at the time of the act, the accused was labouring under such a defect of reason, from disease of the mind, as not to know the nature and quality of the act, or, if he did know it, that he did not know he was doing what was wrong.
- A person acting under a partial delusion is judged as if the delusion were true (if he believed he was being attacked and killed in self defence, he would be excused; if he killed in revenge for an imagined injury, he would not).

## Other tests
- Irresistible impulse test: the accused knew the act was wrong but could not control the impulse because of mental disease; criticised because it is hard to separate an irresistible impulse from an impulse not resisted.
- Durham rule, USA 1954: the accused is not responsible if the act was the product of mental disease or defect; abandoned because it gave experts too much power.
- American Law Institute test in 1962: lacking substantial capacity either to appreciate the criminality (wrongfulness) of the conduct or to conform conduct to the law; it adds a volitional limb.
- After John Hinckley's acquittal for shooting President Reagan in 1981, the US federal Insanity Defense Reform Act 1984 removed the volitional limb and shifted the burden to the defence.
- England has a separate partial defence of diminished responsibility for murder, which reduces it to manslaughter; Indian law has no such defence.

## Indian law
BNS section 22 (formerly IPC section 84) states that nothing is an offence which is done by a person who, at the time of doing it, by reason of unsoundness of mind, is incapable of knowing the nature of the act, or that he is doing what is either wrong or contrary to law.
- It is a cognitive test based on M'Naghten, with no volitional limb (irresistible impulse is not a defence).
- "Unsoundness of mind" is not defined; courts distinguish legal insanity from medical insanity. Not every mental illness exempts the accused.
- The relevant time is the moment of the act.
- Intoxication: BNS section 23 (formerly IPC 85) excuses a person made incapable of knowing the nature of the act by intoxication administered without their knowledge or against their will; BNS section 24 (formerly IPC 86) treats a voluntarily intoxicated person as having the same knowledge as if sober.
- Burden of proof: the accused must prove the exception on the balance of probabilities, but the prosecution must still prove mens rea beyond reasonable doubt.

Key cases:
- Dahyabhai Chhaganbhai Thakkar v State of Gujarat in 1964: the Supreme Court held that the accused must establish insanity on a balance of probabilities, but that if the evidence raises a reasonable doubt about mens rea, the accused is entitled to acquittal.
- Surendra Mishra v State of Jharkhand in 2011: every person who is mentally ill is not exempt; the accused must show legal insanity at the time of the offence.
- Courts look at conduct before, during and after the act (motive, planning, concealment, flight, statements) to infer knowledge of wrongfulness, and give weight to medical history close to the time of the act.
Mental illness after conviction is a ground for commuting a death sentence (Shatrughan Chauhan v Union of India in 2014, and Accused X v State of Maharashtra in 2019).

## The psychiatrist's assessment
- Retrospective reconstruction of the mental state at the time of the act: interviews with the accused and witnesses, police papers, statements, medical and prison records, previous psychiatric treatment.
- Current mental status examination, with tests for malingering where indicated.
- Detailed account of the act: preparation, motive, the role of delusions or hallucinations (for example command hallucinations), behaviour afterwards (hiding the weapon, fleeing, seeking help, confessing).
- Substance use around the time of the act.
- Formulation linking the diagnosis to each element of the legal test, with reasons and limitations.
- The expert describes and explains; the court decides the legal question. Under the Bharatiya Sakshya Adhiniyam (BSA section 39), opinions of experts on science are relevant facts.

## Disposal after acquittal
Under the BNSS provisions on persons of unsound mind, a person acquitted on this ground is detained in safe custody or handed over to a relative or friend with arrangements for care and treatment, with review. Under the MHCA 2017, treatment must respect the person's rights.

## Critique
- The cognitive test ignores volitional impairment and many modern understandings of mental illness, such as severe mania or command hallucinations that override control.
- "Wrong" may mean legally or morally wrong; BNS section 22 covers both ("wrong or contrary to law").
- The defence is rarely successful in India, and some mentally ill offenders are imprisoned without treatment.
- Prolonged detention after acquittal can exceed sentences for the same offence.
- Assessments are often made years after the act, with limited records.
- Some argue for a diminished responsibility defence or mental health courts.

## Conclusion
The insanity defence in India follows the M'Naghten tradition through BNS section 22: a narrow, cognitive test applied at the time of the act, with the burden on the accused. Psychiatrists contribute a careful, impartial reconstruction of mental state, while the legal decision rests with the court. Reform debates continue about volitional impairment and the care of acquitted persons.`,
    keyPoints: ["Actus reus and mens rea", "M'Naghten facts and the rules", "Irresistible impulse, Durham, ALI, IDRA 1984", "BNS section 22 wording and cognitive nature", "Intoxication under BNS sections 23 and 24", "Burden of proof and Dahyabhai case", "Surendra Mishra and legal versus medical insanity", "Psychiatric assessment, disposal and critique"],
    pitfalls: ["Calling it a medical diagnosis", "Saying irresistible impulse is accepted in India", "Using only old IPC numbers without BNS", "Giving the legal conclusion as the expert"],
    visuals: [tree("Tests of insanity", [["Insanity tests", "", -1], ["Cognitive", "Knowledge of nature or wrongness", 0], ["M'Naghten 1843", "", 1], ["BNS section 22 (IPC 84)", "India", 1], ["Volitional", "Ability to control", 0], ["Irresistible impulse", "", 4], ["Mixed", "", 0], ["ALI 1962", "Appreciate or conform", 6], ["Product", "", 0], ["Durham 1954", "Abandoned", 8]])],
    module: "ethics-law",
    ref: "BNS 2023 s22-24; Dahyabhai Chhaganbhai Thakkar v State of Gujarat AIR 1964 SC 1563; Surendra Mishra v State of Jharkhand 2011; M'Naghten 1843; BSA s39; Ethics-law module landmark judgments",
  },
  {
    id: "cpsy-l07-008",
    subject: "clinical-psychiatry",
    topic: "testamentary-capacity",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "What is testamentary capacity? Describe the legal criteria and how a psychiatrist should assess it.",
    plan: ["Definition and legal basis", "Banks v Goodfellow criteria", "Assessment", "Related issues"],
    answer: `## Definition and legal basis
Testamentary capacity is the mental ability required to make a valid will. In India, section 59 of the Indian Succession Act 1925 allows every person of sound mind who is not a minor to dispose of property by will. A will made while the person, through intoxication, illness or any other cause, is in such a state of mind that they do not know what they are doing, is not valid.

## Banks v Goodfellow criteria
The English case of Banks v Goodfellow in 1870, followed by Indian courts, requires that the person making the will:
- Understands the nature of making a will and its effects.
- Knows the nature and extent of their property.
- Comprehends and appreciates the claims of those who might expect to benefit (family and dependants).
- Has no disorder of mind that "poisons their affections" or distorts their judgement in making the will, such as a delusion that a child is trying to poison them.
A person with a mental illness or mild dementia may still have testamentary capacity; the question is specific to the will and the time it is made. A will made during a lucid interval can be valid.

## Assessment
- Interview alone, at the time the will is made where possible.
- Ask the person to explain what a will is, describe their property, name family members and other possible beneficiaries, and explain the reasons for their choices, especially any departure from earlier wills.
- Mental status examination with cognitive testing; look for delusions related to beneficiaries.
- Record findings in detail; a solicitor may ask a doctor to witness the will of an elderly or ill person (the "golden rule").

## Related issues
- Undue influence: pressure by others that overcomes free will, separate from capacity; ask who arranged the meeting and who benefits.
- Retrospective assessment after death relies on records and witnesses and is difficult.

## Conclusion
Testamentary capacity requires understanding of the will, property and claims, without a disorder distorting judgement; contemporaneous, documented assessment is the best protection.`,
    keyPoints: ["Indian Succession Act section 59", "Four Banks v Goodfellow criteria", "Illness or dementia does not automatically remove capacity", "Lucid interval", "Assessment questions and documentation", "Undue influence"],
    module: "ethics-law",
    ref: "Indian Succession Act 1925 s59; Banks v Goodfellow 1870; Kenward v Adams golden rule",
  },
  {
    id: "cpsy-l07-009",
    subject: "clinical-psychiatry",
    topic: "malingering",
    marks: 5,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Write short notes on the assessment of malingering.",
    plan: ["Definition", "When to suspect it", "Clinical clues of feigned psychosis and memory loss", "Tests and approach"],
    answer: `## Definition
Malingering is the intentional production of false or grossly exaggerated physical or psychological symptoms, motivated by external incentives such as avoiding military duty or work, obtaining compensation, evading prosecution, or getting drugs. It is not a mental disorder; DSM-5-TR lists it among other conditions that may be a focus of clinical attention.

## When to suspect it
- A medico legal context (court, compensation, disability benefit, prison).
- A marked discrepancy between claimed distress and objective findings.
- Lack of cooperation with assessment or treatment.
- Antisocial personality disorder.
None of these proves malingering.

## Clinical clues
Feigned psychosis (as described by Resnick):
- Overdramatic, eager presentation of symptoms; calling attention to illness.
- Sudden onset linked to legal trouble.
- Rare or atypical symptoms (continuous voices with no pauses, visual hallucinations in black and white, voices giving only vague commands) and absence of subtle signs such as negative symptoms or formal thought disorder.
- Inconsistency between reported symptoms and behaviour on the ward.
Feigned memory loss:
- Worse performance than chance on forced choice tests, loss of personal identity with intact new learning, and approximate answers (which also occur in Ganser syndrome).

## Tests and approach
- Collateral information and observation over time (inpatient observation where possible).
- Symptom validity and performance validity tests: the Test of Memory Malingering, the Structured Interview of Reported Symptoms, the Miller Forensic Assessment of Symptoms Test, the Structured Inventory of Malingered Symptomatology, and validity scales on the MMPI-2.
- Interpret results cautiously, as genuine illness and malingering can coexist.
- Avoid accusing the patient; document inconsistencies objectively and give an opinion with reasons.

## Conclusion
Malingering is diagnosed by careful evidence, not suspicion; multiple sources and validity testing make the judgement fairer.`,
    keyPoints: ["Definition with external incentive", "Not a mental disorder", "Contexts that raise suspicion", "Resnick's clues of feigned psychosis", "Below chance performance in memory testing", "Named validity tests and cautious interpretation"],
    module: "ethics-law",
    ref: "DSM-5-TR malingering; Resnick 1999 feigned psychosis; Rogers SIRS-2; Tombaugh TOMM",
  },
  {
    id: "cpsy-l07-010",
    subject: "clinical-psychiatry",
    topic: "expert-witness",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "What are the duties of a psychiatrist acting as an expert witness? Describe the structure of a psychiatric report for the court.",
    plan: ["Witness of fact versus expert witness", "Legal basis and duties", "Structure of the report", "Giving evidence in court", "Common pitfalls and conclusion"],
    answer: `## Witness of fact and expert witness
- A witness of fact (often the treating psychiatrist) describes what they saw and did: dates of treatment, diagnosis, medicines.
- An expert witness gives an opinion on matters requiring specialised knowledge, such as mental state at the time of an offence, fitness to stand trial, capacity or the effects of an injury.
Treating doctors should be cautious about acting as experts for their own patients, because of the conflict between therapeutic and forensic roles.

## Legal basis and duties
Under the Bharatiya Sakshya Adhiniyam 2023 (BSA section 39, formerly section 45 of the Evidence Act), the opinions of persons specially skilled in science are relevant facts. The court weighs the opinion; it is not binding.
Duties:
- The overriding duty is to the court, not to the side that pays.
- Be independent and impartial; give the same opinion whoever asks.
- Stay within one's expertise.
- Separate facts from opinion, and state the basis and reasoning of each opinion.
- Say when information is insufficient or when the opinion is uncertain, and change the opinion if new evidence demands it.
- Respect confidentiality: explain to the person being assessed that the report is not confidential and will go to the court; obtain consent where required.
- Leave the ultimate legal question (guilt, insanity, sentence) to the court.

## Structure of the report
- Title, the court or case number, and the expert's name, qualifications and experience.
- Instructions: who asked for the report and the questions to be answered.
- Sources of information: interviews (dates, duration, place, interpreter), documents reviewed, people spoken to.
- Background history: personal, family, medical, psychiatric, substance use, forensic.
- Account of the events in question, as given by the person and in documents.
- Mental status examination and any tests (including validity testing).
- Diagnosis, with the classification used.
- Opinion: answering each question in turn, with reasons, discussion of alternative views and limitations.
- Recommendations for treatment, if relevant.
- A declaration that the report is true to the best of the expert's knowledge and that the duty to the court is understood, with signature and date.

## Giving evidence
- Examination in chief, cross examination and re-examination.
- Speak clearly, avoid jargon, address the judge, answer only the question asked, and admit uncertainty.
- Do not become an advocate; remain calm under hostile questioning.

## Pitfalls
- Giving opinions beyond the evidence or one's expertise.
- Using diagnostic labels without explaining their relevance to the legal question.
- Failing to consider malingering or alternative explanations.
- Copying reports from one case to another.

## Conclusion
An expert psychiatrist serves the court by giving an independent, reasoned and clearly written opinion within their expertise, separating facts from opinion and leaving legal decisions to the court.`,
    keyPoints: ["Witness of fact versus expert", "BSA section 39 on expert opinion", "Duty to the court and impartiality", "Facts versus opinion and limits of expertise", "Confidentiality explained to the person", "Report structure in order", "Conduct in court", "Ultimate issue left to the court"],
    visuals: [chain("The court report in order", [["Expert details and instructions", ""], ["Sources of information", ""], ["History and account of events", ""], ["Mental status and tests", ""], ["Diagnosis", ""], ["Opinion with reasons and limits", ""], ["Declaration and signature", ""]])],
    module: "ethics-law",
    ref: "BSA 2023 s39; Royal College of Psychiatrists guidance on expert witnesses; Gunn and Taylor Forensic Psychiatry",
  },
]);
