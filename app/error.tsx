"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-5xl font-bold text-muted-foreground/20">Error</p>
      <h1 className="mt-4 text-xl font-semibold">Something went wrong</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        An unexpected error occurred. Please try again.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Button onClick={reset}>Try Again</Button>
        <Button variant="ghost" asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
}
