"use client";

interface SectionLabelProps {
  label: string;
}

export function SectionLabel({ label }: SectionLabelProps) {
  return (
    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
      {label}
    </p>
  );
}
