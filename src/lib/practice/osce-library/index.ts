/** OSCE library: every authored batch, built into stations. */
import { buildStation, type LibStation } from "./types";
import { OSCE_BATCH_01 } from "./batch-01";
import { OSCE_BATCH_02 } from "./batch-02";
import { OSCE_BATCH_03 } from "./batch-03";

export const OSCE_LIBRARY_AUTHORED: LibStation[] = [...OSCE_BATCH_01, ...OSCE_BATCH_02, ...OSCE_BATCH_03];

export const OSCE_LIBRARY = OSCE_LIBRARY_AUTHORED.map(buildStation);
