import { R, bm, concept, ly, tl, xp, type Concept } from "./kit";

/** Health, positive and organisational psychology, Indian psychology, ethics and law, and UGC Paper 1. */

const HL = ["health", "positive", "organisational", "counselling", "clinical-therapies"] as const;
const IN = ["indian-psychology", "positive", "clinical-therapies", "health"] as const;
const LAW = ["ethics-law", "clinical-psychiatry"] as const;

export const MISC: Concept[] = [
  /* ------------------------------------------------ health */
  concept("hl-wound", R(["health", "biological"], /wound heal|punch.?biopsy|kiecolt/i), "experiment", xp("Stress and wound healing", "Women caring for a relative with dementia and matched women who were not caregivers each had a tiny standard skin wound. How many days did it take to heal, on average?", "days", [
    ["Not caregivers", 39],
    ["Caregivers", 49],
  ], "The caregivers took about 9 days (24%) longer, and their immune cells made less of a cytokine needed for repair: chronic stress slows healing.", 60)),
  concept("hl-coping", R(HL, /coping|social support|buffer(ing)? hypothesis|hardiness|resilien|avoidant coping|approach coping|stress management|daily hassles|life events|holmes|rahe|\bsrrs\b|appraisal|lazarus|transactional (model|theory)|problem.focused|emotion.focused|tend.and.befriend|burnout|job strain|demand.control|allostatic/i, undefined, /chronic stress|psychoneuroimmun|cytokine|wound|vaccin|papageno|media/i), "hpaloop", { title: "Play a stressful day", start: "day", caption: "Play the day and choose how to cope with each event. In Lazarus's transactional model stress depends on appraisal: is this a threat (primary appraisal) and can I cope (secondary appraisal)? Problem-focused coping changes the situation; emotion-focused coping changes how you feel; talking to someone (social support) buffers the stress response, while avoidance gives relief now and a bigger load later." }),
  concept("hl-gas", R(["health", "biological", "organisational"], /selye|general adaptation|alarm (reaction|stage)|stage of resistance|exhaustion stage|diseases of adaptation/i), "timeline", tl("Put Selye's general adaptation syndrome in order", [
    ["Alarm: the body mobilises (adrenaline, cortisol); resistance briefly dips"],
    ["Resistance: the body adapts and holds raised arousal against the stressor"],
    ["Exhaustion: resources run down if stress continues; illness becomes more likely"],
  ], "Selye's rats showed the same response to very different stressors; Lazarus later added that how a stressor is appraised matters.")),

  /* ------------------------------------------------ organisational */
  concept("org-lewin", R(["organisational", "social"], /lewin'?s? (change|three.step|model of change)|unfreez|refreez|force.field/i), "timeline", tl("Put Lewin's change model in order", [
    ["Unfreeze: show the need for change and lower resistance"],
    ["Change (moving): introduce the new ways"],
    ["Refreeze: make the new ways stable through norms and rewards"],
  ], "Force-field analysis lists driving and restraining forces; reducing restraining forces is often more effective than adding pressure.")),
  concept("org-kirkpatrick", R(["organisational"], /kirkpatrick|training evaluation|reaction.{0,20}learning.{0,20}behaviou?r|levels of evaluation/i), "timeline", tl("Put Kirkpatrick's four levels of training evaluation in order", [
    ["Reaction: did trainees like it?"],
    ["Learning: did knowledge and skill improve?"],
    ["Behaviour: is it used on the job (transfer)?"],
    ["Results: did the organisation's outcomes improve?"],
  ], "Each level is harder to measure than the last, and liking a course says little about the later levels.")),
  concept("org-hawthorne", R(["organisational", "research-methods", "history-systems"], /hawthorne|western electric|relay assembly|bank wiring|illumination (studies|experiments)|mayo|human relations movement/i), "timeline", tl("Put the Hawthorne studies in order", [
    ["Illumination studies: output rose whether lighting went up or down", "1924 to 1927"],
    ["Relay assembly test room: output rose across many changes in breaks and hours", "1927 to 1932"],
    ["Mass interviewing programme", "1928 to 1930"],
    ["Bank wiring room: the group set its own output norms and held output down", "1931 to 1932"],
  ], "The findings started the human relations movement; the 'Hawthorne effect' (people change when observed) is now thought to be smaller than first claimed.")),
  concept("org-kotter", R(["organisational"], /kotter|eight.step|8.step|sense of urgency|guiding coalition|short.term wins/i), "timeline", tl("Put Kotter's eight steps of change in order", [
    ["Create a sense of urgency"],
    ["Build a guiding coalition"],
    ["Form a strategic vision"],
    ["Communicate the vision"],
    ["Remove barriers and empower action"],
    ["Generate short-term wins"],
    ["Sustain acceleration, do not let up"],
    ["Anchor the changes in the culture"],
  ])),

  /* ------------------------------------------------ Indian psychology */
  concept("in-states", R(IN, /jagrat|jagrit|svapna|swapna|sushupti|turiya|mandukya|states of consciousness|avasthas?|dreamless sleep|yoga nidra/i), "hypnogram", { title: "Waking, dreaming and deep sleep in one night", caption: "Drag through the night. The Mandukya Upanishad names three states: jagrat (waking, beta and alpha waves), svapna (dreaming, close to REM sleep) and sushupti (deep dreamless sleep, close to N3), and a fourth, turiya, pure consciousness underlying all three, which is not a sleep stage. Yoga nidra aims to stay aware at the edge of sleep." }),
  concept("in-breath", R(IN, /pranayama|breath(ing)? (control|practice|retention)|kapalbhati|anulom|nadi shodhana|bhramari|sudarshan kriya|ujjayi|yoga.{0,40}(heart rate|blood pressure|autonomic|vagal|cortisol|parasympathetic)|meditation.{0,40}(heart rate|blood pressure|autonomic|cortisol|parasympathetic|relaxation)/i), "nervoussystem", { title: "What slow breathing does to the body", start: "auto", caption: "Switch from fight or flight to rest and digest. Slow, deep breathing (as in many forms of pranayama) increases vagal, parasympathetic activity: the pulse slows, blood pressure falls and heart rate variability rises. Fast forced breathing such as kapalbhati raises arousal instead." }),
  concept("in-meditation-brain", R(IN, /(mindfulness|meditation|vipassana|dhyana).{0,80}(brain|amygdala|prefrontal|insula|grey matter|cortex|default mode|neuro|eeg|gamma)|default mode network|lutz|davidson/i), "brainmap", bm("Meditation and the brain", {
    prefrontal: "Prefrontal cortex and anterior cingulate: attention control and noticing when the mind wanders; more active, and in some studies thicker, in long-term meditators.",
    amygdala: "Amygdala: reactivity to threat falls after mindfulness training in several studies.",
    parietal: "Default mode network (medial prefrontal and posterior cingulate and parietal areas): active during mind-wandering; quieter during meditation.",
    temporal: "Insula (deep to the temporal lobe): body awareness; often larger in experienced meditators. Many findings come from small studies.",
  })),
  concept("in-kosha", R(["indian-psychology", "positive"], /kosha|annamaya|pranamaya|manomaya|vijnanamaya|vijnanamaya|anandamaya|taittiriya|five sheaths/i), "layers", ly("The five koshas (sheaths) of the Taittiriya Upanishad", "rings", [
    ["Anandamaya kosha", "The innermost sheath of bliss, closest to the self (atman)."],
    ["Vijnanamaya kosha", "The sheath of intellect, discernment and wisdom (buddhi)."],
    ["Manomaya kosha", "The sheath of mind, thoughts and feelings (manas)."],
    ["Pranamaya kosha", "The sheath of vital energy and breath (prana)."],
    ["Annamaya kosha", "The outermost sheath: the physical body, made of food."],
  ], "Tap from the centre outward. Each sheath is subtler than the one around it.")),
  concept("in-ashtanga", R(["indian-psychology", "clinical-therapies", "positive"], /ashtanga|eight limbs|yama.{0,30}niyama|pratyahara|dharana|patanjali.{0,40}(limbs|steps|stages)|samadhi/i), "timeline", tl("Put Patanjali's eight limbs of yoga in order", [
    ["Yama: ethical restraints (non-violence, truth, non-stealing, moderation, non-possessiveness)"],
    ["Niyama: personal observances (purity, contentment, discipline, self-study, surrender)"],
    ["Asana: steady, comfortable posture"],
    ["Pranayama: regulation of breath"],
    ["Pratyahara: withdrawal of the senses"],
    ["Dharana: concentration on one point"],
    ["Dhyana: meditation, unbroken flow of attention"],
    ["Samadhi: absorption"],
  ], "The last three together are samyama; the first five are the outer limbs.")),
  concept("in-ashrama", R(["indian-psychology", "developmental"], /ashrama|brahmacharya|grihastha|vanaprastha|sannyasa|stages of life.{0,30}(hindu|indian|vedic)/i), "timeline", tl("Put the four ashramas (stages of life) in order", [
    ["Brahmacharya: student, learning and self-discipline"],
    ["Grihastha: householder, family, work and duty"],
    ["Vanaprastha: gradual withdrawal, guiding the next generation"],
    ["Sannyasa: renunciation, seeking liberation (moksha)"],
  ], "Often compared with Erikson's lifespan stages.")),
  concept("in-chitta", R(["indian-psychology"], /chitta bhumi|kshipta|mudha|vikshipta|ekagra|niruddha|levels of (the )?mind/i), "timeline", tl("Put the five states of the mind (chitta bhumis) in order, from most scattered to most still", [
    ["Kshipta: restless, scattered"],
    ["Mudha: dull, inert"],
    ["Vikshipta: distracted, sometimes focused"],
    ["Ekagra: one-pointed"],
    ["Niruddha: fully restrained, still"],
  ], "Vyasa's commentary on the Yoga Sutras: only the last two suit yoga. Some lists put mudha first, so check the order your exam uses.")),

  /* ------------------------------------------------ ethics and law (India) */
  concept("law-mhca-admission", R(LAW, /supported admission|section 89|section 90|section 86|independent admission|admission.{0,40}(30|90|120|180) days|beyond 30 days|section 87|minor.{0,30}admission/i), "timeline", tl("Mental Healthcare Act 2017: put the admission periods in order", [
    ["Independent admission (s.86): an adult with capacity chooses admission", "Any length, may leave"],
    ["Supported admission (s.89): high support needs, assessed by a psychiatrist and another professional", "Up to 30 days"],
    ["Supported admission beyond 30 days (s.90): two psychiatrists, Board informed", "First up to 90 days"],
    ["s.90 extension", "Up to 120 days"],
    ["Further s.90 extensions", "Up to 180 days each"],
  ], "A minor is admitted under s.87 on the nominated representative's application, and the Board must be told within 72 hours. Emergency treatment (s.94) is limited to 72 hours.")),
  concept("law-timeline", R(LAW, /\b(19|20)\d\d\b.{0,40}\bact\b|\bact\b.{0,10}\b(19|20)\d\d\b|enacted|came into (force|effect)|replaced the/i, /mhca-history|indian-laws|rci-act|ndps|pocso|rpwd|bns|history|case-law/, /\bmtp\b|pregnancy/i), "timeline", tl("Put these Indian laws in order", [
    ["Indian Lunacy Act", "1912"],
    ["Narcotic Drugs and Psychotropic Substances (NDPS) Act", "1985"],
    ["Mental Health Act (replaced the Lunacy Act)", "1987"],
    ["Rehabilitation Council of India Act", "1992"],
    ["Protection of Children from Sexual Offences (POCSO) Act", "2012"],
    ["Rights of Persons with Disabilities Act", "2016"],
    ["Mental Healthcare Act (replaced the 1987 Act)", "2017"],
    ["Bharatiya Nyaya Sanhita replaces the Indian Penal Code", "2023, in force 2024"],
  ], "The Mental Healthcare Act 2017 also decriminalised attempted suicide in practice: section 115 presumes severe stress.")),
  concept("law-tarasoff", R(["ethics-law", "counselling", "clinical-psychiatry"], /tarasoff|duty to (warn|protect)|poddar/i), "timeline", tl("Put the Tarasoff case in order", [
    ["A student tells his university psychologist he intends to kill Tatiana Tarasoff", "1969"],
    ["Campus police briefly detain and release him; she is not warned", "1969"],
    ["He kills her; her family sues", "1969"],
    ["First ruling: a duty to warn the victim", "1974"],
    ["Second ruling: a duty to protect ('the protective privilege ends where the public peril begins')", "1976"],
  ], "Indian law has no exact equivalent, but confidentiality can be broken to prevent serious harm.")),

  /* ------------------------------------------------ UGC Paper 1 */
  concept("ugc-comm", R(["ugc-paper1"], /shannon|weaver|lasswell|berlo|smcr|osgood|schramm|communication models?|encoder|decoder|noise.{0,20}channel/i), "timeline", tl("Put these models of communication in order", [
    ["Aristotle's rhetoric: speaker, speech, audience", "Ancient Greece"],
    ["Lasswell: who says what, in which channel, to whom, with what effect", "1948"],
    ["Shannon and Weaver: source, transmitter, channel with noise, receiver, destination", "1949"],
    ["Osgood and Schramm: a circular model, both people encode and decode", "1954"],
    ["Berlo's SMCR: source, message, channel, receiver", "1960"],
  ], "The early models were one-way (linear); later ones added feedback and shared fields of experience.")),
  concept("ugc-bloom", R(["ugc-paper1", "developmental"], /bloom'?s|taxonomy of (educational )?objectives|cognitive domain|remember.{0,20}understand.{0,20}apply/i), "layers", ly("Bloom's taxonomy, revised (2001)", "pyramid", [
    ["Create", "Put parts together into something new."],
    ["Evaluate", "Judge using criteria."],
    ["Analyse", "Break into parts and see relations."],
    ["Apply", "Use in a new situation."],
    ["Understand", "Explain in your own words."],
    ["Remember", "Recall facts."],
  ], "The original 1956 order ended knowledge, comprehension, application, analysis, synthesis, evaluation; the revision uses verbs and puts creating at the top.")),
  concept("ugc-teaching-levels", R(["ugc-paper1"], /memory level|understanding level|reflective level|herbart|morrison|bigge|hunt|levels of teaching/i), "timeline", tl("Put the levels of teaching in order", [
    ["Memory level: learning facts (Herbart)"],
    ["Understanding level: seeing relationships and principles (Morrison)"],
    ["Reflective level: problem-centred, critical thinking (Hunt)"],
  ], "Each level builds on the one below: understanding needs facts, and reflection needs understanding.")),
];
