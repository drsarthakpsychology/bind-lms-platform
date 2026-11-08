import type { FigureDef } from "../types";
import { Arrow, Axes, FILL, L, Line, P, T, callouts, plot, polar } from "./kit";

/** A trace over [x0, x1] at baseline y: fn(u) gives the upward deflection for u in 0..1 (u = fraction of the trace). */
function trace(x0: number, x1: number, y: number, fn: (u: number) => number, n = 400) {
  return plot(fn, 0, 1, (u) => x0 + (x1 - x0) * u, (v) => y - v, n);
}
/** Deterministic pink-ish noise: a few incommensurate sines. */
const noise = (amp: number, k = 1) => (u: number) => amp * (0.5 * Math.sin(u * 97 * k + 1) + 0.3 * Math.sin(u * 173 * k + 2) + 0.25 * Math.sin(u * 311 * k + 0.5) + 0.2 * Math.sin(u * 53 * k + 4));
const sine = (amp: number, cyc: number, ph = 0) => (u: number) => amp * Math.sin(2 * Math.PI * cyc * u + ph);
const bump = (c: number, w: number) => (u: number) => Math.exp(-0.5 * ((u - c) / w) ** 2);

/* ---------- 1. EEG rhythms ---------- */
// Reference checked: delta below 4 Hz, theta 4 to 7, alpha 8 to 12 or 13 (posterior, eyes closed, blocked by eye opening),
// beta 13 to 30 (frontal, alert, raised by benzodiazepines) (NCBI Bookshelf, StatPearls: EEG normal waveforms).
const ROW = [56, 124, 192, 260];
const W0 = 70;
const W1 = 390; // 320 units = 1 second
const eegWaves: FigureDef = {
  id: "eeg-rhythms",
  title: "The four EEG rhythms, one second each",
  viewBox: "0 0 420 300",
  summary: "One second of each EEG rhythm: fast low beta, alpha at about 10 per second, slower theta, and slow tall delta.",
  art: (
    <g>
      <P d={trace(W0, W1, ROW[0], (u) => sine(5, 21)(u) + noise(2.5, 2)(u))} w={1.3} />
      <P d={trace(W0, W1, ROW[1], (u) => sine(13, 10)(u) * (0.7 + 0.3 * Math.sin(u * 6)) + noise(2)(u))} w={1.3} tone="acc" />
      <P d={trace(W0, W1, ROW[2], (u) => sine(16, 6, 1)(u) + noise(3)(u))} w={1.3} />
      <P d={trace(W0, W1, ROW[3], (u) => sine(26, 2, 0.5)(u) + noise(3)(u))} w={1.3} tone="red" />
      {ROW.map((y, i) => <T key={i} x={60} y={y + 4} size={9} anchor="end" muted>{["20 Hz", "10 Hz", "6 Hz", "2 Hz"][i]}</T>)}
      <Line x1={W0} y1={290} x2={W1} y2={290} w={2} />
      <Line x1={W0} y1={285} x2={W0} y2={295} w={2} />
      <Line x1={W1} y1={285} x2={W1} y2={295} w={2} />
      <T x={230} y={286} size={9} muted>1 second</T>
      <Line x1={404} y1={240} x2={404} y2={280} w={2} />
      <T x={400} y={236} size={8} anchor="end" muted>50 µV</T>
    </g>
  ),
  labels: [
    L("beta", "Beta: 13 to 30 per second", 20, ROW[0] - 32, "Fast, low waves over the front of the head when alert, thinking or anxious. Benzodiazepines increase beta activity."),
    L("alpha", "Alpha: 8 to 12 per second", 20, ROW[1] - 32, "The resting rhythm of a relaxed adult with eyes closed, best seen over the back of the head. It vanishes when the eyes open (alpha blocking)."),
    L("theta", "Theta: 4 to 7 per second", 20, ROW[2] - 32, "Seen in drowsiness and stage N1 sleep and normal in children. Too much theta in an awake adult suggests brain dysfunction."),
    L("delta", "Delta: below 4 per second", 20, ROW[3] - 38, "Slow, tall waves of deep N3 sleep. In an awake adult, delta suggests delirium, encephalopathy or a structural lesion."),
  ],
};

