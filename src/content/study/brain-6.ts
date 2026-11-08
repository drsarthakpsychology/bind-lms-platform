/* Module · Brain and behaviour, new Beginner sections on neuroanatomy: spinal cord, brainstem, cranial nerves, cerebellum, basal ganglia, thalamus, hypothalamus, limbic system, cortex, blood supply and CSF. Original text written for VIBHA School of Psychology. */

export const begAnatomyLow = String.raw`
## 3.1 Spinal cord, autonomic system, brainstem and cranial nerves [core][beginner]
Exams in India love this part of anatomy because it has crisp, testable facts: which tract crosses where, which cranial nerve does what, which nucleus makes which transmitter. It is also clinically real: a psychiatrist who misses a brainstem sign can miss a stroke, a tumour or Wernicke's encephalopathy.

### The spinal cord in cross-section

:::widget figure
{"id": "spinal-cord"}
:::

- **Grey matter** (an H or butterfly shape) holds cell bodies: the **dorsal horn** receives sensation, the **ventral horn** holds motor neurons, and the **lateral horn** (from the first thoracic to the second lumbar segment) holds sympathetic neurons.
- **White matter** around it holds the long tracts.
- The **Bell-Magendie law** (Charles Bell and François Magendie, early 1800s): **dorsal roots are sensory, ventral roots are motor**.

### Three long tracts that exams ask

:::widget figure
{"id": "spinal-cord", "quiz": true}
:::

| Tract | Carries | Where it crosses | Lesion of one half of the cord |
|---|---|---|---|
| **Dorsal columns (medial lemniscus)** | Fine touch, vibration, position sense | In the **medulla** | Loss on the **same** side below the lesion |
| **Spinothalamic** | Pain and temperature | In the **cord**, within one or two segments of entry | Loss on the **opposite** side below the lesion |
| **Lateral corticospinal** | Voluntary movement | At the **pyramidal decussation** in the lower medulla (about 85 to 90 per cent of fibres) | Weakness on the **same** side below the lesion |

Half-cutting the cord (for example a stab wound) therefore gives the **Brown-Séquard syndrome**: weakness and loss of vibration and position on the same side, loss of pain and temperature on the other side.

:::widget worked
{
 "title": "Reasoning with crossing points",
 "steps": [
  { "q": "A man is stabbed on the right side of the back at the level of the tenth thoracic segment. Which leg will be weak?", "a": "The right. The corticospinal tract has already crossed in the medulla, so below that it runs on the same side as the limb it controls." },
  { "q": "Which leg loses vibration and position sense?", "a": "The right. The dorsal columns stay on the same side until they cross in the medulla." },
  { "q": "Which leg loses pain and temperature?", "a": "The left. Spinothalamic fibres cross within a segment or two of entering the cord, so the right half of the cord carries the left side's pain." }
 ],
 "yourTurn": [
  { "q": "A woman with long-standing vitamin B12 deficiency has unsteady walking in the dark, lost vibration sense in both feet, stiff legs, and is also depressed and forgetful. Which parts of the cord are damaged, and why should a psychiatrist care?", "a": "Subacute combined degeneration: the dorsal columns (vibration and position) and the lateral corticospinal tracts (stiffness, brisk reflexes) on both sides. B12 deficiency also causes depression, psychosis and dementia, and is common in strict vegetarians in India, so check B12 in these presentations." }
 ]
}
:::

### Upper and lower motor neuron signs
| | Upper motor neuron (brain or cord tracts) | Lower motor neuron (ventral horn or nerve) |
|---|---|---|
| Tone | Increased (spastic) | Reduced (flaccid) |
| Reflexes | Brisk; upgoing plantar (Babinski sign) | Reduced or absent |
| Wasting | Little | Marked |
| Twitching (fasciculation) | No | Yes |
| Example | Stroke, MS | Polio, peripheral nerve injury, motor neuron disease (both kinds) |

### The autonomic nervous system in detail

:::widget figure
{"id": "autonomic"}
:::

| | Sympathetic | Parasympathetic |
|---|---|---|
| Outflow | **Thoracolumbar** (T1 to L2) | **Craniosacral** (cranial nerves III, VII, IX, X and sacral S2 to S4) |
| Ganglia | Near the spine (a chain) | Near or inside the organ |
| Fibre length | Short before the ganglion, long after | Long before, short after |
| Transmitter before the ganglion | Acetylcholine (nicotinic) | Acetylcholine (nicotinic) |
| Transmitter at the organ | **Noradrenaline** (except sweat glands: acetylcholine) | **Acetylcholine** (muscarinic) |
| Special case | The **adrenal medulla** is a modified ganglion that releases adrenaline into the blood | |

The gut also has its own **enteric nervous system**, a few hundred million neurons in its wall, sometimes called the "second brain". The **hypothalamus** sits at the top of the whole autonomic system.

:::widget sort
{
 "prompt": "Sympathetic or parasympathetic?",
 "buckets": ["Sympathetic", "Parasympathetic"],
 "items": [
  { "text": "Pupils narrow", "bucket": 1 },
  { "text": "Sweating in fear", "bucket": 0, "why": "Sympathetic, but the transmitter at sweat glands is acetylcholine: a favourite exam trap." },
  { "text": "Erection", "bucket": 1, "why": "'Point and shoot': parasympathetic for erection, sympathetic for ejaculation." },
  { "text": "Ejaculation", "bucket": 0 },
  { "text": "Airways widen", "bucket": 0 },
  { "text": "Saliva flows freely", "bucket": 1 },
  { "text": "Outflow from the thoracic and lumbar cord", "bucket": 0 },
  { "text": "Carried by the vagus nerve", "bucket": 1 }
 ]
}
:::

### The brainstem, level by level

:::widget figure
{"id": "midbrain-section"}
:::

:::widget figure
{"id": "pons-section"}
:::

:::widget figure
{"id": "medulla-section"}
:::

| Level | Key structures | Why they matter |
|---|---|---|
| **Midbrain** | Superior colliculi (visual reflexes), inferior colliculi (hearing), **substantia nigra** and **ventral tegmental area** (dopamine), **periaqueductal grey** (pain control, defensive behaviour), red nucleus, nuclei of cranial nerves III and IV | Parkinson's disease, reward, opioid pain relief |
| **Pons** | **Locus coeruleus** (noradrenaline), raphe nuclei (serotonin), nuclei of V to VIII, pontine nuclei relaying to the cerebellum, REM sleep generators | Stress, arousal, REM sleep |
| **Medulla** | Breathing and heart centres, **nucleus of the solitary tract** (taste and gut signals), **area postrema** (vomiting trigger zone, outside the blood-brain barrier), nuclei of IX to XII, pyramids, inferior olive | Overdose deaths, vomiting with medicines |

Running through all three is the **reticular formation**. In 1949 Giuseppe Moruzzi and Horace Magoun showed that stimulating it in sleeping cats produced an awake EEG: the **ascending reticular activating system**, which keeps the cortex awake. Damage to it causes coma.

:::widget brainmap
{
 "title": "The brainstem and its neighbours",
 "focus": ["brainstem", "cerebellum", "thalamus", "hypothalamus"],
 "notes": {
  "brainstem": "Midbrain, pons and medulla: cranial nerve nuclei, the reticular activating system, and the source nuclei of dopamine, noradrenaline and serotonin. Vital centres for breathing in the medulla.",
  "cerebellum": "Attached to the back of the pons by three pairs of stalks (peduncles).",
  "thalamus": "Receives the reticular activating system's wake-up signals and passes them to the cortex.",
  "hypothalamus": "Sends autonomic commands down to the brainstem and spinal cord."
 },
 "caption": "Why does an opioid overdose stop breathing? (Mu receptors in the medullary breathing centres.)"
}
:::

### Cranial nerves for exams

:::widget figure
{"id": "brain-inferior", "quiz": true}
:::

| Nerve | Type | Brainstem level | Exam favourite |
|---|---|---|---|
| I Olfactory | Sensory | Forebrain (not brainstem) | Lost early in Parkinson's and Alzheimer's; absent with low sex hormones in Kallmann syndrome |
| II Optic | Sensory | Forebrain | Fibres from the inner half of each retina cross at the optic chiasm; a pituitary tumour gives loss of both outer visual fields |
| III Oculomotor | Motor, plus parasympathetic | Midbrain | Down-and-out eye, droopy lid, wide pupil; the Edinger-Westphal nucleus narrows the pupil |
| IV Trochlear | Motor | Midbrain | The only nerve leaving the **back** of the brainstem; supplies one muscle; head tilt |
| V Trigeminal | Both | Pons | Afferent limb of the corneal reflex; trigeminal neuralgia treated with carbamazepine |
| VI Abducens | Motor | Pons | Long course: palsy can be a false localising sign of raised pressure in the skull; affected in Wernicke's encephalopathy |
| VII Facial | Both, plus parasympathetic | Pons | Bell's palsy (whole half of face) versus stroke (forehead spared) |
| VIII Vestibulocochlear | Sensory | Pons and medulla | Vertigo and hearing loss |
| IX Glossopharyngeal | Both, plus parasympathetic | Medulla | Afferent limb of the gag reflex |
| X Vagus | Both, plus parasympathetic | Medulla | Efferent limb of the gag reflex; vagus nerve stimulation; slows the heart |
| XI Accessory | Motor | Medulla and upper cord | Shoulder shrug |
| XII Hypoglossal | Motor | Medulla | Tongue points towards the weak side |

:::mnemonic Type: "Some Say Marry Money, But My Brother Says Big Brains Matter More"
**S**ensory, **S**ensory, **M**otor, **M**otor, **B**oth, **M**otor, **B**oth, **S**ensory, **B**oth, **B**oth, **M**otor, **M**otor. And the nerves carrying parasympathetic fibres are **III, VII, IX and X** ("1973").
:::

:::widget decide
{
 "scene": "Mr Bose, 58, a retired clerk in Howrah who drinks heavily, is admitted for 'confusion and odd behaviour'. On examination he cannot move either eye outwards and has jerky eye movements, and he walks with a wide, unsteady gait.",
 "ask": "Which finding matters most and what should be done?",
 "choices": [
  { "label": "The eye signs (bilateral sixth nerve weakness and nystagmus) plus ataxia and confusion point to Wernicke's encephalopathy; give high-dose parenteral thiamine now", "verdict": "best", "outcome": "His eye movements improve within a day; his memory is tested once he is stable.", "why": "Thiamine deficiency damages brainstem and mammillary structures. The eye signs often recover fast with thiamine; delay risks Korsakoff syndrome." },
  { "label": "The confusion suggests delirium tremens; give a benzodiazepine and wait", "verdict": "ok", "outcome": "Withdrawal is treated but the eye signs worsen.", "why": "Withdrawal may also be present, but missing the eye signs leaves Wernicke's untreated. Both can be treated together." },
  { "label": "Refer to an eye doctor next week", "verdict": "harm", "outcome": "He develops lasting memory loss.", "why": "Cranial nerve signs in a confused drinker are an emergency." }
 ]
}
:::

### Three states that look alike

:::widget figure
{"id": "ras"}
:::

| State | Conscious? | Can move? | Lesion |
|---|---|---|---|
| **Locked-in syndrome** | Yes, fully | Only vertical eye movements and blinking | Front (ventral) pons, usually a basilar artery stroke |
| **Akinetic mutism** | Awake but little drive | Can, but does not, move or speak | Medial frontal lobes or deep midline structures |
| **Vegetative state (unresponsive wakefulness)** | Awake without awareness | Reflexes only | Widespread cortical or thalamic damage |

:::clinician
Brown-Séquard syndrome classically adds a band of ipsilateral sensory loss at the lesion level. Lower motor neuron facial weakness involves the forehead; upper motor neuron (supranuclear) weakness spares it because the forehead has bilateral cortical supply. The Argyll Robertson pupil (small, irregular, reacts to accommodation but not light) is classic for neurosyphilis, still worth remembering in late-onset psychosis or dementia work-ups where VDRL and TPHA are routine. Horner's syndrome (ptosis, miosis, anhidrosis) reflects interruption of the three-neuron sympathetic pathway. The area postrema expresses D2, 5-HT3 and NK1 receptors, explaining the antiemetic action of D2 blockers (domperidone, metoclopramide, prochlorperazine), ondansetron and aprepitant, and why apomorphine and opioids cause vomiting. Periaqueductal grey columns organise active (fight or flight) versus passive (freezing, quiescence) defensive responses and descending pain control via the rostral ventromedial medulla. Locked-in patients can communicate with vertical eye movements; misdiagnosis as vegetative or catatonic is a documented error.
:::

:::recall
1. State the Bell-Magendie law. || Dorsal roots are sensory and ventral roots are motor.
2. Where do the dorsal columns, spinothalamic tract and corticospinal tract cross? || Dorsal columns in the medulla; spinothalamic in the cord near entry; corticospinal at the pyramidal decussation in the lower medulla.
3. Describe the Brown-Séquard syndrome. || Ipsilateral weakness and loss of vibration and position; contralateral loss of pain and temperature below the lesion.
4. What is the transmitter at sympathetic sweat glands? || Acetylcholine (muscarinic).
5. Which cranial nerves carry parasympathetic fibres? || III, VII, IX and X.
6. Which cranial nerve leaves the back of the brainstem? || IV, the trochlear.
7. What did Moruzzi and Magoun show? || Stimulating the brainstem reticular formation awakens the EEG: the ascending reticular activating system.
8. What is locked-in syndrome and where is the lesion? || Full awareness with paralysis except vertical eye movements and blinking; ventral pons.
:::

:::mcq
Q: Which cranial nerve is sensory only?
- III Oculomotor
- V Trigeminal
- *VIII Vestibulocochlear
- X Vagus
> I, II and VIII are purely sensory.

Q: The vomiting trigger zone that lies outside the blood-brain barrier is the:
- Locus coeruleus
- *Area postrema
- Substantia nigra
- Red nucleus
> A circumventricular organ in the medulla.

Q: Read the assertion and reason. Assertion (A): A stroke affecting the right internal capsule causes weakness of the left arm and leg. Reason (R): Most corticospinal fibres cross at the pyramidal decussation in the medulla.
- *Both A and R are true, and R is the correct explanation of A
- Both A and R are true, but R is not the correct explanation of A
- A is true, but R is false
- A is false, but R is true
> The tract crosses below the internal capsule, so a right-sided lesion weakens the left side.

Q: Postganglionic sympathetic fibres to the heart release:
- Acetylcholine
- *Noradrenaline
- Dopamine
- Serotonin
> Noradrenaline, acting on beta-1 receptors.

Q: A woman after a basilar artery stroke is fully aware but can only blink and move her eyes up and down. This is:
- Vegetative state
- Akinetic mutism
- *Locked-in syndrome
- Catatonic stupor
> Ventral pontine lesion.
:::

## 3.2 Cerebellum and basal ganglia: two loops that shape movement and thought [core][beginner]
Neither the cerebellum nor the basal ganglia sends commands straight to the muscles. Both are **advisers** to the cortex, working through the thalamus. The cerebellum asks "is the movement accurate and well timed?"; the basal ganglia ask "which movement, if any, should go ahead?". Both also advise on thinking and emotion, which is why they appear in psychiatry.

### The cerebellum

:::widget figure
{"id": "cerebellum"}
:::

- It is about a tenth of the brain's volume but holds **most of its neurons**: tiny **granule cells** make up the majority of all neurons in the brain.
- Its cortex has **three layers**: molecular (outer), **Purkinje cell** layer, granular (inner).
- **Purkinje cells** are the **only output** of the cerebellar cortex, and they are **inhibitory** (GABA). They inhibit the **deep cerebellar nuclei** (dentate, interposed and fastigial), which send the final output to the thalamus and brainstem.
- **Inputs**: **climbing fibres** from the inferior olive (one powerful fibre wraps each Purkinje cell; thought to signal errors) and **mossy fibres** from the pons, spinal cord and vestibular system (via granule cells).
- **Three functional zones**: the **flocculonodular lobe** (balance and eye movements), the **vermis** and nearby strip (posture and walking), and the **lateral hemispheres** (planning, timing and cognition).
- A cerebellar hemisphere controls the **same side** of the body.

:::mnemonic Cerebellar signs: "DANISH"
**D**ysdiadochokinesia (clumsy rapid alternating movements), **A**taxia (unsteady gait and limbs), **N**ystagmus, **I**ntention tremor (worse near the target), **S**lurred, scanning speech, **H**ypotonia. All on the side of the lesion.
:::

:::widget compare
{
 "title": "Midline versus lateral cerebellar damage",
 "a": {
  "label": "Vermis (midline)",
  "points": ["Broad-based, staggering walk", "Trunk sways when sitting or standing", "Arms often fairly normal", "Typical of chronic alcohol use (front upper vermis)"],
  "summary": "Gait and trunk."
 },
 "b": {
  "label": "Hemisphere (lateral)",
  "points": ["Clumsy arm and leg on the same side", "Intention tremor on finger-nose test", "Dysdiadochokinesia, overshoot (dysmetria)", "Typical of a stroke or tumour in one hemisphere"],
  "summary": "Limbs on one side."
 },
 "caption": "A person who drinks heavily for years often walks like a sailor on deck but can do the finger-nose test reasonably well."
}
:::

### The cerebellum beyond movement
- **Classical conditioning of the eyeblink**: Richard Thompson showed in rabbits that a small part of the cerebellum's deep nuclei (the interpositus nucleus) is essential for learning a conditioned blink.
- **Cerebellar cognitive affective syndrome**: after damage to the back of the cerebellum, adults show poor planning, visuospatial problems, odd speech and blunted or disinhibited emotion.
- The cerebellum is studied in autism (fewer Purkinje cells in post-mortem studies) and in schizophrenia ("cognitive dysmetria": poorly timed, poorly coordinated thought).

### The basal ganglia: what is in them

:::widget figure
{"id": "basal-ganglia"}
:::

:::widget figure
{"id": "coronal-section", "focus": ["caudate", "putamen", "pallidus"]}
:::

- **Striatum**: the **caudate nucleus** and **putamen** (together with the ventral striatum, including the **nucleus accumbens**).
- **Globus pallidus**: an external part (GPe) and an internal part (GPi). Putamen plus globus pallidus is called the **lentiform nucleus**.
- **Subthalamic nucleus (STN)**.
- **Substantia nigra**: the **pars compacta** (dopamine neurons) and the **pars reticulata** (an output nucleus like the GPi).
- The **thalamus** is not part of the basal ganglia, though it carries their output.

### Direct and indirect pathways
The output nuclei (GPi and substantia nigra pars reticulata) constantly **inhibit** the thalamus, holding movement back like a hand on the brake. The striatum decides when to lift or press the brake.

:::widget figure
{"id": "basal-ganglia-circuit"}
:::

:::widget flow
{
 "title": "The direct pathway: lifting the brake",
 "layout": "chain",
 "nodes": [
  { "id": "c", "label": "Cortex", "detail": "Excites the striatum with glutamate." },
  { "id": "s", "label": "Striatum (D1 neurons)", "detail": "GABA neurons that also carry substance P and dynorphin. Dopamine at D1 receptors excites them." },
  { "id": "g", "label": "GPi and nigra pars reticulata inhibited", "detail": "The output nuclei are switched off." },
  { "id": "t", "label": "Thalamus released", "detail": "No longer held back, it excites the cortex." },
  { "id": "m", "label": "Movement goes ahead", "detail": "The chosen action is released." }
 ],
 "caption": "Two inhibitions in a row make a release: the striatum inhibits the inhibitor."
}
:::

:::widget flow
{
 "title": "The indirect pathway: pressing the brake",
 "layout": "chain",
 "nodes": [
  { "id": "c", "label": "Cortex", "detail": "Excites the striatum." },
  { "id": "s", "label": "Striatum (D2 neurons)", "detail": "GABA neurons that also carry enkephalin. Dopamine at D2 receptors inhibits them." },
  { "id": "e", "label": "GPe inhibited", "detail": "The external pallidum normally restrains the subthalamic nucleus." },
  { "id": "n", "label": "Subthalamic nucleus released", "detail": "It excites the output nuclei with glutamate." },
  { "id": "g", "label": "GPi and nigra pars reticulata excited", "detail": "They inhibit the thalamus more strongly." },
  { "id": "m", "label": "Movement suppressed", "detail": "Competing or unwanted actions are held back." }
 ],
 "caption": "Dopamine excites the direct pathway (D1) and inhibits the indirect pathway (D2). Both effects favour movement, which is why losing dopamine causes slowness."
}
:::

### Disorders that test the pathways
| Disorder | What fails | Result |
|---|---|---|
| **Parkinson's disease** | Loss of dopamine neurons in the pars compacta (symptoms when about 60 to 80 per cent are lost) | Less direct, more indirect activity: slowness, rigidity, resting tremor; depression, anxiety, later dementia and psychosis are common |
| **Huntington's disease** | Early loss of indirect-pathway striatal neurons, especially in the **caudate** | Brake too weak: **chorea**; also depression, irritability, psychosis, suicide risk and dementia |
| **Hemiballismus** | Small stroke in the **subthalamic nucleus** | Violent flinging movements of the **opposite** arm and leg |
| **Drug-induced parkinsonism** | D2 blockade by antipsychotics, as in Parkinson's | Stiffness and slowness |
| **Wilson's disease** | Copper builds up in the lentiform nucleus and liver | Tremor, dystonia, and psychiatric change in a young person; Kayser-Fleischer rings in the eye |

:::widget sort
{
 "prompt": "Which structure is most likely involved?",
 "buckets": ["Cerebellum", "Substantia nigra", "Caudate nucleus", "Subthalamic nucleus"],
 "items": [
  { "text": "A 70-year-old with diabetes suddenly develops wild flinging of the left arm", "bucket": 3 },
  { "text": "A 40-year-old with jerky dance-like movements, irritability and a father who died in his fifties with the same illness", "bucket": 2, "why": "Huntington's disease: CAG repeat expansion, caudate atrophy on MRI." },
  { "text": "A 65-year-old with a slow shuffling walk, resting tremor and loss of smell", "bucket": 1 },
  { "text": "A man with tremor that worsens as his finger nears the target", "bucket": 0 },
  { "text": "A rabbit cannot learn a conditioned eyeblink after a small lesion", "bucket": 0 },
  { "text": "Deep brain stimulation target to relieve Parkinson's rigidity and slowness", "bucket": 3, "why": "Quieting the overactive subthalamic nucleus (or the GPi) reduces excess braking." }
 ]
}
:::

### Parallel loops: movement, thought and feeling
Garrett Alexander and colleagues described five parallel **cortex-basal ganglia-thalamus loops**: motor, oculomotor, **dorsolateral prefrontal** (planning), **orbitofrontal** (social behaviour, switching), and **anterior cingulate** or limbic (motivation, through the nucleus accumbens). This is why basal ganglia diseases cause psychiatric symptoms, and why OCD, Tourette syndrome and addiction are described as loop disorders.

:::clinician
Huntington's disease is autosomal dominant with full penetrance at 40 or more CAG repeats in the HTT gene on chromosome 4 (36 to 39 reduced penetrance); larger expansions on paternal transmission cause anticipation and the juvenile (Westphal) rigid form. Psychiatric features (depression, apathy, irritability, OCD-like symptoms, psychosis) can precede chorea by years; suicide rates are several times the general population, peaking around the time of diagnosis and loss of independence. Tetrabenazine and deutetrabenazine treat chorea but can worsen depression. Parkinson's disease: Braak staging proposes alpha-synuclein pathology starting in the olfactory bulb and dorsal vagal nucleus before the nigra, matching prodromal anosmia, constipation, REM sleep behaviour disorder and depression. Dopamine agonists cause impulse control disorders (gambling, hypersexuality, binge eating, shopping) in a significant minority, a D3-rich ventral striatal effect; ask routinely. Psychosis in Parkinson's: pimavanserin where licensed, or low-dose quetiapine or clozapine; avoid typical antipsychotics. The cerebellum receives input from and projects to prefrontal cortex via cortico-ponto-cerebellar and dentato-thalamo-cortical pathways; posterior vermis lesions produce the affective features of Schmahmann's syndrome.
:::

:::recall
1. What is the only output of the cerebellar cortex and what transmitter does it use? || Purkinje cells, using GABA (inhibitory).
2. Name the two main inputs to the cerebellum. || Climbing fibres from the inferior olive; mossy fibres from the pons, spinal cord and vestibular nuclei.
3. Give the DANISH signs. || Dysdiadochokinesia, ataxia, nystagmus, intention tremor, slurred speech, hypotonia.
4. List the components of the basal ganglia. || Caudate and putamen (striatum), globus pallidus external and internal, subthalamic nucleus, substantia nigra (compacta and reticulata).
5. Trace the indirect pathway. || Cortex to striatum (D2) to GPe (inhibited) to STN (released) to GPi and SNr (excited) to thalamus (inhibited): less movement.
6. How does dopamine act on each pathway? || Excites the direct pathway via D1 and inhibits the indirect pathway via D2; both favour movement.
7. What lesion causes hemiballismus? || The contralateral subthalamic nucleus.
:::

:::mcq
Q: Which is NOT part of the basal ganglia?
- Putamen
- Globus pallidus
- Subthalamic nucleus
- *Thalamus
> The thalamus relays basal ganglia output but is not a basal ganglion.

Q: In the basal ganglia circuit, dopamine from the substantia nigra pars compacta facilitates movement by:
- Inhibiting the direct pathway and exciting the indirect pathway
- *Exciting the direct pathway via D1 and inhibiting the indirect pathway via D2
- Exciting the subthalamic nucleus
- Directly exciting motor neurons in the spinal cord
> Both actions reduce output-nucleus inhibition of the thalamus.

Q: Chronic heavy drinking most commonly causes which cerebellar picture?
- Intention tremor of one arm
- *Broad-based unsteady gait with relatively spared arms (anterior vermis)
- Loss of smell
- Hemiballismus
> Alcoholic cerebellar degeneration affects the anterior superior vermis.

Q: Thompson's work on classical eyeblink conditioning in rabbits located an essential part of the memory trace in the:
- Hippocampus
- Amygdala
- *Cerebellum (interpositus nucleus)
- Motor cortex
> Lesions there abolish the conditioned blink.
:::
`;

