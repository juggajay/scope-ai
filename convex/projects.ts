import { query, mutation, internalQuery, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import type { Id } from "./_generated/dataModel";

// Get the currently authenticated user
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return await ctx.db.get(userId);
  },
});

// Ensure a profile exists for the authenticated user
export const ensureProfile = mutation({
  args: {
    email: v.string(),
    fullName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if profile already exists
    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (existing) return existing._id;

    // Create new profile
    return await ctx.db.insert("profiles", {
      userId,
      email: args.email,
      fullName: args.fullName,
    });
  },
});

// Get a single project by ID (with ownership check)
export const getProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const project = await ctx.db.get(args.projectId);
    if (!project) return null;
    // Only return if the authenticated user owns this project
    if (userId && project.userId !== userId) return null;
    return project;
  },
});

// List all projects for the authenticated user (ordered by creation time desc)
export const getProjectsByUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("projects")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

// Create project from wizard session state + link pre-auth photos by sessionId
export const createProjectFromSession = mutation({
  args: {
    mode: v.union(v.literal("trades"), v.literal("builder")),
    projectType: v.string(),
    propertySuburb: v.optional(v.string()),
    propertyState: v.string(),
    propertyType: v.string(),
    propertyAge: v.optional(v.number()),
    description: v.optional(v.string()),
    answers: v.optional(v.any()),
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const { sessionId, ...projectData } = args;

    // Create the project
    const projectId = await ctx.db.insert("projects", {
      ...projectData,
      userId,
      status: "draft",
    });

    // Link pre-auth photos: find by sessionId, set projectId, clear sessionId
    const photos = await ctx.db
      .query("projectPhotos")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", sessionId))
      .collect();

    for (const photo of photos) {
      await ctx.db.patch(photo._id, {
        projectId,
        sessionId: undefined,
      });
    }

    return projectId;
  },
});

// Partial update of project fields (public — restricted to safe fields)
export const updateProject = mutation({
  args: {
    projectId: v.id("projects"),
    updates: v.object({
      description: v.optional(v.string()),
      answers: v.optional(v.any()),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const project = await ctx.db.get(args.projectId);
    if (!project || project.userId !== userId) throw new Error("Not authorized");

    const patch: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(args.updates)) {
      if (value !== undefined) {
        patch[key] = value;
      }
    }
    if (Object.keys(patch).length > 0) {
      await ctx.db.patch(args.projectId, patch);
    }
  },
});

// Internal: update generation progress (called from AI actions)
export const updateGenerationProgressInternal = internalMutation({
  args: {
    projectId: v.id("projects"),
    total: v.number(),
    completed: v.number(),
    current: v.optional(v.string()),
    failed: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.projectId, {
      generationProgress: {
        total: args.total,
        completed: args.completed,
        current: args.current,
        failed: args.failed,
      },
    });
  },
});

// Mark project as paid + store Stripe data (internal — called by webhook only)
export const markProjectPaidInternal = internalMutation({
  args: {
    projectId: v.id("projects"),
    paymentTier: v.union(
      v.literal("starter"),
      v.literal("professional"),
      v.literal("premium")
    ),
    paymentAmountCents: v.number(),
    stripeSessionId: v.string(),
    stripePaymentId: v.string(),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project) return;
    // Idempotency: Stripe can send duplicate webhook events
    if (project.status === "paid") return;

    await ctx.db.patch(args.projectId, {
      status: "paid",
      paymentTier: args.paymentTier,
      paymentAmountCents: args.paymentAmountCents,
      stripeSessionId: args.stripeSessionId,
      stripePaymentId: args.stripePaymentId,
      paidAt: Date.now(),
    });
  },
});

// =============================================================================
// Internal functions — for server-to-server use by actions
// =============================================================================

// Get project without auth check (for internal actions)
export const getProjectInternal = internalQuery({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.projectId);
  },
});

// Update project fields without auth check (for internal actions)
export const updateProjectInternal = internalMutation({
  args: {
    projectId: v.id("projects"),
    updates: v.any(),
  },
  handler: async (ctx, args) => {
    const patch: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(args.updates as Record<string, unknown>)) {
      if (value !== undefined) {
        patch[key] = value;
      }
    }
    if (Object.keys(patch).length > 0) {
      await ctx.db.patch(args.projectId, patch);
    }
  },
});

// =============================================================================
// Profile queries & mutations
// =============================================================================

// Get profile for the authenticated user
export const getProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
  },
});

// Update profile name
export const updateProfile = mutation({
  args: {
    fullName: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!profile) throw new Error("Profile not found");

    await ctx.db.patch(profile._id, { fullName: args.fullName });
  },
});

// Internal: cascade delete all user data
export const deleteAllUserDataInternal = internalMutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    // Get all projects for this user
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    for (const project of projects) {
      // Delete photos + storage files
      const photos = await ctx.db
        .query("projectPhotos")
        .withIndex("by_projectId", (q) => q.eq("projectId", project._id))
        .collect();
      for (const photo of photos) {
        try {
          await ctx.storage.delete(photo.storageId as Id<"_storage">);
        } catch {
          // Storage file may already be deleted
        }
        await ctx.db.delete(photo._id);
      }

      // Delete scopes
      const scopes = await ctx.db
        .query("scopes")
        .withIndex("by_projectId", (q) => q.eq("projectId", project._id))
        .collect();
      for (const scope of scopes) {
        await ctx.db.delete(scope._id);
      }

      // Delete sequencing plans
      const plans = await ctx.db
        .query("sequencingPlans")
        .withIndex("by_projectId", (q) => q.eq("projectId", project._id))
        .collect();
      for (const plan of plans) {
        await ctx.db.delete(plan._id);
      }

      // Delete coordination checklists
      const checklists = await ctx.db
        .query("coordinationChecklists")
        .withIndex("by_projectId", (q) => q.eq("projectId", project._id))
        .collect();
      for (const checklist of checklists) {
        await ctx.db.delete(checklist._id);
      }

      // Delete documents + storage files
      const docs = await ctx.db
        .query("documents")
        .withIndex("by_projectId", (q) => q.eq("projectId", project._id))
        .collect();
      for (const doc of docs) {
        try {
          await ctx.storage.delete(doc.storageId as Id<"_storage">);
        } catch {
          // Storage file may already be deleted
        }
        await ctx.db.delete(doc._id);
      }

      // Delete the project itself
      await ctx.db.delete(project._id);
    }

    // Delete the profile
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
    if (profile) {
      await ctx.db.delete(profile._id);
    }
  },
});
