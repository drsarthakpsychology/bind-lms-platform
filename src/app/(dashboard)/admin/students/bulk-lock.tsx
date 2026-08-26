"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Unlock } from "lucide-react";
import { setAllStudentsStatus } from "./actions";
import { Button } from "@/components/ui/button";

/** "Lock everything / unlock everything" for the whole student body at once. */
export function BulkLockControls() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function run(status: "active" | "blocked") {
    startTransition(async () => {
      await setAllStudentsStatus(status);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="secondary"
        size="xs"
        onClick={() => run("blocked")}
        disabled={isPending}
        title="Lock every student's access immediately"
      >
        {isPending ? <Loader2 className="size-3.5 animate-spin" aria-hidden /> : <Lock className="size-3.5" aria-hidden />}
        Lock all
      </Button>
      <Button
        type="button"
        variant="outline"
        size="xs"
        onClick={() => run("active")}
        disabled={isPending}
        title="Restore access for every student"
      >
        <Unlock className="size-3.5" aria-hidden />
        Unlock all
      </Button>
    </div>
  );
}