/* ---------- 2. sleep stage EEG ---------- */
// Reference checked: N1 theta with vertex sharp waves, N2 sleep spindles (about 12 to 14 Hz, 0.5 s or more) and K complexes,
// N3 delta 0.5 to 2 Hz over 75 microvolts in at least 20 percent of the epoch, REM low voltage mixed with sawtooth waves and
// rapid eye movements (AASM scoring summary; NCBI Bookshelf, StatPearls: Physiology, Sleep Stages).
const S0 = 54;
const S1 = 276;
const SR = [40, 96, 152, 208, 264];
const spindle = (c: number) => (u: number) => 9 * bump(c, 0.035)(u) * Math.sin(2 * Math.PI * 70 * u);
const kc = (c: number) => (u: number) => 26 * bump(c, 0.012)(u) - 30 * bump(c + 0.035, 0.022)(u);
const sleepC = callouts(
  [
    { id: "alpha", name: "Alpha (eyes closed)", at: [100, SR[0] - 6], about: "Relaxed wakefulness with eyes closed shows alpha at 8 to 12 per second. It fades as sleep begins." },
    { id: "vertex", name: "Vertex sharp wave", at: [S0 + (S1 - S0) * 0.55, SR[1] - 18], about: "Stage N1: alpha gives way to slower theta, with sharp waves over the top of the head. Slow rolling eye movements are common." },
    { id: "spindle", name: "Sleep spindle", at: [S0 + (S1 - S0) * 0.3, SR[2] - 10], about: "Stage N2: a brief burst at about 12 to 14 per second lasting half a second or more, made by the thalamus. Benzodiazepines increase spindles." },
    { id: "kc", name: "K complex", at: [S0 + (S1 - S0) * 0.72, SR[2] + 22], about: "Stage N2: a large sharp wave with a slow tail, often triggered by a sound. Spindles and K complexes protect sleep from being broken." },
    { id: "delta", name: "Delta slow waves", at: [150, SR[3] - 26], about: "Stage N3 (deep or slow wave sleep): tall waves under 2 per second in at least a fifth of the record. Growth hormone peaks here; sleepwalking and night terrors arise here." },
    { id: "saw", name: "Sawtooth waves", at: [120, SR[4] - 8], about: "REM sleep: low, mixed, fast activity like waking, with sawtooth theta. Vivid dreams, rapid eye movements and loss of muscle tone." },
    { id: "eog", name: "Rapid eye movements", at: [230, SR[4] + 22], about: "The eye channel shows quick jerks in REM. Depression shortens the time to the first REM period; most antidepressants suppress REM." },
  ],
  290, 26, 40,
);
const sleepTraces: FigureDef = {
  id: "sleep-stage-eeg",
  title: "What each sleep stage looks like on EEG",
  viewBox: "0 0 420 300",
  summary: "EEG through the night: alpha when drowsy, theta and vertex waves in N1, spindles and K complexes in N2, tall slow delta in N3, and low fast sawtooth waves with eye movements in REM.",
  art: (
    <g>
      {["Awake", "N1", "N2", "N3", "REM"].map((s, i) => <T key={s} x={8} y={SR[i] + 4} size={10} anchor="start" bold>{s}</T>)}
      <P d={trace(S0, S1, SR[0], (u) => sine(9, 22)(u) + noise(2)(u))} w={1.1} />
      <P d={trace(S0, S1, SR[1], (u) => sine(6, 13, 1)(u) + noise(3)(u) + 16 * bump(0.55, 0.012)(u) - 8 * bump(0.575, 0.012)(u))} w={1.1} />
      <P d={trace(S0, S1, SR[2], (u) => sine(5, 12, 2)(u) + noise(3)(u) + spindle(0.3)(u) + kc(0.7)(u))} w={1.1} />
      <P d={trace(S0, S1, SR[3], (u) => sine(22, 3.2, 0.3)(u) + noise(4)(u))} w={1.1} tone="red" />
      <P d={trace(S0, S1, SR[4] - 6, (u) => noise(4, 1.6)(u) + 4 * Math.sin(2 * Math.PI * 14 * u) * bump(0.3, 0.06)(u) * 1.5)} w={1.1} tone="acc" />
      <P d={trace(S0, S1, SR[4] + 18, (u) => 12 * (Math.tanh((u - 0.4) * 300) - Math.tanh((u - 0.48) * 300) + Math.tanh((u - 0.78) * 300) * 0.8 - Math.tanh((u - 0.84) * 300) * 0.8) * 0.5)} w={1.1} tone="grey" />
      <T x={S1 + 2} y={SR[4] + 26} size={8} anchor="start" muted>eye</T>
      <Line x1={S0} y1={292} x2={S0 + 74} y2={292} w={2} />
      <T x={S0 + 37} y={288} size={8} muted>1 s</T>
      {sleepC.art}
    </g>
  ),
  labels: sleepC.labels,
};

