import { sampleCurve, type Leg, type V3 } from "./kit";

/**
 * The brain explorer's regions, what each does (as a signal trip), what
 * happens when it is damaged, and the coordinates both the 3D and the flat
 * views use. Brain coordinates: a = towards the front, y = up, z = out to
 * the left side (the side the student looks at). 3D x is -a, so the front
 * of the brain points to the left of the screen, as in a textbook side view.
 */

export type RegionId =
  | "frontal" | "motor" | "parietal" | "occipital" | "temporal" | "broca" | "wernicke"
  | "cerebellum" | "brainstem" | "thalamus" | "hypothalamus" | "amygdala" | "hippocampus" | "basal-ganglia" | "corpus-callosum";

export const CORTEX: RegionId[] = ["frontal", "motor", "parietal", "occipital", "temporal", "broca", "wernicke"];
export const DEEP: RegionId[] = ["thalamus", "hypothalamus", "amygdala", "hippocampus", "basal-ganglia", "corpus-callosum"];
export const ALWAYS: RegionId[] = ["cerebellum", "brainstem"];

/** Hemisphere half sizes (a, y up, y down, z). */
export const HEMI = { a: 1.55, up: 1.02, down: 0.78, z: 0.64, gap: 0.035 };

const sylvianY = (a: number) => -0.05 + (0.55 - a) * 0.286;
const centralA = (y: number) => 0.3 - (y - 0.05) * 0.37;
const occA = (y: number) => -1.05 + 0.1 * y;

/** Which cortical region a point on the left hemisphere belongs to (w = how far out to the side, 0 to 1). */
export function regionAt(a: number, y: number, w: number, left: boolean): RegionId {
  if (a < occA(y)) return "occipital";
  if (y < sylvianY(a) && a < 0.95) {
    if (left && w > 0.35 && a > -0.78 && a < -0.18 && y > sylvianY(a) - 0.32) return "wernicke";
    return "temporal";
  }
  const c = centralA(y);
  if (a > c) {
    if (left && w > 0.35 && a > 0.42 && a < 0.95 && y < sylvianY(a) + 0.32) return "broca";
    if (a - c < 0.2) return "motor";
    return "frontal";
  }
  return "parietal";
}

export const REGION_COLOR: Record<RegionId, string> = {
  frontal: "#f4b6a6", motor: "#f2d27a", parietal: "#a9d3a0", occipital: "#a7c4ec", temporal: "#cdb4e8", broca: "#ee8f7c", wernicke: "#9a85d6",
  cerebellum: "#e8c39a", brainstem: "#c9b8a6", thalamus: "#7fc7c0", hypothalamus: "#f0a35e", amygdala: "#e2687a", hippocampus: "#6fa3d9", "basal-ganglia": "#9cc46b", "corpus-callosum": "#efe6d2",
};

/* ---------------------------------------------------------- the deep parts */

