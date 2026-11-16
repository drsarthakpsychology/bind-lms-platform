import type { UseQueryResult } from "@tanstack/react-query";
import { router } from "expo-router";
import { ExternalLink } from "lucide-react-native";
import * as React from "react";
import { Linking, View } from "react-native";

import { ApiFailure, isClosed } from "@/api/errors";
import { config } from "@/lib/config";
import { LoadSwap } from "@/motion";
import { space, useTheme } from "@/theme";
import { Button } from "./button";
import { EmptyState, LoadError, RowsSkeleton } from "./parts";
import { T } from "./text";
import { toast } from "./toast";

/** Open a website page (a path such as "/study/notes", or a full address). */
export function openWebsite(path = "/dashboard"): void {
  const url = /^https?:\/\//.test(path) ? path : `${config.site}${path.startsWith("/") ? path : `/${path}`}`;
  void Linking.openURL(url).catch(() => toast.show("That didn't open. Try again."));
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
 * A skeleton shows only after 120ms and then for at least 380ms.
 */
export function Loaded<T>({ q, skeleton, what, soon, children }: { q: UseQueryResult<T>; skeleton?: React.ReactNode; what?: string; /** The server may not have this route yet: a 404 means "coming soon", not an error. A string is the website page that has it. */ soon?: boolean | string; children: (data: T) => React.ReactNode }) {
  let body: React.ReactNode = null;
  if (q.data !== undefined) body = children(q.data);
  else if (q.isError) {
    if (isClosed(q.error)) body = <EmptyState title="Not open for your account" body="This part of VIBHA is not switched on for you yet." testID="closed" />;
    else if (soon && q.error instanceof ApiFailure && q.error.code === "not_found") body = <ComingSoon web={typeof soon === "string" ? soon : undefined} />;
    else body = <LoadError what={what} error={q.error} onRetry={() => void q.refetch()} />;
  }
  // Nothing for 120ms, then the skeleton for at least 380ms, then the content rises in.
  return (
    <LoadSwap
      ready={q.data !== undefined || q.isError}
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
