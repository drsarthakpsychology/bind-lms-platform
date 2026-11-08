import type { LongQA } from "@/lib/prep/long-types";
import type { PrepVisual } from "@/lib/prep/types";
import type { FigureData } from "@/lib/study/types";
import { anchored, compare, tree } from "./visual";

/** A labelled anatomy or chart figure from the Study figure library. */
const fig = (id: string, caption: string, focus?: string[]): PrepVisual => ({ kind: "figure", data: { id, ...(focus ? { focus } : {}) } satisfies FigureData, caption });

export const BIOLOGICAL_L02: LongQA[] = anchored([
  {
    id: "bio-l02-001",
    subject: "biological",
    topic: "neurotransmitters",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry", "ma-semester", "ugc-net"],
    question: "Describe the cholinergic system of the brain and its receptors. Discuss the cholinergic hypothesis of Alzheimer's disease and the anticholinergic effects of psychiatric drugs.",
    plan: [
      "Synthesis, release and breakdown of acetylcholine",
      "Cholinergic nuclei and their projections",
      "Nicotinic and muscarinic receptors",
      "The cholinergic hypothesis and cholinesterase inhibitors",
      "Anticholinergic burden and newer muscarinic drugs",
    ],
    answer: `## Synthesis and breakdown
Acetylcholine is made in the terminal from choline and acetyl-CoA by choline acetyltransferase. The rate-limiting step is the uptake of choline by a high-affinity transporter. After release, acetylcholinesterase in the cleft splits it within about a millisecond into choline and acetate, and the choline is taken back up. Acetylcholine was the first transmitter identified, by Otto Loewi and Henry Dale.

## Cholinergic nuclei
Marsel Mesulam numbered the groups Ch1 to Ch6.
- Basal forebrain: the medial septum and diagonal band (Ch1 to Ch3) project to the hippocampus; the nucleus basalis of Meynert (Ch4) projects to the whole cortex and amygdala. These support attention, learning and memory.
- Brainstem: the pedunculopontine and laterodorsal tegmental nuclei (Ch5, Ch6) project to the thalamus and drive wakefulness and REM sleep.
- Striatal interneurons: large cholinergic interneurons balance dopamine in the striatum, which is why anticholinergics relieve drug-induced parkinsonism.
Outside the brain, acetylcholine is the transmitter of all autonomic ganglia, the parasympathetic system and the neuromuscular junction.

## Receptors
| Type | Structure | Subtypes | Examples |
| Nicotinic | Ion channel of five subunits | Muscle type; neuronal alpha-4 beta-2 and alpha-7 | Nicotine and varenicline act at alpha-4 beta-2 |
| Muscarinic | G protein coupled | M1, M3, M5 (Gq); M2, M4 (Gi) | M1 in cortex and memory, M2 in heart, M3 in glands and bladder |

## The cholinergic hypothesis of Alzheimer's disease
In the 1970s Peter Davies and Andrew Maloney found a large loss of choline acetyltransferase in the cortex of people with Alzheimer's disease, and later work showed degeneration of the nucleus basalis. Raymond Bartus and colleagues in 1982 proposed that loss of cortical acetylcholine causes much of the memory and attention deficit. Support came from scopolamine, a muscarinic blocker, which produces memory problems in healthy people.

Treatment followed: cholinesterase inhibitors (donepezil, rivastigmine, galantamine) slow the breakdown of acetylcholine. They give modest, symptomatic benefit in mild to moderate Alzheimer's disease and in Lewy body and Parkinson's disease dementia, but do not stop the disease. Side effects include nausea, diarrhoea, bradycardia and vivid dreams. The hypothesis explains symptoms, while amyloid and tau explain the disease process.

## Anticholinergic effects
Many psychiatric medicines block muscarinic receptors: tricyclics (amitriptyline most), clozapine, olanzapine, chlorpromazine, paroxetine and trihexyphenidyl.
- Peripheral: dry mouth, blurred vision, constipation, urinary retention, tachycardia, reduced sweating.
- Central: confusion, memory impairment and delirium, especially in older adults. Anticholinergic toxicity gives the classic picture: hot as a hare, dry as a bone, red as a beet, blind as a bat, mad as a hatter.
- Scales such as the anticholinergic burden scale help count the total load.

## Newer muscarinic drugs
Xanomeline stimulates M1 and M4 receptors in the brain; combined with trospium, which blocks peripheral muscarinic receptors but does not enter the brain, it was approved in the USA in 2024 for schizophrenia. It is the first antipsychotic without direct D2 blockade.`,
    keyPoints: [
      "Choline uptake as the rate-limiting step, acetylcholinesterase breakdown",
      "Basal forebrain and brainstem nuclei with targets",
      "Nicotinic as ion channel, muscarinic as G protein receptors with subtypes",
      "Cholinergic hypothesis with its evidence",
      "Cholinesterase inhibitors and their limits",
      "Anticholinergic side effects and delirium risk",
      "Xanomeline-trospium as a current example",
    ],
    pitfalls: ["Calling cholinesterase inhibitors disease modifying", "Mixing nicotinic and muscarinic structure", "Forgetting the striatal interneurons"],
    visuals: [fig("cholinergic-projections", "Cholinergic nuclei: acetylcholine pathways of the brain", ["nbm", "septum-ach", "ppt", "striatum"])],
    module: "brain/2-4",
    ref: "Bartus 1982 Science; Davies and Maloney 1976; Mesulam Ch1 to Ch6; Stahl ch 12 dementia; KarXT FDA 2024",
  },
  {
    id: "bio-l02-002",
    subject: "biological",
    topic: "neurotransmitters",
    marks: 15,
    difficulty: 4,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Classify neurotransmitter receptors. Describe G protein coupled receptor signalling and second messenger systems, and explain how psychotropic drugs act through them.",
    plan: [
      "Four receptor families with examples",
      "Ionotropic receptors: speed and structure",
      "G protein receptors: Gs, Gi and Gq cascades",
      "Downstream effects: kinases, CREB and gene expression",
      "Receptor regulation and drug examples, including lithium",
    ],
    answer: `## Four families of receptor
| Family | Speed | Examples |
| Ionotropic (ligand-gated channels) | Milliseconds | Nicotinic, GABA-A, glycine, 5-HT3, AMPA, NMDA, kainate |
| G protein coupled (metabotropic) | Tens of milliseconds to minutes | Dopamine, most serotonin, adrenergic, muscarinic, opioid, mGluR, CB1 |
| Enzyme-linked (receptor tyrosine kinases) | Minutes to hours | TrkB for BDNF, insulin receptor |
| Nuclear receptors | Hours to days | Glucocorticoid, thyroid, oestrogen receptors |

## Ionotropic receptors
These are channels with a binding site. The cys-loop family (nicotinic, GABA-A, glycine, 5-HT3) has five subunits around a pore; glutamate receptors have four subunits. When the transmitter binds, the pore opens and ions flow: sodium and calcium for excitation, chloride for inhibition. They give fast, point-to-point signalling.

## G protein coupled receptors
GPCRs are single proteins that wind through the membrane seven times. Binding of the transmitter changes the receptor's shape, which activates a G protein on the inner surface. The G protein has alpha, beta and gamma subunits; the alpha subunit swaps GDP for GTP and separates to act on an effector. It switches itself off by splitting GTP. One receptor can activate many G proteins, so the signal is amplified.

The three main pathways:
1. Gs (D1, beta, 5-HT4, 6, 7): activates adenylyl cyclase, raising cyclic AMP, which activates protein kinase A.
2. Gi (D2, alpha-2, 5-HT1A, M2, M4, mu opioid, CB1): inhibits adenylyl cyclase, lowering cyclic AMP; its beta-gamma subunits open GIRK potassium channels and close calcium channels, so the cell is inhibited and releases less.
3. Gq (alpha-1, 5-HT2A, 5-HT2C, M1, M3, mGluR1 and 5, H1): activates phospholipase C, which splits PIP2 into IP3 and DAG. IP3 releases calcium from internal stores; DAG and calcium activate protein kinase C.

## Downstream effects
Second messengers activate kinases that phosphorylate many targets: ion channels (changing excitability), receptors (changing sensitivity) and transcription factors. The key transcription factor is CREB. Once phosphorylated, it switches on genes such as BDNF. Repeated activation can also induce stable factors such as delta FosB in the nucleus accumbens with chronic drug use. This is how a medicine that acts at a receptor within minutes produces changes in gene expression and synapse structure over weeks, the likely basis of delayed antidepressant response.

## Receptor regulation
- Desensitisation: kinases (GRKs) phosphorylate an active receptor, arrestin binds and uncouples it, and the receptor may be taken inside the cell.
- Downregulation: long exposure to an agonist reduces receptor numbers, as with 5-HT1A autoreceptors during SSRI treatment, which lets serotonin firing recover and rise.
- Upregulation and supersensitivity: long blockade increases receptor numbers, as with D2 receptors under antipsychotics, a proposed basis of tardive dyskinesia and rebound psychosis.
- Biased agonism: some drugs favour G protein signalling over arrestin signalling at the same receptor, a strategy being explored for safer opioids.

## Drugs and second messengers
| Drug | Receptor or step | Messenger effect |
| Haloperidol | Blocks D2 (Gi) | Removes cyclic AMP inhibition in striatal cells |
| Clonidine | Stimulates alpha-2 (Gi) | Less noradrenaline release |
| Psilocybin, LSD | Stimulate 5-HT2A (Gq) | IP3, calcium and PKC in cortical cells |
| Prazosin | Blocks alpha-1 (Gq) | Less PLC activity |
| Lithium | Inhibits inositol monophosphatase and GSK-3 beta | Depletes inositol, damping Gq signalling; protects neurons |
| Ketamine | Blocks NMDA channel | Downstream BDNF, TrkB and mTOR activation |
| Dexamethasone | Glucocorticoid nuclear receptor | Changes gene transcription |

Michael Berridge proposed the inositol depletion hypothesis: by blocking the recycling of inositol, lithium damps overactive Gq pathways more than normal ones, which could explain why it stabilises mood without sedating. Lithium's inhibition of GSK-3 beta links it to neuroprotection and circadian rhythm genes.

## Conclusion
The receptor family decides the speed and reach of a signal. Ionotropic receptors carry the fast message; GPCRs and their second messengers adjust the cell's sensitivity and, through CREB and gene expression, its structure. Most psychiatric drugs act on GPCRs, which is why their benefits build up slowly.`,
    keyPoints: [
      "Four receptor families with speed and examples",
      "Seven-transmembrane structure and G protein cycle",
      "Gs, Gi and Gq with their effectors and receptor examples",
      "IP3, DAG and calcium; cyclic AMP and PKA",
      "CREB and gene expression explaining delayed effects",
      "Desensitisation, down and upregulation",
      "Lithium's actions on inositol and GSK-3 beta",
    ],
    pitfalls: ["Putting D2 on Gs", "Calling 5-HT3 a GPCR", "Ignoring the link between second messengers and delayed clinical effect"],
    visuals: [
      fig("receptor-families", "Four families of receptor: ion channel versus seven-coil receptor"),
      fig("gpcr-scene", "G protein coupled receptors: a receptor and its G protein at work"),
      fig("lithium-neuron", "Drugs and second messengers: lithium inside a neuron"),
    ],
    module: "brain/5-1",
    ref: "Stahl ch 2 and 3 signal transduction; Berridge 1989 inositol depletion; Bear Connors Paradiso ch 6; brain module 5.1",
  },
  {
    id: "bio-l02-003",
    subject: "biological",
    topic: "neurotransmitters",
    marks: 5,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Write a short note on orexin (hypocretin).",
    plan: ["Discovery and source", "Receptors and functions", "Narcolepsy", "Drugs acting on orexin"],
    answer: `## Discovery and source
Orexin was discovered in 1998 by two groups at once: Luis de Lecea's group named the peptides hypocretins, and Takeshi Sakurai's group named them orexins, after the Greek for appetite. There are two peptides, orexin A and orexin B, cut from one precursor. They are made by a few tens of thousands of neurons in the lateral and perifornical hypothalamus, which project widely to the locus coeruleus, raphe, tuberomammillary nucleus, basal forebrain and cortex.

## Receptors and functions
Two G protein coupled receptors, OX1R and OX2R. Orexin keeps the wake system stable: it excites the arousal nuclei and so holds the sleep wake flip-flop switch firmly in the wake position. It also links feeding, energy balance, reward and stress to arousal: a hungry animal stays awake to forage.

## Narcolepsy
- Dogs with narcolepsy carry a mutation in the OX2R gene, and mice lacking orexin develop narcolepsy.
- In people with narcolepsy type 1 (with cataplexy), post mortem studies found about 90 percent loss of orexin neurons, probably autoimmune; almost all carry HLA-DQB1*06:02.
- CSF orexin of 110 pg/mL or less is diagnostic.
- Without orexin the switch flips unstably, so REM features intrude into waking: cataplexy, sleep paralysis and hypnagogic hallucinations, with excessive daytime sleepiness.

## Drugs
Dual orexin receptor antagonists (suvorexant, lemborexant, daridorexant) treat insomnia by turning the wake signal down rather than sedating through GABA. Orexin receptor 2 agonists are in trials for narcolepsy.`,
    keyPoints: [
      "Discovered 1998, two names",
      "Lateral hypothalamus source and wide projections",
      "OX1R and OX2R",
      "Stabilises wakefulness",
      "Neuron loss in narcolepsy type 1, CSF test, HLA link",
      "Orexin antagonists for insomnia",
    ],
    pitfalls: ["Calling orexin a sleep-promoting peptide", "Leaving out cataplexy"],
    visuals: [fig("sleep-centres", "Receptors and functions: orexin neurons in the wake system", ["orexin", "vlpo", "tmn", "lc"])],
    module: "brain/2-5",
    ref: "de Lecea 1998; Sakurai 1998; Thannickal 2000 Neuron; ICSD-3 narcolepsy criteria",
  },
  {
    id: "bio-l02-004",
    subject: "biological",
    topic: "neurotransmitters",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg", "ugc-net"],
    question: "What criteria must a substance meet to be called a neurotransmitter? Classify neurotransmitters with examples.",
    plan: ["List the criteria", "Note exceptions", "Classify with examples"],
    answer: `## Criteria for a neurotransmitter
A substance is accepted as a neurotransmitter when:
1. It is made in the neuron, which has the enzymes or precursors for it.
2. It is stored in the presynaptic terminal, usually in vesicles.
3. It is released when the neuron fires, in a calcium-dependent way.
4. Applying it to the target cell copies the effect of stimulating the neuron.
5. There is a way to end its action: reuptake, an enzyme or diffusion.
6. Drugs that block its receptor block the effect of stimulating the neuron.

Some messengers break these rules. Nitric oxide is a gas made on demand and not stored in vesicles. Endocannabinoids are made from membrane lipids on demand and travel backwards from the postsynaptic cell. So the modern term is often neuromodulator or chemical messenger.

## Dale's principle and co-transmission
Henry Dale's principle, as later restated, holds that a neuron releases the same set of transmitters at all its terminals. Many neurons release more than one: a classical transmitter plus a neuropeptide (acetylcholine with VIP, GABA with somatostatin, dopamine with glutamate or neurotensin). Peptides are released mainly during high-frequency firing.

## Classification
| Class | Examples |
| Amino acids | Glutamate, aspartate, GABA, glycine |
| Monoamines | Dopamine, noradrenaline, adrenaline, serotonin, histamine |
| Acetylcholine | Acetylcholine |
| Neuropeptides | Endorphins, enkephalins, substance P, oxytocin, vasopressin, orexin, neuropeptide Y, CRH |
| Gases | Nitric oxide, carbon monoxide |
| Lipids | Anandamide, 2-AG |
| Purines | ATP, adenosine (caffeine blocks adenosine receptors) |`,
    keyPoints: [
      "Five or six criteria listed",
      "Calcium-dependent release",
      "Exceptions: nitric oxide and endocannabinoids",
      "Dale's principle and co-transmission",
      "Classification with at least two examples per class",
    ],
    pitfalls: ["Calling nitric oxide a vesicular transmitter", "Leaving out a removal mechanism as a criterion"],
    visuals: [
      tree("Classification", [
        ["Chemical messengers", "Classed by chemistry", -1],
        ["Amino acids", "Glutamate, GABA, glycine", 0],
        ["Monoamines", "Dopamine, noradrenaline, serotonin, histamine", 0],
        ["Acetylcholine", "Nicotinic and muscarinic actions", 0],
        ["Neuropeptides", "Endorphins, substance P, orexin", 0],
        ["Unconventional", "Nitric oxide, endocannabinoids, adenosine", 0],
      ]),
    ],
    module: "brain/1-5",
    ref: "Bear Connors Paradiso ch 6 criteria; Kaplan Synopsis ch 1",
  },
  {
    id: "bio-l02-005",
    subject: "biological",
    topic: "neuroanatomy",
    marks: 20,
    difficulty: 4,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Describe the anatomy and circuitry of the basal ganglia, including the direct, indirect and hyperdirect pathways. Discuss the neuropsychiatric disorders that arise from basal ganglia dysfunction.",
    plan: [
      "Components and their positions",
      "The direct, indirect and hyperdirect pathways with dopamine's role",
      "Parallel cortico-striato-thalamo-cortical loops",
      "Movement disorders: Parkinson's, Huntington's, drug-induced",
      "Psychiatric disorders: OCD, Tourette's, addiction, schizophrenia, and treatments",
    ],
    answer: `## Components
The basal ganglia are deep grey matter nuclei that select and release actions and thoughts.
- Striatum: the input nucleus, made of the caudate nucleus and putamen (dorsal striatum) and the nucleus accumbens with the olfactory tubercle (ventral striatum). The caudate curves alongside the lateral ventricle with a head, body and tail. The putamen and globus pallidus together form the lentiform nucleus, separated from the caudate and thalamus by the internal capsule.
- Globus pallidus: external segment (GPe) and internal segment (GPi), the main output.
- Subthalamic nucleus (STN): the only excitatory (glutamate) nucleus in the circuit.
- Substantia nigra: pars compacta (dopamine neurons) and pars reticulata (an output nucleus like GPi).
About 95 percent of striatal neurons are GABA medium spiny neurons; the rest are cholinergic and GABA interneurons.

## The pathways
The basic loop is cortex to striatum to pallidum to thalamus and back to cortex. GPi and the pars reticulata fire constantly and keep the thalamus under GABA inhibition, like a brake.

1. Direct pathway: cortex (glutamate) excites striatal neurons carrying D1 receptors, substance P and dynorphin. These inhibit GPi. Less GPi inhibition frees the thalamus, which excites the cortex: the brake comes off and the chosen action goes ahead.
2. Indirect pathway: cortex excites striatal neurons carrying D2 receptors and enkephalin. These inhibit GPe. GPe normally inhibits the STN, so the STN is released and excites GPi. More GPi output inhibits the thalamus: the brake goes on and competing actions are suppressed.
3. Hyperdirect pathway: cortex excites the STN directly, which quickly excites GPi and pauses all action: a stop signal.

Dopamine from the substantia nigra excites the direct pathway through D1 and inhibits the indirect pathway through D2. Both effects favour movement. Loss of dopamine therefore weakens the go signal and strengthens the stop signal.

## Parallel loops
Garrett Alexander, Mahlon DeLong and Peter Strick described in 1986 parallel, largely separate loops through the basal ganglia:
| Loop | Cortex | Striatum | Disorder when it fails |
| Motor | Motor and supplementary motor | Putamen | Parkinsonism, chorea, tics |
| Oculomotor | Frontal eye fields | Caudate body | Saccade problems |
| Dorsolateral prefrontal | Dorsolateral PFC | Dorsolateral caudate | Executive dysfunction |
| Lateral orbitofrontal | Orbitofrontal cortex | Ventromedial caudate | Disinhibition, OCD |
| Anterior cingulate (limbic) | Anterior cingulate, medial OFC | Nucleus accumbens | Apathy, abulia, addiction |
So the same circuit design controls movement, thinking, emotion and motivation, which explains why basal ganglia disease produces both motor and psychiatric symptoms.

## Movement disorders
- Parkinson's disease: loss of nigral dopamine neurons (symptoms appear after roughly 60 to 80 percent striatal dopamine loss) gives bradykinesia, rigidity, rest tremor and postural instability. Depression, anxiety, apathy, REM sleep behaviour disorder and dementia are common; dopamine agonists can cause impulse control disorders and psychosis.
- Huntington's disease: autosomal dominant expansion of CAG repeats in the HTT gene on chromosome 4 (40 or more repeats is fully penetrant). Indirect pathway neurons die first, so the brake fails and chorea appears. Caudate atrophy is seen on imaging. Depression, irritability, apathy, psychosis and suicide are frequent and can precede chorea.
- Drug-induced: D2 blockade causes parkinsonism, dystonia and akathisia; long-term blockade can cause tardive dyskinesia. Valbenazine and deutetrabenazine (VMAT2 inhibitors) treat tardive dyskinesia.
- Wilson's disease: copper deposits in the lentiform nucleus cause tremor, dystonia, personality change and psychosis in young people.
- Fahr's disease: calcification of the basal ganglia with mood change and psychosis.

## Psychiatric disorders
- OCD: hyperactivity in the orbitofrontal, anterior cingulate and caudate loop is seen on PET and fMRI. Effective SSRI treatment and CBT both reduce it. Deep brain stimulation of the ventral capsule and ventral striatum is used for severe, treatment-resistant OCD.
- Tourette's syndrome and tics: failure of striatal selection releases unwanted motor programmes; D2 blockers and alpha-2 agonists reduce tics. Sydenham's chorea after rheumatic fever, with OCD symptoms, shows an autoimmune route.
- Addiction: drug cues drive the ventral striatum at first; with repetition, control shifts to the dorsal striatum, so drug use becomes a habit, as Barry Everitt and Trevor Robbins proposed.
- Schizophrenia: the largest dopamine excess is in the associative (caudate) striatum, linked to the prefrontal loop.
- Apathy and abulia after caudate or pallidal strokes, and in progressive supranuclear palsy.
- ADHD: smaller caudate volumes in childhood and stimulant action through striatal dopamine.

## Treatments acting on the circuit
Levodopa replaces dopamine; anticholinergics rebalance striatal acetylcholine; deep brain stimulation of the STN or GPi relieves Parkinson's disease, and ventral striatal targets are used for OCD. These show that the loops can be modulated from many points.

## Conclusion
The basal ganglia work as a gate that lets one action, thought or goal through while holding back the rest. Too much brake gives poverty of movement or motivation; too little gives chorea, tics, compulsions and habits.`,
    keyPoints: [
      "Components including striatum subdivisions, GPe, GPi, STN, substantia nigra",
      "GPi as tonic inhibitor of the thalamus",
      "Direct (D1) and indirect (D2) pathways traced step by step",
      "Hyperdirect pathway as stop signal",
      "Dopamine favours movement through both pathways",
      "Parallel loops after Alexander, DeLong and Strick",
      "Parkinson's and Huntington's with psychiatric features",
      "OCD, tics, addiction and schizophrenia links with treatments",
    ],
    pitfalls: [
      "Getting the indirect pathway order wrong",
      "Treating the basal ganglia as purely motor",
      "Forgetting the subthalamic nucleus is excitatory",
    ],
    visuals: [
      fig("basal-ganglia", "Components: the basal ganglia seen through the side of the brain", ["caudate", "putamen", "pallidus", "accumbens", "stn", "nigra"]),
      fig("basal-ganglia-circuit", "The pathways: the basal ganglia loop on a coronal slice", ["direct", "indirect", "gpi", "stn", "da"]),
      fig("coronal-section", "Parallel loops: a coronal slice through the striatum, pallidum and thalamus", ["caudate", "putamen", "pallidus", "capsule", "thalamus"]),
    ],
    module: "brain/3-2",
    ref: "Alexander DeLong Strick 1986 Annu Rev Neurosci; Kaplan Synopsis neuroanatomy; Everitt and Robbins 2005; brain module 3.2",
  },
  {
    id: "bio-l02-006",
    subject: "biological",
    topic: "neuroanatomy",
    marks: 15,
    difficulty: 3,
    exams: ["md-psychiatry", "ma-semester", "ugc-net", "mcp-entrance"],
    question: "Describe the limbic system and the Papez circuit. Discuss the clinical syndromes that arise from lesions of limbic structures.",
    plan: [
      "History of the concept: Broca, Papez, MacLean",
      "Components of the limbic system",
      "Trace the Papez circuit step by step",
      "Functions: memory, emotion, motivation",
      "Clinical syndromes: Kluver-Bucy, Korsakoff, HM, limbic encephalitis, temporal lobe epilepsy",
    ],
    answer: `## History of the idea
Paul Broca in 1878 called the ring of cortex around the brainstem and corpus callosum the great limbic lobe (limbus means border). James Papez in 1937 proposed that a closed circuit through these structures was the anatomical basis of emotion. Paul MacLean in 1952 coined the term limbic system and later placed it within his triune brain idea, a model now considered too simple, because the limbic system is not one unit and much of it serves memory rather than emotion.

## Components
- Cortical: cingulate gyrus, parahippocampal gyrus with the entorhinal cortex, hippocampal formation (dentate gyrus, CA fields, subiculum), and the orbitofrontal and insular cortex in wider definitions.
- Subcortical: amygdala, septal nuclei, mammillary bodies and hypothalamus, anterior and mediodorsal thalamic nuclei, nucleus accumbens.
- Fibre tracts: fornix, mammillothalamic tract, cingulum, stria terminalis, uncinate fasciculus.

## The Papez circuit
1. Hippocampus (subiculum) sends fibres through the fornix.
2. The fornix arches under the corpus callosum to the mammillary bodies of the hypothalamus.
3. The mammillothalamic tract carries the signal to the anterior nucleus of the thalamus.
4. The anterior thalamus projects to the cingulate gyrus.
5. The cingulum bundle runs back to the parahippocampal gyrus and entorhinal cortex.
6. The entorhinal cortex projects through the perforant path into the hippocampus, closing the loop.

Papez thought this circuit created feeling. We now know that it is mainly a circuit for episodic memory: damage at any point causes amnesia. Emotional processing depends more on a second, basolateral circuit described by Paul Yakovlev, linking the amygdala, orbitofrontal cortex, mediodorsal thalamus and temporal pole.

## Functions
- Episodic and spatial memory: the hippocampus binds the what, where and when of events, and place cells map space.
- Emotion: the amygdala detects threat and emotional significance, and tags memories for strong storage.
- Motivation and reward: the nucleus accumbens and its dopamine input.
- Autonomic and endocrine control through the hypothalamus.
- Social behaviour, attachment and smell, since the olfactory system feeds directly into the amygdala and entorhinal cortex.

## Clinical syndromes
| Syndrome | Lesion | Features |
| Kluver-Bucy syndrome | Bilateral anterior temporal lobes and amygdala | Placidity, loss of fear, hyperorality, hypersexuality, visual agnosia, hypermetamorphosis |
| Amnesic syndrome, the patient HM | Bilateral medial temporal lobe removed by William Scoville in 1953 for epilepsy | Severe anterograde amnesia, some retrograde loss, intact IQ and procedural learning |
| Korsakoff syndrome | Mammillary bodies and mediodorsal thalamus, from thiamine deficiency | Anterograde and retrograde amnesia, confabulation, apathy |
| Fornix damage | Colloid cyst of the third ventricle, surgery | Sudden amnesia |
| Limbic encephalitis | Herpes simplex, autoimmune (anti-NMDA, LGI1), paraneoplastic | Confusion, memory loss, seizures, psychosis, personality change |
| Temporal lobe epilepsy | Mesial temporal sclerosis | Deja vu, fear, epigastric rising, olfactory hallucinations, automatisms, interictal psychosis |
| Transient global amnesia | Hippocampal CA1 | Hours of anterograde amnesia with repeated questions |

Heinrich Kluver and Paul Bucy described their syndrome in monkeys in the late 1930s; partial forms occur in people after herpes encephalitis, head injury and frontotemporal dementia.

## Psychiatric relevance
- Depression and PTSD: smaller hippocampal volumes, linked to chronic stress hormones; amygdala overactivity to negative cues.
- Schizophrenia: reduced hippocampal volume and hyperactivity of the anterior hippocampus that may drive dopamine excess.
- Alzheimer's disease starts in the entorhinal cortex and hippocampus, explaining early episodic memory loss.
- Herpes encephalitis can present as an acute psychiatric illness, so new psychosis with fever, seizures or confusion needs urgent investigation and aciclovir.

## Conclusion
The limbic system is better seen as a set of linked networks for memory, emotion and motivation than as a single emotional brain. Knowing the Papez circuit lets a clinician predict that damage to the fornix, mammillary bodies or anterior thalamus will cause amnesia.`,
    keyPoints: [
      "Broca, Papez and MacLean with the critique of the triune idea",
      "Components grouped as cortical, subcortical and tracts",
      "Papez circuit traced in the right order",
      "Papez circuit now seen as memory circuit; Yakovlev for emotion",
      "Kluver-Bucy features listed",
      "HM and Korsakoff linked to lesion sites",
      "Limbic encephalitis as a psychiatric presentation",
    ],
    pitfalls: ["Leaving out the mammillothalamic tract", "Calling the whole limbic system the seat of emotion", "Missing the clinical syndromes"],
    visuals: [
      fig("limbic-system", "The Papez circuit: the limbic system and its loop", ["hippocampus", "fornix", "mammillary", "mtt", "anteriorthal", "cingulate", "cingulum", "parahip"]),
      fig("brain-medial", "Components: limbic structures on the medial surface", ["cingulate", "fornix", "mammillary", "thalamus", "hypothalamus"]),
    ],
    module: "brain/3-3",
    ref: "Papez 1937; MacLean 1952; Scoville and Milner 1957; Kluver and Bucy 1939; Kaplan Synopsis ch 1; brain module 3.3",
  },
  {
    id: "bio-l02-007",
    subject: "biological",
    topic: "neuroanatomy",
    marks: 15,
    difficulty: 3,
    exams: ["md-psychiatry", "ma-semester", "mcp-entrance"],
    question: "Describe the nuclei of the hypothalamus and their functions. Add a note on the psychiatric relevance of hypothalamic disorders.",
    plan: [
      "Position and boundaries",
      "Nuclei by region with functions",
      "Main functions grouped: endocrine, autonomic, homeostasis, circadian, behaviour",
      "Lesion effects",
      "Psychiatric relevance",
    ],
    answer: `## Position
The hypothalamus lies below the thalamus, forming the floor and lower walls of the third ventricle. It weighs only about 4 grams but controls the internal environment. Its front limit is the lamina terminalis and optic chiasm; behind lie the mammillary bodies; below, the pituitary stalk hangs from the median eminence. It links the nervous system to the endocrine system through the pituitary.

## Nuclei by region
From front to back it is divided into the preoptic, supraoptic (anterior), tuberal and mammillary (posterior) regions, and from the midline outwards into periventricular, medial and lateral zones.

| Region | Nucleus | Main function |
| Preoptic | Medial preoptic area | Temperature sensing, sexual and parental behaviour, GnRH cells |
| Preoptic | Ventrolateral preoptic nucleus (VLPO) | Sleep switch, inhibits arousal centres |
| Supraoptic region | Suprachiasmatic nucleus (SCN) | Master circadian clock, light input from the retina |
| Supraoptic region | Supraoptic nucleus | Vasopressin (and oxytocin) to the posterior pituitary |
| Supraoptic region | Paraventricular nucleus (PVN) | Oxytocin, vasopressin; CRH and TRH to the anterior pituitary; autonomic control |
| Supraoptic region | Anterior nucleus | Heat loss: sweating, vasodilation |
| Tuberal | Arcuate nucleus | Dopamine that inhibits prolactin; GHRH; POMC and NPY appetite neurons; leptin sensing |
| Tuberal | Ventromedial nucleus | Satiety, defensive aggression |
| Tuberal | Dorsomedial nucleus | Feeding rhythms, circadian output |
| Lateral zone | Lateral hypothalamic area | Hunger and arousal; orexin and MCH neurons |
| Mammillary | Posterior nucleus | Heat conservation: shivering, vasoconstriction |
| Mammillary | Tuberomammillary nucleus | Histamine for wakefulness |
| Mammillary | Mammillary bodies | Memory, part of the Papez circuit |

## Functions in groups
1. Endocrine: releasing and inhibiting hormones (CRH, TRH, GnRH, GHRH, somatostatin, dopamine) travel in the portal vessels to the anterior pituitary; oxytocin and vasopressin travel down axons to the posterior pituitary.
2. Autonomic: the PVN and dorsomedial nucleus drive sympathetic and parasympathetic centres in the brainstem and cord.
3. Homeostasis: temperature, thirst (osmoreceptors in the organum vasculosum and subfornical organ), hunger and satiety, through leptin, ghrelin and insulin signals acting on arcuate neurons. POMC neurons reduce appetite; NPY and AgRP neurons increase it.
4. Circadian rhythm: the SCN receives light through the retinohypothalamic tract from melanopsin cells and times sleep, cortisol, temperature and melatonin.
5. Sleep and arousal: VLPO for sleep; orexin and histamine for waking.
6. Behaviour: sexual behaviour, aggression, fear responses with the amygdala, and maternal care.

## Lesion effects
- Ventromedial lesion in rats: overeating and obesity, with rage.
- Lateral lesion: refusal to eat and drink, which can be fatal.
- Anterior lesion: hyperthermia; posterior lesion: poikilothermia.
- SCN lesion: loss of daily rhythms.
- Supraoptic and PVN damage: central diabetes insipidus.

## Psychiatric relevance
- Depression: HPA axis overactivity from PVN CRH, with disturbed sleep, appetite, libido and rhythms; the vegetative signs of melancholia are hypothalamic signs.
- Eating disorders: anorexia nervosa causes hypothalamic amenorrhoea and low GnRH; hypothalamic tumours can mimic anorexia.
- Narcolepsy: loss of lateral hypothalamic orexin neurons.
- Prader-Willi syndrome: hypothalamic dysfunction with insatiable appetite, obsessive behaviour and temper outbursts.
- Wernicke encephalopathy and Korsakoff syndrome: mammillary body damage.
- Gelastic seizures (laughing fits) from hypothalamic hamartoma, with rage and aggression.
- Craniopharyngioma presses on the hypothalamus, causing obesity, sleepiness and personality change.
- Antipsychotics affect hypothalamic appetite circuits (H1 and 5-HT2C blockade), contributing to weight gain.
- Sexual orientation research: Simon LeVay reported in 1991 that the third interstitial nucleus of the anterior hypothalamus was smaller in gay men than in straight men; the study was small and is not a proof of cause.

## Conclusion
The hypothalamus turns needs and emotions into hormones, autonomic responses and drives. Disturbed sleep, appetite, temperature, libido and stress hormones in psychiatric disorders all point back to it.`,
    keyPoints: [
      "Position in the floor of the third ventricle",
      "Regions from preoptic to mammillary",
      "SCN, SON, PVN, arcuate, VMN, lateral area, TMN with functions",
      "Portal versus axonal routes to the pituitary",
      "Appetite circuit with leptin, POMC and NPY",
      "Classic lesion effects",
      "At least five psychiatric links",
    ],
    pitfalls: ["Swapping lateral and ventromedial lesion effects", "Forgetting the SCN and circadian role", "Listing nuclei with no functions"],
    visuals: [
      fig("hypothalamus", "Nuclei by region: the nuclei of the hypothalamus", ["preoptic", "scn", "son", "pvn", "arcuate", "vmn", "lateral", "tmn", "mammillary"]),
      fig("pituitary", "Functions in groups: the hypothalamus and pituitary linked by vessels and axons", ["pvn", "son", "portal", "anterior", "tract", "posterior"]),
    ],
    module: "brain/3-3",
    ref: "Kaplan Synopsis ch 1 hypothalamus; Bear Connors Paradiso ch 15 and 16; LeVay 1991 Science; brain module 3.3",
  },
  {
    id: "bio-l02-008",
    subject: "biological",
    topic: "neuroanatomy",
    marks: 10,
    difficulty: 4,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Describe the nuclei of the thalamus and their connections. Discuss thalamic syndromes of neuropsychiatric importance.",
    plan: [
      "Position and the internal medullary lamina",
      "Nuclear groups with inputs and outputs",
      "Functions beyond relay: gating and rhythms",
      "Thalamic syndromes",
      "Thalamus in schizophrenia",
    ],
    answer: `## Position and divisions
The thalamus is a pair of egg-shaped grey masses on either side of the third ventricle, above the hypothalamus. A Y-shaped sheet of white matter, the internal medullary lamina, divides each into anterior, medial and lateral groups. Almost every input to the cortex, except smell, passes through it.

## Nuclear groups
| Group | Nucleus | Input | Output | Role |
| Anterior | Anterior nucleus | Mammillary bodies | Cingulate gyrus | Memory, Papez circuit |
| Medial | Mediodorsal nucleus | Amygdala, basal ganglia, olfactory cortex | Prefrontal cortex | Executive function, emotion |
| Lateral, ventral | Ventral anterior and ventral lateral | Basal ganglia, cerebellum | Motor and premotor cortex | Movement |
| Lateral, ventral | Ventral posterolateral (VPL) | Spinothalamic tract, medial lemniscus | Sensory cortex | Body sensation |
| Lateral, ventral | Ventral posteromedial (VPM) | Trigeminal, taste | Sensory cortex | Face sensation, taste |
| Posterior | Pulvinar | Superior colliculus, visual cortex | Parietal, occipital, temporal cortex | Visual attention |
| Posterior | Lateral geniculate | Optic tract | Visual cortex | Vision |
| Posterior | Medial geniculate | Inferior colliculus | Auditory cortex | Hearing |
| Intralaminar | Centromedian and others | Reticular formation | Striatum, wide cortex | Arousal |
| Reticular nucleus | A thin GABA shell | Collaterals of thalamocortical fibres | Back to thalamus | Gating, sleep spindles |

## More than a relay
The thalamus filters and gates information. Cortical feedback to the thalamus outnumbers the forward input, so attention can select what reaches awareness. The reticular nucleus inhibits relay cells and generates sleep spindles; in deep sleep thalamocortical cells fire in bursts and block sensory input. Arvid Carlsson suggested that the thalamus acts as a filter whose failure floods the cortex with stimuli, a model of psychosis.

## Thalamic syndromes
- Dejerine-Roussy syndrome: a stroke in VPL and VPM causes sensory loss on the opposite side followed by severe burning pain (central post-stroke pain).
- Paramedian thalamic infarction: both medial thalami supplied by one artery of Percheron. Sudden drowsiness or coma, vertical gaze palsy, then amnesia, apathy and personality change, which can be mistaken for depression or dementia.
- Korsakoff syndrome: damage to the mediodorsal nucleus and mammillary bodies.
- Thalamic dementia and abulia after bilateral medial lesions.
- Fatal familial insomnia: an inherited prion disease (PRNP mutation) that destroys the anterior and mediodorsal nuclei, causing untreatable insomnia, autonomic overactivity, hallucinations and death.
- Thalamic aphasia: fluent speech with paraphasias but preserved repetition after left thalamic lesions.

## Thalamus in schizophrenia
Imaging and post mortem studies report a smaller mediodorsal nucleus and pulvinar. Functional studies show reduced prefrontal-thalamic and increased sensory-thalamic connectivity, matching the idea of a faulty filter.`,
    keyPoints: [
      "Internal medullary lamina divides the groups",
      "Inputs and outputs of anterior, mediodorsal, VA/VL, VPL, VPM, pulvinar, LGN, MGN",
      "Reticular nucleus and gating",
      "Dejerine-Roussy syndrome",
      "Artery of Percheron infarction",
      "Fatal familial insomnia and Korsakoff links",
    ],
    pitfalls: ["Calling the thalamus a passive relay", "Saying smell relays through the thalamus first", "Mixing up the geniculate bodies"],
    visuals: [
      fig("horizontal-section", "Nuclear groups: the thalamus in a horizontal slice beside the internal capsule", ["thalamus", "plic", "v3"]),
      fig("brain-medial", "Thalamic syndromes: the thalamus beside the third ventricle on the midline view", ["thalamus", "hypothalamus", "mammillary"]),
    ],
    module: "brain/3-3",
    ref: "Kaplan Synopsis neuroanatomy; Schmahmann thalamic stroke review 2003; Lugaresi 1986 FFI; brain module 3.3",
  },
  {
    id: "bio-l02-009",
    subject: "biological",
    topic: "neuroanatomy",
    marks: 20,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester", "ugc-net"],
    question: "Describe the subdivisions and functions of the prefrontal cortex. Discuss the frontal lobe syndromes, their causes and their bedside assessment.",
    plan: [
      "Position and maturation of the prefrontal cortex",
      "Subdivisions with Brodmann areas and functions",
      "Three frontal syndromes with features",
      "Classic cases: Phineas Gage and EVR",
      "Causes and bedside and neuropsychological tests",
      "Prefrontal changes in psychiatric disorders",
    ],
    answer: `## The prefrontal cortex
The prefrontal cortex is the part of the frontal lobe in front of the motor and premotor areas. It is much larger in humans than in other primates and is the last part of the brain to mature: synaptic pruning and myelination continue into the mid-twenties. It receives information from all sensory association areas and from limbic and subcortical structures, and its role is to direct behaviour towards goals: planning, choosing, holding information in mind, inhibiting the wrong response and fitting behaviour to social context.

## Subdivisions and functions
| Region | Brodmann areas | Functions |
| Dorsolateral PFC | 9, 46 | Working memory, planning, set shifting, abstract reasoning, verbal fluency |
| Ventrolateral PFC | 44, 45, 47 | Response inhibition, language (left Broca's area) |
| Frontopolar cortex | 10 | Multitasking, thinking about future goals |
| Orbitofrontal cortex | 11, 47 and lateral 12 | Value of rewards, reversal learning, social rules, impulse control |
| Ventromedial PFC | Medial 10, 11, 32 | Linking emotion to decisions, extinction of fear |
| Anterior cingulate | 24, 32 | Conflict monitoring, error detection, motivation, pain affect |
| Subgenual cingulate | 25 | Mood regulation; overactive in depression |
Antonio Damasio's somatic marker hypothesis proposes that the ventromedial cortex uses body signals of past outcomes to guide choices. Patients with ventromedial damage do poorly on the Iowa Gambling Task: they keep choosing high-reward, high-loss decks.

## The three frontal syndromes
1. Dorsolateral (dysexecutive) syndrome: poor planning and organisation, concrete thinking, perseveration (repeating the same answer or action), poor set shifting, reduced fluency, impaired working memory, and a slow, flat manner. It can look like depression.
2. Orbitofrontal (disinhibited) syndrome: impulsivity, tactlessness, crude jokes and fatuous humour (witzelsucht, moria), poor judgement, sexual disinhibition, irritability, overeating and utilisation behaviour. Intelligence on standard tests may be normal. It can look like mania or antisocial personality.
3. Medial frontal and anterior cingulate (apathetic) syndrome: abulia, lack of spontaneous speech and movement, indifference and in severe cases akinetic mutism, with urinary incontinence if the paracentral lobule is involved. It can look like depression or catatonia.
Most patients show a mixture.

## Classic cases
- Phineas Gage, a railway foreman, survived a tamping iron passing through his left frontal lobe in 1848. His doctor John Harlow reported that he became fitful, profane and unable to keep to plans: his friends said he was no longer Gage. Modern reconstruction placed the damage in the ventromedial cortex.
- EVR, studied by Paul Eslinger and Antonio Damasio in 1985, had a ventromedial tumour removed. His IQ stayed superior, but he made ruinous decisions in work, money and marriage, showing that intelligence and judgement can separate.

## Causes
- Behavioural variant frontotemporal dementia: personality change, disinhibition, apathy, loss of empathy, compulsions and sweet food craving, often in the fifties; frequently misdiagnosed as a primary psychiatric disorder.
- Traumatic brain injury, especially road traffic accidents, which damage orbitofrontal and frontal pole regions against the skull.
- Tumours (meningioma of the olfactory groove can grow silently to a large size), stroke of the anterior cerebral artery, normal pressure hydrocephalus, multiple sclerosis, HIV, neurosyphilis, alcohol-related brain damage and Huntington's disease.

## Bedside assessment
- History from an informant, because insight is often poor.
- Frontal Assessment Battery: six items covering similarities, letter fluency, the Luria fist-edge-palm motor series, conflicting instructions, go/no-go and prehension (grasp) behaviour.
- Verbal fluency: words beginning with a letter in one minute; fewer than about ten is abnormal.
- Proverbs and similarities for abstract thinking.
- Cognitive estimates (how tall is the average Indian woman) for bizarre answers.
- Primitive reflexes: grasp, pout and palmomental, which support but do not prove frontal disease.
- The frontal items of the Addenbrooke's Cognitive Examination and MoCA.

Neuropsychological tests: Wisconsin Card Sorting Test (set shifting, perseverative errors), Stroop test (inhibition), Trail Making Test B, Tower of London (planning), Iowa Gambling Task (ventromedial function) and the Hayling and Brixton tests.

## Prefrontal changes in psychiatric disorders
- Schizophrenia: Daniel Weinberger showed in 1986 that patients failed to increase dorsolateral blood flow during the Wisconsin task (hypofrontality); later work describes inefficient activation. Reduced mesocortical dopamine and reduced spine density add to this.
- Depression: reduced dorsolateral and increased subgenual cingulate activity; rTMS targets the left dorsolateral cortex and Helen Mayberg used deep brain stimulation of area 25.
- OCD: overactive orbitofrontal cortex.
- ADHD: delayed cortical maturation and weaker inhibitory control.
- Addiction: weakened prefrontal control over drug-seeking.
- Antisocial personality and psychopathy: reduced orbitofrontal and ventromedial grey matter in some studies.

## Conclusion
The prefrontal cortex is a set of distinct regions rather than one executive. A clear picture of the three syndromes helps the psychiatrist recognise frontal disease that masquerades as depression, mania or personality disorder, and to choose the right tests.`,
    keyPoints: [
      "Late maturation and goal-directed role",
      "Subdivisions with Brodmann areas and functions",
      "Dorsolateral, orbitofrontal and medial syndromes with features",
      "Phineas Gage and EVR",
      "bvFTD and other causes",
      "Bedside tests including the Frontal Assessment Battery and fluency",
      "Neuropsychological tests named with what they measure",
      "Prefrontal findings in schizophrenia, depression and OCD",
    ],
    pitfalls: [
      "Describing one frontal syndrome only",
      "Using IQ to rule out frontal damage",
      "Not mentioning an informant history",
    ],
    visuals: [
      fig("prefrontal", "Subdivisions and functions: the parts of the prefrontal cortex", ["dlpfc", "vlpfc", "fp", "lofc", "acc", "sgacc", "vmpfc"]),
      compare(
        "The three frontal syndromes",
        ["Orbitofrontal", ["Disinhibited and tactless", "Impulsive, poor judgement", "Fatuous jokes", "Can look like mania"], "Too little brake"],
        ["Dorsolateral and medial", ["Poor planning and perseveration", "Concrete thinking", "Apathy, abulia, mutism", "Can look like depression"], "Too little drive and organisation"],
      ),
      fig("brodmann", "Bedside assessment: the Brodmann areas behind each frontal test", ["ba946", "ba10", "ba47", "ba44", "ba6"]),
    ],
    module: "brain/3-5",
    ref: "Kaplan Synopsis neuropsychiatry; Dubois 2000 FAB; Damasio 1994 Descartes' Error; Weinberger 1986; brain module 3.5",
  },
  {
    id: "bio-l02-010",
    subject: "biological",
    topic: "neuroanatomy",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry", "ma-semester", "mcp-entrance"],
    question: "Describe the structure and functions of the cerebellum. What is the cerebellar cognitive affective syndrome, and what is the cerebellum's relevance to psychiatry?",
    plan: [
      "Gross anatomy and functional divisions",
      "Cortex layers, input fibres and output",
      "Motor signs of cerebellar disease",
      "Cerebellar cognitive affective syndrome",
      "Psychiatric links",
    ],
    answer: `## Gross anatomy
The cerebellum sits behind the pons and medulla, under the occipital lobes, separated by the tentorium. It holds more than half of the brain's neurons in about a tenth of its volume. It has a midline vermis and two hemispheres, and is joined to the brainstem by three peduncles: inferior (input from the spinal cord and inferior olive), middle (input from the pontine nuclei, carrying cortical information) and superior (the main output, to the thalamus and red nucleus).

## Functional divisions
| Division | Parts | Connections | Function |
| Vestibulocerebellum | Flocculus and nodulus | Vestibular nuclei | Balance, eye movements |
| Spinocerebellum | Vermis and paravermis | Spinal cord; fastigial and interposed nuclei | Posture, gait, limb control |
| Cerebrocerebellum | Lateral hemispheres | Pons in, dentate nucleus to thalamus to cortex | Planning, timing, coordination, cognition |

## Microscopic structure
The cortex has three layers: molecular, Purkinje cell and granular. Mossy fibres from the pons and spinal cord excite granule cells, whose parallel fibres contact many Purkinje cells. Climbing fibres from the inferior olive wrap single Purkinje cells and signal errors. Purkinje cells are the only output of the cortex and are inhibitory (GABA); they act on the deep nuclei (dentate, interposed, fastigial). The circuit compares intended with actual movement and corrects it, and learns through long-term depression at parallel fibre synapses.

## Signs of cerebellar disease
Signs are on the same side as the lesion. Useful memory aid DANISH: dysdiadochokinesia, ataxia (broad-based gait), nystagmus, intention tremor and past-pointing, slurred scanning speech, hypotonia. Vermis lesions mainly cause truncal and gait ataxia; hemisphere lesions cause limb ataxia.

## Cerebellar cognitive affective syndrome
Jeremy Schmahmann and Janet Sherman described it in 1998 in patients with cerebellar lesions, especially of the posterior lobe and vermis:
- Executive problems: poor planning, set shifting, fluency and working memory.
- Visuospatial problems.
- Language problems: agrammatism, mild anomia, dysprosody.
- Personality and affect change: blunting or disinhibition, inappropriate behaviour, especially with vermis damage.
Schmahmann's dysmetria of thought idea holds that the cerebellum smooths thought and emotion just as it smooths movement.

## Psychiatric relevance
- Schizophrenia: Nancy Andreasen proposed cognitive dysmetria, a fault in a cortico-thalamo-cerebellar circuit that coordinates thought; neurological soft signs often include cerebellar signs.
- Autism: reduced Purkinje cell numbers are among the most consistent post mortem findings.
- Alcohol use disorder: degeneration of the anterior superior vermis gives a broad-based gait; Wernicke encephalopathy adds ataxia.
- Drug toxicity: lithium toxicity causes coarse tremor, ataxia and dysarthria; phenytoin and carbamazepine toxicity cause nystagmus and ataxia.
- Mood and ADHD: smaller vermis volumes are reported.`,
    keyPoints: [
      "Three peduncles with their main traffic",
      "Three functional divisions",
      "Purkinje cells as the only, inhibitory output",
      "Mossy and climbing fibres",
      "Ipsilateral signs with DANISH",
      "Cerebellar cognitive affective syndrome and its four domains",
      "Psychiatric and drug toxicity links",
    ],
    pitfalls: ["Saying cerebellar signs are contralateral", "Treating the cerebellum as purely motor", "Forgetting lithium toxicity"],
    visuals: [
      fig("cerebellum", "Gross anatomy: the cerebellum with vermis, hemispheres and dentate nucleus", ["vermis", "hemisphere", "dentate", "nodulus", "arbor"]),
      fig("pons-section", "Functional divisions: the cerebellar peduncles meet the pons", ["mcp", "scp", "transverse"]),
    ],
    module: "brain/3-2",
    ref: "Schmahmann and Sherman 1998 Brain; Andreasen 1998 cognitive dysmetria; Kaplan neuroanatomy; brain module 3.2",
  },
]);
