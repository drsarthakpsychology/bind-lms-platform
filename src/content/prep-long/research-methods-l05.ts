import type { LongQA } from "@/lib/prep/long-types";

const S = "research-methods" as const;

export const RESEARCH_METHODS_L05: LongQA[] = [
  {
    id: "rm-l05-041",
    subject: S,
    topic: "sampling",
    marks: 10,
    difficulty: 3,
    exams: ["mcp-entrance", "ugc-net", "ma-semester"],
    question: "Discuss the challenges of sampling in psychological research in India, with reference to a large national survey.",
    plan: ["Why sampling is harder in India", "Specific challenges: frames, diversity, language, literacy, gatekeepers, gender, stigma", "Example: design of the National Mental Health Survey", "Solutions", "Conclusion"],
    answer: `## Why it matters
Findings from a sample are only as general as the sample is representative. India's size and diversity make representative sampling difficult, and much Indian psychological research relies on convenience samples of urban college students, which cannot speak for the country's population of over 1.4 billion people.

## Challenges
- Incomplete sampling frames: there is often no reliable list of the population. Voter lists, ration card lists and census enumeration blocks are used, but they miss migrants, homeless people and others.
- Diversity: 22 scheduled languages and hundreds of dialects, large differences between states, urban and rural areas, castes, tribes and religions. A sample that ignores these strata will be biased.
- Language and translation: tools must be translated and validated in each language, which is costly; a single English version excludes most of the population.
- Literacy: self-administered questionnaires exclude many respondents, so interviewers are needed.
- Gatekeepers: village heads, family elders, school principals and hospital authorities control access; permission from them is necessary but may shape who is offered for interview.
- Gender: women may not be allowed to be interviewed alone, or may defer to male relatives, so female interviewers and private settings are needed.
- Stigma: mental illness and substance use are under-reported, and families may hide affected members.
- Mobility and seasonal migration: people may be absent for months.
- Hard-to-reach groups: tribal communities in remote areas, sex workers, transgender communities, people who use drugs, who require snowball or respondent-driven sampling.
- Over-reliance on clinical samples from tertiary hospitals, which over-represent severe and urban cases.

## Example: the National Mental Health Survey
The National Mental Health Survey of 2015 to 2016, led by NIMHANS, sampled about 34,800 adults across 12 states. It used multistage, stratified, random cluster sampling: districts were selected within each state, then taluks or urban wards, then villages and urban enumeration blocks, then households, with probability proportionate to size. All adults in selected households were interviewed with a translated, computer-assisted version of the MINI interview by trained field staff. It found a current prevalence of mental disorders (excluding tobacco use disorder) of about 10.6 percent in adults, and a treatment gap of over 70 percent for most disorders. The design shows how careful stratification, local languages and trained interviewers can achieve representative data in Indian conditions.

## Solutions
- Multistage cluster designs with stratification by state, region and urban or rural residence.
- Translation, back-translation and local validation of tools.
- Interviewer-administered tools, pictorial response scales and audio methods for low literacy.
- Female interviewers for women respondents.
- Building trust with communities and explaining confidentiality.
- Weighting results to correct for unequal selection and non-response.
- Reporting response rates and sample characteristics honestly.

## Conclusion
Sampling in India demands attention to diversity, language and social structure. Well-designed national surveys show that representative sampling is possible, but most small studies should be cautious in generalising beyond their sample.`,
    keyPoints: ["Problem of convenience student samples", "At least six specific challenges", "Hard-to-reach groups and snowball sampling", "NMHS design and sample size", "Key NMHS findings", "Practical solutions including weighting and translation"],
    module: "research-methods/2-1",
    visuals: [
      {
        kind: "flow",
        data: {
          title: "Multistage sampling in a national survey",
          layout: "chain",
          nodes: [
            { id: "s", label: "States", detail: "12 states chosen to represent regions." },
            { id: "d", label: "Districts", detail: "Selected within each state." },
            { id: "t", label: "Taluks and wards" },
            { id: "v", label: "Villages and urban blocks", detail: "Chosen with probability proportionate to size." },
            { id: "h", label: "Households", detail: "All adults interviewed in their own language." },
          ],
        },
      },
    ],
    ref: "Gururaj et al 2016 National Mental Health Survey of India 2015-16 Summary, NIMHANS Publication 128; Sinha 1986",
  },
  {
    id: "rm-l05-042",
    subject: S,
    topic: "sampling",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net"],
    question: "Write a short note on snowball sampling.",
    plan: ["Define snowball sampling", "Steps", "When it is used, with examples", "Limits and respondent-driven sampling"],
    answer: `## Meaning
Snowball (chain referral) sampling is a non-probability method in which the first participants, called seeds, are asked to recruit or name others who share the characteristic being studied. Those people recruit others, so the sample grows like a rolling snowball.

## Steps
- Identify a few initial participants who meet the criteria.
- Interview them and ask them to refer others they know.
- Contact the referred people, with their consent, and repeat until the target size or saturation is reached.

## When it is used
It suits hidden or hard-to-reach populations for whom there is no sampling frame and where trust matters:
- people who inject drugs,
- transgender and hijra communities,
- sex workers,
- survivors of trafficking,
- informal caregivers of people with rare disorders,
- expert networks, such as senior practitioners of a traditional healing system.

## Limits
- Not representative: people with large social networks are over-represented, and isolated members are missed.
- Homogeneous samples, since people refer others like themselves.
- Bias from the choice of seeds.
- Confidentiality risks, because participants know who else was referred.

## Improvement
Respondent-driven sampling, developed by Douglas Heckathorn, gives each participant a limited number of coupons to recruit others, records network sizes and uses statistical weighting to reduce bias. It has been widely used in HIV surveillance among high-risk groups in India.`,
    keyPoints: ["Definition and seeds", "Steps", "Hidden populations with examples", "Representativeness and homogeneity limits", "Respondent-driven sampling"],
    module: "research-methods/2-1",
    visuals: [
      { kind: "flow", data: { title: "How a snowball grows", layout: "tree", nodes: [{ id: "s", label: "Seed participant" }, { id: "a", label: "Referral A", parent: "s" }, { id: "b", label: "Referral B", parent: "s" }, { id: "a1", label: "A's referral", parent: "a" }, { id: "b1", label: "B's referral", parent: "b" }] } },
    ],
    ref: "Heckathorn 1997 Social Problems; Biernacki and Waldorf 1981",
  },
  {
    id: "rm-l05-043",
    subject: S,
    topic: "hypothesis-testing",
    marks: 10,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester", "mcp-entrance"],
    question: "Explain the logic of null hypothesis significance testing. What are its main criticisms, and what alternatives have been proposed?",
    plan: ["Steps of NHST", "What a p value is and is not", "Type I and II errors and power", "Criticisms", "Alternatives: effect sizes, confidence intervals, Bayesian methods, preregistration", "Conclusion"],
    answer: `## The logic
Null hypothesis significance testing (NHST) asks whether the observed data would be surprising if there were no effect in the population. It combines ideas from Ronald Fisher and from Jerzy Neyman and Egon Pearson.
- State the null hypothesis (H0: no difference or no relationship) and the alternative (H1).
- Choose the significance level alpha, usually 0.05.
- Collect data and calculate a test statistic, such as t or F.
- Find the p value: the probability of obtaining a result at least as extreme as the one observed, assuming H0 is true.
- If p is below alpha, reject H0 and call the result statistically significant; otherwise retain H0.

## What a p value is not
- It is not the probability that H0 is true.
- It is not the probability that the result happened by chance.
- One minus p is not the probability that the result will replicate.
- A non-significant result does not prove there is no effect.
- A small p does not mean a large or important effect.

## Errors and power
| Decision | H0 true | H0 false |
| Reject H0 | Type I error (alpha) | Correct, power (1 minus beta) |
| Retain H0 | Correct | Type II error (beta) |
Power, the probability of detecting a real effect, depends on effect size, sample size and alpha. Jacob Cohen recommended power of at least 0.80, but surveys showed many psychology studies had much lower power.

## Criticisms
- Dichotomous thinking: p = 0.049 and p = 0.051 are treated as different worlds.
- Significance depends heavily on sample size: with thousands of participants, trivial effects become significant.
- Misinterpretation is widespread, even among researchers.
- It answers a question few researchers care about: the null of exactly zero effect is rarely true.
- It encourages p-hacking and publication bias, central to the replication crisis.
- It ignores prior evidence and the plausibility of the hypothesis.
Cohen's famous paper "The earth is round (p < .05)" summed up these concerns, and in 2016 the American Statistical Association issued a statement warning against reliance on p values alone.

## Alternatives and reforms
- Report effect sizes (Cohen's d, r, eta squared) with confidence intervals, which show magnitude and precision.
- Meta-analytic thinking: judge evidence across studies, not from one p value.
- Bayesian methods: Bayes factors compare how well H0 and H1 predict the data and can show evidence for the null.
- Equivalence testing to show an effect is too small to matter.
- Preregistration and power analysis to reduce flexibility.
- Some have proposed lowering the default alpha to 0.005 for new claims.

## Conclusion
NHST is a useful but limited tool. Used carefully, with adequate power, effect sizes and confidence intervals, it helps guard against being fooled by chance; used mechanically, it has misled the field.`,
    keyPoints: ["Ordered steps of NHST", "Correct definition of p value", "Common misinterpretations", "Type I and II errors and power", "At least four criticisms", "Effect sizes, confidence intervals and Bayesian alternatives"],
    pitfalls: ["Defining p as the probability H0 is true", "Treating non-significance as proof of no effect"],
    module: "research-methods/1-3",
    visuals: [
      { kind: "curve", data: { kind: "normal", title: "Where a result falls if H0 is true", caption: "Move z: beyond plus or minus 1.96, a two-tailed p drops below 0.05." } },
    ],
    ref: "Cohen 1994 American Psychologist; Wasserstein and Lazar 2016 ASA statement; Benjamin et al 2018 redefine significance",
  },
  {
    id: "rm-l05-044",
    subject: S,
    topic: "experimental-design",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "cuet-pg"],
    question: "What is a pilot study? Why is it conducted?",
    plan: ["Define pilot study", "Purposes", "What is checked", "What a pilot is not for"],
    answer: `## Meaning
A pilot study is a small-scale trial run of a research project carried out before the main study, using the same procedures on a small sample similar to the target population. It is a rehearsal that tests whether the planned study is feasible.

## Purposes
- Test the tools: whether questions are understood, translated items carry the intended meaning, response options work, and the time needed to complete them.
- Check the procedure: instructions, order of tasks, equipment, timing and data recording.
- Estimate recruitment and retention: how many people agree to take part and how many drop out.
- Train and check research staff.
- Identify ethical or practical problems, such as distress caused by certain questions.
- Obtain rough estimates of variance to help plan the sample size.
- Try out data entry and analysis.

## Example
Before a survey of exam stress in 1,000 students in Gujarat, a researcher pilots a translated questionnaire with 30 students. She finds that the Gujarati word chosen for "irritable" is understood as "angry", that one page is often skipped, and that it takes 40 minutes rather than 20. She revises the items and layout before the main study.

## What a pilot is not for
A pilot is not meant to test the hypothesis, because the sample is too small and estimates of effect size from pilots are very unstable. Pilot data are usually not combined with the main study data.`,
    keyPoints: ["Definition", "At least four purposes", "Example", "Not for testing hypotheses"],
    module: "research-methods/2-3",
    visuals: [
      { kind: "reveal", data: { prompt: "A pilot of 20 students shows a large effect, d = 1.2. Should the main study use this to plan its sample size?", answer: "Not on its own. Effect sizes from tiny pilots are very unstable and often too large, which would make the main study underpowered. Use the pilot for feasibility and variance, and base the effect size on the literature or the smallest effect that would matter." } },
    ],
    ref: "Leon, Davis and Kraemer 2011 on pilot studies; van Teijlingen and Hundley 2001",
  },
  {
    id: "rm-l05-045",
    subject: S,
    topic: "qualitative-methods",
    marks: 15,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester", "mcp-entrance"],
    question: "Discuss action research and participatory research. How can they be used in community mental health in India?",
    plan: ["Define action research and Lewin's cycle", "Participatory action research and its principles", "Contrast with conventional research", "Indian examples in community mental health", "Strengths and criticisms", "Conclusion"],
    answer: `## Action research
Action research is research carried out to solve a practical problem and improve practice, in which the researcher works with those affected. Kurt Lewin introduced the term in the 1940s, describing a spiral of steps: planning, acting, observing and reflecting, which then leads to a revised plan. The aim is both to change a situation and to learn from the change. Teachers, nurses and community workers often act as researchers of their own practice.

## Participatory action research
Participatory action research (PAR) goes further by treating community members as co-researchers who share in every stage: defining the problem, collecting and analysing data, deciding actions and owning the results. It draws on Paulo Freire's idea of conscientisation, in which oppressed groups come to understand and challenge the conditions of their lives, and on Orlando Fals Borda's work in Latin America. Community-based participatory research is a related term in health.

## Principles
- Research with people, not on people.
- Local knowledge is valued alongside expert knowledge.
- Power is shared, and decisions are made together.
- The aim is empowerment and social change.
- Cycles of action and reflection continue over time.
- Methods are flexible and often mixed: community mapping, focus groups, photovoice (participants photograph their lives and discuss the images), surveys and records.

## Contrast with conventional research
| Feature | Conventional research | Participatory action research |
| Aim | Knowledge, generalisation | Change and knowledge |
| Role of participants | Subjects | Co-researchers |
| Who sets the question | Researcher | Researcher with community |
| Researcher's stance | Detached | Engaged, facilitator |
| Outcome | Publication | Action, empowerment and publication |

## Uses in Indian community mental health
- Training lay health workers: the MANAS trial in Goa developed a collaborative stepped care model in which lay health counsellors delivered psychological treatments in primary care. Later programmes such as the Healthy Activity Program and PRIDE for adolescents were developed through extended cycles of consultation, piloting and revision with counsellors, patients and communities.
- Women's groups: participatory learning and action cycles with women's groups in Jharkhand and Odisha, run by the organisation Ekjut, reduced neonatal deaths and have been extended to maternal mental health.
- Reducing stigma: communities can identify local beliefs about mental illness, plan awareness events with local leaders and faith healers, and evaluate change.
- Schools: teachers and students identifying sources of bullying or exam stress and designing their own responses.
- Rehabilitation: involving people with mental illness and their families in designing livelihood and self-help programmes, as in community-based rehabilitation in rural Karnataka.
- Faith healing centres: collaborative projects with dargahs and temples, such as the Dava-Dua programme in Tamil Nadu, combined medical care with traditional healing in partnership with the community.

## Steps in a typical project
- Entry and trust building: meeting community leaders, self-help groups and health workers, and agreeing the purpose together.
- Joint problem definition: for example, community members identify alcohol use by men and resulting domestic conflict as the main threat to women's mental health.
- Data gathering by co-researchers: local women trained to run group discussions and simple surveys.
- Collective analysis and action planning: the group chooses actions such as forming support groups and approaching the panchayat.
- Action, monitoring and reflection, followed by a new cycle.
- Sharing results with the community before publishing them.

## Strengths
- Findings are relevant and more likely to be used.
- Builds local capacity and ownership, which helps sustainability.
- Respects culture and local knowledge, reducing the imposition of foreign models.
- Reaches marginalised groups.

## Criticisms
- Lower internal validity and difficulty establishing causation.
- Hard to generalise, as each project is local.
- Time-consuming, and power is never fully equal: researchers still control funding and publication.
- Conflicts within communities can derail projects.
- Ethical complexity about consent and confidentiality in groups.

## Conclusion
Action research and PAR fit India's community mental health needs, where the treatment gap is wide and services must be shaped by local realities. Combined with rigorous evaluation, as in trials of lay counsellor programmes, they can produce interventions that are both effective and owned by the communities that use them.`,
    keyPoints: ["Lewin's action research cycle", "PAR principles and Freire", "Comparison with conventional research", "At least two Indian examples", "Photovoice or other methods", "Balanced strengths and criticisms"],
    module: "research-methods/3-1",
    visuals: [
      {
        kind: "flow",
        data: {
          title: "Lewin's action research spiral",
          layout: "cycle",
          nodes: [
            { id: "p", label: "Plan", detail: "Define the problem with the community." },
            { id: "a", label: "Act", detail: "Try a change." },
            { id: "o", label: "Observe", detail: "Collect data on what happens." },
            { id: "r", label: "Reflect", detail: "Learn together and revise the plan." },
          ],
        },
      },
    ],
    ref: "Lewin 1946; Freire 1970; Patel et al 2010 MANAS Lancet; Tripathy et al 2010 Ekjut Lancet; Patel et al 2017 HAP",
  },
  {
    id: "rm-l05-046",
    subject: S,
    topic: "qualitative-methods",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net"],
    question: "What is content analysis? Describe its steps and distinguish quantitative from qualitative content analysis.",
    plan: ["Define content analysis", "Materials analysed", "Steps with an example", "Quantitative versus qualitative content analysis", "Strengths and limits"],
    answer: `## Meaning
Content analysis is a research method for systematically describing the content of communication, such as texts, images, speeches, advertisements, films or social media posts. Bernard Berelson defined it as an objective, systematic and quantitative description of the manifest content of communication. It is an unobtrusive method: the material already exists, so the researcher does not affect it.

## Materials
Newspapers, television, textbooks, diaries, letters, case records, interview transcripts, children's drawings, songs and online posts. Example: how Indian newspapers report suicide, or how gender roles are shown in school textbooks or television advertisements.

## Steps
- Define the research question, for example "Do Indian newspapers follow responsible reporting guidelines when covering suicide?"
- Define the population of materials and draw a sample, such as all suicide reports in four national dailies over one year.
- Decide the unit of analysis: a word, sentence, theme, article, image or character.
- Develop a coding scheme with clear categories, such as method described in detail, photograph of the person, word "commit", helpline information given.
- Train coders and pilot the scheme on some material.
- Code the material, ideally with two independent coders.
- Check inter-coder reliability using Cohen's kappa or Krippendorff's alpha.
- Analyse and interpret: count frequencies, compare across newspapers or years, and relate findings to theory and guidelines.
Studies of this kind in India have found frequent breaches of the WHO media guidelines, such as detailing the method and using sensational headlines, and rare mention of helplines.

## Quantitative versus qualitative content analysis
| Feature | Quantitative | Qualitative |
| Focus | Manifest content, what is visible | Latent meaning and context |
| Categories | Fixed in advance | Developed from the data, or both |
| Output | Frequencies, percentages, statistics | Themes and interpretations |
| Reliability | Checked statistically | Through transparency and reflexivity |
| Example | Counting how often women appear as doctors in ads | Exploring how ads construct the "ideal wife" |

## Strengths
- Unobtrusive and non-reactive.
- Can study trends over long periods and across media.
- Cheap and easy to replicate when the coding scheme is clear.

## Limits
- Describes content but not its effect on audiences.
- Coding may be subjective.
- Restricted to recorded communication.
- Latent meanings are hard to code reliably.

## Conclusion
Content analysis lets psychologists study how society talks about people and problems, and with careful coding and reliability checks it provides solid evidence for media guidelines and education policy.`,
    keyPoints: ["Definition and unobtrusive nature", "Examples of materials", "Ordered steps including unit of analysis and coding scheme", "Inter-coder reliability", "Quantitative versus qualitative contrast", "Strengths and limits"],
    module: "research-methods/3-1",
    visuals: [
      { kind: "compare", data: { title: "Two kinds of content analysis", a: { label: "Quantitative", points: ["Counts visible features", "Fixed categories", "Statistics"], summary: "How often." }, b: { label: "Qualitative", points: ["Interprets meaning", "Categories emerge", "Themes"], summary: "What it means." } } },
    ],
    ref: "Berelson 1952; Krippendorff, Content Analysis; Armstrong et al 2018 on Indian press suicide reporting",
  },
  {
    id: "rm-l05-047",
    subject: S,
    topic: "correlational-design",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net"],
    question: "Write a short note on ex post facto research.",
    plan: ["Define ex post facto", "Example", "Why it is used", "Limitations"],
    answer: `## Meaning
Ex post facto means "after the fact". In ex post facto research the independent variable has already occurred, and the researcher cannot manipulate it or assign people to levels of it. Instead, people who differ on the variable are compared on the outcome, or people with the outcome are compared on possible past causes. Fred Kerlinger defined it as systematic empirical inquiry in which the scientist does not have direct control of independent variables.

## Example
A researcher compares the academic achievement of children whose parents divorced with children of intact families. Or, looking backwards, a researcher compares adults with and without depression on reported childhood adversity.

## Why it is used
- Many important variables cannot ethically or practically be manipulated: divorce, trauma, gender, caste, disability, brain injury, smoking.
- It allows study of real-life events.
- It generates hypotheses for further work.

## Limitations
- No random assignment, so groups may differ in many other ways (self-selection). Children of divorced parents may also differ in income and parental conflict.
- Cannot establish cause; only association.
- Risk of post hoc reasoning, choosing explanations after seeing results.
- Retrospective designs depend on memory, which may be biased by the current state (recall bias).

## Control
Researchers try to match groups on relevant variables, use statistical control, and test alternative explanations. Despite its limits, ex post facto research is a major source of knowledge in clinical and developmental psychology.`,
    keyPoints: ["Meaning after the fact", "Kerlinger's definition", "Example", "Reasons for use", "Self-selection and causal limits", "Recall bias"],
    module: "research-methods/2-6",
    visuals: [
      { kind: "reveal", data: { prompt: "Is a study comparing smokers and non-smokers on anxiety an experiment or ex post facto research?", answer: "Ex post facto. The researcher did not assign people to smoke, so smokers may differ in many other ways, and anxiety could even lead to smoking." } },
    ],
    ref: "Kerlinger ch 23",
  },
  {
    id: "rm-l05-048",
    subject: S,
    topic: "apa-writing",
    marks: 10,
    difficulty: 2,
    exams: ["mcp-entrance"],
    question: "Interview question: \"Tell us about a research problem you would like to work on during your clinical psychology training, and how you would study it.\" How should a candidate structure a strong answer? Give a model answer.",
    plan: ["What the panel is assessing", "Structure: problem, gap, question, design, measures, ethics, analysis, relevance", "Model answer on a specific topic", "Likely follow-up questions", "Common mistakes"],
    answer: `## What the panel is assessing
Interview panels for clinical psychology programmes use this question to judge whether a candidate can think like a scientist-practitioner: identify a meaningful problem, know the literature, choose a suitable design, and see ethical and practical issues. They are not expecting a finished thesis, but a clear, feasible plan explained in about two minutes.

## A good structure
- The problem and why it matters, ideally linked to Indian clinical needs.
- What is known and the gap.
- A focused research question and hypothesis.
- Design and sample.
- Measures.
- Ethics.
- Analysis in one sentence.
- Expected contribution.

## Model answer
"I would like to study caregiver burden in families of people with schizophrenia in Gujarat. In India most people with schizophrenia live with their families, and studies have shown high burden, especially for mothers, but most research describes burden rather than testing ways to reduce it. My question is whether a brief, structured psychoeducation programme delivered in Gujarati reduces caregiver burden and expressed emotion compared with usual outpatient care.

I would run a randomised controlled trial in a psychiatry outpatient department. About 80 primary caregivers would be randomly assigned to six weekly group sessions of psychoeducation or to usual care, which they would receive in either case. My hypothesis is that the psychoeducation group will show a greater fall in burden at three months.

I would measure burden with a standard caregiver burden scale validated in India, expressed emotion with a brief rating, and the patient's relapse and readmission from records. Ethical issues include informed consent in Gujarati, assurance that refusing will not affect the patient's treatment, and offering the programme to the control group afterwards. I would analyse change with an analysis of covariance controlling for baseline burden, and report effect sizes.

If it works, the programme could be delivered by trained nurses or psychologists in district hospitals under the District Mental Health Programme."

## Likely follow-up questions
- Why not a qualitative study? (Answer: a qualitative phase could first explore what caregivers need, making it a mixed methods project.)
- How would you control for the extra attention the intervention group receives? (An attention-matched control, such as general health talks.)
- What is expressed emotion? (Critical comments, hostility and emotional over-involvement, which predict relapse, shown by George Brown and Julian Leff.)
- How did you decide the sample size? (Power analysis for a moderate effect.)

## Common mistakes
- Choosing a vague topic such as "stress in youth" with no question.
- Proposing a design that does not answer the question, such as a correlational study for a causal claim.
- Forgetting ethics or feasibility.
- Over-promising, such as nationwide samples for a two-year degree.
- Not knowing basic literature in the area.

## Conclusion
A strong answer is specific, feasible, relevant to Indian practice, and shows awareness of design, measurement and ethics. Practising it aloud helps candidates speak confidently and handle follow-up questions.`,
    keyPoints: ["Knows what panels assess", "Clear structure from problem to contribution", "Specific, feasible question", "Appropriate design with control group", "Named measures and ethics", "Prepared for follow-up questions"],
    pitfalls: ["Vague topics", "Designs that cannot answer the question"],
    module: "research-methods/3-4",
    visuals: [
      { kind: "flow", data: { title: "A two-minute research pitch", layout: "chain", nodes: [{ id: "p", label: "Problem and relevance" }, { id: "g", label: "Gap" }, { id: "q", label: "Question and hypothesis" }, { id: "d", label: "Design, sample, measures" }, { id: "e", label: "Ethics and analysis" }, { id: "c", label: "Contribution" }] } },
    ],
    ref: "Brown, Birley and Wing 1972; Leff and Vaughn 1985 expressed emotion; Indian studies of caregiver burden (Chakrabarti 2011 IJP review)",
  },
  {
    id: "rm-l05-049",
    subject: S,
    topic: "validity-threats",
    marks: 20,
    difficulty: 4,
    exams: ["mcp-entrance", "md-psychiatry", "ugc-net"],
    question: "Discuss the threats to validity in randomised controlled trials of psychological treatments, and how they are addressed.",
    plan: ["Why RCTs are the standard and why they still go wrong", "Bias in allocation, blinding, attrition and reporting", "Threats specific to psychotherapy trials: control conditions, therapist effects, allegiance, fidelity", "Statistical and external validity threats", "Remedies: CONSORT, registration, ITT, risk of bias tools", "Conclusion"],
    answer: `## Introduction
A randomised controlled trial (RCT) compares a treatment with a control condition after random allocation of participants. It is regarded as the gold standard for testing treatments because randomisation balances known and unknown confounders on average. Yet trials can still be biased, and psychological treatments raise special problems because they cannot be given as a pill and are hard to blind. The standard risk of bias tool for trials groups the main threats into domains, which form a useful structure.

## Bias arising from randomisation
- Inadequate sequence generation: allocating by date of birth or alternate admission is predictable.
- Lack of allocation concealment: if recruiters can foresee the next allocation, they may enrol healthier patients into the treatment arm. Concealment through central computer randomisation or sealed opaque envelopes prevents this.
- Baseline imbalance by chance in small trials, addressed by stratified or block randomisation and adjusting for baseline scores.

## Bias from deviations from intended treatment
- Participants and therapists cannot be blind in psychotherapy, so expectations and enthusiasm differ between arms.
- Contamination: control participants get similar help elsewhere.
- Poor treatment fidelity: therapists drift from the manual. Remedies include manuals, training, supervision and rating recorded sessions for adherence and competence.

## Bias from missing outcome data
- Attrition: dropouts differ systematically, such as patients who do not improve leaving therapy.
- Per-protocol analysis, analysing only completers, exaggerates benefit.
- Intention-to-treat analysis includes everyone randomised in their assigned group, with principled methods for missing data such as multiple imputation or mixed models.

## Bias in measuring outcomes
- Unblinded assessors may rate improvement more generously. Independent assessors blind to allocation are essential.
- Self-report outcomes are vulnerable to demand characteristics and the wish to please the therapist.
- Using several outcomes, including clinician ratings, functioning and objective indicators, reduces this.

## Bias in selecting reported results
- Outcome switching: reporting the outcome that happened to be significant.
- Selective reporting of time points or subgroups.
- Publication bias, where negative trials go unpublished. Prospective registration in a trial registry, such as the Clinical Trials Registry of India, and published protocols prevent this.

## Threats special to psychotherapy trials
- Choice of control condition: comparing therapy with a wait-list makes effects look large, because wait-listed people may even deteriorate when expecting future help. Treatment as usual, attention placebo and active comparisons give more conservative estimates.
- Therapist effects: some therapists get better results than others. If one therapist delivers one arm, therapist and treatment are confounded. Several therapists per arm, and multilevel analysis with therapists as a level, deal with this.
- Researcher allegiance: trials run by developers of a therapy find larger effects, as Lester Luborsky showed. Independent replication and including advocates of both treatments help.
- Non-specific factors: alliance, expectancy and attention may explain much of the change, so active controls are needed to show specific effects.
- Equipoise and ethics: withholding treatment from a control group raises concern for severe conditions.

## Statistical conclusion validity
- Small samples and low power, leading to unstable effects and missed effects.
- Multiple outcomes without correction.
- Wrong analysis of clustered data (for example group therapy, where members influence each other).

## External validity
- Strict exclusion criteria (no comorbidity, no suicidality, no substance use) mean trial patients differ from clinic patients.
- Highly trained therapists in academic centres differ from routine practitioners.
- Few trials in low and middle-income countries until recently. Pragmatic trials in routine settings, such as Indian trials of lay counsellor-delivered behavioural activation and problem-solving therapy for adolescents, address this.
- Effectiveness versus efficacy: efficacy trials ask whether a treatment can work under ideal conditions; effectiveness trials ask whether it works in real practice.

## Reporting standards and appraisal
The CONSORT statement requires a flow diagram of participants and reporting of randomisation, concealment, blinding, attrition and all outcomes. Readers use risk of bias tools and the GRADE system to judge the certainty of evidence.

## Conclusion
Randomisation solves selection bias but not every problem. Psychotherapy trials need concealed allocation, blind assessment, intention-to-treat analysis, credible control conditions, attention to therapists and allegiance, preregistration and diverse, real-world samples. A clinician reading a trial should ask about each of these before trusting the headline effect size.`,
    keyPoints: ["Why RCTs are the standard", "Sequence generation and allocation concealment", "Blinding limits in psychotherapy", "Attrition with ITT versus per protocol", "Outcome switching and registration", "Wait-list versus active controls", "Therapist effects and allegiance", "CONSORT, efficacy versus effectiveness and Indian pragmatic trials"],
    pitfalls: ["Assuming randomisation removes all bias", "Ignoring the control condition problem"],
    module: "research-methods/2-4",
    visuals: [
      {
        kind: "sort",
        data: {
          prompt: "Which remedy fixes each threat?",
          buckets: ["Allocation concealment", "Intention to treat", "Blind assessors", "Trial registration"],
          items: [
            { text: "Recruiters steer milder cases into therapy", bucket: 0 },
            { text: "Non-improvers drop out of the therapy arm", bucket: 1 },
            { text: "The therapist rates her own patients' progress", bucket: 2 },
            { text: "Only the significant outcome is reported", bucket: 3 },
          ],
        },
      },
      {
        kind: "compare",
        data: {
          title: "Efficacy versus effectiveness",
          a: { label: "Efficacy trial", points: ["Ideal conditions", "Strict inclusion", "Expert therapists"], summary: "Can it work?" },
          b: { label: "Effectiveness trial", points: ["Routine settings", "Real patients with comorbidity", "Ordinary staff or lay counsellors"], summary: "Does it work in practice?" },
        },
      },
    ],
    ref: "Higgins et al 2019 RoB 2; Schulz et al 2010 CONSORT; Luborsky et al 1999 allegiance; Cuijpers et al on wait-list controls; Michelson et al 2020 PRIDE trials India",
  },
  {
    id: "rm-l05-050",
    subject: S,
    topic: "qualitative-methods",
    marks: 15,
    difficulty: 4,
    exams: ["ugc-net", "ma-semester", "mcp-entrance"],
    question: "Compare and contrast grounded theory and interpretative phenomenological analysis as approaches to qualitative research.",
    plan: ["Introduce both and their aims", "Philosophical roots", "Sampling, data collection and analysis in each", "Comparison table", "Choosing between them with an example", "Conclusion"],
    answer: `## Introduction
Grounded theory (GT) and interpretative phenomenological analysis (IPA) are two of the most widely used qualitative approaches in psychology. Both use interviews and inductive analysis, but they ask different questions: grounded theory asks how a social process works and aims to build a theory of it, while IPA asks what an experience is like for particular people and how they make sense of it.

## Grounded theory
- Origins: developed by sociologists Barney Glaser and Anselm Strauss in 1967, partly to challenge the idea that research should only test grand theories. It later split into Glaser's classic version, Strauss and Juliet Corbin's more procedural version, and Kathy Charmaz's constructivist grounded theory.
- Philosophy: rooted in symbolic interactionism and pragmatism; in its classic form close to a realist view that theory can be discovered in data, while constructivist GT sees theory as co-constructed.
- Aim: to generate an explanatory theory of a process or action grounded in the data, such as how people with diabetes come to manage their illness.
- Sampling: begins purposively, then uses theoretical sampling, choosing further participants to develop emerging categories, until theoretical saturation, when new data add nothing new.
- Analysis: data collection and analysis alternate. Open coding breaks data into concepts; focused or axial coding links categories; selective or theoretical coding builds a core category. Constant comparison of incidents, codes and categories, and memo-writing, are central.
- Product: a theory or model, often with a core category and diagram.
- Sample size: often 20 to 30 interviews or more.

## Interpretative phenomenological analysis
- Origins: developed by Jonathan Smith in the 1990s within health psychology.
- Philosophy: phenomenology (Edmund Husserl's focus on experience as lived, and Martin Heidegger's view of people as beings in a world), hermeneutics (interpretation) and idiography (focus on the particular).
- Aim: a detailed examination of how particular people experience and make sense of significant life events, such as receiving a diagnosis of HIV or living with chronic pain.
- Double hermeneutic: the researcher tries to make sense of the participant trying to make sense of their experience.
- Sampling: small, purposive, fairly homogeneous samples, often 3 to 10 participants, so each case can be explored deeply.
- Data: rich semi-structured interviews.
- Analysis: case by case. The researcher reads a transcript repeatedly, makes exploratory notes on content, language and concepts, develops experiential statements, clusters them into personal themes for that case, then moves to the next case, and finally looks for patterns across cases, producing group themes while keeping individual voices.
- Product: themes presented with extensive quotations and interpretation.

## Comparison
| Feature | Grounded theory | IPA |
| Main question | How does a process work? | What is this experience like? |
| Roots | Sociology, symbolic interactionism | Phenomenology, hermeneutics, idiography |
| Aim | Build explanatory theory | Understand lived experience |
| Sample | Larger, theoretical sampling | Small, homogeneous, purposive |
| Data collection and analysis | Alternate in cycles | Usually data first, then analysis |
| Unit of analysis | Concepts across cases | Each case in depth, then across |
| Key techniques | Coding levels, constant comparison, memos | Close reading, experiential statements, double hermeneutic |
| End point | Theoretical saturation | Depth and insight, no saturation needed |
| Product | Model with a core category | Themes rich in quotations |

## Similarities
- Both are inductive and stay close to participants' words.
- Both use purposive sampling and semi-structured interviews.
- Both value reflexivity and transparency.
- Both can inform practice and further quantitative research.

## Choosing between them
Suppose a researcher is interested in young women recovering from anorexia nervosa. If she asks "What is it like to recover, and what does recovery mean to these women?", IPA fits, with six or eight women interviewed in depth. If she asks "How do young women move from illness to recovery, and what conditions help or hinder this process?", grounded theory fits, with theoretical sampling of women at different stages, perhaps families and clinicians, until a model of the recovery process emerges.

## Conclusion
Grounded theory and IPA share qualitative values but differ in purpose, philosophy, sampling and product. The research question should decide the approach: process and explanation call for grounded theory, lived experience and meaning call for IPA. Mixing their techniques without acknowledging the difference, sometimes called method slurring, weakens a study.`,
    keyPoints: ["Founders and origins of both", "Philosophical roots", "Theoretical sampling and saturation in GT", "Coding stages and constant comparison", "Double hermeneutic and idiography in IPA", "Comparison table across at least six features", "Example showing how the question decides the approach", "Similarities noted"],
    pitfalls: ["Describing both as the same thematic method", "Claiming IPA needs saturation"],
    module: "research-methods/3-1",
    visuals: [
      {
        kind: "compare",
        data: {
          title: "Grounded theory versus IPA",
          a: { label: "Grounded theory", points: ["Asks how a process works", "Theoretical sampling to saturation", "Produces a model with a core category"], summary: "Explanation." },
          b: { label: "IPA", points: ["Asks what an experience is like", "Small homogeneous sample", "Case by case, then across cases"], summary: "Lived meaning." },
        },
      },
      {
        kind: "flow",
        data: {
          title: "Coding in grounded theory",
          layout: "chain",
          nodes: [
            { id: "o", label: "Open coding", detail: "Label small segments of data." },
            { id: "f", label: "Focused or axial coding", detail: "Group and link codes into categories." },
            { id: "t", label: "Theoretical coding", detail: "Integrate categories around a core category." },
            { id: "s", label: "Saturation", detail: "New data add nothing new to the categories." },
          ],
        },
      },
    ],
    ref: "Glaser and Strauss 1967; Charmaz 2014 Constructing Grounded Theory; Smith, Flowers and Larkin 2009 and 2022 IPA; Baker, Wuest and Stern 1992 method slurring",
  },
];
