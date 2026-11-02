import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";

export const meta: ModuleMeta = {
  id: "ethics-law",
  num: 21,
  title: "Ethics and Indian mental health law",
  emoji: "⚖️",
  tagline: "Consent, capacity, confidentiality, boundaries, and the laws every Indian clinician must know",
  when: "Weeks 15 to 16",
  outcomes: [
    "Apply the four ethical principles to clinical dilemmas",
    "Assess capacity and obtain valid informed consent",
    "Handle confidentiality and its exceptions correctly",
    "Explain the key rights and admission types under the Mental Healthcare Act 2017",
    "Know POCSO, RPwD, NDPS, RCI rules and the insanity defence in the new criminal code",
  ],
  writeTask:
    "On paper, from memory: the four ethical principles, the four parts of capacity, the conditions for valid consent, five exceptions to confidentiality, the MHCA admission types with time limits, the prohibited treatments, and one line each on POCSO, RPwD, NDPS, RCI and the insanity defence. Then check and correct in red.",
  activities: [
    act.lesson("rk-2", "Quiz: Mental Healthcare Act 2017", "Rights, admissions, prohibited treatments."),
    act.coach("ethics", "Coach: ethics", "Principles and dilemmas."),
    act.coach("law", "Coach: law", "Indian acts and sections."),
  ],
};

