import type { UseQueryResult } from "@tanstack/react-query";
import * as React from "react";

import { ApiFailure, isClosed } from "@/api/errors";
import { SkeletonIn } from "@/motion";
import { EmptyState, LoadError, RowsSkeleton } from "./parts";

/**
 * The three states of anything loaded from the server, in one place:
 * a skeleton in the shape of the content, a "could not load" state with
 * Try again, or the content. Saved data shows at once while it refreshes.
 */
export function Loaded<T>({ q, skeleton, what, soon, children }: { q: UseQueryResult<T>; skeleton?: React.ReactNode; what?: string; /** The server may not have this route yet: a 404 means "coming soon", not an error. */ soon?: boolean; children: (data: T) => React.ReactNode }) {
  if (q.data !== undefined) return <>{children(q.data)}</>;
  if (q.isError) {
    if (isClosed(q.error)) return <EmptyState title="Not open for your account" body="This part of VIBHA is not switched on for you yet." testID="closed" />;
    if (soon && q.error instanceof ApiFailure && q.error.code === "not_found") return <EmptyState mood="soon" title="Coming in the next update" body="This part is ready on the website and arrives in the app soon." testID="soon" />;
    return <LoadError what={what} error={q.error} onRetry={() => void q.refetch()} />;
  }
  // The skeleton waits 120ms before showing, so a quick load never flashes grey.
  return skeleton ? <SkeletonIn>{skeleton}</SkeletonIn> : <RowsSkeleton />;
}
