/**
 * Real labelled diagrams shown inside the one-page notes.
 * Each entry puts a figure (by id from src/components/study/figures) after
 * the note section with that index, so the picture sits next to its text.
 */
export type NoteFigure = { after: number; id: string; quiz?: boolean };

export const NOTE_FIGURES: Record<string, NoteFigure[]> = {
  mse: [{ after: 2, id: "copy-and-clock" }],
  assessment: [{ after: 2, id: "normal-curve-scales" }, { after: 3, id: "eysenck-circle" }],
  depression: [{ after: 5, id: "ssri-synapse" }],
  bipolar: [{ after: 4, id: "lithium-neuron" }],
  schizophrenia: [{ after: 5, id: "antipsychotic-d2" }],
  anxiety: [{ after: 3, id: "benzo-gabaa" }, { after: 1, id: "yerkes-dodson" }],
  ocd: [{ after: 3, id: "ssri-synapse", quiz: true }],
  suicide: [{ after: 2, id: "stress-vulnerability" }],
  antidepressants: [
    { after: 0, id: "ssri-synapse" },
    { after: 0, id: "tca-synapse" },
    { after: 0, id: "maoi-synapse" },
    { after: 1, id: "pk-steady-state" },
  ],
  antipsychotics: [
    { after: 0, id: "antipsychotic-d2" },
    { after: 0, id: "partial-agonist" },
    { after: 2, id: "d2-occupancy" },
    { after: 3, id: "liver-cell-cyp" },
  ],
  stabilisers: [{ after: 0, id: "lithium-neuron" }, { after: 2, id: "benzo-gabaa" }],
  therapies: [{ after: 0, id: "skinner-box" }, { after: 0, id: "reinforcement-schedules" }],
  personality: [{ after: 3, id: "eysenck-circle" }],
  substance: [{ after: 1, id: "nmda-receptor" }],
  dementia: [{ after: 0, id: "copy-and-clock" }, { after: 1, id: "forgetting-curve" }],
  child: [{ after: 0, id: "stimulant-synapse" }, { after: 1, id: "strange-situation-room" }],
  casesheet: [{ after: 0, id: "genogram-symbols" }],
  neuroscience: [
    { after: 0, id: "receptor-families" },
    { after: 0, id: "gpcr-scene" },
    { after: 1, id: "nmda-receptor" },
    { after: 4, id: "eeg-rhythms" },
  ],
  "dsm-psychosis": [{ after: 0, id: "antipsychotic-d2", quiz: true }],
  "dsm-depressive": [{ after: 0, id: "ssri-synapse", quiz: true }],
  "dsm-anxiety": [{ after: 0, id: "benzo-gabaa", quiz: true }],
  "dsm-elimination-sleep": [{ after: 1, id: "hypnogram" }, { after: 1, id: "sleep-stage-eeg" }, { after: 1, id: "two-process-sleep" }],
  "dsm-substance": [{ after: 1, id: "nmda-receptor", quiz: true }],
  "dsm-ncd": [{ after: 0, id: "copy-and-clock", quiz: true }],
  "dsm-neurodev": [{ after: 0, id: "stimulant-synapse", quiz: true }],
  "dsm-medication": [{ after: 0, id: "d2-occupancy", quiz: true }],
};
