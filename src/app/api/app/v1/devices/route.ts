import { deviceState } from "@/lib/app-api/devices";
import { appRoute } from "@/lib/app-api/route";

export const runtime = "nodejs";

/** GET /api/app/v1/devices: this phone and the phone-change allowance. */
export const GET = appRoute({ auth: "bearer" }, async ({ user }) => deviceState({ userId: user.profile.id, role: user.profile.role, email: user.profile.email, deviceId: user.deviceId }));
