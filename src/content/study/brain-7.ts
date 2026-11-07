/* Module · Brain and behaviour, new Beginner sections on the hormone axes and on sleep, EEG and evoked potentials. Original text written for VIBHA School of Psychology. */

export const begAxes = String.raw`
## 4.3 The hormone axes in depth: HPA, HPT, HPG, prolactin, growth hormone, melatonin, oxytocin and vasopressin [core][beginner]
The endocrine table in 4.2 listed the glands. Exams go further and ask how each **axis** is wired, how it switches itself off, and what its failure looks like in a psychiatric clinic. Every axis has the same plan: a **hypothalamic** releasing hormone, a **pituitary** hormone, a **target gland** hormone, and **negative feedback** from the last to the first two.

:::widget hpaloop
{"title":"Play the HPA axis through a day","caption":"Cope with each event, then switch to chronic stress. Which part of the loop fails first, and which test in the clinic shows it?"}
:::

### How the hypothalamus talks to the pituitary
- To the **anterior pituitary**: hypothalamic neurons release hormones into a tiny private blood supply, the **hypophyseal portal system**, at the median eminence.
- To the **posterior pituitary**: the neurons themselves (in the supraoptic and paraventricular nuclei) run their axons down the stalk and release **oxytocin** and **vasopressin** straight into the blood. The posterior pituitary is really brain tissue.

| Hypothalamic hormone | Anterior pituitary hormone | Target and final hormone |
|---|---|---|
| **CRH** (helped by vasopressin) | **ACTH** | Adrenal cortex: **cortisol** |
| **TRH** | **TSH** (and prolactin) | Thyroid: **T4 and T3** |
| **GnRH** (released in pulses) | **LH and FSH** | Ovary and testis: **oestrogen, progesterone, testosterone** |
| **GHRH** (and ghrelin); **somatostatin** inhibits | **Growth hormone** | Liver: **IGF-1** |
| **Dopamine** inhibits (no releasing hormone needed for the brake) | **Prolactin** | Breast |

:::mnemonic The six anterior pituitary hormones: "FLAT PiG"
**F**SH, **L**H, **A**CTH, **T**SH, **P**rolactin, **G**rowth hormone. The posterior pituitary releases only two: oxytocin and vasopressin.
:::

### The HPA axis and the adrenal gland
- **Rhythm**: cortisol peaks around waking (rising further in the half hour after waking, the "cortisol awakening response") and falls to its lowest around midnight. A test result means little without the time it was taken.
- **Feedback**: cortisol acts on two receptors. **Mineralocorticoid receptors** bind it tightly and are filled even at low levels (rich in the hippocampus); **glucocorticoid receptors** bind it loosely and fill at peaks and in stress, switching the axis off at the hypothalamus, pituitary and hippocampus.
- **Fast and slow arms**: the **sympathetic-adrenal-medullary (SAM)** system releases adrenaline in seconds; the HPA axis raises cortisol over 15 to 30 minutes.

| Layer of the adrenal | Main product | Mnemonic "salt, sugar, sex" |
|---|---|---|
| Cortex: zona glomerulosa | Aldosterone | Salt |
| Cortex: zona fasciculata | Cortisol | Sugar |
| Cortex: zona reticularis | Adrenal androgens (DHEA) | Sex |
| Medulla | Adrenaline (mostly) and noradrenaline | Fight or flight |

:::widget stress
{
 "caption": "Trigger a stressor and name each step aloud: amygdala, hypothalamus (CRH), pituitary (ACTH), adrenal cortex (cortisol), with the sympathetic arm racing ahead. Then switch on chronic stress and say which receptor's feedback is failing (glucocorticoid receptors in the hippocampus and hypothalamus)."
}
:::

### Classic stress theories exams name
| Thinker | Idea |
|---|---|
| **Walter Cannon** (early 1900s) | "Fight or flight": the sympathetic and adrenal emergency response; also **homeostasis** |
| **Hans Selye** (1936) | **General adaptation syndrome**: **alarm**, then **resistance**, then **exhaustion** with prolonged stress; the same response to many kinds of stressor |
| **Bruce McEwen and Eliot Stellar** (1993) | **Allostasis** (stability through change) and **allostatic load**, the wear and tear from repeated or prolonged stress responses |
| **Shelley Taylor** (2000) | **Tend and befriend**: under stress, especially in women, protecting offspring and seeking social support, with a role for oxytocin |

The **Trier Social Stress Test** reliably raises cortisol in the laboratory by combining a public speech and mental arithmetic in front of an unsmiling panel: **social-evaluative threat plus uncontrollability**, the two features that drive cortisol most.

:::widget timeline
{
 "prompt": "Order Selye's general adaptation syndrome.",
 "events": [
  { "label": "Alarm: shock, then a burst of sympathetic and adrenal activity" },
  { "label": "Resistance: the body sustains raised cortisol and adapts to the stressor" },
  { "label": "Exhaustion: resources fail; illness becomes likely if stress continues" }
 ],
 "why": "Selye found the same pattern (enlarged adrenals, shrunken thymus, stomach ulcers) in rats exposed to many different stressors, which is why he called it general."
}
:::

### The thyroid axis (HPT)
- TRH from the paraventricular nucleus, TSH from the pituitary, then the thyroid makes mostly **T4**, which tissues convert into the more active **T3**.
- **Underactive (hypothyroidism)**: depression, slowing, poor memory; when severe, psychosis (once called "myxoedema madness").
- **Overactive (hyperthyroidism)**: anxiety, irritability, insomnia, weight loss, sometimes mania-like states; in older people it can look like apathy and depression ("apathetic hyperthyroidism").
- **Lithium** blocks release of thyroid hormone and commonly causes hypothyroidism and goitre, more in women; check thyroid function before starting and regularly after.
- Thyroid hormone is also used as a **treatment**: T3 (liothyronine) as an add-on in treatment-resistant depression, and high-dose T4 in some rapid-cycling bipolar disorder.

### The gonadal axis (HPG)
- **GnRH** must be released in **pulses**; a steady level switches the axis off (the basis of some prostate and puberty treatments).
- **Prolactin** suppresses GnRH. This is why antipsychotics that raise prolactin cause missed periods, low sex drive, erectile problems, infertility and, over years, thinner bones.
- **Organising and activating effects** (introduced in 4.2) explain why prenatal hormones matter: girls with **congenital adrenal hyperplasia**, exposed to high androgens before birth, show more male-typical play preferences on average; people with **complete androgen insensitivity** (XY, testes, but receptors that do not respond) develop a female body and usually a female identity.
- Mood is sensitive to **falls** in oestrogen and progesterone: before periods (premenstrual dysphoric disorder), after childbirth, and around the menopause. **Anabolic steroids** used by bodybuilders can cause irritability, aggression, mania and, on stopping, depression.

### Prolactin
- Made by the anterior pituitary and held down **all the time** by dopamine from the arcuate nucleus (the tuberoinfundibular pathway). Raised by TRH, serotonin, oestrogen, suckling, stress and sleep.
- Rises sharply for about an hour after a **generalised tonic-clonic seizure**, which is why a prolactin level taken soon after an event can help separate an epileptic seizure from a functional (dissociative) one. A normal level does not rule out epilepsy.
- Causes of a high level: pregnancy and breastfeeding, **antipsychotics** (especially risperidone, paliperidone, amisulpride and haloperidol), metoclopramide, hypothyroidism, kidney failure, and a **prolactinoma** (a pituitary tumour).

:::widget decide
{
 "scene": "Ayesha, 27, in Lucknow, has taken risperidone for two years for schizophrenia. She stopped her periods eight months ago and has noticed milk from her breasts. She is too embarrassed to tell her psychiatrist and has started skipping doses.",
 "ask": "What should the team do?",
 "choices": [
  { "label": "Ask directly about periods, breasts and sexual function, check prolactin and a pregnancy test, and if raised consider switching to a prolactin-sparing antipsychotic or adding low-dose aripiprazole", "verdict": "best", "outcome": "Her prolactin is very high. After a careful switch her periods return and she takes her medicine regularly again.", "why": "D2 blockade at the pituitary removes dopamine's brake on prolactin. Asking directly prevents silent non-adherence and long-term bone loss." },
  { "label": "Tell her it is a minor side effect and she should continue", "verdict": "harm", "outcome": "She stops the medicine completely and relapses.", "why": "Ignoring a distressing side effect breaks trust and adherence." },
  { "label": "Order a pituitary MRI first", "verdict": "ok", "outcome": "The scan is normal; time and money are spent before the obvious cause is addressed.", "why": "With a known prolactin-raising medicine and a level consistent with it, imaging is usually not the first step, though it is needed if the level is very high or there are headaches or visual symptoms." }
 ]
}
:::

### Growth hormone
- Released in pulses, the **largest soon after falling asleep**, in the first period of deep (N3) sleep.
- Stimulated by GHRH, ghrelin, deep sleep, exercise, low blood sugar and **alpha-2 receptor stimulation** (clonidine); inhibited by somatostatin.
- **Psychosocial short stature** (deprivation dwarfism): severely neglected children can stop growing because growth hormone is suppressed; they grow again quickly when moved to a caring home.

### Melatonin
- Made from **serotonin** in the **pineal gland**, at night only.
- The pathway: light hits special retinal cells containing **melanopsin**, which signal the **SCN** through the retinohypothalamic tract; the SCN controls the pineal through a long route down the spinal cord and back up through sympathetic nerves.
- Suppressed most by **blue light** (short wavelengths), which is why screens at night delay sleep.
- Used for jet lag, delayed sleep phase and insomnia in older adults; medicines that act on melatonin receptors include **ramelteon** and **agomelatine** (which also blocks 5-HT2C).

:::widget guess
{
 "prompt": "Light of which colour suppresses melatonin most strongly? Pick the wavelength in nanometres (violet is about 400, red about 700).",
 "min": 380,
 "max": 720,
 "step": 10,
 "unit": "nanometres",
 "answer": [450, 490],
 "reveal": "Blue light, around 460 to 480 nanometres, the peak sensitivity of melanopsin in the retina's light-sensing ganglion cells. Phone and laptop screens are rich in blue light; warm, dim light in the evening interferes least with sleep.",
 "clinician": "These intrinsically photosensitive retinal ganglion cells survive in some people with rod and cone blindness, so some blind people still entrain to light; those without functioning ganglion cells often develop non-24-hour sleep-wake disorder, treated with timed melatonin or tasimelteon."
}
:::

### Oxytocin and vasopressin
- Both are nine-amino-acid peptides made in the **supraoptic and paraventricular nuclei** and released from the **posterior pituitary**; both also act inside the brain.
- **Oxytocin**: milk ejection ("let-down") and uterine contraction in labour; social bonding, trust and maternal behaviour.
- **Vasopressin (ADH)**: water retention by the kidneys (V2 receptors) and blood vessel tone; in the brain, social recognition and male pair-bonding in some species.
- **Prairie voles**, which pair for life, have more oxytocin receptors in the reward circuit (nucleus accumbens) and more vasopressin receptors in the ventral pallidum than promiscuous montane voles. Blocking these receptors prevents partner preference, and adding the vasopressin receptor gene to promiscuous males made them behave more like faithful ones.

:::widget sort
{
 "prompt": "Which hormone problem fits?",
 "buckets": ["Too much cortisol (Cushing's)", "Too little cortisol (Addison's)", "Too little thyroid hormone", "Too much prolactin", "Too little vasopressin action"],
 "items": [
  { "text": "Weight gain around the trunk, round face, purple stretch marks, high blood sugar and depression", "bucket": 0 },
  { "text": "Exhaustion, low mood, dark patches of skin, low blood pressure, low sodium and high potassium", "bucket": 1, "why": "Adrenal failure: autoimmune in most cases; tuberculosis of the adrenals is an important cause in India." },
  { "text": "A man on lithium for ten years passes several litres of dilute urine a day", "bucket": 4, "why": "Nephrogenic diabetes insipidus: the kidney stops responding to vasopressin." },
  { "text": "Slowed, cold, constipated and forgetful, with a hoarse voice", "bucket": 2 },
  { "text": "Breast enlargement and low sex drive in a young man on haloperidol", "bucket": 3 },
  { "text": "Euphoria, insomnia and then psychosis a few days after high-dose prednisolone", "bucket": 0 }
 ]
}
:::

### Steroid and peptide hormones work differently
| | Steroid hormones (cortisol, oestrogen, testosterone) | Peptide hormones (ACTH, insulin, oxytocin) |
|---|---|---|
| Made from | Cholesterol | Amino acids |
| Dissolve in | Fat: cross cell membranes | Water: cannot cross membranes |
| Receptor | Inside the cell; acts on genes directly | On the cell surface; acts through second messengers |
| Speed | Hours to days | Seconds to minutes |
| Travel in blood | Bound to carrier proteins | Mostly free |

Thyroid hormones are made from an amino acid but behave like steroids: they enter cells and act on nuclear receptors.

:::clinician
CRH and arginine vasopressin from parvocellular PVN neurons act synergistically on corticotrophs; chronic stress shifts the drive towards vasopressin. ACTH is cleaved from pro-opiomelanocortin, which also yields beta-endorphin and alpha-MSH (hence hyperpigmentation in Addison's disease, where high ACTH accompanies high MSH-like activity). Psychiatric features occur in roughly half to two-thirds of patients with Cushing's syndrome, mostly depression, often with irritability and cognitive problems, improving after cure. Corticosteroid-induced psychiatric reactions are dose-related: risk rises steeply above about 40 mg prednisolone daily, with mania or mixed states early and depression on withdrawal; lithium prophylaxis has some support in recurrent cases. Lithium-induced hypothyroidism occurs in a substantial minority (more in women, those with thyroid antibodies, and with longer treatment); lithium also raises calcium through parathyroid effects. Hashimoto's encephalopathy (steroid-responsive encephalopathy with autoimmune thyroiditis) can present with psychosis, confusion and myoclonus with high thyroid antibodies. Tests of each axis used in research psychiatry, including the dexamethasone suppression, TRH stimulation and clonidine growth hormone tests, are covered at the Advanced level.
:::

:::recall
1. Name the hypothalamic, pituitary and target hormones of the HPA, HPT and HPG axes. || HPA: CRH, ACTH, cortisol. HPT: TRH, TSH, T4 and T3. HPG: GnRH, LH and FSH, sex steroids.
2. Which hormones does the posterior pituitary release and where are they made? || Oxytocin and vasopressin, made in the supraoptic and paraventricular nuclei.
3. What controls prolactin, and why does a seizure matter? || Dopamine from the arcuate nucleus tonically inhibits it; it rises for about an hour after a generalised seizure.
4. Give the three stages of Selye's general adaptation syndrome. || Alarm, resistance, exhaustion.
5. What is allostatic load? || The cumulative wear and tear of repeated or chronic stress responses (McEwen and Stellar).
6. Give the products of the three adrenal cortical zones. || Glomerulosa: aldosterone; fasciculata: cortisol; reticularis: androgens.
7. When is growth hormone mainly released? || In pulses, the largest early in sleep during slow-wave sleep.
8. Which light suppresses melatonin most, and why? || Blue light around 460 to 480 nm, the peak sensitivity of melanopsin in retinal ganglion cells.
:::

:::mcq
Q: Oxytocin and vasopressin are synthesised in the ____ and released from the ____.
- Anterior pituitary; posterior pituitary
- *Supraoptic and paraventricular nuclei of the hypothalamus; posterior pituitary
- Pineal gland; anterior pituitary
- Adrenal medulla; hypothalamus
> Axons run down the pituitary stalk.

Q: The fast sympathetic-adrenal-medullary response to an acute stressor includes:
- *Adrenaline release from the adrenal medulla within seconds
- Cortisol release from the zona fasciculata within seconds
- TRH release from the pituitary
- Melatonin release from the pineal gland
> The HPA arm follows over minutes.

Q: Read the assertion and reason. Assertion (A): Antipsychotics that strongly raise prolactin can cause amenorrhoea and loss of bone density. Reason (R): Prolactin suppresses GnRH and so lowers oestrogen.
- *Both A and R are true, and R is the correct explanation of A
- Both A and R are true, but R is not the correct explanation of A
- A is true, but R is false
- A is false, but R is true
> Hypogonadism follows hyperprolactinaemia.

Q: Addison's disease is caused by:
- Excess cortisol from a pituitary tumour
- *Failure of the adrenal cortex, usually autoimmune
- Too much thyroid hormone
- A tumour of the adrenal medulla
> Low cortisol and aldosterone, high ACTH.

Q: Prairie vole studies showed that partner preference depends strongly on:
- Melatonin rhythms
- *Oxytocin and vasopressin receptors in reward areas
- Growth hormone pulses
- Thyroid hormone levels
> Receptor distribution in the nucleus accumbens and ventral pallidum.

Q: The Trier Social Stress Test raises cortisol mainly because it combines:
- Cold water and loud noise
- *Social-evaluative threat and uncontrollability
- Hunger and thirst
- Exercise and caffeine
> The two features most linked to cortisol responses.
:::
`;

