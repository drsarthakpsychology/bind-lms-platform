import type { InterviewQuestion } from "@/lib/prep/types";
import { ivkit } from "../qb5-kit";

/** Mock interview bank · ethics dilemmas. Ordered foundation to advanced. */
const iv = ivkit("ethics", ["mcp-entrance", "ma-semester"], "ethics-law");

const ITEMS: InterviewQuestion[] = [
  iv("iv-eth-001", 3,
    "During a session, a client says, 'If my brother-in-law cheats me again, I'll kill him. I know where he sleeps.' What do you do?",
    [
      "What factors make a threat more serious?",
      "Which Indian law allows you to disclose?",
      "How do you protect the therapeutic relationship while disclosing?",
    ],
    "I would not ignore it, but I also would not panic or breach confidentiality straight away. First, I would assess the risk carefully in the session: how serious and specific the intent is, whether there is a plan, means such as a weapon, a time frame, any history of violence, current substance use, mental state such as psychosis or severe anger, and protective factors. A conditional statement made in anger is different from a specific plan with means. I would explore what is happening with the brother-in-law and work on safer ways of dealing with it. If the risk seems serious and imminent to an identifiable person, I have a duty to protect. In India there is no Tarasoff statute, but Section 23 of the Mental Healthcare Act permits disclosing information when it is necessary to protect another person from harm or violence, limited to what is needed. Possible steps include intensifying treatment, involving a psychiatrist, considering admission if criteria are met, informing family supports, warning the potential victim, or informing the police. I would consult my supervisor, document my assessment and reasoning carefully, and where possible tell the client what I need to do and why, which often preserves trust. I would also have explained the limits of confidentiality at the start of therapy.",
    [
      "Structured risk assessment",
      "Distinguishes expressed anger from specific intent",
      "Duty to protect and MHCA s.23",
      "Range of graded protective options",
      "Consultation, documentation and transparency",
    ],
    [
      "Ignoring the threat to preserve confidentiality",
      "Calling the police without any assessment",
      "Not documenting",
    ]),

  iv("iv-eth-002", 2,
    "A 14-year-old client tells you her uncle has been touching her inappropriately, but begs you not to tell anyone. What do you do?",
    [
      "To whom must you report, and within what time frame?",
      "What happens if you do not report?",
      "How do you support the child through reporting?",
    ],
    "Under the POCSO Act 2012, I have a legal duty to report. Section 19 requires any person who knows or suspects that a sexual offence has been committed against a child to inform the Special Juvenile Police Unit or the local police. There is no exception for professional confidentiality, and failing to report is itself an offence under Section 21, punishable with up to six months' imprisonment, a fine, or both. So I cannot promise her secrecy. I would respond calmly and believe her, thank her for telling me, and tell her clearly that it is not her fault. I would explain honestly, in language she understands, that I have to tell people whose job is to keep children safe, what will happen next, and that I will support her through it. I would not question her in detail about the abuse, because detailed interviews should be done by the police or trained professionals to avoid contaminating her account, but I would note her own words carefully. I would assess her immediate safety, including whether the uncle lives in the same house, and her emotional state and suicide risk. With my supervisor, I would make the report, and involve a non-offending parent if safe. The police must inform the Child Welfare Committee within 24 hours. I would continue therapy and support her during the legal process.",
    [
      "Mandatory reporting under POCSO s.19 with no confidentiality exception",
      "Penalty for non-reporting under s.21",
      "Supportive, believing response without promising secrecy",
      "Not conducting a forensic interview",
      "Safety assessment, supervision and continued support",
    ],
    [
      "Promising to keep it secret",
      "Confronting the uncle",
      "Interrogating the child",
    ]),

  iv("iv-eth-003", 1,
    "A close friend's younger brother is depressed, and your friend asks you to 'counsel him a bit' since you are training as a psychologist. What do you do?",
    [
      "What is a dual relationship?",
      "Is it ever acceptable to help a friend's family member?",
      "How would you refer him well?",
    ],
    "I would kindly decline to be his therapist and help him find appropriate care instead. Treating a friend's family member creates a dual or multiple relationship. My objectivity would be compromised, confidentiality would be hard to maintain because my friend would want updates, he might not feel free to talk openly about the family, and if therapy went badly, it could harm both the client and my friendship. The APA Ethics Code, Standard 3.05, says psychologists should avoid multiple relationships that could reasonably impair objectivity or risk harm or exploitation. As a trainee, I would also be practising outside supervision and outside my competence, and without RCI registration. I can still help in a caring way. I can listen to my friend, share general information about depression, encourage the brother to seek help, and help them find a qualified clinical psychologist or psychiatrist, a college counselling service, or Tele-MANAS on 14416 for immediate support. If there is any sign of suicide risk, I would advise urgent professional help. I would explain to my friend that declining is not a lack of care but a way of making sure his brother gets the best help, and that I can still be a supportive friend.",
    [
      "Declines the therapist role",
      "Explains dual relationship risks",
      "Recognises trainee competence and registration limits",
      "Offers helpful referral and support",
      "Attends to possible suicide risk",
    ],
    [
      "Agreeing to counsel informally",
      "Refusing coldly without referral",
    ]),

  iv("iv-eth-004", 1,
    "At the end of therapy, a client gives you an expensive gold chain as a thank-you gift. How do you respond?",
    [
      "Would your response be different for a box of sweets?",
      "What does the gift mean clinically?",
      "How do cultural norms in India affect this?",
    ],
    "I would thank the client warmly for the thought behind the gift, but I would politely decline the gold chain. In deciding about gifts, I would consider the value, the timing, the client's intent and the clinical meaning, as well as cultural norms. In India, small gifts like sweets at the end of therapy or during festivals are common expressions of gratitude, and accepting a modest token is usually acceptable and respectful, as it is a boundary crossing rather than a violation. An expensive gift is different. It can create a sense of obligation, blur professional boundaries, and might reflect feelings or needs that should be explored, such as wanting to stay connected, or difficulty receiving help without repaying it. It may also be a burden on the client financially. I would explain gently that our professional guidelines do not allow me to accept valuable gifts, that the client's progress is the real reward, and that I appreciate the gesture. If therapy were still ongoing, I would explore the meaning of the gift with the client. I would also document the offer and my response, and discuss it in supervision if I were unsure. Declining should be done kindly, so that the client does not feel rejected.",
    [
      "Kind but clear refusal of a valuable gift",
      "Factors: value, timing, intent and meaning",
      "Cultural sensitivity about small gifts",
      "Exploring meaning and documenting",
      "Avoiding the client feeling rejected",
    ],
    [
      "Accepting expensive gifts",
      "Refusing harshly, causing shame",
    ]),

  iv("iv-eth-005", 2,
    "The family of a 40-year-old man newly diagnosed with schizophrenia asks you not to tell him his diagnosis, because 'he will become more upset'. What do you do?",
    [
      "What does the MHCA say about the right to information?",
      "When, if ever, can information be withheld?",
      "How do you involve the family respectfully?",
    ],
    "I would understand the family's fear, but I would not agree to hide the diagnosis from him. Under the Mental Healthcare Act 2017, Section 22, a person with mental illness has the right to information about their illness, the treatment proposed, and its likely benefits and side effects, given in a language and manner they can understand. Respect for autonomy also requires that he be involved in decisions about his own treatment. Hiding the diagnosis would undermine trust, adherence and his ability to give informed consent. If he cannot understand the information at the moment, for example because of severe symptoms, the information may be given to his nominated representative and shared with him as soon as he is able to understand. MHCA Section 25 allows specific information in his records to be withheld only where disclosure would cause serious mental harm or a likelihood of harm to others, which is a narrow exception, not a general family preference. I would talk with the family about their worries, explain his rights and the benefits of honest communication, and plan together how to share the diagnosis sensitively, using simple language, focusing on treatment and hope, and avoiding stigmatising labels. With his consent, the family can be involved in psychoeducation, which helps everyone.",
    [
      "Empathy for the family",
      "Right to information under MHCA s.22",
      "Autonomy and informed consent",
      "Narrow exceptions under s.22 and s.25",
      "Sensitive disclosure plan involving the family",
    ],
    [
      "Agreeing to deceive the patient",
      "Dismissing the family's concerns",
    ]),

  iv("iv-eth-006", 3,
    "Your supervisor asks you to write a psychological assessment report for a client you have not tested, using 'standard findings', because the court date is tomorrow. What do you do?",
    [
      "Which ethical principles are at stake?",
      "How would you raise this with your supervisor?",
      "What could the consequences be if you comply?",
    ],
    "I would not write a report for a client I have not assessed. Doing so would be falsification of records, which violates the principles of integrity and of avoiding harm, and in a court context it could seriously harm the client or others and mislead the justice system. The APA Ethics Code requires that opinions in reports be based on information and techniques sufficient to substantiate the findings, and that psychologists not make false or deceptive statements. Under the RCI Act, such conduct could amount to professional misconduct leading to removal from the register, and it could also have legal consequences such as perjury or fabricating evidence. I would raise it respectfully but clearly with my supervisor, in private, assuming good intentions under time pressure. I would explain my concerns and suggest alternatives: requesting an adjournment from the court, conducting an urgent brief assessment today if feasible, or submitting a report that clearly states it is preliminary and lists the limits of what can be concluded. If the supervisor insisted, I would document the conversation and seek guidance from the head of department, the institutional ethics or professional body, or a senior colleague. Protecting the client and my professional integrity matters more than avoiding an awkward conversation.",
    [
      "Refuses to falsify",
      "Ethical and legal consequences",
      "Respectful, private challenge",
      "Constructive alternatives",
      "Escalation with documentation if needed",
    ],
    [
      "Complying because of the hierarchy",
      "Publicly accusing the supervisor without first discussing",
    ]),

  iv("iv-eth-007", 2,
    "You notice a senior colleague often smells of alcohol and has made errors in clients' medication records. What do you do?",
    [
      "What does the APA code say about informal resolution?",
      "When is it necessary to report formally?",
      "How do you balance concern for the colleague with client safety?",
    ],
    "This involves possible impairment, which can harm clients, so I cannot ignore it. My first concern is client safety, and my second is my colleague's wellbeing. According to the APA Ethics Code, Standards 1.04 and 1.05, if it is feasible and appropriate, I should first try to resolve the issue informally by speaking to the colleague privately, expressing concern in a non-judgmental way, describing what I have noticed, and encouraging them to seek help. But if the errors are already putting clients at risk, as medication errors can, or if an informal approach fails or is not appropriate, I need to take it further through proper channels, such as informing the department head or the clinical supervisor responsible, following the institution's procedures. If the situation continued, it might need to go to the relevant professional body, such as the RCI or the medical council. I would document specific observations, such as dates and errors, rather than gossip or speculate. I would also make sure any immediate risk to clients is addressed, for example by flagging the medication errors so they can be corrected at once. Throughout, I would treat my colleague with dignity, since addiction is a health problem, and support access to help such as employee assistance or treatment.",
    [
      "Prioritises client safety",
      "Informal resolution first when feasible",
      "Formal reporting when harm is likely or informal approach fails",
      "Documentation of facts",
      "Compassion for the colleague",
    ],
    [
      "Ignoring it out of loyalty",
      "Spreading gossip",
    ]),

  iv("iv-eth-008", 3,
    "A client tells you she has fallen in love with you and wants to meet outside sessions. You notice you also find her attractive. What do you do?",
    [
      "What does the APA code say about sexual relationships with clients?",
      "How do you handle your own feelings?",
      "When would referral be appropriate?",
    ],
    "Romantic or sexual involvement with a current client is never acceptable. It is one of the clearest violations in every professional code, including APA Standard 10.05, and it causes serious harm to clients. Even after therapy ends, Standard 10.08 prohibits sexual relationships with former clients for at least two years, and even then only in the most unusual circumstances. So I would not meet her outside sessions. In the session, I would respond with respect and without shaming her, acknowledging her feelings as understandable, since strong feelings towards a therapist are common in a close relationship where someone feels deeply understood. I would explain clearly that our relationship must stay professional, and that this boundary is there to protect her and the therapy. The feelings can be explored therapeutically, for example as transference, connecting them to her relationship patterns and needs. My own attraction is not wrong in itself, as therapists are human, but acting on it would be. I would take it to supervision promptly and possibly personal therapy, so it does not affect my judgment. If my feelings or the situation made it impossible to work objectively, or if she could not continue on a professional basis, I would discuss a careful referral, done in a way that does not feel like rejection.",
    [
      "Absolute prohibition with current clients",
      "Two-year rule and the 'most unusual circumstances' caveat",
      "Respectful handling of the client's feelings",
      "Supervision for own feelings",
      "Thoughtful referral if needed",
    ],
    [
      "Agreeing to meet",
      "Shaming the client",
      "Hiding own feelings from supervision",
    ]),

  iv("iv-eth-009", 1,
    "A current client sends you a friend request on Instagram. What do you do?",
    [
      "Why are online connections with clients risky?",
      "How would you discuss it in session?",
      "What should a social media policy include?",
    ],
    "I would not accept the friend request, and I would discuss it with the client in the next session in a warm, non-rejecting way. Connecting on personal social media creates a dual relationship and blurs boundaries. It can expose the client to my personal life and me to theirs, threaten confidentiality, for example if others see the connection, and change the therapeutic relationship in ways that are hard to manage. In the session, I would explain that it is not personal, but that I keep my personal social media separate from my professional work to protect our work and their privacy, and that this is my policy with all clients. I might also gently explore what the request meant to them, as it could reflect a wish for closeness, curiosity or wanting more contact, which can be useful in therapy. Ideally, I would prevent this by having a clear social media policy in my informed consent at the start of therapy. It would explain that I do not connect with clients on personal accounts, that messages through social media are not secure and are not for emergencies, how clients can contact me, and that I will not search for clients online without their consent. I would also keep my own privacy settings tight.",
    [
      "Declines the request",
      "Explains dual relationship and confidentiality risks",
      "Discusses non-rejectingly and explores meaning",
      "Proactive social media policy in informed consent",
    ],
    [
      "Accepting the request",
      "Ignoring it without discussion",
    ]),

  iv("iv-eth-010", 3,
    "A 35-year-old woman with bipolar disorder in a manic phase refuses admission. Her husband wants her admitted. How do you decide what is ethical and legal?",
    [
      "What are the criteria for supported admission under the MHCA?",
      "How do you assess capacity?",
      "What is the 'least restrictive' principle?",
    ],
    "I would start from the principle that adults are presumed to have capacity and have the right to refuse treatment, even if others disagree. Under the Mental Healthcare Act, Section 4, capacity means being able to understand information relevant to the decision, appreciate its consequences, and communicate a decision. A decision others see as unwise does not by itself mean she lacks capacity. In mania, insight and judgment are often impaired, so I would assess her capacity specifically for this decision. If she has capacity, her refusal must be respected, and I would offer the least restrictive alternatives, such as intensive outpatient care, home treatment, and a safety plan with her husband. If she lacks capacity, I would check whether the criteria for supported admission under Section 89 are met: recent threat or attempt of self-harm, violence or causing fear of harm to others, or inability to care for herself to the point of risk, and that admission is the least restrictive option. Her advance directive, if she has one, must be considered. The application would come from her nominated representative, and two professionals, one a psychiatrist, would need to examine her, with the Board informed within three days because she is a woman. I would document everything carefully and involve her as much as possible in decisions.",
    [
      "Presumption of capacity and right to refuse",
      "MHCA s.4 capacity criteria",
      "Least restrictive alternatives",
      "s.89 criteria and procedure, including the Board timeline for women",
      "Advance directive and documentation",
    ],
    [
      "Admitting her simply because her husband wants it",
      "Assuming mania means no capacity",
    ]),

  iv("iv-eth-011", 2,
    "A participant in your research study asks, after completing the questionnaire, that her data be removed. Your analysis is nearly finished. What do you do?",
    [
      "Is withdrawal after data collection a right?",
      "What if the data are already anonymised?",
      "How should your consent form deal with this?",
    ],
    "Voluntary participation includes the right to withdraw, and I would respect her request. Withdrawing her data is inconvenient, but her rights matter more than my convenience. If her data can still be identified, for example through a code linked to her consent form, I would delete them and re-run the analysis without them. One participant rarely changes the results meaningfully, and if it does, that itself needs honest reporting. If the data were fully anonymised at collection, with no way to identify which responses were hers, it may be impossible to remove them. That is why the consent form should explain clearly, before participation, until when withdrawal of data is possible, for example 'you can withdraw your data until it has been anonymised on a stated date' or 'until the analysis begins'. If she was told she could withdraw at any time, I would honour that as far as possible. I would also thank her, ask whether anything in the study upset her, and offer support or referral if needed, because a withdrawal request can sometimes signal distress. I would note the withdrawal in my research records and, if required, inform my ethics committee. ICMR guidelines and APA Standard 8.02 emphasise this right.",
    [
      "Respects the right to withdraw",
      "Practical handling of identifiable data",
      "Anonymised data limits",
      "Clear consent form wording in advance",
      "Checks for distress and records the withdrawal",
    ],
    [
      "Refusing because analysis is nearly finished",
      "Keeping the data quietly",
    ]),

  iv("iv-eth-012", 3,
    "A man pressures you to certify his mild anxiety as a 40% disability so he can get a government job under the quota. He offers you money. What do you do?",
    [
      "Who issues disability certificates for mental illness?",
      "What are the consequences of false certification?",
      "How would you handle the conversation?",
    ],
    "I would refuse firmly and clearly. Accepting money would be bribery, and false certification would be dishonest, illegal and harmful. It would take a reserved place from a person with a genuine benchmark disability. Disability certification for mental illness is done by a medical board constituted by the government, using the IDEAS scale, so as a psychologist I would not issue the certificate alone anyway. My role would be limited to an honest assessment that the board can use. Under the RCI Act, Section 21, such conduct could be treated as infamous professional conduct leading to removal from the register, and there could be criminal consequences for corruption and for producing false documents. In the conversation, I would stay calm and respectful, explain that I cannot accept money and can only report what my assessment shows, and that disability benefits are determined by a board using standard criteria. I would also explore his situation with compassion, since he may be under real pressure to find work, and offer genuine help: treatment for his anxiety, and information about other employment support. I would document the conversation. If he persisted or became threatening, I would inform my supervisor or the head of the institution.",
    [
      "Firm refusal of bribery and false certification",
      "Board certification process with IDEAS",
      "Harm to genuine claimants",
      "Professional and legal consequences",
      "Compassionate alternative help and documentation",
    ],
    [
      "Accepting the money or exaggerating the disability",
      "Humiliating the man",
    ]),

  iv("iv-eth-013", 2,
    "The HR manager of a company that pays for its employees' counselling asks you for a report on an employee's sessions, saying 'we are paying for it'. How do you respond?",
    [
      "What should be agreed before starting an employee assistance arrangement?",
      "What, if anything, can you share?",
      "What if the employee is a risk to others at work?",
    ],
    "I would explain politely that I cannot share the content of the employee's sessions without the employee's explicit, informed consent, even though the company is paying. Confidentiality belongs to the client, and paying for a service does not give an employer the right to clinical information. This protects the employee and makes the service trustworthy, which benefits the company too. Ideally, this should have been made clear before the arrangement began. APA Standard 3.07 and 3.11 require clarifying, at the outset, the nature of the relationship with all parties when services are requested by a third party, including what will and will not be shared, and the employee should be told about the limits of confidentiality in their own informed consent. What I could usually share, if agreed in advance, is limited administrative information, such as anonymised service usage statistics or, with consent, whether the employee attended. If the employee wanted something shared, for example to support a request for leave, we would agree together exactly what to say, and I would share only that. If there were a serious risk of harm to the employee or others at work, the usual exceptions to confidentiality would apply, with disclosure limited to what is necessary. I would also follow the Digital Personal Data Protection Act in handling any personal data.",
    [
      "Confidentiality belongs to the client",
      "Payment does not confer access",
      "Clarify roles with third parties at the outset",
      "What can be shared, with consent or anonymised",
      "Risk exceptions and data protection",
    ],
    [
      "Sharing session content because the employer pays",
      "Refusing all communication rudely",
    ]),

  iv("iv-eth-014", 2,
    "As an MA graduate, you are asked by a private clinic to administer and interpret a full neuropsychological battery for a head injury patient, without supervision. What do you do?",
    [
      "What does practising within competence mean?",
      "What legal issues arise in India without RCI registration?",
      "How could you build competence ethically?",
    ],
    "I would decline to do the assessment independently. Practising within the boundaries of competence is a basic ethical duty under APA Standard 2.01, and neuropsychological assessment after head injury needs specific training, supervised experience and knowledge of brain-behaviour relationships, test selection and interpretation in context. A mistake could affect the patient's treatment, return to work, or legal claims. There is also a legal issue. In India, practising as a clinical psychologist and signing certificates in this field require RCI registration under Section 13 of the RCI Act, so issuing a clinical report without it could be unlawful. I would explain to the clinic that I can assist under the supervision of a qualified, registered clinical psychologist or neuropsychologist, for example by administering tests I have been trained in while they oversee the selection, interpretation and report, but I cannot take sole responsibility. I would suggest referring the patient to an appropriate service in the meantime. To build competence ethically, I would pursue formal training, such as an RCI-recognised M.Clin.Psy, workshops, supervised practice and reading, and only then work independently. Being honest about my limits protects the patient and my professional future.",
    [
      "Declines independent work beyond competence",
      "Potential harm to the patient",
      "RCI registration requirement",
      "Supervised alternative and referral",
      "Ethical path to building competence",
    ],
    [
      "Doing it to gain experience",
      "Misrepresenting qualifications",
    ]),

  iv("iv-eth-015", 3,
    "You discover that a 'psychologist' at your hospital, who sees many patients and signs reports as a clinical psychologist, does not have RCI registration. What do you do?",
    [
      "What does the RCI Act say about unregistered practice?",
      "Why does registration matter for patients?",
      "Whom would you approach first?",
    ],
    "This is a serious concern for patient safety and the law. Under Section 13 of the RCI Act 1992, only professionals registered on the Central Rehabilitation Register can practise as rehabilitation professionals, including as clinical psychologists, hold such posts in government institutions, or sign certificates that require a rehabilitation professional, and contravention is punishable. Registration matters because it shows that the person has a recognised qualification with supervised clinical training and is accountable to professional standards and continuing education. First, I would check my facts carefully, for example by verifying the RCI register, because there may be an explanation, such as a pending registration, a different qualification or a role title that has been misunderstood. I would not spread rumours. If it is confirmed, I would raise it through proper channels, such as the head of the department or the hospital's administration, because they are responsible for verifying staff credentials, and I would document the facts. If the institution did not act, it could be reported to the RCI. I would be careful to focus on the issue, not to attack the person, and to think about patients who may need reassessment by a registered professional. This also protects the public's trust in clinical psychology.",
    [
      "Section 13 restrictions and penalty",
      "Why registration protects patients",
      "Verifies facts first",
      "Reports through proper channels and documents",
      "Considers affected patients",
    ],
    [
      "Ignoring it",
      "Publicly shaming the person on social media",
    ]),

  iv("iv-eth-016", 2,
    "A family insists on taking their son, who has a first episode of psychosis, to a faith healer instead of continuing treatment. How do you respond?",
    [
      "How do you show respect for cultural beliefs while advocating for treatment?",
      "What if the son is an adult with capacity?",
      "What are the risks of delayed treatment?",
    ],
    "I would respond with respect, not ridicule. In India, many families seek help from faith healers or temples, and these beliefs can give comfort and meaning. I would explore their understanding of the illness, their hopes from the healer and their worries about medicines, perhaps using the cultural formulation interview. Then I would explain, in simple terms, that psychosis is a treatable illness and that delaying effective treatment can worsen outcomes, increase relapse and risk, and harm his studies or work. I would suggest that they do not have to choose. Many families combine prayer or rituals with medical treatment, and I would support that as long as the rituals are safe, without restraint, starvation or harm. I would also make sure the son's own voice is heard. If he is an adult with capacity, the decision about treatment is his, though I would encourage him to continue. If he lacks capacity and is at risk, the MHCA's provisions for supported treatment with his nominated representative may apply. I would warn the family firmly against harmful practices like chaining, which the MHCA prohibits, and give them crisis contacts. Keeping the relationship open is important, because families often return to treatment if they do not feel judged.",
    [
      "Respectful exploration of beliefs",
      "Clear explanation of risks of delay",
      "Integrative approach combining care and rituals",
      "Capacity and MHCA provisions",
      "Warning against harmful practices and keeping contact",
    ],
    [
      "Mocking the family's beliefs",
      "Threatening the family",
      "Ignoring the patient's own wishes",
    ]),

  iv("iv-eth-017", 3,
    "In couple therapy, the husband tells you privately that he is having an affair and asks you not to tell his wife. What do you do?",
    [
      "What is a 'no secrets' policy?",
      "How would you handle this if no policy was agreed at the start?",
      "When might individual therapy be needed?",
    ],
    "This is a classic dilemma, and the best protection is a clear policy agreed at the start of couple therapy. Many therapists use a 'no secrets' policy, explaining that information shared individually may be brought into joint sessions if relevant, because keeping secrets from one partner makes genuine couple work impossible and places the therapist in a collusive position. Others use a limited secrets policy. If I had a no-secrets policy, I would remind the husband of it and tell him I cannot keep this secret within couple therapy. I would encourage him to disclose it himself, perhaps with my help in a session, and give him time to decide. If he refuses, I would explain that I cannot continue couple therapy in a meaningful way, and we could discuss ending it or moving to individual work, while being careful about how this is communicated to the wife without breaching his confidentiality unnecessarily. If no policy had been agreed, I would not disclose his secret myself, since confidentiality was implied, but I would explain that continuing couple therapy under these conditions is problematic and work towards his disclosure or a change of format. I would also consider safety, such as sexual health risks, and consult my supervisor.",
    [
      "Importance of a policy at the outset",
      "No-secrets approach and why",
      "Encourages self-disclosure",
      "Options if he refuses",
      "Handling when no policy was agreed, with supervision",
    ],
    [
      "Secretly keeping the secret while continuing couple therapy",
      "Disclosing to the wife without consideration",
    ]),

  iv("iv-eth-018", 3,
    "A 25-year-old client with depression tells you she has been thinking of suicide and has saved up pills, but begs you not to tell her parents, with whom she lives. What do you do?",
    [
      "Does an adult's confidentiality prevent you from involving family?",
      "What does a safety plan include?",
      "When would you seek emergency care?",
    ],
    "Her safety comes first. I would do a thorough suicide risk assessment immediately: how strong her intent is, whether she has a plan and timing, access to means (she has saved pills), past attempts, hopelessness, substance use, and protective factors. Saving pills is a serious sign of preparation. I would talk with her about the pills and ask her to hand them over or dispose of them, since means restriction reduces risk. As she is an adult, her confidentiality matters, and ideally I would involve her family with her consent. I would explore why she does not want her parents told and whether there is someone else she trusts. However, confidentiality has limits when there is a serious risk to life. MHCA Section 23 allows disclosure in a life-threatening emergency and to protect the person, limited to what is necessary. If her risk is high and imminent and she will not agree to a plan that keeps her safe, I would inform her family or another responsible person, and arrange urgent psychiatric assessment or emergency care. I would tell her honestly what I am doing and why. I would make a written safety plan with her, covering warning signs, coping strategies, people to contact, crisis lines such as Tele-MANAS, and removing means. I would document everything and consult my supervisor.",
    [
      "Immediate structured risk assessment",
      "Means restriction for the saved pills",
      "Consent-based involvement first",
      "Limits of confidentiality in life-threatening risk (MHCA s.23)",
      "Safety plan, emergency care, transparency and documentation",
    ],
    [
      "Keeping it secret despite high risk",
      "Ending the session without a plan",
      "Telling the family without any discussion",
    ]),

  iv("iv-eth-019", 2,
    "Parents bring their 23-year-old son, who is sad after a break-up but has capacity, and want him admitted 'so he doesn't do anything stupid'. He refuses. What do you do?",
    [
      "What are the rights of an adult under the MHCA here?",
      "How do you address the parents' fears?",
      "What alternatives to admission exist?",
    ],
    "He is an adult with capacity, so his right to refuse admission must be respected. Under the MHCA, supported admission under Section 89 requires that the person lacks capacity to make the decision and meets specific risk criteria, and that admission is the least restrictive option. A family's worry alone does not meet that standard. Admitting him against his will would violate his rights, damage trust and could be harmful. I would do a careful assessment, including mood, suicide risk, substance use, and his support network. If he has no significant suicidal ideation or plan, I would explain to his parents, with empathy, that his sadness is an understandable reaction and that he does not need hospital care, and that forcing admission could make things worse. I would address their fears with practical information: signs that would indicate rising risk, how to talk to him supportively, and whom to contact, including Tele-MANAS on 14416. With his consent, I would offer him outpatient counselling, encourage him to stay connected with friends and routines, and agree a follow-up appointment. If his risk increased later and he lost capacity, the situation would need reassessment. I would document my assessment and the reasons for my decision.",
    [
      "Respects capacity and the right to refuse",
      "MHCA s.89 threshold not met",
      "Careful risk assessment",
      "Addresses parents' fears with information",
      "Least restrictive outpatient alternatives and documentation",
    ],
    [
      "Admitting him to please the parents",
      "Dismissing the parents without explanation",
    ]),

  iv("iv-eth-020", 3,
    "During an online session, a client in another city says she has just taken an overdose, then disconnects. What do you do?",
    [
      "What should be agreed before starting teletherapy?",
      "How do you get emergency help to a distant location?",
      "What do you document afterwards?",
    ],
    "This is an emergency, and I would act immediately. First, I would try to reconnect by video or phone. If I reach her, I would keep her talking, find out what and how much she took and when, and get her to call for help or give the phone to someone nearby. If I cannot reach her, I would use the emergency information I collected at the start of teletherapy, which should include her current address, an emergency contact person and the nearest hospital. I would call her emergency contact and ask them to go to her or call an ambulance. I would also call emergency services, such as 112 in India, with her address, explaining that a person has taken an overdose and needs urgent medical care. Confidentiality is overridden by the life-threatening emergency, as MHCA Section 23 allows. This shows why teletherapy informed consent must include an emergency plan: verifying the client's location at the start of each session, emergency contacts, local crisis services, and what will happen if a session is interrupted. Afterwards, I would document the times, my actions and the people contacted, inform my supervisor, follow up on her medical care and safety, and review the treatment plan and risk assessment.",
    [
      "Immediate action to reconnect",
      "Uses pre-collected emergency information",
      "Contacts emergency services and contact person",
      "Confidentiality overridden in emergencies",
      "Teletherapy emergency planning, documentation and follow-up",
    ],
    [
      "Waiting to see if she calls back",
      "Having no emergency information",
    ]),

  iv("iv-eth-021", 2,
    "After an assessment, a client asks for a copy of the Rorschach cards and the full WAIS questions 'to study them'. What do you say?",
    [
      "What is the difference between test data and test materials?",
      "Can clients see their own reports?",
      "Why does test security matter?",
    ],
    "I would explain kindly that I cannot give copies of the test materials, but that I am happy to explain their results. The APA Ethics Code distinguishes between test data and test materials. Test data are the client's own responses and scores. Under Standard 9.04, clients can generally receive their test data when they request it, though psychologists may withhold it to protect the client or others from substantial harm, or from misuse, within the law. Test materials are the manuals, items, stimuli and protocols, like the Rorschach cards or the WAIS questions. Standard 9.11 requires psychologists to maintain their security. If test items became public, people could rehearse them, which would make the tests invalid for future clients and could lead to wrong diagnoses or decisions. There are also copyright restrictions. I would offer the client a feedback session explaining their results in understandable language, and provide a copy of the report if appropriate, since under the Mental Healthcare Act, Section 25, people have a right to access their medical records. I would also explore why they want the materials, as they may have worries about the assessment that I can address.",
    [
      "Polite refusal of test materials",
      "Test data versus test materials (APA 9.04 and 9.11)",
      "Reasons for test security",
      "Offers feedback and report access (MHCA s.25)",
      "Explores the client's concerns",
    ],
    [
      "Handing over test materials",
      "Refusing to share any results at all",
    ]),

  iv("iv-eth-022", 3,
    "A police officer visits and demands your session notes on a client who is a suspect in a theft case, without a court order. What do you do?",
    [
      "When must you disclose records to the police?",
      "What should you check before responding?",
      "How do you inform the client?",
    ],
    "I would remain polite and cooperative in manner, but I would not hand over the notes without proper legal authority or the client's informed consent. Under the MHCA, Section 23, information about a person with mental illness is confidential, and exceptions include an order from a court, the Mental Health Review Board or other competent authorities. A verbal demand from a police officer without a court order or legal notice is not usually enough. I would ask the officer for the request in writing, including the legal provision under which it is made, and explain that I need to consult my institution's legal adviser or administration before releasing confidential records. I would also check whether the client consents to disclosure. If a valid court order or a legally binding requisition arrives, I would comply, sharing only the information requested and relevant, and nothing more. If there were an immediate risk to someone's life, different rules might apply. I would document the request and my response, inform my supervisor and institution, and, where it would not obstruct a legal process, inform the client that their records have been requested. This protects the client's rights while respecting lawful processes.",
    [
      "Does not release without legal authority or consent",
      "MHCA s.23 exceptions including court orders",
      "Requests written legal basis and seeks institutional advice",
      "Minimum necessary disclosure when legally required",
      "Documentation and informing the client",
    ],
    [
      "Handing over notes immediately",
      "Being hostile or obstructive to the officer",
    ]),

  iv("iv-eth-023", 2,
    "You realise that a batchmate copied large sections of a published paper into their dissertation without citation. What do you do?",
    [
      "What do the UGC plagiarism regulations say?",
      "Should you talk to your batchmate first?",
      "What is the difference between plagiarism and poor paraphrasing?",
    ],
    "Plagiarism is a serious breach of academic integrity, and it undermines trust in research, so I should not ignore it, but I would handle it fairly. If I feel safe and it is appropriate, I would first speak to my batchmate privately, without accusing them, pointing out what I noticed and encouraging them to correct it before submission by rewriting and citing properly. Sometimes students plagiarise out of poor understanding of referencing or panic, and early correction helps. If the dissertation has already been submitted, or if they refuse to correct it, I would raise it with the supervisor or the departmental committee, which is the proper channel. Under the UGC Promotion of Academic Integrity and Prevention of Plagiarism Regulations 2018, institutions must check theses with similarity software, and penalties are graded by the level of similarity: up to 10% has no penalty, 10 to 40% requires resubmission within six months, 40 to 60% leads to debarment from resubmitting for a year, and above 60% can lead to cancellation of registration. Plagiarism is not just similarity. Copying ideas or text without credit is plagiarism even if reworded, while properly quoted and cited material is not. I would focus on the facts, not gossip, and respect my batchmate's dignity.",
    [
      "Takes integrity seriously",
      "Private conversation first when feasible",
      "Proper channel if unresolved",
      "UGC 2018 regulation levels",
      "Plagiarism versus citation and respect for the person",
    ],
    [
      "Ignoring it",
      "Publicly shaming the batchmate",
    ]),

  iv("iv-eth-024", 4,
    "A young man asks you to 'cure' his same-sex attraction because his family is pressuring him to marry a woman. How do you respond?",
    [
      "What is the status of conversion therapy in India?",
      "How do you respect his autonomy if he insists?",
      "What support can you offer?",
    ],
    "I would respond with empathy and honesty. I would not offer any treatment aimed at changing his sexual orientation, because homosexuality is not a mental illness, conversion therapies are ineffective and harmful, causing depression, anxiety and suicidality, and in India the National Medical Commission has declared conversion therapy professional misconduct following Madras High Court directions, while mental health bodies including the Indian Psychiatric Society have stated that homosexuality is not a disorder. The Supreme Court's 2018 Navtej Singh Johar judgment also affirmed the dignity and rights of LGBTQ+ people. His request reflects real distress and family pressure, so I would explore what he wants and fears, the family's expectations, and his own sense of identity, values and religious beliefs, without imposing a direction. I would assess his mood and suicide risk, which can be raised in this situation. I would offer affirmative therapy, which helps him reduce shame, explore his identity at his own pace, and develop ways to cope with family pressure, including how and whether to disclose, and the consequences of an unwanted marriage for him and a future spouse. I would offer family sessions if he wanted, and connect him with LGBTQ+ support groups and helplines. His autonomy means choosing his own path, but not my providing a harmful intervention.",
    [
      "Empathic, honest response",
      "Refuses conversion therapy, with evidence and Indian position",
      "Explores his distress and values without imposing",
      "Suicide risk assessment",
      "Affirmative therapy, family work and community support",
    ],
    [
      "Agreeing to change his orientation",
      "Dismissing his distress or values",
      "Ignoring suicide risk",
    ]),

  iv("iv-eth-025", 1,
    "A long-term client loses his job and says he can no longer pay for therapy. You are in private practice. What do you do?",
    [
      "Is it ethical to end therapy abruptly for non-payment?",
      "What is a sliding scale?",
      "What does abandonment mean in this context?",
    ],
    "I would not end therapy abruptly, because that could be harmful and amount to abandonment, especially if he is vulnerable after losing his job. I would discuss it openly with him, acknowledging the stress he is under, and look at options together. These could include a reduced fee or sliding scale for a period, fewer or shorter sessions, a short pause with a clear plan for review, or a planned transition to affordable services, such as a government hospital, a medical college clinic, an NGO, a community mental health programme, or Tele-MANAS for support. If he is at risk, such as being suicidal after the job loss, I would make sure he has a safety plan and continuous care during any transition. APA Standard 6.04 says that if limitations to services can be anticipated because of financial limits, this should be discussed with the client as early as feasible, and Standard 10.10 requires pre-termination counselling and suggestions for alternative services when ending therapy. Ideally my informed consent at the start would describe my fee policy. I would also check that whatever arrangement I offer is fair and not exploitative, for example avoiding barter arrangements that might complicate the relationship.",
    [
      "Avoids abrupt termination or abandonment",
      "Collaborative discussion of options",
      "Sliding scale or affordable alternatives",
      "Risk check and continuity of care",
      "Fee policy in informed consent and avoiding exploitative arrangements",
    ],
    [
      "Stopping therapy immediately",
      "Agreeing to exploitative barter",
    ]),

  iv("iv-eth-026", 1,
    "You want to audio-record therapy sessions for supervision. What steps must you take?",
    [
      "What must the client be told?",
      "How should recordings be stored and deleted?",
      "Can the client refuse?",
    ],
    "Recording sessions can greatly improve supervision, but it requires the client's informed consent. APA Standard 4.03 says psychologists must obtain permission from all persons before recording their voices or images. Before recording, I would explain to the client why I want to record (for supervision to improve my work and their care), who will hear the recording (only my supervisor or a specific supervision group), how it will be stored securely (for example on an encrypted device, not a personal phone or a public cloud), how long it will be kept, and when it will be deleted, usually after the supervision has taken place. I would make it clear that they can refuse, or withdraw consent at any time, even during a session, without affecting their care. I would get written consent and record it in their file. I would avoid recording identifying information unnecessarily and keep recordings separate from names. If the client is a minor, I would take consent from a parent or guardian and assent from the child. Under the Digital Personal Data Protection Act, a recording is personal data, so the purpose must be specific, the data kept to the minimum, and deleted when no longer needed. I would also follow my institution's policy.",
    [
      "Requires informed consent (APA 4.03)",
      "Purpose, access, storage and deletion explained",
      "Right to refuse or withdraw",
      "Written consent and secure handling",
      "Minors and data protection law",
    ],
    [
      "Recording without consent",
      "Storing recordings on personal phones",
    ]),

  iv("iv-eth-027", 3,
    "Your clinic wants to use an AI tool to transcribe and summarise therapy sessions. What ethical questions would you raise?",
    [
      "Where is the data stored and processed?",
      "What does the DPDP Act require?",
      "Can AI summaries replace clinical notes?",
    ],
    "AI tools can save time, but they raise serious questions about confidentiality, consent and quality, so I would want answers before agreeing. First, consent: clients must be told clearly that an AI tool will process their sessions, what it does, and that they can say no without affecting their care. Second, data protection: where are the recordings and transcripts stored and processed, inside India or abroad, who can access them, are they encrypted, how long are they kept, and are they used to train the company's models? Under the Digital Personal Data Protection Act 2023 and its 2025 rules, the clinic as a data fiduciary must process personal data only for a specific, consented purpose, keep it secure, report breaches, and delete it when it is no longer needed. Mental health information is highly sensitive and is also protected by MHCA Section 23. Third, accuracy and bias: AI transcription can make errors, especially with Indian languages, accents and code-mixing, and summaries might misrepresent risk statements. So AI output should be reviewed by the clinician and should not replace clinical judgment or the clinician's responsibility for the record. Fourth, the effect on therapy: some clients may speak less openly. I would recommend a clear policy, a pilot, vendor contracts with strong data protection, and ongoing review.",
    [
      "Informed consent and right to refuse",
      "Data storage, access, retention and model training",
      "DPDP Act duties and MHCA s.23",
      "Accuracy, bias and clinician responsibility",
      "Policy, contracts and review",
    ],
    [
      "Adopting the tool without consent",
      "Assuming AI notes are always accurate",
    ]),

  iv("iv-eth-028", 2,
    "A TV channel asks you to comment on whether a famous film actor who died by suicide had depression or bipolar disorder. How do you respond?",
    [
      "Why should you not diagnose someone you have not assessed?",
      "What are safe messaging guidelines for suicide reporting?",
      "How can you still contribute usefully?",
    ],
    "I would decline to speculate about the actor's diagnosis. Diagnosing someone I have never assessed would be unprofessional and unethical. It lacks a proper basis, invades the privacy and dignity of the person and their grieving family, and can spread misinformation. APA guidance on public statements and the principle known in the US as the Goldwater rule caution against offering professional opinions about specific people one has not examined. MHCA Section 24 also reflects concern for the privacy of people with mental illness. I can still contribute usefully by talking about suicide and mental health in general terms. I would follow responsible reporting guidelines, such as those from the WHO and the Press Council of India: avoid sensational headlines, avoid describing the method or location, avoid presenting suicide as a solution or as caused by a single factor, avoid publishing suicide notes or photographs, and include helpline information such as Tele-MANAS 14416. I would emphasise that suicide is usually complex, that mental illness is treatable, that help-seeking is a sign of strength, and that people can look out for warning signs in friends and family. Safe reporting reduces the risk of imitation suicides, sometimes called the Werther effect.",
    [
      "Declines to diagnose a person not assessed",
      "Privacy, dignity and misinformation concerns",
      "Safe messaging guidelines",
      "General, helpful public education",
      "Imitation risk",
    ],
    [
      "Speculating about the actor's diagnosis",
      "Discussing the method of suicide",
    ]),

  iv("iv-eth-029", 3,
    "A patient's valid advance directive says she does not want ECT. She is now severely depressed and lacks capacity, and her family and the psychiatrist feel ECT is the best option. What happens?",
    [
      "What does the MHCA say about following advance directives?",
      "Who can ask to override the directive?",
      "Does the directive apply in an emergency?",
    ],
    "Under the Mental Healthcare Act, a valid advance directive must be respected. It was made when she had capacity, precisely to guide her care when she lost it, and Section 10 places a duty on the treating psychiatrist to follow it. So ECT cannot simply be given because the family and psychiatrist think it is best. If the psychiatrist, a relative or a care-giver believes the directive should not be followed, for example because her circumstances have changed in ways she could not have foreseen, they can apply to the Mental Health Review Board under Section 11, which can review, alter, modify or cancel the directive after considering her wishes, whether she made it freely and with capacity, and whether it is reasonable. Meanwhile, the team should offer other treatments consistent with her directive, such as medication and psychological care, and keep assessing whether she regains capacity. Section 7 says advance directives do not apply to emergency treatment under Section 94, but emergency treatment itself cannot include ECT, so ECT is not possible by that route either. I would support the team in documenting everything, involve her nominated representative, and make sure the process is transparent and respects her autonomy as far as possible.",
    [
      "Duty to follow a valid directive (s.10)",
      "Application to the Board under s.11",
      "Alternative treatments within the directive",
      "Emergency exception and the ECT exclusion in s.94",
      "Documentation and role of the nominated representative",
    ],
    [
      "Giving ECT on family consent",
      "Ignoring the directive",
      "Claiming ECT can be given as emergency treatment",
    ]),

  iv("iv-eth-030", 3,
    "A married woman in therapy tells you her husband forces sex on her and beats her when she refuses. She does not want to go to the police. What do you do?",
    [
      "What legal remedies exist for her in India?",
      "Is there a duty to report adult domestic violence?",
      "How do you plan for her safety?",
    ],
    "First, I would listen, believe her and validate her experience, making clear that the violence is not her fault. She is an adult, so unlike in child abuse cases there is generally no mandatory duty for me to report to the police, and I would respect her choice not to go to them, unless there was an immediate risk to her life or a child was at risk. My focus would be on her safety and her options. I would assess her risk carefully: the frequency and severity of violence, threats to kill, use of weapons, strangulation, pregnancy, children at home, and her suicide risk. I would make a safety plan with her, including safe places to go, emergency contacts, keeping important documents and money accessible, and crisis numbers such as the women's helpline 181 and the police emergency number 112. I would tell her about the legal remedies, so she can decide. Under the Protection of Women from Domestic Violence Act 2005, she can seek protection orders, residence orders and maintenance through a protection officer or magistrate, which is a civil remedy. Cruelty by a husband is an offence under the BNS, while the BNS keeps the marital rape exception for wives aged 18 and over, an exception that has been challenged before the Supreme Court. I would provide trauma-informed therapy and link her with support organisations.",
    [
      "Believes and validates",
      "Respects adult autonomy, with exceptions for imminent risk or children",
      "Thorough risk assessment",
      "Safety planning and crisis contacts",
      "Legal remedies (PWDVA 2005, BNS cruelty) and support services",
    ],
    [
      "Forcing her to report",
      "Suggesting she adjust for the family's sake",
      "Ignoring children's safety",
    ]),

  iv("iv-eth-031", 2,
    "On a ward round, you see a patient tied to a bed with a cloth rope because 'staff are short tonight'. What do you do?",
    [
      "What does the MHCA say about restraint?",
      "How do you raise this without antagonising staff?",
      "What documentation and reporting are required?",
    ],
    "This is a violation of the patient's rights and the law. Under Section 97 of the Mental Healthcare Act, physical restraint may be used only when it is the only way to prevent imminent and immediate harm to the person or others, must be authorised by the psychiatrist in charge, must not last longer than absolutely necessary, and must be recorded. It must never be used as a punishment, a deterrent, or because of a shortage of staff. Section 95 prohibits chaining in any form, and Section 20 protects people from cruel and degrading treatment. Restraint must also be reported to the nominated representative within 24 hours and to the Board in a monthly report. My first concern is the patient's immediate safety and dignity, so I would check on them and, if there is no immediate danger, ask the nurse in charge to contact the duty psychiatrist to review the restraint at once, since a psychiatrist's authorisation is required. I would raise it calmly and respectfully, recognising the real staffing pressure, but being clear that this practice is not allowed. I would document what I saw and the steps taken, and then report it through the proper channel, such as the medical superintendent or ward in-charge, so that staffing problems are fixed and this does not happen again.",
    [
      "Recognises the violation",
      "MHCA s.97 conditions, plus s.95 and s.20",
      "Immediate patient safety and psychiatrist review",
      "Respectful but firm communication",
      "Documentation and reporting to fix the system",
    ],
    [
      "Ignoring it because staff are busy",
      "Confronting staff aggressively in front of patients",
    ]),
];

export const INTERVIEWS: InterviewQuestion[] = ITEMS.sort((a, b) => a.difficulty - b.difficulty);