/** Deep structures as ellipsoids [centre, radii] in brain coordinates (left side, mirrored for the right). */
export const BLOBS: Partial<Record<RegionId, { c: V3; r: V3; mirror: boolean }[]>> = {
  thalamus: [{ c: [-0.05, 0.15, 0.14], r: [0.22, 0.13, 0.11], mirror: true }],
  hypothalamus: [{ c: [0.22, -0.12, 0.05], r: [0.12, 0.09, 0.07], mirror: true }],
  amygdala: [{ c: [0.45, -0.36, 0.42], r: [0.1, 0.08, 0.08], mirror: true }],
  "basal-ganglia": [{ c: [0.2, 0.15, 0.38], r: [0.3, 0.18, 0.08], mirror: true }],
};
/** Deep structures as tubes [points, radius]. */
export const TUBES: Partial<Record<RegionId, { pts: V3[]; r: number; mirror: boolean }[]>> = {
  hippocampus: [{ pts: [[0.36, -0.36, 0.44], [0.05, -0.36, 0.46], [-0.35, -0.24, 0.42], [-0.58, 0.02, 0.3], [-0.5, 0.3, 0.16]], r: 0.06, mirror: true }],
  "basal-ganglia": [{ pts: [[0.58, 0.32, 0.22], [0.25, 0.55, 0.24], [-0.25, 0.5, 0.25], [-0.6, 0.18, 0.32], [-0.45, -0.15, 0.4]], r: 0.065, mirror: true }],
  "corpus-callosum": [{ pts: [[0.72, 0.3, 0], [0.4, 0.6, 0], [-0.2, 0.64, 0], [-0.72, 0.4, 0], [-0.6, 0.25, 0]], r: 0.07, mirror: false }],
  brainstem: [{ pts: [[-0.05, -0.2, 0], [-0.05, -0.6, 0], [-0.1, -1.0, 0], [-0.14, -1.45, 0]], r: 0.15, mirror: false }],
};
export const PONS: V3 = [-0.02, -0.66, 0];
export const PITUITARY: V3 = [0.28, -0.42, 0];
export const NIGRA: V3 = [-0.05, -0.32, 0.1];
export const CEREBELLUM = { c: [-0.98, -0.72, 0] as V3, r: [0.45, 0.32, 0.7] as V3 };
export const EYES: V3[] = [[1.78, -0.08, 0.38], [1.78, -0.08, -0.38]];
export const EAR: V3 = [-0.05, -0.32, 1.05];

/** Convert brain coordinates to 3D scene coordinates. */
export const to3 = (p: V3): V3 => [-p[0], p[1], p[2]];

/* ------------------------------------------------------- signal trips */

