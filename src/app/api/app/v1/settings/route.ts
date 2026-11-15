import { buildMe } from "@/lib/app-api/me";
import { deviceState } from "@/lib/app-api/devices";
import { loadPrefs } from "@/lib/app-api/prefs";
import { buildConfig } from "@/lib/app-api/config";
import { appRoute } from "@/lib/app-api/route";
import type { Settings } from "@/lib/app-api/contract";

export const runtime = "nodejs";

const ROLE_LABEL: Record<string, string> = { admin: "Admin", view_admin: "View admin", student: "Student", alumni: "Alumni" };

/** GET /api/app/v1/settings: everything the Settings screen shows. Changes go through PATCH /me, PUT /devices/current and PUT /notifications/preferences. */
export const GET = appRoute({ auth: "bearer" }, async ({ user }): Promise<Settings> => {
  const [me, device, notifications] = await Promise.all([
    buildMe(user.profile, user.name),
    deviceState({ userId: user.profile.id, role: user.profile.role, deviceId: user.deviceId }),
    loadPrefs(user.profile.id),
  ]);
  const config = buildConfig();
  return {
    account: { email: me.email, name: me.name, roleLabel: ROLE_LABEL[me.role] ?? "Student", rollNumber: me.rollNumber, mobileNumber: me.mobileNumber },
    device,
    notifications,
    support: config.support,
    legal: { termsUrl: config.legal.termsUrl, privacyUrl: config.legal.privacyUrl },
    app: { minSupportedVersion: config.minSupportedVersion, latestVersion: config.latestVersion },
  };
});
