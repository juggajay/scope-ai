"use client";

import { cn } from "@/lib/utils";

function Pulse({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded-md bg-muted", className)} />
  );
}

export function AccountDashboardSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg border border-border p-5 space-y-3"
        >
          <div className="flex items-center gap-3">
            <Pulse className="h-5 w-5 rounded" />
            <Pulse className="h-5 w-32" />
          </div>
          <Pulse className="h-4 w-48" />
          <div className="flex items-center gap-2">
            <Pulse className="h-5 w-16 rounded-full" />
            <Pulse className="h-5 w-20 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
