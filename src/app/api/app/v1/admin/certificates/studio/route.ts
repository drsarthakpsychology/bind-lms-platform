import { isSuperAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { CERT_KINDS, KIND_DEFAULTS } from "@/lib/certificates/kinds";
import { loadStudioSetup } from "@/lib/certificates/studio-data";
import { loadDefaultSignatories } from "@/lib/certificates/settings-load";
import { appRoute } from "@/lib/app-api/route";
import type { StudioSetup } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** GET /api/app/v1/admin/certificates/studio: what the certificate studio starts with. Any admin can look; only the super admin issues. */
export const GET = appRoute({ auth: "admin" }, async ({ user }): Promise<StudioSetup> => {
  const admin = createAdminClient();
  const [{ setup }, signatories] = await Promise.all([loadStudioSetup(admin), loadDefaultSignatories(admin)]);
  return {
    v: 1,
    canWrite: isSuperAdmin(user.profile),
    ready: setup.ready,
    today: setup.today,
    kinds: CERT_KINDS.map((k) => ({ ...KIND_DEFAULTS[k], id: k })),
    students: setup.students,
    cohorts: setup.cohorts,
    courses: setup.courses,
    signatures: setup.signatures,
    email: setup.email,
    signatories,
  };
});
