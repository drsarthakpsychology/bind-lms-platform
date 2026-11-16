import * as React from "react";


/**
 * Pull to refresh done right: the spinner shows only while the person's own
 * pull is loading (not during quiet background refreshes, which made it
 * flash), and it stays at least 500ms so it never blinks. No haptic: a pull
 * is scrolling. Pass any refetch functions; they run together.
 *
 * `const r = useRefresh(q.refetch);  <Screen onRefresh={r.onRefresh} refreshing={r.refreshing}>`
 */
export function useRefresh(...refetch: (() => Promise<unknown>)[]) {
  const [refreshing, setRefreshing] = React.useState(false);
  const fns = React.useRef(refetch);
  React.useEffect(() => {
    fns.current = refetch;
  });
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    const started = Date.now();
    void Promise.allSettled(fns.current.map((f) => f())).then(() => {
      const wait = Math.max(0, 500 - (Date.now() - started));
      setTimeout(() => setRefreshing(false), wait);
    });
  }, []);
  return { refreshing, onRefresh };
}
