import type { LongQA } from "@/lib/prep/long-types";
import { anchored, chain, compare, cycle, timeline, tree, vis } from "./visual";

const S = "developmental" as const;

export const DEVELOPMENTAL_L05: LongQA[] = anchored([
  {
    id: "dev-l05-041",
    subject: S,
    topic: "research-designs",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg"],
    question: "Compare cross sectional, longitudinal and sequential designs in developmental research. Explain how each handles age, cohort and time of measurement effects.",
    plan: ["The problem: separating age from things that come with age", "Cross sectional design", "Longitudinal design", "Sequential and time lag designs", "Which to choose, with Indian examples"],
    answer: `## The problem
Developmental research wants to know what changes with age. But age is always tangled with two other influences. A cohort effect is the influence of being born at a particular time and sharing its history: Indians born in 1950 had far less schooling on average than those born in 2000. A time of measurement effect is the influence of the moment of testing, such as a pandemic year or a new technology that affects everyone tested then.

## Cross sectional design
Different age groups are tested at one time, for example 20, 40, 60 and 80 year olds tested this year.
- Strengths: quick, cheap, no drop out, and a good first look at age differences.
- Weaknesses: age is confounded with cohort, so differences may reflect generation rather than ageing; it shows group differences, not how individuals change; it cannot show stability or early predictors.
- Classic error: early cross sectional studies of intelligence showed steep decline from early adulthood, largely because older cohorts had less education.

## Longitudinal design
The same people are followed and tested repeatedly over years.
- Strengths: shows individual change and stability, the order of developments and whether early factors predict later outcomes.
- Weaknesses: slow and expensive; attrition, in which drop outs are often less healthy or less educated, so the remaining sample looks better than it is; practice effects from repeated testing; age is confounded with time of measurement; and findings may apply only to the cohort studied.

## Sequential and time lag designs
- Cohort sequential design: several cohorts are each followed longitudinally, combining the two basic designs. It can separate age, cohort and time effects. K. Warner Schaie's Seattle Longitudinal Study, begun in 1956 with new cohorts added every seven years, showed that intellectual decline starts later and is smaller than cross sectional studies had suggested, and that later born cohorts score higher at the same age.
- Time lag design: people of the same age are compared at different times, for example 15 year olds in 1990 and 2020, which isolates cohort and time effects but not age.
- Weaknesses: complex, costly and still subject to attrition.

## Summary table
| Design | Age confounded with | Best for |
| Cross sectional | Cohort | Quick age differences |
| Longitudinal | Time of measurement | Individual change and prediction |
| Sequential | Separates all three | Disentangling age, cohort and time |

## Choosing a design: Indian examples
The Young Lives study has followed about 3,000 children in Andhra Pradesh and Telangana since 2002 in two cohorts, a sequential approach that shows how poverty, schooling and nutrition shape development. The Longitudinal Ageing Study in India follows adults aged 45 and above. For a short MA project, a cross sectional design is realistic, but the conclusion must speak of age differences, not age changes.

## Conclusion
Each design trades cost against clarity. Sequential designs are the most informative because they can separate true ageing from the history a generation shares.`,
    keyPoints: ["Age, cohort and time of measurement effects defined", "Cross sectional design with strengths and cohort confound", "Longitudinal design with attrition and practice effects", "Cohort sequential design with Schaie's findings", "Time lag design", "Clear comparison table", "Indian longitudinal examples"],
    pitfalls: ["Saying cross sectional studies show change in individuals", "Forgetting attrition bias", "Not naming the effect each design confounds"],
    module: "lifespan/1-3",
    visuals: [
      vis("worked", {
        title: "Which design?",
        steps: [
          { q: "You want to know, this term, whether memory differs between 20 and 70 year olds.", a: "Cross sectional: quick, but the difference may partly be cohort." },
          { q: "You want to know whether shy toddlers become anxious teenagers.", a: "Longitudinal: only following the same children shows individual stability." },
          { q: "You want to know whether today's 70 year olds remember better than 70 year olds did 30 years ago.", a: "Time lag: same age, different times." },
        ],
      }, "Choosing a design: Indian examples"),
    ],
    ref: "Schaie 1965 general developmental model and Seattle Longitudinal Study; Baltes 1968 sequential designs; Young Lives India; LASI; lifespan module 1.3",
  },
  {
    id: "dev-l05-042",
    subject: S,
    topic: "lifespan",
    marks: 5,
    difficulty: 1,
    exams: ["cuet-pg", "ma-semester", "ugc-net"],
    question: "Write a short note on the principles of development.",
    plan: ["Define development", "Directional principles", "Sequence, rate and individual differences", "Interaction, plasticity and lifelong change"],
    answer: `## Meaning
Development is the pattern of orderly, relatively lasting change that begins at conception and continues through life, involving growth as well as decline. Although each child is unique, development follows some broad principles.

## Principles
- Cephalocaudal: growth and control proceed from head to tail. A baby controls the head before the trunk and the trunk before the legs.
- Proximodistal: growth proceeds from the centre of the body outwards. Control of the shoulders and arms comes before the fingers.
- General to specific: early responses are global and become refined. A newborn startles with the whole body; an older child reaches precisely with one hand.
- Differentiation and integration: skills become separated into finer parts and then combined into coordinated wholes, as when separate finger movements combine into writing.
- Predictable sequence: milestones follow a common order, such as sitting before standing and babbling before words, even though ages vary.
- Individual differences in rate: children differ in how fast they move through the sequence because of heredity, nutrition, health and stimulation.
- Continuous and cumulative: each step builds on earlier ones, so early deprivation can have lasting effects.
- Interrelated domains: physical, cognitive, emotional and social development influence one another; a child who starts walking explores more and learns more.
- Interaction of heredity and environment: maturation sets the timetable, and experience shapes how it unfolds.
- Plasticity and lifelong change: development is modifiable, multidirectional and continues into old age, as Paul Baltes's lifespan perspective emphasises.

## Importance
These principles help parents, teachers and clinicians set realistic expectations, identify delays through screening tools such as the Trivandrum Developmental Screening Chart, and plan stimulation that fits the child's stage.`,
    keyPoints: ["Definition of development", "Cephalocaudal and proximodistal with examples", "General to specific and differentiation and integration", "Predictable sequence with individual differences in rate", "Interaction of heredity and environment", "Plasticity and lifelong change"],
    pitfalls: ["Mixing up cephalocaudal and proximodistal", "Listing principles without examples"],
    module: "lifespan/1-1",
    visuals: [
      compare(
        "Principles: two directions of growth",
        ["Cephalocaudal", ["Head to tail", "Head control first", "Then trunk and sitting", "Legs and walking last"], "Top down"],
        ["Proximodistal", ["Centre outwards", "Shoulders and arms first", "Then wrists and hands", "Fingers and pincer grasp last"], "Inside out"],
      ),
    ],
    ref: "Hurlock Developmental Psychology principles; Santrock Life-Span Development ch 1 and 4; Baltes 1987; TDSC Nair et al 1991",
  },
  {
    id: "dev-l05-043",
    subject: S,
    topic: "lifespan",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg", "mcp-entrance", "md-psychiatry"],
    question: "Describe the newborn reflexes and the sequence of motor development in infancy. How do maturational and dynamic systems theories explain motor development?",
    plan: ["Reflexes with ages of disappearance and clinical value", "Gross motor milestones", "Fine motor milestones", "Maturational theory", "Dynamic systems theory and cultural evidence"],
    answer: `## Newborn reflexes
Reflexes are automatic, inborn responses to stimulation. Some help survival; others are signs of the nervous system's integrity.
| Reflex | What happens | Usually disappears |
| Rooting | Turns head towards a touch on the cheek | About 3 to 4 months |
| Sucking | Sucks an object placed in the mouth | Becomes voluntary |
| Moro | Throws arms out then in after a sudden loss of support or noise | About 4 to 6 months |
| Palmar grasp | Grasps a finger placed in the palm | About 3 to 4 months |
| Stepping | Makes stepping movements when held upright | About 2 months |
| Babinski | Toes fan out when the sole is stroked | About 8 to 12 months |
| Tonic neck | Fencing posture when the head is turned | About 4 months |
Clinically, a reflex that is absent, asymmetrical or persists too long can signal neurological problems, such as cerebral palsy.

## Gross motor milestones
Typical ages, with wide normal variation: holds head steady at 2 to 3 months, rolls over at 4 to 6 months, sits without support at about 6 months, crawls at 8 to 10 months, pulls to stand at 9 to 10 months, and walks alone at about 12 to 15 months. Development follows the cephalocaudal principle.

## Fine motor milestones
Reaching begins at about 3 to 4 months, a whole hand palmar grasp follows, objects are passed from hand to hand by about 6 months, and the pincer grasp between thumb and forefinger appears at about 9 to 12 months, following the proximodistal principle. Scribbling appears in the second year.

## Maturational theory
Arnold Gesell, filming hundreds of infants, argued that motor development unfolds according to a genetic timetable as the nervous system matures, with little influence of practice. Support came from twin studies in which a trained twin quickly lost the advantage once the untrained twin was old enough.

## Dynamic systems theory
Esther Thelen argued that motor skills are not simply wired in but are assembled by the infant from many parts: brain maturation, body strength and proportions, motivation and the environment. Her key study showed that the stepping reflex, which seems to vanish at about 2 months, reappears when the baby's legs are held in water: the reflex had not disappeared, the legs had become too heavy to lift. Each new skill is a solution the baby discovers in pursuit of a goal, such as reaching a toy.
Cultural evidence fits this view. Among the Kipsigis of Kenya, parents practise sitting and walking with their infants, who sit and walk earlier than many Western infants; daily oil massage and handling of babies are common in Indian families too. Infants who sleep on their backs, as advised to prevent sudden infant death, crawl slightly later but walk on time.

## Conclusion
Reflexes and milestones follow a predictable order useful for screening, for example with the Trivandrum Developmental Screening Chart in India, but motor skills emerge from the interaction of maturation, body and experience, as dynamic systems theory shows.`,
    keyPoints: ["At least five reflexes with ages of disappearance", "Clinical significance of reflexes", "Gross motor milestones in order with ages", "Fine motor milestones including pincer grasp", "Gesell's maturational view", "Thelen's dynamic systems view with the water study", "Cultural evidence"],
    pitfalls: ["Giving milestone ages as exact deadlines", "Leaving out theory, which carries half the marks"],
    module: "lifespan/1-5",
    visuals: [
      { ...timeline("Put the gross motor milestones in order.", [["Holds head steady", "2 to 3 months"], ["Rolls over", "4 to 6 months"], ["Sits without support", "About 6 months"], ["Crawls", "8 to 10 months"], ["Walks alone", "12 to 15 months"]], "Head before trunk before legs: the cephalocaudal principle."), caption: "Gross motor milestones" },
    ],
    ref: "Gesell 1946; Thelen and Fisher 1982 stepping in water; Super 1976 Kipsigis; Davis et al 1998 back to sleep; lifespan module 1.5; TDSC",
  },
  {
    id: "dev-l05-044",
    subject: S,
    topic: "parenting",
    marks: 20,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Critically discuss Baumrind's typology of parenting styles and its later developments. How well does the typology apply across cultures, including in India?",
    plan: ["Baumrind's research and dimensions", "Four styles and their outcomes", "Mechanisms, discipline and child effects", "Cultural critique: Chao and Indian research", "Applications and Indian law", "Conclusion"],
    answer: `## Baumrind's research
Diana Baumrind observed preschool children in Berkeley, California, and their parents at home and in the laboratory in the 1960s. She found that children's competence was related to consistent patterns of parenting, which she called parenting styles. Eleanor Maccoby and John Martin later reorganised the styles along two dimensions:
- Demandingness: control, supervision, expectations for mature behaviour.
- Responsiveness: warmth, acceptance and attention to the child's needs.

## The four styles
- Authoritative: high demands and high responsiveness. Parents set clear rules, explain reasons, listen to the child's view and encourage independence. Children tend to be self reliant, cheerful, cooperative, achievement oriented and socially competent.
- Authoritarian: high demands and low responsiveness. Obedience is valued ("because I said so"), reasons are rarely given, and punishment may be harsh. Children tend to be anxious, withdrawn and less spontaneous; boys may show more anger and defiance.
- Permissive or indulgent: low demands and high responsiveness. Parents are warm but set few limits. Children tend to be impulsive, poorly self controlled and less persistent, though often socially confident.
- Neglectful or uninvolved: low demands and low responsiveness, added by Maccoby and Martin. Parents are emotionally detached and minimally involved. Children show the poorest outcomes: low self esteem, poor school performance, delinquency and substance use.
Large studies of American adolescents by Laurence Steinberg and colleagues confirmed that authoritative homes predicted the best adjustment and neglectful homes the worst.

## Why styles matter: mechanisms
- Nancy Darling and Steinberg distinguished parenting style, the emotional climate, from parenting practices, specific behaviours such as checking homework; style changes how practices are received.
- Martin Hoffman showed that induction, explaining how the child's behaviour affects others, builds empathy and internalised morality better than power assertion or love withdrawal.
- Gerald Patterson's coercive cycle shows how harsh, inconsistent discipline and a child's defiance escalate each other, leading to conduct problems.
- Child effects: Richard Bell pointed out that influence runs both ways. An easy child elicits warmth; a difficult child may elicit control. Twin and adoption studies show that some of the link between parenting and outcomes is genetic.

## Cultural critique
- Ruth Chao argued that Chinese parenting, often classified as authoritarian, reflects training, the concept of guan, which combines strict control with deep involvement and care. In such cultures, control is not perceived as rejection and does not have the same negative effects.
- Among African American families in risky neighbourhoods, firm control can be protective.
- The meaning of control matters: control experienced as care predicts good outcomes, while control experienced as hostility predicts poor ones.

## Parenting in India
- Many Indian parents score high on both control and warmth, a pattern that does not fit neatly into one cell. Strict expectations about studies, food, friendships and marriage often sit alongside close affection and sacrifice.
- Research in India suggests that strictness is harmful mainly when it comes with harshness, comparison with other children or low warmth, and that warmth is consistently protective.
- Interdependence is valued: obedience and respect for elders are often seen as signs of good development, not of suppressed autonomy. Rapid urbanisation, nuclear families and digital media are moving many middle class families towards more explanation and negotiation.
- Joint families mean that grandparents and others share parenting, so a style belongs to a household, not just to two parents.
- Harsh discipline remains common. The Right of Children to Free and Compulsory Education Act of 2009, section 17, bans physical punishment and mental harassment in schools.

## Applications
Parent training programmes such as Triple P and the Incredible Years teach warm, consistent, authoritative practices and reduce conduct problems; versions have been tested in low and middle income countries. Counsellors working with Indian families do better by building on existing warmth and involvement than by labelling parents authoritarian.

## Evaluation
Strengths: a simple, testable framework with consistent findings across many Western samples and a clear message that warmth plus structure works. Limitations: much research is correlational and cross sectional; child effects and genes are underplayed; the four cells hide the different meanings of control across cultures; and fathers and extended families were understudied.

## Conclusion
Baumrind's typology shows that children thrive on a combination of warmth and reasonable demands. Across cultures, warmth is the most universal ingredient, while the effect of control depends on what it means to the family. In India, high control with high warmth is common and often adaptive.`,
    keyPoints: ["Baumrind's research and the two dimensions", "Four styles with Maccoby and Martin's addition", "Outcomes of each style", "Style versus practices, induction and the coercive cycle", "Child effects and genetic confounds", "Chao's concept of training and the meaning of control", "Indian parenting with high control and high warmth", "RTE Act ban on physical punishment and parent training"],
    pitfalls: ["Calling Indian or Asian parents simply authoritarian", "Ignoring child effects", "Describing styles without outcomes"],
    module: "lifespan/2-6",
    visuals: [
      vis("sort", {
        prompt: "Which parenting style is this?",
        buckets: ["Authoritative", "Authoritarian", "Permissive", "Neglectful"],
        items: [
          { text: "Phone time has limits, and Papa explains why and listens when Riya disagrees", bucket: 0 },
          { text: "Do as you are told; no questions in this house", bucket: 1 },
          { text: "Whatever you want, beta; there are no bedtimes here", bucket: 2 },
          { text: "Parents rarely know where their son is or what he is studying", bucket: 3 },
        ],
      }, "The four styles: sort the parents"),
      cycle("Mechanisms: the coercive cycle", [["Parent gives a command", "Harsh or inconsistent"], ["Child refuses and escalates", "Whining, shouting"], ["Parent gives in", "The child's escalation is rewarded"], ["Next time", "Both escalate sooner"]], "Why styles matter: mechanisms such as Patterson's coercive cycle"),
    ],
    ref: "Baumrind 1966, 1967, 1971; Maccoby and Martin 1983; Lamborn, Mounts, Steinberg and Dornbusch 1991; Darling and Steinberg 1993; Hoffman 1970; Patterson 1982; Bell 1968; Chao 1994; RTE Act 2009 s17; lifespan module 2.6",
  },
  {
    id: "dev-l05-045",
    subject: S,
    topic: "gender-development",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "cuet-pg"],
    question: "Explain the development of gender identity in children. Critically compare biological, social learning, cognitive developmental and gender schema theories of gender development.",
    plan: ["Sex, gender and milestones of gender understanding", "Biological influences", "Social learning theory", "Kohlberg's cognitive developmental theory", "Gender schema theory and social role theory", "Indian context and conclusion"],
    answer: `## Terms and milestones
Sex refers to biological characteristics; gender refers to the roles, behaviours and identities a society associates with being female, male or other genders. Gender identity is a person's inner sense of their gender. Children's understanding grows in steps:
- About 2 to 3 years: gender identity or labelling, correctly calling oneself and others a girl or a boy.
- About 4 years: gender stability, understanding that gender stays the same over time.
- About 5 to 7 years: gender constancy or consistency, understanding that gender does not change with clothes, hairstyle or activities.
Gender typed toy preferences appear by about 2, and gender segregation in play, preferring same gender playmates, is strong from about 3 to 11.

## Biological influences
Prenatal androgens organise the brain. Girls with congenital adrenal hyperplasia, exposed to high androgen levels before birth, show more interest in toys typically preferred by boys, even when parents encourage typical girls' toys. Evolutionary accounts link some differences to ancestral roles. Biology is not the whole story: differences within each gender are much larger than average differences between genders, and most behavioural differences are small.

## Social learning theory
Albert Bandura and Kay Bussey argued that children learn gender through:
- Differential reinforcement: parents, teachers and peers reward gender typical behaviour and discourage atypical behaviour, especially in boys.
- Observational learning: children imitate same gender models in the family and media.
- Later, self regulation: children praise or criticise themselves against gender standards.
Strengths: it explains cultural variation and change over time. Weaknesses: children often show stronger stereotypes than their parents teach, and they are not passive recipients.

## Cognitive developmental theory
Lawrence Kohlberg proposed that children actively socialise themselves once they understand gender. After reaching gender constancy, a child thinks "I am a girl, so I want to do girl things" and then seeks out same gender models. Thus cognition comes first and imitation follows.
Weakness: gender typed preferences appear well before constancy, at 2 to 3 years, so full constancy cannot be required.

## Gender schema theory
Carol Martin and Charles Halverson, and separately Sandra Bem, proposed that children need only basic gender identity, not constancy, to start forming gender schemas: organised beliefs about what is for girls and what is for boys. Schemas direct attention and memory; children remember information that fits their schemas and distort information that does not, such as recalling a picture of a girl sawing wood as a boy sawing wood. A child first divides things into for my gender and not for my gender and explores mainly the first. Bem added that cultures differ in how much they make gender a central schema, and that androgynous people, high on both masculine and feminine traits, use gender schemas less.
Strength: explains early, rigid stereotyping and memory distortion. Weakness: knowing stereotypes does not always predict behaviour.

## Social role theory
Alice Eagly argued that gender differences come from the different social roles men and women occupy, such as caregiver and breadwinner, which create expectations and skills; as roles change, differences shrink.

## Comparison
| Theory | Main cause | Role of child |
| Biological | Hormones and genes | Passive |
| Social learning | Reinforcement and models | Learner |
| Cognitive developmental | Gender constancy | Active, after constancy |
| Gender schema | Schemas built on basic identity | Active, from about 2 |

## Indian context
Son preference shapes gender socialisation from birth, seen in the skewed sex ratio at birth, which the Pre Conception and Pre Natal Diagnostic Techniques Act of 1994 tries to prevent. Girls are often given more household duties and fewer freedoms in adolescence. The Supreme Court's NALSA judgement of 2014 recognised transgender people as a third gender, and the Transgender Persons (Protection of Rights) Act of 2019 followed, which reminds clinicians that gender identity does not always match sex assigned at birth.

## Conclusion
The theories are complementary: biology sets predispositions, social learning supplies content, and children actively construct gender through schemas and identity. Gender schema theory best explains how early and how strongly children stereotype.`,
    keyPoints: ["Sex and gender distinguished", "Identity, stability and constancy with ages", "CAH evidence and limits of biology", "Social learning mechanisms", "Kohlberg's constancy first claim and its problem", "Gender schema theory with memory distortion evidence", "Comparison and Indian context such as son preference and the 2019 Act"],
    pitfalls: ["Saying children need gender constancy before showing gender typed behaviour", "Treating biological differences as large and fixed", "No comparison across theories"],
    module: "lifespan/2-6",
    visuals: [
      { ...timeline("Put the steps in children's gender understanding in order.", [["Gender identity: labels self as girl or boy", "2 to 3 years"], ["Gender stability: gender stays the same over time", "About 4 years"], ["Gender constancy: unchanged by clothes or activities", "5 to 7 years"]], "Gender typed preferences appear before constancy, which supports gender schema theory."), caption: "Terms and milestones" },
      compare(
        "Cognitive developmental theory versus gender schema theory",
        ["Kohlberg", ["Needs gender constancy", "About 5 to 7 years", "Then seeks same gender models", "Struggles to explain early preferences"], "Constancy comes first"],
        ["Gender schema", ["Needs only basic identity", "About 2 to 3 years", "Schemas guide attention and memory", "Explains early stereotyping"], "Labelling is enough"],
      ),
    ],
    ref: "Kohlberg 1966; Slaby and Frey 1975; Berenbaum and Hines 1992 CAH; Bussey and Bandura 1999; Martin and Halverson 1981; Bem 1981; Eagly 1987 social role theory; PCPNDT Act 1994; NALSA v Union of India 2014; Transgender Persons Act 2019",
  },
  {
    id: "dev-l05-046",
    subject: S,
    topic: "emotional-development",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg", "ugc-net"],
    question: "Describe the course of emotional development in infancy and early childhood, including social referencing, self conscious emotions and emotion regulation.",
    plan: ["Primary emotions and the social smile", "Stranger and separation anxiety", "Social referencing with the visual cliff study", "Self recognition and self conscious emotions", "Emotion understanding and regulation with role of parents"],
    answer: `## Primary emotions
Basic or primary emotions, such as interest, distress, disgust, joy, anger, sadness, surprise and fear, appear in the first months. A newborn shows distress, interest and disgust; the social smile, a smile directed at faces, appears at about 6 to 8 weeks and laughter at about 3 to 4 months. Anger becomes clear at about 4 to 6 months, when infants can recognise a blocked goal, and fear by about 6 to 8 months.

## Stranger and separation anxiety
Stranger anxiety, wariness of unfamiliar adults, appears at about 8 to 9 months, when infants can compare faces with familiar ones. Separation anxiety, distress when the attachment figure leaves, peaks at about 12 to 18 months. Both are normal signs of attachment and memory, and they are milder when the stranger approaches slowly and the caregiver is close.

## Social referencing
From about 9 to 12 months, infants look at a caregiver's face to decide how to react to an uncertain situation.

## The visual cliff study
James Sorce and colleagues placed one year olds on a visual cliff set to a moderate, uncertain drop, with the mother on the far side. When she showed a happy face, about three quarters of the babies crossed; when she showed a fearful face, none crossed. Social referencing shows that infants read emotions and use them to guide behaviour, and it is one way parental anxiety passes to children.

## Self recognition and self conscious emotions
In the rouge test, a dab of red is put on a baby's nose; babies who touch their own nose rather than the mirror recognise themselves, mostly between 18 and 24 months. After this, self conscious emotions appear: embarrassment, then pride, shame and guilt in the third year, as children learn standards and evaluate themselves against them.

## Emotion understanding
By 3 to 4 years, children name emotions and link them to causes; by 4 to 5 they understand that beliefs and desires produce emotions; and in middle childhood they understand mixed emotions and display rules, the cultural rules about which feelings to show. Indian children learn early, for example, to hide disappointment in front of elders or guests.

## Emotion regulation
Infants depend on co regulation: caregivers soothe them by holding, feeding and rocking. Toddlers begin to self regulate by looking away, sucking a thumb or seeking comfort objects. Preschoolers use language and distraction, and school age children use reappraisal. Parents who practise emotion coaching, noticing a child's feelings, naming them and helping solve the problem, have children with better regulation and peer relations. Temperament and attachment security also shape regulation.

## Conclusion
Emotional development moves from basic, caregiver regulated feelings to self conscious, culturally shaped and self regulated emotions. Delays in social referencing or joint attention can be early signs examined in autism screening.`,
    keyPoints: ["Primary emotions with ages and the social smile", "Stranger anxiety and separation anxiety ages", "Social referencing with the visual cliff result", "Rouge test and self recognition", "Self conscious emotions after self recognition", "Emotion understanding and display rules", "Co regulation to self regulation and emotion coaching"],
    pitfalls: ["Giving emotions with no ages", "Describing the visual cliff only as depth perception and missing social referencing"],
    module: "lifespan/2-6",
    visuals: [
      { kind: "figure", data: { id: "visual-cliff", caption: "The visual cliff used by Sorce to study social referencing" }, caption: "Social referencing" },
      vis("experiment", { title: "Social referencing on the visual cliff", question: "What share of one year olds crossed a moderate drop when the mother on the far side looked happy or fearful?", unit: "%", conditions: [{ label: "Mother looks happy", value: 74 }, { label: "Mother looks fearful", value: 0 }], why: "Infants used the mother's face to decide whether the uncertain drop was safe." }, "The visual cliff study: the result"),
    ],
    ref: "Sorce, Emde, Campos and Klinnert 1985 (14 of 19 crossed to joy, 0 of 17 to fear); Lewis and Brooks-Gunn 1979 rouge test; Lewis self conscious emotions; Gottman 1997 emotion coaching; lifespan module 2.6",
  },
  {
    id: "dev-l05-047",
    subject: S,
    topic: "play",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg"],
    question: "Write a short note on the development of play in children.",
    plan: ["Why play matters", "Parten's social stages", "Cognitive types of play", "Theorists' views and Indian relevance"],
    answer: `## Why play matters
Play is voluntary, enjoyable activity done for its own sake. It builds motor skills, language, problem solving, emotion regulation and social skills, and the National Education Policy 2020 makes play based learning central to the foundational stage, ages 3 to 8.

## Parten's social stages
Mildred Parten, observing preschool children in 1932, described six forms of social participation:
| Type | What it looks like |
| Unoccupied | Watching anything interesting, not playing |
| Solitary | Playing alone with own toys |
| Onlooker | Watching others play and perhaps talking, without joining |
| Parallel | Playing beside others with similar toys but not together |
| Associative | Playing together and sharing, without common goals or roles |
| Cooperative | Organised play with shared goals and roles, such as a game of ghar ghar or cricket with teams |
Older preschoolers show more associative and cooperative play, but solitary and parallel play remain normal and are not signs of immaturity.

## Cognitive types of play
Sara Smilansky, building on Piaget, described functional play (repeated movements, such as running), constructive play (building with blocks), dramatic or pretend play (from about 2, peaking at 4 to 5) and games with rules (from about 6 or 7).

## Theorists
Piaget saw play as assimilation, practising existing schemas. Vygotsky saw pretend play as a zone of proximal development in which children follow rules and act "a head taller" than themselves. Play therapy uses play as a child's natural language for expressing feelings.`,
    keyPoints: ["Definition and functions of play", "All six of Parten's categories", "Trend with age and caution about solitary play", "Smilansky's cognitive types", "Piaget and Vygotsky on play", "Indian relevance such as NEP 2020"],
    pitfalls: ["Confusing parallel with associative play", "Saying solitary play is abnormal"],
    module: "lifespan/2-6",
    visuals: [
      chain("Parten's social stages", [["Solitary", "Alone with own toys"], ["Onlooker", "Watches others"], ["Parallel", "Side by side"], ["Associative", "Together, no shared goal"], ["Cooperative", "Shared goal and roles"]], "Parten's social stages of play"),
    ],
    ref: "Parten 1932; Smilansky 1968; Vygotsky 1967 play; NEP 2020 foundational stage; lifespan module 2.6",
  },
  {
    id: "dev-l05-048",
    subject: S,
    topic: "kohlberg",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "cuet-pg", "mcp-entrance"],
    question: "Describe Piaget's theory of moral development and evaluate it. Briefly discuss other approaches to children's morality, including Turiel's domain theory, Eisenberg's prosocial reasoning and Hoffman's account of empathy.",
    plan: ["Piaget's methods: marbles and paired stories", "Premoral, heteronomous and autonomous morality", "Role of peers and evaluation", "Turiel's domain theory", "Eisenberg and Hoffman", "Conclusion and link to Kohlberg"],
    answer: `## Piaget's methods
Jean Piaget studied morality in two ways, described in his 1932 work on the moral judgement of the child. He played marbles with Swiss children, asking about the rules and where they came from. He also told pairs of stories that differed in intention and consequence: John, called to dinner, opens a door and accidentally breaks 15 cups; Henry, trying to reach jam while his mother is out, breaks one cup. Children were asked who was naughtier.

## Stages of moral development
- Premoral, under about 5: little awareness of rules; play is for pleasure.
- Heteronomous morality or moral realism, about 5 to 10: rules come from authorities such as parents, God or the police and cannot be changed. Children judge by consequences, so John, who broke more cups, is naughtier. They believe in immanent justice, that wrongdoing is automatically punished, as when a child who stole a mango and then fell from a bridge "was punished for stealing". They favour expiatory punishment, severe and unrelated to the act.
- Autonomous morality, from about 10: rules are seen as social agreements that can be changed if everyone agrees. Children judge by intentions, so Henry is naughtier. They prefer reciprocal punishment that fits the offence, such as repairing the damage, and value equality and fairness.

## The role of peers
Piaget argued that the shift happens through cognitive maturation, decline in egocentrism and, especially, cooperation with equals. Among peers, children negotiate rules and take each other's perspective, which adult authority cannot provide.

## Evaluation
- Strengths: the first systematic account of moral reasoning; the move from consequences to intentions is well replicated; it inspired Kohlberg.
- Underestimation: the story method makes the consequence vivid and the intention subtle. When intentions are made clear, children of 3 to 4 judge by intention.
- Morality is more than reasoning: emotions, empathy and behaviour are left out.
- Cultural variation in how strictly rules are seen as fixed.
- Peers are important, but so are parents who reason with children.

## Turiel's domain theory
Elliot Turiel showed that by about 3 to 4 years children distinguish moral rules, about harm, fairness and rights, from social conventions, arbitrary rules of a group such as wearing a uniform or calling a teacher "ma'am", and from personal matters such as choice of friends. Children say hitting would be wrong even if the teacher allowed it, but not wearing a uniform would be fine if the school permitted it. This contradicts Piaget's claim that young children treat all rules as equally fixed. Richard Shweder argued that in India many conventions, such as eating with the right hand, are treated as moral, so domains are partly cultural.

## Eisenberg's prosocial reasoning
Nancy Eisenberg studied dilemmas in which helping costs the helper. Reasons develop from hedonistic (what is in it for me), to needs oriented (she needs help), to approval and stereotyped reasons (good people help), to empathic, and finally to internalised values. Prosocial reasoning predicts helping better than Kohlberg's justice reasoning.

## Hoffman's empathy development
Martin Hoffman described empathy developing from global empathy in newborns, who cry when another baby cries, to egocentric empathy in toddlers, who offer their own teddy to a crying adult, to empathy for another's feelings, and finally to empathy for another's general life condition, such as poverty. He showed that induction, explaining how one's actions affect others, builds empathy and internalised morality better than power assertion or love withdrawal.

## Conclusion
Piaget described a shift from rule bound, consequence based heteronomous morality to cooperative, intention based autonomous morality. Later research shows that young children are more morally sophisticated than he thought, that moral and conventional rules are distinguished early, and that empathy and prosocial reasoning are equally important parts of moral growth.`,
    keyPoints: ["Marbles and paired story methods with the cups example", "Heteronomous morality: consequences, fixed rules, immanent justice", "Autonomous morality: intentions, agreement, reciprocity", "Role of peer cooperation", "Evaluation including younger children using intentions", "Turiel's moral and conventional domains", "Eisenberg's prosocial levels and Hoffman's empathy stages with induction"],
    pitfalls: ["Mixing Piaget's two stages with Kohlberg's six", "Leaving out immanent justice", "Giving Turiel's theory without how it challenges Piaget"],
    module: "lifespan/2-5",
    visuals: [
      compare(
        "Stages of moral development: heteronomous versus autonomous",
        ["Heteronomous (about 5 to 10)", ["Rules from authority, unchangeable", "Judge by consequences", "John who broke 15 cups is naughtier", "Immanent justice and expiatory punishment"], "Morality of constraint"],
        ["Autonomous (10 onwards)", ["Rules are agreements", "Judge by intentions", "Henry who stole jam is naughtier", "Reciprocal punishment that fits the act"], "Morality of cooperation"],
      ),
      vis("sort", {
        prompt: "Turiel's domains: moral rule or social convention?",
        buckets: ["Moral", "Social convention"],
        items: [
          { text: "Do not hit your little brother", bucket: 0 },
          { text: "Call your teacher ma'am", bucket: 1 },
          { text: "Do not take another child's tiffin", bucket: 0 },
          { text: "Wear the school uniform on Mondays", bucket: 1 },
        ],
      }, "Turiel's domain theory: sort the rules"),
    ],
    ref: "Piaget 1932 Moral Judgment of the Child; Nelson 1980 intentions in 3 year olds; Turiel 1983 domain theory; Shweder, Mahapatra and Miller 1987; Eisenberg 1986 prosocial reasoning; Hoffman 2000 empathy; lifespan module 2.5",
  },
  {
    id: "dev-l05-049",
    subject: S,
    topic: "information-processing",
    marks: 10,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "What are executive functions? Describe their development in childhood and adolescence, how they are measured, and what the research on delay of gratification shows.",
    plan: ["Define the three core executive functions", "Developmental course and brain basis", "Tasks used with children", "Delay of gratification and its replication", "Long term outcomes and interventions"],
    answer: `## Executive functions
Executive functions are the top down mental processes needed to concentrate, plan and control behaviour instead of acting on impulse. Adele Diamond describes three core executive functions:
- Inhibitory control: stopping an automatic or tempting response, including self control and selective attention.
- Working memory: holding information in mind and working with it, such as doing a sum mentally.
- Cognitive flexibility: switching between rules, tasks or perspectives.
From these, higher functions such as planning, reasoning and problem solving are built.

## Development
Executive functions develop with the prefrontal cortex and its connections, slowly from infancy into the early twenties. Infants first show inhibition when they pass the A not B task at about 12 months. A large improvement happens between 3 and 5 years, when children can follow rules that conflict with habits. Working memory capacity grows through childhood, from about two or three digits at age 4 to about seven in adolescence, and speed and flexibility keep improving through adolescence.

## How they are measured
- Day night task: say "night" to a picture of the sun and "day" to a moon, a children's version of the Stroop task.
- Dimensional change card sort: sort cards by colour, then switch to shape. Most 3 year olds keep sorting by colour even while saying the new rule; most 5 year olds switch.
- Go no go and Simon says games for inhibition.
- Backward digit span for working memory.
- Delay tasks for self control.

## Delay of gratification
Walter Mischel offered preschoolers at Stanford a choice: one treat now, or two if they waited until the experimenter returned. Children who distracted themselves, by singing or covering their eyes, waited longer, showing that self control depends on strategies rather than willpower alone. Follow ups found that children who waited longer had better adolescent school results and coping. A larger and more diverse replication in 2018 found that the link with later achievement was about half as large and was largely explained by family background and early cognitive ability. Waiting is also rational only when the promise is trusted: children whose experimenter had broken an earlier promise waited much less.

## Outcomes and interventions
In the Dunedin study of about 1,000 New Zealand children, low childhood self control predicted poorer health, more money problems and more criminal convictions at age 32, even after controlling for intelligence and class. Executive functions predict school readiness better than early IQ in some studies. Poverty related stress can weaken them, which links to inequality in India's schools. Programmes such as Tools of the Mind, a Vygotskian preschool curriculum based on planned pretend play, as well as mindfulness and some sports, improve executive functions, with the largest gains in children who start lowest. Computerised working memory training improves the trained task but shows little transfer.

## Conclusion
Executive functions develop gradually and predict important outcomes, but they are shaped by environment and trust, not fixed traits. Supportive, playful schooling can strengthen them.`,
    keyPoints: ["Three core executive functions defined", "Developmental course with the 3 to 5 year leap and prefrontal link", "At least three child measures such as DCCS and day night", "Mischel's delay study and strategies", "2018 replication and the role of trust", "Dunedin self control outcomes", "Interventions with limits of computer training"],
    pitfalls: ["Presenting the marshmallow test as a fixed predictor of success", "Not naming the three core functions"],
    module: "lifespan/2-2",
    visuals: [
      tree("Executive functions", [
        ["Executive functions", "Top down control of thought and action", -1],
        ["Inhibitory control", "Day night task, go no go", 0],
        ["Working memory", "Backward digit span", 0],
        ["Cognitive flexibility", "Dimensional change card sort", 0],
        ["Planning and reasoning", "Built from the three core functions", 0],
      ], "Executive functions: three core skills and how they are measured"),
    ],
    ref: "Diamond 2013 Annual Review executive functions; Zelazo 2006 DCCS; Mischel, Shoda and Rodriguez 1989; Shoda, Mischel and Peake 1990; Watts, Duncan and Quan 2018; Kidd, Palmeri and Aslin 2013 reliability; Moffitt et al 2011 PNAS Dunedin; Diamond and Lee 2011 Science",
  },
  {
    id: "dev-l05-050",
    subject: S,
    topic: "attachment",
    marks: 10,
    difficulty: 4,
    exams: ["ma-semester", "mcp-entrance", "md-psychiatry", "ugc-net"],
    question: "What do studies of children raised in institutions tell us about sensitive periods for attachment and development? Discuss the English and Romanian Adoptees study and the Bucharest Early Intervention Project, and their implications for policy in India.",
    plan: ["Background: Bowlby and earlier institution studies", "The ERA study design and findings", "The Bucharest Early Intervention Project", "Attachment disorders that result", "What the findings mean for sensitive periods", "Implications for Indian child care and adoption"],
    answer: `## Background
John Bowlby's maternal deprivation hypothesis claimed that prolonged separation from a mother figure in the early years causes lasting harm. Earlier studies, such as Barbara Tizard's work on children in well run London residential nurseries with rotating staff, found that children adopted out of care formed close bonds with adoptive parents but often had problems with peers and attention in adolescence. These studies could not separate deprivation from other risks.

## The English and Romanian Adoptees study
After the fall of the Ceausescu regime in 1989, thousands of children were found in Romanian institutions with severe deprivation: poor nutrition, little stimulation and almost no individual care. Michael Rutter's team followed about 165 Romanian children adopted into UK families before age 42 months, comparing them with UK children adopted before six months, and assessed them repeatedly into their twenties.
- Many children showed dramatic catch up in growth and cognition.
- Children adopted before about six months did about as well as the UK adoptees.
- Those who had spent more than six months in institutions had much higher rates of a cluster of deprivation specific problems: quasi autistic features, disinhibited social engagement, inattention and overactivity, and cognitive impairment.
- These problems persisted into young adulthood for many, and emotional problems increased in adolescence and adulthood, although cognitive impairment often recovered.
- Beyond six months, longer deprivation did not add much further risk, suggesting a threshold.

## The Bucharest Early Intervention Project
Charles Nelson, Nathan Fox and Charles Zeanah ran a randomised trial starting in 2000: young children in Bucharest institutions were assigned either to high quality foster care created for the study or to continued institutional care, compared with never institutionalised children. Foster care improved IQ, language, attachment security and emotional problems, and the gains were largest when placement happened before about 24 months. Brain measures showed reduced EEG power in institutionalised children, partly recovered with early foster care. The trial is also a key case in research ethics, since randomisation was possible only because Romania had no foster care system.

## Attachment disorders
Two patterns are now separate diagnoses: reactive attachment disorder, an emotionally withdrawn child who rarely seeks comfort, and disinhibited social engagement disorder, a child who approaches and goes off with strangers without checking back. Both arise from severe social neglect; the disinhibited pattern is the more persistent.

## Sensitive periods
The findings support a sensitive period, not a strict critical period. Early adversity has effects that become harder to reverse after a point, but many functions remain plastic and recovery continues for years. The timing differs across domains.

## Implications for India
- Early family placement: under the Juvenile Justice (Care and Protection of Children) Act of 2015 and the adoption regulations of the Central Adoption Resource Authority, faster processes for declaring children legally free and placing them in families matter developmentally, not just administratively.
- Quality of child care institutions: small groups, consistent caregivers and individual attention reduce harm; the Mission Vatsalya scheme promotes family based alternatives such as foster care and sponsorship.
- Screening and support for adopted children, and guidance for adoptive parents about indiscriminate friendliness and attention problems.

## Conclusion
Institution studies show remarkable but incomplete recovery from early deprivation, with a sensitive period roughly in the first six months to two years. The policy message is to place children in stable, responsive families as early as possible.`,
    keyPoints: ["Bowlby's hypothesis and earlier studies", "ERA sample and comparison group", "Six month threshold and deprivation specific problems", "Persistence and partial recovery into adulthood", "BEIP randomised design and the 24 month finding", "RAD and DSED distinguished", "Sensitive rather than critical period", "Indian policy: JJ Act, CARA, Mission Vatsalya"],
    pitfalls: ["Saying no child recovered", "Calling it a critical period", "Leaving out the ethics of the randomised trial"],
    module: "lifespan/2-4",
    visuals: [
      chain("The English and Romanian Adoptees study", [["Severe deprivation", "Romanian institutions before 1990"], ["Adoption into UK families", "At different ages up to 42 months"], ["Before six months", "Did as well as UK adoptees"], ["After six months", "Quasi autism, disinhibited attachment, inattention, cognitive problems"], ["Young adulthood", "Many problems persist; emotional problems rise"]], "The English and Romanian Adoptees study: age at adoption mattered"),
      compare(
        "Attachment disorders after neglect",
        ["Reactive attachment disorder", ["Withdrawn, rarely seeks comfort", "Little positive emotion", "Responds to good care"], "Inhibited"],
        ["Disinhibited social engagement disorder", ["Overfamiliar with strangers", "Goes off without checking back", "More persistent"], "Indiscriminate"],
      ),
    ],
    ref: "Rutter et al ERA study 1998 to 2017 (Sonuga-Barke et al 2017 Lancet young adult follow up); Nelson, Fox and Zeanah BEIP 2007 Science, Romania's Abandoned Children 2014; Hodges and Tizard 1989; DSM-5 RAD and DSED; JJ Act 2015; CARA Adoption Regulations 2022; Mission Vatsalya 2022",
  },
]);
