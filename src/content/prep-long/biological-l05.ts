import type { LongQA } from "@/lib/prep/long-types";
import type { PrepVisual } from "@/lib/prep/types";
import type { FigureData } from "@/lib/study/types";
import { anchored, chain, compare, layers, tree, vis } from "./visual";

const S = "biological" as const;
const fig = (id: string, caption: string): PrepVisual => ({ kind: "figure", data: { id } satisfies FigureData, caption });

export const BIOLOGICAL_L05: LongQA[] = anchored([
  {
    id: "bio-l05-001",
    subject: S,
    topic: "neuroimaging",
    marks: 20,
    difficulty: 3,
    exams: ["cuet-pg", "ugc-net", "mcp-entrance", "md-psychiatry", "ma-semester"],
    question: "Describe the structural and functional methods of studying the living human brain. Compare their principles, strengths and limitations, and discuss their uses in psychology and psychiatry.",
    plan: ["Why imaging matters", "Structural methods: CT, MRI, DTI", "Functional methods: PET, SPECT, fMRI", "Electrical and magnetic methods: EEG, ERP, MEG", "Comparison table", "Uses and limitations"],
    answer: `## Why imaging matters
For most of history the brain could be studied only after death or through the effects of injury, as with Phineas Gage or Broca's patient. Since the 1970s, imaging has allowed us to see the structure and activity of the living brain, linking mind and behaviour to brain systems and helping diagnose neurological causes of psychiatric symptoms.

## Structural methods
1. Computerised tomography, CT: X rays are passed through the head from many angles, and a computer builds cross sectional images. Bone appears white, cerebrospinal fluid dark. CT is fast, cheap and widely available in Indian district hospitals, and is good for detecting bleeding, fractures, large strokes and tumours. It uses ionising radiation and gives poor contrast between grey and white matter. In 1976 Eve Johnstone and colleagues used CT to show enlarged lateral ventricles in schizophrenia.
2. Magnetic resonance imaging, MRI: a strong magnetic field aligns hydrogen nuclei in water; radio pulses knock them out of alignment and the signals they give as they realign are used to build images. Different sequences, such as T1, T2 and FLAIR, highlight anatomy, fluid or lesions. MRI gives excellent soft tissue detail without radiation, but is expensive, slow, noisy and unsuitable for people with pacemakers or metal implants. Volumetric analysis measures structures such as the hippocampus.
3. Diffusion tensor imaging, DTI: a form of MRI that measures the direction of water diffusion along axons. Fractional anisotropy indicates the integrity of white matter tracts, allowing tractography of pathways such as the arcuate fasciculus. Reduced integrity is reported in schizophrenia and after head injury.

## Functional methods
1. Positron emission tomography, PET: a radioactive tracer that emits positrons is injected. Fluorodeoxyglucose shows glucose metabolism; ligands such as raclopride show dopamine D2 receptor availability; amyloid tracers show Alzheimer's plaques. PET measures neurochemistry directly but uses radiation, needs a cyclotron, is costly and has poor temporal resolution of about a minute.
2. Single photon emission computed tomography, SPECT: uses longer lived tracers to measure blood flow or receptors, cheaper than PET but with lower resolution. DaT scans help distinguish Parkinson's disease and Lewy body dementia.
3. Functional MRI, fMRI: measures the blood oxygen level dependent, BOLD, signal. Active neurons increase blood flow more than oxygen use, so oxygenated blood rises locally, changing the magnetic signal. It is non invasive with good spatial resolution of a few millimetres, but temporal resolution is limited to seconds because the blood flow response is slow. Resting state fMRI studies networks such as the default mode network.

## Electrical and magnetic methods
1. Electroencephalography, EEG: electrodes on the scalp, placed by the 10 20 system, record the summed electrical activity of cortical neurons. It has excellent temporal resolution, in milliseconds, is cheap and portable, but poor spatial resolution. It is essential for epilepsy, sleep studies and delirium.
2. Event related potentials, ERPs: averaged EEG responses to repeated stimuli, such as the P300 wave to an odd stimulus or mismatch negativity, which is reduced in schizophrenia.
3. Magnetoencephalography, MEG: measures the tiny magnetic fields produced by neural currents, with millisecond timing and better localisation than EEG, but very expensive and rare in India.

## Comparison
| Method | Measures | Spatial resolution | Temporal resolution | Invasiveness |
| CT | Structure, density | Moderate | Not applicable | X rays |
| MRI | Structure | High | Not applicable | None |
| DTI | White matter tracts | Moderate | Not applicable | None |
| PET | Metabolism, receptors | Moderate | Minutes | Radioactive tracer |
| SPECT | Blood flow, receptors | Low | Minutes | Radioactive tracer |
| fMRI | Blood oxygen changes | High, millimetres | Seconds | None |
| EEG and ERP | Electrical activity | Low | Milliseconds | None |
| MEG | Magnetic fields | Moderate to high | Milliseconds | None |
Methods are often combined, such as simultaneous EEG and fMRI, to get both timing and location.

## Uses
- Research: mapping language, memory, emotion and decision making; studying development and ageing; testing theories, such as the role of the amygdala in fear.
- Psychiatry: ruling out organic causes, such as tumours, strokes or hydrocephalus, in first episode psychosis or late onset depression; diagnosing dementias; PET to study dopamine in schizophrenia and drug occupancy of receptors.
- Neurosurgery: localising language before epilepsy surgery.
- Treatment research: predicting response to treatment, guiding brain stimulation.

## Limitations
- Imaging shows correlation, not causation.
- Group differences in psychiatric disorders are small and overlap with healthy people, so imaging cannot yet diagnose schizophrenia or depression in an individual.
- Many early studies had small samples and false positives; large consortia, such as ENIGMA, now pool thousands of scans.
- Reverse inference, concluding a mental state from activation of a region, is risky because each region serves many functions.
- Cost and access limit use in India, especially MRI and PET outside major cities.

## Conclusion
Each method trades off spatial detail, timing, cost and safety. Together they have transformed knowledge of brain and behaviour, but in psychiatry they remain mainly research tools and a way to exclude other causes.`,
    keyPoints: ["Historical need for in vivo methods", "CT principle, uses and the 1976 ventricle finding", "MRI principle, sequences, safety", "DTI and fractional anisotropy", "PET and SPECT tracers and uses", "fMRI BOLD signal and resolution", "EEG, ERP and MEG with millisecond timing", "Comparison table, clinical uses and limitations"],
    pitfalls: ["Saying fMRI measures neuronal firing directly", "Claiming imaging diagnoses psychiatric disorders"],
    module: "brain/6-3",
    visuals: [
      tree("Comparison", [["Methods of studying the living brain", "Structure and function", -1], ["Structural", "CT, MRI, DTI", 0], ["Functional by blood and chemistry", "PET, SPECT, fMRI", 0], ["Electrical and magnetic", "EEG, ERP, MEG", 0]]),
      fig("eeg-10-20", "Electrical and magnetic methods: the 10 20 electrode map"),
    ],
    ref: "Hounsfield CT 1972; Johnstone et al 1976 Lancet ventricles; Ogawa et al 1990 BOLD; Basser 1994 DTI; Farde raclopride PET; ENIGMA consortium; Poldrack 2006 reverse inference; brain module 6.3",
  },
  {
    id: "bio-l05-002",
    subject: S,
    topic: "neuroimaging",
    marks: 10,
    difficulty: 3,
    exams: ["cuet-pg", "ugc-net", "ma-semester"],
    question: "Explain the principle of functional magnetic resonance imaging. Describe common study designs and the main limitations in interpreting fMRI findings.",
    plan: ["The BOLD signal", "Haemodynamic response", "Study designs", "Analysis", "Limitations"],
    answer: `## The BOLD signal
Functional MRI detects changes in blood oxygenation that follow neural activity. Oxygenated and deoxygenated haemoglobin have different magnetic properties: deoxyhaemoglobin distorts the magnetic field and lowers the MRI signal. When a brain region becomes active, local blood flow increases more than oxygen consumption, so the proportion of oxygenated blood rises and the signal increases. This blood oxygen level dependent, or BOLD, contrast was described by Seiji Ogawa in 1990.

## The haemodynamic response
The BOLD signal rises about two seconds after a brief neural event, peaks at around five to six seconds and returns to baseline after about 15 to 20 seconds, sometimes with a small undershoot. fMRI therefore has good spatial resolution, a few millimetres, but poor temporal resolution compared with EEG.

## Study designs
1. Block design: alternating periods of a task, such as viewing faces, and a control, such as viewing houses, each lasting about 20 to 30 seconds. Strong signal, simple analysis.
2. Event related design: brief, randomised trials, allowing responses to individual events, such as correct and error trials, to be separated.
3. Resting state: the person lies quietly, and correlations between regions reveal intrinsic networks, such as the default mode network, active during mind wandering, and the salience and central executive networks.
4. Subtraction logic: activity in the control condition is subtracted from the task condition to isolate the process of interest.

## Analysis
Images are corrected for head motion, aligned to a standard brain and smoothed. Statistical tests are run at tens of thousands of voxels, so correction for multiple comparisons is essential.

## Limitations
- Multiple comparisons: in a famous demonstration, researchers found apparent activation in a dead salmon shown photographs when they did not correct their statistics.
- Reverse inference: activation of the amygdala does not prove fear, since the region serves many functions.
- BOLD is an indirect, relative measure of neural activity, influenced by blood vessels, medication, caffeine and age.
- Subtraction assumes that adding a process does not change other processes.
- Small samples produce unreliable findings; test retest reliability of individual task activations is often low.
- The scanner is an artificial setting, and people with claustrophobia, metal implants or severe illness may be excluded.

## Conclusion
fMRI is a powerful, non invasive way to map brain activity, but its findings require careful design, correction and interpretation.`,
    keyPoints: ["Deoxyhaemoglobin and the BOLD contrast", "Ogawa 1990", "Haemodynamic lag and peak at 5 to 6 seconds", "Block, event related and resting state designs", "Subtraction logic", "Multiple comparisons and the dead salmon", "Reverse inference and other limits"],
    pitfalls: ["Saying fMRI shows thoughts directly", "Ignoring the time lag"],
    module: "brain/6-3",
    visuals: [chain("The haemodynamic response", [["Neural activity", "Time zero"], ["Blood flow rises", "More than oxygen use"], ["More oxygenated blood", "Signal rises from about 2 seconds"], ["Peak", "About 5 to 6 seconds"], ["Return to baseline", "About 15 to 20 seconds"]])],
    ref: "Ogawa et al 1990; Logothetis 2008; Bennett et al 2009 dead salmon; Poldrack 2006; Elliott et al 2020 fMRI reliability; Raichle 2001 default mode; brain module 6.3",
  },
  {
    id: "bio-l05-003",
    subject: S,
    topic: "neuroimaging",
    marks: 10,
    difficulty: 4,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Describe the methods of brain stimulation used in research and treatment: transcranial magnetic stimulation, transcranial direct current stimulation and deep brain stimulation.",
    plan: ["Why stimulation", "TMS", "tDCS", "DBS", "Comparison and ethics"],
    answer: `## Why stimulation
Imaging shows that a region is active during a task; stimulation can test whether it is necessary, by temporarily changing its activity. Stimulation is also used to treat disorders that do not respond to medicines.

## Transcranial magnetic stimulation
- Anthony Barker introduced TMS in 1985. A coil held against the scalp produces a brief, strong magnetic field that induces an electric current in the cortex beneath, depolarising neurons.
- Single pulses over the motor cortex cause a twitch in the opposite hand, used to measure the motor threshold. Pulses over the visual cortex can produce flashes of light.
- Repetitive TMS, rTMS: high frequency stimulation, around 10 Hz, tends to increase cortical excitability; low frequency, around 1 Hz, tends to reduce it.
- For depression, high frequency rTMS over the left dorsolateral prefrontal cortex, usually daily for four to six weeks, was approved in the United States in 2008 and is used in Indian centres. Theta burst stimulation shortens sessions to a few minutes.
- Uses in research include creating temporary virtual lesions, for example disrupting speech over Broca's area.
- Side effects: scalp discomfort, headache and, rarely, seizures.

## Transcranial direct current stimulation
- A weak constant current, usually 1 to 2 milliamps, passes between two scalp electrodes for about 20 minutes.
- It does not fire neurons but shifts their resting potential: anodal stimulation tends to increase excitability, cathodal to reduce it.
- It is cheap, portable and safe, causing tingling or itching, and is studied for depression, stroke rehabilitation and cognition. Results are mixed and effects vary between people.

## Deep brain stimulation
- Electrodes are surgically implanted in deep structures and connected to a pulse generator in the chest.
- Approved uses include Parkinson's disease, with electrodes in the subthalamic nucleus or globus pallidus, essential tremor and dystonia. It is used for severe refractory obsessive compulsive disorder.
- Helen Mayberg's 2005 study placed electrodes in the subgenual cingulate area for treatment resistant depression; later controlled trials gave mixed results.
- Risks include bleeding, infection and mood or personality changes.

## Comparison
| Method | Invasive | Mechanism | Main clinical use |
| TMS | No | Induced currents fire neurons | Depression, OCD |
| tDCS | No | Shifts resting potential | Research, depression trials |
| DBS | Yes, surgery | Continuous high frequency stimulation | Parkinson's disease, OCD |
ECT, which induces a generalised seizure under anaesthesia, remains the most effective stimulation treatment for severe depression.

## Ethics
Consent, especially for invasive methods, concerns about personality change, and the commercial sale of home tDCS devices without evidence raise ethical issues.

## Conclusion
Brain stimulation allows causal testing of brain function and offers treatments for resistant disorders, from non invasive TMS to surgical DBS.`,
    keyPoints: ["Stimulation tests necessity", "TMS principle, single pulse and rTMS frequencies", "rTMS over left DLPFC for depression", "tDCS anodal and cathodal effects", "DBS targets and uses", "Comparison table and ECT", "Ethical issues"],
    pitfalls: ["Saying tDCS fires neurons", "Confusing TMS with ECT"],
    module: "brain/6-3",
    visuals: [fig("tms", "Transcranial magnetic stimulation: where the coil goes for depression")],
    ref: "Barker et al 1985; George et al 2010; O'Reardon 2007; FDA 2008 rTMS; Blumberger 2018 theta burst; Nitsche and Paulus 2000 tDCS; Mayberg et al 2005; brain module 6.3",
  },
  {
    id: "bio-l05-004",
    subject: S,
    topic: "neuroimaging",
    marks: 15,
    difficulty: 4,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Discuss the major neuroimaging findings in schizophrenia and in major depression. What do they tell us about the biology of these disorders, and what are their limits?",
    plan: ["Purpose of imaging research in psychiatry", "Structural findings in schizophrenia", "Functional and neurochemical findings in schizophrenia", "Findings in depression", "Interpretation and limits"],
    answer: `## Purpose
Neuroimaging in psychiatry seeks brain differences that help explain symptoms, predict course and guide treatment. Findings come from thousands of patients, but they describe group averages.

## Schizophrenia: structural findings
- Enlarged lateral and third ventricles: first shown with CT in 1976 and confirmed in many MRI studies.
- Reduced total brain and grey matter volume, especially in the frontal and temporal cortex, superior temporal gyrus, hippocampus and thalamus. The ENIGMA consortium, analysing thousands of scans, found widespread cortical thinning.
- Changes are present at the first episode, before long term medication, supporting a neurodevelopmental origin, and some progressive loss occurs over the early years, which may be partly related to illness, cannabis use and antipsychotic medication.
- White matter: DTI shows reduced fractional anisotropy in tracts such as the arcuate fasciculus and corpus callosum, consistent with a disconnection hypothesis.

## Schizophrenia: functional and neurochemical findings
- Hypofrontality: reduced activation of the dorsolateral prefrontal cortex during working memory tasks such as the Wisconsin Card Sorting Test, related to negative and cognitive symptoms.
- Auditory hallucinations are associated with activity in the superior temporal gyrus and language areas, as if inner speech were misattributed.
- PET shows increased presynaptic dopamine synthesis and release in the striatum, especially the associative striatum, with the largest effect in people at high risk who later develop psychosis, as Oliver Howes and colleagues found. Antipsychotic response is linked to D2 receptor occupancy of about 65 to 80 per cent.
- Magnetic resonance spectroscopy suggests altered glutamate levels in some regions.

## Depression
- Reduced hippocampal volume, especially in recurrent and early onset depression, as ENIGMA found in about 9,000 people, possibly linked to stress hormones and reduced neurogenesis.
- Reduced volume and altered activity of the subgenual anterior cingulate cortex, which was the target in Mayberg's deep brain stimulation study.
- Amygdala hyperactivity to negative faces, which normalises with antidepressant treatment.
- Reduced activity in the dorsolateral prefrontal cortex and increased connectivity within the default mode network, linked to rumination.
- Reduced reward related activity in the ventral striatum, linked to anhedonia.
- These findings underlie the network model of depression as an imbalance between limbic emotion systems and prefrontal control systems.

## Bipolar disorder and other conditions
In bipolar disorder, white matter hyperintensities on MRI are more common, and lithium treated patients show larger grey matter and hippocampal volumes than untreated patients, possibly a neuroprotective effect. In obsessive compulsive disorder, PET and fMRI show overactivity in the orbitofrontal cortex, anterior cingulate and caudate, which falls after successful treatment with medication or behaviour therapy. These findings show that some imaging changes are state related and can reverse.

## Interpretation
| Finding | Disorder | Possible meaning |
| Large ventricles, grey matter loss | Schizophrenia | Abnormal neurodevelopment and pruning |
| Raised striatal dopamine synthesis | Schizophrenia | Aberrant salience causing psychosis |
| Hypofrontality | Schizophrenia | Cognitive and negative symptoms |
| Small hippocampus | Depression | Stress and glucocorticoid effects |
| Amygdala overactivity | Depression | Negative emotional bias |
| Subgenual cingulate changes | Depression | Mood regulation circuit |

## Limits
- Effect sizes are small to moderate with large overlap, so imaging cannot diagnose an individual.
- Findings are not specific: hippocampal and prefrontal changes also occur in bipolar disorder, PTSD and other conditions.
- Confounds: medication, substance use, smoking, illness duration, stress and lifestyle affect the brain.
- Cause and effect are unclear: a small hippocampus might predispose to depression or result from it.
- Indian studies, such as those at NIMHANS on antipsychotic naive schizophrenia, are valuable because they study patients before medication, reducing one confound.

## Conclusion
Imaging supports schizophrenia as a disorder of brain development, connectivity and dopamine, and depression as a disorder of limbic prefrontal circuits. These findings shape theories and new treatments but are not yet diagnostic tests.`,
    keyPoints: ["Group findings, not individual tests", "Ventricles and grey matter loss in schizophrenia from first episode", "DTI and disconnection", "Hypofrontality and hallucination circuits", "Raised presynaptic striatal dopamine on PET", "Depression: small hippocampus, subgenual cingulate, amygdala, default mode", "Interpretation table", "Limits: overlap, specificity, confounds, causality, Indian drug naive studies"],
    pitfalls: ["Presenting imaging as diagnostic", "Ignoring confounds"],
    module: "brain/6-4",
    visuals: [
      compare("Interpretation", ["Schizophrenia", ["Enlarged ventricles", "Hypofrontality", "Raised striatal dopamine synthesis"], "Development, connectivity, dopamine"], ["Depression", ["Smaller hippocampus", "Amygdala overactivity", "Subgenual cingulate changes"], "Limbic prefrontal imbalance"]),
      fig("ventricles", "Schizophrenia: structural findings start with the ventricles"),
    ],
    ref: "Johnstone 1976; van Erp et al 2018 ENIGMA schizophrenia; Weinberger 1986 hypofrontality; Howes et al 2012 meta-analysis dopamine synthesis; Kapur 2000 D2 occupancy; Schmaal et al 2016 ENIGMA MDD hippocampus; Mayberg 1997, 2005; NIMHANS drug-naive studies (Venkatasubramanian); brain module 6.4",
  },
  {
    id: "bio-l05-005",
    subject: S,
    topic: "behaviour-genetics",
    marks: 20,
    difficulty: 3,
    exams: ["cuet-pg", "ugc-net", "mcp-entrance", "md-psychiatry", "ma-semester"],
    question: "Describe the methods used to study the genetics of behaviour, from family, twin and adoption studies to molecular methods. Explain heritability and its misconceptions, with examples from psychiatric disorders.",
    plan: ["Genes and behaviour", "Family studies", "Twin studies", "Adoption studies", "Molecular methods", "Heritability and misconceptions"],
    answer: `## Genes and behaviour
Behaviour genetics asks how much of the variation in behaviour and psychological traits among people is due to genetic differences, and which genes are involved. Most behaviours and disorders are influenced by many genes, each with small effects, interacting with environment.

## Family studies
- If a trait is genetic, relatives should resemble each other in proportion to the genes they share: first degree relatives share about 50 per cent, second degree about 25 per cent.
- For schizophrenia, the lifetime risk is about 1 per cent in the general population, about 10 per cent in siblings or children of an affected person, and about 40 to 50 per cent in the child of two affected parents.
- Limitation: families share environments as well as genes, so family studies cannot separate the two.

## Twin studies
- Identical, monozygotic, twins share almost all their genes; fraternal, dizygotic, twins share about half on average. Both share family environment to a similar degree, the equal environments assumption.
- Concordance rates for schizophrenia are about 40 to 50 per cent in identical twins and about 10 to 15 per cent in fraternal twins.
- Falconer's formula estimates heritability as twice the difference between identical and fraternal correlations.
- The ACE model separates variance into additive genetic, A, common or shared environment, C, and unique environment, E.
- Twins reared apart, as in the Minnesota study, strengthen inferences.
- Limitations: identical twins may be treated more similarly; twins may not represent the general population; prenatal environments may differ.

## Adoption studies
- Adopted children are compared with their biological and adoptive relatives.
- Leonard Heston in 1966 found that children of mothers with schizophrenia, adopted away at birth, developed schizophrenia at rates similar to those raised by affected mothers, while control adoptees did not.
- The Danish adoption studies by Seymour Kety and colleagues found more schizophrenia spectrum disorders in biological than adoptive relatives of adoptees with schizophrenia.
- Limitations: selective placement, prenatal effects, and the rarity of adoption records in many countries, including India.

## Molecular methods
1. Linkage studies: follow markers through large families to locate genes for single gene disorders, such as Huntington's disease on chromosome 4 in 1993.
2. Candidate gene studies: test genes chosen for their biology, such as the serotonin transporter or COMT. Most findings failed to replicate because samples were small and effects tiny.
3. Genome wide association studies, GWAS: test hundreds of thousands to millions of common variants across the genome in very large samples. The Psychiatric Genomics Consortium's 2022 study of schizophrenia identified 287 associated regions.
4. Polygenic risk scores: add up a person's risk variants weighted by their effects; they explain a modest share of risk and are not yet clinically useful for individuals.
5. Copy number variants and rare variants: deletions such as 22q11.2 raise schizophrenia risk sharply, to about 25 per cent; exome sequencing finds rare damaging variants.
6. Epigenetic studies examine how experience changes gene expression.

## Heritability
Heritability is the proportion of variation in a trait in a particular population that is due to genetic variation. Estimates:
| Trait or disorder | Approximate heritability |
| Schizophrenia | About 80 per cent |
| Bipolar disorder | About 60 to 85 per cent |
| Autism | About 80 per cent |
| ADHD | About 70 to 80 per cent |
| Major depression | About 35 to 40 per cent |
| Personality traits | About 40 to 50 per cent |
| Intelligence in adults | About 50 to 80 per cent |

## Misconceptions
1. Heritability does not apply to individuals: 80 per cent heritability does not mean 80 per cent of a person's illness is genetic.
2. High heritability does not mean a trait cannot be changed: phenylketonuria is genetic, but a special diet prevents intellectual disability. Height is highly heritable yet has risen with nutrition.
3. Heritability is specific to a population and environment: if environments become more equal, heritability rises.
4. Differences between groups cannot be explained by heritability within groups.
5. Genetic does not mean present at birth: Huntington's disease appears in midlife.

## Conclusion
Family, twin and adoption studies show that genes contribute substantially to most psychological traits and disorders. Molecular methods confirm that this influence is spread across thousands of variants. Heritability describes populations and does not imply fate.`,
    keyPoints: ["Family risk figures for schizophrenia", "Twin concordance and Falconer's formula", "ACE model and equal environments assumption", "Heston and the Danish adoption studies", "Linkage, candidate genes, GWAS with 287 loci, polygenic scores", "Copy number variants such as 22q11.2", "Heritability table", "Five misconceptions about heritability"],
    pitfalls: ["Applying heritability to individuals", "Saying genetic means unchangeable"],
    module: "brain/5-6",
    visuals: [
      vis("experiment", { title: "Twin studies", question: "Approximate concordance for schizophrenia, per cent", unit: "%", conditions: [{ label: "General population", value: 1 }, { label: "Sibling or child", value: 10 }, { label: "Fraternal twin", value: 12 }, { label: "Child of two affected parents", value: 45 }, { label: "Identical twin", value: 45 }], why: "Risk rises with the share of genes, but even identical twins are only about half concordant, so environment matters too." }),
      chain("Molecular methods", [["Linkage", "Large families, single genes"], ["Candidate genes", "Mostly failed to replicate"], ["GWAS", "Thousands of common variants"], ["Polygenic scores", "Summed small effects"], ["Rare variants", "CNVs and exome sequencing"]]),
    ],
    ref: "Gottesman 1991 risk figures; Heston 1966; Kety et al 1968, 1994; Falconer 1965; Sullivan, Kendler and Neale 2003 schizophrenia heritability; Trubetskoy et al 2022 PGC 287 loci; Huntington's Disease Collaborative Research Group 1993; Polderman et al 2015; brain module 5.6",
  },
  {
    id: "bio-l05-006",
    subject: S,
    topic: "behaviour-genetics",
    marks: 15,
    difficulty: 4,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Critically discuss the genetics of schizophrenia and bipolar disorder. What have genome wide studies, copy number variants and gene environment research revealed?",
    plan: ["Evidence for genetic influence", "Common variants from GWAS", "Rare variants and CNVs", "Shared genetics across disorders", "Gene environment interplay", "Clinical implications"],
    answer: `## Evidence for genetic influence
Family, twin and adoption studies show that schizophrenia has a heritability of about 80 per cent and bipolar disorder about 60 to 85 per cent. Yet most people with these disorders have no affected first degree relative, because risk comes from many common variants spread across the population, each adding a little.

## Common variants
- Genome wide association studies have grown from a few thousand to hundreds of thousands of participants.
- The Psychiatric Genomics Consortium's 2022 study of about 76,000 people with schizophrenia and 243,000 controls found 287 associated genomic regions. Genes implicated include those for the dopamine D2 receptor, glutamate receptors, calcium channels such as CACNA1C, and synaptic proteins. The strongest single signal lies in the major histocompatibility complex on chromosome 6; part of it reflects variants in the complement component 4 gene, C4, which may increase synaptic pruning in adolescence, as Aswin Sekar and colleagues proposed in 2016.
- Bipolar disorder GWAS have found over 60 regions, including CACNA1C and ANK3.
- Polygenic risk scores currently explain about 7 to 10 per cent of variance in schizophrenia liability in European samples, less in other ancestries, because most studies were done in Europeans.

## Rare variants and copy number variants
- Copy number variants are deletions or duplications of stretches of DNA. Several raise schizophrenia risk greatly:
| Variant | Effect |
| 22q11.2 deletion | About 25 per cent develop psychosis; also heart defects, facial features, learning difficulties |
| 1q21.1, 15q13.3 and 16p11.2 changes | Raise risk of schizophrenia, autism and intellectual disability |
| 3q29 deletion | Among the highest known risks |
- Exome sequencing has found rare damaging mutations in genes such as SETD1A.
- A balanced translocation disrupting the DISC1 gene in a Scottish family was linked to schizophrenia, depression and bipolar disorder, but DISC1 is not supported by large GWAS.

## Shared genetics
- Schizophrenia and bipolar disorder share a large part of their common genetic risk, with a genetic correlation of about 0.6 to 0.7. Schizophrenia also overlaps with depression, autism and ADHD.
- This challenges sharp diagnostic boundaries and supports dimensional models of psychopathology.
- Many risk variants affect early brain development, consistent with the neurodevelopmental hypothesis.

## Gene environment interplay
- Environmental risk factors interact with genetic liability: obstetric complications, winter birth, urban upbringing, migration, childhood trauma and heavy cannabis use.
- People with higher polygenic risk may be more vulnerable to these factors, though evidence for specific interactions, such as COMT and cannabis, has been inconsistent.
- Gene environment correlation: genetic risk may influence the environments people experience.

## Clinical implications
- Genetic testing for CNVs, such as 22q11.2, is recommended in people with psychosis plus developmental delay or physical features, and helps genetic counselling.
- Polygenic scores are not yet useful for diagnosis or prediction in individuals.
- Genetic findings point to new drug targets, such as synaptic and calcium channel pathways.
- Lithium response appears partly heritable and is being studied genetically.
- Indian genetic studies are few; diverse samples are needed so that findings apply to all ancestries.

## A counselling example
A couple in Chennai, where the husband has schizophrenia, ask about the risk to their future child. Based on family studies, the psychiatrist explains that the child's lifetime risk is around 10 per cent, much higher than the general 1 per cent but still meaning that about nine in ten such children will not develop schizophrenia. There is no genetic test that can predict it. Avoiding cannabis, early help for difficulties and a supportive family can reduce environmental risks.

## Evaluation
Strengths: large, replicated findings that confirm a polygenic architecture. Limits: individual variants explain tiny risk, biological pathways are still unclear, and samples are mostly European.

## Conclusion
Schizophrenia and bipolar disorder are highly heritable but highly polygenic, with rare variants of large effect in a minority. Their shared genetics and neurodevelopmental roots challenge traditional categories, and genes act together with environment.`,
    keyPoints: ["Heritability figures and why most patients lack affected relatives", "PGC 2022: 287 regions", "Implicated genes and the C4 pruning hypothesis", "Polygenic scores explain a modest share, less in non European ancestries", "CNVs such as 22q11.2 with about 25 per cent psychosis risk", "DISC1 story and its limits", "Shared genetics across disorders", "Environment, testing and clinical implications"],
    pitfalls: ["Naming a single schizophrenia gene", "Presenting polygenic scores as diagnostic"],
    module: "brain/5-6",
    visuals: [
      layers("Common variants", "stack", [["Many common variants", "Each adds a tiny risk, found by GWAS"], ["Rare copy number variants", "Large risk, few people, such as 22q11.2"], ["Rare damaging mutations", "Found by sequencing, such as SETD1A"], ["Environment", "Trauma, cannabis, urban upbringing, migration"]]),
      compare("Shared genetics", ["Schizophrenia", ["Heritability about 80 per cent", "287 GWAS regions", "C4 and synaptic genes"], "Polygenic, neurodevelopmental"], ["Bipolar disorder", ["Heritability about 60 to 85 per cent", "Over 60 GWAS regions", "CACNA1C and ANK3"], "Overlaps strongly with schizophrenia"]),
    ],
    ref: "Trubetskoy et al 2022 Nature; Sekar et al 2016 C4; Mullins et al 2021 bipolar GWAS 64 loci; Marshall et al 2017 CNVs; Singh et al 2022 SCHEMA SETD1A; St Clair et al 1990 DISC1; Cross-Disorder Group 2013, 2019; brain module 5.6 and 7.1",
  },
  {
    id: "bio-l05-007",
    subject: S,
    topic: "behaviour-genetics",
    marks: 10,
    difficulty: 3,
    exams: ["cuet-pg", "ugc-net", "md-psychiatry", "ma-semester"],
    question: "What is epigenetics? Describe the main epigenetic mechanisms and discuss research showing how early experience can change gene expression and later behaviour.",
    plan: ["Definition", "Mechanisms", "Animal evidence: maternal care", "Human evidence", "Implications and cautions"],
    answer: `## Definition
Epigenetics refers to changes in gene activity that do not involve changes in the DNA sequence itself, which can be stable across cell divisions and sometimes generations. It is a mechanism by which environment and experience get under the skin.

## Mechanisms
1. DNA methylation: methyl groups attach to cytosine bases, usually at CpG sites in gene promoters, generally silencing the gene.
2. Histone modification: DNA is wrapped around histone proteins; adding acetyl groups loosens the wrapping and increases gene expression, while some methylation of histones tightens it.
3. Non coding RNAs, such as microRNAs, regulate the translation of messenger RNA.
These marks differ between tissues and change during development, so the same genome produces neurons, liver cells and skin.

## Animal evidence: maternal care
Michael Meaney and colleagues studied rats. Some mothers licked and groomed their pups frequently, others rarely. Pups of high licking mothers grew up calmer, with smaller stress hormone responses. In 2004 Ian Weaver showed that high licking led to less methylation of the promoter of the glucocorticoid receptor gene in the hippocampus, increasing receptor numbers and allowing better feedback control of the stress axis. Cross fostering showed the effect followed the rearing mother, not the biological mother, and drugs that altered histone acetylation reversed it in adulthood.

## Human evidence
- Patrick McGowan and colleagues in 2009 found greater methylation of the glucocorticoid receptor gene in the hippocampus of people who died by suicide and had been abused in childhood, compared with suicide victims without abuse and controls.
- The Dutch Hunger Winter of 1944 to 1945: people exposed to famine before birth showed different methylation of the IGF2 gene six decades later, and higher rates of obesity and, in some studies, schizophrenia.
- Childhood adversity and maternal depression are associated with methylation changes in stress related genes, such as FKBP5, in people with PTSD.
- Epigenetic clocks, based on methylation, estimate biological age and show acceleration with chronic stress.

## Implications
- Epigenetics explains how identical twins can become different, and how early care can have long lasting effects.
- It suggests that some effects of adversity might be reversible with intervention.
- Some psychiatric drugs, such as valproate, have epigenetic actions.

## Cautions
- Many human studies are small, use blood rather than brain tissue, and show associations, not causes.
- Claims of transgenerational inheritance in humans are weak.
- Popular accounts often exaggerate the findings.

## Conclusion
Epigenetics links experience and genes: early environment can alter gene expression through methylation and histone changes, shaping later stress responses and behaviour.`,
    keyPoints: ["Definition: expression changes without sequence change", "Methylation, histone modification, non coding RNA", "Meaney and Weaver rat maternal care studies and cross fostering", "McGowan 2009 human suicide study", "Dutch Hunger Winter", "FKBP5 and epigenetic clocks", "Cautions about human evidence"],
    pitfalls: ["Saying epigenetics changes the DNA sequence", "Overclaiming transgenerational effects"],
    module: "brain/5-6",
    visuals: [chain("Animal evidence: maternal care", [["High licking and grooming", "Rat mother"], ["Less methylation", "Glucocorticoid receptor gene"], ["More receptors in hippocampus", "Better feedback"], ["Calmer adult", "Smaller stress response"]])],
    ref: "Weaver et al 2004; Meaney 2001; McGowan et al 2009; Heijmans et al 2008 Dutch Hunger Winter; Klengel et al 2013 FKBP5; Horvath 2013 epigenetic clock; brain module 5.6",
  },
  {
    id: "bio-l05-008",
    subject: S,
    topic: "behaviour-genetics",
    marks: 5,
    difficulty: 2,
    exams: ["cuet-pg", "ugc-net", "ma-semester"],
    question: "Write a short note on chromosomal and single gene disorders with characteristic behavioural features.",
    plan: ["Behavioural phenotypes", "Chromosomal disorders", "Single gene and imprinting disorders", "Relevance"],
    answer: `## Behavioural phenotypes
Some genetic conditions produce typical patterns of behaviour, cognition and psychiatric risk, called behavioural phenotypes. Knowing them helps diagnosis and care.

## Chromosomal disorders
- Down syndrome, trisomy 21: usually caused by non disjunction, with risk rising with maternal age. Mild to moderate intellectual disability, sociable temperament, and early onset Alzheimer's disease, because the amyloid precursor protein gene is on chromosome 21.
- Turner syndrome, 45 X: short stature, usually normal verbal intelligence but difficulties with spatial skills and social cognition.
- Klinefelter syndrome, 47 XXY: tall stature, small testes, language and learning difficulties.
- 22q11.2 deletion syndrome: learning difficulties and a high risk of psychosis.
- Williams syndrome, 7q11.23 deletion: very sociable and talkative, with poor spatial skills and anxiety.

## Single gene and imprinting disorders
- Fragile X syndrome: expansion of a CGG repeat in the FMR1 gene on the X chromosome beyond about 200 repeats. The most common inherited cause of intellectual disability, with autistic features, gaze avoidance and hyperactivity; boys are more severely affected.
- Phenylketonuria: recessive deficiency of phenylalanine hydroxylase. Untreated, it causes intellectual disability; newborn screening and a low phenylalanine diet prevent it.
- Rett syndrome: MECP2 mutations in girls, with regression after normal early development and hand wringing.
- Prader Willi syndrome: loss of the paternal copy of 15q11 to 13; extreme overeating, obsessive behaviour and temper outbursts.
- Angelman syndrome: loss of the maternal copy of the same region; severe disability, happy demeanour, seizures. Prader Willi and Angelman illustrate genomic imprinting.

## Relevance
Psychologists assess intelligence, adaptive behaviour and needs, and these conditions are certified disabilities under Indian disability law.`,
    keyPoints: ["Behavioural phenotype definition", "Down syndrome and early Alzheimer's", "Turner and Klinefelter", "22q11.2 and Williams", "Fragile X CGG repeats", "PKU prevented by diet", "Prader Willi and Angelman imprinting"],
    pitfalls: ["Mixing up Prader Willi and Angelman parent of origin"],
    module: "brain/5-6",
    visuals: [compare("Single gene and imprinting disorders", ["Prader Willi syndrome", ["Paternal 15q11 to 13 lost", "Extreme overeating", "Obsessive behaviour"], "Father's copy missing"], ["Angelman syndrome", ["Maternal 15q11 to 13 lost", "Happy demeanour", "Seizures, severe disability"], "Mother's copy missing"])],
    ref: "Standard medical genetics: Down, Turner, Klinefelter, Williams, 22q11.2DS, fragile X (FMR1 >200 CGG), PKU, Rett MECP2, Prader-Willi and Angelman imprinting; RPwD Act 2016; brain module 5.6",
  },
  {
    id: "bio-l05-009",
    subject: S,
    topic: "psychopharmacology",
    marks: 15,
    difficulty: 3,
    exams: ["cuet-pg", "ugc-net", "mcp-entrance", "ma-semester"],
    question: "Explain the basic principles of pharmacokinetics and pharmacodynamics as they apply to psychotropic drugs.",
    plan: ["Two questions", "Absorption, distribution, metabolism, excretion", "Half life and steady state", "Receptor actions and dose response", "Tolerance, dependence and individual differences"],
    answer: `## Two questions
Pharmacokinetics is what the body does to a drug: how it is absorbed, distributed, metabolised and excreted. Pharmacodynamics is what the drug does to the body: how it acts on receptors and other targets to produce effects.

## Absorption
- Oral drugs are absorbed mainly from the small intestine. Food, gut motility and formulation affect the rate.
- Bioavailability is the fraction of a dose reaching the bloodstream unchanged. Drugs absorbed from the gut pass through the liver first, where some are metabolised, the first pass effect.
- Other routes include intramuscular depot injections, such as long acting antipsychotics given every two to four weeks, intravenous, sublingual and transdermal patches.

## Distribution
- Drugs travel bound to plasma proteins or free; only the free fraction is active.
- Psychotropic drugs must cross the blood brain barrier, which favours small, fat soluble molecules.
- The volume of distribution reflects how widely a drug spreads into tissues; fat soluble drugs such as diazepam accumulate in fat, prolonging their effects, especially in older adults.

## Metabolism
- Mainly in the liver by cytochrome P450 enzymes. Important ones include CYP2D6, CYP3A4, CYP1A2 and CYP2C19.
- Inducers speed metabolism and lower drug levels: carbamazepine and smoking, which induces CYP1A2 and lowers clozapine and olanzapine levels.
- Inhibitors slow metabolism and raise levels: fluoxetine and paroxetine inhibit CYP2D6; fluvoxamine inhibits CYP1A2, raising clozapine levels.
- Genetic differences make some people poor or ultrarapid metabolisers.
- Lithium is not metabolised; it is excreted unchanged by the kidneys.

## Excretion
Mainly by the kidneys. Dehydration, diuretics and some painkillers reduce lithium excretion and can cause toxicity.

## Half life and steady state
- Elimination half life is the time for the plasma concentration to fall by half.
- With repeated dosing, a drug reaches steady state, when intake equals elimination, after about four to five half lives. A drug also takes about four to five half lives to be almost fully eliminated after stopping.
- Drugs with short half lives, such as paroxetine or venlafaxine, cause more discontinuation symptoms; fluoxetine, with a long active metabolite, has fewer.
- Therapeutic drug monitoring is used for drugs with a narrow therapeutic range, such as lithium, usually 0.6 to 1.0 millimoles per litre for maintenance, measured 12 hours after the last dose.

## Pharmacodynamics
- Most psychotropics act on receptors, transporters, enzymes or ion channels.
- Affinity is how strongly a drug binds; efficacy is how much it activates the receptor once bound.
- Agonists activate receptors; antagonists block them; partial agonists, such as aripiprazole at dopamine D2 receptors, produce a submaximal response; inverse agonists produce the opposite effect.
- Examples: SSRIs block the serotonin transporter; antipsychotics block D2 receptors; benzodiazepines enhance GABA A receptors by binding at an allosteric site; MAOIs inhibit an enzyme.
- Dose response curves show potency, the dose needed for an effect, and efficacy, the maximum effect.
- The therapeutic index compares toxic and effective doses; lithium and tricyclics have narrow indices and are dangerous in overdose.

## Tolerance and dependence
- Tolerance: reduced response after repeated use, through receptor down regulation or faster metabolism.
- Physical dependence: withdrawal symptoms on stopping, as with benzodiazepines and alcohol.
- Delayed effects: antidepressants block reuptake within hours but improve mood only after two to six weeks, suggesting slower adaptive changes, such as receptor changes and neuroplasticity, are responsible.

## Individual differences
Age, sex, liver and kidney function, pregnancy, genetics, smoking and other drugs all change drug response. The rule start low, go slow is applied in older adults and children.

## Conclusion
Understanding pharmacokinetics and pharmacodynamics explains why doses, timing, interactions and monitoring matter for safe and effective psychiatric treatment.`,
    keyPoints: ["Definitions of pharmacokinetics and pharmacodynamics", "Bioavailability and first pass effect", "Blood brain barrier and volume of distribution", "CYP450 inducers and inhibitors with examples", "Half life and steady state at 4 to 5 half lives", "Lithium monitoring", "Agonist, antagonist, partial agonist; affinity and efficacy", "Therapeutic index, tolerance and delayed effects"],
    pitfalls: ["Confusing potency and efficacy", "Wrong steady state rule"],
    module: "brain/2-7",
    visuals: [
      fig("pk-steady-state", "Half life and steady state with repeated doses"),
      fig("partial-agonist", "Pharmacodynamics: full agonist, partial agonist and antagonist"),
    ],
    ref: "Standard pharmacology; Stahl's principles; lithium range per NICE/BAP; CYP interactions (smoking-clozapine CYP1A2, fluvoxamine); brain module 2.7",
  },
  {
    id: "bio-l05-010",
    subject: S,
    topic: "psychopharmacology",
    marks: 10,
    difficulty: 2,
    exams: ["cuet-pg", "ugc-net", "ma-semester"],
    question: "Classify psychotropic drugs and explain, with examples, how drugs can alter synaptic transmission.",
    plan: ["Classes of psychotropic drugs", "Steps of synaptic transmission", "Drug actions at each step", "Examples"],
    answer: `## Classes of psychotropic drugs
| Class | Examples | Main use |
| Antipsychotics | Haloperidol, risperidone, olanzapine, clozapine | Schizophrenia, mania |
| Antidepressants | Fluoxetine, sertraline, amitriptyline, venlafaxine | Depression, anxiety, OCD |
| Mood stabilisers | Lithium, valproate, lamotrigine | Bipolar disorder |
| Anxiolytics and hypnotics | Lorazepam, clonazepam, zolpidem | Anxiety, insomnia |
| Stimulants | Methylphenidate, amphetamine | ADHD, narcolepsy |
| Cognitive enhancers | Donepezil, memantine | Dementia |
Recreational drugs also act on the same systems: alcohol, nicotine, cannabis, opioids, cocaine and hallucinogens.

## Steps of synaptic transmission
1. Synthesis of the transmitter.
2. Storage in vesicles.
3. Release when the action potential arrives.
4. Binding to receptors on the postsynaptic cell.
5. Termination by reuptake into the presynaptic terminal or breakdown by enzymes.
6. Feedback through autoreceptors.

## Drug actions at each step
- Synthesis: levodopa is a precursor that increases dopamine synthesis in Parkinson's disease.
- Storage: reserpine depletes monoamines from vesicles and was found to cause depression, an early clue to the monoamine hypothesis.
- Release: amphetamine reverses transporters and releases dopamine and noradrenaline; botulinum toxin blocks acetylcholine release.
- Receptor binding:
1. Agonists mimic the transmitter, such as morphine at opioid receptors or nicotine at nicotinic receptors.
2. Antagonists block receptors, such as haloperidol at D2 receptors or naloxone at opioid receptors, which reverses overdose.
3. Partial agonists, such as aripiprazole and buprenorphine, give a moderate effect.
4. Positive allosteric modulators, such as benzodiazepines at the GABA A receptor, increase the effect of the natural transmitter.
- Reuptake: SSRIs block the serotonin transporter; cocaine blocks the dopamine transporter; tricyclics block serotonin and noradrenaline transporters.
- Breakdown: MAOIs inhibit monoamine oxidase; donepezil inhibits acetylcholinesterase.
- Autoreceptors: mirtazapine blocks alpha 2 autoreceptors, increasing noradrenaline and serotonin release.

## Side effects follow the same logic
Many side effects come from actions at receptors other than the intended target. Blocking histamine H1 receptors causes sedation and weight gain, as with olanzapine and mirtazapine. Blocking muscarinic acetylcholine receptors causes dry mouth, constipation, blurred vision, urinary retention and confusion, as with tricyclics. Blocking alpha 1 adrenergic receptors causes dizziness on standing. Blocking dopamine D2 receptors in the nigrostriatal pathway causes parkinsonian side effects, and in the tuberoinfundibular pathway raises prolactin. A drug's receptor profile therefore predicts both what it helps and what it harms.

## Conclusion
Drugs can act at every step of synaptic transmission. Knowing where a drug acts explains both its benefits and side effects.`,
    keyPoints: ["Main classes with examples", "Six steps of synaptic transmission", "Precursors and vesicle depletion", "Releasers and release blockers", "Agonists, antagonists, partial agonists, allosteric modulators", "Reuptake inhibitors and enzyme inhibitors", "Autoreceptor blockade"],
    pitfalls: ["Calling SSRIs serotonin agonists"],
    module: "brain/2-7",
    visuals: [fig("ssri-synapse", "Drug actions at each step: an SSRI at the synapse")],
    ref: "Standard psychopharmacology; Carlsson; reserpine depression observations 1950s; brain module 2.7",
  },
]);
