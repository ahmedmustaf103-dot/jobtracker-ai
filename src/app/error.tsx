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
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0A0A0A] px-6 text-center text-zinc-100">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-50">
        Something went wrong
      </h1>
      <p className="mt-3 max-w-md text-zinc-400">
        An unexpected error occurred. Try again, and if the problem persists,
        check the server logs.
      </p>
      <Button onClick={reset} className="mt-8">
        Try again
      </Button>
    </div>
  );
}
