import { z } from "zod";
import { evaluate } from "@/lib/auth/api-guard";
import { PLAY, playFailure } from "@/lib/app-api/play";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import type { PlayResult } from "@/lib/app-api/contract";

export const runtime = "nodejs";

const schema = z.object({ args: z.array(z.unknown()).max(4).default([]) });

/**
 * POST /api/app/v1/play/:game/:action: one move of a server-dealt game or
 * practice tool (src/lib/app-api/play.ts). Answers the website action's own
 * data object, tagged with its kind and version.
 */
export const POST = appRoute<{ game: string; action: string }>({ auth: "bearer" }, async ({ user, params, body, limitWrite, limitFast }): Promise<PlayResult> => {
  const game = Object.hasOwn(PLAY, params.game) ? PLAY[params.game] : undefined;
  const action = game && Object.hasOwn(game.actions, params.action) ? game.actions[params.action] : undefined;
  if (!game || !action) throw new ApiFail("not_found");
  // This game's own gate (scope, switched-off sections, flags), as its website page.
  const gate = await evaluate(user.profile, [game.gate]);
  if (!gate.ok) throw new ApiFail(gate.reason === "account_blocked" ? "account_blocked" : gate.reason);
  const { args } = await body(schema, 128_000);
  if (args.length > action.args) throw new ApiFail("bad_request", undefined, { fields: ["args"] });
  if (action.write) await limitWrite(`app:play:${user.profile.id}`, 240);
  else limitFast(`app:playread:${user.profile.id}`, 240);
  const data = await (action.run as (...a: unknown[]) => Promise<unknown>)(...args);
  const failed = playFailure(data);
  if (failed) throw new ApiFail(/sign in/i.test(failed) ? "unauthenticated" : /not (available|open)|isn't open/i.test(failed) ? "forbidden" : "bad_request", failed);
  return { kind: `${params.game}.${params.action}`, v: 1, data };
});
