import { useQueryClient } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { CircleHelp, Heart, Lightbulb, MessageCircle, MoreHorizontal, PartyPopper, Pin, Plus, TriangleAlert } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";
import Animated from "react-native-reanimated";

import type { WallFeed, WallPostItem, WallReactionKey, WallReplyItem } from "@/api/contract";
import { messageOf } from "@/api/errors";
import { mapWallKeys, useWall, wallApi } from "@/api/map-wall";
import { queueWrite } from "@/api/queued";
import { Button, EmptyState, Field, IconButton, Loaded, RowsSkeleton, Screen, Sheet, SwitchRow, T } from "@/ds";
import { toast } from "@/ds/toast";
import { haptic } from "@/lib/haptics";
import { Press, RollingNumber, StaggerList, Stamp, presets } from "@/motion";
import { when } from "@/screens/notifications/list";
import { layout, space, useTheme } from "@/theme";

/**
 * The class wall (the website's /wall): posts from your batch, newest first
 * with the pinned one on top. Post with or without your name; nobody's name
 * is ever shown, only Faculty, Anonymous or Cohort member. Reactions, not
 * votes. Every change shows at once and is put back if the server says no.
 */

export const REACTIONS: { key: WallReactionKey; label: string; Icon: typeof Heart }[] = [
  { key: "heart", label: "Heart", Icon: Heart },
  { key: "insight", label: "Insight", Icon: Lightbulb },
  { key: "question", label: "Question", Icon: CircleHelp },
  { key: "applause", label: "Applause", Icon: PartyPopper },
  { key: "worry", label: "Worry", Icon: TriangleAlert },
];

const who = (x: { isFaculty: boolean; isAnonymous: boolean }) => (x.isFaculty ? "Faculty" : x.isAnonymous ? "Anonymous" : "Cohort member");

/** Flip one reaction in the cached feed (used for the instant change and to put it back). */
export function flipReaction(feed: WallFeed, target: { postId?: string; replyId?: string }, key: WallReactionKey): WallFeed {
  const flip = <I extends WallReplyItem>(item: I): I => {
    const had = item.mine.includes(key);
    return { ...item, mine: had ? item.mine.filter((k) => k !== key) : [...item.mine, key], reactions: { ...item.reactions, [key]: Math.max(0, (item.reactions[key] ?? 0) + (had ? -1 : 1)) } };
  };
  return {
    posts: feed.posts.map((p) => (target.postId === p.id ? flip(p) : target.replyId ? { ...p, replies: p.replies.map((r) => (r.id === target.replyId ? flip(r) : r)) } : p)),
  };
}

function ReactionChip({ k, count, mine, onPress }: { k: (typeof REACTIONS)[number]; count: number; mine: boolean; onPress: () => void }) {
  const c = useTheme();
  // The icon lands like a stamp each time you add this reaction.
  const [pop, setPop] = React.useState(0);
  return (
    <Press
      testID={`react-${k.key}`}
      onPress={() => {
        if (!mine) setPop((n) => n + 1);
        onPress();
      }}
      scale={0.92}
      accessibilityRole="button"
      accessibilityState={{ selected: mine }}
      accessibilityLabel={`${k.label}, ${count}${mine ? ". You reacted" : ""}`}
      hitSlop={4}
      innerStyle={{ minHeight: layout.target - 4, minWidth: 44, flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: space[3], borderRadius: 999, borderWidth: 1.5, borderColor: mine ? c.link : c.cardLine, backgroundColor: mine ? c.tint : "transparent" }}
    >
      <View style={{ width: 16, height: 16, alignItems: "center", justifyContent: "center" }}>
        <Stamp fire={pop}>
          <k.Icon size={16} color={mine ? c.link : c.muted} fill={mine && k.key === "heart" ? c.link : "none"} />
        </Stamp>
      </View>
      {/* The name says what the icon means (the triangle is Worry, not Report). */}
      <T v="small" tone={mine ? "link" : "muted"}>
        {k.label}
      </T>
      {count > 0 ? <RollingNumber value={count} v="small" tone={mine ? "link" : "ink"} /> : null}
    </Press>
  );
}

