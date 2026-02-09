"use client";

import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useScopeDownload } from "@/hooks/useScopeDownload";
import { ScopeHeader } from "./ScopeHeader";
import { ScopeTabs } from "./ScopeTabs";
import { TradeScope } from "./TradeScope";
import { SequencingPlan } from "./SequencingPlan";
import { CoordinationChecklist } from "./CoordinationChecklist";
import { EmailDialog } from "./EmailDialog";
import type { ScopeItem, PCSum, SequencingPhase, CoordinationItem } from "@/types";

interface ScopeData {
  _id: string;
  tradeType: string;
  title: string;
  sortOrder: number;
  items: ScopeItem[];
  exclusions: string[];
  pcSums?: PCSum[];
  complianceNotes?: string;
  warnings?: string[];
  notes?: string;
  diyOption?: string;
}

interface ScopeViewShellProps {
  projectId: string;
  projectType: string;
  mode: string;
  suburb?: string;
  state?: string;
  generatedAt?: number;
  scopes: ScopeData[];
  sequencing: {
    phases: SequencingPhase[];
    totalDurationEstimate: string;
  } | null;
  coordination: {
    items: CoordinationItem[];
  } | null;
}

export function ScopeViewShell({
  projectId,
  projectType,
  mode,
  suburb,
  state,
  generatedAt,
  scopes,
  sequencing,
  coordination,
}: ScopeViewShellProps) {
  const tradeTypes = useMemo(
    () => scopes.map((s) => s.tradeType),
    [scopes]
  );

  const [activeTab, setActiveTab] = useState(tradeTypes[0] ?? "");
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);

  const { downloading, downloadFullPdf, downloadTradePdf, downloadZip } =
    useScopeDownload();

  const documentProps = useMemo(
    () => ({
      projectType,
      suburb,
      state,
      generatedAt,
      scopes: scopes.map((s) => ({
        tradeType: s.tradeType,
        title: s.title,
        items: s.items,
        exclusions: s.exclusions,
        pcSums: s.pcSums,
        complianceNotes: s.complianceNotes,
        warnings: s.warnings,
        notes: s.notes,
      })),
      sequencing,
      coordination,
    }),
    [projectType, suburb, state, generatedAt, scopes, sequencing, coordination]
  );

  // --- Toggle item included/excluded ---
  const updateItem = useMutation(
    api.scopes.updateScopeItem
  ).withOptimisticUpdate((localStore, { scopeId, itemIndex, included }) => {
    const current = localStore.getQuery(api.scopes.getScopes, {
      projectId: projectId as Id<"projects">,
    });
    if (current?.scopes) {
      const updated = (current.scopes as ScopeData[]).map((s) => {
        if (s._id === scopeId) {
          const items = [...s.items];
          items[itemIndex] = { ...items[itemIndex], included };
          return { ...s, items };
        }
        return s;
      });
      localStore.setQuery(
        api.scopes.getScopes,
        { projectId: projectId as Id<"projects"> },
        { ...current, scopes: updated } as any
      );
    }
  });

  // --- Edit item text ---
  const editItem = useMutation(
    api.scopes.editScopeItem
  ).withOptimisticUpdate((localStore, { scopeId, itemIndex, item, specification }) => {
    const current = localStore.getQuery(api.scopes.getScopes, {
      projectId: projectId as Id<"projects">,
    });
    if (current?.scopes) {
      const updated = (current.scopes as ScopeData[]).map((s) => {
        if (s._id === scopeId) {
          const items = [...s.items];
          items[itemIndex] = { ...items[itemIndex], item, specification, isEdited: true };
          return { ...s, items };
        }
        return s;
      });
      localStore.setQuery(
        api.scopes.getScopes,
        { projectId: projectId as Id<"projects"> },
        { ...current, scopes: updated } as any
      );
    }
  });

  // --- Add custom item ---
  const addCustomItem = useMutation(
    api.scopes.addCustomScopeItem
  ).withOptimisticUpdate((localStore, { scopeId, category, item, specification }) => {
    const current = localStore.getQuery(api.scopes.getScopes, {
      projectId: projectId as Id<"projects">,
    });
    if (current?.scopes) {
      const newItem: ScopeItem = {
        id: `custom-optimistic-${Date.now()}`,
        category,
        item,
        specification,
        included: true,
        isCustom: true,
      };
      const updated = (current.scopes as ScopeData[]).map((s) => {
        if (s._id === scopeId) {
          return { ...s, items: [...s.items, newItem] };
        }
        return s;
      });
      localStore.setQuery(
        api.scopes.getScopes,
        { projectId: projectId as Id<"projects"> },
        { ...current, scopes: updated } as any
      );
    }
  });

  // --- Delete custom item ---
  const deleteCustomItem = useMutation(
    api.scopes.deleteCustomScopeItem
  ).withOptimisticUpdate((localStore, { scopeId, itemIndex }) => {
    const current = localStore.getQuery(api.scopes.getScopes, {
      projectId: projectId as Id<"projects">,
    });
    if (current?.scopes) {
      const updated = (current.scopes as ScopeData[]).map((s) => {
        if (s._id === scopeId) {
          const items = [...s.items];
          items.splice(itemIndex, 1);
          return { ...s, items };
        }
        return s;
      });
      localStore.setQuery(
        api.scopes.getScopes,
        { projectId: projectId as Id<"projects"> },
        { ...current, scopes: updated } as any
      );
    }
  });

  const handleToggle = (scopeId: string, itemIndex: number, included: boolean) => {
    updateItem({
      scopeId: scopeId as Id<"scopes">,
      itemIndex,
      included,
    });
  };

  const handleEdit = (scopeId: string, itemIndex: number, item: string, specification: string) => {
    editItem({
      scopeId: scopeId as Id<"scopes">,
      itemIndex,
      item,
      specification,
    });
  };

  const handleAddItem = (scopeId: string, category: string, item: string, specification: string) => {
    addCustomItem({
      scopeId: scopeId as Id<"scopes">,
      category,
      item,
      specification,
    });
  };

  const handleDelete = (scopeId: string, itemIndex: number) => {
    deleteCustomItem({
      scopeId: scopeId as Id<"scopes">,
      itemIndex,
    });
  };

  const activeScope = scopes.find((s) => s.tradeType === activeTab);
  const hasScopes = scopes.length > 0;

  return (
    <div className="space-y-6">
      <ScopeHeader
        projectType={projectType}
        mode={mode}
        suburb={suburb}
        state={state}
        tradeCount={scopes.length}
        generatedAt={generatedAt}
        onDownloadPdf={() => downloadFullPdf(documentProps)}
        onDownloadZip={() => downloadZip(documentProps)}
        onEmailClick={() => setEmailDialogOpen(true)}
        downloading={downloading}
        disabled={!hasScopes}
      />

      <ScopeTabs
        tradeTypes={tradeTypes}
        hasSequencing={!!sequencing}
        hasCoordination={!!coordination}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {activeTab === "sequencing" && sequencing ? (
            <SequencingPlan
              phases={sequencing.phases}
              totalDuration={sequencing.totalDurationEstimate}
            />
          ) : activeTab === "coordination" && coordination ? (
            <CoordinationChecklist items={coordination.items} />
          ) : activeScope ? (
            <TradeScope
              scope={activeScope}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onAddItem={handleAddItem}
              onDelete={handleDelete}
              onDownloadTrade={(tradeType) =>
                downloadTradePdf(documentProps, tradeType)
              }
              isDownloading={downloading === activeScope.tradeType}
            />
          ) : null}
        </motion.div>
      </AnimatePresence>

      <EmailDialog
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        projectId={projectId}
        documentProps={documentProps}
      />
    </div>
  );
}
