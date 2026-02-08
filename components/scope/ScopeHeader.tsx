"use client";

import { Download, Mail, FileText, Archive, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ScopeHeaderProps {
  projectType: string;
  mode: string;
  suburb?: string;
  state?: string;
  tradeCount: number;
  generatedAt?: number;
  onDownloadPdf?: () => void;
  onDownloadZip?: () => void;
  onEmailClick?: () => void;
  downloading?: string | null;
  disabled?: boolean;
}

export function ScopeHeader({
  projectType,
  mode,
  suburb,
  state,
  tradeCount,
  generatedAt,
  onDownloadPdf,
  onDownloadZip,
  onEmailClick,
  downloading,
  disabled,
}: ScopeHeaderProps) {
  const label = projectType.charAt(0).toUpperCase() + projectType.slice(1);
  const location = [suburb, state].filter(Boolean).join(", ");
  const isDownloading = !!downloading;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {label} Renovation Scope
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline" className="capitalize">
              {mode === "trades" ? "Trade Manager" : "Builder Managed"}
            </Badge>
            {location && <span>{location}</span>}
            <span>&middot;</span>
            <span>
              {tradeCount} trade{tradeCount !== 1 ? "s" : ""}
            </span>
            {generatedAt && (
              <>
                <span>&middot;</span>
                <span>
                  {new Date(generatedAt).toLocaleDateString("en-AU", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={disabled || isDownloading}
              >
                {isDownloading && (downloading === "full-pdf" || downloading === "zip") ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-1.5 h-4 w-4" />
                )}
                Download
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onDownloadPdf} disabled={isDownloading}>
                <FileText className="mr-2 h-4 w-4" />
                Full Package (PDF)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDownloadZip} disabled={isDownloading}>
                <Archive className="mr-2 h-4 w-4" />
                All Scopes (ZIP)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            disabled={disabled || isDownloading}
            onClick={onEmailClick}
          >
            <Mail className="mr-1.5 h-4 w-4" />
            Email
          </Button>
        </div>
      </div>
    </div>
  );
}
