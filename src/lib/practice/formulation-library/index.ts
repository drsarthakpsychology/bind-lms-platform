/** Formulation library: every authored batch, built into Forge cases. */
import { buildFormulation, type LibFormulation } from "./types";
import { FORM_BATCH_01 } from "./batch-01";
import { FORM_BATCH_02 } from "./batch-02";

export const FORMULATION_LIBRARY_AUTHORED: LibFormulation[] = [...FORM_BATCH_01, ...FORM_BATCH_02];

export const FORMULATION_LIBRARY = FORMULATION_LIBRARY_AUTHORED.map(buildFormulation);
