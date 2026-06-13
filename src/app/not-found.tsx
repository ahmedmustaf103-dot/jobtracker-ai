import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0A0A0A] px-6 text-center text-zinc-100">
      <p className="text-sm font-medium text-violet-400">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-50">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-zinc-400">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
