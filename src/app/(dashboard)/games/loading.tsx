import { LoadingFrame } from "@/components/design-system/slow-state";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Games loading state, shaped like the game frame (components/study/activity-frame):
 * the Back row, then the start screen's heading and choice cards. Skeletons,
 * never a spinner, so nothing jumps when the game arrives.
 */
export default function GamesLoading() {
  return (
    <LoadingFrame>
      <div className="mx-auto w-full max-w-4xl lg:px-4">
        <div className="flex items-center gap-3 px-4 py-2 lg:px-0">
          <Skeleton className="h-11 w-36 rounded-md" />
          <Skeleton className="h-5 w-28" />
        </div>
        <div className="mx-auto max-w-2xl space-y-3 px-4 pt-4 lg:px-0">
          <Skeleton className="h-6 w-40" />
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-[10px] border-2 border-border" />
          ))}
        </div>
      </div>
    </LoadingFrame>
  );
}
