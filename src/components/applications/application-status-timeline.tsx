import type { ApplicationEvent } from "@prisma/client";
import {
  ArrowRight,
  CircleDot,
  MessageSquare,
  PlusCircle,
} from "lucide-react";

import { StatusBadge } from "@/components/applications/status-badge";
import { Panel } from "@/components/ui/panel";
import { formatDateTime } from "@/lib/utils";
import { APPLICATION_STATUS_LABELS } from "@/types";

type ApplicationStatusTimelineProps = {
  events: ApplicationEvent[];
};

function eventLabel(event: ApplicationEvent): string {
  switch (event.type) {
    case "CREATED":
      return event.toStatus
        ? `Application created as ${APPLICATION_STATUS_LABELS[event.toStatus]}`
        : "Application created";
    case "STATUS_CHANGED":
      if (event.fromStatus && event.toStatus) {
        return `Status updated`;
      }
      return "Status updated";
    case "NOTE":
      return event.note ?? "Note added";
    default:
      return "Activity";
  }
}

function EventIcon({ type }: { type: ApplicationEvent["type"] }) {
  switch (type) {
    case "CREATED":
      return <PlusCircle className="h-4 w-4 text-emerald-300" aria-hidden="true" />;
    case "STATUS_CHANGED":
      return <CircleDot className="h-4 w-4 text-violet-300" aria-hidden="true" />;
    case "NOTE":
      return (
        <MessageSquare className="h-4 w-4 text-sky-300" aria-hidden="true" />
      );
    default:
      return null;
  }
}

export function ApplicationStatusTimeline({
  events,
}: ApplicationStatusTimelineProps) {
  if (events.length === 0) {
    return (
      <Panel padding="sm" className="text-sm text-zinc-500">
        No activity yet. Change the status or add a note to start building a
        timeline.
      </Panel>
    );
  }

  return (
    <ol className="space-y-0">
      {events.map((event, index) => (
        <li key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
          {index < events.length - 1 ? (
            <span
              aria-hidden="true"
              className="absolute left-[15px] top-8 h-[calc(100%-1rem)] w-px bg-white/10"
            />
          ) : null}

          <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-surface">
            <EventIcon type={event.type} />
          </span>

          <div className="min-w-0 flex-1 pt-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium text-zinc-100">
                {event.type === "NOTE" ? "Note added" : eventLabel(event)}
              </p>
              <time
                dateTime={event.createdAt.toISOString()}
                className="text-xs text-zinc-500"
              >
                {formatDateTime(event.createdAt)}
              </time>
            </div>

            {event.type === "STATUS_CHANGED" &&
            event.fromStatus &&
            event.toStatus ? (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <StatusBadge status={event.fromStatus} />
                <ArrowRight
                  className="h-3.5 w-3.5 text-zinc-500"
                  aria-hidden="true"
                />
                <StatusBadge status={event.toStatus} />
              </div>
            ) : null}

            {event.type === "NOTE" && event.note ? (
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-zinc-400">
                {event.note}
              </p>
            ) : null}

            {event.type === "CREATED" && event.toStatus ? (
              <div className="mt-2">
                <StatusBadge status={event.toStatus} />
              </div>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
