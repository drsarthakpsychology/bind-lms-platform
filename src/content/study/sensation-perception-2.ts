/* Module · Sensation, attention and perception, Part II (Beginner level). Original text written for VIBHA School of Psychology. */
export const part2 = String.raw`
# Part II · Beginner: the classic science

## 2.1 Psychophysics: methods and laws [core][beginner]
Psychophysics asks one precise question: **how does the strength of experience grow as the strength of a stimulus grows?** To answer it, you first need a way to measure a threshold.

### Fechner's three classical methods
| Method | How it works | Strength | Weakness |
|---|---|---|---|
| **Method of limits** | The experimenter raises or lowers the stimulus in small steps until the person's answer changes ("yes" to "no", or the reverse) | Quick | Two errors: **habituation** (continuing to say the same answer too long) and **expectation** (changing too early); balance them with ascending and descending series |
| **Method of constant stimuli** | A fixed set of intensities is shown many times in random order; the 50 percent point is read off the curve | Most accurate; no order errors | Slow and tiring |
| **Method of adjustment** (average error) | The person turns a dial until the stimulus is just detectable, or matches a standard | Fast, engaging | Least precise; motor skill and impatience creep in |

The curve from the method of constant stimuli is the **psychometric function**: an S-shaped curve of "percent detected" against intensity. The threshold is its midpoint.

:::widget sort
{
  "prompt": "Which classical method is being used?",
  "buckets": ["Method of limits", "Method of constant stimuli", "Method of adjustment"],
  "items": [
    { "text": "An audiologist turns a tone down in 5 dB steps until the patient stops hearing it, then up again", "bucket": 0 },
    { "text": "Seven tone intensities are each played 50 times in random order", "bucket": 1 },
    { "text": "A student turns a knob until a test light matches a standard light", "bucket": 2 },
    { "text": "The experimenter alternates ascending and descending series to cancel habituation and expectation errors", "bucket": 0 },
    { "text": "The threshold is read off an S-shaped curve of percent 'yes' responses", "bucket": 1 }
  ]
}
:::

### Three laws, three shapes
**Weber's law** (1834): the difference threshold is a constant fraction of the starting intensity. Written as ΔI divided by I equals k, where ΔI is the JND, I is the starting intensity and k is the **Weber fraction**. A small fraction means a sharper sense.

| Dimension | Weber fraction (approximate) |
|---|---|
| Pitch (frequency of a tone) | 0.003 |
| Electric shock | 0.01 |
| Lifted weight | 0.02 |
| Line length | 0.03 |
| Loudness | 0.05 |
| Brightness | 0.08 |
| Salt taste | 0.08 |

Weber's law holds well in the middle range of intensities and breaks down near the absolute threshold and at very high intensities.

**Fechner's law** (1860): if every JND adds the same small step to sensation, then sensation grows with the **logarithm** of intensity: S equals k log I. Doubling intensity does not double experience; you need to multiply intensity to add equal steps. The decibel scale for sound and the magnitude scale for stars are logarithmic for this reason.

**Stevens' power law** (1957): S. S. Stevens asked people to give numbers to sensations directly (**magnitude estimation**) and found that sensation equals k times intensity raised to a power n. The exponent differs by sense:
| Dimension | Exponent | What it means |
|---|---|---|
| Brightness | about 0.33 | Grows much more slowly than intensity (compressive) |
| Loudness | about 0.67 | Compressive |
| Apparent length | about 1.0 | Grows in step with the stimulus |
| Heaviness | about 1.45 | Grows faster than the stimulus (expansive) |
| Electric shock | about 3.5 | Explodes: a small increase hurts far more |

:::widget guess
{
  "prompt": "In Stevens' experiments, by roughly how many times did the felt intensity of an electric shock grow when the current was doubled?",
  "min": 1,
  "max": 15,
  "unit": "times",
  "answer": [9, 13],
  "reveal": "About 11 times. With an exponent near 3.5, doubling the current multiplies the sensation by 2 raised to 3.5, which is about 11. For brightness (exponent about 0.33) doubling the light increases brightness by only about a quarter. Expansive exponents suit dangerous stimuli: a little more harm should feel like a lot more."
}
:::

:::widget worked
{
  "title": "Using Weber's law",
  "steps": [
    { "q": "A sweet-shop owner tasting syrup with 20 grams of sugar per litre can just tell that a batch with 21.6 grams is sweeter. What is her Weber fraction?", "a": "The JND is 21.6 minus 20, which is 1.6 grams. Divide by the standard: 1.6 divided by 20 is 0.08." },
    { "q": "With the same fraction, what is the JND for a cup with 50 grams per litre?", "a": "0.08 times 50, which is 4 grams." },
    { "q": "What does a smaller Weber fraction mean?", "a": "A more sensitive sense: a smaller proportional change can be detected." }
  ],
  "yourTurn": [
    { "q": "A listener can just detect a change from 400 Hz to 401.2 Hz. What is the Weber fraction for pitch, and what would the JND be at 2,000 Hz?", "a": "1.2 divided by 400 is 0.003. At 2,000 Hz the JND would be about 6 Hz (0.003 times 2,000). In reality the fraction for pitch rises at high frequencies, so Weber's law is only an approximation here." }
  ]
}
:::

:::clinician
Fechner's law is derived from Weber's law by assuming that every JND is a subjectively equal step; Stevens showed that assumption is often false, which is why power functions fit magnitude-estimation data better. The power law has its own critics: exponents shift with the range of stimuli presented, the first number given (the modulus) and the response scale, so modern work treats them as context-dependent. Clinically, psychophysics lives on in audiometry (thresholds in dB HL by a modified method of limits), visual field perimetry, quantitative sensory testing in neuropathy and pain clinics, and the staircase procedures used in computerised testing, which are adaptive versions of the method of limits.
:::

:::recall
1. Name Fechner's three classical methods. || Limits, constant stimuli, adjustment (average error).
2. Which method avoids habituation and expectation errors, and why? || Constant stimuli, because intensities come in random order.
3. State Fechner's law. || Sensation grows with the logarithm of stimulus intensity.
4. What is magnitude estimation, and whose law came from it? || People assign numbers to the intensity of sensations; Stevens' power law.
5. What does an exponent above 1 mean in Stevens' law? || Sensation grows faster than intensity (expansive), as for electric shock.
:::

:::mcq
Q: Which law predicts that equal ratios of stimulus intensity produce equal ratios of sensation, with the exponent varying by sense?
- Weber's law
- Fechner's law
- *Stevens' power law
- The law of specific nerve energies
> Stevens' power law relates sensation to intensity raised to a sense-specific exponent.

Q: In the method of limits, a participant keeps saying "yes, I hear it" for several steps after the tone has become inaudible. This is an error of:
- Expectation
- *Habituation
- Adjustment
- Criterion
> Persisting with the same answer is the habituation error.
:::

## 2.2 Signal detection theory [core][beginner]
Classical thresholds assume a fixed line between "detected" and "not detected". But the same person reports more detections when a miss is costly and fewer when a false alarm is costly. **Signal detection theory**, brought into psychology from radar engineering in the 1950s and 1960s by Wilson Tanner, John Swets and David Green, separates two things the threshold mixed together:
1. **Sensitivity**: how well the person can tell signal from noise. It depends on the senses and the stimulus.
2. **Response bias**, or **criterion**: how willing the person is to say "yes". It depends on expectations and on rewards and costs.

### The four outcomes
| | Says "Yes, present" | Says "No, absent" |
|---|---|---|
| **Signal present** | **Hit** | **Miss** |
| **Signal absent** | **False alarm** | **Correct rejection** |

Background **noise** (random activity in the nervous system and the environment) is always there. On each trial the observer gets an internal "evidence" value. Noise-alone trials and signal-plus-noise trials give two overlapping bell curves. The observer sets a **criterion** on this evidence: above it, say "yes".

- **d prime (d′)** measures sensitivity: the distance between the centres of the two curves, in standard-deviation units. It is calculated as the z-score of the hit rate minus the z-score of the false-alarm rate. Zero means chance; larger means better discrimination.
- **The criterion (c or beta)** measures bias. A **liberal** observer says "yes" readily: more hits but more false alarms. A **conservative** observer says "yes" rarely: fewer false alarms but more misses.

:::widget sort
{
  "prompt": "Label each outcome for a radiologist reading chest X-rays for tuberculosis.",
  "buckets": ["Hit", "Miss", "False alarm", "Correct rejection"],
  "items": [
    { "text": "TB present; she reports TB", "bucket": 0 },
    { "text": "TB present; she reports a normal film", "bucket": 1 },
    { "text": "No TB; she reports TB", "bucket": 2 },
    { "text": "No TB; she reports a normal film", "bucket": 3 },
    { "text": "A cricket umpire gives a batter out who was not out", "bucket": 2, "why": "Saying 'signal present' (out) when it was absent is a false alarm." },
    { "text": "An airport scanner operator lets a knife through", "bucket": 1 }
  ]
}
:::

### Changing the criterion, not the eyes
Payoffs and expectations move the criterion. Tell a radiologist that this hospital sees many TB cases, or that missing TB is disastrous, and she will call more films positive. Her hits rise, but so do her false alarms. Her d′ has not changed. Only better training, better images or a second reader can raise sensitivity.

:::widget decide
{
  "scene": "A district screening camp in rural Maharashtra uses a quick tuberculosis symptom check followed by a sputum test for anyone flagged. The camp coordinator wants to set the symptom-check criterion.",
  "ask": "Which criterion makes most sense for this first-stage screen?",
  "choices": [
    { "label": "A liberal criterion: flag anyone with even mild symptoms", "verdict": "best", "outcome": "More people go on to the confirmatory test. Few true cases are missed; the false alarms are sorted out by the sputum test.", "why": "In a first-stage screen, misses are costly (untreated, infectious TB) and false alarms are cheap because a second test follows. That favours a liberal criterion." },
    { "label": "A conservative criterion: flag only people with clear, severe symptoms", "verdict": "harm", "outcome": "Many early cases are sent home and keep spreading the infection.", "why": "A conservative criterion trades misses for fewer false alarms, the wrong trade when a cheap confirmatory test exists." },
    { "label": "It makes no difference; only sensitivity matters", "verdict": "ok", "outcome": "The team does not think about the trade-off and the criterion drifts.", "why": "Sensitivity matters, but where you set the criterion decides which errors you get. Both must be chosen deliberately." }
  ]
}
:::

:::widget curve
{
 "kind": "sdt",
 "title": "Move the criterion, then change d′",
 "caption": "Slide the criterion left (liberal) and right (conservative): hits and false alarms rise and fall together. Then increase d′: the curves separate, and you can have more hits with fewer false alarms. Only sensitivity changes the trade-off itself."
}
:::

### The ROC curve
Plotting hit rate against false-alarm rate as the criterion moves gives a **receiver operating characteristic (ROC) curve**. A curve hugging the diagonal means chance; a curve bowing towards the top-left corner means high sensitivity. The **area under the curve** (AUC) is used to compare diagnostic tests in medicine and psychology, from scans to suicide-risk scales.

:::widget worked
{
  "title": "Calculating d′ from a detection experiment",
  "steps": [
    { "q": "Over 100 signal trials a listener says 'yes' 84 times; over 100 noise trials she says 'yes' 16 times. What are her hit and false-alarm rates?", "a": "Hit rate 0.84; false-alarm rate 0.16." },
    { "q": "The z-score for 0.84 is about +1.0 and for 0.16 about minus 1.0. What is d′?", "a": "d′ equals z(hits) minus z(false alarms): 1.0 minus (minus 1.0), which is about 2.0. Good sensitivity." },
    { "q": "Is she biased? (Hint: compare misses and false alarms.)", "a": "Misses (16) equal false alarms (16), so her criterion is neutral, halfway between the two curves." }
  ],
  "yourTurn": [
    { "q": "A second listener has a hit rate of 0.98 and a false-alarm rate of 0.50. The z-scores are about +2.0 and 0. What is his d′, and what kind of criterion does he have?", "a": "d′ is about 2.0, the same sensitivity as the first listener. But he says 'yes' to half of the noise trials, so his criterion is liberal. Same ears, different willingness to say yes." }
  ]
}
:::

:::clinician
In the equal-variance Gaussian model, d′ equals z(H) minus z(FA), and the criterion c equals minus half of z(H) plus z(FA); negative c is liberal. Beta is the likelihood ratio of the two distributions at the criterion. When variances are unequal (common in recognition memory), the z-ROC slope departs from 1 and the area measure Az is preferred. SDT applies far beyond perception: recognition memory (old/new judgments, the "remember/know" debate), eyewitness line-ups (lineup ROC analysis now favours simultaneous over sequential lineups for discriminability), and psychopathology, where Bentall and Slade (1985) found hallucination-prone students showed a more liberal bias for "hearing" a voice in noise without differing in sensitivity.
:::

:::recall
1. What two things does signal detection theory separate? || Sensitivity (d′) and response bias (criterion).
2. Name the four outcomes. || Hit, miss, false alarm, correct rejection.
3. How is d′ calculated? || z-score of the hit rate minus z-score of the false-alarm rate.
4. What does a liberal criterion do to hits and false alarms? || Raises both.
5. What does an ROC curve plot? || Hit rate against false-alarm rate as the criterion changes.
:::

:::mcq
Q: Two security staff are equally good at spotting weapons, but one flags many more harmless bags. In signal detection terms they differ in:
- d′
- Absolute threshold
- *Criterion
- Weber fraction
> Equal sensitivity, different willingness to say yes: a criterion difference.

Q: An observer with a hit rate of 0.50 and a false-alarm rate of 0.50 has:
- *A d′ of zero, meaning chance performance
- High sensitivity and a liberal bias
- A conservative criterion
- A d′ of 1
> Equal hit and false-alarm rates mean the observer cannot tell signal from noise.
:::

## 2.3 Vision and colour [core][beginner]
Light enters through the **cornea**, passes the **pupil** (sized by the iris), is focused by the **lens** (whose changing shape is **accommodation**) and lands on the **retina**. The image is inverted; the brain does not "turn it back", it simply uses the map.

### Rods and cones
| | Rods | Cones |
|---|---|---|
| Number | About 120 million | About 6 million |
| Where | Mostly the periphery; none in the fovea | Packed in the **fovea**, the centre of sharp vision |
| Light needed | Very little: night vision | Bright light: day vision |
| Colour | No | Yes, three types |
| Detail | Low (many rods pool onto one ganglion cell) | High (fovea cones have nearly private lines) |

The **blind spot** is where the optic nerve leaves the eye: no receptors at all. You never notice it because the other eye covers it and the brain fills in.

### Dark adaptation
Walk from a sunny street into a cinema and you are nearly blind; slowly the seats appear. Cones adapt first and quickly, then reach their limit; rods adapt more slowly but become far more sensitive. The bend in the curve where rods take over is the **rod-cone break**.

:::widget guess
{
  "prompt": "After entering a completely dark room, roughly how long does it take for your eyes to reach close to full sensitivity?",
  "min": 1,
  "max": 60,
  "unit": "minutes",
  "answer": [20, 40],
  "reveal": "About 20 to 30 minutes, sometimes longer. Cones finish adapting in the first several minutes; the rod system keeps improving for the next 20 minutes or so. Red light preserves dark adaptation, because rods are insensitive to long wavelengths, which is why ships' bridges and observatories use it."
}
:::

### From retina to cortex
Signals pass from receptors to **bipolar cells** to **ganglion cells**, whose axons form the optic nerve. At the **optic chiasm**, fibres from the inner (nasal) half of each retina cross, so each hemisphere sees the opposite half of the visual field. The **lateral geniculate nucleus** of the thalamus relays to the **primary visual cortex** (V1) in the occipital lobe.

David Hubel and Torsten Wiesel (Nobel Prize 1981) recorded single cells in cat and monkey cortex and found **feature detectors**: **simple cells** fire to a bar of a particular orientation at a particular place; **complex cells** to that orientation anywhere in a region, often moving; **hypercomplex** (end-stopped) cells to bars of a particular length or corners. Beyond V1, two broad streams emerge:
- **Ventral stream** ("what"), to the temporal lobe: recognising objects and faces.
- **Dorsal stream** ("where" or "how"), to the parietal lobe: location, motion and guiding action.

:::widget flow
{
 "title": "The visual pathway",
 "layout": "chain",
 "nodes": [
  {
   "id": "ret",
   "label": "Retina",
   "detail": "Rods and cones transduce light; bipolar and ganglion cells begin processing contrast and colour."
  },
  {
   "id": "on",
   "label": "Optic nerve",
   "detail": "The axons of ganglion cells leave the eye at the blind spot."
  },
  {
   "id": "ch",
   "label": "Optic chiasm",
   "detail": "Fibres from the nasal half of each retina cross, so each hemisphere receives the opposite half of the visual field."
  },
  {
   "id": "lgn",
   "label": "Lateral geniculate nucleus",
   "detail": "The thalamic relay for vision, organised in layers that keep the two eyes separate."
  },
  {
   "id": "v1",
   "label": "Primary visual cortex (V1)",
   "detail": "Simple and complex cells detect orientation, edges and movement."
  },
  {
   "id": "str",
   "label": "Two streams",
   "detail": "Ventral stream to the temporal lobe: what an object is. Dorsal stream to the parietal lobe: where it is and how to act on it."
  }
 ],
 "caption": "Play it through. A lesion at each step gives a different pattern of visual loss."
}
:::

### Colour vision: two theories, both right
- **Trichromatic theory** (Young, 1802; Helmholtz, 1850s): three kinds of cone, most sensitive to short (about 420 nm, "blue"), medium (about 530 nm, "green") and long (about 560 nm, "red") wavelengths. Every colour is a pattern across the three. This explains colour matching with three primaries and most colour deficiency.
- **Opponent-process theory** (Hering, 1878): colour is coded in opposing pairs, **red versus green**, **blue versus yellow** and **black versus white**. This explains **negative afterimages** (stare at red, then a white wall looks green), why nobody sees a "reddish green", and some patterns of colour deficiency.
- **Dual-process theory** (Hurvich and Jameson, 1957): trichromatic coding at the cones, opponent coding in ganglion cells and the thalamus.

:::widget reveal
{
  "prompt": "Stare for 30 seconds at the centre of an Indian flag printed in the 'wrong' colours: blue on top, black in the middle and red at the bottom. Then look at a white wall. What do you predict, and which theory does it support?",
  "answer": "A faint flag in roughly the right colours: the blue stripe leaves a yellow-orange (saffron-like) afterimage, the black leaves white, and the red leaves green. Cells in each opponent pair that were driven hard for 30 seconds are fatigued, so their partner dominates when you look at white. This is the opponent-process theory at work."
}
:::

### Colour deficiency
Most colour deficiency is inherited on the X chromosome, so it is far commoner in males. **Red-green deficiency** (protan or deutan) is the usual type, found in about 8 percent of men of North European ancestry and in a few percent of Indian men in school surveys; it is rare in women. **Monochromacy** (no colour at all) is very rare. The **Ishihara plates** screen for red-green deficiency. A colour-deficient student will struggle with any chart that uses colour alone, which is why good teaching materials always add labels, patterns or icons.

:::clinician
Anomalous trichromacy (a shifted M or L cone pigment) is far commoner than dichromacy. Tritan (blue-yellow) defects are usually acquired, for example from glaucoma, diabetic retinopathy or toxic optic neuropathy, so a new blue-yellow defect warrants an eye examination. Cerebral achromatopsia follows bilateral damage to the ventral occipito-temporal region (area V4 complex); the person may see the world in shades of grey with intact acuity. Hydroxychloroquine and ethambutol (widely used in India for TB) can cause acquired colour vision defects, which is why ethambutol prescribing includes colour-vision checks.
:::

:::recall
1. Contrast rods and cones on number, location, light needed and colour. || Rods: about 120 million, periphery, dim light, no colour. Cones: about 6 million, fovea, bright light, colour.
2. What is the rod-cone break? || The bend in the dark-adaptation curve where rods take over from cones.
3. What did Hubel and Wiesel discover? || Feature-detecting cells in visual cortex: simple, complex and hypercomplex.
4. What do the ventral and dorsal streams do? || Ventral, to temporal lobe: what an object is. Dorsal, to parietal lobe: where it is and how to act on it.
5. Which colour theory explains negative afterimages? || Opponent-process theory.
:::

:::mcq
Q: Which observation is best explained by the opponent-process theory rather than the trichromatic theory?
- Any colour can be matched by mixing three primary lights
- There are three types of cone
- Colour vision fades in dim light, when only rods work
- *After staring at yellow, a white surface looks bluish
> Afterimages in the opposing colour support opponent coding.

Q: A patient recovering from a stroke can see objects but cannot reach accurately for them. The damage most likely involves the:
- Ventral stream in the temporal lobe
- Optic chiasm
- *Dorsal stream in the parietal lobe
- Lateral geniculate nucleus only
> The dorsal stream guides location and action.
:::

## 2.4 Hearing and the other senses [core][beginner]
### Sound and the ear
Sound is a pressure wave. Its **frequency** (cycles per second, hertz) is heard as **pitch**; its **amplitude** (measured in decibels, a logarithmic scale) as **loudness**; its mix of frequencies as **timbre**, which is why a sitar and a guitar playing the same note sound different. Young humans hear about **20 to 20,000 Hz**; the upper limit falls with age (presbycusis).

The outer ear funnels sound to the **eardrum**; three tiny bones of the middle ear (**malleus, incus, stapes**) amplify it into the **cochlea**. Inside, the **basilar membrane** vibrates and **hair cells** on it transduce the motion into signals in the auditory nerve.

:::widget flow
{
 "title": "How sound becomes hearing",
 "layout": "chain",
 "nodes": [
  {
   "id": "pin",
   "label": "Outer ear",
   "detail": "The pinna funnels sound waves down the ear canal; its folds also help tell front from back."
  },
  {
   "id": "drum",
   "label": "Eardrum",
   "detail": "Vibrates in step with the pressure wave."
  },
  {
   "id": "oss",
   "label": "Middle-ear bones",
   "detail": "Malleus, incus and stapes amplify the vibration onto the small oval window of the cochlea."
  },
  {
   "id": "coch",
   "label": "Cochlea",
   "detail": "Fluid waves travel along the basilar membrane; high frequencies peak near the base, low near the apex."
  },
  {
   "id": "hair",
   "label": "Hair cells",
   "detail": "Bending of their tips opens channels: this is transduction. Loud noise damages them for good."
  },
  {
   "id": "ac",
   "label": "Auditory cortex",
   "detail": "Via the brainstem and thalamus to the temporal lobe, where pitch maps are laid out in order."
  }
 ],
 "caption": "Tap each part to see its job."
}
:::

### How pitch is coded
| Theory | Claim | Best for |
|---|---|---|
| **Place theory** (Helmholtz; von Békésy, Nobel 1961) | Different frequencies make different places on the basilar membrane vibrate most: high near the base, low near the apex | High frequencies |
| **Frequency (temporal) theory** (Rutherford, 1886) | The auditory nerve fires at the same rate as the sound wave | Low frequencies, up to about 1,000 Hz (a neuron cannot fire faster) |
| **Volley principle** (Wever and Bray, 1937) | Groups of neurons take turns firing, so together they track frequencies up to about 4,000 to 5,000 Hz | The middle range |

Modern view: all three work together. Low tones use timing, high tones use place, and the middle range uses both.

### Locating sound
The brain compares the two ears. A sound on your right reaches the right ear **slightly earlier** (interaural time difference, best for low frequencies) and **louder**, because the head casts a "sound shadow" (interaural level difference, best for high frequencies). Sounds directly ahead or behind are hardest to place, which is why we tilt or turn our heads.

:::widget decide
{
  "scene": "Ramesh, 42, has worked for 18 years in a textile mill in Surat without ear protection. He says he can hear people fine in quiet rooms but cannot follow conversation at family gatherings. His audiogram shows a dip in hearing at about 4,000 Hz in both ears.",
  "ask": "What is the most likely explanation?",
  "choices": [
    { "label": "Noise-induced hearing loss: hair cells in the region of the cochlea tuned to around 4,000 Hz have been damaged", "verdict": "best", "outcome": "He is referred for hearing aids and the mill is asked to provide ear protection to all workers.", "why": "Chronic loud noise characteristically damages the hair cells coding around 4 kHz, giving a 'notch' on the audiogram. Speech in noise suffers first. Damaged hair cells do not regrow." },
    { "label": "Normal ageing; nothing to do", "verdict": "harm", "outcome": "His hearing worsens and he begins to withdraw from social life.", "why": "Age-related loss usually slopes down at the highest frequencies rather than notching at 4 kHz, and he is only 42. Hearing loss in mid-life is also a modifiable risk factor for later dementia." },
    { "label": "He is not paying attention; it is psychological", "verdict": "harm", "outcome": "He feels dismissed and stops seeking help.", "why": "Difficulty in noisy places with a 4 kHz notch is a classic physical finding. Attention matters, but rule out the ear first." }
  ]
}
:::

### The chemical senses
- **Taste** (gustation): five basic tastes, **sweet, sour, salty, bitter and umami** (savoury, identified by Kikunae Ikeda in 1908 from kombu broth). Most of what we call "taste" is actually smell; hold your nose and a mango and a guava taste alike.
- **Smell** (olfaction): humans have about 400 kinds of functional olfactory receptor. Smell signals go straight to the olfactory cortex and amygdala, skipping the thalamus, which helps explain why smells (agarbatti, wet earth after the first monsoon rain) bring back memories and feelings so strongly. Loss of smell can be an early sign of Parkinson's disease and of some viral infections.

### The body senses
- **Touch** has separate receptors for pressure, vibration, temperature and pain.
- **Kinaesthesis** (proprioception) tells you where your limbs are, from receptors in muscles, tendons and joints.
- **The vestibular sense**, in the inner ear: the **semicircular canals** detect head rotation; the **otolith organs** (utricle and saccule) detect gravity and straight-line acceleration. **Motion sickness** on a winding ghat road is thought to come from conflict between what the eyes and the vestibular system report.

:::widget sort
{
  "prompt": "Which sense system is doing the work?",
  "buckets": ["Vestibular", "Kinaesthesis", "Smell", "Taste"],
  "items": [
    { "text": "Feeling dizzy after spinning on a playground roundabout", "bucket": 0, "why": "Fluid in the semicircular canals keeps moving after the spin stops." },
    { "text": "Touching your nose with your eyes closed", "bucket": 1 },
    { "text": "The first rain on dry earth brings back a childhood memory", "bucket": 2 },
    { "text": "Knowing the lift has started going up without looking", "bucket": 0, "why": "The otolith organs detect straight-line acceleration." },
    { "text": "A dancer knowing exactly where her raised arm is in a Bharatanatyam pose", "bucket": 1 },
    { "text": "Detecting the savoury note in a tomato rasam", "bucket": 3, "why": "Umami, from glutamate in tomatoes, is one of the five basic tastes." }
  ]
}
:::

### Pain and the gate
Ronald Melzack and Patrick Wall's **gate control theory** (1965) proposed a "gate" in the dorsal horn of the spinal cord. Signals in thin pain fibres open it; signals in thick touch fibres (rubbing a bumped elbow) partly close it; and messages descending from the brain (attention, mood, expectation) can open or close it too. This explained why soldiers sometimes feel little pain from serious wounds and why anxiety worsens pain. **Phantom limb pain**, felt in a limb that has been removed, shows that pain lives in the brain's body map. V. S. Ramachandran's **mirror box**, which shows the person a reflection of the intact limb in place of the missing one, relieved phantom pain in some patients.

:::recall
1. What are the physical bases of pitch, loudness and timbre? || Frequency, amplitude and the mix of frequencies.
2. Which pitch theory explains low and which high frequencies? || Frequency (temporal) theory for low; place theory for high; the volley principle for the middle.
3. Name two cues for locating sound. || Interaural time difference and interaural level difference.
4. Name the five basic tastes. || Sweet, sour, salty, bitter, umami.
5. Summarise gate control theory. || A spinal gate modulates pain: small fibres open it, large touch fibres and descending brain signals can close it.
:::

:::mcq
Q: Which theory best explains how we hear a 15,000 Hz tone?
- Frequency theory
- *Place theory
- Volley principle
- Opponent-process theory
> No neuron or volley can follow 15,000 Hz; the place of maximal vibration codes it.

Q: Rubbing your shin after banging it reduces the pain. According to gate control theory this is because:
- The vestibular system is activated
- Pain receptors adapt immediately
- Endorphins are released from the shin
- *Large touch fibres help close the spinal gate
> Activity in large-diameter fibres inhibits transmission of pain at the dorsal horn.
:::

## 2.5 Selective attention: where is the filter? [core][beginner]
If we cannot process everything, something must choose. The classic debate is about **where** in the stream of processing the selection happens: early (before meaning is extracted) or late (after).

### The method: dichotic listening and shadowing
Cherry (1953) played two different messages, one to each ear, through headphones, and asked people to **shadow** (repeat aloud) one message. Afterwards they knew almost nothing about the unattended ear: not its language, not whether it was played backwards. They did notice physical changes, such as a switch from a male to a female voice or a pure tone.

### Broadbent's filter model (1958): early selection
Donald Broadbent proposed that all input enters a brief **sensory buffer**, then a **selective filter** lets through one channel, chosen on **physical features** (ear, pitch, location), into a limited-capacity channel where meaning is processed. Unattended messages are blocked before meaning. In his **split-span** experiment, people heard digit pairs in the two ears (for example 7 left with 3 right, then 4 left with 9 right) and preferred to recall ear by ear rather than pair by pair.

:::widget guess
{
  "prompt": "Neville Moray (1959) slipped each participant's own name into the ear they were told to ignore. What percentage of people noticed their name?",
  "min": 0,
  "max": 100,
  "unit": "%",
  "answer": [25, 40],
  "reveal": "About a third. That is too many for a filter that blocks all meaning, yet far from everyone. It suggested that some unattended input is processed for meaning, at least for highly important words.",
  "clinician": "Later replications found the same rate of about a third, and a 2001 study found that people with low working-memory span noticed their name far more often (about 65 percent) than high-span people (about 20 percent), suggesting the cocktail-party effect partly reflects lapses of attentional control rather than deep unattended processing."
}
:::

:::widget flow
{
 "title": "Broadbent's filter model (early selection)",
 "layout": "chain",
 "nodes": [
  {
   "id": "in",
   "label": "Both ears' input",
   "detail": "Two messages arrive at once, one in each ear."
  },
  {
   "id": "buf",
   "label": "Sensory buffer",
   "detail": "Holds everything briefly, before meaning is extracted."
  },
  {
   "id": "fil",
   "label": "Selective filter",
   "detail": "Lets through one channel, chosen by physical features such as ear, pitch or location. The rest is blocked."
  },
  {
   "id": "cap",
   "label": "Limited-capacity channel",
   "detail": "Only the selected message is analysed for meaning here."
  },
  {
   "id": "out",
   "label": "Memory and response",
   "detail": "What you can report afterwards: almost nothing of the unattended ear."
  }
 ],
 "edgeLabels": {
  "buf>fil": "everything",
  "fil>cap": "one channel only"
 },
 "caption": "Compare this with Treisman's model below: the filter becomes a volume knob."
}
:::

### Problems for an early filter
- **Moray (1959)**: about a third noticed their own name.
- **Gray and Wedderburn (1960)**: with "Dear 7 Jane" in one ear and "9 Aunt 6" in the other, people reported "Dear Aunt Jane": they grouped by **meaning**, across ears.
- **Treisman (1960)**: when a story switched from the shadowed ear to the unattended ear, people briefly followed it into the "wrong" ear.
- **Corteen and Wood (1972)**: city names previously paired with mild shock produced a skin-conductance response when played to the unattended ear, even without awareness.

### Treisman's attenuation model (1964)
Anne Treisman kept the filter early but made it a volume knob rather than a switch. Unattended messages are **attenuated** (turned down), not blocked. In a **mental dictionary**, each word has a threshold for recognition. Important words (your name, "fire", "help") have permanently low thresholds, so even a weakened signal can trigger them. Context can lower thresholds temporarily, which explains Treisman's ear-switching result.

:::widget flow
{
 "title": "Treisman's attenuation model",
 "layout": "chain",
 "nodes": [
  {
   "id": "in",
   "label": "Both ears' input",
   "detail": "Two messages arrive at once."
  },
  {
   "id": "att",
   "label": "Attenuator",
   "detail": "The unattended message is turned down, not switched off."
  },
  {
   "id": "dic",
   "label": "Mental dictionary",
   "detail": "Each word has a recognition threshold. Your name, 'help' and 'fire' have permanently low thresholds; context lowers others for a moment."
  },
  {
   "id": "aw",
   "label": "Awareness",
   "detail": "Attended words, plus any weakened words strong enough to cross their threshold, reach awareness."
  }
 ],
 "edgeLabels": {
  "att>dic": "attended at full strength, unattended weakened"
 },
 "caption": "This is why about a third of people hear their own name in the ignored ear."
}
:::

### Late selection: Deutsch and Deutsch (1963); Norman (1968)
J. A. Deutsch and Diana Deutsch argued that **all** inputs are analysed for meaning, and selection happens late, just before response and memory, based on **importance**. Donald Norman added that both the input's strength and its relevance (pertinence) decide what is selected.

:::widget sort
{
  "prompt": "Which model fits each statement?",
  "buckets": ["Broadbent: early filter", "Treisman: attenuation", "Deutsch and Deutsch: late selection"],
  "items": [
    { "text": "Unattended input is blocked before any meaning is extracted", "bucket": 0 },
    { "text": "Unattended input is weakened, and words with low thresholds can still break through", "bucket": 1 },
    { "text": "Every input is analysed for meaning; selection happens just before response", "bucket": 2 },
    { "text": "Selection is based on physical features such as which ear", "bucket": 0 },
    { "text": "A 'dictionary' of word thresholds, lowered by importance and context", "bucket": 1 },
    { "text": "Selection is based on the importance of the input, after full analysis", "bucket": 2 }
  ]
}
:::

### Flexible selection and perceptual load
Johnston and Heinz (1978) argued that selection can be **early or late, as the task demands**: later selection is possible but costs more capacity. Nilli Lavie's **load theory** (1995) gave a modern answer: when the main task is **perceptually demanding** (high load), there is no spare capacity, so distractors are not processed (early selection). When the task is easy (low load), spare capacity spills over to distractors (late selection). A student copying a dense table is not distracted by the TV; one copying a single line is.

:::clinician
The early-versus-late debate is now largely seen as a false choice: event-related potentials show attention modulating sensory responses within 100 ms (the N1 and P1 enhancements, supporting early effects), while semantic priming from unattended words shows some late processing. Load theory distinguishes perceptual load (which reduces distractor processing) from cognitive or working-memory load (which *increases* distractor interference, because control is weakened). This distinction matters clinically: anxious and ADHD patients often struggle more under cognitive load, and training approaches that simply "add difficulty" can backfire.
:::

:::recall
1. What is shadowing? || Repeating aloud one message in dichotic listening, to control which ear is attended.
2. What did Broadbent's split-span task show? || People prefer to recall ear by ear, supporting selection by physical channel.
3. How does Treisman's model differ from Broadbent's? || Unattended input is attenuated, not blocked; important words with low thresholds can break through.
4. What did Gray and Wedderburn show? || People grouped words by meaning across ears ("Dear Aunt Jane"), against a purely physical filter.
5. State Lavie's load theory. || High perceptual load leaves no capacity for distractors (early selection); low load lets them be processed.
:::

:::mcq
Q: Participants shadowing one ear report "Dear Aunt Jane" when the words were split across both ears. This finding most directly challenges:
- *Broadbent's filter model
- Treisman's attenuation model
- Lavie's load theory
- Late selection theory
> Grouping by meaning across ears contradicts a filter that blocks unattended meaning.

Q: In Treisman's model, why does your own name break through from an unattended ear?
- It is processed by a separate pathway
- All words are fully processed
- The filter switches to meaning when you are bored
- *It has a permanently low threshold in the mental dictionary
> Important words need only a weak signal to be recognised.
:::

## 2.6 Capacity, automaticity and searching [core][beginner]
### Kahneman's capacity model (1973)
Daniel Kahneman described attention as a single pool of **mental effort** that can be shared among tasks. How much is available depends on **arousal**; how it is spent depends on an **allocation policy** shaped by enduring dispositions (sudden movement and your name grab attention), momentary intentions (the task you chose) and an evaluation of demands. Two tasks interfere when together they demand more than the pool holds.

Christopher Wickens' **multiple resource theory** refined this: there are partly separate pools for **visual and auditory input**, for **spatial and verbal codes**, and for **manual and vocal responses**. Listening to a podcast while walking interferes little; reading a message while driving (both visual-spatial) interferes a lot.

### Automatic and controlled processing
Walter Schneider and Richard Shiffrin (1977) separated:
- **Controlled processing**: slow, effortful, serial, limited by capacity, flexible. A new driver changing gear.
- **Automatic processing**: fast, effortless, parallel, hard to stop, built by long consistent practice. An experienced driver changing gear while talking.

The **Stroop effect** (J. R. Stroop, 1935) shows that reading is automatic: naming the ink colour of the word RED printed in green is slower and more error-prone than naming the ink of a row of XXXX.

:::widget decide
{
  "scene": "A clinical psychology trainee in Bengaluru wants a quick bedside task to test whether a patient can override an automatic response. She has a Hindi-speaking patient who reads Devanagari fluently.",
  "ask": "Which task fits best?",
  "choices": [
    { "label": "A Stroop task with colour words printed in Devanagari in mismatching inks", "verdict": "best", "outcome": "The patient is slow and error-prone on mismatching items, giving a measure of response inhibition.", "why": "The Stroop effect depends on reading being automatic in that script. Using the patient's fluent script keeps the interference real." },
    { "label": "A Stroop task with English colour words, which the patient reads slowly", "verdict": "ok", "outcome": "Interference is small, and the trainee wrongly concludes inhibition is excellent.", "why": "If reading is not automatic, there is little to inhibit. Stroop interference shrinks for less fluent readers and scripts." },
    { "label": "Asking the patient to count backwards from 100", "verdict": "ok", "outcome": "Useful for working memory, but it does not test overriding a prepotent response.", "why": "Serial subtraction taps concentration and working memory, not inhibition of an automatic habit." }
  ]
}
:::

### Orienting: the spotlight moves
Michael Posner's **cueing paradigm** (1980) asked people to respond to a target on the left or right after a cue. A **valid cue** (pointing to where the target appears) speeds responses; an **invalid cue** slows them. Attention can be moved:
- **Exogenously** (reflexively), by a sudden flash or sound at a location: fast, automatic.
- **Endogenously** (voluntarily), by a central arrow or instruction: slower, under control.
Attention can shift without moving the eyes (**covert attention**). After a reflexive cue, there is a short boost, then slower responses to that same spot, called **inhibition of return**, which pushes search on to new places.

### Searching: feature integration theory
Anne Treisman and Garry Gelade (1980) asked people to find a target among distractors.
- In **feature search** (a red letter among green ones), the target **pops out**; time barely changes with the number of distractors. Features are registered in parallel, pre-attentively.
- In **conjunction search** (a red T among red Xs and green Ts), each item must be checked; time rises steeply with the number of distractors. **Focused attention is the glue** that binds features into objects.

:::widget flow
{
 "title": "Feature integration theory in two stages",
 "layout": "chain",
 "nodes": [
  {
   "id": "sc",
   "label": "The scene",
   "detail": "A red T among red Xs and green Ts."
  },
  {
   "id": "fm",
   "label": "Feature maps (parallel)",
   "detail": "Colour, orientation, size and movement are registered everywhere at once, without attention. A single odd feature pops out here."
  },
  {
   "id": "fa",
   "label": "Focused attention (serial)",
   "detail": "The spotlight visits one location at a time and glues that location's features together."
  },
  {
   "id": "obj",
   "label": "Bound object",
   "detail": "Only now do you see 'a red T'. Without attention, features can recombine wrongly: illusory conjunctions."
  }
 ],
 "caption": "Pop-out happens at the second step; conjunction search needs the third."
}
:::

When attention is overloaded, features can bind wrongly, producing **illusory conjunctions**: briefly shown a red X and a blue O, people sometimes report a blue X.

:::widget guess
{
  "prompt": "In Mackworth's 'clock test' (1948), radar operators watched a pointer for a rare double jump over two hours. When did their detection rate drop clearly?",
  "min": 5,
  "max": 120,
  "step": 5,
  "unit": "minutes",
  "answer": [20, 35],
  "reveal": "Within the first half hour. Detection then stayed low. This vigilance decrement is why air traffic controllers, CCTV monitors and ICU staff work in shifts with breaks, and why long, uneventful watches are risky.",
  "clinician": "The vigilance decrement is driven by both sensitivity loss (especially at high event rates and with memory load) and a conservative criterion shift as signals prove rare. The Continuous Performance Test (first devised in the 1950s) and the Digit Vigilance Test in the NIMHANS neuropsychological battery are clinical descendants of this paradigm."
}
:::

:::recall
1. What are the two main parts of Kahneman's capacity model? || A limited pool of effort, set by arousal, and an allocation policy that shares it among tasks.
2. Contrast automatic and controlled processing. || Automatic: fast, effortless, parallel, hard to stop. Controlled: slow, effortful, serial, flexible.
3. What does the Stroop effect show? || That reading is automatic and interferes with naming ink colour.
4. Contrast exogenous and endogenous orienting. || Exogenous: reflexive, captured by sudden events. Endogenous: voluntary, guided by goals or symbols.
5. In feature integration theory, what is the role of attention? || To bind separate features into a single object.
:::

:::mcq
Q: Finding a single red flower among many yellow ones is quick no matter how many yellow flowers there are. This is:
- Conjunction search
- Inhibition of return
- *Pop-out in feature search
- An illusory conjunction
> A single distinctive feature pops out in parallel.

Q: Listening to music while jogging interferes less than texting while driving. Which theory explains this best?
- *Wickens' multiple resources
- Broadbent's filter model
- Feature integration theory
- Signal detection theory
> Tasks using different modalities and codes draw on partly separate resources.
:::

## 2.7 Recognising patterns, objects and faces [core][beginner]
You recognise the letter A in hundreds of fonts and handwriting styles, and your friend's face in any light. How?

### Four theories of pattern recognition
| Theory | Claim | Problem or evidence |
|---|---|---|
| **Template matching** | Input is compared with stored exact copies | Cannot cope with endless variation in size, angle and style; works only in machines reading fixed fonts (cheque numbers) |
| **Feature analysis** | Patterns are broken into features (lines, angles, curves) that are then combined | Selfridge's **Pandemonium** model (1959): image demons, feature demons, cognitive demons that "shout" for their letter, and a decision demon. Supported by Hubel and Wiesel's feature detectors and by visual search |
| **Prototype** | Input is matched to an average, best example of a category | Posner and Keele (1968): after learning distorted dot patterns, people "recognised" the never-seen prototype |
| **Recognition by components** (Biederman, 1987) | Objects are built from about 36 simple 3D shapes called **geons** (cylinders, cones, blocks) | Objects remain recognisable when many lines are deleted, as long as the joints between geons survive |

:::widget flow
{
 "title": "Four theories of pattern recognition",
 "layout": "tree",
 "nodes": [
  {
   "id": "root",
   "label": "How do we recognise a pattern?"
  },
  {
   "id": "tm",
   "label": "Template matching",
   "parent": "root",
   "detail": "Compare with exact stored copies. Fails with variation; fine for machine-read cheque numbers."
  },
  {
   "id": "fa",
   "label": "Feature analysis",
   "parent": "root",
   "detail": "Detect lines and angles, then combine them (Selfridge's Pandemonium)."
  },
  {
   "id": "pr",
   "label": "Prototype matching",
   "parent": "root",
   "detail": "Compare with a stored average or best example."
  },
  {
   "id": "rbc",
   "label": "Recognition by components",
   "parent": "root",
   "detail": "Break objects into about 36 simple 3D parts called geons."
  }
 ],
 "caption": "Tap a branch for the claim and its main problem."
}
:::

### Context helps: the word superiority effect
A letter is identified more accurately inside a real word (the K in WORK) than alone or in a non-word (Reicher, 1969). Knowledge of words feeds back to help letter detection, a clear case of top-down processing.

:::widget reveal
{
  "prompt": "THE CHT: in many handwritten notes the middle letter of both words is the same ambiguous shape, halfway between H and A. Why do readers see 'THE CAT'?",
  "answer": "Context. Each word activates its likely letters, and the ambiguous shape is resolved differently in each slot. Selfridge used this very example. It shows that recognition is not purely bottom-up."
}
:::

### Faces are special
- Faces are recognised **holistically**, as a whole configuration, more than objects are. Turning a face upside down harms recognition much more than turning a house upside down (the **face inversion effect**, Yin, 1969). In the **Thatcher illusion**, grotesquely inverted eyes and mouth go almost unnoticed until the face is turned upright.
- The **fusiform face area** in the temporal lobe responds strongly to faces (identified with brain imaging by Nancy Kanwisher in 1997).
- **Prosopagnosia** is an inability to recognise faces, despite normal vision and intellect. It can follow damage to the fusiform region or be developmental (present from birth in about 2 percent of people). People recognise others by voice, gait or clothing.

:::widget decide
{
  "scene": "Leela, 68, a retired teacher in Pune, had a stroke three months ago. Her family say she “doesn't know us any more”. In clinic she names a watch, a pen and keys immediately, describes her son's shirt correctly, and recognises him the moment he speaks.",
  "ask": "What is the best working description?",
  "choices": [
    { "label": "She has dementia and has forgotten her family", "verdict": "harm", "outcome": "The family is told to plan for decline, and grieves needlessly.", "why": "She recognises her son instantly by voice and names objects, so knowledge of people is intact. The problem is specific to faces." },
    { "label": "Acquired prosopagnosia: face recognition is lost, but object recognition and knowledge of people are spared", "verdict": "best", "outcome": "The family learns to say their names as they greet her, and she is relieved to understand what is happening.", "why": "Recognition through voice with intact object naming points to a face-specific deficit, typically after damage to the fusiform region." },
    { "label": "She is depressed and not making an effort", "verdict": "ok", "outcome": "Depression after stroke is common and worth screening for, but it does not explain the pattern.", "why": "Low mood does not selectively abolish face recognition while sparing voice recognition." }
  ]
}
:::

:::recall
1. Why does template matching fail as a general theory? || It cannot handle the endless variation in size, angle and form of real patterns.
2. Describe Selfridge's Pandemonium. || Image demons record input; feature demons detect features; cognitive demons shout for their pattern; a decision demon picks the loudest.
3. What are geons? || The roughly 36 basic 3D components in Biederman's recognition-by-components theory.
4. What is the word superiority effect? || Letters are identified better within real words than alone.
5. What is the face inversion effect? || Inverting faces impairs recognition far more than inverting other objects.
:::

:::mcq
Q: People shown only distorted versions of a dot pattern later confidently "recognise" the undistorted original they never saw. This supports:
- Template theory
- *Prototype theory
- Recognition by components
- Gate control theory
> An abstracted average (prototype) is stored and matched.
:::

## 2.8 Depth, movement, constancy and illusions [core][beginner]
### Depth cues in full
| Type | Cue | How it works |
|---|---|---|
| Monocular, pictorial | **Interposition** (occlusion) | A nearer object blocks part of a farther one |
| | **Relative size** | Of two similar objects, the smaller image is farther |
| | **Familiar size** | Known sizes (a car, a person) give distance |
| | **Linear perspective** | Parallel lines converge with distance (railway tracks) |
| | **Texture gradient** | Texture becomes finer and denser with distance (a field of wheat) |
| | **Aerial (atmospheric) perspective** | Far objects look hazy and bluish (the Western Ghats from a distance) |
| | **Relative height** | Objects nearer the horizon look farther |
| | **Shading and shadow** | Light usually comes from above, so shading shows bumps and dents |
| Monocular, movement | **Motion parallax** | From a moving train, near poles race past while far hills drift slowly |
| Oculomotor | **Accommodation** | The lens changes shape for near objects (weak, short range) |
| | **Convergence** | The eyes turn inwards for near objects (short range) |
| Binocular | **Retinal (binocular) disparity** | Each eye sees a slightly different image; the difference gives **stereopsis**, the vivid depth of 3D films |

:::widget sort
{
  "prompt": "Monocular or binocular?",
  "buckets": ["Monocular (one eye is enough)", "Binocular (needs both eyes)"],
  "items": [
    { "text": "Parallel railway lines meeting at the horizon", "bucket": 0 },
    { "text": "The slightly different views of the two eyes", "bucket": 1 },
    { "text": "Near electric poles flashing past a train window while hills move slowly", "bucket": 0, "why": "Motion parallax works with one eye; it needs movement, not two eyes." },
    { "text": "Eyes turning inwards to look at a needle you are threading", "bucket": 1 },
    { "text": "Distant mountains looking hazy and blue", "bucket": 0 },
    { "text": "A nearer bus hiding part of a farther auto-rickshaw", "bucket": 0 }
  ]
}
:::

### Is depth perception learned or inborn?
Eleanor Gibson and Richard Walk (1960) built the **visual cliff**: a glass table with a checkerboard pattern directly under the glass on one side (shallow) and several feet below the glass on the other (deep). Mothers called their crawling infants from across the "cliff".

:::widget guess
{
  "prompt": "Of 36 infants aged 6 to 14 months who were called by their mothers, how many crawled onto the glass over the deep side?",
  "min": 0,
  "max": 36,
  "unit": "infants",
  "answer": [2, 4],
  "reveal": "Only 3. Of 27 who moved at all, nearly all crawled to their mothers over the shallow side and avoided the deep side, many crying. Newborn animals that walk at birth (chicks, kids, lambs) also avoided it at once. So depth perception is present early.",
  "clinician": "Crawling infants had already had months of visual experience, so the study cannot show depth perception is innate in humans. Campos and colleagues (1970s) found that pre-crawling infants placed over the deep side showed heart-rate *slowing* (interest, a sign they perceive the difference), whereas fear (heart-rate acceleration) appeared only after crawling experience. Perceiving depth comes early; fearing heights needs self-produced movement."
}
:::

### Seeing movement
- **Real motion** is detected by specialised cells, especially in area **MT (V5)**. Damage there causes **akinetopsia**: the world appears as a series of still frames (patient L. M., Zihl and colleagues, 1983).
- **Stroboscopic motion** and the **phi phenomenon** (Wertheimer, 1912): lights flashing on and off in sequence look like one light moving. This founded Gestalt psychology. Diwali chaser lights, LED scrolling boards and film itself rely on it.
- **Autokinetic effect**: a still point of light in a dark room seems to wander. Muzafer Sherif used it to study how group norms form.
- **Induced motion**: the moon seems to race when clouds drift past it; your stationary train seems to move when the train beside it pulls out.
- **Motion aftereffect** (the waterfall illusion): after staring at a waterfall, the rocks beside it seem to drift upwards.

### Constancies
| Constancy | What stays the same | Despite |
|---|---|---|
| **Size** | Perceived size | A shrinking image as the object moves away |
| **Shape** | Perceived shape | The changing image as the object rotates (an opening door) |
| **Lightness** (brightness) | Perceived whiteness or blackness | Changes in illumination (coal in sunlight still looks black) |
| **Colour** | Perceived colour | Changes in the colour of the light (a banana is yellow under tube light and at sunset) |

Size constancy depends on judging distance. **Emmert's law**: an afterimage looks larger when you look at a far wall than at your hand, because the same retinal image is "scaled" by the perceived distance.

### Illusions worth knowing
- **Müller-Lyer** (1889): equal lines with outward fins look longer than with inward fins.
- **Ponzo**: two equal bars between converging lines; the upper one (seen as farther) looks bigger.
- **Ebbinghaus** (Titchener circles): a circle surrounded by big circles looks smaller than an equal one surrounded by small circles.
- **Ames room**: a distorted room that looks rectangular from one peephole; people in the far corner look tiny.
- **Moon illusion**: the moon looks bigger near the horizon than high in the sky, though its image is the same. One explanation: the horizon moon seems farther (the terrain gives distance cues), so size constancy enlarges it.
- **Ambiguous figures** (Necker cube, Rubin's vase, the old woman and young woman): one stimulus, two perceptions that flip.
- **Impossible figures** (the Penrose triangle): locally sensible, globally impossible.

:::recall
1. Name five monocular depth cues. || Interposition, relative size, linear perspective, texture gradient, aerial perspective (also relative height, shading, motion parallax).
2. What did the visual cliff show, and what can it not show? || Crawling infants avoid an apparent drop, so depth is perceived early; it cannot show innateness because they already had visual experience.
3. What is the phi phenomenon? || Apparent movement from lights flashing in sequence (Wertheimer, 1912).
4. State Emmert's law. || An afterimage's perceived size grows with the perceived distance of the surface it is projected on.
5. Give one explanation of the moon illusion. || The horizon moon seems farther, so size constancy makes it look larger.
:::

:::mcq
Q: A child in a moving car notices that nearby trees rush past while distant temples seem to move slowly in the same direction as the car. This depth cue is:
- Retinal disparity
- Linear perspective
- *Motion parallax
- Accommodation
> Near objects sweep past quickly and far ones slowly as the observer moves.

Q: Muzafer Sherif's classic study of group norm formation used which perceptual phenomenon?
- The phi phenomenon
- *The autokinetic effect
- Induced motion
- The motion aftereffect
> A still light in the dark appears to move, and groups converged on shared estimates.
:::

## 2.9 Level check · Beginner [core][beginner]
Score 80 percent or more to open the Advanced level.

:::mcq
Q: Which classical psychophysical method is most accurate but slowest?
- *Method of constant stimuli
- Method of adjustment (average error)
- Method of limits
- Magnitude estimation of sensations
> Random presentation of fixed intensities many times gives the best estimate.

Q: Fechner's law states that sensation:
- Is proportional to intensity
- Is unaffected by intensity
- Grows with intensity raised to a power
- *Grows with the logarithm of intensity
> Equal JNDs add equal sensation steps, giving a logarithmic law.

Q: Which Stevens exponent indicates the most expansive growth of sensation?
- Brightness, about 0.33
- *Electric shock, about 3.5
- Line length, about 1.0
- Loudness, about 0.67
> Exponents above 1 are expansive; 3.5 is the steepest of these.

Q: In signal detection theory, d′ reflects:
- *How far apart the noise and signal curves are
- The observer's willingness to say yes
- The intensity detected on half of all trials
- The number of hits, ignoring the false alarms
> d′ is sensitivity.

Q: A doctor reading mammograms is told that missing a cancer is far worse than a false alarm. Her likely change is:
- A higher d′, because she now looks harder
- No change, because payoffs do not affect detection
- A more conservative criterion, with fewer false alarms
- *A more liberal criterion, with more hits and more false alarms
> Payoffs shift the criterion, not sensitivity.

Q: The volley principle explains how pitch is coded for:
- Only very high frequencies, above about 10,000 Hz
- *Mid-range frequencies beyond the firing limit of single neurons
- Very low frequencies below the range of human hearing
- Timbre, the mixture of frequencies, rather than pitch
> Groups of neurons firing in turn can follow frequencies up to about 4 to 5 kHz.

Q: Which theory holds that unattended messages are weakened rather than blocked?
- Broadbent's filter model
- Deutsch and Deutsch's late selection
- *Treisman's attenuation model
- Kahneman's capacity model
> Attenuation turns down the unattended channel.

Q: Late-selection theory places the selection of information:
- At the sensory buffer, on physical features
- *After meaning is analysed, before response
- Before any meaning has been extracted
- In the retina and other receptor organs
> All inputs are analysed for meaning; importance decides what reaches response and memory.

Q: According to load theory, a distractor is least likely to be processed when:
- The main task is easy and leaves capacity free
- Working memory is heavily loaded at the time
- *The main task has high perceptual load
- The distractor is very familiar to the person
> High perceptual load uses up capacity, so distractors are not perceived.

Q: In feature integration theory, a conjunction search is slow because:
- *Focused attention must bind features object by object
- Single features cannot be detected before attention
- The target pops out but must then be checked
- Inhibition of return blocks the target location
> Binding needs serial attention.

Q: Naming the ink colour of the word "BLUE" printed in red is slow. This is the:
- Word superiority effect
- Attentional blink
- Cocktail party effect
- *Stroop effect
> Automatic reading interferes with colour naming.

Q: Selfridge's Pandemonium is an example of which approach to pattern recognition?
- Template matching
- *Feature analysis
- Prototype matching
- Direct perception
> Feature demons detect lines and angles that are combined into letters.

Q: Which depth cue is binocular?
- Texture gradient
- Interposition
- *Retinal disparity
- Relative height
> Disparity compares the two eyes' images.

Q: Gibson and Walk's visual cliff showed that:
- Depth perception is entirely learned through crawling
- Infants cannot perceive depth before 18 months
- Animals and humans differ completely
- *Most crawling infants avoid an apparent drop
> Most infants refused to cross the deep side.

Q: A white shirt looks white both in bright sun and in shade. This is:
- *Lightness constancy
- Shape constancy
- Size constancy
- Colour afterimage
> Perceived lightness stays stable across illumination.
:::
`;
