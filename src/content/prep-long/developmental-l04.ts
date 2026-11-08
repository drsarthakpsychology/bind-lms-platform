import type { LongQA } from "@/lib/prep/long-types";
import { anchored, brain, chain, compare, cycle, layers, timeline, vis } from "./visual";

const S = "developmental" as const;

export const DEVELOPMENTAL_L04: LongQA[] = anchored([
  {
    id: "dev-l04-031",
    subject: S,
    topic: "adolescence",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Describe the physical and brain changes of adolescence. How does the dual systems model explain adolescent risk taking, and what are its limitations and practical implications?",
    plan: ["Define adolescence as beginning in biology and ending in culture", "Puberty: hormones, sequence, secular trend and timing effects", "Brain changes: pruning, myelination, reward system and prefrontal cortex", "Dual systems model with the peer driving study", "Limitations of the model", "Implications for law, health and parenting in India"],
    answer: `## Adolescence: biology and culture
Adolescence is the period between childhood and adulthood, roughly 10 to 19 years by the World Health Organization definition. It begins in biology, with puberty, and ends in culture, when a society treats a person as an adult. In India, about a fifth of the population is in this age band, so the science of adolescence has direct consequences for schools, health services and law.

## Puberty
- Hormones: the hypothalamus releases gonadotropin releasing hormone, the pituitary releases luteinising and follicle stimulating hormones, and the gonads release oestrogens and androgens. This hypothalamic pituitary gonadal axis drives the growth spurt and sexual maturation.
- Sequence: in girls, breast budding usually comes first and menarche comes late in the sequence; in boys, testicular growth comes first and the growth spurt comes about two years later than in girls.
- Secular trend: over the last century, puberty has started earlier in many countries, linked to better nutrition and, more recently, to higher childhood body weight.
- Timing: early maturing girls show more depression, eating problems, substance use and early sexual activity, partly because they are treated as older and mix with older peers. Early maturing boys gain status in the short term but take more risks; late maturing boys may feel less confident.

## The adolescent brain
- Synaptic pruning: grey matter in the cortex thins as unused connections are removed, making circuits more efficient.
- Myelination: white matter increases, speeding communication between regions, especially between the frontal lobes and the rest of the brain.
- Reward system: the ventral striatum and related dopamine pathways become highly responsive around puberty, so rewards, novelty and social approval feel especially strong.
- Prefrontal cortex: the region for planning, inhibition and weighing long term consequences keeps maturing into the mid twenties.

## The dual systems model
Laurence Steinberg and others proposed that risk taking peaks in adolescence because two systems mature on different timetables. The socioemotional or reward system surges early in puberty, while the cognitive control system matures slowly and steadily. In the gap between them, the accelerator is strong and the brake is still being built.

The key evidence comes from a driving video game in which players decided whether to stop at amber lights. When two friends watched, adolescents took roughly twice as many risks as when alone, young adults were affected a little, and adults hardly at all. Later imaging showed stronger reward system activity in teenagers when peers were watching. The model also separates hot cognition, decisions made in emotional, aroused, social situations, from cold cognition, calm and unhurried reasoning. In cold conditions, adolescents of 16 reason about risk almost as well as adults.

## Limitations
- Not all adolescents are risk takers; temperament, family warmth, culture and opportunity create large individual differences.
- Some research suggests adolescents are more tolerant of unknown or ambiguous risks rather than attracted to danger as such, which can be adaptive for exploring and learning.
- Brain imaging findings are averages over groups and cannot predict one young person's behaviour.
- Risk taking also reflects environments: access to alcohol, motorbikes or unsafe roads.
- The model is better at explaining when risk rises than at explaining positive risks, such as trying a new sport or standing up for a friend.

## Practical implications
- Road safety: graduated licensing that limits teenage passengers follows directly from the peer effect. Road traffic injuries are a leading cause of death for young people.
- Law: India's Juvenile Justice (Care and Protection of Children) Act of 2015 allows a 16 to 18 year old accused of a heinous offence to undergo a preliminary assessment of mental capacity and maturity before possibly being tried as an adult. The dual systems research is central to the debate on whether this is fair.
- Health: the Rashtriya Kishor Swasthya Karyakram, launched in 2014, uses trained peer educators for nutrition, sexual health, substance use, injuries and mental health, turning peer influence into a protective force.
- Parenting and schools: reduce hot, unsupervised peer situations, practise decisions in advance, and give teenagers safe outlets for novelty and status.

## Conclusion
Adolescence brings a rapid rise in reward sensitivity and a slower maturation of self control. The dual systems model explains why risk rises when emotions run high and peers are present, but it describes tendencies, not destiny, and it should guide supportive environments rather than excuse or condemn young people.`,
    keyPoints: ["Puberty through the hypothalamic pituitary gonadal axis, with sequence and secular trend", "Effects of early and late maturation, especially for girls", "Pruning, myelination, early reward surge, late prefrontal maturation", "Dual systems model stated clearly", "Peer driving study and hot versus cold cognition", "At least three limitations", "Indian implications such as the Juvenile Justice Act 2015 and RKSK"],
    pitfalls: ["Saying the teenage brain is simply immature without naming which systems mature when", "Presenting brain findings as an excuse for all adolescent behaviour", "Leaving out the role of peers, which is the central experimental finding"],
    module: "lifespan/3-1",
    visuals: [
      brain("The adolescent brain", {
        prefrontal: "The brake: planning, inhibition and weighing consequences. Keeps maturing into the mid twenties.",
        "basal-ganglia": "The accelerator: the ventral striatum responds strongly to reward and peer approval from early puberty.",
        amygdala: "Emotional alarm and salience, highly reactive in early adolescence.",
      }, "The adolescent brain: two systems on different timetables"),
      chain("The dual systems model", [["Puberty", "Hormones switch on reward sensitivity"], ["Strong accelerator", "Rewards, novelty and approval feel intense"], ["Weak brake", "Prefrontal control still maturing"], ["Peers watching", "Hot cognition amplifies the reward of risk"], ["Risk taking peaks", "Mid to late adolescence"]], "The dual systems model: why risk rises when peers watch"),
    ],
    ref: "Steinberg 2008 dual systems; Gardner and Steinberg 2005 driving game; Chein et al 2011 peers and ventral striatum; Casey maturational imbalance; Tymula et al 2012 ambiguity tolerance; JJ Act 2015 s15; RKSK 2014; lifespan module 3.1",
  },
  {
    id: "dev-l04-032",
    subject: S,
    topic: "adolescence",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg", "ugc-net"],
    question: "Write a short note on adolescent egocentrism.",
    plan: ["Define and link to formal operations", "Imaginary audience with example", "Personal fable with its forms", "Evidence and criticisms"],
    answer: `## Meaning
Adolescent egocentrism is David Elkind's term for a heightened self focus that appears in early adolescence. He linked it to Piaget's formal operational stage: once young people can think about thinking, they begin to think about what others think, but they fail to separate their own preoccupations from other people's. Because they are absorbed in their changing bodies and identities, they assume everyone else is absorbed in them too.

## Imaginary audience
The belief that one is constantly watched and judged, as if on a stage. A girl refuses to go to school because she is sure everyone will stare at a pimple; a boy rehearses for an hour what to say, imagining the whole canteen listening. It explains self consciousness, concern with appearance and intense embarrassment.

## Personal fable
The belief that one's experiences and feelings are unique ("nobody has ever loved like this", "you could never understand"). It has three common forms: uniqueness, invulnerability ("accidents happen to other people") and omnipotence. Invulnerability has been linked to risks such as riding without a helmet or unprotected sex.

## Evaluation
Elkind and Bowen developed an Imaginary Audience Scale, and self consciousness does peak in early adolescence. However, later work found that adolescents do not judge themselves less vulnerable than adults do, and that imaginary audience thinking appears in adults too. Daniel Lapsley reinterpreted both ideas as part of separation and individuation: imagining audiences helps young people rehearse relationships, and the fable protects a fragile new identity. The ideas remain useful for counselling, but they are tendencies, not thinking errors that every teenager shows.`,
    keyPoints: ["Elkind's term, linked to formal operations", "Failure to separate own concerns from others'", "Imaginary audience with an example", "Personal fable with uniqueness, invulnerability, omnipotence", "Link to risk and self consciousness", "Criticism and Lapsley's reinterpretation"],
    pitfalls: ["Confusing it with Piaget's preoperational egocentrism", "Calling it selfishness"],
    module: "lifespan/3-1",
    visuals: [
      vis("sort", {
        prompt: "Imaginary audience or personal fable?",
        buckets: ["Imaginary audience", "Personal fable"],
        items: [
          { text: "Ritika will not go to class because she is sure everyone will stare at her haircut", bucket: 0 },
          { text: "Aman rides without a helmet: accidents happen to other people", bucket: 1 },
          { text: "A boy thinks the whole class is still talking about one wrong answer he gave", bucket: 0 },
          { text: "A girl tells her mother she could never understand what she is going through", bucket: 1 },
        ],
      }, "Personal fable: sort the examples"),
    ],
    ref: "Elkind 1967 Egocentrism in adolescence; Elkind and Bowen 1979 Imaginary Audience Scale; Quadrel, Fischhoff and Davis 1993 adolescent invulnerability; Lapsley 1993 new look",
  },
  {
    id: "dev-l04-033",
    subject: S,
    topic: "adulthood",
    marks: 10,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "cuet-pg"],
    question: "What is emerging adulthood? Describe its features and discuss whether the concept applies to young people in India.",
    plan: ["Define and place Arnett's idea historically", "Five features with examples", "Criteria for adulthood", "Critiques", "Indian applicability with class, gender and family"],
    answer: `## The idea
Jeffrey Arnett proposed in 2000 that the years from about 18 to 25 form a distinct period, emerging adulthood, in industrialised societies. Longer education, later marriage and parenthood, and unstable job markets have stretched the gap between leaving adolescence and settling into adult roles. Emerging adults are no longer adolescents but do not yet see themselves as fully adult.

## Five features
1. Identity exploration: trying out possibilities in love and work, such as switching courses or testing relationships.
2. Instability: frequent changes of residence, job, course and partner.
3. Self focus: fewer obligations to parents, spouses or children than before or after, so more freedom to decide one's own path.
4. Feeling in between: most say they are adults in some ways but not in others.
5. Possibilities: optimism and a sense that life can still go many ways.

## What makes someone an adult
Young people in Western samples rank three individual criteria highest: accepting responsibility for oneself, making independent decisions and becoming financially independent. Traditional markers such as marriage rank low. In more family centred cultures, young people also stress capacities to support and care for the family and to control one's emotions.

## Criticisms
- It describes the privileged: young people who leave school early, start work or marry young may have little extended exploration.
- Critics argue it is a social and economic situation, not a developmental stage with its own psychological structure.
- The five features are measured by self report and overlap with adolescence and early adulthood.
- The concept was developed mainly with American samples.

## Does it apply in India?
Partly. Many urban, middle class Indians now study into their mid twenties, prepare for competitive examinations, migrate to cities for work and marry later, so they show exploration, instability and an in between feeling. But exploration often happens within family approval rather than in opposition to it: career and marriage choices are negotiated with parents, and an arranged or semi arranged marriage may be the expected outcome. For many rural young people, especially girls, the period hardly exists; in the fifth National Family Health Survey, about 23 percent of women aged 20 to 24 had married before 18. Gender, caste, class and region therefore decide who gets an emerging adulthood at all.

## Conclusion
Emerging adulthood is a useful description of a modern, extended transition, and it helps counsellors understand career indecision and relationship instability in college students. In India it is best seen as a pattern that fits some groups and not others, shaped by family interdependence.`,
    keyPoints: ["Arnett's definition and age range", "Social and economic reasons it emerged", "All five features with examples", "Individual and family criteria for adulthood", "At least two criticisms", "Indian applicability with family negotiation and early marriage data"],
    pitfalls: ["Treating it as universal", "Listing features without any critique", "Ignoring gender and class differences in India"],
    module: "lifespan/3-1",
    visuals: [
      layers("Five features", "stack", [
        ["Identity exploration", "Trying out love and work possibilities"],
        ["Instability", "Changes of course, city, job and partner"],
        ["Self focus", "Fewer duties to others than before or after"],
        ["Feeling in between", "Adult in some ways, not in others"],
        ["Possibilities", "Optimism that life can still go many ways"],
      ], "Five features of emerging adulthood"),
    ],
    ref: "Arnett 2000 American Psychologist; Arnett 2004 book; Nelson, Badger and Wu 2004 China; Seiter and Nelson 2011 India; Hendry and Kloep 2007 critique; NFHS-5 child marriage 23.3 percent",
  },
  {
    id: "dev-l04-034",
    subject: S,
    topic: "adulthood",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Describe Levinson's theory of adult development. Is the midlife crisis a universal phenomenon? Discuss with evidence.",
    plan: ["Levinson's method and the life structure", "Eras and transitions with ages", "Dream, mentor and midlife tasks", "Women's study", "Evidence on the midlife crisis", "Evaluation and Indian view of midlife"],
    answer: `## Levinson's method
Daniel Levinson interviewed 40 American men aged 35 to 45, ten each from four occupations: hourly workers, executives, academic biologists and novelists. Using long biographical interviews, he described adult life as a sequence of seasons. He later studied 45 women.

## The life structure
The central concept is the life structure: the underlying pattern of a person's life at a given time, built around relationships with work, family, friends, religion and community. Life alternates between stable periods of about six to seven years, when a structure is built, and transitional periods of about four to five years, when it is questioned and changed.

## Eras and transitions
- Early adult transition, about 17 to 22: leaving the family and making first choices.
- Entering the adult world, about 22 to 28: building a first adult structure.
- Age 30 transition, about 28 to 33: correcting the first structure.
- Settling down, about 33 to 40: establishing a niche and working towards advancement.
- Midlife transition, about 40 to 45: reappraising life.
- Entering middle adulthood and the age 50 transition, then culmination of middle adulthood, about 45 to 60.
- Late adult transition, about 60 to 65, into late adulthood.

## The Dream, the mentor and midlife
In early adulthood, the young man forms the Dream, a vision of his adult future, and often finds a mentor, a slightly older guide who supports it. In the late thirties comes becoming one's own man, freeing oneself from the mentor. At midlife the Dream is set against reality, mortality becomes personal, and the man works through four polarities: young versus old, destruction versus creation, masculine versus feminine, and attachment versus separateness. Levinson reported that about 80 percent of his men experienced the midlife transition as a moderate or severe crisis.

## Women's seasons
Levinson's women passed through similar age linked periods, but many had a split Dream divided between career and family, and their transitions were often more conflicted because of gender roles.

## Is the midlife crisis universal?
The evidence says no.
- In a large American survey of midlife, about a quarter of adults said they had had a midlife crisis, but when a strict definition was applied, turmoil caused by realising one is ageing rather than by an outside event, only about one in ten qualified.
- Many reported crises were really stressful events such as divorce, job loss or illness, which can happen at any age.
- Personality is stable across midlife; neuroticism tends to fall rather than rise, and people high in neuroticism report crises at every age.
- Large surveys suggest a shallow U shaped curve of life satisfaction with a dip around the late forties, but longitudinal studies find little or no dip after controls, so the pattern is debated.
- Midlife brings reappraisal for many people, and for some a turning point, but dramatic crisis is the exception.

## Evaluation
Strengths: rich, detailed biographies; a focus on adulthood as a time of change rather than a plateau; useful concepts such as the Dream and the mentor. Limitations: a tiny, non random, all American and mostly middle class sample from one birth cohort; rigid ages that are not confirmed in larger studies; and an assumption of near universal crisis that later data reject. Life course researchers prefer flexible ideas such as Bernice Neugarten's social clock, being on time or off time for events like marriage.

## An Indian view
In India, midlife is often shaped by the grihastha stage, raising children and caring for ageing parents at once, the sandwich generation, with women carrying most unpaid care. Concern about children's examinations and marriages and about parents' health may be more prominent than a personal search for meaning.

## Conclusion
Levinson described adulthood as an alternation of building and questioning life structures. The concepts remain useful for counselling, but the midlife crisis is not universal; most people reappraise rather than collapse.`,
    keyPoints: ["Method and sample of 40 men in four occupations", "Life structure with stable and transitional periods", "Main eras and transitions with ages", "Dream, mentor and four midlife polarities", "Split Dream in women", "Evidence that a strict midlife crisis affects about one in ten", "Evaluation and Indian context"],
    pitfalls: ["Presenting the midlife crisis as an established fact", "Giving the ages without the life structure concept", "Forgetting the sample's limitations"],
    module: "lifespan/3-2",
    visuals: [
      { ...timeline("Put Levinson's periods in order.", [["Early adult transition", "17 to 22"], ["Entering the adult world", "22 to 28"], ["Age 30 transition", "28 to 33"], ["Settling down", "33 to 40"], ["Midlife transition", "40 to 45"], ["Culmination of middle adulthood", "55 to 60"]], "Stable periods build a life structure; transitions question it."), caption: "Eras and transitions" },
      vis("guess", { prompt: "About a quarter of middle aged Americans said they had had a midlife crisis. Using a strict definition, roughly what percentage really had one?", min: 0, max: 50, unit: "%", answer: [8, 12], reveal: "About one in ten. Many reported crises were stressful events such as job loss or divorce that can happen at any age." }, "Is the midlife crisis universal?"),
    ],
    ref: "Levinson 1978 Seasons of a Man's Life; Levinson 1996 Seasons of a Woman's Life; Wethington 2000 MIDUS midlife crisis; Blanchflower and Oswald 2008 U curve; Neugarten social clock; lifespan module 3.2",
  },
  {
    id: "dev-l04-035",
    subject: S,
    topic: "adulthood",
    marks: 10,
    difficulty: 4,
    exams: ["ma-semester", "mcp-entrance", "md-psychiatry"],
    question: "Discuss George Vaillant's contribution to the study of adult development, with reference to the Harvard Study of Adult Development and the maturation of defences.",
    plan: ["Describe the study and its samples", "Vaillant's hierarchy of defences", "Maturation of defences over life", "Key findings on health and relationships", "His additions to Erikson", "Evaluation"],
    answer: `## The Harvard Study of Adult Development
The study began in 1938 as the Grant Study, following 268 healthy Harvard sophomores chosen as promising young men. A second sample of 456 inner city Boston men, first studied as teenagers by Sheldon and Eleanor Glueck, was later added. Participants were examined physically and psychologically, interviewed and sent questionnaires every few years for over 75 years. George Vaillant, a psychiatrist, directed the study for about three decades and wrote it up in works on adaptation to life and ageing well. It is one of the longest prospective studies of adult life.

## A hierarchy of defences
Vaillant used the life histories to rate defence mechanisms, the unconscious ways people handle conflict and distress, and arranged them in four levels:
| Level | Examples |
| Psychotic | Delusional projection, distortion, psychotic denial |
| Immature | Projection, passive aggression, acting out, fantasy, hypochondriasis |
| Neurotic | Repression, displacement, reaction formation, intellectualisation |
| Mature | Sublimation, altruism, suppression, humour, anticipation |

## Defences mature
Vaillant's key developmental claim is that defences mature across adult life, much as Piaget showed that thinking matures in childhood. Between adolescence and midlife, many men moved from immature defences such as acting out and projection towards mature ones such as altruism, humour and suppression. Defences are therefore not fixed traits but adaptive styles that can grow.

## What predicted a good life
- Men using mature defences at midlife had better physical health, marriages, income and life satisfaction decades later.
- Alcohol misuse was a leading cause of poor health, divorce and early death.
- Warmth of relationships, in childhood and especially in adulthood, predicted happiness and healthy ageing more strongly than social class, income or cholesterol at 50. Vaillant summed up the findings by saying that happiness is love.
- A poor childhood did not doom a person; many recovered through later relationships.

## Additions to Erikson
Vaillant added two tasks to Erikson's sequence: career consolidation, between intimacy and generativity, when one becomes committed and skilled at work; and keeper of the meaning, between generativity and integrity, when one guards the culture and values of one's group for the next generation.

## Evaluation
Strengths: a prospective design that avoids memory bias, very long follow up, rich data and a bridge between psychoanalytic ideas and empirical research. Limitations: the original sample was white, male and privileged; ratings of defences involve judgement; and correlations cannot prove that defences cause health. Women were studied separately in other cohorts. The current director, Robert Waldinger, has extended the work to participants' children.

## Conclusion
Vaillant showed that adults keep developing, that adaptive defences mature, and that close relationships matter most for a healthy old age, findings that inform psychotherapy and the planning of mental health services for older adults.`,
    keyPoints: ["Grant sample of 268 Harvard men and the Glueck inner city sample", "Prospective design over 75 years", "Four level defence hierarchy with examples", "Maturation of defences in adulthood", "Findings on relationships, alcohol and mature defences", "Career consolidation and keeper of the meaning", "Strengths and sampling limits"],
    pitfalls: ["Listing defences without the developmental claim", "Overstating causation from an observational study"],
    module: "lifespan/3-2",
    visuals: [
      layers("A hierarchy of defences", "pyramid", [
        ["Mature", "Sublimation, altruism, suppression, humour, anticipation"],
        ["Neurotic", "Repression, displacement, reaction formation, intellectualisation"],
        ["Immature", "Projection, passive aggression, acting out, fantasy"],
        ["Psychotic", "Delusional projection, distortion, psychotic denial"],
      ], "A hierarchy of defences: Vaillant's four levels"),
    ],
    ref: "Vaillant 1977 Adaptation to Life; Vaillant 2002 Aging Well; Vaillant 2012 Triumphs of Experience; Glueck and Glueck inner city sample; Waldinger and Schulz 2023",
  },
  {
    id: "dev-l04-036",
    subject: S,
    topic: "ageing",
    marks: 20,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Critically discuss the psychosocial theories of ageing, including disengagement, activity, continuity and socioemotional selectivity theories, and models of successful ageing. How do they apply to older adults in India?",
    plan: ["Introduce ageing as gains and losses", "Disengagement, activity and continuity theories with critique", "Socioemotional selectivity theory and the positivity effect", "Successful ageing: Rowe and Kahn, SOC, Erikson, life review, gerotranscendence", "Indian context: demography, family, law and the ashramas", "Conclusion"],
    answer: `## Introduction
Old age was long seen only as decline. Psychosocial theories ask a different question: what makes some older people satisfied, engaged and well while others become withdrawn or depressed? The answers have shaped retirement policy, family care and clinical work with older adults.

## Disengagement theory
Elaine Cumming and William Henry, from a study of older adults in Kansas City published in 1961, proposed that ageing involves a natural, mutual and inevitable withdrawal: the older person turns inward and lets go of roles, and society releases them to make room for the young. They saw this as good for both.
Critique: many older people do not want to withdraw; withdrawal is often forced by retirement rules, illness, poverty or loss of a spouse; and disengaged older adults are often less, not more, satisfied. The theory risked justifying neglect.

## Activity theory
Robert Havighurst and colleagues argued the opposite: older people stay satisfied by remaining active, keeping roles and replacing lost ones, for example volunteering after retirement.
Critique: the quantity of activity matters less than its meaning and fit; some people prefer quiet, and pushing activity can ignore health limits and personality.

## Continuity theory
Robert Atchley proposed that people age well by keeping continuity with their past: their habits, values, relationships and ways of coping. A lifelong reader continues reading; a sociable person keeps a smaller but similar network.
Critique: it fits much of the data, but it is less helpful when continuity is impossible, as after widowhood, migration of children or disability, and it can be hard to test.

## Socioemotional selectivity theory
Laura Carstensen argued that perceived time left shapes goals. When the future feels open ended, people pursue knowledge and new contacts. When time feels limited, as in old age, or in young people with a serious illness, they prioritise emotionally meaningful goals and close ties, and prune peripheral contacts. This explains why older adults have smaller but closer networks without being less happy. It also predicts the positivity effect: compared with young adults, older adults attend to and remember positive information more than negative. Contrary to stereotypes, average emotional well being is stable or improves into the seventies.
Strength: it reinterprets what disengagement theory saw as withdrawal as active, adaptive selection.

## Models of successful ageing
- Rowe and Kahn's model: successful ageing needs low probability of disease and disability, high cognitive and physical functioning, and active engagement with life. Critics note that by these criteria only a small minority succeed, and that the model can blame individuals for illness shaped by genes and poverty.
- Selection, optimisation and compensation: Paul and Margret Baltes proposed that people age well by selecting fewer, important goals, optimising their resources for them, and compensating for losses with new means. The pianist Arthur Rubinstein, in his eighties, played fewer pieces, practised them more and slowed before fast passages so they sounded faster.
- Erikson's integrity versus despair: accepting one's one and only life as it was; despair brings regret and fear of death.
- Robert Butler's life review: a natural process of looking back, resolving old conflicts and finding meaning; reminiscence and life review therapy reduce depressive symptoms. Butler also coined the term ageism.
- Gerotranscendence: Lars Tornstam described a shift towards a cosmic, less self centred outlook and comfort with solitude.
- Subjective models: many older adults with chronic illness say they are ageing well, so well being, meaning and adaptation are now included.

## Application to India
- Demography: India's population aged 60 and above was about 10 percent in 2022 and is projected to reach about 20 percent by 2050, around 350 million people. Older women are more likely to be widowed, without income and dependent.
- Family: joint families are changing with migration and urbanisation, and many older people now live alone or only with a spouse. Activity and continuity are threatened when children move away.
- The ashramas: the classical stages of vanaprastha and sannyasa describe a gradual, chosen withdrawal towards spiritual life. This resembles disengagement and gerotranscendence, but as a valued, culturally meaningful path rather than social rejection.
- Law and services: the Maintenance and Welfare of Parents and Senior Citizens Act of 2007 allows parents and senior citizens to claim maintenance from children through tribunals, and the National Programme for Health Care of the Elderly, started in 2010, builds geriatric care into the health system.
- Practice: day care centres, senior citizens' associations and grandparenting roles support activity and continuity; religious practice and pilgrimage often provide meaning in the way socioemotional selectivity predicts.

## Evaluation
No single theory fits all older people. Disengagement and activity theories are best seen as two ends of a continuum, with continuity theory explaining why individuals differ. Socioemotional selectivity and SOC are the strongest current models because they are testable and explain how people actively adapt. All need adjustment for poverty, gender and culture.

## Conclusion
Ageing well is less about how busy one is and more about fit: keeping what matters, choosing meaningful goals and compensating for losses within a supportive family and society.`,
    keyPoints: ["Disengagement theory with its origin and critique", "Activity and continuity theories with critique", "Socioemotional selectivity with the positivity effect", "Rowe and Kahn's three components and criticism", "SOC with the Rubinstein example", "Erikson, life review and gerotranscendence", "Indian demography, family change, ashramas, Senior Citizens Act and NPHCE", "Balanced evaluation"],
    pitfalls: ["Describing theories with no critique", "Ignoring culture and poverty", "Confusing socioemotional selectivity with disengagement"],
    module: "lifespan/3-4",
    visuals: [
      compare(
        "Socioemotional selectivity theory: time left changes goals",
        ["Time feels open ended", ["Goal: knowledge and new experiences", "Large, wide networks", "Willing to meet many new people"], "With time to spare, people invest in the future"],
        ["Time feels limited", ["Goal: emotional meaning now", "Smaller networks of close ties", "Prune shallow contacts"], "With time short, people invest in what matters most"],
      ),
      chain("Models of successful ageing: SOC in action", [["Selection", "Rubinstein plays fewer pieces"], ["Optimisation", "Practises those pieces more"], ["Compensation", "Slows before fast passages so they seem faster"]], "Models of successful ageing: selection, optimisation and compensation"),
    ],
    ref: "Cumming and Henry 1961; Havighurst activity theory; Atchley 1989 continuity; Carstensen 1999 SST; Mather and Carstensen 2005 positivity effect; Rowe and Kahn 1997; Baltes and Baltes 1990 SOC; Butler 1963; Tornstam 1997; UNFPA India Ageing Report 2023; MWPSC Act 2007; NPHCE 2010",
  },
  {
    id: "dev-l04-037",
    subject: S,
    topic: "cognitive-ageing",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "md-psychiatry", "mcp-entrance"],
    question: "Discuss the changes in intelligence and memory that occur with normal ageing. What explains these changes, and how can normal ageing be distinguished from dementia?",
    plan: ["Fluid and crystallised intelligence", "Cross sectional versus longitudinal findings: Schaie", "Memory systems that decline and those that hold up", "Explanations: speed, inhibition, brain changes, reserve", "Wisdom and gains", "Normal ageing versus dementia, with Indian data"],
    answer: `## Two kinds of intelligence
Raymond Cattell and John Horn separated fluid intelligence, the ability to reason and solve new problems quickly, from crystallised intelligence, the store of knowledge, vocabulary and skills built from experience. Fluid abilities peak in the twenties and decline gradually; crystallised abilities stay stable or rise until the sixties or seventies. An older teacher may be slower at a new puzzle but far better at explaining an idea.

## How the decline was overestimated
Early cross sectional studies compared young and old people at one time and found steep decline from early adulthood. But older cohorts had less schooling and poorer nutrition, so cohort differences were mistaken for ageing. K. Warner Schaie's Seattle Longitudinal Study, begun in 1956, used a sequential design, following several cohorts over time. It found that most abilities show no reliable decline until about the early sixties, that decline in the seventies is usually limited to some abilities rather than all, and that later born cohorts score higher than earlier ones at the same age. Large individual differences exist: health, education, a complex job and an engaged lifestyle predict maintained ability.

## Memory
- Working memory, holding and manipulating information, declines clearly.
- Episodic memory for specific new events declines most, especially free recall; recognition holds up better.
- Semantic memory, facts and word meanings, is well preserved.
- Procedural memory for skills such as cycling or cooking is preserved.
- Prospective memory, remembering to do things, declines in laboratory tasks but less in daily life, where older adults use routines and reminders.
- Tip of the tongue states for names become more frequent.
- Source memory, remembering where one learnt something, declines, which can make older adults vulnerable to scams.

## Explanations
- Processing speed: Timothy Salthouse argued that a general slowing of processing explains much of the decline in other abilities.
- Inhibitory deficit: Lynn Hasher and Rose Zacks proposed that older adults are less able to block irrelevant information, which clutters working memory.
- Reduced resources: encoding and self initiated strategies take effort, so environmental support such as cues helps older adults more.
- Brain changes: the prefrontal cortex and the hippocampus shrink more than most regions, white matter integrity falls and dopamine declines. Older adults often recruit both hemispheres for tasks young adults do with one, which may be compensation.
- Cognitive reserve: education, mentally demanding work, bilingualism and social engagement allow the brain to tolerate more change before symptoms appear. In the Nun Study, the richness of ideas in autobiographies written in young adulthood predicted Alzheimer's disease about six decades later.

## Gains with age
Paul Baltes's Berlin group studied wisdom, expert knowledge about the conduct and meaning of life, judged by factual knowledge, procedural knowledge, lifespan contextualism, value relativism and managing uncertainty. Wisdom does not rise automatically with age, but many of the wisest people are older. Expertise and emotional regulation also improve.

## Normal ageing or dementia?
| Feature | Normal ageing | Dementia |
| Memory | Forgets a name, recalls it later | Forgets recent events and does not recall them |
| Daily life | Independent | Needs help with complex, then basic tasks |
| Insight | Usually worries about forgetting | Often reduced |
| Course | Stable or very slow | Usually progressive |
Mild neurocognitive disorder lies between them: a noticeable decline with independence preserved. Before diagnosing dementia, rule out depression, which can mimic it, hearing and vision loss, medicines with anticholinergic effects, thyroid and vitamin B12 problems and delirium. In India, the dementia sub study of the Longitudinal Ageing Study in India estimated prevalence at about 7 percent of people aged 60 and above. An international commission in 2024 estimated that about 45 percent of dementia might be prevented or delayed by tackling 14 risk factors, including less education, hearing loss, hypertension, diabetes, smoking, inactivity, depression, social isolation and air pollution.

## Conclusion
Normal ageing brings slower processing and weaker working and episodic memory, but knowledge, skills and wisdom are maintained. Decline is later, smaller and more variable than once believed, and a healthy, engaged life builds reserve against it.`,
    keyPoints: ["Fluid versus crystallised intelligence across age", "Cross sectional bias and Schaie's sequential findings", "Which memory systems decline and which hold up", "Processing speed and inhibitory deficit explanations", "Brain changes and cognitive reserve with the Nun Study", "Wisdom as a gain", "Normal ageing versus dementia table with exclusions", "Indian prevalence data"],
    pitfalls: ["Saying all intelligence declines from the twenties", "Ignoring cohort effects", "Calling every memory complaint dementia"],
    module: "lifespan/3-3",
    visuals: [
      brain("Explanations: where normal ageing shows in the brain", {
        prefrontal: "Shrinks more than most regions, matching declines in working memory and executive control.",
        hippocampus: "Forms new episodic memories; shrinks slowly in normal ageing and much faster in Alzheimer's disease.",
      }),
      compare(
        "Normal ageing or dementia?",
        ["Normal ageing", ["Forgets a name, then recalls it later", "Slower to learn but learns", "Manages money and travel alone", "Stable or very slow change"], "Slower, not lost"],
        ["Dementia", ["Forgets recent events entirely", "Repeats questions within minutes", "Needs help with daily tasks", "Usually progressive"], "Decline that disrupts independence"],
      ),
    ],
    ref: "Horn and Cattell 1967; Schaie Seattle Longitudinal Study; Salthouse 1996 processing speed; Hasher and Zacks 1988; Cabeza 2002 HAROLD; Stern cognitive reserve; Snowdon Nun Study 1996; Baltes and Staudinger 2000 wisdom; LASI-DAD 2023 prevalence 7.4 percent; Livingston et al 2024 dementia commission",
  },
  {
    id: "dev-l04-038",
    subject: S,
    topic: "ageing",
    marks: 10,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "cuet-pg"],
    question: "Why do we age? Describe the biological theories of ageing and the distinction between primary, secondary and tertiary ageing.",
    plan: ["Primary, secondary and tertiary ageing", "Programmed theories: Hayflick limit, telomeres, endocrine and immune", "Damage theories: wear and tear, free radicals, cross linking", "Evolutionary explanations", "Psychological links and implications"],
    answer: `## Three kinds of ageing
- Primary ageing: gradual, universal changes that happen even in healthy people, such as greying hair, presbyopia and slower reaction time.
- Secondary ageing: changes caused by disease, lifestyle and environment, such as smoking, diabetes or air pollution. It is partly preventable.
- Tertiary ageing: the rapid decline in physical and mental function in the period before death, also called terminal decline.

## Programmed theories
These theories say ageing follows a biological timetable.
- Cellular clock: Leonard Hayflick found that normal human cells grown in culture divide only a limited number of times, about 40 to 60, before stopping. This is the Hayflick limit.
- Telomere shortening: telomeres are protective caps at the ends of chromosomes that shorten with each cell division. When they become too short, the cell stops dividing. The enzyme telomerase can rebuild them; its discovery earned Elizabeth Blackburn, Carol Greider and Jack Szostak the Nobel Prize in 2009.
- Endocrine theory: hormonal changes such as menopause and falls in growth hormone are timed by the body and drive ageing.
- Immunological theory: the immune system weakens with age, called immunosenescence, increasing infection, cancer and inflammation.

## Damage theories
These theories say ageing is the accumulated result of random damage.
- Wear and tear: the body's parts wear out with use, like a machine.
- Free radicals: unstable oxygen molecules produced during metabolism damage DNA, proteins and cell membranes; Denham Harman proposed this idea in 1956.
- Cross linking: proteins such as collagen bind together, stiffening skin, joints and arteries.
- DNA damage and mutation: errors in DNA build up faster than they can be repaired.

## Evolutionary explanations
Natural selection weakens after the reproductive years, so harmful genes that act late in life are not removed (mutation accumulation). Some genes help early survival but harm later life (antagonistic pleiotropy). The disposable soma idea says the body invests energy in reproduction rather than in endless repair.

## Psychology and ageing biology
Stress links mind and cell. Mothers caring for a chronically ill child who reported the highest stress had telomeres as short as those of women about ten years older. Exercise, sleep, social connection and treatment of depression are associated with healthier ageing markers.

## Evaluation
No single theory explains ageing; programmed and damage processes interact. Most evidence comes from cells and animals, and anti ageing claims based on these theories often run ahead of the data.

## Conclusion
Ageing combines a built in biological timetable with accumulating damage, and the line between primary and secondary ageing shows how much healthy living can still change.`,
    keyPoints: ["Primary, secondary and tertiary ageing defined", "Hayflick limit with numbers", "Telomeres and telomerase", "Endocrine and immune theories", "Free radical, wear and tear and cross linking theories", "Evolutionary explanations", "Stress and telomere link with caution"],
    pitfalls: ["Listing theories without grouping them as programmed or damage", "Presenting anti ageing claims as proven"],
    module: "lifespan/3-3",
    visuals: [
      compare(
        "Programmed theories versus damage theories",
        ["Programmed theories", ["Hayflick limit: 40 to 60 divisions", "Telomeres shorten each division", "Hormonal timetable", "Immune system weakens"], "Ageing follows a built in clock"],
        ["Damage theories", ["Wear and tear", "Free radicals harm DNA and membranes", "Cross linking stiffens tissue", "DNA errors build up"], "Ageing is accumulated random damage"],
      ),
    ],
    ref: "Hayflick and Moorhead 1961; Blackburn, Greider, Szostak Nobel 2009; Harman 1956 free radicals; Medawar, Williams 1957, Kirkwood 1977 evolutionary theories; Epel et al 2004 PNAS caregiving stress and telomeres",
  },
  {
    id: "dev-l04-039",
    subject: S,
    topic: "death-grief",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance", "md-psychiatry"],
    question: "Critically evaluate Kubler-Ross's stage theory of dying. Describe later models of grief, including the tasks of mourning, the dual process model and continuing bonds, and the concept of prolonged grief.",
    plan: ["Define bereavement, grief and mourning", "Kubler-Ross's five stages", "Critique with research evidence", "Phases, Worden's tasks, dual process model, continuing bonds", "Trajectories and prolonged grief disorder", "Indian rituals and care"],
    answer: `## Key terms
Bereavement is the objective fact of losing someone. Grief is the emotional, cognitive and bodily response to that loss. Mourning is the culturally shaped way grief is expressed, through rituals such as the thirteen day period and shraddha in many Hindu families, the janazah prayer and mourning period among Muslims, and funerals and memorial services among Christians.

## Kubler-Ross's five stages
Elisabeth Kubler-Ross, a psychiatrist, interviewed about 200 terminally ill patients and in 1969 described five reactions to dying:
1. Denial: "This cannot be happening to me."
2. Anger: "Why me?", often directed at doctors and family.
3. Bargaining: attempts to postpone death, such as promises to God.
4. Depression: sadness about losses already suffered and those to come.
5. Acceptance: a calm, often tired, coming to terms.
Her work brought dying patients' voices into medicine and helped start the hospice and palliative care movement.

## Critique
- The stages were based on unsystematic clinical impressions, not measurement.
- Research does not find a fixed sequence; people skip stages, move back and forth or feel several reactions at once. Kubler-Ross herself said the stages were not meant to be linear.
- In a large study of bereaved people, acceptance was the strongest reaction from the start and rose over time, while yearning, not depression, was the most common negative feeling.
- The model was extended without evidence from dying patients to bereavement and to almost any loss.
- Used as a checklist, it can harm, for example telling a person they are stuck in anger or should reach acceptance.

## Later models of grief
- Phases: John Bowlby and Colin Murray Parkes described numbness, yearning and searching, disorganisation and despair, and reorganisation, rooted in attachment theory.
- Worden's tasks of mourning: accept the reality of the loss; process the pain of grief; adjust to a world without the deceased; and find an enduring connection with the deceased while embarking on a new life. Tasks make the mourner active rather than passive.
- Dual process model: Margaret Stroebe and Henk Schut proposed that healthy grieving oscillates between loss oriented coping, such as crying, looking at photographs and yearning, and restoration oriented coping, such as new roles, managing finances, distraction and new relationships. Time out from grief is healthy; getting stuck on only one side causes problems.
- Continuing bonds: Dennis Klass and colleagues argued that healthy grief often keeps a bond with the dead rather than letting go, such as talking to them, keeping their belongings or honouring them in rituals. This fits Indian practices such as annual remembrance rites for ancestors.

## Trajectories and prolonged grief
George Bonanno's studies of older adults followed from before a spouse's death found that the largest group, close to half, showed resilience with little lasting rise in depression; smaller groups showed common grief that eased over months, chronic grief, or improvement after the end of long caregiving. Resilience is the most common response to loss, so routine grief counselling for everyone is not recommended.
Prolonged grief disorder is now a diagnosis in both systems. In ICD-11 it requires a persistent, pervasive grief response, with longing for or preoccupation with the deceased and intense emotional pain, lasting at least six months after the loss and clearly exceeding cultural norms. DSM-5-TR requires at least 12 months in adults and six months in children, with at least three further symptoms such as identity disruption, disbelief, avoidance of reminders, numbness, meaninglessness or loneliness. Risk is higher after sudden or violent deaths, the death of a child, suicide and dependent relationships.

## Indian context
Collective rituals give structure to mourning and mobilise family support, but they can also burden widows with restrictions. Suicide bereavement carries strong stigma. Kerala's community palliative care network, built on trained local volunteers, supports both dying patients and their families.

## Conclusion
Kubler-Ross humanised dying but described reactions, not stages. Current models see grief as active, oscillating and often resilient, with continuing bonds normal, and reserve treatment for prolonged, impairing grief.`,
    keyPoints: ["Bereavement, grief and mourning distinguished", "Five stages with brief examples", "At least three evidence based criticisms", "Bowlby and Parkes phases", "Worden's four tasks", "Dual process model with oscillation", "Continuing bonds and resilience trajectories", "Prolonged grief criteria in ICD-11 and DSM-5-TR"],
    pitfalls: ["Presenting the five stages as a fixed sequence", "Treating all grief as needing counselling", "Mixing up the time criteria of ICD-11 and DSM-5-TR"],
    module: "lifespan/3-5",
    visuals: [
      chain("Kubler-Ross's five stages", [["Denial", "This cannot be happening"], ["Anger", "Why me?"], ["Bargaining", "Promises to postpone death"], ["Depression", "Sadness at losses"], ["Acceptance", "Coming to terms"]], "Kubler-Ross's five stages: common reactions, not fixed steps"),
      cycle("Later models of grief: the dual process model", [["Loss oriented coping", "Crying, photographs, yearning"], ["Time out from grief", "A break is healthy"], ["Restoration oriented coping", "New roles, tasks, relationships"], ["A reminder", "Grief returns, and the cycle continues"]]),
    ],
    ref: "Kubler-Ross 1969 On Death and Dying; Maciejewski et al 2007 JAMA Yale Bereavement Study; Parkes and Bowlby phases; Worden Grief Counseling tasks; Stroebe and Schut 1999 dual process; Klass, Silverman and Nickman 1996; Bonanno et al 2002 trajectories; ICD-11 6B42; DSM-5-TR prolonged grief disorder; lifespan module 3.5",
  },
  {
    id: "dev-l04-040",
    subject: S,
    topic: "death-grief",
    marks: 5,
    difficulty: 3,
    exams: ["ma-semester", "mcp-entrance", "cuet-pg"],
    question: "Write a short note on the development of children's understanding of death.",
    plan: ["Four components of a mature concept", "Age and stage findings", "Link to cognitive development", "How to talk to children about death"],
    answer: `## Four components
Research shows that a mature concept of death has four parts, which most children grasp between about 5 and 7 years:
1. Irreversibility: the dead do not come back to life.
2. Universality: all living things die, including oneself and one's parents.
3. Non functionality: the dead do not breathe, eat, feel or think.
4. Causality: death has real physical causes, such as illness or injury.

## How understanding develops
Maria Nagy, studying Hungarian children, described three phases: under about 5, death is seen as a departure or sleep, reversible and temporary; from about 5 to 9, death is often personified, as a person who comes to take people away; after about 9, death is understood as final, universal and internal to the body. Later reviews place the main shift earlier, at 5 to 7, and show that children who have experienced a death in the family, or who are given clear explanations, understand earlier. Young children may also believe that bad thoughts or naughtiness caused a death, which can produce guilt.

## Link to cognition
These changes follow the move from preoperational to concrete operational thought: understanding irreversibility and biological causes needs reversible, logical reasoning and a basic theory of how bodies work.

## Talking with children
Explain death honestly and simply ("Nani's body stopped working; she will not come back"), avoid confusing euphemisms such as "she went to sleep" or "God took her because she was good", reassure the child that they did not cause it, and include them in mourning rituals in age appropriate ways.`,
    keyPoints: ["Four components named and defined", "Typical age of 5 to 7", "Nagy's three phases", "Effect of experience and explanation", "Link to concrete operations", "Practical guidance on euphemisms"],
    pitfalls: ["Giving only Nagy's ages without later findings", "Leaving out guidance for parents and clinicians"],
    module: "lifespan/3-5",
    visuals: [
      { ...timeline("Put the phases of understanding death in order.", [["Death as departure or sleep, reversible", "Under 5"], ["Grasps irreversibility and universality", "5 to 7"], ["Death personified in some children", "5 to 9"], ["Final, universal and biological", "9 onwards"]], "Experience and honest explanations bring understanding earlier."), caption: "How understanding develops" },
    ],
    ref: "Nagy 1948; Speece and Brent 1984 review; lifespan module 3.5",
  },
]);
