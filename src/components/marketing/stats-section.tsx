const stats = [
  { value: "12,000+", label: "Applications Tracked" },
  { value: "3,200+", label: "Interviews Scheduled" },
  { value: "800+", label: "Offers Managed" },
];

export function StatsSection() {
  return (
    <section className="relative py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-600/[0.12] via-white/[0.02] to-fuchsia-600/[0.1] p-10 sm:p-14">
          <div className="pointer-events-none absolute -left-20 top-0 h-60 w-60 rounded-full bg-violet-600/20 blur-[100px]" />
          <div className="pointer-events-none absolute -right-20 bottom-0 h-60 w-60 rounded-full bg-fuchsia-600/20 blur-[100px]" />
          <div className="relative grid gap-10 sm:grid-cols-3">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
                  {value}
                </p>
                <p className="mt-2 text-sm font-medium text-zinc-400">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
