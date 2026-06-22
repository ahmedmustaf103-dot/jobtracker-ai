export const siteConfig = {
  name: "JobTracker AI",
  description:
    "Track job applications, interview stages, and offers in one place.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  github: "https://github.com/ahmedmustaf103-dot/jobtracker-ai",
  pricing: {
    currency: "£",
    amount: 20,
    interval: "month",
    trialDays: 14,
  },
  supportEmail: "support@jobtracker.ai",
} as const;