function Reactions({ item, onReact }: { item: WallReplyItem; onReact: (k: WallReactionKey) => void }) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
      {REACTIONS.map((k) => (
        <ReactionChip key={k.key} k={k} count={item.reactions[k.key] ?? 0} mine={item.mine.includes(k.key)} onPress={() => onReact(k.key)} />
      ))}
    </View>
  );
}

function Byline({ x, pinned }: { x: WallReplyItem; pinned?: boolean }) {
  const c = useTheme();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: space[2], flexWrap: "wrap" }}>
      {pinned ? (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: c.primary, borderRadius: 999, paddingHorizontal: space[2], paddingVertical: 2 }}>
          <Pin size={12} color={c.onPrimary} />
          <T v="caption" style={{ color: c.onPrimary }}>
            Case of the week
          </T>
        </View>
      ) : null}
      <T v="small" tone={x.isFaculty ? "link" : "ink"} style={{ fontWeight: "600" }}>
        {who(x)}
      </T>
      <T v="small" tone="muted">
        {when(x.createdAt)}
      </T>
    </View>
  );
}

function PostView({ p, onReact, onReply, onMore }: { p: WallPostItem; onReact: (t: { postId?: string; replyId?: string }, k: WallReactionKey) => void; onReply: (postId: string, text: string, anon: boolean) => Promise<boolean>; onMore: (p: WallPostItem) => void }) {
  const c = useTheme();
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState("");
  const [anon, setAnon] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const n = p.replies.length;
  return (
    <View testID={`post-${p.id}`} style={{ paddingVertical: space[4], gap: space[3], borderTopWidth: 1, borderColor: c.hairline }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: space[2], marginVertical: -space[2] }}>
        <View style={{ flex: 1 }}>
          <Byline x={p} pinned={p.isPinned} />
        </View>
        <IconButton label="More" onPress={() => onMore(p)} testID={`post-more-${p.id}`}>
          <MoreHorizontal size={20} color={c.muted} />
        </IconButton>
      </View>
      <T v="reading">{p.content}</T>
      <Reactions item={p} onReact={(k) => onReact({ postId: p.id }, k)} />
      <Press testID={`post-replies-${p.id}`} onPress={() => setOpen((o) => !o)} accessibilityRole="button" accessibilityState={{ expanded: open }} innerStyle={{ minHeight: layout.target, flexDirection: "row", alignItems: "center", gap: space[2], alignSelf: "flex-start" }}>
        <MessageCircle size={18} color={c.link} />
        <T v="small" tone="link">
          {open ? "Hide replies" : n === 0 ? "Reply" : n === 1 ? "1 reply" : `${n} replies`}
        </T>
      </Press>
      {open ? (
        <Animated.View entering={presets.pop(0)} style={{ gap: space[3], paddingLeft: space[4], borderLeftWidth: 2, borderColor: c.hairline }}>
          <StaggerList>
            {p.replies.map((r) => (
              <View key={r.id} testID={`wall-reply-${r.id}`} style={{ gap: space[2], paddingVertical: space[2] }}>
                <Byline x={r} />
                <T v="body">{r.content}</T>
                <Reactions item={r} onReact={(k) => onReact({ replyId: r.id }, k)} />
              </View>
            ))}
          </StaggerList>
          <Field label="Your reply" area value={text} onChangeText={setText} maxLength={2000} testID={`reply-field-${p.id}`} />
          <SwitchRow title="Reply without your name" value={anon} onChange={setAnon} />
          <Button
            kind="quiet"
            label="Send reply"
            busy={busy}
            needsServer
            disabled={!text.trim()}
            onPress={async () => {
              setBusy(true);
              const sent = await onReply(p.id, text.trim(), anon);
              setBusy(false);
              if (sent) setText("");
            }}
            testID={`reply-send-${p.id}`}
          />
        </Animated.View>
      ) : null}
    </View>
  );
}

