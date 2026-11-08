import type { LongQA } from "@/lib/prep/long-types";
import { anchored, chain, compare, layers, tree, vis } from "./visual";

const S = "counselling" as const;

export const COUNSELLING_L01: LongQA[] = anchored([
  {
    id: "couns-l01-001",
    subject: S,
    topic: "core-conditions",
    marks: 15,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg", "mcp-entrance"],
    question: "State Carl Rogers' necessary and sufficient conditions of therapeutic personality change. Explain the three core conditions with examples, and evaluate what research says about them.",
    plan: ["The claim Rogers made in 1957", "All six conditions in order", "Empathy, unconditional positive regard and congruence with examples", "What the research shows", "Criticisms and a balanced conclusion"],
    answer: `## The claim
In 1957 Carl Rogers made one of the boldest claims in the history of counselling. He said that if six conditions exist and continue over a period of time, constructive personality change will follow, and that no other conditions are needed. Techniques, diagnosis and the counsellor's theory, he argued, matter only as channels for these conditions. The claim was bold because it was testable: if the conditions are present and the client does not change, the theory is wrong.

## The six conditions
1. Two persons are in psychological contact: each makes some perceived difference to the other.
2. The client is in a state of incongruence, being vulnerable or anxious.
3. The counsellor is congruent, or integrated, in the relationship.
4. The counsellor experiences unconditional positive regard for the client.
5. The counsellor experiences an empathic understanding of the client's internal frame of reference and tries to communicate it.
6. The client perceives, at least to a minimal degree, the counsellor's empathy and positive regard.
Conditions 3, 4 and 5 are called the core conditions. Condition 6 is often forgotten, yet it is the one that decides whether the others reach the client at all.

## Empathy
Empathy is sensing the client's private world as if it were one's own, without ever losing the "as if" quality. It is not sympathy, which is feeling sorry for someone, and it is not agreement. A student says, "Everyone at home thinks I will clear NEET this time, and I just sit with the book and nothing goes in." An empathic reply is: "You are carrying the whole family's hope, and the pressure is so heavy that studying itself has frozen." The counsellor captures both the feeling and its meaning, and checks it with the client.

## Unconditional positive regard
This is a warm acceptance of the client as a person, without conditions such as "I will value you if you stop drinking". It does not mean approving every action. A counsellor can accept a man who has hit his wife as a person worth helping while being clear that the violence must stop. Rogers saw this as the direct antidote to the conditions of worth the client learned in childhood.

## Congruence
Congruence, or genuineness, means that what the counsellor feels, what the counsellor is aware of, and what the counsellor shows all match. The counsellor is not hiding behind a professional mask. If a counsellor feels lost in a session, congruence may mean saying so gently, such as "I notice I am losing the thread; can we slow down?" rather than nodding as if all is clear. Rogers later came to regard congruence as the most basic of the three.

## What the research shows
- Charles Truax and Robert Carkhuff built rating scales for empathy, warmth and genuineness and found that higher levels were linked to better outcomes in counselling and in work with hospitalised patients.
- Later reviews were more cautious, because early studies used small samples and ratings made by the same people who judged outcome.
- Modern meta-analyses of client outcome find that empathy has a moderate link with outcome, a correlation of about 0.28; positive regard has a similar link of about 0.28; and congruence a slightly smaller link of about 0.23.
- Client ratings of the conditions predict outcome better than observer ratings, which supports condition 6: what matters is what the client perceives.

## Evaluation
Strengths:
- The conditions are now accepted across nearly all therapies as part of the common factors and the working alliance.
- The claim led to the first recordings and outcome studies of real counselling sessions.
Criticisms:
- The evidence supports the conditions as helpful, not as necessary and sufficient. Many clients, especially those with severe depression, phobias or psychosis, need specific methods as well.
- The conditions are hard to define and measure separately; they overlap heavily.
- Unconditional positive regard can be difficult to sustain and may be faked, which breaks congruence.
- In Indian settings, clients often expect advice and direction from an expert, so a purely non directive stance can feel like the counsellor is withholding help.

## Conclusion
Rogers' conditions describe the relationship that makes counselling possible. Research confirms that empathy, regard and genuineness matter for outcome, but most practitioners now see them as necessary foundations rather than the whole of the work.`,
    keyPoints: ["All six conditions in the right order", "Core conditions named as 3, 4 and 5", "Each core condition defined with an example", "Empathy distinguished from sympathy and agreement", "Research effect sizes roughly 0.28, 0.28 and 0.23", "Client perception as condition 6", "Necessary but not sufficient as the modern verdict"],
    pitfalls: ["Listing only three conditions when the question asks for all six", "Equating positive regard with approval of behaviour", "Giving no evidence at all"],
    module: "therapies/1-2",
    visuals: [
      layers("The six conditions", "stack", [
        ["Psychological contact", "Two people who each make a difference to the other"],
        ["Client incongruence", "The client is anxious or vulnerable"],
        ["Counsellor congruence", "Genuine, no professional mask"],
        ["Unconditional positive regard", "Warm acceptance of the person"],
        ["Empathic understanding", "Sensing the client's world as if it were one's own"],
        ["Client perceives it", "Empathy and regard actually reach the client"],
      ]),
      vis("experiment", { title: "What the research shows", question: "How strongly does each condition relate to client outcome?", unit: "r x 100", max: 50, conditions: [{ label: "Empathy", value: 28 }, { label: "Positive regard", value: 28 }, { label: "Congruence", value: 23 }], why: "Meta-analytic correlations with outcome, multiplied by 100. Moderate links: helpful, but not the whole story." }),
    ],
    ref: "Rogers 1957 J Consult Psychol; Truax and Carkhuff 1967; Elliott, Bohart, Watson and Murphy 2018 empathy r .28; Farber, Suzuki and Lynch 2018 positive regard r .28; Kolden et al 2018 congruence r .23",
  },
  {
    id: "couns-l01-002",
    subject: S,
    topic: "conditions-of-worth",
    marks: 10,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Explain how conditions of worth and incongruence lead to psychological distress in Rogers' theory. How does person-centred counselling reverse this process?",
    plan: ["Actualising tendency and the organismic valuing process", "Need for positive regard and conditions of worth", "Incongruence, threat and defence", "Breakdown and disorganisation", "How the core conditions reverse it"],
    answer: `## The starting point
Rogers believed that every organism has an actualising tendency, a built in drive to maintain and enhance itself. A young child judges experiences by an organismic valuing process: what feels good and growth giving is valued, what feels bad is avoided. A baby who is full simply refuses more food.

## The need for positive regard
Alongside this, the child develops a powerful need for positive regard, the warmth and approval of important people. When approval is given only if the child thinks, feels or acts in certain ways, the child learns conditions of worth: "I am lovable only when I come first in class", or "Good girls never feel angry with their elders". These conditions are introjected, taken in as if they were the child's own values, and they gradually replace the organismic valuing process.

## Incongruence
The self concept is then built around the conditions of worth. Experiences that fit the conditions are admitted to awareness. Experiences that do not fit, such as anger towards a parent, or pleasure in art when the family expects engineering, are a threat. This gap between the self concept and actual experience is incongruence.

## Defence and anxiety
Threatening experiences are kept out of awareness by two defences:
- Distortion: the experience is allowed in but changed to fit the self, as in "I am not angry, I am only tired".
- Denial: the experience is kept out of awareness altogether.
The person feels vague anxiety, a sign that something inconsistent is close to awareness. Behaviour becomes rigid, because the person must keep defending the self.

## Breakdown
If incongruence is large and an experience arrives suddenly and clearly, defence may fail. The self concept is then shattered and the person may become disorganised, acting in ways that seem out of character. Rogers saw some acute breakdowns in this light.

## How counselling reverses the process
Person-centred counselling offers the opposite of conditional regard.
1. Unconditional positive regard removes the threat: the client is valued whatever is said, so there is no need to hide experiences.
2. Empathy helps the client to notice and name feelings that were distorted or denied.
3. Congruence models a person whose inner experience and outer behaviour match.
4. As threat falls, denied experiences enter awareness, the self concept becomes larger and more accurate, and the client begins to trust the organismic valuing process again. The locus of evaluation moves from others to the self.

## Indian illustration
A 24 year old woman who gave up dance because her family valued only a medical career may feel numb and unsure what she wants. In counselling, as she is accepted without judgement, she may begin to feel both loyalty to her family and grief for the lost dance, and choose for herself how to hold both.

## Conclusion
In Rogers' view distress comes from living by other people's conditions rather than one's own experience, and healing comes from a relationship in which those conditions are absent.`,
    keyPoints: ["Actualising tendency and organismic valuing process", "Need for positive regard leading to conditions of worth", "Introjection of others' values", "Incongruence between self and experience", "Distortion and denial as defences, anxiety as signal", "Breakdown when defence fails", "Core conditions reverse the process and shift the locus of evaluation"],
    pitfalls: ["Describing incongruence without explaining where it comes from", "Not linking each core condition to a step in the reversal"],
    module: "therapies/1-2",
    visuals: [
      chain("Incongruence", [["Need for positive regard", "Approval matters more than anything"], ["Conditions of worth", "Valued only if I act this way"], ["Self built on conditions", "Organismic valuing is pushed aside"], ["Experience does not fit", "Anger, desire or grief arrives"], ["Threat and anxiety", "Distortion and denial keep it out"]]),
    ],
    ref: "Rogers 1959 A theory of therapy, personality and interpersonal relationships; therapies module 1.2",
  },
  {
    id: "couns-l01-003",
    subject: S,
    topic: "process-scale",
    marks: 10,
    difficulty: 4,
    exams: ["ma-semester", "mcp-entrance"],
    question: "Describe Rogers' process conception of psychotherapy. Outline the seven stages from fixity to fluidity and explain how a counsellor can use them.",
    plan: ["Where the idea came from", "The strands that change", "The seven stages", "Using the stages in practice", "Evaluation"],
    answer: `## The idea
By listening to hundreds of recorded sessions, Carl Rogers noticed that clients who improved did not simply change the content of what they said. They changed the way they related to their own experience. In 1958 he described this as a continuum running from fixity, where feelings are rigid, remote and owned by no one, to fluidity, where feelings are experienced freshly in the moment.

## The strands that change
Several strands move together along the continuum:
- Feelings and personal meanings: from unrecognised to fully owned.
- Manner of experiencing: from remote to immediate.
- Degree of incongruence: from unrecognised to tolerated and resolved.
- Communication of self: from none to rich and willing.
- Construing of experience: from rigid "facts" to tentative meanings.
- Relationship to problems: from "the problem is out there" to "I am part of it".
- Manner of relating: from avoiding closeness to relating openly.

## The seven stages
| Stage | What it sounds like |
| 1 | No wish to talk about self; problems are not recognised; "Nothing is wrong with me, my parents sent me" |
| 2 | Talks about external topics; feelings described as past or belonging to others |
| 3 | Talks about self as an object; feelings mostly in the past, little acceptance |
| 4 | Feelings more intense but still described rather than felt; some doubt about rigid beliefs |
| 5 | Feelings expressed in the present; surprise and fear at what is emerging; wish to be one's real self |
| 6 | A previously held back feeling is experienced fully, often with physical release such as tears |
| 7 | New feelings are experienced with immediacy inside and outside sessions; the self is trusted as a process |
Rogers thought that a client at stage 1 rarely comes voluntarily, and that most counselling work happens between stages 3 and 6.

## Using the stages
1. Assessment: the stage shows how ready the client is for deeper exploration. A client at stage 2 needs patient empathy, not interpretation.
2. Pacing: moving one stage at a time keeps threat low.
3. Tracking change: shifts across sessions show progress even when the life problem is unchanged.
4. Research: the process scale and the later Experiencing Scale allowed sessions to be rated, and clients who rated higher early in counselling tended to do better.

## Evaluation
- It shifted attention from symptoms to how a person processes experience, an idea later used in emotion focused therapy.
- The stages are descriptive and overlap; ratings need training.
- It assumes that open emotional expression is the healthy end point, which may not fit clients from cultures that value restraint, including many Indian families.

## Conclusion
The process conception shows that counselling succeeds when clients move from talking about feelings to living them, and gives the counsellor a map for pacing that movement.`,
    keyPoints: ["Fixity to fluidity continuum", "Strands such as feelings, experiencing, incongruence, construing", "Seven stages with sample statements", "Most work happens in the middle stages", "Use for assessment, pacing and tracking change", "Link to the Experiencing Scale", "Cultural critique of emotional expression as the goal"],
    pitfalls: ["Confusing the process stages with Egan's three stages", "Listing stages without describing what the client sounds like"],
    module: "therapies/1-2",
    visuals: [
      compare("The seven stages", ["Fixity", ["Feelings remote and unowned", "Problems seen as outside the self", "Rigid beliefs held as facts", "Closeness avoided"], "Stage 1 and 2: little self talk"], ["Fluidity", ["Feelings felt in the moment", "Owns a part in the problem", "Meanings held tentatively", "Relates openly"], "Stage 6 and 7: self trusted as a process"]),
    ],
    ref: "Rogers 1958 A process conception of psychotherapy, Am Psychol; Klein, Mathieu, Gendlin and Kiesler Experiencing Scale 1969",
  },
  {
    id: "couns-l01-004",
    subject: S,
    topic: "person-centred",
    marks: 20,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Critically evaluate person-centred counselling. Discuss its view of human nature, its goals and methods, the research evidence, and its suitability for clients in India.",
    plan: ["Origins and view of human nature", "Goals and the counsellor's role", "Methods: what a session looks like", "Research evidence", "Criticisms, including the Indian context", "Conclusion"],
    answer: `## Origins and view of human nature
Person-centred counselling began with Carl Rogers' work in the 1940s, first called non directive and then client centred counselling. It grew out of dissatisfaction with both psychoanalysis, which placed the expert at the centre, and behaviourism, which treated people as products of conditioning. Rogers' view of human nature is optimistic: people are basically trustworthy, social and forward moving, guided by an actualising tendency. Distress arises when this tendency is blocked by conditions of worth and the resulting incongruence between the self concept and experience.

## Goals
The goal is not to remove symptoms but to help the person become what Rogers called a fully functioning person:
- Open to experience rather than defensive.
- Living in the present, existentially, rather than by fixed plans.
- Trusting the organism as a guide to choice.
- Feeling free and responsible.
- Creative.
The client, not the counsellor, decides what to talk about and what change means.

## Methods
There are few techniques in the usual sense. The counsellor provides the relationship described in Rogers' six conditions, especially empathy, unconditional positive regard and congruence.
- Reflection of feeling and meaning, offered tentatively and checked with the client.
- Following the client's lead rather than setting an agenda.
- No diagnosis, interpretation, advice or homework as a rule.
- Attention to the client's moment by moment experiencing.
Later developments include focusing, developed by Eugene Gendlin, emotion focused therapy, which adds process guiding tasks such as two chair work, and pre therapy, which Garry Prouty designed for clients with psychosis or severe learning disability who are out of contact.

## Research evidence
- Rogers pioneered research on counselling. His group recorded sessions, which was then unheard of, and used Q sorts to show that the gap between the real and ideal self narrowed during counselling.
- The large Wisconsin project with hospitalised patients with schizophrenia gave mixed results; the conditions offered were often low, and patients who perceived higher conditions did better.
- Modern meta-analyses find that empathy, positive regard and congruence each have a moderate link with outcome.
- Comparative studies of humanistic therapies, including person-centred and emotion focused therapy, find large pre to post change and outcomes broadly similar to CBT for depression, though CBT shows a small advantage for anxiety disorders in some reviews.
- In the United Kingdom, counselling for depression, a person-centred and experiential approach, is now offered in the national psychological therapies programme for mild to moderate depression.

## Criticisms
- Too optimistic about human nature; it says little about aggression and self destructive behaviour.
- Necessary and sufficient is too strong. Clients with severe depression, OCD, phobias or psychosis need specific methods and sometimes medication.
- Vague concepts such as actualisation and congruence are hard to test.
- Non directive work may be slow, which matters where clients can afford only a few sessions.
- Unconditional positive regard may conflict with duties such as protecting a child at risk.
- It focuses on the individual and pays less attention to social causes of distress such as poverty, caste or gender oppression.

## The Indian context
Several features fit Indian clients poorly at first sight:
- Many clients expect an expert who gives advice, as in the guru shishya model, and may see reflection as evasive.
- The self in India is often a relational or familial self; the goal of an independent, inner directed person can clash with duties to family.
- Emotional expression to a stranger may be uncomfortable, and distress is often expressed through the body.
Yet the core conditions travel well. Warmth, respect and careful listening are valued in every culture, and many clients have rarely been heard without judgement. Indian counsellors commonly adapt the approach by:
1. Combining the relationship with information, guidance and problem solving.
2. Including family members where the client wishes.
3. Respecting spiritual meanings and the client's own explanatory model.
4. Allowing the client to define goals in family as well as personal terms.

## Conclusion
Person-centred counselling changed the whole field by putting the relationship and the client's own experience at the centre and by opening therapy to research. As a complete method it is best suited to clients with mild to moderate distress who want to explore themselves; as a foundation, its core conditions are part of good practice in every approach and in every culture, including India.`,
    keyPoints: ["Optimistic view of human nature and the actualising tendency", "Goal of the fully functioning person", "Methods built on the core conditions with few techniques", "Later developments: focusing, emotion focused therapy, pre therapy", "Research: recordings, Q sorts, Wisconsin project, meta-analyses", "Criticisms of sufficiency, vagueness and individualism", "Indian adaptations: guidance, family, spiritual meaning"],
    pitfalls: ["Describing the theory without any evaluation", "Saying the approach has no evidence", "Treating the Indian discussion as a single sentence"],
    module: "therapies/1-2",
    visuals: [
      compare("The Indian context", ["Classic person-centred stance", ["Non directive, client leads", "Independent inner directed self", "Feelings expressed in words", "No advice or homework"], "Built in a culture that prizes autonomy"], ["Common Indian adaptation", ["Relationship plus guidance", "Family included when the client wishes", "Bodily and spiritual meanings respected", "Goals framed in family terms too"], "Core conditions kept, method adapted"]),
      tree("Methods", [["Person-centred family", "Built on the core conditions", -1], ["Classic client centred", "Reflection, following the client", 0], ["Focusing", "Gendlin: attending to the felt sense", 0], ["Emotion focused therapy", "Adds tasks such as two chair work", 0], ["Pre therapy", "Prouty: contact reflections for psychosis", 0]]),
    ],
    ref: "Rogers 1951, 1957, 1961; Rogers et al 1967 Wisconsin project; Elliott et al 2013 humanistic meta-analysis; NICE counselling for depression; Gendlin 1978; Prouty 1994",
  },
  {
    id: "couns-l01-005",
    subject: S,
    topic: "focusing",
    marks: 5,
    difficulty: 3,
    exams: ["ma-semester", "mcp-entrance"],
    question: "Write a short note on Gendlin's focusing and the felt sense.",
    plan: ["Who Gendlin was and what he found", "The felt sense", "The six steps", "Uses and limits"],
    answer: `## Origin
Eugene Gendlin, a philosopher who worked with Carl Rogers, studied recordings of counselling sessions and found that the clients who improved could be identified early. It was not what the counsellor did; it was how the client talked. Successful clients paused and spoke from a vague bodily sense of their situation, while others only described events or analysed themselves. Gendlin then developed focusing to teach this skill.

## The felt sense
A felt sense is a bodily, not yet clear sense of a whole situation, such as a tightness in the chest when thinking about one's marriage. It is more than an emotion and is not yet in words. When the right word or image is found, there is a felt shift, a sense of release and new meaning.

## The six steps
1. Clearing a space: noticing what is in the way of feeling fine and setting each concern aside.
2. Felt sense: choosing one concern and letting its whole feel form in the body.
3. Handle: finding a word, phrase or image that fits it, such as "heavy" or "stuck".
4. Resonating: checking the handle against the felt sense until they match.
5. Asking: gently asking the felt sense what it is about or what it needs.
6. Receiving: welcoming whatever comes, without judging it.

## Uses and limits
Focusing is used within person-centred and emotion focused therapy, and the related Experiencing Scale is a research tool. It suits clients who intellectualise. It may be hard for clients who are flooded by emotion or who have trauma linked to bodily sensations, where grounding should come first.`,
    keyPoints: ["Gendlin's finding from session recordings", "Felt sense defined as bodily, pre verbal", "Felt shift", "Six steps in order", "Link to the Experiencing Scale", "Caution with trauma"],
    pitfalls: ["Equating the felt sense with an emotion", "Missing the research finding that started it"],
    module: "therapies/1-2",
    visuals: [chain("The six steps", [["Clear a space", "Set concerns aside"], ["Felt sense", "Let the whole feel form"], ["Handle", "A word or image"], ["Resonate", "Check word against feel"], ["Ask", "What does it need?"], ["Receive", "Welcome what comes"]])],
    ref: "Gendlin 1978 Focusing; Gendlin et al 1968 experiencing and outcome",
  },
  {
    id: "couns-l01-006",
    subject: S,
    topic: "microskills",
    marks: 15,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg", "mcp-entrance"],
    question: "Describe Allen Ivey's microskills hierarchy. Explain attending behaviour and the basic listening sequence with examples, and discuss the importance of intentionality.",
    plan: ["What microskills are and why Ivey broke counselling into units", "The levels of the hierarchy", "Attending behaviour", "The basic listening sequence with examples", "Intentionality and cultural adaptation", "Evaluation"],
    answer: `## Microskills
In the 1960s Allen Ivey and his colleagues broke the complex act of counselling into small, observable, teachable units called microskills. Each skill is defined, demonstrated, practised in short recorded role plays, and given feedback. The skills are arranged in a hierarchy, from the basic skills of listening to the complex skills of influencing and integrating them into a personal style.

## The hierarchy
From the base upwards:
1. Ethics, multicultural competence and wellness: the foundation for everything.
2. Attending behaviour: culturally appropriate eye contact, body language, vocal qualities and verbal tracking.
3. Questions, open and closed.
4. Client observation skills.
5. Encouraging, paraphrasing and summarising.
6. Reflection of feeling.
7. The five stage interview structure: relationship, story and strengths, goals, restory, action.
8. Confrontation, or supportive challenge.
9. Focusing: on the client, others, the family, the issue, the counsellor and the culture.
10. Reflection of meaning and interpretation or reframing.
11. Influencing skills: self disclosure, feedback, logical consequences, information and directives.
12. Skill integration and determining one's own style and theory.

## Attending behaviour
Attending tells the client "I am with you". It has four parts, sometimes called the three V's and B:
- Visuals: eye contact that suits the culture. In many Indian families a younger client may look down when speaking to an elder; this is respect, not avoidance.
- Vocal qualities: tone, speed and volume that convey calm interest.
- Verbal tracking: staying with the client's topic rather than jumping to the counsellor's interests.
- Body language: an open, relaxed posture, leaning slightly forward.
Ivey found that attending alone increases how much clients talk, and that clients tend to talk about whatever the counsellor selectively attends to.

## The basic listening sequence
These skills draw out the client's story:
- Open questions begin with what, how, could or would and invite detail: "What happened after the results came?"
- Closed questions gather specific facts: "Are you living with your parents?"
- Encouraging: short responses, nods or repeating key words, such as "Failed...?"
- Paraphrasing: restating the essence of what was said in fewer, fresh words: "So after the interview went badly, you stopped applying."
- Reflection of feeling: naming the emotion: "You sound ashamed, and a little angry."
- Summarising: pulling together several minutes or a whole session, often at the start or end.
The sequence is used in almost every helping interview, from a medical history to a placement interview.

## Intentionality
Ivey's central idea is intentionality: the counsellor chooses each response deliberately, knowing its likely effect, and has several alternatives if one does not work. An intentional counsellor can anticipate that a closed question will narrow the conversation, while a reflection of feeling will deepen it. Ivey also stressed that skills must be adapted to culture; there is no single correct way to attend.

## Evaluation
- Microskills training is brief, structured and measurable, and studies show that trainees quickly acquire the skills.
- It has been adopted in counselling, social work, nursing and medical training worldwide, including Indian postgraduate courses.
- Critics say that a skilled response without genuine empathy can sound mechanical, and that acquiring skills in role plays does not guarantee their use with real clients.
- The hierarchy is a teaching order, not a strict rule; experienced counsellors move freely between levels.

## Conclusion
The microskills hierarchy turns the art of counselling into learnable steps, with attending and the basic listening sequence at its heart and intentionality as the guiding principle.`,
    keyPoints: ["Microskills as small teachable units", "The hierarchy from ethics and attending up to integration", "Four parts of attending with cultural notes", "Open and closed questions, encouraging, paraphrasing, reflection of feeling, summarising", "Five stage interview structure", "Intentionality defined", "Evaluation of training evidence and mechanical use"],
    pitfalls: ["Listing skills without examples", "Treating eye contact as universal", "Forgetting the foundation level of ethics and multicultural competence"],
    module: "therapies/1-2",
    visuals: [
      layers("The hierarchy", "pyramid", [
        ["Integration and personal style", "Skills joined into one's own way of working"],
        ["Influencing skills", "Self disclosure, feedback, directives, information"],
        ["Reflection of meaning and reframing", "Values and new perspectives"],
        ["Confrontation and focusing", "Supportive challenge; widening the focus"],
        ["Five stage interview", "Relationship, story, goals, restory, action"],
        ["Basic listening sequence", "Questions, encouraging, paraphrase, reflection, summary"],
        ["Attending behaviour", "Eyes, voice, tracking and body"],
        ["Ethics, culture and wellness", "The foundation of all the rest"],
      ]),
      vis("sort", { prompt: "Sort each counsellor response into the skill it uses", buckets: ["Open question", "Paraphrase", "Reflection of feeling", "Summary"], items: [{ text: "What has the last month been like for you?", bucket: 0 }, { text: "So since the move to Pune, you have been eating alone most nights.", bucket: 1 }, { text: "You sound lonely, and a bit hurt that no one has called.", bucket: 2 }, { text: "Today we talked about the move, the new job and missing your sister, and you said the evenings are hardest.", bucket: 3 }] }, "The basic listening sequence"),
    ],
    ref: "Ivey, Ivey and Zalaquett Intentional Interviewing and Counseling; Ivey 1971 microcounseling; therapies module 1.2",
  },
  {
    id: "couns-l01-007",
    subject: S,
    topic: "empathy-levels",
    marks: 10,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Distinguish primary empathy from advanced empathy. Illustrate Carkhuff's levels of empathic responding with a client statement and sample responses.",
    plan: ["Define empathy and the two kinds", "Carkhuff's five level scale", "One client statement with responses at each level", "When to use advanced empathy and the risks"],
    answer: `## Empathy
Empathy in counselling is understanding the client's world from the inside and communicating that understanding. Gerard Egan distinguished two kinds.
- Primary, or basic, empathy responds to what the client has openly said: the feelings and the experiences behind them. It builds trust and helps the client tell the story.
- Advanced empathy goes a little beyond what is said, to what is implied, hinted at or only half aware. It helps the client see the problem in a new way. It is a form of gentle challenge.

## Carkhuff's levels
Robert Carkhuff, building on work with Charles Truax, rated empathic responses on five levels.
| Level | Description |
| 1 | Does not attend to the client's feelings at all, or detracts from them |
| 2 | Responds to the surface content but subtracts noticeably from the feeling |
| 3 | Interchangeable: expresses essentially the same feeling and meaning as the client |
| 4 | Adds noticeably to the client's expression, naming deeper feelings |
| 5 | Adds significantly, reaching feelings the client could not express, with full presence |
Level 3 is the minimum facilitative level. Levels 4 and 5 correspond to advanced empathy.

## An example
A 35 year old engineer says: "My father keeps calling about the loan for my sister's wedding. I send money every month. My wife says I am a puppet. I just smile and say it is fine."
- Level 1: "Weddings are very expensive these days." This changes the subject.
- Level 2: "You are sending money home." Content only, with no feeling.
- Level 3: "You feel squeezed between your father's demands and your wife's criticism, and you keep it all inside." Interchangeable.
- Level 4: "Behind the smile it sounds like you are tired, and perhaps hurt that no one asks what this costs you." Names an implied feeling.
- Level 5: "It seems you have spent years being the good son everyone relies on, and part of you is wondering when it will be your turn to be cared for." Reaches a theme the client has not yet said.

## Using advanced empathy well
- Use it only after trust is built and primary empathy has been accurate.
- Base it on what the client has actually said or shown, not on the counsellor's theory.
- Offer it tentatively, such as "I wonder if...", so the client can correct it.
- Watch the response: if the client feels understood and goes deeper, it was accurate; if the client defends, step back.
Risks include imposing the counsellor's view, interpreting too early and making the client feel exposed.

## Conclusion
Primary empathy lets the client feel heard; advanced empathy helps the client hear themselves more fully. Carkhuff's scale gives a practical way to train and rate both.`,
    keyPoints: ["Definition of empathy", "Primary versus advanced empathy", "Carkhuff's five levels with level 3 as interchangeable", "A worked client statement with responses at several levels", "Advanced empathy as gentle challenge", "Guidelines for timing and tentativeness"],
    pitfalls: ["Giving level 4 and 5 responses that are interpretations from theory", "Forgetting that level 3 is the minimum facilitative level"],
    module: "therapies/1-2",
    visuals: [
      vis("worked", { title: "An example", steps: [{ q: "Client: My father calls about the loan, my wife calls me a puppet, I smile and say it is fine. Weddings are expensive these days?", a: "Level 1: changes the subject and ignores the feeling." }, { q: "You feel squeezed between your father and your wife, and keep it inside?", a: "Level 3: interchangeable, the same feeling and meaning." }, { q: "Behind the smile you sound tired, perhaps hurt that no one asks what it costs you?", a: "Level 4: adds an implied feeling, offered tentatively." }] }),
    ],
    ref: "Carkhuff 1969 Helping and Human Relations; Truax and Carkhuff 1967; Egan The Skilled Helper",
  },
  {
    id: "couns-l01-008",
    subject: S,
    topic: "questions",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "cuet-pg"],
    question: "Write a short note on the use of open and closed questions in counselling. Why are 'why' questions usually avoided?",
    plan: ["Define open and closed questions", "Uses of each with examples", "Problems with why questions", "Guidelines"],
    answer: `## Open and closed questions
Open questions invite the client to talk at length in their own words. They usually begin with what, how, could or would: "What has been happening at home?" or "Could you tell me more about the night you could not sleep?"
Closed questions can be answered in a word or two, often yes or no: "Do you live alone?" or "How old is your son?"

## Uses
- Open questions open up the story, reveal feelings and meanings, and give the client control of what is said. "How" questions bring out process and feelings, "what" questions bring out facts, and "could" questions are the most open.
- Closed questions gather specific facts, check details in a risk assessment ("Have you thought of ending your life?"), focus a rambling client and help a very quiet client to start.

## Why questions
Questions beginning with "why" are usually avoided for three reasons:
1. They sound like blame or demand justification, as when a parent asks "Why did you fail?" Many clients have heard this tone from elders and teachers.
2. They push the client to intellectualise and give a reason rather than explore feelings.
3. The client often does not know why, and feels inadequate.
A why question can usually be turned into a what or how question: "What was going on for you just before you left the exam hall?"

## Guidelines
- Use open questions more than closed ones, but do not interrogate; follow questions with reflections.
- Ask one question at a time, not a chain of questions.
- Notice that clients talk about what the counsellor asks about, so questions steer the session.`,
    keyPoints: ["Open questions defined with examples", "Closed questions defined with examples", "Uses of each", "Why questions sound blaming and lead to intellectualising", "Rewording why as what or how", "Avoid question chains and interrogation"],
    pitfalls: ["Saying closed questions should never be used", "No examples"],
    module: "therapies/1-2",
    visuals: [vis("sort", { prompt: "Open or closed? Or a why question to reword?", buckets: ["Open", "Closed", "Why: reword it"], items: [{ text: "How did you feel when the results came out?", bucket: 0 }, { text: "Are you taking any medicines?", bucket: 1 }, { text: "Why did you stop going to college?", bucket: 2, why: "Try: What made college harder to face?" }, { text: "Could you tell me about your family?", bucket: 0 }] }, "Why questions")],
    ref: "Ivey, Ivey and Zalaquett Intentional Interviewing; Nelson-Jones Basic Counselling Skills",
  },
  {
    id: "couns-l01-009",
    subject: S,
    topic: "confrontation",
    marks: 10,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Discuss the advanced counselling skills of challenging (confrontation), immediacy and self-disclosure. Give guidelines and examples for each.",
    plan: ["Why advanced skills come later", "Challenging: discrepancies and Ivey's client change scale", "Immediacy: types and example", "Self-disclosure: when and how", "Common risks"],
    answer: `## Why these skills come later
These skills go beyond following the client. They introduce something new from the counsellor: a noticed contradiction, a comment on the relationship or a piece of the counsellor's own experience. They work only when trust is established and the counsellor has listened well.

## Challenging, or confrontation
Challenging means pointing out discrepancies, mixed messages or blind spots, so the client can examine them. It is supportive, not aggressive. Discrepancies may be:
- Between words and non verbal behaviour: "You say you are fine, and your hands are shaking."
- Between two statements: "Earlier you said your husband never helps; now you say he cooked all week."
- Between words and actions: "You want to clear the bank exam, and you mentioned you have not opened a book this month."
- Between the client and the situation: "You feel you must handle your mother's illness alone, though your brothers live nearby."
A useful form is "On the one hand... on the other hand..." Ivey's Client Change Scale rates the response to a challenge from denial, through partial examination, acceptance and recognition, and creation of a new solution, to transcendence, a new way of seeing the whole issue.

## Immediacy
Immediacy is talking directly about what is happening between counsellor and client, here and now. Egan described relationship immediacy, about the relationship as a whole, and here and now immediacy, about a particular moment.
Example: "I notice that each time we come close to talking about your brother, you change the topic and laugh. I wonder what is happening right now." Immediacy is useful when the client is dependent, hostile, flirtatious, silent or keeps missing sessions, because patterns in the room often mirror patterns outside.

## Self-disclosure
Self-disclosure is sharing something personal with the client. Guidelines:
- Ask whose need it serves: it must help the client, not relieve the counsellor.
- Keep it brief and relevant, then return the focus to the client.
- Disclose past resolved experiences rather than current struggles.
- Use it sparingly; frequent disclosure shifts attention to the counsellor.
- Prefer disclosure of reactions in the session ("I felt moved when you said that") over life history.
Example: "I also found the first year away from home very hard. What has it been like for you?"

## Common risks
- Challenging too early feels like attack and leads to drop out.
- Immediacy can feel intense; it needs a calm, tentative tone.
- Self-disclosure can create a dual relationship feel, especially in small towns where the counsellor and client may share social circles.

## Conclusion
Challenging, immediacy and self-disclosure help clients move from understanding to change, but each depends on a strong relationship and careful timing.`,
    keyPoints: ["Advanced skills need trust first", "Challenging defined with four kinds of discrepancy", "Ivey's client change scale", "Immediacy: relationship and here and now", "Self-disclosure guidelines: whose need, brief, return the focus", "Risks of each skill", "Indian examples"],
    pitfalls: ["Describing confrontation as aggressive argument", "Recommending frequent self-disclosure"],
    module: "therapies/1-2",
    visuals: [
      vis("decide", { scene: "A client says, smiling, that her marriage is perfect, while she keeps twisting her dupatta and her eyes fill with tears.", ask: "Which response is the best supportive challenge?", choices: [{ label: "You are clearly lying to me.", verdict: "harm", outcome: "She feels attacked and withdraws.", why: "A challenge must be tentative and respectful." }, { label: "You say the marriage is perfect, and I notice your eyes filling up. What is happening for you right now?", verdict: "best", outcome: "She pauses and begins to talk about loneliness.", why: "Names the discrepancy gently and invites exploration." }, { label: "That is good to hear. Let us move on.", verdict: "ok", outcome: "The session stays comfortable but nothing changes.", why: "Safe, but misses an important signal." }] }, "Challenging, or confrontation"),
    ],
    ref: "Egan The Skilled Helper; Ivey Client Change Scale; Hill Helping Skills on immediacy and self-disclosure",
  },
  {
    id: "couns-l01-010",
    subject: S,
    topic: "soler",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "cuet-pg"],
    question: "Write a short note on non-verbal attending in counselling, with reference to Egan's SOLER.",
    plan: ["Why non-verbal attending matters", "The five parts of SOLER", "Cultural flexibility", "Reading the client's non-verbal behaviour"],
    answer: `## Why it matters
Before a counsellor says anything, the body has already told the client whether the counsellor is interested. Non-verbal attending shows presence and respect and encourages the client to talk. Gerard Egan summed up the basics in the acronym SOLER.

## SOLER
- S: Face the client squarely, or at a slight angle, which says "I am with you". Sitting at a slight angle is often more comfortable than directly face to face.
- O: Adopt an open posture, without crossed arms or legs that may signal defensiveness.
- L: Lean slightly towards the client at times, showing involvement.
- E: Maintain good eye contact, steady but not staring.
- R: Be relatively relaxed, so the client can relax too.
Egan later added that these are guidelines, not rules, and that what matters is being genuinely present.

## Cultural flexibility
SOLER was written in a Western setting. In India, a young woman may be uncomfortable if a male counsellor leans close or holds steady eye contact; an elderly client may prefer some formality; and some clients sit on the floor in community settings. The counsellor should adjust distance, gaze and posture to what feels respectful to the client.

## Reading the client
Attending also means observing the client's non-verbal behaviour: posture, facial expression, tone of voice, silences, tears and movements such as foot tapping. A mismatch between words and body is often the most important signal in a session.`,
    keyPoints: ["Purpose of non-verbal attending", "Each letter of SOLER explained", "Guidelines not rules", "Cultural adaptation with Indian examples", "Observing the client's non-verbal cues", "Mismatch between words and body"],
    pitfalls: ["Treating SOLER as fixed rules", "Forgetting the client's own non-verbal behaviour"],
    module: "therapies/1-2",
    visuals: [chain("SOLER", [["S", "Face squarely or at an angle"], ["O", "Open posture"], ["L", "Lean slightly forward"], ["E", "Eye contact, not staring"], ["R", "Relaxed"]])],
    ref: "Egan The Skilled Helper, SOLER; Ivey on cultural variation in attending",
  },
]);
