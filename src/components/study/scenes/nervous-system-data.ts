import { sampleCurve, type Leg, type V3 } from "./kit";

/**
 * The body, nerves and organs for the nervous system scene, in one set of
 * 3D coordinates (y up, x across, z towards the viewer). The 3D view and the
 * flat drawing both use these points.
 */

export const BODY = {
  head: { c: [0, 1.62, 0] as V3, r: [0.27, 0.32, 0.29] as V3 },
  brain: { c: [0, 1.7, -0.02] as V3, r: [0.21, 0.17, 0.23] as V3 },
  eyes: [[-0.1, 1.6, 0.25], [0.1, 1.6, 0.25]] as V3[],
  heart: [0.09, 0.74, 0.13] as V3,
  lungs: [[-0.21, 0.84, 0.02], [0.23, 0.84, 0.02]] as V3[],
  stomach: [0.13, 0.48, 0.11] as V3,
  bladder: [0, -0.08, 0.12] as V3,
  adrenal: [0.16, 0.42, -0.1] as V3,
};

/** Limbs as [start, joint, end] for capsules. Index 0 is the body's right side (viewer's left). */
export const LIMBS: { id: string; pts: V3[]; r: number }[] = [
  { id: "arm-r", pts: [[-0.5, 1.07, 0], [-0.66, 0.48, 0.03], [-0.76, -0.04, 0.1]], r: 0.085 },
  { id: "arm-l", pts: [[0.5, 1.07, 0], [0.66, 0.48, 0.03], [0.76, -0.04, 0.1]], r: 0.085 },
  { id: "leg-r", pts: [[-0.2, -0.08, 0], [-0.23, -0.95, 0.03], [-0.25, -1.8, 0]], r: 0.12 },
  { id: "leg-l", pts: [[0.2, -0.08, 0], [0.23, -0.95, 0.03], [0.25, -1.8, 0]], r: 0.12 },
];

export const PARTS = {
  hand: [-0.8, -0.2, 0.13] as V3,
  foot: [0.27, -1.9, 0.14] as V3,
  knee: [-0.23, -0.95, 0.13] as V3,
  eye: BODY.eyes[0],
};

const CORD_C: V3 = [0, 0.98, -0.17];
const CORD_L: V3 = [0, 0.12, -0.16];
const BRAINSTEM: V3 = [0, 1.47, -0.08];
const THAL: V3 = [0, 1.66, -0.02];
const SENS: V3 = [0.03, 1.85, -0.05];
const MOTOR: V3 = [0.02, 1.86, 0.04];
const OCC: V3 = [0, 1.7, -0.22];

