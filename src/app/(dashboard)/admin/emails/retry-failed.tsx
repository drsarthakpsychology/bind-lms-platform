"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RefreshCw } from "lucide-react";
import { retryFailedCredentialSends } from "./actions";
import { Button } from "@/components/ui/button";

/** Retry the failed CREDENTIAL sends shown in the Sent history. */
export function RetryFailedCredentials() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<string | null>(null);

  function retry() {
    setResult(null);
    startTransition(async () => {
      const res = await retryFailedCredentialSends();
      if (res.error) setResult(res.error);
      else if (res.retried === 0) setResult("No failed credential sends to retry.");
      else {
        setResult(`Retried ${res.retried}: sent ${res.sent}, failed ${res.failed}.`);
        router.refresh();
      }
    });
  }

  return (
    <span className="inline-flex items-center gap-2">
      <Button type="button" variant="secondary" size="sm" onClick={retry} disabled={isPending}>
        {isPending ? <Loader2 className="size-3.5 animate-spin" aria-hidden /> : <RefreshCw className="size-3.5" aria-hidden />}
        {isPending ? "Retrying…" : "Retry failed credentials"}
      </Button>
      {result ? <span role="status" className="text-caption text-muted-foreground">{result}</span> : null}
    </span>
  );
}
