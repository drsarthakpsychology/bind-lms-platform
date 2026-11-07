/** Formulation library: every authored batch, built into Forge cases. */
import { buildFormulation, type LibFormulation } from "./types";

export const FORMULATION_LIBRARY_AUTHORED: LibFormulation[] = [];

export const FORMULATION_LIBRARY = FORMULATION_LIBRARY_AUTHORED.map(buildFormulation);
