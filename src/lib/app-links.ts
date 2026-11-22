/**
 * App Links (Android) and Universal Links (iPhone): the two files that let
 * links to vibhapsychology.com open the phone app instead of the browser.
 * Pure, so every rule is tested (app-links.test.ts).
 *
 * The owner sets two values on Vercel (Project > Settings > Environment
 * Variables), steps in the push and links guide:
 *   ANDROID_SHA256_FINGERPRINTS  the app's signing fingerprint(s), comma separated
 *                                (Play Console > App integrity > App signing; and
 *                                the upload key for APKs shared by hand)
 *   APPLE_TEAM_ID                the 10-letter Apple team id (later, for iPhone)
 * Without them the files are served empty, and links simply open the browser.
 */
export const APP_PACKAGE = "com.vibhapsychology.app";

/**
 * Website pages the app can show. Must match the intentFilters in
 * apps/mobile/app.config.ts (checked by the test). Not /set-password: its
 * reset link carries the sign-in in the part after "#", which only the
 * website reads.
 */
export const APP_LINK_PATHS = [
  "/setup",
  "/dashboard",
  "/courses",
  "/study",
  "/doubts",
  "/notifications",
  "/verify",
  "/achievements",
  "/practice",
  "/games",
  "/prep",
  "/tools",
  "/journey",
  "/progress",
  "/assignments",
  "/wall",
  "/leaderboard",
  "/clinic",
  "/schedule",
  "/attendance",
  "/leave",
  "/opd",
] as const;

const FP = /^[0-9A-F]{64}$/;

/** "aa:bb:..." or "aabb..." to "AA:BB:...". Anything that is not a SHA-256 fingerprint is dropped. */
export function fingerprints(raw: string | undefined | null): string[] {
  const out: string[] = [];
  for (const part of String(raw ?? "").split(/[\s,;]+/)) {
    const hex = part.replace(/:/g, "").trim().toUpperCase();
    if (!FP.test(hex)) continue;
    const fp = hex.match(/.{2}/g)!.join(":");
    if (!out.includes(fp)) out.push(fp);
  }
  return out;
}

/** /.well-known/assetlinks.json */
export function assetLinks(raw: string | undefined | null) {
  const fps = fingerprints(raw);
  if (!fps.length) return [];
  return [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: { namespace: "android_app", package_name: APP_PACKAGE, sha256_cert_fingerprints: fps },
    },
  ];
}

/** /.well-known/apple-app-site-association. Null without a valid team id. */
export function appleAssociation(teamId: string | undefined | null) {
  const t = String(teamId ?? "").trim().toUpperCase();
  if (!/^[A-Z0-9]{10}$/.test(t)) return null;
  const appID = `${t}.${APP_PACKAGE}`;
  return {
    applinks: {
      details: [{ appIDs: [appID], components: APP_LINK_PATHS.flatMap((p) => [{ "/": p }, { "/": `${p}/*` }]) }],
    },
    webcredentials: { apps: [appID] },
  };
}