/* ---------- 3. 3 per second spike and wave ---------- */
// Reference checked: childhood absence epilepsy shows generalised, symmetrical 3 Hz spike and wave discharges with abrupt
// onset and offset, often provoked by hyperventilation (NCBI Bookshelf, StatPearls: Absence seizure).
const CH = ["Fp1-F3", "F3-C3", "C3-P3", "P3-O1", "Fp2-F4", "F4-C4"];
const SW0 = 64;
const SW1 = 290;
const swFn = (amp: number) => (u: number) => {
  if (u < 0.22 || u > 0.86) return noise(3, 1.4)(u);
  const t = ((u - 0.22) / 0.64) * 7.5; // 7.5 cycles over the discharge
  const ph = t - Math.floor(t);
  const spike = 1.3 * Math.exp(-0.5 * ((ph - 0.08) / 0.02) ** 2) - 0.35 * Math.exp(-0.5 * ((ph - 0.16) / 0.03) ** 2);
  const wave = -0.8 * Math.exp(-0.5 * ((ph - 0.5) / 0.15) ** 2);
  return amp * (spike + wave) + noise(0.6)(u);
};
const swC = callouts(
  [
    { id: "bg", name: "Normal background", at: [SW0 + 20, 36], about: "Before the attack the record is normal." },
    { id: "onset", name: "Sudden start", at: [SW0 + (SW1 - SW0) * 0.22, 28], about: "The discharge starts abruptly in every channel at once. The child stops, stares and does not respond." },
    { id: "spike", name: "Spike", at: [SW0 + (SW1 - SW0) * 0.36, 16], about: "A sharp, fast spike from synchronised firing in loops between the thalamus and cortex." },
    { id: "wave", name: "Slow wave", at: [SW0 + (SW1 - SW0) * 0.55, 56], about: "Each spike is followed by a rounded slow wave. Spike plus wave repeats about 3 times a second." },
    { id: "gen", name: "Generalised", at: [SW0 + (SW1 - SW0) * 0.6, 196], about: "Both sides of the brain show it together, so it is a generalised seizure, not focal. Ethosuximide and valproate treat it; carbamazepine can worsen it." },
    { id: "end", name: "Sudden end", at: [SW0 + (SW1 - SW0) * 0.86, 140], about: "It stops as suddenly as it began, usually within 10 to 20 seconds, and the child carries on with no confusion afterwards." },
  ],
  300, 30, 36,
);
const spikeWave: FigureDef = {
  id: "spike-wave",
  title: "Absence seizure: 3 per second spike and wave",
  viewBox: "0 0 420 260",
  summary: "During a typical absence seizure, every EEG channel suddenly shows spike and slow wave complexes at about 3 per second, then stops as suddenly.",
  art: (
    <g>
      {CH.map((c, i) => (
        <g key={c}>
          <T x={58} y={36 + i * 34 + 3} size={8} anchor="end" muted>{c}</T>
          <P d={trace(SW0, SW1, 36 + i * 34, swFn(i < 4 ? 14 : 13))} w={1.1} tone={i % 2 ? "ink" : "acc"} />
        </g>
      ))}
      <Line x1={SW0 + (SW1 - SW0) * 0.22} y1={14} x2={SW0 + (SW1 - SW0) * 0.22} y2={222} tone="grey" dash w={1} />
      <Line x1={SW0 + (SW1 - SW0) * 0.86} y1={14} x2={SW0 + (SW1 - SW0) * 0.86} y2={222} tone="grey" dash w={1} />
      <Line x1={SW0} y1={246} x2={SW0 + (SW1 - SW0) * 0.64 / 2.5} y2={246} w={2} />
      <T x={SW0 + 30} y={240} size={8} anchor="start" muted>1 s</T>
      {swC.art}
    </g>
  ),
  labels: swC.labels,
};

