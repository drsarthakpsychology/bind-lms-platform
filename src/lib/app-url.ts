/**
 * The public web address used in every email link and absolute URL.
 * A localhost or blank value (a leftover from a laptop .env) is never used
 * for real students: it falls back to the live site.
 */
export const LIVE_SITE = "https://vibhapsychology.com";

export function cleanAppUrl(raw: string | undefined | null, fallback = LIVE_SITE): string {
  const v = (raw ?? "").trim().replace(/\/+$/, "");
  if (!v || !/^https?:\/\//i.test(v)) return fallback;
  if (/^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(:\d+)?/i.test(v)) return fallback;
  return v;
}

export function appUrl(): string {
  return cleanAppUrl(process.env.NEXT_PUBLIC_APP_URL);
}
