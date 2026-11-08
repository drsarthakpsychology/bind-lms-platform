import type { LongQA } from "@/lib/prep/long-types";

const S = "developmental" as const;

export const DEVELOPMENTAL_L03: LongQA[] = [
  {
    id: "dev-l03-021",
    subject: S,
    topic: "kohlberg",
    marks: 10,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester", "mcp-entrance"],
    question: "Discuss cultural perspectives on moral development, with reference to Shweder's three ethics, Miller's research on interpersonal duty and the Indian concept of dharma.",
    plan: ["Limits of a justice-only view", "Shweder's ethics of autonomy, community and divinity", "Shweder's Bhubaneswar study", "Miller's research on duty", "Dharma and Indian moral thought", "Implications and conclusion"],
    answer: `## Beyond justice
Kohlberg's theory treated moral development as progress towards abstract principles of justice and individual rights, regarded as universal. Cultural psychologists argue that this reflects Western liberal values and that other cultures develop equally mature but differently organised moral systems.

## Shweder's three ethics
Richard Shweder and colleagues proposed three ethics found in varying balance across cultures:
- Ethic of autonomy: concerns about harm, rights and justice for individuals, dominant in secular Western societies and Kohlberg's theory.
- Ethic of community: concerns about duty, hierarchy, loyalty and the interdependence of roles in family and society.
- Ethic of divinity: concerns about purity, sanctity and the soul's relation to the divine order.
Jonathan Haidt's moral foundations theory later expanded these into care, fairness, loyalty, authority, sanctity and liberty.

## The Bhubaneswar study
Shweder, Manamohan Mahapatra and Joan Miller compared Hindu Brahmin adults and children in Bhubaneswar, Odisha, with Americans in Chicago, asking about 39 scenarios. Many practices Americans saw as personal choices or social conventions, such as a widow eating fish or a son getting a haircut and eating chicken the day after his father's death, were seen by Indians as serious moral violations, because they affected the soul of the deceased or broke sacred order. Conversely, some things Americans considered moral wrongs were seen differently. Indians viewed many rules as natural and universal, not as changeable conventions. The distinction between moral and conventional rules was therefore culturally variable.

## Miller's research on interpersonal duty
Joan Miller compared Indian and American participants on whether a person should help someone in need, such as giving directions or helping a friend, when it was inconvenient. Indians more often saw helping friends and family, and even strangers in moderate need, as a moral obligation, while Americans more often saw it as a matter of personal choice except in life-threatening cases. Miller argued that Indian morality emphasises duty-based interpersonal responsibility rather than individual rights, and that this is a mature moral orientation, not a lower stage.

## Dharma and Indian moral thought
- Dharma refers to duty, righteousness and the moral order sustaining society and the cosmos. Svadharma is one's own duty according to one's stage of life (ashrama), social role and circumstances. Morality is therefore contextual and relational rather than based on universal abstract rules.
- The Bhagavad Gita's discussion of Arjuna's dilemma on the battlefield, whether to fight his relatives, explores conflicts between duties and introduces nishkama karma, acting according to duty without attachment to outcomes.
- Concepts of karma, ahimsa (non-violence) and seva (service) shape moral reasoning.
- Indian psychologists such as Girishwar Misra and Ajit Dalal note that moral reasoning in India integrates duty, purity and relationships with justice concerns; scores on Kohlberg's measures may underestimate this sophistication.

## Implications
- Moral development research needs culturally broad measures that include community and divinity concerns.
- Moral education in India can draw on both universal rights (such as constitutional values) and cultural ideas of duty and care.
- Clinicians should understand patients' moral frameworks, such as guilt linked to duties to family.

## Conclusion
Cross-cultural research shows that moral development is not a single path to justice reasoning. Shweder's three ethics, Miller's work on duty and the concept of dharma show that Indian moral thought emphasises duty, community and sacred order, offering a mature alternative to Kohlberg's individualist ideal.`,
    keyPoints: ["Critique of justice-only view", "Three ethics defined", "Bhubaneswar study findings", "Miller's helping as duty", "Dharma and svadharma", "Bhagavad Gita example", "Implications"],
    module: "lifespan/2-5",
    visuals: [
      { kind: "sort", caption: "Shweder's three ethics", data: { prompt: "Which ethic does each concern belong to?", buckets: ["Autonomy", "Community", "Divinity"], items: [{ text: "It is wrong because it violates her rights", bucket: 0 }, { text: "A son must care for his elderly parents", bucket: 1 }, { text: "Eating meat at a funeral pollutes the soul", bucket: 2 }, { text: "Cheating someone is unfair", bucket: 0 }] } },
    ],
    ref: "Shweder, Mahapatra and Miller 1987; Shweder et al 1997 big three; Miller, Bersoff and Harwood 1990; Miller and Bersoff 1992; Haidt and Joseph 2004; Misra 2009 on Indian psychology",
  },
  {
    id: "dev-l03-022",
    subject: S,
    topic: "language-development",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg", "ugc-net"],
    question: "Describe the stages of language development from birth to early childhood, with typical milestones and characteristic features.",
    plan: ["Prelinguistic stage: crying, cooing, babbling", "First words and the one-word stage", "Two-word stage and telegraphic speech", "Grammar, overregularisation and later development", "Variation, bilingualism and warning signs"],
    answer: `## Prelinguistic stage (0 to 12 months)
- Crying (from birth): different cries for hunger, pain and discomfort, which caregivers learn to distinguish.
- Cooing (about 2 months): vowel-like sounds ("ooo", "aaa"), often in response to a caregiver.
- Babbling (about 6 months): repeated consonant-vowel syllables ("ba-ba-ba", "da-da"). Early babbling includes sounds from many languages; by about 10 to 12 months it narrows to the sounds of the home language. Deaf infants exposed to sign language "babble" with their hands.
- Speech perception: newborns prefer their mother's voice and native language; by 10 to 12 months they lose the ability to distinguish many non-native sounds (perceptual narrowing).
- Joint attention and gestures (9 to 12 months): pointing, showing and following another's gaze are foundations for word learning.

## First words and the one-word stage (about 12 to 18 months)
- First words appear around the first birthday, usually names of people, animals, foods and toys ("mama", "dada", "doggie").
- Holophrases: single words used to express whole ideas ("milk" meaning "I want milk").
- Overextension (calling all four-legged animals "doggie") and underextension (using "cat" only for the family cat).
- Vocabulary grows slowly to about 50 words by 18 months.

## Vocabulary spurt and two-word stage (about 18 to 24 months)
- Vocabulary spurt: rapid learning of new words, sometimes several a day, reaching about 200 to 300 words by age 2.
- Fast mapping: learning a word's meaning after one or two exposures.
- Two-word utterances ("more juice", "daddy go") follow consistent word order and express relations such as possession, location and action.
- Telegraphic speech: short sentences with content words but missing function words and endings ("Mummy go shop").

## Grammar and later development (2 to 5 years)
- Sentences lengthen, measured by mean length of utterance (MLU) in morphemes.
- Roger Brown found that children learn grammatical morphemes in a consistent order, such as "-ing", then "in" and "on", then the plural "-s", then past tense forms.
- Overregularisation: applying rules to irregular words ("I goed", "two mouses", "foots"), showing children are learning rules, not copying.
- Questions, negatives and complex sentences develop.
- By age 5, children have a vocabulary of about 10,000 words and most basic grammar.
- Later: metalinguistic awareness, understanding of jokes, metaphors, sarcasm and complex syntax, and narrative skills develop through middle childhood.

## Pragmatics
Children learn conversational turn-taking, adjusting speech to listeners (4-year-olds simplify speech to 2-year-olds) and polite forms.

## Variation, bilingualism and warning signs
- Wide individual differences exist in the age of first words and vocabulary size.
- In India, many children grow up bilingual or multilingual. Bilingual children may have smaller vocabularies in each language but similar total vocabularies, and show advantages in some aspects of metalinguistic awareness. Mixing languages is normal.
- Red flags for referral: no babbling by 12 months, no words by 16 to 18 months, no two-word phrases by 24 months, loss of language or social skills at any age, which may indicate hearing loss, autism or developmental language disorder.

## Conclusion
Language develops in a predictable sequence, from crying and babbling to words, word combinations and full grammar, by about age 5, while showing individual and cultural variation. Monitoring milestones helps identify children who need early support.`,
    keyPoints: ["Crying, cooing and babbling with ages", "Perceptual narrowing and joint attention", "First words, holophrases, over and underextension", "Vocabulary spurt and fast mapping", "Telegraphic speech", "Brown's morpheme order and overregularisation", "Bilingualism and red flags"],
    module: "lifespan/2-6",
    visuals: [
      { kind: "timeline", caption: "Vocabulary spurt and two-word stage (about 18 to 24 months)", data: { prompt: "Order these language milestones.", events: [{ label: "Cooing", when: "About 2 months" }, { label: "Babbling", when: "About 6 months" }, { label: "Pointing and first words", when: "About 12 months" }, { label: "Vocabulary spurt", when: "18 to 24 months" }, { label: "Two-word telegraphic speech", when: "About 2 years" }, { label: "Overregularisation: 'I goed'", when: "3 to 4 years" }] } },
    ],
    ref: "Brown 1973 A First Language; Werker and Tees 1984; Berk ch 9; Santrock ch 7; Bialystok 2001 bilingualism",
  },
  {
    id: "dev-l03-023",
    subject: S,
    topic: "language-development",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "cuet-pg", "mcp-entrance"],
    question: "Critically evaluate the major theories of language acquisition: learning theory, nativist theory and interactionist theories.",
    plan: ["The puzzle of language acquisition", "Skinner's learning theory and critique", "Chomsky's nativist theory and evidence", "Critique of nativism", "Interactionist and usage-based theories with evidence", "Statistical learning and conclusion"],
    answer: `## The puzzle
Children acquire a complex language system rapidly, mostly without formal teaching, by about age 5. Theories differ on how much is due to innate structures and how much to environmental input and social interaction.

## Learning theory
B. F. Skinner, in "Verbal Behavior" published in 1957, argued that language is learned through operant conditioning: babbling sounds that resemble words are reinforced by parents' attention and approval (shaping), and imitation of adult speech is reinforced. Albert Bandura added observational learning.
Support: children learn the language they hear, with its accent and vocabulary; parental input (amount and quality of speech) predicts vocabulary growth.
Criticisms:
- Children produce sentences they have never heard and make systematic errors ("I goed", "mouses") that are not imitated.
- Roger Brown and Camille Hanlon found that parents reinforce the truth of what children say more than its grammatical correctness.
- Children often ignore corrections ("Nobody don't like me").
- Language develops too fast and too uniformly for shaping word by word.

## Nativist theory
Noam Chomsky argued that humans have an innate language acquisition device (LAD), later described as universal grammar: a set of principles common to all languages, with parameters (such as word order) set by exposure.
Evidence:
- Poverty of the stimulus: the language children hear is limited and messy, yet they acquire complex grammatical rules, suggesting innate guidance.
- Universality: all normal children acquire language in a similar sequence and at similar ages across cultures.
- Critical period: Eric Lenneberg proposed language must be acquired before puberty; Genie, isolated until 13, learned words but never mastered grammar; late learners of sign language and second languages show lasting grammatical deficits.
- Creation of language: deaf children in Nicaragua, without exposure to a full sign language, created Nicaraguan Sign Language with increasingly complex grammar across cohorts; children turn pidgins into creoles with full grammar (Derek Bickerton).
- Specific brain areas and genes: Broca's and Wernicke's areas; the FOXP2 gene mutation in the KE family affected speech and grammar.
- Steven Pinker's "language instinct".
Criticisms:
- Universal grammar is vague and has been revised many times; its contents are hard to specify and test.
- The input is richer than nativists assumed: child-directed speech is simplified, repetitive and attuned to the child.
- Language diversity is greater than predicted; Daniel Everett claimed that Piraha lacks recursion (disputed).
- It neglects social interaction and meaning.
- FOXP2 affects motor control of speech, not grammar specifically.

## Interactionist and usage-based theories
These theories propose that biological readiness interacts with rich social and linguistic input.
- Jerome Bruner's language acquisition support system (LASS): adults scaffold language through routines, such as picture-book reading and games like peekaboo, which provide predictable formats for learning words and turn-taking.
- Child-directed speech (motherese or parentese): high pitch, exaggerated intonation, short sentences and repetition, which infants prefer and which helps them segment speech. Patricia Kuhl found that live social interaction with a Mandarin speaker, but not video or audio, preserved 9-month-old American infants' ability to distinguish Mandarin sounds.
- Michael Tomasello's usage-based theory: children learn language by understanding others' communicative intentions (through joint attention) and by extracting patterns from what they hear, building grammar gradually from specific constructions ("verb islands") to general rules.
- Social interactionist research: Betty Hart and Todd Risley found large differences in the number of words children heard at home linked to vocabulary, though the "30 million word gap" figure has been debated; the quality of conversational turns predicts brain and language development.
- Joint attention: infants who follow their parents' gaze and pointing learn words faster.

## Statistical learning
Jenny Saffran, Richard Aslin and Elissa Newport found that 8-month-old infants exposed for two minutes to a stream of nonsense syllables learned which syllables commonly followed each other, distinguishing "words" from "part-words". This shows powerful general learning mechanisms that can extract structure from input, challenging the poverty of the stimulus argument.

## Comparison
| Theory | Main mechanism | Strength | Weakness |
| Learning | Reinforcement, imitation | Explains role of input and accent | Cannot explain novel sentences and errors |
| Nativist | Innate universal grammar | Explains speed, universality, critical period | Vague, underplays input |
| Interactionist | Social interaction, scaffolding, intention reading, statistical learning | Explains role of context and gradual grammar | Less explanation of complex syntax |

## Conclusion
Language acquisition cannot be explained by reinforcement alone, nor by innate grammar alone. The best current view is interactionist: children bring biological readiness, including powerful statistical learning and social cognition, and learn language through rich, responsive interaction with others.`,
    keyPoints: ["The acquisition puzzle", "Skinner's account and evidence against it including Brown and Hanlon", "Chomsky's LAD and universal grammar", "Poverty of stimulus, critical period, Nicaraguan Sign Language", "Critique of nativism", "Bruner's LASS and child-directed speech", "Kuhl's social interaction and Tomasello's usage-based theory", "Saffran's statistical learning and integrated conclusion"],
    module: "lifespan/2-6",
    visuals: [
      { kind: "compare", caption: "Nativist theory", data: { title: "Nature or nurture in language?", a: { label: "Nativist", points: ["Innate universal grammar", "Fast, universal milestones", "Critical period evidence"], summary: "Built in." }, b: { label: "Interactionist", points: ["Scaffolding and child-directed speech", "Statistical learning from input", "Joint attention and intention reading"], summary: "Built through interaction." } } },
    ],
    ref: "Skinner 1957; Chomsky 1959 and 1965; Brown and Hanlon 1970; Lenneberg 1967; Senghas and Coppola 2001; Bruner 1983; Kuhl, Tsao and Liu 2003 PNAS; Tomasello 2003; Saffran, Aslin and Newport 1996 Science; Hart and Risley 1995",
  },
  {
    id: "dev-l03-024",
    subject: S,
    topic: "language-development",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net"],
    question: "Write a short note on the critical period hypothesis for language, with reference to the case of Genie.",
    plan: ["Lenneberg's hypothesis", "Genie's case", "Other evidence", "Evaluation"],
    answer: `## The hypothesis
Eric Lenneberg proposed in 1967 that there is a critical period for language acquisition, from about age 2 until puberty, linked to brain plasticity and the lateralisation of language. After this period, full native-like language, especially grammar, cannot be acquired.

## Genie
Genie was discovered in Los Angeles in 1970, aged 13, after being confined alone in a small room, tied to a potty chair, beaten if she made noise, and almost never spoken to. She had virtually no language. With intensive teaching over several years, she learned many words and could communicate, but her grammar remained very limited: she produced phrases like "Applesauce buy store" and never mastered word order, pronouns or question forms. Her language seemed to be processed mainly by the right hemisphere.
Interpretation is difficult: severe abuse, malnutrition and possible pre-existing developmental problems could explain her difficulties, and research on her was stopped amid ethical disputes about her care.

## Other evidence
- Isabelle, found at age 6 after isolation with her deaf mother, acquired normal language within two years, consistent with exposure before the end of the critical period.
- Deaf people who learn sign language late show lasting grammatical deficits compared with native signers.
- Jacqueline Johnson and Elissa Newport found that Korean and Chinese immigrants to the United States who arrived before age 7 reached native-like English grammar, while performance declined with later arrival.

## Evaluation
Evidence supports a sensitive period, especially for grammar and accent, rather than a strict critical period with a sharp cut-off; adults can still learn languages well, especially vocabulary.`,
    keyPoints: ["Lenneberg's hypothesis", "Genie's history and grammar deficits", "Confounds in Genie's case", "Isabelle contrast", "Johnson and Newport findings", "Sensitive rather than critical period"],
    module: "lifespan/2-6",
    visuals: [
      { kind: "experiment", caption: "Other evidence", data: { title: "Johnson and Newport: age of arrival and grammar", question: "Grammar test scores by age of arriving in the United States (out of 276, approximate)?", unit: "", max: 276, conditions: [{ label: "Native speakers", value: 269 }, { label: "Arrived at 3 to 7", value: 269 }, { label: "Arrived at 8 to 10", value: 256 }, { label: "Arrived at 17 to 39", value: 210 }], why: "Grammar declined the later learners started, consistent with a sensitive period." } },
    ],
    ref: "Lenneberg 1967; Curtiss 1977 Genie; Davis 1947 on Isabelle; Johnson and Newport 1989 Cognitive Psychology; Mayberry 1993",
  },
  {
    id: "dev-l03-025",
    subject: S,
    topic: "bronfenbrenner",
    marks: 15,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg", "mcp-entrance"],
    question: "Explain Bronfenbrenner's ecological systems theory of development, with examples from the Indian context. Discuss its later bioecological form and its applications.",
    plan: ["Background and the contextual view", "Microsystem, mesosystem, exosystem, macrosystem, chronosystem with Indian examples", "Bioecological model: process, person, context, time", "Research examples", "Applications to policy and intervention", "Evaluation and conclusion"],
    answer: `## Background
Urie Bronfenbrenner, a Russian-born American psychologist, criticised developmental psychology in the 1970s as "the science of the strange behaviour of children in strange situations with strange adults for the briefest possible periods of time". He argued that development must be understood in the real contexts in which children live, as a set of nested systems that interact with each other and with the child. He also co-founded the Head Start programme for disadvantaged preschool children in the United States.

## The ecological systems
- Microsystem: the immediate settings in which the child directly interacts: family, school, peers, neighbourhood, place of worship. Relationships are bidirectional: parents influence children, and children's temperament influences parents. Indian example: a child in a joint family interacts daily with grandparents, uncles, aunts and cousins, as well as parents.
- Mesosystem: the connections between microsystems, such as parent-teacher relationships, or how home and school values match. Example: a first-generation learner whose parents cannot read may struggle when school expects help with homework; a parent-teacher meeting strengthens the mesosystem.
- Exosystem: settings the child does not participate in directly, but which affect the child: a parent's workplace (long hours, migration for work, job loss), local government decisions, the extended family's influence, media. Example: a father migrating from Bihar to work in Surat changes the household's income and the child's daily care.
- Macrosystem: the broad cultural context: values, laws, economic system, religion, caste structure, gender norms. Example: son preference, the importance of board exams, and policies such as the Right to Education Act, the midday meal scheme and the Integrated Child Development Services (anganwadis).
- Chronosystem: changes over time in the person and the environment, including life transitions (birth of a sibling, parents' divorce, starting school) and historical events (the COVID-19 school closures, the spread of smartphones, economic liberalisation).

## The bioecological model
In later work with Stephen Ceci and Pamela Morris, Bronfenbrenner revised the theory into the bioecological model, emphasising the Process Person Context Time (PPCT) model.
- Proximal processes: regular, increasingly complex interactions between the child and people, objects and symbols in the immediate environment, such as parent-child reading or play. These are the "engines of development".
- Person characteristics: the child's biology, temperament, abilities and motivations, which influence and are influenced by processes.
- Context: the nested systems.
- Time: micro-time (moment to moment), meso-time (days and weeks) and macro-time (historical change).
He also stressed that genetic potential is realised through proximal processes, and that the effect of processes depends on context: good parenting matters most in disadvantaged environments.

## Research examples
- Research on parental work stress (exosystem) shows it spills into parent-child interactions.
- Studies of poverty show that it affects children through stressed parenting, poor nutrition, housing and school quality, interacting across systems.
- Studies of Indian children of migrant workers show effects of parental absence and changing family roles.
- The Young Lives longitudinal study in Andhra Pradesh and Telangana traced how household poverty, schooling and community changes shaped children's development.

## Applications
- Interventions should target multiple systems: parent education, teacher training, community programmes and policy. India's Integrated Child Development Services combine nutrition, health and preschool education through anganwadis at the community level.
- School mental health programmes that involve parents and communities.
- Child protection: assessments consider family, school, community and legal systems.
- Counselling and social work use ecomaps to understand clients' systems.

## Evaluation
Strengths:
- Holistic; highlights the importance of context, culture and policy.
- Explains why the same intervention works differently in different settings.
- Encourages research in natural settings and multidisciplinary work.
Weaknesses:
- Very broad, making it difficult to test as a whole; it is more a framework than a predictive theory.
- Early versions underplayed the child's biology and agency, which the bioecological model corrected.
- Measuring all levels at once is difficult.

## Conclusion
Bronfenbrenner's theory shows that development is shaped by interacting layers of context, from family to culture and history, and by proximal processes between the child and the environment. It provides a valuable framework for understanding Indian children's lives in joint families, migrating households and changing communities, and for designing multi-level interventions.`,
    keyPoints: ["Critique of laboratory research and contextual view", "Microsystem with bidirectional influence", "Mesosystem example", "Exosystem example", "Macrosystem with Indian policies and values", "Chronosystem with historical example", "Bioecological PPCT model and proximal processes", "Applications and evaluation"],
    module: "lifespan/1-2",
    visuals: [
      { kind: "layers", caption: "The ecological systems", data: { title: "Bronfenbrenner's ecological systems", shape: "rings", layers: [{ label: "Child", detail: "Temperament, health, abilities." }, { label: "Microsystem", detail: "Family, school, peers, anganwadi." }, { label: "Mesosystem", detail: "Links between home and school." }, { label: "Exosystem", detail: "Parent's workplace, local panchayat, media." }, { label: "Macrosystem", detail: "Culture, laws, caste and gender norms, RTE Act." }, { label: "Chronosystem", detail: "Change over time: migration, COVID-19 school closures." }] } },
    ],
    ref: "Bronfenbrenner 1977 and 1979 The Ecology of Human Development; Bronfenbrenner and Ceci 1994; Bronfenbrenner and Morris 2006; Young Lives India; Santrock ch 1",
  },
  {
    id: "dev-l03-026",
    subject: S,
    topic: "research-designs",
    marks: 10,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Discuss the special methods used to study infants and children, including habituation, preferential looking, violation of expectation and microgenetic designs. What ethical issues arise?",
    plan: ["Challenges of studying young children", "Infant methods: preferential looking, habituation, violation of expectation, conditioning, physiological measures", "Methods for older children: clinical interview, microgenetic design, observation", "Interpretation issues", "Ethics"],
    answer: `## The challenge
Infants cannot speak or follow complex instructions, and young children may misunderstand questions or try to please adults. Researchers therefore use indirect methods based on behaviours infants can already control, such as looking, sucking and heart rate.

## Infant methods
- Preferential looking: two stimuli are shown side by side and the time spent looking at each is recorded. A consistent preference shows that the infant can discriminate them. Robert Fantz found that newborns prefer patterned stimuli and face-like patterns.
- Habituation and dishabituation: a stimulus is shown repeatedly until looking declines (habituation); then a new stimulus is shown. If looking recovers (dishabituation), the infant must perceive the difference. This method revealed categorical perception of colour and speech sounds and early number sensitivity.
- Violation of expectation: infants are shown possible and impossible events; longer looking at impossible events suggests they expected something else. Renee Baillargeon used this to show object permanence at 3 to 4 months; Karen Wynn used it for simple arithmetic.
- High-amplitude sucking: infants suck on a pacifier connected to a recorder; sucking rate increases with interest and declines with habituation, used for speech perception.
- Conditioned head turning: infants are trained to turn their heads when a sound changes, revealing their ability to discriminate speech sounds.
- Physiological measures: heart rate (slowing indicates interest), EEG and ERPs, near-infrared spectroscopy, eye-tracking and cortisol.

## Methods for older children
- Clinical interview (Piaget): flexible questioning to explore reasoning.
- Structured tasks and standardised tests.
- Naturalistic and structured observation, as in the Strange Situation.
- Microgenetic design: the same children are studied intensively over a short period of rapid change (for example several sessions a week as they learn to add), with dense observation of each trial. Robert Siegler used this to show that children use multiple strategies and change gradually (overlapping waves). It reveals the process of change, not just before and after states, but is time-consuming and practice may itself change development.
- Longitudinal, cross-sectional and sequential designs for age-related change.
- Parent and teacher reports, which are useful but subject to bias.

## Interpretation issues
- Looking time can reflect familiarity or novelty preferences, perceptual salience or attention rather than conceptual understanding, so "rich" interpretations of infant knowledge are debated.
- Small samples and low reliability of infant measures have led to replication problems; large collaborative projects such as ManyBabies address this.
- Young children's answers depend on how questions are asked, as the naughty teddy study showed.

## Ethics
- Consent from parents and assent from children who can understand; respecting a child's refusal or distress.
- Minimal risk: procedures such as the Strange Situation cause brief distress and must be stopped if distress is high.
- Confidentiality and care with recordings.
- Avoiding deception, or debriefing appropriately.
- Mandatory reporting under the POCSO Act if abuse is disclosed.
- Fairness: including children from diverse socioeconomic and cultural backgrounds, not just urban middle-class samples.
- Research with institutionalised children, as in the Bucharest Early Intervention Project, raises complex questions about random assignment to foster care versus institutional care.

## Conclusion
Ingenious methods based on looking, sucking and physiological responses have revealed surprising competence in infants, while microgenetic designs show how change happens. Careful interpretation and strong ethical safeguards are essential in research with children.`,
    keyPoints: ["Why special methods are needed", "Preferential looking with Fantz", "Habituation and dishabituation logic", "Violation of expectation with Baillargeon or Wynn", "Other infant measures", "Microgenetic design with Siegler", "Interpretation and replication issues", "Ethical safeguards including POCSO"],
    module: "lifespan/1-3",
    visuals: [
      { kind: "flow", caption: "Infant methods", data: { title: "Habituation method", layout: "chain", nodes: [{ id: "a", label: "Show stimulus A repeatedly", detail: "Looking time falls: habituation." }, { id: "b", label: "Show new stimulus B", detail: "Does looking recover?" }, { id: "c", label: "Looking recovers", detail: "Dishabituation: the infant can tell A from B." }] } },
    ],
    ref: "Fantz 1961; Baillargeon 1987; Wynn 1992; Siegler 1996 and 2006 microgenetic; Frank et al 2017 ManyBabies; Nelson et al 2007 Bucharest project; Berk ch 1",
  },
  {
    id: "dev-l03-027",
    subject: S,
    topic: "lifespan",
    marks: 20,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance", "cuet-pg"],
    question: "Discuss the nature-nurture issue in development. Explain the methods of behaviour genetics, the concepts of heritability, gene-environment correlation and interaction, and epigenetics, with examples.",
    plan: ["The debate and its history", "Methods: twin, adoption and molecular studies", "Heritability and its misinterpretations", "Gene-environment correlation", "Gene-environment interaction and differential susceptibility", "Epigenetics, Indian examples and conclusion"],
    answer: `## The debate
The nature-nurture issue asks how far development is shaped by heredity (genes) and by environment (experience, upbringing, culture). Historically, Francis Galton emphasised heredity, while John Watson claimed he could make any infant into "doctor, lawyer, artist or beggar" through training. Today psychologists agree that both always interact; the questions are how they combine and through what mechanisms.

## Methods of behaviour genetics
- Family studies: relatives share genes in known proportions (first-degree relatives about 50 percent). If a trait is more similar in closer relatives, genes may be involved, but families also share environments.
- Twin studies: identical (monozygotic, MZ) twins share nearly all their genes; fraternal (dizygotic, DZ) twins share about 50 percent on average. If MZ twins are more similar than DZ twins, genetic influence is suggested. Falconer's formula estimates heritability as twice the difference between MZ and DZ correlations.
- Adoption studies: comparing adopted children with their biological parents (shared genes) and adoptive parents (shared environment). Leonard Heston found that children of mothers with schizophrenia adopted away at birth had higher rates of schizophrenia than adopted controls.
- Twins reared apart: the Minnesota Study of Twins Reared Apart, led by Thomas Bouchard, found striking similarities in IQ, personality and interests between MZ twins raised separately.
- Molecular genetics: genome-wide association studies (GWAS) identify many genetic variants of small effect; polygenic scores combine them, though they predict only a modest share of variance and are less accurate for non-European populations, including Indians, because most samples are European.

## Heritability
Heritability is the proportion of variation (differences) in a trait within a particular population, at a particular time, that is due to genetic differences.
Worked example: if the IQ correlation for MZ twins is 0.85 and for DZ twins 0.60, heritability = 2 x (0.85 minus 0.60) = 0.50. Shared environment = 0.85 minus 0.50 = 0.35, and non-shared environment and error = 1 minus 0.85 = 0.15.
Typical estimates: about 0.5 for intelligence in adults (lower in childhood), 0.4 to 0.5 for personality traits, about 0.8 for schizophrenia and bipolar disorder, 0.3 to 0.4 for depression.
Common misinterpretations:
- Heritability does not apply to individuals; it is not the case that half of one person's IQ is genetic.
- High heritability does not mean a trait is unchangeable; height is highly heritable but has risen with better nutrition.
- It is specific to a population and environment. Eric Turkheimer found that heritability of IQ was lower among children from poor families in the United States, where environmental deprivation suppressed genetic potential.
- Differences between groups cannot be explained by heritability within groups.
- Non-shared environment (experiences unique to each child) often explains more than shared family environment, as Robert Plomin argued.

## Gene-environment correlation
Genes influence the environments people experience (Sandra Scarr and Kathleen McCartney):
- Passive: parents provide both genes and environment; musical parents pass on musical genes and fill the home with music.
- Evocative: a child's genetically influenced traits evoke responses; a cheerful baby elicits more smiles and play.
- Active (niche picking): as children grow, they seek environments that fit their dispositions, such as a sporty child joining a cricket team. Active correlation increases with age, which may explain why heritability of IQ rises from childhood to adulthood.

## Gene-environment interaction
The effect of genes depends on the environment, and vice versa.
- Avshalom Caspi and Terrie Moffitt's Dunedin studies reported that men with a low-activity variant of the MAOA gene who had been maltreated in childhood were much more likely to show antisocial behaviour, and that the serotonin transporter (5-HTTLPR) short allele combined with stressful life events predicted depression. Later meta-analyses found the 5-HTTLPR finding inconsistent, a reminder of replication problems in candidate gene research.
- Phenylketonuria (PKU): a genetic disorder that causes intellectual disability only if the child eats a normal diet; a low-phenylalanine diet prevents damage. Newborn screening programmes now detect it.
- Differential susceptibility (Jay Belsky): some children are more sensitive to environments, doing worse in harsh environments but better in supportive ones ("orchid" versus "dandelion" children).
- Range of reaction: genes set a range within which environment determines the outcome.

## Epigenetics
Epigenetics refers to changes in gene expression without changes in the DNA sequence, through mechanisms such as DNA methylation and histone modification, which switch genes on or off in response to experience.
- Michael Meaney found that rat pups licked and groomed a lot by their mothers had less methylation of the glucocorticoid receptor gene in the hippocampus, more receptors and calmer stress responses as adults; cross-fostering showed this was due to care, not genes.
- The Dutch Hunger Winter of 1944 to 1945: individuals exposed to famine in the womb showed altered methylation and higher rates of obesity, diabetes and schizophrenia in adulthood.
- Early adversity and chronic stress leave epigenetic marks, offering a mechanism for how experience "gets under the skin".

## Indian examples
- Twin registries in India are limited, but family studies at NIMHANS and elsewhere show familial clustering of schizophrenia and bipolar disorder.
- Consanguineous marriage, common in some Indian communities, increases rates of recessive genetic disorders.
- Undernutrition and stunting, affecting over a third of Indian children under five in the National Family Health Survey, show how environment limits the expression of genetic potential for growth and cognition.

## Conclusion
Development results from the continuous interplay of nature and nurture. Behaviour genetics shows substantial genetic influence on most traits, but heritability is population-specific and does not mean fixity. Gene-environment correlation, interaction and epigenetics reveal how genes and experience shape each other, with clear implications for early intervention.`,
    keyPoints: ["History of the debate", "Twin, adoption and molecular methods", "Heritability defined with worked Falconer example", "Misinterpretations of heritability with Turkheimer", "Three types of gene-environment correlation", "G x E with Caspi and PKU, and replication caveat", "Epigenetics with Meaney and Dutch Hunger Winter", "Indian examples and conclusion"],
    pitfalls: ["Saying heritability applies to an individual", "Equating heritable with unchangeable"],
    module: "lifespan/1-2",
    visuals: [
      { kind: "worked", caption: "Heritability", data: { title: "Falconer's formula", steps: [{ q: "MZ correlation 0.85, DZ 0.60. Heritability?", a: "2 x (0.85 minus 0.60) = 0.50" }, { q: "Shared environment?", a: "0.85 minus 0.50 = 0.35" }, { q: "Non-shared environment and error?", a: "1 minus 0.85 = 0.15" }], yourTurn: [{ q: "MZ 0.50, DZ 0.25 for a personality trait. Heritability and shared environment?", a: "Heritability 0.50; shared environment 0.50 minus 0.50 = 0." }] } },
      { kind: "sort", caption: "Gene-environment correlation", data: { prompt: "Which type of gene-environment correlation?", buckets: ["Passive", "Evocative", "Active"], items: [{ text: "Book-loving parents fill the house with books", bucket: 0 }, { text: "A smiling baby gets more attention from strangers", bucket: 1 }, { text: "A curious teenager joins the science club", bucket: 2 }] } },
    ],
    ref: "Plomin et al Behavioral Genetics; Bouchard et al 1990 Science; Heston 1966; Turkheimer et al 2003; Scarr and McCartney 1983; Caspi et al 2002 and 2003; Culverhouse et al 2018 5-HTTLPR; Weaver, Meaney et al 2004; Heijmans et al 2008; NFHS-5",
  },
  {
    id: "dev-l03-028",
    subject: S,
    topic: "lifespan",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net"],
    question: "Explain Baltes's lifespan perspective on development and its key principles. Describe the selective optimisation with compensation model.",
    plan: ["The lifespan perspective", "Key principles with examples", "Normative and non-normative influences", "SOC model with examples", "Evaluation"],
    answer: `## The lifespan perspective
Paul Baltes, a German psychologist who led the Berlin Aging Study, argued that development is not limited to childhood but continues from conception to death, and must be studied across the whole lifespan. He set out several principles that challenge traditional views of development as growth followed by decline.

## Key principles
- Development is lifelong: no age period dominates; adulthood and old age involve change too.
- Multidimensional: development involves biological, cognitive and socioemotional dimensions, each with many components.
- Multidirectional: some abilities increase while others decrease at the same age. In old age, crystallised knowledge and wisdom may grow while processing speed declines.
- Gains and losses: every developmental change involves both. Specialising in one career means losing other options. The balance shifts towards losses in very old age.
- Plastic: individuals can change throughout life; cognitive training improves older adults' memory, though plasticity declines with age.
- Historically embedded: development is shaped by historical conditions, such as growing up during the Partition of India or the COVID-19 pandemic.
- Contextual: development occurs in contexts of family, culture and society.
- Multidisciplinary: psychology, biology, sociology and anthropology all contribute.
- Co-constructed by biology, culture and the individual.

## Three kinds of influence
- Normative age-graded influences: similar for people of the same age, such as puberty, starting school, retirement.
- Normative history-graded influences: common to a generation, such as economic liberalisation, smartphone use or wars.
- Non-normative life events: unusual events for an individual, such as early death of a parent, winning a lottery or a serious accident. Their impact grows in importance with age.

## Selective optimisation with compensation (SOC)
Baltes and Margret Baltes proposed SOC as a strategy for successful ageing and development:
- Selection: choosing fewer, more important goals and domains as resources decline.
- Optimisation: investing time and effort to maintain or improve performance in the chosen areas, through practice and new strategies.
- Compensation: using alternative means when abilities decline, such as hearing aids, reminders, or relying on others.
Classic example: the pianist Arthur Rubinstein, asked in his eighties how he still played so well, said he played fewer pieces (selection), practised them more (optimisation) and slowed down before fast passages so that they seemed faster by contrast (compensation).
Indian example: an elderly vegetable seller who gives up a distant market (selection), focuses on regular customers (optimisation) and asks her grandson to keep accounts on a phone (compensation).
Research shows that people who use SOC strategies report higher wellbeing and better functioning in old age and in demanding work roles.

## Evaluation
The lifespan perspective broadened developmental psychology, encouraged study of adulthood and ageing, and emphasised plasticity and context. Critics note that its principles are broad and descriptive rather than a testable theory, and SOC may describe adaptation rather than explain it.

## Conclusion
Baltes's lifespan perspective sees development as lifelong, multidirectional, plastic and contextual, involving both gains and losses. The SOC model explains how people manage these changes and age successfully.`,
    keyPoints: ["Lifelong development", "At least six principles with examples", "Gains and losses and multidirectionality", "Three types of influences", "SOC components", "Rubinstein example", "Evaluation"],
    module: "lifespan/1-2",
    visuals: [
      { kind: "flow", data: { title: "Selective optimisation with compensation", layout: "chain", nodes: [{ id: "s", label: "Select", detail: "Play fewer pieces." }, { id: "o", label: "Optimise", detail: "Practise them more." }, { id: "c", label: "Compensate", detail: "Slow down before fast passages." }] } },
    ],
    ref: "Baltes 1987 Developmental Psychology; Baltes and Baltes 1990; Freund and Baltes 1998; Santrock ch 1",
  },
  {
    id: "dev-l03-029",
    subject: S,
    topic: "lifespan",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "md-psychiatry"],
    question: "Describe the stages of prenatal development and the major teratogens that can harm it. What are the implications for maternal and child health in India?",
    plan: ["Three prenatal periods", "Principles of teratogenic effects", "Major teratogens with effects", "Maternal factors", "Indian implications"],
    answer: `## Prenatal periods
- Germinal period (conception to about 2 weeks): the fertilised egg (zygote) divides and implants in the uterine wall.
- Embryonic period (about 2 to 8 weeks): the major organs and body structures form (organogenesis), including the neural tube, heart, limbs, eyes and ears. This is the period of greatest vulnerability.
- Fetal period (9 weeks to birth): growth and refinement of organs; the brain grows rapidly, neurons migrate and connections form; the fetus responds to sounds and can recognise the mother's voice by birth.

## Principles of teratogenic effects
A teratogen is any environmental agent that can cause birth defects or developmental problems. Effects depend on:
- Timing: each organ has a sensitive period; most structural defects occur in the embryonic period, but the brain remains vulnerable throughout pregnancy.
- Dose and duration of exposure.
- Genetic susceptibility of mother and fetus.
- Combination with other risks, such as poverty and poor nutrition.
- Some effects appear only later, as with learning problems.

## Major teratogens
- Alcohol: fetal alcohol spectrum disorders, including fetal alcohol syndrome, with distinctive facial features (thin upper lip, smooth philtrum, small eye openings), growth deficits, intellectual disability, attention and behaviour problems. No amount is known to be safe.
- Tobacco smoking and second-hand smoke: low birth weight, prematurity, sudden infant death and later attention problems. Smokeless tobacco and indoor smoke from chulhas are relevant in India.
- Illicit drugs: opioids cause neonatal withdrawal; cocaine and methamphetamine are linked to growth and attention problems.
- Prescription drugs: thalidomide, given for morning sickness in the late 1950s and early 1960s, caused severe limb defects; valproate causes neural tube defects and lower IQ; isotretinoin and some anticonvulsants are also teratogenic. Lithium has a small risk of cardiac defects.
- Infections: rubella in the first trimester causes deafness, blindness, heart defects and intellectual disability (hence vaccination); cytomegalovirus, toxoplasmosis, syphilis, HIV, and Zika virus (microcephaly).
- Radiation and environmental toxins: lead, mercury (Minamata disease), arsenic in groundwater, pesticides.
- Maternal illness: uncontrolled diabetes, hypertension, thyroid disease.

## Maternal factors
- Nutrition: folic acid deficiency causes neural tube defects; iodine deficiency causes cretinism and lower IQ; maternal anaemia and undernutrition lead to low birth weight and impaired brain development.
- Age: teenage and older mothers face higher risks; older maternal age increases the risk of Down syndrome.
- Maternal stress and depression: high cortisol and stress are linked to prematurity, low birth weight and later emotional problems; perinatal depression affects bonding.
- Rh incompatibility.

## Implications for India
- High rates of maternal anaemia (over half of pregnant women in the National Family Health Survey) and low birth weight call for iron and folic acid supplementation and nutritional support through anganwadis and schemes such as the Pradhan Mantri Matru Vandana Yojana.
- Universal iodisation of salt has reduced iodine deficiency disorders.
- Rubella vaccination through the measles-rubella campaign.
- Antenatal screening for HIV, syphilis, diabetes and anaemia.
- Reducing tobacco use, including smokeless tobacco, and indoor air pollution.
- Screening and support for perinatal depression, which affects roughly one in five Indian mothers in many studies.
- Psychiatrists must weigh medication risks in pregnancy, for example avoiding valproate in women of childbearing age.

## Conclusion
Prenatal development is a period of rapid growth and high vulnerability, especially in the embryonic period. Many teratogens and maternal factors are preventable, so maternal nutrition, vaccination, avoidance of alcohol and tobacco, careful prescribing and mental health care are key to healthy child development in India.`,
    keyPoints: ["Three prenatal periods", "Embryonic period as most vulnerable", "Principles: timing, dose, susceptibility", "Alcohol and FASD features", "Thalidomide and valproate", "Rubella and other infections", "Nutritional factors such as folic acid and iodine", "Indian programmes and perinatal depression"],
    module: "lifespan/1-2",
    visuals: [
      { kind: "timeline", caption: "Prenatal periods", data: { prompt: "Order the prenatal periods.", events: [{ label: "Germinal: cell division and implantation", when: "0 to 2 weeks" }, { label: "Embryonic: organs form, most vulnerable", when: "2 to 8 weeks" }, { label: "Fetal: growth and brain development", when: "9 weeks to birth" }] } },
    ],
    ref: "Moore, Persaud and Torchia The Developing Human; Santrock ch 3; NFHS-5 2019-21; Stahl prescriber's guidance on valproate in pregnancy; Fisher et al 2012 perinatal depression in LMICs",
  },
  {
    id: "dev-l03-030",
    subject: S,
    topic: "lifespan",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "What is temperament? Describe the approaches of Thomas and Chess, Kagan and Rothbart, and discuss the concept of goodness of fit.",
    plan: ["Define temperament", "Thomas and Chess: New York Longitudinal Study", "Kagan's behavioural inhibition", "Rothbart's dimensions", "Stability, biology and goodness of fit", "Applications"],
    answer: `## Meaning
Temperament refers to early-appearing, biologically based individual differences in emotional reactivity, activity and self-regulation. It forms the foundation of later personality. Temperament is visible in infancy, for example in how easily a baby is soothed or how it reacts to new people.

## Thomas and Chess: the New York Longitudinal Study
Alexander Thomas and Stella Chess began following 141 children from infancy in 1956, rating nine dimensions from parent interviews: activity level, rhythmicity (regularity of sleep and feeding), approach or withdrawal from new situations, adaptability, intensity of reaction, threshold of responsiveness, quality of mood, distractibility, and attention span and persistence. They identified three types:
- Easy children (about 40 percent): regular routines, cheerful, adapt easily to new experiences.
- Difficult children (about 10 percent): irregular routines, slow to accept new experiences, react intensely and negatively.
- Slow-to-warm-up children (about 15 percent): inactive, mild reactions, negative mood and slow adaptation to new experiences.
About 35 percent did not fit any category. Difficult temperament predicted later adjustment problems, but this depended on how parents responded.

## Kagan's behavioural inhibition
Jerome Kagan studied inhibited children, who are shy, cautious and fearful of unfamiliar people and situations, and uninhibited children, who are sociable and bold. About 15 to 20 percent of infants are highly reactive to new stimuli (showing much motor activity and crying at 4 months) and tend to become inhibited toddlers. Inhibited children show higher heart rates, cortisol and amygdala reactivity to novelty. Inhibition is moderately stable; some inhibited children become less shy with supportive parenting. High inhibition is a risk factor for social anxiety in adolescence.

## Rothbart's model
Mary Rothbart proposed three broad dimensions, measured by parent questionnaires:
- Extraversion or surgency: approach, positive emotion, activity.
- Negative affectivity: fear, frustration, sadness, discomfort.
- Effortful control: the ability to focus attention, inhibit impulses and plan, linked to executive attention.
Effortful control predicts later self-regulation, social competence, conscience and academic achievement, and develops strongly in early childhood. These dimensions map onto the Big Five in adulthood.

## Biology and stability
Temperament is moderately heritable (twin studies suggest about 40 to 50 percent) and linked to neural systems (amygdala reactivity, prefrontal regulation). It shows moderate stability, increasing after infancy, but is shaped by experience.

## Goodness of fit
Thomas and Chess proposed that outcomes depend on the goodness of fit between a child's temperament and the demands and expectations of the environment. A difficult child whose parents are patient, consistent and sensitive often develops well; the same child with harsh, inconsistent parenting is at risk of behaviour problems. A highly active child may fit a rural household with outdoor space better than a small city flat with strict rules. Culture defines what is a good fit: shy, reserved behaviour may be valued in some cultures and seen as a problem in others. Differential susceptibility theory adds that some temperamentally sensitive children are more affected by both poor and good environments.

## Applications
- Helping parents understand that a "difficult" child is not deliberately naughty and adjusting their approach.
- Teachers adapting classroom demands to children's temperaments.
- Early identification of inhibited children at risk for anxiety.
- Indian research has used temperament measures in studying school readiness and childhood behaviour problems.

## Conclusion
Temperament describes early, biologically based individual differences in reactivity and self-regulation. Thomas and Chess, Kagan and Rothbart offer complementary approaches, and the concept of goodness of fit shows that outcomes depend on the match between child and environment.`,
    keyPoints: ["Definition", "NYLS nine dimensions and three types with percentages", "Kagan's inhibition and its biology", "Rothbart's three dimensions with effortful control", "Heritability and stability", "Goodness of fit with examples", "Applications"],
    module: "lifespan/2-4",
    visuals: [
      { kind: "experiment", caption: "Thomas and Chess: the New York Longitudinal Study", data: { title: "Thomas and Chess's temperament types", question: "What share of children fell into each group?", unit: "%", conditions: [{ label: "Easy", value: 40 }, { label: "Slow to warm up", value: 15 }, { label: "Difficult", value: 10 }, { label: "Not classifiable", value: 35 }], why: "Most children were easy or mixed; difficult temperament predicted problems mainly when the fit with parenting was poor." } },
    ],
    ref: "Thomas and Chess 1977; Kagan 1994 Galen's Prophecy; Rothbart 2007; Belsky and Pluess 2009; Berk ch 10",
  },
];