/* ---------- 4. hypnogram ---------- */
// Reference checked: a healthy young adult night has 4 to 6 cycles of about 90 minutes; N3 is concentrated in the first third,
// REM periods lengthen towards morning; first REM about 70 to 100 minutes after sleep onset; N2 about half the night
// (NCBI Bookshelf, StatPearls: Physiology, Sleep Stages).
const HY: Record<string, number> = { W: 40, R: 70, N1: 100, N2: 130, N3: 160 };
const HX = (h: number) => 54 + h * 42;
const NIGHT: [number, string][] = [
  [0, "W"], [0.15, "N1"], [0.3, "N2"], [0.55, "N3"], [1.1, "N2"], [1.3, "R"], [1.5, "N2"], [1.75, "N3"], [2.35, "N2"], [2.75, "R"], [3.05, "W"], [3.12, "N1"], [3.2, "N2"],
  [3.8, "N3"], [4.0, "N2"], [4.55, "R"], [5.0, "N2"], [5.85, "R"], [6.45, "N1"], [6.55, "N2"], [7.2, "R"], [7.85, "W"], [8, "W"],
];
const hypPath = NIGHT.map(([h, s], i) => `${i ? `L${HX(h)},${HY[NIGHT[i - 1][1]]} ` : "M"}${HX(h)},${HY[s]}`).join(" ");
const hypA = callouts(
  [
    { id: "onset", name: "Sleep onset (N1)", at: [HX(0.2), HY.N1], about: "Light transitional sleep. A healthy adult falls asleep within about 10 to 20 minutes." },
    { id: "deep", name: "Deep N3 sleep early", at: [HX(0.8), HY.N3], about: "Most slow wave sleep comes in the first two cycles. It shrinks with age and is the first to rebound after sleep loss." },
    { id: "rem1", name: "First REM, about 90 min", at: [HX(1.4), HY.R], about: "The first REM period starts about 70 to 100 minutes after sleep onset and is short. In depression and narcolepsy it can start much sooner." },
  ],
  20, 210, 22,
);
const hypB = callouts(
  [
    { id: "cycle", name: "One cycle, about 90 min", at: [HX(2.2), 184], about: "NREM and REM alternate in cycles of about 90 minutes, 4 to 6 times a night." },
    { id: "wake", name: "Brief awakening", at: [HX(3.08), HY.W], about: "Short awakenings are normal and usually not remembered." },
    { id: "remlate", name: "REM lengthens", at: [HX(7.5), HY.R], about: "REM periods get longer towards morning, so most dreaming and REM happen in the last third of the night. Overall REM is about 20 to 25 percent of sleep." },
  ],
  220, 210, 22,
);
const hypnogram: FigureDef = {
  id: "hypnogram",
  title: "A night of sleep: the hypnogram",
  viewBox: "0 0 420 280",
  summary: "Across an 8 hour night the sleeper cycles between NREM and REM about every 90 minutes; deep N3 sleep fills the early cycles and REM periods grow longer towards morning.",
  art: (
    <g>
      {Object.entries(HY).map(([k, y]) => (
        <g key={k}>
          <T x={44} y={y + 3} size={9} anchor="end" muted>{k === "R" ? "REM" : k === "W" ? "Wake" : k}</T>
          <Line x1={54} y1={y} x2={HX(8)} y2={y} tone="grey" w={0.5} dash />
        </g>
      ))}
      <P d={hypPath} w={2} />
      {NIGHT.map(([h, s], i) => (s === "R" ? <rect key={i} x={HX(h)} y={HY.R - 4} width={HX(NIGHT[i + 1][0]) - HX(h)} height={8} className="fill-chart-1" /> : null))}
      <Axes x={54} y={176} w={350} h={150} />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((h) => <T key={h} x={HX(h)} y={188} size={9} muted>{h}</T>)}
      <T x={HX(8)} y={200} size={9} anchor="end" muted>hours asleep</T>
      <Arrow x1={HX(0.3)} y1={184} x2={HX(1.75)} y2={184} both size={4} w={1} />
      {hypA.art}
      {hypB.art}
    </g>
  ),
  labels: [...hypA.labels, ...hypB.labels],
};

