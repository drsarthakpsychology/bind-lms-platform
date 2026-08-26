import { AccessToken } from "livekit-server-sdk";
import { readFileSync } from "node:fs";

function env(name: string): string | undefined {
  if (process.env[name]) return process.env[name];
  // Standalone workers / scripts don't auto-load .env.local — read it.
  try {
    for (const line of readFileSync(".env.local", "utf8").split("\n")) {
      const m = line.match(new RegExp(`^${name}=(.*)$`));
      if (m) return m[1].trim();
    }
  } catch {
    /* ignore */
  }
  return undefined;
}

/**
 * Mint a short-lived LiveKit participant token for a student's patient
 * session. The secret NEVER leaves the server. The token is scoped to a single
 * room (the sim session) and expires in 10 minutes — a student who pauses and
 * comes back requests a fresh token.
 */
export async function createLiveKitToken(opts: {
  room: string; // the sim session id — the LiveKit room name
  identity: string; // the authenticated student's id
  name: string; // the patient's display name
  metadata?: string;
  ttl?: string;
}): Promise<string> {
  const apiKey = env("LIVEKIT_API_KEY");
  const apiSecret = env("LIVEKIT_API_SECRET");
  if (!apiKey || !apiSecret) {
    throw new Error("LIVEKIT_API_KEY / LIVEKIT_API_SECRET not configured");
  }
  const at = new AccessToken(apiKey, apiSecret, {
    identity: opts.identity,
    name: opts.name,
    metadata: opts.metadata ?? JSON.stringify({ room: opts.room }),
    ttl: opts.ttl ?? "10m",
  });
  at.addGrant({
    roomJoin: true,
    room: opts.room,
    canPublish: true,
    canSubscribe: true,
  });
  return await at.toJwt();
}

/** The LiveKit websocket URL for the configured project. */
export function liveKitWsUrl(): string {
  return env("LIVEKIT_URL") ?? "";
}
