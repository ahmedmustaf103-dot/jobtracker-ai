"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireSession } from "@/lib/auth/session";
import {
  createApplication,
  updateApplication,
} from "@/server/services/applications.service";
import { parseApplicationFormData } from "@/validations/application";

export type ApplicationActionState = {
  error?: string;
};

export async function createApplicationAction(
  _prevState: ApplicationActionState,
  formData: FormData,
): Promise<ApplicationActionState> {
  const session = await requireSession();
  const parsed = parseApplicationFormData(formData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await createApplication(session.user.id, parsed.data);
  revalidatePath("/dashboard");
  revalidatePath("/applications");
  redirect("/applications");
}

export async function updateApplicationAction(
  id: string,
  _prevState: ApplicationActionState,
  formData: FormData,
): Promise<ApplicationActionState> {
  const session = await requireSession();
  const parsed = parseApplicationFormData(formData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const updated = await updateApplication(session.user.id, id, parsed.data);
  if (!updated) {
    return { error: "Application not found" };
  }

  revalidatePath("/dashboard");
  revalidatePath("/applications");
  redirect("/applications");
}
