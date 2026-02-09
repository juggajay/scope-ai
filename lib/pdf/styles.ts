import { StyleSheet } from "@react-pdf/renderer";

// ScopeAI brand colour (teal)
export const TEAL = "#14B8A6";
export const TEAL_LIGHT = "#CCFBF1";
export const DARK = "#111827";
export const MUTED = "#6B7280";
export const BORDER = "#E5E7EB";
export const BG_ALT = "#F9FAFB";
export const WHITE = "#FFFFFF";
export const RED = "#EF4444";
export const AMBER = "#F59E0B";

export const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: DARK,
    paddingTop: 60,
    paddingBottom: 50,
    paddingHorizontal: 40,
  },

  // Header bar
  headerBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: TEAL,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  headerBrand: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: TEAL,
  },
  headerMeta: {
    fontSize: 8,
    color: MUTED,
    textAlign: "right",
  },

  // Page title
  pageTitle: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: DARK,
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 10,
    color: MUTED,
    marginBottom: 20,
  },

  // Section headings
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: DARK,
    marginTop: 16,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  categoryTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: DARK,
    marginTop: 10,
    marginBottom: 4,
  },

  // Scope items
  itemRow: {
    flexDirection: "row",
    paddingVertical: 3,
    paddingHorizontal: 4,
  },
  itemRowAlt: {
    backgroundColor: BG_ALT,
  },
  itemBullet: {
    width: 12,
    fontSize: 8,
    color: TEAL,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },
  itemSpec: {
    fontSize: 8,
    color: MUTED,
    marginTop: 1,
  },
  itemCompliance: {
    fontSize: 7,
    color: TEAL,
    marginTop: 1,
  },

  // Exclusions
  exclusionItem: {
    flexDirection: "row",
    paddingVertical: 2,
  },
  exclusionBullet: {
    width: 12,
    fontSize: 8,
    color: RED,
  },
  exclusionText: {
    flex: 1,
    fontSize: 8,
    color: MUTED,
  },

  // Warnings
  warningBox: {
    backgroundColor: "#FEF3C7",
    borderWidth: 1,
    borderColor: "#FDE68A",
    borderRadius: 4,
    padding: 8,
    marginTop: 8,
  },
  warningTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#92400E",
    marginBottom: 4,
  },
  warningItem: {
    fontSize: 8,
    color: "#92400E",
    marginBottom: 2,
  },

  // PC Sums table
  tableHeader: {
    flexDirection: "row",
    backgroundColor: DARK,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableHeaderText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: WHITE,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  tableRowAlt: {
    backgroundColor: BG_ALT,
  },
  tableCell: {
    fontSize: 8,
  },

  // Notes
  notesBox: {
    backgroundColor: BG_ALT,
    borderRadius: 4,
    padding: 8,
    marginTop: 8,
  },
  notesText: {
    fontSize: 8,
    color: MUTED,
    lineHeight: 1.4,
  },

  // Sequencing
  phaseRow: {
    flexDirection: "row",
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  holdPointBadge: {
    backgroundColor: "#FEE2E2",
    borderRadius: 2,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginLeft: 4,
  },
  holdPointText: {
    fontSize: 7,
    color: RED,
    fontFamily: "Helvetica-Bold",
  },
  customBadge: {
    backgroundColor: TEAL_LIGHT,
    borderRadius: 2,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginLeft: 4,
  },
  customBadgeText: {
    fontSize: 7,
    color: TEAL,
    fontFamily: "Helvetica-Bold",
  },

  // Coordination
  coordRow: {
    flexDirection: "row",
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  criticalDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: RED,
    marginRight: 4,
    marginTop: 2,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7,
    color: MUTED,
  },

  // Excluded note
  excludedNote: {
    fontSize: 8,
    color: MUTED,
    fontStyle: "italic",
    marginTop: 4,
  },
});
