import { appRoute, GATES } from "@/lib/app-api/route";
import { loadWall } from "@/lib/wall/data";
import type { WallFeed, WallPostItem } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/wall: the class wall, the website's /wall (loadWall). Authors are never sent; `mine` is your own reactions. */
export const GET = appRoute({ auth: "bearer", gates: GATES.wall }, async ({ user }): Promise<WallFeed> => ({ posts: (await loadWall(user.profile.id)) as WallPostItem[] }));
