/** The Consulting Room library: every authored batch, built into DepthCases. */
import { buildLibraryCase, type LibSim, type LibraryCase } from "./types";
import { BATCH_01 } from "./batch-01-mood";
import { BATCH_02 } from "./batch-02-anxiety";
import { BATCH_03 } from "./batch-03-psychosis";
import { BATCH_04 } from "./batch-04-bipolar";
import { BATCH_05 } from "./batch-05-substance";

export const SIM_LIBRARY_AUTHORED: LibSim[] = [...BATCH_01, ...BATCH_02, ...BATCH_03, ...BATCH_04, ...BATCH_05];

export const SIM_LIBRARY: LibraryCase[] = SIM_LIBRARY_AUTHORED.map(buildLibraryCase);