const raw: Record<string, V3[]> = {
  "eye-v1": [EYES[0], [1.2, -0.15, 0.3], [0.45, -0.3, 0.05], [-0.2, 0.02, 0.26], [-0.8, 0.12, 0.42], [-1.42, 0.14, 0.42]],
  "eye-thal": [EYES[0], [1.2, -0.15, 0.3], [0.45, -0.3, 0.05], [-0.05, 0.1, 0.16]],
  "thal-v1": [[-0.05, 0.1, 0.16], [-0.6, 0.12, 0.38], [-1.42, 0.14, 0.42]],
  "ear-aud": [EAR, [-0.05, -0.5, 0.5], [-0.05, -0.5, 0.12], [-0.1, 0.02, 0.2], [0.0, -0.02, 0.58]],
  "aud-wer": [[0.0, -0.02, 0.58], [-0.25, 0.0, 0.62], [-0.5, 0.04, 0.6]],
  arcuate: [[-0.5, 0.04, 0.6], [-0.45, 0.38, 0.56], [0.2, 0.42, 0.6], [0.66, 0.1, 0.58]],
  "bro-mouth": [[0.66, 0.1, 0.58], [0.45, 0.2, 0.62], [0.3, 0.12, 0.64]],
  "motor-down": [[0.08, 0.86, 0.36], [0.02, 0.4, 0.32], [0.0, 0.0, 0.2], [-0.05, -0.6, 0.08], [-0.14, -1.45, 0.02]],
  "cord-thal": [[-0.14, -1.45, 0.02], [-0.05, -0.6, 0.08], [-0.15, 0.12, 0.2]],
  "thal-s1": [[-0.15, 0.12, 0.2], [-0.2, 0.45, 0.4], [-0.24, 0.8, 0.42]],
  "s1-space": [[-0.24, 0.8, 0.42], [-0.55, 0.7, 0.5], [-0.85, 0.45, 0.5]],
  "back-front": [[-1.3, 0.3, 0.45], [-0.7, 0.75, 0.48], [0.2, 0.75, 0.5], [1.05, 0.45, 0.45]],
  "front-amy": [[1.05, 0.45, 0.45], [0.95, 0.0, 0.35], [0.45, -0.36, 0.42]],
  "thal-amy": [[-0.05, 0.1, 0.16], [0.2, -0.2, 0.35], [0.45, -0.36, 0.42]],
  "amy-hyp": [[0.45, -0.36, 0.42], [0.3, -0.25, 0.2], [0.22, -0.12, 0.05]],
  "hyp-body": [[0.22, -0.12, 0.05], [0.0, -0.5, 0.06], [-0.1, -1.0, 0.04], [-0.14, -1.45, 0.02]],
  "hyp-pit": [[0.22, -0.12, 0.05], [0.26, -0.3, 0.02], PITUITARY],
  "pit-blood": [PITUITARY, [0.3, -0.8, 0.1], [0.3, -1.4, 0.2]],
  "cx-hip": [[-0.7, 0.55, 0.55], [-0.4, 0.1, 0.5], [0.0, -0.34, 0.46]],
  "hip-cx": [[0.0, -0.34, 0.46], [-0.3, 0.3, 0.55], [-0.1, 0.75, 0.5], [0.6, 0.6, 0.5]],
  "m1-bg": [[0.08, 0.86, 0.36], [0.15, 0.45, 0.38], [0.2, 0.15, 0.38]],
  "bg-thal": [[0.2, 0.15, 0.38], [0.05, 0.12, 0.25], [-0.05, 0.15, 0.14]],
  "thal-m1": [[-0.05, 0.15, 0.14], [0.02, 0.5, 0.3], [0.08, 0.86, 0.36]],
  "sn-bg": [NIGRA, [0.05, -0.1, 0.25], [0.2, 0.15, 0.38]],
  "m1-pons": [[0.08, 0.86, 0.36], [0.02, 0.3, 0.25], PONS],
  "pons-cb": [PONS, [-0.5, -0.66, 0.2], [-0.95, -0.7, 0.35]],
  "cb-thal": [[-0.95, -0.7, 0.35], [-0.5, -0.3, 0.2], [-0.05, 0.15, 0.14]],
  "med-cord": [[-0.1, -0.95, 0.05], [-0.12, -1.2, 0.03], [-0.14, -1.5, 0.02]],
  "bs-wake": [[-0.08, -0.8, 0.05], [-0.05, -0.2, 0.08], [-0.05, 0.15, 0.14], [0.0, 0.7, 0.45], [0.7, 0.75, 0.45]],
  "cc-cross": [[-0.2, 0.55, 0.5], [-0.2, 0.66, 0.1], [-0.2, 0.66, -0.1], [-0.2, 0.55, -0.5]],
};
export const BPATHS: Record<string, V3[]> = Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, sampleCurve(v.map(to3), 10)]));
/** The same paths in brain coordinates, for the flat side view. */
export const BPATHS_FLAT: Record<string, V3[]> = Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, sampleCurve(v, 10)]));

const L = (path: string, ms: number, say: string, tone: Leg["tone"] = "info"): Leg => ({ path, ms, say, tone });

export type RegionInfo = {
  id: RegionId;
  name: string;
  short: string;
  does: string;
  act: Leg[];
  hurtAct: Leg[];
  damage: string;
  example: string;
  /** The words that come out, for the language areas. */
  bubble?: { ok: string; hurt: string };
  /** A symptom for the "Where is the damage?" challenge. */
  clue: string;
};

