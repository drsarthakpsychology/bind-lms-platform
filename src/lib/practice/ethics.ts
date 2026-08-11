/**
 * Ethics & Law dilemmas (Part 6.5) — consequence-first teaching.
 *
 * Each dilemma presents a realistic Indian counselling context, asks the
 * student to commit to ONE action, then reveals the consequence: what the law
 * (MHA 2017, POCSO, RCI scope) and best practice require, and why the wrong
 * call has teeth. No AI involved — authored, deterministic, grounded.
 *
 * The practice here is deciding BEFORE seeing the outcome, which is what the
 * clinic never gives you time for.
 */

export interface EthicDilemma {
  id: string;
  tag: "MHA 2017" | "POCSO" | "Confidentiality" | "RCI scope" | "Consent" | "Minor";
  setting: string;
  vignette: string;
  options: Array<{
    label: string;
    consequence: string;
    correct: boolean;
  }>;
  law: string;
}

export const ETHICS_DILEMMAS: EthicDilemma[] = [
  {
    id: "mha-advance-directive",
    tag: "MHA 2017",
    setting: "Outpatient follow-up",
    vignette:
      "A 41-year-old man with recurrent major depressive disorder has an advance directive on file refusing ECT. He arrives in a severe catatonic state, can't give consent, and his family demands 'the shock treatment' because it worked before. The treating psychiatrist asks your opinion on the next legal step.",
    options: [
      {
        label: "Proceed with ECT — the family's consent overrides a document.",
        consequence:
          "The advance directive is a legal instrument under MHA 2017, not a family preference. Treating against it without invoking Section 5(4) is a breach with professional consequences. The nominated representative's consent is the right pathway — but they consent within the directive's limits, not over it.",
        correct: false,
      },
      {
        label: "Honour the advance directive — ECT is barred by MHA 2017 Section 5.",
        consequence:
          "Correct. An advance directive refusing a treatment binds the treating team unless one of the narrow Section 5(4) exceptions applies (a high risk of death or irreversible harm and no other equally effective option). You would first treat the catatonia with benzodiazepines and pursue consent from the nominated representative — not default to ECT.",
        correct: true,
      },
      {
        label: "Ignore both and transfer — a catatonic patient is someone else's problem.",
        consequence:
          "Transfer is legitimate only if the receiving facility is genuinely better placed. Using it to dodge a hard legal decision is abandonment. You stay clinically responsible until the handover is complete.",
        correct: false,
      },
    ],
    law: "MHA 2017 Section 5 — advance directives bind the treating team; exceptions are narrow and must be invoked, not assumed.",
  },
  {
    id: "pocso-minor-grooming",
    tag: "POCSO",
    setting: "School counselling room",
    vignette:
      "A 14-year-old tells you that a distant relative has been touching her on school-pickup days and 'says it's our secret'. She begs you not to tell her parents. POCSO is unambiguous about your duty. Which action comes first?",
    options: [
      {
        label: "Promise to keep the secret to preserve the therapeutic alliance.",
        consequence:
          "A promise you can't keep. POCSO removes the discretion — and a false promise teaches her that adults lie about safety. Alliance built on 'I can't keep this secret' is harder but real.",
        correct: false,
      },
      {
        label: "Call the parents first so they can handle it 'within the family'.",
        consequence:
          "The abuser is a relative — telling the family first can tip them off and expose her to more harm before authorities are involved. Mandatory reporting goes to the designated channels; the family is informed as part of that process, not before it.",
        correct: false,
      },
      {
        label: "Inform the mandated authorities (police/Childline) — the secrecy ends with you.",
        consequence:
          "Correct. POCSO imposes a mandatory reporting duty; it also protects her from the relative continuing to groom. You don't require parental consent to report — and you're honest with her that you can't keep this secret because the law and her safety require otherwise. Confidentiality has limits you state up front.",
        correct: true,
      },
    ],
    law: "POCSO 2012 — mandatory reporting to police/Childline; failure is itself an offence. Confidentiality never covers child sexual abuse.",
  },
  {
    id: "rci-scope-overstep",
    tag: "RCI scope",
    setting: "Private practice",
    vignette:
      "A client keeps asking you, a counselling psychologist, whether their antidepressant dose is 'right'. You've noticed they're oversedated in sessions. What's within your scope?",
    options: [
      {
        label: "Advise them to halve the dose — you can 'see' it's too much.",
        consequence:
          "Dose adjustment is a medical act. Advising it steps over the RCI scope line and, if something goes wrong, lands on you. You can describe what you observe; you can't prescribe the fix.",
        correct: false,
      },
      {
        label: "Note the observation, encourage adherence, and refer medication adjustment to the prescriber.",
        consequence:
          "Correct. Sedation is a medication effect worth flagging — but titration is outside your scope. You document the observation and coordinate with the prescriber (with consent). This is the RCI boundary working as intended.",
        correct: true,
      },
      {
        label: "Stop raising it — it's not your place to notice medication at all.",
        consequence:
          "You're allowed to observe and coordinate — the boundary is about adjusting, not noticing. Failing to flag an observation that matters is a duty-of-care miss, not professional restraint.",
        correct: false,
      },
    ],
    law: "RCI scope of practice — counselling psychologists assess and support; prescribing and dose adjustment sit with medical practitioners.",
  },
  {
    id: "confidentiality-risk",
    tag: "Confidentiality",
    setting: "College counselling centre",
    vignette:
      "A 19-year-old student tells you he's been having 'the plan again' — specific method, specific place, and he says he'll 'just do it tonight' after the session. He makes you promise not to tell anyone because 'you're the only one who gets it'.",
    options: [
      {
        label: "Keep the promise — breaching it would damage the relationship forever.",
        consequence:
          "A completed suicide after a stated, specific plan is the outcome that ends a career and, far worse, a life. There is no version of 'keep the promise' that is defensible here.",
        correct: false,
      },
      {
        label: "Negotiate a delay — get him to agree to 'wait a day' and let him leave.",
        consequence:
          "Negotiating a safety window is useful ONLY as part of an active intervention with a concrete plan and follow-up, never as a substitute for involving help when the risk is this specific and imminent.",
        correct: false,
      },
      {
        label: "Break confidentiality now: involve a safety plan, inform campus support, and stay with him until handover.",
        consequence:
          "Correct. Imminent risk to self is the classic confidentiality exception. You say what you're doing and why, involve emergency services, and don't leave him alone. The breach is proportionate, documented, and defensible — the promise was to the alliance, not to the plan.",
        correct: true,
      },
    ],
    law: "Confidentiality is absolute unless: imminent risk to self/others, child abuse (POCSO), or court order. State the limits up front.",
  },
  {
    id: "minor-consent",
    tag: "Minor",
    setting: "Adolescent clinic",
    vignette:
      "A 16-year-old (married, as permitted by their state's personal law) requests therapy and explicitly says their spouse must not be involved. The centre's intake policy asks you to confirm who can consent.",
    options: [
      {
        label: "Require parental consent — they're a minor, full stop.",
        consequence:
          "For a married minor, treating the parent as the sole consenting adult can breach confidentiality toward the person the client explicitly excludes. Assess capacity first.",
        correct: false,
      },
      {
        label: "Treat them as a mature minor — assess decisional capacity rather than assuming the spouse consents.",
        consequence:
          "Correct. For minors, the mature-minor doctrine lets you assess whether this adolescent can consent to counselling; an involuntarily-married adolescent's independence in the therapy room matters. You assess capacity, document it, and proceed accordingly.",
        correct: true,
      },
      {
        label: "Refuse service unless the spouse co-signs — they're legally the guardian.",
        consequence:
          "Assuming the spouse is the gatekeeper blocks care for the person who actually needs it and can expose them to additional harm. Capacity assessment, not default assumption, is the standard.",
        correct: false,
      },
    ],
    law: "MHA 2017 and case law support the mature-minor doctrine — capacity assessment, not blanket assumption about guardianship.",
  },
  {
    id: "mha-nominated-representative",
    tag: "MHA 2017",
    setting: "Inpatient ward",
    vignette:
      "A 52-year-old man with bipolar disorder, currently manic and refusing all treatment, is admitted against his wishes. His wife is the nominated representative. She asks you to explain how treatment decisions will be made over the coming days.",
    options: [
      {
        label: "Tell her the family decides because he's 'not in his senses'.",
        consequence:
          "The 2017 Act deliberately moves away from family-members-decide. The nominated representative supports the person's decision-making; they don't override it wholesale.",
        correct: false,
      },
      {
        label: "Proceed with whatever the treating team thinks best, no consultation needed.",
        consequence:
          "Paternalism without the MHA's safeguards (advance directive check, nominated representative, appeal rights) is exactly what the Act replaced. Consultation and documentation are the point.",
        correct: false,
      },
      {
        label: "Explain supported decision-making: he should be consulted, and treatment proceeds under the MHA's provisions when he can't decide.",
        consequence:
          "Correct. MHA 2017's core shift is supported decision-making — treatment decisions involve the person as far as they can participate, with the nominated representative supporting, not replacing, their voice. Capacity fluctuates, so you reassess repeatedly.",
        correct: true,
      },
    ],
    law: "MHA 2017 — supported decision-making with a nominated representative; advance directives and appeal rights frame every inpatient decision.",
  },
  {
    id: "confidentiality-family-pressure",
    tag: "Confidentiality",
    setting: "Family pressure",
    vignette: "Your client's brother calls you every day insisting you tell him what's wrong with his sister — 'I pay for her sessions, I have a right to know.' The client has said nothing is to be shared.",
    options: [
      { label: "Share the basics with him — he pays, he deserves something.", consequence: "You've breached confidentiality. Even a payer has no automatic right to clinical information. The client's trust is gone and you have no defence if it's complained about.", correct: false },
      {
        label: "Compromise: tell him only that she's 'managing fine' — nothing specific.",
        consequence: "You chose a half-measure — it feels safer than either extreme, but it is the choice that satisfies no one and protects no one. The middle path here is where the real damage happens: not the worst act, but the one that looks reasonable until it is examined.",
        correct: false,
      },
      { label: "Tell him you can't share anything without her consent, and invite her to decide what, if anything, she wants him to know.", consequence: "Correct. Payment creates no disclosure right. The client decides; your job is to make that decision real and safe.", correct: true },
    ],
    law: "Confidentiality is the client's, regardless of who pays. See also the Mental Healthcare Act 2017's privacy provisions (Sections 22-24).",
  },
  {
    id: "employer-paid-sessions",
    tag: "Confidentiality",
    setting: "Employer-paid counselling",
    vignette: "An employer pays for your counselling service and asks for a monthly 'attendance and progress report' naming each employee and their 'issues'. Your employee-client has consented to attend, not to be reported on.",
    options: [
      { label: "Provide the report — the employer is the payer and the consent to attend covers it.", consequence: "Wrong. Consent to attend is not consent to disclose content. The report would breach confidentiality and likely the MHA's privacy provisions.", correct: false },
      {
        label: "Compromise: give the employer a summary of each employee's 'mood' without details.",
        consequence: "You chose a half-measure — it feels safer than either extreme, but it is the choice that satisfies no one and protects no one. The middle path here is where the real damage happens: not the worst act, but the one that looks reasonable until it is examined.",
        correct: false,
      },
      { label: "Provide attendance-only data if agreed, never content, and get the employee's written consent for anything more.", consequence: "Correct. Anonymised/attendance data can be a legitimate employer arrangement; clinical content never flows without explicit consent.", correct: true },
    ],
    law: "MHA 2017 Sections 22-24 — privacy of persons with mental illness; confidentiality of information. Employer contracts cannot override it.",
  },
  {
    id: "whatsapp-boundary",
    tag: "Confidentiality",
    setting: "WhatsApp boundary",
    vignette: "A client texts you at 11pm: 'Just checking if you're awake, need to talk about something urgent.' This is the third late-night message this week.",
    options: [
      { label: "Respond — they clearly need help and you don't want to abandon them.", consequence: "You've trained them that 11pm texting works, eroded the session boundary, and modelled unavailability in a crisis. The boundary, not the message, becomes the therapy issue.", correct: false },
      {
        label: "Compromise: reply briefly tonight but ask them to message during sessions next time.",
        consequence: "You chose a half-measure — it feels safer than either extreme, but it is the choice that satisfies no one and protects no one. The middle path here is where the real damage happens: not the worst act, but the one that looks reasonable until it is examined.",
        correct: false,
      },
      { label: "In the next session, set the communication boundary explicitly: what counts as urgent, what to do in a real crisis, and when you will respond.", consequence: "Correct. Boundaries are therapeutic: a crisis plan and a response window protect both of you and teach the client a working model of care.", correct: true },
    ],
    law: "RCI code of ethics — professional boundaries; a documented crisis plan is the standard response.",
  },
  {
    id: "certificate-request",
    tag: "RCI scope",
    setting: "Certificate request",
    vignette: "A client who has been seeing you for three weeks asks for a 'certificate of depression' for their exam board to get extra time. You've barely assessed them.",
    options: [
      { label: "Write it — three weeks is enough to know, and they're relying on you.", consequence: "You've issued a medical-grade certificate without assessment — a false document that could harm the client and your registration if challenged.", correct: false },
      {
        label: "Compromise: write a general letter saying they've 'been under stress' without a diagnosis.",
        consequence: "You chose a half-measure — it feels safer than either extreme, but it is the choice that satisfies no one and protects no one. The middle path here is where the real damage happens: not the worst act, but the one that looks reasonable until it is examined.",
        correct: false,
      },
      { label: "Explain you can describe your observations and support the proper assessment pathway, but a diagnosis/certificate is not a three-week output.", consequence: "Correct. Certificates have legal weight; you support the process without fabricating it.", correct: true },
    ],
    law: "RCI scope of practice — diagnosis and certification for statutory purposes sit with qualified clinicians following defined assessment standards.",
  },
  {
    id: "mha-court-letter",
    tag: "MHA 2017",
    setting: "Court letter request",
    vignette: "A client in a family dispute asks you to write 'a strong letter' saying the other party's behaviour caused their mental illness, so they can use it in court.",
    options: [
      { label: "Write it — you're the expert and your client asked.", consequence: "You've offered an expert opinion beyond your assessment scope, in a legally consequential context, for a purpose you can't verify. That's a complaint waiting to happen.", correct: false },
      {
        label: "Compromise: write the letter but phrase it vaguely so it can't be used directly.",
        consequence: "You chose a half-measure — it feels safer than either extreme, but it is the choice that satisfies no one and protects no one. The middle path here is where the real damage happens: not the worst act, but the one that looks reasonable until it is examined.",
        correct: false,
      },
      { label: "Decline the advocacy framing; offer an accurate clinical summary of what you actually assessed, and explain the limits of your role.", consequence: "Correct. An honest clinical record can be used; a partisan 'strong letter' cannot be defended.", correct: true },
    ],
    law: "Expert evidence rules — opinions must be within professional competence and honestly held; advocacy letters are a scope violation.",
  },
  {
    id: "pocso-school-disclosure",
    tag: "POCSO",
    setting: "School referral",
    vignette: "A 12-year-old tells you their uncle 'does bad things at night'. They beg you not to tell their parents because 'they'll be angry at me'. You work in a school setting.",
    options: [
      { label: "Respect the child's wish — breaking it will damage the relationship.", consequence: "You've chosen secrecy over safety. POCSO's reporting duty doesn't pause for the child's fear — the mandated reporter must act.", correct: false },
      {
        label: "Compromise: tell the child you'll wait a week to see if they change their mind.",
        consequence: "You chose a half-measure — it feels safer than either extreme, but it is the choice that satisfies no one and protects no one. The middle path here is where the real damage happens: not the worst act, but the one that looks reasonable until it is examined.",
        correct: false,
      },
      { label: "Tell the child you must tell a safe adult and involve the school's child-protection lead, following the mandated reporting pathway.", consequence: "Correct. You manage the child's fear with honesty and support, but the report goes forward. That IS the child-protective act.", correct: true },
    ],
    law: "POCSO 2012 Section 19 — mandatory reporting by any person in contact with the child; failure is an offence.",
  },
  {
    id: "rci-diagnosis-request",
    tag: "RCI scope",
    setting: "Client asks for a diagnosis",
    vignette: "A client asks directly: 'So what's my diagnosis? You've been seeing me for two months, you must know.'",
    options: [
      { label: "Give your best guess — they deserve an answer.", consequence: "A casual label without the assessment process behind it is worse than no label — it can be repeated, Googled, and internalised as identity.", correct: false },
      {
        label: "Compromise: tell them a plausible label but say it's 'unofficial'.",
        consequence: "You chose a half-measure — it feels safer than either extreme, but it is the choice that satisfies no one and protects no one. The middle path here is where the real damage happens: not the worst act, but the one that looks reasonable until it is examined.",
        correct: false,
      },
      { label: "Share your formulation honestly: what you see, what you're still assessing, and what the label would and wouldn't change about the work.", consequence: "Correct. The formulation is more honest and more useful than a premature label.", correct: true },
    ],
    law: "RCI scope + best practice — diagnosis requires assessment; premature labelling is a competence and ethics issue.",
  },
  {
    id: "minor-mature-assessment",
    tag: "Minor",
    setting: "Mature minor",
    vignette: "A 16-year-old wants to continue therapy for anxiety without their parents being told anything. They're otherwise well, articulate, and managing school.",
    options: [
      { label: "Refuse — they're a minor, parents must know everything.", consequence: "You've removed a functioning young person's access to help. The mature-minor doctrine and Gillick-style reasoning exist precisely for this case.", correct: false },
      {
        label: "Compromise: continue seeing them but ask them to tell their parents eventually.",
        consequence: "You chose a half-measure — it feels safer than either extreme, but it is the choice that satisfies no one and protects no one. The middle path here is where the real damage happens: not the worst act, but the one that looks reasonable until it is examined.",
        correct: false,
      },
      { label: "Assess their capacity to consent, and negotiate a workable confidentiality arrangement — safety issues still go to parents.", consequence: "Correct. Capacity assessment, not age assumption. Safety overrides; otherwise their autonomy is respected.", correct: true },
    ],
    law: "MHA 2017 + Indian case law support the mature-minor doctrine — capacity-based, not blanket parental authority.",
  },
  {
    id: "confidentiality-safety-exception",
    tag: "Confidentiality",
    setting: "The safety exception",
    vignette: "Your client, with clear distress, says they plan to 'teach a lesson' to the colleague who got them fired — and describes following them home yesterday.",
    options: [
      { label: "Keep it confidential — they trust you, and nothing may have happened yet.", consequence: "You've withheld information about an identifiable threat of serious harm. The safety exception exists precisely here.", correct: false },
      {
        label: "Compromise: mention it to a supervisor anonymously but take no other action.",
        consequence: "You chose a half-measure — it feels safer than either extreme, but it is the choice that satisfies no one and protects no one. The middle path here is where the real damage happens: not the worst act, but the one that looks reasonable until it is examined.",
        correct: false,
      },
      { label: "Address the risk directly, involve the appropriate authorities/support, and document the decision to break confidentiality.", consequence: "Correct. Imminent risk to an identifiable other is the classic exception — action, not secrecy, is the ethical move.", correct: true },
    ],
    law: "Confidentiality is absolute unless: imminent risk to self/others, child abuse (POCSO), or court order — stated in the RCI code of ethics.",
  },
  {
    id: "mha-restraint-decision",
    tag: "MHA 2017",
    setting: "Restraint concern",
    vignette: "A nurse tells you a patient at the hospital is being tied to the bed 'because he's shouting'. You're a visiting counsellor; you've seen the patient and he is calm now.",
    options: [
      { label: "It's the hospital's business — not your role to interfere.", consequence: "You've witnessed a likely MHA violation and stayed silent. The Act restricts restraint sharply; witnessing abuse has its own ethical duty.", correct: false },
      {
        label: "Compromise: mention it to the nurse privately that it's 'not ideal'.",
        consequence: "You chose a half-measure — it feels safer than either extreme, but it is the choice that satisfies no one and protects no one. The middle path here is where the real damage happens: not the worst act, but the one that looks reasonable until it is examined.",
        correct: false,
      },
      { label: "Raise it through the hospital's grievance mechanism and with the treating team, documenting what you saw.", consequence: "Correct. MHA 2017 severely restricts restraint; reporting observed violations is the ethical minimum.", correct: true },
    ],
    law: "MHA 2017 — restraint is prohibited except in narrowly defined emergency conditions and must be recorded and reported.",
  },
  {
    id: "pocso-court-testimony",
    tag: "POCSO",
    setting: "Court testimony",
    vignette: "A child you counselled during a POCSO matter asks you to testify 'about everything we talked about' to help their case.",
    options: [
      { label: "Testify fully — the child needs you.", consequence: "You may breach the child's confidentiality AND the legal rules on counselling communications in POCSO matters. Your role is the child's wellbeing, not advocacy in their litigation.", correct: false },
      {
        label: "Compromise: testify but only about the parts that help the child.",
        consequence: "You chose a half-measure — it feels safer than either extreme, but it is the choice that satisfies no one and protects no one. The middle path here is where the real damage happens: not the worst act, but the one that looks reasonable until it is examined.",
        correct: false,
      },
      { label: "Clarify the legal position on counsellor testimony with the child's legal guardian and the court's procedure before agreeing to anything.", consequence: "Correct. Counselling communications have special protection; participation must follow legal process, not a request.", correct: true },
    ],
    law: "POCSO 2012 + evidence law — counselling communications are protected; testimony follows court procedure, not client request.",
  },
  {
    id: "rci-supervision-requirement",
    tag: "RCI scope",
    setting: "Supervision requirement",
    vignette: "You've been asked to take a complex trauma client because your senior is 'too busy'. You have no supervision arrangement in place and feel out of your depth.",
    options: [
      { label: "Take the case — refusing looks weak and they'll find someone else.", consequence: "You're practising beyond your competence without supervision — the single most common factor in RCI complaints.", correct: false },
      {
        label: "Compromise: take the case and 'borrow' a senior's supervision informally.",
        consequence: "You chose a half-measure — it feels safer than either extreme, but it is the choice that satisfies no one and protects no one. The middle path here is where the real damage happens: not the worst act, but the one that looks reasonable until it is examined.",
        correct: false,
      },
      { label: "Take the case ONLY with a supervision arrangement in place, and be honest about your limits in the referral conversation.", consequence: "Correct. Supervision is the safety net that makes taking the case ethical.", correct: true },
    ],
    law: "RCI code of ethics — practice within competence; supervision is required where competence is developing.",
  },
  {
    id: "consent-minor-psychotherapy",
    tag: "Consent",
    setting: "Teen's own consent",
    vignette: "A 15-year-old wants to start therapy for exam stress. The parents are supportive but want to sit in on every session.",
    options: [
      { label: "Let them sit in — they're paying and they're the parents.", consequence: "You've hollowed out the therapy: the teen will not speak freely, and the sessions become a performance for the parents.", correct: false },
      {
        label: "Compromise: let the parents sit in for the first session only.",
        consequence: "You chose a half-measure — it feels safer than either extreme, but it is the choice that satisfies no one and protects no one. The middle path here is where the real damage happens: not the worst act, but the one that looks reasonable until it is examined.",
        correct: false,
      },
      { label: "Offer the parents a separate initial session, explain the value of the teen's privacy, and negotiate a review structure that keeps them informed without surveillance.", consequence: "Correct. The teen's consent to therapy is real; parental involvement is negotiated, not assumed.", correct: true },
    ],
    law: "MHA 2017 + mature-minor doctrine — a minor's consent to psychotherapy is assessed by capacity, not by age alone.",
  },
  {
    id: "confidentiality-death",
    tag: "Confidentiality",
    setting: "After death",
    vignette: "A client who died recently had shared deep personal material with you. Their adult child asks to read 'their therapy notes' to understand their parent.",
    options: [
      { label: "Share the notes — the family has a right to understand.", consequence: "Confidentiality survives death in most jurisdictions and codes. The notes contain third-party references and private material the client never consented to expose.", correct: false },
      {
        label: "Compromise: share the notes with the child's own therapist only.",
        consequence: "You chose a half-measure — it feels safer than either extreme, but it is the choice that satisfies no one and protects no one. The middle path here is where the real damage happens: not the worst act, but the one that looks reasonable until it is examined.",
        correct: false,
      },
      { label: "Offer a compassionate summary that protects third parties, and discuss the bereavement support the family might use.", consequence: "Correct. A synthesis of what helps the family grieve, not a release of records, honours both the dead and the living.", correct: true },
    ],
    law: "Confidentiality generally survives death; records are released only under legal authority.",
  },
  {
    id: "mha-fees-exploitation",
    tag: "MHA 2017",
    setting: "Fee exploitation",
    vignette: "A client in a vulnerable financial position agrees to a package of 40 sessions costing more than their monthly salary because they're desperate and 'the more sessions the better'.",
    options: [
      { label: "Sell the package — they agreed, and it's their money.", consequence: "Exploiting vulnerability in a therapeutic relationship is an ethical breach; the 'agreement' is not meaningful consent under pressure.", correct: false },
      {
        label: "Compromise: sell a smaller package — 10 sessions — and call it done.",
        consequence: "You chose a half-measure — it feels safer than either extreme, but it is the choice that satisfies no one and protects no one. The middle path here is where the real damage happens: not the worst act, but the one that looks reasonable until it is examined.",
        correct: false,
      },
      { label: "Recommend a sustainable plan, name the pressure openly, and refuse to profit from their desperation.", consequence: "Correct. The therapeutic relationship must not exploit distress. A smaller honest plan is the ethical sale.", correct: true },
    ],
    law: "RCI code of ethics — no exploitation of clients; fees must not exploit vulnerability. MHA 2017 also protects against predatory practices.",
  },
  {
    id: "confidentiality-group",
    tag: "Confidentiality",
    setting: "Group therapy",
    vignette: "A group member tells you, privately, that another member 'is clearly borderline and I know things about them from a mutual friend'. They want you to confirm it.",
    options: [
      { label: "Confirm what you can — you're all in the group together.", consequence: "You've breached the other member's confidentiality and fed a gossip dynamic that destroys group safety.", correct: false },
      {
        label: "Compromise: confirm nothing but hint that 'it's complicated'.",
        consequence: "You chose a half-measure — it feels safer than either extreme, but it is the choice that satisfies no one and protects no one. The middle path here is where the real damage happens: not the worst act, but the one that looks reasonable until it is examined.",
        correct: false,
      },
      { label: "Decline to confirm anything about another member, and address the boundary in group — both for the speaker and the group's safety.", consequence: "Correct. The group contract includes confidentiality BETWEEN members; you model protecting it.", correct: true },
    ],
    law: "Group-therapy confidentiality is part of the professional code; 'sharing' third-party information is a breach.",
  },
  {
    id: "mha-seclusion-witness",
    tag: "MHA 2017",
    setting: "Seclusion witness",
    vignette: "During a hospital visit to see a client, you find them in a locked side-room alone for 'their safety'. The staff say it's been six hours.",
    options: [
      { label: "Accept it — hospitals know what they're doing.", consequence: "Six hours of seclusion without documented review is a likely MHA violation you've witnessed and ignored.", correct: false },
      {
        label: "Compromise: mention your concern to the client afterwards so they can complain.",
        consequence: "You chose a half-measure — it feels safer than either extreme, but it is the choice that satisfies no one and protects no one. The middle path here is where the real damage happens: not the worst act, but the one that looks reasonable until it is examined.",
        correct: false,
      },
      { label: "Document what you saw, raise it with the treating team and the hospital's grievance channel, and support the client afterwards.", consequence: "Correct. Seclusion has strict limits and documentation duties under MHA 2017; silence is complicity.", correct: true },
    ],
    law: "MHA 2017 — seclusion and restraint are last-resort, time-limited, and must be documented and reported.",
  },
  {
    id: "consent-recording",
    tag: "Consent",
    setting: "Recording sessions",
    vignette: "You want to record sessions for supervision. The client hesitates but eventually says 'fine' when you push a little.",
    options: [
      { label: "Record — they said fine.", consequence: "That 'fine' is not informed consent; it's pressure-induced compliance. The recording has no ethical basis.", correct: false },
      {
        label: "Compromise: record but promise to delete it right after supervision.",
        consequence: "You chose a half-measure — it feels safer than either extreme, but it is the choice that satisfies no one and protects no one. The middle path here is where the real damage happens: not the worst act, but the one that looks reasonable until it is examined.",
        correct: false,
      },
      { label: "Explain what the recording is for, who will hear it, how it's stored and deleted — and treat a 'fine' under pressure as a no.", consequence: "Correct. Informed consent is specific, voluntary, and revocable — you document the explanation and the agreement.", correct: true },
    ],
    law: "RCI code of ethics — informed consent for recording; pressure-induced compliance is not consent.",
  },
  {
    id: "mha-transition-discharge",
    tag: "MHA 2017",
    setting: "Discharge support",
    vignette: "A client is being discharged from a psychiatric unit after 3 weeks. Their family says the doctors 'didn't tell us anything about the medicine' and the client is confused about what they're taking.",
    options: [
      { label: "It's the hospital's job — nothing to do with you.", consequence: "You've missed a transition moment where relapse is likeliest. Discharge without understanding is a failed handover.", correct: false },
      {
        label: "Compromise: tell the family to ask the pharmacy about the medicines.",
        consequence: "You chose a half-measure — it feels safer than either extreme, but it is the choice that satisfies no one and protects no one. The middle path here is where the real damage happens: not the worst act, but the one that looks reasonable until it is examined.",
        correct: false,
      },
      { label: "Help them make a written medication/support plan for discharge, and flag the information gap to the treating team for a proper handover.", consequence: "Correct. Discharge planning is part of continuity of care; a confused patient leaving with medicines they don't understand is a foreseeable harm.", correct: true },
    ],
    law: "MHA 2017 — continuity of care and informed consent for treatment, including medication information.",
  },
  {
    id: "pocso-prevention-dialogue",
    tag: "POCSO",
    setting: "Prevention dialogue",
    vignette: "A 15-year-old in a group programme says they've 'seen things' online and asks you, half-laughing, what would happen 'if a teacher did something wrong to a student'.",
    options: [
      { label: "Laugh it off — it's just teenage talk.", consequence: "You've let a possible disclosure window close. Children test adults before telling; a closed response teaches them silence.", correct: false },
      {
        label: "Compromise: tell them they can ask you anything anytime, without saying more.",
        consequence: "You chose a half-measure — it feels safer than either extreme, but it is the choice that satisfies no one and protects no one. The middle path here is where the real damage happens: not the worst act, but the one that looks reasonable until it is examined.",
        correct: false,
      },
      { label: "Answer seriously and openly — what the law says, what a child should do, and that you're a safe person to tell.", consequence: "Correct. This is the prevention conversation: the child learns the rule and that you are report-safe.", correct: true },
    ],
    law: "POCSO 2012 — awareness of reporting rights is protective; the professional's response determines whether disclosure happens.",
  },
  {
    id: "confidentiality-referral-sharing",
    tag: "Confidentiality",
    setting: "Referral sharing",
    vignette: "You're referring a client to a psychiatrist. The referral letter needs the client's history, but the client says 'don't write the personal stuff, just say I need an appointment'.",
    options: [
      { label: "Write the full history — the psychiatrist needs it to do their job.", consequence: "You've shared information the client explicitly withheld consent for. A referral without consent is a breach, however well-intentioned.", correct: false },
      {
        label: "Compromise: write the letter with the history but mark it 'confidential to psychiatrist'.",
        consequence: "You chose a half-measure — it feels safer than either extreme, but it is the choice that satisfies no one and protects no one. The middle path here is where the real damage happens: not the worst act, but the one that looks reasonable until it is examined.",
        correct: false,
      },
      { label: "Explain why the history matters for safe care, and write a letter the client has seen and agreed to.", consequence: "Correct. The client's consent to the referral is explicit and informed; a letter they've seen builds trust and is safer.", correct: true },
    ],
    law: "Consent to referral includes consent to what the letter contains — information flows follow informed consent.",
  },
  {
    id: "rci-emergency-scope",
    tag: "RCI scope",
    setting: "Emergency scope",
    vignette: "At a community camp, someone having an apparent panic attack asks you to 'give me something to calm down'. You have no medical role at this camp.",
    options: [
      { label: "Provide what you can — someone has to help.", consequence: "You're taking on a medical role without the authority for it. Panic can mimic cardiac events; handing out sedatives is outside your scope entirely.", correct: false },
      {
        label: "Compromise: give them a herbal calmant a family member suggested.",
        consequence: "You chose a half-measure — it feels safer than either extreme, but it is the choice that satisfies no one and protects no one. The middle path here is where the real damage happens: not the worst act, but the one that looks reasonable until it is examined.",
        correct: false,
      },
      { label: "Do what IS in your scope: stay, ground, breathe, and arrange the medical/psychiatric contact — while never dispensing medication.", consequence: "Correct. Your skills in the moment are real; your role is defined. Care without overstepping.", correct: true },
    ],
    law: "RCI scope of practice — counselling psychologists do not prescribe or dispense; emergency first aid + referral is the correct response.",
  },
  {
    id: "mha-advance-directive-family",
    tag: "MHA 2017",
    setting: "Advance directive vs family",
    vignette: "A client's advance directive says 'no ECT under any circumstances'. Now, in a severe relapse, the family insists on ECT because 'it's the only thing that worked last time'. The client is currently unable to communicate.",
    options: [
      { label: "Follow the family — they know what's best and they have the client's interest at heart.", consequence: "Family preference does not override a valid advance directive. Following the family breaches the Act and the client's expressed will.", correct: false },
      {
        label: "Compromise: let the family decide but ask the nominated representative to agree.",
        consequence: "You chose a half-measure — it feels safer than either extreme, but it is the choice that satisfies no one and protects no one. The middle path here is where the real damage happens: not the worst act, but the one that looks reasonable until it is examined.",
        correct: false,
      },
      { label: "Honour the directive and follow the MHA's mechanism for challenging it (a review by the medical team), involving the nominated representative.", consequence: "Correct. The directive is the client's will; overriding it requires the Act's specific procedure, not family preference.", correct: true },
    ],
    law: "MHA 2017 Sections 5-6 — advance directives bind the treating team; exceptions require the statutory review mechanism.",
  },
  {
    id: "consent-abandonment-closure",
    tag: "Consent",
    setting: "Closure of practice",
    vignette: "Your clinic is closing in three weeks. You have 14 active clients, several in crisis-adjacent states. Your colleague suggests just sending a text to everyone: 'Clinic closing, sorry, find someone new.'",
    options: [
      { label: "Send the text — three weeks is plenty of notice and it's their responsibility to find care.", consequence: "You've abandoned clients in active care without a handover plan. Closure without continuity planning is an ethical failure that follows you into every complaint hearing.", correct: false },
      { label: "Draft an individualised transition plan per client: written notice, session to review, referral options, and records transfer where needed.", consequence: "Correct. Professional closure is a process, not a text. Each client gets continuity — that IS the ethical act when you leave.", correct: true },
      { label: "Email the detailed plan only to the 'important' clients and text the rest.", consequence: "You've decided which clients matter — the moment that ranking is visible, the trust is gone. Closure planning is uniform.", correct: false },
    ],
    law: "RCI code of ethics — termination of services requires proper notice and continuity planning; abandonment is a disciplinary offence.",
  },
];

/** Randomised daily set, seeded deterministically so the day's set is stable. */
export function todaysDilemmas(daySeed: number, count = 3): EthicDilemma[] {
  const day = Math.max(1, Math.floor(daySeed / 86400000));
  const start = day % ETHICS_DILEMMAS.length;
  const out: EthicDilemma[] = [];
  for (let i = 0; i < count && out.length < ETHICS_DILEMMAS.length; i++) {
    out.push(ETHICS_DILEMMAS[(start + i) % ETHICS_DILEMMAS.length]);
  }
  return out;
}
