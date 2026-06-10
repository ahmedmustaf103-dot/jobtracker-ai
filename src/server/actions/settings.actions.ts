"use server";

import { revalidatePath } from "next/cache";
import { compare, hash } from "bcryptjs";

import { requireSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import {
  changePasswordSchema,
  updateProfileSchema,
} from "@/validations/auth";

export type SettingsActionState = {
  error?: string;
  success?: string;
};

export async function updateProfileAction(
  _prevState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const session = await requireSession();

  const parsed = updateProfileSchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: parsed.data.name },
  });

  revalidatePath("/dashboard/settings");
  return { success: "Profile updated. Sign in again to refresh your name everywhere." };
}

export async function changePasswordAction(
  _prevState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const session = await requireSession();

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user?.passwordHash) {
    return { error: "Password change is not available for this account" };
  }

  const valid = await compare(parsed.data.currentPassword, user.passwordHash);
  if (!valid) {
    return { error: "Current password is incorrect" };
  }

  const passwordHash = await hash(parsed.data.newPassword, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  return { success: "Password changed successfully." };
}
