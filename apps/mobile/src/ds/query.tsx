import type { UseQueryResult } from "@tanstack/react-query";
import { router } from "expo-router";
import * as React from "react";
import { Linking, View } from "react-native";

import { ApiFailure, isClosed } from "@/api/errors";
import { config } from "@/lib/config";
import { SkeletonIn } from "@/motion";
import { space } from "@/theme";
import { Button } from "./button";
import { EmptyState, LoadError, RowsSkeleton } from "./parts";
import { T } from "./text";

/** Open a website page (a path such as "/study/notes", or a full address). */
export function openWebsite(path = "/dashboard"): void {
  const url = /^https?:\/\//.test(path) ? path : `${config.site}${path.startsWith("/") ? path : `/${path}`}`;
  void Linking.openURL(url).catch(() => undefined);
}

function goBack(): void {
  try {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  } catch {
    /* no navigator (tests) */
  }
}

/**
 * A part that is ready on the website but not in the app yet. Never a dead
 * end: the same page opens on the website, or Back.
 */
export function ComingSoon({ web, body, testID = "soon" }: { /** The website page that has it ("/study/notes"). */ web?: string; body?: string; testID?: string }) {
  return (
    <View testID={testID} style={{ gap: space[3] }}>
      <EmptyState mood="sleepy" title="Coming in the next update" body={body ?? "This part is ready on the website and arrives in the app soon."} />
      <Button label="Open on the website" onPress={() => openWebsite(web)} testID="soon-web" />
      <Button kind="quiet" label="Back" onPress={goBack} testID="soon-back" />
    </View>
  );
}

/** Under a skeleton that is taking long: a quiet "Still trying..." after 4 seconds, or as soon as a try has failed. */
export function StillTrying({ failed }: { failed: boolean }) {
  const [late, setLate] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setLate(true), 4000);
    return () => clearTimeout(t);
  }, []);
  if (!late && !failed) return null;
  return (
    <T v="small" tone="muted" accessibilityLiveRegion="polite" testID="still-trying">
      Still trying...
    </T>
  );
}

/**
 * The three states of anything loaded from the server, in one place:
 * a skeleton in the shape of the content, a "could not load" state with
 * Try again, or the content. Saved data shows at once while it refreshes.
 */
export function Loaded<T>({ q, skeleton, what, soon, children }: { q: UseQueryResult<T>; skeleton?: React.ReactNode; what?: string; /** The server may not have this route yet: a 404 means "coming soon", not an error. A string is the website page that has it. */ soon?: boolean | string; children: (data: T) => React.ReactNode }) {
  if (q.data !== undefined) return <>{children(q.data)}</>;
  if (q.isError) {
    if (isClosed(q.error)) return <EmptyState title="Not open for your account" body="This part of VIBHA is not switched on for you yet." testID="closed" />;
    if (soon && q.error instanceof ApiFailure && q.error.code === "not_found") return <ComingSoon web={typeof soon === "string" ? soon : undefined} />;
    return <LoadError what={what} error={q.error} onRetry={() => void q.refetch()} />;
  }
  // The skeleton waits 120ms before showing, so a quick load never flashes grey.
  return (
    <View style={{ gap: space[3] }}>
      {skeleton ? <SkeletonIn>{skeleton}</SkeletonIn> : <RowsSkeleton />}
      <StillTrying failed={q.failureCount > 0} />
    </View>
  );
}