export const begAnatomyMid = String.raw`
## 3.3 Thalamus, hypothalamus and the limbic system [core][beginner]
These deep structures sit around the third ventricle like rooms around a courtyard. The **thalamus** is the gateway to the cortex; the **hypothalamus** runs the body; the **limbic system** links memory, emotion and motivation. Psychiatry lives here.

:::widget brainexplorer
{"title":"Peel the brain to its core","focus":["thalamus","hypothalamus","amygdala","hippocampus","basal-ganglia","corpus-callosum","frontal","temporal","brainstem"]}
:::

### The thalamus: more than a relay
Almost every input to the cortex, except smell, passes through a thalamic nucleus, and each nucleus talks back and forth with its own patch of cortex.

:::widget figure
{"id": "horizontal-section", "focus": ["thalamus"]}
:::

| Nucleus | Input | Output | Clinical link |
|---|---|---|---|
| **Lateral geniculate (LGN)** | Retina | Primary visual cortex | Vision ("lateral for light") |
| **Medial geniculate (MGN)** | Inferior colliculus | Primary auditory cortex | Hearing ("medial for music") |
| **Ventral posterolateral (VPL)** | Body touch, pain, position | Primary somatosensory cortex | Thalamic pain syndrome after stroke |
| **Ventral posteromedial (VPM)** | Face sensation, taste | Somatosensory and taste cortex | |
| **Ventral anterior and ventral lateral** | Basal ganglia and cerebellum | Motor and premotor cortex | DBS target for tremor |
| **Anterior nucleus** | Mammillary bodies | Cingulate gyrus | Papez circuit; memory |
| **Mediodorsal** | Amygdala, basal ganglia | Prefrontal cortex | Korsakoff syndrome; reduced volume in schizophrenia |
| **Pulvinar** | Superior colliculus, cortex | Parietal, temporal and occipital association cortex | Visual attention |
| **Reticular nucleus** | Collaterals of all thalamic and cortical traffic | Back onto the thalamus (GABA) | A gate for attention; generates sleep spindles |

:::widget sort
{
 "prompt": "Which thalamic nucleus?",
 "buckets": ["LGN", "MGN", "VPL", "Mediodorsal", "Anterior"],
 "items": [
  { "text": "Relays hearing to the temporal lobe", "bucket": 1 },
  { "text": "Relays vision to the occipital lobe", "bucket": 0 },
  { "text": "Burning pain in the opposite half of the body after a small thalamic stroke", "bucket": 2 },
  { "text": "Damaged with the mammillary bodies in Korsakoff syndrome, linked to the prefrontal cortex", "bucket": 3 },
  { "text": "Receives the mammillothalamic tract and projects to the cingulate gyrus in Papez's circuit", "bucket": 4 }
 ]
}
:::

### The hypothalamus: the body's control room
It weighs only about 4 grams, yet it controls the pituitary, the autonomic system, temperature, hunger, thirst, sleep, sexual behaviour and aggression.

:::widget figure
{"id": "hypothalamus"}
:::

| Nucleus or area | Main function | Effect of damage (classic animal studies) |
|---|---|---|
| **Suprachiasmatic (SCN)** | Master body clock, set by light from the retina | Loss of daily rhythms |
| **Paraventricular (PVN)** | CRH and TRH to the pituitary; oxytocin and vasopressin; autonomic control | |
| **Supraoptic (SON)** | Vasopressin (and oxytocin) to the posterior pituitary | Diabetes insipidus: huge thirst and urine |
| **Arcuate** | Hunger and fullness neurons; dopamine that keeps prolactin low; controls GnRH and growth hormone release | Obesity or disordered hormones |
| **Ventromedial (VMH)** | Satiety; defensive aggression | Overeating, obesity, rage |
| **Lateral hypothalamus** | Hunger; orexin neurons for wakefulness | Refusal to eat; narcolepsy if orexin neurons are lost |
| **Preoptic area** | Sexual behaviour (medial preoptic); heat loss; **VLPO**, the sleep switch | Insomnia (VLPO); loss of male sexual behaviour |
| **Anterior hypothalamus** | Cooling (sweating, vasodilation) | Overheating |
| **Posterior hypothalamus** | Heat conservation; wakefulness | Sleepiness; low temperature |
| **Mammillary bodies** | Memory (part of Papez's circuit) | Korsakoff syndrome |
| **Tuberomammillary** | Histamine for arousal | Sleepiness |

:::mnemonic Two hypothalamic opposites
**L**ateral = **L**unch (lesion: stops eating). **V**entro**M**edial = "**V**ery **M**uch full" (lesion: overeats). **A**nterior **c**ools ("A/C"); **P**osterior **p**reserves heat.
:::

:::widget brainmap
{
 "title": "The limbic system and its partners",
 "focus": ["hippocampus", "amygdala", "hypothalamus", "thalamus", "prefrontal"],
 "notes": {
  "hippocampus": "Curled in the medial temporal lobe; forms new episodic memories and supplies context. Its output bundle, the fornix, runs to the mammillary bodies.",
  "amygdala": "An almond-shaped cluster in front of the hippocampus: threat, emotional learning, reading faces.",
  "hypothalamus": "The mammillary bodies at its back are a station in Papez's circuit.",
  "thalamus": "The anterior nucleus passes the circuit on to the cingulate gyrus.",
  "prefrontal": "The orbitofrontal and anterior cingulate cortex are the 'thinking' members of the limbic network, regulating emotion."
 }
}
:::

### The limbic system and Papez's circuit

:::widget figure
{"id": "limbic-system", "quiz": true}
:::

- In 1878 Paul Broca described a "limbic lobe" (from the Latin for border) around the brainstem.
- In **1937 James Papez** proposed a circuit for emotion: **hippocampus, fornix, mammillary bodies, mammillothalamic tract, anterior thalamic nucleus, cingulate gyrus, cingulum, parahippocampal (entorhinal) cortex, and back to the hippocampus**. We now know this loop serves **memory** more than emotion.
- In **1952 Paul MacLean** popularised the term **limbic system**, adding the amygdala, septum and orbitofrontal cortex; he also proposed the "triune brain", now regarded as a teaching cartoon.

:::widget timeline
{
 "prompt": "Put the stations of Papez's circuit in order, starting from the hippocampus.",
 "events": [
  { "label": "Hippocampus (subiculum)" },
  { "label": "Fornix" },
  { "label": "Mammillary bodies" },
  { "label": "Mammillothalamic tract" },
  { "label": "Anterior thalamic nucleus" },
  { "label": "Cingulate gyrus" },
  { "label": "Cingulum bundle to the parahippocampal and entorhinal cortex" }
 ],
 "why": "Damage anywhere on this loop (hippocampus in Henry Molaison, mammillary bodies and thalamus in Korsakoff syndrome, fornix after surgery for a colloid cyst) causes amnesia."
}
:::

### The amygdala

:::widget figure
{"id": "amygdala-fear"}
:::

- It receives senses through a **fast, rough route** from the thalamus and a **slow, detailed route** through the cortex (Joseph LeDoux's "low road" and "high road"), so you can jump at a rope before you know it is not a snake.
- Its **central nucleus** sends out fear responses: to the hypothalamus (stress hormones, heart rate), the periaqueductal grey (freezing) and the brainstem (startle).
- **Klüver-Bucy syndrome**: Heinrich Klüver and Paul Bucy removed both temporal lobes in monkeys in the late 1930s. The monkeys became **tame and fearless**, put everything in their mouths (**hyperorality**), could see objects but not recognise what they meant (**psychic blindness**), explored compulsively, and showed **hypersexuality** and dietary change. In people it can follow herpes simplex encephalitis or advanced frontotemporal dementia.
- **Patient S.M.**, a woman whose amygdalae were destroyed on both sides by a rare disease (Urbach-Wiethe disease), feels almost **no fear** and cannot recognise fear in other people's faces, though her memory and IQ are normal.

### Cingulate and insula
- The **anterior cingulate cortex** detects errors and conflict (it is active in the Stroop task), weighs effort, and carries the **unpleasantness** of pain. The area just under the front of the corpus callosum, the **subgenual cingulate** (Brodmann area 25), is overactive in depression and was the first target of deep brain stimulation for depression.
- The **insula**, folded deep inside the lateral fissure, senses the **body's inner state** (heartbeat, breathing, gut), and is linked to **disgust** and **craving**: smokers who had strokes damaging the insula sometimes found it remarkably easy to quit.

:::widget decide
{
 "scene": "Mr Nair, 34, a software engineer in Kochi, recovers from a severe brain infection (herpes simplex encephalitis). His family say he now puts coins and paper in his mouth, eats almost anything, makes sexual comments to visitors and seems to have no fear of traffic.",
 "ask": "How would you explain and handle this?",
 "choices": [
  { "label": "Klüver-Bucy features from bilateral medial temporal (amygdala) damage; plan supervision, safety, a structured routine and family education alongside neurorehabilitation", "verdict": "best", "outcome": "The family understands the changes as brain injury, not bad character, and the home is made safer.", "why": "Herpes encephalitis prefers the medial temporal lobes. Hyperorality, hypersexuality and loss of fear fit amygdala damage." },
  { "label": "Diagnose mania and start a mood stabiliser", "verdict": "ok", "outcome": "There is little change and side effects add to his problems.", "why": "Disinhibition can look manic, but the pattern and history point to a structural cause; medicines may help specific symptoms but are not the explanation." },
  { "label": "Tell the family he is doing it on purpose and needs firm discipline", "verdict": "harm", "outcome": "Conflict at home rises; the family feels betrayed and exhausted.", "why": "These are symptoms of brain damage; blaming him harms everyone." }
 ]
}
:::

:::clinician
Thalamic stroke syndromes: paramedian (artery of Percheron, often bilateral) infarcts give hypersomnolence, vertical gaze palsy and amnesia with apathy, and are misdiagnosed as depression or catatonia; Dejerine-Roussy syndrome follows VPL infarction. The mediodorsal nucleus is reduced in volume in schizophrenia in several meta-analyses, and thalamocortical dysconnectivity (reduced prefrontal-thalamic, increased sensorimotor-thalamic) is a replicated imaging finding. Hypothalamic hamartoma causes gelastic (laughing) seizures and precocious puberty; craniopharyngioma causes hypothalamic obesity and diabetes insipidus. LeVay's 1991 report of a smaller INAH-3 in gay men is often cited but is a small post-mortem sample, confounded by HIV status, and not replicated cleanly. The amygdala has basolateral (learning, cortical-like) and centromedial (output) divisions; the bed nucleus of the stria terminalis (extended amygdala) mediates sustained anxiety to uncertain threat, contrasted with phasic fear in the central amygdala. Mayberg's subgenual cingulate DBS for treatment-resistant depression gave encouraging open results but failed a sham-controlled trial (BROADEN) at its primary endpoint, with tractography-guided targeting now under study.
:::

:::recall
1. Which thalamic nuclei relay vision and hearing? || Lateral geniculate (vision) and medial geniculate (hearing).
2. Name the hypothalamic nuclei for the clock, satiety, hunger and sleep switching. || SCN; ventromedial; lateral; ventrolateral preoptic (VLPO).
3. Which nuclei make vasopressin and oxytocin? || Supraoptic and paraventricular nuclei.
4. Trace Papez's circuit. || Hippocampus, fornix, mammillary bodies, mammillothalamic tract, anterior thalamic nucleus, cingulate gyrus, cingulum, parahippocampal and entorhinal cortex, hippocampus.
5. Who popularised the term "limbic system"? || Paul MacLean, in 1952.
6. List the features of Klüver-Bucy syndrome. || Placidity and loss of fear, hyperorality, psychic blindness (visual agnosia), hypermetamorphosis, hypersexuality, dietary change.
7. What is known about patient S.M.? || Bilateral amygdala damage from Urbach-Wiethe disease; almost no fear and poor recognition of fearful faces.
:::

:::mcq
Q: Match the hypothalamic nucleus with its function. Which pair is correct?
- Suprachiasmatic nucleus: satiety
- *Supraoptic nucleus: vasopressin release to the posterior pituitary
- Lateral hypothalamus: body clock
- Mammillary bodies: thirst
> SCN is the clock; the lateral area drives feeding; mammillary bodies serve memory.

Q: In correct order, Papez's circuit runs from the hippocampus via the:
- *Fornix, mammillary bodies, anterior thalamus, cingulate gyrus
- Amygdala, hypothalamus, pituitary, adrenal
- Corpus callosum, insula, cerebellum
- Fornix, caudate, putamen, globus pallidus
> Then back through the parahippocampal gyrus.

Q: The thalamic nucleus that projects to the prefrontal cortex and is damaged in Korsakoff syndrome is the:
- Lateral geniculate
- *Mediodorsal nucleus
- Ventral posterolateral nucleus
- Pulvinar
> Together with the mammillary bodies.

Q: A patient with bilateral amygdala destruction would most likely show:
- Loss of all memory
- *Absent fear and poor recognition of fear in faces
- Cortical blindness
- Inability to speak
> As in patient S.M.
:::

## 3.4 The cortex: layers, Brodmann areas, maps and streams [core][beginner]
The cerebral cortex is a sheet about 2 to 4 millimetres thick, folded into ridges (**gyri**) and grooves (**sulci**) so that roughly two-thirds of it lies hidden in the folds. Exams test how it is built, how it is mapped, and what happens when particular patches fail.

:::widget brainexplorer
{"title":"Map the cortex by breaking it","focus":["frontal","motor","parietal","occipital","temporal","broca","wernicke","cerebellum"],"caption":"Then play Where is the damage? and localise each case from the symptom alone."}
:::

### Six layers
Most of the cortex (the **neocortex**) has six layers, numbered from the surface inwards. The older **allocortex** (hippocampus and smell cortex) has three.

| Layer | Name | Main job |
|---|---|---|
| I | Molecular | Mostly fibres and dendrites |
| II | External granular | Small neurons; local links |
| III | External pyramidal | Links to other cortical areas, including across the corpus callosum |
| IV | Internal granular | **Receives the thalamus**; thick in sensory cortex, almost absent in motor cortex |
| V | Internal pyramidal | **Main output** to the basal ganglia, brainstem and spinal cord; giant Betz cells in motor cortex |
| VI | Multiform | Feedback to the thalamus |

### Brodmann's map
In 1909 Korbinian Brodmann divided the cortex into about **52 areas** by looking at how cells were arranged under the microscope (**cytoarchitecture**). His numbers are still used.

:::widget figure
{"id": "brodmann"}
:::

| Brodmann area | Region | Function |
|---|---|---|
| **4** | Precentral gyrus | **Primary motor** cortex |
| **6** | In front of area 4 | Premotor and supplementary motor areas: planning movement |
| **8** | Frontal eye fields | Voluntary eye movements |
| **9, 46** | Dorsolateral prefrontal cortex | Working memory, planning; rTMS target in depression |
| **10** | Frontal pole | Complex goals, thinking about the future |
| **11, 12, 47** | Orbitofrontal cortex | Value, social judgement, impulse control |
| **44, 45** | Left inferior frontal gyrus | **Broca's area** |
| **1, 2, 3** | Postcentral gyrus | **Primary somatosensory** cortex |
| **5, 7** | Superior parietal lobule | Body in space, reaching |
| **39** | Angular gyrus | Reading, writing, numbers (Gerstmann syndrome) |
| **40** | Supramarginal gyrus | Language and skilled actions (apraxia) |
| **41, 42** | Heschl's gyrus | **Primary auditory** cortex |
| **22** | Back of the superior temporal gyrus | **Wernicke's area** (left) |
| **17** | Banks of the calcarine sulcus | **Primary visual** cortex (V1, striate cortex) |
| **18, 19** | Around area 17 | Visual association areas |
| **37** | Fusiform gyrus | Faces and words |
| **24, 32, 33** | Anterior cingulate | Conflict, effort, pain unpleasantness |
| **25** | Subgenual cingulate | Mood; target in depression research |
| **28, 34** | Entorhinal cortex | Gateway to the hippocampus; first area hit by Alzheimer's tangles |

:::mnemonic Five numbers that answer most questions
**4** moves, **3-1-2** feels, **17** sees, **41** hears, **44-45** speaks (Broca), **22** understands (Wernicke).
:::

:::widget brainmap
{
 "title": "Primary areas and their Brodmann numbers",
 "focus": ["motor", "sensory", "occipital", "temporal", "broca", "wernicke", "prefrontal"],
 "notes": {
  "motor": "Area 4, precentral gyrus: the primary motor cortex, laid out as a map of the opposite half of the body.",
  "sensory": "Areas 3, 1 and 2, postcentral gyrus: the primary somatosensory cortex, the sensory map.",
  "occipital": "Area 17, primary visual cortex around the calcarine sulcus; areas 18 and 19 around it.",
  "temporal": "Areas 41 and 42, Heschl's gyrus: primary auditory cortex, hidden in the lateral fissure.",
  "broca": "Areas 44 and 45, left inferior frontal gyrus.",
  "wernicke": "Area 22, back of the left superior temporal gyrus.",
  "prefrontal": "Areas 9 and 46 (dorsolateral), 10 (frontal pole), 11 and 12 (orbitofrontal)."
 }
}
:::

### Maps of the body
Wilder Penfield, operating on awake epilepsy patients in Montreal, stimulated the cortex and drew the **homunculus**: a distorted body map in the motor and sensory strips, with huge hands, lips and tongue and a small trunk, because area depends on precision, not size. The legs and feet are on the **inner (medial) surface**, the face low on the side. A seizure that starts in the hand and spreads up the arm and to the face follows this map (the **Jacksonian march**).

:::widget figure
{"id": "homunculus"}
:::

### Two visual streams
From the primary visual cortex, information flows along two routes (Leslie Ungerleider and Mortimer Mishkin, 1982):
- the **ventral "what" stream** to the **inferior temporal lobe**: recognising objects, faces and words;
- the **dorsal "where" (or "how") stream** to the **posterior parietal lobe**: location, motion and guiding action. David Milner and Melvyn Goodale reframed it as vision for action, after patient D.F., who could not recognise the orientation of a slot yet posted a card through it accurately.

:::widget figure
{"id": "visual-pathway"}
:::

:::widget compare
{
 "title": "The two visual streams",
 "a": {
  "label": "Ventral 'what' stream",
  "points": ["Occipital to inferior temporal cortex", "Shape, colour, faces, words", "Damage: visual agnosia, prosopagnosia, loss of colour vision", "Fusiform face area"],
  "summary": "Knowing what you see."
 },
 "b": {
  "label": "Dorsal 'where or how' stream",
  "points": ["Occipital to posterior parietal cortex", "Location, motion, reaching and grasping", "Damage: optic ataxia, neglect, loss of motion vision", "Area V5 (MT) for motion"],
  "summary": "Acting on what you see."
 },
 "caption": "A person can lose one stream and keep the other, the clearest proof that perception and action are partly separate."
}
:::

### Agnosias, apraxias and aprosodias
| Problem | What the person cannot do | Usual site |
|---|---|---|
| **Visual object agnosia** | Recognise objects by sight (but can by touch) | Occipitotemporal (ventral stream) |
| **Prosopagnosia** | Recognise familiar faces | Fusiform gyrus, often on both sides or the right |
| **Achromatopsia** | See colour | Area V4 |
| **Akinetopsia** | See motion (the world moves in jumps) | Area V5 (MT) |
| **Astereognosis** | Recognise an object by touch | Parietal lobe |
| **Balint syndrome** | See more than one thing at a time, reach accurately, move the eyes at will | Both parieto-occipital regions |
| **Ideomotor apraxia** | Mime a skilled action on command (for example, show how to comb) | Left parietal (supramarginal) |
| **Constructional and dressing apraxia** | Copy a drawing; put on clothes | Right parietal |
| **Aprosodia** | Express or understand the emotional tone of speech | Right frontal (expression) or right temporoparietal (comprehension) |

:::widget sort
{
 "prompt": "Name the deficit.",
 "buckets": ["Prosopagnosia", "Ideomotor apraxia", "Aprosodia", "Astereognosis", "Akinetopsia"],
 "items": [
  { "text": "She recognises her husband only when he speaks", "bucket": 0 },
  { "text": "After a right-hemisphere stroke he speaks grammatically but in a flat monotone and cannot tell if others sound angry", "bucket": 2 },
  { "text": "Asked to show how he would brush his teeth, he waves the hand vaguely, though he brushes normally in the morning", "bucket": 1 },
  { "text": "With eyes closed she cannot say whether the object in her hand is a key or a coin", "bucket": 3 },
  { "text": "Pouring tea is hard because the liquid seems frozen and then suddenly overflows", "bucket": 4 }
 ]
}
:::

:::trap Prosopagnosia is not Capgras delusion
In **prosopagnosia** the person does not recognise a face but accepts the person by voice. In the **Capgras delusion** the person recognises the face but feels it is an impostor, a failure of the emotional response to familiar faces. One is a perceptual deficit; the other a delusion, seen in schizophrenia, dementia and brain injury.
:::

:::clinician
Neocortical columns and the laminar pattern underlie predictive coding models: superficial layers carry feedforward prediction errors (gamma band), deep layers carry feedback predictions (alpha and beta), a framework now applied to hallucinations and delusions. Area 25 and adjacent subgenual cortex show reduced grey matter and altered metabolism in familial mood disorders. The entorhinal cortex (layer II stellate cells) is where Braak neurofibrillary stage I begins, before the hippocampus. Apraxia testing is part of every cognitive examination and helps distinguish corticobasal syndrome and Alzheimer's disease from primary psychiatric disorders. Right-hemisphere lesions produce secondary mania more often than left (especially right orbitofrontal, basotemporal and thalamic lesions), and aprosodia can be mistaken for depressed affect: ask about felt mood rather than relying on vocal tone.
:::

:::recall
1. Which cortical layer receives the thalamus and which sends output to subcortical targets? || Layer IV receives thalamic input; layer V sends subcortical output.
2. On what basis did Brodmann map the cortex, and into how many areas? || Cytoarchitecture; about 52 areas.
3. Give the Brodmann numbers for primary motor, somatosensory, visual and auditory cortex. || 4; 3, 1, 2; 17; 41 and 42.
4. Where are Broca's and Wernicke's areas in Brodmann terms? || Broca: 44 and 45. Wernicke: 22 (posterior).
5. Describe the two visual streams. || Ventral "what" to inferior temporal cortex; dorsal "where or how" to posterior parietal cortex.
6. Where is the leg represented on the motor homunculus? || On the medial surface, in the territory of the anterior cerebral artery.
7. What is aprosodia and where is the lesion? || Loss of emotional tone in speech production or comprehension; right frontal or right temporoparietal cortex.
:::

:::mcq
Q: The primary auditory cortex is found in:
- The angular gyrus
- *Heschl's gyrus in the superior temporal lobe
- The precentral gyrus
- The calcarine sulcus
> Areas 41 and 42.

Q: The ventral visual stream runs from the occipital lobe to the:
- Posterior parietal lobe
- *Inferior temporal lobe
- Frontal eye fields
- Cerebellum
> The "what" pathway.

Q: Brodmann area 17 is the:
- Primary motor cortex
- Broca's area
- *Primary visual cortex
- Entorhinal cortex
> Striate cortex around the calcarine sulcus.

Q: A woman cannot recognise her own son's face but knows him instantly by his voice. This is:
- Capgras delusion
- *Prosopagnosia
- Anosognosia
- Aprosodia
> A perceptual face-recognition deficit, usually fusiform.
:::
`;

