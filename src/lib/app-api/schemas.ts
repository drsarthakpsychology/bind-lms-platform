import { z } from "zod";
import { DEVICE_ID_RE } from "./device-rules";

/** Request body checks shared by the app routes. */

export const uuid = z.string().uuid();

export const deviceSchema = z.object({
  id: z.string().regex(DEVICE_ID_RE),
  name: z.string().trim().min(1).max(80),
  platform: z.enum(["android", "ios"]),
  appVersion: z.string().max(20).optional(),
  osVersion: z.string().max(40).optional(),
});

export const signInSchema = z.object({
  email: z.string().trim().min(3).max(320),
  password: z.string().min(1).max(200),
  device: deviceSchema,
});

export const refreshSchema = z.object({ refreshToken: z.string().min(10).max(2000) });

export const setupCheckSchema = z.object({ token: z.string().min(1).max(200) });
export const setupCompleteSchema = z.object({ token: z.string().min(1).max(200), password: z.string().min(1).max(500) });

/** Expo push tokens: "ExponentPushToken[...]" or "ExpoPushToken[...]". */
export const EXPO_TOKEN_RE = /^Expo(nent)?PushToken\[[A-Za-z0-9_-]{10,100}\]$/;

export const updateDeviceSchema = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  pushToken: z.string().regex(EXPO_TOKEN_RE).nullable().optional(),
  /** Why this phone has no push token (only logged, so the owner can see why push is not reaching phones). */
  pushProblem: z.enum(["no_project_id", "no_firebase", "denied", "token_failed"]).optional(),
  appVersion: z.string().max(20).optional(),
  osVersion: z.string().max(40).optional(),
});

export const updateMeSchema = z.object({
  mobileNumber: z.string().max(30).optional(),
  skipMobilePrompt: z.boolean().optional(),
});

export const allowChangeSchema = z.object({ userId: uuid });

/** `?limit=&cursor=` for lists. */
export function pageParams(query: URLSearchParams, def = 30, max = 100): { limit: number; cursor: string | null } {
  const n = parseInt(query.get("limit") ?? "", 10);
  const limit = Number.isFinite(n) && n > 0 ? Math.min(n, max) : def;
  const cursor = query.get("cursor");
  return { limit, cursor: cursor && cursor.length <= 200 ? cursor : null };
}

/** A test or checkpoint sitting: question key to the chosen option index. */
export const picksSchema = z.object({ picks: z.record(z.string().max(200), z.number().int().min(0).max(20)).refine((p) => Object.keys(p).length <= 500, "too many") });
