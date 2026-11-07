/** OSCE library: every authored batch, built into stations. */
import { buildStation, type LibStation } from "./types";

export const OSCE_LIBRARY_AUTHORED: LibStation[] = [];

export const OSCE_LIBRARY = OSCE_LIBRARY_AUTHORED.map(buildStation);
