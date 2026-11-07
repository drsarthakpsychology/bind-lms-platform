import type { LongQA } from "@/lib/prep/long-types";

const S = "research-methods" as const;

export const RESEARCH_METHODS_L03: LongQA[] = [
  {
    id: "rm-l03-021",
    subject: S,
    topic: "meta-analysis",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance", "md-psychiatry"],
    question: "What is meta-analysis? Describe the steps in conducting one and discuss the problems of heterogeneity and publication bias.",
    plan: ["Define meta-analysis and contrast with a narrative review", "Steps from question to synthesis", "Effect sizes and pooling, fixed versus random effects", "Heterogeneity and its measures", "Publication bias and funnel plots", "Strengths, critique and conclusion"],
    answer: `## Meaning
Meta-analysis is a statistical method for combining the quantitative results of many independent studies on the same question to estimate an overall effect. Gene Glass coined the term in 1976 when he pooled hundreds of psychotherapy outcome studies, in reply to Hans Eysenck's claim that psychotherapy was no better than spontaneous remission. Glass and Mary Lee Smith found that the average treated client was better off than about 75 to 80 percent of untreated controls. A meta-analysis is usually the final step of a systematic review, which uses explicit, reproducible methods to find and appraise all relevant studies. A traditional narrative review, in contrast, relies on the author's selection and judgement and simply counts studies as positive or negative ("vote counting"), which ignores sample size and effect size.

## Steps
- Formulate a precise question, often in PICO form: population, intervention, comparison, outcome. Example: in adults with depression (P), does behavioural activation (I) compared with usual care (C) reduce depressive symptoms (O)?
- Register a protocol in advance, for example in PROSPERO, stating methods before seeing results.
- Search systematically across databases (PsycINFO, PubMed, Scopus), reference lists and unpublished sources such as theses and trial registries.
- Screen studies against inclusion and exclusion criteria, with two independent reviewers. The PRISMA flow diagram reports how many records were found, screened, excluded and included.
- Extract data: sample sizes, means, standard deviations, moderators such as age or country.
- Assess study quality and risk of bias, for example with a standard risk of bias tool for trials.
- Convert results to a common effect size: Cohen's d or Hedges' g for mean differences, r for correlations, odds ratio or risk ratio for binary outcomes.
- Pool effect sizes, weighting each study by the inverse of its variance, so larger, more precise studies count more. Present the results in a forest plot.
- Examine heterogeneity, moderators and publication bias, and run sensitivity analyses.
- Interpret and grade the certainty of evidence, for example with the GRADE approach.

## Fixed and random effects
A fixed-effect model assumes all studies estimate one true effect and differ only by sampling error. A random-effects model assumes true effects vary across studies (because of different populations and methods) and estimates the mean of that distribution. Random effects is usually more realistic in psychology and gives wider confidence intervals.

## Heterogeneity
Heterogeneity is variation in results beyond what chance would produce.
- Cochran's Q tests whether heterogeneity is present.
- I squared estimates the percentage of variation due to real differences: roughly 25 percent low, 50 percent moderate, 75 percent high.
- Sources are explored through subgroup analysis (for example individual versus group therapy) and meta-regression (for example effect size by year or dose).
High heterogeneity means a single pooled number may mislead; the important question becomes why studies differ. This is the "apples and oranges" criticism.

## Publication bias
Studies with significant results are more likely to be published, the file drawer problem named by Robert Rosenthal. If only positive studies are pooled, the effect is overestimated.
- Funnel plot: effect size plotted against precision. Without bias it looks like a symmetrical inverted funnel, with small studies scattered widely at the bottom. A gap of small negative studies on one side suggests bias.
- Egger's regression test checks funnel asymmetry statistically.
- Trim and fill estimates missing studies and adjusts the effect.
- Fail-safe N estimates how many null studies would be needed to cancel the effect.
- Including trial registries and unpublished data is the best protection.
A well-known example is antidepressant trials: when unpublished trials held by the US Food and Drug Administration were included, the apparent benefit shrank noticeably.

## Strengths
- Greater statistical power and precision than any single study.
- Settles conflicting findings and identifies moderators.
- Transparent and reproducible.
- Basis of evidence-based practice guidelines.

## Criticisms
- Garbage in, garbage out: pooling weak studies gives a precise but wrong answer.
- Apples and oranges: combining different measures and populations.
- Publication and selection bias.
- Researcher choices about inclusion can change conclusions.
- Few Indian and low-income country studies, so pooled results may not reflect local conditions.

## Conclusion
Meta-analysis replaced impressionistic reviews with quantitative synthesis and now sits at the top of the evidence hierarchy. Its conclusions are only as good as the studies included and the care taken over heterogeneity and bias, so a student should read the forest plot, the I squared value and the funnel plot, not just the pooled effect.`,
    keyPoints: ["Definition and Glass's origin", "Contrast with narrative review and vote counting", "Ordered steps including protocol, search, PRISMA, quality, effect size", "Inverse variance weighting and forest plot", "Fixed versus random effects", "Q and I squared", "Funnel plot and file drawer problem", "Balanced critique"],
    pitfalls: ["Calling any literature review a meta-analysis", "Not explaining what I squared means", "Ignoring publication bias"],
    module: "research-methods/3-2",
    visuals: [
      {
        kind: "timeline",
        data: {
          prompt: "Put the steps of a systematic review and meta-analysis in order.",
          events: [
            { label: "Frame the question in PICO form" },
            { label: "Register the protocol" },
            { label: "Search databases and grey literature" },
            { label: "Screen and select studies (PRISMA)" },
            { label: "Extract data and rate risk of bias" },
            { label: "Pool effect sizes in a forest plot" },
            { label: "Check heterogeneity and publication bias" },
          ],
        },
      },
      {
        kind: "compare",
        data: {
          title: "Reading a funnel plot",
          a: { label: "Symmetrical funnel", points: ["Small studies scatter evenly on both sides", "Large studies cluster near the pooled effect"], summary: "No sign of publication bias." },
          b: { label: "Asymmetrical funnel", points: ["Small studies with small or negative effects are missing", "One bottom corner is empty"], summary: "Suggests publication bias; pooled effect may be too large." },
        },
      },
    ],
    ref: "Glass 1976; Smith and Glass 1977; Rosenthal 1979 file drawer; Higgins et al 2003 I squared; Turner et al 2008 NEJM selective publication of antidepressant trials; PRISMA 2020",
  },
  {
    id: "rm-l03-022",
    subject: S,
    topic: "meta-analysis",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "md-psychiatry"],
    question: "Distinguish a systematic review from a narrative review.",
    plan: ["Define each", "Contrast on question, search, selection, appraisal and synthesis", "Mention PRISMA and the evidence hierarchy"],
    answer: `## Narrative review
A narrative (traditional) review summarises research on a topic based on the author's knowledge and selection. It is useful for giving an overview, tracing the history of an idea or proposing theory, but the search is usually not described, the choice of studies may reflect the author's views, and conclusions are often reached by counting positive and negative studies.

## Systematic review
A systematic review answers a focused question using explicit, pre-specified and reproducible methods to find, select, appraise and synthesise all relevant studies. When the results are combined statistically it includes a meta-analysis.

## Contrast
| Feature | Narrative review | Systematic review |
| Question | Broad topic | Focused, often PICO |
| Protocol | Rarely | Registered in advance |
| Search | Not stated, selective | Comprehensive, several databases and grey literature |
| Selection | Author's choice | Explicit criteria, two reviewers |
| Quality appraisal | Informal | Formal risk of bias tools |
| Synthesis | Qualitative, vote counting | Structured, often meta-analysis |
| Reproducibility | Low | High |
| Bias risk | High | Lower |

## Reporting
Systematic reviews are reported using the PRISMA guidelines, including a flow diagram of studies identified, screened and included. They sit near the top of the evidence hierarchy, above single trials, and form the basis of clinical guidelines. A narrative review still has a place, for example in introducing a new field where too few studies exist for a systematic review.`,
    keyPoints: ["Definition of each", "At least five points of contrast", "Protocol and reproducibility", "PRISMA", "Place in evidence hierarchy"],
    module: "research-methods/3-2",
    ref: "Cochrane Handbook ch 1; PRISMA 2020",
  },
  {
    id: "rm-l03-023",
    subject: S,
    topic: "meta-analysis",
    marks: 10,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "What is the replication crisis in psychology? Discuss its causes and the reforms proposed to address it.",
    plan: ["Define replication and the crisis", "Key evidence such as the Reproducibility Project", "Causes: questionable research practices, low power, publication bias, incentives", "Reforms: preregistration, registered reports, open data, large samples", "Conclusion"],
    answer: `## Meaning
Replication means repeating a study to see whether the result holds. A direct replication copies the method as closely as possible; a conceptual replication tests the same hypothesis with a different method. The replication crisis is the discovery, from about 2011 onwards, that many published findings in psychology could not be reproduced.

## Key evidence
- In 2015 the Open Science Collaboration repeated 100 studies from leading psychology journals. About 97 percent of the originals had significant results, but only about 36 percent of the replications did, and effect sizes were roughly half as large.
- Multisite "Many Labs" projects found that some effects, such as anchoring, replicated well, while others, such as several social priming effects, did not.
- A large multisite test of ego depletion, the idea that self-control draws on a limited resource, found an effect close to zero.
- Daryl Bem's 2011 paper reporting evidence for precognition, published with standard methods, prompted many to ask what was wrong with the standard methods.

## Causes
- Questionable research practices: p-hacking (trying analyses until p falls below 0.05), optional stopping (collecting data until significance), dropping conditions or outliers selectively, and HARKing (hypothesising after the results are known). Joseph Simmons and colleagues showed that such flexibility can make almost any false hypothesis appear significant.
- Low statistical power: small samples produce unstable estimates, and significant results from them tend to overestimate effects.
- Publication bias: journals preferred novel, positive results; null results stayed in file drawers.
- Incentives: hiring and promotion rewarded many publications and surprising findings.
- Weak theory and vague hypotheses that can fit any result.
- Hidden moderators and differences in samples and contexts, though these explain only part of the failures.
- Rare cases of fraud, such as Diederik Stapel's fabricated data.

## Reforms
- Preregistration of hypotheses, design and analysis plan before collecting data.
- Registered reports: journals accept a study on the basis of its question and method before results are known, removing the bias towards positive findings.
- Open data, materials and code so others can check the analyses.
- Larger samples, power analysis and multisite collaborations such as the Psychological Science Accelerator, which includes Indian labs.
- Reporting effect sizes and confidence intervals, not only p values; some propose stricter thresholds such as p below 0.005.
- Valuing replications and null results in journals and in career decisions.
- Better theory and more diverse, non-WEIRD samples.

## Conclusion
The crisis is better seen as a credibility revolution: psychology examined its own practices and introduced reforms that are now spreading to other sciences. For students, the lesson is to treat a single striking finding with caution and to value transparent methods over surprising results.`,
    keyPoints: ["Definition of replication and its types", "Open Science Collaboration 2015 figures", "p-hacking, HARKing and optional stopping", "Low power and publication bias", "Preregistration and registered reports", "Open data and large samples", "Balanced conclusion"],
    pitfalls: ["Blaming only fraud", "Not explaining how p-hacking inflates false positives"],
    module: "research-methods/3-2",
    visuals: [
      {
        kind: "experiment",
        data: {
          title: "The Reproducibility Project",
          question: "Of 100 published psychology studies, what share were significant originally, and what share when repeated?",
          unit: "%",
          conditions: [
            { label: "Originals significant", value: 97 },
            { label: "Replications significant", value: 36 },
          ],
          why: "Small samples, flexible analyses and publication bias meant many original effects were overestimated.",
        },
      },
    ],
    ref: "Open Science Collaboration 2015 Science; Simmons, Nelson and Simonsohn 2011; Hagger et al 2016 ego depletion RRR; Nosek et al 2018 preregistration",
  },
  {
    id: "rm-l03-024",
    subject: S,
    topic: "research-ethics",
    marks: 20,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Discuss the ethical principles that govern psychological research. Trace the history of research ethics and describe the guidelines followed in India.",
    plan: ["Why ethics matters, with landmark abuses", "Nuremberg, Helsinki, Belmont", "APA principles and specific standards", "Informed consent, deception, debriefing, confidentiality, right to withdraw, harm", "Indian guidelines: ICMR, MHCA, ethics committees", "Controversial studies and conclusion"],
    answer: `## Why ethics matters
Research ethics protects the dignity, rights, safety and wellbeing of participants and the integrity of science. Psychology studies people's minds, often in vulnerable states, and has a history of studies that caused distress, so ethical rules are not paperwork but a core part of good research.

## History
- Nazi medical experiments on prisoners led to the Nuremberg Code in 1947, which made voluntary consent essential and required that risks be justified by benefits.
- The World Medical Association's Declaration of Helsinki in 1964 set out principles for medical research, including independent ethics review, and has been revised many times.
- The Tuskegee syphilis study in the United States, from 1932 to 1972, left Black men untreated even after penicillin became available. Its exposure led to the Belmont Report in 1979.
- The Belmont Report set out three principles: respect for persons (autonomy and protection of those with reduced autonomy, applied through informed consent), beneficence (maximising benefits and minimising harm, applied through risk-benefit assessment) and justice (fair distribution of the burdens and benefits of research, applied through fair selection of participants).
- Within psychology, Stanley Milgram's obedience studies in the 1960s, in which participants believed they were giving painful shocks, and Philip Zimbardo's Stanford prison study in 1971, stopped after six days because guards became abusive, sparked debate about deception and harm. Diana Baumrind's critique of Milgram is a classic text in this debate.

## APA ethical principles
The American Psychological Association's code has five general principles: beneficence and non-maleficence, fidelity and responsibility, integrity, justice, and respect for people's rights and dignity. Its research standards include institutional approval, informed consent, special rules for deception, debriefing, care of animals, honest reporting and credit for authorship. The British Psychological Society code is built around respect, competence, responsibility and integrity.

## Core requirements
- Informed consent: participants are told the purpose, procedures, risks, benefits, duration, confidentiality and the right to refuse, in language they understand, and agree freely. For children, parents give consent and the child gives assent. For people with impaired capacity, a legally authorised representative is involved.
- Voluntariness: no coercion or undue inducement. Students should not lose marks for refusing, and patients should not fear losing treatment.
- Right to withdraw at any time without penalty, including withdrawing their data.
- Protection from harm: physical and psychological risk should be no greater than in everyday life, or justified and minimised. Distressing procedures need support and referral.
- Deception: allowed only when the study has significant value, no non-deceptive alternative exists, it would not change a person's willingness to take part if they knew, and it is explained as early as possible. Deception about anything likely to cause pain or severe distress is not allowed.
- Debriefing: after the study participants are told the true purpose, any misconceptions are corrected and any distress is addressed. With deception, debriefing should be careful enough to remove any lasting false beliefs.
- Confidentiality and anonymity: data are coded, stored securely and reported without identifying details. Limits to confidentiality, such as risk of suicide, must be explained in advance.
- Scientific integrity: no fabrication, falsification or plagiarism, and honest reporting of all results.
- Animal research follows the three Rs: replace, reduce and refine.

## Ethics in India
- The Indian Council of Medical Research's National Ethical Guidelines for Biomedical and Health Research Involving Human Participants, issued in 2017, apply to health research including psychological studies. They set out principles such as essentiality, voluntariness, non-exploitation, social responsibility, privacy, risk minimisation, professional competence, accountability and transparency, and public domain. They also give detailed rules for vulnerable groups, community consent, compensation for research-related injury and audio-visual recording of consent in some regulatory trials.
- Every institution doing such research must have an Institutional Ethics Committee, with members from medical, non-medical, legal and lay backgrounds, registered with the national authorities.
- The Mental Healthcare Act 2017 (Section 99) requires free and informed consent from people with mental illness who take part in research. When a person cannot consent, the State Mental Health Authority may permit research with the nominated representative's consent, if the person does not resist, the research cannot be done with people who can consent, it is needed to promote the mental health of the population the person represents, and it has ethics committee approval. Consent can be withdrawn at any time.
- The Rehabilitation Council of India and the Indian Association of Clinical Psychologists have professional codes for practitioners.
- Indian researchers face particular issues: low literacy (requiring oral consent processes and witnesses), consent by the head of the family rather than the individual, power differences between doctors and patients, and the need to translate forms into local languages.

## Conclusion
Ethical research balances the search for knowledge with respect for participants. From Nuremberg to the ICMR guidelines, the principles have stayed constant: voluntary informed consent, minimal harm, honesty, confidentiality and justice. A researcher must plan for ethics from the start, obtain committee approval, and remember that the participant's welfare always outweighs the study's interest.`,
    keyPoints: ["Landmark abuses including Nuremberg and Tuskegee", "Belmont's three principles with applications", "APA general principles", "Informed consent, withdrawal, harm, deception, debriefing, confidentiality", "Conditions under which deception is permitted", "ICMR 2017 guidelines and ethics committees", "MHCA 2017 Section 99 on research", "Indian challenges such as literacy and family consent"],
    pitfalls: ["Listing principles without explaining them", "Omitting Indian guidelines", "Saying deception is always forbidden"],
    module: "research-methods/3-3",
    visuals: [
      {
        kind: "timeline",
        data: {
          prompt: "Put these landmarks in research ethics in order.",
          events: [
            { label: "Nuremberg Code", when: "1947" },
            { label: "Declaration of Helsinki", when: "1964" },
            { label: "Stanford prison study stopped", when: "1971" },
            { label: "Tuskegee study exposed and ended", when: "1972" },
            { label: "Belmont Report", when: "1979" },
            { label: "ICMR national ethical guidelines revised", when: "2017" },
          ],
          why: "Each abuse or controversy led to stronger rules, from voluntary consent to independent ethics review.",
        },
      },
      {
        kind: "flow",
        data: {
          title: "Belmont principles and how they are applied",
          layout: "tree",
          nodes: [
            { id: "b", label: "Belmont Report" },
            { id: "r", label: "Respect for persons", parent: "b", detail: "Applied through informed consent and protection of those with reduced autonomy." },
            { id: "be", label: "Beneficence", parent: "b", detail: "Applied through risk and benefit assessment." },
            { id: "j", label: "Justice", parent: "b", detail: "Applied through fair selection of participants." },
          ],
        },
      },
    ],
    ref: "Belmont Report 1979; APA Ethics Code 2017; ICMR National Ethical Guidelines 2017; MHCA 2017 s.99; Baumrind 1964",
  },
  {
    id: "rm-l03-025",
    subject: S,
    topic: "research-ethics",
    marks: 10,
    difficulty: 3,
    exams: ["mcp-entrance", "ma-semester", "md-psychiatry"],
    question: "Discuss the ethical issues in conducting research with vulnerable groups such as children and people with mental illness in India.",
    plan: ["Define vulnerability", "Children: consent, assent, POCSO and school permission", "People with mental illness: capacity, MHCA 2017, nominated representative", "Other vulnerable groups", "Safeguards and conclusion"],
    answer: `## Vulnerability
A vulnerable participant is one who has reduced ability to protect their own interests, because of age, illness, dependence, poverty or social position. The ICMR guidelines of 2017 list children, pregnant women, people with mental illness or cognitive impairment, prisoners, students and employees under the researcher, economically and socially disadvantaged groups, and people in emergencies. Vulnerability does not mean exclusion: excluding such groups would leave them without evidence for their own care, which is unjust.

## Research with children
- Consent is given by a parent or legal guardian, and the child's own assent is sought in age-appropriate language. A child's refusal (dissent) should normally be respected.
- Schools require permission from the management, but school permission does not replace parental consent.
- Risks must be minimal unless there is a prospect of direct benefit.
- Questions about abuse raise mandatory reporting: under the Protection of Children from Sexual Offences Act 2012, anyone who learns of sexual abuse of a child must report it. Researchers must explain this limit to confidentiality in advance and have a referral pathway.
- Adolescents' privacy about sensitive topics such as sexuality or substance use must be balanced with parental rights.

## Research with people with mental illness
- Capacity to consent is decision-specific and can fluctuate. The researcher assesses whether the person understands the information, appreciates how it applies to them, can reason about it and can communicate a choice.
- Under Section 99 of the Mental Healthcare Act 2017, research needs the person's free and informed consent. If they lack capacity, the State Mental Health Authority can permit research with the nominated representative's consent, provided the research cannot be done with people who have capacity, it is necessary to promote mental health, and the person does not object.
- Placebo-controlled trials raise particular concern when effective treatment exists.
- Patients may feel they must agree to please their doctor; consent should be taken by someone other than the treating clinician where possible.
- Questions about suicide must be followed by risk assessment and help, but asking about suicide does not increase risk.

## Other groups
Prisoners, people living in poverty who may be swayed by payment, tribal communities where community consent is also needed, and students recruited by their own teachers, where the power gap makes refusal difficult.

## Safeguards
- Review by an Institutional Ethics Committee with lay members.
- Consent in the local language, oral consent with an impartial witness for those who cannot read, and audio-visual recording in some trials.
- Minimal risk, clear referral and support plans, and data protection.
- Fair compensation without undue inducement.
- Sharing results with communities.

## Conclusion
Research with vulnerable groups is necessary and can be ethical when it includes extra protections: valid consent or assent, attention to capacity, minimal risk, independent review and respect for the person's wishes.`,
    keyPoints: ["Definition and list of vulnerable groups", "Inclusion as a justice issue", "Parental consent and child assent", "POCSO reporting duty", "Capacity assessment components", "MHCA Section 99 provisions", "Safeguards such as ethics committee and local-language consent"],
    module: "research-methods/3-3",
    ref: "ICMR National Ethical Guidelines 2017 sections on vulnerability and children; MHCA 2017 s.99; POCSO Act 2012 s.19 and s.21; Appelbaum 2007 capacity",
  },
  {
    id: "rm-l03-026",
    subject: S,
    topic: "research-ethics",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg"],
    question: "Write a short note on deception and debriefing in psychological research.",
    plan: ["Define deception, active and passive", "When it is allowed", "Purpose and parts of debriefing", "Example and critique"],
    answer: `## Deception
Deception means giving participants false information (active deception), such as a cover story or a confederate who pretends to be another participant, or withholding information about the true purpose (passive deception). It is used because knowing the hypothesis would change behaviour, as in studies of conformity, helping or obedience.

## When it is allowed
Under the APA code, deception is acceptable only if:
- the study has significant scientific, educational or applied value,
- no effective non-deceptive method is available,
- it is not about anything likely to cause physical pain or severe emotional distress, and
- it is explained as early as possible, usually at the end of the session, and participants may withdraw their data.

## Debriefing
Debriefing is the conversation after the study in which the researcher:
- reveals the true purpose and any deception, and explains why it was needed,
- corrects false beliefs (dehoaxing),
- checks for and reduces any distress, anxiety or loss of self-esteem (desensitising),
- answers questions and gives contact details and referrals if needed.
In Milgram's studies participants met the unharmed "learner" afterwards, and most later said they were glad to have taken part, though critics such as Diana Baumrind argued the stress was not justified.

## Critique
Deception may harm trust in psychologists and make future participants suspicious. Some economists ban it altogether. Alternatives include role-play, simulations and consent to possible deception in advance.`,
    keyPoints: ["Active and passive deception", "APA conditions for deception", "Components of debriefing", "Milgram example", "Critique and alternatives"],
    module: "research-methods/3-3",
    ref: "APA Ethics Code 8.07 and 8.08; Baumrind 1964; Milgram 1974",
  },
  {
    id: "rm-l03-027",
    subject: S,
    topic: "apa-writing",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net"],
    question: "Describe the structure of a research report in APA style. What should each section contain?",
    plan: ["Purpose of a standard format", "Title page and abstract", "Introduction", "Method with subsections", "Results", "Discussion, references and appendices, and writing style"],
    answer: `## Why a standard format
The American Psychological Association's publication manual, now in its seventh edition, gives a standard structure so that readers can find information quickly and judge whether the study was done well enough to trust and repeat. The core is often remembered as IMRAD: Introduction, Method, Results and Discussion.

## Title page
A concise title (about 12 words or fewer) naming the main variables and population, for example "Sleep Duration and Working Memory in Indian Adolescents", followed by authors and their affiliations, and an author note.

## Abstract
A single paragraph of about 150 to 250 words summarising the problem, participants, method, key results with statistics and the main conclusion and implications, followed by keywords. It is written last but read first, so it must stand alone.

## Introduction
- States the problem and why it matters.
- Reviews relevant theory and earlier research, critically rather than as a list.
- Identifies the gap the study fills.
- Ends with the aims and clearly stated hypotheses.
It moves from broad to specific, like a funnel.

## Method
Enough detail for another researcher to replicate the study.
- Participants: number, how they were recruited and sampled, age, gender and other relevant characteristics, exclusions, and ethics approval.
- Materials or measures: each test or apparatus with reliability and validity evidence.
- Design: variables, conditions and whether between or within subjects.
- Procedure: step by step what participants did, including instructions, counterbalancing and debriefing.

## Results
Reports the findings without interpretation: descriptive statistics, then inferential tests with the test statistic, degrees of freedom, exact p value, effect size and confidence intervals, for example t(58) = 2.45, p = .017, d = 0.63. Tables and figures summarise data and are referred to in the text.

## Discussion
- Restates whether the hypotheses were supported.
- Interprets results in relation to theory and earlier research.
- Considers alternative explanations and limitations, such as sample and design.
- Suggests implications for practice and future research.
- Ends with a short conclusion.

## References and appendices
All cited works in APA reference format, in alphabetical order, with a matching in-text citation for each. Appendices hold materials such as questionnaires.

## Writing style
Clear, concise, objective, past tense for what was done, bias-free language (for example "people with schizophrenia" rather than "schizophrenics"), and no plagiarism.

## Conclusion
The APA format turns a study into a transparent argument: why it was done, how, what was found and what it means.`,
    keyPoints: ["IMRAD structure", "Abstract content and length", "Introduction as funnel ending in hypotheses", "Method subsections for replication", "Results with test statistic, p and effect size", "Discussion including limitations", "Bias-free language"],
    module: "research-methods/3-4",
    visuals: [
      {
        kind: "timeline",
        data: {
          prompt: "Put the sections of an APA report in order.",
          events: [{ label: "Title page" }, { label: "Abstract" }, { label: "Introduction" }, { label: "Method" }, { label: "Results" }, { label: "Discussion" }, { label: "References" }, { label: "Appendices" }],
        },
      },
    ],
    ref: "APA Publication Manual 7th edition 2020 ch 2 and 3",
  },
  {
    id: "rm-l03-028",
    subject: S,
    topic: "apa-writing",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "cuet-pg"],
    question: "Write a short note on the review of literature in a research project.",
    plan: ["Define review of literature", "Purposes", "How to do it", "Common errors"],
    answer: `## Meaning
The review of literature is a critical summary of what is already known about the research problem, drawn from books, journal articles, theses and reports. It sets the study within existing knowledge and shows why it is needed.

## Purposes
- Shows what has been studied, what is agreed and where findings conflict.
- Identifies the gap that the present study will fill.
- Provides the theoretical framework and justifies the hypotheses.
- Suggests suitable methods, tools and samples, and warns of past mistakes.
- Prevents needless duplication.

## How to do it
- Search databases such as PsycINFO, PubMed and Google Scholar, and Indian sources such as Shodhganga for theses, using clear keywords.
- Read primary sources rather than relying on summaries.
- Take organised notes on each study: aim, sample, method, findings and limitations.
- Organise the review by themes or by variables, not study by study, moving from general to specific.
- Evaluate studies critically: sample size, design, measures and generalisability.
- End with a short summary that states the gap and leads to the aims.

## Common errors
- Listing studies one after another without synthesis.
- Using old or secondary sources only.
- Ignoring studies that contradict the hypothesis.
- Copying text, which is plagiarism; ideas must be paraphrased and cited.
- Not linking the review to the research question.`,
    keyPoints: ["Definition", "At least four purposes", "Thematic organisation", "Critical evaluation", "Common errors including plagiarism"],
    module: "research-methods/3-4",
    ref: "Kerlinger ch 2; APA Manual 7th ed ch 8",
  },
  {
    id: "rm-l03-029",
    subject: S,
    topic: "experimental-design",
    marks: 15,
    difficulty: 3,
    exams: ["mcp-entrance", "ma-semester", "ugc-net"],
    question: "A school counsellor in Ahmedabad wants to find out whether an eight-week mindfulness programme reduces exam anxiety in Class 10 students. Design a study to test this, covering the hypothesis, design, sampling, measures, procedure, ethics and analysis.",
    plan: ["State the research question and hypotheses", "Choose a design and justify it, including control group and randomisation", "Sampling and sample size", "Measures and procedure", "Threats to validity and how they are handled", "Ethics, analysis and expected limitations"],
    answer: `## Research question and hypotheses
Does an eight-week school-based mindfulness programme reduce exam anxiety in Class 10 students compared with usual school activities?
- H1: Students who receive the mindfulness programme will show a greater reduction in exam anxiety from pre-test to post-test than students in the control group.
- H0: There will be no difference in change in exam anxiety between the two groups.
- Secondary hypotheses: the programme will improve sleep quality and mindfulness, and the effect on anxiety will be partly explained (mediated) by increased mindfulness.

## Design
A cluster randomised controlled trial with a pretest, post-test and follow-up, comparing the programme with an active control.
- Why clusters: if students in the same class are split between groups, they will talk to each other and the control group may learn the techniques (contamination). So whole sections, or whole schools, are randomised.
- Why an active control: a group that simply waits differs in attention and expectation. The control group receives an equal number of sessions of study skills or general health talks, which controls for attention, novelty and the teacher's presence.
- Why a follow-up: to see whether effects last until board exams, about three months later.
| Group | Pretest | Eight weeks | Post-test | Follow-up |
| Mindfulness sections | O1 | Mindfulness programme | O2 | O3 |
| Control sections | O1 | Study skills sessions | O2 | O3 |

## Sampling
- Population: Class 10 students in Gujarati and English-medium schools in Ahmedabad.
- Six to eight schools selected to include government, grant-in-aid and private schools, with two sections per school randomised to each condition (stratified by school).
- Sample size from a power analysis: for a moderate effect of d = 0.4, alpha 0.05 and power 0.80, about 100 students per group are needed, inflated for clustering (design effect) and for 15 percent dropout, giving roughly 150 to 180 per group.
- Exclusion: students already in treatment for an anxiety disorder are referred for care but may still join the class activity.

## Measures
- Primary outcome: a standardised test anxiety scale, such as Spielberger's Test Anxiety Inventory, translated and back-translated into Gujarati, with internal consistency checked in a pilot.
- Secondary outcomes: a mindfulness scale such as the Child and Adolescent Mindfulness Measure, a sleep quality questionnaire, and school marks in preliminary exams.
- Process measures: attendance and home practice logs, and a short fidelity checklist completed by an observer.

## Procedure
- Obtain permission from school management and the ethics committee.
- Send information sheets and consent forms to parents in Gujarati and English; obtain student assent.
- Pretest all students in class time, with research assistants who do not know group allocation.
- Randomise sections within each school by a person outside the research team (allocation concealment).
- Deliver the programme in eight weekly 40-minute sessions by trained facilitators using a manual; deliver the control sessions by equally experienced facilitators.
- Post-test in week 9 and follow-up after three months.

## Threats to validity and controls
- Selection: handled by randomisation within schools.
- History and maturation, such as approaching exams: both groups experience them, so the comparison controls for them.
- Expectancy: students cannot be blinded, but outcome assessors are, and the active control equalises attention.
- Contamination: cluster randomisation.
- Attrition: intention-to-treat analysis including everyone randomised, with appropriate handling of missing data.
- Facilitator effects: manuals, training and fidelity checks.

## Ethics
- Voluntary participation with parental consent and student assent, and freedom to withdraw without effect on marks.
- Confidentiality: questionnaires coded by number.
- Students with very high anxiety or any mention of self-harm are referred to the counsellor immediately, following a safety protocol.
- The control schools are offered the mindfulness programme after the study (a wait-list feature), which addresses fairness.

## Analysis
- Descriptive statistics and baseline comparison of groups.
- Main analysis: a mixed-model or multilevel analysis with students nested in sections and schools, testing the group by time interaction. A simpler alternative is analysis of covariance on post-test scores with pretest as covariate.
- Effect size (Cohen's d) with 95 percent confidence intervals.
- Mediation analysis to test whether change in mindfulness explains change in anxiety.
- A short qualitative component, such as focus groups with students, to explore acceptability.

## Limitations
Students and teachers know their condition, schools may differ in culture, self-report measures may be affected by social desirability, and results may not generalise to rural schools.

## Conclusion
A cluster randomised trial with an active control, blind assessment, adequate power and intention-to-treat analysis gives the strongest test of the counsellor's question within the ethical and practical limits of a school.`,
    keyPoints: ["Clear H1 and H0", "Randomised design with justification for clusters", "Active control group", "Power analysis for sample size", "Reliable translated outcome measure", "Blind assessors and allocation concealment", "Ethics with consent, assent and referral", "Appropriate analysis such as ANCOVA or multilevel model"],
    pitfalls: ["Proposing a single group pre and post design", "Forgetting consent and referral for high-risk students", "Naming no statistical test"],
    module: "research-methods/2-3",
    visuals: [
      {
        kind: "flow",
        data: {
          title: "Trial flow",
          layout: "chain",
          nodes: [
            { id: "c", label: "Consent and assent", detail: "Parents consent, students assent, schools permit." },
            { id: "p", label: "Pretest", detail: "Blind assessors measure test anxiety." },
            { id: "r", label: "Randomise sections", detail: "Done by someone outside the team, stratified by school." },
            { id: "i", label: "Eight weeks", detail: "Mindfulness versus matched study skills sessions." },
            { id: "o", label: "Post-test and follow-up", detail: "Week 9 and three months later." },
            { id: "a", label: "Analysis", detail: "Intention to treat, multilevel group by time interaction." },
          ],
        },
      },
    ],
    ref: "CONSORT extension for cluster trials; Shaughnessy ch 7 and 9; Spielberger Test Anxiety Inventory; Cohen 1988 power tables",
  },
  {
    id: "rm-l03-030",
    subject: S,
    topic: "experimental-design",
    marks: 10,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "cuet-pg"],
    question: "Explain factorial designs. What are main effects and interactions? Illustrate with an example.",
    plan: ["Define factorial design and notation", "Advantages", "Main effects with example", "Interaction with example and table", "Types of interaction and interpretation rule", "Conclusion"],
    answer: `## Meaning
A factorial design studies two or more independent variables (factors) at the same time, with every level of each factor combined with every level of the others. A 2 x 3 design has two factors, one with two levels and one with three, giving six conditions (cells). Factors can be between-subjects, within-subjects or mixed.

## Advantages
- Efficient: several questions are answered in one study with one sample.
- Tests interactions, which single-factor studies cannot.
- Greater external validity, since real behaviour is shaped by several variables at once.

## Example
A researcher studies the effect of caffeine (none or 200 mg) and task difficulty (easy or hard) on errors in a proofreading task. This is a 2 x 2 between-subjects design with four groups. Mean errors:
| Caffeine by task | Easy | Hard | Row mean |
| No caffeine | 4 | 10 | 7 |
| Caffeine | 3 | 15 | 9 |
| Column mean | 3.5 | 12.5 | 8 |

## Main effects
A main effect is the overall effect of one factor, averaged across the levels of the other.
- Main effect of task difficulty: 3.5 errors for easy versus 12.5 for hard, so hard tasks produce more errors.
- Main effect of caffeine: 7 versus 9 errors, a small overall increase with caffeine.

## Interaction
An interaction exists when the effect of one factor depends on the level of the other. Here caffeine slightly reduces errors on the easy task (4 to 3) but sharply increases errors on the hard task (10 to 15). The effect of caffeine is minus 1 on easy and plus 5 on hard, so the effects are not parallel. This fits the Yerkes Dodson idea that higher arousal helps simple tasks but harms complex ones. On a graph with task on the x axis and a line for each caffeine level, the lines are not parallel; non-parallel lines signal an interaction.

## Types of interaction
- Ordinal (spreading): one factor has an effect at one level of the other and a smaller one at the other, but lines do not cross.
- Disordinal (crossover): the effect reverses direction, and lines cross, as in this example.

## Interpretation rule
When a significant interaction is present, main effects must be interpreted cautiously, because the overall effect of caffeine (plus 2 errors) hides that it helps on one task and harms on another. The researcher follows up with simple effects analysis: the effect of caffeine at each level of task difficulty. Factorial data are analysed with two-way (or higher) ANOVA, which gives an F test for each main effect and for the interaction.

## Conclusion
Factorial designs show not only whether variables matter but how they combine. In psychology, many of the most important findings are interactions, such as stress leading to depression mainly in people with a particular vulnerability.`,
    keyPoints: ["Definition and notation", "Advantages including interaction testing", "Worked table with cell and marginal means", "Correct main effects", "Interaction defined and shown as non-parallel lines", "Ordinal versus disordinal", "Simple effects and two-way ANOVA"],
    pitfalls: ["Calculating main effects from a single cell", "Interpreting main effects without noting the interaction"],
    module: "research-methods/2-3",
    visuals: [
      {
        kind: "worked",
        data: {
          title: "Reading a 2 x 2 table",
          steps: [
            { q: "Main effect of task?", a: "Easy mean (4 + 3) / 2 = 3.5; hard mean (10 + 15) / 2 = 12.5." },
            { q: "Main effect of caffeine?", a: "No caffeine (4 + 10) / 2 = 7; caffeine (3 + 15) / 2 = 9." },
            { q: "Is there an interaction?", a: "Caffeine changes errors by minus 1 on easy and plus 5 on hard. The effect depends on the task, so yes." },
          ],
          yourTurn: [{ q: "If the cells were 4, 10, 6 and 12, would there be an interaction?", a: "No. Caffeine adds 2 errors on both tasks, so the lines are parallel." }],
        },
      },
      { kind: "curve", data: { kind: "inverted-u", title: "Arousal and task difficulty", caption: "Raise arousal: the easy task keeps improving, the hard task gets worse sooner." } },
    ],
    ref: "Shaughnessy ch 8 complex designs; Howell Statistical Methods ch 13. Means checked by hand.",
  },
];
