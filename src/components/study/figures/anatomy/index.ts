import type { FigureDef } from "../types";
import { brainLateral, brainMedial } from "./brain-surface";
import { brainInferior } from "./brain-base";
import { basalGanglia3d, basalGangliaCircuit, coronalSection, hippocampus, homunculus, horizontalSection, ventricles } from "./sections";
import { cerebellum, medullaSection, midbrainSection, ponsSection, ras, reflexArc, spinalCord } from "./brainstem";
import { auditoryPathway, ear, eye, olfaction, taste, visualPathway } from "./senses";
import { amygdalaFear, cholinergicProjections, dopaminePathways, hypothalamus, limbicSystem, noradrenalineProjections, serotoninProjections, sleepCentres } from "./chem";
import { arterialTerritories, brodmann, circleOfWillis, languageAreas, prefrontal } from "./cortex";
import { autonomic, endocrine, gutBrain, hpaAxis, pituitary } from "./body";
import { brainVesicles, ectPlacements, eeg1020, tms } from "./head";
import { glia, myelin, neuron, neuronTypes, nmj, synapse } from "./cells";

/** Anatomical figures (brain, neurons, senses, body systems). Add files and spread them in. */
export const ANATOMY: FigureDef[] = [brainLateral, brainMedial, brainInferior, neuron, neuronTypes, myelin, glia, synapse, nmj, coronalSection, horizontalSection, basalGanglia3d, basalGangliaCircuit, homunculus, ventricles, hippocampus, midbrainSection, ponsSection, medullaSection, cerebellum, spinalCord, reflexArc, ras, eye, visualPathway, ear, auditoryPathway, olfaction, taste, dopaminePathways, serotoninProjections, noradrenalineProjections, cholinergicProjections, sleepCentres, hypothalamus, limbicSystem, amygdalaFear, brodmann, languageAreas, prefrontal, arterialTerritories, circleOfWillis, autonomic, hpaAxis, endocrine, pituitary, gutBrain, eeg1020, tms, ectPlacements, brainVesicles];
