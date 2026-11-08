/* Module · Psychodynamics, Parts I and II (Starting and Beginner levels). Original text written for VIBHA School of Psychology. */
export const part1 = String.raw`
# Part I · Starting: the inner world

## 1.1 What "psychodynamic" means, and why it still matters [core][starting]
"Psychodynamic" means that the mind has **forces inside it that push against each other**, mostly outside awareness, and that these forces shape how we feel, what we do and how we relate to people. A symptom, a habit or a repeating pattern in relationships is understood as the **visible end of an inner struggle**.

You already met Freud's maps of the mind and the list of defences in the module **Mind, development and defence mechanisms** (Module 3). This module goes further: how the schools after Freud changed the picture, what happens between patient and therapist, how to write a psychodynamic formulation, and what the research really says.

### Five ideas that run through every psychodynamic school
1. **Much of mental life is unconscious.** We act on wishes, fears and memories we cannot see directly.
2. **Feelings and wishes can conflict.** Wanting closeness and fearing it; loving a parent and resenting them.
3. **The mind protects itself.** Defences keep painful feelings out of awareness, at a cost.
4. **The past lives on in the present.** Early relationships leave templates that we repeat with partners, bosses and therapists.
5. **The therapy relationship is a window.** How the patient treats the therapist (and how the therapist feels) shows the pattern live, in the room.

:::widget flow
{
  "title": "One family, many schools",
  "layout": "tree",
  "nodes": [
    { "id": "freud", "label": "Freud: drives and conflict", "detail": "The starting point: unconscious wishes, conflict between id, ego and superego, defences, dreams and the talking cure." },
    { "id": "ego", "label": "Ego psychology", "parent": "freud", "detail": "Anna Freud, Hartmann, Vaillant. Focus: how well the ego adapts, which defences it uses, how strong it is." },
    { "id": "obj", "label": "Object relations", "parent": "freud", "detail": "Klein, Winnicott, Bion, Kernberg. Focus: the inner world of relationships, splitting and integration." },
    { "id": "self", "label": "Self psychology", "parent": "freud", "detail": "Kohut. Focus: a fragile self that needs mirroring, idealising and twinship from others to grow." },
    { "id": "att", "label": "Attachment theory", "parent": "freud", "detail": "Bowlby, Ainsworth, Main, Fonagy. Focus: real early care, internal working models and mentalising." },
    { "id": "rel", "label": "Relational and intersubjective", "parent": "self", "detail": "Two minds in the room, co-creating what happens. The therapist is a participant, not only an observer." },
    { "id": "mbt", "label": "Mentalization-based work", "parent": "att", "detail": "Attachment research turned into a treatment for people whose feelings overwhelm their ability to think about minds." }
  ],
  "caption": "They disagree about what drives people, yet all keep the five shared ideas above."
}
:::

:::widget timeline
{
  "prompt": "Put these landmarks of psychodynamic thought in the order they happened.",
  "events": [
    { "label": "Freud's book on dreams sets out the topographic model", "when": "1900" },
    { "label": "Girindrasekhar Bose founds the Indian Psychoanalytic Society in Calcutta", "when": "1922" },
    { "label": "Freud's structural model: id, ego and superego", "when": "1923" },
    { "label": "Anna Freud systematises the defence mechanisms", "when": "1936" },
    { "label": "Klein describes the paranoid-schizoid and depressive positions", "when": "1930s to 1946" },
    { "label": "Bowlby's attachment theory and Ainsworth's Strange Situation", "when": "1950s to 1970s" },
    { "label": "Kohut's self psychology", "when": "1971 to 1984" },
    { "label": "Mentalization-based treatment is tested in randomised trials", "when": "1999 onwards" }
  ],
  "why": "Freud's two models came first, with Bose working in parallel in India. Ego psychology and Kleinian object relations grew in the 1930s and 1940s; attachment research and self psychology followed; structured, tested treatments came last."
}
:::

:::student
Think of a person who always ends up with partners who ignore them, then feels hurt but "chooses" the same kind again. A psychodynamic therapist asks: what is this repetition doing for them? Is it familiar? Does it protect them from something even more frightening, such as being truly seen?
:::

:::clinician
Contemporary psychodynamic practice is not classical drive theory. Most clinicians work from a blend of ego psychology, object relations, self psychology, attachment and relational ideas, with an emphasis on affect, avoidance, recurring interpersonal themes, the therapy relationship and past experience. A well-known 2000 review of recorded therapy sessions distilled seven features that distinguish psychodynamic from cognitive-behavioural sessions in recorded therapy: focus on affect and its expression; exploring attempts to avoid distressing thoughts and feelings; identifying recurring themes and patterns; discussing past experience; focus on interpersonal relations; focus on the therapy relationship; and exploring fantasy life. These remain a useful operational definition when you read trials.
:::

:::widget decide
{
  "scene": "Priya, 26, a bank officer in Indore, has missed two of her last four counselling sessions, each time messaging an apology an hour before. She says she is “too busy”. In the sessions she does attend, she talks about how her mother never had time for her.",
  "ask": "How would a psychodynamic counsellor first think about the missed sessions?",
  "choices": [
    { "label": "Treat it as a scheduling problem and offer a different time slot only", "verdict": "ok", "outcome": "The new slot helps for a while, then the missing starts again.", "why": "Practical fixes are sensible, but on their own they ignore the possible meaning of the behaviour." },
    { "label": "Wonder, gently and with her, whether the missing echoes being left by her mother, perhaps now with her doing the leaving", "verdict": "best", "outcome": "Priya goes quiet, then says, “Maybe I leave before you get tired of me.” The pattern becomes something you can both look at.", "why": "Behaviour towards the therapist often repeats old relationships. Naming it with curiosity, not blame, turns acting out into talking." },
    { "label": "Tell her firmly that her absences show resistance and she must commit or stop", "verdict": "harm", "outcome": "She feels judged, as she did at home, and drops out.", "why": "An interpretation delivered as a rebuke repeats the rejection she fears. Timing and tone matter as much as content." }
  ]
}
:::

:::trap Psychodynamic is not the same as psychoanalysis
**Psychoanalysis** is one intensive form (lying on the couch, several sessions a week, for years). **Psychodynamic therapy** is the broader family, usually face to face, weekly or time-limited. Exams often ask you to tell them apart.
:::

:::recall
1. What does "psychodynamic" mean in one line? || Inner forces, mostly unconscious, push against each other and shape feelings, behaviour and relationships.
2. Name the five ideas common to psychodynamic schools. || Unconscious mental life, conflict, defence, the past repeating in the present, the therapy relationship as a window.
3. How does psychodynamic therapy differ from psychoanalysis? || Psychoanalysis is an intensive form (couch, several sessions weekly, years); psychodynamic therapy is the broader, usually weekly or brief, face-to-face family.
:::

:::mcq
Q: A therapist notices that a client talks about everything except her feelings about her recent divorce, and changes the subject when it comes up. Which feature of psychodynamic work is the therapist using?
- Setting homework to test beliefs
- *Exploring attempts to avoid distressing feelings
- Giving advice to solve the problem
- Measuring symptoms each session
> Noticing and exploring avoidance of painful affect is one of the core features that distinguish psychodynamic sessions.
:::

## 1.2 Freud's maps of the mind, taken further [core][starting]
Module 3 gave you the outline: conscious, preconscious, unconscious; id, ego, superego. Here is what the maps were **for**, and the parts exams ask about in depth.

### The topographic model: three ways of thinking
| Term | What it means | Where you see it |
|---|---|---|
| **Primary process** | Thinking ruled by wishes. No sense of time, no contradiction, images instead of words, one thing standing for another | Dreams, slips, psychosis, small children's play |
| **Secondary process** | Logical, ordered, realistic thinking that can wait | Planning, problem solving |
| **Pleasure principle** | Seek relief from tension now | The id's rule |
| **Reality principle** | Delay relief until it is safe and possible | The ego's rule |

:::widget layers
{
  "title": "The topographic model as an iceberg",
  "shape": "iceberg",
  "layers": [
    { "label": "Conscious", "detail": "What you are aware of right now: this sentence, the chair you sit on, a passing worry. Small, like the tip of an iceberg." },
    { "label": "Preconscious", "detail": "Not in mind now but easy to bring up: your phone number, what you ate yesterday. Secondary process rules here, and a 'censor' at its border decides what may pass." },
    { "label": "Unconscious", "detail": "Wishes, fears and memories kept out of awareness because they cause anxiety. Primary process rules here. You see it only indirectly: in dreams, slips, symptoms and repeated patterns." }
  ],
  "caption": "In the later structural model, the id lies wholly below the water, while the ego and superego stretch across all three levels."
}
:::

### Dreams: "the royal road to the unconscious"
Freud separated the **manifest content** (the dream you remember) from the **latent content** (the hidden wish). The **dream work** turns one into the other:
- **Condensation**: several ideas squeezed into one image.
- **Displacement**: feeling moved from an important thing to an unimportant one.
- **Symbolisation**: one thing stands for another.
- **Secondary revision**: on waking, the mind tidies the dream into a story.

:::widget flow
{
  "title": "How a hidden wish becomes the dream you remember",
  "layout": "chain",
  "nodes": [
    { "id": "lat", "label": "Latent content", "detail": "The hidden wish, often stirred by a 'day residue', something small that happened the day before." },
    { "id": "con", "label": "Condensation", "detail": "Several people, places or ideas are squeezed into one image." },
    { "id": "dis", "label": "Displacement", "detail": "The strong feeling is shifted onto something minor, so the dream feels oddly calm about what matters." },
    { "id": "sym", "label": "Symbolisation", "detail": "One thing stands for another, so the wish is shown in disguise." },
    { "id": "rev", "label": "Secondary revision", "detail": "On waking, the mind smooths the fragments into a story with a beginning and end." },
    { "id": "man", "label": "Manifest content", "detail": "The dream as told. Analysis works backwards, from this to the latent wish, through the dreamer's associations." }
  ],
  "edgeLabels": { "lat>con": "censored by", "rev>man": "remembered as" },
  "caption": "The dream work disguises the wish so that sleep can go on."
}
:::

:::mnemonic Dream work: "CDSS"
**C**ondensation, **D**isplacement, **S**ymbolisation, **S**econdary revision.
:::


:::widget hypnogram
{
 "title": "Where vivid dreams happen",
 "caption": "Long, story-like dreams come mostly from REM sleep, and the REM periods grow longer towards morning, which is why the dream you remember is usually the last one. Modern research ties REM dreaming to memory and emotion processing; it does not settle whether a hidden wish is being disguised, so treat Freud's dream work as a clinical method, not a proven sleep mechanism."
}
:::

### The structural model: conflict is normal
In the structural model the **ego** has three demanding masters: the **id** (wishes), the **superego** (conscience and ideals) and **reality**. When they clash, the ego feels anxiety and uses defences. A symptom is often a **compromise formation**: it partly expresses the wish, partly punishes it, and partly keeps it hidden.

:::example A compromise in a clinic in Kolkata
Ritu, 19, develops a sudden weakness of her right hand on the morning of an engineering exam her father insisted she take; she wanted to study music. The weakness (no neurological cause) stops her writing the exam (the wish is met), makes her suffer (the guilt is paid), and lets nobody, including her, see the rebellion (it stays hidden). That is a compromise formation. Psychodynamic thinking adds meaning; it never replaces a proper medical work-up.
:::

:::widget sort
{
  "prompt": "Who is speaking? Sort each inner voice to the part of the mind it comes from.",
  "buckets": ["Id", "Ego", "Superego"],
  "items": [
    { "text": "“Eat the whole box of sweets now.”", "bucket": 0 },
    { "text": "“If I leave the sweets till after dinner, I can enjoy them without feeling sick.”", "bucket": 1 },
    { "text": "“Good girls don't eat sweets. You should be ashamed.”", "bucket": 2 },
    { "text": "“I'd love to shout at my boss. I'll say it calmly in tomorrow's review instead.”", "bucket": 1, "why": "Weighing the wish against reality and finding a workable path is the ego's job." },
    { "text": "“I want him to suffer the way I did.”", "bucket": 0 },
    { "text": "“A real son would never feel this way about his father.”", "bucket": 2 }
  ]
}
:::

:::clinician
Drive theory (libido and aggression as the engines of mental life) has largely been set aside in mainstream practice, and Freud's specific developmental claims (fixed psychosexual stages, universal Oedipal fantasies, penis envy) have weak or no empirical support. What survived is broader. Westen's 1998 review of Freud's scientific legacy argued that several core propositions are well supported by cognitive and social psychology: much of mental life, including thought, feeling and motive, is unconscious; mental processes run in parallel and can conflict; stable personality patterns begin in childhood and shape later relationships; mental representations of self and others guide interactions; and development involves learning to regulate feelings and move from immature dependence to mature interdependence. Implicit memory, implicit attitudes and motivated reasoning are the experimental cousins of "the unconscious", although they are not the same thing as a dynamic unconscious that actively keeps material out of awareness. Teach Freud as a starting map, not a set of facts.
:::

:::recall
1. Contrast primary and secondary process. || Primary: wish-driven, timeless, images, no contradiction (dreams). Secondary: logical, ordered, realistic, can delay.
2. Name the four mechanisms of dream work. || Condensation, displacement, symbolisation, secondary revision.
3. What is a compromise formation? || A symptom or behaviour that partly expresses a forbidden wish, partly punishes it, and keeps it hidden.
4. What are the ego's three "masters"? || Id, superego and external reality.
:::

:::mcq
Q: In a dream, a woman's boss, her elder brother and her school principal merge into one stern figure. Which mechanism of dream work is this?
- Displacement
- *Condensation
- Secondary revision
- Sublimation
> Several people or ideas compressed into one image is condensation.

Q: Which statement about Freud's legacy is most accurate today?
- Every psychosexual stage has been proven in long-term studies
- *The idea that much mental life is unconscious is broadly supported, while many specific developmental claims are not
- Psychoanalysis has been shown to be the only effective therapy
- The unconscious has been located in the brainstem
> Broad propositions survive; specific stage claims lack support.
:::

## 1.3 Anxiety, conflict and the symptom [core][starting]
In Freud's later theory, anxiety is a **signal**. When a forbidden wish or a frightening memory starts to rise, the ego feels a small dose of anxiety and switches on a defence. If the defence works, the person feels nothing. If it fails, the anxiety floods through, or a symptom forms.

:::widget flow
{
  "title": "Signal anxiety, step by step",
  "layout": "chain",
  "nodes": [
    { "id": "w", "label": "A wish or memory stirs", "detail": "For example, anger at a parent who is also loved, or grief that has never been felt." },
    { "id": "s", "label": "A small dose of anxiety", "detail": "The ego senses danger before the feeling arrives. This is the signal." },
    { "id": "d", "label": "A defence switches on", "detail": "Repression, reaction formation, intellectualisation or another defence pushes the wish back." },
    { "id": "ok", "label": "Calm, at a cost", "detail": "If the defence works, the person feels little. The cost may be rigidity, lost energy or narrowed living." },
    { "id": "sym", "label": "Or a symptom forms", "detail": "If the defence partly fails, a compromise appears: a phobia, a bodily symptom, a ritual. It hides the wish, expresses it a little and punishes it." }
  ],
  "caption": "Anxiety is not the problem in this model. It is the alarm that sets off the defence."
}
:::

### The developmental ladder of fears
Psychodynamic writers describe the danger behind anxiety in a rough order from earliest to latest:
| Danger | The fear in plain words | Often seen in |
|---|---|---|
| **Disintegration** | "I will fall apart, stop existing" | Psychosis, severe trauma, fragile self |
| **Persecutory** | "Something bad will get me" | Paranoid states |
| **Separation, loss of the object** | "The person I need will leave" | Panic, dependent and borderline patterns |
| **Loss of the object's love** | "They will stop loving me" | Depression, people-pleasing |
| **Castration or bodily harm** | "I'll be punished or damaged" (originally Oedipal) | Performance and rivalry anxieties |
| **Superego anxiety** | "I am bad; I deserve punishment" | Guilt, obsessional and depressive patterns |

:::student
The usefulness of this ladder is a simple question to ask yourself in session: **"What is this person most afraid would happen?"** Being abandoned feels very different from being punished, and each calls for a different kind of care.
:::

:::widget worked
{
  "title": "From symptom to conflict: a man who can't stop checking emails",
  "steps": [
    { "q": "The surface: Kabir, 34, a project manager in Bengaluru, checks his work email until 2 am and panics if he misses a message. What does he say he fears?", "a": "That he will miss something and his manager will think he is careless." },
    { "q": "Look for the wish under the fear. What might he also want?", "a": "To rest, to say no, perhaps to be angry at how much is asked of him." },
    { "q": "What would make that wish dangerous for him?", "a": "His father, a strict government officer, praised only perfect results; anger or rest meant contempt. The danger is losing approval (loss of the object's love) and guilt (superego anxiety)." },
    { "q": "So what does the checking do?", "a": "It keeps the wish to rebel out of sight, keeps him safe from criticism, and punishes him with exhaustion. It is a compromise." }
  ],
  "yourTurn": [
    { "q": "Mrs Fernandes, 58, in Goa, has severe nausea every time her son's family visits, though she says she loves the visits. Suggest a possible conflict, using the same steps.", "a": "A possible wish: resentment at being taken for granted, or wanting her own space. The danger: an 'ungrateful' or 'bad mother' feeling (superego) and fear of losing the family's love. The nausea lets her withdraw without admitting the wish. Always rule out medical causes, and hold this as a hypothesis to explore, not a verdict." }
  ]
}
:::

:::clinician
Signal anxiety comes from Freud's 1926 revision of his theory of anxiety, replacing his earlier "toxic" theory in which dammed-up libido turned into anxiety. Modern psychodynamic models of panic (for example the model underlying panic-focused psychodynamic psychotherapy, first tested in a 2007 randomised trial) emphasise conflicts around separation and autonomy and around anger, with panic attacks following unacknowledged angry feelings towards attachment figures. Note the practical point: an anxiety hierarchy of this kind is a hypothesis-generating tool, not a diagnostic test, and it does not replace screening for medical, substance and primary anxiety disorders.
:::

:::recall
1. What does "signal anxiety" mean? || A small dose of anxiety warns the ego that a dangerous wish or memory is rising, and triggers a defence.
2. List the danger situations from earliest to latest. || Disintegration, persecution, separation, loss of love, bodily harm (castration), superego guilt.
3. What one question captures the use of this ladder? || What is this person most afraid would happen?
:::

:::mcq
Q: A young woman has panic attacks whenever her husband travels for work, and becomes clingy before each trip. Which danger best fits?
- Superego anxiety
- *Separation, fear of losing the person she needs
- Disintegration anxiety
- Castration anxiety
> Panic around separation from an attachment figure points to separation anxiety.
:::

## 1.4 Attachment: the starting picture [core][starting]
Attachment theory came from a psychoanalyst, **John Bowlby**, who looked at real children separated from their parents in hospitals and war-time evacuations. He concluded that the need for a protective person is a **built-in survival system**, not a by-product of feeding.

### Bowlby's key ideas
- **Secure base**: the caregiver as a safe place to explore from.
- **Safe haven**: the caregiver as the place to return to when frightened.
- **Protest, despair, detachment**: the three stages of a young child's response to a long separation (cries and searches; gives up and grieves; seems not to care, and may ignore the parent on return).
- **Internal working models**: from repeated experience, the child forms an inner expectation of others ("people come when I need them") and of the self ("I am worth coming for").

:::widget flow
{
  "title": "The circle of security: base and haven",
  "layout": "cycle",
  "nodes": [
    { "id": "base", "label": "Secure base", "detail": "Feeling safe, the child moves away to explore, checking back now and then." },
    { "id": "explore", "label": "Explores", "detail": "Play, curiosity, learning. The attachment system is quiet." },
    { "id": "threat", "label": "Threat or tiredness", "detail": "A loud noise, a stranger, a fall. The attachment system switches on." },
    { "id": "haven", "label": "Safe haven", "detail": "The child returns to the caregiver for comfort." },
    { "id": "soothed", "label": "Comforted", "detail": "A sensitive response calms the child. Calm switches the attachment system off, and exploring can start again." }
  ],
  "caption": "Each turn of the circle teaches the child what to expect of others and of itself."
}
:::

### Mary Ainsworth and sensitivity
Ainsworth watched mothers and babies at home in **Uganda** and then in **Baltimore**. The best predictor of a secure child was **maternal sensitivity**: noticing the baby's signals, reading them correctly and responding promptly and fittingly. She built the **Strange Situation**, a short laboratory sequence of separations and reunions, to see how a one-year-old uses the parent under mild stress.

:::widget guess
{
  "prompt": "The Strange Situation is a series of short episodes of separation and reunion. How long does a standard episode last?",
  "min": 1,
  "max": 15,
  "unit": "minutes",
  "answer": [2, 4],
  "reveal": "About three minutes each, over eight episodes, cut short if the baby becomes too distressed. The key moments to watch are the two reunions.",
  "clinician": "Eight episodes of roughly three minutes; separation episodes are curtailed if the infant is highly distressed. Classification rests mainly on reunion behaviour (proximity seeking, contact maintaining, avoidance, resistance), not on how much the infant cries at separation."
}
:::


:::widget strange
{
 "title": "Watch the reunions",
 "caption": "The secure baby protests, then is soothed and returns to play; the avoidant baby looks away; the ambivalent baby clings and resists at once; the disorganised baby freezes or approaches backwards. Notice that the leaving matters far less than the coming back."
}
:::

:::trap Crying is not the test
Exams try to trick you: a baby who does not cry when the mother leaves is not "secure and confident". Classification depends on **what happens at the reunion**. An avoidant infant often has a raised heart rate while looking calm.
:::

:::widget decide
{
  "scene": "In a crèche in Chennai, 14-month-old Aarav barely looks up when his mother leaves. When she returns, he turns away and keeps playing with blocks, though his teacher says he is “very independent”.",
  "ask": "What is the best reading of this?",
  "choices": [
    { "label": "He is securely attached and unusually confident", "verdict": "harm", "outcome": "The team praises his independence and nobody looks at the relationship.", "why": "Ignoring the parent at reunion is the hallmark of avoidant attachment, not security. Calm behaviour can hide physiological stress." },
    { "label": "This looks like an avoidant pattern; it is worth understanding the care he gets, without blaming the mother", "verdict": "best", "outcome": "A gentle conversation shows his mother is depressed and has learned to keep him at a distance to cope. She is offered help.", "why": "Avoidance is a sensible adaptation to care that has felt unavailable. It points towards support, not judgment." },
    { "label": "Diagnose reactive attachment disorder", "verdict": "ok", "outcome": "The label is premature and frightens the family.", "why": "An attachment style is not a disorder. Reactive attachment disorder needs evidence of grossly insufficient care and a consistent pattern of not seeking comfort." }
  ]
}
:::

:::clinician
Internal working models are best treated as procedural, largely non-conscious expectations about the availability of others and the worthiness of self, which bias attention, memory and interpretation in relationships. Cross-cultural Strange Situation studies show secure attachment as the modal pattern in most samples, with variation in the distribution of insecure categories (more resistant classifications in some Japanese and Israeli kibbutz samples, more avoidant in some north German samples, as a 1988 cross-cultural meta-analysis of Strange Situation studies showed). In India, care is often shared among grandparents, aunts and older siblings; attachment can be secure to several figures, and the "primary caregiver" may not be the mother. Ask who actually cares for the child.
:::

:::recall
1. What is a secure base and a safe haven? || Secure base: a safe place to explore from. Safe haven: the place to return to when frightened.
2. Name Bowlby's three stages of response to prolonged separation. || Protest, despair, detachment.
3. What best predicted secure attachment in Ainsworth's work? || Caregiver sensitivity: noticing, reading and responding promptly and fittingly to the baby's signals.
4. In the Strange Situation, which moments matter most for classification? || The reunions.
:::

:::mcq
Q: Which statement about the Strange Situation is correct?
- An infant who does not cry at separation is classed as secure
- *Classification rests mainly on the infant's behaviour at reunion
- It is used to diagnose autism
- It was designed for adolescents
> Reunion behaviour, not separation distress, is the key.
:::

## 1.5 Level check · Starting [core][starting]
Score 80% or more to open the Beginner level.

:::mcq
Q: Which idea is shared by almost all psychodynamic schools?
- Behaviour is controlled only by rewards and punishments
- *Much of mental life is outside awareness and can be in conflict
- Symptoms are caused only by brain chemistry
- The past has no effect on the present
> Unconscious processes and inner conflict run through all the schools.

Q: Psychoanalysis differs from psychodynamic psychotherapy mainly in:
- Being based on learning theory
- *Its intensity: several sessions a week, often on the couch, over years
- Never discussing the past
- Being given only by psychiatrists
> Psychoanalysis is the intensive form within the wider psychodynamic family.

Q: Thinking that is illogical, wish-driven and full of images, as in dreams, is called:
- Secondary process
- *Primary process
- Reality principle
- Sublimation
> Primary process is the id's mode of thinking.

Q: Which principle does the ego follow?
- Pleasure principle
- *Reality principle
- Nirvana principle
- Constancy of drives
> The ego delays satisfaction until it is safe and possible.

Q: The dream as the dreamer remembers it is the:
- Latent content
- *Manifest content
- Day residue only
- Primary gain
> The remembered story is manifest; the hidden wish is latent.

Q: On waking, a man's dream becomes a tidy story with a beginning and end. This is:
- Condensation
- Symbolisation
- *Secondary revision
- Displacement
> The mind organises the dream into a coherent narrative.

Q: A symptom that partly expresses a wish, partly punishes it and keeps it hidden is a:
- Primary process
- *Compromise formation
- Transference
- Reaction formation only
> The classic psychodynamic understanding of a neurotic symptom.

Q: In Freud's later theory, anxiety is mainly:
- Dammed-up sexual energy
- *A signal that triggers defences
- Caused only by real danger
- A sign of psychosis
> Signal anxiety warns the ego.

Q: A man fears that if he relaxes he will be found to be bad and deserve punishment. The danger is:
- Separation
- Disintegration
- *Superego guilt
- Persecution from outside
> Inner moral punishment is superego anxiety.

Q: Which person founded attachment theory?
- Melanie Klein
- *John Bowlby
- Heinz Kohut
- Albert Bandura
> Bowlby, a psychoanalyst, built attachment theory from observing separated children.

Q: A two-year-old in hospital for a month first cries for his mother, then becomes listless, then seems to ignore her when she visits. This sequence is:
- Secure, avoidant, ambivalent
- *Protest, despair, detachment
- Oral, anal, phallic
- Denial, anger, bargaining
> Bowlby's three stages of response to prolonged separation.

Q: In Ainsworth's work, the strongest predictor of a secure infant was:
- The family's income
- *Caregiver sensitivity to the infant's signals
- How early the infant walked
- Breastfeeding versus bottle feeding
> Sensitive responsiveness predicted security.

Q: A toddler ignores his mother when she returns in the Strange Situation but keeps playing. The most likely classification is:
- Secure
- *Avoidant
- Ambivalent (resistant)
- Normal for all toddlers
> Avoiding the parent at reunion defines avoidant attachment.

Q: An inner expectation such as "people come when I need them" is called:
- A defence mechanism
- *An internal working model
- A compromise formation
- A superego introject only
> Bowlby's term for templates of self and others.
:::

# Part II · Beginner: the schools and the room

## 2.1 Ego psychology: defences as adaptation [core][beginner]
Ego psychology moved the spotlight from the wild id to the **ego as the organ of adaptation**. Its question is not only "what is the conflict?" but "**how well is this person coping, and with what tools?**"


:::widget timeline
{
 "prompt": "Put the main psychodynamic ideas in the order they appeared.",
 "events": [
  {
   "label": "Freud's topographic model: conscious, preconscious and unconscious",
   "when": "1900"
  },
  {
   "label": "Freud's structural model: id, ego and superego",
   "when": "1923"
  },
  {
   "label": "Anna Freud sets out the defences of the ego",
   "when": "1936"
  },
  {
   "label": "Klein describes the paranoid-schizoid position",
   "when": "1946"
  },
  {
   "label": "Bowlby's first account of the child's tie to the mother",
   "when": "1958"
  },
  {
   "label": "Kernberg describes borderline personality organisation",
   "when": "1967"
  },
  {
   "label": "Kohut's self psychology of narcissism",
   "when": "1971"
  },
  {
   "label": "Mentalisation-based treatment for borderline personality disorder",
   "when": "1990s to 2000s"
  }
 ],
 "why": "Each school answered a gap in the one before: from drives and conflict, to the ego's coping, to relationships inside the mind, to the self, to the capacity to understand minds."
}
:::

### The key contributors
- **Anna Freud** systematised the defences in 1936 and described defences such as identification with the aggressor and altruistic surrender.
- **Heinz Hartmann** argued that much of the ego works without conflict (the **conflict-free sphere**: perception, memory, language, motor skill) and develops in an **average expectable environment**.
- **George Vaillant** followed Harvard men across their adult lives and found that **mature defences predicted better health, work and relationships** decades later.

### Ego functions: a checklist you can use
Clinicians assess ego strength across functions. A practical list:
| Function | Ask yourself |
|---|---|
| **Reality testing** | Can they tell inner experience from outer reality? |
| **Judgement** | Do they foresee consequences? |
| **Regulation of impulses and feelings** | Can they feel strongly without acting on it? |
| **Object relations** | Are relationships stable, with others seen as whole people? |
| **Thought processes** | Is thinking organised under stress? |
| **Defensive functioning** | Which defences, how flexible, how mature? |
| **Mastery and competence** | Can they get things done? |
| **Synthetic function** | Can they hold contradictions together into a whole sense of self? |


:::widget dissonance
{
 "belief": "I am a fair and honest manager.",
 "behaviour": "I gave the promotion to my nephew over a stronger candidate.",
 "title": "Rationalisation seen from two traditions",
 "caption": "Social psychology calls the easy route, 'He will be more loyal, and the other one would have left anyway', dissonance reduction. Ego psychology calls the same move rationalisation, a disavowal-level defence. The difference is mainly about awareness: dissonance research shows it in ordinary people in the lab, while the defence idea adds that the motive is kept out of awareness."
}
:::

### Defensive functioning: going deeper than Module 3
Module 3 gave you four maturity levels. Researchers use a finer seven-level ladder from the DSM-IV appendix's Defensive Functioning Scale. The point is not to memorise every name: it is to see that **defences cluster**, and the overall level predicts how a person copes.
:::widget layers
{
  "title": "The seven-level defence ladder, most adaptive at the top",
  "shape": "stack",
  "layers": [
    { "label": "1 · High adaptive", "detail": "Anticipation, affiliation, altruism, humour, self-assertion, self-observation, sublimation, suppression. Feelings stay in awareness and are handled well." },
    { "label": "2 · Mental inhibitions (compromise)", "detail": "Displacement, dissociation, intellectualisation, isolation of affect, reaction formation, repression, undoing. Ideas or feelings are kept out of awareness." },
    { "label": "3 · Minor image-distorting", "detail": "Devaluation, idealisation, omnipotence. Self-esteem is propped up by bending the picture of self or others a little." },
    { "label": "4 · Disavowal", "detail": "Denial, projection, rationalisation. Unpleasant facts, impulses or responsibility are kept out." },
    { "label": "5 · Major image-distorting", "detail": "Splitting of self or others, projective identification, autistic fantasy. Gross distortion of self and others." },
    { "label": "6 · Action", "detail": "Acting out, apathetic withdrawal, help-rejecting complaining, passive aggression. Stress is dealt with by doing or withdrawing, not by thinking and feeling." },
    { "label": "7 · Defensive dysregulation", "detail": "Delusional projection, psychotic denial, psychotic distortion. The defence breaks with shared reality." }
  ],
  "caption": "Read the overall level, not single defences: everyone uses lower rungs under enough stress."
}
:::

:::widget sort
{
  "prompt": "Place each defence on the coping ladder: more adaptive, middle, or most distorting.",
  "buckets": ["High adaptive", "Middle (inhibitions, disavowal)", "Most distorting (image-distorting, action, psychotic)"],
  "items": [
    { "text": "Anticipation: rehearsing a hard conversation with a parent", "bucket": 0 },
    { "text": "Intellectualisation: discussing a cancer diagnosis only in statistics", "bucket": 1 },
    { "text": "Splitting: one nurse is an angel, another a monster, and it flips", "bucket": 2 },
    { "text": "Affiliation: turning to friends for support and saying so", "bucket": 0, "why": "Seeking help while owning the feeling is high adaptive." },
    { "text": "Rationalisation: “I didn't get the job because the panel was biased”", "bucket": 1 },
    { "text": "Help-rejecting complaining: asks for advice and dismisses every suggestion", "bucket": 2, "why": "An action-level defence: hostility is expressed through the helper's frustration." },
    { "text": "Psychotic denial: insists a dead son is alive and will return for dinner", "bucket": 2 }
  ]
}
:::

:::example Identification with the aggressor, in a Delhi school
Rohan, 12, was bullied for a year. Now in a new school he mocks smaller boys in exactly the words used on him. Anna Freud described this: by **becoming** the frightening person, the child turns passive fear into active control. Punishment alone will not touch the fear underneath.
:::

:::clinician
The Defense Mechanism Rating Scales (DMRS; Perry) code defences from transcripts and yield an Overall Defensive Functioning score, which tends to rise with successful dynamic therapy and correlates with symptom improvement (for example in a 2012 study of long-term dynamic psychotherapy). Vaillant's Grant Study findings (reported in 1977 and again in 2012) are observational and based on a sample of privileged white American men, so treat their generality with caution. Ego strength is a clinical rather than a psychometric concept, but it is decisive in selection for brief expressive therapy versus supportive work: low reality testing, poor impulse control and unstable object relations point towards a more supportive, structured approach.
:::

:::recall
1. What shift did ego psychology make? || From the id and conflict to the ego as the organ of adaptation and coping.
2. What is Hartmann's conflict-free sphere? || Ego functions such as perception, memory, language and motor skill that develop without conflict.
3. What did Vaillant's adult development study find about mature defences? || They predicted better health, work and relationships later in life.
4. Name five ego functions. || Reality testing, judgement, impulse and affect regulation, object relations, thought processes (also defensive functioning, mastery, synthetic function).
5. What is identification with the aggressor? || Becoming like the frightening person to turn passive fear into active control (Anna Freud).
:::

:::mcq
Q: A patient's ability to tell her inner fears from what is actually happening outside is assessed as:
- Synthetic function
- *Reality testing
- Sublimation
- Mastery
> Reality testing separates inner experience from outer reality.

Q: A man asks his therapist for advice every week and rejects every idea, while complaining nothing helps. On the defensive functioning ladder this is:
- High adaptive
- Mental inhibition
- *Action level
- Psychotic level
> Help-rejecting complaining is an action-level defence.
:::

## 2.2 Object relations: Klein, Winnicott and Kernberg [core][beginner]
"Object" here means **a person, or the inner picture of a person**, who is the target of feeling. Object relations theory says the mind is built from **inner relationships**: a self linked to another by a feeling ("a small me, a cold mother, and fear").

### Melanie Klein: the infant's inner theatre
- **Unconscious phantasy**: from the start, the infant has raw inner stories about good and bad.
- **Paranoid-schizoid position**: early on, experience is **split** into all-good and all-bad (the "good breast" that feeds and the "bad breast" that frustrates). The main fear is of being attacked.
- **Depressive position**: later, the child realises the loved and the hated mother are **the same person**. This brings guilt, concern and the wish to repair (**reparation**). The main fear is of having harmed someone loved.
- **Projective identification**: putting an unbearable part of oneself into another person, who is then pressured to feel or act it.
- **Envy and gratitude**: envy attacks the good thing because it is good and not one's own.

Klein called these **positions**, not stages, because adults move back and forth between them throughout life.

:::widget compare
{
  "title": "Freud's drive model versus object relations",
  "a": {
    "label": "Classical drive model (Freud)",
    "points": ["The engine of the mind is drives: sex and aggression seeking discharge", "Other people matter as targets of drives ('objects')", "Conflict is between wish, conscience and reality", "Key developmental moment: the Oedipal phase, around 3 to 6", "The analyst is a neutral screen; transference shows displaced wishes"],
    "summary": "Symptoms are compromises between forbidden wishes and the forces against them."
  },
  "b": {
    "label": "Object relations (Klein, Winnicott, Fairbairn, Kernberg)",
    "points": ["The engine of the mind is the need for relationships", "Inner pictures of self and others, linked by feeling, make up the mind", "Conflict is between loving and hating the same person, and between split images", "Key developmental moments: the first years, splitting and integration", "The therapist's own feelings (countertransference) are central data"],
    "summary": "Symptoms come from the inner world of relationships we carry and repeat."
  },
  "caption": "Most clinicians today use both: what a person wishes, and with whom they keep repeating it."
}
:::

:::analogy The two positions on a bad day
You wait for a friend who is late. In the paranoid-schizoid mood: "She doesn't care. She's always been selfish." In the depressive mood: "I'm upset she's late, and she's also the friend who stayed with me in hospital." Same friend; one view splits, the other holds both.
:::

### Projective identification: three uses
| Use | What happens | In the room |
|---|---|---|
| **Communication** | The therapist is made to feel what the patient cannot put into words | You feel inexplicably hopeless with a patient who says she is "fine" |
| **Evacuation** | Getting rid of an unbearable feeling | A patient accuses you of being angry while he is the one seething |
| **Control** | Controlling the other through the projected part | You find yourself acting harshly towards a patient who expects harshness |

**Wilfred Bion** added **container and contained**: a mother (or therapist) takes in the infant's raw distress, digests it and gives it back in bearable form. Much of therapy is containment.

:::widget flow
{
  "title": "Containment: how raw distress becomes thinkable",
  "layout": "cycle",
  "nodes": [
    { "id": "raw", "label": "Raw distress", "detail": "The infant (or patient) has a feeling too big to think about: terror, rage, nameless dread." },
    { "id": "in", "label": "Put into the carer", "detail": "Through crying, or through projective identification, the carer is made to feel some of it." },
    { "id": "dig", "label": "Carer digests it", "detail": "The carer stays calm enough to feel it, think about it and give it meaning. Bion called this the alpha function." },
    { "id": "back", "label": "Returned bearable", "detail": "A soothing voice, a named feeling: 'You're frightened because I went out of the room.'" },
    { "id": "own", "label": "Capacity taken in", "detail": "Over many rounds, the child takes in the ability to hold and think about its own feelings." }
  ],
  "caption": "When the carer cannot contain, the feeling comes back worse, as Bion put it, as 'nameless dread'."
}
:::

### Donald Winnicott: the facilitating environment
- "**There is no such thing as a baby**": only a baby with someone caring for it.
- **Good-enough mother**: adapts closely at first, then fails in small, bearable ways that let the child grow.
- **Holding environment**: physical and emotional holding that makes the infant feel safe and in one piece. Therapy provides a holding frame.
- **Transitional object**: the blanket or teddy that is neither fully "me" nor fully "not me"; the root of play and culture.
- **True and false self**: if the environment demands compliance, the child builds a **false self** to please, hiding the spontaneous true self.
- **Capacity to be alone**: learned by being alone in the presence of someone safe.

:::widget decide
{
  "scene": "Sneha, 30, a teacher in Hyderabad, tells you at the first session that you are “the first person who has ever really understood me”. Three weeks later, after you reschedule one session, she messages: “You're just like all the others. You never cared.”",
  "ask": "What is the most useful way to understand and respond?",
  "choices": [
    { "label": "Apologise at length and promise never to reschedule again", "verdict": "ok", "outcome": "She calms down, but the next small frustration brings the same storm.", "why": "Reassurance soothes for a moment but does not help her hold both views of you at once." },
    { "label": "See splitting: you were all good, now all bad. Stay steady, acknowledge her hurt, and later help her notice that both feelings are about the same person", "verdict": "best", "outcome": "Over months she starts to say, “I'm furious with you, and I know you're still on my side.”", "why": "Surviving the attack without retaliating or collapsing, and helping her integrate, is the Kleinian move from paranoid-schizoid towards depressive functioning." },
    { "label": "Tell her she is being manipulative and you will not tolerate it", "verdict": "harm", "outcome": "She feels confirmed that people turn on her and leaves therapy.", "why": "Retaliation acts out the countertransference and repeats the rejection she expects." }
  ]
}
:::

### Otto Kernberg: levels of personality organisation
Kernberg combined ego psychology and object relations into a practical way to judge **how a personality is organised**, regardless of the diagnosis.
| | Neurotic | Borderline | Psychotic |
|---|---|---|---|
| **Identity** | Integrated | **Identity diffusion** (contradictory, unstable self and others) | Diffuse |
| **Defences** | Repression and higher-level defences | **Splitting** and primitive defences | Primitive defences |
| **Reality testing** | Intact | **Intact**, may lapse under stress | **Lost** |

:::trap Borderline organisation is not the same as borderline personality disorder
Kernberg's **borderline personality organisation** is a wide band that includes many personality disorders (narcissistic, antisocial, paranoid and others). DSM **borderline personality disorder** is one specific diagnosis.
:::

:::clinician
Kleinian "positions" are best taught as modes of experiencing rather than developmental claims about neonates, which are untestable. The clinical value lies in recognising splitting and projective identification in the countertransference, and in the move towards integration as a therapeutic aim. Kernberg's structural interview and the derived Structured Interview of Personality Organization (STIPO) operationalise identity, defences and reality testing; transference-focused psychotherapy (TFP) is the treatment built on this model: a 2007 randomised comparison with DBT and supportive therapy found that all three improved, with TFP showing more change in reflective function. The ICD-11 and DSM-5-TR Alternative Model level-of-personality-functioning dimension (self: identity, self-direction; interpersonal: empathy, intimacy) owes much to this tradition.
:::

:::recall
1. What does "object" mean in object relations? || A person, or the inner representation of a person, who is the target of feeling.
2. Contrast the paranoid-schizoid and depressive positions. || Splitting into all-good and all-bad with fear of attack, versus seeing the whole person with guilt, concern and reparation.
3. Give the three uses of projective identification. || Communication, evacuation, control.
4. What did Bion mean by containment? || Taking in raw distress, digesting it and returning it in bearable form.
5. Define Winnicott's false self. || A compliant self built to please the environment, hiding the spontaneous true self.
6. Name Kernberg's three levels and how reality testing differs. || Neurotic (intact), borderline (intact, may lapse under stress), psychotic (lost).
:::

:::mcq
Q: A child carries a frayed blanket everywhere and cannot sleep without it. In Winnicott's terms this is:
- A false self
- *A transitional object
- Splitting
- A selfobject failure
> Neither fully me nor not-me: the transitional object.

Q: A patient has an unstable sense of who she is, uses splitting, but knows clearly what is real. Kernberg would place her in:
- Neurotic organisation
- *Borderline organisation
- Psychotic organisation
- Normal organisation
> Identity diffusion plus primitive defences with intact reality testing.

Q: After a session, a therapist feels unusually hopeless and heavy, though the patient said she was "fine". The most useful Kleinian idea is:
- Sublimation
- *Projective identification used as communication
- Reaction formation
- Secondary gain
> The therapist may be feeling what the patient cannot yet put into words.
:::

## 2.3 Self psychology: Kohut [core][beginner]
**Heinz Kohut** worked with narcissistic patients who did not fit the conflict model. They did not seem driven by forbidden wishes. They seemed **fragile, easily deflated, and hungry for recognition**. He concluded that the self needs others to grow, in the way the body needs oxygen.

### Selfobjects
A **selfobject** is another person experienced as part of one's own self, doing a job the self cannot yet do alone. Kohut named three selfobject needs:
| Need | What the child needs | When it goes right | When it fails |
|---|---|---|---|
| **Mirroring** | A face that lights up at the child: "you are wonderful" | Healthy ambition and self-esteem | Craving for admiration, fragile grandiosity |
| **Idealising** | A calm, strong figure to look up to and merge with | Values, ideals, self-soothing | Searching for gurus; collapse when heroes disappoint |
| **Twinship (alter ego)** | Someone "like me" | Belonging, sense of being human among humans | Feeling alien, different from everyone |

### Optimal frustration and transmuting internalisation
Caregivers inevitably fail sometimes. If the failures are **small and repaired**, the child gradually takes over the function (soothing, valuing itself). Kohut called this **transmuting internalisation**. If failures are big or unrepaired, the self stays **fragile** and prone to **fragmentation** (feeling scattered, empty, enraged) when slighted. **Narcissistic rage** is the fury of a self that has been wounded.

:::widget flow
{
  "title": "Rupture and repair in self psychology",
  "layout": "cycle",
  "nodes": [
    { "id": "tie", "label": "Selfobject tie", "detail": "The patient feels mirrored or steadied by the therapist, often without saying so." },
    { "id": "fail", "label": "Empathic failure", "detail": "A late start, a missed cue, a holiday. Small, inevitable failures." },
    { "id": "frag", "label": "Fragmentation or rage", "detail": "The self feels scattered, empty or furious. Symptoms may flare." },
    { "id": "rec", "label": "Failure recognised", "detail": "The therapist names their part and the meaning it had, without defending or blaming." },
    { "id": "rep", "label": "Repair", "detail": "The tie is restored, and the old wound behind the reaction can be understood." },
    { "id": "int", "label": "Function taken in", "detail": "Transmuting internalisation: a little more self-soothing and self-valuing now belongs to the patient." }
  ],
  "caption": "Kohut saw these small, repaired breaks as the engine of change, not as mistakes to avoid at all costs."
}
:::

:::sounds How a fragile self sounds
- "When my manager didn't mention my name in the meeting, I felt like I'd disappeared. I couldn't work for the rest of the day."
- "I need my boyfriend to text me every hour. When he doesn't, I feel like I'm falling to pieces."
- "Everyone else seems to know how to be a person. I feel like I'm from another planet." (a twinship need)
:::

### Kohut versus Kernberg on narcissism
| | Kohut | Kernberg |
|---|---|---|
| Narcissism is | A **developmental arrest**: unmet selfobject needs | A **pathological defensive structure** against envy and rage |
| Grandiosity | An unmet normal need, left over from childhood | A defence: the grandiose self |
| Therapist stance | **Empathic immersion**; allow the idealising or mirroring transference to unfold | **Confront and interpret** the grandiose self and the hidden aggression |
| Rupture | Explore the empathic failure and repair it | Interpret the envious attack |

:::widget sort
{
  "prompt": "Which theorist would say it? Kohut or Kernberg.",
  "buckets": ["Kohut (self psychology)", "Kernberg (object relations)"],
  "items": [
    { "text": "His grandiosity is a leftover healthy need that was never mirrored", "bucket": 0 },
    { "text": "His contempt for others protects him from envy of what they have", "bucket": 1 },
    { "text": "When she raged after I was late, I first acknowledged that I had let her down", "bucket": 0, "why": "Empathic failure, then repair: Kohut's sequence." },
    { "text": "I need to point out how she devalues me, and the aggression in it", "bucket": 1 },
    { "text": "Let the idealising transference develop; don't interpret it too early", "bucket": 0 },
    { "text": "The grandiose self is a pathological fusion of real, ideal and fantasied selves", "bucket": 1 }
  ]
}
:::

:::widget decide
{
  "scene": "Vikram, 38, a successful surgeon in Mumbai, comes in furious. You arrived five minutes late. “If this is how you value my time, I'm not sure what we're doing here.” He has told you before that his father only noticed his exam rankings.",
  "ask": "Thinking like a self psychologist, what is the first move?",
  "choices": [
    { "label": "Explain that five minutes is minor and he is overreacting", "verdict": "harm", "outcome": "He feels dismissed exactly as with his father. The session turns cold.", "why": "Correcting the reaction repeats the empathic failure instead of repairing it." },
    { "label": "Acknowledge you were late and that it seemed to say he doesn't matter here; ask what that was like for him", "verdict": "best", "outcome": "His anger softens. He talks about waiting outside his father's study as a boy.", "why": "Recognising the empathic break and its meaning repairs the selfobject tie and opens the old wound to understanding." },
    { "label": "Stay silent and wait to see what comes up", "verdict": "ok", "outcome": "He fills the silence with more complaints and leaves feeling unseen.", "why": "Silence has a place, but a fragile self after a rupture usually needs active recognition first." }
  ]
}
:::

:::clinician
Kohut's later work (1977 and 1984) described mirror, idealising and twinship transferences, and a therapeutic sequence of understanding followed by explanation. Self psychology fed into intersubjective and relational schools (Stolorow, Mitchell), which treat the therapy as co-created by two subjectivities. Empirically, rupture-and-repair in the alliance is well supported as a process: a 2018 meta-analysis found that repair of alliance ruptures is associated with better outcomes, across therapy models. This gives some empirical backing to Kohut's emphasis, though not to his developmental theory as such.
:::

:::recall
1. What is a selfobject? || Another person experienced as part of the self, performing a function the self cannot yet do alone.
2. Name Kohut's three selfobject needs. || Mirroring, idealising, twinship (alter ego).
3. What is transmuting internalisation? || Gradually taking over a selfobject function after small, repaired failures.
4. How do Kohut and Kernberg differ on narcissism? || Kohut: developmental arrest from unmet needs, treated with empathy. Kernberg: defensive structure against envy and rage, treated with confrontation and interpretation.
:::

:::mcq
Q: A young man feels he does not belong anywhere and is "from another planet". In Kohut's terms, the unmet need is:
- Mirroring
- Idealising
- *Twinship
- Containment
> Twinship is the need to feel like others.

Q: After a session ends early, a patient becomes enraged and says she feels "in pieces". Kohut would call this:
- A depressive position
- *Fragmentation and narcissistic rage after an empathic failure
- Reaction formation
- An oral fixation
> A fragile self fragments and rages when the selfobject tie breaks.
:::

## 2.4 Attachment in depth: from infants to adults [core][beginner]
Module 3 gave you the four infant patterns. Here is how the field followed those infants into adulthood, and why it matters clinically.

### The fourth pattern: disorganised
**Mary Main and Judith Solomon** noticed infants who did not fit the three Ainsworth patterns: they froze, approached with the head turned away, or fell to the floor at reunion. This **disorganised** attachment is thought to arise when the caregiver is **both the source of fear and the only source of comfort**: a frightening, or frightened, parent. It is strongly linked to later **dissociation** and difficulty regulating feelings.

### The Adult Attachment Interview (AAI)
The AAI asks an adult about childhood relationships with parents ("Give me five words to describe your relationship with your mother... Now a memory for each word"). What is scored is **not what happened** but **how coherently the person tells it**.
| AAI category | How it sounds | Infant pattern their child tends to show |
|---|---|---|
| **Secure-autonomous** | Coherent, balanced, can describe hurt and love together; values relationships | Secure |
| **Dismissing** | Idealises parents ("perfect childhood") but cannot give memories; minimises: "I don't remember, it didn't affect me" | Avoidant |
| **Preoccupied** | Long, tangled, still angry or passive, past and present mixed: "and even now she..." | Ambivalent (resistant) |
| **Unresolved/disorganised** | Lapses in reasoning when discussing loss or trauma (speaks of a dead person as alive, long silences, odd detail) | Disorganised |

:::widget sort
{
  "prompt": "These are lines from Adult Attachment Interviews. Sort each by its most likely category.",
  "buckets": ["Secure-autonomous", "Dismissing", "Preoccupied", "Unresolved"],
  "items": [
    { "text": "“My mother was wonderful. Normal. A great mother. Memories? I don't really remember any.”", "bucket": 1, "why": "Idealising words with no supporting memories is the classic dismissing pattern." },
    { "text": "“My father could be harsh, and I was scared of him at times. Looking back, I think he was frightened about money. We're closer now.”", "bucket": 0 },
    { "text": "“And she still does it, just last Sunday at lunch she said in front of everyone... you know what she's like, she always...”", "bucket": 2, "why": "Angry, entangled, drifting into the present: preoccupied." },
    { "text": "“My grandmother died when I was nine. She... she is still waiting for me in the kitchen, I think, when I go home.”", "bucket": 3, "why": "A lapse in monitoring of reason when discussing a loss suggests unresolved status." },
    { "text": "“It didn't affect me at all. I was independent from a young age. Next question.”", "bucket": 1 },
    { "text": "“I was lonely as a child; my parents both worked long shifts. It's made me want to be home more for my own kids.”", "bucket": 0, "why": "A painful past told coherently and reflectively: earned security is possible." }
  ]
}
:::

### Intergenerational transmission
Parents' AAI categories predict their infants' Strange Situation classifications strongly. How it passes on is only partly understood: parental **sensitivity** explains some of it; the rest is called the "**transmission gap**". **Mentalising** (the parent's ability to think about the baby's mind; Fonagy and colleagues called this reflective function) helps fill the gap.

:::widget flow
{
  "title": "From a parent's story to a baby's pattern",
  "layout": "chain",
  "nodes": [
    { "id": "aai", "label": "Parent's state of mind", "detail": "How coherently the parent can think and talk about their own childhood (scored on the Adult Attachment Interview)." },
    { "id": "rf", "label": "Reflective function", "detail": "The parent's capacity to see the baby as a person with feelings and intentions, not just behaviour." },
    { "id": "sens", "label": "Sensitive care", "detail": "Noticing, reading and answering the baby's signals promptly and fittingly." },
    { "id": "inf", "label": "Infant's pattern", "detail": "Secure, avoidant, ambivalent or disorganised in the Strange Situation." },
    { "id": "iwm", "label": "Child's working model", "detail": "Expectations of self and others carried into later relationships, open to change by new experience." }
  ],
  "edgeLabels": { "rf>sens": "partly explains", "sens>inf": "the transmission gap sits here" },
  "caption": "Sensitivity carries only part of the link. Frightened or frightening parenting, and temperament, add to it."
}
:::

:::widget guess
{
  "prompt": "In meta-analysis, when a parent is secure versus insecure on the Adult Attachment Interview, in roughly what percentage of cases does the infant's Strange Situation pattern match (secure versus insecure)?",
  "min": 30,
  "max": 100,
  "step": 5,
  "unit": "%",
  "answer": [70, 80],
  "reveal": "About three quarters. That is high for psychology, but it also means about a quarter do not match, so attachment is not destiny.",
  "clinician": "A 1995 meta-analysis (18 samples, n about 850) found roughly 75% correspondence for secure versus insecure classifications, with sensitivity accounting for only a modest part of the association, giving rise to the 'transmission gap'. A 2016 meta-analysis using larger, more diverse samples found a weaker but still significant association that has declined in more recent and high-risk samples. Teach it as a meaningful tendency, not a law."
}
:::

### Adult romantic attachment: a second tradition
Social psychologists **Hazan and Shaver** (1987) applied attachment to adult love using self-report. **Bartholomew and Horowitz** (1991) crossed a model of **self** (worthy or not) with a model of **others** (available or not):
| | Others seen positively | Others seen negatively |
|---|---|---|
| **Self seen positively** | **Secure**: comfortable with closeness and autonomy | **Dismissing**: self-reliant, avoids closeness |
| **Self seen negatively** | **Preoccupied**: craves closeness, fears rejection | **Fearful**: wants closeness but fears it, avoids |

Modern measures usually score two dimensions instead of boxes: **anxiety** (fear of rejection) and **avoidance** (discomfort with closeness).

:::trap Two traditions, two kinds of measure
The AAI (developmental, interview, scores **coherence of narrative** about parents) and romantic attachment questionnaires (social psychology, self-report about **partners**) correlate only weakly. Do not treat "dismissing on the AAI" and "dismissing on a questionnaire" as the same finding.
:::

:::clinician
Clinically relevant findings: disorganised infant attachment is over-represented in maltreated samples and predicts later dissociative symptoms and externalising problems, but it is not a diagnosis and many disorganised infants have not been maltreated (frightened or frightening parental behaviour, unresolved parental loss). Attachment-based interventions with good evidence include video-feedback to promote positive parenting (VIPP-SD) and Attachment and Biobehavioral Catch-up (ABC). Mentalization-based treatment (developed by Bateman and Fonagy and tested in randomised trials in borderline personality disorder in 1999 and 2009) translates attachment and mentalising theory into therapy. Indian data are limited and mostly questionnaire-based; joint families and multiple caregivers mean the "primary attachment figure" may be a grandmother or aunt, and many measures were normed in Western samples, so interpret cautiously.
:::

:::recall
1. What kind of caregiving is thought to underlie disorganised attachment? || A caregiver who is both frightening (or frightened) and the only source of comfort.
2. What does the Adult Attachment Interview score? || The coherence of the adult's narrative about childhood relationships, not the events themselves.
3. Give the four AAI categories with the infant pattern each predicts. || Secure-autonomous to secure; dismissing to avoidant; preoccupied to ambivalent; unresolved to disorganised.
4. What is the transmission gap? || The part of the link between parent and infant attachment that sensitivity does not explain.
5. Name Bartholomew and Horowitz's four adult styles. || Secure, preoccupied, dismissing, fearful.
:::

:::mcq
Q: An adult describes her childhood as "perfect, normal, very happy" but cannot recall a single memory to support it, and says the past "didn't affect" her. Her AAI classification is most likely:
- Secure-autonomous
- *Dismissing
- Preoccupied
- Unresolved
> Idealisation without support, with minimising of attachment, is dismissing.

Q: A man wants a close relationship but believes he is unlovable and that others will hurt him, so he keeps away. In Bartholomew's model he is:
- Secure
- Preoccupied
- Dismissing
- *Fearful
> Negative self and negative other: fearful.
:::

## 2.5 Transference, countertransference and resistance [core][beginner]
These three ideas are the engine room of psychodynamic work. Module 3 defined transference and countertransference in a line each; here is how they actually work.

### Transference, in more detail
**Transference** is the patient's experience of the therapist **coloured by templates from earlier relationships**. It happens everywhere (with teachers, doctors, bosses); therapy makes it visible and usable.
| Type | What it looks like |
|---|---|
| **Positive** | Warmth, trust, wish to please. Helps the alliance; can hide criticism |
| **Negative** | Suspicion, hostility, expecting to be let down |
| **Idealising** | The therapist as perfect, all-knowing (common in Indian settings where the healer is a guru figure) |
| **Erotic or eroticised** | Romantic or sexual feelings towards the therapist. Must be explored, never acted upon |
| **Mirror** (Kohut) | Needing the therapist's admiring attention |
| **Transference neurosis** | In long therapy, the patient's core conflict becomes focused on the therapist |

### Countertransference: from obstacle to tool
- **Classical view** (Freud): the therapist's own unresolved conflicts, an obstacle to be removed by personal analysis.
- **Totalist view** (Paula Heimann, 1950): **all** of the therapist's feelings towards the patient, which can be a **source of information** about the patient.
- **Concordant** countertransference (Racker): the therapist feels what the patient feels (identifying with the patient's self).
- **Complementary** countertransference: the therapist feels like the important other in the patient's life (for example the critical parent).
- **Objective** countertransference (Winnicott, "Hate in the countertransference"): the reaction almost anyone would have to this patient's behaviour.

:::widget flow
{
  "title": "The transference and countertransference loop",
  "layout": "cycle",
  "nodes": [
    { "id": "tmpl", "label": "Old template", "detail": "From childhood: 'People in charge criticise me, so I must be perfect and apologise first.'" },
    { "id": "tr", "label": "Transference", "detail": "The patient experiences the therapist through the template: expects criticism, apologises, watches the therapist's face." },
    { "id": "pull", "label": "Pull on the therapist", "detail": "The therapist feels a pressure to play the expected role: irritation, an urge to correct." },
    { "id": "ct", "label": "Countertransference noticed", "detail": "Instead of acting it out, the therapist notices the feeling and uses it as information." },
    { "id": "name", "label": "Pattern named", "detail": "'I wonder if you expect me to be disappointed in you, the way your father was.'" },
    { "id": "new", "label": "New experience", "detail": "The expected response does not come. The template loosens a little each time." }
  ],
  "caption": "If the therapist acts out the pull instead, the loop closes on the old template and the pattern is confirmed."
}
:::

:::widget sort
{
  "prompt": "A patient describes years of being criticised by her father. Sort each therapist reaction.",
  "buckets": ["Concordant (feeling with the patient)", "Complementary (feeling like the other person)"],
  "items": [
    { "text": "You feel small and anxious, as if you too might be told off", "bucket": 0 },
    { "text": "You notice an urge to correct her and tell her she should have known better", "bucket": 1, "why": "You are being pulled into the father's role." },
    { "text": "You feel a lump in your throat as she describes waiting for his verdict on her report card", "bucket": 0 },
    { "text": "You catch yourself feeling impatient and harsh when she apologises again", "bucket": 1 }
  ]
}
:::

### Resistance
**Resistance** is anything in the patient (or in the therapy) that works against the process of change, **usually without the patient intending it**. It is not bad behaviour; it is the defences showing up in the room. Freud described five sources: **repression**, **transference resistance**, **secondary gain** (benefits of being ill), **id resistance** (the pull to repeat), and **superego resistance** (feeling one does not deserve to get better).

How resistance shows:
- Lateness, missed sessions, forgetting fees, wanting to end suddenly.
- Silence, small talk, talking only about others, endless detail.
- Intellectualising: "I know it's from my childhood" with no feeling.
- **Flight into health**: sudden "cure" just as something painful approaches.
- Agreeing with everything the therapist says.


:::widget thoughtrecord
{
 "situation": "In a team meeting in Pune, a senior engineer points out an error in Arjun's code in front of everyone.",
 "thought": "They all think I'm a fraud. I'll never be good enough here.",
 "emotion": "ashamed",
 "traps": [
  {
   "label": "Mind reading",
   "right": true,
   "why": "He is sure he knows what everyone thinks, without asking anyone."
  },
  {
   "label": "Overgeneralising",
   "right": true,
   "why": "One error becomes 'never good enough here'."
  },
  {
   "label": "Catastrophising",
   "why": "Close, but he is not predicting a disaster such as being fired; he is judging himself."
  },
  {
   "label": "Should statements",
   "why": "There is no 'I should' or 'I must' in this thought."
  }
 ],
 "forEvidence": [
  "The error was real and was pointed out publicly.",
  "Nobody spoke up for him in the meeting."
 ],
 "againstEvidence": [
  "Two colleagues asked for his help the same week.",
  "The senior also corrected other people's code that day.",
  "His last review called his work reliable."
 ],
 "balanced": "I made an error, as everyone here does. One public correction does not mean people think I'm a fraud. I can fix it and ask the senior to look at my next change early."
}
:::

:::note The same moment, read psychodynamically
The thought record tests whether Arjun's thought is accurate, and it often brings quick relief. A psychodynamic therapist asks a different question: why does one correction carry so much force? Arjun's father praised him only when he came first and went silent when he did not. The senior engineer now stands in for that father, and the shame belongs partly to the old relationship. The work is to notice the pattern as it repeats at work, at home and with the therapist, and to feel and understand it rather than only dispute it. The two readings are not rivals: one works on the present thought, the other on why that thought keeps returning.
:::

### Techniques: from surface to depth
| Technique | What you do | Example line |
|---|---|---|
| **Clarification** | Gather and sharpen what was said | "When you say 'upset', what did that feel like?" |
| **Confrontation** | Point to something the patient hasn't noticed (gently) | "You've smiled each time you mention the divorce." |
| **Interpretation** | Offer a link to unconscious meaning or the past | "Perhaps smiling keeps away how angry you are, the way it did with your father." |
| **Working through** | Repeating and deepening an insight across many situations until change follows | Over months, recognising the same pattern with partner, boss and therapist |

:::note Interpret the defence before the content
A classic rule: **surface before depth** and **defence before impulse**. "You seem to change the subject when your sister comes up" comes before "You are furious with your sister."
:::

:::widget decide
{
  "scene": "Dr Thomas, 50, a lecturer in Kochi, has been in weekly therapy for six months. Last week he talked, for the first time, about his brother's suicide. Today he arrives saying, “I feel completely better. I think we can stop. Thank you so much.”",
  "ask": "What is the most useful response?",
  "choices": [
    { "label": "Congratulate him and agree to end today", "verdict": "harm", "outcome": "He leaves. Months later he returns in a severe depressive episode around the anniversary of his brother's death.", "why": "Sudden 'cure' right after touching a painful core is often a flight into health, a form of resistance." },
    { "label": "Welcome the relief, and wonder aloud with him about the timing, just after he spoke about his brother", "verdict": "best", "outcome": "He is quiet, then admits he dreaded coming back after crying last week. They agree to keep going and plan a proper ending later.", "why": "Naming the possible resistance without dismissing his wish respects his autonomy and keeps the work alive." },
    { "label": "Tell him he is in denial and must continue for at least another year", "verdict": "ok", "outcome": "He feels controlled and pushes back.", "why": "The idea may be right, but stating it as a verdict invites a power struggle instead of exploration." }
  ]
}
:::

:::example The guru transference in India
Psychiatrist J. S. Neki described the **guru-chela** (teacher-disciple) relationship as a model many Indian patients bring to therapy: they expect the healer to be wise, directive and caring, and may find the neutral, questioning Western stance cold. An idealising transference is common. Rather than refusing the role or exploiting it, many Indian therapists start more actively and use the trust to gradually invite the patient's own reflection.
:::

:::clinician
Empirical work supports parts of this framework. In the transference literature, the First Experimental Study of Transference interpretations (FEST, 2008) randomised patients in dynamic therapy to sessions with or without moderate transference interpretation; patients with poor object relations benefited more from transference work, contrary to the conventional expectation. Countertransference management (self-insight, self-integration, anxiety management, empathy, conceptualising skill) is associated with better outcomes, and acting out countertransference with worse (a 2018 meta-analysis). Miller and Rollnick's motivational interviewing reframes resistance as "sustain talk" and "discord", which overlaps with the psychodynamic concept, and its research shows that confrontational styles increase it.
:::

:::recall
1. Define transference and name four types. || The patient's experience of the therapist coloured by past relationships; positive, negative, idealising, erotic (also mirror, transference neurosis).
2. Contrast the classical and totalist views of countertransference. || Classical: therapist's own conflicts, an obstacle. Totalist (Heimann): all the therapist's feelings, a source of information.
3. Concordant versus complementary countertransference? || Feeling what the patient feels versus feeling like the important other in the patient's life.
4. Name Freud's five sources of resistance. || Repression, transference, secondary gain, id (repetition), superego (not deserving to recover).
5. Order the techniques from surface to depth. || Clarification, confrontation, interpretation, working through.
6. What is a flight into health? || A sudden 'cure' just as painful material approaches, a form of resistance.
:::

:::mcq
Q: A therapist finds herself feeling irritated and critical towards a patient in exactly the way the patient describes her mother. This is best called:
- Concordant countertransference
- *Complementary countertransference
- Positive transference
- Sublimation
> The therapist is pulled into the role of the patient's important other.

Q: "You have smiled each time you mentioned your husband's affair." This intervention is:
- Clarification
- *Confrontation
- Interpretation
- Working through
> Pointing to something the patient has not noticed, without linking it to deeper meaning yet.

Q: A patient feels he does not deserve to get better and sabotages progress. Freud would call this:
- Id resistance
- *Superego resistance
- Secondary gain
- Transference neurosis
> Unconscious guilt opposing recovery is superego resistance.
:::

## 2.6 Level check · Beginner [core][beginner]
Score 80% or more to open the Advanced level.

:::mcq
Q: Ego psychology's main focus is:
- The id's drives
- *How the ego adapts and copes, using defences and other functions
- Learned behaviour only
- Brain chemistry
> Ego psychology shifted attention to adaptation.

Q: Who systematised the ego's defence mechanisms in 1936 and described identification with the aggressor?
- Melanie Klein
- *Anna Freud
- Heinz Hartmann
- Karen Horney
> Anna Freud systematised the defences.

Q: A bullied boy starts bullying younger children in the same words. Anna Freud's term is:
- Reaction formation
- *Identification with the aggressor
- Sublimation
- Projection
> Becoming the aggressor turns fear into control.

Q: In Klein's depressive position, the child:
- Splits the mother into all-good and all-bad
- *Sees the mother as one whole person, with guilt and the wish to repair
- Has no feelings
- Fears only external attack
> Integration, concern and reparation define the depressive position.

Q: A patient insists the therapist is angry while he himself is seething, and acts in ways that provoke the therapist. This is:
- Sublimation
- *Projective identification
- Undoing
- Isolation of affect
> Projecting a feeling and pressuring the other to carry it.

Q: Bion's idea that a carer takes in raw distress and returns it in bearable form is:
- Holding environment
- *Container and contained
- Mirroring
- Transitional space
> Bion's containment.

Q: A young woman who always pleased her parents says she does not know who she really is or what she wants. Winnicott's concept is:
- Transitional object
- *False self
- Paranoid-schizoid position
- Twinship
> A compliant self hides the spontaneous true self.

Q: In Kernberg's model, which feature separates borderline from psychotic organisation?
- Splitting
- Identity diffusion
- *Reality testing, intact in borderline and lost in psychotic
- Use of repression
> Both use primitive defences; reality testing differs.

Q: Kohut saw pathological narcissism mainly as:
- A defence against envy
- *A developmental arrest from unmet selfobject needs
- A learned habit
- A psychotic process
> Kohut's deficit model, in contrast to Kernberg's defensive model.

Q: A patient needs her therapist to admire every achievement she brings. In Kohut's terms this is a:
- Twinship transference
- Idealising transference
- *Mirror transference
- Negative transference
> The need for admiring recognition is mirroring.

Q: The Adult Attachment Interview classifies adults mainly by:
- What happened to them in childhood
- *How coherently they describe their childhood relationships
- Their current relationship status
- Personality test scores
> Coherence of discourse, not events.

Q: A parent's unresolved status on the AAI is most associated with which infant pattern?
- Secure
- Avoidant
- Ambivalent
- *Disorganised
> Unresolved loss or trauma in the parent links to disorganised infant attachment.

Q: Paula Heimann's main contribution was to show that countertransference:
- Must always be eliminated
- *Can be a valuable source of information about the patient
- Only occurs in psychosis
- Is the same as transference
> The totalist view.

Q: A patient suddenly announces he is cured just after first discussing his abuse. The best term is:
- Working through
- *Flight into health
- Transference neurosis
- Positive transference
> A form of resistance.

Q: Which order runs from surface to depth?
- Interpretation, clarification, confrontation
- *Clarification, confrontation, interpretation
- Confrontation, interpretation, clarification
- Working through, clarification, interpretation
> Start at the surface and move deeper.
:::
`;
