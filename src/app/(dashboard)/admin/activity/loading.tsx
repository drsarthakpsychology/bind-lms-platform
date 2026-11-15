import { Skeleton } from "@/components/ui/skeleton";
import { LoadingFrame } from "@/components/design-system/slow-state";
import { AdminLoading } from "../_v2/v2-context";

export default function Loading() {
  return (
    <AdminLoading
      rows={10}
      old={
        <LoadingFrame>
          <div className="mx-auto w-full max-w-6xl space-y-6">
            <Skeleton className="h-8 w-56" />
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-14 rounded-lg" />
              ))}
            </div>
          </div>
        </LoadingFrame>
      }
    />
  );
}
