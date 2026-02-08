import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Save a document record (after PDF uploaded to storage)
export const saveDocument = mutation({
  args: {
    projectId: v.id("projects"),
    documentType: v.string(),
    storageId: v.string(),
    filename: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const project = await ctx.db.get(args.projectId);
    if (!project || project.userId !== userId) {
      throw new Error("Not authorized");
    }

    return await ctx.db.insert("documents", {
      projectId: args.projectId,
      documentType: args.documentType,
      storageId: args.storageId,
      filename: args.filename,
    });
  },
});

// Get documents for a project
export const getDocuments = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const project = await ctx.db.get(args.projectId);
    if (!project || project.userId !== userId) return [];

    return await ctx.db
      .query("documents")
      .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
      .collect();
  },
});
