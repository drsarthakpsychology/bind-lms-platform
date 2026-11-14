/**
 * Certificate IDs from the studio: VIBHA-XXXX-XXXX-XXXX in Crockford base 32
 * (no I, L, O or U, so nothing is misread when typed from paper). 12 random
 * characters is 60 bits: unguessable, short enough to print and type.
 */
const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

export function newCertificateId(random: (n: number) => Uint8Array = (n) => crypto.getRandomValues(new Uint8Array(n))): string {
  const bytes = random(12);
  let s = "";
  for (let i = 0; i < 12; i++) s += ALPHABET[bytes[i] & 31];
  return `VIBHA-${s.slice(0, 4)}-${s.slice(4, 8)}-${s.slice(8, 12)}`;
}

export const STUDIO_ID_RE = /^VIBHA-[0-9A-HJKMNP-TV-Z]{4}-[0-9A-HJKMNP-TV-Z]{4}-[0-9A-HJKMNP-TV-Z]{4}$/;

/**
 * Tidy an ID typed or scanned by a person: upper case, O read as 0, I and L
 * as 1, spaces dropped. Older 64-character IDs pass through unchanged.
 */
export function normaliseCertificateId(raw: string): string {
  const t = decodeURIComponent(String(raw ?? "")).trim();
  if (/^[0-9a-f]{32,64}$/i.test(t)) return t;
  const up = t.toUpperCase().replace(/\s+/g, "");
  if (!up.startsWith("VIBHA")) return t;
  const body = up.slice(5).replace(/[^0-9A-Z]/g, "").replace(/O/g, "0").replace(/[IL]/g, "1");
  if (body.length !== 12) return t;
  return `VIBHA-${body.slice(0, 4)}-${body.slice(4, 8)}-${body.slice(8, 12)}`;
}
