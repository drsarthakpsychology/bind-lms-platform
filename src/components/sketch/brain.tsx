"use client";

/**
 * A hand-drawn brain cut down the middle, seen from the side with the front
 * to the left, the way textbooks draw the dopamine pathways: the folded
 * cortex, the arched corpus callosum, the thalamus, the striatum, the
 * brainstem (midbrain, pons, medulla) running down into the spinal cord,
 * the cerebellum tucked behind it, and the pituitary hanging under the
 * hypothalamus. Drawing units: 400 x 290.
 */
import { C, Cv, E, P } from "./ink";

/** Where things are in the drawing. */
export const BRAIN = {
  prefrontal: [78, 104],
  striatum: [172, 128],
  accumbens: [134, 152],
  vta: [238, 178],
  nigra: [256, 172],
  hypothalamus: [206, 180],
  pituitary: [198, 210],
  scn: [190, 184],
  pineal: [272, 136],
  thalamus: [236, 134],
} as const satisfies Record<string, readonly [number, number]>;

/** The outline of the cerebrum, front pole on the left. */
const CEREBRUM: [number, number][] = [
  [74, 180], [52, 166], [40, 140], [44, 106], [64, 72], [98, 46], [146, 28], [200, 22], [256, 28], [304, 50], [340, 86], [358, 124], [354, 152], [334, 168],
  [300, 170], [272, 168], [262, 170], [234, 172], [218, 184], [200, 190], [176, 188], [146, 190], [110, 188], [74, 180],
];

/** Sulci: the grooves between the folds, drawn as soft wavy lines that follow the surface. */
const SULCI = [
  // cingulate sulcus, arching over the corpus callosum
  "M100 132 C92 98 124 66 176 58 C226 52 284 62 306 100",
  // the paracentral and central grooves at the top
  "M206 24 C204 34 214 40 210 52",
  "M240 26 C236 38 246 44 240 56",
  // parieto-occipital and calcarine sulci at the back
  "M322 66 C314 84 306 100 298 124",
  "M298 124 C316 128 334 128 354 136",
  // folds of the frontal lobe
  "M60 96 C72 92 80 100 78 112 C76 122 86 126 94 120",
  "M86 62 C96 72 112 70 116 60",
  "M122 40 C124 50 138 54 146 44",
  "M58 140 C70 134 80 142 92 138",
  "M166 36 C164 44 176 48 178 40",
  // folds of the parietal and occipital lobes
  "M270 38 C264 48 276 54 270 64",
  "M296 58 C292 70 304 74 300 84",
  "M334 104 C326 110 332 118 344 116",
  "M318 150 C326 142 338 146 346 140",
];

export function Brain({ shade = [] }: { shade?: (keyof typeof BRAIN)[] }) {
  const hot = (s: keyof typeof BRAIN) => shade.includes(s);
  return (
    <g>
      {/* cerebellum first, so the cerebrum sits over its front edge */}
      <P k="cerebellum" d="M272 178 C282 166 318 164 342 174 C362 184 362 214 344 228 C322 244 288 240 272 222 C264 212 264 192 272 178 Z" sw={2} fill={C.wash} fillStyle="solid" />
      <P k="folia" d="M282 200 C300 190 324 186 352 192 M280 210 C302 204 328 204 354 210 M284 222 C304 220 326 222 346 226 M288 188 C306 180 324 178 340 180" stroke={C.soft} sw={1.1} single rough={0.7} />
      {/* brainstem: midbrain, the rounded pons, the medulla, then the spinal cord */}
      <P k="stem" d="M232 166 C228 182 212 192 212 210 C212 226 224 234 232 240 C235 256 238 272 240 292 L258 292 C258 272 260 254 262 238 C268 218 268 194 266 166 Z" sw={2.2} fill={C.wash} fillStyle="solid" />
      <P k="pons" d="M218 194 C234 200 250 200 266 194 M218 228 C234 234 250 234 264 228" stroke={C.soft} sw={1.2} single />
      {/* the cerebrum */}
      <Cv k="cerebrum" pts={CEREBRUM} sw={2.4} fill={C.wash} fillStyle="solid" />
      <P k="sulci" d={SULCI.join(" ")} stroke={C.soft} sw={1.4} single rough={0.7} />
      {/* corpus callosum: the white arch joining the two halves */}
      <P k="callosum" d="M116 124 C108 96 146 80 200 80 C252 80 290 90 294 112 C296 126 280 128 274 118 C264 104 238 98 200 98 C162 98 140 106 136 122 C132 134 118 134 116 124 Z" sw={1.8} fill={C.paper} fillStyle="solid" />
      {/* thalamus and striatum, below the arch */}
      <E k="thalamus" cx={BRAIN.thalamus[0]} cy={BRAIN.thalamus[1]} w={40} h={24} sw={1.4} stroke={C.soft} fill={hot("thalamus") ? C.lime : undefined} gap={4} />
      <E k="striatum" cx={BRAIN.striatum[0]} cy={BRAIN.striatum[1]} w={36} h={20} sw={1.4} stroke={C.soft} fill={hot("striatum") ? C.lime : undefined} gap={4} />
      {/* hypothalamus, stalk and pituitary */}
      <P k="stalk" d="M202 188 Q200 196 199 204" sw={1.6} single />
      <E k="pituitary" cx={BRAIN.pituitary[0]} cy={BRAIN.pituitary[1]} w={18} h={12} sw={1.6} fill={hot("pituitary") ? C.lime : C.paper} fillStyle={hot("pituitary") ? "hachure" : "solid"} />
      {shade
        .filter((s) => s !== "pituitary" && s !== "thalamus" && s !== "striatum")
        .map((s) => (
          <E key={s} k={`shade-${s}`} cx={BRAIN[s][0]} cy={BRAIN[s][1]} w={s === "prefrontal" ? 60 : 24} h={s === "prefrontal" ? 54 : 18} fill={C.lime} stroke={C.ink} sw={1.3} gap={4} />
        ))}
    </g>
  );
}
