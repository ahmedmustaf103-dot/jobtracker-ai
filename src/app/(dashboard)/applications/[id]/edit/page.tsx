import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ApplicationForm } from "@/components/applications/application-form";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getSession } from "@/lib/auth/session";
import { updateApplicationAction } from "@/server/actions/application.actions";
import { getApplicationById } from "@/server/services/applications.service";

type EditApplicationPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: EditApplicationPageProps): Promise<Metadata> {
  const { id } = await params;
  return { title: `Edit application ${id.slice(0, 8)}…` };
}

export default async function EditApplicationPage({
  params,
}: EditApplicationPageProps) {
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) return null;

  const { id } = await params;
  const application = await getApplicationById(userId, id);
  if (!application) notFound();

  const updateAction = updateApplicationAction.bind(null, id);

  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Edit application"
        description={`${application.title} at ${application.company}`}
      >
        <Button asChild variant="outline" size="sm">
          <Link href="/applications">Cancel</Link>
        </Button>
      </DashboardHeader>
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <ApplicationForm
            action={updateAction}
            submitLabel="Save changes"
            defaultValues={{
              company: application.company,
              title: application.title,
              location: application.location,
              url: application.url,
              status: application.status,
              salary: application.salary,
              notes: application.notes,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