/* ---------- 5. EEG 10-20 system ---------- */
// Reference checked: International 10-20 system: electrodes at 10 and 20 percent distances between nasion, inion and the
// preauricular points; letters Fp, F, C, T, P, O; odd numbers left, even right, z midline (Wikimedia Commons 10-20 diagram; NCBI Bookshelf, StatPearls: EEG).
const HC = { x: 130, y: 172 };
const R = 104;
const ELEC: [string, number, number][] = [
  ["Fp1", R, -18], ["Fp2", R, 18], ["F7", R, -54], ["F8", R, 54], ["T3", R, -90], ["T4", R, 90], ["T5", R, -126], ["T6", R, 126], ["O1", R, -162], ["O2", R, 162],
  ["F3", R * 0.62, -38], ["F4", R * 0.62, 38], ["P3", R * 0.62, -142], ["P4", R * 0.62, 142], ["Fz", R * 0.5, 0], ["Pz", R * 0.5, 180], ["C3", R * 0.5, -90], ["C4", R * 0.5, 90], ["Cz", 0, 0],
];
/** The right-hand edge of an electrode, where a leader line can touch it without hiding its name. */
const E = (name: string): [number, number] => {
  const e = ELEC.find((x) => x[0] === name)!;
  const [x, y] = polar(HC.x, HC.y, e[1], e[2]);
  return [x + 11, y];
};
const tenC = callouts(
  [
    { id: "nasion", name: "Nasion (front)", at: [HC.x, HC.y - R - 20], about: "The dip between the eyes at the top of the nose. Measurements start here and run back to the inion." },
    { id: "fp", name: "Fp and F: frontal", at: E("Fp1"), about: "Fp is frontopolar, over the forehead; F is frontal. Eye blinks and eye movements show up most here." },
    { id: "c", name: "C: central", at: E("C4"), about: "Over the motor and sensory strips. Cz sits at the vertex, the top of the head." },
    { id: "t", name: "T: temporal", at: E("T4"), about: "Over the temporal lobes, where the commonest focal epilepsy arises. T3 and T4 are called T7 and T8 in the newer naming." },
    { id: "p", name: "P: parietal", at: E("P4"), about: "Over the parietal lobes." },
    { id: "o", name: "O: occipital", at: E("O2"), about: "Over the visual cortex at the back, where the alpha rhythm is strongest." },
    { id: "z", name: "z: midline", at: E("Fz"), about: "A z (zero) marks the midline: Fz, Cz, Pz. Odd numbers are on the left, even numbers on the right." },
    { id: "spacing", name: "10 and 20 percent steps", at: [HC.x - 28, HC.y - 10], about: "Electrodes sit at 10 or 20 percent of the total distance front to back and ear to ear, so the map fits any head size." },
    { id: "ear", name: "Ear reference (A1, A2)", at: [HC.x + R + 14, HC.y], about: "Ear lobe electrodes are often used as a reference. A standard recording uses 19 scalp electrodes plus references." },
  ],
  270, 26, 34,
);
const tenTwenty: FigureDef = {
  id: "eeg-10-20",
  title: "The 10-20 EEG electrode map",
  viewBox: "0 0 420 320",
  summary: "Seen from above with the nose at the top, 19 EEG electrodes are placed at 10 and 20 percent steps across the head and named by brain region and side.",
  art: (
    <g>
      <path d={`M${HC.x - 12},${HC.y - R - 8} L${HC.x},${HC.y - R - 24} L${HC.x + 12},${HC.y - R - 8}`} className={`${FILL.n} stroke-foreground`} strokeWidth={1.5} />
      <ellipse cx={HC.x - R - 8} cy={HC.y} rx={9} ry={20} className={`${FILL.n} stroke-foreground`} strokeWidth={1.5} />
      <ellipse cx={HC.x + R + 8} cy={HC.y} rx={9} ry={20} className={`${FILL.n} stroke-foreground`} strokeWidth={1.5} />
      <circle cx={HC.x} cy={HC.y} r={R + 6} className={`${FILL.a} stroke-foreground`} strokeWidth={2} />
      <circle cx={HC.x} cy={HC.y} r={R} className="fill-none stroke-muted-foreground" strokeWidth={0.8} strokeDasharray="3 3" />
      <circle cx={HC.x} cy={HC.y} r={R * 0.5} className="fill-none stroke-muted-foreground" strokeWidth={0.8} strokeDasharray="3 3" />
      <line x1={HC.x} y1={HC.y - R} x2={HC.x} y2={HC.y + R} className="stroke-muted-foreground" strokeWidth={0.8} strokeDasharray="3 3" />
      <line x1={HC.x - R} y1={HC.y} x2={HC.x + R} y2={HC.y} className="stroke-muted-foreground" strokeWidth={0.8} strokeDasharray="3 3" />
      {ELEC.map(([n, r, a]) => {
        const [x, y] = polar(HC.x, HC.y, r, a);
        return (
          <g key={n}>
            <circle cx={x} cy={y} r={11} className={`${FILL.n} stroke-foreground`} strokeWidth={1.2} />
            <T x={x} y={y + 3} size={7.5} bold>{n}</T>
          </g>
        );
      })}
      <T x={HC.x - R - 8} y={HC.y + 34} size={8} muted>A1</T>
      <T x={HC.x + R + 8} y={HC.y + 34} size={8} muted>A2</T>
      <T x={HC.x} y={HC.y + R + 22} size={8} muted>inion (back)</T>
      <T x={20} y={20} size={8} anchor="start" muted>left</T>
      <T x={240} y={20} size={8} anchor="end" muted>right</T>
      {tenC.art}
    </g>
  ),
  labels: tenC.labels,
};

