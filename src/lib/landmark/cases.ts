/**
 * Landmark cases (v5 Part 5.2 / G) — original teaching narratives written in
 * Lumen's voice. Never reproduce source text. Each: the story, what was
 * believed then, what we understand now, the ethical failure where there was
 * one, and 3 quiz items. For the ethically compromised cases the PRIMARY
 * lesson is the ethics failure. Teach the contestation.
 */

export interface LandmarkQuizItem {
  question: string;
  options: string[];
  correct: number;
  rationale: string;
}

export interface LandmarkCase {
  id: string;
  title: string;
  domain: "neuropsychology" | "development" | "psychoanalytic" | "dissociation" | "social" | "indian";
  story: string;
  believedThen: string;
  understandNow: string;
  /** present only for ethically compromised cases — the primary lesson. */
  ethicsFailure?: string;
  /** what's contested — "here's what you were told, here's what held up". */
  contested?: string;
  quiz: LandmarkQuizItem[];
}

export const LANDMARK_CASES: LandmarkCase[] = [
  {
    id: "landmark-gage",
    title: "Phineas Gage",
    domain: "neuropsychology",
    story: "In 1848, a railway foreman survived an iron rod through his frontal lobes. His friends said 'Gage was no longer Gage' — the polite, reliable man became impulsive and profane.",
    believedThen: "That personality lived in a single 'seat' — and that the accident proved it was the front of the brain.",
    understandNow: "The frontal lobes modulate behaviour, but personality is distributed. Gage is the origin story of 'executive function' — and later accounts note his social recovery was better than the myth claimed.",
    quiz: [
      { question: "What is Gage's lasting lesson?", options: ["Trauma always destroys personality", "The frontal lobes modulate impulse and social behaviour", "Personality is fixed at birth", "Brain injury always improves people"], correct: 1, rationale: "Gage demonstrated that frontal damage changes social-emotional regulation — the founding case of executive function." },
      { question: "Why is the 'Gage was no longer Gage' account now qualified?", options: ["It was invented by the press", "Later evidence shows significant social recovery, complicating the myth", "His family denied it", "He was fine afterwards"], correct: 1, rationale: "Modern re-analysis suggests his functioning recovered more than the legend, teaching students to read famous cases critically." },
      { question: "What domain does Gage belong to?", options: ["Psychoanalysis", "Developmental psychology", "Neuropsychology", "Social psychology"], correct: 2, rationale: "Gage is a neuropsychology landmark — brain-behaviour mapping." },
    ],
  },
  {
    id: "landmark-hm",
    title: "H.M. (Henry Molaison)",
    domain: "neuropsychology",
    story: "To stop severe epilepsy, Molaison had both medial temporal lobes removed in 1953. The epilepsy improved. He could no longer form new memories — his life froze at the operation.",
    believedThen: "Memory was a single faculty; the brain didn't 'store' experiences in a way an operation could destroy.",
    understandNow: "H.M. revealed the distinction between declarative memory (what — gone for him) and procedural memory (how — intact). He could learn a mirror-tracing task and deny ever having seen it. That split is still the backbone of memory science.",
    quiz: [
      { question: "H.M. taught us that memory is:", options: ["A single unified faculty", "Divided into declarative and procedural systems", "Located entirely in the hippocampus", "Purely emotional"], correct: 1, rationale: "H.M.'s intact procedural learning alongside lost declarative memory proved memory is multiple systems." },
      { question: "Which task could H.M. learn despite his amnesia?", options: ["A word list", "Names of faces", "Mirror-tracing", "A new language"], correct: 2, rationale: "Procedural (skill) memory survived; declarative did not — mirror-tracing is a skill." },
    ],
  },
  {
    id: "landmark-little-albert",
    title: "Little Albert",
    domain: "development",
    story: "In 1920, John Watson conditioned an 11-month-old infant to fear a white rat by pairing it with a loud noise. Albert's fear generalised to a rabbit, a dog, and a fur coat.",
    believedThen: "That this proved human fear is a learned reflex, and that conditioning principles could explain adult phobia.",
    understandNow: "It demonstrated conditioned emotional responses — but the cost was unacceptable by any modern standard. No consent, an infant who couldn't withdraw, and no deconditioning was ever performed. The primary lesson is the ethics failure, not the finding.",
    ethicsFailure: "No consent (an infant cannot consent), no opportunity to withdraw, and Albert was never deconditioned — the study created distress it refused to repair. This is why consent procedures and debriefing exist.",
    contested: "Later research never confirmed Albert's identity or long-term outcome; the 'success' rests on Watson's reports alone.",
    quiz: [
      { question: "What is the PRIMARY lesson of Little Albert?", options: ["Fear can be conditioned", "Classical conditioning works on humans", "The ethics failure — consentless distress on an infant", "Rats cause fear"], correct: 2, rationale: "The finding is real but the method is indefensible — that is the lesson to teach." },
      { question: "Why is Albert's case now a teaching example of bad research?", options: ["The result was fake", "No consent, no debriefing, no repair of the distress", "He was too old", "It used too many animals"], correct: 1, rationale: "Consentless conditioning of an infant with no deconditioning is the canonical ethics failure." },
    ],
  },
  {
    id: "landmark-genie",
    title: "Genie",
    domain: "development",
    story: "In 1970, a 13-year-old girl was found in Los Angeles after being isolated in a room for over a decade. Researchers raced to study whether language could develop after the 'critical period'.",
    believedThen: "That studying Genie could settle whether language acquisition has a critical period — an opportunity the scientific community treated as urgent.",
    understandNow: "Genie acquired some language but never full grammar, supporting a critical-period view. But the research became a second exploitation: scientists fought over her, and the funding that paid her care ended when the findings did. She re-entered institutions where she regressed.",
    ethicsFailure: "Genie was treated as a research opportunity first and a child second — competing researchers, no durable care, and abandonment when the science moved on. The lesson is that a human subject is never 'the data'.",
    quiz: [
      { question: "What does Genie's case primarily teach us today?", options: ["Language has a critical period", "Isolation causes language delay", "The exploitation of a vulnerable person in the name of science", "Adoption is always harmful"], correct: 2, rationale: "Genie is now taught as much for the failure of research ethics as for language development." },
      { question: "What was the ethical failure in Genie's care?", options: ["She got too much therapy", "Research interest overrode her wellbeing and durable care", "She was overpaid", "The media ignored her"], correct: 1, rationale: "The researchers' competition and withdrawal of care when findings ended is the failure." },
    ],
  },
  {
    id: "landmark-roshdan",
    title: "Rosenhan's 'On Being Sane in Insane Places'",
    domain: "social",
    story: "In 1973, eight 'pseudopatients' presented to psychiatric hospitals claiming to hear a voice saying 'empty', 'hollow', and 'thud'. All but one were admitted; all received a diagnosis; none were detected as sane by staff. Some stayed 52 days.",
    believedThen: "That psychiatrists could reliably distinguish sane from insane — Rosenhan's study seemed to prove they could not, and it fuelled a wave of deinstitutionalisation.",
    understandNow: "The study's influence is real but its methods were seriously challenged. Only one patient was ever followed up; the famous 'hits' may have been influenced by prior knowledge; and later replications failed. The lesson is not 'diagnosis is fake' — it is that context powerfully shapes interpretation, and that a single study must not become a religion.",
    ethicsFailure: "The pseudopatients were admitted as impostors, occupying scarce beds and deceiving staff, while real patients bore the cost of the disruption. The ends — institutional critique — did not justify the deception of patients and hospitals. The lesson is that method must not sacrifice the people it studies.",
    contested: "Rosenhan's data was substantially challenged. The claim 'we can't tell sane from insane' overreached the evidence; the institutional critique survived better than the specifics.",
    quiz: [
      { question: "What is the defensible lesson from Rosenhan?", options: ["Psychiatric diagnosis is meaningless", "Context shapes clinical interpretation, and institutions can dehumanise", "Psychiatrists are deliberately dishonest", "All hospitalisation is wrong"], correct: 1, rationale: "The critique of institutional context survived; the sweeping 'diagnosis is fake' claim did not." },
      { question: "Why teach the contestation of Rosenhan?", options: ["To discredit all psychology", "So students learn that a famous finding may not survive scrutiny", "To prove pseudopatients are common", "To defend asylums"], correct: 1, rationale: "'Here's what you were told, here's what held up' is the skill — critical reading of evidence." },
    ],
  },
  {
    id: "landmark-stanford",
    title: "The Stanford Prison Experiment",
    domain: "social",
    story: "In 1971, students were randomly assigned to be guards or prisoners in a mock prison in a Stanford basement. Within days, guards became brutal and prisoners broke down. The study was stopped after 6 days of a planned 14.",
    believedThen: "That it proved the power of roles and situations over individual character — the 'evil is banal, the situation is the thing' lesson.",
    understandNow: "The findings were real but the methods have been substantially reassessed. Zimbardo influenced the outcome in ways later reported (instructions to guards, lack of oversight), and replications show far weaker effects. The situation matters; the 'lucid experiment' framing overreached.",
    ethicsFailure: "Participants were distressed and harmed, consent did not cover the actual experience, and there was no independent oversight to stop it earlier. It is now taught as a failure of research ethics as much as a social-psychology finding.",
    contested: "The methodology has been seriously reassessed — the 'situational evil' narrative oversimplifies, and some of the guard behaviour was actively coached.",
    quiz: [
      { question: "What is the primary lesson of Stanford Prison today?", options: ["Roles inevitably create evil", "The ethics failure — uncontrolled harm to participants", "Guards are naturally cruel", "Prisons don't work"], correct: 1, rationale: "The study's ethics (harm without adequate consent or oversight) is the enduring lesson." },
      { question: "Why is the 'situational evil' claim now qualified?", options: ["It was completely fabricated", "Later analysis showed experimenter influence and weak replications", "It only worked with animals", "Participants were professionals"], correct: 1, rationale: "Zimbardo's influence and failed replications mean the sweeping claim overreached the evidence." },
    ],
  },
  {
    id: "landmark-erwadi",
    title: "The Erwadi fire and the MHA 2017",
    domain: "indian",
    story: "In August 2001, a fire swept through a thatched 'healing' institution in Erwadi, Tamil Nadu, killing 26 people who were shackled to beds. Many had been chained for years; none could flee.",
    believedThen: "That unlicensed faith-based 'asylums' were a legitimate way to handle people the family and state could not manage — chains and confinement were accepted practice.",
    understandNow: "The fire exposed that the state's mental-health law (the 1987 Act) had never been implemented. The tragedy catalysed reform and shaped the Mental Healthcare Act 2017: the right to mental healthcare, the prohibition of inhuman or degrading treatment, and the ban on seclusion or restraint except in narrow, reviewable circumstances. The MHA 2017 exists, in part, because 26 people died chained to their beds.",
    quiz: [
      { question: "Why does the Erwadi fire matter to Indian mental-health practice?", options: ["It was an isolated accident", "It exposed unlicensed institutions and catalysed the MHA 2017's protections", "It proved institutional care is safe", "It had no consequences"], correct: 1, rationale: "The fire showed the human cost of unregulated confinement and shaped the MHA 2017." },
      { question: "What does the MHA 2017 prohibit as a direct response?", options: ["All psychiatric care", "Seclusion and restraint except in narrow reviewable cases", "Family involvement", "Community treatment"], correct: 1, rationale: "The MHA 2017 bans inhuman treatment, with strict limits on restraint." },
    ],
  },
];
