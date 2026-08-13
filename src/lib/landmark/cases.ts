/**
 * Landmark cases (v5 Part 5.2 / G) — original teaching narratives written in
 * the programme's teaching voice. Never reproduce source text. Each: the story, what was
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
  {
    id: "landmark-clive",
    title: "Clive Wearing",
    domain: "neuropsychology",
    story: "A renowned musician whose encephalitis destroyed his hippocampus, leaving him with an anterograde amnesia so severe he experiences each moment as new — yet he still plays the piano and conducts a choir fluently.",
    believedThen: "That memory was a single unified faculty — if it failed, everything failed together.",
    understandNow: "Wearing's preserved musical ability with devastated episodic memory demonstrates that memory is not one system but many: procedural memory survived while declarative memory did not. He also retains his love for his wife, showing emotion's independence from episodic recall.",
    quiz: [
      { question: "What does Clive Wearing teach about memory?", options: ["Memory is destroyed or intact as a whole", "Procedural and declarative memory are separate systems", "Musicians never lose memory", "Amnesia erases emotion"], correct: 1, rationale: "His piano-playing with total episodic amnesia is the classic dissociation of procedural from declarative memory." },
      { question: "Why does Wearing still recognise love despite amnesia?", options: ["He fakes it", "Emotional bonds are encoded outside episodic memory", "His wife reminds him constantly", "He only loves music"], correct: 1, rationale: "Emotional and evaluative processing survives the episodic-memory loss — the person beneath the amnesia persists." },
    ],
  },
  {
    id: "landmark-anna-o",
    title: "Anna O. (Bertha Pappenheim)",
    domain: "psychoanalytic",
    story: "The first 'talking cure' — a young woman whose symptoms (paralyses, hallucinations) improved when she talked them out with Breuer. Freud built psychoanalysis on her case; the case was also a warning about boundary violations.",
    believedThen: "That 'catharsis' — discharging pent-up emotion through speech — was the mechanism of cure.",
    understandNow: "The case is retrospectively seen as possibly dissociative or conversion symptoms, and Breuer's intense involvement (his wife's jealousy ended the case) reads today as an early example of the transference-countertransference entanglement that modern codes govern. She later became a pioneering social worker — a life beyond the couch the case narrative omits.",
    ethicsFailure: "Breuer's emotional entanglement with a patient and the case's publication without her full informed consent — the founding scandal of psychoanalytic boundaries.",
    quiz: [
      { question: "What is the modern reading of Anna O.?", options: ["She was cured by hypnosis", "The case likely involved dissociative/conversion symptoms and boundary blurring", "She was faking", "Breuer was innocent"], correct: 1, rationale: "Retrospective analysis suggests dissociation, and the case exemplifies boundary entanglement." },
      { question: "What does Anna O. teach about professional boundaries?", options: ["Intense involvement is therapeutic", "Transference entanglements are the origin of modern boundary codes", "Patients should be friends", "Emotion is unprofessional"], correct: 1, rationale: "The Breuer entanglement became the cautionary origin of transference-boundary rules." },
    ],
  },
  {
    id: "landmark-dora",
    title: "Dora (Ida Bauer)",
    domain: "psychoanalytic",
    story: "Freud's famous 'fragment of an analysis' — a teenage girl whose treatment ended after 11 weeks, famously 'the case that failed'. She left, Freud analysed the failure as resistance.",
    believedThen: "That the patient's abrupt exit was resistance to an accurate interpretation.",
    understandNow: "Modern readers see Dora's departure as a rational exit from an analysis where she felt disbelieved — her accounts of being handed over between adults were read as fantasy. The case is now taught as a lesson in how the clinician's theory can deafen them to the patient's reality.",
    ethicsFailure: "A minor's disclosures were interpreted through theory rather than taken at face value — the pattern that the field spent a century correcting.",
    quiz: [
      { question: "Why is Dora taught today?", options: ["As a model of successful analysis", "As a cautionary tale: theory can deafen the clinician to the patient's account", "As proof teenagers can't be analysed", "As a triumph of interpretation"], correct: 1, rationale: "Dora's exit is reread as rational; the case teaches listening over interpretation." },
      { question: "What does Dora's abrupt ending illustrate?", options: ["Patients are always resistant", "The patient may be leaving a relationship that doesn't believe them", "Short analysis never works", "Adolescents are untreatable"], correct: 1, rationale: "Her departure reads as a healthy exit from disbelief, reframing 'resistance' as signal." },
    ],
  },
  {
    id: "landmark-rat-man",
    title: "The Rat Man (Ernst Lanzer)",
    domain: "psychoanalytic",
    story: "Freud's detailed case of obsessional neurosis — a young officer tormented by intrusive ideas about a rat punishment and his own aggressive impulses. The analysis became the model for understanding obsessive-compulsive dynamics.",
    believedThen: "That obsessions were symbolic expressions of unconscious conflict, decodable through free association.",
    understandNow: "The case remains a rich descriptive record of obsessional phenomenology — the intrusive ideas, the magical thinking, the doubt — even though the specific psychoanalytic mechanism is contested. Modern OCD treatment (exposure and response prevention) works on the behaviour, not the symbolism.",
    quiz: [
      { question: "What survives from the Rat Man case?", options: ["The psychoanalytic mechanism is proven", "A rich description of obsessional phenomenology — intrusive ideas, doubt, magical thinking", "Evidence that free association cures OCD", "Nothing"], correct: 1, rationale: "The phenomenology is durable; the causal story is contested." },
      { question: "How does modern OCD treatment differ from the Rat Man's?", options: ["It's identical", "It targets behaviour via exposure and response prevention, not symbolic interpretation", "It uses hypnosis", "It avoids the thoughts entirely"], correct: 1, rationale: "ERP treats the behaviour; the symbolic reading is history." },
    ],
  },
  {
    id: "landmark-schreber",
    title: "Daniel Paul Schreber",
    domain: "psychoanalytic",
    story: "A German judge who wrote a detailed memoir of his psychosis — delusions of being transformed, of divine persecution. Freud analysed the memoir; Schreber's own account became foundational data for understanding psychosis from within.",
    believedThen: "That psychosis was comprehensible as symbolic autobiography — Freud read the delusions as expression of internal conflict.",
    understandNow: "Schreber's memoir is read today as a first-person document of psychotic experience — valuable for what it shows about delusional experience and institutional treatment, while the specific psychoanalytic interpretation is heavily contested. It also stands as a record of how a powerful man's illness was managed by the system of the day.",
    quiz: [
      { question: "Why does Schreber's memoir matter?", options: ["It proves Freud's theory", "It is a rare first-person account of psychotic experience from within", "It shows psychosis is fake", "It is a legal document only"], correct: 1, rationale: "First-person accounts of psychosis are rare and clinically valuable." },
      { question: "What is the status of Freud's analysis of Schreber?", options: ["Universally accepted", "Contested — the memoir's value is the phenomenology, not the symbolic reading", "Disproven by Schreber's recovery", "Irrelevant"], correct: 1, rationale: "The interpretation is contested; the phenomenology endures." },
    ],
  },
  {
    id: "landmark-sizemore",
    title: "Chris Costner Sizemore",
    domain: "dissociation",
    story: "The woman behind 'The Three Faces of Eve' — a film and book that brought dissociative identity disorder (then multiple personality disorder) into popular consciousness. She later wrote her own account under her real name.",
    believedThen: "That the case demonstrated stable, separable 'personalities' — the popular image of the disorder.",
    understandNow: "Sizemore's own later writings complicate the picture: she described more than three 'faces' and a long recovery. The case fuels the ongoing contestation about whether DID reflects genuine dissociative states or culturally-shaped presentations — the debate itself is the teaching point.",
    quiz: [
      { question: "What does Sizemore's own account add?", options: ["It confirms exactly three personalities", "It complicates the popular image — more states, a long recovery, and the authorship question", "It disproves dissociation entirely", "Nothing"], correct: 1, rationale: "Her memoir shows the popular 'three faces' framing was a simplification." },
      { question: "How should students hold the DID debate?", options: ["DID is proven fake", "DID is proven real", "The phenomenology is real for those who live it; the causal and cultural account is contested", "Ignore it"], correct: 1, rationale: "Respect the experience while holding the scientific contestation — that is the skill." },
    ],
  },
  {
    id: "landmark-saks",
    title: "Elyn Saks",
    domain: "dissociation",
    story: "A law professor who wrote candidly about living with schizophrenia — hallucinations, thought disorder, hospitalisations — and went on to a distinguished academic career. Her memoir reframes what recovery from serious mental illness can look like.",
    believedThen: "That schizophrenia was a progressive deterioration with near-certain poor outcome.",
    understandNow: "Saks embodies the heterogeneity of outcome: with treatment, support and a life of meaning, serious mental illness is compatible with professional achievement. Her account also documents the trauma of involuntary treatment, informing debates about coercion in psychiatry.",
    quiz: [
      { question: "What does Elyn Saks demonstrate?", options: ["Schizophrenia always leads to deterioration", "Serious mental illness can coexist with a distinguished professional life, with treatment and support", "Recovery is impossible", "Medication is unnecessary"], correct: 1, rationale: "Her career and candid account show outcome heterogeneity — recovery is real." },
      { question: "What ethical tension does her account expose?", options: ["None", "The trauma of involuntary treatment alongside its necessity in some crises", "That law and psychiatry don't mix", "That she was never ill"], correct: 1, rationale: "Her hospitalisation accounts fuel the coercion debate." },
    ],
  },
  {
    id: "landmark-milgram",
    title: "The Milgram obedience studies",
    domain: "social",
    story: "In 1961, volunteers were asked to deliver what they believed were increasingly severe shocks to a 'learner'. Two-thirds administered the highest voltage. The study became the emblem of ordinary people's capacity to obey authority.",
    believedThen: "That only a pathological minority would obey authority to the point of harm — and that the results revealed a universal human tendency.",
    understandNow: "The obedience finding is real but its interpretation is contested: later analysis emphasises the incremental nature of the requests, the perceived legitimacy of the setting, and the participants' belief that responsibility rested with the experimenter. The study's ethics — deception and distress without meaningful withdrawal — are themselves the primary lesson for modern research conduct.",
    ethicsFailure: "Deception, psychological distress, and inadequate informed consent — the study that reshaped research ethics codes.",
    quiz: [
      { question: "What is the enduring lesson of Milgram?", options: ["People are evil", "Situation, incremental demands and perceived legitimacy shape obedience — and the ethics are the real lesson", "Authority is always obeyed", "The results were faked"], correct: 1, rationale: "Situational factors, not character, drove obedience; the ethics failure reshaped research rules." },
      { question: "Why is Milgram taught as an ethics case?", options: ["Because it succeeded", "Deception and distress without adequate consent are now considered unacceptable", "Because it failed", "Because it was anonymous"], correct: 1, rationale: "The deception and distress produced modern informed-consent standards." },
    ],
  },
  {
    id: "landmark-genovese",
    title: "Kitty Genovese and the '38 witnesses'",
    domain: "social",
    story: "In 1964, Kitty Genovese was killed in Queens while, according to the original front-page story, 38 witnesses watched and did nothing. The story launched the 'bystander effect' as a pillar of social psychology.",
    believedThen: "That 38 people watched a murder and failed to intervene — proof of urban apathy.",
    understandNow: "The 38-witnesses story was largely inaccurate: the '38' came from a police commissioner's estimate, most witnesses saw only fragments and didn't realise an assault was in progress, and at least two people did call the police. The bystander effect research (Latané & Darley) remains real, but the Genovese case is now taught as a cautionary tale about how a vivid, partly-invented story became canon — the contestation IS the lesson.",
    contested: "The '38 witnesses' framing was substantially exaggerated; the bystander research it inspired is solid, the case narrative is not.",
    quiz: [
      { question: "What is the modern correction to the Genovese story?", options: ["All 38 watched and did nothing", "The 38-witness claim was largely inaccurate — most saw fragments, some did call", "Bystanders are always apathetic", "The murder never happened"], correct: 1, rationale: "The famous narrative was exaggerated; the lesson is to read famous stories critically." },
      { question: "Why teach the Genovese contestation?", options: ["To discredit social psychology", "To show that vivid canonical stories can be partly invented while the research they inspire is real", "To shame witnesses", "To prove the bystander effect is fake"], correct: 1, rationale: "Distinguishing the myth from the research is critical reading." },
    ],
  },
  {
    id: "landmark-reimer",
    title: "David Reimer",
    domain: "development",
    story: "After a botched circumcision destroyed his penis in infancy, David was raised as 'Brenda' under John Money's 'gender neutrality' theory — that gender identity is learned and could be assigned. He was told the truth as a teenager and lived the rest of his life as David.",
    believedThen: "That gender identity was a product of socialisation, assigned at birth and trainable — the case was presented as proof.",
    understandNow: "The 'case of the century' is now read as a cautionary tale: the theory was wrong, the interventions were harmful, and the evidence was misrepresented by the researcher for decades. David's later suicide is inseparable from the harms of the experiment.",
    ethicsFailure: "An unproven theory was imposed on an infant with irreversible interventions, and the outcome was misrepresented to the field for years.",
    quiz: [
      { question: "What does David Reimer's case demonstrate?", options: ["Gender identity is socially assigned", "Gender identity is not simply assignable — and unproven theory was imposed on a child with harmful irreversible interventions", "The theory was correct", "The case was a hoax"], correct: 1, rationale: "The 'gender neutrality' theory collapsed; the case teaches the ethics of irreversible intervention on children." },
      { question: "Why is Reimer a research-ethics landmark?", options: ["It succeeded", "An unproven theory drove irreversible harm, and the evidence was misreported for decades", "It was anonymous", "It involved adults only"], correct: 1, rationale: "The misreported outcome and irreversibility make it a canonical ethics failure." },
    ],
  },
  {
    id: "landmark-little-albert-ethics",
    title: "Little Albert — the ethics reread",
    domain: "development",
    story: "John Watson's 1920 experiment conditioned an infant, 'Little Albert', to fear a white rat by pairing it with a loud noise. The boy left the study before the fear was ever unconditioned.",
    believedThen: "That the study cleanly demonstrated that fears are learned — and that a brief experiment on an infant was acceptable.",
    understandNow: "The ethics failure is now the primary lesson: no parental informed consent in any meaningful sense, distress inflicted on an infant, and the feared response was never removed before the child left — the 'unconditioning' Watson promised never happened. It remains the founding case of behaviourism's evidence AND its cautionary tale.",
    ethicsFailure: "An infant was conditioned to fear without adequate consent, and the distress was never reversed.",
    quiz: [
      { question: "What is the primary modern lesson of Little Albert?", options: ["Fears are always learned", "The ethics failure — an infant conditioned to fear without consent and never unconditioned", "Conditioning is fake", "Infants can't learn"], correct: 1, rationale: "The ethics failure is now taught as the primary lesson." },
      { question: "Why is the missing unconditioning significant?", options: ["It's irrelevant", "Watson promised to remove the fear and never did — leaving the infant distressed", "It proves learning", "It was intentional"], correct: 1, rationale: "The unremoved fear compounds the ethical violation." },
    ],
  },
  {
    id: "landmark-hm-consent",
    title: "H.M. — consent in the golden age",
    domain: "neuropsychology",
    story: "Henry Molaison's bilateral hippocampal removal (for epilepsy) produced the most studied amnesia case in history. He could not form new episodic memories — yet was a willing, cooperative research participant for five decades.",
    believedThen: "That the surgery was the price of epilepsy relief, and that his lifelong participation was unproblematic.",
    understandNow: "His contribution is enormous (memory systems science), but the case also raises consent questions: his retrograde consent was given before surgery that produced a disability he could not later fully comprehend, and decades of testing operated on a man who could not remember agreeing. The case teaches that even the most valuable data can carry an unresolved ethical residue.",
    quiz: [
      { question: "What does H.M. contribute?", options: ["Nothing", "The foundational evidence that the hippocampus is essential to forming new episodic memories", "Proof memory is one system", "A surgical success story"], correct: 1, rationale: "H.M. is the canonical case for hippocampal-dependent memory formation." },
      { question: "What ethical question does H.M. raise?", options: ["None", "Consent for irreversible surgery and testing a man who cannot remember agreeing", "That research is always harmful", "That amnesia is fake"], correct: 1, rationale: "His incapacity to remember consent frames the modern informed-consent debate." },
    ],
  },
  {
    id: "landmark-ranki",
    title: "The Ranchi European Lunatic Asylum — Indian asylum history",
    domain: "indian",
    story: "From 1918, the Ranchi European Lunatic Asylum (later the Ranchi Indian Mental Hospital) was among India's first modern psychiatric institutions — built on colonial lines that separated 'European' and 'native' patients, with occupational therapy and moral treatment rhetoric that masked the segregation at its core.",
    believedThen: "That colonial-era psychiatry was benevolent science — humane care for the mentally ill regardless of who they were.",
    understandNow: "The asylum's history is a lesson in how institutions encode the hierarchies of their era: separate wards, separate standards, and a 'lunacy' law built to manage empire as much as illness. The Indian Mental Health Act 1987 and the MHA 2017 are, in part, the long correction of that inheritance.",
    quiz: [
      { question: "What does the Ranchi asylum history teach?", options: ["Colonial asylums were perfectly humane", "Institutions encode their era's hierarchies — race, class and power shaped 'care'", "Indian psychiatry began in 1947", "Asylums never existed in India"], correct: 1, rationale: "The segregated wards show how social hierarchy shaped psychiatric practice." },
      { question: "How does the MHA 2017 respond to that history?", options: ["It continues segregation", "It centres rights, dignity and equality of treatment", "It ignores the past", "It only governs asylums"], correct: 1, rationale: "The 2017 Act's rights-based framing is the correction of the institutional inheritance." },
    ],
  },
  {
    id: "landmark-beri-beri",
    title: "The beriberi 'insanity' — the medical-mimic history",
    domain: "indian",
    story: "In colonial Indian hospitals, patients presenting with confusion, apathy and memory loss were routinely diagnosed as 'insane' — until the post-mortems and later clinical work revealed that a large share had beriberi and other deficiency states that had never been examined for. The label came first; the body was never asked.",
    believedThen: "That unexplained behavioural change in Indian patients was 'hysteria' or 'insanity' — a characterological or racial explanation sufficed.",
    understandNow: "The case is the historical ancestor of today's medical-mimic trap: the psychiatric label that precedes the physical examination. Every modern 'B12 depression' and 'thyroid anxiety' is the descendant of this pattern — the lesson is that the workup precedes the label.",
    quiz: [
      { question: "What does the beriberi history teach?", options: ["Colonial doctors were always right", "The psychiatric label can precede and suppress the physical workup — a pattern that survives today", "Deficiency states never mimic psychosis", "Behavioural change is never medical"], correct: 1, rationale: "The label-first pattern is the ancestor of the modern medical-mimic trap." },
      { question: "Why does this matter for a counselling student?", options: ["It doesn't — counselling never touches medicine", "It teaches that 'unexplained' change deserves the medical screen before the psychological label", "It proves all Indian patients were misdiagnosed", "It only matters historically"], correct: 1, rationale: "The workup-before-label discipline is directly transferable to modern practice." },
    ],
  },
  {
    id: "landmark-morselli",
    title: "The 'influenza psychosis' of 1918 — pandemic psychiatry in India",
    domain: "indian",
    story: "During the 1918 influenza pandemic (which killed millions in India), asylums reported a striking rise in admissions for 'influenza psychosis' — confusional states, delirium-like pictures, and prolonged behavioural changes attributed to the infection itself. Doctors argued about whether the virus caused 'insanity' directly or through fever, drugs and social collapse.",
    believedThen: "That a single infectious agent directly produced a specific 'psychosis' — a clean cause-and-effect story.",
    understandNow: "The episode teaches the modern lesson of post-infectious and post-ICU neuropsychiatric presentations: the delirium, the encephalitis-adjacent pictures, and the distinction between the infection's direct effects and the trauma of the illness. Pandemic psychiatry is not new — and neither is the error of collapsing a complex presentation into one agent.",
    quiz: [
      { question: "What survives from the 1918 'influenza psychosis' episode?", options: ["The virus directly caused one specific psychosis", "The complexity — delirium, post-infectious change, and the social collapse all interacted", "Pandemics never affect mental health", "It was all hysteria"], correct: 1, rationale: "The episode prefigures modern post-infectious neuropsychiatric presentations." },
      { question: "Why does pandemic psychiatry history matter now?", options: ["It doesn't", "Post-infectious and post-ICU neuropsychiatric presentations have a long documented ancestry", "COVID invented these presentations", "Only virologists should study it"], correct: 1, rationale: "Understanding the 1918 pattern sharpens modern assessment of post-infectious change." },
    ],
  },
  {
    id: "landmark-bhopal",
    title: "The Bhopal gas tragedy — disaster mental-health sequelae",
    domain: "indian",
    story: "In 1984, a gas leak in Bhopal killed thousands and exposed hundreds of thousands more. Years later, survivors showed elevated rates of anxiety, depression, PTSD-like syndromes, and somatic complaints that the official medical response — focused on lungs and eyes — barely measured. The disaster became one of India's first mass trauma-and-mental-health case studies.",
    believedThen: "That the disaster's health legacy was purely physical — lungs, eyes, the acute exposures.",
    understandNow: "The Bhopal legacy demonstrates the long arc of mass-trauma mental health: somatic complaint carriers, unmeasured anxiety in compensation processes that retraumatised claimants, and the intergenerational transmission of fear. It is taught as the reason disaster mental-health planning belongs in every emergency response.",
    quiz: [
      { question: "What does Bhopal teach about disaster mental health?", options: ["Disasters are purely physical events", "Mental-health sequelae are long, somatic-heavy, and easily missed when the medical lens dominates", "Survivors recover within a year", "Anxiety never follows disasters"], correct: 1, rationale: "Bhopal's unmeasured trauma legacy is the canonical Indian lesson in disaster mental-health planning." },
      { question: "Why does compensation process matter to mental health?", options: ["It doesn't", "Retraumatising claim processes worsen the trauma — how survivors are treated heals or harms", "Compensation is purely financial", "Claims never affect wellbeing"], correct: 1, rationale: "The process itself became a source of renewed distress — a clinical lesson about systems." },
    ],
  },
  {
    id: "landmark-jallianwala",
    title: "Jallianwala Bagh — the trauma that a nation carried",
    domain: "indian",
    story: "In 1919, troops fired on an unarmed gathering in Amritsar, killing hundreds. Beyond the deaths, the massacre's survivors and witnesses carried acute and chronic trauma — the unspoken psychological legacy of colonial violence that Indian psychiatry would later have to reckon with in partition and beyond.",
    believedThen: "That the political event was everything — the psychological aftermath was invisible to the colonial record.",
    understandNow: "The case is taught as the origin of a pattern: collective violence creates collective trauma that hides in silence and somatic complaint for generations. It frames the later work on partition displacement and the Erwadi-era reckoning — trauma is not a footnote to history, it is the history's unexamined residue.",
    quiz: [
      { question: "Why teach Jallianwala Bagh in a psychology course?", options: ["It's a political topic only", "Collective violence creates collective trauma that surfaces in silence and somatic complaint for generations", "Trauma is always individual", "The massacre had no psychological effects"], correct: 1, rationale: "The unrecorded psychological aftermath is the lesson — collective trauma has a long clinical tail." },
      { question: "How does the massacre connect to later Indian psychiatric history?", options: ["It doesn't", "The pattern of collective-violence trauma recurs in partition and the asylum era", "Psychiatry began after 1947", "No connection exists"], correct: 1, rationale: "The same dynamics — silence, somatic presentation, unrecorded distress — recur across Indian trauma history." },
    ],
  },
  {
    id: "landmark-partition",
    title: "Partition displacement — the largest unrecorded trauma",
    domain: "indian",
    story: "In 1947, partition uprooted millions across the new borders. Families were separated, homes lost, violence witnessed — and for decades the psychological toll went largely unmeasured in official records. Clinicians and writers recorded what the state did not: the survivors' insomnia, the sudden rage, the silences.",
    believedThen: "That partition was a migration problem — logistics, registries, rehabilitation; the 'insanity' admissions it caused were noted but never studied as trauma.",
    understandNow: "Partition is the paradigm of unmeasured mass trauma: the clinical presentations (dissociation, somatic distress, intergenerational silence) are reconstructable only from literature, family memory and scattered asylum records. It teaches that absence of diagnosis is not absence of distress — and that rehabilitation without psychological care repairs the surface only.",
    quiz: [
      { question: "What is the partition lesson for assessment?", options: ["Unrecorded distress isn't real", "Absence of diagnosis is not absence of distress — trauma can go unmeasured for decades", "Migrants never suffer trauma", "Official records are always complete"], correct: 1, rationale: "The unmeasured psychological toll is the lesson — assessment gaps are historical, not natural." },
      { question: "Why does intergenerational silence matter clinically?", options: ["It doesn't", "Unspoken family trauma surfaces in later generations' symptoms", "Silence always heals", "Only direct survivors are affected"], correct: 1, rationale: "Intergenerational transmission of unspoken trauma is a core modern framework — partition is its Indian paradigm." },
    ],
  },
];
