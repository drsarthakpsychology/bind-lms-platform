import "server-only";
import { createClient } from "@/lib/supabase/server";

/**
 * The class wall (/wall), shared by the website page, its API routes
 * (/api/practice/wall/*) and the app (/api/app/v1/wall/*). Every read and
 * write goes through the caller's own Supabase client, so row level security
 * applies: anonymous authors are nulled by the *_visible views and never
 * leave the server.
 */

export const WALL_REACTIONS = ["heart", "insight", "question", "applause", "worry"] as const;
export type WallReaction = (typeof WALL_REACTIONS)[number];

export type WallReplyData = { id: string; content: string; isAnonymous: boolean; isFaculty: boolean; createdAt: string; reactions: Record<string, number>; mine: string[] };
export type WallPostData = { id: string; content: string; isAnonymous: boolean; isFaculty: boolean; isPinned: boolean; createdAt: string; replies: WallReplyData[]; reactions: Record<string, number>; mine: string[] };

type Row = Record<string, unknown>;

function count(rows: Row[], key: "post_id" | "reply_id"): Map<string, Record<string, number>> {
  const out = new Map<string, Record<string, number>>();
  for (const r of rows) {
    const k = String(r[key]);
    const c = out.get(k) ?? {};
    const rk = String(r.reaction);
    c[rk] = (c[rk] ?? 0) + 1;
    out.set(k, c);
  }
  return out;
}

/**
 * The newest 50 posts (pinned first) with their replies, reaction counts and,
 * when `userId` is given, the reactions this person gave (`mine`). Post-level
 * counts include only reactions on the post itself, as the page always showed.
 */
export async function loadWall(userId?: string | null): Promise<WallPostData[]> {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("wall_posts_visible")
    .select("id, content, is_anonymous, is_faculty, is_pinned, created_at, author_id")
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(50);

  const postIds = (posts ?? []).map((p) => p.id as string);
  const none = Promise.resolve({ data: [] as Row[] });
  const [{ data: replies }, { data: reactions }, { data: replyReactions }, { data: mineRows }] = await Promise.all([
    postIds.length ? supabase.from("wall_replies_visible").select("id, post_id, content, is_anonymous, is_faculty, created_at, author_id").in("post_id", postIds).order("created_at", { ascending: true }) : none,
    postIds.length ? supabase.from("wall_reactions").select("post_id, reaction").in("post_id", postIds) : none,
    postIds.length ? supabase.from("wall_reactions").select("reply_id, reaction").not("reply_id", "is", null).in("post_id", postIds) : none,
    postIds.length && userId ? supabase.from("wall_reactions").select("post_id, reply_id, reaction").eq("author_id", userId).in("post_id", postIds) : none,
  ]);

  const byReply = count((replyReactions ?? []) as Row[], "reply_id");
  const byPost = count((reactions ?? []) as Row[], "post_id");
  const mine = new Map<string, string[]>();
  for (const r of (mineRows ?? []) as Row[]) {
    const k = r.reply_id ? `r:${String(r.reply_id)}` : `p:${String(r.post_id)}`;
    mine.set(k, [...(mine.get(k) ?? []), String(r.reaction)]);
  }
  const repliesByPost = new Map<string, Row[]>();
  for (const r of (replies ?? []) as Row[]) {
    const k = String(r.post_id);
    repliesByPost.set(k, [...(repliesByPost.get(k) ?? []), r]);
  }

  return (posts ?? []).map((p) => ({
    id: String(p.id),
    content: String(p.content),
    isAnonymous: Boolean(p.is_anonymous),
    isFaculty: Boolean(p.is_faculty),
    isPinned: Boolean(p.is_pinned),
    createdAt: String(p.created_at),
    // author_id is deliberately never passed on.
    replies: (repliesByPost.get(String(p.id)) ?? []).map((r) => ({
      id: String(r.id),
      content: String(r.content),
      isAnonymous: Boolean(r.is_anonymous),
      isFaculty: Boolean(r.is_faculty),
      createdAt: String(r.created_at),
      reactions: byReply.get(String(r.id)) ?? {},
      mine: mine.get(`r:${String(r.id)}`) ?? [],
    })),
    reactions: byPost.get(String(p.id)) ?? {},
    mine: mine.get(`p:${String(p.id)}`) ?? [],
  }));
}

export type WallWrite<T> = { ok: true; value: T } | { ok: false; error: string };

/** A new post. The author is stored; the views hide it on anonymous posts. */
export async function addWallPost(userId: string, input: { content: string; isAnonymous: boolean }): Promise<WallWrite<{ id: string }>> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("wall_posts").insert({ author_id: userId, content: input.content, is_anonymous: input.isAnonymous, is_faculty: false }).select("id").single();
  if (error || !data) return { ok: false, error: error?.message ?? "insert failed" };
  return { ok: true, value: { id: String(data.id) } };
}

/** A reply to a post (same privacy rule as posts). */
export async function addWallReply(userId: string, input: { postId: string; content: string; isAnonymous: boolean }): Promise<WallWrite<{ id: string }>> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("wall_replies").insert({ post_id: input.postId, author_id: userId, content: input.content, is_anonymous: input.isAnonymous, is_faculty: false }).select("id").single();
  if (error || !data) return { ok: false, error: error?.message ?? "insert failed" };
  return { ok: true, value: { id: String(data.id) } };
}

/** Toggle one reaction on a post or a reply: the same reaction again takes it back. */
export async function toggleWallReaction(userId: string, input: { postId?: string; replyId?: string; reaction: WallReaction }): Promise<WallWrite<{ added: boolean }>> {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("wall_reactions")
    .select("id")
    .eq("author_id", userId)
    .eq("reaction", input.reaction)
    .eq("post_id", input.postId ?? null)
    .eq("reply_id", input.replyId ?? null)
    .maybeSingle();
  if (existing) {
    await supabase.from("wall_reactions").delete().eq("id", existing.id);
    return { ok: true, value: { added: false } };
  }
  const { error } = await supabase.from("wall_reactions").insert({ post_id: input.postId ?? null, reply_id: input.replyId ?? null, author_id: userId, reaction: input.reaction });
  if (error) return { ok: false, error: error.message };
  return { ok: true, value: { added: true } };
}

/** Flag a post or a reply for faculty. */
export async function reportWall(userId: string, input: { postId?: string; replyId?: string; reason: string }): Promise<WallWrite<null>> {
  const supabase = await createClient();
  const { error } = await supabase.from("wall_reports").insert({ post_id: input.postId ?? null, reply_id: input.replyId ?? null, reported_by: userId, reason: input.reason });
  if (error) return { ok: false, error: error.message };
  return { ok: true, value: null };
}
