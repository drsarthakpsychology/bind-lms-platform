/**
 * Helpers shared by the app API route tests: a signed-in request builder and
 * fixtures. No mocks live here (vi.mock must sit in each test file).
 */
import { makeTestDb, type TestDb } from "./test-db";

export const DEVICE = "phone-aaaaaaaaaaaaaaaa";
export const OTHER_DEVICE = "phone-bbbbbbbbbbbbbbbb";
export const STUDENT_ID = "11111111-1111-4111-8111-111111111111";
export const ADMIN_ID = "22222222-2222-4222-8222-222222222222";

/** A token that looks like a JWT with a far expiry (or a past one). */
export function token(name: string, expired = false, sub?: string): string {
  const exp = Math.floor(Date.now() / 1000) + (expired ? -60 : 3600);
  return `${Buffer.from(name).toString("base64url")}xxxxxxxxxx.${Buffer.from(JSON.stringify(sub ? { exp, sub } : { exp })).toString("base64url")}.sig`;
}

export const STUDENT_TOKEN = token("student");
export const ADMIN_TOKEN = token("admin");

export function profileRow(over: Record<string, unknown> = {}) {
  return {
    id: STUDENT_ID,
    email: "asha@example.com",
    name: "Asha Rao",
    role: "student",
    scope: "full",
    status: "active",
    block_reason: null,
    active_session_token: "web-token",
    expires_at: null,
    mobile_number: null,
    mobile_prompt_skipped_at: null,
    roll_number: "VIBHA-000042",
    ...over,
  };
}

export function seedDb(over: Record<string, Record<string, unknown>[]> = {}, missing: string[] = []): TestDb {
  return makeTestDb(
    {
      profiles: [profileRow(), profileRow({ id: ADMIN_ID, email: "owner@example.com", name: "Owner", role: "admin", roll_number: null })],
      app_devices: [
        { id: "d1", user_id: STUDENT_ID, device_id: DEVICE, name: "Pixel 8", platform: "android", push_token: null, active: true, activated_at: "2026-11-01T00:00:00.000Z", last_seen_at: null },
        { id: "d2", user_id: ADMIN_ID, device_id: DEVICE, name: "Admin phone", platform: "android", push_token: null, active: true, activated_at: "2026-11-01T00:00:00.000Z", last_seen_at: null },
      ],
      app_device_changes: [],
      access_blocks: [],
      notifications: [],
      cohort_members: [],
      ...over,
    },
    missing,
  );
}

export type ReqInit = { method?: string; body?: unknown; token?: string | null; device?: string | null; version?: string; headers?: Record<string, string> };

export function appReq(path: string, init: ReqInit = {}): Request {
  const headers: Record<string, string> = { "x-app-platform": "android", ...(init.headers ?? {}) };
  if (init.token !== null) headers.authorization = `Bearer ${init.token ?? STUDENT_TOKEN}`;
  if (init.device !== null) headers["x-app-device-id"] = init.device ?? DEVICE;
  if (init.version) headers["x-app-version"] = init.version;
  if (init.body !== undefined) headers["content-type"] = "application/json";
  return new Request(`http://test.local/api/app/v1${path}`, {
    method: init.method ?? (init.body !== undefined ? "POST" : "GET"),
    headers,
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
  });
}

export const params = <P>(p: P) => ({ params: Promise.resolve(p) });
export const noParams = { params: Promise.resolve({} as Record<string, never>) };

/** Test-only: the answers are read loosely so each test can assert on any field. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Loose = any;

export async function read(res: Response): Promise<{ status: number; ok: boolean; data: Loose; error: { code: string; message: string; details?: Loose } | undefined }> {
  const j = await res.json();
  return { status: res.status, ok: j.ok, data: j.data, error: j.error };
}
