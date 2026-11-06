"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { sendLoginLink } from "../../cohorts/actions";

/** Email this student a fresh login link (older links stop working). */
export function SendLinkButton({ email }: { email: string }) {
  const router = useRouter();
  const [pending, start] = React.useTransition();
  return (
    <Button
      size="sm"
      variant="outline"
      disabled={pending}
      onClick={() =>
        start(async () => {
          const r = await sendLoginLink(email);
          if (r.error) toast.error(r.error);
          else toast.success("Login link sent.");
          router.refresh();
        })
      }
    >
      {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <KeyRound className="size-4" aria-hidden />}
      Send login link
    </Button>
  );
}
