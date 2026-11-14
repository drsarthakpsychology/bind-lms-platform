/**
 * A same-site path to send someone to, or null. Only "/something" counts:
 * never another site ("https://…", "//host", "/\host" which browsers read as
 * "//host"), never a scheme ("javascript:"), never control characters.
 */
export function safeInternalPath(raw: unknown): string | null {
  if (typeof raw !== "string" || raw.length === 0 || raw.length > 2000) return null;
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\")) return null;
  for (let i = 0; i < raw.length; i++) if (raw.charCodeAt(i) < 32 || raw.charCodeAt(i) === 127) return null;
  return raw;
}
