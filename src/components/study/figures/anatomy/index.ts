import type { FigureDef } from "../types";
import { brainLateral, brainMedial } from "./brain-surface";
import { brainInferior } from "./brain-base";
import { basalGanglia3d, basalGangliaCircuit, coronalSection, hippocampus, homunculus, horizontalSection, ventricles } from "./sections";
import { cerebellum, medullaSection, midbrainSection, ponsSection, ras, reflexArc, spinalCord } from "./brainstem";
import { auditoryPathway, ear, eye, olfaction, taste, visualPathway } from "./senses";
import { amygdalaFear, cholinergicProjections, dopaminePathways, hypothalamus, limbicSystem, noradrenalineProjections, serotoninProjections, sleepCentres } from "./chem";
import { glia, myelin, neuron, neuronTypes, nmj, synapse } from "./cells";

/** Anatomical figures (brain, neurons, senses, body systems). Add files and spread them in. */
export const ANATOMY: FigureDef[] = [brainLateral, brainMedial, brainInferior, neuron, neuronTypes, myelin, glia, synapse, nmj, coronalSection, horizontalSection, basalGanglia3d, basalGangliaCircuit, homunculus, ventricles, hippocampus, midbrainSection, ponsSection, medullaSection, cerebellum, spinalCord, reflexArc, ras, eye, visualPathway, ear, auditoryPathway, olfaction, taste, dopaminePathways, serotoninProjections, noradrenalineProjections, cholinergicProjections, sleepCentres, hypothalamus, limbicSystem, amygdalaFear];
