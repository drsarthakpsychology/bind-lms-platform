import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-64" />
      </div>
      <Skeleton className="h-20 rounded-lg border-2 border-foreground" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, w) => (
          <div key={w} className="rounded-md border-2 border-border p-4">
            <Skeleton className="h-4 w-32" />
            <div className="mt-4 space-y-3">
              {Array.from({ length: 2 }).map((_, l) => (
                <Skeleton key={l} className="h-12 rounded-md border-2 border-border/60" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