export const begVessels = String.raw`
## 3.6 Blood supply, ventricles, CSF and stroke syndromes for psychiatry [core][beginner]
At the Starting level you learned that four arteries feed the brain and that CSF fills the ventricles. Now map each artery to the symptoms of its stroke, and follow CSF through the ventricles, because several "psychiatric" presentations are really vascular or hydrocephalic.

### The arteries and their territories

:::widget figure
{"id": "arterial-territories"}
:::

:::widget figure
{"id": "circle-of-willis", "quiz": true}
:::

| Artery | Supplies | Stroke gives | Psychiatric picture |
|---|---|---|---|
| **Anterior cerebral (ACA)** | Inner surface of frontal and parietal lobes | Weakness and numbness of the opposite **leg** more than arm; urinary incontinence | **Abulia** and apathy; akinetic mutism if both sides; disinhibition |
| **Middle cerebral (MCA)** | Most of the outer surface, plus deep branches to the basal ganglia and internal capsule | Opposite face and **arm** weakness and numbness more than leg; loss of half the visual field | Dominant side: **aphasia**. Non-dominant side: **neglect**, anosognosia, aprosodia, sometimes **secondary mania** or delirium |
| **Posterior cerebral (PCA)** | Occipital lobe, inferior temporal lobe, much of the thalamus | Loss of the opposite half of vision, often sparing central vision | **Memory loss** (hippocampus), visual hallucinations, **alexia without agraphia** (left PCA plus the back of the corpus callosum), thalamic pain |
| **Basilar** | Brainstem, cerebellum, top branches to midbrain and thalamus | Locked-in syndrome; coma | "Top of the basilar": sleepiness, vivid visual hallucinations (peduncular hallucinosis), memory loss |
| **Small deep arteries** | Basal ganglia, thalamus, internal capsule, pons | **Lacunar** strokes: pure motor or pure sensory loss | Many small strokes: slowed thinking, apathy, **vascular depression**, vascular dementia |

The carotid arteries feed the ACA and MCA (the **anterior circulation**); the vertebral arteries join to form the basilar, which gives the PCAs (the **posterior circulation**). The **circle of Willis** links them through communicating arteries.

:::widget sort
{
 "prompt": "Which artery's territory?",
 "buckets": ["Anterior cerebral", "Middle cerebral (left)", "Middle cerebral (right)", "Posterior cerebral"],
 "items": [
  { "text": "Right leg weakness, wetting herself, sitting silently all day without starting anything", "bucket": 0 },
  { "text": "Right arm and face weakness with halting, effortful speech", "bucket": 1 },
  { "text": "Left arm weakness; ignores people on her left and insists she is fine", "bucket": 2 },
  { "text": "Can write a letter but cannot read it back; cannot see to the right", "bucket": 3, "why": "Alexia without agraphia: the left visual cortex is damaged and the splenium of the corpus callosum cannot carry words from the right visual cortex to the left-hemisphere language areas." },
  { "text": "Sudden inability to form new memories with loss of part of the visual field", "bucket": 3 },
  { "text": "Euphoria, talkativeness and reduced sleep for the first time at 70, after a stroke on the side opposite to the language areas", "bucket": 2, "why": "Secondary mania is more common after right-hemisphere lesions." }
 ]
}
:::

### Stroke and mental health
- **Post-stroke depression** affects about a third of survivors, most often in the first year. It slows rehabilitation and raises mortality, and it responds to antidepressants and psychological treatment.
- **Vascular depression**: depression starting in later life with **white-matter changes** on MRI, slowed thinking and poor executive function, often with less guilt and more apathy, and a weaker response to antidepressants.
- **Vascular dementia** typically progresses **step by step** with each new stroke, with early slowing and executive problems rather than early forgetting.
- **Apathy** after frontal, caudate or thalamic strokes is often mistaken for depression or laziness.

:::widget compare
{
 "title": "Post-stroke depression or post-stroke apathy?",
 "a": {
  "label": "Depression",
  "points": ["Sad, tearful, hopeless", "Guilt, worthlessness, thoughts of death", "Distressed by the loss of function", "Responds to antidepressants and therapy"],
  "summary": "Low mood is the core."
 },
 "b": {
  "label": "Apathy",
  "points": ["Little drive or initiative", "Flat but not distressed", "Unconcerned about deficits", "Often frontal, caudate or thalamic lesions; may respond to activation, structure and sometimes stimulants"],
  "summary": "Low drive is the core."
 },
 "caption": "Ask: 'Do you feel sad?' and 'Do you feel like doing things?' The answers often differ."
}
:::

### The ventricles and the flow of CSF

:::widget figure
{"id": "ventricles", "quiz": true}
:::

:::widget flow
{
 "title": "The path of cerebrospinal fluid",
 "layout": "chain",
 "nodes": [
  { "id": "lv", "label": "Two lateral ventricles", "detail": "C-shaped spaces inside each hemisphere; the choroid plexus here makes much of the CSF." },
  { "id": "fm", "label": "Interventricular foramina (of Monro)", "detail": "Two small openings into the midline." },
  { "id": "tv", "label": "Third ventricle", "detail": "A slit between the two halves of the thalamus and above the hypothalamus." },
  { "id": "aq", "label": "Cerebral aqueduct (of Sylvius)", "detail": "A narrow channel through the midbrain: the commonest site of blockage in children." },
  { "id": "fv", "label": "Fourth ventricle", "detail": "Between the pons and medulla in front and the cerebellum behind." },
  { "id": "fl", "label": "Foramina of Luschka and Magendie", "detail": "Two lateral and one midline opening into the subarachnoid space." },
  { "id": "sa", "label": "Subarachnoid space", "detail": "Bathes the brain and spinal cord." },
  { "id": "ag", "label": "Arachnoid granulations", "detail": "Return CSF to the venous sinuses and the blood." }
 ],
 "caption": "(The lateral and third ventricles, not the fourth.)"
}
:::

### Hydrocephalus
- **Obstructive (non-communicating)**: flow is blocked inside the ventricular system, for example by aqueduct narrowing or a tumour.
- **Communicating**: flow is free between ventricles but absorption fails, for example after meningitis or a subarachnoid bleed.
- **Normal pressure hydrocephalus (NPH)**: in older adults, enlarged ventricles with near-normal pressure, and a classic triad: **gait disturbance** (a slow, broad, "magnetic" walk, feet stuck to the floor), **urinary incontinence** and **dementia** (slowed, apathetic thinking). It matters because it is one of the few **treatable dementias**: removing CSF (a tap test) and then a shunt can restore function.

:::mnemonic NPH: "Wet, wobbly and wacky"
**Wet** (incontinence), **wobbly** (gait, usually first), **wacky** (dementia). Gait problems early, before memory, is the clue.
:::

:::widget decide
{
 "scene": "Mrs Kulkarni, 74, in Pune, has become slow, forgetful and uninterested over a year, and her family have started a memory medicine for 'Alzheimer's'. She also walks with small, shuffling, wide-based steps as if her feet are glued to the floor, and has started wetting herself. CT shows large ventricles without much shrinkage of the cortex.",
 "ask": "What is the best next step?",
 "choices": [
  { "label": "Refer to neurology or neurosurgery for possible normal pressure hydrocephalus, including a large-volume lumbar tap test", "verdict": "best", "outcome": "Her walking improves clearly after the tap test; a shunt is placed and her thinking and continence improve too.", "why": "Gait trouble before memory, incontinence and ventricles out of proportion to atrophy suggest NPH, a reversible cause of dementia." },
  { "label": "Increase the memory medicine dose", "verdict": "harm", "outcome": "No improvement; she has a fall and breaks her hip.", "why": "Treating presumed Alzheimer's misses a correctable cause." },
  { "label": "Start an antidepressant for apathy", "verdict": "ok", "outcome": "Mood is a little brighter but the walking and continence worsen.", "why": "Apathy may coexist, but the triad needs a specific work-up first." }
 ]
}
:::

### The blood-brain barrier and its windows
The barrier is formed by **tight junctions** between the cells lining brain capillaries, supported by **astrocyte end-feet** and **pericytes**. Small fat-soluble molecules cross; large or charged ones need carriers. A few places, the **circumventricular organs**, have no barrier so that the brain can sample the blood or release hormones into it: the **area postrema** (vomiting), the **organum vasculosum of the lamina terminalis** and **subfornical organ** (thirst and salt), the **median eminence** and **posterior pituitary** (hormone release), and the **pineal gland**.

### What CSF can tell the psychiatrist
| Test on CSF | Points to |
|---|---|
| White cells, low glucose, high protein | Infection (meningitis, encephalitis) |
| Antibodies against the NMDA receptor | Autoimmune encephalitis |
| Oligoclonal bands | Multiple sclerosis |
| Low amyloid-beta 42, high tau | Alzheimer's disease |
| 14-3-3 protein and a positive RT-QuIC test | Creutzfeldt-Jakob disease |
| Very low orexin | Narcolepsy type 1 |
| Positive VDRL | Neurosyphilis |

:::clinician
Anterior cerebral artery infarction is a classic cause of abulia, and bilateral ACA territory damage (sometimes from a single azygos ACA or after anterior communicating aneurysm rupture) gives akinetic mutism; ACoA aneurysm rupture also causes a confabulatory amnesia with basal forebrain damage. Robinson's early work linked post-stroke depression to left anterior lesions; later meta-analyses did not confirm a reliable lesion-location effect, and the current view emphasises severity, disability, prior depression and social support. Alexopoulos's vascular depression hypothesis (1997) is supported by associations between white matter hyperintensities, executive dysfunction and poorer antidepressant response. CADASIL (NOTCH3) presents with migraine with aura, mood disorder, apathy and early subcortical dementia. In NPH, gait improvement after a 30 to 50 mL tap test or extended lumbar drainage predicts shunt response; Evans index above 0.3 indicates ventriculomegaly; disproportionately enlarged subarachnoid space hydrocephalus (DESH) on MRI supports the diagnosis. Remember idiopathic intracranial hypertension in young obese women (headache, papilloedema), aggravated by lithium and tetracyclines.
:::

:::recall
1. Which artery's stroke gives leg weakness and abulia? || The anterior cerebral artery.
2. What does a left MCA stroke typically cause? || Right face and arm weakness and aphasia.
3. What is alexia without agraphia and which artery is involved? || Can write but cannot read; left PCA territory plus the splenium of the corpus callosum.
4. Trace CSF from the lateral ventricles to the blood. || Lateral ventricles, foramina of Monro, third ventricle, aqueduct, fourth ventricle, foramina of Luschka and Magendie, subarachnoid space, arachnoid granulations, venous sinuses.
5. Give the triad of normal pressure hydrocephalus. || Gait disturbance, urinary incontinence and dementia.
6. Name three circumventricular organs and their roles. || Area postrema (vomiting), subfornical organ and OVLT (thirst), median eminence and posterior pituitary (hormone release), pineal (melatonin).
7. Roughly how common is depression after stroke? || About a third of survivors.
:::

:::mcq
Q: Cerebrospinal fluid is produced mainly by the:
- Arachnoid granulations
- *Choroid plexus
- Pineal gland
- Dura mater
> Then absorbed by arachnoid granulations.

Q: An older man has a slow magnetic gait, urinary incontinence and slowed thinking; CT shows enlarged ventricles. The most likely diagnosis is:
- Alzheimer's disease
- *Normal pressure hydrocephalus
- Parkinson's disease
- Korsakoff syndrome
> A potentially reversible dementia.

Q: Blockage of the cerebral aqueduct would enlarge the:
- Fourth ventricle only
- *Lateral and third ventricles
- Subarachnoid space only
- Central canal of the spinal cord
> Everything upstream of the block.

Q: Late-life depression with white matter changes on MRI, slowed thinking and executive problems best fits:
- Psychotic depression
- *Vascular depression
- Seasonal depression
- Atypical depression
> The vascular depression hypothesis.

Q: A woman can write a sentence to dictation but cannot read what she has written. The lesion most likely involves:
- Broca's area
- *The left occipital cortex and the splenium of the corpus callosum
- The right parietal lobe
- The cerebellum
> Alexia without agraphia, a posterior cerebral artery syndrome.
:::
`;
