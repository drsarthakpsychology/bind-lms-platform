import type { InterviewQuestion } from "@/lib/prep/types";
import { ivkit } from "../qb5-kit";

/** Mock interview bank · research: the candidate's dissertation, methods and statistics. Ordered foundation to advanced. */
const iv = ivkit("research", ["mcp-entrance", "ma-semester"]);

const ITEMS: InterviewQuestion[] = [
  iv("iv-res-001", 1,
    "Tell us about your MA dissertation in two minutes.",
    [
      "Why did you choose this topic?",
      "What was your main finding, in one sentence?",
      "What would you do differently now?",
    ],
    "I would structure my answer so the panel can follow it easily: question, method, findings, meaning. For example: 'My dissertation asked whether perceived social support moderates the relationship between academic stress and depressive symptoms in first-year college students in Ahmedabad. I chose it because student distress is rising and support is something colleges can actually change. I used a cross-sectional correlational design with 220 students recruited from four colleges by stratified sampling across streams. I measured academic stress with a validated student stress scale, support with the Multidimensional Scale of Perceived Social Support, and depressive symptoms with the PHQ-9, all with good reliability in my sample, with Cronbach's alpha above 0.80. I tested moderation using hierarchical regression with an interaction term. Stress predicted depressive symptoms, and support weakened that link, especially support from family. The main limitations are the cross-sectional design, which cannot show causation, self-report bias, and a sample from one city. The practical implication is that peer and family support programmes in colleges may buffer stress.' A clear, honest summary like this shows I understand my own work.",
    [
      "Clear research question and rationale",
      "Design, sample and sampling method",
      "Measures with reliability",
      "Analysis and main findings",
      "Limitations and implications",
    ],
    [
      "Rambling without structure",
      "Not knowing the reliability of own tools",
      "Overclaiming causation",
    ]),

  iv("iv-res-002", 2,
    "Why did you choose a correlational design rather than an experiment for your study?",
    [
      "What does a correlation of 0.45 mean in practical terms?",
      "How could you strengthen causal inference without an experiment?",
      "What is a third-variable problem?",
    ],
    "I chose a correlational design because my variables, such as academic stress and social support, cannot ethically or practically be manipulated, and I wanted to study them as they occur naturally in a reasonably large sample. A true experiment needs manipulation of the independent variable and random assignment, which gives strong causal inference, but it was not possible here. The trade-off is that correlational designs cannot establish causation. A relationship between stress and depression could run in either direction, or both could be caused by a third variable, such as poor sleep or a personality trait like neuroticism. To strengthen causal inference without an experiment, I could use a longitudinal design, measuring variables at two or more time points to check temporal order, statistically control for likely confounders, use cross-lagged panel analysis, or look for natural experiments. A correlation of 0.45 is moderate. It means about 20% of the variance in one variable is shared with the other, since r squared is about 0.20. So it is meaningful, but many other factors are also involved. If I extended the study, I would follow students across the first year to see whether support at the start predicts later depressive symptoms.",
    [
      "Reasons for choosing a correlational design",
      "Requirements of a true experiment",
      "Direction and third-variable problems",
      "Ways to strengthen causal inference",
      "Interpretation of r and r squared",
    ],
    [
      "Claiming the study proves causation",
      "Not knowing what r squared means",
    ]),

  iv("iv-res-003", 2,
    "How did you decide your sample size?",
    [
      "What four things determine statistical power?",
      "What effect size did you assume and why?",
      "What happens if a study is underpowered?",
    ],
    "Ideally, sample size should come from a power analysis before data collection. Power is the probability of detecting an effect if it really exists, and it depends on four things: the effect size, the significance level alpha, the desired power, and the sample size. If you fix three, you can calculate the fourth. For my study, I used G*Power with an expected medium effect size based on earlier studies, alpha at 0.05 and power at 0.80. For a multiple regression with three predictors, this suggested about 77 participants, and I recruited 220 to allow for incomplete responses and subgroup analyses. I chose a medium effect because previous studies on stress and support reported correlations around 0.3. If I had no prior estimate, I would have used the smallest effect that would matter in practice. An underpowered study has a high chance of a Type II error, missing a real effect. Also, when underpowered studies do find significant results, the effects are often exaggerated, which contributes to the replication crisis. I would honestly say if my sample was based on convenience rather than a formal calculation, and discuss that as a limitation.",
    [
      "Power analysis concept",
      "Four determinants of power",
      "Justified effect size assumption",
      "Example calculation or tool",
      "Consequences of low power, including inflated effects",
    ],
    [
      "Saying 'I took 100 because it is a good number'",
      "Not knowing what power is",
    ],
    { exams: ["mcp-entrance", "ma-semester", "ugc-net"] }),

  iv("iv-res-004", 1,
    "What sampling method did you use, and what are its limitations?",
    [
      "What is the difference between probability and non-probability sampling?",
      "How does sampling affect external validity?",
      "What is sampling bias? Give an example from your study.",
    ],
    "Many MA dissertations use convenience or purposive sampling, and I would be honest about which I used. For example: 'I used purposive sampling of first-year students from four colleges, and within colleges I approached classes that were available on data collection days, so it was essentially convenience sampling within strata.' Probability sampling methods, such as simple random, stratified, systematic or cluster sampling, give every member of the population a known chance of selection, which supports generalising to that population. Non-probability methods, such as convenience, purposive, quota or snowball sampling, are easier but may not represent the population. The main limitation of my approach is sampling bias. Students who were present in class and willing to participate may have been less distressed, more motivated, or from particular streams, and students with severe depression might have been absent. This affects external validity, meaning I can generalise only cautiously to similar students in similar colleges, not to all Indian students. To reduce bias, I tried to include different streams and both government and private colleges, and I compared my sample's demographics with available college data. In a future study, I would use stratified random sampling from enrolment lists.",
    [
      "Honest description of method used",
      "Probability versus non-probability sampling",
      "Specific sampling bias in own study",
      "Impact on external validity",
      "Steps taken to reduce bias and future improvements",
    ],
    [
      "Calling convenience sampling random",
      "Claiming findings apply to all students",
    ]),

  iv("iv-res-005", 2,
    "How did you establish that your tools were reliable and valid for your sample?",
    [
      "What does a Cronbach's alpha of 0.95 suggest?",
      "Was your tool adapted for Indian use? How?",
      "What is the difference between internal consistency and test-retest reliability?",
    ],
    "I would explain both the published evidence and what I checked in my own data. For example: 'I used the PHQ-9, which has been validated in Indian primary care and student samples, with good sensitivity and specificity for depression at a cut-off of 10. In my sample, Cronbach's alpha was 0.84, showing good internal consistency.' Internal consistency tells us whether items measure the same construct, while test-retest reliability tells us whether scores are stable over time, which I could not check in a single-time-point study. Validity is about whether the scores mean what we claim. I relied on published evidence of construct validity, such as correlations with other depression measures, and in my data I checked that depression correlated in the expected direction with stress and support, which is some convergent evidence. For the stress scale, which was developed in another country, I would mention whether it had Indian norms or an adapted version, and if I translated it into Gujarati or Hindi, I would describe forward and back translation and a pilot. An alpha of 0.95 is not always better, because very high values can mean redundant items. I would mention these points as limitations if the evidence was weak.",
    [
      "Published reliability and validity evidence",
      "Own sample reliability with interpretation",
      "Difference between internal consistency and test-retest",
      "Validity evidence in own data",
      "Cultural adaptation and the meaning of very high alpha",
    ],
    [
      "Not knowing alpha in own study",
      "Equating reliability with validity",
      "Using an unadapted tool without acknowledging it",
    ],
    { module: "assessment" }),

  iv("iv-res-006", 2,
    "Why did you use a t-test? When would you use the Mann-Whitney U test instead?",
    [
      "What are the assumptions of the independent samples t-test?",
      "What is Welch's correction?",
      "What would you report besides the p-value?",
    ],
    "I used an independent samples t-test to compare depressive symptom scores between male and female students, because I had one continuous dependent variable and two independent groups. The t-test assumes that the dependent variable is measured on an interval or ratio scale, that observations are independent, that scores in each group are roughly normally distributed, and that the variances of the two groups are similar. I checked normality with histograms and the Shapiro-Wilk test, though with large samples the t-test is fairly robust because of the central limit theorem. I checked equal variances with Levene's test. If variances were unequal, I would use Welch's t-test, which adjusts the degrees of freedom and is often recommended as a default. I would use the Mann-Whitney U test instead when the data are ordinal, such as ranks, or clearly non-normal with a small sample or strong outliers. It compares the ranks of scores and tests whether one group tends to have higher values than the other. Besides the p-value, I would report the means and standard deviations, the t value with degrees of freedom, a confidence interval for the difference, and an effect size like Cohen's d, so readers can judge practical importance.",
    [
      "Correct use case for t-test",
      "Assumptions and how they were checked",
      "Welch's correction",
      "When to use Mann-Whitney",
      "Full reporting including effect size and CI",
    ],
    [
      "Not knowing the assumptions",
      "Reporting only p-values",
    ],
    { exams: ["mcp-entrance", "ma-semester", "ugc-net"] }),

  iv("iv-res-007", 3,
    "Your result was p = 0.03. Explain exactly what that means, and what it does not mean.",
    [
      "Does p = 0.03 mean there is a 3% chance the null hypothesis is true?",
      "Why is p = 0.049 not very different from p = 0.051?",
      "What is a confidence interval and why might it be more informative?",
    ],
    "A p-value of 0.03 means that, if the null hypothesis were true and all the test's assumptions were met, there would be a 3% probability of getting a result at least as extreme as the one I observed. Since this is below my preset alpha of 0.05, I would reject the null hypothesis and call the result statistically significant. It is important to say what it does not mean. It is not the probability that the null hypothesis is true, and it is not a 97% chance that my hypothesis is correct. It does not tell me how large or important the effect is, since a tiny effect can be significant in a very large sample. And it does not mean the finding will replicate. The 0.05 threshold is a convention, so p values of 0.049 and 0.051 represent almost the same strength of evidence. Treating them as a sharp divide encourages p-hacking. That is why I would also report an effect size and a 95% confidence interval. The confidence interval gives a range of plausible values for the true effect, showing both its likely size and the precision of my estimate. For example, a mean difference of 3.2 points with a 95% CI of 0.4 to 6.0 shows the effect is probably positive but could be small or moderate.",
    [
      "Correct conditional definition of the p-value",
      "Common misinterpretations rejected",
      "Arbitrariness of the 0.05 threshold",
      "Importance of effect size",
      "Confidence intervals explained",
    ],
    [
      "Saying p is the probability the null is true",
      "Equating significance with importance",
    ],
    { exams: ["mcp-entrance", "ma-semester", "ugc-net"] }),

  iv("iv-res-008", 2,
    "What is an effect size? How would you interpret a Cohen's d of 0.5?",
    [
      "What are Cohen's benchmarks, and why should you be careful with them?",
      "What is eta squared?",
      "How does effect size relate to clinical significance?",
    ],
    "An effect size is a standardised measure of the size of an effect or relationship, which does not depend on sample size the way p-values do. Cohen's d is the difference between two means divided by the pooled standard deviation. A d of 0.5 means the two group means differ by half a standard deviation. Cohen suggested rough benchmarks of 0.2 as small, 0.5 as medium and 0.8 as large, but he warned that they are only guides, and the meaning depends on the field and the outcome. In practical terms, with d of 0.5, about 69% of the higher group scores above the mean of the lower group, and there is still a lot of overlap between the groups. Other effect sizes include r for correlations, eta squared or partial eta squared for ANOVA, which show the proportion of variance explained, and odds ratios for categorical outcomes. In clinical research, effect size helps but is not the same as clinical significance, which asks whether the change matters to the patient, such as moving from the clinical to the normal range or reaching a reliable improvement. A small effect can still be important if the outcome is serious, like suicide prevention, or if the intervention is cheap and reaches many people.",
    [
      "Definition and independence from sample size",
      "Cohen's d formula and interpretation",
      "Benchmarks with caveats",
      "Other effect size measures",
      "Effect size versus clinical significance",
    ],
    [
      "Saying effect size depends on sample size",
      "Applying benchmarks rigidly",
    ],
    { exams: ["mcp-entrance", "ma-semester", "ugc-net"] }),

  iv("iv-res-009", 3,
    "You compared four groups using six separate t-tests. What is the problem, and what should you have done?",
    [
      "What is the familywise error rate with six tests at alpha 0.05?",
      "When would you use Tukey versus Bonferroni?",
      "What does a significant F tell you and what doesn't it tell you?",
    ],
    "The problem is the inflation of Type I error. Each t-test has a 5% chance of a false positive, so running six tests increases the chance of at least one false positive across the set. The familywise error rate is about 1 minus 0.95 to the power of 6, which is roughly 26%. So there is about a one in four chance of a false 'significant' finding just by chance. The correct approach is a one-way ANOVA, which tests whether there are any differences among the four group means in a single test, keeping alpha at 0.05. A significant F tells me that at least one group mean differs from the others, but not which ones. To find out, I would use post hoc tests that control the familywise error rate. Tukey's HSD is good for all pairwise comparisons with equal group sizes. Bonferroni divides alpha by the number of comparisons, which is simple but conservative. Games-Howell is used when variances are unequal. If I had specific hypotheses in advance, planned contrasts would be more powerful. I would also report effect sizes such as eta squared and check the assumptions of ANOVA: normality within groups, homogeneity of variance and independence of observations.",
    [
      "Type I error inflation with calculation",
      "One-way ANOVA as the correct approach",
      "What a significant F means",
      "Post hoc choices and planned contrasts",
      "Assumptions and effect size",
    ],
    [
      "Not recognising error inflation",
      "Saying ANOVA tells you which groups differ",
    ],
    { exams: ["mcp-entrance", "ma-semester", "ugc-net"] }),

  iv("iv-res-010", 2,
    "When would you use a chi-square test, and what are its assumptions?",
    [
      "What would you do if expected counts are below 5?",
      "How do you report effect size for chi-square?",
      "What is the difference between goodness of fit and test of independence?",
    ],
    "The chi-square test is used for categorical data. The test of independence checks whether two categorical variables are associated, for example whether help-seeking (yes or no) differs between rural and urban students. The goodness-of-fit test checks whether the distribution of one categorical variable matches an expected distribution, for example whether the gender split in my sample matches the college population. The test compares observed frequencies with the frequencies expected if there were no association. Its assumptions are that observations are independent, so each participant appears in only one cell, that data are frequencies rather than percentages or means, and that expected frequencies are large enough. A common rule is that no expected count should be below 1, and no more than 20% of cells should have expected counts below 5. In a 2 by 2 table with small expected counts, I would use Fisher's exact test, or combine categories if that makes sense. For effect size, I would report phi for a 2 by 2 table or Cramér's V for larger tables. I would also report the observed counts and percentages, the chi-square value, degrees of freedom and p-value, and avoid implying causation from an association.",
    [
      "Two uses with examples",
      "Observed versus expected logic",
      "Assumptions including expected counts",
      "Fisher's exact test alternative",
      "Effect size and reporting",
    ],
    [
      "Using percentages in chi-square",
      "Ignoring small expected counts",
    ],
    { exams: ["mcp-entrance", "ma-semester", "ugc-net"] }),

  iv("iv-res-011", 3,
    "Explain the results of your multiple regression. What does R squared tell you, and how did you check for multicollinearity?",
    [
      "What is the difference between a standardised and an unstandardised coefficient?",
      "What is adjusted R squared?",
      "What are the assumptions of linear regression?",
    ],
    "In my regression, I predicted depressive symptoms from academic stress, social support and sleep quality. R squared was 0.38, which means the three predictors together explained 38% of the variance in depressive symptoms in my sample. Adjusted R squared corrects for the number of predictors and sample size, so it is a better estimate of how well the model would generalise. Each predictor has a coefficient. The unstandardised coefficient, b, tells me how much the outcome changes for a one-unit change in that predictor, holding the others constant. The standardised coefficient, beta, puts all predictors on the same scale so their relative contributions can be compared. Multicollinearity occurs when predictors are highly correlated with each other, which makes coefficients unstable and hard to interpret. I checked it with the variance inflation factor, where values above about 5 or 10 suggest a problem, and with tolerance values. Mine were all below 2. I also checked the other assumptions: a linear relationship, independence of residuals using the Durbin-Watson statistic, homoscedasticity using a plot of residuals against predicted values, normally distributed residuals, and the absence of influential outliers using Cook's distance. Finally, I would stress that regression shows prediction, not causation.",
    [
      "Interpretation of R squared and adjusted R squared",
      "b versus beta",
      "Multicollinearity and VIF or tolerance",
      "Other assumptions with checks",
      "Prediction versus causation",
    ],
    [
      "Interpreting R squared as percent of people",
      "Not knowing how multicollinearity is checked",
    ],
    { exams: ["mcp-entrance", "ma-semester", "ugc-net"] }),

  iv("iv-res-012", 3,
    "What is the difference between a mediator and a moderator? Give an example of each from clinical psychology.",
    [
      "How do you test mediation today?",
      "How do you test moderation?",
      "Can cross-sectional data establish mediation?",
    ],
    "A mediator explains how or why an independent variable affects an outcome. It is the mechanism in the middle of the causal chain. A moderator changes the strength or direction of the relationship between two variables. It answers 'for whom' or 'under what conditions'. An example of mediation: childhood adversity leads to adult depression partly through negative self-schemas, so self-schemas mediate the link. An example of moderation: the link between stressful life events and depression is stronger in people with low social support, so social support moderates the relationship. Baron and Kenny's steps were the traditional approach to mediation, but today the indirect effect is tested directly, usually with bootstrapped confidence intervals, using tools like the PROCESS macro or structural equation modelling. If the confidence interval for the indirect effect does not include zero, there is evidence of mediation. Moderation is tested by including an interaction term, the product of the predictor and the moderator, in a regression after centring the variables, and then probing the interaction with simple slopes. Cross-sectional data can show a statistical indirect effect, but they cannot establish true mediation, because mediation implies temporal order and causation. Longitudinal designs or experiments that manipulate the mediator are needed for stronger claims.",
    [
      "Clear definitions of mediator and moderator",
      "Correct clinical examples of each",
      "Modern mediation testing with bootstrapping",
      "Moderation via interaction terms",
      "Limits of cross-sectional mediation",
    ],
    [
      "Swapping the definitions",
      "Claiming cross-sectional mediation proves mechanism",
    ],
    { exams: ["mcp-entrance", "ma-semester", "ugc-net"] }),

  iv("iv-res-013", 4,
    "You used a scale's factor structure from a Western study. How would you check whether it holds in your Indian sample?",
    [
      "What is the difference between EFA and CFA?",
      "Which fit indices would you report?",
      "What is measurement invariance and why does it matter?",
    ],
    "I would test whether the same factor structure fits my data, ideally with confirmatory factor analysis. Exploratory factor analysis is used when we do not have a clear hypothesis about the structure. It lets the data suggest how many factors there are and which items load on them, using criteria like parallel analysis and scree plots, and rotations such as oblimin when factors are expected to correlate. Confirmatory factor analysis tests a pre-specified model, here the factor structure reported in the Western study, to see how well it fits my data. I would report fit indices such as the chi-square test (which is sensitive to sample size), the comparative fit index and Tucker-Lewis index, where values above about 0.90 to 0.95 suggest acceptable fit, the RMSEA, ideally below 0.06 to 0.08, and the SRMR, below 0.08. If the fit is poor, I would look at modification indices carefully and consider an EFA in a separate sample. If I want to compare scores between groups, such as Indian and American students or men and women, I would need to test measurement invariance: configural, meaning the same structure; metric, meaning equal loadings; and scalar, meaning equal intercepts. Without scalar invariance, mean comparisons may reflect measurement differences rather than true differences.",
    [
      "EFA versus CFA and when to use each",
      "Factor retention and rotation choices",
      "Fit indices with typical cut-offs",
      "Handling poor fit carefully",
      "Measurement invariance levels and their importance",
    ],
    [
      "Assuming Western factor structures hold automatically",
      "Not knowing any fit index",
    ],
    { exams: ["mcp-entrance", "ugc-net"] }),

  iv("iv-res-014", 2,
    "You did a qualitative study. Explain how you carried out thematic analysis.",
    [
      "What is the difference between a code and a theme?",
      "How did you decide your sample size?",
      "What is reflexivity, and how did you practise it?",
    ],
    "I followed Braun and Clarke's approach to reflexive thematic analysis, which has six phases. First, I familiarised myself with the data by transcribing interviews and reading them several times, noting initial ideas. Second, I generated initial codes, which are short labels for meaningful features of the data, such as 'fear of being judged by relatives'. Third, I searched for themes by grouping codes into broader patterns of shared meaning, for example 'stigma as a barrier to help-seeking'. Fourth, I reviewed the themes against the coded extracts and the whole data set, merging or splitting them where needed. Fifth, I defined and named each theme clearly. Sixth, I wrote the report, weaving together vivid extracts and analytic interpretation. A code is a single idea, while a theme is a central organising concept that captures something important about the data in relation to the research question. For sample size, I interviewed 14 caregivers and stopped when new interviews were adding little new to the developing themes, while recognising that in reflexive thematic analysis the idea of saturation is debated. I practised reflexivity by keeping a journal about how my own background as a young urban woman might shape my interpretations, and by discussing codes with my supervisor.",
    [
      "Names the approach and six phases",
      "Code versus theme with examples",
      "Sampling rationale",
      "Reflexivity in practice",
      "Use of extracts and analytic writing",
    ],
    [
      "Describing themes as just frequent words",
      "No reflexivity",
    ]),

  iv("iv-res-015", 3,
    "How do you ensure rigour in qualitative research? Isn't it just subjective?",
    [
      "What is member checking?",
      "What is the difference between transferability and generalisability?",
      "Should qualitative researchers calculate inter-rater reliability?",
    ],
    "Qualitative research does involve interpretation, but subjectivity is acknowledged and managed rather than ignored, and there are clear standards of quality. Lincoln and Guba proposed trustworthiness criteria that parallel quantitative ideas. Credibility, similar to internal validity, asks whether the findings are a believable account of participants' experiences. It is strengthened by prolonged engagement, triangulation of data sources or methods, member checking (sharing interpretations with participants for feedback), and peer debriefing. Transferability, similar to external validity, is supported by thick description of the context and participants so readers can judge whether findings apply to their own settings. This differs from statistical generalisability. Dependability, similar to reliability, is supported by an audit trail documenting decisions. Confirmability, similar to objectivity, is supported by reflexivity and showing how interpretations are grounded in the data. On inter-rater reliability, it depends on the approach. In coding reliability approaches, agreement between coders can be useful. In reflexive thematic analysis, the researcher's interpretation is seen as a resource, so discussion between researchers is used to deepen analysis rather than to calculate agreement. I would also follow reporting guidelines like COREQ. So qualitative research is systematic and transparent, even if not objective in the positivist sense.",
    [
      "Acknowledges and manages subjectivity",
      "Four trustworthiness criteria with strategies",
      "Transferability versus generalisability",
      "Nuanced view on inter-rater reliability",
      "Reporting standards",
    ],
    [
      "Agreeing it is just opinion",
      "Insisting qualitative work must be objective in positivist terms",
    ]),

  iv("iv-res-016", 3,
    "What are mixed methods designs? Which would you choose for evaluating a school mental health programme?",
    [
      "What is the difference between convergent and explanatory sequential designs?",
      "How do you integrate qualitative and quantitative findings?",
      "What are the challenges of mixed methods?",
    ],
    "Mixed methods research combines quantitative and qualitative data in one study, with deliberate integration, to answer questions that neither approach can answer alone. The main designs are these. In a convergent design, both types of data are collected at the same time and compared or merged, to see whether they agree. In an explanatory sequential design, quantitative data come first and qualitative data follow to explain the results, such as interviewing students who improved most or least. In an exploratory sequential design, qualitative data come first to explore a topic and develop a tool or hypotheses, which are then tested quantitatively. For evaluating a school mental health programme, I would probably choose an explanatory sequential design. I would first measure outcomes such as wellbeing, stress and help-seeking in programme and comparison schools before and after the programme, then interview students, teachers and counsellors to understand why it worked or did not, and what helped or hindered implementation. Integration can happen through joint displays that place quantitative results beside qualitative themes, and through using one data set to explain another. The challenges are time, the skills needed for both methods, and resolving contradictions between the two kinds of findings, which can themselves be informative.",
    [
      "Definition with integration emphasised",
      "Three core designs",
      "Justified choice for the programme",
      "Integration strategies",
      "Challenges",
    ],
    [
      "Describing two separate studies with no integration",
      "Wrong sequence for the named design",
    ]),

  iv("iv-res-017", 1,
    "What ethical steps did you take in your dissertation?",
    [
      "Did you get ethics committee approval? From whom?",
      "What would you do if a participant scored high on suicidal ideation?",
      "How did you store your data?",
    ],
    "I would describe the concrete steps I took. For example: 'I got approval from my department's institutional ethics committee before collecting any data. I gave every participant an information sheet in English and Gujarati explaining the purpose, what participation involved, the time needed, possible discomfort, their right to withdraw at any time without penalty, and how their data would be kept confidential. I took written informed consent, and for participants under 18, I took parental consent and the student's own assent. Questionnaires were anonymous, using codes instead of names. Because I used the PHQ-9, which includes an item on thoughts of self-harm, I planned in advance what to do if someone endorsed it. I included a helpline sheet, including Tele-MANAS, with every questionnaire, and with ethics committee approval, I used a separate consent section asking whether participants with high scores were willing to be contacted by the college counsellor. I stored paper forms in a locked cupboard and digital data in a password-protected file, separate from consent forms, and I reported only group results.' This follows ICMR guidelines and the APA ethics code. I would also be honest if any step was missing and say what I would do differently.",
    [
      "Ethics committee approval",
      "Informed consent elements, including withdrawal",
      "Consent and assent for minors",
      "Plan for risk disclosures",
      "Data security and confidentiality",
    ],
    [
      "No ethics approval mentioned",
      "No plan for participants at risk",
    ]),

  iv("iv-res-018", 2,
    "Your study found no significant results. What does that tell us?",
    [
      "Is absence of evidence the same as evidence of absence?",
      "How can you tell whether a null result is informative?",
      "Should null results be published?",
    ],
    "A non-significant result means my data did not provide enough evidence to reject the null hypothesis at my chosen alpha. It does not prove that there is no effect, because absence of evidence is not evidence of absence. To judge what it means, I would look at several things. First, power: was my sample large enough to detect a realistic effect? If power was low, the null result is not very informative. Second, the effect size and its confidence interval. If the interval is narrow and centred near zero, that suggests any true effect is probably small. If it is wide and includes meaningful effects, the result is inconclusive. Third, measurement: were my tools reliable and sensitive enough? Fourth, the design: were there problems like range restriction, poor manipulation or ceiling effects? For stronger evidence of no effect, equivalence testing or Bayesian analysis can quantify support for the null. Null results should be published, because publication bias towards positive findings distorts the literature and inflates effect sizes in meta-analyses. Registered reports and preregistration help with this. So I would present my null result honestly, discuss these factors, and explain what it adds to the field.",
    [
      "Correct meaning of non-significance",
      "Absence of evidence versus evidence of absence",
      "Power, CI and measurement considerations",
      "Equivalence or Bayesian approaches",
      "Value of publishing null results",
    ],
    [
      "Saying the hypothesis is proven false",
      "Hiding or spinning the null result",
    ],
    { exams: ["mcp-entrance", "ma-semester", "ugc-net"] }),

  iv("iv-res-019", 3,
    "What is the replication crisis in psychology, and what reforms have been made?",
    [
      "What is p-hacking?",
      "What is preregistration?",
      "How would you apply open science in an Indian MA or M.Phil project?",
    ],
    "The replication crisis refers to the discovery, especially from the early 2010s, that many published psychological findings could not be reproduced. In a large collaborative project published in 2015, only around 36% of replications of studies from major psychology journals gave statistically significant results, and effect sizes were about half the originals on average. The causes include small, underpowered samples; publication bias, where journals favour positive and surprising results; questionable research practices such as p-hacking, meaning trying different analyses, dropping outliers or adding participants until p falls below 0.05; HARKing, which is hypothesising after the results are known; and sometimes fraud. Reforms include preregistering hypotheses and analysis plans before collecting data, registered reports, where journals accept papers before results are known, open sharing of data, materials and code, larger samples and multi-site collaborations, reporting effect sizes and confidence intervals, and more replication studies. In an Indian MA or M.Phil project, I could preregister my hypotheses on a public platform like the Open Science Framework, conduct a power analysis, report all measures and analyses including non-significant ones, separate confirmatory from exploratory analyses, and share anonymised data when ethics permits.",
    [
      "Definition and approximate scale of the problem",
      "Causes including p-hacking and HARKing",
      "Key reforms",
      "Practical application to own research",
    ],
    [
      "Not knowing what p-hacking is",
      "Claiming the crisis means psychology is not a science",
    ],
    { exams: ["mcp-entrance", "ma-semester", "ugc-net"] }),

  iv("iv-res-020", 3,
    "How would you design a single-case study to test whether a token economy reduces a child's tantrums?",
    [
      "What is the difference between ABAB and multiple-baseline designs?",
      "When is a withdrawal design unethical?",
      "How do you analyse single-case data?",
    ],
    "A single-case experimental design studies one participant intensively over time, with repeated measurement, and uses the participant as their own control. First, I would define tantrums operationally, for example as crying or screaming lasting more than one minute, and measure their frequency daily through structured parent or teacher records, checking inter-observer agreement. In an ABAB or reversal design, I would collect a stable baseline (A), introduce the token economy (B), withdraw it (A), and reintroduce it (B). If tantrums fall each time the intervention is introduced and rise when it is withdrawn, that is strong evidence of a causal effect. However, withdrawal can be unethical when the behaviour is dangerous, such as self-injury, or when the skill learned cannot be 'unlearned'. In that case, I would use a multiple-baseline design, introducing the intervention at staggered times across settings, behaviours or children. If change occurs only when the intervention starts in each baseline, that supports causation. Analysis traditionally uses visual inspection of level, trend, variability and immediacy of change in graphs, supplemented by statistics such as non-overlap of all pairs or Tau-U. Single-case designs are valuable in clinical practice and for rare conditions.",
    [
      "Operational definition and repeated measurement",
      "ABAB logic",
      "Ethical limits of withdrawal",
      "Multiple-baseline alternative",
      "Visual and statistical analysis",
    ],
    [
      "No baseline phase",
      "Using withdrawal for dangerous behaviour without discussion",
    ],
    { exams: ["mcp-entrance", "ma-semester", "ugc-net"] }),

  iv("iv-res-021", 4,
    "Design a randomised controlled trial of a brief CBT intervention for exam anxiety in Indian college students.",
    [
      "What would your control group be, and why?",
      "How would you handle drop-outs?",
      "What is allocation concealment?",
    ],
    "I would define a clear question: does a six-session group CBT programme reduce exam anxiety compared with an active control, in first-year undergraduates with moderate to high test anxiety? Eligible students would be screened with a validated test anxiety scale, excluding those with severe depression or suicide risk, who would be referred for care. After consent, students would be randomly allocated, using computer-generated block randomisation stratified by college, to CBT or an active control, such as a study skills group of equal length. An active control helps separate the specific effects of CBT from attention and group support. Allocation concealment, meaning that those enrolling participants cannot know or influence the next assignment, would be ensured with sealed envelopes or central allocation. Outcome assessors would be blind to group. The primary outcome would be test anxiety scores after the programme, with secondary outcomes such as exam performance and wellbeing, and follow-up at three months. I would calculate sample size from a power analysis and register the trial with the Clinical Trials Registry of India before recruitment. For drop-outs, I would use intention-to-treat analysis, analysing participants in their allocated groups, with appropriate handling of missing data. I would report following CONSORT guidelines and get ethics approval.",
    [
      "Clear question with population, intervention, comparison and outcome",
      "Randomisation and allocation concealment",
      "Justified control condition and blinding",
      "Outcomes, follow-up and power",
      "Trial registration, intention-to-treat and reporting",
    ],
    [
      "No control group",
      "Confusing randomisation with random sampling",
      "Per-protocol only analysis",
    ],
    { exams: ["mcp-entrance"] }),

  iv("iv-res-022", 3,
    "What is a systematic review, and how is a meta-analysis different?",
    [
      "What is the risk of bias assessment?",
      "What is heterogeneity, and how is it measured?",
      "What is a funnel plot used for?",
    ],
    "A systematic review answers a focused question by identifying, appraising and synthesising all relevant studies using explicit, reproducible methods. It starts with a protocol, ideally registered, for example on PROSPERO, and a defined question, often using the PICO framework. It uses a comprehensive search of databases with clear inclusion and exclusion criteria, screening by two independent reviewers, data extraction, and assessment of the risk of bias in each study, for example with the Cochrane risk of bias tool for trials. A meta-analysis is a statistical technique that can be part of a systematic review. It combines the effect sizes from several studies to estimate an overall effect, weighting studies usually by their precision. Not every systematic review includes a meta-analysis, because studies may be too different to combine. Heterogeneity refers to variation in results between studies beyond chance. It is assessed with the Q statistic and I squared, where higher values, such as above 50%, suggest substantial heterogeneity, and it is explored with subgroup analyses or meta-regression. A random-effects model is used when we assume true effects vary. A funnel plot plots effect sizes against precision, and asymmetry can suggest publication bias. Reviews are reported using PRISMA guidelines.",
    [
      "Systematic review features",
      "Meta-analysis as statistical synthesis",
      "Risk of bias assessment",
      "Heterogeneity and its measurement",
      "Publication bias and reporting standards",
    ],
    [
      "Equating a narrative review with a systematic review",
      "Saying all systematic reviews must include meta-analysis",
    ],
    { exams: ["mcp-entrance", "ugc-net"] }),

  iv("iv-res-023", 4,
    "For a PhD interview: propose a research idea in clinical psychology relevant to India, and defend its feasibility.",
    [
      "What is your primary hypothesis?",
      "What is the biggest threat to your study's validity?",
      "How would your findings change practice?",
    ],
    "One idea I would propose is: 'Does a lay counsellor-delivered, culturally adapted behavioural activation programme reduce depressive symptoms among older adults in rural Gujarat, compared with enhanced usual care?' It is relevant because depression in older adults is common, under-recognised and undertreated in India, and specialist resources are scarce. Task-sharing with lay health workers has worked in earlier Indian trials for depression in primary care. My primary hypothesis is that the programme will reduce depressive symptoms on the Geriatric Depression Scale at three months compared with enhanced usual care. I would start with a qualitative phase to adapt the intervention through interviews with older adults and health workers, then a pilot to test acceptability, and then a cluster randomised trial across villages, which reduces contamination between groups. Feasibility depends on partnerships with the district health system and community health workers, training and supervision of lay counsellors, validated Gujarati tools, and a realistic sample size from a power calculation that accounts for clustering. The biggest threats are differential drop-out, contamination, and the fidelity of delivery, which I would monitor with session recordings and checklists. If effective, it could be scaled through Ayushman Arogya Mandirs and the district mental health programme.",
    [
      "Clear, focused question with Indian relevance",
      "Rationale linked to the treatment gap and task-sharing",
      "Testable primary hypothesis",
      "Appropriate design with phases",
      "Feasibility, threats to validity and policy impact",
    ],
    [
      "Vague topic with no question",
      "Unrealistic scope for a PhD",
      "No awareness of threats to validity",
    ],
    { exams: ["mcp-entrance"] }),

  iv("iv-res-024", 3,
    "How do you know whether a client's change on a questionnaire after therapy is real? Explain the reliable change index.",
    [
      "What is clinically significant change?",
      "Why can a statistically significant group effect hide individual non-responders?",
      "How would you use routine outcome monitoring?",
    ],
    "A change in a client's score could be due to measurement error rather than real change, so we need a way to judge whether it is larger than the error. Jacobson and Truax proposed the reliable change index for this. It divides the difference between the pre- and post-therapy scores by the standard error of the difference, which is based on the test's standard deviation and its reliability. If the result is greater than 1.96, the change is unlikely to be due to measurement error at the 95% level, so it counts as reliable change. Clinically significant change asks a further question: has the client moved from the dysfunctional range into the functional range, for example crossing a cut-off point between clinical and normal population scores? A client can show reliable improvement without reaching the normal range, or vice versa. At the group level, a statistically significant average improvement can hide individuals who did not improve or got worse, which is why individual-level indices matter. In practice, I would use routine outcome monitoring, collecting brief measures like the PHQ-9 or CORE-10 at every session, plotting progress, discussing it with the client, and using feedback to adjust treatment when the client is not on track.",
    [
      "Problem of measurement error",
      "RCI formula logic and 1.96 threshold",
      "Clinically significant change",
      "Group versus individual change",
      "Routine outcome monitoring",
    ],
    [
      "Treating any score drop as improvement",
      "Not knowing the role of reliability",
    ],
    { module: "assessment" }),

  iv("iv-res-025", 2,
    "You translated an English scale into Hindi for your study. How did you make sure the translation was valid?",
    [
      "What is back-translation, and what are its limits?",
      "What is cognitive interviewing?",
      "What are the different types of equivalence?",
    ],
    "Cross-cultural adaptation is more than literal translation, because we need the Hindi version to measure the same construct in the same way. I would follow a standard process, such as the WHO guidelines. First, forward translation by two independent bilingual translators, at least one familiar with the construct and one a lay translator. Second, reconciliation of the two versions by a committee. Third, back-translation into English by a translator who has not seen the original, to check that the meaning has not shifted. Back-translation can catch errors, but it can also encourage overly literal translations that sound awkward to native speakers, so it is not enough on its own. Fourth, an expert committee review for conceptual, semantic, idiomatic and experiential equivalence, for example adapting items about activities that are uncommon in India. Fifth, pre-testing with cognitive interviewing, where a small group of target respondents explain in their own words what each item means to them and how they chose their answer, which reveals confusing items. Finally, a psychometric evaluation in a larger sample to check reliability, factor structure and validity, and to develop local norms if needed. I would document every step and report it as part of my method.",
    [
      "Adaptation beyond literal translation",
      "Forward translation, reconciliation and back-translation",
      "Limits of back-translation",
      "Types of equivalence and expert review",
      "Cognitive interviewing and psychometric testing",
    ],
    [
      "Only Google Translate or a single translator",
      "No pre-testing",
    ],
    { module: "assessment" }),

  iv("iv-res-026", 3,
    "About 15% of your questionnaire data were missing. How did you handle it?",
    [
      "What is the difference between MCAR, MAR and MNAR?",
      "Why is listwise deletion often a problem?",
      "What is multiple imputation?",
    ],
    "I would first explore the pattern of missing data, because the right approach depends on why data are missing. Data are missing completely at random (MCAR) when missingness has nothing to do with any variable, for example a page lost by chance. They are missing at random (MAR) when missingness is related to observed variables but not to the missing values themselves, for example younger students skipping more items. They are missing not at random (MNAR) when missingness depends on the missing values, for example highly distressed students skipping the depression items. Little's MCAR test and comparing completers with non-completers can help. Listwise deletion, removing any case with missing data, reduces sample size and power and can bias results unless data are MCAR. Mean substitution is not recommended because it shrinks variance and distorts relationships. For individual missing items within a scale, many manuals allow prorating if only a few items are missing. For larger amounts, multiple imputation creates several plausible complete data sets based on the relationships in the data, analyses each, and combines the results, which accounts for uncertainty. Full information maximum likelihood is another good approach. I would report how much data were missing, the method used, and a sensitivity analysis comparing results across approaches.",
    [
      "Explores the pattern first",
      "MCAR, MAR and MNAR with examples",
      "Problems with listwise deletion and mean substitution",
      "Multiple imputation or FIML",
      "Transparent reporting and sensitivity analysis",
    ],
    [
      "Deleting all incomplete cases without thought",
      "Mean substitution as the solution",
    ],
    { exams: ["mcp-entrance", "ugc-net"] }),

  iv("iv-res-027", 1,
    "What is the difference between a research question, a hypothesis and an objective?",
    [
      "What makes a hypothesis testable?",
      "What is a null hypothesis?",
      "Should qualitative studies have hypotheses?",
    ],
    "A research question is the broad question my study is trying to answer, for example: 'What is the relationship between social media use and loneliness among college students?' An objective is a specific, achievable aim that shows what I will do to answer the question, for example: 'To assess the correlation between daily social media use and loneliness scores' or 'To compare loneliness between high and low users.' A hypothesis is a specific, testable prediction about the expected relationship or difference, based on theory or past research, for example: 'Students with higher daily social media use will report higher loneliness scores.' A good hypothesis is testable, meaning the variables can be measured and the prediction could be shown to be wrong. It is also clear about the direction if a direction is expected. The null hypothesis states that there is no relationship or difference, such as 'there is no correlation between social media use and loneliness', and this is what statistical tests evaluate. Qualitative studies usually do not test hypotheses, because they aim to explore meanings and experiences openly. Instead, they use open research questions like 'How do students experience loneliness in the context of social media?' and may generate hypotheses for future research.",
    [
      "Clear distinction among question, objective and hypothesis",
      "Examples of each",
      "Testability",
      "Null hypothesis",
      "Qualitative studies use questions rather than hypotheses",
    ],
    [
      "Treating the three terms as the same",
      "An untestable hypothesis",
    ]),

  iv("iv-res-028", 2,
    "What is the difference between statistical significance and clinical significance? Give an example.",
    [
      "What is a minimal clinically important difference?",
      "Can a clinically important effect be non-significant?",
      "How would you present both in a thesis?",
    ],
    "Statistical significance tells us whether an observed effect is unlikely to be due to chance, given the sample and the test. Clinical significance asks whether the effect is large or meaningful enough to matter in people's lives. They can differ because statistical significance depends heavily on sample size. For example, a large trial of 2,000 people might find that a new intervention reduces depression scores by an average of 1 point on the PHQ-9, which is statistically significant, p less than 0.001, but too small to make a noticeable difference to a patient. On the other hand, a small pilot study of 20 people might find a 6-point reduction, which is clinically important, but not statistically significant because the study had low power. Clinical significance can be judged with effect sizes, reliable and clinically significant change, the proportion of people who recover or respond, the number needed to treat, or a minimal clinically important difference, which is the smallest change patients themselves perceive as meaningful. In a thesis, I would report test statistics and p-values, effect sizes with confidence intervals, and clinically meaningful indicators such as the percentage of participants showing reliable improvement, and then discuss what the findings mean for practice.",
    [
      "Definitions of each",
      "Role of sample size",
      "Examples in both directions",
      "Ways to judge clinical significance",
      "Reporting both",
    ],
    [
      "Equating p less than 0.05 with clinical importance",
    ],
    { exams: ["mcp-entrance", "ma-semester", "ugc-net"] }),

  iv("iv-res-029", 3,
    "What are threats to internal validity? Which ones applied to your pre-post study?",
    [
      "What is regression to the mean?",
      "How does a control group help?",
      "What is the difference between internal and external validity?",
    ],
    "Internal validity is the degree to which we can conclude that the independent variable, not something else, caused the change in the outcome. External validity is about whether the findings generalise to other people, settings and times. Campbell and Stanley described several threats to internal validity. History means outside events between measurements, such as exams or festivals. Maturation means natural changes over time, such as students settling into college. Testing means the effect of taking a pre-test on post-test scores. Instrumentation means changes in measurement, such as a different interviewer. Statistical regression to the mean means that people selected because of extreme scores tend to score closer to average on retesting, even without any intervention. Selection means differences between groups at the start. Attrition means differential drop-out. In a single-group pre-post study of a stress workshop, the most relevant threats would be history, maturation, testing and regression to the mean, especially if I selected highly stressed students. So any improvement could not be confidently attributed to the workshop. A randomised control group helps because these threats affect both groups equally, so the difference between groups is more likely due to the intervention. I would acknowledge these threats honestly in my limitations.",
    [
      "Definitions of internal and external validity",
      "Main threats listed and explained",
      "Regression to the mean",
      "Application to own pre-post design",
      "How a randomised control group addresses them",
    ],
    [
      "Not knowing regression to the mean",
      "Claiming a pre-post design proves effectiveness",
    ],
    { exams: ["mcp-entrance", "ma-semester", "ugc-net"] }),

  iv("iv-res-030", 2,
    "Your data were not normally distributed. What options did you have?",
    [
      "How would you check normality?",
      "When is a transformation appropriate?",
      "What is bootstrapping?",
    ],
    "First, I would check how serious the departure from normality is, using histograms, Q-Q plots, skewness and kurtosis values, and tests like Shapiro-Wilk. With large samples, these tests become significant for tiny departures, so I rely more on plots and the size of skew. Also, many tests assume normality of the residuals or the sampling distribution, not of the raw data, and with larger samples the central limit theorem makes parametric tests fairly robust. If the problem is serious, I have several options. I could use non-parametric tests, such as Mann-Whitney U instead of an independent t-test, Wilcoxon signed-rank instead of a paired t-test, Kruskal-Wallis instead of one-way ANOVA, and Spearman's rho instead of Pearson's r. These compare ranks and make fewer assumptions but can have less power. I could transform the data, for example using a log or square root transformation for positively skewed data such as reaction times, which is appropriate when the transformation makes theoretical sense and I interpret results on the transformed scale. I could use robust methods, such as trimmed means. Or I could use bootstrapping, which resamples my data many times to estimate the sampling distribution and confidence intervals without assuming normality. I would also check for outliers or data entry errors first.",
    [
      "Ways to check normality and their limits",
      "Robustness of parametric tests",
      "Non-parametric alternatives correctly paired",
      "Transformations",
      "Bootstrapping and checking outliers",
    ],
    [
      "Wrong non-parametric pairing",
      "Relying only on a significance test of normality",
    ],
    { exams: ["mcp-entrance", "ma-semester", "ugc-net"] }),

  iv("iv-res-031", 4,
    "How would you study the effectiveness of Tele-MANAS calls on callers' distress, given that you cannot randomise callers?",
    [
      "What quasi-experimental designs could you use?",
      "What ethical issues arise with helpline research?",
      "Which outcomes would you measure?",
    ],
    "Randomising people in crisis to no help would be unethical, so I would use quasi-experimental and implementation research methods. One option is a pre-post design with follow-up: with consent, measuring callers' distress at the start of the call with a brief scale, at the end, and at a follow-up call after one or two weeks. This shows change, but cannot rule out regression to the mean or natural recovery, so I would be cautious in interpretation. A stronger option is an interrupted time series, which uses routine data, such as helpline usage, or district-level indicators like emergency visits for self-harm, before and after Tele-MANAS was introduced in a region, controlling for trends. A stepped roll-out across states could support a difference-in-differences analysis comparing regions that started earlier with those that started later. Propensity score matching could compare callers referred onwards with similar callers who were not. Outcomes would include distress, suicidal ideation, help-seeking and linkage to services, caller satisfaction and safety events. Qualitative interviews with callers and counsellors would explain how the service works. Ethical issues include consent from distressed callers, confidentiality, safety protocols if follow-up reveals risk, and ensuring research does not delay help.",
    [
      "Recognises randomisation is unethical",
      "Pre-post with appropriate caution",
      "Time series or difference-in-differences designs",
      "Relevant outcomes and qualitative component",
      "Ethical safeguards",
    ],
    [
      "Proposing to deny help to a control group",
      "Overclaiming causation from pre-post data",
    ],
    { exams: ["mcp-entrance"] }),
];

export const INTERVIEWS: InterviewQuestion[] = ITEMS.sort((a, b) => a.difficulty - b.difficulty);
