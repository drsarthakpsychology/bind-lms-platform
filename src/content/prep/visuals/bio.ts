import { R, bm, chain, concept, xp, type Concept } from "./kit";

/**
 * Biological psychology: real neurons, synapses, brain areas, the stress
 * chain, sleep and families. Pictures of the real thing first; a step list
 * only where the idea really is a sequence (how a molecule is made).
 */

const B = ["biological"] as const;
const BX = ["biological", "cognitive", "clinical-psychiatry", "psychopathology", "perception-attention", "learning-motivation-emotion", "psychometrics-assessment"] as const;
const BP = ["biological", "psychopharmacology", "clinical-psychiatry", "psychopathology"] as const;

export const BIO: Concept[] = [
  /* ------------------------------------------------ neurons and signals */
  concept("bio-resting", R(B, /resting (membrane )?potential|sodium.potassium pump|na\+?\/k\+?|goldman|nernst|equilibrium potential|leak channel/i), "neuron", { title: "A neuron at rest, then firing", myelinated: false, caption: "Watch the trace sit at about -70 mV before you push. Rest is negative because potassium leaks out through open channels while sodium is mostly kept out; the pump (3 sodium out, 2 potassium in) keeps those gradients in place." }),
  concept("bio-ap", R(BX, /\baction potential|depolari[sz]|repolari[sz]|hyperpolari[sz]|refractory|all.or.none|voltage.gated (sodium|na)|threshold of (excitation|firing)|overshoot|rate (code|of firing)/i, undefined, /myelin|saltatory|ranvier/i), "neuron", { title: "Make the neuron fire", myelinated: false, caption: "Move the push below and above threshold (about -55 mV). Below it nothing travels; above it the spike is always the same size: all or none. Sodium rushing in makes the rise, potassium leaving brings it back down and slightly below rest. Stronger stimuli give more spikes, not bigger ones." }),
  concept("bio-myelin", R(BX, /myelin|saltatory|nodes? of ranvier|conduction velocity|oligodendrocyte|schwann|multiple sclerosis|demyelinat|guillain/i), "neuron", { title: "Myelin on, myelin off", myelinated: true, caption: "Switch myelin off and on. With myelin the signal jumps from node to node (saltatory conduction), so it travels much faster with less energy. Oligodendrocytes make myelin in the brain and spinal cord, Schwann cells in the nerves of the body." }),
  concept("bio-psp", R(B, /\bepsp|\bipsp|postsynaptic potential|temporal summation|spatial summation|axon hillock|graded potential/i), "actionpotential", { title: "Small pushes add up", myelinated: true, caption: "Give one small push: it fades (a graded potential). Give two quick pushes: they add up in time (temporal summation) and reach threshold at the axon hillock. Then the spike is all or none." }),

  /* ------------------------------------------------ synapses */
  concept("bio-synapse-3d", R(BX, /exocytosis|vesicles?|snare|calcium (influx|entry|channels?)|botulinum|synaptic cleft|presynaptic terminal|neurotransmitter release|ionotropic|metabotropic|g.protein|second messenger/i), "synapse3d", { title: "A synapse, up close", transmitter: "the transmitter", caption: "Fire the nerve ending and watch calcium enter, vesicles fuse and the transmitter bind. Then add botulinum toxin: calcium still enters but nothing is released. Receptors that are channels (ionotropic) answer in milliseconds; those working through G proteins (metabotropic) answer more slowly but for longer." }),
  concept("bio-release", R(BX, /reuptake|transporter|\bmao\b|monoamine oxidase|vmat|amphetamine|cocaine/i, undefined, /cyp/i), "release", { transmitter: "dopamine", title: "Where drugs act at a monoamine synapse", caption: "Play the message once with no drug. Then try each drug: a reuptake blocker keeps the transmitter in the gap, an MAO inhibitor stops breakdown, amphetamine pushes transmitter out through the transporter." }),
  concept("bio-nmda", R(BX, /nmda|magnesium block|coincidence detect|long.term potentiation|\bltp\b|ampa receptor|glycine (site|co.agonist)|hebb/i), "synapse3d", { title: "A glutamate synapse that learns", transmitter: "glutamate", caption: "Fire the ending. At the NMDA receptor, glutamate binding is not enough: a magnesium ion plugs the channel until the receiving cell is already depolarised (through AMPA receptors). Then calcium floods in, more AMPA receptors are added, and the synapse stays stronger: long-term potentiation." }),
  concept("bio-aplysia", R(B, /aplysia|gill.withdrawal|sensiti[sz]ation|habituation/i), "synapse3d", { title: "Learning in one sea slug synapse", transmitter: "glutamate", caption: "Fire the sensory ending onto the motor neuron. In habituation the same harmless touch, repeated, makes the ending release less transmitter, so the gill withdraws less. In sensitisation a tail shock makes serotonin act on the ending, so it releases more and the reflex grows." }),
  concept("bio-catecholamines", R(BX, /tyrosine hydroxylase|l.dopa|levodopa|dopa decarboxylase|dopamine beta.hydroxylase|\bpnmt\b|catecholamine synthesis|rate.limiting|homovanillic|\bhva\b|\bcomt\b|mhpg/i), "flow", chain("Making dopamine, noradrenaline and adrenaline", [
    ["Tyrosine", "An amino acid from food (or made from phenylalanine)."],
    ["L-DOPA", "Tyrosine hydroxylase adds a hydroxyl group. This is the slow, rate-limiting step."],
    ["Dopamine", "DOPA decarboxylase removes a carboxyl group. Levodopa for Parkinson's disease enters the brain and is turned into dopamine here."],
    ["Noradrenaline", "Dopamine beta-hydroxylase does this inside the vesicles of noradrenaline neurons."],
    ["Adrenaline", "PNMT adds a methyl group, mainly in the adrenal medulla."],
  ], "Dopamine is broken down by MAO and COMT to homovanillic acid (HVA); noradrenaline mainly to MHPG.")),
  concept("bio-serotonin", R(BX, /tryptophan|5.htp|5.hiaa|raphe|serotonin (synthesis|is made)/i), "flow", chain("Serotonin: made, used and broken down", [
    ["Tryptophan", "An essential amino acid from food. Tryptophan depletion lowers brain serotonin within hours."],
    ["5-HTP", "Tryptophan hydroxylase: the rate-limiting step."],
    ["Serotonin (5-HT)", "Aromatic amino acid decarboxylase. Cell bodies sit in the raphe nuclei of the brainstem and send fibres to the whole brain."],
    ["Melatonin (in the pineal)", "At night the pineal gland turns serotonin into melatonin."],
    ["5-HIAA", "MAO-A breaks serotonin down to 5-HIAA. Low 5-HIAA in spinal fluid has been linked with impulsive, violent suicide attempts."],
  ])),
  concept("bio-ach", R(BX, /acetylcholine|choline acetyltransferase|acetylcholinesterase|nucleus basalis|cholinergic|nicotinic|muscarinic|neuromuscular junction|myasthenia/i, undefined, /donepezil|rivastigmine|galantamine/i), "synapse3d", { title: "An acetylcholine synapse", transmitter: "acetylcholine", caption: "Fire the ending, then add botulinum toxin: release stops and the muscle cannot contract. Acetylcholine is made from choline and acetyl coenzyme A and is split in the gap by acetylcholinesterase within milliseconds. At muscles it acts on nicotinic receptors (channels); in the brain and organs also on muscarinic receptors." }),
  concept("bio-gaba-glu", R(B, /\bgaba\b|glutamate|glutamic acid decarboxylase|main (excitatory|inhibitory)|excitotox|chloride channel/i, undefined, /nmda|ltp/i), "synapse3d", { title: "The brain's accelerator and brake", transmitter: "GABA", caption: "Fire the ending. Glutamate is the main excitatory transmitter and GABA (made from glutamate by glutamic acid decarboxylase) the main inhibitory one. GABA-A receptors are chloride channels: when they open, the receiving cell moves away from threshold. Benzodiazepines, barbiturates and alcohol boost them." }),
  concept("bio-cannabinoid", R(BP, /cannabinoid|\bcb1\b|\bthc\b|anandamide|endocannabinoid|retrograde/i), "synapse3d", { title: "A message sent backwards", transmitter: "GABA", caption: "Fire the ending. Endocannabinoids (anandamide, 2-AG) are made on demand by the receiving cell and travel backwards to CB1 receptors on the sending ending, turning its release down. THC is a partial agonist at CB1, so it turns release down all over the brain: memory, coordination, appetite and reward change." }),
  concept("bio-autoreceptor", R(BP, /autoreceptor|delayed onset|5.ht1a (auto|receptor desens)|desensiti[sz]|weeks to work|(2|two) to (4|6|four|six) weeks.{0,40}(effect|benefit|work)/i), "flow", chain("Why antidepressants take weeks to work", [
    ["Day 1: the pump is blocked", "An SSRI blocks the serotonin transporter within hours."],
    ["Extra serotonin hits the brake", "Around the raphe cell bodies, serotonin acts on 5-HT1A autoreceptors, which tell the neuron to fire less. So at first release in the cortex hardly rises."],
    ["Weeks 2 to 6: the brake wears out", "With constant stimulation the autoreceptors desensitise."],
    ["Firing and release rise", "The neuron fires normally again while reuptake is still blocked, so serotonin at the target rises."],
    ["Slow changes downstream", "Receptor changes, more BDNF and new connections build up, and mood lifts."],
  ])),

  /* ------------------------------------------------ the dopamine pathways */
  concept("bio-pathways", R(["biological", "psychopharmacology", "clinical-psychiatry", "psychopathology"], /mesolimbic|mesocortical|nigrostriatal|tuberoinfundibular|dopamine pathways?|dopamine hypothesis|prolactin|ventral tegmental|nucleus accumbens|reward (pathway|circuit|system)|aberrant salience/i), "pathways", { system: "dopamine", caption: "Switch on a D2 blocker and see each pathway: mesolimbic (fewer positive symptoms), mesocortical (negative symptoms can worsen), nigrostriatal (stiffness and tremor) and tuberoinfundibular (prolactin rises, because dopamine normally holds prolactin down). Then add serotonin 2A block." }),

  /* ------------------------------------------------ brain areas */
  concept("bio-bm-language", R(BX, /broca|wernicke|aphasi|arcuate fasciculus|angular gyrus|alexia|agraphia|anomia|boston naming/i), "brainmap", bm("Where language lives", {
    broca: "Broca's area (left inferior frontal lobe): producing speech. Damage gives slow, effortful, telegraphic speech with fairly good understanding.",
    wernicke: "Wernicke's area (left posterior superior temporal lobe): understanding speech. Damage gives fluent but empty speech with poor understanding.",
    temporal: "The arcuate fasciculus links the two areas under the cortex. Damage to it gives conduction aphasia: good understanding but poor repetition.",
    parietal: "The angular gyrus nearby links written and spoken words; damage gives alexia with agraphia (and Gerstmann's syndrome on the left).",
  }, "Tap each area. Production is in front, understanding behind; repetition needs the link between them.")),
  concept("bio-bm-memory", R(BX, /hippocamp|\bh\.?\s?m\.|molaison|mammillary|papez|fornix|entorhinal|medial temporal|anterograde amnesia|korsakoff/i), "brainmap", bm("The memory circuit", {
    hippocampus: "Hippocampus (medial temporal lobe): turns new experiences into lasting conscious memories. H.M. lost it on both sides and could form almost no new facts or events, though old memories, short-term memory and new skills survived.",
    thalamus: "The mammillary bodies and the medial dorsal thalamus are damaged in Korsakoff syndrome (thiamine deficiency): severe new-learning loss with confabulation.",
    amygdala: "Amygdala: adds emotional strength, so frightening events are remembered better.",
    prefrontal: "Prefrontal cortex: working memory, strategy and remembering where a memory came from.",
    "basal-ganglia": "Basal ganglia and cerebellum: skills and habits, which is why H.M. could still learn mirror drawing.",
  }, "Tap each part. The hippocampus forms new conscious memories; skills depend on other systems.")),
  concept("bio-bm-emotion", R(BX, /amygdala|kl[uü]ver|bucy|fear conditioning|ledoux|insula|anterior cingulate|urbach|\bs\.m\.|low road|threat detection/i), "brainmap", bm("The emotion circuit", {
    amygdala: "Amygdala: detects threat fast and learns fear. Damage (patient S.M., Kluver-Bucy in monkeys) removes fear of real dangers.",
    hypothalamus: "Hypothalamus: turns the alarm into a body response (heart, hormones through the HPA axis).",
    prefrontal: "Prefrontal cortex (ventromedial and orbital parts): calms the amygdala, extinguishes old fears and weighs feelings in decisions.",
    thalamus: "Thalamus: LeDoux's 'low road' sends a rough copy of what we see and hear straight to the amygdala, before the cortex ('high road') has finished.",
    hippocampus: "Hippocampus: supplies the context, so fear is tied to the right place.",
  })),
  concept("bio-bm-frontal", R(BX, /phineas gage|prefrontal|dorsolateral|orbitofrontal|ventromedial|frontal lobe|executive (function|dysfunction)|dysexecutive|perseverat|frontal.subcortical|wisconsin card|stroop|tower of london|trail making|verbal fluency|disinhibit/i), "brainmap", bm("The frontal lobes", {
    prefrontal: "Prefrontal cortex. Dorsolateral part: planning, working memory, switching set (Wisconsin card sorting, trail making B, verbal fluency). Orbital and ventromedial parts: social behaviour, impulse control and decisions with feeling (Phineas Gage).",
    frontal: "Medial frontal and anterior cingulate: drive and motivation. Damage gives apathy, and at worst akinetic mutism.",
    motor: "Primary motor cortex (precentral gyrus): voluntary movement of the opposite side of the body.",
    broca: "Broca's area (left inferior frontal): speech production.",
    "basal-ganglia": "Each frontal area runs a loop through the basal ganglia and thalamus, so damage deep in the brain can look like frontal damage.",
  }, "Tap each part. Dorsolateral damage looks disorganised; orbitofrontal damage looks disinhibited; medial damage looks apathetic.")),
  concept("bio-bm-movement", R(BX, /cerebell|basal ganglia|striatum|caudate|putamen|substantia nigra|parkinson|huntington|motor cortex|homunculus|chorea|ataxi|procedural (memory|learning)/i), "brainmap", bm("The movement system", {
    motor: "Primary motor cortex: sends commands down the spinal cord to the opposite side of the body. The homunculus maps body parts by how finely they move.",
    "basal-ganglia": "Basal ganglia (caudate, putamen, globus pallidus, with the substantia nigra): start wanted movements and stop unwanted ones. Losing nigral dopamine gives Parkinson's disease; losing caudate neurons gives Huntington's chorea.",
    cerebellum: "Cerebellum: timing, balance, smooth coordination and motor learning (including eyeblink conditioning). Damage gives ataxia, intention tremor and slurred speech on the same side.",
    sensory: "Somatosensory cortex (postcentral gyrus): touch and body position, mapped like the motor strip.",
  })),
  concept("bio-bm-vision", R(BX, /occipital|visual cortex|\bv1\b|striate|dorsal stream|ventral stream|prosopagnosia|fusiform|hemineglect|neglect|balint|blindsight|cortical blindness|visual agnosia|anton/i), "brainmap", bm("From the eyes to meaning", {
    occipital: "Occipital lobe (V1): first cortical stop for vision. Damage gives blindness in part of the visual field, sometimes with blindsight (or with denial of blindness in Anton's syndrome).",
    temporal: "Ventral 'what' stream into the temporal lobe: recognising objects and faces (fusiform face area). Damage gives visual agnosia or prosopagnosia.",
    parietal: "Dorsal 'where and how' stream into the parietal lobe: location and guiding action. Right parietal damage gives neglect of the left side; damage on both sides gives Balint's syndrome.",
    thalamus: "The lateral geniculate nucleus of the thalamus relays the optic tract to V1.",
  })),
  concept("bio-bm-hypothalamus", R(BX, /hypothalam|ventromedial nucleus|lateral hypothalamus|paraventricular|reticular (formation|activating)|arousal system|moruzzi|satiety (centre|center)|feeding centre/i), "brainmap", bm("Deep control centres", {
    hypothalamus: "Hypothalamus: hunger (lateral area starts eating, ventromedial area stops it), thirst, temperature, sex drive, the body clock (suprachiasmatic nucleus) and the pituitary hormones (paraventricular nucleus makes CRH).",
    thalamus: "Thalamus: relay for almost all senses (not smell) on their way to the cortex.",
    brainstem: "Brainstem reticular formation: keeps the cortex awake. Moruzzi and Magoun woke sleeping cats by stimulating it; damage gives coma.",
  })),
  concept("bio-bm-clock", R(["biological", "clinical-psychiatry", "psychopathology", "psychopharmacology"], /circadian|suprachiasmatic|\bscn\b|melanopsin|melatonin|\bdlmo\b|pineal|free.running|zeitgeber|jet lag|phase (delay|advance)|shift work/i), "brainmap", bm("Where the body clock sits", {
    hypothalamus: "Suprachiasmatic nucleus (SCN) of the hypothalamus: the master clock, just above where the optic nerves cross. Special retinal cells containing melanopsin send it blue morning light directly (retinohypothalamic tract). Left alone it runs on about 24.2 hours; light resets it each day.",
    brainstem: "From the SCN a sympathetic route reaches the pineal gland, which releases melatonin in darkness. Melatonin starts rising about 2 hours before habitual sleep (dim light melatonin onset) and bright light suppresses it.",
    thalamus: "The clock times sleepiness, body temperature and cortisol (highest soon after waking).",
  }, "Light in the morning moves the clock earlier; light late in the evening moves it later.")),
  concept("bio-bm-lateral", R(BX, /split.brain|corpus callosum|commissurotom|sperry|gazzaniga|interpreter|left hemisphere|right hemisphere|lateralis|wada|dichotic|aprosodia|handedness|hemispheric/i), "brainmap", bm("Two hemispheres and their bridge", {
    "corpus-callosum": "Corpus callosum: about 200 million fibres joining the two hemispheres. Cutting it for severe epilepsy stops the halves sharing what each one sees.",
    broca: "Speech and grammar sit in the left hemisphere in over 90% of right-handers, so a split-brain patient can name an object shown to the right visual field (left hemisphere) but not one shown to the left. The Wada test checks this before surgery.",
    parietal: "The right hemisphere leads for space, faces, attention to both sides and the emotional tone of speech; damage gives left neglect or flat, toneless speech (aprosodia).",
    frontal: "Gazzaniga's left-hemisphere 'interpreter' makes up reasons for actions started by the silent right hemisphere.",
  }, "Each hemisphere sees the opposite visual field and controls the opposite hand.")),
  concept("bio-brainexplorer", R(B, /lesion|damage to the|stroke|localis|lobe|limbic|gyrus|sulcus|brain region|structure (is|lies)|ventricle/i, /neuroanatomy|lateralisation|neuroimaging/), "brainexplorer", { title: "Where is the damage?", caption: "Take the brain apart, tap a part to see what it does, then switch on damage to see a real case. Try the 'Where is the damage?' round." }),
  concept("bio-ns-map", R(["biological", "health", "learning-motivation-emotion"], /central nervous|peripheral nervous|somatic nervous|autonomic nervous|cranial nerve|spinal cord|reflex arc|spinal reflex|neural tube|neural crest|afferent|efferent/i), "nervoussystem", { title: "The nervous system, divided", start: "map", caption: "Zoom from the whole system to the brain and spinal cord (central), the nerves (peripheral), the somatic branch for skin and muscle, and the autonomic branch for the organs. Then tap the knee to watch a reflex skip the brain." }),
  concept("bio-ns-auto", R(["biological", "learning-motivation-emotion", "health", "clinical-psychiatry", "psychopharmacology"], /sympathetic|parasympathetic|fight.or.flight|rest and digest|vagus|vagal|adrenal medulla|polygraph|galvanic skin|skin conductance|heart rate variability|relaxation response|anticholinergic (toxicity|syndrome|toxidrome|side effects?)|antimuscarinic|physostigmine|toxidrome|toxic syndrome/i), "nervoussystem", { title: "Organs on autopilot", start: "auto", caption: "Switch between fight or flight and rest and digest and watch the heart, pupils, airways, gut and bladder. Sympathetic: faster heart, wide pupils, gut slows, adrenaline from the adrenal medulla. Parasympathetic (mostly the vagus): the reverse. Anticholinergic drugs block the rest and digest side, so the body looks like fight or flight but without sweating." }),

  /* ------------------------------------------------ imaging */
  concept("bio-imaging", R(BX, /\bfmri\b|\bpet\b|\bspect\b|\beeg\b|\bmeg\b|\bdti\b|\bbold\b|temporal resolution|spatial resolution|neuroimaging|tractography|raclopride|event.related potential|\berps?\b|p300|mismatch negativity|\bmri\b|\bct scan|computed tomography|\baxial\b|\bcoronal\b|\bsagittal\b/i, undefined, /bonferroni|multiple comparison|dead salmon|false discovery/i), "brainslicer", { title: "Slice the brain three ways", start: "slice", caption: "Scroll the axial, coronal and sagittal slices and find the ventricles, hippocampus and basal ganglia. CT and MRI show structure like this. fMRI (blood oxygen) shows where activity happens to within millimetres but only over seconds; EEG and MEG show when to the millisecond but blur where; PET can count receptors." }),

  /* ------------------------------------------------ hormones and stress */
  concept("bio-hpa", R(["biological", "clinical-psychiatry", "psychopathology", "learning-motivation-emotion", "health"], /\bhpa\b|hypothalamic.pituitary.adrenal|cortisol|\bcrh\b|\bcrf\b|\bacth\b|glucocorticoid|dexamethasone|adrenal cortex|cushing|addison/i, undefined, /chronic|allostatic|caregiv|immun/i), "stress", { title: "The stress chain, from brain to adrenal", caption: "Play it. The amygdala signals danger; the hypothalamus releases CRH; the pituitary releases ACTH; the adrenal cortex releases cortisol, which peaks about 20 to 30 minutes later. Cortisol then acts on the hippocampus, hypothalamus and pituitary to switch the chain off. In melancholic depression this brake is weak, so dexamethasone fails to suppress cortisol." }),
  concept("bio-chronic-stress", R(["biological", "health", "psychopathology", "clinical-psychiatry", "positive"], /chronic stress|allostatic|psychoneuroimmun|immun|cytokine|interleukin|inflammat|natural killer|wound|common cold|vaccin|caregiv.{0,40}(stress|dementia)|telomere|meaney|licking and grooming|epigenetic|methylation/i), "hpaloop", { title: "When stress does not switch off", start: "chronic", caption: "Replay five hard days. With repeated stress cortisol stays high, its feedback brake weakens, and immune defences change: slower wound healing in caregivers, more colds after virus drops in stressed volunteers, weaker vaccine responses and low-grade inflammation. Early care shapes this brake: rat pups licked and groomed more grow up with more hippocampal cortisol receptors and calmer stress responses." }),
  concept("bio-sexdiff", R(B, /\bsry\b|5.alpha.reductase|androgen insensitivity|congenital adrenal|m[uü]llerian|wolffian|sexual differentiation|dihydrotestosterone/i), "flow", chain("How the body becomes male or female", [
    ["Chromosomes", "XY or XX. The SRY gene on the Y chromosome is the switch."],
    ["Gonads", "SRY makes the early gonad a testis. Without it the gonad becomes an ovary."],
    ["Testis hormones", "Testosterone keeps the Wolffian ducts (male internal organs); anti-Mullerian hormone removes the Mullerian ducts (which would become uterus and tubes)."],
    ["DHT shapes the outside", "5-alpha-reductase turns testosterone into dihydrotestosterone, which builds male external genitals. If this enzyme is missing, an XY child can look female at birth and virilise at puberty."],
    ["Receptors must respond", "In complete androgen insensitivity the receptor does not work, so an XY person develops a female body with testes inside."],
  ])),

  /* ------------------------------------------------ sleep */
  concept("bio-hypnogram", R(["biological", "clinical-psychiatry", "psychopathology", "psychopharmacology", "cognitive"], /\brem\b|nrem|\bn3\b|slow.wave sleep|sleep spindle|k.complex|sleep stage|hypnogram|rem latency|sleep architecture|polysomnograph|delta (sleep|waves?)|sawtooth|alpha (waves?|rhythm|activity)|beta (waves?|activity)|theta (waves?|activity|rhythm)|reciprocal interaction|rem.on|rem.off|activation.synthesis|atonia|jouvet|orexin|hypocretin|narcolep|cataplexy|sleep (paralysis|deprivation)|night terror|sleepwalk|parasomnia|mslt|sleep latency/i), "hypnogram", { caption: "Drag through the night and watch the brain waves change: alpha when drowsy, theta in N1, spindles and K complexes in N2, slow delta waves in N3, and fast sawtooth waves in REM with the body paralysed. Deep N3 sleep comes early in the night, REM grows longer toward morning. Then switch on depression: REM comes early (short REM latency) and deep sleep shrinks." }),

  /* ------------------------------------------------ genes and families */
  concept("bio-gottesman", R(["biological", "clinical-psychiatry", "psychopathology"], /gottesman|lifetime risk|concordance|first.degree relatives?|monozygotic|dizygotic|\bmz\b|\bdz\b|twin stud|adoption stud|kety|heritability of schizophrenia/i, /schizo|psychosis|genetic|behaviour-genetics|integrative/), "experiment", xp("Schizophrenia runs in families, by how close the genes are", "How likely is a person to develop schizophrenia in their lifetime if a relative has it? Guess each one.", "%", [
    ["General population", 1],
    ["First cousin", 2],
    ["Sibling", 9],
    ["Child of one parent with it", 13],
    ["Fraternal (DZ) twin", 17],
    ["Child of two parents with it", 46],
    ["Identical (MZ) twin", 48],
  ], "Risk climbs with shared genes, but even an identical twin has only about a 1 in 2 chance: genes load the risk, environment decides much of the rest. These are Gottesman's pooled European figures.", 60)),
  concept("bio-genogram", R(["biological", "developmental", "personality-theories", "psychopathology", "clinical-psychiatry"], /segregating genes|proportion of genes|genetic relatedness|half.siblings?|autosomal dominant|autosomal recessive|x.linked|huntington'?s? (gene|disease|risk)|cag repeat|cgg repeat|fmr1|fragile x|trinucleotide|anticipation|family (history|stud)|pedigree|familial|falconer|heritability|shared environment|non.shared environment|gene.environment|niche.picking|evocative|caspi|maoa|twin (correlation|method)/i), "genogram", { title: "Read the family", condition: "the condition", caption: "Explore the example family, then press Find the pattern. First-degree relatives (parents, siblings, children) share about half their segregating genes, second-degree (grandparents, aunts, uncles, half-siblings) a quarter, first cousins an eighth. A dominant condition such as Huntington's disease appears in every generation, with a 50% risk to each child; families share environments as well as genes, which is why twin and adoption studies are needed." }),

  /* ------------------------------------------------ development of the brain */
  concept("bio-bm-plastic", R(BX, /pruning|synaptic density|huttenlocher|synaptogenesis|bdnf|neurotrophin|nerve growth factor|neurogenesis|dentate gyrus|neuroplasticity|enriched environment/i), "brainmap", bm("Where the brain keeps rebuilding itself", {
    hippocampus: "Hippocampus (dentate gyrus): one of the few places where new neurons are born in adults. Chronic stress and high cortisol reduce BDNF and new neurons here; antidepressants, ECT, exercise and enriched environments increase them.",
    prefrontal: "Prefrontal cortex: synapses peak in early childhood, then little-used ones are pruned through adolescence while myelination continues into the mid-twenties.",
    occipital: "Visual cortex: synapse numbers peak within the first year and are pruned earlier; it has a critical period for binocular vision.",
  })),

  /* ------------------------------------------------ dose and safety */
  concept("bio-ti", R(["biological", "psychopharmacology"], /therapeutic (index|window|ratio)|\bld50\b|\bed50\b|\btd50\b|median (lethal|effective|toxic)|margin of safety/i), "curve", { kind: "dose-response", title: "The gap between helping and harming", caption: "The therapeutic index compares two dose-response curves: the dose that harms half the subjects (TD50 or LD50) divided by the dose that helps half (ED50). With LD50 200 mg/kg and ED50 10 mg/kg it is 20. Lithium has a narrow gap, so its blood level is checked." }),
];