export const REGIONS: RegionInfo[] = [
  {
    id: "frontal", name: "Frontal lobe (prefrontal cortex)", short: "Frontal", clue: "After an accident, a careful, reliable man becomes impulsive and rude, makes plans he never carries out, and cannot hold back what he wants to say.",
    does: "Plans, decides, keeps a goal in mind and holds back impulses. It is the last part of the brain to finish maturing, in the mid twenties.",
    act: [L("back-front", 1500, "Information from the senses at the back of the brain flows forward to the prefrontal cortex, which weighs it up against your goals.", "sense"), L("front-amy", 1300, "It sends a brake signal down to the amygdala: the impulse is noticed but held back. You choose instead of react.", "motor")],
    hurtAct: [L("back-front", 1500, "Information still reaches the front of the brain.", "sense"), L("front-amy", 1300, "But the damaged prefrontal cortex cannot send its brake. The impulse goes straight through to action.", "motor")],
    damage: "Damage changes personality and judgement more than intelligence: impulsiveness, poor planning, rudeness, apathy or poor decisions.",
    example: "Phineas Gage, a railway foreman, survived an iron rod blasting through his left frontal lobe in 1848. His memory and speech were fine, but friends said he was \"no longer Gage\": impulsive, crude and unable to stick to a plan.",
  },
  {
    id: "motor", name: "Motor cortex", short: "Motor", clue: "She wakes unable to lift her right arm, and the right side of her face droops.",
    does: "A strip just in front of the central groove that sends commands to move the muscles on the opposite side of the body. The face is near the bottom of the strip, the legs at the top.",
    act: [L("motor-down", 1700, "A command leaves the motor cortex, crosses to the other side low in the brainstem, and runs down the spinal cord to the right hand. The fingers move.", "motor")],
    hurtAct: [L("motor-down", 1700, "The damaged motor strip sends a weak or no command. The muscles on the opposite side cannot be moved on purpose.", "motor")],
    damage: "Damage causes weakness or paralysis of the opposite side of the body (hemiparesis).",
    example: "A common stroke picture: a blocked artery on the left side of the brain leaves the right arm and leg weak and the right side of the face drooping.",
  },
  {
    id: "parietal", name: "Parietal lobe", short: "Parietal", clue: "A man eats only the food on the right side of his plate and shaves only the right side of his face. He does not seem to know the left side is there.",
    does: "Receives touch, pain, temperature and body position in a strip just behind the central groove, and builds a map of where things are in space.",
    act: [L("cord-thal", 1300, "A touch on the right hand travels up the spinal cord and brainstem to the thalamus.", "sense"), L("thal-s1", 900, "The thalamus relays it to the touch strip of the parietal lobe: you feel it, and know where on the body it was.", "sense"), L("s1-space", 1000, "The back of the parietal lobe adds where the hand is in space, so you can reach for things without looking.", "info")],
    hurtAct: [L("cord-thal", 1300, "The touch travels up to the thalamus as usual.", "sense"), L("thal-s1", 900, "It reaches the damaged parietal lobe, which cannot build a map of that side of the world.", "sense")],
    damage: "Damage on the left can cause problems with reading, writing, maths and telling left from right. Damage on the right parietal lobe (the mirror of this one) often causes neglect of the left side of space.",
    example: "After a right parietal stroke, a patient eats only from the right half of her plate, and when asked to draw a clock she crowds all twelve numbers into its right half.",
  },
  {
    id: "occipital", name: "Occipital lobe (visual cortex)", short: "Occipital", clue: "After a stroke, a woman bumps into things on her right. Each eye on its own misses the right half of the world.",
    does: "Turns signals from the eyes into sight: edges, colour, movement and shapes. It sits at the very back of the brain, far from the eyes.",
    act: [L("eye-v1", 1900, "Light hits the eyes. The message runs along the optic nerves, partly crosses over, relays in the thalamus and fans out to the visual cortex at the back. The back of the brain lights up: you see.", "sense")],
    hurtAct: [L("eye-v1", 1900, "The eyes work and send the message, but it arrives at a damaged visual cortex. Nothing is seen in that part of the visual field.", "sense")],
    damage: "Each occipital lobe sees the opposite half of the world. Damage on one side takes away the opposite half of vision in both eyes (hemianopia); damage on both sides causes cortical blindness, even though the eyes are healthy.",
    example: "A stroke in the left occipital lobe leaves a patient unable to see anything to the right of where she looks, with either eye. She learns to turn her head to scan.",
  },
  {
    id: "temporal", name: "Temporal lobe", short: "Temporal", clue: "A man can no longer recognise his wife's face, though he knows her at once by her voice.",
    does: "Hears (the hearing area sits on its upper edge), recognises faces, objects and words, and, deep inside, holds the hippocampus and amygdala for memory and emotion.",
    act: [L("ear-aud", 1700, "Sound reaches the ear. The message travels through the brainstem and thalamus to the hearing area on the upper edge of the temporal lobe. You hear it, and the temporal lobe recognises what it is.", "sense")],
    hurtAct: [L("ear-aud", 1700, "Sound still arrives, but the damaged temporal lobe cannot work out what the sound or sight means.", "sense")],
    damage: "Damage can affect hearing words, recognising things, memory and emotion. Damage underneath, usually on the right, can cause face blindness (prosopagnosia).",
    example: "After damage to the underside of the right temporal lobe, a man cannot recognise his own family by their faces and waits for them to speak.",
  },
  {
    id: "broca", name: "Broca's area", short: "Broca", clue: "She understands what you say, but speaks slowly and with great effort: \"Walk... dog... park.\"",
    does: "In the left frontal lobe, just in front of the mouth part of the motor strip. It plans the movements and grammar of speech.",
    act: [L("ear-aud", 1200, "You hear a question. It reaches the hearing area.", "sense"), L("aud-wer", 800, "Wernicke's area works out what the words mean.", "info"), L("arcuate", 1100, "A bundle of fibres (the arcuate fasciculus) carries the reply idea forward to Broca's area.", "info"), L("bro-mouth", 900, "Broca's area plans the sounds and grammar and the motor strip moves the lips and tongue. You answer.", "motor")],
    hurtAct: [L("ear-aud", 1200, "You hear the question.", "sense"), L("aud-wer", 800, "Wernicke's area understands it fine.", "info"), L("arcuate", 1100, "The reply idea reaches a damaged Broca's area.", "info"), L("bro-mouth", 900, "Speech comes out slow, effortful and broken, with the small grammar words missing.", "motor")],
    bubble: { ok: "I walked the dog in the park.", hurt: "Walk... dog... park." },
    damage: "Broca's aphasia: speech is slow, effortful and telegraphic, but understanding is fairly good. People know what they want to say and are often frustrated.",
    example: "In 1861 Paul Broca examined a patient nicknamed Tan, who understood speech but could say only the word \"tan\". After he died, Broca found damage in the left frontal lobe, the area now named after him.",
  },
  {
    id: "wernicke", name: "Wernicke's area", short: "Wernicke", clue: "He talks fluently and fast, but the words make little sense, and he does not understand your questions.",
    does: "In the left temporal lobe, behind the hearing area. It links the sounds of words to their meanings, for understanding and for choosing words.",
    act: [L("ear-aud", 1200, "You hear a question. It reaches the hearing area.", "sense"), L("aud-wer", 800, "Wernicke's area turns the sounds into meaning: you understand.", "info"), L("arcuate", 1100, "Your reply idea travels forward along the arcuate fasciculus.", "info"), L("bro-mouth", 900, "Broca's area plans it and the mouth says it.", "motor")],
    hurtAct: [L("ear-aud", 1200, "You hear the question.", "sense"), L("aud-wer", 800, "The damaged Wernicke's area cannot attach meaning to the words.", "info"), L("arcuate", 1100, "A reply still flows forward, but the words were chosen without meaning.", "info"), L("bro-mouth", 900, "Speech comes out fluent and well paced, but empty or full of wrong and made up words.", "motor")],
    bubble: { ok: "I walked the dog in the park.", hurt: "I flimmed the doggle on the sky, you know, the window thing." },
    damage: "Wernicke's aphasia: fluent, easy speech that makes little sense, with wrong or invented words, and poor understanding. People are often unaware of the problem.",
    example: "Carl Wernicke described in 1874 patients who spoke freely but whose speech was meaningless and who could not follow what was said to them, with damage at the back of the left temporal lobe.",
  },
  {
    id: "cerebellum", name: "Cerebellum", short: "Cerebellum", clue: "He walks with his feet wide apart and staggers, his hand shakes more as it gets near the target, and his speech is slurred.",
    does: "The little brain at the back. It compares the movement you meant with the movement you made, and corrects it: balance, smooth timing and learning skills like cycling.",
    act: [L("m1-pons", 1100, "The motor cortex sends a copy of its command down to the pons.", "motor"), L("pons-cb", 900, "The pons passes it to the cerebellum, which also hears from the muscles and the balance organs.", "info"), L("cb-thal", 1000, "The cerebellum sends a correction back through the thalamus to the motor cortex. The movement becomes smooth and on target.", "info")],
    hurtAct: [L("m1-pons", 1100, "The copy of the command arrives.", "motor"), L("pons-cb", 900, "But the damaged cerebellum cannot compare and correct.", "info")],
    damage: "Damage causes clumsy, shaky, poorly timed movement on the same side of the body (ataxia), an unsteady wide walk and slurred speech. Strength is normal.",
    example: "Years of heavy drinking can shrink the front of the cerebellum, leaving a wide, staggering walk. Alcohol affects the cerebellum quickly too, which is why the police ask a drunk driver to walk a straight line.",
  },
  {
    id: "brainstem", name: "Brainstem", short: "Brainstem", clue: "After a stroke she is fully awake and aware, can hear and think, but cannot move or speak. She can only blink and move her eyes up and down.",
    does: "Midbrain, pons and medulla. It keeps you alive: breathing, heart rate, blood pressure, swallowing, and sleep and waking. Every message between brain and body passes through it.",
    act: [L("med-cord", 900, "The medulla sends a breathing rhythm down to the breathing muscles: breathe in.", "motor"), L("med-cord", 900, "And again, about 12 to 16 times a minute, without you thinking about it.", "motor"), L("bs-wake", 1500, "A network running up through the brainstem (the reticular formation) keeps the cortex awake and alert.", "info")],
    hurtAct: [L("motor-down", 1700, "Commands from the motor cortex reach the damaged pons and stop there. Nothing gets through to the body.", "motor"), L("bs-wake", 1500, "But the waking network above the damage still works: the person is fully conscious.", "info")],
    damage: "Damage can be fatal, or cause coma, problems with breathing and swallowing, or locked-in syndrome after a stroke in the pons.",
    example: "Locked-in syndrome: after a stroke in his pons, a French magazine editor could move only his left eyelid. He wrote a whole memoir by blinking as an assistant read out the alphabet, letter by letter.",
  },
  {
    id: "thalamus", name: "Thalamus", short: "Thalamus", clue: "After years of heavy drinking and poor diet, a man cannot remember what happened an hour ago and fills the gaps with confident invented stories.",
    does: "The relay station in the middle of the brain. Every sense except smell stops here before going on to the cortex. It also helps control sleep, waking and attention.",
    act: [L("eye-thal", 1100, "A message from the eyes arrives at the thalamus.", "sense"), L("thal-v1", 900, "It is relayed to the visual cortex at the back.", "sense"), L("cord-thal", 1100, "A touch message arrives from the body.", "sense"), L("thal-s1", 800, "It is relayed up to the touch strip. The thalamus is a sorting office, not the final stop.", "sense")],
    hurtAct: [L("cord-thal", 1100, "A touch message arrives at the damaged thalamus and is not passed on properly.", "sense")],
    damage: "A small thalamic stroke causes numbness of the opposite side of the body, sometimes followed by severe burning pain. Damage to the middle of the thalamus and nearby causes severe memory problems.",
    example: "Korsakoff syndrome: in long-term heavy drinking with a lack of thiamine (vitamin B1), damage to the middle of the thalamus and the mammillary bodies leaves severe loss of new memory, filled with invented stories (confabulation).",
  },
  {
    id: "hypothalamus", name: "Hypothalamus", short: "Hypothalamus", clue: "After surgery for a tumour near the base of the brain, a child is hungry all the time, gains weight fast and cannot keep a steady body temperature.",
    does: "Smaller than a grape, below the thalamus. It is the body's thermostat and control panel: hunger, thirst, temperature, sleep timing, sexual behaviour, and it drives the pituitary gland and the stress response.",
    act: [L("hyp-pit", 1000, "The hypothalamus senses that the body needs something (for example, you are stressed) and sends a hormone signal to the pituitary gland just below it.", "info"), L("pit-blood", 1300, "The pituitary releases its own hormones into the blood, which travel to glands around the body, such as the adrenal glands (cortisol).", "motor")],
    hurtAct: [L("hyp-pit", 1000, "The damaged hypothalamus sends the wrong signals, or none.", "info")],
    damage: "Damage disturbs hunger, thirst, temperature, sleep and hormones.",
    example: "Children treated for a tumour near the hypothalamus (craniopharyngioma) can develop extreme hunger and rapid weight gain, because the signal that says \"you are full\" is lost.",
  },
  {
    id: "amygdala", name: "Amygdala", short: "Amygdala", clue: "A woman with a rare disease that destroyed both of these almond-shaped parts handles snakes and spiders happily and walks into danger. She does not feel fear.",
    does: "An almond-shaped cluster deep in the temporal lobe. It spots threat and danger in a split second, learns what to fear, and makes emotional events memorable.",
    act: [L("eye-thal", 900, "You glimpse something that looks like a snake. The eyes send the message to the thalamus.", "sense"), L("thal-amy", 600, "The thalamus sends a fast, rough copy straight to the amygdala, before the cortex has even worked out what it is.", "sense"), L("amy-hyp", 600, "The amygdala sounds the alarm to the hypothalamus.", "info"), L("hyp-body", 1000, "The hypothalamus fires the body's fight or flight response: you jump back, heart pounding.", "motor")],
    hurtAct: [L("eye-thal", 900, "You see the snake.", "sense"), L("thal-amy", 600, "The message reaches the damaged amygdala. No alarm sounds. You stay calm, even when you should not.", "sense")],
    damage: "Damage to both amygdalae removes fear and the ability to read fear in other people's faces.",
    example: "Patient S.M. has Urbach-Wiethe disease, which destroyed both her amygdalae. She does not feel fear: she handled snakes and spiders, and in fear conditioning experiments showed no fear response at all.",
  },
  {
    id: "hippocampus", name: "Hippocampus", short: "Hippocampus", clue: "After surgery that removed parts of both inner temporal lobes, a man could remember his childhood but could not form a single new lasting memory.",
    does: "A seahorse-shaped curl inside the temporal lobe. It ties the parts of an experience together into a new memory, then over days and weeks helps store it in the cortex. It also builds maps of places.",
    act: [L("cx-hip", 1300, "You meet someone new: their face, name and the place all arrive at the hippocampus from the cortex.", "sense"), L("hip-cx", 1600, "The hippocampus binds them into one memory and, often during sleep, replays it to the cortex for long-term storage.", "info")],
    hurtAct: [L("cx-hip", 1300, "The new experience arrives at the damaged hippocampus and is not bound into a memory. Within minutes of being distracted, it is gone.", "sense")],
    damage: "Damage to both sides causes anterograde amnesia: old memories and skills remain, but new facts and events cannot be stored. It is one of the first areas affected in Alzheimer's disease.",
    example: "H.M. (Henry Molaison) had parts of both inner temporal lobes, including the hippocampus, removed in 1953 to stop his seizures. For the rest of his life he could not form new lasting memories, though he could still learn new motor skills such as mirror drawing.",
  },
  {
    id: "basal-ganglia", name: "Basal ganglia", short: "Basal ganglia", clue: "A man's hand trembles while it rests in his lap, he is slow to start walking, and he shuffles in small steps.",
    does: "A group of deep nuclei (the caudate, putamen and globus pallidus) that select which movement to start and smooth it, and that form habits. They depend on dopamine from the substantia nigra in the midbrain.",
    act: [L("m1-bg", 900, "The motor cortex proposes a movement to the basal ganglia.", "motor"), L("sn-bg", 700, "Dopamine from the substantia nigra says \"go\".", "info"), L("bg-thal", 700, "The basal ganglia release the brake on the thalamus.", "info"), L("thal-m1", 900, "The thalamus tells the motor cortex: start now. The movement begins smoothly.", "motor")],
    hurtAct: [L("m1-bg", 900, "The motor cortex proposes a movement.", "motor"), L("sn-bg", 700, "Too little dopamine arrives from the substantia nigra. The brake stays on: the movement is slow to start and small.", "info")],
    damage: "Loss of dopamine causes Parkinson's disease: tremor at rest, slowness, stiffness and shuffling. Loss of cells in the caudate causes Huntington's disease, with jerky, dance-like movements.",
    example: "In Parkinson's disease, most of the dopamine cells of the substantia nigra have already died before the first symptoms appear. Levodopa, which the brain turns into dopamine, can bring movement back.",
  },
  {
    id: "corpus-callosum", name: "Corpus callosum", short: "Corpus callosum", clue: "After an operation for severe epilepsy, a woman cannot name an object held in her left hand out of sight, though she can pick it out by touch.",
    does: "A thick bridge of about 200 million nerve fibres joining the left and right hemispheres, so each side knows what the other is doing.",
    act: [L("cc-cross", 1400, "The left hemisphere sends what it knows across the corpus callosum to the right hemisphere. Both sides share the same picture.", "info")],
    hurtAct: [L("cc-cross", 1400, "The bridge is cut. The message stops in the middle: each hemisphere works on its own.", "info")],
    damage: "Cutting it (split-brain surgery, once used for severe epilepsy) leaves the two hemispheres unable to share information.",
    example: "Split-brain patients cannot name an object felt by the left hand out of sight: the right hemisphere feels it, but speech lives in the left hemisphere, and the bridge between them has been cut.",
  },
];
export const REGION = Object.fromEntries(REGIONS.map((r) => [r.id, r])) as Record<RegionId, RegionInfo>;

