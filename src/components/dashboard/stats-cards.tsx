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

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-zinc-500">
            Total tracked
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">{stats.total}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-zinc-500">
            In pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">{pipelineCount}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-zinc-500">
            Offers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">{stats.byStatus.OFFER}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-zinc-500">
            Wishlist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">{stats.byStatus.WISHLIST}</p>
        </CardContent>
      </Card>

      <Card className="sm:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-base">Pipeline breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {APPLICATION_STATUS_ORDER.map((status) => (
              <div
                key={status}
                className="flex min-w-[120px] flex-1 flex-col rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <span className="text-xs text-zinc-500">
                  {APPLICATION_STATUS_LABELS[status]}
                </span>
                <span className="text-lg font-semibold">
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
