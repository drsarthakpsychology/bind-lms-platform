/** Formulation library: every authored batch, built into Forge cases. */
import { buildFormulation, type LibFormulation } from "./types";
import { FORM_BATCH_01 } from "./batch-01";
import { FORM_BATCH_02 } from "./batch-02";
import { FORM_BATCH_03 } from "./batch-03";

export const FORMULATION_LIBRARY_AUTHORED: LibFormulation[] = [...FORM_BATCH_01, ...FORM_BATCH_02, ...FORM_BATCH_03];

export const FORMULATION_LIBRARY = FORMULATION_LIBRARY_AUTHORED.map(buildFormulation);
