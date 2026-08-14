"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * One-shot client-side redirect for returning students. The landing page is
 * statically rendered (ISR) — it can't read cookies on the server or it would
 * opt out of caching — so the "already signed in? go to the dashboard"
 * check moves here, after hydration. Renders nothing.
 */
export function ReturningStudentRedirect() {
  const router = useRouter();

  React.useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/dashboard");
    });
  }, [router]);

  return null;
}
