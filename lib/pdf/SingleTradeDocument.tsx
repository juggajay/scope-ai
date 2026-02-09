import React from "react";
import { Document, Page, View, Text } from "@react-pdf/renderer";
import { styles, TEAL, MUTED, BORDER, BG_ALT } from "./styles";
import type { ScopeItem, PCSum, TradeType } from "@/types";
import { TRADE_META } from "@/lib/trades";

interface SingleTradeDocumentProps {
  projectType: string;
  suburb?: string;
  state?: string;
  generatedAt?: number;
  tradeType: string;
  title: string;
  items: ScopeItem[];
  exclusions: string[];
  pcSums?: PCSum[];
  complianceNotes?: string;
  warnings?: string[];
  notes?: string;
}

export function SingleTradeDocument({
  projectType,
  suburb,
  state,
  generatedAt,
  tradeType,
  title,
  items,
  exclusions,
  pcSums,
  complianceNotes,
  warnings,
  notes,
}: SingleTradeDocumentProps) {
  const label = projectType.charAt(0).toUpperCase() + projectType.slice(1);
  const location = [suburb, state].filter(Boolean).join(", ");
  const date = generatedAt
    ? new Date(generatedAt).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })
    : new Date().toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });

  const meta = TRADE_META[tradeType as TradeType];
  const includedItems = items.filter((it) => it.included);
  const excludedCount = items.length - includedItems.length;

  // Group by category
  const groups = new Map<string, ScopeItem[]>();
  includedItems.forEach((item) => {
    const cat = item.category || "General";
    if (!groups.has(cat)) groups.set(cat, []);
    groups.get(cat)!.push(item);
  });

  return (
    <Document title={`${title} — ${label} Renovation`} author="ScopeAI">
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerBar} fixed />
        <View style={styles.headerRow} fixed>
          <Text style={styles.headerBrand}>ScopeAI</Text>
          <View>
            <Text style={styles.headerMeta}>{label} Renovation</Text>
            {location && <Text style={styles.headerMeta}>{location}</Text>}
            <Text style={styles.headerMeta}>{date}</Text>
          </View>
        </View>

        <Text style={styles.pageTitle}>
          {meta?.icon ?? ""} {title}
        </Text>
        <Text style={styles.pageSubtitle}>
          {includedItems.length} item{includedItems.length !== 1 ? "s" : ""} included
          {excludedCount > 0 && ` · ${excludedCount} excluded`}
        </Text>

        {/* Scope items by category */}
        {Array.from(groups.entries()).map(([category, catItems]) => (
          <View key={category}>
            <Text style={styles.categoryTitle}>{category}</Text>
            {catItems.map((item, i) => (
              <View
                key={item.id}
                style={[styles.itemRow, i % 2 === 1 ? styles.itemRowAlt : {}]}
              >
                <Text style={styles.itemBullet}>•</Text>
                <View style={styles.itemContent}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={[styles.itemName, { flex: 1 }]}>{item.item}</Text>
                    {item.isCustom && (
                      <View style={styles.customBadge}>
                        <Text style={styles.customBadgeText}>CUSTOM</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.itemSpec}>{item.specification}</Text>
                  {item.complianceNote && (
                    <Text style={styles.itemCompliance}>{item.complianceNote}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        ))}

        {excludedCount > 0 && (
          <Text style={styles.excludedNote}>
            {excludedCount} item{excludedCount !== 1 ? "s" : ""} excluded by homeowner and not shown
          </Text>
        )}

        {/* Exclusions */}
        {exclusions.length > 0 && (
          <View style={{ marginTop: 10 }}>
            <Text style={styles.sectionTitle}>Exclusions</Text>
            {exclusions.map((ex, i) => (
              <View key={i} style={styles.exclusionItem}>
                <Text style={styles.exclusionBullet}>✕</Text>
                <Text style={styles.exclusionText}>{ex}</Text>
              </View>
            ))}
          </View>
        )}

        {/* PC Sums */}
        {pcSums && pcSums.length > 0 && (
          <View style={{ marginTop: 10 }}>
            <Text style={styles.sectionTitle}>Provisional Cost Sums</Text>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, { flex: 3 }]}>Item</Text>
              <Text style={[styles.tableHeaderText, { flex: 1, textAlign: "center" }]}>Qty</Text>
              <Text style={[styles.tableHeaderText, { flex: 1, textAlign: "right" }]}>Low</Text>
              <Text style={[styles.tableHeaderText, { flex: 1, textAlign: "right" }]}>High</Text>
            </View>
            {pcSums.map((pc, i) => (
              <View key={i} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}>
                <Text style={[styles.tableCell, { flex: 3 }]}>
                  {pc.item} {pc.unit ? `(${pc.unit})` : ""}
                </Text>
                <Text style={[styles.tableCell, { flex: 1, textAlign: "center" }]}>
                  {pc.quantity ?? "-"}
                </Text>
                <Text style={[styles.tableCell, { flex: 1, textAlign: "right" }]}>
                  {pc.budgetLow}
                </Text>
                <Text style={[styles.tableCell, { flex: 1, textAlign: "right" }]}>
                  {pc.budgetHigh}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Warnings */}
        {warnings && warnings.length > 0 && (
          <View style={styles.warningBox} wrap={false}>
            <Text style={styles.warningTitle}>Warnings</Text>
            {warnings.map((w, i) => (
              <Text key={i} style={styles.warningItem}>• {w}</Text>
            ))}
          </View>
        )}

        {/* Compliance */}
        {complianceNotes && (
          <View style={styles.notesBox} wrap={false}>
            <Text style={[styles.notesText, { fontFamily: "Helvetica-Bold", marginBottom: 2 }]}>
              Compliance
            </Text>
            <Text style={styles.notesText}>{complianceNotes}</Text>
          </View>
        )}

        {/* Notes */}
        {notes && (
          <View style={styles.notesBox} wrap={false}>
            <Text style={styles.notesText}>{notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>Generated by ScopeAI — scopeai.com.au</Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
