import { siteConfig } from "@/config/site";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <p className="mb-3 text-sm font-medium text-indigo-600 dark:text-indigo-400">
        Day 1 — Project initialized
      </p>
      <h1 className="max-w-xl text-4xl font-bold tracking-tight sm:text-5xl">
        {siteConfig.name}
      </h1>
      <p className="mt-4 max-w-lg text-lg text-zinc-600 dark:text-zinc-400">
        {siteConfig.description}
      </p>
      <p className="mt-8 text-sm text-zinc-500">
        Auth, database, and dashboard ship in upcoming daily commits.
      </p>
    </div>
  );
}
