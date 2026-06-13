import { Briefcase, Layers, Star, Trophy } from "lucide-react";

import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_ORDER } from "@/types";
import type { ApplicationStats } from "@/server/services/applications.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StatsCardsProps = {
  stats: ApplicationStats;
};

export function StatsCards({ stats }: StatsCardsProps) {
  const activePipeline = ["APPLIED", "SCREENING", "INTERVIEW", "OFFER"] as const;
  const pipelineCount = activePipeline.reduce(
    (sum, status) => sum + stats.byStatus[status],
    0,
  );

  const tiles = [
    {
      label: "Total tracked",
      value: stats.total,
      icon: Briefcase,
      tint: "text-violet-300",
      ring: "bg-violet-500/15",
    },
    {
      label: "In pipeline",
      value: pipelineCount,
      icon: Layers,
      tint: "text-sky-300",
      ring: "bg-sky-500/15",
    },
    {
      label: "Offers",
      value: stats.byStatus.OFFER,
      icon: Trophy,
      tint: "text-emerald-300",
      ring: "bg-emerald-500/15",
    },
    {
      label: "Wishlist",
      value: stats.byStatus.WISHLIST,
      icon: Star,
      tint: "text-amber-300",
      ring: "bg-amber-500/15",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {tiles.map(({ label, value, icon: Icon, tint, ring }) => (
        <Card key={label} className="transition-colors hover:border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              {label}
            </CardTitle>
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${ring}`}
            >
              <Icon className={`h-4 w-4 ${tint}`} />
            </span>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-zinc-50">{value}</p>
          </CardContent>
        </Card>
      ))}

      <Card className="sm:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-base text-zinc-100">
            Pipeline breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {APPLICATION_STATUS_ORDER.map((status) => (
              <div
                key={status}
                className="flex min-w-[120px] flex-1 flex-col rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2"
              >
                <span className="text-xs text-zinc-500">
                  {APPLICATION_STATUS_LABELS[status]}
                </span>
                <span className="text-lg font-semibold text-zinc-100">
                  {stats.byStatus[status]}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