/* ---------- 6. ECT electrode placements ---------- */
// Reference checked: bitemporal (both temples, about 2.5 cm above the midpoint of the line from the outer eye corner to the
// ear opening), bifrontal (about 5 cm above each outer eye corner), right unilateral d'Elia placement (right temple and
// just right of the vertex) (NCBI Bookshelf, StatPearls: Electroconvulsive therapy).
const heads = [70, 210, 350];
const HR = 52;
function Head({ x }: { x: number }) {
  return (
    <g>
      <path d={`M${x - 8},${110 - HR - 4} L${x},${110 - HR - 16} L${x + 8},${110 - HR - 4}`} className={`${FILL.n} stroke-foreground`} strokeWidth={1.2} />
      <ellipse cx={x - HR - 4} cy={110} rx={6} ry={12} className={`${FILL.n} stroke-foreground`} strokeWidth={1.2} />
      <ellipse cx={x + HR + 4} cy={110} rx={6} ry={12} className={`${FILL.n} stroke-foreground`} strokeWidth={1.2} />
      <circle cx={x} cy={110} r={HR} className={`${FILL.a} stroke-foreground`} strokeWidth={1.5} />
    </g>
  );
}
function Pad({ at }: { at: [number, number] }) {
  return <circle cx={at[0]} cy={at[1]} r={8} className="fill-chart-5 stroke-foreground" strokeWidth={1.2} />;
}
const bt: [number, number][] = [polar(heads[0], 110, HR - 6, -70), polar(heads[0], 110, HR - 6, 70)];
const bf: [number, number][] = [polar(heads[1], 110, HR - 8, -28), polar(heads[1], 110, HR - 8, 28)];
const rul: [number, number][] = [polar(heads[2], 110, HR - 6, 70), polar(heads[2], 110, 16, 70)];
const eegLead: [number, number][] = [polar(heads[2], 110, HR - 6, -18), polar(heads[2], 110, HR - 6, 18)];
const ectLabels = [
  L("bt", "Bitemporal", 20, 196, "One electrode on each temple. Fastest and most reliable for very ill, suicidal or catatonic patients, but most memory side effects."),
  L("bf", "Bifrontal", 160, 196, "About 5 cm above each outer eye corner. Similar effectiveness with less effect on verbal memory than bitemporal."),
  L("rul", "Right unilateral", 300, 196, "One electrode on the right temple and one just right of the top of the head. Fewest memory effects; needs a dose about 6 times the seizure threshold to work well."),
  L("vertex", "Vertex pad", 300, 226, "The second electrode in right unilateral placement sits just to the right of the vertex, keeping current away from the left (language) hemisphere."),
  L("eeg", "EEG leads", 160, 226, "Two forehead EEG leads record the seizure, which should last at least about 15 to 25 seconds; a cuffed arm shows the motor seizure despite the muscle relaxant."),
];
const ect: FigureDef = {
  id: "ect-from-above",
  title: "ECT electrode placements, seen from above",
  viewBox: "0 0 420 250",
  summary: "The three ECT electrode placements: bitemporal on both temples, bifrontal on the forehead, and right unilateral on the right temple and near the top of the head.",
  art: (
    <g>
      {heads.map((x) => <Head key={x} x={x} />)}
      {bt.map((p, i) => <Pad key={`a${i}`} at={p} />)}
      {bf.map((p, i) => <Pad key={`b${i}`} at={p} />)}
      {rul.map((p, i) => <Pad key={`c${i}`} at={p} />)}
      {eegLead.map((p, i) => <circle key={`e${i}`} cx={p[0]} cy={p[1]} r={4} className="fill-foreground" />)}
      {heads.map((x) => <T key={x} x={x} y={36} size={8} muted>nose</T>)}
      <T x={heads[2] - 40} y={178} size={8} muted>left</T><T x={heads[2] + 40} y={178} size={8} muted>right</T>
      <Line x1={bt[0][0]} y1={bt[0][1]} x2={30} y2={186} tone="grey" w={0.8} />
      <Line x1={bf[1][0]} y1={bf[1][1]} x2={168} y2={186} tone="grey" w={0.8} />
      <Line x1={rul[0][0]} y1={rul[0][1]} x2={310} y2={186} tone="grey" w={0.8} />
      <Line x1={rul[1][0]} y1={rul[1][1]} x2={300} y2={217} tone="grey" w={0.8} />
      <Line x1={eegLead[0][0]} y1={eegLead[0][1]} x2={168} y2={217} tone="grey" w={0.8} />
    </g>
  ),
  labels: ectLabels,
};

