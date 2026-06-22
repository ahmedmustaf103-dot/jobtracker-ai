"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center text-zinc-100">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-50">
        Something went wrong
      </h1>
      <p className="mt-3 max-w-md text-zinc-400">
        We hit an unexpected error. Try again — if it keeps happening, refresh
        the page or come back shortly.
      </p>
      {error.digest ? (
        <p className="mt-2 font-mono text-xs text-zinc-600">
          Reference: {error.digest}
        </p>
      ) : null}
      <Button onClick={reset} className="mt-8">
        Try again
      </Button>
    </div>
  );
}
