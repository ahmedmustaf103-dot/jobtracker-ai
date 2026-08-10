export type CapabilityUser = {
  userId: string;
  candidateName: string;
  email: string;
};

export type CapabilityResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };
