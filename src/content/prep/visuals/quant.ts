import { R, concept, cycle, tl, type Concept } from "./kit";

/** Statistics, research methods and psychometrics: the real distributions behind the numbers, and true sequences of method. */

const ST = ["statistics", "research-methods", "psychometrics-assessment", "ugc-paper1"] as const;
const PS = ["psychometrics-assessment", "statistics", "developmental", "clinical-psychiatry"] as const;
const RM = ["research-methods", "ethics-law", "ugc-paper1"] as const;

export const QUANT: Concept[] = [
  /* ------------------------------------------------ the normal curve */
  concept("st-normal", R(ST, /normal (distribution|curve)|z.?scores?|standard (score|normal|deviation units?)|bell.shaped|68(\.26)?\s?(%|per)|95(\.44)?\s?(%|per)|99\.7|empirical rule|standard deviations? (above|below)|area (under|between|beyond)|proportion of (cases|scores)|unit normal|kurtosis|mesokurtic|leptokurtic|platykurtic/i), "curve", { kind: "normal", title: "The normal curve", caption: "Drag z. About 68% of scores lie within 1 standard deviation of the mean, 95% within 1.96 (about 2), and 99.7% within 3. z = (score minus mean) ÷ SD; z = +1 is the 84th percentile, z = -1 the 16th, z = +2 about the 98th." }),
  concept("st-pvalue", R(ST, /p.?values?|two.tailed|one.tailed|critical (value|region)|1\.96|2\.58|1\.645|alpha (level|of|=)|level of significance|significance level|reject(ing|ed)? the null|retain(ing)? the null|null hypothesis|statistically significant|region of rejection/i, undefined, /type (i|ii|1|2) error|power/i), "curve", { kind: "normal", title: "Where a result becomes significant", caption: "Drag z and watch the two-tailed p. At alpha = .05 two-tailed, the critical values are z = ±1.96 (2.5% in each tail); one-tailed it is 1.645 (all 5% in one tail); at .01 two-tailed, ±2.58. A p value is the chance of a result at least this extreme if the null hypothesis were true, not the chance the null is true." }),
  concept("st-ci", R(ST, /confidence interval|standard error( of the mean)?|margin of error|sampling distribution|central limit|point estimate|interval estimate|sample size.{0,40}(precision|width)|\bsem\b.{0,20}mean/i), "curve", { kind: "normal", title: "Sampling distributions and confidence intervals", caption: "Imagine the curve as the spread of means from many samples. By the central limit theorem it is close to normal for large samples, with SD = standard error = SD ÷ √n. A 95% confidence interval is the sample mean ± 1.96 standard errors; four times the sample size halves its width." }),
  concept("st-errors", R(["statistics", "research-methods", "psychometrics-assessment", "clinical-therapies"], /type (i|ii|1|2) errors?|type (one|two) errors?|false positive|false negative|statistical power|\bpower\b|beta (error|risk)|1 ?(-|minus|−) ?(beta|β)|power analysis|underpowered/i), "curve", { kind: "sdt", title: "Type I and Type II errors as two curves", caption: "Read the noise curve as 'the null hypothesis is true' and the signal curve as 'a real effect exists'. The criterion is the critical value. A false alarm is a Type I error (probability alpha); a miss is a Type II error (beta); hits are power (1 minus beta). Move the curves apart (bigger effect or larger sample) and power rises; move the criterion right (stricter alpha) and Type I errors fall but misses rise." }),
  concept("st-effect", R(["statistics", "research-methods", "clinical-therapies"], /effect size|cohen'?s d|\bd ?= ?0?\.\d|overlap of (the )?distributions|small.{0,15}medium.{0,15}large|glass'?s delta|hedges/i, undefined, /smith and glass/i), "curve", { kind: "sdt", title: "What an effect size looks like", caption: "Read d′ here as Cohen's d: how many standard deviations apart two group means are. Set it to 0.2 (small): the curves almost overlap. 0.5 (medium) and 0.8 (large) pull them apart, yet even at 0.8 the groups overlap a great deal. Effect size, unlike a p value, does not depend on sample size." }),
  concept("ps-norms", R(PS, /norms?\b|norm.referenced|standardi[sz]ation (sample|group)|percentile ranks?|stanines?|\bstens?\b|t.scores?|deviation iq|iq (score )?of \d+|mean of 100|standard deviation of 15|wechsler.{0,30}(mean|sd)|age equivalent|grade equivalent|flynn effect|scaled scores?/i, undefined, /cut.?off|sensitivity|specificity/i), "curve", { kind: "normal", title: "Standard scores on one curve", caption: "Drag z and read the IQ. Every standard score is the same z on a different scale: deviation IQ has mean 100 and SD 15 (z = +2 is IQ 130, about the 98th percentile); T scores mean 50, SD 10; stanines run 1 to 9 with mean 5, SD about 2; stens 1 to 10, mean 5.5, SD 2. Percentile ranks are not equal intervals: they bunch in the middle." }),
  concept("ps-sem", R(PS, /standard error of measurement|\bsem\b|true score|confidence band|obtained score|observed score|band of error|reliability.{0,40}(band|interval|error)|classical test theory|x ?= ?t ?\+ ?e/i), "curve", { kind: "normal", title: "A score is a range, not a point", caption: "Picture the curve centred on the obtained score. Standard error of measurement = SD × √(1 minus reliability). An IQ test with SD 15 and reliability .91 has SEM = 15 × 0.3 = 4.5, so a 95% band is about ±1.96 × 4.5 = ±9 points: an obtained 100 means the true score is probably between 91 and 109." }),

  /* ------------------------------------------------ research methods (true sequences) */
  concept("rm-ethics-history", R(RM, /nuremberg|helsinki|belmont|tuskegee|willowbrook|history of (research )?ethics|common rule|icmr (national )?(ethical )?guidelines/i), "timeline", tl("Put the milestones of research ethics in order", [
    ["Nuremberg Code after the Nazi doctors' trial: voluntary consent is essential", "1947"],
    ["Declaration of Helsinki (World Medical Association)", "1964"],
    ["The Tuskegee syphilis study is exposed after 40 years", "1972"],
    ["Belmont Report: respect for persons, beneficence, justice", "1979"],
    ["Current APA Ethics Code adopted (later amended)", "2002"],
    ["ICMR National Ethical Guidelines for biomedical and health research in India", "2017"],
  ])),
  concept("rm-thematic", R(["research-methods", "counselling", "clinical-therapies"], /thematic analysis|braun.{0,10}clarke|reflexive thematic/i), "timeline", tl("Put Braun and Clarke's six phases of thematic analysis in order", [
    ["Familiarise yourself with the data"],
    ["Generate initial codes"],
    ["Search for (generate) themes"],
    ["Review themes"],
    ["Define and name themes"],
    ["Produce the report"],
  ], "The phases are recursive: analysts move back and forth, and in the reflexive version themes are built by the researcher, not found waiting in the data.")),
  concept("rm-grounded", R(["research-methods"], /grounded theory|glaser|strauss|open coding|axial coding|selective coding|theoretical (saturation|sampling)|constant comparis|core category|memo.?writing/i), "timeline", tl("Put the steps of grounded theory in order", [
    ["Collect a first round of data"],
    ["Open coding: label the data line by line"],
    ["Axial coding: link codes into categories and their conditions"],
    ["Selective coding: choose the core category and build the theory around it"],
    ["Theoretical sampling: collect new data to test the categories, until saturation"],
  ], "Constant comparison and memo-writing run through every step. Glaser stressed letting the theory emerge; Strauss and Corbin added the more structured axial coding.")),
  concept("rm-rct", R(["research-methods", "clinical-therapies", "clinical-psychiatry", "statistics"], /consort|randomi[sz]ed controlled|allocation concealment|intention.to.treat|double.blind|single.blind|per.protocol|block randomi[sz]|stratified randomi[sz]/i), "timeline", tl("Put the stages of a randomised controlled trial in order", [
    ["Enrolment: check eligibility and take consent"],
    ["Generate a random allocation sequence"],
    ["Conceal the allocation until each person is enrolled"],
    ["Deliver the interventions, blinding participants, therapists or assessors where possible"],
    ["Follow up and record drop-outs"],
    ["Analyse by intention to treat: everyone in the group they were randomised to"],
  ], "Allocation concealment protects randomisation from being subverted; blinding protects the measurement afterwards.")),
  concept("rm-abab", R(["research-methods", "clinical-therapies", "learning-motivation-emotion"], /\babab\b|reversal design|withdrawal design|single.case|single.subject|multiple.baseline|changing.criterion|\bn ?= ?1\b|baseline phase/i), "timeline", tl("Put the phases of an ABAB reversal design in order", [
    ["A: baseline, measure the behaviour repeatedly without treatment"],
    ["B: introduce the treatment"],
    ["A: withdraw the treatment"],
    ["B: reintroduce the treatment"],
  ], "If the behaviour changes each time the treatment starts and stops, the treatment is the likely cause. When withdrawal would be unethical or the change cannot reverse, a multiple-baseline design staggers the start across people, settings or behaviours.")),
  concept("rm-kuhn", R(["research-methods", "history-systems", "ugc-paper1"], /kuhn|paradigm shift|normal science|scientific revolution|anomal(y|ies)|incommensurab/i), "flow", cycle("Kuhn: how science changes", [
    ["Normal science", "Puzzle-solving inside an accepted paradigm."],
    ["Anomalies", "Results that do not fit pile up."],
    ["Crisis", "Confidence in the paradigm fails."],
    ["Revolution", "A new paradigm replaces the old; the two may be incommensurable."],
  ], "Popper, by contrast, said science advances by trying to falsify bold conjectures.")),
  concept("rm-prisma", R(["research-methods", "clinical-therapies", "statistics"], /prisma|systematic review|steps? (of|in) (a )?meta.analysis|search strategy|inclusion criteria|risk of bias|pre.?registration|registered report|prospero/i), "timeline", tl("Put the steps of a systematic review and meta-analysis in order", [
    ["Register the protocol and question in advance (for example PICO)"],
    ["Search several databases with a set strategy"],
    ["Screen titles and abstracts, then full texts, against inclusion criteria"],
    ["Extract data and rate each study's risk of bias"],
    ["Pool effect sizes (fixed or random effects) and check heterogeneity"],
    ["Check for publication bias and report with a PRISMA flow diagram"],
  ])),
];
