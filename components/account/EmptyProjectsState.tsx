"use client";

import Link from "next/link";
import { FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyProjectsState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <FolderOpen className="h-12 w-12 text-muted-foreground/40" />
      <h2 className="mt-4 text-lg font-semibold">No projects yet</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Start your first renovation scope — it takes under 10 minutes.
      </p>
      <Button asChild className="mt-6">
        <Link href="/create">Start Your First Scope</Link>
      </Button>
    </div>
  );
}
