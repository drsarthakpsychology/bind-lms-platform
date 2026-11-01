/**
 * Original flat-outline illustrations for the public homepage (same set as the
 * Cohort Two brochure). Pure string builders → inline SVG. No images to ship,
 * no external requests, CSP-safe (inline SVG is markup, not a resource).
 */

const INK = "#111111";
const BLUE = "#1d44d8";
const LIME = "#cdf24b";
const WHITE = "#ffffff";
const SK = { a: "#f6d3b6", b: "#e8b48c", c: "#c98b62", d: "#9a6243" } as const;

type Hair =
  | "short"
  | "side"
  | "spiky"
  | "longFront"
  | "bun"
  | "curly"
  | "bob"
  | "beanie"
  | "bucket"
  | "cap";

export type Character = {
  skin: string;
  hair?: Hair;
  hairColor?: string;
  hatColor?: string;
  scarf?: string;
  beard?: boolean;
  glasses?: boolean | string;
  top?: "coat" | "hoodie" | "collar" | "sweater" | "tee";
  shirt?: string;
  steth?: boolean;
  chain?: boolean;
  mouth?: "grin" | "o" | "flat" | "talk" | "smile";
  brows?: "worried" | "raised";
  blush?: boolean;
  flip?: boolean;
};

function hair(o: Character): string {
  const h = o.hairColor ?? INK;
  const s = `fill="${h}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"`;
  switch (o.hair) {
    case "short":
      return `<path ${s} d="M59,96 C52,58 76,38 104,40 C132,42 150,62 141,96 C138,82 132,72 120,68 C108,76 84,76 70,70 C63,78 60,86 59,96 Z"/>`;
    case "side":
      return `<path ${s} d="M58,98 C50,56 78,36 106,40 C134,44 150,66 142,98 C140,86 136,76 128,70 C112,72 92,66 82,58 C74,70 64,82 58,98 Z"/>`;
    case "spiky":
      return `<path ${s} d="M58,98 C52,72 56,58 64,50 L62,38 L78,44 L84,30 L96,40 L106,26 L114,40 L128,32 L130,48 L142,46 C148,62 146,82 142,98 C138,84 130,74 118,70 C104,78 82,76 70,70 C63,78 60,88 58,98 Z"/>`;
    case "longFront":
      return `<path ${s} d="M60,96 C56,60 80,44 104,46 C128,46 144,62 140,96 C132,76 116,64 102,60 C92,74 76,84 60,96 Z"/>`;
    case "bun":
      return `<circle ${s} cx="100" cy="36" r="17"/><path ${s} d="M59,96 C54,60 78,44 102,44 C128,44 148,62 141,96 C134,78 122,66 100,64 C82,66 66,78 59,96 Z"/>`;
    case "curly": {
      const pts = [[64, 78], [70, 60], [84, 48], [100, 44], [116, 48], [130, 60], [136, 78], [58, 96], [142, 96], [76, 66], [92, 58], [108, 58], [124, 66]];
      return pts.map(([x, y]) => `<circle ${s} cx="${x}" cy="${y}" r="13"/>`).join("") + `<path fill="${h}" d="M62,90 C62,62 138,62 138,90 C130,76 70,76 62,90 Z"/>`;
    }
    case "bob":
      return `<path ${s} d="M56,124 C46,66 72,40 102,40 C132,40 156,66 144,124 L132,124 C136,100 134,82 126,72 C110,78 86,76 72,70 C66,84 64,104 68,124 Z"/>`;
    case "beanie": {
      const c = o.hatColor ?? BLUE;
      const ribs = [70, 82, 94, 106, 118, 130].map((x) => `<path d="M${x},${38 + Math.abs(100 - x) / 6} L${x},80" stroke="${INK}" stroke-width="3" opacity=".55"/>`).join("");
      return `<path fill="${c}" stroke="${INK}" stroke-width="4" stroke-linejoin="round" d="M56,86 C54,44 76,30 100,30 C124,30 146,44 144,86 Z"/>${ribs}<rect x="52" y="76" width="96" height="16" rx="7" fill="${c}" stroke="${INK}" stroke-width="4"/>`;
    }
    case "bucket": {
      const c = o.hatColor ?? INK;
      return `<path fill="${c}" stroke="${INK}" stroke-width="4" stroke-linejoin="round" d="M66,78 C66,46 80,36 100,36 C120,36 134,46 134,78 Z"/><path fill="${c}" stroke="${INK}" stroke-width="4" stroke-linejoin="round" d="M44,88 C52,74 148,74 156,88 C156,94 44,94 44,88 Z"/>`;
    }
    case "cap": {
      const c = o.hatColor ?? INK;
      return `<path fill="${c}" stroke="${INK}" stroke-width="4" stroke-linejoin="round" d="M58,84 C56,46 78,34 102,34 C126,34 146,48 144,84 Z"/><path fill="${c}" stroke="${INK}" stroke-width="4" stroke-linejoin="round" d="M96,80 C110,72 150,72 168,84 C160,90 110,92 96,86 Z"/>`;
    }
    default:
      return "";
  }
}

