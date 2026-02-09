import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get all scopes for a project — PAYWALL LOGIC:
// If project is paid → return full scope data
// If not paid → return summary only (trade name, item count, 1 sample item)
export const getScopes = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const project = await ctx.db.get(args.projectId);
    if (!project) return null;
    if (userId && project.userId !== userId) return null;

    const scopes = await ctx.db
      .query("scopes")
      .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
      .collect();

    // Sort by sortOrder
    scopes.sort((a, b) => a.sortOrder - b.sortOrder);

    if (project.status === "paid") {
      return { paid: true, scopes };
    }

    // Summary-only for unpaid projects
    return {
      paid: false,
      scopes: scopes.map((scope) => ({
        _id: scope._id,
        tradeType: scope.tradeType,
        title: scope.title,
        sortOrder: scope.sortOrder,
        itemCount: Array.isArray(scope.items) ? scope.items.length : 0,
        sampleItems: Array.isArray(scope.items) ? scope.items.slice(0, 1) : [],
      })),
    };
  },
});

// Get a single scope — full data (paid projects only)
export const getScope = query({
  args: {
    projectId: v.id("projects"),
    tradeType: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const project = await ctx.db.get(args.projectId);
    if (!project || project.status !== "paid") return null;
    if (userId && project.userId !== userId) return null;

    const scope = await ctx.db
      .query("scopes")
      .withIndex("by_projectId_tradeType", (q) =>
        q.eq("projectId", args.projectId).eq("tradeType", args.tradeType)
      )
      .first();

    return scope;
  },
});

// Toggle a scope item's included/excluded state (by index)
export const updateScopeItem = mutation({
  args: {
    scopeId: v.id("scopes"),
    itemIndex: v.number(),
    included: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return;

    const scope = await ctx.db.get(args.scopeId);
    if (!scope) return;

    const project = await ctx.db.get(scope.projectId);
    if (!project || project.userId !== userId) return;

    const items = Array.isArray(scope.items) ? [...scope.items] : [];
    if (args.itemIndex >= 0 && args.itemIndex < items.length) {
      items[args.itemIndex] = { ...items[args.itemIndex], included: args.included };
      await ctx.db.patch(args.scopeId, { items });
    }
  },
});

// Get sequencing plan (paid projects only)
export const getSequencingPlan = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const project = await ctx.db.get(args.projectId);
    if (!project || project.status !== "paid") return null;
    if (userId && project.userId !== userId) return null;

    return await ctx.db
      .query("sequencingPlans")
      .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
      .first();
  },
});

// Get coordination checklist (paid projects only)
export const getCoordinationChecklist = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const project = await ctx.db.get(args.projectId);
    if (!project || project.status !== "paid") return null;
    if (userId && project.userId !== userId) return null;

    return await ctx.db
      .query("coordinationChecklists")
      .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
      .first();
  },
});

// Edit a scope item's name and/or specification
export const editScopeItem = mutation({
  args: {
    scopeId: v.id("scopes"),
    itemIndex: v.number(),
    item: v.string(),
    specification: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return;

    const scope = await ctx.db.get(args.scopeId);
    if (!scope) return;

    const project = await ctx.db.get(scope.projectId);
    if (!project || project.userId !== userId) return;

    const items = Array.isArray(scope.items) ? [...scope.items] : [];
    if (args.itemIndex >= 0 && args.itemIndex < items.length) {
      items[args.itemIndex] = {
        ...items[args.itemIndex],
        item: args.item,
        specification: args.specification,
        isEdited: true,
      };
      await ctx.db.patch(args.scopeId, { items });
    }
  },
});

// Add a custom scope item to a trade scope
export const addCustomScopeItem = mutation({
  args: {
    scopeId: v.id("scopes"),
    category: v.string(),
    item: v.string(),
    specification: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return;

    const scope = await ctx.db.get(args.scopeId);
    if (!scope) return;

    const project = await ctx.db.get(scope.projectId);
    if (!project || project.userId !== userId) return;

    const items = Array.isArray(scope.items) ? [...scope.items] : [];
    const newItem = {
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      category: args.category,
      item: args.item,
      specification: args.specification,
      included: true,
      isCustom: true,
    };
    items.push(newItem);
    await ctx.db.patch(args.scopeId, { items });
  },
});

// Delete a custom scope item (server guards isCustom === true)
export const deleteCustomScopeItem = mutation({
  args: {
    scopeId: v.id("scopes"),
    itemIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return;

    const scope = await ctx.db.get(args.scopeId);
    if (!scope) return;

    const project = await ctx.db.get(scope.projectId);
    if (!project || project.userId !== userId) return;

    const items = Array.isArray(scope.items) ? [...scope.items] : [];
    if (
      args.itemIndex >= 0 &&
      args.itemIndex < items.length &&
      items[args.itemIndex].isCustom === true
    ) {
      items.splice(args.itemIndex, 1);
      await ctx.db.patch(args.scopeId, { items });
    }
  },
});

// =============================================================================
// Internal mutations — for AI actions
// =============================================================================

// Save a generated scope document
export const saveScopeInternal = internalMutation({
  args: {
    projectId: v.id("projects"),
    tradeType: v.string(),
    title: v.string(),
    items: v.any(),
    exclusions: v.any(),
    pcSums: v.optional(v.any()),
    complianceNotes: v.optional(v.string()),
    notes: v.optional(v.any()),
    warnings: v.optional(v.any()),
    diyOption: v.optional(v.string()),
    sortOrder: v.number(),
  },
  handler: async (ctx, args) => {
    // Normalize notes: if AI returns array of objects, join into a string
    let notes = args.notes;
    if (Array.isArray(notes)) {
      notes = notes.map((n: { text?: string }) => typeof n === "string" ? n : n.text ?? JSON.stringify(n)).join("\n\n");
    }
    return await ctx.db.insert("scopes", { ...args, notes: notes as string | undefined });
  },
});

// Delete a scope by trade type (for retry)
export const deleteScopeByTradeInternal = internalMutation({
  args: {
    projectId: v.id("projects"),
    tradeType: v.string(),
  },
  handler: async (ctx, args) => {
    const scope = await ctx.db
      .query("scopes")
      .withIndex("by_projectId_tradeType", (q) =>
        q.eq("projectId", args.projectId).eq("tradeType", args.tradeType)
      )
      .first();
    if (scope) {
      await ctx.db.delete(scope._id);
    }
  },
});

// Save sequencing plan
export const saveSequencingPlanInternal = internalMutation({
  args: {
    projectId: v.id("projects"),
    phases: v.any(),
    totalDurationEstimate: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("sequencingPlans", args);
  },
});

// Save coordination checklist
export const saveCoordinationChecklistInternal = internalMutation({
  args: {
    projectId: v.id("projects"),
    items: v.any(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("coordinationChecklists", args);
  },
});
