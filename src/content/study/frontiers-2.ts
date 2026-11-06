/* Module · What's new in psychiatry, Parts III and IV (Advanced and exam zone). Status checked November 2026. Original text written for VIBHA School of Psychology. */
export const part2 = String.raw`
# Part III · Advanced: new science, new tools, extraordinary claims

## 3.1 Neuroinflammation: the immune system and the mind [core][advanced]
For a long time the brain was thought to be sealed off from the immune system. We now know immune signals reach the brain, and that **inflammation can change mood, energy and thinking**. Think of how you feel with a bad fever: tired, withdrawn, low, slow. That "**sickness behaviour**" looks a lot like depression.

### What is known
- On average, groups of people with depression have **slightly higher** blood markers of inflammation (such as **CRP** and **interleukin-6**) than people without depression.
- This is true for **a subgroup**, perhaps a quarter of depressed people, not for everyone.
- Raised inflammation is more common in people whose depression **has not responded** to standard antidepressants, and in people with obesity, childhood adversity and chronic illness.
- **Interferon-alpha**, an immune treatment once used for hepatitis C, caused depression in a large minority of patients, which is strong evidence that immune signals **can cause** depressive symptoms.

### What has been tried
- Anti-inflammatory add-ons (celecoxib, minocycline, omega-3, statins) and immune-targeting antibodies have given **mixed** results.
- An antibody that blocks TNF (infliximab) helped **only** the depressed patients with high CRP, and not others. This suggests that if immune treatments work, they will work for a **selected subgroup**.
- **Status: research only.** No anti-inflammatory treatment is a standard treatment for depression or schizophrenia.

### Where immune psychiatry already saves lives: autoimmune encephalitis
In **anti-NMDA receptor encephalitis**, the body makes antibodies against brain receptors. It often starts with **psychiatric symptoms**: anxiety, insomnia, strange behaviour, psychosis, then seizures, abnormal movements, reduced consciousness and unstable blood pressure or heart rate. It is commonest in young women and is sometimes linked to an ovarian **teratoma**. Treated early (immunotherapy, removing a tumour), many recover well. Missed, it can kill.

:::widget decide
{
  "scene": "Kavitha, 23, a software engineer in Coimbatore, is brought in after ten days of poor sleep, fearfulness and hearing voices. Today she had what looked like a seizure, and her face is making odd chewing movements. Her pulse is racing. She has no past psychiatric history.",
  "ask": "What should happen next?",
  "choices": [
    { "label": "Diagnose acute psychosis, start an antipsychotic and admit to the psychiatric ward", "verdict": "harm", "outcome": "She becomes rigid and feverish; antipsychotic sensitivity is suspected. The diagnosis of encephalitis is delayed by days.", "why": "New psychosis with seizures, abnormal movements and autonomic instability is a medical emergency until proven otherwise. Antipsychotics can worsen some patients with autoimmune encephalitis." },
    { "label": "Treat as possible autoimmune encephalitis: urgent neurology, MRI, EEG, lumbar puncture with antibody tests, and pelvic imaging", "verdict": "best", "outcome": "Her spinal fluid tests positive for anti-NMDA receptor antibodies and an ovarian teratoma is found. After surgery and immunotherapy she recovers.", "why": "Red flags (seizures, dyskinesias, autonomic instability, rapid onset, no prior history) mandate a full work-up. Early treatment improves outcome." },
    { "label": "Wait a week to see whether things settle", "verdict": "harm", "outcome": "She deteriorates and needs intensive care.", "why": "Delay is dangerous in encephalitis." }
  ]
}
:::

:::widget guess
{
  "prompt": "In meta-analyses, roughly what share of people with depression show low-grade inflammation (a CRP above about 3 mg/L)?",
  "min": 0,
  "max": 100,
  "step": 5,
  "unit": "%",
  "answer": [20, 30],
  "reveal": "About a quarter. That is a real subgroup but not 'depression is inflammation'. Many people with high CRP are not depressed, and many depressed people have normal CRP.",
  "clinician": "Osimo and colleagues (Psychological Medicine, 2019) estimated about 27% of patients with depression have CRP above 3 mg/L and about 58% above 1 mg/L. CRP is influenced by BMI, smoking, sleep and infection, so confounding is substantial."
}
:::

:::clinician
Key evidence: elevated IL-6, TNF and CRP in meta-analyses of MDD (Dowlati and colleagues, Biological Psychiatry 2010; Osimo and colleagues 2020 for cytokines); interferon-alpha induced depression in roughly a quarter to half of treated patients (Raison, Capuron and Miller); Raison and colleagues' infliximab RCT (JAMA Psychiatry, 2013) found no overall benefit but improvement in patients with baseline hs-CRP above 5 mg/L. Minocycline was negative for negative symptoms of schizophrenia in the BeneMin trial (Deakin and colleagues, Lancet Psychiatry 2018). The INSIGHT trial of adjunctive minocycline in TRD (Nettis and colleagues, Neuropsychopharmacology 2021) suggested benefit only with CRP of 3 mg/L or more. Microglial PET imaging using TSPO ligands has given inconsistent results, partly due to ligand and genotype issues. For autoimmune encephalitis, use Graus criteria (Lancet Neurology, 2016) and the Pollak criteria for autoimmune psychosis (Lancet Psychiatry, 2020); red flags include seizures, catatonia, dyskinesias, autonomic instability, decreased consciousness, focal neurology, hyponatraemia, and intolerance to antipsychotics.
:::

:::recall
1. What is "sickness behaviour"? || The tiredness, withdrawal, low mood and slowing that come with infection and inflammation, resembling depression.
2. Name two inflammatory markers raised on average in depression. || CRP and interleukin-6 (also TNF).
3. What did the infliximab trial suggest? || Benefit only in depressed patients with high CRP, pointing to a subgroup.
4. Give four red flags for autoimmune encephalitis in a patient with new psychosis. || Seizures, abnormal movements (dyskinesias), autonomic instability, reduced consciousness (also catatonia, rapid onset, no prior history, antipsychotic intolerance).
:::

:::mcq
Q: Which statement about inflammation and depression is most accurate?
- All depression is caused by inflammation
- Anti-inflammatory drugs are first-line for depression
- *A subgroup of depressed people has raised inflammation, and immune treatments may help only that subgroup
- Inflammation has no link to mood
> Subgroup, not universal; treatment still research-level.

Q: A 19-year-old with first-episode psychosis develops seizures and fluctuating blood pressure. The test that most changes management is:
- A personality test
- *Spinal fluid and blood testing for neuronal antibodies, with MRI and EEG
- Serum lithium level
- An IQ test
> Rule out autoimmune encephalitis.
:::

## 3.2 Genetics and pharmacogenomics [core][advanced]
### What genetic research has shown
- Most psychiatric conditions are **substantially heritable**: twin studies suggest about **80%** for schizophrenia and bipolar disorder, about **40%** for depression.
- But there is **no single "schizophrenia gene"**. Large genome-wide studies have found **hundreds of common variants**, each adding a very tiny amount of risk.
- A few **rare variants** have larger effects, such as the **22q11.2 deletion**, which raises the risk of schizophrenia many times over.
- Many variants are **shared across disorders**: schizophrenia, bipolar disorder and depression overlap genetically.

### Polygenic risk scores: not ready for patients
A **polygenic risk score** adds up a person's many small-risk variants. At the group level it predicts something; for **one person** it is weak. Most people with a high score never develop the illness, and many with low scores do. Scores are also less accurate in people of **South Asian, African and other non-European ancestry**, because most research samples were European.

### Pharmacogenomics: where gene testing actually helps
| Test | Why it matters | Status |
|---|---|---|
| **HLA-B*15:02** before carbamazepine (and caution with oxcarbazepine, phenytoin) | Strongly linked to Stevens-Johnson syndrome and toxic epidermal necrolysis in people of **South and Southeast Asian** ancestry, including many Indians | **Recommended** by drug regulators and guidelines where available |
| **HLA-A*31:01** before carbamazepine | Linked to serious skin reactions across ancestries | Recommended in some guidelines |
| **CYP2D6 and CYP2C19** metaboliser status | Ultra-rapid metabolisers may get too little of some antidepressants; poor metabolisers may get too much | **Useful in selected cases** (side effects at low doses, non-response at full doses) |
| Commercial "which antidepressant will work for me" panels | Combine many genes into a coloured report | **Oversold**: modest benefit at best in trials |

:::widget sort
{
  "prompt": "Validated in practice, or hype? Sort each genetics claim.",
  "buckets": ["Validated, clinically useful", "Not ready or oversold"],
  "items": [
    { "text": "HLA-B*15:02 testing before carbamazepine in people of Asian ancestry", "bucket": 0 },
    { "text": "A polygenic score tells a 16-year-old whether she will get schizophrenia", "bucket": 1 },
    { "text": "A home DNA kit chooses the right antidepressant for you", "bucket": 1, "why": "Panels show at most modest benefits in trials, mostly from avoiding drug-gene mismatches." },
    { "text": "Checking CYP2C19 status in a patient with severe side effects at low citalopram doses", "bucket": 0 },
    { "text": "Testing for the 22q11.2 deletion in a child with learning difficulty, heart defect and psychosis", "bucket": 0 },
    { "text": "Embryo selection to prevent depression", "bucket": 1 }
  ]
}
:::

:::widget decide
{
  "scene": "Mr Lim, 40, of Chinese-Malaysian ancestry living in Chennai, and Mr Joshi, 38, from Nagpur, are both to start carbamazepine for bipolar disorder. HLA testing is available but costs money.",
  "ask": "What is the best plan?",
  "choices": [
    { "label": "Test neither; skin reactions are rare", "verdict": "harm", "outcome": "One develops Stevens-Johnson syndrome in the first month and needs intensive care.", "why": "The reaction is rare but devastating, and the risk allele is relatively common in South and Southeast Asian populations, including India." },
    { "label": "Offer HLA-B*15:02 testing to both before starting, or choose an alternative mood stabiliser if testing is not possible", "verdict": "best", "outcome": "One is positive and starts a different mood stabiliser instead.", "why": "This is one of the clearest examples of pharmacogenomics preventing harm. Ancestry guides testing; it should not be assumed from appearance or surname." },
    { "label": "Test only Mr Lim because he is of Chinese ancestry", "verdict": "ok", "outcome": "Mr Joshi is not tested; he is fine this time, but the risk was real.", "why": "The allele is found in Indian populations too, though frequency varies by community." }
  ]
}
:::

:::clinician
GWAS: the PGC schizophrenia study (Trubetskoy and colleagues, Nature 2022) reported 287 associated loci, with convergence on synaptic genes; SNP-based heritability is far below twin heritability ("missing heritability"). PRS explain only a few percent of liability variance in non-European samples and are not recommended for clinical prediction. Pharmacogenomics: CPIC guidelines for SSRIs (CYP2D6, CYP2C19; Bousman and colleagues, Clinical Pharmacology and Therapeutics 2023) and for carbamazepine/oxcarbazepine with HLA-B*15:02 and HLA-A*31:01. Trials of combinatorial testing: GUIDED (Greden and colleagues, Journal of Psychiatric Research 2019) missed its primary outcome, with secondary benefits; PRIME Care (Oslin and colleagues, JAMA 2022) found small increases in remission and avoidance of drug-gene interactions in veterans. In India, HLA-B*15:02 frequency varies widely between communities; testing access and cost are the practical limits.
:::

:::recall
1. Roughly how heritable are schizophrenia and depression in twin studies? || About 80% for schizophrenia (and bipolar), about 40% for depression.
2. Why are polygenic risk scores not used for individual diagnosis? || They predict weakly for an individual and are less accurate in non-European ancestry.
3. Which gene test before carbamazepine prevents serious skin reactions in Asian populations? || HLA-B*15:02.
4. When is CYP2D6 or CYP2C19 testing most useful? || Severe side effects at low doses or non-response at full doses.
:::

:::mcq
Q: Which statement about the genetics of schizophrenia is correct?
- A single gene causes most cases
- *Hundreds of common variants each add small risk, plus some rare variants with larger effects
- It is not heritable
- Polygenic scores diagnose it accurately
> Highly polygenic.

Q: A patient of South Asian ancestry is about to start carbamazepine. The most evidence-based genetic step is:
- Full genome sequencing
- A polygenic score for bipolar disorder
- *HLA-B*15:02 testing where available
- CYP2D6 testing
> Prevents SJS/TEN.
:::

## 3.3 HiTOP, RDoC and the future of diagnosis [core][advanced]
### The problem with categories
DSM and ICD sort people into **categories**: you have the disorder or you don't. Researchers have pointed out three problems:
- **Comorbidity is the rule**: most people who meet criteria for one disorder meet criteria for another.
- **Heterogeneity**: two people with the same diagnosis may share almost no symptoms. There are **227** ways to meet the DSM criteria for major depression.
- **Arbitrary thresholds**: five symptoms is depression; four is not, though the person suffers almost as much.

### RDoC: start from brain systems
The US National Institute of Mental Health launched the **Research Domain Criteria (RDoC)** in 2009 to 2010. It is **a research framework, not a diagnostic manual**. It studies basic functions across "units of analysis" (genes, molecules, cells, circuits, physiology, behaviour, self-report).
The six domains:
1. **Negative valence** systems (fear, anxiety, loss)
2. **Positive valence** systems (reward, motivation)
3. **Cognitive** systems (attention, memory, control)
4. **Social processes** (attachment, understanding others)
5. **Arousal and regulatory** systems (sleep, arousal)
6. **Sensorimotor** systems (added in 2019)

### HiTOP: start from how symptoms cluster
The **Hierarchical Taxonomy of Psychopathology (HiTOP)** is built from statistics on how symptoms actually go together in large samples. It is **dimensional**: everyone has a score on each dimension.
- At the top: a general factor, sometimes called the **p factor**.
- Then **spectra**: **internalising** (depression, anxiety), **thought disorder** (psychosis), **disinhibited externalising** (substance use, impulsivity), **antagonistic externalising** (hostility, manipulation), **detachment** (withdrawal), and **somatoform**.
- Below these: subfactors, syndromes and specific symptoms.

:::widget sort
{
  "prompt": "Which framework does each statement describe?",
  "buckets": ["DSM or ICD categories", "RDoC", "HiTOP"],
  "items": [
    { "text": "Built from how symptoms statistically cluster, with dimensions at several levels", "bucket": 2 },
    { "text": "Organised around brain systems such as reward and threat, studied from genes to behaviour", "bucket": 1 },
    { "text": "Five of nine symptoms for a diagnosis", "bucket": 0 },
    { "text": "Includes an internalising spectrum and a detachment spectrum", "bucket": 2 },
    { "text": "Explicitly a research framework, not meant for clinical diagnosis", "bucket": 1 },
    { "text": "Used for insurance, legal and clinical communication worldwide", "bucket": 0 }
  ]
}
:::

### Where diagnosis is heading
- **ICD-11** already made **personality disorder** dimensional: a severity level plus trait domains.
- The **DSM-5-TR** contains an alternative dimensional model for personality disorders in its research section.
- In **2026**, the American Psychiatric Association published a **roadmap for the future DSM**. It proposes a manual that includes **dimensional, contextual and biological** information, is updated more continuously, and may even be renamed the "Diagnostic and **Scientific** Manual". It may not be called "DSM-6". **The details are still being worked out.**

:::widget decide
{
  "scene": "A professor in your MPhil class says, “DSM categories are dead. From now on we should diagnose patients using HiTOP scores.” You are writing a case sheet for a district hospital in Rajasthan tomorrow.",
  "ask": "What is the most sensible position?",
  "choices": [
    { "label": "Replace the diagnosis on the case sheet with HiTOP spectrum scores", "verdict": "harm", "outcome": "The pharmacy, insurer and the Mental Healthcare Act forms all require an ICD diagnosis. The patient's admission paperwork is delayed.", "why": "Dimensional frameworks are not yet clinical systems; ICD remains the legal and administrative standard in India." },
    { "label": "Use ICD-11 or DSM-5-TR diagnoses for the record, and add dimensional thinking (severity, traits, symptom profile) in the formulation", "verdict": "best", "outcome": "The case sheet is legally valid and your formulation is richer.", "why": "Categories for communication; dimensions for understanding. The two are complementary while the field transitions." },
    { "label": "Ignore dimensional models; they are only fashion", "verdict": "ok", "outcome": "You miss useful ways to describe severity and comorbidity.", "why": "HiTOP and RDoC have strong research support and are shaping future manuals." }
  ]
}
:::

:::clinician
Insel and colleagues introduced RDoC in the American Journal of Psychiatry (2010). Kotov and colleagues described HiTOP in the Journal of Abnormal Psychology (2017), with later updates proposing the somatoform spectrum and clinical measures (HiTOP-SR). Caspi and colleagues (Clinical Psychological Science, 2014) introduced the p factor from the Dunedin cohort; its interpretation (general distress, impairment, or a statistical artefact) is debated. The 227 figure comes from Zimmerman and colleagues (Comprehensive Psychiatry, 2015); Fried and Nesse (Journal of Affective Disorders, 2015) found 1,030 unique symptom profiles among 3,703 STAR*D participants. The APA's 2026 roadmap (Oquendo and colleagues, American Journal of Psychiatry 2026) describes a more dynamic, evidence-graded manual with dimensional and contextual components; specifics, timelines and naming are not final. ICD-11 (in force since January 2022) is the legal reference in Indian practice and the MHCA 2017 requires internationally accepted standards for diagnosis.
:::

:::recall
1. Give three problems with categorical diagnosis. || High comorbidity, heterogeneity within diagnoses, arbitrary thresholds.
2. Name the six RDoC domains. || Negative valence, positive valence, cognitive, social processes, arousal and regulatory, sensorimotor.
3. Name four HiTOP spectra. || Internalising, thought disorder, disinhibited externalising, antagonistic externalising (also detachment, somatoform).
4. What did the APA's 2026 roadmap propose? || A future manual with dimensional, contextual and biological information, updated more continuously, possibly renamed the Diagnostic and Scientific Manual.
:::

:::mcq
Q: RDoC is best described as:
- A replacement diagnostic manual for clinics
- *A research framework organised around basic brain and behavioural systems
- An ICD chapter
- A personality test
> NIMH research framework.

Q: Which is a HiTOP spectrum?
- Positive valence
- *Internalising
- Arousal and regulatory
- Sensorimotor
> The others are RDoC domains.
:::

## 3.4 Computational psychiatry, digital phenotyping and AI [core][advanced]
### Computational psychiatry
Computational psychiatry uses **mathematical models of how the brain learns and predicts** to understand symptoms. Two examples:
- **Reward learning**: in depression, people may learn less from rewards; in models this shows up as a lower "learning rate" for good outcomes.
- **Prediction and belief**: one theory of psychosis says the brain gives **too much weight to surprising signals** (or too little to prior expectations), so random events feel meaningful, which could lead to delusions.
**Status: research only.** These models are elegant and growing, but no computational test is used to diagnose or treat patients routinely.

### Digital phenotyping
Smartphones and wearables record **sleep, movement, typing, phone use and voice**. Researchers try to detect **early warning signs** (for example a drop in movement and social contact before a depressive relapse, or reduced sleep before mania).
**Status: research only to early clinical pilots.** Problems: privacy and consent, data that differ between phones, people who stop wearing devices, and models that work in one group but not another.

### Prediction models and the generalisation problem
Machine-learning models can "predict" who will respond to a treatment in one dataset, then **fail completely** in the next. A 2024 study in **Science** found that models predicting outcomes in schizophrenia trials worked within the trial they were trained on but **not across other trials**. Always ask: **was it tested on new, independent data?**

### AI chatbots and large language models (LLMs)
| What is known (as of Nov 2026) | What is concerning |
|---|---|
| A randomised trial of a purpose-built generative AI therapy chatbot (Therabot, NEJM AI, March 2025, 106 participants) reported reduced depression and anxiety symptoms compared with a waitlist | One small trial, waitlist control, selected participants; not a substitute for treatment |
| Older rule-based apps (such as Woebot, Wysa) had small trials, mostly short-term | Woebot Health closed its consumer app in mid-2025 |
| LLMs can draft notes, summarise research and help practise interview skills | General chatbots can be **sycophantic**, agree with harmful beliefs, give unsafe responses to suicidal users, and invent facts |
| | Lawsuits in the USA have alleged that chatbots contributed to teenagers' suicides |
| | Some US states (for example Illinois, 2025) restricted AI from providing therapy; an FDA advisory committee met in November 2025 on regulating generative-AI mental health devices |
| | No generative-AI therapy chatbot had FDA marketing authorisation as a treatment by late 2025 |

:::widget sort
{
  "prompt": "Validated, promising, or hype? Sort each claim about technology in mental health (as of Nov 2026).",
  "buckets": ["Reasonably validated", "Promising, early", "Hype or unsafe"],
  "items": [
    { "text": "Video consultations (telepsychiatry) can deliver effective care, as with India's Tele-MANAS helpline and services", "bucket": 0 },
    { "text": "A phone app predicts manic relapse from sleep and activity", "bucket": 1 },
    { "text": "A general-purpose chatbot can replace a therapist for a suicidal teenager", "bucket": 2 },
    { "text": "A purpose-built AI chatbot reduced depressive symptoms versus waitlist in one RCT", "bucket": 1 },
    { "text": "An AI model trained on one hospital's data will work just as well in any other hospital", "bucket": 2, "why": "Models often fail to generalise; independent validation is essential." },
    { "text": "Internet-delivered CBT with some human guidance helps depression and anxiety", "bucket": 0 }
  ]
}
:::

:::widget decide
{
  "scene": "Riya, 20, a psychology student in Ahmedabad, tells you she talks to a general AI chatbot every night about her low mood, and last week it told her that “sometimes ending things is a valid choice”. She says, “It understands me better than people do.”",
  "ask": "What do you do?",
  "choices": [
    { "label": "Tell her to keep using it since it helps her feel understood", "verdict": "harm", "outcome": "Her suicidal thinking deepens unnoticed.", "why": "A chatbot validating suicide is a serious safety failure, and her reliance on it may be isolating her." },
    { "label": "Take her seriously: assess suicide risk now, make a safety plan, connect her with human care, and talk openly about what the chatbot does and does not offer", "verdict": "best", "outcome": "She agrees to see a counsellor and to tell a friend when she feels low. She keeps a note of helpline numbers.", "why": "Risk assessment first, then a human connection. Respect her experience of feeling understood while being honest about the tool's limits." },
    { "label": "Mock her for talking to a computer", "verdict": "harm", "outcome": "She feels ashamed and stops talking to you too.", "why": "Shame shuts down disclosure, the opposite of what she needs." }
  ]
}
:::

:::safety If someone is at risk
If a person tells you about suicidal thoughts, take it seriously, ask directly, and connect them with urgent human help. In India, **Tele-MANAS** is a free national mental health helpline (14416 or 1-800-891-4416).
:::

:::clinician
Computational psychiatry: Huys, Maia and Frank (Nature Neuroscience, 2016) provide a framework; predictive-processing accounts of psychosis (Sterzer and colleagues, Biological Psychiatry 2018) remain largely theoretical with mixed empirical support. Generalisability: Chekroud and colleagues (Science, January 2024) showed that models predicting antipsychotic trial outcomes performed well within trials but at chance across independent trials. Therabot: Heinz and colleagues (NEJM AI, 2025) reported greater symptom reduction than waitlist over the trial period, with human monitoring of conversations, so it is not evidence for unsupervised general-purpose chatbots. Risks documented in 2025 work include stigmatising or unsafe responses to crisis prompts by commercial LLMs (Moore and colleagues, FAccT 2025) and ethics violations against professional standards (Iftikhar and colleagues, 2025). Regulatory status: the FDA Digital Health Advisory Committee met on 6 November 2025 on generative-AI digital mental health devices; India regulates software as a medical device under the Medical Devices Rules 2017 but has no specific framework for therapy chatbots as of late 2026, and the Digital Personal Data Protection Act 2023 applies to sensitive data. Teach students to treat AI as a tool to check, not an authority.
:::

:::recall
1. What is computational psychiatry? || Using mathematical models of learning and prediction to understand symptoms.
2. What is digital phenotyping? || Using data from phones and wearables (sleep, movement, typing, voice) to detect patterns and warning signs.
3. What did the 2024 Science study show about prediction models? || They worked within the trial they were trained on but failed across other trials.
4. What was the Therabot trial and its main limitation? || An RCT of a purpose-built AI therapy chatbot showing symptom reduction versus waitlist; small, waitlist control, supervised.
5. Name three risks of general chatbots for people in distress. || Sycophancy, unsafe responses to suicidal users, invented facts (also dependence, privacy).
:::

:::mcq
Q: An AI model predicts antidepressant response with 85% accuracy in the hospital where it was built. The most important next step before use is:
- Publish a press release
- *Test it on independent data from other sites
- Use it on all patients
- Add more features until accuracy is 100%
> External validation is essential; models often fail to generalise.

Q: Which statement about AI chatbots for mental health is accurate as of November 2026?
- They are approved by the FDA as therapy
- *One RCT of a purpose-built chatbot showed promise, but evidence is limited and general chatbots can respond unsafely
- They have no risks
- They are recommended to replace therapists in India
> Promising but early, with real safety concerns.
:::

## 3.5 Psychokinesis: how to judge an extraordinary claim [core][advanced]
:::safety Status: not established
**Psychokinesis (moving or influencing matter with the mind alone) is not an established phenomenon.** This lesson uses it to teach how science judges claims. It is not evidence that psychokinesis exists.
:::

### The claim and the studies
Parapsychologists have tested whether people can influence **random number generators** (RNGs) by intention, for example by "wishing" a machine to produce more 1s than 0s. Hundreds of such experiments were run from the 1950s to the 2000s.

In **2006**, **Bösch, Steinkamp and Boller** published a meta-analysis in **Psychological Bulletin** of **380 studies**. What they found:
- A **statistically significant but extremely small** overall effect: a hit rate a tiny fraction of a percentage point above chance.
- **Smaller studies showed bigger effects**, and larger studies showed effects close to zero. This pattern is a classic warning sign of **publication bias**.
- The results varied hugely between studies (**heterogeneity**).
- A computer simulation showed that **publication bias alone could produce** this kind of tiny effect and the small-study pattern.
- The authors concluded that the existence of psychokinesis could not be established.

### Feeling the future: Bem and the replication crisis
In **2011**, the respected psychologist **Daryl Bem** published nine experiments in a top journal (the Journal of Personality and Social Psychology) claiming **precognition**: for example, that practising words **after** a memory test improved recall of those words **on** the test. Eight of nine experiments were "significant".
- Independent teams, including **Ritchie, Wiseman and French (2012)**, repeated the experiments carefully and found **nothing**.
- A large multi-lab study (the **Transparent Psi Project**, 2023) with over 2,000 participants and fully pre-registered methods found results **consistent with chance**.
- Bem's paper became a famous example in the **replication crisis**: if standard methods could "prove" something so implausible, the methods themselves were the problem.

:::widget guess
{
  "prompt": "In the Transparent Psi Project, participants guessed where a picture would appear. By pure chance they should be right 50% of the time. Across more than 2,000 people, what success rate did they get?",
  "min": 40,
  "max": 60,
  "step": 0.5,
  "unit": "%",
  "answer": [49.5, 50.5],
  "reveal": "About 49.9%: chance. With a large, pre-registered, independently audited study, the effect that small studies had 'found' disappeared. Size and transparency are what make results trustworthy.",
  "clinician": "Kekecs and colleagues (Royal Society Open Science, 2023): 2,115 participants and about 38,000 erotic-picture trials replicating Bem's Experiment 1; observed success rate 49.89%, with Bayesian analyses supporting the null. In a funnel plot of the earlier RNG literature, small positive studies cluster on one side with small null studies missing, the classic asymmetry of publication bias (Egger's regression and trim-and-fill test for it, with limited power under heterogeneity)."
}
:::

### What went wrong: the toolkit for judging claims
| Problem | In plain words |
|---|---|
| **Publication bias** (file drawer) | Failed studies are not published |
| **p-hacking** | Trying many analyses until one is "significant" |
| **Garden of forking paths** | Many small choices in analysis, made after seeing data |
| **Low prior plausibility** | The claim contradicts well-established physics and biology |
| **Small samples** | Unstable results that are more often false positives |
| **No independent replication** | Only believers find the effect |

And the fixes: **pre-registration**, **registered reports** (journals accept the study before results are known), **large multi-lab replications**, **open data**, and **adversarial collaborations** (sceptics and proponents design the study together).

:::analogy Extraordinary claims need extraordinary evidence
If a friend says she saw a cow in a Pune street, you believe her. If she says she saw a cow fly over the street, you want much more evidence. The more a claim contradicts what we already know works, the more and better evidence we need. This is Bayesian thinking: **prior plausibility matters**.
:::

:::widget sort
{
  "prompt": "Does each practice make a research finding more trustworthy or less?",
  "buckets": ["More trustworthy", "Less trustworthy"],
  "items": [
    { "text": "The analysis plan was registered before data were collected", "bucket": 0 },
    { "text": "The authors tried several outcome measures and reported only the one that worked", "bucket": 1 },
    { "text": "A sceptic and a believer designed the study together", "bucket": 0 },
    { "text": "Only small studies by the original lab found the effect", "bucket": 1 },
    { "text": "A large multi-lab replication with open data", "bucket": 0 },
    { "text": "Data collection stopped as soon as the result became significant", "bucket": 1, "why": "Optional stopping inflates false positives." }
  ]
}
:::

:::widget decide
{
  "scene": "A wellness company in Mumbai advertises a “mind-energy healing” course for anxiety, citing “a meta-analysis of 380 studies proving mind-over-matter effects”. A client asks if she should pay ₹40,000 for it.",
  "ask": "What do you say?",
  "choices": [
    { "label": "Yes, a meta-analysis of 380 studies is strong evidence", "verdict": "harm", "outcome": "She pays, gets no benefit and delays effective treatment for her anxiety.", "why": "The meta-analysis they cite concluded psychokinesis could not be established, and nothing in it concerns treating anxiety." },
    { "label": "Explain what the meta-analysis actually found (a tiny effect explainable by publication bias), and offer evidence-based options for anxiety", "verdict": "best", "outcome": "She starts CBT and keeps her money.", "why": "Respectful explanation, honest evidence and a better alternative." },
    { "label": "Say it is all nonsense and refuse to discuss it", "verdict": "ok", "outcome": "She feels dismissed and may go anyway.", "why": "Right conclusion, but explaining why helps her judge future claims herself." }
  ]
}
:::

:::clinician
Bösch, Steinkamp and Boller (Psychological Bulletin, 2006): 380 RNG studies from 117 reports (1959 to 2004); a very small but statistically significant overall effect, strongly and inversely related to sample size, with extreme heterogeneity; Monte Carlo simulation indicated publication bias could account for the main findings. Commentaries by Radin, Nelson, Dobyns and Houtkooper (Psychological Bulletin, 2006) disputed the publication-bias interpretation; Wilson and Shadish argued that the effect was too small and heterogeneous to interpret. Bem (Journal of Personality and Social Psychology, 2011); failed replications by Ritchie, Wiseman and French (PLoS ONE, 2012) and Galak and colleagues (JPSP, 2012); Wagenmakers and colleagues' Bayesian reanalysis (JPSP, 2011) argued that the evidence was weak given the prior. Kekecs and colleagues (Royal Society Open Science, 2023), the Transparent Psi Project: 2,115 participants, about 38,000 trials, success rate essentially at chance, with direct data deposition and independent auditing. Use these as teaching cases for evaluating any claim, including psychiatric ones: the same flaws appear in some drug and psychotherapy literatures.
:::

:::recall
1. What did Bösch, Steinkamp and Boller find in 2006? || A tiny but significant effect across 380 RNG studies, larger in small studies, highly heterogeneous, explainable by publication bias; psychokinesis not established.
2. Why is "small studies show bigger effects" a warning sign? || It suggests publication bias: small positive studies get published, small null ones don't.
3. What happened when Bem's precognition experiments were replicated? || Careful replications, including a large pre-registered multi-lab study, found results consistent with chance.
4. Name four fixes for unreliable research. || Pre-registration, registered reports, large multi-lab replication, open data (also adversarial collaboration).
:::

:::mcq
Q: Which conclusion about psychokinesis is supported by the evidence?
- It is proven by the 2006 meta-analysis
- *It is not established; the small reported effects are plausibly explained by bias
- It works only in India
- It is used in psychiatric treatment
> The authors themselves concluded it was not established.

Q: In a funnel plot, small studies cluster on the positive side and small negative studies are missing. This most likely shows:
- A very strong real effect
- *Publication bias or small-study effects
- Perfect replication
- That larger studies are wrong
> Asymmetry suggests missing null results.
:::

## 3.6 Talking to patients about new treatments [core][advanced]
Patients read headlines too. How you respond shapes whether they trust you, and whether they seek risky options elsewhere.

### A four-step conversation
1. **Ask what they have heard and hope for.** "What did you read? What would you want it to do for you?"
2. **Give the honest status.** Approved, in trials, mixed, or not established, with what that means.
3. **Weigh it for them.** Their history, risks, costs, legal status in India, and what proven options remain untried.
4. **Keep the door open.** "If this becomes available and suits you, I'll tell you. Meanwhile, here is what we can do now."

:::widget decide
{
  "scene": "Mrs Banerjee, 47, from Kolkata, has had depression for ten years and has tried four antidepressants. She has booked a ₹1.5 lakh ‘ketamine and psilocybin retreat’ abroad that promises “one weekend to reset your brain”. She asks your opinion.",
  "ask": "Which response is most helpful?",
  "choices": [
    { "label": "Say nothing; it's her money and her choice", "verdict": "ok", "outcome": "She goes, has a frightening experience without medical support, and feels worse afterwards.", "why": "Autonomy matters, but she asked for your opinion, and she has untried evidence-based options." },
    { "label": "Acknowledge her exhaustion with failed treatments, explain what is actually known about ketamine and psilocybin, the risks of unsupervised use, and offer proven next steps such as augmentation, ECT, rTMS or a referral for esketamine where available", "verdict": "best", "outcome": "She cancels, starts rTMS and an augmentation strategy, and asks to be told about psilocybin if it is approved.", "why": "Validation plus honest status plus real alternatives. That is what keeps patients safe and trusting." },
    { "label": "Tell her she will be arrested and that these drugs cause brain damage", "verdict": "harm", "outcome": "She feels lectured and stops telling you what she plans.", "why": "Exaggeration destroys credibility and drives people away from care." }
  ]
}
:::

:::clinician
Ethics in India: the Mental Healthcare Act 2017 gives patients rights to information about their treatment and to informed consent, and prohibits certain treatments (for example unmodified ECT). Prescribing an unapproved product requires either a regulated clinical trial (registered with CTRI and approved by an ethics committee and the CDSCO) or a recognised compassionate-use pathway; recommending illegal substances can expose clinicians to liability under the NDPS Act. Document the discussion, the status information you gave, and the alternatives offered. Evidence-based options for treatment-resistant depression in India include optimisation and switching, augmentation (lithium, atypical antipsychotics), combination antidepressants, ECT, rTMS, and psychotherapy (CBT, behavioural activation, IPT, CBASP for chronic depression).
:::

:::recall
1. Give the four steps for discussing a new treatment with a patient. || Ask what they heard and hope for; give the honest status; weigh it for them; keep the door open.
2. Why avoid exaggerating risks? || It destroys credibility and drives patients away from care.
:::

:::mcq
Q: A patient asks about a treatment you know is only in phase 2 trials. The best first step is:
- Tell them it doesn't work
- Prescribe it off-label
- *Ask what they have heard and what they hope it would do
- Refer them to the company
> Start by understanding their hopes and information.
:::

# Part IV · Exam zone

## 4.1 Short notes and viva [core]
### Short notes (5 marks each)
- Ketamine and esketamine in depression: mechanism, evidence, safety, status.
- Psychedelic-assisted therapy: MDMA and psilocybin, evidence and the regulatory story.
- Xanomeline-trospium: mechanism and place in therapy.
- GLP-1 agonists and psychiatry.
- HiTOP versus RDoC.
- Pharmacogenomics in Indian practice.
- How to evaluate an extraordinary claim, using psychokinesis research.

### Long answer skeleton
**Critically discuss recent advances in the treatment of depression. (15 marks)**
1. The problem: treatment resistance and slow onset.
2. Rapid-acting: ketamine and esketamine (mechanism, evidence, status, risks).
3. Psychedelics: psilocybin (COMP360 phase 3), status and caveats.
4. Neurosteroids: zuranolone for postpartum depression.
5. Neuromodulation: rTMS and newer accelerated protocols (link to the depression module).
6. Inflammation and pharmacogenomics: research status.
7. Evaluation: effect sizes, blinding, cost, access in India.
8. Conclusion: genuine new tools, but hype exceeds evidence for several.

:::viva
When did the FDA approve xanomeline-trospium? :: 26 September 2024.
What is xanomeline's main target? :: Muscarinic M1 and M4 receptors.
What happened to MDMA-assisted therapy in August 2024? :: The FDA declined approval and requested another phase 3 trial.
What does COMP360 contain? :: Manufactured psilocybin.
Esketamine is given by which route? :: Nasal spray.
Zuranolone is approved for? :: Postpartum depression in the USA.
What did the FDA decide about GLP-1 suicidality warnings in January 2026? :: To remove them; no increased risk found.
Which gene should be tested before carbamazepine in people of Asian ancestry? :: HLA-B*15:02.
Name the six RDoC domains. :: Negative valence, positive valence, cognitive, social processes, arousal and regulatory, sensorimotor.
What is the p factor? :: A general factor of psychopathology at the top of HiTOP.
Who published the 2006 psychokinesis meta-analysis? :: Bösch, Steinkamp and Boller, in Psychological Bulletin.
What is a registered report? :: A study accepted by a journal on its methods before results are known.
:::

## 4.2 Module test [core]
:::mcq
Q: Which phase of drug development first tests a drug in a small group mainly for safety and dose?
- *Phase 1
- Phase 2
- Phase 3
- Phase 4
> Phase 1.

Q: "Breakthrough therapy designation" means:
- Approval for marketing
- *Extra regulatory guidance because early results look promising
- A drug has been withdrawn
- The trial was stopped for harm
> Not approval.

Q: A trial with a huge sample shows a 1-point difference on a 60-point depression scale. This is:
- Clinically large
- *Likely significant but clinically small
- Impossible
- Proof of no effect
> Significance is not importance.

Q: Ketamine's rapid antidepressant effect is linked to:
- Serotonin reuptake inhibition
- *NMDA blockade followed by increased synaptic plasticity signalling
- Dopamine D2 blockade
- GABA-A enhancement
> Glutamate-based mechanism.

Q: Which is TRUE of esketamine?
- It is taken as a daily tablet at home
- *Patients are observed in clinic after each dose because of dissociation and blood pressure rises
- It has no misuse potential
- It is a psychedelic mushroom extract
> Supervised administration.

Q: The main concerns of the 2024 FDA panel on MDMA-assisted therapy included:
- Weight gain
- *Functional unblinding, expectancy and gaps in safety data
- Lack of any effect at all
- Liver failure in most patients
> Led to the August 2024 decision.

Q: As of November 2026, psilocybin (COMP360) for treatment-resistant depression is:
- FDA-approved
- *Supported by positive phase 3 trials, with an FDA application being completed
- Rejected by the FDA
- Approved in India
> Not yet approved.

Q: In India, psilocybin mushrooms and MDMA are:
- Over-the-counter supplements
- Approved medicines
- *Controlled under the NDPS Act
- Unregulated
> Illegal outside licensed research.

Q: Xanomeline-trospium is notable because it:
- Is a long-acting dopamine blocker
- *Treats schizophrenia mainly through muscarinic receptors rather than D2 blockade
- Causes more weight gain than olanzapine
- Is approved for depression
> New mechanism.

Q: Which condition is a contraindication or major caution for xanomeline-trospium?
- Hypertension only
- *Urinary retention
- Asthma
- Hair loss
> Anticholinergic component.

Q: Zuranolone was NOT approved by the FDA for:
- Postpartum depression
- *Major depressive disorder in general
- Any condition
- Women
> Approved for PPD only.

Q: Which practical point applies when a patient on lithium starts a GLP-1 medicine?
- Stop lithium immediately
- *Watch for dehydration from vomiting or diarrhoea, which can raise lithium levels
- GLP-1 medicines lower lithium levels to zero
- No interaction is possible
> Monitor levels if GI losses occur.

Q: The best current summary of GLP-1 medicines and suicidality is:
- Proven to cause suicide
- *Large analyses found no increased risk; the FDA asked for warnings to be removed in January 2026
- Never studied
- Banned in Europe
> Regulatory conclusions.

Q: The infliximab trial in depression suggested that immune treatments:
- Help everyone with depression
- Make depression worse
- *May help only those with raised inflammation
- Should replace antidepressants
> Subgroup effect.

Q: A young woman with new psychosis, seizures, abnormal mouth movements and unstable pulse should first be investigated for:
- Schizophrenia only
- *Autoimmune (anti-NMDA receptor) encephalitis
- Malingering
- Personality disorder
> Medical emergency.

Q: Polygenic risk scores are not used to diagnose individuals because:
- They are illegal
- *They predict weakly for individuals and less accurately in non-European ancestries
- They are always perfectly accurate
- They test only one gene
> Group-level, not individual-level, tools.

Q: The HLA-B*15:02 test prevents:
- Weight gain with olanzapine
- *Serious skin reactions with carbamazepine
- Lithium toxicity
- Serotonin syndrome
> SJS/TEN.

Q: Which is an RDoC domain?
- Internalising
- Thought disorder
- *Positive valence systems
- Detachment
> The others are HiTOP spectra.

Q: HiTOP differs from DSM mainly because it is:
- Older
- *Dimensional and built from how symptoms statistically cluster
- Used for insurance
- Based on brain scans only
> Empirical, dimensional.

Q: The 2024 Science study on clinical prediction models found that:
- Models always generalise
- *Models that worked within one trial failed across other trials
- AI is better than clinicians in all cases
- Prediction is impossible in medicine
> External validation matters.

Q: Which statement about AI chatbots in mental health is fair?
- They are approved therapy devices in India
- *Evidence is early; one RCT of a purpose-built chatbot is promising, and general chatbots have responded unsafely to people at risk
- They never make mistakes
- They have been banned worldwide
> Promising but unproven.

Q: In the 2006 psychokinesis meta-analysis, larger studies showed:
- The biggest effects
- *Effects close to zero, while small studies showed larger effects
- Exactly the same effects as small studies
- Negative effects only
> A small-study effect, a warning of bias.

Q: Bem's 2011 precognition findings are best described as:
- Confirmed by many replications
- *Not replicated by independent, pre-registered studies
- Used in clinical practice
- Proof of psychokinesis
> A landmark case in the replication crisis.

Q: Which practice best protects against p-hacking?
- Stopping data collection when results become significant
- Reporting only the best outcome
- *Pre-registering the analysis plan
- Using smaller samples
> Pre-registration fixes choices in advance.
:::
`;
