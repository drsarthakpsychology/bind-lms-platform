import type { LongQA } from "@/lib/prep/long-types";

const S = "cognitive" as const;

export const COGNITIVE_L04: LongQA[] = [
  {
    id: "cog-l04-031",
    subject: S,
    topic: "decision-making",
    marks: 10,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester"],
    question: "Explain Herbert Simon's concept of bounded rationality and satisficing. How does Gigerenzer's idea of ecological rationality differ from the heuristics and biases approach?",
    plan: ["Rational choice and its assumptions", "Bounded rationality and satisficing", "Elimination by aspects", "Gigerenzer's fast and frugal heuristics with examples", "Contrast with Kahneman and Tversky", "Conclusion"],
    answer: `## Rational choice
Classical models assume that decision makers know all options and consequences, have stable preferences and compute the option with the greatest expected utility. Real people lack time, information and computing capacity to do this.

## Bounded rationality
Herbert Simon, who received the Nobel Prize in economics in 1978, argued that human rationality is bounded by limited information, limited cognitive capacity and limited time. People are not irrational; they are as rational as their minds and environments allow. Simon compared rational behaviour to a pair of scissors whose two blades are the structure of the environment and the computational abilities of the person.

## Satisficing
Instead of optimising, people satisfice (a blend of satisfy and suffice): they set an aspiration level and choose the first option that meets it. A student looking for a paying guest room in Ahmedabad does not compare every room in the city; she accepts the first one that is within budget, safe and close to college. If no option meets the standard after a while, the aspiration level is lowered.
- Barry Schwartz later found that "maximisers", who try to find the best option, often achieve objectively better outcomes but feel less satisfied and more regretful than "satisficers".

## Elimination by aspects
Amos Tversky proposed that people choose by considering one attribute at a time, eliminating options that fail a cut-off on that attribute, starting with the most important. Buying a phone: eliminate all above the budget, then all without a good camera, then choose among the rest. It is efficient but may discard an option that is excellent on everything else.

## Ecological rationality
Gerd Gigerenzer and the ABC Research Group argued that simple heuristics are not merely error-prone shortcuts; they are adapted to the structure of real environments and can outperform complex strategies.
- Recognition heuristic: if one of two objects is recognised and the other is not, infer that the recognised one has a higher value on the criterion. German students judged which of two American cities was larger more accurately than American students, because recognition correlated with city size and they knew fewer cities.
- Take-the-best: compare options on the most valid cue; if it discriminates, decide; if not, move to the next cue. In computer simulations, take-the-best predicted new cases as well as or better than multiple regression, because it is less prone to overfitting.
- The gaze heuristic: a fielder catches a ball by running so that the angle of gaze to the ball stays constant, without calculating its trajectory.
- Less-is-more effects: in some environments, less information leads to better decisions.

## Contrast with heuristics and biases
| Feature | Heuristics and biases (Kahneman and Tversky) | Ecological rationality (Gigerenzer) |
| View of heuristics | Shortcuts that cause systematic errors | Adaptive tools fitted to environments |
| Standard of good reasoning | Logic and probability theory | Success in the real environment |
| Typical research | Problems where heuristics fail | Environments where heuristics succeed |
| Remedy | Debiasing, slowing down | Better presentation (natural frequencies), matching tools to tasks |
| Example | Base rate neglect with probabilities | Base rates used well with natural frequencies |
The two positions are not wholly opposed: both agree that people use heuristics; they differ on whether to emphasise their failures or their successes. Kahneman's later work also acknowledged that intuition can be accurate when environments are regular and feedback is quick, as with experienced firefighters studied by Gary Klein.

## Conclusion
Bounded rationality replaced the image of an all-knowing decision maker with a realistic one who satisfices. Gigerenzer's ecological rationality goes further, showing that simple heuristics can be smart when they fit the environment, while the heuristics and biases tradition shows where they mislead.`,
    keyPoints: ["Assumptions of rational choice", "Simon's bounded rationality and scissors metaphor", "Satisficing with example", "Elimination by aspects", "Recognition and take-the-best heuristics", "Comparison table with heuristics and biases", "Synthesis in conclusion"],
    module: "thinking-language/2-4",
    visuals: [
      { kind: "compare", data: { title: "Maximising versus satisficing", a: { label: "Maximiser", points: ["Compares every option", "Seeks the best", "More regret afterwards"], summary: "Better on paper, less satisfied." }, b: { label: "Satisficer", points: ["Sets a standard", "Takes the first option that meets it", "Less regret"], summary: "Good enough, happier." } } },
    ],
    ref: "Simon 1955 and 1990; Tversky 1972 elimination by aspects; Gigerenzer and Goldstein 1996; Goldstein and Gigerenzer 2002 recognition heuristic; Schwartz et al 2002; Kahneman and Klein 2009",
  },
  {
    id: "cog-l04-032",
    subject: S,
    topic: "decision-making",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "cuet-pg", "mcp-entrance"],
    question: "Write a short note on confirmation bias.",
    plan: ["Define confirmation bias", "Forms and classic evidence", "Clinical and everyday examples", "Ways to reduce it"],
    answer: `## Meaning
Confirmation bias is the tendency to search for, interpret, favour and remember information in a way that confirms one's existing beliefs or hypotheses, while giving less attention to information that contradicts them.

## Forms and evidence
- Biased search: in Peter Wason's 2-4-6 task, people tested only number triples that fitted their hypothesis and rarely tried ones that could disprove it. In the selection task, many chose the confirming card instead of the potentially falsifying one.
- Biased interpretation: Charles Lord, Lee Ross and Mark Lepper gave supporters and opponents of the death penalty the same mixed evidence; both groups rated the supporting studies as more convincing and became more extreme in their views (attitude polarisation).
- Biased memory: people recall details that fit their expectations better.
- Belief perseverance: beliefs persist even after the evidence for them is discredited.

## Examples
- A clinician who forms an early diagnosis may ask questions that confirm it and overlook signs of another condition (diagnostic momentum or premature closure).
- A teacher who believes a student is weak notices only the mistakes.
- Social media algorithms show content that matches existing views, strengthening echo chambers.
- In depression, people notice and recall events that fit their negative beliefs, as described in Beck's cognitive model.

## Reducing it
- Actively consider the opposite and generate alternative explanations.
- Seek disconfirming evidence and test predictions that could fail.
- Use structured checklists and second opinions in clinical work.
- In CBT, behavioural experiments and examining evidence for and against a thought directly target this bias.`,
    keyPoints: ["Definition", "Biased search with Wason", "Biased interpretation with Lord, Ross and Lepper", "Clinical example", "Debiasing strategies"],
    module: "thinking-language/2-4",
    visuals: [
      { kind: "reveal", data: { prompt: "A clinician thinks a patient has anxiety and asks only about worry and palpitations. What might be missed?", answer: "Signs of another cause, such as thyroid disease, substance use or depression. Asking questions that could disconfirm the first idea guards against confirmation bias." } },
    ],
    ref: "Nickerson 1998 Review of General Psychology; Lord, Ross and Lepper 1979; Wason 1960; Croskerry 2003 on diagnostic error",
  },
  {
    id: "cog-l04-033",
    subject: S,
    topic: "language",
    marks: 15,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg"],
    question: "What is language? Describe its properties and levels of structure, and discuss Chomsky's contribution to the psychology of language.",
    plan: ["Define language and its design features", "Levels: phonology, morphology, syntax, semantics, pragmatics", "Chomsky: generative grammar, deep and surface structure, critique of Skinner", "Universal grammar and the language acquisition device", "Evidence and criticism", "Conclusion"],
    answer: `## Meaning
Language is a system of symbols (sounds, signs or written marks) combined according to rules to communicate meaning. Human language allows us to talk about things that are absent, abstract or imaginary, and to produce and understand an unlimited number of new sentences.

## Properties (design features)
Charles Hockett listed features that distinguish human language:
- Arbitrariness: the link between a word and its meaning is conventional; "dog", "kutta" and "chien" all name the same animal.
- Generativity (productivity): a finite set of words and rules generates infinitely many sentences.
- Displacement: we can talk about the past, future and things not present.
- Duality of patterning: meaningless sounds combine into meaningful units, which combine into sentences.
- Cultural transmission: language is learned from others.
- Discreteness and structure dependence.
Animal communication, such as bee dances or vervet monkey alarm calls, shows some features but not full generativity and displacement.

## Levels of structure
- Phonology: the sound system. Phonemes are the smallest units of sound that change meaning (the difference between "pin" and "bin"). Languages use different phoneme sets; English has about 40 to 44, Hindi has more consonants, including aspirated sounds.
- Morphology: morphemes are the smallest units of meaning. "Unhappiness" has three: un, happy and ness. Free morphemes stand alone; bound morphemes, such as plural "s", do not.
- Syntax: rules for combining words into phrases and sentences. Word order carries meaning: "The dog bit the man" differs from "The man bit the dog". English is subject verb object; Hindi is mainly subject object verb.
- Semantics: the meaning of words and sentences.
- Pragmatics: how context and social knowledge shape meaning. "Can you pass the salt?" is a request, not a question about ability. Paul Grice's conversational maxims (quantity, quality, relevance, manner) describe how speakers cooperate.
- Discourse: how sentences connect into coherent conversations and texts.

## Chomsky's contribution
Noam Chomsky's work from 1957 transformed the field and helped launch the cognitive revolution.
- Critique of behaviourism: in his 1959 review of B. F. Skinner's "Verbal Behavior", Chomsky argued that language cannot be explained by reinforcement and imitation. Children produce sentences they have never heard, including systematic errors such as "I goed" and "two mouses" (overregularisation), which show they are applying rules, not copying. Parents correct truth more than grammar, yet children learn grammar.
- Generative grammar: a finite set of rules that can generate all and only the grammatical sentences of a language.
- Competence versus performance: competence is the speaker's implicit knowledge of the rules; performance is actual speech, with errors and hesitations.
- Deep and surface structure: deep structure is the underlying meaning; surface structure is the actual form. Transformational rules link them. "The boy kicked the ball" and "The ball was kicked by the boy" share a deep structure. Ambiguous sentences such as "Visiting relatives can be boring" have one surface structure and two deep structures. Chomsky's famous sentence "Colourless green ideas sleep furiously" is grammatical but meaningless, showing that syntax is partly independent of meaning.
- Universal grammar and the language acquisition device: all human languages share deep principles, and children are born with an innate capacity for language that is triggered by exposure. The poverty of the stimulus argument holds that the input children hear is too limited and messy to explain their rapid acquisition of complex grammar without innate structure.

## Evidence for an innate component
- All normal children acquire language rapidly, in similar stages, across cultures.
- Critical period evidence: Genie, isolated until 13, learned vocabulary but never mastered grammar; deaf children exposed to sign language late show lasting grammatical deficits.
- Creole languages and Nicaraguan Sign Language, which deaf children created with full grammar from limited input.
- Specific language impairment and genetic links such as the FOXP2 gene (though FOXP2 is not a "grammar gene").

## Criticisms
- Universal grammar is hard to test and has been revised many times.
- Usage-based theorists such as Michael Tomasello argue that children learn language through general cognitive abilities, statistical learning and social understanding of intentions. Jenny Saffran showed that 8-month-old infants track statistical regularities between syllables to find word boundaries.
- Daniel Everett claimed the Piraha language lacks recursion, challenging claims about universals, though this is disputed.
- Interactionist views stress that social interaction, child-directed speech and joint attention are essential.

## Conclusion
Language is a rule-governed, generative system organised at several levels. Chomsky showed that it cannot be explained by reinforcement alone and that it reflects powerful mental structures, possibly innate. Current research integrates biological readiness with learning from rich social input.`,
    keyPoints: ["Definition of language", "Hockett's design features including generativity and displacement", "Five levels with examples", "Chomsky's critique of Skinner with overregularisation", "Competence and performance", "Deep and surface structure", "LAD, universal grammar and poverty of the stimulus", "Criticisms including usage-based and statistical learning"],
    module: "thinking-language/2-6",
    visuals: [
      { kind: "layers", data: { title: "Levels of language", shape: "stack", layers: [{ label: "Pragmatics", detail: "Meaning in context: 'Can you pass the salt?' is a request." }, { label: "Semantics", detail: "The meaning of words and sentences." }, { label: "Syntax", detail: "Rules for word order and sentence structure." }, { label: "Morphology", detail: "Morphemes: un + happy + ness." }, { label: "Phonology", detail: "Phonemes: pin versus bin." }] } },
      { kind: "compare", data: { title: "How children learn grammar", a: { label: "Skinner", points: ["Imitation and reinforcement", "Parents shape correct speech", "Language is verbal behaviour"], summary: "Learned from the environment." }, b: { label: "Chomsky", points: ["Innate language acquisition device", "Children apply rules: 'I goed'", "Input too poor to explain grammar"], summary: "Built into the mind." } } },
    ],
    ref: "Chomsky 1957 Syntactic Structures, 1959 review of Skinner, 1965; Hockett 1960; Saffran, Aslin and Newport 1996; Tomasello 2003; Atkinson and Hilgard ch 9",
  },
  {
    id: "cog-l04-034",
    subject: S,
    topic: "language",
    marks: 10,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net"],
    question: "Critically evaluate the Sapir Whorf hypothesis of linguistic relativity.",
    plan: ["State strong and weak forms", "Early evidence and colour research", "Modern evidence: number, space, time, grammatical gender", "Critique and counter-evidence", "Conclusion"],
    answer: `## The hypothesis
The Sapir Whorf hypothesis, named after the linguist Edward Sapir and his student Benjamin Lee Whorf, proposes that the language we speak shapes the way we think.
- Strong form (linguistic determinism): language determines thought; people cannot think about concepts for which their language has no words.
- Weak form (linguistic relativity): language influences habitual thought, perception and memory, making some distinctions easier or more salient.
Whorf argued that the Hopi language lacked words for time as Europeans conceive it, and so Hopi speakers thought about time differently. Later analysis found that Hopi does have ways of expressing time, undermining his examples.

## Colour research
- Brent Berlin and Paul Kay studied colour terms in about 20 languages and found that basic colour terms appear in a fixed order across languages (black and white first, then red, then green or yellow, and so on), and that focal colours are similar everywhere. This suggested colour perception is universal.
- Eleanor Rosch (then Heider) found that the Dani of New Guinea, who have only two colour terms (dark and light), still remembered focal colours better than non-focal ones, against the strong form.
- But later studies support a weak effect. Jules Davidoff and Debi Roberson found that the Berinmo of Papua New Guinea, whose colour categories differ from English, showed better discrimination across their own category boundaries.
- Russian has separate basic terms for light blue (goluboy) and dark blue (siniy). Jonathan Winawer and colleagues found Russian speakers were faster to discriminate blues across this boundary, an advantage removed by a verbal interference task, showing an online role of language.

## Other domains
- Number: the Piraha of the Amazon have no exact number words beyond "one", "two" and "many". Peter Gordon found they struggled to match exact quantities above three, suggesting that number words help represent exact large numbers.
- Space: speakers of Guugu Yimithirr in Australia and Tzeltal in Mexico use absolute directions (north, south) rather than relative ones (left, right). Stephen Levinson found they solved non-verbal spatial tasks in absolute terms.
- Time: Lera Boroditsky reported that Mandarin speakers, who use vertical metaphors for time, think of time vertically more than English speakers, though replications have been mixed.
- Grammatical gender: German and Spanish speakers describe objects in ways that fit the grammatical gender of the noun, such as describing a bridge (feminine in German) as elegant.
- Counterfactual thinking and language for emotions have also been studied.

## Critique
- The strong form is clearly false: people can think about things they have no word for, infants and animals think without language, and we can coin new words when needed. Translation between languages is possible.
- Many effects are small, task-dependent and disappear when verbal processing is blocked, suggesting language influences thought during the task rather than permanently restructuring it.
- Direction of causation: culture may shape both language and thought.
- Steven Pinker argued that thought occurs in a "mentalese" independent of any spoken language.
- Some famous claims (such as many Inuit words for snow) are exaggerated.

## Conclusion
The strong deterministic version is rejected, but a weak version is supported: language can direct attention, aid memory and make some distinctions easier, as seen in colour, number and spatial reasoning. Language is one of several tools that shape, but do not imprison, thought.`,
    keyPoints: ["Strong versus weak forms", "Berlin and Kay and Heider's Dani evidence", "Berinmo and Russian blues evidence", "Piraha number findings", "Spatial frames of reference evidence", "Critique of the strong form", "Balanced conclusion supporting a weak form"],
    module: "thinking-language/2-6",
    visuals: [
      { kind: "compare", data: { title: "Two versions of the hypothesis", a: { label: "Strong: determinism", points: ["Language determines thought", "No word, no concept", "Largely rejected"], summary: "Language as prison." }, b: { label: "Weak: relativity", points: ["Language influences attention and memory", "Russian blues, Piraha numbers", "Supported for some domains"], summary: "Language as lens." } } },
    ],
    ref: "Whorf 1956; Berlin and Kay 1969; Heider 1972; Roberson, Davidoff et al 2000; Winawer et al 2007 PNAS; Gordon 2004 Science; Levinson 2003; Boroditsky 2001; Pinker 1994",
  },
  {
    id: "cog-l04-035",
    subject: S,
    topic: "aphasia",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "md-psychiatry", "mcp-entrance"],
    question: "Describe the main types of aphasia. Explain the Wernicke Geschwind model of language and discuss its limitations in the light of modern research.",
    plan: ["Define aphasia and its causes", "Broca's and Wernicke's aphasia with examples", "Conduction, global, transcortical and anomic aphasia", "Wernicke Geschwind model and how it explains the syndromes", "Limitations and the dual stream model", "Assessment, recovery and conclusion"],
    answer: `## Meaning
Aphasia is an acquired disorder of language caused by brain damage, most often a stroke in the left middle cerebral artery territory, but also head injury, tumours and neurodegenerative disease (primary progressive aphasia). It affects speaking, understanding, reading and writing to different degrees, while other cognitive abilities may be relatively intact. In about 95 percent of right-handers and most left-handers, language is lateralised to the left hemisphere.

## Broca's aphasia (expressive, non-fluent)
- Damage: left inferior frontal gyrus (Broca's area, Brodmann areas 44 and 45) and surrounding regions. Paul Broca in 1861 described his patient Leborgne, nicknamed "Tan" because it was almost the only syllable he could say.
- Speech: slow, effortful and halting, with short phrases and poor articulation. Telegraphic speech omits function words and grammatical endings: "Monday... dad... hospital... Wednesday."
- Comprehension: relatively good for simple conversation, but poor for grammatically complex sentences such as passives ("The girl was chased by the boy"), showing a syntactic deficit (agrammatism).
- Repetition: impaired.
- Patients are usually aware of their errors and frustrated. Right-sided weakness is common because the motor cortex is nearby.

## Wernicke's aphasia (receptive, fluent)
- Damage: posterior part of the left superior temporal gyrus (Wernicke's area, Brodmann area 22). Carl Wernicke described it in 1874.
- Speech: fluent, with normal rhythm and grammar, but empty or meaningless. Paraphasias (wrong words or sounds, such as "pencil" for "pen" or "spoon" for "fork") and neologisms (invented words) occur. Severe forms produce jargon: "I called my mother on the television and did not understand the door."
- Comprehension: poor for spoken and written language.
- Repetition: impaired.
- Patients often lack awareness of their errors (anosognosia), which can be mistaken for psychosis or confusion.

## Other aphasias
| Type | Fluency | Comprehension | Repetition | Typical lesion |
| Broca's | Non-fluent | Relatively good | Poor | Left inferior frontal |
| Wernicke's | Fluent | Poor | Poor | Left posterior superior temporal |
| Conduction | Fluent | Good | Very poor | Arcuate fasciculus or supramarginal gyrus |
| Global | Non-fluent | Poor | Poor | Large perisylvian lesion |
| Transcortical motor | Non-fluent | Good | Good | Frontal, sparing Broca's area |
| Transcortical sensory | Fluent | Poor | Good | Temporo-parietal, sparing Wernicke's area |
| Anomic | Fluent | Good | Good | Various, often temporal or parietal |
- Conduction aphasia: patients understand and speak fairly fluently but cannot repeat what they hear, and make phonemic paraphasias, because the pathway from comprehension to production is disrupted.
- Anomic aphasia: word-finding difficulty with circumlocution ("the thing you write with"), the mildest and most common residual form.

## The Wernicke Geschwind model
Building on Wernicke's ideas, Norman Geschwind in the 1960s proposed a model of how language is processed:
- To repeat a spoken word, the sound is processed in primary auditory cortex, its meaning is accessed in Wernicke's area, the information travels through the arcuate fasciculus to Broca's area, which programmes the articulatory movements, and the motor cortex executes them.
- To read aloud, visual information goes from visual cortex to the angular gyrus, which converts the written form into an auditory code, then to Wernicke's area, and on to Broca's area.
The model explains the classic syndromes: damage to Wernicke's area impairs comprehension; damage to Broca's area impairs production; damage to the arcuate fasciculus disconnects them, causing conduction aphasia.

## Limitations
- Lesions rarely match the model neatly. Nina Dronkers found that some patients with Broca's aphasia had no damage to Broca's area, and lesions limited to Broca's area often cause only transient deficits; lasting Broca's aphasia requires damage to wider regions, including the insula and underlying white matter. Leborgne's preserved brain shows damage extending well beyond Broca's area.
- Broca's area is involved in comprehension of complex syntax, not just production, and Wernicke's area contributes to production.
- Language involves a much wider network, including the middle and inferior temporal lobes, the anterior temporal lobe for semantics, the basal ganglia, thalamus and right hemisphere (for prosody and pragmatics).
- The classic syndromes are clusters of symptoms; many patients do not fit them.
- Modern imaging and stimulation studies support a dual stream model, proposed by Gregory Hickok and David Poeppel: a ventral stream through the temporal lobe maps sound to meaning (comprehension), and a dorsal stream through parietal and frontal regions maps sound to articulation (repetition and production). This reframes conduction aphasia as damage to the dorsal stream.
- Cognitive neuropsychology focuses on specific processing components (phonological input, lexicon, semantics, output) rather than syndromes.

## Assessment and recovery
Assessment uses tests such as the Boston Diagnostic Aphasia Examination and the Western Aphasia Battery, adapted for Indian languages. Recovery is greatest in the first months, aided by speech and language therapy, constraint-induced aphasia therapy, melodic intonation therapy for non-fluent aphasia and family training in communication strategies. Bilingual and multilingual patients, common in India, may recover their languages in different patterns.

## Conclusion
The classic aphasias and the Wernicke Geschwind model laid the foundation for understanding brain and language. Modern evidence shows a more distributed, dual stream network, but the model remains a useful clinical framework for classifying aphasia by fluency, comprehension and repetition.`,
    keyPoints: ["Definition and causes", "Broca's aphasia features and lesion", "Wernicke's aphasia features and lesion", "Conduction, global, transcortical and anomic types", "Classification by fluency, comprehension and repetition", "Wernicke Geschwind pathway", "Limitations including Dronkers and wider networks", "Dual stream model and rehabilitation"],
    pitfalls: ["Saying Broca's patients have perfect comprehension", "Confusing Wernicke's aphasia with psychosis without noting the link"],
    module: "thinking-language/2-6",
    visuals: [
      { kind: "brainmap", data: { title: "The classic language areas", focus: ["broca", "wernicke", "temporal", "motor"], notes: { broca: "Planning speech and complex grammar.", wernicke: "Understanding the meaning of speech.", temporal: "Auditory processing and word meanings.", motor: "Moving the lips, tongue and larynx." } } },
      { kind: "flow", data: { title: "Repeating a heard word: Wernicke Geschwind model", layout: "chain", nodes: [{ id: "a", label: "Auditory cortex", detail: "Hears the sound." }, { id: "w", label: "Wernicke's area", detail: "Recognises the word and its meaning." }, { id: "af", label: "Arcuate fasciculus", detail: "Carries it forward; damage causes conduction aphasia." }, { id: "b", label: "Broca's area", detail: "Plans the articulation." }, { id: "m", label: "Motor cortex", detail: "Moves the speech muscles." }] } },
      { kind: "sort", data: { prompt: "Which aphasia fits each patient?", buckets: ["Broca's", "Wernicke's", "Conduction"], items: [{ text: "Fluent nonsense, unaware of errors, cannot follow commands", bucket: 1 }, { text: "Halting, telegraphic speech, knows what he wants to say", bucket: 0 }, { text: "Speaks and understands well but cannot repeat a sentence", bucket: 2 }] } },
    ],
    ref: "Geschwind 1970 Science; Dronkers et al 2007 Brain on Leborgne; Hickok and Poeppel 2007 Nature Reviews Neuroscience; Bear, Connors and Paradiso ch 20; Atkinson and Hilgard ch 9",
  },
  {
    id: "cog-l04-036",
    subject: S,
    topic: "reading",
    marks: 10,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester", "mcp-entrance"],
    question: "Explain the dual route model of reading. How does it account for acquired and developmental dyslexias?",
    plan: ["Describe the lexical and non-lexical routes", "Evidence from normal reading", "Acquired dyslexias: surface, phonological, deep", "Developmental dyslexia and the phonological deficit", "Alternative models and Indian scripts", "Conclusion"],
    answer: `## The model
Max Coltheart's dual route model proposes that skilled readers can read aloud by two routes:
- The lexical (direct) route: a familiar written word is recognised as a whole in the orthographic lexicon (the store of known word forms), which connects to its meaning and pronunciation. This route is needed for irregular words, such as "yacht", "colonel" or "pint", whose pronunciations cannot be worked out from spelling rules.
- The non-lexical (sub-lexical or phonological) route: letters or letter groups are converted into sounds using grapheme to phoneme correspondence rules. This route is needed for new words and non-words, such as "blint" or "frane".
Both routes work in parallel; regular familiar words can be read by either.

## Evidence from normal reading
- Regularity effect: irregular low-frequency words are read more slowly than regular words, because the two routes conflict.
- Frequency effect: common words are read faster, reflecting the lexical route.
- People can read pronounceable non-words, showing a rule-based route.
- The computational version (dual route cascaded model) simulates many findings.

## Acquired dyslexias
Patients who could read normally before brain damage show selective patterns that fit damage to one route.
- Surface dyslexia: damage to the lexical route. Patients read regular words and non-words well but "regularise" irregular words, reading "pint" to rhyme with "mint" and "yacht" as "yatched". Often seen in semantic dementia with left temporal damage.
- Phonological dyslexia: damage to the non-lexical route. Patients read familiar words, regular or irregular, well but cannot read non-words. They may misread "blint" as "blind" (lexicalisation).
- Deep dyslexia: severe damage to the non-lexical route plus impairment of the lexical route. Patients cannot read non-words and make semantic errors, reading "forest" as "trees" or "sick" as "ill". Concrete words are read better than abstract words and content words better than function words. Some argue this reflects right hemisphere reading.
- Pure alexia (letter by letter reading) results from occipitotemporal damage, often to the visual word form area in the left fusiform gyrus.
This double dissociation between surface and phonological dyslexia is strong support for two routes.

## Developmental dyslexia
Developmental dyslexia is a persistent difficulty in learning to read accurately and fluently despite adequate intelligence, schooling and opportunity. It affects about 5 to 10 percent of children.
- Most children with dyslexia show a phonological deficit: poor phonological awareness (difficulty splitting words into sounds, rhyming), poor non-word reading, slow rapid naming and limited verbal short-term memory, resembling phonological dyslexia.
- A smaller group show surface-like patterns, with poor irregular word reading, possibly due to limited reading experience.
- Other theories propose visual magnocellular, cerebellar or attention deficits, but the phonological account has the strongest support.
- Brain imaging shows reduced activity in left temporo-parietal and occipitotemporal regions.

## Alternative models
Connectionist triangle models (Mark Seidenberg, James McClelland, David Plaut) use a single network linking spelling, sound and meaning, without explicit rules. They explain regularity and frequency effects and simulate dyslexias by damaging parts of the network.

## Indian scripts
Indian alphasyllabaries such as Devanagari and Gujarati have highly consistent letter to sound mapping compared with English. Children learning them rely heavily on the phonological route, and dyslexia in these scripts tends to appear as slow, laborious reading rather than inaccuracy. Many Indian children learn English as a second script, where irregular words create extra difficulty. Nandini Chatterjee Singh and colleagues have studied reading networks in Hindi readers.

## Conclusion
The dual route model explains how readers handle both regular and irregular words and accounts neatly for surface and phonological dyslexia. Developmental dyslexia mostly reflects weak phonological processing. Connectionist models offer an alternative single-mechanism account.`,
    keyPoints: ["Lexical and non-lexical routes", "Irregular words and non-words as diagnostic", "Regularity and frequency effects", "Surface dyslexia with regularisation", "Phonological dyslexia with non-word failure", "Deep dyslexia with semantic errors", "Developmental dyslexia and phonological deficit", "Connectionist alternative and Indian scripts"],
    module: "thinking-language/2-6",
    visuals: [
      { kind: "flow", data: { title: "Two routes from print to speech", layout: "tree", nodes: [{ id: "p", label: "Printed word" }, { id: "l", label: "Lexical route", parent: "p", detail: "Recognise the whole word: needed for 'yacht'." }, { id: "n", label: "Non-lexical route", parent: "p", detail: "Letter to sound rules: needed for 'blint'." }, { id: "ls", label: "Damage: surface dyslexia", parent: "l", detail: "Reads 'pint' to rhyme with 'mint'." }, { id: "ns", label: "Damage: phonological dyslexia", parent: "n", detail: "Cannot read non-words." }] } },
    ],
    ref: "Coltheart et al 2001 DRC model; Marshall and Newcombe 1973; Snowling 2000; Seidenberg and McClelland 1989; Plaut et al 1996",
  },
  {
    id: "cog-l04-037",
    subject: S,
    topic: "speech-perception",
    marks: 5,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester"],
    question: "Write a short note on speech perception, with reference to categorical perception and the McGurk effect.",
    plan: ["Problems of speech perception", "Categorical perception", "The McGurk effect", "Theories"],
    answer: `## The problem
Speech is a continuous stream of sound with no clear gaps between words (the segmentation problem), and the same phoneme sounds different depending on the speaker and the sounds around it (lack of invariance, or coarticulation). Yet listeners perceive discrete words effortlessly, using knowledge of the language, context and visual cues.

## Categorical perception
When researchers gradually change a sound along a continuum, for example the voice onset time from "ba" to "pa", listeners do not hear a gradual change. They hear "ba" up to a boundary (about 25 to 30 milliseconds of voice onset time in English) and then abruptly "pa". Differences within a category are hard to detect, while equal-sized differences across the boundary are easy. Alvin Liberman described this. Infants show categorical perception of speech sounds from all languages but lose sensitivity to non-native contrasts by about 10 to 12 months, as Janet Werker found; Japanese adults, for example, struggle with the English r and l distinction.

## The McGurk effect
Harry McGurk and John MacDonald in 1976 showed a video of a person saying "ga" dubbed with the sound "ba". Most viewers heard "da", a fusion of the visual and auditory information. With eyes closed, they heard "ba". This shows that speech perception integrates vision and hearing automatically.

## Theories
- Motor theory (Liberman): we perceive speech by reference to the articulatory gestures used to produce it.
- Phonemic restoration (Richard Warren): when a sound in a word is replaced by a cough, listeners "hear" the missing sound, showing top-down filling in.
- The TRACE connectionist model combines bottom-up acoustic features with top-down word knowledge.`,
    keyPoints: ["Segmentation and invariance problems", "Categorical perception with voice onset time", "Infant loss of non-native contrasts", "McGurk effect described", "Theories such as motor theory and phonemic restoration"],
    module: "thinking-language/2-6",
    visuals: [
      { kind: "reveal", data: { prompt: "You see lips saying 'ga' while hearing 'ba'. What do you hear?", answer: "Most people hear 'da', a fusion of what the eyes and ears report. Close your eyes and it becomes 'ba' again. This is the McGurk effect." } },
    ],
    ref: "Liberman et al 1957 and 1967; McGurk and MacDonald 1976 Nature; Werker and Tees 1984; Warren 1970",
  },
  {
    id: "cog-l04-038",
    subject: S,
    topic: "sentence-processing",
    marks: 10,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester"],
    question: "How do people understand sentences? Discuss garden path sentences and the debate between the garden path model and constraint-based models of parsing.",
    plan: ["What parsing involves", "Garden path sentences with examples", "Frazier's garden path model: minimal attachment, late closure", "Constraint-based models and evidence", "ERP evidence and conclusion"],
    answer: `## Parsing
Understanding a sentence requires parsing: working out its grammatical structure, who did what to whom, as the words arrive one by one. Because sentences are often temporarily ambiguous, the parser must make decisions before all the information is available.

## Garden path sentences
A garden path sentence leads the reader towards one interpretation that turns out to be wrong, forcing a reanalysis.
- "The horse raced past the barn fell." Readers interpret "raced" as the main verb, then reach "fell" and are confused. The correct reading is "The horse (that was) raced past the barn fell."
- "Since Jay always jogs a mile seems like a short distance to him." Readers attach "a mile" as the object of "jogs" and must revise.
- "The old man the boats." "Old" is a noun (the old people) and "man" is a verb.
Eye-tracking shows longer fixations and regressions (looking back) at the point where the initial parse fails.

## The garden path model
Lyn Frazier proposed a two-stage, syntax-first model.
- Stage one: the parser builds a single structure using only syntactic information and simple principles, ignoring meaning and context.
- Minimal attachment: prefer the structure with the fewest nodes (the simplest structure).
- Late closure: attach new words to the phrase currently being processed.
- Stage two: meaning and context are used only to check and, if necessary, revise the parse.
The model explains why garden path sentences are hard even when meaning would rule out the wrong reading. Rayner, Carlson and Frazier found that plausibility did not prevent initial misparsing.

## Constraint-based models
Maryellen MacDonald, Michael Tanenhaus, John Trueswell and others argued that all sources of information are used at once from the start, including:
- Lexical frequency: how often a verb is used in a particular structure. "Raced" is rarely used in a reduced relative clause, so the garden path is strong.
- Plausibility and animacy: "The evidence examined by the lawyer..." causes less difficulty than "The defendant examined by the lawyer...", because evidence cannot examine anything. Trueswell found such semantic cues reduce garden path effects.
- Discourse context: Gerry Altmann and Mark Steedman showed that if a context introduces two horses, "the horse raced past the barn" is naturally read as specifying which one, reducing difficulty.
- Visual context: Tanenhaus's visual world paradigm showed that in "Put the apple on the towel in the box", people's eye movements were influenced immediately by whether the scene contained one apple or two.
Multiple interpretations are considered in parallel, weighted by the strength of each constraint.

## Electrophysiological evidence
ERPs show an N400 response to semantic anomalies ("He spread his bread with socks") and a P600 to syntactic violations or reanalysis, suggesting partly separable semantic and syntactic processes, though their timing overlaps.

## Conclusion
Garden path sentences reveal that parsing is incremental and makes early commitments. The garden path model emphasises syntactic principles, while constraint-based models show that meaning, frequency and context are used rapidly. Current views often accept fast interaction of many sources, with syntax playing a strong role.`,
    keyPoints: ["Definition of parsing and incremental processing", "At least two garden path examples", "Eye-tracking evidence", "Frazier's two-stage model with minimal attachment and late closure", "Constraint-based model principles", "Evidence from animacy, context and visual world", "N400 and P600"],
    module: "thinking-language/2-6",
    visuals: [
      { kind: "compare", data: { title: "Two models of parsing", a: { label: "Garden path model", points: ["Syntax first, meaning later", "Minimal attachment and late closure", "One structure built at a time"], summary: "Serial and syntax-led." }, b: { label: "Constraint-based", points: ["All cues used at once", "Frequency, plausibility, context", "Several structures weighed in parallel"], summary: "Interactive and parallel." } } },
    ],
    ref: "Frazier and Rayner 1982; Rayner, Carlson and Frazier 1983; Trueswell, Tanenhaus and Garnsey 1994; Altmann and Steedman 1988; Tanenhaus et al 1995 Science; Kutas and Hillyard 1980",
  },
  {
    id: "cog-l04-039",
    subject: S,
    topic: "metacognition",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "What is metacognition? Discuss metacognitive monitoring and control, with reference to judgements of learning and the feeling of knowing, and their applications.",
    plan: ["Define metacognition with Flavell", "Nelson and Narens model: monitoring and control", "Judgements of learning and their accuracy", "Feeling of knowing and tip of the tongue", "Metacognition in education and clinical psychology", "Conclusion"],
    answer: `## Meaning
Metacognition is cognition about cognition: knowing about and regulating one's own thinking and memory. John Flavell introduced the term in the 1970s. It includes metacognitive knowledge (knowing that one forgets names easily, or that rereading is less effective than testing) and metacognitive regulation (planning, monitoring and adjusting one's learning).

## Monitoring and control
Thomas Nelson and Louis Narens proposed a model with two levels: an object level (the cognition itself, such as learning a list) and a meta level (a model of that cognition). Information flows upward through monitoring (assessing how well learning is going) and downward through control (deciding what to do, such as restudying, stopping or choosing a strategy). For example, a student who judges that a chapter is not yet learned decides to study it again.

## Judgements of learning
A judgement of learning (JOL) is a prediction of how likely one is to remember an item later.
- Immediate JOLs, made right after study, are often inaccurate because the item is still in working memory and feels easy.
- Delayed JOLs, made after a delay with only a cue, are much more accurate (the delayed JOL effect), because they require a retrieval attempt that simulates the test.
- People base JOLs on cues such as fluency (how easily something is processed), which can mislead. Fluent rereading produces overconfidence; large fonts increase JOLs without improving memory.
- Learners often prefer massed practice and rereading because they feel more fluent, although spacing and testing work better. Robert Bjork called conditions that slow learning but improve retention "desirable difficulties".

## Feeling of knowing and tip of the tongue
- Feeling of knowing (FOK): the sense that one knows an answer one cannot currently recall. Joseph Hart showed that FOK ratings predict later recognition of the answer above chance.
- The tip-of-the-tongue state: one is sure the word is known and can often report its first letter, number of syllables or similar words. Roger Brown and David McNeill induced it by giving definitions of rare words, such as "sampan". Explanations include partial activation of the target and blocking by similar words.
- FOK may be based on the familiarity of the cue and on partial information that comes to mind.

## Neural basis
The prefrontal cortex, especially anterior and medial regions, supports metacognitive judgements. Patients with frontal damage can show poor awareness of their deficits, and patients with Korsakoff's syndrome have impaired FOK judgements.

## Applications
- Education: teaching students to self-test, plan study and judge their learning accurately improves achievement. Accurate monitoring guides better control.
- The Dunning Kruger effect: people with low skill in a domain often overestimate their ability because the same skills are needed to judge performance.
- Clinical psychology: Adrian Wells's metacognitive therapy targets beliefs about thinking, such as "Worrying keeps me safe" or "My thoughts are uncontrollable and dangerous", which maintain generalised anxiety and rumination. Metacognitive training is used in psychosis to address jumping to conclusions and overconfidence in errors.
- Insight in psychiatry is partly a metacognitive capacity.

## Conclusion
Metacognition is the mind's ability to monitor and control itself. Its accuracy depends on the cues used, it can be improved by delayed judgements and self-testing, and its distortions contribute to both poor learning and psychological disorders.`,
    keyPoints: ["Definition with Flavell", "Knowledge and regulation", "Nelson and Narens monitoring and control", "JOLs and delayed JOL effect", "Fluency as a misleading cue and desirable difficulties", "Feeling of knowing and tip of the tongue", "Educational and clinical applications including metacognitive therapy"],
    module: "thinking-language/2-5",
    visuals: [
      { kind: "flow", data: { title: "Nelson and Narens model", layout: "cycle", nodes: [{ id: "o", label: "Object level", detail: "The learning or remembering itself." }, { id: "m", label: "Monitoring", detail: "How well do I know this?" }, { id: "meta", label: "Meta level", detail: "A model of one's own learning." }, { id: "c", label: "Control", detail: "Restudy, test myself, or move on." }] } },
    ],
    ref: "Flavell 1979; Nelson and Narens 1990; Nelson and Dunlosky 1991 delayed JOL; Hart 1965; Brown and McNeill 1966; Bjork 1994; Wells 2009 Metacognitive Therapy; Kruger and Dunning 1999",
  },
  {
    id: "cog-l04-040",
    subject: S,
    topic: "creativity",
    marks: 20,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Discuss the nature of creativity. Describe the main theories and methods of measuring creativity, its relationship with intelligence and personality, and how creativity can be fostered.",
    plan: ["Define creativity: novelty and usefulness; levels", "Process theories: Wallas, Guilford, Mednick", "Systems and componential theories: Amabile, Sternberg and Lubart, Csikszentmihalyi", "Measurement: divergent thinking tests, RAT, consensual assessment", "Intelligence, personality, mental illness and neuroscience", "Culture, India and fostering creativity, conclusion"],
    answer: `## Meaning
Creativity is the ability to produce ideas or products that are both novel (original, unexpected) and appropriate (useful, adapted to constraints). Novelty alone is not enough: a random string of words is novel but not creative. Creativity occurs at several levels, described by James Kaufman and Ronald Beghetto's four C model:
- mini-c: personal insights during learning,
- little-c: everyday creativity, such as a new recipe,
- Pro-c: professional-level creativity,
- Big-C: eminent creativity that changes a field, as with Rabindranath Tagore or Srinivasa Ramanujan.
Researchers study the four Ps: the person, the process, the product and the press (environment).

## Process theories
- Graham Wallas's four stages: preparation (gathering knowledge), incubation (setting the problem aside), illumination (the sudden insight) and verification (testing and refining).
- J. P. Guilford, in his 1950 presidential address to the APA, argued that psychology had neglected creativity. In his structure of intellect model he distinguished convergent thinking (finding the single correct answer) from divergent thinking (generating many possible answers), and saw divergent thinking as central to creativity. Its components are fluency (number of ideas), flexibility (number of categories), originality (statistical rarity) and elaboration (detail).
- Sarnoff Mednick's associative theory: creative people have flat associative hierarchies, so they reach remote associations, linking ideas that others do not.
- Dual process views: idea generation (spontaneous, associative) alternates with evaluation (controlled, critical).
- The Geneplore model of Ronald Finke, Thomas Ward and Steven Smith: generating pre-inventive structures, then exploring them.

## Systems and componential theories
- Teresa Amabile's componential model: creativity requires domain-relevant skills (knowledge and technique), creativity-relevant processes (cognitive style, tolerance of ambiguity, risk-taking) and intrinsic task motivation. Her studies showed that expected evaluation and rewards can reduce creativity when people are not already interested; intrinsic motivation fosters creativity.
- Robert Sternberg and Todd Lubart's investment theory: creative people "buy low and sell high", pursuing unfashionable ideas and persuading others of their value. Creativity needs intellectual abilities, knowledge, thinking styles, personality, motivation and environment.
- Mihaly Csikszentmihalyi's systems model: creativity emerges from the interaction of a person, a domain (a body of knowledge and rules) and a field (the gatekeepers who judge contributions). Whether a product is creative is partly a social judgement.

## Measurement
- Divergent thinking tests: Guilford's alternative uses task ("How many uses can you think of for a brick?") and the Torrance Tests of Creative Thinking, with verbal and figural forms, scored for fluency, flexibility, originality and elaboration. In India, Baqer Mehdi developed verbal and non-verbal tests of creative thinking, and Passi's tests of creativity are also used.
- Remote Associates Test (Mednick): find a word linking three others, such as "cottage, Swiss, cake" (cheese).
- Consensual assessment technique (Amabile): independent experts rate products such as poems or collages; agreement among judges is usually high.
- Self-report inventories of creative achievement and personality.
- Biographical and historiometric methods for eminent creators, as in Dean Keith Simonton's work.
Limitations: divergent thinking test scores predict real creative achievement only modestly, although Torrance's longitudinal studies found some long-term prediction.

## Creativity and intelligence
- The threshold hypothesis: intelligence and creativity correlate up to an IQ of about 120, beyond which further intelligence adds little. Evidence is mixed; meta-analyses find an overall correlation of only about 0.2.
- Lewis Terman's gifted children mostly became successful but few were eminently creative.
- Getzels and Jackson distinguished high creative and high IQ groups of adolescents.

## Creativity and personality
- Openness to experience is the strongest Big Five correlate of creativity.
- Creative people tend to be independent, tolerant of ambiguity, curious, persistent, risk-taking and sometimes less agreeable.
- Csikszentmihalyi described creative people as combining apparent opposites, such as playfulness and discipline.

## Creativity and mental illness
Kay Redfield Jamison and Nancy Andreasen reported higher rates of mood disorders in writers and artists. Large Swedish register studies found more bipolar disorder among people in creative professions and among relatives of people with schizophrenia and bipolar disorder, suggesting a shared vulnerability, perhaps through openness and reduced latent inhibition. But severe illness usually impairs creative work, and romanticising the link is unhelpful.

## Neuroscience
Creativity involves interaction between the default mode network (spontaneous idea generation, mind-wandering), the executive control network (evaluation and focus) and the salience network (switching between them), as shown by Roger Beaty and colleagues. The right hemisphere's role is overstated; creativity relies on both hemispheres.

## Culture and India
Western definitions stress novelty and individual achievement, while Eastern traditions often value creativity as reinterpretation or elaboration of tradition, as in classical music improvisation within a raga or the evolving retellings of the epics. The Indian frugal innovation known as jugaad is everyday problem-solving creativity, although critics note it can excuse poor quality. Rote learning and examination pressure in Indian schools are often criticised for suppressing divergent thinking.

## Fostering creativity
- Encourage intrinsic motivation, curiosity and choice.
- Build deep domain knowledge; creativity requires expertise.
- Allow time for incubation and play; reduce fear of evaluation and failure.
- Teach techniques: brainstorming (though individuals often generate more ideas alone than in groups, because of production blocking and evaluation apprehension), SCAMPER, analogy and reframing problems.
- Expose learners to diverse cultures and ideas; multicultural experience has been linked to creativity.
- Create supportive environments with psychological safety, as in workplaces studied by Amabile.
- The new National Education Policy 2020 emphasises critical thinking, arts integration and experiential learning, which could help.

## Conclusion
Creativity combines novelty with usefulness and draws on cognition (divergent thinking, remote association), knowledge, personality, motivation and social context. It can be measured imperfectly, is only modestly related to intelligence, and can be fostered by environments that value curiosity and intrinsic motivation.`,
    keyPoints: ["Definition with novelty and appropriateness", "Four C model or four Ps", "Wallas stages and Guilford's divergent thinking components", "Mednick's associative theory", "Amabile, Sternberg and Lubart, Csikszentmihalyi theories", "Measurement including Torrance and Indian tests", "Relation to intelligence, personality and mental illness", "Ways to foster creativity with Indian context"],
    pitfalls: ["Equating creativity with divergent thinking alone", "Claiming a strong link between genius and madness"],
    module: "thinking-language/3-4",
    visuals: [
      { kind: "flow", data: { title: "Guilford's divergent thinking scores", layout: "tree", nodes: [{ id: "d", label: "Divergent thinking" }, { id: "f", label: "Fluency", parent: "d", detail: "How many ideas?" }, { id: "fl", label: "Flexibility", parent: "d", detail: "How many kinds of idea?" }, { id: "o", label: "Originality", parent: "d", detail: "How rare are the ideas?" }, { id: "e", label: "Elaboration", parent: "d", detail: "How much detail?" }] } },
      { kind: "compare", data: { title: "Convergent versus divergent thinking", a: { label: "Convergent", points: ["One correct answer", "Logic and accuracy", "Typical of IQ tests"], summary: "Narrowing down." }, b: { label: "Divergent", points: ["Many possible answers", "Fluency and originality", "Uses of a brick"], summary: "Opening out." } } },
    ],
    ref: "Guilford 1950; Wallas 1926; Mednick 1962; Amabile 1983 and 1996; Sternberg and Lubart 1995; Csikszentmihalyi 1996; Kaufman and Beghetto 2009; Kim 2005 meta-analysis IQ creativity r about 0.17; Kyaga et al 2013; Beaty et al 2016; Mehdi 1973",
  },
];
