import { evaluate } from "@/lib/auth/api-guard";
import { GAME_BOARDS, gameBoard, type GameBoard } from "@/lib/app-api/boards";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import type { Leaderboard } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** GET /api/app/v1/leaderboards/games/:game (rx, mse, comorbid): this week's accuracy board, as the game's screen shows it. */
export const GET = appRoute<{ game: string }>({ auth: "bearer" }, async ({ user, params }): Promise<Leaderboard> => {
  if (!(GAME_BOARDS as readonly string[]).includes(params.game)) throw new ApiFail("not_found");
  const gate = await evaluate(user.profile, [{ path: `/games/${params.game}`, flag: "learn" }]);
  if (!gate.ok) throw new ApiFail(gate.reason === "account_blocked" ? "account_blocked" : gate.reason);
  return gameBoard(params.game as GameBoard, user.profile.id);
});
