/**
 * One public address for the website: https://vibhapsychology.com.
 *
 * Other hosts that serve the same deployment (the old Vercel address, the
 * www form) are sent to the real address with a permanent redirect, so search
 * engines index one copy only. Preview deployments and unknown hosts are not
 * redirected (they would break testing) but are marked noindex.
 *
 * Never redirected, on any host:
 *  - /api/**  (the phone app, crons and webhooks call these directly; a
 *    redirect would drop the request body and the bearer token)
 *  - /auth/** (sign-in callbacks: the one-time code and its cookie belong to
 *    the host that started the sign-in)
 *  - anything that is not GET or HEAD (form posts and server actions)
 */
export const CANONICAL_HOST = "vibhapsychology.com";
export const CANONICAL_ORIGIN = `https://${CANONICAL_HOST}`;

/** Hosts that are the same site under another name: redirect them. */
const ALIAS_HOSTS = new Set(["www.vibhapsychology.com", "bind-lms-platform.vercel.app"]);

export type HostDecision =
  | { action: "none" }
  | { action: "noindex" }
  | { action: "redirect"; location: string };

function cleanHost(raw: string | null | undefined): string {
  return (raw ?? "").trim().toLowerCase().replace(/:\d+$/, "").replace(/\.$/, "");
}

function isLocal(host: string): boolean {
  return (
    host === "" ||
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host === "0.0.0.0" ||
    host === "[::1]" ||
    /^127\.\d+\.\d+\.\d+$/.test(host) ||
    /^10\.\d+\.\d+\.\d+$/.test(host) ||
    /^192\.168\.\d+\.\d+$/.test(host)
  );
}

function neverRedirect(pathname: string, method: string): boolean {
  const m = method.toUpperCase();
  if (m !== "GET" && m !== "HEAD") return true;
  return pathname === "/api" || pathname.startsWith("/api/") || pathname === "/auth" || pathname.startsWith("/auth/");
}

/**
 * What to do with a request, from its host, path, query and method.
 * `search` includes the leading "?" (or is empty).
 */
export function decideHost(input: {
  host: string | null | undefined;
  pathname: string;
  search?: string;
  method?: string;
}): HostDecision {
  const host = cleanHost(input.host);
  if (host === CANONICAL_HOST || isLocal(host)) return { action: "none" };
  if (ALIAS_HOSTS.has(host) && !neverRedirect(input.pathname, input.method ?? "GET")) {
    const path = input.pathname.startsWith("/") ? input.pathname : `/${input.pathname}`;
    return { action: "redirect", location: `${CANONICAL_ORIGIN}${path}${input.search ?? ""}` };
  }
  return { action: "noindex" };
}