export const begSleep = String.raw`
## 4.4 Sleep, EEG and evoked potentials in depth [core][beginner]
In 4.1 you met the sleep stages, the 90-minute cycle and the body clock. Now learn the brain waves themselves, how a sleep laboratory records them, the theories that explain how sleep is switched on and off, the main sleep disorders, and the brain's tiny electrical responses to single events.

### Recording the brain's electricity
Hans Berger, a German psychiatrist, recorded the first human **electroencephalogram (EEG)** in 1929; the alpha rhythm was first called the "Berger rhythm". Electrodes are placed by the international **10-20 system** (spaced at 10 and 20 per cent of the distances across the skull). The EEG records the summed slow currents of millions of cortical pyramidal cells lined up side by side, not single spikes.

| Rhythm | Frequency | Typical state |
|---|---|---|
| **Delta** | 0.5 to 4 per second | Deep N3 sleep; in an awake adult, a sign of disease (delirium, a lesion, encephalitis) |
| **Theta** | 4 to 7 per second | Drowsiness and N1; normal in children; increased in some encephalopathies |
| **Alpha** | 8 to 13 per second | Awake, relaxed, **eyes closed**, over the back of the head; disappears when the eyes open (alpha blocking) |
| **Beta** | 13 to 30 per second | Alert concentration; increased by **benzodiazepines** and barbiturates |
| **Gamma** | Above 30 per second | Linking features together in perception and attention |

:::mnemonic Slow to fast: "Do Try All Brains Gladly"
**D**elta, **T**heta, **A**lpha, **B**eta, **G**amma. Diffuse slowing (more delta and theta) in an awake confused patient is the EEG signature of **delirium**.
:::

### EEG patterns a psychiatrist should recognise by name
| Pattern | Meaning |
|---|---|
| **Diffuse slowing** | Delirium, encephalopathy, dementia; also with clozapine and lithium toxicity |
| **Three-per-second spike and wave** | Absence seizures in children, often mistaken for daydreaming or inattention |
| **Triphasic waves** | Metabolic encephalopathy, especially liver failure; also lithium toxicity |
| **Periodic sharp complexes about once a second** | Creutzfeldt-Jakob disease |
| **Periodic discharges over one temporal lobe** | Herpes simplex encephalitis |
| **Low-voltage fast activity** | Alcohol or benzodiazepine withdrawal, and benzodiazepine use |
| **Continuous seizure activity in a patient who just looks confused or catatonic** | Non-convulsive status epilepticus |

### A night in the sleep laboratory
**Polysomnography** records at least three signals to score sleep: **EEG** (brain waves), **EOG** (eye movements) and **chin EMG** (muscle tone). A full study adds breathing airflow and effort, blood oxygen, ECG and leg movements.

| Stage | EEG | Eyes and muscles | Share of a young adult's night |
|---|---|---|---|
| **Wake** | Alpha (eyes closed), beta | Blinks, high muscle tone | |
| **N1** | Theta; vertex sharp waves | Slow rolling eye movements | About 5 per cent |
| **N2** | **Sleep spindles** (bursts at about 12 to 14 per second) and **K-complexes** | Muscle tone lower | About 45 to 55 per cent |
| **N3** | **Delta** (slow waves) for at least a fifth of the time | Little movement | About 15 to 20 per cent |
| **REM** | Fast, low-voltage, like waking ("paradoxical"); sawtooth waves | **Rapid eye movements**; muscles **paralysed** except eyes and breathing | About 20 to 25 per cent |

:::widget hypnogram
{
 "caption": "Drag through the night and name the waves at each stage: theta in N1, spindles and K-complexes in N2, delta in N3, sawtooth in REM. Note when growth hormone would be released (the first N3) and when most dreams occur (REM, growing towards morning)."
}
:::

### What REM sleep is like
- Discovered in **1953** by **Eugene Aserinsky** and **Nathaniel Kleitman** in Chicago, who noticed bursts of eye movement in sleepers and found that people woken from them reported vivid dreams. William Dement went on to map the cycle.
- Features: rapid eye movements, **atonia** of most muscles, irregular heart rate and breathing, poor temperature control, penile erection and clitoral swelling, an EEG like waking, and the most vivid, story-like dreams.
- Michel Jouvet showed that the atonia is produced in the pons: cats with small pontine lesions got up and "acted out" their dreams, the animal model of **REM sleep behaviour disorder**.
- Newborns spend about **half** their sleep in REM; adults about a fifth to a quarter.

:::widget sort
{
 "prompt": "In which stage does each usually happen?",
 "buckets": ["N1", "N2", "N3", "REM"],
 "items": [
  { "text": "Sleepwalking", "bucket": 2 },
  { "text": "Night terrors with screaming and no memory next morning", "bucket": 2 },
  { "text": "Sleep spindles and K-complexes", "bucket": 1 },
  { "text": "A sudden jerk with a feeling of falling as you drift off (hypnic jerk)", "bucket": 0 },
  { "text": "Nightmares remembered in detail", "bucket": 3 },
  { "text": "Acting out a dream of being chased, in a man of 70", "bucket": 3 },
  { "text": "Most of the night's total time", "bucket": 1 },
  { "text": "The largest pulse of growth hormone", "bucket": 2 }
 ]
}
:::

### What switches sleep on and off
- **Borbély's two-process model** (1982): sleep timing depends on **Process S**, a homeostatic **sleep pressure** that builds the longer you are awake (carried partly by **adenosine**) and drains during sleep, and **Process C**, the **circadian** alerting signal from the SCN. You fall asleep easily when S is high and C has dropped.
- **The flip-flop switch** (Clifford Saper): the **ventrolateral preoptic nucleus (VLPO)** uses GABA to switch off the arousal centres (locus coeruleus, raphe, tuberomammillary nucleus), and they in turn inhibit the VLPO. Like a light switch, the brain snaps between sleep and waking instead of drifting. **Orexin** holds the switch steady on the waking side.
- **The reciprocal interaction model** of REM (Robert McCarley and Allan Hobson, 1975): **REM-on** cholinergic neurons in the pons (pedunculopontine and laterodorsal tegmental nuclei) and **REM-off** noradrenaline and serotonin neurons (locus coeruleus and raphe) inhibit each other. REM begins when the aminergic neurons fall silent and the cholinergic ones fire.

:::widget flow
{
 "title": "Borbély's two processes across a day",
 "layout": "cycle",
 "nodes": [
  { "id": "w", "label": "Waking", "detail": "Process S (sleep pressure, adenosine) climbs hour by hour." },
  { "id": "a", "label": "Afternoon dip", "detail": "Pressure is moderate and the circadian alerting signal dips slightly: the post-lunch slump." },
  { "id": "e", "label": "Evening", "detail": "The SCN's alerting signal is strongest just before usual bedtime, holding sleep off (the 'forbidden zone')." },
  { "id": "n", "label": "Night", "detail": "Melatonin rises, the circadian signal falls, and high pressure tips the VLPO switch to sleep." },
  { "id": "s", "label": "Sleep", "detail": "Pressure drains, fastest during deep N3 sleep early in the night." }
 ],
 "caption": "Press Play. Why does caffeine at 6 pm keep you awake? (It blocks adenosine, hiding Process S.)"
}
:::

### Theories of dreaming and of why we sleep
| Theory | Claim |
|---|---|
| **Wish fulfilment** (Freud) | Dreams disguise forbidden wishes (latent content behind manifest content) |
| **Activation-synthesis** (Hobson and McCarley, 1977) | The brainstem fires semi-randomly in REM and the forebrain weaves a story to fit |
| **Threat simulation** | Dreams rehearse responses to danger |
| **Restoration** | Sleep repairs tissue and replenishes energy |
| **Memory consolidation** | Slow-wave sleep replays and stores new facts; REM helps procedural and emotional memories |
| **Synaptic homeostasis** (Giulio Tononi and Chiara Cirelli) | Sleep scales down synapses strengthened during the day, saving energy and space |
| **Clearance** | The brain's fluid-clearing (glymphatic) flow increases in sleep, washing out waste such as amyloid |

:::widget guess
{
 "prompt": "Without any clocks, daylight or time cues, how long is the natural human body-clock day, in hours?",
 "min": 20,
 "max": 28,
 "step": 0.1,
 "unit": "hours",
 "answer": [24, 24.5],
 "reveal": "Slightly longer than 24 hours, about 24.2 hours on average in carefully controlled studies. Nathaniel Kleitman's month in Mammoth Cave in 1938 and later bunker studies showed that without cues the rhythm 'free-runs', so morning light is needed every day to reset it.",
 "clinician": "Early free-running studies reported periods near 25 hours because subjects controlled their own room lighting in the evening, which delayed the clock; forced desynchrony protocols give about 24.2 hours. A longer intrinsic period is associated with evening chronotype and delayed sleep phase disorder."
}
:::

### Sleep across life
- **Newborns**: 16 to 18 hours a day, about half in REM (active sleep).
- **Adolescents**: the clock shifts later (phase delay), colliding with early school and college start times.
- **Older adults**: less N3, more night waking, earlier sleep and waking (phase advance), more daytime naps.

### Sleep disorders in brief
| Group | Examples and key features |
|---|---|
| **Insomnia** | Trouble starting or staying asleep at least three nights a week for three months; CBT-I first |
| **Breathing-related** | **Obstructive sleep apnoea**: snoring, pauses in breathing, daytime sleepiness, morning headache, low mood; common with obesity and some medicines |
| **Hypersomnolence** | **Narcolepsy** (2.5); **Kleine-Levin syndrome**: episodes of very long sleep with overeating and disinhibition, mainly in adolescent boys |
| **Circadian rhythm** | Delayed sleep phase (late teenagers), advanced phase (older adults), shift work, jet lag, non-24-hour (some blind people) |
| **NREM parasomnias** | Sleepwalking, night terrors, confusional arousals: from N3, early in the night, little memory |
| **REM parasomnias** | **Nightmare disorder**, **REM sleep behaviour disorder**, recurrent **sleep paralysis** |
| **Movement** | **Restless legs syndrome**: an urge to move the legs in the evening, relieved by moving; linked to low iron; worsened by many antidepressants and antipsychotics |

:::widget decide
{
 "scene": "Mr Reddy, 52, a bus depot manager in Hyderabad, has felt low and exhausted for a year and falls asleep in meetings. His wife says he snores loudly and stops breathing for long moments at night. He weighs 104 kg. A doctor has just started him on a sedating antidepressant and a sleeping tablet.",
 "ask": "What is the most important step?",
 "choices": [
  { "label": "Arrange a sleep study for obstructive sleep apnoea and avoid sedatives until it is assessed", "verdict": "best", "outcome": "He has severe apnoea. A CPAP machine at night transforms his energy and mood within weeks.", "why": "Snoring, witnessed apnoeas and daytime sleepiness in an overweight man suggest OSA, which causes fatigue and depressive symptoms. Sedatives can worsen breathing pauses." },
  { "label": "Increase the antidepressant dose", "verdict": "harm", "outcome": "His sleepiness worsens and he nearly crashes the depot jeep.", "why": "The cause of the sleepiness is untreated and sedation adds to the danger." },
  { "label": "Advise weight loss only", "verdict": "ok", "outcome": "He loses a few kilograms over a year; symptoms persist.", "why": "Weight loss helps OSA but severe apnoea needs assessment and treatment now." }
 ]
}
:::

### Evoked and event-related potentials
Averaging the EEG over many repeats of the same event reveals tiny, time-locked waves: **event-related potentials (ERPs)**. They are named by their direction (P for positive, N for negative) and their timing in milliseconds.

| Component | When and how it is evoked | What it means | Psychiatric link |
|---|---|---|---|
| **P50** | 50 ms after the second of two clicks half a second apart | **Sensory gating**: the second response is normally much smaller | Poor suppression in schizophrenia; nicotine briefly improves it |
| **N100** | About 100 ms after a sound | Early sensory processing | Smaller in schizophrenia |
| **Mismatch negativity (MMN)** | 100 to 250 ms after an odd sound among repeated ones, even when not attending | Automatic detection of change; depends on NMDA receptors | Reduced in schizophrenia; ketamine reduces it in volunteers |
| **P300 (P3)** | About 300 ms after an attended rare target (an "oddball") | Updating attention and context | Smaller in schizophrenia, in their unaffected relatives, and in sons of fathers with alcohol use disorder |
| **N400** | About 400 ms after a word that does not fit the sentence ("I take my tea with milk and socks") | Meaning and semantic expectation | Altered in schizophrenia (loosened associations) |
| **Contingent negative variation (CNV)** | A slow negative shift between a warning signal and a target | Expectancy and preparation | Reduced in schizophrenia |
| **Error-related negativity (ERN)** | Right after making an error | Error monitoring by the anterior cingulate | **Larger in OCD** and anxious people |

Clinical **evoked potentials** test sensory pathways: a delayed **visual evoked potential** (P100) after past optic neuritis supports multiple sclerosis; brainstem auditory responses test hearing in infants.

:::widget sort
{
 "prompt": "Which ERP component?",
 "buckets": ["P50", "Mismatch negativity", "P300", "N400", "Error-related negativity"],
 "items": [
  { "text": "Rises after a rare target tone that the person was told to count", "bucket": 2 },
  { "text": "Appears when a sentence ends in an unexpected word", "bucket": 3 },
  { "text": "Normally shrinks for the second of two paired clicks", "bucket": 0 },
  { "text": "Appears to an odd tone even while the person watches a silent film", "bucket": 1 },
  { "text": "Exaggerated in a person with OCD after a mistake on a computer task", "bucket": 4 }
 ]
}
:::

:::clinician
Sleep spindles are generated by the thalamic reticular nucleus and are reduced in schizophrenia, including first-episode and unmedicated patients, correlating with impaired sleep-dependent memory consolidation. The MSLT criteria for narcolepsy are a mean sleep latency of 8 minutes or less with two or more sleep-onset REM periods (including one on the preceding night's study). Fatal familial insomnia is a prion disease (PRNP D178N with methionine at codon 129) with thalamic degeneration, loss of sleep spindles and slow waves, dysautonomia and dementia. Rechtschaffen's rats died after about two to three weeks of total sleep deprivation; Randy Gardner stayed awake for 264 hours in 1964 with cognitive and perceptual disturbance but no lasting harm. Drugs and the EEG: benzodiazepines increase beta and spindles and reduce N3; tricyclics, SSRIs, venlafaxine and MAOIs suppress REM (MAOIs most completely); trazodone and mirtazapine increase slow-wave sleep; clozapine causes dose-related EEG slowing and epileptiform discharges; lithium can cause slowing and, in toxicity, triphasic waves. In 1980 Marta Kutas and Steven Hillyard first described the N400; Henri Begleiter's 1984 report of reduced P300 in sons of alcoholic fathers made the P300 a candidate endophenotype.
:::

:::recall
1. Give the frequency bands of delta, theta, alpha and beta. || Delta 0.5 to 4, theta 4 to 7, alpha 8 to 13, beta 13 to 30 per second.
2. Which three signals are the minimum for scoring sleep stages? || EEG, EOG and chin EMG.
3. What defines N2 on the EEG? || Sleep spindles and K-complexes.
4. Who discovered REM sleep and when? || Aserinsky and Kleitman, in 1953.
5. State Borbély's two-process model. || Sleep timing depends on homeostatic sleep pressure (Process S) and the circadian signal from the SCN (Process C).
6. What is the flip-flop switch? || Mutual inhibition between the sleep-promoting VLPO and the arousal centres, stabilised by orexin.
7. What does the reciprocal interaction model say? || REM begins when aminergic REM-off neurons fall silent and cholinergic REM-on neurons in the pons fire.
8. Which ERP is smaller in schizophrenia and in sons of fathers with alcohol use disorder? || The P300.
9. Which ERP is larger in OCD? || The error-related negativity.
:::

:::mcq
Q: Sleep spindles and K-complexes are the defining EEG features of:
- N1
- *N2
- N3
- REM
> Spindles at about 12 to 14 per second.

Q: The first human EEG recordings were published in 1929 by:
- Aserinsky
- Kleitman
- *Hans Berger
- Moruzzi
> The alpha rhythm was once called the Berger rhythm.

Q: In Saper's flip-flop model, the main sleep-promoting nucleus that inhibits the arousal systems is the:
- Suprachiasmatic nucleus
- *Ventrolateral preoptic nucleus
- Locus coeruleus
- Tuberomammillary nucleus
> GABA and galanin neurons of the VLPO.

Q: Hobson and McCarley's activation-synthesis hypothesis proposed that dreams result from:
- Unconscious wishes disguised by censorship
- *The forebrain making sense of semi-random brainstem activity during REM
- Memory replay in N3 only
- Rehearsal of threats
> Activation from the pons, synthesis by the cortex.

Q: A rhythm that repeats more than once a day, such as the roughly 90-minute sleep cycle, is called:
- Circadian
- Infradian
- *Ultradian
- Circannual
> Infradian rhythms are longer than a day (for example the menstrual cycle).

Q: Mismatch negativity is reduced in schizophrenia and by ketamine, suggesting it depends on:
- Dopamine D2 receptors
- *NMDA glutamate receptors
- Histamine H1 receptors
- Melatonin receptors
> An NMDA-dependent marker of automatic change detection.
:::
`;
