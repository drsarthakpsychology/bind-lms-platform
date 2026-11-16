import type { UseQueryResult } from "@tanstack/react-query";
import { router } from "expo-router";
import { ExternalLink } from "lucide-react-native";
import * as React from "react";
import { openLink } from "@/lib/open";
import { View } from "react-native";

import { ApiFailure, isClosed } from "@/api/errors";
import { useOffline } from "@/api/online";
import { config } from "@/lib/config";
import { LoadSwap } from "@/motion";
import { space, useTheme } from "@/theme";
import { Button } from "./button";
import { EmptyState, LoadError, RowsSkeleton } from "./parts";
import { T } from "./text";

/** Open a website page (a path such as "/study/notes", or a full address). */
export function openWebsite(path = "/dashboard"): void {
  const url = /^https?:\/\//.test(path) ? path : `${config.site}${path.startsWith("/") ? path : `/${path}`}`;
  void openLink(url);
}

function goBack(home: string): void {
  try {
    if (router.canGoBack()) router.back();
    else router.replace(home);
  } catch {
    /* no navigator (tests) */
  }
}

/**
 * A part that is ready on the website but not in the app yet. Never a dead
 * end: the same page opens on the website, or Back. Practise's SoonState is
 * this same part.
 */
export function ComingSoon({ web, body = "This part is ready on the website.", home = "/", testID = "soon" }: { /** The website page that has it ("/study/notes"). */ web?: string; body?: string; /** Where Back goes when there is nothing to go back to. */ home?: string; testID?: string }) {
  const c = useTheme();
  return (
    <View testID={testID} style={{ gap: space[3] }}>
      <EmptyState mood="soon" title="Coming soon to the app" body={body} />
      <Button label="Open on the website" icon={<ExternalLink size={18} color={c.onPrimary} />} onPress={() => openWebsite(web)} testID="soon-web" />
      <Button kind="text" label="Back" onPress={() => goBack(home)} testID="soon-back" />
    </View>
  );
}

/** Under a skeleton that is taking long: a quiet "Still trying..." after 4 seconds, or as soon as a try has failed. */
export function StillTrying({ failed }: { failed: boolean }) {
  const [late, setLate] = React.useState(false);
  const offline = useOffline();
  React.useEffect(() => {
    const t = setTimeout(() => setLate(true), 4000);
    return () => clearTimeout(t);
  }, []);
  // Offline: say so plainly (the read waits and opens by itself), never a skeleton that seems to hang.
  if (offline)
    return (
      <T v="small" tone="muted" accessibilityLiveRegion="polite" testID="still-trying">
        You are offline. This opens when you are back online.
      </T>
    );
  if (!late && !failed) return null;
  return (
    <T v="small" tone="muted" accessibilityLiveRegion="polite" testID="still-trying">
      Still trying...
    </T>
  );
}

/**
 * Opened offline on something never loaded before: one calm line, never an
 * error. It opens by itself when the internet is back (the read is waiting).
 */
export function WaitingForInternet({ onRetry }: { onRetry: () => void }) {
  return <EmptyState mood="wait" title="This opens when you are back online" body="Everything you opened before is saved on this phone." action={{ label: "Try now", onPress: onRetry }} testID="waiting-online" />;
}

/**
 * The three states of anything loaded from the server, in one place:
 * a skeleton in the shape of the content, a "could not load" state with
 * Try again, or the content. Saved data shows at once while it refreshes.
 * A skeleton shows only after 120ms and then for at least 380ms.
 */
export function Loaded<T>({ q, skeleton, what, soon, children }: { q: UseQueryResult<T>; skeleton?: React.ReactNode; what?: string; /** The server may not have this route yet: a 404 means "coming soon", not an error. A string is the website page that has it. */ soon?: boolean | string; children: (data: T) => React.ReactNode }) {
  let body: React.ReactNode = null;
  // Offline with nothing saved: the read waits for the internet (React Query "paused").
  const waiting = q.data === undefined && !q.isError && q.fetchStatus === "paused";
  if (q.data !== undefined) body = children(q.data);
  else if (waiting) body = <WaitingForInternet onRetry={() => void q.refetch()} />;
  else if (q.isError) {
    if (isClosed(q.error)) body = <EmptyState title="Not open for your account" body="This part of VIBHA is not switched on for you yet." testID="closed" />;
    else if (soon && q.error instanceof ApiFailure && q.error.code === "not_found") body = <ComingSoon web={typeof soon === "string" ? soon : undefined} />;
    else body = <LoadError what={what} error={q.error} onRetry={() => void q.refetch()} />;
  }
  // Nothing for 120ms, then the skeleton for at least 380ms, then the content rises in.
  return (
    <LoadSwap
      ready={q.data !== undefined || q.isError || waiting}
      skeleton={
        <View style={{ gap: space[3] }}>
          {skeleton ?? <RowsSkeleton />}
          <StillTrying failed={q.failureCount > 0} />
        </View>
      }
    >
      {body}
    </LoadSwap>
  );
}