function backHair(o: Character): string {
  const h = o.hairColor ?? INK;
  const s = `fill="${h}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"`;
  if (o.hair === "longFront")
    return `<path ${s} d="M58,88 C50,48 80,36 102,38 C128,38 154,56 146,96 C150,130 156,160 150,182 L124,184 L120,150 L80,150 L76,184 L50,182 C44,160 52,128 58,88 Z"/>`;
  if (o.scarf)
    return `<path fill="${o.scarf}" stroke="${INK}" stroke-width="4" stroke-linejoin="round" d="M50,104 C44,52 74,32 100,32 C126,32 156,52 150,104 C152,140 144,170 100,176 C56,170 48,140 50,104 Z"/>`;
  return "";
}

function body(o: Character): string {
  const shirt = o.shirt ?? "#ffffff";
  let b = "";
  if (o.top === "coat") {
    b += `<path fill="#ffffff" stroke="${INK}" stroke-width="4" stroke-linejoin="round" d="M8,232 C10,192 36,170 70,164 L130,164 C164,170 190,192 192,232 Z"/>`;
    b += `<path fill="${shirt}" stroke="${INK}" stroke-width="4" stroke-linejoin="round" d="M78,164 L100,212 L122,164 Z"/>`;
    b += `<path d="M76,165 L92,232 M124,165 L108,232" stroke="${INK}" stroke-width="4" fill="none"/>`;
    b += `<path d="M64,186 L80,186" stroke="${INK}" stroke-width="3.5"/>`;
    b += `<rect x="136" y="196" width="26" height="22" rx="3" fill="#ffffff" stroke="${INK}" stroke-width="3.5"/><path d="M142,196 L142,186" stroke="${BLUE}" stroke-width="4"/>`;
    if (o.steth)
      b += `<path d="M80,166 C70,196 78,214 98,216 C118,214 128,196 120,166" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><circle cx="98" cy="220" r="7" fill="${WHITE}" stroke="${INK}" stroke-width="3.5"/>`;
    return b;
  }
  b += `<path fill="${shirt}" stroke="${INK}" stroke-width="4" stroke-linejoin="round" d="M8,232 C10,192 36,170 70,164 L130,164 C164,170 190,192 192,232 Z"/>`;
  if (o.top === "hoodie") {
    b += `<path fill="${shirt}" stroke="${INK}" stroke-width="4" stroke-linejoin="round" d="M62,168 C70,190 130,190 138,168 C126,160 74,160 62,168 Z"/>`;
    b += `<path d="M88,186 L86,212 M112,186 L114,212" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`;
  } else if (o.top === "collar") {
    b += `<path fill="#ffffff" stroke="${INK}" stroke-width="4" stroke-linejoin="round" d="M78,162 L100,180 L84,192 Z M122,162 L100,180 L116,192 Z"/>`;
    b += `<path d="M100,182 L100,232" stroke="${INK}" stroke-width="3" opacity=".6"/>`;
  } else if (o.top === "sweater") {
    b += `<path d="M76,166 Q100,190 124,166" fill="none" stroke="${INK}" stroke-width="4"/><path d="M40,200 L40,232 M160,200 L160,232" stroke="${INK}" stroke-width="3" opacity=".5"/>`;
  } else {
    b += `<path d="M80,166 Q100,186 120,166" fill="none" stroke="${INK}" stroke-width="4"/>`;
  }
  return b;
}

