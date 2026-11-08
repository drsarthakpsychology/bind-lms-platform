import type { FigureDef } from "../types";
import { Arrow, Axes, Dot, FILL, L, Line, P, T, callouts, gauss, plot } from "./kit";

/** Standard normal cumulative probability (Abramowitz and Stegun 7.1.26). */
export function phi(z: number): number {
  const t = 1 / (1 + 0.3275911 * (Math.abs(z) / Math.SQRT2));
  const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-(z * z) / 2);
  return z >= 0 ? 0.5 * (1 + y) : 0.5 * (1 - y);
}
/** Inverse of phi by bisection. */
export function phiInv(p: number): number {
  let lo = -8;
  let hi = 8;
  for (let i = 0; i < 60; i++) {
    const m = (lo + hi) / 2;
    if (phi(m) < p) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}

/* ---------- 1. normal curve with aligned scales ---------- */
// Reference checked: areas 34.13, 13.59, 2.14 and 0.13 percent per SD band; T = 50 + 10z; deviation IQ = 100 + 15z; Wechsler
// subtest scaled score = 10 + 3z; stanine mean 5 SD 2 (OpenStax Psychology 2e, 7.3 Measures of intelligence; standard tables).
const NX = (z: number) => 246 + z * 50;
const NY = (v: number) => 170 - v * 135;
const ROWS: [string, string, string, (string | number)[]][] = [
  ["z", "z score", "How many standard deviations a score is from the mean. A z of +1 is one SD above average.", [-3, -2, -1, 0, 1, 2, 3]],
  ["t", "T score", "T = 50 + 10z, so the mean is 50 and the SD 10. Used by the MMPI and many personality scales; 70 or more is usually flagged.", [20, 30, 40, 50, 60, 70, 80]],
  ["iq", "IQ score", "Deviation IQ = 100 + 15z. About 2 percent score below 70, one of the criteria for intellectual disability.", [55, 70, 85, 100, 115, 130, 145]],
  ["pct", "Percentile", "The percentage of people scoring below. An IQ of 115 is about the 84th percentile. Percentiles are not equal steps: they bunch in the middle.", ["0.1", 2, 16, 50, 84, 98, "99.9"]],
  ["scaled", "Scaled", "Wechsler subtest scaled scores have a mean of 10 and an SD of 3, so they run from 1 to 19.", [1, 4, 7, 10, 13, 16, 19]],
];
const normal: FigureDef = {
  id: "normal-curve-scales",
  title: "The normal curve and the score scales built on it",
  viewBox: "70 0 345 300",
  summary: "A normal curve divided by standard deviations, with z scores, T scores, IQ scores, percentiles and Wechsler scaled scores lined up beneath it.",
  art: (
    <g>
      {[-3, -2, -1, 0, 1, 2].map((z) => {
        const tone = Math.abs(z + 0.5) < 1 ? "e" : Math.abs(z + 0.5) < 2 ? "a" : "d";
        return <path key={z} d={`${plot(gauss(0, 1), z, z + 1, NX, NY, 30)} L${NX(z + 1)},170 L${NX(z)},170 Z`} className={FILL[tone]} />;
      })}
      <P d={plot(gauss(0, 1), -3.4, 3.4, NX, NY, 120)} w={2.2} />
      <Line x1={NX(-3.4)} y1={170} x2={NX(3.4)} y2={170} />
      {[-3, -2, -1, 0, 1, 2, 3].map((z) => <Line key={z} x1={NX(z)} y1={z === 0 ? NY(1) : NY(gauss(0, 1)(z))} x2={NX(z)} y2={176} tone={z === 0 ? "ink" : "grey"} w={z === 0 ? 1.5 : 1} />)}
      {[["34.1%", -0.5, 100], ["34.1%", 0.5, 100], ["13.6%", -1.5, 150], ["13.6%", 1.5, 150], ["2.1%", -2.45, 162], ["2.1%", 2.45, 162]].map(([t, z, y], i) => (
        <T key={i} x={NX(z as number)} y={y as number} size={9} bold>{t}</T>
      ))}
      <T x={NX(-3.15)} y={150} size={8} muted>0.1%</T>
      <T x={NX(3.15)} y={150} size={8} muted>0.1%</T>
      {ROWS.map((r, i) => (
        <g key={r[0]}>
          <Line x1={86} y1={196 + i * 21} x2={404} y2={196 + i * 21} tone="grey" w={0.5} />
          {r[3].map((v, j) => <T key={j} x={NX(j - 3)} y={194 + i * 21 - 4} size={9.5}>{v}</T>)}
        </g>
      ))}
    </g>
  ),
  labels: [
    L("mean", "Mean, median, mode", NX(0), NY(1) + 4, "In a normal curve the three averages fall at the same central point, the peak."),
    L("sd", "One SD band", NX(-0.5), 128, "About 68 percent of scores fall within 1 SD of the mean, 95 percent within 2 SD and 99.7 percent within 3 SD."),
    ...ROWS.map((r, i) => L(r[0], r[1], i < 3 ? 86 : 410, 186 + i * 21, r[2])),
  ],
};

/* ---------- 2. signal detection ---------- */
// Reference checked: equal variance signal detection model: noise and signal plus noise distributions, criterion, hits,
// misses, false alarms, correct rejections, d prime = z(hit rate) minus z(false alarm rate) (OpenStax Psychology 2e, 5.1).
const DX = (v: number) => 210 + v * 48;
const DY = (v: number) => 180 - v * 130;
const CRIT = 0.3;
const sdtA = callouts(
  [
    { id: "noise", name: "Noise alone", at: [DX(-1.6), DY(gauss(-1, 1)(-1.6))], about: "What the senses report on trials with no signal: background noise varies from trial to trial." },
    { id: "signal", name: "Signal plus noise", at: [DX(1.6), DY(gauss(1, 1)(1.6))], about: "On signal trials the same noise is present plus the signal, so the whole curve shifts to the right." },
    { id: "dprime", name: "d prime (sensitivity)", at: [DX(0), 40], about: "The distance between the two peaks in SD units. Bigger d prime means the signal is easier to tell apart, whatever the person's bias." },
    { id: "crit", name: "Criterion (bias)", at: [DX(CRIT), 70], about: "The cut-off the person sets. Above it they say yes. A cautious radiologist moves it right; one afraid of missing cancer moves it left." },
  ],
);
const sdtB = callouts(
  [
    { id: "hit", name: "Hits", at: [DX(1.3), 160], about: "Signal present and the person said yes." },
    { id: "miss", name: "Misses", at: [DX(-0.2), 172], about: "Signal present but the person said no." },
    { id: "fa", name: "False alarms", at: [DX(0.7), 174], about: "No signal but the person said yes. Moving the criterion left raises hits and false alarms together." },
    { id: "cr", name: "Correct rejections", at: [DX(-1.2), 150], about: "No signal and the person said no." },
  ],
);
const sdt: FigureDef = {
  id: "signal-detection",
  title: "Signal detection: two curves and a cut-off",
  viewBox: "0 0 420 206",
  summary: "Noise alone and signal plus noise form two overlapping curves; a criterion splits them into hits, misses, false alarms and correct rejections, and d prime is the distance between the peaks.",
  art: (
    <g>
      <path d={`${plot(gauss(1, 1), CRIT, 4, DX, DY)} L${DX(4)},180 L${DX(CRIT)},180 Z`} className={FILL.b} />
      <path d={`${plot(gauss(1, 1), -2.5, CRIT, DX, DY)} L${DX(CRIT)},180 L${DX(-2.5)},180 Z`} className={FILL.a} />
      <path d={`${plot(gauss(-1, 1), CRIT, 2.5, DX, DY)} L${DX(2.5)},180 L${DX(CRIT)},180 Z`} className={FILL.c} />
      <P d={plot(gauss(-1, 1), -4.2, 2.5, DX, DY)} w={2.2} />
      <P d={plot(gauss(1, 1), -2.5, 4.2, DX, DY)} tone="acc" w={2.2} />
      <Line x1={10} y1={180} x2={410} y2={180} />
      <Line x1={DX(CRIT)} y1={36} x2={DX(CRIT)} y2={186} tone="red" w={2} />
      <T x={DX(CRIT) + 4} y={30} size={8} anchor="start" muted>yes →</T>
      <T x={DX(CRIT) - 4} y={30} size={8} anchor="end" muted>← no</T>
      <Arrow x1={DX(-1)} y1={44} x2={DX(1)} y2={44} both size={5} w={1.2} />
      <Line x1={DX(-1)} y1={44} x2={DX(-1)} y2={DY(1)} tone="grey" dash w={1} />
      <Line x1={DX(1)} y1={44} x2={DX(1)} y2={DY(1)} tone="grey" dash w={1} />
      <T x={210} y={198} size={9} muted>strength of the evidence</T>
    </g>
  ),
  labels: [...sdtA.labels, ...sdtB.labels],
};

/* ---------- 3. ROC curve ---------- */
// Reference checked: ROC plots hit rate (sensitivity) against false alarm rate (1 minus specificity) across criteria; the
// diagonal is chance; curves bow towards the top left as d prime grows; area under the curve summarises accuracy (NCBI Bookshelf).
const RX = (f: number) => 40 + f * 200;
const RYY = (h: number) => 250 - h * 200;
const roc = (d: number) => (f: number) => (f <= 0 ? 0 : f >= 1 ? 1 : phi(phiInv(f) + d));
const rocC = callouts(
  [
    { id: "perfect", name: "Perfect test", at: [RX(0), RYY(1)], about: "The top left corner: every case found and no false alarms." },
    { id: "d2", name: "Good test (d prime 2)", at: [RX(0.2), RYY(roc(2)(0.2))], about: "A strong test hugs the top left. Area under the curve here is about 0.92." },
    { id: "d1", name: "Weak test (d prime 1)", at: [RX(0.45), RYY(roc(1)(0.45))], about: "A weaker test bows less. Area under the curve about 0.76." },
    { id: "chance", name: "Chance line", at: [RX(0.7), RYY(0.7)], about: "The diagonal: a coin toss, area under the curve 0.5. A test on this line tells you nothing." },
    { id: "strict", name: "Strict cut-off", at: [RX(0.03), RYY(roc(2)(0.03))], about: "A high cut-off score on a screening test: few false positives but more cases missed (high specificity)." },
    { id: "lax", name: "Lenient cut-off", at: [RX(0.6), RYY(roc(2)(0.6))], about: "A low cut-off: catches nearly every case (high sensitivity) at the price of many false positives. Screening tools such as the PHQ-9 choose a point in between." },
    { id: "auc", name: "Area under the curve", at: [RX(0.5), RYY(0.3)], about: "The shaded area: the chance that the test ranks a random true case above a random non-case." },
  ],
);
const rocFig: FigureDef = {
  id: "roc-curve",
  title: "The ROC curve",
  viewBox: "0 0 262 290",
  summary: "Plotting hit rate against false alarm rate for every cut-off gives the ROC curve; better tests bow towards the top left corner.",
  art: (
    <g>
      <path d={`${plot(roc(2), 0, 1, RX, RYY, 100)} L${RX(1)},250 L${RX(0)},250 Z`} className={FILL.a} />
      <rect x={RX(0)} y={RYY(1)} width={200} height={200} className="fill-none stroke-muted-foreground" strokeWidth={0.8} />
      <Line x1={RX(0)} y1={RYY(0)} x2={RX(1)} y2={RYY(1)} tone="grey" dash />
      <P d={plot(roc(1), 0, 1, RX, RYY, 100)} tone="red" w={2.2} />
      <P d={plot(roc(2), 0, 1, RX, RYY, 100)} tone="acc" w={2.5} />
      <Dot x={RX(0.03)} y={RYY(roc(2)(0.03))} r={4} />
      <Dot x={RX(0.6)} y={RYY(roc(2)(0.6))} r={4} />
      <Axes x={40} y={250} w={210} h={210} xl="false alarm rate (1 minus specificity)" yl="hit rate (sensitivity)" />
      {[0, 0.5, 1].map((v) => <T key={v} x={RX(v)} y={262} size={9} muted>{v}</T>)}
      {[0.5, 1].map((v) => <T key={v} x={34} y={RYY(v) + 3} size={9} anchor="end" muted>{v}</T>)}
    </g>
  ),
  labels: rocC.labels,
};

/* ---------- 4. ABAB reversal design ---------- */
// Reference checked: single case ABAB design: baseline, intervention, withdrawal, reintroduction; phase change lines; visual
// analysis of level, trend and variability (NCBI Bookshelf, single case experimental designs overview).
const AB = [12, 11, 13, 12, 12, 7, 5, 4, 3, 3, 9, 11, 12, 11, 12, 6, 4, 3, 2, 2];
const BX = (s: number) => 40 + s * 17;
const BY = (v: number) => 200 - v * 11;
const abab: FigureDef = {
  id: "abab-design",
  title: "ABAB reversal design",
  viewBox: "0 0 420 250",
  summary: "Behaviour is measured across four phases: baseline, treatment, withdrawal of treatment and treatment again; if the behaviour changes each time the phase changes, the treatment is the likely cause.",
  art: (
    <g>
      {[0, 1, 2, 3].map((ph) => (
        <g key={ph}>
          <P d={AB.slice(ph * 5, ph * 5 + 5).map((v, i) => `${i ? "L" : "M"}${BX(ph * 5 + i + 1)},${BY(v)}`).join(" ")} tone={ph % 2 ? "acc" : "ink"} w={1.8} />
          {AB.slice(ph * 5, ph * 5 + 5).map((v, i) => <circle key={i} cx={BX(ph * 5 + i + 1)} cy={BY(v)} r={3.5} className={ph % 2 ? "fill-chart-1" : "fill-card stroke-foreground"} strokeWidth={1.2} />)}
          <T x={BX(ph * 5 + 3)} y={28} size={12} bold>{ph % 2 ? "B" : "A"}</T>
        </g>
      ))}
      {[5.5, 10.5, 15.5].map((s) => <Line key={s} x1={BX(s)} y1={34} x2={BX(s)} y2={200} tone="grey" dash />)}
      <Axes x={40} y={200} w={370} h={170} xl="session" yl="tantrums per day" />
      {[1, 5, 10, 15, 20].map((s) => <T key={s} x={BX(s)} y={212} size={9} muted>{s}</T>)}
    </g>
  ),
  labels: [
    L("a1", "Baseline", BX(3), BY(13), "Phase A: measure the behaviour before any treatment until it is stable."),
    L("b1", "Treatment", BX(8), BY(4), "Phase B: introduce the treatment, here praise for calm behaviour, and keep measuring. Tantrums fall."),
    L("a2", "Withdrawal", BX(13), BY(12), "Remove the treatment. If tantrums return, the change was probably due to the treatment, not time. Withdrawing a helpful treatment can be unethical."),
    L("b2", "Treatment again", BX(18), BY(3), "Reintroduce the treatment. A second drop replicates the effect within one person."),
    L("line", "Phase change line", BX(5.5), 120, "Dashed lines mark when the condition changed. Judge level, trend and variability on each side."),
  ],
};

/* ---------- 5. multiple baseline ---------- */
// Reference checked: multiple baseline across participants, settings or behaviours with staggered introduction of treatment
// and a stepped phase line (NCBI Bookshelf, single case designs).
const MB = [5, 8, 11];
const mbData = (start: number, k: number) => Array.from({ length: 15 }, (_, i) => (i + 1 < start ? 8 + ((i * 7 + k) % 3) - 1 : Math.max(1, 6 - (i + 1 - start) * 1.2 + ((i + k) % 2))));
const MBX = (s: number) => 60 + s * 21;
const multiBase: FigureDef = {
  id: "multiple-baseline",
  title: "Multiple baseline design",
  viewBox: "0 0 420 330",
  summary: "Treatment starts at a different time for each of three people; behaviour changes only when treatment reaches each one, which shows the treatment caused it.",
  art: (
    <g>
      {MB.map((start, k) => {
        const y0 = 100 + k * 92;
        const d = mbData(start, k);
        const yy = (v: number) => y0 - v * 7;
        return (
          <g key={k}>
            <Line x1={60} y1={y0} x2={400} y2={y0} />
            <Line x1={60} y1={y0} x2={60} y2={y0 - 80} />
            <P d={d.map((v, i) => `${i ? "L" : "M"}${MBX(i + 1)},${yy(v)}`).join(" ")} w={1.6} tone={k === 1 ? "acc" : "ink"} />
            {d.map((v, i) => <circle key={i} cx={MBX(i + 1)} cy={yy(v)} r={3} className={i + 1 >= start ? "fill-chart-1" : "fill-card stroke-foreground"} strokeWidth={1} />)}
            <T x={50} y={y0 - 36} size={9} anchor="end" muted>{`P${k + 1}`}</T>
          </g>
        );
      })}
      <P d={`M${MBX(4.5)},20 L${MBX(4.5)},104 L${MBX(7.5)},104 L${MBX(7.5)},196 L${MBX(10.5)},196 L${MBX(10.5)},288`} tone="grey" dash w={1.5} />
      {[1, 5, 10, 15].map((s) => <T key={s} x={MBX(s)} y={300} size={9} muted>{s}</T>)}
      <T x={230} y={318} size={9} muted>session</T>
    </g>
  ),
  labels: [
    L("base", "Baseline, all three", MBX(2), 100 - 9 * 7, "Everyone starts untreated. Longer baselines for later people show that time alone does not change the behaviour."),
    L("step", "Stepped phase line", MBX(7.5), 150, "Treatment begins at session 5, 8 and 11. The staggered start replaces the need to withdraw treatment."),
    L("p1", "Change after start", MBX(8), 100 - mbData(5, 0)[7] * 7, "Person 1 improves straight after treatment begins, while persons 2 and 3, still in baseline, do not change. That rules out a shared outside event."),
    L("p3", "Change repeats", MBX(13), 284 - mbData(11, 2)[12] * 7, "Each person changes only when the treatment reaches them: three replications."),
  ],
};

/* ---------- 6. 2 x 2 factorial interaction ---------- */
// Reference checked: factorial design with two independent variables; main effects are differences in marginal means;
// an interaction shows as non-parallel lines in the means plot (OpenStax Research Methods in Psychology, 8.1 Multiple IVs).
const FX = (i: number) => 110 + i * 200;
const FY = (v: number) => 210 - v * 8;
const factorial: FigureDef = {
  id: "factorial-interaction",
  title: "A 2 by 2 factorial design: main effects and interaction",
  viewBox: "0 0 420 250",
  summary: "Two factors crossed, plotted as lines of cell means: different heights show main effects, and lines that are not parallel show an interaction.",
  art: (
    <g>
      <Axes x={50} y={210} w={360} h={190} yl="improvement score" />
      <T x={FX(0)} y={226} size={10}>placebo</T>
      <T x={FX(1)} y={226} size={10}>medicine</T>
      <T x={210} y={242} size={9} muted>factor A: medicine</T>
      <P d={`M${FX(0)},${FY(4)} L${FX(1)},${FY(8)}`} w={2.2} />
      <P d={`M${FX(0)},${FY(10)} L${FX(1)},${FY(21)}`} tone="acc" w={2.5} />
      <P d={`M${FX(0)},${FY(10)} L${FX(1)},${FY(14)}`} tone="grey" dash w={1.5} />
      {[[0, 4], [1, 8], [0, 10], [1, 21]].map(([i, v], k) => <circle key={k} cx={FX(i)} cy={FY(v)} r={5} className={k > 1 ? "fill-chart-1 stroke-foreground" : "fill-card stroke-foreground"} strokeWidth={1.2} />)}
      <T x={FX(1) + 10} y={FY(21) + 4} size={9} anchor="start">CBT</T>
      <T x={FX(1) + 10} y={FY(8) + 4} size={9} anchor="start">no CBT</T>
    </g>
  ),
  labels: [
    L("cell", "Cell mean", FX(1), FY(21), "Each dot is the mean of one of the four groups, for example medicine plus CBT."),
    L("mainA", "Main effect of medicine", FX(0.5), FY(6), "Averaged over CBT and no CBT, people on medicine improve more: the lines rise from left to right."),
    L("mainB", "Main effect of CBT", FX(0.15), FY(11.65), "Averaged over both medicine groups, the CBT line sits higher."),
    L("inter", "Interaction", FX(0.8), FY(18.8), "The lines are not parallel: CBT adds much more when combined with medicine. The effect of one factor depends on the level of the other."),
    L("parallel", "Parallel = no interaction", FX(0.6), FY(12.4), "The dashed line shows what CBT plus medicine would look like if the two simply added up. Parallel lines mean no interaction."),
  ],
};

/* ---------- 7. serial position curve ---------- */
// Reference checked: free recall of a word list shows primacy and recency; a 30 second filled delay removes recency but not
// primacy (Murdock 1962; Glanzer and Cunitz 1966), as described in OpenStax Psychology 2e, 8.1.
const SP = [72, 58, 47, 40, 36, 33, 32, 31, 31, 30, 31, 32, 31, 33, 36, 42, 52, 64, 78, 88];
const SPD = [70, 56, 46, 39, 35, 33, 31, 31, 30, 30, 30, 31, 30, 31, 32, 32, 33, 33, 34, 34];
const PX = (i: number) => 50 + i * 17.5;
const PY = (v: number) => 210 - v * 1.8;
const serial: FigureDef = {
  id: "serial-position",
  title: "The serial position curve",
  viewBox: "0 0 420 250",
  summary: "When a list is recalled straight away, the first and last items are remembered best; after a short distracting delay the advantage for the last items disappears.",
  art: (
    <g>
      <Axes x={40} y={210} w={370} h={190} xl="position of the word in the list" yl="% recalled" />
      <P d={SP.map((v, i) => `${i ? "L" : "M"}${PX(i + 1)},${PY(v)}`).join(" ")} tone="acc" w={2.5} />
      <P d={SPD.map((v, i) => `${i ? "L" : "M"}${PX(i + 1)},${PY(v)}`).join(" ")} tone="red" w={2} dash />
      {SP.map((v, i) => <Dot key={i} x={PX(i + 1)} y={PY(v)} r={2.5} tone="acc" />)}
      {[1, 5, 10, 15, 20].map((s) => <T key={s} x={PX(s)} y={222} size={9} muted>{s}</T>)}
      {[0, 50, 100].map((v) => <T key={v} x={34} y={PY(v) + 3} size={9} anchor="end" muted>{v}</T>)}
    </g>
  ),
  labels: [
    L("primacy", "Primacy effect", PX(1), PY(72), "Early words get the most rehearsal and pass into long-term memory, so they are recalled well."),
    L("middle", "Middle items", PX(10), PY(30), "Words in the middle get little rehearsal and are pushed out of short-term memory by later ones."),
    L("recency", "Recency effect", PX(20), PY(88), "The last few words are still in short-term memory at the moment of recall."),
    L("delay", "After a 30 s delay", PX(19), PY(34), "Counting backwards for 30 seconds before recall wipes out recency but leaves primacy. This supports separate short and long-term stores."),
  ],
};

/* ---------- 8. forgetting curve ---------- */
// Reference checked: Ebbinghaus (1885) savings: about 58 percent after 20 minutes, 44 after 1 hour, 36 after 9 hours, 34
// after 1 day, 28 after 2 days, 25 after 6 days, 21 after 31 days (OpenStax Psychology 2e, 8.3 Problems with memory).
const EB: [number, number][] = [[0.0001, 100], [0.33, 58], [1, 44], [9, 36], [24, 34], [48, 28], [144, 25], [744, 21]];
const EX = (h: number) => 50 + (Math.log10(h + 0.1) + 1) * 86;
const EY = (v: number) => 210 - v * 1.8;
const forgetting: FigureDef = {
  id: "forgetting-curve",
  title: "The forgetting curve",
  viewBox: "0 0 420 250",
  summary: "Ebbinghaus found that most forgetting of nonsense syllables happens within the first hour or day, after which the curve flattens; spaced reviews slow it.",
  art: (
    <g>
      <P d={EB.map(([h, v], i) => `${i ? "L" : "M"}${EX(h)},${EY(v)}`).join(" ")} tone="acc" w={2.5} />
      {EB.slice(1).map(([h, v], i) => <Dot key={i} x={EX(h)} y={EY(v)} r={3.5} tone="acc" />)}
      <P d={`M${EX(24)},${EY(34)} L${EX(24)},${EY(95)} L${EX(48)},${EY(80)} L${EX(144)},${EY(70)} L${EX(144)},${EY(97)} L${EX(744)},${EY(88)}`} tone="red" w={1.8} dash />
      <Axes x={40} y={210} w={370} h={190} xl="time since learning (log scale)" yl="% saved" />
      {[[0.33, "20 min"], [1, "1 h"], [9, "9 h"], [24, "1 day"], [144, "6 d"], [744, "31 d"]].map(([h, t]) => <T key={t as string} x={EX(h as number)} y={222} size={8.5} muted>{t}</T>)}
      {[0, 50, 100].map((v) => <T key={v} x={34} y={EY(v) + 3} size={9} anchor="end" muted>{v}</T>)}
    </g>
  ),
  labels: [
    L("steep", "Steep early loss", EX(0.6), EY(51), "Over half the savings are gone within an hour."),
    L("flat", "Curve flattens", EX(144), EY(25), "After about a day, forgetting slows: what survives the first day tends to last."),
    L("savings", "Savings measure", EX(0.0001), EY(100), "Ebbinghaus measured how much less time it took to relearn a list: the savings method, more sensitive than recall."),
    L("review", "Spaced reviews", EX(24), EY(95), "Each review restores memory and the next decline is slower. Spacing study over days beats cramming."),
  ],
};

/* ---------- 9. Yerkes-Dodson ---------- */
// Reference checked: performance is an inverted U function of arousal; the optimum is lower for difficult or complex tasks
// and higher for simple ones (Yerkes and Dodson 1908; OpenStax Psychology 2e, 10.1 Motivation).
const YX = (a: number) => 50 + a * 340;
const YY = (v: number) => 210 - v * 160;
const yerkes: FigureDef = {
  id: "yerkes-dodson",
  title: "The Yerkes-Dodson curve",
  viewBox: "0 0 420 250",
  summary: "Performance rises with arousal up to a point and then falls; the best level of arousal is lower for difficult tasks than for simple ones.",
  art: (
    <g>
      <P d={plot(gauss(0.62, 0.22), 0, 1, YX, (v) => YY(v), 100)} tone="acc" w={2.5} />
      <P d={plot(gauss(0.38, 0.18), 0, 1, YX, (v) => YY(v * 0.92), 100)} tone="red" w={2.5} dash />
      <Line x1={YX(0.62)} y1={YY(1)} x2={YX(0.62)} y2={210} tone="grey" dash w={1} />
      <Line x1={YX(0.38)} y1={YY(0.92)} x2={YX(0.38)} y2={210} tone="grey" dash w={1} />
      <Axes x={50} y={210} w={355} h={190} xl="arousal or anxiety" yl="performance" />
      <T x={60} y={224} size={9} anchor="start" muted>low</T>
      <T x={392} y={224} size={9} anchor="end" muted>high</T>
    </g>
  ),
  labels: [
    L("simple", "Simple task", YX(0.62), YY(1), "On easy or well practised tasks, such as running a sprint, performance peaks at fairly high arousal."),
    L("complex", "Complex task", YX(0.38), YY(0.92), "On difficult tasks, such as an exam or a first therapy session, performance peaks at lower arousal and falls off sooner."),
    L("opt", "Optimal arousal", YX(0.38), 200, "The best level of arousal. Moderate exam anxiety helps; severe anxiety hurts performance."),
    L("low", "Too little arousal", YX(0.08), YY(gauss(0.62, 0.22)(0.08)), "Bored or drowsy: performance suffers."),
    L("high", "Too much arousal", YX(0.92), YY(gauss(0.62, 0.22)(0.92)), "Panic and overwhelm: attention narrows and performance collapses."),
  ],
};

/* ---------- 10. stress vulnerability threshold ---------- */
// Reference checked: Zubin and Spring (1977) stress vulnerability model: a threshold curve; the more vulnerable the person,
// the less challenging life stress is needed to push them above the threshold into an episode (NCBI Bookshelf).
const VX = (v: number) => 50 + v * 340;
const VYY = (s: number) => 210 - s * 170;
const thr = (v: number) => Math.min(1.05, 0.08 / (v + 0.02) + 0.02);
const stressVuln: FigureDef = {
  id: "stress-vulnerability",
  title: "The stress vulnerability model",
  viewBox: "0 0 420 250",
  summary: "A threshold curve: people with high vulnerability fall ill with little stress, people with low vulnerability need a great deal of stress, and staying below the curve keeps a person well.",
  art: (
    <g>
      <path d={`${plot(thr, 0.06, 1, VX, VYY)} L${VX(1)},${VYY(1.05)} L${VX(0.06)},${VYY(1.05)} Z`} className={FILL.c} />
      <path d={`${plot(thr, 0.06, 1, VX, VYY)} L${VX(1)},210 L${VX(0.06)},210 Z`} className={FILL.b} />
      <P d={plot(thr, 0.06, 1, VX, VYY)} w={2.5} />
      <Axes x={50} y={210} w={355} h={190} xl="vulnerability (genes, early adversity)" yl="life stress" />
      <circle cx={VX(0.8)} cy={VYY(0.25)} r={6} className="fill-chart-5 stroke-foreground" strokeWidth={1.2} />
      <circle cx={VX(0.15)} cy={VYY(0.8)} r={6} className="fill-chart-5 stroke-foreground" strokeWidth={1.2} />
      <circle cx={VX(0.5)} cy={VYY(0.08)} r={6} className="fill-chart-1 stroke-foreground" strokeWidth={1.2} />
      <Arrow x1={VX(0.5) + 10} y1={VYY(0.08)} x2={VX(0.5) + 10} y2={VYY(0.2)} tone="grey" size={5} />
    </g>
  ),
  labels: [
    L("thr", "Threshold", VX(0.3), VYY(thr(0.3)), "The line above which an episode of illness starts. Its shape means stress and vulnerability trade off against each other."),
    L("ill", "Episode zone", VX(0.65), VYY(0.8), "Above the line: an episode of illness, such as a psychotic or depressive episode."),
    L("well", "Coping zone", VX(0.5), VYY(0.08), "Below the line the person stays well, even with real stress."),
    L("hv", "Vulnerable, small stress", VX(0.8), VYY(0.25), "A highly vulnerable person can relapse after a small stress, such as a family argument or stopping medicine."),
    L("lv", "Robust, big stress", VX(0.15), VYY(0.8), "Almost anyone can become unwell under extreme stress."),
  ],
};

/* ---------- 11. schedules of reinforcement ---------- */
// Reference checked: cumulative records: fixed ratio high rate with post-reinforcement pause; variable ratio highest steady
// rate; fixed interval scallop; variable interval steady moderate rate (OpenStax Psychology 2e, 6.3 Operant conditioning).
const SCX = (t: number) => 40 + t * 3.4;
const SCY = (r: number) => 220 - r * 1.8;
function fr(): [number, number][] {
  const p: [number, number][] = [[0, 0]];
  let t = 0;
  let r = 0;
  while (t < 96) {
    t += 4;
    p.push([t, r]);
    t += 8;
    r += 14;
    p.push([Math.min(t, 100), r]);
  }
  return p;
}
function fi(): [number, number][] {
  const p: [number, number][] = [];
  for (let k = 0; k < 5; k++) for (let i = 0; i <= 10; i++) p.push([k * 20 + i * 2, k * 13 + 13 * (i / 10) ** 2.5]);
  return p;
}
/** Time and total responses of the record point nearest time t (for pointing a label at the curve). */
const near = (pts: [number, number][], t: number) => pts.reduce((b, p) => (Math.abs(p[0] - t) < Math.abs(b[0] - t) ? p : b));
const at = (pts: [number, number][], t: number) => near(pts, t)[0];
const atR = (pts: [number, number][], t: number) => near(pts, t)[1];
const line = (pts: [number, number][]) => pts.map(([t, r], i) => `${i ? "L" : "M"}${SCX(t)},${SCY(r)}`).join(" ");
const schedules: FigureDef = {
  id: "reinforcement-schedules",
  title: "Schedules of reinforcement: cumulative records",
  viewBox: "0 0 420 250",
  summary: "Cumulative response records for the four partial schedules: ratio schedules give fast responding, fixed schedules give pauses or scallops, and variable schedules give steady responding.",
  art: (
    <g>
      <Axes x={40} y={220} w={370} h={210} xl="time" yl="total responses" />
      <P d={line([[0, 0], [100, 112]])} tone="red" w={2.2} />
      <P d={line(fr())} tone="acc" w={2.2} />
      <P d={line([[0, 0], [100, 52]])} tone="grey" w={2.2} />
      <P d={line(fi())} w={2.2} />
      {[20, 40, 60, 80].map((t) => <Line key={t} x1={SCX(t)} y1={SCY((t / 20) * 13) - 4} x2={SCX(t) + 5} y2={SCY((t / 20) * 13) + 2} w={1.5} />)}
    </g>
  ),
  labels: [
    L("vr", "Variable ratio", SCX(80), SCY(89.6), "Reward after an unpredictable number of responses, like a slot machine. The highest, steadiest rate and the hardest to extinguish."),
    L("fr", "Fixed ratio", SCX(at(fr(), 58)), SCY(atR(fr(), 58)), "Reward after every set number of responses, like piece work. Fast bursts with a short pause after each reward."),
    L("vi", "Variable interval", SCX(90), SCY(46.8), "The first response after an unpredictable time is rewarded, like checking for messages. Slow, steady responding."),
    L("fi", "Fixed interval", SCX(at(fi(), 58)), SCY(atR(fi(), 58)), "The first response after a set time is rewarded. Responding stops after each reward and speeds up as the time nears: the scallop."),
  ],
};

export const CURVES: FigureDef[] = [normal, sdt, rocFig, abab, multiBase, factorial, serial, forgetting, yerkes, stressVuln, schedules];
