import type { UseQueryResult } from "@tanstack/react-query";
import * as React from "react";

import { ApiFailure, isClosed } from "@/api/errors";
import { LoadSwap } from "@/motion";
import { EmptyState, LoadError, RowsSkeleton } from "./parts";

/**
 * The three states of anything loaded from the server, in one place:
 * a skeleton in the shape of the content, a "could not load" state with
 * Try again, or the content. Saved data shows at once while it refreshes.
 * A skeleton shows only after 120ms and then for at least 380ms.
 */
export function Loaded<T>({ q, skeleton, what, soon, children }: { q: UseQueryResult<T>; skeleton?: React.ReactNode; what?: string; /** The server may not have this route yet: a 404 means "coming soon", not an error. */ soon?: boolean; children: (data: T) => React.ReactNode }) {
  let body: React.ReactNode = null;
  if (q.data !== undefined) body = children(q.data);
  else if (q.isError) {
    if (isClosed(q.error)) body = <EmptyState title="Not open for your account" body="This part of VIBHA is not switched on for you yet." testID="closed" />;
    else if (soon && q.error instanceof ApiFailure && q.error.code === "not_found") body = <EmptyState mood="soon" title="Coming in the next update" body="This part is ready on the website and arrives in the app soon." testID="soon" />;
    else body = <LoadError what={what} error={q.error} onRetry={() => void q.refetch()} />;
  }
  // Nothing for 120ms, then the skeleton for at least 380ms, then the content rises in.
  return (
    <LoadSwap ready={q.data !== undefined || q.isError} skeleton={skeleton ?? <RowsSkeleton />}>
      {body}
    </LoadSwap>
  );
}
