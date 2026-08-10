type ApplicationLike = {
  id: string;
  company: string;
  title: string;
  location: string | null;
  url: string | null;
  status: string;
  salary: string | null;
  notes?: string | null;
  appliedAt?: Date | null;
  createdAt?: Date;
  updatedAt: Date;
};

type ApplicationEventLike = {
  id: string;
  type: string;
  fromStatus: string | null;
  toStatus: string | null;
  note: string | null;
  createdAt: Date;
};

export function serializeApplication(app: ApplicationLike) {
  return {
    id: app.id,
    company: app.company,
    title: app.title,
    location: app.location,
    url: app.url,
    status: app.status,
    salary: app.salary,
    notes: app.notes ?? undefined,
    appliedAt: app.appliedAt ? app.appliedAt.toISOString() : null,
    createdAt: app.createdAt ? app.createdAt.toISOString() : undefined,
    updatedAt: app.updatedAt.toISOString(),
  };
}

export function serializeApplicationDetails(
  app: ApplicationLike & { events?: ApplicationEventLike[] },
) {
  return {
    ...serializeApplication(app),
    events: (app.events ?? []).map((event) => ({
      id: event.id,
      type: event.type,
      fromStatus: event.fromStatus,
      toStatus: event.toStatus,
      note: event.note,
      createdAt: event.createdAt.toISOString(),
    })),
  };
}