export const text = String.raw`
# Part I · Ethics

## 1.1 Principles [core]
| Principle | Meaning | Example |
|---|---|---|
| **Autonomy** | Respect the person's right to make their own informed decisions | A capable adult may refuse medicine |
| **Beneficence** | Act in the person's best interest | Offering evidence-based treatment |
| **Non-maleficence** | Avoid harm (“first, do no harm”) | Not over-prescribing benzodiazepines |
| **Justice** | Fairness in access and treatment | Same care regardless of caste, gender, income |

Also: **fidelity** (keeping promises, honesty), **respect for dignity**, and **veracity** (truth-telling). Dilemmas arise when principles conflict, for example autonomy versus beneficence in a person refusing treatment while at risk.

## 1.2 Consent and capacity [core]
:::define Valid informed consent
Consent is valid when it is **informed** (nature, purpose, benefits, risks, alternatives, including no treatment), **voluntary** (no coercion), and given by a person **with capacity** for that decision. It can be withdrawn at any time.
:::

:::define Capacity: the four abilities
For a **specific decision at a specific time**, the person can: (1) **understand** the relevant information, (2) **retain** it long enough, (3) **use and weigh** it to reach a decision (appreciate its relevance to them), and (4) **communicate** the decision.
:::
- Capacity is **decision-specific and time-specific**; a diagnosis alone doesn't remove it.
- Presume capacity; support the person to decide (simple language, interpreter, time).
- An unwise decision is not proof of incapacity.
- The Mental Healthcare Act 2017 uses this capacity-based approach.

## 1.3 Confidentiality [core]
- Confidentiality is a strong default: information is shared only with consent or when the law requires.
- **Exceptions**: serious risk of harm to the patient (suicide); serious risk to an identifiable other; **child sexual abuse (POCSO mandatory reporting)**; court orders; notifiable conditions; non-confidential assessments (forensic, disability) explained at the outset.
- Share the minimum necessary, with the right people, and document why.
- Records must be stored securely; never discuss patients in public spaces, social media or WhatsApp groups.

## 1.4 Boundaries and professional conduct [core]
- **Dual relationships** (treating friends, relatives, colleagues, business partners) impair objectivity: avoid them.
- **Sexual relationships with clients are always unethical**, including after therapy ends in most codes.
- Gifts: small tokens may be acceptable in context; large gifts or money are not.
- Self-disclosure only when it serves the client.
- Practise within competence; seek supervision; refer when out of depth.
- Clinical psychologists in India must be **registered with the Rehabilitation Council of India (RCI)** to practise; providing clinical psychology services without registration is an offence under the RCI Act 1992.

:::recall
1. Name the four ethical principles. || Autonomy, beneficence, non-maleficence, justice.
2. What three things make consent valid? || Informed, voluntary, capacity.
3. List the four abilities of capacity. || Understand, retain, use and weigh, communicate.
4. Give five exceptions to confidentiality. || Risk to self, risk to others, child sexual abuse, court order, non-confidential assessments.
5. Who must be registered with RCI? || Clinical psychologists (and other rehabilitation professionals) to practise.
:::

# Part II · The Mental Healthcare Act 2017

## 2.1 Rights [core]
- **Right to access mental health care** from government-funded services (Section 18), affordable, of good quality, close to home.
- Right to **community living**, protection from **cruel, inhuman or degrading treatment**, **equality and non-discrimination**, information, **confidentiality** (Section 23), access to records, **legal aid**, and to make complaints.
- Insurance must cover mental illness on the same basis as physical illness.

## 2.2 Advance directive and nominated representative [core]
- **Advance directive**: an adult with capacity can state how they wish (or don't wish) to be treated, and who should be their nominated representative, if they later lose capacity.
- **Nominated representative**: a person chosen by the patient to support them in decisions when they lack capacity (otherwise a relative or carer by order of priority).

## 2.3 Admissions [core]
| Type | Who | Time and safeguards |
|---|---|---|
| **Independent admission** | Person with capacity who chooses admission | Can leave when they wish (with limited exceptions) |
| **Supported admission** (up to 30 days) | Person **unable to make decisions** who has recently threatened or attempted **self-harm or harm to others**, or is **unable to care for themselves** to the point of serious risk | Requires assessment by psychiatrists and the nominated representative's involvement; reported to the Mental Health Review Board |
| **Supported admission beyond 30 days** | Continuing need | Two psychiatrists' assessments and approval by the **Mental Health Review Board**; reviewed periodically |
| **Emergency treatment** | Any registered medical practitioner, to prevent death, serious harm or violence | **Up to 72 hours** |

## 2.4 Prohibited and regulated treatments [core]
- **ECT without anaesthesia and muscle relaxant is prohibited.**
- **ECT for minors** is not allowed except with consent of the guardian and prior permission of the Board.
- **Sterilisation** as a treatment for mental illness is prohibited.
- **Chaining** in any manner is prohibited; restraint and seclusion only as a last resort, to prevent imminent harm, recorded and reviewed.
- Psychosurgery only with informed consent and Board approval.

## 2.5 Suicide [core]
:::define Section 115
A person who attempts suicide is **presumed, unless proved otherwise, to have severe stress** and **shall not be tried and punished**. The government must provide **care, treatment and rehabilitation**. Since July 2024 the **Bharatiya Nyaya Sanhita** has replaced the Indian Penal Code; it does not carry over the old general offence of attempted suicide, though attempting suicide to compel or restrain a public servant is an offence (Section 226).
:::

:::recall
1. Name five rights under the MHCA 2017. || Access to care, community living, protection from cruel treatment, confidentiality, legal aid (also equality, information, records).
2. What is an advance directive? || A capable adult's written wishes for future treatment and choice of nominated representative.
3. What is the time limit for supported admission before Board approval is needed, and for emergency treatment? || 30 days; 72 hours.
4. List four prohibited or restricted treatments. || ECT without anaesthesia and relaxant, ECT for minors without guardian consent and Board permission, sterilisation, chaining.
5. What does Section 115 say? || Attempted suicide is presumed due to severe stress and not punished; the state must provide care.
:::

# Part III · Other laws

## 3.1 Children and disability [core]
| Law | What you need to know |
|---|---|
| **POCSO Act 2012** | Protects everyone under 18 from sexual offences. **Section 19: mandatory reporting** to police or the Special Juvenile Police Unit; **Section 21**: penalty for failing to report. Child-friendly procedures |
| **Juvenile Justice Act 2015** | Care and protection of children in need; children in conflict with the law; 16 to 18 year-olds accused of heinous crimes may be assessed by the Juvenile Justice Board, including their mental capacity to commit the offence |
| **Rights of Persons with Disabilities Act 2016** | Recognises **21 disabilities**, including **mental illness, intellectual disability, specific learning disabilities and autism**. **Benchmark disability (40% or more)** brings reservations in education and jobs and other benefits. Disability is certified using standard tools, such as IDEAS (Indian Disability Evaluation and Assessment Scale) for mental illness and IQ and social-maturity testing for intellectual disability |

## 3.2 Substances [core]
- **NDPS Act 1985** (Narcotic Drugs and Psychotropic Substances): controls drugs. **Section 64A** gives immunity from prosecution to a person accused of consuming small quantities who **volunteers for treatment** for de-addiction.
- Prescribing controlled medicines (buprenorphine, benzodiazepines) needs proper records.

## 3.3 Criminal responsibility and civil matters [core]
:::define The insanity defence
**Section 84 of the IPC**, now **Section 22 of the Bharatiya Nyaya Sanhita**: nothing is an offence if, at the time of the act, by reason of **unsoundness of mind**, the person was **incapable of knowing the nature of the act**, or that it was **wrong or contrary to law**. Based on the **M'Naghten rules**. It is the mental state **at the time of the act** that matters, and the burden is on the defence.
:::
- **Fitness to stand trial**: can the accused understand the charges and proceedings, and instruct a lawyer?
- **Testamentary capacity**: making a valid will needs understanding of the act, the property, the claims of those who might expect to benefit, and no disorder of mind distorting these.
- **Marriage**: under the Hindu Marriage Act, mental disorder of a kind or extent that makes the person unfit for marriage can be grounds for annulment or divorce; the courts look at severity and functioning, not a diagnosis alone.
- Persons with mental illness may need a guardian for property under specific procedures.

## 3.4 Telepsychiatry and records [extra]
- Telemedicine practice guidelines (2020) and telepsychiatry guidelines allow consultations by video, audio or text; confirm identity, location and consent; some medicines can't be prescribed remotely.
- Personal health data must be protected; follow consent and data-minimisation principles.

:::recall
1. What does POCSO Section 19 require, and Section 21 penalise? || Mandatory reporting; failure to report.
2. How many disabilities does the RPwD Act recognise, and what is the benchmark? || 21; 40% or more.
3. What does NDPS Section 64A do? || Immunity for users of small quantities who volunteer for treatment.
4. State the insanity defence and its new section number. || Unsoundness of mind making the person incapable of knowing the nature of the act or that it is wrong; IPC 84, now BNS 22.
5. What matters is the mental state at what time? || The time of the act.
:::

# Part IV · Exam zone

## 4.1 Long answer and short notes [core]
:::example Q. Discuss the salient features of the Mental Healthcare Act 2017. (15 marks)
1. Background: rights-based, aligned with the UN Convention on the Rights of Persons with Disabilities; replaced the Mental Health Act 1987.
2. Definition of mental illness and capacity.
3. Rights: access, community living, dignity, equality, confidentiality, information, records, legal aid, complaints.
4. Advance directive and nominated representative.
5. Admissions: independent, supported (30 days and beyond), emergency treatment (72 hours), minors.
6. Prohibited treatments; restraint rules.
7. Institutions: Central and State Mental Health Authorities, Mental Health Review Boards; registration of establishments and professionals.
8. Section 115: decriminalisation of attempted suicide; duty of care.
9. Critique and challenges: resources, implementation, family roles in Indian context.
:::

:::word Short note: capacity
Capacity is the ability to make a particular decision at a particular time. A person has capacity if they can understand the information relevant to the decision, retain it, use and weigh it to arrive at a decision, and communicate it. Capacity is presumed, assessed decision by decision, and supported with simple language and time; an unwise choice or a diagnosis does not by itself show incapacity. Under the Mental Healthcare Act 2017, capacity determines whether a person can consent to treatment and admission, and when supported admission or a nominated representative is needed.
:::

## 4.2 Viva rapid-fire [core]
:::viva
Four ethical principles? :: Autonomy, beneficence, non-maleficence, justice.
Four parts of capacity? :: Understand, retain, use and weigh, communicate.
Is capacity global? :: No, it is decision- and time-specific.
Can a client and therapist date after therapy ends? :: No; sexual relationships with clients are unethical.
Council for registration of clinical psychologists? :: Rehabilitation Council of India.
MHCA emergency treatment limit? :: 72 hours.
Supported admission initial limit? :: 30 days.
Body that approves longer supported admission? :: Mental Health Review Board.
Is ECT without anaesthesia allowed? :: No, prohibited.
Section on attempted suicide in MHCA? :: Section 115.
Insanity defence section now? :: BNS Section 22 (formerly IPC 84).
Basis of the insanity defence? :: M'Naghten rules.
POCSO reporting section? :: Section 19.
RPwD number of disabilities? :: 21.
Benchmark disability? :: 40% or more.
NDPS immunity for treatment-seekers? :: Section 64A.
:::

## 4.3 Module test [core]
:::mcq
Q: A capable adult with depression refuses an antidepressant after understanding the risks. You should:
- Give it secretly in food
- *Respect the decision, explore reasons, and offer alternatives
- Admit him against his will
- Ask the family to force him
> Autonomy; an unwise choice is not incapacity.

Q: Which is NOT one of the four abilities of capacity?
- Understanding information
- Retaining it
- Weighing it
- *Agreeing with the clinician
> Communicating the decision is the fourth.

Q: Under the MHCA 2017, emergency treatment may be given for up to:
- 24 hours
- *72 hours
- 7 days
- 30 days
> To prevent death, serious harm or violence.

Q: Which is prohibited under the MHCA 2017?
- ECT with anaesthesia
- *ECT without anaesthesia and muscle relaxant
- Lithium
- Psychotherapy
> Also chaining and sterilisation as treatment.

Q: A 15-year-old tells you a tuition teacher sexually abused her and asks you to keep it secret. You must:
- Keep it secret
- *Report under POCSO, inform your supervisor, and support her
- Wait for proof
- Tell her parents only
> Section 19 mandatory reporting.

Q: The insanity defence in India requires that, at the time of the act, the person:
- Had any mental illness
- *Was incapable of knowing the nature of the act or that it was wrong, due to unsoundness of mind
- Was intoxicated by choice
- Has a mental illness now
> BNS Section 22 (formerly IPC 84).

Q: Under the RPwD Act, benchmark disability means:
- Any disability
- *40% or more of a specified disability
- 80% or more
- Physical disability only
> Brings reservations and benefits.

Q: A drug user arrested with a small quantity agrees to de-addiction treatment. Which section may protect him?
- POCSO Section 19
- *NDPS Section 64A
- MHCA Section 94
- BNS Section 22
> Immunity for volunteers for treatment.

Q: A patient tells you he plans to kill his neighbour tomorrow and has bought a knife. Confidentiality:
- Must be kept absolutely
- *May be breached to protect the identifiable person, with senior involvement
- Applies only to adults
- Means you call his employer
> Serious risk to an identifiable other.

Q: Treating your close friend's sister as a therapy client is:
- Encouraged
- *A dual relationship to avoid
- Required in small towns
- Only a problem if she pays
> Impairs objectivity.
:::
`;
