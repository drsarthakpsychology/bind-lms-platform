import type { LongQA } from "@/lib/prep/long-types";

const S = "learning-motivation-emotion" as const;

export const LEARNING_MOTIVATION_EMOTION_L01: LongQA[] = [
  {
    id: "lme-l01-001",
    subject: S,
    topic: "classical-conditioning",
    marks: 20,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg", "mcp-entrance"],
    question: "Describe Pavlov's classical conditioning. Explain the main phenomena of acquisition, extinction, spontaneous recovery, generalisation and discrimination, and discuss its applications and limitations.",
    plan: ["Pavlov's discovery and the basic terms", "The procedure and timing", "Acquisition, extinction, spontaneous recovery, generalisation, discrimination, higher-order conditioning", "What is learned: S-S versus S-R, contingency", "Applications in everyday life and clinical psychology", "Limitations and conclusion"],
    answer: `## Pavlov's discovery
Ivan Pavlov, a Russian physiologist who won the Nobel Prize in 1904 for work on digestion, noticed that his dogs began to salivate not only when food was placed in their mouths but also at the sight of the attendant who usually fed them. He called these "psychic secretions" and studied them systematically, founding the study of classical (Pavlovian or respondent) conditioning: learning in which a neutral stimulus comes to elicit a response because it has been paired with a stimulus that naturally elicits that response.

## Basic terms
- Unconditioned stimulus (UCS): a stimulus that naturally elicits a response without learning, such as food in the mouth.
- Unconditioned response (UCR): the natural, unlearned response to the UCS, such as salivation to food.
- Neutral stimulus: a stimulus that does not initially elicit the response, such as the sound of a metronome or bell.
- Conditioned stimulus (CS): the former neutral stimulus after it has been paired with the UCS.
- Conditioned response (CR): the learned response to the CS, such as salivation to the bell. The CR is usually similar to the UCR but often weaker.

## The procedure and timing
Pavlov surgically fitted a tube to the dog's salivary gland to measure the drops of saliva. A metronome sounded, followed a few seconds later by meat powder. After several pairings, the metronome alone produced salivation.
Timing matters:
- Delayed (forward) conditioning: the CS begins before the UCS and overlaps with it; most effective, with an interval of about half a second for many responses.
- Trace conditioning: the CS ends before the UCS begins; weaker, as a memory trace must bridge the gap.
- Simultaneous conditioning: CS and UCS together; weak.
- Backward conditioning: UCS before CS; little or no excitatory conditioning.

## Main phenomena
- Acquisition: the CR gradually strengthens over CS-UCS pairings, producing a negatively accelerated learning curve that levels off.
- Extinction: when the CS is repeatedly presented without the UCS, the CR weakens and eventually disappears. Extinction is new inhibitory learning, not erasure of the original association.
- Spontaneous recovery: after a rest period following extinction, the CS again produces the CR, though weaker, showing the original learning remained.
- Renewal and reinstatement: an extinguished response returns when the context changes (renewal, shown by Mark Bouton) or after the UCS is presented alone (reinstatement), important for relapse after therapy.
- Stimulus generalisation: stimuli similar to the CS also elicit the CR, with a generalisation gradient: the more similar, the stronger the response. A dog conditioned to a tone of 1,000 Hz salivates somewhat to 900 Hz.
- Stimulus discrimination: through differential conditioning, where one stimulus is paired with the UCS and a similar one is not, the animal learns to respond only to the first. Pavlov found that making discriminations very difficult (a circle versus a nearly circular ellipse) produced agitated, disturbed behaviour he called experimental neurosis.
- Higher-order conditioning: a well-established CS (a bell) can act like a UCS to condition a new neutral stimulus (a light paired with the bell), producing a second-order CR.

## What is learned?
- Pavlov thought a new stimulus-response connection formed (S-R).
- Later evidence suggests that the CS comes to predict the UCS: an expectancy or stimulus-stimulus (S-S) association. Robert Rescorla showed that pairing alone is not enough; the CS must be a reliable predictor (contingency). Leon Kamin's blocking effect showed that a stimulus added to an already predictive CS is not learned, because it adds no new information.
- The Rescorla Wagner model formalised conditioning as learning from prediction error.

## Applications
- Emotional responses: John Watson and Rosalie Rayner's Little Albert study showed that fear could be conditioned to a white rat by pairing it with a loud noise, and generalised to similar objects.
- Phobias and anxiety disorders: conditioning helps explain how fears are acquired, as in a dog phobia after a bite, or panic attacks conditioned to bodily sensations (interoceptive conditioning).
- Therapies: exposure therapy and systematic desensitisation (Joseph Wolpe) use extinction and counterconditioning; aversion therapy pairs alcohol with an emetic drug; the bell-and-pad method for bedwetting conditions waking to bladder tension.
- Drug tolerance and overdose: Shepard Siegel showed that environmental cues become conditioned to the body's compensatory response to a drug, so taking a usual dose in an unfamiliar setting can lead to overdose.
- Advertising: pairing products with attractive people or music (evaluative conditioning).
- Immune system: Robert Ader and Nicholas Cohen conditioned immunosuppression in rats by pairing saccharin with an immunosuppressive drug.
- Taste aversions after illness.

## Limitations
- Biological constraints: John Garcia showed that rats learn taste aversions after a single pairing with a long delay, but cannot easily associate taste with shock or light with nausea. Martin Seligman's preparedness theory explains why fears of snakes and heights are common and fears of electrical sockets rare.
- Not all learning is conditioning: cognitive factors, such as expectancy and attention, matter, and humans can learn fears through observation and instruction (Stanley Rachman's three pathways).
- Many people with phobias recall no conditioning event, and many who experience trauma do not develop phobias.
- Watson's Little Albert study had serious ethical and methodological problems and has rarely been replicated.
- Classical conditioning explains reflexive, emotional responses better than complex, voluntary behaviour, which operant and cognitive learning explain.

## Conclusion
Pavlov showed that organisms learn the predictive relationships between events. The phenomena he described, from acquisition to spontaneous recovery, explain many emotional, physiological and clinical responses and underpin therapies such as exposure. Modern theory sees conditioning as learning about prediction, shaped by biology and cognition.`,
    keyPoints: ["Pavlov's discovery", "Correct UCS, UCR, CS, CR with example", "Timing arrangements", "Acquisition, extinction, spontaneous recovery", "Generalisation, discrimination, experimental neurosis, higher-order", "S-S versus S-R and contingency", "At least four applications including drug tolerance or exposure", "Limitations including Garcia and preparedness"],
    pitfalls: ["Mixing up UCR and CR", "Saying extinction erases the memory"],
    module: "learning-memory/2-1",
    visuals: [
      { kind: "conditioning", caption: "Basic terms", data: { kind: "classical", caption: "Pair the bell with food, then try the bell alone. Then keep ringing without food." } },
      { kind: "flow", caption: "The procedure and timing", data: { title: "Before, during and after conditioning", layout: "chain", nodes: [{ id: "a", label: "Before", detail: "Food (UCS) produces salivation (UCR); bell produces nothing." }, { id: "b", label: "During", detail: "Bell followed by food, many times." }, { id: "c", label: "After", detail: "Bell (CS) alone produces salivation (CR)." }, { id: "d", label: "Extinction", detail: "Bell without food: CR fades, but may recover after rest." }] } },
    ],
    ref: "Pavlov 1927 Conditioned Reflexes; Atkinson and Hilgard ch 7; Rescorla 1968; Kamin 1969; Bouton 2004; Siegel et al 1982; Ader and Cohen 1975; Watson and Rayner 1920",
  },
  {
    id: "lme-l01-002",
    subject: S,
    topic: "rescorla-wagner",
    marks: 10,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester"],
    question: "Explain the role of contingency and prediction in classical conditioning, with reference to Rescorla's contingency experiments, Kamin's blocking effect and the Rescorla Wagner model.",
    plan: ["The traditional contiguity view", "Rescorla's contingency studies", "Kamin's blocking", "The Rescorla Wagner model and its predictions", "Limitations and modern links"],
    answer: `## Contiguity versus contingency
Pavlov and early theorists assumed that conditioning depends on contiguity: the CS and UCS occurring close together in time. If contiguity were enough, any CS often followed by a UCS would become conditioned. Research in the 1960s showed this is wrong: what matters is whether the CS predicts the UCS.

## Rescorla's contingency experiments
Robert Rescorla in 1968 conditioned rats with tones and mild shocks. All groups received the same number of tone-shock pairings, but they differed in how often shocks occurred without the tone.
- When shocks occurred only with the tone, rats showed strong fear of the tone.
- When shocks were just as likely without the tone as with it, the rats showed no fear of the tone, despite the same number of pairings.
The CS was learned only when it provided information about the UCS. Contingency means the probability of the UCS given the CS must be higher than its probability without the CS.

## Kamin's blocking effect
Leon Kamin in 1969 first conditioned rats to fear a noise paired with shock. Then he presented the noise together with a light, followed by shock. When the light was later tested alone, it produced little fear, compared with a control group that had received only the compound training. The earlier learning about the noise blocked learning about the light, because the light added no new predictive information: the shock was already fully expected.

## The Rescorla Wagner model
Rescorla and Allan Wagner in 1972 proposed a mathematical model in which learning on each trial depends on how surprising the UCS is.
- The change in associative strength of a CS on a trial is proportional to the difference between the maximum strength the UCS can support (lambda) and the total current associative strength of all CSs present.
- In words: learning = learning rate x (what actually happens minus what was expected). This difference is the prediction error.
- Early in training, the UCS is surprising, so learning is fast; as it becomes expected, learning slows, producing the negatively accelerated curve.
- In blocking, the first CS already predicts the UCS fully, so prediction error is zero and the added CS gains nothing.
- In extinction, the UCS is absent, so the error is negative and strength falls.
- The model also predicts overexpectation: two separately trained CSs presented together lead to a total expectation greater than the UCS supports, so each loses strength, which was confirmed.
- Conditioned inhibition: a CS that signals the absence of an expected UCS gains negative strength.

## Limitations
- It does not explain latent inhibition: pre-exposure to a CS without consequences slows later conditioning, suggesting attention to the CS matters, as in the Mackintosh and Pearce Hall models.
- It treats extinction as unlearning, whereas spontaneous recovery and renewal show that the original learning remains.
- It ignores timing within trials.

## Modern links
Wolfram Schultz found that dopamine neurons in monkeys fire to unexpected rewards, shift their firing to the predictive cue after learning, and dip when an expected reward is omitted: a neural prediction error signal, exactly as the model describes. Prediction error learning underlies modern reinforcement learning in artificial intelligence and theories of addiction and psychosis.

## Conclusion
Conditioning is not simply association by contiguity; it is learning about which events predict others. Rescorla's contingency studies, Kamin's blocking and the Rescorla Wagner model established this view, now supported by the discovery of dopamine prediction error signals.`,
    keyPoints: ["Contiguity versus contingency", "Rescorla's equal pairings, different contingencies", "Kamin's blocking procedure and result", "Rescorla Wagner prediction error idea", "Explains acquisition, blocking, extinction, overexpectation", "Limitations such as latent inhibition", "Schultz's dopamine prediction error link"],
    module: "learning-memory/2-1",
    visuals: [
      { kind: "flow", caption: "Kamin's blocking effect", data: { title: "Kamin's blocking design", layout: "chain", nodes: [{ id: "p1", label: "Phase 1: noise then shock", detail: "Rats learn the noise predicts shock." }, { id: "p2", label: "Phase 2: noise plus light then shock", detail: "Shock is already expected." }, { id: "t", label: "Test: light alone", detail: "Little fear: learning about the light was blocked." }] } },
    ],
    ref: "Rescorla 1968; Kamin 1969; Rescorla and Wagner 1972; Schultz, Dayan and Montague 1997 Science; Mackintosh 1975; Pearce and Hall 1980",
  },
  {
    id: "lme-l01-003",
    subject: S,
    topic: "biological-constraints",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg"],
    question: "Discuss the biological constraints on learning, with reference to taste aversion, preparedness and instinctive drift.",
    plan: ["The equipotentiality assumption", "Garcia's taste aversion studies", "Seligman's preparedness and phobias", "Instinctive drift", "Species-specific defence reactions and implications"],
    answer: `## Equipotentiality
Early behaviourists assumed equipotentiality: any stimulus can be associated with any response or reinforcer with equal ease, so the laws of learning are the same for all species and all stimuli. Research from the 1960s showed that evolution prepares animals to learn some associations far more easily than others.

## Garcia's taste aversion studies
- John Garcia and Robert Koelling in 1966 gave rats water that was both sweet-tasting and accompanied by a light and a clicking sound ("bright, noisy, tasty water"). Some rats then received a shock; others were made ill by radiation or a drug.
- Rats made ill avoided the sweet taste but not the light and sound; rats shocked avoided the light and sound but not the taste.
- Taste was readily linked to nausea, and audiovisual cues to pain, but not the reverse.
- Taste aversions form after a single pairing, even with delays of several hours between tasting and illness, breaking the usual rule that the CS and UCS must be close in time.
- This makes evolutionary sense: illness is usually caused by something eaten some time earlier.
- Applications: people often develop aversions to foods eaten before an illness; patients undergoing chemotherapy may develop aversions to foods eaten before treatment, which can be reduced by giving a novel "scapegoat" food; Carl Gustavson used lithium-laced sheep meat to make coyotes avoid sheep.

## Preparedness
Martin Seligman in 1970 proposed that animals are biologically prepared to learn some associations, unprepared for others and contraprepared for some.
- Human phobias of snakes, spiders, heights, the dark and enclosed spaces are much more common than phobias of guns, electrical sockets or cars, although the latter are more dangerous today. Fears relevant to ancestral survival are prepared.
- Arne Ohman found that conditioned fear to pictures of snakes and spiders was acquired more easily, extinguished more slowly and could even be conditioned with masked pictures, compared with fear to flowers or mushrooms.
- Susan Mineka showed that laboratory-reared monkeys learned fear of snakes by watching another monkey react fearfully, but did not learn fear of flowers in the same way.

## Instinctive drift
Keller and Marian Breland, students of Skinner who trained animals for commercial shows, reported in 1961 that trained behaviours sometimes drifted back towards instinctive behaviour. Raccoons trained to drop coins into a piggy bank began rubbing the coins together and dipping them, as they do with food; pigs trained to carry wooden coins began rooting them on the ground. The animals lost reinforcers as a result, contradicting the idea that reinforcement controls behaviour regardless of species.

## Species-specific defence reactions
Robert Bolles noted that rats easily learn to avoid shock by running or freezing, their natural defences, but find it hard to learn avoidance by pressing a lever.

## Implications
- Learning theories must take evolution and species-typical behaviour into account; the laws of learning are not completely general.
- Prepared learning helps explain the content of common phobias and the persistence of some fears.
- Therapists may need more exposure sessions for prepared fears.
- Taste aversion research is applied in oncology and wildlife management.

## Conclusion
Biological constraints show that what an animal learns depends on its evolutionary history. Taste aversion, preparedness and instinctive drift challenge equipotentiality and link learning theory with evolutionary psychology.`,
    keyPoints: ["Equipotentiality assumption", "Garcia and Koelling bright noisy tasty water", "One-trial, long-delay learning", "Applications such as chemotherapy aversions", "Seligman's preparedness with Ohman or Mineka evidence", "Breland instinctive drift", "Bolles's defence reactions", "Implications"],
    module: "learning-memory/2-1",
    visuals: [
      { kind: "compare", caption: "Garcia's taste aversion studies", data: { title: "Garcia and Koelling's result", a: { label: "Rats made ill", points: ["Avoided the sweet taste", "Did not avoid the light and sound"], summary: "Taste goes with nausea." }, b: { label: "Rats shocked", points: ["Avoided the light and sound", "Did not avoid the taste"], summary: "Sights and sounds go with pain." } } },
    ],
    ref: "Garcia and Koelling 1966; Seligman 1970 and 1971; Breland and Breland 1961; Ohman and Mineka 2001; Cook and Mineka 1989; Bolles 1970; Bernstein 1978 chemotherapy aversions",
  },
  {
    id: "lme-l01-004",
    subject: S,
    topic: "classical-conditioning",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "cuet-pg", "mcp-entrance"],
    question: "Write a short note on the Little Albert experiment and its significance.",
    plan: ["Aim and procedure", "Results", "Significance", "Ethical and methodological criticisms"],
    answer: `## Aim and procedure
John B. Watson and Rosalie Rayner in 1920 aimed to show that emotional responses such as fear could be learned through classical conditioning. Their participant, known as Albert B., was a healthy 9-month-old infant who initially showed no fear of a white rat, a rabbit, a dog, cotton wool or masks.
At about 11 months, each time Albert reached for the white rat, the researchers struck a steel bar with a hammer behind his head, producing a loud noise that made him startle and cry.
- UCS: loud noise; UCR: fear and crying.
- CS: white rat; CR: fear of the rat.

## Results
After seven pairings over a week, Albert cried and crawled away when the rat appeared alone. His fear generalised to other furry or white objects: a rabbit, a dog, a fur coat, cotton wool and a Santa Claus mask with a white beard. Some fear remained a month later.

## Significance
- It demonstrated that fears can be acquired through conditioning, supporting a behavioural explanation of phobias.
- It showed stimulus generalisation in humans.
- It led to Mary Cover Jones's work with "Little Peter" in 1924, who was cured of a fear of rabbits by gradually bringing the rabbit closer while he ate food he liked, an early form of counterconditioning and systematic desensitisation.

## Criticisms
- Ethics: Albert was deliberately frightened, his mother's informed consent was questionable, and the fear was not removed before he left the study. It would not be approved today.
- Methodology: a single participant, inconsistent conditioning, subjective measurement of fear, and the use of thumb-sucking to stop crying, which complicated results.
- Later research shows that not all phobias arise from conditioning, and the true identity and outcome of Albert remain debated.`,
    keyPoints: ["Aim and procedure", "Correct UCS, UCR, CS and CR", "Generalisation results", "Link to Mary Cover Jones", "Ethical and methodological criticisms"],
    module: "learning-memory/2-1",
    visuals: [
      { kind: "timeline", caption: "Aim and procedure", data: { prompt: "Put the Little Albert study in order.", events: [{ label: "Baseline: no fear of the rat", when: "9 months" }, { label: "Rat paired with loud noise", when: "11 months" }, { label: "Fear of the rat alone" }, { label: "Fear generalises to a rabbit, dog and fur coat" }, { label: "Some fear remains a month later" }] } },
    ],
    ref: "Watson and Rayner 1920; Jones 1924; Harris 1979 on myths about Little Albert; Atkinson and Hilgard ch 7",
  },
  {
    id: "lme-l01-005",
    subject: S,
    topic: "non-associative-learning",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net"],
    question: "What is non-associative learning? Explain habituation and sensitisation, their characteristics, neural basis and applications.",
    plan: ["Define non-associative learning", "Habituation: definition, examples, features", "Sensitisation: definition and examples", "Dual process theory", "Kandel's Aplysia work", "Applications"],
    answer: `## Meaning
Non-associative learning is a change in the response to a single stimulus as a result of repeated exposure to it, without the stimulus being paired with another event. It is the simplest form of learning, found in all animals, including single-celled organisms.

## Habituation
Habituation is a decrease in response to a stimulus that is repeated and has no significant consequences.
Examples:
- We stop noticing the sound of a ceiling fan or traffic outside the window.
- A newborn turns towards a new sound but stops turning after it is repeated many times.
- A snail withdraws into its shell when the table is tapped, but stops withdrawing after repeated harmless taps.
Characteristics:
- Stimulus specific: a new stimulus restores the response (dishabituation shows that the decline is not due to fatigue).
- Spontaneous recovery after a rest period.
- Faster with weaker and more frequent stimuli.
- Different from sensory adaptation, which occurs at the receptor; habituation involves the nervous system and can be overcome by attention.
Habituation lets organisms ignore safe, irrelevant stimuli and attend to new ones. It is the basis of the habituation method used to study infant perception and cognition.

## Sensitisation
Sensitisation is an increase in response to a stimulus after exposure to a strong or noxious stimulus. It is usually not stimulus specific: after a sudden loud noise or a painful shock, an animal responds more strongly to many stimuli.
Examples:
- After hearing a news report of a burglary, a person jumps at every small noise in the house.
- After an injury, mild touch to the area feels painful (hyperalgesia), and in chronic pain central sensitisation increases pain responses.

## Dual process theory
Richard Thompson and William Spencer, and later Philip Groves and Thompson, proposed that each stimulus produces two opposing processes: a decremental habituation process in the specific stimulus-response pathway and an incremental sensitisation process reflecting general arousal. The observed response depends on their balance. A strong stimulus produces more sensitisation, a weak repeated stimulus more habituation.

## Neural basis
Eric Kandel studied the sea slug Aplysia, which withdraws its gill when its siphon is touched.
- With repeated gentle touches, the gill withdrawal habituates, because the sensory neurons release less neurotransmitter (glutamate) at their synapses with motor neurons.
- A shock to the tail sensitises the reflex: modulatory interneurons release serotonin onto the sensory neuron terminals, increasing transmitter release.
- Short-term changes involve modification of existing proteins; long-term habituation and sensitisation involve gene expression and growth or loss of synapses.
Kandel received the Nobel Prize in 2000, showing that learning changes synaptic strength.

## Applications
- Exposure therapy for anxiety includes habituation of fear responses within and across sessions, though modern theory emphasises inhibitory learning.
- Habituation paradigms assess infant cognition and are used in screening.
- Sensitisation helps explain hypervigilance in PTSD, chronic pain and the increasing response to repeated stimulant doses (behavioural sensitisation), relevant to addiction and psychosis.
- In advertising, repeated adverts habituate viewers, so variation is used.

## Conclusion
Habituation and sensitisation are basic forms of learning that adjust responsiveness to repeated stimuli. They have clear neural mechanisms, studied in Aplysia, and help explain phenomena from infant attention to anxiety and chronic pain.`,
    keyPoints: ["Definition of non-associative learning", "Habituation with examples and stimulus specificity", "Dishabituation distinguishes it from fatigue", "Sensitisation with examples", "Dual process theory", "Kandel's Aplysia mechanisms", "Clinical and research applications"],
    module: "learning-memory/2-1",
    visuals: [
      { kind: "compare", data: { title: "Habituation versus sensitisation", a: { label: "Habituation", points: ["Response falls with repetition", "Stimulus specific", "Less transmitter released"], summary: "Learning to ignore." }, b: { label: "Sensitisation", points: ["Response rises after a strong stimulus", "Spreads to other stimuli", "Serotonin boosts transmitter release"], summary: "Learning to be on guard." } } },
    ],
    ref: "Thompson and Spencer 1966; Groves and Thompson 1970; Kandel 2001 Science; Bear, Connors and Paradiso ch 25",
  },
  {
    id: "lme-l01-006",
    subject: S,
    topic: "behaviour-therapy",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "mcp-entrance", "ugc-net", "md-psychiatry"],
    question: "Explain how classical conditioning principles account for the development and treatment of phobias. Discuss Mowrer's two-factor theory, exposure-based therapies and the limitations of the conditioning account.",
    plan: ["Conditioning account of phobia acquisition", "Mowrer's two-factor theory of maintenance", "Systematic desensitisation", "Flooding and graded exposure; inhibitory learning", "Aversion therapy and other applications", "Limitations and conclusion"],
    answer: `## Acquisition of phobias
A phobia is an intense, irrational fear of a specific object or situation, leading to avoidance. The conditioning account proposes that a neutral stimulus becomes a conditioned fear stimulus after being paired with a frightening unconditioned stimulus. A child bitten by a dog (UCS: pain; UCR: fear) may develop fear of dogs (CS), which generalises to all dogs. Watson and Rayner's Little Albert study demonstrated this in an infant. Panic disorder may involve interoceptive conditioning, where bodily sensations such as a racing heart become conditioned stimuli for panic.

## Mowrer's two-factor theory
Classical conditioning explains how fear starts, but not why it persists for years without further trauma, since an unreinforced CS should extinguish. O. Hobart Mowrer in 1947 proposed two factors:
- Factor one, classical conditioning: the CS (dog) becomes associated with the UCS and elicits fear.
- Factor two, operant conditioning: avoiding or escaping the CS reduces fear, and this reduction negatively reinforces avoidance.
Because the person always avoids dogs, they never discover that most dogs are safe, so extinction cannot occur. Avoidance and safety behaviours, such as holding on to furniture during panic or always going out with a companion, maintain anxiety.
Criticisms: avoidance often continues after fear has dropped, suggesting that expectancies and safety signals, not only fear reduction, maintain it; and many people avoid without having had a conditioning experience.

## Systematic desensitisation
Joseph Wolpe developed systematic desensitisation in the 1950s, based on counterconditioning and reciprocal inhibition: a person cannot be anxious and relaxed at the same time.
- The client learns progressive muscle relaxation (from Edmund Jacobson).
- Client and therapist construct an anxiety hierarchy, ranked using subjective units of distress (SUDS), from mildly to extremely feared situations, for example a picture of a dog, a dog across the street, a puppy in a cage, a dog on a lead nearby, stroking a dog.
- While deeply relaxed, the client imagines (or faces in vivo) each item, moving up only when the current item causes no anxiety.
- Mary Cover Jones's earlier treatment of Peter's fear of rabbits was a forerunner.
Evidence shows it is effective, though later research suggests exposure itself, rather than relaxation, is the key ingredient.

## Flooding and graded exposure
- Flooding: the client is exposed to the most feared stimulus at full intensity, in reality or imagination, for a prolonged period without escape, until fear declines. It works by extinction but can be distressing and requires consent.
- Graded in vivo exposure: gradual real-life exposure up a hierarchy, without relaxation, with the client remaining until anxiety falls or their expectation of danger is disconfirmed. It is the most effective treatment for specific phobias; Lars-Goran Ost showed that a single session of about three hours can treat most specific phobias.
- Exposure and response prevention for OCD, prolonged exposure for PTSD and interoceptive exposure for panic disorder apply the same principles.
- Inhibitory learning: Michelle Craske argues that extinction creates a new "safe" memory that competes with the fear memory. Therapy aims to violate expectancies maximally, vary contexts and stimuli, and drop safety behaviours, to reduce relapse through renewal or spontaneous recovery.
- Virtual reality exposure is used for fears of flying and heights.

## Aversion therapy and other applications
- Aversion therapy pairs an undesired behaviour with an unpleasant stimulus, such as disulfiram (Antabuse), which causes nausea if alcohol is drunk. Its effectiveness depends on adherence, and it raises ethical concerns. Its historical use to "treat" homosexuality was harmful and is now recognised as unethical; conversion therapy is condemned by professional bodies, and the Madras High Court in 2021 directed action against it in India.
- Cue exposure in addiction extinguishes conditioned craving to drug cues.
- The bell-and-pad alarm for enuresis.

## Limitations of the conditioning account
- Many phobic people recall no traumatic conditioning event. Stanley Rachman proposed three pathways to fear: direct conditioning, vicarious learning (observing others' fear) and information or instruction (being told something is dangerous).
- Many people experience traumatic events without developing phobias, so vulnerability (temperament, genetics, prior experience of control) matters.
- Preparedness: phobias cluster around evolutionarily relevant objects, which simple conditioning does not predict.
- Cognitive factors: catastrophic beliefs and attentional bias maintain fears; CBT adds cognitive restructuring to exposure.
- Non-associative theories argue that some fears, such as of heights, are innate and appear without learning.

## Conclusion
Classical conditioning, combined with operant reinforcement of avoidance in Mowrer's two-factor theory, gives a powerful account of how phobias develop and persist. It underpins exposure-based therapies, which are among the most effective treatments in psychology. Its limitations are addressed by including vicarious and informational learning, preparedness and cognitive processes.`,
    keyPoints: ["Conditioning account of acquisition with example", "Interoceptive conditioning in panic", "Mowrer's two factors explained", "Safety behaviours maintain fear", "Systematic desensitisation steps and reciprocal inhibition", "Flooding and graded exposure with Ost", "Inhibitory learning model", "Limitations including Rachman's three pathways and preparedness"],
    module: "learning-memory/4-1",
    visuals: [
      { kind: "flow", caption: "Mowrer's two-factor theory", data: { title: "Mowrer's two-factor cycle", layout: "cycle", nodes: [{ id: "c", label: "Conditioned fear", detail: "Dog paired with a bite." }, { id: "s", label: "Sees a dog", detail: "Anxiety rises." }, { id: "a", label: "Avoids or escapes", detail: "Crosses the road." }, { id: "r", label: "Relief", detail: "Anxiety drops, negatively reinforcing avoidance." }, { id: "n", label: "No new learning", detail: "Never learns most dogs are safe." }] } },
      { kind: "timeline", caption: "Systematic desensitisation", data: { prompt: "Build an exposure hierarchy for dog phobia, from least to most feared.", events: [{ label: "Look at a picture of a dog", when: "SUDS 20" }, { label: "Watch a dog across the street", when: "SUDS 40" }, { label: "Stand near a puppy in a cage", when: "SUDS 55" }, { label: "Stand beside a calm dog on a lead", when: "SUDS 75" }, { label: "Stroke the dog", when: "SUDS 90" }] } },
    ],
    ref: "Mowrer 1947 and 1960; Wolpe 1958; Ost 1989 one-session treatment; Craske et al 2014 inhibitory learning; Rachman 1977; Atkinson and Hilgard ch 7 and 16; Madras High Court 2021 S. Sushma v Commissioner of Police",
  },
  {
    id: "lme-l01-007",
    subject: S,
    topic: "classical-conditioning",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net"],
    question: "Write short notes on higher-order conditioning and sensory preconditioning.",
    plan: ["Define higher-order conditioning with steps", "Define sensory preconditioning with steps", "Contrast", "Significance"],
    answer: `## Higher-order conditioning
In higher-order (second-order) conditioning, a well-established conditioned stimulus is used, like an unconditioned stimulus, to condition a new neutral stimulus.
- Phase 1: a bell (CS1) is paired with food until it reliably produces salivation.
- Phase 2: a light (CS2) is paired with the bell, without food.
- Result: the light alone comes to produce salivation, though more weakly. Pavlov obtained second-order and occasionally third-order conditioning.
In phase 2 the bell is no longer followed by food, so it begins to extinguish; therefore higher-order responses are weak and short-lived.

## Sensory preconditioning
In sensory preconditioning, two neutral stimuli are first paired with each other, before either is linked to a UCS.
- Phase 1: a tone and a light are paired repeatedly; neither produces any response.
- Phase 2: the light is paired with food (or shock) until it produces a CR.
- Result: the tone, never paired with food, now also produces the CR.
This shows that animals learn associations between neutral stimuli (stimulus-stimulus learning) even when no response is involved, supporting a cognitive view of conditioning.

## Contrast
| Feature | Higher-order | Sensory preconditioning |
| Order of phases | CS1 with UCS first, then CS2 with CS1 | CS2 with CS1 first, then CS1 with UCS |
| Shows | A learned stimulus can act as reinforcer | Learning without any response |

## Significance
Higher-order conditioning explains how many human emotional reactions arise from stimuli never directly paired with pain or pleasure: words, symbols, money and places linked to earlier conditioned stimuli. Advertisers pair products with already liked celebrities or music.`,
    keyPoints: ["Higher-order procedure and weak response", "Sensory preconditioning procedure", "Correct order of phases", "S-S learning implication", "Real-world examples"],
    module: "learning-memory/2-1",
    visuals: [
      { kind: "compare", caption: "Higher-order conditioning", data: { title: "Same stimuli, different order", a: { label: "Higher-order", points: ["Bell with food", "Then light with bell", "Light now produces salivation"], summary: "A CS acts like a reward." }, b: { label: "Sensory preconditioning", points: ["Light with tone", "Then light with food", "Tone now produces salivation"], summary: "Neutral pairs are learned silently." } } },
    ],
    ref: "Pavlov 1927; Brogden 1939 sensory preconditioning; Rizley and Rescorla 1972",
  },
  {
    id: "lme-l01-008",
    subject: S,
    topic: "learning-history",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg", "ugc-net"],
    question: "Describe Thorndike's experiments with the puzzle box and his laws of learning. Evaluate his contribution to learning theory.",
    plan: ["Thorndike and his method", "Puzzle box procedure and learning curve", "Law of effect, law of exercise, law of readiness", "Later revisions", "Evaluation and educational implications"],
    answer: `## Thorndike's method
Edward Lee Thorndike, an American psychologist, studied animal learning experimentally in the 1890s, rejecting anecdotes about animal intelligence. In his doctoral work, "Animal Intelligence", published in 1898, he placed hungry cats in puzzle boxes, cages that could be opened by pulling a loop of string or pressing a lever, with food visible outside.

## Results
- At first, the cat behaved randomly: scratching, biting, pushing at the bars, meowing. Eventually, by accident, it pulled the string and escaped to the food.
- On later trials, the time taken to escape gradually decreased, with irregular dips, rather than suddenly, producing a gradual learning curve.
- Thorndike concluded that learning was by trial and error (or "trial and accidental success"), not by insight or reasoning: successful responses were gradually "stamped in" and unsuccessful ones "stamped out".

## Laws of learning
- Law of effect: responses followed by a satisfying state of affairs are strengthened and more likely to recur in that situation; responses followed by an annoying state are weakened. This is the forerunner of reinforcement.
- Law of exercise: connections between a situation and a response are strengthened by use (practice) and weakened by disuse.
- Law of readiness: when an organism is prepared to act, acting is satisfying and being prevented is annoying.
Thorndike's theory is called connectionism: learning consists of strengthening stimulus-response connections (bonds).

## Subsidiary laws
Multiple response (trying various responses), set or attitude, associative shifting (a response transferring to a new stimulus) and response by analogy (responding to a new situation as to a similar old one), the basis of his theory of transfer through identical elements.

## Later revisions
In the 1930s Thorndike revised his views: he largely abandoned the law of exercise, as practice without feedback produced little learning, and weakened the negative half of the law of effect, finding that punishment did not simply weaken responses as reward strengthened them (the truncated law of effect).

## Evaluation
Strengths:
- First systematic laboratory study of animal learning, using objective measures.
- The law of effect became the foundation of B. F. Skinner's operant conditioning.
- Influential in educational psychology: emphasis on practice with feedback, rewards, readiness and transfer.
Criticisms:
- Gestalt psychologists such as Wolfgang Kohler argued that the puzzle box made insight impossible, because the mechanism was hidden; in situations where the problem could be seen as a whole, animals showed insightful solutions.
- Terms such as "satisfying" were vague and partly mentalistic; Skinner later defined reinforcement purely by its effect on behaviour.
- Identical elements theory of transfer was too narrow; transfer also depends on understanding principles.
- Trial and error explains some animal learning but not complex human learning involving language and understanding.

## Conclusion
Thorndike moved the study of learning into the laboratory, showed that consequences shape behaviour through the law of effect, and laid the groundwork for operant conditioning and evidence-based education, although his trial-and-error account underestimated insight and cognition.`,
    keyPoints: ["Puzzle box procedure", "Gradual learning curve and trial and error", "Law of effect", "Laws of exercise and readiness", "Connectionism", "Later revisions including truncated law of effect", "Influence on Skinner and education", "Criticisms including Kohler"],
    module: "learning-memory/2-2",
    visuals: [
      { kind: "experiment", caption: "Results", data: { title: "A cat in Thorndike's puzzle box", question: "How long did the cat take to escape on early and later trials (illustrative)?", unit: " seconds", max: 180, conditions: [{ label: "Trial 1", value: 160 }, { label: "Trial 5", value: 90 }, { label: "Trial 10", value: 40 }, { label: "Trial 20", value: 8 }], why: "Escape time fell gradually, not suddenly: successful responses were stamped in by their effects." } },
    ],
    ref: "Thorndike 1898 and 1911; Hergenhahn and Olson, Introduction to Theories of Learning ch 4; Atkinson and Hilgard ch 7",
  },
  {
    id: "lme-l01-009",
    subject: S,
    topic: "operant-conditioning",
    marks: 15,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg", "mcp-entrance"],
    question: "Explain Skinner's operant conditioning. Describe the types of reinforcement and punishment, shaping, extinction and stimulus control, and discuss applications.",
    plan: ["Skinner's approach and the Skinner box", "Positive and negative reinforcement and punishment", "Primary and secondary reinforcers", "Shaping, chaining, extinction, stimulus control", "Applications", "Evaluation and conclusion"],
    answer: `## Skinner's approach
B. F. Skinner (1904 to 1990), a radical behaviourist, distinguished respondent behaviour, elicited by stimuli as in classical conditioning, from operant behaviour, which the organism emits and which "operates" on the environment to produce consequences. Operant conditioning is learning in which the probability of a behaviour changes according to its consequences. Skinner built on Thorndike's law of effect but defined reinforcement objectively: a reinforcer is any consequence that increases the probability of the behaviour it follows.

## The Skinner box
In an operant chamber, a hungry rat could press a lever (or a pigeon peck a key) to receive a food pellet. A cumulative recorder automatically plotted each response over time, so the rate of responding could be measured precisely.

## Reinforcement and punishment
| | Stimulus added | Stimulus removed |
| Behaviour increases | Positive reinforcement: praise after homework | Negative reinforcement: taking a painkiller removes a headache |
| Behaviour decreases | Positive punishment: a scolding after lying | Negative punishment: phone taken away after breaking curfew |
- Negative reinforcement is not punishment; it strengthens behaviour by removing something unpleasant. Escape (ending an aversive stimulus) and avoidance (preventing it) are forms of negative reinforcement.
- Negative punishment includes time-out from positive reinforcement and response cost (losing tokens or privileges).

## Types of reinforcers
- Primary reinforcers satisfy biological needs: food, water, warmth.
- Secondary (conditioned) reinforcers gain value through association with primary reinforcers: money, grades, praise, tokens. Generalised reinforcers, such as money, are linked to many primary reinforcers.
- The Premack principle: a more probable behaviour can reinforce a less probable one ("finish your homework, then you can play cricket").

## Key processes
- Shaping: reinforcing successive approximations to a target behaviour. To teach a rat to press a lever, first reinforce facing the lever, then approaching it, then touching it, then pressing it. Shaping is used to teach speech to children with autism and new skills in rehabilitation.
- Chaining: linking a sequence of behaviours, each serving as a cue for the next, often taught backwards from the final step.
- Extinction: when reinforcement stops, the behaviour eventually decreases, often after a temporary increase called an extinction burst, as when a child's tantrums worsen at first when parents stop giving in.
- Spontaneous recovery may occur after extinction.
- Stimulus control and discrimination: a discriminative stimulus (SD) signals that reinforcement is available. A rat learns to press only when a light is on. People talk loudly at a cricket match but quietly in a library.
- Generalisation: responding in similar situations.
- Schedules of reinforcement determine the pattern and persistence of behaviour; intermittent reinforcement makes behaviour resistant to extinction.
- Superstitious behaviour: Skinner found that pigeons given food at fixed intervals regardless of behaviour developed odd rituals, such as turning in circles, that happened to precede food, a model for human superstitions.

## Applications
- Applied behaviour analysis for children with autism and intellectual disability, using shaping, prompting and reinforcement.
- Token economies in psychiatric wards, schools and juvenile homes.
- Classroom management: praise, clear rules, response cost; programmed instruction and teaching machines.
- Behavioural parent training for conduct problems.
- Contingency management for substance use: vouchers or rewards for drug-free urine tests are among the most effective interventions.
- Behavioural activation for depression increases contact with positive reinforcement.
- Organisational behaviour modification, health behaviour change and apps that use streaks and badges.
- Functional analysis identifies what reinforces problem behaviours such as self-injury (attention, escape, sensory, tangible) to design interventions.

## Evaluation
Strengths: precise, objective, testable; powerful practical applications; explains much everyday behaviour.
Criticisms:
- Ignores cognitive processes such as expectations, insight and understanding; Tolman's latent learning showed learning without reinforcement.
- Biological constraints (instinctive drift) limit its generality.
- Overjustification: rewards can undermine intrinsic motivation, as Edward Deci and Mark Lepper showed.
- Ethical concerns about control and the use of aversive methods.
- Chomsky criticised Skinner's account of language.
- Generalisation from rats and pigeons to complex human behaviour is questioned.

## Conclusion
Operant conditioning explains how consequences shape voluntary behaviour through reinforcement and punishment. Its techniques are among the most practically useful in psychology, though a full account of learning also needs cognitive and biological factors.`,
    keyPoints: ["Operant versus respondent behaviour", "Skinner box and cumulative recorder", "Correct four-way table of reinforcement and punishment", "Negative reinforcement is not punishment", "Primary, secondary and Premack principle", "Shaping, extinction burst, stimulus control", "At least four applications", "Evaluation including overjustification and cognition"],
    pitfalls: ["Calling negative reinforcement a punishment", "Defining a reinforcer by pleasantness rather than its effect"],
    module: "learning-memory/2-2",
    visuals: [
      { kind: "conditioning", caption: "Key processes", data: { kind: "operant", caption: "Reinforce lever presses, switch to a variable ratio, then stop food and watch the extinction burst." } },
      { kind: "sort", caption: "Reinforcement and punishment", data: { prompt: "Classify each consequence.", buckets: ["Positive reinforcement", "Negative reinforcement", "Positive punishment", "Negative punishment"], items: [{ text: "A seat belt alarm stops when you buckle up", bucket: 1 }, { text: "Extra marks for submitting early", bucket: 0 }, { text: "A fine for jumping a red light", bucket: 3 }, { text: "A teacher shouts when a student talks", bucket: 2 }] } },
    ],
    ref: "Skinner 1938 and 1953; Skinner 1948 superstition; Atkinson and Hilgard ch 7; Higgins et al contingency management; Iwata et al 1982 functional analysis",
  },
  {
    id: "lme-l01-010",
    subject: S,
    topic: "schedules-of-reinforcement",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg", "ugc-net"],
    question: "Describe the schedules of reinforcement and the patterns of responding each produces. Explain the partial reinforcement extinction effect with everyday examples.",
    plan: ["Continuous versus partial reinforcement", "Four basic schedules with examples", "Response patterns on cumulative records", "Partial reinforcement extinction effect and explanations", "Applications"],
    answer: `## Continuous and partial reinforcement
- Continuous reinforcement: every correct response is reinforced. It produces fast learning but rapid extinction when reinforcement stops. It is best for teaching a new behaviour.
- Partial (intermittent) reinforcement: only some responses are reinforced. Learning is slower, but behaviour is more persistent. Charles Ferster and B. F. Skinner described the schedules in detail in 1957.

## The four basic schedules
| Schedule | Rule | Example | Response pattern |
| Fixed ratio (FR) | Reinforcement after a fixed number of responses | Piece-rate pay: paid for every 10 shirts stitched | High rate with a brief pause after each reinforcer (post-reinforcement pause) |
| Variable ratio (VR) | After a varying number of responses around an average | Slot machines, lottery tickets, checking social media for likes | Very high, steady rate; most resistant to extinction |
| Fixed interval (FI) | First response after a fixed time | Monthly salary, a weekly test | Scalloped pattern: little responding after reinforcement, increasing as the time approaches |
| Variable interval (VI) | First response after varying times | Checking for a WhatsApp reply, a pop quiz at unpredictable times, fishing | Moderate, steady rate |
- Ratio schedules produce higher rates than interval schedules, because more responses mean more reinforcement.
- Variable schedules produce steadier responding than fixed ones, because the next reinforcer could come at any time.
- The fixed interval scallop is seen in students who study little after an exam and cram as the next one approaches, and in members of Parliament whose legislative activity peaks before sessions end.

## The partial reinforcement extinction effect
Behaviour learned under partial reinforcement is much more resistant to extinction than behaviour learned under continuous reinforcement. A vending machine that always worked is abandoned after one or two failures; a slot machine that pays out rarely is played for a long time without wins.
Explanations:
- Discrimination hypothesis: after continuous reinforcement, it is easy to notice when reinforcement stops; after partial reinforcement, non-reinforced responses were already common, so the change is hard to detect.
- Frustration theory (Abram Amsel): under partial reinforcement, the organism learns to keep responding despite the frustration of non-reward, which becomes a cue for persistence.
- Sequential theory (E. J. Capaldi): the memory of non-reinforced trials becomes associated with later reinforcement.

## Applications
- Teaching new skills: start with continuous reinforcement, then gradually thin to a variable schedule to maintain behaviour.
- Gambling and gaming: VR schedules explain the persistence of gambling and the design of loot boxes and social media notifications; this is relevant to understanding gambling disorder.
- Parenting: giving in to a child's tantrums occasionally (intermittent reinforcement) makes them more persistent than giving in always or never; consistency is essential when using extinction.
- Workplaces combine fixed salary with variable incentives.
- Complex schedules, such as differential reinforcement of low rates or of other behaviour (DRO), are used in behaviour therapy.

## Conclusion
Schedules of reinforcement determine both the rate and the persistence of behaviour. Variable ratio schedules generate the highest, most durable responding, and partial reinforcement explains why behaviours as different as gambling, tantrums and checking phones are so hard to extinguish.`,
    keyPoints: ["Continuous versus partial reinforcement", "Four schedules with correct rules", "Everyday examples for each", "Correct response patterns including FI scallop and FR pause", "Partial reinforcement extinction effect", "At least two explanations", "Applications such as gambling and parenting"],
    module: "learning-memory/2-3",
    visuals: [
      { kind: "sort", caption: "The four basic schedules", data: { prompt: "Which schedule is each?", buckets: ["Fixed ratio", "Variable ratio", "Fixed interval", "Variable interval"], items: [{ text: "A slot machine", bucket: 1 }, { text: "Paid for every 20 packets packed", bucket: 0 }, { text: "Monthly salary", bucket: 2 }, { text: "Checking whether a friend has replied", bucket: 3 }] } },
      { kind: "conditioning", caption: "The partial reinforcement extinction effect", data: { kind: "operant", caption: "Switch to the variable ratio, then stop reinforcement. Why does pressing continue so long?" } },
    ],
    ref: "Ferster and Skinner 1957; Amsel 1962; Capaldi 1967; Atkinson and Hilgard ch 7",
  },
];
