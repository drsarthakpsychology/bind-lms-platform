import { R, bm, cmp, concept, ly, tl, xp, type Concept } from "./kit";

/** Development, social behaviour, personality and the history of psychology: real tasks, real studies and true sequences. */

const SOC = ["social", "research-methods", "ethics-law", "history-systems", "organisational", "ugc-paper1"] as const;
const PERS = ["personality-theories", "history-systems", "clinical-therapies", "developmental", "biological", "psychopathology"] as const;
const HIS = ["history-systems", "ugc-paper1", "cognitive", "learning-motivation-emotion"] as const;

export const PEOPLE: Concept[] = [
  /* ------------------------------------------------ development */
  concept("dev-conservation", R(["developmental", "cognitive", "history-systems"], /conservation|centration|decentr|reversib|compensation|identity (argument|reasoning)|preoperational|concrete operational|egocentri|three.mountains?|animism|class inclusion/i), "conservation", { kind: "liquid", caption: "Pour the water into the tall glass and switch between the two children. The preoperational child centres on height and says the tall glass has more; the concrete operational child gives the reasons: nothing was added (identity), you can pour it back (reversibility), it is taller but thinner (compensation)." }),
  concept("dev-piaget", R(["developmental", "cognitive", "history-systems", "personality-theories"], /piaget|sensorimotor|object permanence|formal operational|hypothetico.deductive|circular reactions?|a.not.b|deferred imitation|stages? of cognitive development/i, undefined, /conservation|centration/i), "timeline", tl("Put Piaget's stages in order", [
    ["Sensorimotor: learning through senses and action; object permanence develops", "Birth to about 2 years"],
    ["Preoperational: symbols and language, but egocentric and fails conservation", "About 2 to 7 years"],
    ["Concrete operational: logical thinking about real things; conserves", "About 7 to 11 years"],
    ["Formal operational: abstract and hypothetical reasoning", "About 11 years onwards"],
  ], "The order is fixed, the ages are rough. Later research found infants know more, earlier, than Piaget thought (for example violation-of-expectation studies of object permanence).")),
  concept("dev-erikson", R(["developmental", "personality-theories", "counselling", "history-systems", "health"], /erikson|psychosocial (stage|crisis|development)|trust (vs|versus)|autonomy (vs|versus)|initiative (vs|versus)|industry (vs|versus)|identity (vs|versus)|intimacy (vs|versus)|generativity|integrity (vs|versus)|ego integrity|role confusion/i), "timeline", tl("Put Erikson's eight stages in order", [
    ["Trust vs mistrust (hope)", "Infancy, 0 to 1"],
    ["Autonomy vs shame and doubt (will)", "1 to 3"],
    ["Initiative vs guilt (purpose)", "3 to 6"],
    ["Industry vs inferiority (competence)", "6 to 12"],
    ["Identity vs role confusion (fidelity)", "Adolescence"],
    ["Intimacy vs isolation (love)", "Young adulthood"],
    ["Generativity vs stagnation (care)", "Middle adulthood"],
    ["Integrity vs despair (wisdom)", "Late adulthood"],
  ], "Each stage's crisis, resolved well, gives the strength in brackets.")),
  concept("dev-kohlberg", R(["developmental", "social", "personality-theories"], /kohlberg|heinz|pre.?conventional|post.?conventional|conventional (level|morality)|moral (reasoning|stages?|judgement)|gilligan|ethic of care|social contract|universal ethical/i), "timeline", tl("Put Kohlberg's six stages of moral reasoning in order", [
    ["Obedience and punishment", "Preconventional"],
    ["Self-interest, instrumental exchange", "Preconventional"],
    ["Good boy or good girl, approval of others", "Conventional"],
    ["Law and order, duty to society", "Conventional"],
    ["Social contract and individual rights", "Postconventional"],
    ["Universal ethical principles", "Postconventional"],
  ], "Stages are about the reasoning in answers to dilemmas such as Heinz's, not the answer itself. Gilligan argued the scale undervalues an ethic of care.")),
  concept("dev-freud", R(["developmental", "personality-theories", "clinical-therapies", "history-systems"], /psychosexual|oral stage|anal stage|phallic|latency (stage|period)|genital stage|oedipus|electra|fixation|anal.retentive/i), "timeline", tl("Put Freud's psychosexual stages in order", [
    ["Oral: pleasure from the mouth", "0 to 1 year"],
    ["Anal: pleasure and conflict over toilet training", "1 to 3 years"],
    ["Phallic: Oedipus complex, identification with the same-sex parent", "3 to 6 years"],
    ["Latency: sexual energy is quiet, skills and friendships grow", "6 to puberty"],
    ["Genital: mature sexuality", "Puberty onwards"],
  ], "Fixation at a stage was said to leave adult traits (for example orderliness and stubbornness from the anal stage).")),
  concept("dev-strange", R(["developmental", "personality-theories", "counselling", "clinical-therapies", "psychopathology", "clinical-psychiatry", "social"], /strange situation|ainsworth|attachment (style|type|classification|pattern|theory)|secure(ly)? attach|insecure|avoidant attach|ambivalent|resistant attach|disorgani[sz]ed attach|bowlby|internal working model|harlow|contact comfort|monotropy|maternal deprivation|reactive attachment|adult attachment interview/i), "strange", { caption: "Step through the episodes and switch between the four infants. The reunion tells you the most: the secure infant seeks comfort and settles; the avoidant infant ignores the caregiver; the ambivalent (resistant) infant clings and resists; the disorganised infant freezes or behaves in contradictory ways, often after frightening care. Bowlby's internal working models carry these patterns forward." }),
  concept("dev-bowlby", R(["developmental"], /phases of attachment|pre.attachment|attachment.in.the.making|clear.cut attachment|reciprocal relationships?|separation (protest|anxiety)|stranger anxiety|protest.{0,20}despair.{0,20}detachment/i), "timeline", tl("Put Bowlby's phases of attachment in order", [
    ["Pre-attachment: signals (crying, smiling) to anyone", "Birth to about 6 weeks"],
    ["Attachment in the making: prefers familiar people", "About 6 weeks to 6 to 8 months"],
    ["Clear-cut attachment: separation protest and stranger anxiety", "About 6 to 8 months to 18 to 24 months"],
    ["Reciprocal relationship: understands the caregiver's comings and goings", "From about 18 to 24 months"],
  ])),
  concept("dev-sally", R(["developmental", "cognitive", "psychopathology", "clinical-psychiatry", "social"], /sally.anne|false.belief|theory of mind|mindblind|baron.cohen|smarties (task|tube)|mentali[sz]ing/i), "experiment", xp("The Sally-Anne task", "Sally hides her marble in the basket and leaves. Anne moves it to the box. 'Where will Sally look for her marble?' What share of each group answered correctly (the basket)?", "%", [
    ["Typically developing children (about 4 years)", 85],
    ["Children with Down syndrome", 86],
    ["Autistic children", 20],
  ], "Most autistic children answered 'the box', where the marble really is, even with a higher mental age than the Down syndrome group. Baron-Cohen, Leslie and Frith took this as a specific difficulty in theory of mind.")),
  concept("dev-temperament", R(["developmental", "personality-theories"], /temperament|thomas and chess|easy (child|baby|temperament)|difficult (child|temperament)|slow.to.warm|goodness of fit|behavioural inhibition|kagan|new york longitudinal/i), "experiment", xp("Thomas and Chess: how babies differ from the start", "In the New York Longitudinal Study, what share of infants fitted each temperament?", "%", [
    ["Easy: regular, positive, adapts quickly", 40],
    ["Difficult: irregular, intense, negative", 10],
    ["Slow to warm up: low activity, mild withdrawal", 15],
    ["Did not fit any group", 35],
  ], "Temperament is fairly stable but not fixed; what matters most is the goodness of fit between the child's temperament and the way the family responds.")),
  concept("dev-prenatal", R(["developmental", "biological"], /germinal (stage|period)|embryonic (stage|period)|f[o]?etal (stage|period)|zygote|implantation|organogenesis|teratogen|critical period|age of viability|f[o]?etal alcohol/i, undefined, /lithium|valproate|carbamazepine/i), "timeline", tl("Put the prenatal periods in order", [
    ["Germinal: the zygote divides and implants in the uterus wall", "Weeks 0 to 2"],
    ["Embryonic: all major organs form; most sensitive to teratogens such as alcohol", "Weeks 3 to 8"],
    ["Fetal: growth and maturation; the brain keeps developing", "Week 9 to birth"],
    ["Age of viability: survival outside the womb becomes possible with care", "About 22 to 24 weeks"],
  ], "Each organ has its own critical period; the brain stays vulnerable throughout, which is why alcohol is never safe in pregnancy.")),
  concept("dev-bronfenbrenner", R(["developmental", "counselling", "health", "social"], /bronfenbrenner|ecological (systems|model|theory)|microsystem|mesosystem|exosystem|macrosystem|chronosystem/i), "layers", ly("Bronfenbrenner's ecological systems", "rings", [
    ["The child", "Biology, temperament, age."],
    ["Microsystem", "Direct settings: family, school, friends."],
    ["Mesosystem", "Links between microsystems, such as parents and teachers talking."],
    ["Exosystem", "Settings the child is not in but that affect them: a parent's workplace, local services."],
    ["Macrosystem", "Culture, values, laws, economy."],
    ["Chronosystem", "Change over time, such as a divorce or a migration."],
  ], "Tap from the centre outwards.")),
  concept("dev-vygotsky", R(["developmental", "cognitive", "counselling", "ugc-paper1"], /vygotsky|zone of proximal|\bzpd\b|scaffold|more knowledgeable other|private speech|inner speech/i), "layers", ly("The zone of proximal development", "rings", [
    ["What the learner can do alone", "Already mastered."],
    ["The zone of proximal development", "What the learner can do with guidance from a more skilled person: where teaching works best. Support (scaffolding) is faded as skill grows."],
    ["What the learner cannot do yet", "Even with help, too far ahead for now."],
  ], "For Vygotsky, private speech is thinking out loud on the way to inner speech.")),
  concept("dev-ageing", R(["developmental", "cognitive", "psychometrics-assessment"], /fluid (and|vs|versus) crystalli[sz]ed|crystalli[sz]ed intelligence|fluid intelligence|cattell.horn|seattle longitudinal|schaie|selection,? optimi[sz]ation|\bsoc\b|socioemotional selectivity|terminal decline/i), "compare", cmp("Two kinds of intelligence across adulthood", [
    "Fluid intelligence",
    ["Solving new problems, speed, working memory", "Peaks in the twenties", "Declines steadily from early adulthood", "Linked to processing speed and frontal and hippocampal changes"],
    "Falls with age.",
  ], [
    "Crystallised intelligence",
    ["Knowledge, vocabulary, expertise", "Keeps rising into the sixties", "Holds up until late life", "Draws on what has been learned"],
    "Holds up or grows with age.",
  ], "Longitudinal studies such as Schaie's show smaller declines than cross-sectional ones, because cross-sectional comparisons mix age with generation (cohort effects).")),
  concept("dev-designs", R(["developmental", "research-methods"], /cross.sectional|longitudinal|cohort effect|cohort.sequential|sequential design|time.lag|practice effects?|selective attrition/i), "compare", cmp("Cross-sectional and longitudinal designs", [
    "Cross-sectional",
    ["Different age groups tested once, at the same time", "Fast and cheap", "Age is mixed up with generation (cohort effects)", "Cannot show individual change"],
    "Quick, but confounds age with cohort.",
  ], [
    "Longitudinal",
    ["The same people tested repeatedly over years", "Shows individual change and stability", "Slow, costly; people drop out (attrition), and practice effects build", "Results may belong to one generation"],
    "Shows change, at a cost. Sequential designs combine both.",
  ])),
  concept("dev-grief", R(["developmental", "counselling", "health", "clinical-therapies"], /k[uü]bler.ross|five stages of (grief|dying)|denial.{0,20}anger.{0,20}bargaining/i), "timeline", tl("Put Kubler-Ross's five stages in their usual order", [
    ["Denial"],
    ["Anger"],
    ["Bargaining"],
    ["Depression"],
    ["Acceptance"],
  ], "Kubler-Ross described dying patients; later research shows grief rarely follows a fixed order, and many people are resilient from the start.")),
  concept("dev-worden", R(["counselling", "developmental", "clinical-therapies"], /worden|tasks of (mourning|grief)|continuing bonds|dual process model|stroebe|loss.oriented|restoration.oriented/i), "timeline", tl("Put Worden's tasks of mourning in order", [
    ["Accept the reality of the loss"],
    ["Process the pain of grief"],
    ["Adjust to a world without the person"],
    ["Find an enduring connection with the person while embarking on a new life"],
  ], "Tasks, not stages: the mourner is active. Stroebe and Schut's dual process model adds that healthy grieving moves back and forth between loss-oriented and restoration-oriented coping.")),

  /* ------------------------------------------------ social */
  concept("soc-milgram", R(SOC, /milgram|obedien|450 ?v|shock generator|agentic state|teacher.{0,40}learner/i, undefined, /hofling|nurse/i), "experiment", xp("Milgram: how far would people go?", "An experimenter tells the 'teacher' to give rising shocks to a 'learner' who protests. What share went all the way to 450 volts in each version?", "%", [
    ["Learner in the next room (heard through the wall)", 65],
    ["Learner in the same room", 40],
    ["Teacher had to hold the learner's hand on the plate", 30],
    ["Experimenter gave orders by telephone", 21],
  ], "Psychiatrists had predicted that well under 1% would go to 450 volts. Obedience fell as the victim came closer and as the authority moved away: the situation, not cruel personalities, drove it.")),
  concept("soc-asch", R(SOC, /asch|conformity|line judg|confederates?|majority (influence|pressure)|normative (social )?influence|informational (social )?influence|unanimous|dissenter/i), "experiment", xp("Asch: conforming to a wrong majority", "Which line matches the standard? Confederates all give the same wrong answer before the real participant. Guess each result.", "%", [
    ["Critical trials on which the average participant went along with the wrong answer", 37],
    ["Participants who conformed at least once", 75],
    ["Errors when judging alone, with no group", 1],
  ], "The task was easy (alone, people were almost never wrong), so this is normative influence: going along to fit in. One ally who broke the unanimity cut conformity sharply.")),
  concept("soc-bystander", R(SOC, /bystander|darley|latan[eé]|diffusion of responsibility|kitty genovese|seizure (study|experiment)|intercom|pluralistic ignorance|decision model of helping|arousal.cost.reward/i, undefined, /good samaritan|batson|smoke/i), "experiment", xp("The bystander effect", "A student over an intercom seems to have a seizure. What share of participants went for help before the seizure ended?", "%", [
    ["Thought they were alone with the victim", 85],
    ["Thought one other person could hear", 62],
    ["Thought four others could hear", 31],
  ], "The more bystanders, the less each one feels responsible (diffusion of responsibility), and the slower anyone helps.")),
  concept("soc-smoke", R(SOC, /smoke.filled|smoke (study|room|experiment)|filling with smoke|passive confederates|pluralistic ignorance/i), "experiment", xp("A room filling with smoke", "Smoke pours into the room while participants fill in a questionnaire. What share reported it within six minutes?", "%", [
    ["Alone", 75],
    ["With two calm confederates who ignored it", 10],
  ], "Each person looked at the others, saw calm faces and decided nothing was wrong: pluralistic ignorance. Groups of three real participants also reported far less often (about 38%).")),
  concept("soc-samaritan", R(SOC, /good samaritan|batson|seminary|hurry/i), "experiment", xp("The Good Samaritan study", "Seminary students on their way to give a talk passed a man slumped in a doorway. What share stopped to help?", "%", [
    ["Not in a hurry", 63],
    ["Moderately hurried", 45],
    ["In a great hurry", 10],
  ], "Being in a hurry mattered far more than personality or whether the talk was about the Good Samaritan parable itself.")),
  concept("soc-hofling", R(SOC, /hofling|nurses?.{0,60}(obey|order|telephone|astroten|doctor)/i), "experiment", xp("Hofling's hospital study", "An unknown 'doctor' telephoned nurses and ordered twice the maximum dose of an unfamiliar drug. What share began to give it before being stopped?", "%", [
    ["Nurses who actually started to give it", 95],
  ], "21 of 22 nurses obeyed, breaking several hospital rules, while nurses asked what they would do mostly said they would refuse. When nurses knew the drug and could consult colleagues, obedience fell sharply.")),
  concept("soc-dissonance", R(["social", "personality-theories", "health", "learning-motivation-emotion", "organisational"], /dissonance|festinger|carlsmith|\$1|\$20|one dollar|twenty dollars|insufficient justification|effort justification|post.decision(al)?|spreading of alternatives|induced compliance|self.perception theory/i), "dissonance", { caption: "Watch the tension rise when the behaviour clashes with the belief, then pick a way to reduce it. In Festinger and Carlsmith's study, people paid $1 to tell others a boring task was fun later rated it as more enjoyable than those paid $20: with too little outside justification, they changed the belief." }),
  concept("soc-sherif", R(["social", "organisational", "ugc-paper1"], /robbers cave|sherif|superordinate goals?|realistic (group )?conflict|intergroup conflict|contact hypothesis|jigsaw classroom/i), "timeline", tl("Put the Robbers Cave study in order", [
    ["Two groups of boys arrive separately and each builds its own identity (Eagles and Rattlers)", "Week 1"],
    ["Competition for prizes: name-calling, raids, flag burning", "Friction phase"],
    ["Mere contact (meals, films together) does not reduce hostility", "Integration, first try"],
    ["Superordinate goals that need both groups (fixing the water supply, pulling a truck) bring them together", "Integration"],
  ], "Competition for scarce rewards created prejudice; working toward shared goals reduced it.")),
  concept("soc-tuckman", R(["social", "organisational", "counselling", "clinical-therapies"], /tuckman|forming|storming|norming|performing|adjourning|stages of group development/i), "timeline", tl("Put Tuckman's stages of group development in order", [
    ["Forming: polite, unsure, dependent on the leader"],
    ["Storming: conflict over roles and power"],
    ["Norming: rules and cohesion develop"],
    ["Performing: the group gets the work done"],
    ["Adjourning: the group ends (added in 1977)"],
  ])),
  concept("soc-zimbardo", R(["social", "research-methods", "ethics-law"], /zimbardo|stanford prison|deindividuat|guards and prisoners|bbc prison/i), "timeline", tl("Put the Stanford prison study in order", [
    ["Student volunteers screened as healthy and randomly made guards or prisoners", "Day 0"],
    ["Prisoners arrested at home, numbered and dressed in smocks", "Day 1"],
    ["Prisoner rebellion; guards respond with humiliation and control", "Day 2"],
    ["Several prisoners show acute distress and are released", "Days 2 to 5"],
    ["Stopped after 6 of the planned 14 days, after an outside visitor objected", "Day 6"],
  ], "Zimbardo argued roles and deindividuation drove the guards; later critics showed guards were coached and demand characteristics were strong, and the BBC prison study found groups could resist.")),

  /* ------------------------------------------------ personality */
  concept("per-iceberg", R(PERS, /topograph|preconscious|unconscious mind|levels of (consciousness|awareness)|iceberg/i), "layers", ly("Freud's iceberg", "iceberg", [
    ["Conscious", "What you are aware of right now."],
    ["Preconscious", "Not in awareness but easy to recall, such as a phone number."],
    ["Unconscious", "Wishes, memories and conflicts kept out of awareness, which still shape dreams, slips and symptoms."],
  ], "The structural model (id, ego, superego) was added later and cuts across these levels: the ego and superego are partly unconscious too.")),
  concept("per-eysenck", R(["personality-theories", "biological", "psychometrics-assessment"], /eysenck|extraver|introver|neuroticism|psychoticism|ascending reticular|cortical arousal|\bepq\b|lemon juice/i), "brainmap", bm("Eysenck's personality in the brain", {
    brainstem: "Ascending reticular activating system: Eysenck proposed introverts have higher resting cortical arousal, so they avoid extra stimulation; extraverts are under-aroused and seek it (introverts even salivate more to lemon juice).",
    hypothalamus: "Limbic system (visceral brain) and hypothalamus: people high in neuroticism react more strongly and for longer to stress.",
    amygdala: "Amygdala: later imaging links high neuroticism with a more reactive amygdala.",
  }, "Extraversion and neuroticism are strongly supported; the arousal account has mixed evidence.")),
  concept("per-gray", R(["personality-theories", "biological", "learning-motivation-emotion"], /reinforcement sensitivity|behavioural (inhibition|approach|activation) system|\bbis\b|\bbas\b|gray'?s|fight.flight.freeze|cloninger|novelty seeking|harm avoidance|reward dependence/i), "brainmap", bm("Approach and avoidance systems", {
    "basal-ganglia": "Behavioural approach system (BAS): dopamine reward circuits through the basal ganglia drive approach to reward; high BAS fits impulsivity and positive emotion. Cloninger linked novelty seeking to dopamine.",
    hippocampus: "Behavioural inhibition system (BIS): the septo-hippocampal system detects conflict between goals and stops behaviour to check; high BIS fits anxiety. Cloninger linked harm avoidance to serotonin.",
    amygdala: "Fight-flight-freeze system: the amygdala and periaqueductal grey react to clear threat (fear, not anxiety).",
  })),
  concept("per-mahler", R(["personality-theories", "developmental", "clinical-therapies"], /mahler|separation.individuation|rapprochement|symbiotic phase|normal autism|practising (sub)?phase|object constancy/i), "timeline", tl("Put Mahler's phases in order", [
    ["Normal autistic phase (Mahler later dropped this term)", "0 to 1 month"],
    ["Symbiotic phase: infant and mother as one", "1 to 5 months"],
    ["Differentiation", "5 to 9 months"],
    ["Practising: crawling and walking away, returning to refuel", "9 to 15 months"],
    ["Rapprochement: wants independence and closeness at once", "15 to 24 months"],
    ["Object constancy: a stable inner image of the mother", "24 to 36 months"],
  ])),

  /* ------------------------------------------------ history */
  concept("his-schools", R(HIS, /wundt|leipzig|1879|structuralism|titchener|introspection|functionalism|william james|principles of psychology|behaviourist manifesto|watson.{0,20}1913|schools of psychology|third force|first (psychology )?laboratory/i), "timeline", tl("Put these landmarks of psychology in order", [
    ["Wundt opens the first psychology laboratory in Leipzig", "1879"],
    ["William James publishes The Principles of Psychology (functionalism)", "1890"],
    ["Freud publishes The Interpretation of Dreams", "1900"],
    ["Wertheimer's phi experiments start Gestalt psychology", "1912"],
    ["Watson's behaviourist manifesto", "1913"],
    ["Skinner's operant work: The Behavior of Organisms", "1938"],
    ["Neisser's Cognitive Psychology names the new field", "1967"],
  ], "Structuralism (Titchener) broke the mind into elements by introspection; functionalism asked what the mind is for; behaviourism dropped the mind; Gestalt studied wholes; cognitive psychology brought the mind back.")),
  concept("his-cognitive", R(HIS, /cognitive revolution|1956|miller'?s (magical|paper)|chomsky'?s review|verbal behavior|dartmouth|information processing (approach|metaphor)|tolman|cognitive map|latent learning/i), "timeline", tl("Put the steps of the cognitive revolution in order", [
    ["Tolman's rats show cognitive maps and latent learning", "1930 to 1948"],
    ["Miller's 'magical number seven' and the 1956 MIT symposium", "1956"],
    ["Chomsky's review of Skinner's Verbal Behavior", "1959"],
    ["Neisser's Cognitive Psychology", "1967"],
  ])),
  concept("his-ebbinghaus", R(["history-systems"], /ebbinghaus|fechner|weber|psychophysics|jnd|just noticeable|galton|binet|cattell|helmholtz/i), "timeline", tl("Put the early measurers of the mind in order", [
    ["Weber measures the just noticeable difference", "1830s"],
    ["Fechner's Elements of Psychophysics", "1860"],
    ["Galton's anthropometric laboratory", "1884"],
    ["Ebbinghaus publishes On Memory (nonsense syllables, forgetting curve)", "1885"],
    ["Binet and Simon's intelligence scale", "1905"],
  ])),
];
