/** The Consulting Room library: every authored batch, built into DepthCases. */
import { buildLibraryCase, type LibSim, type LibraryCase } from "./types";
import { BATCH_01 } from "./batch-01-mood";
import { BATCH_02 } from "./batch-02-anxiety";
import { BATCH_03 } from "./batch-03-psychosis";
import { BATCH_04 } from "./batch-04-bipolar";
import { BATCH_05 } from "./batch-05-substance";
import { BATCH_06 } from "./batch-06-wider";
import { BATCH_07 } from "./batch-07-mood-wide";
import { BATCH_08 } from "./batch-08-anxiety-trauma";
import { BATCH_09 } from "./batch-09-neuro";
import { BATCH_10 } from "./batch-10-later-life";
import { BATCH_11 } from "./batch-11-personality";

export const SIM_LIBRARY_AUTHORED: LibSim[] = [...BATCH_01, ...BATCH_02, ...BATCH_03, ...BATCH_04, ...BATCH_05, ...BATCH_06, ...BATCH_07, ...BATCH_08, ...BATCH_09, ...BATCH_10, ...BATCH_11];

export const SIM_LIBRARY: LibraryCase[] = SIM_LIBRARY_AUTHORED.map(buildLibraryCase);