function face(o: Character): string {
  const sk = o.skin;
  let f = "";
  f += `<path fill="${sk}" stroke="${INK}" stroke-width="4" stroke-linejoin="round" d="M86,126 L86,168 Q100,178 114,168 L114,126 Z"/>`;
  f += `<circle cx="60" cy="100" r="10" fill="${sk}" stroke="${INK}" stroke-width="4"/><circle cx="140" cy="100" r="10" fill="${sk}" stroke="${INK}" stroke-width="4"/>`;
  f += `<ellipse cx="100" cy="94" rx="40" ry="46" fill="${sk}" stroke="${INK}" stroke-width="4"/>`;
  if (o.scarf)
    f += `<path fill="${o.scarf}" stroke="${INK}" stroke-width="4" stroke-linejoin="round" d="M56,102 C48,38 152,38 144,102 C140,76 60,76 56,102 Z"/><path d="M64,80 Q100,66 136,80" stroke="${INK}" stroke-width="2.5" fill="none" opacity=".4"/>`;
  if (o.beard)
    f += `<path fill="${o.hairColor ?? INK}" stroke="${INK}" stroke-width="4" stroke-linejoin="round" d="M62,106 C64,134 82,142 100,142 C118,142 136,134 138,106 C132,124 120,124 112,120 C104,116 96,116 88,120 C80,124 68,124 62,106 Z"/>`;
  const ey = 98;
  // Pupils follow the pointer via CSS custom properties (--ex/--ey, -1..1) set
  // on an ancestor by the cursor tracker. Flipped characters mirror the x axis.
  const sx = o.flip ? -4 : 4;
  f += `<g style="transform:translate(calc(var(--ex,0) * ${sx}px),calc(var(--ey,0) * 3px));transition:transform 140ms ease-out"><ellipse cx="85" cy="${ey}" rx="5" ry="7.5" fill="${INK}"/><ellipse cx="115" cy="${ey}" rx="5" ry="7.5" fill="${INK}"/><circle cx="86.5" cy="${ey - 3}" r="1.8" fill="#fff"/><circle cx="116.5" cy="${ey - 3}" r="1.8" fill="#fff"/></g>`;
  const bt =
    o.brows === "worried"
      ? "M76,82 Q84,84 92,78 M108,78 Q116,84 124,82"
      : o.brows === "raised"
        ? "M76,80 Q85,72 93,78 M107,78 Q115,72 124,80"
        : "M76,84 Q85,78 93,82 M107,82 Q115,78 124,84";
  f += `<path d="${bt}" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  if (o.glasses) {
    const g = o.glasses === true ? INK : o.glasses;
    f += `<rect x="71" y="87" width="28" height="22" rx="7" fill="rgba(255,255,255,.25)" stroke="${g}" stroke-width="3.5"/><rect x="101" y="87" width="28" height="22" rx="7" fill="rgba(255,255,255,.25)" stroke="${g}" stroke-width="3.5"/><path d="M99,96 L101,96 M71,95 L62,92 M129,95 L138,92" stroke="${g}" stroke-width="3.5"/>`;
  }
  f += `<path d="M100,102 Q95,111 101,113" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
  switch (o.mouth) {
    case "grin":
      f += `<path d="M86,120 Q100,124 114,120 Q112,136 100,136 Q88,136 86,120 Z" fill="${INK}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M90,123 Q100,126 110,123 L109,127 Q100,129 91,127 Z" fill="${WHITE}"/>`;
      break;
    case "o":
      f += `<ellipse cx="100" cy="124" rx="6" ry="7" fill="${INK}"/>`;
      break;
    case "flat":
      f += `<path d="M92,124 L108,123" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
      break;
    case "talk":
      f += `<path d="M88,120 Q100,132 112,120 Z" fill="${INK}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>`;
      break;
    default:
      f += `<path d="M88,120 Q100,131 112,120" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  }
  return f;
}

export function characterSvg(o: Character): string {
  const g = o.flip ? '<g transform="translate(200,0) scale(-1,1)">' : "<g>";
  return `<svg viewBox="0 0 200 232" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style="overflow:visible;display:block;width:100%;height:auto">${g}${backHair(o)}${body(o)}${face(o)}${hair(o)}</g></svg>`;
}

export const CAST = {
  doctor: { skin: SK.c, hair: "side", hairColor: "#1b1b1b", beard: true, glasses: true, top: "coat", shirt: BLUE, steth: true, mouth: "grin" },
  doctor2: { skin: SK.b, hair: "longFront", hairColor: "#2a1a12", top: "coat", shirt: LIME, steth: true },
  doctor3: { skin: SK.d, hair: "short", hairColor: "#1b1b1b", top: "coat", shirt: INK, glasses: true },
  psych: { skin: SK.b, hair: "bob", hairColor: "#2a1a12", top: "collar", shirt: LIME, glasses: BLUE },
  beanie: { skin: SK.a, hair: "beanie", hatColor: INK, glasses: true, top: "hoodie", shirt: LIME, mouth: "grin" },
  long: { skin: SK.c, hair: "longFront", hairColor: "#20140f", top: "tee", shirt: WHITE },
  bun: { skin: SK.b, hair: "bun", hairColor: "#3b2416", glasses: true, top: "sweater", shirt: BLUE, mouth: "talk" },
  scarf: { skin: SK.a, scarf: INK, top: "tee", shirt: LIME, mouth: "grin" },
  curly: { skin: SK.d, hair: "curly", hairColor: "#1b1b1b", top: "hoodie", shirt: WHITE, mouth: "grin" },
  bucket: { skin: SK.d, hair: "bucket", hatColor: INK, top: "tee", shirt: WHITE, mouth: "o", brows: "raised" },
  cap: { skin: SK.b, hair: "cap", hatColor: BLUE, glasses: true, top: "tee", shirt: LIME },
  patient: { skin: SK.b, hair: "short", hairColor: "#4a3a30", top: "sweater", shirt: WHITE, mouth: "flat", brows: "worried" },
  spiky: { skin: SK.c, hair: "spiky", hairColor: "#1b1b1b", top: "collar", shirt: BLUE, mouth: "smile" },
} satisfies Record<string, Character>;

export type CastName = keyof typeof CAST;

export function starSvg(points: number, inner: number, outer: number, fill: string, stroke?: string): string {
  let p = "";
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 ? inner : outer;
    const a = (Math.PI * i) / points - Math.PI / 2;
    p += (i ? "L" : "M") + (100 + r * Math.cos(a)).toFixed(1) + "," + (100 + r * Math.sin(a)).toFixed(1);
  }
  const st = stroke ? ` stroke="${stroke}" stroke-width="5" stroke-linejoin="round"` : "";
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style="display:block;width:100%;height:100%"><path d="${p}Z" fill="${fill}"${st}/></svg>`;
}

export function sparkleSvg(fill: string): string {
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style="display:block;width:100%;height:100%"><path d="M50,0 C54,36 64,46 100,50 C64,54 54,64 50,100 C46,64 36,54 0,50 C36,46 46,36 50,0 Z" fill="${fill}"/></svg>`;
}

export function asteriskSvg(fill: string): string {
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style="display:block;width:100%;height:100%"><g stroke="${fill}" stroke-width="16" stroke-linecap="round"><path d="M50,8 L50,92 M14,29 L86,71 M14,71 L86,29"/></g></svg>`;
}

export type IconName =
  | "alert" | "pill" | "bolt" | "family" | "loop" | "shield" | "chat" | "book"
  | "clinic" | "clipboard" | "vote" | "heart" | "eye" | "puzzle";

export function iconSvg(name: IconName, fill = LIME): string {
  const S = `stroke="${INK}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"`;
  const F = fill;
  const m: Record<IconName, string> = {
    alert: `<path d="M50,10 L92,86 L8,86 Z" fill="${F}" ${S}/><path d="M50,38 L50,60" ${S} fill="none"/><circle cx="50" cy="72" r="4" fill="${INK}"/>`,
    pill: `<g transform="rotate(-35 50 50)"><rect x="14" y="34" width="72" height="32" rx="16" fill="#fff" ${S}/><path d="M50,34 L50,66" ${S}/><path d="M50,34 L70,34 A16,16 0 0 1 70,66 L50,66 Z" fill="${F}" ${S}/></g>`,
    bolt: `<path d="M58,6 L20,56 L46,56 L38,94 L80,40 L54,40 Z" fill="${F}" ${S}/>`,
    family: `<circle cx="28" cy="34" r="12" fill="${F}" ${S}/><circle cx="72" cy="34" r="12" fill="${F}" ${S}/><circle cx="50" cy="52" r="10" fill="#fff" ${S}/><path d="M8,86 C8,62 48,62 48,86 Z" fill="${F}" ${S}/><path d="M52,86 C52,62 92,62 92,86 Z" fill="${F}" ${S}/><path d="M34,92 C34,72 66,72 66,92 Z" fill="#fff" ${S}/>`,
    loop: `<path d="M78,40 A30,30 0 1 0 80,62" fill="none" ${S} stroke-width="9"/><path d="M66,30 L82,40 L88,22" fill="none" ${S} stroke-width="8"/><circle cx="50" cy="50" r="8" fill="${F}" ${S}/>`,
    shield: `<path d="M50,8 L86,22 C86,58 72,80 50,92 C28,80 14,58 14,22 Z" fill="${F}" ${S}/><path d="M34,50 L46,62 L68,38" fill="none" ${S} stroke-width="8"/>`,
    chat: `<path d="M10,16 L66,16 Q72,16 72,22 L72,52 Q72,58 66,58 L32,58 L18,70 L20,58 L16,58 Q10,58 10,52 Z" fill="${F}" ${S}/><path d="M80,40 L88,40 Q92,40 92,44 L92,70 Q92,74 88,74 L84,74 L86,86 L72,74 L48,74 Q44,74 44,70 L44,64" fill="#fff" ${S}/>`,
    book: `<path d="M8,20 Q30,12 50,22 Q70,12 92,20 L92,84 Q70,76 50,86 Q30,76 8,84 Z" fill="#fff" ${S}/><path d="M50,22 L50,86" ${S}/><path d="M18,36 Q30,32 42,38 M18,50 Q30,46 42,52 M58,38 Q70,32 82,36 M58,52 Q70,46 82,50" ${S} stroke-width="4" fill="none"/>`,
    clinic: `<rect x="14" y="30" width="72" height="60" fill="#fff" ${S}/><path d="M8,32 L50,8 L92,32" fill="none" ${S}/><rect x="38" y="40" width="24" height="24" fill="${F}" ${S} stroke-width="4"/><path d="M50,44 L50,60 M42,52 L58,52" ${S} stroke-width="5"/><rect x="42" y="70" width="16" height="20" fill="${F}" ${S} stroke-width="4"/>`,
    clipboard: `<rect x="18" y="14" width="64" height="80" rx="6" fill="#fff" ${S}/><rect x="34" y="6" width="32" height="16" rx="4" fill="${F}" ${S}/><path d="M30,40 L70,40 M30,56 L70,56 M30,72 L56,72" ${S} stroke-width="5"/>`,
    vote: `<rect x="14" y="44" width="72" height="48" rx="4" fill="${F}" ${S}/><path d="M30,44 L30,40 L70,40 L70,44" ${S} fill="none"/><rect x="32" y="8" width="36" height="42" fill="#fff" ${S} transform="rotate(8 50 30)"/><path d="M40,28 L48,36 L62,20" fill="none" ${S} stroke-width="5"/>`,
    heart: `<path d="M50,88 C10,62 6,38 18,24 C30,10 46,18 50,30 C54,18 70,10 82,24 C94,38 90,62 50,88 Z" fill="${F}" ${S}/><path d="M24,52 L38,52 L44,40 L52,64 L58,52 L76,52" fill="none" ${S} stroke-width="5"/>`,
    eye: `<path d="M6,50 Q50,8 94,50 Q50,92 6,50 Z" fill="#fff" ${S}/><circle cx="50" cy="50" r="16" fill="${F}" ${S}/><circle cx="50" cy="50" r="6" fill="${INK}"/>`,
    puzzle: `<path d="M14,14 L42,14 Q40,4 50,4 Q60,4 58,14 L86,14 L86,42 Q96,40 96,50 Q96,60 86,58 L86,86 L14,86 Z" fill="${F}" ${S}/>`,
  };
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style="display:block;width:100%;height:100%">${m[name]}</svg>`;
}

/** A waving hand (for the "Hi." intro). Rotation is animated in CSS. */
export function handSvg(skin = SK.c): string {
  return `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style="display:block;width:100%;height:auto;overflow:visible"><path d="M30,118 L34,70 C24,60 14,48 20,40 C26,34 34,44 40,52 L38,18 C38,10 48,10 49,18 L52,48 L54,10 C55,2 65,2 65,10 L64,48 L70,16 C72,8 81,10 80,18 L76,52 L84,30 C87,23 95,26 93,34 L84,74 C80,92 72,104 66,118 Z" fill="${skin}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M22,118 L76,118" stroke="${INK}" stroke-width="5"/></svg>`;
}
