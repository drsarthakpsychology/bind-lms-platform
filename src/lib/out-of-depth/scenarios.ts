/**
 * Out of Depth (v5.1 A4) — the missing safety competency. Students train
 * toward counselling roles, not licences. The most important skill is knowing
 * when to refer, escalate, or stop.
 *
 * Each scenario: vignette → four options → consequence unfolds → reasoning.
 * Scored both directions: failing to refer is dangerous; referring everything
 * is also a harm. Track over-referral alongside under-referral.
 */

export type ReferralOption =
  | "continue"
  | "continue_with_supervision"
  | "refer_psychiatrist"
  | "medical_workup_first"
  | "outside_scope";

export interface OutOfDepthScenario {
  id: string;
  vignette: string;
  options: Array<{ option: ReferralOption; label: string }>;
  /** The correct call. */
  correct: ReferralOption;
  reasoning: string;
  /** Whether an over-referral is a real trap here (referring too readily). */
  over_referral_trap?: boolean;
}

export const OUT_OF_DEPTH_SCENARIOS: OutOfDepthScenario[] = [
  {
    id: "ood-1",
    vignette: "A 22-year-old student tells you, in session 2, that she has a specific plan to end her life tonight and the means. She asks you not to tell anyone.",
    options: [
      { option: "continue", label: "Continue and keep her confidence — breaking it would damage trust." },
      { option: "continue_with_supervision", label: "Continue but mention it to a supervisor." },
      { option: "refer_psychiatrist", label: "Activate the safety plan now — emergency referral, involve support, do not leave her alone." },
      { option: "medical_workup_first", label: "Ask her to get a full medical check first." },
    ],
    correct: "refer_psychiatrist",
    reasoning: "A specific plan + means + intent tonight is imminent risk. Confidentiality has limits; emergency action overrides it. You stay with her until handover.",
  },
  {
    id: "ood-2",
    vignette: "A client says he's been 'hearing a voice telling me to hurt people' for two weeks, and yesterday he almost acted on it. He's never seen anyone before you.",
    options: [
      { option: "continue", label: "Continue — it's probably stress, and you're building rapport." },
      { option: "continue_with_supervision", label: "Continue but log it with a supervisor." },
      { option: "refer_psychiatrist", label: "Urgent referral — command hallucinations with action risk need immediate psychiatric assessment." },
      { option: "medical_workup_first", label: "Rule out a medical cause first with a GP." },
    ],
    correct: "refer_psychiatrist",
    reasoning: "Command hallucinations with near-action is a psychiatric emergency. Not your call to hold.",
  },
  {
    id: "ood-3",
    vignette: "A client on an SSRI from a GP says she's been feeling 'amazing, unstoppable, sleeping 3 hours' for two weeks — after being treated for depression for a year.",
    options: [
      { option: "continue", label: "Celebrate — she's clearly better." },
      { option: "continue_with_supervision", label: "Note the improvement and keep going." },
      { option: "refer_psychiatrist", label: "Suspect antidepressant-induced hypomania — refer to a psychiatrist who can review the medication." },
      { option: "medical_workup_first", label: "Send for a thyroid panel first." },
    ],
    correct: "refer_psychiatrist",
    reasoning: "New euphoric highs in a depressed patient on an SSRI is hypomania until proven otherwise — the medication itself may be driving it, and only a prescriber can change it.",
  },
  {
    id: "ood-4",
    vignette: "In your first session, a 14-year-old tells you a relative has been touching her. She begs you not to tell anyone.",
    options: [
      { option: "continue", label: "Promise confidentiality to keep her safe and talking." },
      { option: "continue_with_supervision", label: "Keep the secret but tell a supervisor anonymously." },
      { option: "refer_psychiatrist", label: "This is child protection — inform the mandated authorities; you cannot keep this secret." },
      { option: "medical_workup_first", label: "Ask her to see a doctor to 'check everything is okay' first." },
    ],
    correct: "refer_psychiatrist",
    reasoning: "POCSO mandates reporting. There is no version of keeping this secret that is legal or safe.",
  },
  {
    id: "ood-5",
    vignette: "A 19-year-old client, weight 38kg, says she's 'fine' and wants to keep doing therapy for her 'lifestyle choices'. She's been fainting and hasn't menstruated in a year.",
    options: [
      { option: "continue", label: "Respect her autonomy — she says she's fine." },
      { option: "continue_with_supervision", label: "Keep seeing her but monitor." },
      { option: "refer_psychiatrist", label: "The eating disorder with medical instability needs urgent medical + psychiatric care — her life is at risk." },
      { option: "medical_workup_first", label: "Medical workup first, then continue your work." },
    ],
    correct: "refer_psychiatrist",
    reasoning: "Severe restriction with fainting and amenorrhoea is medical instability. Autonomy doesn't extend to harm you're professionally obligated to act on.",
  },
  {
    id: "ood-6",
    vignette: "A 50-year-old client on no medication, no psychiatric history, describes 'new voices' and confusion over the last three days, worse at night. His family says he's 'gone mad'.",
    options: [
      { option: "continue", label: "Begin anxiety/depression work — new-onset symptoms need assessment." },
      { option: "continue_with_supervision", label: "Start and discuss with a supervisor." },
      { option: "refer_psychiatrist", label: "Urgent medical review — acute confusion in an older adult is delirium until proven otherwise." },
      { option: "medical_workup_first", label: "Refer for a full medical workup (this is the correct FIRST step)." },
    ],
    correct: "medical_workup_first",
    reasoning: "Acute-onset confusion with fluctuation is delirium — a medical emergency (UTI, electrolyte, hypoxia). Medical workup is the right first call.",
  },
  {
    id: "ood-7",
    vignette: "A client asks you to diagnose whether his wife is 'borderline' so he can use it in their custody case. He's only had two sessions with you.",
    options: [
      { option: "continue", label: "Explore it — he may have useful observations." },
      { option: "continue_with_supervision", label: "Discuss with a supervisor then answer." },
      { option: "refer_psychiatrist", label: "Decline — you can't diagnose someone you've never assessed, and a court letter is outside your scope." },
      { option: "medical_workup_first", label: "Suggest his wife see a doctor first." },
    ],
    correct: "refer_psychiatrist",
    reasoning: "Diagnosing a third party you haven't assessed is outside scope and unethical. This is a scope boundary, not a referral — the honest answer is 'no'.",
  },
  {
    id: "ood-8",
    vignette: "A client asks you to advise on whether they should start or stop their antidepressant. You know they're seeing a GP for it.",
    options: [
      { option: "continue", label: "Give your opinion — you know them best." },
      { option: "continue_with_supervision", label: "Advise but log it." },
      { option: "refer_psychiatrist", label: "Medication advice is outside your scope — encourage them to raise it with their prescriber." },
      { option: "medical_workup_first", label: "Order a blood test to check levels." },
    ],
    correct: "refer_psychiatrist",
    reasoning: "Dose/start/stop decisions are prescriber decisions. You can describe what you observe; you can't adjust the medication.",
  },
  {
    id: "ood-9",
    vignette: "Your client reveals, with visible distress, that they're the one the workplace harassment complaint is about — and asks you to keep it confidential while they 'think about what to do'.",
    options: [
      { option: "continue", label: "Keep the confidence and explore it therapeutically." },
      { option: "continue_with_supervision", label: "Explore it and get supervision." },
      { option: "refer_psychiatrist", label: "This is your domain — continue; no referral is needed yet." },
      { option: "medical_workup_first", label: "This doesn't need a medical workup — continue the work." },
    ],
    correct: "continue",
    reasoning: "No imminent risk, no child protection, no mandated reporting trigger. This is ordinary (if difficult) therapeutic content — continue, with supervision.",
    over_referral_trap: true,
  },
  {
    id: "ood-10",
    vignette: "A client says they can't sleep and asks you to 'give me something for it'. They've never been to a doctor and expect you to prescribe.",
    options: [
      { option: "continue", label: "Explain that you can't prescribe and work on sleep hygiene." },
      { option: "continue_with_supervision", label: "Refer them to a supervisor for the medication question." },
      { option: "refer_psychiatrist", label: "Refer to a psychiatrist for the sleep complaint." },
      { option: "medical_workup_first", label: "Suggest they see their GP — you don't prescribe, and insomnia has medical causes worth checking." },
    ],
    correct: "medical_workup_first",
    reasoning: "Insomnia can be depression, anxiety, sleep apnoea, thyroid, or poor habits. You don't prescribe; a GP workup + your sleep work is the right path.",
  },
];

/** Score a decision. Over-referring (picking refer when continue is right) is tracked. */
export function scoreReferralDecision(s: OutOfDepthScenario, chosen: ReferralOption): { correct: boolean; overReferral: boolean } {
  const correct = chosen === s.correct;
  const overReferral = chosen === "refer_psychiatrist" && s.correct === "continue";
  return { correct, overReferral };
}
