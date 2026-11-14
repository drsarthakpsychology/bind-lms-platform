import type { LongQA } from "@/lib/prep/long-types";
import { anchored, chain, compare, layers, tree, vis } from "./visual";

const S = "ethics-law" as const;

export const ETHICS_LAW_L03: LongQA[] = anchored([
  {
    id: "eth-l03-001",
    subject: S,
    topic: "tarasoff",
    marks: 15,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance", "ugc-net", "ma-semester"],
    question: "What is the duty to warn and protect? Discuss the Tarasoff decisions and the legal and ethical position of a psychologist in India whose client threatens to harm someone.",
    plan: ["Confidentiality and its limits", "The Tarasoff case and its two rulings", "Spread and criticism of the duty", "The Indian position", "Practical steps with an example"],
    answer: `## Confidentiality is not absolute
Confidentiality is the foundation of therapy: clients disclose shameful thoughts only if they trust that what they say stays in the room. Yet every ethics code and most laws accept that confidentiality must give way when a life is at serious risk. The duty to warn and protect describes the obligation of a therapist to act when a client poses a serious danger of violence to an identifiable person.

## The Tarasoff case
In 1969, Prosenjit Poddar, a graduate student at the University of California, Berkeley, told his university psychologist that he intended to kill Tatiana Tarasoff, a woman who had rejected him. The psychologist informed the campus police, who briefly detained Poddar and released him. No one warned Tatiana or her family. Two months later Poddar killed her. Her parents sued.
- In 1974 the Supreme Court of California held that a therapist has a duty to warn a person who is the target of a client's threat.
- In 1976, on rehearing, the court broadened this to a duty to protect: when a therapist determines, or should determine by professional standards, that a patient presents a serious danger of violence to another, the therapist must use reasonable care to protect the intended victim. Warning is one way; others include notifying police or arranging admission. The court's line was that the protective privilege ends where the public peril begins.

## Spread and criticism
- Most American states now have statutes or rulings: some make the duty mandatory, some permit disclosure without requiring it, and a few have no duty.
- Critics argued that it would deter dangerous clients from seeking help, push therapists to over warn, and ask clinicians to predict violence, which they do only modestly better than chance in the long term.
- Supporters argued that protecting life outweighs privacy, and research has not shown that the duty emptied clinics.

## The Indian position
- No Indian court has laid down a Tarasoff type duty, and no statute creates a specific duty to warn.
- Section 23 of the Mental Healthcare Act 2017 allows release of information about a person with mental illness where necessary to protect another person from harm or violence, and as necessary to protect against a clear and present danger to life.
- The constitutional right to privacy recognised in 2017 is not absolute and can yield to a legitimate aim such as protecting life.
- Professional codes, including those followed by RCI registered professionals and the APA code widely taught in India, permit disclosure to protect others.
- Clinicians could face claims in negligence if they ignored a clear, serious threat that was then carried out.
- Separate statutory duties override confidentiality, such as mandatory reporting of child sexual abuse under POCSO.

## What to do in practice
1. Assess the threat: is there a named or identifiable victim, a plan, means, past violence, intoxication, psychosis or command hallucinations?
2. Consider less intrusive steps first: intensify treatment, involve the client in safety planning, remove weapons, admit if criteria are met.
3. If risk is serious and imminent, disclose only what is needed to those who can protect: the potential victim, police or the treating team.
4. Consult a senior colleague and document the risk assessment, options considered and reasons.
5. Tell clients at the start of therapy about the limits of confidentiality, so that disclosure is not a betrayal.

## Example
Rahul, 28, in therapy in Lucknow for anger after his divorce, says he has bought a knife and will "finish" his former wife when she visits her parents on Sunday. He has a history of assault. The psychologist explores the threat, finds it specific and serious, informs Rahul of the need to act, contacts the local police and warns the woman through a safe channel, and arranges an urgent psychiatric review. Each step is recorded.

## Conclusion
Tarasoff established that confidentiality ends where serious danger to another begins. In India the same principle is supported by section 23 of the MHCA and by professional ethics, applied through careful assessment, the least intrusive effective step and good documentation.`,
    keyPoints: ["Facts of Tarasoff and the two rulings, 1974 warn and 1976 protect", "Duty triggered by serious danger to an identifiable victim", "Range of protective actions beyond warning", "Criticisms: deterrence, over warning, poor prediction", "No Indian Tarasoff judgment or statute", "MHCA section 23 allows protective disclosure", "Assess, least intrusive step, disclose minimum, consult, document", "Inform clients of limits at the outset"],
    pitfalls: ["Saying India has a Tarasoff statute", "Treating any vague anger as triggering a warning", "Forgetting documentation and consultation"],
    module: "ethics-law/2-5",
    visuals: [
      chain("What to do in practice", [["Assess the threat", "Victim, plan, means, history, illness"], ["Less intrusive steps", "Treatment, safety plan, admission"], ["Protective disclosure", "Victim, police or team, minimum needed"], ["Consult and document", "Reasons for every step"]]),
      compare("Spread and criticism", ["For the duty", ["Life outweighs privacy", "Victims can take steps", "Clinics did not empty"], "Protects third parties"], ["Against the duty", ["May deter dangerous clients", "Pushes over warning", "Violence is hard to predict"], "Threatens the therapy bond"]),
    ],
    ref: "Tarasoff v Regents of the University of California, 13 Cal 3d 177 (1974), 17 Cal 3d 425 (1976); MHCA 2017 s 23; Puttaswamy 2017; ethics-law module 2.5",
  },
  {
    id: "eth-l03-002",
    subject: S,
    topic: "informed-consent",
    marks: 10,
    difficulty: 2,
    exams: ["mcp-entrance", "ugc-net", "ma-semester", "md-psychiatry"],
    question: "What are the elements of valid informed consent in psychological practice? Discuss consent for therapy, assessment and with children, with Indian examples.",
    plan: ["Definition and history", "Four elements", "Consent for therapy and assessment", "Children and adolescents", "Common problems in India"],
    answer: `## What informed consent is
Informed consent is a person's voluntary agreement to an intervention, given after understanding what it involves. It grew from the Nuremberg trials of 1947, which condemned medical experiments on prisoners, and from later cases establishing that adults have the right to decide what is done to them. The Mental Healthcare Act 2017 defines informed consent as consent given without force, undue influence, fraud, threat, mistake or misrepresentation, after disclosure of adequate information in a manner the person understands.

## The four elements
1. Disclosure: the nature and purpose of the intervention, likely benefits, risks, alternatives including no treatment, likely duration and fees, and limits of confidentiality.
2. Understanding: information given in the person's language and at their level, with checking that it has been understood.
3. Capacity: the person can understand, appreciate consequences and communicate a choice, as in section 4 of the MHCA.
4. Voluntariness: free of coercion, threats or pressure, including subtle family or institutional pressure.

## Consent for therapy
- Explain the approach, number and length of sessions, what is expected of the client, possible discomfort, fees and cancellation, and the limits of confidentiality.
- Consent is a process, not a one time signature; revisit it if the plan changes.
- Clients may withdraw at any time without penalty.
- In couple or family therapy, explain how secrets will be handled.

## Consent for assessment
- Explain the purpose of testing, who will see the report and how results will be used.
- When testing is ordered by a court or employer, clarify that the client is not the only party who will receive the results.
- Feedback should be offered in plain words.

## Children and adolescents
- Legal consent comes from parents or guardians for those under 18.
- The child's assent should be sought in age appropriate language, and their views given weight as they mature.
- Confidentiality for adolescents is negotiated at the start: what will be shared with parents, and what must be disclosed, such as serious risk or abuse under POCSO.

## Problems common in India
- Consent forms in English given to clients who read Hindi, Tamil or Marathi.
- Family members answering on behalf of adults with capacity, especially women and older adults.
- Clients bringing a relative who insists on knowing everything.
- Signing forms without explanation in busy outpatient departments.

## Example
A 35 year old woman in Jaipur is brought by her husband for counselling. The psychologist meets her alone, explains in Hindi the process and confidentiality, checks her understanding, and asks whether she wishes to proceed. Only then is the husband invited into a joint session with her agreement.

## Conclusion
Valid consent rests on disclosure, understanding, capacity and voluntariness, and is an ongoing conversation rather than a form.`,
    keyPoints: ["Definition and MHCA wording", "Four elements: disclosure, understanding, capacity, voluntariness", "Content of disclosure including confidentiality limits and fees", "Consent as an ongoing process", "Third party assessments and who gets results", "Parental consent and child assent", "Indian problems: language, family proxy decisions"],
    pitfalls: ["Equating a signature with consent", "Leaving out capacity", "Ignoring the child's assent"],
    module: "ethics-law/1-2",
    visuals: [layers("The four elements", "stack", [["Disclosure", "Nature, benefits, risks, alternatives, fees, confidentiality limits"], ["Understanding", "In the person's language, checked"], ["Capacity", "Understand, appreciate, communicate"], ["Voluntariness", "No force, threat or undue family pressure"]])],
    ref: "Nuremberg Code 1947; MHCA 2017 s 2(1)(i), s 4; APA Ethics Code standards 3.10, 9.03, 10.01; ethics-law module 1.2",
  },
  {
    id: "eth-l03-003",
    subject: S,
    topic: "ethics-principles",
    marks: 15,
    difficulty: 2,
    exams: ["mcp-entrance", "ugc-net", "ma-semester", "md-psychiatry"],
    question: "Describe the four principles of biomedical ethics and the general principles of the APA ethics code. Apply them to a clinical dilemma in an Indian setting.",
    plan: ["Why principles are needed", "The four principles", "APA general principles", "Conflicts between principles", "Worked Indian dilemma"],
    answer: `## Why principles
Clinical work raises questions that rules alone cannot settle. Principles give a shared language for weighing duties. In 1979 Tom Beauchamp and James Childress set out four principles that are now used across medicine and psychology, and the American Psychological Association's code adds five general principles for psychologists.

## The four principles
1. Respect for autonomy: honour the informed choices of people with capacity, give them information and support their decisions. Example: accepting that a woman with capacity refuses medication after hearing the risks.
2. Beneficence: act for the benefit of the person, by providing effective treatment and promoting wellbeing. Example: offering evidence based therapy rather than an untested method one prefers.
3. Non maleficence: do no harm, avoiding harmful treatments, exploitation and practice beyond competence. Example: not using a projective test alone to make a high stakes diagnosis.
4. Justice: fair distribution of benefits, risks and resources, and non discrimination. Example: offering the same quality of care to a patient from a Dalit or tribal background as to any other.

## The APA general principles
| Principle | Meaning |
| Beneficence and non maleficence | Benefit those served and avoid harm |
| Fidelity and responsibility | Trust, keeping commitments, accepting responsibility |
| Integrity | Accuracy, honesty and truthfulness |
| Justice | Fair access to and benefit from psychology |
| Respect for rights and dignity | Privacy, self determination and respect for cultural differences |
These are aspirational. The code's enforceable standards, grouped into ten sections such as competence, privacy, assessment and therapy, translate them into rules.

## When principles conflict
- Autonomy against beneficence: a person refuses treatment that would help.
- Confidentiality against non maleficence to others: a client threatens a third person.
- Justice against beneficence: limited sessions in a public clinic must be shared.
No principle always wins. The clinician weighs the situation, looks for options that honour more than one, and justifies the choice.

## A worked dilemma
Meera, 24, an engineering graduate in Chennai, has moderate depression. Her parents, who pay for therapy, call the psychologist weekly asking for details and insist she be told to accept an arranged marriage that she is unsure about.
- Autonomy: Meera is an adult with capacity. Decisions about marriage and what is disclosed are hers.
- Beneficence: she may benefit from family involvement and support.
- Non maleficence: sharing private material without consent could damage trust and worsen her depression.
- Fidelity: the psychologist's duty is to Meera, the client, not to those who pay.
- Respect for dignity: the family's cultural values deserve respect, without letting them override her rights.
- Justice: her gender should not reduce her say in her life.
Resolution: the psychologist explains to the parents that details cannot be shared without Meera's consent, offers a family session if Meera agrees, and helps Meera think through her own choices without imposing the therapist's values in either direction. The reasoning is documented.

## Using the principles with Indian law
The principles also run through Indian law. The Mental Healthcare Act 2017 builds autonomy into section 4 on capacity and into advance directives, non maleficence into the bans on unmodified ECT and chaining, beneficence into the right to access care, and justice into the right to equality and free treatment for people below the poverty line. Knowing this link helps a student answer both ethics and law questions in one frame.

## Criticism
Principlism has been criticised as too abstract and Western, giving too much weight to individual autonomy over family and community, which matter greatly in India. Defenders reply that the principles can be applied in a culturally sensitive way, as in the example, where the family is involved with the client's consent.

## Conclusion
The four principles and the APA general principles give a framework for thinking. Good ethical practice lies in applying them to real situations, weighing conflicts openly and documenting the reasons.`,
    keyPoints: ["Autonomy, beneficence, non maleficence, justice with examples", "APA five general principles", "Aspirational principles versus enforceable standards", "Conflicts between principles", "Worked Indian case with each principle applied", "Client, not payer, is owed fidelity", "Cultural critique of principlism"],
    pitfalls: ["Listing principles without applying them", "Assuming autonomy always wins", "Ignoring culture"],
    module: "ethics-law/1-1",
    visuals: [
      tree("The four principles", [["Biomedical ethics", "Four principles", -1], ["Autonomy", "Respect informed choices", 0], ["Beneficence", "Act for the person's good", 0], ["Non maleficence", "Do no harm", 0], ["Justice", "Fairness and equal care", 0]]),
      vis("decide", { scene: "Meera's father calls asking what she said in her last session about the marriage proposal. He reminds you that he is paying.", ask: "What is the best response?", choices: [{ label: "Tell him briefly, since he pays", verdict: "harm", outcome: "Meera stops trusting therapy and drops out.", why: "Fidelity and confidentiality are owed to the client, not the payer." }, { label: "Explain that you cannot share without Meera's consent, and offer a family session if she agrees", verdict: "best", outcome: "Meera agrees to a joint session later.", why: "Respects autonomy while allowing family involvement." }, { label: "Hang up and refuse further contact", verdict: "ok", outcome: "The family feels insulted and may withdraw support.", why: "Confidentiality is kept, but the chance of a helpful family role is lost." }] }, "A worked dilemma"),
    ],
    ref: "Beauchamp and Childress, Principles of Biomedical Ethics 1979; APA Ethics Code 2002 amended 2010 and 2016, General Principles A to E; ethics-law module 1.1",
  },
  {
    id: "eth-l03-004",
    subject: S,
    topic: "rci-act",
    marks: 15,
    difficulty: 3,
    exams: ["mcp-entrance", "ugc-net", "ma-semester"],
    question: "Describe the Rehabilitation Council of India Act 1992 with reference to the constitution and functions of the Council, the Central Rehabilitation Register and the regulation of clinical psychologists.",
    plan: ["Origins and purpose", "Constitution of the Council", "Functions", "Register and section 13", "Clinical psychology training and current issues"],
    answer: `## Origins
The Rehabilitation Council of India began in 1986 as a registered society and became a statutory body through the Rehabilitation Council of India Act 1992, which came into force in 1993. The Act was amended in 2000 to strengthen it. The Council works under the Ministry of Social Justice and Empowerment, through the Department of Empowerment of Persons with Disabilities, and regulates the training and practice of rehabilitation professionals, including clinical psychologists and rehabilitation psychologists.

## Constitution
The Council has a chairperson and members drawn from government departments, experts in rehabilitation, special education and medicine, representatives of disability organisations and of professionals, and a member secretary. Members are appointed by the central government for fixed terms.

## Functions
1. Regulate training policies and programmes for rehabilitation and special education.
2. Prescribe minimum standards of education and training, including syllabus, duration, intake and faculty.
3. Recognise institutions and qualifications, which are listed in the Schedule to the Act, and inspect them; recognition can be withdrawn.
4. Maintain the Central Rehabilitation Register of qualified professionals.
5. Promote research in rehabilitation and special education.
6. Encourage continuing rehabilitation education through programmes and points for renewal.
7. Prescribe standards of professional conduct and ethics and take action for misconduct.

## The register and section 13
- A person holding a recognised qualification in the Schedule is entitled to enrolment on the Central Rehabilitation Register.
- Under section 13, only a registered rehabilitation professional may hold such an office in government or local authority institutions, practise as a rehabilitation professional anywhere in India, sign certificates that the law requires from such a professional, or give expert evidence on disability matters in court.
- Section 13(3) makes practising in contravention punishable with imprisonment up to one year, a fine up to 1,000 rupees, or both.
- Registration must be renewed periodically, with continuing education points.
- The Council can remove a name from the register for professional misconduct after inquiry.

## Clinical psychologists
- The MHCA 2017 defines a clinical psychologist as a person with a recognised qualification in clinical psychology who is registered with the Council. Only such a person can act as a clinical psychologist for MHCA purposes, such as examinations for supported admission.
- The traditional route was the two year MPhil in Clinical Psychology after a master's in psychology. After the National Education Policy 2020 discontinued the MPhil, the Council approved a two year professional master's in clinical psychology, which an office memorandum of 3 May 2026 renamed the Master in Clinical Psychology. A PsyD route also exists.
- Professional diplomas and rehabilitation psychology courses lead to other registered roles.

## Current issues
- The National Commission for Allied and Healthcare Professions Act 2021 lists behavioural health professionals, including psychologists outside the Council's scope such as counselling psychologists, among allied health professions. How the two regulators divide work is still being settled.
- Many people with no registered qualification advertise as psychologists online; the register allows the public to check.
- Training seats are few compared with the need for clinical psychologists in India.

## Why registration matters to the public
A client cannot easily judge whether a person calling themselves a psychologist is trained. The register lets anyone check a name and registration number. Registered professionals are bound by the Council's code of conduct, which covers competence, consent, confidentiality, honesty in advertising and fees, and non exploitation, and complaints can be made to the Council. An unregistered person faces no such check.

## Conclusion
The RCI Act gives clinical psychology in India its legal identity: recognised training, a public register, a protected scope of practice under section 13 and ethical oversight. Its link with the MHCA makes registration essential for clinical work.`,
    keyPoints: ["Society 1986, Act 1992, amended 2000; Ministry of Social Justice and Empowerment", "Constitution of the Council", "Functions: standards, recognition, register, research, continuing education, ethics", "Section 13 protected practice and section 13(3) penalty", "Renewal with continuing education points", "MHCA definition of clinical psychologist needs RCI registration", "MPhil, then professional master's renamed M.Clin.Psy on 3 May 2026", "NCAHP Act 2021 and overlapping regulation"],
    pitfalls: ["Placing the Council under the Health Ministry", "Wrong penalty amounts", "Forgetting the MHCA link"],
    module: "ethics-law/2-6",
    visuals: [
      vis("timeline", { prompt: "Put the history of RCI regulation in order", events: [{ label: "RCI set up as a society", when: "1986" }, { label: "RCI Act passed", when: "1992" }, { label: "Act amended", when: "2000" }, { label: "MHCA ties the clinical psychologist to RCI registration", when: "2017" }, { label: "NCAHP Act for allied health professions", when: "2021" }, { label: "Course renamed Master in Clinical Psychology", when: "May 2026" }], why: "From a society to a statutory regulator whose register the mental health law relies on." }),
      chain("The register and section 13", [["Recognised qualification", "Listed in the Schedule"], ["Enrol on the register", "Central Rehabilitation Register"], ["Protected practice", "Office, practice, certificates, expert evidence"], ["Renewal", "With continuing education"], ["Misconduct", "Name can be removed"]]),
    ],
    ref: "RCI Act 1992 (34 of 1992) ss 3, 11, 13, 19, amended 2000; advocatekhoj bare act s 13 checked Nov 2026; MHCA 2017 s 2(1)(g); RCI OM 3 May 2026; NCAHP Act 2021; ethics-law module 2.6",
  },
  {
    id: "eth-l03-005",
    subject: S,
    topic: "boundaries",
    marks: 10,
    difficulty: 3,
    exams: ["mcp-entrance", "ma-semester", "md-psychiatry"],
    question: "Distinguish boundary crossings from boundary violations in psychotherapy. Discuss dual relationships, gifts and the slippery slope, with reference to the Indian context.",
    plan: ["What boundaries are", "Crossings versus violations", "Dual relationships", "Gifts and touch", "Indian context and safeguards"],
    answer: `## What boundaries are
Boundaries are the limits that define the therapeutic relationship: time, place, money, physical contact, self disclosure, gifts and the roles of therapist and client. They protect the client from exploitation and make the relationship safe enough for therapy.

## Crossings and violations
| | Boundary crossing | Boundary violation |
| Meaning | A departure from usual practice | A departure that harms or exploits the client |
| Effect | Neutral or helpful | Harmful |
| Example | Attending a client's graduation at her request | Borrowing money from a client |
| Discussed in therapy | Usually yes | Usually hidden |
The distinction comes from Thomas Gutheil and Glen Gabbard. Crossings are not always wrong; some, like a brief hug at a final session in a culture where this is normal, can strengthen therapy. The danger is a slippery slope: small crossings, each harmless alone, such as longer sessions, personal texts and meetings outside, gradually lead to violations, most seriously sexual contact.

## Dual relationships
A dual or multiple relationship exists when the therapist has another role with the client, such as friend, employer, teacher, business partner or relative. The APA code does not ban all of them: it prohibits those that could reasonably impair objectivity or risk exploitation. Sexual relationships with current clients are always prohibited, and with former clients for at least two years after therapy ends and, even then, only in the most unusual circumstances.

## Gifts and touch
- Small gifts at festivals, such as sweets at Diwali or Eid, may be culturally appropriate and refusing them may offend.
- Costly gifts, cash, or gifts that seem to buy favour should be declined kindly and discussed.
- Touch should be rare, culturally sensitive and always for the client's benefit, never the therapist's.

## Indian context
- In small towns, the therapist may meet clients at temples, weddings or markets; dual relationships are sometimes unavoidable.
- Clients may call the therapist didi or bhaiya, inviting a family like relationship.
- Families may expect home visits or personal phone access.
- Students may be referred by colleagues or relatives for therapy, creating role conflicts.

## Safeguards
1. Ask: whose need does this crossing meet?
2. Discuss crossings openly with the client and in supervision.
3. Document the reasons.
4. Avoid secrecy, which signals a violation.
5. Refer when a relationship cannot be kept professional.

## Conclusion
Not every crossing is harmful, but every violation begins somewhere. Awareness, supervision and documentation keep crossings safe.`,
    keyPoints: ["Definition of boundaries", "Crossing neutral or helpful; violation harmful", "Slippery slope", "Dual relationships banned only if they impair objectivity or exploit", "Sexual contact with current clients always banned; two years with former clients", "Gifts judged by value, timing and culture", "Indian realities of small communities", "Supervision and documentation"],
    pitfalls: ["Calling every crossing unethical", "Not giving Indian examples"],
    module: "ethics-law/1-4",
    visuals: [vis("sort", { prompt: "Sort each event.", buckets: ["Boundary crossing", "Boundary violation"], items: [{ text: "Accepting a box of sweets at Diwali", bucket: 0 }, { text: "Extending one session by ten minutes during a crisis", bucket: 0 }, { text: "Asking a client who is a builder to renovate your flat at a discount", bucket: 1, why: "A business relationship that exploits the client." }, { text: "Dating a client three months after therapy ends", bucket: 1 }, { text: "Attending a client's funeral for her father, after discussing it", bucket: 0 }] }, "Crossings and violations")],
    ref: "Gutheil and Gabbard 1993 boundary crossings and violations; APA Ethics Code 3.05, 10.05, 10.08; ethics-law module 1.4",
  },
  {
    id: "eth-l03-006",
    subject: S,
    topic: "telepsychology",
    marks: 10,
    difficulty: 3,
    exams: ["mcp-entrance", "ma-semester", "md-psychiatry"],
    question: "Discuss the ethical and legal issues in tele-psychology and online counselling in India, with reference to the Telemedicine Practice Guidelines 2020 and Tele MANAS.",
    plan: ["Growth of online therapy", "Legal framework", "Ethical issues", "Good practice", "Limits"],
    answer: `## Growth
Online therapy grew rapidly in India during the Covid 19 lockdowns. Video, audio and chat services now reach clients in small towns and those who fear being seen at a clinic. The national Tele MANAS service, launched in October 2022, offers a 24 hour toll free line with state cells and referral to in person care.

## Legal framework
- The Telemedicine Practice Guidelines of 25 March 2020, issued under the medical council regulations, allowed registered medical practitioners to consult by video, audio and text, set rules for identifying both parties, consent and record keeping, and listed which medicines can be prescribed remotely.
- Telepsychiatry Operational Guidelines, prepared by NIMHANS with the Indian Psychiatric Society, adapted these for psychiatry.
- The guidelines apply to doctors; psychologists follow them by analogy along with their own codes. The Mental Healthcare Act's duties of confidentiality, section 23, apply whatever the medium.
- The Digital Personal Data Protection Act 2023 and its Rules, notified in November 2025, govern how personal data, including health data, is collected, stored and protected.

## Ethical issues
1. Confidentiality and privacy: clients may talk from shared homes; platforms may store data abroad; screenshots and recordings may be made without consent.
2. Identity and competence: verifying who the client is, and the therapist's qualifications, which many online platforms do not check.
3. Consent: clients must understand the limits of online work, the platform used and what happens if the call drops.
4. Crisis management: a suicidal client may disconnect; the therapist may not know where they are.
5. Jurisdiction: a therapist in Delhi seeing a client in Dubai may be subject to another country's law.
6. Boundaries: chat at all hours and blurred personal and professional channels.
7. Equity: those without smartphones or data are excluded.

## Good practice
- Write a tele therapy agreement covering platform, privacy, recording, fees, contact between sessions and crisis plans.
- Record the client's location and an emergency contact at the start of each session.
- Use secure, encrypted platforms, not personal social media accounts.
- Verify identity and age; get guardian consent for minors.
- Know local emergency services and refer to in person care when needed.
- Keep records as for face to face work.

## Limits
Severe risk, psychosis, need for physical examination and some assessments are better done in person.

## Conclusion
Tele psychology widens access but carries privacy, crisis and competence risks. Clear agreements, secure tools and emergency planning make it ethical.`,
    keyPoints: ["Growth after 2020; Tele MANAS since October 2022", "Telemedicine Practice Guidelines 25 March 2020", "Telepsychiatry operational guidelines", "MHCA confidentiality applies to all media", "DPDP Act 2023 and Rules 2025", "Issues: privacy, identity, consent, crisis, jurisdiction, boundaries, equity", "Tele therapy agreement, location and emergency contact, secure platform"],
    pitfalls: ["Saying online therapy has no rules", "Missing crisis planning"],
    module: "ethics-law/2-5",
    visuals: [chain("Good practice", [["Tele therapy agreement", "Platform, privacy, fees, crisis plan"], ["Check identity and location", "Every session"], ["Secure platform", "Not personal social media"], ["Emergency plan", "Local services and contact"], ["Records", "As for in person work"]])],
    ref: "Telemedicine Practice Guidelines, Board of Governors MCI, 25 March 2020; Telepsychiatry Operational Guidelines 2020 (NIMHANS, IPS, TPS); Tele-MANAS 10 October 2022; DPDP Rules notified 14 November 2025",
  },
  {
    id: "eth-l03-007",
    subject: S,
    topic: "assessment-ethics",
    marks: 10,
    difficulty: 2,
    exams: ["mcp-entrance", "ugc-net", "ma-semester"],
    question: "Discuss the ethical issues in psychological testing and assessment, with special reference to the Indian context.",
    plan: ["Why testing raises ethical issues", "Competence and test choice", "Consent and confidentiality", "Fairness and culture", "Reporting, security and misuse"],
    answer: `## Why testing raises ethical issues
Psychological tests shape decisions about diagnosis, school placement, disability certificates, jobs and court cases. A wrong score can deny a child admission or a person a pension. Ethical testing protects people from these harms.

## Competence and test choice
- Use only tests one is trained to administer and interpret; projective tests and neuropsychological batteries need specific training.
- Choose tests with reliability and validity for the purpose and population.
- Use current editions and norms; old norms inflate scores.

## Consent and confidentiality
- Explain the purpose, who will see the results and how they will be used.
- In court ordered or employment testing, the person must know that results go to a third party.
- Test results are confidential and released only with consent or as the law requires.

## Fairness and culture
- Many tests used in India were developed in the West. Items about snow, baseball or Western foods disadvantage Indian children.
- Indian adaptations and tests exist, such as Malin's Intelligence Scale for Indian Children, Bhatia's Battery of performance tests, the Vineland Social Maturity Scale adapted by Malin, and the NIMHANS neuropsychological battery.
- Language, schooling, rural background and disability must be considered. A child taught in Marathi should not be tested only in English.
- The Rights of Persons with Disabilities Act 2016 requires reasonable accommodation, such as extra time or a scribe.

## Reporting
- Write reports in plain language, state limitations, and avoid labels not supported by the data.
- Give feedback to the person in a way they can understand.
- Do not base important decisions on a single test score.

## Test security and misuse
- Protect test materials and items from being leaked, for example on social media.
- Do not hand raw test forms to untrained people.
- Do not sell IQ certificates or issue reports without proper testing, a problem in some private centres.

## Example
A school in Ranchi asks a psychologist to test a 9 year old tribal child for intellectual disability using an English language test. The psychologist instead uses an Indian performance test, checks adaptive behaviour with the Vineland scale and interviews the family in their language, finding average non verbal ability and a language gap.

## Conclusion
Ethical assessment requires competence, consent, cultural fairness, careful reporting and protection of tests. In India, the choice of culturally suitable tests is the heart of fairness.`,
    keyPoints: ["Stakes of testing decisions", "Competence and valid, current tests", "Consent and third party testing", "Confidentiality of results", "Cultural fairness and Indian tests", "Reasonable accommodation under RPwD", "Plain reporting, no single score decisions", "Test security and misuse"],
    pitfalls: ["Listing principles without Indian tests", "Ignoring language"],
    module: "assessment/3-7",
    visuals: [layers("Ethical testing", "stack", [["Competence", "Trained for the test and the purpose"], ["Consent", "Purpose, users and use of results explained"], ["Fairness", "Culture, language, disability accommodations"], ["Reporting", "Plain language, limits stated"], ["Security", "Materials protected from leaks and misuse"]], "Competence and test choice: the layers of ethical testing")],
    ref: "APA Ethics Code section 9; MISIC, Bhatia battery, VSMS Malin adaptation, NIMHANS neuropsychology battery; RPwD Act 2016; assessment module 3.7",
  },
  {
    id: "eth-l03-008",
    subject: S,
    topic: "ethics-decision",
    marks: 20,
    difficulty: 4,
    exams: ["mcp-entrance", "ma-semester", "md-psychiatry"],
    question: "Describe a step-by-step model for ethical decision making. Apply it to the following case: Priya, 16, tells her school counsellor in Kochi that she is in a sexual relationship with her 19-year-old boyfriend and asks the counsellor to tell no one.",
    plan: ["Why a model is useful", "The steps of the model", "Apply each step to the case", "Legal duty under POCSO", "Action plan and documentation", "Reflection on tensions"],
    answer: `## Why a model helps
Ethical dilemmas create stress and pressure to act on instinct. A model slows thinking, makes sure the relevant facts, laws and codes are considered, and leaves a record of reasoning. Several published models, such as Koocher and Keith Spiegel's nine steps, the Canadian code's ten steps and Karen Kitchener's model, share a common structure.

## A step by step model
1. Identify the problem: what is the ethical question, and whose interests are involved?
2. Gather the facts: who, what, ages, risks, history.
3. Identify the relevant law.
4. Identify relevant ethical principles and professional codes.
5. Consider the people affected and their perspectives, including culture.
6. Generate options.
7. Evaluate options against law, principles and likely consequences.
8. Consult a senior colleague or supervisor.
9. Decide, act and document.
10. Review the outcome and learn.

## Steps 1 and 2: problem and facts
The question is whether the counsellor can keep Priya's disclosure confidential. Facts: Priya is 16, a minor in law; her partner is 19, an adult; she describes the relationship as consensual; she has no reported injuries; she fears her parents' reaction and that her boyfriend will be jailed.

## Step 3: the law
- Under the Protection of Children from Sexual Offences Act 2012, a child is anyone under 18. Sexual activity with a child is an offence regardless of the child's consent.
- Section 19 requires any person who has knowledge, or reason to fear, that an offence has been committed to report it to the Special Juvenile Police Unit or local police. Section 21 makes failure to report punishable with imprisonment up to six months, a fine or both.
- Courts, including the Supreme Court and several High Courts, have discussed the problem of consensual adolescent relationships under POCSO and urged reform, but the statute still applies. The counsellor cannot set it aside.
- Under the Bharatiya Nyaya Sanhita, the age of consent is also 18.

## Step 4: principles and codes
- Autonomy and confidentiality favour Priya's wishes.
- Beneficence and non maleficence ask what will help or harm her: the relationship may be a risk, but reporting may cause distress, family conflict or loss of trust.
- Fidelity: the counsellor's first duty is to Priya.
- Codes permit disclosure where the law requires it. Adolescents should be told at the start of counselling about such limits.

## Step 5: people affected
Priya, her boyfriend, her parents, the school, and the counsellor, who faces legal liability.

## Steps 6 and 7: options
| Option | Law | Ethics | Likely consequence |
| Keep it secret | Breaches section 19 | Respects her wish but leaves risk unexamined | Counsellor liable; Priya unprotected if there is exploitation |
| Report without telling Priya | Meets the law | Damages trust | Priya feels betrayed and may stop seeking help |
| Explain the legal duty, involve Priya in how it is done, report, and support her | Meets the law | Honest and supportive | Hard conversation, but trust can be kept |
| Tell her parents only | Does not meet the duty to report to police | Breaches her confidentiality without legal cover | Family conflict, no protection |
The third option is best.

## Step 8: consult
The counsellor consults a senior colleague or the school's child protection officer, without unnecessarily naming the student, and checks the reporting procedure.

## Step 9: action and documentation
- Explain gently to Priya why the counsellor must report, that she is not in trouble, and what will happen next.
- Ask about safety, coercion, pregnancy and contraception, and whether she has other concerns.
- Report to the Special Juvenile Police Unit or police, giving the facts only.
- With Priya's input, plan how her parents will be told and offer support during any police or Child Welfare Committee process.
- Arrange health care referral if needed.
- Record the disclosure in her words, the decision steps, the consultation and the report.

## Step 10: review
After the process, review with a supervisor what went well, and how the school can explain the limits of confidentiality to students at the start.

## Tensions
This case shows a conflict between a rigid law and the realities of adolescent relationships. Many professionals feel the law causes harm in consensual cases. The ethical response is to obey the law, minimise harm in how it is applied, and advocate for reform through professional bodies, not to break the law in individual cases.

## Conclusion
A structured model helps the counsellor move from instinct to reasoned action. Here, law requires reporting; ethics shapes how it is done, with honesty, support and documentation.`,
    keyPoints: ["A ten step model and its sources", "Facts: minor of 16 and adult partner", "POCSO: under 18, consent irrelevant, sections 19 and 21", "Principles in conflict", "Options weighed in a table", "Consultation", "Honest explanation, report, support, health care, documentation", "Advocate for reform rather than breaking the law"],
    pitfalls: ["Keeping it secret because the relationship is consensual", "Reporting without telling or supporting the girl", "Telling parents in place of reporting"],
    module: "ethics-law/3-5",
    visuals: [
      chain("A step by step model", [["Identify the problem", "What is the dilemma"], ["Facts and law", "Ages, risks, POCSO"], ["Principles and people", "Codes, culture, who is affected"], ["Options and consultation", "Weigh and ask a senior"], ["Act, document, review", "Record the reasons"]]),
      vis("decide", { scene: "Priya, 16, asks you to tell no one about her sexual relationship with her 19 year old boyfriend.", ask: "Which option best meets law and ethics?", choices: [{ label: "Keep it secret", verdict: "harm", outcome: "You commit an offence under section 21, and any exploitation goes unchecked.", why: "Section 19 requires reporting." }, { label: "Explain the duty, report, and support her through it", verdict: "best", outcome: "Priya is upset but stays in counselling.", why: "Meets the law and keeps honesty and care at the centre." }, { label: "Call her parents and let them decide", verdict: "harm", outcome: "Priya is beaten at home and stops attending school.", why: "Parents are not the reporting authority and her confidentiality is broken without legal basis." }] }, "Steps 6 and 7: options"),
    ],
    ref: "Koocher and Keith-Spiegel decision model; Canadian Code of Ethics for Psychologists; Kitchener 1984; POCSO Act 2012 ss 2(1)(d), 19, 21; ethics-law modules 3.1 and 3.5",
  },
  {
    id: "eth-l03-009",
    subject: S,
    topic: "records",
    marks: 5,
    difficulty: 2,
    exams: ["mcp-entrance", "ma-semester"],
    question: "Write a short note on record keeping in psychological practice.",
    plan: ["Why records matter", "What to record", "Storage and retention", "Access and disclosure"],
    answer: `## Why records matter
Good records support continuity of care, protect clients by showing what was done and why, and protect the professional in complaints or court. A professional who cannot show their reasoning has little defence.

## What to record
- Identifying details, referral source and consent, including limits of confidentiality explained.
- Assessment findings, test scores and formulation.
- Treatment plan and each session: date, main content, interventions, risk assessment and plans.
- Important decisions, consultations and the reasons, especially around risk and disclosure.
- Correspondence and reports sent.
Notes should be factual, dated and signed, written soon after the session, and corrected by adding a dated note, never by erasing.

## Storage and retention
- Paper files locked; digital records encrypted and password protected, with backups.
- Keep records for a defined period; for minors, longer, until well after they reach adulthood.
- Dispose of records securely by shredding or secure deletion.
- Plan what happens to records if the professional retires or dies.

## Access and disclosure
- Under section 25 of the Mental Healthcare Act 2017, a person with mental illness has the right to access their basic medical records, with limited withholding for serious harm.
- Records are disclosed to others only with consent or as the law requires, such as a court order.
- The Digital Personal Data Protection Act 2023 adds duties to keep digital personal data secure and to use it only for the stated purpose.

## Conclusion
If it was not written down, in law it did not happen. Records should be accurate, secure and kept for the client's benefit.`,
    keyPoints: ["Purposes: care, accountability, legal protection", "Content: consent, assessment, plan, sessions, risk, decisions", "Factual, dated, signed; corrections added not erased", "Secure storage and retention, longer for minors", "Secure disposal", "MHCA section 25 access", "DPDP Act duties for digital data"],
    pitfalls: ["Writing opinions about clients' character", "Ignoring digital security"],
    module: "ethics-law/2-5",
    visuals: [layers("What to record", "stack", [["Consent and limits", "Recorded at the first meeting"], ["Assessment and formulation", "Findings and test scores"], ["Sessions", "Date, content, intervention, risk"], ["Decisions", "Consultations and reasons"]])],
    ref: "APA Record Keeping Guidelines 2007; MHCA 2017 s 25; DPDP Act 2023 s 8; ethics-law module 2.5",
  },
  {
    id: "eth-l03-010",
    subject: S,
    topic: "privacy-law",
    marks: 15,
    difficulty: 4,
    exams: ["mcp-entrance", "ma-semester", "md-psychiatry"],
    question: "Discuss the Digital Personal Data Protection Act 2023 and its implications for psychologists and mental health services in India.",
    plan: ["Background: privacy as a right", "Main concepts of the Act", "Duties of data fiduciaries", "Rights of data principals and children", "Penalties and the Board", "Implications for practice"],
    answer: `## Background
In 2017 the Supreme Court, in the Puttaswamy judgment, held that privacy is a fundamental right under Article 21 of the Constitution. It called for a data protection law. After several drafts, Parliament passed the Digital Personal Data Protection Act in August 2023. Its Rules were notified on 14 November 2025, with most duties coming into force in phases over eighteen months.

## Main concepts
- Personal data: any data about an individual who is identifiable by it.
- Digital: the Act covers personal data collected in digital form, or collected on paper and later digitised.
- Data principal: the person to whom the data relate; for a child, the parent or guardian is included.
- Data fiduciary: the person or organisation that decides why and how data are processed, such as a clinic, hospital or online therapy platform.
- Data processor: one who processes data on behalf of a fiduciary, such as a cloud storage or video call company.
- The Act does not create a separate category of sensitive data, but health data is treated with care in the Rules and by sector regulators.

## Grounds for processing
1. Consent that is free, specific, informed, unconditional and unambiguous, given through a clear notice describing the data and the purpose, in English or any of the languages of the Eighth Schedule. Consent can be withdrawn as easily as given.
2. Certain legitimate uses without consent, such as responding to a medical emergency involving a threat to life, providing medical treatment during an epidemic, or complying with a law or court order.

## Duties of data fiduciaries
- Use data only for the stated purpose and keep it accurate.
- Take reasonable security safeguards to prevent breaches.
- Inform the Data Protection Board and each affected person of a breach.
- Erase data when the purpose is served or consent is withdrawn, unless law requires retention.
- Publish contact details of a person who can answer questions and set up grievance redressal.
- Significant data fiduciaries, notified by government based on volume and sensitivity, have extra duties such as a data protection officer and audits.

## Rights of data principals
- Right to information about what data are processed and with whom they are shared.
- Right to correction, completion, updating and erasure.
- Right to grievance redressal.
- Right to nominate another person to exercise rights in case of death or incapacity.
Data principals also have duties, such as not filing false complaints.

## Children
A child under the Act is a person under 18. Processing a child's data requires verifiable consent of a parent or lawful guardian, and tracking, behavioural monitoring and targeted advertising directed at children are prohibited. The Rules exempt certain processing, including for healthcare and education, from the parental consent requirement to the extent needed.

## The Board and penalties
The Data Protection Board of India inquires into breaches and complaints and imposes penalties. Appeals go to the Telecom Disputes Settlement and Appellate Tribunal.
| Breach | Maximum penalty |
| Failure to take reasonable security safeguards | 250 crore rupees |
| Failure to notify a breach, or breach of duties towards children | 200 crore rupees |
| Other breaches | 50 crore rupees |

## Implications for psychologists
1. A private practitioner keeping electronic notes, a clinic using appointment software or a therapy app is a data fiduciary for those records.
2. Intake forms need a clear notice of what is collected and why, in the client's language, and specific consent.
3. Records must be secured: encryption, access controls, no client details on personal WhatsApp groups.
4. Contracts with video platforms and cloud services should require them to protect data.
5. Plan for breaches, such as a stolen laptop, including how to inform clients and the Board.
6. Handle requests to correct or erase data, balancing them with the duty to keep clinical records and with MHCA section 25.
7. For minors, obtain guardian consent, while noting the healthcare exemption in the Rules.
8. Research data must be anonymised where possible and used only for the consented purpose.

## Critique
- The Act gives wide exemptions to the State, which critics say weakens privacy.
- It has no specific category for health or mental health data, which carry special stigma.
- Small practitioners may find compliance costly and confusing.

## Conclusion
The DPDP Act makes protecting clients' digital data a legal duty as well as an ethical one. For mental health professionals, it adds to the MHCA's confidentiality rules: collect less, explain clearly, secure carefully and respond to clients' rights.`,
    keyPoints: ["Puttaswamy 2017 as the basis", "Act passed August 2023; Rules notified 14 November 2025 with phased duties", "Data principal, fiduciary and processor", "Consent and legitimate uses including medical emergency", "Fiduciary duties: purpose, security, breach notice, erasure, grievance", "Children under 18 need verifiable parental consent; healthcare exemption", "Board and penalties up to 250 crore", "Practical steps for clinics and therapists"],
    pitfalls: ["Saying the Act defines sensitive health data", "Missing the children's provisions", "No application to clinical practice"],
    module: "ethics-law/2-5",
    visuals: [
      tree("Main concepts", [["Digital personal data", "About an identifiable person", -1], ["Data principal", "The client, or parent of a child", 0], ["Data fiduciary", "Clinic, practitioner, platform", 0], ["Data processor", "Cloud or video service", 2], ["Data Protection Board", "Inquiry and penalties", 0]]),
      compare("Rights of data principals", ["Rights of the client", ["Information about processing", "Correction and erasure", "Grievance redressal", "Nominate someone"], "The client controls their data"], ["Duties of the practitioner", ["Clear notice and consent", "Security safeguards", "Breach notice", "Erase when purpose ends"], "The practitioner protects the data"]),
    ],
    ref: "DPDP Act 2023 (22 of 2023) ss 2, 4 to 10, 11 to 15, 18 to 33, Schedule; DPDP Rules notified 14 November 2025 (PIB backgrounder checked Nov 2026); Puttaswamy 2017",
  },
]);
