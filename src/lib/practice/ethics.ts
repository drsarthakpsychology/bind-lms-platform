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
