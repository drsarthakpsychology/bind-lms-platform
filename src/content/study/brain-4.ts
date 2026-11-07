/* Module · Brain and behaviour, new Starting sections (how the nervous system is built; how we know about the brain). Original text written for VIBHA School of Psychology. */

export const startBuilt = String.raw`
## 1.6 How the nervous system is built, protected and fed [core][starting]
You have met the neuron and the big areas. Now step back and see the whole system as a body part: how it grows, what holds it, what washes it and what feeds it. Many exam questions, and many emergencies, come from these plain facts.

:::widget nervoussystem
{"title":"Your nervous system, live","start":"signal","caption":"Send the hot cup through the brain, then through the reflex shortcut. Which is faster, and which part of the system did the shortcut skip?"}
:::

### From a flat sheet to a brain
Every brain begins as a flat sheet of cells on the back of a tiny embryo, about two weeks after conception. The sheet folds up into a groove, then closes into a hollow **neural tube** by about day 28. The front end of the tube swells into three bulges that become the **forebrain**, **midbrain** and **hindbrain**; the rest becomes the **spinal cord**. Cells that pinch off the edges of the folds, the **neural crest**, wander away and build most of the peripheral nerves.

- The hollow inside the tube stays hollow for life: it becomes the **ventricles** of the brain and the thin central canal of the spinal cord.
- Most neurons are made before birth. After birth the brain grows mainly by making **connections** and **myelin**, not by adding neurons.
- At birth the brain weighs about a quarter of its adult weight; an adult brain weighs about 1.3 to 1.4 kilograms.

:::widget timeline
{
 "prompt": "Put the building of the nervous system in order.",
 "events": [
  { "label": "A flat sheet of cells (the neural plate) appears on the embryo's back", "when": "about day 16" },
  { "label": "The sheet folds and closes into the neural tube", "when": "by about day 28" },
  { "label": "The front of the tube swells into forebrain, midbrain and hindbrain", "when": "the second month" },
  { "label": "Most neurons are made and travel to their places", "when": "mid-pregnancy" },
  { "label": "A burst of new connections, then pruning of unused ones", "when": "infancy and childhood" },
  { "label": "Myelin around the front of the brain is finished", "when": "mid-twenties" }
 ],
 "why": "The tube closes so early that many women do not yet know they are pregnant. That is why folic acid is advised before pregnancy, not only after a positive test."
}
:::

:::example Folic acid, valproate and a closed tube
Rekha, 26, in Nagpur, takes sodium valproate for bipolar disorder and is planning a baby. If the neural tube fails to close at the bottom end, the baby may be born with **spina bifida**; at the top end, with **anencephaly**. Valproate raises this risk several times over, and folic acid before conception lowers it. Her psychiatrist plans a switch to a safer mood stabiliser and starts folic acid before she tries to conceive. A plain fact about the first month of life changes a prescription.
:::

### The spinal cord: a cable and a reflex centre
The spinal cord runs inside the backbone, from the base of the skull to about the level of the first or second lumbar bone in adults. **31 pairs** of spinal nerves leave it. Each nerve joins the cord by two roots:
- the **back (dorsal) root** carries **sensation in** (touch, pain, position);
- the **front (ventral) root** carries **commands out** to the muscles.

The cord is not only a cable. It can act on its own in a **reflex**: touch a hot pan and your hand jerks away before the pain reaches awareness. The message goes in by the back root, crosses a relay neuron in the cord and goes straight out by the front root.

:::widget flow
{
 "title": "The reflex arc: hand on a hot pan",
 "layout": "chain",
 "nodes": [
  { "id": "r", "label": "Receptor in the skin", "detail": "Heat and pain sensors fire." },
  { "id": "s", "label": "Sensory neuron", "detail": "Carries the signal into the cord through the back (dorsal) root." },
  { "id": "i", "label": "Relay neuron in the cord", "detail": "Passes the message across inside the grey matter of the cord." },
  { "id": "m", "label": "Motor neuron", "detail": "Leaves by the front (ventral) root to the arm muscles." },
  { "id": "e", "label": "Muscle pulls the hand away", "detail": "All this before the brain has finished feeling the pain." }
 ],
 "caption": "Press Play. The knee jerk is even simpler: no relay neuron, one sensory neuron straight to one motor neuron."
}
:::

### The twelve cranial nerves at a glance
Twelve pairs of nerves leave the brain itself, mostly from the brainstem. They are numbered with Roman numerals from front to back. At this level, know what each one does in everyday words.

| Number and name | What it does in plain words |
|---|---|
| I Olfactory | Smell |
| II Optic | Sight |
| III Oculomotor | Moves the eye in most directions, lifts the eyelid, narrows the pupil |
| IV Trochlear | Moves the eye down and in (as when reading or walking downstairs) |
| V Trigeminal | Feeling in the face; chewing muscles |
| VI Abducens | Moves the eye outwards |
| VII Facial | Moves the face; taste at the front of the tongue; tears and saliva |
| VIII Vestibulocochlear | Hearing and balance |
| IX Glossopharyngeal | Swallowing; taste at the back of the tongue |
| X Vagus | The long "wanderer": heart, lungs, gut; voice box |
| XI Accessory | Shrugging the shoulders, turning the head |
| XII Hypoglossal | Moves the tongue |

:::mnemonic Names: "Oh Oh Oh To Touch And Feel Very Good Velvet, Ah Heaven"
**O**lfactory, **O**ptic, **O**culomotor, **T**rochlear, **T**rigeminal, **A**bducens, **F**acial, **V**estibulocochlear, **G**lossopharyngeal, **V**agus, **A**ccessory, **H**ypoglossal. The Beginner level adds which are sensory, motor or both.
:::

:::widget sort
{
 "prompt": "Which cranial nerve is most likely affected?",
 "buckets": ["II Optic", "VII Facial", "VIII Vestibulocochlear", "X Vagus"],
 "items": [
  { "text": "One side of the face droops suddenly; he cannot close that eye or whistle", "bucket": 1, "why": "Bell's palsy is a facial nerve weakness. Patients often fear a stroke and are very anxious." },
  { "text": "A ringing in the ears with hearing loss on one side", "bucket": 2 },
  { "text": "A device in the neck that sends gentle pulses up to the brainstem, used for epilepsy and some long-lasting depression", "bucket": 3 },
  { "text": "Loss of part of the vision in one eye", "bucket": 0 },
  { "text": "A fainting attack at the sight of blood, as the heart suddenly slows", "bucket": 3, "why": "The vagus slows the heart. A strong vagal surge causes the blood-injury faint." }
 ]
}
:::

### Wrapped and floating: meninges and CSF
The brain is soft, about as firm as set curd. It is protected in four ways:
1. **Bone**: the skull and the backbone.
2. **Meninges**: three wrappings. From outside in: the tough **dura mater**, the web-like **arachnoid mater**, and the thin **pia mater** stuck to the brain's surface.
3. **Cerebrospinal fluid (CSF)**: a clear, watery fluid in the space under the arachnoid and inside the ventricles. The brain floats in it, so its working weight drops to a few tens of grams.
4. **The blood-brain barrier**: tightly sealed blood vessel walls that keep many substances out.

:::widget layers
{
 "title": "From the skin to the brain",
 "shape": "stack",
 "layers": [
  { "label": "Scalp and skull", "detail": "Hard protection. A blow can bleed between the skull and the dura (extradural haemorrhage)." },
  { "label": "Dura mater", "detail": "Tough outer wrapping. Torn veins beneath it bleed slowly (subdural haematoma), common in older people and heavy drinkers after falls, and can look like dementia or delirium." },
  { "label": "Arachnoid mater", "detail": "Web-like middle layer." },
  { "label": "Subarachnoid space with CSF", "detail": "Where CSF flows. A burst blood vessel here gives a sudden 'worst headache of my life' (subarachnoid haemorrhage)." },
  { "label": "Pia mater", "detail": "Thin layer that follows every fold of the brain." },
  { "label": "Brain", "detail": "The cortex begins here." }
 ],
 "caption": "Meningitis is infection of these wrappings: fever, headache, stiff neck, confusion. It can present as sudden confusion or odd behaviour."
}
:::

:::widget guess
{
 "prompt": "An adult has about 150 millilitres of CSF at any moment. How much new CSF does the body make in a day?",
 "min": 50,
 "max": 1500,
 "step": 50,
 "unit": "millilitres a day",
 "answer": [400, 600],
 "reveal": "About 500 millilitres a day, so the whole volume is replaced three to four times a day. It is made mainly by the choroid plexus inside the ventricles and drains back into the blood. If the drainage is blocked, fluid builds up: hydrocephalus.",
 "clinician": "CSF is secreted mainly by the choroid plexus of the lateral, third and fourth ventricles, flows lateral ventricles to third ventricle (through the interventricular foramina) to the cerebral aqueduct to the fourth ventricle, exits through the foramina of Luschka and Magendie into the subarachnoid space, and is absorbed through the arachnoid granulations into the dural venous sinuses. Normal opening pressure at lumbar puncture is roughly 10 to 20 cm of water in a lying adult."
}
:::

### Fed by blood
The brain is about 2 per cent of body weight but uses about a fifth of the body's oxygen and glucose. It cannot store fuel. Four arteries feed it: two **carotid arteries** at the front of the neck and two **vertebral arteries** at the back, which join in a ring under the brain called the **circle of Willis**. If blood stops for a few minutes, neurons begin to die.

A **stroke** is sudden loss of brain function from a blood vessel problem:
- **Ischaemic stroke** (about 85 per cent): a vessel is blocked by a clot.
- **Haemorrhagic stroke** (about 15 per cent): a vessel bursts and bleeds.

:::widget compare
{
 "title": "Two kinds of stroke",
 "a": {
  "label": "Blocked vessel (ischaemic)",
  "points": ["Most strokes", "A clot from the heart or a narrowed artery", "Sudden weakness, speech loss, face droop", "Clot-busting treatment only within a few hours"],
  "summary": "Time is brain: every minute counts."
 },
 "b": {
  "label": "Burst vessel (haemorrhagic)",
  "points": ["Fewer strokes, often more severe", "High blood pressure, a weak bulge in an artery", "Sudden severe headache, vomiting, drowsiness", "Clot-busters would be dangerous"],
  "summary": "A scan must tell the two apart before treatment."
 },
 "caption": "A CT scan in the emergency room separates the two in minutes."
}
:::

:::widget decide
{
 "scene": "Mrs Fernandes, 63, in Goa, is at a family lunch when her speech becomes slurred and her right arm drops. Her son says, 'She is just tired and upset about the wedding. Let her rest tonight and we will see the doctor tomorrow.'",
 "ask": "What should happen?",
 "choices": [
  { "label": "Let her rest and see a doctor tomorrow", "verdict": "harm", "outcome": "By morning the weakness is permanent and the window for clot-busting treatment has closed.", "why": "Sudden face droop, arm weakness or speech trouble is a stroke until proved otherwise. Treatment works only within hours." },
  { "label": "Note the time, call an ambulance and go to a hospital with a CT scanner at once", "verdict": "best", "outcome": "A scan shows a blocked artery; she receives treatment within the window and recovers most of her arm movement.", "why": "Face, Arm, Speech, Time: the FAST message. The time symptoms began decides which treatments are possible." },
  { "label": "Give her a sleeping tablet to calm her", "verdict": "harm", "outcome": "She becomes drowsy and the change is mistaken for sleep.", "why": "Sedation hides worsening and delays care." }
 ]
}
:::

:::student
Stroke matters to psychology too. About a third of stroke survivors develop depression, and anxiety, apathy and personality change are common. A psychologist on a stroke ward who knows the brain can tell a sad reaction from apathy caused by the lesion itself.
:::

:::clinician
The neural plate appears around day 16 to 18 after fertilisation; the anterior neuropore closes around day 25 and the posterior around day 27 to 28. The prosencephalon divides into telencephalon (cerebral hemispheres) and diencephalon (thalamus, hypothalamus); the rhombencephalon into metencephalon (pons, cerebellum) and myelencephalon (medulla), giving the five secondary vesicles. Neural crest derivatives include dorsal root and autonomic ganglia, Schwann cells, adrenal medulla chromaffin cells and melanocytes. Valproate carries the highest neural tube defect risk among mood stabilisers (about 1 to 2 per cent for spina bifida, several times background), with dose-related risks for major malformations and lower child IQ; carbamazepine also raises neural tube risk. In India, the Mental Healthcare Act and national guidance both stress counselling women of childbearing potential; check current national advice on valproate in girls and women. Chronic subdural haematoma is a classic reversible cause of fluctuating confusion in older drinkers and patients on anticoagulants: ask about falls and look for a lucid interval.
:::

:::recall
1. What does the neural tube become? || The brain and spinal cord; its hollow centre becomes the ventricles and central canal.
2. Which spinal root carries sensation and which carries movement? || The dorsal (back) root carries sensation in; the ventral (front) root carries motor commands out.
3. Name the three meninges from outside in. || Dura mater, arachnoid mater, pia mater.
4. Roughly how much CSF is there and how much is made each day? || About 150 mL at a time; about 500 mL is made a day.
5. What are the two main kinds of stroke and their rough shares? || Ischaemic (blocked vessel, about 85 per cent) and haemorrhagic (bleeding, about 15 per cent).
6. Which cranial nerve slows the heart and supplies the gut? || The vagus nerve (X).
:::

:::mcq
Q: Folic acid is advised before conception mainly because:
- It improves the baby's later IQ in all cases
- *The neural tube closes within the first month, often before pregnancy is known
- It replaces valproate as a mood stabiliser
- It prevents all birth defects
> The tube closes very early, so protection must already be in place.

Q: A man touches a hot iron and pulls his hand back before he feels pain. This is possible because:
- The cerebellum plans the movement
- *A spinal reflex arc links sensory and motor neurons inside the cord
- The vagus nerve controls the arm
- Pain travels faster than touch to the cortex
> Spinal reflexes act without waiting for the brain.

Q: An older man who drinks heavily has fluctuating confusion since a fall a fortnight ago. The bleed most likely to explain this lies:
- *Under the dura (chronic subdural haematoma)
- Inside the cerebellum
- In the vagus nerve
- In the pineal gland
> Torn bridging veins under the dura bleed slowly after minor falls.
:::

## 1.7 How we know about the brain, and how it changes [core][starting]
How do scientists know that the left side handles speech, or that a part of the brain stores new memories? Five kinds of evidence, each with strengths and weak spots. Then one big idea that runs through this whole module: the brain changes with experience.

### Five ways of knowing
| Method | What it does in plain words | A famous example | Weak spot |
|---|---|---|---|
| **Studying damage (lesions)** | See what a person cannot do after injury to one area | In 1861 Paul Broca's patient "Tan" could say only one word; after his death Broca found damage in the left frontal lobe | Damage is rarely neat; the brain also reorganises |
| **Recording electricity** | Electrodes on the scalp pick up the brain's rhythms (EEG) | Hans Berger recorded the first human EEG in 1929 | Shows timing well but not exactly where |
| **Pictures of structure** | CT (X-rays) and MRI (magnets) show the shape of the brain | MRI showing shrinkage of the hippocampus in Alzheimer's disease | A picture of structure says nothing about activity |
| **Pictures of activity** | Functional MRI tracks blood oxygen; PET tracks sugar use or a chemical | Seeing language areas work while someone reads | Slow, indirect, easy to over-read |
| **Changing activity** | Magnetic pulses (TMS) briefly switch an area up or down | A TMS pulse over the motor cortex makes the thumb twitch | Reaches only areas near the surface |

Two more come from families and animals: **twin and adoption studies** separate genes from upbringing, and **animal studies** let scientists test causes directly, though animals are not people.

:::widget sort
{
 "prompt": "Which method would you use?",
 "buckets": ["EEG", "CT or MRI", "Functional MRI or PET", "Twin or adoption study"],
 "items": [
  { "text": "Is this confused old man having seizures that nobody can see?", "bucket": 0, "why": "Only EEG catches the brain's electrical activity in milliseconds." },
  { "text": "Has a fall caused bleeding inside the skull?", "bucket": 1 },
  { "text": "Which areas become more active when people look at a frightening face?", "bucket": 2 },
  { "text": "Is shyness mostly passed on by genes or learned at home?", "bucket": 3 },
  { "text": "Is there a tumour behind a sudden change in personality?", "bucket": 1 },
  { "text": "How quickly does the brain notice an odd sound in a series of beeps?", "bucket": 0, "why": "EEG timing is precise to thousandths of a second." }
 ]
}
:::

:::example Broca's patient and a Kolkata clinic today
Broca's patient Louis Leborgne was nicknamed "Tan" because it was the only syllable he could say, though he understood speech well. Broca linked his loss to a damaged area in the left frontal lobe. Today a neurologist in Kolkata sees a 58-year-old with the same pattern after a stroke and an MRI finds the damage in the same place within an hour. The method has changed; the logic of linking a loss to a place has not.
:::

:::trap One bright spot is not "the centre" for anything
Pictures of activity show where blood flow rises **more** in one task than another. A glowing amygdala does not mean "the fear centre is switched on"; the amygdala responds to many things. Treat headlines like "scientists find the love centre" with suspicion.
:::

### The brain changes with experience
**Neuroplasticity** means that the brain's connections, and even its size in places, change with use. Some examples you can quote:
- **London taxi drivers**, who memorise thousands of streets, have a larger back part of the hippocampus (a memory area for places) than bus drivers who follow fixed routes, and the difference grows with years of driving.
- **Learning to read as an adult**: women in villages in Uttar Pradesh who learned to read Hindi over six months showed changes not only in the cortex but deep in the visual system, in the thalamus and brainstem.
- **Recovery after stroke**: practice helps nearby areas take over lost work, which is why early, intense rehabilitation matters.
- **Use it or lose it**: unused connections are pruned, especially in childhood.

:::widget compare
{
 "title": "Two kinds of driver, two hippocampi",
 "a": {
  "label": "Bus driver on fixed routes",
  "points": ["Drives as many hours", "Follows the same route daily", "No need to hold a city map in mind", "Rear hippocampus of average size"],
  "summary": "Driving alone does not change the hippocampus."
 },
 "b": {
  "label": "Licensed London taxi driver",
  "points": ["Memorised about 25,000 streets", "Plans new routes all day", "Larger rear hippocampus", "The longer in the job, the larger it is"],
  "summary": "Building and using a mental map changes the brain."
 },
 "caption": "A later study followed trainees: the rear hippocampus grew only in those who passed the test, so experience came first."
}
:::

### Sensitive periods: some windows close
Some kinds of learning are easiest, or only possible, at certain ages. A baby born with dense cataracts in both eyes needs surgery in the first months, or vision never develops fully even after later surgery, because the visual cortex wires itself up early. Accents in a new language and some social skills follow softer windows. This is one reason early childhood neglect does such lasting harm, and why early help for children matters so much.

:::analogy Footpaths across a college lawn
New students walk wherever they like; within a term the grass wears into paths where most people walk, and the rest grows back. The brain makes paths the same way: what is used is strengthened, what is not used fades.
:::

:::widget decide
{
 "scene": "A coaching centre in Kota advertises a 'brain scan test' that will tell parents whether their child is 'left-brained or right-brained' and which stream (science or arts) to choose.",
 "ask": "What should you tell a parent who asks your advice?",
 "choices": [
  { "label": "It sounds scientific, so it is worth trying", "verdict": "harm", "outcome": "The family pays a large fee and chooses a stream based on a meaningless label.", "why": "No brain scan can sort children into 'left-brained' or 'right-brained', and no scan predicts which subject a child should study." },
  { "label": "Explain that both sides of the brain work together, that brain scans cannot choose a career, and suggest proper aptitude and interest assessment with a qualified psychologist", "verdict": "best", "outcome": "The parent saves money and the child gets a sensible assessment and a conversation about interests.", "why": "Honest science plus a useful alternative." },
  { "label": "Tell the parent that all psychology tests are useless", "verdict": "ok", "outcome": "The parent is left with nothing better to use.", "why": "Validated aptitude and interest measures exist and can help; dismissing all testing goes too far." }
 ]
}
:::

:::clinician
Each method answers a different question: lesions and stimulation (TMS, optogenetics in animals) test whether a region is necessary; recording and functional imaging show correlation. Spatial and temporal resolution trade off: EEG and MEG resolve milliseconds but localise poorly; fMRI localises to millimetres but the haemodynamic response lags by several seconds; PET is slower still but can image specific receptors and transporters. In Maguire's taxi-driver work the posterior hippocampal grey matter was larger and the anterior hippocampus smaller, and a later longitudinal study of trainees showed growth only in those who qualified, strengthening the causal claim. Sensitive periods: Hubel and Wiesel's monocular deprivation experiments in kittens established ocular dominance plasticity; the human counterpart is amblyopia, treated by patching in early childhood. The Bucharest Early Intervention Project showed that children moved from institutions to foster care before about two years did better on IQ and EEG measures than those moved later, a strong human example of timing in plasticity.
:::

:::recall
1. What did Broca's patient "Tan" show? || Damage to the left inferior frontal lobe can abolish speech production while comprehension stays.
2. Who recorded the first human EEG and when? || Hans Berger, in 1929.
3. What is the difference between CT or MRI and functional MRI? || CT and MRI show structure; functional MRI shows changes in blood oxygen linked to activity.
4. What did the taxi-driver studies show? || A larger posterior hippocampus that grew with years of navigation, showing experience can change brain structure.
5. Give an example of a sensitive period. || Vision: congenital cataracts must be treated in early infancy or vision does not fully develop.
:::

:::mcq
Q: Which method has the best timing precision (milliseconds) for brain activity?
- CT
- *EEG
- PET
- Functional MRI
> EEG records electrical activity directly as it happens.

Q: A newspaper says, "Scientists find the guilt centre: it lights up on brain scans." The best response is:
- Accept it, since scans are objective
- *Be cautious: one area's extra activity in one task does not make it the centre of a feeling
- Conclude guilt is not real
- Conclude scans are useless
> Regions do many jobs; a single bright spot cannot define a feeling.

Q: Taxi drivers' larger posterior hippocampus that grew with years in the job is evidence for:
- The 10 per cent myth
- *Neuroplasticity driven by experience
- Left-brain dominance
- Genetic determinism
> Use changes structure.
:::
`;
