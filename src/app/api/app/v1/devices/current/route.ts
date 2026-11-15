import { updateDevice } from "@/lib/app-api/devices";
import { appRoute } from "@/lib/app-api/route";
import { updateDeviceSchema } from "@/lib/app-api/schemas";

export const runtime = "nodejs";

/** PUT /api/app/v1/devices/current: rename this phone, set or clear its push token. */
export const PUT = appRoute({ auth: "bearer" }, async ({ user, body, limitWrite }) => {
  const input = await body(updateDeviceSchema);
  await limitWrite(`app:device:${user.profile.id}`, 30);
  return updateDevice({ userId: user.profile.id, role: user.profile.role, deviceId: user.deviceId, ...input });
});