function Composer({ open, onClose, onSent }: { open: boolean; onClose: () => void; onSent: () => void }) {
  const [text, setText] = React.useState("");
  const [anon, setAnon] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const send = async () => {
    setBusy(true);
    try {
      await wallApi.post({ content: text.trim(), isAnonymous: anon });
      haptic.success();
      setText("");
      setAnon(false);
      onSent();
      onClose();
    } catch (e) {
      haptic.warn();
      toast.show(messageOf(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <Sheet open={open} onClose={onClose} title="Post to the wall" testID="wall-compose">
      <View style={{ gap: space[3] }}>
        <Field label="What do you want to say?" area value={text} onChangeText={setText} maxLength={2000} testID="wall-text" />
        <SwitchRow title="Post without your name" meta={anon ? "Nobody in your batch sees who wrote it." : undefined} value={anon} onChange={setAnon} testID="wall-anon" />
        <Button label="Post" busy={busy} needsServer disabled={!text.trim()} onPress={() => void send()} testID="wall-send" />
      </View>
    </Sheet>
  );
}

export function WallBody({ feed }: { feed: WallFeed }) {
  const qc = useQueryClient();
  const [more, setMore] = React.useState<WallPostItem | null>(null);
  const [busy, setBusy] = React.useState(false);

  const react = async (target: { postId?: string; replyId?: string }, key: WallReactionKey) => {
    haptic.select();
    qc.setQueryData<WallFeed>(mapWallKeys.wall, (f) => (f ? flipReaction(f, target, key) : f));
    // Sent now, or when the internet is back (in order, so on-off-on ends on). Undone only if the server refuses it.
    void queueWrite({ method: "POST", path: "/wall/reactions", body: { ...target, reaction: key }, scope: "wall-react" }).catch((e: unknown) => {
      qc.setQueryData<WallFeed>(mapWallKeys.wall, (f) => (f ? flipReaction(f, target, key) : f));
      toast.show(messageOf(e));
    });
  };

  const reply = async (postId: string, text: string, anon: boolean): Promise<boolean> => {
    try {
      await wallApi.reply(postId, { content: text, isAnonymous: anon });
      haptic.success();
      await qc.invalidateQueries({ queryKey: mapWallKeys.wall });
      return true;
    } catch (e) {
      haptic.warn();
      toast.show(messageOf(e));
      return false;
    }
  };

  const report = async (p: WallPostItem) => {
    setBusy(true);
    try {
      await wallApi.report({ postId: p.id });
      haptic.success();
      toast.show("Reported. Thanks for flagging it.");
      setMore(null);
    } catch (e) {
      toast.show(messageOf(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {feed.posts.length ? (
        <View>
          {feed.posts.map((p) => (
            <PostView key={p.id} p={p} onReact={(t, k) => void react(t, k)} onReply={reply} onMore={setMore} />
          ))}
        </View>
      ) : (
        <EmptyState title="Nothing on the wall yet" body="Start the conversation. You can post without your name." testID="wall-empty" />
      )}
      <Sheet open={more !== null} onClose={() => setMore(null)} title="This post" testID="wall-more">
        <View style={{ gap: space[3] }}>
          <T tone="muted">Faculty will look at it.</T>
          <Button kind="danger" label="Report this post" busy={busy} onPress={() => more && void report(more)} testID="wall-report" />
          <Button kind="text" full label="Cancel" onPress={() => setMore(null)} />
        </View>
      </Sheet>
    </>
  );
}

export function WallScreen() {
  const c = useTheme();
  const qc = useQueryClient();
  const q = useWall();
  const [compose, setCompose] = React.useState(false);
  return (
    <Screen testID="wall" lead="Posts from your batch. You can post without your name." onRefresh={() => void q.refetch()} refreshing={q.isRefetching} footer={q.data ? <Button label="Write a post" icon={<Plus size={20} color={c.onPrimary} />} onPress={() => setCompose(true)} testID="wall-write" /> : undefined}>
      <Stack.Screen options={{ title: "Class wall" }} />
      <Loaded q={q} what="the wall" skeleton={<RowsSkeleton rows={5} />}>
        {(feed) => <WallBody feed={feed} />}
      </Loaded>
      <Composer open={compose} onClose={() => setCompose(false)} onSent={() => void qc.invalidateQueries({ queryKey: mapWallKeys.wall })} />
    </Screen>
  );
}