/* ---------- 7. two process model with sleep hygiene ---------- */
// Reference checked: Borbely's two process model: homeostatic Process S rises during waking and falls in sleep; circadian
// Process C from the suprachiasmatic nucleus; melatonin rises about 2 hours before habitual sleep; core temperature lowest
// about 2 hours before waking (NCBI Bookshelf, StatPearls: Physiology, Circadian Rhythm; Sleep hygiene).
const TT = (h: number) => 40 + ((h - 7 + 24) % 24) * 15; // 07:00 at left, 24 hours across 360 units
const SS = (h: number) => {
  const t = (h - 7 + 24) % 24; // hours since waking
  return t <= 16 ? 1 - 0.8 * Math.exp(-t / 9) : (1 - 0.8 * Math.exp(-16 / 9)) * Math.exp(-(t - 16) / 3.2) + 0.08;
};
/** Alertness from the body clock: lowest about 04:30, rising to a peak about 20:00, then falling quickly. */
const CC = (h: number) => {
  const t = (((h - 4.5) % 24) + 24) % 24;
  const v = t < 15.5 ? -Math.cos((Math.PI * t) / 15.5) : Math.cos((Math.PI * (t - 15.5)) / 8.5);
  return 0.5 + 0.3 * v;
};
const VY = (v: number) => 190 - v * 150;
const twoA = callouts(
  [
    { id: "s", name: "Sleep pressure (Process S)", at: [TT(19), VY(SS(19))], about: "Adenosine builds up the longer you are awake, raising the drive to sleep; sleep clears it. Caffeine works by blocking adenosine receptors." },
    { id: "c", name: "Body clock (Process C)", at: [TT(12), VY(CC(12))], about: "The suprachiasmatic nucleus keeps a roughly 24 hour rhythm of alertness, set each morning by light reaching the eyes." },
    { id: "gate", name: "Sleep gate opens", at: [TT(23), 100], about: "Sleep comes easily when high sleep pressure meets falling body clock alertness, usually late evening." },
    { id: "mel", name: "Melatonin rises", at: [TT(21), 190], about: "Melatonin starts rising about 2 hours before usual bedtime in dim light. Bright screens delay it." },
    { id: "temp", name: "Temperature low point", at: [TT(4.5), 190], about: "Core body temperature is lowest about 2 hours before natural waking. Light after this point moves the clock earlier." },
  ],
  20, 222, 22,
);
const twoB = callouts(
  [
    { id: "h1", name: "1 Same wake time, light", at: [TT(7.2), 196], about: "Get up at the same time every day, weekends too, and get daylight in the first hour." },
    { id: "h2", name: "2 Caffeine before 2 pm", at: [TT(14), 196], about: "Caffeine lasts for hours, so avoid tea, coffee and colas in the afternoon and evening. Avoid alcohol and nicotine near bedtime too." },
    { id: "h3", name: "3 Dim light, screens off", at: [TT(21.5), 196], about: "Dim the lights and put screens away about an hour before bed." },
    { id: "h4", name: "4 Wind-down routine", at: [TT(22.4), 196], about: "A calm, repeated routine, with worries written down earlier in the evening." },
    { id: "h5", name: "5 Bed only for sleep", at: [TT(23.2), 196], about: "Go to bed only when sleepy; if awake for about 20 minutes, get up and return when sleepy. This is stimulus control, the core of CBT for insomnia." },
  ],
  224, 222, 22,
);
const twoProcess: FigureDef = {
  id: "two-process-sleep",
  title: "Why we sleep when we do, and five habits that help",
  viewBox: "0 0 420 340",
  summary: "Sleep pressure builds through the day while the body clock keeps us alert until evening; sleep comes when the two lines meet. Five habits line up with this daily cycle.",
  art: (
    <g>
      <rect x={TT(23)} y={36} width={TT(7) + 360 - TT(23)} height={154} className={FILL.d} />
      <T x={(TT(23) + 400) / 2} y={48} size={9} muted>asleep</T>
      <P d={plot(SS, 7, 31, (h) => 40 + (h - 7) * 15, (v) => VY(v), 200)} tone="acc" w={2.5} />
      <P d={plot(CC, 7, 31, (h) => 40 + (h - 7) * 15, (v) => VY(v), 200)} tone="red" w={2.5} dash />
      <Axes x={40} y={190} w={366} h={160} />
      {[7, 11, 15, 19, 23, 3, 7].map((h, i) => <T key={i} x={40 + i * 60} y={206} size={9} muted>{`${String(h).padStart(2, "0")}:00`}</T>)}
      {[7.2, 14, 21.5, 22.4, 23.2].map((h) => <path key={h} d={`M${TT(h)},190 l-4,-8 l8,0 Z`} className="fill-foreground" />)}
      {twoA.art}
      {twoB.art}
    </g>
  ),
  labels: [...twoA.labels, ...twoB.labels],
};

export const EEG: FigureDef[] = [eegWaves, sleepTraces, spikeWave, hypnogram, tenTwenty, ect, twoProcess];
