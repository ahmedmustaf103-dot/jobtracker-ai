import type { ApplicationStatus } from "@prisma/client";

export type { ApplicationStatus, JobApplication, User } from "@prisma/client";

export const APPLICATION_STATUS_LABELS = {
  WISHLIST: "Wishlist",
  APPLIED: "Applied",
  SCREENING: "Screening",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
} as const;

export const APPLICATION_STATUS_ORDER = [
  "WISHLIST",
  "APPLIED",
  "SCREENING",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
] as const satisfies readonly ApplicationStatus[];