/** Peel layers: 0 the whole brain, 1 the left hemisphere lifted away, 2 both hemispheres see-through. */
export const LAYERS = [
  { name: "Outer brain", say: "The outer layer, the cerebral cortex, folded into ridges and grooves so a large sheet fits in the skull. You are looking at the left side: the front of the brain points left." },
  { name: "Peel the left side", say: "The left hemisphere is lifted away. Now you can see the deep parts in the middle: thalamus, hypothalamus, basal ganglia, the hippocampus and amygdala, and the corpus callosum bridging the two halves." },
  { name: "See-through", say: "Both hemispheres are see-through. The deep structures, brainstem and cerebellum are all visible at once. Turn the brain to see how they sit inside." },
];

/** Fixed camera stops, so a student who has spun the brain can always find a textbook view again. */
export type GuideView = "free" | "lateral" | "medial" | "inferior" | "coronal";
export const GUIDE: { id: Exclude<GuideView, "free">; name: string; layer: number; say: string }[] = [
  { id: "lateral", name: "Side view", layer: 0, say: "Side view (lateral): the outside of the left hemisphere. The front (anterior) is to the left, the back (posterior) to the right. The lateral sulcus separates the temporal lobe below from the frontal and parietal lobes above; the central sulcus separates frontal from parietal." },
  { id: "medial", name: "Middle view", layer: 1, say: "Middle view (medial): the left hemisphere is lifted away, so you look at the inner face of the right hemisphere, as if the brain had been cut down the middle. You see the corpus callosum arching over the thalamus, with the hippocampus curling below and the brainstem running down." },
  { id: "inferior", name: "From below", layer: 0, say: "From below (inferior): the underside of the brain. The temporal lobes hang down on each side, the frontal lobes lie over the eyes at the front, and the brainstem and cerebellum sit at the back. This is the view a surgeon sees when lifting the brain." },
  { id: "coronal", name: "Front cut", layer: 0, say: "Front cut (coronal): the front of the brain is cut away from ear to ear, as on a coronal scan. Inside the cut you see the deep parts at this level: the basal ganglia beside the fluid-filled ventricles, the thalamus in the middle, and the temporal lobes with the hippocampus below." },
];
