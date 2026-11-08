/** The MSE Trainer's Level 2 tagging bank (beyond the first 12 stimuli). */
import type { MseStimulus } from "./mse";
import { STIM_1 } from "./mse-stimuli-1";
import { STIM_2 } from "./mse-stimuli-2";
import { STIM_3 } from "./mse-stimuli-3";
import { STIM_4 } from "./mse-stimuli-4";

export { stimulusExams } from "./mse-stimuli-helpers";

export const MSE_STIMULUS_BANK: MseStimulus[] = [...STIM_1, ...STIM_2, ...STIM_3, ...STIM_4];