const raw: Record<string, V3[]> = {
  // spinal cord and brain (drawn, not travelled)
  cord: [BRAINSTEM, [0, 1.25, -0.13], [0, 0.85, -0.18], [0, 0.4, -0.18], [0, 0.02, -0.15]],
  // somatic routes
  "hand-in": [PARTS.hand, [-0.76, -0.04, 0.08], [-0.66, 0.48, 0.0], [-0.48, 1.0, -0.04], [-0.2, 1.0, -0.14], CORD_C],
  "hand-out": [CORD_C, [-0.22, 0.96, -0.12], [-0.5, 0.96, -0.02], [-0.68, 0.46, 0.05], [-0.78, -0.06, 0.12], PARTS.hand],
  "up-c": [CORD_C, [0, 1.25, -0.13], BRAINSTEM, THAL, SENS],
  decide: [SENS, [0.06, 1.9, 0], MOTOR],
  "down-c": [MOTOR, [0.01, 1.7, 0], BRAINSTEM, [0, 1.25, -0.13], CORD_C],
  "inter-c": [CORD_C, [0.05, 0.96, -0.2], [0.02, 0.94, -0.15], CORD_C],
  "foot-in": [PARTS.foot, [0.25, -1.8, 0.02], [0.23, -0.95, 0.0], [0.2, -0.1, -0.06], [0.08, 0.05, -0.14], CORD_L],
  "foot-out": [CORD_L, [0.1, 0.02, -0.12], [0.22, -0.12, -0.02], [0.24, -0.95, 0.05], [0.26, -1.8, 0.05], PARTS.foot],
  "up-l": [CORD_L, [0, 0.4, -0.18], [0, 0.85, -0.18], [0, 1.25, -0.13], BRAINSTEM, THAL, SENS],
  "down-l": [MOTOR, [0.01, 1.7, 0], BRAINSTEM, [0, 1.25, -0.13], [0, 0.85, -0.18], [0, 0.4, -0.18], CORD_L],
  "inter-l": [CORD_L, [0.05, 0.1, -0.19], [0.02, 0.08, -0.14], CORD_L],
  "knee-in": [PARTS.knee, [-0.24, -0.55, 0.04], [-0.21, -0.1, -0.06], [-0.08, 0.05, -0.14], CORD_L],
  "knee-out": [CORD_L, [-0.1, 0.02, -0.12], [-0.22, -0.2, 0.02], [-0.23, -0.5, 0.12]],
  "eye-in": [PARTS.eye, [-0.07, 1.6, 0.1], THAL, OCC],
  "eye-bs": [PARTS.eye, [-0.06, 1.58, 0.1], [-0.02, 1.55, -0.02], BRAINSTEM],
  "eye-back": [BRAINSTEM, [-0.03, 1.52, 0.02], [-0.07, 1.57, 0.12], PARTS.eye],
  "eye-decide": [OCC, [0.02, 1.84, -0.14], MOTOR],
  // sympathetic: out of the chest and lower back part of the cord, through the chain beside it
  "s-eye": [[0.07, 1.0, -0.18], [0.08, 1.3, -0.1], [0.1, 1.52, 0.1], BODY.eyes[1]],
  "s-lungs": [[0.07, 0.95, -0.18], [0.16, 0.9, -0.06], BODY.lungs[1]],
  "s-heart": [[0.07, 0.85, -0.18], [0.1, 0.8, -0.02], BODY.heart],
  "s-gut": [[0.07, 0.55, -0.18], [0.12, 0.5, -0.02], BODY.stomach],
  "s-adrenal": [[0.07, 0.47, -0.18], [0.12, 0.45, -0.14], BODY.adrenal],
  "s-bladder": [[0.07, 0.18, -0.17], [0.08, 0.05, -0.04], BODY.bladder],
  // parasympathetic: from the brainstem (cranial nerves, the vagus) and the bottom of the cord (sacral)
  "p-eye": [BRAINSTEM, [-0.04, 1.54, 0.04], [-0.08, 1.58, 0.14], BODY.eyes[0]],
  "p-lungs": [BRAINSTEM, [-0.05, 1.3, -0.02], [-0.08, 1.05, 0.0], BODY.lungs[0]],
  "p-heart": [BRAINSTEM, [-0.04, 1.3, 0.0], [0.0, 0.95, 0.06], BODY.heart],
  "p-gut": [BRAINSTEM, [-0.05, 1.3, 0.0], [-0.06, 0.9, 0.06], [0.02, 0.6, 0.1], BODY.stomach],
  "p-bladder": [[0, 0.02, -0.15], [-0.05, -0.05, -0.04], BODY.bladder],
};

/** Sampled points for every path. */
export const PATHS: Record<string, V3[]> = Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, sampleCurve(v, 10)]));

export const SYMP = ["s-eye", "s-lungs", "s-heart", "s-gut", "s-adrenal", "s-bladder"];
export const PARA = ["p-eye", "p-lungs", "p-heart", "p-gut", "p-bladder"];
export const SOMATIC = ["hand-in", "hand-out", "foot-in", "foot-out", "knee-in", "knee-out"];
/** The sympathetic chain: beads beside the cord. */
export const CHAIN: V3[] = [1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2].map((y) => [0.07, y, -0.18] as V3);

export type Part = "hand" | "foot" | "knee" | "eye";
export type Route = "brain" | "reflex";

export const PART_NAME: Record<Part, string> = { hand: "Hand: touch a hot cup", foot: "Foot: step on a pin", knee: "Knee: tap below the kneecap", eye: "Eye: a bright light" };

