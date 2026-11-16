import * as React from "react";
import { View } from "react-native";

import type { Page } from "@/api/contract";
import { messageOf } from "@/api/errors";
import { space } from "@/theme";
import { Button } from "./button";
import { T } from "./text";

type Extra<T> = { base: Page<T>; items: T[]; cursor: string | null };

/**
 * The rest of a paged list. The server sends 50 rows and a `nextCursor`; the
 * screens showed only those 50, so older notifications and doubts could not
 * be reached. A refresh (a new first page) starts again from the top.
 */
export function useMorePages<R extends { id: string }>(first: Page<R>, fetchPage: (cursor: string) => Promise<Page<R>>) {
  const [extra, setExtra] = React.useState<Extra<R>>(() => ({ base: first, items: [], cursor: first.nextCursor }));
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  let cur = extra;
  if (extra.base !== first) {
    cur = { base: first, items: [], cursor: first.nextCursor };
    setExtra(cur);
    setError(null);
  }
  const running = React.useRef(false);
  const loadMore = async () => {
    const cursor = cur.cursor;
    if (!cursor || running.current) return;
    running.current = true;
    setBusy(true);
    setError(null);
    try {
      const page = await fetchPage(cursor);
      setExtra((e) => (e.base === cur.base && e.cursor === cursor ? { ...e, items: [...e.items, ...page.items], cursor: page.nextCursor && page.nextCursor !== cursor ? page.nextCursor : null } : e));
    } catch (e) {
      setError(messageOf(e));
    } finally {
      running.current = false;
      setBusy(false);
    }
  };
  const seen = new Set<string>();
  const items = [...first.items, ...cur.items].filter((r) => (seen.has(r.id) ? false : (seen.add(r.id), true)));
  return { items, more: !!cur.cursor, busy, error, loadMore };
}

/** "Show older" under a paged list, with the reason when it fails. Nothing when there is no more. */
export function MoreButton({ more, busy, error, onPress, testID }: { more: boolean; busy: boolean; error: string | null; onPress: () => void; testID?: string }) {
  if (!more) return null;
  return (
    <View style={{ gap: space[2] }}>
      {error ? (
        <T v="small" tone="danger" accessibilityLiveRegion="polite">
          {error}
        </T>
      ) : null}
      <Button kind="quiet" label={error ? "Try again" : "Show older"} busy={busy} onPress={onPress} testID={testID} />
    </View>
  );
}
