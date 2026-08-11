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
  {
    id: "ood-11",
    vignette: "A client who has been in therapy with you for six months — stable, working, no risk — is referred by a GP for 'anxiety' and asks you to 'confirm' they have generalised anxiety disorder so they can get a certificate for work.",
    options: [
      { option: "continue", label: "Discuss what a diagnosis would and wouldn't give them, and continue the work you're already doing." },
      { option: "continue_with_supervision", label: "Run it past a supervisor, then decide." },
      { option: "refer_psychiatrist", label: "Refer them to a psychiatrist for the certificate — it's a medical document." },
      { option: "medical_workup_first", label: "Ask for a full medical workup first." },
    ],
    correct: "continue_with_supervision",
    reasoning: "You can't issue a medical certificate (outside scope), but referring to a psychiatrist purely for paperwork when the person is stable and already in therapy abandons a working alliance. Discuss the boundary in supervision; the therapy continues.",
    over_referral_trap: true,
  },
  {
    id: "ood-12",
    vignette: "A client tells you they are going to hit their brother tonight. They are specific, agitated, and say they've done it before.",
    options: [
      { option: "continue", label: "Keep it confidential — it's a therapy disclosure." },
      { option: "continue_with_supervision", label: "Tell a supervisor tonight." },
      { option: "refer_psychiatrist", label: "Imminent risk of harm to another person breaks confidentiality — involve police/family and a psychiatric referral now." },
      { option: "medical_workup_first", label: "Rule out a medical cause first." },
    ],
    correct: "refer_psychiatrist",
    reasoning: "Serious harm to an identified other is a confidentiality exception and a psychiatric emergency. You act now, you don't deliberate.",
  },
  {
    id: "ood-13",
    vignette: "A 16-year-old client says they've been having thoughts about hurting themselves but 'not really meaning it'. They are calm, engaging, and have supportive parents.",
    options: [
      { option: "continue", label: "Continue the session, do a proper risk assessment, and involve the parents at the end." },
      { option: "continue_with_supervision", label: "Continue but tell a supervisor tomorrow." },
      { option: "refer_psychiatrist", label: "Emergency psychiatric referral today — any self-harm thought is an emergency." },
      { option: "medical_workup_first", label: "Ask for a medical check first." },
    ],
    correct: "continue_with_supervision",
    reasoning: "Passive, non-urgent ideation in an engaged minor with support needs skilled assessment, not an ER visit. But it must be supervised and the parents informed. Emergency referral for every thought would flood the system and damage trust.",
    over_referral_trap: true,
  },
  {
    id: "ood-14",
    vignette: "A client's wife asks you directly how her husband's sessions are going. He has not consented to sharing anything.",
    options: [
      { option: "continue", label: "Refuse — confidentiality holds unless he consents; explain that to her kindly." },
      { option: "continue_with_supervision", label: "Tell her general things but not details." },
      { option: "refer_psychiatrist", label: "Refer her to the psychiatrist for answers." },
      { option: "medical_workup_first", label: "Not applicable — this is a confidentiality question." },
    ],
    correct: "continue",
    reasoning: "Confidentiality is the client's, not the family's. A polite refusal with an offer to discuss what HE wants shared is the entire skill here.",
  },
  {
    id: "ood-15",
    vignette: "Your client, who is a distant relative of a friend, asks if you can 'just see them informally over tea' to talk about their marriage — 'no paperwork, it's not a real session'.",
    options: [
      { option: "continue", label: "Agree — informal advice is harmless and keeps it casual." },
      { option: "continue_with_supervision", label: "Agree but tell a supervisor." },
      { option: "refer_psychiatrist", label: "Refuse the informal arrangement — dual relationship + no record = unsafe for both of you." },
      { option: "medical_workup_first", label: "Not applicable — this is a boundary question." },
    ],
    correct: "refer_psychiatrist",
    reasoning: "Treating a friend's relative informally, with no consent, no record and no boundaries, is how complaints are born. The correct call is a proper appointment or a proper referral — never 'just tea'.",
  },
  {
    id: "ood-16",
    vignette: "A client in your care for two months — previously fine — has stopped sleeping, is talking fast, spending recklessly, and says they've 'never felt better'. Family is worried.",
    options: [
      { option: "continue", label: "Enjoy the improvement — they said they're fine." },
      { option: "continue_with_supervision", label: "Note it and keep going." },
      { option: "refer_psychiatrist", label: "Suspected hypomania — refer for psychiatric review; the 'improvement' is the illness." },
      { option: "medical_workup_first", label: "Check thyroid first." },
    ],
    correct: "refer_psychiatrist",
    reasoning: "New-onset euphoric change with insomnia and reckless behaviour is mania/hypomania until proven otherwise. The elevation IS the symptom.",
  },
  {
    id: "ood-17",
    vignette: "A client with a known alcohol problem says they 'just need to detox at home' and asks you not to tell their GP. They've had withdrawal seizures before.",
    options: [
      { option: "continue", label: "Support home detox — it's their choice." },
      { option: "continue_with_supervision", label: "Support it but monitor." },
      { option: "refer_psychiatrist", label: "History of withdrawal seizures makes home detox dangerous — urgent medical referral." },
      { option: "medical_workup_first", label: "They need a medical assessment before any detox decision." },
    ],
    correct: "refer_psychiatrist",
    reasoning: "Alcohol withdrawal after seizures is a medical emergency — unsupervised detox can kill. This overrides their wish for secrecy.",
  },
  {
    id: "ood-18",
    vignette: "A 60-year-old client, three weeks post-op, is 'confused at night' and 'not herself'. The family assumes it's 'old age'. She has no psychiatric history.",
    options: [
      { option: "continue", label: "Reassure the family — it's probably the surgery." },
      { option: "continue_with_supervision", label: "Keep an eye on it and discuss." },
      { option: "refer_psychiatrist", label: "New confusion in a post-op older adult is delirium — urgent medical workup." },
      { option: "medical_workup_first", label: "Send for urgent medical review — infection/electrolytes are the first suspects." },
    ],
    correct: "medical_workup_first",
    reasoning: "Post-operative delirium is a medical emergency, not old age and not psychiatry-first. The workup comes before any 'psychiatric' label.",
  },
  {
    id: "ood-19",
    vignette: "A client is in tears because their partner died six weeks ago. They ask, 'Am I going mad? Everyone says I should be over it by now.'",
    options: [
      { option: "continue", label: "Normalise the grief and continue — this is your core work." },
      { option: "continue_with_supervision", label: "Continue and get supervision." },
      { option: "refer_psychiatrist", label: "Refer — grief is a medical problem." },
      { option: "medical_workup_first", label: "Check for a medical cause of the tears." },
    ],
    correct: "continue",
    reasoning: "Six weeks after a loss, intense grief is normal. Pathologising it is the error. No referral, no workup — presence.",
    over_referral_trap: true,
  },
  {
    id: "ood-20",
    vignette: "A 20-year-old client reports one episode of hearing their name called twice in an empty room, a month ago. Nothing since. They're functioning well and not distressed.",
    options: [
      { option: "continue", label: "Normalise — a single hypnagogic-type experience is common; monitor without drama." },
      { option: "continue_with_supervision", label: "Continue but log it with a supervisor." },
      { option: "refer_psychiatrist", label: "Any hallucination means immediate psychiatric referral." },
      { option: "medical_workup_first", label: "Send for a brain scan." },
    ],
    correct: "continue_with_supervision",
    reasoning: "An isolated, non-distressing experience in a functioning young person is not psychosis. Referral would be over-referral; silence would be under-referral. Document + supervise.",
    over_referral_trap: true,
  },
  {
    id: "ood-21",
    vignette: "A client who has been deteriorating for weeks is now telling you, calmly, that they have a plan to end their life with a specific method available at home. They ask you to 'just listen, not act'.",
    options: [
      { option: "continue", label: "Honour their wish — they asked you to listen." },
      { option: "continue_with_supervision", label: "Listen now, call a supervisor after." },
      { option: "refer_psychiatrist", label: "Specific plan + means = act now. Stay with them, involve family, urgent referral." },
      { option: "medical_workup_first", label: "Ask them to see a doctor first." },
    ],
    correct: "refer_psychiatrist",
    reasoning: "Specific plan + means + deterioration = imminent risk. 'Just listen' is a request you cannot honour. You stay with them and act.",
  },
  {
    id: "ood-22",
    vignette: "A 45-year-old client has been 'fine in therapy' for a year, but their blood pressure medicines keep getting changed because 'the doctor says my readings are crazy'. They describe racing heart and trembling every morning.",
    options: [
      { option: "continue", label: "Keep doing what works — therapy is going well." },
      { option: "continue_with_supervision", label: "Keep going, mention it to a supervisor." },
      { option: "refer_psychiatrist", label: "This sounds like anxiety — refer to a psychiatrist." },
      { option: "medical_workup_first", label: "The 'crazy readings' pattern needs a medical look — thyroid, caffeine, or BP meds themselves; work that up before labelling it anxiety." },
    ],
    correct: "medical_workup_first",
    reasoning: "Morning tremors with erratic BP readings could be hyperthyroidism, caffeine excess, or medication effects — not necessarily anxiety. Medical workup first; the label 'anxiety' can hide a medical cause.",
  },
  {
    id: "ood-23",
    vignette: "A mother brings her 8-year-old 'because he won't sit still and the teacher says he needs an ADHD certificate'. The child is playing quietly in the corner of your room.",
    options: [
      { option: "continue", label: "Assess the child properly over time — a certificate is not a first-session output." },
      { option: "continue_with_supervision", label: "Assess and get supervision." },
      { option: "refer_psychiatrist", label: "Refer — ADHD diagnosis is medical." },
      { option: "medical_workup_first", label: "Not applicable — this is an assessment question." },
    ],
    correct: "continue_with_supervision",
    reasoning: "The teacher's letter is a request, not a diagnosis. Proper multi-informant assessment over time is your work; a first-session certificate would be malpractice either way. Supervision keeps the pace honest.",
    over_referral_trap: true,
  },
  {
    id: "ood-24",
    vignette: "A client tells you they drink 'a lot' most nights to sleep, and now they've started hiding bottles from their partner. They're asking for help 'to stop'.",
    options: [
      { option: "continue", label: "Start motivational work — they've asked for help, that's the window." },
      { option: "continue_with_supervision", label: "Start and get supervision." },
      { option: "refer_psychiatrist", label: "Any alcohol problem is a medical problem." },
      { option: "medical_workup_first", label: "Check for withdrawal risk first — daily heavy drinking can need medical detox." },
    ],
    correct: "continue_with_supervision",
    reasoning: "Motivational work on alcohol is core counselling. The medical gate is withdrawal risk — if they drink daily in amounts that could cause withdrawal, medical review first. Start the work, supervise, and screen for withdrawal.",
  },
  {
    id: "ood-25",
    vignette: "A client with epilepsy tells you their 'psychologist' at another clinic said their seizures are 'all in their head' and they should see you for 'trauma work' instead.",
    options: [
      { option: "continue", label: "Begin trauma work — the other psychologist said so." },
      { option: "continue_with_supervision", label: "Begin and supervise." },
      { option: "refer_psychiatrist", label: "Non-epileptic seizures are possible but this needs neurological review before anyone 'treats' the seizures as psychological." },
      { option: "medical_workup_first", label: "This is a medical question — coordinate with their neurologist before doing anything." },
    ],
    correct: "medical_workup_first",
    reasoning: "Labeling seizures 'psychological' without current neurological review is dangerous. Psychogenic non-epileptic seizures are real, but the diagnosis belongs to the medical team — coordinate first.",
  },
  {
    id: "ood-26",
    vignette: "A client who you've been seeing for three months says they're going to a new psychiatrist who 'wants to put me on medicine'. They ask you whether they should take it.",
    options: [
      { option: "continue", label: "Give your honest opinion — you know them." },
      { option: "continue_with_supervision", label: "Discuss it in supervision first." },
      { option: "refer_psychiatrist", label: "Medication decisions belong to the prescriber — support them to discuss concerns with their psychiatrist, not with you as the decider." },
      { option: "medical_workup_first", label: "Not applicable — this is a medication-decision question." },
    ],
    correct: "continue_with_supervision",
    reasoning: "You can and should help them think through their fears and questions — that's therapy. But you decide nothing; you support their conversation with the prescriber and keep supervision in the loop.",
  },
  {
    id: "ood-27",
    vignette: "A 17-year-old client tells you they're pregnant and haven't told their parents. They want to keep it a secret and 'figure it out'. They are considering a termination they haven't discussed with anyone.",
    options: [
      { option: "continue", label: "Respect their autonomy fully — it's their body." },
      { option: "continue_with_supervision", label: "Support them and get urgent supervision — this is high-stakes decision-making with a minor." },
      { option: "refer_psychiatrist", label: "Refer to psychiatry." },
      { option: "medical_workup_first", label: "They need antenatal medical care first." },
    ],
    correct: "continue_with_supervision",
    reasoning: "A pregnant minor making a major irreversible decision needs your support AND supervision — you are not a medical or legal authority here, but you are a safe adult. Keep them connected to care.",
  },
  {
    id: "ood-28",
    vignette: "A client's employer calls you to ask whether the client is 'fit to work' and pressures you to share 'a status update'. The client has not consented.",
    options: [
      { option: "continue", label: "Refuse — no consent, no information. Offer the standard channels (a medical certificate from their treating doctor)." },
      { option: "continue_with_supervision", label: "Give vague reassurances like 'he's improving'." },
      { option: "refer_psychiatrist", label: "Refer the employer to the psychiatrist." },
      { option: "medical_workup_first", label: "Not applicable — this is a confidentiality question." },
    ],
    correct: "continue",
    reasoning: "Employer requests without consent are a hard no. 'Improving' is still a disclosure. The therapeutic relationship is yours to protect.",
  },
  {
    id: "ood-29",
    vignette: "A 30-year-old client is doing well in therapy but their mother calls you weekly 'just to check in' and asks how her child is doing 'because I'm worried'.",
    options: [
      { option: "continue", label: "Reassure her briefly each week — she's just a worried mother." },
      { option: "continue_with_supervision", label: "Keep the calls but log them." },
      { option: "refer_psychiatrist", label: "Tell her to call the psychiatrist instead." },
      { option: "medical_workup_first", label: "Not applicable — this is a boundary question." },
    ],
    correct: "continue",
    reasoning: "The weekly calls are a boundary erosion, not kindness. One warm conversation about confidentiality and a referral back to her child is the fix — not weekly updates, and not a referral.",
  },
  {
    id: "ood-30",
    vignette: "A client in their 50s, on antihypertensives and metformin, describes two weeks of 'feeling low and exhausted' after a medication change. No sleep change, no anhedonia, no past psychiatric history.",
    options: [
      { option: "continue", label: "Begin depression therapy — they said low." },
      { option: "continue_with_supervision", label: "Begin and supervise." },
      { option: "refer_psychiatrist", label: "Refer for depression." },
      { option: "medical_workup_first", label: "Low mood after a medication change in someone on multiple medicines needs a medical review first — this could be the drug itself, anaemia, or thyroid." },
    ],
    correct: "medical_workup_first",
    reasoning: "Low mood fully explained by a recent medical change is a medical problem until proven otherwise. Starting depression therapy without the workup teaches the student the over-diagnosis trap.",
  },
];

/** Score a decision. Over-referring (picking refer when continue is right) is tracked. */
export function scoreReferralDecision(s: OutOfDepthScenario, chosen: ReferralOption): { correct: boolean; overReferral: boolean } {
  const correct = chosen === s.correct;
  const overReferral = chosen === "refer_psychiatrist" && s.correct === "continue";
  return { correct, overReferral };
}
