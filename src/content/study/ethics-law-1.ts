/* Module · Ethics and Indian mental health law, Parts I and II (Starting and Beginner levels). Original text written for VIBHA School of Psychology. Legal content is educational, verified as of Nov 2026, and is not legal advice. */
export const part1 = String.raw`
# Part I · Starting: the ideas that guide every decision

## 1.1 Why ethics and law matter, and the four principles [core][starting]
Every day in a clinic you make decisions that affect someone's freedom, privacy and safety. Should you tell a mother what her 16-year-old said in therapy? Can a man refuse medicine when he is psychotic? May you accept a box of sweets from a grateful patient at Diwali? **Ethics** is how we decide what is right. **Law** sets the minimum society will enforce. Good practice usually goes beyond the law.

### The four principles
| Principle | In plain words | Example |
|---|---|---|
| **Autonomy** | Respect the person's right to make their own choices | A patient with capacity refuses a medicine; you respect it and explore why |
| **Beneficence** | Act for the person's good | Offering the treatment with the best evidence |
| **Non-maleficence** | Do no harm, or the least harm | Avoiding a medicine with dangerous interactions; not over-treating |
| **Justice** | Be fair: in access, in sharing resources, in treating people equally | Giving the same quality of care to a poor rural patient as to a rich urban one |

Many writers add **fidelity** (keeping promises, being trustworthy) and **veracity** (telling the truth).

:::mnemonic "A Big Nice Jalebi"
**A**utonomy, **B**eneficence, **N**on-maleficence, **J**ustice.
:::

:::analogy Four ropes holding a tent
Each principle is a rope. Pull one too hard and the tent leans. Ethics is the work of adjusting all four so the tent stands. Most real dilemmas are not "right versus wrong" but **right versus right**: autonomy against beneficence, privacy against safety.
:::

:::widget decide
{
  "scene": "Mrs Rao, 70, in Mysuru, has mild memory problems but understands her situation clearly. She refuses to move into her son's flat in Bengaluru and wants to stay alone in her own house. Her son asks you to 'certify that she is not fit to decide'.",
  "ask": "Which response best balances the principles?",
  "choices": [
    { "label": "Certify her as unfit so she is safe", "verdict": "harm", "outcome": "She is moved against her will, becomes depressed, and loses trust in doctors.", "why": "Capacity is presumed and decision-specific. She understands the choice and its risks. Overriding her violates autonomy without justification." },
    { "label": "Assess her capacity for this decision; if she has it, respect her choice and work with the family on safety supports (a daily visitor, a phone check, emergency contacts)", "verdict": "best", "outcome": "She stays at home with a carer visiting daily. Her son is reassured by a clear safety plan.", "why": "This respects autonomy while serving beneficence through practical support." },
    { "label": "Refuse to get involved", "verdict": "ok", "outcome": "The family conflict continues and no safety plan is made.", "why": "Stepping back avoids harm but misses a chance to help." }
  ]
}
:::

:::clinician
Beauchamp and Childress first set out principlism in 1979 and have refined it since; critics point out that principles conflict without a ranking and that they reflect Western individualism. In Indian practice, relational autonomy (decisions made with and through family) is common and often legitimate; the MHCA 2017 itself recognises the nominated representative and supported decision-making, but it also places the person's own will at the centre. Other frameworks to know for examinations: virtue ethics (what would a good clinician do?), care ethics (attending to relationships and dependency), and casuistry (reasoning from paradigm cases). Indian traditions add dharma (duty fitting one's role) and ahimsa (non-harm). Ethical maturity means naming the competing values explicitly and justifying the trade-off.
:::

:::recall
1. Name the four principles of biomedical ethics. || Autonomy, beneficence, non-maleficence, justice.
2. What do fidelity and veracity mean? || Fidelity: keeping promises and trust. Veracity: telling the truth.
3. Why are most dilemmas "right versus right"? || Because two good principles conflict, such as autonomy and beneficence.
:::

:::mcq
Q: A clinician spends equal effort explaining treatment to a labourer and a businessman. This reflects:
- Autonomy
- Beneficence
- *Justice
- Fidelity
> Fair and equal treatment.

Q: Avoiding a medicine that would be dangerous with a patient's heart condition reflects mainly:
- Autonomy
- *Non-maleficence
- Justice
- Veracity
> Do no harm.
:::

## 1.2 Consent and capacity in plain words [core][starting]
### Valid consent has four parts
1. **Information**: the person is told, in words they understand, what is proposed, why, the benefits, the risks, the alternatives (including doing nothing).
2. **Capacity**: the person is able to make this decision.
3. **Voluntariness**: no force, threats or pressure.
4. **Decision**: the person communicates a choice, and can change their mind.


:::widget flow
{
 "title": "Valid consent, step by step",
 "layout": "chain",
 "nodes": [
  {
   "id": "i",
   "label": "Information",
   "detail": "What is proposed, why, benefits, risks, alternatives including doing nothing, in words the person understands."
  },
  {
   "id": "c",
   "label": "Capacity",
   "detail": "Can they understand, appreciate consequences and communicate a choice for this decision?"
  },
  {
   "id": "v",
   "label": "Voluntariness",
   "detail": "No force, threats or pressure, including from family."
  },
  {
   "id": "d",
   "label": "Decision",
   "detail": "A choice is communicated and recorded; it can be changed later."
  }
 ],
 "caption": "If any box fails, the consent is not valid. Which box is most often skipped in a busy OPD? (Usually information about alternatives.)"
}
:::

:::mnemonic "I Can Volunteer Decisions"
**I**nformation, **C**apacity, **V**oluntariness, **D**ecision.
:::

### What capacity means
Under the Mental Healthcare Act 2017 (section 4), a person has capacity for a decision if they can:
- **Understand** the information relevant to the decision.
- **Appreciate** the reasonably foreseeable consequences of deciding, or not deciding.
- **Communicate** the decision (by speech, writing, signs or any other way).


:::widget flow
{
 "title": "Assessing capacity for one decision",
 "layout": "tree",
 "nodes": [
  {
   "id": "s",
   "label": "Start: capacity is presumed"
  },
  {
   "id": "sup",
   "label": "Give support first",
   "parent": "s",
   "detail": "Simple language, the person's own language, pictures, time, a trusted person."
  },
  {
   "id": "u",
   "label": "Can they understand the information?",
   "parent": "sup"
  },
  {
   "id": "a",
   "label": "Can they appreciate the consequences for themselves?",
   "parent": "sup",
   "detail": "Most affected by delusions about the treatment or deep hopelessness."
  },
  {
   "id": "cm",
   "label": "Can they communicate a choice?",
   "parent": "sup",
   "detail": "By any means: speech, writing, signs."
  },
  {
   "id": "yes",
   "label": "All three: capacity present",
   "parent": "a",
   "detail": "Respect the choice, even if unwise."
  },
  {
   "id": "no",
   "label": "Any one missing: lacks capacity for this decision now",
   "parent": "cm",
   "detail": "Record the evidence; review it, since capacity changes."
  }
 ],
 "caption": "Capacity is decision-specific and time-specific. Tap each branch for what to check."
}
:::

### Five rules about capacity
1. **Presumed**: every adult is assumed to have capacity unless shown otherwise.
2. **Decision-specific**: a person may lack capacity to decide on surgery but still be able to choose what to eat.
3. **Time-specific**: capacity can change from day to day (for example in delirium or mania).
4. **Supported**: give information simply, in the person's language, with pictures or sign language if needed, before concluding they lack capacity.
5. **An unwise choice is not proof of incapacity**: a person can choose something you disagree with.

:::widget sort
{
  "prompt": "Does each person probably have capacity for the decision named?",
  "buckets": ["Has capacity", "May lack capacity: assess carefully"],
  "items": [
    { "text": "A man with schizophrenia, now well, chooses to stop his antipsychotic, knowing it may cause a relapse, because of weight gain", "bucket": 0, "why": "He understands, appreciates and communicates. The choice may be risky, but an unwise choice is not incapacity." },
    { "text": "A woman with severe depression refuses food, saying she deserves to die and that nothing can help", "bucket": 1, "why": "Depressive hopelessness may stop her appreciating consequences; assess carefully." },
    { "text": "A confused, feverish older man in delirium wants to leave the ward at 3 am", "bucket": 1 },
    { "text": "A 30-year-old with mild intellectual disability, given information in simple pictures, chooses which of two medicines to try", "bucket": 0, "why": "With support, she understands and decides. Supported decision-making is a requirement, not an extra." },
    { "text": "A man in mania signs to sell his house for a tenth of its value to 'fund a mission from God'", "bucket": 1 }
  ]
}
:::

:::example Consent in a busy Indian clinic
A doctor in a government OPD in Lucknow has three minutes per patient. Instead of "take this tablet", she says: "This medicine helps sadness and sleep. It takes some time to work. In the first days you may feel sick or sleepy; that usually passes. If you feel restless or think of harming yourself, come back at once. You can also try talking therapy instead or as well. What do you think?" Forty seconds, and the four parts of consent are there.
:::

:::clinician
Capacity assessment should be documented with evidence for each element, in the patient's words where possible. The MacArthur Competence Assessment Tool for Treatment (MacCAT-T) structures the classic four abilities (understanding, appreciation, reasoning, expressing a choice); the MHCA collapses reasoning into appreciation. Appreciation is the element most affected by psychosis and severe depression (for example a delusion that the medicine is poison, or a nihilistic belief that treatment is pointless for someone who "deserves" to suffer). The MHCA's section 4(3) makes explicit that a decision perceived as inappropriate or wrong does not by itself mean lack of capacity. Consent for psychological therapy also requires information about the nature, expected duration, limits of confidentiality, fees and alternatives (APA Standard 10.01). Under Indian law, adult consent is the person's own; family consent is not a legal substitute for an adult with capacity, though family involvement may be welcomed by the patient.
:::

:::recall
1. What are the four parts of valid consent? || Information, capacity, voluntariness, decision.
2. What three abilities define capacity under the MHCA? || Understand, appreciate consequences, communicate the decision.
3. Name the five rules about capacity. || Presumed; decision-specific; time-specific; supported; an unwise choice is not proof of incapacity.
:::

:::mcq
Q: A patient with capacity refuses a recommended medicine. The clinician should:
- Give it anyway for the patient's good
- *Respect the refusal, explore the reasons, and offer alternatives
- Ask the family to consent instead
- Discharge the patient
> Autonomy prevails when capacity is present.

Q: Capacity is best described as:
- Fixed for life once lost
- *Specific to a decision and a time
- The same as IQ
- Decided by the family
> Decision- and time-specific.
:::

## 1.3 Confidentiality and its limits in plain words [core][starting]
**Confidentiality** means what a patient tells you stays private. It is the foundation of trust: people will not tell you about suicidal thoughts, abuse or drug use if they fear it will be spread.

### But confidentiality is not absolute
You may, and sometimes must, share information:
- **With consent**: the patient agrees (for example to talk to their family).
- **Within the care team**: other professionals directly involved, on a need-to-know basis.
- **To protect someone from serious harm**: the patient or another person is at serious, real risk.
- **When the law requires it**: for example reporting sexual offences against children under the POCSO Act, or a court order.
- **For public safety**, in limited situations the law defines.

Even then, share only **what is needed**, with **who needs it**, and **record why**.

:::analogy A locked cupboard with a few keys
Confidentiality is a locked cupboard. The patient holds the main key. A few spare keys exist, held by the law and by the duty to prevent serious harm. You should know exactly which keys exist, use them rarely, open only the shelf that is needed, and write down every time you did.
:::


:::widget flow
{
 "title": "Should I share this information?",
 "layout": "tree",
 "nodes": [
  {
   "id": "q",
   "label": "A request or a reason to share"
  },
  {
   "id": "c",
   "label": "Has the person consented?",
   "parent": "q",
   "detail": "If yes, share what they agreed to."
  },
  {
   "id": "t",
   "label": "Is it within the care team?",
   "parent": "q",
   "detail": "Share only what is needed for care."
  },
  {
   "id": "h",
   "label": "Is someone at serious risk of harm?",
   "parent": "q",
   "detail": "Share the minimum needed to prevent it, with those who can act."
  },
  {
   "id": "l",
   "label": "Does the law require it?",
   "parent": "q",
   "detail": "POCSO reporting, a court order, Board or Authority requests."
  },
  {
   "id": "n",
   "label": "None of these: keep it confidential",
   "parent": "q",
   "detail": "Curiosity, gossip and unofficial requests are never reasons."
  }
 ],
 "caption": "Whatever you decide, record what you shared, with whom and why."
}
:::

### Tell people the limits at the start
At the first meeting, explain in simple words what you will keep private and when you might have to share. Then nothing comes as a betrayal later.

:::example A first-session script in Hindi and English
"Jo aap mujhse kahenge, woh hum dono ke beech rahega. (What you tell me stays between us.) There are only a few times I would have to share something: if I'm worried you or someone else is in serious danger, if a child is being harmed, or if a court orders it. If that ever happens, I will try to talk to you first. Is that clear? Any questions?"
:::

:::widget decide
{
  "scene": "Rahul, 24, an engineering student in Bhopal, tells his counsellor he has been feeling hopeless and has been reading about ways to die. He begs, 'Please don't tell my parents, they'll take me out of college.'",
  "ask": "What should the counsellor do?",
  "choices": [
    { "label": "Promise complete secrecy to keep his trust", "verdict": "harm", "outcome": "He makes a serious attempt a week later; his parents had no idea.", "why": "Confidentiality does not cover serious, imminent risk to life. A promise you cannot keep is itself a breach of trust." },
    { "label": "Assess the risk carefully now; explain honestly the limits of confidentiality; involve him in deciding who to tell and how; if risk is serious, involve family or emergency help with or without consent, sharing only what is needed", "verdict": "best", "outcome": "He agrees to call his elder sister together with the counsellor; a psychiatric assessment is arranged the same day.", "why": "Safety comes first, but done collaboratively, transparently and minimally, it often preserves the relationship." },
    { "label": "Call his parents immediately without telling him", "verdict": "ok", "outcome": "He is safe for now but feels betrayed and refuses further help.", "why": "Breaking confidentiality may be necessary, but doing it behind his back, without assessment or involvement, damages trust unnecessarily." }
  ]
}
:::

:::clinician
The MHCA 2017, section 23, provides the statutory basis for confidentiality of information about persons with mental illness, with listed exceptions: release to the nominated representative to enable their duties; to other mental health and health professionals for care; where necessary to protect another person from harm or violence; information only as necessary to protect against the identified harm; at the request of the Mental Health Review Board, the Central or State Authority, or a court; and in the interests of public safety and security. Section 24 restricts publication of photographs or information about persons with mental illness without consent. Psychologists' codes (APA Standard 4.05; RCI and IACP codes) mirror these. The constitutional right to privacy recognised in Justice K. S. Puttaswamy v. Union of India (2017) and the Digital Personal Data Protection Act 2023 (with rules notified in late 2025 and phased commencement) strengthen expectations around health data. Sections 2.5 and 3.5 take these limits further, including duty to protect.
:::

:::recall
1. Why is confidentiality essential in mental health care? || Without it, people will not disclose sensitive information such as suicidal thoughts, abuse or substance use.
2. List five situations when information may be shared. || With consent; within the care team; to protect from serious harm; when the law requires (POCSO, court order); public safety in limited cases.
3. When should you explain the limits of confidentiality? || At the start of the first meeting.
4. Which MHCA section protects confidentiality? || Section 23.
:::

:::mcq
Q: Which is NOT a legitimate reason to share confidential information?
- The patient consents
- A court orders it
- *A curious neighbour asks how the patient is
- There is serious risk to another person
> Curiosity is not a reason.

Q: When breaching confidentiality to prevent harm, you should share:
- Everything in the file
- *Only the information needed to prevent the harm, with those who need it, and record why
- Nothing at all
- Information with the media
> Minimum necessary disclosure.
:::

## 1.4 Boundaries and professional conduct [core][starting]
A **boundary** is the edge of the professional role. It keeps the relationship safe and focused on the patient's needs.

### Boundary crossings and boundary violations
- A **boundary crossing** is a step outside the usual frame that may be harmless or even helpful: accepting a small sweet at Diwali, attending a patient's funeral, a brief supportive touch on the shoulder when someone is sobbing (with sensitivity to culture and gender).
- A **boundary violation** harms the patient: any sexual contact, business deals, borrowing money, using the patient's influence for your benefit, secrets that serve the therapist's needs.

### Dual relationships
A dual (multiple) relationship is when you have another role with the patient: friend, relative, employer, teacher, landlord. These create conflicts of interest and should be **avoided** where possible. In small towns and close communities, some overlap is unavoidable; then **discuss it, document it, and get supervision**.


:::widget flow
{
 "title": "The slippery slope from crossing to violation",
 "layout": "chain",
 "nodes": [
  {
   "id": "1",
   "label": "Small crossing",
   "detail": "Running over time for one favourite client."
  },
  {
   "id": "2",
   "label": "Personal sharing",
   "detail": "Talking about your own problems."
  },
  {
   "id": "3",
   "label": "Out-of-hours contact",
   "detail": "Late-night messages about non-urgent things."
  },
  {
   "id": "4",
   "label": "Secrecy",
   "detail": "Not mentioning the relationship in supervision."
  },
  {
   "id": "5",
   "label": "Violation",
   "detail": "Exploitation: romance, money, favours."
  }
 ],
 "caption": "Each step feels small. The protection is noticing early and taking it to supervision."
}
:::

### Warning signs of a slippery slope
- Extending sessions only for one patient.
- Sharing your personal problems with a patient.
- Messaging late at night about non-urgent matters.
- Thinking about the patient romantically.
- Feeling you are the only one who can help them.

:::widget sort
{
  "prompt": "Boundary crossing (may be acceptable with thought) or boundary violation (harmful, not acceptable)?",
  "buckets": ["Crossing: think, discuss, document", "Violation: never"],
  "items": [
    { "text": "Accepting a small box of sweets at Diwali", "bucket": 0 },
    { "text": "Starting a romantic relationship with a current patient", "bucket": 1 },
    { "text": "Lending money to a patient who is short of rent", "bucket": 1 },
    { "text": "Attending a patient's daughter's funeral after she died by suicide", "bucket": 0 },
    { "text": "Investing in a patient's business after he gives you a 'tip'", "bucket": 1 },
    { "text": "Treating a distant acquaintance in a small town where you are the only psychologist, after discussing it", "bucket": 0 },
    { "text": "Asking a patient who is a lawyer for free advice on your property case", "bucket": 1 }
  ]
}
:::

### Social media and digital contact
- Do not accept friend requests from current patients on personal accounts.
- Use official channels for appointment messages; avoid discussing clinical matters on personal WhatsApp.
- Never search for patients online without a clear clinical reason and their knowledge.
- Never post anything that could identify a patient, even "anonymised" stories from small communities.

:::clinician
Gutheil and Gabbard's distinction between boundary crossings and violations is the standard framework; the risk lies in progressive, unexamined crossings. Sexual contact with current patients is prohibited in every code (APA 10.05); APA 10.08 prohibits sexual intimacy with former therapy clients for at least two years and, even then, only in the most unusual circumstances. The National Medical Commission declared conversion therapy professional misconduct in 2022, following the Madras High Court's directions in S. Sushma v. Commissioner of Police (2021); offering it is an ethical and professional violation regardless of family pressure. Gifts: consider value, timing, meaning in the person's culture and therapy, and the effect of refusing; record and discuss in supervision. Telehealth adds boundary issues (sessions from bedrooms, recording without consent, unclear crisis plans); write a teletherapy agreement covering these.
:::

:::recall
1. What is the difference between a boundary crossing and a boundary violation? || A crossing is a step outside the usual frame that may be harmless or helpful; a violation exploits or harms the patient.
2. What should you do when a dual relationship cannot be avoided? || Discuss it, document it, and get supervision.
3. Name three warning signs of a slippery slope. || Extending sessions for one patient, sharing personal problems, late-night non-urgent messaging, romantic thoughts, feeling uniquely indispensable.
:::

:::mcq
Q: Which is always a boundary violation?
- A short supportive touch on the arm
- Accepting a handmade card
- *Sexual contact with a current patient
- Running five minutes over once in a crisis
> Prohibited in every code.

Q: A family asks a psychologist to "cure" their son's homosexuality. In India the correct response is that:
- It can be offered if the family pays
- *Conversion therapy is unethical and declared professional misconduct by the NMC; the psychologist can support the family and son in other ways
- It is required by law
- It is only acceptable for minors
> It is harmful and prohibited.
:::

## 1.5 The laws at a glance [core][starting]
You will meet these laws throughout your career. First learn **what each is about**; the sections come later.

| Law | What it is about |
|---|---|
| **Mental Healthcare Act 2017 (MHCA)** | Rights of persons with mental illness, capacity, advance directives, nominated representatives, admission, treatment, restraint, decriminalising suicide attempts, mental health establishments and review boards |
| **Rehabilitation Council of India Act 1992 (RCI Act)** | Training and registration of rehabilitation professionals, including clinical and rehabilitation psychologists |
| **Rights of Persons with Disabilities Act 2016 (RPwD Act)** | Rights, certification and reservations for 21 disabilities, including mental illness, intellectual disability, autism and specific learning disabilities |
| **Protection of Children from Sexual Offences Act 2012 (POCSO)** | Sexual offences against anyone under 18, and the duty to report them |
| **Juvenile Justice (Care and Protection of Children) Act 2015** | Children in conflict with law and children in need of care, including adoption |
| **Narcotic Drugs and Psychotropic Substances Act 1985 (NDPS)** | Control of drugs, offences, and treatment for people who use drugs |
| **Bharatiya Nyaya Sanhita 2023 (BNS)** | The criminal code that replaced the Indian Penal Code from 1 July 2024, including the defence of unsound mind |
| **Bharatiya Nagarik Suraksha Sanhita 2023 (BNSS)** | Criminal procedure, replacing the CrPC, including procedures for accused persons of unsound mind or with intellectual disability |
| **Bharatiya Sakshya Adhiniyam 2023 (BSA)** | Evidence law, replacing the Indian Evidence Act, including expert opinion |
| **Digital Personal Data Protection Act 2023 (DPDP)** | Handling of personal data, including health data |

:::widget sort
{
  "prompt": "Which law mainly applies?",
  "buckets": ["MHCA 2017", "POCSO 2012", "RPwD 2016", "RCI Act 1992", "BNS 2023"],
  "items": [
    { "text": "A 15-year-old discloses sexual abuse by a tutor in a therapy session", "bucket": 1 },
    { "text": "A woman with bipolar disorder writes an advance directive about future treatment", "bucket": 0 },
    { "text": "A college student with dyslexia applies for extra exam time and a disability certificate", "bucket": 2 },
    { "text": "A man with no clinical psychology training opens a clinic calling himself a 'clinical psychologist'", "bucket": 3 },
    { "text": "A defence lawyer argues that his client could not know the nature of his act because of psychosis", "bucket": 4 },
    { "text": "A hospital uses restraint on an agitated patient", "bucket": 0 }
  ]
}
:::

:::student
Do not panic about section numbers. Learn the **ideas** first: rights, capacity, consent, admission, reporting, registration, disability. Then learn a handful of key sections that come up again and again (they are listed in the exam zone).
:::

:::clinician
Three transitions shape current Indian practice. The MHCA 2017 (in force from 29 May 2018) replaced the Mental Health Act 1987 with a rights-based framework aligned with the UN Convention on the Rights of Persons with Disabilities (ratified by India in 2007). The RPwD Act 2016 replaced the Persons with Disabilities Act 1995 and expanded recognised disabilities from 7 to 21. The three new criminal laws (BNS, BNSS, BSA) came into force on 1 July 2024, renumbering most provisions you will see in older textbooks (for example IPC 84 is now BNS 22; CrPC 328 to 339 are now BNSS 367 to 378; Indian Evidence Act 45 is now BSA 39). When reading older case law, translate section numbers. Mental health legislation also intersects with the Medical Termination of Pregnancy Act (as amended in 2021), the Hindu Marriage Act (mental disorder as a ground for divorce or nullity), the Indian Succession Act and guardianship law.
:::

:::recall
1. What does the RCI Act 1992 regulate? || Training and registration of rehabilitation professionals, including clinical psychologists.
2. Which law replaced the Indian Penal Code, and when? || The Bharatiya Nyaya Sanhita 2023, from 1 July 2024.
3. How many disabilities does the RPwD Act 2016 recognise? || 21.
4. Which law covers sexual offences against children? || POCSO Act 2012.
:::

:::mcq
Q: The law that sets out advance directives for mental health treatment is the:
- RPwD Act 2016
- *Mental Healthcare Act 2017
- POCSO Act 2012
- NDPS Act 1985
> MHCA section 5 onwards.

Q: The Indian Penal Code's insanity section 84 is now found in:
- BNSS section 367
- *BNS section 22
- BSA section 39
- MHCA section 115
> Same principle, new number.
:::

## 1.6 Level check · Starting [core][starting]
Score 80% or more to open the Beginner level.

:::mcq
Q: Respecting a person's right to make their own decisions is:
- Beneficence
- *Autonomy
- Justice
- Non-maleficence
> Self-determination.

Q: "Do no harm" is the principle of:
- Autonomy
- Beneficence
- *Non-maleficence
- Fidelity
> Avoid harm.

Q: Valid consent requires information, capacity, voluntariness and:
- Family approval
- *A communicated decision
- A written test
- A lawyer
> The four elements.

Q: Under the MHCA, every adult is:
- Presumed to lack capacity until tested
- *Presumed to have capacity unless shown otherwise
- Required to have family consent
- Assessed for capacity by a court
> Presumption of capacity.

Q: A patient can choose a meal but cannot weigh up a complex surgery. This shows capacity is:
- Absent in general
- *Decision-specific
- Determined by IQ
- Fixed for life
> Decision-specific.

Q: A choice you disagree with:
- Proves the patient lacks capacity
- *Does not by itself show lack of capacity
- Must be overridden
- Should be reported to the police
> MHCA section 4(3).

Q: Confidentiality may be broken:
- Whenever the family asks
- *When there is serious risk of harm, when the law requires it, or with consent
- Never
- For research without consent
> Defined exceptions.

Q: The best time to explain confidentiality limits is:
- After a crisis
- *At the first meeting
- Never, to avoid scaring the patient
- Only if asked
> Prevents later sense of betrayal.

Q: Accepting a small box of sweets at Diwali is best seen as:
- A boundary violation
- *A boundary crossing to think about, which may be acceptable
- Illegal
- Required
> Consider value, meaning, timing.

Q: A therapist borrowing money from a patient is:
- A crossing
- *A violation
- Acceptable in emergencies
- A form of therapy
> Exploitation.

Q: Conversion therapy for sexual orientation in India is:
- Recommended
- *Declared professional misconduct by the National Medical Commission
- Required for minors
- Allowed with family consent
> Unethical and prohibited.

Q: Registration of clinical psychologists in India is governed by the:
- Mental Healthcare Act
- *RCI Act 1992
- POCSO Act
- BNS
> Rehabilitation Council of India.

Q: The criminal code in force in India since 1 July 2024 is the:
- Indian Penal Code
- *Bharatiya Nyaya Sanhita
- Code of Criminal Procedure
- Indian Evidence Act
> The BNS replaced the IPC.

Q: Reporting sexual abuse of a 14-year-old disclosed in therapy is required under:
- RPwD Act
- *POCSO Act
- NDPS Act
- DPDP Act
> POCSO reporting duties.

Q: The RPwD Act 2016 includes which of these as a disability?
- Common cold
- *Mental illness and specific learning disabilities
- Shyness
- Left-handedness
> Among 21 disabilities.
:::

# Part II · Beginner: the Mental Healthcare Act, confidentiality and regulation

## 2.1 The MHCA 2017: definitions, capacity and rights [core][beginner]
The Mental Healthcare Act 2017 (MHCA) is a **rights-based** law. It came into force on 29 May 2018. It moved Indian law from "how to detain the mentally ill" to "what rights a person with mental illness has, and how to protect them".

### Key definitions
- **Mental illness** (section 2(1)(s)): a substantial disorder of thinking, mood, perception, orientation or memory that grossly impairs judgement, behaviour, capacity to recognise reality or ability to meet the ordinary demands of life, including conditions associated with the abuse of alcohol and drugs, but **not** including intellectual disability.
- **Mental health professional**: includes psychiatrists, clinical psychologists registered with the RCI (with an MPhil or equivalent qualification), psychiatric social workers, psychiatric nurses, and some AYUSH professionals with postgraduate mental health qualifications.
- **Mental health establishment**: any hospital or facility, public or private, that admits people with mental illness. All must be registered with the Mental Health Authority.

### Determining mental illness (section 3)
- Mental illness must be determined according to **nationally or internationally accepted medical standards** (such as ICD).
- It must **never** be determined on the basis of political, economic or social status, membership of a cultural, racial or religious group, or **non-conformity with moral, social, cultural, work or political values or religious beliefs**.
- Past treatment does not by itself justify a present diagnosis.

### Rights of persons with mental illness (sections 18 to 28)
| Section | Right |
|---|---|
| **18** | Access to mental healthcare: affordable, good quality, close to home, from government-funded services, including free care for people below the poverty line and the homeless |
| **19** | Community living: not to stay in an establishment just because there is no family or home |
| **20** | Protection from cruel, inhuman and degrading treatment: safe, hygienic, with privacy, food, clothing, not forced to work, not shaved without consent |
| **21** | Equality and non-discrimination, including **insurance** on the same basis as physical illness (section 21(4)) |
| **22** | Information about rights, illness and treatment, in a language the person understands |
| **23** | Confidentiality |
| **24** | Restriction on release of information or photographs to the media without consent |
| **25** | Access to their own medical records |
| **26** | Personal contacts and communication (visitors, phone, mail) |
| **27** | Free legal aid |
| **28** | To make complaints about deficiencies in services |

:::mnemonic Rights in order, sections 18 to 28: "All Children Play Every Indian Card, Rich Persons Love Cricket"
**A**ccess (18), **C**ommunity living (19), **P**rotection from cruelty (20), **E**quality (21), **I**nformation (22), **C**onfidentiality (23), **R**estriction on media (24), **P**ersonal records access (25), personal contacts and communication (26), **L**egal aid (27), **C**omplaints (28).
:::

:::widget decide
{
  "scene": "A family in Varanasi brings their 30-year-old daughter, saying she is 'mentally ill' because she refuses an arranged marriage, wants to live alone and has started going to a different religious group's meetings. She is calm, sleeps and eats well, works, and describes her reasons clearly.",
  "ask": "How should the clinician respond under the MHCA?",
  "choices": [
    { "label": "Admit her to 'calm her down' as the family wishes", "verdict": "harm", "outcome": "She is detained unlawfully, loses her job and later files a complaint.", "why": "Section 3 forbids determining mental illness on the basis of non-conformity with social, cultural or religious values." },
    { "label": "Assess her fully; if there is no mental illness, explain this to the family respectfully, offer family counselling if they wish, and do not treat or admit", "verdict": "best", "outcome": "The family is unhappy but understands the doctor will not label their daughter; a family therapist helps them talk.", "why": "Diagnosis must follow accepted medical standards, not social disapproval. The clinician protects her rights." },
    { "label": "Give her a mild sedative to keep everyone happy", "verdict": "harm", "outcome": "Treatment without indication or valid consent; unethical and unlawful.", "why": "Medicating social disagreement is a serious abuse." }
  ]
}
:::

:::clinician
Section 2(1)(s) excludes intellectual disability (which falls under the RPwD Act) but includes substance-related conditions, which brings de-addiction centres within the MHCA's establishment registration and standards. The Act requires that people below the poverty line, whether or not they have a BPL card, and the homeless, receive free treatment at government establishments (section 18(7)). Section 21(4), insurance parity, was enforced by IRDAI circulars (2018 onwards) and has been the subject of litigation and Supreme Court attention; many policies still exclude or limit psychiatric cover in practice. The Act also provides for the Central and State Mental Health Authorities (sections 33 and 45) and Mental Health Review Boards (section 73 onwards), which oversee admissions, advance directives and complaints. Implementation has been uneven across states as of Nov 2026: several states constituted Boards late, and registration of establishments remains incomplete.
:::

:::recall
1. When did the MHCA 2017 come into force? || 29 May 2018.
2. What does section 3 forbid as a basis for diagnosing mental illness? || Political, economic, social status, group membership, or non-conformity with moral, social, cultural, work, political or religious values.
3. Which section gives insurance parity? || Section 21(4).
4. Which condition is excluded from the MHCA definition of mental illness? || Intellectual disability.
5. Which section gives the right to access one's records? || Section 25.
:::

:::mcq
Q: Under section 18 of the MHCA, a homeless person with mental illness is entitled to:
- Treatment only if a relative pays
- *Free treatment at government-funded establishments
- No treatment
- Treatment only in prison
> Free care for BPL and homeless persons.

Q: Under section 24, a hospital may release a patient's photograph to the media:
- Whenever newsworthy
- *Only with the patient's consent
- Never, even with consent
- If the family agrees
> Media restriction protects dignity.
:::

## 2.2 Advance directives and nominated representatives [core][beginner]
### Advance directive (sections 5 to 13)
Any adult **with capacity** can write an **advance directive** stating:
- How they **wish** to be cared for and treated for a mental illness.
- How they **do not wish** to be treated.
- Who they want to be their **nominated representative**.

It applies only when the person later **lacks capacity**. It must be registered with the Mental Health Review Board. It can be changed or cancelled at any time while the person has capacity. A psychiatrist must follow a valid advance directive. If the treating team or family disagrees with it, they must apply to the **Mental Health Review Board**, which decides whether to modify or cancel it. An advance directive does **not** apply to emergency treatment under section 94.

### Nominated representative (sections 14 to 17)
- Every adult can **appoint** a nominated representative (NR) in writing.
- If none is appointed, the law gives an order: the person named in an advance directive, then a relative, a care-giver, a suitable person appointed by the Board, or, failing these, a representative of an NGO or the Director of Social Welfare.
- For a **minor**, the legal guardian is the NR unless the Board decides otherwise.
- The NR **supports** the person in decisions when they need high support, has access to information to perform their duties, can apply to the Board on the person's behalf, and **must consider the person's current and past wishes**.

:::widget decide
{
  "scene": "Ms Fernandes, 40, from Goa, has bipolar disorder. Five years ago, while well, she registered an advance directive refusing olanzapine (because of severe weight gain and diabetes) and naming her friend Sheila as nominated representative. She is now manic, lacks capacity, and the resident wants to give olanzapine because 'it works fastest'. Her husband agrees with the resident.",
  "ask": "What should happen?",
  "choices": [
    { "label": "Give olanzapine; the husband consents", "verdict": "harm", "outcome": "The hospital breaches the law; Sheila complains to the Board.", "why": "A valid advance directive must be followed. The husband is not the nominated representative and cannot override it." },
    { "label": "Follow the directive: choose another effective treatment, involve Sheila as nominated representative, and if the team believes the directive should not apply, apply to the Mental Health Review Board", "verdict": "best", "outcome": "She is treated with an alternative antipsychotic and lithium; she recovers and later thanks the team for respecting her wishes.", "why": "The MHCA puts the person's own earlier wishes at the centre. Disagreement goes to the Board, not to the family." },
    { "label": "Wait until she regains capacity and treat nothing", "verdict": "harm", "outcome": "Her mania escalates dangerously.", "why": "The directive refuses one drug, not all treatment. She still needs care." }
  ]
}
:::

:::clinician
Under section 11, the psychiatrist, mental health professional, relative or care-giver who does not wish to follow an advance directive may apply to the Board to review, alter, modify or cancel it; the Board considers whether it was made voluntarily and with capacity, whether it was intended to apply in the present circumstances, and whether the person was sufficiently informed. Section 13 protects a professional who acts in good faith on a directive from liability. Uptake of advance directives in India remains very low as of Nov 2026, though psychiatric advance directives have reasonable acceptability in Indian studies when introduced with support. The nominated representative system replaced the old idea that "the family decides"; practically, many patients still name a family member. Supported decision-making, central to the CRPD, is the guiding idea: the NR supports rather than substitutes, except in the temporary consent provisions for supported admission.
:::

:::recall
1. Who can make an advance directive? || Any adult with capacity.
2. When does an advance directive apply? || Only when the person lacks capacity; not to emergency treatment.
3. Who decides if the team disagrees with an advance directive? || The Mental Health Review Board.
4. What must a nominated representative consider? || The person's current and past wishes.
:::

:::mcq
Q: An advance directive can be cancelled by:
- The family at any time
- *The person who made it, while they have capacity
- The police
- Any doctor
> The maker controls it while capable.

Q: If no nominated representative has been appointed, the law first looks to:
- A police officer
- *The person named in an advance directive, then a relative or care-giver
- The hospital director
- The court
> A statutory order applies.
:::

## 2.3 Admission and emergency treatment under the MHCA [core][beginner]
The MHCA prefers that people are treated in the **community** and, if admitted, as **independent patients**. Supported admission is a last resort.

| Type | Section | Who | Key conditions | Time |
|---|---|---|---|---|
| **Independent admission** | 85, 86 | An adult who has capacity (or needs minimal support) and requests admission | Illness severe enough to need admission; likely to benefit; understands and requests freely | Can leave on request (subject to section 88) |
| **Admission of a minor** | 87 | On application of the nominated representative | Two independent examinations; best interests; community care not enough; separate facilities; an attendant stays throughout | Board reporting within 72 hours |
| **Supported admission** | 89 | Person with severe mental illness who needs very high support | Recent or ongoing self-harm or threats, violence or fear of violence, or inability to care for self with risk of harm; admission is the least restrictive option; two professionals (a psychiatrist and another MHP or doctor) independently agree | Up to 30 days |
| **Supported admission beyond 30 days** | 90 | Same | Similar criteria, with Board approval | Initially up to 90 days, then up to 120, then 180 days at a time |
| **Emergency treatment** | 94 | Any registered medical practitioner | To prevent death or irreversible harm, serious harm to self or others, or serious property damage from mental illness; no ECT | Up to 72 hours or until assessed at an establishment |


:::widget flow
{
 "title": "Which admission route under the MHCA?",
 "layout": "tree",
 "nodes": [
  {
   "id": "q",
   "label": "A person with mental illness may need admission"
  },
  {
   "id": "ad",
   "label": "Adult with capacity who requests it",
   "parent": "q",
   "detail": "Independent admission, section 86. Can leave on request (subject to section 88)."
  },
  {
   "id": "mi",
   "label": "A minor",
   "parent": "q",
   "detail": "Section 87: nominated representative applies; two examinations; separate facilities; attendant; Board informed within 72 hours."
  },
  {
   "id": "sv",
   "label": "Adult needing very high support, with risk",
   "parent": "q",
   "detail": "Supported admission, section 89, up to 30 days; section 90 beyond that with Board approval."
  },
  {
   "id": "em",
   "label": "An emergency anywhere",
   "parent": "q",
   "detail": "Section 94: emergency treatment up to 72 hours by any registered medical practitioner; no ECT."
  }
 ],
 "caption": "Tap each route for the key conditions. Independent admission is always preferred where possible."
}
:::

### During supported admission
- The **nominated representative** may give temporary consent to the treatment plan if the person needs near-total support.
- **Capacity is reviewed** at least every seven days; when it returns, the person decides.
- The **Board** is informed within a few days (faster for women and minors).
- The person is told their status and rights, including the right to apply to the Board.

:::widget guess
{
  "prompt": "Under section 94, emergency treatment of a person with mental illness by a registered medical practitioner can last for at most how many hours (outside a declared disaster)?",
  "min": 0,
  "max": 168,
  "unit": "hours",
  "answer": [72, 72],
  "reveal": "72 hours, or until the person is assessed at a mental health establishment, whichever is earlier. ECT cannot be given as emergency treatment. In a declared disaster or emergency, the period can extend up to seven days.",
  "clinician": "Section 94 also deems conveying the person to the nearest mental health establishment for assessment to be emergency treatment. Informed consent of the nominated representative is required where available. Because advance directives do not apply to emergency treatment, document the specific emergency criterion met and the treatment directly related to it."
}
:::

:::widget decide
{
  "scene": "Mr Bhattacharya, 45, in Kolkata, has paranoid schizophrenia. He has stopped eating for four days because he believes his food is poisoned, is dehydrated, and has threatened his neighbour with a knife. He refuses admission and lacks capacity. His brother, his nominated representative, wants him admitted.",
  "ask": "Which route fits the MHCA?",
  "choices": [
    { "label": "Independent admission with his brother's signature", "verdict": "harm", "outcome": "Unlawful: independent admission needs the person's own capacity and request.", "why": "A relative cannot request an independent admission on someone's behalf." },
    { "label": "Supported admission under section 89 after independent examination by a psychiatrist and another mental health professional or medical practitioner, with the brother as nominated representative giving temporary consent, rights explained, and the Board informed", "verdict": "best", "outcome": "He is admitted lawfully, treated, and his capacity reviewed weekly; he regains capacity in three weeks and continues treatment voluntarily.", "why": "He meets section 89 criteria (risk to self through not eating, threat to others, lacks capacity), and the procedure protects his rights." },
    { "label": "Ask the police to take him to jail until he calms down", "verdict": "harm", "outcome": "A person who needs treatment is criminalised.", "why": "The MHCA (section 100) requires police to take a person with suspected mental illness who is a risk to a public health establishment, not to a lock-up." }
  ]
}
:::

:::clinician
Section 89 certification must state that admission is the least restrictive care option, taking into account any advance directive. Board reporting is within three days for women and minors and seven days for others; readmission under section 89 within seven days of discharge is barred (section 90 applies). Section 87 for minors requires examination by two professionals within seven days before admission, separate facilities, an attendant (female if the minor is a girl and the NR is male), and Board notification within 72 hours with review if admission reaches 30 days. Section 100 obliges police to take a person found wandering or posing a risk to the nearest public health establishment within 24 hours; section 102 covers admission on a magistrate's order; section 103 covers prisoners with mental illness. The Act abolished the old "reception orders" of the 1987 Act.
:::

:::recall
1. Which section covers independent admission? || Section 86 (with 85).
2. What is the maximum duration of a section 89 supported admission? || 30 days.
3. How often must capacity be reviewed during supported admission? || At least every seven days.
4. What is the time limit and one exclusion for section 94 emergency treatment? || Up to 72 hours (or until assessment); no ECT.
5. Where must police take a person with suspected mental illness found at risk? || The nearest public health establishment (section 100).
:::

:::mcq
Q: Admission of a minor under the MHCA is applied for by:
- The minor alone
- *The nominated representative (usually the guardian)
- The police
- The school
> Section 87.

Q: Which is NOT a criterion for supported admission under section 89?
- Recent threats or attempts of self-harm
- Recent violence or fear of violence towards others
- Recent inability to care for oneself with risk of harm
- *Disagreement with the family's choice of marriage partner
> Social disagreement is never a criterion.
:::

## 2.4 Prohibited and regulated treatments, restraint, research and suicide [core][beginner]
### Prohibited procedures (section 95)
For any person with mental illness, the following are **not allowed**:
- **ECT without muscle relaxants and anaesthesia** (so-called "direct" or unmodified ECT).
- **ECT for minors**, except when the treating psychiatrist thinks it necessary, with the guardian's informed consent and **prior permission of the Board**.
- **Sterilisation** of men or women as a treatment for mental illness.
- **Chaining** in any manner or form.

### Psychosurgery (section 96)
Allowed only with the person's **informed consent** and **approval of the Board**.

### Restraint and seclusion (section 97)
- **Seclusion and solitary confinement are prohibited.**
- **Physical restraint** only when it is the **only means** of preventing imminent harm to the person or others, authorised by the psychiatrist in charge, never as punishment, deterrent or because of staff shortage.
- Recorded immediately (method, reason, duration), with continuous supervision.
- The **nominated representative informed within 24 hours**; all instances in the monthly report to the Board.

### Research (section 99)
Research involving persons with mental illness needs their **free and informed consent**. If they cannot consent, research may proceed only with permission of the State Mental Health Authority (with conditions) and the consent of the nominated representative, and only if it is not possible to do with people who can consent, and is not against the person's interests (Section 3.4 covers research ethics in detail).


:::widget layers
{
 "title": "From banned to allowed: treatments under the MHCA",
 "shape": "stack",
 "layers": [
  {
   "label": "Prohibited",
   "detail": "ECT without anaesthesia and muscle relaxant; sterilisation as treatment; chaining; seclusion and solitary confinement."
  },
  {
   "label": "Only with special safeguards",
   "detail": "ECT for minors (necessity, guardian consent, Board permission); psychosurgery (consent plus Board approval); physical restraint as a last resort, recorded and reported."
  },
  {
   "label": "Usual care with informed consent",
   "detail": "Medicines, modified ECT for adults, psychological treatment."
  }
 ],
 "caption": "Place any treatment on the right layer before you use it."
}
:::

### Decriminalising suicide attempts (section 115)
- A person who attempts suicide is **presumed, unless proved otherwise, to have severe stress** and **shall not be tried or punished**.
- The government has a **duty** to provide care, treatment and rehabilitation to such a person, to reduce the risk of a repeat attempt.
- Under the new criminal law (BNS 2023), the old general offence of attempting suicide (IPC section 309) was **not carried forward**. BNS section 226 punishes only attempting suicide **to compel or restrain a public servant** from exercising lawful power.

:::widget sort
{
  "prompt": "Allowed, allowed only with special conditions, or prohibited under the MHCA?",
  "buckets": ["Allowed as usual care", "Only with special conditions", "Prohibited"],
  "items": [
    { "text": "Modified ECT under anaesthesia for an adult with consent", "bucket": 0 },
    { "text": "ECT without anaesthesia because the anaesthetist is unavailable", "bucket": 2 },
    { "text": "ECT for a 16-year-old with catatonia", "bucket": 1, "why": "Only if the psychiatrist considers it necessary, with guardian consent and the Board's prior permission." },
    { "text": "Chaining an agitated patient to a bed at a faith-healing site", "bucket": 2 },
    { "text": "Psychosurgery for severe refractory OCD", "bucket": 1 },
    { "text": "Placing a patient alone in a locked room for the night", "bucket": 2, "why": "Seclusion and solitary confinement are prohibited." },
    { "text": "Brief physical restraint to stop a patient stabbing a nurse, recorded and reported", "bucket": 1 }
  ]
}
:::

:::example Erwadi and why chaining is in the law
In 2001, a fire at a dargah-run "asylum" in Erwadi, Tamil Nadu, killed 28 people with mental illness who were chained and could not escape. The tragedy led to Supreme Court directions, inspections across India and, years later, the explicit ban on chaining in the MHCA. Chaining still occurs at some faith-healing sites; reporting it is a legal and ethical duty.
:::

:::clinician
Section 95 also forbids treating anyone with mental illness as part of an establishment's punishment and links to section 20's protection from cruel and degrading treatment. Modified ECT under the Act requires informed consent (or, during supported admission, NR consent within the treatment plan, subject to the advance directive). Data collection on restraint is weak in many Indian units; auditing restraint duration and frequency against section 97 is a straightforward quality project. Section 115(1) applies "notwithstanding anything in section 309 of the IPC", and the Supreme Court in several matters (for example the 2020 hearing on section 309's validity) noted the conflict; with the BNS replacing the IPC in 2024, attempted suicide is no longer a general offence, and police and hospitals should not register cases against survivors. Medico-legal case documentation of self-harm in emergency departments continues for injury and poisoning, but this is not a prosecution of the patient.
:::

:::recall
1. List the four prohibited procedures under section 95. || ECT without anaesthesia and muscle relaxants; ECT for minors (except with psychiatrist necessity, guardian consent and Board permission); sterilisation as treatment; chaining.
2. What does section 97 say about seclusion? || Seclusion and solitary confinement are prohibited.
3. Within how long must the NR be told of restraint? || 24 hours.
4. What does section 115 presume about a person who attempts suicide? || That they have severe stress, so they shall not be tried or punished.
5. What does BNS section 226 punish? || Attempting suicide to compel or restrain a public servant from exercising lawful power.
:::

:::mcq
Q: Under the MHCA, psychosurgery requires:
- Only the family's consent
- *The person's informed consent and the Board's approval
- A court order only
- Nothing special
> Section 96.

Q: A survivor of a suicide attempt in India today should be:
- Prosecuted under IPC 309
- *Offered care, treatment and rehabilitation, and not punished
- Detained in jail
- Fined
> MHCA section 115; BNS dropped the general offence.
:::

## 2.5 Confidentiality in depth: duty to protect, families and records [core][beginner]
### The duty to protect
In the famous US case **Tarasoff v. Regents of the University of California** (1976), a patient told his psychologist he intended to kill a young woman, Tatiana Tarasoff; he later did. The court held that when a therapist determines, or should determine, that a patient presents a serious danger of violence to another, the therapist has a **duty to use reasonable care to protect** the intended victim. "The protective privilege ends where the public peril begins."

India has no Tarasoff-type judgment, but **MHCA section 23** allows release of information where necessary to protect another person from harm or violence, and professional codes support protective action. Protective steps can include: intensifying treatment, admission, involving family, warning the person at risk, or informing the police, depending on the situation.

### A step-by-step approach when someone may be at risk
1. **Assess** the risk: is there a specific, identifiable person? A plan? Means? History of violence?
2. **Consult**: a senior colleague or supervisor, and document the consultation.
3. **Try to work with the patient**: can they agree to steps that reduce risk?
4. **Act proportionately**: disclose only what is needed to whom it is needed.
5. **Document** your reasoning, actions and the information shared.

:::widget decide
{
  "scene": "In a session in Jaipur, Mohit, 32, angry after a property dispute, says: 'I have a country-made pistol. If my cousin doesn't sign the papers by Sunday, I'll finish him.' He is not psychotic; he has a past assault conviction.",
  "ask": "What should the psychologist do?",
  "choices": [
    { "label": "Keep it confidential; he is just venting", "verdict": "harm", "outcome": "On Sunday he shoots his cousin.", "why": "A specific threat, an identified victim, available means, a deadline and a history of violence indicate serious risk. Confidentiality yields to protection of life." },
    { "label": "Explore the threat and risk factors, seek urgent consultation, try to engage Mohit in safety steps (surrendering the weapon, a cooling-off plan), and if risk remains serious take protective action such as informing the police or warning the cousin, disclosing only what is necessary, and document everything", "verdict": "best", "outcome": "Mohit refuses to give up the gun; police are informed; the weapon is seized; no one is hurt.", "why": "A structured, proportionate response that tries collaboration first and acts decisively when risk is high." },
    { "label": "End therapy immediately to avoid liability", "verdict": "harm", "outcome": "The risk remains and you have lost your influence.", "why": "Abandoning the patient neither protects the cousin nor helps Mohit." }
  ]
}
:::


:::widget flow
{
 "title": "Five steps when someone may be in danger",
 "layout": "chain",
 "nodes": [
  {
   "id": "a",
   "label": "Assess",
   "detail": "Specific victim? Plan? Means? Deadline? History of violence?"
  },
  {
   "id": "c",
   "label": "Consult",
   "detail": "A senior or supervisor, and write it down."
  },
  {
   "id": "w",
   "label": "Work with the patient",
   "detail": "Can they agree to steps that reduce risk, such as giving up a weapon?"
  },
  {
   "id": "p",
   "label": "Act proportionately",
   "detail": "Intensify care, involve family, warn the person at risk or inform police, sharing only what is needed."
  },
  {
   "id": "d",
   "label": "Document",
   "detail": "Reasoning, actions, what was shared and with whom."
  }
 ],
 "caption": "This is how the duty to protect is met in practice, within MHCA section 23."
}
:::

### Families, couples and children
- **Families**: in India, families often expect to be told everything. With an adult patient, you need **consent** to share; you can still **listen** to the family and give general information about the illness without disclosing personal details.
- **Couples therapy**: agree at the start how "secrets" will be handled.
- **Children and adolescents**: parents have rights to information about their child's care, but adolescents need privacy to talk openly. Agree at the start: "What you tell me stays private unless I am worried about your safety or someone else's."

### Special situations
- **HIV status**: the patient's consent is needed to share; partner notification is encouraged through counselling, and the HIV and AIDS (Prevention and Control) Act 2017 allows limited disclosure by a healthcare provider to a partner at significant risk under defined conditions.
- **Court requests**: a court order can require disclosure; you may request that only relevant parts are disclosed.
- **Employers and schools**: only with consent and only what is needed (for example "fit to return to work with adjustments", not the diagnosis).
- **Research and teaching**: de-identify; get consent for case presentations where the person could be recognised.

:::clinician
Tarasoff I (1974) established a duty to warn; Tarasoff II (1976) broadened it to a duty to protect. US states vary between mandatory, permissive and no duty statutes. In India, the absence of statute or case law on a duty to protect leaves clinicians relying on MHCA section 23 exceptions, professional codes and general negligence principles; document the reasoning in terms of serious, foreseeable and imminent risk to an identifiable person. The HIV and AIDS (Prevention and Control) Act 2017 permits disclosure to a partner only where the healthcare provider reasonably believes the partner is at significant risk, the person has been counselled to inform the partner and has not, and with prior notice to the person. Electronic records and the DPDP Act raise new issues: minimum necessary access, audit trails, consent for data sharing, and the risk of mental health data being exposed in shared hospital systems. For psychotherapy notes, write as if the patient may request them (section 25 gives the right to access).
:::

:::recall
1. What did Tarasoff (1976) establish? || A duty to use reasonable care to protect an identifiable person from serious danger posed by a patient.
2. What MHCA provision supports protective disclosure in India? || Section 23, which allows release to protect another person from harm or violence.
3. List the five steps when someone may be at risk. || Assess, consult, work with the patient, act proportionately, document.
4. How should an employer's request for information be handled? || Only with consent, and share only what is needed (such as fitness to work).
:::

:::mcq
Q: The phrase "The protective privilege ends where the public peril begins" comes from:
- The MHCA 2017
- *Tarasoff v. Regents of the University of California
- The Belmont Report
- Puttaswamy v. Union of India
> The 1976 US case.

Q: A parent of an adult patient demands to know everything said in therapy. The clinician should:
- Tell them everything
- *Explain that the adult's consent is needed, listen to the parent's concerns, and give general information about the illness
- Refuse to meet the parent
- End therapy
> Confidentiality with compassion.
:::

## 2.6 Professional regulation: RCI, training routes and codes of ethics [core][beginner]
### The Rehabilitation Council of India
The **RCI Act 1992** set up the Rehabilitation Council of India to regulate the **training** and **registration** of rehabilitation professionals, including **clinical psychologists**, **rehabilitation psychologists**, special educators and others.
- RCI approves courses and institutions, sets syllabi, and maintains the **Central Rehabilitation Register (CRR)**.
- **Section 13**: only registered persons may practise as rehabilitation professionals (including clinical psychologists) and hold such posts; practising without registration is an offence punishable with imprisonment, fine or both.
- Registration must be renewed periodically, with continuing education (Continuing Rehabilitation Education, CRE).

### The training route to becoming a clinical psychologist (as of Nov 2026)
- The traditional route was the two-year **MPhil in Clinical Psychology**, after an MA or MSc in psychology.
- Following the National Education Policy 2020, which discontinued MPhil degrees, RCI moved this training to a two-year **MA in Clinical Psychology**, with admission usually after a four-year undergraduate psychology degree (or a three-year degree plus bridging requirements).
- On **3 May 2026**, an RCI office memorandum changed the nomenclature: the MA Clinical Psychology became the **Master in Clinical Psychology (M.Clin.Psy)**, the MA Rehabilitation Psychology became the **Master in Rehabilitation Psychology (M.Rehab.Psy)**, and the BSc courses became the **Bachelor in Clinical Psychology (B.Clin.Psy)** and **Bachelor in Rehabilitation Psychology (B.Rehab.Psy)**, effective from the start of these courses.
- RCI also recognises a **professional doctorate, the PsyD in Clinical Psychology**, offered at a few institutions, which leads to registration as a clinical psychologist.
- A one-year **Professional Diploma in Clinical Psychology (PDCP)** exists at some institutions, with a more limited registration category; check the current RCI rules.
- Practising clinicians trained through the MPhil route remain registered.

:::trap Not every psychologist is a "clinical psychologist"
An MA in psychology, a counselling diploma, or an online certificate does **not** make someone a clinical psychologist in India. Only RCI-registered professionals with the recognised qualification may use the title and do work reserved to them, such as clinical diagnostic assessment and certification. Counselling psychologists and others work within their competence and are not currently registered by RCI.
:::


:::widget flow
{
 "title": "Routes to becoming a clinical psychologist in India",
 "layout": "tree",
 "nodes": [
  {
   "id": "u",
   "label": "Undergraduate psychology"
  },
  {
   "id": "b",
   "label": "Four-year BA or BSc in psychology (or BSc Clinical Psychology, now B.Clin.Psy)",
   "parent": "u"
  },
  {
   "id": "m",
   "label": "Master in Clinical Psychology (M.Clin.Psy), two years, RCI-recognised",
   "parent": "b",
   "detail": "Formerly the MA Clinical Psychology, which replaced the MPhil Clinical Psychology after the National Education Policy 2020; renamed by RCI on 3 May 2026."
  },
  {
   "id": "pg",
   "label": "Postgraduate psychology (MA or MSc)",
   "parent": "u"
  },
  {
   "id": "psyd",
   "label": "PsyD in Clinical Psychology, RCI-recognised",
   "parent": "pg",
   "detail": "A professional doctorate at a few institutions."
  },
  {
   "id": "r",
   "label": "RCI registration (CRR number)",
   "parent": "m",
   "detail": "Required to practise as and be called a clinical psychologist; renewed with continuing education."
  }
 ],
 "caption": "Older clinicians trained through the MPhil route remain registered. Check RCI notices for the latest rules."
}
:::

### Codes of ethics you should know
**APA Ethical Principles of Psychologists and Code of Conduct** (2002, amended 2010 and 2016), widely used as a model:
- **Five general principles** (aspirational): A. Beneficence and Non-maleficence; B. Fidelity and Responsibility; C. Integrity; D. Justice; E. Respect for People's Rights and Dignity.
- **Ten standards** (enforceable): 1 Resolving ethical issues; 2 Competence; 3 Human relations; 4 Privacy and confidentiality; 5 Advertising and public statements; 6 Record keeping and fees; 7 Education and training; 8 Research and publication; 9 Assessment; 10 Therapy.

**RCI code of ethics** for registered professionals covers, in similar terms: competence and staying within one's training, consent, confidentiality, non-exploitation, honesty in advertising and fees, respect for rights and dignity of persons with disabilities, non-discrimination, maintaining records, continuing education, and reporting misconduct. The **Indian Association of Clinical Psychologists (IACP)** has its own ethics guidelines.

:::mnemonic APA principles: "Be Fair In Judging Respectfully"
**B**eneficence and non-maleficence, **F**idelity and responsibility, **I**ntegrity, **J**ustice, **R**espect for rights and dignity.
:::

:::widget decide
{
  "scene": "A popular wellness influencer in Mumbai with an online counselling certificate advertises 'clinical psychologist sessions, diagnosis and IQ testing' on Instagram. A worried client asks you whether this is allowed.",
  "ask": "What is the accurate answer?",
  "choices": [
    { "label": "Yes, anyone can call themselves a clinical psychologist in India", "verdict": "harm", "outcome": "The client pays for an 'IQ certificate' that a school board rejects.", "why": "The title and reserved clinical work require RCI registration under the RCI Act." },
    { "label": "No; using the title 'clinical psychologist' and doing clinical diagnostic work require RCI registration; you can check the Central Rehabilitation Register, and misrepresentation can be reported to RCI", "verdict": "best", "outcome": "The client checks the register, finds no entry, and chooses a registered professional.", "why": "This is accurate and empowers the client to verify." },
    { "label": "It depends on how many followers they have", "verdict": "harm", "outcome": "Misinformation.", "why": "Registration, not popularity, determines who may practise." }
  ]
}
:::

:::clinician
The RCI Act was amended in 2000 to strengthen registration provisions. Section 13(3) provides penalties for practising without registration. The National Commission for Allied and Healthcare Professions Act 2021 (NCAHP) lists behavioural health sciences professionals (including psychologists other than those under RCI, such as counselling psychologists) among allied health professions; its implementation, state councils and registers remain in progress as of Nov 2026, and the boundary between RCI and NCAHP jurisdictions has been debated. The MHCA definition of a clinical psychologist (in section 2) refers to RCI registration with a recognised MPhil or equivalent; the renaming to M.Clin.Psy does not change the requirement for RCI registration. APA has been revising its Ethics Code; check whether a revised version has been adopted before citing standard numbers in a publication. Ethical misconduct by registered professionals can be reported to RCI, which can remove names from the register after inquiry.
:::

:::recall
1. Which section of the RCI Act restricts practice to registered persons? || Section 13.
2. What did RCI rename on 3 May 2026? || MA Clinical Psychology to Master in Clinical Psychology (M.Clin.Psy); MA Rehabilitation Psychology to M.Rehab.Psy; BSc courses to B.Clin.Psy and B.Rehab.Psy.
3. Name the five APA general principles. || Beneficence and non-maleficence, fidelity and responsibility, integrity, justice, respect for people's rights and dignity.
4. How many enforceable standards does the APA code have? || Ten.
:::

:::mcq
Q: Which APA standard covers testing?
- Standard 4
- Standard 8
- *Standard 9
- Standard 10
> Standard 9: Assessment.

Q: The register of rehabilitation professionals maintained by RCI is called the:
- National Medical Register
- *Central Rehabilitation Register
- Mental Health Review Board list
- State Mental Health Authority roll
> CRR.
:::

## 2.7 Level check · Beginner [core][beginner]
Score 80% or more to open the Advanced level.

:::mcq
Q: The MHCA 2017 came into force on:
- 1 July 2024
- *29 May 2018
- 15 August 2017
- 1 January 2020
> 29 May 2018.

Q: Under section 3, mental illness may NOT be determined on the basis of:
- ICD criteria
- *Non-conformity with social or religious values
- A psychiatric interview
- Accepted medical standards
> Non-conformity is never grounds.

Q: Insurance parity for mental illness is in section:
- 18
- *21(4)
- 23
- 115
> Equality and non-discrimination.

Q: An advance directive applies when:
- The person has capacity
- *The person lacks capacity
- In every emergency
- The family wants it to
> Only when capacity is lost; not in section 94 emergencies.

Q: Disagreement with a valid advance directive is decided by:
- The family
- The police
- *The Mental Health Review Board
- The treating nurse
> The Board reviews.

Q: Independent admission requires:
- Family signature
- *The person's own capacity and free request
- A court order
- Police escort
> Section 86.

Q: Supported admission under section 89 lasts up to:
- 72 hours
- 7 days
- *30 days
- 180 days
> Up to 30 days.

Q: Emergency treatment under section 94 may NOT include:
- Sedation to prevent serious harm
- Transport to a hospital
- *ECT
- Fluids for dehydration
> ECT is excluded.

Q: Which is prohibited under section 95?
- Modified ECT with anaesthesia in adults
- *Chaining
- Antipsychotic medicine
- Psychotherapy
> Chaining in any form.

Q: Seclusion of a patient in a locked room is:
- Allowed for up to 24 hours
- *Prohibited under the MHCA
- Allowed with family consent
- Allowed for punishment
> Section 97.

Q: A person who attempts suicide, under section 115, is presumed to have:
- Committed a crime
- *Severe stress, and shall not be tried or punished
- A personality disorder
- No need for care
> Decriminalisation with a duty of care.

Q: Tarasoff established a duty to:
- Keep all information secret
- *Protect an identifiable person from serious danger posed by a patient
- Report all crimes
- Warn the media
> Duty to protect.

Q: Before sharing information to protect someone, the clinician should ideally:
- Post it online
- *Assess risk, consult, try to work with the patient, act proportionately and document
- Tell everyone in the family
- Do nothing
> Structured, proportionate response.

Q: Practising as a clinical psychologist without RCI registration is:
- Permitted with a counselling diploma
- *An offence under the RCI Act
- Permitted if supervised by a friend
- Regulated by the MHCA only
> Section 13 of the RCI Act.

Q: As of May 2026, the RCI name for the master's training course in clinical psychology is:
- MPhil Clinical Psychology
- *Master in Clinical Psychology (M.Clin.Psy)
- MSc Counselling
- PDCP
> Renamed by RCI memorandum of 3 May 2026.
:::
`;
