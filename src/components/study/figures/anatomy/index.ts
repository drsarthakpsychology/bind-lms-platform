import type { FigureDef } from "../types";
import { brainLateral, brainMedial } from "./brain-surface";
import { brainInferior } from "./brain-base";
import { glia, myelin, neuron, neuronTypes, nmj, synapse } from "./cells";

/** Anatomical figures (brain, neurons, senses, body systems). Add files and spread them in. */
export const ANATOMY: FigureDef[] = [brainLateral, brainMedial, brainInferior, neuron, neuronTypes, myelin, glia, synapse, nmj];
