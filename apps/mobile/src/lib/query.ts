/**
 * Reading addresses without throwing. React Native's URLSearchParams cuts a
 * value at its second "=" and throws on a stray "%" (decodeURIComponent), and
 * a server address is data the app does not control.
 */

/** decodeURIComponent that gives the text back unchanged when it is not valid. */
export function decodeSafe(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

/** "a=1&b=x=y&c" as { a: "1", b: "x=y", c: "" }; the first of a repeated name wins. Never throws. */
export function queryOf(qs: string | null | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  for (const pair of String(qs ?? "").replace(/^\?/, "").split("&")) {
    if (!pair) continue;
    const at = pair.indexOf("=");
    const plus = (t: string) => decodeSafe(t.replace(/\+/g, " "));
    const key = plus(at < 0 ? pair : pair.slice(0, at));
    if (key && !(key in out)) out[key] = at < 0 ? "" : plus(pair.slice(at + 1));
  }
  return out;
}