/** The legs of a signal's trip for a body part and a route. */
export function routeLegs(part: Part, route: Route): Leg[] {
  const S = (path: string, ms: number, say: string): Leg => ({ path, ms, say, tone: "sense" });
  const M = (path: string, ms: number, say: string): Leg => ({ path, ms, say, tone: "motor" });
  const I = (path: string, ms: number, say: string): Leg => ({ path, ms, say, tone: "info" });
  if (part === "eye") {
    return route === "brain"
      ? [
          S("eye-in", 1500, "Light hits the retina. The message leaves the eye along the optic nerve, a cranial nerve that goes straight to the brain without using the spinal cord. It passes the thalamus and reaches the visual cortex at the back of the brain: you see the light."),
          I("eye-decide", 1000, "The visual areas pass what you saw forward to the frontal lobe, which decides what to do: look away."),
          M("down-c", 1400, "The motor cortex sends a command down through the brainstem. Nerves from the brainstem turn the eyes and head away from the glare."),
        ]
      : [
          S("eye-bs", 1000, "Light hits the retina. A branch of the message goes to the brainstem, not to the cortex."),
          M("eye-back", 1000, "The brainstem replies at once along a cranial nerve: the pupils shrink to let in less light. This is the pupil light reflex, and it does not need you to think."),
          S("eye-in", 1400, "Meanwhile the main message reaches the visual cortex at the back of the brain, so you notice the light after your pupils have already reacted."),
        ];
  }
  const leg = part === "hand" ? { in: "hand-in", out: "hand-out", up: "up-c", down: "down-c", inter: "inter-c", where: "the neck part of the spinal cord", thing: "the hot cup", act: "The arm muscles pull the hand away." }
    : part === "foot" ? { in: "foot-in", out: "foot-out", up: "up-l", down: "down-l", inter: "inter-l", where: "the lower back part of the spinal cord", thing: "the pin", act: "The leg muscles lift the foot." }
    : { in: "knee-in", out: "knee-out", up: "up-l", down: "down-l", inter: "inter-l", where: "the lower back part of the spinal cord", thing: "the tap", act: "The thigh muscle tightens and the lower leg kicks." };
  if (route === "brain") {
    return [
      S(leg.in, 1400, `Receptors in the skin fire. A sensory nerve carries the message from the ${part} to ${leg.where}.`),
      S(leg.up, 1500, `The message climbs the spinal cord, passes the thalamus and reaches the touch area of the cortex (the top of the parietal lobe). Now you feel ${leg.thing}.`),
      I("decide", 900, "The brain decides what to do and the motor cortex, just in front, prepares a command."),
      M(leg.down, 1500, "The command travels down from the motor cortex, through the brainstem and down the spinal cord."),
      M(leg.out, 1400, `A motor nerve carries it out to the muscle. ${leg.act} The whole trip went through the brain.`),
    ];
  }
  if (part === "knee") {
    return [
      S("knee-in", 900, "The tap stretches the tendon and the thigh muscle. Stretch receptors send a sensory message to the lower back part of the spinal cord."),
      M("knee-out", 900, "In the cord the sensory nerve connects straight onto the motor nerve: one connection, no middle neuron. The thigh muscle tightens and the leg kicks. This knee jerk is the simplest reflex there is."),
      S("up-l", 1400, "A copy of the message also climbs to the brain, so you feel the tap after the leg has already moved."),
    ];
  }
  return [
    S(leg.in, 1100, `Pain receptors fire. A sensory nerve carries the message to ${leg.where}.`),
    I(leg.inter, 600, "Shortcut: inside the cord a small connecting neuron (an interneuron) passes the message straight to a motor nerve. The brain is not asked."),
    M(leg.out, 1100, `${leg.act} This is the withdrawal reflex. It is fast because the trip is short.`),
    S(leg.up, 1500, `Only now does a copy of the message reach the brain, and you feel the pain of ${leg.thing}. The ${part} moved before you knew it hurt.`),
  ];
}

