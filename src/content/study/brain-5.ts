/* Module · Brain and behaviour, new Beginner sections on electrical signalling, synaptic transmission and the transmitter systems. Original text written for VIBHA School of Psychology. */
import { SCENE } from "./brain-4";

export const begSignals = String.raw`
## 2.1 Electrical signals in depth: membrane potentials and the action potential [core][beginner]
At the Starting level you learned that a neuron rests at about minus 70 millivolts and fires an all-or-none spike. Entrance exams go further: **why** minus 70, **which** ion moves when, **why** the neuron cannot fire again at once, and **what** speeds a signal up. Here is the full story, with the two equations exams name, explained without heavy maths.

${SCENE("actionpotential")}

### Why the inside is negative: two gradients and a leaky membrane
Two forces act on every ion:
- a **concentration gradient** (ions drift from where they are crowded to where they are scarce), and
- an **electrical gradient** (opposite charges attract, like charges repel).

The cell keeps **potassium (K+) high inside** and **sodium (Na+) high outside**, using the **sodium-potassium pump**. For every molecule of energy (ATP) it uses, the pump pushes **3 sodium ions out** and brings **2 potassium ions in**. Because it moves more positive charge out than in, it is called **electrogenic**, though it adds only a few millivolts directly. Its main job is to keep the gradients.

At rest, many potassium **leak channels** are open and few sodium channels are. Potassium leaks out down its concentration gradient, leaving behind negatively charged proteins that cannot leave. The inside becomes negative until that negativity pulls back on potassium just enough to balance the outward drift.

| Ion | Inside (mM) | Outside (mM) | Equilibrium potential | Main role |
|---|---|---|---|---|
| Potassium (K+) | about 140 | about 5 | about minus 90 mV | Sets the resting potential; repolarises the spike |
| Sodium (Na+) | about 15 | about 145 | about plus 60 mV | Drives the rising phase of the spike |
| Chloride (Cl-) | about 10 | about 110 | about minus 65 to minus 70 mV | Inhibition through GABA-A and glycine receptors |
| Calcium (Ca2+) | about 0.0001 | about 2 | about plus 120 mV | Triggers transmitter release; second messenger |

### Nernst and Goldman in plain terms
- The **Nernst equation** gives the **equilibrium potential** for **one ion**: the voltage at which the electrical pull exactly balances that ion's concentration push, so there is no net flow. At body temperature it is about **61.5 times the log of (outside over inside)** millivolts for an ion with one positive charge.
- The **Goldman equation** gives the **actual membrane potential** when **several ions** can cross. It is a **weighted average** of their equilibrium potentials, and the weights are **how permeable** the membrane is to each.

At rest the membrane is about 25 to 40 times more permeable to potassium than to sodium, so the resting potential (about minus 70) sits close to potassium's minus 90 but is pulled slightly up by the small sodium leak. During the spike, sodium permeability jumps far above potassium's, so the voltage races towards sodium's plus 60.

:::widget worked
{
 "title": "Using the Nernst equation",
 "steps": [
  { "q": "Potassium is 5 mM outside and 140 mM inside. Using E = 61.5 times log (outside over inside), estimate the potassium equilibrium potential.", "a": "Outside over inside is 5 divided by 140, about 0.036. Its log is about minus 1.45. 61.5 times minus 1.45 is about minus 89 mV." },
  { "q": "Sodium is 145 mM outside and 15 mM inside. Estimate its equilibrium potential.", "a": "145 divided by 15 is about 9.7; its log is about 0.99. 61.5 times 0.99 is about plus 61 mV." },
  { "q": "Why does the resting potential (minus 70) lie between these two values, much nearer to potassium's?", "a": "Goldman: the membrane potential is a permeability-weighted average. At rest potassium permeability dominates, so the potential sits near minus 90, pulled up a little by the sodium leak." }
 ],
 "yourTurn": [
  { "q": "In severe kidney failure, outside potassium rises from 5 to 15 mM. What happens to the potassium equilibrium potential and to the resting potential?", "a": "15 over 140 is about 0.107; log about minus 0.97; times 61.5 gives about minus 60 mV. The resting potential moves up (depolarises) towards threshold. At first neurons and heart cells become more excitable; if it stays depolarised, sodium channels inactivate and cells stop firing, which is why high potassium can stop the heart." }
 ]
}
:::

### The action potential, phase by phase
1. **Graded inputs** arrive on dendrites and the cell body as small **postsynaptic potentials** that spread and fade.
2. They are summed at the **axon initial segment** (the **axon hillock** region), which has the highest density of voltage-gated sodium channels. This is where the spike usually starts.
3. At **threshold** (about minus 55 mV), voltage-gated **sodium channels open** in a self-reinforcing burst: sodium enters, the cell depolarises further, more channels open. This is the **rising phase**.
4. At the **peak** (about plus 30 to plus 40 mV) the sodium channels **inactivate** (a separate "ball and chain" gate plugs them), and slower voltage-gated **potassium channels open**.
5. Potassium leaves: **repolarisation**.
6. Potassium channels close slowly, so the voltage briefly dips below rest: the **after-hyperpolarisation** (undershoot), near minus 80 mV.
7. The pump and leak channels restore rest. The whole spike lasts about **1 to 2 milliseconds**.

:::widget flow
{
 "title": "The action potential in order",
 "layout": "chain",
 "nodes": [
  { "id": "r", "label": "Rest, about minus 70 mV", "detail": "Potassium leak channels open; sodium mostly closed." },
  { "id": "t", "label": "Threshold, about minus 55 mV", "detail": "Summed inputs at the axon initial segment reach the trigger point." },
  { "id": "d", "label": "Rising phase", "detail": "Voltage-gated sodium channels open; sodium rushes in; positive feedback." },
  { "id": "p", "label": "Peak, about plus 30 to 40 mV", "detail": "Sodium channels inactivate; voltage-gated potassium channels open." },
  { "id": "f", "label": "Repolarisation", "detail": "Potassium flows out; the inside becomes negative again." },
  { "id": "u", "label": "Undershoot, about minus 80 mV", "detail": "Potassium channels close slowly; brief hyperpolarisation." },
  { "id": "b", "label": "Back to rest", "detail": "Leak channels and the pump restore the resting state." }
 ],
 "edgeLabels": { "t>d": "Na+ in", "p>f": "K+ out" },
 "caption": "Press Play and say which ion is moving at each step. Exams love asking which channel causes which phase."
}
:::

:::widget neuron
{
 "title": "Threshold, refractory periods and myelin",
 "myelinated": true,
 "caption": "Raise the input until the neuron fires. Then push it hard: the spikes come faster but never closer than about a millisecond apart, because of the refractory period. Switch myelin off and on and compare the arrival time."
}
:::

### Refractory periods
| | Absolute refractory period | Relative refractory period |
|---|---|---|
| When | During the spike and just after (about 1 ms) | After that, during the undershoot (a few ms) |
| Can it fire? | No, however strong the stimulus | Yes, but only with a stronger than normal stimulus |
| Cause | Sodium channels are **inactivated** and must reset | Some potassium channels still open; membrane is hyperpolarised |
| Consequences | Sets a ceiling on firing rate; makes the spike travel **one way** | Lets intensity be coded by firing rate |

:::widget guess
{
 "prompt": "Because of the absolute refractory period, what is roughly the fastest a neuron can fire, in spikes per second?",
 "min": 10,
 "max": 2000,
 "step": 10,
 "unit": "spikes per second",
 "answer": [500, 1000],
 "reveal": "In theory up to about 1,000 a second (one spike per millisecond); in practice most neurons fire well below a few hundred a second. Intensity is coded within this range by rate and by how many neurons fire.",
 "clinician": "Use-dependent sodium channel blockers (carbamazepine, phenytoin, lamotrigine, lidocaine) bind preferentially to inactivated channels, so they suppress rapid repetitive firing (as in a seizure focus or neuropathic pain) more than normal low-rate firing."
}
:::

### What makes a signal travel faster
- **Wider axons** conduct faster (less internal resistance). The squid giant axon, about half a millimetre wide, let Alan Hodgkin and Andrew Huxley work out the ionic basis of the spike in 1952 using the **voltage clamp**.
- **Myelin** insulates the axon so current jumps from one **node of Ranvier** to the next: **saltatory conduction**. Sodium channels cluster at the nodes. This is faster and uses far less energy.
- Unmyelinated axons conduct **continuously**, slowly.

| Fibre type | Myelin | Speed | Carries |
|---|---|---|---|
| A-alpha | Thick | about 70 to 120 m/s | Muscle commands, muscle stretch sense |
| A-beta | Medium | about 30 to 70 m/s | Touch, pressure |
| A-delta | Thin | about 5 to 30 m/s | Sharp, first pain; cold |
| C | None | about 0.5 to 2 m/s | Dull, burning second pain; warmth; itch |

:::widget sort
{
 "prompt": "What does each agent or condition mainly do?",
 "buckets": ["Blocks voltage-gated sodium channels", "Blocks potassium channels", "Depolarises the resting potential", "Damages myelin"],
 "items": [
  { "text": "Tetrodotoxin from the puffer fish", "bucket": 0, "why": "It plugs sodium channels from outside, abolishing spikes while leaving the resting potential almost unchanged, because rest depends on potassium." },
  { "text": "Lidocaine for a dental injection", "bucket": 0 },
  { "text": "Tetraethylammonium (TEA) in the lab", "bucket": 1, "why": "Spikes still occur but repolarise slowly and last longer." },
  { "text": "High blood potassium in kidney failure", "bucket": 2 },
  { "text": "Multiple sclerosis", "bucket": 3 },
  { "text": "Guillain-Barré syndrome after a gut infection", "bucket": 3, "why": "An immune attack on peripheral myelin; MS attacks central myelin made by oligodendrocytes." },
  { "text": "Carbamazepine in trigeminal neuralgia and epilepsy", "bucket": 0 }
 ]
}
:::

### Graded potentials and summation
Not every voltage change is a spike. **Postsynaptic potentials** are small, **graded** (bigger input, bigger change) and **decremental** (they fade with distance).
- An **EPSP** (excitatory postsynaptic potential) depolarises, usually by opening channels for sodium (glutamate at AMPA receptors).
- An **IPSP** (inhibitory postsynaptic potential) hyperpolarises or clamps the voltage, usually by opening chloride or potassium channels (GABA, glycine).
- **Spatial summation**: inputs from many synapses at the same moment add up.
- **Temporal summation**: rapid repeated inputs from one synapse add up before each fades.
- **Shunting inhibition**: an inhibitory synapse near the cell body can cancel excitatory current arriving from far dendrites, even without much voltage change.

:::widget compare
{
 "title": "Graded potential versus action potential",
 "a": {
  "label": "Graded (postsynaptic) potential",
  "points": ["Size varies with input", "Can depolarise (EPSP) or hyperpolarise (IPSP)", "Fades with distance", "Can summate in space and time", "No refractory period"],
  "summary": "The neuron's way of weighing evidence."
 },
 "b": {
  "label": "Action potential",
  "points": ["All-or-none, fixed size", "Always depolarising", "Travels without fading", "Cannot summate", "Has refractory periods"],
  "summary": "The neuron's decision, sent down the axon."
 },
 "caption": "A neuron is a calculator: graded potentials are the sums, the spike is the answer."
}
:::

:::widget decide
{
 "scene": "Pooja, 21, a hostel student in Pune with bulimia nervosa, vomits several times a day. She comes to the counselling centre with weakness, cramps and palpitations, and asks only for help with her mood.",
 "ask": "Knowing how potassium sets the resting potential, what is the priority?",
 "choices": [
  { "label": "Start weekly therapy for mood and review in a month", "verdict": "harm", "outcome": "She collapses with an irregular heart rhythm a week later.", "why": "Repeated vomiting lowers blood potassium. Low potassium hyperpolarises muscle and nerve and disturbs the heart's rhythm, which can be fatal." },
  { "label": "Arrange same-day medical review with blood potassium and an ECG, then plan eating-disorder treatment", "verdict": "best", "outcome": "Her potassium is 2.6 mM. It is corrected safely, and she begins CBT for bulimia with medical monitoring.", "why": "Purging-related hypokalaemia is common and dangerous; the body comes first, then therapy." },
  { "label": "Advise bananas and coconut water and continue counselling", "verdict": "ok", "outcome": "Her symptoms ease a little but she remains at risk without monitoring.", "why": "Diet alone is not enough when symptoms suggest significant hypokalaemia; she needs a blood test and medical care." }
 ]
}
:::

:::clinician
Hodgkin and Huxley's model (1952; Nobel 1963) described separate sodium and potassium conductances with activation (m) and inactivation (h) gates for sodium and activation (n) for potassium. Neher and Sakmann's patch clamp (Nobel 1991) showed single channels opening in all-or-none steps. The resting permeability ratio in the classic squid data was roughly PK : PNa : PCl = 1 : 0.04 : 0.45. Low extracellular calcium increases sodium channel excitability (tetany, Chvostek and Trousseau signs) because calcium normally stabilises the voltage sensor; hypocalcaemia can present with anxiety, irritability and psychosis. Lithium enters through sodium channels and is not pumped out efficiently. In bulimia and laxative misuse, hypokalaemia with metabolic alkalosis is the typical picture; refeeding syndrome in anorexia causes hypophosphataemia, hypokalaemia and hypomagnesaemia. Conduction velocity in myelinated fibres rises roughly linearly with diameter (about 6 m/s per micrometre); in unmyelinated fibres it rises with the square root of diameter. Demyelination causes slowing, temporal dispersion and conduction block; in MS, Uhthoff's phenomenon (worsening with heat) reflects block in partly demyelinated axons.
:::

:::recall
1. What does the sodium-potassium pump move per ATP? || 3 sodium out and 2 potassium in.
2. What does the Nernst equation give, and what does the Goldman equation give? || Nernst: the equilibrium potential for one ion. Goldman: the actual membrane potential as a permeability-weighted average of several ions.
3. Why is the resting potential close to potassium's equilibrium potential? || At rest the membrane is far more permeable to potassium through leak channels.
4. Where does the action potential usually start? || At the axon initial segment (axon hillock region), which has the most voltage-gated sodium channels.
5. What causes the absolute refractory period? || Inactivation of voltage-gated sodium channels.
6. Distinguish spatial and temporal summation. || Spatial: many synapses at once. Temporal: repeated input from one synapse in quick succession.
7. Why does tetrodotoxin abolish spikes but not the resting potential? || It blocks voltage-gated sodium channels; rest depends mainly on potassium leak channels.
:::

:::mcq
Q: The rising phase of the action potential is caused mainly by:
- Potassium leaving the cell
- *Sodium entering through voltage-gated channels
- Chloride entering through GABA-A channels
- The sodium-potassium pump
> Positive feedback opening of sodium channels.

Q: During the relative refractory period a neuron:
- Cannot fire whatever the stimulus
- *Can fire, but only to a stronger than usual stimulus
- Fires spontaneously
- Has a reversed resting potential
> Some potassium channels remain open and the membrane is hyperpolarised.

Q: Read the assertion and reason. Assertion (A): Action potentials normally travel in one direction along an axon. Reason (R): The membrane just behind the spike is in its refractory period.
- *Both A and R are true, and R is the correct explanation of A
- Both A and R are true, but R is not the correct explanation of A
- A is true, but R is false
- A is false, but R is true
> Inactivated sodium channels behind the spike stop it travelling backwards.

Q: In a neuron, the Goldman equation predicts the resting potential as:
- The equilibrium potential of sodium
- *A weighted average of ion equilibrium potentials, weighted by permeability
- The sum of all ion concentrations
- Zero, because charges balance
> Permeability-weighted average.

Q: Which fibres carry the dull, burning "second pain" after a stubbed toe?
- A-alpha
- A-beta
- A-delta
- *C fibres
> Unmyelinated C fibres conduct at about 1 m/s.
:::

## 2.2 Synaptic transmission in depth: release, recycling and toxins [core][beginner]
You know the five steps: make, store, release, bind, stop. Now look closely at the machinery, because toxins, autoimmune diseases and several medicines each break one specific part, and exams test exactly which part.

### Chemical and electrical synapses
| | Chemical synapse | Electrical synapse |
|---|---|---|
| Gap | About 20 to 40 nanometres | About 3 nanometres |
| How the signal crosses | Transmitter released, binds receptors | Ions flow directly through **gap junctions** (made of connexin proteins) |
| Delay | About 0.5 to 2 ms | Almost none |
| Direction | One way | Usually both ways |
| Can it amplify, invert or learn? | Yes: excitatory or inhibitory, strengthened or weakened | Little |
| Where | Most of the brain | Brainstem nuclei, some interneuron networks, heart muscle, retina |

Charles Sherrington named the **synapse** in 1897. The argument over whether neurons are separate cells (Santiago Ramón y Cajal's **neuron doctrine**) or a continuous net (Camillo Golgi's reticular theory) was settled in Cajal's favour, though the two shared the 1906 Nobel Prize. In 1921 Otto Loewi showed chemical transmission: fluid from a frog heart whose vagus nerve he stimulated slowed a second heart. He called the substance "Vagusstoff"; it was **acetylcholine**.

:::widget timeline
{
 "prompt": "Put these discoveries about nerve signalling in order.",
 "events": [
  { "label": "Galvani makes frog legs twitch with electricity", "when": "1790s" },
  { "label": "Helmholtz measures the speed of a nerve signal", "when": "1850" },
  { "label": "Sherrington names the synapse", "when": "1897" },
  { "label": "Loewi's frog hearts show chemical transmission", "when": "1921" },
  { "label": "Berger records the human EEG", "when": "1929" },
  { "label": "Hodgkin and Huxley explain the action potential", "when": "1952" },
  { "label": "Katz shows transmitter is released in packets (quanta)", "when": "1950s" },
  { "label": "Neher and Sakmann record single ion channels", "when": "1976" }
 ],
 "why": "Electricity first, then the gap, then the chemistry, then the molecules: each step needed a new tool."
}
:::

### The vesicle cycle, step by step
1. **Synthesis**: small transmitters are made in the terminal; **neuropeptides** are made in the cell body and shipped down the axon.
2. **Loading**: transporters pump transmitter into vesicles. **VMAT2** loads dopamine, noradrenaline, serotonin and histamine; others load acetylcholine, glutamate and GABA.
3. **Docking and priming**: vesicles are tethered at **active zones** by **SNARE** proteins: one on the vesicle (**synaptobrevin**, also called VAMP) twists together with two on the membrane (**syntaxin** and **SNAP-25**).
4. **Calcium entry**: the spike opens **voltage-gated calcium channels** at the active zone.
5. **Fusion**: calcium binds the sensor **synaptotagmin**; the SNAREs zip shut and the vesicle opens into the cleft (exocytosis). This takes a fraction of a millisecond.
6. **Recycling**: the vesicle membrane is pulled back in (endocytosis, using clathrin and dynamin), refilled and reused.

Bernard Katz showed that transmitter is released in **quanta**: each vesicle releases a fixed packet, and even at rest single vesicles fuse now and then, giving tiny "miniature" potentials. A spike releases many quanta at once.

:::widget release
{
 "transmitter": "serotonin",
 "caption": "Step through one signal at a serotonin synapse. At the calcium step, picture synaptotagmin and the SNAREs zipping the vesicle open. Try botulinum toxin: which step does it break? Then try an SSRI and an MAO inhibitor and say which step each changes."
}
:::

:::widget flow
{
 "title": "The vesicle cycle",
 "layout": "cycle",
 "nodes": [
  { "id": "f", "label": "Fill", "detail": "Transporters such as VMAT2 load transmitter into the vesicle. Reserpine and tetrabenazine block VMAT." },
  { "id": "d", "label": "Dock and prime", "detail": "SNARE proteins tether the vesicle at the active zone." },
  { "id": "c", "label": "Calcium enters", "detail": "The spike opens voltage-gated calcium channels. Pregabalin and gabapentin reduce calcium entry." },
  { "id": "x", "label": "Fuse and release", "detail": "Synaptotagmin senses calcium; SNAREs zip; transmitter pours out. Botulinum toxin cuts SNAREs." },
  { "id": "e", "label": "Retrieve and recycle", "detail": "The vesicle membrane is pulled back by endocytosis and refilled." }
 ],
 "caption": "Press Play. Each step is a target for a toxin or a medicine."
}
:::

### Toxins and diseases that teach the steps
| Agent or disease | Step affected | Result |
|---|---|---|
| **Botulinum toxin** | Cuts SNAREs at cholinergic terminals; no acetylcholine release | Floppy (flaccid) paralysis; used in tiny doses for dystonia, spasticity, migraine and cosmetic use |
| **Tetanus toxin** | Cuts synaptobrevin in **inhibitory** spinal interneurons | Loss of inhibition: lockjaw, rigid spasms |
| **Black widow venom** (latrotoxin) | Forces massive acetylcholine release, then depletion | Cramps, pain, then weakness |
| **Curare** | Blocks nicotinic receptors at muscle | Paralysis; the basis of muscle relaxants used in modified ECT |
| **Organophosphate pesticides, nerve gases** | Block acetylcholinesterase | Too much acetylcholine everywhere |
| **Strychnine** | Blocks glycine receptors in the spinal cord | Convulsions and rigidity with a clear mind |
| **Myasthenia gravis** | Antibodies against muscle **nicotinic receptors** | Weakness that worsens with use; drooping eyelids, double vision |
| **Lambert-Eaton syndrome** | Antibodies against presynaptic **calcium channels** | Weakness that improves briefly with use; often with small-cell lung cancer |
| **Reserpine** | Blocks VMAT, emptying monoamine vesicles | Lowered blood pressure, and depression in some patients |

:::widget sort
{
 "prompt": "Which step of synaptic transmission does each one break?",
 "buckets": ["Loading vesicles", "Release (fusion or calcium)", "Receptor", "Breakdown"],
 "items": [
  { "text": "Reserpine", "bucket": 0, "why": "Blocking VMAT empties monoamine stores. Its link with depression in the 1950s helped start the monoamine hypothesis." },
  { "text": "Botulinum toxin", "bucket": 1 },
  { "text": "Lambert-Eaton antibodies", "bucket": 1 },
  { "text": "Curare", "bucket": 2 },
  { "text": "Myasthenia gravis antibodies", "bucket": 2 },
  { "text": "An organophosphate pesticide", "bucket": 3 },
  { "text": "Tetrabenazine for chorea", "bucket": 0 },
  { "text": "Strychnine", "bucket": 2 }
 ]
}
:::

### How the signal is switched off
| Transmitter | Main way it is stopped |
|---|---|
| Acetylcholine | Broken down in the cleft by **acetylcholinesterase**; choline is taken back up |
| Dopamine, noradrenaline, serotonin | **Reuptake** by transporters (DAT, NET, SERT), then breakdown inside by **MAO**; some broken by **COMT** |
| Glutamate | Taken up mainly into **astrocytes**, turned into glutamine and returned |
| GABA | Reuptake by GABA transporters; broken down by GABA transaminase |
| Neuropeptides | No reuptake; broken by enzymes (peptidases), so they act longer and spread further |

### Rules about who releases what
- **Dale's principle** (named by John Eccles after Henry Dale): a neuron releases the **same transmitter or set of transmitters** at all of its terminals. The modern form allows **co-transmission**: one neuron can release a small transmitter and a peptide (for example GABA with a peptide), the peptide mainly with high-frequency firing.
- **Autoreceptors** sit on the releasing neuron and sense its own transmitter, usually braking release or firing (D2 on dopamine neurons, 5-HT1A and 5-HT1B on serotonin neurons, alpha-2 on noradrenaline neurons).
- **Heteroreceptors** sense a different transmitter from a neighbour (alpha-2 receptors on serotonin terminals).

:::widget compare
{
 "title": "Two causes of weakness at the nerve-muscle junction",
 "a": {
  "label": "Myasthenia gravis",
  "points": ["Antibodies against muscle acetylcholine receptors", "Weakness worse with repeated use and by evening", "Droopy eyelids, double vision, swallowing trouble", "Improves with acetylcholinesterase inhibitors", "Linked to the thymus gland"],
  "summary": "The receiving side is damaged."
 },
 "b": {
  "label": "Lambert-Eaton syndrome",
  "points": ["Antibodies against presynaptic calcium channels", "Strength improves briefly with repeated effort", "Leg weakness, dry mouth, reduced reflexes", "Often with small-cell lung cancer", "Less transmitter released per spike"],
  "summary": "The sending side is damaged."
 },
 "caption": "Myasthenia is sometimes misread as 'hysterical' weakness because it fluctuates. Fatigable weakness with droopy eyelids needs a neurological opinion."
}
:::

:::clinician
Criteria for a neurotransmitter: synthesised in the presynaptic neuron, stored and released on depolarisation in a calcium-dependent way, acts on specific postsynaptic receptors, mimicked by exogenous application, and removed by a specific mechanism. Small-molecule transmitters are stored in small clear vesicles near active zones and released by single spikes; neuropeptides are in large dense-core vesicles away from active zones and need high-frequency or burst firing. Release probability is low at many central synapses (often 0.1 to 0.5 per spike), which is one substrate of short-term plasticity: paired-pulse facilitation from residual calcium, and depression from vesicle depletion. Botulinum toxin types differ in their SNARE target (type A cleaves SNAP-25). Gabapentinoids bind the alpha-2-delta subunit of voltage-gated calcium channels; pregabalin's misuse potential is now well recognised, including in India where it is widely available. VMAT2 inhibitors (tetrabenazine, deutetrabenazine, valbenazine) are used for chorea and tardive dyskinesia and carry a depression and suicidality warning, a direct echo of the reserpine story. Organophosphate poisoning is one of the commonest means of suicide in rural India: muscarinic signs (salivation, lacrimation, urination, defecation, bronchorrhoea, bradycardia, small pupils) plus nicotinic signs (fasciculations, weakness); treat with atropine titrated to dry chest and pulse, oxygen and supportive care; the benefit of oximes is debated.
:::

:::recall
1. Name the three SNARE proteins and where each sits. || Synaptobrevin (VAMP) on the vesicle; syntaxin and SNAP-25 on the presynaptic membrane.
2. What is the calcium sensor for fast release? || Synaptotagmin.
3. How do electrical synapses differ from chemical ones? || Gap junctions of connexins; almost no delay; usually bidirectional; little capacity to amplify, invert or learn.
4. What did Loewi's experiment show? || Chemical transmission: a substance from the stimulated vagus (acetylcholine) slowed a second heart.
5. What is Dale's principle in its modern form? || A neuron releases the same transmitter or set of co-transmitters at all its terminals.
6. Contrast myasthenia gravis and Lambert-Eaton syndrome. || MG: antibodies to postsynaptic nicotinic receptors, fatigable weakness. LEMS: antibodies to presynaptic calcium channels, strength improves briefly with use, often small-cell lung cancer.
7. How are neuropeptides inactivated? || By peptidases; there is no reuptake.
:::

:::mcq
Q: Tetanus toxin causes rigid spasms, while botulinum toxin causes floppy paralysis, because tetanus toxin mainly blocks release from:
- Motor neurons to muscle
- *Inhibitory interneurons in the spinal cord
- Sensory neurons in the skin
- Dopamine neurons
> Losing inhibition onto motor neurons makes them fire uncontrollably.

Q: Match the agent with its action. Which pair is correct?
- Curare: blocks acetylcholinesterase
- *Strychnine: blocks glycine receptors
- Reserpine: blocks dopamine D2 receptors
- Botulinum toxin: blocks GABA-A receptors
> Curare blocks nicotinic receptors; reserpine blocks VMAT; botulinum cleaves SNAREs.

Q: The main way dopamine's action in the striatum is ended is:
- Breakdown by acetylcholinesterase
- *Reuptake by the dopamine transporter
- Diffusion into the blood
- Uptake into the vesicle by synaptobrevin
> Cocaine blocks DAT; amphetamine reverses it.

Q: A woman's eyelids droop and her speech fades as the day goes on; she recovers after rest. The most likely mechanism is:
- *Antibodies against muscle nicotinic receptors
- Antibodies against NMDA receptors
- Loss of dopamine neurons
- Damage to cerebellar Purkinje cells
> Myasthenia gravis: fatigable weakness.
:::
`;

