import { Skeleton } from "@/components/ui/skeleton";

/**
 * /verify/[certificateId] loading — matches the certificate card layout.
 * The page does a one-row Supabase lookup before rendering, so this keeps the
 * flash-of-empty-card from appearing while it resolves.
 */
export default function VerifyLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5">
      <div className="w-full max-w-md rounded-lg border border-border bg-card hard-shadow-md">
        <div className="space-y-3 p-6 text-center">
          <Skeleton className="mx-auto h-6 w-48" />
          <Skeleton className="mx-auto h-5 w-28" />
          <Skeleton className="mx-auto h-8 w-52" />
          <Skeleton className="mx-auto h-4 w-36" />
          <Skeleton className="mx-auto h-7 w-44" />
          <Skeleton className="mx-auto h-4 w-40" />
        </div>
      </div>
    </div>
  );
}
