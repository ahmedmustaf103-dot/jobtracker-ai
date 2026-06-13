export default function DashboardLoading() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading">
      <div className="space-y-2 border-b border-white/[0.08] pb-6">
        <div className="h-7 w-48 animate-pulse rounded-md bg-white/10" />
        <div className="h-4 w-72 animate-pulse rounded-md bg-white/5" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-xl border border-white/10 bg-white/5"
          />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-xl border border-white/10 bg-white/5" />
    </div>
  );
}
