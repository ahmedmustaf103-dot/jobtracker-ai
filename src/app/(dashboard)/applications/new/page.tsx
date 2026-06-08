import type { Metadata } from "next";
import Link from "next/link";

import { ApplicationForm } from "@/components/applications/application-form";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createApplicationAction } from "@/server/actions/application.actions";

export const metadata: Metadata = {
  title: "Add application",
};

export default function NewApplicationPage() {
  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Add application"
        description="Track a new role in your pipeline."
      >
        <Button asChild variant="outline" size="sm">
          <Link href="/applications">Cancel</Link>
        </Button>
      </DashboardHeader>
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <ApplicationForm
            action={createApplicationAction}
            submitLabel="Add application"
          />
        </CardContent>
      </Card>
    </div>
  );
}
