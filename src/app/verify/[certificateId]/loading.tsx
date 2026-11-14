import { LoadingFrame } from "@/components/design-system/slow-state";
import { Skeleton } from "@/components/ui/skeleton";

/** /verify/[certificateId] loading: the same shape as the result (status, name, title, rows). */
export default function VerifyLoading() {
  return (
    <LoadingFrame>
      <div className="mx-auto w-full max-w-xl px-5 py-10 sm:py-16">
        <Skeleton className="h-8 w-28 rounded-full" />
        <Skeleton className="mt-5 h-9 w-64 max-w-full" />
        <Skeleton className="mt-3 h-5 w-72 max-w-full" />
        <Skeleton className="mt-5 h-4 w-full" />
        <div className="mt-8 space-y-4">
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-60" />
        </div>
      </div>
    </LoadingFrame>
  );
}
