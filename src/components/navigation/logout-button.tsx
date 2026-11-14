"use client";

import { useFormStatus } from "react-dom";
import { Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Log out, with a visible "Logging out…" while the server signs you out (it can take a moment on a slow line). */
export function LogoutButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="outline" size="lg" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <LogOut className="size-4" aria-hidden />}
      {pending ? "Logging out…" : "Log out"}
    </Button>
  );
}
