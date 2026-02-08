"use client";

import { cn } from "@/lib/utils";

function Pulse({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded-md bg-muted", className)} />
  );
}

export function ScopeSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="space-y-3">
        <Pulse className="h-7 w-64" />
        <div className="flex items-center gap-3">
          <Pulse className="h-5 w-20 rounded-full" />
          <Pulse className="h-5 w-32" />
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="flex gap-2 border-b border-border pb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Pulse key={i} className="h-8 w-24" />
        ))}
      </div>

      {/* Content skeleton */}
      <div className="space-y-4">
        <Pulse className="h-5 w-48" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 py-3">
            <Pulse className="h-5 w-5 shrink-0 rounded" />
            <div className="flex-1 space-y-2">
              <Pulse className="h-4 w-full max-w-md" />
              <Pulse className="h-3 w-full max-w-sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
