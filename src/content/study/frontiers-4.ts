/* Module · What's new in psychiatry, Part V continued (Q&A bank: Advanced). Original text written for VIBHA School of Psychology. */
export const part4 = String.raw`
## 5.3 Q&A bank · Advanced [core][advanced]
These questions are at postgraduate, RCI and doctoral level. They ask you to weigh evidence, reason about causation and design better studies.

:::qa Critically evaluate the inflammatory hypothesis of depression. Is inflammation a cause, a consequence or a marker? [advanced]
### Short answer
The evidence supports inflammation as a **causal contributor in a subgroup** of people with depression, alongside reverse causation and confounding in others. It is best seen as one **pathway**, not a general theory of depression.

### Evidence for a causal role
| Type of evidence | Finding | Strength |
|---|---|---|
| Experimental induction | Interferon-alpha therapy causes depressive symptoms in a substantial minority; typhoid vaccine and endotoxin cause transient low mood and anhedonia in volunteers | Strong for short-term causation |
| Prospective cohorts | Higher IL-6 in childhood predicts later depression and psychosis in birth cohorts | Moderate |
| Mendelian randomisation | Genetic variants that raise IL-6 signalling are associated with higher depression risk in some analyses | Moderate, sensitive to assumptions |
| Treatment trials | Anti-cytokine antibodies help only those with raised CRP; anti-inflammatory add-ons give mixed results | Weak to moderate |

### Evidence for reverse causation and confounding
1. **Depression raises inflammation**: poor sleep, inactivity, smoking, overeating and stress hormones all increase inflammatory markers.
2. **Obesity** is a strong confounder: adipose tissue produces IL-6; much of the CRP link shrinks after adjusting for BMI.
3. **Childhood adversity** raises both inflammation and depression risk.
4. **Medical illness** causes both.

### Bradford Hill-style appraisal
| Criterion | Assessment |
|---|---|
| Strength | Small average differences |
| Consistency | Consistent across meta-analyses |
| Temporality | Supported by some cohorts |
| Dose-response | Some evidence: higher CRP, more somatic and anhedonic symptoms |
| Experiment | Interferon and endotoxin studies support causation |
| Specificity | Weak: inflammation is raised in many disorders |
| Plausibility | Mechanisms (kynurenine pathway, reduced dopamine, microglia) are plausible |

### Conclusion and implications
Inflammation is a **causal pathway in a subgroup**, perhaps marked by raised CRP, fatigue, appetite change and anhedonia. The research priority is **stratified trials**: select patients by inflammatory markers, then test targeted treatments. Until then, no anti-inflammatory treatment should be used routinely for depression.
:::

:::qa Outline the assessment of suspected autoimmune psychosis, step by step, and explain the reasoning at each step. [advanced]
### Step 1: recognise red flags
In a patient with new psychosis, suspect an autoimmune cause if there is:
- rapid progression over days to weeks,
- seizures, abnormal movements (orofacial dyskinesia, chorea), catatonia,
- decreased level of consciousness or marked confusion,
- autonomic instability (fluctuating pulse and blood pressure, fever),
- severe intolerance of antipsychotics (rigidity, high CK),
- focal neurological signs, hyponatraemia, a recent viral illness, or a known tumour,
- headache or new-onset severe sleep disturbance.

### Step 2: categorise by consensus criteria
Expert criteria published in 2020 classify **possible**, **probable** and **definite** autoimmune psychosis, based on red flags plus test findings. Definite requires antibodies in **cerebrospinal fluid**.

### Step 3: investigations
| Test | What you look for | Why |
|---|---|---|
| MRI brain | Inflammation in the medial temporal lobes, other lesions | Supports encephalitis; excludes structural causes |
| EEG | Slowing, epileptic activity, "extreme delta brush" pattern | Common in NMDA receptor encephalitis |
| Lumbar puncture | Raised white cells, protein, oligoclonal bands; **CSF antibodies** | CSF testing is more sensitive and specific than serum for NMDA receptor antibodies |
| Serum antibodies | NMDA receptor, LGI1, CASPR2, AMPA, GABA-B and others | Screening; serum-only positives need caution |
| Tumour search | Pelvic ultrasound or MRI for ovarian teratoma; other cancer screening as indicated | Removal of the tumour is part of treatment |
| Other | Infection screen, thyroid antibodies, autoimmune screen, metabolic tests | Wider differential |

### Step 4: treat early
First-line immunotherapy (steroids, IV immunoglobulin or plasma exchange), tumour removal, and second-line agents if response is poor. Early treatment improves outcome.

### Step 5: psychiatric management during treatment
- Use antipsychotics cautiously, if at all, at low doses; benzodiazepines for catatonia and agitation.
- Watch for neuroleptic malignant syndrome.
- Close liaison between psychiatry, neurology and intensive care.

### Exam point
Most first-episode psychosis is **not** autoimmune. The skill lies in recognising when the picture does not fit a primary psychiatric illness.
:::

:::qa Twin studies suggest schizophrenia is about 80% heritable, yet common genetic variants explain far less. Explain the "missing heritability" problem. [advanced]
### Short answer
Twin heritability estimates the share of variation explained by **all** genetic differences. Genome-wide association studies (GWAS) measure only **common variants on the chip**. The gap comes from **rare variants**, **variants not well tagged**, **gene-environment interplay**, **non-additive effects** and possibly **inflated twin estimates**.

### The numbers, roughly
| Estimate | Schizophrenia |
|---|---|
| Twin heritability | About 80% |
| SNP-based heritability (all common variants together) | About a quarter |
| Variance explained by a polygenic score in European samples | A few percent to about 7% of liability |

### Explanations
1. **Rare variants** with larger effects (copy number variants such as the 22q11.2 deletion, rare damaging mutations in genes such as SETD1A) are not captured by common-variant arrays.
2. **Imperfect tagging**: some causal variants are poorly correlated with the measured markers.
3. **Non-additive genetic effects** (interactions between genes) inflate twin estimates relative to additive SNP estimates.
4. **Gene-environment correlation and interaction**: genetic risk may shape exposures (for example cannabis use), and effects may depend on environment.
5. **Twin assumptions**: the equal environments assumption may not hold fully; identical twins may share more environment.
6. **Limited samples**: the more people studied, the more variants found. GWAS sample sizes keep rising.

### Architecture: polygenic and perhaps "omnigenic"
- Hundreds of loci, each with tiny effects, converge on **synaptic** and neuronal genes.
- The "omnigenic" idea proposes that, because cellular networks are interconnected, almost every gene expressed in relevant cells contributes a little.

### Implications
- There is no single gene test for schizophrenia.
- Risk is **probabilistic**; family history remains a stronger clinical predictor than any score.
- Genetic findings point to biology (synapses, immune genes such as complement C4) more than to individual prediction.
:::

:::qa Discuss the scientific and ethical problems of polygenic risk scores, with attention to people of South Asian ancestry. [advanced]
### Scientific problems
| Problem | Explanation |
|---|---|
| Low individual predictive value | Scores shift group risk but classify individuals poorly; most people in the top risk band never develop the disorder |
| Ancestry bias | Most GWAS samples are of European ancestry; linkage patterns and allele frequencies differ, so scores lose accuracy in South Asian, African and other populations |
| Indian diversity | Indian populations have deep internal genetic structure (shaped by history and endogamy); a single "South Asian" score may not transfer across communities |
| Pleiotropy | The same variants raise risk for several conditions, so a "schizophrenia score" is not specific |
| Environmental confounding | Scores partly capture family environment and social position (indirect genetic effects) |
| Changing estimates | Scores change as GWAS grow, so a person's "risk" can be revised |

### Ethical problems
1. **Determinism and stigma**: a "high risk" label may change how a young person is treated by family, school or marriage prospects, an especially sensitive issue in arranged-marriage contexts.
2. **Embryo selection**: companies offer polygenic embryo screening. Expected gains are tiny, risks of misleading couples are high, and it raises eugenic concerns.
3. **Commercial testing** without counselling.
4. **Equity**: scores work best for the populations already best served by research, widening global inequality.
5. **Data protection**: genetic data are sensitive personal data under India's Digital Personal Data Protection Act 2023; misuse by insurers or employers is a real concern.

### What would improve the situation
- Large, well-consented Indian and South Asian genetic studies with community engagement.
- Methods that combine data across ancestries.
- Clear guidance that scores are for **research**, not clinical prediction, at present.
- Genetic counselling standards for any clinical use.
:::

:::qa A 35-year-old on escitalopram has severe nausea and QT prolongation at a low dose, while her sister had no response at full doses. Explain how CYP2C19 and CYP2D6 genotypes could explain this, and what you would do. [advanced]
### Short answer
Escitalopram is broken down mainly by **CYP2C19**. A **poor metaboliser** builds up high blood levels at a normal dose (side effects, QT prolongation); an **ultrarapid metaboliser** clears the drug fast (low levels, no response). Genotyping can guide dose or drug choice in exactly these situations.

### Metaboliser phenotypes
| Phenotype | Enzyme activity | Effect for a drug cleared by that enzyme |
|---|---|---|
| Poor | Little or none | High levels, more side effects |
| Intermediate | Reduced | Somewhat higher levels |
| Normal | Usual | Usual dose works as expected |
| Rapid or ultrarapid | Increased | Low levels, risk of non-response |

### Applying it
1. **Patient**: severe side effects at a low dose suggest **CYP2C19 poor metaboliser** status. Guideline-based advice for poor metabolisers is to use a **lower dose** (roughly half) or choose a drug less dependent on CYP2C19, such as sertraline (with care) or a drug cleared mainly by other routes.
2. **Sister**: no response at full doses with no side effects may suggest **ultrarapid** CYP2C19 status, poor adherence or true non-response. If ultrarapid, guidelines suggest an alternative not mainly metabolised by CYP2C19.
3. **CYP2D6** matters more for drugs such as fluoxetine, paroxetine, venlafaxine, vortioxetine, many tricyclics and some antipsychotics (aripiprazole, risperidone).

### Phenoconversion
Genotype is not the whole story. **Inhibiting drugs** can turn a normal metaboliser into a functional poor one:
- **Fluoxetine and paroxetine** strongly inhibit CYP2D6.
- **Fluvoxamine** inhibits CYP1A2 and CYP2C19.
- **Omeprazole** inhibits CYP2C19.
Always review the full medication list.

### Practical steps
1. Check adherence, interacting drugs and an ECG where QT is a concern.
2. Measure a drug level if available.
3. Consider genotyping CYP2C19 (and CYP2D6 if relevant drugs are planned).
4. Adjust using published gene-drug guidelines.

### Indian context
Allele frequencies vary between Indian populations; CYP2C19 poor metaboliser alleles are relatively common in South Asians, which makes this test more relevant here than in some other populations.
:::

:::qa Critically compare the epistemology of DSM, RDoC and HiTOP. What does each assume about the nature of mental disorder? [advanced]
### Short answer
**DSM/ICD** is a **pragmatic, consensus-based** classification built from clinical description. **RDoC** is **bottom-up**, assuming that disorders are best understood as dysfunctions of **neural systems**. **HiTOP** is **empirical and descriptive**, deriving structure from **statistical covariation of symptoms**. Each makes different assumptions, and each has distinctive weaknesses.

### Comparison of assumptions
| Feature | DSM/ICD | RDoC | HiTOP |
|---|---|---|---|
| Unit of analysis | Diagnostic categories | Functional domains across levels (genes to behaviour) | Dimensions at several levels of a hierarchy |
| Method | Expert committees, field trials | Research framework built from neuroscience | Factor analysis and related models of symptom data |
| View of disorder | Practical kinds, defined by criteria | Brain-circuit dysfunctions; mental terms ultimately reducible | Continuous dimensions; disorder as extreme position |
| Strength | Shared language; legal and clinical use; reliability with training | Links to biology; encourages transdiagnostic research | Explains comorbidity; better reliability and validity of dimensions |
| Weakness | Comorbidity, heterogeneity, arbitrary thresholds; limited validity | Reductionism; weak links to clinical phenomena; little clinical utility so far | Structure depends on what is measured and how; dimensions do not explain causes; the general factor is hard to interpret |

### Deeper critiques
1. **Reification**: treating DSM categories as natural kinds, or HiTOP factors as real entities, confuses a model with reality.
2. **The p factor debate**: it may reflect a shared vulnerability, general impairment, negative emotionality, or statistical artefacts such as rater effects.
3. **Reductionism in RDoC**: psychological explanation (meaning, culture, context) may not reduce to circuits; critics argue for multiple levels of explanation rather than a privileged biological level.
4. **Culture**: all three were built mainly from Western data; idioms of distress (somatic presentations in India, for example) may cluster differently.

### A synthesis
- Clinically, categories are needed for **communication, law and services** (the MHCA 2017 requires recognised diagnostic standards).
- Dimensions add **severity and profile**, already used in ICD-11 personality disorder.
- RDoC-style research may eventually explain **mechanisms** within or across dimensions.
"Categories for communication, dimensions for description, mechanisms for explanation" captures the current state.
:::

:::qa What is the network theory of psychopathology, and how does it differ from the latent-variable view behind both DSM and HiTOP? [advanced]
### Short answer
The **latent-variable** view assumes that symptoms co-occur because they share an underlying cause (the disorder or dimension). The **network** view proposes that symptoms **cause each other directly**, and that a disorder is a **self-sustaining cluster** of interacting symptoms rather than a hidden entity.

### The two models
| Feature | Latent-variable model | Network model |
|---|---|---|
| Why symptoms correlate | A common cause (for example, "depression") | Direct causal links between symptoms (insomnia causes fatigue, which causes poor concentration, which causes guilt) |
| What a disorder is | The latent cause | A stable state of a strongly connected network |
| Comorbidity | Overlapping latent factors | "Bridge symptoms" link clusters (for example, sleep disturbance links anxiety and depression) |
| Treatment target | The underlying cause | The most central or bridging symptoms |
| Method | Factor analysis | Network estimation (partial correlations), time-series data |

### Example
In a network of depression symptoms, **insomnia** may be central: it feeds fatigue, irritability and concentration problems. Treating insomnia might weaken the whole network more than treating guilt would.

### Strengths
1. Explains why disorders can be **self-maintaining** after the trigger is gone.
2. Fits clinical intuition about **vicious cycles**.
3. Offers a way to think about **early warning signals** (rising connectivity before a relapse).

### Weaknesses
1. Most networks are estimated from **cross-sectional** data, which cannot show direction of causation.
2. Results can be **unstable** across samples.
3. Centrality measures may not predict treatment response.
4. Latent and network models can produce **similar data**, so fit alone may not settle which is true.

### Exam conclusion
Network and latent-variable views need not be rivals: a disorder might involve a shared vulnerability **and** symptom-to-symptom feedback loops.
:::

:::qa Explain reinforcement-learning models in computational psychiatry with a worked numerical example, and show how they have been applied to depression and addiction. [advanced]
### The core model
A simple learning rule, close to the Rescorla-Wagner rule, updates the expected value V of a choice after each outcome R:

**V new = V old + alpha × (R minus V old)**

- **R minus V old** is the **prediction error**: how much better or worse the outcome was than expected.
- **alpha** is the **learning rate**: how much each error changes the expectation.

### A worked example
A student expects a value of 0.5 from attending a club (on a scale of 0 to 1). She goes and has a great time (R = 1).

| Person | alpha | Prediction error | Update | New V |
|---|---|---|---|---|
| Typical learner | 0.3 | 1 minus 0.5 = 0.5 | 0.3 × 0.5 = 0.15 | 0.65 |
| Blunted reward learning | 0.1 | 0.5 | 0.1 × 0.5 = 0.05 | 0.55 |

After three good experiences:
- Typical learner: 0.5, then 0.65, then 0.755, then about 0.83.
- Blunted learner: 0.5, then 0.55, then 0.595, then about 0.64.

The person with a low reward learning rate stays **less motivated** to go, even after the same good experiences: a computational picture of **anhedonia**.

### Applications
| Condition | Model finding | Interpretation |
|---|---|---|
| Depression | Reduced learning from rewards, or reduced sensitivity to reward size | Anhedonia; less approach behaviour |
| Anxiety | Higher learning rates for negative outcomes, poor adjustment to volatility | Over-reaction to threat; intolerance of uncertainty |
| Addiction | Drug cues gain excessive value; a shift from goal-directed (model-based) to habitual (model-free) control | Compulsive use despite known harms |
| OCD | Weakened model-based control; over-reliance on habits | Rituals continue even when their purpose is gone |
| Psychosis | Aberrant prediction errors to irrelevant stimuli | Aberrant salience, leading towards delusions |

### Critical points
- Model parameters often have **poor test-retest reliability**, which limits their use as individual markers.
- Different models can fit the same data equally well.
- Group differences are often small and overlapping.

### Status
Research only. The value so far is **explanatory**: precise, testable accounts of how symptoms could arise.
:::

:::qa Evaluate the predictive-processing and aberrant-salience accounts of psychosis. [advanced]
### The two accounts
1. **Aberrant salience** (proposed in the early 2000s): in psychosis, dysregulated dopamine release assigns **importance to irrelevant events**. Delusions are the person's attempt to explain why ordinary things feel significant; hallucinations arise when inner experiences gain abnormal salience.
2. **Predictive processing**: the brain constantly predicts input and updates beliefs using **precision-weighted prediction errors**. Psychosis may involve **too much precision on sensory errors** (the world seems strange and full of meaning) or **too much precision on prior beliefs** (hallucinations: strong expectations override input).

### Evidence for
| Finding | Fit |
|---|---|
| Increased presynaptic dopamine synthesis capacity in the striatum in psychosis and in people at high risk who convert | Supports dopamine's role in salience |
| Amphetamine (dopamine release) can induce psychosis; D2 blockers reduce positive symptoms | Fits aberrant salience |
| Ketamine (NMDA block) induces psychosis-like experiences and alters prediction-error signals in healthy volunteers | Fits predictive models, linking glutamate and dopamine |
| Reduced mismatch negativity (an EEG marker of prediction error) in schizophrenia | Fits altered prediction-error processing |
| People who hear voices show stronger effects of prior expectation in conditioned hallucination tasks | Fits "strong priors" for hallucinations |

### Evidence against or limitations
1. **Flexibility**: predictive models can explain both too much and too little precision, so critics argue they risk being unfalsifiable.
2. **Negative and cognitive symptoms** are poorly explained.
3. **Specificity**: similar alterations appear in other conditions.
4. **Phenomenology**: patients' delusions have personal and social content that formal models do not capture.

### Clinical relevance
These models support **explaining psychosis to patients** in non-stigmatising terms ("your brain flagged ordinary things as important") and fit CBT for psychosis, which works on how people make sense of anomalous experiences.

### Conclusion
Both accounts are **productive research frameworks** that link neurochemistry with experience. Neither is yet a validated clinical tool, and claims must be stated so that evidence could count against them.
:::

:::qa A team reports a machine-learning model that predicts antidepressant response with 85% accuracy. Write a checklist for judging this claim. [advanced]
### Short answer
Ask how the model was **built**, **validated**, **calibrated** and **compared**, and whether it would help **real decisions**. High accuracy in the development data is common and often misleading.

### The checklist
| Question | Why it matters |
|---|---|
| 1. What was the sample size relative to the number of predictors? | Many predictors and few patients cause **overfitting** |
| 2. Was there **data leakage**? (for example, using information collected after treatment began, or normalising using the whole dataset) | Leakage inflates accuracy |
| 3. How was it validated: internal cross-validation only, or **external validation** at a different site? | Models often fail at new sites |
| 4. What is the **base rate** of response? | If 60% respond anyway, "always predict response" is 60% accurate |
| 5. What are sensitivity, specificity, and the **balanced accuracy** or AUC? | Accuracy alone hides poor performance on the smaller class |
| 6. Is the model **calibrated**? | A predicted 70% should mean about 70% actually respond |
| 7. Does it beat a **simple model** (age, severity, previous response)? | Complexity must add value |
| 8. Does it work across **subgroups** (gender, age, ancestry, region)? | Bias can harm groups under-represented in training data |
| 9. Is the code and model **available** for others to test? | Transparency allows replication |
| 10. Has it been tested **prospectively**, ideally in a trial where clinicians using it are compared with those who do not? | The real question is whether it improves outcomes |

### A worked illustration
Suppose 60% of patients respond. A model correctly identifies 90% of responders (sensitivity) but only 40% of non-responders (specificity).
- Accuracy = 0.6 × 0.9 + 0.4 × 0.4 = 0.54 + 0.16 = **0.70**.
- Balanced accuracy = (0.9 + 0.4) divided by 2 = **0.65**.
- Most of the "accuracy" comes from the base rate.

### Link to the module
The 2024 multi-trial study described in 3.4 is the cautionary tale: models that performed well within one trial were at chance across other trials.
:::

:::qa Discuss the ethical and legal issues of digital phenotyping in India. [advanced]
### What digital phenotyping collects
Passive data from phones and wearables: location, movement, calls and messages (metadata), typing speed, app use, sleep, voice features. Active data: brief mood surveys.

### Ethical issues
| Issue | Why it matters in India |
|---|---|
| **Consent** | Must be informed, specific and ongoing. Low digital literacy and shared family phones complicate it |
| **Privacy and inference** | Location and messaging patterns can reveal relationships, religion, caste-linked residence, sexuality or political activity |
| **Data security** | Mental health data are highly stigmatising if leaked |
| **Coercion** | Employers, colleges or families might push monitoring |
| **Equity** | Many people lack smartphones or data; models built on urban, English-speaking users may not work for others |
| **Accuracy and false alarms** | A false "relapse warning" may cause alarm or unwanted intervention; a missed warning gives false reassurance |
| **Clinical responsibility** | If data show risk at 2 a.m., who is expected to respond? |

### Legal framework
1. **Digital Personal Data Protection Act 2023**: requires a lawful purpose, notice, consent, data minimisation and security; gives rights to access, correction and erasure.
2. **Mental Healthcare Act 2017**: confidentiality of information about mental health (with limited exceptions) and the right to access one's records.
3. **Medical Devices Rules 2017**: software intended for diagnosis or treatment may be regulated as a medical device.
4. **Telemedicine Practice Guidelines (2020)**: standards for remote consultations.

### Good practice for a research study
- Collect the **minimum** data needed; process on the device where possible.
- Plain-language consent in the participant's language, with easy withdrawal.
- Clear escalation protocols and their limits explained in advance.
- Ethics committee review with data-protection expertise.
- Test the model in **diverse Indian groups** before any clinical use.
:::

:::qa How would you evaluate whether an AI chatbot is safe and effective for people with depression? Propose an evaluation framework. [advanced]
### Short answer
Evaluate it like any health intervention, **plus** the risks unique to generative AI: unpredictable outputs, sycophancy, invented facts and failures in crisis. Evidence should build in **stages**, from safety testing to randomised trials with active controls.

### A staged framework
| Stage | Questions | Methods |
|---|---|---|
| 1. Design and scope | Who is it for? What does it claim to do? What is out of scope (crisis, psychosis, minors)? | Intended-use statement; risk classification |
| 2. Safety testing before use | How does it respond to suicidal statements, abuse disclosures, delusions, eating-disorder content, requests for medical advice? | Structured adversarial testing by clinicians, including in Indian languages and code-mixed speech |
| 3. Clinical quality | Are responses accurate, evidence-based and culturally appropriate? Does it encourage dependence or isolation? | Expert rating of transcripts against standards |
| 4. Feasibility and acceptability | Do people use it? Who drops out? | Pilot studies |
| 5. Efficacy | Does it reduce symptoms compared with a **credible control** (an established digital CBT programme, not just waitlist)? | Randomised trials, pre-registered |
| 6. Effectiveness and harms | Does it work in real settings? Any increase in crises, delayed care or harmful advice? | Pragmatic trials, monitoring, incident reporting |
| 7. Equity | Does it work across languages, ages, genders and literacy levels? | Subgroup analyses |
| 8. Governance | Data protection, human oversight, escalation to human care, version control (models change) | Audits, regulatory review |

### Why waitlist controls are not enough
People on a waitlist get nothing; any engaging activity may beat that. The useful question is whether the chatbot is at least as good as **existing, cheaper, validated** options.

### The version problem
Generative models are updated frequently. A trial of one version may not apply to the next. Regulators are still developing ways to handle this.

### Bottom line for clinicians
Ask patients about chatbot use, discuss what it can and cannot do, and ensure every person at risk has a **human** route to care.
:::

:::qa Use Bayes' theorem to show why an extraordinary claim needs extraordinary evidence. Then apply the same logic to the reliability of published research. [advanced]
### Bayes in odds form
**Posterior odds = prior odds × Bayes factor**

The Bayes factor is how much more likely the data are if the claim is true than if it is false.

### Worked example: a psychokinesis claim
1. Prior probability that psychokinesis is real, given physics and past failed replications: say 1 in 1,000,000. Prior odds about 0.000001.
2. A new study reports a "significant" result with a Bayes factor of 20 (fairly strong evidence by usual standards).
3. Posterior odds = 0.000001 × 20 = 0.00002.
4. The claim is still overwhelmingly likely to be false. To reach even odds, you would need a combined Bayes factor of about 1,000,000: many large, independent, pre-registered replications.

Compare a plausible claim, such as "a new SSRI reduces depressive symptoms slightly": prior probability perhaps 0.3 (odds about 0.43). The same Bayes factor of 20 gives posterior odds of about 8.6, a probability near 0.9.

### Applying it to research in general
A widely discussed 2005 essay argued that most published findings in some fields may be false. The logic is the **positive predictive value (PPV)** of a significant result:

**PPV = (power × prior odds) divided by (power × prior odds + alpha)**

| Situation | Prior odds that the hypothesis is true | Power | Alpha | PPV |
|---|---|---|---|---|
| Well-founded hypothesis, large trial | 1 (50:50) | 0.8 | 0.05 | 0.8 divided by 0.85, about 0.94 |
| Exploratory field, small studies | 0.1 | 0.2 | 0.05 | 0.02 divided by 0.07, about 0.29 |
| Implausible claim, small studies | 0.001 | 0.2 | 0.05 | 0.0002 divided by 0.0502, about 0.004 |

### Lessons
1. A "significant" result from a **small study of an implausible idea** is probably false.
2. Bias (p-hacking, selective reporting) makes things worse by raising the real false-positive rate above alpha.
3. Replication, large samples and pre-registration raise PPV.
4. This applies to psychiatry too: early striking findings about new treatments deserve the same caution.
:::

:::qa After the FDA's 2024 decision, design the phase 3 programme that might answer the regulator's concerns about MDMA-assisted therapy for PTSD. [advanced]
### The concerns to address
Functional unblinding and expectancy; incomplete data on cardiovascular risk and abuse liability; therapist conduct and data integrity; durability; and how much of the effect comes from the drug versus the therapy.

### Design elements
| Concern | Design response |
|---|---|
| Unblinding and expectancy | Active placebo with noticeable effects (for example a low dose of MDMA or a stimulant); measure expectancy at baseline; ask patients and raters to guess allocation at each visit and report the blinding index |
| Rater bias | Independent outcome assessors, remote and blinded, who never attend dosing sessions; recorded assessments audited |
| Drug versus therapy | A factorial design: MDMA plus therapy, placebo plus therapy, MDMA plus minimal support, placebo plus minimal support; or at least a standardised, modest therapy package equal in both arms |
| Therapist conduct | Two-therapist rule, video recording of all sessions, independent fidelity review, a clear code of conduct and a safeguarding officer |
| Safety | Pre-specified cardiovascular monitoring (blood pressure, ECG), liver tests, systematic collection of positive and negative mood effects, abuse-liability assessments (craving, unsanctioned use) |
| Durability | Primary outcome at end of treatment, key secondary outcomes at 6 and 12 months, with relapse definitions set in advance |
| Population | Broader inclusion where safe (for example, stable comorbid depression, some substance use), with careful exclusion of psychosis and uncontrolled cardiac disease |
| Comparison with standard care | A separate trial against an established trauma-focused therapy, to show where MDMA-assisted therapy fits |
| Data integrity | Independent data monitoring committee, open protocol, pre-registered analysis plan |

### Ethical considerations
- Vulnerability of patients in altered states.
- Informed consent about uncertainty and possible harms.
- Fair access if the treatment is approved.

### In India
Any trial would need CDSCO approval, ethics committee oversight, special licences under the NDPS Act and CTRI registration. Feasibility would depend on trained therapists and secure drug handling.
:::

:::qa When new, expensive treatments arrive, how should clinicians and health planners in India weigh cost, access and equity? [advanced]
### The problem
New treatments such as esketamine, xanomeline-trospium, psychedelic-assisted therapy and digital tools are costly, staff-intensive and concentrated in cities. India's mental health treatment gap is already very large, and most care is paid out of pocket.

### A framework for decisions
| Question | What to weigh |
|---|---|
| 1. How big is the benefit over existing options? | Effect size and NNT against current best care, not against placebo |
| 2. Who benefits? | A small group with treatment resistance, or many people? |
| 3. What does it cost per unit of benefit? | Cost-effectiveness: cost per response, per remission, per quality-adjusted life year |
| 4. What is the opportunity cost? | Money and staff spent here are not spent on, for example, community psychiatric nurses, task-sharing programmes or access to generic medicines |
| 5. Can the system deliver it safely? | Observation space, trained staff, monitoring |
| 6. Is it fair? | Will it widen the gap between urban private care and district services? |
| 7. Is the evidence relevant to Indian patients? | Trials mostly in high-income countries; local data needed |

### Examples
- **Generic medicines and ECT**: cheap, effective and already available; strengthening access may help far more people than a new branded drug.
- **Task-sharing**: lay counsellors delivering brief psychological treatments have randomised evidence in India and can reach large populations.
- **Esketamine**: may have a place in specialist centres for carefully selected patients, but cost and supervision needs limit scale.
- **Generic GLP-1 medicines**: as patents lapse and prices fall, use for antipsychotic-induced weight gain may become more feasible.

### Legal and policy context
- The **Mental Healthcare Act 2017** gives a right to access mental health care, including free care for people below the poverty line in government services.
- The **National Mental Health Programme** and **Tele-MANAS** aim to widen access.
- Health technology assessment in India (through the Health Technology Assessment in India board) can evaluate cost-effectiveness before adoption.

### Conclusion
Novelty is not a reason to adopt a treatment. The ethical question is how to produce the **greatest benefit for the most people**, while still offering effective specialist options to those who need them.
:::
`;