export type Auto = "everyday" | "fight" | "rest";
export const AUTO: Record<Auto, { name: string; bpm: number; breaths: number; pupil: number; airway: number; gut: number; bladder: number; adrenaline: boolean; say: string; organs: [string, string][] }> = {
  everyday: {
    name: "Everyday balance",
    bpm: 72, breaths: 14, pupil: 0.5, airway: 1, gut: 0.5, bladder: 0.5, adrenaline: false,
    say: "Both divisions are working a little at the same time, like two hands on a steering wheel. The body is balanced: neither racing nor resting.",
    organs: [["Heart", "about 72 beats a minute"], ["Pupils", "medium"], ["Airways", "normal"], ["Gut", "digesting steadily"], ["Bladder", "filling, outlet closed"]],
  },
  fight: {
    name: "Fight or flight",
    bpm: 128, breaths: 24, pupil: 0.95, airway: 1.25, gut: 0, bladder: 0.2, adrenaline: true,
    say: "The sympathetic division takes over. Its nerves leave the chest and lower back part of the spinal cord and run through a chain of relay stations beside it. It readies the body for action, and the adrenal glands pour adrenaline into the blood, which keeps the effects going.",
    organs: [["Heart", "about 128 beats a minute, beating harder"], ["Pupils", "wide open, to let in more light"], ["Airways", "widened, breathing fast and deep"], ["Gut", "digestion slowed almost to a stop, mouth dry"], ["Bladder", "wall relaxed and outlet tightened, so urine is held"], ["Adrenal glands", "releasing adrenaline into the blood"]],
  },
  rest: {
    name: "Rest and digest",
    bpm: 60, breaths: 10, pupil: 0.25, airway: 0.85, gut: 1, bladder: 0.9, adrenaline: false,
    say: "The parasympathetic division takes over. Its nerves leave the brainstem (mostly in the vagus nerve) and the bottom of the spinal cord. It slows and restores the body and saves energy.",
    organs: [["Heart", "about 60 beats a minute, slowed by the vagus nerve"], ["Pupils", "small"], ["Airways", "slightly narrowed, breathing slow"], ["Gut", "digesting actively, more saliva"], ["Bladder", "wall squeezes and outlet relaxes, ready to empty"]],
  },
};

export type Level = "all" | "cns" | "pns" | "somatic" | "autonomic" | "sympathetic" | "parasympathetic";
export const LEVELS: { id: Level; name: string; parent?: Level; say: string }[] = [
  { id: "all", name: "Whole nervous system", say: "The whole nervous system: about 86 billion neurons in the brain, the spinal cord, and nerves reaching every part of the body. Pick a part to zoom in." },
  { id: "cns", name: "Central (CNS)", parent: "all", say: "The central nervous system is the brain and the spinal cord, protected by the skull and the backbone. It takes in messages, makes decisions and sends out commands." },
  { id: "pns", name: "Peripheral (PNS)", parent: "all", say: "The peripheral nervous system is every nerve outside the brain and spinal cord: 12 pairs of cranial nerves and 31 pairs of spinal nerves. It carries messages in and out. It has two parts: somatic and autonomic." },
  { id: "somatic", name: "Somatic", parent: "pns", say: "The somatic system carries messages from the skin, muscles and joints, and sends commands to the skeletal muscles. These are the movements you can control on purpose." },
  { id: "autonomic", name: "Autonomic", parent: "pns", say: "The autonomic system runs the heart, lungs, gut, glands, bladder and blood vessels without you having to think. The hypothalamus is its main controller. It has two divisions that mostly work against each other: sympathetic and parasympathetic." },
  { id: "sympathetic", name: "Sympathetic", parent: "autonomic", say: "The sympathetic division leaves the chest and lower back part of the spinal cord and relays in a chain beside it. It prepares for action: fight or flight." },
  { id: "parasympathetic", name: "Parasympathetic", parent: "autonomic", say: "The parasympathetic division leaves the brainstem (the vagus nerve carries most of it) and the bottom of the spinal cord. It restores the body: rest and digest." },
];

/** Camera position and target for each zoom level. */
export const LEVEL_VIEW: Record<Level, { pos: V3; target: V3 }> = {
  all: { pos: [0, 0, 6.9], target: [0, -0.02, 0] },
  cns: { pos: [1.2, 1.3, 3.0], target: [0, 1.0, -0.1] },
  pns: { pos: [0, 0.0, 5.6], target: [0, -0.1, 0] },
  somatic: { pos: [-1.2, -0.2, 4.6], target: [-0.3, -0.3, 0] },
  autonomic: { pos: [1.4, 0.9, 2.6], target: [0, 0.7, 0] },
  sympathetic: { pos: [2.2, 0.8, 1.4], target: [0, 0.6, -0.05] },
  parasympathetic: { pos: [-1.8, 1.0, 2.2], target: [0, 0.9, 0] },
};

/** What lights up at each zoom level. */
export function levelShows(l: Level) {
  return {
    brain: l === "all" || l === "cns",
    cord: l === "all" || l === "cns",
    somatic: l === "all" || l === "pns" || l === "somatic",
    symp: l === "all" || l === "pns" || l === "autonomic" || l === "sympathetic",
    para: l === "all" || l === "pns" || l === "autonomic" || l === "parasympathetic",
    organs: l === "autonomic" || l === "sympathetic" || l === "parasympathetic",
  };
}
