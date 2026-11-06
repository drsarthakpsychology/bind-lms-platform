import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";
import { part1 } from "./statistics-1";
import { part2 } from "./statistics-2";
import { part3 } from "./statistics-3";

export const meta: ModuleMeta = {
  id: "statistics",
  num: 41,
  title: "Statistics for psychology",
  emoji: "📊",
  tagline: "From describing scores to t, F and chi-square by hand, effect size and power, regression, reliability, factor analysis and reading SPSS output",
  when: "Open to all levels",
  outcomes: [
    "Organise data, and compute and interpret the mean, median, mode, quartile deviation, variance and SD, including from grouped data",
    "Convert raw scores to z, T, stanines and percentiles, and build a confidence interval from the standard error",
    "State the logic of hypothesis testing, Type I and II errors, power, and one- versus two-tailed tests without the usual misreadings of p",
    "Compute Pearson's r, Spearman's rho, t (independent and paired), chi-square, one-way ANOVA and simple non-parametric tests by hand, and choose the right test for a design",
    "Compute and interpret Cohen's d, eta squared, Spearman-Brown, Cronbach's alpha, kappa and the standard error of measurement",
    "Explain regression, mediation, moderation, factor analysis and SEM, and read and report SPSS-style output in APA style",
  ],
  writeTask:
    "On paper, without notes: compute the mean and SD (sample formula) of 3, 7, 7, 9, 14; convert a score of 62 (mean 50, SD 8) to z, T and an approximate percentile; compute an independent t for two groups of four scores you invent; fill an ANOVA summary table (SS, df, MS, F) for three groups of three; draw the decision tree for choosing among t, ANOVA, chi-square, Pearson, Spearman, Mann-Whitney, Wilcoxon, Kruskal-Wallis and Friedman; and write one APA results sentence. Then check every number and correct in red.",
  activities: [
    act.coach("assessment", "Coach: assessment", "Reliability, validity and scores you mix up."),
    act.terms("Term match", "Statistics words against their meanings, fast."),
    act.lesson("cs-1", "Case files: clinic morning", "Which number would you collect, and how would you test it?"),
  ],
};

export const text = part1 + part2 + part3;
