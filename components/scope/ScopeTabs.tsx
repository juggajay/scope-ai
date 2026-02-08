"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TRADE_META } from "@/lib/trades";
import type { TradeType } from "@/types";

interface ScopeTabsProps {
  tradeTypes: string[];
  hasSequencing: boolean;
  hasCoordination: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function ScopeTabs({
  tradeTypes,
  hasSequencing,
  hasCoordination,
  activeTab,
  onTabChange,
}: ScopeTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <div className="relative">
        {/* Gradient fade on right edge for scroll hint */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-l from-background to-transparent md:hidden" />

        <TabsList
          variant="line"
          className="w-full justify-start overflow-x-auto scrollbar-none"
        >
          {tradeTypes.map((tt) => {
            const meta = TRADE_META[tt as TradeType];
            if (!meta) return null;
            return (
              <TabsTrigger
                key={tt}
                value={tt}
                className="shrink-0 gap-1.5"
              >
                <span className="text-sm" role="img" aria-hidden>
                  {meta.icon}
                </span>
                <span className="hidden sm:inline">{meta.title.split(" ")[0]}</span>
                <span className="sm:hidden">{meta.title.split(" ")[0].slice(0, 5)}</span>
              </TabsTrigger>
            );
          })}

          {hasSequencing && (
            <TabsTrigger value="sequencing" className="shrink-0 gap-1.5">
              <span className="text-sm" role="img" aria-hidden>
                📋
              </span>
              <span>Sequencing</span>
            </TabsTrigger>
          )}

          {hasCoordination && (
            <TabsTrigger value="coordination" className="shrink-0 gap-1.5">
              <span className="text-sm" role="img" aria-hidden>
                🔗
              </span>
              <span>Checklist</span>
            </TabsTrigger>
          )}
        </TabsList>
      </div>
    </Tabs>
  );
}
