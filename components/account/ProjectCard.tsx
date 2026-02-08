"use client";

import Link from "next/link";
import { PROJECT_TYPES } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ProjectStatus = "draft" | "generating" | "generated" | "paid";

const STATUS_STYLES: Record<
  ProjectStatus,
  { label: string; className: string }
> = {
  draft: {
    label: "Draft",
    className: "bg-muted text-muted-foreground",
  },
  generating: {
    label: "Generating",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  },
  generated: {
    label: "Ready",
    className: "border-primary text-primary bg-transparent",
  },
  paid: {
    label: "Paid",
    className: "bg-primary text-primary-foreground",
  },
};

interface ProjectCardProps {
  project: {
    _id: string;
    _creationTime: number;
    projectType: string;
    propertySuburb?: string;
    propertyState: string;
    status: ProjectStatus;
    mode: "trades" | "builder";
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const projectType = PROJECT_TYPES.find((pt) => pt.id === project.projectType);
  const status = STATUS_STYLES[project.status] ?? STATUS_STYLES.draft;
  const isClickable = project.status === "paid" || project.status === "generated";

  const date = new Date(project._creationTime).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const location = [project.propertySuburb, project.propertyState]
    .filter(Boolean)
    .join(", ");

  const content = (
    <div
      className={cn(
        "rounded-lg border border-border p-5 transition-all duration-150",
        isClickable
          ? "cursor-pointer hover:border-primary/40 hover:shadow-sm active:scale-[0.99]"
          : "opacity-75"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {projectType && (
              <span className="text-base" aria-hidden>
                {projectType.icon}
              </span>
            )}
            <h3 className="truncate font-medium">
              {projectType?.label ?? project.projectType} Renovation
            </h3>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            {location || "No location set"} &middot; {date}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Badge variant="outline" className="text-xs font-normal">
            {project.mode === "builder" ? "Builder" : "Trade Manager"}
          </Badge>
          <Badge className={cn("text-xs font-normal", status.className)}>
            {status.label}
          </Badge>
        </div>
      </div>
    </div>
  );

  if (isClickable) {
    return <Link href={`/scope/${project._id}`}>{content}</Link>;
  }

  return content;
}
