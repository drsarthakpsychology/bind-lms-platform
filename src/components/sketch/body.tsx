"use client";

/**
 * A hand-drawn body, front view, cut at the hips: head with the brain inside,
 * neck, shoulders, arms and trunk, with the organs a medicine passes through
 * in their real places (liver on the body's right, stomach on its left, the
 * small intestine below, kidneys behind, the heart and main blood vessels).
 * The person faces us, so the body's right is the viewer's left.
 */
import { C, Cv, E, P } from "./ink";

/** Where things are, in the 400 x 430 drawing. */
export const SPOT = {
  brain: [200, 46],
  bbb: [204, 70],
  nose: [200, 78],
  mouth: [200, 92],
  heart: [212, 172],
  liver: [180, 222],
  stomach: [232, 226],
  gut: [200, 296],
  kidney: [232, 266],
  vein: [116, 284],
  muscle: [264, 156],
  slow: [244, 170],
  vessel: [207, 252],
} as const satisfies Record<string, readonly [number, number]>;

export type Organ = "brain" | "bbb" | "nose" | "mouth" | "heart" | "liver" | "stomach" | "gut" | "kidney" | "vein" | "muscle" | "vessel";

const SKIN: [number, number][] = [
  [186, 120], [160, 128], [138, 138], [126, 156], [120, 200], [113, 258], [106, 316], [102, 334], [110, 344], [121, 336], [128, 292], [135, 236], [146, 186],
  [150, 232], [148, 290], [146, 340], [150, 386], [200, 392], [250, 386], [254, 340], [252, 290], [250, 232], [254, 186],
  [265, 236], [272, 292], [279, 336], [290, 344], [298, 334], [294, 316], [287, 258], [280, 200], [274, 156], [262, 138], [240, 128], [214, 120],
];

export function Body({ hot, faint = false }: { hot?: Organ | null; faint?: boolean }) {
  const fillHot = (o: Organ) => (hot === o ? C.lime : undefined);
  const soft = faint ? C.soft : C.ink;
  return (
    <g>
      {/* skin */}
      <E k="head" cx={200} cy={62} w={68} h={84} sw={2} stroke={soft} />
      <P k="neck" d="M189 102 Q187 112 186 121 M211 102 Q213 112 214 121" sw={2} stroke={soft} />
      <Cv k="skin" pts={SKIN} sw={2} stroke={soft} />
      <P k="hips" d="M150 386 Q175 380 200 392 Q225 380 250 386" sw={1.4} stroke={C.soft} single />
      {/* face */}
      <P k="nose" d="M200 70 L197 80 L203 81" sw={1.4} stroke={hot === "nose" ? C.blue : C.soft} single />
      <P k="mouth" d="M193 91 Q200 95 207 91" sw={1.6} stroke={hot === "mouth" ? C.blue : C.soft} single />

      {/* brain and its barrier */}
      <E k="bbb" cx={200} cy={46} w={64} h={44} sw={1.5} stroke={C.blue} dash="3 4" single fill={fillHot("bbb")} fillStyle="hachure" gap={6} />
      <P k="brain" d="M174 52 C168 40 176 28 190 28 C196 22 210 22 214 29 C226 28 232 38 228 48 C230 58 220 64 210 61 C204 66 192 66 188 61 C178 63 172 58 174 52 Z" sw={1.8} fill={hot === "brain" ? C.lime : C.wash} fillStyle={hot === "brain" ? "hachure" : "solid"} />
      <P k="gyri" d="M184 36 q6 4 2 10 q-4 6 4 10 M200 30 q-4 8 2 12 q6 4 0 12 M214 34 q-6 6 0 10 q6 6 -2 12" sw={1.1} stroke={C.ink} single rough={0.7} />

      {/* blood vessels */}
      <P k="aorta" d="M210 166 Q206 140 205 118 Q204 96 206 72 M208 180 Q207 240 206 330 Q200 350 186 380 M206 330 Q212 350 222 380" sw={2} stroke={C.red} single rough={0.5} />
      <P k="armvessel" d="M200 150 Q170 146 146 158 Q134 200 126 250 Q120 290 114 316" sw={1.6} stroke={C.red} single rough={0.5} />
      {/* heart */}
      <P k="heart" d="M212 184 C196 174 196 160 205 158 C210 157 212 162 212 164 C212 162 214 157 219 158 C228 160 228 174 212 184 Z" sw={1.8} stroke={C.red} fill={hot === "heart" || hot === "vessel" ? C.lime : C.red} gap={5} />
      {/* gullet */}
      <P k="gullet" d="M200 96 Q199 130 204 160 Q210 190 222 208" sw={1.4} stroke={C.soft} single />
      {/* liver: the body's right side, under the ribs */}
      <P k="liver" d="M156 214 Q178 198 214 206 Q210 232 184 242 Q162 246 156 232 Z" sw={1.8} fill={hot === "liver" ? C.lime : C.blue} gap={hot === "liver" ? 4 : 7} fw={hot === "liver" ? 1.8 : 1} />
      {/* stomach: the body's left side */}
      <P k="stomach" d="M220 206 Q248 202 247 228 Q245 252 222 250 Q208 248 214 238 Q228 234 224 216 Z" sw={1.8} fill={hot === "stomach" ? C.lime : undefined} />
      {/* kidneys, behind the gut */}
      <P k="kidneys" d="M166 254 q-12 12 0 26 q8 -2 6 -8 q-4 -5 0 -10 q2 -6 -6 -8 Z M234 254 q12 12 0 26 q-8 -2 -6 -8 q4 -5 0 -10 q-2 -6 6 -8 Z" sw={1.5} stroke={hot === "kidney" ? C.ink : C.soft} fill={hot === "kidney" ? C.lime : undefined} />
      {/* small intestine coiled in the belly */}
      <P k="gut" d="M182 270 q18 -8 36 0 q8 8 -6 12 q-22 4 -30 10 q-4 10 12 10 q22 -2 26 8 q2 10 -16 12 q-14 2 -22 -4" sw={1.8} stroke={hot === "gut" ? C.blue : C.ink} />
      {hot === "gut" ? <E k="gut-hot" cx={200} cy={294} w={56} h={52} stroke="none" fill={C.lime} gap={5} /> : null}
      {hot === "vein" ? <E k="vein-hot" cx={118} cy={290} w={16} h={34} stroke={C.ink} sw={1.2} fill={C.lime} gap={4} /> : null}
      {/* shoulder muscle for depot injections */}
      <E k="deltoid" cx={264} cy={156} w={22} h={34} sw={1.4} stroke={hot === "muscle" ? C.ink : C.soft} fill={hot === "muscle" ? C.lime : undefined} gap={4} />
    </g>
  );
}
