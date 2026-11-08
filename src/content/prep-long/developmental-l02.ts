import type { LongQA } from "@/lib/prep/long-types";

const S = "developmental" as const;

export const DEVELOPMENTAL_L02: LongQA[] = [
  {
    id: "dev-l02-011",
    subject: S,
    topic: "erikson",
    marks: 20,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg", "mcp-entrance"],
    question: "Describe Erikson's psychosocial theory of development across the lifespan. Evaluate the theory, with reference to research and to the Indian context.",
    plan: ["Erikson's approach: epigenetic principle, crisis, ego strength", "Eight stages with the crisis, virtue and examples", "Comparison with Freud", "Research support: identity, generativity, integrity", "Criticisms including culture and gender", "Indian context and conclusion"],
    answer: `## Erikson's approach
Erik Erikson, a psychoanalyst trained by Anna Freud, extended Freud's theory in three ways: he emphasised social and cultural influences rather than sexual drives, he focused on the ego and its strengths rather than the id, and he described development across the whole lifespan rather than ending in adolescence. His theory is psychosocial.
- Epigenetic principle: development unfolds according to a ground plan, with each stage emerging at its proper time and building on earlier ones.
- At each stage the individual faces a psychosocial crisis, a turning point between two opposing tendencies. Successful resolution, a favourable balance (not the complete absence of the negative pole), produces a virtue or ego strength. Unresolved crises can be revisited later.

## The eight stages
| Stage and age | Crisis | Virtue | Key relationships and examples |
| Infancy, 0 to 1 | Trust versus mistrust | Hope | Mother or caregiver: consistent, responsive feeding and comfort build trust |
| Early childhood, 1 to 3 | Autonomy versus shame and doubt | Will | Parents: toilet training, feeding self, choosing clothes |
| Play age, 3 to 6 | Initiative versus guilt | Purpose | Family: planning games, asking questions, imaginative play |
| School age, 6 to 12 | Industry versus inferiority | Competence | School and neighbourhood: learning skills, comparing with peers |
| Adolescence, 12 to 18 | Identity versus role confusion | Fidelity | Peers and role models: who am I, what do I believe, what career |
| Young adulthood, 18 to 40 | Intimacy versus isolation | Love | Partners and friends: committed relationships |
| Middle adulthood, 40 to 65 | Generativity versus stagnation | Care | Work and household: guiding the next generation, productive work |
| Late adulthood, 65 onwards | Ego integrity versus despair | Wisdom | Humankind: accepting one's life as meaningful |

## The stages explained
- Trust versus mistrust: infants who receive reliable care develop a basic sense that the world is safe and people dependable. Inconsistent or neglectful care leads to mistrust.
- Autonomy versus shame and doubt: toddlers want to do things for themselves. Supportive parents allow choices; over-controlling or harsh parents produce shame.
- Initiative versus guilt: preschoolers take initiative in play and exploration. Excessive punishment for curiosity produces guilt.
- Industry versus inferiority: school children develop competence through mastering skills; repeated failure or harsh comparison leads to inferiority.
- Identity versus role confusion: adolescents explore roles, values and occupations to form a coherent identity. Erikson described a psychosocial moratorium, a period of exploration allowed by society. Failure leads to role confusion or a negative identity.
- Intimacy versus isolation: young adults seek deep commitment with others; a secure identity is needed for true intimacy.
- Generativity versus stagnation: middle-aged adults care for children, mentor younger colleagues and contribute to society; failure leads to self-absorption.
- Integrity versus despair: older adults review their lives; acceptance brings wisdom, regret brings despair and fear of death.
Erikson and his wife Joan later proposed a ninth stage in very old age, involving the reliving of earlier crises and gerotranscendence.

## Comparison with Freud
| Freud | Erikson |
| Psychosexual, drive-based | Psychosocial, culture-based |
| Focus on id and conflicts | Focus on ego strengths |
| Development ends at adolescence | Development across the lifespan |
| Early experience largely determines personality | Later stages can repair earlier problems |
| Emphasis on pathology | Emphasis on healthy development |

## Research support
- James Marcia's identity statuses operationalised the identity crisis and showed that identity achievement is associated with better psychological health.
- Generativity: Dan McAdams found that highly generative adults tell life stories with redemption themes and report greater wellbeing; generativity predicts parenting quality and civic involvement.
- Integrity: life review and reminiscence therapy, based on Erikson's ideas, improve wellbeing in older adults.
- George Vaillant's long-term Grant study found that men who resolved earlier stages were more likely to become generative and well adjusted.
- Attachment research supports the importance of early trust.

## Criticisms
- Vague concepts and ages; stages are hard to test empirically.
- Based largely on clinical observation and Western, male, middle-class lives.
- Gender: Carol Gilligan argued that for many women intimacy and identity develop together rather than in sequence.
- The order of stages may vary; identity work continues across adulthood.
- Culture: the emphasis on individual identity, autonomy and independent choice reflects individualist Western values.

## Indian context
- In India, the family plays a central role across stages; autonomy in toddlerhood may be less emphasised, and children may sleep with parents and be fed by hand longer, reflecting interdependence rather than lack of autonomy.
- Sudhir Kakar argued that the Indian child experiences a prolonged, intense bond with the mother, followed by an abrupt shift to the world of men for boys, shaping identity.
- Identity in adolescence is often negotiated within family, caste and religious expectations, with career and marriage choices made collectively.
- The ashrama system describes life stages: brahmacharya (student), grihastha (householder, similar to generativity), vanaprastha (gradual withdrawal) and sannyasa (renunciation, resembling integrity and transcendence).
- Indian studies of identity among college students show both exploration and family-based commitment.

## Conclusion
Erikson's psychosocial theory provides a broad, humane framework for understanding development across the lifespan as a series of social challenges, each offering a virtue. It has influenced education, counselling and gerontology, and its key ideas of identity and generativity are well supported. Its limitations are vagueness and cultural bias, which Indian perspectives such as the ashrama model help to highlight.`,
    keyPoints: ["Psychosocial focus, epigenetic principle and crisis", "All eight stages with correct crisis and virtue", "Explanation of each stage", "Comparison with Freud", "Research support: Marcia, McAdams, Vaillant", "Criticisms including gender and culture", "Indian perspectives: Kakar and ashramas", "Conclusion"],
    pitfalls: ["Getting the order of stages wrong", "Treating resolution as all-or-none"],
    module: "lifespan/2-3",
    visuals: [
      { kind: "timeline", caption: "The eight stages", data: { prompt: "Put Erikson's eight crises in order.", events: [{ label: "Trust versus mistrust", when: "0 to 1" }, { label: "Autonomy versus shame and doubt", when: "1 to 3" }, { label: "Initiative versus guilt", when: "3 to 6" }, { label: "Industry versus inferiority", when: "6 to 12" }, { label: "Identity versus role confusion", when: "Adolescence" }, { label: "Intimacy versus isolation", when: "Young adulthood" }, { label: "Generativity versus stagnation", when: "Middle adulthood" }, { label: "Integrity versus despair", when: "Late adulthood" }], why: "Each stage builds on the virtues gained in the earlier ones." } },
      { kind: "compare", caption: "Comparison with Freud", data: { title: "Freud versus Erikson", a: { label: "Freud", points: ["Psychosexual drives", "Stages end at puberty", "Focus on conflict"], summary: "Id-centred." }, b: { label: "Erikson", points: ["Psychosocial tasks", "Stages across the lifespan", "Focus on ego strengths"], summary: "Ego-centred." } } },
    ],
    ref: "Erikson 1950 Childhood and Society, 1968 Identity: Youth and Crisis; Erikson and Erikson 1997; Marcia 1966; McAdams and de St Aubin 1992; Vaillant 2002; Kakar 1978 The Inner World; Santrock ch 1 and 11",
  },
  {
    id: "dev-l02-012",
    subject: S,
    topic: "freud-psychosexual",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg", "ugc-net"],
    question: "Describe Freud's psychosexual stages of development and the concept of fixation. Evaluate the theory.",
    plan: ["Libido and erogenous zones", "Five stages with conflicts", "Fixation and adult traits", "Oedipus complex and identification", "Evaluation"],
    answer: `## Basic ideas
Sigmund Freud proposed that personality develops through a series of stages in which the libido (sexual or life energy) is focused on different erogenous zones of the body. At each stage, the child faces a conflict between biological drives and social demands. How parents handle these conflicts shapes adult personality.

## The stages
- Oral stage (0 to 1 year): pleasure from sucking, biting and feeding. The conflict centres on weaning.
- Anal stage (1 to 3 years): pleasure from holding and expelling faeces. The conflict centres on toilet training and control.
- Phallic stage (3 to 6 years): focus on the genitals. Boys experience the Oedipus complex (desire for the mother, rivalry with the father, castration anxiety), resolved by repressing the desire and identifying with the father, which forms the superego and gender identity. Freud proposed a parallel process in girls, later called the Electra complex by Carl Jung, involving penis envy; this is the most criticised part of the theory.
- Latency stage (6 to puberty): sexual impulses are dormant; energy goes into school, friendships with same-sex peers and skills.
- Genital stage (puberty onwards): mature sexual interest in others; healthy adults combine love and work.

## Fixation
Fixation occurs when too much libido remains tied to a stage, because of either excessive frustration or excessive gratification. Freud linked fixations to adult traits:
- Oral: dependence, gullibility, smoking, overeating, or sarcasm (oral aggressive).
- Anal retentive: orderliness, stinginess, obstinacy (from harsh toilet training); anal expulsive: messiness, generosity, carelessness.
- Phallic: vanity, recklessness, problems with authority or sexual identity.
Under stress, people may regress to the behaviour of an earlier stage.

## Evaluation
Strengths:
- First comprehensive theory of personality development, emphasising that early childhood experiences and relationships shape adult personality, a view later supported in modified forms by attachment research.
- Introduced ideas of unconscious motivation, defence mechanisms and the importance of parenting.
- Influenced psychotherapy, literature and culture.
Weaknesses:
- Difficult to test and to falsify; concepts such as libido and castration anxiety cannot be measured.
- Based on case studies of adult patients, mostly upper-middle-class Viennese women, and on reconstructed memories; the Little Hans case relied on reports from the boy's father.
- Little evidence links toilet training or weaning practices to specific adult traits; some studies found weak links between orderliness, obstinacy and parsimony, but not to toilet training.
- Overemphasis on sexuality and underemphasis on social and cultural factors, which Erikson and the neo-Freudians corrected.
- Gender bias, especially in the theory of female development; Karen Horney proposed "womb envy" in response.
- Cultural relativity: Bronislaw Malinowski found that in the Trobriand Islands, where the mother's brother disciplined boys, rivalry was directed at the uncle, not the father, suggesting the Oedipus complex is not universal. Indian scholars such as A. K. Ramanujan and Sudhir Kakar described different patterns in Indian myths and families.

## Conclusion
Freud's psychosexual theory was pioneering in proposing that early experiences shape personality through stages. Its specific claims about libido, the Oedipus complex and fixation have little empirical support, but its broad emphasis on early relationships and unconscious processes influenced all later developmental theory.`,
    keyPoints: ["Libido and erogenous zones", "Five stages in order with conflicts", "Oedipus complex and identification", "Fixation with oral and anal examples", "Strengths", "Criticisms including testability and gender bias", "Cultural critique such as Malinowski"],
    module: "lifespan/2-3",
    visuals: [
      { kind: "timeline", caption: "The stages", data: { prompt: "Put Freud's psychosexual stages in order.", events: [{ label: "Oral", when: "0 to 1" }, { label: "Anal", when: "1 to 3" }, { label: "Phallic", when: "3 to 6" }, { label: "Latency", when: "6 to puberty" }, { label: "Genital", when: "Puberty onwards" }] } },
    ],
    ref: "Freud 1905 Three Essays; Fisher and Greenberg 1977; Malinowski 1927; Kakar 1978; Santrock ch 1",
  },
  {
    id: "dev-l02-013",
    subject: S,
    topic: "adolescence-identity",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Describe Marcia's identity status model. How do identity statuses relate to adjustment, and how does identity formation differ across cultures?",
    plan: ["Link to Erikson", "Exploration and commitment dimensions", "Four statuses with examples", "Development and adjustment", "Cultural and Indian perspectives", "Critique"],
    answer: `## Link to Erikson
James Marcia in 1966 turned Erikson's crisis of identity versus role confusion into a measurable model. Using a semi-structured identity status interview about occupation, religion and political beliefs, he classified adolescents and young adults according to two dimensions.

## Two dimensions
- Exploration (crisis): actively considering alternatives and questioning one's choices.
- Commitment: making firm decisions and investing in them.

## Four identity statuses
| Status | Exploration | Commitment | Example |
| Identity diffusion | No | No | A student who has not thought about a career and does not care |
| Foreclosure | No | Yes | A student who will become a doctor because the family decided, without considering alternatives |
| Moratorium | Yes | No | A student actively trying out psychology, design and journalism, unsure which to choose |
| Identity achievement | Yes | Yes | A student who explored options and committed to becoming a counsellor |

## Development and adjustment
- Statuses are not stages; people can move between them, and often move from diffusion or foreclosure to moratorium and then achievement during college. Identity can be revisited in adulthood (MAMA cycles: moratorium, achievement, moratorium, achievement).
- Status may differ across domains: achieved in career, foreclosed in religion.
- Identity achievement is associated with higher self-esteem, autonomy, more mature moral reasoning and better relationships.
- Moratorium is associated with anxiety but also openness and curiosity.
- Foreclosure is associated with conformity, authoritarianism and close family ties, and lower openness, though also stability.
- Diffusion is associated with low self-esteem, apathy and greater risk of problems such as substance use.
- Higher education, supportive parents who encourage both connection and individuality, and exposure to diverse ideas promote exploration.

## Cultural and Indian perspectives
- The model assumes that individual exploration and choice are ideal, which fits individualist cultures.
- In India, many adolescents' career, marriage and religious identities are shaped by family and community. Foreclosure may be normative and adaptive rather than immature, and commitment may be chosen within family values (a form of "relational" identity).
- Indian studies with college students find high rates of foreclosure in some domains, alongside growing exploration in urban, educated groups, linked to globalisation, which Jeffrey Arnett describes as creating bicultural identities (local and global).
- Ethnic, caste and religious identities are important domains, and Jean Phinney's model of ethnic identity development applies similar statuses.

## Critique
- The interview is time-consuming, and statuses are categories imposed on continuous dimensions.
- Later models, such as Koen Luyckx's, add ruminative exploration and commitment evaluation.
- Narrative identity approaches (Dan McAdams) focus on the life story people construct.

## Conclusion
Marcia's model gives a useful way to describe how young people explore and commit in forming identity. Identity achievement is generally linked to better adjustment, but the value of exploration and commitment patterns depends on cultural context, as Indian research illustrates.`,
    keyPoints: ["Derived from Erikson", "Exploration and commitment", "Four statuses correctly defined with examples", "Statuses are not stages; MAMA cycles", "Adjustment correlates of each", "Cultural critique with Indian context", "Later models"],
    module: "lifespan/3-1",
    visuals: [
      { kind: "sort", caption: "Four identity statuses", data: { prompt: "Classify each student's identity status.", buckets: ["Diffusion", "Foreclosure", "Moratorium", "Achievement"], items: [{ text: "Will join the family business because it was always expected", bucket: 1 }, { text: "Is doing internships in three fields to decide", bucket: 2 }, { text: "Explored options and chose clinical psychology", bucket: 3 }, { text: "Has not thought about the future and is not bothered", bucket: 0 }] } },
    ],
    ref: "Marcia 1966 and 1980; Kroger, Martinussen and Marcia 2010 meta-analysis; Arnett 2002 globalisation; Phinney 1989; Luyckx et al 2008",
  },
  {
    id: "dev-l02-014",
    subject: S,
    topic: "attachment",
    marks: 15,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg", "mcp-entrance"],
    question: "Discuss Bowlby's theory of attachment. Describe the phases of attachment, the concept of internal working models and the maternal deprivation hypothesis, and evaluate the theory.",
    plan: ["Origins: ethology and psychoanalysis", "Key claims: monotropy, critical period, secure base", "Phases of attachment", "Internal working models", "Maternal deprivation and 44 thieves", "Evaluation including Rutter and culture"],
    answer: `## Origins
John Bowlby, a British psychiatrist and psychoanalyst, developed attachment theory in the 1950s and 1960s, combining psychoanalysis with ethology (the study of animal behaviour), evolutionary theory and control systems theory. He rejected the "cupboard love" view, held by both psychoanalysts and learning theorists, that infants attach to whoever feeds them. Harlow's monkey studies and Konrad Lorenz's imprinting in goslings supported his view that attachment is a separate, innate system.

## Key claims
- Attachment is an enduring emotional bond to a specific person, which evolved because staying close to a caregiver increased infants' survival.
- Infants are born with social releasers, such as crying, smiling and cooing, that elicit care.
- Monotropy: infants form one primary attachment, usually to the mother, which is qualitatively different from others, though secondary attachments also form.
- Critical (later sensitive) period: attachment must form within the first two and a half years, or it may never develop properly.
- Secure base and safe haven: the attachment figure provides a base from which to explore and a haven to return to when distressed.
- The attachment behavioural system is activated by threat, illness, fatigue or separation, and deactivated by proximity and comfort.

## Phases of attachment
- Pre-attachment (birth to 6 weeks): innate signals attract any adult.
- Attachment in the making (6 weeks to 6 to 8 months): infants respond differently to familiar people and develop a sense of trust.
- Clear-cut attachment (6 to 8 months to 18 months or 2 years): separation anxiety and stranger anxiety appear; the infant uses the caregiver as a secure base. Rudolph Schaffer and Peggy Emerson, in a study of 60 Glasgow infants, found specific attachments around 7 to 8 months, multiple attachments soon after, and that attachment was strongest to the person most responsive to the infant, not necessarily the one who fed them.
- Formation of a reciprocal relationship (18 months to 2 years onwards): the child understands the caregiver's goals and plans and can negotiate.

## Internal working models
Through repeated interactions, children build mental representations of themselves, attachment figures and relationships. A child with responsive care develops a model of others as available and the self as worthy of love; a child with rejecting or inconsistent care develops models of others as unreliable and the self as unworthy. These models guide expectations, emotions and behaviour in later relationships, explaining continuity of attachment patterns into adulthood and across generations (intergenerational transmission).

## Maternal deprivation hypothesis
Bowlby argued that prolonged separation from the mother in the critical period causes serious, lasting harm, including delinquency, reduced intelligence and affectionless psychopathy (lack of guilt and empathy).
- The "44 thieves" study: Bowlby compared 44 adolescent thieves attending his child guidance clinic with 44 non-thief clinic controls. Of the thieves, 14 were classified as affectionless psychopaths, and 12 of these had experienced prolonged separation from their mothers in early childhood, compared with very few controls.
- Robertson's films of young children in hospital, separated from parents, showed protest, despair and detachment, leading to changes in hospital visiting policies.

## Evaluation
Strengths:
- Supported by Ainsworth's Strange Situation research on attachment types and their link to caregiver sensitivity.
- Explains the universal tendency of infants to seek proximity and the distress of separation.
- Long-term studies show early attachment predicts later social competence and emotion regulation, though modestly.
- Major practical impact on hospital care, childcare, adoption and residential care.
Weaknesses:
- Michael Rutter distinguished deprivation (loss of an attachment) from privation (never forming one), arguing that privation is more harmful and that much damage attributed to separation came from the family discord or poor care surrounding it.
- The 44 thieves study was retrospective, correlational and conducted by Bowlby himself, with possible bias.
- Monotropy is not supported: Schaffer and Emerson found most infants form multiple attachments, including to fathers, grandparents and siblings, and fathers' sensitive play contributes to security.
- The critical period is better seen as a sensitive period: studies of Romanian orphans adopted into the United Kingdom (Rutter's English and Romanian Adoptees study) showed substantial recovery for those adopted before 6 months, though deficits persisted for some adopted later.
- The theory was used to argue that working mothers harm children, but research on quality day care shows no harm in most cases.
- Cultural bias: the emphasis on a single mother-infant bond reflects Western nuclear families. In India and many other societies, care is shared among mothers, grandmothers, aunts and older siblings, and infants form multiple attachments within joint families.

## Conclusion
Bowlby's attachment theory established that infants have an evolved need for a close, responsive caregiver, and that early relationships shape internal working models of self and others. Later research modified his claims about monotropy, critical periods and maternal deprivation, but attachment theory remains one of the most influential and empirically supported theories in developmental psychology.`,
    keyPoints: ["Ethological and evolutionary basis, rejection of cupboard love", "Monotropy, critical period, secure base", "Four phases with Schaffer and Emerson", "Internal working models", "Maternal deprivation and 44 thieves figures", "Rutter's deprivation versus privation", "Romanian adoptees and sensitive period", "Cultural critique with Indian multiple caregivers"],
    module: "lifespan/2-4",
    visuals: [
      { kind: "timeline", caption: "Phases of attachment", data: { prompt: "Order Bowlby's phases of attachment.", events: [{ label: "Pre-attachment: signals attract anyone", when: "0 to 6 weeks" }, { label: "Attachment in the making: prefers familiar people", when: "6 weeks to 6 to 8 months" }, { label: "Clear-cut attachment: separation and stranger anxiety", when: "6 to 8 months to 2 years" }, { label: "Reciprocal relationship: negotiates goals", when: "2 years onwards" }] } },
      { kind: "flow", data: { title: "Internal working model", layout: "cycle", nodes: [{ id: "c", label: "Caregiver responds", detail: "Comfort when distressed." }, { id: "m", label: "Model formed", detail: "'Others help; I am worth helping.'" }, { id: "e", label: "Expectation in new relationships", detail: "Seeks support from teachers and friends." }, { id: "r", label: "Responses confirm the model", detail: "Supportive relationships follow." }] } },
    ],
    ref: "Bowlby 1944 44 thieves, 1951, 1969 Attachment; Schaffer and Emerson 1964; Rutter 1972 and Rutter et al 1998 ERA study; Robertson and Robertson 1971; Harlow 1958; Santrock ch 10",
  },
  {
    id: "dev-l02-015",
    subject: S,
    topic: "attachment",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg", "ugc-net", "mcp-entrance"],
    question: "Describe Ainsworth's Strange Situation procedure and the attachment types it identifies. What determines attachment security?",
    plan: ["Purpose and the eight episodes", "Behaviours observed", "Types A, B, C and D with proportions", "Sensitivity hypothesis and other factors", "Evaluation"],
    answer: `## The procedure
Mary Ainsworth developed the Strange Situation in the 1960s and 1970s, after naturalistic studies of mothers and infants in Uganda and Baltimore. It is a laboratory procedure for infants aged about 12 to 18 months, lasting about 20 minutes, in a room with toys, with eight episodes of about three minutes:
- Caregiver and infant enter the room.
- Infant explores while the caregiver sits.
- A stranger enters, talks with the caregiver and approaches the infant.
- Caregiver leaves; the stranger stays (first separation).
- Caregiver returns; the stranger leaves (first reunion).
- Caregiver leaves the infant alone (second separation).
- Stranger returns.
- Caregiver returns (second reunion).

## Behaviours observed
Exploration (secure base behaviour), separation distress, stranger anxiety and, most importantly, behaviour at reunion: seeking proximity, maintaining contact, resisting contact, or avoiding the caregiver.

## Attachment types
| Type | Behaviour | Approximate proportion in Ainsworth's sample |
| Secure (B) | Explores using caregiver as a base; may be upset at separation; seeks comfort at reunion and is quickly soothed | About 66 percent |
| Insecure avoidant (A) | Explores with little reference to caregiver; little distress at separation; ignores or avoids caregiver at reunion | About 22 percent |
| Insecure resistant or ambivalent (C) | Clingy, explores little; very distressed at separation; at reunion seeks contact but resists it angrily, hard to soothe | About 12 percent |
Mary Main and Judith Solomon later added:
- Disorganised (D): contradictory, confused behaviour, such as approaching with the head turned away, freezing or dazed expressions, as if the caregiver is both a source of comfort and of fear. It is associated with maltreatment, unresolved parental trauma and frightened or frightening parenting, and predicts later psychopathology. It occurs in about 15 percent of low-risk samples and much more in maltreated children.

## What determines security?
- Caregiver sensitivity hypothesis: Ainsworth found that mothers of secure infants responded promptly, accurately and warmly to their signals; mothers of avoidant infants were rejecting or intrusive; mothers of resistant infants were inconsistent. Meta-analyses find a moderate association between sensitivity and security, and interventions that increase sensitivity, such as video feedback programmes, improve security.
- Mind-mindedness: Elizabeth Meins found that parents who comment appropriately on infants' thoughts and feelings have more secure infants.
- Infant temperament: Jerome Kagan argued that types partly reflect temperament (easily distressed infants seem resistant); genetic influence on security appears modest in twin studies, while environment is more important.
- Family circumstances: poverty, parental depression, marital conflict and stress reduce sensitivity.
- Fathers and other caregivers: infants can have different attachment types with different caregivers, showing that attachment is relationship-specific.

## Evaluation
- Strengths: standardised, reliable coding; predictive validity for later social and emotional outcomes; widely used across cultures.
- Weaknesses: a brief, artificial laboratory situation; reflects one relationship; cultural differences in the meaning of behaviours (for example, Japanese infants rarely separated from mothers may become very distressed, appearing resistant). Ethical concerns about deliberately distressing infants are limited by the short episodes.

## Conclusion
The Strange Situation identifies secure, avoidant, resistant and disorganised attachment, mainly by observing reunion behaviour. Security is shaped largely by sensitive, responsive caregiving, along with temperament and family context.`,
    keyPoints: ["Eight episodes", "Reunion as the key observation", "Types A, B and C with proportions", "Disorganised type and its causes", "Sensitivity hypothesis with evidence", "Temperament and context", "Evaluation including cultural meaning"],
    module: "lifespan/2-4",
    visuals: [
      { kind: "strange", caption: "What determines security?", data: { caption: "Switch between secure, avoidant, ambivalent and disorganised infants at the reunion." } },
      { kind: "experiment", data: { title: "Attachment types in Ainsworth's Baltimore sample", question: "What share of infants showed each type?", unit: "%", conditions: [{ label: "Secure (B)", value: 66 }, { label: "Avoidant (A)", value: 22 }, { label: "Resistant (C)", value: 12 }], why: "Most infants were secure; disorganised attachment was identified later by Main and Solomon." } },
    ],
    ref: "Ainsworth et al 1978 Patterns of Attachment; Main and Solomon 1990; De Wolff and van IJzendoorn 1997 sensitivity meta-analysis; Meins et al 2001; Kagan 1984",
  },
  {
    id: "dev-l02-016",
    subject: S,
    topic: "attachment",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "cuet-pg", "mcp-entrance"],
    question: "Write a short note on Harlow's experiments with rhesus monkeys.",
    plan: ["Aim and procedure", "Results", "Later findings on isolation", "Significance and ethics"],
    answer: `## Aim and procedure
Harry Harlow, at the University of Wisconsin in the 1950s, tested the "cupboard love" theory that infants become attached to mothers because they provide food. He separated infant rhesus monkeys from their mothers shortly after birth and raised them with two surrogate "mothers": one made of bare wire mesh that held a feeding bottle, and one covered with soft terry cloth that gave no milk.

## Results
- The infants spent most of their time clinging to the cloth mother, around 17 to 18 hours a day, visiting the wire mother only to feed.
- When frightened by a mechanical toy, they ran to the cloth mother for comfort.
- In a new room, they explored more when the cloth mother was present, using her as a secure base.
Harlow concluded that contact comfort, not feeding, was the basis of attachment.

## Later findings
Monkeys raised in total isolation for six months or more showed severe, lasting social abnormalities: rocking, self-harm, fear, aggression, inability to interact with peers, and inadequate or abusive parenting when they had their own infants. Short isolation could be partly reversed by contact with younger "therapist" monkeys, as Stephen Suomi showed.

## Significance and ethics
The studies challenged learning theory explanations of attachment and supported Bowlby's view that attachment is an innate need for closeness. They influenced practices such as skin-to-skin "kangaroo care" for newborns. However, the experiments caused severe suffering and would not be permitted today; generalisation from monkeys to humans is also limited.`,
    keyPoints: ["Aim to test cupboard love", "Wire and cloth mother procedure", "Time spent and fear responses", "Contact comfort conclusion", "Effects of isolation and Suomi's therapy", "Significance and ethics"],
    module: "lifespan/2-4",
    visuals: [
      { kind: "compare", caption: "Results", data: { title: "Which mother did the infant choose?", a: { label: "Wire mother with milk", points: ["Visited only to feed", "Not used for comfort"], summary: "Food alone." }, b: { label: "Cloth mother without milk", points: ["Clung to her most of the day", "Ran to her when frightened", "Explored from her as a base"], summary: "Contact comfort." } } },
    ],
    ref: "Harlow 1958 American Psychologist; Harlow and Zimmermann 1959; Suomi and Harlow 1972",
  },
  {
    id: "dev-l02-017",
    subject: S,
    topic: "attachment",
    marks: 10,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Is attachment universal? Discuss cross-cultural research on attachment, including studies in India.",
    plan: ["The universality question", "Van IJzendoorn and Kroonenberg's meta-analysis", "Examples: Germany, Japan, Israel", "Indian research and multiple caregiving", "Critiques of using the Strange Situation across cultures", "Conclusion"],
    answer: `## The question
Bowlby argued that attachment is a universal, evolved system. If so, attachment behaviour and the link between sensitivity and security should appear in all cultures. But childrearing practices differ widely, so the distribution of attachment types might vary.

## Van IJzendoorn and Kroonenberg's meta-analysis
In 1988 Marinus van IJzendoorn and Pieter Kroonenberg analysed 32 Strange Situation studies from eight countries involving about 2,000 infants.
- Secure attachment was the most common type in every country, roughly 56 to 75 percent.
- Avoidant attachment was relatively more common in Western European countries such as Germany.
- Resistant attachment was relatively more common in Israel and Japan.
- Variation within countries was about one and a half times greater than variation between countries, suggesting that subcultures and social class matter more than nationality.

## Examples
- Germany: Karin and Klaus Grossmann found many avoidant infants in Bielefeld, reflecting a cultural value of early independence and self-reliance.
- Japan: Keiko Takahashi found many resistant infants and almost no avoidant ones; Japanese infants are rarely separated from their mothers, so being left with a stranger was extremely stressful, and the procedure was often stopped early.
- Israel: on traditional kibbutzim, infants slept communally away from parents and showed more resistant attachment to mothers.
- Gusii of Kenya and Dogon of Mali: secure attachment was common, with mothers responding promptly, though the forms of greeting (such as handshakes in Gusii) differed.

## Indian research
- In Indian joint families, infants are cared for by many people: mothers, grandmothers, aunts, older siblings and domestic helpers. Studies find that Indian infants form multiple attachments, supporting a "network" view rather than Bowlby's monotropy.
- Indian mothers tend to keep infants physically close, co-sleep, carry them and respond quickly to crying, practices associated with security.
- Indian studies using the Strange Situation and Attachment Q-sort report high proportions of secure attachment, though avoidant patterns are rare and the distress of separation can be high, as in Japan, because separation from all caregivers is unusual.
- Research on Indian adolescents and adults links secure attachment to parents with better wellbeing and lower depression, and finds that "parental control" may be experienced as care rather than intrusion.
- Parenting values in India emphasise interdependence, obedience and family harmony, so exploration away from the caregiver, central to Western definitions of security, may be less valued.

## Critiques of cross-cultural use
- Imposed etic: the Strange Situation was developed in the United States, and behaviours such as greeting at reunion may mean different things in other cultures.
- Fred Rothbaum and colleagues argued that the definition of security, linked to exploration and autonomy, reflects Western values; in Japan, security may be linked to dependence (amae) and accommodation to others.
- Samples are often small and urban.
- Heidi Keller argued that attachment theory overlooks cultures where infants are cared for by many and where proximal (body contact) rather than face-to-face distal parenting is the norm.

## Conclusion
Attachment appears universal, with secure attachment the most common pattern and sensitivity linked to security in many cultures. But the distribution of insecure types, the meaning of attachment behaviours and the number of attachment figures vary with childrearing practices. Indian research supports multiple attachments within extended families and calls for culturally sensitive measures.`,
    keyPoints: ["Universality question", "Van IJzendoorn and Kroonenberg findings", "Within-country variation greater than between", "Germany, Japan and Israel examples", "Indian multiple caregiving and practices", "Rothbaum's and Keller's cultural critiques", "Balanced conclusion"],
    module: "lifespan/2-4",
    visuals: [
      { kind: "experiment", caption: "Van IJzendoorn and Kroonenberg's meta-analysis", data: { title: "Attachment types across countries (approximate)", question: "What share of infants were secure in each country?", unit: "%", conditions: [{ label: "United States", value: 65 }, { label: "Germany", value: 57 }, { label: "Japan", value: 68 }, { label: "Israel", value: 64 }], why: "Secure attachment was most common everywhere; insecure types varied with childrearing practices." } },
    ],
    ref: "Van IJzendoorn and Kroonenberg 1988 Child Development; Grossmann et al 1985; Takahashi 1990; Sagi et al 1985; Rothbaum et al 2000 American Psychologist; Keller 2013; Sinha and Mishra on Indian childrearing; Mehrotra et al Indian attachment studies",
  },
  {
    id: "dev-l02-018",
    subject: S,
    topic: "attachment",
    marks: 10,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Discuss attachment in adulthood, with reference to the Adult Attachment Interview, Hazan and Shaver's love quiz and the two-dimensional model of adult attachment. What are the clinical implications?",
    plan: ["Continuity of internal working models", "Adult Attachment Interview and intergenerational transmission", "Hazan and Shaver's romantic attachment", "Anxiety and avoidance dimensions; Bartholomew's four categories", "Stability and change", "Clinical implications"],
    answer: `## Continuity
Bowlby proposed that attachment shapes relationships "from the cradle to the grave" through internal working models. Two research traditions study adult attachment: developmental researchers using interviews about childhood, and social psychologists using self-reports about romantic relationships.

## The Adult Attachment Interview
Mary Main and colleagues developed the Adult Attachment Interview (AAI), in which adults describe childhood relationships with parents, give adjectives with supporting memories, and discuss experiences of loss and trauma. Coding focuses on the coherence of the account rather than what happened.
- Secure-autonomous: coherent, balanced accounts that value relationships, even if childhood was difficult ("earned security").
- Dismissing: minimises the importance of attachment, idealises parents but cannot give supporting memories.
- Preoccupied: angry or confused, entangled with past relationships, long rambling answers.
- Unresolved: lapses in reasoning when discussing loss or trauma.
Intergenerational transmission: parents' AAI classifications predict their infants' Strange Situation classifications in about 75 percent of cases (van IJzendoorn's meta-analysis), even when the AAI is given before the baby is born, with parental sensitivity partly explaining the link.

## Hazan and Shaver's romantic attachment
Cindy Hazan and Phillip Shaver in 1987 proposed that romantic love is an attachment process. In a newspaper "love quiz", adults chose which of three descriptions fitted their feelings in romantic relationships:
- Secure (about 56 percent): find it easy to get close, comfortable depending on others; reported happy, trusting relationships that lasted longer.
- Avoidant (about 25 percent): uncomfortable being close, find it hard to trust; fear of intimacy, emotional highs and lows, jealousy.
- Anxious-ambivalent (about 19 percent): want to merge completely with partners, worry partners do not really love them; obsession, desire for reciprocation, extreme sexual attraction and jealousy.
The proportions resembled those of infant attachment types, and respondents' descriptions of their parents were related to their style.

## Two dimensions and four categories
Later research showed adult attachment is better measured with two continuous dimensions, as in the Experiences in Close Relationships scale (Kelly Brennan, Catherine Clark and Shaver):
- Attachment anxiety: fear of rejection and abandonment, need for reassurance.
- Attachment avoidance: discomfort with closeness and dependence.
Kim Bartholomew's four-category model crosses models of self and others:
| | Positive model of others | Negative model of others |
| Positive model of self | Secure | Dismissing-avoidant |
| Negative model of self | Preoccupied | Fearful-avoidant |

## Stability and change
Attachment styles are moderately stable, but they change with life experiences: new relationships, loss, therapy and major stresses. Secure adults tend to have more satisfying, stable relationships, seek support under stress and provide support to partners; anxious adults show hypervigilance and protest; avoidant adults withdraw under stress.

## Clinical implications
- Insecure attachment is a general risk factor for depression, anxiety, eating disorders and personality disorders; disorganised and unresolved attachment is linked to dissociation and borderline personality disorder.
- Therapy relationship: clients' attachment styles affect the therapeutic alliance; the therapist can serve as a secure base.
- Interventions: emotionally focused couples therapy, attachment-based family therapy, mentalisation-based treatment for borderline personality disorder, and parent interventions such as video feedback and Circle of Security that break intergenerational cycles.
- In India, family-based therapy may draw on extended family attachment networks.

## Conclusion
Adult attachment, measured by interviews or self-report, shows continuity with childhood patterns, predicts relationship functioning and parenting, and can change with experience. Its clinical relevance has led to attachment-informed therapies for individuals, couples and families.`,
    keyPoints: ["Internal working models across life", "AAI coding on coherence and four classifications", "Intergenerational transmission about 75 percent", "Hazan and Shaver's three styles with proportions", "Anxiety and avoidance dimensions", "Bartholomew's four categories", "Stability and change", "Clinical implications and therapies"],
    module: "lifespan/2-4",
    visuals: [
      { kind: "experiment", caption: "Hazan and Shaver's romantic attachment", data: { title: "Hazan and Shaver's love quiz", question: "What share of adults chose each romantic attachment style?", unit: "%", conditions: [{ label: "Secure", value: 56 }, { label: "Avoidant", value: 25 }, { label: "Anxious-ambivalent", value: 19 }], why: "Proportions resembled infant attachment types." } },
    ],
    ref: "Main, Kaplan and Cassidy 1985 AAI; van IJzendoorn 1995 Psychological Bulletin; Hazan and Shaver 1987 JPSP; Bartholomew and Horowitz 1991; Brennan, Clark and Shaver 1998; Mikulincer and Shaver 2007",
  },
  {
    id: "dev-l02-019",
    subject: S,
    topic: "kohlberg",
    marks: 15,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg", "mcp-entrance"],
    question: "Describe Kohlberg's theory of moral development, including his method and the three levels and six stages. Evaluate the theory in the light of research.",
    plan: ["Roots in Piaget", "Method: moral dilemmas such as Heinz", "Three levels and six stages with Heinz responses", "Research support: longitudinal and cross-cultural", "Criticisms: gender, culture, reasoning versus behaviour", "Conclusion"],
    answer: `## Roots in Piaget
Jean Piaget studied moral judgement by asking children about rules in games of marbles and about stories. Young children (heteronomous morality, up to about 7 to 10) judged acts by their consequences: a child who broke 15 cups accidentally was naughtier than one who broke one cup while stealing jam. Older children (autonomous morality) considered intentions and saw rules as agreements that can be changed. Lawrence Kohlberg extended this into a theory of moral reasoning across the lifespan.

## Method
Kohlberg presented moral dilemmas and analysed the reasoning behind answers, not the answers themselves. In the Heinz dilemma, a woman is dying of cancer; a druggist has invented a drug that might save her but charges ten times its cost. Her husband Heinz can raise only half the money; the druggist refuses to sell it cheaper. Heinz breaks into the store and steals the drug. Should he have done that? Why? Kohlberg began with 72 boys aged 10, 13 and 16 in Chicago in 1956 and followed many for over 20 years.

## Levels and stages
| Level | Stage | Basis of reasoning | Example response to Heinz |
| Preconventional | 1. Obedience and punishment | Avoid punishment; obey authority | "He should not steal; he will be put in jail" |
| Preconventional | 2. Individualism and exchange | Self-interest, fair deals | "He should steal it; he needs his wife, and the druggist is being greedy" |
| Conventional | 3. Good interpersonal relationships | Being a good person, approval, loyalty | "He should steal it; a good husband would; his family would think badly of him otherwise" |
| Conventional | 4. Maintaining social order | Law, duty, rules for society | "He should not steal; if everyone broke the law, society would collapse" (or: he should, but must accept punishment) |
| Postconventional | 5. Social contract and individual rights | Laws serve human welfare and can be changed; rights | "Life is more important than property; the law should allow this" |
| Postconventional | 6. Universal ethical principles | Self-chosen principles of justice, dignity and equality | "He must steal because preserving human life is a universal principle above any law" |
- Each stage is qualitatively different, follows an invariant sequence, and represents more adequate reasoning about justice.
- Movement occurs through cognitive development (formal operations are needed for postconventional reasoning) and social role-taking, stimulated by exposure to reasoning one stage above one's own.
- Few people reach stage 6; Kohlberg later dropped it as a scoring stage. Most adults reason at stages 3 and 4.

## Research support
- Longitudinal data from the original sample (Anne Colby and colleagues) showed stages occurred in order, with very few skips or reversals, and stage 1 and 2 reasoning declining with age.
- John Snarey's review of 45 studies in 27 cultures found stages 1 to 4 in all societies studied, in the same order, but stage 5 reasoning was rare, found mainly in urban, educated groups.
- Moral reasoning correlates moderately with moral behaviour: higher-stage reasoners were more likely to resist cheating and less likely to obey Milgram-type orders, and juvenile offenders often reason at lower stages.
- Moral education programmes using dilemma discussion (the Blatt effect) and "just community" schools raised reasoning levels.

## Criticisms
- Gender bias: Carol Gilligan argued that Kohlberg's theory, based on an all-male sample, privileged an ethic of justice and scored women's ethic of care, focusing on relationships and responsibilities, as stage 3. However, Lawrence Walker's meta-analysis found few sex differences in Kohlberg scores when education and occupation were controlled.
- Cultural bias: the postconventional stages reflect Western liberal individualism. Richard Shweder found that in Bhubaneswar, Indian adults and children saw many practices (such as eating beef or a widow eating fish) as moral violations, based on an ethic of divinity and community. Joan Miller found that Indians more often saw helping as a moral duty rather than a personal choice. Collectivist reasoning may be scored lower unfairly.
- Reasoning versus behaviour: the theory focuses on how people reason about hypothetical dilemmas, not on how they actually behave, feel or are motivated. The correlation between reasoning and behaviour is modest.
- Intuition: Jonathan Haidt's social intuitionist model proposes that moral judgements are often quick, emotional intuitions, with reasoning used afterwards to justify them; his moral foundations theory identifies care, fairness, loyalty, authority and sanctity.
- Children's competence: Elliot Turiel showed that even young children distinguish moral rules (do not hit) from social conventions (wear a uniform), which Kohlberg's stage 1 underestimates.
- Hypothetical dilemmas lack realism; real-life dilemmas yield different reasoning.

## Conclusion
Kohlberg's theory describes a sequence of increasingly sophisticated moral reasoning, from avoiding punishment to principled justice, supported by longitudinal and cross-cultural research for the early stages. Its limitations, gender and cultural bias, the gap between reasoning and behaviour, and neglect of emotion and intuition, have led to broader models of moral development that include care, community, divinity and moral intuition.`,
    keyPoints: ["Piaget's heteronomous and autonomous morality", "Method with Heinz dilemma", "Three levels and six stages correctly described", "Example reasoning for each stage", "Longitudinal and Snarey cross-cultural support", "Gilligan's care critique and Walker's meta-analysis", "Shweder's Indian research and cultural critique", "Reasoning-behaviour gap and Haidt's intuitionism"],
    pitfalls: ["Classifying by the answer instead of the reasoning", "Ignoring the cultural critique"],
    module: "lifespan/2-5",
    visuals: [
      { kind: "sort", caption: "Levels and stages", data: { prompt: "Which level is each reason for Heinz's decision?", buckets: ["Preconventional", "Conventional", "Postconventional"], items: [{ text: "He should not; he will go to jail", bucket: 0 }, { text: "He should; a good husband cares for his wife", bucket: 1 }, { text: "He should not; the law must be obeyed by everyone", bucket: 1 }, { text: "He should; human life is worth more than property", bucket: 2 }] } },
      { kind: "layers", caption: "Research support", data: { title: "Kohlberg's levels", shape: "stack", layers: [{ label: "Postconventional", detail: "Stages 5 and 6: rights and universal principles." }, { label: "Conventional", detail: "Stages 3 and 4: approval and law and order." }, { label: "Preconventional", detail: "Stages 1 and 2: punishment and self-interest." }] } },
    ],
    ref: "Piaget 1932 Moral Judgment of the Child; Kohlberg 1958 and 1981; Colby et al 1983; Snarey 1985 Psychological Bulletin; Gilligan 1982; Walker 1984; Shweder, Mahapatra and Miller 1987; Miller and Bersoff 1992; Haidt 2001; Turiel 1983",
  },
  {
    id: "dev-l02-020",
    subject: S,
    topic: "kohlberg",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net"],
    question: "Write a short note on Gilligan's ethic of care.",
    plan: ["Gilligan's critique of Kohlberg", "Ethic of care versus ethic of justice", "Her three levels", "Evidence and evaluation"],
    answer: `## Critique of Kohlberg
Carol Gilligan, a colleague of Kohlberg at Harvard, argued in her 1982 book "In a Different Voice" that Kohlberg's theory was biased against women because it was based on an all-male sample and defined morality as abstract justice and rights. On his scale, women often scored at stage 3, which seemed to suggest they were morally less developed.

## Two moral orientations
- Ethic of justice: morality as fairness, rules, rights and impartial principles; typical of Kohlberg's account.
- Ethic of care: morality as responsibility, compassion and maintaining relationships, attending to the needs of particular people in context.
In the Heinz dilemma, a care-oriented 11-year-old girl, Amy, suggested Heinz should talk with the druggist or borrow money, because stealing might send him to jail and harm his wife; Kohlberg's scoring would rate this lower than a justice-based answer.

## Levels of care
From interviews with women considering abortion, Gilligan proposed:
- Orientation to individual survival (caring for oneself).
- Goodness as self-sacrifice (caring for others at one's own expense).
- Morality of non-violence (balancing care for oneself and others).

## Evidence and evaluation
- Lawrence Walker's meta-analysis found few gender differences in Kohlberg scores when education was controlled, and both men and women use care and justice reasoning depending on the dilemma, with real-life relationship dilemmas eliciting more care reasoning in everyone.
- Gilligan's own samples were small and her methods qualitative.
- Her work broadened moral psychology to include emotion, relationships and context, and influenced feminist ethics and nursing ethics. Care-based morality fits many collectivist cultures, including Indian emphasis on duty to family.`,
    keyPoints: ["Gilligan's critique of all-male sample", "Justice versus care orientations", "Amy example", "Three levels of care", "Walker's evidence", "Contribution and cultural relevance"],
    module: "lifespan/2-5",
    visuals: [
      { kind: "compare", caption: "Two moral orientations", data: { title: "Two voices in moral reasoning", a: { label: "Justice", points: ["Rights and rules", "Impartial and abstract", "What is fair?"], summary: "Kohlberg's focus." }, b: { label: "Care", points: ["Relationships and responsibility", "Context and particular people", "Who will be hurt?"], summary: "Gilligan's addition." } } },
    ],
    ref: "Gilligan 1982; Walker 1984 and 1991; Jaffee and Hyde 2000 meta-analysis",
  },
];
