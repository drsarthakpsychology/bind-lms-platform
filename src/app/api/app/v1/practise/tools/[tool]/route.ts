import { evaluate } from "@/lib/auth/api-guard";
import { TOOLS, isToolId, practiseTool } from "@/lib/app-api/practise";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import type { PractiseTool } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** GET /api/app/v1/practise/tools/:tool: one game or practice tool's first screen, behind that tool's own website gate. */
export const GET = appRoute<{ tool: string }>({ auth: "bearer" }, async ({ user, params, limitFast }): Promise<PractiseTool> => {
  if (!isToolId(params.tool)) throw new ApiFail("not_found");
  const gate = await evaluate(user.profile, [TOOLS[params.tool].gate]);
  if (!gate.ok) throw new ApiFail(gate.reason === "account_blocked" ? "account_blocked" : gate.reason);
  limitFast(`app:tool:${user.profile.id}`, 120);
  return practiseTool(params.tool, user.profile);
});
