"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { Select } from "@/components/ui/select";
import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_ORDER,
  type ApplicationStatus,
} from "@/types";
import { updateApplicationStatusAction } from "@/server/actions/application.actions";

type ApplicationStatusSelectProps = {
  id: string;
  status: ApplicationStatus;
};

export function ApplicationStatusSelect({
  id,
  status,
}: ApplicationStatusSelectProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const nextStatus = e.target.value;
    startTransition(async () => {
      await updateApplicationStatusAction(id, nextStatus);
      router.refresh();
    });
  }

  return (
    <Select
      value={status}
      onChange={handleChange}
      disabled={pending}
      className="h-8 min-w-[130px] text-xs"
      aria-label="Update application status"
    >
      {APPLICATION_STATUS_ORDER.map((s) => (
        <option key={s} value={s}>
          {APPLICATION_STATUS_LABELS[s]}
        </option>
      ))}
    </Select>
  );
}
