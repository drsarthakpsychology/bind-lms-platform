export default function Loading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-7 w-48 rounded-lg bg-secondary" />
      <div className="h-8 w-40 rounded-lg bg-secondary" />
      <div className="space-y-3">
        <div className="h-24 rounded-xl bg-secondary" />
        <div className="h-24 rounded-xl bg-secondary" />
        <div className="h-24 rounded-xl bg-secondary" />
      </div>
    </div>
  );
}