export const begTransmitters = String.raw`
## 2.4 Glutamate, GABA, glycine and acetylcholine [core][beginner]
The table in 2.3 gave you the whole family in one view. Now take each system in turn, as exams do: **how it is made, where it comes from, what it binds, how it is stopped, and what goes wrong**. Start with the fast amino acids and acetylcholine.

### Glutamate: the main accelerator
- **Made** from glutamine (by the enzyme glutaminase) in nerve terminals. Used glutamate is taken up by **astrocytes**, turned back into glutamine (by glutamine synthetase) and handed back to the neuron: the **glutamate-glutamine cycle**.
- **Where**: almost every cortical pyramidal neuron and most long projections. Glutamate is the transmitter at most excitatory synapses in the brain.
- **Ion-channel receptors**:
  - **AMPA**: fast sodium entry, the workhorse EPSP.
  - **NMDA**: lets in calcium as well as sodium; needs glutamate **plus** a co-agonist (**glycine or D-serine**) **plus** enough depolarisation to push out a **magnesium** plug. It is a **coincidence detector** and the gate for learning.
  - **Kainate**: smaller roles, some presynaptic.
- **G-protein receptors**: eight **metabotropic** receptors (mGluR1 to 8) in three groups; group I excites the receiving cell, groups II and III mostly brake release.
- **When it goes wrong**: too much glutamate floods neurons with calcium and kills them (**excitotoxicity**) in stroke, prolonged seizures, head injury and possibly in Huntington's disease and ALS.

### GABA: the main brake
- **Made** from glutamate by **glutamic acid decarboxylase (GAD)**, which needs vitamin B6. Broken down by **GABA transaminase**. Taken back by **GABA transporters**.
- **Where**: local inhibitory interneurons everywhere; the main output neurons of the striatum and of the cerebellar cortex (Purkinje cells) are also GABA neurons.
- **GABA-A**: a **chloride channel** built from five subunits (most often two alpha, two beta and one gamma). It has separate binding sites for GABA, **benzodiazepines**, **barbiturates**, **neurosteroids**, alcohol and anaesthetics. Benzodiazepines need GABA to be present: they make each opening more frequent. Barbiturates prolong each opening and, at high doses, open the channel alone.
- **GABA-B**: a G-protein receptor that opens potassium channels and reduces release; **baclofen** is an agonist.
- **When it goes wrong**: too little GABA activity: anxiety, insomnia, seizures and the dangerous phase of alcohol or benzodiazepine withdrawal.

:::widget receptor
{
 "receptor": "GABA-A benzodiazepine site",
 "caption": "At the benzodiazepine site, diazepam boosts GABA's effect (shown as the agonist), flumazenil sits in the site with no effect of its own and reverses an overdose (the antagonist), and experimental 'inverse agonists' at this site cause anxiety and even seizures. One site, three kinds of drug, three opposite results."
}
:::

:::widget layers
{
 "title": "The GABA-A receptor: one channel, many doors",
 "shape": "stack",
 "layers": [
  { "label": "GABA site", "detail": "Between alpha and beta subunits. GABA itself opens the chloride channel." },
  { "label": "Benzodiazepine site", "detail": "Between alpha and gamma subunits. Diazepam, lorazepam, clonazepam, and the Z-drugs (zolpidem prefers alpha-1). Flumazenil blocks it." },
  { "label": "Barbiturate site", "detail": "Prolongs opening; at high doses opens the channel without GABA, so overdose is more lethal." },
  { "label": "Neurosteroid site", "detail": "Allopregnanolone, brexanolone, zuranolone. Also acts on receptors outside synapses." },
  { "label": "Alcohol and anaesthetics", "detail": "Alcohol, propofol and some anaesthetic gases also enhance GABA-A, which is why combinations are so dangerous." }
 ],
 "caption": "Different subunits do different jobs: alpha-1 is linked to sedation and amnesia, alpha-2 and alpha-3 to calming anxiety and muscle relaxation, alpha-5 to memory."
}
:::

### Glycine: the spinal brake
Glycine is the main inhibitory transmitter in the **spinal cord and brainstem**, acting at its own chloride channel. **Strychnine** blocks it. Glycine also has a second, opposite job in the brain as the **co-agonist at NMDA receptors**, which is why raising glycine or D-serine has been tried in schizophrenia.

### Acetylcholine: the first transmitter discovered
- **Made** from choline and acetyl-coenzyme A by **choline acetyltransferase (ChAT)**. The supply of choline, taken up by a high-affinity transporter, limits the rate.
- **Stopped** by **acetylcholinesterase (AChE)** in the cleft, which splits it into choline and acetate within about a millisecond.
- **Where**:
  - all motor neurons to skeletal muscle (the neuromuscular junction);
  - all autonomic **preganglionic** neurons, and parasympathetic **postganglionic** neurons;
  - in the brain, the **nucleus basalis of Meynert** (to the whole cortex), the **medial septum** (to the hippocampus), and the **pedunculopontine and laterodorsal tegmental nuclei** in the brainstem (to the thalamus; they help switch on REM sleep); plus interneurons in the striatum.
- **Receptors**:
  - **Nicotinic**: ion channels. The muscle type at the neuromuscular junction; brain types such as alpha-4 beta-2 (nicotine dependence; **varenicline** is a partial agonist here) and alpha-7 (attention, studied in schizophrenia).
  - **Muscarinic** M1 to M5: G-protein receptors. M1, M3 and M5 excite (Gq); M2 and M4 inhibit (Gi). M1 in the cortex supports memory; M2 slows the heart; M3 drives glands and gut; M4 in the striatum is a target of the newest antipsychotic.

:::widget compare
{
 "title": "Nicotinic and muscarinic receptors",
 "a": {
  "label": "Nicotinic",
  "points": ["Ion channel (fast)", "Muscle, autonomic ganglia, brain", "Activated by nicotine", "Blocked by curare and muscle relaxants", "Attacked in myasthenia gravis"],
  "summary": "Fast switches for muscle and ganglia."
 },
 "b": {
  "label": "Muscarinic",
  "points": ["G-protein receptor (slow), M1 to M5", "Heart, glands, gut, eye, brain", "Activated by muscarine (a mushroom toxin)", "Blocked by atropine, trihexyphenidyl, many older medicines", "Blockade gives dry mouth, constipation, confusion"],
  "summary": "Slow switches for organs and memory."
 },
 "caption": "Anticholinergic side effects almost always mean muscarinic blockade."
}
:::

:::widget decide
{
 "scene": "Sukhdev, 45, a farmer from a village near Bathinda, is brought to the emergency department after drinking a pesticide following a crop loss. He is sweating, drooling, has tiny pupils, a slow pulse, wheezing and twitching muscles.",
 "ask": "What is the mechanism and the immediate treatment?",
 "choices": [
  { "label": "Organophosphate blocks acetylcholinesterase; give atropine repeatedly until the chest is dry and the pulse is adequate, with oxygen and airway care; assess suicide risk once he is safe", "verdict": "best", "outcome": "He survives intensive care. The psychiatry team sees him before discharge and works with the family on debt stress, safe storage of pesticides and follow-up.", "why": "Excess acetylcholine at muscarinic sites (secretions, slow heart, small pupils) and nicotinic sites (twitching, weakness). Atropine blocks the muscarinic effects that kill through the lungs." },
  { "label": "Give a benzodiazepine to calm him and observe", "verdict": "harm", "outcome": "He stops breathing as secretions fill his lungs.", "why": "Sedation does not treat cholinergic crisis. This is a medical emergency first." },
  { "label": "Refer straight to psychiatry because it was a suicide attempt", "verdict": "harm", "outcome": "Valuable minutes are lost.", "why": "Medical stabilisation comes first; the psychiatric assessment follows and matters greatly." }
 ]
}
:::

:::widget sort
{
 "prompt": "Which system does each medicine mainly act on?",
 "buckets": ["Glutamate", "GABA", "Acetylcholine"],
 "items": [
  { "text": "Memantine in Alzheimer's disease", "bucket": 0, "why": "A low-affinity NMDA blocker that may damp excitotoxic background activity." },
  { "text": "Donepezil", "bucket": 2 },
  { "text": "Baclofen for spasticity and in some alcohol use disorder", "bucket": 1 },
  { "text": "Ketamine and esketamine", "bucket": 0 },
  { "text": "Varenicline for quitting smoking", "bucket": 2 },
  { "text": "Zolpidem for insomnia", "bucket": 1 },
  { "text": "Acamprosate for alcohol relapse prevention", "bucket": 0, "why": "Thought to damp the glutamate overactivity of protracted alcohol withdrawal." },
  { "text": "Trihexyphenidyl for antipsychotic stiffness", "bucket": 2 },
  { "text": "Vigabatrin (blocks GABA breakdown)", "bucket": 1 }
 ]
}
:::

:::trap Three classic confusions
- **GAD** makes GABA from glutamate; **GABA-T** breaks it down. Do not swap them.
- **Benzodiazepines** increase **frequency** of chloride channel opening; **barbiturates** increase **duration**.
- **Acetylcholine** is broken down **in the cleft**, by an enzyme; monoamines are mostly cleared by **reuptake**.
:::

:::clinician
NMDA receptors are heterotetramers of two GluN1 subunits with GluN2 (A to D) or GluN3; GluN2B-rich receptors predominate early in development and extrasynaptically, and are implicated in excitotoxic signalling; Tang's "Doogie" mice overexpressing GluN2B learned faster. Anti-NMDA receptor encephalitis antibodies target GluN1. In immature neurons GABA-A activation is depolarising because high intracellular chloride (from NKCC1) shifts the chloride reversal potential upward; the developmental switch to KCC2 makes GABA inhibitory, a mechanism studied in neonatal seizures and autism. Extrasynaptic GABA-A receptors containing delta subunits mediate tonic inhibition and are especially sensitive to neurosteroids and low-dose alcohol. Benzodiazepine dependence involves subunit changes and receptor uncoupling. Cholinergic basal forebrain neurons are lost early in Alzheimer's disease (the cholinergic hypothesis of Bartus and colleagues, 1982), the rationale for cholinesterase inhibitors, which give modest symptomatic benefit without altering progression. The central anticholinergic syndrome (delirium, agitation, hyperthermia, dry flushed skin, urinary retention, large pupils) is treated by stopping the offender and, in specialist settings, physostigmine. Anticholinergic burden scores predict delirium, falls and cognitive decline in older adults, so trihexyphenidyl should not be co-prescribed routinely with antipsychotics.
:::

:::recall
1. Describe the glutamate-glutamine cycle. || Neurons release glutamate; astrocytes take it up and convert it to glutamine (glutamine synthetase); glutamine returns to neurons and is converted to glutamate (glutaminase).
2. What three conditions open the NMDA receptor? || Glutamate binding, a co-agonist (glycine or D-serine), and depolarisation to expel the magnesium block.
3. Which enzyme makes GABA, and what vitamin does it need? || Glutamic acid decarboxylase (GAD); vitamin B6.
4. How do benzodiazepines and barbiturates differ at GABA-A? || Benzodiazepines increase the frequency of opening and need GABA; barbiturates increase duration and at high doses open the channel directly.
5. Where is glycine the main inhibitory transmitter, and what blocks it? || Spinal cord and brainstem; strychnine.
6. Name the brain's three main cholinergic sources. || Nucleus basalis of Meynert, medial septum and diagonal band, pedunculopontine and laterodorsal tegmental nuclei.
7. Which muscarinic receptors are Gq and which Gi? || M1, M3, M5 are Gq; M2 and M4 are Gi.
:::

:::mcq
Q: Glutamate-induced neuronal death after a stroke is mainly due to:
- Excess chloride entry through GABA-A receptors
- *Excess calcium entry, largely through NMDA receptors
- Loss of potassium leak channels
- Blocked acetylcholinesterase
> Calcium overload activates destructive enzymes: excitotoxicity.

Q: Flumazenil reverses a benzodiazepine overdose because it is:
- A GABA-A agonist
- *An antagonist at the benzodiazepine site of the GABA-A receptor
- A GABA-B agonist
- An NMDA antagonist
> It occupies the benzodiazepine site without effect of its own.

Q: Read the assertion and reason. Assertion (A): Combining alcohol with a barbiturate is more dangerous than combining alcohol with a benzodiazepine. Reason (R): Barbiturates can open the GABA-A channel directly at high doses, whereas benzodiazepines only enhance GABA's own action.
- *Both A and R are true, and R is the correct explanation of A
- Both A and R are true, but R is not the correct explanation of A
- A is true, but R is false
- A is false, but R is true
> The ceiling of benzodiazepines is lost with barbiturates.

Q: Which receptor is a target of varenicline?
- Muscarinic M1
- *Nicotinic alpha-4 beta-2
- NMDA
- GABA-B
> A partial agonist that eases craving and blunts nicotine's reward.

Q: Small pupils, drooling, slow pulse, wheeze and muscle twitching after drinking a pesticide suggest:
- Anticholinergic poisoning
- *Organophosphate (acetylcholinesterase inhibitor) poisoning
- Opioid overdose alone
- Serotonin syndrome
> Muscarinic plus nicotinic excess.
:::

## 2.5 Monoamines, histamine, neuropeptides, endocannabinoids, orexin and other messengers [core][beginner]
The monoamines are made by small clusters of neurons deep in the brainstem and hypothalamus, yet their long branches reach almost everywhere. They tune whole brain states: alert or drowsy, eager or flat, calm or alarmed. Then come the slower, longer-acting messengers: peptides, lipids and gases.

### The catecholamine production line
One chain makes dopamine, noradrenaline and adrenaline. Each neuron simply stops at a different step.

:::widget flow
{
 "title": "From tyrosine to adrenaline",
 "layout": "chain",
 "nodes": [
  { "id": "ph", "label": "Phenylalanine", "detail": "From diet. Phenylalanine hydroxylase turns it into tyrosine; its absence causes phenylketonuria (PKU)." },
  { "id": "ty", "label": "Tyrosine", "detail": "Tyrosine hydroxylase is the rate-limiting step for all catecholamines." },
  { "id": "ld", "label": "L-DOPA", "detail": "Aromatic L-amino acid decarboxylase (DOPA decarboxylase) converts it. Levodopa in Parkinson's disease enters here." },
  { "id": "da", "label": "Dopamine", "detail": "Dopamine neurons stop here. Broken down to homovanillic acid (HVA)." },
  { "id": "na", "label": "Noradrenaline", "detail": "Dopamine beta-hydroxylase acts inside the vesicle. Broken down to MHPG in the brain and VMA in the body." },
  { "id": "ad", "label": "Adrenaline", "detail": "PNMT adds a methyl group, mainly in the adrenal medulla, boosted by cortisol." }
 ],
 "edgeLabels": { "ty>ld": "tyrosine hydroxylase", "ld>da": "decarboxylase", "da>na": "DBH", "na>ad": "PNMT" },
 "caption": "Press Play. Name the enzyme at each arrow and the breakdown product of each transmitter."
}
:::

### Two enzymes break monoamines down
- **Monoamine oxidase (MAO)** sits on mitochondria inside neurons and other cells. **MAO-A** prefers serotonin and noradrenaline (and tyramine in the gut); **MAO-B** prefers dopamine and is the target of selegiline and rasagiline in Parkinson's disease.
- **Catechol-O-methyltransferase (COMT)** acts outside neurons and is especially important for clearing dopamine in the **prefrontal cortex**, where there are few dopamine transporters.

| Transmitter | Main breakdown product measured in research |
|---|---|
| Dopamine | Homovanillic acid (HVA) |
| Noradrenaline | MHPG (brain); vanillylmandelic acid, VMA (urine; raised in phaeochromocytoma) |
| Serotonin | 5-hydroxyindoleacetic acid (5-HIAA) |

### Serotonin (5-HT)
- **Made** from the amino acid **tryptophan** by **tryptophan hydroxylase** (rate-limiting) to 5-HTP, then by the decarboxylase to serotonin. In the **pineal gland**, serotonin is turned into **melatonin** at night.
- **Where**: the **raphe nuclei** along the midline of the brainstem. The upper (dorsal and median) raphe project to the whole forebrain; the lower raphe to the spinal cord.
- **Most of the body's serotonin**, about 90 per cent, is made in the **gut**; platelets carry it in the blood. Serotonin does not cross the blood-brain barrier, so brain and body pools are separate.
- **Receptors**: 14 types in seven families. All are G-protein receptors **except 5-HT3**, an ion channel.

| Receptor | Coupling | Job and clinical link |
|---|---|---|
| 5-HT1A | Gi | Autoreceptor on raphe cell bodies and inhibitory receptor in the cortex and hippocampus; buspirone is a partial agonist |
| 5-HT1B and 1D | Gi | Terminal autoreceptors; triptans for migraine act here |
| 5-HT2A | Gq | Cortex; psychedelics are agonists; many second-generation antipsychotics block it |
| 5-HT2C | Gq | Appetite and a brake on dopamine release; blockade adds to weight gain; agomelatine blocks it |
| 5-HT3 | Ion channel | Gut and brainstem vomiting centre; ondansetron blocks it; SSRI nausea |
| 5-HT4, 5-HT6, 5-HT7 | Gs | Gut movement, memory, body clock; vortioxetine and lurasidone act at 5-HT7 |

### Noradrenaline
- **Where**: the **locus coeruleus** in the pons, only tens of thousands of neurons on each side but projecting to the whole brain and spinal cord; more in the lateral tegmental area.
- **Receptors**: alpha-1 (Gq; blood vessels, arousal), alpha-2 (Gi; autoreceptor brake; clonidine, guanfacine, lofexidine are agonists, mirtazapine an antagonist), beta-1 (heart), beta-2 (lungs), all G-protein receptors.
- **Clinical links**: arousal and attention (ADHD medicines raise it), panic and PTSD hyperarousal (prazosin, an alpha-1 blocker, is used for trauma nightmares), and opioid withdrawal, when an unbraked locus coeruleus causes sweating, gooseflesh and restlessness (clonidine and lofexidine calm it).

### Histamine
Made from histidine by histidine decarboxylase, in one place only: the **tuberomammillary nucleus** of the posterior hypothalamus. It keeps the cortex **awake**. H1 blockade causes sleepiness and weight gain; H3 receptors are autoreceptors, and **pitolisant**, which blocks them, treats narcolepsy by raising histamine. The brain has no histamine reuptake pump; an enzyme (histamine N-methyltransferase) breaks it down.

:::widget brainmap
{
 "title": "Where the modulating systems start",
 "focus": ["brainstem", "hypothalamus", "basal-ganglia", "frontal"],
 "notes": {
  "brainstem": "Raphe nuclei (serotonin) along the midline; locus coeruleus (noradrenaline) in the pons; ventral tegmental area and substantia nigra (dopamine) in the midbrain; pedunculopontine nucleus (acetylcholine).",
  "hypothalamus": "Tuberomammillary nucleus (histamine, wakefulness); lateral hypothalamus (orexin, stable waking); arcuate nucleus (dopamine to the pituitary).",
  "basal-ganglia": "Nucleus basalis of Meynert sits just below, sending acetylcholine to the whole cortex; striatal interneurons also use acetylcholine.",
  "frontal": "Receives all of them: this is why one antidepressant or antipsychotic can change attention, mood, sleep and appetite at once."
 },
 "caption": "Small clusters, huge reach. Tap each region and name its transmitter."
}
:::

:::widget sort
{
 "prompt": "Match each finding to its transmitter.",
 "buckets": ["Dopamine", "Noradrenaline", "Serotonin", "Histamine"],
 "items": [
  { "text": "Low 5-HIAA in the spinal fluid of people who made violent suicide attempts", "bucket": 2 },
  { "text": "Raised VMA in the urine of a man with episodes of pounding headache, sweating and very high blood pressure", "bucket": 1, "why": "Phaeochromocytoma, an adrenal tumour, can be mistaken for panic disorder." },
  { "text": "HVA in the spinal fluid as a marker of turnover", "bucket": 0 },
  { "text": "Made only in the tuberomammillary nucleus", "bucket": 3 },
  { "text": "Locus coeruleus overactivity in opioid withdrawal", "bucket": 1 },
  { "text": "Most of the body's supply is in the gut", "bucket": 2 }
 ]
}
:::

### Neuropeptides: slow, long-lasting messengers
Peptides are short chains of amino acids made from large **precursor proteins** in the cell body (one precursor, **POMC**, gives ACTH, beta-endorphin and the appetite-reducing alpha-MSH). They are stored in large dense-core vesicles, released mainly with intense firing, act on G-protein receptors, have **no reuptake**, and act for longer and further away than small transmitters.

| Peptide family | Receptor | Clinical link |
|---|---|---|
| **Beta-endorphin** | Mu opioid | Pain relief, reward; morphine and heroin act here |
| **Enkephalins** | Delta (and mu) | Pain control in the spinal cord and brainstem |
| **Dynorphins** | Kappa | Dysphoria and stress; kappa blockers studied for depression and addiction |
| **Substance P** | NK1 | Pain, vomiting (aprepitant blocks NK1 for chemotherapy nausea) |
| **Neuropeptide Y** | Y receptors | Hunger; higher levels linked to stress resilience in soldiers |
| **CRH** | CRH-1 | Starts the stress response; drives anxiety behaviour in animals |
| **Cholecystokinin (CCK)** | CCK-B | Fullness; an injected fragment (CCK-4) triggers panic attacks in research |
| **Oxytocin and vasopressin** | Their own receptors | Bonding, social memory, water balance |

John Hughes and Hans Kosterlitz found the first natural opioids, the enkephalins, in 1975, two years after Candace Pert and Solomon Snyder showed the brain has opioid receptors.

:::widget compare
{
 "title": "Small-molecule transmitter versus neuropeptide",
 "a": {
  "label": "Small-molecule transmitter",
  "points": ["Made in the terminal", "Small clear vesicles at active zones", "Released by single spikes", "Cleared by reuptake or a cleft enzyme", "Milliseconds to seconds"],
  "summary": "Fast, precise point-to-point messages."
 },
 "b": {
  "label": "Neuropeptide",
  "points": ["Made in the cell body from a large precursor", "Large dense-core vesicles", "Released by bursts of firing", "Broken down by peptidases; no reuptake", "Seconds to minutes, wider spread"],
  "summary": "Slow, broad changes in state."
 },
 "caption": "Most neurons release one of each: co-transmission."
}
:::

### Endocannabinoids: messages sent backwards
The brain makes its own cannabis-like molecules, **anandamide** (named in 1992 from the Sanskrit word *ananda*, bliss) and **2-AG**. They are unusual in four ways:
1. They are **lipids**, made **on demand** from the cell membrane, not stored in vesicles.
2. They are released by the **receiving** neuron and travel **backwards** (retrograde) to the sending neuron.
3. There they bind **CB1** receptors (Gi), the most common G-protein receptor in the brain, and **reduce** transmitter release, a brake applied from downstream.
4. They are broken down by enzymes (FAAH for anandamide, MAGL for 2-AG).

**THC**, the main active part of cannabis, is a partial agonist at CB1; the Israeli chemist Raphael Mechoulam identified it in 1964. CB2 receptors are mainly on immune cells and microglia. **Rimonabant**, a CB1 blocker sold for obesity, was withdrawn because it caused depression and suicidal thinking, a striking sign that this system supports mood.

### Orexin (hypocretin): the stabiliser of waking
Orexin neurons sit in the **lateral hypothalamus**; two research groups discovered the peptides independently in 1998, one naming them hypocretins and the other orexins. They fire during waking and keep the brain's arousal systems (histamine, noradrenaline, serotonin, acetylcholine) switched on steadily.
- **Loss of orexin neurons** causes **narcolepsy type 1**: sudden sleep attacks, **cataplexy** (sudden loss of muscle tone triggered by laughter or surprise), sleep paralysis and vivid hallucinations at sleep onset. Orexin in the spinal fluid is very low.
- **Orexin receptor blockers** (suvorexant, lemborexant, daridorexant) are a newer type of sleeping medicine.
- Orexin also drives reward-seeking and is studied in addiction.

### Purines and gases
- **Adenosine** builds up the longer you are awake and creates **sleep pressure**; **caffeine** works by blocking adenosine receptors. ATP is also released as a co-transmitter.
- **Nitric oxide (NO)** is a gas made on demand by nitric oxide synthase. It passes straight through membranes, can act as a retrograde messenger, and raises cyclic GMP. Sildenafil works by preventing the breakdown of cyclic GMP in blood vessels.

:::widget decide
{
 "scene": "Rohan, 17, in Jaipur, falls asleep in class several times a day. When he laughs at a joke his knees buckle and his head drops for a few seconds, though he stays aware. At home he sometimes sees a figure in the room as he falls asleep and cannot move on waking. His teachers think he is lazy and watching phones at night; a relative suggests it is a 'possession'.",
 "ask": "What is the most likely explanation and next step?",
 "choices": [
  { "label": "Narcolepsy type 1 from loss of orexin neurons; refer for a sleep study with a daytime nap test, and explain the condition to family and school", "verdict": "best", "outcome": "Testing confirms narcolepsy. Scheduled naps and medicine help, and his school arranges support.", "why": "Excessive sleepiness plus cataplexy triggered by laughter, sleep paralysis and hypnagogic hallucinations is the classic picture of orexin deficiency." },
  { "label": "Treat as psychosis because he sees figures", "verdict": "harm", "outcome": "He is started on an antipsychotic that makes him sleepier.", "why": "Hallucinations only at sleep onset or waking, with clear insight, are typical of narcolepsy and are not psychosis." },
  { "label": "Advise better sleep habits and less phone use only", "verdict": "ok", "outcome": "His sleep habits improve but the attacks of weakness continue.", "why": "Good habits help, but cataplexy is a neurological symptom that needs proper assessment." }
 ]
}
:::

:::widget guess
{
 "prompt": "What share of the body's serotonin is found in the gut rather than in the brain?",
 "min": 0,
 "max": 100,
 "unit": "per cent",
 "answer": [85, 95],
 "reveal": "About 90 per cent is made by enterochromaffin cells in the gut lining, and most of the rest is carried by platelets. The brain makes its own, because serotonin cannot cross the blood-brain barrier. This is why SSRIs so often cause nausea and loose stools at first, and why 'gut serotonin' claims about mood need care.",
 "clinician": "Peripheral serotonin is synthesised by TPH1 and central serotonin by TPH2. Platelets take up serotonin through SERT, which is one reason SSRIs increase bleeding risk, especially with NSAIDs, anticoagulants and in older adults."
}
:::

:::clinician
Tyrosine hydroxylase and tryptophan hydroxylase both need tetrahydrobiopterin, iron and oxygen; tryptophan hydroxylase is not saturated by normal tryptophan levels, which is why acute tryptophan depletion lowers brain serotonin within hours and was used to probe relapse vulnerability. Dopamine beta-hydroxylase deficiency causes severe orthostatic hypotension; disulfiram inhibits DBH as well as aldehyde dehydrogenase, which may explain psychosis on disulfiram in some patients. The COMT Val158Met polymorphism changes enzyme activity about threefold and prefrontal dopamine accordingly. Åsberg's 1976 report of low CSF 5-HIAA in violent suicide attempters is one of the most replicated biological findings in suicidology, although its predictive value for an individual is low. Oxytocin is made in magnocellular neurons of the paraventricular and supraoptic nuclei. The endocannabinoid system mediates depolarisation-induced suppression of inhibition and excitation; heavy adolescent cannabis use is associated with earlier psychosis onset, and high-potency THC with higher risk. CSF hypocretin-1 below 110 pg/mL is diagnostic for narcolepsy type 1, which is strongly associated with HLA-DQB1*06:02 and is thought to be autoimmune. Pitolisant (an H3 inverse agonist) and solriamfetol (a dopamine and noradrenaline reuptake inhibitor) are newer wake-promoting agents; sodium oxybate acts at GABA-B receptors and treats cataplexy.
:::

:::recall
1. Name the enzymes in order from tyrosine to adrenaline. || Tyrosine hydroxylase (rate-limiting), aromatic L-amino acid decarboxylase, dopamine beta-hydroxylase, PNMT.
2. Give the main metabolite of dopamine, noradrenaline and serotonin. || HVA; MHPG (brain) or VMA (urine); 5-HIAA.
3. Which MAO type prefers dopamine, and which drugs block it? || MAO-B; selegiline and rasagiline.
4. Where are serotonin, noradrenaline and histamine neurons located? || Raphe nuclei; locus coeruleus; tuberomammillary nucleus.
5. Which serotonin receptor is an ion channel? || 5-HT3.
6. Give four ways endocannabinoids differ from classical transmitters. || Lipid, made on demand, not stored in vesicles, released by the postsynaptic neuron and act retrogradely on CB1 to reduce release.
7. What does loss of orexin neurons cause? || Narcolepsy type 1, with cataplexy and low CSF orexin.
8. Match the opioid peptides to their receptors. || Beta-endorphin: mu; enkephalins: delta; dynorphins: kappa.
:::

:::mcq
Q: The rate-limiting enzyme for serotonin synthesis is:
- Tyrosine hydroxylase
- *Tryptophan hydroxylase
- Monoamine oxidase A
- Choline acetyltransferase
> Tryptophan to 5-HTP.

Q: Endocannabinoids such as anandamide are best described as:
- Peptides stored in dense-core vesicles
- *Lipid messengers made on demand that act backwards on presynaptic CB1 receptors
- Monoamines cleared by reuptake
- Gases that act on guanylyl cyclase
> Retrograde lipid signalling.

Q: A man has sudden episodes of falling asleep and collapses at the knees when he laughs, without losing awareness. CSF testing would most likely show low:
- Dopamine
- Serotonin
- *Orexin (hypocretin)
- Melatonin
> Narcolepsy type 1.

Q: Caffeine promotes wakefulness mainly by:
- Releasing histamine
- *Blocking adenosine receptors
- Blocking orexin receptors
- Inhibiting MAO
> Adenosine is the sleep-pressure signal.

Q: In the prefrontal cortex, where dopamine transporters are scarce, dopamine is cleared largely by:
- Acetylcholinesterase
- *COMT
- GABA transaminase
- Peptidases
> COMT matters most where reuptake is weak.

Q: Kappa opioid receptors, activated by dynorphin, are mainly linked with:
- Euphoria
- *Dysphoria and stress
- Appetite stimulation only
- Muscle contraction
> Kappa agonists feel unpleasant; blockers are studied in depression.
:::
`;
