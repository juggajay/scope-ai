"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/account/ProjectCard";
import { AccountDashboardSkeleton } from "@/components/account/AccountDashboardSkeleton";
import { EmptyProjectsState } from "@/components/account/EmptyProjectsState";

export default function AccountPage() {
  const projects = useQuery(api.projects.getProjectsByUser);

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Your Projects
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/account/settings">
              <Settings className="mr-1.5 h-4 w-4" />
              Settings
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/create">
              <Plus className="mr-1.5 h-4 w-4" />
              New Scope
            </Link>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="mt-8">
        {projects === undefined ? (
          <AccountDashboardSkeleton />
        ) : projects.length === 0 ? (
          <EmptyProjectsState />
        ) : (
          <div className="space-y-3">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project as any} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
