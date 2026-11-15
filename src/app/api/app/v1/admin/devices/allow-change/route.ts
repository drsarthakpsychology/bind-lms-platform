import { allowDeviceChange } from "@/lib/app-api/devices";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import { allowChangeSchema } from "@/lib/app-api/schemas";

export const runtime = "nodejs";

/** POST /api/app/v1/admin/devices/allow-change (super admin): the student may change phone again now. */
export const POST = appRoute({ auth: "superAdmin" }, async ({ user, body }) => {
  const { userId } = await body(allowChangeSchema);
  const r = await allowDeviceChange(userId, user.profile.id);
  if (!r.ok) throw new ApiFail(r.ready ? "server_error" : "unavailable", r.ready ? undefined : "Run the app_devices database step first.");
  return { allowed: true as const };
});
