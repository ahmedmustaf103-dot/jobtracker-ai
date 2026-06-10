import type { Metadata } from "next";

import { ChangePasswordForm } from "@/components/settings/change-password-form";
import { ProfileForm } from "@/components/settings/profile-form";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const session = await getSession();
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, passwordHash: true, createdAt: true },
  });

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Settings"
        description="Manage your account and security."
      />

      <div className="grid max-w-4xl gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Member since{" "}
              {new Intl.DateTimeFormat("en-US", {
                month: "long",
                year: "numeric",
              }).format(user.createdAt)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm defaultName={user.name ?? ""} email={user.email} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              {user.passwordHash
                ? "Update the password you use to sign in."
                : "Your account does not use a password."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {user.passwordHash ? (
              <ChangePasswordForm />
            ) : (
              <p className="text-sm text-zinc-500">
                You signed up with an external provider, so there is no
                password to change here.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
